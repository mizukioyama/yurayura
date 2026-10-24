const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const pages = ['index', 'concept', 'gallery', 'information', 'contact', 'policy', 'profile', 'participate', 'exhibitions', 'venues', 'support'];

test('all public pages expose a static bypass link before the asynchronous header', () => {
  for (const page of pages) {
    const html = read(page + '.html');
    const body = html.slice(html.indexOf('<body'));
    assert.match(body, /^<body\b[^>]*>\s*<a class="skip-link" href="#main">本文へスキップ<\/a>/);
    assert.equal((html.match(/class="skip-link"/g) || []).length, 1);
    assert.match(html, /<main\b[^>]*id="main"[^>]*tabindex="-1"/);
    assert(body.indexOf('class="skip-link"') < body.indexOf('id="js-header"'));
  }
});

test('each artwork has one native dialog trigger named by its visible title and metadata', () => {
  const html = read('gallery.html');
  const cards = [...html.matchAll(/<article\b[^>]*class="work gallery-card"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 18);
  const ids = new Set();
  for (const [card] of cards) {
    assert.equal((card.match(/<button\b/g) || []).length, 1);
    assert(!/<a\b|tabindex=|role="button"/.test(card));
    assert.match(card, /<button\b[^>]*type="button"/);
    assert.match(card, /aria-haspopup="dialog"/);
    assert.match(card, /aria-controls="galleryModal"/);
    const labels = card.match(/aria-labelledby="([^"]+)"/)[1].split(' ');
    assert.equal(labels.length, 2);
    for (const id of labels) {
      assert(!ids.has(id)); ids.add(id);
      assert(card.includes('id="' + id + '"'));
    }
    assert(card.includes('Artist：'));
  }
});
