export const PAYMENT_CONFIG = {
  premium: {
    price: 19.90,
    currency: 'BRL',
    period: 'mensal',
    // Link do Mercado Pago - Comandante deve substituir aqui
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
  }
};
