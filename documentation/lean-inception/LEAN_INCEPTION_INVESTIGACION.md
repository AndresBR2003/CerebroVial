# Lean Inception — Investigación y Adaptación al Proyecto

> Documento de investigación sobre Lean Inception como marco metodológico para la definición de alcance del proyecto CerebroVial. Incluye fundamentación teórica, actividades originales del marco, y la adaptación justificada al contexto académico de tesis.
>
> **Pensado como insumo para:** (a) el capítulo metodológico de la tesis, (b) base para ejecutar el Inception del proyecto en las próximas semanas, (c) sustento defendible ante el jurado de la elección del marco.

**Fecha de redacción:** 2026-05-11
**Versión:** 1.1 (actualizada 2026-05-14: eliminada sección 9 "Próximo paso inmediato", obsoleta tras la ejecución del Inception. Ver DHU-012 en `DECISIONS_HU.md`).

---

## 1. Origen e historia

**Lean Inception** es un workshop colaborativo creado por **Paulo Caroli** (consultor de Thoughtworks, autor del libro homónimo de 2018) cuyo objetivo es alinear a un equipo sobre el **Producto Mínimo Viable (MVP)** a construir.

Surge como evolución de dos prácticas previas:

1. **"Inception Ágil tradicional"** — workshops largos de 2 a 4 semanas que se usaban al inicio de proyectos para definir alcance. Caroli observó que tomaban demasiado tiempo y producían planes demasiado completos (no lean).
2. **"The Lean Startup"** (Eric Ries, 2011) — popularizó el concepto de MVP: la versión más simple del producto que permite **aprender** si vale la pena seguir construyéndolo.

La síntesis de Caroli es: **un workshop de exactamente una semana** que combina filosofía de **Design Thinking** (centrado en el usuario) y método de **Lean Startup** (validar hipótesis con MVP) para definir el alcance del producto. Caroli ha facilitado más de 400 Lean Inceptions a la fecha.

**Diferencia con otras prácticas:**

| Práctica | Para qué sirve |
|---|---|
| **Lean Inception** | Alinear al equipo sobre **qué producto** construir (MVP) |
| **Scrum / Kanban** | Ejecutar la construcción (cómo trabajar día a día) |
| **Design Sprint** | Decidir sobre un **prototipo específico** (no un producto completo) |
| **User Story Mapping** | Mapear **jornadas de usuario** a historias (asume producto ya definido) |
| **Business Model Canvas** | Definir **estrategia de negocio** (un nivel arriba del producto) |
| **PI Planning** | Alinear **múltiples equipos** en un programa de trabajo |

Lean Inception NO sustituye investigación de usuarios, análisis competitivo ni revisión arquitectónica: es una técnica específica dentro de un proceso de desarrollo de producto.

---

## 2. Cuándo usar Lean Inception (y cuándo no)

**Caroli recomienda usar Lean Inception cuando:**

- Hay que construir un MVP desde cero.
- Un equipo necesita alinear su entendimiento del producto antes de empezar a construir.
- Proyectos grandes necesitan empezar de forma "lean" (entregando valor pronto).
- Startups quieren convertir una idea probada en un producto de software.

**Caroli explícitamente NO recomienda Lean Inception para:**

- Actividades de descubrimiento o investigación temprana de usuarios.
- Decidir sobre un prototipo específico (mejor un Design Sprint).
- Alinear múltiples equipos en un programa de trabajo (mejor PI Planning).
- Priorizar un portafolio de iniciativas (mejor WSJF o RICE).

**Implicación para el proyecto CerebroVial:** el proyecto NO empieza de cero — ya hay 6 semanas de código y componentes funcionales (motor adaptativo, visión, RandomForest baseline). Esto es una desviación del caso de uso típico de Lean Inception, que asume un equipo en hoja en blanco. Esta desviación se aborda explícitamente en la sección de adaptación (sección 4).

---

## 3. Las 8 actividades del Lean Inception original

Caroli define una agenda de **5 días con 8 actividades principales**. A continuación se describen en orden cronológico.

### Día 1 — Visión y alcance

#### Actividad 1: Kick-off
**Propósito:** Iniciar el workshop alineando a todos sobre objetivos, expectativas y dinámica.

**Quién participa:** Patrocinadores, stakeholders principales, facilitador, miembros activos (negocio, UX, desarrollo).

**Entregable:** Acuerdo sobre la agenda y compromiso de participación.

#### Actividad 2: Escribir la Visión del Producto (Product Vision)
**Propósito:** Definir colaborativamente una frase que capture la esencia del producto.

**Técnica:** Plantilla Geoffrey Moore (popularizada por Roman Pichler):

> **Para** [cliente objetivo]
> **que** [necesidad u oportunidad],
> **el** [nombre del producto]
> **es un** [categoría de producto]
> **que** [beneficio clave / razón para comprar].
> **A diferencia de** [alternativa competitiva],
> **nuestro producto** [diferenciador clave].

**Dinámica:** Se divide al equipo en grupos pequeños, cada grupo llena un espacio en blanco de la plantilla. Se consolidan los resultados. Es común que la primera frase combinada no tenga sentido — se itera hasta lograr coherencia.

**Entregable:** Una sola frase de visión del producto.

#### Actividad 3: El Producto Es / No Es / Hace / No Hace
**Propósito:** Clarificar el alcance del producto definiendo qué es y qué no es, qué hace y qué no hace.

**Estructura:** Matriz 2×2:

| | **Es** | **No es** |
|---|---|---|
| **Hace** | Características que tiene y funciones que cumple | Características que tiene pero funciones que NO cumple |
| **No hace** | (típicamente vacío) | Lo que explícitamente queda fuera de alcance |

**Por qué es valioso:** Definir explícitamente qué NO es el producto ahorra discusiones futuras y evita scope creep. Caroli dice: *"a veces es más fácil describir algo por lo que no es"*.

**Entregable:** Matriz Es/No Es/Hace/No Hace.

#### Actividad 4: Objetivos del Producto (Product Goals)
**Propósito:** Identificar los 3 objetivos principales del producto consensuados por el equipo.

**Dinámica:** Cada participante escribe en post-its lo que entiende como los 3 objetivos principales. Se agrupan por afinidad. Se consolidan en 3 objetivos finales.

**Entregable:** Lista de 3 objetivos principales.

### Día 2 — Usuarios

#### Actividad 5: Describir las Personas
**Propósito:** Identificar y caracterizar los tipos de usuarios del producto.

**Plantilla de persona (versión Roman Pichler / Caroli):**

- **Apodo + dibujo** (humaniza)
- **Perfil/detalles** (rol, edad, contexto)
- **Comportamiento característico**
- **Necesidades específicas**

**Dinámica iterativa:** Equipos pequeños crean personas en paralelo, se presentan al grupo, se re-mezclan los equipos, se itera. Esto comparte conocimiento y supuestos sobre los usuarios.

**Entregable:** Conjunto de personas que cubren todos los perfiles de usuario relevantes.

#### Actividad 6: Jornadas de Usuario (User Journeys)
**Propósito:** Mapear el recorrido que cada persona hace al interactuar con el producto.

**Formato típico:** Pasos secuenciales con emociones/pain points en cada paso.

**Por qué importa:** Las features se justifican por su contribución a una jornada concreta de un usuario concreto. Sin jornadas, las features son arbitrarias.

**Entregable:** Una jornada por persona principal.

### Día 3 — Funcionalidades

#### Actividad 7: Brainstorming de Features
**Propósito:** Generar la lista de funcionalidades del producto, ancladas a personas y jornadas.

**Regla de oro de Caroli:**
> *"La descripción de una feature debe ser tan simple como sea posible, buscando cumplir un objetivo de negocio, una necesidad de persona, y/o cubrir un paso en la jornada."*

**Dos variantes de orden:**
- **Agenda 1:** Features antes de Jornadas (creatividad influenciada por objetivos de negocio).
- **Agenda 2:** Jornadas antes de Features (features influenciadas por experiencia de usuario).

**Entregable:** Lista de features descritas con título y propósito.

#### Actividad 8: Revisión Técnica, UX y de Negocio
**Propósito:** Cada feature se evalúa desde 3 perspectivas para detectar desacuerdos y dudas.

| Perspectiva | Pregunta |
|---|---|
| **Técnica** | ¿Sabemos cómo construirlo? ¿Qué tan complejo es? |
| **UX** | ¿Está clara la experiencia? ¿Cubre la jornada del usuario? |
| **Negocio** | ¿Aporta al objetivo de negocio? ¿Es prioritario? |

**Entregable:** Lista de features anotadas con esfuerzo/valor/UX, lista de dudas y riesgos.

### Día 4-5 — MVP

#### Actividad 9: Sequencer (Secuenciador de Features)
**Propósito:** Organizar visualmente las features en una secuencia de MVPs incrementales.

**Estructura:** Una línea horizontal por MVP. La primera línea es el MVP1 (mínimo viable real). Las siguientes son incrementos.

**Reglas:**
- Cada MVP debe ser **lanzable y útil** por sí mismo.
- Cada MVP valida una hipótesis específica.
- No se trata de "dividir el producto en sprints" — se trata de identificar qué subconjunto mínimo permite **aprender** si el producto funciona.

**Entregable:** Secuenciador con MVP1, MVP2, MVP3...

#### Actividad 10: MVP Canvas
**Propósito:** Para cada MVP en el Sequencer, llenar un canvas que conecta features con hipótesis de negocio.

**Bloques del MVP Canvas (orden recomendado de llenado):**

1. **Propuesta del MVP** — ¿Cuál es la propuesta de este MVP? ¿Qué problema resuelve?
2. **Personas Segmentadas** — ¿Para quién es este MVP? ¿Podemos probarlo en un grupo más pequeño?
3. **Jornadas** — ¿Qué jornadas mejora este MVP?
4. **Features** — ¿Qué construimos en este MVP?
5. **Resultado Esperado** — ¿Qué aprendizaje o resultado buscamos?
6. **Métricas para validar hipótesis** — ¿Cómo medimos el éxito o fracaso?
7. **Costo y Cronograma** — ¿Cuánto cuesta y cuándo está listo? ¿Cuándo veremos los datos?

**Por qué este canvas es la culminación:** Conecta producto (features) con negocio (hipótesis a validar) y aprendizaje (métricas). Es la versión Lean del Business Model Canvas aplicada a un MVP.

**Entregable:** Un MVP Canvas por MVP en el Sequencer (mínimo MVP1, idealmente MVP1 + MVP2 + MVP3).

#### Actividad 11: Showcase
**Propósito:** Presentar los artefactos generados a stakeholders que no estuvieron en todas las sesiones.

**Entregable:** Aprobación / feedback sobre el plan MVP.

---

## 4. Adaptación al Proyecto CerebroVial

Lean Inception está pensado para un workshop colaborativo de equipos de producto con stakeholders comerciales reales. **El proyecto CerebroVial es una tesis universitaria**, lo cual genera tres desviaciones importantes que justifican adaptaciones explícitas:

### 4.1 Desviación 1: No hay equipo colaborativo extenso

**Situación original:** Lean Inception asume al menos 3 perfiles activos (negocio, UX, desarrollo) más stakeholders.

**Situación CerebroVial:** Equipo de tesis pequeño (1-2 personas) más un asesor académico. No hay Product Owner comercial. No hay usuarios reales contratantes.

**Adaptación:** Las actividades colaborativas (brainstorming, votación) se reemplazan por **conversaciones estructuradas tesista–asistente IA con validación posterior del asesor**. La "diversidad de perspectivas" se simula explorando los roles (negocio = municipalidad hipotética, UX = ciudadano, técnica = tesista) en momentos separados de la conversación, no en paralelo.

**Defensa académica:** se documenta explícitamente que se aplica una variante individual del marco, manteniendo todos los artefactos pero ajustando el método de generación.

### 4.2 Desviación 2: El producto no empieza de cero

**Situación original:** Lean Inception asume hoja en blanco — el equipo decide qué construir.

**Situación CerebroVial:** Hay 6 semanas de código previo. Existen el módulo de visión, RandomForest baseline, motor adaptativo, frontend de control. Estos componentes son hechos consumados, no decisiones abiertas.

**Adaptación:** Lean Inception se ejecuta **con conocimiento de la arquitectura ya construida**. Las actividades de Visión, Es/No Es y Objetivos se hacen "como si" empezáramos de cero (para validar coherencia retroactiva), pero el brainstorming de features se restringe a features compatibles con la arquitectura actual. Si una feature "ideal" requiere descartar trabajo previo, se evalúa con honestidad si vale la pena el costo.

**Defensa académica:** esto se llama "Inception retroactivo" en la literatura informal. No es ortodoxo, pero es honesto: refleja la realidad del proyecto.

### 4.3 Desviación 3: El "MVP" no se lanza al mercado

**Situación original:** El MVP de Lean Inception se lanza a usuarios reales para aprender. Las métricas miden adopción, retención, satisfacción.

**Situación CerebroVial:** No hay lanzamiento. El "MVP" es lo que se sustenta en la defensa. Las métricas son académicas (KPIs de tráfico simulado, precisión del predictor, métricas de detección).

**Adaptación:** El **MVP1 se redefine como "el sistema mínimo que permite sustentar la tesis"**. Las hipótesis no son comerciales sino académicas:

- *"¿El motor adaptativo mejora KPIs de tráfico frente a Webster fijo, en simulación SUMO?"*
- *"¿El GRU univariado predice congestión con error aceptable sobre dataset SUMO?"*
- *"¿El módulo de visión detecta vehículos con métricas comparables al estado del arte?"*

Las métricas del MVP Canvas son las métricas de validación de la tesis (D-005, D-007, D-008 del DECISIONS.md).

**Defensa académica:** la traducción de "hipótesis de negocio" a "hipótesis de investigación" es estándar en proyectos académicos que adoptan métodos ágiles.

---

## 5. Plan de ejecución adaptado para CerebroVial

A continuación, el plan concreto de **cómo vamos a ejecutar Lean Inception** en el proyecto, mapeando cada actividad original a su versión adaptada y al entregable esperado.

| # | Actividad original | Versión CerebroVial | Entregable |
|---|---|---|---|
| 1 | Kick-off | Documento de contexto (este archivo + EVOLUCION_TESIS.md) | Ya disponible |
| 2 | Product Vision | Frase de visión usando plantilla Moore, validada con asesor | 1 frase + párrafo |
| 3 | Es / No Es / Hace / No Hace | Matriz 2×2 explícita para CerebroVial | Tabla |
| 4 | Product Goals | 3 objetivos consensuados con asesor | Lista |
| 5 | Personas | Perfiles: ciudadano, operador municipal, comité evaluador, equipo de tesis | Tabla estilo profesor (referencia Desarrollo_Agil.pdf) |
| 6 | User Journeys | Jornadas para cada persona relevante | Una jornada por persona |
| 7 | Feature Brainstorming | Lista de features ancladas a personas + jornadas | Lista de ~10-15 features |
| 8 | Revisión Técnica / UX / Negocio | Auto-revisión + validación con asesor | Features anotadas |
| 9 | Sequencer | MVP1 (tesis defendible) + MVP2 (mejoras) + MVP3 (trabajo futuro) | Diagrama |
| 10 | MVP Canvas | Un canvas por MVP, métricas = métricas académicas | 2-3 canvas |
| 11 | Showcase | Presentación al asesor del plan completo | Reunión + acta |

**Cronograma estimado de ejecución (NO 5 días, sino conversaciones distribuidas en la semana 6):**

- Día 1 (hoy): actividades 1-4 (Kick-off, Vision, Es/No Es, Goals).
- Día 2: actividades 5-6 (Personas, Journeys).
- Día 3: actividades 7-8 (Features, Revisión).
- Día 4: actividades 9-10 (Sequencer, MVP Canvas).
- Día 5: showcase con asesor.

Una vez completado este Inception, **los artefactos resultantes son los insumos directos para el Product Backlog (historias de usuario formato Como/Quiero/Para)**, lo cual habilita el inicio formal de SDD a partir de la semana 7.

---

## 6. Cómo se conecta con el resto del proceso

Lean Inception produce un **Product Backlog inicial** que alimenta las etapas siguientes del proyecto:

```
Lean Inception (semana 6)
       ↓
Product Backlog inicial (features → HUs en formato Como/Quiero/Para)
       ↓
Estimación (Planning Poker) + Priorización (MoSCoW)
       ↓
Sprint Goals (semanas 7-15)
       ↓
SDD (Spec-Driven Development) por cada HU prioritaria
       ↓
BDD / TDD durante la construcción
```

El documento del profesor (Desarrollo_Agil.pdf) muestra **exactamente esta secuencia**: del Inception salen las HUs, las HUs se estiman con Planning Poker, se priorizan con MoSCoW, y se asignan a Sprints. CerebroVial va a seguir esta misma secuencia con las adaptaciones de la sección 4.

---

## 7. Fundamentación bibliográfica

**Fuentes primarias:**

- Caroli, P. (2018). *Lean Inception: How to Align People and Build the Right Product.* Caroli Editors, São Paulo. Bestseller en Amazon Brasil; primera edición 2018, edición actualizada disponible.
- Caroli, P. *Lean Inception website.* Recuperado de https://caroli.org/en/lean-inception-4/

**Fuentes secundarias autorizadas:**

- Fowler, M. *Lean Inception.* Martin Fowler's website, Thoughtworks. Recuperado de https://martinfowler.com/articles/lean-inception/. Fowler valida y describe el método desde la perspectiva de Thoughtworks (organización donde Caroli trabajó como Principal Consultant).
- Miro. *Lean Inception Workshop Template.* Plantilla oficial colaborativa entre Caroli y Miro: https://miro.com/templates/lean-inception-workshop/

**Fundamentos teóricos previos:**

- Ries, E. (2011). *The Lean Startup.* Crown Business. Origen del concepto de MVP que Caroli adopta.
- Pichler, R. *A Persona Template for Agile Product Management.* Recuperado de https://www.romanpichler.com/blog/persona-template-for-agile-product-management/. Plantilla de Personas que Caroli adapta.
- Moore, G. (1991). *Crossing the Chasm.* Origen de la plantilla "Para X que tiene Y, el producto Z..." de la Product Vision.

---

## 8. Riesgos identificados y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| El asesor objeta el uso de Lean Inception por no ser estándar académico clásico (RUP, SCRUM puro) | Media | Documentar fundamentación bibliográfica (sección 7) + alineación con marco SCRUM que el profesor sí valida (Desarrollo_Agil.pdf usa Scrum, Lean Inception es complementario). |
| El alcance redefinido choca con el alcance original de la tesis (2).docx | Alta | Actualizar capítulo de alcance de la tesis con los nuevos artefactos (Visión, Personas, Features). Es uno de los pasos del cronograma de 9 semanas. |
| Aplicar todas las actividades resulta excesivo en 9 semanas | Media | El Inception se ejecuta en semana 6. Las semanas 7-15 son construcción y validación, no Inception. |
| El MVP definido sigue siendo demasiado ambicioso | Alta | El Sequencer obliga a definir MVP1 mínimo. Si MVP1 no es defendible aislado, se rompe en MVPs más pequeños. |
| Las personas y jornadas resultan artificiales por no tener usuarios reales | Media | Se documenta explícitamente que las personas son **arquetipos hipotéticos** para guiar el diseño, no usuarios validados empíricamente. Esto es honesto y defendible. |


