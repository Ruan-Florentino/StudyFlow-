const Type = {
  OBJECT: "OBJECT",
  STRING: "STRING",
  ARRAY: "ARRAY",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
  INTEGER: "INTEGER",
} as const;

export type Schema = any;

// Schema: Correção de redação (5 competências ENEM)
export const REDACAO_CORRECTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    notaTotal: { type: Type.NUMBER },
    competencias: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          numero: { type: Type.NUMBER },
          nome: { type: Type.STRING },
          nota: { type: Type.NUMBER },
          comentario: { type: Type.STRING },
        },
        required: ['numero', 'nome', 'nota', 'comentario'],
      },
    },
    pontosFortes: { type: Type.ARRAY, items: { type: Type.STRING } },
    pontosFracos: { type: Type.ARRAY, items: { type: Type.STRING } },
    sugestoes:    { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['notaTotal', 'competencias', 'pontosFortes', 'pontosFracos', 'sugestoes'],
};

// Schema: Questões geradas
export const QUESTOES_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    questoes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          enunciado: { type: Type.STRING },
          alternativas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                letra:  { type: Type.STRING },
                texto:  { type: Type.STRING },
                correta:{ type: Type.BOOLEAN },
              },
              required: ['letra', 'texto', 'correta'],
            },
          },
          explicacao: { type: Type.STRING },
          dificuldade:{ type: Type.STRING },
          topico:     { type: Type.STRING },
        },
        required: ['enunciado', 'alternativas', 'explicacao', 'dificuldade', 'topico'],
      },
    },
  },
  required: ['questoes'],
};

// Schema: Flashcards
export const FLASHCARDS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          frente: { type: Type.STRING },
          verso:  { type: Type.STRING },
          tag:    { type: Type.STRING },
        },
        required: ['frente', 'verso'],
      },
    },
  },
  required: ['cards'],
};

// Schema: Plano de estudos
export const PLANO_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    semanas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          numero: { type: Type.NUMBER },
          foco:   { type: Type.STRING },
          dias: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dia:        { type: Type.STRING },
                materia:    { type: Type.STRING },
                topicos:    { type: Type.ARRAY, items: { type: Type.STRING } },
                duracaoMin: { type: Type.NUMBER },
              },
              required: ['dia', 'materia', 'topicos', 'duracaoMin'],
            },
          },
        },
        required: ['numero', 'foco', 'dias'],
      },
    },
  },
  required: ['semanas'],
};

// Schema: Mind map
export const MINDMAP_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    central: { type: Type.STRING },
    ramos: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          titulo:  { type: Type.STRING },
          subramos:{ type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['titulo', 'subramos'],
      },
    },
  },
  required: ['central', 'ramos'],
};
