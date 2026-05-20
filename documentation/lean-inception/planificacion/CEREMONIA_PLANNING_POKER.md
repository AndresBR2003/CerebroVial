# Ceremonia Planning Poker — CerebroVial

> Protocolo formal ejecutable de la ceremonia de estimación de Story Points sobre el Product Backlog de CerebroVial, adaptado a la situación particular del proyecto: tres sprints ejecutados sin estimación previa + sprint 4 por planificar.
>
> **Insumo:** Product Backlog completo + `MOSCOW_RATIFICADA.md` (Fase 1) + `AUDITORIA_HU_CODIGO.md` (Fase 4 previa a esta ceremonia).
>
> **Salida esperada:** `ESTIMACION_SP.md` con SP por elemento desglosado en **SP total**, **SP ejecutado** y **SP restante**.
>
> **Ejecutor previsto:** Claude Code en la máquina del proyecto.

---

## 1. Propósito y adaptación al contexto

El Planning Poker clásico estima esfuerzo previsto antes de implementar. En CerebroVial, los sprints 1, 2 y 3 ya se ejecutaron sin estimación previa. El sprint 4 está por empezar. La ceremonia debe producir tres números por elemento:

- **SP total:** cuánto vale el elemento completo en abstracto, independiente de si está construido o no.
- **SP ejecutado:** cuánto del SP total ya está consumido en código.
- **SP restante:** SP total − SP ejecutado. Es lo que entrará al sprint 4.

Esta tripleta permite reconstruir SP por sprint histórico (para sprints 1-3) y planificar el sprint 4 con realismo.

El método se llama Planning Poker porque conserva la mecánica de estimación referenciada (escala Fibonacci, anclajes, debate de extremos). Pero su naturaleza es mixta: estimación predictiva para lo no construido y estimación descriptiva para lo construido.

---

## 2. Escala de Story Points

Se usa Fibonacci modificada estándar:

`1, 2, 3, 5, 8, 13, 21, ?`

Significados ancla:

| SP | Significado en contexto CerebroVial |
|---|---|
| **1** | Tarea trivial. Configuración menor, ajuste de constante, edit puntual. Casi nunca aplica a HUs completas; sí a fragmentos. |
| **2** | Tarea simple bien acotada. Vista CRUD básica sin lógica compleja, endpoint de consulta directo. |
| **3** | Tarea estándar con un componente no trivial: lógica de validación, integración simple, vista con CAs múltiples. |
| **5** | Tarea de complejidad media. Vista del Operador con tiempo real, endpoint con lógica de cálculo, integración entre dos componentes existentes. |
| **8** | Tarea compleja con dos o más dimensiones: lógica de fallback, persistencia + auditoría, vista con estado complejo, integración nueva. |
| **13** | Tarea muy compleja. Subsistema central. Ejemplo paradigmático: motor adaptativo completo, modelo predictivo servido, lógica de fallback en cascada con sus 5 estados. |
| **21** | Tarea de envergadura mayor. En un proyecto académico individual debería ser raro; si aparece es señal de que el elemento debe descomponerse antes de estimar. |
| **?** | El elemento no es estimable con la información actual. Requiere ronda de aclaración previa. |

Anclajes obligatorios para Claude Code: antes de estimar, Claude Code debe identificar al menos **una HU o TTH del backlog que probablemente sea 3 SP** y **una HU o TTH que probablemente sea 13 SP**, y usarlas como referencia comparativa para todas las estimaciones subsiguientes. Sin anclas, la escala flota y los SP se vuelven incomparables.

Anclas sugeridas para CerebroVial (a confirmar por Claude Code tras la auditoría):

- **Ancla baja (3 SP):** HU-07 (Notificación de cambios de estrategia) — vista pasiva, 5 CAs, lógica simple de presentación.
- **Ancla alta (13 SP):** TTH-10 (Motor adaptativo) — 3 estrategias + lógica de selección + fallback + auditoría. O alternativamente TTH-09 (Modelo predictivo GRU servido vía API) si TTH-10 se considera demasiado heterogéneo.

---

## 3. Tres reglas operativas que diferencian este Planning Poker

### 3.1 Estimación dual obligatoria para HUs parciales

Para una HU clasificada como **parcial** en la auditoría, no basta con asignar un SP. Se asignan dos:

- **SP total** (lo que valdría la HU completa): se estima mirando los CAs declarados en el backlog. Esta estimación es independiente del código.
- **SP ejecutado** (lo que ya está en código): se estima mirando qué CAs están cubiertos por la auditoría y qué proporción de complejidad representan respecto al total. Esta estimación se hace después del SP total.

El SP restante se calcula como SP total − SP ejecutado.

**Caso límite:** una HU parcial con SP total = 8 y cobertura de auditoría de "60% de CAs cubiertos" no implica automáticamente SP ejecutado = 5. La proporción se hace por **complejidad**, no por conteo de CAs. Si los CAs implementados son los simples y los pendientes son los complejos, SP ejecutado puede ser 3 y SP restante 5 (no 5 y 3 respectivamente).

### 3.2 Estimación única para HUs completas y no iniciadas

- **HU completa en código:** se estima sólo el SP total. SP ejecutado = SP total. SP restante = 0.
- **HU no iniciada:** se estima sólo el SP total. SP ejecutado = 0. SP restante = SP total.

### 3.3 Estimación con tolerancia para HUs Won't

Las HUs Won't no se estiman para distribución de sprints, pero **sí se estima su SP total** para fines documentales del backlog. Esta estimación es opcional y de calidad menor (se acepta SP grueso 5/13/21 sin debate detallado). No entra a la suma del sprint 4.

---

## 4. Mecánica de la estimación

Como el equipo es individual (un solo estudiante) y la ceremonia la ejecuta Claude Code, no hay debate entre miembros. La mecánica clásica se adapta así:

### 4.1 Para cada elemento del backlog

#### Paso 1 — Lectura del elemento y de la auditoría correspondiente

Claude Code lee:
- La descripción de la HU/TTH en el backlog.
- Los CAs y notas técnicas.
- El estado del elemento en `AUDITORIA_HU_CODIGO.md` (completo/parcial/no iniciado).
- Los archivos del código asociados si la HU/TTH es parcial o completa.

#### Paso 2 — Estimación inicial del SP total

Claude Code emite una estimación tentativa basada en:
- Cantidad y complejidad de los CAs.
- Cantidad de componentes técnicos involucrados (frontend, backend, persistencia, integración con SUMO, etc.).
- Comparación con las anclas (Paso 0).
- Comparación con elementos ya estimados de complejidad similar.

#### Paso 3 — Verificación contra anclas y elementos vecinos

Claude Code se pregunta: "¿Este elemento es más complejo que la HU/TTH ancla baja? ¿Menos complejo que la ancla alta?". Si la estimación inicial está en tensión con esta comparación, ajusta.

#### Paso 4 — Estimación del SP ejecutado (sólo si la HU es parcial o completa)

Claude Code lee la auditoría detallada de los CAs implementados y estima la proporción de complejidad cubierta. Aplica la regla 3.1 (proporción por complejidad, no por conteo).

#### Paso 5 — Registro

Tres números: SP total, SP ejecutado, SP restante. Más una **nota de justificación de máximo 3 líneas** explicando:
- Qué hace que el elemento valga ese SP (factores de complejidad).
- Si el elemento es parcial: qué CAs están cubiertos y qué porcentaje de complejidad representa el cubierto.

### 4.2 Cierre del elemento y rondas de revisión

Después de estimar 5 elementos consecutivos, Claude Code ejecuta una **revisión de coherencia**: vuelve a leer las estimaciones recientes y se pregunta si dos elementos con SP igual son efectivamente comparables en complejidad. Si detecta inconsistencia (por ejemplo, HU-A con SP 5 es claramente más compleja que HU-B con SP 8), se revisa la pareja y se ajusta una de las dos.

Esta revisión cíclica reemplaza el debate entre miembros del equipo del Planning Poker clásico.

### 4.3 Casos en que se asigna `?`

Si Claude Code no puede estimar un elemento con confianza razonable, marca el SP como `?` y registra qué información falta:

- "Requiere lectura de archivo X del repo no leído todavía."
- "CA-N depende de una decisión de diseño no documentada; pregunta para revisión humana."
- "El alcance del CA es ambiguo entre dos interpretaciones; ambas son legítimas pero estiman muy distinto."

Los elementos marcados `?` se acumulan en una lista al cierre de la ceremonia y se resuelven en una segunda pasada con humano en el loop.

---

## 5. Reglas especiales por tipo de elemento

### 5.1 Historias de Usuario

Aplica la mecánica completa de la sección 4. Las HUs son la unidad central de estimación.

### 5.2 Tareas Técnicas Habilitadoras

Las TTH se estiman como HUs, con dos particularidades:

- **No tienen Criterios de Aceptación de usuario, tienen Criterios Técnicos (CT).** La estimación se hace sobre los CT del documento `TAREAS_TECNICAS_HABILITADORAS.md`.
- **La proporcionalidad complejidad-funcionalidad es distinta.** TTH-02 (entorno Docker) puede tener pocos CT pero alta complejidad inicial; TTH-11 (spike de calibración) puede tener mucha exploración con poco código entregable. Claude Code debe identificar el tipo de TTH antes de estimar:
  - **TTH de infraestructura** (TTH-01, TTH-02, TTH-03): complejidad alta al inicio, baja al final. Si están construidas (es muy probable), SP ejecutado ≈ SP total.
  - **TTH de subsistema central** (TTH-04, TTH-08, TTH-09, TTH-10): SP típicamente 8 a 13.
  - **TTH de integración** (TTH-05, TTH-07): SP típicamente 5 a 8.
  - **TTH de spike** (TTH-11): SP estimable pero acepta error mayor; el spike consume tiempo no perfectamente predecible.

### 5.3 RF y RNF

Los RF y RNF **no se estiman individualmente en este Planning Poker**. La razón es que los RF y RNF se materializan en HUs y TTH; su esfuerzo está ya contado en el SP de esas HUs/TTH. Estimarlos aparte produciría doble conteo.

Excepciones donde sí se estima un RNF por separado:

- **RNF transversal sin HU origen única.** Por ejemplo, RNF-INT-02 (accesibilidad WCAG 2.1 AA) aplica a 12 HUs. El esfuerzo de cumplirlo no está contenido en una sola HU. En estos casos, se estima el RNF como **trabajo transversal adicional** con SP propio. Heurística: SP = 3 a 8 según cuántas HUs toca y qué tan invasivo es el ajuste.
- **RNF de proceso o validación.** Por ejemplo, un RNF que exige prueba de carga sobre la persistencia. La prueba en sí es trabajo separado del CA que validan. Se estima.

La lista de RNF "estimables por separado" se identifica antes de la ronda de estimación. Esta lista debería tener no más de 10 elementos para CerebroVial.

---

## 6. Procedimiento operacional global

### 6.1 Orden de la ceremonia

1. **Pasada 0 — Anclajes.** Identificar la HU/TTH ancla baja (≈3 SP) y la ancla alta (≈13 SP). Documentar.
2. **Pasada 1 — Estimación de TTH.** Las TTH se estiman primero porque son las que el sprint 1 probablemente construyó. Su estimación calibra la escala. Subnota: SP de TTH típicamente más alto que SP de HU promedio.
3. **Pasada 2 — Estimación de HUs en orden de bloque.** Bloque A → B → C → D → F → MVP2.
4. **Pasada 3 — Estimación de RNF transversales identificados como estimables por separado.**
5. **Pasada 4 — Revisión de coherencia global.** Releer la tabla completa, identificar inconsistencias de escala entre elementos lejanos en el orden de estimación, ajustar.
6. **Pasada 5 — Resolución de elementos marcados `?`.** Si quedan elementos sin estimar, listar la información faltante y pedir revisión humana antes de cerrar.

### 6.2 Suma agregada de SP

Al cierre, se calculan tres totales:

- **SP total del backlog Must + Should** (lo que CerebroVial vale en abstracto, considerando solo MVP1+).
- **SP ejecutado total** (la suma de SP ejecutado de cada elemento; representa el trabajo ya consumido en sprints 1-3).
- **SP restante para sprint 4** (la suma de SP restante de elementos Must + Should).

Estos tres números alimentan la Fase 3 (distribución de sprints).

### 6.3 Revisión cruzada con MoSCoW

Si después de estimar todos los Must, la suma de SP restante de los Must excede el SP físicamente disponible en el sprint 4 (medido en horas/jornadas según cronograma académico), hay dos opciones:

- Bajar algunas HUs/TTH Must a Should con justificación (segunda pasada de MoSCoW, registrada en `MOSCOW_RATIFICADA.md` con timestamp posterior).
- Reducir el alcance de algunas HUs Must declarando ciertos CAs como Could (registrado en una nota a esa HU).

Este loop entre MoSCoW y Planning Poker es esperado y saludable. No es defecto del método.

---

## 7. Ejemplos resueltos

Estos ejemplos no prejuzgan los SP reales (eso lo hace la auditoría); ilustran la mecánica.

### Ejemplo 1 — HU-01 (Acceso diferenciado por rol)

- Auditoría: probablemente completa en código (el sistema ya funciona, hay sesiones).
- Anclas: ancla baja HU-07 = 3 SP.
- Razonamiento: 6 CAs, lógica de autenticación + RBAC + sesiones JWT. Más complejo que HU-07 (que es pasivo). Comparable a una HU CRUD con seguridad.
- **SP total estimado: 5.** SP ejecutado: 5. SP restante: 0.
- Justificación: "6 CAs incluyendo login, expiración JWT, RBAC vía endpoint y vía ruta, ocultación de rutas. Habilitada por TTH-01. Vista simple pero lógica de seguridad no trivial."

### Ejemplo 2 — HU-10 (Alerta transversal del estado operativo)

- Auditoría: probablemente parcial (lógica de alerta en algunas vistas, no transversal completa).
- Anclas: ancla baja 3, ancla alta 13.
- Razonamiento: 9 CAs, persistencia inmutable de transiciones, alerta transversal en todas las vistas, robustez ante caída del monitor, distinción visual entre 4 estados degradados. Más complejo que HU-01, menos que TTH-10.
- **SP total estimado: 8.** SP ejecutado: 3 (hipotético: alerta básica visible pero no transversal ni con persistencia inmutable). SP restante: 5.
- Justificación: "9 CAs, alerta transversal compleja, persistencia inmutable de transiciones, comportamiento conservador ante caída del monitor (CA-10.9). Auditoría revela alerta funcional en HU-02 y HU-05 pero ausencia en HU-08, HU-13 y HU-14; persistencia de transiciones sólo en log básico, sin inmutabilidad reforzada."

### Ejemplo 3 — TTH-10 (Motor adaptativo)

- Auditoría: probablemente completa (el sistema controla el semáforo).
- Anclas: ancla alta TTH-10 = 13 SP (se usa como ancla, no se compara contra otra ancla).
- Razonamiento: Webster + Max Pressure + MTC como respaldo, lógica de selección entre estrategias, persistencia auditable de decisiones, comportamiento ante caída.
- **SP total: 13.** SP ejecutado: 13. SP restante: 0.
- Justificación: "Subsistema central del producto. Tres estrategias de control + lógica de selección + auditoría + fallback. Ancla alta de la escala."

### Ejemplo 4 — RNF-INT-02 (Accesibilidad WCAG 2.1 AA)

- No estimable por HU individual; transversal.
- Aplica a 12 HUs según la matriz de trazabilidad.
- Heurística: si el código actual ya cumple WCAG en frontend, SP ≈ 2-3 (sólo verificación y refinamiento). Si no cumple, SP ≈ 8 (ajustes en todas las vistas).
- **SP total: 5 (estimación intermedia, ajustable tras auditoría visual).** SP ejecutado: 1 (lo básico de contraste). SP restante: 4.
- Justificación: "Transversal a 12 HUs. Color + ícono + texto en estados. Tooltips activables por teclado. Verificación con axe-core o similar."

### Ejemplo 5 — HU-21 (Escalamiento de incidentes)

- Auditoría: probablemente nula (MVP2 ampliado).
- Anclas: contra HU-10 y TTH-10.
- Razonamiento: 14 CAs, modal con captura automática de contexto, badge de pendientes, validación RBAC dual, registro de incidentes con inmutabilidad parcial. La HU más densa del backlog.
- **SP total estimado: 13.** SP ejecutado: 0. SP restante: 13.
- Justificación: "14 CAs, captura de contexto automática, badge de pendientes con actualización ≤30s, RBAC dual frontend/backend, inmutabilidad de campos del momento del disparo. Densidad comparable a TTH-10."

---

## 8. Patrones de inconsistencia que Claude Code debe detectar

Durante las pasadas de revisión (sección 4.2 y 6.1 Pasada 4), buscar activamente estos patrones:

### 8.1 Dos HUs con SP igual pero complejidad obviamente distinta

Síntoma: HU-A (4 CAs simples, vista pasiva) y HU-B (8 CAs, persistencia inmutable, robustez Caso B) ambas con SP=5. Probablemente HU-B debe subir a 8.

### 8.2 HU compleja con SP menor que TTH simple

Síntoma: TTH-02 (entorno Docker) con SP=5 y HU-10 (alerta transversal compleja) con SP=5. Improbable que la complejidad sea comparable. Revisar.

### 8.3 SP restante negativo

Síntoma: SP ejecutado > SP total. Indica que la estimación del SP ejecutado se hizo sin ancla con el SP total. Revisar ambos.

### 8.4 SP ejecutado igual a 0 para HU con código asociado en la auditoría

Síntoma: la auditoría declaró la HU como parcial con cierta cobertura, pero la estimación dejó SP ejecutado=0. Inconsistencia.

### 8.5 Suma de SP de un sprint histórico que excede mucho lo razonable

Síntoma: tras reconstruir qué HUs/TTH se construyeron en sprint 1 (Fase 3), la suma de su SP ejecutado da 40+ SP para un sprint de duración estándar. Probablemente sobreestimación. Esto se detecta en Fase 3, no en esta ceremonia, pero conviene anticiparlo.

---

## 9. Salida esperada

El documento `ESTIMACION_SP.md` contiene:

### 9.1 Tabla principal por elemento

| Código | Título corto | Prioridad MoSCoW | SP total | SP ejecutado | SP restante | Justificación |
|---|---|---|---|---|---|---|

### 9.2 Sección de RNF transversales estimados por separado

| Código RNF | Descripción corta | HUs que toca | SP total | SP ejecutado | SP restante | Justificación |
|---|---|---|---|---|---|---|

### 9.3 Resumen agregado

- SP total del backlog Must.
- SP total del backlog Should.
- SP total Must + Should.
- SP ejecutado total.
- SP restante para sprint 4 (Must + Should).
- SP restante sólo Must (alcance mínimo del sprint 4).

### 9.4 Lista de elementos marcados `?`

Si los hay, con la información faltante para resolverlos.

### 9.5 Anclas usadas

Identificar la HU/TTH ancla baja (3 SP) y ancla alta (13 SP) usadas para la escala, con justificación.

### 9.6 Notas de revisión

Patrones de inconsistencia detectados durante las pasadas de revisión y cómo se resolvieron.

---

## 10. Instrucciones específicas para Claude Code

1. **Leer este documento completo antes de empezar.**
2. **Leer `MOSCOW_RATIFICADA.md` completo** y filtrar elementos Won't (no entran a estimación; opcionalmente se estiman gruesos para documentación).
3. **Leer `AUDITORIA_HU_CODIGO.md` completo** y mantener acceso rápido a la sección de cada HU/TTH durante la estimación.
4. **Tener acceso al repo del proyecto** para inspección puntual cuando la auditoría no sea suficiente para estimar el SP ejecutado.
5. **Ejecutar las pasadas en el orden de la sección 6.1.**
6. **Aplicar la regla del 4.2 (revisión cíclica cada 5 elementos).**
7. **Producir `ESTIMACION_SP.md` con la estructura de la sección 9.**
8. **Marcar como `?` con justificación todo elemento donde no haya confianza razonable**; no forzar estimaciones dudosas.
9. **Si la suma de Must excede el sprint 4 disponible**, no resolver aquí: emitir alerta para iteración MoSCoW + Planning Poker (sección 6.3).
10. **No modificar `MOSCOW_RATIFICADA.md` ni el backlog formal.** Esta ceremonia produce documento operativo separado.

---

## 11. Criterios de éxito

La ceremonia se considera bien ejecutada si:

1. Todos los elementos Must + Should + Could (no Won't) tienen SP total estimado.
2. Toda HU/TTH parcial o completa tiene además SP ejecutado y SP restante.
3. La escala está calibrada con anclas baja y alta documentadas.
4. Las inconsistencias detectadas en las pasadas de revisión están resueltas o documentadas.
5. La salida es trazable: cada SP tiene justificación que cita CAs, complejidad técnica y, cuando aplica, comparación con anclas.
6. La suma de SP restante de Must es contrastable contra la capacidad real del sprint 4 (próxima fase).

---

## 12. Nota sobre la estimación retrospectiva

Estimar SP de trabajo ya hecho parece artificial pero tiene dos propósitos legítimos para la tesis:

1. **Permite reconstruir velocity histórica.** Cuántos SP por sprint se hicieron en sprints 1-3. Esto justifica académicamente cuánto SP es realista para sprint 4.
2. **Permite distribuir trabajo entre sprints de forma defendible.** Si sprint 1 = 30 SP y sprint 4 proyectado = 25 SP, la distribución es coherente. Si sprint 1 = 50 SP y sprint 4 = 15 SP, hay que justificar la diferencia (curva de aprendizaje, complejidad inicial alta, etc.).

La estimación retrospectiva no es ficción: el código ya construido **vale lo que vale en SP** independientemente de si se estimó antes o después. Lo importante es que el ejercicio de estimación sea honesto y refleje la complejidad real, no que se ajuste a una distribución idealizada.
