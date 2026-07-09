import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock3,
  Compass,
  Crown,
  FileText,
  Flame,
  LineChart,
  MessageSquare,
  PenLine,
  Play,
  Quote,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';

import { useAppNavigation } from '../../app/router/useAppNavigation';
import { Heatmap } from '../../components/Heatmap';
import { AuroraBackground } from '../../components/fx/AuroraBackground';
import { NeonBadge } from '../../components/fx/NeonBadge';
import { AnimatedButton, Badge, GlassCard, IconTile, ProgressRing, cn } from '../../components/UI';
import { useQuestionMap } from '../../hooks/useQuestions';
import { useUserAccess } from '../../hooks/useUserAccess';
import { easings } from '../../lib/animations/easings';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { leagueTierProgressPercent } from '../../lib/leagueThresholds';
import { calculateDaysLeft } from '../../lib/studyUtils';
import { useStore } from '../../store';

const formatNumber = new Intl.NumberFormat('pt-BR');

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

const STUDY_TIPS = [
  'Comece pela tarefa mais curta para ganhar tração.',
  'Corrija erros no mesmo dia em que eles aparecem.',
  'Use blocos de 25 minutos quando o foco estiver baixo.',
  'Explique o tema em voz alta para testar se entendeu.',
  'Misture teoria, questões e revisão para fixar melhor.',
  'Pausas pequenas protegem energia para a próxima sessão.',
  'Antes de reler, tente lembrar o conteúdo de cabeça.',
] as const;

type IconTone = 'primary' | 'orange' | 'blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'violet';

type TileProps = {
  icon: LucideIcon;
  tone: IconTone;
  title: string;
  subtitle: string;
  metric: string;
  onClick: () => void;
};

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.24em] text-primary/80">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-premium-title italic tracking-tight text-white md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatPill({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-2 text-white/60">
        <Icon size={14} />
        <span className="text-[9px] font-premium-mono font-bold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 font-premium-title text-lg font-black leading-none text-white">{value}</p>
    </div>
  );
}
function HomeTile({ icon, tone, title, subtitle, metric, onClick }: TileProps) {
  return (
    <GlassCard
      enterAnimation={false}
      onClick={onClick}
      className="group min-h-[168px] border-white/10 bg-white/[0.035] p-5 hover:border-primary/35"
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <IconTile icon={icon} color={tone} size="md" glow={tone === 'primary'} />
          <ChevronRight className="mt-2 size-5 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-white/45">{metric}</p>
          <h3 className="mt-2 text-lg font-premium-title italic leading-tight text-white">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">{subtitle}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function TimelineBlock({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'size-2.5 rounded-full border',
          active ? 'border-primary bg-primary shadow-[0_0_18px_rgba(var(--hub-primary-rgb),0.5)]' : 'border-white/20 bg-white/10'
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{label}</p>
        <p className="truncate text-[10px] font-premium-mono font-bold uppercase tracking-[0.16em] text-text-secondary">{value}</p>
      </div>
    </div>
  );
}

const DashboardView = () => {
  const { questionMap, loading: qLoading, error: qError } = useQuestionMap();
  const {
    name,
    profilePic,
    level,
    xp,
    streak,
    sessions,
    history,
    exams,
    league,
    routine,
    dailyGoalMinutes,
  } = useStore();
  const { isFree, isSupremo } = useUserAccess();
  const { goTo } = useAppNavigation();
  const reduceMotion = useReducedMotion() ?? false;

  const todayKey = localDateKey();
  const todaySessions = sessions.filter(session => session.date === todayKey);
  const todayStudyMinutes = todaySessions.reduce((acc, session) => acc + session.duration, 0);
  const safeDailyGoalMinutes = Math.max(1, Number(dailyGoalMinutes) || 1);
  const goalProgress = Math.min(100, Math.max(0, (todayStudyMinutes / safeDailyGoalMinutes) * 100));
  const answeredCount = history.length;
  const correctCount = history.filter(item => item.isCorrect).length;
  const wrongCount = Math.max(0, answeredCount - correctCount);
  const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
  const questionCount = questionMap?.size ?? 0;
  const leagueProgress = leagueTierProgressPercent(xp);

  const today = new Date();
  const todayLabel = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][today.getDay()];
  const todayRoutine = routine?.schedule.find(item => item.day === todayLabel || item.day.startsWith(todayLabel.slice(0, 3)));
  const routineMinutes = todayRoutine?.blocks.reduce((acc, block) => acc + block.duration, 0) ?? 0;
  const nextBlock = todayRoutine?.blocks[0] ?? null;
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dailyQuoteIndex = Math.floor(dayStart.getTime() / 86400000) % DAILY_QUOTES.length;
  const dailyQuote = DAILY_QUOTES[dailyQuoteIndex];
  const dailyTip = STUDY_TIPS[today.getDate() % STUDY_TIPS.length];

  const heatmapData = Object.entries(
    history.reduce<Record<string, number>>((acc, item) => {
      const date = item.timestamp.split('T')[0];
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([date, count]) => ({ date, count }))
    .slice(-30);

  const recentActivity = history.slice(0, 4).map(item => {
    const question = questionMap?.get(item.questionId);
    return {
      id: `${item.questionId}-${item.timestamp}`,
      title: question?.materia || 'Questão resolvida',
      subtitle: question?.assunto || 'Banco de questões',
      isCorrect: item.isCorrect,
    };
  });
  const upcomingExam = exams
    .map(exam => ({ ...exam, daysLeft: calculateDaysLeft(exam.data) }))
    .filter(exam => exam.daysLeft === null || exam.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999))[0];

  const openWrongReview = () => {
    useStore.setState({ showOnlyReviewLater: false });
    useStore.getState().setNavFilters({ filterStatus: 'wrong' });
    goTo('/questoes');
  };

  const questionMetric = qLoading ? 'Carregando' : qError ? 'Modo offline' : `${formatNumber.format(questionCount)} itens`;
  const primaryCards: TileProps[] = [
    {
      icon: BookOpen,
      tone: 'blue',
      title: 'Banco de Questões',
      subtitle: 'Treine ENEM, vestibulares, concursos e militares.',
      metric: questionMetric,
      onClick: () => goTo('/questoes'),
    },
    {
      icon: Timer,
      tone: 'orange',
      title: 'Foco Profundo',
      subtitle: 'Entre em uma sessão limpa, rápida e sem distração.',
      metric: `${Math.round(goalProgress)}% da meta`,
      onClick: () => goTo('/foco'),
    },
    {
      icon: PenLine,
      tone: 'purple',
      title: 'Redação',
      subtitle: 'Abra temas, rascunhos e correção guiada.',
      metric: 'ENEM 1000',
      onClick: () => goTo('/redacao'),
    },
    {
      icon: MessageSquare,
      tone: 'primary',
      title: 'Athena V3',
      subtitle: 'Tire dúvidas e transforme assuntos em treino.',
      metric: isFree ? 'Limite diário' : 'Ilimitada',
      onClick: () => goTo('/ai'),
    },
  ];

  const tacticalCards = [
    { icon: RotateCcw, label: 'Revisar erros', value: `${wrongCount} pontos fracos`, tone: 'rose' as IconTone, onClick: openWrongReview },
    { icon: FileText, label: 'Simulados', value: 'Prova completa', tone: 'amber' as IconTone, onClick: () => goTo('/simulados') },
    { icon: Compass, label: 'Explorar', value: 'Rotas de estudo', tone: 'cyan' as IconTone, onClick: () => goTo('/explorar') },
    { icon: Trophy, label: 'Ranking', value: `${formatNumber.format(xp)} XP`, tone: 'primary' as IconTone, onClick: () => goTo('/ranking') },
  ];

  return (
    <div className="studyflow-dashboard relative min-h-full animate-in fade-in duration-700">
      <AuroraBackground intensity="subtle" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--hub-primary-rgb),0.18),transparent_62%)]" />

      <motion.div
        className="relative z-10 app-shell-premium pb-32 pt-5 md:pb-36 md:pt-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.header variants={staggerItem} className="mb-6 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_28px_rgba(var(--hub-primary-rgb),0.16)]">
              <Sparkles className="size-5 text-primary" />
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-black bg-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.24em] text-primary/80">StudyFlow OS</p>
              <h1 className="truncate text-2xl font-premium-title italic tracking-tight text-white md:text-3xl">
                Olá, {name || 'Ruan'}.
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo('/estatisticas')}
              className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-white/80 transition hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Abrir estatísticas"
            >
              <BarChart3 size={19} />
            </button>
            <button
              type="button"
              onClick={() => goTo('/perfil')}
              className="relative size-12 overflow-hidden rounded-2xl border border-primary/25 bg-white/[0.055] transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label="Abrir perfil"
            >
              <img
                src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'StudyFlow')}`}
                alt="Perfil"
                className="size-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isSupremo && <span className="absolute right-1 top-1 size-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />}
            </button>
          </div>
        </motion.header>
        <motion.section variants={staggerItem} className="grid gap-5 xl:grid-cols-[1.28fr_0.72fr]">
          <GlassCard glow className="overflow-hidden border-primary/25 bg-[linear-gradient(135deg,rgba(0,232,143,0.13),rgba(255,255,255,0.035)_42%,rgba(59,130,246,0.08))] p-5 md:p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-[90px]" />
            <div className="relative grid gap-7 lg:grid-cols-[1fr_220px] lg:items-center">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <NeonBadge tone="primary">Painel ativo</NeonBadge>
                  <Badge variant="secondary" className="border-white/10 bg-black/20">Nível {level}</Badge>
                  <Badge variant="secondary" className="border-white/10 bg-black/20">Liga {league}</Badge>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-4xl font-premium-title italic leading-[0.94] tracking-tight text-white md:text-6xl">
                    Continue em <span className="text-primary">flow</span> hoje.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
                    Uma Home mais limpa para entrar em foco, responder questões e acompanhar sua evolução sem ruído.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AnimatedButton onClick={() => goTo('/foco')} glow className="min-h-14 flex-1 text-[12px] font-black uppercase tracking-[0.18em] sm:flex-none">
                    <Play size={17} fill="currentColor" /> Entrar em Flow
                  </AnimatedButton>
                  <AnimatedButton onClick={() => goTo('/questoes')} variant="secondary" className="min-h-14 flex-1 text-[12px] font-black uppercase tracking-[0.18em] sm:flex-none">
                    <Search size={17} /> Treinar questões
                  </AnimatedButton>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-4 rounded-[32px] border border-white/10 bg-black/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
                <ProgressRing progress={goalProgress} size={150} strokeWidth={12} />
                <div className="text-center">
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/80">Meta diária</p>
                  <p className="mt-1 text-lg font-premium-title font-black text-white">
                    {formatMinutes(todayStudyMinutes)} / {formatMinutes(safeDailyGoalMinutes)}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/75">Status do aluno</p>
                  <h3 className="mt-2 text-2xl font-premium-title italic text-white">Progresso real</h3>
                </div>
                <IconTile icon={Flame} color="orange" size="md" glow />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatPill icon={Zap} label="Streak" value={`${streak || 0} dias`} />
                <StatPill icon={Target} label="Precisão" value={`${accuracy}%`} />
                <StatPill icon={BookOpen} label="Resolvidas" value={formatNumber.format(answeredCount)} />
                <StatPill icon={Clock3} label="Hoje" value={formatMinutes(todayStudyMinutes)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/50">
                  <span>Progresso da liga</span>
                  <span>{Math.round(leagueProgress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--hub-primary),#4ad8ff)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${leagueProgress}%` }}
                    transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : { duration: 1.1, ease: easings.smoothOut }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        {isFree && (
          <motion.section variants={staggerItem} className="mt-5">
            <GlassCard onClick={() => goTo('/premium')} className="border-primary/25 bg-primary/[0.055] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <IconTile icon={Crown} color="amber" size="md" glow />
                  <div>
                    <h3 className="text-sm font-black text-white">Desbloquear StudyFlow Premium</h3>
                    <p className="text-xs text-text-secondary">Athena ampliada, simulados e recursos avançados sem interrupção.</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-primary">
                  Ver planos <ArrowRight size={14} />
                </span>
              </div>
            </GlassCard>
          </motion.section>
        )}

        <motion.section variants={staggerItem} className="mt-7 space-y-4">
          <SectionHeader
            eyebrow="Ações principais"
            title="Escolha o próximo movimento"
            action={
              <button
                type="button"
                onClick={() => goTo('/explorar')}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-white/60 transition hover:border-primary/35 hover:text-primary sm:inline-flex"
              >
                Explorar <ArrowRight size={13} />
              </button>
            }
          />
          <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            {primaryCards.map(card => (
              <motion.div key={card.title} variants={staggerItem}>
                <HomeTile {...card} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
        <motion.section variants={staggerItem} className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-start gap-4">
              <IconTile icon={Quote} color="primary" size="md" glow />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/75">
                  Frase do dia {dailyQuoteIndex + 1}/60
                </p>
                <p className="mt-3 text-2xl font-premium-title italic leading-tight text-white">“{dailyQuote}”</p>
                <p className="mt-3 text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-text-secondary">StudyFlow</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 bg-white/[0.035] p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <IconTile icon={Calendar} color="cyan" size="md" />
                <div>
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/75">Plano de hoje</p>
                  <h3 className="mt-2 text-xl font-premium-title italic text-white">
                    {nextBlock ? nextBlock.subject : routine ? 'Dia leve programado' : 'Monte sua rotina'}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {nextBlock
                      ? `${formatMinutes(nextBlock.duration)} de ${nextBlock.type === 'practice' ? 'prática' : nextBlock.type === 'review' ? 'revisão' : 'teoria'} hoje.`
                      : routine
                        ? `Sem blocos pendentes. Total planejado: ${formatMinutes(routineMinutes)}.`
                        : 'Crie um plano semanal para o Flow organizar seus estudos.'}
                  </p>
                </div>
              </div>
              <AnimatedButton onClick={() => goTo(routine ? '/foco' : '/rotina')} variant="secondary" className="min-h-12 shrink-0 text-[11px] font-black uppercase tracking-[0.16em]">
                {routine ? 'Abrir foco' : 'Criar rotina'} <ArrowRight size={14} />
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-7 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <GlassCard className="border-white/10 bg-white/[0.035] p-5 md:p-6">
            <SectionHeader eyebrow="Controle tático" title="Atalhos que resolvem" />
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tacticalCards.map(card => (
                <button
                  key={card.label}
                  type="button"
                  onClick={card.onClick}
                  className="group flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/20 p-4 text-left transition hover:border-primary/30 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <IconTile icon={card.icon} color={card.tone} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-white">{card.label}</p>
                    <p className="truncate text-[10px] font-premium-mono font-bold uppercase tracking-[0.16em] text-text-secondary">{card.value}</p>
                  </div>
                  <ChevronRight className="size-4 text-white/25 transition group-hover:translate-x-1 group-hover:text-primary" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 bg-white/[0.035] p-5 md:p-6">
            <SectionHeader eyebrow="Próxima prova" title="Radar de prazo" />
            <div className="mt-5">
              {upcomingExam ? (
                <button
                  type="button"
                  onClick={() => goTo('/simulados')}
                  className="w-full rounded-[26px] border border-primary/20 bg-primary/[0.055] p-5 text-left transition hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-premium-title italic text-white">{upcomingExam.nome}</p>
                      <p className="mt-1 text-xs text-text-secondary">{upcomingExam.data ? new Date(upcomingExam.data).toLocaleDateString('pt-BR') : 'Data em breve'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-premium-title text-4xl font-black text-primary">{upcomingExam.daysLeft ?? '--'}</p>
                      <p className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/50">dias</p>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-3">
                    <IconTile icon={Trophy} color="blue" size="md" />
                    <div>
                      <p className="text-sm font-black text-white">Nenhuma prova cadastrada</p>
                      <p className="text-xs text-text-secondary">Use simulados para criar uma meta de prova.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.section>
        <motion.section variants={staggerItem} className="mt-7 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <GlassCard className="border-white/10 bg-white/[0.035] p-5 md:p-6">
            <SectionHeader eyebrow="Consistência" title="Últimos treinos" />
            <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
              {heatmapData.length > 0 ? (
                <Heatmap data={heatmapData} />
              ) : (
                <div className="flex min-h-24 items-center justify-center text-center text-sm text-text-secondary">
                  Resolva questões para acender seu mapa de estudo.
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="border-white/10 bg-white/[0.035] p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <SectionHeader eyebrow="Agora" title="Feed de evolução" />
              <AnimatedButton onClick={() => goTo('/estatisticas')} variant="ghost" className="min-h-10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
                Ver tudo
              </AnimatedButton>
            </div>

            <div className="mt-5 space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <TimelineBlock
                    key={activity.id}
                    active={index === 0}
                    label={activity.title}
                    value={`${activity.isCorrect ? 'Acertou' : 'Errou'} • ${activity.subtitle}`}
                  />
                ))
              ) : (
                <>
                  <TimelineBlock active label="Primeiro treino aguardando" value="Abra o banco de questões" />
                  <TimelineBlock label="Depois revise os erros" value="O Flow monta seu mapa" />
                  <TimelineBlock label="Feche com foco profundo" value={dailyTip} />
                </>
              )}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-7">
          <GlassCard className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,rgba(0,232,143,0.08),rgba(255,255,255,0.035))] p-5 md:p-6">
            <div className="pointer-events-none absolute -bottom-20 right-0 size-64 rounded-full bg-primary/10 blur-[90px]" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <IconTile icon={LineChart} color="primary" size="md" glow />
                <div>
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/75">Sistema recomenda</p>
                  <h3 className="mt-2 text-2xl font-premium-title italic text-white">Treino estratégico</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-text-secondary">
                    Combine questões, revisão e foco para transformar o histórico em progresso mensurável.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AnimatedButton onClick={() => goTo('/simulados?treino=estrategico')} className="min-h-12 text-[11px] font-black uppercase tracking-[0.16em]">
                  Iniciar simulado <ArrowRight size={14} />
                </AnimatedButton>
                <AnimatedButton onClick={() => goTo('/metodos')} variant="secondary" className="min-h-12 text-[11px] font-black uppercase tracking-[0.16em]">
                  Ver métodos
                </AnimatedButton>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default DashboardView;
