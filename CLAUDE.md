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

## Cómo levantar
`docker compose up` (objetivo Sprint 1; hoy sólo `edge_device` y `db_postgres` 
funcionan vía compose).

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
- NO modificar `ia_prediction_service/src/models/time_then_space.py` ni los 
  `.ckpt` en `notebooks/logs/`. El STGNN se descarta pero el código queda 
  como referencia hasta que el RNN esté funcional.
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