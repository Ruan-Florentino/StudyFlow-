import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import {
  recordQuestionAttemptsBatch,
  bumpStreakForActivity,
  recordExamRun,
  type RecordQuestionAttemptBatchItem,
} from '../../lib/persistence';
import { useAllQuestions } from '../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../components/shared/QuestionsLoadError';
import { ExamsHub, ExamCreator, ExamRunner, ExamResults, ExamReview, ExamHistory, Exam } from './index';
import type { ExamsHubFilterTab } from './ExamsHub/ExamsHub';
import { ChevronLeft, Brain, Clock, Shuffle, Eye, SkipForward, Monitor } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatedButton } from '../../components/UI';
import {
  pickStrategicTrainingSession,
  STRATEGIC_TRAINING_EXAM,
  STRATEGIC_TRAINING_EXAM_ID,
} from '../../lib/strategicTrainingPick';
import {
  useSimuladoSessionStore,
  DEFAULT_SIMULADO_CONFIG,
  type SimuladoConfig,
} from '../../store/useSimuladoSessionStore';
import type { Question } from '../../data/types';

let lastStrategicBootstrapAt = 0;
const STRATEGIC_DEBOUNCE_MS = 1200;

const FILTRO_QUERY_TO_TAB: Record<string, ExamsHubFilterTab> = {
  todos: 'all',
  vestibulares: 'vestibular',
  concursos: 'concurso',
  proximos: 'upcoming',
  favoritos: 'favorites',
};

const TAB_TO_FILTRO_QUERY: Record<ExamsHubFilterTab, string | null> = {
  all: null,
  vestibular: 'vestibulares',
  concurso: 'concursos',
  upcoming: 'proximos',
  favorites: 'favoritos',
};

function hubFilterFromSearchParams(sp: URLSearchParams): ExamsHubFilterTab {
  const key = sp.get('filtro')?.toLowerCase().trim();
  if (key && key in FILTRO_QUERY_TO_TAB) return FILTRO_QUERY_TO_TAB[key];
  return 'all';
}

function shuffleQuestions<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ExamsView = () => {
  const { questions: ALL_QUESTIONS, loading: qLoading, error: qError } = useAllQuestions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { examId: examIdParam } = useParams<{ examId?: string }>();
  const exams = useStore((s) => s.exams);

  const [searchParams, setSearchParams] = useSearchParams();
  const hubFilter = useMemo(() => hubFilterFromSearchParams(searchParams), [searchParams]);

  const handleHubFilterChange = (next: ExamsHubFilterTab) => {
    const q = TAB_TO_FILTRO_QUERY[next];
    if (q == null) setSearchParams({}, { replace: true });
    else setSearchParams({ filtro: q }, { replace: true });
  };

  const [view, setView] = useState<'list' | 'plan' | 'simulado' | 'history'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [simStep, setSimStep] = useState<'setup' | 'runner' | 'results' | 'review'>('setup');
  const [loading, setLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState('IA Montando Simulado Estratégico...');
  const [strategicMentorNote, setStrategicMentorNote] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [localConfig, setLocalConfig] = useState<SimuladoConfig>({ ...DEFAULT_SIMULADO_CONFIG });

  const sessionQuestions = useSimuladoSessionStore((s) => s.questions);
  const sessionAnswers = useSimuladoSessionStore((s) => s.answers);
  const setSessionExamId = useSimuladoSessionStore((s) => s.setExamId);
  const setSessionQuestions = useSimuladoSessionStore((s) => s.setQuestions);
  const prepareNewRun = useSimuladoSessionStore((s) => s.prepareNewRun);
  const setSessionConfig = useSimuladoSessionStore((s) => s.setConfig);
  const setStrategicNoteStore = useSimuladoSessionStore((s) => s.setStrategicNote);
  const strategicMentorNoteStore = useSimuladoSessionStore((s) => s.strategicMentorNote);

  const syncRouteToSimulado = useCallback(() => {
    if (!examIdParam) return;
    const ex = exams.find((e) => e.id === examIdParam);
    if (!ex) {
      navigate('/simulados', { replace: true });
      return;
    }
    setSelectedExam(ex);
    setView('simulado');
    const path = location.pathname;
    if (path.endsWith('/result')) {
      setSimStep('results');
    } else if (path.endsWith('/run')) {
      setSimStep('runner');
    } else {
      setSimStep('setup');
    }
  }, [examIdParam, exams, location.pathname, navigate]);

  useEffect(() => {
    if (!examIdParam) return;
    syncRouteToSimulado();
  }, [examIdParam, syncRouteToSimulado]);

  useEffect(() => {
    const treino = searchParams.get('treino');
    if (treino !== 'estrategico' || !ALL_QUESTIONS?.length) return;

    const now = Date.now();
    if (now - lastStrategicBootstrapAt < STRATEGIC_DEBOUNCE_MS) return;
    lastStrategicBootstrapAt = now;

    setSearchParams(
      (prev) => {
        const n = new URLSearchParams(prev);
        n.delete('treino');
        return n;
      },
      { replace: true }
    );

    void (async () => {
      setLoading(true);
      setLoadingHint('Analisando seu histórico e montando treino com a IA…');
      setStrategicMentorNote(null);

      const snapHistory = useStore.getState().history;

      try {
        const { questions: picked, mentorNote } = await pickStrategicTrainingSession(ALL_QUESTIONS, snapHistory);
        if (picked.length === 0) throw new Error('empty');
        setSessionExamId(STRATEGIC_TRAINING_EXAM_ID);
        prepareNewRun();
        setSessionConfig({ ...DEFAULT_SIMULADO_CONFIG, shuffle: false, timed: false });
        setSessionQuestions(picked);
        setStrategicNoteStore(mentorNote ?? null);
        setStrategicMentorNote(mentorNote ?? null);
        setSelectedExam(STRATEGIC_TRAINING_EXAM);
        setView('simulado');
        setSimStep('runner');
        navigate(`/simulados/${STRATEGIC_TRAINING_EXAM_ID}/run`, { replace: true });
      } catch {
        lastStrategicBootstrapAt = 0;
        navigate('/simulados', { replace: true });
      } finally {
        setLoading(false);
        setLoadingHint('IA Montando Simulado Estratégico...');
      }
    })();
  }, [searchParams, ALL_QUESTIONS, setSearchParams, navigate, setSessionExamId, prepareNewRun, setSessionConfig, setSessionQuestions, setStrategicNoteStore]);

  useEffect(() => {
    if (view === 'list') {
      setStrategicMentorNote(null);
    }
  }, [view]);

  const handleSelectExam = (exam: Exam, targetView: 'plan' | 'simulado') => {
    setStrategicMentorNote(null);
    if (targetView === 'simulado') {
      navigate(`/simulados/${exam.id}`);
      return;
    }
    setSelectedExam(exam);
    setView('plan');
  };

  const startSimulado = async () => {
    if (!selectedExam || !ALL_QUESTIONS) return;
    setStrategicMentorNote(null);
    setLoading(true);
    try {
      const provaKey = selectedExam.provaTag ?? selectedExam.nome;
      let filtered = ALL_QUESTIONS.filter((q) => q && q.prova === provaKey);
      if (selectedTopics.length > 0) {
        filtered = filtered.filter(
          (q) => selectedTopics.includes(q.assunto) || selectedTopics.includes(q.materia)
        );
      }
      const res =
        filtered.length > 0
          ? filtered
          : ALL_QUESTIONS.filter((q) => q && selectedExam.materias.includes(q.materia)).slice(0, 40);
      let list: Question[] = res;
      if (localConfig.shuffle) list = shuffleQuestions(list);
      const shuffled = list.slice(0, 15);

      setSessionExamId(selectedExam.id);
      prepareNewRun();
      setSessionConfig(localConfig);
      setSessionQuestions(shuffled);
      setStrategicNoteStore(null);
      setSimStep('runner');
      navigate(`/simulados/${selectedExam.id}/run`, { replace: true });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finishSimulado = () => {
    void (async () => {
      const uid = user?.id ?? null;
      const questions = useSimuladoSessionStore.getState().questions;
      const answers = useSimuladoSessionStore.getState().answers;
      const items: RecordQuestionAttemptBatchItem[] = [];
      let correct = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (answers[i] === undefined) continue;
        const isCorrect = answers[i] === q.resposta;
        if (isCorrect) correct++;
        items.push({
          question: q,
          userAnswer: answers[i]!,
          isCorrect,
          timeSpentSeconds: 30,
        });
      }
      await recordQuestionAttemptsBatch(uid, items, {
        xpAwardTotal: correct * 50,
        skipStreak: true,
      });
      await bumpStreakForActivity(uid);
      if (selectedExam) {
        await recordExamRun({
          userId: uid,
          examId: selectedExam.id,
          examName: selectedExam.nome,
          correctCount: correct,
          totalCount: items.length,
          meta: { source: 'simulado' },
        });
      }
      setSimStep('results');
      if (selectedExam) {
        navigate(`/simulados/${selectedExam.id}/result`, { replace: true });
      }
    })();
  };

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  if (view === 'history') {
    return (
      <ExamHistory
        onBack={() => {
          setView('list');
          navigate('/simulados');
        }}
      />
    );
  }

  if (view === 'plan' && selectedExam) {
    return <ExamCreator exam={selectedExam} onBack={() => setView('list')} />;
  }

  if (view === 'simulado' && selectedExam) {
    if (loading) {
      return (
        <div className="app-shell-premium pt-6 md:pt-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-primary font-bold animate-pulse text-center px-4">{loadingHint}</p>
        </div>
      );
    }

    if (simStep === 'setup') {
      return (
        <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36">
          <header className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/simulados')}
              className="p-2 bg-white/5 rounded-xl border border-white/10"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-premium-title italic">Iniciar simulado</h2>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">{selectedExam.nome}</p>
            </div>
          </header>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 text-sm text-white/70">
              <p>
                <span className="text-primary font-bold">15</span> questões · tempo estimado{' '}
                {localConfig.timed ? `${localConfig.durationMinutes} min` : 'livre'}
              </p>
              <p className="text-xs text-text-secondary">Áreas: {(selectedExam.materias || []).join(', ')}</p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">
                Focar em matérias (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedExam.materias.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      setSelectedTopics((prev) => (prev.includes(m) ? prev.filter((t) => t !== m) : [...prev, m]))
                    }
                    className={clsx(
                      'px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all',
                      selectedTopics.includes(m)
                        ? 'bg-primary text-black border-primary'
                        : 'bg-white/5 text-text-secondary border-white/10'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <ToggleRow
                icon={Clock}
                label="Modo cronometrado"
                active={localConfig.timed}
                onClick={() => setLocalConfig((c) => ({ ...c, timed: !c.timed }))}
              />
              <ToggleRow
                icon={Eye}
                label="Mostrar gabarito ao responder"
                active={localConfig.showGabaritoDuring}
                onClick={() => setLocalConfig((c) => ({ ...c, showGabaritoDuring: !c.showGabaritoDuring }))}
              />
              <ToggleRow
                icon={SkipForward}
                label="Permitir pular / navegar"
                active={localConfig.allowSkip}
                onClick={() => setLocalConfig((c) => ({ ...c, allowSkip: !c.allowSkip }))}
              />
              <ToggleRow
                icon={Shuffle}
                label="Embaralhar questões"
                active={localConfig.shuffle}
                onClick={() => setLocalConfig((c) => ({ ...c, shuffle: !c.shuffle }))}
              />
              <ToggleRow
                icon={Monitor}
                label="Pausar ao sair da aba"
                active={localConfig.pauseOnBlur}
                onClick={() => setLocalConfig((c) => ({ ...c, pauseOnBlur: !c.pauseOnBlur }))}
              />
              <ToggleRow
                icon={Brain}
                label="Anti-cola (bloquear copiar)"
                active={localConfig.antiCheat}
                onClick={() => setLocalConfig((c) => ({ ...c, antiCheat: !c.antiCheat }))}
              />
            </div>

            {localConfig.timed && (
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-mono uppercase text-white/40">Duração (min)</label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={localConfig.durationMinutes}
                  onChange={(e) =>
                    setLocalConfig((c) => ({ ...c, durationMinutes: Number(e.target.value) || 50 }))
                  }
                  className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Brain size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">
                    Banco de questões
                  </p>
                  <p className="text-sm font-bold text-white">Até 15 questões da prova selecionada</p>
                </div>
              </div>
            </div>

            <AnimatedButton
              onClick={() => void startSimulado()}
              className="w-full py-5 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]"
              glow
            >
              Começar
            </AnimatedButton>
          </div>
        </div>
      );
    }

    if (simStep === 'runner') {
      if (
        location.pathname.endsWith('/run') &&
        sessionQuestions.length === 0 &&
        selectedExam.id !== STRATEGIC_TRAINING_EXAM_ID
      ) {
        return (
          <div className="app-shell-premium pt-6 flex flex-col items-center gap-4 min-h-[50vh] justify-center px-4">
            <p className="text-text-secondary text-sm text-center">
              Sessão não encontrada ou expirada. Configure de novo o simulado.
            </p>
            <AnimatedButton variant="secondary" onClick={() => navigate(`/simulados/${selectedExam.id}`)}>
              Voltar ao início
            </AnimatedButton>
          </div>
        );
      }
      return (
        <ExamRunner
          exam={selectedExam}
          onFinish={finishSimulado}
          onBack={() => {
            if (selectedExam.id === STRATEGIC_TRAINING_EXAM_ID) {
              navigate('/simulados');
              setView('list');
              setSelectedExam(null);
              return;
            }
            navigate(`/simulados/${selectedExam.id}`);
          }}
          sessionHint={strategicMentorNote ?? strategicMentorNoteStore ?? undefined}
        />
      );
    }

    if (simStep === 'results') {
      if (sessionQuestions.length === 0) {
        return (
          <div className="app-shell-premium pt-6 flex flex-col items-center gap-4 min-h-[50vh] justify-center px-4">
            <p className="text-text-secondary text-sm text-center">
              Não há resultado para exibir (sessão vazia ou expirada). Volte e inicie o simulado de novo.
            </p>
            <AnimatedButton variant="secondary" onClick={() => navigate(`/simulados/${selectedExam.id}`)}>
              Voltar ao simulado
            </AnimatedButton>
          </div>
        );
      }
      return (
        <ExamResults
          exam={selectedExam}
          questions={sessionQuestions}
          answers={sessionAnswers}
          onReview={() => setSimStep('review')}
          onClose={() => {
            useSimuladoSessionStore.getState().reset();
            navigate('/simulados');
            setView('list');
            setSelectedExam(null);
          }}
        />
      );
    }

    if (simStep === 'review') {
      return (
        <ExamReview
          questions={sessionQuestions}
          answers={sessionAnswers}
          onBack={() => {
            setSimStep('results');
            if (selectedExam) navigate(`/simulados/${selectedExam.id}/result`, { replace: true });
          }}
        />
      );
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-8 right-8 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setView('history');
            navigate('/simulados');
          }}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors"
        >
          Histórico
        </button>
      </div>
      <ExamsHub onSelectExam={handleSelectExam} filter={hubFilter} onFilterChange={handleHubFilterChange} />
    </div>
  );
};

function ToggleRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors',
        active ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      )}
    >
      <Icon size={18} className={active ? 'text-primary' : 'text-text-secondary'} />
      <span className="text-xs font-bold text-white/90">{label}</span>
      <span
        className={clsx(
          'ml-auto text-[10px] font-mono uppercase',
          active ? 'text-primary' : 'text-white/35'
        )}
      >
        {active ? 'Sim' : 'Não'}
      </span>
    </button>
  );
}
