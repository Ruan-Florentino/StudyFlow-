import React from 'react';
import { STUDY_AGENTS, AgentKey } from '../../config/aiAgents';
import { useAIUI } from '../../hooks/useAIUI';
import { GEMINI_MODELS, GeminiModelKey } from '../../config/aiModels';

export function AgentSelector() {
  const { openChat, setViewMode } = useAIUI();

  const handleSelect = (key: AgentKey) => {
    setViewMode('page');
    openChat(key, null); // Start fresh session
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(STUDY_AGENTS).map(([key, agent]) => {
        const modelName = GEMINI_MODELS[agent.model as GeminiModelKey]?.name || agent.model;
        
        return (
          <button
            key={key}
            onClick={() => handleSelect(key as AgentKey)}
            className="group relative flex flex-col text-left items-start p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all overflow-hidden shadow-sm hover:shadow-lg"
            style={{ '--agent-color': agent.color } as any}
          >
            {/* Subtle colored glow on hover */}
            <div 
              className="absolute -inset-px opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl pointer-events-none"
              style={{ backgroundColor: `var(--agent-color)` }}
            />

            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-3xl mb-4 border border-white/10 group-hover:scale-110 transition-transform">
              {agent.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
            
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: `var(--agent-color)` }}></span>
              Intelligence: {modelName}
            </div>
            
            <p className="text-sm text-white/50 leading-relaxed mt-auto">
              {agent.tagline || 'Especialista pronta para te ajudar a conquistar sua vaga.'}
            </p>
          </button>
        );
      })}
    </div>
  );
}
