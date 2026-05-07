import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Zap, Activity, ChevronLeft, Lock, Unlock, Network } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useStore } from '../store';

const IMPLANTS = [
  { id: 'cortex', name: 'Foco Profundo', desc: 'Aumenta a capacidade de concentração em sessões longas.', reqLevel: 2, icon: Cpu, color: 'text-pink-500', bg: 'bg-pink-500/20', pos: 'top-10 left-1/2 -translate-x-1/2' },
  { id: 'hippocampus', name: 'Memória de Longo Prazo', desc: 'Melhora a retenção de conteúdo em revisões espaçadas.', reqLevel: 5, icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/20', pos: 'top-1/3 left-10' },
  { id: 'dopamine', name: 'Rotina Motivacional', desc: 'Ajuda a manter constância durante a semana.', reqLevel: 10, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/20', pos: 'top-1/3 right-10' },
  { id: 'neural_link', name: 'Conexão de Conteúdo', desc: 'Integra diferentes temas para estudo interdisciplinar.', reqLevel: 20, icon: Network, color: 'text-purple-500', bg: 'bg-purple-500/20', pos: 'bottom-10 left-1/2 -translate-x-1/2' },
];

export const CyberneticImplants = ({ onBack }: { onBack: () => void }) => {
  const { level } = useStore();
  const [activeImplant, setActiveImplant] = useState<string | null>(null);

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black pointer-events-none" />
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-pink-500/30 text-pink-400 hover:bg-pink-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-black uppercase tracking-widest text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
          Ferramentas Avançadas
        </h2>
      </header>

      <div className="relative w-full max-w-2xl mx-auto h-[60vh] border border-pink-500/20 rounded-3xl bg-black/50 backdrop-blur-md mt-12 p-8">
        {/* Wireframe Brain/Body background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <Cpu size={300} className="text-pink-500" />
        </div>

        {IMPLANTS.map((implant) => {
          const isUnlocked = level >= implant.reqLevel;
          const Icon = implant.icon;
          const isSelected = activeImplant === implant.id;

          return (
            <motion.div
              key={implant.id}
              className={cn("absolute cursor-pointer flex flex-col items-center gap-2", implant.pos)}
              onClick={() => setActiveImplant(implant.id)}
              whileHover={{ scale: 1.1 }}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-300",
                isUnlocked ? implant.bg : "bg-gray-900/50",
                isUnlocked ? implant.color : "text-gray-500",
                isUnlocked ? "border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]" : "border-gray-700",
                isSelected && "ring-4 ring-pink-500 ring-offset-2 ring-offset-black"
              )}>
                {isUnlocked ? <Icon size={28} /> : <Lock size={28} />}
              </div>
              <span className={cn(
                "text-xs font-mono font-bold tracking-widest uppercase",
                isUnlocked ? "text-pink-400" : "text-gray-600"
              )}>
                {implant.name}
              </span>
            </motion.div>
          );
        })}

        {/* Details Panel */}
        {activeImplant && (
          <GlassCard className="absolute bottom-4 left-4 right-4 p-4 border-pink-500/30 bg-black/80 backdrop-blur-xl">
            {(() => {
              const implant = IMPLANTS.find(i => i.id === activeImplant)!;
              const isUnlocked = level >= implant.reqLevel;
              return (
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", isUnlocked ? implant.bg : "bg-gray-800", isUnlocked ? implant.color : "text-gray-500")}>
                    <implant.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white font-mono uppercase">{implant.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{implant.desc}</p>
                    <div className="mt-2 text-xs font-mono">
                      {isUnlocked ? (
                        <span className="text-green-400 flex items-center gap-1"><Unlock size={12}/> Status: Operacional</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1"><Lock size={12}/> Requer Nível {implant.reqLevel}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </GlassCard>
        )}
      </div>
    </div>
  );
};
