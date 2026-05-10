"""
Max Pressure controller (Varaiya, 2013) for over-saturated intersections.

Reference: Varaiya, P. (2013). "Max pressure control of a network of signalized
intersections". Transportation Research Part C, 36, 177-195.

Simplified pressure for SP3 (no downstream link state available yet):
    P(φ) = saturation_flow_φ · queue_φ

The controller selects the next active phase as argmax(P). Greens are split
proportionally to pressure across the cycle minus the lost time. When all
queues are empty, the controller falls back to a deterministic round-robin
(alphabetical order of phase_id) to keep the system live.
"""
from dataclasses import dataclass


@dataclass
class MaxPressureDecision:
    next_phase: str
    cycle_seconds: float
    green_by_phase: dict[str, float]


class MaxPressureController:
    def __init__(self, default_cycle: float = 60.0) -> None:
        if default_cycle <= 0:
            raise ValueError("default_cycle must be > 0.")
        self.default_cycle = default_cycle

    def decide(
        self,
        queues: dict[str, int],
        saturations: dict[str, float],
        lost_time: float,
        cycle_seconds: float | None = None,
    ) -> MaxPressureDecision:
        if not queues:
            raise ValueError("queues must contain at least one phase.")
        if set(queues) != set(saturations):
            raise ValueError("queues and saturations must share the same phase ids.")
        if lost_time < 0:
            raise ValueError("lost_time must be non-negative.")

        cycle = float(cycle_seconds) if cycle_seconds is not None else self.default_cycle
        usable_green = max(0.0, cycle - lost_time)

        pressures: dict[str, float] = {}
        for phase_id, q in queues.items():
            s = saturations[phase_id]
            if s <= 0:
                raise ValueError(f"saturation_flow for phase {phase_id!r} must be > 0.")
            if q < 0:
                raise ValueError(f"queue for phase {phase_id!r} must be >= 0.")
            pressures[phase_id] = s * q

        total_pressure = sum(pressures.values())

        ordered = sorted(queues)

        if total_pressure == 0.0:
            # Round-robin fallback: deterministic alphabetical order.
            next_phase = ordered[0]
            share = usable_green / len(ordered)
            green_by_phase = {p: share for p in ordered}
        else:
            # Iterate alphabetically so that ties in pressure resolve to the
            # smaller phase_id (max() returns the first key when values tie).
            next_phase = max(ordered, key=lambda p: pressures[p])
            green_by_phase = {
                p: usable_green * (pressure / total_pressure)
                for p, pressure in pressures.items()
            }

        return MaxPressureDecision(
            next_phase=next_phase,
            cycle_seconds=cycle,
            green_by_phase=green_by_phase,
        )
