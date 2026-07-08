// External libs
import { motion, useReducedMotion } from 'motion/react';
import { staggerContainer, staggerItem } from '../../lib/animations/variants';
import { easings, springs } from '../../lib/animations/easings';

// Lucide icons
import {
  BarChart3,
  Target,
  Play,
  Users,
  BookOpen,
  Clock,
  Trophy,
  Brain,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
  Timer,
  Headset,
  BrainCircuit,
  BookOpenCheck,
  Swords,
  Crown,
  Layers,
  Quote,
  XCircle,
  FileText,
  PenTool,
  RotateCcw,
  Info
} from 'lucide-react';

// Stores
import { useStore } from '../../store';
import { useUserAccess } from '../../hooks/useUserAccess';

// Data
import { useQuestionMap } from '../../hooks/useQuestions';
import { QuestionsLoadingSkeleton } from '../../components/shared/QuestionsLoadingSkeleton';
import { QuestionsLoadError } from '../../components/shared/QuestionsLoadError';

// UI Components + utils
import {
  GlassCard,
  AnimatedButton,
  ProgressRing,
  NeonIcon,
  Badge,
  IconTile,
  cn
} from '../../components/UI';

// Utils
import { calculateDaysLeft } from '../../lib/studyUtils';
import { leagueTierProgressPercent } from '../../lib/leagueThresholds';

// Cross-view import
import { Heatmap } from '../../components/Heatmap';
import { AuroraBackground } from '../../components/fx/AuroraBackground';
import { NeonBadge } from '../../components/fx/NeonBadge';

import { useAppNavigation } from '../../app/router/useAppNavigation';

const DAILY_QUOTES = [
  { text: 'A jornada de mil milhas começa com um único passo.', author: 'Lao Tzu' },
  { text: 'Disciplina é liberdade quando você sabe onde quer chegar.', author: 'StudyFlow' },
  { text: 'O estudo de hoje é a tranquilidade da prova de amanhã.', author: 'StudyFlow' },
  { text: 'Pequenas sessões bem feitas vencem longas horas sem direção.', author: 'StudyFlow' },
  { text: 'Consistência transforma dificuldade em rotina.', author: 'StudyFlow' },
  { text: 'Você não precisa estar perfeito, precisa estar presente.', author: 'StudyFlow' },
  { text: 'O foco é uma decisão repetida várias vezes no mesmo dia.', author: 'StudyFlow' },
  { text: 'Revisar é respeitar o esforço que você já fez.', author: 'StudyFlow' },
  { text: 'A resposta certa começa antes da questão: começa no preparo.', author: 'StudyFlow' },
  { text: 'Estudar pouco todos os dias ainda é caminhar todos os dias.', author: 'StudyFlow' },
  { text: 'Quem mede o progresso aprende a acelerar sem se perder.', author: 'StudyFlow' },
  { text: 'Hoje é um bom dia para ficar um pouco mais forte.', author: 'StudyFlow' },
  { text: 'O aluno que volta para corrigir cresce mais rápido.', author: 'StudyFlow' },
  { text: 'Foco não é pressa; foco é direção.', author: 'StudyFlow' },
  { text: 'Uma questão corrigida vale mais que dez puladas.', author: 'StudyFlow' },
  { text: 'Você constrói confiança quando cumpre o combinado consigo mesmo.', author: 'StudyFlow' },
  { text: 'Cada erro encontrado é uma chance de subir de nível.', author: 'StudyFlow' },
  { text: 'Estudo inteligente é clareza, repetição e ajuste.', author: 'StudyFlow' },
  { text: 'O começo pode ser lento. O importante é não zerar o dia.', author: 'StudyFlow' },
  { text: 'A mente aprende melhor quando o plano é simples e constante.', author: 'StudyFlow' },
  { text: 'Não espere motivação: crie tração.', author: 'StudyFlow' },
  { text: 'O treino difícil deixa a prova mais familiar.', author: 'StudyFlow' },
  { text: 'Hoje você não precisa vencer tudo. Precisa vencer a próxima tarefa.', author: 'StudyFlow' },
  { text: 'O progresso aparece quando você para de negociar com a distração.', author: 'StudyFlow' },
  { text: 'Uma página entendida muda mais que um capítulo só passado.', author: 'StudyFlow' },
  { text: 'O melhor plano é aquele que você consegue repetir amanhã.', author: 'StudyFlow' },
  { text: 'Seu futuro agradece os minutos que você protege hoje.', author: 'StudyFlow' },
  { text: 'A prova cobra calma; o treino constrói calma.', author: 'StudyFlow' },
  { text: 'Aprender é voltar ao ponto fraco sem vergonha.', author: 'StudyFlow' },
  { text: 'Fazer o básico com excelência já coloca você na frente.', author: 'StudyFlow' },
  { text: 'A concentração cresce quando o ambiente para de mandar em você.', author: 'StudyFlow' },
  { text: 'Todo simulado é um mapa, não uma sentença.', author: 'StudyFlow' },
  { text: 'A constância é silenciosa, mas o resultado fala alto.', author: 'StudyFlow' },
  { text: 'Quem revisa cedo esquece menos tarde.', author: 'StudyFlow' },
  { text: 'Seu ritmo só precisa ser honesto, não perfeito.', author: 'StudyFlow' },
  { text: 'O difícil fica menor quando vira rotina.', author: 'StudyFlow' },
  { text: 'Estudar é transformar ansiedade em ação organizada.', author: 'StudyFlow' },
  { text: 'O próximo acerto nasce da última correção.', author: 'StudyFlow' },
  { text: 'A meta do dia é simples: sair melhor do que entrou.', author: 'StudyFlow' },
  { text: 'Quem treina com atenção ganha tempo na prova.', author: 'StudyFlow' },
  { text: 'A dúvida não é inimiga; é o começo da clareza.', author: 'StudyFlow' },
  { text: 'Faça a sessão pequena. Depois faça outra.', author: 'StudyFlow' },
  { text: 'Conhecimento fica quando você usa, explica e revisa.', author: 'StudyFlow' },
  { text: 'O seu foco merece proteção ativa.', author: 'StudyFlow' },
  { text: 'Uma rotina forte reduz a dependência da força de vontade.', author: 'StudyFlow' },
  { text: 'O estudo certo deixa rastros: notas, revisões e tentativas.', author: 'StudyFlow' },
  { text: 'Treine como quem está ensinando o cérebro a confiar.', author: 'StudyFlow' },
  { text: 'A melhor hora para recuperar o atraso é a próxima meia hora.', author: 'StudyFlow' },
  { text: 'Quem domina o tempo domina a prova antes dela começar.', author: 'StudyFlow' },
  { text: 'Não subestime uma boa sequência de dias simples.', author: 'StudyFlow' },
  { text: 'A excelência nasce quando ninguém está olhando.', author: 'StudyFlow' },
  { text: 'Clareza primeiro. Velocidade depois.', author: 'StudyFlow' },
  { text: 'Seu caderno de erros é um manual de evolução.', author: 'StudyFlow' },
  { text: 'A cada treino, você negocia menos com o medo.', author: 'StudyFlow' },
  { text: 'O estudo fica leve quando a próxima ação está clara.', author: 'StudyFlow' },
  { text: 'A disciplina começa pequena e termina gigante.', author: 'StudyFlow' },
  { text: 'Progresso real é repetir mesmo sem plateia.', author: 'StudyFlow' },
  { text: 'Uma sessão focada muda o tom do dia inteiro.', author: 'StudyFlow' },
  { text: 'O resultado não vem de um pico. Vem de uma sequência.', author: 'StudyFlow' },
  { text: 'Hoje é mais uma chance de provar compromisso em silêncio.', author: 'StudyFlow' },
] as const;

const DashboardView = () => {
  const { questionMap: QUESTION_MAP, loading: qLoading, error: qError } = useQuestionMap();
  const { name, profilePic, level, xp, sessions, history, exams, league, routine, dailyGoalMinutes } = useStore();
  const { isFree, isSupremo } = useUserAccess();
  const { goTo } = useAppNavigation();
  const reduceMotion = useReducedMotion() ?? false;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const goalProgress = Math.min(100, (todayStudyMinutes / dailyGoalMinutes) * 100);

  const getNextSession = () => {
    if (!routine) return null;
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = days[new Date().getDay()];
    const todaySchedule = routine.schedule.find(s => s.day === today);
    if (!todaySchedule || todaySchedule.blocks.length === 0) return null;
    return todaySchedule.blocks[0];
  };

  const nextSession = getNextSession();

  const studyTips = [
    "A técnica Pomodoro ajuda a manter o foco e evitar a fadiga mental.",
    "Tente explicar o que aprendeu para alguém (Técnica de Feynman) para consolidar o conhecimento.",
    "A repetição espaçada é a chave para a memória de longo prazo.",
    "Mantenha-se hidratado e faça pequenas pausas para alongar o corpo.",
    "O sono é fundamental para a consolidação da memória. Durma bem!",
    "Pratique o 'Active Recall' testando-se antes de reler o conteúdo.",
    "Varie os assuntos estudados no mesmo dia (Interleaving) para melhorar a flexibilidade mental."
  ];
  const dailyTip = studyTips[new Date().getDate() % studyTips.length];
  const todayForQuote = new Date();
  const localDayStart = new Date(todayForQuote.getFullYear(), todayForQuote.getMonth(), todayForQuote.getDate());
  const dailyQuote = DAILY_QUOTES[Math.floor(localDayStart.getTime() / 86400000) % DAILY_QUOTES.length];

  // Heatmap data (last 30 days for dashboard)
  const heatmapData = history.reduce((acc: any[], h) => {
    const date = h.timestamp.split('T')[0];
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  const recentActivity = history.slice(0, 3).map(h => ({
    id: h.questionId,
    type: 'question',
    title: QUESTION_MAP?.get(h.questionId)?.materia || 'Questão',
    subtitle: QUESTION_MAP?.get(h.questionId)?.assunto || 'Tópico',
    isCorrect: h.isCorrect,
    timestamp: h.timestamp
  }));

  if (qLoading) return <QuestionsLoadingSkeleton />;
  if (qError) return <QuestionsLoadError error={qError} />;

  return (
    <div className="studyflow-dashboard relative animate-in fade-in duration-700">
      <AuroraBackground intensity="subtle" />
      <div className="relative z-10 app-shell-premium pt-5 md:pt-8 premium-page-stack pb-32 md:pb-36">
      {/* Mission Control Header */}
      <header className="premium-page-hero studyflow-command-hero flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-premium-mono font-bold text-primary uppercase tracking-[0.22em]">Painel Ativo</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-premium-title italic leading-[0.98] md:text-5xl">
            Olá, {name}<span className="text-primary font-normal not-italic ml-1">.</span>
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <p
              className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest"
              title="Nível e liga com base no XP salvo neste aparelho."
            >
              Nível {level} • Liga {league}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => goTo('/estatisticas')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <BarChart3 size={20} className="text-primary" />
          </button>
          <AnimatedButton onClick={() => goTo('/perfil')} variant="secondary" className="relative p-0 rounded-2xl overflow-visible border-2 border-primary/20 hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="Profile" className="w-12 h-12 object-cover rounded-2xl" referrerPolicy="no-referrer" />
            {isSupremo && (
              <span
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500/100 border border-amber-200/100 flex items-center justify-center text-[11px] shadow-lg animate-breathe-glow"
                title="Modo Supremo ativo"
              >
                👑
              </span>
            )}
          </AnimatedButton>
        </div>
      </header>

      {/* Premium Banner */}
      {isFree && (
        <motion.section
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
        >
          <GlassCard
            glow
            className="premium-list-card p-5 border-primary/25 bg-primary/[0.045] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer group"
            onClick={() => goTo('/premium')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 neon-edge-subtle">
                <Crown size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold group-hover:text-primary transition-colors flex flex-wrap items-center gap-2">
                  <NeonBadge tone="primary" className="shrink-0">
                    Plus
                  </NeonBadge>
                  StudyFlow Premium
                </h4>
                <p className="text-xs text-text-secondary">Desbloqueie Athena ilimitada e simulados exclusivos.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              ASSINAR
              <ArrowUpRight size={16} />
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Daily Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="premium-stat-tile studyflow-holo-panel p-6 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Target size={16} />
              <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Meta Diária</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-premium-title italic">{todayStudyMinutes} / {dailyGoalMinutes} min</h3>
              <p className="text-xs text-text-secondary">Você completou {Math.round(goalProgress)}% da sua meta hoje.</p>
            </div>
            <AnimatedButton onClick={() => goTo('/foco')} variant="primary" className="py-2 px-4 text-xs mt-2 font-bold uppercase tracking-widest gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              <Play size={16} strokeWidth={2} fill="currentColor" />
              Continuar
            </AnimatedButton>
          </div>
          <ProgressRing progress={goalProgress} size={100} strokeWidth={10} />
        </GlassCard>

        <motion.div
          className="grid grid-cols-4 gap-3"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {[
            { id: 'focus', path: '/foco', icon: Timer, label: 'Foco', color: 'orange' },
            { id: 'ai', path: '/ai', icon: MessageSquare, label: 'Athena', color: 'purple' },
            { id: 'questions', path: '/questoes', icon: BookOpen, label: 'Questões', color: 'blue' },
            { id: 'comunidade', path: '/comunidade', icon: Headset, label: 'Comunidade', color: 'primary' },
          ].map(action => (
            <motion.div key={action.id} variants={staggerItem}>
              <motion.button
                whileTap={{ scale: reduceMotion ? 1 : 0.88 }}
                whileHover={reduceMotion ? { y: 0, scale: 1 } : { y: -3, scale: 1.04 }}
                transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.snappy}
                onClick={() => goTo(action.path)}
                className="premium-grid-card studyflow-action-tile w-full flex min-h-[7.25rem] flex-col items-center justify-center gap-2 p-3 glass rounded-[22px] border-white/10 hover:border-white/20 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <NeonIcon
                  icon={action.icon as any}
                  color={action.color as any}
                  size={22}
                  variant="outline"
                  animate="float"
                />
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">{action.label}</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Statistics Highlight Card */}
        <motion.button
          onClick={() => goTo('/estatisticas')}
          whileHover={
            reduceMotion
              ? { scale: 1 }
              : { scale: 1.02, boxShadow: '0 0 24px rgba(var(--hub-primary-rgb),0.15)' }
          }
          whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
          transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.snappy}
          className="premium-stats-tile studyflow-holo-panel w-full relative overflow-hidden rounded-3xl p-4 border border-primary/20 text-left my-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <div className="absolute -top-4 -right-4 opacity-15">
            <BarChart3 size={80} className="text-primary" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">Suas Estatísticas</div>
              <div className="text-[10px] text-white/70">Progresso, gráficos e insights</div>
            </div>
            <div className="text-[10px] font-bold text-primary">VER →</div>
          </div>
        </motion.button>
      </div>


      {/* AI Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Ferramentas de Estudo</h3>
          <div className="divider-premium-line ml-4" />
        </div>
        <motion.div
          className="grid grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { id: 'document-analyzer', path: '/analisador-documentos', icon: BookOpenCheck, label: 'Docs', color: 'cyan' },
            { id: 'video-summarizer', path: '/metodos/video', icon: Play, label: 'Vídeos', color: 'rose' },
            { id: 'memory-palace', path: '/palacio-memoria', icon: BrainCircuit, label: 'Palácio', color: 'purple' },
            { id: 'socratic-duel', path: '/duelo-socratico', icon: Swords, label: 'Duelo', color: 'amber' },
          ].map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <motion.button
                onClick={() => goTo(item.path)}
                whileTap={{ scale: reduceMotion ? 1 : 0.88 }}
                whileHover={reduceMotion ? { y: 0 } : { y: -3 }}
                transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.snappy}
                className="w-full flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
              >
                <IconTile icon={item.icon} color={item.color as any} glow className="group-hover:scale-105 transition-transform duration-200" />
                <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors mt-1">{item.label}</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Next Session from Routine */}
      {nextSession && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Próxima Sessão</h3>
            <AnimatedButton onClick={() => goTo('/foco')} variant="secondary" className="text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.08em] opacity-80 hover:opacity-100 min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Ver Tudo</AnimatedButton>
          </div>
          <GlassCard className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{nextSession.subject}</h4>
                  <p className="text-[10px] text-text-secondary uppercase font-premium-mono font-bold tracking-widest">{nextSession.duration} min • {nextSession.type}</p>
                </div>
              </div>
              <AnimatedButton onClick={() => goTo('/foco')} className="bg-primary text-black border-primary text-[10px] px-4 py-2 min-h-11 active:scale-[0.98] active:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Iniciar</AnimatedButton>
            </div>
          </GlassCard>
        </section>
      )}

      {/* League Progress — gamificação local (XP Zustand), sem claim de ranking global */}
      <GlassCard className="premium-list-card p-4 border-white/10 bg-black/20 flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
          animate={reduceMotion ? { rotate: 0 } : { rotate: [0, -8, 8, 0] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }
          }
        >
          <Trophy size={24} className="text-primary" />
        </motion.div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-end gap-2">
            <h4 className="text-xs font-bold uppercase tracking-widest">Liga {league}</h4>
            <span
              className="text-[10px] font-premium-mono text-text-secondary shrink-0 text-right"
              title="Progressão salva neste dispositivo. Não indica posição entre outros usuários."
            >
              Neste aparelho
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${leagueTierProgressPercent(xp)}%` }}
              viewport={{ once: true }}
              transition={
                reduceMotion
                  ? { duration: 0.15, ease: easings.smoothOut, delay: 0 }
                  : { duration: 1.2, ease: easings.smoothOut, delay: 0.2 }
              }
            />
          </div>
        </div>
      </GlassCard>


      {/* collective focus highlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.22em]">Ambiente de Foco</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.08em]">Foco Ativo</span>
          </div>
        </div>
        <GlassCard className="premium-list-card p-4 border-primary/20 bg-primary/[0.045] flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">Salas de Estudo Coletivo</h4>
              <p className="text-xs text-text-secondary">Entre em uma sala, ouça lofi e estude com outros alunos em tempo real.</p>
          </div>
          <AnimatedButton onClick={() => goTo('/comunidade')} className="text-[10px] px-4 py-2 min-h-11 active:scale-[0.98] active:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">Explorar</AnimatedButton>
        </GlassCard>
      </section>

      {/* Heatmap Mini */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Consistência</h3>
          </div>
          <button onClick={() => goTo('/estatisticas')} className="inline-flex items-center text-[10px] text-primary font-bold uppercase tracking-widest hover:underline min-h-11 px-2 active:scale-[0.98] active:brightness-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg">Ver Detalhes</button>
        </div>
        <GlassCard className="premium-list-card p-4 border-white/10 bg-black/20">
          <Heatmap data={heatmapData} />
        </GlassCard>
      </section>

      {/* Daily Motivation */}
      <GlassCard className="premium-list-card p-6 bg-gradient-to-br from-primary/12 to-transparent border-primary/25 text-center space-y-4">
        <Quote size={32} className="text-primary mx-auto opacity-50" />
        <div className="space-y-2">
          <p className="text-lg font-premium-title italic leading-tight">
            "{dailyQuote.text}"
          </p>
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">- {dailyQuote.author}</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4">
        <GlassCard
          className="premium-list-card relative overflow-hidden cursor-pointer group p-6 border-primary/20 bg-primary/[0.045]"
          onClick={() => goTo('/foco')}
          glow
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full transition-all group-hover:bg-primary/20 -mr-24 -mt-24" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-premium-mono font-bold uppercase tracking-[0.22em]">Sessão de Foco</span>
              </div>
              <h3 className="text-2xl font-premium-title italic">Continuar Estudo</h3>
              <p className="text-xs text-text-secondary font-medium opacity-90">Inicie uma sessão de foco agora</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,148,0.4)] group-hover:scale-110 transition-transform">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Atividade Recente</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <GlassCard key={i} className="p-4 flex items-center justify-between border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      activity.isCorrect ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}>
                      {activity.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{activity.title}</h4>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{activity.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-premium-mono text-text-secondary">
                    {new Date(activity.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        <GlassCard
          className="premium-list-card relative overflow-hidden cursor-pointer group p-6 border-orange-500/20 bg-orange-500/[0.045]"
          onClick={() => goTo('/simulados?treino=estrategico')}
          glow
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full transition-all group-hover:bg-orange-500/20 -mr-24 -mt-24" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[11px] font-premium-mono font-bold uppercase tracking-[0.22em]">Simulado do Dia</span>
              </div>
              <h3 className="text-2xl font-premium-title italic">Treino Estratégico</h3>
              <p className="text-xs text-text-secondary font-medium opacity-90">Questões recomendadas com base no seu histórico</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
          </div>
        </GlassCard>

        {/* Strategy Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Estratégia & Métodos</h3>
            </div>
            <button onClick={() => goTo('/explorar')} className="inline-flex items-center text-[10px] text-primary font-bold uppercase tracking-widest hover:underline min-h-11 px-2 active:scale-[0.98] active:brightness-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg">Explorar</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <GlassCard
              className="p-5 cursor-pointer hover:border-primary/40 transition-all group relative overflow-hidden"
              onClick={() => goTo('/metodos')}
              glow
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full" />
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                <Brain size={20} className="text-blue-500" />
              </div>
              <h4 className="text-sm font-bold mb-1">Métodos</h4>
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter opacity-60">Técnicas Avançadas</p>
            </GlassCard>
            <GlassCard
              className="p-5 cursor-pointer hover:border-primary/40 transition-all group relative overflow-hidden"
              onClick={() => goTo('/notas')}
              glow
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full" />
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors border border-primary/20">
                <Layers size={20} className="text-primary" />
              </div>
              <h4 className="text-sm font-bold mb-1">Flashcards</h4>
              <p className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter opacity-60">Repetição Espaçada</p>
            </GlassCard>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard
            className="premium-grid-card p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/10"
            onClick={() => goTo('/questoes')}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
              <BookOpen size={24} className="text-blue-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Questões</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Banco Real</p>
          </GlassCard>

          <GlassCard
            className="premium-grid-card p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/10"
            onClick={() => goTo('/redacao')}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition-colors border border-purple-500/10">
              <PenTool size={24} className="text-purple-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Redação</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Correção Guiada</p>
          </GlassCard>

          <GlassCard
            className="premium-grid-card p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/10"
            onClick={() => goTo('/simulados')}
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors border border-orange-500/10">
              <FileText size={24} className="text-orange-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Simulados</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Provas Completas</p>
          </GlassCard>

          <GlassCard
            className="premium-grid-card p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/10"
            onClick={() => {
              useStore.setState({ showOnlyReviewLater: false });
              useStore.getState().setNavFilters({ filterStatus: 'wrong' });
              goTo('/questoes');
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition-colors border border-red-500/10">
              <RotateCcw size={24} className="text-red-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Revisar Erros</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Últimas tentativas erradas</p>
          </GlassCard>
        </div>
      </div>

      {routine && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-medium">Cronograma de Hoje</h3>
            <button onClick={() => goTo('/foco')} className="text-xs text-primary font-medium uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-2 py-1">Ver tudo</button>
          </div>
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {(() => {
                    const today = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date().getDay()];
                    const todayPlan = routine.schedule.find(s => s.day.startsWith(today.substring(0, 3)));
                    if (!todayPlan || !todayPlan.blocks || todayPlan.blocks.length === 0) return 'Descanso';
                    return Array.from(new Set(todayPlan.blocks.map(b => b.subject))).join(', ');
                  })()}
                </p>
                <p className="text-sm text-text-secondary">
                  {(() => {
                    const today = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date().getDay()];
                    const todayPlan = routine.schedule.find(s => s.day.startsWith(today.substring(0, 3)));
                    if (!todayPlan || !todayPlan.blocks) return 0;
                    const mins = todayPlan.blocks.reduce((acc, b) => acc + b.duration, 0);
                    return Math.round((mins / 60) * 10) / 10;
                  })()}h de estudo hoje
                </p>
              </div>
            </div>
          </GlassCard>
        </section>
      )}

      {exams.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-display font-medium">Próximas Provas</h3>
            <button onClick={() => goTo('/simulados')} className="text-xs text-primary font-medium uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg px-2 py-1">Ver todas</button>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 2).map(exam => {
              const daysLeft = calculateDaysLeft(exam.data);
              return (
                <GlassCard
                  key={exam.id}
                  className="p-4 flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() =>
                    goTo(
                      exam.tipo === 'concurso'
                        ? '/simulados?filtro=concursos'
                        : '/simulados?filtro=vestibulares'
                    )
                  }
                >
                  <div>
                    <h4 className="font-medium text-sm">{exam.nome}</h4>
                    <p className="text-xs text-text-secondary">{exam.data ? new Date(exam.data).toLocaleDateString('pt-BR') : 'Edital em breve'}</p>
                  </div>
                  <div className="text-right">
                    {daysLeft !== null ? (
                      <>
                        <span className="text-2xl font-bold text-primary font-mono">{daysLeft}</span>
                        <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Dias</p>
                      </>
                    ) : (
                      <Badge variant="warning">Breve</Badge>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>
      )}

      {/* Daily Study Tip */}
      <GlassCard className="premium-list-card p-4 border-white/10 bg-white/[0.04] flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">Dica do Dia</p>
          <p className="text-xs text-text-secondary leading-relaxed">{dailyTip}</p>
        </div>
      </GlassCard>
      </div>
    </div>
  );
};

export default DashboardView;
