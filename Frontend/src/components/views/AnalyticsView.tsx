import React from 'react';
import { TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '../ui/Card';

// --- DATOS MOCK ---
const trafficData = [
    { time: '08:00', real: 65, prediccion: 62 },
    { time: '09:00', real: 85, prediccion: 88 },
    { time: '10:00', real: 70, prediccion: 72 },
    { time: '11:00', real: 60, prediccion: 58 },
    { time: '12:00', real: 75, prediccion: 70 },
    { time: '13:00', real: 90, prediccion: 85 },
    { time: '14:00', real: 80, prediccion: 82 },
];

export const AnalyticsView = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Evaluación del Modelo Predictivo</h2>
                <div className="flex gap-2">
                    <button className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-sm hover:bg-slate-700">Exportar Reporte (PDF)</button>
                    <select className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-sm outline-none border border-slate-700">
                        <option>Últimas 24 Horas</option>
                        <option>Última Semana</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 h-[400px] flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-400 mb-4">Congestión Real vs Predicción (Red Neuronal GRU)</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Area type="monotone" dataKey="real" stroke="#4f46e5" fillOpacity={1} fill="url(#colorReal)" name="Flujo Real" />
                                <Area type="monotone" dataKey="prediccion" stroke="#10b981" fillOpacity={1} fill="url(#colorPred)" name="Predicción IA" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Precisión del Modelo (Accuracy)</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-bold text-emerald-400">81.3%</span>
                            <span className="text-sm text-emerald-500 mb-1 flex items-center"><TrendingUp size={14} /> +2.1%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[81%]"></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Objetivo del Proyecto: &ge; 80%</p>
                    </Card>

                    <Card>
                        <h3 className="text-sm font-semibold text-slate-400 mb-4">Impacto Económico (Proyección)</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Ahorro en Combustible</span>
                                <span className="text-white font-bold">S/ 12,400</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Reducción Horas Hombre</span>
                                <span className="text-white font-bold">S/ 45,200</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                                <span className="text-sm text-indigo-300">Total Mensual Estimado</span>
                                <span className="text-indigo-400 font-bold text-lg">S/ 57,600</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Card>
                <h3 className="text-sm font-semibold text-slate-400 mb-4">Comparativa Antes vs Después</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900 rounded-lg text-center border border-slate-800">
                        <p className="text-xs text-slate-500">Tiempo de Viaje (10km)</p>
                        <p className="text-xl font-bold text-white mt-1">28m 30s <span className="text-slate-600">vs</span> <span className="text-emerald-400">24m 10s</span></p>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg text-center border border-slate-800">
                        <p className="text-xs text-slate-500">Velocidad Media</p>
                        <p className="text-xl font-bold text-white mt-1">17 km/h <span className="text-slate-600">vs</span> <span className="text-emerald-400">22 km/h</span></p>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg text-center border border-slate-800">
                        <p className="text-xs text-slate-500">Emisiones CO2</p>
                        <p className="text-xl font-bold text-white mt-1">-12% <span className="text-xs text-slate-500 font-normal">reducción estimada</span></p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
