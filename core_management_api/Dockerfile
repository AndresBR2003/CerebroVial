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

# Copia del codigo
COPY core_management_api/ .

# Variables de entorno
ENV PYTHONPATH=/app
EXPOSE 8001

# Comando por defecto para la API
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
