// functions/src/ai/config.ts

/** Modelo único Athena — mesmo slug do app (OpenRouter). */
export const ATHENA_V3_OPENROUTER_ID = 'deepseek/deepseek-chat';

export const AI_MODELS = {
  ATHENA_V3: {
    id: ATHENA_V3_OPENROUTER_ID,
    name: 'ATHENA V3',
    context: 128000,
    strengths: ['geral', 'redação', 'ENEM', 'questões'],
    speed: 'médio',
    quality: 9,
    multimodal: false,
  },
} as const;

export type ModelKey = keyof typeof AI_MODELS;

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
