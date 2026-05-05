
export const SUBJECTS = [
  {
    id: 'exatas',
    name: 'Ciências Exatas',
    icon: '📐',
    questions: 234,
    color: 'blue'
  },
  {
    id: 'linguagens',
    name: 'Linguagens',
    icon: '📚',
    questions: 189,
    color: 'amber'
  },
  {
    id: 'humanas',
    name: 'Ciências Humanas',
    icon: '🌍',
    questions: 156,
    color: 'orange'
  },
  {
    id: 'naturais',
    name: 'Ciências da Natureza',
    icon: '🧬',
    questions: 201,
    color: 'green'
  },
];

/** Trilhas fixas da secção Explorar (Rodada 1). */
export interface RecommendedTrail {
  id: string;
  title: string;
  description: string;
  topics: string[];
  durationLabel: string;
  level: string;
  icon: string;
  /** Navegação ao iniciar */
  startPath: string;
  navFilters: Record<string, string>;
}

export const RECOMMENDED_TRAILS: RecommendedTrail[] = [
  {
    id: 'enem-completo',
    title: 'ENEM Completo',
    description:
      'Linguagens, Matemática, Ciências da Natureza, Ciências Humanas e Redação numa progressão alinhada ao ENEM.',
    topics: ['Linguagens', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Redação'],
    durationLabel: '6 meses',
    level: 'Intermediário',
    icon: '🎓',
    startPath: '/questoes',
    navFilters: {},
  },
  {
    id: 'matematica-basica',
    title: 'Matemática Básica',
    description: 'Fundação numérica e álgebra essencial para vestibulares e ENEM.',
    topics: ['Aritmética', 'Frações', 'Porcentagem', 'Regra de 3', 'Equações 1º grau'],
    durationLabel: '2 meses',
    level: 'Iniciante',
    icon: '🔢',
    startPath: '/questoes',
    navFilters: { subject: 'Matemática' },
  },
  {
    id: 'redacao-1000',
    title: 'Redação Nota 1000',
    description: 'Competências, estrutura dissertativa e repertório para maximizar a nota.',
    topics: [
      'Estrutura dissertativa',
      'Competências ENEM',
      'Repertório sociocultural',
      'Argumentação',
      'Proposta de intervenção',
    ],
    durationLabel: '3 meses',
    level: 'Intermediário',
    icon: '✍️',
    startPath: '/redacao',
    navFilters: {},
  },
  {
    id: 'fisica-mecanica',
    title: 'Física Mecânica',
    description: 'Mecânica clássica com foco em cinemática, dinâmica e conservação.',
    topics: ['Cinemática', 'Dinâmica (Leis de Newton)', 'Energia', 'Trabalho', 'Momento linear'],
    durationLabel: '2 meses',
    level: 'Intermediário',
    icon: '⚛️',
    startPath: '/questoes',
    navFilters: { subject: 'Ciências da Natureza' },
  },
];

/** Mapa área → subtópicos para o sorteio em dois níveis (sem números inventados). */
export const SUBTOPIC_SURPRISE: Record<string, string[]> = {
  'Geografia Humana': [
    'Urbanização brasileira',
    'Migrações internacionais',
    'Globalização e desigualdade',
    'Geopolítica do Oriente Médio',
    'Demografia: pirâmides etárias',
  ],
  Cultura: [
    'Movimento Modernista (1922)',
    'Barroco no Brasil',
    'Cinema Novo',
    'Tropicália',
    'Literatura de Cordel',
  ],
  Biologia: [
    'Ciclo de Krebs',
    'Mitose vs meiose',
    'Sistema imunológico',
    'Ecologia: cadeias tróficas',
    'Genética mendeliana',
  ],
  Matemática: [
    'Funções afim e quadrática',
    'Geometria analítica',
    'Probabilidade condicional',
    'Progressões',
    'Logaritmos aplicados',
  ],
  Química: [
    'Ligações químicas',
    'Estequiometria',
    'Equilíbrio químico',
    'Termoquímica',
    'Eletroquímica',
  ],
  Física: [
    'Movimento uniforme e variado',
    'Leis de Newton',
    'Trabalho e energia cinética',
    'Colisões e momento',
    'Gravitação',
  ],
  História: [
    'Brasil República Velha',
    'Revolução Francesa',
    'Guerra Fria',
    'Independências na América Latina',
    'Processo de industrialização',
  ],
  Filosofia: [
    'Contratualismo (Hobbes, Locke, Rousseau)',
    'Moral kantiana',
    'Existencialismo',
    'Epistemologia',
    'Estética',
  ],
  Literatura: [
    'Quinhentismo',
    'Arcadismo',
    'Romantismo brasileiro',
    'Realismo / Naturalismo',
    'Pós-modernidade literária',
  ],
  Sociologia: [
    'Movimentos sociais',
    'Cultura de massa',
    'Desigualdades de classe e raça',
    'Trabalho e capital',
    'Cidadania',
  ],
};

export const POPULAR_NOW = [
  { id: 1, type: 'simulado', name: 'Simulado de Matemática', subject: 'Matemática' },
  { id: 2, type: 'questoes', name: 'Questões de Redação', subject: 'Linguagens' },
  { id: 3, type: 'revisao', name: 'Revisão de História', subject: 'Ciências Humanas' },
];
