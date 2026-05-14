# Tareas Técnicas Habilitadoras (TTH)

> Trabajo técnico de infraestructura necesario para que las HUs del Product Backlog puedan ser implementadas. **Este documento NO contiene Historias de Usuario.** Las TTH no siguen el formato "Como X, quiero Y, para Z" ni Given-When-Then.
>
> **Fundamento metodológico:** Ver `DECISIONS_HU.md`, decisiones DHU-001, DHU-003, DHU-004 (Bloque A), DHU-010 (Bloque C) y DHU-013 (Bloque D).
>
> **Fecha de creación:** 2026-05-13
> **Última actualización:** 2026-05-14 (DHU-012: renombrado uniforme "modo seguro" → "degradado nivel 3", identificador interno `safe_3` → `degraded_3`. DHU-013: cierre de la pregunta abierta sobre división de TTH-05 a favor de mantenerla íntegra).

---

## Contexto

Durante el cierre del Bloque A se identificó que tres trabajos originalmente redactados como HUs no cumplen los criterios para ser HUs (no tienen Persona del producto como beneficiaria, su valor es instrumental, son técnicos estándar). Siguiendo el principio metodológico de no disfrazar tareas técnicas como HUs (Lullabot, Scrum.org, SAFe Enabler Stories), se trasladaron a este documento. Durante el cierre del Bloque C, dos features adicionales (F26 y F27) se clasificaron como TTH por aplicación de DHU-010. Durante la preparación del Bloque D (DHU-013), se confirmó que no se crean TTH adicionales (las 3 features F17, F18, F20 se modelan como HUs operativas) y se cerró a favor de mantener íntegra a TTH-05 (no dividir entre TTH instrumental y HU del Administrador).

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
| TTH-04 | Lógica de fallback en cascada del sistema | C | Pendiente |
| TTH-05 | Configuración de tiempos preconfigurados para degradado nivel 3 | C | Pendiente |

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

- La tabla `User` y el modelo Alembic ya están creados.
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

## TTH-04 — Lógica de fallback en cascada del sistema

**Origen:** Reemplaza a F26 (Lógica de fallback en cascada — backend). Clasificada como TTH por aplicación de los criterios de DHU-004 al Bloque C, formalizada en DHU-010.

**Habilita a:** HU-10 (alerta activa del estado operativo), HU-11 (vista de estado de componentes) y HU-12 (explicación del modo degradado activo). Sin esta TTH, las tres HUs operativas del Bloque C no tienen estado real que consumir.

**Decisiones técnicas relacionadas:** D-001 (Monolito modular). Decisiones del Bloque C: DHU-008 (separación conceptual entre componente caído, modo degradado y lógica de fallback), DHU-010 (clasificación de F26 como TTH), DHU-011 (cobertura de F25 por composición). DHU-012 (renombrado del estado "modo seguro" a "degradado nivel 3" y del identificador interno `safe_3` a `degraded_3`).

### Descripción

Implementar el mecanismo del backend que detecta caídas de componentes del sistema, evalúa qué fallback corresponde aplicar según la condición observada, y transita al sistema entre estados operativos (operación normal, degradado nivel 1, degradado nivel 2, degradado nivel 3, falla total). Esta lógica es el motor interno que materializa la propiedad de robustez del sistema y produce el estado operativo que consumen las HUs del Bloque C (HU-10, HU-11, HU-12).

La lógica opera de forma autónoma sin intervención del Operador. El Operador es consumidor del estado resultante (vía HU-10, HU-11, HU-12), no participante del proceso de fallback. Las transiciones de estado son automáticas y deterministas según la combinación de componentes caídos.

### Criterios técnicos de terminado

- **CT-04.1:** Existe un mecanismo de health check para cada componente del sistema con impacto operativo perceptible (al menos: módulo de detección de tráfico, módulo de predicción, motor adaptativo, componente de explicación, registro de eventos). El mecanismo determina para cada componente uno de tres estados: OK, Degradado o Fuera de servicio. La frecuencia de evaluación es configurable por componente vía variable de entorno (default propuesto: 5 segundos).

- **CT-04.2:** Existe una lógica determinista que, dada la combinación actual de estados de componentes, determina el estado operativo del sistema completo en uno de cinco valores: operación normal, degradado nivel 1, degradado nivel 2, degradado nivel 3, falla total. La regla concreta de mapeo está documentada en código y en documentación técnica del sprint, e implementa al menos los tres fallbacks declarados en F26:
  - **Nivel 1:** un componente periférico (detección de tráfico) no responde. El motor adaptativo opera sin esa fuente, usando el resto de información disponible.
  - **Nivel 2:** el componente predictivo principal no responde. El sistema activa un predictor de respaldo de menor precisión que sigue produciendo predicciones vigentes.
  - **Nivel 3 (degradado nivel 3):** el motor adaptativo no responde. El sistema aplica los tiempos preconfigurados (responsabilidad de TTH-05).
  - **Falla total:** condición sin fallback aplicable. El sistema no aplica decisiones nuevas al semáforo; el último estado conocido se mantiene hasta intervención del Administrador.

- **CT-04.3:** Cada transición de estado operativo del sistema completo (entre los cinco estados de CT-04.2) genera un evento persistido de forma durable con al menos: marca de tiempo, estado anterior, estado nuevo y causa raíz (identificador del componente o condición que disparó la transición). El esquema y el comportamiento de persistencia satisfacen CA-10.7 y CA-10.8 de HU-10.

- **CT-04.4:** El estado operativo actual del sistema está expuesto a la capa de presentación mediante un endpoint estable del backend (por ejemplo, `GET /system/operational-state`) que retorna al menos: estado actual, timestamp de entrada al estado actual, componente o condición disparadora (si no es operación normal), y nivel de degradación si aplica. Este endpoint es consumido por HU-10 (banner transversal) y como referencia por HU-12 (explicación compuesta).

- **CT-04.5:** El estado individual de cada componente está expuesto mediante un endpoint del backend (por ejemplo, `GET /system/components/status`) que retorna la lista de componentes con su nombre legible, su estado cualitativo (OK / Degradado / Fuera de servicio), su timestamp de último cambio y un identificador interno. Este endpoint es consumido por HU-11 (vista de estado de componentes) y por la HU del Administrador equivalente a F17 del Bloque D, con la presentación adaptada en cada caso (DHU-013).

- **CT-04.6:** La activación de un fallback no se detiene ni se posterga por fallos del registro de auditoría. Si la escritura del evento de transición (CT-04.3) falla momentáneamente, la transición de estado se aplica de todos modos a la operación del sistema y se registra en un mecanismo de respaldo (cola en memoria, archivo local, según se cierre en el sprint) para ser persistida cuando el registro vuelva a estar disponible. Esta resiliencia satisface CA-10.8 de HU-10.

- **CT-04.7:** Las transiciones de estado son **atómicas**: el sistema no queda en estados intermedios o indefinidos durante el cambio. Si la transición no puede completarse íntegramente (por ejemplo, el fallback no puede activarse), el sistema permanece en el estado anterior y registra una entrada de error en el registro de transiciones.

- **CT-04.8:** El comportamiento por defecto cuando el propio mecanismo de detección de salud falla (por ejemplo, el componente que ejecuta los health checks deja de responder) es **conservador**: el sistema reporta el estado operativo como "no confirmado" y notifica vía el endpoint de CT-04.4 con un flag específico, sin asumir falsamente operación normal. Esta resiliencia satisface CA-10.9 de HU-10.

- **CT-04.9:** Existen tests unitarios para: detección de cambio de estado de un componente individual, transición de operación normal a cada uno de los cuatro estados no normales, transición entre estados no normales (escaladas y recuperaciones parciales), recuperación a operación normal desde cada estado no normal, resiliencia del registro de auditoría (CT-04.6), atomicidad de transiciones fallidas (CT-04.7) y comportamiento por defecto ante fallo del mecanismo de salud (CT-04.8).

- **CT-04.10:** Existen tests de integración que validan, en un escenario simulado de degradación progresiva (componente periférico → componente predictivo → motor adaptativo), la activación correcta de cada nivel de fallback en cascada y la coherencia entre el estado operativo expuesto por el endpoint de CT-04.4 y los estados individuales expuestos por el endpoint de CT-04.5.

### Notas técnicas

- **Patrón arquitectónico sugerido:** Circuit Breaker para cada componente monitoreado, con orquestador central que agrega los estados individuales en estado operativo del sistema completo. Decisión final del patrón se cierra en el sprint, pero el principio de aislamiento de fallas y agregación centralizada queda anclado.
- **Detección de salud:** cada componente expone un endpoint `/health` o equivalente que la TTH-04 consulta periódicamente. La alternativa de tener cada componente reportando proactivamente su salud (push) se evalúa como variante del sprint, pero el contrato (cuándo se considera caído) debe ser explícito y configurable.
- **Diferencia entre el registro de TTH-04 y el de HU-08:** TTH-04 persiste transiciones de estado operativo del sistema completo. HU-08 persiste decisiones del motor adaptativo (estrategia A → estrategia B). Son registros distintos con esquemas distintos. Una transición a degradado nivel 3 registrada por TTH-04 puede coincidir temporalmente con el cese de decisiones del motor en HU-08; ambos registros coexisten y son consultables por separado.
- **Persistencia de configuración de fallbacks:** los criterios concretos que detonan cada fallback (qué componente, qué timeout, qué umbrales) son configurables sin redeploy. La configuración detallada se cierra en el sprint y queda documentada con la TTH.
- **Composición con TTH-05:** cuando el sistema entra en degradado nivel 3, la TTH-04 consulta la configuración de tiempos preconfigurados que provee TTH-05 y aplica esos tiempos al semáforo. Sin TTH-05, el nivel 3 no es completamente operativo. Las dos TTH deben terminarse antes de declarar el Bloque C operativo.
- **Catálogo de estados:** los identificadores internos de los cinco estados operativos (`normal`, `degraded_1`, `degraded_2`, `degraded_3`, `total_failure`) son los que aparecen en el registro de transiciones (CT-04.3) y en el endpoint de CT-04.4. Los nombres legibles que ve el Operador se traducen en presentación (HU-10, HU-12). El identificador `degraded_3` fue renombrado desde `safe_3` por DHU-012.

### Trazabilidad con HUs y otras TTH

| HU / TTH que depende | Cómo depende |
|---|---|
| HU-10 | Consume endpoint de estado operativo (CT-04.4). Persistencia de transiciones inglobada en CA-10.7 y CA-10.8 es responsabilidad de CT-04.3 y CT-04.6. Resiliencia ante caída del monitor (CA-10.9) es CT-04.8. |
| HU-11 | Consume endpoint de estado de componentes (CT-04.5). |
| HU-12 | Consume causa raíz (componente disparador y nivel) del endpoint de CT-04.4 para producir explicación compuesta. |
| TTH-05 | TTH-04 consume la configuración de tiempos preconfigurados provista por TTH-05 al activar el nivel 3. |
| HU del Administrador equivalente a F17 (Bloque D) | Consume endpoint de estado de componentes (CT-04.5) con presentación técnica distinta a la de HU-11 (DHU-013). |

---

## TTH-05 — Configuración de tiempos preconfigurados para degradado nivel 3

**Origen:** Reemplaza a F27 (Configuración de tiempos fijos para degradado nivel 3). Clasificada como TTH por aplicación de los criterios de DHU-004 al Bloque C, formalizada en DHU-010.

**Habilita a:** TTH-04 cuando el sistema entra en degradado nivel 3. Sin TTH-05, el nivel 3 de TTH-04 no tiene tiempos que aplicar al semáforo.

**Decisiones técnicas relacionadas:** D-001 (Monolito modular). DHU-012 (renombrado del estado y del identificador interno). DHU-013 (cierre de la pregunta abierta sobre división de TTH-05 entre TTH instrumental y HU del Administrador).

### Descripción

Implementar el mecanismo de configuración persistente de los tiempos fijos del semáforo que se aplican cuando el sistema entra en degradado nivel 3. El Administrador del Sistema define estos tiempos previamente, durante la configuración inicial del sistema y eventualmente al recalibrar los tiempos del nivel 3. Los tiempos se persisten en la base de datos y están disponibles para consulta por TTH-04 cuando se requiera activar el nivel 3.

A diferencia de las HUs operativas del Bloque C, F27 sí podría haber sido modelada como HU del Administrador (tiene Persona beneficiaria directa). Sin embargo, DHU-010 la clasificó como TTH por dos razones: (a) es configuración de un parámetro técnico interno del sistema (valores numéricos por dirección), no funcionalidad operativa, y (b) en aislamiento no entrega valor al usuario; su valor se materializa solo cuando se activa el degradado nivel 3, lo cual ocurre dentro de la lógica de TTH-04.

El alcance funcional de la configuración para MVP1 es deliberadamente simple: una tabla única de tiempos por dirección y fase, sin franjas horarias diferenciadas. La extensión a franjas horarias (mañana pico, valle, tarde pico, nocturno) se evalúa en trabajo futuro.

### Criterios técnicos de terminado

- **CT-05.1:** Existe una tabla persistente en la base de datos que almacena los tiempos preconfigurados del degradado nivel 3. El esquema mínimo incluye: identificador único, dirección o acceso de la intersección, fase del semáforo (verde, amarillo, opcionalmente rojo si se modela explícitamente), duración en segundos, marca de tiempo de creación y marca de tiempo de última modificación.

- **CT-05.2:** Existe un endpoint del backend (por ejemplo, `GET /admin/fallback-times-config` y `PUT /admin/fallback-times-config`) accesible exclusivamente al rol Administrador (RBAC según HU-01 del Bloque A) que permite consultar y actualizar la configuración de tiempos. Tanto la consulta como la actualización requieren autenticación válida (JWT vigente, según TTH-01).

- **CT-05.3:** Existe una interfaz mínima en el frontend que permite al Administrador visualizar la configuración actual y editarla. La interfaz valida que los tiempos sean numéricos, positivos y dentro de rangos razonables (por ejemplo: 5 a 120 segundos por fase). Valores fuera de rango son rechazados con mensaje claro al Administrador.

- **CT-05.4:** El endpoint de consulta de la configuración (`GET`) está disponible para consumo por TTH-04 cuando el sistema activa el degradado nivel 3. La latencia de la consulta debe ser suficiente para no demorar la transición al nivel 3 (criterio: ≤ 1 segundo en condiciones normales de carga).

- **CT-05.5:** Si la configuración no existe (sistema recién instalado, base de datos vacía), el endpoint de consulta retorna un conjunto de valores **por defecto seguros** (tiempos conservadores que se sabe que mantienen la intersección operativa, por ejemplo 30 segundos por fase principal). Esto garantiza que el degradado nivel 3 pueda activarse incluso antes de la primera configuración explícita del Administrador.

- **CT-05.6:** Cada actualización de la configuración registra una entrada de auditoría con: timestamp, identidad del Administrador que modificó, valores anteriores y valores nuevos. Esta auditoría es independiente del registro de transiciones de estado operativo de TTH-04.

- **CT-05.7:** Existen tests unitarios para: lectura de configuración existente, lectura cuando no existe configuración (valores por defecto de CT-05.5), actualización válida con auditoría correcta, rechazo de valores fuera de rango (CT-05.3), control de acceso por rol (un Operador o Gerente intentando leer o modificar la configuración recibe 403).

- **CT-05.8:** Existe un test de integración que valida: configuración guardada por el Administrador, posterior activación de degradado nivel 3 vía TTH-04, y aplicación efectiva de los tiempos configurados al semáforo simulado.

### Notas técnicas

- **Alcance MVP1 (tabla única vs franjas horarias):** F27 mencionaba como pregunta abierta si la tabla sería única o por franjas horarias. Para MVP1 se cierra en tabla única (un solo conjunto de tiempos aplicable siempre). La extensión a franjas horarias queda documentada como mejora futura, no en MVP2 explícitamente, pero como ítem identificado para iteraciones posteriores.
- **Valores por defecto seguros (CT-05.5):** los valores concretos del default se cierran en el sprint con criterio conservador: tiempos que un operador de tráfico clásico aceptaría como razonables para una intersección típica de 4 accesos. La definición exacta se documenta junto con la TTH al implementarse.
- **Composición con TTH-04:** cuando TTH-04 activa degradado nivel 3, consulta el endpoint de CT-05.4 y aplica los tiempos obtenidos. Si el endpoint no responde (caso patológico de la BD caída a la vez que el motor adaptativo), TTH-04 aplica los valores por defecto seguros como último recurso. Esta resiliencia se evalúa en el sprint y puede agregarse como CT adicional si se considera necesario.
- **Relación con el control de acceso (CA-01.4):** los endpoints de CT-05.2 están protegidos por RBAC según HU-01 del Bloque A. Un Operador o Gerente que intente acceder recibe HTTP 403. Esto se valida explícitamente en CT-05.7.
- **No es vista del Operador:** la configuración de tiempos preconfigurados es exclusivamente del Administrador. El Operador nunca interactúa con TTH-05 directamente; consume sus efectos cuando el degradado nivel 3 se activa, vía HU-12 (explicación) y HU-10 (alerta).
- **Auditoría de cambios (CT-05.6):** este registro es independiente del registro de transiciones de TTH-04 y del registro de decisiones de HU-08. Captura cambios de configuración del sistema, no eventos operativos. Se consulta principalmente para responder preguntas tipo "quién cambió la configuración del degradado nivel 3 y cuándo".
- **Pregunta abierta cerrada por DHU-013:** versiones anteriores de esta nota indicaban que TTH-05 podría dividirse en (a) parte instrumental que sigue siendo TTH y (b) HU del Administrador para el formulario y la auditoría, condicional a la revisión durante el Bloque D. DHU-013 cerró esta pregunta a favor de **mantener TTH-05 íntegra**, sin dividir, porque (i) mezclar la configuración de tiempos del nivel 3 con la HU de F20 ("Configuración del motor adaptativo") rompería la cohesión de esa HU, (ii) la separación arquitectónica entre TTH-04 (lógica de fallback) y TTH-05 (provee tiempos al nivel 3) se preserva mejor manteniéndolas juntas, y (iii) si en el futuro surge una necesidad concreta del Administrador (por ejemplo, una vista dedicada de auditoría de cambios), siempre se puede extraer una HU adicional sin perder nada.

### Trazabilidad con HUs y otras TTH

| HU / TTH que depende | Cómo depende |
|---|---|
| TTH-04 | Consume el endpoint de configuración (CT-05.4) cuando activa degradado nivel 3. |
| HU-01 (Bloque A) | Provee el control de acceso por rol que protege los endpoints de TTH-05 (CT-05.2). |
| TTH-01 | Provee la autenticación JWT que valida el acceso del Administrador (CT-05.2). |

---

## Relación con el Plan de Ejecución

Las TTH **no se estiman con Planning Poker** ni se priorizan con MoSCoW (ambas técnicas son para HUs con valor de negocio). Las TTH se planifican como trabajo técnico directo en el cronograma del proyecto, con estimaciones en horas/días.

Sin embargo, las TTH **sí son prerrequisitos de bloques completos de HUs**:

- TTH-01 (Autenticación) es prerrequisito de toda HU operativa.
- TTH-02 (Docker) es prerrequisito de toda HU (no se desarrolla nada sin entorno).
- TTH-03 (CI) es prerrequisito para considerar cualquier HU "Done" con calidad asegurada.
- TTH-04 (Lógica de fallback) es prerrequisito de toda HU del Bloque C (HU-10, HU-11, HU-12).
- TTH-05 (Configuración de tiempos preconfigurados para degradado nivel 3) es prerrequisito del nivel 3 de TTH-04.

Por tanto, las TTH se ejecutan en la primera fase del proyecto, antes o en paralelo con las HUs operativas. Las TTH-04 y TTH-05 específicamente deben estar disponibles antes de comenzar el sprint del Bloque C.

---

## Documentos relacionados

- `DECISIONS_HU.md` — Decisiones metodológicas (DHU-001 a DHU-013) que fundamentan la creación y clasificación de cada TTH.
- `HU_BLOQUE_A.md` — Bloque A del Product Backlog tras la reestructuración.
- `HU_BLOQUE_B.md` — Bloque B del Product Backlog (HU-02 a HU-09).
- `HU_BLOQUE_C.md` — Bloque C del Product Backlog (HU-10 a HU-12).
- `DECISIONS.md` — Decisiones técnicas del producto (D-001 Monolito modular, D-003 Deploy Docker local, D-008 SUMO end-to-end, D-009 jam level Waze).
- `FEATURE_BACKLOG_DETALLADO.md` — Features de origen (F01 autenticación, F26 lógica de fallback, F27 configuración de tiempos preconfigurados para degradado nivel 3, F29 RBAC, y habilitadores transversales).
