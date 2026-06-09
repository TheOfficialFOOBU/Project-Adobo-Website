const fs = require('fs');
const s = fs.readFileSync('index.html', 'utf8');
const voids = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
const regex = /<\/?([a-zA-Z0-9:-]+)(\s[^>]*)?>/g;
let stack = [];
let m;
while ((m = regex.exec(s)) !== null) {
  const raw = m[0];
  const tag = m[1];
  const isClose = raw.startsWith('</');
  const low = tag.toLowerCase();
  if (!isClose) {
    if (!voids.has(low)) stack.push({ tag: low, index: m.index });
  } else {
    if (stack.length === 0) {
      console.log('Unmatched closing tag:', tag, 'at index', m.index);
      process.exit(0);
    }
    const last = stack[stack.length - 1];
    if (last.tag === low) {
      stack.pop();
    } else {
      console.log(
        'Mismatched closing tag:',
        tag,
        'at index',
        m.index,
        'expected to close',
        last.tag
      );
      process.exit(0);
    }
  }
}
if (stack.length) {
  console.log('Unclosed tag at end:', stack[stack.length - 1]);
} else {
  console.log('All tags balanced according to simple parser');
}
