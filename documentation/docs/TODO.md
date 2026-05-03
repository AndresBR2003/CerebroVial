BLOQUE A — Decisiones y comunicación (no es código, es lo más importante)

 [x]A1. Llamar a tu compañero. Mostrarle el assessment, este plan, las decisiones sensibles. Acordar reparto de trabajo: vos código, él documento de tesis (recomendado).
 [x]A2. Llamar al asesor de tesis. Tres preguntas concretas: (1) ¿podemos actualizar los números 88.2% / 81.3% / <2s tras validación real?; (2) ¿es aceptable demostrar "arquitectura desplegable en Pi" sin entregar Pi física?; (3) ¿demo local con plan de deploy en Azure cubre la "arquitectura híbrida" del documento?
 [x]A3. Decidir formalmente: el modelo es GRU (una arquitectura RNN). Documentarlo en un commit de tesis o en docs/DECISIONS.md.
 [x]A4. Acordar con el compañero el refinamiento del backlog (mover HU04 al Sprint 2, reducir alcance de HU07, distribuir SP de forma pareja).


BLOQUE B — Fase 0: Documentación honesta del estado actual (objetivo: lunes 4)

 [x] B1. Mergear analysis/initial-discovery a main con el assessment incluido como docs/ARCHITECTURE_DISCOVERY.md.
 [x] B2. Mover el CLAUDE.md antiguo del compañero a docs/SPEC.md (es la especificación target, no el estado actual).
 [x] B3. Crear el nuevo CLAUDE.md raíz con el contenido del mensaje anterior, ajustado a las decisiones tomadas (monolito modular, GRU, docker local).
 [x] B4. Crear docs/PLAN.md con las 4 fases del plan que te pasé.
 [x] B5. Crear docs/TODO.md con esta misma lista para que sea trackeable.
 [x] B6. Crear docs/DECISIONS.md con las 5 decisiones tomadas (monolito, GRU, local docker, Pi conceptual, números reales tras validación). Cada una con fecha y justificación de una línea.
 [x] B7. Crear docs/BACKLOG_V2.md con el backlog refinado (resultado de A4).
 [x] B8. Verificar que .env esté en .gitignore. Si está versionado, rotar credenciales y agregarlo al ignore.
 [x] B9. Agregar al .gitignore: .claude/settings.local.json, .claude/projects/, tmp_*.txt, tmp_*.py, *.docx excepto los que estén en documentation/tesis/.
 [x] B10. Borrar CLAUDE.md.old (ya no es necesario, el contenido vive en docs/SPEC.md).
 [x] B11. Commit final del bloque B con mensaje [Fase 0] Documentación de estado y plan.


BLOQUE C — Fase 1: Estabilización del repo (objetivo: lunes 4 o domingo 3)
Cada ítem es una sesión separada de Claude Code, en plan mode primero.

 [x] C1. Consolidar common/ en un solo lugar: crear shared/ (o cerebrovial_common/) en la raíz con pyproject.toml mínimo, mover el contenido de core_management_api/src/common/ ahí, instalar como paquete pip local en ambos servicios (pip install -e ../shared), borrar el common/ duplicado de edge_device/. Verificar que tests siguen pasando.
 C1.1. Resolver duplicación de setup_logger: definida en logging.py (con param `level`) y en utils.py (INFO hardcoded). Decidir cuál queda, eliminar la otra, actualizar imports.
 [x] C1.4 — Marcar `test_pipeline_processing_flow` como xfail (deuda preexistente). Race condition confirmada en commit 0e20b0b4. Decorador aplicado, tracked como C1.5.
 C1.6 — Arreglar tests de MultiCameraManager. CameraInstance perdió los atributos `camera_id` e `is_running` en el refactor de microservicios. Decidir: o se restauran los atributos en CameraInstance, o se actualizan los tests para reflejar la nueva API. Confirmar antes con compañero. Prioridad media — afecta 2 tests, no bloquea Fase 1.
 C1.7 — Arreglar SmartDetectionProcessor. La lógica de interpolación y de trayectorias de vehículos no funciona después del refactor (test_interpolation_logic, test_trajectory_update). Investigar si es bug real del processor o si los tests asumen API vieja. Prioridad alta — afecta el flujo de detección, debe resolverse antes de Fase 3 (donde se entrena el GRU con datos producidos por este pipeline).
 C1.8 — Arreglar ZoneCounter. test_zone_manager_update muestra que no detecta vehículos dentro del polígono cuando debería. Investigar si es bug del polygon contains o de cómo se calcula el centroide del bbox. Prioridad alta — el conteo por zonas es funcionalidad central del módulo de visión.
 C1.5 — Investigar y arreglar `test_pipeline_processing_flow` en edge_device. Race condition pre-existente entre `finally: pipeline.stop()` y el thread de procesamiento de `AsyncVisionPipeline`. Confirmado preexistente comparando con commit 0e20b0b4. Marcado xfail temporalmente. Prioridad media — no bloquea, pero conviene resolver antes de Fase 3.
 [x] C2. Crear core_management_api/src/main.py como entry point real de FastAPI con routers de prediction y control montados. Actualizar el Dockerfile de core_management_api para que apunte a src.main:app. Mantener scripts/run_prediction.py como entry alternativo de dev.
 [x] C3. Sacar ia_prediction_service del docker-compose.yml. Documentar en su README cómo correrlo manualmente para entrenar.
 [x] C4. Renombrar el servicio compose db_postgres → db (o cambiar el .env para que use db_postgres). Lo que sea menos invasivo.
 [x] C5. Sacar db_mongo del docker-compose.yml. Documentar en docs/DECISIONS.md que MongoDB se reemplaza por PostgreSQL+TimescaleDB para todo (incluyendo logs).
 [x] C6. Sacar api_gateway del docker-compose.yml. Borrar la referencia al directorio inexistente.
 [x] C7. Limpiar core_management_api/requirements.txt: sacar torch, ultralytics, opencv-python, supervision, hydra-core, cap_from_youtube, imageio-ffmpeg, streamlink, shapely. Mantener fastapi, uvicorn, sqlalchemy, geoalchemy2, alembic, numpy, pandas, scikit-learn, psycopg2-binary, sse-starlette, python-jose[cryptography], passlib[bcrypt], httpx, python-multipart.
 [ ] C7.5 — Deuda arquitectónica: existe código STGNN (`models.py` con STGCNModel) dentro de `core_management_api/src/` que debería vivir en `ia_prediction_service` o eliminarse cuando se reemplace por GRU. Hoy fuerza a `core_management_api` a depender de torch (~2 GB en imagen Docker). Resolverlo en Fase 3 (Block F) cuando se migre el predictor a GRU. Prioridad media — no bloquea, pero la separación de responsabilidades del backend queda debilitada hasta entonces.
 [x] C8. Limpieza de raíz: mover evidence_report.md, diagrama_vial*.html, DOCUMENTACION.md a documentation/. Borrar tmp_docx_output.txt, tmp_docx_utf8.txt, tmp_read_docx.py, generate_evidence.py.
 [x] C9. Configurar Git LFS para binarios + limpiar checkpoints intermedios. LFS aplicado a 13 binarios (.joblib, .pt, .ckpt, .h5, .npy, .docx). Borrados 4 .ckpt intermedios del STGNN (~48 MB). Solo queda epoch=79-step=30800.ckpt como referencia.
 [ ] **C9.5** — Evaluar migración de `metr_la.h5` y `metr_la_dist.npy` de LFS a download-on-demand. MetrLA es un dataset público estándar; `tsl` library tiene helpers para descargarlo. Sacarlo del repo libera ~12 MB de LFS y normaliza el flujo de datasets externos. Resolver en Fase 3 cuando se trabaje con el predictor.
 C10. Verificar que docker compose up levanta db, core_management_api y edge_device sin crashes. Frontend con npm run dev puede llamar a los endpoints existentes.
 C11. Crear un Makefile o tasks.py raíz con comandos: make up, make down, make test, make lint. Trivial pero ahorra mucho tiempo a futuro.
 C12. Commit final del bloque C: [Fase 1] Estabilización: docker compose up funciona end-to-end.


BLOQUE D — Avance del lunes 4 (preparación)

 D1. Ensayo del avance: levantar docker compose up en una máquina limpia. Si falla, arreglar antes de presentar.
 D2. Preparar 5 capturas: (1) docker compose up corriendo, (2) frontend mostrando dashboard, (3) detalle de cámara con stream, (4) árbol de directorios limpio, (5) docs/PLAN.md abierto con las fases.
 D3. Slide o documento de 1 página resumiendo: "encontramos deuda técnica del refactor, hicimos assessment, plan de remediación, fase 1 completa, próximas fases hasta el 11 de mayo".
 D4. Presentar el avance.


BLOQUE E — Fase 2: Cimientos reales (objetivo: lunes 11)
Cada ítem es sesión separada de Claude Code.

 E1. Inicializar Alembic en core_management_api: alembic init alembic, configurar alembic.ini con la URL de .env, configurar env.py para leer los modelos de shared/database/models.py.
 E2. Generar la primera migración con todas las tablas modeladas: alembic revision --autogenerate -m "initial schema". Revisar el SQL generado antes de aplicar.
 E3. Generar segunda migración para activar TimescaleDB hypertables sobre vision_tracks, vision_flows, waze_jams, waze_alerts. Esto es SQL manual: SELECT create_hypertable('vision_tracks', 'timestamp');.
 E4. Borrar la función init_db() que nadie llama. Las tablas ahora se crean con alembic upgrade head.
 E5. Crear scripts/seed.py con datos reales de Miraflores: 5 intersecciones (Av. Larco, Av. José Pardo, Av. Angamos, Av. Arequipa, Av. del Ejército) con sus coordenadas reales, las 4 cámaras con sus URLs YouTube, un usuario admin de prueba.
 E6. Modificar el frontend DashboardView.tsx para que las coordenadas de cámaras vengan de GET /api/intersections en lugar de estar hardcoded.
 E7. Crear modelo User en shared/database/models.py: id, email, password_hash, role (operador / analista / admin), created_at.
 E8. Implementar endpoint POST /api/auth/login: recibe email + password, valida con passlib, retorna JWT con python-jose.
 E9. Crear dependency get_current_user que valida el JWT en headers. Crear require_role(role) para endpoints protegidos por rol.
 E10. Aplicar get_current_user a las rutas existentes de prediction y vision. Decidir cuáles van por rol (admin para CRUD usuarios, todos los roles para lectura, etc.).
 E11. Cerrar CORS: cambiar allow_origins=["*"] por ["http://localhost:5173"] (Vite dev) y la URL prod cuando exista.
 E12. Crear LoginView.tsx en frontend, AuthContext con el JWT, apiClient axios con interceptor que agrega el token a cada request.
 E13. Reemplazar URLs hardcoded localhost:8000/localhost:8001 por import.meta.env.VITE_API_BASE_URL. Crear frontend_ui/.env.example.
 E14. Mover la API key de Gemini a core_management_api: crear endpoint POST /api/ai/chat que recibe el prompt y llama a Gemini con la key del .env del backend. Frontend llama a este endpoint, no directo a Gemini.
 E15. Crear frontend_ui/Dockerfile multi-stage: build con node:20, serve con nginx:alpine. Agregarlo a docker-compose.yml como servicio frontend.
 E16. Verificar end-to-end: docker compose up levanta todo, podés hacer login, ver dashboard con datos de seed.
 E17. Commit final del bloque E: [Fase 2] Cimientos: alembic, seed, JWT, frontend configurable.


BLOQUE F — Fase 3a: GRU básico funcional (objetivo: lunes 11, junto con E)
Esta es la parte que más vamos a discutir en chat antes de delegar a Claude Code.

 F1. Conmigo en chat: definir la especificación del modelo GRU. Inputs (ventana temporal de qué features), outputs (clasificación de 5 niveles de congestión a 15/30/45 min), arquitectura (capas, hidden size), función de pérdida, métricas. Salida: docs/MODEL.md.
 F2. Crear ia_prediction_service/scripts/generate_synthetic_data.py: genera dataset sintético para entrenar el GRU. Patrones realistas (hora pico AM/PM, fines de semana distintos, ruido). Output: CSV con la misma estructura que produce el módulo de visión.
 F3. Crear ia_prediction_service/src/models/gru_model.py: clase CongestionGRU con PyTorch Lightning, nn.GRU interno, encoder/decoder lineales.
 F4. Adaptar ia_prediction_service/src/training/predictor.py (o crear nuevo) para entrenar el GRU sobre el dataset sintético.
 F5. Entrenar la primera versión. Métrica objetivo: accuracy ≥ 70% (luego iteramos para llegar al 80% del IE04). Guardar el .pt en ia_prediction_service/models/gru_v1.pt.
 F6. En core_management_api: crear prediction/infrastructure/gru_predictor.py que carga el .pt y hace inferencia. Mantener el RandomForestPredictor actual como fallback con flag de configuración.
 F7. Modificar el endpoint POST /api/predictions/predict para usar GRUPredictor por defecto. Documentar el fallback a RF en docs/DECISIONS.md.
 F8. Validar que el frontend sigue funcionando con el nuevo predictor.
 F9. Commit: [Fase 3a] GRU básico entrenado y servido.


BLOQUE G — Entregable del lunes 11 (preparación)

 G1. Escribir el README raíz definitivo con quickstart de 5 pasos y diagrama de arquitectura.
 G2. Probar entregable en máquina limpia: git clone, docker compose up, npm install && npm run dev, login, ver predicción del GRU.
 G3. Grabar video corto de 2-3 min mostrando el flujo. Útil para entrega y para defensa.
 G4. Entregar.


BLOQUE H — Fase 3b: Control adaptativo (semana del 12)
Acá está OE03 demostrando.

 H1. Conmigo en chat: definir las reglas del control adaptativo. Qué umbrales, qué acciones. Salida: docs/CONTROL.md.
 H2. Implementar control/application/rules_engine.py: dado un estado de tráfico + predicción GRU, retorna un IntersectionControlPlan modificado.
 H3. Implementar control/infrastructure/plan_repository.py: CRUD de planes en BD.
 H4. Endpoints GET /api/control/intersections/{id}/current-plan, POST /api/control/recompute, GET /api/control/history.
 H5. Tabla de auditoría: cada cambio de plan se registra con timestamp, intersección, plan anterior, plan nuevo, predicción que lo motivó, usuario (o "sistema"). Esto cubre HU09.
 H6. Frontend: vista nueva o widget en IntersectionDetail que muestra plan actual, próximo cambio sugerido, historial.
 H7. Tests del motor de reglas (escenarios concretos: alta saturación → +verde en avenida principal, etc.).
 H8. Commit: [Fase 3b] Control adaptativo funcional.


BLOQUE I — Fase 4a: HU pendientes priorizadas (semana del 19)

 I1. HU17 — Alertas: tabla alerts en BD, endpoint POST /api/alerts, GET /api/alerts, conexión SSE para push en tiempo real al frontend.
 I2. Frontend AlertsView.tsx con datos reales (hoy es de 45 líneas con mocks).
 I3. HU03 — Contingencia: health checks periódicos a cámaras, si una falla → fallback a plan fijo + alerta automática.
 I4. HU12 — Reportes: endpoint GET /api/reports/daily?date=... que genera PDF con KPIs del día. Cron que lo genere a las 00:00.
 I5. HU06 — Comparación antes/después: endpoint que compara métricas con y sin sistema (con datos sintéticos del simulador). Vista frontend con gráficos.
 I6. Frontend AdminView.tsx con datos reales (hoy también es 46 líneas mock): CRUD usuarios, panel de salud (GET /api/health).
 I7. Frontend AnalyticsView.tsx conectado a GET /api/traffic/history (TimescaleDB).
 I8. Commit: [Fase 4a] HU pendientes integradas.


BLOQUE J — Fase 4b: Validación, tests, CI (semana del 26)

 J1. Mejorar dataset sintético del GRU para que llegue a 80% accuracy. Iterar arquitectura/hyperparams si es necesario. Documentar el experimento.
 J2. Medir latencia real de YOLO + transmisión + dashboard. Si supera 2s, optimizar (frame skipping, resolución más baja). Documentar.
 J3. Medir precisión de detección de YOLO en video de prueba. Documentar.
 J4. Decisión documental: actualizar números del documento de tesis con los reales (no usar 88.2% / 81.3% si los reales son distintos). Esto es lo más importante para la integridad académica.
 J5. Tests E2E con pytest+httpx: login → consulta intersecciones → trigger predicción → consulta plan → log de auditoría.
 J6. GitHub Actions workflow: lint con ruff, tests backend con pytest, tests frontend con vitest, build de imágenes Docker. Sin deploy.
 J7. Configurar pre-commit: ruff, black, eslint. Opcional pero útil.
 J8. Documentar limitaciones del demo en el README (datos sintéticos, no Pi real, no Azure, etc.) y plan de productivización.
 J9. Commit: [Fase 4b] Validación + CI + métricas reales.


BLOQUE K — Cierre y defensa (semana del 2 de junio)

 K1. Ensayo de defensa con el sistema corriendo. Probar que se levanta en máquina limpia.
 K2. Actualizar capítulos de la tesis: arquitectura entregada, modelo GRU con resultados reales, control adaptativo justificado, métricas de validación.
 K3. Capturas finales y diagrama de arquitectura limpio para el documento.
 K4. Video demo de 5 minutos: levantar el sistema, login, dashboard, detalle de cámara con YOLO en vivo, predicción GRU, plan adaptativo, auditoría.
 K5. Buffer para arreglos de último momento.
 K6. Defender.