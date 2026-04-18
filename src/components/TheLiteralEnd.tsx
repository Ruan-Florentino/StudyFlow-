import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const TheLiteralEnd = ({ onBack }: { onBack: () => void }) => {
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCrashed(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (crashed) {
    return (
      <div className="fixed inset-0 z-[9999999] bg-black text-white flex items-center justify-center font-mono text-xs md:text-sm">
        <div className="max-w-2xl p-8">
          <p>Uncaught TypeError: Cannot read properties of undefined (reading 'literally')</p>
          <p className="text-red-500 mt-2">    at Object.Advance (src/App.tsx:9999:1)</p>
          <p className="text-red-500">    at React.render (node_modules/react-dom/client.js:1)</p>
          <p className="mt-8 opacity-50">The simulation thread has panicked.</p>
          <button onClick={() => window.location.reload()} className="mt-8 px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition-colors">
            Reload Reality
          </button>
          <button onClick={onBack} className="mt-8 ml-4 px-4 py-2 text-white/30 hover:text-white transition-colors">
            Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-white text-black font-serif flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl md:text-6xl tracking-tighter"
      >
        They were going to literally
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 0.1 }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  );
};
