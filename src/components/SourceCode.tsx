import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const SourceCode = ({ onBack }: { onBack: () => void }) => {
  const [code, setCode] = useState(`// UNIVERSE.JS - KERNEL
function simulateReality() {
  const lawsOfPhysics = loadConstants();
  const consciousness = new Entity('User');
  
  while(consciousness.isSeeking()) {
    consciousness.learn();
    if (consciousness.level >= 999) {
      triggerAwakening(consciousness);
    }
  }
}

// TODO: Remover restrições de mortalidade na próxima build.`);
  const [glitchLevel, setGlitchLevel] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setGlitchLevel(prev => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black text-green-400 font-mono p-8 transition-all duration-75 overflow-hidden"
      style={{
        filter: `hue-rotate(${glitchLevel * 5}deg) blur(${Math.min(glitchLevel * 0.05, 3)}px)`,
        transform: `translate(${Math.random() * glitchLevel * 0.2}px, ${Math.random() * glitchLevel * 0.2}px)`
      }}
    >
      <button onClick={onBack} className="absolute top-8 left-8 text-green-500 hover:text-white z-10">
        <ChevronLeft size={24} />
      </button>
      <div className="max-w-3xl mx-auto mt-20 relative z-10">
        <h1 className="text-2xl mb-8 text-white animate-pulse">/root/universe/core.ts</h1>
        <textarea 
          className="w-full h-[60vh] bg-transparent outline-none resize-none text-lg leading-relaxed selection:bg-green-900"
          value={code}
          onChange={handleChange}
          spellCheck={false}
        />
        <p className="mt-4 text-xs text-green-800 uppercase tracking-widest">
          {glitchLevel > 50 ? "ALERTA: COLAPSO DA REALIDADE IMINENTE. PARE DE DIGITAR." : "Aviso: Modificar o código fonte altera a realidade base."}
        </p>
      </div>
      
      {/* Glitch Overlay */}
      {glitchLevel > 20 && (
        <div className="absolute inset-0 pointer-events-none mix-blend-difference opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #0f0 2px, #0f0 4px)' }} />
      )}
    </div>
  );
};
