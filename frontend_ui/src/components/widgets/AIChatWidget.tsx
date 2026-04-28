import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, MessageSquare, Send, Loader2 } from 'lucide-react';

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

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hola, soy el Asistente CerebroVial. ¿En qué puedo ayudarte a gestionar el tráfico de Miraflores hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        const systemContext = `Actúa como un asistente experto del Centro de Control de Tráfico de Miraflores (CerebroVial). 
    Tienes acceso a datos de sensores IoT, cámaras y modelos predictivos.
    Responde de forma concisa, técnica y profesional.
    Si te preguntan por el estado actual, asume que Larco tiene congestión crítica.
    Usuario dice: ${userMsg}`;

        const aiResponse = await callGeminiAPI(systemContext);

        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in transition-all">
                    {/* Header Chat */}
                    <div className="bg-indigo-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-white w-5 h-5" />
                            <h3 className="font-bold text-white">Asistente CerebroVial</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                    </div>

                    {/* Area Mensajes */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-3 rounded-xl rounded-bl-none flex gap-2 items-center">
                                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                    <span className="text-xs text-slate-400">Analizando datos...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Pregunta sobre el tráfico..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Botón Flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all transform hover:scale-105"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};
