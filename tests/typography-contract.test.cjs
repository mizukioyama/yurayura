const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cssDir = path.join(root, 'assets/css');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
// Mask comments and quoted strings without treating comment markers inside strings as comments.
// Preserve offsets and delimiters so only declaration positions are inspected.
const maskCSS = text => {
  let out = '', quote = null, comment = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (comment) {
      if (c === '*' && n === '/') { out += '  '; i++; comment = false; }
      else out += c === '\n' ? '\n' : ' ';
    } else if (quote) {
      if (c === '\\') { out += '  '; i++; }
      else { out += c === '\n' ? '\n' : ' '; if (c === quote) quote = null; }
    } else if (c === '/' && n === '*') { comment = true; out += '  '; i++; }
    else if (c === '"' || c === "'") { quote = c; out += ' '; }
    else out += c;
  }
  return out;
};
const shadowCSS = text => [...text.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => maskCSS(m[1])).join('\n');
const inlineCSS = html => {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return [...markup.matchAll(/\bstyle\s*=\s*("[^"]*"|'[^']*')/gi)].map(m => maskCSS(m[1].slice(1, -1))).join(';') +
    [...markup.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => maskCSS(m[1])).join('\n');
};
const pages = ['index', 'concept', 'gallery', 'information', 'contact', 'policy', 'profile', 'participate', 'exhibitions', 'venues', 'support'];
const settings = maskCSS(read('assets/css/user-settings.css'));
const inactive = new Set(['works-list.css', 'top-sections.css']);

test('canonical pages load the typography owner and leave legacy styles isolated', () => {
  for (const page of pages) {
    const html = read(`${page}.html`);
    assert.equal((html.match(/href="\.\/assets\/css\/user-settings\.css(?:\?[^" ]*)?"/g) || []).length, 1, page);
    for (const file of inactive) assert(!html.includes(`assets/css/${file}`), `${page}: evaluate legacy typography before activating ${file}`);
    assert(!/(?:^|[;{}])\s*(?:font-size|font)\s*:/i.test(inlineCSS(html)), `${page}: keep typography out of inline markup`);
  }
});

test('font-size settings have one owner; reset primitives are explicit exceptions', () => {
  for (const file of fs.readdirSync(cssDir).filter(file => file.endsWith('.css'))) {
    if (file === 'user-settings.css' || inactive.has(file)) continue;
    const css = maskCSS(read(`assets/css/${file}`));
    const values = [...css.matchAll(/(?:^|[;{}])\s*font-size\s*:\s*([^;}]+)/g)].map(match => match[1].trim());
    if (file === 'reset.css') assert.deepEqual(values, ['1rem', '100%', '75%'], 'reset: inherited/browser primitives only');
    else assert.deepEqual(values, [], `${file}: define sizes in user-settings.css`);
    const shorthand = [...css.matchAll(/(?:^|[;{}])\s*font\s*:\s*([^;}]+)/g)].map(match => match[1].replace(/\s*!important\s*$/, '').trim());
    assert(shorthand.every(value => value === 'inherit'), `${file}: font shorthand must not introduce another size owner`);
  }
});

test('deprecated aliases and pure typography alias chains cannot return', () => {
  const files = fs.readdirSync(cssDir).filter(file => file.endsWith('.css') && !inactive.has(file));
  const css = files.map(file => maskCSS(read(`assets/css/${file}`))).join('\n');
  assert(!/--(?:responsive-copy-size|responsive-heading-2|responsive-heading-3|responsive-small-heading|button-font-size)\b/.test(css));
  assert(!/--type-[\w-]+\s*:\s*var\(\s*--type-[\w-]+\s*\)\s*(?:;|})/.test(settings), 'derive sizes only when the expression has an independent purpose');
});

test('declared typography tokens have consumers and all consumers have settings', () => {
  const definitions = new Set([...settings.matchAll(/(--type-[\w-]+)\s*:/g)].map(match => match[1]));
  const code = fs.readdirSync(cssDir).filter(file => file.endsWith('.css') && !inactive.has(file)).map(file => maskCSS(read(`assets/css/${file}`))).join('\n') + '\n' + shadowCSS(read('assets/js/liquid-button.js'));
  const references = new Set([...code.matchAll(/var\(\s*(--type-[\w-]+)/g)].map(match => match[1]));
  for (const token of definitions) assert(references.has(token), `${token}: unused setting`);
  for (const token of references) assert(definitions.has(token), `${token}: missing owner`);
});

test('shadow controls inherit canonical sizes while keeping standalone fallback separate', () => {
  const js = shadowCSS(read('assets/js/liquid-button.js'));
  const declarations = [...js.matchAll(/(?:^|[;{}])\s*font-size\s*:\s*([^;}]+)[;}]/g)].map(match => match[1].trim());
  assert.equal(declarations.length, 4);
  for (const value of declarations) assert(/^var\(--type-liquid-(?:button|small|medium|large)-size,\s*clamp\(/.test(value));
  assert(!js.includes('--button-font-size'));
});

test('contract scanner ignores comments and quoted examples but sees real declarations', () => {
  const sample = `/* font-size: 99px; --type-unused: 1px; */
    .example { content: "/* font-size: 88px; --type-ghost: var(--type-missing); */";
      font-size: var(--type-body-size); }
    .escaped { content: 'font-size: 77px;'; }`;
  const parsed = maskCSS(sample);
  assert.equal((parsed.match(/(?:^|[;{}])\s*font-size\s*:/g) || []).length, 1);
  assert(!parsed.includes('--type-missing'));
  assert(!parsed.includes('--type-unused'));
  assert.match(parsed, /var\(--type-body-size\)/);
  assert.equal(inlineCSS('<!-- <b style="font-size:99px"> --> <p>font-size: 88px</p>'), '');
  assert.match(inlineCSS('<b style="font-size:12px">'), /font-size:12px/);
  assert.equal(shadowCSS('const example="font-size:99px";'), '');
  assert.match(shadowCSS('<style>.button {font-size:var(--type-liquid-button-size, 16px)}</style>'), /font-size:/);
});
