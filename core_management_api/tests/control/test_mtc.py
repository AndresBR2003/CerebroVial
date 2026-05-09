import math

import pytest

from src.control.application.mtc_constraints import (
    ConstrainedCycle,
    MTCConstants,
    MTCRestrictionApplier,
)


def test_apply_passes_through_when_within_bounds():
    applier = MTCRestrictionApplier()

    result = applier.apply({"NS": 25.0, "EW": 20.0})

    assert isinstance(result, ConstrainedCycle)
    assert result.adjustments == []
    greens = {t.phase_id: t.green for t in result.timings}
    assert greens == {"NS": 25.0, "EW": 20.0}
    # Yellow + all_red appear per phase.
    for t in result.timings:
        assert t.yellow == 3.0
        assert t.all_red == 2.0
    # Cycle = sum greens + 5s per phase lost time.
    assert math.isclose(result.cycle_seconds, 45.0 + 5 * 2, rel_tol=1e-9)


def test_apply_floors_to_min_green():
    applier = MTCRestrictionApplier()

    result = applier.apply({"NS": 3.0, "EW": 30.0})

    greens = {t.phase_id: t.green for t in result.timings}
    assert greens["NS"] == 7.0
    assert any("phase NS" in adj and "raised" in adj for adj in result.adjustments)


def test_apply_truncates_to_max_green():
    applier = MTCRestrictionApplier()

    result = applier.apply({"NS": 80.0, "EW": 20.0})

    greens = {t.phase_id: t.green for t in result.timings}
    # 80 → truncated to 60 first; cycle then = 60 + 20 + 10 = 90 ≤ 120 → no second pass.
    assert greens["NS"] == 60.0
    assert any("truncated" in adj for adj in result.adjustments)


def test_apply_uses_min_pedestrian_for_ped_phases():
    applier = MTCRestrictionApplier(
        constants=MTCConstants(min_green=5, min_pedestrian=12)
    )

    result = applier.apply(
        {"NS": 4.0, "PED": 4.0},
        has_pedestrian={"NS": False, "PED": True},
    )

    greens = {t.phase_id: t.green for t in result.timings}
    assert greens["NS"] == 5.0
    assert greens["PED"] == 12.0


def test_apply_caps_total_cycle_when_oversized():
    # Fuerce un total > max_cycle. Greens passthrough = 60 + 60 = 120;
    # add 5s lost time per phase × 2 = 10s → cycle = 130 > 120.
    applier = MTCRestrictionApplier(max_cycle=120.0)

    result = applier.apply({"NS": 60.0, "EW": 60.0})

    assert result.cycle_seconds <= 120.0 + 1e-6
    assert any("cycle_capped" in adj for adj in result.adjustments)


def test_apply_rejects_negative_green():
    applier = MTCRestrictionApplier()

    with pytest.raises(ValueError):
        applier.apply({"NS": -1.0})


def test_apply_rejects_empty_input():
    applier = MTCRestrictionApplier()

    with pytest.raises(ValueError):
        applier.apply({})
