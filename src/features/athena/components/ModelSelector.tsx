import React from 'react';
import { AIModel } from '../types/model.types';
import { ATHENA_MODELS } from '../constants/models';
import { ChevronDown, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { springs } from '../../../lib/animations/easings';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onSelect: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  if (ATHENA_MODELS.length <= 1) {
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/90 border border-primary/25 rounded-lg px-2 py-1.5 bg-primary/5">
        {ATHENA_MODELS[0]?.name ?? 'ATHENA V3'}
      </span>
    );
  }
  return (
    <motion.div
      className="relative group shrink-0"
      whileTap={{ scale: 0.98, transition: springs.snappy }}
    >
      <select
        value={selectedModel.id}
        onChange={(e) => {
          const model = ATHENA_MODELS.find(m => m.id === e.target.value);
          if (model) onSelect(model);
        }}
        className="max-w-[10.5rem] sm:max-w-none appearance-none bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 sm:pl-10 sm:pr-10 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/30 truncate"
      >
        {ATHENA_MODELS.map(model => (
          <option key={model.id} value={model.id} className="bg-slate-900">
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary sm:left-3">
        <Cpu size={14} />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 sm:right-3">
        <ChevronDown size={14} />
      </div>
    </motion.div>
  );
};
