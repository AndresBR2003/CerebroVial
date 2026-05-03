# Cierre de Fase 1 — Estabilización del repo

**Fecha de cierre:** 2026-05-03 (domingo)
**Plazo objetivo (PLAN.md):** domingo 3 o lunes 4 de mayo
**Estado:** ✓ Cerrada dentro de plazo

---

## Qué incluyó Fase 1

Fase 1 fue la fase de estabilización post-refactor. El objetivo era
que `docker compose up` levantara el sistema sin crashes y que el repo
fuera clonable por colaboradores nuevos sin fricción.

### Tareas completadas (18 commits operativos + 1 ceremonial)

| Tarea | Commits git | Descripción |
|---|---|---|
| C0 | 1 | Restaurar plantilla `.env.example` (regresión de Fase 0) |
| C1 | 5 sub-commits (C1.1/4 a C1.5/4) | Consolidar `common/` en `shared/cerebrovial_shared` (paquete pip local) |
| C2 | 1 | `src/main.py` como entry point unificado del monolito modular |
| C3 | 1 | Sacar `ia_prediction_service` del compose y dejarlo correrible a mano |
| C4 | 1 | Renombrar servicio `db_postgres` → `db` (alineación con `.env`) |
| C5 | 1 | Eliminar `db_mongo` del compose (no se usaba) |
| C6 | 1 | Eliminar `api_gateway` decorativo del compose |
| C7 | 1 | Limpiar `core_management_api/requirements.txt` (sacar deps de visión) |
| C8 | 1 | Limpieza de raíz: legacy/ + borrar scratch files |
| C9 | 2 (C9-prep + C9) | Git LFS para 13 binarios + limpiar 4 ckpt intermedios del STGNN (~48 MB) |
| C10 | 1 | Verificación final clonando en repo limpio |
| C11 | 1 | `tasks.py` (invoke) + `requirements-dev.txt` + `README.md` raíz |
| [chore] | 1 | `.DS_Store` y `compose-*.log` en `.gitignore` |

### Deuda nueva detectada durante la fase

Estos ítems no estaban en el plan original. Se descubrieron durante la
ejecución y quedaron registrados en TODO.md:

- C1.2 (eval `shared/setup.py` necesario)
- C3.5 (cámaras YouTube rotas: 3 de 4 streams ya no existen)
- C7.5 (deuda STGNN en core_management_api: torch + models.py)
- C9.5 (migrar `metr_la.h5` a download-on-demand)
- C9.6 (validación de pointers LFS al arranque)
- C10.1 (setup de tests fuera del container; resuelto parcialmente en C11)
- C10.2 (vulnerabilidades npm en frontend_ui)

### Deuda preexistente confirmada (xfail)

Tests que ya fallaban antes del refactor de Fase 0 y se marcaron como
xfail durante C1.4 y C1.5:

- C1.5 race condition en `test_pipeline_processing_flow`
- C1.6 tests de MultiCameraManager rotos (CameraInstance API cambió)
- C1.7 SmartDetectionProcessor: interpolación + trayectorias rotas
- C1.8 ZoneCounter: vehicle_count = 0 cuando debería ser 1

C1.7 y C1.8 son prioridad alta — afectan el pipeline de visión que
Fase 3 va a usar para entrenar el GRU.

---

## Estado del sistema al cierre

### docker compose up
3 servicios corriendo, todos healthy:
- `db` (timescale/timescaledb-ha:pg15) — puerto 5432
- `core_management_api` (FastAPI + RandomForest predictor) — puerto 8001
- `edge_device` (FastAPI + YOLO + tracking) — puerto 8000

### Frontend
`npm run dev` arranca Vite limpio en puerto 5173. UI renderiza
correctamente con datos mock (conexión real a backend es trabajo de
Fase 2).

### Tests
- core_management_api: 18 passed
- edge_device: 36 passed + 6 xfailed (deuda preexistente documentada)

### Métricas del repo
- Commits de Fase 1: 18 operativos + 1 ceremonial
- LFS storage: ~95 MB (13 binarios)
- Imagen Docker core_management_api: pip install ~80s (antes ~96s)
- Tiempo de `invoke up` desde caché caliente: ~12s

---

## Qué viene en Fase 2

Según `documentation/docs/PLAN.md`:

1. Endpoints de DB reales (alembic migrations, primeros endpoints
   contra Postgres). Acá se va a manifestar el rename C4 que hicimos
   preventivamente.
2. Autenticación JWT (las dependencias `python-jose` y `passlib` ya
   están en requirements esperando).
3. SSE para streaming en tiempo real (`sse-starlette` ya en deps).
4. Conectar el frontend a endpoints reales (eliminar datos mock).

Antes de empezar Fase 2, conviene revisar:
- C9.6 (validación LFS) — bajo costo, alto valor de soporte futuro
- C7.5 (deuda STGNN) — decidir si se resuelve antes o durante Block F

---

## Cómo seguir desde acá

**Para vos (autor de Fase 1):**
1. Abrir PR de `fase-1-estabilizacion` → `main` con este documento de
   cierre como descripción.
2. Coordinar con compañero el merge.
3. Después del merge, arrancar Fase 2 desde `main` actualizado en una
   nueva branch `fase-2-...`.

**Para tu compañero o cualquier colaborador nuevo:**
1. `git fetch && git checkout main && git pull` (después del merge).
2. Asegurate de tener git-lfs instalado (ver README.md).
3. `cp .env.example .env` y completar valores.
4. `pip install invoke && invoke setup-dev`.
5. `invoke up`.

**Referencias:**
- `README.md` — guía de setup completa.
- `CLAUDE.md` — contexto para asistentes de IA y devs.
- `documentation/docs/PLAN.md` — fases del proyecto.
- `documentation/docs/DECISIONS.md` — decisiones arquitectónicas.
- `documentation/docs/TODO.md` — backlog completo con prioridades.
