import React from 'react';

export const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-4 ${className}`}>
        {children}
    </div>
);
