// Builds dist/CodeCaption.html: the whole app in one file that runs in Chrome or Edge with no install.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'app', 'index.html'), 'utf8');
let out = html;
for (const name of ['captions.js', 'mediabunny.min.js']) {
  const lib = fs.readFileSync(path.join(root, 'app', name), 'utf8');
  if (lib.includes('</script')) throw new Error(name + ' contains a closing script tag');
  const tag = `<script src="${name}"></script>`;
  if (!out.includes(tag)) throw new Error('script tag for ' + name + ' not found in app/index.html');
  out = out.replace(tag, () => '<script>' + lib + '</script>');
}
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'CodeCaption.html'), out);
console.log('Wrote dist/CodeCaption.html');
