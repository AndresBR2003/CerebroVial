# Protocolo de Distribución en 4 Sprints — CerebroVial

> Protocolo formal ejecutable para distribuir los 107 elementos del Product Backlog en 4 sprints, con anclaje retroactivo a los sprints 1, 2 y 3 ya ejecutados y planificación predictiva del sprint 4.
>
> **Insumo:** `MOSCOW_RATIFICADA.md` (Fase 1) + `ESTIMACION_SP.md` (Fase 2) + `AUDITORIA_HU_CODIGO.md` (Fase 4 previa) + repositorio del proyecto con `git log`.
>
> **Salida esperada:** `DISTRIBUCION_SPRINTS.md` con tabla 4×N (4 sprints × N elementos) y SP por celda, más narrativa de cada sprint.
>
> **Ejecutor previsto:** Claude Code en la máquina del proyecto.

---

## 1. Propósito y supuestos

El proyecto académico de CerebroVial está estructurado en 4 sprints SCRUM. Al momento de redactar este protocolo, los sprints 1, 2 y 3 están concluidos cronológicamente y produjeron código real; el sprint 4 está por empezar. El backlog formal del proyecto fue redactado en simultáneo con la ejecución, por lo que la asignación HU↔sprint no quedó documentada al momento de cada sprint.

Este protocolo reconstruye la asignación de los sprints 1-3 (forense) y planifica el sprint 4 (predictiva), produciendo una distribución única defendible académicamente.

**Supuestos operacionales:**

- Cada sprint tiene **duración aproximadamente igual** en tiempo calendario. Si tu cronograma académico declara duraciones distintas, sustituye esta sección antes de ejecutar.
- El sprint 4 dispone del mismo SP-de-capacidad que un sprint promedio de los anteriores, salvo declaración explícita.
- Se acepta **asimetría retrospectiva entre sprints 1, 2 y 3** porque no se planificaron con SP. El equilibrio entre los 4 sprints es **deseable hasta ±20%**, no estricto. Una asimetría mayor exige justificación argumentada en el documento de salida.
- Se prefiere **no modificar el sprint histórico para forzar equilibrio**. Si sprint 1 = 40 SP y sprint 2 = 15 SP, eso es lo que pasó. Se documenta; no se reescribe.

---

## 2. Definiciones operacionales

### 2.1 Asignación de un elemento a un sprint

Un elemento (HU, TTH o RNF transversal) se asigna a un sprint si y sólo si su trabajo se ejecutó (o se planea ejecutar) **mayoritariamente** dentro del periodo de ese sprint. Para una HU parcial:

- Si la parte construida se hizo en sprint 1 y la parte restante se hará en sprint 4, la HU **se reparte**: SP ejecutado entra a sprint 1, SP restante entra a sprint 4. Es la única excepción al "mayoritariamente en un sprint".
- Si la parte construida se hizo entre sprint 1 y sprint 2 (sin separación clara), se asigna al sprint donde se inició y se documenta que finalizó en el siguiente.

### 2.2 SP ejecutado en sprint histórico

El SP ejecutado de una HU/TTH (de `ESTIMACION_SP.md`) se asigna al sprint histórico donde se construyó. Para asignar al sprint correcto se usa la evidencia siguiente, en orden de prioridad:

1. **git log filtrado por fecha:** los commits que tocan archivos relacionados con la HU/TTH, agrupados por fecha y comparados con las fechas declaradas de cada sprint.
2. **Estructura de directorios o módulos:** si el código está estructurado por feature o por fase, esa estructura informa la asignación.
3. **Convenciones de mensajes de commit:** si los mensajes incluyen referencias a sprint, HU o feature, se usan.
4. **Inferencia por dependencia técnica:** TTHs de infraestructura (TTH-01, TTH-02, TTH-03) presumen sprint 1; subsistemas centrales (TTH-08, TTH-09, TTH-10) presumen sprints 1 o 2; HUs de presentación presumen sprints 2 o 3.

Si después de aplicar los cuatro métodos no es posible asignar con confianza, el elemento se marca como **Indeterminado** y se asigna al sprint más probable con nota explicativa.

### 2.3 SP restante en sprint 4

Todo SP restante de elementos Must se asigna al sprint 4 obligatoriamente. SP restante de elementos Should se asigna al sprint 4 si la capacidad del sprint lo permite (sección 5); de lo contrario se documenta como **alcance opcional condicional**.

SP restante de elementos Could se asigna al sprint 4 sólo si Must y Should ya están dentro de la capacidad y queda holgura.

---

## 3. Reconstrucción forense de los sprints 1, 2 y 3

### 3.1 Identificación de las fechas-frontera entre sprints

Claude Code identifica las fechas de inicio y fin de cada sprint:

- **Fuente preferida:** documento académico del proyecto (cronograma de tesis) si está disponible.
- **Fuente alternativa:** `git log` agrupado por densidad temporal. Los sprints SCRUM clásicos duran 2-4 semanas; los huecos relativos en la frecuencia de commits sugieren las fronteras.
- **Fuente complementaria:** mensajes de commit que mencionen explícitamente "fin de sprint", "sprint review", o etiquetas/tags del repo.

Si las fechas no son claras, Claude Code declara fronteras tentativas en su salida y las propone para verificación humana.

### 3.2 Mapeo commits → HU/TTH

Para cada commit:

1. Identificar los archivos modificados.
2. Determinar qué HU/TTH implementan principalmente esos archivos (usando la auditoría `AUDITORIA_HU_CODIGO.md`).
3. Asignar el commit a una HU/TTH primaria y opcionalmente a HUs secundarias si el commit toca varias.

El resultado de este paso es una tabla `commit → HU/TTH primaria → sprint`.

### 3.3 Reconstrucción del SP ejecutado por sprint

Sumar el SP ejecutado de cada HU/TTH asignada a un sprint dado:

- Para HUs completas asignadas íntegramente a un sprint: SP ejecutado completo va al sprint.
- Para HUs parciales cuyo trabajo se hizo en un solo sprint: SP ejecutado va al sprint.
- Para HUs parciales cuyo trabajo se distribuyó entre dos sprints: se reparte proporcionalmente. Heurística: si los commits están equilibrados temporalmente entre los dos sprints, 50/50; si hay clara concentración en uno, 70/30.

El SP total ejecutado en los sprints 1, 2 y 3 debe ser igual a la suma de `SP ejecutado` de todos los elementos en `ESTIMACION_SP.md`. Esto es **verificación de consistencia obligatoria**.

### 3.4 Identificación de TTHs sin HU correspondiente clara

Algunas TTHs (especialmente TTH-01, TTH-02, TTH-03, TTH-11) no producen una HU asociada visible al usuario. Su asignación a sprint se hace por evidencia de commits, no por HU.

### 3.5 Salida de la fase forense

Una tabla intermedia con la siguiente estructura:

| Sprint | Elementos asignados | SP ejecutado del sprint | Periodo aproximado |
|---|---|---|---|
| 1 | HU-XX, TTH-YY... | XX | DD-MM a DD-MM |
| 2 | ... | XX | ... |
| 3 | ... | XX | ... |

Esta tabla es input directo de la sección 4.

---

## 4. Capacidad del sprint 4 y suma proyectada

### 4.1 Cálculo de la capacidad del sprint 4

Tres métodos, aplicados en orden:

#### Método 1 — Promedio de los sprints históricos

`Capacidad sprint 4 = promedio(SP sprint 1, SP sprint 2, SP sprint 3)`.

Este método asume que la velocity es estable. Es buen punto de partida pero puede ser optimista si los sprints históricos tuvieron curva de aprendizaje o si el sprint 4 enfrenta trabajo de naturaleza distinta.

#### Método 2 — Velocity ajustada por tendencia

Si sprint 1 = 30 SP, sprint 2 = 35 SP, sprint 3 = 40 SP, hay tendencia creciente y `Capacidad sprint 4 ≈ 42-45 SP` (extrapolación moderada).

Si sprint 1 = 45 SP, sprint 2 = 30 SP, sprint 3 = 20 SP, hay tendencia decreciente que sugiere fatiga o complejidad creciente. Capacidad sprint 4 ≈ 18-22 SP.

#### Método 3 — Calibración por SP restante de Must

Calcular `SP restante de Must` (de `ESTIMACION_SP.md`). Si este número:

- **Cabe holgadamente** en la capacidad del Método 1: sprint 4 incluye Must + Should + posible Could. Bien.
- **Cabe ajustado** (90-100% de capacidad): sprint 4 incluye Must + Should. Should con justificación si entra apretado.
- **Excede capacidad**: SE INVOCA EL LOOP CON MOSCOW. No se fuerza el sprint 4.

### 4.2 Loop con MoSCoW si Must excede capacidad

Si SP restante de Must > capacidad estimada del sprint 4:

1. Identificar HUs/TTH Must con SP restante mayor.
2. Para cada una, evaluar si puede bajar a Should (parte de los CAs no críticos se postergan).
3. Si baja a Should, sus CAs no críticos se documentan como Could explícitamente.
4. Iterar hasta que SP restante de Must ≤ capacidad.
5. Registrar este loop en `DISTRIBUCION_SPRINTS.md` con la nueva versión de MoSCoW.

---

## 5. Distribución final y verificaciones

### 5.1 Tabla 4×N

La distribución final es una tabla con 4 columnas (Sprint 1, 2, 3, 4) y N filas (cada elemento del backlog asignado, sea HU, TTH o RNF transversal). Las celdas contienen el SP asignado al elemento en ese sprint:

- 0 (o vacío) si el elemento no participa de ese sprint.
- SP ejecutado en sprint histórico para elementos completos o parciales-en-sprint-histórico.
- SP restante en sprint 4 para elementos parciales o no iniciados.

**Restricción:** la suma por fila debe igualar el SP total del elemento en `ESTIMACION_SP.md`.

**Restricción:** la suma por columna debe ser igual al SP del sprint correspondiente (SP histórico para sprints 1-3, SP planificado para sprint 4).

### 5.2 Verificación de equilibrio

Calcular:

- SP por sprint (suma de columna).
- Promedio de los 4 sprints.
- Desviación de cada sprint respecto al promedio.
- Coeficiente de variación: desviación estándar / promedio.

**Umbrales operacionales:**

- Si todas las desviaciones individuales son ≤ ±20%: **equilibrio aceptable**.
- Si alguna desviación está entre ±20% y ±35%: **equilibrio aceptable con justificación** (curva de aprendizaje, infraestructura del sprint 1, etc.).
- Si alguna desviación supera ±35%: **rebalanceo recomendado**. Como sprints 1-3 son inmodificables, el rebalanceo sólo puede afectar al sprint 4. Si el sprint 4 es el desviado, se evalúa subir/bajar HUs Should/Could.

### 5.3 Verificación de coherencia de dependencias

Cada elemento asignado al sprint N debe tener sus dependencias resueltas en sprints anteriores o en el mismo sprint:

- HU-02 (estado actual) depende de TTH-08 (visión); TTH-08 debe estar en sprint ≤ N de HU-02.
- HU-03 (predicción) depende de TTH-09 (modelo predictivo); TTH-09 debe estar en sprint ≤ N de HU-03.
- HU-13, HU-14, HU-15 (vistas del Administrador) presumen TTH-04 (fallback) y TTH-08, TTH-09, TTH-10 disponibles.
- HU-16, HU-17 (reportería gerencial) presumen registro histórico (parte de TTH-10 y la persistencia del Bloque B).

Si una HU asignada al sprint 4 depende de una TTH no completada en sprints 1-3 y la TTH no está también en sprint 4, hay **violación de dependencia**. Se ajusta uno de los dos.

### 5.4 Tabla resumen por sprint

Después de la tabla 4×N, se produce un resumen narrativo por sprint:

#### Sprint 1

- **Periodo:** DD-MM a DD-MM.
- **SP del sprint:** XX.
- **Elementos:** lista de HUs y TTHs.
- **Foco principal:** infraestructura, autenticación, sustrato (descripción de 2-3 líneas).
- **Justificación si SP > promedio + 20% o SP < promedio - 20%.**

Análogo para sprint 2, sprint 3 y sprint 4.

#### Sprint 4 (planificado)

Adicionalmente:
- **Elementos Must:** lista con SP.
- **Elementos Should:** lista con SP.
- **Elementos Could opcionales si holgura:** lista con SP.
- **Estrategia de cierre:** primero Must, luego Should en orden de impacto, luego Could si holgura. Si imprevistos comprimen el sprint, Could se descarta primero, luego Should bajos.

---

## 6. Procedimiento operacional

### 6.1 Orden de ejecución

1. **Paso 1 — Identificar fronteras temporales de sprints históricos** (sección 3.1).
2. **Paso 2 — Mapear commits → HU/TTH → sprint** (sección 3.2).
3. **Paso 3 — Calcular SP ejecutado por sprint histórico** (sección 3.3).
4. **Paso 4 — Verificar consistencia: suma de SP ejecutado en sprints 1-3 = suma de SP ejecutado en `ESTIMACION_SP.md`** (sección 3.3).
5. **Paso 5 — Estimar capacidad del sprint 4** (sección 4.1).
6. **Paso 6 — Contrastar SP restante de Must contra capacidad** (sección 4.1 Método 3).
7. **Paso 7 — Si Must excede capacidad, ejecutar loop MoSCoW** (sección 4.2). Repetir hasta convergencia.
8. **Paso 8 — Asignar Should al sprint 4 hasta capacidad** (sección 2.3).
9. **Paso 9 — Asignar Could opcionalmente** si queda holgura.
10. **Paso 10 — Construir la tabla 4×N** (sección 5.1).
11. **Paso 11 — Verificar equilibrio y dependencias** (secciones 5.2 y 5.3).
12. **Paso 12 — Producir narrativa por sprint** (sección 5.4).
13. **Paso 13 — Producir `DISTRIBUCION_SPRINTS.md`** con toda la información.

### 6.2 Iteraciones y revisiones

Cualquier ajuste hecho durante los Pasos 7 a 9 (loop MoSCoW, bajadas de Should a Could, etc.) debe registrarse explícitamente en una sección **"Decisiones tomadas durante la distribución"** del documento de salida.

---

## 7. Ejemplo hipotético resuelto

Estos números son ilustrativos, no predicen el resultado real.

### 7.1 SP por sprint histórico (forense)

| Sprint | Periodo | SP ejecutado |
|---|---|---|
| 1 | Marzo 2026 | 32 |
| 2 | Abril 2026 | 28 |
| 3 | Abril-Mayo 2026 | 25 |

Total ejecutado: 85 SP. Promedio: 28.3 SP. Coeficiente de variación: 12%.

### 7.2 SP restante para sprint 4

De `ESTIMACION_SP.md` hipotético:
- SP restante de Must: 22.
- SP restante de Should: 18.
- SP restante de Could: 13.

### 7.3 Decisión

- Capacidad sprint 4 estimada (Método 1 + Método 2 con tendencia decreciente leve): 25 SP.
- Must (22) cabe. Faltan 3 SP para llegar a 25. Should completo no cabe (18). Se eligen 1-2 Should de mayor impacto que sumen 3 SP.
- Could: 0 (sin holgura).

Resultado:
- Sprint 4: 22 (Must) + 3 (Should parcial) = 25 SP.
- Promedio cuatro sprints: (32+28+25+25)/4 = 27.5 SP.
- Desviaciones: sprint 1 +16%, sprint 2 +2%, sprint 3 -9%, sprint 4 -9%. **Todas dentro de ±20%.**
- Conclusión: equilibrio aceptable sin justificación adicional. Sprint 1 tuvo carga superior por curva de aprendizaje y construcción de TTH de plataforma (1, 2, 3, 8); justificación opcional.

---

## 8. Salida esperada

El documento `DISTRIBUCION_SPRINTS.md` contiene:

### 8.1 Tabla 4×N (la tabla principal)

| Código | Título corto | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | SP total |
|---|---|---|---|---|---|---|

Una fila por elemento (HU, TTH, RNF transversal). Celdas con SP asignado o 0.

### 8.2 Resumen agregado por sprint

| Sprint | SP del sprint | Elementos | Desviación respecto al promedio |
|---|---|---|---|

### 8.3 Narrativa por sprint

Una subsección por sprint: periodo, foco, elementos principales, justificación si desviación > 20%.

### 8.4 Sección especial Sprint 4

- Plan de implementación: Must primero (en qué orden), luego Should priorizado, luego Could si holgura.
- Estrategia ante imprevistos.
- Riesgos identificados (HUs con SP alto, TTH no validadas, dependencias críticas).

### 8.5 Verificaciones ejecutadas

- Suma de SP ejecutado = SP ejecutado declarado en `ESTIMACION_SP.md`. ✓ o ✗ con explicación.
- Equilibrio entre sprints (coeficiente de variación, desviaciones).
- Dependencias resueltas. ✓ o ✗ con explicación si falta.

### 8.6 Decisiones tomadas

Lista de decisiones no triviales hechas durante la distribución:
- HUs reasignadas entre sprints históricos por inferencia ambigua de commits.
- HUs Must bajadas a Should por exceder capacidad.
- HUs Should subidas al sprint 4 para llenar holgura.
- TTHs con dependencias atípicas.

### 8.7 Anexo: tabla de mapeo commit → HU

Tabla intermedia producida en Paso 2 (sección 3.2), útil para auditoría académica y para defensa del método ante el jurado.

---

## 9. Instrucciones específicas para Claude Code

1. **Leer este documento completo y los dos documentos previos** (`CEREMONIA_MOSCOW.md` y `CEREMONIA_PLANNING_POKER.md`) **antes de empezar**.
2. **Leer `MOSCOW_RATIFICADA.md`, `ESTIMACION_SP.md` y `AUDITORIA_HU_CODIGO.md`.**
3. **Tener acceso completo al repo del proyecto** con permisos para ejecutar `git log` y leer cualquier archivo.
4. **Ejecutar los pasos del 6.1 en orden.**
5. **No saltarse el Paso 4** (verificación de consistencia entre forense y `ESTIMACION_SP.md`). Si la verificación falla, parar y reportar antes de continuar.
6. **Si el loop MoSCoW del Paso 7 modifica clasificaciones**, registrar en sección 5 del documento de salida.
7. **Producir `DISTRIBUCION_SPRINTS.md` con la estructura de la sección 8.**
8. **No modificar el código del repo durante la ejecución.** Esta ceremonia es de planificación, no de implementación.
9. **No modificar `MOSCOW_RATIFICADA.md` ni `ESTIMACION_SP.md`** salvo que el loop MoSCoW del Paso 7 lo exija; en ese caso, registrar la modificación con timestamp en el documento que cambia.

---

## 10. Criterios de éxito

La distribución se considera bien ejecutada si:

1. La tabla 4×N tiene todos los elementos Must + Should asignados.
2. La suma por columna iguala el SP del sprint correspondiente.
3. La suma por fila iguala el SP total del elemento en `ESTIMACION_SP.md`.
4. El SP ejecutado total reconstruido por la forense iguala la suma de SP ejecutado de `ESTIMACION_SP.md`.
5. Las desviaciones de cada sprint respecto al promedio están dentro de ±20% (deseable) o documentadas con justificación si exceden ±20%.
6. Las dependencias técnicas entre elementos están respetadas en el orden temporal de sprints.
7. La narrativa de cada sprint es defendible académicamente (por qué se hizo eso en ese sprint, qué objetivos del producto se cubrieron).

---

## 11. Nota sobre la naturaleza retrospectiva-predictiva del documento

Este protocolo produce un documento que es a la vez:

- **Retrospectivo** para los sprints 1-3 (reconstruye lo que pasó con datos del código).
- **Predictivo** para el sprint 4 (planifica lo que va a pasar).

Esta dualidad es central al proyecto académico. La defensa de tesis no requiere que la distribución haya sido planificada con anticipación; requiere que la distribución final sea coherente, trazable, justificada y completa. El protocolo está diseñado para producir exactamente eso.

Si durante la ejecución del sprint 4 la realidad diverge del plan (porque el SP estimado fue impreciso o porque surgen imprevistos), el documento se actualiza con un sub-apartado "Ejecución real del sprint 4" que documenta la divergencia. Esto NO invalida el documento original: el protocolo SCRUM acepta replanificación intra-sprint.

---

## 12. Anexo: heurística para detectar fronteras de sprint en `git log`

Si las fechas exactas de los sprints no están documentadas:

1. Obtener `git log --pretty=format:"%h %ad %s" --date=short` y construir la serie temporal de commits.
2. Calcular el número de commits por semana.
3. Identificar **valles** en la serie temporal: semanas con 0 o 1 commit rodeadas de semanas con varios. Estos valles típicamente coinciden con fines de sprint (entrega, descanso, replanificación) o con semanas no laborales.
4. La frontera tentativa entre sprint N y sprint N+1 es el lunes de la semana posterior al valle.
5. Verificar la hipótesis: cada sprint resultante debería tener 2-4 semanas de actividad. Si los sprints resultan de 1 semana o de 8 semanas, la hipótesis está mal; revisar con métodos complementarios.

Esta heurística no es exacta pero produce fronteras lo bastante defendibles para el ejercicio académico. Las fronteras se documentan como **tentativas** y se sustituyen si el estudiante tiene fronteras formales en su cronograma de tesis.
