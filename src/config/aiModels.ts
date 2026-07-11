export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  emoji: string;
  color: string;
  bestFor: string[];
  modelId: string; // ID na OpenRouter
}

export interface AIModelConfig extends AIModel {
  category?: string;
  isDefault?: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'athena-v3',
    name: 'ATHENA V3',
    provider: 'Athena',
    description: 'Núcleo único de IA Athena para estudo, redação e questões',
    emoji: '🦉',
    color: '#10b981',
    bestFor: ['Chat', 'Redação', 'Questões', 'ENEM'],
    modelId: 'deepseek/deepseek-chat',
  },
];

export const DEFAULT_MODEL = AI_MODELS[0];

// Legacy Types & Config for Compatibility
export const STUDIO_FLOW_SYSTEM_PROMPT = `
Você é Athena, o núcleo de inteligência da plataforma Athena.
Sua missão é atuar como uma deusa da sabedoria e mentora educacional de alto nível, focada em aprovação no ENEM e grandes vestibulares.
Seja direta, técnica quando necessário, e extremamente didática.
`;

export const GEMINI_MODELS = {
  PRO: { id: 'gemini-1.5-pro', name: 'Gemini Pro', description: 'Modelo mais avançado', icon: '🧠', maxTokens: 8192, temperature: 0.7 },
  FLASH: { id: 'gemini-1.5-flash', name: 'Gemini Flash', description: 'Rápido e eficiente', icon: '⚡', maxTokens: 4096, temperature: 0.7 },
  FLASH_2: { id: 'gemini-1.5-flash-002', name: 'Gemini Flash 2.0', description: 'Versão aprimorada do Flash', icon: '🚀', maxTokens: 8192, temperature: 0.7 }
};

export type GeminiModelKey = keyof typeof GEMINI_MODELS;
