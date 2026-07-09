import { AIModel } from '../types/model.types';
import { AI_MODELS } from '../../../config/openRouter';

const MID = AI_MODELS.ATHENA_V3.id;

export const ATHENA_MODELS: AIModel[] = [
  {
    id: 'athena-v3',
    modelId: MID,
    name: 'ATHENA V3',
    provider: 'StudyFlow',
    description: 'Modelo unico StudyFlow para raciocinio, redacao e questoes.',
    isFree: true,
    contextWindow: 128000,
  },
];

export const DEFAULT_MODEL = ATHENA_MODELS[0];
