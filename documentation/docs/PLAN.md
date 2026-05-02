# PLAN — CerebroVial

> **Documento operativo**: fases hacia la defensa con criterio de "está listo cuando". Las fases son secuenciales — no avanzar a la siguiente sin cerrar la anterior. Fuente granular por tarea: [TODO.md](TODO.md). Decisiones técnicas: [DECISIONS.md](DECISIONS.md). Estado actual: [20260430_ARCHITECTURE_DISCOVERY.md](20260430_ARCHITECTURE_DISCOVERY.md). Arquitectura target: [ARCHITECTURE_TARGET.md](ARCHITECTURE_TARGET.md).

---

## Fase 0 — Preparar el terreno (1 día)

Trabajo de preparación que hace el estudiante, no Claude Code. Es lo más rentable del proyecto.

**0.1** Releer el documento de tesis en las secciones de modelo predictivo y compartirlas con el asistente antes de la Fase 3. Sin eso, la Fase 3 va a ciegas.

**0.2** Hablar con el compañero y mostrarle este plan. Acordar quién toma qué fase y que ambos respetan el orden. Que sepa que se usará Claude Code intensivamente y que ambos commitean el `CLAUDE.md` actualizado para que el conocimiento sea compartido.

**0.3** Mergear `analysis/initial-discovery` a `master`. El `CLAUDE.md.old` se deja como referencia histórica un tiempo más. Asegurarse que el assessment (`documentation/docs/20260430_ARCHITECTURE_DISCOVERY.md`) quede commiteado en `master` — es contexto valioso para futuras sesiones de Claude Code.

**0.4** Verificar y commitear el `CLAUDE.md` raíz (el que ya existe en la raíz del repo, honesto y actualizado con las decisiones tomadas).

**0.5** Commitear `documentation/docs/PLAN.md` (este archivo) y `documentation/docs/DECISIONS.md`.

**0.6** Actualizar `.gitignore`: agregar `.claude/settings.local.json`, `.claude/projects/`, `tmp_*.txt`, `tmp_*.py`. Verificar que `.env` esté incluido — si no, rotar credenciales primero (ya están en la historia de git) y luego agregarlo.

**Criterio de "Fase 0 lista":** `CLAUDE.md`, `PLAN.md` y `DECISIONS.md` commiteados en `master`. Se habló con el compañero. El documento de tesis está a mano para compartirlo.

---

## Fase 1 — Estabilización (3–4 días)

**Objetivo único:** `docker compose up` levanta todo sin crashes y la duplicación de `common/` desaparece. Cero features nuevos.

**1.1** Consolidar `common/` en un solo lugar. Mover `core_management_api/src/common/` y `edge_device/src/common/` (hoy byte-idénticos) a un módulo compartido en la raíz — por ejemplo `shared/` o `cerebrovial_common/` — instalable como paquete pip local con un `pyproject.toml` mínimo. Ambos módulos lo importan con `pip install -e ../shared`.

**1.2** Crear `core_management_api/src/main.py` como entry point real de toda la app FastAPI, con los routers de los módulos montados (`/api/vision`, `/api/predictions`, `/api/control`). El `scripts/run_prediction.py` se preserva como entry alternativo de desarrollo. El Dockerfile de `core_management_api` apunta al `src/main.py` nuevo.

**1.3** Sacar `ia_prediction_service` del `docker-compose.yml`. Es un pipeline de entrenamiento offline, no un servicio HTTP. Su Dockerfile queda en el repo para correrse manualmente al entrenar (`docker build -f ia_prediction_service/Dockerfile ...`), pero no aparece en el compose normal.

**1.4** Limpiar el compose:
- Renombrar el servicio `db_postgres` para que coincida con lo que espera el `.env` (o cambiar el `.env`, lo menos invasivo).
- Sacar `db_mongo` del compose (nadie lo usa).
- Sacar `api_gateway` del compose (no funciona, vamos a monolito, no necesitamos gateway).

**1.5** Limpiar `requirements.txt`:
- `core_management_api`: sacar `torch`, `ultralytics`, `opencv-python`, `supervision`, `hydra-core`, `cap_from_youtube`, `imageio-ffmpeg`, `streamlink`, `shapely`. Mantener `fastapi`, `uvicorn`, `sqlalchemy`, `geoalchemy2`, `alembic`, `numpy`, `pandas`, `scikit-learn`, `psycopg2-binary`, `sse-starlette`, `python-jose[cryptography]`, `passlib[bcrypt]`, `httpx`, `python-multipart`.
- `edge_device`: mantener lo de visión, sacar lo que no use.

**1.6** Limpieza de raíz:
- Mover `evidence_report.md`, `diagrama_vial*.html`, `DOCUMENTACION.md` a `documentation/`.
- Borrar `tmp_docx_output.txt`, `tmp_docx_utf8.txt`, `tmp_read_docx.py`, `generate_evidence.py`, `CLAUDE.md.old` (si existe).
- Mover `edge_device/yolo11n.pt` a Git LFS — o sacarlo del repo y documentar en el README cómo descargarlo.

**Cómo usar Claude Code:** cada tarea es un buen scope para una sesión en plan mode. Una tarea por sesión: dar luz verde al plan, ejecutar, verificar con `docker compose up` al final.

**Criterio de "Fase 1 lista":** `docker compose up` levanta `db`, `core_management_api`, `edge_device` sin crashes. Frontend con `npm run dev` puede llamar a los endpoints existentes (RF) y al stream de visión. `common/` está en un solo lugar. `requirements.txt` sin over-install. Repo limpio.

---

## Fase 2 — Cimientos (4–5 días)

**Objetivo:** las cosas declaradas pero no implementadas pasan a funcionar de verdad. Todavía no son features de producto — son cimientos.

**2.1** Alembic real. `alembic init`, configurar para que apunte a la BD del compose, primera migración que crea las tablas reales (las que ya están en `common/database/models.py`), segunda migración que activa TimescaleDB hypertables sobre las tablas de tracks/flow vehicular. El `init_db()` que nadie llama se borra.

**2.2** Seed mínimo de Miraflores. Un script `scripts/seed.py` con: 4–5 intersecciones reales (coordenadas), cámaras correspondientes (URL YouTube), un usuario admin de prueba. El frontend deja de tener coordenadas hardcodeadas en `DashboardView.tsx` y las lee del backend (`GET /api/intersections`).

**2.3** JWT real. Modelo `User` en BD, endpoint `POST /api/auth/login`, hashing con `passlib`, tokens con `python-jose`, dependency `get_current_user` aplicada a las rutas. Tres roles: operador, analista, admin.

**2.4** CORS responsable. Cerrar `allow_origins` a `http://localhost:5173` (Vite default) y la URL de prod cuando exista.

**2.5** Frontend configurable:
- Reemplazar URLs hardcodeadas `localhost:8000`/`localhost:8001` por `import.meta.env.VITE_API_BASE_URL`.
- Crear `frontend_ui/.env.example` y documentar.
- Mover la API key de Gemini al backend: endpoint `POST /api/ai/chat` que el backend llame con su propia key del `.env`. El frontend llama a este endpoint, no a Gemini directo.

**2.6** Frontend en Docker. Dockerfile multi-stage para el frontend (build con `node`, serve con `nginx`). Agregarlo al compose. Ahora `docker compose up` levanta literalmente todo.

**Cómo usar Claude Code:** igual que Fase 1, una tarea por sesión, plan mode primero. Para JWT revisar el plan cuidadosamente antes de aprobar — auth mal hecho es peor que auth ausente.

**Criterio de "Fase 2 lista":** se puede hacer login en el frontend. Las URLs son configurables. La BD tiene tablas reales con datos de Miraflores. Las cámaras y coordenadas vienen del backend.

---

## Fase 3 — El corazón de la tesis: RNN + control (6–8 días)

**Objetivo:** defender la tesis. Esta fase requiere conversación con el asistente antes de delegar a Claude Code — las decisiones de modelo tienen consecuencias en la defensa.

**3.1** Definir el modelo RNN según la tesis. Detener un día para leer el documento de tesis juntos y diseñar: tipo (LSTM o GRU), arquitectura (capas, hidden size), inputs (ventana temporal de flujos por intersección), outputs (clasificación de nivel de congestión a 15/30/45 min), función de pérdida, métricas. Resultado: `documentation/docs/MODEL.md` con la especificación. Ver `D-PENDING-001` en [DECISIONS.md](DECISIONS.md).

**3.2** Implementar el RNN en `ia_prediction_service`. Reemplaza al STGNN actual. Reusar la infraestructura PyTorch Lightning existente. El dataset pasa a ser sintético generado a partir del schema real de la BD (datos reales de Miraflores no están disponibles todavía). El entrenamiento produce un `.pt` guardado en una ruta servible — no en `notebooks/logs/`.

**3.3** Servir el RNN. Cargar el modelo directamente dentro de `core_management_api` como módulo Python (consistente con monolito modular). El endpoint `/api/predictions/predict` reemplaza al RF cuando el modelo está validado. El RF se mantiene como fallback documentado y configurable.

**3.4** Control adaptativo. Implementar el motor de reglas: dada una predicción de congestión, calcular cambios en planes semafóricos. Endpoints `GET/POST /api/control/plans`, `GET /api/control/intersections/{id}/current-plan`. Documentar las reglas en `documentation/docs/CONTROL.md` con justificación. Esto cubre OE03/OE04.

**3.5** Frontend conectado a predicciones reales y control. Las vistas Analytics, Alerts, Admin (hoy ~45 líneas con mocks) se conectan al backend real. Widget o vista de control semafórico mostrando el plan actual y cambios sugeridos.

**Cómo usar Claude Code:** muy útil para 3.2, 3.4 y 3.5 (código mecánico una vez definida la arquitectura). Para 3.1 y 3.3 conviene diseñar en chat primero y luego delegar la implementación.

**Criterio de "Fase 3 lista":** el flujo end-to-end funciona — cámara YouTube → YOLO detecta vehículos → datos van a BD → RNN predice congestión → motor de control sugiere cambio de plan semafórico → frontend muestra todo. Aunque sea con datos sintéticos para entrenar el RNN, el pipeline completo está vivo.

---

## Fase 4 — Pulido para defensa (3–4 días)

**Objetivo:** el sistema es defendible frente al jurado.

**4.1** Tests E2E mínimos. Pytest con `httpx` async client: login → consulta de intersecciones → trigger de predicción → consulta de plan de control. Cinco tests bien hechos valen más que cincuenta a medias.

**4.2** CI básico en GitHub Actions. Pipeline: lint (`ruff`), tests backend (`pytest`), tests frontend (`vitest`), build de imágenes. Sin deploy, solo verificación.

**4.3** README raíz con quickstart. Cinco pasos para levantar desde cero. Capturas de las vistas principales. Un diagrama de arquitectura claro (reemplaza los `diagrama_vial*.html` actuales).

**4.4** Comparación antes/después (HU006). Sin datos reales del "antes" en Miraflores, se hace con simulación: dataset sintético "sin sistema" (planes fijos) vs "con sistema" (planes adaptativos), con métricas de tiempo promedio en cola y vehículos por hora. Decisión de detalles cuando se llegue a esta tarea.

**4.5** Documento de tesis actualizado. Sincronizar con lo implementado: arquitectura entregada, modelo RNN con resultados reales, control adaptativo con justificación de reglas, capturas del sistema funcionando. Actualizar los números de accuracy con los valores reales medidos (ver `D-005` en [DECISIONS.md](DECISIONS.md)).

**Criterio de "Fase 4 lista":** se puede grabar un video demo de 5 minutos donde se levanta el sistema con un comando, se hace login, se ve el dashboard con datos reales, y se muestra una predicción + sugerencia de control. Eso es el mínimo defendible.

---

## Reglas de avance

- No iniciar Fase 1 sin Fase 0 cerrada (commit en `master`).
- No iniciar Fase 2 sin `docker compose up` verde (criterio Fase 1).
- No iniciar Fase 3 sin la BD con datos reales y login funcional (criterio Fase 2).
- No iniciar 3.2 sin `D-PENDING-001` cerrada en [DECISIONS.md](DECISIONS.md) (elección del modelo).
- No iniciar Fase 4 sin el flujo end-to-end vivo (criterio Fase 3).
- Cada tarea de Claude Code: plan mode primero, aprobar el plan, ejecutar, verificar.
- Cualquier cambio estructural (carpetas, paquetes, schema de BD) se registra en [DECISIONS.md](DECISIONS.md).
