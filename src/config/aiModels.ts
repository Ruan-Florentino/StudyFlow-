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
  // ... (keeping the same models)
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Raciocínio profundo e matemática',
    emoji: '🧠',
    color: '#10B981',
    bestFor: ['Matemática', 'Lógica', 'Programação'],
    modelId: 'deepseek/deepseek-r1:free',
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Rápido e versátil',
    emoji: '⚡',
    color: '#4285F4',
    bestFor: ['Resumos', 'Respostas rápidas'],
    modelId: 'google/gemini-2.0-flash-exp:free',
  },
  {
    id: 'llama-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Conversação natural',
    emoji: '🦙',
    color: '#1877F2',
    bestFor: ['Chat geral', 'Explicações'],
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  {
    id: 'qwen-vl',
    name: 'Qwen 2.5 VL',
    provider: 'Alibaba',
    description: 'Línguas e redação',
    emoji: '✍️',
    color: '#FF6A00',
    bestFor: ['Redação', 'Tradução', 'Idiomas'],
    modelId: 'qwen/qwen-2.5-vl-72b-instruct:free',
  },
  {
    id: 'nemotron',
    name: 'Nemotron 70B',
    provider: 'NVIDIA',
    description: 'Educacional e didático',
    emoji: '🎓',
    color: '#76B900',
    bestFor: ['Estudos', 'Tutoria'],
    modelId: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
  },
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
