# MODEL.md — Especificación del Modelo GRU CerebroVial

**Versión:** 1.2
**Fecha:** 2026-05-04
**Fase:** F1 (diseño), F2 ejecutada, F3 pendiente
**Autor:** Andrés / Cesar + Claude (partner de planificación)

> Este documento es la fuente de verdad para implementar el predictor
> GRU de CerebroVial. Claude Code debe leerlo completo antes de tocar
> cualquier archivo de `ia_prediction_service/`.

**Cambios desde v1.1:**
- §5.9 nueva: distribución observada tras ejecución de F2 (commit `b5223e5f`). Clases 3-5 son <1% combinadas.
- §5.10 nueva: plan B si F3 no aprende clases minoritarias.
- §6.2 actualizada: cap de class_weights a 30× para mitigar el ratio extremo (D-010).
- F2 incorporó mecanismo de incidentes (P=0.003) durante implementación para garantizar presencia de 5 niveles (D-009). Documentado retroactivamente.

**Cambios desde v1.0:**
- Class weights en CrossEntropy + métricas por clase + F1 macro como
  segunda métrica primaria, para mitigar desbalance esperado del
  dataset sintético (§6.2, §7).
- Z-score **global** (no por road_type) para `speed_mps`,
  `delay_seconds`, `jam_length_m` (§2.1).
- Timestamps del CSV en UTC; `hour_of_day` y `day_of_week` derivados
  de hora local Lima (§5.5, §5.6).
- Manejo explícito de bordes entre splits al construir samples (§5.7).
- Nota sobre `is_weekend` como columna de inspección, no feature del
  modelo (§5.2).
- Targets de F1 y MAE marcados como sugeridos a calibrar con
  primeros resultados; solo accuracy ≥ 0.80 en t15 viene del
  documento de tesis (§7.2).

---

## 1. Propósito y alcance

El modelo GRU predice el nivel de congestión (`congestion_level` 1-5)
para una arista del grafo vial de Miraflores en tres horizontes:
**+15 min, +30 min y +45 min**. Reemplaza el RandomForest temporal
que hoy sirve predicciones en `core_management_api`.

**Qué hace el modelo:**

- Recibe una secuencia de 12 timesteps (1 hora de historia, intervalos
  de 5 min) de features de una arista.
- Devuelve tres distribuciones de probabilidad sobre 5 clases de
  congestión (una por horizonte de predicción).

**Qué NO hace el modelo:**

- No usa información de otras aristas ni del grafo (eso era el STGNN,
  descartado). Un modelo, pesos compartidos entre todas las aristas.
- No procesa datos de visión. El GRU se entrena y opera exclusivamente
  sobre datos del estilo `waze_jams`.
- No requiere GPU para inferencia.

---

## 2. Features de entrada

### 2.1 Secuencia temporal (12 timesteps × 8 features)

Para cada timestep `t-11` a `t` (ventana de 1 hora, paso de 5 min):

| Feature | Tipo | Fuente | Normalización |
|---|---|---|---|
| `speed_mps` | float | `waze_jams.speed_mps` | Z-score global (train) |
| `delay_seconds` | float | `waze_jams.delay_seconds` | Z-score global (train) |
| `congestion_level` | float | `waze_jams.congestion_level` | Min-max → [0, 1] (fijo: 1→0, 5→1) |
| `jam_length_m` | float | `waze_jams.jam_length_m` | Z-score global (train) |
| `hour_sin` | float | `sin(2π × hour_of_day / 24)` | Ya en [-1, 1] |
| `hour_cos` | float | `cos(2π × hour_of_day / 24)` | Ya en [-1, 1] |
| `dow_sin` | float | `sin(2π × day_of_week / 7)` | Ya en [-1, 1] |
| `dow_cos` | float | `cos(2π × day_of_week / 7)` | Ya en [-1, 1] |

> **Z-score global:** una sola media y desviación estándar por feature,
> calculadas sobre el subset `train` completo. La diferencia entre
> tipos de vía la captura el modelo vía `road_type` (feature estática);
> no se necesitan scalers por categoría.

> **`hour_of_day` y `day_of_week`** se calculan en **hora local Lima**
> (`America/Lima`, UTC−5, sin DST), aunque el `timestamp` del CSV
> esté en UTC. Ver §5.6.

**Tensor de entrada:** `(batch_size, seq_len=12, input_size=8)`

El encoding cíclico de `hour` y `dow` preserva la continuidad
circular (lunes-domingo, 23h-0h) que el modelo necesita para aprender
patrones de hora pico.

### 2.2 Feature estática (concatenada al estado final del GRU)

| Feature | Tipo | Fuente | Codificación |
|---|---|---|---|
| `road_type` | int | `waze_jams.road_type` | One-hot, 5 categorías (0-4) |

`road_type` es constante para una arista dada. Se concatena al estado
oculto final del GRU antes de las capas lineales del decoder, no al
input secuencial. Esto permite que el decoder adapte la predicción al
tipo de vía sin perturbar la dinámica temporal del GRU.

**Vector estático:** `(batch_size, 5)`

---

## 3. Target

### 3.1 Codificación

- **Variable:** `congestion_level` 1-5 (definición Waze)
- **Tipo de problema:** clasificación multiclase (5 clases)
- **Encoding interno:** label encoding 0-4 (desplazamiento de -1)
- **Output del modelo:** logits sin softmax, shape `(batch_size, 5)`,
  uno por horizonte

### 3.2 Horizontes de predicción

| Horizonte | Timesteps hacia adelante | Nombre interno |
|---|---|---|
| +15 min | 3 | `t15` |
| +30 min | 6 | `t30` |
| +45 min | 9 | `t45` |

El modelo produce los tres horizontes en un único forward pass
(tres cabezas de salida, encoder compartido).

### 3.3 Construcción del sample

Dado un timestep `t` para una arista `e`:
- **Input:** filas de `waze_jams` para `e` en `[t-11, t]` (12 filas)
- **Label t15:** `congestion_level` de `e` en `t+3`
- **Label t30:** `congestion_level` de `e` en `t+6`
- **Label t45:** `congestion_level` de `e` en `t+9`

Si faltan filas en la ventana de input (edge sin observaciones
continuas): el sample se descarta durante entrenamiento. En
inferencia: se permite padding con ceros + flag `low_confidence`.

Restricciones adicionales en construcción del Dataset → ver §5.7.

---

## 4. Arquitectura del modelo

### 4.1 Diagrama

```
Input (B, 12, 8)
      │
  ┌───▼───┐
  │  GRU  │  hidden=64, layers=2, dropout=0.3
  └───┬───┘
      │ último estado oculto (B, 64)
      │
      ├── Concat road_type one-hot (B, 5) → (B, 69)
      │
  ┌───▼───┐
  │  FC1  │  69 → 32, ReLU, Dropout(0.2)
  └───┬───┘
      │
  ┌───┴─────────┬─────────────┐
  │             │             │
┌─▼──┐       ┌─▼──┐       ┌─▼──┐
│head│       │head│       │head│
│t15 │       │t30 │       │t45 │
│32→5│       │32→5│       │32→5│
└────┘       └────┘       └────┘
```

### 4.2 Parámetros

| Componente | Parámetro | Valor |
|---|---|---|
| GRU | `input_size` | 8 |
| GRU | `hidden_size` | 64 |
| GRU | `num_layers` | 2 |
| GRU | `dropout` | 0.3 (entre capas, no en última) |
| GRU | `batch_first` | True |
| FC1 | in → out | 69 → 32 |
| FC1 | activación | ReLU |
| FC1 | dropout | 0.2 |
| Cabeza × 3 | in → out | 32 → 5 (logits) |

**Parámetros totales estimados:** ~27 000. Entrena en CPU en minutos
con el dataset sintético.

### 4.3 Clase Python

```python
# ia_prediction_service/src/models/gru_congestion.py

import torch
import torch.nn as nn
from typing import Dict

ROAD_TYPE_CATEGORIES = 5   # road_type 0..4
CONGESTION_CLASSES = 5     # congestion_level 1..5 → 0..4 interno


class CongestionGRU(nn.Module):
    """
    GRU per-edge para predicción de congestion_level.
    Un modelo, pesos compartidos entre todas las aristas.
    Tres cabezas de salida: horizontes +15, +30, +45 min.
    """

    def __init__(
        self,
        input_size: int = 8,
        hidden_size: int = 64,
        num_layers: int = 2,
        gru_dropout: float = 0.3,
        fc_dropout: float = 0.2,
        road_type_categories: int = ROAD_TYPE_CATEGORIES,
        num_classes: int = CONGESTION_CLASSES,
    ):
        super().__init__()

        self.gru = nn.GRU(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=gru_dropout if num_layers > 1 else 0.0,
            batch_first=True,
        )

        decoder_input_size = hidden_size + road_type_categories

        self.fc1 = nn.Sequential(
            nn.Linear(decoder_input_size, 32),
            nn.ReLU(),
            nn.Dropout(fc_dropout),
        )

        self.head_t15 = nn.Linear(32, num_classes)
        self.head_t30 = nn.Linear(32, num_classes)
        self.head_t45 = nn.Linear(32, num_classes)

    def forward(
        self,
        x: torch.Tensor,                  # (B, 12, 8)
        road_type_onehot: torch.Tensor,   # (B, 5)
    ) -> Dict[str, torch.Tensor]:
        _, h_n = self.gru(x)              # h_n: (num_layers, B, hidden)
        h_last = h_n[-1]                  # (B, hidden_size)

        h_cat = torch.cat([h_last, road_type_onehot], dim=-1)  # (B, 69)
        h_dec = self.fc1(h_cat)           # (B, 32)

        return {
            "t15": self.head_t15(h_dec),  # (B, 5) logits
            "t30": self.head_t30(h_dec),
            "t45": self.head_t45(h_dec),
        }
```

---

## 5. Dataset sintético (spec para F2)

> La tarea F2 implementa `generate_synthetic_data.py` basándose en
> esta spec. Ver también el prompt de Claude Code de F2.

### 5.1 Qué genera el script

Un archivo CSV (`ia_prediction_service/data/synthetic_waze_jams.csv`)
con datos sintéticos del estilo `waze_jams`, listos para armar
sequences de entrenamiento del GRU.

### 5.2 Schema del CSV de salida

```
timestamp, edge_id, speed_mps, delay_seconds, congestion_level,
jam_length_m, road_type, hour_of_day, day_of_week, is_weekend, split
```

| Columna | Descripción |
|---|---|
| `timestamp` | datetime UTC, paso de 5 min, formato ISO 8601 |
| `edge_id` | string (ej. `"larco_n_diagonal"`) |
| `speed_mps` | float ≥ 0 |
| `delay_seconds` | int ≥ 0 |
| `congestion_level` | int 1-5 |
| `jam_length_m` | int ≥ 0 |
| `road_type` | int, valores {0, 1, 2, 3, 4} |
| `hour_of_day` | int 0-23, **derivado de hora local Lima** |
| `day_of_week` | int 0-6 (0=lunes), **derivado de hora local Lima** |
| `is_weekend` | bool |
| `split` | string `"train"`, `"val"`, `"test"` |

> **Nota sobre `is_weekend`:** se incluye en el CSV para inspección
> humana y debugging. **No es feature del modelo:** la información
> de fin de semana ya está codificada en `dow_sin`/`dow_cos`. El
> Dataset de PyTorch ignora esta columna al construir los tensores.

### 5.3 Grafo sintético de Miraflores

El script define internamente un mini-grafo de 20 nodos / 38 aristas
que representa el área de Miraflores. Cada arista tiene:

| Atributo | Descripción |
|---|---|
| `edge_id` | string legible (ej. `"larco_n_diagonal"`) |
| `road_type` | int {0-4}, según tipo |
| `free_flow_speed_kmh` | float, velocidad de flujo libre |
| `length_m` | float, longitud aproximada en metros |

Mapeo `road_type → free_flow_speed_kmh` estándar:

| road_type | Descripción | free_flow_speed_kmh |
|---|---|---|
| 0 | calle local | 30 |
| 1 | avenida secundaria | 45 |
| 2 | avenida principal | 60 |
| 3 | vía rápida | 80 |
| 4 | autopista | 100 |

### 5.4 Calibración con METR-LA

El script carga `ia_prediction_service/data/metr_la.h5` y extrae:

1. **Patrón temporal:** velocidad media por `(hour_of_day, day_of_week)`
   normalizada a [0, 1]. Matriz de 24 × 7 = 168 valores. METR-LA está
   en hora local Los Ángeles; se mantiene en su hora local para la
   extracción del patrón (lo que importa es la forma del patrón
   "8 AM laborable", no la hora UTC absoluta).
2. **Autocorrelación lag-1:** coeficiente de correlación entre `v(t)`
   y `v(t-1)` promediado sobre todos los sensores. Usado para añadir
   persistencia temporal realista.
3. **Desviación estándar por slot:** matriz 24 × 7 de std, para
   calibrar la amplitud del ruido gaussiano.

> `metr_la.h5` contiene velocidades en mph de ~207 detectores de LA.
> Se usa **solo para calibrar distribuciones temporales**, no como
> datos de entrenamiento directos.

### 5.5 Generación de la serie temporal

Para cada arista `e` y cada slot de 5 min `t`:

```
# t es un timestamp UTC; lo convertimos a Lima local para indexar
# el patrón METR-LA (que también está en hora local de su zona)
t_lima = t.astimezone(ZoneInfo("America/Lima"))
h = t_lima.hour
d = t_lima.weekday()
pattern = metr_la_pattern[h][d]       ∈ [0, 1]
std = metr_la_std[h][d]

# Velocidad relativa al free-flow con autocorrelación
ratio(t) = α * ratio(t-1) + (1-α) * (pattern + N(0, std))
ratio(t) = clip(ratio(t), 0.05, 1.0)

speed_mps(t) = free_flow_speed_mps(e) * ratio(t)
```

Donde `α` es el coeficiente de autocorrelación extraído de METR-LA
(típicamente 0.7-0.9 en tráfico).

**Derivación de `congestion_level`** a partir de `ratio`:

| ratio | congestion_level |
|---|---|
| > 0.80 | 1 (flujo libre) |
| 0.60 – 0.80 | 2 (ralentizado) |
| 0.40 – 0.60 | 3 (congestionado) |
| 0.20 – 0.40 | 4 (muy congestionado) |
| ≤ 0.20 | 5 (embotellamiento) |

**Derivación de `delay_seconds`:**

```
free_flow_time = edge_length_m / free_flow_speed_mps
actual_time    = edge_length_m / speed_mps(t)
delay_seconds  = max(0, actual_time - free_flow_time)
```

**Derivación de `jam_length_m`:**

```
jam_length_m = edge_length_m * (1 - ratio) * density_factor(road_type)
```

Donde `density_factor` es un escalar por tipo de vía (e.g., 0.5 para
locales, 1.0 para avenidas principales) que refleja densidad de
vehículos.

### 5.6 Zonas horarias

Convención del proyecto:

| Dato | Zona horaria |
|---|---|
| `timestamp` (columna del CSV) | **UTC** |
| `hour_of_day`, `day_of_week`, `is_weekend` (columnas del CSV) | **Hora local Lima** (`America/Lima`, UTC−5, sin DST) |
| `hour_sin`, `hour_cos`, `dow_sin`, `dow_cos` (features del modelo) | Derivadas de `hour_of_day` y `day_of_week` (Lima) |

Esto es crítico para evitar bugs silenciosos: si el script aplica
`pattern[timestamp_utc.hour]` sobre un timestamp UTC, el pico de la
mañana cae a las 3 AM hora Lima y el modelo aprende una distribución
desfasada 5 horas.

El **`PredictorService` en `core_management_api` aplica la misma
convención** al construir features de inferencia desde
`waze_jams.snapshot_timestamp` (que está en UTC).

### 5.7 Volumen, split y manejo de bordes

| Subset | Período (días desde inicio) | Filas aprox. |
|---|---|---|
| Train | 1 – 60 (60 días) | ~657 000 |
| Validation | 61 – 76 (16 días) | ~175 000 |
| Test | 77 – 92 (16 días) | ~175 000 |
| **Total** | **92 días** | **~1 014 000** |

Cálculo: 38 aristas × 288 slots/día × 92 días ≈ 1 014 000 filas.

**Split temporal estricto:** la columna `split` se asigna por rango
de fechas, no por shuffle aleatorio. Obligatorio para evitar data
leakage.

**Manejo de bordes entre splits (responsabilidad del Dataset, F3):**

Al construir samples para entrenamiento, descartar todo anchor `t`
cuyo horizonte más largo (`t + 9` timesteps) cae en un split distinto
al del propio `t`. Por ejemplo: el último anchor válido del subset
`train` es el timestep `t` cuyo `t + 9` todavía pertenece a `train`;
los siguientes 9 timesteps de `train` no producen samples válidos.

Esto descarta ~9 timesteps × 38 aristas × 2 bordes ≈ 684 samples
totales, despreciable frente al volumen del dataset, y elimina el
data leakage residual entre splits.

### 5.8 Outputs del script

```
ia_prediction_service/data/
├── synthetic_waze_jams.csv       # dataset principal (~80 MB)
├── scaler_params.json            # parámetros de normalización Z-score
└── dataset_stats.json            # estadísticas de distribución
```

`scaler_params.json` contiene las medias y desviaciones estándar de
`speed_mps`, `delay_seconds`, `jam_length_m` calculadas **solo sobre
el subset `train`**, para replicar la normalización en inferencia.

### 5.9 Distribución observada tras ejecución de F2

Tras ejecutar `generate_synthetic_data.py` con `--seed 42` y
`INCIDENT_PROB = 0.003`, la distribución real del dataset es:

| Nivel | Train | Val | Test | % global |
|---|---|---|---|---|
| 1 (flujo libre) | 345,180 | 93,330 | 102,178 | 53.7% |
| 2 (ralentizado) | 296,486 | 79,996 | 79,801 | 45.3% |
| 3 (congestionado) | 4,357 | 1,251 | 1,254 | 0.69% |
| 4 (muy congestionado) | 893 | 256 | 247 | 0.14% |
| 5 (embotellamiento) | 1,060 | 271 | 288 | 0.16% |

La distribución es consistente entre splits (val y test ±2% de las
proporciones de train), lo cual valida que los class_weights calculados
sobre train son representativos para val/test.

**Implicación para F3:** los class weights inversamente proporcionales
sin restricción producirían un ratio máximo de ~407× entre clase 1
y clase 4, lo cual desestabiliza el entrenamiento. Ver §6.2 para la
decisión de capear los pesos a 30× (D-010).

### 5.10 Plan B si F3 no aprende clases minoritarias

Si tras entrenar el GRU el F1 macro de clases 4-5 (medido por separado)
queda < 0.20 — el modelo ignora las clases minoritarias incluso con
weight cap — volver a F2 y ajustar `INCIDENT_PROB` de 0.003 a 0.012.
Esto cuadruplica la frecuencia de incidentes y lleva clases 4-5 a
~0.6% cada una, lo cual es entrenable sin riesgo de inestabilidad.

Esta acción **NO se ejecuta preventivamente.** Solo se invoca si F3
falla el threshold mínimo de F1 macro en clases minoritarias después
del entrenamiento completo.

---

## 6. Entrenamiento

### 6.1 Configuración

| Parámetro | Valor |
|---|---|
| Optimizer | Adam, lr=1e-3 |
| Scheduler | ReduceLROnPlateau, mode='max', factor=0.5, patience=5 |
| Criterio del scheduler | F1 macro en validación (horizonte t15) |
| Loss | CrossEntropyLoss con `weight=class_weights`, suma sobre los 3 horizontes |
| Epochs máx | 50 |
| Early stopping | patience=10 sobre F1 macro val t15 |
| Batch size | 256 |
| Hardware target | CPU (sin requisito GPU) |

### 6.2 Función de pérdida con class weights

El dataset sintético está fuertemente desbalanceado: con los umbrales
de `ratio → congestion_level` definidos en §5.5 y un patrón METR-LA
donde la mayor parte del tiempo el tráfico fluye, la clase 1 (flujo
libre) representa ~60-70% de los samples. Sin compensar esto, un
modelo trivial alcanzaría >65% accuracy sin haber aprendido nada
útil sobre congestión.

**Solución:** pesos inversamente proporcionales a la frecuencia de
clase, calculados sobre el subset `train`:

> **Cap de pesos (D-010):** los pesos crudos se capean a `WEIGHT_CAP = 30`
> antes de la normalización final. Esto mantiene los pesos minoritarios
> ~100× los dominantes (suficiente señal de aprendizaje) pero evita el
> ratio 407× crudo que causa oscilación durante el entrenamiento.

```python
from collections import Counter
import torch
import torch.nn as nn

# labels_train_t15: tensor 1D con los labels (0..4) del horizonte t15
counts = Counter(labels_train_t15.tolist())
total = sum(counts.values())
weights = torch.tensor([
    total / (5 * counts[c]) for c in range(5)
], dtype=torch.float)

# Cap inverso para mitigar inestabilidad de clases con <0.2% soporte (D-010, §5.9).
# Sin cap, el ratio max entre pesos sería ~407×, desestabilizando el entrenamiento.
WEIGHT_CAP = 30.0
weights = torch.clamp(weights, max=WEIGHT_CAP)

# Re-normalizar después del cap para preservar suma=5
weights = weights * (5.0 / weights.sum())

criterion = nn.CrossEntropyLoss(weight=weights)
```

Los pesos se calculan **una sola vez** sobre los labels de `t15` en
`train`, y se aplican a las tres cabezas. La distribución de labels
de `t30` y `t45` es similar; usar pesos separados por horizonte
agrega complejidad sin aporte claro.

Los pesos se guardan en `scaler_params.json` para reproducibilidad y
para ser cargados por el script de evaluación.

```python
loss = (
    criterion(logits["t15"], labels_t15) +
    criterion(logits["t30"], labels_t30) +
    criterion(logits["t45"], labels_t45)
)
```

Pesos iguales entre los tres horizontes en la suma de losses. Si el
modelo muestra dificultad consistente en t45 vs t15, ajustar a
`0.5/0.3/0.2`, pero empezar con iguales.

### 6.3 Script de entrenamiento

Archivo: `ia_prediction_service/scripts/train_gru.py`

El script:
1. Carga `synthetic_waze_jams.csv` y `scaler_params.json`.
2. Calcula `class_weights` sobre el subset train (si no están ya
   guardados en `scaler_params.json`) y los persiste.
3. Construye `WazeJamDataset` (PyTorch Dataset) que genera samples
   `(x_seq, road_type_onehot, label_t15, label_t30, label_t45)`,
   aplicando el descarte de bordes entre splits descrito en §5.7.
4. Entrena con los parámetros de la sección 6.1.
5. Loguea métricas por epoch (train loss, val F1 macro × 3 horizontes,
   val accuracy × 3 horizontes) a
   `ia_prediction_service/notebooks/logs/train_YYYYMMDD_HHMMSS.csv`.
6. Guarda el mejor checkpoint (por F1 macro val t15) como
   `ia_prediction_service/models/gru_congestion_v1.pt` (state_dict).

---

## 7. Métricas

### 7.1 Función de pérdida (entrenamiento)

CrossEntropyLoss con class weights, suma de los tres horizontes. Se
reporta en logs como `train_loss` y `val_loss`.

### 7.2 Métricas de evaluación (val y test)

**Métricas primarias (umbrales de éxito):**

| Métrica | Descripción | Target (t15) | Origen del target |
|---|---|---|---|
| **Accuracy** | Fracción de predicciones exactas | **≥ 0.80** | Documento de tesis (fijo) |
| **F1 macro** | Promedio no ponderado de F1 por clase | **≥ 0.65** | Sugerido para discusión, calibrar tras primer entrenamiento |

> El F1 **macro** se prefiere al **weighted** porque el weighted
> esconde el desempeño en clases minoritarias (4 y 5, que son
> precisamente las más relevantes para el control adaptativo de
> semáforos). Macro fuerza a que el modelo sea competente en las
> 5 clases, no solo en las dominantes.

**Métricas secundarias (diagnóstico, no umbrales):**

- **Accuracy por clase:** fracción correcta dentro de cada
  congestion_level. Permite ver si el modelo solo es bueno en clase 1.
- **MAE ordinal:** `mean(|pred_class - true_class|)` con clases en
  rango 0-4. Mide cuán "lejos" se equivoca el modelo cuando se
  equivoca. Target sugerido: ≤ 0.40 (calibrar con primeros resultados).
- **Confusion matrix 5×5** por horizonte. Visualizar si los errores
  se concentran en confundir clases adyacentes (aceptable) o
  distantes (problemático).
- **Per-class precision / recall** por horizonte.

Todas estas métricas se reportan **por horizonte** (t15 / t30 / t45)
y agregadas (promedio simple sobre los tres).

### 7.3 Outputs de evaluación

El script de entrenamiento genera al final:

```
ia_prediction_service/notebooks/logs/
├── eval_report_YYYYMMDD.json         # métricas numéricas
└── confusion_matrices_YYYYMMDD.png   # 3 subplots, una matriz por horizonte
```

Estructura de `eval_report_YYYYMMDD.json`:

```json
{
  "checkpoint": "gru_congestion_v1.pt",
  "subset": "test",
  "horizons": {
    "t15": {
      "accuracy": 0.0,
      "f1_macro": 0.0,
      "f1_weighted": 0.0,
      "mae_ordinal": 0.0,
      "accuracy_per_class": {"1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0},
      "precision_per_class": {"1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0},
      "recall_per_class": {"1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0},
      "confusion_matrix": [[0, 0, 0, 0, 0]]
    },
    "t30": { "...": "..." },
    "t45": { "...": "..." }
  },
  "class_weights_used": [0.0, 0.0, 0.0, 0.0, 0.0]
}
```

---

## 8. Exportación e integración en `core_management_api`

### 8.1 Formato del modelo exportado

State dict de PyTorch (no TorchScript, para simplicidad en tesis):

```python
torch.save(model.state_dict(), "models/gru_congestion_v1.pt")
```

El archivo `.pt` es trackeado por Git LFS (ya configurado en
`.gitattributes`).

### 8.2 `PredictorService` en `core_management_api`

Ubicación: `core_management_api/src/prediction/predictor_service.py`

**Responsabilidades:**

1. Cargar `gru_congestion_v1.pt` y `scaler_params.json` en startup
   de FastAPI (como singleton, no por request).
2. Exponer método `predict(edge_id: str, db_session) -> PredictionResult`.
3. El método hace lookup de las últimas 12 filas de `waze_jams` para
   `edge_id` (ordenadas por `snapshot_timestamp` DESC), construye el
   tensor de input, corre el forward pass en CPU, retorna probabilidades
   y clase predicha para los 3 horizontes.

> **Importante:** al construir features desde `snapshot_timestamp`
> (que está en UTC), aplicar la **misma conversión a hora Lima**
> que usa `generate_synthetic_data.py` para `hour_of_day` y
> `day_of_week`. Cualquier divergencia entre training-time y
> serving-time en el manejo de zona horaria desbalancea las
> features cíclicas. Ver §5.6.

**Modelo de respuesta:**

```python
@dataclass
class HorizonPrediction:
    congestion_level: int          # 1-5
    confidence: float              # softmax max probability
    probabilities: list[float]     # softmax sobre 5 clases

@dataclass
class PredictionResult:
    edge_id: str
    t15: HorizonPrediction
    t30: HorizonPrediction
    t45: HorizonPrediction
    low_confidence: bool           # True si se usó padding (< 12 filas)
    timestamp_utc: str
```

### 8.3 Endpoint FastAPI

```
GET /api/v1/predict/congestion/{edge_id}
```

Parámetros: `edge_id` en path. Registrarlo en el router unificado
de `core_management_api` (regla de CLAUDE.md).

Respuesta 200: `PredictionResult` como JSON.
Respuesta 404: edge_id no existe en `graph_edges`.
Respuesta 503: < 3 filas disponibles (umbral mínimo para predicción útil).

### 8.4 Manejo de datos faltantes en inferencia

Si hay entre 3 y 11 filas disponibles: pad con ceros al inicio de la
secuencia hasta completar 12 timesteps. Retornar `low_confidence: true`.

Si hay < 3 filas: retornar 503.

---

## 9. Restricciones y dependencias

### 9.1 Lo que NO se instala en `core_management_api`

`torch` se instala en `core_management_api` únicamente para inferencia
(carga de state dict + forward pass). **NO se instala `ultralytics`.**
La dependencia de torch para inferencia es liviana y no viola la
limpieza de requirements establecida en C7.

> **Verificar** que `torch` CPU-only esté permitido en
> `core_management_api/requirements.txt`. Si el equipo decide no
> instalar torch en ese módulo, la alternativa es exportar el modelo
> a ONNX (`torch.onnx.export`) e inferir con `onnxruntime` (sin
> dependencia torch). Decidir antes de F4.

### 9.2 Dependencias de `ia_prediction_service`

```
torch              # entrenamiento + export
pytorch-lightning  # opcional, solo si se usa para el training loop
scikit-learn       # métricas (accuracy, F1, confusion matrix)
pandas             # manipulación del CSV
numpy              # operaciones numéricas
h5py               # lectura de metr_la.h5
matplotlib         # plot de confusion matrices
```

`ultralytics` y `tsl` (la librería del STGNN) **no son dependencias**
del GRU.

### 9.3 Archivos que NO se modifican

- `ia_prediction_service/src/models/time_then_space.py` — queda como
  referencia del STGNN descartado. No tocar (regla de CLAUDE.md).
- `edge_device/src/vision/` — no relacionado con el GRU.
- `metr_la.h5` en LFS — solo lectura por el script de generación.

---

## 10. Tareas derivadas (referencia a TODO.md)

| Tarea | Descripción | Fase |
|---|---|---|
| F2 | `generate_synthetic_data.py` — genera el CSV | F2 |
| F3 | `train_gru.py` — entrena el modelo | F3 |
| F4 | `PredictorService` + endpoint en `core_management_api` | F3 |
| F5 | Tests del `PredictorService` + mock del modelo | F3 |
| F6 | Validación end-to-end (frontend → API → predicción) | F3 |

---

## Apéndice A — Justificación de decisiones clave

**¿Por qué GRU y no LSTM?**
GRU tiene menos parámetros (no tiene celda de memoria separada) y
converge más rápido en datasets de tamaño moderado. Para secuencias
de longitud 12 la diferencia de capacidad vs LSTM no justifica la
complejidad adicional. Alineado con el documento de tesis.

**¿Por qué clasificación y no regresión?**
`congestion_level` 1-5 es una escala ordinal discreta definida por
Waze, no una variable continua. Tratarla como clasificación permite
reportar accuracy directamente (métrica del documento de tesis) y
obtener distribuciones de probabilidad por clase (útil para el
frontend y para el motor de control adaptativo).

**¿Por qué pesos compartidos entre aristas?**
El dataset sintético tiene ~38 aristas × ~1M filas / 38 ≈ 26 000
samples por arista. No alcanza para entrenar modelos independientes
con capacidad útil. Pesos compartidos + `road_type` como feature
estática captura la heterogeneidad entre tipos de vía sin sobreajuste.

**¿Por qué no embeddings de arista?**
Embeddings aprenderían identidades de arista, no patrones generalizables.
Con dataset sintético de 3 meses y ~40 aristas, el riesgo de memorizar
es alto. La feature `road_type` es suficiente como diferenciador
estructural y es más defendible en el jurado.

**¿Por qué dataset sintético calibrado vs datos reales?**
Sin acceso a la API de Waze ni datos históricos de Miraflores, el
sintético calibrado es la opción académicamente honesta. Calibrar
contra METR-LA (dataset público estándar de tráfico vehicular)
permite afirmar que las distribuciones del dataset respetan patrones
reales documentados, lo cual es defendible.

**¿Por qué F1 macro como métrica primaria junto a accuracy?**
El dataset es desbalanceado (clase 1 dominante). Accuracy puede ser
alta sin que el modelo sea útil en clases minoritarias (4 y 5),
que son precisamente las que importan para el control adaptativo.
F1 macro fuerza desempeño parejo en las 5 clases. Combinado con
class weights en la loss y métricas por clase, reduce el riesgo de
defender un modelo que en realidad solo predice la clase mayoritaria.