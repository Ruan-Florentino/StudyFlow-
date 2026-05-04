export async function testOpenRouterConnection() {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  console.log('🔑 API Key existe?', !!apiKey);
  console.log('🔑 API Key começa com sk-or?', apiKey?.startsWith('sk-or'));
  console.log('🔑 Tamanho da key:', apiKey?.length);
  
  if (!apiKey) {
    console.error('❌ VITE_OPENROUTER_API_KEY não definida!');
    return;
  }
  
  try {
    const response = await fetch(
      '/api/ai',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: 'oi' }],
        }),
      }
    );
    
    console.log('📡 Status:', response.status);
    
    // Clone before reading
    const responseClone = response.clone();
    
    let data;
    try {
        data = await response.json();
        console.log('📦 Resposta:', data);
    } catch (e) {
        try {
            const errorText = await responseClone.text();
            console.error('❌ Failed to parse response JSON. Raw text:', errorText);
        } catch (textError) {
            console.error('❌ Failed to parse response JSON and failed to get raw text');
        }
        return;
    }
    
    if (!response.ok) {
      console.error('❌ Erro da API:', data);
    } else {
      console.log('✅ API funcionando!');
    }
  } catch (error) {
    console.error('💥 Erro de rede:', error);
  }
}
