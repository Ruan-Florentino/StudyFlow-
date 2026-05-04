import React from 'react';
import { AI_MODELS, AIModel } from '../config/aiModels';

interface Props {
  selected: AIModel;
  onSelect: (model: AIModel) => void;
}

export function AIModelSelector({ selected, onSelect }: Props) {
  return (
    <div className="ai-selector">
      <h3 className="text-white font-bold mb-4">Escolha sua IA:</h3>
      <div className="ai-grid">
        {AI_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={`ai-card ${selected.id === model.id ? 'active' : ''}`}
            style={{
              borderColor: selected.id === model.id ? model.color : 'transparent',
              '--glow-color': model.color
            } as React.CSSProperties}
          >
            <div className="ai-emoji">{model.emoji}</div>
            <div className="ai-name">{model.name}</div>
            <div className="ai-provider">{model.provider}</div>
            <div className="ai-desc">{model.description}</div>
            <div className="ai-tags">
              {model.bestFor.map((tag) => (
                <span key={tag} className="ai-tag">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
