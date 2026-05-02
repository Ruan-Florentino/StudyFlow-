/**
 * Modelos Gemini disponíveis (verificados na API)
 * NÃO INVENTAR NOMES — só usar os listados aqui
 */
export const GEMINI_MODELS = {
  // Rápido e barato (default pra maioria das features)
  FLASH:      'gemini-2.0-flash',
  
  // Mais inteligente (redação, análises complexas)
  PRO:        'gemini-2.5-pro',
  
  // Versão antiga (fallback)
  FLASH_15:   'gemini-1.5-flash',
  PRO_15:     'gemini-1.5-pro',
} as const;

export type GeminiModel = typeof GEMINI_MODELS[keyof typeof GEMINI_MODELS];

// Default global
export const DEFAULT_MODEL: GeminiModel = GEMINI_MODELS.FLASH;
