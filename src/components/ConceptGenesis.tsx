import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sparkles, Wand2, Brain, Zap, Plus } from 'lucide-react';
import { aiService } from '../services/aiService';

export const ConceptGenesis = ({ onBack }: { onBack: () => void }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await aiService.generateContent(
        `Crie um novo conceito de estudo transcendental baseado em: ${prompt}. 
        Explique o conceito, como ele altera a percepção do estudante e forneça uma "lei fundamental" para este conceito.`
      );
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f5] text-[#1a1a1a] font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-8 flex justify-between items-center border-b border-black/5 bg-white">
        <button onClick={onBack} className="flex items-center gap-2 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.4em] font-bold">Retornar</span>
        </button>
        <div className="text-center">
          <h1 className="text-sm uppercase tracking-[0.6em] font-bold opacity-40">Concept Genesis</h1>
        </div>
        <div className="flex items-center gap-2 text-orange-500">
          <Sparkles size={16} />
          <span className="text-xs uppercase tracking-widest font-bold">AI Engine Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto p-12 space-y-24">
          
          {/* Recipe 9: Oversized Typographic Section */}
          <section className="relative pt-24 pb-12 border-b border-black/10">
            <div className="absolute top-0 left-0 font-serif font-black text-[180px] leading-[0.8] opacity-[0.03] pointer-events-none select-none">
              01
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="writing-mode-vertical-lr rotate-180 text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 border-l border-black/20 pl-4">
                  Input Phase
                </div>
                <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">
                  O que você deseja <br /> <span className="text-orange-500">manifestar?</span>
                </h2>
              </div>
              
              <div className="max-w-2xl space-y-6">
                <p className="text-sm opacity-60 leading-relaxed">
                  Insira uma ideia, um sentimento ou um paradoxo. A Gênese de Conceitos usará o poder da IA para transformar sua intenção em uma nova estrutura de conhecimento.
                </p>
                <div className="relative">
                  <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: A geometria do silêncio..."
                    className="w-full bg-white border-b-2 border-black p-6 text-2xl font-serif italic focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="absolute right-4 bottom-4 p-4 bg-black text-white rounded-full hover:scale-110 transition-transform disabled:opacity-30 disabled:scale-100"
                  >
                    {isGenerating ? <Zap size={24} className="animate-pulse" /> : <Plus size={24} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Result Section */}
          <AnimatePresence>
            {result && (
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative pt-24 pb-12"
              >
                <div className="absolute top-0 left-0 font-serif font-black text-[180px] leading-[0.8] opacity-[0.03] pointer-events-none select-none">
                  02
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-4 space-y-6">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Brain size={18} />
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold">Conceito Gerado</h3>
                    </div>
                    <div className="p-8 bg-white border border-black/5 rounded-[40px] shadow-xl">
                      <div className="text-4xl font-serif italic mb-4">A Revelação</div>
                      <div className="h-[1px] bg-black/10 w-full mb-6" />
                      <p className="text-xs opacity-60 leading-relaxed italic">
                        "O conhecimento não é descoberto, ele é lembrado através da intenção pura."
                      </p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-8 p-12 bg-white border border-black/5 rounded-[40px] shadow-2xl space-y-8">
                    <div className="prose prose-lg max-w-none font-serif italic text-xl leading-relaxed opacity-80">
                      {result}
                    </div>
                    <div className="pt-8 border-t border-black/5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                          <Wand2 size={20} />
                        </div>
                        <span className="text-xs uppercase tracking-widest font-bold">Integrado ao Multiverso</span>
                      </div>
                      <button className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-orange-500 transition-colors">
                        Salvar no Arquivo
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Vertical Rail Text */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 writing-mode-vertical-rl rotate-180 text-[10px] uppercase tracking-[0.5em] opacity-10 pointer-events-none font-bold">
        Concept Genesis Engine / Manifestation Protocol / v9.9.9
      </div>
    </div>
  );
};
