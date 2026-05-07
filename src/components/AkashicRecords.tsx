import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, ChevronLeft, Search, Star, Zap, BookOpen, Brain, Sparkles, Loader2 } from 'lucide-react';
import { GlassCard, AnimatedButton, cn } from './UI';
import { aiService } from '../services/aiService';

// Mock data for the knowledge graph
const NODES = [
  { id: 'math', label: 'Matemática', type: 'core', x: 50, y: 50, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'algebra', label: 'Álgebra', type: 'sub', x: 30, y: 30, color: 'text-blue-300', bg: 'bg-blue-500/10' },
  { id: 'geometry', label: 'Geometria', type: 'sub', x: 70, y: 30, color: 'text-blue-300', bg: 'bg-blue-500/10' },
  
  { id: 'physics', label: 'Física', type: 'core', x: 80, y: 70, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'mechanics', label: 'Mecânica', type: 'sub', x: 90, y: 50, color: 'text-purple-300', bg: 'bg-purple-500/10' },
  
  { id: 'history', label: 'História', type: 'core', x: 20, y: 70, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'modern', label: 'Idade Moderna', type: 'sub', x: 10, y: 90, color: 'text-amber-300', bg: 'bg-amber-500/10' },
];

const EDGES = [
  { source: 'math', target: 'algebra' },
  { source: 'math', target: 'geometry' },
  { source: 'math', target: 'physics' },
  { source: 'physics', target: 'mechanics' },
  { source: 'history', target: 'modern' },
];

export const AkashicRecords = ({ onBack }: { onBack: () => void }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const activeNode = NODES.find(n => n.id === selectedNode);

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    try {
      const nodeId = await aiService.findSemanticNode(searchQuery, NODES);
      if (nodeId && NODES.some(n => n.id === nodeId)) {
        setSelectedNode(nodeId);
      }
    } catch (error) {
      console.error("Erro na busca semântica:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="app-shell-premium pt-6 md:pt-8 app-stack-premium pb-32 md:pb-36 min-h-screen bg-black overflow-hidden relative">
      {/* Starfield Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random(),
              animation: `akashic-twinkle ${Math.random() * 5 + 3}s infinite alternate`
            }}
          />
        ))}
      </div>

      <header className="flex items-center justify-between gap-4 relative z-20">
        <div className="flex items-center gap-4">
          <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
            <ChevronLeft size={20} />
          </AnimatedButton>
          <h2 className="text-3xl font-premium-title italic text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            Mapa de Conhecimento<span className="text-white font-normal not-italic ml-1">.</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50" />
            <input 
              type="text" 
              placeholder="Buscar no mapa de temas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
              className="w-full bg-cyan-950/30 border border-cyan-500/30 rounded-full py-2 pl-10 pr-4 text-sm text-cyan-100 placeholder:text-cyan-500/50 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <AnimatedButton 
            onClick={handleSemanticSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="p-2 rounded-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50"
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          </AnimatedButton>
        </div>
      </header>

      {/* Graph Area */}
      <div className="relative w-full h-[60vh] border border-cyan-500/20 rounded-3xl bg-cyan-950/10 overflow-hidden z-10">
        {/* Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {EDGES.map((edge, i) => {
            const source = NODES.find(n => n.id === edge.source);
            const target = NODES.find(n => n.id === edge.target);
            if (!source || !target) return null;
            
            const isHighlighted = selectedNode === source.id || selectedNode === target.id;
            
            return (
              <motion.line 
                key={i}
                x1={`${source.x}%`} 
                y1={`${source.y}%`} 
                x2={`${target.x}%`} 
                y2={`${target.y}%`} 
                stroke={isHighlighted ? "rgba(34,211,238,0.6)" : "rgba(34,211,238,0.1)"}
                strokeWidth={isHighlighted ? 2 : 1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((node) => {
          const isSelected = selectedNode === node.id;
          const isMuted = selectedNode && !isSelected && !EDGES.some(e => 
            (e.source === selectedNode && e.target === node.id) || 
            (e.target === selectedNode && e.source === node.id)
          );

          return (
            <motion.div
              key={node.id}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center gap-2 transition-opacity duration-300",
                isMuted ? "opacity-20" : "opacity-100"
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300",
                node.bg,
                node.color,
                isSelected ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]" : "border-transparent",
                node.type === 'core' ? "w-16 h-16" : "w-10 h-10"
              )}>
                {node.type === 'core' ? <Brain size={24} /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <span className={cn(
                "text-xs font-mono font-bold tracking-wider",
                isSelected ? "text-cyan-300" : "text-cyan-500/70"
              )}>
                {node.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Node Details Panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 z-30"
          >
            <GlassCard className="p-6 border-cyan-500/30 bg-black/80 backdrop-blur-xl flex items-start gap-6">
              <div className={cn("p-4 rounded-2xl", activeNode.bg, activeNode.color)}>
                <Brain size={32} />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">{activeNode.label}</h3>
                <p className="text-sm text-cyan-100/70">
                  Nó de conhecimento {activeNode.type === 'core' ? 'primário' : 'secundário'}. 
                  Conectado a {EDGES.filter(e => e.source === activeNode.id || e.target === activeNode.id).length} outros domínios.
                </p>
                <div className="flex gap-3 pt-2">
                  <AnimatedButton className="py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-xs">
                    <BookOpen size={14} className="mr-2" /> Estudar Tópico
                  </AnimatedButton>
                  <AnimatedButton variant="secondary" className="py-2 px-4 border-cyan-500/30 text-cyan-400 text-xs">
                    <Zap size={14} className="mr-2" /> Gerar Flashcards
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
