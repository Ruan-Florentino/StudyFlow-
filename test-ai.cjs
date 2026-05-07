/**
 * Testa modelos via proxy /api/ai (requer servidor em localhost:3000 e JWT Supabase válido).
 * Uso: defina TEST_SUPABASE_ACCESS_TOKEN no .env (access_token de sessão logada).
 */
try {
  require('dotenv').config();
} catch {
  /* dotenv opcional em alguns ambientes */
}

const http = require('http');

const models = [
  'deepseek/deepseek-r1',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-nemo',
  'google/gemini-2.5-flash',
  'google/gemini-3.1-pro-preview'
];

const accessToken = process.env.TEST_SUPABASE_ACCESS_TOKEN;
if (!accessToken || typeof accessToken !== 'string' || accessToken.length < 20) {
  console.error(
    'Defina TEST_SUPABASE_ACCESS_TOKEN no .env com o JWT de acesso (sessão Supabase) para testar /api/ai.'
  );
  process.exit(1);
}

async function testModel(model) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }, (res) => {
      let result = '';
      res.on('data', chunk => result += chunk.toString());
      res.on('end', () => resolve(`Model: ${model}\nStatus: ${res.statusCode}\nResponse: ${result}\n`));
    });
    req.write(JSON.stringify({
      messages: [{role: 'user', content: 'diga apenas: OK'}],
      model: model,
      stream: false
    }));
    req.end();
  });
}

(async () => {
  for (const m of models) {
    console.log(await testModel(m));
  }
})();
