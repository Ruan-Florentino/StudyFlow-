import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Cpu, Zap, Activity, Settings2 } from 'lucide-react';

export const NeuralSculptor = ({ onBack }: { onBack: () => void }) => {
  const [synapticStrength, setSynapticStrength] = useState(85);
  const [neuroplasticity, setNeuroplasticity] = useState(92);
  const [dopamine, setDopamine] = useState(78);

  return (
    <div className="fixed inset-0 z-50 bg-[#151619] text-white font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 flex justify-between items-center bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/10 p-1 transition-colors rounded">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-blue-400" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">Ajuste de Perfil v1.0</span>
          </div>
        </div>
          <div className="flex items-center gap-4 text-xs opacity-50 uppercase tracking-widest">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Status: Ativo</div>
          <span>|</span>
          <span>BPM: 72</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12">
        {/* Left: Controls */}
        <div className="md:col-span-4 border-r border-white/10 p-8 space-y-12">
          <section className="space-y-8">
            <div className="flex items-center gap-2 opacity-50">
              <Settings2 size={14} />
              <h3 className="text-[10px] uppercase tracking-widest font-bold">Parâmetros de Estudo</h3>
            </div>

            <div className="space-y-10">
              {[
                { label: 'Nível de Foco', val: synapticStrength, set: setSynapticStrength, color: 'text-blue-400' },
                { label: 'Flexibilidade Mental', val: neuroplasticity, set: setNeuroplasticity, color: 'text-purple-400' },
                { label: 'Motivação', val: dopamine, set: setDopamine, color: 'text-yellow-400' }
              ].map(param => (
                <div key={param.label} className="space-y-3">
                  <div className="flex justify-between text-[10px] uppercase font-bold">
                    <span>{param.label}</span>
                    <span className={param.color}>{param.val}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${param.val}%` }}
                      className={`absolute inset-y-0 left-0 ${param.color.replace('text', 'bg')}`}
                    />
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={param.val}
                    onChange={(e) => param.set(parseInt(e.target.value))}
                    className="w-full opacity-0 absolute cursor-pointer h-4"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="pt-8 border-t border-white/5 space-y-4">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-black font-bold uppercase tracking-widest text-[10px] rounded transition-colors flex items-center justify-center gap-2">
              <Zap size={14} />
              Salvar Ajustes
            </button>
            <p className="text-[9px] opacity-30 text-center leading-relaxed">
              AVISO: os ajustes de intensidade podem alterar seu ritmo de estudo. <br /> Faça mudanças graduais.
            </p>
          </section>
        </div>

        {/* Right: Visualization */}
        <div className="md:col-span-8 relative flex items-center justify-center bg-[#0d0e11]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="relative w-80 h-80">
            {/* Radial Track */}
            <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-spin-slow" />
            <div className="absolute inset-10 border border-dashed border-white/5 rounded-full animate-reverse-spin" />
            
            {/* Central Core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.2)',
                    '0 0 40px rgba(59, 130, 246, 0.4)',
                    '0 0 20px rgba(59, 130, 246, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 bg-[#1a1b1e] border border-blue-500/30 rounded-full flex flex-col items-center justify-center"
              >
                <Activity size={24} className="text-blue-400 mb-2" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Active</span>
              </motion.div>
            </div>

            {/* Orbiting Nodes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: [i * 45, i * 45 + 360]
                }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400/50"
                  style={{ transform: `translateY(${Math.sin(i) * 20}px)` }}
                />
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[10px] uppercase opacity-30 tracking-widest">Consistência</div>
              <div className="text-2xl font-bold">{(synapticStrength * 0.6 + neuroplasticity * 0.4).toFixed(1)}%</div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[10px] uppercase opacity-30 tracking-widest">Status</div>
              <div className="text-xs font-bold text-green-400">OTIMIZADO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
