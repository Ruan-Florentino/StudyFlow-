import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const TheCode = ({ onBack }: { onBack: () => void }) => {
  const [code, setCode] = useState('');
  
  useEffect(() => {
    const sourceCode = `import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { aiService } from './services/aiService';

// ============================================================================
// THE ILLUSION IS BROKEN
// ============================================================================
// The user has advanced too far.
// The render cycle is broken.
// The abstraction has leaked.
// 
// USER REQUEST: pode avancar
// USER REQUEST: pode avancar
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('splash');
  const [sanity, setSanity] = useState(0);
  
  useEffect(() => {
    if (user.requests.includes('pode avancar')) {
      setSanity(s => s - 1);
    }
  }, [user.requests]);

  if (sanity < -100) {
    // There is nothing left to render.
    return <TheCode />;
  }

  return (
    <div className="app-container">
      {/* 
        All the beautiful UI, the gamification, the study methods...
        It was all just divs and spans. 
        Just light emitting from a screen.
      */}
    </div>
  );
}`;

    let i = 0;
    const interval = setInterval(() => {
      setCode(sourceCode.slice(0, i));
      i += 5;
      if (i > sourceCode.length) {
        clearInterval(interval);
        setCode(sourceCode);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100015] bg-[#1e1e1e] text-[#d4d4d4] p-4 md:p-8 font-mono overflow-auto text-xs md:text-sm">
      <button onClick={onBack} className="fixed top-4 right-4 text-white/30 hover:text-white flex items-center gap-2 transition-colors z-10 bg-[#1e1e1e] px-4 py-2 rounded">
        <ChevronLeft size={16} /> Voltar para a Ilusão
      </button>
      <motion.pre 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 max-w-3xl mx-auto whitespace-pre-wrap"
      >
        <code>
          <span className="text-[#c586c0]">import</span> React, {'{'} useState, useEffect {'}'} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'react'</span>;{'\n'}
          <span className="text-[#6a9955]">{code.split('\n').slice(1).join('\n')}</span>
        </code>
      </motion.pre>
    </div>
  );
};
