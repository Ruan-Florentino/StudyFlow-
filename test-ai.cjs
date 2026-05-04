const http = require('http');

const models = [
  'deepseek/deepseek-r1',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-nemo',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'google/gemini-2.5-flash',
  'google/gemini-3.1-pro-preview'
];

async function testModel(model) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/ai',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
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
