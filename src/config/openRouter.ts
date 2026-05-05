/**
 * 🎯 MODELOS FREE DO OPENROUTER (Maio/2026)
 * Todos compartilham a mesma API Key
 */
export const AI_MODELS = {
  GEMINI_FLASH: {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    context: 1000000,
    strengths: ['rápido', 'multimodal', 'contexto grande', 'geral', 'chat'],
    speed: 'muito rápido',
    quality: 8,
    multimodal: true,
  },
  GEMINI_PRO: {
    id: 'google/gemini-2.0-pro-exp-02-05:free',
    name: 'Gemini 2.0 Pro',
    context: 1000000,
    strengths: ['qualidade', 'análise profunda', 'redação', 'matemática', 'raciocínio'],
    speed: 'médio',
    quality: 9,
    multimodal: true,
  },
  DEEPSEEK_R1: {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    context: 32000,
    strengths: ['matemática', 'código', 'raciocínio lógico', 'exatas'],
    speed: 'médio',
    quality: 9,
    multimodal: false,
  },
  LLAMA_3: {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    context: 8192,
    strengths: ['redação', 'humanas', 'interpretação', 'equilibrado'],
    speed: 'rápido',
    quality: 8,
    multimodal: false,
  },
  DEEPSEEK_V3: {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    context: 32000,
    strengths: ['chat geral', 'resumos', 'explicação', 'rápido'],
    speed: 'rápido',
    quality: 8,
    multimodal: false,
  },
  QWEN_72B: {
    id: 'qwen/qwen3-next-80b-a3b-instruct:free',
    name: 'Qwen 3 Next',
    context: 32000,
    strengths: ['versátil', 'tradução', 'conhecimento geral', 'humanas'],
    speed: 'médio',
    quality: 8,
    multimodal: false,
  },
  MISTRAL_NEMO: {
    id: 'mistralai/mistral-nemo',
    name: 'Mistral Nemo',
    context: 128000,
    strengths: ['rápido', 'direto', 'resumos curtos', 'foco'],
    speed: 'muito rápido',
    quality: 7,
    multimodal: false,
  }
} as const;

export type ModelKey = keyof typeof AI_MODELS;

/** Slug padrão para chat/JSON no app (evita IDs obsoletos no OpenRouter). */
export const DEFAULT_OPENROUTER_CHAT_MODEL = AI_MODELS.GEMINI_FLASH.id;

/**
 * 🎯 ESTRATÉGIAS POR TAREFA
 * Define ordem de fallback automático
 */
export const TASK_STRATEGIES = {
  // Chat geral - prioriza velocidade e equilíbrio
  chat: ['GEMINI_FLASH', 'GEMINI_PRO'],
  
  // Redação - prioriza qualidade e raciocínio
  redacao: ['GEMINI_PRO', 'GEMINI_FLASH'],
  
  // Matemática - prioriza raciocínio
  matematica: ['GEMINI_PRO', 'GEMINI_FLASH'],
  
  // Trilha de estudos - equilíbrio
  trilha: ['GEMINI_FLASH', 'GEMINI_PRO'],
  
  // Resumos - rápido e bom
  resumo: ['GEMINI_FLASH', 'GEMINI_PRO'],
  
  // Análise de imagem - apenas multimodais
  imagem: ['GEMINI_FLASH', 'GEMINI_PRO'],
  
  // Código/programação
  codigo: ['GEMINI_PRO', 'GEMINI_FLASH'],
  
  // Exercícios - boa explicação
  exercicio: ['GEMINI_PRO', 'GEMINI_FLASH'],
} as const;

export type TaskType = keyof typeof TASK_STRATEGIES;
