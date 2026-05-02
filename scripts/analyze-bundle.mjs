import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function analyze() {
  if (!fs.existsSync(distPath)) {
    console.error('Error: dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }

  const assetsPath = path.join(distPath, 'assets');
  let files = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        files.push({
          name: path.relative(distPath, fullPath),
          size: stat.size,
          ext: path.extname(fullPath)
        });
      }
    }
  }

  walk(distPath);

  const jsFiles = files.filter(f => f.ext === '.js').sort((a, b) => b.size - a.size);
  const cssFiles = files.filter(f => f.ext === '.css').sort((a, b) => b.size - a.size);

  process.stdout.write('\n📊 BUNDLE ANALYSIS REPORT\n');
  process.stdout.write('==========================\n\n');

  process.stdout.write(`Total JS Chunks: ${jsFiles.length}\n`);
  const totalJsSize = jsFiles.reduce((acc, f) => acc + f.size, 0);
  process.stdout.write(`Total JS Size: ${formatSize(totalJsSize)}\n\n`);

  process.stdout.write(`Total CSS Chunks: ${cssFiles.length}\n`);
  const totalCssSize = cssFiles.reduce((acc, f) => acc + f.size, 0);
  process.stdout.write(`Total CSS Size: ${formatSize(totalCssSize)}\n\n`);

  process.stdout.write('Top 5 Largest JS Chunks:\n');
  jsFiles.slice(0, 5).forEach((f, i) => {
    process.stdout.write(`${i + 1}. ${f.name} - ${formatSize(f.size)}\n`);
  });

  process.stdout.write('\nRecommended Optimization Targets (> 200KB):\n');
  const heavy = jsFiles.filter(f => f.size > 200 * 1024);
  if (heavy.length === 0) {
    process.stdout.write('None found. Good job!\n');
  } else {
    heavy.forEach(f => {
      process.stdout.write(`⚠️  ${f.name} (${formatSize(f.size)})\n`);
    });
  }

  process.stdout.write('\n==========================\n');
}

analyze().catch(console.error);
