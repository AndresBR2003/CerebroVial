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

## D-PENDING-001 — Modelo: reutilizar `time_then_space.py` o GRU desde cero
**Estado:** Abierta · **Bloquea:** Fase 3a (Bloque F del TODO)

**Contexto:** El archivo [ia_prediction_service/src/models/time_then_space.py](../../ia_prediction_service/src/models/time_then_space.py) implementa una arquitectura **Time-then-Space**: encoder lineal + RNN(cell='gru') temporal + DiffConv espacial + MLPDecoder. La celda recurrente **ya es GRU por defecto** (línea 27). Existen 5 checkpoints entrenados en `ia_prediction_service/notebooks/logs/`, el mejor en `epoch=79-step=30800.ckpt`.

**Opciones:**

- **Opción A — GRU desde cero (lo que dice el TODO F3 hoy):** crear `ia_prediction_service/src/models/gru_model.py` nuevo, descartar `time_then_space.py` y los checkpoints. Más limpio conceptualmente, pero tira código entrenado y agrega días de implementación.
- **Opción B — Reutilizar simplificando:** quitar `DiffConv` del `time_then_space.py` (queda RNN(GRU) + encoder + decoder), reusar el pipeline PyTorch Lightning + tsl. Posiblemente reusar checkpoints si el dataset de Miraflores es compatible. Menos riesgo de no llegar al lunes 11. Documentalmente sigue siendo "RNN" según D-002.
- **Opción C — Caja negra:** mantener `time_then_space.py` tal cual y servirlo. Nominalmente es una RNN espacio-temporal, lo cual es consistente con D-002 si se interpreta "RNN" en sentido amplio.

**Bloqueante:** decisión a tomar antes de iniciar el Bloque F del TODO. Probablemente con asesor en A2.

**Cuando se cierre:** mover esta entrada a sección cerrada con ID `D-006` (o el siguiente disponible), agregar fecha y justificación.
