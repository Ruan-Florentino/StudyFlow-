import { athenaClient } from '../features/athena/services/athenaClient';
import { DEFAULT_OPENROUTER_CHAT_MODEL } from '../config/openRouter';
import type { RecommendedTrail } from '../data/explore';
import { parseExploreTrailFromAiContent } from '../lib/aiExploreTrail';

/**
 * AI Service Wrapper
 * This service bridges the gap between legacy components and the new Athena architecture.
 * It provides the same functional interface as the old aiService but uses Athena Client.
 */
export const aiService = {
  chat: async (message: string, history: any[] = [], model?: string) => {
    return athenaClient.chat({
      messages: [
        ...history.map(h => ({ role: h.role || 'user', content: h.content || h.text })),
        { role: 'user', content: message }
      ],
      model: model || DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  explainQuestion: async (question: string, alternatives: string[], correct: string) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um professor especializado em provas de alto nível. Explique a questão didaticamente.' },
        { role: 'user', content: `Explique por que a alternativa "${correct}" é a correta:\n\nQuestão: ${question}\n\nAlternativas: ${alternatives.join(' | ')}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  explainError: async (question: string, alternatives: string[], correct: string, userChoice: string) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um tutor atencioso. Explique o erro do aluno de forma construtiva.' },
        { role: 'user', content: `O aluno marcou "${userChoice}" mas o correto é "${correct}". Explique por que a escolha dele foi errada e a outra certa.\n\nQuestão: ${question}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  generateQuestions: async (topic: string, count: number = 10) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um gerador de questões estilo ENEM. Retorne APENAS um JSON válido.' },
        { role: 'user', content: `Gere ${count} questões sobre: ${topic}. Formato JSON: [{"id": "ai_1", "pergunta": "...", "alternativas": ["A", "B", "C", "D", "E"], "resposta": 0, "materia": "...", "assunto": "...", "difficulty": "Medium"}]` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  evaluateEssay: async (topic: string, text: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um corretor oficial de redação ENEM. Retorne APENAS JSON.' },
        { role: 'user', content: `Corrija a redação sobre "${topic}":\n\n${text}\n\nRetorne JSON com notaTotal (1000), competencias (c1-c5), pontosFortes, pontosMelhoria, feedbackGeral.` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateEssaySuggestions: async (text: string, topic: string) => {
    const response = await athenaClient.chat({
      messages: [
         { role: 'system', content: 'Role: Co-Pilot de Redação. Retorne JSON.' },
         { role: 'user', content: `Sugira melhorias para: ${text}\n\nTema: ${topic}\n\nJSON format: [{"id": "1", "type": "...", "text": "..."}]` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateSmartRecommendation: async (history: any[], level: number) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Analista de Desempenho. Retorne JSON.' },
        { role: 'user', content: `Gere recomendação baseada em: ${JSON.stringify(history.slice(0, 5))} e nível ${level}. JSON: {title, description, icon, priority, actionTab}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  /**
   * Treino Estratégico: escolhe ids de questões já existentes no manifest (não inventa questões).
   */
  /** Trilha única para a tela Explorar (JSON → RecommendedTrail validado). */
  generateExploreTrail: async (userPrompt: string, contextSummary?: string): Promise<RecommendedTrail> => {
    const response = await athenaClient.chat({
      messages: [
        {
          role: 'system',
          content:
            'Você é a Athena, mentora de estudos para ENEM e concursos. Gere UMA trilha de estudo. Responda APENAS com um objeto JSON válido (UTF-8), sem markdown nem texto extra.',
        },
        {
          role: 'user',
          content: `Pedido do aluno:
"${userPrompt.slice(0, 520)}"

Contexto de desempenho (opcional):
${(contextSummary ?? '—').slice(0, 420)}

Regras:
- startPath deve ser exatamente um: /questoes, /redacao, /simulados, /notas ou /metodos (use /questoes se for prática de questões).
- navFilters: apenas chaves opcionais "subject", "topic", "difficulty", "search" (strings). Para ENEM use matérias como Matemática, Português, Ciências da Natureza, Ciências Humanas quando fizer sentido.
- topics: array com 4 a 10 passos ou módulos curtos.
- icon: um único emoji.
- durationLabel e level em português.

Schema:
{"title":"","description":"","topics":[],"durationLabel":"","level":"","icon":"","startPath":"/questoes","navFilters":{}}`,
        },
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL,
      temperature: 0.45,
    });
    return parseExploreTrailFromAiContent(response);
  },

  planStrategicTraining: async (
    performanceText: string,
    manifestCompact: { i: string; m: string; a: string; d: string }[]
  ): Promise<{ selectedIds: string[]; mentorNote?: string }> => {
    const response = await athenaClient.chat({
      messages: [
        {
          role: 'system',
          content:
            'Você é a Athena, mentora de vestibular/concursos. Responda APENAS com um objeto JSON válido (UTF-8). Sem markdown, sem texto antes ou depois.',
        },
        {
          role: 'user',
          content: `Monte um treino de EXATAMENTE 15 questões escolhendo só os ids do manifest (campo "i").

Regras:
- Use somente ids presentes no manifest.
- Priorize matérias/assuntos com mais erros no resumo; equilibre matérias quando fizer sentido.
- "selectedIds" deve ter 15 strings distintas quando o manifest tiver pelo menos 15 itens; se o manifest for menor, use todos sem repetir.

DESEMPENHO RESUMIDO:
${performanceText}

MANIFEST (i=id, m=matéria, a=assunto, d=difficulty):
${JSON.stringify(manifestCompact)}

Formato exato: {"selectedIds":["..."],"mentorNote":"frase curta em português para o aluno (opcional)"}`,
        },
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL,
      temperature: 0.25,
    });
    const raw = response.replace(/```json|```/g, '').trim();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start < 0 || end <= start) throw new Error('Resposta da IA não é JSON válido');
      parsed = JSON.parse(raw.slice(start, end + 1));
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Formato inesperado da IA');
    }
    const o = parsed as Record<string, unknown>;
    const ids = o.selectedIds;
    if (!Array.isArray(ids)) throw new Error('selectedIds ausente');
    const selectedIds = ids.filter((x): x is string => typeof x === 'string' && x.length > 0);
    const note = o.mentorNote;
    return {
      selectedIds,
      mentorNote: typeof note === 'string' ? note.slice(0, 400) : undefined,
    };
  },

  summarizeVideo: async (url: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Resumidor de vídeos. Retorne JSON.' },
        { role: 'user', content: `Resuma o vídeo em ${url}. JSON: {summary, topics, flashcards}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  analyzeDocument: async (base64: string, mimeType: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Analisador de documentos. Retorne JSON.' },
        { role: 'user', content: `Analise o documento PDF/Imagem base64 fornecido. JSON: {summary, topics, flashcards}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  // Fallback for generic calls
  generateStudyPlan: async (prompt: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: prompt }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  findSemanticNode: async (query: string, nodes: any[]) => {
     const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Navegador Semântico. Retorne apenas o ID do nó mais próximo.' },
        { role: 'user', content: `Busca: ${query}. Nós: ${JSON.stringify(nodes)}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    return response.trim();
  },

  generateContent: async (topic: string, format?: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere conteúdo sobre ${topic}${format ? ` no formato ${format}` : ''}.` }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  generateAudio: async (text: string) => {
    // Placeholder for audio generation
    console.log("Audio requested for:", text);
    return "audio_data_placeholder";
  },

  generateMastermindResponse: async (topic: string, history: any[], persona: string) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: `Você faz parte de um Mastermind Group. Sua persona é: ${persona}.` },
        ...history.map(h => ({ role: h.sender === persona ? 'assistant' : 'user', content: h.text })),
        { role: 'user', content: `Dê sua contribuição sobre ${topic}.` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  generateMemoryAssociation: async (concept: string, room: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Crie uma associação mnemônica para "${concept}" no ambiente "${room}".` }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  generateAlchemicalTransmutation: async (a: string, b: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Alquimista Mental. Retorne JSON: {transmutation, coreConcept, practicalApplication}' },
        { role: 'user', content: `Transmute: ${a} + ${b}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  forgeConcepts: async (a: string, b: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Forja Neural. Retorne JSON: {forgedConcept, explanation, powerLevel}' },
        { role: 'user', content: `Forjar: ${a} + ${b}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateRoutine: async (target: string, hours: number, days: any[], level: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Arquiteto de Rotinas. Retorne JSON: {routine: []}' },
        { role: 'user', content: `Meta: ${target}, ${hours}h/dia, Dias: ${JSON.stringify(days)}, Nível: ${level}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateOracleProphecy: async (name: string, level: number, prestige: number, subjects: any[]) => {
    const response = await athenaClient.chat({
      messages: [{ role: 'user', content: `Gere uma profecia para ${name} (Lvl ${level}, Prestige ${prestige}) focado em ${JSON.stringify(subjects)}. Retorne JSON: {prophecy, convergenceProbability, finalQuote}` }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateFlashcards: async (topic: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Gerador de Flashcards. Retorne JSON: {flashcards: [{front, back}]}' },
        { role: 'user', content: `Tópico: ${topic}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generatePodcastScript: async (content: string, title: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere um roteiro de podcast para: ${title}\n\n${content}` }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  generateExamPlan: async (name: string, subjects: string[], date: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere um plano de prova para ${name} em ${date}. Matérias: ${subjects.join(',')}` }],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  },

  suggestReview: async (topics: string[]) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Mentor de Revisão. Retorne JSON: {suggestions: []}' },
        { role: 'user', content: `Tópicos errados: ${topics.join(',')}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateActiveRecall: async (topic: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Active Recall Master. Retorne JSON: {questions: []}' },
        { role: 'user', content: `Tema: ${topic}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  blurtingComparison: async (topic: string, content: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Blurting Comparison Tool. Retorne JSON: {foundPoints: [], missingPoints: [], overallScore}' },
        { role: 'user', content: `Tema: ${topic}. Conteúdo do aluno: ${content}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  feynmanCorrection: async (subject: string, explanation: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Feynman Grader. Retorne JSON: {didacticScore, gaps: [], clearExplanation: string}' },
        { role: 'user', content: `Assunto: ${subject}. Explicação: ${explanation}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateInterleavingQuiz: async (subjects: string[]) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Interleaver. Retorne JSON: {quiz: []}' },
        { role: 'user', content: `Assuntos: ${subjects.join(',')}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateLearningPath: async (subject: string, level: string | number) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Pathfinder. Retorne JSON: {steps: []}' },
        { role: 'user', content: `Assunto: ${subject}, Nível: ${level}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateMindMap: async (topic: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Mind Map Architect. Retorne JSON: {nodes: [], edges: []}' },
        { role: 'user', content: `Tópico: ${topic}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateBossBattle: async (subject: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Final Boss Generator. Retorne JSON: {questions: []}' },
        { role: 'user', content: `Assunto: ${subject}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateSlides: async (topic: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Slide Master. Retorne JSON: {slides: []}' },
        { role: 'user', content: `Tópico: ${topic}` }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  socraticDebate: async (topic: string, message: string, history: any[]) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é Sócrates. Debata usando o método socrático.' },
        ...history.map(h => ({ role: h.role || (h.sender === 'user' ? 'user' : 'assistant'), content: h.content || h.text })),
        { role: 'user', content: message }
      ],
      model: DEFAULT_OPENROUTER_CHAT_MODEL
    });
  }
};
