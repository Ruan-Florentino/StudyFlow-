import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Home,
  Timer,
  BookOpen,
  PenTool,
  FileText,
  Users,
  Brain,
  ShieldAlert,
  Zap,
  Clock,
  Network,
  Headphones,
  Cpu,
  Download,
  Terminal,
  Eye,
  Star,
  Wand2,
  Settings,
  Trophy,
  Search,
  Sparkles,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { useAppNavigation } from '../../../app/router/useAppNavigation';
import { springs, staggerContainer, staggerItemTight } from '../../../lib/animations';

type CommandItem = {
  path: string;
  name: string;
  description: string;
  section: string;
  icon: LucideIcon;
  shortcut?: string;
  keywords: string[];
};

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS: CommandItem[] = [
  { path: '/', name: 'Inicio', description: 'Voltar para o painel principal', section: 'Principal', icon: Home, shortcut: 'H', keywords: ['home', 'dashboard', 'painel'] },
  { path: '/explorar', name: 'Explorar', description: 'Descobrir ferramentas e modos de estudo', section: 'Principal', icon: Compass, shortcut: 'E', keywords: ['ferramentas', 'hub', 'descobrir'] },
  { path: '/ai', name: 'Athena', description: 'Abrir a IA de estudos', section: 'Principal', icon: Sparkles, shortcut: 'A', keywords: ['ia', 'chat', 'tutoria'] },
  { path: '/questoes', name: 'Questoes', description: 'Treinar banco de questoes e revisar erros', section: 'Estudo', icon: BookOpen, shortcut: 'Q', keywords: ['exercicios', 'enem', 'treino'] },
  { path: '/redacao', name: 'Redacao', description: 'Escrever, corrigir e evoluir texto', section: 'Estudo', icon: PenTool, shortcut: 'R', keywords: ['essay', 'texto', 'correcao'] },
  { path: '/simulados', name: 'Simulados', description: 'Provas, historico e revisao estrategica', section: 'Estudo', icon: FileText, shortcut: 'S', keywords: ['exames', 'prova', 'resultado'] },
  { path: '/foco', name: 'Modo Foco', description: 'Timer e ambiente de concentracao', section: 'Produtividade', icon: Timer, shortcut: 'F', keywords: ['pomodoro', 'timer', 'concentracao'] },
  { path: '/rotina', name: 'Rotina inteligente', description: 'Gerar cronograma de estudos', section: 'Produtividade', icon: Clock, keywords: ['agenda', 'cronograma', 'schedule'] },
  { path: '/cards', name: 'Flashcards', description: 'Revisao ativa e memorizacao espacada', section: 'Produtividade', icon: Brain, keywords: ['cards', 'memoria', 'revisao'] },
  { path: '/comunidade', name: 'Comunidade', description: 'Salas, ranking social e estudo em grupo', section: 'Social', icon: Users, shortcut: 'C', keywords: ['salas', 'grupo', 'feed'] },
  { path: '/ranking', name: 'Ranking', description: 'Ver progresso competitivo', section: 'Social', icon: Trophy, keywords: ['xp', 'leaderboard', 'posicao'] },
  { path: '/perfil', name: 'Perfil e ajustes', description: 'Conta, plano, suporte e preferencias', section: 'Conta', icon: Settings, shortcut: 'P', keywords: ['configuracoes', 'conta', 'suporte'] },
  { path: '/palacio-memoria', name: 'Memorizacao visual', description: 'Criar palacios de memoria', section: 'Metodos', icon: Brain, keywords: ['palacio', 'memoria'] },
  { path: '/duelo-socratico', name: 'Debate guiado', description: 'Treinar argumentacao com IA', section: 'Metodos', icon: ShieldAlert, keywords: ['duelo', 'socratico', 'debate'] },
  { path: '/analisador-documentos', name: 'Analise de documentos', description: 'Extrair insights de arquivos e PDFs', section: 'Metodos', icon: FileText, keywords: ['documento', 'pdf', 'arquivo'] },
  { path: '/leitura-quantica', name: 'Leitura dinamica', description: 'RSVP e leitura acelerada', section: 'Metodos', icon: Zap, keywords: ['leitura', 'rapida', 'rsvp'] },
  { path: '/dilatacao-tempo', name: 'Gestao de tempo', description: 'Tecnicas para foco profundo', section: 'Metodos', icon: Clock, keywords: ['tempo', 'gestao', 'foco'] },
  { path: '/registros-akasicos', name: 'Base de anotacoes', description: 'Pesquisar conhecimento salvo', section: 'Metodos', icon: Network, keywords: ['notas', 'base', 'arquivo'] },
  { path: '/audio-subliminar', name: 'Audio de concentracao', description: 'Ambiencia e foco auditivo', section: 'Metodos', icon: Headphones, keywords: ['audio', 'som', 'concentracao'] },
  { path: '/tutor-holografico', name: 'Tutor interativo', description: 'Interagir com tutor de estudo', section: 'Metodos', icon: Cpu, keywords: ['tutor', 'holografico'] },
  { path: '/matrix-download', name: 'Sintese rapida', description: 'Compactar ideias em resumo acionavel', section: 'Metodos', icon: Download, keywords: ['resumo', 'sintese'] },
  { path: '/terminal-neural', name: 'Console de estudos', description: 'Terminal para comandos de aprendizagem', section: 'Avancado', icon: Terminal, keywords: ['terminal', 'console'] },
  { path: '/implantes-ciberneticos', name: 'Ferramentas avancadas', description: 'Recursos experimentais de estudo', section: 'Avancado', icon: Cpu, keywords: ['ferramentas', 'avancado'] },
  { path: '/protocolo-onisciencia', name: 'Painel de diagnostico', description: 'Ler sinais e metas de prova', section: 'Avancado', icon: Eye, keywords: ['diagnostico', 'painel'] },
  { path: '/oraculo', name: 'Planejamento de provas', description: 'Traçar estrategia para vestibulares', section: 'Avancado', icon: Star, keywords: ['oraculo', 'planejamento'] },
  { path: '/escultor-neural', name: 'Ajuste de perfil', description: 'Personalizar modo de aprendizagem', section: 'Avancado', icon: Cpu, keywords: ['perfil', 'ajuste'] },
  { path: '/genese-conceitos', name: 'Construtor de conceitos', description: 'Conectar ideias e criar explicacoes', section: 'Avancado', icon: Wand2, keywords: ['conceitos', 'genese'] },
  { path: '/creditos', name: 'Creditos', description: 'Ver creditos e informacoes do app', section: 'Conta', icon: Star, keywords: ['sobre', 'creditos'] },
];

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function commandMatches(command: CommandItem, query: string) {
  if (!query) return true;
  const haystack = normalize([
    command.name,
    command.description,
    command.section,
    command.path,
    ...command.keywords,
  ].join(' '));
  return query.split(/\s+/).every((part) => haystack.includes(part));
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const { goTo } = useAppNavigation();

  const normalizedQuery = useMemo(() => normalize(query), [query]);
  const filtered = useMemo(
    () => COMMANDS.filter((command) => commandMatches(command, normalizedQuery)),
    [normalizedQuery]
  );

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(0);
  }, [isOpen, normalizedQuery]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (filtered.length === 0 ? 0 : (index + 1) % filtered.length));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (filtered.length === 0 ? 0 : (index - 1 + filtered.length) % filtered.length));
        return;
      }
      if (event.key === 'Enter' && filtered[activeIndex]) {
        event.preventDefault();
        goTo(filtered[activeIndex].path);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, filtered, goTo, isOpen, onClose]);

  const activeCommandId = filtered[activeIndex] ? `command-${filtered[activeIndex].path.replace(/[^a-z0-9]/gi, '-') || 'home'}` : undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[max(15vh,calc(0.5rem+env(safe-area-inset-top,0px)))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pb-[env(safe-area-inset-bottom,0px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-palette-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -18 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -12 }}
            transition={reduceMotion ? { duration: 0.12 } : springs.card}
            className="w-full max-w-xl bg-card border border-border rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search size={20} className="text-text-secondary" aria-hidden />
              <div className="sr-only" id="command-palette-title">Comandos do StudyFlow</div>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="O que voce quer estudar hoje?"
                aria-controls="command-palette-results"
                aria-activedescendant={activeCommandId}
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-text-secondary"
              />
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-text-secondary">
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">Enter</span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1">Esc</span>
              </div>
            </div>
            <motion.div
              id="command-palette-results"
              role="listbox"
              aria-label="Resultados de comandos"
              className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar"
              variants={reduceMotion ? undefined : staggerContainer}
              initial={reduceMotion ? undefined : 'hidden'}
              animate={reduceMotion ? undefined : 'show'}
            >
              {filtered.map((command, index) => {
                const Icon = command.icon;
                const selected = index === activeIndex;
                const commandId = `command-${command.path.replace(/[^a-z0-9]/gi, '-') || 'home'}`;
                return (
                  <motion.button
                    key={command.path}
                    id={commandId}
                    role="option"
                    aria-selected={selected}
                    variants={reduceMotion ? undefined : staggerItemTight}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      goTo(command.path);
                      onClose();
                    }}
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-2xl text-left transition-colors group ${
                      selected ? 'bg-primary/12 ring-1 ring-primary/25' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${selected ? 'bg-primary/15' : 'bg-white/5 group-hover:bg-primary/10'}`}>
                        <Icon size={18} className={`transition-colors ${selected ? 'text-primary' : 'text-text-secondary group-hover:text-primary'}`} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">{command.name}</span>
                          <span className="hidden rounded-full border border-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-text-secondary sm:inline-flex">{command.section}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">{command.description}</p>
                      </div>
                    </div>
                    {command.shortcut && (
                      <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-text-secondary">
                        {command.shortcut}
                      </div>
                    )}
                  </motion.button>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-white">Nada encontrado</p>
                  <p className="mt-1 text-xs text-text-secondary">Tente buscar por questoes, redacao, foco, Athena ou simulados.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
