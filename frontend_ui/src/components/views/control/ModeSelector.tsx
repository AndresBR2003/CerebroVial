import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import type { ControlRecommendation } from '../../../services/controlService';
import type { RecommendationError, RecommendationStatus } from './RecommendationPanel';

interface ModeSelectorProps {
    status: RecommendationStatus;
    data: ControlRecommendation | null;
    error: RecommendationError | null;
}

type PillState = 'active-success' | 'active-error' | 'muted';

interface Pill {
    title: string;
    subtitle: string;
    state: PillState;
}

const baseClass = 'flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors';

const stateClass: Record<PillState, string> = {
    'active-success': 'border-emerald-500 bg-emerald-500/10 text-emerald-200',
    'active-error': 'border-red-500 bg-red-500/10 text-red-200',
    muted: 'border-slate-800 bg-slate-900/40 text-slate-500',
};

export const ModeSelector = ({ status, data, error }: ModeSelectorProps) => {
    const websterActive = status === 'success' && data?.mode === 'webster';
    const mpActive = status === 'success' && data?.mode === 'max_pressure';
    const saturatedActive = status === 'error' && error?.kind === 'webster_infeasible';

    const pills: Pill[] = [
        {
            title: 'Webster',
            subtitle: 'off-peak',
            state: websterActive ? 'active-success' : 'muted',
        },
        {
            title: 'Max Pressure',
            subtitle: 'peak',
            state: mpActive ? 'active-success' : 'muted',
        },
        {
            title: 'Saturado',
            subtitle: '422',
            state: saturatedActive ? 'active-error' : 'muted',
        },
    ];

    const opacity = status === 'loading' ? 'opacity-50' : '';

    return (
        <div className={`flex gap-2 mb-4 ${opacity}`}>
            {pills.map(p => (
                <div key={p.title} className={`${baseClass} ${stateClass[p.state]}`}>
                    {p.state === 'active-success' && <Check size={14} />}
                    {p.state === 'active-error' && <AlertTriangle size={14} />}
                    <div className="flex flex-col items-center leading-tight">
                        <span>{p.title}</span>
                        <span className="text-[10px] font-normal opacity-70">{p.subtitle}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
