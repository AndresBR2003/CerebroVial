import React, { useState, useEffect } from 'react';
import { Sparkles, X, Loader2, Copy } from 'lucide-react';

// --- CONFIGURACIÓN API GEMINI ---
// NOTA: En un entorno real, esta clave vendría de variables de entorno seguras.
const apiKey = "";

// Función helper para llamar a Gemini
const callGeminiAPI = async (prompt: string) => {
    if (!apiKey) return "Error: API Key no configurada.";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        if (!response.ok) throw new Error("Fallo en la respuesta de Gemini");

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar respuesta.";
    } catch (error) {
        console.error("Error llamando a Gemini:", error);
        return "Lo siento, hubo un error al conectar con el servicio de IA. Por favor intenta más tarde.";
    }
};

export const ReportModal = ({ alert, onClose }: { alert: any, onClose: () => void }) => {
    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateReport = async () => {
            const prompt = `Actúa como un sistema experto de gestión de tráfico. Genera un reporte de incidente formal y técnico para el siguiente evento detectado en Miraflores:
      - Tipo: ${alert.type}
      - Mensaje: ${alert.msg}
      - Hora detección: ${alert.time}
      - Detalles técnicos: ${alert.details}
      
      El reporte debe tener:
      1. Título del Incidente
      2. Resumen Ejecutivo
      3. Posibles Causas (basado en el tipo)
      4. Recomendaciones de Acción Inmediata
      
      Usa formato Markdown simple.`;

            const text = await callGeminiAPI(prompt);
            setReport(text);
            setLoading(false);
        };
        generateReport();
    }, [alert]);

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-indigo-400" /> Reporte Generado por IA
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 min-h-[300px] max-h-[60vh] overflow-y-auto text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p>Analizando incidente y redactando reporte...</p>
                        </div>
                    ) : (
                        report
                    )}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    <button onClick={() => { navigator.clipboard.writeText(report) }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                        <Copy size={16} /> Copiar
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
