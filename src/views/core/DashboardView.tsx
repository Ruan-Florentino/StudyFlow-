// React
import { useEffect } from 'react';

// External libs
import { motion } from 'motion/react';
import Markdown from 'react-markdown';

// Lucide icons
import {
  BarChart3,
  Target,
  Play,
  Users,
  Award,
  BookOpen,
  Zap,
  Clock,
  Flame,
  Trophy,
  Star,
  Brain,
  Layout,
  ChevronRight,
  Calendar,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  PlusCircle,
  MessageSquare,
  Dna,
  Sparkles,
  Calculator,
  Mic,
  Music,
  Globe,
  Search,
  Database,
  AlertTriangle,
  Heart,
  Timer,
  Headset,
  BrainCircuit,
  Grid,
  Library,
  BookOpenCheck,
  Swords,
  UploadCloud,
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

// Services
import { aiService } from '../../services/aiService';

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

// Cross-view import
import { Heatmap } from '../../components/Heatmap';

import { useAppNavigation } from '../../app/router/useAppNavigation';

const DashboardView = () => {
  const { questionMap: QUESTION_MAP, loading: qLoading, error: qError } = useQuestionMap();
  const { name, profilePic, streak, xp, level, sessions, history, exams, league, dailyXP, routine, dailyGoalMinutes, smartRecommendation, setSmartRecommendation, neuralSync, plan } = useStore();
  const { goTo } = useAppNavigation();


  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!smartRecommendation && history.length > 0) {
        try {
          const rec = await aiService.generateSmartRecommendation(history, level);
          setSmartRecommendation(rec);
        } catch (error) {
          console.error("Erro ao gerar recomendação:", error);
        }
      }
    };
    fetchRecommendation();
  }, [history, smartRecommendation, level, setSmartRecommendation]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayHistory = history.filter(h => h.timestamp.startsWith(todayStr));
  const todayQuestions = todayHistory.length;
  const todayCorrect = todayHistory.filter(h => h.isCorrect).length;
  const todayAccuracy = todayQuestions > 0 ? Math.round((todayCorrect / todayQuestions) * 100) : 0;

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
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Mission Control Header */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">System Online</span>
          </div>
          <h1 className="text-3xl font-premium-title italic leading-tight">
            Olá, {name}<span className="text-primary font-normal not-italic ml-1">.</span>
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <p className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest">Nível {level} • {league}</p>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(xp % 1000) / 10}%` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => goTo('/estatisticas')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors flex items-center justify-center"
          >
            <BarChart3 size={20} className="text-primary" style={{ filter: 'drop-shadow(0 0 6px #00E88F)' }} />
          </button>
          <AnimatedButton onClick={() => goTo('/perfil')} variant="secondary" className="p-0 rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
            <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="Profile" className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
          </AnimatedButton>
        </div>
      </header>

      {/* Premium Banner */}
      {plan === 'free' && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard 
            glow 
            className="p-5 border-primary/30 bg-primary/5 flex items-center justify-between cursor-pointer group"
            onClick={() => goTo('/premium')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Crown size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold group-hover:text-primary transition-colors">StudyFlow Premium</h4>
                <p className="text-xs text-text-secondary">Desbloqueie IA ilimitada e simulados exclusivos.</p>
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
        <GlassCard className="p-6 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Target size={16} />
              <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Meta Diária</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-premium-title italic">{todayStudyMinutes} / {dailyGoalMinutes} min</h3>
              <p className="text-xs text-text-secondary">Você completou {Math.round(goalProgress)}% da sua meta hoje.</p>
            </div>
            <AnimatedButton onClick={() => goTo('/foco')} variant="primary" className="py-2 px-4 text-xs mt-2 font-bold uppercase tracking-widest gap-2">
              <Play size={16} strokeWidth={2} fill="currentColor" />
              Continuar
            </AnimatedButton>
          </div>
          <ProgressRing progress={goalProgress} size={100} strokeWidth={10} />
        </GlassCard>

        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'focus', path: '/foco', icon: Timer, label: 'Foco', color: 'orange' },
            { id: 'ai', path: '/ai', icon: MessageSquare, label: 'IA', color: 'purple' },
            { id: 'questions', path: '/questoes', icon: BookOpen, label: 'Questões', color: 'blue' },
            { id: 'comunidade', path: '/comunidade', icon: Headset, label: 'Comunidade', color: 'primary' },
          ].map(action => (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => goTo(action.path)}
              className="flex flex-col items-center gap-2 p-3 glass rounded-2xl border-white/5 hover:border-white/20 transition-all group"
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
          ))}
        </div>

        {/* Dashboard Statistics Highlight Card */}
        <motion.button
          onClick={() => goTo('/estatisticas')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full relative overflow-hidden rounded-3xl p-4 border border-primary/20 text-left my-4"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0,232,143,0.1), rgba(0,232,143,0.02))',
            boxShadow: '0 0 30px rgba(0,232,143,0.1)'
          }}
        >
          <div className="absolute -top-4 -right-4 opacity-15">
            <BarChart3 size={80} className="text-primary" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" style={{ filter: 'drop-shadow(0 0 6px #00E88F)' }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">Suas Estatísticas</div>
              <div className="text-[10px] text-white/50">Progresso, gráficos e insights</div>
            </div>
            <div className="text-[10px] font-bold text-primary">VER →</div>
          </div>
        </motion.button>
      </div>

      {/* Mission Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star size={40} className="text-primary" />
          </div>
          <div className="flex items-center gap-2 text-primary">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Star size={14} fill="currentColor" />
            </motion.div>
            <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Energia</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-premium-mono font-bold">{xp.toLocaleString()}</div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">XP Acumulado</div>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 1000) / 10}%` }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={40} className="text-orange-500" />
          </div>
          <div className="flex items-center gap-2 text-orange-500">
            <Flame size={14} fill="currentColor" />
            <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Sequência</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-premium-mono font-bold">{streak} Dias</div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Fogo Ativo</div>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={cn("h-1 flex-1 rounded-full", i <= (streak % 5 || 5) ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-white/5")} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Neural Sync Full Width Card */}
      <GlassCard className="p-4 space-y-3 relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <BrainCircuit size={60} className="text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <BrainCircuit size={14} />
            <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Neural Sync</span>
          </div>
          <span className="text-xs text-blue-500/70 font-mono">{neuralSync}%</span>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-premium-mono font-bold text-blue-500">Estado de Fluxo</div>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${neuralSync}%` }}
            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
        </div>
      </GlassCard>

      {/* AI Intelligence Hub */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Intelligence Hub</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        
        {smartRecommendation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-5 border-primary/20 bg-primary/5 relative overflow-hidden group cursor-pointer" onClick={() => goTo('/' + smartRecommendation.actionTab)}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,148,0.3)]">
                  {smartRecommendation.icon === 'Zap' && <Zap size={24} fill="currentColor" />}
                  {smartRecommendation.icon === 'BookOpen' && <BookOpen size={24} />}
                  {smartRecommendation.icon === 'Target' && <Target size={24} />}
                  {smartRecommendation.icon === 'Brain' && <Brain size={24} />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-premium-mono font-bold text-primary uppercase tracking-widest">Recomendação IA</span>
                    <Badge variant={smartRecommendation.priority === 'high' ? 'danger' : 'primary'} className="text-[8px] px-2 py-0">
                      {smartRecommendation.priority === 'high' ? 'Urgente' : 'Sugerido'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{smartRecommendation.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{smartRecommendation.description}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center space-y-4 border-dashed">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <p className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest">Sincronizando com a IA...</p>
          </GlassCard>
        )}
      </section>

      {/* Quick Access Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Quick Access</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { id: 'focus', path: '/foco', icon: Timer, label: 'Foco', color: 'orange' },
            { id: 'methods', path: '/metodos', icon: Grid, label: 'Métodos', color: 'primary' },
            { id: 'comunidade', path: '/comunidade', icon: Headset, label: 'Salas', color: 'violet' },
            { id: 'anki', path: '/notas', icon: Library, label: 'Flash', color: 'blue' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <IconTile icon={item.icon} color={item.color as any} glow className="group-active:scale-95" />
              <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Ferramentas IA</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { id: 'document-analyzer', path: '/analisador-documentos', icon: BookOpenCheck, label: 'Docs', color: 'cyan' },
            { id: 'video-summarizer', path: '/metodos/video', icon: Play, label: 'Vídeos', color: 'rose' },
            { id: 'memory-palace', path: '/palacio-memoria', icon: BrainCircuit, label: 'Palácio', color: 'purple' },
            { id: 'socratic-duel', path: '/duelo-socratico', icon: Swords, label: 'Duelo', color: 'amber' },
            { id: 'brain-upload', path: '/upload-cerebral', icon: UploadCloud, label: 'Upload', color: 'blue' },
            { id: 'god-mode', path: '/god-mode', icon: Crown, label: 'God Mode', color: 'primary' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <IconTile icon={item.icon} color={item.color as any} glow className="group-active:scale-95" />
              <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Next Session from Routine */}
      {nextSession && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Próxima Missão</h3>
            <AnimatedButton onClick={() => goTo('/foco')} variant="secondary" className="text-[9px] px-3 py-1 rounded-full uppercase tracking-widest opacity-50 hover:opacity-100">Ver Tudo</AnimatedButton>
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
              <AnimatedButton onClick={() => goTo('/foco')} className="bg-primary text-black border-primary text-[10px] px-4 py-2">Iniciar</AnimatedButton>
            </div>
          </GlassCard>
        </section>
      )}

      {/* League Progress */}
      <GlassCard className="p-4 border-white/5 bg-black/20 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Trophy size={24} className="text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-end">
            <h4 className="text-xs font-bold uppercase tracking-widest">Liga {league}</h4>
            <span className="text-[10px] font-premium-mono text-text-secondary">TOP 5%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[75%]" />
          </div>
        </div>
      </GlassCard>

      {/* Daily Challenge */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Desafio Diário</h3>
          <div className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[8px] font-bold text-orange-500 uppercase tracking-widest">Bônus +500 XP</div>
        </div>
        <GlassCard className="p-4 border-orange-500/20 bg-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={40} className="text-orange-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-orange-500/30">
              <Zap size={24} fill="currentColor" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Mestre do Foco</h4>
              <p className="text-xs text-text-secondary">Complete 2 sessões de Pomodoro de 25 min hoje.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-orange-500">0/2</p>
              <p className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">Sessões</p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* collective focus highlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Ambiente de Foco</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Protocolo Ativo</span>
          </div>
        </div>
        <GlassCard className="p-4 border-primary/20 bg-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Users size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">Salas de Estudo Coletivo</h4>
            <p className="text-xs text-text-secondary">Entre em uma sala, ouça lofi e estude com outros fifeiros em tempo real.</p>
          </div>
          <AnimatedButton onClick={() => goTo('/comunidade')} className="text-[10px] px-4 py-2">Explorar</AnimatedButton>
        </GlassCard>
      </section>

      {/* Heatmap Mini */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Consistência</h3>
          </div>
          <button onClick={() => goTo('/estatisticas')} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Ver Detalhes</button>
        </div>
        <GlassCard className="p-4 border-white/5 bg-black/20">
          <Heatmap data={heatmapData} />
        </GlassCard>
      </section>

      {/* Daily Motivation */}
      <GlassCard className="p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/30 text-center space-y-4">
        <Quote size={32} className="text-primary mx-auto opacity-50" />
        <div className="space-y-2">
          <p className="text-lg font-premium-title italic leading-tight">
            "A jornada de mil milhas começa com um único passo."
          </p>
          <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">— Lao Tzu</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4">
        <GlassCard 
          className="relative overflow-hidden cursor-pointer group p-6 border-primary/20 bg-primary/5" 
          onClick={() => goTo('/foco')}
          glow
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full transition-all group-hover:bg-primary/20 -mr-24 -mt-24" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.3em]">Sessão de Foco</span>
              </div>
              <h3 className="text-2xl font-premium-title italic">Continuar Estudo</h3>
              <p className="text-xs text-text-secondary font-medium opacity-70">Ative o protocolo Pomodoro agora</p>
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
          className="relative overflow-hidden cursor-pointer group p-6 border-orange-500/20 bg-orange-500/5" 
          onClick={() => goTo('/exames')}
          glow
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full transition-all group-hover:bg-orange-500/20 -mr-24 -mt-24" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-orange-500 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-[0.3em]">Simulado do Dia</span>
              </div>
              <h3 className="text-2xl font-premium-title italic">Treino Estratégico</h3>
              <p className="text-xs text-text-secondary font-medium opacity-70">Baseado no seu desempenho recente</p>
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
            <button onClick={() => goTo('/explorar')} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Explorar</button>
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
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => goTo('/questoes')}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
              <BookOpen size={24} className="text-blue-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Questões</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Banco Real</p>
          </GlassCard>

          <GlassCard 
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => goTo('/redacao')}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition-colors border border-purple-500/10">
              <PenTool size={24} className="text-purple-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Redação</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Correção IA</p>
          </GlassCard>

          <GlassCard 
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => goTo('/exames')}
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5 group-hover:bg-orange-500/20 transition-colors border border-orange-500/10">
              <FileText size={24} className="text-orange-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Simulados</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Provas Completas</p>
          </GlassCard>

          <GlassCard 
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => {
              useStore.setState({ showOnlyReviewLater: true });
              goTo('/questoes');
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5 group-hover:bg-red-500/20 transition-colors border border-red-500/10">
              <RotateCcw size={24} className="text-red-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Revisar Erros</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Aprenda Mais</p>
          </GlassCard>
        </div>
      </div>

      {routine && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-medium">Cronograma de Hoje</h3>
            <button onClick={() => goTo('/foco')} className="text-xs text-primary font-medium uppercase tracking-wider">Ver tudo</button>
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
            <button onClick={() => goTo('/exames')} className="text-xs text-primary font-medium uppercase tracking-wider">Ver todas</button>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 2).map(exam => {
              const daysLeft = calculateDaysLeft(exam.data);
              return (
                <GlassCard key={exam.id} className="p-4 flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => goTo('/exames')}>
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
      <GlassCard className="p-4 border-white/5 bg-white/5 flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">Dica do Dia</p>
          <p className="text-xs text-text-secondary leading-relaxed">{dailyTip}</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardView;
