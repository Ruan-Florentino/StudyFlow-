import { athenaClient } from '../features/athena/services/athenaClient';

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
      model: model || 'google/gemini-2.0-flash-exp:free'
    });
  },

  explainQuestion: async (question: string, alternatives: string[], correct: string) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um professor especializado em provas de alto nível. Explique a questão didaticamente.' },
        { role: 'user', content: `Explique por que a alternativa "${correct}" é a correta:\n\nQuestão: ${question}\n\nAlternativas: ${alternatives.join(' | ')}` }
      ],
      model: 'google/gemini-2.0-flash-exp:free'
    });
  },

  explainError: async (question: string, alternatives: string[], correct: string, userChoice: string) => {
    return athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um tutor atencioso. Explique o erro do aluno de forma construtiva.' },
        { role: 'user', content: `O aluno marcou "${userChoice}" mas o correto é "${correct}". Explique por que a escolha dele foi errada e a outra certa.\n\nQuestão: ${question}` }
      ],
      model: 'google/gemini-2.0-flash-001'
    });
  },

  generateQuestions: async (topic: string, count: number = 10) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Você é um gerador de questões estilo ENEM. Retorne APENAS um JSON válido.' },
        { role: 'user', content: `Gere ${count} questões sobre: ${topic}. Formato JSON: [{"id": "ai_1", "pergunta": "...", "alternativas": ["A", "B", "C", "D", "E"], "resposta": 0, "materia": "...", "assunto": "...", "difficulty": "Medium"}]` }
      ],
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-exp:free'
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  summarizeVideo: async (url: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Resumidor de vídeos. Retorne JSON.' },
        { role: 'user', content: `Resuma o vídeo em ${url}. JSON: {summary, topics, flashcards}` }
      ],
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  // Fallback for generic calls
  generateStudyPlan: async (prompt: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: prompt }],
      model: 'google/gemini-2.0-pro-exp-02-05:free'
    });
  },

  findSemanticNode: async (query: string, nodes: any[]) => {
     const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Navegador Semântico. Retorne apenas o ID do nó mais próximo.' },
        { role: 'user', content: `Busca: ${query}. Nós: ${JSON.stringify(nodes)}` }
      ],
      model: 'google/gemini-2.0-flash-001'
    });
    return response.trim();
  },

  processBrainUpload: async (text: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Analisador de Conhecimento. Retorne JSON: {summary, concepts: [], connections: []}' },
        { role: 'user', content: `Texto: ${text}` }
      ],
      model: 'google/gemini-2.0-flash-001'
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateContent: async (topic: string, format?: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere conteúdo sobre ${topic}${format ? ` no formato ${format}` : ''}.` }],
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-pro-exp-02-05:free'
    });
  },

  generateMemoryAssociation: async (concept: string, room: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Crie uma associação mnemônica para "${concept}" no ambiente "${room}".` }],
      model: 'google/gemini-2.0-flash-001'
    });
  },

  generateAlchemicalTransmutation: async (a: string, b: string) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Alquimista Mental. Retorne JSON: {transmutation, coreConcept, practicalApplication}' },
        { role: 'user', content: `Transmute: ${a} + ${b}` }
      ],
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generateOracleProphecy: async (name: string, level: number, prestige: number, subjects: any[]) => {
    const response = await athenaClient.chat({
      messages: [{ role: 'user', content: `Gere uma profecia para ${name} (Lvl ${level}, Prestige ${prestige}) focado em ${JSON.stringify(subjects)}. Retorne JSON: {prophecy, convergenceProbability, finalQuote}` }],
      model: 'google/gemini-2.0-pro-exp-02-05:free'
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
      model: 'google/gemini-2.0-flash-001'
    });
    const cleanJson = response.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  },

  generatePodcastScript: async (content: string, title: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere um roteiro de podcast para: ${title}\n\n${content}` }],
      model: 'google/gemini-2.0-flash-001'
    });
  },

  generateExamPlan: async (name: string, subjects: string[], date: string) => {
    return athenaClient.chat({
      messages: [{ role: 'user', content: `Gere um plano de prova para ${name} em ${date}. Matérias: ${subjects.join(',')}` }],
      model: 'google/gemini-2.0-flash-001'
    });
  },

  suggestReview: async (topics: string[]) => {
    const response = await athenaClient.chat({
      messages: [
        { role: 'system', content: 'Mentor de Revisão. Retorne JSON: {suggestions: []}' },
        { role: 'user', content: `Tópicos errados: ${topics.join(',')}` }
      ],
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-flash-001'
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
      model: 'google/gemini-2.0-pro-exp-02-05:free'
    });
  }
};
