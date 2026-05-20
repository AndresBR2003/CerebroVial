# Backlog Lite Priorizado — CerebroVial

> Generado: 2026-05-18
> Versión: v1
> Documento de consulta rápida — síntesis de:
> - [`MOSCOW_RATIFICADA.md`](MOSCOW_RATIFICADA.md) (Fase 4.2)
> - [`ESTIMACION_SP.md`](ESTIMACION_SP.md) (Fase 4.3)
> - [`DISTRIBUCION_SPRINTS.md`](DISTRIBUCION_SPRINTS.md) (Fase 4.4)

## 0. Cómo leer este documento

Cada elemento del backlog (HU / TTH / RNF transversal) tiene dos clasificaciones MoSCoW:

- **MoSCoW formal**: la prioridad del backlog ratificada en Fase 4.2. Es la que se mantiene para defensa de tesis y `BACKLOG_OVERVIEW.md`.
- **MoSCoW operacional (sprint 4)**: la prioridad efectiva tras el loop MoSCoW⇄Planning Poker de Fase 4.4. Aquí 17 elementos del backlog descendieron de Must a Should/Could para que la carga del sprint 4 cupiera en ~19 SP de capacidad realista.

Notación:
- `↓` = descenso operacional (Must → Should o Could) durante el loop. Solo refleja el sprint 4; el backlog formal mantiene la prioridad original.
- `(TF)` = Trabajos Futuros — elemento no asignado a ningún sprint planificado.
- **SP total / SP ejec / SP rest** — SP totales del elemento, SP ya ejecutados en sprints 1-3, SP que quedan por hacer.

---

## 1. Resumen ejecutivo

| Métrica | Valor |
|---|---|
| Elementos en el backlog (HUs + TTH + RNF transv.) | 35 |
| SP total backlog (excluye Won't) | 277 |
| SP ejecutado en sprints 1-3 | 30 |
| SP comprometido en sprint 4 | 19 |
| SP restante post-sprint 4 (Trabajos Futuros) | 228 |
| Cobertura efectiva sobre MVP1 formal | ~25% |

**Sprint 4 (19 SP):** TTH-01 (4) + HU-01 (5) + TTH-10 cierre (5) + HU-05 cierre (3) + TTH-03 cierre (2).

---

## 2. Historias de Usuario (21)

| Código | Título | MoSCoW formal | MoSCoW sprint 4 | SP total | SP ejec | SP rest | S1 | S2 | S3 | S4 | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HU-01 | Acceso diferenciado por rol | Must | **Must** | 5 | 0 | 5 | | | | **5** | Sprint 4 |
| HU-02 | Monitoreo estado actual | Must | Should↓ | 8 | 1 | 7 | 1 | | | | TF (7) |
| HU-03 | Predicción de congestión | Must | Should↓ | 5 | 1 | 4 | 1 | | | | TF (4) |
| HU-04 | Vista combinada estado + predicción | Must | Could↓ | 5 | 0 | 5 | | | | | TF |
| HU-05 | Estrategia de control activa | Must | **Must** | 5 | 2 | 3 | | 2 | | **3** | Sprint 4 |
| HU-06 | Explicación razón de selección | Must | Should↓ | 5 | 1 | 4 | | 1 | | | TF (4) |
| HU-07 | Notificación cambios estrategia | Must | Should↓ | 5 | 0 | 5 | | | | | TF |
| HU-08 | Historial decisiones del motor | Must | Should↓ | 8 | 0 | 8 | | | | | TF |
| HU-09 | Notas e incidencias del turno | Should | Should | 3 | 0 | 3 | | | | | TF |
| HU-10 | Alerta transversal estado operativo | Must | Should↓ | 13 | 0 | 13 | | | | | TF |
| HU-11 | Vista estado componentes (Operador) | Must | Should↓ | 5 | 0 | 5 | | | | | TF |
| HU-12 | Explicación modo degradado | Must | Should↓ | 5 | 0 | 5 | | | | | TF |
| HU-13 | Salud técnica componentes (Admin) | Must | Should↓ | 5 | 1 | 4 | 1 | | | | TF (4) |
| HU-14 | Métricas modelo predictivo | Must | Should↓ | 13 | 0 | 13 | | | | | TF |
| HU-15 | Configuración parámetros operativos | Must | Could↓ | 13 | 0 | 13 | | | | | TF |
| HU-16 | KPIs Gerente periodo seleccionable | Must | Should↓ | 13 | 1 | 12 | 1 | | | | TF (12) |
| HU-17 | Comparativa entre periodos (Gerente) | Must | Could↓ | 8 | 0 | 8 | | | | | TF |
| HU-18 | Drill-down de periodo (Gerente) | Could | Could | 13 | 0 | 13 | | | | | TF |
| HU-19 | Exportación PDF/Excel | Could | Could | 13 | 0 | 13 | | | | | TF |
| HU-20 | Comparativa modelo principal vs respaldo | Could | Could | 13 | 0 | 13 | | | | | TF |
| HU-21 | Escalamiento incidentes Op→Admin | Could | Could | 13 | 0 | 13 | | | | | TF |

**Subtotales HUs:**

| MoSCoW formal | Conteo | SP total |
|---|---|---|
| Must | 16 | 121 |
| Should | 1 | 3 |
| Could | 4 | 52 |
| **Total HUs** | **21** | **176** |

| MoSCoW sprint 4 | Conteo | SP comprometido sprint 4 |
|---|---|---|
| Must | 2 (HU-01, HU-05) | 8 |
| Should↓ / Should | 13 | 0 |
| Could↓ / Could | 6 | 0 |

---

## 3. Tareas Técnicas Habilitadoras (11)

| Código | Título | MoSCoW formal | MoSCoW sprint 4 | SP total | SP ejec | SP rest | S1 | S2 | S3 | S4 | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TTH-01 | Autenticación JWT + bcrypt | Must | **Must** | 5 | 1 | 4 | 1 | | | **4** | Sprint 4 |
| TTH-02 | Docker Compose multi-servicio | Must | **Must** | 5 | 5 | 0 | 5 | | | | ✓ Completo |
| TTH-03 | Repositorio + CI con cobertura | Must | **Must** | 5 | 3 | 2 | 3 | | | **2** | Sprint 4 |
| TTH-04 | Lógica fallback en cascada | Must | Should↓ | 13 | 0 | 13 | | | | | TF |
| TTH-05 | Tiempos preconfigurados degradado 3 | Must | Could↓ | 5 | 0 | 5 | | | | | TF |
| TTH-06 | Capa de DTOs transversal | Won't | Won't | 8 | 0 | — | | | | | TF (DHU-014) |
| TTH-07 | Integración SUMO | Must | Should↓ | 13 | 0 | 13 | | | | | TF |
| TTH-08 | Visión computacional | Must | Should↓ | 13 | 5 | 8 | 5 | | | | TF (8) |
| TTH-09 | Modelo GRU servido vía API | Must | Should↓ | 13 | 1 | 12 | 1 | | | | TF (12) |
| TTH-10 | Motor adaptativo | Must | **Must** | 13 | 8 | 5 | | 8 | | **5** | Sprint 4 |
| TTH-11 | Spike hiperparámetros temporales | Should | Should | 5 | 0 | 5 | | | | | TF |

**Subtotales TTH:**

| MoSCoW formal | Conteo | SP total |
|---|---|---|
| Must | 9 | 85 |
| Should | 1 | 5 |
| Won't | 1 | 8 |
| **Total TTH** | **11** | **98** |

| MoSCoW sprint 4 | Conteo | SP comprometido sprint 4 |
|---|---|---|
| Must | 4 (TTH-01, TTH-02, TTH-03, TTH-10) | 11 |
| Should↓ / Should | 5 | 0 |
| Could↓ | 1 | 0 |
| Won't | 1 | 0 |

---

## 4. RNF transversales estimables por separado (3)

Solo RNF cuyo esfuerzo NO está contenido en una HU específica. El resto de RNF (PERF, SEC, REL, SAF, FLX, COM, FUN, otros INT/MNT) están inglobados en HUs.

| Código | Título | MoSCoW formal | MoSCoW sprint 4 | SP total | SP ejec | SP rest | S1 | S2 | S3 | S4 | Estado |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RNF-INT-02 | Accesibilidad WCAG 2.1 AA | Should | Should | 5 | 0 | 5 | | | | | TF |
| RNF-INT-04 | Coherencia visual entre vistas | Must | Should↓ | 3 | 0 | 3 | | | | | TF |
| RNF-MNT-01 | Extensibilidad catálogos como datos | Should | Should | 3 | 0 | 3 | | | | | TF |

**Subtotal RNF transversales:** 11 SP, 0 ejecutado, 11 restante.

---

## 5. Vista por sprint

### 5.1 Sprint 1 (2026-04-27 → 2026-05-05) — 19 SP

| Código | Título | SP ejec sprint 1 | Comentario |
|---|---|---|---|
| TTH-01 | Auth (modelo User + seed) | 1 | Solo tabla `users` + `passlib` en requirements. Runtime cero. |
| TTH-02 | Docker Compose | 5 | **Completo.** |
| TTH-03 | CI | 3 | Parcial: ruff + pytest core + npm + docker build. Faltan tests edge/shared/ia_prediction + mypy. |
| TTH-08 | Visión legacy | 5 | Parcial (≈40%): YOLO + tracking + ROI + métricas direccionales preservados de bootstrap. |
| TTH-09 | Predictor baseline | 1 | Endpoint canónico + RandomForest preservado. Sin contrato GRU. |
| HU-02 | Intersecciones API | 1 | `/api/intersections` E2E. Sin vista intra-intersección. |
| HU-03 | predictionService scaffolding | 1 | Servicio cliente; sin vista. |
| HU-13 | AdminView mock | 1 | Scaffolding visual hardcoded. |
| HU-16 | AnalyticsView mock | 1 | Scaffolding recharts hardcoded. |
| **Total** | | **19** | 9 elementos parciales |

### 5.2 Sprint 2 (2026-05-09) — 11 SP

| Código | Título | SP ejec sprint 2 | Comentario |
|---|---|---|---|
| TTH-10 | Motor adaptativo | 8 | Webster + MaxPressure + MTC + AdaptiveEngine + endpoint + tests + wiring. ≈70% complejidad. |
| HU-05 | Estrategia activa | 2 | ControlView playground request-response (no vista pasiva). ≈40%. |
| HU-06 | Reasoning panel | 1 | RecommendationPanel con dual-reasoning técnico. Sin catálogo plantillas dominio. |
| **Total** | | **11** | 3 elementos parciales |

### 5.3 Sprint 3 (2026-05-13 → 2026-05-17) — 0 SP

Sprint **metodológico**, 9 commits con prefijo `[inception-agile]`. Produjo todo el backlog formal:

- 21 HUs operativas (Bloques A/B/C/D/F/MVP2)
- 11 TTH
- 22 RF
- 53 RNF
- 19 DHU (decisiones metodológicas)

Cuenta como sprint del proyecto (consume tiempo calendario) pero no se mide en SP de implementación per protocolo.

### 5.4 Sprint 4 (2026-05-18 → futuro) — 19 SP comprometidos

| # | Código | Título | SP rest | Semana sugerida | Riesgo |
|---|---|---|---|---|---|
| 1 | TTH-01 | Auth runtime completo | 4 | 1ª | Bajo |
| 2 | HU-01 | RBAC frontend + backend | 5 | 2ª | Bajo (depende TTH-01) |
| 3 | TTH-10 | Cierre integraciones motor | 5 | 3ª | Medio |
| 4 | HU-05 | Vista pasiva motor (refactor ControlView) | 3 | 3ª-4ª | Medio (Delta-08, R1) |
| 5 | TTH-03 | CI cierre (tests + mypy) | 2 | 4ª | Bajo |
| | | **Total** | **19** | | |

**Capacidad:** 15-20 SP (velocity histórica ~10 SP/sprint × sprint extendido). +27% sobre capacidad de 15 SP — aceptable per protocolo (±35% justificable).

**Objetivo demostrable:** sistema con autenticación funcional + control de acceso por rol + motor adaptativo activo con persistencia mínima de decisiones + vista pasiva del estado vigente del motor + CI completo.

---

## 6. Trabajos Futuros (TF) — alcance postergado

228 SP del backlog quedan postergados al cierre del sprint 4. Agrupación:

### 6.1 TTH centrales aspiracionales (56 SP)

| Código | Título | SP rest |
|---|---|---|
| TTH-04 | Fallback en cascada (robustez) | 13 |
| TTH-05 | Tiempos preconfigurados degradado 3 | 5 |
| TTH-07 | Integración SUMO (validación cuantitativa) | 13 |
| TTH-08 | Refactor visión (vision_aggregates + endpoint) | 8 |
| TTH-09 | GRU servido (modelo principal) | 12 |
| TTH-11 | Spike hiperparámetros temporales | 5 |

### 6.2 Bloque B — Operador tiempo real (33 SP rest)

| Código | Título | SP rest |
|---|---|---|
| HU-02 | Monitoreo estado actual | 7 |
| HU-03 | Predicción de congestión | 4 |
| HU-04 | Vista combinada | 5 |
| HU-06 | Explicación razón de selección | 4 |
| HU-07 | Notificación cambios | 5 |
| HU-08 | Historial decisiones motor | 8 |

### 6.3 Bloque C — Operador degradado (23 SP)

| Código | Título | SP rest |
|---|---|---|
| HU-10 | Alerta transversal | 13 |
| HU-11 | Vista estado componentes | 5 |
| HU-12 | Explicación modo degradado | 5 |

### 6.4 Bloque D — Administrador (30 SP rest)

| Código | Título | SP rest |
|---|---|---|
| HU-13 | Salud técnica Admin | 4 |
| HU-14 | Métricas modelo | 13 |
| HU-15 | Configuración parámetros | 13 |

### 6.5 Bloque F — Gerente (20 SP rest)

| Código | Título | SP rest |
|---|---|---|
| HU-16 | KPIs Gerente | 12 |
| HU-17 | Comparativa periodos | 8 |

### 6.6 MVP2 (Could originales) — 55 SP

| Código | Título | SP rest |
|---|---|---|
| HU-09 | Notas turno | 3 |
| HU-18 | Drill-down | 13 |
| HU-19 | Exportación PDF/Excel | 13 |
| HU-20 | Comparativa modelos | 13 |
| HU-21 | Escalamiento incidentes | 13 |

### 6.7 RNF transversales (11 SP)

| Código | Título | SP rest |
|---|---|---|
| RNF-INT-02 | WCAG 2.1 AA | 5 |
| RNF-INT-04 | Coherencia visual | 3 |
| RNF-MNT-01 | Catálogos como datos | 3 |

### 6.8 Won't declarados

| Código | Título | Razón |
|---|---|---|
| TTH-06 | Capa DTOs transversal | Trabajos Futuros declarado por DHU-014 |
| RNF-FLX-03 | Escalabilidad red urbana (STGNN) | Trabajo futuro declarado (F37) |

---

## 7. Conteos cruzados (verificación)

### 7.1 SP totales

| Concepto | Cálculo | Valor |
|---|---|---|
| SP ejecutado en sprints 1-3 | 19 + 11 + 0 | **30** |
| SP comprometido en sprint 4 | 4 + 5 + 5 + 3 + 2 | **19** |
| SP TF postergados | 56 + 33 + 23 + 30 + 20 + 55 + 11 | **228** |
| **Total backlog (excl. Won't)** | 30 + 19 + 228 | **277 ✓** |

### 7.2 MoSCoW formal (backlog)

| Categoría | HUs | TTH | RNF transv | Total elementos |
|---|---|---|---|---|
| Must | 16 | 9 | 1 | 26 |
| Should | 1 | 1 | 2 | 4 |
| Could | 4 | 0 | 0 | 4 |
| Won't | 0 | 1 | 0 | 1 |
| **Total** | **21** | **11** | **3** | **35** |

### 7.3 MoSCoW operacional sprint 4 (post-loop)

| Categoría | HUs | TTH | RNF transv | Total elementos |
|---|---|---|---|---|
| Must | 2 | 4 | 0 | **6** |
| Should↓ + Should | 13 | 5 | 3 | 21 |
| Could↓ + Could | 6 | 1 | 0 | 7 |
| Won't | 0 | 1 | 0 | 1 |
| **Total** | **21** | **11** | **3** | **35** |

**Descensos del loop (17 elementos):** TTH-04, TTH-05, TTH-07, TTH-08, TTH-09 (TTH); HU-02, HU-03, HU-04, HU-06, HU-07, HU-08, HU-10, HU-11, HU-12, HU-13, HU-14, HU-15, HU-16, HU-17 (HUs); RNF-INT-04 (RNF).

---

## 8. Diferencias clave a tener en cuenta para defensa de tesis

1. **El backlog formal mantiene los 26 Must originales.** No se ratifica el descenso del loop como cambio formal de prioridad.
2. **El sprint 4 cierra solo 6 elementos Must operacionales** (2 HUs + 4 TTH). El resto del MVP1 documentado pasa a Trabajos Futuros operacionales.
3. **La brecha entre alcance ambicioso del MVP1 (209 SP Must) y velocity real (~10 SP/sprint) es estructural** y se reconoce honestamente.
4. **El aporte de ingeniería central está construido:** motor adaptativo (Webster + MaxPressure + MTC) ya operativo desde sprint 2; sprint 4 lo cierra con persistencia mínima.
5. **Sprint 3 metodológico (0 SP)** produjo todo el backlog formal — defendible como sprint de inception que precede toda planificación rigurosa.
