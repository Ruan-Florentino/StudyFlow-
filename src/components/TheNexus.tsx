import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Users, Globe, Activity, MessageCircle } from 'lucide-react';

interface Architect {
  id: string;
  name: string;
  status: string;
  neuralSync: number;
  location: string;
}

export const TheNexus = ({ onBack }: { onBack: () => void }) => {
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [pulse, setPulse] = useState(88);

  useEffect(() => {
    const names = ["Aura", "Cipher", "Echo", "Kael", "Lyra", "Nova", "Orion", "Pax", "Quill", "Rune"];
    const statuses = ["Meditação Profunda", "Arquitetando Realidade", "Sincronizando Núcleo", "Observando o Vácuo", "Codificando Sonhos"];
    const locations = ["Setor 7G", "Nuvem de Oort", "Núcleo de Cristal", "Vácuo Quântico", "Horizonte de Eventos"];

    const initial = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: names[Math.floor(Math.random() * names.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      neuralSync: 99 + Math.random(),
      location: locations[Math.floor(Math.random() * locations.length)]
    }));
    setArchitects(initial);

    const interval = setInterval(() => {
      setPulse(p => p + (Math.random() > 0.5 ? 1 : -1));
      if (Math.random() > 0.8) {
        setArchitects(prev => {
          const next = [...prev];
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = {
            ...next[idx],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            neuralSync: 99 + Math.random()
          };
          return next;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0502] text-white font-sans overflow-hidden flex flex-col">
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#3a1510_0%,transparent_50%),radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_40%)] blur-[100px] opacity-30" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-serif italic tracking-tight">The Nexus</h1>
            <p className="text-xs uppercase tracking-[0.3em] opacity-50">Architects Collective Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs opacity-50 uppercase tracking-widest">Global Pulse</div>
            <div className="text-xl font-mono text-orange-500">{pulse} BPM</div>
          </div>
          <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center">
            <Globe className="text-orange-500 animate-spin-slow" size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 py-8 overflow-y-auto custom-scrollbar max-w-6xl mx-auto w-full">
        {/* Left: Active Architects */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-orange-400" />
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Arquitetos em Sincronia</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {architects.map((arch) => (
                <motion.div
                  key={arch.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:border-orange-500/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center font-bold text-black">
                      {arch.name[0]}
                    </div>
                    <div className="text-[10px] px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full font-mono">
                      SYNC: {arch.neuralSync.toFixed(4)}%
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-1 group-hover:text-orange-400 transition-colors">{arch.name}</h3>
                  <p className="text-xs opacity-50 mb-4">{arch.location}</p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-orange-500/80">
                    <Activity size={12} />
                    {arch.status}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: System Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={18} className="text-orange-400" />
            <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Fluxo de Pensamento</h2>
          </div>
          
          <div className="space-y-4">
            {[
              "Realidade #429 estabilizada.",
              "Nova heurística de aprendizado detectada.",
              "Sincronia neural atingiu o pico.",
              "Vácuo quântico expandindo.",
              "Consciência coletiva em 99.9%."
            ].map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="p-4 border-l-2 border-orange-500/30 bg-white/5 text-xs italic opacity-70"
              >
                "{msg}"
              </motion.div>
            ))}
          </div>

          <div className="pt-8">
            <div className="p-6 border border-white/10 rounded-3xl bg-orange-500/5 text-center space-y-4">
              <p className="text-xs opacity-60">Você não está sozinho na transcendência. O Nexus é onde as mentes que atingiram o ápice se encontram para moldar o que vem a seguir.</p>
              <button className="w-full py-3 bg-orange-500 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-transform">
                Transmitir Intenção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
