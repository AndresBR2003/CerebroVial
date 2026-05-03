# CerebroVial

Sistema predictivo de tráfico para Miraflores (Lima, Perú). Proyecto de tesis.

Para entender el alcance funcional ver `documentation/tesis/` y `documentation/docs/PLAN.md`.

---

## Prerequisitos del sistema

Antes de clonar el repo, instalar:

| Herramienta | Versión mínima | Para qué |
|---|---|---|
| Docker Desktop | 4.x | Levantar todos los servicios backend |
| Git LFS | 3.x | Descargar binarios (modelos, datos de training) |
| Python | 3.11 | Correr tests, herramientas de dev |
| Node.js | 18+ | Frontend (Vite) |

### Instalación de prerequisitos

**macOS:**
```bash
brew install --cask docker
brew install git-lfs python@3.11 node
git lfs install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install docker.io docker-compose-plugin git-lfs python3.11 nodejs npm
git lfs install
```

**Windows:**
- Docker Desktop: https://docker.com/products/docker-desktop
- Git LFS: https://git-lfs.com (descargar instalador)
- Python 3.11: https://python.org/downloads
- Node.js: https://nodejs.org
- Después de instalar git-lfs, abrir terminal y correr `git lfs install`

---

## Setup primer-uso

```bash
# 1. Clonar (con LFS ya instalado, los binarios bajan automáticamente)
git clone https://github.com/AndresBR2003/CerebroVial.git
cd CerebroVial

# 2. Configurar variables de entorno
cp .env.example .env
# Editá .env y reemplazá "changeme" por valores reales (ver comentarios del archivo)

# 3. Instalar invoke (gestor de tareas)
pip install invoke

# 4. Crear venv local con todas las deps de dev (para correr tests)
invoke setup-dev

# 5. Levantar el sistema
invoke up
```

Si todo salió bien:
- core_management_api responde en http://localhost:8001/api/health
- edge_device expone Swagger en http://localhost:8000/docs

---

## Comandos del día a día

Todos se invocan con `invoke <comando>`. Para listar todos: `invoke --list`.

| Comando | Qué hace |
|---|---|
| `invoke up` | Levantar el sistema (con validación de LFS) |
| `invoke up-build` | Levantar con rebuild (después de tocar Dockerfile o requirements) |
| `invoke down` | Apagar |
| `invoke logs` | Ver logs en vivo |
| `invoke ps` | Estado de containers |
| `invoke health` | Validar que core_management_api responde |
| `invoke rebuild` | Build limpio sin cache, conserva DB |
| `invoke rebuild-clean` | Build nuclear (⚠️ borra datos DB) |
| `invoke setup-dev` | Crear venv local con deps de dev |
| `invoke test` | Correr tests de core y edge (requiere venv activo) |

### Frontend (manual)

```bash
cd frontend_ui
npm install   # primera vez
npm run dev   # arranca Vite en http://localhost:5173
```

---

## Estructura del repo

```
CerebroVial/
├── core_management_api/     # Backend FastAPI (predictor + endpoints)
├── edge_device/             # Módulo de visión (YOLO + tracking)
├── ia_prediction_service/   # Pipeline de entrenamiento offline (no servicio)
├── frontend_ui/             # Dashboard Vite + React
├── shared/                  # Paquete pip local con código común
├── documentation/           # Documentación del proyecto y tesis
│   ├── docs/                # PLAN, TODO, DECISIONS, ARCHITECTURE_DISCOVERY
│   ├── legacy/              # Artefactos del estado pre-refactor (referencia)
│   └── tesis/               # Documento académico
├── docker-compose.yml
├── tasks.py                 # Comandos de invoke
└── README.md                # Este archivo
```

Para entender la arquitectura en profundidad:
- `CLAUDE.md` — guía para asistentes de IA y devs nuevos
- `documentation/docs/PLAN.md` — plan de fases
- `documentation/docs/DECISIONS.md` — decisiones arquitectónicas
- `documentation/docs/TODO.md` — backlog de tareas

---

## Troubleshooting

### "ERROR: archivos LFS son pointers" al correr `invoke up`
Significa que git-lfs no descargó los binarios. Solución:
```bash
git lfs install
git lfs pull
invoke up
```

### "Bind for 0.0.0.0:5432 failed: port is already allocated"
Hay un container viejo ocupando el puerto. Solución:
```bash
docker compose down --remove-orphans
invoke up
```

### "could not translate host name 'db'" en logs
El `.env` no tiene el `DATABASE_URL` correcto. Verificar que apunta a `db:5432` (no a `db_postgres` ni a `localhost`).

### `docker compose up` arranca pero `core_management_api` crashea con `UnpicklingError`
Es síntoma de LFS missing — los modelos `.joblib` están como pointers.
Ver el primer caso de troubleshooting.

### `npm install` reporta vulnerabilidades
Deuda conocida (ver `documentation/docs/TODO.md` C10.2). No bloquea funcionalidad. Para
silenciar warnings: `npm audit fix` (o esperar a que se resuelva en Fase 4).

---

## Para asistentes de IA (Claude Code, etc.)

Ver `CLAUDE.md` en la raíz para reglas, contexto y convenciones del
proyecto. Los asistentes deben leerlo antes de tocar código.

---

## Estado del proyecto

**Fase 1 (Estabilización del repo):** ✓ Cerrada.
**Fase 2 (Conexión backend/frontend, autenticación, BD real):** próxima.
**Fase 3 (Predictor GRU, control adaptativo):** después de Fase 2.

Detalle completo en `documentation/docs/PLAN.md`.
