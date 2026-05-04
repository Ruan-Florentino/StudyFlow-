import { AIModel } from '../types/model.types';

export const ATHENA_MODELS: AIModel[] = [
  {
    id: 'gemma-2-27b',
    modelId: 'google/gemma-2-27b-it:free',
    name: 'Gemma 2 27B',
    provider: 'Google',
    description: 'Excelente para explicações didáticas e raciocínio lógico.',
    isFree: true,
    contextWindow: 8192
  },
  {
    id: 'llama-3-3-70b',
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Modelo robusto com alto desempenho em diversas tarefas.',
    isFree: true,
    contextWindow: 128000
  },
  {
    id: 'deepseek-v3',
    modelId: 'deepseek/deepseek-chat:free',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Rápido e eficiente para chat geral e programação.',
    isFree: true,
    contextWindow: 64000
  },
  {
    id: 'phi-4',
    modelId: 'microsoft/phi-4:free',
    name: 'Phi-4',
    provider: 'Microsoft',
    description: 'Modelo compacto mas extremamente inteligente e preciso.',
    isFree: true,
    contextWindow: 16384
  },
  {
    id: 'qwen-2-5-72b',
    modelId: 'qwen/qwen-2.5-72b-instruct:free',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    description: 'Habilidades excepcionais de raciocínio e codificação.',
    isFree: true,
    contextWindow: 128000
  }
];

export const DEFAULT_MODEL = ATHENA_MODELS[1]; // Llama 3.3 70B
