const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// A simple 1x1 green pixel PNG base64
// We can use it as a placeholder until the real ones are provided
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88v//fwAJagPY8mQZpgAAAABJRU5ErkJggg==';
const buffer = Buffer.from(pngBase64, 'base64');

['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png', 'favicon-32.png'].forEach(file => {
  fs.writeFileSync(path.join(dir, file), buffer);
});
console.log('Icons generated.');
