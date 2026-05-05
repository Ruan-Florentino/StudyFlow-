import { AIModel } from '../types/model.types';
import { AI_MODELS } from '../../../config/openRouter';

export const ATHENA_MODELS: AIModel[] = [
  {
    id: 'gemini-flash',
    modelId: AI_MODELS.GEMINI_FLASH.id,
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Rápido, versátil e excelente para a maioria das tarefas.',
    isFree: true,
    contextWindow: 1000000
  },
  {
    id: 'gemini-pro',
    modelId: AI_MODELS.GEMINI_PRO.id,
    name: 'Gemini 2.0 Pro',
    provider: 'Google',
    description: 'Maior capacidade de raciocínio, ótimo para matemática e programação.',
    isFree: true,
    contextWindow: 1000000
  },
  {
    id: 'deepseek-r1',
    modelId: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Forte em raciocínio, lógica e matemática.',
    isFree: true,
    contextWindow: 32000
  },
  {
    id: 'deepseek-chat',
    modelId: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    description: 'Excelente para diálogo e redação.',
    isFree: true,
    contextWindow: 32000
  },
  {
    id: 'llama-3',
    modelId: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    description: 'Modelo open-source versátil e eficiente.',
    isFree: true,
    contextWindow: 8192
  },
  {
    id: 'mistral-nemo',
    modelId: 'mistralai/mistral-nemo',
    name: 'Mistral Nemo',
    provider: 'Mistral',
    description: 'Muito rápido e direto.',
    isFree: true,
    contextWindow: 128000
  },
  {
    id: 'qwen-2.5',
    modelId: 'qwen/qwen3-next-80b-a3b-instruct:free',
    name: 'Qwen 3.0 Next',
    provider: 'Alibaba',
    description: 'Ótimo em traduções e raciocínio geral.',
    isFree: true,
    contextWindow: 32000
  }
];

export const DEFAULT_MODEL = ATHENA_MODELS[0];
