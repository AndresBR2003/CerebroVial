# Mensaje de arranque para nueva sesión — Redacción del Bloque E

> Copia el contenido de la sección "Mensaje a copiar" al inicio de la nueva sesión de Claude. Adjunta los 11 documentos listados al final.

---

## Mensaje a copiar

Hola. Vengo de una sesión previa donde cerramos el **Bloque D** del Product Backlog del proyecto CerebroVial (tesis de ingeniería de software). Necesito que continúes desde donde quedó.

### Contexto rápido del proyecto

CerebroVial es un sistema inteligente de control adaptativo de semáforos para una intersección de Miraflores, Lima. Proyecto de tesis. El sistema integra **visión computacional** (sensor de estado), **modelo predictivo** (anticipa congestión con la escala jam level 0-5 inspirada en Waze por D-009), **motor adaptativo** (selecciona entre Webster/MaxPressure/MTC) y **validación SUMO**. Marco metodológico: Lean Inception (Caroli) adaptado al contexto académico, con SCRUM para ejecución posterior.

### Documentos adjuntos (en orden de lectura recomendado)

1. `DECISIONS_HU.md` — Decisiones metodológicas sobre HUs (DHU-001 a DHU-014). **Léelo primero y por completo.** Las decisiones más recientes (DHU-012 a DHU-014) cierran el Bloque D y la auditoría de coherencia documental.

2. `HU_BLOQUE_A.md` (v4) — Bloque A cerrado: 1 HU operativa (acceso por rol) + 3 TTH.

3. `HU_BLOQUE_B.md` — Bloque B cerrado: 8 HUs (HU-02 a HU-09). Referencia de formato y profundidad esperada.

4. `HU_BLOQUE_C.md` — Bloque C cerrado: 3 HUs operativas (HU-10, HU-11, HU-12) + 2 TTH (TTH-04, TTH-05).

5. `HU_BLOQUE_D.md` — Bloque D cerrado: 3 HUs operativas (HU-13, HU-14, HU-15). **Referencia más cercana** al trabajo del Bloque E porque ambos contienen componentes técnicos profundos del sistema. Imitar este formato exactamente al redactar las HUs/TTH del Bloque E.

6. `TAREAS_TECNICAS_HABILITADORAS.md` — TTH-01 a TTH-06 actuales. **El Bloque E muy probablemente introducirá TTH-07 y más** porque las 4 features del Bloque E son componentes centrales del sistema (visión, predictor, motor, integración SUMO) con baja probabilidad de tener Persona del producto beneficiaria directa.

7. `DECISIONS.md` — Decisiones técnicas D-001 a D-009. **Particularmente relevantes para el Bloque E:** D-001 (monolito modular), D-006 (GRU univariado por intersección), D-007 (visión como componente demostrable, no en loop de validación), D-008 (SUMO end-to-end), D-009 (jam level Waze).

8. `FEATURE_BACKLOG_DETALLADO.md` — Detalle completo de las 41 features. Las features del Bloque E según el Sequencer del Inception son **F32 (SUMO), F33 (visión), F34 (GRU), F35 (motor adaptativo)**.

9. `LEAN_INCEPTION_CEREBROVIAL.md` — Inception completo.

10. `EVOLUCION_TESIS.md` — Narrativa del proyecto.

11. `LEAN_INCEPTION_INVESTIGACION.md` — Fundamentación bibliográfica.

### Lo que está cerrado del Bloque E (no se renegocia)

El Bloque E corresponde a los **Componentes centrales del sistema**. Cuatro features lo componen según el Sequencer del Inception:

- **F32 — Integración con SUMO para simulación del entorno.** Cuello de botella declarado del MVP1 (ver ficha F32). D-008 le dio rol central como "columna vertebral de datos del proyecto". Provee tanto el dataset de entrenamiento del GRU como los escenarios de validación cuantitativa.

- **F33 — Módulo de visión que produce métricas de estado.** D-007 lo declara componente demostrable con validación independiente (métricas de detección), **no en el loop de validación cuantitativa del sistema integrado**. Es sensor de estado en tiempo real.

- **F34 — Módulo predictivo GRU servido vía API.** D-006 cierra GRU univariado por intersección, descarta STGNN. D-009 cierra la variable predicha como jam level 0-5 (constructo Waze). Consume dataset de F32. Es consumido por HU-03 (predicción al Operador), HU-04 (vista combinada), y HU-14 (métricas de evaluación del modelo).

- **F35 — Motor adaptativo (Webster + MaxPressure + MTC).** Es el aporte de ingeniería principal del trabajo según `EVOLUCION_TESIS.md`. Ya está significativamente construido al cierre arquitectónico (semana 6). Consume predicciones de F34 y estado observado de F33. Su comportamiento es consumido por HU-05, HU-06, HU-07, HU-08 del Operador y por HU-15 del Administrador (configuración de parámetros).

### Lo que está abierto y se resuelve durante la redacción del Bloque E

1. **Clasificación HU vs TTH de F32, F33, F34, F35.** Estas cuatro features son **componentes técnicos internos del sistema sin Persona del producto beneficiaria directa en el sentido estricto**. Aplicando DHU-004 directamente, las cuatro son fuertes candidatas a TTH. Pero hay matices que conviene discutir:

   - **F33 (visión)** tiene una contraparte académica que sí tiene Persona beneficiaria (el Operador consume su salida vía HU-02 sobre flujo y cola). ¿Se modela como TTH con presentación inglobada o como HU operativa? Mi expectativa: **TTH**, porque HU-02 ya entrega el valor al Operador; F33 es el sustrato técnico que la habilita.

   - **F35 (motor adaptativo)** es el aporte central del proyecto. Pero el valor del motor adaptativo al Operador ya está cubierto por HU-05 (estrategia activa), HU-06 (explicación), HU-07 (notificación), HU-08 (historial). ¿F35 es TTH (componente que habilita ese conjunto de HUs) o requiere HU adicional?

   La decisión consolidada va probablemente en una nueva DHU (¿DHU-015?) análoga a DHU-013 del Bloque D, declarando la clasificación TTH/HU de las cuatro features y la justificación.

2. **Granularidad de las TTH.** ¿Una TTH por cada componente (TTH-07 = SUMO, TTH-08 = visión, TTH-09 = GRU, TTH-10 = motor)? ¿O alguna agrupación? Mi inclinación: **una TTH por componente** porque cada uno tiene su propio ciclo de implementación, dependencias, y validación independiente; agruparlas oscurece el plan de trabajo.

3. **Validación de cada componente.** Cada TTH del Bloque E debe declarar su criterio de validación (cómo se sabe que está "Done"):
   - F32 / SUMO: ¿criterio de "topología cargada y simulación corriendo end-to-end"? ¿algún umbral de fidelidad de la topología?
   - F33 / Visión: D-007 cierra "métricas de detección estándar sobre dataset etiquetado representativo". Concretar dataset y umbrales.
   - F34 / GRU: ¿qué MAE / RMSE / accuracy mínimos se consideran aceptables? ¿qué pasa si no se alcanzan?
   - F35 / Motor: ¿validación funcional (las tres estrategias responden correctamente) o validación cuantitativa (mejora vs Webster fijo)? La validación cuantitativa pertenece más al capítulo de validación de la tesis que al criterio de Done de la TTH.

4. **Dependencias entre TTH del Bloque E y otros bloques.** SUMO (F32) es prerrequisito de GRU (F34) (dataset de entrenamiento) y del motor adaptativo (F35) en validación. ¿Cómo se ordenan en el cronograma? Esto es importante para la sustentación.

5. **Composición con HUs operativas previas.** Cada TTH debe declarar qué HUs operativas la consumen, como ya hicieron TTH-04 (consumida por HU-10, HU-11, HU-12, HU-13). Esto cierra el círculo de trazabilidad.

### Reglas críticas de redacción (síntesis de DHU-001 a DHU-014)

- **Sujetos válidos en HUs:** Personas del producto (Operador, Gerente, Administrador) o enumeración explícita. El sistema y el Equipo de Desarrollo NUNCA son sujetos. **Si una feature no tiene Persona del producto beneficiaria directa, es TTH, no HU.**

- **HUs agnósticas a la implementación (DHU-006):** las HUs no mencionan tecnologías concretas (visión, GRU, SUMO, Webster, MaxPressure, MTC, Waze). Lenguaje funcional. **Las TTH sí pueden mencionar tecnologías concretas** porque su naturaleza es técnica y son los contratos de implementación. Esta diferencia es importante para el Bloque E.

- **Robustez ante interrupción (DHU-005):** toda HU operativa que muestre datos en tiempo real incluye CA de manejo de fuente caída. Las TTH del Bloque E pueden ser las **fuentes** que caen; su contrato debe declarar comportamiento ante fallo.

- **TTH como categoría separada (DHU-004 y DHU-010):** features de comportamiento técnico interno sin Persona beneficiaria directa → TTH. Cada TTH se redacta con criterios técnicos de terminado (CT-XX.Y), no Given-When-Then.

- **Cobertura por composición:** patrón establecido para F02, F25, F30, F31; aplicable también en el Bloque E si alguna feature queda cubierta por composición de otras.

- **RNF declarados (DHU-007):** las HUs terminan con sección "Candidatos a RNF (para futuro documento RF/RNF)". Las TTH no necesariamente; sus criterios técnicos suelen incluir requisitos no funcionales como criterios de Done.

- **Formato esperado:** las HUs del Bloque E (si las hay) siguen el formato de HU-13/HU-14/HU-15. Las TTH siguen el formato de TTH-04/TTH-05 (CT numerados, sección de notas técnicas, tabla de trazabilidad con HUs y otras TTH).

### Lo que necesito hacer en esta sesión

1. **Cerrar primero la clasificación HU vs TTH** de F32, F33, F34, F35 mediante una nueva DHU (probable DHU-015), análoga a DHU-013 del Bloque D.

2. **Redactar las TTH** que correspondan (estimación inicial: 3-4 TTH, codificadas TTH-07 a TTH-10).

3. **Redactar las HUs operativas** si la clasificación arroja alguna (estimación inicial: 0-1 HU; probable que el bloque sea solo TTH).

4. **Al cerrar, generar los documentos finales actualizados:**
   - `HU_BLOQUE_E.md` (nuevo, incluso si solo contiene TTH del bloque y mapeo).
   - `TAREAS_TECNICAS_HABILITADORAS.md` (actualizado con las nuevas TTH).
   - `DECISIONS_HU.md` (actualizado con DHU-015 y cualquier decisión menor del bloque).
   - Actualización cruzada de "Próximos pasos" y "Documentos relacionados" en HU_BLOQUE_A/B/C/D.

### Numeración

El Bloque D cerró en HU-15. Si el Bloque E introduce HUs operativas, la numeración continúa secuencial: HU-16 en adelante. Si solo introduce TTH, no hay numeración nueva de HUs; las TTH siguen desde TTH-07.

### Modo de trabajo acordado

Mismo modo que los bloques B, C y D: trabajo elemento por elemento en modo conversacional. Cada TTH o HU se redacta, se discute, se aprueba, se cierra, y recién entonces paso a la siguiente. Las decisiones metodológicas (DHU-015 y posibles otras) se cierran ANTES de redactar los elementos que dependen de ellas.

### Verificación de coherencia esperada

Antes de empezar a redactar las TTH y HUs:

- **Leer DHU-013 y DHU-014** completas. DHU-013 es el patrón directo a imitar (clasificación de features por aplicación de DHU-004). DHU-014 muestra cómo se consolidan decisiones menores en una sola DHU.

- **Verificar consistencia cruzada** entre documentos antes de proceder, como se hizo en las sesiones de Bloque D y de la auditoría DHU-012. Si detectas inconsistencias, señalarlas antes de avanzar, no aplicar cambios retroactivos sin acuerdo.

- **Confirmar el contexto** antes de proponer la clasificación de F32-F35. Particularmente, releer D-006, D-007, D-008, D-009 que afectan directamente al Bloque E.

**Por favor confirma que tienes claro el contexto y empezamos por cerrar la clasificación HU vs TTH de F32, F33, F34, F35 mediante DHU-015.** Si detectas inconsistencias entre los documentos o tienes preguntas antes de empezar, dímelo primero.

---

## Lista de documentos a adjuntar (todos disponibles)

1. `DECISIONS_HU.md` (versión más reciente, con DHU-001 a DHU-014).
2. `HU_BLOQUE_A.md` (v4).
3. `HU_BLOQUE_B.md` (versión final con HU-02 a HU-09).
4. `HU_BLOQUE_C.md` (versión final con HU-10, HU-11, HU-12).
5. `HU_BLOQUE_D.md` (versión final con HU-13, HU-14, HU-15).
6. `TAREAS_TECNICAS_HABILITADORAS.md` (versión actual con TTH-01 a TTH-06).
7. `DECISIONS.md` (D-001 a D-009).
8. `FEATURE_BACKLOG_DETALLADO.md`.
9. `LEAN_INCEPTION_CEREBROVIAL.md`.
10. `EVOLUCION_TESIS.md`.
11. `LEAN_INCEPTION_INVESTIGACION.md`.

## Notas operativas para iniciar la sesión

- El asistente debe leer al menos `DECISIONS_HU.md` (DHU-013 y DHU-014 con detenimiento), `DECISIONS.md` (D-006, D-007, D-008, D-009), `HU_BLOQUE_D.md` (para imitar formato) y la sección de F32-F35 en `FEATURE_BACKLOG_DETALLADO.md` antes de proponer cualquier clasificación.
- Si el asistente detecta que un documento adjunto no llegó al contexto o quedó truncado, debe leerlo desde disco antes de avanzar, como se hizo en sesiones previas.
- Si alguna decisión del Bloque E contradice o requiere revisar una decisión cerrada del Bloque A, B, C o D, el asistente debe señalarlo explícitamente antes de proceder, no aplicar cambios retroactivos sin acuerdo.
- **Particular atención a D-007 (visión como demostrable, no en loop de validación cuantitativa):** la TTH/HU correspondiente a F33 debe respetar esa separación. Métricas de detección por su lado; validación cuantitativa del sistema integrado por SUMO (F32).
- **Particular atención a D-006 (GRU univariado por intersección):** la TTH correspondiente a F34 debe declarar GRU univariado y descartar explícitamente STGNN como fuera de alcance. La componente espacial es trabajo futuro (F37).
- **El motor adaptativo (F35) está significativamente construido al momento de redactar el Bloque E.** La TTH correspondiente puede declarar criterios de Done que reflejen el estado actual del código más que requisitos nuevos. Verificar con `EVOLUCION_TESIS.md` Fase 3.
