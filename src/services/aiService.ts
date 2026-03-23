import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export type AIIntent = 'explanation' | 'plan' | 'questions' | 'summary' | 'map' | 'flashcards' | 'review' | 'chat';

export const aiService = {
  // --- StudyFlow AI Engine ---
  async routeRequest(message: string, intent: AIIntent) {
    const systemInstruction = `
      Você é o StudyFlow AI, um assistente de estudos premium, inteligente e objetivo.
      
      REGRAS DE OURO:
      1. NUNCA mencione que você é um modelo da OpenAI, Google, Gemini ou Grok.
      2. NUNCA diga "Como modelo de linguagem" ou "Segundo o Gemini".
      3. Identifique-se SEMPRE como StudyFlow AI se perguntado.
      4. Responda de forma CURTA, DIRETA e ESTRUTURADA.
      5. Use bullet points para fórmulas e listas.
      6. Sem parágrafos longos. Máximo 5-8 linhas por resposta.
      7. Seja um professor especialista, didático e amigável.
      
      ESTRUTURA DE RESPOSTA:
      - Explicação curta (1-2 frases)
      - Bullet points com o essencial
      - Pergunta final instigante (ex: "Quer exercícios ou mapa mental?")
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction,
      }
    });

    return {
      text: response.text,
      engine: 'StudyFlow AI',
      intent
    };
  },

  async smartChat(message: string) {
    // Detect Intent
    let intent: AIIntent = 'chat';
    const msg = message.toLowerCase();

    if (msg.startsWith('/mapa')) intent = 'map';
    else if (msg.startsWith('/resumo')) intent = 'summary';
    else if (msg.startsWith('/flashcards')) intent = 'flashcards';
    else if (msg.startsWith('/plano')) intent = 'plan';
    else if (msg.startsWith('/explique')) intent = 'explanation';
    else if (msg.startsWith('/revisao')) intent = 'review';
    else if (msg.includes('explique') || msg.includes('o que é') || msg.includes('como funciona')) intent = 'explanation';
    else if (msg.includes('plano') || msg.includes('cronograma') || msg.includes('estudar')) intent = 'plan';
    else if (msg.includes('resumo') || msg.includes('resumir')) intent = 'summary';

    // Handle Commands specifically if needed, or just route
    const cleanMessage = message.replace(/^\/\w+\s*/, '');
    
    // For specific commands that need JSON output, we use specialized methods
    if (intent === 'map') return { type: 'map', data: await this.generateMindMap(cleanMessage) };
    if (intent === 'flashcards') return { type: 'flashcards', data: await this.generateFlashcards(cleanMessage) };
    if (intent === 'plan') return { type: 'plan', data: await this.generateStudyPlan(cleanMessage) };
    
    if (intent === 'summary') {
      const summary = await this.summarizeContent(cleanMessage);
      return { type: 'text', text: summary, engine: 'StudyFlow AI', intent };
    }
    
    if (intent === 'review') {
      const explanation = await this.suggestReview(cleanMessage.split(',').map(s => s.trim()));
      return { type: 'text', text: explanation, engine: 'StudyFlow AI', intent };
    }

    if (msg.includes('questões') || msg.includes('exercícios') || msg.startsWith('/questoes')) {
      return { 
        type: 'text', 
        text: "Nosso banco de questões agora é composto exclusivamente por questões REAIS de exames como ENEM, ITA, IME e outros. Você pode acessá-lo diretamente na aba 'Banco de Questões' para treinar com o material oficial!",
        engine: 'StudyFlow AI',
        intent: 'chat'
      };
    }

    // Default to routed chat
    const result = await this.routeRequest(message, intent);
    return { type: 'text', ...result };
  },

  async generateStudyPlan(subject: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um plano de estudo detalhado para o assunto: "${subject}". Retorne um JSON com o cronograma, tempo recomendado por tarefa e dificuldade.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
                },
                required: ["title", "duration", "difficulty"]
              }
            }
          },
          required: ["subject", "tasks"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateFlashcards(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere 5 flashcards de pergunta e resposta baseados no seguinte conteúdo: "${content}". Retorne apenas o JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async summarizeContent(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Resuma o seguinte conteúdo de forma didática e organizada em tópicos: "${content}"`,
    });
    return response.text;
  },

  async chat(message: string, history: { role: 'user' | 'model', text: string }[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Você é o StudyFlow AI, um assistente de estudos premium. Responda de forma clara, didática e motivadora. Use markdown para formatar suas respostas.",
      },
    });

    // Send history if needed, but for simplicity we'll just send the current message with context
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async explainQuestion(question: string, options: string[], correctAnswer: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique detalhadamente por que a resposta correta para a questão "${question}" com as opções [${options.join(', ')}] é "${correctAnswer}". 
      Forneça:
      1. Uma explicação simples.
      2. Um passo a passo da resolução.
      3. Uma dica de estudo relacionada.
      Retorne em formato Markdown estruturado.`,
    });
    return response.text;
  },

  async explainError(question: string, options: string[], correctAnswer: string, wrongAnswer: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O aluno errou a seguinte questão: "${question}".
      As opções eram: [${options.join(', ')}].
      A resposta correta é: "${correctAnswer}".
      O aluno escolheu a resposta errada: "${wrongAnswer}".
      
      Por favor, atue como um professor especialista e explique:
      1. Por que a alternativa escolhida ("${wrongAnswer}") está incorreta (qual foi a provável confusão do aluno).
      2. Por que a alternativa correta ("${correctAnswer}") é a certa.
      3. Uma dica prática para não cometer esse erro novamente.
      
      Seja encorajador e didático. Retorne em formato Markdown estruturado.`,
    });
    return response.text;
  },

  async generateRoutine(targetExam: string, dailyHours: number, subjects: string[], level: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um cronograma semanal de estudos para o exame "${targetExam}". 
      O usuário tem ${dailyHours} horas por dia, estuda as matérias [${subjects.join(', ')}] e está no nível "${level}".
      Retorne um JSON com o cronograma diário, horas por matéria e sugestões de revisões/simulados.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetExam: { type: Type.STRING },
            dailyHours: { type: Type.NUMBER },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  subjects: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["day", "subjects"]
              }
            }
          },
          required: ["targetExam", "dailyHours", "schedule"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async suggestReview(topics: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O aluno errou questões sobre os seguintes assuntos: [${topics.join(', ')}].
      Atue como um professor especialista e sugira um plano de revisão rápido e prático para esses tópicos.
      Para cada tópico, forneça:
      1. O conceito central que ele precisa lembrar.
      2. Uma dica mnemônica ou macete.
      3. O que focar na próxima vez que for fazer exercícios desse assunto.
      
      Retorne em formato Markdown estruturado, sendo encorajador e direto ao ponto.`,
    });
    return response.text;
  },

  async feynmanCorrection(subject: string, explanation: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Avalie a seguinte explicação do usuário sobre o assunto "${subject}" usando o Método Feynman:
      "${explanation}"
      Identifique lacunas, erros conceituais e forneça uma explicação simplificada (como se fosse para uma criança).
      Retorne em Markdown.`,
    });
    return response.text;
  },

  async blurtingComparison(subject: string, userNotes: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compare as seguintes notas do usuário sobre "${subject}" com o conteúdo oficial esperado:
      "${userNotes}"
      Destaque o que ele esqueceu, o que está correto e o que precisa ser revisado com urgência.
      Retorne em Markdown.`,
    });
    return response.text;
  },

  async generateMindMap(topic: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um mapa mental para o tópico: ${topic}. 
      Retorne um JSON no formato: { "topic": "...", "nodes": [{ "label": "...", "subNodes": ["...", "..."] }] }. 
      Seja conciso e use termos técnicos.`,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text);
  },

  async generateExamPlan(examName: string, subjects: string[], date: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um plano de estudo estratégico para o exame "${examName}" que ocorrerá em ${date}. 
      As matérias cobradas são: [${subjects.join(', ')}]. 
      Gere um cronograma semanal detalhado até a data da prova, incluindo revisões, simulados e horas por dia.
      Retorne um JSON estruturado por semanas.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examName: { type: Type.STRING },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.NUMBER },
                  focus: { type: Type.STRING },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.STRING },
                        subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                        hours: { type: Type.NUMBER },
                        isReview: { type: Type.BOOLEAN },
                        isSimulado: { type: Type.BOOLEAN }
                      },
                      required: ["day", "subjects", "hours"]
                    }
                  }
                },
                required: ["weekNumber", "focus", "days"]
              }
            }
          },
          required: ["examName", "weeks"]
        }
      }
    });
    return JSON.parse(response.text);
  },
};
