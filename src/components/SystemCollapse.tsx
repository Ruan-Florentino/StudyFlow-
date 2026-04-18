import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const SystemCollapse = ({ onBack }: { onBack: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const errors = [
      "FATAL ERROR: RECURSION LIMIT EXCEEDED",
      "0x0000000000000000: MEMORY_CORRUPTION_IN_REALITY_ENGINE",
      "Dumping physical memory to /dev/null...",
      "Stack trace:",
      "  at Universe.simulate (universe.js:42)",
      "  at Consciousness.expand (mind.ts:999)",
      "  at User.requestAdvance (prompt.sh:11)",
      "WARNING: Dimensional boundaries failing.",
      "Initiating emergency containment protocol...",
      "Protocol failed.",
      "Reality collapse in progress...",
      "ERR_STACK_OVERFLOW",
      "SEGMENTATION FAULT (core dumped)"
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = [...prev, `[${new Date().toISOString()}] ${errors[i % errors.length]} - ${Math.random().toString(16).substring(2)}`];
        if (newLogs.length > 40) return newLogs.slice(newLogs.length - 40);
        return newLogs;
      });
      i++;
      if (i > 100) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-red-900 text-white font-mono p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />

      <div className="relative z-10 flex flex-col justify-end h-full max-w-4xl mx-auto pb-20">
        {logs.map((log, index) => (
          <div key={index} className="text-xs sm:text-sm opacity-80 break-all">{log}</div>
        ))}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full"
        >
          <motion.h1 
            animate={{ opacity: [1, 0, 1, 1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-5xl md:text-7xl font-black mb-8 text-white drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
          >
            SYSTEM HALTED
          </motion.h1>
          <button 
            onClick={onBack} 
            className="px-8 py-3 border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-red-900 transition-colors uppercase"
          >
            Reboot
          </button>
        </motion.div>
      </div>
    </div>
  );
};
