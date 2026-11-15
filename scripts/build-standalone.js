// Builds dist/VideoText.html: the whole app in one file that runs in Chrome or Edge with no install.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'app', 'index.html'), 'utf8');
const lib = fs.readFileSync(path.join(root, 'app', 'mediabunny.min.js'), 'utf8');
if (lib.includes('</script')) throw new Error('library contains a closing script tag');
const tag = '<script src="mediabunny.min.js"></script>';
if (!html.includes(tag)) throw new Error('script tag not found in app/index.html');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'VideoText.html'), html.replace(tag, () => '<script>' + lib + '</script>'));
console.log('Wrote dist/VideoText.html');
