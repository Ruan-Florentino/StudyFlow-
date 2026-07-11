import React, { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle, ArrowRight, Atom, BarChart3, BookOpen, Brain, CalendarClock, Check,
  ChevronRight, CircleDot, ClipboardCheck, Clock3, Compass, FilePenLine, Filter,
  Flame, FlaskConical, Focus, GraduationCap, History, Languages, Landmark, Library,
  ListChecks, Microscope, PenLine, Play, RotateCcw, Route, Search, Shield,
  Sigma, Sparkles, Star, Target, Timer, TrendingUp, Trophy, UserRound, X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedButton, Badge, GlassCard, cn } from '../../components/UI';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { useStore } from '../../store';
import { getQuestionStats, getQuestions, loadQuestionBank } from '../../services/questionService';
import {
  DEFAULT_EXPLORE_FILTERS, ESSAY_ACTIONS, GOAL_ACTIONS, SIMULATION_ACTIONS,
  SUBJECT_NAMES, TRAINING_ACTIONS, getContinueStudyItems, getExploreSearchResults,
  getExploreSections, getRecommendedAction, getSubjectAccuracy, getSuggestedTrails,
  getTrendingTopics, getWeakTopics,
  type ExploreAction, type ExploreCategory, type ExploreFilters, type ExploreStatus,
  type SmartTrail,
} from '../../services/exploreService';
import type { Question, QuestionFilterState } from '../../types/question';

const iconByGoal: Record<string, LucideIcon> = {
  'goal-enem': GraduationCap, 'goal-vestibular': Landmark, 'goal-concurso': ClipboardCheck,
  'goal-militar': Shield, 'goal-essay': PenLine, 'goal-review': RotateCcw,
};
const iconBySubject: Record<string, LucideIcon> = {
  Matematica: Sigma, Portugues: Languages, Redacao: FilePenLine, Fisica: Atom,
  Quimica: FlaskConical, Biologia: Microscope, Historia: History, Geografia: Compass,
  Filosofia: Brain, Sociologia: Library, Ingles: Languages, Espanhol: Languages,
};
const iconByTraining: Record<string, LucideIcon> = {
  'training-quick': Play, 'training-errors': AlertCircle, 'training-hard': Flame,
  'training-simulation': Timer, 'training-favorites': Star, 'training-marathon': Trophy,
};
const statusStyle: Record<ExploreStatus, { label: string; className: string }> = {
  forte: { label: 'forte', className: 'bg-emerald-400/10 text-emerald-300' },
  medio: { label: 'médio', className: 'bg-amber-400/10 text-amber-300' },
  fraco: { label: 'fraco', className: 'bg-rose-400/10 text-rose-300' },
  nao_iniciado: { label: 'não iniciado', className: 'bg-white/[0.06] text-white/45' },
};
const categoryLabel: Record<ExploreCategory, string> = {
  questoes: 'Questões', materias: 'Matérias', provas: 'Provas', redacao: 'Redação',
  treinos: 'Modos de treino', trilhas: 'Trilhas',
};

function SectionHeading({ eyebrow, title, icon: Icon, action }: { eyebrow: string; title: string; icon: LucideIcon; action?: React.ReactNode }) {
  return <div className="flex items-end justify-between gap-4">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={18} /></span>
      <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h2 className="truncate text-xl font-premium-title italic text-white sm:text-2xl">{title}</h2></div>
    </div>{action}
  </div>;
}

function EmptyState({ icon: Icon = Compass, title, description, action }: { icon?: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return <GlassCard enterAnimation={false} className="border-dashed border-white/10 p-7 text-center sm:p-9">
    <span className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-white/30"><Icon size={24} /></span>
    <h3 className="mt-4 text-xl font-premium-title italic text-white">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">{description}</p>{action ? <div className="mt-5">{action}</div> : null}
  </GlassCard>;
}

const ActionCard = memo(function ActionCard({ action, icon: Icon, meta, onOpen, className }: { action: ExploreAction; icon: LucideIcon; meta?: string; onOpen: (action: ExploreAction) => void; className?: string }) {
  return <motion.button type="button" whileTap={{ scale: 0.975 }} onClick={() => onOpen(action)} className={cn('premium-grid-card group min-h-44 rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.065]', className)}>
    <div className="flex h-full flex-col"><div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={19} /></span><ChevronRight size={18} className="text-white/25 transition group-hover:translate-x-0.5 group-hover:text-primary" /></div>
    <h3 className="mt-5 text-lg font-premium-title italic text-white">{action.title}</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">{action.description}</p>{meta ? <p className="mt-auto pt-4 text-[9px] font-black uppercase tracking-[0.16em] text-primary">{meta}</p> : null}</div>
  </motion.button>;
});

function ProgressBar({ value }: { value: number }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function FilterSheet({ open, filters, subjects, onChange, onClear, onClose }: { open: boolean; filters: ExploreFilters; subjects: string[]; onChange: (filters: ExploreFilters) => void; onClear: () => void; onClose: () => void }) {
  const option = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K], label: string) => <button key={`${key}-${String(value)}`} type="button" aria-pressed={filters[key] === value} onClick={() => onChange({ ...filters, [key]: value })} className={cn('rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition', filters[key] === value ? 'border-primary/40 bg-primary/15 text-primary' : 'border-white/10 bg-white/[0.04] text-white/55 hover:text-white')}>{label}</button>;
  if (typeof document === 'undefined') return null;
  return createPortal(<AnimatePresence>{open ? <motion.div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <motion.div role="dialog" aria-modal="true" aria-labelledby="explore-filter-title" initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30 }} className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[32px] border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl sm:rounded-[32px] sm:p-7">
      <div className="flex items-start justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Descoberta sob medida</p><h2 id="explore-filter-title" className="mt-1 text-2xl font-premium-title italic text-white">Filtros avançados</h2></div><button type="button" aria-label="Fechar filtros" onClick={onClose} className="flex size-10 items-center justify-center rounded-2xl border border-white/10 text-white/55 hover:text-white"><X size={18} /></button></div>
      <div className="mt-6 space-y-5">
        <div><p className="mb-2 text-xs font-bold text-white/70">Objetivo</p><div className="flex flex-wrap gap-2">{option('objective', 'all', 'Todos')}{option('objective', 'enem', 'ENEM')}{option('objective', 'vestibular', 'Vestibular')}{option('objective', 'concurso', 'Concurso')}{option('objective', 'militar', 'Militar')}{option('objective', 'redacao', 'Redação')}{option('objective', 'revisao', 'Revisão')}</div></div>
        <div><p className="mb-2 text-xs font-bold text-white/70">Matéria</p><div className="flex flex-wrap gap-2">{option('subject', '', 'Todas')}{subjects.slice(0, 12).map((subject) => option('subject', subject, subject))}</div></div>
        <div><p className="mb-2 text-xs font-bold text-white/70">Dificuldade</p><div className="flex flex-wrap gap-2">{option('difficulty', '', 'Todas')}{option('difficulty', 'facil', 'Fácil')}{option('difficulty', 'medio', 'Médio')}{option('difficulty', 'dificil', 'Difícil')}{option('difficulty', 'muito_dificil', 'Muito difícil')}</div></div>
        <div><p className="mb-2 text-xs font-bold text-white/70">Duração</p><div className="flex flex-wrap gap-2">{option('duration', 'all', 'Qualquer')}{option('duration', 'curta', 'Até 20 min')}{option('duration', 'media', '20–90 min')}{option('duration', 'longa', '90+ min')}</div></div>
        <div><p className="mb-2 text-xs font-bold text-white/70">Status</p><div className="flex flex-wrap gap-2">{option('status', 'all', 'Todos')}{option('status', 'novo', 'Novo')}{option('status', 'andamento', 'Em andamento')}{option('status', 'concluido', 'Concluído')}</div></div>
        <div><p className="mb-2 text-xs font-bold text-white/70">Tipo de treino</p><div className="flex flex-wrap gap-2">{option('trainingType', 'all', 'Todos')}{option('trainingType', 'questoes', 'Questões')}{option('trainingType', 'revisao', 'Revisão')}{option('trainingType', 'simulado', 'Simulado')}{option('trainingType', 'redacao', 'Redação')}</div></div>
      </div>
      <div className="sticky bottom-0 mt-7 flex gap-3 border-t border-white/10 bg-[#0a0a0a] pt-4"><AnimatedButton type="button" variant="secondary" onClick={onClear} className="flex-1">Limpar filtros</AnimatedButton><AnimatedButton type="button" onClick={onClose} className="flex-1">Ver resultados <Check size={15} /></AnimatedButton></div>
    </motion.div>
  </motion.div> : null}</AnimatePresence>, document.body);
}

const ExploreView: React.FC = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const { goTo } = useAppNavigation();
  const { setNavFilters, history, sessions, essays, mastery, level, profilePic, name } = useStore();
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());
  const [bankStatus, setBankStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<ExploreFilters>(DEFAULT_EXPLORE_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let active = true;
    loadQuestionBank().then((loaded) => { if (active) { setQuestions(loaded); setBankStatus('ready'); } }).catch(() => { if (active) setBankStatus('error'); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!filterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [filterOpen]);

  const stats = useMemo(() => getQuestionStats(questions), [questions]);
  const recommended = useMemo(() => getRecommendedAction(history, questions, essays), [history, questions, essays]);
  const continueItems = useMemo(() => getContinueStudyItems(history, sessions, essays, questions), [history, sessions, essays, questions]);
  const weakTopics = useMemo(() => getWeakTopics(history, questions), [history, questions]);
  const trails = useMemo(() => getSuggestedTrails(history, questions), [history, questions]);
  const trending = useMemo(() => getTrendingTopics(), []);
  const allActions = useMemo<ExploreAction[]>(() => [...GOAL_ACTIONS, ...TRAINING_ACTIONS, ...trails, ...ESSAY_ACTIONS, ...SIMULATION_ACTIONS], [trails]);
  const visibleIds = useMemo(() => new Set(getExploreSections(allActions, filters).map((item) => item.id)), [allActions, filters]);
  const searchResults = useMemo(() => getExploreSections(getExploreSearchResults(deferredQuery, questions), filters), [deferredQuery, questions, filters]);
  const groupedResults = useMemo(() => searchResults.reduce<Partial<Record<ExploreCategory, ExploreAction[]>>>((groups, result) => { (groups[result.category] ??= []).push(result); return groups; }, {}), [searchResults]);
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== DEFAULT_EXPLORE_FILTERS[key as keyof ExploreFilters]).length;
  const attemptedCount = new Set(history.map((item) => item.questionId)).size;
  const accuracy = history.length ? Math.round((history.filter((item) => item.isCorrect).length / history.length) * 100) : 0;
  const questionById = useMemo(() => new Map(questions.map((question) => [question.id, question])), [questions]);

  const openAction = (action: ExploreAction) => {
    if (action.path) { goTo(action.path); return; }
    const contextualFilters: QuestionFilterState = {
      ...(filters.objective !== 'all' && !['redacao', 'revisao'].includes(filters.objective) ? { examType: filters.objective as QuestionFilterState['examType'] } : {}),
      ...(filters.subject ? { subject: filters.subject } : {}),
      ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      ...(filters.objective === 'revisao' || filters.trainingType === 'revisao' ? { onlyWrong: true } : {}),
    };
    const actionFilters = { ...action.filters, ...contextualFilters };
    setNavFilters({
      ...actionFilters,
      ...(actionFilters.onlyWrong ? { filterStatus: 'wrong' } : {}),
      ...(actionFilters.onlyUnanswered ? { filterStatus: 'unanswered' } : {}),
      ...(actionFilters.onlyAnswered ? { filterStatus: 'answered' } : {}),
    });
    goTo('/questoes');
  };
  const clearFilters = () => setFilters(DEFAULT_EXPLORE_FILTERS);
  const clearDiscovery = () => { setQuery(''); clearFilters(); };

  const subjectItems = SUBJECT_NAMES.filter((subject) => !filters.subject || subject === filters.subject);
  const goalItems = GOAL_ACTIONS.filter((item) => visibleIds.has(item.id));
  const trainingItems = TRAINING_ACTIONS.filter((item) => visibleIds.has(item.id));
  const trailItems = trails.filter((item) => visibleIds.has(item.id));
  const essayItems = ESSAY_ACTIONS.filter((item) => visibleIds.has(item.id));
  const simulationItems = SIMULATION_ACTIONS.filter((item) => visibleIds.has(item.id));
  const hasFilteredContent = goalItems.length + trainingItems.length + trailItems.length + essayItems.length + simulationItems.length + subjectItems.length > 0;

  return <div className="studyflow-explore app-shell-premium premium-page-stack relative isolate pb-32 pt-5 md:pb-36 md:pt-8">
    <motion.header initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="premium-page-hero studyflow-command-hero overflow-hidden p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-28 size-96 rounded-full bg-primary/[0.09] blur-3xl" /><div className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-cyan-400/[0.06] blur-3xl" />
      <div className="relative space-y-6">
        <div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><Badge variant="primary">Central de descoberta</Badge><span className={cn('rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest', bankStatus === 'error' ? 'border-amber-400/20 bg-amber-400/10 text-amber-200' : 'border-white/10 bg-white/[0.05] text-white/50')}>{bankStatus === 'loading' ? 'Sincronizando banco' : bankStatus === 'error' ? 'Dados locais' : `${stats.total.toLocaleString('pt-BR')} questões`}</span></div><h1 className="mt-4 text-4xl font-premium-title italic leading-none text-white sm:text-6xl">Explorar</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">Encontre o melhor caminho para estudar hoje, com base no seu ritmo e desempenho.</p></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setFilterOpen(true)} className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/65 transition hover:border-primary/30 hover:text-primary" aria-label="Abrir filtros"><Filter size={19} />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-black">{activeFilterCount}</span> : null}</button><div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 pr-3 sm:flex">{profilePic ? <img src={profilePic} alt="" className="size-9 rounded-xl object-cover" /> : <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserRound size={17} /></span>}<span><span className="block max-w-24 truncate text-xs font-bold text-white">{name}</span><span className="block text-[9px] uppercase tracking-widest text-primary">Nível {level}</span></span></div></div>
        </div>
        <form onSubmit={(event) => event.preventDefault()} className="group flex min-h-14 items-center gap-3 rounded-[24px] border border-white/10 bg-black/35 p-2 pl-4 transition focus-within:border-primary/35 focus-within:shadow-[0_0_0_4px_rgba(0,232,143,0.06)]"><Search size={19} className="shrink-0 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Buscar no Explorar" placeholder="Buscar prova, matéria, assunto ou modo de treino…" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30" />{query ? <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca" className="flex size-9 items-center justify-center rounded-xl text-white/40 hover:bg-white/[0.06] hover:text-white"><X size={16} /></button> : null}<button type="button" onClick={() => setFilterOpen(true)} className="hidden min-h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white sm:flex"><Filter size={14} /> Filtrar</button></form>
        {activeFilterCount ? <div className="flex flex-wrap gap-2">{Object.entries(filters).filter(([key, value]) => value !== DEFAULT_EXPLORE_FILTERS[key as keyof ExploreFilters]).map(([key, value]) => <button key={key} type="button" onClick={() => setFilters({ ...filters, [key]: DEFAULT_EXPLORE_FILTERS[key as keyof ExploreFilters] })} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-primary">{String(value).replace('_', ' ')} <X size={11} /></button>)}<button type="button" onClick={clearFilters} className="px-2 text-[9px] font-black uppercase tracking-wider text-white/40 hover:text-white">Limpar filtros</button></div> : null}
      </div>
    </motion.header>

    {deferredQuery.trim() ? <section className="space-y-4" aria-live="polite"><SectionHeading eyebrow="Busca inteligente" title={searchResults.length ? `${searchResults.length} resultados para “${deferredQuery.trim()}”` : 'Nada encontrado'} icon={Search} />
      {searchResults.length ? <div className="space-y-5">{Object.entries(groupedResults).map(([category, results]) => <div key={category}><p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{categoryLabel[category as ExploreCategory]}</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results?.map((result) => <ActionCard key={result.id} action={result} icon={result.category === 'redacao' ? PenLine : result.category === 'provas' ? Target : result.category === 'materias' ? BookOpen : Search} onOpen={openAction} />)}</div></div>)}</div> : <EmptyState icon={Search} title="Nenhum caminho com esse termo" description="Tente ENEM, Matemática, Funções, ITA, Banco do Brasil, Redação ou Revisar erros." action={<AnimatedButton type="button" onClick={clearDiscovery} variant="secondary">Limpar busca</AnimatedButton>} />}
    </section> : null}

    {!deferredQuery.trim() ? <>
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <motion.div animate={reduceMotion ? undefined : { boxShadow: ['0 0 30px rgba(0,232,143,0.06)', '0 0 46px rgba(0,232,143,0.13)', '0 0 30px rgba(0,232,143,0.06)'] }} transition={{ repeat: Infinity, duration: 4 }} className="rounded-[30px]"><GlassCard enterAnimation={false} className="h-full border-primary/25 bg-primary/[0.04] p-6 sm:p-7"><div className="flex h-full flex-col justify-between gap-7"><div><div className="flex items-center gap-2 text-primary"><Sparkles size={17} /><span className="text-[9px] font-black uppercase tracking-[0.2em]">{recommended.eyebrow}</span></div><h2 className="mt-4 max-w-2xl text-3xl font-premium-title italic leading-tight text-white sm:text-4xl">{recommended.title}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{recommended.description}</p><p className="mt-3 flex items-start gap-2 text-xs text-white/45"><CircleDot size={13} className="mt-0.5 shrink-0 text-primary" />{recommended.reason}</p></div><AnimatedButton type="button" glow onClick={() => openAction(recommended)} className="self-start">Começar agora <ArrowRight size={16} /></AnimatedButton></div></GlassCard></motion.div>
        <GlassCard enterAnimation={false} className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Seu panorama</p><h3 className="mt-1 text-xl font-premium-title italic text-white">Hoje na Athena</h3></div><BarChart3 size={22} className="text-primary" /></div><div className="mt-6 grid grid-cols-3 gap-2">{[[attemptedCount, 'vistas'], [`${accuracy}%`, 'precisão'], [weakTopics.length, 'pontos fracos']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3 text-center"><p className="text-xl font-black text-white">{value}</p><p className="text-[8px] font-black uppercase tracking-wider text-white/35">{label}</p></div>)}</div><button type="button" onClick={() => goTo('/estatisticas')} className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-xs font-bold text-white/60 hover:border-primary/25 hover:text-primary">Ver relatório completo <ChevronRight size={15} /></button></GlassCard>
      </section>

      <section className="space-y-4"><SectionHeading eyebrow="Retomar" title="Continue estudando" icon={Play} />{continueItems.length ? <div className="grid gap-4 lg:grid-cols-3">{continueItems.map((item) => <button key={item.id} type="button" onClick={() => openAction(item)} className="premium-list-card rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-left hover:border-primary/30"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-black uppercase tracking-widest text-primary">{item.meta}</p><h3 className="mt-2 text-lg font-premium-title italic text-white">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.description}</p></div><ChevronRight size={17} className="shrink-0 text-white/30" /></div><div className="mt-5"><ProgressBar value={item.progress} /></div></button>)}</div> : <EmptyState icon={Play} title="Nenhum estudo iniciado ainda" description="Comece com um diagnóstico curto e seus atalhos aparecerão aqui." action={<AnimatedButton type="button" onClick={() => openAction({ id: 'diagnostic', title: 'Diagnóstico', description: '', category: 'treinos', filters: {} })}>Começar diagnóstico</AnimatedButton>} />}</section>

      {!hasFilteredContent ? <section><EmptyState icon={Filter} title="Nenhuma seção combina com esses filtros" description="Remova um ou mais filtros para voltar a descobrir conteúdos." action={<AnimatedButton type="button" variant="secondary" onClick={clearFilters}>Limpar filtros</AnimatedButton>} /></section> : null}

      {goalItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Meta" title="Explorar por objetivo" icon={Target} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{goalItems.map((item) => <ActionCard key={item.id} action={item} icon={iconByGoal[item.id]} meta={item.filters?.examType ? `${stats.byExamType[item.filters.examType].toLocaleString('pt-BR')} questões no banco` : item.path === '/redacao' ? `${essays.length} redações registradas` : `${history.filter((entry) => !entry.isCorrect).length} respostas para revisar`} onOpen={openAction} />)}</div></section> : null}

      {subjectItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Domínio" title="Explorar por matéria" icon={BookOpen} /><div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">{subjectItems.map((subject) => { const Icon = iconBySubject[subject] ?? BookOpen; const performance = getSubjectAccuracy(subject, history, questions, mastery); const status = statusStyle[performance.status]; return <motion.button whileTap={{ scale: 0.97 }} key={subject} type="button" onClick={() => openAction({ id: `subject-${subject}`, title: subject, description: '', category: 'materias', filters: { subject } })} className="premium-list-card min-w-[240px] snap-start rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left hover:border-primary/30 sm:min-w-0"><div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={19} /></span><span className={cn('rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider', status.className)}>{status.label}</span></div><h3 className="mt-4 font-premium-title italic text-white">{subject}</h3><div className="mt-3 flex items-center justify-between text-[10px] text-white/40"><span>{(stats.bySubject[subject] ?? 0).toLocaleString('pt-BR')} questões</span><span>{performance.accuracy === null ? 'sem precisão' : `${performance.accuracy}% precisão`}</span></div></motion.button>; })}</div></section> : null}

      {trainingItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Prática" title="Modos de treino" icon={Flame} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{trainingItems.map((item) => <ActionCard key={item.id} action={item} icon={iconByTraining[item.id]} meta={item.id === 'training-quick' ? '10 questões' : item.id === 'training-simulation' ? 'tempo real' : 'ação imediata'} onOpen={openAction} />)}</div></section> : null}

      {trailItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Sequência guiada" title="Trilhas inteligentes" icon={Route} /><div className="grid gap-4 lg:grid-cols-2">{trailItems.map((trail: SmartTrail) => <button key={trail.id} type="button" onClick={() => openAction(trail)} className="premium-list-card rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-left hover:border-primary/30"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Route size={20} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-premium-title italic text-white">{trail.title}</h3><p className="mt-1 text-xs text-text-secondary">{trail.description}</p></div><ChevronRight size={17} className="shrink-0 text-white/30" /></div><div className="mt-4 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-white/40"><span>{trail.steps} etapas</span><span>{trail.duration} estimadas</span><span>{trail.progress}%</span></div><div className="mt-2"><ProgressBar value={trail.progress} /></div></div></div></button>)}</div></section> : null}

      <section className="space-y-4"><SectionHeading eyebrow="Diagnóstico" title="Revisar pontos fracos" icon={AlertCircle} />{weakTopics.length ? <div className="grid gap-3 md:grid-cols-2">{weakTopics.map((topic) => <button key={`${topic.subject}-${topic.topic}`} type="button" onClick={() => openAction({ id: `weak-${topic.topic}`, title: topic.topic, description: '', category: 'treinos', filters: { subject: topic.subject, topic: topic.topic, onlyWrong: true } })} className="premium-list-card flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left hover:border-rose-400/25"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-400/10 font-black text-rose-300">{topic.accuracy}%</span><span className="min-w-0 flex-1"><span className="block text-[9px] font-black uppercase tracking-widest text-rose-300">{topic.subject} • {topic.attempts} tentativas</span><span className="mt-1 block truncate font-premium-title italic text-white">{topic.topic}</span></span><span className="text-xs font-bold text-white/45">Revisar</span></button>)}</div> : <EmptyState icon={AlertCircle} title="Seus pontos fracos aparecerão aqui" description="Resolva questões para a Athena identificar assuntos que merecem revisão." action={<AnimatedButton type="button" variant="secondary" onClick={() => openAction({ id: 'weak-start', title: '', description: '', category: 'treinos', filters: {} })}>Resolver questões</AnimatedButton>} />}</section>

      {essayItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Escrita estratégica" title="Redação e repertório" icon={PenLine} /><GlassCard enterAnimation={false} className="border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent p-6 sm:p-7"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Tema da semana • sugestão Athena</p><h3 className="mt-3 max-w-3xl text-2xl font-premium-title italic text-white sm:text-3xl">Desafios para a formação educacional de surdos no Brasil</h3><p className="mt-2 text-sm text-text-secondary">Planeje argumentos, selecione repertórios e escreva no ambiente de redação.</p></div><AnimatedButton type="button" onClick={() => goTo('/redacao')}>Escrever redação <PenLine size={15} /></AnimatedButton></div></GlassCard><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{essayItems.map((item) => <ActionCard key={item.id} action={item} icon={item.id === 'essay-repertoire' ? Library : PenLine} onOpen={openAction} />)}</div></section> : null}

      {simulationItems.length ? <section className="space-y-4"><SectionHeading eyebrow="Ritmo de prova" title="Simulados e provas" icon={Timer} /><div className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">{simulationItems.map((item) => <motion.button whileTap={{ scale: 0.98 }} key={item.id} type="button" onClick={() => openAction(item)} className="premium-grid-card min-w-[280px] snap-start rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-left hover:border-primary/30 sm:min-w-[330px]"><div className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Timer size={19} /></span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white/45">{item.difficulty}</span></div><h3 className="mt-5 text-lg font-premium-title italic text-white">{item.title}</h3><p className="mt-2 text-xs text-text-secondary">{item.description}</p><div className="mt-5 flex gap-4 text-[9px] font-black uppercase tracking-wider text-white/40"><span className="flex items-center gap-1"><Clock3 size={12} />{item.duration}</span><span className="flex items-center gap-1"><ListChecks size={12} />{item.questions}</span></div></motion.button>)}</div></section> : null}

      <section className="space-y-4"><SectionHeading eyebrow="Curadoria editorial" title="Sugestões da Athena" icon={TrendingUp} /><div className="flex flex-wrap gap-2">{trending.map((item, index) => <motion.button initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: reduceMotion ? 0 : index * 0.04 }} key={item.id} type="button" onClick={() => openAction(item)} className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2.5 text-xs font-bold text-white/65 transition hover:border-primary/30 hover:text-primary">{item.title}</motion.button>)}</div></section>

      <section className="space-y-4"><SectionHeading eyebrow="Seu histórico" title="Atividade recente" icon={History} action={<button type="button" onClick={() => goTo('/estatisticas')} className="hidden text-[10px] font-black uppercase tracking-wider text-primary sm:block">Ver tudo</button>} />{history.length || sessions.length || essays.length ? <div className="divide-y divide-white/[0.06] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035]">{history.slice(0, 3).map((item) => { const question = questionById.get(item.questionId); return <button key={`${item.questionId}-${item.timestamp}`} type="button" onClick={() => openAction({ id: item.questionId, title: '', description: '', category: 'questoes', filters: { search: item.questionId } })} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.035]"><span className={cn('flex size-10 shrink-0 items-center justify-center rounded-2xl', item.isCorrect ? 'bg-primary/10 text-primary' : 'bg-rose-400/10 text-rose-300')}>{item.isCorrect ? <Check size={17} /> : <X size={17} />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-white">Questão de {question?.subject ?? 'estudo'} {item.isCorrect ? 'resolvida' : 'marcada para revisão'}</span><span className="mt-1 block truncate text-[10px] text-white/40">{question?.topic ?? 'Banco de questões'} • {new Date(item.timestamp).toLocaleDateString('pt-BR')}</span></span><span className="text-[9px] font-black uppercase tracking-wider text-primary">{item.isCorrect ? '+10 XP' : 'Revisar'}</span></button>; })}{sessions.slice(0, 1).map((session) => <button key={session.id} type="button" onClick={() => goTo('/foco')} className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/[0.035]"><span className="flex size-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Focus size={17} /></span><span className="flex-1"><span className="block text-sm font-bold text-white">Foco concluído em {session.subject}</span><span className="mt-1 block text-[10px] text-white/40">{session.duration} minutos</span></span><ChevronRight size={15} className="text-white/25" /></button>)}</div> : <EmptyState icon={CalendarClock} title="Sua atividade começa no próximo estudo" description="Questões, redações, simulados e sessões concluídas aparecerão aqui." />}</section>
    </> : null}

    <FilterSheet open={filterOpen} filters={filters} subjects={SUBJECT_NAMES} onChange={setFilters} onClear={clearFilters} onClose={() => setFilterOpen(false)} />
    {bankStatus === 'loading' ? <span className="sr-only" role="status">Carregando banco de questões</span> : null}
  </div>;
};

export default ExploreView;
