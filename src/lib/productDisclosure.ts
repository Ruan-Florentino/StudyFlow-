/**
 * Mensagens únicas: o que vem do app (dados reais neste dispositivo) vs. cenário de exemplo.
 * Evita termos mistos (“ilustração”, “demo”, “placeholder”) na mesma superfície.
 */

export const rankingCopy = {
  tabHintLeague: 'Exemplo',
  tabHintFriends: 'Em breve',
  tabHintGlobalCloud: 'Nuvem',
  tabHintGlobalLocal: 'Exemplo',

  /** Linha abaixo do título da liga no hero */
  heroMeta: (params: { xpInLeague: string; myPosition: number }) =>
    `#${params.myPosition} · ${params.xpInLeague} XP · lista com cenário de exemplo (só você é real)`,

  /** Bloco único sob as abas */
  noteWhenGlobalSynced:
    'Global (nuvem): posições a partir de dados sincronizados no servidor. Em Minha liga e Amigos, os outros perfis ainda são um cenário de exemplo até o social ficar pronto.',

  noteWhenLocalOnly:
    'Cenário de exemplo: os outros perfis são fictícios. Seu XP, nível e streak vêm do app neste dispositivo. O ranking global na nuvem aparece quando houver sincronização.',

  zoneSafe:
    'Zona segura (cenário de exemplo). Não há rebaixamento real — é só visualização.',

  zoneRisk:
    'Zona de risco (cenário de exemplo). Não altera sua liga de verdade no app.',
} as const;

export const statisticsCopy = {
  noteTitle: 'Transparência dos dados',

  /** Uma linha quando a série diária é gerada */
  xpSeriesSynthetic:
    'Gráfico e calendário de XP: curva estimada para visualização (sem histórico diário salvo no app).',

  xpSeriesReal: 'Gráfico e calendário: baseados no histórico diário de XP registrado no app.',

  subjectSynthetic:
    'Tempo por matéria, pizza, radar e insights: exemplos ilustrativos até o app registrar essas quebras de forma completa.',

  subjectReal:
    'Tempo por matéria: dados registrados no app. Demais gráficos podem ainda ser parciais.',

  realCore:
    'Sempre reais neste aparelho (quando você usa o app): XP total, nível, streak e tempo total de estudo nas sessões registradas.',
} as const;

/** Tela principal `/estatisticas` (`StatsView`) — dados locais do histórico, sem perfis fictícios. */
export const statsViewCopy = {
  noteTitle: 'Sobre estes números',
  noteBody:
    'Tudo aqui vem do seu histórico de questões, XP e uso do app neste aparelho. Sem ranking de outros usuários. Se ainda não houver tentativas, alguns gráficos ficam vazios ou em zero.',
} as const;

/** Uso de IA e planos — mensagem única para telas de produto e paywall */
export const aiPremiumCopy = {
  /** Uma linha para banners compactos */
  banner:
    'Todas as funções que usam inteligência artificial (ATHENA, correções com modelo, trilhas e demais) ficam completas no Premium. No Free, há preview ou limites.',
  /** Parágrafo para hero / paywall */
  full:
    'Para usar o conjunto completo de recursos com IA no app, é necessário o plano Premium ou Supremo. No Free, o acesso a essas ferramentas é em modo preview ou com limites.',
} as const;

/** Transparência para quem vai pagar: CDC, demo vs. real, canais (sem substituir Termos). */
export const premiumConsumerCopy = {
  supportEmail: 'altavistaholdingltda@gmail.com',

  pricingCardTitle: 'Antes de assinar — consumidor (CDC)',
  pricingCardBody:
    'O valor exibido é referência em reais (BRL) para o plano. A cobrança oficial da assinatura está prevista para o app publicado nas lojas **Google Play** e **Apple App Store** (pagamento pelo ecossistema de cada loja, com termos e gestão de renovação/cancelamento deles). Nesta versão web/PWA o checkout pode ser apenas demonstração. Você tem direitos do CDC, informação clara antes de comprar nas lojas e canal de suporte no app.',

  pricingDemoNote:
    'Todas as funções com IA em modo completo ficam nos planos Premium ou Supremo; no Free há preview ou cotas menores. Algumas áreas do app mostram cenários de exemplo (ex.: ranking social ilustrativo). Isso não substitui resultado educacional nem promessa de aprovação — o Premium libera funcionalidades técnicas do app, não garante nota em prova.',

  checkoutLiveTitle: 'Sua compra e seus direitos',
  checkoutLiveBullets: [
    'Após o pagamento aprovado, o plano no app deve atualizar automaticamente; se não atualizar em até algumas horas, fale com o suporte com comprovante.',
    'Direito de arrependimento: nas hipóteses do CDC para contratação digital, você pode desistir no prazo legal — detalhes e exceções estão nos Termos de Uso.',
    'Cancelamento de renovação: nas lojas oficiais, use Google Play ou App Store (assinaturas) conforme as regras da plataforma; no web demo, não há cobrança real.',
    'Suporte: altavistaholdingltda@gmail.com (também pela rota Suporte no perfil).',
  ] as const,

  checkoutDemoWarning:
    'Checkout web de demonstração (sem cobrança real pela loja). Assinatura paga: prevista no app Android/iOS após publicação nas lojas.',
} as const;
