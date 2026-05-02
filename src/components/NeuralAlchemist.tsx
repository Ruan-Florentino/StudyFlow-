import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, ChevronLeft, Zap, Sparkles, Skull, Info, BookOpen, RefreshCw } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';
import { useStore } from '../store';

export const NeuralAlchemist = ({ onBack }: { onBack: () => void }) => {
  const [subjectA, setSubjectA] = useState('');
  const [subjectB, setSubjectB] = useState('');
  const [isTransmuting, setIsTransmuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addFlashcard, addNote } = useStore();

  const handleTransmute = async () => {
    if (!subjectA.trim() || !subjectB.trim() || isTransmuting) return;
    
    setIsTransmuting(true);
    setResult(null);
    try {
      const data = await aiService.generateAlchemicalTransmutation(subjectA, subjectB);
      setResult(data);
    } catch (error) {
      console.error("Erro na transmutação:", error);
    } finally {
      setIsTransmuting(false);
    }
  };

  const saveToLibrary = () => {
    if (!result) return;
    
    // Save as note
    addNote({
      id: Date.now().toString(),
      title: `[ALQUIMIA] ${result.title}`,
      content: `${result.description}\n\nCONHECIMENTO PROIBIDO:\n${result.forbiddenKnowledge}`,
      subject: 'Alquimia Neural',
      updatedAt: new Date().toISOString()
    });

    // Save flashcards
    result.flashcards.forEach((f: any, i: number) => {
      addFlashcard({
        id: `alch-${Date.now()}-${i}`,
        front: `[${result.title}] ${f.question}`,
        back: f.answer,
        subject: 'Alquimia Neural',
        deckId: 'alquimia-neural',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      });
    });

    alert("Conhecimento transmutado salvo na sua biblioteca!");
  };

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-[#0a0510] relative overflow-hidden">
      {/* Mystical Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
          Alquimista Neural<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <GlassCard className="p-8 border-purple-500/20 bg-purple-950/10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4 w-full">
              <label className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-bold">Essência A</label>
              <input 
                type="text" 
                placeholder="Ex: Física Quântica" 
                value={subjectA}
                onChange={(e) => setSubjectA(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-400 transition-all placeholder:text-purple-900"
              />
            </div>

            <div className="shrink-0">
              <div className={cn(
                "w-16 h-16 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-purple-900/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
                isTransmuting && "animate-spin"
              )}>
                <Zap size={32} className="text-purple-400" />
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <label className="text-[10px] uppercase tracking-[0.3em] text-purple-400 font-bold">Essência B</label>
              <input 
                type="text" 
                placeholder="Ex: Filosofia Estoica" 
                value={subjectB}
                onChange={(e) => setSubjectB(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-400 transition-all placeholder:text-purple-900"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <AnimatedButton 
              onClick={handleTransmute}
              disabled={!subjectA.trim() || !subjectB.trim() || isTransmuting}
              className="px-12 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              {isTransmuting ? <RefreshCw className="animate-spin mr-2" /> : <Beaker className="mr-2" />}
              {isTransmuting ? 'Transmutando...' : 'Realizar Transmutação'}
            </AnimatedButton>
          </div>
        </GlassCard>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-8 border-amber-500/30 bg-amber-950/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Skull size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Instabilidade: {result.dangerLevel}%</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-premium-title italic text-amber-400">{result.title}</h3>
                    <p className="text-lg text-amber-100/80 leading-relaxed italic">"{result.description}"</p>
                  </div>

                  <div className="p-6 bg-black/60 border border-amber-500/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Sparkles size={20} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">Conhecimento Proibido</h4>
                    </div>
                    <p className="text-sm text-amber-50/90 leading-relaxed font-mono">
                      {result.forbiddenKnowledge}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.flashcards.map((f: any, i: number) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Fragmento {i+1}</p>
                        <p className="text-xs text-white font-medium">{f.question}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex gap-4">
                    <AnimatedButton onClick={saveToLibrary} className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest text-xs">
                      <BookOpen size={16} className="mr-2" /> Incorporar à Biblioteca
                    </AnimatedButton>
                    <AnimatedButton onClick={() => setResult(null)} variant="secondary" className="px-6 border-white/10 text-white/50 text-xs">
                      Limpar Caldeirão
                    </AnimatedButton>
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
