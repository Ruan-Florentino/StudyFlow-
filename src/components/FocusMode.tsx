import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Zap } from 'lucide-react';
import { useStore } from '../store';
import { useUserStore } from '../store/useUserStore';
import { recordStudySession } from '../lib/persistence';
import { GlassCard, Badge, cn, Header } from './UI';
import clsx from 'clsx';
import { playSuccessSound, triggerConfetti } from '../lib/studyUtils';
import { playInteractionFeedback } from '../lib/feedback';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const TIMER_RADIUS = 136;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

export const FocusMode = ({ onBack }: { onBack: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionGoal] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [ambientSound, setAmbientSound] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [focusScore, setFocusScore] = useState(0);
  const { toggleAppBlocker, isAppBlockerActive, themeColor, addXP } = useStore();
  const userId = useUserStore((s) => s.userId);

  const endTimeRef = React.useRef<number | null>(null);
  const focusSecondsRef = React.useRef(0);
  const lastRemainingRef = React.useRef(WORK_SECONDS);
  const modeRef = React.useRef(mode);
  const userIdRef = React.useRef(userId);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!isActive) {
      endTimeRef.current = null;
      return undefined;
    }

    if (!endTimeRef.current) {
      endTimeRef.current = Date.now() + lastRemainingRef.current * 1000;
    }

    const tick = () => {
      if (!endTimeRef.current) return;

      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));

      if (remaining !== lastRemainingRef.current) {
        const elapsedSeconds = Math.max(0, lastRemainingRef.current - remaining);
        lastRemainingRef.current = remaining;
        setTimeLeft(remaining);

        if (modeRef.current === 'work' && elapsedSeconds > 0) {
          focusSecondsRef.current += elapsedSeconds;
          setFocusScore(focusSecondsRef.current);

          if (Math.random() < 0.1) {
            const store = useStore.getState();
            if (store.neuralSync < 100) {
              store.updateNeuralSync(Math.min(100, store.neuralSync + 1));
            }
          }
        }
      }

      if (remaining > 0) return;

      setIsActive(false);
      toggleAppBlocker(false);
      endTimeRef.current = null;
      playInteractionFeedback('complete');
      playSuccessSound();

      if (modeRef.current === 'work') {
        triggerConfetti();
        const endedAt = new Date();
        const elapsedSec = Math.max(1, focusSecondsRef.current);
        const startedAt = new Date(endedAt.getTime() - elapsedSec * 1000);

        void recordStudySession({
          userId: userIdRef.current || null,
          startedAt,
          endedAt,
          activityType: 'focus',
          subject: 'Sessao de Foco',
        });

        addXP(Math.floor(focusSecondsRef.current / 10));
        focusSecondsRef.current = 0;
        setFocusScore(0);
        useStore.getState().updateNeuralSync(0);
        modeRef.current = 'break';
        setMode('break');
        lastRemainingRef.current = BREAK_SECONDS;
        setTimeLeft(BREAK_SECONDS);
      } else {
        modeRef.current = 'work';
        setMode('work');
        lastRemainingRef.current = WORK_SECONDS;
        setTimeLeft(WORK_SECONDS);
        setCurrentSession((session) => (session < sessionGoal ? session + 1 : 1));
      }
    };

    const intervalId = window.setInterval(tick, 250);
    tick();

    return () => {
      window.clearInterval(intervalId);
    };
  }, [addXP, isActive, sessionGoal, toggleAppBlocker]);

  const handleToggle = () => {
    const newActive = !isActive;
    playInteractionFeedback(newActive ? 'focusStart' : 'focusPause');

    if (newActive) {
      lastRemainingRef.current = timeLeft;
      endTimeRef.current = Date.now() + timeLeft * 1000;
      if (mode === 'work' && timeLeft === WORK_SECONDS) {
        focusSecondsRef.current = 0;
        setFocusScore(0);
      }
    } else {
      endTimeRef.current = null;
      lastRemainingRef.current = timeLeft;
    }

    setIsActive(newActive);
    if (mode === 'work') {
      toggleAppBlocker(newActive);
      if (newActive) {
        useStore.getState().trackFeature('pomodoro');
      }
    }
  };

  const resetTimer = () => {
    playInteractionFeedback('tap');
    endTimeRef.current = null;
    focusSecondsRef.current = 0;
    setFocusScore(0);
    lastRemainingRef.current = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
    toggleAppBlocker(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modeDuration = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const safeTimeLeft = Number.isFinite(timeLeft) ? Math.max(0, Math.min(timeLeft, modeDuration)) : modeDuration;
  const progress = Math.min(100, Math.max(0, ((modeDuration - safeTimeLeft) / modeDuration) * 100));
  const ringOffset = TIMER_CIRCUMFERENCE * (1 - progress / 100);
  const minutesFocused = Math.floor(focusScore / 60);

  return (
    <div className={clsx(
      'studyflow-focus-mode app-shell-premium pt-6 sm:pt-8 md:pt-8 flex flex-col items-center justify-start md:justify-center min-h-screen space-y-5 sm:space-y-6 md:space-y-10 pb-40 md:pb-36 animate-in fade-in duration-1000 relative overflow-hidden',
      zenMode && 'bg-black'
    )}>
      {zenMode && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black opacity-30" />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.26, 0.42, 0.26] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]"
          />
        </div>
      )}

      <Header
        title="Foco"
        subtitle={mode === 'work' ? 'SESSAO' : 'PAUSA'}
        icon={mode === 'work' ? Zap : Coffee}
        color={mode === 'work' ? 'primary' : 'blue'}
        onBack={onBack}
        className="w-full relative z-10 shrink-0"
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playInteractionFeedback('soft'); setZenMode(!zenMode); }}
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-premium-mono font-bold uppercase tracking-widest border transition-all',
                zenMode ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,232,143,0.3)]' : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
              )}
            >
              Zen
            </button>
            <Badge variant={isAppBlockerActive ? 'primary' : 'secondary'} className={cn(isAppBlockerActive && 'shadow-[0_0_10px_rgba(0,232,143,0.3)]')}>
              {isAppBlockerActive ? 'Blocker ON' : 'Blocker OFF'}
            </Badge>
          </div>
        }
      />

      {ambientSound && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <iframe
            width="100%"
            height="180"
            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&loop=1"
            title="Lofi Girl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="pointer-events-none"
          />
        </motion.div>
      )}

      <div className="relative z-10 text-center space-y-2 md:space-y-3">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/55">
          <span className={clsx('h-1.5 w-1.5 rounded-full', isActive ? 'bg-primary shadow-[0_0_12px_rgba(var(--hub-primary-rgb),0.8)]' : 'bg-white/25')} />
          {isActive ? 'Rodando' : 'Pronto'}
        </div>
        <h2 className="text-3xl font-premium-title tracking-tight sm:text-5xl">{mode === 'work' ? 'Foco Profundo' : 'Descanso'}</h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-premium-mono font-bold uppercase tracking-[0.16em] text-text-secondary">
          <span className="text-primary">Sessao {currentSession}/{sessionGoal}</span>
          <span>{minutesFocused} min focados</span>
          {focusScore > 0 && (
            <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1 text-amber-300">
              <Zap size={11} fill="currentColor" /> {focusScore}s
            </motion.span>
          )}
        </div>
      </div>

      <div className={clsx('focus-timer-orb relative z-10 flex h-72 w-72 shrink-0 items-center justify-center max-[430px]:scale-[0.84] max-[430px]:-my-5', isActive && 'is-running')}>
        <div className="absolute inset-0 rounded-full border border-white/5" />
        <svg width="288" height="288" className="absolute inset-0 z-10 -rotate-90 transform" aria-hidden>
          <circle
            cx="144"
            cy="144"
            r={TIMER_RADIUS}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="144"
            cy="144"
            r={TIMER_RADIUS}
            stroke={themeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={TIMER_CIRCUMFERENCE}
            animate={{ strokeDashoffset: ringOffset }}
            initial={false}
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]"
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </svg>
        <div className="focus-timer-face absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          <span className="focus-timer-time text-[3.65rem] font-premium-mono font-extrabold leading-none tracking-[-0.03em] text-white sm:text-6xl">
            {formatTime(safeTimeLeft)}
          </span>
          <span className="focus-timer-progress mt-3 text-[10px] font-premium-mono font-bold uppercase tracking-[0.24em] text-white/42">
            {Math.round(progress)}% concluido
          </span>
        </div>
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-3 md:gap-5">
        <div className="grid w-full grid-cols-2 gap-3">
          <button
            onClick={resetTimer}
            className="focus-control-button flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-text-secondary transition-all hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={18} strokeWidth={2} />
            Reiniciar
          </button>

          <button
            onClick={() => { playInteractionFeedback('soft'); setAmbientSound(!ambientSound); }}
            className={clsx(
              'focus-control-button flex h-14 items-center justify-center gap-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all',
              ambientSound ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10 hover:text-white'
            )}
            title="Tocar Lofi"
          >
            {ambientSound ? <Volume2 size={18} strokeWidth={2} /> : <VolumeX size={18} strokeWidth={2} />}
            {ambientSound ? 'Som On' : 'Som Off'}
          </button>
        </div>

        <button
          onClick={handleToggle}
          className={clsx(
            'focus-primary-button flex h-16 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.98]',
            isActive ? 'bg-red-500 text-white shadow-[0_18px_40px_rgba(239,68,68,0.22)]' : 'bg-primary text-black shadow-[0_18px_44px_rgba(var(--hub-primary-rgb),0.24)]'
          )}
        >
          {isActive ? <Pause size={20} strokeWidth={2} fill="currentColor" /> : <Play size={20} strokeWidth={2} fill="currentColor" />}
          {isActive ? 'Pausar' : mode === 'work' ? 'Iniciar foco' : 'Iniciar descanso'}
        </button>
      </div>

      <GlassCard className="relative z-10 w-full max-w-xs space-y-4 p-4">
        <div className="flex justify-between text-xs font-premium-mono font-bold uppercase tracking-widest text-text-secondary">
          <span>Meta diaria</span>
          <span className="text-primary">{currentSession}/{sessionGoal}</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: sessionGoal }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-2 flex-1 rounded-full transition-all',
                i < currentSession - 1 ? 'bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]' :
                i === currentSession - 1 ? 'bg-primary/50 animate-pulse' : 'bg-white/10'
              )}
            />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
