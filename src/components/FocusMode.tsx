import React, { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  BarChart3, Check, ChevronLeft, Clock3, Coffee, Flame, Focus, History,
  Pause, Play, RotateCcw, Settings2, ShieldCheck, Sparkles, Square, Target,
  Volume2, VolumeX, Waves, X, Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../store';
import { useSessionStore } from '../store/useSessionStore';
import { useUserStore } from '../store/useUserStore';
import { addXpRemote, calendarDayLocal, recordStudySession } from '../lib/persistence';
import { playInteractionFeedback } from '../lib/feedback';
import { triggerConfetti } from '../lib/studyUtils';
import { useFocusTimer, type CompletedFocusSession, type FocusSound } from '../hooks/useFocusTimer';
import { useAmbientSound } from '../hooks/useAmbientSound';
import { AnimatedButton, Badge, GlassCard, cn } from './UI';

const TIMER_RADIUS = 132;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;
const QUICK_SESSIONS = [10, 15, 25, 30, 45, 60];

const SOUNDS: Array<{ id: FocusSound; label: string; detail: string }> = [
  { id: 'silence', label: 'Silencio', detail: 'Sem audio' },
  { id: 'rain', label: 'Chuva', detail: 'Suave e constante' },
  { id: 'forest', label: 'Floresta', detail: 'Ruido natural' },
  { id: 'whiteNoise', label: 'Ruido branco', detail: 'Mascara distracoes' },
  { id: 'cafe', label: 'Cafeteria', detail: 'Ambiente discreto' },
  { id: 'lofi', label: 'Lo-fi', detail: 'Acordes leves' },
];

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return String(minutes).padStart(2, '0') + ':' + String(remaining).padStart(2, '0');
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return minutes + ' min';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? hours + 'h ' + rest + 'min' : hours + 'h';
}

function dayTimestamp(date: string) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date + 'T12:00:00') : new Date(date);
  return Number.isFinite(parsed.getTime()) ? parsed.getTime() : 0;
}

function FocusSettingsModal({
  focusMinutes,
  breakMinutes,
  longBreakMinutes,
  onSave,
  onClose,
}: {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  onSave: (focus: number, shortBreak: number, longBreak: number) => void;
  onClose: () => void;
}) {
  const [focus, setFocus] = useState(focusMinutes);
  const [shortBreak, setShortBreak] = useState(breakMinutes);
  const [longBreak, setLongBreak] = useState(longBreakMinutes);

  return (
    <motion.div
      className="fixed inset-0 z-[190] flex items-end justify-center bg-black/75 p-3 backdrop-blur-md sm:items-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-labelledby="focus-settings-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
        className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#0b0d0c] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div><Badge variant="primary">Personalizar</Badge><h2 id="focus-settings-title" className="mt-3 text-2xl font-premium-title text-white">Ciclo de foco</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60"><X size={18} /></button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            ['Foco', focus, setFocus, 180],
            ['Pausa', shortBreak, setShortBreak, 60],
            ['Pausa longa', longBreak, setLongBreak, 90],
          ].map(([label, value, setter, max]) => (
            <label key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3">
              <span className="block min-h-8 text-[9px] font-black uppercase tracking-[0.12em] text-white/45">{String(label)}</span>
              <input
                type="number" min={1} max={Number(max)} value={Number(value)}
                onChange={(event) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value))}
                className="mt-2 w-full bg-transparent text-xl font-black text-white outline-none"
              />
              <span className="text-[9px] text-white/35">minutos</span>
            </label>
          ))}
        </div>
        <AnimatedButton onClick={() => { onSave(focus, shortBreak, longBreak); onClose(); }} className="mt-5 w-full"><Check size={17} /> Salvar ciclo</AnimatedButton>
      </motion.div>
    </motion.div>
  );
}

function ConfirmExitModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-[24px] border border-white/10 bg-[#0b0d0c] p-6 text-center" initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }}>
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><ShieldCheck size={25} /></div>
        <h2 className="mt-4 text-xl font-premium-title text-white">Sair do Deep Focus?</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">O relogio sera pausado para proteger o tempo ja conquistado.</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <AnimatedButton variant="secondary" onClick={onLeave}>Sair</AnimatedButton>
          <AnimatedButton onClick={onStay}>Continuar</AnimatedButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const FocusMode = ({ onBack }: { onBack: () => void }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const userId = useUserStore((state) => state.userId);
  const addXP = useUserStore((state) => state.addXP);
  const dailyGoalMinutes = useUserStore((state) => state.dailyGoalMinutes);
  const sessions = useSessionStore((state) => state.sessions);
  const toggleAppBlocker = useSessionStore((state) => state.toggleAppBlocker);
  const [showSettings, setShowSettings] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);

  const focusSessions = useMemo(
    () => sessions.filter((session) => session.subject.toLowerCase().includes('foco')),
    [sessions]
  );

  const completeFocus = useCallback((completed: CompletedFocusSession) => {
    void recordStudySession({
      userId,
      startedAt: completed.startedAt,
      endedAt: completed.endedAt,
      activityType: 'focus',
      subject: 'Sessao de Foco',
    });
    addXP(25);
    if (userId) void addXpRemote(userId, 25);
    playInteractionFeedback('complete');
    triggerConfetti();

    const totalAfter = focusSessions.length + 1;
    const unlocked = totalAfter === 1 ? 'Primeira sessao concluida' : totalAfter === 10 ? '10 sessoes de foco' : null;
    if (unlocked) {
      setAchievement(unlocked);
      const id = totalAfter === 1 ? 'focus-first-session' : 'focus-ten-sessions';
      useUserStore.setState((state) => state.achievements.some((item) => item.id === id)
        ? state
        : { achievements: [...state.achievements, { id, title: unlocked, description: 'Conquista obtida no Modo Foco.', icon: 'focus', unlocked: true }] });
    }

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('Sessão concluída', {
        body: 'Você ganhou 25 XP. Hora de respirar.',
        icon: '/icons/icon-192.png',
        badge: '/icons/favicon-48.png',
      });
    }
  }, [addXP, focusSessions.length, userId]);

  const { snapshot, toggle, reset, finish, chooseQuickSession, updateDurations, updatePreferences } = useFocusTimer(completeFocus);
  const { phase, timeLeft, durationSeconds, isRunning, sessionNumber, selectedSound, soundEnabled, volume, deepFocus } = snapshot;

  useAmbientSound(selectedSound, soundEnabled && isRunning && phase === 'focus', volume);

  React.useEffect(() => {
    toggleAppBlocker(isRunning && phase === 'focus');
    return () => toggleAppBlocker(false);
  }, [isRunning, phase, toggleAppBlocker]);

  const today = calendarDayLocal(new Date());
  const now = Date.now();
  const todaySessions = useMemo(() => focusSessions.filter((session) => session.date === today), [focusSessions, today]);
  const focusedToday = todaySessions.reduce((total, session) => total + session.duration, 0);
  const focusedWeek = focusSessions.filter((session) => now - dayTimestamp(session.date) <= 7 * 86_400_000).reduce((total, session) => total + session.duration, 0);
  const focusedMonth = focusSessions.filter((session) => now - dayTimestamp(session.date) <= 30 * 86_400_000).reduce((total, session) => total + session.duration, 0);
  const goalProgress = Math.min(100, Math.round((focusedToday / Math.max(1, dailyGoalMinutes)) * 100));
  const progress = Math.min(100, Math.max(0, ((durationSeconds - timeLeft) / Math.max(1, durationSeconds)) * 100));
  const ringOffset = TIMER_CIRCUMFERENCE * (1 - progress / 100);
  const elapsed = Math.max(0, durationSeconds - timeLeft);
  const phaseLabel = phase === 'focus' ? 'Foco' : phase === 'longBreak' ? 'Pausa longa' : 'Pausa curta';

  const handleToggle = () => {
    playInteractionFeedback(isRunning ? 'focusPause' : 'focusStart');
    if (!isRunning && phase === 'focus') useStore.getState().trackFeature('pomodoro');
    toggle();
  };

  const handleBack = () => {
    if (deepFocus && isRunning) {
      setShowExitConfirm(true);
      return;
    }
    onBack();
  };

  const leaveDeepFocus = () => {
    if (isRunning) toggle();
    updatePreferences({ deepFocus: false });
    setShowExitConfirm(false);
    onBack();
  };

  return (
    <div className={clsx(
      'studyflow-focus-mode app-shell-premium relative min-h-screen overflow-hidden pb-36 pt-5 transition-colors md:pt-8',
      deepFocus && 'fixed inset-0 z-[150] overflow-y-auto bg-[#030504] px-4 pb-8'
    )}>
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={reduceMotion || !isRunning ? { opacity: 0.24 } : { opacity: [0.2, 0.38, 0.2], scale: [0.96, 1.05, 0.96] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[28rem] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[110px]"
        />
      </div>

      <div className={cn('relative z-10 mx-auto w-full max-w-5xl', deepFocus && 'max-w-3xl')}>
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <AnimatedButton onClick={handleBack} variant="secondary" className="size-11 shrink-0 p-0" aria-label="Voltar"><ChevronLeft size={20} /></AnimatedButton>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-primary">{deepFocus ? 'Deep Focus ativo' : 'Produtividade'}</p>
              <h1 className="mt-1 text-2xl font-premium-title text-white sm:text-3xl">Modo Foco</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!deepFocus ? (
              <button type="button" onClick={() => setShowSettings(true)} aria-label="Configurar foco" className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/55 transition hover:border-primary/25 hover:text-primary"><Settings2 size={18} /></button>
            ) : null}
            <Badge variant={isRunning ? 'primary' : 'secondary'}>{isRunning ? 'Em andamento' : 'Pronto'}</Badge>
          </div>
        </header>

        {!deepFocus ? (
          <section className="mt-5 grid grid-cols-3 gap-2">
            {[
              [Flame, String(sessionNumber) + '/4', 'ciclo'],
              [TargetIcon, goalProgress + '%', 'meta diaria'],
              [Zap, String(todaySessions.length * 25), 'XP de foco'],
            ].map(([Icon, value, label]) => {
              const StatIcon = Icon as typeof Zap;
              return (
                <div key={String(label)} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
                  <StatIcon size={15} className="mb-2 text-primary" />
                  <p className="text-base font-black text-white">{String(value)}</p>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-white/40">{String(label)}</p>
                </div>
              );
            })}
          </section>
        ) : null}

        <main className={cn('mt-7 flex flex-col items-center', deepFocus && 'mt-10 sm:mt-16')}>
          <AnimatePresence mode="wait">
            <motion.div key={phase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center">
              <Badge variant={phase === 'focus' ? 'primary' : 'secondary'}>{phaseLabel}</Badge>
              <h2 className="mt-3 text-2xl font-premium-title text-white sm:text-3xl">{phase === 'focus' ? 'Proteja este bloco.' : 'Respire. O proximo ciclo vem depois.'}</h2>
              <p className="mt-2 text-xs text-white/40">Sessao {sessionNumber} de 4</p>
            </motion.div>
          </AnimatePresence>

          <div className={clsx('focus-timer-orb relative mt-7 flex size-[min(19rem,82vw)] items-center justify-center', isRunning && 'is-running')}>
            <svg viewBox="0 0 288 288" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
              <circle cx="144" cy="144" r={TIMER_RADIUS} stroke="rgba(255,255,255,0.055)" strokeWidth="5" fill="transparent" />
              <motion.circle
                cx="144" cy="144" r={TIMER_RADIUS} stroke="var(--hub-primary)" strokeWidth="7" fill="transparent"
                strokeDasharray={TIMER_CIRCUMFERENCE} animate={{ strokeDashoffset: ringOffset }} initial={false}
                strokeLinecap="round" transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                className="drop-shadow-[0_0_13px_rgba(var(--hub-primary-rgb),0.35)]"
              />
            </svg>
            <div className="focus-timer-face absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span key={formatTime(timeLeft)} className="font-premium-mono text-[3.55rem] font-black leading-none text-white sm:text-6xl">
                {formatTime(timeLeft)}
              </motion.span>
              <span className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{Math.round(progress)}% concluido</span>
            </div>
          </div>

          <div className="mt-7 w-full max-w-md">
            {!deepFocus && phase === 'focus' && !isRunning ? (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_SESSIONS.map((minutes) => (
                  <button key={minutes} type="button" onClick={() => chooseQuickSession(minutes)}
                    className={cn('min-h-10 min-w-14 rounded-xl border px-3 text-xs font-black transition', snapshot.focusMinutes === minutes ? 'border-primary/35 bg-primary/10 text-primary' : 'border-white/[0.08] bg-white/[0.03] text-white/45 hover:text-white')}>
                    {minutes}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] gap-2">
              <button type="button" onClick={() => { playInteractionFeedback('tap'); reset(); }} aria-label="Reiniciar" className="focus-control-button flex size-[3.25rem] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-white/55"><RotateCcw size={18} /></button>
              <button type="button" onClick={handleToggle} className={cn('focus-primary-button flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl text-sm font-black transition active:scale-[0.98]', isRunning ? 'border border-white/10 bg-white/[0.08] text-white' : 'bg-primary text-black shadow-[0_16px_44px_rgba(var(--hub-primary-rgb),0.22)]')}>
                {isRunning ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
                {isRunning ? 'Pausar' : phase === 'focus' ? 'Iniciar foco' : 'Iniciar pausa'}
              </button>
              <button type="button" onClick={() => { playInteractionFeedback('soft'); updatePreferences({ soundEnabled: !soundEnabled }); }} aria-label={soundEnabled ? 'Desativar sons' : 'Ativar sons'} className={cn('focus-control-button flex size-[3.25rem] items-center justify-center rounded-2xl border', soundEnabled ? 'border-primary/25 bg-primary/[0.08] text-primary' : 'border-white/10 bg-white/[0.045] text-white/45')}>
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => updatePreferences({ deepFocus: !deepFocus })} className={cn('min-h-12 rounded-2xl border text-[10px] font-black uppercase tracking-[0.12em] transition', deepFocus ? 'border-primary/35 bg-primary/10 text-primary' : 'border-white/[0.08] bg-white/[0.03] text-white/55 hover:text-white')}>
                <Focus size={15} className="mr-2 inline" />Deep Focus
              </button>
              <button type="button" disabled={phase === 'focus' && elapsed < 1} onClick={() => { playInteractionFeedback('complete'); finish(); }} className="min-h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35">
                <Square size={14} className="mr-2 inline" />Finalizar
              </button>
            </div>
          </div>

          {deepFocus ? <p className="mt-6 max-w-sm text-center text-xs leading-relaxed text-white/35">Voce esta em Deep Focus. A interface fica protegida ate pausar ou finalizar a sessao.</p> : null}
        </main>

        {!deepFocus ? (
          <>
            <section className="mt-9 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                [Clock3, formatMinutes(focusedToday), 'Hoje'],
                [BarChart3, formatMinutes(focusedWeek), '7 dias'],
                [History, formatMinutes(focusedMonth), '30 dias'],
                [Sparkles, String(todaySessions.length), 'Sessoes'],
              ].map(([Icon, value, label]) => {
                const StatIcon = Icon as typeof Clock3;
                return (
                  <GlassCard key={String(label)} enterAnimation={false} className="border-white/[0.07] p-4">
                    <StatIcon size={17} className="text-primary" />
                    <p className="mt-3 text-lg font-black text-white">{String(value)}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/40">{String(label)}</p>
                  </GlassCard>
                );
              })}
            </section>

            <section className="mt-7 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <GlassCard enterAnimation={false} className="border-white/[0.07] p-5">
                <div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-primary">Ambiente</p><h3 className="mt-1 text-lg font-premium-title text-white">Som de concentracao</h3></div><Waves size={20} className="text-primary" /></div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SOUNDS.map((sound) => (
                    <button key={sound.id} type="button" onClick={() => updatePreferences({ selectedSound: sound.id, soundEnabled: true })}
                      className={cn('rounded-2xl border p-3 text-left transition', selectedSound === sound.id ? 'border-primary/30 bg-primary/[0.08]' : 'border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.05]')}>
                      <p className={cn('text-xs font-black', selectedSound === sound.id ? 'text-primary' : 'text-white')}>{sound.label}</p>
                      <p className="mt-1 text-[9px] text-white/35">{sound.detail}</p>
                    </button>
                  ))}
                </div>
                <label className="mt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                  <Volume2 size={15} />
                  <input type="range" min={0} max={100} value={volume} onChange={(event) => updatePreferences({ volume: Number(event.target.value) })} className="h-1 flex-1 accent-[var(--hub-primary)]" />
                  {volume}%
                </label>
              </GlassCard>

              <GlassCard enterAnimation={false} className="border-white/[0.07] p-5">
                <div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-primary">Historico</p><h3 className="mt-1 text-lg font-premium-title text-white">Ultimas sessoes</h3></div><History size={20} className="text-primary" /></div>
                <div className="mt-4 space-y-2">
                  {focusSessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center"><Coffee size={20} className="mx-auto text-white/25" /><p className="mt-2 text-xs text-white/40">Sua primeira sessao aparecera aqui.</p></div>
                  ) : focusSessions.slice(0, 4).map((session) => (
                    <div key={session.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Check size={16} /></div>
                      <div className="min-w-0 flex-1"><p className="text-xs font-black text-white">{formatMinutes(session.duration)} focados</p><p className="mt-1 text-[9px] text-white/35">{session.date}</p></div>
                      <span className="text-[10px] font-black text-primary">+25 XP</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {showSettings ? <FocusSettingsModal focusMinutes={snapshot.focusMinutes} breakMinutes={snapshot.breakMinutes} longBreakMinutes={snapshot.longBreakMinutes} onSave={updateDurations} onClose={() => setShowSettings(false)} /> : null}
        {showExitConfirm ? <ConfirmExitModal onStay={() => setShowExitConfirm(false)} onLeave={leaveDeepFocus} /> : null}
        {achievement ? (
          <motion.div className="fixed inset-x-4 top-5 z-[210] mx-auto max-w-sm rounded-[22px] border border-amber-300/25 bg-[#14130d]/95 p-4 shadow-2xl backdrop-blur-2xl" initial={{ opacity: 0, y: -24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}>
            <button type="button" onClick={() => setAchievement(null)} aria-label="Fechar conquista" className="absolute right-3 top-3 text-white/40"><X size={16} /></button>
            <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200"><Sparkles size={22} /></div><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">Conquista liberada</p><p className="mt-1 text-sm font-black text-white">{achievement}</p></div></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const TargetIcon = Target;
