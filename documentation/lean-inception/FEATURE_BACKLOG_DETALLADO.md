# Feature Backlog Detallado — CerebroVial

> Documento complementario al `LEAN_INCEPTION_CEREBROVIAL.md` (Artefacto 7 y Artefacto 8).
>
> Contiene el detalle completo de las **41 features identificadas** del proyecto (35 originales del Brainstorming + 6 fichas livianas de Trabajos Futuros formalizadas en DHU-012), con su revisión Técnica / UX / Negocio y su clasificación final en MVP1 / MVP2 / Trabajos Futuros.
>
> **Pensado como insumo para:** (a) conversación con asesor durante el Showcase, (b) conversión posterior a Historias de Usuario en formato "Como X, quiero Y, para Z", (c) referencia técnica durante la ejecución de sprints.

**Fecha del Brainstorming original:** 2026-05-11
**Última actualización:** 2026-05-14 (DHU-012: agregadas fichas F36-F41, reclasificación de F21, renombrado de F27, ficha de F26 referencia a TTH-04 como fuente canónica)
**Versión:** 1.1

---

## Cómo leer este documento

Cada feature está descrita con la siguiente estructura:

- **ID y nombre.**
- **Descripción funcional.**
- **Persona que la consume.**
- **Journey y paso que cubre.**
- **Revisión técnica:** complejidad y riesgos.
- **Revisión UX:** claridad y consideraciones.
- **Revisión de negocio:** objetivo del producto que realiza.
- **Clasificación:** MVP1 / MVP2 / Trabajos Futuros.
- **Estado actual en el repo** (si aplica).
- **Notas adicionales** relevantes para implementación.

**Sobre las fichas livianas de Trabajos Futuros (F36-F41):** estas fichas no tienen toda la estructura completa de una ficha MVP1 porque no se redactan como HU ni se construyen. Conservan los campos esenciales (descripción, persona, complejidad estimada, razón de salida del MVP) y omiten campos como "Revisión UX" o "Estado actual en el repo".

---

## Convenciones

| Símbolo | Significado |
|---|---|
| **★** | Feature crítica para MVP1 (sin esto el producto no funciona) |
| **◆** | Feature importante para MVP1 (entra si el cronograma lo permite) |
| **○** | Feature de MVP2 (documentada como HU, se construye condicional a holgura tras cerrar MVP1) |
| **▷** | Feature de Trabajos Futuros (documentada como ficha, NO se redacta como HU, NO se construye) |
| ✓ | Construida total o parcialmente en el repo actual |
| ⚠ | Riesgo técnico identificado |
| 🆕 | Por construir desde cero |

**Personas:**
- **OP** = Operador de Tráfico Municipal
- **GE** = Gerente de Tránsito Municipal
- **AD** = Administrador del Sistema
- **SYS** = Sistema (feature transversal, sin persona directa)

**Niveles de complejidad técnica:**
- **Bajo** = 1-2 días de trabajo, sin dependencias.
- **Medio** = 3-5 días, requiere coordinación con otros componentes.
- **Medio-Alto** = 1-2 semanas, decisiones arquitectónicas implicadas.
- **Alto** = 2+ semanas, riesgo de scope creep.

---

# Bloque A — Infraestructura mínima

## F01 — Autenticación al sistema ★

**Descripción:** Permite a los usuarios autenticarse en el sistema con credenciales (usuario/contraseña), recibiendo un token JWT que se usa en las llamadas posteriores a la API.

**Persona:** OP, GE, AD (todas)
**Journey:** Paso 1 de todas las journeys.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** JWT + bcrypt en backend FastAPI, formulario de login en frontend.
- **Estado actual:** ✓ Backend tiene tabla `User` y modelo Alembic creado. Falta endpoint de login y dependency `get_current_user`. Pendiente de implementación.
- **Riesgos:** Ninguno significativo. Patrón estándar.

**Revisión UX:** Claro. Formulario simple con usuario, contraseña, botón "Iniciar sesión", mensaje de error si las credenciales son incorrectas.

**Revisión de negocio:** Transversal — habilita el acceso al sistema. Sin esta feature ninguna otra es accesible.

**Clasificación:** MVP1 — Bloque A.

**Modelado:** Tarea Técnica Habilitadora (TTH-01) según DHU-001. Ver `TAREAS_TECNICAS_HABILITADORAS.md`.

**Notas:** Considerar refresh tokens si se quiere sesiones largas. Para MVP1 basta con un token con expiración razonable (8 horas, por ejemplo).

---

## F29 — Roles y permisos ★

**Descripción:** Sistema RBAC (Role-Based Access Control) con tres roles: Operador, Gerente, Administrador. Cada rol tiene acceso a un subconjunto de endpoints y vistas del sistema.

**Persona:** OP, GE, AD (todas)
**Journey:** Transversal — habilita la diferenciación de experiencia por persona.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Campo `role` en tabla `User`, decoradores de FastAPI para autorización por endpoint, lógica condicional en frontend para mostrar/ocultar vistas según rol.
- **Estado actual:** 🆕 Por construir. La tabla User existe pero no tiene campo de rol.
- **Riesgos:** Asignación de roles a endpoints requiere disciplina; cualquier endpoint nuevo necesita decisión explícita de qué roles lo acceden.

**Revisión UX:** Claro. El usuario solo ve lo que su rol le permite. Sin "permission denied" visibles — las opciones que no tiene simplemente no aparecen.

**Revisión de negocio:** Transversal — soporte a las 3 personas con accesos distintos.

**Clasificación:** MVP1 — Bloque A.

**Modelado:** HU-01 del Bloque A. Ver `HU_BLOQUE_A.md`.

**Notas:** Para MVP1 los roles son fijos y se asignan al crear usuario en BD. No se implementa UI para gestión de roles (eso sería F adicional que no aparece en el backlog actual).

---

## F30 — Persistencia de estados históricos ★

**Descripción:** Tabla en base de datos que almacena el estado del tráfico observado a lo largo del tiempo (flujo, cola, velocidad, densidad por intersección y dirección, con timestamp). Este histórico es la fuente para los dashboards del Gerente y para reentrenamiento del modelo.

**Persona:** GE (consume), SYS (genera)
**Journey:** Habilitador de Journey 2 (Gerente).

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Tabla SQLAlchemy con índices por timestamp e intersección, política de retención (¿cuánto histórico se guarda?).
- **Estado actual:** ✓ Parcial. Hay migrations de Alembic, pero la tabla específica para histórico de tráfico no existe aún.
- **Riesgos:** Volumen de datos. Si SUMO emite estados cada segundo durante simulaciones largas, la tabla crece rápido. Definir granularidad de agregación (¿estados cada 1s, 10s, 1min?).

**Revisión UX:** No aplica (es backend).

**Revisión de negocio:** Habilitador del Objetivo 4 (demostrar mejora cuantificable). Sin histórico, no hay comparativa temporal.

**Clasificación:** MVP1 — Bloque A.

**Modelado:** Persistencia inglobada como Criterios de Aceptación en HUs del Gerente (Bloque F), según regla cerrada en el Bloque A. No se redacta como HU dedicada.

**Notas:** Discutir granularidad con asesor. Recomendación: agregar cada 30 segundos para validación; menor granularidad para producción hipotética.

---

## F31 — Persistencia de decisiones del motor ◆

**Descripción:** Tabla append-only que registra cada decisión del motor adaptativo: timestamp, intersección, estrategia seleccionada (Webster/MaxPressure/MTC), razón de selección (resumen de inputs), tiempos aplicados.

**Persona:** OP (consume vía F10), AD (consume para análisis), SYS (genera)
**Journey:** Habilitador de F10 (log de decisiones).

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Tabla simple, append-only. Sin actualizaciones.
- **Estado actual:** 🆕 Por construir. El motor adaptativo actual no persiste decisiones.
- **Riesgos:** Ninguno significativo.

**Revisión UX:** No aplica (es backend).

**Revisión de negocio:** Habilitador del Objetivo 3 (adaptar el control). Permite trazabilidad y auditoría de decisiones automáticas.

**Clasificación:** MVP1 — Bloque A.

**Modelado:** Inglobada como CA-08.1 de HU-08 del Bloque B, según regla cerrada en el Bloque A.

**Notas:** Es la base de datos del "explainability" del sistema. Cada decisión registrada con sus inputs permite reconstruir el "por qué" de cada cambio de estrategia.

---

# Bloque B — Operador, núcleo de monitoreo

## F02 — Dashboard principal de la intersección ★

**Descripción:** Vista principal del sistema para el Operador. Muestra de un vistazo: la intersección en estudio, su estado actual (flujo, cola, velocidad), la estrategia de control activa, y un panel resumen de predicción de congestión.

**Persona:** OP
**Journey:** Journey 1, Paso 2 (verificar estado del tráfico).

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** React component principal, layout con grids (Tailwind o similar), integración con SSE/WebSocket para actualización en tiempo real.
- **Estado actual:** ✓ Parcial. Existe `views/control/` con 9 archivos (1034 líneas) que cubren visualización de motor adaptativo. Falta integración como dashboard único cohesivo.
- **Riesgos:** Diseño visual y layout son la parte ambigua. Decisiones: ¿una pantalla con todo o pestañas?

**Revisión UX:** Claro a nivel de información, ambiguo a nivel de layout visual. Necesita decisión de wireframe antes de construir.

**Revisión de negocio:** Realiza el Objetivo 1 (observar el estado actual del tráfico).

**Clasificación:** MVP1 — Bloque B.

**Modelado:** Cubierto por composición visual de HU-02, HU-03, HU-04, HU-05 y HU-06 del Bloque B. No se redacta como HU dedicada (es contenedor visual, no funcionalidad independiente). Ver `HU_BLOQUE_B.md` resumen del bloque.

**Notas:** Recomendación: prototipo en papel o Figma rápido antes de codear. El Operador pasa todo su turno en esta vista.

---

## F03 — Visualización de flujo vehicular en tiempo real ★

**Descripción:** Componente visual dentro del Dashboard que muestra el flujo vehicular actual (vehículos por minuto) en cada uno de los accesos de la intersección, actualizado en tiempo real.

**Persona:** OP
**Journey:** Journey 1, Paso 2.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** React + biblioteca de gráficos (Recharts, Chart.js), conexión SSE al backend para updates.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** La fuente de datos depende del modo: en validación SUMO emite valores; en operación hipotética los emite el módulo de visión. Diseñar la API para abstraerse de la fuente.

**Revisión UX:** Claro. Visualización tipo gauge o serie temporal corta (últimos 5-10 minutos).

**Revisión de negocio:** Realiza el Objetivo 1.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** Parte de HU-02 (Monitoreo del estado actual de la intersección) del Bloque B, combinada con F04.

**Notas:** Considerar mostrar el flujo en 4 direcciones (Norte, Sur, Este, Oeste) o las que correspondan a la geometría real de la intersección de Miraflores que se elija.

---

## F04 — Visualización de cola por dirección ★

**Descripción:** Componente que muestra la longitud actual de la cola de vehículos esperando en cada acceso de la intersección. Visualización tipo barra o número grande.

**Persona:** OP
**Journey:** Journey 1, Paso 2.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Mismo que F03 (React + gráficos + SSE).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Misma observación de fuente que F03.

**Revisión UX:** Claro. Visualización numérica con indicador de nivel (verde/amarillo/rojo) según umbrales.

**Revisión de negocio:** Realiza el Objetivo 1.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** Parte de HU-02 (Monitoreo del estado actual de la intersección) del Bloque B, combinada con F03.

**Notas:** Los umbrales de "verde/amarillo/rojo" son parametrizables (entran en F20 — Configuración del motor).

---

## F05 — Panel de predicción de congestión ★

**Descripción:** Componente que muestra la predicción del modelo GRU para los próximos N minutos (ej. 5, 10, 15) en cada dirección de la intersección. Visualización tipo serie temporal con horizonte futuro.

**Persona:** OP
**Journey:** Journey 1, Paso 3.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Recharts/similar. Endpoint `/predictions/predict` ya existe.
- **Estado actual:** ✓ Backend tiene el endpoint con RandomForest baseline. Falta el frontend de visualización.
- **Riesgos:** La interpretación visual de "congestión futura" requiere claridad sobre la métrica que se predice (¿velocidad? ¿flujo? ¿cola?). Definir antes de construir.

**Revisión UX:** Claro a nivel de información. La métrica predicha debe ser una sola y fácil de interpretar.

**Revisión de negocio:** Realiza el Objetivo 2 (anticipar congestión).

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-03 del Bloque B.

**Notas:** Mantener la fachada del endpoint estable; el modelo detrás puede cambiar (RandomForest → GRU) sin que el frontend se entere.

---

## F06 — Vista combinada estado actual + predicción ◆

**Descripción:** Vista que muestra simultáneamente el estado actual del tráfico y la predicción del modelo, permitiendo al Operador ver "ahora" y "futuro" juntos en una sola pantalla.

**Persona:** OP
**Journey:** Journey 1, Paso 4 (identificar congestión próxima).

**Revisión técnica:**
- **Complejidad:** Medio-Alto.
- **Stack:** Composición visual sobre F03 + F04 + F05.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** ⚠ UX no trivial. Cómo se muestran "ahora" y "futuro" sin saturar al operador es una decisión de diseño importante. Sugiere prototipado visual antes de implementar.

**Revisión UX:** ⚠ Ambiguo. Decisión visual abierta. Opciones:
- Línea temporal continua con punto "ahora" marcado y proyección futura.
- Dos paneles lado a lado (presente y futuro) con escalas alineadas.
- Heatmap con tiempo en un eje y direcciones en el otro.

**Revisión de negocio:** Realiza Objetivos 1 + 2 simultáneamente. Es la feature más distintiva del Operador.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-04 del Bloque B.

**Notas:** Recomendación: hacer un prototipo simple (incluso en papel) antes de codear. Esta vista define la "cara" del sistema.

---

## F07 — Panel del motor adaptativo (estrategia activa) ★

**Descripción:** Componente que muestra cuál de las tres estrategias (Webster, MaxPressure, MTC) está actualmente aplicando el motor, junto con los parámetros activos de esa estrategia (tiempos de verde por dirección).

**Persona:** OP
**Journey:** Journey 1, Paso 5.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** React component. El backend ya expone la estrategia activa.
- **Estado actual:** ✓ Existe parcialmente en `views/control/`. Falta consolidar como panel del dashboard principal.
- **Riesgos:** Ninguno significativo.

**Revisión UX:** Claro. Indicador grande del nombre de la estrategia + tabla con tiempos asignados a cada dirección.

**Revisión de negocio:** Realiza el Objetivo 3 (adaptar el control).

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-05 del Bloque B.

**Notas:** Considerar agregar un timestamp de "última actualización de estrategia" para que el Operador sepa cuánto tiempo lleva la estrategia activa.

---

## F08 — Explicación de razón de selección de estrategia ◆

**Descripción:** Texto breve que explica al Operador por qué el motor seleccionó la estrategia actual. Nivel de detalle: nivel mínimo (texto plano predefinido por estrategia, basado en el estado que disparó la selección).

**Persona:** OP
**Journey:** Journey 1, Paso 5.

**Revisión técnica:**
- **Complejidad:** ⚠ Alto si se hace mal, Bajo si se hace bien.
- **Stack:** Sistema de plantillas de texto con sustitución de variables. NO se usa NLP, XAI ni nada similar.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** ⚠ Riesgo de scope creep si se intenta hacer "explainable AI" real. Decisión cerrada durante Inception: **nivel mínimo, texto predefinido por estrategia**.

**Revisión UX:** ⚠ Ambiguo en alcance, claro en implementación. Ejemplo de texto nivel mínimo:
- *"Se seleccionó MaxPressure porque la cola de la dirección Norte (X vehículos) excede el umbral configurado."*
- *"Se seleccionó Webster porque el flujo en todas las direcciones está balanceado."*

**Revisión de negocio:** Realiza el Objetivo 3 con valor agregado de explicabilidad. Aporta confianza del Operador en el sistema automático.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-06 del Bloque B.

**Notas:** Definir un catálogo de 5-10 plantillas de texto que cubran los casos típicos de selección. No intentar cubrir todos los casos posibles.

---

## F09 — Notificación visual de cambio de estrategia ◆

**Descripción:** Cuando el motor cambia de estrategia, se muestra una notificación temporal (toast o banner) al Operador con la información del cambio.

**Persona:** OP
**Journey:** Journey 1, Paso 6.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Componente toast estándar (react-toastify o similar), trigger por evento SSE de cambio.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno significativo.

**Revisión UX:** Claro. Toast con auto-dismiss después de 5-10 segundos. Incluir hora, estrategia anterior, estrategia nueva, razón breve.

**Revisión de negocio:** Realiza el Objetivo 3 con énfasis en feedback inmediato.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-07 del Bloque B.

**Notas:** No abusar de notificaciones. Si el motor cambia muy frecuentemente, agrupar.

---

## F10 — Log de decisiones del motor adaptativo ◆

**Descripción:** Vista con el historial cronológico de decisiones del motor: timestamp, estrategia, razón, parámetros aplicados. Filtros básicos por fecha y por estrategia.

**Persona:** OP (consulta), AD (consulta para análisis)
**Journey:** Journey 1, Paso 6 (revisión posterior).

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Tabla paginada en frontend, endpoint REST en backend que consulta F31 (persistencia de decisiones).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Volumen de datos si el motor cambia frecuentemente. Paginación obligatoria.

**Revisión UX:** Claro. Tabla con columnas: timestamp, estrategia, razón, acciones (ver detalle).

**Revisión de negocio:** Realiza el Objetivo 3 con auditabilidad.

**Clasificación:** MVP1 — Bloque B.

**Modelado:** HU-08 del Bloque B (con F31 inglobada como CA-08.1).

**Notas:** Considerar exportación a CSV en el futuro. No incluir en MVP1.

---

## F11 — Módulo de notas/incidencias del Operador ○

**Descripción:** Permite al Operador registrar notas o incidencias durante su turno (texto libre asociado a timestamp). Las notas se guardan y se pueden consultar posteriormente.

**Persona:** OP
**Journey:** Journey 1, Paso 8.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Tabla en BD, formulario de creación, vista de listado con filtros.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Bajo, pero requiere decisiones de UX (¿categorías predefinidas o solo texto libre?).

**Revisión UX:** Claro a nivel funcional. Decisión pendiente: ¿incluir adjuntos? ¿asociar a una decisión específica del motor?

**Revisión de negocio:** Soporte al Operador. No realiza directamente ninguno de los 4 objetivos.

**Clasificación:** **MVP2.** Documentada como HU completa (HU-09 del Bloque B); su construcción es condicional a la holgura del cronograma tras cerrar MVP1.

**Modelado:** HU-09 del Bloque B (ya redactada como HU MVP2).

**Notas:** Decisión tomada durante Inception. Bajo la semántica refinada de MVP2 por DHU-012, esta feature entra al sprint si hay holgura tras cerrar las HUs MVP1. No se descarta a priori.

---

# Bloque C — Operador, operación degradada

## F22 — Indicador visible de estado degradado ★

**Descripción:** Banner o indicador prominente en la parte superior del dashboard que aparece cuando el sistema está operando en modo degradado. Indica el nivel de degradación (1, 2 o 3) o falla total.

**Persona:** OP
**Journey:** Journey 4, Paso 2.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Componente React condicional, color codificado por nivel (amarillo nivel 1, naranja nivel 2, rojo nivel 3, rojo intenso falla total).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno.

**Revisión UX:** Claro. Banner persistente (no auto-dismiss) hasta que el sistema se recupere.

**Revisión de negocio:** Soporte a robustez del sistema (parte de los 4 objetivos bajo degradación).

**Clasificación:** MVP1 — Bloque C.

**Modelado:** HU-10 del Bloque C.

**Notas:** Considerar accesibilidad: el color no debe ser el único indicador (incluir ícono y texto). El modelo de estados se refinó durante el Bloque C (DHU-008): 3 niveles de degradación + falla total. Ver `HU_BLOQUE_C.md`.

---

## F23 — Vista simplificada de estado de componentes (Operador) ◆

**Descripción:** Vista accesible desde el banner de degradación que muestra qué componente está fallando, con descripción en lenguaje no técnico para el Operador.

**Persona:** OP
**Journey:** Journey 4, Paso 3.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** React component. Reutiliza la lógica de health check de F17 (panel del Admin) con UI simplificada.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno.

**Revisión UX:** Claro. Lista de componentes con icono de estado (OK / Degradado / Falla) y descripción simple ("El módulo que detecta vehículos no está respondiendo").

**Revisión de negocio:** Soporte a robustez.

**Clasificación:** MVP1 — Bloque C.

**Modelado:** HU-11 del Bloque C (con CA-11.9 que absorbe el espíritu visual de F25 según DHU-011).

**Notas:** Diferencia con F17: F23 es para el Operador (lenguaje no técnico), F17 es para el Administrador (lenguaje técnico, métricas).

---

## F24 — Mensaje explicativo del modo degradado activo ◆

**Descripción:** Texto contextual que explica al Operador qué significa el modo degradado actual: qué componente falló, qué fallback está activo, qué se perdió de funcionalidad.

**Persona:** OP
**Journey:** Journey 4, Paso 4.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Catálogo de textos predefinidos por combinación de fallas. Renderizado condicional según estado.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno.

**Revisión UX:** Claro. Ejemplos:
- Nivel 1: *"El componente periférico de detección de tráfico no está disponible. El sistema sigue prediciendo congestión pero sin información de detección en tiempo real."*
- Nivel 2: *"El componente predictivo principal no está disponible. El sistema usa un predictor de respaldo de menor precisión."*
- Nivel 3: *"El motor adaptativo no está disponible. El sistema opera con tiempos preconfigurados para garantizar continuidad."*

**Revisión de negocio:** Soporte a robustez.

**Clasificación:** MVP1 — Bloque C.

**Modelado:** HU-12 del Bloque C.

**Notas:** Mantener catálogo pequeño (4-6 mensajes). No intentar cubrir todas las combinaciones posibles. Los textos siguen vocabulario agnóstico a la implementación según DHU-006.

---

## F25 — Indicación en cada panel afectado del modo activo ◆

**Descripción:** Cuando un componente está en modo degradado, los paneles del dashboard que dependen de ese componente muestran una etiqueta visual indicando "modo fallback" o "datos parciales".

**Persona:** OP
**Journey:** Journey 4, Paso 5.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Etiqueta condicional en cada panel afectado.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno.

**Revisión UX:** Claro. Etiqueta discreta (no banner gigante) en la esquina del panel afectado.

**Revisión de negocio:** Soporte a robustez. Transparencia con el usuario sobre el estado de los datos.

**Clasificación:** MVP1 — Bloque C.

**Modelado:** Cubierta por composición de HU-10 (alerta transversal) + HU-11 con CA-11.9 (resalte visual de componentes no-OK) + HU-12 (explicación compuesta) + marcas pasivas del Bloque B (DHU-005 Casos A y B). No se redacta como HU dedicada. Decisión documentada en DHU-011.

**Notas:** Coherente con F22 y F24 — todas son piezas del sistema de comunicación de degradación.

---

## F26 — Lógica de fallback en cascada (backend) ★

**Descripción:** Mecanismo backend que detecta caídas de componentes del sistema y aplica fallbacks en cascada según la condición observada, transitando al sistema entre estados operativos (operación normal, degradado nivel 1, degradado nivel 2, degradado nivel 3, falla total).

**Persona:** SYS (no expuesto directamente al usuario, pero su efecto sí)
**Journey:** Habilitador transversal de Journey 4.

**Revisión técnica:**
- **Complejidad:** ⚠ Medio-Alto.
- **Stack:** Manejo de excepciones, timeouts en llamadas internas, estado del sistema persistido, transiciones entre modos.
- **Estado actual:** 🆕 Por construir. Hoy el motor no tiene fallback.
- **Riesgos:** ⚠ Decisiones arquitectónicas importantes: dónde se detectan las fallas (¿cada componente reporta su salud o un orquestador hace polling?), cómo se persiste el estado, cómo se notifica al frontend.

**Revisión UX:** No aplica directamente (es backend), pero su efecto se ve en F22-F25.

**Revisión de negocio:** Soporte a la propiedad de robustez ("nunca empeoramos el statu quo"). Esta es la feature que materializa el aporte de ingeniería de degradación controlada.

**Clasificación:** MVP1 — Bloque C.

**Modelado:** Tarea Técnica Habilitadora (TTH-04) según DHU-010. El **contrato técnico canónico** del modelo de fallback en cascada vive en TTH-04 (criterios CT-04.1 a CT-04.10) del documento `TAREAS_TECNICAS_HABILITADORAS.md`, incluyendo los 5 estados operativos del sistema (normal, degradado nivel 1, degradado nivel 2, degradado nivel 3, falla total) y su lógica de transición. Esta ficha mantiene la descripción funcional de alto nivel; el detalle técnico vive en TTH-04.

**Notas:** El patrón arquitectónico sugerido es Circuit Breaker, con orquestador central que agrega estados individuales en estado operativo global. Decisión final del patrón se cierra al implementar la TTH. Las transiciones entre modos son explícitas y auditables.

---

## F27 — Configuración de tiempos fijos para degradado nivel 3 ◆

**Descripción:** Formulario que permite al Administrador configurar los tiempos fijos de los semáforos que se aplicarán cuando el sistema entre en degradado nivel 3.

**Persona:** AD
**Journey:** Configuración previa a Journey 4 (no es un paso de journey, es configuración).

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Formulario en frontend, persistencia en BD (tabla de configuración), endpoint para consulta desde el motor.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Decisión: ¿una tabla única de tiempos o tabla por franja horaria (mañana pico, valle, tarde pico, nocturno)?

**Revisión UX:** Claro. Formulario con campos numéricos por dirección y por fase del semáforo.

**Revisión de negocio:** Soporte a la propiedad de robustez. Permite que el Administrador calibre el estado degradado nivel 3 según la intersección.

**Clasificación:** MVP1 — Bloque C.

**Modelado:** Tarea Técnica Habilitadora (TTH-05) según DHU-010. La reconsideración de TTH-05 a la luz del Bloque D se cerró en DHU-013: TTH-05 se mantiene íntegra (no se divide en TTH + HU del Administrador) porque mezclarla con F20 rompería la cohesión de esa HU. Ver `TAREAS_TECNICAS_HABILITADORAS.md`.

**Notas:** Para MVP1, una tabla única de tiempos es suficiente. La tabla por franja horaria queda como mejora futura (no en MVP2 explícitamente, pero documentable). Nota: la palabra "modo seguro" se renombró a "degradado nivel 3" según DHU-012 para uniformidad del vocabulario.

---

# Bloque D — Administrador, soporte técnico

## F17 — Panel de salud de componentes del sistema ★

**Descripción:** Vista para el Administrador que muestra el estado actual de cada componente del sistema (API core, módulo de visión, modelo predictivo, motor adaptativo, base de datos) con indicador de OK / Degradado / Falla.

**Persona:** AD
**Journey:** Journey 3, Paso 2.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Endpoints de health check por componente, polling desde frontend cada N segundos, indicadores visuales.
- **Estado actual:** ✓ Parcial. Hay un health check básico, falta granularidad por componente.
- **Riesgos:** Definir qué significa "salud" para cada componente. Para el modelo predictivo: ¿está cargado? ¿responde rápido? ¿predice valores en rango razonable?

**Revisión UX:** Claro. Lista de componentes con indicador de color y métricas técnicas (latencia, uso de memoria si aplica).

**Revisión de negocio:** Soporte a operación. No realiza directamente ninguno de los 4 objetivos, pero los habilita.

**Clasificación:** MVP1 — Bloque D.

**Modelado:** HU-13 del Bloque D, según DHU-013 y DHU-014. Consume el endpoint CT-04.5 de TTH-04 (`GET /system/components/status`), con presentación técnica distinta a la de HU-11 del Operador (que consume el mismo endpoint con presentación simplificada). El contrato de CT-04.5 se amplió al cerrar HU-13 para cubrir los campos técnicos adicionales que HU-13 requiere (latencia, indicador de fallos recientes, timestamp de última evaluación exitosa).

**Notas:** Considerar usar el patrón `/health` y `/health/detailed` para que F23 (vista Operador) consuma `/health` simple y F17 (Admin) consuma `/health/detailed`.

---

## F18 — Panel de métricas del modelo predictivo ◆

**Descripción:** Vista para el Administrador que muestra las métricas actuales del modelo predictivo: MAE, RMSE actuales calculados sobre predicciones recientes vs valores observados.

**Persona:** AD
**Journey:** Journey 3, Paso 3.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Cálculo continuo de métricas en backend (comparando predicciones registradas vs valores observados), visualización con gráficas temporales.
- **Estado actual:** 🆕 Por construir. Requiere registrar predicciones para poder compararlas posteriormente.
- **Riesgos:** Decisión: ¿qué ventana temporal se usa para calcular las métricas? (última hora, último día, etc.)

**Revisión UX:** Claro. Gráficos de líneas con MAE y RMSE en el tiempo, valor actual destacado.

**Revisión de negocio:** Soporte al Objetivo 2 (anticipar congestión) — permite saber si el modelo sigue performando bien.

**Clasificación:** MVP1 — Bloque D.

**Modelado:** HU-14 del Bloque D, según DHU-013 y DHU-014. El sustrato técnico (registro de predicciones + cálculo de métricas agregadas) se ingloba como CAs dentro de la propia HU, siguiendo el patrón de F31 inglobada en HU-08. No se crea TTH adicional. HU-14 expone MAE, RMSE, accuracy y matriz de confusión 6×6 con tooltips de ayuda integrados.

**Notas:** Para SUMO la verdad ground truth está disponible (lo que SUMO efectivamente generó). Para producción hipotética, hay que esperar al siguiente periodo para tener el valor real.

---

## F19 — Comparativa de métricas del modelo vs baseline ○

**Descripción:** Vista que compara las métricas del modelo principal (GRU) contra las métricas del baseline (RandomForest) sobre el mismo periodo. Útil para decidir si el modelo principal sigue siendo superior.

**Persona:** AD
**Journey:** Journey 3, Paso 4.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Similar a F18 pero con dos series superpuestas.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Requiere mantener el baseline ejecutándose en paralelo al modelo principal (más recursos).

**Revisión UX:** Claro. Gráfico comparativo lado a lado.

**Revisión de negocio:** Soporte avanzado al Objetivo 2.

**Clasificación:** **MVP2.** Se documenta como HU completa en sesión MVP2 dedicada; su construcción es condicional a la holgura del cronograma tras cerrar MVP1.

**Modelado:** HU MVP2 (pendiente de redacción en sesión dedicada). No entra al Bloque D MVP1.

**Notas:** Razón de salida del MVP1: F18 ya cubre el caso de uso básico (saber si el modelo está bien). La comparativa vs baseline es valiosa pero no esencial para el MVP.

---

## F20 — Configuración de parámetros del motor adaptativo ◆

**Descripción:** Formulario para que el Administrador configure los parámetros del motor: umbrales de cola (referenciados en HU-02 CA-02.3 y HU-03 CA-03.3), umbral de congestión (default ≥ 3, atado a D-009), horizonte de predicción (referenciado en HU-03 CA-03.1), y otros parámetros internos del motor adaptativo.

**Persona:** AD
**Journey:** Journey 3, Paso 5.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Formulario en frontend, tabla de configuración en BD, endpoint para que el motor lea su configuración actual.
- **Estado actual:** 🆕 Por construir. El motor actual tiene parámetros hardcoded.
- **Riesgos:** Identificar qué parámetros se exponen y cuáles se mantienen internos. Demasiada configuración expone al Administrador a complejidad innecesaria.

**Revisión UX:** Claro a nivel funcional, requiere decisión sobre qué parámetros exponer.

**Revisión de negocio:** Soporte al Objetivo 3 (adaptar el control) con capacidad de ajuste fino.

**Clasificación:** MVP1 — Bloque D.

**Modelado:** HU-15 del Bloque D — una sola HU del Administrador, agnóstica a tecnologías según DHU-006, DHU-013 y DHU-014. El sustrato técnico (persistencia de parámetros + auditoría de cambios) se ingloba como CAs dentro de la propia HU. Cubre en MVP1 tres familias de parámetros: visualización del estado del tráfico (umbrales de cola), predicción y evaluación del modelo (horizonte, umbral de congestión, ventana de cálculo de métricas de HU-14), y monitor de salud del sistema (frecuencia de evaluación). Los parámetros internos de las estrategias del motor quedan fuera de MVP1.

**Notas:** Recomendación: exponer solo los parámetros críticos (3-5 máximo) en MVP1. Los avanzados se dejan internos por ahora. Parámetros mínimos a exponer: umbrales de cola verde/amarillo/rojo, umbral de congestión (jam level ≥ N), horizonte de predicción.

---

# Bloque E — Componentes centrales del sistema

## F32 — Integración con SUMO para simulación del entorno ★

**Descripción:** Módulo que integra el sistema con SUMO (Simulation of Urban MObility). Carga la topología de la intersección de estudio, genera escenarios de demanda, ejecuta simulaciones, expone el estado de la simulación al resto del sistema vía TraCI, y captura las métricas resultantes.

**Persona:** SYS (infraestructura de validación)
**Journey:** No aparece en journeys de operación. Es infraestructura de validación cuantitativa.

**Revisión técnica:**
- **Complejidad:** ⚠ Alto.
- **Stack:** SUMO + TraCI (Python API), configuración de red (NETEDIT u OpenStreetMap → netconvert), escenarios de demanda, integración con el motor adaptativo vía API.
- **Estado actual:** 🆕 Por construir desde cero. Cero SUMO en el repo actual.
- **Riesgos:** ⚠⚠ La feature de mayor riesgo cronológico del MVP1. Sin experiencia previa en SUMO, hay curva de aprendizaje real. Decisión D-008 le dio rol central.

**Revisión UX:** No aplica (no expuesto al usuario directamente).

**Revisión de negocio:** Realiza el Objetivo 4 (demostrar mejora cuantificable) y habilita la generación del dataset de entrenamiento del modelo (D-008).

**Clasificación:** MVP1 — Bloque E.

**Modelado:** A determinar al redactar el Bloque E (probablemente TTH dado que no tiene Persona del producto beneficiaria directa).

**Notas:** Ya trabajándose en proyecto Claude separado. Cuello de botella absoluto: si SUMO se atrasa, se atrasan F34 (GRU necesita dataset), F26 (fallback necesita validación), Bloque F (KPIs Gerente requieren datos).

---

## F33 — Módulo de visión que produce métricas de estado ★

**Descripción:** Módulo de visión computacional que procesa video de la intersección (streams o video grabado) y produce métricas de estado: conteo de vehículos por dirección, estimación de cola, flujo, densidad.

**Persona:** SYS (componente del sistema)
**Journey:** Habilitador del Objetivo 1 en operación hipotética. No participa en el loop de validación cuantitativa (D-007).

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** YOLO + OpenCV + lógica de tracking, exposición de métricas vía API.
- **Estado actual:** ✓ Construido parcialmente. Hay módulo funcional. Falta integración con BD para persistir métricas y exposición estandarizada.
- **Riesgos:** Las decisiones de D-007 ya cierran los riesgos principales (no se valida cuantitativamente, no participa en loop de KPIs).

**Revisión UX:** No aplica (es backend).

**Revisión de negocio:** Realiza el Objetivo 1 (observar el estado actual del tráfico) en operación.

**Clasificación:** MVP1 — Bloque E.

**Modelado:** A determinar al redactar el Bloque E.

**Notas:** Validación independiente del módulo se hace con métricas estándar de detección (precisión, recall, mAP) sobre dataset etiquetado (ver D-007 y `EVOLUCION_TESIS.md`).

---

## F34 — Módulo predictivo GRU servido vía API ★

**Descripción:** Modelo predictivo GRU univariado por intersección, entrenado sobre dataset sintético generado por SUMO (D-008), servido vía endpoint `/predictions/predict`. Reemplaza el RandomForestPredictor baseline actual.

**Persona:** SYS (componente del sistema)
**Journey:** Habilitador del Objetivo 2.

**Revisión técnica:**
- **Complejidad:** ⚠ Medio-Alto.
- **Stack:** PyTorch / TensorFlow para GRU, FastAPI para servir, integración con SUMO para generar dataset (D-008), pipeline de entrenamiento.
- **Estado actual:** 🆕 Por construir. Hoy hay RandomForest baseline funcionando.
- **Riesgos:** ⚠ Depende de F32 (sin dataset SUMO, no hay entrenamiento). RandomForest se mantiene como fallback (Nivel 2 de F26).

**Revisión UX:** No aplica (es backend).

**Revisión de negocio:** Realiza el Objetivo 2 (anticipar congestión).

**Clasificación:** MVP1 — Bloque E.

**Modelado:** A determinar al redactar el Bloque E.

**Notas:** Decisión D-006 cerrada durante Inception: GRU univariado, no STGNN. Time-then-Space descartado.

---

## F35 — Motor adaptativo (Webster + MaxPressure + MTC) ★

**Descripción:** Motor que implementa las tres estrategias de control (Webster, MaxPressure, MTC) y selecciona dinámicamente cuál aplicar según el estado predicho y observado de la intersección.

**Persona:** SYS (componente central)
**Journey:** Habilitador del Objetivo 3.

**Revisión técnica:**
- **Complejidad:** Bajo (relativo) — la mayor parte ya está construida.
- **Stack:** Python, lógica de selección, integración con predictor (F34) y métricas de estado (F33 o SUMO).
- **Estado actual:** ✓✓ Construido. `core_management_api/src/control/` contiene Webster + MaxPressure + MTC + AdaptiveEngine. Tests pytest pasando.
- **Riesgos:** Bajo. La pieza más madura del sistema.

**Revisión UX:** No aplica (es backend; su salida se ve en F07, F08).

**Revisión de negocio:** Realiza el Objetivo 3 (adaptar el control). Es el aporte de ingeniería central de la tesis.

**Clasificación:** MVP1 — Bloque E.

**Modelado:** A determinar al redactar el Bloque E.

**Notas:** Lo que falta: integrar con F34 (predicciones reales del GRU, no del baseline), con F26 (fallback en cascada), y con F31 (persistencia de decisiones).

---

# Bloque F — Gerente, reportería mínima

## F12 — Dashboard ejecutivo con KPIs agregados ★

**Descripción:** Vista para el Gerente que muestra los KPIs del periodo seleccionado: tiempo promedio de espera, longitud máxima de cola, throughput de la intersección, demora acumulada.

**Persona:** GE
**Journey:** Journey 2, Paso 3.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Backend calcula KPIs sobre F30 (persistencia histórica), frontend visualiza con cards de números grandes + gráficos.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Definir los KPIs específicos y su cálculo (¿promedio aritmético? ¿percentil 95?).

**Revisión UX:** Claro. Cards con números grandes para los 4 KPIs + gráfico temporal de cada uno.

**Revisión de negocio:** Realiza el Objetivo 4 (demostrar mejora cuantificable) desde la perspectiva del Gerente.

**Clasificación:** MVP1 — Bloque F.

**Modelado:** A determinar al redactar el Bloque F.

**Notas:** Los KPIs son los mismos que se usan para validar la tesis (ver MVP Canvas, Bloque 6). Esto asegura coherencia.

---

## F13 — Selector de periodo (semana, mes, rango personalizado) ★

**Descripción:** Componente que permite al Gerente seleccionar el periodo de análisis sobre el cual ver los KPIs.

**Persona:** GE
**Journey:** Journey 2, Paso 2.

**Revisión técnica:**
- **Complejidad:** Bajo.
- **Stack:** Componente date picker estándar (react-datepicker o similar).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Ninguno significativo.

**Revisión UX:** Claro. Opciones predefinidas (esta semana, semana anterior, este mes, mes anterior) + rango personalizado.

**Revisión de negocio:** Realiza el Objetivo 4 con flexibilidad temporal.

**Clasificación:** MVP1 — Bloque F.

**Modelado:** A determinar al redactar el Bloque F.

**Notas:** Considerar que el periodo seleccionado afecta a F12 y F14 simultáneamente.

---

## F14 — Vista comparativa entre periodos ◆

**Descripción:** Visualización que compara los KPIs del periodo actual con los KPIs de un periodo previo equivalente (semana actual vs semana anterior, etc.).

**Persona:** GE
**Journey:** Journey 2, Paso 4.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Recharts con dos series superpuestas, cálculo de variaciones porcentuales.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Decidir qué considera "periodo previo equivalente".

**Revisión UX:** Claro. Gráficos comparativos con indicadores de variación (↑ +5%, ↓ -3%, etc.).

**Revisión de negocio:** Realiza el Objetivo 4 con valor de tendencia.

**Clasificación:** MVP1 — Bloque F.

**Modelado:** A determinar al redactar el Bloque F.

**Notas:** Si el cronograma aprieta, esta feature es candidata a bajar a MVP2.

---

## F15 — Vista detallada de periodo específico ○

**Descripción:** Permite al Gerente hacer drill-down sobre un periodo problemático identificado en F12 o F14, viendo el detalle de eventos, decisiones del motor y datos observados de ese periodo.

**Persona:** GE
**Journey:** Journey 2, Paso 5.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Vista detallada que cruza F30 (histórico de estados) con F31 (decisiones del motor).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Volumen de información a mostrar.

**Revisión UX:** Más compleja que las anteriores. Requiere diseño cuidadoso para no saturar.

**Revisión de negocio:** Realiza el Objetivo 4 con profundidad investigativa.

**Clasificación:** **MVP2.** Se documenta como HU completa en sesión MVP2 dedicada; su construcción es condicional a la holgura del cronograma tras cerrar MVP1.

**Modelado:** HU MVP2 (pendiente de redacción en sesión dedicada).

**Notas:** Razón de salida: F12-F13-F14 cubren el caso de uso esencial. El drill-down es valor agregado, no central.

---

## F16 — Exportación de reportes a PDF/Excel ○

**Descripción:** Permite al Gerente exportar el reporte del periodo seleccionado a PDF (formato presentable) o Excel (datos crudos).

**Persona:** GE
**Journey:** Journey 2, Paso 6.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Librería de generación de PDF (ReportLab para backend, jsPDF para frontend), librería de Excel (openpyxl o xlsx-js).
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Diseño del formato PDF no trivial. Hacer un PDF "presentable" toma más tiempo de lo que parece.

**Revisión UX:** Claro a nivel funcional. Botones "Exportar a PDF" / "Exportar a Excel" en el dashboard ejecutivo.

**Revisión de negocio:** Soporte al Objetivo 4.

**Clasificación:** **MVP2.** Se documenta como HU completa en sesión MVP2 dedicada; su construcción es condicional a la holgura del cronograma tras cerrar MVP1.

**Modelado:** HU MVP2 (pendiente de redacción en sesión dedicada).

**Notas:** Razón de salida: complejidad técnica desproporcionada al valor académico. Los KPIs visibles en pantalla son suficientes para defensa.

---

# Bloque transversal — Features adicionales

## F28 — Botón de escalamiento al Administrador ○

**Descripción:** Permite al Operador escalar un incidente al Administrador cuando detecta algo anómalo que no puede resolver desde su rol.

**Persona:** OP (origen), AD (destino)
**Journey:** Journey 4, Paso 6.

**Revisión técnica:**
- **Complejidad:** Medio.
- **Stack:** Flujo de notificación entre roles, persistencia de incidentes escalados, vista para el Administrador.
- **Estado actual:** 🆕 Por construir.
- **Riesgos:** Define un patrón de flujo entre roles que no existe en otras features.

**Revisión UX:** Claro. Botón "Escalar a Administrador" en el panel de degradación.

**Revisión de negocio:** Soporte a la colaboración entre roles.

**Clasificación:** **MVP2.** Se documenta como HU completa en sesión MVP2 dedicada; su construcción es condicional a la holgura del cronograma tras cerrar MVP1.

**Modelado:** HU MVP2 (pendiente de redacción en sesión dedicada).

**Notas:** Razón de salida: flujo entre roles no central a los 4 objetivos del producto. El Operador puede contactar al Administrador por canales externos (teléfono, email) si es necesario.

---

# Trabajos Futuros — Líneas declaradas fuera del alcance

> Las features de esta sección fueron formalizadas como fichas en DHU-012 a partir de las direcciones declaradas en el Sequencer original del Inception y en `EVOLUCION_TESIS.md` sección 8. No se redactan como Historias de Usuario ni se construyen dentro del alcance del proyecto académico; se mencionan en el capítulo de trabajo futuro del documento de tesis.
>
> **Asimetría justificada:** F21 conserva ficha completa (originada en el Brainstorming del Inception); F36-F41 son fichas livianas (estructura reducida sin "Revisión UX" ni "Estado actual"), formalizadas posteriormente.

## F21 — Solicitud de reentrenamiento del modelo ▷

**Descripción:** Permite al Administrador solicitar el reentrenamiento del modelo predictivo con datos recientes. El reentrenamiento se ejecuta como tarea asíncrona.

**Persona:** AD
**Journey:** Journey 3, Paso 6 (declarado como "fuera del sprint" en el Journey).

**Revisión técnica:**
- **Complejidad:** ⚠ Alto.
- **Stack:** Pipeline MLOps completo: cola de tareas (Celery o similar), worker que ejecuta el reentrenamiento, persistencia del nuevo modelo, swap del modelo en producción.
- **Estado actual:** 🆕 Por construir desde cero. Requiere infraestructura adicional.
- **Riesgos:** ⚠ Tema de tesis aparte. No cabe en el cronograma.

**Revisión UX:** No definido en detalle. Botón "Reentrenar" + estado de la tarea en curso.

**Revisión de negocio:** Soporte avanzado al Objetivo 2.

**Clasificación:** **Trabajos Futuros.**

**Modelado:** Ficha de feature solamente. NO se redacta como HU. NO se construye. Se menciona en el capítulo de trabajo futuro del documento de tesis. Reclasificación documentada en DHU-012 (de "MVP2 — fuera del sprint" en versión previa a "Trabajos Futuros" en versión actual, por incompatibilidad con la semántica refinada de MVP2: F21 no es "construible si hay holgura"; su complejidad Alta y la dependencia de infraestructura MLOps lo excluyen del alcance académico).

**Notas:** Decisión cerrada durante Inception en versión original. Reclasificación a Trabajos Futuros en DHU-012 (2026-05-14) por refinamiento de la semántica de las categorías MVP. La ficha se conserva intacta como traza histórica del Brainstorming original.

---

## F36 — Reconocimiento de tipos de vehículos para priorización ▷

**Descripción:** Extensión del módulo de visión computacional para reconocer tipos específicos de vehículos (emergencias, transporte público, vehículos pesados) y permitir al motor adaptativo priorizar el paso de ciertos tipos según política configurable.

**Persona:** OP (lo consume vía mejor control), SYS (componente que la implementa)

**Complejidad estimada:** Alto (requiere reentrenamiento del modelo de visión, definición de políticas de priorización, integración con motor adaptativo).

**Stack tentativo:** YOLO entrenado con clases adicionales o modelo de clasificación de vehículos sobre detecciones existentes; lógica de prioridad en el motor adaptativo; UI de configuración de políticas para el Administrador.

**Razón de salida del MVP:** Línea de investigación adicional fuera del alcance académico. El reconocimiento por tipo de vehículo es un tema de visión computacional complejo en sí mismo y la integración con el motor introduce decisiones de política que merecen estudio dedicado (¿cuánto se prioriza? ¿qué pasa con la equidad? ¿cómo se evita gaming del sistema?).

**Revisión de negocio:** Mejora del Objetivo 3 (adaptar el control) incorporando priorización por tipo de usuario.

**Clasificación:** **Trabajos Futuros.**

**Notas:** Mencionada en el Sequencer original del Inception como dirección MVP3.

---

## F37 — Coordinación de ondas verdes entre intersecciones vecinas ▷

**Descripción:** Extensión del sistema a múltiples intersecciones interrelacionadas, con coordinación de tiempos para producir "ondas verdes" en corredores urbanos. Implica una arquitectura espacio-temporal del modelo predictivo y un motor de control distribuido.

**Persona:** OP (lo consume vía mejor flujo en el corredor), GE (lo consume vía mejores KPIs de red)

**Complejidad estimada:** Alto (requiere arquitectura completamente distinta del modelo: STGNN o atención sobre vecinos; coordinación de decisiones entre intersecciones; validación a escala de red).

**Stack tentativo:** Arquitectura espacio-temporal (STGNN, Graph Attention Networks o similar); orquestador de decisiones multi-intersección; topología de red expandida en SUMO; nuevos KPIs de red urbana (no solo de intersección individual).

**Razón de salida del MVP:** El alcance de validación del trabajo se centra en una intersección individual (decisión D-006). Una arquitectura espacio-temporal requiere múltiples nodos interrelacionados; no aplica al problema definido para el MVP1. La exploración inicial de `time_then_space.py` durante el desarrollo del proyecto sustenta esta línea como extensión natural.

**Revisión de negocio:** Realiza los 4 objetivos del producto a escala de red urbana (en lugar de intersección individual). Es la extensión natural de mayor valor del trabajo.

**Decisión técnica relacionada:** D-006 (GRU univariado por intersección, descarta STGNN para el alcance actual).

**Clasificación:** **Trabajos Futuros.**

**Notas:** Mencionada en el Sequencer original del Inception y en `EVOLUCION_TESIS.md` sección 8 como dirección principal de extensión.

---

## F38 — Procesamiento de datos reales de Waze ▷

**Descripción:** Adaptador que consume el feed real de Waze for Cities (formato CCP) y alimenta el sistema con datos de tráfico de Lima, en lugar de datos sintéticos de SUMO. Permite calibrar el modelo predictivo con condiciones reales y validar la transferibilidad de la simulación.

**Persona:** SYS (adaptador de fuente de datos)

**Complejidad estimada:** Medio (la arquitectura del sistema ya es agnóstica a la fuente de datos gracias a D-009 que usa jam level como variable de estado común; solo se requiere implementar el adaptador y obtener acceso al feed).

**Stack tentativo:** Cliente del feed CCP de Waze (autenticación, parsing de JSON con `jams[]`), almacenamiento del histórico, adaptador que convierte Waze → variable de estado del sistema, calibración del modelo con datos reales.

**Razón de salida del MVP:** No hay acceso a API key de Waze ni acuerdo con la municipalidad de Miraflores al momento de iniciar el proyecto académico. Depender de obtenerlo en 9 semanas es riesgo terminal. La incorporación se declara como trabajo futuro o bono académico si se obtienen los datos antes de la entrega.

**Revisión de negocio:** Mejora del Objetivo 2 (anticipar congestión) con datos reales, no sintéticos. Habilita la validación de transferibilidad del modelo SUMO → mundo real.

**Decisión técnica relacionada:** D-008 (SUMO end-to-end), D-009 (jam level Waze como variable de estado, lo cual ya hace la arquitectura compatible con esta extensión sin reentrenar).

**Clasificación:** **Trabajos Futuros.**

**Notas:** D-009 deja la arquitectura preparada para esta extensión: el modelo predice `jam_level`, y Waze ya emite `jam_level` directamente en su feed. Solo se requiere el adaptador, no se requiere reentrenamiento si los umbrales del constructo son coherentes.

---

## F39 — Despliegue real en Raspberry Pi como dispositivo de borde ▷

**Descripción:** Despliegue físico del sistema en una arquitectura distribuida: módulo `edge_device` (visión + reporte de estado) corriendo en una Raspberry Pi físicamente conectada a una cámara en una intersección de Miraflores; módulo `core_management_api` + frontend + base de datos corriendo en un servidor central. Comunicación por SSE/HTTP entre Pi y servidor.

**Persona:** SYS (infraestructura), AD (operación física)

**Complejidad estimada:** Alto (logística de hardware, configuración de red en sitio, gestión de fallos físicos, calibración de cámara en condiciones reales, acuerdo con la municipalidad para instalación).

**Stack tentativo:** Raspberry Pi 4 o superior con cámara, contenedor Docker del `edge_device` corriendo en ARM, túnel seguro hacia el servidor central, supervisión remota, plan de contingencia ante caída del enlace.

**Razón de salida del MVP:** El alcance del proyecto académico no incluye productivización ni instalación física (D-003, D-004). La arquitectura se demuestra como desplegable (separación de `edge_device` con dependencias mínimas, contenerización separada, comunicación HTTP) sin entregar el hardware. La operación física en una intersección real requiere acuerdo con la municipalidad y permisos que exceden el cronograma.

**Revisión de negocio:** Transición del producto de prototipo académico a sistema operativo real. Es la fase de productivización.

**Decisión técnica relacionada:** D-004 (Pi como demostración conceptual, no entrega).

**Clasificación:** **Trabajos Futuros.**

**Notas:** Mencionada en el Sequencer original del Inception y en `EVOLUCION_TESIS.md` sección 8. La viabilidad arquitectónica se demuestra durante el proyecto académico; lo que queda como trabajo futuro es la operación física en una intersección real.

---

## F40 — Notificaciones push y monitoreo proactivo de cámaras ▷

**Descripción:** Sistema de notificaciones push al Operador (vía app móvil o navegador) para eventos críticos del sistema (degradación, falla total, anomalías detectadas). Monitoreo proactivo de la salud de las cámaras (latencia, frame drops, calidad de imagen).

**Persona:** OP (recibe notificaciones), AD (monitoreo proactivo de infraestructura)

**Complejidad estimada:** Medio (notificaciones push requieren service workers o app móvil; monitoreo de cámaras requiere métricas adicionales del módulo de visión).

**Stack tentativo:** Service Worker para notificaciones push web, FCM (Firebase Cloud Messaging) o similar para app móvil futura, métricas de salud de cámara en el módulo `edge_device` con umbrales configurables.

**Razón de salida del MVP:** Línea de mejora UX y operativa. El MVP1 cubre el caso del Operador en su puesto de trabajo durante el turno; las notificaciones push son valor añadido para Operadores que no están frente a la pantalla en todo momento. No es central a los 4 objetivos del producto.

**Revisión de negocio:** Mejora operativa del Operador y del Administrador.

**Clasificación:** **Trabajos Futuros.**

**Notas:** Mencionada en el Sequencer original del Inception como dirección MVP3.

---

## F41 — Integración cerrada del módulo de visión al loop de validación cuantitativa ▷

**Descripción:** Incorporación del módulo de visión computacional al loop de validación cuantitativa del sistema integrado (no solo como sensor de estado, sino como fuente de métricas validadas contra ground truth). Requiere cámaras propias en una intersección de Miraflores y un dataset etiquetado representativo para validar las detecciones contra realidad observada.

**Persona:** SYS (componente del sistema)

**Complejidad estimada:** Alto (requiere acceso a cámaras propias o fuentes de video controlables y específicas de Miraflores; producción de dataset etiquetado de tamaño suficiente; integración del módulo de visión al loop de KPIs de validación).

**Stack tentativo:** Cámara propia o stream confiable de Miraflores, pipeline de etiquetado (Roboflow o similar), métricas de detección validadas (precisión, recall, mAP) integradas al reporte de validación cuantitativa, lazo de retroalimentación entre la visión y el motor de control.

**Razón de salida del MVP:** Decisión D-007 cerró el rol de la visión computacional como **componente demostrable con validación independiente**, separado del loop de validación cuantitativa. Los streams de YouTube actuales no son fiables ni representativos de Miraflores; no hay ground truth para validación cuantitativa. La integración cerrada requiere infraestructura (cámaras, datasets etiquetados) que excede el alcance temporal del proyecto.

**Revisión de negocio:** Mejora del Objetivo 1 (observar el estado actual del tráfico) con validación cuantitativa del componente. Cierra el lazo completo del sistema integrado.

**Decisión técnica relacionada:** D-007 (Visión como componente demostrable, no en loop de validación).

**Clasificación:** **Trabajos Futuros.**

**Notas:** Esta dirección aparece originalmente en `EVOLUCION_TESIS.md` sección 8 (no en el Sequencer del Inception). Se formaliza como ficha por DHU-012 para unificar la lista de Trabajos Futuros.

---

# Resumen cuantitativo

## Distribución por clasificación

| Clasificación | Cantidad | % del total |
|---|---|---|
| MVP1 ★ Crítica | 17 | 41% |
| MVP1 ◆ Importante | 12 | 29% |
| MVP2 ○ Candidata a holgura | 5 | 12% |
| Trabajos Futuros ▷ | 7 | 17% |
| **Total con ficha** | **41** | **100%** |

**Total MVP1: 29 features (70%).** De esas 29:
- **23 se modelan como HUs operativas** (HU-01 a HU-12 ya redactadas + las pendientes del Bloque D, E, F).
- **3 se modelan como Tareas Técnicas Habilitadoras** (TTH-01 para F01, TTH-04 para F26, TTH-05 para F27).
- **4 se modelan por composición o inglobación como CA** (F02, F30, F31, F25).

**Nota sobre el conteo:** la versión 1.0 del Sequencer reportaba "26 features MVP1" en su título, lo cual resulta de un error aritmético al consolidar los bloques (4+9+6+3+4+3 = 29, no 26). El conteo correcto es 29 (DHU-012 subsección C).

## Distribución por persona

| Persona | MVP1 | MVP2 | Trabajos Futuros | Total |
|---|---|---|---|---|
| Operador (OP) | 12 | 2 | 1 (F40 OP+AD) | 14-15* |
| Gerente (GE) | 3 | 2 | 0 | 5 |
| Administrador (AD) | 3 | 1 | 2 (F21, F40) | 6* |
| Sistema (SYS) | 8 | 0 | 4 (F36, F37, F38, F39, F41) | 12-13* |
| Transversal entre personas | 3 (F01, F29, transversales) | 1 (F28 OP→AD) | — | — |

*Algunas features cruzan personas (F28 cuenta como OP por journey de origen; F40 toca OP y AD; F41 es SYS pero su valor llega a múltiples Personas). Los conteos exactos no suman 41 línealmente porque algunas se contabilizan en más de una fila.

## Distribución por objetivo del producto

| Objetivo | Features que lo realizan |
|---|---|
| **Obj. 1 — Observar estado actual** | F02, F03, F04, F33, F23, F41 (futuro) |
| **Obj. 2 — Anticipar congestión** | F05, F18, F34, F21 (futuro), F38 (futuro) |
| **Obj. 3 — Adaptar control** | F07, F08, F09, F10, F20, F31, F35, F36 (futuro), F37 (futuro) |
| **Obj. 4 — Demostrar mejora cuantificable** | F12, F13, F14, F30, F32 |
| **Soporte transversal** | F01, F06, F11, F15, F16, F17, F19, F22, F24, F25, F26, F27, F28, F29, F39 (futuro), F40 (futuro) |

## Distribución por estado actual

| Estado | Cantidad |
|---|---|
| ✓ Construido (total o parcial) | 6 |
| 🆕 Por construir desde cero | 28 |
| ▷ Trabajos Futuros (fuera del alcance, no se construye) | 7 |

**Las 6 ya construidas (parcial o totalmente):** F01 (parcial, falta endpoint login), F02 (parcial, falta integrar como dashboard único), F05 (backend listo con baseline), F07 (parcial), F33 (módulo visión funcional), F35 (motor adaptativo completo).

## Distribución por riesgo

| Riesgo | Features |
|---|---|
| ⚠ Alto (cuellos de botella) | F32 (SUMO), F34 (GRU dependiente de F32) |
| ⚠ Medio-Alto | F06 (UX combinada), F26 (fallback cascada), F08 (riesgo de scope creep si se hace mal) |
| Trabajos Futuros con complejidad Alto declarada | F21 (MLOps), F36 (visión + políticas), F37 (STGNN multi-intersección), F39 (logística Pi), F41 (cámaras + ground truth) |
| Resto | Bajo o Medio |

---

# Próximos pasos

1. **Validar este backlog con el asesor** durante el Showcase.
2. **Convertir cada feature MVP1 a Historia de Usuario, TTH o composición** según corresponda (ver columna "Modelado" de cada ficha). El backlog del MVP1 se redacta progresivamente por bloques: Bloque A, B, C, D cerrados; Bloque E y F pendientes.
3. **Convertir cada feature MVP2 a Historia de Usuario** con la misma estructura, marcadas como candidatas a holgura del sprint. Se redactan en sesión MVP2 dedicada tras cerrar todos los bloques MVP1.
4. **Las 7 fichas de Trabajos Futuros NO se convierten a Historia de Usuario.** Se mantienen como referencia y se mencionan en el capítulo de trabajo futuro del documento de tesis.
5. **Estimar las HUs** con Planning Poker (solo HUs MVP1 y MVP2; las TTH se estiman directamente en horas/días).
6. **Priorizar** con MoSCoW (ver técnica en Desarrollo_Agil.pdf del profesor).
7. **Asignar HUs a Sprints** según los Sprint Goals derivados de los 4 objetivos del producto.

---

# Documentos relacionados

- `LEAN_INCEPTION_CEREBROVIAL.md` — Documento principal del Inception (este es complementario).
- `DECISIONS.md` — Decisiones técnicas referenciadas (D-001 a D-009).
- `DECISIONS_HU.md` — Decisiones metodológicas sobre la redacción del backlog (DHU-001 a DHU-014).
- `HU_BLOQUE_A.md`, `HU_BLOQUE_B.md`, `HU_BLOQUE_C.md`, `HU_BLOQUE_D.md` — Product Backlog redactado por bloques.
- `TAREAS_TECNICAS_HABILITADORAS.md` — Tareas Técnicas Habilitadoras transversales.
- `EVOLUCION_TESIS.md` — Narrativa de evolución del proyecto; sección 8 contiene tabla referencial de Trabajos Futuros.
- `LEAN_INCEPTION_INVESTIGACION.md` — Fundamentación bibliográfica del marco.
