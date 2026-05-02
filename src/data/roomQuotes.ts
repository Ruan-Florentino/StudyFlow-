export const ROOM_QUOTES: Record<string, string[]> = {
  'biblioteca-antiga': [
    "O conhecimento é a única coisa que cresce quando se compartilha. — Sócrates",
    "Estudar é iluminar o próprio caminho que leva ao futuro.",
    "A leitura engrandece a alma e fortalece a mente."
  ],
  'vazio-cosmico': [
    "Somos feitos de poeira de estrelas, e à elas retornamos com sabedoria. — Carl Sagan",
    "O universo não foi feito à medida do ser humano, mas o aprendizado nos eleva às estrelas.",
    "No silêncio do espaço, a imaginação cria mundos inteiros."
  ],
  'cyberpunk-cafe': [
    "O futuro pertence àqueles que aprendem mais rápido que os outros. — Anônimo",
    "A tecnologia é a ferramenta; a curiosidade é o motor.",
    "Aumente o bandwidth da sua mente."
  ],
  'lareira-inverno': [
    "A persistência é o caminho do êxito quando a chama interior arde. — Charles Chaplin",
    "Pequenos hábitos constantes aquecem as grandes realizações.",
    "Deixe o conforto de lado e construa hoje o fogo do seu sucesso."
  ],
  'lofi-chuva': [
    "Cada gota de esforço se acumula em rios de conquista. — Provérbio",
    "Na tempestade do caos, encontre a paz do foco profundo.",
    "Nada floresce sem a água da chuva; nada se constrói sem dedicação."
  ],
  'floresta-viva': [
    "A floresta cresce devagar, mas suas raízes sustentam tempestades. — Provérbio chinês",
    "Respire fundo, sinta a vida fluir e conecte-se com seu objetivo.",
    "Como a natureza, você não precisa ter pressa, apenas não pare de crescer."
  ]
};

export const getRoomQuote = (roomId: string) => {
  const quotes = ROOM_QUOTES[roomId] || ROOM_QUOTES['lofi-chuva'];
  return quotes[Math.floor(Math.random() * quotes.length)];
};
