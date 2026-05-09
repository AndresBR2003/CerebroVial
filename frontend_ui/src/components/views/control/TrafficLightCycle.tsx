import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import type { ControlRecommendation, PhaseTimings } from '../../../services/controlService';
import type { LightColor, PlaybackSpeed } from './controlTypes';
import { PHASE_SUBTITLES } from './controlTypes';
import type { RecommendationError, RecommendationStatus } from './RecommendationPanel';

interface TrafficLightCycleProps {
    status: RecommendationStatus;
    data: ControlRecommendation | null;
    error: RecommendationError | null;
}

interface PhaseSegment {
    phaseIdx: number;
    greenStart: number;
    yellowStart: number;
    allRedStart: number;
    allRedEnd: number;
}

function buildOrderedTimings(
    timings: PhaseTimings[],
    nextPhase?: string | null,
): PhaseTimings[] {
    if (!nextPhase) return timings;
    const i = timings.findIndex(t => t.phase_id === nextPhase);
    return i > 0 ? [...timings.slice(i), ...timings.slice(0, i)] : timings;
}

function buildSegments(ordered: PhaseTimings[]): PhaseSegment[] {
    const out: PhaseSegment[] = [];
    let cursor = 0;
    ordered.forEach((t, idx) => {
        const greenStart = cursor;
        const yellowStart = greenStart + t.green;
        const allRedStart = yellowStart + t.yellow;
        const allRedEnd = allRedStart + t.all_red;
        out.push({ phaseIdx: idx, greenStart, yellowStart, allRedStart, allRedEnd });
        cursor = allRedEnd;
    });
    return out;
}

function getPhaseLightAt(
    queriedIdx: number,
    second: number,
    segments: PhaseSegment[],
): LightColor {
    const active = segments.find(s => second >= s.greenStart && second < s.allRedEnd);
    if (!active) return 'red';
    if (active.phaseIdx !== queriedIdx) return 'red';
    if (second < active.yellowStart) return 'green';
    if (second < active.allRedStart) return 'yellow';
    return 'red';
}

const glowByColor: Record<LightColor, string> = {
    green: 'bg-emerald-500 shadow-lg shadow-emerald-500/60',
    yellow: 'bg-amber-400 shadow-lg shadow-amber-400/60',
    red: 'bg-red-500 shadow-lg shadow-red-500/60',
};

const dimByColor: Record<LightColor, string> = {
    green: 'bg-emerald-500/15',
    yellow: 'bg-amber-400/15',
    red: 'bg-red-500/15',
};

interface MiniLightProps {
    active: LightColor;
    color: LightColor;
}

const MiniLight = ({ active, color }: MiniLightProps) => {
    const isOn = active === color;
    const cls = isOn ? glowByColor[color] : dimByColor[color];
    return <div className={`w-6 h-6 rounded-full ${cls} transition-colors`} />;
};

interface PhaseSemaphoreProps {
    phaseId: string;
    subtitle: string;
    active: LightColor;
}

const PhaseSemaphore = ({ phaseId, subtitle, active }: PhaseSemaphoreProps) => (
    <div className="flex flex-col items-center gap-2">
        <div className="text-center">
            <p className="font-mono text-xs text-indigo-300 font-semibold">{phaseId}</p>
            {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex flex-col gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-2">
            <MiniLight active={active} color="red" />
            <MiniLight active={active} color="yellow" />
            <MiniLight active={active} color="green" />
        </div>
    </div>
);

const SPEEDS: PlaybackSpeed[] = [1, 2, 4];

export const TrafficLightCycle = ({ status, data, error }: TrafficLightCycleProps) => {
    const [currentSecond, setCurrentSecond] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState<PlaybackSpeed>(1);
    const [prevData, setPrevData] = useState<ControlRecommendation | null>(data);

    if (data !== prevData) {
        setPrevData(data);
        setCurrentSecond(0);
        setIsPlaying(false);
    }

    const ordered = useMemo(
        () => buildOrderedTimings(data?.phase_timings ?? [], data?.next_phase),
        [data],
    );
    const segments = useMemo(() => buildSegments(ordered), [ordered]);

    useEffect(() => {
        if (!isPlaying || !data) return;
        const id = setInterval(() => {
            setCurrentSecond(prev => {
                const next = prev + 0.1 * speed;
                return next >= data.cycle_seconds ? 0 : next;
            });
        }, 100);
        return () => clearInterval(id);
    }, [isPlaying, speed, data]);

    const isInfeasible = status === 'error' && error?.kind === 'webster_infeasible';
    const isLoading = status === 'loading';
    const canPlay = status === 'success' && !!data;

    let helperText: string | null = null;
    if (isInfeasible) helperText = 'Sin recomendación — operador debe intervenir manualmente';
    else if (status === 'idle') helperText = 'Configure la intersección y pulse Recomendar para visualizar el ciclo';

    const renderPhases = canPlay ? ordered : (data?.phase_timings ?? []);
    const fallbackColor: LightColor = isInfeasible ? 'red' : 'red';

    const containerClass = isLoading ? 'animate-pulse' : '';
    const progressPct = data && data.cycle_seconds > 0 ? (currentSecond / data.cycle_seconds) * 100 : 0;

    return (
        <div className={`bg-slate-900/40 border border-slate-800 rounded-lg p-4 mb-4 ${containerClass}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Ciclo del semáforo</p>

            {renderPhases.length > 0 ? (
                <div className="flex items-start justify-center gap-6 mb-3">
                    {renderPhases.map((t, idx) => {
                        const active: LightColor = canPlay
                            ? getPhaseLightAt(idx, currentSecond, segments)
                            : isInfeasible
                                ? fallbackColor
                                : 'red';
                        const dim = !canPlay && !isInfeasible;
                        return (
                            <div key={t.phase_id} className={dim ? 'opacity-40' : ''}>
                                <PhaseSemaphore
                                    phaseId={t.phase_id}
                                    subtitle={PHASE_SUBTITLES[t.phase_id] ?? ''}
                                    active={active}
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center gap-6 mb-3 opacity-40">
                    <PhaseSemaphore phaseId="—" subtitle="" active="red" />
                    <PhaseSemaphore phaseId="—" subtitle="" active="red" />
                </div>
            )}

            {helperText && (
                <p className="text-xs text-center text-slate-400 mb-3">{helperText}</p>
            )}

            {canPlay && data && (
                <>
                    <div className="mb-2">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-[width] duration-100 ease-linear"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 mt-1 text-right tabular-nums">
                            {currentSecond.toFixed(1)} / {data.cycle_seconds.toFixed(1)} s
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPlaying(p => !p)}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                        >
                            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                            {isPlaying ? 'Pausa' : 'Play'}
                        </button>

                        <div className="flex items-center gap-1">
                            {SPEEDS.map(s => {
                                const active = s === speed;
                                const cls = active
                                    ? 'px-2 py-1 text-xs rounded bg-indigo-600 text-white'
                                    : 'px-2 py-1 text-xs rounded bg-slate-800 text-slate-400 hover:text-slate-200';
                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSpeed(s)}
                                        className={cls}
                                    >
                                        {s}×
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
