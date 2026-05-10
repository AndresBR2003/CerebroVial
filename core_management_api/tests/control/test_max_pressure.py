import math

import pytest

from src.control.application.max_pressure import (
    MaxPressureController,
    MaxPressureDecision,
)


def test_decide_picks_phase_with_largest_pressure():
    controller = MaxPressureController()

    decision = controller.decide(
        queues={"NS": 2, "EW": 12},
        saturations={"NS": 1800, "EW": 1800},
        lost_time=8.0,
    )

    assert isinstance(decision, MaxPressureDecision)
    assert decision.next_phase == "EW"
    assert decision.cycle_seconds == controller.default_cycle
    assert decision.green_by_phase["EW"] > decision.green_by_phase["NS"]
    assert math.isclose(
        sum(decision.green_by_phase.values()),
        decision.cycle_seconds - 8.0,
        rel_tol=1e-9,
    )


def test_decide_falls_back_to_round_robin_when_queues_empty():
    controller = MaxPressureController()

    decision = controller.decide(
        queues={"WE": 0, "NS": 0, "AB": 0},
        saturations={"WE": 1800, "NS": 1800, "AB": 1800},
        lost_time=4.0,
    )

    # Alphabetical: AB < NS < WE → fallback selects "AB".
    assert decision.next_phase == "AB"
    # Greens are evenly shared.
    expected = (decision.cycle_seconds - 4.0) / 3
    for green in decision.green_by_phase.values():
        assert math.isclose(green, expected, rel_tol=1e-9)


def test_decide_breaks_pressure_ties_alphabetically():
    controller = MaxPressureController()

    decision = controller.decide(
        queues={"BB": 10, "AA": 10},
        saturations={"BB": 1800, "AA": 1800},
        lost_time=4.0,
    )

    assert decision.next_phase == "AA"


def test_decide_honours_custom_cycle():
    controller = MaxPressureController()

    decision = controller.decide(
        queues={"NS": 5, "EW": 3},
        saturations={"NS": 1800, "EW": 1800},
        lost_time=8.0,
        cycle_seconds=90.0,
    )

    assert decision.cycle_seconds == 90.0
    assert math.isclose(
        sum(decision.green_by_phase.values()),
        82.0,
        rel_tol=1e-9,
    )


def test_decide_rejects_mismatched_phase_ids():
    controller = MaxPressureController()

    with pytest.raises(ValueError):
        controller.decide(
            queues={"NS": 1},
            saturations={"EW": 1800},
            lost_time=4.0,
        )
