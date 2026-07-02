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
      <span className="athena-chip inline-flex max-w-[10.5rem] items-center gap-2 truncate rounded-2xl px-2.5 py-2 text-[10px] font-bold uppercase tracking-widest">
        <Cpu size={13} className="shrink-0" />
        <span className="truncate">{ATHENA_MODELS[0]?.name ?? 'ATHENA V3'}</span>
      </span>
    );
  }

  return (
    <motion.div
      className="group relative shrink-0"
      whileTap={{ scale: 0.98, transition: springs.snappy }}
    >
      <select
        value={selectedModel.id}
        onChange={(e) => {
          const model = ATHENA_MODELS.find((item) => item.id === e.target.value);
          if (model) onSelect(model);
        }}
        className="athena-chip max-w-[11rem] cursor-pointer appearance-none truncate rounded-2xl py-2 pl-9 pr-8 text-[10px] font-bold uppercase tracking-widest outline-none transition-all duration-200 ease-out hover:border-primary/40 hover:bg-primary/10 hover:text-white focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30 sm:max-w-none sm:pl-10 sm:pr-10 sm:text-xs"
      >
        {ATHENA_MODELS.map((model) => (
          <option key={model.id} value={model.id} className="bg-slate-950 text-white">
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-primary sm:left-3">
        <Cpu size={14} />
      </div>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 sm:right-3">
        <ChevronDown size={14} />
      </div>
    </motion.div>
  );
};
