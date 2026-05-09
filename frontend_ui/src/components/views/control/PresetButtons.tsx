import React from 'react';
import { Sparkles } from 'lucide-react';
import { PRESETS, type PresetConfig } from './controlTypes';

interface PresetButtonsProps {
    activePresetName: string | null;
    onApply: (preset: PresetConfig) => void;
}

export const PresetButtons = ({ activePresetName, onApply }: PresetButtonsProps) => (
    <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map(preset => {
            const isActive = preset.name === activePresetName;
            const className = isActive
                ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-indigo-500 bg-indigo-500/15 text-indigo-200 transition-colors'
                : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500/60 hover:text-indigo-300 transition-colors';
            return (
                <button
                    key={preset.name}
                    type="button"
                    onClick={() => onApply(preset)}
                    title={preset.description}
                    className={className}
                >
                    <Sparkles size={12} />
                    {preset.name}
                </button>
            );
        })}
    </div>
);
