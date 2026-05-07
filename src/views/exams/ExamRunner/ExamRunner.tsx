import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3x3,
  Flag,
  X,
} from 'lucide-react';
import { GlassCard, AnimatedButton } from '../../../components/UI';
import { Exam } from '../shared';
import { useExamStore } from '../../../store/useExamStore';
import { QuestionStatusBadge } from '../../../components/QuestionStatusBadge';
import { useSimuladoSessionStore } from '../../../store/useSimuladoSessionStore';
import { useExamTimer } from '../../../hooks/useExamTimer';
import { clsx } from 'clsx';

interface ExamRunnerProps {
  exam: Exam;
  onFinish: () => void;
  onBack: () => void;
  sessionHint?: string;
}

const TAB_LOCK_KEY = 'studyflow-simulado-tab';

export const ExamRunner = ({ exam, onFinish, onBack, sessionHint }: ExamRunnerProps) => {
  const reduceMotion = useReducedMotion();
  const recordQuestionView = useExamStore((s) => s.recordQuestionView);

  const questions = useSimuladoSessionStore((s) => s.questions);
  const answers = useSimuladoSessionStore((s) => s.answers);
  const currentIndex = useSimuladoSessionStore((s) => s.currentIndex);
  const markedForReview = useSimuladoSessionStore((s) => s.markedForReview);
  const config = useSimuladoSessionStore((s) => s.config);
  const setAnswer = useSimuladoSessionStore((s) => s.setAnswer);
  const setCurrentIndex = useSimuladoSessionStore((s) => s.setCurrentIndex);
  const toggleMarkReview = useSimuladoSessionStore((s) => s.toggleMarkReview);
  const setRemainingSeconds = useSimuladoSessionStore((s) => s.setRemainingSeconds);

  const [mapOpen, setMapOpen] = useState(false);
  const lockChannelRef = useRef<BroadcastChannel | null>(null);

  const qTotal = Math.max(questions.length, 1);
  const qIndex = Math.min(currentIndex, qTotal - 1);
  const q = questions[qIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const initialSeconds = config.timed ? Math.max(60, config.durationMinutes * 60) : 0;
  const timer = useExamTimer({
    enabled: config.timed && initialSeconds > 0,
    initialSeconds,
    pauseOnBlur: config.pauseOnBlur,
    onExpire: () => {
      onFinish();
    },
  });

  useEffect(() => {
    if (!config.timed) {
      setRemainingSeconds(null);
      return;
    }
    setRemainingSeconds(timer.remaining);
  }, [config.timed, timer.remaining, setRemainingSeconds]);

  /** Uma aba “ativa” por vez por prova (avisar se abrir segunda). */
  useEffect(() => {
    const myId = crypto.randomUUID();
    try {
      sessionStorage.setItem(TAB_LOCK_KEY, myId);
      const ch = new BroadcastChannel(`simulado-${exam.id}`);
      lockChannelRef.current = ch;
      ch.postMessage({ type: 'ping', id: myId });
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.type === 'ping' && ev.data.id !== myId) {
          ch.postMessage({ type: 'pong', id: myId });
        }
        if (ev.data?.type === 'pong' && ev.data.id !== myId) {
          console.warn('[FASE-3] Outra aba parece estar com o mesmo simulado aberto.');
        }
      };
      return () => {
        ch.close();
        lockChannelRef.current = null;
      };
    } catch {
      return undefined;
    }
  }, [exam.id]);

  const goPrev = useCallback(() => {
    setCurrentIndex(Math.max(0, qIndex - 1));
  }, [qIndex, setCurrentIndex]);

  const goNext = useCallback(() => {
    if (qIndex < qTotal - 1) setCurrentIndex(qIndex + 1);
  }, [qIndex, qTotal, setCurrentIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMarkReview(qIndex);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (qIndex < qTotal - 1) goNext();
        return;
      }
      const k = e.key.toUpperCase();
      if (k >= 'A' && k <= 'E' && q?.alternativas) {
        const idx = k.charCodeAt(0) - 65;
        if (idx < q.alternativas.length) {
          e.preventDefault();
          recordQuestionView(q.id);
          setAnswer(qIndex, idx);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, qIndex, qTotal, goNext, goPrev, recordQuestionView, setAnswer, toggleMarkReview]);

  const handleFinishClick = () => {
    const unanswered = questions.length - answeredCount;
    if (unanswered > 0) {
      const ok = window.confirm(
        `Faltam ${unanswered} questão(ões) sem resposta. Finalizar mesmo assim?`
      );
      if (!ok) return;
    }
    onFinish();
  };

  if (!q) {
    return (
      <div className="app-shell-premium pt-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-text-secondary text-sm text-center px-6">Carregando questões do simulado…</p>
        <AnimatedButton variant="secondary" onClick={onBack}>
          Voltar
        </AnimatedButton>
      </div>
    );
  }

  const progressPct = ((qIndex + 1) / qTotal) * 100;

  return (
    <div
      className="app-shell-premium pt-4 md:pt-6 pb-32 md:pb-36 flex flex-col min-h-[70vh]"
      onCopy={(e) => config.antiCheat && e.preventDefault()}
    >
      <header className="flex items-center justify-between gap-2 sticky top-0 z-40 bg-background/90 backdrop-blur-md py-3 border-b border-white/5 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary shrink-0"
          aria-label="Voltar"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 min-w-0 text-center px-2">
          <p className="text-[9px] text-primary font-bold uppercase tracking-widest truncate">Simulado</p>
          <p className="text-xs font-bold truncate">{exam.nome}</p>
          {sessionHint ? (
            <p className="text-[9px] text-text-secondary mt-0.5 line-clamp-1">{sessionHint}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {config.timed ? (
            <div
              className={clsx(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-bold',
                timer.remaining < 300 ? 'border-red-500/50 text-red-400' : 'border-white/15 text-white/80'
              )}
            >
              <Clock size={14} />
              {timer.format(timer.remaining)}
            </div>
          ) : (
            <span className="text-[11px] font-mono bg-white/5 px-2 py-1 rounded-full border border-white/10">
              {qIndex + 1}/{qTotal}
            </span>
          )}
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 md:hidden"
            aria-label="Mapa de questões"
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </header>

      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3 shrink-0">
        <motion.div
          className="bg-primary h-full"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="flex flex-1 gap-4 min-h-0 mt-4">
        <aside className="hidden md:flex flex-col w-52 shrink-0 border border-white/10 rounded-2xl bg-white/[0.02] p-3 max-h-[calc(100vh-12rem)] overflow-y-auto no-scrollbar">
          <p className="text-[9px] font-mono uppercase tracking-widest text-white/40 mb-2">Questões</p>
          <div className="grid grid-cols-4 gap-1.5">
            {questions.map((_, i) => {
              const done = answers[i] !== undefined;
              const here = i === qIndex;
              const mark = markedForReview[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={clsx(
                    'aspect-square rounded-lg text-[11px] font-bold border transition-colors',
                    here && 'ring-2 ring-primary border-primary',
                    done && !here && 'bg-primary/20 border-primary/30 text-primary',
                    !done && !here && 'bg-white/5 border-white/10 text-white/50',
                    mark && 'ring-1 ring-amber-400/60'
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-white/30 mt-3 leading-relaxed">
            Atalhos: A–E responder · ← → navegar · Enter próxima · M marcar revisão
          </p>
        </aside>

        <div className="flex-1 min-w-0 space-y-4">
          <GlassCard className="p-5 md:p-6 space-y-5 border-white/10">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                Questão {qIndex + 1} de {qTotal}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <QuestionStatusBadge questionId={q.id} compact />
                <span className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-text-secondary">{q.materia}</span>
                <button
                  type="button"
                  onClick={() => toggleMarkReview(qIndex)}
                  className={clsx(
                    'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border flex items-center gap-1',
                    markedForReview[qIndex]
                      ? 'border-amber-400/50 text-amber-300 bg-amber-500/10'
                      : 'border-white/10 text-white/45'
                  )}
                >
                  <Flag size={12} />
                  Revisar
                </button>
              </div>
            </div>

            <p className="text-sm md:text-base font-medium leading-relaxed">{q.pergunta}</p>

            <div className="space-y-2.5">
              {q.alternativas.map((opt: string, i: number) => {
                const isSelected = answers[qIndex] === i;
                const isCorrect = config.showGabaritoDuring && i === q.resposta;
                const isWrongSel = config.showGabaritoDuring && isSelected && i !== q.resposta;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      recordQuestionView(q.id);
                      setAnswer(qIndex, i);
                    }}
                    className={clsx(
                      'w-full p-3.5 md:p-4 rounded-2xl text-left transition-all flex gap-3 items-start border',
                      isSelected && !config.showGabaritoDuring && 'bg-primary/10 border-primary text-primary',
                      !isSelected && !isCorrect && 'bg-white/5 border-white/10 hover:border-primary/40 text-white',
                      isCorrect && 'border-primary bg-primary/15',
                      isWrongSel && 'border-red-500/40 bg-red-500/10'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                        isSelected ? 'bg-primary text-black' : 'bg-white/5'
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm leading-snug pt-1">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          <div className="flex gap-2">
            <AnimatedButton
              variant="secondary"
              onClick={goPrev}
              disabled={qIndex <= 0}
              className="flex-1 py-3.5 text-xs font-bold uppercase tracking-widest"
            >
              <ChevronLeft size={16} className="inline mr-1" />
              Anterior
            </AnimatedButton>
            {qIndex < qTotal - 1 ? (
              <AnimatedButton
                onClick={goNext}
                className="flex-1 py-3.5 text-xs font-bold uppercase tracking-widest"
                glow
              >
                Próxima
                <ChevronRight size={16} className="inline ml-1" />
              </AnimatedButton>
            ) : (
              <AnimatedButton
                onClick={handleFinishClick}
                className="flex-1 py-3.5 text-xs font-bold uppercase tracking-widest bg-primary text-black border-primary"
                glow
              >
                Finalizar
              </AnimatedButton>
            )}
          </div>

          <AnimatedButton
            variant="secondary"
            onClick={handleFinishClick}
            className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border-white/10 text-white/50"
          >
            Finalizar simulado agora
          </AnimatedButton>
        </div>
      </div>

      {mapOpen && (
        <div className="fixed inset-0 z-[100] md:hidden bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#0a0f0d] border-t border-white/10 rounded-t-3xl p-4 max-h-[55vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold">Mapa de questões</p>
              <button type="button" onClick={() => setMapOpen(false)} className="p-2 rounded-xl bg-white/5" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(i);
                    setMapOpen(false);
                  }}
                  className={clsx(
                    'aspect-square rounded-xl text-xs font-bold border',
                    i === qIndex && 'ring-2 ring-primary',
                    answers[i] !== undefined ? 'bg-primary/20 border-primary/30' : 'bg-white/5 border-white/10'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
