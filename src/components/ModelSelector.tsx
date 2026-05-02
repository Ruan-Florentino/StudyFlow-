import React, { useState, useRef, useEffect } from 'react';
import { useAIModel } from '../hooks/useAIModel';
import { AI_MODELS, AIModelConfig } from '../config/aiModels';
import { ChevronDown, Check, Zap, BrainCircuit, Image as ImageIcon, Video, Code } from 'lucide-react';

const CATEGORY_LABELS: Record<string, { label: string, icon: React.ReactNode }> = {
  reasoning: { label: 'Reasoning', icon: <BrainCircuit size={14} className="text-purple-400" /> },
  fast: { label: 'Fast', icon: <Zap size={14} className="text-yellow-400" /> },
  text: { label: 'Open', icon: <Code size={14} className="text-blue-400" /> },
  image: { label: 'Image', icon: <ImageIcon size={14} className="text-green-400" /> },
  video: { label: 'Video', icon: <Video size={14} className="text-red-400" /> },
};

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

  const modelsByCategory = AI_MODELS.reduce((acc, model) => {
    if (!acc[model.category]) acc[model.category] = [];
    acc[model.category].push(model);
    return acc;
  }, {} as Record<string, AIModelConfig[]>);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-white/10 rounded-md text-sm font-medium hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-1.5">
          {CATEGORY_LABELS[selectedModel.category]?.icon}
          <span className="text-text-primary">{selectedModel.publicName}</span>
        </div>
        <ChevronDown size={14} className="text-text-secondary" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-[#1A1A1A] border border-white/10 z-50 p-1">
          <div className="max-h-80 overflow-y-auto">
            {Object.entries(modelsByCategory).map(([category, models]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                  {CATEGORY_LABELS[category]?.icon}
                  {CATEGORY_LABELS[category]?.label}
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model.id)}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2 rounded hover:bg-white/5 transition-colors ${selectedModelId === model.id ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${selectedModelId === model.id ? 'text-primary' : 'text-text-primary'}`}>
                          {model.publicName}
                        </span>
                        {selectedModelId === model.id && <Check size={14} className="text-primary" />}
                      </div>
                      <p className="text-xs text-text-secondary truncate mt-0.5" title={model.description}>
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
