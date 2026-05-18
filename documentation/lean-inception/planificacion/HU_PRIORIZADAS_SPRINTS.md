# Historias de Usuario Priorizadas — CerebroVial

> Generado: 2026-05-18
> Versión: v1
> Documento académico — distribución ideal de las 21 HUs del backlog en 4 sprints.

## 0. Cómo leer este documento

- **MoSCoW**: prioridad formal del backlog (ratificada en Fase 4.2).
- **SP** (Story Points): estimados en Planning Poker (Fase 4.3). Escala Fibonacci con anclas HU-09=3 (baja) y elementos densos hasta 13 (alta).
- **Valor de Negocio (0-100)**: estimación derivada de MoSCoW + criticidad operativa documentada en el backlog. Escala:
  - **80-100**: Must crítico (función central de un rol, o habilitador transversal de seguridad/operación).
  - **60-79**: Must de soporte (función operativa relevante pero no central).
  - **40-59**: Should (valor agregado relevante, no esencial).
  - **20-39**: Could (mejora ampliativa, MVP2).
- **Sprint**: asignado en distribución uniforme respetando dependencias técnicas y anclas temáticas (visión en S1, predictor en S2, motor en S3).

---

## 1. Resumen ejecutivo

| Sprint | Tema central | HUs | SP |
|---|---|---|---|
| **Sprint 1** | Visión computacional + acceso + monitoreo base | 7 | **44** |
| **Sprint 2** | Modelo predictivo + configuración + métricas | 5 | **49** |
| **Sprint 3** | Motor adaptativo + escalamiento | 5 | **36** |
| **Sprint 4** | Reportería Gerente + exportación | 4 | **47** |
| **Total** | | **21** | **176** |

Distribución uniforme: media 44 SP/sprint, rango 36-49 (desviación ±7 SP). Anclas temáticas respetadas.

---

## 2. Backlog completo de HUs

| Código | Título | MoSCoW | SP | Valor Negocio | Sprint |
|---|---|---|---|---|---|
| HU-01 | Acceso diferenciado por rol | Must | 5 | 95 | 1 |
| HU-02 | Monitoreo del estado actual | Must | 8 | 90 | 1 |
| HU-03 | Predicción de congestión | Must | 5 | 85 | 1 |
| HU-04 | Vista combinada estado + predicción | Must | 5 | 80 | 2 |
| HU-05 | Estrategia de control activa | Must | 5 | 95 | 3 |
| HU-06 | Explicación razón de selección | Must | 5 | 75 | 3 |
| HU-07 | Notificación cambios estrategia | Must | 5 | 70 | 3 |
| HU-08 | Historial decisiones del motor | Must | 8 | 75 | 3 |
| HU-09 | Notas e incidencias del turno | Should | 3 | 50 | 1 |
| HU-10 | Alerta transversal estado operativo | Must | 13 | 90 | 1 |
| HU-11 | Vista estado componentes (Operador) | Must | 5 | 75 | 1 |
| HU-12 | Explicación modo degradado | Must | 5 | 70 | 2 |
| HU-13 | Salud técnica componentes (Admin) | Must | 5 | 70 | 1 |
| HU-14 | Métricas modelo predictivo | Must | 13 | 75 | 2 |
| HU-15 | Configuración parámetros operativos | Must | 13 | 80 | 2 |
| HU-16 | KPIs Gerente periodo seleccionable | Must | 13 | 80 | 4 |
| HU-17 | Comparativa entre periodos (Gerente) | Must | 8 | 70 | 4 |
| HU-18 | Drill-down de periodo (Gerente) | Could | 13 | 35 | 4 |
| HU-19 | Exportación PDF/Excel | Could | 13 | 30 | 4 |
| HU-20 | Comparativa modelo principal vs respaldo | Could | 13 | 40 | 2 |
| HU-21 | Escalamiento incidentes Op→Admin | Could | 13 | 30 | 3 |

**Conteo MoSCoW:** 16 Must · 1 Should · 4 Could · 0 Won't = 21 HUs · 176 SP.

---

## 3. Sprint 1 — Visión + Acceso + Monitoreo base (44 SP)

Orden de ejecución dentro del sprint:

| # | Código | Título | MoSCoW | SP | Valor | Justificación de orden |
|---|---|---|---|---|---|---|
| 1 | HU-01 | Acceso diferenciado por rol | Must | 5 | 95 | Prerrequisito transversal de todas las HUs (toda HU requiere login + RBAC). |
| 2 | HU-02 | Monitoreo del estado actual | Must | 8 | 90 | Ancla visión: consume flujo/cola por acceso desde el subsistema de visión. |
| 3 | HU-03 | Predicción de congestión | Must | 5 | 85 | Consume datos de visión agregados; vista pasiva paralela a HU-02. |
| 4 | HU-11 | Vista estado componentes (Operador) | Must | 5 | 75 | Vista operativa simple; consume health checks del subsistema. |
| 5 | HU-13 | Salud técnica componentes (Admin) | Must | 5 | 70 | Versión Admin con campos técnicos extra; reusa infra de HU-11. |
| 6 | HU-10 | Alerta transversal estado operativo | Must | 13 | 90 | Banner transversal en App.tsx; ancla del subsistema de alertas. |
| 7 | HU-09 | Notas e incidencias del turno | Should | 3 | 50 | CRUD autocontenido sin dependencias; relleno de capacidad. |

**Total Sprint 1: 44 SP.**

---

## 4. Sprint 2 — Predictor + Configuración + Métricas (49 SP)

| # | Código | Título | MoSCoW | SP | Valor | Justificación de orden |
|---|---|---|---|---|---|---|
| 1 | HU-04 | Vista combinada estado + predicción | Must | 5 | 80 | Composición de HU-02 + HU-03 (sprint 1); cierra el bloque Operador básico. |
| 2 | HU-12 | Explicación modo degradado | Must | 5 | 70 | Depende de HU-10 (sprint 1); completa el bloque alertas. |
| 3 | HU-15 | Configuración parámetros operativos | Must | 13 | 80 | Habilita parametrización del motor antes de que se construya en sprint 3. |
| 4 | HU-14 | Métricas modelo predictivo | Must | 13 | 75 | Ancla modelo predictivo: 4 métricas (MAE/RMSE/accuracy/matriz 6×6). |
| 5 | HU-20 | Comparativa modelo principal vs respaldo | Could | 13 | 40 | Depende de HU-14; ejecución paralela + métricas comparativas. |

**Total Sprint 2: 49 SP.**

---

## 5. Sprint 3 — Motor adaptativo + Escalamiento (36 SP)

| # | Código | Título | MoSCoW | SP | Valor | Justificación de orden |
|---|---|---|---|---|---|---|
| 1 | HU-05 | Estrategia de control activa | Must | 5 | 95 | Ancla del motor: vista pasiva del estado vigente. Prerrequisito de HU-06/07/08. |
| 2 | HU-06 | Explicación razón de selección | Must | 5 | 75 | Catálogo plantillas en lenguaje dominio; depende de HU-05. |
| 3 | HU-07 | Notificación cambios estrategia | Must | 5 | 70 | Toast con 4 campos + agrupamiento; depende de HU-05. |
| 4 | HU-08 | Historial decisiones del motor | Must | 8 | 75 | Persistencia + vista paginada; cierre del bloque motor. |
| 5 | HU-21 | Escalamiento incidentes Op→Admin | Could | 13 | 30 | Depende de HU-10 (S1) + HU-12 (S2); HU más densa del backlog (37 CAs). |

**Total Sprint 3: 36 SP.**

---

## 6. Sprint 4 — Reportería Gerente + Exportación (47 SP)

| # | Código | Título | MoSCoW | SP | Valor | Justificación de orden |
|---|---|---|---|---|---|---|
| 1 | HU-16 | KPIs Gerente periodo seleccionable | Must | 13 | 80 | Ancla del bloque Gerente: sustrato F30 inglobada + 4 cards. |
| 2 | HU-17 | Comparativa entre periodos (Gerente) | Must | 8 | 70 | Reutiliza sustrato de HU-16; semántica mejora/empeoramiento. |
| 3 | HU-18 | Drill-down de periodo (Gerente) | Could | 13 | 35 | Acceso desde HU-16/17; 3 carriles temporales integrados. |
| 4 | HU-19 | Exportación PDF/Excel | Could | 13 | 30 | Cierre MVP2: invocación desde HU-16/17 con estructura completa. |

**Total Sprint 4: 47 SP.**

---

## 7. Mapa de dependencias

```
HU-01 (S1) ──── prerrequisito transversal de todas las HUs
HU-02 (S1) ──┐
HU-03 (S1) ──┴─→ HU-04 (S2)
HU-10 (S1) ──┬─→ HU-12 (S2) ──┐
             │                  ├─→ HU-21 (S3)
             └──────────────────┘
HU-14 (S2) ────→ HU-20 (S2, mismo sprint)
HU-05 (S3) ──┬─→ HU-06 (S3, mismo sprint)
             ├─→ HU-07 (S3, mismo sprint)
             └─→ HU-08 (S3, mismo sprint)
HU-16 (S4) ──┬─→ HU-17 (S4, mismo sprint)
             ├─→ HU-18 (S4, mismo sprint)
             └─→ HU-19 (S4, mismo sprint)
```

Todas las dependencias se resuelven en el orden propuesto: ninguna HU consume otra que no esté ya entregada en un sprint anterior o en orden ascendente dentro del mismo sprint.

---

## 8. Distribución visual de carga

| Sprint | SP | Distribución vs media (44 SP) |
|---|---|---|
| Sprint 1 | 44 | exacto |
| Sprint 2 | 49 | +11% |
| Sprint 3 | 36 | −18% |
| Sprint 4 | 47 | +7% |

Banda ±18% sobre la media. Las anclas temáticas (visión/predictor/motor) y las dependencias técnicas explican las desviaciones residuales.
