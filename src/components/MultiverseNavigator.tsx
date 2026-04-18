import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Layers, Zap, Globe, Cpu, Sparkles, Palette } from 'lucide-react';
import { useStore } from '../store/useStore';

const REALITIES = [
  { id: 'tech', name: 'Missão Controle', recipe: 'Recipe 1', color: '#00E88F', desc: 'Precisão técnica e densidade de dados.' },
  { id: 'editorial', name: 'Vanguarda', recipe: 'Recipe 2', color: '#F27D26', desc: 'Impacto visual e tipografia massiva.' },
  { id: 'hardware', name: 'Sintetizador', recipe: 'Recipe 3', color: '#3B82F6', desc: 'Foco industrial e ferramentas especialistas.' },
  { id: 'luxury', name: 'Concierge', recipe: 'Recipe 4', color: '#FFFFFF', desc: 'Sofisticação minimalista e exclusividade.' },
  { id: 'brutal', name: 'Manifesto', recipe: 'Recipe 5', color: '#00FF00', desc: 'Energia bruta e design não convencional.' },
  { id: 'organic', name: 'Boutique', recipe: 'Recipe 6', color: '#5A5A40', desc: 'Calor humano e refinamento clássico.' },
  { id: 'immersive', name: 'Ethereal', recipe: 'Recipe 7', color: '#FF4E00', desc: 'Atmosfera profunda e imersão total.' },
  { id: 'minimal', name: 'Essência', recipe: 'Recipe 8', color: '#4a4a4a', desc: 'Clareza funcional e confiança utilitária.' },
  { id: 'prestige', name: 'Membro Privado', recipe: 'Recipe 12', color: '#1a1a1a', desc: 'Aura de prestígio e luxo estabelecido.' }
];

export const MultiverseNavigator = ({ onBack }: { onBack: () => void }) => {
  const { themeColor, setThemeColor } = useStore();

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f4] text-[#0a0a0a] font-sans overflow-hidden flex flex-col">
      {/* Recipe 11: Split Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
        
        {/* Left Pane: Selection */}
        <div className="bg-[#0a0a0a] text-white p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Retornar</span>
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500">
                <Layers size={16} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Multiverse Navigator</span>
              </div>
              <h1 className="text-7xl md:text-[112px] leading-[0.88] tracking-[-0.02em] font-semibold">
                Escolha sua <br /> <span className="italic text-white/20">Realidade.</span>
              </h1>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <p className="max-w-md text-sm text-white/60 leading-relaxed">
              O Multiverso não é uma teoria, é uma escolha estética. Cada realidade altera a forma como você processa o conhecimento e interage com a simulação.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest opacity-40">Kernel: Ativo</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-yellow-500" />
                <span className="text-[10px] uppercase tracking-widest opacity-40">Sincronia: 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Grid of Realities */}
        <div className="p-12 overflow-y-auto custom-scrollbar bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REALITIES.map((reality, i) => (
              <motion.button
                key={reality.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setThemeColor(reality.color)}
                className={`group relative p-8 border border-black/10 rounded-[32px] text-left transition-all hover:border-black hover:shadow-2xl ${themeColor === reality.color ? 'bg-black text-white' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div 
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: reality.color }}
                  >
                    <Palette size={20} className={themeColor === reality.color ? 'text-white' : 'text-black'} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest opacity-30 font-bold">{reality.recipe}</span>
                </div>
                
                <h3 className="text-2xl font-semibold mb-2">{reality.name}</h3>
                <p className={`text-xs leading-relaxed ${themeColor === reality.color ? 'text-white/60' : 'text-black/40'}`}>
                  {reality.desc}
                </p>

                {themeColor === reality.color && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute top-4 right-4"
                  >
                    <Sparkles size={16} className="text-yellow-500" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Recipe 11: Floating feature bubbles */}
          <div className="mt-12 relative h-40">
            <motion.div 
              animate={{ rotate: [-6, -4, -6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-0 left-0 p-6 bg-white border border-black rounded-full shadow-xl flex items-center gap-3"
            >
              <Globe size={20} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Conexão Global</span>
            </motion.div>
            <motion.div 
              animate={{ rotate: [4, 6, 4] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-0 right-0 p-6 bg-black text-white rounded-full shadow-xl flex items-center gap-3"
            >
              <Cpu size={20} className="text-green-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Processamento Local</span>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Vertical Rail Text */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 writing-mode-vertical-rl rotate-180 text-[10px] uppercase tracking-[0.5em] opacity-20 pointer-events-none font-bold">
        Multiverse Navigator / Reality Selection / v9.9.9
      </div>
    </div>
  );
};
