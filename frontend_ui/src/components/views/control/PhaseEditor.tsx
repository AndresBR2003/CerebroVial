import React from 'react';
import { Plus, X, Footprints } from 'lucide-react';
import type { PhaseFlow } from '../../../services/controlService';

interface PhaseEditorProps {
    phases: PhaseFlow[];
    onChange: (phases: PhaseFlow[]) => void;
}

const numberInputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500';

const labelClass = 'text-[11px] uppercase tracking-wide text-slate-500';

export const PhaseEditor = ({ phases, onChange }: PhaseEditorProps) => {
    const updatePhase = (idx: number, patch: Partial<PhaseFlow>) => {
        onChange(phases.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    };

    const removePhase = (idx: number) => {
        if (phases.length <= 1) return;
        onChange(phases.filter((_, i) => i !== idx));
    };

    const addPhase = () => {
        const nextId = `phase_${phases.length + 1}`;
        onChange([
            ...phases,
            { phase_id: nextId, flow: 400, saturation_flow: 1800, queue: 0, has_pedestrian: false },
        ]);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className={labelClass}>Fases ({phases.length})</p>
                <button
                    type="button"
                    onClick={addPhase}
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                    <Plus size={14} /> Añadir fase
                </button>
            </div>

            {phases.map((phase, idx) => (
                <div
                    key={idx}
                    className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={phase.phase_id}
                            onChange={e => updatePhase(idx, { phase_id: e.target.value })}
                            className="bg-transparent text-indigo-300 font-mono text-sm focus:outline-none border-b border-transparent focus:border-indigo-500/50 px-1"
                            placeholder="phase_id"
                        />
                        <button
                            type="button"
                            onClick={() => removePhase(idx)}
                            disabled={phases.length <= 1}
                            className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Quitar fase"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className={labelClass}>Flow (veh/h)</label>
                            <input
                                type="number"
                                min={0}
                                step={50}
                                value={phase.flow}
                                onChange={e => updatePhase(idx, { flow: Number(e.target.value) })}
                                className={numberInputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Saturation</label>
                            <input
                                type="number"
                                min={1}
                                step={50}
                                value={phase.saturation_flow}
                                onChange={e => updatePhase(idx, { saturation_flow: Number(e.target.value) })}
                                className={numberInputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Queue</label>
                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={phase.queue ?? 0}
                                onChange={e => updatePhase(idx, { queue: Number(e.target.value) })}
                                className={numberInputClass}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none pt-1">
                        <input
                            type="checkbox"
                            checked={phase.has_pedestrian ?? false}
                            onChange={e => updatePhase(idx, { has_pedestrian: e.target.checked })}
                            className="accent-indigo-500"
                        />
                        <Footprints size={14} />
                        Movimiento peatonal
                    </label>
                </div>
            ))}
        </div>
    );
};
