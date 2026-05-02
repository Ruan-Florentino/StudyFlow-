import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const ROOT = process.cwd();
const SRC = join(ROOT, 'assets', 'branding', 'icon-master.png');
const OUT = join(ROOT, 'public', 'icons');

if (!existsSync(SRC)) {
  console.error(`❌ Master icon não encontrado em: ${SRC}`);
  process.exit(1);
}

if (!existsSync(OUT)) {
  mkdirSync(OUT, { recursive: true });
}

console.log(`📂 SRC: ${SRC}`);
console.log(`📂 OUT: ${OUT}`);

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32.png', size: 32 },
];

async function generateMaskable() {
  const size = 512;
  const innerSize = Math.round(size * 0.8);
  const padding = Math.round((size - innerSize) / 2);

  const inner = await sharp(SRC)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: inner, top: padding, left: padding }])
    .png()
    .toFile(join(OUT, 'icon-512-maskable.png'));

  console.log('✅ icon-512-maskable.png');
}

async function generateAll() {
  for (const { name, size } of targets) {
    await sharp(SRC)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .png()
      .toFile(join(OUT, name));
    console.log(`✅ ${name} (${size}x${size})`);
  }
  await generateMaskable();
}

generateAll().catch((err) => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
