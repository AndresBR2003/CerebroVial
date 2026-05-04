import React, { useState } from 'react';
import { Car, TrendingDown, Activity, ShieldCheck, Video, AlertTriangle, Filter, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map movement
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.flyTo(center, zoom);
    return null;
}

export const DashboardView = ({ onSelectCamera }: { onSelectCamera: (id: string) => void }) => {
    // Datos simulados de intersecciones con coordenadas reales de Miraflores
    const intersections = [
        { id: 'CAM_001', name: 'Av. Larco / Av. Benavides', speed: 45, flow: 120, status: 'moderate', prediction: 'Estable', lat: -12.126, lng: -77.028 },
        { id: 'CAM_002', name: 'Av. Pardo / Av. Espinar', speed: 28, flow: 180, status: 'critical', prediction: 'Congestión', lat: -12.119, lng: -77.035 },
        { id: 'CAM_003', name: 'Av. Arequipa / Av. Angamos', speed: 55, flow: 90, status: 'fluid', prediction: 'Fluido', lat: -12.112, lng: -77.031 },
        { id: 'CAM_004', name: 'Ovalo Gutiérrez', speed: 32, flow: 150, status: 'moderate', prediction: 'Lento', lat: -12.114, lng: -77.042 },
    ];

    const [mapCenter, setMapCenter] = useState<[number, number]>([-12.122, -77.028]);
    const [mapZoom, setMapZoom] = useState(14);
    const [viewMode, setViewMode] = useState<'leaflet' | 'waze'>('leaflet');

    // Reset state on mount to ensure fresh start
    React.useEffect(() => {
        return () => {
            setViewMode('leaflet');
        };
    }, []);

    const handleCameraSelect = (id: string) => {
        const camera = intersections.find(c => c.id === id);
        if (camera) {
            setMapCenter([camera.lat, camera.lng]);
            setMapZoom(16);
            if (viewMode === 'waze') setViewMode('leaflet'); // Switch to leaflet to show specific camera
            onSelectCamera(id);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Centro de Control de Tráfico</h1>
                    <p className="text-slate-400">Monitoreo en tiempo real y gestión de incidentes</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                        <Filter size={18} />
                        Filtros
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                        <Download size={18} />
                        Exportar Reporte
                    </button>
                </div>
            </div>

            {/* FILA DE KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 border-indigo-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg"><Car className="text-indigo-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">1,245</h3>
                    <p className="text-sm text-slate-400">Vehículos detectados (Hora)</p>
                </Card>

                <Card className="bg-gradient-to-br from-rose-900/40 to-slate-800/40 border-rose-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-rose-500/20 rounded-lg"><TrendingDown className="text-rose-400" size={20} /></div>
                        <span className="text-xs text-slate-400 font-mono">KPI-02</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">22 km/h</h3>
                    <p className="text-sm text-slate-400">Velocidad Promedio (Red)</p>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-500/20 rounded-lg"><Activity className="text-amber-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">ALTA</h3>
                    <p className="text-sm text-slate-400">Predicción Congestión (15m)</p>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-800/40 border-emerald-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><ShieldCheck className="text-emerald-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">34/34</h3>
                    <p className="text-sm text-slate-400">Semáforos Conectados</p>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6 h-[600px]">
                {/* Map Section */}
                <div className="col-span-8 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative shadow-2xl flex flex-col">
                    {/* Map Header / Toggle */}
                    <div className="absolute top-4 left-4 z-[400] flex gap-2">
                        <div className="bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full border border-slate-700 text-xs text-white font-medium shadow-lg flex items-center gap-2">
                            <span>Vista:</span>
                            <div className="flex bg-slate-800 rounded p-0.5">
                                <button
                                    onClick={() => setViewMode('leaflet')}
                                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${viewMode === 'leaflet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Interactivo
                                </button>
                                <button
                                    onClick={() => setViewMode('waze')}
                                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${viewMode === 'waze' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Waze / Tráfico
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Map Content */}
                    <div className="w-full h-full bg-slate-900 relative z-0">
                        {viewMode === 'leaflet' ? (
                            <MapContainer
                                center={[-12.122, -77.028]}
                                zoom={14}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapUpdater center={mapCenter} zoom={mapZoom} />

                                {intersections.map((int) => {
                                    // Determine color based on status
                                    let colorClass = 'bg-emerald-500';
                                    let pulseClass = '';
                                    if (int.status === 'critical') {
                                        colorClass = 'bg-red-500';
                                        pulseClass = 'animate-ping';
                                    } else if (int.status === 'moderate') {
                                        colorClass = 'bg-amber-500';
                                    }

                                    // Create custom icon
                                    const customIcon = L.divIcon({
                                        className: 'custom-marker',
                                        html: `<div class="relative flex items-center justify-center w-6 h-6">
                                                 <span class="absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75 ${pulseClass}"></span>
                                                 <span class="relative inline-flex rounded-full h-4 w-4 ${colorClass} border-2 border-white shadow-lg"></span>
                                               </div>`,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 12]
                                    });

                                    return (
                                        <Marker
                                            key={int.id}
                                            position={[int.lat, int.lng]}
                                            icon={customIcon}
                                            eventHandlers={{
                                                click: () => handleCameraSelect(int.id),
                                            }}
                                        >
                                            <Tooltip direction="top" offset={[0, -12]} opacity={1} permanent={false}>
                                                <div className="text-center">
                                                    <div className="font-bold text-slate-900 text-xs">{int.name}</div>
                                                    <div className="text-[10px] text-slate-600">
                                                        {int.speed} km/h • {int.flow} vpm
                                                    </div>
                                                </div>
                                            </Tooltip>
                                            <Popup className="custom-popup">
                                                <div className="p-1">
                                                    <h4 className="font-bold text-slate-900 text-xs mb-1">{int.name}</h4>
                                                    <div className="flex justify-between text-[10px] text-slate-600 gap-2">
                                                        <span>Vel: {int.speed} km/h</span>
                                                        <span>Flujo: {int.flow} vpm</span>
                                                    </div>
                                                    <button
                                                        onClick={() => onSelectCamera(int.id)}
                                                        className="mt-2 w-full bg-indigo-600 text-white text-[10px] py-1 rounded hover:bg-indigo-700"
                                                    >
                                                        Ver Cámara
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        ) : (
                            <iframe
                                src="https://embed.waze.com/iframe?zoom=14&lat=-12.122&lon=-77.028&ct=livemap"
                                width="100%"
                                height="100%"
                                allowFullScreen
                                className="w-full h-full"
                                style={{ border: 0 }}
                            ></iframe>
                        )}
                    </div>
                </div>

                {/* Sidebar List */}
                <div className="col-span-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col shadow-xl">
                    <div className="p-4 border-b border-slate-700">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Video size={18} className="text-indigo-400" />
                            Cámaras Activas
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {intersections.map((cam) => (
                            <div key={cam.id}
                                onClick={() => handleCameraSelect(cam.id)}
                                className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-indigo-500 cursor-pointer transition-all hover:bg-slate-700 group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${cam.status === 'critical' ? 'bg-red-500 animate-pulse' : cam.status === 'moderate' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>
                                        <span className="font-medium text-white text-sm">{cam.name}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${cam.status === 'critical' ? 'bg-red-500/20 text-red-300' : cam.status === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                        {cam.status === 'critical' ? 'Crítico' : cam.status === 'moderate' ? 'Moderado' : 'Fluido'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Activity size={12} />
                                        <span>{cam.flow} vpm</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        <span>{cam.speed} km/h</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
