
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
}

export const TOPICS: Record<string, string[]> = {
  'Matemática': ['Álgebra', 'Geometria', 'Trigonometria', 'Estatística', 'Probabilidade', 'Funções', 'Aritmética', 'Logaritmos', 'Matrizes'],
  'Português': ['Gramática', 'Interpretação de Texto', 'Literatura', 'Redação', 'Sintaxe', 'Morfologia', 'Figuras de Linguagem'],
  'Física': ['Mecânica', 'Termodinâmica', 'Óptica', 'Eletromagnetismo', 'Ondulatória', 'Cinemática', 'Dinâmica', 'Hidrostática'],
  'Química': ['Química Orgânica', 'Química Inorgânica', 'Físico-Química', 'Atomística', 'Estequiometria', 'Termoquímica'],
  'Biologia': ['Citologia', 'Genética', 'Ecologia', 'Fisiologia', 'Botânica', 'Zoologia', 'Evolução', 'Bioquímica'],
  'História': ['Brasil Colônia', 'Brasil Império', 'Brasil República', 'História Geral', 'Antiguidade', 'Idade Média', 'Idade Moderna', 'Idade Contemporânea'],
  'Geografia': ['Geografia Física', 'Geografia Humana', 'Geopolítica', 'Meio Ambiente', 'Geografia do Brasil', 'Cartografia'],
  'Filosofia': ['Filosofia Antiga', 'Filosofia Moderna', 'Ética', 'Lógica', 'Filosofia Política'],
  'Sociologia': ['Cultura', 'Trabalho', 'Movimentos Sociais', 'Estado', 'Desigualdade Social'],
  'Inglês': ['Interpretação de Texto', 'Gramática', 'Vocabulário']
};

export const EXAM_STATS = {
  'ENEM': 5280,
  'ITA': 1432,
  'IME': 1215,
  'ESA': 845,
  'EsPCEx': 912,
  'Fuvest': 1120,
  'Unicamp': 980,
  'Unesp': 850,
  'Vestibulares': 3150,
  'Concursos': 2400
};

export const ALL_QUESTIONS: Question[] = [
  // ENEM
  {
    id: 'enem-2023-mat-1',
    prova: 'ENEM',
    ano: 2023,
    materia: 'Matemática',
    assunto: 'Aritmética',
    pergunta: 'Um estudante de matemática observa que a soma de três números inteiros consecutivos é igual a 72. Qual é o maior desses números?',
    alternativas: ['23', '24', '25', '26', '27'],
    resposta: 2,
    explicacao: 'Se os números são x, x+1 e x+2, então x + (x+1) + (x+2) = 72 => 3x + 3 = 72 => 3x = 69 => x = 23. O maior é x+2 = 25.',
    difficulty: 'Easy'
  },
  {
    id: 'enem-2022-fis-1',
    prova: 'ENEM',
    ano: 2022,
    materia: 'Física',
    assunto: 'Cinemática',
    pergunta: 'Em um experimento de física, um objeto é lançado verticalmente para cima com uma velocidade inicial de 20 m/s. Considerando g = 10 m/s², qual a altura máxima atingida?',
    alternativas: ['10m', '15m', '20m', '25m', '30m'],
    resposta: 2,
    explicacao: 'v² = v0² - 2gh. Na altura máxima v=0. 0 = 20² - 2(10)h => 20h = 400 => h = 20m.',
    difficulty: 'Medium'
  },
  {
    id: 'enem-2021-lit-1',
    prova: 'ENEM',
    ano: 2021,
    materia: 'Português',
    assunto: 'Literatura',
    pergunta: 'O Modernismo no Brasil teve seu marco inicial na Semana de Arte Moderna de 1922. Qual autor é considerado um dos principais expoentes da primeira fase modernista?',
    alternativas: ['Machado de Assis', 'Guimarães Rosa', 'Oswald de Andrade', 'Clarice Lispector', 'Jorge Amado'],
    resposta: 2,
    explicacao: 'Oswald de Andrade foi um dos líderes da Semana de 22 e da primeira fase do Modernismo.',
    difficulty: 'Easy'
  },
  // ITA
  {
    id: 'ita-2022-fis-1',
    prova: 'ITA',
    ano: 2022,
    materia: 'Física',
    assunto: 'Cinemática',
    pergunta: 'Um projétil é lançado com velocidade v0 fazendo um ângulo θ com a horizontal. Desprezando a resistência do ar, o alcance máximo horizontal ocorre quando θ é:',
    alternativas: ['30°', '45°', '60°', '75°', '90°'],
    resposta: 1,
    explicacao: 'O alcance horizontal R é dado por R = (v0² * sin(2θ)) / g. O valor máximo de sin(2θ) é 1, que ocorre quando 2θ = 90°, ou seja, θ = 45°.',
    difficulty: 'Medium'
  },
  // IME
  {
    id: 'ime-2021-mat-1',
    prova: 'IME',
    ano: 2021,
    materia: 'Matemática',
    assunto: 'Geometria',
    pergunta: 'Determine o volume de um tetraedro regular cuja aresta mede "a".',
    alternativas: ['(a³√2)/12', '(a³√3)/12', '(a³√2)/4', '(a³√3)/4', '(a³√6)/12'],
    resposta: 0,
    explicacao: 'A fórmula do volume de um tetraedro regular de aresta a é V = (a³√2)/12.',
    difficulty: 'Hard'
  },
  // EsPCEx
  {
    id: 'espcex-2023-mat-1',
    prova: 'EsPCEx',
    ano: 2023,
    materia: 'Matemática',
    assunto: 'Funções',
    pergunta: 'Seja f(x) = ax + b uma função do primeiro grau. Se f(1) = 5 e f(3) = 11, então o valor de a + b é:',
    alternativas: ['3', '5', '7', '8', '10'],
    resposta: 1,
    explicacao: 'f(1) = a + b = 5. f(3) = 3a + b = 11. Subtraindo: 2a = 6 => a = 3. Então 3 + b = 5 => b = 2. a + b = 3 + 2 = 5.',
    difficulty: 'Medium'
  },
  // ESA
  {
    id: 'esa-2022-por-1',
    prova: 'ESA',
    ano: 2022,
    materia: 'Português',
    assunto: 'Gramática',
    pergunta: 'Assinale a alternativa em que a palavra é acentuada pela mesma regra de "exército":',
    alternativas: ['café', 'história', 'página', 'baú', 'também'],
    resposta: 2,
    explicacao: '"Exército" é proparoxítona. "Página" também é proparoxítona.',
    difficulty: 'Easy'
  },
  // Fuvest
  {
    id: 'fuvest-2023-bio-1',
    prova: 'Fuvest',
    ano: 2023,
    materia: 'Biologia',
    assunto: 'Genética',
    pergunta: 'Em uma espécie de planta, a cor das flores é determinada por um par de alelos com dominância completa. Flores vermelhas (V) são dominantes sobre flores brancas (v). Se cruzarmos duas plantas heterozigotas, qual a proporção fenotípica esperada?',
    alternativas: ['1:1', '3:1', '1:2:1', '9:3:3:1', '100% vermelhas'],
    resposta: 1,
    explicacao: 'Cruzamento Vv x Vv resulta em VV, Vv, Vv, vv. Fenotipicamente: 3 vermelhas para 1 branca.',
    difficulty: 'Medium'
  },
  // Unicamp
  {
    id: 'unicamp-2022-his-1',
    prova: 'Unicamp',
    ano: 2022,
    materia: 'História',
    assunto: 'História Geral',
    pergunta: 'A Revolução Industrial teve início na Inglaterra no século XVIII. Qual foi o principal combustível utilizado nas máquinas a vapor desse período?',
    alternativas: ['Petróleo', 'Eletricidade', 'Carvão Mineral', 'Madeira', 'Gás Natural'],
    resposta: 2,
    explicacao: 'O carvão mineral foi a principal fonte de energia da Primeira Revolução Industrial.',
    difficulty: 'Easy'
  },
  // Unesp
  {
    id: 'unesp-2021-qui-1',
    prova: 'Unesp',
    ano: 2021,
    materia: 'Química',
    assunto: 'Química Orgânica',
    pergunta: 'O composto orgânico metano (CH4) é o principal componente do gás natural. Qual a geometria molecular do metano?',
    alternativas: ['Linear', 'Angular', 'Trigonal Plana', 'Tetraédrica', 'Piramidal'],
    resposta: 3,
    explicacao: 'O carbono no metano faz 4 ligações simples, resultando em uma geometria tetraédrica.',
    difficulty: 'Easy'
  },
  // More ENEM
  {
    id: 'enem-2020-mat-1',
    prova: 'ENEM',
    ano: 2020,
    materia: 'Matemática',
    assunto: 'Probabilidade',
    pergunta: 'Qual a probabilidade de obter um número par ao lançar um dado comum de 6 faces?',
    alternativas: ['1/6', '1/3', '1/2', '2/3', '5/6'],
    resposta: 2,
    explicacao: 'Os números pares são {2, 4, 6}. Total de faces = 6. Probabilidade = 3/6 = 1/2.',
    difficulty: 'Easy'
  },
  {
    id: 'enem-2019-por-1',
    prova: 'ENEM',
    ano: 2019,
    materia: 'Português',
    assunto: 'Interpretação de Texto',
    pergunta: 'A função predominante da linguagem em um texto que busca convencer o leitor a adotar um comportamento é:',
    alternativas: ['Referencial', 'Emotiva', 'Conativa', 'Metalinguística', 'Fática'],
    resposta: 2,
    explicacao: 'A função conativa (ou apelativa) foca no receptor, buscando influenciar seu comportamento.',
    difficulty: 'Medium'
  },
  {
    id: 'enem-2018-his-1',
    prova: 'ENEM',
    ano: 2018,
    materia: 'História',
    assunto: 'Brasil Império',
    pergunta: 'O Segundo Reinado no Brasil (1840-1889) foi marcado pela estabilidade política sob o comando de D. Pedro II. Qual foi o principal produto de exportação nesse período?',
    alternativas: ['Açúcar', 'Ouro', 'Café', 'Borracha', 'Algodão'],
    resposta: 2,
    explicacao: 'O café foi o motor da economy brasileira durante o Segundo Reinado.',
    difficulty: 'Easy'
  },
  // More ITA
  {
    id: 'ita-2021-mat-1',
    prova: 'ITA',
    ano: 2021,
    materia: 'Matemática',
    assunto: 'Logaritmos',
    pergunta: 'Se log(x) + log(x-3) = 1, então o valor de x é:',
    alternativas: ['2', '5', '10', '1', '4'],
    resposta: 1,
    explicacao: 'log(x(x-3)) = 1 => x² - 3x = 10 => x² - 3x - 10 = 0. (x-5)(x+2) = 0. Como x > 3, x = 5.',
    difficulty: 'Hard'
  },
  // More IME
  {
    id: 'ime-2020-qui-1',
    prova: 'IME',
    ano: 2020,
    materia: 'Química',
    assunto: 'Físico-Química',
    pergunta: 'Qual a concentração molar de uma solução preparada dissolvendo 40g de NaOH em água até completar 500mL? (Na=23, O=16, H=1)',
    alternativas: ['1M', '2M', '0.5M', '4M', '0.2M'],
    resposta: 1,
    explicacao: 'Massa molar NaOH = 40g/mol. n = 40/40 = 1 mol. V = 0.5L. M = 1/0.5 = 2M.',
    difficulty: 'Medium'
  },
  // More EsPCEx
  {
    id: 'espcex-2022-his-1',
    prova: 'EsPCEx',
    ano: 2022,
    materia: 'História',
    assunto: 'Brasil Colônia',
    pergunta: 'O Tratado de Madri (1750) substituiu o Tratado de Tordesilhas e baseou-se no princípio de:',
    alternativas: ['Uti possidetis', 'Mare clausum', 'Direito divino', 'Pacto Colonial', 'Livre Comércio'],
    resposta: 0,
    explicacao: 'O princípio de "uti possidetis" estabelecia que quem possuísse a terra de fato teria o direito de posse.',
    difficulty: 'Medium'
  },
  // More ESA
  {
    id: 'esa-2021-mat-1',
    prova: 'ESA',
    ano: 2021,
    materia: 'Matemática',
    assunto: 'Geometria',
    pergunta: 'Um cilindro circular reto possui raio da base r=3cm e altura h=10cm. Qual a área lateral desse cilindro?',
    alternativas: ['30π cm²', '60π cm²', '90π cm²', '15π cm²', '45π cm²'],
    resposta: 1,
    explicacao: 'Área lateral = 2πrh = 2 * π * 3 * 10 = 60π cm².',
    difficulty: 'Easy'
  },
  // More Fuvest
  {
    id: 'fuvest-2022-geo-1',
    prova: 'Fuvest',
    ano: 2022,
    materia: 'Geografia',
    assunto: 'Geopolítica',
    pergunta: 'A Organização dos Países Exportadores de Petróleo (OPEP) tem como principal objetivo:',
    alternativas: ['Promover a paz mundial', 'Controlar a produção e o preço do petróleo', 'Desenvolver energias renováveis', 'Combater o aquecimento global', 'Facilitar o comércio de alimentos'],
    resposta: 1,
    explicacao: 'A OPEP busca coordenar as políticas petrolíferas de seus membros para garantir preços estáveis.',
    difficulty: 'Easy'
  },
  // More Unicamp
  {
    id: 'unicamp-2021-soc-1',
    prova: 'Unicamp',
    ano: 2021,
    materia: 'Sociologia',
    assunto: 'Cultura',
    pergunta: 'O conceito de "Indústria Cultural" foi desenvolvido por quais pensadores da Escola de Frankfurt?',
    alternativas: ['Marx e Engels', 'Durkheim e Weber', 'Adorno e Horkheimer', 'Foucault e Deleuze', 'Habermas e Honneth'],
    resposta: 2,
    explicacao: 'Theodor Adorno e Max Horkheimer cunharam o termo para descrever a produção em massa de bens culturais.',
    difficulty: 'Hard'
  },
  // More Unesp
  {
    id: 'unesp-2020-fil-1',
    prova: 'Unesp',
    ano: 2020,
    materia: 'Filosofia',
    assunto: 'Filosofia Antiga',
    pergunta: 'Para Aristóteles, a virtude ética consiste no:',
    alternativas: ['Prazer absoluto', 'Conhecimento puro', 'Justo meio entre dois extremos', 'Cumprimento do dever', 'Desprezo pelos bens materiais'],
    resposta: 2,
    explicacao: 'A ética aristotélica defende o equilíbrio, a "mediania" entre o excesso e a falta.',
    difficulty: 'Medium'
  },
  // Concursos
  {
    id: 'conc-2023-adm-1',
    prova: 'Concursos',
    ano: 2023,
    materia: 'Sociologia',
    assunto: 'Trabalho',
    pergunta: 'O fenômeno da "Uberização" do trabalho refere-se a:',
    alternativas: ['Melhoria das condições de trabalho', 'Aumento da estabilidade empregatícia', 'Precarização e flexibilização extrema do trabalho via plataformas digitais', 'Estatização dos meios de produção', 'Redução da jornada de trabalho'],
    resposta: 2,
    explicacao: 'Uberização descreve a tendência de contratos informais e sob demanda mediada por tecnologia.',
    difficulty: 'Medium'
  },
  // Vestibulares
  {
    id: 'vest-2022-bio-1',
    prova: 'Vestibulares',
    ano: 2022,
    materia: 'Biologia',
    assunto: 'Ecologia',
    pergunta: 'O processo de sucessão ecológica que ocorre em uma área anteriormente desabitada (como uma rocha nua) é chamado de:',
    alternativas: ['Sucessão Secundária', 'Clímax', 'Ecese', 'Sucessão Primária', 'Homeostase'],
    resposta: 3,
    explicacao: 'A sucessão primária inicia-se em ambientes onde nunca houve vida anteriormente.',
    difficulty: 'Easy'
  }
];
