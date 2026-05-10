import React from 'react';

interface SliderProps {
    label: string;
    hint?: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    value: number;
    onChange: (value: number) => void;
}

export const Slider = ({ label, hint, min, max, step, unit, value, onChange }: SliderProps) => {
    const display = Number.isInteger(step) ? value.toString() : value.toFixed(1);
    return (
        <div>
            <div className="flex items-baseline justify-between gap-2">
                <label className="text-[11px] uppercase tracking-wide text-slate-500">{label}</label>
                <span className="text-sm text-slate-100 font-mono tabular-nums">
                    {display} <span className="text-slate-500">{unit}</span>
                </span>
            </div>
            {hint && <p className="text-[10px] text-slate-600 mt-0.5">{hint}</p>}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full mt-1.5 accent-indigo-500 cursor-pointer"
            />
        </div>
    );
};
