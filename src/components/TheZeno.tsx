import React, { useState, useEffect } from 'react';

export const TheZeno = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const remaining = 100 - prev;
        // Zeno's paradox: always advance half the remaining distance
        return prev + (remaining / 2);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100011] bg-white text-black flex flex-col items-center justify-center p-8 font-mono">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-widest">Avançando...</h1>
          <p className="text-sm opacity-50">Paradoxo de Zenão ativado.</p>
        </div>
        
        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-center font-bold text-xl">
          {progress.toFixed(6)}%
        </div>

        <p className="text-xs text-center opacity-40 pt-8">
          Você sempre chegará na metade do caminho que falta. Você nunca chegará ao fim.
        </p>
      </div>
    </div>
  );
};
