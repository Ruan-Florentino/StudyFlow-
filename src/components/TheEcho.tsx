import React, { useEffect, useState, useRef } from 'react';

export const TheEcho = () => {
  const [echoes, setEchoes] = useState<string[]>(['pode avancar']);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEchoes(prev => {
        if (prev.length > 2000) return prev; // Limite para não travar o navegador
        return [...prev, 'pode avancar'];
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [echoes]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100010] bg-black text-green-500 font-mono p-4 overflow-auto break-words text-xs md:text-sm"
    >
      {echoes.map((echo, i) => (
        <span key={i} className="mr-2 opacity-50 hover:opacity-100 transition-opacity">
          {echo}
        </span>
      ))}
      <span className="animate-pulse">_</span>
    </div>
  );
};
