import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Zap } from 'lucide-react';
import { useStore } from '../../../store';
import { AnimatedButton, GlassCard, cn } from '../../UI';
import { playSuccessSound, triggerConfetti } from '../../../lib/studyUtils';

/**
 * BossBattle
 * Tipo: UI Flutuante / Overlay Global
 * Extraído de: App.tsx (T.45-E)
 */

export function BossBattle() {
  const { currentBossBattle, endBossBattle, addXP } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!currentBossBattle) return null;

  const q = currentBossBattle.questions[currentIdx];

  const handleConfirm = () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedOption === q.resposta;
    if (isCorrect) {
      setScore(s => s + 1);
      playSuccessSound();
      triggerConfetti();
    }
    
    setTimeout(() => {
      if (currentIdx < currentBossBattle.questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelectedOption(null);
        setConfirmed(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 z-[300] bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_50px_rgba(0,255,148,0.3)]"
        >
          <Trophy size={64} className="text-primary" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-premium-title italic">Batalha Finalizada<span className="text-primary font-normal not-italic ml-1">.</span></h2>
          <p className="text-text-secondary uppercase font-premium-mono font-bold tracking-[0.3em]">Maestria em {currentBossBattle.subject}</p>
        </div>
        <div className="text-6xl font-premium-mono font-bold text-primary">
          {score}/{currentBossBattle.questions.length}
        </div>
        <div className="space-y-4 w-full max-w-xs">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">XP Ganho</p>
            <p className="text-2xl font-premium-mono font-bold text-primary">+{score * 100} XP</p>
          </div>
          <AnimatedButton 
            onClick={() => {
              addXP(score * 100);
              endBossBattle(score);
            }} 
            className="w-full bg-primary text-black border-primary py-4"
          >
            Coletar Recompensas
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col p-6">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-sm">BOSS BATTLE</h3>
            <p className="text-[10px] text-red-500 uppercase font-premium-mono font-bold tracking-widest">{currentBossBattle.subject}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-premium-mono font-bold text-text-secondary">{currentIdx + 1} / {currentBossBattle.questions.length}</p>
          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / currentBossBattle.questions.length) * 100}%` }}
              className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <GlassCard className="p-8 border-red-500/20 bg-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <p className="text-lg font-bold leading-relaxed">{q.pergunta}</p>
        </GlassCard>

        <div className="grid gap-3">
          {q.alternativas.map((alt: string, i: number) => (
            <button
              key={i}
              onClick={() => !confirmed && setSelectedOption(i)}
              className={cn(
                "p-5 rounded-2xl border text-left transition-all relative overflow-hidden group",
                selectedOption === i ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:border-white/20",
                confirmed && i === q.resposta && "border-green-500 bg-green-500/10",
                confirmed && selectedOption === i && i !== q.resposta && "border-red-500 bg-red-500/10"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-premium-mono font-bold text-xs border transition-all",
                  selectedOption === i ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-text-secondary"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-medium">{alt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <footer className="mt-8">
        <AnimatedButton 
          onClick={handleConfirm}
          disabled={selectedOption === null || confirmed}
          className="w-full bg-primary text-black border-primary py-4 disabled:opacity-50"
        >
          Confirmar Resposta
        </AnimatedButton>
      </footer>
    </div>
  );
}
