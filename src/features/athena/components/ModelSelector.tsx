import React from 'react';
import { AIModel } from '../types/model.types';
import { ATHENA_MODELS } from '../constants/models';
import { ChevronDown, Cpu } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onSelect: (model: AIModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onSelect }) => {
  return (
    <div className="relative group">
      <select 
        value={selectedModel.id}
        onChange={(e) => {
          const model = ATHENA_MODELS.find(m => m.id === e.target.value);
          if (model) onSelect(model);
        }}
        className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2 text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all outline-none cursor-pointer"
      >
        {ATHENA_MODELS.map(model => (
          <option key={model.id} value={model.id} className="bg-slate-900">
            {model.name} ({model.provider})
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
        <Cpu size={14} />
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
        <ChevronDown size={14} />
      </div>
    </div>
  );
};
