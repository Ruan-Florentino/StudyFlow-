import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  BookOpen,
  Bookmark,
  Brain,
  ChevronRight,
  ClipboardList,
  Compass,
  Flame,
  GraduationCap,
  History,
  Landmark,
  Languages,
  Microscope,
  PenLine,
  Play,
  Shield,
  Sigma,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { AnimatedButton, Badge, GlassCard, cn } from '../../components/UI';
import { useStore } from '../../store';
import { useAppNavigation } from '../../app/router/useAppNavigation';
import { QUESTION_EXAM_TYPE_LABELS, getQuestionStats, getQuestions } from '../../services/questionService';
import type { QuestionExamType, QuestionFilterState } from '../../types/question';

const objectiveCards: Array<{ title: string; description: string; icon: LucideIcon; examType: QuestionExamType }> = [
  { title: 'ENEM', description: 'Competencias, habilidades e revisao por area.', icon: GraduationCap, examType: 'enem' },
  { title: 'Vestibulares', description: 'Fuvest, Unicamp, UnB e provas tradicionais.', icon: Landmark, examType: 'vestibular' },
  { title: 'Concursos', description: 'Treino objetivo para carreiras publicas.', icon: ClipboardList, examType: 'concurso' },
  { title: 'Militares', description: 'ITA, IME, ESA e rotina de alta exigencia.', icon: Shield, examType: 'militar' },
];

const subjectCards: Array<{ subject: string; icon: LucideIcon; tone: string }> = [
  { subject: 'Matematica', icon: Sigma, tone: 'text-cyan-200 border-cyan-300/20 bg-cyan-300/10' },
  { subject: 'Portugues', icon: Languages, tone: 'text-amber-200 border-amber-300/20 bg-amber-300/10' },
  { subject: 'Fisica', icon: Timer, tone: 'text-blue-200 border-blue-300/20 bg-blue-300/10' },
  { subject: 'Quimica', icon: Microscope, tone: 'text-emerald-200 border-emerald-300/20 bg-emerald-300/10' },
  { subject: 'Biologia', icon: Brain, tone: 'text-green-200 border-green-300/20 bg-green-300/10' },
  { subject: 'Historia', icon: History, tone: 'text-rose-200 border-rose-300/20 bg-rose-300/10' },
  { subject: 'Geografia', icon: Compass, tone: 'text-sky-200 border-sky-300/20 bg-sky-300/10' },
  { subject: 'Sociologia', icon: BookOpen, tone: 'text-violet-200 border-violet-300/20 bg-violet-300/10' },
];

const trainingModes: Array<{ title: string; description: string; icon: LucideIcon; filters?: QuestionFilterState; path?: string }> = [
  { title: 'Treino rapido', description: 'Abrir o banco completo e resolver agora.', icon: Play, filters: {} },
  { title: 'Simulado', description: 'Montar uma prova com tempo e revisao.', icon: Target, path: '/simulados' },
  { title: 'Revisar erros', description: 'Voltar nas questoes que voce errou.', icon: AlertCircle, filters: { onlyWrong: true, filterStatus: 'wrong' } as QuestionFilterState },
  { title: 'Questoes dificeis', description: 'Foco em itens de maior dificuldade.', icon: Flame, filters: { difficulty: 'dificil' } },
  { title: 'Favoritas', description: 'Treinar seu caderno salvo.', icon: Star, filters: { onlyFavorites: true } },
];

function SectionTitle({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: LucideIcon }) {
  return (
    <div className="premium-section-heading">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-primary" />
        <div>
          <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h2 className="text-xl font-premium-title italic text-white">{title}</h2>
        </div>
      </div>
    </div>
  );
}

const ExploreView: React.FC = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const { goTo } = useAppNavigation();
  const { setNavFilters, history, sessions } = useStore();
  const questions = useMemo(() => getQuestions(), []);
  const stats = useMemo(() => getQuestionStats(questions), [questions]);
  const latestAttempt = history?.[0] ?? null;
  const latestSession = sessions?.[0] ?? null;

  const openQuestions = (filters: QuestionFilterState = {}) => {
    setNavFilters(filters);
    goTo('/questoes');
  };

  return (
    <div className="studyflow-explore app-shell-premium premium-page-stack relative isolate pb-32 pt-5 md:pb-36 md:pt-8">
      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-page-hero studyflow-command-hero overflow-hidden p-5 sm:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Central de descoberta</Badge>
              <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-premium-mono font-black uppercase tracking-[0.16em] text-white/55">sem card morto</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-premium-title italic leading-[0.96] text-white sm:text-5xl lg:text-6xl">Explorar com caminho claro.</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">Escolha objetivo, materia ou modo de treino. Cada card abre uma tela funcional com filtros reais no banco de questoes.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AnimatedButton onClick={() => openQuestions()} glow className="min-h-12 flex-1 font-black uppercase tracking-widest"><Sparkles size={17} /> Comecar agora</AnimatedButton>
              <AnimatedButton onClick={() => goTo('/foco')} variant="secondary" className="min-h-12 flex-1 font-black uppercase tracking-widest"><Timer size={17} /> Modo foco</AnimatedButton>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">{stats.total}</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">questoes</p></GlassCard>
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">{Object.keys(stats.bySubject).length}</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">materias</p></GlassCard>
            <GlassCard enterAnimation={false} className="p-3 text-center"><p className="text-2xl font-black text-white">4</p><p className="text-[9px] font-black uppercase tracking-widest text-white/45">objetivos</p></GlassCard>
          </div>
        </div>
      </motion.header>

      <section className="space-y-4">
        <SectionTitle eyebrow="Retomar" title="Continue estudando" icon={Bookmark} />
        <GlassCard className="premium-list-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Trophy size={22} /></div>
              <div className="min-w-0">
                <h3 className="text-lg font-premium-title italic text-white">{latestAttempt ? 'Revisar ultima questao' : 'Primeiro treino guiado'}</h3>
                <p className="mt-1 text-sm text-text-secondary">{latestAttempt ? `Ultima tentativa: ${latestAttempt.isCorrect ? 'acerto' : 'erro'} em ${latestAttempt.questionId.slice(0, 12)}` : latestSession ? `Ultima sessao: ${latestSession.subject}` : 'Entre pelo banco filtrado e comece por uma seed honesta.'}</p>
              </div>
            </div>
            <AnimatedButton onClick={() => latestAttempt ? openQuestions({ search: latestAttempt.questionId }) : openQuestions()} className="shrink-0"><ChevronRight size={16} /> Continuar</AnimatedButton>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Objetivo" title="Explorar por objetivo" icon={Target} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {objectiveCards.map((card) => {
            const Icon = card.icon;
            return (
              <GlassCard key={card.examType} enterAnimation={false} onClick={() => openQuestions({ examType: card.examType })} className="premium-grid-card group p-5">
                <div className="flex h-full flex-col gap-5">
                  <div className="flex items-center justify-between"><div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={21} /></div><ChevronRight size={18} className="text-white/35 group-hover:text-primary" /></div>
                  <div><h3 className="text-lg font-premium-title italic text-white">{card.title}</h3><p className="mt-1 text-xs text-text-secondary">{card.description}</p></div>
                  <p className="mt-auto text-[10px] font-premium-mono font-black uppercase tracking-[0.16em] text-primary">{stats.byExamType[card.examType]} questoes | {QUESTION_EXAM_TYPE_LABELS[card.examType]}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Materia" title="Explorar por materia" icon={BookOpen} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subjectCards.map((card) => {
            const Icon = card.icon;
            const count = stats.bySubject[card.subject] ?? 0;
            return (
              <button key={card.subject} type="button" onClick={() => openQuestions({ subject: card.subject })} className="premium-list-card group rounded-[22px] border border-white/10 bg-white/[0.05] p-4 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.075]">
                <div className="mb-4 flex items-center justify-between"><span className={cn('flex size-11 items-center justify-center rounded-2xl border', card.tone)}><Icon size={19} /></span><ChevronRight size={17} className="text-white/30 group-hover:text-primary" /></div>
                <h3 className="font-black text-white">{card.subject}</h3>
                <p className="mt-1 text-[10px] font-premium-mono font-black uppercase tracking-widest text-white/45">{count} questoes</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Modo" title="Modos de treino" icon={Flame} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {trainingModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <GlassCard key={mode.title} enterAnimation={false} onClick={() => mode.path ? goTo(mode.path) : openQuestions(mode.filters)} className="premium-grid-card group p-5">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between"><div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={19} /></div><ChevronRight size={17} className="text-white/35 group-hover:text-primary" /></div>
                  <div><h3 className="font-premium-title italic text-white">{mode.title}</h3><p className="mt-1 text-xs text-text-secondary">{mode.description}</p></div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <GlassCard className="premium-list-card border-primary/20 bg-primary/[0.035] p-5">
          <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><PenLine size={21} /></div><div><h3 className="text-lg font-premium-title italic text-white">Redacao</h3><p className="mt-1 text-sm text-text-secondary">Abrir editor, temas e historico.</p><AnimatedButton onClick={() => goTo('/redacao')} variant="secondary" className="mt-4"><PenLine size={15} /> Abrir redacao</AnimatedButton></div></div>
        </GlassCard>
        <GlassCard className="premium-list-card border-white/10 p-5">
          <div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white"><History size={21} /></div><div><h3 className="text-lg font-premium-title italic text-white">Relatorios</h3><p className="mt-1 text-sm text-text-secondary">Ver precisao, materias e evolucao.</p><AnimatedButton onClick={() => goTo('/estatisticas')} variant="secondary" className="mt-4"><Trophy size={15} /> Ver relatorios</AnimatedButton></div></div>
        </GlassCard>
      </section>
    </div>
  );
};

export default ExploreView;