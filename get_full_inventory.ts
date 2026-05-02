import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/App.tsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const components = [];
const regex = /^(?:export\s+)?(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(regex);
  if (match) {
    components.push({ name: match[1], start: i + 1 });
  }
}

// Filter out constants that are not components but start with Uppercase
const excluded = ['SUBJECTS', 'EXAM_STATS', 'ALL_QUESTIONS', 'TOPICS', 'QUESTION_MAP', 'EXTERNAL_BANKS'];

const realComponents = components.filter(c => !excluded.includes(c.name));

const inventory = [];
for (let i = 0; i < realComponents.length; i++) {
  const start = realComponents[i].start;
  const end = (i < realComponents.length - 1) ? realComponents[i + 1].start - 1 : lines.length;
  const length = end - start + 1;
  
  const chunk = lines.slice(start - 1, end).join('\n');
  
  // Quick heuristic for category
  let category = 'FEATURE';
  if (chunk.includes('onClick={() => setActiveTab(')) category = 'CORE';
  if (chunk.includes('className="fixed') && (chunk.includes('Modal') || chunk.includes('Overlay'))) category = 'MODAL';
  if (realComponents[i].name === 'App') category = 'AUXILIAR';
  
  inventory.push({
    name: realComponents[i].name,
    start,
    end,
    length,
    category
  });
}

console.log(JSON.stringify(inventory, null, 2));
