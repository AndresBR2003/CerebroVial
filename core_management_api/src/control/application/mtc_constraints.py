"""
Compliance layer that enforces MTC (Ministerio de Transportes y Comunicaciones,
Peru) constraints on the timings produced by Webster or Max Pressure.

Defaults (parametrisable via ``MTCConstants``):
    MIN_GREEN       7 s
    MAX_GREEN       60 s
    MIN_YELLOW      3 s
    ALL_RED         2 s
    MIN_PEDESTRIAN  7 s

The applier:
1. Floors each phase's green to ``min_green`` (or ``min_pedestrian`` if the
   phase serves pedestrians).
2. Caps each phase's green at ``max_green``.
3. Adds the fixed ``yellow`` and ``all_red`` intervals.
4. If the resulting cycle exceeds ``max_cycle``, scales greens down
   proportionally and records a ``cycle_capped`` adjustment.
"""
from dataclasses import dataclass, field


@dataclass(frozen=True)
class MTCConstants:
    min_green: int = 7
    max_green: int = 60
    min_yellow: int = 3
    all_red: int = 2
    min_pedestrian: int = 7


@dataclass
class PhaseTiming:
    phase_id: str
    green: float
    yellow: float
    all_red: float


@dataclass
class ConstrainedCycle:
    timings: list[PhaseTiming]
    cycle_seconds: float
    adjustments: list[str] = field(default_factory=list)


class MTCRestrictionApplier:
    def __init__(
        self,
        constants: MTCConstants = MTCConstants(),
        max_cycle: float = 120.0,
    ) -> None:
        if max_cycle <= 0:
            raise ValueError("max_cycle must be > 0.")
        self.constants = constants
        self.max_cycle = max_cycle

    def apply(
        self,
        green_by_phase: dict[str, float],
        has_pedestrian: dict[str, bool] | None = None,
    ) -> ConstrainedCycle:
        if not green_by_phase:
            raise ValueError("green_by_phase must contain at least one phase.")

        c = self.constants
        ped = has_pedestrian or {}
        adjustments: list[str] = []
        clamped: dict[str, float] = {}

        for phase_id, green in green_by_phase.items():
            if green < 0:
                raise ValueError(f"green for phase {phase_id!r} must be >= 0.")

            min_required = c.min_pedestrian if ped.get(phase_id, False) else c.min_green
            adjusted = green

            if adjusted < min_required:
                adjustments.append(
                    f"phase {phase_id}: green raised from {green:.2f}s to {min_required}s (MTC floor)"
                )
                adjusted = float(min_required)

            if adjusted > c.max_green:
                adjustments.append(
                    f"phase {phase_id}: green truncated from {adjusted:.2f}s to {c.max_green}s (MTC ceiling)"
                )
                adjusted = float(c.max_green)

            clamped[phase_id] = adjusted

        per_phase_lost = c.min_yellow + c.all_red
        n_phases = len(clamped)
        sum_greens = sum(clamped.values())
        cycle_total = sum_greens + per_phase_lost * n_phases

        if cycle_total > self.max_cycle:
            available_green = max(0.0, self.max_cycle - per_phase_lost * n_phases)
            if sum_greens > 0:
                factor = available_green / sum_greens
                clamped = {p: g * factor for p, g in clamped.items()}
            adjustments.append(
                f"cycle_capped: total {cycle_total:.2f}s scaled to {self.max_cycle:.2f}s"
            )
            cycle_total = sum(clamped.values()) + per_phase_lost * n_phases

        timings = [
            PhaseTiming(
                phase_id=phase_id,
                green=clamped[phase_id],
                yellow=float(c.min_yellow),
                all_red=float(c.all_red),
            )
            for phase_id in green_by_phase
        ]

        return ConstrainedCycle(
            timings=timings,
            cycle_seconds=cycle_total,
            adjustments=adjustments,
        )
