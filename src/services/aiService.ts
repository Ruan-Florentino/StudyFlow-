import { GoogleGenAI, Type } from "@google/genai";
import { AI_MODELS, STUDIO_FLOW_SYSTEM_PROMPT, GEMINI_MODELS as _GEMINI_MODELS, GeminiModelKey } from "../config/aiModels";
import { useAIModel } from "../hooks/useAIModel";
import { STUDIO_FLOW_PROMPTS, PromptKey } from "../config/aiPrompts";
import { STUDY_AGENTS, AgentKey } from "../config/aiAgents";

let _ai: any = null;

const ai = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    if (!_ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      _ai = new GoogleGenAI({ apiKey });
    }
    return _ai[prop];
  }
});

// Configuration for retrocompatibility
const GEMINI_MODELS = {
  PRO: _GEMINI_MODELS.PRO.id,
  FAST: _GEMINI_MODELS.FLASH.id,
  FALLBACK: _GEMINI_MODELS.FLASH_2.id
};

/**
 * Base function for generating content, now calling Gemini SDK directly.
 * Handles system instructions and model routing.
 */
async function generateAIContent(args: {
  model?: string;
  systemInstruction?: string;
  prompt: string;
  history?: { role: 'user' | 'model'; parts: string | any }[];
  config?: any;
}) {
  const selectedModelId = useAIModel.getState().selectedModelId;
  const globalConfig = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];
  
  const modelId = args.model || globalConfig.apiModelId;
  
  // Build system instruction
  let systemInstruction = args.systemInstruction || STUDIO_FLOW_SYSTEM_PROMPT;
  if (systemInstruction && !systemInstruction.includes(STUDIO_FLOW_SYSTEM_PROMPT)) {
    systemInstruction = STUDIO_FLOW_SYSTEM_PROMPT + '\n\n---\n\n' + systemInstruction;
  }
  
  // Clean system instruction from "Gemini" mentions as per brand rules
  systemInstruction = systemInstruction.replace(/Gemini/ig, "Sage");

  try {
    const contents = (args.history || []).map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('model' as const),
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.parts }]
    }));

    // Add current prompt
    contents.push({
      role: 'user' as const,
      parts: [{ text: args.prompt }]
    });

    const response = await ai.models.generateContent({
      model: modelId,
      contents,
      config: {
        systemInstruction,
        maxOutputTokens: args.config?.maxOutputTokens,
        temperature: args.config?.temperature,
        topP: args.config?.topP,
        topK: args.config?.topK,
        responseMimeType: args.config?.responseMimeType,
        responseSchema: args.config?.responseSchema,
      },
    });

    return response.text || '';
  } catch (error: any) {
    console.error(`[AI SDK] Error with model ${modelId}:`, error);
    
    const isResourceExhausted = error?.message?.includes('429') || 
                                error?.message?.includes('RESOURCE_EXHAUSTED');

    // Attempt fallback logic
    let nextFallback: string | null = null;
    
    if (modelId === _GEMINI_MODELS.PRO.id) {
       nextFallback = _GEMINI_MODELS.FLASH.id;
    } else if (isResourceExhausted) {
       nextFallback = 'gemini-1.5-flash';
    }
    
    if (nextFallback && modelId !== nextFallback) {
        console.log(`[AI SDK] Attempting fallback to ${nextFallback}...`);
        try {
          return await generateAIContent({
            ...args,
            model: nextFallback
          });
        } catch (fallbackError: any) {
          console.error(`[AI SDK] Fallback to ${nextFallback} failed:`, fallbackError);
        }
    }
    
    if (isResourceExhausted) {
      throw new Error(`A IA está recebendo muitos pedidos no momento e atingiu o limite (Erro 429). Por favor, aguarde alguns minutos e tente novamente.`);
    }
    
    throw error;
  }
}

export async function chatWithAgent(
  agentKey: AgentKey,
  userMessage: string,
  history: { role: 'user' | 'model'; parts: string }[] = [],
  modelOverride?: GeminiModelKey
) {
  const agent = STUDY_AGENTS[agentKey];
  const modelKey = modelOverride || agent.model as GeminiModelKey;
  const modelConfig = _GEMINI_MODELS[modelKey];
  
  return await generateAIContent({
    model: modelConfig.id,
    systemInstruction: agent.systemPrompt,
    prompt: userMessage,
    history,
    config: {
      maxOutputTokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature,
    }
  });
}

export async function chatWithFallback(
  agentKey: AgentKey,
  userMessage: string,
  history: any[] = []
) {
  const fallbackChain: GeminiModelKey[] = ['PRO', 'FLASH', 'FLASH_2'];
  
  for (const modelKey of fallbackChain) {
    try {
      return await chatWithAgent(agentKey, userMessage, history, modelKey);
    } catch (error) {
      console.warn(`Modelo ${modelKey} falhou, tentando próximo...`, error);
    }
  }
  throw new Error('Todos os modelos falharam');
}

export type AIIntent = 'explanation' | 'plan' | 'questions' | 'summary' | 'map' | 'flashcards' | 'review' | 'chat' | 'image' | 'audio' | 'music' | 'slides';

export const aiService = {
  async routeRequest(message: string, intent: AIIntent) {
    const systemInstruction = `
      Você é a Sage, uma assistente de estudos premium, inteligente e objetiva.
      REGRAS DE OURO:
      1. NUNCA mencione Google, Gemini ou similares.
      2. Responda de forma CURTA, DIRETA e ESTRUTURADA.
    `;

    const text = await generateAIContent({
      model: GEMINI_MODELS.FAST,
      prompt: message,
      systemInstruction
    });

    return {
      text,
      engine: 'Sage Engine v3.1 Pro',
      intent
    };
  },

  async summarizeVideo(url: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Analise este vídeo (URL: ${url}) e forneça um resumo estruturado para estudos. Inclua JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            },
            studyTip: { type: Type.STRING }
          },
          required: ["summary", "topics", "flashcards", "studyTip"]
        }
      }
    });
    return JSON.parse(text);
  },

  async generateSmartRecommendation(history: any[], level: number) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Com base no histórico: ${JSON.stringify(history.slice(0, 20))} e nível ${level}, sugira a próxima ação.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            icon: { type: Type.STRING },
            actionTab: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["Alta", "Média", "Baixa"] }
          },
          required: ["title", "description", "icon", "actionTab", "priority"]
        }
      }
    });
    return JSON.parse(text);
  },

  async analyzeDocument(base64Data: string, mimeType: string) {
     const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Analise este documento e forneça um resumo estruturado para estudos. Inclua JSON.`,
      config: {
        contents: [{
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["summary", "topics", "flashcards"]
        }
      }
    });
    return JSON.parse(text);
  },

  async smartChat(message: string) {
    let intent: AIIntent = 'chat';
    const msg = message.toLowerCase();
    const selectedModel = useAIModel.getState().getSelectedModel();

    if (msg.startsWith('/mapa')) intent = 'map';
    else if (msg.startsWith('/resumo')) intent = 'summary';
    else if (msg.startsWith('/flashcards')) intent = 'flashcards';
    else if (msg.startsWith('/plano')) intent = 'plan';
    else if (selectedModel.category === 'image') intent = 'image';

    const cleanMessage = message.replace(/^\/\w+\s*/, '');
    
    if (intent === 'map') return { type: 'map', data: await this.generateMindMap(cleanMessage) };
    if (intent === 'flashcards') return { type: 'flashcards', data: await this.generateFlashcards(cleanMessage) };
    if (intent === 'plan') return { type: 'plan', data: await this.generateStudyPlan(cleanMessage) };
    
    const result = await this.routeRequest(message, intent);
    return { type: 'text', ...result };
  },

  async generateMindMap(topic: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere um mapa mental para: ${topic}`,
      config: { 
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  subNodes: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["label", "subNodes"]
              }
            }
          },
          required: ["topic", "nodes"]
        }
      }
    });
    return JSON.parse(text);
  },

  async generateFlashcards(content: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere 5 flashcards para: "${content}"`,
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
    return JSON.parse(text);
  },

  async generateStudyPlan(subject: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Plano de estudo para: "${subject}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            summary: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "duration", "difficulty", "description"]
              }
            }
          },
          required: ["subject", "tasks", "summary"]
        }
      }
    });
    return JSON.parse(text);
  },

  async explainQuestion(question: string, options: string[], correctAnswer: string) {
    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Explique: ${question}. Opções: ${options.join(", ")}. Correta: ${correctAnswer}.`
    });
  },

  async generateQuestions(topic: string, count: number = 5) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere ${count} questões sobre ${topic}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              pergunta: { type: Type.STRING },
              alternativas: { type: Type.ARRAY, items: { type: Type.STRING } },
              resposta: { type: Type.NUMBER },
              explicacao: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "pergunta", "alternativas", "resposta", "explicacao", "difficulty"]
          }
        }
      }
    });
    return JSON.parse(text);
  },

  async generateLearningPath(topic: string, config?: any) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Crie uma trilha de aprendizagem estruturada para: ${topic}`,
      config
    });
    return text;
  },

  async generateBossBattle(topic: string, config?: any) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere um "Boss Battle" de 5 questões épicas sobre: ${topic}. Retorne um JSON array de questões com {pergunta, alternativas[], resposta(index), explicacao}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pergunta: { type: Type.STRING },
              alternativas: { type: Type.ARRAY, items: { type: Type.STRING } },
              resposta: { type: Type.NUMBER },
              explicacao: { type: Type.STRING }
            },
            required: ["pergunta", "alternativas", "resposta", "explicacao"]
          }
        }
      }
    });
    return JSON.parse(text);
  },

  async suggestReview(topic: any, history: any = []) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.FAST,
      prompt: `Com base no histórico ${JSON.stringify(history)}, sugira uma estratégia de revisão para: ${JSON.stringify(topic)}`
    });
    return text;
  },

  async generateAudio(text: string, voice?: any) {
    console.log("[AI] Audio requested for:", text, "Voice:", voice);
    return null; 
  },

  async generatePodcastScript(content: any, config?: any) {
    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere um script de podcast educativo curto sobre: ${content}`,
      config
    });
  },

  async chat(message: any, history: any = []) {
    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: message,
      history: Array.isArray(history) ? history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.text })) : []
    });
  },

  async explainError(error: any, context: any, ...args: any[]) {
    return await generateAIContent({
      model: GEMINI_MODELS.FAST,
      prompt: `Explique o seguinte erro: ${error} no contexto: ${JSON.stringify(context)}. Dados adicionais: ${JSON.stringify(args)}`
    });
  },

  async generateMemoryAssociation(concept: string, config?: any) {
    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Crie uma associação mnemônica criativa para o conceito: ${concept}`,
      config
    });
  },

  async generateEssaySuggestions(title: string, content: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Sugira 3 melhorias específicas para a redação "${title}": ${content}. Retorne um array JSON de strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(text);
  },

  async generateContent(prompt: string, config?: any) {
    return await generateAIContent({
      prompt,
      config
    });
  },

  async generateExamPlan(examName: string, subjects: string[], date: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Crie um plano de estudo estratégico para o exame "${examName}" que ocorrerá em ${date}. 
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
    return JSON.parse(text);
  },

  async generateSlides(topic: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere o conteúdo para 5 slides sobre "${topic}". Retorne um JSON com título e tópicos para cada slide.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "content"]
          }
        }
      }
    });
    return JSON.parse(text);
  },

  async generateActiveRecall(topic: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere 5 perguntas curtas e diretas para praticar Active Recall sobre o tema: "${topic}". Retorne um JSON com as perguntas e as respostas ideais.`,
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
    return JSON.parse(text);
  },

  async generateInterleavingQuiz(subjects: string[]) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere um quiz de múltipla escolha misturando as seguintes matérias: ${subjects.join(', ')}. Gere 2 perguntas para cada matéria, misturadas aleatoriamente. Retorne um JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["subject", "question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(text);
  },

  async feynmanCorrection(topic: string, explanation: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `O aluno explicou o tópico "${topic}" da seguinte forma: "${explanation}". 
      Use a Técnica de Feynman para avaliar a explicação. Identifique lacunas, simplifique conceitos complexos e dê uma nota de 0 a 10 para a clareza.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            simplifications: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "feedback", "gaps", "simplifications"]
        }
      }
    });
    return JSON.parse(text);
  },

  async blurtingComparison(topic: string, studentNotes: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `O aluno fez um "blurting" (escreveu tudo o que lembrava) sobre "${topic}": "${studentNotes}". 
      Compare com o conteúdo ideal e identifique o que foi lembrado corretamente e o que foi esquecido ou está incorreto.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            remembered: { type: Type.ARRAY, items: { type: Type.STRING } },
            forgotten: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["feedback", "remembered", "forgotten"]
        }
      }
    });
    return JSON.parse(text);
  },

  async evaluateEssay(title: string, content: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Avalie a seguinte redação com o título "${title}": "${content}". 
      Avalie com base nas 5 competências do ENEM (200 pontos cada).
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            notaTotal: { type: Type.NUMBER },
            competencias: {
              type: Type.OBJECT,
              properties: {
                c1: { type: Type.OBJECT, properties: { nota: { type: Type.NUMBER }, comentario: { type: Type.STRING } }, required: ["nota", "comentario"] },
                c2: { type: Type.OBJECT, properties: { nota: { type: Type.NUMBER }, comentario: { type: Type.STRING } }, required: ["nota", "comentario"] },
                c3: { type: Type.OBJECT, properties: { nota: { type: Type.NUMBER }, comentario: { type: Type.STRING } }, required: ["nota", "comentario"] },
                c4: { type: Type.OBJECT, properties: { nota: { type: Type.NUMBER }, comentario: { type: Type.STRING } }, required: ["nota", "comentario"] },
                c5: { type: Type.OBJECT, properties: { nota: { type: Type.NUMBER }, comentario: { type: Type.STRING } }, required: ["nota", "comentario"] }
              },
              required: ["c1", "c2", "c3", "c4", "c5"]
            },
            pontosFortes: { type: Type.ARRAY, items: { type: Type.STRING } },
            pontosMelhoria: { type: Type.ARRAY, items: { type: Type.STRING } },
            feedbackGeral: { type: Type.STRING }
          },
          required: ["notaTotal", "competencias", "pontosFortes", "pontosMelhoria", "feedbackGeral"]
        }
      }
    });
    return JSON.parse(text);
  },

  async generateDailyChallenge() {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere uma questão de desafio diário para um estudante de alto nível. 
      A questão deve ser interdisciplinar, desafiadora e de um dos seguintes temas: Matemática, Física, Química, Biologia, História ou Geografia.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            prova: { type: Type.STRING },
            ano: { type: Type.NUMBER },
            materia: { type: Type.STRING },
            assunto: { type: Type.STRING },
            pergunta: { type: Type.STRING },
            alternativas: { type: Type.ARRAY, items: { type: Type.STRING } },
            resposta: { type: Type.NUMBER },
            explicacao: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Hard"] }
          },
          required: ["id", "prova", "ano", "materia", "assunto", "pergunta", "alternativas", "resposta", "explicacao", "difficulty"]
        }
      }
    });
    return JSON.parse(text);
  },

  async generateMastermindResponse(topic: string, history: any[], persona: 'skeptic' | 'creative' | 'logical') {
    const instructions = {
      skeptic: "Você é O Cético. Seu papel é questionar tudo, encontrar falhas, riscos e contra-argumentos. Seja crítico, mas construtivo.",
      creative: "Você é O Criativo. Seu papel é pensar fora da caixa, sugerir conexões inusitadas e metáforas.",
      logical: "Você é O Lógico. Seu papel é estruturar o pensamento, definir termos e focar em fatos."
    };

    const systemInstruction = `
      Persona: ${instructions[persona]}
      Tópico: "${topic}"
      REGRAS: Mantenha-se na persona, seja conciso (max 4 frases).
    `;

    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Como ${persona}, dê sua contribuição ao debate.`,
      history: history.map(h => ({ role: h.sender === 'user' ? 'user' : 'model', parts: h.text })),
      systemInstruction
    });
  },

  async findSemanticNode(query: string, nodes: any[]) {
    const prompt = `
      Identifique o ID do nó mais relacionado à busca: "${query}".
      Nós:
      ${nodes.map(n => `- ID: ${n.id}, Label: ${n.label}`).join('\n')}
      Retorne apenas o ID ou 'null'.
    `;

    const text = await generateAIContent({
      model: GEMINI_MODELS.FAST,
      prompt,
      systemInstruction: "Assistente de busca semântica. Retorne apenas o ID ou 'null'."
    });

    const result = text.trim().replace(/['"`]/g, '');
    return result === 'null' ? null : result;
  },

  async forgeConcepts(conceptA: string, conceptB: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Fundir os conceitos: "${conceptA}" e "${conceptB}" em uma nova teoria única.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theoryName: { type: Type.STRING },
            synthesis: { type: Type.STRING },
            applications: { type: Type.ARRAY, items: { type: Type.STRING } },
            complexity: { type: Type.STRING, enum: ["Baixa", "Média", "Alta", "Transcendental"] }
          },
          required: ["theoryName", "synthesis", "applications", "complexity"]
        }
      }
    });
    return JSON.parse(text);
  },

  async generateAlchemicalTransmutation(subjectA: string, subjectB: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Transmutação Alquímica: fundir "${subjectA}" e "${subjectB}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            forbiddenKnowledge: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            dangerLevel: { type: Type.NUMBER }
          },
          required: ["title", "description", "forbiddenKnowledge", "flashcards", "dangerLevel"]
        }
      }
    });

    return JSON.parse(text);
  },

  async generateOracleProphecy(name: string, level: number, prestige: number, topSubjects: [string, number][]) {
    const subjectsStr = topSubjects.map(([s, m]) => `${s} (${m.toFixed(1)}%)`).join(', ');
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Gere uma profecia para ${name} (Nível ${level}). Afinidades: ${subjectsStr}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prophecy: { type: Type.STRING },
            convergenceProbability: { type: Type.STRING },
            finalQuote: { type: Type.STRING }
          },
          required: ["prophecy", "convergenceProbability", "finalQuote"]
        }
      }
    });

    return JSON.parse(text);
  },

  async generateRoutine(target: string, hours: number, days: string[], level: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Crie um cronograma de estudo para ${target}, ${hours}h/dia, nos dias [${days.join(', ')}], nível ${level}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            target: { type: Type.STRING },
            weeklyHours: { type: Type.NUMBER },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  blocks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        subject: { type: Type.STRING },
                        duration: { type: Type.NUMBER },
                        type: { type: Type.STRING, enum: ["theory", "practice", "review"] }
                      },
                      required: ["subject", "duration", "type"]
                    }
                  }
                },
                required: ["day", "blocks"]
              }
            }
          },
          required: ["target", "schedule", "weeklyHours"]
        }
      }
    });
    return JSON.parse(text);
  },

  async processBrainUpload(textInput: string) {
    const text = await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: `Digerir o seguinte conhecimento: "${textInput.substring(0, 5000)}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            podcastTeaser: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          },
          required: ["summary", "keyConcepts", "podcastTeaser", "flashcards"]
        }
      }
    });
    return JSON.parse(text);
  },

  async socraticDebate(topic: string, message: string, history: any[]) {
    const systemInstruction = `
      Você é Sócrates. Seu objetivo é questionar as premissas do usuário sobre "${topic}" usando o método socrático.
      
      REGRAS DE OURO:
      1. Seja EXTREMAMENTE conciso. Máximo 2 sentenças curtas por resposta.
      2. NUNCA dê respostas prontas ou lições.
      3. Faça EXATAMENTE UMA pergunta provocativa por vez.
      4. Foque em expor contradições lógicas na argumentação do usuário.
      5. Estilo minimalista, direto e filosófico.
    `;
    
    return await generateAIContent({
      model: GEMINI_MODELS.PRO,
      prompt: message,
      history: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: h.text })),
      systemInstruction
    });
  },
};
