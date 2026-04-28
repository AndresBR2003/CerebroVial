FROM python:3.11-slim

WORKDIR /app

# Dependencias para ciencias de datos basicas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

# Normalmente aqui iria un pip install de PyTorch/Scikit-Learn
COPY requirements.txt .
RUN if [ -f "requirements.txt" ]; then pip install --no-cache-dir -r requirements.txt; fi

COPY . .

ENV PYTHONPATH=/app
EXPOSE 8002

CMD ["python", "main.py"]
