import math

import pytest

from src.control.application.webster import (
    WebsterCalculator,
    WebsterInfeasible,
    WebsterResult,
)


def test_compute_happy_path_two_phases():
    calc = WebsterCalculator()

    result = calc.compute(
        flows={"NS": 600, "EW": 500},
        saturations={"NS": 1800, "EW": 1800},
        lost_time=8.0,
    )

    assert isinstance(result, WebsterResult)
    assert calc.min_cycle <= result.cycle_seconds <= calc.max_cycle
    assert set(result.green_by_phase) == {"NS", "EW"}
    # NS has higher flow → larger green allocation.
    assert result.green_by_phase["NS"] > result.green_by_phase["EW"]
    # Greens consume the cycle minus lost time exactly.
    assert math.isclose(
        sum(result.green_by_phase.values()),
        result.cycle_seconds - 8.0,
        rel_tol=1e-9,
    )


def test_compute_oversaturation_raises():
    calc = WebsterCalculator()

    with pytest.raises(WebsterInfeasible):
        calc.compute(
            flows={"NS": 1750, "EW": 1750},
            saturations={"NS": 1800, "EW": 1800},
            lost_time=8.0,
        )


def test_compute_single_phase_returns_full_green():
    calc = WebsterCalculator()

    result = calc.compute(
        flows={"ONLY": 500},
        saturations={"ONLY": 1800},
        lost_time=4.0,
    )

    assert list(result.green_by_phase) == ["ONLY"]
    assert math.isclose(
        result.green_by_phase["ONLY"],
        result.cycle_seconds - 4.0,
        rel_tol=1e-9,
    )


def test_compute_zero_flow_distributes_uniformly():
    calc = WebsterCalculator()

    result = calc.compute(
        flows={"NS": 0, "EW": 0},
        saturations={"NS": 1800, "EW": 1800},
        lost_time=8.0,
    )

    # Y == 0 → cycle clamps to min_cycle (since (1.5*L+5)/1 = 17 < 30).
    assert result.cycle_seconds == calc.min_cycle
    assert math.isclose(
        result.green_by_phase["NS"],
        result.green_by_phase["EW"],
        rel_tol=1e-9,
    )


def test_compute_rejects_mismatched_phase_ids():
    calc = WebsterCalculator()

    with pytest.raises(ValueError):
        calc.compute(
            flows={"NS": 500},
            saturations={"EW": 1800},
            lost_time=4.0,
        )


def test_compute_rejects_non_positive_saturation():
    calc = WebsterCalculator()

    with pytest.raises(ValueError):
        calc.compute(
            flows={"NS": 500},
            saturations={"NS": 0},
            lost_time=4.0,
        )
