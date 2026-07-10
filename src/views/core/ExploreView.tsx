import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  Brain,
  CalendarCheck,
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
  Route,
  Search,
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
import { QUESTION_BANK_TOTAL_TARGET, QUESTION_EXAM_TYPE_LABELS, getQuestionStats, getQuestions, loadQuestionBank } from '../../services/questionService';
import type { Question as StudyQuestion, QuestionExamType, QuestionFilterState } from '../../types/question';

type ObjectiveCard = { title: string; description: string; icon: LucideIcon; examType: QuestionExamType; accent: string };
type SubjectCard = { subject: string; label: string; description: string; icon: LucideIcon; tone: string };
type ModeCard = { title: string; description: string; icon: LucideIcon; filters?: QuestionFilterState; path?: string; metric: string };
type ToolCard = { title: string; description: string; icon: LucideIcon; path: string; tone: string };

const objectiveCards: ObjectiveCard[] = [
  { title: 'ENEM', description: 'Competencias, habilidades, TRI e revisao por area.', icon: GraduationCap, examType: 'enem', accent: 'from-emerald-300/18 to-cyan-300/10' },
  { title: 'Vestibulares', description: 'Fuvest, Unicamp, Unesp, UnB e provas tradicionais.', icon: Landmark, examType: 'vestibular', accent: 'from-sky-300/18 to-violet-300/10' },
  { title: 'Concursos', description: 'Treino direto para portugues, logica e conhecimentos gerais.', icon: ClipboardList, examType: 'concurso', accent: 'from-amber-300/16 to-emerald-300/8' },
  { title: 'Militares', description: 'Alta exigencia para ITA, IME, ESA, EsPCEx e AFA.', icon: Shield, examType: 'militar', accent: 'from-rose-300/16 to-cyan-300/8' },
];

const subjectCards: SubjectCard[] = [
  { subject: 'Matematica', label: 'Matematica', description: 'Funcoes, geometria, estatistica e algebra.', icon: Sigma, tone: 'text-cyan-200 border-cyan-300/20 bg-cyan-300/10' },
  { subject: 'Portugues', label: 'Portugues', description: 'Interpretacao, gramatica e literatura.', icon: Languages, tone: 'text-amber-200 border-amber-300/20 bg-amber-300/10' },
  { subject: 'Fisica', label: 'Fisica', description: 'Mecanica, eletricidade, optica e ondas.', icon: Timer, tone: 'text-blue-200 border-blue-300/20 bg-blue-300/10' },
  { subject: 'Quimica', label: 'Quimica', description: 'Estequiometria, organica e solucoes.', icon: Microscope, tone: 'text-emerald-200 border-emerald-300/20 bg-emerald-300/10' },
  { subject: 'Biologia', label: 'Biologia', description: 'Ecologia, genetica, fisiologia e citologia.', icon: Brain, tone: 'text-green-200 border-green-300/20 bg-green-300/10' },
  { subject: 'Historia', label: 'Historia', description: 'Brasil, mundo contemporaneo e movimentos sociais.', icon: History, tone: 'text-rose-200 border-rose-300/20 bg-rose-300/10' },
  { subject: 'Geografia', label: 'Geografia', description: 'Espaco, clima, industria e geopolitica.', icon: Compass, tone: 'text-sky-200 border-sky-300/20 bg-sky-300/10' },
  { subject: 'Sociologia', label: 'Sociologia', description: 'Cidadania, cultura, trabalho e poder.', icon: BookOpen, tone: 'text-violet-200 border-violet-300/20 bg-violet-300/10' },
];

const trainingModes: ModeCard[] = [
  { title: 'Treino rapido', description: 'Abrir o banco completo e resolver agora.', icon: Play, filters: {}, metric: '10 min' },
  { title: 'Simulado', description: 'Montar prova com tempo, resultado e revisao.', icon: Target, path: '/simulados', metric: 'modo prova' },
  { title: 'Revisar erros', description: 'Voltar nos pontos que mais derrubam nota.', icon: AlertCircle, filters: { onlyWrong: true } as QuestionFilterState, metric: 'prioridade' },
  { title: 'Questoes dificeis', description: 'Subir nivel com itens mais pesados.', icon: Flame, filters: { difficulty: 'dificil' }, metric: 'avancado' },
  { title: 'Favoritas', description: 'Treinar o caderno que voce salvou.', icon: Star, filters: { onlyFavorites: true }, metric: 'salvas' },
];

const discoveryLanes: Array<{ title: string; description: string; filters: QuestionFilterState; icon: LucideIcon }> = [
  { title: 'Base forte para ENEM', description: 'Matematica, Natureza e Humanas em blocos curtos.', filters: { examType: 'enem' }, icon: Route },
  { title: 'Arrumar pontos fracos', description: 'Erros, dificeis e revisao ativa sem perder tempo.', filters: { onlyWrong: true }, icon: AlertCircle },
  { title: 'Revisao de vespera', description: 'Questoes objetivas, explicacao rapida e foco.', filters: { difficulty: 'medio' }, icon: Timer },
];

const toolCards: ToolCard[] = [
  { title: 'Redacao', description: 'Tema, rascunho, correcao e historico.', icon: PenLine, path: '/redacao', tone: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' },
  { title: 'Cronograma', description: 'Organize a rotina de estudo da semana.', icon: CalendarCheck, path: '/rotina', tone: 'border-sky-300/20 bg-sky-300/10 text-sky-100' },
  { title: 'Relatorios', description: 'Veja precisao, evolucao e materias.', icon: BarChart3, path: '/estatisticas', tone: 'border-violet-300/20 bg-violet-300/10 text-violet-100' },
  { title: 'Ranking', description: 'XP, liga, streak e posicao global.', icon: Trophy, path: '/ranking', tone: 'border-amber-300/20 bg-amber-300/10 text-amber-100' },
];

function SectionTitle({ eyebrow, title, icon: Icon, action }: { eyebrow: string; title: string; icon: LucideIcon; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="premium-section-heading flex-1">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h2 className="text-xl font-premium-title italic text-white sm:text-2xl">{title}</h2>
          </div>
        </div>
      </div>
      {action}
    </div>
  );
}

const ExploreView: React.FC = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const { goTo } = useAppNavigation();
  const { setNavFilters, history, sessions } = useStore();
  const [questions, setQuestions] = useState<StudyQuestion[]>(() => getQuestions());
  const [bankStatus, setBankStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    loadQuestionBank()
      .then((loadedQuestions) => {
        if (!active) return;
        setQuestions(loadedQuestions);
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

  const stats = useMemo(() => getQuestionStats(questions), [questions]);
  const latestAttempt = history?.[0] ?? null;
  const latestSession = sessions?.[0] ?? null;
  const totalQuestions = bankStatus === 'loading' ? QUESTION_BANK_TOTAL_TARGET : stats.total;
  const answeredCount = history?.length ?? 0;
  const uniqueAnswered = useMemo(() => new Set((history ?? []).map((item) => item.questionId)).size, [history]);
  const accuracy = answeredCount === 0 ? 0 : Math.round(((history ?? []).filter((item) => item.isCorrect).length / answeredCount) * 100);

  const openQuestions = (filters: QuestionFilterState = {}) => {
    setNavFilters(filters);
    goTo('/questoes');
  };

  const submitSearch = (event?: React.FormEvent) => {
    event?.preventDefault();
    const search = searchTerm.trim();
    if (!search) {
      openQuestions();
      return;
    }
    openQuestions({ search });
  };

  return (
    <div className="studyflow-explore app-shell-premium premium-page-stack relative isolate pb-32 pt-5 md:pb-36 md:pt-8">
      <motion.header
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="premium-page-hero studyflow-command-hero overflow-hidden p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 size-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Explorar</Badge>
              <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-[10px] font-premium-mono font-black uppercase tracking-[0.16em] text-white/55">
                hub de estudos
              </span>
              <span className={cn('rounded-full border px-3 py-1 text-[10px] font-premium-mono font-black uppercase tracking-[0.16em]', bankStatus === 'error' ? 'border-red-400/30 bg-red-400/10 text-red-200' : 'border-primary/20 bg-primary/10 text-primary')}>
                {bankStatus === 'loading' ? 'carregando banco' : bankStatus === 'error' ? 'modo offline' : 'banco pronto'}
              </span>
            </div>
            <div className="max-w-4xl space-y-3">
              <h1 className="text-4xl font-premium-title italic leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                Encontre o proximo estudo sem se perder.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                Busca, trilhas, objetivos, materias e ferramentas em um so lugar. A ideia aqui e o aluno bater o olho e saber exatamente onde clicar.
              </p>
            </div>

            <form onSubmit={submitSearch} className="group flex flex-col gap-3 rounded-[28px] border border-white/10 bg-black/30 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="flex min-h-12 flex-1 items-center gap-3 px-3">
                <Search size={19} className="text-primary" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Busque Hitler, funcoes, ecologia, redacao..."
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/35"
                />
              </div>
              <AnimatedButton type="submit" glow className="min-h-12 px-5 font-black uppercase tracking-widest">
                Buscar no banco <ArrowRight size={16} />
              </AnimatedButton>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
            {[
              { label: 'questoes', value: totalQuestions.toLocaleString('pt-BR') },
              { label: 'respondidas', value: uniqueAnswered.toLocaleString('pt-BR') },
              { label: 'precisao', value: `${accuracy}%` },
            ].map((item) => (
              <GlassCard key={item.label} enterAnimation={false} className="p-3 text-center xl:p-4">
                <p className="text-2xl font-black text-white xl:text-3xl">{item.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/45">{item.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <GlassCard className="premium-list-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
                <Bookmark size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-primary">continue</p>
                <h2 className="mt-1 text-2xl font-premium-title italic text-white">{latestAttempt ? 'Retomar revisao inteligente' : 'Comecar por um treino guiado'}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                  {latestAttempt
                    ? `Sua ultima tentativa foi ${latestAttempt.isCorrect ? 'um acerto' : 'um erro'}. Abra o banco com esse contexto e continue sem resetar ritmo.`
                    : latestSession
                      ? `Ultima sessao em ${latestSession.subject}. Continue com questoes e cronometro.`
                      : 'Ainda sem historico suficiente. Comece por um objetivo e o app passa a mostrar atalhos mais certeiros.'}
                </p>
              </div>
            </div>
            <AnimatedButton onClick={() => latestAttempt ? openQuestions({ search: latestAttempt.questionId }) : openQuestions()} className="shrink-0">
              Continuar <ChevronRight size={16} />
            </AnimatedButton>
          </div>
        </GlassCard>

        <GlassCard className="premium-list-card border-primary/20 bg-primary/[0.035] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-primary">recomendado</p>
              <h3 className="mt-1 text-xl font-premium-title italic text-white">Treino de 10 minutos</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">Um bloco curto para aquecer antes de simulado, aula ou redacao.</p>
              <AnimatedButton onClick={() => openQuestions({ difficulty: 'medio' })} variant="secondary" className="mt-4">
                Abrir treino <Play size={15} />
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Trilhas" title="Escolha uma rota pronta" icon={Route} />
        <div className="grid gap-4 lg:grid-cols-3">
          {discoveryLanes.map((lane, index) => {
            const Icon = lane.icon;
            return (
              <motion.button
                key={lane.title}
                type="button"
                onClick={() => openQuestions(lane.filters)}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.04 * index }}
                className="premium-grid-card group rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon size={21} />
                  </span>
                  <ChevronRight size={18} className="text-white/30 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="text-lg font-premium-title italic text-white">{lane.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{lane.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Objetivo" title="Explorar por prova" icon={Target} action={<AnimatedButton onClick={() => openQuestions()} variant="secondary" className="hidden sm:inline-flex">Banco completo</AnimatedButton>} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {objectiveCards.map((card) => {
            const Icon = card.icon;
            const count = stats.byExamType[card.examType] ?? 0;
            return (
              <GlassCard key={card.examType} enterAnimation={false} onClick={() => openQuestions({ examType: card.examType })} className="premium-grid-card group overflow-hidden p-5">
                <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-80 blur-2xl', card.accent)} />
                <div className="relative flex h-full flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={21} /></div>
                    <ChevronRight size={18} className="text-white/35 transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-premium-title italic text-white">{card.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">{card.description}</p>
                  </div>
                  <p className="mt-auto text-[10px] font-premium-mono font-black uppercase tracking-[0.16em] text-primary">
                    {count.toLocaleString('pt-BR')} questoes | {QUESTION_EXAM_TYPE_LABELS[card.examType]}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Materia" title="Entrar por assunto" icon={BookOpen} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subjectCards.map((card) => {
            const Icon = card.icon;
            const count = stats.bySubject[card.subject] ?? 0;
            return (
              <button key={card.subject} type="button" onClick={() => openQuestions({ subject: card.subject })} className="premium-list-card group rounded-[24px] border border-white/10 bg-white/[0.045] p-4 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.07]">
                <div className="mb-4 flex items-center justify-between">
                  <span className={cn('flex size-11 items-center justify-center rounded-2xl border', card.tone)}><Icon size={19} /></span>
                  <ChevronRight size={17} className="text-white/30 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="font-black text-white">{card.label}</h3>
                <p className="mt-1 min-h-9 text-xs leading-relaxed text-text-secondary">{card.description}</p>
                <p className="mt-3 text-[10px] font-premium-mono font-black uppercase tracking-widest text-white/45">{count.toLocaleString('pt-BR')} questoes</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Modo" title="Como voce quer treinar?" icon={Flame} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {trainingModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <GlassCard key={mode.title} enterAnimation={false} onClick={() => mode.path ? goTo(mode.path) : openQuestions(mode.filters)} className="premium-grid-card group p-5">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary"><Icon size={19} /></div>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[9px] font-premium-mono font-black uppercase tracking-widest text-white/45">{mode.metric}</span>
                  </div>
                  <div>
                    <h3 className="font-premium-title italic text-white">{mode.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">{mode.description}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle eyebrow="Ferramentas" title="Abrir outra parte do app" icon={Compass} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.title} type="button" onClick={() => goTo(tool.path)} className="premium-list-card group rounded-[26px] border border-white/10 bg-white/[0.045] p-5 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.07]">
                <div className="mb-5 flex items-center justify-between">
                  <span className={cn('flex size-12 items-center justify-center rounded-2xl border', tool.tone)}><Icon size={20} /></span>
                  <ChevronRight size={18} className="text-white/30 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="text-lg font-premium-title italic text-white">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{tool.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ExploreView;
