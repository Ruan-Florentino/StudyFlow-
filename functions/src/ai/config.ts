// functions/src/ai/config.ts

/**
 * 🎯 MODELOS FREE DO OPENROUTER (Maio/2026)
 * Todos compartilham a mesma API Key
 */
export const AI_MODELS = {
  // 🥇 TIER S - Os melhores
  DEEPSEEK_R1: {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    context: 128000,
    strengths: ['raciocínio', 'matemática', 'lógica'],
    speed: 'lento',
    quality: 10,
  },
  NEMOTRON_SUPER: {
    id: 'nvidia/nemotron-3-super:free',
    name: 'NVIDIA Nemotron 3 Super',
    context: 1000000,
    strengths: ['agents', 'contexto longo', 'multi-step'],
    speed: 'médio',
    quality: 9,
  },

  // 🥈 TIER A - Excelentes
  LLAMA_70B: {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    context: 128000,
    strengths: ['geral', 'chat', 'equilibrado'],
    speed: 'rápido',
    quality: 8,
  },
  GEMINI_FLASH: {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    context: 1000000,
    strengths: ['rápido', 'multimodal', 'contexto grande'],
    speed: 'muito rápido',
    quality: 8,
    multimodal: true,
  },
  GEMINI_PRO: {
    id: 'google/gemini-2.0-pro-exp-02-05:free',
    name: 'Gemini 2.0 Pro',
    context: 1000000,
    strengths: ['qualidade', 'análise profunda'],
    speed: 'médio',
    quality: 9,
    multimodal: true,
  },
  NEMOTRON_70B: {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
    name: 'Nemotron 70B',
    context: 128000,
    strengths: ['instruções', 'precisão'],
    speed: 'rápido',
    quality: 8,
  },

  // 🥉 TIER B - Especialistas
  QWEN_VL: {
    id: 'qwen/qwen-2.5-vl-72b-instruct:free',
    name: 'Qwen 2.5 VL 72B',
    context: 32000,
    strengths: ['visão', 'OCR', 'análise de imagem'],
    speed: 'médio',
    quality: 8,
    multimodal: true,
  },
  DEEPSEEK_DISTILL: {
    id: 'deepseek/deepseek-r1-distill-llama-70b:free',
    name: 'DeepSeek R1 Distill',
    context: 128000,
    strengths: ['raciocínio rápido'],
    speed: 'rápido',
    quality: 8,
  },
  MISTRAL_SMALL: {
    id: 'mistralai/mistral-small-24b-instruct-2501:free',
    name: 'Mistral Small 24B',
    context: 32000,
    strengths: ['eficiente', 'rápido'],
    speed: 'muito rápido',
    quality: 7,
  },
} as const;

export type ModelKey = keyof typeof AI_MODELS;

/**
 * 🎯 ESTRATÉGIAS POR TAREFA
 * Define ordem de fallback automático
 */
export const TASK_STRATEGIES = {
  // Chat geral - prioriza velocidade e equilíbrio
  chat: ['LLAMA_70B', 'GEMINI_FLASH', 'MISTRAL_SMALL', 'NEMOTRON_70B'],
  
  // Redação - prioriza qualidade e raciocínio
  redacao: ['DEEPSEEK_R1', 'GEMINI_PRO', 'LLAMA_70B', 'NEMOTRON_SUPER'],
  
  // Matemática - prioriza raciocínio
  matematica: ['DEEPSEEK_R1', 'NEMOTRON_SUPER', 'DEEPSEEK_DISTILL', 'LLAMA_70B'],
  
  // Trilha de estudos - equilíbrio
  trilha: ['GEMINI_FLASH', 'LLAMA_70B', 'NEMOTRON_70B', 'MISTRAL_SMALL'],
  
  // Resumos - rápido e bom
  resumo: ['GEMINI_FLASH', 'MISTRAL_SMALL', 'LLAMA_70B'],
  
  // Análise de imagem - apenas multimodais
  imagem: ['QWEN_VL', 'GEMINI_FLASH', 'GEMINI_PRO'],
  
  // Código/programação
  codigo: ['DEEPSEEK_R1', 'LLAMA_70B', 'NEMOTRON_SUPER'],
  
  // Exercícios - boa explicação
  exercicio: ['LLAMA_70B', 'DEEPSEEK_R1', 'GEMINI_FLASH'],
} as const;

export type TaskType = keyof typeof TASK_STRATEGIES;
