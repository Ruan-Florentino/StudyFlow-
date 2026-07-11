// functions/src/ai/openrouter.ts
import * as functions from 'firebase-functions';
import { defineSecret } from 'firebase-functions/params';
import { AI_MODELS, TASK_STRATEGIES, ModelKey, TaskType } from './config';
import { SYSTEM_PROMPTS } from './prompts';

const openRouterKey = defineSecret('OPENROUTER_API_KEY');

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
  }>;
}

interface ChatRequest {
  messages: Message[];
  task?: TaskType;
  model?: ModelKey;
  systemPromptKey?: keyof typeof SYSTEM_PROMPTS;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface ChatResponse {
  success: boolean;
  message: string;
  modelUsed: string;
  modelName: string;
  attemptsCount: number;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 🎯 Função principal com fallback automático
 */
export const chatWithAI = functions
  .runWith({
    secrets: [openRouterKey],
    timeoutSeconds: 60,
    memory: '512MB',
  })
  .https.onCall(async (data: ChatRequest, context): Promise<ChatResponse> => {
    // ✅ Auth obrigatória
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Você precisa estar logado para usar a IA'
      );
    }

    // ✅ Validação básica
    if (!data.messages || !Array.isArray(data.messages) || data.messages.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Messages é obrigatório'
      );
    }

    // 🎯 Adiciona system prompt se especificado
    let messages = [...data.messages];
    if (data.systemPromptKey && !messages.some(m => m.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: SYSTEM_PROMPTS[data.systemPromptKey],
      });
    }

    // 🎯 Determina modelos a tentar
    const modelKeys: ModelKey[] = data.task
      ? [...TASK_STRATEGIES[data.task]]
      : data.model
      ? [data.model]
      : [...TASK_STRATEGIES.chat];

    let lastError: any = null;
    let attemptsCount = 0;

    // 🔄 Loop com fallback
    for (const modelKey of modelKeys) {
      attemptsCount++;
      const modelInfo = AI_MODELS[modelKey];

      try {
        console.log(`[Tentativa ${attemptsCount}] Modelo: ${modelInfo.name}`);

        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterKey.value()}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://athena.studyflow.app',
              'X-Title': 'Athena',
            },
            body: JSON.stringify({
              model: modelInfo.id,
              messages,
              temperature: data.temperature ?? 0.7,
              max_tokens: data.maxTokens ?? 2048,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`❌ Erro em ${modelInfo.name}: ${response.status} - ${errorText}`);
          lastError = new Error(`${response.status}: ${errorText}`);
          continue;
        }

        const result: any = await response.json();

        // ✅ Validar resposta
        if (!result.choices?.[0]?.message?.content) {
          console.warn(`⚠️ Resposta vazia de ${modelInfo.name}`);
          lastError = new Error('Resposta vazia');
          continue;
        }

        // 📊 Log de sucesso
        console.log(`✅ Sucesso com ${modelInfo.name}`);

        return {
          success: true,
          message: result.choices[0].message.content,
          modelUsed: modelInfo.id,
          modelName: modelInfo.name,
          attemptsCount,
          usage: result.usage,
        };
      } catch (error: any) {
        console.error(`💥 Erro com ${modelInfo.name}:`, error.message);
        lastError = error;
        continue;
      }
    }

    // ❌ Todos falharam
    throw new functions.https.HttpsError(
      'internal',
      `Todos os ${modelKeys.length} modelos falharam. Último erro: ${lastError?.message}`
    );
  });

/**
 * 🎯 Função para listar modelos disponíveis
 */
export const listAIModels = functions.https.onCall(async (_, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login obrigatório');
  }

  return {
    models: Object.entries(AI_MODELS).map(([key, info]) => ({
      key,
      ...info,
    })),
    tasks: Object.keys(TASK_STRATEGIES),
  };
});
