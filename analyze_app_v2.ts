import fs from 'fs';
import path from 'path';

const file = path.resolve('./src/App.tsx');
const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

const components: any[] = [];
let currentComp: any = null;

// VERY simple heuristics
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^(?:export\s+)?(?:default\s+)?(?:const|function)\s+([A-Za-z0-9_]+)\s*=?\s*(?:\([^)]*\)|\(.*?\))?\s*(?:=>)?\s*{?/);
  
  // ignore non-components 
  if (match && match[1] !== 'SUBJECTS' && match[1] !== 'EXAM_STATS' && /^[A-Z]/.test(match[1])) {
    if (currentComp) {
      currentComp.end = i;
      components.push(currentComp);
    }
    currentComp = {
      name: match[1],
      start: i + 1,
      end: 0,
      linesCount: 0,
    };
  }
}
if (currentComp) {
  currentComp.end = lines.length;
  components.push(currentComp);
}

for (let c of components) {
  c.linesCount = c.end - c.start + 1;
  const chunk = lines.slice(c.start - 1, c.end).join('\n');
  
  // Extract stores
  const storeMatches = [...chunk.matchAll(/(?:useStore|useStore\.getState\(\))\s*(?:\([^)]*\))?\s*(?:\.|=>\s*[a-zA-Z0-9_]+\.)([A-Za-z0-9_]+)/g)];
  c.stores = [...new Set(storeMatches.map(m => m[1]))];
  
  // Fallback for const { xxx } = useStore()
  const destructStoreMatches = [...chunk.matchAll(/const\s*{\s*([^}]+)\s*}\s*=\s*useStore\(\)/g)];
  destructStoreMatches.forEach(m => {
    const props = m[1].split(',').map(s => s.trim().split(':')[0].trim());
    c.stores.push(...props);
  });
  c.stores = [...new Set(c.stores)].filter(s => s);

  // Extract services
  const servMatches = [...chunk.matchAll(/(aiService|firebase|html2canvas)\./g)];
  c.services = [...new Set(servMatches.map(m => m[1]))];

  // Category heuristics
  c.category = 'FEATURE';
  if (c.name.includes('Modal') || c.name.includes('Overlay')) c.category = 'MODAL';
  else if (c.name.startsWith('The') || c.name === 'GodMode' || chunk.includes('GOD MODE')) c.category = 'EASTER_EGG';
  else if (['Dashboard', 'Questions', 'AnkiSystem', 'AIChat', 'Profile', 'Reports'].includes(c.name)) c.category = 'CORE';
  else if (['CommandPalette', 'TypingText', 'InlineQuestionCard', 'App'].includes(c.name)) c.category = 'AUXILIAR';
}

const table1 = components.filter(c => c.category === 'CORE' || c.category === 'FEATURE' || c.category === 'AUXILIAR');
const table2 = components.filter(c => c.category === 'EASTER_EGG');
const table3 = components.filter(c => c.category === 'MODAL');

fs.writeFileSync('analysis.json', JSON.stringify({table1, table2, table3}, null, 2));
