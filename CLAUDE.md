# CLAUDE.md — Proyecto CerebroVial Miraflores

## Resumen Ejecutivo

**CerebroVial** es un sistema predictivo de control semafórico adaptativo para reducir la congestión vehicular en el distrito de Miraflores (Lima, Perú). Integra **Redes Neuronales**, **Visión Computacional** e **IoT (Internet de las Cosas)** para evolucionar la gestión de tráfico de un modelo de tiempos fijos a un sistema inteligente y dinámico.

Este documento es la guía definitiva para que cualquier desarrollador o agente de IA (como Claude Code) entienda la totalidad del proyecto, su arquitectura, stack tecnológico, estructura de desarrollo y criterios de éxito.

---

## 1. Contexto del Proyecto

### 1.1 Información Académica

- **Universidad:** Universidad Peruana de Ciencias Aplicadas (UPC)
- **Facultad:** Ingeniería — Programa de Ingeniería de Sistemas
- **Tipo:** Tesis para optar el título profesional de Ingeniero de Sistemas
- **Autores:**
  - Cesar Humberto Herrera Villacorta (u20241c919)
  - Andres Alberto Briceño Rosas (u202418685)
- **Asesor:** Jymmy Stuwart Dextre Alarcon
- **Nombre del sistema:** CerebroVial Miraflores

### 1.2 Organización Objetivo

- **Entidad:** Municipalidad Distrital de Miraflores (Lima, Perú)
- **Unidad Orgánica:** Subgerencia de Movilidad Urbana y Seguridad Vial
- **Alineación estratégica:** OEI.09 del PEI 2025-2029 — "Mejorar el servicio de transporte y tránsito en el distrito"

### 1.3 Problema Central

**Elevada congestión vehicular en las intersecciones críticas del distrito de Miraflores**, causada por:

1. **PE1:** Ineficiente sincronización de semáforos que operan con tiempos fijos y no se adaptan al flujo vehicular en tiempo real.
2. **PE2:** Limitada capacidad para gestión proactiva del tráfico por falta de un sistema que anticipe la congestión basándose en datos.
3. **PE3:** Dificultad para optimizar la infraestructura vial existente al carecer de un sistema que coordine señales de tránsito de forma integral y automatizada.

### 1.4 Datos Clave del Contexto

- Lima es la 5ª ciudad más lenta del mundo para conducir en su centro (TomTom 2023).
- Tiempo promedio para recorrer 10 km en Lima: 28 min 30 seg (43 min en hora punta).
- Pérdida anual por congestión: 2.4% del PBI peruano (~S/ 23,300 millones).
- Miraflores genera ~54,000 viajes internos diarios.
- El distrito cuenta con 34 controladores de semáforos inteligentes, 700+ cámaras, y un Centro de Control C4.

---

## 2. Objetivos del Proyecto

### 2.1 Objetivo General

Desarrollar un modelo predictivo de control semafórico adaptativo para reducir la congestión vehicular, basado en redes neuronales, visión computacional e IoT, en el distrito de Miraflores.

### 2.2 Objetivos Específicos

| Código | Descripción |
|--------|-------------|
| **OE01** | Analizar y seleccionar los algoritmos, herramientas, técnicas y componentes IoT más adecuados para el reconocimiento del flujo vehicular y la estimación de congestión. |
| **OE02** | Diseñar la arquitectura lógica y física del modelo predictivo integrando componentes de percepción, predicción e IoT. |
| **OE03** | Desarrollar el modelo predictivo utilizando redes neuronales y visión computacional. |
| **OE04** | Validar la precisión del modelo predictivo para reducir la congestión vehicular. |

### 2.3 Indicadores de Éxito

| Código | Indicador | Objetivo | Mínimo Aceptable |
|--------|-----------|----------|-------------------|
| **IE01** | Benchmarking de algoritmos | OE01 | ≥3 algoritmos evaluados, 100% criterios con evidencia |
| **IE02** | Aprobación de arquitectura | OE02 | ≥90% cumplimiento en checklist + acta firmada por PO |
| **IE03** | Completitud del backlog | OE03 | ≥95% de Historias de Usuario aceptadas |
| **IE04** | Exactitud del modelo (Accuracy) | OE04 | ≥80% accuracy |

### 2.4 Resultados Obtenidos (Validación)

- **Precisión de detección vehicular (YOLOv8):** 88.2% en condiciones diurnas
- **Exactitud de predicción del modelo (GRU):** 81.3%
- **Latencia de transmisión de datos:** <2 segundos
- **TIR del proyecto:** 130%
- **VAN:** S/ 215,527.49

---

## 3. Arquitectura del Sistema

### 3.1 Visión General — Arquitectura Híbrida (Edge + Cloud)

CerebroVial usa un modelo **híbrido Edge-Cloud**:

1. **En las intersecciones (Edge):** Nodos Raspberry Pi 4 procesan video en tiempo real con YOLOv8 para detectar y contar vehículos.
2. **En la nube (Azure):** Microservicios procesan datos agregados, ejecutan predicción con redes GRU, y generan órdenes de control adaptativo.
3. **En el Centro de Control:** Operadores monitorean todo vía una webapp React y dashboards Grafana.

### 3.2 Diagrama C4 — Nivel 1: Contexto

**Actores externos:**
- Operador del Centro de Control (monitoreo táctico diario)
- Jefe/Analista de Movilidad Urbana (análisis estratégico y reportes)
- Administrador de TI (gestión de infraestructura y seguridad)

**Sistemas externos:**
- Sistema de Cámaras IP (700+ cámaras existentes en Miraflores)
- Controladores de Semáforos (34 controladores inteligentes existentes)

### 3.3 Diagrama C4 — Nivel 2: Contenedores

| Contenedor | Tecnología | Función |
|------------|------------|---------|
| **Nodo Edge (Raspberry Pi 4)** | Python, YOLOv8 | Procesa video localmente, detecta/cuenta vehículos, envía datos procesados a la nube |
| **API Gateway** | — | Punto de entrada único y seguro para datos de los nodos Edge |
| **Aplicación API** | FastAPI (Python) | Backend central: lógica de negocio, autenticación, orquestación |
| **Servicio de Predicción (IA)** | PyTorch (Python) | Ejecuta modelos GRU/LSTM para predecir congestión futura |
| **Servicio de Control Adaptativo** | Python | Traduce predicciones en órdenes de cambio de fase semafórica |
| **Servicio de Procesamiento de Datos** | Python | Limpia, transforma y almacena datos entrantes |
| **Base de Datos** | PostgreSQL + TimescaleDB + PostGIS, MongoDB, Azure Blob Storage | Almacenamiento híbrido de datos |
| **Aplicación Web UI** | React | Frontend interactivo para operadores: mapa, alertas, configuración |
| **Dashboards Operativos** | Grafana | Paneles de KPIs y métricas de series temporales en tiempo real |

### 3.4 Diagrama C4 — Nivel 3: Componentes Clave

#### 3.4.1 Nodo Edge (Raspberry Pi 4)

- **Visión Computacional (YOLOv8):** Carga modelo pre-entrenado, ingesta flujo de video en tiempo real, detecta/clasifica/cuenta vehículos.
- **Agente de Comunicación:** Serializa datos de conteo en JSON, gestiona envío seguro hacia la API en la nube.

#### 3.4.2 Servicio de Predicción (IA)

- **Controlador API (FastAPI):** Expone endpoints internos para solicitudes de predicción.
- **Motor de Predicción (PyTorch):** Carga modelos GRU en memoria, ejecuta inferencia sobre series temporales.
- **Conector de Base de Datos:** Lee datos históricos de tráfico y descarga modelos entrenados desde Blob Storage.

#### 3.4.3 Aplicación API (FastAPI)

- **Auth Middleware:** Valida tokens de autenticación y permisos (RBAC).
- **API Router:** Enruta peticiones HTTP hacia controladores específicos.
- **Traffic Controller:** Núcleo de lógica de negocio (almacenar datos, solicitar predicciones, notificar control).
- **Data Repository (SQLAlchemy):** Capa de abstracción de datos.
- **Prediction Client:** Cliente HTTP interno para comunicarse con el servicio de IA.

#### 3.4.4 Aplicación Web UI (React)

- **Login View:** Autenticación de usuarios.
- **Dashboard View:** Vista principal con mapa interactivo, alertas y KPIs.
- **Intersection Detail View:** Análisis detallado de un cruce específico.
- **Analytics View:** Reportes históricos, filtros, exportación PDF/Excel.
- **Admin Panel:** Gestión de usuarios/roles y salud del sistema.

#### 3.4.5 Servicio de Control Adaptativo

- Consume predicciones del servicio de IA.
- Aplica reglas predefinidas para generar planes de acción (ej: "alta congestión inminente" → cambiar a plan de semáforos B).
- Envía órdenes de cambio de fase a los controladores semafóricos.

### 3.5 Atributos de Calidad (Requisitos No Funcionales)

| Código | Tipo | Descripción |
|--------|------|-------------|
| **RNF-01** | Usabilidad | La interfaz web debe permitir a operadores interpretar alertas sin conocimientos de IA |
| **RNF-02** | Rendimiento | Latencia Edge→Dashboard ≤2 segundos |
| **RNF-03** | Seguridad | Comunicación cifrada (HTTPS/TLS) + autenticación basada en roles (RBAC) |
| **RNF-04** | Mantenibilidad | Arquitectura de microservicios desacoplados (actualizar un módulo sin interrumpir el resto) |

---

## 4. Stack Tecnológico

### 4.1 Desarrollo de Software

| Categoría | Herramienta | Propósito |
|-----------|-------------|-----------|
| **Backend** | FastAPI (Python) | API de alto rendimiento, asíncrona, para servir modelos de IA en tiempo real |
| **Frontend** | React | Interfaz de usuario interactiva (dashboard, mapas, alertas) |
| **Dashboards** | Grafana | Paneles de métricas y KPIs en tiempo real |
| **IA / Deep Learning** | PyTorch | Framework para modelos de visión computacional (YOLOv8) y predicción temporal (GRU) |
| **Visión Computacional** | YOLOv8 (Ultralytics) | Detección de vehículos en video en tiempo real |
| **Predicción Temporal** | GRU (Gated Recurrent Unit) | Red neuronal recurrente para predecir congestión futura |

### 4.2 Bases de Datos

| Herramienta | Función |
|-------------|---------|
| **PostgreSQL** | Base de datos relacional principal |
| **TimescaleDB** (extensión PG) | Series temporales (flujo vehicular/minuto, velocidad, tiempos de espera) |
| **PostGIS** (extensión PG) | Datos geográficos (ubicación de semáforos, geometría de calles, trayectorias) |
| **MongoDB** | Datos no estructurados (logs, metadatos de detecciones, configuración de dispositivos IoT) |
| **Azure Blob Storage** | Almacenamiento de archivos de modelos de IA entrenados |

### 4.3 Hardware IoT

| Componente | Especificación |
|------------|----------------|
| **Edge Device** | Raspberry Pi 4 (5 unidades para piloto) |
| **Cámaras** | Cámaras IP existentes de la municipalidad |
| **Controladores** | 34 controladores de semáforos inteligentes existentes |
| **Comunicación** | Wi-Fi (para el piloto) |

### 4.4 DevOps & Infraestructura

| Herramienta | Función |
|-------------|---------|
| **Microsoft Azure** | Plataforma cloud (servidores, bases de datos, almacenamiento) |
| **GitHub Actions** | CI/CD — build, test, deploy automatizado |
| **Git / GitHub** | Control de versiones y repositorio centralizado |
| **GitHub Copilot** | Asistente de codificación con IA |

### 4.5 Gestión de Proyecto

| Herramienta | Función |
|-------------|---------|
| **Jira** | Planificación, seguimiento de sprints y backlog |
| **Confluence** | Documentación centralizada |
| **Scrum** | Marco de trabajo ágil |

### 4.6 Calidad

| Herramienta | Función |
|-------------|---------|
| **Pytest** | Pruebas unitarias automatizadas (backend, modelos IA) |
| **SUMO** | Simulador microscópico de tráfico (entrenamiento y validación de algoritmos) |
| **Locust** | Pruebas de carga para la API |

### 4.7 Entornos de Desarrollo

| Herramienta | Función |
|-------------|---------|
| **VS Code** | IDE principal |
| **Google Colab** | Experimentación y entrenamiento de modelos IA con GPUs |

---

## 5. Metodología de Desarrollo — Scrum

### 5.1 Roles del Equipo

| Rol | Persona |
|-----|---------|
| **Product Owner** | Erlan Rospigliosi Avila |
| **Scrum Master** | Herrera y Briceño (compartido) |
| **Development Team** | Herrera y Briceño |
| **Stakeholders** | Asesor de tesis + contactos en la Municipalidad de Miraflores |

### 5.2 Product Backlog

El proyecto tiene **19 Historias de Usuario (HU)** organizadas en **4 Sprints**:

#### Sprint 1 — Fundamentos y Modelos de IA
| HU | Estimación | Prioridad | Título |
|----|------------|-----------|--------|
| HU001 | 3 | M | Obtención de datos de Cámaras de Video y Sensores |
| HU002 | 3 | M | Organización y Estandarización de Datos de Tráfico |
| HU019 | 5 | M | Integración y comunicación entre componentes inteligentes distribuidos |
| HU008 | 8 | M | **Modelo de IA para la detección de Vehículos** |
| HU005 | 21 | M | **Modelo de IA para la predicción de la congestión vehicular** |

#### Sprint 2 — Infraestructura y Visualización
| HU | Estimación | Prioridad | Título |
|----|------------|-----------|--------|
| HU010 | 8 | M | **Visualización en Tiempo Real del Estado del Tráfico** |
| HU007 | 13 | M | Modelo de IA para la optimización adaptativa |
| HU015 | 8 | M | Preparación automática de infraestructura en la nube |
| HU016 | 8 | C | Entrega Automática de nuevas versiones del sistema |
| HU011 | 5 | S | Registro de Uso del Sistema por Parte de Usuarios |

#### Sprint 3 — Lógica de Control y Seguridad
| HU | Estimación | Prioridad | Título |
|----|------------|-----------|--------|
| HU004 | 21 | M | **Modelo de IA para Gestión Semafórica** |
| HU014 | 5 | S | Implementación de mecanismos de acceso seguro al sistema |
| HU003 | 8 | S | Definición de reglas de contingencia ante fallos en sensores o cámaras |
| HU013 | 5 | C | Protección de datos sensibles en tránsito y almacenamiento |

#### Sprint 4 — Reportes y Validación Final
| HU | Estimación | Prioridad | Título |
|----|------------|-----------|--------|
| HU012 | 8 | S | Reportes Automáticos de Resultados Diarios |
| HU009 | 5 | C | Registro auditable de modificaciones en la programación semafórica |
| HU017 | 5 | S | Alertas Automáticas ante Fallas del Sistema |
| HU018 | 13 | M | Control directo de semáforos desde el sistema central |
| HU006 | 13 | M | Comparación de Resultados Antes y Después del Sistema |

### 5.3 Épicas

| Código | Título | Descripción |
|--------|--------|-------------|
| **E01** | Adquisición de Datos en Tiempo Real | Capturar datos con sensores/cámaras, procesarlos en edge, enviarlos al sistema central |
| **E02** | Módulo de IA | Detectar vehículos, predecir congestión, tomar decisiones adaptativas |
| **E03** | Módulo de Monitoreo y Auditoría | Reportes, registros, trazabilidad, alertas automáticas |
| **E04** | Seguridad, Privacidad y Cumplimiento | Cifrado, control de accesos, respaldo |
| **E05** | Arquitectura Cloud & DevOps | Infraestructura cloud, CI/CD, automatización de despliegues |
| **E06** | Interfaces de Integración | APIs para integración con aplicaciones móviles, sistemas municipales, plataformas externas |

---

## 6. Perfiles de Usuario

### 6.1 Operador del Centro de Control
- **Perfil:** Técnico con experiencia en videovigilancia y monitoreo
- **Necesidades:** Visualizar estado de red vial, recibir alertas comprensibles, entender acciones automáticas del sistema, reportar incidencias

### 6.2 Jefe / Analista de Movilidad Urbana
- **Perfil:** Estratégico, formación en ingeniería de transporte o gestión pública
- **Necesidades:** Reportes históricos, medición de KPIs, exportación de datos/gráficos, inteligencia para decisiones de planificación

### 6.3 Administrador de TI
- **Perfil:** Técnico enfocado en infraestructura, seguridad y mantenimiento
- **Necesidades:** Gestionar usuarios/roles, monitorear salud de la plataforma, acceso a logs, configuración del sistema

---

## 7. Flujo Operativo del Sistema

El sistema opera en un **ciclo continuo** de 5 fases:

1. **Captura:** Cámaras IP existentes capturan video de tráfico en intersecciones.
2. **Procesamiento Edge:** Raspberry Pi ejecuta YOLOv8 localmente → detecta vehículos, cuenta, estima velocidades y flujos.
3. **Transmisión:** El Agente de Comunicación serializa datos en JSON y los envía vía HTTPS/TLS al API Gateway en Azure.
4. **Predicción Cloud:** El Servicio de Predicción (GRU) analiza datos históricos + actuales → genera pronóstico de congestión futura.
5. **Acción Adaptativa:** El Motor de Decisiones traduce predicciones en órdenes concretas → ajusta tiempos de semáforos inteligentes.

Todo el ciclo es supervisado desde el **Centro de Control** vía la webapp React y dashboards Grafana (cerrando el bucle de retroalimentación).

---

## 8. Factibilidad Económica

| Concepto | Valor |
|----------|-------|
| **Inversión inicial** | S/ 96,085.00 |
| **Ahorro neto anual** | S/ 136,479.47 |
| **VAN (3 años, TEA 15%)** | S/ 215,527.49 |
| **TIR** | 130% |
| **Payback** | <1 año |

Desglose de inversión: hardware (S/ 3,850), recursos humanos (S/ 81,000), software/licencias (S/ 500), capacitaciones (S/ 2,000), contingencia 10% (S/ 8,735).

---

## 9. Decisiones Técnicas Clave (Benchmarking)

### 9.1 Detección de Objetos → YOLOv8

Se evaluaron Faster R-CNN (dos etapas, alta precisión pero baja velocidad), SSD (una etapa, buen balance), y **YOLO** (una etapa, velocidad extrema). YOLO fue seleccionado por su idoneidad para tiempo real en monitoreo de tráfico.

### 9.2 Predicción Temporal → GRU

Se evaluaron RNN Simple (memoria corta, rápida pero limitada), LSTM (memoria larga, 4 compuertas, más lenta), BiRNN (contexto bidireccional, muy lenta), y **GRU** (memoria larga, 3 compuertas, eficiente). GRU fue seleccionada por ofrecer el mejor balance entre memoria efectiva (>1000 pasos), complejidad de parámetros (~3x vs ~4x de LSTM) y velocidad (~0.85x vs ~0.65x de LSTM).

### 9.3 Hardware Edge → Raspberry Pi 4

Se evaluaron Microcontroladores (Arduino — muy limitados para IA), **SBC (Raspberry Pi)** (balance entre rendimiento, costo y flexibilidad), y Plataformas IA (Jetson Nano — potente pero más costosa). Raspberry Pi fue seleccionada por su relación costo/rendimiento para IA ligera optimizada.

### 9.4 Protocolo de Comunicación → Wi-Fi

Para el piloto, Wi-Fi es suficiente (alto ancho de banda, baja latencia en corto alcance). A futuro se podría migrar a 4G/5G para despliegue a mayor escala.

---

## 10. Estructura del Proyecto para Desarrollo

### 10.1 Estructura de Repositorio Sugerida

```
cerebrovial/
├── edge/                          # Código para Raspberry Pi
│   ├── detection/                 # Módulo YOLOv8 de detección vehicular
│   │   ├── detector.py            # Carga modelo, procesa frames
│   │   └── models/                # Modelos YOLOv8 pre-entrenados (.pt)
│   ├── communication/             # Agente de comunicación Edge→Cloud
│   │   └── agent.py               # Serialización JSON + envío HTTPS
│   ├── config/                    # Configuración del nodo edge
│   └── requirements.txt
│
├── backend/                       # API central (FastAPI)
│   ├── app/
│   │   ├── main.py                # Entrypoint FastAPI
│   │   ├── routers/               # Endpoints agrupados por dominio
│   │   │   ├── traffic.py         # Rutas de datos de tráfico
│   │   │   ├── auth.py            # Autenticación y autorización
│   │   │   ├── config.py          # Configuración del sistema
│   │   │   └── reports.py         # Reportes y analítica
│   │   ├── middleware/
│   │   │   └── auth_middleware.py  # Validación de tokens RBAC
│   │   ├── controllers/
│   │   │   └── traffic_controller.py  # Lógica de negocio
│   │   ├── repositories/
│   │   │   └── data_repository.py     # Capa de abstracción SQLAlchemy
│   │   ├── clients/
│   │   │   └── prediction_client.py   # Cliente HTTP hacia servicio IA
│   │   ├── models/                # Modelos SQLAlchemy / Pydantic
│   │   └── schemas/               # Schemas de validación
│   ├── tests/                     # Pruebas con Pytest
│   └── requirements.txt
│
├── prediction-service/            # Microservicio de predicción (IA)
│   ├── app/
│   │   ├── main.py                # Entrypoint FastAPI
│   │   ├── api/
│   │   │   └── prediction_api.py  # Endpoints de predicción
│   │   ├── engine/
│   │   │   └── prediction_engine.py  # Motor GRU con PyTorch
│   │   ├── connectors/
│   │   │   └── db_connector.py    # Lectura de datos históricos
│   │   └── models/                # Archivos de modelos entrenados
│   └── requirements.txt
│
├── control-service/               # Microservicio de control adaptativo
│   ├── app/
│   │   ├── main.py
│   │   ├── rules/                 # Motor de reglas predefinidas
│   │   └── actuators/             # Comunicación con controladores semafóricos
│   └── requirements.txt
│
├── frontend/                      # Aplicación Web UI (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/         # Mapa interactivo + KPIs
│   │   │   ├── IntersectionDetail/ # Detalle de cruce específico
│   │   │   ├── Analytics/         # Reportes y analítica histórica
│   │   │   ├── Admin/             # Panel de administración
│   │   │   └── Login/             # Autenticación
│   │   ├── services/              # Llamadas a la API backend
│   │   ├── hooks/                 # Custom hooks
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── ml-notebooks/                  # Notebooks de experimentación (Google Colab)
│   ├── yolov8_training.ipynb      # Entrenamiento del modelo de detección
│   ├── gru_training.ipynb         # Entrenamiento del modelo de predicción
│   └── sumo_simulation.ipynb      # Simulaciones con SUMO
│
├── infra/                         # Infraestructura como código
│   ├── terraform/                 # Azure infrastructure
│   └── docker/                    # Dockerfiles por servicio
│
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD pipelines
│
├── grafana/                       # Configuración de dashboards Grafana
│   └── dashboards/
│
├── docs/                          # Documentación del proyecto
│
└── docker-compose.yml             # Orquestación local para desarrollo
```

### 10.2 Convenciones de Desarrollo

- **Lenguaje principal:** Python (backend, IA, edge)
- **Frontend:** JavaScript/TypeScript (React)
- **API:** RESTful con FastAPI
- **Formato de datos Edge→Cloud:** JSON sobre HTTPS/TLS
- **Base de datos principal:** PostgreSQL con extensiones TimescaleDB y PostGIS
- **ORM:** SQLAlchemy
- **Testing:** Pytest (backend), SUMO (simulación tráfico), Locust (carga)
- **CI/CD:** GitHub Actions → Azure
- **Metodología:** Scrum (4 sprints)

---

## 11. Pantallas del Sistema (Prototipos)

1. **Login:** Autenticación con usuario/contraseña, enlace de recuperación.
2. **Dashboard Principal:** Mapa interactivo con marcadores de estado por intersección + columna lateral de alertas recientes + KPIs clave.
3. **Detalle de Intersección:** KPIs en tiempo real (vehículos/minuto, velocidad, nivel de congestión), estado actual del semáforo, gráfico de volumen de tráfico última hora, vista de cámara.
4. **Analítica y Reportes:** Filtros por fecha/intersección, gráfico de evolución temporal, tabla resumen, botón de exportación PDF/Excel.
5. **Panel de Administración:** Gestión de usuarios/roles (CRUD) + estado de salud de servicios (API, BD, nodos Edge: Online/Offline).

---

## 12. Intersecciones Críticas del Piloto

Las 5 intersecciones clave para el piloto (donde se desplegarán los Raspberry Pi):

- **Av. Larco:** Eje comercial/turístico principal, alta congestión peatonal y vehicular.
- **Av. José Pardo:** Corredor interdistrital de alto flujo vehicular.
- **Av. Angamos:** Corredor interdistrital con conexiones a múltiples distritos.
- **Av. Arequipa:** Ruta del Corredor Azul, alta densidad vehicular.
- **Av. del Ejército:** ~25 rutas de transporte público superpuestas.

---

## 13. Notas para Claude Code

### Cuando trabajes en este proyecto, ten en cuenta:

1. **El sistema tiene 3 capas claras:** Edge (Python/YOLOv8 en Raspberry Pi) → Cloud (FastAPI + PyTorch en Azure) → Frontend (React + Grafana).
2. **La comunicación Edge→Cloud es JSON sobre HTTPS.** Los datos enviados son agregados (conteo, velocidad, flujo), NO video crudo.
3. **El modelo de predicción es GRU (no LSTM).** GRU fue elegida por su eficiencia (~3x parámetros vs ~4x de LSTM) con rendimiento similar.
4. **El modelo de detección es YOLOv8**, ejecutado localmente en el edge, no en la nube.
5. **PostgreSQL es la BD principal** con extensiones TimescaleDB (series temporales) y PostGIS (datos geográficos). MongoDB es solo para logs y metadatos.
6. **El sistema de control usa reglas predefinidas**, no RL (Reinforcement Learning) directo. Las predicciones se traducen a planes de acción mediante un motor de reglas.
7. **El piloto es de 5 intersecciones** en Miraflores, con 5 Raspberry Pi.
8. **La priorización del backlog usa MoSCoW** (Must/Should/Could/Won't).
9. **Los datos de entrenamiento provienen de SUMO** (simulador) y datos reales de las cámaras de Miraflores.
10. **La latencia objetivo es ≤2 segundos** desde captura en campo hasta visualización en dashboard.
