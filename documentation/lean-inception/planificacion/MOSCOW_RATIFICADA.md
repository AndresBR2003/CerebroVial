# MoSCoW Ratificada — CerebroVial

> Generado: 2026-05-18 por Claude Code
> Versión: v1
> Inputs:
> - [`BACKLOG_OVERVIEW.md`](../BACKLOG_OVERVIEW.md) (2026-05-16)
> - [`HU_BLOQUE_A.md`](../2-backlog/HU_BLOQUE_A.md) a [`HU_BLOQUE_F.md`](../2-backlog/HU_BLOQUE_F.md), [`HU_MVP2.md`](../2-backlog/HU_MVP2.md)
> - [`TAREAS_TECNICAS_HABILITADORAS.md`](../2-backlog/TAREAS_TECNICAS_HABILITADORAS.md)
> - [`RF_RNF_LITE.md`](../3-requisitos/RF_RNF_LITE.md) (prioridades sugeridas declaradas en el normativo)
> - [`AUDITORIA_HU_CODIGO.md`](AUDITORIA_HU_CODIGO.md) v1 (Fase 4.1)
> - Protocolo: [`CEREMONIA_MOSCOW.md`](CEREMONIA_MOSCOW.md)
> Salida prescrita por: [`PROMPT_ARRANQUE_CLAUDE_CODE_v2.md`](PROMPT_ARRANQUE_CLAUDE_CODE_v2.md) Fase 4.2.

## 1. Resumen ejecutivo

**107 elementos del backlog clasificados** (21 HUs + 11 TTH + 22 RF + 53 RNF).

| Categoría | HUs | TTH | RF | RNF | Total |
|---|---|---|---|---|---|
| Must | 16 | 9 | 17 | 33 | 75 |
| Should | 1 | 1 | 1 | 8 | 11 |
| Could | 4 | 0 | 4 | 11 | 19 |
| Won't | 0 | 1 | 0 | 1 | 2 |
| **Total** | **21** | **11** | **22** | **53** | **107** |

**Ajustes respecto a prioridades sugeridas:** 1 (TTH-11, sin sugerida explícita en backlog; clasificada Should aquí). Las 106 restantes se ratifican sin cambio. **Las sugerencias del documento RF/RNF y del backlog fueron buen anclaje argumentado** (>99% de ratificación directa).

**Pendientes de decisión:** 0.

**Implicación para Fase 4.3 (Planning Poker) y 4.4 (Distribución sprints):** sprint 4 debe cargar los 75 Must (~70% del backlog) + evaluar Should/Could según SP disponible. La auditoría reveló cobertura efectiva ≈ 25%, lo que significa que el sprint 4 debe cubrir aproximadamente 75% del trabajo Must — eventualmente disparando el loop MoSCoW⇄Planning Poker del Paso 7 de [`PROTOCOLO_DISTRIBUCION_SPRINTS.md`](PROTOCOLO_DISTRIBUCION_SPRINTS.md).

---

## 2. Historias de Usuario (21)

| Código | Título corto | Sugerida (MVP) | Ratificada | Justificación (si difiere) |
|---|---|---|---|---|
| HU-01 | Acceso diferenciado por rol | MVP1 | Must | — |
| HU-02 | Monitoreo del estado actual | MVP1 | Must | — |
| HU-03 | Predicción de congestión | MVP1 | Must | — |
| HU-04 | Vista combinada estado + predicción | MVP1 | Must | — |
| HU-05 | Estrategia de control activa | MVP1 | Must | — |
| HU-06 | Explicación razón de selección | MVP1 | Must | — |
| HU-07 | Notificación cambios estrategia | MVP1 | Must | — |
| HU-08 | Historial decisiones del motor | MVP1 | Must | — |
| HU-09 | Notas e incidencias del turno | MVP2 | Should | Ratifica RF-021 Should (MVP2). Reduce fricción operativa del Operador sin habilitar capacidad nueva (§2.2). |
| HU-10 | Alerta transversal estado operativo | MVP1 | Must | — |
| HU-11 | Vista estado componentes (Operador) | MVP1 | Must | — |
| HU-12 | Explicación modo degradado | MVP1 | Must | — |
| HU-13 | Salud técnica componentes (Admin) | MVP1 | Must | — |
| HU-14 | Métricas modelo predictivo | MVP1 | Must | — |
| HU-15 | Configuración parámetros operativos | MVP1 | Must | — |
| HU-16 | KPIs Gerente periodo seleccionable | MVP1 | Must | — |
| HU-17 | Comparativa entre periodos (Gerente) | MVP1 | Must | — |
| HU-18 | Drill-down de periodo (Gerente) | MVP2 | Could | Ratifica RF-016 Could. Profundiza análisis comparativo de HU-16/17 (§2.3). |
| HU-19 | Exportación PDF/Excel | MVP2 | Could | Ratifica RF-017 Could. Facilita difusión externa de KPIs ya cubiertos (§2.2 → §2.3). |
| HU-20 | Comparativa modelo principal vs respaldo | MVP2 | Could | Ratifica RF-013 Could. Refuerza justificación del modelo principal; sistema opera con principal solo (§2.2). |
| HU-21 | Escalamiento incidentes Op→Admin | MVP2 | Could | Ratifica RF-022 Could. Flujo comunicacional MVP2; alternativa por canales externos preserva continuidad operativa (§2.3). |

**Subtotal HUs:** 16 Must + 1 Should + 4 Could + 0 Won't = 21.

### Verificación de consistencia §5 (HUs)

- ✓ Cada HU Must (HU-01 a HU-08, HU-10 a HU-17) tiene al menos una TTH habilitadora; todas las TTH habilitadoras correspondientes son Must o Should (ver §3).
- ✓ Ninguna HU Won't (no hay).
- ✓ No hay HU Must que dependa exclusivamente de TTH Could/Won't.
- ✓ HU-09/18/19/20/21 (Should/Could) no contienen CAs referenciados desde HUs Must.

---

## 3. Tareas Técnicas Habilitadoras (11)

| Código | Título corto | Sugerida | Ratificada | Justificación (si difiere) |
|---|---|---|---|---|
| TTH-01 | Autenticación JWT + bcrypt | Must (implícita) | Must | Habilita HU-01 + toda HU autenticada (§3.2 regla operacional). |
| TTH-02 | Docker Compose multi-servicio | Must (implícita) | Must | Habilita todo (sin entorno no hay demo). |
| TTH-03 | CI con cobertura completa | Must (implícita) | Must | Prerrequisito de calidad asegurada de toda HU Done. |
| TTH-04 | Lógica fallback en cascada | Must (implícita) | Must | Habilita HU-10/11/12/13 + cobertura técnica de HU-14/HU-21. |
| TTH-05 | Tiempos preconfigurados degradado 3 | Must (implícita) | Must | Prerrequisito del Nivel 3 de TTH-04; sin ella el nivel 3 no es operativo. |
| TTH-06 | Capa de DTOs transversal | Won't (declarada) | Won't | Trabajos Futuros explícitos (DHU-014). No bloquea ninguna HU MVP1. |
| TTH-07 | Integración SUMO | Must (implícita) | Must | Provee dataset entrenamiento TTH-09, entorno validación TTH-10, KPIs comparativos de la tesis. |
| TTH-08 | Visión computacional | Must (implícita) | Must | Componente arquetípico declarado en D-007. Habilita Nivel 1 cascada TTH-04 contractualmente. |
| TTH-09 | Modelo GRU servido vía API | Must (implícita) | Must | Habilita HU-03/04/14. Modelo principal del sistema. |
| TTH-10 | Motor adaptativo | Must (implícita) | Must | Aporte de ingeniería central. Habilita HU-05/06/07/08/15. |
| TTH-11 | Spike hiperparámetros temporales | Sin sugerida explícita | Should | **Único delta de TTH.** TTH-09 puede arrancar con provisionales (`Δt=60s`, `lookback=30`, `horizonte=60`) sin TTH-11 cerrada según su propia nota técnica. La dependencia funcional es soft, por lo que no califica Must según §3.2. Es sustento documental académico; se cierra antes del cierre de MVP1 para defensa formal. |

**Subtotal TTH:** 9 Must + 1 Should + 0 Could + 1 Won't = 11.

### Verificación de consistencia §5 (TTH)

- ✓ TTH-01 a TTH-05 y TTH-07 a TTH-10 (Must) son consistentes con que las HUs que habilitan son Must.
- ✓ TTH-06 Won't no es referenciada por ninguna HU MVP1 (declarado en spec).
- ✓ TTH-11 Should: única TTH que habilita TTH-09 (no HUs directamente). TTH-09 Must puede arrancar con provisionales por nota técnica explícita; no requiere TTH-11 cerrada como precondición funcional. **Si la defensa académica exige sustentación bibliográfica formal, TTH-11 asciende a Must — flag para sesión metodológica.**

---

## 4. Requisitos Funcionales (22)

| Código | Título corto | Sugerida | Ratificada | Justificación (si difiere) |
|---|---|---|---|---|
| RF-001 | Autenticación al sistema | Must | Must | — |
| RF-002 | Control de acceso por rol | Must | Must | — |
| RF-003 | Estado del tráfico por acceso | Must | Must | — |
| RF-004 | Predicción de congestión por acceso | Must | Must | — |
| RF-005 | Vista combinada estado + predicción | Must | Must | — |
| RF-006 | Estrategia de control activa | Must | Must | — |
| RF-007 | Explicación razón de selección | Must | Must | — |
| RF-008 | Notificación temporal cambios | Must | Must | — |
| RF-009 | Consulta histórica decisiones motor | Must | Must | — |
| RF-010 | Salud técnica componentes (Admin) | Must | Must | — |
| RF-011 | Configuración parámetros operativos | Must | Must | — |
| RF-012 | Métricas modelo predictivo | Must | Must | — |
| RF-013 | Comparativa modelos principal vs respaldo | Could (MVP2) | Could | — |
| RF-014 | KPIs Gerente periodo seleccionable | Must | Must | — |
| RF-015 | Comparativa entre periodos | Must | Must | — |
| RF-016 | Drill-down periodo específico | Could (MVP2) | Could | — |
| RF-017 | Exportación PDF/Excel | Could (MVP2) | Could | — |
| RF-018 | Vista simplificada componentes (Operador) | Must | Must | — |
| RF-019 | Alerta transversal estado operativo | Must | Must | — |
| RF-020 | Explicación modo degradado | Must | Must | — |
| RF-021 | Notas e incidencias del turno | Should (MVP2) | Should | — |
| RF-022 | Escalamiento incidentes Op→Admin | Could (MVP2) | Could | — |

**Subtotal RF:** 17 Must + 1 Should + 4 Could + 0 Won't = 22. **Ratificación 100% sin ajustes.**

### Verificación de consistencia §5 (RF)

- ✓ Cada RF Must tiene al menos una HU origen Must (mapeo trivial: RF-001↔HU-01, RF-002↔HU-01, RF-003↔HU-02, ..., RF-020↔HU-12).
- ✓ RF-021 Should ↔ HU-09 Should — coherente.
- ✓ RF-013/016/017/022 Could ↔ HU-20/18/19/21 Could — coherente.

---

## 5. Requisitos No Funcionales (53)

### 5.1 Functional Suitability (6)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-FUN-01 | Manejabilidad de datos faltantes | Must/Should | Must (MVP1) / Should (MVP2) | Ratifica mixto: Must para HUs Must, Should para componentes MVP2. |
| RNF-FUN-02 | Calidad modelo predictivo (≥80% accuracy) | Should | Should | — |
| RNF-FUN-03 | Comparabilidad rigurosa modelos | Could | Could | — |
| RNF-FUN-04 | Cobertura catálogos plantillas | Must | Must | — |
| RNF-FUN-05 | Identificabilidad reportes exportados | Could | Could | — |
| RNF-FUN-06 | Independencia dimensiones incidente | Could | Could | — |

### 5.2 Performance Efficiency (13)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-PERF-01 | Actualización ≤5s vistas operativas | Must | Must | — |
| RNF-PERF-02 | Apertura vistas consulta Operador ≤2s | Should/Could | Should/Could | Ratifica mixto: Should para Operador MVP1, Could para HU-09 MVP2. |
| RNF-PERF-03 | Apertura vista configuración Admin ≤2s | Should | Should | — |
| RNF-PERF-04 | Apertura vistas Gerente ≤3s | Must | Must | — |
| RNF-PERF-05 | Recálculo Gerente al cambiar periodo ≤10s | Must | Must | — |
| RNF-PERF-06 | Drill-down ≤5-15s + zoom ≤3s | Could | Could | — |
| RNF-PERF-07 | Generación reportes ≤15-60s PDF, ≤10-30s Excel | Could | Could | — |
| RNF-PERF-08 | Efecto modificaciones config ≤30s sin redeploy | Must | Must | — |
| RNF-PERF-09 | Latencia cálculo métricas modelo ≤30s | Should | Should | — |
| RNF-PERF-10 | Latencia indicador incidentes pendientes ≤30s | Could | Could | — |
| RNF-PERF-11 | Granularidad persistencia histórico 30s | Must | Must | — |
| RNF-PERF-12 | Paralelización cálculo multi-fuente | Must | Must | — |
| RNF-PERF-13 | No degradación por modelo respaldo paralelo | Could | Could | — |

### 5.3 Compatibility (2)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-COM-01 | Co-existencia monolito modular | Must | Must | — |
| RNF-COM-02 | Interoperabilidad escala 0-5 jam level | Should | Should | — |

### 5.4 Interaction Capability (7)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-INT-01 | Usabilidad operativa Operador | Must | Must | — |
| RNF-INT-02 | Accesibilidad WCAG 2.1 AA | Should | Should | — |
| RNF-INT-03 | Autoexplicación mediante tooltips | Must/Could | Must (MVP1) / Could (MVP2) | Ratifica mixto. |
| RNF-INT-04 | Coherencia visual y textual entre vistas | Must | Must | — |
| RNF-INT-05 | Comprensibilidad explicaciones textuales | Must | Must | — |
| RNF-INT-06 | Presentación visual reportes impresos | Could | Could | — |
| RNF-INT-07 | Ocultación rutas no accesibles al rol | Must | Must | — |

### 5.5 Reliability (9)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-REL-01 | Robustez ante interrupción de fuente (DHU-005) | Must | Must | — |
| RNF-REL-02 | Disponibilidad transversal alerta estado operativo | Must | Must | — |
| RNF-REL-03 | Continuidad operativa frente fallos auxiliares | Must | Must | — |
| RNF-REL-04 | Durabilidad registros append-only | Must | Must | — |
| RNF-REL-05 | Resiliencia persistencia ante fallo escritura | Should | Should | — |
| RNF-REL-06 | Tolerancia fallos componente generación reportes | Could | Could | — |
| RNF-REL-07 | Manejabilidad concurrencia modificaciones (last-write-wins) | Must | Must | — |
| RNF-REL-08 | Atomicidad transiciones estado operativo | Must | Must | — |
| RNF-REL-09 | Comportamiento conservador fallo mecanismo salud | Must | Must | — |

### 5.6 Security (7)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-SEC-01 | Inmutabilidad registros append-only | Must | Must | — |
| RNF-SEC-02 | Autenticación bcrypt + JWT firmado | Must | Must | — |
| RNF-SEC-03 | Control de acceso por rol (HTTP 403) | Must | Must | — |
| RNF-SEC-04 | No filtración info en HTTP 403 | Must | Must | — |
| RNF-SEC-05 | Segregación presentación con mismo origen | Must | Must | — |
| RNF-SEC-06 | Validación dual frontend + backend | Must/Should | Must (MVP1) / Should (MVP2) | Ratifica mixto. |
| RNF-SEC-07 | No persistencia reportes en servidor | Could | Could | — |

### 5.7 Maintainability (3)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-MNT-01 | Extensibilidad catálogos plantillas | Should | Should | — |
| RNF-MNT-02 | Parametrización sin redeploy | Must | Must | — |
| RNF-MNT-03 | Tolerancia configurable indicador comparativo | Could | Could | — |

### 5.8 Flexibility (3)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-FLX-01 | Portabilidad despliegue local contenedores | Must | Must | — |
| RNF-FLX-02 | Reemplazabilidad modelo predictivo | Must | Must | — |
| RNF-FLX-03 | Escalabilidad arquitectónica (red urbana) | Won't | Won't | Trabajo futuro declarado (STGNN, F37). |

### 5.9 Safety (3)

| Código | Título corto | Sugerida | Ratificada | Justificación |
|---|---|---|---|---|
| RNF-SAF-01 | Fail-safe ante fallo control adaptativo | Must | Must | — |
| RNF-SAF-02 | Cumplimiento Manual MTC peruano | Must | Must | — |
| RNF-SAF-03 | Valores por defecto seguros desde 1er arranque | Must | Must | — |

**Subtotal RNF:** 33 Must + 8 Should + 11 Could + 1 Won't = 53. **Ratificación 100% sin ajustes.** (Los elementos con prioridad mixta sugerida — RNF-FUN-01, RNF-PERF-02, RNF-INT-03, RNF-SEC-06 — se contabilizan según su prioridad dominante: la mayor, asumiendo que el MVP1 entrega la cobertura más exigente.)

### Verificación de consistencia §5 (RNF)

- ✓ Cada RNF Must tiene al menos una HU/TTH origen al menos Should.
- ✓ RNF-FUN-03/RNF-PERF-13/RNF-MNT-03 Could ↔ HU-20 Could — coherente.
- ✓ RNF-PERF-06 Could ↔ HU-18 Could — coherente.
- ✓ RNF-PERF-07/RNF-INT-06/RNF-REL-06/RNF-SEC-07/RNF-FUN-05 Could ↔ HU-19 Could — coherente.
- ✓ RNF-PERF-10/RNF-FUN-06 Could ↔ HU-21 Could — coherente.
- ✓ RNF-REL-05 Should ↔ HU-09 Should (resiliencia escritura aplicable también a otras HUs) — coherente.
- ✓ RNF-FLX-03 Won't ↔ no HU; trabajo futuro declarado externamente.

---

## 6. Alcance declarado del MVP1

### 6.1 HUs Must (alcance mínimo no negociable del sprint 4)

16 HUs operativas: **HU-01, HU-02, HU-03, HU-04, HU-05, HU-06, HU-07, HU-08, HU-10, HU-11, HU-12, HU-13, HU-14, HU-15, HU-16, HU-17.**

### 6.2 HUs Should (alcance objetivo del sprint 4 si SP lo permite)

1 HU: **HU-09** (notas e incidencias del turno del Operador).

### 6.3 HUs Could (alcance opcional MVP2 ampliado)

4 HUs: **HU-18** (drill-down Gerente), **HU-19** (exportación PDF/Excel), **HU-20** (comparativa modelos), **HU-21** (escalamiento incidentes).

### 6.4 HUs Won't (Trabajos Futuros declarados)

0 HUs operativas.

### 6.5 TTH Must (sprint 4 obligatorio)

9 TTH: **TTH-01, TTH-02, TTH-03, TTH-04, TTH-05, TTH-07, TTH-08, TTH-09, TTH-10.**

### 6.6 TTH Should (sprint 4 si SP permite)

1 TTH: **TTH-11** (spike documental de hiperparámetros temporales — TTH-09 puede declarar Done con provisionales si TTH-11 no cierra en sprint, según su propia nota técnica).

### 6.7 TTH Won't (Trabajos Futuros)

1 TTH: **TTH-06** (capa DTOs transversal, declarada Trabajos Futuros por DHU-014).

---

## 7. Deltas respecto a las prioridades sugeridas

### 7.1 Tabla de elementos ajustados

| Código | Sugerida | Ratificada | Cambio | Motivo |
|---|---|---|---|---|
| TTH-11 | Sin sugerida explícita en backlog | Should | Asignación inicial | Spike documental con dependencia soft a TTH-09 (TTH-09 puede arrancar con provisionales). Ascenderá a Must si la defensa académica exige sustentación bibliográfica formal antes del cierre del MVP1 (decisión metodológica abierta). |

**Total ajustes:** 1 sobre 107 elementos (0.9%).

### 7.2 Resumen estadístico

| Tipo de movimiento | Cuenta |
|---|---|
| Ratificados sin ajuste | 106 |
| Ajustados al alza (Should→Must, Could→Should/Must, Won't→cualquiera) | 0 |
| Ajustados a la baja (Must→Should/Could/Won't, Should→Could/Won't) | 0 |
| Sin sugerida previa, asignados aquí | 1 (TTH-11) |

### 7.3 Conclusión sobre la calidad de las prioridades sugeridas

Las prioridades sugeridas declaradas en [`RF_RNF_LITE.md`](../3-requisitos/RF_RNF_LITE.md) y heredadas implícitamente en HUs y TTH (vía clasificación MVP1/MVP2 + heurística del Anexo §10 del protocolo) **fueron buen anclaje argumentado**: ratificación de 106 de 107 elementos sin ajuste (99.1%). El único elemento que requirió clasificación explícita aquí (TTH-11) no estaba listado en el Anexo del protocolo precisamente porque su tratamiento es matiz metodológico, no decisión normativa estándar.

---

## 8. Implicaciones para Fase 4.3 (Planning Poker) y 4.4 (Distribución de sprints)

### 8.1 Carga sobre el sprint 4

**Must operativos pendientes** (según [`AUDITORIA_HU_CODIGO.md`](AUDITORIA_HU_CODIGO.md) sección 1):

- TTH Must: 9 elementos. **Completos: 1 (TTH-02). Parciales: 2 (TTH-03, TTH-08, TTH-10). No iniciados: 6 (TTH-01, TTH-04, TTH-05, TTH-07, TTH-09).**
- HU Must: 16 elementos. **Completos: 0. Parciales: 2 (HU-05, HU-06). No iniciados: 14.**

Total Must con trabajo pendiente: **22 elementos** sobre 25 Must (88%).

Esta brecha estructural significa que el sprint 4 **necesariamente disparará el loop MoSCoW⇄Planning Poker del Paso 7 de [`PROTOCOLO_DISTRIBUCION_SPRINTS.md`](PROTOCOLO_DISTRIBUCION_SPRINTS.md)** una vez que Planning Poker estime el SP requerido para cerrar los Must.

### 8.2 Candidatos previsibles a descenso si el loop dispara

Si Planning Poker revela que la suma de SP Must excede la capacidad estimada del sprint 4 incluso después de redistribuciones, los candidatos naturales a bajar de Must a Should son:

- **TTH-07 (SUMO)** — su valor primario es validación cuantitativa de la tesis (KPIs comparativos). Puede declararse Should si la defensa académica acepta validación cualitativa o simulación reducida.
- **HU-13/14** (Admin profundidad técnica) — su valor es diagnóstico y evaluación del modelo. Pueden declararse Should si HU-11 (Operador, vista simplificada) cubre la mínima visibilidad operativa.
- **RF-013/HU-20** ya están Could — no se pueden bajar más sin Won't.

Estos ajustes solo se materializan tras Planning Poker, no en esta ratificación.

### 8.3 Won't candidatos si el loop no converge

Si después de 3 iteraciones MoSCoW⇄Planning Poker el alcance Must sigue excediendo la capacidad del sprint 4, las opciones son las del Paso 7 de [`PROTOCOLO_DISTRIBUCION_SPRINTS.md`](PROTOCOLO_DISTRIBUCION_SPRINTS.md): aceptar mayor desviación del equilibrio del sprint 4 (+30/+35% sobre promedio) o declarar HUs Should-críticas como Trabajos Futuros (escalando HU-09 a Won't, eventualmente TTH-11 a Won't, eventualmente HU-13 o HU-14 a Won't).
