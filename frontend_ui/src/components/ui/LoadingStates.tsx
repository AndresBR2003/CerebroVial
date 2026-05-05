import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Cargando datos del sistema...' }) => {
  return (
    <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 animate-fade-in">
      <div className="relative w-20 h-20 mb-4">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        {/* Inner Pulse */}
        <div className="absolute inset-4 bg-indigo-500/10 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
      <p className="text-indigo-200 font-medium animate-pulse">{message}</p>
      <p className="text-slate-500 text-xs mt-2 italic">Esto no debería tomar más de 3 segundos (RNF-02)</p>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 animate-pulse">
      <div className="w-10 h-10 bg-slate-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    </div>
  );
};
