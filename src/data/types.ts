export interface Question {
  id: string;
  prova: string;
  ano: number;
  materia: string;
  assunto: string;
  pergunta: string;
  alternativas: string[];
  resposta: number;
  explicacao: string;
  imagem?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  accuracyRate?: number;
}
