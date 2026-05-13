# Historias de Usuario — Bloque A (Cerradas)

> Primera entrega del Product Backlog del proyecto CerebroVial.
>
> **Estado:** Bloque A cerrado y aprobado. Pendiente: Bloques B, C, D, E, F + MVP2.
>
> **Fecha de cierre:** 2026-05-11

---

## Contexto

Este documento contiene las primeras 4 Historias de Usuario del proyecto, correspondientes al **Bloque A — Infraestructura mínima** del Sequencer del Lean Inception (ver `LEAN_INCEPTION_CEREBROVIAL.md`, sección 9, y `FEATURE_BACKLOG_DETALLADO.md`, Bloque A).

Las HUs se redactan en el formato del documento de referencia académica (`Desarrollo_Agil.pdf`, Tablas 9 y 13): "Como X, quiero Y, para Z" con criterios de aceptación Given-When-Then.

---

## Regla de sujetos en HUs (aplica a TODO el backlog)

Esta regla fue cerrada durante la conversación de cierre del Bloque A y aplica a todas las HUs del proyecto:

1. **HUs operativas** → sujeto es una de las 3 Personas del producto: **Operador de Tráfico Municipal**, **Gerente de Tránsito Municipal**, **Administrador del Sistema**.
2. **HUs técnicas de infraestructura pre-operativa** → sujeto es **"Equipo de Desarrollo"** como Stakeholder del proyecto, no como Persona del producto.
3. **El sistema NUNCA es sujeto de una HU.** Si una redacción dice "Como sistema, quiero...", es una tarea técnica disfrazada, no una HU.
4. **Las persistencias y prerrequisitos técnicos** se inglogan como criterios de aceptación de HUs de Personas reales cuando son desagregables. Solo se crean HUs técnicas explícitas cuando el trabajo NO es atribuible a una Persona operativa.

**Justificación de la regla:** Se sigue el estilo pragmático del documento de referencia académica (`Desarrollo_Agil.pdf`, HUs HU20-HU24 con sujeto "Administrador de Sistemas, Desarrollador"), adaptado al contexto del proyecto donde el equipo de desarrollo es Stakeholder reconocido del proyecto académico (no Persona del producto operativo).

---

## HU-01 — Autenticación al sistema

| Campo | Contenido |
|---|---|
| **Como** | Usuario del sistema (Operador, Gerente o Administrador) |
| **Quiero** | autenticarme con mi nombre de usuario y contraseña |
| **Para** | acceder a las funcionalidades del sistema según mi rol |

**Tipo:** HU de Persona (cualquiera de las 3).
**Feature(s) origen:** F01.

**Descripción:** Permite a cualquier usuario del sistema iniciar sesión mediante credenciales. Tras autenticación exitosa, recibe un token JWT que se usa en llamadas posteriores a la API.

**Criterios de aceptación:**

- **CA-01.1:** Dado que el usuario se encuentra en la pantalla de login, cuando ingresa credenciales válidas y presiona "Iniciar sesión", entonces el sistema lo redirige a la vista correspondiente a su rol y le entrega un token JWT con expiración configurable.

- **CA-01.2:** Dado que el usuario se encuentra en la pantalla de login, cuando ingresa credenciales inválidas y presiona "Iniciar sesión", entonces el sistema muestra el mensaje "Credenciales incorrectas" sin revelar si el usuario o la contraseña son los erróneos.

- **CA-01.3:** Dado que el usuario no ha iniciado sesión, cuando intenta acceder a cualquier ruta protegida del sistema, entonces es redirigido a la pantalla de login.

- **CA-01.4:** Dado que el token del usuario ha expirado, cuando realiza una acción que requiere autenticación, entonces el sistema lo desconecta y lo redirige a la pantalla de login.

**Notas técnicas:** JWT con bcrypt para hash de contraseña. La tabla `User` y el modelo Alembic ya están creados (Fase 2 del PLAN). Falta el endpoint POST `/auth/login` y la dependency `get_current_user`.

---

## HU-02 — Acceso diferenciado por rol

| Campo | Contenido |
|---|---|
| **Como** | Usuario autenticado |
| **Quiero** | acceder únicamente a las funcionalidades permitidas para mi rol |
| **Para** | usar el sistema dentro de mis responsabilidades sin interferir con otras áreas |

**Tipo:** HU de Persona (cualquiera de las 3).
**Feature(s) origen:** F29.

**Descripción:** Sistema RBAC con tres roles (Operador, Gerente, Administrador). Cada rol tiene acceso a un subconjunto de endpoints del backend y vistas del frontend.

**Criterios de aceptación:**

- **CA-02.1:** Dado que el usuario tiene rol "Operador", cuando inicia sesión, entonces visualiza únicamente las vistas de monitoreo en tiempo real (dashboard principal, panel de motor adaptativo, panel de degradación) y no puede acceder a vistas del Gerente ni del Administrador.

- **CA-02.2:** Dado que el usuario tiene rol "Gerente", cuando inicia sesión, entonces visualiza únicamente las vistas de reportería ejecutiva (dashboard ejecutivo, comparativas, selector de periodo) y no puede acceder a vistas de monitoreo operativo ni de configuración técnica.

- **CA-02.3:** Dado que el usuario tiene rol "Administrador", cuando inicia sesión, entonces visualiza únicamente las vistas de configuración y salud del sistema (panel de componentes, métricas del modelo, configuración del motor) y no puede acceder a vistas operativas ni ejecutivas.

- **CA-02.4:** Dado que un usuario intenta acceder vía API a un endpoint que no corresponde a su rol, cuando la solicitud llega al backend, entonces el sistema responde con HTTP 403 Forbidden.

**Notas técnicas:** Campo `role` en tabla `User` con valores enum (`operator`, `manager`, `admin`). Asignación de roles se hace directamente en BD para MVP1 (no hay UI de gestión de roles, según default 3 del Parking Lot).

---

## HU-03 — Preparación de arquitectura del sistema

| Campo | Contenido |
|---|---|
| **Como** | Equipo de Desarrollo |
| **Quiero** | que la arquitectura técnica del sistema esté preparada y operativa en infraestructura local mediante Docker |
| **Para** | poder construir, probar y desplegar los módulos del sistema (visión, predicción, motor adaptativo, frontend, base de datos) de forma integrada y reproducible |

**Tipo:** HU Técnica (sujeto Equipo de Desarrollo como Stakeholder).
**Feature(s) origen:** Habilitador transversal (referencia: D-001 Monolito modular, D-003 Deploy Docker local).

**Descripción:** Configuración inicial de la arquitectura técnica del proyecto. Incluye la definición del docker-compose con todos los servicios, las dependencias entre ellos, la red interna, los volúmenes persistentes, y la configuración para que el sistema arranque con `docker compose up` en una máquina limpia.

**Criterios de aceptación:**

- **CA-03.1:** Dado un equipo con Docker y Docker Compose instalados, cuando ejecuta `docker compose up` por primera vez en el repositorio, entonces todos los servicios (core_management_api, edge_device, frontend_ui, db) inician correctamente y el sistema queda accesible vía URLs locales configuradas.

- **CA-03.2:** Dado que el sistema está corriendo, cuando un servicio necesita comunicarse con otro (ej. frontend → API, API → BD), entonces la comunicación se realiza vía la red interna de Docker sin requerir configuración manual de hosts.

- **CA-03.3:** Dado que el sistema se detiene y se reinicia, cuando se ejecuta `docker compose up` nuevamente, entonces los datos persistidos en la base de datos se mantienen (volúmenes correctamente configurados).

- **CA-03.4:** Dado un README de quickstart en el repositorio, cuando un nuevo miembro del equipo o el comité evaluador sigue las instrucciones en una máquina limpia, entonces el sistema queda funcional en menos de 15 minutos.

**Notas técnicas:** Estado actual: ✓ existe docker-compose parcial. Falta consolidar todos los servicios, validar quickstart en máquina limpia, documentar variables de entorno. Edge device contenerizado por separado coherente con D-001.

---

## HU-04 — Configuración de repositorio y entrega continua

| Campo | Contenido |
|---|---|
| **Como** | Equipo de Desarrollo |
| **Quiero** | tener un repositorio Git configurado con estándares de versionamiento y un pipeline de integración continua que valide cada cambio |
| **Para** | mantener calidad de código, evitar regresiones y tener trazabilidad de la evolución del proyecto durante el desarrollo |

**Tipo:** HU Técnica (sujeto Equipo de Desarrollo como Stakeholder).
**Feature(s) origen:** Habilitador transversal del proyecto.

**Descripción:** Configuración del repositorio Git (estructura de branches, convención de commits, .gitignore), y configuración de un pipeline CI que ejecuta tests automatizados, linting y verificación de tipos en cada push.

**Criterios de aceptación:**

- **CA-04.1:** Dado un cambio que un desarrollador hace localmente, cuando ejecuta `git push` al repositorio, entonces se dispara automáticamente un pipeline de CI que ejecuta tests unitarios, linting y verificación de tipos para los módulos afectados.

- **CA-04.2:** Dado que un pipeline de CI ha terminado, cuando los tests pasan exitosamente, entonces el estado del commit se marca como "verde" en el repositorio.

- **CA-04.3:** Dado que un pipeline de CI ha terminado, cuando algún test falla o el linting detecta errores, entonces el estado del commit se marca como "rojo" y el equipo recibe notificación visible del fallo.

- **CA-04.4:** Dado un conflicto entre el código nuevo y la rama principal, cuando se intenta fusionar el cambio, entonces el sistema requiere resolver el conflicto antes de permitir la fusión.

**Notas técnicas:** Estado actual: hay repositorio Git activo pero la cobertura de CI es parcial (referencia: item §5.5 de DISCOVERY_2026-05-10.md — *"CI no corre tests de edge_device, shared/, ia_prediction_service/"*). Esta HU formaliza la cobertura completa.

---

## Resumen del Bloque A

| HU | Título | Sujeto | Tipo | Feature(s) origen |
|---|---|---|---|---|
| HU-01 | Autenticación al sistema | Usuario del sistema | Persona | F01 |
| HU-02 | Acceso diferenciado por rol | Usuario del sistema | Persona | F29 |
| HU-03 | Preparación de arquitectura del sistema | Equipo de Desarrollo | Técnica | Habilitador (D-001, D-003) |
| HU-04 | Configuración de repositorio y entrega continua | Equipo de Desarrollo | Técnica | Habilitador |

**Total Bloque A: 4 HUs** (2 de Persona + 2 Técnicas).

---

## Persistencias movidas a otros bloques

Durante la conversación de cierre se identificó que las features F30 (persistencia de estados históricos) y F31 (persistencia de decisiones del motor) NO se redactan como HUs separadas, sino que se inglogan como criterios de aceptación de HUs de Personas reales:

- **F30 (persistencia de estados históricos)** → criterios de aceptación en HUs del Gerente (Bloque F), específicamente en las HUs que derivan de F12 (dashboard ejecutivo) y F14 (comparativa entre periodos). Sin persistencia histórica, esas HUs no pueden ser implementadas — el criterio "el sistema debe persistir los estados cada N segundos para que esta consulta funcione" entra ahí.

- **F31 (persistencia de decisiones del motor)** → criterios de aceptación en la HU del log de decisiones del Operador (Bloque B), específicamente la HU que deriva de F10. Sin persistencia, el log no existe.

---

## Próximos pasos

Esta sesión cierra aquí. Los siguientes bloques se redactarán en una nueva sesión usando este documento + los 5 documentos previos como fuente de verdad:

1. **Bloque B — Operador, núcleo de monitoreo** (9 features → estimadas 10-12 HUs).
2. **Bloque C — Operador, operación degradada** (6 features → estimadas 6-7 HUs).
3. **Bloque D — Administrador, soporte técnico** (3 features → estimadas 3-4 HUs).
4. **Bloque E — Componentes centrales del sistema** (4 features → estimadas 4-5 HUs, posiblemente algunas técnicas).
5. **Bloque F — Gerente, reportería mínima** (3 features → estimadas 3-5 HUs).
6. **MVP2 — HUs fuera del sprint pero documentadas** (5 features → estimadas 5 HUs).

Total estimado: **30-37 HUs adicionales**, sumando aproximadamente **34-41 HUs en todo el Product Backlog**.

---

## Documentos relacionados

- `DECISIONS.md` — Registro formal de decisiones técnicas (D-001 a D-008).
- `EVOLUCION_TESIS.md` — Narrativa de las 4 fases del proyecto.
- `LEAN_INCEPTION_INVESTIGACION.md` — Fundamentación del marco metodológico.
- `LEAN_INCEPTION_CEREBROVIAL.md` — Inception completo aplicado al proyecto.
- `FEATURE_BACKLOG_DETALLADO.md` — Detalle completo de las 35 features.
- `HU_BLOQUE_A.md` (este documento) — Primeras 4 HUs cerradas.
