# Addendum para DECISIONS.md — Decisión técnica D-009

> Este archivo contiene **únicamente** la nueva decisión técnica D-009 que debe agregarse al final del archivo `DECISIONS.md` existente del proyecto.
>
> Instrucción: copiar el contenido a partir del título `## D-009` al final de `DECISIONS.md`, manteniendo el formato y estilo del resto del documento.
>
> **Fecha de creación del addendum:** 2026-05-13.

---

## D-009 — Variable de estado predicha: jam level (constructo Waze)

**Fecha:** 2026-05-13.
**Estado:** Cerrada.
**Reemplaza:** No reemplaza decisión previa. Complementa D-006 (GRU univariado por intersección) especificando la variable objetivo del modelo.

### Decisión

Se adopta el constructo **"jam level"** de Waze (escala ordinal 0-5) como variable de estado del sistema y como objetivo del modelo predictivo.

### Definición de niveles (según Waze)

| Nivel | Significado | Umbral de ratio velocidad/free-flow |
|---|---|---|
| 0 | Flujo libre | ratio ≥ 90% |
| 1 | Bajo | 70% ≤ ratio < 90% |
| 2 | Medio | 50% ≤ ratio < 70% |
| 3 | Alto | 30% ≤ ratio < 50% |
| 4 | Muy alto | 0 < ratio < 30% |
| 5 | Vía cerrada | velocidad = 0 |

donde `ratio = velocidad_promedio / velocidad_flujo_libre`.

### Anclajes documentados oficialmente

Los anclajes nivel 1 ≈ 80% del free-flow y nivel 4 ≈ 20% del free-flow están documentados en el paper:

> Carvalho et al. (2022). *JamVis: exploration and visualization of traffic jams.* The European Physical Journal Special Topics. DOI: 10.1140/epjs/s11734-021-00424-2

El paper cita textualmente: *"a jam with level 4 (20% of free-flow speed), while the light orange line represents a jam with level 1 (80% of free-flow speed)"*.

Los umbrales 70%, 50%, 30% (niveles 1, 2 y 3) se obtienen por **interpolación lineal** de 20 puntos porcentuales entre los anclajes documentados. Es la interpretación natural y se declara explícitamente como tal. Los umbrales pueden ajustarse contra datos reales de Waze cuando se obtenga acceso vía el asesor de Miraflores; el principio del constructo no cambia.

### Mapeo SUMO → jam_level

```python
def sumo_to_jam_level(mean_speed_mps, max_speed_mps):
    """Mapea velocidad de SUMO a jam level (constructo Waze)."""
    if mean_speed_mps == 0:
        return 5
    ratio = mean_speed_mps / max_speed_mps
    if ratio >= 0.90: return 0
    if ratio >= 0.70: return 1
    if ratio >= 0.50: return 2
    if ratio >= 0.30: return 3
    return 4
```

- `mean_speed_mps` se obtiene de SUMO vía TraCI: `traci.edge.getLastStepMeanSpeed`.
- `max_speed_mps` se obtiene de `traci.lane.getMaxSpeed` o del archivo de red, como aproximación inicial de velocidad de flujo libre. Para mayor precisión, se puede sustituir por el percentil 85 o 95 del histórico de velocidades del segmento en condiciones de baja demanda (práctica estándar en ingeniería de tráfico).

### Mapeo Waze → jam_level

Directo, viene en el feed CCP de Waze (campo `level` de cada `jam`). No requiere transformación.

### Justificación

1. **Intercambiabilidad de fuente de datos sin reentrenar el modelo:** el entorno de validación (SUMO), una fuente real (Waze) y, eventualmente, la visión computacional propia producen la misma variable de estado. Esto elimina dependencia arquitectónica entre el modelo predictivo y la fuente de datos.

2. **Constructo validado por industria:** Waze procesa cientos de millones de trayectorias diarias usando este algoritmo. La adopción de su variable no es arbitraria; es replicación de un estándar de facto del sector. En sustentación es defendible: "no inventamos un índice; replicamos uno validado por una de las plataformas de tráfico más usadas del mundo".

3. **Coherencia con el HCM:** el principio "velocidad relativa al flujo libre" es la base del Level of Service del *Highway Capacity Manual* para arterias urbanas (medida por velocidad de viaje y razón volumen/capacidad). La adopción del constructo Waze hereda este fundamento académico.

4. **Compatibilidad con D-006:** variable univariada por intersección/segmento. Una sola serie temporal por dirección. Cumple D-006 sin modificarla.

5. **Interpretabilidad operativa:** el Operador entiende inmediatamente "nivel 4 de 5", concepto familiar de su propio Waze cotidiano. No requiere entrenamiento técnico para interpretar la salida del modelo.

### Implicancias para el modelo

- Se entrena el modelo para predecir el **ratio continuo** velocidad/free-flow.
- La discretización al nivel discreto (0-5) ocurre solo en la capa de presentación, para preservar resolución del entrenamiento y métricas de evaluación (MAE/RMSE sobre el ratio).
- La variable es univariada por segmento, una serie temporal por dirección, cumpliendo D-006.

### Implicancias para las HUs

- **HU-02** (monitoreo en tiempo real, Bloque B) sigue mostrando flujo y cola observados (variables primarias, sin transformación). El Operador conserva la visión física del tráfico en tiempo real.
- **HU-03** (predicción, Bloque B) muestra jam level predicho (0-5). El umbral de "congestión" para resaltar visualmente se establece por defecto en nivel ≥ 3, configurable en la HU del Bloque D dedicada a configuración del motor (origen F20).

### Caveat para la sustentación

Waze **no publica oficialmente los umbrales exactos** de cada nivel. Lo que tenemos son:

1. La definición cualitativa de niveles (0 = flujo libre, 5 = vía cerrada).
2. Dos puntos de calibración del paper JamVis (nivel 1 ≈ 80%, nivel 4 ≈ 20%).
3. Confirmación de que el algoritmo es velocidad relativa al flujo libre (documentación oficial de Waze for Cities partners).

Los umbrales intermedios (60% para nivel 2, 40% para nivel 3) son **deducidos por interpolación lineal**, no oficiales. Esto se documenta honestamente: replicamos el principio del algoritmo, calibramos los anclajes documentados, e interpolamos linealmente los intermedios. Es replicación de un constructo público con los detalles documentados disponibles, no ingeniería inversa de un secreto comercial.

### Trabajo futuro asociado

Cuando se disponga de acceso a datos históricos de Waze sobre la intersección objetivo (vía acuerdo con la municipalidad de Miraflores), se debe:

1. Calibrar los umbrales intermedios (60%, 40%) contra los niveles observados en el feed real de Waze para esa intersección.
2. Validar que el modelo entrenado sobre SUMO mantiene precisión aceptable cuando se alimenta con Waze.
3. Documentar diferencias sistemáticas entre el constructo replicado y el oficial de Waze, si las hubiera.

El diseño actual permite esta extensión **sin cambios al modelo predictivo**, solo agregando un adaptador de fuente Waze que ya devuelve `jam_level` directamente del feed.

### Referencias

- Carvalho, C. et al. (2022). *JamVis: exploration and visualization of traffic jams.* The European Physical Journal Special Topics. DOI: 10.1140/epjs/s11734-021-00424-2
- Waze Data Feed specifications. Google Support (Waze for Cities partners). Disponible en: https://support.google.com/waze/partners/answer/13458165
- Transportation Research Board. *Highway Capacity Manual.* Para fundamentación del LOS basado en velocidad relativa al flujo libre.
- Afrin, T., & Yodo, N. (2020). Survey citado en: *Applications of deep learning in congestion detection, prediction and alleviation: A survey.* ScienceDirect (2021), respaldando la práctica de definir congestión a partir de una sola variable primaria.

### Documentos relacionados

- D-006 — GRU univariado por intersección (define el tipo de modelo; D-009 define la variable que predice).
- D-007 — Visión como componente demostrable, con validación independiente.
- D-008 — SUMO genera dataset de entrenamiento y escenarios de validación.
- `HU_BLOQUE_B.md`, HU-02 y HU-03 — primeras HUs operativas que consumen este constructo.
- `EVOLUCION_TESIS.md` — sección de trabajo futuro, donde se declara la integración con Waze.
