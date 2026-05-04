# Auditoría del Modelo de Datos

**Fecha:** 2026-05-03
**Autor:** Rasec (con Claude como partner de análisis)
**Contexto:** Auditoría empírica realizada antes de iniciar E2 (primera
migración Alembic). Objetivo: entender qué datos produce el sistema hoy,
qué datos esperan los modelos de BD, y cerrar el gap entre ambos antes
de migrar.

---

## Por qué se hizo esta auditoría

Los 7 modelos ORM en `shared/cerebrovial_shared/database/models.py`
fueron heredados del refactor de microservicios anterior a Fase 0. Nunca
fueron auditados línea por línea, y antes de aplicar la primera
migración (E2) era necesario validar que:

1. Los modelos representan correctamente el dominio (red vial + Waze + visión).
2. El código de la aplicación realmente produce los datos que los modelos esperan.
3. La estructura es consistente con la propuesta de tesis (predicción
   de congestión + control adaptativo).

Sin esta validación, E2 hubiera creado tablas que la aplicación no
sabe llenar, y E5 (seed) hubiera inventado datos para tablas
desconectadas del flujo real.

---

## Modelos auditados

Los 7 modelos están en `shared/cerebrovial_shared/database/models.py`.
Todos heredan de un único `Base` declarativo definido en
`database.py`. Resumen:

| Modelo | Tabla | Propósito | Estado |
|---|---|---|---|
| `GraphNodeDB` | `graph_nodes` | Intersecciones del grafo vial | Diseño OK |
| `GraphEdgeDB` | `graph_edges` | Calles (aristas) entre intersecciones | Diseño OK |
| `CameraDB` | `cameras` | Cámaras de visión con metadata espacial | Diseño OK |
| `WazeJamDB` | `waze_jams` | Snapshots de jams de Waze | Diseño OK |
| `WazeAlertDB` | `waze_alerts` | Eventos puntuales de Waze | Diseño OK |
| `VisionTrackDB` | `vision_tracks` | Trayectorias individuales de vehículos | **No se llena** |
| `VisionFlowDB` | `vision_flows` | Flujos direccionales por arista | **No se llena** |

---

## Hallazgos

### Hallazgo 1 — Gap entre lo que produce visión y lo que esperan los modelos

**Severidad: alta. Impacto: arquitectónico.**

El código actual de `edge_device` usa `csv_repository.py`
(`edge_device/src/vision/infrastructure/persistence/csv_repository.py`)
para persistir los datos de visión. El schema del CSV es:

```
timestamp, camera_id, street_monitored, car_count, bus_count,
truck_count, motorcycle_count, total_vehicles, occupancy_rate,
flow_rate_per_min, avg_speed, avg_density, zone_id, duration_seconds
```

Los modelos `VisionTrackDB` y `VisionFlowDB` esperan datos
completamente distintos:

- `VisionTrackDB` espera **trayectorias individuales por vehículo**
  (un `track_uuid` por auto, entrada/salida del frame, geometría
  LINESTRING de la trayectoria).
- `VisionFlowDB` espera **flujos direccionales por arista**
  (`from_edge_id` / `to_edge_id`, conteo y velocidad media en una
  ventana temporal específica de una intersección).

El CSV produce **agregados por zona y por tipo de vehículo en una
ventana temporal**, sin trayectorias individuales y sin información
de origen/destino en el grafo. Las dos conceptualizaciones son
incompatibles sin un layer de transformación que **no existe**.

**Implicación:** los datos producidos por el sistema de visión hoy
NO son utilizables por los modelos `VisionTrackDB` / `VisionFlowDB`
sin trabajo adicional significativo (mapeo zona→arista, tracking
persistente, calibración pixel→metros).

### Hallazgo 2 — No existe implementación Postgres del repositorio de visión

**Severidad: alta. Impacto: operacional.**

El repositorio abstracto (`edge_device/src/vision/domain/repositories.py`)
define un Protocol `TrafficRepository` con un único método `save(data: TrafficData)`.
Solo existe una implementación: `CSVTrafficRepository`. No hay
`PostgresTrafficRepository`, lo que significa que aunque los modelos
de BD existan, ningún código de la aplicación los llena.

Esto es coherente con el Hallazgo 1: aunque hubiera un repositorio
Postgres, escribiría datos del schema CSV, no del schema BD.

### Hallazgo 3 — Calibración pixel→metros no resuelta

**Severidad: media. Impacto: precisión de datos de visión.**

`VisionTrackDB.avg_speed_px` está en píxeles por segundo. Para
convertir a velocidad real (m/s) se requiere homografía cámara→mundo
por cámara, que no se ve definida en el modelo de datos ni en la
configuración. Si en el futuro se llena `VisionTrackDB`, se necesita
resolver esto antes de que los datos sean comparables entre cámaras
distintas o utilizables por el GRU.

Como el GRU se va a entrenar con datos sintéticos calibrados sobre
distribuciones reales de Waze (ver Hallazgo 6), este problema no
bloquea la tesis pero queda como deuda futura.

### Hallazgo 4 — Cámaras YouTube no son de Miraflores

**Severidad: media. Impacto: alcance del sistema.**

Las cámaras configuradas hoy son streams de YouTube de tráfico de otras
ciudades del mundo, no de Miraflores. La metadata de las cámaras
(`heading`, `fov`, `node_id`) tendrá que ser estimada mirando los
videos cuando se implemente E5 (seed).

Esto es consistente con la naturaleza de la tesis: la arquitectura es
genérica y aplicable a cualquier red vial; Miraflores es el caso de
uso target. La defensa académica no requiere haber operado sobre
datos reales de Miraflores.

### Hallazgo 5 — `speed_limit` no existe en `GraphEdgeDB`

**Severidad: baja. Impacto: cálculo de Level of Service.**

Para clasificar congestión por velocidad relativa al límite (LoS), se
necesita el speed limit por calle. El modelo no lo tiene. Solución
provisoria: derivarlo del `road_type` de Waze (Waze clasifica calles
por tipo y un mapeo `road_type → speed_limit_kmh` es estándar).

No bloquea ninguna fase. Resoluble en F1 cuando se defina
formalmente cómo se calcula congestión.

### Hallazgo 6 — Waze como source of truth para entrenamiento del GRU

**Severidad: positivo. Es un hallazgo, no un problema.**

`WazeJamDB.congestion_level` (entero 1-5) es **literalmente** la
clasificación de congestión que Waze hace internamente, y es
defendible como ground truth para el GRU. Combinado con `speed_mps`,
`delay_seconds`, `jam_length_m` y `road_type`, hay suficiente
información para entrenar un modelo predictivo.

**Implicación estratégica:** el GRU no necesita los datos de visión
para entrenar. Se entrena con dataset sintético calibrado contra
distribuciones reales de Waze. La visión queda como pipeline
operacional separado (procesa cámaras, detecta autos, los muestra
en frontend, opcionalmente persiste agregados a BD), no como source
de features del GRU.

### Hallazgo 7 — METR-LA disponible para calibración de dataset sintético

**Severidad: positivo. Oportunidad.**

El repo ya tiene `metr_la.h5` en LFS (heredado del STGNN). METR-LA
es un dataset público estándar de tráfico vehicular (Los Angeles loop
detectors, ~200 sensores, velocidades cada 5 min). Puede usarse para
calibrar las distribuciones del dataset sintético del GRU (en F2).
Esto refuerza la defensa académica: *"el dataset sintético usa
distribuciones empíricas extraídas de METR-LA, un dataset público
estándar"*.

---

## Decisiones tomadas en esta auditoría

### Decisión D-006 — Visión persiste agregados a BD (tabla nueva)

**Fecha:** 2026-05-03 · **Estado:** Cerrada

**Decisión:** Crear un modelo nuevo `VisionAggregateDB` (o similar)
alineado con el schema que YA produce `csv_repository.py`. Implementar
`PostgresAggregateRepository(TrafficRepository)` que escribe a esta
tabla nueva. Mantener `csv_repository.py` también (puede correrse en
cascada con el Postgres repo).

**Justificación:** persistir los datos de visión a BD es valioso para
el demo de defensa ("los datos efectivamente llegan a la BD") sin
forzar un refactor profundo del pipeline visión que mapee a
`VisionTrackDB` / `VisionFlowDB`. Honesto con respecto a lo que
realmente se puede demostrar.

**Impacto:** nuevas tareas E18-E21 en el TODO. La tabla existente
`VisionFlowDB` queda sin uso por ahora pero se mantiene en el modelo
para futuro trabajo.

### Decisión D-007 — `VisionTrackDB` y `VisionFlowDB` quedan modeladas pero vacías

**Fecha:** 2026-05-03 · **Estado:** Cerrada

**Decisión:** Las tablas `vision_tracks` y `vision_flows` se crean en
la primera migración (E2) pero quedan vacías en el alcance actual de
la tesis. Documentar en el README final del proyecto y en la tesis que
son "modeladas para futuro, no llenadas en alcance actual".

**Justificación:** el gap entre el `csv_repository.py` actual y el
schema esperado por estas tablas requiere refactor del pipeline
visión que no aporta valor a la tesis (el GRU se entrena con Waze
sintético, no con visión). Mantener las tablas modeladas demuestra
que la arquitectura del sistema fue diseñada para integrar visión
en el futuro.

**Riesgo en defensa:** el jurado puede preguntar por qué hay tablas
vacías. Respuesta: están modeladas como parte de la arquitectura
target; el alcance temporal de la tesis prioriza el modelo
predictivo (GRU + Waze) sobre la integración visión↔BD. Documentado
como deuda y plan de productivización.

### Decisión D-008 — GRU se entrena con dataset sintético calibrado contra Waze + METR-LA

**Fecha:** 2026-05-03 · **Estado:** Cerrada

**Decisión:** El dataset de entrenamiento del GRU es sintético,
generado con distribuciones extraídas de:
- Estructura de Waze (rangos de `congestion_level`, `speed_mps`,
  `delay_seconds`, `jam_length_m` por `road_type`).
- Patrones temporales (hora pico AM/PM, días laborables vs fines de
  semana) calibrados contra METR-LA (`metr_la.h5`).

**Justificación:** sin acceso a la API real de Waze ni datos
históricos de Miraflores, el dataset sintético calibrado contra
fuentes públicas estándar es la opción defendible. Se conecta con
`D-005` (números de tesis se actualizan con valores reales tras
validación).

**Impacto:** F2 (generación de dataset sintético) tiene ahora un
plan claro. C9.5 (migrar `metr_la.h5` a download-on-demand)
**no se aplica** — el archivo se mantiene en LFS porque es input
del pipeline de calibración del GRU.

---

## Resumen ejecutivo

**Lo que funciona y lo que no:**

| Componente | Estado |
|---|---|
| Modelos de BD para grafo vial (nodos, aristas) | OK, listos para usar |
| Modelos de BD para Waze (jams, alertas) | OK, listos para usar |
| Modelo de BD para cámaras | OK, listo para usar |
| Modelos de BD para visión (`VisionTrackDB`, `VisionFlowDB`) | Modelados, no se llenan en alcance actual |
| Pipeline de visión (`edge_device`) | Funcional, persiste a CSV |
| Persistencia visión → BD | No existe; trabajo nuevo en E18-E21 |
| GRU entrenado con visión | Fuera de alcance |
| GRU entrenado con Waze sintético + METR-LA | Plan claro para F2 |

**Lo que cambia en Fase 2 a partir de esta auditoría:**

1. E2 (primera migración) crea las 7 tablas existentes, todas. La
   migración es válida, autogenerate detecta los modelos correctamente.
2. Antes de E2 hay que ajustar `env.py` para excluir tablas internas
   de PostGIS (`spatial_ref_sys`, `layer`, `topology`) del autogenerate.
3. Después de E5 (seed) y antes de E16 (verificación end-to-end),
   se intercalan E18-E21 para implementar persistencia visión→BD
   con `VisionAggregateDB`.
4. C9.5 se cierra como "no aplica" — `metr_la.h5` se mantiene.

**Lo que NO cambia:**

- La narrativa de tesis (Waze para macro, visión para micro,
  GRU como motor predictivo, control adaptativo como aplicación).
- El modelo de datos heredado (los 7 modelos están bien diseñados).
- El plan general de fases (PLAN.md).