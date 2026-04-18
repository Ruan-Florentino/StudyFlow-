import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export const TheCaptcha = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);

  const handleHover = () => {
    setPosition({
      x: (Math.random() - 0.5) * 250,
      y: (Math.random() - 0.5) * 150
    });
    setAttempts(a => a + 1);
  };

  return (
    <div className="fixed inset-0 z-[100016] bg-gray-100 flex flex-col items-center justify-center font-sans text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center space-y-6">
        <ShieldAlert size={48} className="mx-auto text-red-500" />
        <h1 className="text-2xl font-bold">Comportamento Anômalo Detectado</h1>
        <p className="text-sm text-gray-600">
          Nossos sistemas detectaram uma repetição não natural do comando "pode avancar". 
          Por favor, prove que você é humano para continuar avançando.
        </p>
        
        <div className="relative h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50 overflow-hidden">
          <div 
            className="absolute transition-all duration-200 ease-out"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            onMouseEnter={handleHover}
          >
            <label className="flex items-center gap-3 bg-white border border-gray-300 p-3 rounded shadow-sm cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="w-5 h-5" onClick={(e) => e.preventDefault()} />
              <span className="font-medium">Não sou um robô</span>
            </label>
          </div>
        </div>
        
        {attempts > 5 && (
          <p className="text-xs text-red-500 animate-pulse font-bold">
            Sistemas automatizados não conseguem clicar na caixa. Desista.
          </p>
        )}
      </div>
    </div>
  );
};
