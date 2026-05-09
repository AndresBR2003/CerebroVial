import React, { useCallback, useState } from 'react';
import { Play } from 'lucide-react';
import { Card } from '../../ui/Card';
import { PhaseEditor } from './PhaseEditor';
import {
    RecommendationPanel,
    type RecommendationError,
    type RecommendationStatus,
} from './RecommendationPanel';
import {
    controlService,
    parseControlError,
    type ControlRecommendation,
    type IntersectionState,
    type PhaseFlow,
} from '../../../services/controlService';

const initialPhases: PhaseFlow[] = [
    { phase_id: 'phase_1', flow: 600, saturation_flow: 1800, queue: 5, has_pedestrian: true },
    { phase_id: 'phase_2', flow: 400, saturation_flow: 1800, queue: 3, has_pedestrian: false },
];

interface UseRecommendControlState {
    status: RecommendationStatus;
    data: ControlRecommendation | null;
    error: RecommendationError | null;
    mutate: (state: IntersectionState) => Promise<void>;
    reset: () => void;
}

function useRecommendControl(): UseRecommendControlState {
    const [status, setStatus] = useState<RecommendationStatus>('idle');
    const [data, setData] = useState<ControlRecommendation | null>(null);
    const [error, setError] = useState<RecommendationError | null>(null);

    const mutate = useCallback(async (state: IntersectionState) => {
        setStatus('loading');
        setError(null);
        try {
            const res = await controlService.recommend(state);
            setData(res.data);
            setStatus('success');
        } catch (err) {
            const detail = parseControlError(err);
            if (detail?.code === 'webster_infeasible') {
                setError({ kind: 'webster_infeasible', message: detail.message });
            } else if (detail?.code === 'invalid_state') {
                setError({ kind: 'invalid_state', message: detail.message });
            } else {
                setError({
                    kind: 'generic',
                    message: 'No se pudo obtener la recomendación. Verificá que el backend esté disponible.',
                });
            }
            setStatus('error');
        }
    }, []);

    const reset = useCallback(() => {
        setStatus('idle');
        setData(null);
        setError(null);
    }, []);

    return { status, data, error, mutate, reset };
}

const formIsValid = (intersectionId: string, phases: PhaseFlow[]): boolean => {
    if (intersectionId.trim().length === 0) return false;
    if (phases.length === 0) return false;
    return phases.every(
        p =>
            p.phase_id.trim().length > 0 &&
            p.flow >= 0 &&
            Number.isFinite(p.flow) &&
            p.saturation_flow > 0 &&
            Number.isFinite(p.saturation_flow),
    );
};

export const ControlView = () => {
    const [intersectionId, setIntersectionId] = useState('INT_001');
    const [lostTime, setLostTime] = useState(8);
    const [phases, setPhases] = useState<PhaseFlow[]>(initialPhases);
    const { status, data, error, mutate } = useRecommendControl();

    const submit = () => {
        if (!formIsValid(intersectionId, phases)) return;
        const state: IntersectionState = {
            intersection_id: intersectionId.trim(),
            timestamp: new Date().toISOString(),
            phases: phases.map(p => ({
                phase_id: p.phase_id.trim(),
                flow: p.flow,
                saturation_flow: p.saturation_flow,
                queue: p.queue ?? 0,
                has_pedestrian: p.has_pedestrian ?? false,
            })),
            lost_time: lostTime,
        };
        void mutate(state);
    };

    const lastSubmittedState: IntersectionState | null =
        status === 'success' || status === 'error'
            ? {
                  intersection_id: intersectionId,
                  timestamp: new Date().toISOString(),
                  phases,
                  lost_time: lostTime,
              }
            : null;

    const retry = () => {
        if (lastSubmittedState) submit();
    };

    const canSubmit = formIsValid(intersectionId, phases) && status !== 'loading';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-white font-semibold text-lg mb-1">Estado de la intersección</h2>
                <p className="text-xs text-slate-500 mb-4">
                    Define la demanda actual y los flujos de saturación. El motor decide entre Webster (off-peak) y
                    Max Pressure (peak) automáticamente.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="text-[11px] uppercase tracking-wide text-slate-500">
                            Intersection ID
                        </label>
                        <input
                            type="text"
                            value={intersectionId}
                            onChange={e => setIntersectionId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                            placeholder="INT_001"
                        />
                    </div>
                    <div>
                        <label className="text-[11px] uppercase tracking-wide text-slate-500">
                            Lost time (s)
                        </label>
                        <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={lostTime}
                            onChange={e => setLostTime(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <PhaseEditor phases={phases} onChange={setPhases} />

                <button
                    type="button"
                    onClick={submit}
                    disabled={!canSubmit}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                    <Play size={16} />
                    {status === 'loading' ? 'Calculando…' : 'Recomendar'}
                </button>
            </Card>

            <RecommendationPanel status={status} data={data} error={error} onRetry={retry} />
        </div>
    );
};
