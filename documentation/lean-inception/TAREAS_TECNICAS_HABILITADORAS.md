# Tareas Técnicas Habilitadoras (TTH)

> Trabajo técnico de infraestructura necesario para que las HUs del Product Backlog puedan ser implementadas. **Este documento NO contiene Historias de Usuario.** Las TTH no siguen el formato "Como X, quiero Y, para Z" ni Given-When-Then.
>
> **Fundamento metodológico:** Ver `DECISIONS_HU.md`, decisiones DHU-001, DHU-003 y DHU-004.
>
> **Fecha de creación:** 2026-05-13

---

## Contexto

Durante el cierre del Bloque A se identificó que tres trabajos originalmente redactados como HUs no cumplen los criterios para ser HUs (no tienen Persona del producto como beneficiaria, su valor es instrumental, son técnicos estándar). Siguiendo el principio metodológico de no disfrazar tareas técnicas como HUs (Lullabot, Scrum.org, SAFe Enabler Stories), se trasladaron a este documento.

Las TTH son entregables del proyecto y son evaluables, pero su naturaleza es distinta a las HUs:

| Atributo | HU | TTH |
|---|---|---|
| **Sujeto** | Persona del producto | (no aplica) |
| **Valor** | De negocio, visible al usuario | Instrumental, habilita HUs |
| **Formato** | Como X, quiero Y, para Z | Enunciado imperativo |
| **Criterios** | Given-When-Then | Criterios técnicos de "terminado" |
| **Estimación** | Story points (Planning Poker) | Estimación técnica directa (horas/días) |
| **Priorización** | MoSCoW + valor de negocio | Por dependencia con HUs |

---

## Índice de TTH

| Código | Título | Bloque que habilita | Estado actual |
|---|---|---|---|
| TTH-01 | Implementación de autenticación JWT con bcrypt | A (transversal a todos) | Pendiente |
| TTH-02 | Arquitectura Docker Compose multi-servicio | A (transversal a todos) | Parcial |
| TTH-03 | Repositorio Git y pipeline CI con cobertura completa | A (transversal a todos) | Parcial |

---

## TTH-01 — Implementación de autenticación JWT con bcrypt

**Origen:** Reemplaza a HU-01 (Autenticación al sistema) de la versión inicial del Bloque A. Ver DHU-001 en `DECISIONS_HU.md`.

**Habilita a:** Todas las HUs operativas del backlog (toda HU requiere usuario autenticado).

### Descripción

Implementar el mecanismo de autenticación del sistema usando JSON Web Tokens (JWT) firmados, con hash de contraseñas mediante bcrypt. El endpoint `POST /auth/login` recibe credenciales, valida contra la tabla `User`, y retorna un token JWT con expiración configurable. La dependency `get_current_user` decodifica el token en cada request protegido y carga el usuario activo.

### Criterios técnicos de terminado

- **CT-01.1:** Existe endpoint `POST /auth/login` que acepta `username` y `password`, retorna `{access_token, token_type, expires_in}` con código 200 si las credenciales son válidas, y código 401 con mensaje genérico "Credenciales incorrectas" si no lo son (sin revelar si el error es de usuario o de contraseña).

- **CT-01.2:** Las contraseñas en la tabla `User` se almacenan hasheadas con bcrypt (cost factor ≥ 12). Nunca en texto plano.

- **CT-01.3:** El JWT incluye al menos los claims `sub` (user_id), `role` (operator/manager/admin) y `exp` (expiración). El tiempo de expiración es configurable vía variable de entorno (default propuesto: 8 horas).

- **CT-01.4:** Existe dependency FastAPI `get_current_user` que decodifica el token del header `Authorization: Bearer <token>`, valida la firma y la expiración, y retorna el usuario activo. Si el token es inválido o expiró, responde 401.

- **CT-01.5:** Hay tests unitarios para: login con credenciales válidas, login con credenciales inválidas, decode de token válido, decode de token expirado, decode de token con firma inválida.

### Notas técnicas

- La tabla `User` y el modelo Alembic ya están creados (Fase 2 del PLAN).
- La asignación inicial de roles se hace directamente en BD para MVP1 (no hay UI de gestión de roles, default 3 del Parking Lot del Inception).
- Decisión de algoritmo de firma JWT: HS256 con secret en variable de entorno (suficiente para MVP1; RS256 con par de claves se evalúa en MVP2 si se integra con sistema externo).

### Trazabilidad con HUs que dependen de esta TTH

Toda HU operativa del backlog tiene como precondición implícita "el usuario está autenticado". Esto se hace explícito en los criterios de aceptación de cada HU con redacciones del tipo:

> *Dado que el Operador no ha iniciado sesión, cuando intenta acceder al [recurso], entonces el sistema lo redirige a la pantalla de login.*

---

## TTH-02 — Arquitectura Docker Compose multi-servicio

**Origen:** Reemplaza a HU-03 (Preparación de arquitectura del sistema) de la versión inicial del Bloque A. Ver DHU-003 y DHU-004 en `DECISIONS_HU.md`.

**Habilita a:** Todas las HUs del backlog (no se puede desarrollar ni demostrar nada sin entorno funcional).

**Decisiones técnicas relacionadas:** D-001 (Monolito modular), D-003 (Deploy Docker local).

### Descripción

Consolidar el archivo `docker-compose.yml` para que orquesta todos los servicios del sistema, con sus dependencias, red interna, volúmenes persistentes y configuración para arranque desde máquina limpia. Incluye documentación de quickstart.

### Criterios técnicos de terminado

- **CT-02.1:** El archivo `docker-compose.yml` define los servicios `core_management_api`, `edge_device`, `frontend_ui` y `db` con sus respectivas imágenes/builds, puertos expuestos, variables de entorno y dependencias (`depends_on`).

- **CT-02.2:** En una máquina limpia con Docker y Docker Compose instalados, ejecutar `docker compose up` desde la raíz del repositorio levanta todos los servicios correctamente. El frontend es accesible vía `http://localhost:<puerto>`, la API responde a `http://localhost:<puerto>/health`, la BD acepta conexiones desde la API.

- **CT-02.3:** Los servicios se comunican entre sí por nombres internos de Docker (`db`, `core_management_api`) sin configuración manual de hosts.

- **CT-02.4:** Los datos de la BD persisten en un volumen nombrado (`postgres_data` o equivalente). Tras `docker compose down && docker compose up`, los datos previos siguen disponibles.

- **CT-02.5:** Existe documento `README.md` o `QUICKSTART.md` en la raíz del repositorio con: requisitos previos, comando de arranque, URLs locales de cada servicio, comandos comunes (logs, reset de BD), troubleshooting básico. Un nuevo miembro del equipo o el comité evaluador debe quedar con el sistema funcional siguiendo solo este documento.

- **CT-02.6:** El archivo `.env.example` documenta todas las variables de entorno necesarias con valores de ejemplo no sensibles.

### Estado actual

- Existe `docker-compose.yml` parcial (referencia: estado declarado en Bloque A original).
- Pendiente: consolidar todos los servicios, validar el quickstart en máquina limpia, documentar variables de entorno.
- El `edge_device` está contenerizado por separado, coherente con D-001 (Monolito modular).

### Notas técnicas

- El criterio de "menos de 15 minutos" del Bloque A original se reemplaza por un criterio binario (CT-02.5): el quickstart funciona o no funciona, sin umbral subjetivo. Si se requiere una métrica temporal para la sustentación, se registra en la ejecución real, no como criterio de aceptación.

---

## TTH-03 — Repositorio Git y pipeline CI con cobertura completa

**Origen:** Reemplaza a HU-04 (Configuración de repositorio y entrega continua) de la versión inicial del Bloque A. Ver DHU-003 y DHU-004 en `DECISIONS_HU.md`.

**Habilita a:** Todas las HUs del backlog (sin CI, no hay garantías de calidad sobre los entregables).

### Descripción

Consolidar el repositorio Git del proyecto con convenciones de versionamiento y configurar un pipeline de Integración Continua (CI) que ejecute tests, linting y verificación de tipos en cada push a las ramas principales y en cada Pull Request.

### Criterios técnicos de terminado

- **CT-03.1:** El repositorio tiene definidas las ramas `main` (estable) y `develop` (integración). Las features se desarrollan en ramas `feature/*` que se fusionan a `develop` vía Pull Request.

- **CT-03.2:** Existe `.gitignore` que excluye archivos binarios, virtualenvs, `.env`, `__pycache__`, `node_modules`, artefactos de build y checkpoints de modelos.

- **CT-03.3:** El pipeline de CI (GitHub Actions, GitLab CI, o equivalente) se dispara automáticamente en cada push a `main` o `develop`, y en cada Pull Request hacia esas ramas.

- **CT-03.4:** El pipeline ejecuta, como mínimo:
  - Tests unitarios de `core_management_api`.
  - Tests unitarios de `edge_device`.
  - Tests unitarios de `shared/`.
  - Tests unitarios de `ia_prediction_service/`.
  - Linting (ruff o equivalente).
  - Verificación de tipos (mypy o equivalente).

- **CT-03.5:** Si todos los checks pasan, el commit se marca con estado "verde" en la plataforma. Si alguno falla, el commit se marca "rojo" y la notificación es visible en el Pull Request asociado.

- **CT-03.6:** Las ramas protegidas (`main`, `develop`) requieren que los checks de CI estén en verde antes de permitir fusión.

- **CT-03.7:** Los conflictos de fusión deben resolverse manualmente; la plataforma no permite fusión con conflictos no resueltos.

### Estado actual

- Existe repositorio Git activo.
- Cobertura de CI parcial: según item §5.5 de `DISCOVERY_2026-05-10.md`, el CI **no** corre tests de `edge_device`, `shared/`, ni `ia_prediction_service/`.
- Esta TTH formaliza la cobertura completa.

### Notas técnicas

- El criterio original de "notificación visible del fallo" se reemplaza por dos criterios concretos (CT-03.5 y CT-03.6), eliminando el cualificador subjetivo "visible".
- La política de versionamiento semántico (SemVer) se deja como decisión técnica posterior; no es bloqueante para considerar la TTH terminada.

---

## Relación con el Plan de Ejecución

Las TTH **no se estiman con Planning Poker** ni se priorizan con MoSCoW (ambas técnicas son para HUs con valor de negocio). Las TTH se planifican como trabajo técnico directo en el cronograma del proyecto (PLAN.md), con estimaciones en horas/días.

Sin embargo, las TTH **sí son prerrequisitos de bloques completos de HUs**:

- TTH-01 (Autenticación) es prerrequisito de toda HU operativa.
- TTH-02 (Docker) es prerrequisito de toda HU (no se desarrolla nada sin entorno).
- TTH-03 (CI) es prerrequisito para considerar cualquier HU "Done" con calidad asegurada.

Por tanto, las TTH se ejecutan en la primera fase del proyecto, antes o en paralelo con las HUs operativas del Bloque B.

---

## Documentos relacionados

- `DECISIONS_HU.md` — Decisiones metodológicas (DHU-001 a DHU-004) que fundamentan la creación de esta categoría.
- `HU_BLOQUE_A.md` — Bloque A del Product Backlog tras la reestructuración.
- `DECISIONS.md` — Decisiones técnicas del producto (D-001 Monolito modular, D-003 Deploy Docker local).
- `FEATURE_BACKLOG_DETALLADO.md` — Features de origen (F01 autenticación, F29 RBAC, y habilitadores transversales).
