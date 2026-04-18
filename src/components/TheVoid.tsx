import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { AnimatedButton } from './UI';

export const TheVoid = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (text.length > 0) {
      setShowPrompt(false);
    }
  }, [text]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-crosshair"
      onMouseMove={() => {
        setIsHovering(true);
        // Hide UI again after 2 seconds of no movement
        const timer = setTimeout(() => setIsHovering(false), 2000);
        return () => clearTimeout(timer);
      }}
    >
      {/* Hidden Back Button - Only visible on mouse move */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute top-6 left-6 z-10"
      >
        <AnimatedButton onClick={onBack} variant="ghost" className="text-white/30 hover:text-white">
          <ChevronLeft size={24} /> Sair do Vazio
        </AnimatedButton>
      </motion.div>

      {/* The Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showPrompt ? 0.3 : 0 }}
        transition={{ duration: 2 }}
        className="absolute top-1/3 text-white font-mono tracking-widest uppercase text-sm pointer-events-none"
      >
        O que você sabe?
      </motion.div>

      {/* The Invisible Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-full bg-transparent text-transparent caret-white/20 resize-none outline-none p-24 font-mono text-lg leading-relaxed selection:bg-white/10"
        placeholder=""
        spellCheck={false}
        autoFocus
      />

      {/* Word Count - Barely visible */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovering && text.length > 0 ? 0.2 : 0 }}
        className="absolute bottom-6 right-6 text-white font-mono text-xs"
      >
        {text.trim().split(/\s+/).filter(w => w.length > 0).length} palavras na escuridão
      </motion.div>
    </div>
  );
};
