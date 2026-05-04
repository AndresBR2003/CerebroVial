#!/usr/bin/env python3
"""
Generate synthetic Waze-style traffic dataset for GRU model training.

Temporal patterns are extracted from METR-LA (Los Angeles traffic sensors, 2012).
Graph: 20 nodes, 38 edges covering main avenues of Miraflores district (Lima, Peru).

Timezone convention (MODEL.md §5.6):
  - timestamp column in CSV: UTC (ISO 8601 with offset)
  - hour_of_day, day_of_week, is_weekend: derived from America/Lima local time (UTC-5, no DST)
  - METR-LA patterns: indexed with LA local time (index is tz-naive LA in the h5 file)

metr_la.h5 structure:
  Pandas HDFStore, key='data'. shape=(34272, 207), float32, speeds in mph.
  Index is DatetimeIndex tz-naive in America/Los_Angeles local time.
  207 sensor IDs as column names. Alpha lag-1 measured: ~0.939.

AR(1) note: no burn-in applied. The first ~50 timesteps per edge have initialization
bias (~0.2% of the dataset), which is acceptable for thesis purposes.

Incident mechanism: METR-LA freeway data has pattern_min≈0.63, so the AR(1) never
naturally reaches ratio≤0.20 (congestion level 5). To ensure all 5 congestion levels
are present (required for GRU training and class_weight computation in F3), a small
fraction of timesteps (P_INCIDENT=0.003) are overridden with a low ratio sampled from
U[0.02, 0.35], simulating accidents or road-blocking events. These overrides also produce
realistic "recovery" patterns in subsequent timesteps due to the AR(1) persistence.
"""

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import numpy as np
import pandas as pd

LIMA = ZoneInfo("America/Lima")

# ---------------------------------------------------------------------------
# Miraflores road graph — 20 nodes, 38 edges
# Avenues covered: Larco, Benavides, Rep. de Panamá, Cdte. Espinar,
#                  Diagonal, Armendáriz, and local connecting streets.
# ---------------------------------------------------------------------------
MIRAFLORES_EDGES = [
    # --- Av. Larco (N-S, avenida principal, tipo 2, 60 km/h) ---
    {"edge_id": "larco_n_schell",        "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 220},
    {"edge_id": "larco_schell_kennedy",  "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 180},
    {"edge_id": "larco_kennedy_bvdas",   "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 310},
    {"edge_id": "larco_bvdas_pardo",     "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 380},
    {"edge_id": "larco_pardo_diag",      "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 290},
    # --- Av. Benavides (E-W, avenida principal, tipo 2, 60 km/h) ---
    {"edge_id": "bvdas_e_panama",        "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 450},
    {"edge_id": "bvdas_panama_larco",    "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 520},
    {"edge_id": "bvdas_larco_espinar",   "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 370},
    {"edge_id": "bvdas_espinar_w",       "road_type": 2, "free_flow_speed_kmh": 60, "length_m": 280},
    # --- Av. Rep. de Panamá (N-S, vía rápida, tipo 3, 80 km/h) ---
    {"edge_id": "panama_n_schell",       "road_type": 3, "free_flow_speed_kmh": 80, "length_m": 350},
    {"edge_id": "panama_schell_bvdas",   "road_type": 3, "free_flow_speed_kmh": 80, "length_m": 490},
    {"edge_id": "panama_bvdas_pardo",    "road_type": 3, "free_flow_speed_kmh": 80, "length_m": 410},
    {"edge_id": "panama_pardo_diag",     "road_type": 3, "free_flow_speed_kmh": 80, "length_m": 380},
    {"edge_id": "panama_s_ovalo",        "road_type": 3, "free_flow_speed_kmh": 80, "length_m": 320},
    # --- Av. Cdte. Espinar (N-S, avenida secundaria, tipo 1, 45 km/h) ---
    {"edge_id": "espinar_n_schell",      "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 260},
    {"edge_id": "espinar_schell_bvdas",  "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 420},
    {"edge_id": "espinar_bvdas_pardo",   "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 350},
    {"edge_id": "espinar_pardo_armen",   "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 300},
    # --- Av. Diagonal (NW-SE, avenida secundaria, tipo 1, 45 km/h) ---
    {"edge_id": "diagonal_larco_schell", "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 340},
    {"edge_id": "diagonal_schell_mid",   "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 280},
    {"edge_id": "diagonal_mid_armen",    "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 310},
    # --- Av. Armendáriz (N-S costera, avenida secundaria, tipo 1, 45 km/h) ---
    {"edge_id": "armen_n_pardo",         "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 380},
    {"edge_id": "armen_pardo_diag",      "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 290},
    {"edge_id": "armen_s_malecon",       "road_type": 1, "free_flow_speed_kmh": 45, "length_m": 420},
    # --- Calles locales conectoras (tipo 0, 30 km/h) ---
    {"edge_id": "schell_larco_panama",   "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 480},
    {"edge_id": "schell_panama_espinar", "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 350},
    {"edge_id": "pardo_larco_espinar",   "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 390},
    {"edge_id": "pardo_espinar_armen",   "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 420},
    {"edge_id": "miraflores_e_w",        "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 510},
    {"edge_id": "tarata_e_w",            "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 360},
    {"edge_id": "chiclayo_e_w",          "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 290},
    {"edge_id": "alcanfores_n_s",        "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 450},
    {"edge_id": "colina_n_s",            "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 380},
    {"edge_id": "2deMayo_e_w",           "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 320},
    {"edge_id": "grau_e_w",              "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 410},
    {"edge_id": "ovalo_gutierrez_n",     "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 280},
    {"edge_id": "ovalo_gutierrez_s",     "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 270},
    {"edge_id": "santa_cruz_e_w",        "road_type": 0, "free_flow_speed_kmh": 30, "length_m": 350},
]

assert len(MIRAFLORES_EDGES) == 38, f"Expected 38 edges, got {len(MIRAFLORES_EDGES)}"

# Fraction of timesteps overridden with a low ratio to simulate accidents/blockages.
# Ensures all 5 congestion levels appear (METR-LA freeway patterns alone never reach
# ratio≤0.20 because pattern_min≈0.63 with alpha=0.939).
P_INCIDENT = 0.003


def find_metr_la(cli_path: str | None) -> Path:
    """Locate metr_la.h5: CLI arg → data/ → notebooks/data/ fallback."""
    script_dir = Path(__file__).parent.parent
    candidates = [
        Path(cli_path) if cli_path else None,
        script_dir / "data" / "metr_la.h5",
        script_dir / "notebooks" / "data" / "metr_la.h5",
    ]
    for p in candidates:
        if p is not None and p.exists():
            return p
    raise FileNotFoundError(
        "metr_la.h5 not found. Tried: data/metr_la.h5 and notebooks/data/metr_la.h5. "
        "Pass --metr-la-path to specify the location."
    )


def load_metr_la_patterns(path: Path) -> tuple[np.ndarray, np.ndarray, float, str]:
    """
    Read METR-LA, extract per-(hour, weekday) ratio patterns and lag-1 autocorrelation.

    Normalization: per-sensor 95th-percentile speed as free-flow proxy.
    ratio = speed_mph / free_flow_p95, clipped to [0, 1].

    The index of the HDFStore is tz-naive in America/Los_Angeles local time,
    so df.index.hour / df.index.dayofweek are used directly without conversion.

    Returns:
        pattern_arr: (24, 7) mean ratio per (hour_LA, weekday_LA)
        std_arr:     (24, 7) std  ratio per (hour_LA, weekday_LA)
        alpha:       float, average Pearson lag-1 correlation across 207 sensors (~0.939)
        key_used:    str, HDF key used (always 'data')
    """
    key_used = "data"
    df_metr = pd.read_hdf(path, key=key_used)      # (34272, 207), float32, mph
    speeds = df_metr.values.astype(np.float32)      # (T, 207)

    free_flow = np.percentile(speeds, 95, axis=0)   # (207,) per-sensor free-flow
    free_flow = np.maximum(free_flow, 1.0)          # guard against broken sensors

    print(
        f"[metr_la] key='{key_used}'  shape={speeds.shape}"
        f"  speed mph: min={speeds.min():.2f} max={speeds.max():.2f}"
    )
    print(
        f"[metr_la] free_flow p95 per sensor:"
        f"  min={free_flow.min():.1f}  max={free_flow.max():.1f}  mean={free_flow.mean():.1f} mph"
    )

    ratio_mat = np.clip(speeds / free_flow[np.newaxis, :], 0.0, 1.0)  # (T, 207)

    # Index is already in LA local time — use hour/dayofweek directly
    hours_la = df_metr.index.hour.to_numpy()        # (T,)
    dows_la  = df_metr.index.dayofweek.to_numpy()   # (T,) 0=Monday

    pattern_arr = np.zeros((24, 7), dtype=np.float64)
    std_arr     = np.zeros((24, 7), dtype=np.float64)
    for h in range(24):
        for d in range(7):
            mask = (hours_la == h) & (dows_la == d)
            vals = ratio_mat[mask].ravel()
            if len(vals) > 0:
                pattern_arr[h, d] = vals.mean()
                std_arr[h, d]     = vals.std()

    print(
        f"[metr_la] pattern (ratio): min={pattern_arr.min():.3f}  max={pattern_arr.max():.3f}"
    )

    # Alpha lag-1: Pearson(v[t], v[t-1]) averaged over all sensors
    alphas = []
    for col in speeds.T:
        valid = col[~np.isnan(col)]
        if len(valid) > 1:
            corr = np.corrcoef(valid[:-1], valid[1:])[0, 1]
            if not np.isnan(corr):
                alphas.append(float(corr))
    alpha = float(np.mean(alphas))
    print(f"[metr_la] alpha lag-1 = {alpha:.4f}")

    return pattern_arr, std_arr, alpha, key_used


def build_timestamps() -> tuple:
    """
    Build 92-day UTC timestamp series (5-min step) and pre-compute Lima-time arrays.

    Start: 2025-01-06T00:00:00 UTC (Monday). Lima is UTC-5, no DST.
    N_SLOTS = 92 * 24 * 12 = 26,496.

    Returns timestamps_utc, ts_lima, hours_lima (ndarray), days_lima (ndarray),
            is_weekend (ndarray bool), dates_lima (ndarray of date objects).
    """
    N_SLOTS = 92 * 24 * 12   # 26_496
    start_utc = datetime(2025, 1, 6, 0, 0, 0, tzinfo=timezone.utc)
    timestamps_utc = pd.date_range(start=start_utc, periods=N_SLOTS, freq="5min", tz="UTC")

    ts_lima    = timestamps_utc.tz_convert(LIMA)
    hours_lima = ts_lima.hour.to_numpy()        # (N_SLOTS,) int
    days_lima  = ts_lima.dayofweek.to_numpy()   # (N_SLOTS,) 0=Monday
    is_weekend = days_lima >= 5
    dates_lima = np.array([t.date() for t in ts_lima])  # (N_SLOTS,) date objects

    return timestamps_utc, ts_lima, hours_lima, days_lima, is_weekend, dates_lima


def generate_edge(
    edge: dict,
    pattern_arr: np.ndarray,
    std_arr: np.ndarray,
    alpha: float,
    hours_lima: np.ndarray,
    days_lima: np.ndarray,
    rng: np.random.Generator,
) -> dict:
    """
    Generate AR(1) speed/congestion time series for one edge.

    ratio(t) = alpha * ratio(t-1) + (1-alpha) * (pattern(h,d) + noise(t))
    noise ~ N(0, std(h,d)), clipped to [0.05, 1.0].
    Escape hatch if too slow: replace loop with scipy.signal.lfilter.
    """
    T = len(hours_lima)
    pattern_vec = pattern_arr[hours_lima, days_lima]   # (T,)
    std_vec     = std_arr[hours_lima, days_lima]        # (T,)
    noise = rng.standard_normal(T) * std_vec            # vectorized

    ratio = np.empty(T, dtype=np.float32)
    ratio[0] = np.clip(pattern_vec[0] + noise[0], 0.05, 1.0)
    for i in range(1, T):
        raw = alpha * ratio[i - 1] + (1.0 - alpha) * (pattern_vec[i] + noise[i])
        ratio[i] = np.clip(raw, 0.05, 1.0)

    # Incident overrides: simulate accidents/blockages that METR-LA patterns can't produce.
    # Post-incident slots recover gradually via AR(1) persistence (realistic behaviour).
    n_incidents = rng.binomial(T, P_INCIDENT)
    if n_incidents > 0:
        incident_slots = rng.choice(T, n_incidents, replace=False)
        ratio[incident_slots] = rng.uniform(0.02, 0.35, n_incidents).astype(np.float32)

    free_flow_mps = edge["free_flow_speed_kmh"] / 3.6
    speed_mps = (free_flow_mps * ratio).astype(np.float32)

    free_flow_t   = edge["length_m"] / free_flow_mps
    actual_t      = edge["length_m"] / speed_mps
    delay_seconds = np.maximum(0, (actual_t - free_flow_t)).astype(np.int32)

    density_factor = {0: 0.4, 1: 0.6, 2: 0.8, 3: 1.0, 4: 1.2}[edge["road_type"]]
    jam_length_m = (edge["length_m"] * (1.0 - ratio) * density_factor).astype(np.int32)

    cong = np.select(
        [ratio > 0.80, ratio > 0.60, ratio > 0.40, ratio > 0.20],
        [1, 2, 3, 4],
        default=5,
    ).astype(np.int8)

    return {
        "speed_mps":        speed_mps,
        "delay_seconds":    delay_seconds,
        "congestion_level": cong,
        "jam_length_m":     jam_length_m,
    }


def assign_splits(dates_lima: np.ndarray) -> np.ndarray:
    """
    Assign 'train'/'val'/'test' split anchored on Lima calendar days.
    Days 1-60 → train, 61-76 → val, 77-92 → test.
    """
    unique_days = sorted(set(dates_lima))
    train_set = set(unique_days[:60])
    val_set   = set(unique_days[60:76])

    split = pd.Series(dates_lima).map(
        lambda d: "train" if d in train_set else ("val" if d in val_set else "test")
    ).to_numpy()
    return split


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate synthetic traffic dataset for GRU training."
    )
    parser.add_argument(
        "--output-dir", default="ia_prediction_service/data/",
        help="Directory for output files (created if missing).",
    )
    parser.add_argument(
        "--metr-la-path", default=None,
        help="Path to metr_la.h5. Auto-detected if not specified.",
    )
    parser.add_argument(
        "--seed", type=int, default=42,
        help="Random seed for reproducibility.",
    )
    args = parser.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Single rng passed to all generation functions to preserve reproducibility.
    # Parallelizing across edges would change rng consumption order between runs.
    rng = np.random.default_rng(args.seed)

    # 1. Load METR-LA patterns
    metr_la_path = find_metr_la(args.metr_la_path)
    pattern_arr, std_arr, alpha, key_used = load_metr_la_patterns(metr_la_path)

    # 2. Pre-compute timestamp arrays once — reused for every edge
    timestamps_utc, ts_lima, hours_lima, days_lima, is_weekend, dates_lima = build_timestamps()
    T       = len(timestamps_utc)
    N_EDGES = len(MIRAFLORES_EDGES)
    print(f"[generate] {N_EDGES} edges × {T:,} slots = {N_EDGES * T:,} rows")

    # 3. Compute split labels at the T-slot level, then tile for all edges
    split_per_slot = assign_splits(dates_lima)         # (T,)
    split_full     = np.tile(split_per_slot, N_EDGES)  # (T*N_EDGES,)

    # 4. Generate per-edge frames and concatenate
    frames = []
    for edge in MIRAFLORES_EDGES:
        ed = generate_edge(edge, pattern_arr, std_arr, alpha, hours_lima, days_lima, rng)
        frames.append(pd.DataFrame({
            "timestamp":        timestamps_utc,
            "edge_id":          edge["edge_id"],
            "speed_mps":        ed["speed_mps"],
            "delay_seconds":    ed["delay_seconds"],
            "congestion_level": ed["congestion_level"],
            "jam_length_m":     ed["jam_length_m"],
            "road_type":        np.full(T, edge["road_type"], dtype=np.int8),
            "hour_of_day":      hours_lima,
            "day_of_week":      days_lima,
            "is_weekend":       is_weekend,
        }))

    df = pd.concat(frames, ignore_index=True)
    df["split"] = split_full

    counts = df["split"].value_counts()
    print(
        f"[split]    train={counts.get('train', 0):,}"
        f"  val={counts.get('val', 0):,}"
        f"  test={counts.get('test', 0):,}"
    )

    # 5. Serialize timestamp as ISO 8601 UTC — unambiguous for pd.to_datetime(..., utc=True) in F3
    df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%dT%H:%M:%S%z")

    # 6. Write CSV (columns in spec order)
    col_order = [
        "timestamp", "edge_id", "speed_mps", "delay_seconds",
        "congestion_level", "jam_length_m", "road_type",
        "hour_of_day", "day_of_week", "is_weekend", "split",
    ]
    csv_path = out_dir / "synthetic_waze_jams.csv"
    df[col_order].to_csv(csv_path, index=False)

    # 7. Z-score scaler params — global, computed on train subset only
    train_df = df[df["split"] == "train"]
    scaler: dict = {}
    for feat in ["speed_mps", "delay_seconds", "jam_length_m"]:
        scaler[feat] = {
            "mean": float(train_df[feat].mean()),
            "std":  float(train_df[feat].std(ddof=0)),
        }
    scaler.update({
        "congestion_level_min": 1,
        "congestion_level_max": 5,
        "timezone":             "America/Lima",
        "metr_la_alpha_used":   alpha,
        "metr_la_key_used":     key_used,
        "seed_used":            args.seed,
    })
    scaler_path = out_dir / "scaler_params.json"
    scaler_path.write_text(json.dumps(scaler, indent=2))

    # 8. Dataset statistics (congestion_level_distribution_by_split feeds F3 class_weights)
    cong_total = df["congestion_level"].value_counts().sort_index()
    cong_by_split: dict = {}
    for s in ["train", "val", "test"]:
        sub = df[df["split"] == s]["congestion_level"].value_counts().sort_index()
        cong_by_split[s] = {str(k): int(v) for k, v in sub.items()}

    mean_speed_by_rt = (
        df.groupby("road_type")["speed_mps"].mean().round(4).to_dict()
    )

    stats = {
        "total_rows":    len(df),
        "rows_by_split": {s: int(counts.get(s, 0)) for s in ["train", "val", "test"]},
        "congestion_level_distribution": {str(k): int(v) for k, v in cong_total.items()},
        "congestion_level_distribution_by_split": cong_by_split,
        "mean_speed_mps_by_road_type": {str(k): float(v) for k, v in mean_speed_by_rt.items()},
        "alpha_used":        alpha,
        "metr_la_key_used":  key_used,
        "seed_used":         args.seed,
        "timezone_convention": "timestamp=UTC, hour_of_day/day_of_week=America/Lima",
    }
    stats_path = out_dir / "dataset_stats.json"
    stats_path.write_text(json.dumps(stats, indent=2))

    print(f"[done]     {csv_path}  {scaler_path}  {stats_path}")


if __name__ == "__main__":
    main()
