import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Brain, Zap, FileText, Headphones, CheckCircle2, ChevronLeft, Play } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';
import { useStore } from '../store';

export const BrainUpload = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const { addFlashcard, addXP } = useStore();

  const handleUpload = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90));
    }, 500);

    try {
      const data = await aiService.processBrainUpload(text);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setIsProcessing(false);
        addXP(100);
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      setIsProcessing(false);
      alert("Erro ao processar o upload cerebral.");
    }
  };

  const saveFlashcards = () => {
    if (!result) return;
    result.flashcards.forEach((f: any) => {
      addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.front,
        back: f.back,
        subject: 'Brain Upload',
        deckId: 'brain-upload',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      });
    });
    alert("Flashcards salvos com sucesso!");
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Upload Cerebral<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      {!isProcessing && !result && (
        <GlassCard className="p-6 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Brain size={120} className="text-primary" />
          </div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-bold">Alimente a IA</h3>
            <p className="text-sm text-text-secondary">Cole seu texto, artigo ou anotações. A IA vai digerir e criar um ecossistema de estudos completo instantaneamente.</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole seu texto aqui (ex: resumo de biologia, artigo de história...)"
            className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors relative z-10"
          />

          <AnimatedButton onClick={handleUpload} className="w-full py-4 relative z-10" disabled={!text.trim()}>
            <UploadCloud size={20} className="mr-2" />
            Iniciar Upload Cerebral
          </AnimatedButton>
        </GlassCard>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-20 space-y-8">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-primary border-r-2 border-transparent"
            />
            <Brain size={48} className="text-primary animate-pulse" />
          </div>
          <div className="space-y-2 text-center w-full max-w-md">
            <h3 className="font-premium-mono font-bold text-lg uppercase tracking-widest text-primary">Processando Dados</h3>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary font-mono">{Math.round(progress)}% - Sintetizando conhecimento...</p>
          </div>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <CheckCircle2 size={24} />
              Upload Concluído
            </h3>
            <AnimatedButton onClick={() => setResult(null)} variant="secondary" className="text-xs py-1 px-3">
              Novo Upload
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resumo */}
            <GlassCard className="p-5 space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-primary">
                <FileText size={18} />
                <h4 className="font-bold uppercase tracking-widest text-xs">Resumo Executivo</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{result.summary}</p>
            </GlassCard>

            {/* Conceitos Chave */}
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Zap size={18} />
                <h4 className="font-bold uppercase tracking-widest text-xs">Conceitos Chave</h4>
              </div>
              <ul className="space-y-2">
                {result.keyConcepts.map((concept: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Podcast Teaser */}
            <GlassCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Headphones size={18} />
                <h4 className="font-bold uppercase tracking-widest text-xs">Podcast Teaser</h4>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/5 text-sm italic text-text-secondary">
                "{result.podcastTeaser}"
              </div>
              <AnimatedButton variant="secondary" className="w-full py-2 text-xs mt-2">
                <Play size={14} className="mr-2" /> Ouvir Completo (Em breve)
              </AnimatedButton>
            </GlassCard>

            {/* Flashcards */}
            <GlassCard className="p-5 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-400">
                  <Brain size={18} />
                  <h4 className="font-bold uppercase tracking-widest text-xs">Flashcards Gerados ({result.flashcards.length})</h4>
                </div>
                <AnimatedButton onClick={saveFlashcards} className="py-1.5 px-4 text-xs bg-orange-500 hover:bg-orange-600 text-white">
                  Salvar no Anki
                </AnimatedButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.flashcards.map((f: any, i: number) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-text-secondary">P: {f.front}</div>
                    <div className="text-xs text-white/80">R: {f.back}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  );
};
