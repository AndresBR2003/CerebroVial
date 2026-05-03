# CerebroVial — Sistema de gestión de tráfico Miraflores

## Contexto
Proyecto de tesis. Sistema predictivo de tráfico para el distrito de Miraflores 
(Lima, Perú). Detección por visión computacional + predicción RNN + control 
adaptativo de semáforos.

## Arquitectura
**Monolito modular**, organizado en carpetas que sugieren microservicios pero 
NO lo son. Todas las carpetas se entienden como módulos del mismo sistema, 
desplegado como un único proceso FastAPI tras Sprint 1.

```
core_management_api/   # módulo: API + predicción + control + common
edge_device/           # módulo: visión computacional (YOLO + tracking + SSE)
ia_prediction_service/ # módulo: entrenamiento del modelo RNN (offline)
frontend_ui/           # SPA React (proceso separado)
infra/                 # SQL, configs de infra
```

## Stack
Backend: Python 3.11, FastAPI, SQLAlchemy + GeoAlchemy2, PostgreSQL + 
PostGIS + TimescaleDB. Vision: ultralytics YOLO + supervision + opencv. 
ML: PyTorch + PyTorch Lightning (modelo RNN). Frontend: React 19 + 
TypeScript + Vite + Tailwind 4 + Leaflet.

## Cómo levantar el proyecto

El repo usa `invoke` (gestor de tareas en Python) para envolver los
comandos frecuentes. Ver lista completa con `invoke --list`.

Setup primer-uso:
1. Tener instalados los prerequisitos (ver README.md raíz).
2. `cp .env.example .env` y completar valores.
3. `pip install invoke`
4. `invoke setup-dev` (crea venv local con deps de dev)
5. `invoke up`

Día a día: `invoke up`, `invoke down`, `invoke logs`, `invoke test`.

NO usar `docker compose ...` directo — `invoke` agrega validaciones
(check de LFS, etc.) que evitan errores crípticos.

## Decisiones tomadas
- **Arquitectura**: monolito modular, NO microservicios. Las carpetas separadas 
  son herencia de cuando había 3 repos.
- **Modelo predictivo**: RNN (alineado al documento de tesis). El STGNN 
  explorado se descarta. El RandomForest actual es temporal hasta que el 
  RNN esté servido.
- **Deploy**: docker local únicamente. No Azure por ahora.

## Reglas para Claude Code
- NO refactorizar `edge_device/src/vision/`. Es el subsistema mejor armado y 
  con tests reales. Tocar sólo cuando se pida explícitamente.
- NO modificar `ia_prediction_service/src/models/time_then_space.py`. El STGNN
  se descarta pero el código queda como referencia hasta que el RNN esté funcional.
  En `notebooks/logs/` solo queda `epoch=79-step=30800.ckpt` (en LFS); los 4
  checkpoints intermedios se borraron en C9.
- NO duplicar más código en `common/`. Hoy `core_management_api/src/common/` 
  y `edge_device/src/common/` son byte-idénticos; eso se consolida en Sprint 1.
- NO instalar `torch` ni `ultralytics` en `core_management_api`. Los 
  `requirements.txt` están sobre-instalados; cualquier limpieza es bienvenida.
- Cuando agregues un endpoint, ubicarlo en el módulo correspondiente y 
  registrarlo en el router unificado de `core_management_api`.
- Antes de cualquier cambio estructural (mover carpetas, renombrar paquetes, 
  cambiar el modelo de la BD), parar y preguntar al usuario.
- Para cambios al modelo predictivo, leer primero el documento de tesis en 
  `documentation/tesis/`.

## Estado del proyecto
Ver `documentation/docs/20260430_ARCHITECTURE_DISCOVERY.md` para el assessment completo del 
estado al 30/04/2026. Ver `documentation/docs/PLAN.md` para el plan de fases actual.
Ver `documentation/docs/DECISIONS.md` para las decisiones técnicas y su justificación.

## Git LFS (requerido)
Este repo usa Git LFS para binarios (.joblib, .pt, .ckpt, .h5, .npy, .docx).
Antes de clonar o pull, instalar git-lfs y configurarlo:

  brew install git-lfs   # macOS
  # o: apt install git-lfs   # Linux Debian/Ubuntu
  git lfs install

Sin LFS, los archivos binarios van a venir como pointers de texto y
`docker compose up` va a fallar al cargar modelos.