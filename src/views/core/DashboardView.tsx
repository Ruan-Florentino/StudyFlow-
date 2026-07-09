import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  Crown,
  FileText,
  Flame,
  GraduationCap,
  MessageCircle,
  PenLine,
  Play,
  Quote,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
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
  'Faça a sessão pequena. Depois faça outra.',  'Conhecimento fica quando você usa, explica e revisa.',
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

type SoftTileProps = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  text: string;
  meta?: string;
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

function SectionHeader({ label, title, action }: { label: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/70">{label}</p>
        <h2 className="mt-1 text-xl font-premium-title italic tracking-tight text-white md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SoftMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.035] px-4 py-3">
      <div className="flex items-center gap-2 text-white/45">
        <Icon size={14} />
        <span className="text-[9px] font-premium-mono font-bold uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-2 text-base font-black text-white">{value}</p>
    </div>
  );
}

function SoftTile({ icon, tone, title, text, meta, onClick }: SoftTileProps) {
  return (
    <GlassCard
      enterAnimation={false}
      onClick={onClick}
      className="group min-h-[150px] border-white/[0.08] bg-white/[0.028] p-5 hover:border-primary/25 hover:bg-white/[0.045]"
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <IconTile icon={icon} color={tone} size="md" glow={tone === 'primary'} />
          <ChevronRight className="mt-2 size-5 text-white/20 transition group-hover:translate-x-1 group-hover:text-primary/80" />
        </div>
        <div>
          {meta && <p className="mb-2 text-[9px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/35">{meta}</p>}
          <h3 className="text-base font-premium-title italic leading-tight text-white">{title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{text}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function TrailStep({ icon: Icon, title, text, active }: { icon: LucideIcon; title: string; text: string; active?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn('flex size-10 items-center justify-center rounded-2xl border', active ? 'border-primary/35 bg-primary/12 text-primary' : 'border-white/10 bg-white/[0.04] text-white/45')}>
          <Icon size={18} />
        </div>
        <div className="mt-3 h-full min-h-7 w-px bg-white/[0.08] last:hidden" />
      </div>
      <div className="min-w-0 pb-5">
        <p className="text-sm font-black text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">{text}</p>
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

  const today = new Date();
  const dayLabel = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][today.getDay()];
  const todayRoutine = routine?.schedule.find(item => item.day === dayLabel || item.day.startsWith(dayLabel.slice(0, 3)));
  const nextBlock = todayRoutine?.blocks[0] ?? null;
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const quoteIndex = Math.floor(dayStart.getTime() / 86400000) % DAILY_QUOTES.length;
  const quote = DAILY_QUOTES[quoteIndex];

  const upcomingExam = exams
    .map(exam => ({ ...exam, daysLeft: calculateDaysLeft(exam.data) }))
    .filter(exam => exam.daysLeft === null || exam.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999))[0];

  const recentQuestion = history[0] ? questionMap?.get(history[0].questionId) : null;
  const questionMetric = qLoading ? 'Carregando' : qError ? 'Offline' : `${formatNumber.format(questionCount)} questões`;

  const openWrongReview = () => {
    useStore.setState({ showOnlyReviewLater: false });
    useStore.getState().setNavFilters({ filterStatus: 'wrong' });
    goTo('/questoes');
  };

  const learningTiles: SoftTileProps[] = [
    {
      icon: BookOpen,
      tone: 'blue',
      title: 'Questões',
      text: 'Entre direto no banco e escolha uma lista para treinar com calma.',
      meta: questionMetric,
      onClick: () => goTo('/questoes'),
    },
    {
      icon: PenLine,
      tone: 'purple',
      title: 'Redação',
      text: 'Continue um rascunho, abra temas e acompanhe sua evolução.',
      meta: 'Produção guiada',
      onClick: () => goTo('/redacao'),
    },
    {
      icon: MessageCircle,
      tone: 'primary',
      title: 'Athena',
      text: 'Use a tutora para tirar dúvidas sem sair do seu fluxo de estudo.',
      meta: isFree ? 'Plano gratuito' : 'Acesso ativo',
      onClick: () => goTo('/ai'),
    },
    {
      icon: FileText,
      tone: 'amber',
      title: 'Simulados',
      text: 'Treine por objetivo quando quiser uma sessão mais completa.',
      meta: 'Prova e revisão',
      onClick: () => goTo('/simulados'),
    },
  ];

  return (
    <div className="studyflow-dashboard relative min-h-full animate-in fade-in duration-700">
      <AuroraBackground intensity="subtle" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_48%_0%,rgba(var(--hub-primary-rgb),0.11),transparent_64%)]" />

      <motion.div
        className="relative z-10 app-shell-premium pb-32 pt-5 md:pb-36 md:pt-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.header variants={staggerItem} className="mb-7 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/[0.08] text-primary">
              <GraduationCap size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/65">StudyFlow</p>
              <h1 className="truncate text-2xl font-premium-title italic tracking-tight text-white md:text-3xl">Olá, {name || 'Ruan'}.</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo('/perfil')}
            className="relative size-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
        </motion.header>
        <motion.section variants={staggerItem} className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="overflow-hidden border-white/[0.08] bg-white/[0.032] p-5 md:p-7">
            <div className="pointer-events-none absolute -right-28 -top-28 size-64 rounded-full bg-primary/[0.10] blur-[90px]" />
            <div className="relative grid gap-7 lg:grid-cols-[1fr_172px] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-white/55">
                  <Sparkles size={13} className="text-primary" />
                  Plano de estudo do dia
                </div>

                <div className="max-w-xl">
                  <h2 className="text-4xl font-premium-title italic leading-[0.96] tracking-tight text-white md:text-5xl">
                    Estude com mais calma e direção.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
                    A Home agora mostra só o que ajuda você a começar: uma sessão, uma trilha curta e os espaços principais de estudo.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AnimatedButton onClick={() => goTo('/foco')} glow className="min-h-14 flex-1 text-[12px] font-black uppercase tracking-[0.16em] sm:flex-none">
                    <Play size={17} fill="currentColor" /> Começar sessão
                  </AnimatedButton>
                  <AnimatedButton onClick={() => goTo('/explorar')} variant="secondary" className="min-h-14 flex-1 text-[12px] font-black uppercase tracking-[0.16em] sm:flex-none">
                    <Compass size={17} /> Explorar trilhas
                  </AnimatedButton>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-[172px] flex-col items-center gap-4 rounded-[30px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <ProgressRing progress={goalProgress} size={126} strokeWidth={10} />
                <div className="text-center">
                  <p className="text-[9px] font-premium-mono font-black uppercase tracking-[0.18em] text-primary/70">Meta de hoje</p>
                  <p className="mt-1 text-sm font-black text-white">{formatMinutes(todayStudyMinutes)} / {formatMinutes(safeDailyGoalMinutes)}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-white/[0.08] bg-white/[0.028] p-5 md:p-6">
            <SectionHeader label="Sua trilha" title="Próximos passos" />
            <div className="mt-6">
              <TrailStep
                active
                icon={Timer}
                title={nextBlock ? `Começar por ${nextBlock.subject}` : 'Abrir modo foco'}
                text={nextBlock ? `${formatMinutes(nextBlock.duration)} de ${nextBlock.type === 'practice' ? 'prática' : nextBlock.type === 'review' ? 'revisão' : 'teoria'} para iniciar o dia.` : 'Use um bloco curto para aquecer antes de estudar pesado.'}
              />
              <TrailStep
                icon={BookOpen}
                title="Resolver uma lista curta"
                text={answeredCount > 0 ? `${formatNumber.format(answeredCount)} questões já registradas no seu histórico.` : 'Comece com poucas questões e revise com atenção.'}
              />
              <TrailStep
                icon={RotateCcw}
                title="Fechar revisando erros"
                text={wrongCount > 0 ? `${wrongCount} erro(s) prontos para revisão.` : 'Quando errar, o Flow transforma isso em material de evolução.'}
              />
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={staggerItem} className="mt-5 grid gap-3 sm:grid-cols-3">
          <SoftMetric icon={Flame} label="Streak" value={`${streak || 0} dias`} />
          <SoftMetric icon={Target} label="Precisão" value={`${accuracy}%`} />
          <SoftMetric icon={Trophy} label="Nível" value={`${level} • ${league}`} />
        </motion.section>

        <motion.section variants={staggerItem} className="mt-8 space-y-4">
          <SectionHeader
            label="Espaços de estudo"
            title="Escolha uma área"
            action={
              <button
                type="button"
                onClick={() => goTo('/estatisticas')}
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-premium-mono font-black uppercase tracking-[0.18em] text-white/50 transition hover:border-primary/25 hover:text-primary sm:inline-flex"
              >
                Ver evolução <ArrowRight size={13} />
              </button>
            }
          />
          <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
            {learningTiles.map(tile => (
              <motion.div key={tile.title} variants={staggerItem}>
                <SoftTile {...tile} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
        <motion.section variants={staggerItem} className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <GlassCard className="border-white/[0.08] bg-white/[0.028] p-5 md:p-6">
            <div className="flex items-start gap-4">
              <IconTile icon={Quote} color="primary" size="md" glow />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.22em] text-primary/65">Frase do dia {quoteIndex + 1}/60</p>
                <p className="mt-3 text-2xl font-premium-title italic leading-tight text-white">“{quote}”</p>
                <p className="mt-3 text-[10px] font-premium-mono font-bold uppercase tracking-[0.18em] text-text-secondary">StudyFlow</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-5">
            <GlassCard className="border-white/[0.08] bg-white/[0.028] p-5">
              <div className="flex items-center gap-4">
                <IconTile icon={CalendarDays} color="cyan" size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-primary/65">Radar</p>
                  {upcomingExam ? (
                    <>
                      <p className="mt-1 truncate text-base font-black text-white">{upcomingExam.nome}</p>
                      <p className="text-xs text-text-secondary">{upcomingExam.daysLeft ?? '--'} dias para a prova</p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-base font-black text-white">Sem prova cadastrada</p>
                      <p className="text-xs text-text-secondary">Cadastre uma meta quando quiser organizar prazos.</p>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-white/[0.08] bg-white/[0.028] p-5">
              <div className="flex items-center gap-4">
                <IconTile icon={CheckCircle2} color={recentQuestion ? 'primary' : 'violet'} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-premium-mono font-black uppercase tracking-[0.2em] text-primary/65">Último registro</p>
                  <p className="mt-1 truncate text-base font-black text-white">{recentQuestion?.materia || 'Comece pelo primeiro treino'}</p>
                  <p className="text-xs text-text-secondary">{recentQuestion?.assunto || 'Seu histórico aparece aqui com calma, sem poluir a tela.'}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        {isFree && (
          <motion.section variants={staggerItem} className="mt-8">
            <button
              type="button"
              onClick={() => goTo('/premium')}
              className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-primary/15 bg-primary/[0.035] px-5 py-4 text-left transition hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <Crown size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-white">StudyFlow Premium</span>
                  <span className="block truncate text-xs text-text-secondary">Athena ampliada, simulados e recursos extras.</span>
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-primary/80" />
            </button>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardView;