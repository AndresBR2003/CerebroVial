# Assessment de arquitectura — CerebroVial (post-refactor)

> **Fecha:** 2026-04-30
> **Repo:** `/Users/rasec/Documents/UPC/202601/CerebroVial`
> **Branch al momento del análisis:** `analysis/initial-discovery`
> **Último commit:** `0e20b0b4 — modified: storage limit for containers` (2026-04-28)
> **Modo:** solo lectura — no se modificó ningún archivo del código durante la auditoría.

---

## 1. Topología del repo

```
CerebroVial/
├── core_management_api/          # "monolito reducido" FastAPI: predicción + control + common
│   ├── conf/vision/              # YAMLs de config de visión (residuo del monolito original; sin código)
│   ├── docs/specs/
│   ├── models/                   # 8 archivos .joblib (RandomForest entrenados — clase y regresión 15/30/45min/current)
│   ├── scripts/                  # run_prediction.py (entry point real), generadores de datos sintéticos, train_models
│   ├── src/
│   │   ├── common/               # config + database + schemas (Camera/Vision/Graph/Waze) + logging + metrics
│   │   ├── control/              # SOLO domain.py (29 líneas, dataclasses) — STUB
│   │   └── prediction/           # domain + application/predictor + infrastructure + presentation/api
│   └── tests/                    # tests pytest de prediction + schemas
│
├── edge_device/                  # "edge" en nombre, contenedor x86 Python en realidad
│   ├── conf/vision/              # mismos YAMLs de visión (default, balanced, low_latency, javier_prado…)
│   ├── scripts/run_server.py     # entry point real: Hydra + CameraManager + 4 cámaras YouTube hardcoded
│   ├── src/
│   │   ├── main.py               # CLI con argparse (vision/prediction/control); solo `vision` implementado
│   │   ├── common/               # ⚠ BYTE-IDÉNTICO al common/ de core_management_api
│   │   └── vision/               # DDD: domain + application/{builders,pipelines,services} + infrastructure/{detection,tracking,zones,sources,broadcast,persistence} + presentation/{api/routes,visualization,legacy_api}
│   ├── tests/vision/{unit,integration}/   # 12+ archivos pytest reales
│   └── yolo11n.pt                # ⚠ pesos YOLO comiteados (5.6 MB)
│
├── ia_prediction_service/        # "servicio" en nombre, NO es servicio HTTP en realidad
│   ├── config/                   # YAML config (model_config.yaml está vacío)
│   ├── data/locations.csv
│   ├── notebooks/                # 4 notebooks (EDA, training, results, main) + logs/ con 5 .ckpt
│   ├── scripts/{train,predict,evaluate,visualize_network}.py
│   └── src/
│       ├── data/                 # data_module + dataset_loader (usa MetrLA, no datos propios)
│       ├── models/time_then_space.py   # STGNN con tsl + DiffConv + RNN + MLPDecoder
│       ├── training/predictor.py # tsl.engines.Predictor + MaskedMAE
│       ├── evaluation/, utils/, visualization/
│       └── tests/                # 3 archivos pytest (uno vacío)
│
├── frontend_ui/                  # React 19 + TS + Vite — completo
│   ├── src/
│   │   ├── App.tsx               # SPA con tabs (sin react-router)
│   │   ├── components/{layout,modals,ui,views,widgets}/
│   │   │   └── views/            # Dashboard, CameraDetail, Analytics, Alerts, Admin (todas implementadas)
│   │   └── services/predictionService.ts   # axios → http://localhost:8001 (HARDCODED)
│   ├── coverage/                 # output histórico de vitest
│   └── (sin Dockerfile, no orquestado en compose)
│
├── infra/docker/initdb/01_extensions.sql   # único archivo SQL del repo (postgis, postgis_topology, timescaledb)
├── documentation/tesis/          # documentos académicos
├── docker-compose.yml            # 5 servicios: db_postgres, db_mongo, api_gateway (nginx vacío), core_management_api, ia_prediction_service, edge_device
├── .env                          # DATABASE_URL + credenciales en repo (revisar)
├── DOCUMENTACION.md, CLAUDE.md.old, evidence_report.md, diagrama_vial[_2].html
└── tmp_docx_output.txt, tmp_docx_utf8.txt, generate_evidence.py, tmp_read_docx.py    # artefactos sueltos
```

**No existe**: `README.md` raíz, `Makefile`, `Taskfile.yml`, `pyproject.toml` raíz, `package.json` raíz, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `.github/workflows/`, carpetas `k8s/`, `helm/`, `terraform/`, `manifests/`, ni una raíz `CLAUDE.md` viva (solo `CLAUDE.md.old`).

---

## 2. ¿Es microservicios real?

**Veredicto: NO. Es un monorepo con apariencia de microservicios pero sin las propiedades que los definen.** Ni monolito modular bien organizado, ni microservicios reales — está en un punto intermedio frágil.

**Evidencia a favor de "microservicios":**
- Cada servicio backend tiene su propio `Dockerfile` y `requirements.txt` (`core_management_api/Dockerfile`, `edge_device/Dockerfile`, `ia_prediction_service/Dockerfile`).
- Cada uno corre en un puerto distinto (8000/8001/8002) en `docker-compose.yml`.
- Hay tres entry points conceptualmente separados (visión / API / IA).

**Evidencia en contra:**
- **Dos de los tres backends no levantan**: `core_management_api/Dockerfile` hace `CMD ["uvicorn", "src.main:app", ...]` pero `core_management_api/src/main.py` no existe (solo `__init__.py` vacío). `ia_prediction_service/Dockerfile` hace `CMD ["python", "main.py"]` pero `main.py` no existe en la raíz del módulo.
- **`ia_prediction_service` no es un servicio**: sin FastAPI/Flask en `requirements.txt`, sin endpoints, sin `main.py`. Es un proyecto de entrenamiento ML envuelto en un Dockerfile.
- **`src/common/` byte-idéntico entre `edge_device` y `core_management_api`** (database, models, schemas/{vision,graph,camera,waze}, logging, metrics) — copiado, no compartido.
- **Cero comunicación servicio-a-servicio**: `httpx` está declarado en ambos `requirements.txt` pero no se importa en ningún `.py`. Cero gRPC, cero broker, cero queue. La única "integración" backend es a través de la BD, y los servicios tampoco la consumen en runtime (el predictor lee CSV con `CSVLoader`, no Postgres).
- **Misma stack pesada en los dos servicios Python**: ambos `requirements.txt` listan `torch`, `ultralytics`, `opencv-python`, `geoalchemy2`, `supervision`, etc. — el `core_management_api` no necesita YOLO/OpenCV.
- **API gateway decorativo**: el servicio `api_gateway` en compose usa `nginx:alpine` y el `volumes` para montar `nginx.conf` está comentado. No enruta a los microservicios.
- **Frontend habla directo a 2 backends sin pasar por el gateway**: `localhost:8001/predictions` y `localhost:8000/stream`/`/video` (ver §5).

**Conclusión práctica:** el refactor **separó carpetas** pero no separó **ciclos de vida ni contratos**. Volver al monolito modular costaría poco; convertirlo en microservicios reales requiere bastante trabajo que aún no se hizo.

---

## 3. Inventario de servicios

| Nombre | Path | Stack | Propósito | Estado |
|---|---|---|---|---|
| `core_management_api` | `core_management_api/` | Python 3.11 + FastAPI + Uvicorn + SQLAlchemy + sklearn (RF joblib) | API central: predicción de congestión (RandomForest) y placeholder de control | Implementado parcial — predicción funciona, control es STUB, Dockerfile **roto** (CMD apunta a `src.main:app` inexistente) |
| `edge_device` | `edge_device/` | Python 3.11 + FastAPI + Hydra + Ultralytics YOLO + supervision + OpenCV + sse-starlette | Pipeline de visión + multi-camera manager + streaming SSE/MJPEG | Implementado (vision real, DDD bien aplicado). `legacy_api.py` con imports rotos. CMD funciona vía `scripts/run_server.py` |
| `ia_prediction_service` | `ia_prediction_service/` | Python 3.11 + PyTorch + PyTorch Lightning + tsl + torch-geometric | Entrenamiento STGNN sobre dataset MetrLA (no datos propios) | Implementado como pipeline ML / notebooks. **No es servicio HTTP**. Dockerfile **roto** (CMD `python main.py`, no existe). Varios módulos vacíos (`base_model.py`, `model_factory.py`, `trainer.py`, `callbacks.py`) |
| `frontend_ui` | `frontend_ui/` | React 19 + TypeScript 5.9 + Vite 7 + Tailwind 4 + Vitest 4 + Leaflet 1.9 + recharts + axios | SPA: Dashboard con mapa, detalle de cámara con SSE/MJPEG, Analytics, Alerts, Admin, chat con Gemini | Implementado completo. **Sin Dockerfile, sin servicio en compose**. URLs hardcoded a `localhost:8000`/`localhost:8001` |
| `infra` | `infra/docker/initdb/` | SQL | Inicializa extensiones PostGIS + TimescaleDB en arranque del contenedor Postgres | Mínimo (1 archivo) |

---

## 4. Stack y dependencias (por servicio)

**core_management_api** — Python 3.11 (Dockerfile), FastAPI + Uvicorn. `requirements.txt` (23 paquetes): `fastapi`, `uvicorn`, `python-multipart`, `sqlalchemy`, `psycopg2-binary`, `geoalchemy2`, `alembic`, `numpy`, `pandas`, `scikit-learn`, `torch`, `ultralytics`, `opencv-python`, `supervision`, `cap_from_youtube`, `imageio-ffmpeg`, `streamlink`, `shapely`, `hydra-core`, `sse-starlette`, `python-jose[cryptography]`, `passlib[bcrypt]`, `httpx`. **Sobre-dependencias**: trae YOLO/OpenCV/Hydra que solo usa el edge.

**edge_device** — Python 3.11, FastAPI + Uvicorn + Hydra. `requirements.txt` **idéntico** al de core_management_api (mismos 23 paquetes). Pesos `yolo11n.pt` comiteados.

**ia_prediction_service** — Python 3.11. `requirements.txt` totalmente distinto: `torch>=2.3.0`, `pytorch-lightning>=2.0.0`, `torch-geometric>=2.3.0`, `torch-scatter`, `torch-sparse`, `git+https://github.com/TorchSpatiotemporal/tsl.git`, `tensorboard`, `matplotlib`, `pyyaml`, `tqdm`. **Sin FastAPI/Flask/uvicorn** — confirma que no es un servicio HTTP.

**frontend_ui** — Node sin `engines` declarado. `package.json`: React 19.2, TypeScript ~5.9.3, Vite ^7.2.4, Tailwind 4 vía `@tailwindcss/vite`, Vitest ^4.0.15 + `@testing-library/{react,jest-dom}` + `@vitest/coverage-v8` + `jsdom`, `axios ^1.13.2`, `leaflet ^1.9.4`, `react-leaflet ^5.0.0`, `recharts ^3.5.1`, `lucide-react ^0.556.0`. Scripts: `dev`, `build`, `lint`, `preview`, `test`, `test:coverage`. **Gestor**: `package-lock.json` presente → npm.

---

## 5. Comunicación entre servicios

**Backend ↔ Backend: NO HAY.**
- `httpx` declarado en ambos `requirements.txt` pero nunca importado (`grep -rEn "httpx|requests\.|aiohttp" src/` → 0 matches en los 3 servicios).
- Sin Kafka, RabbitMQ, NATS, Redis pub/sub, Celery, gRPC. Cero archivos `.proto`.
- Sin imports cruzados entre paquetes Python.

**Frontend → Backend: directo y hardcoded a 2 backends distintos.**
- `core_management_api` (puerto 8001):
  - `frontend_ui/src/services/predictionService.ts:27` → `const API_URL = 'http://localhost:8001/predictions'` y `axios.post(.../predict)`.
  - `frontend_ui/src/components/widgets/TrafficHistoryWidget.tsx:61` → `fetch('http://localhost:8001/predictions/history/...')`.
- `edge_device` (puerto 8000):
  - `frontend_ui/src/components/views/CameraDetailView.tsx:42` → `new EventSource('http://localhost:8000/stream/${cameraId}')` (SSE, escucha evento `analysis`).
  - `frontend_ui/src/components/views/CameraDetailView.tsx:106` → `http://localhost:8000/video/${cameraId}` (MJPEG `multipart/x-mixed-replace`).
- Google Gemini (externo, directo desde el browser):
  - `frontend_ui/src/components/widgets/AIChatWidget.tsx:13-14` y `frontend_ui/src/components/modals/ReportModal.tsx:13-14` → `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}` con `apiKey = ""` hoy, pero el patrón es API key embebida en el bundle JS.

**Sin variables de entorno en el frontend** (cero `import.meta.env` o `VITE_*` matches). No es configurable por entorno.

**API Gateway**: `docker-compose.yml` declara `api_gateway: nginx:alpine` con `ports: "80:80"` pero el volume del `nginx.conf` está comentado y **no existe el directorio `api_gateway/`**. Es nginx con la config default; no enruta a los servicios. El frontend lo ignora.

**SSE/streaming server-side**: `edge_device/src/vision/presentation/api/routes/streaming.py:6,54` usa `EventSourceResponse` de `sse_starlette`. `edge_device/src/vision/presentation/api/routes/video.py:7,51` y `edge_device/src/vision/presentation/legacy_api.py:5,72` usan `StreamingResponse` MJPEG. Sin WebSockets nativos.

**Auth**: `python-jose` y `passlib[bcrypt]` declarados pero **cero imports** de `jose`, `jwt`, `passlib`, `oauth2_scheme` en código. Sin endpoints `/login`/`/auth`. CORS abierto en `core_management_api/scripts/run_prediction.py:16-22` con `allow_origins=["*"]` + `allow_credentials=True` (combinación insegura).

---

## 6. Capa de datos

**PostgreSQL (única BD que se levanta con propósito real)**
- Imagen: `timescale/timescaledb-ha:pg15` (`docker-compose.yml`). Servicio `db_postgres`.
- Extensiones inicializadas: `postgis`, `postgis_topology`, `timescaledb` (`infra/docker/initdb/01_extensions.sql`).
- **Inconsistencia**: `.env` define `DATABASE_URL=postgresql://cerebrovial:cerebrovial_pass@db:5432/cerebrovial` apuntando a host `db`, pero el servicio en compose se llama **`db_postgres`** → en docker network el hostname `db` no resuelve. La conexión sólo funcionaría desde fuera del compose si se agrega un alias o si se renombra el servicio.
- ORM: SQLAlchemy + GeoAlchemy2 (`Geometry('POINT', srid=4326)`, `Geometry('LINESTRING', srid=4326)`).
- Modelos definidos en `core_management_api/src/common/database/models.py` y `edge_device/src/common/database/models.py` — **byte-idénticos**: `GraphNodeDB`, `GraphEdgeDB`, `CameraDB`, `WazeJamDB`, `WazeAlertDB`, `VisionTrackDB`, `VisionFlowDB`. Comentarios `# Part of PK for hypertable` indican intención TimescaleDB pero **no hay sentencia `create_hypertable(...)`** en ningún archivo.
- **`init_db()` definido pero nunca llamado** (`core_management_api/src/common/database/database.py:24-28` y duplicado en `edge_device`). En la práctica las tablas no se crean.
- **En runtime, el predictor no usa Postgres**: `core_management_api/src/prediction/application/predictor.py:13-15` usa `CSVLoader(data_dir="data/traffic_logs")`. La capa de visión persiste vía `csv_repository.py` (no SQLAlchemy).

**MongoDB**
- Servicio `db_mongo: image: mongo:latest` en compose, pero **cero imports** de `motor` o `pymongo` en el código. No lo consume nadie.

**Redis / SQLite**: no están.

**Migraciones**
- `alembic` declarado en `requirements.txt` pero **no existe `alembic.ini`, ni carpeta `alembic/`, ni `migrations/`**. Hay 0 migrations.
- Solo SQL es `01_extensions.sql`.

**Seeds**
- Sin `seed.py`/`fixtures/`/`init.sql` con datos.
- `core_management_api/scripts/` tiene `generate_camera_data.py`, `generate_waze_data.py`, `generate_training_data.py`, `train_models.py` que producen CSV/joblib en disco; no insertan en BD.
- `ia_prediction_service/data/locations.csv` es un CSV estático de coords (probablemente MetrLA).

**Resumen "quién accede a qué"**:
- core_management_api → declara Postgres, **no lo usa** (CSV+joblib en runtime).
- edge_device → declara Postgres con tablas idénticas, **no lo usa** (CSV repository).
- ia_prediction_service → ninguna BD del compose; entrena con dataset MetrLA externo.
- db_mongo → nadie.

---

## 7. Cómo se levanta y se testea

**Levantar todo**: `docker compose up` desde la raíz. Pero hoy:
- `core_management_api` **crashea** al arrancar (`src.main:app` no existe).
- `ia_prediction_service` **crashea** (`main.py` no existe).
- `db_mongo` arranca pero está ocioso.
- `api_gateway` arranca con nginx default (no útil).
- Solo `edge_device` y `db_postgres` levantan funcionales.

**Levantar `edge_device` aislado** (sin docker): `cd edge_device && pip install -r requirements.txt && python scripts/run_server.py` (Hydra + 4 cámaras YouTube hardcoded en `edge_device/scripts/run_server.py:23-28`).

**Levantar `core_management_api` aislado**: `cd core_management_api && pip install -r requirements.txt && python scripts/run_prediction.py` (NO `uvicorn src.main:app` como dice el Dockerfile).

**Levantar `ia_prediction_service`**: no hay servidor; correr `python scripts/train.py` o abrir `notebooks/main.ipynb`.

**Levantar `frontend_ui`**: `cd frontend_ui && npm install && npm run dev` (Vite). Tiene que apuntar a `localhost:8000` y `localhost:8001` corriendo manualmente.

**Tests por servicio**:
- core_management_api: `cd core_management_api && pytest tests/`
- edge_device: `cd edge_device && pytest tests/` (12+ tests entre unit e integration, hay `conftest.py`)
- ia_prediction_service: `cd ia_prediction_service && pytest tests/` (uno de los 3 está vacío)
- frontend_ui: `npm run test` o `npm run test:coverage` (vitest)

**Tests globales**: **no hay runner global**. Sin `Makefile`, sin `Taskfile.yml`, sin scripts raíz. Hay que entrar a cada carpeta.

**Lint/format**: solo el frontend tiene ESLint configurado (`npm run lint`). No hay `black`, `ruff`, `flake8`, `mypy`, `pre-commit` configurados en ningún lado.

**CI**: **no existe `.github/workflows/`**, ni `.gitlab-ci.yml`, ni Jenkins. Cero pipelines.

---

## 8. Mapa de migración del proyecto original

| Componente original | Ubicación actual | Estado |
|---|---|---|
| Pipeline visión YOLO + tracking + zones | `edge_device/src/vision/` — `infrastructure/detection/yolo_detector.py` (ultralytics.YOLO), `infrastructure/tracking/supervision_tracker.py` (sv.ByteTrack), `infrastructure/zones/zone_counter.py` (sv.PolygonZone), `infrastructure/tracking/speed_estimator.py` | Migrado bien. DDD aplicado (domain/application/infrastructure/presentation). Pesos `edge_device/yolo11n.pt` |
| Multi-camera manager + SSE streaming | `edge_device/src/vision/application/services/multi_camera.py` (`MultiCameraManager`), `edge_device/src/vision/infrastructure/broadcast/realtime_broadcaster.py` (`RealtimeBroadcaster` pub/sub asyncio), `edge_device/src/vision/presentation/api/routes/streaming.py` (SSE), `edge_device/src/vision/presentation/api/routes/video.py` (MJPEG) | Migrado. Las 4 cámaras YouTube están hardcoded en `scripts/run_server.py` |
| Modelo STGNN del Predictor (tsl + Lightning) | `ia_prediction_service/src/models/time_then_space.py` (`TimeThenSpaceModel` con `RNN`, `MLPDecoder`, `NodeEmbedding`, `DiffConv`), `ia_prediction_service/src/training/predictor.py` (`tsl.engines.Predictor` + `MaskedMAE`), `ia_prediction_service/scripts/train.py` | Migrado a nivel código pero **desconectado del flujo end-to-end**: no hay HTTP wrapper. El frontend no consume STGNN |
| Checkpoints entrenados (.ckpt) | `ia_prediction_service/notebooks/logs/` — 5 archivos `.ckpt` (hasta `epoch=79-step=30800.ckpt`) | Presentes pero en una ruta de "logs", no en una ruta servible. Ningún servicio los carga |
| Domain entities de prediction | `core_management_api/src/prediction/domain.py` — `NodeFeatures`, `EdgeFeatures`, `TrafficGraph`, `CongestionPrediction` (dataclasses con torch tensors) | Presente. Pero la app real usa RandomForest joblib, no estos grafos |
| Domain entities de control | `core_management_api/src/control/domain.py` — `TrafficLightState`, `TrafficLightPhase`, `IntersectionControlPlan` (29 líneas) | **STUB**. Sin application/infrastructure/presentation. Sin lógica de cambio de fase |
| Schemas Pydantic | `core_management_api/src/prediction/presentation/api/schemas.py` (`PredictionInput`, `PredictionOutput`, `HistoryResponse`, etc.), `core_management_api/src/common/schemas/{vision,graph,camera,waze}.py` (idénticos a `edge_device/src/common/schemas/`) | Migrados. Duplicados |
| Frontend React + vistas | `frontend_ui/src/components/views/` — `DashboardView` (265 líneas), `CameraDetailView` (337), `AnalyticsView` (113), `AlertsView` (45), `AdminView` (46) | Migrado. **Sin react-router** (navegación por `useState('activeTab')` en `frontend_ui/src/App.tsx`) |
| Mapa Leaflet | `frontend_ui/src/components/views/DashboardView.tsx:4-19` (`MapContainer`, `TileLayer`, `Marker`, `Popup`, `useMap`, `Tooltip`); coords de cámaras hardcoded en `frontend_ui/src/components/views/DashboardView.tsx:30-34` | Migrado |
| Predictor real en producción | `core_management_api/models/traffic_rf_{class,reg}_{15,30,45min,current}.joblib` (8 archivos RandomForest sklearn) cargados por `core_management_api/src/prediction/infrastructure/models.py` | **Nuevo**: aparece RandomForest que no estaba descrito en el plan. Es lo único que se sirve por API hoy |
| Auth JWT | — | **No migrado**. Solo deps en `requirements.txt`, cero código |

---

## 9. Comparación contra el plan de 4 semanas

### Sprint 1 — Docker Compose + DB migrations + API unificada + JWT auth + traffic endpoints
- ✅ Docker Compose existe (`docker-compose.yml`) con 5 servicios.
- ❌ **DB migrations**: alembic declarado pero sin `alembic.ini`, sin `migrations/`, sin DDL real más allá de extensiones. Tablas se "crearían" con `Base.metadata.create_all` que nadie llama.
- 🟡 **API unificada**: hay endpoints (`/predictions/predict`, `/predictions/history/{id}`) en core_management_api y `/stream/{id}`, `/video/{id}` en edge_device, pero llegan al frontend desde dos backends distintos sin gateway funcional. Lo opuesto a "unificada".
- ❌ **JWT auth**: no implementado (deps presentes, código ausente). CORS abierto.
- 🟡 **Traffic endpoints**: existen los de predicción y streaming, no hay endpoints de gestión de cámaras / intersecciones en una API REST consistente.
- ❌ **Bloqueante**: el contenedor de core_management_api no arranca con el CMD actual.

### Sprint 2 — FastAPI wrapper Predictor + módulo prediction + control adaptativo + frontend conectado
- ❌ **FastAPI wrapper del Predictor STGNN**: no existe. El servicio que debería envolverlo (`ia_prediction_service`) no tiene HTTP. Los `.ckpt` no se cargan desde ningún sitio.
- 🟡 **Módulo prediction**: existe en `core_management_api/src/prediction/`, pero usa **RandomForest sklearn**, no el STGNN. Es un sustituto, no un wrapper.
- ❌ **Control adaptativo**: solo dataclasses (`core_management_api/src/control/domain.py`). Pieza central de la tesis (OE03/OE04) no implementada.
- ✅ **Frontend conectado**: sí consume la API de predicción y los streams del edge.

### Sprint 3 — Analytics/Alertas/Admin con datos reales + reportes + auditoría + contingencia
- 🟡 **Vistas Analytics/Alerts/Admin**: existen (`frontend_ui/src/components/views/AnalyticsView.tsx`, `AlertsView.tsx`, `AdminView.tsx`) pero el código sugiere mocks/data dummy (Alerts y Admin son cortos: 45 y 46 líneas) — necesita validación con tu compañero.
- 🟡 **Reportes**: hay `frontend_ui/src/components/modals/ReportModal.tsx` que llama a Gemini para generar reportes (no es un endpoint propio); no hay export a PDF/Excel evidente.
- ❌ **Auditoría**: sin tablas de audit log, sin endpoints, sin código.
- ❌ **Contingencia ante fallos de sensores/cámaras**: no encontré evidencia de circuit breaker, retries con backoff, fallback de cámara o detección de cámara caída.

### Sprint 4 — Tests E2E + CI/CD + Grafana + comparación antes/después + docs
- ❌ **Tests E2E**: cero (sin Playwright/Cypress).
- ✅ **Tests unitarios**: edge_device tiene 12+ tests reales en `unit/` e `integration/`; core_management_api tiene tests de routes/predictor/schemas; frontend tiene 2 archivos vitest. Cobertura desigual.
- ❌ **CI/CD**: no existe `.github/workflows/` ni equivalente.
- ❌ **Grafana**: no aparece en compose ni en `infra/`.
- ❌ **Comparación antes/después**: no hay datasets de baseline ni endpoints/dashboards comparativos.
- 🟡 **Docs**: hay `DOCUMENTACION.md` (24 KB), `evidence_report.md`, `CLAUDE.md.old`, README en algunos servicios; pero nada actualizado al refactor (el README de core_management_api sigue diciendo "Monolito Modular").

**Síntesis**: el refactor avanzó la estructura (carpetas, Dockerfiles, frontend completo, predicción funcional aunque con RF en vez de STGNN, visión real con YOLO) pero dejó deuda en los puntos críticos del plan: control adaptativo, JWT, migrations, CI/CD, gateway funcional, Grafana, E2E. Y sumó dos arranques rotos en Docker.

---

## 10. Riesgos y zonas frágiles

**Bloqueantes (rompen `docker compose up`)**:
1. **`core_management_api` Dockerfile invoca un módulo inexistente**: `core_management_api/Dockerfile` → `CMD ["uvicorn", "src.main:app", ...]` pero `src/main.py` no existe (solo hay `__init__.py` vacío). El entry point real es `scripts/run_prediction.py`.
2. **`ia_prediction_service` Dockerfile invoca `main.py` inexistente**: `ia_prediction_service/Dockerfile` → `CMD ["python", "main.py"]`. No hay `main.py` ni servidor HTTP en el servicio.
3. **`.env` `DATABASE_URL=...@db:5432/...`** pero el servicio compose se llama `db_postgres`. Hostname incorrecto en docker network.

**Bugs de import / código que falla en runtime**:
4. `edge_device/src/vision/presentation/legacy_api.py` importa `..application.pipeline` y `..infrastructure.visualization` que no existen en la estructura actual (la pipeline está en `application/pipelines/`, el visualizer en `presentation/visualization/`). Probablemente no se carga, pero si alguien lo importa, ImportError.
5. `ia_prediction_service/src/models/time_then_space.py` define `print_architecture` a nivel módulo y `create_model` la invoca como método (`model.print_architecture()`), con la línea de monkey-patch comentada → AttributeError si se llama.

**Deuda visible**:
6. **`src/common/` byte-idéntico** entre `edge_device` y `core_management_api` (database, models, schemas/{vision,graph,camera,waze}, logging, metrics). Cualquier cambio se hace dos veces.
7. **`requirements.txt` idéntico** en core_management_api y edge_device (23 paquetes incluyendo torch + ultralytics + opencv en core, sobre-instalación).
8. **TimescaleDB declarado como hypertable en comentarios** pero sin `create_hypertable` en código → TimescaleDB se ejecuta pero sus tablas son Postgres normales.
9. **`alembic` listado, sin `alembic.ini` ni migrations** → no es funcional.
10. **API gateway nginx vacío** → `docker-compose.yml` lo declara con volumen comentado y no existe el directorio `api_gateway/`.
11. **MongoDB en compose, no usado por nadie**.
12. **Frontend con 3 URLs hardcoded** (`localhost:8000`, `localhost:8001`, Gemini directo) y sin `import.meta.env`. Imposible cambiar por entorno sin recompilar.
13. **Frontend sin react-router** → URL no refleja la vista activa, no hay deep-linking ni navegación con back button.
14. **Cero auth/RBAC**: deps de JWT/passlib presentes pero sin código. El sistema está completamente abierto.
15. **CORS `allow_origins=["*"]` con `allow_credentials=True`** en `core_management_api/scripts/run_prediction.py:16-22` — combinación insegura (los browsers la rechazan).
16. **Cero CI/CD**.
17. **Pesos YOLO comiteados al repo** (`edge_device/yolo11n.pt`, 5.6 MB) y **5 checkpoints `.ckpt`** en `ia_prediction_service/notebooks/logs/`. No hay LFS. Cualquier nuevo entrenamiento engordará el repo.
18. **Predictor real es RandomForest sklearn**, no el STGNN entrenado. Si la tesis afirma "predicción con GRU/STGNN", el demo end-to-end no la respalda hoy.
19. **Cámaras YouTube hardcoded** en `edge_device/scripts/run_server.py:23-28` y coords hardcoded en `frontend_ui/src/components/views/DashboardView.tsx:30-34` — fuera de DB, fuera de config.
20. **Artefactos sueltos en raíz**: `tmp_docx_output.txt` (374 KB), `tmp_docx_utf8.txt` (188 KB), `tmp_read_docx.py`, `generate_evidence.py`, `evidence_report.md`, `CLAUDE.md.old`, `diagrama_vial[_2].html`. Repo "ensuciado".

**Secretos potenciales — NO se reproducen, solo se apunta el archivo**:
- `.env` (raíz) — contiene `DATABASE_URL` con credenciales en texto plano y está versionado en git (revisar si está en `.gitignore`; en el listado raíz aparece, eso es señal de que sí entró al repo).
- `frontend_ui/src/components/widgets/AIChatWidget.tsx` y `frontend_ui/src/components/modals/ReportModal.tsx` — patrón `const apiKey = ""` para Gemini en el bundle. Hoy vacío; si alguien lo llena, queda expuesto a cualquier devtools.

**Código crítico que no debería tocarse sin pedir** (porque rompe rápido y hay tests cubriendo):
- `edge_device/src/vision/` — todo el subsistema DDD de visión está bien armado y con tests; cambios estructurales rompen el pipeline real.
- `ia_prediction_service/src/models/time_then_space.py` y `ia_prediction_service/src/training/predictor.py` — definen el modelo entrenado; cambios invalidan los `.ckpt`.

---

## 11. Preguntas abiertas para el compañero

1. **`core_management_api/Dockerfile` apunta a `src.main:app` que no existe — ¿es un bug pendiente o el plan era renombrar `scripts/run_prediction.py`?** Hoy `docker compose up` no arranca este servicio.
2. **`ia_prediction_service/Dockerfile` apunta a `main.py` que no existe y el servicio no tiene FastAPI/Flask — ¿la intención era envolver el predictor STGNN en una API HTTP y se quedó pendiente, o el servicio es deliberadamente solo un pipeline de entrenamiento offline?**
3. **El predictor que sirve la API es un RandomForest sklearn (`core_management_api/models/traffic_rf_*.joblib`), no el STGNN entrenado. ¿Es un fallback temporal mientras se conecta el STGNN, o la decisión fue cambiar de modelo y descartar el STGNN?** Esto afecta la narrativa de la tesis (capítulo 9.2 del CLAUDE original).
4. **El módulo `control` está stub. ¿Hay rama o branch separado con la implementación, o es el siguiente sprint?** El control adaptativo es OE03+OE04 de la tesis; sin él no hay validación de la hipótesis.
5. **`.env` tiene `DATABASE_URL=postgresql://...@db:5432/...` pero el servicio compose se llama `db_postgres`. ¿Es errata o se usaba un alias en otra versión del compose?**
6. **`api_gateway` con nginx sin config y sin directorio `api_gateway/` — ¿estaba planeado un nginx.conf que falta, o se descartó la idea de gateway?** El frontend hoy llama directo a 8000 y 8001 saltándose el gateway.
7. **MongoDB está en compose pero nadie lo usa. ¿Se planeaba para logs/configs (como dice el CLAUDE original) y se quedó sin implementar, o se puede borrar del compose?**
8. **`alembic` está en `requirements.txt` pero no hay `alembic.ini` ni `migrations/`. ¿Las migrations viven en otra rama, o el schema vive solo en `Base.metadata.create_all` (que nadie llama)?**
9. **`edge_device/src/common/` y `core_management_api/src/common/` son byte-idénticos. ¿Está pensado un paquete compartido (ej. `shared/`, librería pip local) o aceptan la duplicación?**
10. **`edge_device` se llama "edge" pero corre `python:3.11-slim` x86 con `torch` full y `ultralytics` (no aarch64, sin `tflite`, sin `picamera`). ¿La intención es que corra en Raspberry Pi en algún momento, o "edge" es solo un nombre conceptual?**
11. **`ia_prediction_service` entrena con dataset MetrLA (Los Angeles, 207 sensores). ¿Hay plan de fine-tunear con datos de Miraflores, o el modelo final será MetrLA y se demuestra como prueba de concepto?**
12. **Frontend sin variables de entorno y URLs hardcoded a `localhost:8000/8001`. ¿Está pensado configurar `VITE_API_URL` antes de prod, o el alcance del proyecto es solo demo local?**
13. **El frontend llama a Gemini directamente desde el browser con `apiKey = ""`. ¿La idea es que el usuario pegue su key, o se va a mover a un endpoint backend antes de la entrega?**
14. **No hay `.github/workflows/`. ¿CI/CD está en otra plataforma (Azure Pipelines, GitLab) o se descartó del alcance?**
15. **`yolo11n.pt` (5.6 MB) y 5 `.ckpt` están comiteados sin LFS. ¿Hay plan de migrar a Git LFS o a un blob storage antes de la entrega?**
16. **El branch actual es `analysis/initial-discovery`. ¿Es una rama de assessment, una rama del compañero, o la rama "viva" del proyecto?** El último commit es del compañero ("modified: storage limit for containers").
17. **`legacy_api.py` en `edge_device` tiene imports rotos (`..application.pipeline`, `..infrastructure.visualization` que no existen en la estructura actual). ¿Se puede borrar o todavía hay algo que dependa de él?**
18. **Las 4 cámaras YouTube hardcoded en `edge_device/scripts/run_server.py:23-28` y las 4 coords en `DashboardView.tsx:30-34`. ¿La idea es moverlo a la BD `cameras` que ya está modelada, o quedarse con datos demo?**
19. **`evidence_report.md`, `generate_evidence.py`, `tmp_docx_*.txt`, `diagrama_vial*.html`, `CLAUDE.md.old` en raíz. ¿Son entregables de la tesis o restos que se pueden mover a `documentation/`?**
20. **El CLAUDE.md original menciona Azure (Blob Storage para modelos, deploy en Azure). No hay Azure en el repo. ¿La meta es deploy local docker-only o todavía aplica Azure y se hará al final?**
