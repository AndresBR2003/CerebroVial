import React from 'react';
import { Loader2, AlertTriangle, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { Card } from '../../ui/Card';
import type { ControlRecommendation } from '../../../services/controlService';

export type RecommendationStatus = 'idle' | 'loading' | 'success' | 'error';

export type RecommendationErrorKind = 'webster_infeasible' | 'invalid_state' | 'generic';

export interface RecommendationError {
    kind: RecommendationErrorKind;
    message: string;
}

interface RecommendationPanelProps {
    status: RecommendationStatus;
    data: ControlRecommendation | null;
    error: RecommendationError | null;
    onRetry: () => void;
}

const modeLabel: Record<ControlRecommendation['mode'], string> = {
    webster: 'Webster (off-peak)',
    max_pressure: 'Max Pressure (peak)',
};

export const RecommendationPanel = ({ status, data, error, onRetry }: RecommendationPanelProps) => {
    if (status === 'idle') {
        return (
            <Card className="h-full flex items-center justify-center text-slate-500 text-sm">
                Configurá la intersección y pulsá <span className="mx-1 font-semibold text-indigo-400">Recomendar</span> para obtener el plan de tiempos.
            </Card>
        );
    }

    if (status === 'loading') {
        return (
            <Card className="h-full flex items-center justify-center gap-3 text-slate-300">
                <Loader2 size={20} className="animate-spin text-indigo-400" />
                <span>Calculando recomendación…</span>
            </Card>
        );
    }

    if (status === 'error' && error) {
        if (error.kind === 'webster_infeasible') {
            return (
                <Card className="h-full border-red-500/60 bg-red-950/30">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={22} />
                        <div className="flex-1">
                            <h3 className="text-red-300 font-semibold mb-2">Intersección sobre-saturada</h3>
                            <p className="text-sm text-slate-300 mb-3">{error.message}</p>
                            <p className="text-xs text-slate-400 mb-2">
                                Webster requiere <code className="text-red-300">Y = Σ(flow / saturation_flow) &lt; 0.95</code>.
                                Cuando el índice de saturación supera ese umbral, no existe un ciclo finito que evite cola creciente.
                            </p>
                            <p className="text-xs text-slate-400 mb-4">
                                Sugerencias: reducir <span className="text-slate-200">flow</span> de la fase crítica, o aumentar
                                <span className="text-slate-200"> saturation_flow</span> (ej. agregar carril o mejorar geometría).
                            </p>
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <RotateCw size={14} /> Reintentar
                            </button>
                        </div>
                    </div>
                </Card>
            );
        }

        if (error.kind === 'invalid_state') {
            return (
                <Card className="h-full border-amber-500/60 bg-amber-950/30">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={22} />
                        <div className="flex-1">
                            <h3 className="text-amber-300 font-semibold mb-2">Estado inválido</h3>
                            <p className="text-sm text-slate-300 mb-3">{error.message}</p>
                            <p className="text-xs text-slate-400">Revisá los valores de <span className="text-slate-200">flow</span>, <span className="text-slate-200">saturation_flow</span> y <span className="text-slate-200">timestamp</span>.</p>
                        </div>
                    </div>
                </Card>
            );
        }

        return (
            <Card className="h-full border-red-500/60 bg-red-950/20">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={22} />
                    <div className="flex-1">
                        <h3 className="text-red-300 font-semibold mb-2">Servicio no disponible</h3>
                        <p className="text-sm text-slate-300 mb-3">{error.message}</p>
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <RotateCw size={14} /> Reintentar
                        </button>
                    </div>
                </div>
            </Card>
        );
    }

    if (status === 'success' && data) {
        return (
            <Card className="h-full">
                <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={22} />
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">Recomendación generada</h3>
                        <p className="text-xs text-slate-400">Intersección <span className="text-slate-200 font-mono">{data.intersection_id}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/60 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Modo</p>
                        <p className="text-indigo-300 font-semibold mt-1">{modeLabel[data.mode]}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Ciclo</p>
                        <p className="text-emerald-300 font-semibold mt-1 font-mono">{data.cycle_seconds.toFixed(1)} s</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Tiempos por fase</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500 text-xs">
                                <th className="font-medium pb-1">Fase</th>
                                <th className="font-medium pb-1 text-right">Verde</th>
                                <th className="font-medium pb-1 text-right">Ámbar</th>
                                <th className="font-medium pb-1 text-right">Rojo total</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-slate-200">
                            {data.phase_timings.map(t => (
                                <tr key={t.phase_id} className="border-t border-slate-800">
                                    <td className="py-1.5">{t.phase_id}</td>
                                    <td className="py-1.5 text-right text-emerald-300">{t.green.toFixed(1)}s</td>
                                    <td className="py-1.5 text-right text-amber-300">{t.yellow.toFixed(1)}s</td>
                                    <td className="py-1.5 text-right text-red-300">{t.all_red.toFixed(1)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data.next_phase && (
                    <div className="mb-4 text-sm">
                        <span className="text-slate-500">Próxima fase: </span>
                        <span className="font-mono text-indigo-300">{data.next_phase}</span>
                    </div>
                )}

                <div className="mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Razonamiento</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{data.reasoning}</p>
                </div>

                {data.adjustments.length > 0 && (
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Ajustes MTC aplicados</p>
                        <ul className="text-sm text-slate-300 list-disc list-inside space-y-0.5">
                            {data.adjustments.map((adj, i) => (
                                <li key={i}>{adj}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>
        );
    }

    return null;
};
