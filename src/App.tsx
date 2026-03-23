import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Timer, 
  MessageSquare, 
  BookOpen, 
  User, 
  Flame, 
  Plus, 
  Brain, 
  FileText,
  Play,
  Pause,
  Check,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Search,
  Settings,
  Trophy,
  LogOut,
  Send,
  Shield,
  ShieldAlert,
  X,
  ArrowRight,
  HelpCircle,
  Sparkles,
  AlertCircle,
  Calendar,
  Clock,
  Target,
  Award,
  BarChart2,
  Layers,
  Map as MapIcon,
  Zap,
  MoreHorizontal,
  ChevronLeft,
  Download,
  Share2,
  Network,
  RefreshCw,
  Trash2,
  PenTool,
  Shuffle,
  XCircle,
  GraduationCap,
  Filter,
  ArrowLeft,
  Star,
  BarChart3,
  Crown,
  CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore, Message, Question, Note, MindMap, ExamDetail, StudyRoutine } from './store/useStore';
import { AnimatedButton, GlassCard, ProgressRing, QuickAccessCard, Logo, Badge, MindMapNode, cn } from './components/UI';
import { aiService } from './services/aiService';
import Markdown from 'react-markdown';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { ALL_QUESTIONS, TOPICS, EXAM_STATS } from './data/questions';

// --- Screens ---

const StudyMethods = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const methods = [
    { id: 'feynman', name: 'Método Feynman', icon: Brain, desc: 'Explique como se fosse para uma criança.', color: 'text-blue-400' },
    { id: 'pomodoro', name: 'Pomodoro', icon: Timer, desc: 'Foco intenso com intervalos curtos.', color: 'text-red-400' },
    { id: 'active-recall', name: 'Active Recall', icon: Zap, desc: 'Force seu cérebro a recuperar a informação.', color: 'text-yellow-400' },
    { id: 'anki', name: 'Spaced Repetition', icon: Layers, desc: 'Revisões programadas com flashcards.', color: 'text-primary' },
    { id: 'blurting', name: 'Blurting', icon: PenTool, desc: 'Escreva tudo o que lembra sobre um tema.', color: 'text-purple-400' },
    { id: 'interleaving', name: 'Interleaving', icon: Shuffle, desc: 'Alterne entre diferentes matérias.', color: 'text-orange-400' },
  ];

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('home')} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Métodos de Estudo</h2>
      </header>

      <div className="grid gap-4">
        {methods.map((m) => (
          <GlassCard 
            key={m.id} 
            className="flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => onNavigate(m.id)}
          >
            <div className={clsx("p-3 rounded-2xl bg-white/5", m.color)}>
              <m.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{m.name}</h3>
              <p className="text-xs text-text-secondary">{m.desc}</p>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ onStartFlow, onNavigate }: { onStartFlow: () => void, onNavigate: (tab: any) => void }) => {
  const { name, streak, xp, level, sessions, history, exams, league, dailyXP, routine } = useStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayHistory = history.filter(h => h.timestamp.startsWith(todayStr));
  const todayQuestions = todayHistory.length;
  const todayCorrect = todayHistory.filter(h => h.isCorrect).length;
  const todayAccuracy = todayQuestions > 0 ? Math.round((todayCorrect / todayQuestions) * 100) : 0;

  const todayMinutes = sessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.duration, 0);
  
  const dailyGoal = 120;
  const progress = Math.min((todayMinutes / dailyGoal) * 100, 100);

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div className="space-y-0.5">
            <p className="text-text-secondary text-[10px] font-premium-mono font-bold uppercase tracking-[0.3em]">Bem-vindo de volta</p>
            <h2 className="text-2xl font-premium-title font-bold tracking-tight uppercase">{name || 'Estudante'}</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-2xl border border-white/10">
            <Flame size={16} className="text-orange-500" fill="currentColor" />
            <span className="font-premium-mono font-bold text-sm">{streak}</span>
          </motion.div>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <Target size={18} className="text-primary mb-1" />
          <span className="text-lg font-bold font-premium-mono">{todayQuestions}</span>
          <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Hoje</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <CheckCircle size={18} className="text-green-400 mb-1" />
          <span className="text-lg font-bold font-premium-mono">{todayAccuracy}%</span>
          <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Precisão</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <Zap size={18} className="text-yellow-400 mb-1" />
          <span className="text-lg font-bold font-premium-mono">{dailyXP}</span>
          <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">XP Hoje</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center text-center" onClick={() => onNavigate('ranking')}>
          <Trophy size={18} className="text-purple-400 mb-1" />
          <span className="text-sm font-bold font-premium-mono truncate w-full">{league}</span>
          <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Liga</span>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard 
          className="col-span-2 relative overflow-hidden border-primary/20 p-6 cursor-pointer group" 
          glow
          onClick={() => onNavigate('questions')}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -mr-16 -mt-16 rounded-full transition-all group-hover:bg-primary/30" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Play size={20} fill="currentColor" />
                <span className="text-xs font-premium-mono font-bold uppercase tracking-[0.2em]">Modo Foco</span>
              </div>
              <h3 className="text-2xl font-premium-title">Continuar Treino</h3>
              <p className="text-xs text-text-secondary">Resolva questões do banco real</p>
            </div>
            <ChevronRight size={32} className="text-white/20 group-hover:text-primary transition-colors" />
          </div>
        </GlassCard>

        <GlassCard 
          className="relative overflow-hidden border-red-500/20 p-5 cursor-pointer group"
          onClick={() => onNavigate('questions')} // TODO: pass mode='review'
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[40px] -mr-12 -mt-12 rounded-full transition-all group-hover:bg-red-500/20" />
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Revisar Erros</h3>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">Aprenda com falhas</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard 
          className="relative overflow-hidden border-blue-500/20 p-5 cursor-pointer group"
          onClick={() => onNavigate('exams')}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -mr-12 -mt-12 rounded-full transition-all group-hover:bg-blue-500/20" />
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Target size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Simulado</h3>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">Provas reais</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Network, label: 'Mapas', id: 'mindmap' },
          { icon: Layers, label: 'Anki', id: 'anki' },
          { icon: BarChart2, label: 'Stats', id: 'reports' },
          { icon: MessageSquare, label: 'Tutor IA', id: 'ai' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
          >
            <item.icon size={20} className="text-text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{item.label}</span>
          </button>
        ))}
      </div>

      {exams.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Provas Próximas
            </h3>
            <button onClick={() => onNavigate('exams')} className="text-xs text-primary font-bold uppercase tracking-widest">Ver Todas</button>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 2).map(exam => {
              const daysLeft = calculateDaysLeft(exam.data);
              return (
                <GlassCard key={exam.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{exam.nome}</p>
                      <p className="text-[10px] text-text-secondary uppercase font-bold">
                        {exam.data ? new Date(exam.data).toLocaleDateString('pt-BR') : 'Edital em breve'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {daysLeft !== null ? (
                      <>
                        <p className="text-lg font-black text-primary leading-none">{daysLeft}</p>
                        <p className="text-[8px] text-text-secondary uppercase font-bold">Dias</p>
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

      {routine && (
        <section className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Plano de Hoje
          </h3>
          <div className="space-y-3">
            {routine.schedule[0].subjects.map((s, i) => (
              <div key={i} className="glass p-4 rounded-3xl flex items-center justify-between border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium text-sm">{s}</span>
                </div>
                <span className="text-[10px] text-text-secondary font-bold uppercase">2h sugeridas</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

const FocusSession = ({ onBack }: { onBack: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const { addSession, toggleAppBlocker, isAppBlockerActive } = useStore();

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      toggleAppBlocker(false);
      if (mode === 'work') {
        addSession({
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString().split('T')[0],
          duration: 25,
          subject: 'Sessão de Foco'
        });
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, addSession, toggleAppBlocker]);

  const handleToggle = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    if (mode === 'work') {
      toggleAppBlocker(newActive);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] space-y-12 pb-24">
      <header className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <h2 className="text-lg font-bold">Foco</h2>
        </div>
        <Badge variant={isAppBlockerActive ? 'primary' : 'warning'}>
          {isAppBlockerActive ? 'Blocker Ativo' : 'Blocker Inativo'}
        </Badge>
      </header>

      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tighter">{mode === 'work' ? 'MODO FOCO' : 'DESCANSO'}</h2>
        <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">Sessão {mode === 'work' ? 'de Estudo' : 'de Pausa'}</p>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full border-8 border-white/5" />
        <svg width="300" height="300" className="transform -rotate-90">
          <motion.circle
            cx="150"
            cy="150"
            r="140"
            stroke="#00FF94"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={140 * 2 * Math.PI}
            animate={{ strokeDashoffset: (140 * 2 * Math.PI) * (1 - progress / 100) }}
            strokeLinecap="round"
            className={isActive ? 'animate-pulse-glow' : ''}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-black font-mono tracking-tighter">{formatTime(timeLeft)}</span>
          <div className="flex items-center gap-2 mt-2 text-primary">
            <Shield size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">App Blocker</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white/10 text-white' : 'bg-primary text-black green-glow-strong'}`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { setIsActive(false); toggleAppBlocker(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); }}
          className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
        >
          <RotateCcw size={32} />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="glass p-4 rounded-3xl text-center border-border">
          <p className="text-xs text-text-secondary uppercase font-bold">Sessão</p>
          <p className="text-xl font-bold">01/04</p>
        </div>
        <div className="glass p-4 rounded-3xl text-center border-border">
          <p className="text-xs text-text-secondary uppercase font-bold">Foco Total</p>
          <p className="text-xl font-bold">25m</p>
        </div>
      </div>
    </div>
  );
};

const TypingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return <Markdown>{displayedText}</Markdown>;
};

const AIChat = () => {
  const { chatHistory, addChatMessage, addFlashcard, addNote, setRoutine } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (customInput?: string) => {
    const messageText = customInput || input;
    if (!messageText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    addChatMessage(userMsg);
    if (!customInput) setInput('');
    setLoading(true);

    try {
      const result = await aiService.smartChat(messageText);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.type === 'text' ? result.text : `Gerei o seu ${result.type} com sucesso!`,
        timestamp: new Date().toISOString(),
        type: result.type as any,
        data: result.data,
        engine: result.engine
      };
      addChatMessage(aiMsg);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: string, data: any) => {
    if (type === 'flashcards') {
      data.forEach((f: any) => addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.question,
        back: f.answer,
        subject: 'IA Generated',
        deckId: '1',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      }));
      alert('Flashcards adicionados ao seu deck!');
    } else if (type === 'plan') {
      const routine: StudyRoutine = {
        id: Math.random().toString(36).substr(2, 9),
        targetExam: data.subject || 'Plano IA',
        dailyHours: 4,
        schedule: data.tasks.map((t: any, i: number) => ({
          day: `Dia ${i + 1}`,
          subjects: [t.title]
        }))
      };
      setRoutine(routine);
      alert('Plano de estudos configurado!');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background pb-24">
      <header className="p-6 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="font-premium-title text-lg">StudyFlow AI</h2>
            <p className="text-[10px] text-primary font-premium-mono font-bold uppercase tracking-[0.2em]">Intelligent Assistant</p>
          </div>
        </div>
        <button onClick={() => useStore.getState().clearChat()} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-white transition-colors">
          <RotateCcw size={18} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-50">
            <div className="w-24 h-24 bg-primary/10 rounded-[48px] flex items-center justify-center text-primary green-glow">
              <Brain size={56} />
            </div>
            <div className="space-y-3">
              <h3 className="font-premium-title text-2xl">StudyFlow AI v2.5</h3>
              <p className="text-sm max-w-[280px] mx-auto text-text-secondary leading-relaxed">
                Especialista em estudos, concursos e produtividade. Como posso acelerar seu aprendizado hoje?
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {['/explique', '/plano', '/questoes', '/resumo'].map(cmd => (
                  <span key={cmd} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-premium-mono text-primary">{cmd}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[90%] p-4 rounded-3xl ${
              msg.role === 'user' 
                ? 'bg-primary text-black font-medium' 
                : 'bg-card border border-border text-white'
            }`}>
              {msg.engine && (
                <div className="text-[8px] font-bold uppercase tracking-widest text-primary/50 mb-1">
                  Engine: {msg.engine}
                </div>
              )}
              <div className="prose prose-invert prose-sm max-w-none">
                {msg.role === 'model' && idx === chatHistory.length - 1 && loading === false ? (
                  <TypingText text={msg.text} />
                ) : (
                  <Markdown>{msg.text}</Markdown>
                )}
              </div>

              {msg.type === 'flashcards' && (
                <button 
                  onClick={() => handleAction('flashcards', msg.data)}
                  className="mt-3 w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Adicionar ao Deck
                </button>
              )}

              {msg.type === 'plan' && (
                <button 
                  onClick={() => handleAction('plan', msg.data)}
                  className="mt-3 w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Ativar Cronograma
                </button>
              )}
            </div>

            {msg.role === 'model' && idx === chatHistory.length - 1 && !loading && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar w-full">
                {[
                  { label: 'Criar Flashcards', cmd: '/flashcards' },
                  { label: 'Gerar Questões', cmd: '/questoes' },
                  { label: 'Ver Mapa Mental', cmd: '/mapa' },
                  { label: 'Criar Plano', cmd: '/plano' }
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(`${btn.cmd} sobre o assunto anterior`)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:bg-white/10 transition-all"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border p-4 rounded-3xl flex gap-1">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte ou use /comandos..."
            className="w-full bg-card border border-border rounded-3xl py-4 pl-6 pr-14 focus:border-primary outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 w-10 h-10 rounded-2xl bg-primary text-black flex items-center justify-center disabled:opacity-50 transition-opacity shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Constants & Mock Data ---

const SUBJECTS = TOPICS;

// --- Study Methods Screens ---

// --- Study Methods Screens ---

const calculateDaysLeft = (date: string | undefined) => {
  if (!date) return null;
  const today = new Date();
  const examDate = new Date(date);
  if (isNaN(examDate.getTime())) return null;
  const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

const AIPlanView = ({ exam, onBack }: { exam: ExamDetail; onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);
  const { setRoutine } = useStore();

  useEffect(() => {
    const generate = async () => {
      try {
        const res = await aiService.generateExamPlan(exam.nome, exam.materias, exam.data);
        setPlan(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, [exam]);

  const handleStartRoutine = () => {
    if (!plan) return;
    // Convert plan to routine format
    const routine: StudyRoutine = {
      id: Math.random().toString(36).substr(2, 9),
      targetExam: exam.nome,
      dailyHours: 4, // default
      schedule: plan.weeks[0].days.map((d: any) => ({
        day: d.day,
        subjects: d.subjects
      }))
    };
    setRoutine(routine);

    // Mock: Create initial Anki cards for the exam
    const { addFlashcard, addNote } = useStore.getState();
    exam.materias.forEach(subject => {
      addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: `O que é mais importante estudar em ${subject} para o ${exam.nome}?`,
        back: `Consulte o plano de estudos gerado pela IA para ver os tópicos prioritários de ${subject}.`,
        subject,
        deckId: '1',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      });
    });

    // Mock: Add a note with the plan summary
    addNote({
      id: Math.random().toString(36).substr(2, 9),
      title: `Plano de Estudos: ${exam.nome}`,
      content: `Iniciado em ${new Date().toLocaleDateString()}. Foco total no ${exam.nome}.`,
      subject: 'Geral',
      updatedAt: new Date().toISOString()
    });

    onBack();
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse">IA Gerando Plano Estratégico...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold">Plano: {exam.nome}</h2>
          <Badge variant="primary">IA Optimized</Badge>
        </div>
      </header>

      <div className="space-y-6">
        {plan?.weeks.map((week: any) => (
          <div key={week.weekNumber} className="space-y-3">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Semana {week.weekNumber}: {week.focus}</h3>
            <div className="space-y-3">
              {week.days.map((day: any, i: number) => (
                <GlassCard key={i} className="py-3 px-4 flex justify-between items-center border-white/5">
                  <div>
                    <p className="font-bold text-sm">{day.day}</p>
                    <div className="flex gap-2 mt-1">
                      {day.subjects.map((s: string, j: number) => (
                        <span key={j} className="text-[10px] text-text-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">{day.hours}h</p>
                    {day.isSimulado && <Badge variant="danger">Simulado</Badge>}
                    {day.isReview && <Badge variant="warning">Revisão</Badge>}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatedButton onClick={handleStartRoutine} className="w-full py-4" glow>
        Iniciar Rotina de Estudos
        <Calendar size={18} />
      </AnimatedButton>
    </div>
  );
};

const SimuladoView = ({ exam, onBack }: { exam: ExamDetail; onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Filter real questions for the selected exam
        const filtered = ALL_QUESTIONS.filter(q => q.prova === exam.nome);
        // If no questions found for specific exam, take some from related subjects
        const res = filtered.length > 0 ? filtered : ALL_QUESTIONS.filter(q => exam.materias.includes(q.materia)).slice(0, 10);
        setQuestions(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [exam]);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse">IA Montando Simulado Realista...</p>
      </div>
    );
  }

  if (showResult) {
    const correctCount = answers.filter((a, i) => a === questions[i].resposta).length;
    const score = (correctCount / questions.length) * 100;

    return (
      <div className="p-6 space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-black italic">RESULTADO</h2>
          <p className="text-text-secondary uppercase text-xs font-bold tracking-widest">{exam.nome}</p>
        </div>

        <div className="relative flex justify-center">
          <ProgressRing progress={score} size={200} strokeWidth={15} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black">{correctCount}/{questions.length}</span>
            <span className="text-[10px] text-text-secondary font-bold uppercase">Acertos</span>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard className="text-left space-y-4">
            <h3 className="font-bold border-b border-white/5 pb-2">Análise de Desempenho</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Tempo Médio</span>
                <span className="font-bold">2m 15s / questão</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Nível de Dificuldade</span>
                <span className="font-bold text-primary">{exam.nivel}</span>
              </div>
            </div>
          </GlassCard>
          <AnimatedButton onClick={onBack} className="w-full">Voltar para Provas</AnimatedButton>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  if (!q) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-text-secondary font-bold">Nenhuma questão encontrada para este simulado.</p>
        <AnimatedButton onClick={onBack}>Voltar</AnimatedButton>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <button onClick={onBack} className="text-text-secondary"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Simulado IA</p>
          <p className="text-xs font-bold">{exam.nome}</p>
        </div>
        <div className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {currentIndex + 1}/{questions.length}
        </div>
      </header>

      <div className="space-y-6">
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <GlassCard className="min-h-[200px] flex items-center justify-center text-center p-8">
          <p className="text-lg font-medium leading-relaxed">{q.pergunta}</p>
        </GlassCard>

        <div className="space-y-3">
          {q.alternativas.map((opt: string, i: number) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className="w-full p-4 glass rounded-2xl text-left border-border hover:border-primary/50 transition-all flex gap-4 items-center group"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-black transition-all">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-sm font-medium">{opt}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Exams = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (tab: string) => void }) => {
  const { exams, favoriteExams, toggleFavoriteExam } = useStore();
  const [filter, setFilter] = useState<'all' | 'vestibular' | 'concurso' | 'upcoming' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamDetail | null>(null);
  const [view, setView] = useState<'list' | 'plan' | 'simulado'>('list');

  const filteredExams = exams
    .filter(e => {
      if (!e) return false;
      const nome = e.nome || '';
      const descricao = e.descricao || '';
      const matchesSearch = nome.toLowerCase().includes(search.toLowerCase()) || 
                           descricao.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === 'all') return true;
      if (filter === 'vestibular') return e.tipo === 'vestibular';
      if (filter === 'concurso') return e.tipo === 'concurso';
      if (filter === 'upcoming') {
        const days = calculateDaysLeft(e.data);
        return days !== null && days < 60;
      }
      if (filter === 'favorites') return favoriteExams.includes(e.id);
      return true;
    })
    .sort((a, b) => {
      const dateA = a.data ? new Date(a.data).getTime() : Infinity;
      const dateB = b.data ? new Date(b.data).getTime() : Infinity;
      return dateA - dateB;
    });

  if (view === 'plan' && selectedExam) {
    return <AIPlanView exam={selectedExam} onBack={() => setView('list')} />;
  }

  if (view === 'simulado' && selectedExam) {
    return <SimuladoView exam={selectedExam} onBack={() => setView('list')} />;
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold">Provas 2026</h2>
          </div>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar prova..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary w-40"
            />
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'vestibular', 'concurso', 'upcoming', 'favorites'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                filter === f ? "bg-primary text-black border-primary" : "bg-white/5 text-text-secondary border-white/10"
              )}
            >
              {f === 'all' ? 'Todos' : 
               f === 'vestibular' ? 'Vestibulares' : 
               f === 'concurso' ? 'Concursos' : 
               f === 'upcoming' ? 'Próximos' : 
               'Favoritos'}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {filteredExams.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-text-secondary">
              <Search size={32} />
            </div>
            <p className="text-text-secondary font-medium">Nenhuma prova encontrada.</p>
          </div>
        ) : (
          filteredExams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.data);
            const isFavorite = favoriteExams.includes(exam.id);
            const formattedDate = exam.data ? new Date(exam.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Edital em breve';

            return (
              <GlassCard key={exam.id} className="space-y-6 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                {daysLeft !== null && daysLeft < 30 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-4 py-1 rotate-45 translate-x-4 -translate-y-1 uppercase tracking-widest">
                    Urgente
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:green-glow transition-all">
                      <Target size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{exam.nome}</h3>
                        <Badge variant={
                          exam.nivel === 'Muito Difícil' ? 'danger' : 
                          exam.nivel === 'Difícil' ? 'orange' : 
                          exam.nivel === 'Médio' ? 'warning' : 
                          'success'
                        }>
                          {exam.nivel}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{exam.tipo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => toggleFavoriteExam(exam.id)}
                      className={clsx("p-2 rounded-xl border transition-all", isFavorite ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-text-secondary")}
                    >
                      <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <div className="text-right">
                      {daysLeft !== null ? (
                        <>
                          <p className="text-3xl font-black text-primary leading-none tracking-tighter">{daysLeft}</p>
                          <p className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">Dias Restantes</p>
                        </>
                      ) : (
                        <Badge variant="warning">Edital em breve</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Calendar size={14} className="text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(exam.materias || []).map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-[9px] text-text-secondary border border-white/10 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <AnimatedButton 
                    onClick={() => { setSelectedExam(exam); setView('plan'); }} 
                    className="flex-1 py-3 text-[10px] font-bold"
                    glow
                  >
                    Plano IA
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="secondary" 
                    onClick={() => { setSelectedExam(exam); setView('simulado'); }} 
                    className="flex-1 py-3 text-[10px] font-bold"
                  >
                    Simulado
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="secondary" 
                    onClick={() => onNavigate('focus')} 
                    className="flex-1 py-3 text-[10px] font-bold border-primary/20 text-primary"
                  >
                    Estudar
                  </AnimatedButton>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

const MindMapScreen = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<MindMap | null>(null);
  const { addMindMap, mindMaps } = useStore();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateMindMap(topic);
      const newMap = {
        id: Math.random().toString(36).substr(2, 9),
        topic: res.topic,
        nodes: res.nodes,
        createdAt: new Date().toISOString()
      };
      setMap(newMap);
      addMindMap(newMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Mapa Mental IA</h2>
      </header>

      {!map ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual o tema do mapa?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Revolução Industrial, Mitose..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4" glow disabled={loading}>
              {loading ? 'Gerando Conexões...' : 'Gerar Mapa Mental'}
              <Network size={18} />
            </AnimatedButton>
          </GlassCard>

          {mindMaps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-text-secondary uppercase">Mapas Recentes</h3>
              <div className="grid gap-3">
                {mindMaps.map((m) => (
                  <GlassCard key={m.id} onClick={() => setMap(m)} className="flex items-center justify-between py-3 cursor-pointer hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <Network size={18} className="text-primary" />
                      <span className="font-bold text-sm">{m.topic}</span>
                    </div>
                    <ChevronRight size={16} className="text-white/20" />
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">{map.topic}</h3>
            <div className="flex gap-2">
              <button onClick={() => setMap(null)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                <RotateCcw size={18} />
              </button>
              <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-[40px] border-primary/20 bg-primary/5 min-h-[400px] flex flex-col items-center justify-center gap-12 overflow-x-auto">
            <MindMapNode label={map.topic} color="border-primary" />
            <div className="flex flex-wrap justify-center gap-8">
              {map.nodes.map((node, i) => (
                <MindMapNode key={i} label={node.label} subNodes={node.subNodes} color="border-white/20" />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <AnimatedButton className="flex-1 py-3 text-sm" variant="secondary">
              <Share2 size={18} /> Compartilhar
            </AnimatedButton>
            <AnimatedButton className="flex-1 py-3 text-sm" onClick={() => setMap(null)}>
              Novo Mapa
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const FeynmanMethod = ({ onBack }: { onBack: () => void }) => {
  const [subject, setSubject] = useState('');
  const [explanation, setExplanation] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!subject || !explanation) return;
    setLoading(true);
    try {
      const res = await aiService.feynmanCorrection(subject, explanation);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Método Feynman</h2>
      </header>

      {!result ? (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-primary">
            "Se você não consegue explicar algo de forma simples, você não entendeu bem o suficiente." - Richard Feynman
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">O que você está estudando?</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Fotossíntese, Segunda Lei de Newton..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Sua explicação (como para uma criança)</label>
              <textarea 
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explique o conceito com suas próprias palavras..."
                rows={8}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
              />
            </div>

            <AnimatedButton onClick={handleAnalyze} className="w-full py-4" glow disabled={loading}>
              {loading ? 'Analisando com IA...' : 'Analisar Explicação'}
              <Sparkles size={18} />
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Análise da IA</h3>
            <div className="px-4 py-1 bg-primary text-black rounded-full font-bold text-sm">
              Nota: {result.score}/10
            </div>
          </div>

          <div className="space-y-4">
            <GlassCard className="space-y-2 border-primary/30">
              <p className="text-xs font-bold text-primary uppercase">O que está bom</p>
              <p className="text-sm">{result.feedback}</p>
            </GlassCard>

            <div className="space-y-2">
              <p className="text-xs font-bold text-red-400 uppercase">Lacunas de Conhecimento</p>
              <div className="space-y-2">
                {result.gaps.map((gap: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                    <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    {gap}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-primary uppercase">Sugestões de Melhoria</p>
              <div className="space-y-2">
                {result.suggestions.map((s: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AnimatedButton onClick={() => setResult(null)} variant="secondary" className="w-full">
            Tentar Novamente
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  );
};

const BlurtingMethod = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!topic || !notes) return;
    setLoading(true);
    try {
      const res = await aiService.blurtingComparison(topic, notes);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Método Blurting</h2>
      </header>

      {!result ? (
        <div className="space-y-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-sm text-purple-400">
            Escreva tudo o que você lembra sobre o tema sem consultar nenhum material. Depois, a IA comparará com o conteúdo completo.
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Tema do Estudo</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Revolução Francesa, Tabela Periódica..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Suas anotações (o que você lembra)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comece a escrever tudo o que está na sua cabeça..."
                rows={10}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
              />
            </div>

            <AnimatedButton onClick={handleCompare} className="w-full py-4 bg-purple-500 hover:bg-purple-600 border-purple-500" glow disabled={loading}>
              {loading ? 'Comparando com IA...' : 'Comparar e Ver Omissões'}
              <Sparkles size={18} />
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Resultado do Blurting</h3>
            <div className="px-4 py-1 bg-purple-500 text-white rounded-full font-bold text-sm">
              Retenção: {result.retentionScore}%
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-bold text-primary uppercase">Pontos que você lembrou</p>
              <div className="space-y-2">
                {result.remembered.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-red-400 uppercase">Pontos esquecidos (Omissões)</p>
              <div className="space-y-2">
                {result.forgotten.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                    <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <GlassCard className="space-y-2 border-purple-500/30">
              <p className="text-xs font-bold text-purple-400 uppercase">Dica de Estudo</p>
              <p className="text-sm">{result.studyTip}</p>
            </GlassCard>
          </div>

          <AnimatedButton onClick={() => setResult(null)} variant="secondary" className="w-full">
            Praticar Outro Tema
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  );
};

const AnkiSystem = ({ onBack }: { onBack: () => void }) => {
  const { decks, flashcards, addDeck, addFlashcard, updateFlashcard } = useStore();
  const [view, setView] = useState<'list' | 'study' | 'add-deck' | 'add-card'>('list');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardSubject, setNewCardSubject] = useState('');

  const deckCards = selectedDeckId ? flashcards.filter(f => f.deckId === selectedDeckId) : [];
  const cardsToReview = deckCards.filter(f => new Date(f.nextReview) <= new Date());

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    const card = cardsToReview[currentCardIdx];
    let interval = card.interval;
    let level = card.level;

    if (difficulty === 'easy') {
      interval = Math.max(interval * 2.5, 4);
      level = 'Dominado';
    } else if (difficulty === 'good') {
      interval = Math.max(interval * 1.8, 2);
      level = 'Revisando';
    } else if (difficulty === 'hard') {
      interval = Math.max(interval * 1.2, 1);
      level = 'Aprendendo';
    } else {
      interval = 0; // Again
      level = 'Novo';
    }

    const nextReview = new Date();
    if (interval > 0) {
      nextReview.setDate(nextReview.getDate() + Math.ceil(interval));
    } else {
      // Review again in 10 minutes (simulated by same day)
    }

    updateFlashcard(card.id, {
      interval,
      level,
      nextReview: nextReview.toISOString()
    });

    if (currentCardIdx < cardsToReview.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
      setIsFlipped(false);
    } else {
      setView('list');
      setSelectedDeckId(null);
    }
  };

  if (view === 'study' && selectedDeckId) {
    const card = cardsToReview[currentCardIdx];
    if (!card) return (
      <div className="p-6 h-screen flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Check size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Deck Finalizado!</h2>
          <p className="text-text-secondary">Você revisou todos os cards de hoje.</p>
        </div>
        <AnimatedButton onClick={() => setView('list')} className="px-8">Voltar</AnimatedButton>
      </div>
    );

    return (
      <div className="p-6 space-y-8 h-screen flex flex-col">
        <header className="flex justify-between items-center">
          <button onClick={() => setView('list')} className="p-2 bg-white/5 rounded-xl border border-white/10"><ChevronLeft size={20} /></button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Sessão de Estudo</p>
            <p className="text-sm font-black italic">STUDY<span className="text-primary">FLOW</span></p>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold">
            {currentCardIdx + 1} / {cardsToReview.length}
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center perspective-1000">
          <motion.div 
            className="relative w-full aspect-[3/4] max-h-[450px] cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className="absolute inset-0 glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center backface-hidden border-2 border-primary/20 bg-card/50">
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <Badge variant="primary">{card.subject}</Badge>
              </div>
              <h3 className="text-2xl font-bold leading-tight">{card.front}</h3>
              <div className="absolute bottom-10 flex items-center gap-2 text-text-secondary text-[10px] font-bold uppercase tracking-widest opacity-50">
                <RotateCw size={12} /> Toque para revelar
              </div>
            </div>

            {/* Back */}
            <div className="absolute inset-0 glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center backface-hidden border-2 border-primary/20 bg-primary/5" style={{ transform: 'rotateY(180deg)' }}>
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <Badge variant="warning">Resposta</Badge>
              </div>
              <div className="w-full max-h-full overflow-y-auto no-scrollbar">
                <h3 className="text-xl font-medium text-white/90 leading-relaxed">{card.back}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {isFlipped && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-2 pb-8">
            <button onClick={() => handleDifficulty('again')} className="flex flex-col items-center gap-1 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500/20 transition-colors">
              <span className="font-bold text-xs">De novo</span>
              <span className="text-[8px] uppercase font-bold opacity-60">10m</span>
            </button>
            <button onClick={() => handleDifficulty('hard')} className="flex flex-col items-center gap-1 p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 hover:bg-orange-500/20 transition-colors">
              <span className="font-bold text-xs">Difícil</span>
              <span className="text-[8px] uppercase font-bold opacity-60">1d</span>
            </button>
            <button onClick={() => handleDifficulty('good')} className="flex flex-col items-center gap-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500 hover:bg-blue-500/20 transition-colors">
              <span className="font-bold text-xs">Bom</span>
              <span className="text-[8px] uppercase font-bold opacity-60">3d</span>
            </button>
            <button onClick={() => handleDifficulty('easy')} className="flex flex-col items-center gap-1 p-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary hover:bg-primary/20 transition-colors">
              <span className="font-bold text-xs">Fácil</span>
              <span className="text-[8px] uppercase font-bold opacity-60">7d</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">Meus Decks</h2>
        </div>
        <button onClick={() => setView('add-deck')} className="p-2 bg-primary text-black rounded-xl">
          <Plus size={20} />
        </button>
      </header>

      {view === 'add-deck' && (
        <GlassCard className="space-y-4">
          <h3 className="font-bold">Novo Deck</h3>
          <input 
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Nome do deck..."
            className="w-full bg-white/5 border border-border rounded-xl p-3 outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
            <AnimatedButton onClick={() => {
              addDeck({
                id: Math.random().toString(36).substr(2, 9),
                name: newDeckName,
                subject: 'Geral',
                cardCount: 0,
                newCards: 0,
                reviewCards: 0
              });
              setNewDeckName('');
              setView('list');
            }} className="flex-1">Criar</AnimatedButton>
          </div>
        </GlassCard>
      )}

      {view === 'add-card' && (
        <GlassCard className="space-y-4">
          <h3 className="font-bold">Novo Flashcard</h3>
          <input 
            value={newCardSubject}
            onChange={(e) => setNewCardSubject(e.target.value)}
            placeholder="Matéria..."
            className="w-full bg-white/5 border border-border rounded-xl p-3 outline-none focus:border-primary"
          />
          <textarea 
            value={newCardFront}
            onChange={(e) => setNewCardFront(e.target.value)}
            placeholder="Frente (Pergunta)..."
            className="w-full bg-white/5 border border-border rounded-xl p-3 outline-none focus:border-primary"
          />
          <textarea 
            value={newCardBack}
            onChange={(e) => setNewCardBack(e.target.value)}
            placeholder="Verso (Resposta)..."
            className="w-full bg-white/5 border border-border rounded-xl p-3 outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
            <AnimatedButton onClick={() => {
              if (selectedDeckId) {
                addFlashcard({
                  id: Math.random().toString(36).substr(2, 9),
                  deckId: selectedDeckId,
                  front: newCardFront,
                  back: newCardBack,
                  subject: newCardSubject,
                  level: 'Novo',
                  interval: 0,
                  nextReview: new Date().toISOString()
                });
                setNewCardFront('');
                setNewCardBack('');
                setView('list');
              }
            }} className="flex-1">Adicionar</AnimatedButton>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-4">
        {decks.map(deck => {
          const cards = flashcards.filter(f => f.deckId === deck.id);
          const reviewCount = cards.filter(f => new Date(f.nextReview) <= new Date()).length;

          return (
            <GlassCard key={deck.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{deck.name}</h3>
                  <p className="text-xs text-text-secondary">{cards.length} cards no total</p>
                </div>
                {reviewCount > 0 && (
                  <div className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-lg border border-primary/30">
                    {reviewCount} PARA REVISAR
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setCurrentCardIdx(0);
                    setView('study');
                  }} 
                  className="flex-1 py-2 text-xs"
                  disabled={reviewCount === 0}
                >
                  Estudar Agora
                </AnimatedButton>
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setView('add-card');
                  }} 
                  variant="secondary" 
                  className="flex-1 py-2 text-xs"
                >
                  + Card
                </AnimatedButton>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

const RoutineBuilder = ({ onBack }: { onBack: () => void }) => {
  const { setRoutine } = useStore();
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState('');
  const [hours, setHours] = useState(4);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [level, setLevel] = useState('Iniciante');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const routine = await aiService.generateRoutine(target, hours, subjects, level);
      setRoutine(routine);
      onBack();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-24 h-screen flex flex-col">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Criar Rotina IA</h2>
      </header>

      <div className="flex-1 space-y-8">
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-white/5'}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Qual seu objetivo?</h3>
              <p className="text-text-secondary text-sm">Escolha o vestibular ou concurso que você está focando.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['ENEM', 'Fuvest', 'Unicamp', 'Concurso', 'OAB', 'Outro'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`p-4 rounded-2xl border text-sm font-bold transition-all ${target === t ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Disponibilidade Diária</h3>
              <p className="text-text-secondary text-sm">Quantas horas você pode dedicar aos estudos por dia?</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="text-6xl font-black text-primary">{hours}h</div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                value={hours} 
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Nível de Conhecimento</h3>
              <p className="text-text-secondary text-sm">Como você avalia sua base atual?</p>
            </div>
            <div className="space-y-3">
              {['Iniciante', 'Intermediário', 'Avançado'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`w-full p-4 rounded-2xl border text-left font-bold transition-all ${level === l ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        {step > 1 && (
          <AnimatedButton variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
            Voltar
          </AnimatedButton>
        )}
        <AnimatedButton 
          onClick={() => step < 3 ? setStep(step + 1) : handleGenerate()} 
          className="flex-1"
          glow
          disabled={loading || (step === 1 && !target)}
        >
          {loading ? 'Gerando...' : step === 3 ? 'Gerar Rotina' : 'Próximo'}
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
        </AnimatedButton>
      </div>
    </div>
  );
};

const Ranking = ({ onBack }: { onBack: () => void }) => {
  const { leaderboard, name, xp, level, streak, history } = useStore();
  const [filter, setFilter] = useState<'Global' | 'Semanal' | 'Amigos' | 'Escola' | 'Estado'>('Global');

  const myRank = leaderboard.findIndex(e => e.id === 'me') + 1;
  const myEntry = leaderboard.find(e => e.id === 'me');

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">RANKING<span className="text-primary font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">{filter}</span></h2>
        </div>
        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 relative">
          <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl animate-pulse" />
          <Trophy size={20} className="text-primary relative z-10" />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {['Global', 'Semanal', 'Amigos', 'Escola', 'Estado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={clsx(
              "px-6 py-2.5 rounded-2xl border text-[10px] font-premium-mono font-bold transition-all uppercase tracking-widest whitespace-nowrap",
              filter === f 
                ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.4)]' 
                : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 pt-12 pb-8 relative">
        {/* Confetti effect behind podium */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * 200 - 100, opacity: 0, scale: 0 }}
              animate={{ 
                y: 200, 
                x: Math.random() * 300 - 150,
                opacity: [0, 1, 1, 0],
                rotate: Math.random() * 360,
                scale: Math.random() * 1 + 0.5
              }}
              transition={{ 
                duration: Math.random() * 2 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="absolute top-0 w-2 h-2 rounded-sm"
              style={{ backgroundColor: ['#00FF94', '#FFB800', '#FF4444', '#3B82F6', '#A855F7'][Math.floor(Math.random() * 5)] }}
            />
          ))}
        </div>

        {/* 2nd Place */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="relative">
            <Crown size={20} className="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-400 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]" />
            <div className="w-16 h-16 rounded-full border-2 border-slate-400 p-1 bg-black overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[1]?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-400 text-black rounded-full flex items-center justify-center text-[10px] font-black">2</div>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold truncate w-20">{leaderboard[1]?.name}</p>
            <p className="text-[10px] text-primary font-premium-mono">{leaderboard[1]?.xp} XP</p>
          </div>
          <div className="w-16 h-20 bg-gradient-to-t from-white/10 to-white/5 rounded-t-2xl border-x border-t border-white/10" />
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <Crown size={32} className="absolute -top-10 left-1/2 -translate-x-1/2 text-primary drop-shadow-[0_0_15px_rgba(0,255,148,0.8)] animate-bounce" fill="currentColor" />
            <div className="w-20 h-20 rounded-full border-2 border-primary p-1 bg-black overflow-hidden relative z-10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[0]?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-black rounded-full flex items-center justify-center text-xs font-black z-20 shadow-[0_0_15px_rgba(0,255,148,0.6)]">1</div>
          </div>
          <div className="text-center relative z-10">
            <p className="text-sm font-black truncate w-24">{leaderboard[0]?.name}</p>
            <p className="text-xs text-primary font-premium-mono font-bold">{leaderboard[0]?.xp} XP</p>
          </div>
          <div className="w-20 h-32 bg-gradient-to-t from-primary/20 to-primary/5 rounded-t-2xl border-x border-t border-primary/30 relative z-0" />
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="relative">
            <Crown size={18} className="absolute -top-5 left-1/2 -translate-x-1/2 text-orange-600 drop-shadow-[0_0_5px_rgba(234,88,12,0.5)]" />
            <div className="w-16 h-16 rounded-full border-2 border-orange-600 p-1 bg-black overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[2]?.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-600 text-black rounded-full flex items-center justify-center text-[10px] font-black">3</div>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold truncate w-20">{leaderboard[2]?.name}</p>
            <p className="text-[10px] text-primary font-premium-mono">{leaderboard[2]?.xp} XP</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-t from-white/10 to-white/5 rounded-t-2xl border-x border-t border-white/10" />
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.slice(3, 15).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
              "glass p-4 rounded-3xl border flex items-center gap-4 transition-all",
              entry.id === 'me' ? 'border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(0,255,148,0.05)]' : 'border-white/5'
            )}
          >
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-premium-mono font-bold text-xs text-text-secondary border border-white/10">
              {index + 4}
            </div>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{entry.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-premium-mono text-text-secondary uppercase">Nível {entry.level}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[8px] font-premium-mono text-orange-500 uppercase">{entry.streak} 🔥</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-primary font-premium-mono font-bold">{entry.xp.toLocaleString()}</p>
              <p className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">XP</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating User Rank */}
      <AnimatePresence>
        {myRank > 3 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-24 left-6 right-6 glass p-4 rounded-3xl border-primary/30 bg-primary/10 flex items-center gap-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary text-black flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(0,255,148,0.5)]">
              {myRank}
            </div>
            <div className="flex-1">
              <p className="font-bold">Sua Posição</p>
              <p className="text-[10px] text-primary/70 uppercase font-bold tracking-widest">Nível {myEntry?.level} • {myEntry?.streak} 🔥</p>
            </div>
            <div className="text-right">
              <p className="text-primary font-black">{myEntry?.xp.toLocaleString()}</p>
              <p className="text-[8px] text-primary/70 uppercase font-bold tracking-widest">XP TOTAL</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Heatmap = ({ data }: { data: { date: string, count: number }[] }) => {
  const today = new Date();
  const days = Array.from({ length: 91 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (90 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensity = (date: string) => {
    const entry = data.find(d => d.date === date);
    if (!entry || entry.count === 0) return 'bg-white/5 border-white/5';
    if (entry.count < 5) return 'bg-primary/20 border-primary/10';
    if (entry.count < 10) return 'bg-primary/40 border-primary/20';
    if (entry.count < 20) return 'bg-primary/70 border-primary/30';
    return 'bg-primary shadow-[0_0_12px_rgba(0,255,148,0.6)] border-primary/40';
  };

  return (
    <div className="grid grid-cols-13 gap-1.5 w-full overflow-x-auto no-scrollbar py-2">
      {days.map((date, i) => (
        <motion.div
          key={date}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.005, ease: "easeOut" }}
          whileHover={{ scale: 1.2, zIndex: 10 }}
          className={cn(
            "w-full aspect-square rounded-[3px] border transition-all duration-300", 
            getIntensity(date)
          )}
          title={`${date}: ${data.find(d => d.date === date)?.count || 0} questões`}
        />
      ))}
    </div>
  );
};

const Reports = ({ onBack }: { onBack: () => void }) => {
  const { history, xp, streak } = useStore();
  
  const total = history.length;
  const correct = history.filter(h => h.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const validTimes = history.filter(h => h.timeSpent && h.timeSpent > 0).map(h => h.timeSpent!);
  const avgTimeSeconds = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0;
  const avgTime = avgTimeSeconds > 0 ? `${avgTimeSeconds}s` : "--";

  const subjectData = Object.keys(TOPICS).map(subject => {
    const subHistory = history.filter(h => {
      const q = ALL_QUESTIONS.find(iq => iq.id === h.questionId);
      return q?.materia === subject;
    });
    const subTotal = subHistory.length;
    const subCorrect = subHistory.filter(h => h.isCorrect).length;
    return {
      name: subject,
      acertos: subCorrect,
      erros: subTotal - subCorrect,
      total: subTotal,
      percent: subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : 0
    };
  }).filter(d => d.total > 0).sort((a, b) => b.total - a.total);

  const topicData = Object.values(TOPICS).flat().map(topic => {
    const topHistory = history.filter(h => {
      const q = ALL_QUESTIONS.find(iq => iq.id === h.questionId);
      return q?.assunto === topic;
    });
    const topTotal = topHistory.length;
    const topCorrect = topHistory.filter(h => h.isCorrect).length;
    return {
      name: topic,
      acertos: topCorrect,
      erros: topTotal - topCorrect,
      total: topTotal,
      percent: topTotal > 0 ? Math.round((topCorrect / topTotal) * 100) : 0
    };
  }).filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 5); // Top 5 topics

  const bestSubject = subjectData.length > 0 ? subjectData.sort((a, b) => b.percent - a.percent)[0] : null;
  const worstSubject = subjectData.length > 0 ? subjectData.sort((a, b) => a.percent - b.percent)[0] : null;

  const pieData = [
    { name: 'Acertos', value: correct, color: '#00FF94' },
    { name: 'Erros', value: incorrect, color: '#FF4444' }
  ];

  const difficultyData = [
    { name: 'Fácil', value: history.filter(h => ALL_QUESTIONS.find(q => q.id === h.questionId)?.difficulty === 'Easy').length, color: '#00FF94' },
    { name: 'Médio', value: history.filter(h => ALL_QUESTIONS.find(q => q.id === h.questionId)?.difficulty === 'Medium').length, color: '#FFB800' },
    { name: 'Difícil', value: history.filter(h => ALL_QUESTIONS.find(q => q.id === h.questionId)?.difficulty === 'Hard').length, color: '#FF4444' }
  ].filter(d => d.value > 0);

  // Evolution data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = history.filter(h => h.timestamp.startsWith(dateStr)).length;
    return { name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), q: count };
  });

  // Heatmap data (last 90 days)
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

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">ESTATÍSTICAS<span className="text-primary font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">Performance</span></h2>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 flex items-center gap-1.5">
            <Zap size={12} className="text-primary" fill="currentColor" />
            <span className="text-[10px] font-premium-mono font-bold text-primary">{xp} XP</span>
          </div>
        </div>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target size={16} className="text-primary" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">ACCURACY</span>
          </div>
          <p className="text-3xl font-premium-title">{accuracy}%</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame size={16} className="text-orange-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">STREAK</span>
          </div>
          <p className="text-3xl font-premium-title">{streak} <span className="text-xs text-text-secondary font-normal">DIAS</span></p>
          <p className="text-[8px] text-orange-500/70 font-bold uppercase mt-1 tracking-wider">Mantenha o fogo aceso!</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock size={16} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">AVG TIME</span>
          </div>
          <p className="text-3xl font-premium-title">{avgTime}</p>
          <p className="text-[8px] text-blue-500/70 font-bold uppercase mt-1 tracking-wider">Tempo médio por questão</p>
        </GlassCard>

        <GlassCard className="p-4 border-white/5 bg-gradient-to-br from-white/5 to-transparent" glow>
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <CheckCircle2 size={16} className="text-purple-500" />
            </div>
            <span className="text-[10px] font-premium-mono text-text-secondary">SOLVED</span>
          </div>
          <p className="text-3xl font-premium-title">{total}</p>
          <p className="text-[8px] text-purple-500/70 font-bold uppercase mt-1 tracking-wider">Total de questões respondidas</p>
        </GlassCard>
      </div>

      {/* Accuracy Donut */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Precisão de Respostas</h3>
        </div>
        <GlassCard className="p-6 relative overflow-hidden" glow>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-[0_0_10px_rgba(0,255,148,0.3)]" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl font-premium-title text-primary"
              >
                {accuracy}%
              </motion.span>
              <span className="text-[8px] font-premium-mono text-text-secondary uppercase tracking-widest">Acertos</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-text-secondary uppercase">Acertos: {correct}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-text-secondary uppercase">Erros: {incorrect}</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Evolution Line Chart */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Evolução Semanal</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FF94" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                  itemStyle={{ color: '#00FF94' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="q" 
                  stroke="#00FF94" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#00FF94', strokeWidth: 2, stroke: '#000' }}
                  activeDot={{ r: 6, fill: '#00FF94', strokeWidth: 0 }}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* Subject Performance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Desempenho por Matéria</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="space-y-6">
            {subjectData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">{data.name}</span>
                  <div className="text-right">
                    <span className="text-primary font-premium-mono font-bold text-xs">{data.percent}%</span>
                    <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">{data.acertos} / {data.total} Questões</p>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary/50 to-primary shadow-[0_0_10px_rgba(0,255,148,0.3)] rounded-full"
                  />
                </div>
              </div>
            ))}
            {subjectData.length === 0 && (
              <p className="text-center text-text-secondary text-sm py-8">Resolva questões para ver estatísticas.</p>
            )}
          </div>
        </GlassCard>
      </section>

      {/* Topic Performance */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Top 5 Assuntos</h3>
        </div>
        <GlassCard className="p-6" glow>
          <div className="space-y-6">
            {topicData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">{data.name}</span>
                  <div className="text-right">
                    <span className="text-primary font-premium-mono font-bold text-xs">{data.percent}%</span>
                    <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">{data.acertos} / {data.total} Questões</p>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percent}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500/50 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] rounded-full"
                  />
                </div>
              </div>
            ))}
            {topicData.length === 0 && (
              <p className="text-center text-text-secondary text-sm py-8">Resolva questões para ver estatísticas.</p>
            )}
          </div>
        </GlassCard>
      </section>

      {/* Difficulty & Heatmap Grid */}
      <div className="grid grid-cols-1 gap-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Distribuição de Dificuldade</h3>
          </div>
          <GlassCard className="p-6 h-64" glow>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[10, 10, 0, 0]} 
                  animationDuration={1500}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Heatmap de Estudos</h3>
          </div>
          <GlassCard className="p-6" glow>
            <Heatmap data={heatmapData} />
            <div className="flex justify-between items-center mt-4 text-[8px] font-premium-mono text-text-secondary uppercase tracking-widest">
              <span>Menos Ativo</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-sm bg-white/5" />
                <div className="w-2 h-2 rounded-sm bg-primary/20" />
                <div className="w-2 h-2 rounded-sm bg-primary/40" />
                <div className="w-2 h-2 rounded-sm bg-primary/70" />
                <div className="w-2 h-2 rounded-sm bg-primary" />
              </div>
              <span>Mais Ativo</span>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Insights */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Insights de Performance</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 border-primary/20 bg-primary/5" glow>
            <p className="text-[8px] font-premium-mono text-primary uppercase mb-1">Melhor Matéria</p>
            <p className="text-lg font-bold">{bestSubject?.name || '---'}</p>
            <p className="text-[10px] text-primary/70 font-bold">{bestSubject?.percent || 0}% de acerto</p>
          </GlassCard>
          <GlassCard className="p-4 border-red-500/20 bg-red-500/5" glow>
            <p className="text-[8px] font-premium-mono text-red-500 uppercase mb-1">Precisa de Foco</p>
            <p className="text-lg font-bold">{worstSubject?.name || '---'}</p>
            <p className="text-[10px] text-red-500/70 font-bold">{worstSubject?.percent || 0}% de acerto</p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

const Questions = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [view, setView] = useState<'bank' | 'training' | 'exam' | 'result' | 'exam-setup' | 'review'>('bank');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  const [questions, setQuestions] = useState<Question[]>(ALL_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  const [examTime, setExamTime] = useState(0);
  const [examDuration, setExamDuration] = useState(30); // minutes
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [correct, setCorrect] = useState(0);
  const [saved, setSaved] = useState(false);
  
  const { addXP, addToHistory, toggleFavorite, favorites, history } = useStore();

  // Result calculation effect
  useEffect(() => {
    if (view !== 'result' || saved) return;
    let c = 0;
    examQuestions.forEach((q, i) => {
      const isCorrect = userAnswers[i] === q.resposta;
      if (isCorrect) c++;
      addToHistory({
        questionId: q.id,
        userAnswer: userAnswers[i],
        isCorrect,
        timestamp: new Date().toISOString()
      });
    });
    setCorrect(c);
    if (c > 0) addXP(c * 10);
    setSaved(true);
  }, [view, examQuestions, userAnswers, saved, addToHistory, addXP]);

  // Filter logic
  const filteredQuestions = questions.filter(q => {
    if (!q) return false;
    const matchesSubject = !filterSubject || q.materia === filterSubject;
    const matchesTopic = !filterTopic || q.assunto === filterTopic;
    const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    const matchesYear = !filterYear || q.ano.toString() === filterYear;
    const matchesSource = !filterSource || q.prova === filterSource;
    const matchesSearch = !searchQuery || (q.pergunta || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showOnlyFavorites || favorites.includes(q.id);
    return matchesSubject && matchesTopic && matchesDifficulty && matchesSearch && matchesFavorite && matchesYear && matchesSource;
  });

  const errorQuestions = questions.filter(q => {
    const qHistory = history.filter(h => h.questionId === q.id);
    if (qHistory.length === 0) return false;
    // If last attempt was wrong
    return !qHistory[0].isCorrect;
  });

  // Exam Timer
  useEffect(() => {
    let timer: any;
    if (view === 'exam' && examTime < examDuration * 60) {
      timer = setInterval(() => setExamTime(t => t + 1), 1000);
    } else if (view === 'exam' && examTime >= examDuration * 60) {
      setView('result');
    }
    return () => clearInterval(timer);
  }, [view, examTime, examDuration]);

  const startTraining = (qs: Question[]) => {
    setExamQuestions(qs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setConfirmed(false);
    setShowExplanation(false);
    setAiExplanation('');
    setView('training');
    setSaved(false);
    setCorrect(0);
  };

  const startExam = (qs: Question[]) => {
    setExamQuestions(qs);
    setCurrentIdx(0);
    setUserAnswers({});
    setExamTime(0);
    setView('exam');
    setSaved(false);
    setCorrect(0);
  };

  const handleAnswer = (idx: number) => {
    if (view === 'training') {
      if (confirmed) return;
      setSelectedOption(idx);
      setConfirmed(true);
      const isCorrect = idx === examQuestions[currentIdx].resposta;
      addToHistory({
        questionId: examQuestions[currentIdx].id,
        userAnswer: idx,
        isCorrect,
        timestamp: new Date().toISOString()
      });
      if (isCorrect) {
        addXP(20);
        setCorrect(c => c + 1);
      }
      setShowExplanation(true);
    } else {
      setUserAnswers({ ...userAnswers, [currentIdx]: idx });
    }
  };

  const confirmAnswer = () => {
    // Deprecated for training, but kept if needed elsewhere
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedOption === examQuestions[currentIdx].resposta;
    addToHistory({
      questionId: examQuestions[currentIdx].id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: new Date().toISOString()
    });
    if (isCorrect) {
      addXP(20);
      setCorrect(c => c + 1);
    }
    setShowExplanation(true);
  };

  const explainWithAI = async () => {
    const q = examQuestions[currentIdx];
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainQuestion(q.pergunta, q.alternativas, q.alternativas[q.resposta]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const explainErrorWithAI = async () => {
    const q = examQuestions[currentIdx];
    if (selectedOption === null) return;
    setLoadingAI(true);
    try {
      const explanation = await aiService.explainError(q.pergunta, q.alternativas, q.alternativas[q.resposta], q.alternativas[selectedOption]);
      setAiExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  if (view === 'bank') {
    return (
      <div className="p-6 space-y-8 pb-32">
        <header className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-premium-title italic">BANCO DE QUESTÕES<span className="text-primary font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">Reais</span></h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('review')}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-premium-mono font-bold border border-red-500/20 flex items-center gap-2 uppercase tracking-wider"
            >
              <AlertCircle size={14} /> Revisar Erros ({errorQuestions.length})
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(EXAM_STATS).map(([exam, count]) => (
              <GlassCard 
                key={exam}
                onClick={() => setFilterSource(filterSource === exam ? '' : exam)}
                className={`p-3 cursor-pointer transition-all border-white/5 hover:border-primary/30 ${filterSource === exam ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                <p className="text-[10px] font-premium-mono font-bold text-primary mb-1">{exam}</p>
                <p className="text-lg font-premium-title">{count.toLocaleString()}</p>
                <p className="text-[8px] text-text-secondary uppercase font-bold tracking-tighter">Questões</p>
              </GlassCard>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar questões por termo ou código..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/50 text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-3.5 rounded-2xl border transition-all ${showOnlyFavorites ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.4)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
              >
                <Star size={20} fill={showOnlyFavorites ? "currentColor" : "none"} />
              </motion.button>
              <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 py-1">
                {Object.keys(TOPICS).map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFilterSubject(filterSubject === s ? '' : s);
                      setFilterTopic('');
                    }}
                    className={`px-5 py-2.5 rounded-2xl border whitespace-nowrap text-[11px] font-premium-mono font-bold transition-all uppercase tracking-wider ${filterSubject === s ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <select 
                value={filterDifficulty} 
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="" className="bg-black">Dificuldade</option>
                <option value="Easy" className="bg-black">Fácil</option>
                <option value="Medium" className="bg-black">Médio</option>
                <option value="Hard" className="bg-black">Difícil</option>
              </select>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[100px] text-center"
              >
                <option value="" className="bg-black">Ano</option>
                {Array.from({ length: 26 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y} className="bg-black">{y}</option>
                ))}
              </select>
              <select 
                value={filterSource} 
                onChange={(e) => setFilterSource(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="" className="bg-black">Prova</option>
                {Object.keys(EXAM_STATS).map(s => (
                  <option key={s} value={s} className="bg-black">{s}</option>
                ))}
              </select>
            </div>

            {filterSubject && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 overflow-x-auto no-scrollbar pb-2"
              >
                {TOPICS[filterSubject]?.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterTopic(filterTopic === t ? '' : t)}
                    className={`px-4 py-2 rounded-xl border whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter transition-all ${filterTopic === t ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <AnimatedButton 
            onClick={() => startTraining(filteredQuestions)} 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] flex flex-col items-center justify-center gap-2" 
            glow
          >
            <Play size={18} />
            Resolver Contínuo
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('exam-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-white/10 flex flex-col items-center justify-center gap-2"
          >
            <Timer size={18} />
            Modo Prova Real
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              const hardQs = questions.filter(q => q.difficulty === 'Hard');
              startTraining(hardQs.length > 0 ? hardQs : filteredQuestions);
            }} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 flex flex-col items-center justify-center gap-2"
          >
            <Flame size={18} />
            Só Difíceis
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              const enemQs = questions.filter(q => q.prova === 'ENEM');
              startTraining(enemQs.length > 0 ? enemQs : filteredQuestions);
            }} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-blue-500/20 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2"
          >
            <Target size={18} />
            Foco ENEM
          </AnimatedButton>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Questões Encontradas</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <GlassCard className="p-5 space-y-4 group hover:border-primary/30 transition-colors relative overflow-hidden" glow>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest ${
                        q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                        q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-white/5">
                        {q.prova} {q.ano}
                      </span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleFavorite(q.id)}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Flame size={18} className={favorites.includes(q.id) ? 'text-primary fill-primary drop-shadow-[0_0_5px_rgba(0,255,148,0.5)]' : 'text-text-secondary'} />
                    </motion.button>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-white/90 line-clamp-3 relative z-10">{q.pergunta}</p>
                  
                  <div className="flex justify-between items-center pt-2 relative z-10">
                    <p className="text-[9px] font-premium-mono text-text-secondary uppercase tracking-widest font-bold">
                      {q.materia} <span className="mx-1 opacity-30">/</span> {q.assunto}
                    </p>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-premium-mono text-primary font-bold uppercase tracking-widest">Resolver</span>
                      <ChevronRight size={12} className="text-primary" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Search size={24} className="text-text-secondary/30" />
                </div>
                <p className="text-text-secondary text-sm font-medium italic">Nenhuma questão encontrada com esses filtros.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'exam-setup') {
    return (
      <div className="p-6 space-y-8 pb-24">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('bank')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">MODO PROVA REAL</h2>
        </header>

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Selecione a Prova</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(EXAM_STATS).map(exam => (
                <GlassCard 
                  key={exam}
                  onClick={() => setFilterSource(exam)}
                  className={`p-4 cursor-pointer transition-all border-white/5 hover:border-primary/30 ${filterSource === exam ? 'border-primary/50 bg-primary/5' : ''}`}
                  glow={filterSource === exam}
                >
                  <p className="text-xs font-premium-mono font-bold text-white uppercase tracking-widest">{exam}</p>
                  <p className="text-[9px] text-text-secondary mt-1 uppercase font-bold tracking-tighter">Simulação Completa</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Tempo de Simulação</label>
            <div className="grid grid-cols-4 gap-2">
              {[60, 120, 180, 240, 300].map(t => (
                <button
                  key={t}
                  onClick={() => setExamDuration(t)}
                  className={`py-3 rounded-xl border text-[10px] font-premium-mono font-bold transition-all ${examDuration === t ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,148,0.3)]' : 'bg-white/5 border-white/10 text-text-secondary'}`}
                >
                  {t}'
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">Configuração Atual</p>
                <p className="text-sm font-bold text-white">{filterSource || 'Selecione uma prova'} • {examDuration} Minutos</p>
              </div>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed uppercase font-bold tracking-widest opacity-60">
              O sistema irá carregar questões reais da prova selecionada para simular o tempo e a pressão do exame oficial.
            </p>
          </div>

          <AnimatedButton 
            onClick={() => {
              const examQs = questions.filter(q => q.prova === filterSource).slice(0, 45); // Simulate 45 questions for ENEM/etc
              if (examQs.length > 0) {
                startExam(examQs);
              } else {
                alert('Não há questões suficientes para esta prova no momento.');
              }
            }} 
            className="w-full py-5 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" 
            glow
            disabled={!filterSource}
          >
            Iniciar Simulação Real
          </AnimatedButton>
          <button onClick={() => setView('bank')} className="w-full text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">Cancelar</button>
        </div>
      </div>
    );
  }

  if (view === 'training' || view === 'exam') {
    const q = examQuestions[currentIdx];
    const isTraining = view === 'training';
    const currentAnswer = isTraining ? selectedOption : userAnswers[currentIdx];

    if (!q) {
      return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-text-secondary font-bold">Nenhuma questão encontrada.</p>
          <AnimatedButton onClick={() => setView('bank')}>Voltar</AnimatedButton>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6 pb-40 h-screen flex flex-col bg-black">
        <header className="flex justify-between items-center">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('bank')} 
            className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary"
          >
            <RotateCcw size={20} />
          </motion.button>
          
          <div className="text-center">
            <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">{view === 'exam' ? 'MODO PROVA' : 'TREINO ATIVO'}</p>
            <p className="text-lg font-premium-title italic">{currentIdx + 1} <span className="text-xs text-text-secondary font-normal not-italic opacity-50">/ {examQuestions.length}</span></p>
          </div>
          
          {view === 'exam' ? (
            <div className="px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2 text-primary font-premium-mono font-bold text-xs">
              <Timer size={14} />
              {formatTime(examDuration * 60 - examTime)}
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 text-text-secondary font-premium-mono font-bold text-[10px]">
              <Target size={14} className="text-primary" />
              {correct} ACERTOS
            </div>
          )}
        </header>

        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]" 
            animate={{ width: `${((currentIdx + 1) / examQuestions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 py-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest ${
                  q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                  q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {q.difficulty}
                </span>
                <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-white/5">
                  {q.prova} {q.ano}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleFavorite(q.id)}
                  className={`p-1.5 rounded-lg border transition-all ${favorites.includes(q.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
                >
                  <Star size={14} fill={favorites.includes(q.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  className="p-1.5 rounded-lg border bg-white/5 text-text-secondary border-white/10 hover:border-white/20 transition-all"
                  title="Estatísticas da Questão"
                >
                  <BarChart3 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold leading-relaxed text-white/90">{q.pergunta}</h3>
          </div>

          <div className="space-y-4">
            {q.alternativas.map((opt, i) => {
              let style = "border-white/10 bg-white/5 hover:border-white/20";
              let iconColor = "bg-white/5 text-text-secondary";
              
              if (currentAnswer !== undefined && currentAnswer !== null) {
                if (isTraining) {
                  if (confirmed) {
                    if (i === q.resposta) {
                      style = "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]";
                      iconColor = "bg-primary text-black";
                    } else if (i === currentAnswer) {
                      style = "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                      iconColor = "bg-red-500 text-white";
                    } else {
                      style = "opacity-30 border-white/5 bg-transparent grayscale";
                    }
                  } else if (i === currentAnswer) {
                    style = "border-primary bg-primary/30 text-primary shadow-[0_0_15px_rgba(0,255,148,0.2)]";
                    iconColor = "bg-primary text-black";
                  }
                } else {
                  if (i === currentAnswer) {
                    style = "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]";
                    iconColor = "bg-primary text-black";
                  }
                }
              }

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${style}`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${iconColor}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {isTraining && confirmed && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6 pt-4"
            >
              <div className="flex gap-3">
                <AnimatedButton 
                  onClick={() => setShowExplanation(!showExplanation)} 
                  variant="secondary" 
                  className="flex-1 py-3.5 text-[10px] font-premium-mono font-bold uppercase tracking-widest border-white/10"
                >
                  {showExplanation ? 'Ocultar Explicação' : 'Ver Explicação'}
                </AnimatedButton>
                {selectedOption !== q.resposta ? (
                  <AnimatedButton 
                    onClick={explainErrorWithAI} 
                    variant="secondary" 
                    className="flex-1 py-3.5 text-[10px] font-premium-mono font-bold uppercase tracking-widest border-red-500/20 bg-red-500/5 text-red-500"
                  >
                    <Brain size={16} /> Explicar Erro
                  </AnimatedButton>
                ) : (
                  <AnimatedButton 
                    onClick={explainWithAI} 
                    variant="secondary" 
                    className="flex-1 py-3.5 text-[10px] font-premium-mono font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary"
                  >
                    <Brain size={16} /> Explicação IA
                  </AnimatedButton>
                )}
              </div>

              {showExplanation && (
                <GlassCard className="p-5 border-white/10 bg-white/5" glow>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-3 bg-primary rounded-full" />
                    <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">Resolução Comentada</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed italic">
                    {q.explicacao}
                  </p>
                </GlassCard>
              )}

              {loadingAI && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Brain size={32} className="text-primary drop-shadow-[0_0_10px_rgba(0,255,148,0.5)]" />
                  </motion.div>
                  <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em] animate-pulse">Processando Insight...</p>
                </div>
              )}

              {aiExplanation && !loadingAI && (
                <GlassCard className="p-5 border-primary/20 bg-primary/5 relative overflow-hidden" glow>
                  <div className="absolute top-0 right-0 p-2">
                    <Sparkles size={14} className="text-primary/30" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-primary" />
                    <span className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">Análise da Inteligência Artificial</span>
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    <Markdown>{aiExplanation}</Markdown>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pointer-events-none z-50">
          <div className="max-w-md mx-auto flex flex-col gap-4 pointer-events-auto">
            <div className="flex gap-4">
              {currentIdx > 0 && (
                <AnimatedButton 
                  onClick={() => {
                    setCurrentIdx(currentIdx - 1);
                    if (isTraining) {
                      setSelectedOption(null);
                      setConfirmed(false);
                      setShowExplanation(false);
                      setAiExplanation('');
                    }
                  }} 
                  variant="secondary" 
                  className="w-16 h-14 border-white/10"
                >
                  <ChevronLeft size={24} />
                </AnimatedButton>
              )}
              
              {(isTraining ? confirmed : true) && (
                <AnimatedButton 
                  onClick={() => {
                    if (currentIdx < examQuestions.length - 1) {
                      setCurrentIdx(currentIdx + 1);
                      if (isTraining) {
                        setSelectedOption(null);
                        setConfirmed(false);
                        setShowExplanation(false);
                        setAiExplanation('');
                      }
                    } else {
                      setView('result');
                    }
                  }} 
                  className="flex-1 h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" 
                  glow
                >
                  {currentIdx === examQuestions.length - 1 ? 'Finalizar' : 'Próxima Questão'}
                  <ChevronRight size={18} />
                </AnimatedButton>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'review') {
    return (
      <div className="p-6 space-y-6 pb-24">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('bank')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-2xl font-bold">Revisar Erros</h2>
        </header>

        {errorQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Trophy size={40} className="text-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg">Tudo limpo!</p>
              <p className="text-text-secondary text-sm">Você não tem questões para revisar no momento.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <AnimatedButton onClick={() => startTraining(errorQuestions)} className="flex-1" glow>
                Praticar Erros ({errorQuestions.length})
              </AnimatedButton>
              <AnimatedButton 
                onClick={() => {
                  if (onNavigate) {
                    const wrongTopics = errorQuestions.map(q => q.assunto);
                    const uniqueTopics = [...new Set(wrongTopics)].slice(0, 5).join(', ');
                    useStore.getState().addChatMessage({
                      id: Date.now().toString(),
                      role: 'user',
                      text: `/revisao ${uniqueTopics}`,
                      timestamp: new Date().toISOString(),
                      type: 'text'
                    });
                    onNavigate('ai');
                  }
                }} 
                variant="secondary" 
                className="flex-1 border-primary/20 bg-primary/5 text-primary"
              >
                <Brain size={18} className="mr-2 inline-block" /> Sugerir Revisão
              </AnimatedButton>
            </div>
            <div className="space-y-4">
              {errorQuestions.map(q => (
                <GlassCard key={q.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded uppercase">Revisar</span>
                      <span className="px-2 py-0.5 bg-white/5 text-text-secondary text-[10px] font-bold rounded uppercase">{q.prova} {q.ano}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium line-clamp-3">{q.pergunta}</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold">{q.materia} • {q.assunto}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'result') {
    const total = examQuestions.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen space-y-8 text-center">
        <div className="relative">
          <Trophy size={100} className="text-primary" />
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="absolute -top-2 -right-2 bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center font-bold"
          >
            {percent}%
          </motion.div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Resultado Final</h2>
          <p className="text-text-secondary">Você concluiu o simulado!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <GlassCard className="text-center">
            <p className="text-xs text-text-secondary uppercase font-bold">Acertos</p>
            <p className="text-2xl font-bold text-primary">{correct}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <p className="text-xs text-text-secondary uppercase font-bold">Erros</p>
            <p className="text-2xl font-bold text-red-500">{total - correct}</p>
          </GlassCard>
          <GlassCard className="text-center col-span-2">
            <p className="text-xs text-text-secondary uppercase font-bold">Tempo Gasto</p>
            <p className="text-2xl font-bold">{formatTime(examTime)}</p>
          </GlassCard>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <AnimatedButton onClick={() => startTraining(examQuestions)} variant="secondary" className="w-full">
            Refazer Simulado
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              if (onNavigate) {
                const wrongTopics = examQuestions.filter((q, i) => userAnswers[i] !== q.resposta).map(q => q.assunto);
                const uniqueTopics = [...new Set(wrongTopics)].slice(0, 3).join(', ');
                useStore.getState().addChatMessage({
                  id: Date.now().toString(),
                  role: 'user',
                  text: `/plano Focar em: ${uniqueTopics || 'Revisão Geral'}`,
                  timestamp: new Date().toISOString(),
                  type: 'text'
                });
                onNavigate('ai');
              }
            }} 
            className="w-full bg-primary text-black font-bold flex items-center justify-center gap-2"
            glow
          >
            <Brain size={18} /> Criar Plano de Estudo
          </AnimatedButton>
          <AnimatedButton onClick={() => setView('bank')} className="w-full bg-white/5 border-white/10">
            Voltar ao Banco
          </AnimatedButton>
          <button 
            onClick={() => setView('review')}
            className="w-full text-text-secondary font-bold flex items-center justify-center gap-2"
          >
            <AlertCircle size={18} /> Revisar Questões
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const Profile = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (tab: any) => void }) => {
  const { name, level, xp, streak, history, achievements } = useStore();
  
  const totalQuestions = history.length;
  const correctQuestions = history.filter(h => h.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  // Calculate real subject performance
  const subjectStats = Object.keys(TOPICS).map(subject => {
    const subjectHistory = history.filter(h => {
      const q = ALL_QUESTIONS.find(iq => iq.id === h.questionId);
      return q?.materia === subject;
    });
    
    const total = subjectHistory.length;
    const correct = subjectHistory.filter(h => h.isCorrect).length;
    const progress = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    let color = 'bg-primary';
    if (subject === 'Linguagens') color = 'bg-blue-400';
    if (subject === 'Ciências da Natureza') color = 'bg-purple-400';
    if (subject === 'Ciências Humanas') color = 'bg-orange-400';

    return { name: subject, progress, color };
  });
  
  return (
    <div className="p-6 space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
      </header>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-[40px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-2xl shadow-primary/10">
            <User size={56} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center font-premium-title text-xl border-4 border-background">
            {level}
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-premium-title">{name}</h3>
          <p className="text-primary text-[10px] font-premium-mono font-bold uppercase tracking-[0.3em]">Estudante Premium</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="text-center py-5 border-white/5">
          <Flame size={24} className="text-orange-500 mx-auto mb-2" fill="currentColor" />
          <p className="text-2xl font-premium-title">{streak}</p>
          <p className="text-[9px] text-text-secondary uppercase font-premium-mono font-bold tracking-wider">Dias</p>
        </GlassCard>
        <GlassCard className="text-center py-5 border-white/5">
          <Zap size={24} className="text-yellow-500 mx-auto mb-2" fill="currentColor" />
          <p className="text-2xl font-premium-title">{xp}</p>
          <p className="text-[9px] text-text-secondary uppercase font-premium-mono font-bold tracking-wider">XP Total</p>
        </GlassCard>
        <GlassCard className="text-center py-5 border-white/5">
          <Target size={24} className="text-primary mx-auto mb-2" />
          <p className="text-2xl font-premium-title">{accuracy}%</p>
          <p className="text-[9px] text-text-secondary uppercase font-premium-mono font-bold tracking-wider">Precisão</p>
        </GlassCard>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Conquistas</h4>
          <span className="text-[10px] text-primary font-bold">{achievements.filter(a => a.unlocked).length} / {achievements.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={clsx(
                "aspect-square rounded-2xl border flex items-center justify-center transition-all",
                achievement.unlocked ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/10"
              )}
            >
              <Trophy size={20} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Desempenho por Matéria</h4>
        <div className="space-y-4">
          {subjectStats.map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{stat.name}</span>
                <span className="text-text-secondary">{stat.progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  className={clsx("h-full rounded-full", stat.color)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        {[
          { icon: User, label: 'Editar Perfil' },
          { icon: Shield, label: 'Bloqueador de Apps' },
          { icon: Settings, label: 'Configurações' },
          { icon: LogOut, label: 'Sair', color: 'text-red-500' },
        ].map((item, i) => (
          <div key={i} className="glass p-4 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/5 border-border">
            <div className={`flex items-center gap-3 ${item.color || ''}`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- App Blocker Overlay ---

const AppBlockerOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center space-y-8"
    >
      <div className="w-24 h-24 rounded-[40px] bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 animate-pulse">
        <ShieldAlert size={48} />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Volte a Estudar!</h2>
        <p className="text-text-secondary text-lg max-w-xs">
          O modo foco está ativo. Suas distrações estão bloqueadas para garantir seu desempenho.
        </p>
      </div>
      <div className="flex items-center gap-2 text-primary font-bold">
        <Timer size={20} />
        <span>Sessão em andamento...</span>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('splash');
  const [showSplash, setShowSplash] = useState(true);
  const { checkStreak, isAppBlockerActive } = useStore();

  useEffect(() => {
    checkStreak();
    const timer = setTimeout(() => {
      setShowSplash(false);
      setActiveTab('home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [checkStreak]);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
          <Logo size="xl" className="relative z-10" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 space-y-4"
        >
          <h1 className="text-5xl font-display font-bold tracking-tight uppercase">
            STUDY<span className="text-primary">FLOW</span>
          </h1>
          <p className="text-text-secondary font-mono text-[10px] tracking-[0.4em] uppercase">
            AI-Powered Excellence
          </p>
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-12 h-1 bg-white/5 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="h-full bg-primary green-glow"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative overflow-hidden">
      {isAppBlockerActive && <AppBlockerOverlay />}
      
      <main className="h-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Dashboard onStartFlow={() => setActiveTab('focus')} onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'focus' && <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FocusSession onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'ai' && <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AIChat /></motion.div>}
          {activeTab === 'questions' && <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Questions onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'profile' && <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Profile onBack={() => setActiveTab('home')} onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'ranking' && <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Ranking onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'reports' && <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Reports onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'exams' && <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Exams onBack={() => setActiveTab('home')} onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'methods' && <motion.div key="methods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StudyMethods onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'anki' && <motion.div key="anki" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AnkiSystem onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'routine' && <motion.div key="routine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RoutineBuilder onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'feynman' && <motion.div key="feynman" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeynmanMethod onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'blurting' && <motion.div key="blurting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BlurtingMethod onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'mindmap' && <motion.div key="mindmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MindMapScreen onBack={() => setActiveTab('home')} /></motion.div>}
        </AnimatePresence>
      </main>

      {/* Floating AI Button (only on home) */}
      {activeTab === 'home' && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('ai')}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center green-glow-strong z-30"
        >
          <Sparkles size={24} fill="currentColor" />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-50">
        <nav 
          className="h-[70px] px-4 flex justify-between items-center rounded-[32px] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden"
          style={{ 
            background: 'rgba(10,10,10,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Subtle reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          {[
            { id: 'home', icon: Home },
            { id: 'questions', icon: BookOpen },
            { id: 'ranking', icon: Trophy },
            { id: 'reports', icon: BarChart2 },
            { id: 'ai', icon: MessageSquare },
            { id: 'profile', icon: User },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(tab.id as any)}
                className="relative flex items-center justify-center w-12 h-12"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div 
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,255,157,0.6)] scale-110' 
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  <tab.icon 
                    size={20} 
                    fill={isActive ? 'currentColor' : 'none'} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
