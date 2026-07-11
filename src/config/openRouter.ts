/**
 * Modelo único da Athena.
 */
export const ATHENA_V3_OPENROUTER_ID = 'deepseek/deepseek-chat' as const;

export const AI_MODELS = {
  ATHENA_V3: {
    id: ATHENA_V3_OPENROUTER_ID,
    name: 'ATHENA',
    context: 128000,
    strengths: ['geral', 'redação', 'raciocínio', 'ENEM', 'questões'],
    speed: 'médio',
    quality: 9,
    multimodal: false,
  },
} as const;

export type ModelKey = keyof typeof AI_MODELS;

/**
 * Fallback no proxy quando 429/404 no modelo principal.
 */
export const OPENROUTER_PROXY_FALLBACK_MODELS: readonly string[] = [
  'deepseek/deepseek-chat',
  'openrouter/free',
];

export const DEFAULT_OPENROUTER_CHAT_MODEL = ATHENA_V3_OPENROUTER_ID;

/** Uma única estratégia para todas as tarefas. */
export const TASK_STRATEGIES = {
  chat: ['ATHENA_V3'],
  redacao: ['ATHENA_V3'],
  matematica: ['ATHENA_V3'],
  trilha: ['ATHENA_V3'],
  resumo: ['ATHENA_V3'],
  imagem: ['ATHENA_V3'],
  codigo: ['ATHENA_V3'],
  exercicio: ['ATHENA_V3'],
} as const;

export type TaskType = keyof typeof TASK_STRATEGIES;
