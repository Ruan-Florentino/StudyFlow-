const fs = require('fs');
const content = fs.readFileSync('src/services/aiService.ts', 'utf-8');

let newContent = content.replace(/model: GEMINI_MODELS\.PRO/g, 'model: GEMINI_MODELS.PRO.id');
newContent = newContent.replace(/model: GEMINI_MODELS\.FAST/g, 'model: GEMINI_MODELS.FLASH.id');

fs.writeFileSync('src/services/aiService.ts', newContent);
console.log('Done!');
