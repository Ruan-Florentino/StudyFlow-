import { athenaClient } from './athenaClient';
import { BASE_SYSTEM_PROMPT } from '../prompts/systemPrompts';

export const athenaService = {
  generateSmartRecommendation: async (history: any[], level: number) => {
    const prompt = `
      Com base no histórico de estudos do aluno (as últimas ${history.length} questões):
      ${JSON.stringify(history.slice(0, 10))}
      
      E no nível atual: ${level}
      
      Gere uma recomendação de estudo curta e motivadora.
      Retorne APENAS um objeto JSON no formato:
      {
        "title": "título curto",
        "description": "descrição curta",
        "icon": "Zap | BookOpen | Target | Brain",
        "priority": "normal | high",
        "actionTab": "questoes | redacao | trilhas"
      }
    `;

    try {
      const response = await athenaClient.chat({
        messages: [
          { role: 'system', content: 'Você é um assistente de recomendação de estudos. Retorne apenas JSON.' },
          { role: 'user', content: prompt }
        ],
        model: 'google/gemma-2-27b-it:free'
      });

      const cleanJson = response.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Erro na recomendação Athena:', e);
      return null;
    }
  }
};
