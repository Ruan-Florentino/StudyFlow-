import { GoogleGenAI, Type, Modality } from "@google/genai";
import { safeStringify } from "../lib/firebase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export type AIIntent = 'explanation' | 'plan' | 'questions' | 'summary' | 'map' | 'flashcards' | 'review' | 'chat' | 'image' | 'audio' | 'music' | 'slides';

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
      engine: 'StudyFlow AI v3.1 Pro',
      intent
    };
  },

  async summarizeVideo(url: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Analise este vídeo (URL: ${url}) e forneça um resumo estruturado para estudos. 
      Inclua:
      1. Resumo Geral (1 parágrafo)
      2. Tópicos Principais (Bullet points)
      3. 3 Flashcards (Pergunta/Resposta)
      4. Conclusão/Dica de Estudo.
      Retorne um JSON estruturado.`,
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
    return JSON.parse(response.text);
  },

  async generateSmartRecommendation(history: any[], level: number) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Com base no histórico de questões do aluno: ${safeStringify(history.slice(0, 20))} e nível ${level}, sugira a PRÓXIMA melhor ação de estudo.
      Pode ser: revisar um tópico específico, fazer um simulado de uma matéria onde ele está fraco, ou aprender um novo conceito avançado.
      Retorne um JSON com título, descrição, ícone (lucide) e a rota/tab sugerida.`,
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
    return JSON.parse(response.text);
  },

  async analyzeDocument(base64Data: string, mimeType: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `Analise este documento e forneça um resumo estruturado para estudos. 
            Inclua:
            1. Resumo Geral (1 parágrafo)
            2. Tópicos Principais (Bullet points)
            3. 5 Flashcards (Pergunta/Resposta) extraídos do conteúdo.
            Retorne um JSON estruturado.`
          }
        ]
      },
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
            }
          },
          required: ["summary", "topics", "flashcards"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateLearningPath(subject: string, currentLevel: number) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Crie um roteiro de aprendizagem adaptativo para a matéria "${subject}". 
      O aluno está no nível ${currentLevel}. 
      O roteiro deve ter 5 marcos (milestones), do básico ao avançado.
      Cada marco deve ter um título, uma breve descrição e um "desafio de maestria".
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  masteryChallenge: { type: Type.STRING },
                  isCompleted: { type: Type.BOOLEAN }
                },
                required: ["id", "title", "description", "masteryChallenge"]
              }
            }
          },
          required: ["subject", "milestones"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateMemoryAssociation(concept: string, roomName: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Crie uma associação mnemônica BIZARRA, VÍVIDA e ABSURDA para o conceito "${concept}" situado no cômodo "${roomName}".
      A técnica do Palácio da Memória exige que a imagem seja o mais inusitada possível para fixar na memória.
      Descreva a cena em 1 ou 2 frases curtas. Não explique o conceito, apenas crie a cena visual.`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text;
  },

  async generateBossBattle(subject: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere um "Boss Battle" (Batalha de Chefe) para a matéria "${subject}". 
      Consiste em 5 questões de nível EXTREMAMENTE DIFÍCIL (estilo ITA/IME ou Olimpíadas).
      Retorne um JSON estruturado com as questões.`,
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
              explicacao: { type: Type.STRING }
            },
            required: ["id", "pergunta", "alternativas", "resposta", "explicacao"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async analyzeEssay(content: string, theme: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Analise esta redação sobre o tema "${theme}": "${content}". 
      Avalie de 0 a 100 em: estrutura, clareza e vocabulário. 
      Forneça um feedback construtivo.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structure: { type: Type.NUMBER },
            clarity: { type: Type.NUMBER },
            vocabulary: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["structure", "clarity", "vocabulary", "feedback"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateEssaySuggestions(content: string, theme: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Dê 3 sugestões imediatas para melhorar esta redação (tema: ${theme}): "${content}". 
      Retorne um JSON com uma lista de sugestões, cada uma com texto e tipo (style, grammar, idea).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["style", "grammar", "idea"] }
            },
            required: ["id", "text", "type"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generatePodcastScript(content: string, subject: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Transforme este conteúdo de ${subject} em um roteiro de podcast curto e envolvente (máximo 2 minutos de fala). 
      Use uma linguagem natural e didática. 
      Conteúdo: ${content}`,
    });
    return response.text;
  },

  async processBrainUpload(text: string) {
    try {
      const prompt = `Você é uma IA de "Upload Cerebral". O usuário forneceu o seguinte material de estudo:
"${text.substring(0, 5000)}"

Sua tarefa é processar esse material e criar um ecossistema de estudos completo.
Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "summary": "Um resumo executivo de alto nível (max 3 parágrafos)",
  "keyConcepts": ["Conceito 1", "Conceito 2", "Conceito 3"],
  "flashcards": [
    { "front": "Pergunta ou conceito", "back": "Resposta ou definição" }
  ],
  "podcastTeaser": "Um roteiro curto (2 falas) de um podcast introduzindo o tema",
  "quiz": [
    { "question": "Pergunta de múltipla escolha", "options": ["A", "B", "C", "D"], "correctAnswer": 0 }
  ]
}`;

      const result = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt
      });
      const response = result.text;
      const jsonStr = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Erro no Brain Upload:", error);
      throw error;
    }
  },

  async socraticDebate(topic: string, userMessage: string, history: any[]) {
    const systemInstruction = `
      Você é um Tutor Socrático IMPLACÁVEL. Seu objetivo não é dar a resposta, mas sim questionar as premissas do aluno sobre o tema "${topic}".
      Faça perguntas difíceis, aponte falhas lógicas e force o aluno a pensar profundamente.
      Seja curto, incisivo e desafiador. Máximo de 3 frases por resposta. Termine sempre com uma pergunta provocativa.
    `;
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: { systemInstruction }
    });
    
    // We simulate history by sending it all at once for simplicity in this stateless call, 
    // or we can just send the latest message with context.
    const context = history.map(h => `${h.role === 'user' ? 'Aluno' : 'Tutor'}: ${h.text}`).join('\n');
    const prompt = `Histórico:\n${context}\n\nAluno: ${userMessage}\n\nResponda como o Tutor Socrático:`;
    
    const response = await chat.sendMessage({ message: prompt });
    return response.text;
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
    else if (msg.startsWith('/imagem') || msg.includes('gere uma imagem') || msg.includes('gerar imagem')) intent = 'image';
    else if (msg.startsWith('/audio') || msg.includes('gere um áudio') || msg.includes('fale isso')) intent = 'audio';
    else if (msg.startsWith('/musica') || msg.includes('gere uma música')) intent = 'music';
    else if (msg.startsWith('/slides') || msg.includes('gere slides')) intent = 'slides';
    else if (msg.includes('explique') || msg.includes('o que é') || msg.includes('como funciona')) intent = 'explanation';
    else if (msg.includes('plano') || msg.includes('cronograma') || msg.includes('estudar')) intent = 'plan';
    else if (msg.includes('resumo') || msg.includes('resumir')) intent = 'summary';

    // Handle Commands specifically if needed, or just route
    const cleanMessage = message.replace(/^\/\w+\s*/, '');
    
    // For specific commands that need JSON output, we use specialized methods
    if (intent === 'map') return { type: 'map', data: await this.generateMindMap(cleanMessage) };
    if (intent === 'flashcards') return { type: 'flashcards', data: await this.generateFlashcards(cleanMessage) };
    if (intent === 'plan') return { type: 'plan', data: await this.generateStudyPlan(cleanMessage) };
    if (intent === 'image') return { type: 'image', data: await this.generateImage(cleanMessage) };
    if (intent === 'audio') return { type: 'audio', data: await this.generateAudio(cleanMessage) };
    if (intent === 'music') return { type: 'music', data: await this.generateMusic(cleanMessage) };
    if (intent === 'slides') return { type: 'slides', data: await this.generateSlides(cleanMessage) };
    
    if (intent === 'summary') {
      const summary = await this.summarizeContent(cleanMessage);
      return { type: 'text', text: summary, engine: 'StudyFlow AI v3.1 Pro', intent };
    }
    
    if (intent === 'review') {
      const explanation = await this.suggestReview(cleanMessage.split(',').map(s => s.trim()));
      return { type: 'text', text: explanation, engine: 'StudyFlow AI v3.1 Pro', intent };
    }

    if (msg.includes('questões') || msg.includes('exercícios') || msg.startsWith('/questoes')) {
      return { 
        type: 'text', 
        text: "Nosso banco de questões agora é composto exclusivamente por questões REAIS de exames como ENEM, ITA, IME e outros. Você pode acessá-lo diretamente na aba 'Banco de Questões' para treinar com o material oficial!",
        engine: 'StudyFlow AI v3.1 Pro',
        intent: 'chat'
      };
    }

    // Default to routed chat
    const result = await this.routeRequest(message, intent);
    return { type: 'text', ...result };
  },

  async generateStudyPlan(subject: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Você é um estrategista de aprendizagem. Crie um plano de estudo otimizado para o assunto: "${subject}". 
      O plano deve ser realista, focado em retenção de longo prazo e incluir uma mistura de teoria e prática.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Breve resumo da estratégia do plano" },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                  description: { type: Type.STRING, description: "O que fazer exatamente nesta tarefa" }
                },
                required: ["title", "duration", "difficulty", "description"]
              }
            }
          },
          required: ["subject", "tasks", "summary"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateFlashcards(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Você é um especialista em Repetição Espaçada (Anki). 
      Gere 5 flashcards de alta qualidade baseados no seguinte conteúdo: "${content}". 
      Siga o Princípio de Formulação de Conhecimento: cards atômicos, perguntas claras e respostas diretas.
      Retorne apenas o JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING, description: "Breve contexto adicional para o verso do card" }
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

  async generateContent(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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

    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async explainQuestion(question: string, options: string[], correctAnswer: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
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
      model: "gemini-3.1-pro-preview",
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

  async generateRoutine(targetExam: string, dailyHours: number, days: string[], level: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Crie um cronograma semanal de estudos para o exame "${targetExam}". 
      O usuário tem ${dailyHours} horas por dia, estuda nos dias [${days.join(', ')}] e está no nível "${level}".
      Retorne um JSON com o cronograma diário, dividindo as horas em blocos de estudo (theory, practice, review) com a duração em minutos para cada matéria.`,
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
          required: ["target", "weeklyHours", "schedule"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async suggestReview(topics: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
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

  async generateMindMap(topic: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Gere um mapa mental para o tópico: ${topic}. 
      Retorne um JSON estruturado. Seja conciso e use termos técnicos.`,
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
    return JSON.parse(response.text);
  },

  async generateQuestions(topic: string, count: number = 5) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere ${count} questões de múltipla escolha sobre "${topic}". 
      As questões devem ser de nível vestibular/concurso.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              prova: { type: Type.STRING },
              ano: { type: Type.NUMBER },
              materia: { type: Type.STRING },
              assunto: { type: Type.STRING },
              pergunta: { type: Type.STRING },
              alternativas: { type: Type.ARRAY, items: { type: Type.STRING } },
              resposta: { type: Type.NUMBER, description: "Índice da alternativa correta (0-4)" },
              explicacao: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["id", "prova", "ano", "materia", "assunto", "pergunta", "alternativas", "resposta", "explicacao", "difficulty"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateExamPlan(examName: string, subjects: string[], date: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
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

  async generateImage(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A highly detailed educational illustration about: ${prompt}. Professional, clean, 4k.` }],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async generateAudio(text: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and educationally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  },

  async generateMusic(prompt: string) {
    // Note: This is a stream in reality, but we'll adapt for a simpler call if possible or mock the URL
    // For now, let's use a placeholder logic or the real one if we can accumulate
    const response = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: `Generate a 30-second background study track: ${prompt}`,
      config: {
        responseModalities: [Modality.AUDIO],
      }
    });
    let audioBase64 = "";
    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          audioBase64 += part.inlineData.data;
        }
      }
    }
    return audioBase64;
  },

  async generateSlides(topic: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere o conteúdo para 5 slides sobre "${topic}". Retorne um JSON com título e tópicos para cada slide.`,
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
    return JSON.parse(response.text);
  },

  async generateActiveRecall(topic: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere 5 perguntas curtas e diretas para praticar Active Recall sobre o tema: "${topic}". Retorne um JSON com as perguntas e as respostas ideais.`,
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

  async generateInterleavingQuiz(subjects: string[]) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere um quiz de múltipla escolha misturando as seguintes matérias: ${subjects.join(', ')}. Gere 2 perguntas para cada matéria, misturadas aleatoriamente. Retorne um JSON.`,
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
    return JSON.parse(response.text);
  },

  async feynmanCorrection(topic: string, explanation: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `O aluno explicou o tópico "${topic}" da seguinte forma: "${explanation}". 
      Use a Técnica de Feynman para avaliar a explicação. Identifique lacunas, simplifique conceitos complexos e dê uma nota de 0 a 10 para a clareza.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING, description: "Feedback geral usando a técnica de Feynman" },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lacunas identificadas na explicação" },
            simplifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sugestões de simplificação" }
          },
          required: ["score", "feedback", "gaps", "simplifications"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async blurtingComparison(topic: string, studentNotes: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `O aluno fez um "blurting" (escreveu tudo o que lembrava) sobre "${topic}": "${studentNotes}". 
      Compare com o conteúdo ideal e identifique o que foi lembrado corretamente e o que foi esquecido ou está incorreto.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING, description: "Análise geral do desempenho" },
            remembered: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pontos que o aluno lembrou corretamente" },
            forgotten: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Pontos importantes que foram esquecidos" }
          },
          required: ["feedback", "remembered", "forgotten"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async evaluateEssay(title: string, content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Avalie a seguinte redação com o título "${title}": "${content}". 
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
    return JSON.parse(response.text);
  },

  async generateDailyChallenge() {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Gere uma questão de desafio diário para um estudante de alto nível. 
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
            resposta: { type: Type.NUMBER, description: "Índice da alternativa correta (0-4)" },
            explicacao: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Hard"] }
          },
          required: ["id", "prova", "ano", "materia", "assunto", "pergunta", "alternativas", "resposta", "explicacao", "difficulty"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateMastermindResponse(topic: string, history: any[], persona: 'skeptic' | 'creative' | 'logical') {
    const instructions = {
      skeptic: "Você é O Cético. Seu papel é questionar tudo, encontrar falhas, riscos e contra-argumentos. Seja crítico, mas construtivo. Use uma linguagem direta e um pouco ácida.",
      creative: "Você é O Criativo. Seu papel é pensar fora da caixa, sugerir conexões inusitadas, metáforas e aplicações práticas inovadoras. Seja entusiasmado e visionário.",
      logical: "Você é O Lógico. Seu papel é estruturar o pensamento, definir termos, estabelecer relações de causa e efeito e manter a discussão focada em fatos e dados. Seja analítico e preciso."
    };

    const systemInstruction = `
      Você faz parte de um Grupo Mastermind de elite. O tópico em discussão é: "${topic}".
      Sua persona é: ${instructions[persona]}
      
      REGRAS:
      1. Mantenha-se estritamente na sua persona.
      2. Responda ao que foi dito anteriormente no histórico, se houver.
      3. Seja conciso (máximo 4 frases).
      4. Use Markdown para ênfase.
    `;

    const context = history.map(h => `${h.sender === 'user' ? 'Usuário' : h.sender}: ${h.text}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Histórico da Discussão:\n${context}\n\nAgora, como ${persona}, dê sua contribuição:`,
      config: { systemInstruction }
    });

    return response.text;
  },

  async findSemanticNode(query: string, nodes: any[]) {
    const prompt = `
      Dada a lista de tópicos de estudo (nós) abaixo e a busca do usuário, identifique qual nó é o mais semanticamente relacionado.
      Retorne APENAS o ID do nó. Se nenhum for relevante, retorne "null".

      Nós:
      ${nodes.map(n => `- ID: ${n.id}, Label: ${n.label}`).join('\n')}

      Busca: "${query}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um assistente de busca semântica. Retorne apenas o ID solicitado ou 'null'."
      }
    });

    const text = response.text.trim().replace(/['"`]/g, '');
    return text === 'null' ? null : text;
  },

  async forgeConcepts(conceptA: string, conceptB: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Fundir os seguintes conceitos: "${conceptA}" e "${conceptB}". 
      Crie uma "Teoria Híbrida" única que explique um através do outro ou crie algo totalmente novo a partir da intersecção.
      Retorne um JSON estruturado.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theoryName: { type: Type.STRING, description: "Nome da nova teoria híbrida" },
            synthesis: { type: Type.STRING, description: "Explicação detalhada da fusão" },
            applications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Aplicações práticas desta nova visão" },
            complexity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Transcendental"] }
          },
          required: ["theoryName", "synthesis", "applications", "complexity"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateAlchemicalTransmutation(subjectA: string, subjectB: string) {
    const prompt = `
      Você é o Alquimista Neural. Sua tarefa é realizar uma "Transmutação Proibida" fundindo dois tópicos de estudo aparentemente não relacionados em um conceito novo, fascinante e "proibido".
      
      Tópico A: "${subjectA}"
      Tópico B: "${subjectB}"
      
      Gere um JSON estruturado com:
      1. title: Um nome épico para o novo conceito híbrido.
      2. description: Uma explicação de como esses dois mundos se fundem (máximo 3 frases).
      3. forbiddenKnowledge: Um segredo ou insight profundo que surge dessa fusão.
      4. flashcards: Um array de 3 objetos { question, answer } que testam o entendimento desse novo conceito.
      5. dangerLevel: Uma porcentagem de 0 a 100 de "instabilidade cognitiva".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
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

    return JSON.parse(response.text);
  },

  async generateOracleProphecy(name: string, level: number, prestige: number, topSubjects: [string, number][]) {
    const subjectsStr = topSubjects.map(([s, m]) => `${s} (Maestria: ${m.toFixed(1)}%)`).join(', ');
    
    const prompt = `
      Você é "A Oráculo", uma entidade transcendental que analisa o destino de estudantes.
      O estudante se chama "${name}", está no Nível ${level} com ${prestige} ciclos de Prestígio Cósmico.
      Suas maiores afinidades são: ${subjectsStr || 'Ainda em descoberta'}.
      
      Gere uma "Profecia do Arquiteto" personalizada e enigmática. A profecia deve:
      1. Reconhecer o esforço e o nível do estudante.
      2. Fazer uma previsão poética e filosófica sobre o futuro dele nas áreas de maior afinidade.
      3. Terminar com uma "Probabilidade de Convergência" (ex: 99.99%) e uma citação filosófica final.
      
      Retorne um JSON estruturado:
      {
        "prophecy": "A profecia principal (2 a 3 frases de impacto)",
        "convergenceProbability": "Uma porcentagem (ex: 99.8%)",
        "finalQuote": "Uma citação filosófica inventada sobre conhecimento e destino"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
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

    return JSON.parse(response.text);
  }
};

