# DECISIONS_HU — Decisiones metodológicas sobre la redacción de Historias de Usuario

> Registro formal de decisiones que afectan la redacción del Product Backlog del proyecto CerebroVial.
>
> **Alcance:** Estas decisiones aplican a TODO el Product Backlog (Bloques A–F + MVP2). Cualquier HU redactada después de la fecha de cada decisión debe respetarla.
>
> **Relación con `DECISIONS.md`:** El documento `DECISIONS.md` registra decisiones técnicas del producto (arquitectura, modelo, datos). Este documento registra decisiones metodológicas sobre cómo se redacta el backlog. Los códigos no se solapan: `D-xxx` para técnicas, `DHU-xxx` para HUs.
>
> **Fecha de creación:** 2026-05-13
> **Última actualización:** 2026-05-16 (**Cierre del Bloque F el 2026-05-16: DHU-016 agregada.** Consolida las decisiones de redacción del Bloque F en diez subsecciones (A a J), con resultado de 2 HUs operativas (HU-16 y HU-17) y 0 TTH nuevas. Con el cierre del Bloque F, las 15 HUs operativas (HU-01 a HU-17) y las 11 TTH (TTH-01 a TTH-11) del MVP1 quedan redactadas y aprobadas. Resta sesión MVP2 dedicada.)

---

## Índice de decisiones

| Código | Título | Fecha | Estado |
|---|---|---|---|
| DHU-001 | El login no es una HU; es una tarea técnica habilitadora | 2026-05-13 | Cerrada |
| DHU-002 | Reformulación del valor en HU de acceso diferenciado por rol | 2026-05-13 | Cerrada |
| DHU-003 | Sujetos válidos en HUs y exclusión del Equipo de Desarrollo | 2026-05-13 | Cerrada |
| DHU-004 | Tareas Técnicas Habilitadoras como categoría separada del Product Backlog | 2026-05-13 | Cerrada |
| DHU-005 | Principio de robustez ante interrupción de fuente de información | 2026-05-13 | Cerrada (refinada con Casos A y B durante Bloque B) |
| DHU-006 | HUs agnósticas a la implementación | 2026-05-13 | Cerrada |
| DHU-007 | RNF declarados como tales en sección específica | 2026-05-13 | Cerrada |
| DHU-008 | Distinción arquitectónica entre componente caído, modo degradado y lógica de fallback | 2026-05-13 | Cerrada (nota agregada 2026-05-14: renombrado "modo seguro" → "degradado nivel 3") |
| DHU-009 | Relación entre marca pasiva (Bloque B) y alerta activa (Bloque C) | 2026-05-13 | Cerrada |
| DHU-010 | Criterios para clasificar trabajo del Bloque C como TTH | 2026-05-13 | Cerrada |
| DHU-011 | Eliminación de HU-13 y cobertura de F25 por composición | 2026-05-13 | Cerrada |
| DHU-012 | Auditoría de coherencia documental: semántica de MVP, eliminación de MVP3, corrección de conteos, alineación de vocabulario, limpieza de residuo pre-Inception | 2026-05-14 | Cerrada |
| DHU-013 | Clasificación HU/TTH de las features del Bloque D | 2026-05-14 | Cerrada |
| DHU-014 | Decisiones de redacción del Bloque D (numeración, dashboard, parámetros, métricas, concurrencia, ventana temporal, TTH-06) | 2026-05-14 | Cerrada |
| DHU-015 | Clasificación HU/TTH de las features del Bloque E (con ampliación 4 → 5 TTH durante la redacción) | 2026-05-15 | Cerrada |
| DHU-016 | Decisiones de redacción del Bloque F (numeración, F30 inglobada, fuente del histórico en MVP1, KPIs operacionales, granularidad, periodos, comparativa, concurrencia, dashboard integrador, robustez) | 2026-05-16 | Cerrada |

---

## DHU-001 — El login no es una HU; es una tarea técnica habilitadora

**Fecha:** 2026-05-13.
**Reemplaza:** HU-01 (Autenticación al sistema) de la versión inicial del Bloque A.

### Contexto

La versión inicial del Bloque A contenía HU-01 redactada como:

> *Como Usuario del sistema (Operador, Gerente o Administrador), quiero autenticarme con mi nombre de usuario y contraseña, para acceder a las funcionalidades del sistema según mi rol.*

Durante la revisión del Bloque A se cuestionó si el login debía modelarse como HU. La discusión se resolvió consultando bibliografía especializada.

### Bibliografía consultada

**Postura a favor de modelar login como HU:**

- **Mike Cohn** (referencia bibliográfica principal del tema) usa explícitamente el login como ejemplo de HU en *User Stories Applied: For Agile Software Development* y en Mountain Goat Software:
  - *"As a customer, I can regain access to my account when I forget my password."*
  - *"As a user, I can log in through my Facebook / LinkedIn / Twitter account."* (como ejemplo de splitting).

**Postura en contra de modelar login como HU:**

- **Lullabot** ("Not Everything is a User Story"): *"We like to surrender to the forces of common sense and call a user story that no longer involves a user what it actually is: a task for a developer to perform."*

- **Scrum.org** ("User Story or Stakeholder Story?"): *"As a user I want to login so I can use the service. At first it seems ok, but here the user is not getting the value (if I could use the service without logging in, I would be happy, after all I want to do my job and logging in brings no value)."*

- **Práctica habitual en certificaciones PMP/PMI-ACP:** "Login Story → Tasks: API · UI · Validation · Error handling · Testing." Es decir, el login se descompone como conjunto de tareas técnicas que cuelgan de HUs de mayor valor.

### Análisis aplicado al caso CerebroVial

El login en CerebroVial es **estándar y sin sofisticación de negocio**: JWT + bcrypt, sin recuperación de contraseña, sin SSO, sin doble factor, sin bloqueo por intentos. Aplicando el filtro INVEST a la HU original:

- **V (Valuable):** "Para acceder a las funcionalidades según mi rol" es tautológico. El valor real está río abajo (monitorear, reportar, configurar), no en el acto de loguearse.
- **I (Independent):** No se puede entregar valor con HU-01 sin HU-02 (autenticar sin diferenciar roles no entrega nada). Están atadas.
- **N (Negotiable):** El comportamiento del login es técnico estándar; no hay conversación de negocio que tener.

### Decisión

**El login se elimina del Product Backlog como HU.** Se documenta como **Tarea Técnica Habilitadora** (TTH-01) en el documento `TAREAS_TECNICAS_HABILITADORAS.md`.

Los requisitos de autenticación que afectan a HUs operativas se inglogan como **criterios de aceptación** de esas HUs (por ejemplo: "Dado que el Operador no ha iniciado sesión, cuando intenta acceder al dashboard, entonces el sistema lo redirige al login").

### Consecuencias

- HU-01 original (Autenticación) se elimina del Bloque A.
- Se crea TTH-01 (Implementación de autenticación JWT con bcrypt) en `TAREAS_TECNICAS_HABILITADORAS.md`.
- Las HUs operativas que requieran autenticación incluyen un CA específico de redirección al login.

---

## DHU-002 — Reformulación del valor en HU de acceso diferenciado por rol

**Fecha:** 2026-05-13.
**Reemplaza:** HU-02 (Acceso diferenciado por rol) de la versión inicial del Bloque A.

### Contexto

La versión inicial de HU-02 declaraba como valor: *"para usar el sistema dentro de mis responsabilidades sin interferir con otras áreas"*. La redacción es técnicamente correcta pero el "valor para el usuario" es débil: nadie se entusiasma con "no interferir con otras áreas".

Tras eliminar HU-01 (DHU-001), HU-02 queda como la HU de acceso al sistema y necesita un valor de negocio más fuerte y defendible.

### Análisis

El valor real del acceso diferenciado por rol no es operativo (segregación de permisos) sino **cognitivo**: cada Persona tiene un contexto de trabajo distinto y la información ajena a su rol es ruido que degrada su capacidad de operar.

- El **Operador** trabaja en tiempo real con presión de respuesta inmediata. Ver reportes ejecutivos o pantallas de configuración del modelo lo distrae.
- El **Gerente** trabaja con horizonte semanal/mensual y necesita información agregada. Ver el detalle operativo en tiempo real lo abruma sin aportarle nada decisional.
- El **Administrador** trabaja con la salud técnica del sistema. Ver KPIs ejecutivos o pantallas operativas no le sirve para diagnosticar componentes.

Este valor (concentración / reducción de carga cognitiva) es defendible en sustentación y conecta con principios de diseño centrado en el usuario.

### Decisión

HU-02 (renumerada como HU-01 en el Bloque A actualizado) se reformula así:

> *Como Operador, Gerente o Administrador, quiero acceder únicamente a las funcionalidades correspondientes a mi rol, para concentrarme en mis responsabilidades específicas sin la carga cognitiva de información ajena a mi trabajo.*

### Consecuencias

- HU-02 original se elimina y se reescribe como nueva HU-01 del Bloque A.
- El valor pasa de "no interferir" (defensivo) a "concentrarme" (positivo, defendible).

---

## DHU-003 — Sujetos válidos en HUs y exclusión del Equipo de Desarrollo

**Fecha:** 2026-05-13.
**Reemplaza:** La regla original de sujetos del Bloque A.

### Contexto

La regla original (cerrada en la sesión previa) admitía dos tipos de sujeto:

1. HUs operativas → Persona del producto.
2. HUs técnicas → "Equipo de Desarrollo" como Stakeholder.

Tras DHU-001 y DHU-004, la categoría (2) deja de ser necesaria: el trabajo técnico se modela como Tareas Técnicas Habilitadoras, no como HUs. La regla se simplifica.

### Decisión

**Sujetos válidos en HUs del Product Backlog:**

1. Una de las 3 Personas del producto: **Operador de Tráfico Municipal**, **Gerente de Tránsito Municipal**, **Administrador del Sistema**.
2. Enumeración explícita de Personas cuando la funcionalidad es transversal (por ejemplo: "Operador, Gerente o Administrador").

**Sujetos NO válidos en HUs:**

- "El sistema" (sería una tarea técnica disfrazada).
- "Equipo de Desarrollo" (su trabajo se documenta como Tarea Técnica Habilitadora, no como HU).
- "Usuario" o "Usuario del sistema" sin especificar Persona (demasiado genérico, debilita el valor).

### Justificación bibliográfica

- **Mike Cohn** (*Mountain Goat Software*): *"Note that you don't see any user story, 'As a product owner, I want a list of certification courses so that...'. The product owner is an essential stakeholder, but is not the end user/customer. When creating user stories, it's best to be as specific as possible about the type of user."*

- El documento de referencia académica (`Desarrollo_Agil.pdf`) usa sujetos compuestos cuando aplica (HU20–HU24 con "Administrador de Sistemas, Desarrollador"), lo cual sustenta la enumeración explícita de Personas.

### Consecuencias

- HU-03 y HU-04 originales del Bloque A (con sujeto "Equipo de Desarrollo") dejan de ser HUs y se convierten en Tareas Técnicas Habilitadoras (ver DHU-004).
- La sección "Regla de sujetos en HUs" del Bloque A se reescribe según esta decisión.

---

## DHU-004 — Tareas Técnicas Habilitadoras como categoría separada del Product Backlog

**Fecha:** 2026-05-13.

### Contexto

Tras DHU-001 (eliminación del login como HU) y DHU-003 (exclusión del Equipo de Desarrollo como sujeto), surge la necesidad de **documentar el trabajo técnico de infraestructura** (setup Docker, repositorio Git, CI, autenticación) en algún lugar visible y trazable, sin contaminarlo con el formato de HU.

### Bibliografía consultada

El concepto de **Enabler** o **Tarea Técnica Habilitadora** está formalizado en varias fuentes:

- **SAFe (Scaled Agile Framework)** distingue "Business Stories" (valor de negocio) de "Enabler Stories" (trabajo técnico habilitador): infraestructura, exploración, arquitectura, cumplimiento.
- **Lullabot** ("Not Everything is a User Story"): *"In general, it's better to surrender to common sense and not put these kinds of technical requirements into the user's voice. Instead, write simple, imperative statements that declare what must be done."*
- **Práctica común en certificaciones PMP/PMI-ACP:** distinguir explícitamente "User Story" (valor) de "Task" (trabajo técnico).

### Decisión

El proyecto CerebroVial mantiene **dos categorías separadas** dentro de su gestión de backlog:

1. **Product Backlog (HUs):** Contiene únicamente HUs con sujeto Persona del producto. Formato: "Como X, quiero Y, para Z" con criterios Given-When-Then.

2. **Tareas Técnicas Habilitadoras (TTH):** Contiene el trabajo técnico de infraestructura necesario para que las HUs puedan ser implementadas. Formato: enunciado imperativo + descripción + criterios técnicos de "terminado" (sin Given-When-Then).

Ambas categorías son entregables del proyecto y ambas son evaluables, pero no se mezclan en un mismo documento ni se priorizan con los mismos criterios.

### Ubicación física

- HUs → `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md`, etc.
- TTH → `TAREAS_TECNICAS_HABILITADORAS.md` (documento único transversal a todos los bloques).

### Criterios para clasificar un trabajo como TTH y no como HU

Un trabajo se documenta como TTH (no como HU) si cumple **alguna** de estas condiciones:

1. No tiene una Persona del producto como beneficiaria directa.
2. Su valor es instrumental (habilita otras funcionalidades) y no de negocio.
3. Su comportamiento es técnico estándar sin negociación de negocio.
4. No se entrega valor visible al usuario al completarla en aislamiento.

### Consecuencias

- Se crea el documento `TAREAS_TECNICAS_HABILITADORAS.md`.
- HU-03 y HU-04 originales del Bloque A se convierten en TTH-02 (Arquitectura Docker) y TTH-03 (Repositorio + CI).
- HU-01 original del Bloque A se convierte en TTH-01 (Autenticación JWT) por DHU-001.
- El Bloque A queda con una sola HU (la antes llamada HU-02, ahora HU-01 reformulada).

---

## DHU-005 — Principio de robustez ante interrupción de fuente de información

**Fecha:** 2026-05-13.
**Estado:** Cerrada (versión inicial durante HU-02; refinada con Casos A y B durante HU-05).

### Contexto

Durante la redacción de HU-02 (monitoreo en tiempo real) se identificó la necesidad de un comportamiento explícito ante pérdida temporal de la fuente de datos: el sistema no debe mostrar datos viejos al Operador como si fueran actuales, porque eso lo lleva a tomar decisiones sobre información inválida.

Durante la redacción de HU-05 (visualización de estrategia activa) se descubrió que el principio original era insuficiente: el caso de un componente interno de decisión caído (motor adaptativo no responde) es distinto al caso de una fuente externa de medición caída (mediciones del tráfico no llegan). La diferencia semántica importa al usuario.

### Decisión

Toda HU operativa que muestre información dependiente de una fuente externa de medición o de un componente interno del sistema debe incluir un criterio de aceptación explícito sobre el comportamiento de la vista cuando esa fuente deja de actualizar el dato. La información no debe presentarse al Operador como si fuera vigente cuando no podemos garantizarlo.

**Casos cubiertos:**

**Caso A — Fuente externa de medición del mundo observado.** Aplica a HUs que muestran mediciones del estado real del tráfico (flujos, colas, velocidades). Cuando la fuente de medición deja de emitir, el sistema mantiene en pantalla los últimos valores conocidos, los marca visualmente como **"desactualizados"** e indica el tiempo transcurrido desde la última actualización. La palabra "desactualizado" comunica que el dato existe pero no refleja necesariamente lo que está pasando ahora.

**Caso B — Componente interno de decisión del sistema.** Aplica a HUs que muestran decisiones tomadas por componentes internos del sistema (estrategia de control activa, predicciones del modelo, explicaciones, eventos de notificación). Cuando el componente decisor deja de responder, el sistema mantiene en pantalla la última decisión conocida, la marca visualmente como **"no confirmada"** e indica el tiempo transcurrido desde la última confirmación. La palabra "no confirmada" comunica que no podemos garantizar que esa decisión siga vigente, porque el componente que la confirma no está respondiendo.

### Alcance de cada HU

Cada HU operativa es responsable únicamente de **marcar pasivamente** su propio panel según el caso que corresponda (A o B). La **notificación activa al Operador** ante una caída de componente que afecta la operación general del sistema es responsabilidad de las HUs del Bloque C (operación degradada), que actúan de forma transversal a todas las vistas. Esta separación se formaliza en DHU-009.

Las HUs operativas **no duplican** esa lógica ni la referencian explícitamente; cada bloque cumple su responsabilidad:

- **Bloque B (monitoreo):** marca pasiva en cada panel afectado.
- **Bloque C (degradación):** alerta activa transversal sobre el estado del sistema completo.

### Justificación

Separar marca pasiva (responsabilidad de cada vista) de alerta activa (responsabilidad transversal) evita duplicación de lógica, mantiene HUs cohesivas, y respeta la separación que ya estaba implícita en el Sequencer del Lean Inception (Bloque B = monitoreo, Bloque C = degradación).

### Aplicaciones del principio en el backlog

| HU | Caso aplicado | CA específico |
|---|---|---|
| HU-02 (monitoreo) | Caso A (fuente de medición) | CA-02.4 |
| HU-03 (predicción) | Caso B (componente predictivo) | CA-03.4 |
| HU-04 (vista combinada) | Casos A + B independientes | CA-04.4 |
| HU-05 (estrategia activa) | Caso B (motor adaptativo) | CA-05.4 |
| HU-06 (explicación) | Caso B (componente de explicación) | CA-06.4 |
| HU-07 (notificación) | Caso B aplicado a canal de eventos | CA-07.5 |
| HU-08 (log) | Variante de resiliencia (operación no detenida) | CA-08.5 |
| HU-09 (notas) | Información de error al Operador | CA-09.5 |

---

## DHU-006 — HUs agnósticas a la implementación

**Fecha:** 2026-05-13.

### Contexto

Durante la redacción de HU-02 se detectó la tentación de mencionar tecnologías concretas en la HU (por ejemplo, "el módulo de visión o el simulador SUMO emite métricas"). Esto contamina la HU con detalles de implementación y la ata a una arquitectura específica.

### Análisis

Mike Cohn formula el principio así: las HUs deben describir el **qué** (el comportamiento observable por el usuario) y no el **cómo** (la implementación). Las Personas del producto no son consumidoras de detalles técnicos; son consumidoras de comportamiento.

En el caso de CerebroVial, este principio tiene consecuencias prácticas importantes:

- "Módulo de visión computacional" → implementación. La HU dice "el sistema observa el tráfico".
- "Simulador SUMO" → implementación. La HU dice "fuente de datos del tráfico".
- "Modelo GRU" → implementación. La HU dice "el sistema predice".
- "Webster / MaxPressure / MTC" → implementación. La HU dice "el sistema selecciona la estrategia de control".
- "Waze jam level" → constructo técnico. La HU dice "nivel de congestión en escala 0-5".

### Decisión

Las HUs **NO** mencionan tecnologías, componentes técnicos, frameworks ni constructos específicos en su redacción (Como/Quiero/Para, Descripción, Criterios de aceptación). Estos detalles viven en:

- **Tareas Técnicas Habilitadoras** (`TAREAS_TECNICAS_HABILITADORAS.md`): especifican componentes técnicos con todo detalle.
- **Decisiones técnicas** (`DECISIONS.md`): registran las elecciones tecnológicas formales (D-001 a D-009).
- **Notas técnicas** dentro de cada HU: pueden referenciar decisiones técnicas por código (por ejemplo, "según D-008") sin nombrar tecnologías concretas.
- **Documento RF/RNF futuro**: especificará requisitos técnicos detallados.

### Excepciones

Se permite mencionar el constructo "nivel de congestión 0-5" (escala ordinal) en las HUs sin referenciar a Waze por nombre, porque la escala 0-5 ya es un concepto autónomo del sistema CerebroVial, aunque su origen sea Waze. El detalle de la adopción y mapeo vive en D-009.

### Consecuencias

- Toda HU del Bloque B (HU-02 a HU-09) cumple este principio.
- Si se detecta una HU previamente redactada que viola el principio, se reescribe sin perder su contenido funcional.
- Al redactar nuevos bloques, el redactor revisa cada CA para verificar que no se introdujeron menciones técnicas inadvertidas.

---

## DHU-007 — RNF declarados como tales en sección específica

**Fecha:** 2026-05-13.

### Contexto

Durante la redacción de HU-02 se observó que los CAs estaban absorbiendo **requisitos no funcionales** (RNF) que técnicamente pertenecen a otro tipo de documento: umbrales de latencia, comportamiento ante fallos, criterios de usabilidad, etc. Por ejemplo:

> *CA-02.2: ...con una latencia máxima de 5 segundos desde que la medición se genera.*

"Latencia máxima de 5 segundos" no es un criterio funcional (¿qué hace el sistema?); es un criterio de rendimiento (¿con qué calidad lo hace?). Esto pertenece a la familia de requisitos no funcionales según ISO/IEC 25010.

### Análisis

La práctica académica y de industria recomienda separar RF de RNF:

- **RF (Requisitos Funcionales):** qué hace el sistema. Se derivan de las HUs.
- **RNF (Requisitos No Funcionales):** cómo lo hace. Rendimiento, disponibilidad, seguridad, usabilidad, mantenibilidad, portabilidad.

Si los umbrales numéricos viven hardcodeados en cada CA:

- Cambiar un umbral implica modificar múltiples HUs.
- No hay un lugar único donde consultar todos los RNF del sistema.
- El jurado académico no ve trazabilidad explícita entre HU y RNF.

Sin embargo, eliminar los umbrales de los CAs ahora mismo (durante la redacción inicial) tendría el costo de **perder información** antes de tener el documento RF/RNF formal donde reubicarla. La solución es marcar explícitamente qué partes de cada HU son candidatas a RNF.

### Decisión

Cada HU del Product Backlog incluye al final una sección **"Candidatos a RNF (para futuro documento RF/RNF)"** que lista los criterios numéricos, de robustez, de usabilidad u otros que probablemente se moverán al documento RF/RNF cuando se redacte. Esto:

1. Da trazabilidad futura sin frenar el trabajo actual.
2. Permite mantener los umbrales en los CAs por ahora (para que los CAs sean autocontenidos durante la redacción).
3. Anticipa qué criterios se reemplazarán por referencias `RNF-XXX-NN` cuando exista el documento formal.

### Formato de la sección

```markdown
### Candidatos a RNF (para futuro documento RF/RNF)

- **RNF de rendimiento:** [descripción] (referencia al CA donde aparece).
- **RNF de robustez:** [descripción] (referencia al CA donde aparece).
- **RNF de usabilidad:** [descripción]. Probablemente se valida con prueba de usuario.
- **RNF de [otra categoría]:** [descripción].
```

Las categorías típicas (siguiendo ISO/IEC 25010) son: rendimiento, robustez, usabilidad, seguridad, mantenibilidad, portabilidad, escalabilidad, configurabilidad, persistencia, auditoría, retención, trazabilidad, inmutabilidad.

### Trabajo futuro asociado a esta decisión

Tras cerrar todos los bloques del Product Backlog, se redactará el documento **`REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md`** que:

1. Consolida los "Candidatos a RNF" de todas las HUs en un documento único.
2. Numera cada RNF (`RNF-RENDIMIENTO-01`, etc.).
3. Define umbrales aprobados (que pueden ajustarse respecto a los valores tentativos de las HUs).
4. Reemplaza, en cada HU, los umbrales hardcodeados por referencias al RNF correspondiente.

Este trabajo es una **sesión dedicada futura**, no se hace simultáneamente con la redacción de HUs.

### Consecuencias

- Toda HU redactada a partir de Bloque B incluye la sección "Candidatos a RNF".
- HU-01 del Bloque A se actualiza para incluir esta sección (retroactivo).
- Se reconoce que el documento `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md` es un entregable pendiente del proyecto.

---

## DHU-008 — Distinción arquitectónica entre componente caído, modo degradado y lógica de fallback

**Fecha:** 2026-05-13.
**Estado:** Cerrada.
**Aplica a:** Bloque C — Operador, operación degradada.

> **Nota agregada el 2026-05-14 (DHU-012):** El estado originalmente llamado "modo seguro" en esta decisión fue renombrado a "degradado nivel 3" para uniformidad del vocabulario de niveles de degradación. El renombrado aplica a esta DHU y a todas las referencias del backlog. Ver DHU-012 sección "Renombrado de 'modo seguro' a 'degradado nivel 3'".

### Contexto

Al cierre del Bloque B, DHU-005 quedó con una promesa abierta: "el Bloque C cubre la alerta activa transversal cuando un componente del sistema se cae". Al abrir el Bloque C para honrar esa promesa, se observó que el backlog detallado del Bloque C usa el término **"operación degradada"** en lugar de "componente caído". Son conceptos cercanos pero no idénticos, y mezclarlos genera HUs ambiguas.

### Análisis

Hay **tres conceptos distintos** que el Bloque C tiene que cubrir, y conviene separarlos explícitamente:

**Concepto 1 — Componente caído (estado binario, hecho técnico):**
Un componente específico del sistema dejó de responder. Ejemplos: el motor adaptativo no responde a solicitudes, el modelo predictivo no genera predicciones, la fuente de mediciones del tráfico no emite, la base de datos no acepta escrituras. Es atribuible a un componente específico y verificable por health check.

**Concepto 2 — Modo degradado (estado del sistema completo, condición operativa):**
El sistema como un todo está operando con capacidades reducidas. Ejemplos: "Sin predicción" (el sistema opera solo con estado observado), "Sin observación" (opera con histórico), "Degradado nivel 3" (aplica tiempos fijos preconfigurados). Es un estado derivado de qué componentes están caídos y qué fallbacks se aplican.

**Concepto 3 — Lógica de fallback en cascada (mecanismo interno):**
Es la regla automatizada que decide qué hacer cuando un componente cae. Define la transición entre el estado normal y un modo degradado específico, o entre un modo degradado y una falla total si no hay fallback aplicable.

### Relación entre los tres conceptos

```
Componente caído + Lógica de fallback aplicable  →  Modo degradado activo
Componente caído + Sin fallback aplicable        →  Falla total
Todos los componentes funcionando                →  Operación normal
```

El Operador necesita distinguir entre los tres estados resultantes:

- **Operación normal:** no hay alerta.
- **Modo degradado activo:** el sistema sigue operando pero con capacidades reducidas; el Operador debe saberlo.
- **Falla total:** el sistema no está operando; el Operador debe escalar.

### Decisión

El Bloque C distingue explícitamente los tres conceptos en HUs y TTH separadas:

| Concepto | Tipo de entrega | Features que cubre |
|---|---|---|
| Componente caído (estado técnico visible al Operador) | HU operativa (vista de estado de componentes) | F23 |
| Modo degradado (alerta activa transversal y explicación) | HUs operativas (alerta + mensaje + indicación contextual) | F22, F24, F25 |
| Lógica de fallback en cascada (mecanismo interno) | TTH (no HU; sin Persona beneficiaria directa) | F26 |
| Configuración del degradado nivel 3 (parámetro del sistema) | TTH (no HU; valor parametrizable interno) | F27 |

### Mapeo concreto

**HUs operativas del Bloque C (4 HUs):**

| HU | Cubre | Features |
|---|---|---|
| HU-10 | Alerta activa transversal cuando el sistema entra en modo degradado o falla total | F22 |
| HU-11 | Vista detallada del estado de cada componente del sistema | F23 |
| HU-12 | Explicación del modo degradado activo y sus implicaciones operativas | F24 |
| HU-13 | Indicación contextual del modo degradado en cada panel afectado | F25 |

**TTH del Bloque C (2 TTH):**

| TTH | Cubre | Features |
|---|---|---|
| TTH-04 | Lógica de fallback en cascada del sistema | F26 |
| TTH-05 | Configuración de tiempos fijos para degradado nivel 3 | F27 |

### Justificación de las TTH

F26 (lógica de fallback) y F27 (configuración del degradado nivel 3) cumplen los criterios de DHU-004 para clasificar como TTH:

- **F26:** mecanismo del backend que opera automáticamente sin participación del Operador. No tiene Persona del producto como beneficiaria directa (DHU-004 criterio 1). Su valor es instrumental (DHU-004 criterio 2). Su comportamiento es técnico estándar (DHU-004 criterio 3).
- **F27:** es un conjunto de parámetros de configuración del sistema, no una funcionalidad operativa. No se entrega valor visible al usuario al completarla en aislamiento (DHU-004 criterio 4).

### Lo que esta decisión deja abierto para la próxima sesión

La decisión arquitectónica está cerrada, pero las HUs concretas del Bloque C todavía deben redactarse. Tres cosas se resuelven al redactar las HUs:

1. **Niveles de severidad de la alerta activa.** ¿"Modo degradado" y "falla total" disparan la misma alerta o tienen estilos visuales distintos? Probablemente distintos.
2. **Persistencia del estado de modo degradado.** ¿Se registra en BD para reporte ejecutivo del Gerente (Bloque F)? Probable que sí, pero la decisión se cierra en el Bloque F.
3. **Capacidad del Operador de "reconocer" la alerta.** ¿Puede silenciarla mientras dura el modo degradado? Decisión de UX a cerrar en la redacción de HU-10.

### Consecuencias

- El Bloque C se redacta con esta estructura de 4 HUs + 2 TTH (refinado a 3 HUs + 2 TTH por DHU-011).
- TTH-04 y TTH-05 se agregan al documento `TAREAS_TECNICAS_HABILITADORAS.md` cuando se redacten formalmente.
- La promesa abierta en DHU-005 ("Bloque C cubre la alerta activa transversal") se cierra mediante HU-10 (ver DHU-009).

---

## DHU-009 — Relación entre marca pasiva (Bloque B) y alerta activa (Bloque C)

**Fecha:** 2026-05-13.
**Estado:** Cerrada.
**Aplica a:** Coordinación entre Bloque B y Bloque C.

### Contexto

DHU-005 cubrió el principio de robustez ante interrupción de fuente con dos casos (A: fuente externa, B: componente interno), pero dejó implícita una pregunta: si tanto el Bloque B como el Bloque C se ocupan del comportamiento ante caídas, ¿cómo se distinguen sus responsabilidades sin duplicarse?

DHU-008 estableció que el Bloque C cubre tres conceptos distintos, uno de ellos siendo la alerta activa transversal. Falta aclarar la relación entre la marca pasiva de cada panel (Bloque B) y la alerta activa transversal (Bloque C).

### Decisión

Las HUs del Bloque B y la HU-10 del Bloque C cumplen funciones complementarias, no duplicadas:

**Bloque B — Marca pasiva en el panel propio:**
- Notifica caída individual de la fuente o componente específico de ese panel.
- Es contextual: solo aparece en el panel afectado.
- Es pasiva: el Operador la descubre al mirar el panel.
- Propósito: ayudar al Operador a interpretar **qué panel específico** está afectado.

**Bloque C (HU-10) — Alerta activa transversal:**
- Notifica el estado del sistema completo (modo degradado o falla total).
- Es transversal: aparece en cualquier vista del sistema, independiente del panel que esté abierto.
- Es activa: busca la atención del Operador, no espera a que mire.
- Propósito: decirle al Operador **qué está haciendo el sistema completo** y si está operando con capacidades reducidas.

### Por qué no es duplicación

Un mismo evento físico (por ejemplo, motor adaptativo caído) puede disparar ambas señales legítimamente:

- **HU-05 del Bloque B** marca el panel de estrategia como "no confirmada" (DHU-005 Caso B). Esto le dice al Operador: "este dato específico ya no podemos garantizarlo".
- **HU-10 del Bloque C** dispara una alerta activa transversal "Degradado nivel 3 activo" cuando el fallback de TTH-04 aplica tiempos fijos. Esto le dice al Operador: "el sistema completo entró en degradado nivel 3; sabelo aunque estés mirando otra pantalla".

Las dos señales transportan **información distinta y útil al mismo tiempo**: la primera explica un panel específico; la segunda explica el estado del sistema completo. Eliminar una rompe una capacidad operativa real.

### Reglas operativas

1. **Las HUs del Bloque B no referencian explícitamente al Bloque C** en sus CAs. La marca pasiva del Bloque B es una responsabilidad autocontenida.

2. **La HU-10 del Bloque C no duplica los detalles** que cada panel del Bloque B marca pasivamente. La HU-10 describe el estado del sistema completo en términos de modo activo (degradado, falla total), no de qué pasa en cada panel.

3. **La HU-11 del Bloque C (vista de estado de componentes) sí muestra detalle por componente.** Es el lugar donde el Operador puede consultar específicamente qué componente está caído, sin tener que recorrer todos los paneles del Bloque B uno por uno.

### Consecuencias

- HU-10 del Bloque C se redacta como "alerta del estado del sistema completo", no como "alerta por cada componente".
- HU-11 del Bloque C se redacta como "vista por componente", complementaria al Bloque B.
- Las HUs del Bloque B se mantienen sin cambios (no necesitan referencia al Bloque C).
- DHU-005 queda cerrada y completada con esta decisión.

---

## DHU-010 — Criterios para clasificar trabajo del Bloque C como TTH

**Fecha:** 2026-05-13.
**Estado:** Cerrada.
**Aplica a:** Bloque C — Operador, operación degradada.

### Contexto

DHU-004 estableció criterios generales para clasificar trabajo como TTH (no HU). Al aplicarlos al Bloque C, dos features (F26 y F27) caen claramente en la categoría TTH. Esta decisión formaliza la aplicación específica al Bloque C, evitando ambigüedad futura.

### Decisión

Las features F26 (Lógica de fallback en cascada del backend) y F27 (Configuración de tiempos fijos para degradado nivel 3) del Bloque C se modelan como Tareas Técnicas Habilitadoras (TTH-04 y TTH-05), no como HUs.

### Aplicación de los criterios de DHU-004

**F26 — Lógica de fallback en cascada del backend:**

| Criterio DHU-004 | F26 cumple |
|---|---|
| 1. No tiene Persona del producto beneficiaria directa | Sí. Es lógica interna del backend que opera automáticamente. |
| 2. Su valor es instrumental, no de negocio | Sí. Habilita los modos degradados pero no genera valor visible al Operador en aislamiento. |
| 3. Comportamiento técnico estándar sin negociación de negocio | Sí. La regla "si X cae, aplicar Y" no requiere conversación con un Persona. |
| 4. Sin valor visible al usuario en aislamiento | Sí. El Operador nunca interactúa con la lógica de fallback; interactúa con sus resultados (modo degradado). |

**F27 — Configuración de tiempos fijos para degradado nivel 3:**

| Criterio DHU-004 | F27 cumple |
|---|---|
| 1. No tiene Persona del producto beneficiaria directa | Sí. Es un conjunto de parámetros del sistema. |
| 2. Su valor es instrumental, no de negocio | Sí. Solo se usa cuando se activa el degradado nivel 3. |
| 3. Comportamiento técnico estándar | Sí. Configuración de valores numéricos, no negociable funcionalmente. |
| 4. Sin valor visible al usuario en aislamiento | Sí. El Operador no usa F27 directamente; usa los efectos del degradado nivel 3 cuando se activa. |

### Lo que NO es TTH en el Bloque C

Para evitar confusión, lo siguiente del Bloque C NO se clasifica como TTH:

- **F22, F23, F24, F25** son funcionalidades visibles al Operador → son HUs (HU-10, HU-11, HU-12, HU-13).
- **El comportamiento esperado del sistema cuando entra en modo degradado** desde la perspectiva del Operador → es HU (HU-10).
- **La explicación del modo degradado** desde la perspectiva del Operador → es HU (HU-12).

### Consecuencias

- TTH-04 (Lógica de fallback en cascada del sistema) se agrega a `TAREAS_TECNICAS_HABILITADORAS.md` cuando se redacte formalmente.
- TTH-05 (Configuración de tiempos fijos para degradado nivel 3) se agrega a `TAREAS_TECNICAS_HABILITADORAS.md` cuando se redacte formalmente.
- El Bloque C queda con 4 HUs + 2 TTH como composición final (refinado a 3 HUs + 2 TTH por DHU-011).

---

## DHU-011 — Eliminación de HU-13 y cobertura de F25 por composición

**Fecha:** 2026-05-13.
**Estado:** Cerrada.
**Aplica a:** Bloque C — Operador, operación degradada.

### Contexto

DHU-008 estableció que el Bloque C cubriría tres conceptos distintos (componente caído, modo degradado, lógica de fallback) con un mapeo definitivo de 4 HUs operativas (HU-10 a HU-13) + 2 TTH (TTH-04, TTH-05). HU-13 estaba prevista para cubrir F25 (Indicación contextual en panel de modo degradado activo).

Durante la redacción detallada del Bloque C, al diferenciar HU-13 de las marcas pasivas del Bloque B (DHU-005 Casos A y B) se identificó que HU-13 **no aporta valor incremental real al Operador** dado los fallbacks declarados en F26 y la cobertura existente del Bloque B.

### Análisis

Los fallbacks declarados en F26 producen tres efectos distintos sobre los paneles del Operador:

| Nivel de fallback | Efecto sobre paneles del Operador | Cobertura existente |
|---|---|---|
| Nivel 1 (motor sin métricas de visión) | Los paneles que dependen de visión muestran datos viejos. | Marca pasiva DHU-005 Caso A en panel de visión. |
| Nivel 2 (predictor de respaldo activo) | Panel de predicción muestra datos **vigentes** pero de menor precisión. | Sin cobertura específica; HU-13 hubiese cubierto este caso. |
| Nivel 3 (tiempos preconfigurados) | Panel de estrategia activa congelado (no hay decisión nueva). | Marca pasiva DHU-005 Caso B en panel de estrategia. |

HU-13 con alcance amplio tendría valor real únicamente en el nivel 2 (predictor de respaldo activo). Para los niveles 1 y 3, las marcas pasivas del Bloque B ya cubren la información necesaria al Operador sin agregar nada que el Operador no sepa ya.

Mantener HU-13 con alcance acotado al nivel 2 sería redactar una HU completa para una única manifestación visual. Mantenerla con alcance amplio anticipando fallbacks futuros sería redactar una HU que en MVP1 sólo activa una etiqueta en un caso. Las dos opciones tienen baja relación valor/esfuerzo.

### Análisis adicional del Operador

Desde la perspectiva del Operador, la información que F25 buscaba comunicar ya está disponible por composición:

1. **Que el sistema está en modo degradado** → comunicado por la alerta transversal de HU-10.
2. **Qué componente específico falló** → consultable en la vista de HU-11.
3. **Qué significa operativamente el modo activo** → explicado por el texto compuesto de HU-12.
4. **Que un panel específico está afectado** → cubierto por la marca pasiva del Bloque B cuando el dato es viejo (Caso A o B según corresponda), y por la disponibilidad de las marcas en el panel afectado.

El único hueco residual es comunicar, en el panel específico de predicción del nivel 2, que el dato vigente proviene del predictor de respaldo. Este hueco es lo suficientemente acotado como para no justificar una HU dedicada en el alcance del MVP1.

### Decisión

Se elimina HU-13 del backlog del Bloque C. F25 queda cubierta funcionalmente por la composición de:

- HU-10 (alerta transversal del estado operativo).
- HU-11 (vista de estado de componentes, con refinamiento de resalte visual aprobado en esta decisión).
- HU-12 (explicación del modo degradado).
- Las marcas pasivas existentes del Bloque B (DHU-005 Casos A y B).

Refinamiento asociado a HU-11: se agrega un criterio de aceptación (CA-11.9) que declara explícitamente el resalte visual de las entradas de componentes en estado no-OK dentro de la vista de HU-11, para que el Operador pueda identificar de un vistazo qué componentes requieren atención. Este refinamiento absorbe el espíritu de F25 en la vista que ya tiene esa responsabilidad natural (HU-11), en lugar de crear una HU dedicada.

### Por qué este patrón es coherente con el resto del backlog

La cobertura por composición no es nueva en este Product Backlog. Ya se aplicó en:

- **F02 (Dashboard principal)** del Bloque B: cubierto por la composición visual de HU-02, HU-03, HU-04, HU-05 y HU-06, sin generar HU propia. Documentado en el cierre del Bloque B.
- **F30 (Persistencia de estados históricos)** del Bloque A: cubierto por inglobación como CA en HUs del Gerente (Bloque F). Documentado en el cierre del Bloque A.
- **F31 (Persistencia de decisiones del motor)** del Bloque A: inglobada como CA-08.1 de HU-08. Documentado en el cierre del Bloque A.

DHU-011 aplica el mismo principio a F25: cubrir una feature por composición de otras HUs cuando no se justifica una HU dedicada.

### Consecuencias

- HU-13 deja de existir en el Bloque C.
- HU-11 se refina con CA-11.9 (resalte visual de componentes en estado no-OK), una nota técnica que documenta la decisión, y un RNF de usabilidad ampliado.
- El Bloque C queda con composición final: **3 HUs operativas (HU-10, HU-11 refinada, HU-12) + 2 TTH (TTH-04, TTH-05)**.
- Esta decisión actualiza el mapeo de DHU-008, que originalmente preveía 4 HUs.
- F25 se documenta como "cubierta por composición" en la sección de mapeo del Bloque C.

### Lo que NO cambia

- DHU-008 sigue siendo válida en su separación conceptual de los tres conceptos (componente caído, modo degradado, lógica de fallback). DHU-011 solo refina el mapeo a HUs concretas.
- DHU-009 sigue siendo válida en su separación entre marca pasiva del Bloque B y alerta activa del Bloque C.
- DHU-010 sigue siendo válida en la clasificación de F26 y F27 como TTH.

### Documentos relacionados

- `HU_BLOQUE_C.md` — refleja la composición final 3 HUs + 2 TTH.
- `DECISIONS_HU.md` (este documento) — sección DHU-011.

---

## DHU-012 — Auditoría de coherencia documental: semántica de MVP, eliminación de MVP3, corrección de conteos, alineación de vocabulario y limpieza de residuo pre-Inception

**Fecha:** 2026-05-14.
**Estado:** Cerrada.
**Aplica a:** Todo el Product Backlog y los documentos relacionados.

### Contexto

Durante la preparación de la sesión de redacción del Bloque D se detectó un conjunto extenso de inconsistencias documentales entre los archivos del proyecto. Una auditoría sistemática identificó **10 inconsistencias específicas** (INC-01 a INC-10) cuyo origen es:

1. **Documentos generados en sesiones distintas** que evolucionaron sin sincronización (Inception del 11-mayo, fichas del backlog, cierres de Bloques A/B/C posteriores).
2. **Decisiones cerradas en conversación** que no quedaron documentadas formalmente (por ejemplo, omisión silenciosa de F18 en próximos pasos de Bloques B y C).
3. **Residuo del régimen previo al Inception** que no se limpió tras el cambio de marco metodológico (referencias a `PLAN.md`, "TODO", "Bloques K/J/F" del plan obsoleto, IDs "HU-16" y "HU-17" de hitos pre-Inception).
4. **Errores aritméticos** en conteos del Sequencer original (26 declarado vs 29 real al sumar bloques).

Esta decisión consolida la resolución de las 10 inconsistencias en un acto único de coherencia documental.

### Decisiones consolidadas

DHU-012 cierra los siguientes refinamientos, agrupados temáticamente:

#### A. Semántica de MVP refinada (INC-01)

La política previa establecía que "MVP2 se documenta como HU pero no se construye" (decisión cerrada #10 del Inception). La política nueva refina esto:

| Categoría | Política nueva |
|---|---|
| MVP1 | Se redacta como HU. Se construye. Es entregable comprometido del proyecto académico. |
| MVP2 | Se redacta como HU. Se construye **condicional a holgura** tras cerrar las MVP1. Es entregable redactado, no necesariamente entregable construido. |
| MVP3 | **Categoría eliminada.** Ver subsección B. |

**Consecuencia operativa para HUs MVP2 ya redactadas:** la nota técnica de HU-09 (única HU MVP2 hasta hoy) se suaviza para reflejar la nueva semántica (de "esta HU NO se implementa en MVP1" a "esta HU es candidata; su construcción se considera si el cronograma permite holgura").

#### B. Eliminación de la categoría MVP3 (INC-04)

La categoría "MVP3" del Sequencer original se renombra a **"Trabajos Futuros"** y se reformula su semántica:

- **Antes (MVP3):** "no se documenta como HU, solo se menciona como trabajo futuro" (Inception línea 263, redacción original).
- **Después (Trabajos Futuros):** las direcciones de trabajo futuro **se documentan como fichas de feature** en el backlog detallado (con ficha liviana), **NO se redactan como HU**, **NO se construyen**, **se mencionan en el capítulo de trabajo futuro del documento de tesis**.

**Razón del renombrado:** el término "MVP3" sugiere semánticamente "tercera iteración del MVP que eventualmente se construye". El término "Trabajos Futuros" refleja con precisión la naturaleza real de estas direcciones (líneas declaradas fuera del alcance académico, candidatas a futuras extensiones del producto o de la investigación).

**Composición resultante:** 7 direcciones de Trabajos Futuros, todas con ficha en el backlog detallado:

| ID | Título | Origen documental |
|---|---|---|
| F21 | Reentrenamiento del modelo predictivo (pipeline MLOps) | Brainstorming original del Inception (Artefacto 7) |
| F36 | Reconocimiento de tipos de vehículos para priorización | Sequencer del Inception MVP3 (original) |
| F37 | Coordinación de ondas verdes entre intersecciones vecinas | Sequencer del Inception MVP3 (cita D-006) |
| F38 | Procesamiento de datos reales de Waze | Sequencer del Inception MVP3 (cita D-008) |
| F39 | Despliegue real en Raspberry Pi como dispositivo de borde | Sequencer del Inception MVP3 (cita D-004) |
| F40 | Notificaciones push y monitoreo proactivo de cámaras | Sequencer del Inception MVP3 |
| F41 | Integración cerrada del módulo de visión al loop de validación cuantitativa | `EVOLUCION_TESIS.md` sección 8 (cita D-007) |

**Asimetría justificada:** F21 conserva ficha completa (entró al Brainstorming original con detalle); F36 a F41 son fichas livianas (estructura reducida sin "Revisión UX" ni "Estado actual en el repo"). Esta asimetría preserva el contenido histórico de F21 sin inflar artificialmente las 6 nuevas con detalle inventado.

**Reclasificación específica de F21:** la ficha de F21 estaba clasificada como "MVP2 — fuera del sprint" en el backlog detallado bajo la política previa. Con la política nueva, F21 no cabe en MVP2 (no es razonable construirla "si hay holgura": complejidad Alta y la propia ficha declaraba "no cabe en el cronograma"). Pasa a "Trabajos Futuros", consistente con su clasificación original en el Sequencer del Inception (MVP3).

#### C. Corrección de conteos de features (INC-03)

El Sequencer original del Inception declaraba "26 features MVP1" en su título (línea 233), pero la suma de los Bloques A-F enumerados era 4+9+6+3+4+3 = **29**. Es un error aritmético histórico del Inception.

**Conteo correcto consolidado tras DHU-012:**

| Categoría | Conteo | Detalle |
|---|---|---|
| MVP1 (con ficha) | **29** | 17 críticas ★ + 12 importantes ◆ |
| MVP2 (con ficha) | **5** | F11, F15, F16, F19, F28 |
| Trabajos Futuros (con ficha) | **7** | F21, F36, F37, F38, F39, F40, F41 |
| **Total features con ficha** | **41** | F01-F20 + F22-F41 (numeración con hueco en F21 inexistente: F21 sí está) |

**Nota sobre el conteo total:** el Brainstorming original tuvo 35 features (F01-F35). DHU-012 agrega 6 fichas livianas (F36-F41) para formalizar las direcciones de Trabajos Futuros que originalmente vivían como prosa en el Sequencer y en `EVOLUCION_TESIS.md`. Total post-DHU-012: **41 features con ficha**.

#### D. Composición del Bloque D y corrección de transcripción (INC-02)

Los cierres de los Bloques B y C declaraban en sus "Próximos pasos" que el Bloque D contendría las features **(F17, F20, F21)**, omitiendo F18. Esto era un error de transcripción no documentado como decisión formal. El Sequencer del Inception (artefacto formal aprobado) y la ficha de F18 declaran F18 = MVP1 — Bloque D.

**Decisión formalizada:** El Bloque D MVP1 contiene **F17 + F18 + F20**. F21 no es MVP1 (es Trabajos Futuros tras esta decisión). La omisión de F18 en los cierres B y C se corrige sin debate adicional.

#### E. Alineación de vocabulario de niveles de fallback (INC-06)

El modelo arquitectónico de degradación evolucionó entre el Inception (3 niveles, vocabulario técnico) y el cierre del Bloque C (3 niveles + falla total, vocabulario agnóstico por DHU-006). Los documentos previos al cierre del Bloque C quedaron con el vocabulario viejo.

**Acciones consolidadas:**

1. **Journey 4 del Inception** reescrito con 4 estados (Degradado nivel 1, 2, 3 + Falla total) y vocabulario agnóstico. Nota explicativa cita DHU-006 y DHU-008.
2. **Ficha F26 del backlog** reescrita eliminando la duplicación del listado de niveles. Referencia a TTH-04 (CT-04.2) como fuente canónica del modelo de fallback.

#### F. Renombrado de "modo seguro" a "degradado nivel 3" (INC-06)

El estado originalmente denominado "modo seguro" se renombra uniformemente a **"degradado nivel 3"** para cohesionar el vocabulario de niveles. El identificador interno técnico `safe_3` se renombra a `degraded_3`.

**Estructura final de estados operativos del sistema:**

| Estado | Identificador interno | Color visual | Descripción |
|---|---|---|---|
| Operación normal | `normal` | (sin banner) | Todos los componentes operativos |
| Degradado nivel 1 | `degraded_1` | Amarillo | Componente periférico de detección de tráfico no responde |
| Degradado nivel 2 | `degraded_2` | Naranja | Componente predictivo principal no responde; predictor de respaldo activo |
| Degradado nivel 3 | `degraded_3` | Rojo | Motor adaptativo no responde; tiempos preconfigurados aplicados |
| Falla total | `total_failure` | Rojo intenso | Sin fallback aplicable; sistema no aplica decisiones nuevas |

**Acciones:** la palabra "modo seguro" se reemplaza en `DECISIONS_HU.md` (DHU-008, DHU-010), `FEATURE_BACKLOG_DETALLADO.md` (ficha F27, ficha F26), `HU_BLOQUE_C.md` (HU-10, HU-11, HU-12, CAs y notas), y `TAREAS_TECNICAS_HABILITADORAS.md` (título de TTH-05, descripción de TTH-04, identificador `safe_3`).

**Vocabulario funcional que se mantiene:** expresiones como "valores por defecto seguros", "tiempos conservadores", "configuración inicial segura" se mantienen intactas: son vocabulario funcional, no nombres del estado.

#### G. Limpieza de residuo del régimen previo al Inception (INC-07, INC-08)

`DECISIONS.md` (decisiones D-001 a D-008, fechadas antes o durante el Inception) y otros documentos contenían referencias a artefactos del régimen de planificación previo al Inception, que ya no existen en el régimen vigente. Estos residuos generan confusión y rompen la trazabilidad.

**Referencias eliminadas:**

- `PLAN.md` y sus "Fase 1/2/3/N" (numeración del plan obsoleto).
- "Bloque J/K/F del TODO" o del PLAN. NO confundir con "Bloques A-F" del Sequencer del Inception, que son legítimos y se preservan.
- `TODO.md` y "F3 del TODO", "Bloque F del TODO", etc.
- "Llamada A2 del TODO" → reformulada como "Pendiente: confirmar con asesor" sin ID.
- "HU-16" y "HU-17" (numeración de hitos pre-Inception) → reescritas refiriéndose a las features del backlog actual.
- `tesis/(2).docx` → eliminada (era copia temporal del documento de tesis; el documento final no se ha cerrado).

**Referencias actualizadas:**

- "D-001 a D-008" → "D-001 a D-009" en los listados de "Documentos relacionados" de `LEAN_INCEPTION_CEREBROVIAL.md` y `FEATURE_BACKLOG_DETALLADO.md`.

**Preservación:**

- Contenido sustantivo de todas las decisiones D-001 a D-009 se mantiene intacto. Solo se limpia la prosa que referenciaba artefactos obsoletos.
- Fechas históricas de cada decisión se preservan.
- "Fase 1/2/3/4" en `EVOLUCION_TESIS.md` se mantiene cuando describe fases conceptuales de la evolución del proyecto (narrativa), no del PLAN obsoleto.

#### H. Higiene de documentos de fundamentación (INC-09, INC-10)

- **`LEAN_INCEPTION_INVESTIGACION.md`** sección 9 ("Próximo paso inmediato") eliminada por obsoleta. Documento sube a versión 1.1.
- **`LEAN_INCEPTION_CEREBROVIAL.md`** pasa a versión 1.1 (de "1.0, lista para Showcase"). Cabecera distingue "fecha del workshop original" (2026-05-11) de "fecha de última actualización" (2026-05-14). Se agrega nota al pie con los cambios desde v1.0, citando esta decisión DHU-012.
- **`EVOLUCION_TESIS.md`** sección 8 reescrita como tabla referencial que apunta a las fichas de Trabajos Futuros en el backlog detallado, en lugar de prosa larga.

### Documentos afectados por DHU-012

Esta decisión genera modificaciones en los siguientes 9 documentos del proyecto:

| Documento | Tipo de cambio |
|---|---|
| `DECISIONS_HU.md` (este documento) | Agregar DHU-012 (esta decisión) y DHU-013 (clasificación HU/TTH del Bloque D); nota en DHU-008; renombrado de vocabulario en DHU-008, DHU-009 y DHU-010. |
| `DECISIONS.md` | Limpieza completa de residuo del régimen pre-Inception; contenido sustantivo preservado. |
| `LEAN_INCEPTION_CEREBROVIAL.md` | Renombrado MVP3 → Trabajos Futuros; conteo MVP1 = 29; Journey 4 reescrito; limpieza de residuo PLAN; versión 1.1 con nota de cambios. Nota agregada en pase de higiene cruzada: aclaración sobre la convención del conteo del Bloque B (9 MVP1 vs 10 con F11 MVP2). |
| `LEAN_INCEPTION_INVESTIGACION.md` | Sección 9 eliminada; versión 1.1. Nota agregada en pase de higiene cruzada: renombrado de "MVP3 (trabajo futuro)" → "Trabajos Futuros" en la fila 9 de la tabla del plan de ejecución de la sección 5 (la referencia residual al término MVP3 en la versión adaptada a CerebroVial). Las referencias a "MVP3" en las secciones 3 y 4.3 del documento describen el método genérico de Caroli y se preservan intactas. |
| `EVOLUCION_TESIS.md` | Sección 8 reescrita como tabla referencial; limpieza de residuo PLAN. |
| `FEATURE_BACKLOG_DETALLADO.md` | Agregar fichas F36-F41; reclasificar F21 como Trabajos Futuros; recalcular tablas; renombrado vocabulario; limpieza de residuo PLAN; referencia ficha F26 a TTH-04; conteo D-001 a D-009. |
| `HU_BLOQUE_A.md` | **Agregado retroactivamente el 2026-05-14 (pase de higiene cruzada con los demás documentos del backlog).** Cambios v3 → v4: (a) rango de DHU referenciado en "Documentos relacionados" actualizado de DHU-001 a DHU-007 → DHU-001 a DHU-013; (b) corrección del residuo de copy-paste en "Próximos pasos" (la frase "Esta sesión cerró el Bloque B" se reemplaza por una redacción coherente con que el documento es del Bloque A, y se actualiza el listado de bloques pendientes para reflejar que Bloque B y Bloque C también están cerrados); (c) corrección de typo "inglogan" → "ingloban" en la sección "Persistencias movidas a otros bloques"; (d) referencia a `HU_BLOQUE_C.md` agregada en "Documentos relacionados"; (e) ampliación de "TTH-01, TTH-02, TTH-03 transversales" para incluir TTH-04 y TTH-05 del Bloque C. El contenido sustantivo de HU-01 y de las reglas metodológicas se mantiene intacto. |
| `HU_BLOQUE_B.md` | Próximos pasos actualizados; nota técnica de HU-09 suavizada. Nota agregada en pase de higiene cruzada: corrección del conteo total de features en "Documentos relacionados" (35 → 41); aclaración sobre la convención de conteo del Bloque B (10 features con F11 MVP2 por afinidad temática vs 9 features MVP1 del Sequencer); referencia a `HU_BLOQUE_C.md` agregada en "Documentos relacionados"; ampliación de "TTH-01, TTH-02, TTH-03" para incluir TTH-04 y TTH-05. |
| `HU_BLOQUE_C.md` | Próximos pasos del Bloque D actualizados; renombrado de vocabulario en HU-10, HU-11, HU-12, CAs y notas. |
| `TAREAS_TECNICAS_HABILITADORAS.md` | Título de TTH-05 actualizado; renombrado de vocabulario en TTH-04 y TTH-05; identificador `safe_3` → `degraded_3`; nota de línea 262 cerrada por DHU-013; limpieza de residuo PLAN. |

**Nota sobre el alcance temporal de DHU-012:** la decisión se cerró el 2026-05-14. El pase original cubrió 8 documentos. Una revisión cruzada posterior detectó tres residuos no resueltos en `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md` y `LEAN_INCEPTION_INVESTIGACION.md` que se resolvieron en el mismo día como extensión natural del alcance de DHU-012 (no se abrió DHU separada porque los cambios son estrictamente de higiene documental y no involucran decisiones nuevas).

### Lo que NO cambia con DHU-012

- **Las decisiones DHU-001 a DHU-011 mantienen su contenido sustantivo.** Solo DHU-008 recibe una nota corta al inicio sobre el renombrado de vocabulario.
- **El alcance del producto (Personas, Objetivos, Journeys, Visión)** se mantiene intacto.
- **El contenido de las HUs redactadas (HU-01 a HU-12)** no se reabre; solo se ajustan referencias de vocabulario y notas de próximos pasos.
- **Las TTH redactadas (TTH-01 a TTH-05)** se mantienen en su contenido sustantivo; solo TTH-05 ajusta título y TTH-04/TTH-05 ajustan vocabulario.

### Trazabilidad de las 10 inconsistencias

Para referencia futura, las 10 inconsistencias del inventario auditado se resolvieron de la siguiente manera:

| Inconsistencia | Cobertura en DHU-012 |
|---|---|
| INC-01 — Clasificación de F21 | Subsección A (semántica MVP) + B (F21 = Trabajos Futuros) |
| INC-02 — F18 en el Bloque D | Subsección D |
| INC-03 — Conteo MVP1 26 vs 29 | Subsección C |
| INC-04 — Composición MVP3 | Subsección B |
| INC-05 — Composición del Bloque D | DHU-013 (decisión propia, ver más abajo) |
| INC-06 — Niveles de fallback | Subsecciones E + F |
| INC-07 — Residuo pre-Inception | Subsección G |
| INC-08 — Conteos D-001 a D-008 | Subsección G |
| INC-09 — Sección 9 obsoleta de INVESTIGACION | Subsección H |
| INC-10 — Versión y fecha del Inception | Subsección H |

INC-05 (composición del Bloque D y clasificación HU/TTH de F17, F18, F20) se documenta como **DHU-013** independiente porque pertenece al ciclo de redacción del Bloque D (paralela a DHU-008 + DHU-010 que cerraron lo mismo para el Bloque C).

---

## DHU-013 — Clasificación HU/TTH de las features del Bloque D

**Fecha:** 2026-05-14.
**Estado:** Cerrada.
**Aplica a:** Bloque D — Administrador, soporte técnico.

### Contexto

DHU-008 y DHU-010 cerraron la clasificación HU/TTH para el Bloque C. Esta decisión hace lo equivalente para el Bloque D, aplicando los criterios de DHU-004 a las tres features que componen el bloque tras el cierre de DHU-012 (INC-02 e INC-05).

**Composición del Bloque D MVP1 (cerrada por DHU-012 subsección D):** F17 (Panel de salud de componentes), F18 (Panel de métricas del modelo), F20 (Configuración del motor adaptativo).

### Análisis feature por feature

**F17 — Panel de salud de componentes del sistema (Administrador)**

| Criterio DHU-004 | F17 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | No. Administrador es Persona beneficiaria directa, paso 2 del Journey 3. |
| 2. Valor instrumental, no de negocio | No. Valor operativo claro: el Administrador necesita confirmar salud técnica del sistema. |
| 3. Comportamiento técnico estándar sin negociación | No. Qué métricas exponer, cómo presentar latencias/errores/logs, qué nivel de detalle, son decisiones de UX negociables con el Administrador. |
| 4. Sin valor visible al usuario en aislamiento | No. El Administrador la usa directamente. |

**Diagnóstico:** F17 cumple 0 de 4 criterios TTH. Es **HU operativa del Administrador**.

**Sustrato técnico:** ya existe vía CT-04.5 de TTH-04 (endpoint `GET /system/components/status`). No se crea TTH adicional. La HU del Administrador consume el mismo endpoint que HU-11 del Operador, con presentación distinta (técnica vs simplificada).

**F18 — Panel de métricas del modelo predictivo (Administrador)**

| Criterio DHU-004 | F18 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | No. Administrador es Persona beneficiaria directa, paso 3 del Journey 3, y necesidad declarada de la Persona ("Consultar métricas de desempeño del modelo predictivo"). |
| 2. Valor instrumental, no de negocio | No. Realiza el Objetivo 2 del producto desde la perspectiva del Administrador. |
| 3. Comportamiento técnico estándar | No. Qué métricas mostrar, qué ventana temporal, cómo visualizar evolución, son decisiones negociables. |
| 4. Sin valor visible al usuario en aislamiento | No. El Administrador la usa directamente. |

**Diagnóstico:** F18 cumple 0 de 4 criterios TTH. Es **HU operativa del Administrador**.

**Sustrato técnico:** el cálculo de métricas requiere (a) registrar las predicciones del modelo en el momento que se generan, (b) compararlas con observaciones reales una vez que el horizonte de predicción llega, (c) agregar métricas (MAE, RMSE) sobre ventana temporal configurable. Este sustrato se **ingloba como CAs dentro de la propia HU de F18**, siguiendo el patrón establecido para persistencias (F31 inglobada en HU-08 CA-08.1). No se crea TTH adicional.

**Justificación de la inglobación (no TTH separada):** TTH-04 y TTH-05 fueron justificadas como TTH porque ambas son lógica autónoma del sistema **consumida por múltiples HUs** (TTH-04 por HU-10, HU-11 y HU-12; TTH-05 por TTH-04). El sustrato de F18 es **consumido únicamente por la HU de F18 y por nadie más**. Esa diferencia favorece la inglobación, no la separación.

**F20 — Configuración de parámetros del motor adaptativo (Administrador)**

| Criterio DHU-004 | F20 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | No. Administrador es Persona beneficiaria directa, paso 5 del Journey 3. |
| 2. Valor instrumental, no de negocio | Discutible. Valor inmediato es "configurar sin redeploy"; valor de negocio último es calibración del sistema. |
| 3. Comportamiento técnico estándar | No. Qué parámetros exponer, qué rangos válidos, cómo validar, son decisiones negociables. |
| 4. Sin valor visible al usuario en aislamiento | No. El Administrador la usa directamente. |

**Diagnóstico:** F20 cumple 0 de 4 criterios TTH (criterio 2 discutible pero no decisivo). Es **HU operativa del Administrador**.

**Granularidad:** F20 se modela como **una sola HU** (no múltiples HUs por familia de parámetros). El Administrador trabaja con todos los parámetros en un mismo flujo (entra a la pantalla, ajusta, guarda); la organización por familias de parámetros se hace dentro de la HU con CAs estructurados. Patrón ya establecido: "una feature = una HU" salvo casos manifiestamente compuestos (como F02 cubierto por composición). F20 no es compuesta.

**Alcance:** la ficha original de F20 enumera "umbrales de cola, pesos entre estrategias, parámetros internos de Webster/MaxPressure/MTC". En la práctica, F20 cubre **más parámetros** según referencias cruzadas del backlog ya cerrado:

- Umbrales de cola verde/amarillo/rojo (CA-02.3 y nota de HU-02).
- Horizonte de predicción configurable (CA-03.1 y nota de HU-03).
- Umbral de congestión (CA-03.3 y nota de HU-03, default ≥ 3, atado a D-009 línea 244).

Estos parámetros son los que la HU debe cubrir en MVP1. Los parámetros internos de las estrategias (pesos entre Webster/MaxPressure/MTC) se evalúan caso a caso al redactar y pueden quedar fuera de MVP1 si exceden el alcance "3-5 parámetros críticos" sugerido por la propia ficha.

**Por DHU-006 (agnosticismo):** la HU de F20 NO menciona Webster/MaxPressure/MTC. Usa lenguaje funcional ("parámetros de las estrategias de control del motor" o equivalente).

### Reconsideración de TTH-05 a la luz de F20

La nota técnica de TTH-05 (al final de su entrada en `TAREAS_TECNICAS_HABILITADORAS.md`) dejaba abierta una pregunta:

> *"Si durante la redacción del Bloque D se considera que la configuración de degradado nivel 3 merece su propia HU del Administrador, esta TTH puede dividirse en (a) parte instrumental que sigue siendo TTH y (b) HU del Administrador para el formulario y la auditoría."*

DHU-013 cierra esta pregunta a favor de **mantener TTH-05 íntegra**, sin dividir. Razones:

1. **Cohesión de la HU de F20.** "Configuración del motor adaptativo" es un concepto coherente. Mezclarlo con "tiempos del degradado nivel 3" crea una HU heterogénea sin foco.

2. **Separación arquitectónica respetada.** TTH-04 maneja la lógica de fallback. TTH-05 provee los tiempos preconfigurados que TTH-04 consume en nivel 3. Ambas son lógica de backend; el formulario que las configura es incidental a su naturaleza.

3. **DHU-010 ya cerró F27 como TTH** con justificación específica. Reabrir esa decisión sin necesidad operativa concreta es agregar trabajo sin beneficio.

4. **La nota de TTH-05 dejó la puerta abierta, no obligaba a dividir.** Su redacción es *"puede dividirse"*, no *"se debe dividir"*. Esa puerta se cierra ahora con decisión expresa.

5. **Extensibilidad futura preservada.** Si en el futuro surge necesidad concreta (por ejemplo, el Administrador quiere ver auditoría de cambios de TTH-05 en una vista dedicada), siempre se puede extraer una HU adicional sin perder nada.

### Decisión

**Bloque D MVP1: 3 HUs operativas del Administrador + 0 TTH nuevas.**

| Feature | Modelado como | Sustrato técnico |
|---|---|---|
| F17 — Panel de salud de componentes | HU del Administrador | CT-04.5 de TTH-04 (existente, no se crea TTH adicional) |
| F18 — Panel de métricas del modelo | HU del Administrador | Sustrato (registro + cálculo de métricas) inglobado como CAs en la propia HU |
| F20 — Configuración del motor | HU del Administrador (única, agnóstica) | Sustrato (persistencia + auditoría) inglobado como CAs en la propia HU |

**TTH-05** se mantiene íntegra. La nota técnica de TTH-05 (su sección "Posible reconsideración futura") se actualiza para registrar el cierre de la pregunta.

### Consecuencias

- El Bloque D MVP1 se redacta con esta estructura: 3 HUs operativas. Numeración tentativa HU-13 (F17), HU-14 (F18), HU-15 (F20), sujeta a decisión menor al redactar (compactación vs numeración con hueco).
- F19 (Comparativa de métricas del modelo vs baseline) es MVP2 del Administrador, redactada en sesión MVP2 dedicada futura (no en el Bloque D).
- F21 (Reentrenamiento del modelo) es Trabajos Futuros (DHU-012), no se redacta como HU.
- TTH-05 mantiene título actualizado por DHU-012 ("Configuración de tiempos preconfigurados para degradado nivel 3"). Su nota técnica registra el cierre de la pregunta abierta sobre división.

### Documentos relacionados

- `HU_BLOQUE_D.md` — pendiente de redacción tras esta decisión.
- `TAREAS_TECNICAS_HABILITADORAS.md` — nota técnica de TTH-05 actualizada por DHU-013.
- `DECISIONS_HU.md` (este documento) — sección DHU-013.

---

## DHU-014 — Decisiones de redacción del Bloque D (numeración, dashboard, parámetros, métricas, concurrencia, ventana temporal, TTH-06)

**Fecha:** 2026-05-14.
**Estado:** Cerrada.
**Aplica a:** Bloque D — Administrador, soporte técnico.

### Contexto

DHU-013 cerró la clasificación HU/TTH de las features del Bloque D (F17, F18, F20 son HUs operativas; sin TTH nuevas) y la decisión sobre TTH-05 (no se divide). Quedaron pendientes varias decisiones menores de redacción que debían cerrarse antes o durante la redacción de las HUs concretas del bloque. DHU-014 consolida esas decisiones en un acto único, evitando la dispersión que hubiera resultado de cerrarlas por separado.

### Decisiones consolidadas

#### A. Numeración del Bloque D

La HU-13 original del Bloque C fue eliminada por DHU-011 antes de ser redactada formalmente. El número HU-13 no quedó "ocupado" en ningún documento vigente del backlog.

**Decisión:** el Bloque D reutiliza el número HU-13 para F17 (compactación de la numeración del Product Backlog), con HU-14 = F18 y HU-15 = F20. La traza histórica de la HU-13 eliminada vive en DHU-011, no en la numeración del backlog. Dejar un hueco en la numeración para preservar memoria es contaminar el backlog con metadata que pertenece a otro documento.

**Numeración final del Bloque D:**

| HU | Feature origen |
|---|---|
| HU-13 | F17 — Panel de salud de componentes del sistema (vista del Administrador) |
| HU-14 | F18 — Panel de métricas del modelo predictivo |
| HU-15 | F20 — Configuración de parámetros operativos del sistema |

#### B. Sin HU dedicada de dashboard del Administrador

**Decisión:** el Bloque D **no** introduce una HU equivalente a F02 del Bloque B (dashboard principal del Operador). Las tres HUs del Administrador (HU-13, HU-14, HU-15) se acceden desde la navegación del Administrador como tres vistas separadas, sin componerlas visualmente en un dashboard integrador.

**Justificación:** el Operador trabaja en tiempo real sobre un único objeto (la intersección), lo cual justifica un dashboard que muestre distintas caras del mismo objeto simultáneamente (F02 cubierto por composición de HU-02 a HU-06). El Administrador trabaja sobre objetos distintos en momentos distintos (consulta de componentes, análisis de métricas, ajuste de configuración); integrarlos visualmente no aporta valor cognitivo y agregaría una HU sin propósito claro.

Esta decisión queda registrada como decisión documental del Bloque D (DHU-014) y como nota técnica de cada HU del Bloque D. No requiere DHU separada por ser de UX/IA y no introducir regla metodológica nueva.

#### C. Selección concreta de parámetros de F20 en MVP1

**Decisión:** HU-15 (F20) cubre en MVP1 los siguientes parámetros, organizados en tres familias funcionales:

| Familia | Parámetros | Referencias cruzadas |
|---|---|---|
| Visualización del estado del tráfico | Umbrales de cola verde/amarillo/rojo | CA-02.3 de HU-02 |
| Predicción y evaluación del modelo | Horizonte de predicción | CA-03.1 de HU-03 |
| Predicción y evaluación del modelo | Umbral de congestión (default ≥ 3) | CA-03.3 de HU-03 + D-009 |
| Predicción y evaluación del modelo | Ventana temporal de cálculo de métricas | CA-14.4 de HU-14 (ver subsección F) |
| Monitor de salud del sistema | Frecuencia de evaluación de salud de componentes | CT-04.1 de TTH-04 |

**Fuera de MVP1 (parámetros internos del motor):** los parámetros internos de las estrategias de control del motor adaptativo (parámetros que afectan cómo cada estrategia decide los tiempos del semáforo) quedan **internos al sistema en MVP1**. Su exposición al Administrador requeriría conocimiento profundo de ingeniería de tráfico que excede el perfil de la Persona declarada y agregaría riesgo operativo sin valor proporcional. Su inclusión es trabajo futuro condicionado a (a) necesidad concreta de calibración fina, y (b) un Administrador con perfil técnico apropiado.

#### D. Métricas exactas en HU-14

**Decisión:** HU-14 (F18) cubre en MVP1 cuatro métricas de evaluación del modelo predictivo:

1. **MAE (Error Absoluto Medio)** sobre el ratio continuo.
2. **RMSE (Raíz del Error Cuadrático Medio)** sobre el ratio continuo.
3. **Accuracy (Exactitud)** sobre el nivel discreto 0-5.
4. **Matriz de confusión 6×6** del nivel discreto.

Cada una con **ícono de ayuda activable** que despliega una explicación breve de cómo interpretar la métrica.

**Convención de la matriz:** filas = nivel real observado, columnas = nivel predicho por el modelo (convención académica estándar, equivalente a la del módulo de métricas de scikit-learn). Declarada explícitamente en CA-14.8 y en el tooltip de la matriz.

**Presentación de la matriz:** valores absolutos (conteos) con totales de fila y columna, y un control toggle visible que permite alternar a porcentajes por fila para neutralizar el desbalance natural de clases. La diagonal principal (aciertos) es identificable visualmente respecto a las celdas fuera de la diagonal (errores).

**Justificación de incluir la matriz pese a su densidad visual:** la matriz aporta información que las tres métricas escalares no capturan (perfil de errores por nivel, no solo magnitud agregada), su costo de implementación es bajo, y los tooltips integrados mitigan la barrera cognitiva sin contaminar la vista con texto permanente.

#### E. Concurrencia entre Administradores en HU-15

**Decisión:** la concurrencia entre Administradores en la modificación de parámetros de HU-15 se resuelve con **last-write-wins con advertencia explícita al segundo Administrador** (mecanismo de control de concurrencia optimista con marca de versión).

Comportamiento detallado en CA-15.11: la primera modificación en guardarse se persiste normalmente; cuando el segundo Administrador intenta guardar, el sistema detecta que la configuración cambió desde su lectura inicial, le muestra una advertencia con detalles de la modificación intermedia (autor, timestamp, parámetros), y le ofrece confirmar la sobrescritura o cancelar y recargar para reevaluar. El registro de auditoría preserva ambas modificaciones, no solo la última.

**Justificación:** patrón estándar, bajo costo de implementación, suficiente para el escenario MVP1 donde la concurrencia será rara. Cumple el principio inegociable de no perder modificaciones silenciosamente.

#### F. Ventana temporal de cálculo de métricas de HU-14 inglobada en HU-15

**Contexto:** HU-14 (F18) declara una ventana temporal sobre la cual se calculan las métricas del modelo (CA-14.4, default sugerido 24 h). La nota técnica de HU-14 dejaba abierta la cuestión de si esta ventana se ajusta solo por configuración interna o se expone al Administrador.

**Decisión:** la ventana temporal se incluye como un parámetro configurable en HU-15, dentro de la familia "Predicción y evaluación del modelo".

**Justificación:** si el Administrador es responsable de evaluar el modelo (HU-14) y de configurar el sistema (HU-15), no tiene sentido que un parámetro central de la evaluación sea ajustable solo por variable de entorno. El costo marginal de agregar un parámetro más a HU-15 es bajo y cierra un cabo suelto sin abrir nuevos.

#### G. Creación de TTH-06 — Capa de DTOs transversal al backend

**Contexto:** durante la discusión sobre el patrón de consumo del endpoint compartido CT-04.5 por HU-11 (Operador) y HU-13 (Administrador), se evaluaron tres patrones posibles para manejar la diferencia de campos visibles: (1) un endpoint y un DTO completo, frontend filtra; (2) un endpoint con dos DTOs vía query parameter; (3) dos endpoints separados con dos DTOs.

**Decisión sobre el patrón de consumo concreto (CT-04.5):** patrón (1), un endpoint y los campos completos del DTO, frontend filtra según la vista. Los campos técnicos adicionales no son sensibles (son métricas operativas del propio sistema, no datos personales ni credenciales), por lo cual no se justifica un endpoint separado ni filtrado en backend según el rol del token; el RBAC a nivel de ruta es suficiente.

**Decisión transversal (TTH-06):** la cuestión más amplia de "introducir una capa explícita de DTOs en el backend o no" es una decisión transversal de arquitectura, no de HU-13. Se formaliza como **TTH-06 — Capa de DTOs transversal al backend**, clasificada como **Trabajos Futuros** (no se construye dentro del alcance del proyecto académico).

**Justificación de Trabajos Futuros y no MVP2:** TTH-06 no realiza ningún Objetivo del Producto; es higiene técnica de mantenibilidad. El alcance es transversal a todo el backend (no a un endpoint), lo cual hace difícil acotar el costo "si hay holgura". Naturalmente pertenece a la productivización del sistema, fuera del alcance académico. El sistema sin TTH-06 sigue siendo defendible académicamente.

#### H. Ampliación de CT-04.5 dentro de TTH-04

**Contexto:** el contrato original de CT-04.5 cubría nombre legible, estado cualitativo, timestamp del último cambio e identificador interno. HU-13 requiere campos adicionales no cubiertos: latencia de la última evaluación de salud, indicador de fallos recientes, timestamp de la última evaluación de salud exitosa.

**Decisión:** el contrato de CT-04.5 se amplía dentro de TTH-04 para cubrir los 7 campos requeridos por HU-13. HU-11 continúa consumiendo solo los campos básicos (1 a 3) e ignora los adicionales sin contradecir su contrato previo.

**No es TTH nueva ni decisión metodológica:** es refinamiento del contrato del endpoint existente. La modificación se documenta como ampliación de CT-04.5 dentro de TTH-04 y se cierra al cerrar el Bloque D.

### Documentos afectados por DHU-014

| Documento | Tipo de cambio |
|---|---|
| `HU_BLOQUE_D.md` (nuevo) | Documento nuevo con HU-13, HU-14, HU-15 redactadas. |
| `TAREAS_TECNICAS_HABILITADORAS.md` | Ampliación de CT-04.5 dentro de TTH-04 (subsección H); agregar TTH-06 (subsección G); actualización del índice y de la tabla de trazabilidad de TTH-04. |
| `DECISIONS_HU.md` (este documento) | Agregar DHU-014; actualizar índice, tabla de impacto en bloques y documentos relacionados. |
| `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md`, `HU_BLOQUE_C.md` | Próximos pasos actualizados: Bloque D ya cerrado; restan Bloques E, F y MVP2. |
| `FEATURE_BACKLOG_DETALLADO.md` | Fichas de F17, F18 y F20 actualizan su columna "Modelado" para apuntar a HU-13, HU-14 y HU-15 respectivamente (estaban como "a redactar en el Bloque D"). |
| `LEAN_INCEPTION_CEREBROVIAL.md` | Documentos relacionados actualizado (referencia a `HU_BLOQUE_D.md`). |

### Lo que NO cambia con DHU-014

- **Las decisiones DHU-001 a DHU-013 mantienen su contenido sustantivo.** DHU-014 las cita pero no las reabre.
- **El alcance del producto** (Personas, Objetivos, Journeys, Visión) se mantiene intacto.
- **Las HUs del MVP1 redactadas en bloques previos** (HU-01 a HU-12) no se reabren; sus referencias a parámetros configurables (CA-02.3, CA-03.1, CA-03.3) ya apuntan al sistema de configuración que HU-15 ahora formaliza.
- **Las TTH previas (TTH-01 a TTH-05)** mantienen su contenido. TTH-04 recibe una ampliación de CT-04.5 (no contradice el contrato previo, solo lo extiende).

### Documentos relacionados

- `HU_BLOQUE_D.md` — Bloque D del Product Backlog.
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-04 ampliada y TTH-06 nueva.
- `DECISIONS_HU.md` (este documento) — sección DHU-014.

---

## DHU-015 — Clasificación HU/TTH de las features del Bloque E (con ampliación 4 → 5 TTH durante la redacción)

**Fecha:** 2026-05-15.
**Estado:** Cerrada.
**Aplica a:** Bloque E — Componentes centrales del sistema.

### Contexto

DHU-010 y DHU-013 cerraron la clasificación HU/TTH para los Bloques C y D respectivamente, aplicando los criterios de DHU-004 a las features de cada bloque. Esta decisión hace lo equivalente para el Bloque E, aplicando los mismos criterios a las cuatro features que lo componen según el Sequencer del Inception. Durante la redacción del bloque, al cerrar las decisiones arquitectónicas del modelo predictivo (TTH-09), se identificó la necesidad de una quinta TTH (TTH-11, spike de investigación de hiperparámetros temporales del modelo predictivo) que se incorporó como ampliación de esta decisión.

**Composición del Bloque E MVP1 (Sequencer del Inception, sin cambios desde el cierre del workshop original):**

- **F32** — Integración con SUMO para simulación del entorno.
- **F33** — Módulo de visión que produce métricas de estado.
- **F34** — Módulo predictivo GRU servido vía API.
- **F35** — Motor adaptativo (Webster + MaxPressure + MTC).

Las cuatro features están clasificadas como MVP1 y declaradas explícitamente con `Persona: SYS` en sus fichas (`FEATURE_BACKLOG_DETALLADO.md`), es decir, infraestructura/componentes del sistema sin Persona del producto beneficiaria directa.

### Análisis feature por feature

#### F32 — Integración con SUMO para simulación del entorno

| Criterio DHU-004 | F32 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | Sí. La ficha F32 declara `Persona: SYS` y la Revisión UX dice "no aplica (no expuesto al usuario directamente)". SUMO es infraestructura de validación cuantitativa y fuente del dataset de entrenamiento (D-008), no funcionalidad operativa visible. |
| 2. Valor instrumental, no de negocio | Sí. SUMO habilita el Objetivo 4 (demostrar mejora cuantificable) y habilita F34 (generación de dataset), pero no genera valor visible al Operador, Gerente ni Administrador en aislamiento. |
| 3. Comportamiento técnico estándar sin negociación de negocio | Sí. Cargar topología, generar escenarios de demanda, ejecutar simulación vía TraCI: son tareas técnicas sin negociación funcional con ninguna Persona. |
| 4. Sin valor visible al usuario en aislamiento | Sí. Ninguna Persona interactúa con SUMO. Su salida alimenta otras TTH (F34 dataset, validación del motor) y al capítulo de validación de la tesis. |

**Diagnóstico:** F32 cumple 4 de 4 criterios. Es **TTH (TTH-07)**.

#### F33 — Módulo de visión que produce métricas de estado

| Criterio DHU-004 | F33 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | Sí. Ficha F33 declara `Persona: SYS`. El Operador consume **derivadas funcionales** (flujo, cola observados) vía HU-02, pero HU-02 es agnóstica a la fuente (DHU-006); en MVP1 esa fuente es SUMO (D-007 + D-008), no visión. Visión es sensor en operación hipotética, no en el loop de validación cuantitativa (D-007). |
| 2. Valor instrumental, no de negocio | Sí. Habilita el Objetivo 1 en operación hipotética, pero su validación es independiente (métricas de detección sobre dataset etiquetado), no contribuye al loop de KPIs del sistema integrado. |
| 3. Comportamiento técnico estándar sin negociación de negocio | Sí. YOLO + tracking + exposición de métricas vía API son tareas técnicas estándar de visión computacional. Las decisiones de qué métricas exponer derivan de las HUs ya cerradas (HU-02, agnósticamente), no de una negociación abierta con la Persona. |
| 4. Sin valor visible al usuario en aislamiento | Sí. El Operador nunca interactúa con el módulo de visión directamente; consume sus derivadas funcionales cuando el sistema decide alimentarse de visión en operación. En MVP1 esas derivadas vienen de SUMO. |

**Diagnóstico:** F33 cumple 4 de 4 criterios. Es **TTH (TTH-08)**.

**Nota sobre el rol demostrativo:** F33 se modela como TTH porque HU-02 ya entrega el valor al Operador y HU-02 es agnóstica a la fuente. F33 es el sustrato técnico que en operación hipotética podría alimentar a HU-02. La separación arquitectónica de D-007 (visión demostrable, no en loop de validación cuantitativa) refuerza esta clasificación: la validación cuantitativa del sistema integrado se hace por SUMO; la validación de F33 se hace independientemente con métricas de detección.

#### F34 — Módulo predictivo GRU servido vía API

| Criterio DHU-004 | F34 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | Sí. Ficha F34 declara `Persona: SYS`. El Operador consume predicciones vía HU-03 (agnóstica al modelo); el Administrador consume métricas vía HU-14 (también agnóstica al modelo, declara MAE/RMSE/accuracy/matriz de confusión sin nombrar GRU). HU-03 y HU-14 son las consumidoras; el modelo es el sustrato. |
| 2. Valor instrumental, no de negocio | Sí. Habilita el Objetivo 2 (anticipar congestión), pero el valor al Operador llega vía HU-03 y al Administrador vía HU-14. El modelo en aislamiento es solo un endpoint que escupe números. |
| 3. Comportamiento técnico estándar sin negociación de negocio | Sí. GRU univariado por intersección (D-006), entrenado sobre dataset SUMO (D-008), prediciendo ratio continuo discretizable a jam level 0-5 (D-009): las tres decisiones técnicas que definen el modelo están cerradas. No queda negociación funcional con una Persona. |
| 4. Sin valor visible al usuario en aislamiento | Sí. Una Persona consume las predicciones presentadas por HU-03 o las métricas presentadas por HU-14; no consume el endpoint `/predictions/predict` directamente. |

**Diagnóstico:** F34 cumple 4 de 4 criterios. Es **TTH (TTH-09)**.

#### F35 — Motor adaptativo

| Criterio DHU-004 | F35 cumple |
|---|---|
| 1. Sin Persona beneficiaria directa | Sí. Ficha F35 declara `Persona: SYS / componente central`. El Operador consume la estrategia activa vía HU-05, su explicación vía HU-06, sus notificaciones vía HU-07, el historial vía HU-08; el Administrador configura parámetros vía HU-15. El motor es el sustrato; cinco HUs operativas ya cubren la superficie visible al usuario. |
| 2. Valor instrumental, no de negocio | Discutible pero diagnóstico claro. El valor al usuario llega vía HU-05/06/07/08 y HU-15, ya redactadas. El motor en aislamiento es lógica de decisión que escupe estrategia activa + parámetros aplicados al semáforo. El valor de negocio (aporte de ingeniería central de la tesis, según `EVOLUCION_TESIS.md`) se mide en el capítulo de validación, no como funcionalidad operativa visible. |
| 3. Comportamiento técnico estándar sin negociación de negocio | Sí. Las dos estrategias adaptativas (Webster, Max Pressure) y la capa de reglas duras MTC están en el código construido; la selección entre estrategias es lógica determinista según estado predicho + observado. La negociación con la Persona ya ocurrió al redactar HU-05/06/07/08 (qué ve, cómo se explica) y HU-15 (qué parámetros expone). |
| 4. Sin valor visible al usuario en aislamiento | Sí. El motor sin las HUs del Operador es un componente que toma decisiones invisibles. |

**Diagnóstico:** F35 cumple 4 de 4 criterios. Es **TTH (TTH-10)**.

**Nota sobre la arquitectura real del motor:** Durante la redacción de TTH-10 se clarificó la arquitectura real del motor según `motor_adaptativo_teoria.md`: el motor es una **pipeline de dos etapas** (selección entre Webster y Max Pressure como estrategias adaptativas; aplicación de MTC como capa de reglas duras post-procesamiento), no un selector tripartita entre tres estrategias. Esta clarificación implica ajustes de coherencia documental en `EVOLUCION_TESIS.md` Fase 3 y, residualmente, en la descripción de F35 en `FEATURE_BACKLOG_DETALLADO.md`. No reabre decisiones técnicas previas; refina la descripción para coherencia con el código y el documento teórico.

**Nota sobre el aporte central:** Que F35 sea el aporte de ingeniería principal del trabajo no implica que deba modelarse como HU. La importancia académica de una pieza no determina su clasificación HU/TTH; la determina la presencia o ausencia de Persona del producto beneficiaria directa (DHU-004). El aporte central se documenta en el capítulo de validación de la tesis y en el video de demo, no en una HU operativa.

### Ampliación durante la redacción: TTH-11 (spike de hiperparámetros temporales)

Durante la redacción de TTH-09 se cerraron las decisiones arquitectónicas del modelo predictivo:

- Arquitectura multi-output (un GRU univariado por dirección, cada uno produce un vector de predicciones a múltiples horizontes en una sola inferencia).
- Cuatro modelos GRU univariados (uno por dirección de entrada de la intersección genérica de cuatro accesos).
- Endpoint devuelve ambos: ratio continuo + nivel discreto 0-5 derivado en backend.

Estas decisiones no atan los **hiperparámetros temporales** del modelo: paso de muestreo (Δt_in), ventana de entrada (lookback), horizonte de predicción, frecuencia de re-inferencia del endpoint. Los cuatro son hiperparámetros acoplados (cambiar uno afecta la interpretación de los otros) y merecen sustentación bibliográfica explícita para defensa académica.

**Decisión durante la redacción:** abrir **TTH-11** como spike de investigación con entregable documental, prerrequisito documental de TTH-09. El documento entregable se ubicará en `documentation/docs/` (sugerencia de nombre: `INVESTIGACION_HIPERPARAMETROS_TEMPORALES.md`). TTH-11 es **TTH**, no HU, conforme a DHU-004 (no tiene Persona beneficiaria directa; su valor es instrumental para reducir incertidumbre técnica). TTH-11 puede cerrar con su parte bibliográfica completa aun si TTH-07 sufre retrasos; la parte empírica se agrega como complemento del documento cuando TTH-07 esté disponible.

**Consecuencia formal:** DHU-015 se amplía de **4 TTH (TTH-07 a TTH-10) a 5 TTH (TTH-07 a TTH-11)**. El orden de redacción ajustado por dependencias técnicas es: TTH-07 → TTH-11 → TTH-09 → TTH-10 → TTH-08.

### Decisión final

**Bloque E MVP1: 0 HUs operativas + 5 TTH nuevas.**

| Feature | Modelado como | Identificador |
|---|---|---|
| F32 — Integración con SUMO | TTH | **TTH-07** |
| F33 — Módulo de visión | TTH | **TTH-08** |
| F34 — Módulo predictivo GRU | TTH | **TTH-09** |
| F35 — Motor adaptativo | TTH | **TTH-10** |
| (Derivada de TTH-09, sin feature asociada) | TTH | **TTH-11** |

### Granularidad: una TTH por componente, no agrupación

Cada feature del Bloque E se modela como TTH independiente, no como TTH compuesta ni agrupada. Justificación:

1. **Ciclos de implementación distintos.** F32 (SUMO) parte de cero con curva de aprendizaje real (ficha F32: "🆕 Por construir desde cero"); F33 (visión) se reconstruye desde cero como parte del refactor; F34 (GRU) parte de cero pero con RandomForest baseline preservado; F35 (motor) está significativamente construido. Agruparlas oscurece el plan de trabajo y dificulta el reporte de avance.

2. **Dependencias asimétricas.** F32 es prerrequisito de F34 (dataset de entrenamiento, D-008) y entrega los escenarios de validación que consumen F34 y F35. F33 es independiente del eje crítico. Una TTH compuesta no podría declarar correctamente estas dependencias internas.

3. **Validaciones independientes.** F32 (funcional, fidelidad de topología y simulación end-to-end), F33 (métricas de detección sobre dataset etiquetado independiente, D-007), F34 (MAE/RMSE/accuracy sobre escenarios SUMO no vistos, D-008), F35 (funcional con integraciones, validación cuantitativa en capítulo de tesis): cuatro criterios de Done independientes con instrumentación distinta.

4. **Precedente del backlog.** TTH-04 y TTH-05 del Bloque C son TTH separadas a pesar de que TTH-05 alimenta a TTH-04 internamente. El patrón "una TTH por componente con dependencia declarada en la sección de trazabilidad" ya está establecido.

### Orden de redacción aplicado

Por dependencias técnicas, con TTH-11 incorporada:

1. **TTH-07 (SUMO).** Prerrequisito de TTH-09 (dataset) y de la validación que TTH-10 consume.
2. **TTH-11 (Spike de hiperparámetros temporales).** Prerrequisito documental de TTH-09.
3. **TTH-09 (GRU).** Consume dataset de TTH-07 y sustentación de TTH-11.
4. **TTH-10 (Motor adaptativo).** Consume predicciones de TTH-09 y estado observado de TTH-07 en validación.
5. **TTH-08 (Visión).** Independiente del eje crítico; redactada al final por dependencia menor en MVP1.

### Validación de cada TTH

| TTH | Tipo de validación | Detalle |
|---|---|---|
| TTH-07 | Funcional | Topología cargada + simulación end-to-end vía TraCI + dataset generado + integración con motor adaptativo demostrable end-to-end. |
| TTH-08 | Independiente, métricas de detección | Precisión, recall, mAP sobre dataset etiquetado propio ≥200 frames. Objetivo aspiracional accuracy ≥ 80%. NO entra al loop de validación cuantitativa del sistema integrado (D-007). |
| TTH-09 | Funcional + cuantitativo de modelo | Endpoint sirviendo predicciones + cuatro métricas de HU-14 (MAE, RMSE sobre ratio continuo; accuracy, matriz de confusión sobre nivel discreto 0-5). **Objetivo aspiracional accuracy ≥ 80% sobre el nivel discreto 0-5, no bloqueante.** Si la realidad medida es peor, se reporta conforme a D-005. |
| TTH-10 | Funcional | Las dos estrategias adaptativas operan correctamente, AdaptiveEngine selecciona según criterios, MTC aplica reglas duras documentadas, integración con TTH-09/TTH-07/TTH-04 funciona end-to-end. La validación cuantitativa del sistema (mejora vs control fijo) pertenece al capítulo de validación de la tesis, no al Done de TTH-10. |
| TTH-11 | Documental | Documento entregable en `documentation/docs/` con revisión bibliográfica (mínimo 5 fuentes), exploración empírica mínima (3 combinaciones), recomendación final consolidada. |

### Consecuencias

- El Bloque E se redacta con 5 TTH y 0 HUs operativas. Numeración TTH-07 a TTH-11.
- El documento `HU_BLOQUE_E.md` se crea para mantener el patrón de un documento por bloque; su contenido principal es: mapeo de features → TTH, justificación de la ausencia de HUs operativas, decisiones tomadas durante la redacción, y referencias cruzadas a las TTH agregadas en `TAREAS_TECNICAS_HABILITADORAS.md`.
- `TAREAS_TECNICAS_HABILITADORAS.md` se actualiza con TTH-07 a TTH-11.
- La numeración de HUs del backlog no avanza con el Bloque E: la última HU operativa cerrada es HU-15 del Bloque D; la próxima HU operativa será HU-16 en el Bloque F (Gerente) o en sesión MVP2 dedicada.
- No se reabre ninguna decisión cerrada de los Bloques A, B, C ni D. HU-02 a HU-15 mantienen su contenido intacto; sus referencias agnósticas a "fuente de medición", "componente predictivo", "componente decisor" se materializan correctamente en TTH-07 a TTH-10.

### Lo que NO cambia con DHU-015

- **Las decisiones DHU-001 a DHU-014 mantienen su contenido sustantivo.** DHU-015 las aplica al Bloque E sin reabrirlas.
- **Las HUs ya redactadas (HU-01 a HU-15)** mantienen su contenido. Sus referencias a fuentes, componentes y modelos agnósticos se materializan en las TTH del Bloque E sin necesidad de modificar las HUs.
- **Las TTH previas (TTH-01 a TTH-06)** mantienen su contenido. TTH-04 (lógica de fallback) recibe referencias cruzadas adicionales desde TTH-09 (Nivel 2: predictor de respaldo es el RandomForest preservado por TTH-09) y TTH-10 (Nivel 3 y falla total invocan TTH-05 cuando TTH-10 cae), pero su contenido sustantivo no se reabre.

### Documentos afectados por DHU-015

| Documento | Tipo de cambio |
|---|---|
| `HU_BLOQUE_E.md` (nuevo) | Documento nuevo con mapeo de features F32-F35 → TTH-07 a TTH-11 y justificación de 0 HUs operativas. |
| `TAREAS_TECNICAS_HABILITADORAS.md` | Agregar TTH-07, TTH-08, TTH-09, TTH-10, TTH-11; actualización del índice. Referencias cruzadas adicionales en TTH-04 desde TTH-09 (Nivel 2 invoca RandomForest preservado por TTH-09) y TTH-10 (Nivel 3 invoca TTH-05 cuando TTH-10 cae). |
| `DECISIONS_HU.md` (este documento) | Agregar DHU-015; actualizar índice, tabla de impacto en bloques y documentos relacionados. |
| `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md`, `HU_BLOQUE_C.md`, `HU_BLOQUE_D.md` | Próximos pasos actualizados: Bloque E ya cerrado; restan Bloque F y MVP2. |
| `FEATURE_BACKLOG_DETALLADO.md` | Fichas de F32, F33, F34 y F35 actualizan su columna "Modelado" para apuntar a TTH-07, TTH-08, TTH-09 y TTH-10 respectivamente (estaban como "A determinar al redactar el Bloque E"). Ajuste residual en la descripción de F35 para reflejar la arquitectura real del motor (2 estrategias + capa MTC). |
| `EVOLUCION_TESIS.md` | Fase 3 actualizada para reflejar la arquitectura real del motor (2 estrategias adaptativas + 1 capa de reglas duras), no "3 estrategias de control". Ajuste de coherencia documental. |
| `LEAN_INCEPTION_CEREBROVIAL.md` | Documentos relacionados actualizado (referencia a `HU_BLOQUE_E.md`). |

### Documentos relacionados

- `HU_BLOQUE_E.md` — Bloque E del Product Backlog (cierre de mapeo y decisiones).
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-07 a TTH-11 nuevas.
- `DECISIONS_HU.md` (este documento) — sección DHU-015.
- `DECISIONS.md` — D-006, D-007, D-008, D-009 fundamentan las decisiones técnicas internas de cada TTH del Bloque E.
- `EVOLUCION_TESIS.md` — Fase 4 (cierre arquitectónico) describe los cuatro componentes con roles separados.
- `motor_adaptativo_teoria.md` — Sustentación teórica del motor adaptativo (consumido por TTH-10).

---

## DHU-016 — Decisiones de redacción del Bloque F (numeración, F30 inglobada, fuente del histórico en MVP1, KPIs operacionales, granularidad, periodos, comparativa, concurrencia, dashboard integrador, robustez)

**Fecha:** 2026-05-16.
**Estado:** Cerrada.
**Aplica a:** Bloque F — Gerente, reportería mínima.

### Contexto

DHU-015 cerró el Bloque E con 5 TTH operativas (TTH-07 a TTH-11) y 0 HUs operativas, dejando como próximo bloque pendiente el Bloque F — Gerente, reportería mínima. Las tres features que el Sequencer del Inception asigna a este bloque son F12 (Dashboard ejecutivo con KPIs agregados), F13 (Selector de periodo) y F14 (Vista comparativa entre periodos). Adicionalmente, la regla cerrada en el Bloque A determina que F30 (Persistencia de estados históricos) se ingloba como Criterios de Aceptación dentro de las HUs del Gerente, sin redactarse como HU dedicada.

Antes de iniciar la redacción de las HUs concretas del Bloque F era necesario cerrar un conjunto de decisiones de detalle que la sola aplicación de DHU-001 a DHU-015 no determina por sí misma. DHU-016 consolida esas decisiones en un acto único, siguiendo el patrón establecido por DHU-014 (decisiones consolidadas de redacción del Bloque D).

A diferencia de DHU-013 y DHU-015, esta decisión no requiere una sub-decisión de clasificación HU/TTH formal sobre las tres features del Bloque F: las tres tienen al Gerente como Persona beneficiaria directa (Journey 2, pasos 2 a 4) y cumplen las cuatro condiciones de HU operativa (DHU-004). La discusión metodológica sobre HU vs TTH para este bloque se cierra implícitamente al confirmar que las tres son HUs operativas y que F30 se mantiene como persistencia inglobada según la regla del Bloque A.

### Decisiones consolidadas

#### A. Numeración del Bloque F

El Bloque D cerró en HU-15. El Bloque E no avanzó la numeración de HUs (0 HUs operativas, según DHU-015). La numeración del Bloque F continúa secuencial desde HU-16.

**Decisión:** la numeración del Bloque F comienza en HU-16 (compactación secuencial desde el cierre del Bloque D, conforme a DHU-014 subsección A que estableció el principio de "no dejar huecos en la numeración para preservar memoria de HUs no redactadas o eliminadas; la traza histórica vive en `DECISIONS_HU.md`, no en el backlog").

La numeración final del Bloque F queda determinada por la subsección I (fusión F12 + F13 en una sola HU):

| HU | Feature(s) origen |
|---|---|
| HU-16 | F12 (Dashboard ejecutivo) + F13 (Selector de periodo) fusionadas, con F30 inglobada como CAs |
| HU-17 | F14 (Vista comparativa entre periodos), con consumo del histórico declarado por HU-16 |

#### B. F30 inglobada como Criterios de Aceptación, no como TTH del Bloque F

La regla cerrada en el Bloque A estableció que F30 (Persistencia de estados históricos) se modela como persistencia inglobada en HUs del Gerente, no como HU dedicada. La pregunta abierta para DHU-016 era si el cumplimiento de esa regla podía mantenerse en la forma de inglobación como CAs (patrón equivalente al de F31 en CA-08.1 de HU-08), o si la complejidad técnica de la persistencia histórica justificaba escalarla a TTH separada del Bloque F.

**Decisión:** F30 se ingloba como Criterios de Aceptación dentro de HU-16, no se extrae como TTH separada del Bloque F.

**Justificación:**

1. **Patrón previo equivalente.** F31 (persistencia de decisiones del motor) está inglobada en CA-08.1 de HU-08 y declarada como tal en su nota técnica. El sustrato técnico de F18 (registro de predicciones y cálculo de métricas) está inglobado en CA-14.1 a CA-14.4 de HU-14, sin TTH separada, conforme a DHU-013. El sustrato técnico de F20 (persistencia y auditoría de parámetros) está inglobado en CA-15.1 a CA-15.4 y CA-15.8 de HU-15. F30 sigue el mismo patrón.

2. **Criterio de "consumidores múltiples" no aplica.** TTH-04 fue justificada como TTH separada porque su salida (estado operativo del sistema) es consumida por HU-10, HU-11, HU-12 y HU-13: una pieza de lógica autónoma consumida por múltiples HUs heterogéneas. El histórico de F30 es consumido exclusivamente por las HUs del Bloque F (HU-16 y HU-17), que son cohesivas y comparten propósito (reportería ejecutiva al Gerente). No hay justificación de extracción por reuso.

3. **Complejidad técnica no justifica TTH.** La persistencia histórica es una tabla append-only de baja complejidad arquitectónica según la ficha F30 (complejidad Medio), comparable a la complejidad de los registros ya inglobados en HUs (predicciones de CA-14.1, parámetros de CA-15.1, decisiones del motor de CA-08.1). El umbral para extraer TTH no es la complejidad técnica sino la presencia de consumidores múltiples heterogéneos.

#### C. Fuente del histórico de F30 en MVP1

La ficha de F30 declara que la persistencia almacena "flujo, cola, velocidad, densidad por intersección y dirección, con timestamp". El sistema ya posee otros registros similares cerrados durante el Bloque E:

| Registro existente | Qué persiste | Origen |
|---|---|---|
| TTH-08 CT-08.5 | Métricas de estado observado (conteo, cola, flujo, densidad por dirección con timestamp) | Salida del módulo de visión |
| TTH-07 CT-07.3 | Dataset tabular del entorno simulado (velocidad, vehículos, cola, ratio, jam level) con marcas de seed/patrón/timestamp simulado | Generación offline de SUMO |
| TTH-09 CT-09.5 | Predicciones del modelo (timestamp, dirección, paso futuro, ratio, nivel) | Modelo predictivo |
| HU-08 CA-08.1 + TTH-10 CT-10.9 | Decisiones del motor (estrategia, razón, tiempos aplicados) | Motor adaptativo |
| TTH-04 CT-04.3 | Transiciones de estado operativo del sistema | Monitor de salud |

El registro de TTH-08 se solapa parcialmente con lo que F30 necesita persistir. Sin embargo, en MVP1 el módulo de visión no está en el loop de validación cuantitativa (D-007), y la cámara no corre continuamente en operación real durante el desarrollo académico. El dataset de TTH-07 sí contiene datos comparables, pero es offline (se genera por corridas reproducibles del script de CT-07.3), está pensado para entrenar TTH-09, y mezcla múltiples patrones de demanda y seeds, lo cual no es semánticamente una "operación histórica" del sistema sobre una intersección viva.

Se evaluaron tres opciones para resolver de dónde salen los datos de F30 en MVP1:

| Opción | Descripción | Consecuencia |
|---|---|---|
| A | F30 es persistencia operacional separada y agnóstica a la fuente, alimentada por la fuente de estado vigente del sistema en cada momento | Coherente con DHU-006 (HUs agnósticas a fuente). Independencia explícita respecto a TTH-07/TTH-08. En MVP1 la fuente vigente son corridas de validación cuantitativa en SUMO; el demo al jurado consulta el histórico generado en esas corridas. No se nombra a SUMO en las HUs. |
| B | F30 reusa CT-08.5 (persistencia de visión) y el Bloque F consume directamente de ahí | Ata el Bloque F a la salida de visión, que en MVP1 está fuera del loop por D-007. En MVP1 no habría datos para reportar. |
| C | F30 reusa el dataset de TTH-07 | Rompe la semántica: el dataset es offline para entrenamiento, no operacional para reportería; mezcla múltiples patrones y seeds. |

**Decisión:** se adopta la Opción A.

**Detalle de la decisión:**

1. F30 vive como persistencia operacional independiente, declarada como CAs dentro de HU-16. Su esquema mínimo incluye: marca de tiempo, identificador de intersección, dirección, y las cuatro variables observadas (flujo, longitud de cola, velocidad media, densidad). La persistencia es append-only, durable, y no se borra automáticamente en MVP1.

2. En MVP1, la fuente operacional vigente que alimenta F30 son las corridas de validación cuantitativa del sistema integrado en el entorno simulado de la intersección. Las HUs del Bloque F no nombran esta fuente (DHU-006); las notas técnicas y `TAREAS_TECNICAS_HABILITADORAS.md` la documentan.

3. La independencia de F30 respecto a TTH-07/TTH-08/TTH-09/HU-08/TTH-04 se declara explícitamente como nota técnica en HU-16, siguiendo la fórmula que CT-09.5 usa para declarar la independencia de TTH-09 respecto a TTH-04 y HU-08.

4. La conexión técnica entre F30 y la fuente vigente (cómo el sistema escribe a la tabla de F30 cuando corre una simulación de validación) es responsabilidad de implementación. No requiere TTH nueva: el comportamiento se declara en CAs de HU-16 y la implementación se resuelve al construir.

5. En operación hipotética posterior al alcance académico, la fuente vigente sería la salida del módulo de visión (TTH-08). La transición es transparente para las HUs del Bloque F porque su contrato es agnóstico a la fuente.

#### D. Definiciones operacionales de los 4 KPIs

El MVP Canvas (Bloque 6) cerró los 4 KPIs técnicos del sistema integrado: tiempo promedio de espera por vehículo, longitud máxima de cola por dirección, throughput de la intersección, demora promedio acumulada en periodo de simulación. La ficha de F12 identifica como riesgo "definir los KPIs específicos y su cálculo". DHU-016 cierra las definiciones operacionales para que HU-16 quede autocontenida:

| KPI | Definición operacional cerrada para MVP1 |
|---|---|
| Tiempo promedio de espera por vehículo | Media aritmética del tiempo, en segundos, que cada vehículo pasa con velocidad por debajo de un umbral bajo (sugerencia operativa: 0.1 m/s, cierre al implementar) durante su paso por la intersección. Agregado sobre todos los vehículos del periodo seleccionado, por dirección y total. |
| Longitud máxima de cola por dirección | Máximo de la longitud de cola, en número de vehículos, observado en cada dirección durante el periodo seleccionado. Se reporta por dirección, sin agregación al total de la intersección (el máximo de un agregado no es el agregado de los máximos). |
| Throughput de la intersección | Número total de vehículos que cruzan la intersección durante el periodo seleccionado, normalizado a vehículos por hora dividiendo por la duración del periodo. Agregado total, sin disgregación por dirección en la vista principal. |
| Demora promedio acumulada | Media aritmética, por vehículo, de la diferencia entre el tiempo real de paso del vehículo y el tiempo que tardaría en condiciones de free-flow (recorrido a velocidad libre sin detenciones). Agregado sobre todos los vehículos del periodo. |

**Decisión específica:** las cuatro definiciones se materializan como CAs específicos de cálculo en HU-16, y cada KPI lleva un tooltip de ayuda activable en la vista que despliega la definición operacional al Gerente (patrón establecido en CA-14.7 de HU-14 para las métricas del modelo predictivo).

**Detalles cerrados:**

1. **Cálculo: media aritmética, no percentiles.** Los promedios son aritméticos. Los percentiles (p50, p95) son trabajo futuro si se justifica.

2. **Disgregación por dirección.** Tiempo promedio de espera y longitud máxima de cola se reportan también por dirección de entrada. Throughput y demora promedio acumulada se reportan agregados a la intersección, sin disgregación por dirección en la vista principal (el agregado es lo que valida la tesis).

3. **Unidades:** segundos para tiempos, vehículos para conteos, vehículos/hora para throughput, segundos para demora acumulada por vehículo.

4. **Free-flow para demora:** se calcula como tiempo de cruce a velocidad libre del acceso (`longitud_acceso / max_speed_acceso`), tomando max_speed del archivo de red de la intersección, congruente con la nota técnica de TTH-07 sobre el mapeo SUMO → jam level.

#### E. Granularidad temporal del histórico persistido

La ficha de F30 deja abierto "¿estados cada 1s, 10s, 1min?" y sugiere 30 segundos para validación. Sin política de retención clara.

**Decisión:** la granularidad de agregación del histórico persistido es de 30 segundos por intersección y por dirección. No hay política de retención automática en MVP1: el histórico se acumula durante el alcance académico sin borrado programado.

**Justificación de los 30 segundos:** equilibra (a) resolución suficiente para reconstruir tendencias en periodos semanales y mensuales, (b) volumen razonable de filas para una intersección durante el alcance académico (aproximadamente 2880 filas por dirección y por día), (c) coherencia con la frecuencia típica de actualización de la vista del Operador (HU-02 actualiza en tiempo casi-real, no requiere persistir cada segundo).

**Exposición al Administrador:** la granularidad **no se expone** como parámetro configurable en HU-15 en MVP1. Cambiar la granularidad históricamente acumulada introduce complejidad de migración (filas de granularidad mixta) que no aporta valor en el alcance académico. Si en el futuro se justifica exposición, se evalúa entonces; no es trabajo del Bloque F.

#### F. Periodos predefinidos del selector

La ficha de F13 sugiere "esta semana, semana anterior, este mes, mes anterior + rango personalizado". DHU-016 cierra la lista exacta y las convenciones de cálculo.

**Decisión:** el selector ofrece cuatro presets más un rango personalizado:

1. **Esta semana** — desde el lunes 00:00 hasta el momento actual.
2. **Semana anterior** — desde el lunes de la semana previa 00:00 hasta el domingo previo 23:59:59.
3. **Este mes** — desde el día 1 del mes actual 00:00 hasta el momento actual.
4. **Mes anterior** — desde el día 1 del mes previo 00:00 hasta el último día del mes previo 23:59:59.
5. **Rango personalizado** — el Gerente selecciona fecha de inicio y fecha de fin mediante un componente date picker.

**Convenciones cerradas:**

- Semana inicia los **lunes** (convención ISO 8601, predominante en contexto académico peruano y latinoamericano).
- Mes natural calendario (no rolling 30 días).
- Zona horaria del sistema (la del despliegue del servidor; en MVP1 se asume zona horaria de Lima, Perú).
- El periodo "trimestre" mencionado en el título original de F13 **no se incluye en MVP1**: tres meses requieren especificación adicional (¿trimestre calendario natural Q1/Q2/Q3/Q4? ¿últimos 90 días?) que excede el alcance mínimo. Se evalúa como mejora si surge necesidad concreta.

#### G. Definición de "periodo previo equivalente" en HU-17

La ficha de F14 identifica como riesgo "decidir qué considera periodo previo equivalente". DHU-016 cierra:

**Decisión:** el periodo previo equivalente de la vista comparativa (HU-17) es el periodo del mismo tipo inmediatamente anterior al actual:

- Si el periodo seleccionado es "esta semana" → comparativo es "semana anterior".
- Si el periodo seleccionado es "este mes" → comparativo es "mes anterior".
- Si el periodo seleccionado es "semana anterior" → comparativo es "dos semanas atrás".
- Si el periodo seleccionado es "mes anterior" → comparativo es "dos meses atrás".
- Si el periodo seleccionado es "rango personalizado" → comparativo es el rango de igual duración inmediatamente anterior al rango actual (por ejemplo: si el rango actual es del 1 al 15 de marzo, el comparativo es del 14 al 28 de febrero).

**Justificación:** patrón estándar de herramientas analíticas (Google Analytics, Mixpanel, Tableau usan la misma convención). Bajo riesgo de implementación. Cubre los cuatro casos del selector sin agregar UI nueva.

#### H. Concurrencia entre Gerentes

**Diagnóstico:** las HUs del Bloque F son **read-only**. El Gerente consulta KPIs y comparativas, no edita configuración ni datos. Múltiples Gerentes consultando simultáneamente es un caso de carga, no de concurrencia funcional.

**Decisión:** las HUs del Bloque F no incluyen mecanismo de control de concurrencia (no hay last-write-wins porque no hay write). La concurrencia entre Gerentes se documenta explícitamente como **no aplicable** en una nota técnica de HU-16 para evitar ambigüedad.

**Justificación:** análoga a por qué HU-02 y HU-03 (consulta en tiempo real del Operador) no incluyen mecanismo de control de concurrencia, a diferencia de HU-15 (configuración de parámetros del Administrador) que sí lo requiere (CA-15.11).

#### I. Dashboard integrador del Gerente y composición de HUs

**Contexto:** el Sequencer del Inception lista tres features para el Bloque F (F12, F13, F14). Si cada feature se modela como HU separada, el Bloque F tendría tres HUs operativas (estimación inicial del usuario al iniciar la sesión).

**Análisis:** el selector de periodo (F13) no entrega valor en aislamiento; su único propósito es gobernar lo que muestra el dashboard ejecutivo (F12) y la comparativa (F14). Una HU dedicada al selector violaría el principio de cohesión de Mike Cohn ("una HU = un valor entregable autocontenido"). El selector no es una pieza de funcionalidad autónoma sino un componente de control sobre las vistas que sí entregan valor.

A diferencia del Administrador (DHU-014 subsección B), el Gerente sí trabaja sobre un único objeto compuesto: los KPIs del periodo seleccionado. F12 y F13 son altamente acoplados: la consulta de KPIs sin selector es un dashboard estático, y el selector sin KPIs es un componente vacío. F14 sí es separable: la comparativa es una vista distinta que reutiliza el periodo seleccionado, pero entrega un valor diferenciado (tendencia, no estado).

**Decisión:** el Bloque F se redacta con **2 HUs operativas, no 3**:

- **HU-16** fusiona F12 (Dashboard ejecutivo) y F13 (Selector de periodo) en una sola HU "Consulta de KPIs operativos sobre periodo seleccionable". El selector y el dashboard viven como CAs distintos dentro de la misma HU. F30 se ingloba como CAs adicionales en esta misma HU.

- **HU-17** mantiene F14 (Vista comparativa entre periodos) como HU separada. Reutiliza el selector definido en HU-16 (la selección de periodo es estado compartido entre las dos vistas del Gerente) y entrega valor diferenciado (comparativa con periodo previo equivalente).

**Sin HU dedicada de dashboard integrador.** Análogamente a DHU-014 subsección B (sin HU dedicada de dashboard del Administrador), el Gerente no requiere HU dedicada de "dashboard integrador" análoga a F02 del Bloque B. La navegación del Gerente da acceso a HU-16 (consulta principal) y HU-17 (comparativa), y eso es suficiente. La diferencia respecto al Operador es que el Gerente no monitorea en tiempo real: el valor agregado de un dashboard integrador único como F02 viene del simultaneismo del tiempo real, que no aplica al Gerente.

**Consecuencia formal:** el Bloque F cierra con **2 HUs operativas + 0 TTH nuevas**, no 3 HUs. La estimación inicial de "~3 HUs MVP1" en el mensaje de arranque queda revisada por DHU-016 a "2 HUs MVP1". La compactación preserva la cobertura funcional de las tres features y mejora la cohesión semántica de las HUs.

#### J. Aplicación de DHU-005 al Bloque F (robustez ante interrupción de fuente)

DHU-005 declara dos casos: Caso A (fuente externa de medición) y Caso B (componente interno de decisión). El Bloque F no opera en tiempo real, pero las HUs del Gerente dependen de que la persistencia histórica de F30 y el motor de cálculo de KPIs estén disponibles.

**Decisión:** las HUs del Bloque F aplican **DHU-005 Caso B** al motor de cálculo de KPIs y al subsistema de consulta del histórico:

- Cuando la persistencia de F30 deja de responder, la vista muestra los últimos KPIs calculados marcados como "no actualizados", indicando el timestamp del último cálculo exitoso.
- Cuando el motor de cálculo de KPIs no puede completar el cálculo del periodo solicitado, la vista comunica explícitamente la indisponibilidad temporal en lugar de mostrar KPIs en cero (que podrían confundirse con un periodo de tráfico cero, valor distinto a "no se pudo calcular").

**Patrón previo:** CA-14.12 de HU-14 aplica el mismo principio al motor de cálculo de métricas del modelo predictivo. Las HUs del Bloque F lo aplican análogamente al motor de cálculo de KPIs.

**Manejo de caso degenerado (sin datos en el periodo):** si el periodo seleccionado no contiene datos persistidos (por ejemplo, el Gerente selecciona "semana anterior" pero el sistema aún no estaba operativo entonces), la vista comunica explícitamente "no hay datos en el periodo seleccionado" en lugar de mostrar KPIs calculados sobre cero filas. Patrón análogo a CA-14.11 de HU-14.

### Decisión final

**Bloque F MVP1: 2 HUs operativas + 0 TTH nuevas.**

| Feature | Modelado como | Identificador |
|---|---|---|
| F12 (Dashboard ejecutivo) + F13 (Selector de periodo) | HU fusionada del Gerente | **HU-16** |
| F30 (Persistencia de estados históricos) | Inglobada como CAs en HU-16 | (CAs específicos) |
| F14 (Vista comparativa entre periodos) | HU del Gerente | **HU-17** |

**Total Bloque F:** 2 HUs operativas + 0 TTH nuevas. F30 inglobada en CAs de HU-16, conforme a la regla del Bloque A y al patrón establecido para F31 en CA-08.1 de HU-08.

### Lo que NO cambia con DHU-016

- **Las decisiones DHU-001 a DHU-015 mantienen su contenido sustantivo.** DHU-016 las cita y aplica al Bloque F sin reabrir ninguna.
- **El alcance del producto** (Personas, Objetivos, Journeys, Visión) se mantiene intacto.
- **Las HUs MVP1 redactadas en bloques previos (HU-01 a HU-15)** no se reabren. F30 inglobada en HU-16 es persistencia operacional independiente respecto a TTH-07, TTH-08, TTH-09, HU-08 CA-08.1 y TTH-04 CT-04.3; ninguno de esos registros se ve modificado.
- **Las TTH previas (TTH-01 a TTH-11)** mantienen su contenido. El cálculo de KPIs del Bloque F sobre el histórico persistido por F30 no requiere reabrir ningún CT.
- **Los 4 KPIs del MVP Canvas Bloque 6** se mantienen como base de validación cuantitativa. Las definiciones operacionales de la subsección D refinan su cálculo sin alterar su selección.

### Documentos afectados por DHU-016

| Documento | Tipo de cambio |
|---|---|
| `HU_BLOQUE_F.md` (nuevo) | Documento nuevo con HU-16 (F12 + F13 fusionadas + F30 inglobada) y HU-17 (F14). |
| `DECISIONS_HU.md` (este documento) | Agregar DHU-016; actualizar índice, tabla de impacto en bloques y documentos relacionados. |
| `FEATURE_BACKLOG_DETALLADO.md` | Fichas de F12, F13, F14 y F30 actualizan su columna "Modelado" para apuntar a HU-16, HU-17 y CAs específicos. La ficha de F13 incorpora la decisión sobre presets cerrados (subsección F) y la exclusión de "trimestre" en MVP1. La ficha de F14 incorpora la definición de "periodo previo equivalente" (subsección G). La ficha de F30 incorpora la granularidad cerrada y la independencia respecto a otros registros (subsecciones C y E). La ficha de F12 incorpora las definiciones operacionales de los 4 KPIs (subsección D). |
| `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md`, `HU_BLOQUE_C.md`, `HU_BLOQUE_D.md`, `HU_BLOQUE_E.md` | Próximos pasos actualizados: Bloque F ya cerrado; resta MVP2. |
| `LEAN_INCEPTION_CEREBROVIAL.md` | Documentos relacionados actualizado (referencia a `HU_BLOQUE_F.md`). |

### Documentos relacionados

- `HU_BLOQUE_F.md` — Bloque F del Product Backlog (2 HUs operativas: HU-16, HU-17).
- `DECISIONS_HU.md` (este documento) — sección DHU-016.
- `LEAN_INCEPTION_CEREBROVIAL.md` — Persona Gerente, Journey 2, MVP Canvas Bloque 6 (KPIs).
- `FEATURE_BACKLOG_DETALLADO.md` — fichas F12, F13, F14, F30.
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-07/CT-07.3, TTH-08/CT-08.5, TTH-09/CT-09.5 (registros operacionales preexistentes; F30 declara independencia explícita respecto a estos).

---

## Resumen de impacto en los bloques redactados hasta la fecha

| Bloque | HUs | TTH | Decisiones aplicadas |
|---|---|---|---|
| Bloque A | HU-01 | TTH-01, TTH-02, TTH-03 | DHU-001, DHU-002, DHU-003, DHU-004, DHU-007 (retroactivo) |
| Bloque B | HU-02 a HU-09 | (ninguna nueva) | DHU-003, DHU-005 (refinada con A y B), DHU-006, DHU-007 |
| Bloque C | HU-10, HU-11, HU-12 (HU-13 eliminada por DHU-011) | TTH-04, TTH-05 | DHU-005, DHU-006, DHU-007, DHU-008, DHU-009, DHU-010, DHU-011 |
| Bloque D | HU-13, HU-14, HU-15 | (ninguna nueva del MVP1); TTH-06 agregada como Trabajos Futuros; CT-04.5 de TTH-04 ampliada | DHU-013 (clasificación), DHU-014 (decisiones de redacción) |
| Bloque E | (ninguna HU operativa) | TTH-07, TTH-08, TTH-09, TTH-10, TTH-11 | DHU-015 (clasificación HU/TTH del Bloque E con ampliación 4 → 5 TTH durante la redacción) |
| Bloque F | HU-16, HU-17 (F12+F13 fusionadas con F30 inglobada; F14) | (ninguna nueva) | DHU-016 (decisiones consolidadas de redacción del Bloque F en diez subsecciones) |
| Transversal | — | — | DHU-012 (auditoría de coherencia documental, aplica a todos los bloques y documentos relacionados) |

---

## Documentos relacionados

- `HU_BLOQUE_A.md` — Bloque A del Product Backlog (1 HU operativa).
- `HU_BLOQUE_B.md` — Bloque B del Product Backlog (8 HUs, 7 MVP1 + 1 MVP2).
- `HU_BLOQUE_C.md` — Bloque C del Product Backlog (3 HUs operativas: HU-10, HU-11, HU-12).
- `HU_BLOQUE_D.md` — Bloque D del Product Backlog (3 HUs operativas: HU-13, HU-14, HU-15).
- `HU_BLOQUE_E.md` — Bloque E del Product Backlog (0 HUs operativas; mapeo a TTH-07 a TTH-11 y decisiones tomadas durante la redacción).
- `HU_BLOQUE_F.md` — Bloque F del Product Backlog (2 HUs operativas: HU-16, HU-17; F30 inglobada como CAs).
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-01 a TTH-11.
- `DECISIONS.md` — Decisiones técnicas del producto (D-001 a D-009). No se solapa con este documento.
- `LEAN_INCEPTION_CEREBROVIAL.md` — Personas, journeys, MVP Canvas (insumos para identificar sujetos válidos).
- `FEATURE_BACKLOG_DETALLADO.md` — Origen de las features que se mapean a HUs y TTH.
- `EVOLUCION_TESIS.md` — Narrativa de las 4 fases del proyecto; sección 8 contiene tabla de Trabajos Futuros.
- `motor_adaptativo_teoria.md` — Sustentación teórica del motor adaptativo (consumido por TTH-10).
- `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md` — Documento futuro pendiente (DHU-007).
