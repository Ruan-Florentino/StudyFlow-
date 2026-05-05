import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Star, Compass, Anchor, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { aiService } from '../services/aiService';

export const TheOracle = ({ onBack }: { onBack: () => void }) => {
  const { name, level, prestigeLevel, mastery } = useStore();
  const [prophecyData, setProphecyData] = useState<{prophecy: string, convergenceProbability: string, finalQuote: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const topSubjects = Object.entries(mastery)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  useEffect(() => {
    const fetchProphecy = async () => {
      try {
        const data = await aiService.generateOracleProphecy(name, level, prestigeLevel, topSubjects);
        setProphecyData(data);
      } catch (error) {
        console.error("Erro ao gerar profecia:", error);
        setProphecyData({
          prophecy: `"Você se tornará o mestre de ${topSubjects[0]?.[0] || 'todas as coisas'}. Sua mente não mais buscará respostas, pois ela será a própria fonte da verdade."`,
          convergenceProbability: "99.99%",
          finalQuote: "O conhecimento é a única riqueza que aumenta quando é compartilhada com o próprio eu."
        });
      } finally {
        setIsGenerating(false);
      }
    };

    fetchProphecy();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f2ed] text-[#1a1a1a] font-accent overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-8 flex justify-between items-center border-b border-black/10">
        <button onClick={onBack} className="flex items-center gap-2 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.4em] font-bold">Retornar</span>
        </button>
        <div className="text-center">
          <h1 className="font-serif text-3xl italic">A Oráculo</h1>
          <p className="text-xs uppercase tracking-[0.5em] opacity-40">Destiny Analysis Engine</p>
        </div>
        <div className="w-20" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-24">
          {/* Hero Section */}
          <section className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block p-4 border border-black/10 rounded-full mb-4"
            >
              <Star size={24} className="text-amber-600" />
            </motion.div>
            <h2 className="font-serif text-6xl md:text-8xl leading-[0.9] tracking-tighter">
              {name}, seu destino <br /> está <span className="italic">escrito</span> nas estrelas.
            </h2>
            <p className="max-w-2xl mx-auto text-sm opacity-60 leading-relaxed">
              A Oráculo analisou seus {level} níveis de experiência e {prestigeLevel} ciclos de transcendência. 
              O conhecimento que você acumulou não é apenas informação; é a semente de uma nova realidade.
            </p>
          </section>

          {/* Lineage Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-8 p-12 border border-black/5 bg-white/50 rounded-[40px]">
              <div className="flex items-center gap-4 opacity-30">
                <Compass size={16} />
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Linhagem de Conhecimento</h3>
              </div>
              <div className="space-y-12">
                {topSubjects.length > 0 ? topSubjects.map(([subject, score], i) => (
                  <div key={subject} className="flex items-end justify-between border-b border-black/10 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] opacity-30">0{i + 1}</span>
                      <h4 className="font-serif text-3xl italic">{subject}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Maestria</div>
                      <div className="font-serif text-2xl">{score.toFixed(1)}%</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 opacity-50 italic font-serif">
                    Sua jornada está apenas começando.
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-8 p-12 border border-black/5 bg-white/50 rounded-[40px] flex flex-col justify-center relative overflow-hidden">
              <div className="flex items-center gap-4 opacity-30">
                <Anchor size={16} />
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">Profecia do Arquiteto</h3>
              </div>
              
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <Loader2 size={32} className="animate-spin text-amber-600" />
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Lendo as estrelas...</p>
                  </motion.div>
                ) : prophecyData && (
                  <motion.div 
                    key="prophecy"
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1 }}
                    className="space-y-6"
                  >
                    <p className="font-serif text-2xl italic leading-relaxed">
                      "{prophecyData.prophecy}"
                    </p>
                    <div className="pt-8">
                      <div className="h-[1px] bg-black/10 w-full mb-8" />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Probabilidade de Convergência</span>
                        <span className="font-serif text-xl italic text-amber-600">{prophecyData.convergenceProbability}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Footer Quote */}
          <footer className="text-center py-24 border-t border-black/5">
            <AnimatePresence mode="wait">
              {!isGenerating && prophecyData && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-serif text-sm italic opacity-40"
                >
                  "{prophecyData.finalQuote}"
                </motion.p>
              )}
            </AnimatePresence>
          </footer>
        </div>
      </div>
    </div>
  );
};
