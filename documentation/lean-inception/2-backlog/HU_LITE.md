# Historias de Usuario — Versión de lectura humana

> Documento de lectura humana del Product Backlog del proyecto CerebroVial. Contiene las 21 Historias de Usuario en formato corto, pensado para una pasada de lectura en menos de una hora.
>
> Las versiones canónicas con criterios de aceptación numerados con código, sustrato técnico inglobado, notas técnicas extensas y candidatos a requisitos no funcionales viven en los documentos `HU_BLOQUE_A.md` a `HU_BLOQUE_F.md` y `HU_MVP2.md`. Para una vista panorámica del producto sin entrar en criterios de aceptación, consultar `BACKLOG_OVERVIEW.md`.
>
> **Convenciones:** cabecera Como/Quiero/Para por cada HU, descripción breve, hasta siete criterios de aceptación en Gherkin. Sin referencias cruzadas entre HUs, sin distinción de versión MVP, sin notas técnicas ni listados de requisitos no funcionales. Las menciones a vocabulario del producto (Operador, Gerente, Administrador, motor adaptativo, modo degradado) no son referencias documentales.

---

## HU-01 — Acceso diferenciado por rol

**Como** Operador de Tráfico Municipal, Gerente de Tránsito Municipal o Administrador del Sistema,
**quiero** acceder únicamente a las funcionalidades correspondientes a mi rol,
**para** concentrarme en mis responsabilidades específicas sin la carga cognitiva de información ajena a mi trabajo.

### Descripción

El sistema implementa control de acceso basado en roles con tres roles diferenciados. Cada Persona del producto accede únicamente a las vistas y endpoints que corresponden a su rol operativo. Esto preserva un contexto cognitivo apropiado para cada Persona y previene exposición indebida de información o funcionalidades fuera del rol asignado.

### Criterios de aceptación

1. **Dado** que un usuario con rol Operador inicia sesión correctamente,
   **cuando** ingresa al sistema,
   **entonces** visualiza únicamente las vistas de monitoreo en tiempo real y no puede acceder a vistas de reportería ejecutiva ni de configuración técnica.

2. **Dado** que un usuario con rol Gerente inicia sesión correctamente,
   **cuando** ingresa al sistema,
   **entonces** visualiza únicamente las vistas de reportería ejecutiva y no puede acceder a vistas de monitoreo operativo ni de configuración técnica.

3. **Dado** que un usuario con rol Administrador inicia sesión correctamente,
   **cuando** ingresa al sistema,
   **entonces** visualiza únicamente las vistas de configuración y salud del sistema y no puede acceder a vistas operativas ni ejecutivas.

4. **Dado** que un usuario autenticado solicita vía API un endpoint que no corresponde a su rol,
   **cuando** la solicitud llega al backend,
   **entonces** el sistema responde con HTTP 403 sin revelar información del recurso solicitado.

5. **Dado** que un usuario no ha iniciado sesión,
   **cuando** intenta acceder a cualquier vista del sistema,
   **entonces** el sistema lo redirige a la pantalla de login.

6. **Dado** que la sesión de un usuario ha expirado,
   **cuando** realiza una acción que requiere autenticación,
   **entonces** el sistema lo desconecta y lo redirige a la pantalla de login con un mensaje informativo.

---

## HU-02 — Monitoreo del estado actual de la intersección

**Como** Operador de Tráfico Municipal,
**quiero** visualizar en tiempo real el flujo vehicular y la longitud de cola en cada acceso de la intersección,
**para** detectar de inmediato condiciones anómalas y reaccionar antes de que escalen.

### Descripción

El Operador abre la vista de monitoreo y consulta, para cada acceso de la intersección, el flujo vehicular del último intervalo y la longitud de cola actual. La vista se actualiza automáticamente conforme llegan nuevas mediciones. Cada longitud de cola muestra un indicador de color (verde, amarillo o rojo) según los umbrales configurados.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión,
   **cuando** ingresa a la vista de monitoreo,
   **entonces** el sistema muestra el flujo vehicular y la longitud de cola por cada acceso de la intersección.

2. **Dado** que el sistema recibe una nueva medición del tráfico,
   **cuando** la medición se procesa,
   **entonces** la vista se actualiza con los nuevos valores en un plazo máximo de cinco segundos sin requerir recarga manual.

3. **Dado** que la longitud de cola de un acceso supera el umbral configurado como "alto",
   **cuando** la vista renderiza ese acceso,
   **entonces** el indicador de cola se muestra en color rojo.

4. **Dado** que la longitud de cola de un acceso supera el umbral configurado como "moderado" sin alcanzar el de "alto",
   **cuando** la vista renderiza ese acceso,
   **entonces** el indicador de cola se muestra en color amarillo.

5. **Dado** que el sistema deja de recibir mediciones por cualquier causa,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema muestra los últimos valores conocidos marcados como "desactualizados" e indica el tiempo transcurrido desde la última actualización.

---

## HU-03 — Visualización de predicción de congestión a corto plazo

**Como** Operador de Tráfico Municipal,
**quiero** visualizar la predicción del nivel de congestión en los próximos minutos para cada acceso de la intersección,
**para** anticiparme a la formación de congestión y disponer de tiempo de reacción antes de que el problema se materialice.

### Descripción

El Operador consulta la vista de predicción y observa, para cada acceso de la intersección, el nivel de congestión proyectado en el horizonte futuro configurado por el sistema. La predicción se expresa en una escala ordinal de cero a cinco donde cero corresponde a flujo libre y cinco corresponde a vía cerrada. La vista se actualiza automáticamente conforme llegan nuevas predicciones del sistema.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión y existe un horizonte de predicción configurado,
   **cuando** ingresa a la vista de predicción,
   **entonces** el sistema muestra, por cada acceso de la intersección, el nivel de congestión predicho en escala cero a cinco proyectado hasta el horizonte configurado.

2. **Dado** que el sistema genera una nueva predicción,
   **cuando** la predicción se completa,
   **entonces** la vista se actualiza con los nuevos valores en un plazo máximo de cinco segundos sin requerir recarga manual.

3. **Dado** que para algún acceso el nivel predicho supera el umbral de congestión configurado,
   **cuando** la vista renderiza ese acceso,
   **entonces** el acceso se resalta visualmente para alertar al Operador del problema anticipado.

4. **Dado** que el sistema deja temporalmente de generar predicciones por cualquier causa,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema muestra las últimas predicciones conocidas marcadas como "no confirmadas" e indica el tiempo transcurrido desde la última confirmación.

---

## HU-04 — Vista combinada del estado actual y la predicción de tráfico

**Como** Operador de Tráfico Municipal,
**quiero** ver en una sola pantalla el estado actual del tráfico y la predicción a corto plazo de manera integrada,
**para** comparar visualmente lo que está pasando con lo que va a pasar sin cambiar de vista, y detectar discrepancias o tendencias antes de actuar.

### Descripción

El Operador accede a una vista única que integra dos fuentes de información: las variables observadas del tráfico (flujo y cola) y la predicción del nivel de congestión proyectado al horizonte configurado. La integración visual permite identificar tres situaciones operativas: convergencia esperable (estado actual malo y predicción confirma), divergencia preocupante (estado actual normal pero predicción anticipa congestión) y divergencia tranquilizadora (estado actual tenso pero predicción anticipa alivio).

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión,
   **cuando** ingresa a la vista combinada,
   **entonces** el sistema muestra en una misma pantalla, por cada acceso de la intersección, el estado actual del tráfico y el nivel de congestión predicho, organizados de manera que el Operador pueda comparar "ahora" y "futuro" de un vistazo.

2. **Dado** que para algún acceso el nivel predicho supera el umbral de congestión configurado mientras el estado actual está dentro de la normalidad,
   **cuando** la vista renderiza ese acceso,
   **entonces** el sistema resalta visualmente la discrepancia para llamar la atención del Operador sobre la divergencia.

3. **Dado** que llega una nueva medición del estado actual o una nueva predicción,
   **cuando** el dato se procesa,
   **entonces** los elementos correspondientes se actualizan automáticamente en un plazo máximo de cinco segundos, manteniendo la alineación temporal entre "ahora" y "futuro".

4. **Dado** que el sistema deja temporalmente de recibir mediciones del estado actual o de generar predicciones,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema indica visualmente cuál de las dos fuentes está desactualizada o no confirmada e informa el tiempo transcurrido desde la última actualización de cada una de forma independiente.

---

## HU-05 — Visualización de la estrategia de control activa

**Como** Operador de Tráfico Municipal,
**quiero** visualizar cuál es la estrategia de control que el sistema está aplicando actualmente en la intersección y sus parámetros activos,
**para** entender qué decisión de control automático está vigente en cada momento y evaluar si es coherente con el estado del tráfico que observo.

### Descripción

El sistema selecciona automáticamente entre múltiples estrategias de control semafórico según el estado predicho y observado del tráfico. El Operador necesita saber qué estrategia está aplicándose en este momento y con qué parámetros para trazabilidad operativa y para evaluar la coherencia percibida del control automático con la situación que él mismo observa. El panel muestra el nombre legible de la estrategia vigente, los tiempos de verde asignados a cada acceso, y el momento en que la estrategia se activó.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión y el sistema tiene una estrategia de control vigente,
   **cuando** ingresa al panel de la estrategia activa,
   **entonces** el sistema muestra el nombre de la estrategia actualmente aplicada y los tiempos de verde asignados a cada acceso de la intersección.

2. **Dado** que el sistema tiene una estrategia vigente,
   **cuando** el sistema renderiza el panel,
   **entonces** también muestra la marca de tiempo en que la estrategia se activó, permitiendo al Operador conocer cuánto tiempo lleva aplicándose.

3. **Dado** que el sistema cambia la estrategia activa o ajusta sus parámetros,
   **cuando** el cambio se materializa,
   **entonces** los valores mostrados se actualizan automáticamente en un plazo máximo de cinco segundos sin requerir recarga manual.

4. **Dado** que el sistema no puede determinar la estrategia vigente por cualquier causa,
   **cuando** el Operador consulta el panel,
   **entonces** el sistema mantiene en pantalla la última estrategia conocida marcada como "no confirmada" e indica el tiempo transcurrido desde la última confirmación.

---

## HU-06 — Explicación de la razón de selección de estrategia

**Como** Operador de Tráfico Municipal,
**quiero** leer una explicación breve y comprensible de por qué el sistema seleccionó la estrategia de control que está aplicando actualmente,
**para** confiar en las decisiones automáticas del sistema y justificar ante terceros por qué se está aplicando una determinada configuración de control.

### Descripción

Un sistema que toma decisiones automáticas sin explicarlas erosiona la confianza del Operador y compromete la auditabilidad operativa. Esta vista presenta un texto breve y comprensible que comunica al Operador la razón por la que el sistema seleccionó la estrategia vigente, en lenguaje del dominio del tráfico. El texto se construye a partir de plantillas predefinidas con sustitución de variables del estado observado en el momento de la decisión (longitud de cola, flujo, dirección afectada), suficientes para que el Operador entienda la razón sin requerir conocimiento técnico del sistema interno.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión y existe una estrategia vigente,
   **cuando** ingresa al panel de explicación,
   **entonces** el sistema muestra un texto breve que describe la razón por la que la estrategia actual fue seleccionada, incluyendo los valores del estado del tráfico que dispararon esa selección.

2. **Dado** que el sistema cambia la estrategia activa,
   **cuando** el cambio se materializa,
   **entonces** la explicación se actualiza automáticamente para reflejar la razón de la nueva selección, en un plazo máximo de cinco segundos.

3. **Dado** que la combinación específica de estrategia y condición disparadora no tiene plantilla predefinida en el catálogo,
   **cuando** el sistema renderiza la explicación,
   **entonces** muestra un texto genérico que indica al menos la estrategia activa y los valores del estado relevantes, sin dejar el panel vacío.

4. **Dado** que el componente que produce la explicación deja de responder por cualquier causa,
   **cuando** el Operador consulta el panel,
   **entonces** el sistema mantiene en pantalla la última explicación conocida marcada como "no confirmada" e indica el tiempo transcurrido desde la última confirmación.

---

## HU-07 — Notificación de cambios de estrategia del motor

**Como** Operador de Tráfico Municipal,
**quiero** recibir una notificación visual inmediata cada vez que el sistema cambia la estrategia de control activa,
**para** enterarme del cambio en el momento exacto en que ocurre aunque mi atención esté en otra parte del dashboard, y poder evaluar si la transición es coherente con lo que estoy observando.

### Descripción

Existe una diferencia operativa importante entre consultar el estado de la estrategia y enterarse de que cambió. Sin una notificación activa, el Operador podría no notar un cambio hasta varios minutos después de ocurrido, lo cual degrada su capacidad de supervisión. Esta vista provee una notificación visual temporal y poco intrusiva que aparece al ocurrir el cambio, contiene la información mínima para entender qué pasó (hora, estrategia anterior, estrategia nueva, razón breve) y desaparece sola tras unos segundos sin requerir acción del Operador.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión y tiene cualquier vista del sistema abierta,
   **cuando** el sistema cambia la estrategia de control activa,
   **entonces** se muestra una notificación visual temporal que indica la hora del cambio, la estrategia anterior, la estrategia nueva y una razón breve.

2. **Dado** que se está mostrando una notificación de cambio de estrategia,
   **cuando** transcurre el tiempo configurado de auto-descarte,
   **entonces** la notificación desaparece automáticamente sin requerir acción del Operador.

3. **Dado** que el sistema cambia de estrategia múltiples veces dentro de un intervalo corto configurado,
   **cuando** ocurren cambios consecutivos en ese intervalo,
   **entonces** el sistema agrupa las notificaciones en una sola entrada acumulada en lugar de generar una notificación por cada cambio.

4. **Dado** que el Operador está viendo cualquier vista del sistema,
   **cuando** se dispara una notificación,
   **entonces** se muestra de forma visible sin interferir con la lectura de los paneles principales y sin bloquear contenido.

5. **Dado** que el canal de entrega de notificaciones está caído por cualquier causa,
   **cuando** el Operador consulta el sistema,
   **entonces** existe un indicador visual persistente que comunica que la entrega de notificaciones está degradada, para que el Operador no asuma que la ausencia de notificaciones significa ausencia de cambios.

---

## HU-08 — Consulta del historial de decisiones del motor

**Como** Operador de Tráfico Municipal,
**quiero** consultar cronológicamente las decisiones que el sistema tomó en periodos pasados con su razón y parámetros,
**para** reconstruir lo ocurrido durante mi turno o turnos anteriores, investigar incidentes reportados y disponer de evidencia auditable de la operación.

### Descripción

El Operador accede al historial y consulta una lista paginada de decisiones del motor adaptativo en orden cronológico inverso. Cada entrada muestra cuándo se tomó la decisión, qué estrategia de control se aplicó, qué estrategia había antes, la razón de la selección en lenguaje legible y los parámetros vigentes en ese momento. El Operador puede filtrar por rango de fechas, por estrategia, o por ambos. Las entradas del historial son inmutables una vez registradas.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión,
   **cuando** ingresa al historial de decisiones por primera vez en la sesión,
   **entonces** el sistema muestra las decisiones de las últimas veinticuatro horas ordenadas de la más reciente a la más antigua.

2. **Dado** que el Operador consulta una entrada del historial,
   **cuando** el sistema renderiza esa entrada,
   **entonces** muestra marca de tiempo, estrategia aplicada, estrategia anterior, razón de la selección y parámetros vigentes al momento de la decisión.

3. **Dado** que el historial contiene más entradas de las que caben en una página,
   **cuando** el Operador navega entre páginas,
   **entonces** el sistema carga la siguiente página sin recargar el historial completo y preservando los filtros activos.

4. **Dado** que el Operador aplica un filtro por rango de fechas, por estrategia o por ambos,
   **cuando** confirma el filtro,
   **entonces** el sistema muestra únicamente las decisiones que cumplen el filtro combinado, manteniendo el orden cronológico inverso y la paginación.

5. **Dado** que el motor toma una decisión y el componente de persistencia del historial no responde momentáneamente,
   **cuando** la decisión se aplica al semáforo,
   **entonces** el sistema aplica la decisión al control del tráfico sin interrumpirse y encola el registro para persistirlo cuando la persistencia vuelva a estar disponible.

6. **Dado** que existe una entrada registrada en el historial,
   **cuando** cualquier usuario intenta modificarla,
   **entonces** el sistema rechaza la modificación y la entrada permanece inalterada.

---

## HU-09 — Registro de notas e incidencias del turno

**Como** Operador de Tráfico Municipal,
**quiero** registrar notas o incidencias durante mi turno y consultarlas posteriormente,
**para** dejar constancia escrita de eventos relevantes que observé y poder revisarlas yo mismo o transmitirlas al siguiente turno.

### Descripción

Durante un turno de operación, el Operador observa eventos que no están capturados automáticamente por el sistema: accidentes, comportamientos inusuales, eventos masivos, decisiones del motor que parecen incoherentes con la situación observada, u otros. Esta vista provee un módulo simple de registro de notas en texto libre asociadas a un momento. Cada nota se persiste con la marca de tiempo de creación y la identidad del Operador autor. Todos los Operadores ven todas las notas, sosteniendo el caso de uso de transmisión entre turnos.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión,
   **cuando** crea una nota mediante un formulario con texto libre,
   **entonces** el sistema persiste la nota con su contenido, la marca de tiempo de creación y la identidad del Operador autor.

2. **Dado** que existen notas registradas,
   **cuando** el Operador accede a la vista de notas,
   **entonces** el sistema muestra el listado en orden cronológico inverso con paginación, mostrando por cada nota la marca de tiempo, el autor y el texto truncado con opción de expandir.

3. **Dado** que el Operador aplica un filtro por rango de fechas, por autor, o por ambos,
   **cuando** confirma el filtro,
   **entonces** el listado se limita a las notas que cumplen el filtro combinado, manteniendo el orden cronológico inverso y la paginación.

4. **Dado** que el Operador creó una nota con error y aún se encuentra dentro de la ventana de edición configurada posterior a su creación,
   **cuando** edita la nota,
   **entonces** el sistema permite la modificación y registra la marca de tiempo de la edición adicional a la marca de tiempo original. Pasada la ventana de edición, la nota queda inmutable.

5. **Dado** que el sistema persiste una nota y ocurre un fallo temporal en la escritura,
   **cuando** el Operador confirma el envío,
   **entonces** el sistema informa al Operador que la nota no se guardó, preserva el contenido escrito en el formulario y le permite reintentar.

---

## HU-10 — Alerta activa transversal del estado operativo del sistema

**Como** Operador de Tráfico Municipal,
**quiero** recibir una alerta visual persistente y transversal cuando el sistema entra en un estado operativo degradado o de falla total, independientemente de la vista que esté usando,
**para** saber en todo momento si el sistema está operando con capacidades completas, reducidas, o si dejó de operar, y poder ajustar mi supervisión y escalar cuando corresponda.

### Descripción

Cuando el sistema opera con todos sus componentes activos, está en operación normal y no hay alerta. Cuando algún componente falla, el sistema entra en un estado degradado (nivel uno, dos o tres) o en falla total. En cualquiera de esos estados no normales, una alerta visible aparece en la parte superior del dashboard del Operador, persistente y consistente en todas las vistas. Cada estado se distingue por color, icono y texto descriptivo. El Operador puede reconocer las alertas de los tres niveles degradados, lo que colapsa el banner a una forma discreta pero todavía visible; la alerta de falla total no se puede reconocer hasta que el sistema sea restablecido. Cualquier escalada a un estado más severo restaura automáticamente el banner a su forma prominente.

### Criterios de aceptación

1. **Dado** que el sistema opera en estado normal,
   **cuando** el Operador consulta cualquier vista,
   **entonces** no se muestra alerta del estado operativo del sistema.

2. **Dado** que el sistema transita desde operación normal a un estado degradado de cualquier nivel,
   **cuando** la transición se materializa,
   **entonces** el sistema muestra una alerta visual persistente en la parte superior del dashboard, visible desde cualquier vista, con estilo distintivo según el nivel y texto identificable del estado actual.

3. **Dado** que el sistema transita a falla total,
   **cuando** la transición se materializa,
   **entonces** el sistema muestra una alerta visual persistente claramente diferenciada de los estados degradados que comunica "sistema fuera de operación". Esta alerta no puede reconocerse y permanece en forma prominente hasta que el sistema retorne a un estado operativo.

4. **Dado** que se muestra una alerta degradada en forma prominente y el Operador la reconoce,
   **cuando** confirma el reconocimiento,
   **entonces** el banner se colapsa a una forma discreta pero todavía visible, y el sistema registra el reconocimiento con la identidad del Operador y la marca de tiempo.

5. **Dado** que existe una alerta degradada en estado reconocido y el sistema escala a un estado más severo o a falla total,
   **cuando** la escalada se materializa,
   **entonces** el banner vuelve automáticamente a su forma prominente sin requerir acción del Operador.

6. **Dado** que el sistema retorna desde un estado degradado o de falla total a operación normal,
   **cuando** la transición se materializa,
   **entonces** la alerta desaparece automáticamente del dashboard sin requerir acción del Operador.

7. **Dado** que el sistema cambia de estado operativo,
   **cuando** la transición se materializa,
   **entonces** el sistema persiste de forma durable e inmutable la transición con marca de tiempo, estado anterior, estado nuevo y causa raíz, aunque la persistencia ocurra después si el registro está temporalmente indisponible. La operación del sistema no se detiene por fallos del registro de auditoría.

---

## HU-11 — Vista del estado operativo de los componentes del sistema

**Como** Operador de Tráfico Municipal,
**quiero** consultar en una vista dedicada el estado operativo actual de cada componente del sistema en términos del impacto sobre mi operación,
**para** identificar rápidamente qué componente está afectando la operación cuando el sistema entra en estado degradado o de falla, y confirmar proactivamente que todos los componentes operan bien cuando no hay alertas.

### Descripción

La vista lista los componentes del sistema con nombres legibles ("Detección de tráfico", "Predicción de congestión", "Motor de decisión", "Tiempos de respaldo", "Registro de eventos") junto con un estado cualitativo de tres niveles (OK, Degradado, Fuera de servicio). Cuando un componente no está en estado OK, se acompaña de una descripción breve en lenguaje no técnico del efecto operativo de esa condición. La vista es accesible permanentemente desde la navegación principal y se actualiza automáticamente conforme cambia el estado de los componentes.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión,
   **cuando** ingresa a la vista de estado de componentes,
   **entonces** el sistema muestra una lista de los componentes con impacto operativo, cada uno con su nombre legible, una breve descripción de su función y su estado operativo actual (OK, Degradado o Fuera de servicio).

2. **Dado** que un componente cambia de estado operativo,
   **cuando** el cambio se materializa,
   **entonces** el estado mostrado se actualiza automáticamente en un plazo máximo de cinco segundos sin requerir recarga manual.

3. **Dado** que un componente está en estado Degradado o Fuera de servicio,
   **cuando** el Operador consulta su entrada,
   **entonces** el sistema muestra junto al estado un texto breve en lenguaje no técnico que describe el efecto operativo de esa condición.

4. **Dado** que todos los componentes están en estado OK,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema muestra cada componente con estado OK sin ocultarlos ni colapsarlos, para que el Operador pueda confirmar visualmente que el sistema completo está sano.

5. **Dado** que uno o más componentes están en estado Degradado o Fuera de servicio,
   **cuando** la vista se renderiza,
   **entonces** las entradas correspondientes se resaltan visualmente mediante color y posición destacada para que sean identificables de un vistazo.

6. **Dado** que la fuente que provee los estados de componentes deja temporalmente de responder,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema mantiene en pantalla los últimos estados conocidos marcados como "no confirmados" e indica el tiempo transcurrido desde la última confirmación.

---

## HU-12 — Explicación del modo degradado activo y sus implicaciones operativas

**Como** Operador de Tráfico Municipal,
**quiero** leer una explicación comprensible de qué significa el modo degradado activo, qué está haciendo el sistema en respuesta y qué debo cambiar en mi forma de supervisar,
**para** ajustar mi forma de trabajar mientras dure la condición y entender cuándo escalar al Administrador.

### Descripción

La alerta transversal del sistema comunica que el sistema entró en un estado operativo no normal y lo identifica por nivel. La vista de estado de componentes le permite localizar qué pieza está afectada. Esta vista completa la información operativa entregando un texto compuesto que integra tres elementos: qué disparó el modo degradado, qué fallback está activo y qué capacidad operativa se perdió con su implicación para la supervisión. El texto se construye a partir de plantillas predefinidas por combinación de componente disparador y nivel de degradación.

### Criterios de aceptación

1. **Dado** que el Operador ha iniciado sesión y el sistema está operando en estado degradado o de falla total,
   **cuando** el Operador accede a la explicación del modo degradado activo,
   **entonces** el sistema muestra un texto compuesto que integra el componente o condición que disparó el modo, el fallback aplicado en respuesta, y la capacidad operativa perdida con su implicación para la supervisión.

2. **Dado** que el sistema cambia entre estados operativos no normales,
   **cuando** la transición se materializa,
   **entonces** la explicación se actualiza automáticamente para reflejar el modo vigente, en un plazo máximo de cinco segundos.

3. **Dado** que el sistema retorna a operación normal,
   **cuando** la transición se materializa,
   **entonces** la explicación deja de mostrarse automáticamente sin requerir acción del Operador.

4. **Dado** que la combinación específica de componente disparador y nivel de degradación no tiene plantilla en el catálogo,
   **cuando** el sistema renderiza la explicación,
   **entonces** muestra un texto genérico de respaldo que indica al menos el nivel del modo degradado vigente y el componente afectado si está disponible, sin dejar el panel vacío.

5. **Dado** que el componente que produce la explicación deja de responder por cualquier causa,
   **cuando** el Operador consulta la vista,
   **entonces** el sistema mantiene en pantalla la última explicación conocida marcada como "no confirmada" e indica el tiempo transcurrido desde la última confirmación.

---

## HU-13 — Vista técnica de salud de los componentes del sistema

**Como** Administrador del Sistema,
**quiero** consultar en una vista dedicada el estado técnico detallado de cada componente del sistema con métricas de respuesta, indicadores de fallos recientes y marcas de tiempo precisas,
**para** diagnosticar rápidamente la causa raíz de un comportamiento anómalo, priorizar qué componentes requieren intervención y mantener la salud técnica del sistema.

### Descripción

El Administrador requiere una vista técnica más profunda que la vista cualitativa del Operador. Esta vista presenta una tabla con una fila por componente y, en cada fila, muestra sin necesidad de interacción adicional: nombre legible, identificador interno, estado cualitativo, latencia de la última evaluación de salud, indicador de fallos recientes (evaluaciones fallidas en una ventana temporal configurable), marca de tiempo del último cambio de estado y marca de tiempo de la última evaluación de salud exitosa. La vista es exclusivamente consultiva; no provee acciones correctivas.

### Criterios de aceptación

1. **Dado** que el Administrador ha iniciado sesión,
   **cuando** ingresa a la vista de salud técnica de componentes,
   **entonces** el sistema muestra una entrada por cada componente monitoreado con nombre legible, identificador interno, estado cualitativo, latencia de la última evaluación de salud, indicador de fallos recientes, marca de tiempo del último cambio de estado y marca de tiempo de la última evaluación exitosa.

2. **Dado** que el monitor de componentes detecta un cambio en cualquier componente,
   **cuando** el cambio se materializa,
   **entonces** los valores mostrados se actualizan automáticamente en un plazo máximo de cinco segundos sin requerir recarga manual.

3. **Dado** que algún componente está en estado Degradado o Fuera de servicio,
   **cuando** la vista se renderiza,
   **entonces** las filas correspondientes se resaltan visualmente para que sean identificables de un vistazo, conservando la riqueza técnica de los demás campos.

4. **Dado** que el monitor de componentes deja de responder por cualquier causa,
   **cuando** el Administrador consulta la vista,
   **entonces** el sistema mantiene en pantalla los últimos valores conocidos marcados como "no confirmados" e indica el tiempo transcurrido desde la última evaluación recibida.

5. **Dado** que un componente nunca ha respondido a una evaluación de salud desde el arranque del sistema,
   **cuando** el Administrador consulta la vista,
   **entonces** ese componente aparece en estado Fuera de servicio con latencia y marca de última evaluación exitosa explícitamente como "sin datos", no como cero ni como timestamp vacío.

---

## HU-14 — Vista de métricas de desempeño del modelo predictivo

**Como** Administrador del Sistema,
**quiero** consultar las métricas de desempeño del modelo predictivo del sistema, comparando sus predicciones recientes contra los niveles de congestión que efectivamente ocurrieron,
**para** evaluar si el modelo sigue siendo confiable, detectar oportunamente una posible degradación y sustentar con datos la decisión de mantener el modelo activo o considerar su sustitución.

### Descripción

El modelo predictivo del sistema genera predicciones de congestión que el Operador consume en tiempo real y que el motor adaptativo utiliza para decidir. Su confiabilidad es central para el funcionamiento. Esta vista presenta cuatro métricas estándar de evaluación calculadas sobre una ventana temporal reciente: error absoluto medio sobre el ratio continuo predicho, raíz del error cuadrático medio sobre el mismo ratio, exactitud sobre el nivel discreto de cero a cinco, y matriz de confusión seis por seis del nivel discreto con la convención filas igual a real observado y columnas igual a predicho. Cada métrica incluye un icono de ayuda con su definición operacional autocontenida.

### Criterios de aceptación

1. **Dado** que el modelo predictivo genera una predicción para un horizonte futuro,
   **cuando** la predicción se entrega a sus consumidores,
   **entonces** el sistema persiste de forma durable y auditable la predicción con marca de tiempo de generación, marca de tiempo del horizonte, valor predicho del ratio continuo y nivel discreto correspondiente.

2. **Dado** que ha transcurrido el horizonte de una predicción registrada y el sistema dispone de la observación real,
   **cuando** la observación se asocia,
   **entonces** el sistema agrega al registro el valor real del ratio continuo y el nivel discreto real observado, sin modificar los campos previamente escritos.

3. **Dado** que el Administrador ha iniciado sesión,
   **cuando** ingresa a la vista de métricas del modelo predictivo,
   **entonces** el sistema muestra los cuatro elementos (error absoluto medio, raíz del error cuadrático medio, exactitud y matriz de confusión) calculados sobre la ventana temporal vigente.

4. **Dado** que el Administrador consulta la matriz de confusión,
   **cuando** la matriz se renderiza,
   **entonces** las filas corresponden al nivel real observado y las columnas al nivel predicho, la diagonal principal se distingue visualmente de las celdas fuera de la diagonal, y un control visible permite alternar la presentación entre valores absolutos y porcentajes por fila.

5. **Dado** que el Administrador activa el icono de ayuda de cualquier métrica,
   **cuando** el sistema responde,
   **entonces** muestra una explicación breve y autocontenida de cómo interpretar la métrica sin requerir consulta a documentación externa.

6. **Dado** que la ventana temporal vigente no contiene predicciones con observación asociada,
   **cuando** el Administrador consulta la vista,
   **entonces** el sistema comunica explícitamente "no hay datos suficientes para calcular métricas en esta ventana" sin mostrar valores en cero.

7. **Dado** que el componente de cálculo de métricas deja de responder por cualquier causa,
   **cuando** el Administrador consulta la vista,
   **entonces** el sistema muestra las últimas métricas calculadas marcadas como "no actualizadas" e indica el tiempo transcurrido desde el último cálculo exitoso.

---

## HU-15 — Configuración de parámetros operativos del sistema

**Como** Administrador del Sistema,
**quiero** configurar los parámetros operativos del sistema desde una vista dedicada, organizados por familia de comportamiento, con persistencia de los cambios y registro de auditoría de cada modificación,
**para** ajustar el comportamiento del sistema a las condiciones reales sin redespliegue, manteniendo trazabilidad de quién cambió qué y cuándo, y pudiendo restaurar configuraciones de referencia si una modificación produce resultados no deseados.

### Descripción

El sistema tiene parámetros operativos cuyo valor depende de las condiciones reales de la intersección y requieren ajuste periódico. Esta vista organiza los parámetros en tres familias funcionales (visualización del estado del tráfico, predicción y evaluación del modelo, monitor de salud del sistema), muestra los valores actuales, permite modificarlos con validación de rangos en tiempo real, persiste los cambios para que apliquen en operación sin reinicio, mantiene un registro auditable de cada modificación con autor y marca de tiempo, y ofrece una acción explícita de "restaurar valores por defecto" para volver a configuración segura conocida.

### Criterios de aceptación

1. **Dado** que el Administrador ha iniciado sesión,
   **cuando** ingresa a la vista de configuración,
   **entonces** el sistema muestra los parámetros organizados en tres secciones visualmente distinguibles ("Visualización del estado del tráfico", "Predicción y evaluación del modelo" y "Monitor de salud del sistema"), cada parámetro con su nombre legible, valor actual, unidad cuando aplique y marca de tiempo de la última modificación.

2. **Dado** que el Administrador edita el valor de uno o varios parámetros,
   **cuando** ingresa los nuevos valores,
   **entonces** el sistema valida en tiempo real que cumplan los rangos válidos documentados y rechaza con mensaje claro los valores fuera de rango antes de permitir el envío.

3. **Dado** que el Administrador modificó parámetros válidos y solicita guardar,
   **cuando** el sistema persiste los cambios,
   **entonces** registra una entrada de auditoría por cada parámetro modificado con marca de tiempo, identidad del Administrador, nombre del parámetro, valor anterior y valor nuevo, y confirma visualmente que la modificación fue exitosa.

4. **Dado** que un parámetro recién persistido afecta el comportamiento de un componente en operación,
   **cuando** la modificación se completa,
   **entonces** el componente afectado consume el nuevo valor sin requerir reinicio del sistema, en un plazo máximo de treinta segundos desde la persistencia.

5. **Dado** que el Administrador solicita consultar el historial de cambios de los parámetros,
   **cuando** activa el control correspondiente,
   **entonces** el sistema muestra el listado en orden cronológico inverso con marca de tiempo, autor, parámetro afectado, valor anterior y valor nuevo de cada modificación.

6. **Dado** que el Administrador quiere volver a configuración segura conocida tras una modificación reciente,
   **cuando** activa "Restaurar valores por defecto" y confirma la acción,
   **entonces** el sistema sustituye los valores actuales por los valores por defecto documentados y registra la restauración como una modificación en el registro de auditoría.

7. **Dado** que el componente de persistencia de parámetros deja de responder por cualquier causa,
   **cuando** el Administrador consulta o intenta modificar la configuración,
   **entonces** el sistema indica explícitamente la indisponibilidad temporal, muestra los últimos valores conocidos marcados como "no confirmados" y bloquea las acciones de modificación hasta que el componente vuelva a responder.

---

## HU-16 — Consulta de indicadores agregados sobre periodo seleccionable

**Como** Gerente de Tránsito Municipal,
**quiero** consultar en una vista única los indicadores agregados de desempeño del control de tráfico sobre un periodo que yo selecciono, viendo tanto el valor agregado de cada indicador como su evolución a lo largo del periodo,
**para** evaluar la eficiencia del sistema en periodos prolongados, identificar tendencias y sustentar decisiones estratégicas con datos cuantitativos.

### Descripción

La vista presenta cuatro indicadores principales sobre un periodo seleccionado por el Gerente: tiempo promedio de espera por vehículo (en segundos), longitud máxima de cola por dirección (en número de vehículos), throughput de la intersección (en vehículos por hora), y demora promedio acumulada por vehículo (en segundos). Cada indicador se muestra como una tarjeta con el valor agregado y un gráfico temporal de evolución con granularidad adaptativa al periodo. El selector de periodo ofrece cinco modos: esta semana, semana anterior, este mes, mes anterior y rango personalizado. Las tarjetas de tiempo promedio de espera y longitud máxima de cola admiten alternar entre presentación agregada y disgregada por dirección de entrada.

### Criterios de aceptación

1. **Dado** que el Gerente ha iniciado sesión y accede a la vista por primera vez en la sesión,
   **cuando** la vista se carga,
   **entonces** el selector de periodo ofrece cinco opciones ("Esta semana", "Semana anterior", "Este mes", "Mes anterior" y "Rango personalizado") con "Esta semana" seleccionado por defecto, sin persistir entre sesiones la última selección.

2. **Dado** que el Gerente cambia el periodo seleccionado entre los presets o aplica un rango personalizado válido,
   **cuando** confirma la selección,
   **entonces** la vista recalcula automáticamente los cuatro indicadores y sus gráficos temporales para el nuevo periodo, mostrando un indicador de carga durante el recálculo.

3. **Dado** que el Gerente selecciona el modo "Rango personalizado",
   **cuando** ingresa las fechas,
   **entonces** la fecha de fin no puede ser anterior a la fecha de inicio y ninguna de las dos fechas puede situarse en el futuro respecto al momento actual; el recálculo de los indicadores se dispara solo cuando el Gerente activa explícitamente la aplicación del rango.

4. **Dado** que la vista termina de calcular los indicadores para un periodo confirmado,
   **cuando** el sistema renderiza la vista,
   **entonces** muestra cuatro tarjetas, una por indicador, cada una con su nombre, valor agregado destacado como número principal, unidad correspondiente, icono de ayuda activable que despliega la definición operacional, y gráfico temporal de la evolución del indicador a lo largo del periodo.

5. **Dado** que las tarjetas de "Tiempo promedio de espera" y "Longitud máxima de cola" admiten disgregación por dirección,
   **cuando** el Gerente activa el control correspondiente en cada tarjeta,
   **entonces** el sistema alterna la presentación entre el valor agregado y los valores por cada dirección de entrada de la intersección, dentro de la misma tarjeta sin abrir vistas adicionales.

6. **Dado** que el periodo seleccionado no contiene datos persistidos o contiene cobertura parcial,
   **cuando** la vista presenta los indicadores,
   **entonces** comunica explícitamente "no hay datos en el periodo seleccionado" cuando corresponde, o acompaña los valores calculados con la indicación visible del intervalo efectivamente cubierto cuando la cobertura es parcial.

7. **Dado** que el componente de persistencia del histórico o el motor de cálculo de indicadores deja de responder por cualquier causa,
   **cuando** el Gerente consulta la vista,
   **entonces** el sistema indica explícitamente la indisponibilidad temporal mostrando los últimos indicadores conocidos marcados como "no actualizados" e indicando el tiempo transcurrido desde el último cálculo exitoso.

---

## HU-17 — Vista comparativa entre periodos

**Como** Gerente de Tránsito Municipal,
**quiero** comparar los cuatro indicadores agregados de desempeño del control de tráfico entre el periodo que tengo seleccionado y el periodo previo equivalente, viendo simultáneamente la evolución temporal de ambos y la variación numérica entre ellos,
**para** identificar tendencias de mejora o deterioro entre periodos, justificar la inversión con datos comparativos y reportar a niveles superiores con evidencia de evolución.

### Descripción

La vista presenta cuatro paneles comparativos, uno por indicador, simultáneos en la vista. Cada panel integra tres elementos: dos series temporales superpuestas en el mismo gráfico (periodo actual y periodo previo equivalente, distinguidas por color y leyenda), los valores agregados de ambos periodos, y un indicador prominente de la variación porcentual entre los dos agregados. La variación se acompaña de una semántica visual que comunica si representa mejora o empeoramiento del desempeño según la naturaleza de cada indicador (disminución es mejora para tiempo de espera, longitud de cola y demora; aumento es mejora para throughput). El selector de periodo comparte estado con la vista de consulta de indicadores durante la sesión activa.

### Criterios de aceptación

1. **Dado** que el Gerente ha iniciado sesión y navega a la vista comparativa,
   **cuando** la vista se carga,
   **entonces** el selector refleja la última selección realizada en la sesión activa, con "Esta semana" como default si es la primera vista del Gerente en la sesión.

2. **Dado** que el Gerente cambia el periodo seleccionado,
   **cuando** confirma el cambio,
   **entonces** el sistema recalcula automáticamente ambos periodos (actual y previo equivalente) y actualiza los cuatro paneles comparativos.

3. **Dado** que la vista presenta los cuatro paneles comparativos,
   **cuando** el sistema renderiza cada panel,
   **entonces** incluye dos series temporales superpuestas con colores distinguibles y leyenda visible, los dos valores agregados, y un indicador prominente de la variación porcentual entre periodos.

4. **Dado** que el sistema renderiza el indicador de variación porcentual,
   **cuando** muestra la dirección del cambio,
   **entonces** el código visual comunica mejora o empeoramiento del desempeño según la naturaleza del indicador, mediante tres pistas redundantes simultáneas: signo numérico explícito, flecha direccional y color que distingue mejora de empeoramiento.

5. **Dado** que el Gerente activa el icono de ayuda de un panel comparativo,
   **cuando** el sistema responde,
   **entonces** muestra una explicación breve y autocontenida de la definición operacional del indicador.

6. **Dado** que el periodo previo equivalente no contiene datos persistidos, o que el agregado del periodo previo es cero (variación matemáticamente indefinida), o que alguno de los dos periodos tiene cobertura parcial,
   **cuando** el sistema presenta los paneles,
   **entonces** comunica explícitamente la situación al Gerente, mostrando los valores absolutos disponibles sin variación porcentual cuando esta no puede calcularse, y la cobertura efectiva cuando es parcial.

7. **Dado** que el motor de cálculo o la persistencia del histórico deja de responder por cualquier causa,
   **cuando** el Gerente consulta la vista,
   **entonces** el sistema indica explícitamente la indisponibilidad temporal mostrando los últimos resultados comparativos conocidos marcados como "no actualizados" simultáneamente en ambos periodos del panel.

---

## HU-18 — Vista detallada de periodo específico

**Como** Gerente de Tránsito Municipal,
**quiero** consultar el detalle integrado de lo ocurrido durante un periodo específico, viendo simultáneamente la evolución detallada del tráfico, las decisiones del control automático y los intervalos en que el sistema estuvo en cada estado operativo,
**para** investigar las causas de una variación importante detectada en las vistas agregadas, distinguir si responde a condiciones reales del tráfico, a cambios de estrategia automática o a periodos de operación degradada del sistema, y sustentar reportes a niveles superiores con evidencia detallada.

### Descripción

La vista integra tres carriles de información sobre una misma línea temporal que cubre el periodo seleccionado. El carril de evolución del tráfico muestra los cuatro indicadores observados con resolución temporal más fina que las vistas agregadas, con zoom interactivo que llega a la granularidad nativa. El carril de eventos del sistema de control muestra cada decisión del control automático como marcador activable que despliega su estrategia, razón y parámetros. El carril de estado operativo muestra como bandas coloreadas los intervalos durante los cuales el sistema estuvo en cada estado, activables para revelar la causa raíz. La correlación visual entre los tres carriles permite al Gerente distinguir explicaciones competidoras de una misma variación agregada. El acceso a la vista se ofrece desde las vistas agregadas del Gerente.

### Criterios de aceptación

1. **Dado** que el Gerente ha confirmado un periodo de análisis,
   **cuando** la vista termina de cargar,
   **entonces** el sistema muestra tres carriles sobre la misma línea temporal: evolución del tráfico (cuatro indicadores observados), eventos del control automático (marcadores por cada decisión registrada en el periodo), y estado operativo del sistema (bandas coloreadas por intervalo).

2. **Dado** que el Gerente quiere investigar un sub-intervalo con mayor resolución temporal,
   **cuando** ejecuta una acción de zoom sobre el carril de evolución del tráfico,
   **entonces** el sistema refina la resolución temporal sobre el sub-intervalo activo, alcanzando la granularidad nativa de treinta segundos al máximo nivel de zoom, sin afectar a los otros dos carriles.

3. **Dado** que el Gerente quiere consultar el detalle de una decisión visualizada como marcador,
   **cuando** activa el marcador,
   **entonces** el sistema despliega un popover compacto con marca de tiempo, estrategia aplicada, estrategia anterior, razón de la selección y parámetros activos aplicados.

4. **Dado** que el Gerente quiere consultar el detalle de un intervalo de estado operativo no normal,
   **cuando** activa la banda coloreada correspondiente,
   **entonces** el sistema despliega un popover compacto con estado operativo, componente o condición disparadora, marca de tiempo de inicio, marca de tiempo de fin (o "vigente" si aún no cerró) y duración del intervalo.

5. **Dado** que el Gerente quiere consultar la evolución del tráfico desglosada por dirección,
   **cuando** interactúa con el control de filtro de dirección visible en el carril de evolución del tráfico,
   **entonces** el sistema filtra los sub-gráficos a la dirección seleccionada o muestra simultáneamente las cuatro direcciones con código visual distinguible.

6. **Dado** que el periodo seleccionado no contiene datos en alguno de los tres carriles o tiene cobertura parcial,
   **cuando** la vista presenta cada carril,
   **entonces** comunica explícitamente "no hay datos en este periodo" sobre el carril vacío, o acompaña los datos parciales con indicación visible del intervalo efectivamente cubierto. Cada carril se evalúa independientemente de los otros dos.

7. **Dado** que cualquiera de los tres componentes que alimentan los carriles deja de responder por cualquier causa,
   **cuando** el Gerente consulta la vista,
   **entonces** el sistema marca como "no actualizado" únicamente el carril afectado, indicando el tiempo transcurrido desde la última confirmación, sin contaminar la lectura de los otros dos carriles.

---

## HU-19 — Exportación de reportes a PDF o Excel

**Como** Gerente de Tránsito Municipal,
**quiero** exportar el reporte del periodo que estoy consultando o la comparativa que estoy analizando a un formato presentable o a datos crudos, eligiendo el formato según el destino del reporte,
**para** comunicar mis hallazgos a niveles superiores y a otras áreas con artefactos transferibles fuera del sistema, sustentar reportes ejecutivos con evidencia descargable y permitir análisis ulterior sin requerir acceso al sistema.

### Descripción

La exportación se invoca desde cualquiera de las vistas agregadas del Gerente mediante un botón visible en posición consistente. Al activarlo, el Gerente elige entre PDF (formato presentable para reportar) y Excel (datos crudos para análisis); el sistema infiere automáticamente del contexto activo qué vista y qué periodo exportar. El PDF reproduce los indicadores y gráficos con la misma granularidad temporal de la vista interactiva, incluye definiciones operacionales autocontenidas y siempre presenta la disgregación por dirección donde aplica (el formato impreso no admite controles dinámicos). El Excel contiene dos hojas mínimas (resumen y detalle temporal) con metadatos del reporte al inicio y datos crudos procesables por herramientas analíticas externas. La generación no almacena reportes; cada exportación es una descarga directa con nombre informativo que identifica intersección, periodo y momento.

### Criterios de aceptación

1. **Dado** que el Gerente está consultando una vista agregada,
   **cuando** observa el área principal,
   **entonces** el sistema renderiza un botón visible "Exportar reporte" en posición consistente entre las vistas agregadas del Gerente.

2. **Dado** que el Gerente activa el botón "Exportar reporte",
   **cuando** interactúa con el control,
   **entonces** el sistema despliega un menú con dos opciones ("PDF" para formato presentable, "Excel" para datos crudos), infiere automáticamente la vista origen y el periodo del contexto activo, y muestra un indicador de carga visible durante la generación.

3. **Dado** que el Gerente eligió "PDF",
   **cuando** el sistema completa la generación,
   **entonces** el PDF resultante incluye encabezado con identificación del reporte, intersección, periodo cubierto, marca de tiempo de generación e identidad del Gerente; los cuatro indicadores con su valor agregado, su gráfico temporal y la disgregación por dirección cuando aplica; y al final una sección de definiciones operacionales autocontenidas.

4. **Dado** que el Gerente eligió "Excel",
   **cuando** el sistema completa la generación,
   **entonces** el archivo contiene al menos dos hojas (resumen con valores agregados y detalle temporal con la serie subyacente), cada hoja inicia con metadatos identificadores del reporte separados de los datos crudos por una fila vacía o separador conocido, y los datos crudos son procesables por herramientas analíticas externas sin extracción manual.

5. **Dado** que el sistema completa exitosamente la generación,
   **cuando** entrega el archivo,
   **entonces** lo ofrece mediante descarga directa del navegador con un nombre informativo que incluye tipo de reporte, intersección, periodo cubierto, marca de tiempo de generación y extensión correspondiente, sin almacenarlo en el servidor.

6. **Dado** que el periodo seleccionado no contiene datos o tiene cobertura parcial,
   **cuando** el sistema genera el reporte,
   **entonces** comunica explícitamente la situación en el reporte resultante ("no hay datos en el periodo seleccionado", o cobertura efectiva si es parcial) en lugar de presentar valores espurios o tablas vacías sin contexto.

7. **Dado** que la fuente que alimenta las vistas está caída por cualquier causa,
   **cuando** el Gerente activa la generación,
   **entonces** el sistema rechaza la generación, comunica al Gerente que el reporte no puede generarse en este momento, indica el tiempo transcurrido desde el último cálculo exitoso y ofrece reintentar más tarde.

---

## HU-20 — Comparativa de métricas del modelo predictivo contra modelo de respaldo

**Como** Administrador del Sistema,
**quiero** comparar simultáneamente las métricas de desempeño del modelo predictivo principal del sistema contra las del modelo de respaldo, sobre la misma ventana temporal de evaluación,
**para** sustentar con evidencia cuantitativa la decisión de mantener el modelo principal activo, detectar oportunamente si el modelo de respaldo está superando al principal sobre datos operacionales recientes y disponer de datos comparativos auditables.

### Descripción

El modelo de respaldo ejecuta predicciones en paralelo a las del modelo principal sobre los mismos inputs operativos durante toda la operación normal, sin servir como predictor activo del sistema. Ambas predicciones se persisten para que la comparativa se calcule sobre exactamente los mismos eventos. La vista presenta cuatro paneles, uno por métrica (error absoluto medio, raíz del error cuadrático medio, exactitud, matriz de confusión), simultáneos. Cada panel muestra los dos valores correspondientes a los dos modelos lado a lado, la magnitud de la diferencia y un indicador prominente de "Modelo principal mejor", "Modelo de respaldo mejor" o "Empate dentro de la tolerancia configurable". La matriz de confusión se renderiza como dos matrices seis por seis lado a lado, cada una con su control independiente de absolutos versus porcentajes por fila. La ventana temporal de cálculo es la misma que la utilizada por la vista del modelo individual.

### Criterios de aceptación

1. **Dado** que el modelo predictivo principal genera una predicción durante la operación normal,
   **cuando** la predicción se entrega a sus consumidores,
   **entonces** el modelo de respaldo genera en paralelo una predicción propia sobre los mismos inputs temporales, y ambas se persisten en el mismo registro con el identificador del modelo como discriminante.

2. **Dado** que ha transcurrido el horizonte de un par de predicciones paralelas registradas,
   **cuando** el sistema dispone de la observación real,
   **entonces** persiste la asociación entre ambas predicciones y la misma observación real, permitiendo calcular las métricas de los dos modelos sobre exactamente los mismos eventos.

3. **Dado** que el Administrador ha iniciado sesión,
   **cuando** ingresa a la vista comparativa,
   **entonces** el sistema muestra cuatro paneles, uno por métrica, calculados sobre la ventana temporal vigente.

4. **Dado** que cada panel comparativo muestra una métrica escalar,
   **cuando** el sistema renderiza el panel,
   **entonces** muestra los dos valores correspondientes con etiquetas inequívocas, la magnitud de la diferencia absoluta y un indicador prominente con uno de tres resultados ("Modelo principal mejor", "Modelo de respaldo mejor", o "Empate dentro de la tolerancia configurable") aplicando la dirección de mejora propia de cada métrica.

5. **Dado** que el panel de la matriz de confusión presenta una métrica no escalar,
   **cuando** el sistema renderiza el panel,
   **entonces** muestra dos matrices seis por seis lado a lado, una por modelo, cada una con su propio control de absolutos versus porcentajes por fila y con la diagonal principal visualmente distinguible.

6. **Dado** que la ventana temporal vigente no contiene predicciones suficientes para uno de los modelos o para ninguno de los dos,
   **cuando** el Administrador consulta la vista,
   **entonces** el sistema comunica explícitamente la situación ("el modelo principal no tiene predicciones suficientes", "el modelo de respaldo no tiene predicciones suficientes", o "no hay datos suficientes para comparar los modelos en esta ventana") sin mostrar paneles con valores en cero.

7. **Dado** que el componente que registra predicciones u observaciones deja de responder por cualquier causa,
   **cuando** el Administrador consulta la vista,
   **entonces** el sistema muestra las últimas métricas comparativas calculadas marcadas como "no actualizadas" e indica el tiempo transcurrido desde el último cálculo exitoso.

---

## HU-21 — Escalamiento de incidentes del Operador al Administrador

**Como** Operador de Tráfico Municipal,
**quiero** escalar al Administrador del Sistema un incidente que observo durante operación degradada, registrando automáticamente el contexto operativo y opcionalmente mi descripción de lo observado,
**para** transferir formalmente la situación que excede mi capacidad de resolución, dejar constancia auditable del evento y saber cuándo el Administrador ha atendido el incidente.

### Descripción

Cuando el sistema está operando en un estado degradado o de falla, el Operador encuentra un botón "Escalar al Administrador" en las vistas de alerta y de explicación del modo degradado. Al activarlo, el sistema captura automáticamente el contexto operativo del momento (estado del sistema, componente disparador, nivel de degradación, marcas de tiempo) y abre un modal donde el Operador puede añadir opcionalmente una descripción en texto libre y confirmar el envío. El incidente queda registrado como "Enviado" hasta que el Administrador lo marca como "Atendido" desde su vista de incidentes recibidos. El Operador puede consultar después el estado de los escalamientos que él mismo envió.

### Criterios de aceptación

1. **Dado** que el sistema está operando en un estado degradado o de falla,
   **cuando** el Operador consulta la vista de alerta o la vista de explicación del modo degradado,
   **entonces** el sistema renderiza un botón visible "Escalar al Administrador" con el mismo texto, icono y comportamiento en ambas vistas. En estado normal el botón no se muestra ni es invocable.

2. **Dado** que el Operador activa el botón "Escalar al Administrador",
   **cuando** el sistema responde a la acción,
   **entonces** captura automáticamente el estado operativo, el componente o condición disparadora, el nivel de degradación, las marcas de tiempo y la identidad del Operador, y abre un modal de confirmación con un resumen legible de lo capturado, un campo de texto libre opcional y dos acciones: "Enviar escalamiento" y "Cancelar".

3. **Dado** que el Operador completó opcionalmente el texto libre y activa "Enviar escalamiento",
   **cuando** el sistema procesa la acción,
   **entonces** registra el incidente con estado "Enviado", cierra el modal y muestra una confirmación visible y breve al Operador.

4. **Dado** que el Administrador ha iniciado sesión,
   **cuando** ingresa a su vista de incidentes recibidos por primera vez en la sesión,
   **entonces** el sistema muestra una lista paginada de incidentes en orden cronológico inverso con el filtro por estado preseleccionado en "Pendientes" y permite cambiarlo a "Atendidos" o "Todos".

5. **Dado** que el Administrador consulta el detalle de un incidente en estado "Enviado" y activa la acción "Marcar como atendido",
   **cuando** el sistema procesa la acción,
   **entonces** registra la transición del incidente a estado "Atendido" preservando la identidad del Administrador y la marca de tiempo, sin permitir reversión posterior.

6. **Dado** que el Operador escaló un incidente que aún está en estado "Enviado" y el sistema se recupera automáticamente a operación normal,
   **cuando** la recuperación se completa,
   **entonces** el incidente permanece registrado en estado "Enviado" hasta que el Administrador lo marque "Atendido" explícitamente.

7. **Dado** que el Operador escribió texto libre en el modal y la persistencia del incidente falla por causa momentánea,
   **cuando** el Operador confirma el envío,
   **entonces** el sistema informa al Operador que el escalamiento no se registró, preserva el contenido escrito en el modal y le permite reintentar sin perder información.
