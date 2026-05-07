/**
 * Textos de suporte pós-compra (lojas) — alinhado ao runbook de incidentes.
 * E-mail institucional único; não duplicar secrets aqui.
 */

export const SUPPORT_EMAIL = 'altavistaholdingltda@gmail.com';

/** Assunto sugerido para e-mail ao suporte (codificação RFC para mailto). */
export const MAILTO_SUBJECT_STORE_ENTITLEMENT = encodeURIComponent(
  'StudyFlow — assinatura ativa na loja / app sem Premium'
);

/** Corpo em texto puro para o usuário colar no e-mail (preencher campos entre colchetes). */
export const postPurchaseEmailTemplate = `Olá, equipe StudyFlow,

Estou com problema de acesso após assinatura:

1) Loja: [ Google Play | App Store ]
2) E-mail da conta StudyFlow: [ seu e-mail de login ]
3) Produto / plano contratado: [ ex.: StudyFlow Premium mensal ]
4) A assinatura aparece ATIVA na loja? [ sim / não ]
5) Data / horário aproximado da compra: [ ]
6) Já tentei: [ sair e entrar de novo | atualizar o app | reiniciar o aparelho ]
7) ID do pedido ou print da tela da loja (se tiver): [ anexar ou colar ]

Aguardo retorno. Obrigado(a).`;

export function buildMailtoStoreIssue(): string {
  const body = encodeURIComponent(postPurchaseEmailTemplate);
  return `mailto:${SUPPORT_EMAIL}?subject=${MAILTO_SUBJECT_STORE_ENTITLEMENT}&body=${body}`;
}
