# BACKLOG V2 — CerebroVial

> Revisión del backlog original (v1 en [ARCHITECTURE_TARGET.md](ARCHITECTURE_TARGET.md) §5.2) adaptada al plan de 5 fases y a las decisiones arquitectónicas tomadas. Ver [DECISIONS.md](DECISIONS.md) para el contexto de los cambios. Actualizado: 2026-05-02.

## Cambios respecto al Backlog V1

| Cambio | Detalle |
|---|---|
| **HU004 adelantada** | De Sprint 3 original a Fase 3 — alineada con el control adaptativo que es el corazón del OE03 |
| **HU007 reducida** | De 13 SP a 8 SP — alcance acotado a motor de reglas básico (umbrales + plan semafórico), sin optimización continua |
| **HU015 adaptada** | "Infraestructura en la nube (Azure)" → "Containerización Docker completa" — alineada con D-003 (deploy local) |
| **HU018 adaptada** | "Control directo de semáforos físicos" → "Simulación de órdenes de control semafórico" — alineada con D-004 (Pi conceptual) |
| **Sprints → Fases** | El backlog original usaba 4 sprints; este usa las 5 fases del [PLAN.md](PLAN.md) |

**Leyenda prioridades MoSCoW:** M = Must Have · S = Should Have · C = Could Have · W = Won't Have  
**Estado:** ✅ Implementado · 🟡 Parcial · ❌ Pendiente · ⛔ Descoped

---

## Fase 1 — Estabilización

| HU | SP | Prioridad | Título | Estado | Notas |
|---|---|---|---|---|---|
| HU019 | 5 | M | Consolidación de módulos y estabilización del repo | ✅ | Cubre: `shared/`, `src/main.py`, limpiar compose, requirements |

**Total Fase 1: 5 SP**

---

## Fase 2 — Cimientos

| HU | SP | Prioridad | Título | Estado | Notas |
|---|---|---|---|---|---|
| HU002 | 3 | M | Organización y estandarización de datos de tráfico | 🟡 | Schemas definidos; falta Alembic + seed de Miraflores |
| HU014 | 5 | M | Implementación de mecanismos de acceso seguro | ❌ | JWT, roles (operador/analista/admin), `get_current_user` |
| HU010 | 8 | M | Visualización en tiempo real del estado del tráfico | 🟡 | Dashboard + CameraDetail funcionan; coordenadas hardcodeadas, sin auth |
| HU015 | 5 | M | Containerización Docker completa *(adaptado de "infra en nube")* | ✅ | Frontend Dockerfile multi-stage + docker compose up completo |
| HU013 | 3 | S | Protección de datos sensibles | ❌ | Cerrar CORS, HTTPS en dev, `.env` fuera del repo *(iniciado)* |

**Total Fase 2: 24 SP**

---

## Fase 3 — RNN + Control

| HU | SP | Prioridad | Título | Estado | Notas |
|---|---|---|---|---|---|
| HU005 | 21 | M | Modelo de IA para la predicción de la congestión vehicular (RNN/GRU) | 🟡 | RandomForest temporal sirviendo; GRU por implementar |
| HU004 | 13 | M | Modelo de IA para gestión semafórica *(adelantado de Sprint 3)* | ❌ | Motor de control: predicción → plan semafórico |
| HU007 | 8 | M | Optimización adaptativa básica *(reducido de 13 SP)* | ❌ | Reglas de ajuste de tiempos por nivel de congestión; sin ML adicional |
| HU009 | 5 | S | Registro auditable de modificaciones semafóricas | ❌ | Tabla de auditoría + endpoints de historial |

**Total Fase 3: 47 SP**

---

## Fase 4 — Pulido para defensa

| HU | SP | Prioridad | Título | Estado | Notas |
|---|---|---|---|---|---|
| HU001 | 3 | M | Obtención de datos de cámaras de video y sensores | ✅ | YOLO + SSE en `edge_device`; validación final pendiente |
| HU008 | 5 | M | Modelo de IA para la detección de vehículos | ✅ | YOLO11n operativo; medir precisión real (D-005) |
| HU003 | 5 | S | Contingencia ante fallos en sensores o cámaras | ❌ | Health checks + fallback a plan fijo + alerta automática |
| HU017 | 5 | S | Alertas automáticas ante fallas del sistema | ❌ | Tabla alerts + SSE push + `AlertsView` conectada |
| HU012 | 5 | S | Reportes automáticos de resultados diarios | ❌ | Endpoint PDF o JSON + cron 00:00 |
| HU006 | 8 | M | Comparación de resultados antes/después del sistema | ❌ | Simulación: plan fijo vs plan adaptativo con datos sintéticos |
| HU011 | 3 | S | Registro de uso del sistema por parte de usuarios | ❌ | Logs de acceso + `AdminView` con datos reales |
| HU016 | 5 | S | CI básico *(adaptado de "Entrega automática de versiones")* | ❌ | GitHub Actions: lint + tests + build |
| HU018 | 3 | S | Simulación de órdenes de control semafórico *(adaptado de "control directo")* | ❌ | Genera y registra órdenes; sin integración física con semáforos reales |

**Total Fase 4: 42 SP**

---

## Resumen por fase

| Fase | SP | Estado |
|---|---|---|
| Fase 0 — Preparar el terreno | — | ✅ Completa |
| Fase 1 — Estabilización | 5 | ❌ Pendiente |
| Fase 2 — Cimientos | 24 | ❌ Pendiente |
| Fase 3 — RNN + Control | 47 | 🟡 En curso (RF temporal) |
| Fase 4 — Pulido para defensa | 42 | 🟡 Parcial (HU001, HU008) |
| **Total** | **118 SP** | |

## HUs descoped

| HU | SP original | Razón |
|---|---|---|
| *(ninguna completamente descoped)* | — | Las que se adaptaron se listaron arriba con nota |

**Nota sobre HU015 y HU018:** el alcance cambió (Azure → Docker local; semáforos físicos → simulación) pero las historias se mantienen en el backlog con el nuevo alcance, para que IE03 (≥95% HU aceptadas) sea alcanzable.

---

## Criterio de aceptación del backlog (IE03)

IE03 pide ≥95% de Historias de Usuario aceptadas. De las 19 HU originales:
- 17 están en fases activas con nuevo alcance.
- 2 están adaptadas (HU015, HU018) — siguen contando si se demuestra el alcance adaptado.
- 0 completamente descoped.

Para cumplir IE03: cerrar al menos 18/19 HUs con sus criterios de aceptación documentados.
