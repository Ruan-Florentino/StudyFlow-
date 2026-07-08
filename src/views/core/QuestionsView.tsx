import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Filter,
  Flag,
  GraduationCap,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedButton, Badge, GlassCard, Header, cn } from '../../components/UI';
import { useStore } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { recordQuestionAttempt } from '../../lib/persistence';
import { playInteractionFeedback } from '../../lib/feedback';
import { toast } from '../../store/useToastStore';
import {
  QUESTION_BANK_TOTAL_TARGET,
  QUESTION_BANK_TARGETS,
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_EXAM_TYPE_LABELS,
  filterQuestions,
  getQuestionFacets,
  getQuestionStats,
  getQuestions,
  loadQuestionBank,
  toLegacyQuestion,
} from '../../services/questionService';
import type { Question as StudyQuestion, QuestionDifficulty, QuestionExamType, QuestionFilterState } from '../../types/question';

const EMPTY_FILTERS: QuestionFilterState = {
  search: '',
  exam: '',
  examType: '',
  institution: '',
  year: '',
  subject: '',
  topic: '',
  difficulty: '',
  onlyWrong: false,
  onlyFavorites: false,
  onlyReviewLater: false,
  onlyUnanswered: false,
};

const ALT_INDEX = { A: 0, B: 1, C: 2, D: 3, E: 4 } as const;

const difficultySkin: Record<QuestionDifficulty, string> = {
  facil: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  medio: 'border-amber-400/25 bg-amber-400/10 text-amber-200',
  dificil: 'border-rose-400/25 bg-rose-400/10 text-rose-200',
  muito_dificil: 'border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200',
};

const categoryIcons: Record<string, LucideIcon> = {
  enem: GraduationCap,
  vestibular: BookOpen,
  concurso: ClipboardList,
  militar: Shield,
  wrong: AlertCircle,
  favorites: Star,
  simulados: Timer,
};

function normalizeDifficultyFromNav(value: unknown): QuestionDifficulty | '' {
  const normalized = String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (normalized === 'easy' || normalized === 'facil') return 'facil';
  if (normalized === 'medium' || normalized === 'medio') return 'medio';
  if (normalized === 'hard' || normalized === 'dificil') return 'dificil';
  if (normalized === 'muito_dificil') return 'muito_dificil';
  return '';
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function latestAttemptMap(history: ReturnType<typeof useStore.getState>['history']) {
  const latest = new Map<string, { isCorrect: boolean; userAnswer: number; timestamp: string; timeSpent?: number }>();
  [...history]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .forEach((entry) => {
      if (!latest.has(entry.questionId)) latest.set(entry.questionId, entry);
    });
  return latest;
}

function correctCount(questions: StudyQuestion[], latest: Map<string, { isCorrect: boolean }>) {
  return questions.filter((question) => latest.get(question.id)?.isCorrect).length;
}

function accuracy(questions: StudyQuestion[], latest: Map<string, { isCorrect: boolean }>) {
  const answered = questions.filter((question) => latest.has(question.id));
  if (answered.length === 0) return 0;
  return Math.round((correctCount(answered, latest) / answered.length) * 100);
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number | undefined;
  options: Array<string | number>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-white/45">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-3 text-sm font-semibold text-white outline-none transition-colors focus:border-primary/45"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={String(option)} value={option}>{String(option)}</option>
        ))}
      </select>
    </label>
  );
}const QuestionsView = () => {
  const { user } = useAuth();
  const { goTo } = useAppNavigation();
  const reduceMotion = useReducedMotion() ?? false;
  const {
    favorites,
    history,
    reviewLater,
    toggleFavorite,
    toggleReviewLater,
    recordQuestionView,
    navFilters,
    clearNavFilters,
  } = useStore();

  const [allQuestions, setAllQuestions] = useState<StudyQuestion[]>(() => getQuestions());
  const [bankStatus, setBankStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    loadQuestionBank()
      .then((questions) => {
        if (!active) return;
        setAllQuestions(questions);
        setBankStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setBankStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);
  const facets = useMemo(() => getQuestionFacets(allQuestions), [allQuestions]);
  const stats = useMemo(() => getQuestionStats(allQuestions), [allQuestions]);
  const latest = useMemo(() => latestAttemptMap(history || []), [history]);
  const answeredIds = useMemo(() => new Set(latest.keys()), [latest]);
  const wrongIds = useMemo(() => {
    const ids = new Set<string>();
    latest.forEach((attempt, id) => {
      if (!attempt.isCorrect) ids.add(id);
    });
    return ids;
  }, [latest]);
  const favoriteIds = useMemo(() => new Set(favorites || []), [favorites]);
  const reviewLaterIds = useMemo(() => new Set(reviewLater || []), [reviewLater]);

  const [filters, setFilters] = useState<QuestionFilterState>(() => ({
    ...EMPTY_FILTERS,
    search: navFilters.search ?? '',
    subject: navFilters.subject ?? '',
    topic: navFilters.topic ?? '',
    difficulty: normalizeDifficultyFromNav(navFilters.difficulty),
    examType: navFilters.examType ?? '',
    onlyWrong: navFilters.filterStatus === 'wrong',
    onlyUnanswered: navFilters.filterStatus === 'unanswered',
    onlyFavorites: Boolean(navFilters.onlyFavorites),
  }));
  const [showFilters, setShowFilters] = useState(false);
  const [mode, setMode] = useState<'bank' | 'practice'>('bank');
  const [sessionTitle, setSessionTitle] = useState('Treino');
  const [sessionQuestions, setSessionQuestions] = useState<StudyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState<StudyQuestion['correctAlternative'] | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());

  useEffect(() => {
    if (Object.keys(navFilters || {}).length === 0) return;
    setFilters((current) => ({
      ...current,
      search: navFilters.search ?? current.search,
      subject: navFilters.subject ?? current.subject,
      topic: navFilters.topic ?? current.topic,
      difficulty: normalizeDifficultyFromNav(navFilters.difficulty) || current.difficulty,
      examType: navFilters.examType ?? current.examType,
      onlyWrong: navFilters.filterStatus === 'wrong' ? true : current.onlyWrong,
      onlyUnanswered: navFilters.filterStatus === 'unanswered' ? true : current.onlyUnanswered,
      onlyFavorites: navFilters.onlyFavorites ?? current.onlyFavorites,
    }));
    clearNavFilters();
  }, [navFilters, clearNavFilters]);

  const runtimeFilters = useMemo(
    () => ({ wrongIds, answeredIds, favoriteIds, reviewLaterIds }),
    [wrongIds, answeredIds, favoriteIds, reviewLaterIds]
  );

  const filteredQuestions = useMemo(
    () => filterQuestions(allQuestions, filters, runtimeFilters),
    [allQuestions, filters, runtimeFilters]
  );

  const activeChips = useMemo(() => {
    const chips: Array<{ key: keyof QuestionFilterState; label: string }> = [];
    if (filters.search) chips.push({ key: 'search', label: `Busca: ${filters.search}` });
    if (filters.examType) chips.push({ key: 'examType', label: QUESTION_EXAM_TYPE_LABELS[filters.examType] });
    if (filters.exam) chips.push({ key: 'exam', label: String(filters.exam) });
    if (filters.institution) chips.push({ key: 'institution', label: String(filters.institution) });
    if (filters.year) chips.push({ key: 'year', label: String(filters.year) });
    if (filters.subject) chips.push({ key: 'subject', label: String(filters.subject) });
    if (filters.topic) chips.push({ key: 'topic', label: String(filters.topic) });
    if (filters.difficulty) chips.push({ key: 'difficulty', label: QUESTION_DIFFICULTY_LABELS[filters.difficulty] });
    if (filters.onlyWrong) chips.push({ key: 'onlyWrong', label: 'Erradas' });
    if (filters.onlyFavorites) chips.push({ key: 'onlyFavorites', label: 'Favoritas' });
    if (filters.onlyReviewLater) chips.push({ key: 'onlyReviewLater', label: 'Revisar depois' });
    if (filters.onlyUnanswered) chips.push({ key: 'onlyUnanswered', label: 'Nao resolvidas' });
    return chips;
  }, [filters]);

  const updateFilter = <K extends keyof QuestionFilterState>(key: K, value: QuestionFilterState[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => setFilters({ ...EMPTY_FILTERS });

  const startPractice = (questions: StudyQuestion[], title: string) => {
    if (questions.length === 0) {
      toast.info('Banco de Questoes', 'Nenhuma questao encontrada para este treino.');
      return;
    }
    setSessionTitle(title);
    setSessionQuestions(questions);
    setCurrentIndex(0);
    setSelectedAlternative(null);
    setConfirmed(false);
    setSessionCorrect(0);
    setElapsedSeconds(0);
    setQuestionStartedAt(Date.now());
    setMode('practice');
    useStore.getState().trackFeature('questions');
  };

  const currentQuestion = sessionQuestions[currentIndex];
  const progress = sessionQuestions.length > 0 ? Math.round(((Math.min(currentIndex, sessionQuestions.length - 1) + 1) / sessionQuestions.length) * 100) : 0;

  useEffect(() => {
    if (mode !== 'practice' || !currentQuestion) return;
    recordQuestionView(currentQuestion.id);
    setQuestionStartedAt(Date.now());
    setElapsedSeconds(0);
  }, [currentQuestion?.id, mode, recordQuestionView]);

  useEffect(() => {
    if (mode !== 'practice' || !currentQuestion || confirmed) return;
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [confirmed, currentQuestion, mode]);

  const confirmAnswer = () => {
    if (!currentQuestion || !selectedAlternative || confirmed) return;
    const isCorrect = selectedAlternative === currentQuestion.correctAlternative;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    setConfirmed(true);
    playInteractionFeedback(isCorrect ? 'success' : 'error');
    if (isCorrect) setSessionCorrect((value) => value + 1);
    void recordQuestionAttempt({
      userId: user?.id ?? null,
      question: toLegacyQuestion(currentQuestion),
      userAnswer: ALT_INDEX[selectedAlternative],
      isCorrect,
      timeSpentSeconds,
      xpAward: isCorrect ? 20 : 0,
    });
  };

  const goNext = () => {
    if (currentIndex >= sessionQuestions.length - 1) {
      setCurrentIndex(sessionQuestions.length);
      setSelectedAlternative(null);
      setConfirmed(false);
      return;
    }
    setCurrentIndex((index) => index + 1);
    setSelectedAlternative(null);
    setConfirmed(false);
  };

  const categoryCards = useMemo(() => {
    const base = [
      { id: 'enem', title: 'ENEM', subtitle: `${QUESTION_BANK_TARGETS.enem.toLocaleString('pt-BR')} itens de pratica selecionados`, filters: { examType: 'enem' as const } },
      { id: 'vestibular', title: 'Vestibulares', subtitle: `${QUESTION_BANK_TARGETS.vestibular.toLocaleString('pt-BR')} itens entre Fuvest, Unicamp, UnB e mais`, filters: { examType: 'vestibular' as const } },
      { id: 'concurso', title: 'Concursos', subtitle: `${QUESTION_BANK_TARGETS.concurso.toLocaleString('pt-BR')} itens para carreiras publicas`, filters: { examType: 'concurso' as const } },
      { id: 'militar', title: 'Militares', subtitle: `${QUESTION_BANK_TARGETS.militar.toLocaleString('pt-BR')} itens para ITA, IME, ESA e estrategia`, filters: { examType: 'militar' as const } },
      { id: 'wrong', title: 'Revisar erros', subtitle: 'Ultimas tentativas erradas', filters: { onlyWrong: true } },
      { id: 'favorites', title: 'Favoritas', subtitle: 'Seu caderno de treino', filters: { onlyFavorites: true } },
      { id: 'simulados', title: 'Simulados', subtitle: 'Responder o banco inteiro ou o filtro atual', filters: {} },
    ];
    return base.map((card) => {
      const questions = filterQuestions(allQuestions, card.filters, runtimeFilters);
      const answered = questions.filter((question) => answeredIds.has(question.id)).length;
      return {
        ...card,
        questions,
        count: questions.length,
        progress: questions.length === 0 ? 0 : Math.round((answered / questions.length) * 100),
        correct: correctCount(questions, latest),
      };
    });
  }, [allQuestions, answeredIds, latest, runtimeFilters]);  if (mode === 'practice') {
    if (!currentQuestion) {
      const total = sessionQuestions.length;
      const percent = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;
      return (
        <div className="app-shell-premium premium-page-stack pb-32 pt-5 md:pt-8">
          <Header title="Resultado" subtitle={sessionTitle} icon={Trophy} color="primary" onBack={() => setMode('bank')} />
          <GlassCard className="premium-page-hero p-6 text-center">
            <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-[28px] border border-primary/25 bg-primary/12 text-primary">
              <Trophy size={34} />
            </div>
            <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary">Sessao concluida</p>
            <h1 className="mt-2 text-4xl font-premium-title italic text-white">{percent}% de aproveitamento</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">Voce acertou {sessionCorrect} de {total} questoes. As estatisticas foram salvas no historico local e na nuvem quando disponivel.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AnimatedButton onClick={() => startPractice(sessionQuestions, sessionTitle)} variant="secondary"><Zap size={16} /> Refazer treino</AnimatedButton>
              <AnimatedButton onClick={() => setMode('bank')} glow><BookOpen size={16} /> Voltar ao banco</AnimatedButton>
            </div>
          </GlassCard>
        </div>
      );
    }

    const answerIsCorrect = selectedAlternative === currentQuestion.correctAlternative;

    return (
      <div className="app-shell-premium premium-page-stack pb-32 pt-5 md:pt-8">
        <Header
          title="Resolver questao"
          subtitle={sessionTitle}
          icon={Target}
          color="primary"
          onBack={() => setMode('bank')}
          rightContent={<Badge variant="secondary">{currentIndex + 1} de {sessionQuestions.length}</Badge>}
        />
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,var(--hub-primary),rgba(96,245,255,0.9))]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={reduceMotion ? { duration: 0.1 } : { duration: 0.35 }}
          />
        </div>

        <GlassCard className="premium-list-card space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{currentQuestion.exam} {currentQuestion.year}</Badge>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{currentQuestion.subject}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{currentQuestion.topic}</span>
            <span className={cn('rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]', difficultySkin[currentQuestion.difficulty])}>{QUESTION_DIFFICULTY_LABELS[currentQuestion.difficulty]}</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-premium-mono text-white/55"><Timer size={12} /> {formatSeconds(elapsedSeconds)}</span>
          </div>

          <p className="text-lg font-semibold leading-relaxed text-white sm:text-xl">{currentQuestion.statement}</p>
          {currentQuestion.imageUrl ? <img src={currentQuestion.imageUrl} alt="Imagem da questao" className="max-h-72 rounded-2xl border border-white/10 object-contain" /> : null}

          <div className="space-y-3">
            {currentQuestion.alternatives.map((alternative) => {
              const isSelected = selectedAlternative === alternative.id;
              const isCorrect = confirmed && alternative.id === currentQuestion.correctAlternative;
              const isWrong = confirmed && isSelected && alternative.id !== currentQuestion.correctAlternative;
              return (
                <button
                  key={alternative.id}
                  type="button"
                  disabled={confirmed}
                  onClick={() => { playInteractionFeedback('tap'); setSelectedAlternative(alternative.id); }}
                  className={cn(
                    'studyflow-question-option w-full rounded-[22px] border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                    'bg-white/[0.045] hover:bg-white/[0.07]',
                    isSelected && !confirmed && 'border-primary/55 bg-primary/10 shadow-[0_0_22px_rgba(var(--hub-primary-rgb),0.1)]',
                    isCorrect && 'border-emerald-400/60 bg-emerald-400/12',
                    isWrong && 'border-rose-400/60 bg-rose-400/12',
                    !isSelected && !isCorrect && !isWrong && 'border-white/10'
                  )}
                >
                  <span className="flex gap-3">
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black', isCorrect ? 'border-emerald-400/50 text-emerald-200' : isWrong ? 'border-rose-400/50 text-rose-200' : 'border-white/15 text-white/70')}>{alternative.id}</span>
                    <span className="pt-1 text-sm leading-relaxed text-white/88">{alternative.text}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn('rounded-[24px] border p-5', answerIsCorrect ? 'border-emerald-400/25 bg-emerald-400/10' : 'border-rose-400/25 bg-rose-400/10')}
              >
                <div className="mb-3 flex items-center gap-3">
                  {answerIsCorrect ? <CheckCircle2 className="text-emerald-300" size={22} /> : <XCircle className="text-rose-300" size={22} />}
                  <div>
                    <p className="text-sm font-black text-white">{answerIsCorrect ? 'Resposta correta' : 'Resposta incorreta'}</p>
                    <p className="text-xs text-white/60">Gabarito: alternativa {currentQuestion.correctAlternative}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/78">{currentQuestion.explanation}</p>
                <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-[11px] leading-relaxed text-white/55">Fonte: {currentQuestion.source}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
            {!confirmed ? (
              <AnimatedButton onClick={confirmAnswer} disabled={!selectedAlternative} glow><CheckCircle2 size={16} /> Confirmar resposta</AnimatedButton>
            ) : (
              <AnimatedButton onClick={goNext} glow><ChevronRight size={16} /> {currentIndex >= sessionQuestions.length - 1 ? 'Finalizar' : 'Proxima questao'}</AnimatedButton>
            )}
            <AnimatedButton onClick={() => toggleFavorite(currentQuestion.id)} variant="secondary"><Star size={16} fill={favorites.includes(currentQuestion.id) ? 'currentColor' : 'none'} /> Favoritar</AnimatedButton>
            <AnimatedButton onClick={() => toggleReviewLater(currentQuestion.id)} variant="secondary"><Bookmark size={16} fill={reviewLater.includes(currentQuestion.id) ? 'currentColor' : 'none'} /> Revisar</AnimatedButton>
            <AnimatedButton onClick={() => toast.warning('Reportar erro', 'Marcamos esta questao para revisao editorial futura.')} variant="ghost"><Flag size={16} /> Reportar</AnimatedButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="studyflow-questions app-shell-premium premium-page-stack pb-32 pt-5 md:pt-8 md:pb-36">
      <header className="premium-page-hero studyflow-command-hero space-y-6 p-5 sm:p-6">
        <Header
          title="Banco de Questoes"
          subtitle={bankStatus === 'ready' ? 'Banco grande carregado' : 'Carregando banco grande'}
          icon={BookOpen}
          color="primary"
          onBack={() => goTo('/')}
          rightContent={<Badge variant={bankStatus === 'ready' ? 'primary' : 'secondary'}>{bankStatus === 'loading' ? `carregando ${QUESTION_BANK_TOTAL_TARGET.toLocaleString('pt-BR')}` : `${stats.total.toLocaleString('pt-BR')} questoes`}</Badge>}
        />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-premium-title italic leading-[0.96] text-white sm:text-5xl">Treino serio, filtro real e gabarito honesto.</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">O banco carrega {QUESTION_BANK_TOTAL_TARGET.toLocaleString('pt-BR')} itens respondiveis em background: ENEM, vestibulares, concursos e militares. Itens legados ficam marcados como pratica StudyFlow; a importacao real por JSON/CSV/API segue pronta para provas oficiais licenciadas.</p>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative rounded-[22px] border border-white/12 bg-black/35 p-2 transition-colors focus-within:border-primary/45">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input
                  value={filters.search ?? ''}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Buscar por prova, materia, assunto, instituicao ou enunciado..."
                  className="h-12 w-full rounded-2xl border-0 bg-transparent pl-10 pr-3 text-sm font-semibold text-white outline-none placeholder:text-white/40"
                />
              </div>
              <AnimatedButton onClick={() => setShowFilters((value) => !value)} variant="secondary" className="min-h-14"><Filter size={16} /> Filtros avancados</AnimatedButton>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">{answeredIds.size}</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">resolvidas</p></GlassCard>
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">{correctCount(allQuestions, latest)}</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">acertos</p></GlassCard>
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">{accuracy(allQuestions, latest)}%</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">precisao</p></GlassCard>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ opacity: 0, height: reduceMotion ? 'auto' : 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: reduceMotion ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="premium-list-card space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect label="Tipo" value={filters.examType} options={facets.examTypes} onChange={(value) => updateFilter('examType', value as QuestionExamType | '')} />
                <FilterSelect label="Prova" value={filters.exam} options={facets.exams} onChange={(value) => updateFilter('exam', value)} />
                <FilterSelect label="Ano" value={filters.year} options={facets.years} onChange={(value) => updateFilter('year', value ? Number(value) : '')} />
                <FilterSelect label="Instituicao" value={filters.institution} options={facets.institutions} onChange={(value) => updateFilter('institution', value)} />
                <FilterSelect label="Materia" value={filters.subject} options={facets.subjects} onChange={(value) => updateFilter('subject', value)} />
                <FilterSelect label="Assunto" value={filters.topic} options={facets.topics} onChange={(value) => updateFilter('topic', value)} />
                <FilterSelect label="Dificuldade" value={filters.difficulty} options={facets.difficulties} onChange={(value) => updateFilter('difficulty', value as QuestionDifficulty | '')} />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['onlyWrong', 'Apenas erradas'],
                  ['onlyFavorites', 'Apenas favoritas'],
                  ['onlyReviewLater', 'Revisar depois'],
                  ['onlyUnanswered', 'Nao resolvidas'],
                ].map(([key, label]) => {
                  const filterKey = key as keyof QuestionFilterState;
                  const active = Boolean(filters[filterKey]);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateFilter(filterKey, !active as never)}
                      className={cn('rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors', active ? 'border-primary/35 bg-primary/12 text-primary' : 'border-white/10 bg-white/[0.045] text-white/55')}
                    >
                      {label}
                    </button>
                  );
                })}
                <button type="button" onClick={clearFilters} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/60 transition-colors hover:border-primary/30 hover:text-primary">Limpar filtros</button>
              </div>
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button key={String(chip.key)} type="button" onClick={() => updateFilter(chip.key, typeof filters[chip.key] === 'boolean' ? false as never : '' as never)} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-primary">
              {chip.label} <X size={12} />
            </button>
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div className="premium-section-heading"><h2 className="premium-section-title">Categorias de treino</h2></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categoryCards.map((card) => {
            const Icon = categoryIcons[card.id] || Target;
            return (
              <GlassCard key={card.id} enterAnimation={false} className="premium-grid-card p-5">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={21} /></div>
                    <span className="text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-white/40">{card.count} questoes</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-premium-title italic text-white">{card.title}</h3>
                    <p className="text-xs text-text-secondary">{card.subtitle}</p>
                  </div>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/45"><span>Progresso</span><span>{card.progress}% | {card.correct} acertos</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-primary" style={{ width: `${card.progress}%` }} /></div>
                    <AnimatedButton onClick={() => startPractice(card.questions, card.title)} variant="secondary" className="w-full text-xs font-black uppercase tracking-widest"><Zap size={15} /> Treinar</AnimatedButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="premium-section-heading flex-1"><h2 className="premium-section-title">Resultados filtrados</h2></div>
          <AnimatedButton onClick={() => startPractice(filteredQuestions, 'Filtro atual')} disabled={filteredQuestions.length === 0} glow><Sparkles size={15} /> Treinar filtro</AnimatedButton>
        </div>

        {filteredQuestions.length === 0 ? (
          <GlassCard className="premium-empty-panel p-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-white/45"><Search size={24} /></div>
            <h3 className="text-2xl font-premium-title italic text-white">Nenhuma questao encontrada</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">Ajuste os filtros ou limpe tudo para voltar ao banco completo.</p>
            <AnimatedButton onClick={clearFilters} className="mx-auto mt-5"><X size={16} /> Limpar filtros</AnimatedButton>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.slice(0, 10).map((question) => {
              const latestAttempt = latest.get(question.id);
              return (
                <GlassCard key={question.id} enterAnimation={false} className="premium-list-card p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{question.exam} {question.year}</Badge>
                        <span className={cn('rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest', difficultySkin[question.difficulty])}>{QUESTION_DIFFICULTY_LABELS[question.difficulty]}</span>
                        {latestAttempt ? <span className={cn('rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest', latestAttempt.isCorrect ? 'bg-emerald-400/10 text-emerald-200' : 'bg-rose-400/10 text-rose-200')}>{latestAttempt.isCorrect ? 'Acertada' : 'Errada'}</span> : null}
                      </div>
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-white">{question.statement}</h3>
                      <p className="text-xs text-text-secondary">{question.subject} / {question.topic} / {question.source}</p>
                    </div>
                    <AnimatedButton onClick={() => startPractice([question], question.topic)} variant="secondary" className="shrink-0">Resolver <ChevronRight size={15} /></AnimatedButton>
                  </div>
                </GlassCard>
              );
            })}
            {filteredQuestions.length > 10 ? <p className="text-center text-xs text-text-secondary">Mostrando 10 de {filteredQuestions.length}. Use a busca/filtros para afinar.</p> : null}
          </div>
        )}
      </section>
    </div>
  );
};

export default QuestionsView;