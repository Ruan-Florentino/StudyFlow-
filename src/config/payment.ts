export const PAYMENT_CONFIG = {
  premium: {
    priceMonthly: 19.99,
    priceYearly: 199,
    /** Preço exibido legado (mensal) — use priceMonthly nas telas novas */
    price: 19.99,
    currency: 'BRL',
    period: 'mensal',
    // Placeholder checkout web; assinatura pública prevista: Play Billing / App Store
    mercadoPagoUrl: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=YOUR_PREFERENCE_ID',
    benefits: [
      { id: 'questoes', text: 'Questões ilimitadas', icon: '❓' },
      { id: 'redacao', text: 'Redações com correção IA Premium', icon: '✍️' },
      { id: 'analises', text: 'Análises avançadas de desempenho', icon: '📊' },
      { id: 'anuncios', text: 'Sem anúncios e distrações', icon: '🚫' },
      { id: 'suporte', text: 'Suporte prioritário via WhatsApp', icon: '💬' },
      { id: 'simulados', text: 'Acesso a todos os simulados ENEM', icon: '📝' },
      { id: 'streak', text: 'Protetor de streak (salva seu fogo)', icon: '🔥' }
    ]
  },
  supremo: {
    priceMonthly: 49.9,
    priceYearly: 419,
    currency: 'BRL',
    badge: 'Melhor custo-benefício anual',
  },
} as const;
