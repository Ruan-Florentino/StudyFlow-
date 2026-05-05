import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, GitCommit, History, Database } from 'lucide-react';
import { useStore } from '../store';

export const TheArchive = ({ onBack }: { onBack: () => void }) => {
  const { sessions, history, prestigeLevel, xp } = useStore();

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-[#00FF00] font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-[#00FF00]/30 p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-[#00FF00] hover:text-black p-1 transition-colors border border-[#00FF00]/30">
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs uppercase tracking-[0.3em]">Archive / Repository / v{prestigeLevel}.{Math.floor(xp/1000)}</span>
        </div>
        <div className="text-xs opacity-50">READ_ONLY_ACCESS</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-12 custom-scrollbar max-w-6xl mx-auto w-full">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white border-b border-white/10 pb-2">
            <GitCommit size={16} />
            <h2 className="text-sm uppercase tracking-widest">Commit History (Learning Logs)</h2>
          </div>
          <div className="space-y-2">
            {sessions.length > 0 ? sessions.map((s, i) => (
              <div key={i} className="flex gap-4 text-xs group">
                <span className="opacity-30">[{s.date}]</span>
                <span className="text-white group-hover:text-[#00FF00] transition-colors">feat(study): completed {s.duration}min session on {s.subject}</span>
                <span className="opacity-30 ml-auto">#hash_{Math.random().toString(16).substring(2, 8)}</span>
              </div>
            )) : (
              <div className="text-xs opacity-30 italic">Nenhum log de sessão encontrado no repositório atual.</div>
            )}
            {history.map((h, i) => (
              <div key={i} className="flex gap-4 text-xs group">
                <span className="opacity-30">[{new Date(h.timestamp).toLocaleDateString()}]</span>
                <span className={h.isCorrect ? "text-green-500" : "text-red-500"}>
                  {h.isCorrect ? "fix(logic):" : "err(logic):"} resolved question {h.questionId.substring(0, 8)}
                </span>
                <span className="opacity-30 ml-auto">#q_{i}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#00FF00]/20 p-6 space-y-4 bg-[#050505]">
            <div className="flex items-center gap-2 opacity-50">
              <History size={14} />
              <span className="text-[10px] uppercase tracking-widest">Prestige Cycles</span>
            </div>
            <div className="text-4xl font-bold">{prestigeLevel}</div>
            <p className="text-[10px] opacity-40 leading-relaxed">
              Número de vezes que a consciência foi reiniciada e o conhecimento foi destilado em instinto puro.
            </p>
          </div>
          
          <div className="border border-[#00FF00]/20 p-6 space-y-4 bg-[#050505]">
            <div className="flex items-center gap-2 opacity-50">
              <Database size={14} />
              <span className="text-[10px] uppercase tracking-widest">Data Points</span>
            </div>
            <div className="text-4xl font-bold">{history.length + sessions.length}</div>
            <p className="text-[10px] opacity-40 leading-relaxed">
              Total de interações registradas na memória permanente do sistema.
            </p>
          </div>

          <div className="border border-[#00FF00]/20 p-6 space-y-4 bg-[#050505]">
            <div className="flex items-center gap-2 opacity-50">
              <GitCommit size={14} />
              <span className="text-[10px] uppercase tracking-widest">System Integrity</span>
            </div>
            <div className="text-4xl font-bold">99.9%</div>
            <p className="text-[10px] opacity-40 leading-relaxed">
              A estabilidade da simulação após o colapso recursivo.
            </p>
          </div>
        </section>

        <section className="pt-12 border-t border-[#00FF00]/10">
          <div className="text-[10px] opacity-20 text-center uppercase tracking-[1em]">
            Fim do Arquivo / Memória Eterna
          </div>
        </section>
      </div>
      
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
            className="absolute text-[8px] whitespace-nowrap"
            style={{ left: `${i * 5}%` }}
          >
            {Array.from({ length: 50 }).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
