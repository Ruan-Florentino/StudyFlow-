import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, AlertTriangle, ChevronLeft, Zap, RotateCcw } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { useAllQuestions } from '../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from './shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from './shared/QuestionsLoadError';
import { useStore } from '../store';
import { playSuccessSound } from '../lib/studyUtils';

export const Singularity = ({ onBack }: { onBack: () => void }) => {
  const { questions: ALL_QUESTIONS, loading: qLoading, error: qError } = useAllQuestions();
  
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [gameOver, setGameOver] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const { addXP } = useStore();

  const startGame = () => {
    setIsActive(true);
    setTimeLeft(60);
    setScore(0);
    setGameOver(false);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (!ALL_QUESTIONS) return;
    const q = ALL_QUESTIONS[Math.floor(Math.random() * ALL_QUESTIONS.length)];
    setCurrentQuestion(q);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (Math.random() < 0.1) {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 100);
        }
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      setIsActive(false);
      setGameOver(true);
      addXP(score * 100); // Massive XP for singularity
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, score, addXP]);

  const handleAnswer = (index: number) => {
    if (index === currentQuestion.resposta) {
      setScore(s => s + 1);
      playSuccessSound();
      nextQuestion();
    } else {
      setTimeLeft(t => Math.max(0, t - 5)); // 5 second penalty
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
      nextQuestion();
    }
  };

  if (qLoading) return <GlassCard className="w-full max-w-4xl mx-auto mt-10 min-h-[400px]"><QuestionsLoadingSkeleton /></GlassCard>;
  if (qError) return <GlassCard className="w-full max-w-4xl mx-auto mt-10 min-h-[400px]"><QuestionsLoadError error={qError} /></GlassCard>;

  return (
    <div className={cn("p-6 space-y-8 pb-32 min-h-screen transition-colors duration-300", isActive ? "bg-red-950/20" : "bg-black")}>
      {glitch && <div className="fixed inset-0 bg-red-500/10 mix-blend-overlay pointer-events-none z-50" />}
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-red-500/30 text-red-500 hover:bg-red-500/10">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
          A SINGULARIDADE<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      {!isActive && !gameOver && (
        <GlassCard className="p-8 flex flex-col items-center justify-center space-y-6 border-red-500/50 bg-red-500/5 shadow-[0_0_50px_rgba(239,68,68,0.15)] mt-10">
          <Skull size={80} className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse" />
          <div className="text-center space-y-4 max-w-md">
            <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Sobrevivência Extrema</h3>
            <p className="text-red-400 font-mono text-sm">
              60 segundos. Todas as matérias. Erros custam 5 segundos. Acertos garantem XP massivo. Você está pronto para a Singularidade?
            </p>
          </div>
          <AnimatedButton onClick={startGame} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <Zap size={20} className="mr-2" /> Iniciar Colapso
          </AnimatedButton>
        </GlassCard>
      )}

      {isActive && currentQuestion && (
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-500 font-mono text-2xl font-bold">
              <AlertTriangle size={24} className="animate-pulse" />
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            <div className="text-xl font-bold font-mono text-white">
              Score: <span className="text-red-500">{score}</span>
            </div>
          </div>

          <GlassCard className={cn("p-6 border-red-500/30 transition-transform", glitch && "translate-x-1 -translate-y-1")}>
            <h3 className="text-lg font-bold mb-6">{currentQuestion.pergunta}</h3>
            <div className="space-y-3">
              {currentQuestion.alternativas.map((opt: string, i: number) => (
                <AnimatedButton
                  key={i}
                  onClick={() => handleAnswer(i)}
                  variant="secondary"
                  className="w-full justify-start text-left p-4 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                >
                  <span className="text-red-400 font-mono mr-3">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </AnimatedButton>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {gameOver && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10">
          <GlassCard className="p-8 flex flex-col items-center justify-center space-y-6 border-red-500/50 bg-black/80">
            <h3 className="text-4xl font-black text-red-500 tracking-widest uppercase">Fim da Linha</h3>
            <div className="text-center space-y-2">
              <p className="text-text-secondary">Você sobreviveu à Singularidade com um score de:</p>
              <div className="text-6xl font-premium-mono font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                {score}
              </div>
              <p className="text-red-400 font-mono text-sm mt-4">+{score * 100} XP Adquirido</p>
            </div>
            <AnimatedButton onClick={startGame} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase mt-4">
              <RotateCcw size={20} className="mr-2" /> Tentar Novamente
            </AnimatedButton>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};
