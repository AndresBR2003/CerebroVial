FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema para OpenCV, psycopg2, librerías nativas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar paquete compartido
COPY shared/ /shared/
RUN pip install --no-cache-dir -e /shared

# Instalar dependencias Python (aprovecha el cache de Docker)
COPY edge_device/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente
COPY edge_device/ .

# Hace que 'src' sea importable como paquete raíz
ENV PYTHONPATH=/app

EXPOSE 8000

# Ejecutar el script que inicializa las cámaras hardcodeadas de youtube
CMD ["python", "scripts/run_server.py"]
