import React from 'react';
import { AI_MODELS, AIModel } from '../config/aiModels';

interface Props {
  selected: AIModel;
  onSelect: (model: AIModel) => void;
}

export function AIModelSelector(props: Props) {
  if (AI_MODELS.length <= 1) {
    const only = AI_MODELS[0];
    if (!only) return null;
    return (
      <div className="ai-selector">
        <p className="text-white/70 text-sm mb-2">Modelo ativo: <strong className="text-white">{only.name}</strong></p>
      </div>
    );
  }
  const { selected, onSelect } = props;
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
