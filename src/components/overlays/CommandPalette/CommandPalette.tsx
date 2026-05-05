import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Timer, BookOpen, PenTool, FileText, Users, Brain, ShieldAlert, Library, 
  UploadCloud, Zap, Clock, Network, Headphones, Cpu, Download, Terminal, Eye, 
  Activity, Beaker, Hammer, Database, Star, Layers, Wand2, Settings, Trophy, Search, Sparkles 
} from 'lucide-react';
import { useAppNavigation } from '../../../app/router/useAppNavigation';

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
    { path: '/exames', name: 'Simulados', icon: FileText, shortcut: 'S' },
    { path: '/comunidade', name: 'Comunidade', icon: Users, shortcut: 'C' },
    { path: '/ai', name: 'Athena (IA)', icon: Sparkles, shortcut: 'A' },
    { path: '/palacio-memoria', name: 'Palácio da Memória', icon: Brain, shortcut: 'M' },
    { path: '/duelo-socratico', name: 'Arena Socrática', icon: ShieldAlert, shortcut: 'D' },
    { path: '/analisador-documentos', name: 'Análise de Documentos', icon: FileText, shortcut: 'D' },
    { path: '/upload-cerebral', name: 'Upload Cerebral', icon: UploadCloud, shortcut: 'U' },
    { path: '/leitura-quantica', name: 'Leitura Quântica', icon: Zap, shortcut: 'Q' },
    { path: '/dilatacao-tempo', name: 'Dilatação Temporal', icon: Clock, shortcut: 'T' },
    { path: '/registros-akasicos', name: 'Registros Akáshicos', icon: Network, shortcut: 'K' },
    { path: '/audio-subliminar', name: 'Frequências Neurais', icon: Headphones, shortcut: 'F' },
    { path: '/tutor-holografico', name: 'Tutor Holográfico', icon: Cpu, shortcut: 'H' },
    { path: '/matrix-download', name: 'Download Direto', icon: Download, shortcut: 'X' },
    { path: '/terminal-neural', name: 'Terminal Neural', icon: Terminal, shortcut: 'N' },
    { path: '/implantes-ciberneticos', name: 'Implantes Cibernéticos', icon: Cpu, shortcut: 'C' },
    { path: '/protocolo-onisciencia', name: 'Protocolo Onisciência', icon: Eye, shortcut: 'O' },
    { path: '/oraculo', name: 'A Oráculo', icon: Star, shortcut: 'O' },
    { path: '/escultor-neural', name: 'Escultor Neural', icon: Cpu, shortcut: 'S' },
    { path: '/genese-conceitos', name: 'Gênese de Conceitos', icon: Wand2, shortcut: 'G' },
    { path: '/creditos', name: 'Créditos', icon: Star, shortcut: 'C' },
    { path: '/god-mode', name: 'Modo Deus', icon: Eye, shortcut: 'G' },
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
              {filtered.map((c, idx) => (
                <button
                  key={c.path || idx}
                  onClick={() => {
                    if (c.path) goTo(c.path);
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
}
