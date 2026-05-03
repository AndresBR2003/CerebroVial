# ia_prediction_service

## Qué es
Pipeline de entrenamiento offline para los modelos de predicción de
tráfico. Basado en PyTorch Lightning + tsl. **NO es un servicio HTTP.**
No tiene FastAPI, no expone endpoints, no se ejecuta como contenedor
permanente.

## Por qué no está en docker-compose.yml
Porque no es un servicio. Se invoca manualmente cuando hace falta
(re)entrenar modelos. Mantenerlo en `docker compose up` rompía el
arranque del sistema entero.

## Cómo correrlo

### Opción A — Sin Docker (desarrollo local)
```bash
cd ia_prediction_service
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python scripts/train.py
```

### Opción B — Con Docker (reproducible, recomendado para CI)
```bash
# Build (desde la raíz del repo)
docker build -f ia_prediction_service/Dockerfile \
             -t cerebrovial-trainer \
             ia_prediction_service/

# Run
docker run --rm \
  -v $(pwd)/models:/app/models \
  cerebrovial-trainer
```

El volumen `-v models:/app/models` es para que el modelo entrenado
quede en el host, no se pierda al cerrar el contenedor.

## Estado actual del modelo
Hoy este pipeline entrena un STGNN. Según `docs/DECISIONS.md`, se va
a reemplazar por GRU en Fase 3. El código del STGNN se mantiene como
referencia hasta que el GRU esté validado.

## Salidas
- Checkpoints en `notebooks/logs/`
- Modelo final en `models/` (montado como volumen si se usa Docker)
