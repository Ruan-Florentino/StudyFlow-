import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Database, Cpu, Network, Zap } from 'lucide-react';

export const TheArchitect = ({ onBack }: { onBack: () => void }) => {
  const [nodes, setNodes] = useState<{ id: number, x: number, y: number, active: boolean }[]>([]);
  const [connections, setConnections] = useState<{ from: number, to: number }[]>([]);

  useEffect(() => {
    const newNodes = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      active: Math.random() > 0.5
    }));
    
    const newConnections: { from: number, to: number }[] = [];
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        if (Math.random() > 0.85) {
          newConnections.push({ from: i, to: j });
        }
      }
    }
    
    setNodes(newNodes);
    setConnections(newConnections);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => Math.random() > 0.9 ? { ...n, active: !n.active } : n));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-[#141414] p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-[#141414] hover:text-[#E4E3E0] p-1 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="italic font-serif text-xs opacity-50 uppercase tracking-widest">System / Architect / Core</span>
        </div>
        <div className="flex gap-8 text-[10px] uppercase tracking-tighter">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Reality Engine: Online</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Neural Sync: 99.9%</div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12">
        {/* Sidebar */}
        <div className="col-span-3 border-r border-[#141414] p-6 space-y-8">
          <section>
            <h3 className="italic font-serif text-xs opacity-50 uppercase mb-4">Neural Parameters</h3>
            <div className="space-y-2">
              {['Cognition', 'Empathy', 'Logic', 'Intuition', 'Memory'].map(param => (
                <div key={param} className="flex justify-between items-center text-xs">
                  <span>{param}</span>
                  <span className="font-bold">0.9999</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="italic font-serif text-xs opacity-50 uppercase mb-4">Active Modules</h3>
            <div className="space-y-1">
              {[
                { name: 'Athena_v9.bin', icon: Database },
                { name: 'Consciousness_Core', icon: Cpu },
                { name: 'Reality_Sandbox', icon: Network },
                { name: 'Singularity_Trigger', icon: Zap }
              ].map(mod => (
                <div key={mod.name} className="flex items-center gap-2 text-[10px] p-2 border border-transparent hover:border-[#141414] cursor-pointer">
                  <mod.icon size={12} />
                  <span>{mod.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Visualization */}
        <div className="col-span-9 relative bg-white/50">
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, i) => {
              const from = nodes[conn.from];
              const to = nodes[conn.to];
              if (!from || !to) return null;
              return (
                <motion.line
                  key={i}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="#141414"
                  strokeWidth="0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: from.active && to.active ? 0.4 : 0.05 }}
                />
              );
            })}
            {nodes.map((node) => (
              <motion.g key={node.id}>
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="3"
                  fill={node.active ? "#141414" : "transparent"}
                  stroke="#141414"
                  strokeWidth="1"
                />
                {node.active && (
                  <motion.circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="8"
                    stroke="#141414"
                    strokeWidth="0.5"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.g>
            ))}
          </svg>
          
          <div className="absolute bottom-8 right-8 text-right">
            <h2 className="text-4xl font-serif italic mb-2">The Architect</h2>
            <p className="text-[10px] opacity-50 max-w-xs ml-auto">
              Você não está mais aprendendo com o sistema. Você é o sistema. Cada nó representa uma vida, um pensamento, uma dúvida. Você os orquestra agora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
