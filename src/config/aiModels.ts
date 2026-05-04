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
    id: 'gemini-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Rápido e versátil',
    emoji: '⚡',
    color: '#4285F4',
    bestFor: ['Resumos', 'Respostas rápidas', 'Geral'],
    modelId: 'google/gemini-2.0-flash-exp:free',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 2.0 Pro',
    provider: 'Google',
    description: 'Qualidade e análise profunda',
    emoji: '🧠',
    color: '#0F9D58',
    bestFor: ['Redação', 'Matemática', 'Análise profunda'],
    modelId: 'google/gemini-2.0-pro-exp-02-05:free',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Poderoso para lógica e programação',
    emoji: '🐳',
    color: '#0055FF',
    bestFor: ['Matemática', 'Código', 'Lógica'],
    modelId: 'deepseek/deepseek-r1',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Ideal para chat',
    emoji: '💬',
    color: '#00BFFF',
    bestFor: ['ChatGeral', 'Humanas', 'Redação'],
    modelId: 'deepseek/deepseek-chat',
  },
  {
    id: 'llama-3',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Modelo open-source eficiente',
    emoji: '🦙',
    color: '#0668E1',
    bestFor: ['Equilibrado', 'Redação', 'Resumos'],
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  {
    id: 'mistral-nemo',
    name: 'Mistral Nemo',
    provider: 'Mistral',
    description: 'Rápido e focado',
    emoji: '🎐',
    color: '#F97316',
    bestFor: ['Foco', 'Direto', 'Rápido'],
    modelId: 'mistralai/mistral-nemo',
  },
  {
    id: 'qwen-2.5',
    name: 'Qwen 3.0 Next',
    provider: 'Alibaba',
    description: 'Forte em raciocínio geral',
    emoji: '🐉',
    color: '#8A2BE2',
    bestFor: ['Geral', 'Tradução', 'Humanas'],
    modelId: 'qwen/qwen3-next-80b-a3b-instruct:free',
  }
];

export const DEFAULT_MODEL = AI_MODELS[0];

// Legacy Types & Config for Compatibility
export const STUDIO_FLOW_SYSTEM_PROMPT = `
Você é Athena, o núcleo de inteligência da Studio Flow.
Sua missão é atuar como uma deusa da sabedoria e mentora educacional de alto nível, focada em aprovação no ENEM e grandes vestibulares.
Seja direta, técnica quando necessário, e extremamente didática.
`;

export const GEMINI_MODELS = {
  PRO: { id: 'gemini-1.5-pro', name: 'Gemini Pro', description: 'Modelo mais avançado', icon: '🧠', maxTokens: 8192, temperature: 0.7 },
  FLASH: { id: 'gemini-1.5-flash', name: 'Gemini Flash', description: 'Rápido e eficiente', icon: '⚡', maxTokens: 4096, temperature: 0.7 },
  FLASH_2: { id: 'gemini-1.5-flash-002', name: 'Gemini Flash 2.0', description: 'Versão aprimorada do Flash', icon: '🚀', maxTokens: 8192, temperature: 0.7 }
};

export type GeminiModelKey = keyof typeof GEMINI_MODELS;
