FROM python:3.11-slim

WORKDIR /app

# Dependencias base para la API
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia de requerimientos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia del codigo
COPY . .

# Variables de entorno
ENV PYTHONPATH=/app
EXPOSE 8001

# Comando por defecto para la API
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001"]
