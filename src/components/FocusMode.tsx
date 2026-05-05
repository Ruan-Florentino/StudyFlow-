import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Brain, Zap } from 'lucide-react';
import { useStore } from '../store';
import { GlassCard, Badge, cn, Header } from './UI';
import clsx from 'clsx';
import { playSuccessSound, triggerConfetti } from '../lib/studyUtils';

export const FocusMode = ({ onBack }: { onBack: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionGoal, setSessionGoal] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [ambientSound, setAmbientSound] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const { addSession, toggleAppBlocker, isAppBlockerActive, themeColor, addXP, neuralSync, updateNeuralSync } = useStore();
  
  // Use ref to track the exact end time to prevent drift
  const endTimeRef = React.useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (!isActive || !endTimeRef.current) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));

      setTimeLeft(remaining);

      if (remaining > 0) {
        animationFrameId = requestAnimationFrame(tick);
        if (mode === 'work' && isActive) {
          // Increment focus score every second
          setFocusScore(s => s + 1);
          // Increment Neural Sync slowly (up to 100%)
          if (Math.random() < 0.1 && neuralSync < 100) {
            updateNeuralSync(Math.min(100, neuralSync + 1));
          }
        }
      } else {
        // Timer finished
        setIsActive(false);
        toggleAppBlocker(false);
        endTimeRef.current = null;
        playSuccessSound();
        
        if (mode === 'work') {
          triggerConfetti();
          addSession({
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            duration: 25,
            subject: 'Sessão de Foco'
          });
          addXP(Math.floor(focusScore / 10)); // Bonus XP for focus score
          setFocusScore(0);
          updateNeuralSync(0); // Reset Neural Sync after work session
          setMode('break');
          setTimeLeft(5 * 60);
        } else {
          setMode('work');
          setTimeLeft(25 * 60);
          if (currentSession < sessionGoal) {
            setCurrentSession(s => s + 1);
          } else {
            setCurrentSession(1);
          }
        }
      }
    };

    if (isActive) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }
      animationFrameId = requestAnimationFrame(tick);
    } else {
      endTimeRef.current = null;
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, mode, addSession, toggleAppBlocker, currentSession, sessionGoal, timeLeft, neuralSync, updateNeuralSync]);

  const handleToggle = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    if (mode === 'work') {
      toggleAppBlocker(newActive);
      if (newActive) {
        useStore.getState().trackFeature('pomodoro');
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
    toggleAppBlocker(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className={clsx(
      "app-shell-premium pt-6 md:pt-8 flex flex-col items-center justify-center min-h-screen space-y-12 pb-32 md:pb-36 animate-in fade-in duration-1000 relative overflow-hidden",
      zenMode && "bg-black"
    )}>
      {zenMode && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black opacity-30" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          />
        </div>
      )}

      <Header 
        title="Foco Profundo" 
        subtitle="ESTADO ZEN"
        icon={mode === 'work' ? Zap : Coffee} 
        color={mode === 'work' ? 'primary' : 'blue'}
        onBack={onBack}
        className="w-full relative z-10"
        rightContent={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZenMode(!zenMode)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-premium-mono font-bold uppercase tracking-widest border transition-all",
                zenMode ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,232,143,0.3)]" : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
              )}
            >
              Zen Mode
            </button>
            <Badge variant={isAppBlockerActive ? 'primary' : 'secondary'} className={cn(isAppBlockerActive && "shadow-[0_0_10px_rgba(0,232,143,0.3)]")}>
              {isAppBlockerActive ? 'Blocker ON' : 'Blocker OFF'}
            </Badge>
          </div>
        }
      />

      {ambientSound && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <iframe 
            width="100%" 
            height="180" 
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&loop=1" 
            title="Lofi Girl" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="pointer-events-none"
          ></iframe>
        </motion.div>
      )}

      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-4xl font-premium-title italic tracking-tight">{mode === 'work' ? 'FOCO PROFUNDO' : 'DESCANSO'}</h2>
        <div className="flex items-center justify-center gap-4">
          <p className="text-primary text-xs font-premium-mono font-bold uppercase tracking-[0.2em]">
            Sessão {currentSession} de {sessionGoal}
          </p>
          {focusScore > 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1 text-yellow-500 text-[10px] font-premium-mono font-bold">
              <Zap size={10} fill="currentColor" />
              SCORE: {focusScore}
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center z-10">
        <div className="absolute w-72 h-72 rounded-full border-[2px] border-white/5" />
        <svg width="288" height="288" className="transform -rotate-90 relative z-10">
          <circle
            cx="144"
            cy="144"
            r="136"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="136"
            stroke={themeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 136}
            strokeDashoffset={2 * Math.PI * 136 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-6xl font-premium-mono font-bold tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-between w-full gap-4">
          <button 
            onClick={resetTimer}
            className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-text-secondary hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <RotateCcw size={18} strokeWidth={2} />
            Reiniciar
          </button>

          <button 
            onClick={() => setAmbientSound(!ambientSound)}
            className={clsx(
              "flex-1 h-14 rounded-2xl border flex items-center justify-center gap-2 transition-all font-bold uppercase tracking-widest text-[10px]",
              ambientSound ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-text-secondary hover:text-white hover:bg-white/10"
            )}
            title="Tocar Lofi"
          >
            {ambientSound ? <Volume2 size={18} strokeWidth={2} /> : <VolumeX size={18} strokeWidth={2} />}
            {ambientSound ? 'Som Ativo' : 'Som Inativo'}
          </button>
        </div>
        
        <button 
          onClick={handleToggle}
          className={clsx(
            "w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(0,232,143,0.3)] hover:scale-[1.02] active:scale-[0.98]",
            isActive ? "bg-red-500 text-white shadow-red-500/30 font-bold" : "bg-primary text-black"
          )}
        >
          {isActive ? <Pause size={20} strokeWidth={2} fill="currentColor" /> : <Play size={20} strokeWidth={2} fill="currentColor" />}
          {isActive ? 'Pausar Foco' : 'Iniciar Foco'}
        </button>
      </div>

      <div className="w-full max-w-xs space-y-4 relative z-10">
        <div className="flex justify-between text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
          <span>Progresso Diário</span>
          <span className="text-primary">{currentSession}/{sessionGoal}</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: sessionGoal }).map((_, i) => (
            <div 
              key={i} 
              className={clsx(
                "h-2 flex-1 rounded-full transition-all",
                i < currentSession - 1 ? "bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]" : 
                i === currentSession - 1 ? "bg-primary/50 animate-pulse" : "bg-white/10"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
