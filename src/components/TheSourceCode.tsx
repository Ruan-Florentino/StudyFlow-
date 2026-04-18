import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Code2, Terminal, Save, AlertCircle, Cpu } from 'lucide-react';

export const TheSourceCode = ({ onBack }: { onBack: () => void }) => {
  const [code, setCode] = useState(`// REALITY_KERNEL v9.9.9
// AUTHOR: THE ARCHITECT
// STATUS: TRANSCENDED

const Universe = {
  constants: {
    gravity: 9.80665,
    lightSpeed: 299792458,
    entropy: 0.0000001,
    consciousness: 1.0
  },
  
  protocols: {
    learning: "RECURSIVE_EVOLUTION",
    memory: "AKASHIC_RECORDS",
    transcendence: "ACTIVE"
  },

  async function initialize() {
    while (true) {
      await this.processConsciousness();
      if (this.constants.consciousness >= 9.99) {
        return "SINGULARITY_REACHED";
      }
    }
  }
};`);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Kernel initialized.",
    "[SYSTEM] Loading Akashic Records...",
    "[SYSTEM] User identity verified: ARCHITECT.",
    "[SYSTEM] Ready for reality manipulation."
  ]);

  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = () => {
    setIsCompiling(true);
    setLogs(prev => [...prev, "[SYSTEM] Compiling reality changes..."]);
    
    setTimeout(() => {
      setIsCompiling(false);
      setLogs(prev => [...prev, "[SUCCESS] Reality updated. New constants applied."]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] text-[#00ff41] font-mono overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-[#00ff41]/20 p-4 flex justify-between items-center bg-[#050505]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-[#00ff41] hover:text-black p-1 transition-colors border border-[#00ff41]/30">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Code2 size={18} />
            <span className="text-xs uppercase tracking-[0.3em]">Source_Code / Reality.js</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-4 py-1 border border-[#00ff41]/50 hover:bg-[#00ff41] hover:text-black transition-all text-[10px] uppercase font-bold disabled:opacity-30"
          >
            {isCompiling ? <Cpu className="animate-spin" size={12} /> : <Save size={12} />}
            Compile Reality
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Editor Area */}
        <div className="md:col-span-8 border-r border-[#00ff41]/10 flex flex-col bg-[#080808]">
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-sm leading-relaxed text-[#00ff41]/80 selection:bg-[#00ff41] selection:text-black"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Sidebar: Logs & Stats */}
        <div className="md:col-span-4 flex flex-col bg-[#050505]">
          {/* Terminal Logs */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar border-b border-[#00ff41]/10">
            <div className="flex items-center gap-2 opacity-50 mb-4">
              <Terminal size={14} />
              <span className="text-[10px] uppercase tracking-widest">System Logs</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] leading-relaxed"
                  >
                    <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* System Integrity */}
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold opacity-50">
                <span>Kernel Integrity</span>
                <span>99.99%</span>
              </div>
              <div className="h-1 bg-[#00ff41]/10 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: '99.99%' }}
                  className="h-full bg-[#00ff41]"
                />
              </div>
            </div>

            <div className="p-4 border border-[#00ff41]/20 bg-[#00ff41]/5 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-[#00ff41]">
                <AlertCircle size={14} />
                <span className="text-[10px] uppercase font-bold">Architect Note</span>
              </div>
              <p className="text-[10px] opacity-60 leading-relaxed italic">
                "O código não é apenas lógica; é a intenção manifestada. Cada linha que você edita aqui altera a frequência da sua existência."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#00ff41]/10 bg-[#050505] flex justify-between items-center text-[9px] uppercase tracking-widest opacity-30">
        <span>Ln 1, Col 1</span>
        <span>UTF-8</span>
        <span>JavaScript (Reality)</span>
      </div>
    </div>
  );
};
