import fs from 'fs';
import path from 'path';

const file = path.resolve('./src/App.tsx');
const content = fs.readFileSync(file, 'utf-8');

// Parse functions, exports, components roughly
const lines = content.split('\n');

const components: Array<{ name: string, start: number, end: number, length: number }> = [];

let currentComponent: any = null;
let currentLevel = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // crude finding of components
  const match = line.match(/^(?:export )?(?:default )?(?:function|const) ([A-Z][a-zA-Z0-9_]*)/);
  if (match) {
    if (currentComponent) {
      currentComponent.end = i - 1;
      currentComponent.length = currentComponent.end - currentComponent.start + 1;
      components.push(currentComponent);
    }
    currentComponent = { name: match[1], start: i + 1, end: i + 1, length: 0 };
  }
}

if (currentComponent) {
  currentComponent.end = lines.length;
  currentComponent.length = currentComponent.end - currentComponent.start + 1;
  components.push(currentComponent);
}

const views = components.map(c => {
  const compCode = lines.slice(c.start - 1, c.end).join('\n');
  const stores = [...compCode.matchAll(/useStore\(\w+ => \w+\.([a-zA-Z0-9]+)/g)].map(m => m[1]);
  const hasAiService = compCode.includes('aiService');
  const hasSetCurrentView = compCode.includes('setCurrentView');
  const isEasterEgg = c.name.startsWith('The') || c.name === 'GodMode' || compCode.includes('Meme');
  return { ...c, stores: [...new Set(stores)], hasAiService, hasSetCurrentView, isEasterEgg };
});

console.log("VIEWS FOUND:", views.length);
console.table(views.map(v => ({ name: v.name, lines: v.length, isEgg: v.isEasterEgg, stores: v.stores.slice(0, 3).join(',') + (v.stores.length > 3 ? '...' : '') })));

const jsonExtract = JSON.stringify(views, null, 2);
fs.writeFileSync('app_meta.json', jsonExtract);
