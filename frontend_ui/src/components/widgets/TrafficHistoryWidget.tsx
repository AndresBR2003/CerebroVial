import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Area,
    ReferenceLine
} from 'recharts';

interface HistoricalDataPoint {
    timestamp: string;
    total_vehicles: number;
    congestion_level: string;
    is_prediction: boolean;
    type?: string;
    congestion_score?: number; // 0, 1, 2 for chart
    vehicles_real?: number | null;
    vehicles_pred?: number | null;
    congestion_real?: number | null;
    congestion_pred?: number | null;
}

interface HistoryResponse {
    camera_id: string;
    history: HistoricalDataPoint[];
    prediction?: {
        predicted_congestion_15min: string;
        predicted_congestion_30min: string;
        predicted_congestion_45min: string;
        predicted_vehicles_15min?: number;
        predicted_vehicles_30min?: number;
        predicted_vehicles_45min?: number;
    };
}

interface TrafficHistoryWidgetProps {
    cameraId: string;
}

const getCongestionScore = (level: string): number => {
    const l = (level || '').toLowerCase();
    if (l === 'high' || l === 'moderado') return 1;
    if (l === 'heavy' || l === 'alto') return 2;
    return 0; // Low/Normal
};

export const TrafficHistoryWidget: React.FC<TrafficHistoryWidgetProps> = ({ cameraId }) => {
    const [historyData, setHistoryData] = useState<HistoricalDataPoint[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [interval, setInterval] = useState<number>(5);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
                const response = await fetch(`http://localhost:8001/predictions/history/${cameraId}?interval=${interval}`);
                if (!response.ok) throw new Error('Failed to fetch history');

                const data: HistoryResponse = await response.json();

                if (!data.history || data.history.length === 0) {
                    setHistoryData([]);
                    return;
                }

                // Process history data
                const chartData: HistoricalDataPoint[] = data.history.map(h => ({
                    ...h,
                    type: 'real',
                    congestion_score: getCongestionScore(h.congestion_level)
                }));

                // Ensure we display "Now" clearly. 
                // We'll mark the last real point as "Now" for the reference line.
                // To achieve ~75% history vs 25% prediction (3 points), we need roughly 9 history points.
                // Let's keep the last 12 points of history to be safe and give a bit more context (80%).
                // If we want exactly 3/4 (75%), we need 9 real points vs 3 pred points (9/12 = 0.75).
                // Use all data from backend (now it's 30 mins aggregated)
                const slicedHistory = [...chartData];

                // Add prediction points
                if (data.prediction) {
                    const lastVal = slicedHistory[slicedHistory.length - 1]?.total_vehicles || 0;
                    const p = data.prediction as any;

                    // Use explicit values or fallback logic
                    const v15 = p.predicted_vehicles_15min ?? Math.max(0, lastVal + (p.predicted_congestion_15min === 'Heavy' ? 20 : -5));
                    const v30 = p.predicted_vehicles_30min ?? Math.max(0, v15 + (p.predicted_congestion_30min === 'Heavy' ? 20 : -5));
                    const v45 = p.predicted_vehicles_45min ?? Math.max(0, v30 + (p.predicted_congestion_45min === 'Heavy' ? 20 : -5));


                    slicedHistory.push({
                        timestamp: '+15',
                        total_vehicles: v15,
                        congestion_level: p.predicted_congestion_15min,
                        congestion_score: getCongestionScore(p.predicted_congestion_15min),
                        is_prediction: true,
                        type: 'pred'
                    });
                    slicedHistory.push({
                        timestamp: '+30',
                        total_vehicles: v30,
                        congestion_level: p.predicted_congestion_30min,
                        congestion_score: getCongestionScore(p.predicted_congestion_30min),
                        is_prediction: true,
                        type: 'pred'
                    });
                    slicedHistory.push({
                        timestamp: '+45',
                        total_vehicles: v45,
                        congestion_level: p.predicted_congestion_45min,
                        congestion_score: getCongestionScore(p.predicted_congestion_45min),
                        is_prediction: true,
                        type: 'pred'
                    });
                }

                // Process for Visual Continuity (Real vs Pred split)
                // We want the lines to connect, so the last "Real" point must also be the first "Pred" point visually.
                // Find the index of the last real point.
                let lastRealIndex = -1;

                // Find index of last non-prediction data point
                for (let i = slicedHistory.length - 1; i >= 0; i--) {
                    if (!slicedHistory[i].is_prediction) {
                        lastRealIndex = i;
                        break;
                    }
                }

                const processedData = slicedHistory.map((item, index) => {
                    const isReal = index <= lastRealIndex;
                    const isPred = index >= lastRealIndex; // Overlap at the split point for continuity

                    return {
                        ...item,
                        vehicles_real: isReal ? item.total_vehicles : null,
                        vehicles_pred: isPred ? item.total_vehicles : null,
                        congestion_real: isReal ? item.congestion_score : null,
                        congestion_pred: isPred ? item.congestion_score : null,
                    };
                });

                setHistoryData(processedData);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
        const intervalId = window.setInterval(fetchHistory, 60000);
        return () => window.clearInterval(intervalId);
    }, [cameraId, interval]);

    // Calculate index for "Now" line (last non-prediction point)
    // Avoid findLastIndex for compatibility
    let splitPoint = '';
    for (let i = historyData.length - 1; i >= 0; i--) {
        if (!historyData[i].is_prediction) {
            splitPoint = historyData[i].timestamp;
            break;
        }
    }

    return (
        <div className="w-full h-full p-6 bg-[#0A0A0A] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Historial y Predicción</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Intervalo:</span>
                    <select
                        value={interval}
                        onChange={(e) => setInterval(Number(e.target.value))}
                        className="bg-slate-800 text-white text-xs border border-slate-700 rounded px-2 py-1 outline-none focus:border-blue-500"
                    >
                        <option value={1}>1 min</option>
                        <option value={2}>2 min</option>
                        <option value={5}>5 min</option>
                        <option value={10}>10 min</option>
                        <option value={15}>15 min</option>
                    </select>
                </div>
            </div>
            <p className="text-gray-400 mb-6 text-sm">
                <span className="text-blue-400 font-bold">—— Vehículos</span> vs
                <span className="text-amber-400 font-bold ml-2">-- Congestión</span>
            </p>

            {loadingHistory ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">Cargando datos...</div>
            ) : (
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={historyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />

                            <XAxis
                                dataKey="timestamp"
                                stroke="#666"
                                tick={{ fill: '#666', fontSize: 12 }}
                            />

                            {/* Left Axis: Vehicles */}
                            <YAxis
                                yAxisId="left"
                                stroke="#3B82F6"
                                tick={{ fill: '#3B82F6', fontSize: 12 }}
                                label={{ value: 'Vehículos', angle: -90, position: 'insideLeft', fill: '#3B82F6' }}
                            />

                            {/* Right Axis: Congestion */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#F59E0B"
                                tick={{ fill: '#F59E0B', fontSize: 12 }}
                                ticks={[0, 1, 2]}
                                domain={[0, 2]}
                                tickFormatter={(val) => val === 0 ? 'Bajo' : val === 1 ? 'Medio' : 'Alto'}
                            />

                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#888' }}
                            />

                            {/* Vehicles Area - Real Data */}
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="vehicles_real"
                                stroke="#3B82F6"
                                fillOpacity={1}
                                fill="url(#colorReal)"
                                strokeWidth={3}
                                name="Vehículos (Histórico)"
                                connectNulls={true}
                            />

                            {/* Vehicles Area - Prediction Data */}
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="vehicles_pred"
                                stroke="#60A5FA"
                                strokeDasharray="5 5"
                                fillOpacity={0.3}
                                fill="url(#colorReal)"
                                strokeWidth={3}
                                name="Vehículos (Predicción)"
                                connectNulls={true}
                            />

                            {/* Congestion Line - Real Data */}
                            <Line
                                yAxisId="right"
                                type="stepAfter"
                                dataKey="congestion_real"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                dot={false}
                                name="Congestión (Histórico)"
                                connectNulls={true}
                            />

                            {/* Congestion Line - Prediction Data */}
                            <Line
                                yAxisId="right"
                                type="stepAfter"
                                dataKey="congestion_pred"
                                stroke="#FCD34D"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                dot={false}
                                name="Congestión (Predicción)"
                                connectNulls={true}
                            />

                            {/* Reference Line for "NOW" - Rendered last to be on top */}
                            {splitPoint && (
                                <ReferenceLine
                                    x={splitPoint}
                                    stroke="#fff"
                                    strokeDasharray="3 3"
                                    label={{ position: 'top', value: 'AHORA', fill: '#fff', fontSize: 10 }}
                                />
                            )}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
