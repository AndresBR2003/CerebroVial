# DECISIONS — CerebroVial

> Registro de decisiones técnicas y de proyecto. Formato ADR ligero. Las decisiones cerradas afectan el código y la documentación; las pendientes (`D-PENDING-*`) son cuestiones abiertas que requieren resolución antes de avanzar a las fases que dependen de ellas.

## Índice

| ID | Estado | Fecha | Título |
|---|---|---|---|
| D-001 | Cerrada | 2026-04-30 | Arquitectura: monolito modular |
| D-002 | Cerrada | 2026-04-30 | Modelo predictivo: RNN |
| D-003 | Cerrada | 2026-04-30 | Deploy: Docker local |
| D-004 | Cerrada | 2026-04-30 | Pi física: demostración conceptual, no entrega |
| D-005 | Cerrada | 2026-04-30 | Números de tesis: actualizar tras validación real |
| D-006 | Cerrada | 2026-05-03 | Visión persiste agregados a BD via tabla nueva `vision_aggregates` |
| D-007 | Cerrada | 2026-05-03 | `VisionTrackDB` y `VisionFlowDB` quedan modeladas pero vacías |
| D-008 | Cerrada | 2026-05-03 | GRU se entrena con dataset sintético calibrado contra Waze + METR-LA |
| D-009 | Cerrada | 2026-05-04 | Mecanismo de incidentes en F2 para asegurar 5 niveles de congestión |
| D-010 | Pendiente | 2026-05-04 | Cap de class_weights a 30× en F3 |
| D-011 | Cerrada | 2026-05-04 | `scaler_params.json` se trackea junto al modelo `.pt` en F3 |
| D-PENDING-001 | Abierta | — | Modelo: reutilizar `time_then_space.py` o GRU desde cero |

---

## D-001 — Arquitectura: monolito modular
**Fecha:** 2026-04-30 · **Estado:** Cerrada

**Decisión:** El sistema se organiza como un **monolito modular**, no como microservicios. Las carpetas `core_management_api/`, `edge_device/`, `ia_prediction_service/` se entienden como módulos del mismo sistema. Sprint 1 consolida la base común en `shared/` instalable como paquete pip local.

**Justificación:** El refactor del commit `7b26edab` separó el código en carpetas que sugieren microservicios, pero (a) los `common/` de `core_management_api` y `edge_device` son byte-idénticos, (b) no existe API real entre ellos, (c) `ia_prediction_service` es pipeline ML offline, no servicio HTTP. Mantener tres servicios desplegables independientes agregaría complejidad sin valor en un proyecto de tesis con un equipo de dos.

**Impacto:** El docker-compose final tiene `db`, `core_management_api` (incluye prediction + control + vision-consumer), `edge_device` y `frontend_ui`. `ia_prediction_service` queda como herramienta de entrenamiento offline.

---

## D-002 — Modelo predictivo: RNN
**Fecha:** 2026-04-30 · **Estado:** Cerrada

**Decisión:** El modelo predictivo del sistema es una **RNN** (alineado al documento de tesis). El `RandomForestPredictor` actual queda como fallback temporal con flag de configuración hasta que la RNN esté servida.

**Justificación:** El documento de tesis declara una arquitectura RNN. Mantener el RandomForest como fallback evita que una falla de carga del modelo neuronal rompa el endpoint de predicción.

**Impacto:** F3 del TODO implementa la RNN. Ver `D-PENDING-001` para la sub-decisión de cómo materializarla.

---

## D-003 — Deploy: Docker local
**Fecha:** 2026-04-30 · **Estado:** Cerrada

**Decisión:** El sistema se despliega localmente con `docker compose up`. No se usa Azure ni ningún cloud por ahora.

**Justificación:** El alcance de la tesis no incluye productivización. Los recursos disponibles (tiempo + cuenta cloud + presupuesto) no justifican el deploy en Azure. La "arquitectura desplegable en Pi/cloud" se demuestra arquitectónicamente y se documenta como plan de productivización en el README final.

**Impacto:** El README de quickstart asume `docker compose up` + `npm run dev`. El Bloque K (defensa) prueba el sistema en máquina limpia, no en cloud.

---

## D-004 — Pi física: demostración conceptual, no entrega
**Fecha:** 2026-04-30 · **Estado:** Cerrada · **Sujeta a confirmación con asesor (A2)**

**Decisión:** No se entrega una Raspberry Pi física en la defensa. Se demuestra que la arquitectura **es desplegable** en Pi (separación de `edge_device` con dependencias mínimas, contenerización separada, comunicación por SSE/HTTP) sin entregar el hardware.

**Justificación:** El proyecto se evalúa por la arquitectura predictiva y la integridad del sistema, no por hardware. La demostración conceptual cubre el espíritu del IoT del documento sin agregar riesgo de hardware roto en la defensa.

**Impacto:** El demo final corre todo en una laptop. El documento de tesis y el video explican qué módulos correrían en Pi (edge_device) y cuáles en servidor central (core_management_api + frontend + db).

**Pendiente:** Confirmar con asesor en llamada A2 del TODO.

---

## D-005 — Números de tesis: actualizar tras validación real
**Fecha:** 2026-04-30 · **Estado:** Cerrada · **Sujeta a confirmación con asesor (A2)**

**Decisión:** Los números declarados en el documento de tesis (88.2% accuracy de detección, 81.3% accuracy del predictor, latencia <2s) se **actualizan a los valores reales** medidos en el Bloque J de validación. Si la realidad es peor, se reporta la realidad.

**Justificación:** Integridad académica. Reportar números que no se pueden reproducir en el demo es riesgo alto en preguntas de defensa. La tesis se defiende mejor con honestidad sobre limitaciones que con marketing inflado.

**Impacto:** Bloque J4 del TODO marca explícitamente la actualización del documento. Si los números reales son peores, el README documenta limitaciones del demo (datos sintéticos, validación parcial, etc.).

**Pendiente:** Confirmar con asesor en llamada A2 del TODO.

---

## D-006 — Visión persiste agregados a BD via tabla nueva `vision_aggregates`

**Fecha:** 2026-05-03 · **Estado:** Cerrada · **Tarea:** E18-E21
**Detalle completo:** ver [DATA_MODEL_AUDIT.md](DATA_MODEL_AUDIT.md)

Crear `VisionAggregateDB` alineado con el schema de `csv_repository.py`.
No refactorizar el pipeline de visión para mapear a `VisionTrackDB`/`VisionFlowDB`.

---

## D-007 — `VisionTrackDB` y `VisionFlowDB` quedan modeladas pero vacías

**Fecha:** 2026-05-03 · **Estado:** Cerrada · **Tarea:** E2
**Detalle completo:** ver [DATA_MODEL_AUDIT.md](DATA_MODEL_AUDIT.md)

Las tablas `vision_tracks` y `vision_flows` se crean en la migración E2 pero
permanecen vacías en el alcance actual. Documentar en README para defensa.

---

## D-008 — GRU se entrena con dataset sintético calibrado contra Waze + METR-LA

**Fecha:** 2026-05-03 · **Estado:** Cerrada · **Tarea:** F2
**Detalle completo:** ver [DATA_MODEL_AUDIT.md](DATA_MODEL_AUDIT.md)

Sin acceso a API real de Waze ni datos históricos de Miraflores, el dataset
sintético calibrado contra distribuciones Waze + METR-LA es académicamente
defendible. `metr_la.h5` se mantiene en LFS como insumo de calibración.

---

## D-PENDING-001 — Modelo: reutilizar `time_then_space.py` o GRU desde cero
**Estado:** Abierta · **Bloquea:** Fase 3a (Bloque F del TODO)

**Contexto:** El archivo [ia_prediction_service/src/models/time_then_space.py](../../ia_prediction_service/src/models/time_then_space.py) implementa una arquitectura **Time-then-Space**: encoder lineal + RNN(cell='gru') temporal + DiffConv espacial + MLPDecoder. La celda recurrente **ya es GRU por defecto** (línea 27). Existen 5 checkpoints entrenados en `ia_prediction_service/notebooks/logs/`, el mejor en `epoch=79-step=30800.ckpt`.

**Opciones:**

- **Opción A — GRU desde cero (lo que dice el TODO F3 hoy):** crear `ia_prediction_service/src/models/gru_model.py` nuevo, descartar `time_then_space.py` y los checkpoints. Más limpio conceptualmente, pero tira código entrenado y agrega días de implementación.
- **Opción B — Reutilizar simplificando:** quitar `DiffConv` del `time_then_space.py` (queda RNN(GRU) + encoder + decoder), reusar el pipeline PyTorch Lightning + tsl. Posiblemente reusar checkpoints si el dataset de Miraflores es compatible. Menos riesgo de no llegar al lunes 11. Documentalmente sigue siendo "RNN" según D-002.
- **Opción C — Caja negra:** mantener `time_then_space.py` tal cual y servirlo. Nominalmente es una RNN espacio-temporal, lo cual es consistente con D-002 si se interpreta "RNN" en sentido amplio.

**Bloqueante:** decisión a tomar antes de iniciar el Bloque F del TODO. Probablemente con asesor en A2.

**Cuando se cierre:** mover esta entrada a sección cerrada con ID `D-012` (o el siguiente disponible, ya que D-006..D-011 están tomados), agregar fecha y justificación.

---

## D-009 — Mecanismo de incidentes en F2 para asegurar 5 niveles de congestión

**Fecha:** 2026-05-04 · **Estado:** Cerrada · **Tarea:** F2

**Decisión:** El script `generate_synthetic_data.py` aplica con probabilidad
`INCIDENT_PROB = 0.003` por slot un override del ratio AR(1) muestreado de
`U[0.02, 0.30]`, simulando incidentes viales puntuales.

**Justificación:** sin este mecanismo, α=0.939 + `pattern_min=0.632`
(METR-LA es freeway, no urbano) hace que el ratio nunca alcance umbrales
de congestión severa, dejando clases 4-5 vacías y fallando la validación.

**Riesgo en defensa:** clases 4-5 son sintéticas vía incidentes. Mitigación:
documentar explícitamente y ofrecer subir `INCIDENT_PROB` (plan B en
MODEL.md §5.10) si el jurado lo considera insuficiente.

**Impacto:** distribución final con 5 niveles en train/val/test. Ver MODEL.md §5.9.

---

## D-010 — Cap de class_weights a 30× en F3

**Fecha:** 2026-05-04 · **Estado:** Pendiente de aplicar (F3) · **Tarea:** F3

**Decisión:** los pesos inversamente proporcionales a la frecuencia se capean
a `WEIGHT_CAP = 30.0` antes de normalizar para `CrossEntropyLoss`.

**Justificación:** clases 4-5 tienen ~0.14% y ~0.16% de soporte. Sin cap,
los pesos crudos llegarían a ~407× entre clase 1 y clase 4, desestabilizando
el entrenamiento. Cap=30 mantiene los pesos minoritarios ~100× mayores que los
dominantes — suficiente señal para aprender sin inestabilidad numérica.

**Alternativa rechazada:** focal loss. Más robusta teóricamente pero menos
defendible para tesis. Cap es transparente y reproducible.

**Impacto:** MODEL.md §6.2 actualizado con código del cap. F3 lo implementa
al construir el `criterion`.

---

## D-011 — `scaler_params.json` se trackea junto al modelo `.pt` en F3, no en F2

**Fecha:** 2026-05-04 · **Estado:** Cerrada · **Tarea:** F2/F3

**Decisión:** los outputs de F2 (`synthetic_waze_jams.csv`,
`dataset_stats.json`, `scaler_params.json`) NO se trackean en git.
Son reproducibles vía `generate_synthetic_data.py --seed 42`.

En F3, `scaler_params.json` se commiteará en paralelo con
`gru_congestion_v1.pt` (forman un par versionado: el modelo necesita
los mismos parámetros de normalización en serving que en training).

**Justificación:** el CSV (~80 MB) infla el repo sin valor. El scaler
solo tiene sentido commitearlo cuando hay un modelo asociado que lo
necesite en serving.

**Impacto:** `.gitignore` de F2-close cubre los tres outputs. F3 cambia
la regla para `scaler_params.json` (commit explícito junto al `.pt`).
