
import { PricingPage } from './components/PricingPage';
import { Onboarding } from './components/Onboarding';
import { PremiumGate } from './components/PremiumGate';
import { PaywallModal } from './components/PaywallModal';
import html2canvas from 'html2canvas';
import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
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
  CloudRain,
  MoreHorizontal,
  ChevronLeft,
  Download,
  Share2,
  Network,
  RefreshCw,
  Trash2,
  PenTool,
  Shuffle,
  Quote,
  XCircle,
  GraduationCap,
  Eye,
  UploadCloud,
  Volume2,
  Filter,
  ArrowLeft,
  Star,
  BarChart3,
  Crown,
  CheckCircle,
  Camera,
  Edit3,
  Bookmark,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Music,
  Cpu,
  Terminal,
  Info,
  StickyNote,
  Users,
  Library,
  Coffee,
  Trees,
  Rocket,
  Search as SearchIcon,
  Command,
  Mic,
  Headphones,
  Radio,
  Grid,
  Database,
  Globe,
  Sliders,
  Code2,
  Wand2,
  Server,
  Flag,
  VolumeX,
  Bot,
  TerminalSquare,
  AlertOctagon,
  DoorOpen,
  Activity,
  Hammer,
  Beaker
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore, Message, Question, Note, MindMap, ExamDetail, StudyRoutine } from './store/useStore';
import { AnimatedButton, GlassCard, ProgressRing, QuickAccessCard, Logo, LogoIcon, Badge, MindMapNode, cn } from './components/UI';
import { Flashcard } from './components/Flashcard';
import { Redacao } from './components/Redacao';
import { FocusMode } from './components/FocusMode';
import { SmartSchedule } from './components/SmartSchedule';
import { MemoryPalace } from './components/MemoryPalace';
import { SocraticDuel } from './components/SocraticDuel';
import { BrainUpload } from './components/BrainUpload';
import { GodMode } from './components/GodMode';
import { QuantumReading } from './components/QuantumReading';
import { TimeDilation } from './components/TimeDilation';
import { AkashicRecords } from './components/AkashicRecords';
import { SubliminalAudio } from './components/SubliminalAudio';
import { HolographicTutor } from './components/HolographicTutor';
import { MatrixDownload } from './components/MatrixDownload';
import { NeuralTerminal } from './components/NeuralTerminal';
import { CyberneticImplants } from './components/CyberneticImplants';
import { NeuralSync } from './components/NeuralSync';
import { NeuralForge } from './components/NeuralForge';
import { NeuralAlchemist } from './components/NeuralAlchemist';
import { OmniscienceProtocol } from './components/OmniscienceProtocol';
import { HiveMind } from './components/HiveMind';
import { TheArchive } from './components/TheArchive';
import { TheOracle } from './components/TheOracle';
import { NeuralSculptor } from './components/NeuralSculptor';
import { MultiverseNavigator } from './components/MultiverseNavigator';
import { ConceptGenesis } from './components/ConceptGenesis';
import { Credits } from './components/Credits';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { TheZeno } from './components/TheZeno';
import { LibraryOfBabel } from './components/LibraryOfBabel';
import { aiService } from './services/aiService';
import { safeStringify } from './lib/firebase';
import Markdown from 'react-markdown';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ALL_QUESTIONS, TOPICS, EXAM_STATS, QUESTION_MAP } from './data/questions';
import { EXTERNAL_BANKS } from './data/banks';
import { playSuccessSound, triggerConfetti, exportToPDF, safePlayAudio, initAudioUnlocker } from './lib/studyUtils';

const CommandPalette = ({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate: (view: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving' | 'memory-palace' | 'socratic-duel' | 'rooms' | 'brain-upload' | 'god-mode' | 'quantum-reading' | 'singularity' | 'time-dilation' | 'akashic-records' | 'subliminal-audio' | 'holographic-tutor' | 'matrix-download' | 'neural-terminal' | 'cybernetic-implants' | 'omniscience-protocol' | 'hive-mind' | 'transcendence' | 'the-void' | 'cosmic-prestige' | 'simulation-escape' | 'zenith' | 'source-code' | 'eternity' | 'system-collapse' | 'ouroboros' | 'the-architect' | 'true-ending' | 'the-archive' | 'infinite-prompt' | 'the-nexus' | 'reality-tuner' | 'the-oracle' | 'neural-sculptor' | 'the-source-code' | 'universal-consciousness' | 'multiverse-navigator' | 'concept-genesis' | 'the-mirror' | 'credits' | 'consciousness-export' | 'the-big-bang' | 'the-server-room' | 'the-fourth-wall' | 'the-literal-end' | 'the-prompt' | 'the-reboot' | 'the-new-game-plus' | 'the-intervention' | 'the-touch-grass' | 'the-resignation' | 'entropy' | 'the-no' | 'the-echo' | 'the-zeno' | 'the-self-destruct' | 'the-clicker' | 'the-white-flag' | 'the-code' | 'the-silence' | 'the-captcha' | 'the-terminal' | 'the-bsod' | 'the-backrooms' | 'document-analyzer' | 'library-of-babel') => void }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const commands = [
    { id: 'home', name: 'Início', icon: Home, shortcut: 'H' },
    { id: 'focus', name: 'Modo Foco', icon: Timer, shortcut: 'F' },
    { id: 'questions', name: 'Questões', icon: BookOpen, shortcut: 'Q' },
    { id: 'redacao', name: 'Redação', icon: PenTool, shortcut: 'R' },
    { id: 'exams', name: 'Simulados', icon: FileText, shortcut: 'S' },
    { id: 'rooms', name: 'Salas de Estudo', icon: Users, shortcut: 'R' },
    { id: 'memory-palace', name: 'Palácio da Memória', icon: Brain, shortcut: 'M' },
    { id: 'socratic-duel', name: 'Arena Socrática', icon: ShieldAlert, shortcut: 'D' },
    { id: 'document-analyzer', name: 'Análise de Documentos', icon: FileText, shortcut: 'D' },
    { id: 'library-of-babel', name: 'Biblioteca de Babel', icon: Library, shortcut: 'B' },
    { id: 'brain-upload', name: 'Upload Cerebral', icon: UploadCloud, shortcut: 'U' },
    { id: 'quantum-reading', name: 'Leitura Quântica', icon: Zap, shortcut: 'Q' },    { id: 'time-dilation', name: 'Dilatação Temporal', icon: Clock, shortcut: 'T' },
    { id: 'akashic-records', name: 'Registros Akáshicos', icon: Network, shortcut: 'K' },
    { id: 'subliminal-audio', name: 'Frequências Neurais', icon: Headphones, shortcut: 'F' },
    { id: 'holographic-tutor', name: 'Tutor Holográfico', icon: Cpu, shortcut: 'H' },
    { id: 'matrix-download', name: 'Download Direto', icon: Download, shortcut: 'X' },
    { id: 'neural-terminal', name: 'Terminal Neural', icon: Terminal, shortcut: 'N' },
    { id: 'cybernetic-implants', name: 'Implantes Cibernéticos', icon: Cpu, shortcut: 'C' },
    { id: 'omniscience-protocol', name: 'Protocolo Onisciência', icon: Eye, shortcut: 'O' },
    { id: 'hive-mind', name: 'Mente Colmeia', icon: Network, shortcut: 'V' },
    { id: 'neural-sync', name: 'Sincronização Neural', icon: Activity, shortcut: 'N' },
    { id: 'neural-alchemist', name: 'Alquimista Neural', icon: Beaker, shortcut: 'A' },
    { id: 'neural-forge', name: 'Forja Neural', icon: Hammer, shortcut: 'F' },    { id: 'the-archive', name: 'O Arquivo', icon: Database, shortcut: 'H' },    { id: 'the-oracle', name: 'A Oráculo', icon: Star, shortcut: 'O' },
    { id: 'neural-sculptor', name: 'Escultor Neural', icon: Cpu, shortcut: 'S' },    { id: 'multiverse-navigator', name: 'Navegador do Multiverso', icon: Layers, shortcut: 'V' },
    { id: 'concept-genesis', name: 'Gênese de Conceitos', icon: Wand2, shortcut: 'G' },    { id: 'credits', name: 'Créditos', icon: Star, shortcut: 'C' },    { id: 'the-zeno', name: 'Paradoxo de Zenão', icon: Clock, shortcut: 'Z' },    { id: 'god-mode', name: 'Modo Deus', icon: Eye, shortcut: 'G' },
    { id: 'ranking', name: 'Ranking', icon: Trophy, shortcut: 'L' },
    { id: 'profile', name: 'Configurações', icon: Settings, shortcut: ',' },
  ];

  const filtered = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-xl bg-card border border-border rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search size={20} className="text-text-secondary" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você quer estudar hoje?"
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-text-secondary"
              />
              <div className="px-2 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] font-mono text-text-secondary">ESC</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onNavigate(c.id as any);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <c.icon size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">⌘{c.shortcut}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-secondary">Nenhum comando encontrado para "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Screens ---

const StudyMethods = ({ onNavigate }: { onNavigate: (view: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving' | 'slides' | 'video-summarizer' | 'skill-tree' | 'learning-path' | 'rooms' | 'memory-palace' | 'socratic-duel' | 'brain-upload' | 'quantum-reading' | 'singularity' | 'time-dilation' | 'akashic-records' | 'subliminal-audio' | 'holographic-tutor' | 'matrix-download' | 'neural-terminal' | 'cybernetic-implants' | 'omniscience-protocol' | 'hive-mind' | 'transcendence' | 'the-void' | 'cosmic-prestige' | 'simulation-escape' | 'zenith' | 'source-code' | 'eternity' | 'system-collapse' | 'ouroboros' | 'the-architect' | 'true-ending' | 'the-archive' | 'infinite-prompt' | 'the-nexus' | 'reality-tuner' | 'the-oracle' | 'neural-sculptor' | 'the-source-code' | 'universal-consciousness' | 'multiverse-navigator' | 'concept-genesis' | 'the-mirror' | 'credits' | 'consciousness-export' | 'the-big-bang' | 'the-server-room' | 'the-fourth-wall' | 'the-literal-end' | 'the-prompt' | 'the-reboot' | 'the-new-game-plus' | 'the-intervention' | 'the-touch-grass' | 'the-resignation' | 'entropy' | 'the-no' | 'the-echo' | 'the-zeno' | 'the-self-destruct' | 'the-clicker' | 'the-white-flag' | 'the-code' | 'the-silence' | 'the-captcha' | 'the-terminal' | 'the-bsod' | 'the-backrooms') => void }) => {
  const methods = [    { id: 'the-zeno', name: 'Paradoxo de Zenão', icon: Clock, desc: 'Avançando... mas nunca chegando.', color: 'text-gray-500' },    { id: 'credits', name: 'Créditos', icon: Star, desc: 'Obrigado por jogar.', color: 'text-gray-400' },    { id: 'akashic-records', name: 'Registros Akáshicos', icon: Network, desc: 'Acesse a biblioteca universal do conhecimento.', color: 'text-amber-500' },
    { id: 'concept-genesis', name: 'Gênese de Conceitos', icon: Wand2, desc: 'Manifeste novas estruturas de conhecimento através da intenção pura.', color: 'text-orange-500' },
    { id: 'multiverse-navigator', name: 'Navegador do Multiverso', icon: Layers, desc: 'Escolha a realidade estética que melhor ressoa com sua mente.', color: 'text-blue-500' },    { id: 'neural-sculptor', name: 'Escultor Neural', icon: Cpu, desc: 'Reconfigure suas conexões sinápticas.', color: 'text-blue-400' },
    { id: 'the-oracle', name: 'A Oráculo', icon: Star, desc: 'Descubra o destino escrito no seu conhecimento.', color: 'text-amber-600' },    { id: 'the-archive', name: 'O Arquivo', icon: Database, desc: 'Todos os seus ciclos, todas as suas vidas.', color: 'text-green-500' },    { id: 'hive-mind', name: 'Mente Colmeia', icon: Network, desc: 'Conecte-se a um conselho de IAs geniais para debater tópicos.', color: 'text-blue-400' },
    { id: 'neural-forge', name: 'Forja Neural', icon: Hammer, desc: 'Funda dois conceitos para criar uma nova teoria híbrida.', color: 'text-red-500' },
    { id: 'neural-alchemist', name: 'Alquimista Neural', icon: Beaker, desc: 'Transmute dois tópicos em um conceito proibido.', color: 'text-purple-400' },
    { id: 'neural-sync', name: 'Sincronização Neural', icon: Activity, desc: 'Visualize sua rede neural em tempo real.', color: 'text-primary' },
    { id: 'cybernetic-implants', name: 'Implantes Cibernéticos', icon: Cpu, desc: 'Faça upgrade no seu cérebro com XP.', color: 'text-pink-500' },
    { id: 'omniscience-protocol', name: 'Protocolo Onisciência', icon: Eye, desc: 'Preveja o futuro das suas provas.', color: 'text-amber-500' },
    { id: 'matrix-download', name: 'Download Direto', icon: Download, desc: 'Baixe habilidades diretamente para o seu córtex.', color: 'text-green-500' },
    { id: 'neural-terminal', name: 'Terminal Neural', icon: Terminal, desc: 'Hackeie seu próprio foco através de linha de comando.', color: 'text-emerald-500' },
    { id: 'holographic-tutor', name: 'Tutor Holográfico', icon: Cpu, desc: 'Seu mentor de IA pessoal em formato holográfico.', color: 'text-cyan-400' },
    { id: 'subliminal-audio', name: 'Frequências Neurais', icon: Headphones, desc: 'Áudio binaural para induzir estados de foco e memória.', color: 'text-indigo-400' },
    { id: 'time-dilation', name: 'Dilatação Temporal', icon: Clock, desc: 'Câmara hiperbárica cognitiva. 1 hora parece 10 minutos.', color: 'text-purple-400' },
    { id: 'akashic-records', name: 'Registros Akáshicos', icon: Network, desc: 'Navegue pela rede neural de todo o conhecimento humano.', color: 'text-cyan-400' },    { id: 'quantum-reading', name: 'Leitura Quântica', icon: Zap, desc: 'Leitura dinâmica RSVP e Biônica para absorção 3x mais rápida.', color: 'text-blue-400' },
    { id: 'document-analyzer', name: 'Análise de Documentos', icon: FileText, desc: 'Extraia resumos e flashcards de PDFs com IA.', color: 'text-blue-500' },
    { id: 'library-of-babel', name: 'Biblioteca de Babel', icon: Library, desc: 'Acesse o arquivo infinito de todo o conhecimento possível.', color: 'text-stone-500' },
    { id: 'brain-upload', name: 'Upload Cerebral', icon: UploadCloud, desc: 'A IA digere seu texto e cria um ecossistema de estudos.', color: 'text-purple-500' },
    { id: 'socratic-duel', name: 'Arena Socrática', icon: ShieldAlert, desc: 'Debate implacável com IA para testar argumentos.', color: 'text-red-500' },
    { id: 'memory-palace', name: 'Palácio da Memória', icon: Brain, desc: 'Técnica Loci com associações bizarras geradas por IA.', color: 'text-emerald-400' },
    { id: 'slides', name: 'Aulas IA (Slides)', icon: Sparkles, desc: 'Gere apresentações visuais sobre qualquer tema.', color: 'text-emerald-400' },
    { id: 'learning-path', name: 'Roteiro Adaptativo', icon: Network, desc: 'Caminho de aprendizagem personalizado por IA.', color: 'text-blue-400' },
    { id: 'video-summarizer', name: 'Resumidor de Vídeo', icon: Play, desc: 'Resumos e flashcards de vídeos do YouTube.', color: 'text-red-500' },
    { id: 'skill-tree', name: 'Árvore de Habilidades', icon: Trophy, desc: 'Visualize sua maestria por matéria.', color: 'text-yellow-500' },
    { id: 'feynman', name: 'Método Feynman', icon: Brain, desc: 'Explique como se fosse para uma criança.', color: 'text-blue-400' },
    { id: 'focus', name: 'Pomodoro', icon: Timer, desc: 'Foco intenso com intervalos curtos.', color: 'text-red-400' },
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
            onClick={() => onNavigate(m.id as any)}
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

const DailyChallenge = () => {
  const { dailyChallenge, setDailyChallenge, addXP, addToHistory } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateChallenge = async () => {
    setLoading(true);
    try {
      const q = await aiService.generateDailyChallenge();
      setDailyChallenge(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === dailyChallenge?.resposta;
    if (isCorrect) {
      addXP(500); // Big reward for daily challenge
      playSuccessSound();
      triggerConfetti();
    }
    addToHistory({
      questionId: dailyChallenge!.id,
      userAnswer: index,
      isCorrect,
      timestamp: new Date().toISOString()
    });
  };

  if (loading) {
    return (
      <GlassCard className="p-8 flex flex-col items-center justify-center space-y-4 border-primary/20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse uppercase text-xs tracking-widest">Invocando Desafio IA...</p>
      </GlassCard>
    );
  }

  if (!dailyChallenge) {
    return (
      <GlassCard 
        className="p-8 text-center space-y-4 border-primary/20 bg-primary/5 cursor-pointer group hover:bg-primary/10 transition-all"
        onClick={generateChallenge}
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
          <Zap size={32} className="text-primary" fill="currentColor" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-premium-title italic">Desafio do Dia</h3>
          <p className="text-xs text-text-secondary">Uma questão de elite gerada por IA para testar seus limites.</p>
        </div>
        <AnimatedButton className="w-full bg-primary text-black border-primary">Começar Desafio (+500 XP)</AnimatedButton>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 space-y-6 border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2">
        <Badge variant="primary">HARD</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Zap size={16} fill="currentColor" />
          <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Desafio Diário IA</span>
        </div>
        <h3 className="text-lg font-bold leading-tight">{dailyChallenge.pergunta}</h3>
      </div>

      <div className="space-y-3">
        {dailyChallenge.alternativas.map((alt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={showResult}
            className={cn(
              "w-full p-4 rounded-xl border text-left text-sm transition-all relative overflow-hidden",
              showResult 
                ? i === dailyChallenge.resposta 
                  ? "bg-green-500/20 border-green-500 text-green-400" 
                  : i === selectedAnswer 
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : "bg-white/5 border-white/10 opacity-50"
                : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10"
            )}
          >
            <div className="flex gap-3">
              <span className="font-bold text-primary">{String.fromCharCode(65 + i)}</span>
              <span>{alt}</span>
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Explicação IA:</p>
          <p className="text-xs text-text-secondary leading-relaxed">{dailyChallenge.explicacao}</p>
          <AnimatedButton onClick={() => setDailyChallenge(null)} className="w-full mt-4">Concluir</AnimatedButton>
        </motion.div>
      )}
    </GlassCard>
  );
};

const LearningPath = ({ onBack }: { onBack: () => void }) => {
  const { learningPaths, setLearningPath, completeMilestone, level } = useStore();
  const [selectedSubject, setSelectedSubject] = useState('Matemática');
  const [loading, setLoading] = useState(false);

  const currentPath = learningPaths[selectedSubject];

  const generatePath = async () => {
    setLoading(true);
    try {
      const path = await aiService.generateLearningPath(selectedSubject, level);
      setLearningPath(selectedSubject, path);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-bottom duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Roteiro Adaptativo<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['Matemática', 'Português', 'Física', 'Química', 'Biologia'].map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-premium-mono font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
              selectedSubject === s ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-text-secondary"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {!currentPath ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
            <Network size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Gerar Roteiro de {selectedSubject}</h3>
            <p className="text-sm text-text-secondary max-w-[250px]">A IA criará um caminho personalizado baseado no seu nível atual.</p>
          </div>
          <AnimatedButton onClick={generatePath} disabled={loading} className="bg-primary text-black border-primary px-8">
            {loading ? <Loader2 className="animate-spin" /> : "Gerar com IA"}
          </AnimatedButton>
        </div>
      ) : (
        <div className="space-y-6 relative">
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-white/5" />
          {currentPath.milestones.map((m: any, i: number) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-14"
            >
              <div className={cn(
                "absolute left-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all z-10",
                m.isCompleted ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-text-secondary"
              )}>
                {m.isCompleted ? <Check size={24} /> : <span className="font-premium-mono font-bold">{i + 1}</span>}
              </div>
              <GlassCard className={cn("p-5 space-y-2", m.isCompleted && "opacity-50")}>
                <h4 className="font-bold">{m.title}</h4>
                <p className="text-xs text-text-secondary">{m.description}</p>
                {!m.isCompleted && (
                  <div className="pt-2">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest mb-1">Desafio de Maestria</p>
                      <p className="text-[11px] text-text-secondary italic">{m.masteryChallenge}</p>
                    </div>
                    <AnimatedButton 
                      onClick={() => completeMilestone(selectedSubject, m.id)}
                      className="mt-3 w-full text-[10px] py-2 bg-primary/10 text-primary border-primary/20"
                    >
                      Concluir Desafio
                    </AnimatedButton>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
          <AnimatedButton onClick={generatePath} variant="secondary" className="w-full text-xs opacity-50">
            Regerar Roteiro
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};

const BossBattle = () => {
  const { currentBossBattle, endBossBattle, addXP } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!currentBossBattle) return null;

  const q = currentBossBattle.questions[currentIdx];

  const handleConfirm = () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedOption === q.resposta;
    if (isCorrect) {
      setScore(s => s + 1);
      playSuccessSound();
      triggerConfetti();
    }
    
    setTimeout(() => {
      if (currentIdx < currentBossBattle.questions.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelectedOption(null);
        setConfirmed(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 z-[300] bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_50px_rgba(0,255,148,0.3)]"
        >
          <Trophy size={64} className="text-primary" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-4xl font-premium-title italic">Batalha Finalizada<span className="text-primary font-normal not-italic ml-1">.</span></h2>
          <p className="text-text-secondary uppercase font-premium-mono font-bold tracking-[0.3em]">Maestria em {currentBossBattle.subject}</p>
        </div>
        <div className="text-6xl font-premium-mono font-bold text-primary">
          {score}/{currentBossBattle.questions.length}
        </div>
        <div className="space-y-4 w-full max-w-xs">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold mb-1">XP Ganho</p>
            <p className="text-2xl font-premium-mono font-bold text-primary">+{score * 100} XP</p>
          </div>
          <AnimatedButton 
            onClick={() => {
              addXP(score * 100);
              endBossBattle(score);
            }} 
            className="w-full bg-primary text-black border-primary py-4"
          >
            Coletar Recompensas
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-background flex flex-col p-6">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-sm">BOSS BATTLE</h3>
            <p className="text-[10px] text-red-500 uppercase font-premium-mono font-bold tracking-widest">{currentBossBattle.subject}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-premium-mono font-bold text-text-secondary">{currentIdx + 1} / {currentBossBattle.questions.length}</p>
          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / currentBossBattle.questions.length) * 100}%` }}
              className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <GlassCard className="p-8 border-red-500/20 bg-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <p className="text-lg font-bold leading-relaxed">{q.pergunta}</p>
        </GlassCard>

        <div className="grid gap-3">
          {q.alternativas.map((alt: string, i: number) => (
            <button
              key={i}
              onClick={() => !confirmed && setSelectedOption(i)}
              className={cn(
                "p-5 rounded-2xl border text-left transition-all relative overflow-hidden group",
                selectedOption === i ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:border-white/20",
                confirmed && i === q.resposta && "border-green-500 bg-green-500/10",
                confirmed && selectedOption === i && i !== q.resposta && "border-red-500 bg-red-500/10"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-premium-mono font-bold text-xs border transition-all",
                  selectedOption === i ? "bg-primary text-black border-primary" : "bg-white/5 border-white/10 text-text-secondary"
                )}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-medium">{alt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <footer className="mt-8">
        <AnimatedButton 
          onClick={handleConfirm}
          disabled={selectedOption === null || confirmed}
          className="w-full bg-primary text-black border-primary py-4 disabled:opacity-50"
        >
          Confirmar Resposta
        </AnimatedButton>
      </footer>
    </div>
  );
};

const VideoSummarizer = ({ onBack }: { onBack: () => void }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addFlashcard, addXP } = useStore();

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const data = await aiService.summarizeVideo(url);
      setResult(data);
      addXP(50);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = () => {
    if (!result) return;
    result.flashcards.forEach((f: any) => {
      addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.front,
        back: f.back,
        subject: 'Vídeo Resumo',
        deckId: 'video-summaries',
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      });
    });
    triggerConfetti();
    alert("Flashcards salvos com sucesso!");
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-right duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Resumidor de Vídeo<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <GlassCard className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-widest">URL do YouTube</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <AnimatedButton 
              onClick={handleSummarize} 
              disabled={loading}
              className="bg-primary text-black border-primary px-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="text-primary" /> Resumo
            </h3>
            <p className="text-text-secondary leading-relaxed">{result.summary}</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Layers className="text-primary" /> Tópicos Principais
            </h3>
            <ul className="space-y-2">
              {result.topics.map((t: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Brain className="text-primary" /> Flashcards Gerados
              </h3>
              <AnimatedButton onClick={saveFlashcards} variant="secondary" className="text-xs py-1 px-3">
                Salvar Todos
              </AnimatedButton>
            </div>
            <div className="grid gap-3">
              {result.flashcards.map((f: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-bold text-sm text-primary">P: {f.front}</p>
                  <p className="text-sm text-text-secondary mt-1">R: {f.back}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-primary/20 bg-primary/5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="text-primary" /> Dica de Estudo
            </h3>
            <p className="text-sm text-text-secondary italic">{result.studyTip}</p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

// --- Study Rooms Component ---
const StudyRooms = () => {
  const { studyRooms, joinRoom, updateGlobalPulse, setAudioVolume, setAudioPlaying } = useStore();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Alex', text: 'Alguém estudando Biologia?', time: '2m' },
    { user: 'Bia', text: 'Focada aqui! 40min sem parar.', time: '1m' },
    { user: 'Caio', text: 'Essa playlist de chuva é a melhor.', time: 'Agora' },
  ]);
  
  useEffect(() => {
    const interval = setInterval(updateGlobalPulse, 5000);
    return () => clearInterval(interval);
  }, [updateGlobalPulse]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { user: 'Você', text: chatInput, time: 'Agora' }]);
    setChatInput('');
  };

  const activeRoomData = studyRooms.rooms.find(r => r.id === studyRooms.activeRoom);

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-700">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Live Study Pulse</span>
        </div>
        <h1 className="text-3xl font-premium-title italic">Salas de Estudo</h1>
        <p className="text-xs text-text-secondary font-premium-mono uppercase tracking-widest">
          {studyRooms.globalPulse.toLocaleString()} estudantes focados agora
        </p>
      </header>

      {studyRooms.activeRoom ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <GlassCard className="p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                {activeRoomData?.icon === 'Library' && <Library size={40} className="text-primary" />}
                {activeRoomData?.icon === 'Coffee' && <Coffee size={40} className="text-primary" />}
                {activeRoomData?.icon === 'Trees' && <Trees size={40} className="text-primary" />}
                {activeRoomData?.icon === 'Rocket' && <Rocket size={40} className="text-primary" />}
                {activeRoomData?.icon === 'Zap' && <Zap size={40} className="text-primary" />}
                {activeRoomData?.icon === 'CloudRain' && <CloudRain size={40} className="text-primary" />}
              </div>
              <div>
                <h2 className="text-2xl font-premium-title italic">{activeRoomData?.name}</h2>
                <p className="text-sm text-primary font-premium-mono uppercase tracking-widest">{activeRoomData?.vibe}</p>
              </div>
              <div className="flex justify-center -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-black bg-primary text-black text-[10px] font-bold flex items-center justify-center">
                  +{activeRoomData?.users}
                </div>
              </div>
              <div className="pt-4">
                <AnimatedButton onClick={() => { setAudioPlaying(false); joinRoom(null); }} variant="secondary" className="px-8">Sair da Sala</AnimatedButton>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setAudioPlaying(!studyRooms.audioPlaying)} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors">
                  {studyRooms.audioPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <div className="flex-1">
                  <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase">Áudio da Sala</p>
                  <p className="text-xs font-bold">Ambiente: {activeRoomData?.vibe}</p>
                </div>
                {studyRooms.audioPlaying && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center gap-3 px-2">
                <VolumeX size={14} className="text-text-secondary" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={studyRooms.audioVolume ?? 50} 
                  onChange={(e) => setAudioVolume(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <Volume2 size={14} className="text-text-secondary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary">
                <Radio size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase">Status</p>
                <p className="text-xs font-bold">Sincronizado com o grupo</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </GlassCard>
          </div>

          {/* Room Chat */}
          <GlassCard className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" />
                <h3 className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Chat da Sala</h3>
              </div>
              <span className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">Tempo Real</span>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary">{msg.user}</span>
                      <span className="text-[8px] text-text-secondary">{msg.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Diga algo..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 p-1 rounded-md transition-colors">
                <Send size={14} />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyRooms.rooms.map((room) => (
            <GlassCard 
              key={room.id} 
              className="p-6 cursor-pointer group hover:border-primary/30 transition-all"
              onClick={() => { joinRoom(room.id); setAudioPlaying(true); }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {room.icon === 'Library' && <Library size={28} />}
                  {room.icon === 'Coffee' && <Coffee size={28} />}
                  {room.icon === 'Trees' && <Trees size={28} />}
                  {room.icon === 'Rocket' && <Rocket size={28} />}
                  {room.icon === 'Zap' && <Zap size={28} />}
                  {room.icon === 'CloudRain' && <CloudRain size={28} />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{room.name}</h3>
                  <p className="text-xs text-text-secondary">{room.vibe}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <Users size={12} />
                    <span className="text-[10px] font-premium-mono font-bold">{room.users}</span>
                  </div>
                  <p className="text-[8px] text-text-secondary uppercase font-bold tracking-widest">Online</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

const SkillTree = ({ onBack }: { onBack: () => void }) => {
  const { mastery, startBossBattle } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  
  const subjects = Object.entries(mastery).map(([name, value]) => ({
    name,
    value,
    color: name === 'Matemática' ? 'bg-blue-500' : 
           name === 'Português' ? 'bg-red-500' :
           name === 'Física' ? 'bg-purple-500' :
           name === 'Química' ? 'bg-yellow-500' :
           name === 'Biologia' ? 'bg-green-500' : 'bg-gray-500'
  }));

  const handleBossBattle = async (subject: string) => {
    setLoading(subject);
    try {
      const questions = await aiService.generateBossBattle(subject);
      startBossBattle(subject, questions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-left duration-500">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-2xl font-premium-title italic">Árvore de Habilidades<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-4 flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
              <div className={cn("absolute top-0 left-0 w-full h-1", s.color)} />
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ProgressRing progress={s.value} size={40} strokeWidth={3} />
                <div className="absolute text-[10px] font-bold">{Math.round(s.value)}%</div>
              </div>
              <div>
                <h4 className="text-sm font-bold">{s.name}</h4>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">Nível {Math.floor(s.value / 10) + 1}</p>
              </div>
              
              {s.value >= 30 && (
                <AnimatedButton 
                  onClick={() => handleBossBattle(s.name)}
                  disabled={!!loading}
                  className="w-full text-[8px] py-1 bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all"
                >
                  {loading === s.name ? <Loader2 size={10} className="animate-spin mx-auto" /> : "BOSS BATTLE"}
                </AnimatedButton>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-6 space-y-4 border-primary/20 bg-primary/5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="text-primary" /> Próximos Desbloqueios
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Crown size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Mestre da Lógica</p>
              <p className="text-[10px] text-text-secondary">Chegue a 80% em Matemática</p>
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <PenTool size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Poliglota</p>
              <p className="text-[10px] text-text-secondary">Chegue a 80% em Inglês</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};


// --- Main App ---

const Dashboard = ({ onStartFlow, onNavigate }: { onStartFlow: () => void, onNavigate: (tab: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving' | 'slides' | 'video-summarizer' | 'skill-tree' | 'learning-path' | 'rooms' | 'memory-palace' | 'socratic-duel') => void }) => {
  const { name, profilePic, streak, xp, level, sessions, history, exams, league, dailyXP, routine, dailyGoalMinutes, smartRecommendation, setSmartRecommendation, neuralSync } = useStore();

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
    title: QUESTION_MAP[h.questionId]?.materia || 'Questão',
    subtitle: QUESTION_MAP[h.questionId]?.assunto || 'Tópico',
    isCorrect: h.isCorrect,
    timestamp: h.timestamp
  }));

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
        <AnimatedButton onClick={() => onNavigate('profile')} variant="secondary" className="p-0 rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
          <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="Profile" className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
        </AnimatedButton>
      </header>

      {/* Daily Progress & Quick Actions */}
      <div className="grid grid-cols-1 gap-6">
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
            <AnimatedButton onClick={() => onNavigate('focus')} variant="primary" className="py-2 px-4 text-xs mt-2">
              Continuar Focado
            </AnimatedButton>
          </div>
          <ProgressRing progress={goalProgress} size={100} strokeWidth={10} />
        </GlassCard>

        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'focus', icon: Timer, label: 'Foco', color: 'text-red-400' },
            { id: 'ai', icon: MessageSquare, label: 'IA', color: 'text-purple-400' },
            { id: 'questions', icon: BookOpen, label: 'Questões', color: 'text-blue-400' },
            { id: 'rooms', icon: Users, label: 'Salas', color: 'text-emerald-400' },
          ].map(action => (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => onNavigate(action.id as any)}
              className="flex flex-col items-center gap-2 p-3 glass rounded-2xl border-white/5 hover:border-white/20 transition-all"
            >
              <div className={cn("p-2 rounded-xl bg-white/5", action.color)}>
                <action.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mission Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={40} className="text-primary" />
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Zap size={14} fill="currentColor" />
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
          <Brain size={60} className="text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <Brain size={14} fill="currentColor" />
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
            <GlassCard className="p-5 border-primary/20 bg-primary/5 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(smartRecommendation.actionTab as any)}>
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
            { id: 'focus', icon: Timer, label: 'Foco', color: 'text-red-400' },
            { id: 'methods', icon: Grid, label: 'Métodos', color: 'text-blue-400' },
            { id: 'rooms', icon: Users, label: 'Salas', color: 'text-purple-400' },
            { id: 'anki', icon: Layers, label: 'Flash', color: 'text-emerald-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all group-active:scale-95">
                <item.icon size={24} className={item.color} />
              </div>
              <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
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
            { id: 'document-analyzer', icon: FileText, label: 'Docs', color: 'text-blue-400' },
            { id: 'video-summarizer', icon: Play, label: 'Vídeos', color: 'text-red-400' },
            { id: 'memory-palace', icon: Brain, label: 'Palácio', color: 'text-purple-400' },
            { id: 'socratic-duel', icon: Zap, label: 'Duelo', color: 'text-yellow-400' },
            { id: 'brain-upload', icon: UploadCloud, label: 'Upload', color: 'text-emerald-400' },
            { id: 'god-mode', icon: Eye, label: 'God Mode', color: 'text-primary' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all group-active:scale-95">
                <item.icon size={24} className={item.color} />
              </div>
              <span className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Next Session from Routine */}
      {nextSession && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Próxima Missão</h3>
            <AnimatedButton onClick={() => onNavigate('routine')} variant="secondary" className="text-[9px] px-3 py-1 rounded-full uppercase tracking-widest opacity-50 hover:opacity-100">Ver Tudo</AnimatedButton>
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
              <AnimatedButton onClick={onStartFlow} className="bg-primary text-black border-primary text-[10px] px-4 py-2">Iniciar</AnimatedButton>
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

      {/* Study Buddies Online */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Estudando Agora</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">1.2k Online</span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[
            { name: 'Alex', status: 'Foco', img: 'https://picsum.photos/seed/alex/64/64' },
            { name: 'Bia', status: 'Anki', img: 'https://picsum.photos/seed/bia/64/64' },
            { name: 'Caio', status: 'Redação', img: 'https://picsum.photos/seed/caio/64/64' },
            { name: 'Dani', status: 'Questões', img: 'https://picsum.photos/seed/dani/64/64' },
            { name: 'Enzo', status: 'Foco', img: 'https://picsum.photos/seed/enzo/64/64' },
          ].map((buddy, i) => (
            <motion.div 
              key={i}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[70px]"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl border-2 border-primary/20 overflow-hidden">
                  <img src={buddy.img} alt={buddy.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background border-2 border-black flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold">{buddy.name}</p>
                <p className="text-[8px] text-primary uppercase font-bold tracking-tighter">{buddy.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Atividade Recente</h3>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>
        <div className="space-y-3">
          {[
            { user: 'Alex', action: 'completou um deck de', target: 'Biologia', time: '2m', icon: Layers, color: 'text-primary' },
            { user: 'Bia', action: 'subiu para a liga', target: 'Diamante', time: '5m', icon: Trophy, color: 'text-yellow-500' },
            { user: 'Caio', action: 'iniciou uma sessão em', target: 'Biblioteca', time: '10m', icon: Users, color: 'text-blue-400' },
          ].map((activity, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 p-3 glass rounded-2xl border-white/5"
            >
              <div className={cn("p-2 rounded-xl bg-white/5", activity.color)}>
                <activity.icon size={14} />
              </div>
              <div className="flex-1">
                <p className="text-xs">
                  <span className="font-bold text-white">{activity.user}</span>{' '}
                  <span className="text-text-secondary">{activity.action}</span>{' '}
                  <span className="font-bold text-primary">{activity.target}</span>
                </p>
              </div>
              <span className="text-[10px] text-text-secondary font-mono">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Heatmap Mini */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Consistência</h3>
          </div>
          <button onClick={() => onNavigate('reports')} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Ver Detalhes</button>
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
          onClick={() => onNavigate('focus')}
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
          onClick={() => onNavigate('exams')}
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
            <button onClick={() => onNavigate('methods')} className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Explorar</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <GlassCard 
              className="p-5 cursor-pointer hover:border-primary/40 transition-all group relative overflow-hidden"
              onClick={() => onNavigate('methods')}
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
              onClick={() => onNavigate('anki')}
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
            onClick={() => onNavigate('questions')}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors border border-blue-500/10">
              <BookOpen size={24} className="text-blue-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Questões</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Banco Real</p>
          </GlassCard>

          <GlassCard 
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => onNavigate('redacao')}
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 group-hover:bg-purple-500/20 transition-colors border border-purple-500/10">
              <PenTool size={24} className="text-purple-500" />
            </div>
            <h3 className="font-premium-title text-lg mb-1">Redação</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-50">Correção IA</p>
          </GlassCard>

          <GlassCard 
            className="p-6 cursor-pointer group hover:border-primary/30 transition-all border-white/5"
            onClick={() => onNavigate('exams')}
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
              onNavigate('questions');
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
            <button onClick={() => onNavigate('routine')} className="text-xs text-primary font-medium uppercase tracking-wider">Ver tudo</button>
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
            <button onClick={() => onNavigate('exams')} className="text-xs text-primary font-medium uppercase tracking-wider">Ver todas</button>
          </div>
          <div className="space-y-3">
            {exams.slice(0, 2).map(exam => {
              const daysLeft = calculateDaysLeft(exam.data);
              return (
                <GlassCard key={exam.id} className="p-4 flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate('exams')}>
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



const TypingText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i += 3; // Type 3 characters at a time for speed and smoothness
      if (i > text.length) {
        setDisplayedText(text);
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <div className="relative">
      <Markdown>{displayedText}</Markdown>
      {!isComplete && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 bg-primary ml-1 align-middle"
        />
      )}
    </div>
  );
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

  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});

  const handleAction = (type: string, data: any, msgId: string) => {
    const { decks, addFlashcard, addDeck, setRoutine } = useStore.getState();
    
    if (type === 'flashcards') {
      let targetDeckId = decks[0]?.id;
      
      if (!targetDeckId) {
        const newId = Math.random().toString(36).substr(2, 9);
        addDeck({
          id: newId,
          name: 'IA Generated',
          subject: 'Geral',
          cardCount: 0,
          newCards: 0,
          reviewCards: 0
        });
        targetDeckId = newId;
      }

      data.forEach((f: any) => addFlashcard({
        id: Math.random().toString(36).substr(2, 9),
        front: f.question,
        back: f.answer + (f.explanation ? `\n\n--- \n${f.explanation}` : ''),
        subject: 'IA Generated',
        deckId: targetDeckId,
        level: 'Novo',
        interval: 0,
        nextReview: new Date().toISOString()
      }));
      setActionStates(prev => ({ ...prev, [msgId]: true }));
    } else if (type === 'summary' || type === 'explanation') {
      const { addNote } = useStore.getState();
      addNote({
        id: Math.random().toString(36).substr(2, 9),
        title: type === 'summary' ? 'Resumo IA' : 'Explicação IA',
        content: data,
        subject: 'Geral',
        updatedAt: new Date().toISOString()
      });
      setActionStates(prev => ({ ...prev, [msgId]: true }));
    } else if (type === 'plan') {
      const routine: StudyRoutine = {
        id: Math.random().toString(36).substr(2, 9),
        target: data.subject || 'Plano IA',
        weeklyHours: 20,
        schedule: data.tasks?.slice(0, 7).map((t: any, i: number) => ({
          day: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][i] || `Dia ${i + 1}`,
          blocks: [{
            subject: t.title,
            duration: 60,
            type: 'theory' as const
          }]
        })) || []
      };
      setRoutine(routine);
      setActionStates(prev => ({ ...prev, [msgId]: true }));
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
            <div className={`max-w-[90%] p-5 rounded-3xl shadow-xl ${
              msg.role === 'user' 
                ? 'bg-primary text-black font-semibold shadow-primary/20' 
                : 'bg-card border border-white/5 text-white shadow-black/40'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none">
                {msg.role === 'model' && idx === chatHistory.length - 1 && loading === false ? (
                  <TypingText text={msg.text} />
                ) : (
                  <Markdown>{msg.text}</Markdown>
                )}
              </div>

              {msg.type === 'flashcards' && (
                <button 
                  onClick={() => handleAction('flashcards', msg.data, msg.id)}
                  disabled={actionStates[msg.id]}
                  className={clsx(
                    "mt-3 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    actionStates[msg.id] 
                      ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                      : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  )}
                >
                  {actionStates[msg.id] ? 'Adicionado!' : 'Adicionar ao Deck'}
                </button>
              )}

              {msg.type === 'plan' && (
                <button 
                  onClick={() => handleAction('plan', msg.data, msg.id)}
                  disabled={actionStates[msg.id]}
                  className={clsx(
                    "mt-3 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    actionStates[msg.id] 
                      ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                      : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  )}
                >
                  {actionStates[msg.id] ? 'Ativado!' : 'Ativar Cronograma'}
                </button>
              )}

              {msg.type === 'image' && msg.data && (
                <div className="mt-4 space-y-3">
                  <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                    <img src={msg.data} alt="AI Generated" className="w-full transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button onClick={() => window.open(msg.data, '_blank')} className="w-full py-2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">Ver em tela cheia</button>
                    </div>
                  </div>
                </div>
              )}

              {msg.type === 'audio' && msg.data && (
                <div className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      safePlayAudio(`data:audio/wav;base64,${msg.data}`);
                    }}
                    className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Audio Aula</p>
                    <p className="text-[8px] text-text-secondary">Clique para ouvir a explicação</p>
                  </div>
                </div>
              )}

              {msg.type === 'music' && msg.data && (
                <div className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      safePlayAudio(`data:audio/wav;base64,${msg.data}`);
                    }}
                    className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center"
                  >
                    <Music size={18} />
                  </button>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Trilha de Estudo</p>
                    <p className="text-[8px] text-text-secondary">Lo-fi gerado para seu foco</p>
                  </div>
                </div>
              )}

              {msg.type === 'slides' && msg.data && (
                <div className="mt-3 space-y-3">
                  {msg.data.map((slide: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">Slide {i + 1}: {slide.title}</p>
                      <ul className="list-disc list-inside text-[10px] text-text-secondary space-y-1">
                        {slide.content.map((item: string, j: number) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'model' && idx === chatHistory.length - 1 && !loading && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar w-full pb-2">
                {[
                  { label: 'Gerar Imagem', cmd: '/imagem' },
                  { label: 'Audio Aula', cmd: '/audio' },
                  { label: 'Música Foco', cmd: '/musica' },
                  { label: 'Criar Slides', cmd: '/slides' },
                  { label: 'Flashcards', cmd: '/flashcards' },
                  { label: 'Questões', cmd: '/questoes' },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(`${btn.cmd} sobre o assunto anterior`)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:bg-white/10 transition-all text-primary"
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

      <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border sticky bottom-0 z-20">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida estratégica..."
              className="flex-1 bg-card border border-white/10 rounded-2xl py-4 px-6 focus:border-primary/50 outline-none transition-all placeholder:text-text-secondary/50 text-sm font-medium"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-14 h-14 bg-primary text-black rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,148,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              <Send size={20} />
            </motion.button>
          </div>
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
    if (!plan || !plan.weeks || !plan.weeks[0] || !plan.weeks[0].days) return;
    // Convert plan to routine format
    const routine: StudyRoutine = {
      id: Math.random().toString(36).substr(2, 9),
      target: exam.nome,
      weeklyHours: 20, // default
      schedule: plan.weeks[0].days.map((d: any) => ({
        day: d.day,
        blocks: d.subjects?.map((s: string) => ({
          subject: s,
          duration: 60,
          type: 'theory' as const
        })) || []
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
        {plan?.weeks?.map((week: any) => (
          <div key={week.weekNumber} className="space-y-3">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Semana {week.weekNumber}: {week.focus}</h3>
            <div className="space-y-3">
              {week.days?.map((day: any, i: number) => (
                <GlassCard key={i} className="py-3 px-4 flex justify-between items-center border-white/5">
                  <div>
                    <p className="font-bold text-sm">{day.day}</p>
                    <div className="flex gap-2 mt-1">
                      {day.subjects?.map((s: string, j: number) => (
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
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState<'setup' | 'exam' | 'review' | 'ai-review'>('setup');
  const [aiReview, setAiReview] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { addToHistory, addXP, addNote } = useStore();

  const startSimulado = async () => {
    setLoading(true);
    try {
      let filtered = ALL_QUESTIONS.filter(q => q && q.prova === exam.nome);
      
      if (selectedTopics.length > 0) {
        filtered = filtered.filter(q => selectedTopics.includes(q.assunto) || selectedTopics.includes(q.materia));
      }

      const res = filtered.length > 0 ? filtered : ALL_QUESTIONS.filter(q => q && exam.materias.includes(q.materia)).slice(0, 15);
      const shuffled = [...res].sort(() => Math.random() - 0.5).slice(0, 15);
      
      setQuestions(shuffled);
      setStep('exam');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const finishExam = () => {
    setShowResult(true);
    // Save to history
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        addToHistory({
          questionId: q.id,
          userAnswer: answers[i],
          isCorrect: answers[i] === q.resposta,
          timestamp: new Date().toISOString(),
          timeSpent: 30 // Mock time
        });
      }
    });

    // Add XP
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.resposta) correct++;
    });
    addXP(correct * 50);
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-bold animate-pulse">IA Montando Simulado Estratégico...</p>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="p-6 space-y-8 pb-32">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-premium-title italic">CONFIGURAR SIMULADO</h2>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">{exam.nome}</p>
          </div>
        </header>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Focar em Tópicos Específicos?</label>
            <div className="flex flex-wrap gap-2">
              {exam.materias.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedTopics(prev => prev.includes(m) ? prev.filter(t => t !== m) : [...prev, m])}
                  className={clsx(
                    "px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                    selectedTopics.includes(m) ? "bg-primary text-black border-primary" : "bg-white/5 text-text-secondary border-white/10"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-text-secondary italic">Se nenhum for selecionado, a IA gerará um simulado equilibrado de toda a prova.</p>
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Brain size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-widest">IA Strategy Engine</p>
                <p className="text-sm font-bold text-white">Simulação Adaptativa</p>
              </div>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed uppercase font-bold tracking-widest opacity-60">
              A IA selecionará as questões com base no peso histórico de cada tópico na prova {exam.nome} e no seu nível de dificuldade.
            </p>
          </div>

          <AnimatedButton onClick={startSimulado} className="w-full py-5 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" glow>
            Gerar Simulado Personalizado
          </AnimatedButton>
        </div>
      </div>
    );
  }

  if (showResult && step !== 'review') {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.resposta) correctCount++;
    });
    const score = (correctCount / questions.length) * 100;

    return (
      <div className="p-6 space-y-8 text-center pb-32">
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
                <span className="text-text-secondary">Questões Respondidas</span>
                <span className="font-bold">{Object.keys(answers).length} / {questions.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Nível de Dificuldade</span>
                <span className="font-bold text-primary">{exam.nivel}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">XP Ganho</span>
                <span className="font-bold text-primary">+{correctCount * 50} XP</span>
              </div>
            </div>
          </GlassCard>
          
          <div className="flex gap-3">
            <AnimatedButton onClick={() => setStep('review')} variant="secondary" className="flex-1">Revisar Erros</AnimatedButton>
            <AnimatedButton onClick={onBack} className="flex-1">Concluir</AnimatedButton>
          </div>

          {score < 100 && (
            <div className="pt-4 border-t border-white/5">
              <AnimatedButton 
                onClick={async () => {
                  const wrongTopics = Array.from(new Set(
                    questions.filter((q, i) => answers[i] !== q.resposta).map(q => q.assunto || q.materia)
                  ));
                  setLoading(true);
                  try {
                    const review = await aiService.suggestReview(wrongTopics);
                    setAiReview(review);
                    setStep('ai-review');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                glow
              >
                <Sparkles size={18} className="mr-2" />
                Gerar Plano de Revisão IA
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'ai-review' && aiReview) {
    return (
      <div className="p-6 space-y-6 pb-32">
        <header className="flex items-center gap-4">
          <button onClick={() => setStep('exam')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold">Plano de Revisão IA</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Personalizado para seus erros</p>
          </div>
        </header>

        <GlassCard className="p-6 prose prose-invert prose-sm max-w-none">
          <Markdown>{aiReview}</Markdown>
        </GlassCard>

        <div className="flex gap-3">
          <AnimatedButton 
            onClick={() => {
              setIsSavingNote(true);
              addNote({
                id: Math.random().toString(36).substr(2, 9),
                title: `Revisão: ${exam.nome}`,
                content: aiReview,
                subject: exam.materias[0] || 'Geral',
                updatedAt: new Date().toISOString()
              });
              setTimeout(() => setIsSavingNote(false), 1000);
            }} 
            variant="secondary" 
            className="flex-1"
            disabled={isSavingNote}
          >
            {isSavingNote ? 'Salvo!' : 'Salvar no Caderno'}
          </AnimatedButton>
          <AnimatedButton onClick={() => setStep('exam')} className="flex-1">Voltar</AnimatedButton>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="p-6 space-y-6 pb-32">
        <header className="flex items-center gap-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
          <button onClick={() => setStep('exam')} className="text-text-secondary"><ChevronLeft size={24} /></button>
          <h2 className="text-xl font-bold">Revisão do Simulado</h2>
        </header>

        <div className="space-y-8">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.resposta;
            return (
              <GlassCard key={q.id} className={clsx("p-6 space-y-4 border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Questão {i + 1}</span>
                  <Badge variant={isCorrect ? 'success' : 'danger'}>{isCorrect ? 'Correta' : 'Incorreta'}</Badge>
                </div>
                <p className="text-sm leading-relaxed">{q.pergunta}</p>
                <div className="space-y-2">
                  {q.alternativas.map((opt: string, optIdx: number) => (
                    <div key={optIdx} className={clsx(
                      "p-3 rounded-xl text-xs border",
                      optIdx === q.resposta ? "bg-green-500/10 border-green-500/30 text-green-500" :
                      optIdx === answers[i] && !isCorrect ? "bg-red-500/10 border-red-500/30 text-red-500" :
                      "bg-white/5 border-white/10 opacity-50"
                    )}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)})</span>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Explicação</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{q.explicacao}</p>
                </div>
              </GlassCard>
            );
          })}
          <AnimatedButton onClick={onBack} className="w-full">Finalizar Revisão</AnimatedButton>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-text-secondary font-bold">Nenhuma questão encontrada para este simulado.</p>
        <AnimatedButton onClick={onBack}>Voltar</AnimatedButton>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="p-6 space-y-6 pb-32">
      <header className="flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
        <button onClick={onBack} className="text-text-secondary"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Simulado IA</p>
          <p className="text-xs font-bold">{exam.nome}</p>
        </div>
        <div className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full border border-white/10">
          {answeredCount}/{questions.length}
        </div>
      </header>

      <div className="space-y-8">
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden sticky top-[72px] z-40">
          <motion.div 
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        {questions.map((q, qIndex) => (
          <GlassCard key={q.id || qIndex} className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Questão {qIndex + 1}</span>
              <span className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-text-secondary">{q.materia}</span>
            </div>
            
            <p className="text-sm font-medium leading-relaxed">{q.pergunta}</p>

            <div className="space-y-3">
              {q.alternativas.map((opt: string, i: number) => {
                const isSelected = answers[qIndex] === i;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(qIndex, i)}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex gap-4 items-center group border ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-primary/50 text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected ? 'bg-primary text-black' : 'bg-white/5 group-hover:bg-primary/20 group-hover:text-primary'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm font-medium">{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        ))}

        <AnimatedButton 
          onClick={finishExam} 
          className="w-full py-4 text-sm font-bold uppercase tracking-widest mt-8"
          glow
        >
          Finalizar Simulado
        </AnimatedButton>
      </div>
    </div>
  );
};

const Exams = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (tab: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving') => void }) => {
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

const SlidesView = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<{title: string, content: string[]}[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateSlides(topic);
      setSlides(res);
      setCurrentSlide(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24 h-full flex flex-col">
      <header className="flex items-center gap-4 shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Aulas IA</h2>
      </header>

      {slides.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual tema você quer aprender?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Revolução Francesa, Mitose..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Aula...' : 'Gerar Aula'}
              <Sparkles size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="absolute top-0 left-0 w-full flex gap-1 mb-4">
            {slides.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentSlide ? 'bg-primary' : 'bg-white/10'}`} />
            ))}
          </div>
          
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="w-full aspect-[9/16] max-h-[70vh] bg-gradient-to-br from-card to-background border border-white/10 rounded-3xl p-8 flex flex-col justify-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            
            <h3 className="text-3xl font-premium-title italic mb-8 relative z-10">{slides[currentSlide].title}</h3>
            <ul className="space-y-6 relative z-10">
              {slides[currentSlide].content.map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 text-lg text-white/90 leading-relaxed"
                >
                  <span className="text-primary mt-1.5">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div className="flex gap-4 mt-8 shrink-0">
            <button 
              onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
              disabled={currentSlide === 0}
              className="flex-1 py-4 rounded-2xl bg-white/5 disabled:opacity-30 font-bold"
            >
              Anterior
            </button>
            <button 
              onClick={() => {
                if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
                else { setSlides([]); setTopic(''); }
              }}
              className="flex-1 py-4 rounded-2xl bg-primary text-black font-bold shadow-[0_0_20px_rgba(0,255,148,0.3)]"
            >
              {currentSlide === slides.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActiveRecallScreen = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<{question: string, answer: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.generateActiveRecall(topic);
      setQuestions(res);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowAnswer(false);
    } else {
      setQuestions([]);
      setTopic('');
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Active Recall</h2>
      </header>

      {questions.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Qual tema você quer forçar a memória?</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Ciclo de Krebs, Segunda Guerra..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
              />
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Perguntas...' : 'Iniciar Sessão'}
              <Zap size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">
              PERGUNTA {currentIndex + 1} DE {questions.length}
            </p>
            <h3 className="text-2xl font-bold leading-relaxed">{questions[currentIndex].question}</h3>
          </div>

          {!showAnswer ? (
            <div className="space-y-6">
              <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center text-text-secondary">
                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Tente lembrar da resposta mentalmente ou em voz alta.</p>
              </div>
              <AnimatedButton onClick={() => setShowAnswer(true)} className="w-full py-4 text-black" glow>
                Revelar Resposta
              </AnimatedButton>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <GlassCard className="p-6 border-primary/30 bg-primary/5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Resposta Ideal</h4>
                <p className="text-lg text-white/90 leading-relaxed">{questions[currentIndex].answer}</p>
              </GlassCard>
              
              <div className="flex gap-3">
                <AnimatedButton onClick={nextQuestion} className="flex-1 py-4 text-black" glow>
                  {currentIndex === questions.length - 1 ? 'Finalizar Sessão' : 'Próxima Pergunta'}
                  <ChevronRight size={18} />
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const InterleavingScreen = ({ onBack }: { onBack: () => void }) => {
  const [subjects, setSubjects] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<{subject: string, question: string, options: string[], correctIndex: number, explanation: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    const validSubjects = subjects.filter(s => s.trim() !== '');
    if (validSubjects.length < 2) {
      alert('Por favor, insira pelo menos 2 matérias para intercalar.');
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.generateInterleavingQuiz(validSubjects);
      setQuiz(res);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === quiz[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Finished
      setCurrentIndex(c => c + 1);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold">Interleaving</h2>
      </header>

      {quiz.length === 0 ? (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase">Quais matérias deseja intercalar?</label>
              {subjects.map((sub, i) => (
                <input 
                  key={i}
                  value={sub}
                  onChange={(e) => {
                    const newSubs = [...subjects];
                    newSubs[i] = e.target.value;
                    setSubjects(newSubs);
                  }}
                  placeholder={`Matéria ${i + 1}`}
                  className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary mb-2"
                />
              ))}
            </div>
            <AnimatedButton onClick={handleGenerate} className="w-full py-4 text-black" glow disabled={loading}>
              {loading ? 'Gerando Quiz Misto...' : 'Iniciar Sessão'}
              <Shuffle size={18} />
            </AnimatedButton>
          </GlassCard>
        </div>
      ) : currentIndex < quiz.length ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              {quiz[currentIndex].subject}
            </div>
            <p className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">
              {currentIndex + 1} / {quiz.length}
            </p>
          </div>
          
          <h3 className="text-xl font-bold leading-relaxed">{quiz[currentIndex].question}</h3>

          <div className="space-y-3">
            {quiz[currentIndex].options.map((opt, i) => {
              let style = "border-white/10 bg-white/5 hover:border-white/20";
              if (selectedOption !== null) {
                if (i === quiz[currentIndex].correctIndex) {
                  style = "border-primary bg-primary/10 text-primary";
                } else if (i === selectedOption) {
                  style = "border-red-500 bg-red-500/10 text-red-500";
                } else {
                  style = "opacity-30 border-white/5 bg-transparent";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <GlassCard className="p-5 border-primary/20 bg-primary/5">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Explicação</h4>
                <p className="text-sm text-white/90 leading-relaxed">{quiz[currentIndex].explanation}</p>
              </GlassCard>
              <AnimatedButton onClick={nextQuestion} className="w-full py-4 text-black" glow>
                {currentIndex === quiz.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
                <ChevronRight size={18} />
              </AnimatedButton>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,255,148,0.2)]">
            <Trophy size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Sessão Concluída!</h2>
            <p className="text-text-secondary">Você acertou {score} de {quiz.length} questões.</p>
          </div>
          <AnimatedButton onClick={() => { setQuiz([]); setSubjects(['', '', '']); }} className="w-full max-w-xs py-4 text-black" glow>
            Nova Sessão
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};

const FeynmanMethod = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
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
      setStep(3);
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

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-primary">
            "Se você não consegue explicar algo de forma simples, você não entendeu bem o suficiente." - Richard Feynman
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">1. Escolha o conceito</label>
            <input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Fotossíntese, Segunda Lei de Newton..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
            />
          </div>
          <AnimatedButton onClick={() => setStep(2)} className="w-full py-4">
            Próximo Passo
          </AnimatedButton>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">2. Explique como se fosse para uma criança</label>
            <textarea 
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder={`Explique ${subject} com suas próprias palavras...`}
              rows={8}
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setStep(1)} variant="secondary" className="flex-1">Voltar</AnimatedButton>
            <AnimatedButton onClick={handleAnalyze} className="flex-1 py-4" glow disabled={loading}>
              {loading ? 'Analisando...' : 'Analisar Explicação'}
            </AnimatedButton>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <GlassCard className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">Análise Feynman</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-premium-mono text-text-secondary uppercase">Clareza</span>
                <span className="text-2xl font-premium-title text-primary">{result.score}<span className="text-xs text-text-secondary">/10</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs font-bold text-primary uppercase mb-2">Feedback Geral</p>
                <p className="text-sm text-text-secondary leading-relaxed">{result.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-orange-400 uppercase">Lacunas Identificadas</p>
                  <div className="space-y-2">
                    {result.gaps?.map((gap: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-text-secondary">
                        <AlertCircle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                        {gap}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-green-400 uppercase">Sugestões de Simplificação</p>
                  <div className="space-y-2">
                    {result.simplifications?.map((sim: string, i: number) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-text-secondary">
                        <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                        {sim}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          <AnimatedButton onClick={() => { setStep(1); setSubject(''); setExplanation(''); setResult(null); }} className="w-full">
            Novo Conceito
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};

const BlurtingMethod = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
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
      setStep(3);
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

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-purple-500' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-sm text-purple-400">
            Escreva tudo o que você lembra sobre o tema sem consultar nenhum material. Depois, a IA comparará com o conteúdo completo.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">1. Qual o tema?</label>
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Revolução Francesa, Tabela Periódica..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary"
            />
          </div>
          <AnimatedButton onClick={() => setStep(2)} className="w-full py-4 bg-purple-500 hover:bg-purple-600 border-purple-500">
            Próximo Passo
          </AnimatedButton>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase">2. Escreva tudo o que lembra</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Comece a escrever tudo o que está na sua cabeça sobre ${topic}...`}
              rows={10}
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2">
            <AnimatedButton onClick={() => setStep(1)} variant="secondary" className="flex-1">Voltar</AnimatedButton>
            <AnimatedButton onClick={handleCompare} className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 border-purple-500" glow disabled={loading}>
              {loading ? 'Comparando...' : 'Comparar e Ver Omissões'}
            </AnimatedButton>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-purple-400">Resultado do Blurting</h3>
            <div className="prose prose-invert prose-sm">
              <Markdown>{result.feedback}</Markdown>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-primary uppercase">Pontos que você lembrou</p>
                <div className="space-y-2">
                  {result.remembered?.map((item: string, i: number) => (
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
                  {result.forgotten?.map((item: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start text-sm text-text-secondary">
                      <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          <AnimatedButton onClick={() => { setStep(1); setTopic(''); setNotes(''); setResult(null); }} className="w-full bg-purple-500 hover:bg-purple-600 border-purple-500">
            Novo Blurting
          </AnimatedButton>
        </div>
      )}
    </div>
  );
};


const AnkiSystem = ({ onBack }: { onBack: () => void }) => {
  const { decks, flashcards, addDeck, addFlashcard, reviewFlashcard } = useStore();
  const [view, setView] = useState<'list' | 'study' | 'add-deck' | 'add-card' | 'ai-generate'>('list');
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [newDeckName, setNewDeckName] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardSubject, setNewCardSubject] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const deckCards = selectedDeckId ? flashcards.filter(f => f.deckId === selectedDeckId) : [];
  const cardsToReview = deckCards.filter(f => new Date(f.nextReview) <= new Date());

  const handleDifficulty = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    const card = cardsToReview[currentCardIdx];
    
    reviewFlashcard(card.id, difficulty);

    if (difficulty === 'good' || difficulty === 'easy') {
      playSuccessSound();
      triggerConfetti();
    }

    if (currentCardIdx < cardsToReview.length - 1) {
      setCurrentCardIdx(currentCardIdx + 1);
    } else {
      setView('list');
      setSelectedDeckId(null);
    }
  };

  if (view === 'study' && selectedDeckId) {
    const card = cardsToReview[currentCardIdx];
    const progress = ((currentCardIdx) / cardsToReview.length) * 100;

    if (!card) return (
      <div className="p-6 h-screen flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
          <Check size={40} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Deck Finalizado!</h2>
          <p className="text-text-secondary">Você revisou todos os cards de hoje.</p>
        </div>
        <AnimatedButton onClick={() => setView('list')} className="px-8">Voltar ao Início</AnimatedButton>
      </div>
    );

    return (
      <div className="p-6 space-y-8 h-screen flex flex-col bg-background/50">
        <header className="flex justify-between items-center">
          <button onClick={() => setView('list')} className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Sessão de Estudo</p>
            <p className="text-sm font-black italic">STUDY<span className="text-primary">FLOW</span></p>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold font-mono">
            {currentCardIdx + 1} / {cardsToReview.length}
          </div>
        </header>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]"
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <Flashcard 
            key={card.id}
            front={card.front}
            back={card.back}
            subject={card.subject}
            onDifficulty={handleDifficulty}
            currentInterval={card.interval}
            easeFactor={card.easeFactor}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (view === 'list') onBack();
            else setView('list');
          }} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">
            {view === 'list' ? 'Meus Decks' : 
             view === 'add-deck' ? 'Novo Deck' : 
             view === 'add-card' ? 'Novo Card' : 'Estudo'}
          </h2>
        </div>
        {view === 'list' && (
          <button onClick={() => setView('add-deck')} className="p-2 bg-primary text-black rounded-xl shadow-[0_0_15px_rgba(0,255,148,0.3)]">
            <Plus size={20} />
          </button>
        )}
      </header>

      {view === 'add-deck' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-primary">
            Crie um novo conjunto de cards para organizar seus estudos por temas ou matérias.
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Nome do Deck</label>
            <input 
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Ex: Biologia Molecular, Direito Civil..."
              className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors"
            />
          </div>
          <AnimatedButton onClick={() => {
            if (!newDeckName.trim()) return;
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
          }} className="w-full py-4">
            Criar Deck
          </AnimatedButton>
        </div>
      )}

      {view === 'add-card' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1 bg-primary rounded-full" />
            <div className="flex-1 h-1 bg-white/10 rounded-full" />
            <div className="flex-1 h-1 bg-white/10 rounded-full" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Assunto/Tópico</label>
              <input 
                value={newCardSubject}
                onChange={(e) => setNewCardSubject(e.target.value)}
                placeholder="Ex: Mitocôndrias, Artigo 5º..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Frente (Pergunta)</label>
              <textarea 
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder="O que você quer perguntar?"
                rows={3}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Verso (Resposta)</label>
              <textarea 
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder="Qual é a resposta correta?"
                rows={3}
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
            <AnimatedButton onClick={() => {
              if (selectedDeckId && newCardFront.trim() && newCardBack.trim()) {
                addFlashcard({
                  id: Math.random().toString(36).substr(2, 9),
                  deckId: selectedDeckId,
                  front: newCardFront,
                  back: newCardBack,
                  subject: newCardSubject || 'Geral',
                  level: 'Novo',
                  interval: 0,
                  nextReview: new Date().toISOString()
                });
                const { trackFeature } = useStore.getState();
                trackFeature('flashcards');
                setNewCardFront('');
                setNewCardBack('');
                setNewCardSubject('');
                setView('list');
              }
            }} className="flex-1">Adicionar Card</AnimatedButton>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {decks.map(deck => {
          const cards = flashcards.filter(f => f.deckId === deck.id);
          const reviewCount = cards.filter(f => new Date(f.nextReview) <= new Date()).length;

          return (
            <GlassCard key={deck.id} className="space-y-4 group relative">
              <button 
                onClick={() => {
                  if (confirm(`Excluir deck "${deck.name}" e todos os seus cards?`)) {
                    useStore.getState().deleteDeck(deck.id);
                  }
                }}
                className="absolute top-4 right-4 p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg z-10"
              >
                <Trash2 size={16} />
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{deck.name}</h3>
                  <p className="text-xs text-text-secondary">{cards.length} cards no total</p>
                </div>
                {reviewCount > 0 && (
                  <div className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-lg border border-primary/30 mr-8">
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
                <AnimatedButton 
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setView('ai-generate');
                  }} 
                  variant="ghost" 
                  className="p-2 rounded-xl border border-primary/20 text-primary hover:bg-primary/10"
                >
                  <Sparkles size={16} />
                </AnimatedButton>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {view === 'ai-generate' && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_30px_rgba(0,255,148,0.2)]">
                <Sparkles size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Gerar com IA</h2>
              <p className="text-xs text-text-secondary uppercase tracking-widest">StudyFlow Neural Engine</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Sobre qual tópico?</label>
                <input 
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Mitocôndrias, Revolução Francesa..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-[10px] text-primary leading-relaxed">
                A IA irá analisar o tópico e gerar 5 flashcards otimizados para memorização de longo prazo.
              </div>

              <div className="flex gap-3">
                <AnimatedButton onClick={() => setView('list')} variant="secondary" className="flex-1">Cancelar</AnimatedButton>
                <AnimatedButton 
                  onClick={async () => {
                    if (!aiTopic.trim() || isGenerating) return;
                    setIsGenerating(true);
                    try {
                      const result = await aiService.generateFlashcards(aiTopic);
                      if (result && result.flashcards) {
                        result.flashcards.forEach((f: any) => {
                          addFlashcard({
                            id: Math.random().toString(36).substr(2, 9),
                            deckId: selectedDeckId!,
                            front: f.front,
                            back: f.back,
                            subject: aiTopic,
                            level: 'Novo',
                            interval: 0,
                            nextReview: new Date().toISOString()
                          });
                        });
                        setAiTopic('');
                        setView('list');
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsGenerating(false);
                    }
                  }} 
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : 'Gerar Cards'}
                </AnimatedButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};



const Ranking = ({ onBack }: { onBack: () => void }) => {
  const { leaderboard, name, xp, level, streak, history, updateLeaderboard } = useStore();
  const [filter, setFilter] = useState<'Global' | 'Semanal' | 'Mensal'>('Global');

  useEffect(() => {
    updateLeaderboard();
  }, [updateLeaderboard]);

  const displayLeaderboard = useMemo(() => {
    if (filter === 'Semanal') {
      return [...leaderboard].map(e => ({
        ...e,
        xp: Math.floor(e.xp * 0.15),
        solved: Math.floor(e.solved * 0.15),
        medals: { gold: 0, silver: (e.medals?.gold || 0) > 0 ? 1 : 0, bronze: (e.medals?.silver || 0) > 0 ? 1 : 0 }
      })).sort((a, b) => b.xp - a.xp);
    }
    if (filter === 'Mensal') {
      return [...leaderboard].map(e => ({
        ...e,
        xp: Math.floor(e.xp * 0.4),
        solved: Math.floor(e.solved * 0.4),
        medals: { gold: Math.floor((e.medals?.gold || 0) * 0.5), silver: Math.floor((e.medals?.silver || 0) * 0.5), bronze: Math.floor((e.medals?.bronze || 0) * 0.5) }
      })).sort((a, b) => b.xp - a.xp);
    }
    return [...leaderboard].sort((a, b) => b.xp - a.xp);
  }, [leaderboard, filter]);

  const myRank = displayLeaderboard.findIndex(e => e.id === 'me') + 1;
  const myEntry = displayLeaderboard.find(e => e.id === 'me');

  return (
    <div className="p-6 space-y-8 pb-32 relative min-h-screen bg-black overflow-hidden font-sans">
      {/* Cyberpunk Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E88F10_1px,transparent_1px),linear-gradient(to_bottom,#00E88F10_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20" />
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen" 
        />
        {/* Data Streams */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -1000, opacity: 0 }}
              animate={{ y: 1000, opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
              className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-primary to-transparent"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 hover:border-primary/50 transition-colors group">
            <ChevronLeft size={20} className="text-primary group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="relative">
            <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-white drop-shadow-[0_0_15px_rgba(0,232,143,0.5)] uppercase italic">
              Ranking
            </h2>
            <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-primary via-transparent to-transparent" />
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,232,143,1)]" />
              <span className="text-primary font-premium-mono text-[9px] tracking-[0.2em] uppercase">Global Network Active</span>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors" />
          <div className="p-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-primary/50 relative overflow-hidden" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            <Trophy size={24} className="text-primary relative z-10 drop-shadow-[0_0_10px_rgba(0,232,143,1)]" />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 relative z-10">
        {['Global', 'Semanal', 'Mensal'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={clsx(
              "px-6 py-2.5 border text-[10px] font-premium-mono font-bold transition-all uppercase tracking-widest whitespace-nowrap relative overflow-hidden group",
              filter === f 
                ? 'bg-primary/10 text-primary border-primary shadow-[0_0_20px_rgba(0,255,148,0.3)]' 
                : 'bg-black/40 border-white/10 text-white/50 hover:border-primary/50 hover:text-white'
            )}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {filter === f && (
              <motion.div layoutId="filter-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_rgba(0,232,143,1)]" />
            )}
            <span className="relative z-10">{f}</span>
          </button>
        ))}
      </div>

      {/* Cyber Podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 pt-20 pb-16 relative z-10">
        {/* 2nd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col items-center relative z-10 w-28"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gray-400/20 blur-xl rounded-full" />
            <div className="w-16 h-16 p-[2px] bg-gradient-to-b from-gray-300 to-gray-600 relative z-10 shadow-[0_0_20px_rgba(156,163,175,0.5)]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="w-full h-full bg-black overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayLeaderboard[1]?.name}`} alt="" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-400 text-gray-300 px-3 py-0.5 text-[10px] font-premium-mono font-black z-20 shadow-[0_0_10px_rgba(156,163,175,0.5)]" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
              #2
            </div>
          </div>
          <div className="text-center relative z-10 mb-4">
            <p className="text-xs font-bold truncate w-28 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{displayLeaderboard[1]?.name}</p>
            <p className="text-[10px] text-gray-400 font-premium-mono mt-1 font-bold tracking-widest">{displayLeaderboard[1]?.xp} XP</p>
          </div>
          {/* Pedestal */}
          <div className="w-full h-32 relative flex flex-col items-center justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-500/20 to-transparent border-x border-t border-gray-400/50 backdrop-blur-md" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(156,163,175,0.1)_2px)] bg-[size:100%_4px]" />
            </div>
            <div className="w-full h-2 bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.8)] relative z-10" />
            <div className="absolute bottom-2 w-1/2 h-[1px] bg-gray-300/50" />
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col items-center relative z-20 w-36 -mt-16"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full animate-pulse" />
            <Crown size={40} className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)]" fill="currentColor" />
            
            {/* Holographic Ring */}
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-yellow-400/30 border-dashed rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-yellow-400/10 border-dotted rounded-full"
            />

            <div className="w-24 h-24 p-[3px] bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700 relative z-10 shadow-[0_0_30px_rgba(250,204,21,0.6)]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="w-full h-full bg-black overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayLeaderboard[0]?.name}`} alt="" className="w-full h-full object-cover opacity-100" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-900 border border-yellow-400 text-yellow-400 px-4 py-1 text-xs font-premium-mono font-black z-20 shadow-[0_0_15px_rgba(250,204,21,0.8)]" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
              #1
            </div>
          </div>
          <div className="text-center relative z-10 mb-4">
            <p className="text-base font-black truncate w-36 text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]">{displayLeaderboard[0]?.name}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <span className="text-[9px] font-premium-mono text-yellow-400 uppercase border border-yellow-400/50 px-2 py-0.5 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.3)]" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                LVL {displayLeaderboard[0]?.level}
              </span>
            </div>
            <p className="text-sm text-yellow-400 font-premium-mono font-black mt-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] tracking-widest">{displayLeaderboard[0]?.xp} XP</p>
          </div>
          {/* Pedestal */}
          <div className="w-full h-44 relative flex flex-col items-center justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 via-yellow-500/10 to-transparent border-x-2 border-t-2 border-yellow-400/80 backdrop-blur-md" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(250,204,21,0.15)_2px)] bg-[size:100%_4px]" />
              {/* Energy core */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-t from-yellow-200 to-transparent blur-[2px] opacity-80" />
            </div>
            <div className="w-full h-2.5 bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,1)] relative z-10" />
            <div className="absolute bottom-3 w-2/3 h-[2px] bg-yellow-200/80 shadow-[0_0_10px_rgba(250,204,21,1)]" />
          </div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col items-center relative z-10 w-28"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
            <div className="w-16 h-16 p-[2px] bg-gradient-to-b from-orange-400 to-orange-700 relative z-10 shadow-[0_0_20px_rgba(249,115,22,0.4)]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="w-full h-full bg-black overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayLeaderboard[2]?.name}`} alt="" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-950 border border-orange-500 text-orange-400 px-3 py-0.5 text-[10px] font-premium-mono font-black z-20 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}>
              #3
            </div>
          </div>
          <div className="text-center relative z-10 mb-4">
            <p className="text-xs font-bold truncate w-28 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">{displayLeaderboard[2]?.name}</p>
            <p className="text-[10px] text-orange-400 font-premium-mono mt-1 font-bold tracking-widest">{displayLeaderboard[2]?.xp} XP</p>
          </div>
          {/* Pedestal */}
          <div className="w-full h-24 relative flex flex-col items-center justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent border-x border-t border-orange-500/50 backdrop-blur-md" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,rgba(249,115,22,0.1)_2px)] bg-[size:100%_4px]" />
            </div>
            <div className="w-full h-2 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] relative z-10" />
            <div className="absolute bottom-2 w-1/2 h-[1px] bg-orange-300/50" />
          </div>
        </motion.div>
      </div>

      {/* Cyber List */}
      <div className="space-y-3 pb-24 relative z-10">
        {displayLeaderboard.slice(3, 15).map((entry, index) => {
          const maxXP = displayLeaderboard[0]?.xp || 1;
          const progress = Math.max(2, (entry.xp / maxXP) * 100);
          const isMe = entry.id === 'me';
          
          return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01, x: 5 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            {isMe && (
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-none" />
            )}
            
            <div 
              className={clsx(
                "relative p-4 bg-black/60 backdrop-blur-xl flex items-center gap-4 transition-all overflow-hidden border-l-4",
                isMe ? 'border-primary border-y border-r border-y-primary/30 border-r-primary/30 shadow-[0_0_20px_rgba(0,255,148,0.2)]' : 'border-white/20 border-y border-r border-y-white/5 border-r-white/5 hover:border-l-primary/50 hover:bg-white/5'
              )}
              style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
            >
              {/* Cyber Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
              
              {/* Scanline on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent -translate-y-full group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none" />

              {/* Rank Number */}
              <div className="w-12 flex flex-col items-center justify-center border-r border-white/10 pr-3 relative z-10">
                <span className="text-[7px] text-white/40 font-premium-mono uppercase tracking-[0.2em] mb-1">Rank</span>
                <span className={clsx(
                  "font-premium-mono font-black text-xl",
                  isMe ? 'text-primary drop-shadow-[0_0_8px_rgba(0,232,143,0.8)]' : 'text-white/70'
                )}>
                  {index + 4 < 10 ? `0${index + 4}` : index + 4}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 p-[1px] bg-gradient-to-br from-white/20 to-white/5 relative z-10" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <div className="w-full h-full bg-black overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 relative z-10">
                <p className={clsx("font-bold text-sm tracking-widest uppercase", isMe ? 'text-primary drop-shadow-[0_0_5px_rgba(0,232,143,0.5)]' : 'text-white/90')}>{entry.name}</p>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 border border-white/10" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                    <span className="text-[8px] font-premium-mono text-primary uppercase">LVL</span>
                    <span className="text-[10px] font-premium-mono text-white">{entry.level}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 border border-white/10" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                    <span className="text-[8px] font-premium-mono text-cyan-400 uppercase">QST</span>
                    <span className="text-[10px] font-premium-mono text-white">{entry.solved}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/50 px-1.5 py-0.5 border border-white/10" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                    <span className="text-[8px] font-premium-mono text-orange-500 uppercase">STRK</span>
                    <span className="text-[10px] font-premium-mono text-white">{entry.streak}</span>
                  </div>
                </div>
                {/* Cyber Progress Bar */}
                <div className="w-full h-1.5 bg-white/5 mt-3 relative overflow-hidden" style={{ clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + index * 0.05, ease: "easeOut" }}
                    className={clsx(
                      "absolute top-0 left-0 h-full",
                      isMe ? 'bg-primary shadow-[0_0_10px_rgba(0,232,143,0.8)]' : 'bg-white/30'
                    )}
                  />
                  {/* Progress bar segments */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_90%,rgba(0,0,0,0.5)_90%)] bg-[size:10px_100%]" />
                </div>
              </div>

              {/* XP */}
              <div className="text-right flex flex-col items-end pl-3 border-l border-white/10 relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_5px_rgba(0,232,143,0.8)]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                  <span className="text-[7px] text-primary/80 uppercase font-premium-mono tracking-[0.2em]">POWER</span>
                </div>
                <p className="text-primary font-premium-mono font-black text-lg leading-none tracking-widest drop-shadow-[0_0_5px_rgba(0,232,143,0.3)]">{entry.xp.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Floating Cyber User Rank */}
      <AnimatePresence>
        {myRank > 3 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 p-4 bg-black/95 backdrop-blur-2xl flex items-center gap-4 z-30 border-t-2 border-primary shadow-[0_-10px_30px_rgba(0,232,143,0.15)]"
            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)' }}
          >
            {/* Cyber accents */}
            <div className="absolute top-0 left-0 w-20 h-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            <div className="absolute top-2 right-4 flex gap-1">
              <div className="w-1 h-1 bg-primary animate-pulse" />
              <div className="w-1 h-1 bg-primary animate-pulse delay-75" />
              <div className="w-1 h-1 bg-primary animate-pulse delay-150" />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E88F05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <div className="w-12 flex flex-col items-center justify-center border-r border-white/10 pr-3 relative z-10">
              <span className="text-[7px] text-primary/70 font-premium-mono uppercase tracking-[0.2em] mb-1">Rank</span>
              <span className="font-premium-mono font-black text-2xl text-primary drop-shadow-[0_0_10px_rgba(0,232,143,0.8)]">
                {myRank < 10 ? `0${myRank}` : myRank}
              </span>
            </div>
            
            <div className="w-12 h-12 p-[1px] bg-gradient-to-br from-primary to-primary/20 relative z-10" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <div className="w-full h-full bg-black overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${myEntry?.name}`} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex-1 relative z-10">
              <p className="font-bold text-sm text-white tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{myEntry?.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-premium-mono text-primary uppercase tracking-wider">LVL {myEntry?.level}</span>
                <div className="w-1 h-1 bg-primary/50" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <span className="text-[10px] font-premium-mono text-cyan-400 uppercase tracking-wider">{myEntry?.solved} QST</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(0,232,143,1)]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                <span className="text-[8px] text-primary uppercase font-premium-mono tracking-[0.2em]">POWER</span>
              </div>
              <p className="text-primary font-premium-mono font-black text-xl leading-none tracking-widest drop-shadow-[0_0_10px_rgba(0,232,143,0.5)]">{myEntry?.xp.toLocaleString()}</p>
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
    if (entry.count < 5) return 'bg-primary/30 border-primary/10';
    if (entry.count < 10) return 'bg-primary/50 border-primary/20';
    if (entry.count < 20) return 'bg-primary/80 border-primary/30';
    return 'bg-primary shadow-[0_0_15px_rgba(0,255,148,0.8)] border-primary/40';
  };

  return (
    <div className="flex flex-col gap-1 w-full overflow-x-auto no-scrollbar py-2">
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
        {days.map((date, i) => (
          <motion.div
            key={date}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.005, ease: "easeOut" }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            className={cn(
              "w-3 h-3 rounded-[3px] border transition-all duration-300", 
              getIntensity(date)
            )}
            title={`${date}: ${data.find(d => d.date === date)?.count || 0} questões`}
          />
        ))}
      </div>
    </div>
  );
};

const Reports = ({ onBack }: { onBack: () => void }) => {
  const { history, xp, streak, themeColor, trackFeature } = useStore();

  useEffect(() => {
    trackFeature('reports');
  }, [trackFeature]);
  
  const total = history.length;
  const correct = history.filter(h => h.isCorrect).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    const daysBack = 6 - i;
    d.setDate(d.getDate() - daysBack);
    const dateStr = d.toISOString().split('T')[0];
    const dayHistory = history.filter(h => h.timestamp.startsWith(dateStr));
    return {
      name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      q: dayHistory.length,
      accuracy: dayHistory.length > 0 ? Math.round((dayHistory.filter(h => h.isCorrect).length / dayHistory.length) * 100) : 0
    };
  });

  const validTimes = history.filter(h => h.timeSpent && h.timeSpent > 0).map(h => h.timeSpent!);
  const avgTimeSeconds = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0;
  const avgTime = avgTimeSeconds > 0 ? `${avgTimeSeconds}s` : "--";

  const subjectData = Object.keys(TOPICS).map(subject => {
    const subHistory = history.filter(h => {
      const q = QUESTION_MAP[h.questionId];
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
      const q = QUESTION_MAP[h.questionId];
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
    { name: 'Acertos', value: correct, color: themeColor },
    { name: 'Erros', value: incorrect, color: '#FF4444' }
  ];

  const difficultyData = [
    { name: 'Fácil', value: history.filter(h => QUESTION_MAP[h.questionId]?.difficulty === 'Easy').length, color: themeColor },
    { name: 'Médio', value: history.filter(h => QUESTION_MAP[h.questionId]?.difficulty === 'Medium').length, color: '#FFB800' },
    { name: 'Difícil', value: history.filter(h => QUESTION_MAP[h.questionId]?.difficulty === 'Hard').length, color: '#FF4444' }
  ].filter(d => d.value > 0);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Evolution data
  const evolutionData = Array.from({ length: timeRange === '7d' ? 7 : (timeRange === '30d' ? 30 : 90) }, (_, i) => {
    const d = new Date();
    const daysBack = (timeRange === '7d' ? 6 : (timeRange === '30d' ? 29 : 89)) - i;
    d.setDate(d.getDate() - daysBack);
    const dateStr = d.toISOString().split('T')[0];
    const dayHistory = history.filter(h => h.timestamp.startsWith(dateStr));
    const count = dayHistory.length;
    const correctCount = dayHistory.filter(h => h.isCorrect).length;
    const accuracy = count > 0 ? Math.round((correctCount / count) * 100) : 0;
    return { 
      name: timeRange === '7d' ? d.toLocaleDateString('pt-BR', { weekday: 'short' }) : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
      q: count, 
      accuracy 
    };
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

      {/* Evolution Line Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Evolução do Aprendizado</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeRange('7d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '7d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeRange('30d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '30d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              30D
            </button>
            <button 
              onClick={() => setTimeRange('90d')}
              className={cn("px-3 py-1 text-[8px] font-bold uppercase rounded-lg transition-all", timeRange === '90d' ? "bg-primary text-black" : "text-text-secondary")}
            >
              90D
            </button>
          </div>
        </div>
        <GlassCard className="p-6" glow>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={evolutionData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeColor} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={themeColor} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#ffffff20" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                  dx={10}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '10px' }}
                  itemStyle={{ color: themeColor }}
                />
                <Bar yAxisId="left" dataKey="q" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#00E88F" 
                  strokeWidth={2} 
                  dot={{ r: 2, fill: '#00E88F' }}
                  name="Precisão %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/30" />
              <span className="text-[8px] font-bold text-text-secondary uppercase">Questões</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E88F]" />
              <span className="text-[8px] font-bold text-text-secondary uppercase">Precisão %</span>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Radar Chart */}
      {subjectData.length > 2 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Domínio por Matéria</h3>
          </div>
          <GlassCard className="p-6" glow>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Precisão %"
                    dataKey="percent"
                    stroke={themeColor}
                    fill={themeColor}
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', fontSize: '10px' }}
                    itemStyle={{ color: themeColor }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Heatmap */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Frequência de Estudo (90 dias)</h3>
        </div>
        <GlassCard className="p-4" glow>
          <Heatmap data={heatmapData} />
        </GlassCard>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {bestSubject && (
          <GlassCard className="p-4 border-primary/30 bg-primary/5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[30px] -mr-12 -mt-12 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Trophy size={16} />
                <h3 className="font-bold uppercase tracking-widest text-[10px]">Melhor Matéria</h3>
              </div>
              <p className="text-lg font-premium-title truncate">{bestSubject.name}</p>
              <p className="text-[10px] text-text-secondary font-premium-mono mt-1"><span className="text-primary font-bold">{bestSubject.percent}%</span> de acerto</p>
            </div>
          </GlassCard>
        )}

        {worstSubject && (
          <GlassCard className="p-4 border-red-500/30 bg-red-500/5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[30px] -mr-12 -mt-12 rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-red-500">
                <AlertCircle size={16} />
                <h3 className="font-bold uppercase tracking-widest text-[10px]">Pior Matéria</h3>
              </div>
              <p className="text-lg font-premium-title truncate">{worstSubject.name}</p>
              <p className="text-[10px] text-text-secondary font-premium-mono mt-1"><span className="text-red-500 font-bold">{worstSubject.percent}%</span> de acerto</p>
            </div>
          </GlassCard>
        )}
      </div>

      {worstSubject && (
        <GlassCard className="p-5 border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[40px] -mr-16 -mt-16 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-yellow-500">
              <Sparkles size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Recomendação da IA</h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Notei que você está com dificuldade em <strong className="text-white">{worstSubject.name}</strong> ({worstSubject.percent}% de acerto). 
              Recomendo focar na revisão dos tópicos que você mais errou recentemente. Quer que eu monte um plano de estudos focado nisso?
            </p>
          </div>
        </GlassCard>
      )}

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
                    <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
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
                  itemStyle={{ color: themeColor }}
                />
                <Line 
                  type="monotone" 
                  dataKey="q" 
                  stroke={themeColor} 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: themeColor, strokeWidth: 2, stroke: '#000' }}
                  activeDot={{ r: 6, fill: themeColor, strokeWidth: 0 }}
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
        
        {worstSubject && (
          <GlassCard className="p-5 border-white/10 mt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">Recomendação da IA</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Notei que seu desempenho em <span className="text-white font-bold">{worstSubject.name}</span> está abaixo da média ({worstSubject.percent}%). 
                  Recomendo focar em revisar os conceitos básicos e resolver questões de nível fácil antes de avançar.
                  Que tal criar um plano de estudos focado nisso?
                </p>
              </div>
            </div>
          </GlassCard>
        )}
      </section>
    </div>
  );
};

const XPGain = ({ amount, onComplete }: { amount: number, onComplete: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{ opacity: 1, y: -50, scale: 1.5 }}
      exit={{ opacity: 0, scale: 2 }}
      onAnimationComplete={onComplete}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full shadow-[0_0_30px_rgba(0,232,143,0.5)]">
        <Sparkles size={20} className="text-primary animate-pulse" />
        <span className="text-2xl font-black text-primary font-premium-mono">+{amount} XP</span>
      </div>
    </motion.div>
  );
};

const InlineQuestionCard = ({ q, onNavigate }: { q: Question, onNavigate?: (tab: string) => void }) => {
  const { addXP, addToHistory, toggleFavorite, favorites, reviewLater, toggleReviewLater, updateMastery } = useStore();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAnswer = (idx: number) => {
    if (confirmed) return;
    setSelectedOption(idx);
  };

  const confirmAnswer = async () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedOption === q.resposta;
    if (isCorrect) {
      playSuccessSound();
      triggerConfetti();
    }
    const entry = {
      questionId: q.id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    addToHistory(entry);
    updateMastery(q.materia, isCorrect ? 100 : 0);
    
    // Sync with backend
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: entry })
      });
      
      if (isCorrect) {
        addXP(20);
        await fetch('/api/user/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 20 })
        });
      }
    } catch (e) {
      console.error("Failed to sync from InlineQuestionCard", e);
    }
    
    setShowExplanation(true);
  };

  const explainWithAI = async () => {
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

  return (
    <GlassCard className="p-5 space-y-6 group hover:border-primary/30 transition-colors relative overflow-hidden" glow>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-wrap gap-2">
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
          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-blue-500/20">
            {q.accuracyRate ?? (q.difficulty === 'Easy' ? 75 : q.difficulty === 'Medium' ? 45 : 20)}% ACERTO
          </span>
          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-purple-500/20">
            {q.materia} • {q.assunto}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleReviewLater(q.id)}
            className={`p-1.5 rounded-lg border transition-all ${reviewLater.includes(q.id) ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
            title="Revisar Depois"
          >
            <Bookmark size={14} fill={reviewLater.includes(q.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => toggleFavorite(q.id)}
            className={`p-1.5 rounded-lg border transition-all ${favorites.includes(q.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
            title="Favoritar"
          >
            <Star size={14} fill={favorites.includes(q.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <p className="text-sm font-medium leading-relaxed text-white/90 relative z-10">{q.pergunta}</p>
      
      <div className="space-y-3 relative z-10">
        {q.alternativas.map((opt, i) => {
          let style = "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10";
          let iconColor = "bg-white/5 text-text-secondary group-hover:bg-white/10";
          
          if (selectedOption !== null) {
            if (confirmed) {
              if (i === q.resposta) {
                style = "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]";
                iconColor = "bg-primary text-black";
              } else if (i === selectedOption) {
                style = "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                iconColor = "bg-red-500 text-white";
              } else {
                style = "opacity-30 border-white/5 bg-transparent grayscale";
              }
            } else if (i === selectedOption) {
              style = "border-primary bg-primary/30 text-primary shadow-[0_0_15px_rgba(0,255,148,0.2)]";
              iconColor = "bg-primary text-black";
            }
          }

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(i)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 group ${style}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${iconColor}`}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm font-medium leading-relaxed mt-1">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {!confirmed && selectedOption !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 relative z-10">
          <AnimatedButton onClick={confirmAnswer} className="w-full py-3" glow>
            Confirmar Resposta
          </AnimatedButton>
        </motion.div>
      )}

      {confirmed && showExplanation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-4 pt-4 border-t border-white/10 relative z-10"
        >
          <div className={`p-4 rounded-xl border ${selectedOption === q.resposta ? 'bg-primary/5 border-primary/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === q.resposta ? (
                <>
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm font-bold text-primary">Resposta Correta!</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-500" />
                  <span className="text-sm font-bold text-red-500">Resposta Incorreta</span>
                </>
              )}
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{q.explicacao}</p>
          </div>

          <div className="flex gap-3">
            <AnimatedButton 
              onClick={explainWithAI} 
              disabled={loadingAI}
              variant="secondary" 
              className="flex-1 border-primary/20 bg-primary/5 text-primary text-xs py-2"
            >
              {loadingAI ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><Brain size={16} className="mr-2 inline-block" /> Explicar com IA</>}
            </AnimatedButton>
            
            {selectedOption !== q.resposta && (
              <AnimatedButton 
                onClick={explainErrorWithAI}
                disabled={loadingAI}
                variant="secondary" 
                className="flex-1 border-red-500/20 bg-red-500/5 text-red-500 text-xs py-2"
              >
                {loadingAI ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><AlertCircle size={16} className="mr-2 inline-block" /> Por que errei?</>}
              </AnimatedButton>
            )}
          </div>

          {aiExplanation && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl border border-primary/20 bg-primary/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={16} className="text-primary" />
                <span className="text-xs font-premium-mono font-bold text-primary uppercase tracking-widest">Explicação da IA</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <Markdown>{aiExplanation}</Markdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </GlassCard>
  );
};

const Questions = ({ onNavigate }: { onNavigate?: (tab: 'splash' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving') => void }) => {
  const [view, setView] = useState<'bank' | 'training' | 'exam' | 'result' | 'exam-setup' | 'review' | 'external-banks' | 'ai-setup'>('bank');
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(10);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'wrong' | 'unanswered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyReviewLater, setShowOnlyReviewLater] = useState(useStore.getState().showOnlyReviewLater || false);
  
  const deferredFilterSubject = useDeferredValue(filterSubject);
  const deferredFilterTopic = useDeferredValue(filterTopic);
  const deferredFilterDifficulty = useDeferredValue(filterDifficulty);
  const deferredFilterYear = useDeferredValue(filterYear);
  const deferredFilterSource = useDeferredValue(filterSource);
  const deferredFilterStatus = useDeferredValue(filterStatus);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredShowOnlyFavorites = useDeferredValue(showOnlyFavorites);
  const deferredShowOnlyReviewLater = useDeferredValue(showOnlyReviewLater);

  useEffect(() => {
    return () => {
      useStore.setState({ showOnlyReviewLater: false });
    };
  }, []);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [examTime, setExamTime] = useState(0);
  const [examDuration, setExamDuration] = useState(30); // minutes
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [correct, setCorrect] = useState(0);
  const [saved, setSaved] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const { addXP, addToHistory, toggleFavorite, favorites, history, reviewLater, toggleReviewLater, updateMastery } = useStore();
  const [xpGains, setXpGains] = useState<{ id: number, amount: number }[]>([]);

  const syncXP = async (amount: number) => {
    try {
      await fetch('/api/user/xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      setXpGains(prev => [...prev, { id: Date.now(), amount }]);
    } catch (e) {
      console.error("Failed to sync XP", e);
    }
  };

  const syncHistory = async (entry: any) => {
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: entry })
      });
    } catch (e) {
      console.error("Failed to sync history", e);
    }
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [deferredFilterSubject, deferredFilterTopic, deferredFilterDifficulty, deferredFilterYear, deferredFilterSource, deferredSearchQuery, deferredShowOnlyFavorites, deferredShowOnlyReviewLater, deferredFilterStatus]);

  // Result calculation effect
  useEffect(() => {
    if (view !== 'result' || saved) return;
    let c = 0;
    examQuestions.forEach((q, i) => {
      if (!q) return;
      const isCorrect = userAnswers[i] === q.resposta;
      if (isCorrect) c++;
      addToHistory({
        questionId: q.id,
        userAnswer: userAnswers[i],
        isCorrect,
        timestamp: new Date().toISOString()
      });
      updateMastery(q.materia, isCorrect ? 100 : 0);
    });
    setCorrect(c);
    if (c > 0) addXP(c * 10);
    setSaved(true);
  }, [view, examQuestions, userAnswers, saved, addToHistory, addXP, updateMastery]);

  // Pre-calculate wrong question IDs for faster filtering
  const questionStatusMap = useMemo(() => {
    const latestAttempts = new Map<string, boolean>();
    [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).forEach(h => {
      if (!latestAttempts.has(h.questionId)) {
        latestAttempts.set(h.questionId, h.isCorrect);
      }
    });
    return latestAttempts;
  }, [history]);

  // Filter logic
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      if (!q) return false;
      const matchesSubject = !deferredFilterSubject || q.materia === deferredFilterSubject;
      const matchesTopic = !deferredFilterTopic || q.assunto === deferredFilterTopic;
      const matchesDifficulty = !deferredFilterDifficulty || q.difficulty === deferredFilterDifficulty;
      const matchesYear = !deferredFilterYear || q.ano.toString() === deferredFilterYear;
      const matchesSource = !deferredFilterSource || q.prova === deferredFilterSource;
      const matchesSearch = !deferredSearchQuery || (q.pergunta || '').toLowerCase().includes(deferredSearchQuery.toLowerCase());
      const matchesFavorite = !deferredShowOnlyFavorites || favorites.includes(q.id);
      const matchesReviewLater = !deferredShowOnlyReviewLater || reviewLater.includes(q.id);
      
      let matchesStatus = true;
      if (deferredFilterStatus === 'wrong') {
        matchesStatus = questionStatusMap.get(q.id) === false;
      } else if (deferredFilterStatus === 'unanswered') {
        matchesStatus = !questionStatusMap.has(q.id);
      }

      return matchesSubject && matchesTopic && matchesDifficulty && matchesSearch && matchesFavorite && matchesReviewLater && matchesYear && matchesSource && matchesStatus;
    });
  }, [deferredFilterSubject, deferredFilterTopic, deferredFilterDifficulty, deferredFilterYear, deferredFilterSource, deferredSearchQuery, deferredShowOnlyFavorites, favorites, deferredShowOnlyReviewLater, reviewLater, deferredFilterStatus, questionStatusMap]);

  const errorQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter(q => {
      if (!q) return false;
      const isCorrect = questionStatusMap.get(q.id);
      return isCorrect === false; // Only if latest attempt was wrong
    });
  }, [questionStatusMap]);

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
    } else {
      setUserAnswers({ ...userAnswers, [currentIdx]: idx });
    }
  };

  const confirmAnswer = () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    
    const { trackFeature } = useStore.getState();
    trackFeature('questions');

    const q = examQuestions[currentIdx];
    const isCorrect = selectedOption === q.resposta;
    const entry = {
      questionId: q.id,
      userAnswer: selectedOption,
      isCorrect,
      timestamp: new Date().toISOString()
    };
    addToHistory(entry);
    syncHistory(entry);
    if (isCorrect) {
      addXP(20);
      syncXP(20);
      setCorrect(c => c + 1);
      playSuccessSound();
      triggerConfetti();
      // Auto next after 2.5s if correct
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = setTimeout(() => {
        if (currentIdx < examQuestions.length - 1) {
          setCurrentIdx(c => c + 1);
          setSelectedOption(null);
          setConfirmed(false);
          setShowExplanation(false);
          setAiExplanation('');
        } else {
          setView('result');
        }
      }, 2500);
    }
    setShowExplanation(true);
  };

  const explainWithAI = async () => {
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
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
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
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
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('external-banks')}
                className="px-4 py-2 bg-primary/10 text-primary rounded-2xl text-[10px] font-premium-mono font-bold border border-primary/20 flex items-center gap-2 uppercase tracking-wider"
              >
                <ExternalLink size={14} /> Outros Bancos
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('review')}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-premium-mono font-bold border border-red-500/20 flex items-center gap-2 uppercase tracking-wider"
              >
                <AlertCircle size={14} /> Revisar Erros ({errorQuestions.length})
              </motion.button>
            </div>
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
                title="Favoritas"
              >
                <Star size={20} fill={showOnlyFavorites ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOnlyReviewLater(!showOnlyReviewLater)}
                className={`p-3.5 rounded-2xl border transition-all ${showOnlyReviewLater ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'}`}
                title="Revisar Depois"
              >
                <Bookmark size={20} fill={showOnlyReviewLater ? "currentColor" : "none"} />
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
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-premium-mono font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none min-w-[120px] text-center"
              >
                <option value="all" className="bg-black">Todos Status</option>
                <option value="wrong" className="bg-black">Só Erros</option>
                <option value="unanswered" className="bg-black">Não Respondidas</option>
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
              const hardQs = ALL_QUESTIONS.filter(q => q && q.difficulty === 'Hard');
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
              const enemQs = ALL_QUESTIONS.filter(q => q && q.prova === 'ENEM');
              startTraining(enemQs.length > 0 ? enemQs : filteredQuestions);
            }} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-blue-500/20 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2"
          >
            <Target size={18} />
            Foco ENEM
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setView('ai-setup')} 
            variant="secondary" 
            className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.1em] border-purple-500/20 text-purple-500 bg-purple-500/5 hover:bg-purple-500/10 flex flex-col items-center justify-center gap-2"
            glow
          >
            <Sparkles size={18} />
            Simulador IA
          </AnimatedButton>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h3 className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Questões Encontradas</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.slice(0, visibleCount).map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 20) * 0.05 }}
              >
                <InlineQuestionCard q={q} onNavigate={onNavigate} />
              </motion.div>
            ))}
            
            {visibleCount < filteredQuestions.length && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-premium-mono font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
              >
                Carregar Mais ({filteredQuestions.length - visibleCount} restantes)
              </motion.button>
            )}

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

  const handleGenerateAIQuestions = async () => {
    if (!aiTopic.trim()) return;
    setGeneratingAI(true);
    try {
      const qs = await aiService.generateQuestions(aiTopic, aiCount);
      setExamQuestions(qs);
      setCurrentIdx(0);
      setUserAnswers({});
      setConfirmed(false);
      setShowExplanation(false);
      setSaved(false);
      setView('exam');
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAI(false);
    }
  };

  if (view === 'ai-setup') {
    return (
      <div className="p-6 space-y-8 pb-24">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('bank')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-premium-title italic uppercase">Simulador IA</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Geração Dinâmica de Questões</p>
          </div>
        </header>

        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Tópico ou Matéria</label>
              <input 
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Ex: Termodinâmica, Geometria Analítica..."
                className="w-full bg-card border border-border rounded-2xl p-4 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Quantidade de Questões</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map(n => (
                  <button
                    key={n}
                    onClick={() => setAiCount(n)}
                    className={`py-3 rounded-xl border text-[10px] font-premium-mono font-bold transition-all ${aiCount === n ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-text-secondary'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <AnimatedButton 
              onClick={handleGenerateAIQuestions} 
              className="w-full py-4 mt-4" 
              glow 
              disabled={generatingAI || !aiTopic.trim()}
            >
              {generatingAI ? 'Gerando Questões...' : 'Iniciar Simulado IA'}
              <Sparkles size={18} className="ml-2" />
            </AnimatedButton>
          </GlassCard>

          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex gap-3 items-start">
            <Info size={18} className="text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-purple-200/70 leading-relaxed uppercase font-bold tracking-tight">
              A IA gerará questões inéditas baseadas no tópico escolhido, seguindo o padrão de grandes vestibulares. Ideal para treinar assuntos específicos que você ainda não domina.
            </p>
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
          <h2 className="text-2xl font-premium-title italic uppercase">MODO PROVA REAL</h2>
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
              const examQs = ALL_QUESTIONS.filter(q => q && q.prova === filterSource).slice(0, 45); // Simulate 45 questions for ENEM/etc
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

  if (view === 'exam') {
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="p-6 space-y-6 pb-32 h-screen flex flex-col bg-black overflow-y-auto">
        <header className="flex justify-between items-center sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('bank')} 
            className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary"
          >
            <RotateCcw size={20} />
          </motion.button>
          
          <div className="text-center">
            <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">MODO PROVA</p>
            <p className="text-xs font-bold">{filterSource || 'Simulação'}</p>
          </div>
          
          <div className="px-3 py-1.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2 text-primary font-premium-mono font-bold text-xs">
            <Timer size={14} />
            {formatTime(examDuration * 60 - examTime)}
          </div>
        </header>

        <div className="space-y-8">
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden sticky top-[72px] z-40">
            <motion.div 
              className="bg-primary h-full shadow-[0_0_10px_rgba(0,255,148,0.5)]" 
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / examQuestions.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>

          {examQuestions.map((q, qIndex) => (
            <GlassCard key={q.id || qIndex} className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Questão {qIndex + 1}</span>
                <span className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-text-secondary">{q.materia}</span>
              </div>
              
              <p className="text-sm font-medium leading-relaxed text-white/90">{q.pergunta}</p>

              <div className="space-y-3">
                {q.alternativas.map((opt: string, i: number) => {
                  const isSelected = userAnswers[qIndex] === i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setUserAnswers(prev => ({ ...prev, [qIndex]: i }));
                      }}
                      className={`w-full p-4 rounded-2xl text-left transition-all flex gap-4 items-center group border ${
                        isSelected 
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]' 
                          : 'bg-white/5 border-white/10 hover:border-primary/50 text-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected ? 'bg-primary text-black' : 'bg-white/5 group-hover:bg-primary/20 group-hover:text-primary'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          ))}

          <AnimatedButton 
            onClick={() => setView('result')} 
            className="w-full py-4 text-sm font-bold uppercase tracking-widest mt-8"
            glow
          >
            Finalizar Simulação
          </AnimatedButton>
        </div>
      </div>
    );
  }

  if (view === 'training') {
    const q = examQuestions[currentIdx];
    const isTraining = true;
    const currentAnswer = selectedOption;

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
        <AnimatePresence>
          {xpGains.map(gain => (
            <XPGain 
              key={gain.id} 
              amount={gain.amount} 
              onComplete={() => setXpGains(prev => prev.filter(g => g.id !== gain.id))} 
            />
          ))}
        </AnimatePresence>
        <header className="flex justify-between items-center">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('bank')} 
            className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary"
          >
            <RotateCcw size={20} />
          </motion.button>
          
          <div className="text-center">
            <p className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">TREINO ATIVO</p>
            <p className="text-lg font-premium-title italic">{currentIdx + 1} <span className="text-xs text-text-secondary font-normal not-italic opacity-50">/ {examQuestions.length}</span></p>
          </div>
          
          <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2 text-text-secondary font-premium-mono font-bold text-[10px]">
            <Target size={14} className="text-primary" />
            {correct} ACERTOS
          </div>
        </header>

        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.5)]" 
            animate={{ width: `${((currentIdx + 1) / examQuestions.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-4 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
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
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-blue-500/20">
                      {q.accuracyRate ?? (q.difficulty === 'Easy' ? 75 : q.difficulty === 'Medium' ? 45 : 20)}% ACERTO
                    </span>
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 text-[8px] font-premium-mono font-bold rounded uppercase tracking-widest border border-purple-500/20">
                      {q.assunto}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleReviewLater(q.id)}
                      className={`p-1.5 rounded-lg border transition-all ${reviewLater.includes(q.id) ? 'bg-orange-500/20 text-orange-500 border-orange-500/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
                      title="Revisar Depois"
                    >
                      <Bookmark size={14} fill={reviewLater.includes(q.id) ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => toggleFavorite(q.id)}
                      className={`p-1.5 rounded-lg border transition-all ${favorites.includes(q.id) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'}`}
                      title="Favoritar"
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
                  let style = "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10";
                  let iconColor = "bg-white/5 text-text-secondary group-hover:bg-white/10";
                  
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
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(i)}
                      className={`w-full p-6 rounded-2xl border text-left transition-all flex items-start gap-4 group ${style}`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-premium-mono font-bold shrink-0 mt-0.5 transition-colors ${iconColor}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-lg font-medium leading-relaxed mt-1">{opt}</span>
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
                      onClick={() => {
                        if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
                        setShowExplanation(!showExplanation);
                      }} 
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
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pointer-events-none z-50">
          <div className="max-w-md mx-auto flex flex-col gap-4 pointer-events-auto">
            <div className="flex gap-4">
              {currentIdx > 0 && (
                <AnimatedButton 
                  onClick={() => {
                    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
                    setCurrentIdx(currentIdx - 1);
                    if (isTraining) {
                      setSelectedOption(null);
                      setConfirmed(false);
                      setShowExplanation(false);
                      setAiExplanation('');
                    }
                  }} 
                  variant="secondary" 
                  className="w-16 h-14 border-white/10 shrink-0"
                >
                  <ChevronLeft size={24} />
                </AnimatedButton>
              )}
              
              {isTraining && !confirmed && selectedOption === null && (
                <AnimatedButton 
                  onClick={() => {
                    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
                    if (currentIdx < examQuestions.length - 1) {
                      setCurrentIdx(c => c + 1);
                      setSelectedOption(null);
                      setConfirmed(false);
                      setShowExplanation(false);
                      setAiExplanation('');
                    } else {
                      setView('result');
                    }
                  }} 
                  variant="secondary"
                  className="flex-1 h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em] border-white/10 text-text-secondary" 
                >
                  Pular
                </AnimatedButton>
              )}

              {(isTraining && !confirmed && selectedOption !== null) && (
                <AnimatedButton 
                  onClick={confirmAnswer} 
                  className="flex-1 h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em]" 
                  glow
                >
                  Confirmar Resposta
                  <CheckCircle2 size={18} className="ml-2" />
                </AnimatedButton>
              )}
              
              {(isTraining && !confirmed) && (
                <AnimatedButton 
                  onClick={() => {
                    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
                    if (currentIdx < examQuestions.length - 1) {
                      setCurrentIdx(currentIdx + 1);
                      setSelectedOption(null);
                      setConfirmed(false);
                      setShowExplanation(false);
                      setAiExplanation('');
                    } else {
                      setView('result');
                    }
                  }} 
                  variant="secondary"
                  className="flex-1 h-14 text-xs font-premium-mono font-bold uppercase tracking-[0.3em] border-white/10" 
                >
                  Pular
                  <ChevronRight size={18} className="ml-2" />
                </AnimatedButton>
              )}
              
              {(isTraining ? confirmed : true) && (
                <AnimatedButton 
                  onClick={() => {
                    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
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
                  <ChevronRight size={18} className="ml-2" />
                </AnimatedButton>
              )}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'external-banks') {
    return (
      <div className="p-6 space-y-6 pb-24">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('bank')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">OUTROS BANCOS</h2>
        </header>
        
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Explore os maiores e melhores bancos de questões externos para complementar seus estudos.
          </p>
          
          <div className="grid gap-4">
            {EXTERNAL_BANKS.map((bank, idx) => (
              <a 
                key={idx} 
                href={bank.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <GlassCard className="p-4 flex items-center justify-between hover:border-primary/50 transition-all group">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{bank.name}</h3>
                    <p className="text-sm text-text-secondary">{bank.description}</p>
                  </div>
                  <ExternalLink size={20} className="text-text-secondary group-hover:text-primary transition-colors" />
                </GlassCard>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'review') {
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewSummary, setReviewSummary] = useState('');

    const generateAISummary = async () => {
      setReviewLoading(true);
      try {
        const wrongTopics = errorQuestions.map(q => `${q.materia}: ${q.assunto}`);
        const prompt = `Analise os seguintes erros do estudante e forneça um resumo estratégico de revisão, focando nos pontos fracos e sugerindo um plano de ação rápido:\n${wrongTopics.join('\n')}`;
        const response = await aiService.chat(prompt, []);
        setReviewSummary(response);
      } catch (e) {
        console.error(e);
      } finally {
        setReviewLoading(false);
      }
    };

    return (
      <div className="p-6 space-y-6 pb-24">
        <header className="flex items-center gap-4">
          <button onClick={() => setView('bank')} className="p-2 bg-white/5 rounded-xl border border-white/10">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-2xl font-premium-title italic">REVISAR ERROS<span className="text-red-500 font-normal not-italic ml-2 text-sm tracking-widest uppercase opacity-50">Protocolo de Falha</span></h2>
        </header>

        {errorQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,255,148,0.2)]">
              <Trophy size={48} />
            </div>
            <div className="space-y-2">
              <p className="font-premium-title text-xl italic">PROTOCOLO LIMPO</p>
              <p className="text-text-secondary text-xs font-medium uppercase tracking-widest opacity-60">Nenhum erro detectado no sistema.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-3">
              <AnimatedButton onClick={() => startTraining(errorQuestions)} className="flex-1 py-4 text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em]" glow>
                PRATICAR ERROS ({errorQuestions.length})
              </AnimatedButton>
              <AnimatedButton 
                onClick={generateAISummary}
                disabled={reviewLoading}
                variant="secondary" 
                className="flex-1 border-primary/20 bg-primary/5 text-primary text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em]"
              >
                {reviewLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : <><Brain size={16} className="mr-2 inline-block" /> Resumo IA</>}
              </AnimatedButton>
            </div>

            {reviewSummary && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] -mr-16 -mt-16 rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-primary" />
                    <h3 className="text-[10px] font-premium-mono font-bold text-primary uppercase tracking-[0.3em]">Análise Estratégica da IA</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Markdown>{reviewSummary}</Markdown>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full" />
                <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.2em]">Histórico de Falhas</h3>
              </div>
              {errorQuestions.slice(0, visibleCount).map(q => (
                <InlineQuestionCard key={q.id} q={q} onNavigate={onNavigate} />
              ))}
              
              {visibleCount < errorQuestions.length && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="w-full py-4 mt-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-premium-mono font-bold uppercase tracking-widest text-text-secondary hover:text-white hover:bg-white/10 transition-all"
                >
                  Carregar Mais ({errorQuestions.length - visibleCount} restantes)
                </motion.button>
              )}
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

const Profile = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (view: 'splash' | 'pricing' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving') => void }) => {
  const { name, bio, profilePic, coverPic, xp, level, streak, league, setName, setBio, setProfilePic, setCoverPic, history, sessions, featureUsage, plan, setThemeColor, themeColor } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name || '');
  const [editBio, setEditBio] = useState(bio || '');

  const stats = useMemo(() => {
    const totalHours = Math.round(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
    const questionsSolved = history.length;
    const accuracyRate = questionsSolved > 0 
      ? Math.round(history.filter(h => h.isCorrect).length / questionsSolved * 100) 
      : 0;

    return { totalHours, questionsSolved, accuracyRate };
  }, [sessions, history]);

  const activityData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = sessions.filter(s => s.date === dateStr);
      const minutes = daySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
      
      return {
        name: days[d.getDay()],
        minutos: minutes,
      };
    });
  }, [sessions]);

  const favoriteFeatures = useMemo(() => {
    const featureLabels: Record<string, string> = {
      pomodoro: '🍅 Pomodoro',
      flashcards: '📇 Flashcards',
      aiTutor: '🤖 AI Tutor',
      redacao: '✍️ Redação',
      questions: '❓ Questões'
    };

    return Object.entries(featureUsage || {})
      .map(([key, count]) => ({ 
        label: featureLabels[key] || key, 
        count 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [featureUsage]);

  const handleSave = () => {
    setName(editName);
    setBio(editBio);
    setIsEditing(false);
  };

  const handleImageUpload = (type: 'profile' | 'cover') => {
    const url = prompt(`Insira a URL da imagem para ${type === 'profile' ? 'foto de perfil' : 'capa'}:`);
    if (url) {
      if (type === 'profile') setProfilePic(url);
      else setCoverPic(url);
    }
  };

  const shareProfile = async () => {
    const card = document.getElementById('profile-share-card');
    if (!card) return;

    try {
      const canvas = await html2canvas(card, {
        backgroundColor: '#0a0a0a',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'meu-progresso-studyflow.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error sharing profile:', err);
    }
  };

  return (
    <div className="pb-32">
      {/* Hidden share card for html2canvas */}
      <div className="fixed -left-[9999px] top-0">
        <div id="profile-share-card" className="w-[400px] p-8 bg-[#0a0a0a] border-2 border-[#00ff94]/20 rounded-[40px] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff94]/10 blur-3xl rounded-full" />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-[#00ff94]/30 overflow-hidden">
              <img src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-premium-title italic text-white uppercase">{name}</h2>
              <p className="text-[#00ff94] font-premium-mono font-bold text-xs">NÍVEL {level} • STUDYFLOW</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Streak</p>
              <p className="text-xl font-bold text-orange-500">{streak} Dias 🔥</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-premium-mono text-text-secondary uppercase">Precisão</p>
              <p className="text-xl font-bold text-[#00ff94]">{stats.accuracyRate}%</p>
            </div>
          </div>
          <div className="text-center pt-2">
            <p className="text-[8px] font-premium-mono text-text-secondary uppercase tracking-[0.3em]">Gerado por StudyFlow AI</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-48 bg-white/5 border-b border-white/10 overflow-hidden">
        {coverPic ? (
          <img src={coverPic} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        )}
        <button 
          onClick={() => handleImageUpload('cover')}
          className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <Camera size={16} />
        </button>
        <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-white">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="px-6 relative">
        {/* Profile Picture */}
        <div className="absolute -top-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-background bg-card overflow-hidden">
              <img 
                src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <button 
              onClick={() => handleImageUpload('profile')}
              className="absolute bottom-0 right-0 p-1.5 bg-primary text-black rounded-full border-2 border-background shadow-[0_0_10px_rgba(0,255,148,0.5)]"
            >
              <Camera size={12} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 gap-2">
          <button 
            onClick={shareProfile}
            className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            title="Compartilhar Progresso"
          >
            <Share2 size={18} className="text-primary" />
          </button>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><Check size={14} /> Salvar</> : <><Edit3 size={14} /> Editar Perfil</>}
          </button>
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-6">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold text-xl focus:outline-none focus:border-primary/50"
                placeholder="Seu Nome"
              />
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 resize-none h-24"
                placeholder="Sua Bio"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{name}</h1>
                <Badge variant={plan === 'premium' ? 'primary' : 'warning'} className="text-[8px] tracking-widest uppercase">
                  {plan === 'premium' ? 'Premium ⭐' : 'Free'}
                </Badge>
              </div>
              <p className="text-text-secondary text-sm mt-1">{bio}</p>
            </div>
          )}

          {/* Plan Card */}
          {plan === 'free' && (
            <GlassCard className="p-4 border-primary/30 bg-primary/5 flex items-center justify-between" glow>
              <div>
                <p className="text-xs font-bold">Plano Free</p>
                <p className="text-[10px] text-text-secondary">Acesse todos os recursos agora.</p>
              </div>
              <AnimatedButton 
                onClick={() => onNavigate('pricing')} 
                className="px-4 py-2 text-[10px] font-bold uppercase bg-primary text-black border-primary"
                glow
              >
                ⭐ Fazer Upgrade
              </AnimatedButton>
            </GlassCard>
          )}

          {/* Stats Grid (2x2 requested) */}
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-orange-500">
                <Flame size={14} fill="currentColor" />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Streak</span>
              </div>
              <p className="text-2xl font-premium-title italic">{streak} Dias</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-primary">
                <Clock size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Horas</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.totalHours}h</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-blue-400">
                <BookOpen size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Questões</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.questionsSolved}</p>
            </GlassCard>
            <GlassCard className="p-4 space-y-1" glow>
              <div className="flex items-center gap-2 text-purple-400">
                <Target size={14} />
                <span className="text-[10px] font-premium-mono font-bold uppercase tracking-widest">Precisão</span>
              </div>
              <p className="text-2xl font-premium-title italic">{stats.accuracyRate}%</p>
            </GlassCard>
          </div>

          {/* Activity Graph */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Atividade (7 Dias)</h3>
            <GlassCard className="p-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                    itemStyle={{ color: themeColor, fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="minutos" 
                    fill={themeColor} 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Favorite Features */}
          {favoriteFeatures.length > 0 && (
            <div className="pt-6 space-y-3">
              <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Suas features favoritas</h3>
              <div className="flex flex-wrap gap-2">
                {favoriteFeatures.map((feat, i) => (
                  <div key={i} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                    <span className="text-sm">{feat.label}</span>
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-md text-[10px] font-bold">
                      {feat.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings (from existing code) */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-premium-mono font-bold text-text-secondary uppercase tracking-[0.3em]">Configurações</h3>
            <GlassCard className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl text-white">
                    <Sparkles size={20} className="text-primary" />
                  </div>
                  <span className="font-bold">Tema de Cores</span>
                </div>
              </div>
              <div className="flex gap-3">
                {[
                  { id: '#10B981', name: 'Emerald' },
                  { id: '#3B82F6', name: 'Blue' },
                  { id: '#8B5CF6', name: 'Purple' },
                  { id: '#F43F5E', name: 'Rose' },
                  { id: '#F59E0B', name: 'Amber' },
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setThemeColor(theme.id)}
                    className={clsx(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      themeColor === theme.id ? "border-white scale-110" : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: theme.id }}
                    title={theme.name}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors" onClick={() => {
              const state = useStore.getState();
              const dataToExport = safeStringify(state, 2);
              const blob = new Blob([dataToExport], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `studyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl text-white">
                  <Bookmark size={20} />
                </div>
                <span className="font-bold">Exportar Dados (Backup)</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const NotesView = ({ onBack }: { onBack: () => void }) => {
  const { notes, addFlashcard, addDeck, decks } = useStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isLoadingPodcast, setIsLoadingPodcast] = useState(false);

  const generatePodcast = async (note: Note) => {
    if (isLoadingPodcast) return;
    setIsLoadingPodcast(true);
    try {
      const script = await aiService.generatePodcastScript(note.content, note.title);
      const audioData = await aiService.generateAudio(script);
      if (audioData) {
        await safePlayAudio(`data:audio/mp3;base64,${audioData}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPodcast(false);
    }
  };

  const playAudio = async (text: string) => {
    if (isPlaying || isLoadingAudio) return;
    
    try {
      setIsLoadingAudio(true);
      const audioData = await aiService.generateAudio(text);
      if (audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await safePlayAudio(audio);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleGenerateFlashcards = async (note: Note) => {
    setGeneratingFlashcards(true);
    try {
      // Use AI to generate flashcards from note content
      const prompt = `Com base no seguinte resumo de estudo, gere 5 flashcards (pergunta e resposta curta) para o sistema Anki.
      Resumo: ${note.content}
      Retorne APENAS um JSON no formato: [{"front": "pergunta", "back": "resposta"}]`;
      
      const res = await aiService.chat(prompt, []);
      const jsonStr = res.match(/\[.*\]/s)?.[0];
      if (jsonStr) {
        const cards = JSON.parse(jsonStr);
        
        // Find or create a deck for these cards
        let deckId = decks.find(d => d.name === note.title)?.id;
        if (!deckId) {
          deckId = Math.random().toString(36).substr(2, 9);
          addDeck({ 
            id: deckId, 
            name: note.title, 
            subject: note.title,
            cardCount: 0,
            newCards: 0,
            reviewCards: 0
          });
        }

        cards.forEach((c: any) => {
          addFlashcard({
            id: Math.random().toString(36).substr(2, 9),
            deckId: deckId!,
            front: c.front,
            back: c.back,
            level: 'Novo',
            interval: 0,
            nextReview: new Date().toISOString(),
            subject: note.title
          });
        });
        alert(`${cards.length} flashcards gerados com sucesso no deck "${note.title}"!`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  if (selectedNote) {
    return (
      <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-right duration-300">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedNote(null)} className="p-2 bg-white/5 rounded-xl border border-white/10">
              <RotateCcw size={20} />
            </button>
            <h2 className="text-2xl font-premium-title italic uppercase">{selectedNote.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => exportToPDF('note-content', `Resumo_${selectedNote.title.replace(/\s+/g, '_')}`)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              title="Exportar para PDF"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => playAudio(selectedNote.content)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              disabled={isLoadingAudio || isPlaying}
              title="Ouvir Resumo"
            >
              {isLoadingAudio ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} className={isPlaying ? "text-primary" : ""} />}
            </button>
            <button 
              onClick={() => generatePodcast(selectedNote)}
              className="p-2 bg-white/5 rounded-xl border border-white/10 text-text-secondary hover:text-primary transition-colors"
              disabled={isLoadingPodcast}
              title="Gerar Podcast IA"
            >
              {isLoadingPodcast ? <Loader2 size={20} className="animate-spin" /> : <Radio size={20} />}
            </button>
          </div>
        </header>

        <GlassCard id="note-content" className="p-6 space-y-6 bg-black/40 border-white/10">
          <div className="prose prose-invert max-w-none">
            <Markdown>{selectedNote.content}</Markdown>
          </div>
          
          <div className="pt-6 border-t border-white/10 flex gap-4">
            <AnimatedButton 
              onClick={() => handleGenerateFlashcards(selectedNote)}
              disabled={generatingFlashcards}
              className="flex-1 bg-primary text-black border-primary"
            >
              {generatingFlashcards ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Gerando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap size={18} fill="currentColor" />
                  <span>Gerar Flashcards IA</span>
                </div>
              )}
            </AnimatedButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <StickyNote size={20} />
          </div>
          <h2 className="text-2xl font-premium-title italic uppercase">Caderno de Notas</h2>
        </div>
      </header>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
            <StickyNote size={40} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Nenhuma nota ainda</h3>
            <p className="text-sm text-text-secondary max-w-[250px]">Suas notas geradas por IA e resumos aparecerão aqui.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes.map((note) => (
            <GlassCard 
              key={note.id} 
              onClick={() => setSelectedNote(note)}
              className="p-5 border-white/5 hover:border-primary/30 transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{note.title}</h3>
                  <p className="text-xs text-text-secondary line-clamp-2 opacity-70">{note.content}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-text-secondary">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[10px] font-premium-mono font-bold text-text-secondary uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{new Date(note.updatedAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <div className="text-primary/60">IA GENERATED</div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

const FloatingAITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Olá! Sou seu tutor de IA. Como posso ajudar nos seus estudos hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { themeColor, voiceEnabled, toggleVoice } = useStore();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const speak = async (text: string) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    try {
      const base64 = await aiService.generateAudio(text.slice(0, 200)); // Limit for speed
      if (!base64) throw new Error("No audio data");
      const audioUrl = `data:audio/mp3;base64,${base64}`;
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      safePlayAudio(audio);
    } catch (e) {
      console.error(e);
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const { trackFeature } = useStore.getState();
    trackFeature('aiTutor');
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await aiService.chat(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
      speak(response);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro ao processar sua mensagem.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-[0_0_30px_rgba(0,255,148,0.3)] flex items-center justify-center z-40 transition-transform hover:scale-110"
        style={{ backgroundColor: themeColor, color: '#000' }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 w-80 sm:w-96 h-[500px] max-h-[60vh] bg-card border border-white/10 rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Brain size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Tutor IA</h3>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest">Sempre online</p>
                </div>
              </div>
              <button 
                onClick={toggleVoice}
                className={cn(
                  "p-2 rounded-xl border transition-colors",
                  voiceEnabled ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-text-secondary"
                )}
              >
                {isSpeaking ? <Volume2 size={18} className="animate-pulse" /> : <Volume2 size={18} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={clsx(
                    "max-w-[85%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-black rounded-tr-sm" 
                      : "bg-white/5 border border-white/10 text-white/90 rounded-tl-sm"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-background/50 space-y-3">
              {messages.length === 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {['Me explique um conceito', 'Crie um cronograma', 'Me teste'].map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-text-secondary hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pr-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte algo..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const LevelUpModal = () => {
  const { levelUpData, clearLevelUp, themeColor } = useStore();

  useEffect(() => {
    if (levelUpData) {
      triggerConfetti();
      playSuccessSound();
    }
  }, [levelUpData]);

  if (!levelUpData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-card border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/20 to-transparent opacity-50 pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary shadow-[0_0_50px_rgba(0,255,148,0.5)]">
            <Crown size={48} className="text-primary" />
          </div>
          
          <div>
            <h2 className="text-4xl font-premium-title italic mb-2">LEVEL UP!</h2>
            <p className="text-text-secondary">Você alcançou o nível <span className="text-primary font-bold">{levelUpData.newLevel}</span></p>
          </div>

          <AnimatedButton onClick={clearLevelUp} className="w-full py-4 text-black font-bold" glow>
            Continuar
          </AnimatedButton>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const { hasCompletedOnboarding } = useStore();
  const [activeTab, setActiveTab] = useState<'splash' | 'pricing' | 'home' | 'questions' | 'redacao' | 'ranking' | 'reports' | 'profile' | 'focus' | 'ai' | 'exams' | 'methods' | 'anki' | 'routine' | 'feynman' | 'blurting' | 'mindmap' | 'notes' | 'pomodoro' | 'active-recall' | 'interleaving' | 'slides' | 'video-summarizer' | 'skill-tree' | 'learning-path' | 'rooms' | 'memory-palace' | 'socratic-duel' | 'brain-upload' | 'god-mode' | 'quantum-reading' | 'singularity' | 'time-dilation' | 'akashic-records' | 'subliminal-audio' | 'holographic-tutor' | 'matrix-download' | 'neural-terminal' | 'cybernetic-implants' | 'omniscience-protocol' | 'hive-mind' | 'neural-sync' | 'neural-alchemist' | 'neural-forge' | 'transcendence' | 'the-void' | 'cosmic-prestige' | 'simulation-escape' | 'zenith' | 'source-code' | 'eternity' | 'system-collapse' | 'ouroboros' | 'the-architect' | 'true-ending' | 'the-archive' | 'infinite-prompt' | 'the-nexus' | 'reality-tuner' | 'the-oracle' | 'neural-sculptor' | 'the-source-code' | 'universal-consciousness' | 'multiverse-navigator' | 'concept-genesis' | 'the-mirror' | 'credits' | 'consciousness-export' | 'the-big-bang' | 'the-server-room' | 'the-fourth-wall' | 'the-literal-end' | 'the-prompt' | 'the-reboot' | 'the-new-game-plus' | 'the-intervention' | 'the-touch-grass' | 'the-resignation' | 'entropy' | 'the-no' | 'the-echo' | 'the-zeno' | 'the-self-destruct' | 'the-clicker' | 'the-white-flag' | 'the-code' | 'the-silence' | 'the-captcha' | 'the-terminal' | 'the-bsod' | 'the-backrooms' | 'document-analyzer' | 'library-of-babel'>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const { checkStreak, themeColor, setName, addXP, updateMastery, currentBossBattle, studyRooms } = useStore();

  useEffect(() => {
    const handleInteraction = () => {
      setIsUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    initAudioUnlocker();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync with backend on mount
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        if (data.name) {
          setName(data.name);
        }
      } catch (e) {
        console.error("Failed to sync with backend", e);
      }
    };
    sync();
  }, [setName]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
    // Calculate a slightly transparent version for the glow
    const hex2rgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };
    document.documentElement.style.setProperty('--theme-primary-glow', `rgba(${hex2rgb(themeColor)}, 0.2)`);
  }, [themeColor]);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative overflow-hidden selection:bg-primary selection:text-black">
      <div className="fixed inset-0 bg-noise z-[1000] pointer-events-none" />
      <div className="fixed inset-0 tech-grid opacity-20 pointer-events-none" />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onNavigate={(v) => setActiveTab(v)}
      />

      <FloatingAITutor />
      
      {/* Global Audio Player for Study Rooms */}
      <div className="absolute w-[1px] h-[1px] opacity-0 pointer-events-none overflow-hidden">
        {studyRooms.activeRoom && studyRooms.rooms.find(r => r.id === studyRooms.activeRoom)?.youtubeId && (() => {
          const Player = ReactPlayer as any;
          return (
            <Player
              url={`https://www.youtube.com/watch?v=${studyRooms.rooms.find(r => r.id === studyRooms.activeRoom)?.youtubeId}`}
              playing={studyRooms.audioPlaying && isUserInteracted}
              loop={true}
              volume={(studyRooms.audioVolume ?? 50) / 100}
              width="100%"
              height="100%"
              playsinline
              onError={(e: any) => console.error('ReactPlayer Error:', e)}
              config={{
                youtube: {
                  playerVars: { 
                    autoplay: studyRooms.audioPlaying ? 1 : 0, 
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1
                  }
                }
              }}
            />
          );
        })()}
      </div>

      {currentBossBattle && <BossBattle />}

      <main className="h-full overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'notes' && <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><NotesView onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'pricing' && <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PricingPage onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Dashboard onStartFlow={() => setActiveTab('focus')} onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'focus' && <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FocusMode onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'ai' && <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PremiumGate feature="aiTutor"><AIChat /></PremiumGate></motion.div>}
          {activeTab === 'questions' && <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Questions onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'redacao' && <motion.div key="redacao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PremiumGate feature="essay"><Redacao onBack={() => setActiveTab('home')} /></PremiumGate></motion.div>}
          {activeTab === 'profile' && <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Profile onBack={() => setActiveTab('home')} onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'rooms' && <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StudyRooms /></motion.div>}
          {activeTab === 'memory-palace' && <motion.div key="memory-palace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MemoryPalace onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'socratic-duel' && <motion.div key="socratic-duel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PremiumGate feature="aiTutor"><SocraticDuel onBack={() => setActiveTab('home')} /></PremiumGate></motion.div>}
          {activeTab === 'brain-upload' && <motion.div key="brain-upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BrainUpload onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'quantum-reading' && <motion.div key="quantum-reading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><QuantumReading onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'time-dilation' && <motion.div key="time-dilation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TimeDilation onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'akashic-records' && <motion.div key="akashic-records" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AkashicRecords onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'subliminal-audio' && <motion.div key="subliminal-audio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SubliminalAudio onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'holographic-tutor' && <motion.div key="holographic-tutor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HolographicTutor onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'matrix-download' && <motion.div key="matrix-download" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><MatrixDownload onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'neural-terminal' && <motion.div key="neural-terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><NeuralTerminal onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'cybernetic-implants' && <motion.div key="cybernetic-implants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CyberneticImplants onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'omniscience-protocol' && <motion.div key="omniscience-protocol" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><OmniscienceProtocol onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'the-oracle' && <motion.div key="the-oracle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TheOracle onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'neural-sculptor' && <motion.div key="neural-sculptor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><NeuralSculptor onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'concept-genesis' && <motion.div key="concept-genesis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ConceptGenesis onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'credits' && <motion.div key="credits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Credits onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'document-analyzer' && <motion.div key="document-analyzer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><DocumentAnalyzer onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'akashic-records' && <motion.div key="akashic-records" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AkashicRecords onBack={() => setActiveTab('methods')} /></motion.div>}          {activeTab === 'god-mode' && <motion.div key="god-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GodMode onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'ranking' && <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Ranking onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'reports' && <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Reports onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'exams' && <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PremiumGate feature="exams"><Exams onBack={() => setActiveTab('home')} onNavigate={setActiveTab as any} /></PremiumGate></motion.div>}
          {activeTab === 'methods' && <motion.div key="methods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StudyMethods onNavigate={setActiveTab as any} /></motion.div>}
          {activeTab === 'anki' && <motion.div key="anki" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AnkiSystem onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'routine' && <motion.div key="routine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SmartSchedule onBack={() => setActiveTab('home')} /></motion.div>}
          {activeTab === 'feynman' && <motion.div key="feynman" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeynmanMethod onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'blurting' && <motion.div key="blurting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BlurtingMethod onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'active-recall' && <motion.div key="active-recall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ActiveRecallScreen onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'interleaving' && <motion.div key="interleaving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><InterleavingScreen onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'slides' && <motion.div key="slides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SlidesView onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'video-summarizer' && <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VideoSummarizer onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'skill-tree' && <motion.div key="skill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SkillTree onBack={() => setActiveTab('methods')} /></motion.div>}
          {activeTab === 'learning-path' && <motion.div key="path" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LearningPath onBack={() => setActiveTab('methods')} /></motion.div>}
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
          className="fixed bottom-28 right-6 w-14 h-14 rounded-2xl bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,232,143,0.4)] z-30"
        >
          <LogoIcon size={24} color="#050505" />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-50">
        <div className="absolute -top-12 inset-x-0 flex justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 flex items-center gap-2 shadow-lg">
            <Flame size={16} className="text-orange-500" />
            <span className="font-premium-mono font-bold text-sm">{useStore.getState().streak}</span>
          </div>
        </div>
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
            { id: 'home', icon: LogoIcon },
            { id: 'questions', icon: BookOpen },
            { id: 'notes', icon: StickyNote },
            { id: 'rooms', icon: Users },
            { id: 'redacao', icon: PenTool },
            { id: 'ranking', icon: Trophy },
            { id: 'reports', icon: BarChart2 },
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
                    size={tab.id === 'home' ? 22 : 20} 
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
