import type { ControlMode, PhaseFlow } from '../../../services/controlService';

export type LightColor = 'red' | 'yellow' | 'green';

export type PlaybackSpeed = 1 | 2 | 4;

export interface PresetConfig {
    name: string;
    description: string;
    lostTime: number;
    phases: PhaseFlow[];
}

export const PRESETS: PresetConfig[] = [
    {
        name: 'Off-peak típico',
        description: 'Demanda baja, Webster óptimo',
        lostTime: 8,
        phases: [
            { phase_id: 'NS', flow: 750, saturation_flow: 1800, queue: 0, has_pedestrian: false },
            { phase_id: 'EW', flow: 600, saturation_flow: 1800, queue: 0, has_pedestrian: false },
        ],
    },
    {
        name: 'Peak normal',
        description: 'Peak con Webster como base de Max Pressure',
        lostTime: 8,
        phases: [
            { phase_id: 'NS', flow: 1100, saturation_flow: 3000, queue: 15, has_pedestrian: false },
            { phase_id: 'EW', flow: 700, saturation_flow: 3000, queue: 5, has_pedestrian: false },
        ],
    },
    {
        name: 'Peak saturado',
        description: 'Webster infeasible → MP fallback',
        lostTime: 8,
        phases: [
            { phase_id: 'NS', flow: 1100, saturation_flow: 1800, queue: 22, has_pedestrian: false },
            { phase_id: 'EW', flow: 900, saturation_flow: 1800, queue: 8, has_pedestrian: false },
        ],
    },
    {
        name: 'Webster infeasible',
        description: 'Off-peak con sub-saturación severa → 422',
        lostTime: 8,
        phases: [
            { phase_id: 'NS', flow: 600, saturation_flow: 800, queue: 0, has_pedestrian: false },
            { phase_id: 'EW', flow: 400, saturation_flow: 500, queue: 0, has_pedestrian: false },
        ],
    },
];

export const PHASE_SUBTITLES: Record<string, string> = {
    NS: 'Norte-Sur',
    EW: 'Este-Oeste',
};

export const MODE_LABEL: Record<ControlMode, string> = {
    webster: 'Webster (off-peak)',
    max_pressure: 'Max Pressure (peak)',
};
