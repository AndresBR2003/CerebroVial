"""
Test fixtures shared by the control module test suite.

The fixtures intentionally avoid importing ``src.main`` so the suite runs
without the heavy prediction/vision dependencies (torch, geoalchemy2, etc.).
A minimal FastAPI app is assembled with only the control router.
"""
from collections.abc import Callable

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.control.application.adaptive_engine import (
    AdaptiveEngine,
    IntersectionStateDC,
    PhaseFlowDC,
)
from src.control.application.max_pressure import MaxPressureController
from src.control.application.mtc_constraints import MTCRestrictionApplier
from src.control.application.webster import WebsterCalculator
from src.control.presentation.api.routes import init_engine, router as control_router


@pytest.fixture
def engine() -> AdaptiveEngine:
    return AdaptiveEngine(
        webster=WebsterCalculator(),
        max_pressure=MaxPressureController(),
        mtc=MTCRestrictionApplier(),
    )


@pytest.fixture
def app(engine: AdaptiveEngine) -> FastAPI:
    test_app = FastAPI()
    init_engine(engine)
    test_app.include_router(control_router)
    return test_app


@pytest.fixture
def client(app: FastAPI) -> TestClient:
    return TestClient(app)


@pytest.fixture
def build_state() -> Callable[..., IntersectionStateDC]:
    """Helper to assemble an IntersectionStateDC with two phases (NS, EW) and a target flow_total."""

    def _build(
        flow_total: float,
        *,
        intersection_id: str = "I-001",
        timestamp: str = "2026-05-09T10:00:00Z",
        saturation: float = 1800.0,
        queues: tuple[int, int] = (3, 2),
        lost_time: float = 8.0,
        ns_share: float = 0.55,
    ) -> IntersectionStateDC:
        ns_flow = flow_total * ns_share
        ew_flow = flow_total * (1.0 - ns_share)
        return IntersectionStateDC(
            intersection_id=intersection_id,
            timestamp=timestamp,
            lost_time=lost_time,
            phases=[
                PhaseFlowDC(
                    phase_id="NS",
                    flow=ns_flow,
                    saturation_flow=saturation,
                    queue=queues[0],
                ),
                PhaseFlowDC(
                    phase_id="EW",
                    flow=ew_flow,
                    saturation_flow=saturation,
                    queue=queues[1],
                ),
            ],
        )

    return _build


@pytest.fixture
def http_payload() -> Callable[..., dict]:
    """Helper to assemble the JSON payload accepted by POST /control/recommend."""

    def _payload(
        flow_total: float,
        *,
        saturation: float = 1800.0,
        queues: tuple[int, int] = (3, 2),
    ) -> dict:
        ns = flow_total * 0.55
        ew = flow_total - ns
        return {
            "intersection_id": "I-001",
            "timestamp": "2026-05-09T10:00:00Z",
            "lost_time": 8.0,
            "phases": [
                {
                    "phase_id": "NS",
                    "flow": ns,
                    "saturation_flow": saturation,
                    "queue": queues[0],
                },
                {
                    "phase_id": "EW",
                    "flow": ew,
                    "saturation_flow": saturation,
                    "queue": queues[1],
                },
            ],
        }

    return _payload
