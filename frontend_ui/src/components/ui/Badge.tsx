import React from 'react';

export const Badge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/50',
        moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        good: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    };
    const labels: Record<string, string> = { critical: 'CRÍTICO', moderate: 'MODERADO', good: 'FLUIDO' };

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold border ${colors[status] || colors.moderate}`}>
            {labels[status] || status}
        </span>
    );
};
