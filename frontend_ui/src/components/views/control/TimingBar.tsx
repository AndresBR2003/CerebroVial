import React from 'react';
import type { PhaseTimings } from '../../../services/controlService';

interface TimingBarProps {
    timing: PhaseTimings;
    cycleSeconds: number;
    isNext: boolean;
    subtitle: string;
}

export const TimingBar = ({ timing, cycleSeconds, isNext, subtitle }: TimingBarProps) => {
    const total = timing.green + timing.yellow + timing.all_red;
    const pct = (n: number) => (cycleSeconds > 0 ? (n / cycleSeconds) * 100 : 0);
    const remainder = Math.max(0, cycleSeconds - total);

    const containerClass = isNext
        ? 'mb-3 rounded-md p-2 border border-indigo-500/60 bg-indigo-500/5'
        : 'mb-3';

    return (
        <div className={containerClass}>
            <div className="flex items-baseline justify-between mb-1 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-300 font-semibold">{timing.phase_id}</span>
                    {subtitle && <span className="text-slate-400">· {subtitle}</span>}
                    {isNext && (
                        <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wide rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
                            próxima
                        </span>
                    )}
                </div>
                <span className="font-mono text-slate-300 tabular-nums">
                    <span className="text-emerald-300">{timing.green.toFixed(1)}s</span>
                    <span className="text-slate-600"> + </span>
                    <span className="text-amber-300">{timing.yellow.toFixed(1)}s</span>
                    <span className="text-slate-600"> + </span>
                    <span className="text-red-300">{timing.all_red.toFixed(1)}s</span>
                    <span className="text-slate-500"> = {total.toFixed(1)}s</span>
                </span>
            </div>
            <div className="flex h-3 rounded overflow-hidden bg-stone-700/30">
                <div className="bg-emerald-500 h-full" style={{ width: `${pct(timing.green)}%` }} />
                <div className="bg-amber-400 h-full" style={{ width: `${pct(timing.yellow)}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${pct(timing.all_red)}%` }} />
                {remainder > 0 && (
                    <div className="h-full" style={{ width: `${pct(remainder)}%` }} />
                )}
            </div>
        </div>
    );
};
