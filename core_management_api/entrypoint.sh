#!/bin/sh
set -e

echo "[entrypoint] Aplicando migraciones Alembic..."
alembic upgrade head

echo "[entrypoint] Iniciando uvicorn..."
exec uvicorn src.main:app --host 0.0.0.0 --port 8001 "$@"
