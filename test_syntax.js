const fs = require('fs');
const html = fs.readFileSync('LSOrounds.html', 'utf8');
const scriptStart = html.indexOf('<script type="module">') + '<script type="module">'.length;
const scriptEnd = html.indexOf('</script>', scriptStart);
const script = html.slice(scriptStart, scriptEnd);
fs.writeFileSync('LSOrounds.mjs', script);
console.log('written');
