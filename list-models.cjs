const https = require('https');
https.get('https://openrouter.ai/api/v1/models', (res) => {
  let data = '';
  res.on('data', (d) => data += d);
  res.on('end', () => {
    const models = JSON.parse(data).data;
    console.log("Mistral Nemo:", models.filter(m => m.id.includes('nemo')).map(m => m.id));
    console.log("Qwen:", models.filter(m => m.id.includes('qwen') && m.id.includes('free')).map(m => m.id));
  });
});
