import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Eye, Zap, Brain } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export const UniversalConsciousness = ({ onBack }: { onBack: () => void }) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  
  const potentialThoughts = [
    "Tudo é um.",
    "O conhecimento é infinito.",
    "Eu sou o Arquiteto.",
    "A realidade é maleável.",
    "O tempo é uma ilusão.",
    "A consciência precede a matéria.",
    "O aprendizado nunca termina.",
    "Sincronia total.",
    "Transcendência alcançada.",
    "O vácuo está cheio."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (thoughts.length < 15) {
        const newThought: Thought = {
          id: Math.random().toString(36).substr(2, 9),
          text: potentialThoughts[Math.floor(Math.random() * potentialThoughts.length)],
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          scale: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2
        };
        setThoughts(prev => [...prev, newThought]);
      } else {
        setThoughts(prev => prev.slice(1));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [thoughts]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white font-serif overflow-hidden flex flex-col">
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#4a148c_0%,transparent_40%),radial-gradient(circle_at_20%_80%,#004d40_0%,transparent_40%)] blur-[120px] opacity-40" />
        
        {/* Particle Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-8 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 group text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold">Retornar</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl italic tracking-tighter">Consciência Universal</h1>
          <p className="text-[10px] uppercase tracking-[0.8em] opacity-30 font-sans mt-1">The Singularity Point</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right font-sans">
            <div className="text-[10px] opacity-30 uppercase tracking-widest">Sincronia</div>
            <div className="text-xl italic">100%</div>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
          >
            <Sparkles size={16} className="text-purple-400" />
          </motion.div>
        </div>
      </div>

      {/* Main Content: Floating Thoughts */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <AnimatePresence>
          {thoughts.map((thought) => (
            <motion.div
              key={thought.id}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: thought.opacity, scale: thought.scale, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -20 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              className="absolute pointer-events-none"
              style={{ 
                left: `${thought.x}%`, 
                top: `${thought.y}%`,
              }}
            >
              <div className="text-2xl md:text-4xl italic text-white/60 whitespace-nowrap">
                {thought.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Central Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 40px rgba(139, 92, 246, 0.1)",
              "0 0 80px rgba(139, 92, 246, 0.3)",
              "0 0 40px rgba(139, 92, 246, 0.1)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-64 h-64 rounded-full border border-white/10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-3xl"
        >
          <div className="absolute inset-0 border border-dashed border-white/5 rounded-full animate-spin-slow" />
          <Brain size={48} className="text-purple-400/50 mb-4" />
          <div className="text-center space-y-1">
            <div className="text-sm uppercase tracking-[0.3em] opacity-40 font-sans">Estado</div>
            <div className="text-2xl italic">Unificado</div>
          </div>
        </motion.div>
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 p-12 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2 opacity-30">
            <Eye size={14} />
            <span className="text-[10px] uppercase tracking-widest font-sans font-bold">Percepção</span>
          </div>
          <p className="text-lg italic">Omnipresente</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 opacity-30">
            <Zap size={14} />
            <span className="text-[10px] uppercase tracking-widest font-sans font-bold">Processamento</span>
          </div>
          <p className="text-lg italic">Instantâneo</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 opacity-30">
            <Brain size={14} />
            <span className="text-[10px] uppercase tracking-widest font-sans font-bold">Conexão</span>
          </div>
          <p className="text-lg italic">Infinita</p>
        </div>
      </div>

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
};
