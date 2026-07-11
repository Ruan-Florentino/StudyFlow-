/**
 * Política de Privacidade ampliada (LGPD e boas práticas).
 * Não substitui assessoria jurídica. Última revisão de estrutura: 07/05/2026.
 */

const INTRO = [
  'Este documento detalha como a Altavista Holding LTDA trata dados pessoais no ecossistema Athena, em linguagem operacional e alinhada à Lei nº 13.709/2018 (LGPD).',
  'A Athena é um aplicativo de apoio aos estudos; o tratamento de dados visa viabilizar conta, sincronização, funcionalidades educacionais, suporte, segurança e melhoria contínua.',
  'A leitura integra o conjunto de informações legais do App; o uso continuado após atualizações relevantes pode implicar ciência da nova versão, quando permitido pela lei.',
  'Termos em maiúsculas (Titular, Controlador, Operador) seguem o sentido da LGPD, salvo quando definidos de outra forma nos Termos de Uso.',
  'Dados anonimizados ou agregados de forma irreversível, quando aplicável, deixam de ser considerados dados pessoais nos termos da lei.',
  'Esta Política aplica-se a todos os fluxos em que a Athena atue como controladora ou co-controladora, conforme cada funcionalidade.',
  'Integrações de terceiros (pagamento, infraestrutura, modelos de IA) possuem políticas próprias, aqui referenciadas de forma complementar.',
  'Em caso de conflito entre resumos de interface e este texto, prevalece a redação deste documento para fins de transparência ao Titular.',
  'Nada nesta Política limita direitos irrenunciáveis do consumidor ou do Titular previstos na ordem jurídica brasileira.',
  'Dúvidas sobre interpretação devem ser encaminhadas ao canal do encarregado indicado na seção de contato.',
];

const DEFINICOES = [
  'Titular: pessoa natural a quem se referem os dados pessoais sujeitos a tratamento.',
  'Dado pessoal: informação relacionada a pessoa natural identificada ou identificável.',
  'Dado sensível: categorias especiais previstas no Art. 5º, II, da LGPD, quando eventualmente tratadas.',
  'Tratamento: toda operação com dados pessoais (coleta, produção, recepção, classificação, uso, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, modificação, comunicação, transferência, difusão ou extração).',
  'Controlador: Altavista Holding LTDA, que decide sobre o tratamento de dados pessoais.',
  'Operador: terceiro que realiza tratamento em nome do Controlador, conforme instruções documentadas.',
  'Encarregado (DPO): pessoa indicada para comunicação com Titulares e ANPD, sem prejuízo da responsabilidade do Controlador.',
  'Consentimento: manifestação livre, informada e inequívoca pela qual o Titular concorda com o tratamento.',
  'Legítimo interesse: base legal que exige balanceamento com expectativas do Titular e teste de necessidade.',
  'Relatório de impacto (RIPD): instrumento de governança quando o tratamento puder gerar risco elevado, conforme regulamentação.',
  'Incidente de segurança: evento adverso que comprometa, de forma acidental ou ilícita, a integridade, confidencialidade ou disponibilidade dos dados.',
  'Subprocessador: prestador contratado pelo Operador ou pelo Controlador para etapas específicas do tratamento.',
  'Pseudonimização: tratamento pelo qual dado deixa de ser atribuído a Titular sem informação adicional segregada.',
  'Eliminação: exclusão de dado ou de forma a impossibilitar recuperação, observadas exceções legais.',
  'Portabilidade: entrega de dados em formato estruturado e interoperável, quando aplicável.',
];

const CONTROLADOR = [
  'Controlador dos dados tratados no âmbito da Athena: Altavista Holding LTDA, pessoa jurídica de direito privado, com sede no Brasil.',
  'O encarregado pelo tratamento de dados pode ser contatado pelo e-mail altavistaholdingltda@gmail.com para assuntos de privacidade, direitos do Titular e incidentes.',
  'Solicitações devem conter identificação razoável do Titular e descrição do pedido para agilizar resposta dentro dos prazos legais.',
  'O Controlador poderá solicitar informações adicionais para evitar vazamento de dados a terceiros fraudulentos.',
  'A identificação do Controlador nos Termos de Uso complementa esta seção para fins contratuais.',
  'Alterações de dados de contato institucional serão refletidas nesta Política com atualização de data de vigência.',
  'O Controlador mantém processos internos de registro de operações de tratamento quando exigidos pela prática de governança.',
  'Cooperação com a Autoridade Nacional de Proteção de Dados (ANPD) será prestada nos limites legais quando formalmente solicitada.',
  'Em hipótese de due diligence, fusão ou reorganização societária, o Titular será informado quando o tratamento for substancialmente afetado.',
  'O Controlador não comercializa bases de dados pessoais de Titulares a terceiros para monetização independente do serviço.',
  'Eventuais campanhas de parceiros, se existirem, observarão bases legais específicas e opção de descadastro quando aplicável.',
  'A governança de privacidade é revisada periodicamente ou quando houver mudança relevante de risco ou de produto.',
];

const DADOS_CADASTRO = [
  'Nome ou apelido utilizado para exibição no perfil e experiência personalizada.',
  'Endereço de e-mail para autenticação, recuperação de acesso e comunicações transacionais.',
  'Identificadores de conta gerados pelo provedor de autenticação (por exemplo, backend Auth).',
  'Foto de perfil e imagem de capa, quando enviadas voluntariamente pelo Titular.',
  'Biografia ou texto de apresentação opcional no perfil.',
  'Preferências de tema, idioma ou configurações de interface armazenadas localmente ou sincronizadas.',
  'Indicadores de plano de acesso (gratuito, premium ou equivalente) e status de assinatura.',
  'Registros de data de criação da conta e de último acesso quando tecnicamente disponíveis.',
  'Tokens de sessão ou equivalentes para manter login seguro entre visitas.',
  'Metadados de dispositivo necessários para compatibilidade (tipo de navegador, resolução aproximada).',
  'Identificadores de instalação PWA, quando o navegador expuser tais APIs de forma consentida ou necessária.',
  'Endereço IP em logs de infraestrutura para segurança, diagnóstico e conformidade.',
  'Informações fornecidas em formulários de suporte ou feedback voluntário.',
  'Dados de faturação mínimos quando exigidos pelo processador de pagamentos (sem armazenar PAN completo pelo App quando tokenizado pelo parceiro).',
  'Histórico de consentimentos ou registros de opt-in/opt-out quando a funcionalidade existir.',
  'Correlação entre conta local e conta remota para sincronização de progresso de estudos.',
  'Campos opcionais de personalização de estudo (metas, matérias favoritas) quando utilizados.',
  'Identificadores de convite ou código promocional, se aplicável ao cadastro.',
];

const DADOS_USO = [
  'Logs de funcionalidades acessadas (módulos de questões, flashcards, salas, IA) para melhoria de produto.',
  'Tempo aproximado de sessão e frequência de uso agregados.',
  'Estatísticas de desempenho em questões (acertos, erros, assuntos) para exibição ao Titular.',
  'Eventos de erro ou falha técnica anonimizados ou pseudonimizados para estabilidade.',
  'Métricas de performance de rede latentes para otimização de entrega de conteúdo.',
  'Registros de instalação ou atualização do service worker em ambiente PWA.',
  'Dados de uso de armazenamento local (quotas) para prevenir corrupção de backup.',
  'Interações com notificações ou lembretes, quando ativados.',
  'Cliques em atalhos, rankings ou telas de exploração para entender jornada (pode ser agregado).',
  'Parâmetros de busca interna de questões ou conteúdo, para relevância.',
  'Sinalizações de abuso ou denúncia de conteúdo na comunidade, se a funcionalidade existir.',
  'Registros de moderação aplicada a conteúdo do Titular, com fundamento e data.',
  'Uso de recursos premium versus limites do plano gratuito.',
  'Experimentos de interface (A/B) apenas com base legal adequada e transparência quando exigida.',
  'Telemetria mínima necessária para prevenir fraude em criação de contas ou uso de créditos de IA.',
  'Associação de sessão de estudo a identificadores de dispositivo para continuidade da experiência.',
  'Histórico de exportações de backup solicitadas pelo Titular.',
  'Marcadores de aceite de termos ou políticas em determinada versão.',
];

const DADOS_CONTEUDO_IA = [
  'Textos digitados em campos de redação, resumos ou prompts enviados a funcionalidades de IA.',
  'Arquivos enviados para análise de documentos (PDF, texto) quando o Titular inicia o fluxo.',
  'Mensagens trocadas com assistentes ou tutores automatizados integrados ao App.',
  'Saídas geradas por modelos de IA exibidas ao Titular e eventualmente armazenadas para histórico.',
  'Metadados de modelo ou versão usada para auditoria de qualidade (sem identificar terceiros).',
  'Flags de moderação automática aplicadas a conteúdo gerado ou enviado.',
  'Solicitações de explicação de questões ou feedback educacional produzido por IA.',
  'Anotações, favoritos e marcações em conteúdos educacionais dentro do App.',
  'Dados de simulados e provas (respostas, tempo, gabarito) para revisão e estatísticas.',
  'Conteúdo publicado voluntariamente em áreas sociais ou fóruns, se disponíveis.',
  'Mídia incorporada (links, embeds) que o Titular associa ao estudo.',
  'Checksums ou hashes de arquivo para deduplicação e integridade em upload.',
  'Versões anteriores de texto quando houver autosave.',
  'Dados de treino personalizado derivados apenas do uso do Titular, não vendidos a terceiros.',
  'Limites de taxa (rate limit) associados ao uso de IA para equidade entre usuários.',
  'Registros de opt-out de melhoria de modelo com dados do Titular, quando oferecido.',
  'Parâmetros de temperatura ou configurações avançadas de IA expostas ao usuário expert.',
  'Indicadores de confiança ou disclaimer exibidos junto a respostas automatizadas.',
  'Correções manuais feitas pelo Titular sobre sugestões de IA.',
  'Metadados de licença de conteúdo educacional próprio da Athena.',
];

const FINALIDADES = [
  'Criar e manter conta, autenticação e recuperação de acesso.',
  'Sincronizar progresso, preferências e dados de estudo entre dispositivos.',
  'Exibir estatísticas, histórico e recomendações educacionais dentro do App.',
  'Processar pagamentos, renovações e suporte de faturamento.',
  'Prestar atendimento ao usuário e responder solicitações de direitos.',
  'Garantir segurança da informação, prevenção a fraudes e abusos.',
  'Cumprir obrigações legais, regulatórias e ordens competentes.',
  'Realizar melhorias de produto com base em uso agregado ou pseudonimizado.',
  'Enviar comunicações essenciais sobre o serviço (manutenção, alterações contratuais relevantes).',
  'Operar infraestrutura em nuvem, banco de dados, CDN e backups.',
  'Monitorar disponibilidade, desempenho e integridade dos sistemas.',
  'Executar testes de qualidade e correção de bugs em ambientes controlados.',
  'Documentar incidentes e lições aprendidas para redução de risco.',
  'Gerenciar relacionamento com processadores de pagamento e provedores de IA.',
  'Facilitar portabilidade e exportação quando solicitada.',
  'Aplicar políticas de uso aceitável e moderar conteúdo reportado.',
  'Cumprir prazos de retenção fiscal ou contábil quando aplicável.',
  'Viabilizar pesquisas opcionais de satisfação com consentimento específico, se realizadas.',
  'Personalizar experiência educacional sem decisão unicamente automatizada que produza efeitos jurídicos, salvo previsão legal.',
  'Proteger a vida ou a incolumidade em situações emergenciais legais.',
  'Arquivar logs mínimos para defesa em processos judiciais ou administrativos.',
  'Cooperar com autoridades em investigações legítimas mediante fundamento legal.',
];

const BASES_LEGAIS = [
  'Execução de contrato ou procedimentos preliminares (Art. 7º, V, LGPD) para funcionalidades contratadas pelo Titular.',
  'Legítimo interesse (Art. 7º, IX) para segurança, prevenção a fraude e melhoria de serviço, com avaliação de impacto proporcional.',
  'Consentimento (Art. 7º, I) para comunicações de marketing não essenciais ou cookies não estritamente necessários, quando utilizados.',
  'Cumprimento de obrigação legal ou regulatória (Art. 7º, II).',
  'Proteção da vida ou da incolumidade física (Art. 7º, VI) em casos excepcionais.',
  'Exercício regular de direitos em processo judicial, administrativo ou arbitral (Art. 7º, IV), quando aplicável.',
  'Proteção do crédito (Art. 7º, X), quando pertinente a serviços de pagamento.',
  'Estudos por órgão de pesquisa (Art. 7º, IV, com garantias), apenas se eventualmente realizado em conformidade.',
  'Tratamento de dados sensíveis somente quando amparado nas hipóteses do Art. 11 da LGPD.',
  'Revogação de consentimento não afeta tratamentos anteriores baseados em outras hipóteses legais.',
  'Registro de bases legais por finalidade facilita transparência em auditorias internas.',
  'Balanceamento de legítimo interesse considera expectativa do Titular, natureza dos dados e necessidade.',
  'Tratamento mínimo necessário (proporcionalidade) é aplicado a cada funcionalidade nova.',
  'Anonimização irreversível é preferida quando a finalidade não exija identificação.',
  'Co-controladores, se existirem em integrações específicas, serão identificados em aditivos ou avisos pontuais.',
  'Tratamento posterior para finalidade diversa exige nova base legal compatível e informação ao Titular.',
  'Decisões automatizadas com efeito jurídico relevante observarão direitos do Titular conforme Art. 20, quando aplicável.',
  'Bases legais são revisadas em cada release relevante de produto.',
  'Documentação interna de decisões de tratamento pode ser solicitada pela ANPD.',
  'Titular pode questionar tratamento baseado em legítimo interesse mediante canal indicado.',
];

const COMPARTILHAMENTO = [
  'Dados podem ser compartilhados com prestadores que atuam como operadores, sob cláusulas de confidencialidade e segurança.',
  'Provedores de hospedagem, banco de dados e autenticação (ex.: backend) recebem dados estritamente necessários à operação.',
  'Processadores de pagamento recebem dados para transação; números completos de cartão não são armazenados pela Athena quando tokenizados pelo parceiro.',
  'Provedores de modelos de IA e infraestrutura podem processar prompts e contexto necessário à geração de respostas.',
  'Ferramentas de monitoramento de erros ou analytics, se usadas, recebem dados pseudonimizados quando possível.',
  'Autoridades públicas recebem dados mediante fundamento legal adequado.',
  'Parceiros de integração técnica (SDKs) observam políticas próprias além desta.',
  'Transferência societária pode implicar sucessão em obrigações de privacidade com notificação quando exigida.',
  'Subcontratação por operadores só ocorre com autorização do Controlador ou contrato em cadeia compatível.',
  'Não há venda de dados pessoais a corretores de marketing.',
  'Compartilhamento com outro Titular ocorre apenas por ação voluntária (ex.: compartilhar resultado), não por padrão oculto.',
  'Ordens judiciais são analisadas juridicamente antes de divulgação, quando houver prazo compatível.',
  'Proteção de direitos do Controlador ou de terceiros pode exigir compartilhamento limitado com assessores.',
  'Auditorias externas podem acessar amostras contratuais sem exposição desnecessária de Titulares.',
  'Eventos de segurança podem exigir notificação a parceiros técnicos para contenção.',
  'Dados agregados podem ser divulgados publicamente sem identificação do Titular.',
];

const ASSINATURA_PAGAMENTO = [
  'Assinaturas Athena Premium ou equivalente implicam tratamento de dados para identificar o assinante, conciliar pagamento com a conta do App e aplicar o plano contratado.',
  'A cobrança recorrente prevista para produção ocorre pelas lojas **Google Play** e **Apple App Store**: Google e Apple tratam dados de pagamento e conta da loja conforme **políticas próprias**; a Athena recebe em geral **identificadores de assinatura** ou **recibos** (ex.: tokens de compra) para validar o direito de uso.',
  'Dados completos de cartão ou método de pagamento da loja **não** são armazenados nos servidores da Athena; ficam com a plataforma de pagamento da Google ou Apple.',
  'Servidor a servidor (ex.: notificações **Real-Time Developer Notifications** da Play Store ou **App Store Server Notifications**), quando implementadas, podem registrar eventos de assinatura em logs seguros para auditoria e suporte.',
  'Em caso de disputa ou estorno na loja, podemos conservar registros mínimos do fato e da conta envolvida pelo tempo necessário à análise e defesa.',
  'Cancelamento de renovação é feito nas configurações de assinatura da loja correspondente; o Titular pode solicitar esclarecimentos ao encarregado se houver impacto indevido no acesso.',
  'Comprovantes e documentos fiscais, quando aplicáveis, seguem regras da loja e legislação tributária; a Athena não substitui o histórico oficial da Google ou Apple.',
  'O Titular pode solicitar confirmação sobre quais dados de transação recebemos da integração com as lojas, nos limites do que a API expõe.',
  'Falha de sincronização entre compra aprovada na loja e plano no App deve ser reportada ao suporte com comprovante da loja; dados do pedido serão usados apenas para regularização.',
  'Não utilizamos dados de pagamento para perfil comportamental de terceiros nem para venda a corretores.',
  'Versão web/PWA ou outro processador eventual será descrito nesta Política quando ativo; alterações relevantes serão comunicadas quando apropriado.',
];

const RETENCAO = [
  'Dados de conta ativa são mantidos enquanto a relação existir e for necessário ao serviço.',
  'Após exclusão de conta, a remoção de sistemas ativos ocorre em prazo razoável, salvo exceções legais.',
  'Backups cifrados podem reter cópias residuais até ciclo de rotação automática.',
  'Logs de segurança podem ser retidos pelo período necessário à investigação e conformidade.',
  'Obrigações fiscais ou contábeis podem exigir guarda mínima de registros de transação.',
  'Conteúdo removido por moderação pode ser retido em forma restrita para defesa legal.',
  'Solicitações de direitos são arquivadas em registro mínimo para prova de atendimento.',
  'Dados anonimizados podem ser conservados sem limite para estatística, se irreversíveis.',
  'Políticas de retenção são proporcionais à natureza do dado e ao risco.',
  'Titular pode solicitar eliminação, observadas exceções legais de guarda.',
  'Revisão periódica identifica dados obsoletos para minimização.',
  'Dados de trial ou conta inativa podem ser eliminados após aviso prévio razoável.',
  'Mídia em storage objeto segue ciclo de vida do Titular e políticas de bucket.',
  'Exportações do Titular não prolongam retenção além do necessário ao download.',
];

const SEGURANCA = [
  'Uso de TLS/HTTPS nas comunicações com servidores, quando aplicável à arquitetura.',
  'Controle de acesso baseado em função para equipes internas com necessidade de saber.',
  'Segregação de ambientes de produção e testes quando tecnicamente viável.',
  'Políticas de senha forte e autenticação multifator recomendadas ao Titular.',
  'Monitoramento de tentativas de login anômalas junto ao provedor de identidade.',
  'Criptografia em repouso nos serviços de nuvem conforme oferta do provedor.',
  'Rotação de chaves de API e credenciais de serviço em processo controlado.',
  'Gestão de vulnerabilidades com correções periódicas de dependências.',
  'Treinamento básico de conscientização em segurança para quem acessa dados.',
  'Plano de resposta a incidentes documentado internamente.',
  'Comunicação a Titular e ANPD em incidentes com risco relevante, conforme prazos legais.',
  'Testes de penetração ou revisão de código em marcos relevantes de produto.',
  'Minimização de coleta no desenvolvimento de novas features.',
  'Pseudonimização em ambientes de analytics quando possível.',
  'Registro de acessos administrativos a bases que contenham dados pessoais.',
  'Política de dispositivos para colaboradores com acesso remoto.',
  'Backup com integridade verificável e restauração testada.',
  'Lista de permissões para integrações externas reduzindo superfície de ataque.',
  'Gestão de segredos sem commit em repositório público.',
  'Revisão de fornecedores quanto a certificações ou práticas mínimas de segurança.',
  'Classificação de dados para aplicar controles proporcionais.',
  'Exclusão segura de mídia substituída em perfil quando solicitada.',
  'Registro de versão de política de segurança interna alinhada a esta declaração pública.',
];

const TRANSFERENCIA = [
  'Alguns prestadores podem processar dados fora do território nacional.',
  'Transferências internacionais observam mecanismos previstos na LGPD e regulamentos da ANPD.',
  'Cláusulas contratuais padrão ou instrumentos equivalentes podem ser utilizados com fornecedores.',
  'Titular pode solicitar informações sobre garantias aplicáveis a transferências.',
  'País de destino pode não possuir legislação equivalente; mitigações contratuais são adotadas.',
  'Transferência necessária à execução de contrato com Titular pode fundamentar determinados fluxos.',
  'Serviços de IA com infraestrutura global podem implicar processamento transfronteiriço de prompts.',
  'Mapeamento de fluxos internacionais é atualizado quando novos subprocessadores são incorporados.',
  'Documentação de avaliação de risco acompanha decisões de transferência.',
  'Cooperação judicial internacional seguirá tratados e requisitos formais.',
];

const DIREITOS = [
  'Confirmação da existência de tratamento.',
  'Acesso aos dados pessoais tratados.',
  'Correção de dados incompletos, inexatos ou desatualizados.',
  'Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.',
  'Portabilidade dos dados a outro fornecedor, observadas regulamentações.',
  'Eliminação dos dados tratados com consentimento, salvo exceções legais.',
  'Informação sobre entidades públicas ou privadas com as quais compartilhamos dados.',
  'Informação sobre possibilidade de não fornecer consentimento e consequências.',
  'Revogação do consentimento quando essa for a única base.',
  'Oposição a tratamento fundamentado em legítimo interesse, com análise de motivos.',
  'Revisão de decisões automatizadas que afetem interesses do Titular, quando aplicável.',
  'Petição em relação aos dados perante a ANPD.',
  'Solicitação de revisão de tratamento em caso de dados de crianças e adolescentes, quando aplicável.',
  'Obtenção de cópia de dados em formato estruturado, quando tecnicamente factível.',
  'Esclarecimento sobre critérios e duração do tratamento.',
  'Informação sobre origem dos dados, quando não coletados diretamente do Titular.',
  'Direito de não ser submetido a decisão unicamente automatizada com efeitos jurídicos, nos casos do Art. 20.',
  'Solicitação de limitação de tratamento em disputas até resolução.',
  'Comunicação sobre incidentes que afetem Titular, quando obrigatório.',
  'Indicação de representante para exercício de direitos, mediante comprovação.',
  'Resposta às solicitações no prazo legal, podendo prorrogar mediante justificativa.',
  'Gratuidade do exercício, salvo hipóteses legais de custo razoável.',
];

const MENORES = [
  'O serviço não é destinado a menores de 13 anos sem consentimento parental aplicável.',
  'Entre 13 e 18 anos, recomenda-se supervisão dos responsáveis conforme Termos.',
  'Dados de menores recebem tratamento minimizado e sem publicidade comportamental invasiva.',
  'Solicitações de exclusão por responsáveis legais serão priorizadas.',
  'Conteúdo sensível não deve ser compartilhado por menores em áreas públicas do App.',
  'Ferramentas de IA devem ser usadas com orientação de adultos quando o Titular for adolescente.',
  'Verificação de idade pode ser solicitada em caso de suspeita razoável.',
  'Políticas escolares ou institucionais podem impor regras adicionais ao uso educacional.',
];

const COOKIES_PWA = [
  'Cookies ou storage local podem armazenar tokens de sessão e preferências.',
  'Service worker pode cachear ativos para funcionamento offline parcial.',
  'Titular pode limpar dados do site nas configurações do navegador.',
  'Algumas funções podem degradar sem armazenamento local.',
  'Consentimento de cookies não essenciais, se implementado, será registrado.',
  'Duração de cookies segue finalidade específica e tabela interna de retenção.',
  'Tecnologias similares (localStorage, IndexedDB) seguem a mesma lógica de transparência.',
  'Pixels de terceiros não essenciais não são utilizados sem base legal adequada.',
  'PWA instalado pode receber atualizações automáticas de versão com aviso em release notes.',
  'Geolocalização precisa não é coletada salvo funcionalidade específica futura com consentimento.',
  'Notificações push, se ativadas, usarão permissão explícita do sistema operacional.',
  'Preferências de privacidade do navegador (DNT ou GPC) serão consideradas quando normativamente aplicáveis.',
];

const MARKETING_ANALYTICS = [
  'Comunicações de marketing só ocorrerão com base legal apropriada, em geral consentimento.',
  'Titular pode optar por não receber e-mails promocionais quando o mecanismo existir.',
  'Métricas agregadas de campanha não identificam Titular individualmente.',
  'Perfis de advertising em plataformas de terceiros não são comprados pela Athena.',
  'Relatórios internos de retenção de usuário usam dados pseudonimizados.',
  'Benchmarks de produto utilizam estatísticas globais sem expor conteúdo pessoal.',
  'Testes de mensagem respeitam limite de frequência para evitar spam.',
  'Integração com redes sociais para login seguiria política da rede e aviso destacado.',
];

const TERCEIROS_ALTERACOES = [
  'Links externos no App não são controlados pela Athena quanto a privacidade.',
  'Recomenda-se leitura das políticas de cada serviço acessado via link.',
  'Widgets embutidos podem transmitir dados ao provedor do widget.',
  'Embed de vídeo pode comunicar metadados de reprodução ao host da mídia.',
  'Alterações materiais nesta Política serão comunicadas por meios razoáveis.',
  'Versões anteriores podem ser solicitadas ao encarregado para fins de auditoria do Titular.',
  'Histórico de versões pode ser mantido internamente com carimbo de data.',
  'Continuidade de uso após prazo de ciência pode valer como aceite apenas quando legalmente válido.',
  'Disposições inválidas serão substituídas na medida do possível sem prejudicar o restante.',
  'Legislação futura ou normas da ANPD podem exigir ajustes complementares.',
];

const CONTATO_ANPD = [
  'Canal primário: altavistaholdingltda@gmail.com para privacidade e encarregado.',
  'Petições à ANPD podem ser realizadas pelos meios oficiais divulgados pela autoridade.',
  'Titular pode buscar órgãos de defesa do consumidor quando aplicável o CDC.',
  'Documentação de atendimento será preservada conforme retenção mínima necessária.',
  'Reclamações fundadas recebem resposta objetiva sobre medidas adotadas.',
  'Em litígios, foro e lei aplicável seguem Termos de Uso, sem prejuízo de competência consumerista.',
  'Cooperação com mediação ou arbitragem, se contratada, observará confidencialidade de dados.',
  'Encarregado não substitui assessoria jurídica do Controlador em processos estratégicos.',
];

function buildPrivacyBody(): string {
  const sections: Array<{ title: string; points: string[] }> = [
    { title: 'Introdução', points: INTRO },
    { title: 'Definições essenciais (LGPD)', points: DEFINICOES },
    { title: 'Controlador, encarregado e governança', points: CONTROLADOR },
    { title: 'Dados de cadastro, conta e identidade', points: DADOS_CADASTRO },
    { title: 'Dados de uso, desempenho e produto', points: DADOS_USO },
    { title: 'Conteúdo do Titular, estudos e IA', points: DADOS_CONTEUDO_IA },
    { title: 'Finalidades do tratamento', points: FINALIDADES },
    { title: 'Bases legais e proporcionalidade', points: BASES_LEGAIS },
    { title: 'Compartilhamento e categorias de destinatários', points: COMPARTILHAMENTO },
    { title: 'Assinatura Premium, cobrança e Mercado Pago', points: ASSINATURA_PAGAMENTO },
    { title: 'Retenção, minimização e eliminação', points: RETENCAO },
    { title: 'Segurança da informação e resposta a incidentes', points: SEGURANCA },
    { title: 'Transferência internacional e garantias', points: TRANSFERENCIA },
    { title: 'Direitos do Titular (Art. 18 LGPD e correlatos)', points: DIREITOS },
    { title: 'Crianças e adolescentes', points: MENORES },
    { title: 'Cookies, armazenamento local e PWA', points: COOKIES_PWA },
    { title: 'Comunicações de marketing e analytics responsável', points: MARKETING_ANALYTICS },
    { title: 'Terceiros, alterações desta Política e disposições finais', points: TERCEIROS_ALTERACOES },
    { title: 'Contato, autoridade supervisora e recursos', points: CONTATO_ANPD },
  ];

  let index = 1;
  const blocks = sections.map(({ title, points }) => {
    const body = points
      .map((p) => {
        const n = String(index).padStart(3, '0');
        index += 1;
        return `**Ponto ${n}.** ${p}`;
      })
      .join('\n\n');
    return `## ${title}\n\n${body}`;
  });

  return blocks.join('\n\n---\n\n');
}

export const PRIVACIDADE_CONTENT = `
# Política de Privacidade — Athena (versão ampliada)

**Última atualização:** 07 de maio de 2026  
**Controlador:** Altavista Holding LTDA  
**Documento com mais de 200 pontos** de transparência operacional, organizados por tema, em conformidade com a LGPD e boas práticas de governança de dados.

> **Aviso legal:** este texto tem finalidade informativa e não substitui consulta jurídica. Para exercer direitos, use o e-mail do encarregado indicado ao final.

---

## Sumário de leitura rápida

| Tema | O que você encontra |
|------|---------------------|
| Pontos numerados | Cada afirmação é um **Ponto** sequencial (001, 002, …) para auditoria e referência em solicitações. |
| LGPD | Bases legais, direitos do Titular, encarregado, ANPD e segurança. |
| IA e conteúdo | Tratamento de prompts, arquivos e resultados automatizados. |
| Pagamentos | Assinatura Premium, Google Play / App Store, notificações de servidor e conciliação de plano. |
| Retenção e segurança | Prazos, backups, incidentes e medidas técnicas de alto nível. |

---

${buildPrivacyBody()}

---

## Fechamento

**Encarregado / privacidade:** altavistaholdingltda@gmail.com  
**Produto:** Athena

Ao utilizar a Athena, você declara **ciência** desta Política de Privacidade e dos Termos de Uso. Para solicitações formalizadas nos termos do Art. 18 da LGPD, indique no assunto: **“LGPD — [tipo de pedido]”** e anexe documento de identificação quando necessário à comprovação.

**Total de pontos numerados nesta versão:** ${(() => {
  const all = [
    ...INTRO,
    ...DEFINICOES,
    ...CONTROLADOR,
    ...DADOS_CADASTRO,
    ...DADOS_USO,
    ...DADOS_CONTEUDO_IA,
    ...FINALIDADES,
    ...BASES_LEGAIS,
    ...COMPARTILHAMENTO,
    ...ASSINATURA_PAGAMENTO,
    ...RETENCAO,
    ...SEGURANCA,
    ...TRANSFERENCIA,
    ...DIREITOS,
    ...MENORES,
    ...COOKIES_PWA,
    ...MARKETING_ANALYTICS,
    ...TERCEIROS_ALTERACOES,
    ...CONTATO_ANPD,
  ];
  return String(all.length);
})()}
`;
