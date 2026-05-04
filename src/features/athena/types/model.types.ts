export interface AIModel {
  id: string;
  modelId: string; // OpenRouter ID
  name: string;
  provider: string;
  description: string;
  isFree: boolean;
  contextWindow: number;
  vision?: boolean;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
