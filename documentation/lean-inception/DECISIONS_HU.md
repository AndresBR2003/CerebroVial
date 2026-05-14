# DECISIONS_HU — Decisiones metodológicas sobre la redacción de Historias de Usuario

> Registro formal de decisiones que afectan la redacción del Product Backlog del proyecto CerebroVial.
>
> **Alcance:** Estas decisiones aplican a TODO el Product Backlog (Bloques A–F + MVP2). Cualquier HU redactada después de la fecha de cada decisión debe respetarla.
>
> **Relación con `DECISIONS.md`:** El documento `DECISIONS.md` registra decisiones técnicas del producto (arquitectura, modelo, datos). Este documento registra decisiones metodológicas sobre cómo se redacta el backlog. Los códigos no se solapan: `D-xxx` para técnicas, `DHU-xxx` para HUs.
>
> **Fecha de creación:** 2026-05-13
> **Última actualización:** 2026-05-14 (auditoría de coherencia documental: DHU-012 y DHU-013 agregadas).

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

Esta decisión genera modificaciones en los siguientes 8 documentos del proyecto:

| Documento | Tipo de cambio |
|---|---|
| `DECISIONS_HU.md` (este documento) | Agregar DHU-012 (esta decisión) y DHU-013 (clasificación HU/TTH del Bloque D); nota en DHU-008; renombrado de vocabulario en DHU-008, DHU-009 y DHU-010. |
| `DECISIONS.md` | Limpieza completa de residuo del régimen pre-Inception; contenido sustantivo preservado. |
| `LEAN_INCEPTION_CEREBROVIAL.md` | Renombrado MVP3 → Trabajos Futuros; conteo MVP1 = 29; Journey 4 reescrito; limpieza de residuo PLAN; versión 1.1 con nota de cambios. |
| `LEAN_INCEPTION_INVESTIGACION.md` | Sección 9 eliminada; versión 1.1. |
| `EVOLUCION_TESIS.md` | Sección 8 reescrita como tabla referencial; limpieza de residuo PLAN. |
| `FEATURE_BACKLOG_DETALLADO.md` | Agregar fichas F36-F41; reclasificar F21 como Trabajos Futuros; recalcular tablas; renombrado vocabulario; limpieza de residuo PLAN; referencia ficha F26 a TTH-04; conteo D-001 a D-009. |
| `HU_BLOQUE_B.md` | Próximos pasos actualizados; nota técnica de HU-09 suavizada. |
| `HU_BLOQUE_C.md` | Próximos pasos del Bloque D actualizados; renombrado de vocabulario en HU-10, HU-11, HU-12, CAs y notas. |
| `TAREAS_TECNICAS_HABILITADORAS.md` | Título de TTH-05 actualizado; renombrado de vocabulario en TTH-04 y TTH-05; identificador `safe_3` → `degraded_3`; nota de línea 262 cerrada por DHU-013; limpieza de residuo PLAN. |

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

## Resumen de impacto en los bloques redactados hasta la fecha

| Bloque | HUs | TTH | Decisiones aplicadas |
|---|---|---|---|
| Bloque A | HU-01 | TTH-01, TTH-02, TTH-03 | DHU-001, DHU-002, DHU-003, DHU-004, DHU-007 (retroactivo) |
| Bloque B | HU-02 a HU-09 | (ninguna nueva) | DHU-003, DHU-005 (refinada con A y B), DHU-006, DHU-007 |
| Bloque C | HU-10, HU-11, HU-12 (HU-13 eliminada por DHU-011) | TTH-04, TTH-05 | DHU-005, DHU-006, DHU-007, DHU-008, DHU-009, DHU-010, DHU-011 |
| Bloque D | (pendiente) | (ninguna nueva) | DHU-013 (cierre de clasificación) |
| Transversal | — | — | DHU-012 (auditoría de coherencia documental, aplica a todos los bloques y documentos relacionados) |

---

## Documentos relacionados

- `HU_BLOQUE_A.md` — Bloque A del Product Backlog (1 HU operativa).
- `HU_BLOQUE_B.md` — Bloque B del Product Backlog (8 HUs, 7 MVP1 + 1 MVP2).
- `HU_BLOQUE_C.md` — Bloque C del Product Backlog (3 HUs operativas: HU-10, HU-11, HU-12).
- `HU_BLOQUE_D.md` — Bloque D del Product Backlog (pendiente de redacción; 3 HUs MVP1 según DHU-013).
- `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-01 a TTH-05.
- `DECISIONS.md` — Decisiones técnicas del producto (D-001 a D-009). No se solapa con este documento.
- `LEAN_INCEPTION_CEREBROVIAL.md` — Personas, journeys, MVP Canvas (insumos para identificar sujetos válidos).
- `FEATURE_BACKLOG_DETALLADO.md` — Origen de las features que se mapean a HUs y TTH.
- `EVOLUCION_TESIS.md` — Narrativa de las 4 fases del proyecto; sección 8 contiene tabla de Trabajos Futuros.
- `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md` — Documento futuro pendiente (DHU-007).
