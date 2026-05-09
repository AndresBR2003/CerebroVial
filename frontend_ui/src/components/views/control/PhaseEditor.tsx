import React from 'react';
import { Plus, X, Footprints } from 'lucide-react';
import type { PhaseFlow } from '../../../services/controlService';
import { Slider } from './Slider';
import { PHASE_SUBTITLES } from './controlTypes';

interface PhaseEditorProps {
    phases: PhaseFlow[];
    onChange: (phases: PhaseFlow[]) => void;
}

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

            {phases.map((phase, idx) => {
                const subtitle = PHASE_SUBTITLES[phase.phase_id] ?? '';
                return (
                    <div
                        key={idx}
                        className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-3"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <input
                                    type="text"
                                    value={phase.phase_id}
                                    onChange={e => updatePhase(idx, { phase_id: e.target.value })}
                                    className="bg-transparent text-indigo-300 font-mono text-base font-semibold focus:outline-none border-b border-transparent focus:border-indigo-500/50 px-1 -ml-1 w-24"
                                    placeholder="phase_id"
                                />
                                {subtitle && (
                                    <p className="text-xs text-slate-400 mt-0.5 px-1">{subtitle}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removePhase(idx)}
                                disabled={phases.length <= 1}
                                className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed mt-1"
                                aria-label="Quitar fase"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <Slider
                            label="Demanda actual"
                            hint="autos por hora"
                            min={0}
                            max={2500}
                            step={50}
                            unit="veh/h"
                            value={phase.flow}
                            onChange={v => updatePhase(idx, { flow: v })}
                        />
                        <Slider
                            label="Capacidad máxima"
                            hint="autos por hora si tuviera verde permanente"
                            min={500}
                            max={3500}
                            step={100}
                            unit="veh/h"
                            value={phase.saturation_flow}
                            onChange={v => updatePhase(idx, { saturation_flow: v })}
                        />
                        <Slider
                            label="Cola actual"
                            hint="autos esperando ahora"
                            min={0}
                            max={40}
                            step={1}
                            unit="veh"
                            value={phase.queue ?? 0}
                            onChange={v => updatePhase(idx, { queue: v })}
                        />

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
                );
            })}
        </div>
    );
};
