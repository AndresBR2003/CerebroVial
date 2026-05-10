FROM python:3.11-slim

WORKDIR /app

# Dependencias base para la API
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar paquete compartido
COPY shared/ /shared/
RUN pip install --no-cache-dir -e /shared

# Copia de requerimientos
COPY core_management_api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia del codigo (incluye alembic/, entrypoint.sh)
COPY core_management_api/ .

# Variables de entorno
ENV PYTHONPATH=/app
EXPOSE 8001

# El entrypoint corre `alembic upgrade head` y luego uvicorn.
# Apto para deploy local single-node. En multi-instance habría que mover
# las migraciones a un job separado para evitar que dos réplicas migren a la vez.
ENTRYPOINT ["./entrypoint.sh"]
