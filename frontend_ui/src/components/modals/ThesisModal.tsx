import React from 'react';
import { FileText, X } from 'lucide-react';

export const ThesisModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 border-b border-indigo-500/30 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-indigo-400" /> Ficha del Proyecto de Tesis
                    </h2>
                    <p className="text-indigo-200 text-sm">UPC - Ingeniería de Sistemas</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="p-6 space-y-6 text-slate-300">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Autores</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Herrera Villacorta, Cesar Humberto</li>
                            <li>Briceño Rosas, Andres Alberto</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2 mt-4">Objetivo General</h3>
                        <p className="text-sm leading-relaxed">
                            Desarrollar un modelo predictivo de control semafórico adaptativo para reducir la congestión vehicular basado en redes neuronales, visión computacional e IoT en el distrito de Miraflores.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Stack Tecnológico (Factibilidad Técnica)</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-yellow-400 font-bold">IA Visión:</span> YOLOv8</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-blue-400 font-bold">IA Predicción:</span> PyTorch (LSTM/GRU)</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-green-400 font-bold">Backend:</span> FastAPI (Python)</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-cyan-400 font-bold">Frontend:</span> React + Grafana</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-purple-400 font-bold">Cloud:</span> Microsoft Azure</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-700"><span className="text-red-400 font-bold">Edge:</span> Raspberry Pi 4</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Indicadores de Éxito (KPIs)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-emerald-400">≥ 80%</div>
                            <div className="text-xs uppercase tracking-wider text-emerald-200">Precisión Modelo (Accuracy)</div>
                        </div>
                        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-400">95%</div>
                            <div className="text-xs uppercase tracking-wider text-blue-200">Avance Product Backlog</div>
                        </div>
                        <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-400">S/ 136k</div>
                            <div className="text-xs uppercase tracking-wider text-purple-200">Ahorro Anual Proyectado</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
