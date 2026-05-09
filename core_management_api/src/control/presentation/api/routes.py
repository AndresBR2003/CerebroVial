"""
HTTP boundary for the adaptive control engine.

The Pydantic schemas live in this folder; conversion to/from the engine's
internal dataclasses happens here so that ``application/`` stays free of
FastAPI imports.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from ...application.adaptive_engine import (
    AdaptiveEngine,
    IntersectionStateDC,
    PhaseFlowDC,
    RecommendationDC,
)
from ...application.webster import WebsterInfeasible
from .schemas import (
    ControlRecommendation,
    ErrorDetail,
    IntersectionState,
    PhaseTimings,
    RecommendResponse,
)

router = APIRouter(prefix="/control", tags=["control"])

_engine_instance: Optional[AdaptiveEngine] = None


def get_engine() -> AdaptiveEngine:
    if _engine_instance is None:
        raise HTTPException(status_code=503, detail="Control engine not initialized")
    return _engine_instance


def init_engine(engine: AdaptiveEngine) -> None:
    global _engine_instance
    _engine_instance = engine


def _to_dataclass(state: IntersectionState) -> IntersectionStateDC:
    return IntersectionStateDC(
        intersection_id=state.intersection_id,
        timestamp=state.timestamp,
        lost_time=state.lost_time,
        phases=[
            PhaseFlowDC(
                phase_id=p.phase_id,
                flow=p.flow,
                saturation_flow=p.saturation_flow,
                queue=p.queue,
                has_pedestrian=p.has_pedestrian,
            )
            for p in state.phases
        ],
    )


def _to_pydantic(rec: RecommendationDC) -> ControlRecommendation:
    return ControlRecommendation(
        intersection_id=rec.intersection_id,
        mode=rec.mode,
        cycle_seconds=rec.cycle_seconds,
        phase_timings=[
            PhaseTimings(
                phase_id=t.phase_id,
                green=t.green,
                yellow=t.yellow,
                all_red=t.all_red,
            )
            for t in rec.phase_timings
        ],
        next_phase=rec.next_phase,
        reasoning=rec.reasoning,
        adjustments=rec.adjustments,
    )


@router.post("/recommend", response_model=RecommendResponse)
def recommend(
    state: IntersectionState,
    engine: AdaptiveEngine = Depends(get_engine),
) -> RecommendResponse:
    try:
        recommendation = engine.recommend(_to_dataclass(state))
    except WebsterInfeasible as exc:
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(code="webster_infeasible", message=str(exc)).model_dump(),
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=ErrorDetail(code="invalid_state", message=str(exc)).model_dump(),
        )

    return RecommendResponse(data=_to_pydantic(recommendation))
