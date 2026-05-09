import React from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Card } from '../../ui/Card';
import { ModeSelector } from './ModeSelector';
import type { ControlMetrics, RecommendationError, RecommendationStatus } from './RecommendationPanel';

interface Pedagogical422CardProps {
    status: RecommendationStatus;
    error: RecommendationError;
    metrics: ControlMetrics;
    onReset: () => void;
}

export const Pedagogical422Card = ({ status, error, metrics, onReset }: Pedagogical422CardProps) => (
    <Card className="h-full border-red-900 bg-slate-900/60 p-0 overflow-hidden">
        <div className="bg-red-950/50 border-b border-red-900 p-4">
            <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={22} />
                <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-red-200 font-semibold">Intersección saturada</h3>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded bg-red-500/20 text-red-200 border border-red-500/40 font-mono">
                                HTTP 422
                            </span>
                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wide rounded bg-red-500/10 text-red-300 border border-red-500/30 font-mono">
                                webster_infeasible
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Webster no puede asignar splits</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-2 break-words">{error.message}</p>
                </div>
            </div>
        </div>

        <div className="p-4 space-y-3">
            <ModeSelector status={status} data={null} error={error} />

            <p className="text-sm text-slate-300 leading-relaxed">
                La métrica <span className="font-mono text-slate-100">Y = Σ(q/s) = {metrics.Y.toFixed(3)}</span> excede el umbral <span className="font-mono">0.95</span>. La intersección está demasiado saturada para una solución estable.
            </p>

            <div>
                <p className="text-xs text-slate-400 mb-1">Soluciones posibles:</p>
                <ul className="text-sm text-slate-300 space-y-1">
                    <li className="flex gap-2"><span className="text-red-400">›</span> Reducir el flujo de las fases más cargadas</li>
                    <li className="flex gap-2"><span className="text-red-400">›</span> Aumentar la capacidad (más carriles, optimizar ancho)</li>
                    <li className="flex gap-2"><span className="text-red-400">›</span> Intervenir manualmente desde el operador</li>
                </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-900/60 rounded-lg p-3 border-t border-red-900/40">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">flow_total</p>
                    <p className="text-slate-100 font-mono font-semibold mt-0.5">{metrics.flowTotal.toFixed(0)} <span className="text-slate-500 text-xs font-normal">veh/h</span></p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">Y</p>
                    <p className="text-red-300 font-mono font-bold mt-0.5">{metrics.Y.toFixed(3)}</p>
                </div>
            </div>

            <div className="flex justify-end pt-1">
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
                >
                    <RotateCw size={14} /> Reintentar
                </button>
            </div>
        </div>
    </Card>
);
