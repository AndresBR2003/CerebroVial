# Ceremonia MoSCoW — CerebroVial

> Protocolo formal ejecutable de la ceremonia de priorización MoSCoW sobre el Product Backlog de CerebroVial. Documento operativo del proyecto: no es decisión metodológica del backlog ni modifica `DECISIONS_HU.md`.
>
> **Insumo:** Product Backlog cerrado al 2026-05-16 (21 HUs + 11 TTH + 22 RF + 53 RNF) con prioridades sugeridas declaradas en el documento RF/RNF y heredadas implícitamente en HUs y TTH.
>
> **Salida esperada:** `MOSCOW_RATIFICADA.md` con clasificación final por elemento, justificación cuando difiere de la sugerencia, y declaración del alcance del MVP1.
>
> **Ejecutor previsto:** Claude Code en la máquina del proyecto, con acceso al repositorio y al backlog completo.

---

## 1. Propósito y posición de la ceremonia en el proceso

La ceremonia MoSCoW ratifica, ajusta o reorganiza las prioridades de los 107 elementos del backlog (21 HUs + 11 TTH + 22 RF + 53 RNF). El documento RF/RNF declara explícitamente en su sección 6.1 que las prioridades actuales son **sugeridas como anclaje argumentado, no ratificadas**. Esta ceremonia es la ratificación formal.

La MoSCoW precede al Planning Poker porque la estimación de esfuerzo se hace sobre el orden de implementación, y ese orden depende de la prioridad. Una HU Won't no se estima; una HU Should se estima pero puede salir del sprint si el SP del sprint se acerca al límite.

La MoSCoW también precede a la distribución en sprints porque el sprint 4 sólo carga Must y Should ratificados, no Could ni Won't.

---

## 2. Definiciones operacionales de las cuatro categorías

Las definiciones genéricas de MoSCoW son insuficientes para un proyecto académico individual con cronograma cerrado. Las cuatro categorías se redefinen aquí ancladas a los 4 Objetivos del producto (declarados en `BACKLOG_OVERVIEW.md`) y al contexto académico.

### 2.1 Must

Un elemento es Must si y sólo si su ausencia hace que el MVP1 no sea defendible como sistema funcional. El criterio operacional: si el elemento no está, **el sistema no puede demostrarse ante el jurado de tesis cumpliendo su propósito declarado**. La demostración es: control adaptativo de la intersección funcionando con observación del estado, predicción a corto plazo, motor adaptativo con fallback, registro auditable, y vista del operador.

Son Must todos los elementos que cumplen al menos uno de estos criterios:

- **Habilita la operación primaria del sistema sobre el semáforo.** Sin él, el motor adaptativo no controla la intersección. Esto incluye TTH-04 (lógica de fallback), TTH-08 (visión computacional), TTH-09 (modelo predictivo principal), TTH-10 (motor adaptativo), TTH-05 (tiempos preconfigurados de degradado nivel 3).
- **Permite al Operador supervisar la operación primaria.** Sin él, no hay vista del estado del sistema en tiempo real. Esto incluye HU-01 (acceso), HU-02 (estado actual), HU-05 (estrategia activa), HU-10 (alerta transversal), HU-11 (componentes), HU-12 (explicación degradado).
- **Garantiza continuidad operativa ante fallos.** Sin él, el sistema no es defendible como confiable. Esto incluye RNF-REL-01 a REL-09 (robustez y continuidad), RNF-SAF-01 (fail-safe), RNF-SAF-03 (valores por defecto seguros).
- **Es precondición de la auditoría académica.** Sin él, los resultados del sistema no son verificables retroactivamente por el jurado. Esto incluye HU-08 (historial decisiones), RNF-SEC-01 (inmutabilidad de logs), RNF-REL-04 (durabilidad).
- **Es Objetivo 1 (reducir tiempos de espera) materializado.** Sin él, no hay sustento empírico del Objetivo 1. Esto incluye HU-03 (predicción), HU-04 (vista combinada), HU-06 (explicación de estrategia), HU-07 (notificación de cambios), TTH-07 (integración SUMO para medición).
- **Es Objetivo 2 (sustentar la decisión técnica del adaptativo) materializado.** Sin él, no hay evidencia comparativa. Esto incluye HU-16 (KPIs operativos), HU-17 (comparativa), HU-13 (salud técnica de componentes), HU-14 (métricas del modelo).
- **Habilita transversalmente más de un Must.** Sin él, los Must que depende caen. Esto incluye TTH-01 (autenticación), TTH-02 (entorno), TTH-03 (CI), HU-15 (configuración de parámetros — habilita ajustar valores sin redeploy del sistema), RNF-SEC-02 a SEC-07 (seguridad transversal), RNF-PERF-01 a PERF-13 (rendimiento que define la usabilidad).

### 2.2 Should

Un elemento es Should si su ausencia degrada la calidad del MVP1 pero **no impide la defensa**. La demostración del sistema funciona; los resultados son sustentables; pero hay aspectos de calidad, accesibilidad, mantenibilidad o profundidad analítica que quedan documentados como deuda explícita.

Son Should los elementos que cumplen al menos uno de:

- **Mejora cualitativa de Must sin ser precondición funcional.** El ejemplo paradigmático son los RNF de accesibilidad WCAG 2.1 AA (RNF-INT-02), de coherencia textual entre vistas (RNF-INT-04), de extensibilidad de catálogos (RNF-MNT-01). Sin ellos, el sistema demuestra; con ellos, el sistema demuestra mejor.
- **Reduce fricción operativa del usuario sin habilitar capacidad nueva.** Por ejemplo, HU-09 (notas e incidencias) facilita la transmisión entre turnos pero el Operador puede operar sin ellas.
- **Profundiza el sustento técnico sin habilitar funcionalidad nueva.** Por ejemplo, HU-18 (drill-down del Gerente) profundiza el análisis comparativo que HU-16 y HU-17 ya permiten; HU-19 (exportación) facilita la difusión externa de los resultados que HU-16 y HU-17 ya producen.
- **Aumenta robustez del modelo predictivo sin ser parte del flujo crítico.** Por ejemplo, HU-20 (modelo principal vs respaldo) refuerza la justificación de la elección del modelo principal, pero el sistema opera con el modelo principal solo.
- **Es Could ascendido por valor académico específico.** Algunos elementos catalogados como Could en el documento RF/RNF pueden ascender a Should si el jurado de tesis los espera explícitamente.

### 2.3 Could

Un elemento es Could si su presencia es deseable, factible si hay holgura, pero **se acepta su ausencia sin justificación argumentativa larga**. Los Could son candidatos naturales del MVP2 ampliado o del cierre del sprint 4 si hay tiempo sobrante.

Ejemplos esperados:

- HU-21 (escalamiento de incidentes) como flujo comunicacional MVP2.
- Refinamientos de presentación visual cubiertos por RNF-INT-06 (artefactos exportados impresos).
- Tolerancia configurable del indicador comparativo entre modelos (RNF-MNT-03), si HU-20 entra como Should.

### 2.4 Won't

Un elemento es Won't si **se declara explícitamente fuera del alcance del proyecto académico**. Estos elementos no entran a Planning Poker ni a la distribución de sprints; quedan como Trabajos Futuros.

Las 7 features ya declaradas como Trabajos Futuros (F21, F36–F41) son Won't por construcción. La ceremonia confirma esta clasificación y eventualmente identifica HUs o RNF adicionales que merecen pasar a Won't (por ejemplo, si una HU Could resulta inalcanzable con el SP disponible del sprint 4).

---

## 3. Reglas especiales por tipo de elemento

### 3.1 Historias de Usuario (HU)

Las 21 HUs ya tienen clasificación MVP1/MVP2 declarada en el backlog. Esa clasificación es input pero **no es output automático** de la MoSCoW:

- MVP1 no implica Must. Una HU del MVP1 puede ser Should si el código actual ya cubre el flujo principal y los CAs restantes son pulido.
- MVP2 no implica Could. HU-09 (notas), HU-18 (drill-down), HU-19 (exportación) son MVP2 pero pueden ascender a Should si el jurado las espera.

La clasificación MVP1/MVP2 indica *intención original*; la MoSCoW ratifica *prioridad operativa actual* dado el estado del proyecto.

### 3.2 Tareas Técnicas Habilitadoras (TTH)

Las 11 TTH no entregan valor al usuario por sí solas pero habilitan HUs que sí. Su clasificación MoSCoW deriva de las HUs que habilitan pero **no es simétrica**:

- Una TTH que habilita una HU Must es Must (si la HU Must depende exclusivamente de esa TTH).
- Una TTH que habilita varias HUs, donde al menos una es Must, es Must.
- Una TTH que habilita sólo HUs Should o Could puede ser Should o Could (no necesariamente Must).
- Una TTH puede ser Won't si todas las HUs que habilita son Won't.

Regla operacional: la prioridad MoSCoW de una TTH es el **máximo** de las prioridades de las HUs que habilita, donde Must > Should > Could > Won't.

**Excepción declarada en el backlog:** TTH-06 (capa de DTOs) ya fue reclasificada a Trabajos Futuros. Es Won't por construcción.

### 3.3 Requisitos Funcionales (RF) y No Funcionales (RNF)

Los 22 RF y 53 RNF ya tienen prioridad sugerida declarada en el documento normativo. La ceremonia evalúa ratificación con el siguiente criterio:

- **Ratificación por defecto.** Las prioridades sugeridas se ratifican salvo evidencia argumentada en contrario. El documento RF/RNF está pensado para que las sugerencias sean defendibles tal como están.
- **Ajuste posible cuando aplica.** Un RNF puede bajar de Must a Should si la auditoría del código revela que su criterio de aceptación medible es desproporcionado para el alcance académico. Un RF puede subir de Should a Must si la auditoría revela que su ausencia rompería la demostrabilidad.
- **Trazabilidad obligatoria.** Cualquier ajuste sobre la sugerencia se justifica en el documento de salida, citando la sección del documento RF/RNF y el motivo del ajuste.

### 3.4 Relación entre HU, TTH y RF/RNF

Una HU Must puede tener RF asociados que son Should (porque el RF es la versión normativa formalizada del CA, no su precondición). Una HU Must también puede tener RNF asociados Should (por ejemplo, accesibilidad WCAG es Should aunque la HU sea Must). No hay regla rígida de coincidencia entre la prioridad de la HU y la prioridad de sus RF/RNF derivados.

La regla operacional inversa sí aplica: **si un RF o RNF es Must, todas las HUs que lo originan deben ser al menos Should**. No tiene sentido que un RNF crítico tenga origen exclusivo en HUs Could.

---

## 4. Procedimiento de la ceremonia

La ceremonia se ejecuta por **pasadas independientes** sobre cuatro grupos del backlog: HUs, TTH, RF, RNF. Cada pasada es secuencial sobre los elementos del grupo, en el orden declarado en el backlog. Para cada elemento se aplica el siguiente algoritmo:

### Paso 1 — Lectura del elemento y su prioridad sugerida

Leer el título, la descripción y la prioridad sugerida actual del elemento. Para HUs, leer también la clasificación MVP1/MVP2.

### Paso 2 — Verificación contra los criterios operacionales

Para HUs y TTH, contrastar contra los criterios de la sección 2 (subsecciones 2.1 a 2.4). Identificar la categoría que mejor describe el elemento.

Para RF y RNF, contrastar la prioridad sugerida contra los criterios de la sección 3.3.

### Paso 3 — Confrontación con la auditoría del código (cuando aplique)

Si el elemento es HU o TTH, contrastar la clasificación tentativa contra el estado del código según la auditoría:

- **HU completa en código:** se ratifica la clasificación tentativa salvo evidencia.
- **HU parcial en código:** se evalúa si el SP restante justifica mantener la prioridad. Una HU clasificada como Must pero cuyo SP restante es desproporcionado puede bajarse a Should si la porción ya construida ya cumple el valor crítico.
- **HU no iniciada:** se evalúa con especial cuidado. Una HU Must no iniciada debe tener SP factible en el sprint 4.

### Paso 4 — Decisión y registro

Asignar categoría definitiva. Si difiere de la prioridad sugerida o de la clasificación MVP1/MVP2, registrar la justificación en una nota de máximo 2 líneas. La justificación debe citar:

- El criterio operacional aplicado (subsección de la sección 2 o 3).
- La evidencia (CA del backlog, evidencia del código, dependencia entre elementos).

### Paso 5 — Verificación de consistencia entre elementos relacionados

Después de cada pasada, verificar la consistencia interna. Las verificaciones obligatorias son:

- Cada HU Must tiene TTH habilitadoras al menos Must (cuando aplica dependencia).
- Cada RF/RNF Must tiene al menos una HU/TTH origen al menos Should.
- Cada TTH cuya MoSCoW supera la de todas las HUs que habilita debe tener justificación (caso atípico).
- Ninguna HU Won't tiene CAs referenciados desde una HU Must.

Si una verificación falla, se revisa la decisión y se ajusta una de las dos partes en conflicto.

---

## 5. Salida esperada

El documento `MOSCOW_RATIFICADA.md` contiene cuatro tablas (HUs, TTH, RF, RNF) con la siguiente estructura por fila:

| Código | Título corto | Prioridad sugerida | Prioridad ratificada | Justificación (si difiere) |
|---|---|---|---|---|

Más una sección de **alcance declarado del MVP1**:

- Listado de HUs Must (el alcance mínimo no negociable del sprint 4).
- Listado de HUs Should (alcance objetivo del sprint 4 si el SP lo permite).
- Listado de HUs Could (alcance opcional MVP2 ampliado).
- Listado de HUs Won't (Trabajos Futuros declarados).
- Listado análogo para TTH.

Más una sección de **deltas respecto a las prioridades sugeridas**:

- Tabla de elementos ajustados (sugerida ≠ ratificada).
- Resumen estadístico: cuántos ratificados sin ajuste, cuántos ajustados al alza, cuántos a la baja.
- Conclusión sobre la calidad de las prioridades sugeridas del documento RF/RNF (si la mayoría se ratifica, las sugerencias fueron buen anclaje; si hay muchos ajustes, las sugerencias necesitaron afinamiento).

---

## 6. Ejemplos resueltos sobre el backlog actual

Estos ejemplos no son ejecución parcial de la ceremonia: son ilustraciones del algoritmo para que Claude Code calibre antes de ejecutarlo. No prejuzgan el resultado real.

### Ejemplo 1 — HU-02 (Monitoreo del estado actual)

- Prioridad sugerida implícita: MVP1.
- Criterio aplicado: 2.1 "Permite al Operador supervisar la operación primaria" + "Es Objetivo 1 materializado".
- Verificación de código: probablemente alta cobertura (es vista central).
- Decisión esperada: **Must**.
- Sin justificación adicional (ratificación directa).

### Ejemplo 2 — HU-19 (Exportación de reportes)

- Prioridad sugerida implícita: MVP2.
- Criterio aplicado: 2.2 "Profundiza el sustento técnico sin habilitar funcionalidad nueva" — los KPIs ya están en HU-16; HU-19 sólo facilita su difusión externa.
- Verificación de código: probablemente baja (es MVP2).
- Decisión esperada: **Could** (no Should), salvo que el jurado espere explícitamente reportes exportables.
- Justificación: "HU-19 facilita difusión de KPIs de HU-16 ya cubiertos; ausencia no impide demostrar el Objetivo 4."

### Ejemplo 3 — TTH-08 (Visión computacional)

- Prioridad sugerida implícita: implícita Must por habilitar HU-02 y HU-03.
- Criterio aplicado: regla 3.2 — el máximo de HUs habilitadas es Must.
- Verificación de código: variable según estado real.
- Decisión esperada: **Must**.

### Ejemplo 4 — RNF-INT-02 (Accesibilidad WCAG 2.1 AA)

- Prioridad sugerida: Should.
- Criterio aplicado: 2.2 "Mejora cualitativa de Must sin ser precondición funcional".
- Decisión esperada: **Should** (ratificación directa).
- Si el alcance académico declara explícitamente que la accesibilidad WCAG no se evalúa, podría bajar a Could.

### Ejemplo 5 — HU-21 (Escalamiento de incidentes)

- Prioridad sugerida implícita: MVP2.
- Criterio aplicado: 2.3 "Could si su presencia es deseable, factible si hay holgura".
- Verificación de código: probablemente nula o muy parcial (es la HU más densa del MVP2).
- Decisión esperada: **Could** o **Won't** según el SP del sprint 4.
- Si el SP del sprint 4 después del Planning Poker es justo para Must + Should, HU-21 baja a Won't sin pérdida de defensa.

---

## 7. Tratamiento de empates y casos límite

### 7.1 Elemento ambiguo entre dos categorías

Si un elemento cumple criterios de dos categorías adyacentes (Must/Should o Should/Could), se aplica el principio conservador: **se asigna la categoría inferior**. Una HU "casi Must" es Should; una HU "casi Should" es Could.

La razón es que el Planning Poker y la distribución de sprints prefieren conservar holgura. Si el sprint 4 tiene SP de sobra, una HU Should asciende informalmente a Must para ese sprint; lo inverso (una HU Must descender) es más doloroso académicamente.

### 7.2 Elemento sin clasificación clara

Si un elemento no cae claramente en ninguna categoría (caso raro), se documenta como **Pendiente de decisión** con una nota que explique el problema. Estos casos se resuelven en una mini-ceremonia adicional, no en línea.

### 7.3 Inconsistencia detectada en la verificación de consistencia (Paso 5)

Si una HU Must depende de una TTH que el algoritmo clasificó como Should, se revisa qué clasificación ajustar. Por defecto la TTH sube a Must porque la dependencia es funcional. Sólo si la HU resulta Should tras revisión se mantiene la TTH como Should.

---

## 8. Instrucciones específicas para Claude Code al ejecutar la ceremonia

1. **Leer este documento completo antes de empezar.**
2. **Leer el backlog completo:** `BACKLOG_OVERVIEW.md`, `HU_BLOQUE_A.md` a `HU_BLOQUE_F.md`, `HU_MVP2.md`, `TAREAS_TECNICAS_HABILITADORAS.md`, `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md`.
3. **Leer la auditoría HU↔código** producida en Fase 4.1 antes de aplicar el Paso 3 del procedimiento.
4. **Ejecutar las cuatro pasadas en el orden:** HUs → TTH → RF → RNF. La razón es que la prioridad de las TTH deriva de las HUs, y la de los RF/RNF se contrasta contra las HUs/TTH origen.
5. **Ejecutar el Paso 5 (verificación de consistencia) después de cada pasada**, no al final.
6. **Producir `MOSCOW_RATIFICADA.md` con la estructura declarada en la sección 5** de este documento.
7. **Marcar como `Pendiente de decisión` cualquier caso límite no resoluble por el algoritmo** y dejar nota para revisión humana, en lugar de forzar una clasificación dudosa.
8. **No modificar `DECISIONS_HU.md` ni el documento RF/RNF.** La MoSCoW ratificada es documento operativo separado; los ajustes a las prioridades sugeridas del documento normativo se aplicarán, si corresponde, en una sesión metodológica futura (no en esta ejecución).

---

## 9. Criterios de éxito de la ceremonia

La ceremonia se considera bien ejecutada si:

1. Los 107 elementos del backlog (21 HUs + 11 TTH + 22 RF + 53 RNF) tienen clasificación MoSCoW asignada.
2. Cada ajuste respecto a la prioridad sugerida tiene justificación de máximo 2 líneas citando criterio operacional y evidencia.
3. La verificación de consistencia del Paso 5 pasa para los cuatro grupos.
4. El alcance declarado del MVP1 (sección 5) es coherente con el cronograma del sprint 4 (la suma de SP de los Must se contrastará en Planning Poker; si excede el SP disponible, se vuelve a esta ceremonia para revisar).
5. La salida es defendible argumentativamente ante el jurado de tesis: por qué cada Must es Must, por qué cada Won't es Won't.

---

## 10. Anexo — Tabla de referencia rápida de criterios Must

Para acelerar la ejecución, esta tabla resume los disparadores de "Must" más probables sobre el backlog actual de CerebroVial. Es heurística, no normativa.

| Disparador | Aplicación esperada |
|---|---|
| HU del Operador en tiempo real | HU-01, HU-02, HU-05, HU-10, HU-11, HU-12 |
| HU de sustento técnico del adaptativo | HU-06, HU-07, HU-08, HU-13, HU-14 |
| HU de evidencia gerencial | HU-16, HU-17 |
| HU que materializa Objetivo 1 | HU-03, HU-04 |
| TTH habilitadora de operación primaria | TTH-04, TTH-05, TTH-08, TTH-09, TTH-10 |
| TTH transversal de plataforma | TTH-01, TTH-02, TTH-03 |
| TTH de validación académica | TTH-07 (simulación SUMO) |
| RNF crítico de continuidad | RNF-REL-01 a REL-09, RNF-SAF-01, RNF-SAF-03 |
| RNF crítico de auditoría | RNF-SEC-01, RNF-REL-04 |
| RNF crítico de rendimiento | RNF-PERF-01, RNF-PERF-02 |

Esta lista es punto de partida; la ratificación final puede ajustarla.
