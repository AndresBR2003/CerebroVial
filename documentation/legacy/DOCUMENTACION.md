# CerebroVial — Sistema Inteligente de Gestión de Tráfico Urbano

> Documentación técnica completa del proyecto de tesis

---

## Tabla de Contenidos

1. [¿De qué va el proyecto?](#1-de-qué-va-el-proyecto)
2. [Estructura del repositorio](#2-estructura-del-repositorio)
3. [Stack tecnológico](#3-stack-tecnológico)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Módulo de Visión (CerebroVial)](#5-módulo-de-visión-cerebrovial)
6. [Módulo de Predicción](#6-módulo-de-predicción)
7. [Frontend — Panel de control](#7-frontend--panel-de-control)
8. [Base de datos](#8-base-de-datos)
9. [APIs expuestas](#9-apis-expuestas)
10. [Modelos de datos](#10-modelos-de-datos)
11. [Configuración](#11-configuración)
12. [Tests](#12-tests)
13. [Flujo de datos end-to-end](#13-flujo-de-datos-end-to-end)
14. [Estado actual del proyecto](#14-estado-actual-del-proyecto)
15. [Cómo ejecutar el proyecto](#15-cómo-ejecutar-el-proyecto)

---

## 1. ¿De qué va el proyecto?

**CerebroVial** (Cerebro + Vial) es una plataforma integrada de **gestión inteligente del tráfico urbano** diseñada para el distrito de Miraflores, Lima, Perú.

El sistema combina tres capacidades principales:

| Capacidad | Descripción |
|-----------|-------------|
| **Visión por computador** | Detecta y rastrea vehículos en tiempo real a partir de cámaras de tráfico (incluyendo streams de YouTube) |
| **Predicción de congestión** | Anticipa el estado del tráfico a 15, 30 y 45 minutos usando modelos de machine learning |
| **Panel de control web** | Proporciona a los operadores una interfaz para monitorizar cámaras, ver estadísticas y recibir alertas |

**Caso de uso central:** Un operador de tráfico accede al dashboard, ve en un mapa las cámaras activas del distrito, selecciona una cámara y observa en tiempo real cuántos vehículos hay por zona, su velocidad estimada y si se espera congestión en los próximos 30 minutos.

---

## 2. Estructura del repositorio

El repositorio es un **monorepo** con cuatro sub-proyectos independientes, cada uno con su propio entorno Git:

```
Proyecto de Tesis/
│
├── CerebroVial/          # Backend principal — visión + predicción + API
├── Predictor/            # Módulo de investigación: redes neuronales spatiotemporales
├── Frontend/             # Dashboard web en React/TypeScript
├── Backend/              # Stub/placeholder (mínimo, sin lógica)
│
├── diagrama_vial.html    # Visualización HTML de la red vial
├── diagrama_vial_2.html  # Visualización alternativa
├── evidence_report.md    # Reporte de resultados de tests
└── generate_evidence.py  # Script para generar reportes de tests
```

### Detalle de CerebroVial (el componente más completo)

```
CerebroVial/
├── src/
│   ├── common/           # Código compartido entre módulos
│   ├── vision/           # Módulo de visión por computador
│   ├── prediction/       # Módulo de predicción de tráfico
│   └── control/          # Módulo de control (planificado)
├── conf/                 # Configuraciones YAML (Hydra)
├── scripts/              # Scripts ejecutables
├── tests/                # Suite de tests (pytest)
├── models/               # Modelos entrenados (.joblib)
└── data/                 # Datos de tráfico (logs CSV)
```

---

## 3. Stack tecnológico

### Backend (Python)

| Categoría | Tecnología | Uso |
|-----------|-----------|-----|
| API REST | FastAPI | Servidor HTTP con endpoints para visión y predicción |
| Configuración | Hydra | Gestión de configuraciones YAML con soporte multi-config |
| ORM | SQLAlchemy | Modelos de base de datos |
| Base de datos | PostgreSQL + TimescaleDB + PostGIS | Series temporales y datos geoespaciales |
| Visión | OpenCV | Procesamiento de video y visualización |
| Detección | Ultralytics YOLO (yolo11n.pt) | Detección de vehículos |
| Tracking | Supervision (ByteTrack) | Seguimiento de vehículos entre frames |
| Deep Learning | PyTorch + PyTorch Lightning | Entrenamiento de redes neuronales |
| GNN | Torch Geometric + TSL | Redes neuronales de grafos spatiotemporales |
| ML clásico | scikit-learn | Random Forest para predicción de producción |
| Video streaming | streamlink + cap_from_youtube | Captura de streams de YouTube |
| Monitoreo ML | TensorBoard | Visualización del entrenamiento |

### Frontend (TypeScript/React)

| Categoría | Tecnología | Uso |
|-----------|-----------|-----|
| Framework | React 19 | UI reactiva |
| Build tool | Vite 7.2 | Compilación y HMR |
| Estilos | Tailwind CSS 4 | Diseño utilitario |
| Mapas | Leaflet + React Leaflet | Mapa interactivo de cámaras |
| Gráficos | Recharts | Visualización de datos de tráfico |
| HTTP | Axios | Comunicación con APIs |
| Iconos | Lucide React | Iconografía |
| Testing | Vitest + Testing Library | Tests de componentes |

---

## 4. Arquitectura del sistema

El sistema sigue el patrón **Monolito Modular con Capas** (Clean Architecture):

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│         Dashboard | Mapa | Gráficos | Alertas                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/JSON
        ┌──────────────┴───────────────┐
        │                              │
        ▼                              ▼
┌──────────────────┐        ┌─────────────────────┐
│  Vision API      │        │  Prediction API      │
│  :8000           │        │  :8001               │
└────────┬─────────┘        └──────────┬───────────┘
         │                             │
         ▼                             ▼
┌──────────────────┐        ┌─────────────────────┐
│  Vision Module   │        │  Prediction Module   │
│  ├─ YOLO         │        │  ├─ Random Forest    │
│  ├─ Tracker      │   ──►  │  └─ STGNN            │
│  ├─ ZoneCounter  │ (CSV)  └─────────────────────┘
│  └─ Aggregator   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Video Sources   │
│  ├─ YouTube Live │
│  ├─ Webcam       │
│  └─ Archivo MP4  │
└──────────────────┘
```

### Capas internas (por módulo)

Cada módulo (`vision`, `prediction`) sigue las mismas 4 capas:

```
domain/          → Entidades puras de negocio (sin dependencias externas)
application/     → Casos de uso y orquestación (pipelines, builders)
infrastructure/  → Implementaciones concretas (YOLO, Supervision, CSV)
presentation/    → API REST y visualización (FastAPI, OpenCV)
```

---

## 5. Módulo de Visión (CerebroVial)

Este es el módulo más maduro y production-ready del sistema.

### ¿Qué hace?

Toma un stream de video (YouTube, webcam o archivo), detecta vehículos frame a frame, los rastrea, estima su velocidad, los cuenta por zonas poligonales y agrega los datos cada 60 segundos en un CSV.

### Componentes clave

#### Fuentes de video

| Clase | Fuente | Descripción |
|-------|--------|-------------|
| `YouTubeSource` | Stream de YouTube | Captura streams en vivo con streamlink |
| `WebcamSource` | Webcam local | Captura desde cámara del dispositivo |
| `VideoSource` | Archivo MP4/AVI | Reproducción de video grabado |

La arquitectura usa un **buffer con hilo separado** para la captura I/O, evitando bloquear el hilo de procesamiento.

#### Detección de vehículos — YoloDetector

- Modelo: **YOLO11-nano** (5.6 MB, rápido)
- Clases detectadas: `car (2)`, `motorcycle (3)`, `bus (5)`, `truck (7)`
- Selección automática de hardware: GPU → MPS (Apple Silicon) → CPU
- Umbral de confianza configurable (por defecto 0.3)

#### Tracking — SupervisionTracker (ByteTrack)

- Mantiene IDs únicos para cada vehículo entre frames
- Previene el intercambio de IDs mediante asociación de trayectorias
- Entrada: detecciones YOLO | Salida: detecciones con ID persistente

#### Estimación de velocidad — SimpleSpeedEstimator

- Calcula velocidad a partir del desplazamiento en píxeles entre frames
- Calibración: `pixels_per_meter` (por defecto 10.0)
- Salida: velocidad en km/h

#### Conteo por zonas — ZoneCounter

- Zonas definidas como polígonos en el archivo de configuración YAML
- Métricas calculadas por zona:
  - Conteo de vehículos
  - Velocidad promedio
  - Tasa de ocupación (0.0 a 1.0)
  - Conteo por tipo de vehículo
  - Flow rate (vehículos/minuto)

#### Pipeline asíncrono — AsyncVisionPipeline

```
[Hilo de captura] → [Cola de frames] → [Hilo de procesamiento] → [Cola de resultados]
```

- Manejo de backpressure para evitar desbordamiento de memoria
- Configurable en: frames sin procesar, FPS objetivo, resolución

#### Agregación — AsyncTrafficDataAggregator

- Agrega datos de frames individuales en ventanas de **60 segundos**
- Produce un objeto `TrafficData` por zona cada minuto
- Persiste automáticamente en CSV

### Flujo de procesamiento de un frame

```
Frame capturado
    ↓ ResizeProcessor (ajustar resolución)
    ↓ DetectionProcessor (YOLO)
    ↓ TrackingProcessor (ByteTrack)
    ↓ SpeedProcessor (desplazamiento de píxeles)
    ↓ ZoneProcessor (intersección polígono)
    ↓ VisualizationProcessor (dibujar anotaciones)
    ↓ AggregatorProcessor (acumular para CSV)
Resultado: FrameAnalysis
```

---

## 6. Módulo de Predicción

El proyecto tiene **dos sistemas de predicción** en paralelo:

### Sistema 1: Random Forest (producción)

Modelos scikit-learn entrenados con los CSV generados por el módulo de visión.

**Modelos entrenados:**
- `traffic_rf_classifier_current.joblib` — nivel de congestión actual
- `traffic_rf_classifier_15min.joblib` — predicción a 15 minutos
- `traffic_rf_classifier_30min.joblib` — predicción a 30 minutos
- `traffic_rf_classifier_45min.joblib` — predicción a 45 minutos
- Equivalentes con `regressor` para el conteo de vehículos

**Features de entrada:**
```
vehicle_counts, occupancy_rate, flow_rate_per_min,
avg_speed, avg_density, hour_of_day, day_of_week
```

**Clases de congestión:** `Free`, `Low`, `Moderate`, `High`, `Heavy`

**Entrenamiento:**
```bash
python scripts/train_models.py
```

### Sistema 2: STGNN — TimeThenSpaceModel (investigación)

Red neuronal de grafos spatiotemporal implementada con PyTorch + Torch Geometric.

**Dataset:** MetrLA — 207 sensores de tráfico de Los Ángeles

**Arquitectura del modelo:**

```
Input (batch, tiempo, nodos, features)
    ↓
Node Embeddings + Encoder lineal
    ↓
Procesador temporal (GRU / RNN)
    ↓
Procesador espacial (Difusión en grafo)
    ↓
MLPDecoder (multi-step)
    ↓
Output (batch, nodos, horizonte, features)
```

**Parámetros:**
- Lookback: 12 pasos (60 minutos de histórico)
- Horizonte: 12 pasos (60 minutos de predicción)
- Muestreo: cada 5 minutos
- emb_size=16, hidden_size=32, gnn_kernel=2

**Métricas de evaluación:** MAE, MAPE, RMSE, R²

**Entrenamiento:**
```bash
# Dentro de Predictor/
python scripts/train.py
```

---

## 7. Frontend — Panel de control

Aplicación React/TypeScript con 5 vistas principales.

### Vistas

#### 1. Dashboard / Monitoreo (C4)
- Tarjetas KPI en tiempo real: conteo de vehículos, velocidad promedio, nivel de congestión, salud de sensores
- Mapa interactivo Leaflet con ubicación de cámaras
- Lista de cámaras con estado y estadísticas rápidas
- Clic en cámara → Vista de detalle

#### 2. Vista de detalle de cámara
- Resumen de detección de vehículos
- Métricas por zona y gráficos
- Velocidad y flujo en tiempo real
- Widget de historial de tráfico (`TrafficHistoryWidget`)

#### 3. Analytics & IA
- Tendencias históricas (día/semana/mes)
- Análisis de patrones
- Gráficos de predicción
- Insights generados por IA

#### 4. Alertas
- Notificaciones de incidentes
- Advertencias de congestión
- Detección de anomalías
- Modal para generación de reportes

#### 5. Administración
- Configuración del sistema
- Gestión de cámaras
- Gestión de usuarios
- Exportación de datos

### Componentes reutilizables

| Componente | Descripción |
|-----------|-------------|
| `AIChatWidget` | Chat con IA (stub) |
| `TrafficHistoryWidget` | Gráfico de historial de tráfico |
| `Card` | Tarjeta de UI reutilizable |
| `Badge` | Indicador de estado (colores) |

### Servicio de predicción (`predictionService.ts`)

```typescript
predictionService.predictTraffic(input: PredictionInput): Promise<PredictionResult>
```

Llama al Prediction API en `:8001/predictions/predict` y devuelve el nivel de congestión predicho con un mensaje de alerta si aplica.

---

## 8. Base de datos

### Tecnología: PostgreSQL + TimescaleDB + PostGIS

- **TimescaleDB**: extensión para series temporales, permite crear *hypertables* con compresión y down-sampling automático
- **PostGIS**: extensión geoespacial para almacenar y consultar geometrías (puntos, líneas, polígonos)

### Tablas

#### Topología de red vial

| Tabla | Descripción |
|-------|-------------|
| `graph_nodes` | Intersecciones viales (lat, lon, geometría PostGIS) |
| `graph_edges` | Segmentos de calle (distancia, carriles, geometría) |
| `cameras` | Cámaras instaladas (heading, FOV, nodo asociado) |

#### Series temporales (Hypertables)

| Tabla | Descripción |
|-------|-------------|
| `waze_jams` | Eventos de congestión de Waze (timestamp, velocidad, nivel) |
| `waze_alerts` | Alertas de Waze (incidentes, construcción) |
| `vision_tracks` | Trayectorias individuales de vehículos detectados |
| `vision_flows` | Flujos agregados de vehículos por intervalo de tiempo |

---

## 9. APIs expuestas

### Vision API — `http://localhost:8000`

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| `POST` | `/cameras/{camera_id}/start` | Iniciar monitoreo de una cámara |
| `POST` | `/cameras/{camera_id}/stop` | Detener monitoreo |
| `GET` | `/cameras/status` | Estado de todas las cámaras activas |
| `POST` | `/cameras/{camera_id}` | Añadir nueva cámara dinámicamente |

**Ejemplo de respuesta:**
```json
{
  "status": "starting",
  "camera_id": "CAM_001"
}
```

### Prediction API — `http://localhost:8001`

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| `POST` | `/predictions/predict` | Obtener predicción de congestión |
| `GET` | `/predictions/history/{camera_id}` | Historial y predicción futura |

**Ejemplo de body (POST /predictions/predict):**
```json
{
  "camera_id": "CAM_001",
  "total_vehicles": 45,
  "occupancy_rate": 0.75,
  "flow_rate_per_min": 12,
  "avg_speed": 25.5,
  "avg_density": 0.6,
  "hour": 8,
  "day_of_week": 1
}
```

**Ejemplo de respuesta:**
```json
{
  "data": {
    "current_congestion_level": "High",
    "predicted_congestion_15min": "Heavy",
    "predicted_congestion_30min": "Moderate",
    "predicted_congestion_45min": "Low",
    "predicted_vehicles_15min": 150,
    "confidence_score": 0.85
  },
  "alert": true,
  "message": "Advertencia: Se espera aumento de congestión en los próximos 15 minutos."
}
```

---

## 10. Modelos de datos

### Entidades principales del dominio

```python
# Vehículo detectado en un frame
DetectedVehicle:
  id: str                          # ID de tracking
  type: str                        # "car" | "motorcycle" | "bus" | "truck"
  confidence: float                # Confianza YOLO (0.0-1.0)
  bbox: Tuple[x1, y1, x2, y2]     # Bounding box en píxeles
  timestamp: float                 # Unix timestamp
  speed: Optional[float]           # Velocidad en km/h

# Frame analizado
FrameAnalysis:
  frame_id: int
  timestamp: float
  vehicles: List[DetectedVehicle]
  total_count: int
  zones: Optional[List[ZoneVehicleCount]]

# Conteo por zona (en un frame)
ZoneVehicleCount:
  zone_id: str
  vehicle_count: int
  avg_speed: float
  occupancy: float                 # 0.0 = vacío, 1.0 = congestionado
  vehicle_types: Dict[str, int]    # {"car": 10, "truck": 2, ...}
  camera_id: str
  street_monitored: str

# Datos agregados de tráfico (ventana de 60 segundos)
TrafficData:
  timestamp: float
  zone_id, camera_id, street_monitored: str
  duration_seconds: float
  total_vehicles: float
  avg_density: float
  avg_speed: float
  avg_occupancy: float
  flow_rate_per_min: int
  car_count, bus_count, truck_count, motorcycle_count: int
```

---

## 11. Configuración

El sistema usa **Hydra** para gestión de configuración. Las configuraciones se pueden sobreescribir desde la línea de comandos.

### Configuración de visión (`conf/vision/default.yaml`)

```yaml
# Fuente de video
source: "https://www.youtube.com/watch?v=6dp-bvQ7RWo"
source_type: "youtube"   # youtube | webcam | file

# Zonas de monitoreo (polígonos en píxeles)
zones:
  zone1:
    camera_id: "CAM_001"
    street: "Av. Javier Prado"
    polygon: [[370, 560], [813, 190], ...]

# Estimación de velocidad
speed_estimation:
  enabled: true
  pixels_per_meter: 10.0

# Persistencia de datos
persistence:
  enabled: true
  type: "csv"
  interval_seconds: 60
  output_dir: "data/traffic_logs"

# Servidor API
server:
  host: "0.0.0.0"
  port: 8000

# Rendimiento
performance:
  target_width: 1280
  target_height: 720
  detect_every_n_frames: 1
  target_fps: 30

# Modelo YOLO
model:
  path: "yolo11n.pt"
  conf_threshold: 0.3

display: true   # Mostrar ventana de OpenCV
```

### Perfiles de configuración disponibles

| Perfil | Descripción |
|--------|-------------|
| `default` | Configuración balanceada para producción |
| `balanced` | Mayor precisión, menor FPS |
| `low_latency` | Menor latencia, menor precisión |

```bash
# Usar un perfil específico
python scripts/run_vision.py vision=low_latency
```

### Configuración de predicción (`Predictor/config/config.yaml`)

```yaml
data:
  dataset_name: "MetrLA"
  n_nodes: 207
  window: 12      # 60 minutos de lookback
  horizon: 12     # 60 minutos de predicción

model:
  name: "TimeThenSpaceModel"
  emb_size: 16
  hidden_size: 32
  gnn_kernel: 2

training:
  learning_rate: 0.001
  batch_size: 64
  max_epochs: 100
  early_stopping_patience: 10
```

---

## 12. Tests

### Backend (pytest)

**Tests de visión (`tests/vision/`):**

| Archivo | ¿Qué prueba? |
|---------|-------------|
| `test_yolo_detector.py` | Precisión del detector YOLO |
| `test_sources.py` | Adaptadores de fuentes de video |
| `test_zones.py` | Precisión del conteo por zonas |
| `test_async_pipeline.py` | Threading del pipeline asíncrono |
| `test_tracker_stabilization.py` | Consistencia de IDs de tracking |
| `test_broadcaster.py` | Broadcast en tiempo real |
| `test_smart_detection.py` | Procesador de detección |
| `test_builder.py` | Construcción del pipeline completo |
| `test_api_routes.py` | Endpoints de la API |
| `test_persistence.py` | Almacenamiento CSV |

**Tests de predicción (`tests/prediction/`):**

| Archivo | ¿Qué prueba? |
|---------|-------------|
| `test_predictor.py` | Lógica de predicción de congestión |
| `test_routes.py` | Endpoints de la API de predicción |

**Ejecutar todos los tests:**
```bash
cd CerebroVial
pytest tests/ -v
```

### Frontend (Vitest)

| Archivo | Tests |
|---------|-------|
| `CameraDetailView.test.tsx` | 5 tests del componente de detalle de cámara |
| `TrafficHistoryWidget.test.tsx` | 3 tests del widget de historial |

**Ejecutar tests del frontend:**
```bash
cd Frontend
npm run test
npm run test:coverage   # con reporte de cobertura
```

### Resultados actuales

De acuerdo con `evidence_report.md`:
- ✅ 8 tests de backend pasando
- ✅ 8 tests de frontend pasando
- ⚠️ Advertencias menores sobre `act()` en React (no bloquean)

---

## 13. Flujo de datos end-to-end

```
1. ADQUISICIÓN DE VIDEO
   YouTube Live / Webcam / Archivo MP4
           │
           ▼
2. CAPTURA (hilo I/O separado)
   Frame → Buffer (evita bloqueos de red)
           │
           ▼
3. PROCESAMIENTO (hilo principal)
   Resize → YOLO Detection → ByteTrack → Speed → ZoneCount
           │
           ▼
4. AGREGACIÓN (ventana 60 segundos)
   Múltiples FrameAnalysis → TrafficData (una fila por zona)
           │
           ▼
5. PERSISTENCIA
   CSV: data/traffic_logs/CAM_001_YYYYMMDD.csv
           │
           ├────────────────────────────────────►
           │                                    │
           ▼                                    ▼
6a. API DE VISIÓN (:8000)              6b. ENTRENAMIENTO ML
    → Frontend Dashboard                   Random Forest / STGNN
                                               │
                                               ▼
                                       7. API DE PREDICCIÓN (:8001)
                                           → Frontend Alertas/Predicciones
```

---

## 14. Estado actual del proyecto

| Componente | Estado | Notas |
|-----------|--------|-------|
| Módulo de visión | ✅ Production-ready | Multi-fuente, GPU, zonas configurables |
| API de visión | ✅ Funcional | FastAPI con endpoints CRUD de cámaras |
| Random Forest (predicción) | ✅ Funcional | 8 modelos entrenados (clasificación + regresión) |
| API de predicción | ✅ Funcional | Endpoints REST para predicción e historial |
| Frontend dashboard | ✅ Funcional | 5 vistas, mapa, gráficos, alertas |
| STGNN (investigación) | 🚧 En desarrollo | Entrenamiento funcional, evaluación en proceso |
| Módulo de control | 📋 Planificado | Solo entidades de dominio definidas |
| Base de datos | 📋 Planificado | Modelos definidos, sin migración automática |

---

## 15. Cómo ejecutar el proyecto

### Requisitos previos

- Python 3.10+
- Node.js 18+
- YOLO model: `yolo11n.pt` (descarga automática al primer uso)
- Opcional: GPU CUDA/MPS para mejor rendimiento

### 1. Módulo de visión

```bash
cd CerebroVial

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar con visualización (ventana OpenCV)
python scripts/run_vision.py

# Ejecutar sin GUI (solo API)
python scripts/run_server.py

# Cambiar perfil de configuración
python scripts/run_vision.py vision=low_latency
```

### 2. Módulo de predicción

```bash
cd CerebroVial

# Entrenar modelos Random Forest con logs existentes
python scripts/train_models.py

# Ejecutar servicio de predicción
python scripts/run_prediction.py
```

### 3. Frontend

```bash
cd Frontend

# Instalar dependencias
npm install

# Servidor de desarrollo (con HMR)
npm run dev

# Build de producción
npm run build
```

### 4. STGNN (investigación)

```bash
cd Predictor

# Entrenar red neuronal spatiotemporal
python scripts/train.py

# Evaluar modelo
python scripts/evaluate.py

# Visualizar red de tráfico
python scripts/visualize_network.py
```

---

## Resumen ejecutivo

**CerebroVial** es una tesis de grado que implementa un sistema completo de monitoreo y predicción de tráfico urbano. El proyecto aborda el problema de la congestión vial en Miraflores, Lima, mediante:

1. **Visión por computador**: Usa YOLO y ByteTrack para detectar y rastrear vehículos en streams de video reales de YouTube, calculando métricas de tráfico por zonas geográficas definidas.

2. **Machine Learning**: Entrena modelos Random Forest (producción) y una red neuronal de grafos spatiotemporal (investigación) para predecir el nivel de congestión a 15, 30 y 45 minutos.

3. **Dashboard web**: Proporciona a los operadores de tráfico una interfaz moderna con mapa interactivo, gráficos en tiempo real y alertas de predicción.

La arquitectura está bien estructurada en capas (Domain → Application → Infrastructure → Presentation), el código de visión es production-ready con tests comprehensivos, y el sistema de predicción tiene una implementación dual que permite comparar un modelo clásico interpretable con una red neuronal de investigación.

---

*Generado automáticamente el 2026-04-13*
