const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cssDir = path.join(root, 'assets/css');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const uncomment = text => text.replace(/\/\*[\s\S]*?\*\//g, '');
const pages = ['index', 'concept', 'gallery', 'information', 'contact', 'policy', 'profile', 'participate', 'exhibitions', 'venues', 'support'];
const settings = uncomment(read('assets/css/user-settings.css'));
const inactive = new Set(['works-list.css', 'top-sections.css']);

test('canonical pages load the typography owner and leave legacy styles isolated', () => {
  for (const page of pages) {
    const html = read(`${page}.html`);
    assert.equal((html.match(/href="\.\/assets\/css\/user-settings\.css(?:\?[^" ]*)?"/g) || []).length, 1, page);
    for (const file of inactive) assert(!html.includes(`assets/css/${file}`), `${page}: evaluate legacy typography before activating ${file}`);
    assert(!/font-size\s*:|style=["'][^"']*\bfont\s*:/i.test(html), `${page}: keep typography out of inline markup`);
  }
});

test('font-size settings have one owner; reset primitives are explicit exceptions', () => {
  for (const file of fs.readdirSync(cssDir).filter(file => file.endsWith('.css'))) {
    if (file === 'user-settings.css' || inactive.has(file)) continue;
    const css = uncomment(read(`assets/css/${file}`));
    const values = [...css.matchAll(/\bfont-size\s*:\s*([^;}]+)/g)].map(match => match[1].trim());
    if (file === 'reset.css') assert.deepEqual(values, ['1rem', '100%', '75%'], 'reset: inherited/browser primitives only');
    else assert.deepEqual(values, [], `${file}: define sizes in user-settings.css`);
    const shorthand = [...css.matchAll(/(?:^|[;{}])\s*font\s*:\s*([^;}]+)/g)].map(match => match[1].replace(/\s*!important\s*$/, '').trim());
    assert(shorthand.every(value => value === 'inherit'), `${file}: font shorthand must not introduce another size owner`);
  }
});

test('deprecated aliases and pure typography alias chains cannot return', () => {
  const files = fs.readdirSync(cssDir).filter(file => file.endsWith('.css') && !inactive.has(file));
  const css = files.map(file => uncomment(read(`assets/css/${file}`))).join('\n');
  assert(!/--(?:responsive-copy-size|responsive-heading-2|responsive-heading-3|responsive-small-heading|button-font-size)\b/.test(css));
  assert(!/--type-[\w-]+\s*:\s*var\(\s*--type-[\w-]+\s*\)\s*;/.test(settings), 'derive sizes only when the expression has an independent purpose');
});

test('declared typography tokens have consumers and all consumers have settings', () => {
  const definitions = new Set([...settings.matchAll(/(--type-[\w-]+)\s*:/g)].map(match => match[1]));
  const code = fs.readdirSync(cssDir).filter(file => file.endsWith('.css') && !inactive.has(file)).map(file => uncomment(read(`assets/css/${file}`))).join('\n') + '\n' + uncomment(read('assets/js/liquid-button.js'));
  const references = new Set([...code.matchAll(/var\(\s*(--type-[\w-]+)/g)].map(match => match[1]));
  for (const token of definitions) assert(references.has(token), `${token}: unused setting`);
  for (const token of references) assert(definitions.has(token), `${token}: missing owner`);
});

test('shadow controls inherit canonical sizes while keeping standalone fallback separate', () => {
  const js = uncomment(read('assets/js/liquid-button.js'));
  const declarations = [...js.matchAll(/font-size\s*:\s*([^;]+);/g)].map(match => match[1].trim());
  assert.equal(declarations.length, 4);
  for (const value of declarations) assert(/^var\(--type-liquid-(?:button|small|medium|large)-size,\s*clamp\(/.test(value));
  assert(!js.includes('--button-font-size'));
});
