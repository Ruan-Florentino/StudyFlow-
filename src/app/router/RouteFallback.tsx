import React from 'react';

/**
 * RouteFallback
 * Mostrado durante o lazy load de uma rota.
 * Deve ser RÁPIDO de renderizar e visualmente
 * estável (evitar layout shift).
 */
export function RouteFallback() {
  return (
    <div className="p-6 space-y-4 animate-in fade-in duration-200 w-full max-w-7xl mx-auto">
      <div className="h-8 bg-zinc-800 rounded-md w-48 animate-pulse" />
      <div className="h-4 bg-zinc-800 rounded-md w-full max-w-md animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="h-32 bg-zinc-800 rounded-xl w-full animate-pulse" />
        <div className="h-32 bg-zinc-800 rounded-xl w-full animate-pulse" />
        <div className="h-32 bg-zinc-800 rounded-xl w-full animate-pulse" />
      </div>
    </div>
  );
}
