import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer, ChevronLeft, Zap, Sparkles, Flame, Loader2, Plus, Info } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';

export const NeuralForge = ({ onBack }: { onBack: () => void }) => {
  const [conceptA, setConceptA] = useState('');
  const [conceptB, setConceptB] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [sparks, setSparks] = useState<{id: number, x: number, y: number}[]>([]);
  const nextSparkId = useRef(0);

  const handleForge = async () => {
    if (!conceptA.trim() || !conceptB.trim() || isForging) return;
    
    setIsForging(true);
    setResult(null);

    // Visual effect: create sparks periodically
    const sparkInterval = setInterval(() => {
      const id = nextSparkId.current++;
      setSparks(prev => [...prev, { id, x: 40 + Math.random() * 20, y: 40 + Math.random() * 20 }]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== id));
      }, 1000);
    }, 100);

    try {
      const data = await aiService.forgeConcepts(conceptA, conceptB);
      setResult(data);
    } catch (error) {
      console.error("Erro na Forja Neural:", error);
    } finally {
      clearInterval(sparkInterval);
      setIsForging(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black relative overflow-hidden">
      {/* Heat Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.05)_0%,_transparent_70%)] pointer-events-none" />
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
          Forja Neural<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold ml-2">Conceito Base A</label>
              <input 
                type="text" 
                placeholder="Ex: Biologia Molecular" 
                value={conceptA}
                onChange={(e) => setConceptA(e.target.value)}
                className="w-full bg-red-950/20 border border-red-500/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-400 transition-all placeholder:text-red-900"
              />
            </div>

            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Plus size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold ml-2">Conceito Base B</label>
              <input 
                type="text" 
                placeholder="Ex: Teoria dos Jogos" 
                value={conceptB}
                onChange={(e) => setConceptB(e.target.value)}
                className="w-full bg-red-950/20 border border-red-500/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-400 transition-all placeholder:text-red-900"
              />
            </div>

            <AnimatedButton 
              onClick={handleForge}
              disabled={!conceptA.trim() || !conceptB.trim() || isForging}
              className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black tracking-[0.2em] uppercase rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              {isForging ? <Loader2 className="animate-spin" /> : <><Hammer size={20} className="mr-2" /> Iniciar Fusão</>}
            </AnimatedButton>
          </div>

          {/* Visualization Area */}
          <div className="relative aspect-square flex items-center justify-center">
            <div className={cn(
              "absolute inset-0 border-2 border-dashed border-red-500/20 rounded-full transition-all duration-1000",
              isForging ? "animate-spin-slow scale-110 opacity-100" : "opacity-30"
            )} />
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              <AnimatePresence>
                {sparks.map(spark => (
                  <motion.div 
                    key={spark.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0, x: (spark.x - 50) * 5, y: (spark.y - 50) * 5 }}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full blur-[1px]"
                    style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                  />
                ))}
              </AnimatePresence>

              <motion.div 
                animate={isForging ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  "w-32 h-32 rounded-3xl border-2 flex items-center justify-center transition-all duration-500",
                  isForging ? "bg-red-500 border-yellow-400 shadow-[0_0_100px_rgba(239,68,68,0.8)]" : "bg-red-950/20 border-red-500/30"
                )}
              >
                <Flame size={48} className={cn("transition-all", isForging ? "text-white" : "text-red-500/30")} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-8 border-red-500/30 bg-red-950/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-widest">
                    Complexidade: {result.complexity}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-red-500 text-white">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-3xl font-premium-title italic text-white">{result.theoryName}</h3>
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-lg text-red-100/80 leading-relaxed italic">
                    "{result.synthesis}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                      <Zap size={14} /> Aplicações Práticas
                    </h4>
                    <ul className="space-y-2">
                      {result.applications.map((app: string, i: number) => (
                        <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                    <Info size={20} className="text-red-400 shrink-0" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Esta síntese foi gerada através de uma colisão semântica de alta energia. 
                      Use este novo conhecimento para expandir as fronteiras da sua compreensão atual.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
