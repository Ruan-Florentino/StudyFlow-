import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  GraduationCap,
  ListChecks,
  PenLine,
  Play,
  Quote,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';

import { useAppNavigation } from '../../app/router/useAppNavigation';
import { AuroraBackground } from '../../components/fx/AuroraBackground';
import { AnimatedButton, GlassCard, IconTile, ProgressRing, cn } from '../../components/UI';
import { useQuestionMap } from '../../hooks/useQuestions';
import { useUserAccess } from '../../hooks/useUserAccess';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { calculateDaysLeft } from '../../lib/studyUtils';
import { useStore } from '../../store';

const formatNumber = new Intl.NumberFormat('pt-BR');
const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;
const DAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

const DAILY_QUOTES = [
  'A jornada de mil milhas começa com um único passo.',
  'Disciplina é liberdade quando você sabe onde quer chegar.',
  'O estudo de hoje é a tranquilidade da prova de amanhã.',
  'Pequenas sessões bem feitas vencem horas sem direção.',
  'Consistência transforma dificuldade em rotina.',
  'Você não precisa estar perfeito, precisa estar presente.',
  'Foco é uma decisão repetida várias vezes no mesmo dia.',
  'Revisar é respeitar o esforço que você já fez.',
  'A resposta certa começa antes da questão: começa no preparo.',
  'Estudar pouco todos os dias ainda é caminhar todos os dias.',
  'Quem mede o progresso aprende a acelerar sem se perder.',
  'Hoje é um bom dia para ficar um pouco mais forte.',
  'O aluno que volta para corrigir cresce mais rápido.',
  'Foco não é pressa; foco é direção.',
  'Uma questão corrigida vale mais que dez puladas.',
  'Você constrói confiança quando cumpre o combinado consigo mesmo.',
  'Cada erro encontrado é uma chance de subir de nível.',
  'Estudo inteligente é clareza, repetição e ajuste.',
  'O começo pode ser lento. O importante é não zerar o dia.',
  'A mente aprende melhor quando o plano é simples e constante.',
  'Não espere motivação: crie tração.',
  'O treino difícil deixa a prova mais familiar.',
  'Hoje você só precisa vencer a próxima tarefa.',
  'O progresso aparece quando a distração perde espaço.',
  'Uma página entendida muda mais que um capítulo só passado.',
  'O melhor plano é aquele que você consegue repetir amanhã.',
  'Seu futuro agradece os minutos que você protege hoje.',
  'A prova cobra calma; o treino constrói calma.',
  'Aprender é voltar ao ponto fraco sem vergonha.',
  'Fazer o básico com excelência já coloca você na frente.',
  'A concentração cresce quando o ambiente para de mandar em você.',
  'Todo simulado é um mapa, não uma sentença.',
  'A constância é silenciosa, mas o resultado fala alto.',
  'Quem revisa cedo esquece menos tarde.',
  'Seu ritmo só precisa ser honesto, não perfeito.',
  'O difícil fica menor quando vira rotina.',
  'Estudar é transformar ansiedade em ação organizada.',
  'O próximo acerto nasce da última correção.',
  'A meta do dia é simples: sair melhor do que entrou.',
  'Quem treina com atenção ganha tempo na prova.',
  'A dúvida não é inimiga; é o começo da clareza.',
  'Faça a sessão pequena. Depois faça outra.',
  'Conhecimento fica quando você usa, explica e revisa.',
  'O seu foco merece proteção ativa.',
  'Uma rotina forte reduz a dependência da força de vontade.',
  'O estudo certo deixa rastros: notas, revisões e tentativas.',
  'Treine como quem ensina o cérebro a confiar.',
  'A melhor hora para recuperar o atraso é a próxima meia hora.',
  'Quem domina o tempo domina a prova antes dela começar.',
  'Não subestime uma boa sequência de dias simples.',
  'A excelência nasce quando ninguém está olhando.',
  'Clareza primeiro. Velocidade depois.',
  'Seu caderno de erros é um manual de evolução.',
  'A cada treino, você negocia menos com o medo.',
  'O estudo fica leve quando a próxima ação está clara.',
  'A disciplina começa pequena e termina gigante.',
  'Progresso real é repetir mesmo sem plateia.',
  'Uma sessão focada muda o tom do dia inteiro.',
  'O resultado não vem de um pico. Vem de uma sequência.',
  'Hoje é mais uma chance de provar compromisso em silêncio.',
] as const;

type Tone = 'primary' | 'orange' | 'blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'violet';
type QuickAction = { icon: LucideIcon; tone: Tone; title: string; description: string; meta: string; onClick: () => void };

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function getGreeting(hour: number) {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em] text-primary/70">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-premium-title italic tracking-tight text-white md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function MetricPill({ icon: Icon, children, accent }: { icon: LucideIcon; children: ReactNode; accent?: boolean }) {
  return (
    <div className={cn('flex h-9 min-w-0 items-center justify-center gap-2 rounded-xl border px-2.5 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em]', accent ? 'border-primary/20 bg-primary/[0.08] text-primary' : 'border-white/[0.08] bg-white/[0.035] text-white/65')}>
      <Icon size={14} className="shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function QuickCard({ icon, tone, title, description, meta, onClick }: QuickAction) {
  return (
    <GlassCard enterAnimation={false} onClick={onClick} className="group min-h-[150px] border-white/[0.075] bg-white/[0.025] p-4 hover:border-primary/25 hover:bg-white/[0.043] md:p-5">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <IconTile icon={icon} color={tone} size="sm" glow={tone === 'primary'} className="rounded-xl" />
          <ChevronRight className="size-4 text-white/25 transition duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">{description}</p>
          <p className="mt-3 text-[9px] font-premium-mono font-bold uppercase tracking-[0.13em] text-white/35">{meta}</p>
        </div>
      </div>
    </GlassCard>
  );
}

const DashboardView = () => {
  const { questionMap, loading: questionsLoading, error: questionsError } = useQuestionMap();
  const { name, profilePic, level, xp, streak, sessions, history, exams, league, routine, dailyGoalMinutes } = useStore();
  const { isFree } = useUserAccess();
  const { goTo } = useAppNavigation();

  const now = new Date();
  const todayKey = localDateKey(now);
  const todayStudyMinutes = sessions.filter((session) => session.date === todayKey).reduce((total, session) => total + session.duration, 0);
  const dailyGoal = Math.max(1, Number(dailyGoalMinutes) || 1);
  const goalProgress = Math.min(100, Math.max(0, (todayStudyMinutes / dailyGoal) * 100));
  const minutesRemaining = Math.max(0, dailyGoal - todayStudyMinutes);
  const answeredCount = history.length;
  const correctCount = history.filter((item) => item.isCorrect).length;
  const wrongCount = Math.max(0, answeredCount - correctCount);
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
  const questionMetric = questionsLoading ? 'Carregando banco' : questionsError ? 'Banco indisponível' : `${formatNumber.format(questionMap?.size ?? 0)} questões`;

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return date;
  });
  const weekMinutes = weekDates.map((date) => sessions.filter((session) => session.date === localDateKey(date)).reduce((total, session) => total + session.duration, 0));
  const weekTotal = weekMinutes.reduce((total, minutes) => total + minutes, 0);
  const weekPeak = Math.max(1, ...weekMinutes);
  const activeWeekDays = weekMinutes.filter((minutes) => minutes > 0).length;

  const dayLabel = DAY_NAMES[now.getDay()];
  const todayRoutine = routine?.schedule.find((item) => item.day === dayLabel || item.day.startsWith(dayLabel.slice(0, 3)));
  const todayBlocks = todayRoutine?.blocks.slice(0, 4) ?? [];
  const quoteIndex = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86400000) % DAILY_QUOTES.length;
  const quote = DAILY_QUOTES[quoteIndex];
  const recentQuestion = history[0] ? questionMap?.get(history[0].questionId) : null;
  const recentSession = sessions[0];
  const upcomingExams = exams
    .map((exam) => ({ ...exam, daysLeft: calculateDaysLeft(exam.data) }))
    .filter((exam) => exam.daysLeft === null || exam.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999))
    .slice(0, 3);

  const openWrongReview = () => {
    useStore.setState({ showOnlyReviewLater: false });
    useStore.getState().setNavFilters({ filterStatus: 'wrong' });
    goTo('/questoes');
  };

  const quickActions: QuickAction[] = [
    { icon: BookOpen, tone: 'blue', title: 'Banco de questões', description: 'Encontre uma lista e comece seu próximo treino.', meta: questionMetric, onClick: () => goTo('/questoes') },
    { icon: RotateCcw, tone: 'orange', title: 'Revisar erros', description: 'Volte ao que precisa de mais atenção.', meta: wrongCount ? `${wrongCount} pendente${wrongCount === 1 ? '' : 's'}` : 'Tudo em dia', onClick: openWrongReview },
    { icon: PenLine, tone: 'purple', title: 'Redação', description: 'Escreva, salve e evolua por competência.', meta: 'Temas ENEM', onClick: () => goTo('/redacao') },
    { icon: Trophy, tone: 'amber', title: 'Ranking', description: 'Acompanhe sua posição e sua sequência.', meta: `Liga ${league}`, onClick: () => goTo('/ranking') },
    { icon: CalendarDays, tone: 'cyan', title: 'Cronograma', description: 'Organize a semana com o seu ritmo.', meta: routine ? `${todayBlocks.length} bloco${todayBlocks.length === 1 ? '' : 's'} hoje` : 'Plano inteligente', onClick: () => goTo('/rotina') },
    { icon: Timer, tone: 'primary', title: 'Modo foco', description: 'Um bloco sem distrações para começar agora.', meta: `${formatMinutes(todayStudyMinutes)} hoje`, onClick: () => goTo('/foco') },
  ];

  const recentActivity = history[0]
    ? { icon: history[0].isCorrect ? CheckCircle2 : RotateCcw, title: history[0].isCorrect ? 'Questão resolvida' : 'Questão para revisar', detail: recentQuestion ? `${recentQuestion.materia} · ${recentQuestion.assunto}` : 'Seu último exercício foi salvo.' }
    : recentSession
      ? { icon: Timer, title: 'Sessão registrada', detail: `${formatMinutes(recentSession.duration)} de ${recentSession.subject}` }
      : null;

  return (    <div className="studyflow-dashboard relative min-h-full overflow-hidden animate-in fade-in duration-700">
      <AuroraBackground intensity="subtle" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_50%_-10%,rgba(var(--hub-primary-rgb),0.12),transparent_58%)]" />

      <motion.div className="relative z-10 app-shell-premium pb-32 pt-5 md:pb-36 md:pt-8" variants={staggerContainer} initial="hidden" animate="show">
        <motion.header variants={staggerItem} className="mb-8 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.22em] text-primary/70">StudyFlow</p>
            <h1 className="mt-1 truncate text-[28px] font-premium-title italic tracking-tight text-white md:text-4xl">
              {getGreeting(now.getHours())}, {name || 'estudante'}.
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Uma coisa de cada vez. Você já sabe por onde começar.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <MetricPill icon={Flame}>{streak || 0} dias</MetricPill>
              <MetricPill icon={Zap} accent>{formatNumber.format(xp)} XP</MetricPill>
            </div>
            <button type="button" onClick={() => goTo('/perfil')} aria-label="Abrir perfil" className="size-11 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
              <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'StudyFlow')}`} alt="Perfil" className="size-full object-cover" referrerPolicy="no-referrer" />
            </button>
          </div>
        </motion.header>

        <motion.section variants={staggerItem} className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <GlassCard className="min-h-[330px] border-primary/[0.14] bg-[linear-gradient(135deg,rgba(0,232,143,0.10),rgba(255,255,255,0.025)_46%,rgba(255,255,255,0.015))] p-5 md:p-7">
            <div className="pointer-events-none absolute -left-20 bottom-0 size-52 rounded-full bg-primary/[0.10] blur-[90px]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1.5 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-primary">
                    <Target size={13} /> Meta diária
                  </div>
                  <p className="mt-5 text-sm text-text-secondary">Seu ritmo de hoje</p>
                  <p className="mt-1 text-4xl font-premium-title italic tracking-tight text-white md:text-5xl">
                    {formatMinutes(todayStudyMinutes)} <span className="text-xl text-white/35">/ {formatMinutes(dailyGoal)}</span>
                  </p>
                </div>
                <div className="shrink-0 rounded-[26px] border border-white/[0.08] bg-black/20 p-2 backdrop-blur-xl">
                  <ProgressRing progress={goalProgress} size={106} strokeWidth={9} />
                </div>
              </div>
              <div className="max-w-lg">
                <h2 className="text-2xl font-premium-title italic tracking-tight text-white md:text-3xl">
                  {minutesRemaining > 0 ? `Faltam ${formatMinutes(minutesRemaining)} para sua meta.` : 'Meta concluída. Mantenha o ritmo com leveza.'}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {todayStudyMinutes > 0 ? 'Uma sessão curta agora já deixa o restante do dia mais leve.' : 'Comece com uma sessão curta e deixe o próximo passo aparecer.'}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AnimatedButton onClick={() => goTo('/foco')} glow className="min-h-12 flex-1 text-[11px] font-black uppercase tracking-[0.14em] sm:flex-none">
                  <Play size={16} fill="currentColor" /> Entrar em flow
                </AnimatedButton>
                <button type="button" onClick={() => goTo('/rotina')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-white/[0.10] bg-black/[0.14] px-5 text-[11px] font-black uppercase tracking-[0.14em] text-white/70 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                  Ver plano <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/[0.075] bg-white/[0.025] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em] text-primary/70">Retomar</p>
                <h2 className="mt-1 text-xl font-premium-title italic tracking-tight text-white">Continue de onde parou</h2>
              </div>
              <IconTile icon={BookOpen} color="blue" size="sm" className="rounded-xl" />
            </div>
            <div className="mt-7 rounded-[22px] border border-white/[0.07] bg-black/[0.16] p-4">
              <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-white/40">{recentQuestion ? 'Última questão' : 'Próximo treino'}</p>
              <p className="mt-3 text-lg font-black text-white">{recentQuestion ? `${recentQuestion.materia} · ${recentQuestion.assunto}` : 'Comece pelo banco de questões'}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {recentQuestion ? `${answeredCount} questão${answeredCount === 1 ? '' : 'ões'} respondida${answeredCount === 1 ? '' : 's'} · ${accuracy}% de precisão` : 'Escolha uma matéria ou deixe o StudyFlow sugerir sua primeira lista.'}
              </p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${recentQuestion ? Math.max(18, accuracy) : 12}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-primary" />
              </div>
            </div>
            <AnimatedButton onClick={() => goTo('/questoes')} variant="secondary" className="mt-5 min-h-11 w-full text-[11px] font-black uppercase tracking-[0.14em]">
              {recentQuestion ? 'Continuar treino' : 'Abrir questões'} <ArrowRight size={15} />
            </AnimatedButton>
          </GlassCard>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
          <MetricPill icon={Flame}>{streak || 0}d</MetricPill>
          <MetricPill icon={Target}>{accuracy}%</MetricPill>
          <MetricPill icon={Trophy} accent>Nv. {level}</MetricPill>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-10 space-y-4">
          <SectionHeader eyebrow="Começar" title="Escolha seu próximo passo" action={<button type="button" onClick={() => goTo('/explorar')} className="hidden items-center gap-2 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-primary/75 transition hover:text-primary sm:inline-flex">Explorar tudo <ArrowRight size={14} /></button>} />
          <motion.div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-72px' }}>
            {quickActions.map((action) => <motion.div key={action.title} variants={staggerItem}><QuickCard {...action} /></motion.div>)}
          </motion.div>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <GlassCard className="border-white/[0.075] bg-white/[0.025] p-5 md:p-6">
            <SectionHeader eyebrow="Seu dia" title="Plano de hoje" action={<button type="button" onClick={() => goTo('/rotina')} className="inline-flex items-center gap-1 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-white/45 transition hover:text-primary">{routine ? 'Abrir plano' : 'Criar plano'} <ChevronRight size={14} /></button>} />
            <div className="mt-5 space-y-2">
              {todayBlocks.length > 0 ? todayBlocks.map((block, index) => (
                <div key={`${block.subject}-${block.type}-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/[0.12] p-3.5 transition hover:border-white/[0.14] hover:bg-white/[0.035]">
                  <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl border', index === 0 ? 'border-primary/25 bg-primary/10 text-primary' : 'border-white/[0.08] bg-white/[0.04] text-white/55')}>
                    {block.type === 'review' ? <RotateCcw size={16} /> : block.type === 'practice' ? <BookOpen size={16} /> : <PenLine size={16} />}
                  </div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{block.subject}</p><p className="mt-0.5 text-xs text-text-secondary">{formatMinutes(block.duration)} · {block.type === 'review' ? 'revisão' : block.type === 'practice' ? 'prática' : 'teoria'}</p></div>
                  <button type="button" onClick={() => goTo(block.type === 'theory' ? '/foco' : '/questoes')} aria-label={`Iniciar ${block.subject}`} className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.035] text-white/60 transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"><Play size={13} fill="currentColor" /></button>
                </div>
              )) : (
                <div className="rounded-[22px] border border-dashed border-white/[0.11] bg-black/[0.10] px-5 py-7 text-center">
                  <ListChecks className="mx-auto size-5 text-primary/75" />
                  <p className="mt-3 text-sm font-bold text-white">Seu dia ainda está aberto</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">Monte um cronograma ou comece uma sessão curta agora.</p>
                  <button type="button" onClick={() => goTo('/rotina')} className="mt-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-primary">Criar cronograma</button>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="border-white/[0.075] bg-white/[0.025] p-5 md:p-6">
            <SectionHeader eyebrow="Semana" title="Seu ritmo" action={<button type="button" onClick={() => goTo('/estatisticas')} className="inline-flex items-center gap-1 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-white/45 transition hover:text-primary">Detalhes <ChevronRight size={14} /></button>} />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.07] bg-black/[0.13] p-3.5"><p className="text-[9px] font-premium-mono font-bold uppercase tracking-[0.14em] text-white/40">Estudado</p><p className="mt-2 text-xl font-premium-title italic text-white">{formatMinutes(weekTotal)}</p></div>
              <div className="rounded-2xl border border-white/[0.07] bg-black/[0.13] p-3.5"><p className="text-[9px] font-premium-mono font-bold uppercase tracking-[0.14em] text-white/40">Dias ativos</p><p className="mt-2 text-xl font-premium-title italic text-white">{activeWeekDays}<span className="text-sm text-white/35">/7</span></p></div>
            </div>
            <div className="mt-6 flex h-24 items-end justify-between gap-2 border-b border-white/[0.07] pb-2">
              {weekMinutes.map((minutes, index) => (
                <div key={localDateKey(weekDates[index])} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${Math.max(8, Math.round((minutes / weekPeak) * 100))}%` }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }} className={cn('min-h-1 rounded-full', localDateKey(weekDates[index]) === todayKey ? 'bg-primary shadow-[0_0_16px_rgba(var(--hub-primary-rgb),0.35)]' : 'bg-white/[0.18]')} />
                  <span className="text-center text-[8px] font-premium-mono font-bold text-white/35">{DAY_INITIALS[weekDates[index].getDay()]}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-secondary">{weekTotal > 0 ? 'Cada sessão conta. Continue fazendo o próximo bloco caber no seu dia.' : 'Registre sua primeira sessão para ver o ritmo da semana ganhar forma.'}</p>
          </GlassCard>
        </motion.section>
        <motion.section variants={staggerItem} className="mt-10 space-y-4">
          <SectionHeader eyebrow="Radar" title="Provas próximas" action={<button type="button" onClick={() => goTo('/exames')} className="inline-flex items-center gap-1 text-[10px] font-premium-mono font-bold uppercase tracking-[0.14em] text-primary/75 transition hover:text-primary">Ver todas <ArrowRight size={14} /></button>} />
          {upcomingExams.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {upcomingExams.map((exam) => (
                <button key={exam.id} type="button" onClick={() => goTo('/exames')} className="group min-w-[208px] flex-1 rounded-[20px] border border-white/[0.075] bg-white/[0.025] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                  <div className="flex items-start justify-between gap-4"><IconTile icon={GraduationCap} color="primary" size="sm" className="rounded-xl" /><span className="text-2xl font-premium-mono font-black text-white">{exam.daysLeft ?? '--'}</span></div>
                  <p className="mt-5 truncate text-sm font-black text-white">{exam.nome}</p>
                  <p className="mt-1 truncate text-xs text-text-secondary">{exam.descricao}</p>
                  <p className="mt-4 text-[9px] font-premium-mono font-bold uppercase tracking-[0.14em] text-primary/75">{exam.daysLeft === null ? 'Data pendente' : exam.daysLeft === 0 ? 'É hoje' : `${exam.daysLeft} dias restantes`}</p>
                </button>
              ))}
            </div>
          ) : (
            <GlassCard className="border-dashed border-white/[0.10] bg-white/[0.018] p-6 text-center">
              <GraduationCap className="mx-auto size-5 text-primary/70" />
              <p className="mt-3 text-sm font-bold text-white">Nenhuma prova no radar</p>
              <p className="mt-1 text-xs text-text-secondary">Escolha uma prova para transformar o prazo em plano.</p>
            </GlassCard>
          )}
        </motion.section>

        <motion.section variants={staggerItem} className="mt-10 grid gap-5 lg:grid-cols-[0.96fr_1.04fr]">
          <GlassCard className="border-white/[0.075] bg-white/[0.025] p-5 md:p-6">
            <div className="flex items-start gap-4">
              <IconTile icon={Quote} color="primary" size="sm" glow className="rounded-xl" />
              <div className="min-w-0">
                <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-primary/70">Frase do dia · {quoteIndex + 1}/60</p>
                <blockquote className="mt-3 text-xl font-premium-title italic leading-snug text-white">“{quote}”</blockquote>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/[0.075] bg-white/[0.025] p-5 md:p-6">
            <SectionHeader eyebrow="Histórico" title="Atividade recente" />
            {recentActivity ? (
              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/[0.12] p-4">
                <IconTile icon={recentActivity.icon} color="primary" size="sm" className="rounded-xl" />
                <div className="min-w-0 flex-1"><p className="text-sm font-bold text-white">{recentActivity.title}</p><p className="mt-1 truncate text-xs text-text-secondary">{recentActivity.detail}</p></div>
                <ChevronRight className="size-4 shrink-0 text-white/25" />
              </div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-dashed border-white/[0.10] py-7 text-center">
                <Timer className="mx-auto size-5 text-primary/65" />
                <p className="mt-3 text-sm font-bold text-white">Seu histórico começa no primeiro treino</p>
                <p className="mt-1 px-5 text-xs text-text-secondary">Resolva uma questão ou conclua uma sessão para acompanhar sua evolução aqui.</p>
              </div>
            )}
          </GlassCard>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-10">
          <GlassCard className="border-primary/[0.16] bg-[linear-gradient(105deg,rgba(0,232,143,0.11),rgba(255,255,255,0.025)_56%,rgba(255,255,255,0.018))] p-5 md:p-7">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.10] text-primary shadow-[0_0_28px_rgba(var(--hub-primary-rgb),0.15)]"><Timer size={22} /></div>
                <div><p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-primary/75">Modo foco</p><h2 className="mt-1 text-2xl font-premium-title italic tracking-tight text-white">Dê espaço para uma sessão profunda.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">Um timer limpo, uma meta clara e o resto do app fica fora do caminho.</p></div>
              </div>
              <AnimatedButton onClick={() => goTo('/foco')} glow className="min-h-12 shrink-0 text-[11px] font-black uppercase tracking-[0.14em]"><Play size={16} fill="currentColor" /> Iniciar sessão</AnimatedButton>
            </div>
          </GlassCard>
        </motion.section>

        {isFree ? (
          <motion.section variants={staggerItem} className="mt-6">
            <button type="button" onClick={() => goTo('/premium')} className="flex w-full items-center justify-between gap-4 rounded-[20px] border border-white/[0.075] bg-white/[0.022] px-5 py-4 text-left transition hover:border-primary/25 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
              <span className="min-w-0"><span className="block text-sm font-bold text-white">Mais profundidade quando você precisar</span><span className="mt-1 block truncate text-xs text-text-secondary">Acesse recursos extras sem tirar o foco do seu plano.</span></span>
              <ArrowRight className="size-4 shrink-0 text-primary/80" />
            </button>
          </motion.section>
        ) : null}
      </motion.div>
    </div>
  );
};

export default DashboardView;