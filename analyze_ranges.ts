import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/App.tsx');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const componentMatches = [];
const regex = /^(?:export\s+)?(?:const|function)\s+([A-Z][a-zA-Z0-9_]*)/;

for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(regex);
  if (match) {
    componentMatches.push({ name: match[1], line: i + 1 });
  }
}

// Add the end of the file as a boundary
componentMatches.push({ name: 'EOF', line: lines.length + 1 });

const result = [];
for (let i = 0; i < componentMatches.length - 1; i++) {
  const start = componentMatches[i].line;
  const end = componentMatches[i + 1].line - 1;
  const length = end - start + 1;
  
  const chunk = lines.slice(start - 1, end).join('\n');
  const stores = [...new Set([...chunk.matchAll(/useStore\([^{]*=>[^{]*\.([a-zA-Z0-9]+)/g)].map(m => m[1]))];
  const destructuredStores = [...new Set([...chunk.matchAll(/const\s*{\s*([^}]+)\s*}\s*=\s*useStore\(\)/g)].flatMap(m => m[1].split(',').map(s => s.trim().split(':')[0].trim())))];
  
  const allStores = [...new Set([...stores, ...destructuredStores])];
  const services = [...new Set([...chunk.matchAll(/(aiService|firebase|html2canvas)\./g)].map(m => m[1]))];

  result.push({
    name: componentMatches[i].name,
    start,
    end,
    length,
    stores: allStores,
    services
  });
}

console.log(JSON.stringify(result, null, 2));
