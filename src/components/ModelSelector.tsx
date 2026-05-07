import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAIModel } from '../hooks/useAIModel';
import { AI_MODELS } from '../config/aiModels';
import { ChevronDown, Check } from 'lucide-react';
import { springs, staggerContainer, staggerItemTight } from '../lib/animations';

export const ModelSelector: React.FC = () => {
  const { selectedModelId, setModel, getSelectedModel } = useAIModel();
  const selectedModel = getSelectedModel();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setModel(id);
    setIsOpen(false);
  };

  if (AI_MODELS.length <= 1) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-white/10 rounded-md text-sm font-medium">
        <span className="text-xl">{selectedModel.emoji}</span>
        <span className="text-text-primary">{selectedModel.name}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.97 }}
        transition={springs.snappy}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-white/10 rounded-md text-sm font-medium hover:bg-surface-hover transition-colors duration-300 ease-out"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xl">{selectedModel.emoji}</span>
          <span className="text-text-primary">{selectedModel.name}</span>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={springs.snappy}>
          <ChevronDown size={14} className="text-text-secondary" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={springs.card}
          className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-[#1A1A1A] border border-white/10 z-50 p-1"
        >
          <motion.div
            className="max-h-80 overflow-y-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {AI_MODELS.map((model) => (
              <motion.button
                key={model.id}
                variants={staggerItemTight}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleSelect(model.id)}
                className={`w-full text-left px-3 py-2 flex items-start gap-2 rounded hover:bg-white/5 transition-colors duration-300 ease-out ${selectedModelId === model.id ? 'bg-white/5' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${selectedModelId === model.id ? 'text-primary' : 'text-text-primary'}`}>
                      {model.emoji} {model.name}
                    </span>
                    {selectedModelId === model.id && <Check size={14} className="text-primary" />}
                  </div>
                  <p className="text-xs text-text-secondary truncate mt-0.5" title={model.description}>
                    {model.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
