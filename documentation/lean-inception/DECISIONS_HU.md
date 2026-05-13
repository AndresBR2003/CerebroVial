# DECISIONS_HU — Decisiones metodológicas sobre la redacción de Historias de Usuario

> Registro formal de decisiones que afectan la redacción del Product Backlog del proyecto CerebroVial.
>
> **Alcance:** Estas decisiones aplican a TODO el Product Backlog (Bloques A–F + MVP2). Cualquier HU redactada después de la fecha de cada decisión debe respetarla.
>
> **Relación con `DECISIONS.md`:** El documento `DECISIONS.md` registra decisiones técnicas del producto (arquitectura, modelo, datos). Este documento registra decisiones metodológicas sobre cómo se redacta el backlog. Los códigos no se solapan: `D-xxx` para técnicas, `DHU-xxx` para HUs.
>
> **Fecha de creación:** 2026-05-13
> **Última actualización:** 2026-05-13 (cierre del Bloque B)

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

Cada HU operativa es responsable únicamente de **marcar pasivamente** su propio panel según el caso que corresponda (A o B). La **notificación activa al Operador** ante una caída de componente que afecta la operación general del sistema es responsabilidad de las HUs del Bloque C (operación degradada), que actúan de forma transversal a todas las vistas.

Las HUs operativas **no duplican** esa lógica ni la referencian explícitamente; cada bloque cumple su responsabilidad:

- **Bloque B (monitoreo):** marca pasiva en cada panel afectado.
- **Bloque C (degradación):** alerta activa transversal sobre el estado degradado del sistema.

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

## Resumen de impacto en los bloques redactados hasta la fecha

| Bloque | HUs | Decisiones aplicadas |
|---|---|---|
| Bloque A | HU-01 | DHU-001, DHU-002, DHU-003, DHU-004, DHU-007 (retroactivo) |
| Bloque B | HU-02 a HU-09 | DHU-003, DHU-005 (refinada con A y B), DHU-006, DHU-007 |

---

## Documentos relacionados

- `HU_BLOQUE_A.md` — Bloque A del Product Backlog (1 HU operativa).
- `HU_BLOQUE_B.md` — Bloque B del Product Backlog (8 HUs, 7 MVP1 + 1 MVP2).
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-01, TTH-02, TTH-03 transversales.
- `DECISIONS.md` — Decisiones técnicas del producto (D-001 a D-009). No se solapa con este documento.
- `LEAN_INCEPTION_CEREBROVIAL.md` — Personas, journeys, MVP Canvas (insumos para identificar sujetos válidos).
- `FEATURE_BACKLOG_DETALLADO.md` — Origen de las features que se mapean a HUs y TTH.
- `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md` — Documento futuro pendiente (DHU-007).
