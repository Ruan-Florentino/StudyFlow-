import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Home, Timer, BookOpen, PenTool, FileText, Users, Brain, ShieldAlert, Library, 
  Zap, Clock, Network, Headphones, Cpu, Download, Terminal, Eye, 
  Activity, Beaker, Hammer, Database, Star, Layers, Wand2, Settings, Trophy, Search, Sparkles 
} from 'lucide-react';
import { useAppNavigation } from '../../../app/router/useAppNavigation';
import { springs, staggerContainer, staggerItemTight } from '../../../lib/animations';

/**
 * CommandPalette
 * Tipo: UI Flutuante / Overlay Global
 * Extraído de: App.tsx (T.45-E)
 */

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function CommandPalette({ isOpen, onClose, onToggle }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const { goTo } = useAppNavigation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onToggle();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle, onClose]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const commands = [
    { path: '/', name: 'Início', icon: Home, shortcut: 'H' },
    { path: '/foco', name: 'Modo Foco', icon: Timer, shortcut: 'F' },
    { path: '/questoes', name: 'Questões', icon: BookOpen, shortcut: 'Q' },
    { path: '/redacao', name: 'Redação', icon: PenTool, shortcut: 'R' },
    { path: '/simulados', name: 'Simulados', icon: FileText, shortcut: 'S' },
    { path: '/comunidade', name: 'Comunidade', icon: Users, shortcut: 'C' },
    { path: '/ai', name: 'Mentoria', icon: Sparkles, shortcut: 'A' },
    { path: '/palacio-memoria', name: 'Memorização Visual', icon: Brain, shortcut: 'M' },
    { path: '/duelo-socratico', name: 'Debate Guiado', icon: ShieldAlert, shortcut: 'D' },
    { path: '/analisador-documentos', name: 'Análise de Documentos', icon: FileText, shortcut: 'D' },
    { path: '/leitura-quantica', name: 'Leitura Dinâmica', icon: Zap, shortcut: 'Q' },
    { path: '/dilatacao-tempo', name: 'Gestão de Tempo', icon: Clock, shortcut: 'T' },
    { path: '/registros-akasicos', name: 'Base de Anotações', icon: Network, shortcut: 'K' },
    { path: '/audio-subliminar', name: 'Áudio de Concentração', icon: Headphones, shortcut: 'F' },
    { path: '/tutor-holografico', name: 'Tutor Interativo', icon: Cpu, shortcut: 'H' },
    { path: '/matrix-download', name: 'Síntese Rápida', icon: Download, shortcut: 'X' },
    { path: '/terminal-neural', name: 'Console de Estudos', icon: Terminal, shortcut: 'N' },
    { path: '/implantes-ciberneticos', name: 'Ferramentas Avançadas', icon: Cpu, shortcut: 'C' },
    { path: '/protocolo-onisciencia', name: 'Painel de Diagnóstico', icon: Eye, shortcut: 'O' },
    { path: '/oraculo', name: 'Planejamento de Provas', icon: Star, shortcut: 'O' },
    { path: '/escultor-neural', name: 'Ajuste de Perfil', icon: Cpu, shortcut: 'S' },
    { path: '/genese-conceitos', name: 'Construtor de Conceitos', icon: Wand2, shortcut: 'G' },
    { path: '/creditos', name: 'Créditos', icon: Star, shortcut: 'C' },
    { path: '/ranking', name: 'Ranking', icon: Trophy, shortcut: 'L' },
    { path: '/perfil', name: 'Configurações', icon: Settings, shortcut: ',' },
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
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -18 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -12 }}
            transition={reduceMotion ? { duration: 0.12 } : springs.card}
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
            <motion.div
              className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar"
              variants={reduceMotion ? undefined : staggerContainer}
              initial={reduceMotion ? undefined : "hidden"}
              animate={reduceMotion ? undefined : "show"}
            >
              {filtered.map((c, idx) => (
                <motion.button
                  key={c.path || idx}
                  variants={reduceMotion ? undefined : staggerItemTight}
                  onClick={() => {
                    if (c.path) goTo(c.path);
                    onClose();
                  }}
                  whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <c.icon size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">⌘{c.shortcut}</div>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-secondary">Nenhum comando encontrado para "{query}"</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
