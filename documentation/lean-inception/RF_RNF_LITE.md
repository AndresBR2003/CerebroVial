# Requisitos Funcionales y No Funcionales — versión lite — CerebroVial

> Versión de lectura humana del documento normativo `REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md`.
>
> **Para qué sirve este documento:** entender qué hace el sistema y con qué calidad lo hace, sin la densidad de referencias de trazabilidad del documento normativo. Los identificadores (RF-NNN, RNF-XXX-NN) y las prioridades MoSCoW son los mismos que en el documento normativo; cualquier ajuste se realiza primero en el documento normativo y se propaga aquí.
>
> **Cuándo abrir el documento normativo en lugar de este:** cuando necesites trazabilidad fina (qué CA específico originó un RNF), justificación metodológica de las decisiones de clasificación, matriz completa de trazabilidad, glosario y políticas de mantenimiento. El documento normativo cierra DHU-007 y orienta auditoría académica e implementación.

---

## Cómo está organizado

El sistema CerebroVial se describe con dos catálogos:

- **22 Requisitos Funcionales (RF)** organizados en 7 familias funcionales describen qué hace el sistema.
- **53 Requisitos No Funcionales (RNF)** clasificados en 9 características de calidad de ISO/IEC 25010:2023 describen con qué calidad lo hace.

**Nota sobre la palabra "funcional".** "Functional Suitability" (RNF-FUN) es una característica de calidad de ISO 25010 que evalúa si el sistema produce resultados correctos, completos y apropiados. **No es lo mismo que un Requisito Funcional (RF).** Los RF declaran comportamientos; los RNF-FUN evalúan la calidad con que esos comportamientos se cumplen, especialmente en casos límite (datos faltantes, condiciones degenerativas matemáticas, comparaciones rigurosas).

---

## Catálogo de Requisitos Funcionales (22 RF)

### Familia 1 — Control de acceso y autenticación

**RF-001 — Autenticación al sistema.** El sistema permite a los usuarios autenticarse con credenciales personales. Los usuarios sin sesión activa son redirigidos al inicio de sesión; los usuarios con sesión expirada son desconectados con mensaje informativo. *Beneficiario:* las tres Personas. *Prioridad:* Must.

**RF-002 — Control de acceso por rol.** El sistema reconoce el rol del usuario autenticado (Operador, Gerente o Administrador) y le presenta solo las vistas correspondientes. Los intentos de acceso cruzado son rechazados tanto en frontend como en backend. *Beneficiario:* las tres Personas. *Prioridad:* Must.

### Familia 2 — Monitoreo operativo en tiempo real

**RF-010 — Presentación del estado actual del tráfico por acceso.** El sistema expone, por cada acceso de la intersección, el flujo vehicular y la longitud de cola. Los valores se actualizan automáticamente y se acompañan de un indicador visual con umbrales que distinguen niveles operativos. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-011 — Presentación de la predicción de congestión por acceso.** El sistema expone, por cada acceso, la predicción del nivel de congestión en escala 0-5 hasta el horizonte configurado. Cuando el nivel supera el umbral, el acceso se resalta visualmente. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-012 — Vista combinada del estado actual y la predicción.** El sistema presenta de forma integrada el estado actual y la predicción, alineados temporalmente. Cuando el estado actual es normal pero la predicción anticipa congestión, el sistema resalta la discrepancia. *Beneficiario:* Operador. *Prioridad:* Must.

### Familia 3 — Decisiones del motor adaptativo

**RF-020 — Presentación de la estrategia de control activa.** El sistema expone qué estrategia está aplicando el motor adaptativo, con qué parámetros (tiempos de verde por acceso) y desde cuándo. Los nombres de estrategias son autoexplicativos para el Operador. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-021 — Explicación legible de la razón de selección de estrategia.** El sistema expone una explicación en lenguaje legible de por qué el motor seleccionó la estrategia activa. Las explicaciones se construyen desde un catálogo curado de plantillas; las combinaciones no cubiertas activan un texto genérico de respaldo. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-022 — Notificación temporal de cambios de estrategia.** El sistema notifica al Operador cada cambio de estrategia mediante una notificación visual temporal poco intrusiva, que indica la hora, la estrategia anterior, la nueva y una razón breve. Los cambios encadenados se agrupan. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-023 — Consulta histórica de decisiones del motor.** El sistema permite consultar el historial cronológico de decisiones del motor, con la estrategia aplicada, los parámetros calculados y la razón. El historial es auditable, durable e inmutable. *Beneficiario:* Operador (consulta), Administrador (acceso técnico). *Prioridad:* Must.

### Familia 4 — Predicción de tráfico

La predicción de tráfico está cubierta funcionalmente por RF-011, RF-012 y RF-033. El sustrato técnico vive en las TTH del modelo predictivo. No hay RF dedicados adicionales a esta familia.

### Familia 5 — Soporte técnico y configuración del sistema

**RF-030 — Vista técnica de salud de los componentes.** El sistema expone al Administrador una vista técnica detallada del estado de cada componente operativo: nombre, estado cualitativo, timestamp del último cambio, identificador interno, latencia, fallos recientes y timestamp de la última evaluación exitosa. *Beneficiario:* Administrador. *Prioridad:* Must.

**RF-031 — Configuración de parámetros operativos del sistema.** El sistema permite al Administrador consultar y modificar parámetros operativos (umbrales de cola, horizonte de predicción, ventana de cálculo de métricas, frecuencia del monitor), organizados en tres familias funcionales. Las modificaciones se persisten con auditoría, surten efecto sin redespliegue y soportan concurrencia con last-write-wins y advertencia explícita. *Beneficiario:* Administrador. *Prioridad:* Must.

**RF-032 — Vista de métricas de desempeño del modelo predictivo.** El sistema expone al Administrador las métricas del modelo principal (MAE, RMSE, accuracy, matriz de confusión 6×6) calculadas sobre una ventana temporal configurable, con tooltips de definición operacional. *Beneficiario:* Administrador. *Prioridad:* Must.

**RF-033 — Vista comparativa de métricas del modelo principal vs respaldo.** El sistema permite al Administrador comparar simultáneamente las métricas del modelo principal contra las del modelo de respaldo, sobre los mismos eventos del registro, con un indicador comparativo que comunica cuál es mejor o si están dentro de la tolerancia configurable. *Beneficiario:* Administrador. *Prioridad:* Could (MVP2).

### Familia 6 — Reportería ejecutiva

**RF-040 — Consulta de KPIs operativos sobre periodo seleccionable.** El sistema permite al Gerente consultar cuatro KPIs agregados (tiempo de espera, longitud de cola, throughput, demora) sobre un periodo elegido entre presets o rango personalizado, con cards numéricas, desglose opcional por dirección y tooltips. *Beneficiario:* Gerente. *Prioridad:* Must.

**RF-041 — Vista comparativa entre periodos.** El sistema permite al Gerente comparar los cuatro KPIs entre el periodo seleccionado y el periodo previo equivalente, con gráficos de dos series superpuestas, valores agregados de ambos periodos y un indicador de variación con semántica visual de mejora o empeoramiento. *Beneficiario:* Gerente. *Prioridad:* Must.

**RF-042 — Drill-down sobre periodo específico.** El sistema permite al Gerente investigar un periodo específico con tres carriles temporales integrados sobre un eje común: tráfico observado, decisiones del motor e intervalos de estado operativo. Soporta zoom interactivo sobre el carril de tráfico. *Beneficiario:* Gerente. *Prioridad:* Could (MVP2).

**RF-043 — Exportación de reportes a PDF o Excel.** El sistema permite al Gerente exportar los reportes de RF-040 y RF-041 a PDF (presentable, con gráficos) o Excel (datos crudos). Los reportes son autocontenidos: incluyen definiciones operacionales. *Beneficiario:* Gerente. *Prioridad:* Could (MVP2).

### Familia 7 — Soporte al Operador y trazabilidad de incidentes

**RF-050 — Vista simplificada de salud de los componentes para el Operador.** El sistema expone al Operador una vista simplificada del estado de cada componente, con textos curados que explican qué hace el sistema sin cada componente afectado. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-051 — Alerta transversal del estado operativo del sistema.** El sistema muestra al Operador una alerta visible en todas las vistas cuando el sistema entra en un estado distinto a operación normal. La alerta identifica el nivel del estado degradado, el componente disparador y el tiempo transcurrido. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-052 — Explicación del modo degradado activo.** El sistema expone al Operador una explicación textual del modo degradado activo integrando tres elementos: qué disparó el modo, qué fallback está activo y qué capacidad operativa se perdió con su implicación para la supervisión. *Beneficiario:* Operador. *Prioridad:* Must.

**RF-053 — Registro de notas e incidencias del turno del Operador.** El sistema permite al Operador registrar notas e incidencias durante su turno asociadas a un momento específico, y consultarlas con filtros por fechas y autor. Las notas son editables dentro de una ventana corta posterior a su creación; luego quedan inmutables. *Beneficiario:* Operador. *Prioridad:* Should (MVP2).

**RF-054 — Escalamiento de incidentes del Operador al Administrador.** El sistema permite al Operador escalar al Administrador incidentes observados durante operación degradada, capturando automáticamente el contexto operativo y permitiendo descripción libre. El Administrador recibe los escalamientos con badge numérico de pendientes y los transiciona a "Atendido". *Beneficiario:* Operador (originador), Administrador (gestor). *Prioridad:* Could (MVP2).

---

## Catálogo de Requisitos No Funcionales (53 RNF)

Los RNF están clasificados según las 9 características de calidad de ISO/IEC 25010:2023. Cada bloque empieza con una breve descripción de la característica.

### Functional Suitability — corrección, completitud y apropiación del catálogo de funciones (6 RNF)

**RNF-FUN-01 — Manejabilidad de datos faltantes en vistas de consulta y cálculo.** Cuando una vista o cálculo opera sobre periodos sin datos, cobertura parcial o condiciones matemáticamente indefinidas (división por cero, agregados sobre cero filas), el sistema comunica explícitamente la condición en lugar de presentar valores espurios calculados sobre el vacío. *Prioridad:* Must (MVP1) / Should (MVP2).

**RNF-FUN-02 — Calidad del modelo predictivo.** El modelo predictivo apunta a una exactitud sobre el nivel discreto 0-5 mayor o igual al 80% sobre la partición de validación. El objetivo es aspiracional; las métricas reales se reportan honestamente conforme a las definiciones operacionales de RF-032. *Prioridad:* Should.

**RNF-FUN-03 — Comparabilidad rigurosa entre modelos predictivos.** Las métricas comparativas entre el modelo principal y el modelo de respaldo se calculan sobre exactamente los mismos eventos del registro. Pares incompletos no entran al cálculo. *Prioridad:* Could (MVP2).

**RNF-FUN-04 — Cobertura de catálogos de plantillas curadas.** Los catálogos de plantillas (explicaciones del motor, textos de impacto operativo, explicación del modo degradado) cubren las combinaciones típicas declaradas como esperadas. Las combinaciones no cubiertas activan un texto genérico de respaldo. *Prioridad:* Must.

**RNF-FUN-05 — Identificabilidad autosuficiente de artefactos exportados.** Los reportes PDF y Excel descargados son identificables sin abrirlos: el nombre incluye tipo, periodo y momento de generación. *Prioridad:* Could (MVP2).

**RNF-FUN-06 — Independencia entre dimensiones funcionales del registro de incidentes.** El estado de un incidente escalado y el estado operativo del sistema son dimensiones independientes. La recuperación automática del sistema no cierra automáticamente los incidentes; el cierre lo decide el Administrador. *Prioridad:* Could (MVP2).

### Performance Efficiency — tiempo, recursos, capacidad (13 RNF)

**RNF-PERF-01 — Actualización en tiempo real de la presentación operativa.** El sistema propaga a la presentación operativa cualquier cambio de estado dentro de los 5 segundos siguientes a su ocurrencia en la fuente. Aplica a las 10 HUs operativas de tiempo real del Operador y a la vista técnica del Administrador. *Prioridad:* Must.

**RNF-PERF-02 — Apertura de vistas de consulta del Operador.** Las vistas de consulta del Operador (historial, notas) se abren en ≤ 2 segundos con volúmenes esperados de MVP1. *Prioridad:* Should / Could.

**RNF-PERF-03 — Apertura de la vista de configuración del Administrador.** La vista de configuración con todos los parámetros y el historial reciente se abre en ≤ 2 segundos. *Prioridad:* Should.

**RNF-PERF-04 — Apertura de vistas de consulta del Gerente.** Las vistas del Gerente (KPIs y comparativa) se abren en ≤ 3 segundos con el periodo por defecto. *Prioridad:* Must.

**RNF-PERF-05 — Recálculo de vistas del Gerente al cambiar de periodo.** El recálculo al cambiar de periodo se completa en ≤ 10 segundos, con indicador de carga visible. *Prioridad:* Must.

**RNF-PERF-06 — Apertura y zoom de la vista detallada de drill-down.** Apertura ≤ 5 s (periodos cortos) o ≤ 15 s (periodos largos). Zoom interactivo ≤ 3 s. *Prioridad:* Could (MVP2).

**RNF-PERF-07 — Generación de reportes exportables.** PDF: ≤ 15 s (periodo corto), ≤ 60 s (periodo largo). Excel: ≤ 10 s (periodo típico), ≤ 30 s (periodo largo). *Prioridad:* Could (MVP2).

**RNF-PERF-08 — Efecto de modificaciones de configuración sin redeploy.** Los cambios de parámetros surten efecto en ≤ 30 segundos sin reinicio del sistema. *Prioridad:* Must.

**RNF-PERF-09 — Latencia del cálculo de métricas del modelo predictivo.** Latencia entre vencimiento del horizonte de una predicción y su reflejo en las métricas ≤ 30 segundos. No degrada la respuesta de otros componentes. *Prioridad:* Should.

**RNF-PERF-10 — Latencia de actualización del indicador de incidentes pendientes.** Latencia entre registro de un nuevo incidente y actualización del badge del Administrador ≤ 30 segundos. *Prioridad:* Could (MVP2).

**RNF-PERF-11 — Granularidad de persistencia del histórico operacional.** El histórico se persiste con granularidad de 30 segundos por intersección y dirección. *Prioridad:* Must.

**RNF-PERF-12 — Paralelización del cálculo en vistas multi-fuente.** Las consultas a fuentes independientes se ejecutan en paralelo (HU-17: dos periodos; HU-18: tres carriles), no secuencialmente. *Prioridad:* Must.

**RNF-PERF-13 — No degradación por ejecución paralela del modelo de respaldo.** La ejecución paralela del modelo de respaldo no degrada la latencia del modelo principal en operación normal. *Prioridad:* Could (MVP2).

### Compatibility — co-existencia e interoperabilidad (2 RNF)

**RNF-COM-01 — Co-existencia de los componentes del monolito modular.** Los componentes del sistema co-existen en el mismo entorno de despliegue sin conflictos de puertos, recursos o nombres. La comunicación entre componentes se hace por nombres internos sin configuración manual. *Prioridad:* Must.

**RNF-COM-02 — Interoperabilidad mediante constructo unificado de nivel de congestión.** El sistema usa la escala 0-5 como constructo unificado de nivel de congestión, permitiendo intercambiabilidad de fuentes operativas sin reentrenar el modelo ni modificar las vistas. *Prioridad:* Should.

### Interaction Capability — usabilidad y accesibilidad (7 RNF)

**RNF-INT-01 — Usabilidad operativa de las presentaciones del Operador.** Las presentaciones del Operador permiten el reconocimiento inmediato del estado operativo y las decisiones del sistema sin entrenamiento técnico. Códigos visuales legibles a primer golpe de vista. *Prioridad:* Must.

**RNF-INT-02 — Accesibilidad WCAG 2.1 nivel AA.** Las distinciones visuales no dependen exclusivamente del color (se acompañan de ícono, etiqueta, patrón o estilo). Controles activables con teclado y con dispositivo apuntador. Elementos dinámicos interpretables por lectores de pantalla. *Prioridad:* Should.

**RNF-INT-03 — Autoexplicación mediante tooltips integrados.** Las vistas con información técnica o agregada incluyen tooltips con la definición operacional de cada métrica o indicador, no solo su nombre. *Prioridad:* Must (MVP1) / Could (MVP2).

**RNF-INT-04 — Coherencia visual y textual entre vistas relacionadas.** El orden de indicadores, los tooltips, los códigos visuales y el lenguaje de los catálogos de plantillas son consistentes entre vistas que tratan dominios relacionados (HU-16 ↔ HU-17, HU-18 ↔ HU-10, HU-20 ↔ HU-14, HU-06 ↔ HU-11 ↔ HU-12). *Prioridad:* Must.

**RNF-INT-05 — Comprensibilidad de explicaciones textuales sin formación técnica.** Las explicaciones generadas por el sistema son comprensibles por un Operador sin formación técnica en el motor adaptativo ni en la arquitectura del sistema. *Prioridad:* Must.

**RNF-INT-06 — Presentación visual de artefactos exportados en formato impreso.** Los gráficos de los PDF exportados son legibles en formato impreso: tipografía suficiente, ejes etiquetados, escala identificable, series distinguibles en escala de grises. *Prioridad:* Could (MVP2).

**RNF-INT-07 — Ocultación de rutas no accesibles al rol del usuario.** Las rutas de navegación no accesibles al rol del usuario no aparecen como enlaces en la interfaz. *Prioridad:* Must.

### Reliability — confiabilidad operativa (9 RNF)

**RNF-REL-01 — Robustez ante interrupción de fuente.** El sistema mantiene visible el último valor conocido marcado semánticamente con el modo aplicable: "desactualizado" para fuentes de medición (modo A), "no confirmado" para componentes internos de decisión (modo B). Aplica a 21 CAs distribuidos en 19 HUs. *Excepción HU-19 / disparo HU-21:* política conservadora de rechazo en lugar de marca pasiva, justificada por la integridad del artefacto exportado o del registro de incidentes. *Prioridad:* Must.

**RNF-REL-02 — Disponibilidad transversal de la alerta del estado operativo.** La alerta del estado operativo es visible de manera consistente en todas las vistas del Operador durante todo el tiempo que el sistema permanezca en estado distinto a operación normal. *Prioridad:* Must.

**RNF-REL-03 — Continuidad operativa frente a fallos de subsistemas auxiliares.** La operación primaria del sistema sobre el semáforo no se detiene por fallos del subsistema de auditoría. Las acciones primarias se aplican y la auditoría se acumula en mecanismo de respaldo para persistencia posterior. *Prioridad:* Must.

**RNF-REL-04 — Durabilidad de registros append-only del sistema.** Los 8 registros append-only del sistema son durables frente a fallos temporales: decisiones del motor, notas del Operador, transiciones de estado operativo, predicciones, auditoría de parámetros, histórico de estados, predicciones del modelo de respaldo, incidentes escalados. *Prioridad:* Must.

**RNF-REL-05 — Resiliencia de persistencia ante fallo de escritura.** Ante fallo temporal de escritura durante creación de una entrada por el usuario, el sistema informa al usuario, preserva el contenido escrito y permite reintentar sin pérdida. *Prioridad:* Should.

**RNF-REL-06 — Tolerancia a fallos del componente de generación de reportes.** Fallos internos durante la generación de PDF o Excel se comunican al Gerente con mensaje informativo no técnico, sin entregar archivos parciales o corruptos. *Prioridad:* Could (MVP2).

**RNF-REL-07 — Manejabilidad de concurrencia en operaciones de modificación.** Múltiples Administradores modificando simultáneamente la misma configuración no pierden modificaciones silenciosamente. El segundo modificador recibe advertencia con detalles de la modificación intermedia y decide entre sobrescribir o cancelar. *Prioridad:* Must.

**RNF-REL-08 — Atomicidad de las transiciones de estado operativo.** Las transiciones entre los 5 estados operativos son atómicas: el sistema no queda en estados intermedios o indefinidos durante el cambio. *Prioridad:* Must.

**RNF-REL-09 — Comportamiento por defecto conservador ante fallo del propio mecanismo de detección de salud.** Cuando el mecanismo de detección de salud falla, el sistema reporta el estado como "no confirmado" sin asumir falsamente operación normal. *Prioridad:* Must.

### Security — protección de información y trazabilidad (7 RNF)

**RNF-SEC-01 — Inmutabilidad de registros append-only del sistema.** Los 8 registros append-only no se modifican tras la escritura inicial. *Excepción HU-09:* notas editables dentro de ventana temporal acotada, luego inmutables. *Excepción HU-21:* transición Enviado → Atendido como escritura única de campos adicionales. *Prioridad:* Must.

**RNF-SEC-02 — Autenticación del usuario al sistema.** Contraseñas hasheadas con bcrypt (factor de costo ≥ 12). Token JWT firmado con expiración configurable (default 8 horas). Solicitudes sin token, con token inválido o expirado reciben HTTP 401. *Prioridad:* Must.

**RNF-SEC-03 — Control de acceso por rol.** Usuarios autenticados acceden solo a recursos correspondientes a su rol. Rechazo aplicado en backend (HTTP 403), no solo en frontend. *Prioridad:* Must.

**RNF-SEC-04 — No filtración de información en respuestas de error de control de acceso.** Las respuestas HTTP 403 no filtran información sobre el recurso solicitado, evitando oráculos de enumeración. *Prioridad:* Must.

**RNF-SEC-05 — Segregación de presentación entre vistas del Operador y del Administrador con el mismo origen de datos.** Cuando dos vistas para roles distintos consumen el mismo endpoint, la diferencia se materializa en presentación; el control de acceso a la ruta es el mecanismo efectivo de separación. Los campos compartidos en el payload son no sensibles. *Prioridad:* Must.

**RNF-SEC-06 — Validación dual de restricciones en frontend y backend.** Las restricciones se validan tanto en frontend (mejora experiencia) como en backend (defensa efectiva contra bypass). *Prioridad:* Must (MVP1) / Should (MVP2).

**RNF-SEC-07 — No persistencia de reportes generados en el servidor.** Los reportes exportados se generan por demanda y se descargan directamente; no se almacenan en el servidor. *Prioridad:* Could (MVP2).

### Maintainability — modificabilidad, configurabilidad, testabilidad (3 RNF)

**RNF-MNT-01 — Extensibilidad de catálogos de plantillas como datos de configuración.** Los catálogos de plantillas (HU-06, HU-11, HU-12) son extensibles sin cambios al código: viven como datos, no como cadenas hardcoded. *Prioridad:* Should.

**RNF-MNT-02 — Parametrización sin redeploy de tiempos y umbrales operativos.** Los parámetros operativos cubiertos por HU-15 y los tiempos de notificación de HU-07 son parametrizables sin redespliegue. *Prioridad:* Must.

**RNF-MNT-03 — Tolerancia configurable del indicador comparativo entre modelos.** La tolerancia de empate del indicador comparativo de modelos (HU-20) es configurable internamente sin redespliegue. *Prioridad:* Could (MVP2).

### Flexibility — portabilidad, escalabilidad, reemplazabilidad (3 RNF)

**RNF-FLX-01 — Portabilidad del despliegue local mediante contenedores.** El sistema se despliega en máquina limpia con un solo comando estándar de orquestación. Documento de quickstart suficiente para nuevo miembro o evaluador académico. *Prioridad:* Must.

**RNF-FLX-02 — Reemplazabilidad del modelo predictivo.** El modelo principal es reemplazable por el modelo de respaldo (Nivel 2 de la cascada de fallback) sin modificar el contrato del endpoint consumido por el motor adaptativo y por las vistas del Operador. *Prioridad:* Must.

**RNF-FLX-03 — Escalabilidad arquitectónica con restricciones declaradas.** El sistema escala trivialmente a más accesos en la misma intersección. La extensión a múltiples intersecciones requiere arquitectura espacio-temporal (trabajo futuro declarado). *Prioridad:* Won't (en el ciclo del proyecto académico).

### Safety — operación segura sobre infraestructura de tránsito (3 RNF)

**RNF-SAF-01 — Comportamiento fail safe ante fallo del control adaptativo.** Cuando el motor adaptativo no responde, el sistema aplica tiempos preconfigurados conservadores al semáforo (degradado nivel 3) en lugar de detener la operación o aplicar decisiones inconsistentes. *Prioridad:* Must.

**RNF-SAF-02 — Cumplimiento de restricciones normativas del Manual MTC peruano.** Las decisiones aplicadas al semáforo respetan las cinco constantes normativas del Manual MTC peruano (mínimos y máximos de verde, amarillo, all-red, mínimo peatonal). La capa MTC del motor adaptativo eleva, recorta o compone la salida de la capa estratégica para garantizar el cumplimiento. *Prioridad:* Must.

**RNF-SAF-03 — Valores por defecto seguros desde el primer arranque.** Los valores por defecto de parámetros y los tiempos preconfigurados son tales que el sistema es operativo y seguro desde el primer arranque o tras restauración, sin requerir ajuste manual previo. *Prioridad:* Must.

---

## Resumen del catálogo

| Sección | Cantidad |
|---|---|
| Requisitos Funcionales | 22 |
| Requisitos No Funcionales | 53 |
| **Total** | **75** |

| Característica ISO 25010:2023 | Cantidad de RNF |
|---|---|
| Functional Suitability | 6 |
| Performance Efficiency | 13 |
| Compatibility | 2 |
| Interaction Capability | 7 |
| Reliability | 9 |
| Security | 7 |
| Maintainability | 3 |
| Flexibility | 3 |
| Safety | 3 |

---

## Documentos relacionados

- **`REQUISITOS_FUNCIONALES_Y_NO_FUNCIONALES.md`** — Documento normativo con trazabilidad completa, justificación metodológica y matriz de trazabilidad. Abrir cuando se requiera auditoría académica o implementación rigurosa.
- **`BACKLOG_OVERVIEW.md`** — Vista de conjunto del Product Backlog. Punto de entrada para entender Personas, Objetivos del Producto y mapa de HUs.
- **`DECISIONS_HU.md`** — Decisiones metodológicas del backlog. **DHU-019** consolida las decisiones de redacción del documento RF/RNF.
- **`HU_LITE.md`** — Versión corta de las 21 HUs operativas, equivalente a este documento para el Product Backlog.
