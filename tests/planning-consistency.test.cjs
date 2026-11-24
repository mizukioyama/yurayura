const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const content = require('../assets/js/information-content.js');

const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const visibleText = html => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

test('changed shared assets and the shared fragments use content-matched cache identifiers', () => {
  const assets = [
    'assets/css/faq.css',
    'assets/css/main.css',
    'assets/css/menu-style.css',
    'assets/css/participation.css',
    'assets/css/user-settings.css',
    'assets/js/allmenu.js'
  ];
  const digest = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex').slice(0, 12);
  const partsHash = crypto.createHash('sha256');
  const partsDir = path.join(root, 'assets/parts');
  for (const name of fs.readdirSync(partsDir).sort()) {
    const partPath = path.join(partsDir, name);
    if (!fs.statSync(partPath).isFile()) continue;
    partsHash.update(name); partsHash.update('\0'); partsHash.update(fs.readFileSync(partPath)); partsHash.update('\0');
  }
  const partsVersion = partsHash.digest('hex').slice(0, 12);
  const loader = read('assets/js/allmenu.js');
  assert(loader.includes('const PARTS_VERSION = "' + partsVersion + '";'));
  assert(loader.includes('cache: "no-cache"'), 'parts fetch must revalidate so a stale version still serves current parts');
  const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
  for (const page of pages) {
    const html = read(page);
    for (const asset of assets) {
      const relative = './' + asset;
      if (!html.includes(relative)) continue;
      const escaped = asset.split('.').join('\\.');
      const refs = [...html.matchAll(new RegExp('(?:href|src)="\\.\\/' + escaped + '\\?v=([a-f0-9]{12})"', 'g'))];
      assert(refs.length > 0, page + ': missing versioned reference for ' + asset);
      for (const ref of refs) assert.equal(ref[1], digest(asset), page + ': stale cache id for ' + asset);
    }
  }
});

test('public preparation notice matches its source on all three static pages', () => {
  for (const name of ['index.html', 'information.html', 'apply.html']) {
    const html = read(name);
    const matches = [...html.matchAll(/<!-- INFORMATION:PLANNING:START -->([\s\S]*?)<!-- INFORMATION:PLANNING:END -->/g)];
    assert.equal(matches.length, 1, name);
    assert.equal(matches[0][1], content.planningNotice(name === 'information.html' ? 'information' : undefined), name);
  }
});

test('approved second-show details are synchronized across pages', () => {
  // Second-show recruitment terms were approved on 2026-11-18: fee 20,000 yen,
  // 6 artists, max 6 works, F4 guide, 2026-11-28 11:00 to 2027-01-15 20:00 JST.
  // The exhibition dates were decided on 2026-11-24: 2027-03-20 to 2027-03-28.
  const header = read('assets/parts/header.html');
  assert(header.includes('次回開催：岩手県 2027年3月20日〜28日開催'));
  // The footer is loaded from footer.xml (allmenu.js), not footer.html.
  const footer = read('assets/parts/footer.xml');
  assert(footer.includes('次回開催：岩手県 2027年3月20日〜28日開催'));

  const information = visibleText(read('information.html'));
  for (const value of ['企画検討中', '岩手県盛岡市', '2027年3月20日', 'Life Art Gallery auswahi', '東北堂大通ビル']) {
    assert(information.includes(value), 'information.html: ' + value);
  }

  for (const name of ['apply.html']) {
    const html = read(name);
    const text = visibleText(html);
    for (const value of [
      '2027年3月20日（土）〜28日（日）',
      '岩手県盛岡市',
      'Life Art Gallery auswahi',
      '東北堂大通ビル',
      '20,000円',
      '募集人数 6名',
      '1人最大6点 ※総作品数で変動します。',
      'F4号を目安',
      '2026年11月28日 11:00',
      '2027年1月15日 20:00',
      '68.33㎡',
      '使用可能な展示面積・壁面面積ではありません',
      'すべての作品の展示を保証するものではありません'
    ]) assert(text.includes(value), name + ': ' + value);
    // Apply carries no past-show information or records (decided 2026-11-24):
    // no first-show reference section and no first-show recruitment window.
    assert(!text.includes('参考：第1回'), name + ': no first-show reference section');
    assert(!text.includes('第1回'), name + ': no past-show information');
    assert(!text.includes('2027年1月29日'), name + ': no first-show recruitment window');
    assert(!text.includes('未定（確定次第、正式な募集要項でご案内します）'), name + ': next-show overview values decided');
    assert(text.includes('展示作品数は1人最大6点（総作品数で変動します）'), name + ': next-show detail limits decided');
    assert(!text.includes('展示作品数は1人最大8点'), name + ': stale prior limit');
    assert(!/2027年4〜5月|2027年4月|2027-01-16|岩手県または栃木県/.test(text), name);
    assert(html.includes('出展申し込みの受付は停止中です') || html.includes('受付停止中'), name);
    if (name === 'apply.html') {
      assert(/<form\b[^>]*id="applicationForm"/i.test(html), 'public Apply carries the application form');
      assert(html.includes('data-application-endpoint=""'), 'receiver endpoint stays unconfigured until verified');
      assert(!html.includes('script.google.com/macros'), 'no receiver URL is published before verification');
      assert(html.includes('data-application-form-wrap hidden'), 'application form stays hidden until the state opens');
      assert(html.includes('target="_blank" rel="noopener noreferrer">会場イメージ写真'), 'public venue-photo link must use safe new-tab attributes');
    }
  }

  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  const second = events.find(event => event.id === 'yurayura-02');
  assert.deepEqual(second.recruitment, {published: true, startsAt: '2026-11-28T11:00:00+09:00', endsAt: '2027-01-15T20:00:00+09:00', receiverVerified: true}, 'second-show recruitment is published with a verified receiver');
  assert(!events.find(event => event.id === 'yurayura-01').recruitment, 'first show has no recruitment');
});

test('sync detects a stale TOP notice and repairs only the temporary fixture', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yurayura-information-sync-'));
  fs.cpSync(root, dir, {recursive: true});
  const run = (...args) => spawnSync(process.execPath, ['scripts/sync-information.cjs', ...args], {cwd: dir, encoding: 'utf8'});
  assert.equal(run().status, 0, 'normalize the temporary copy before testing staleness');
  const top = path.join(dir, 'index.html');
  const before = fs.readFileSync(top, 'utf8');
  const eventsPath = path.join(dir, 'assets/data/exhibitions.json');
  const eventsBefore = fs.readFileSync(eventsPath, 'utf8');
  fs.writeFileSync(top, before.replace(content.planningNotice(), 'STALE_TEST_NOTICE'));
  assert.notEqual(run('--check').status, 0);
  assert.equal(run().status, 0);
  assert.equal(run('--check').status, 0);
  assert.equal(fs.readFileSync(top, 'utf8'), before);
  assert.equal(fs.readFileSync(eventsPath, 'utf8'), eventsBefore);
});

test('changing only the footer part refreshes the shared parts cache identifier', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yurayura-parts-cache-'));
  fs.cpSync(root, dir, {recursive: true});
  const run = (...args) => spawnSync(process.execPath, ['scripts/sync-information.cjs', ...args], {cwd: dir, encoding: 'utf8'});
  assert.equal(run().status, 0, 'normalize the temporary copy before testing staleness');
  const loaderPath = path.join(dir, 'assets/js/allmenu.js');
  const versionOf = source => source.match(/const PARTS_VERSION = "([a-f0-9]{12})";/)[1];
  const before = versionOf(fs.readFileSync(loaderPath, 'utf8'));
  const footerPath = path.join(dir, 'assets/parts/footer.xml');
  fs.writeFileSync(footerPath, fs.readFileSync(footerPath, 'utf8') + '\n<!-- parts cache fixture -->\n');
  assert.notEqual(run('--check').status, 0, 'a footer-only change must make the cache identifier stale');
  assert.equal(run().status, 0);
  assert.notEqual(versionOf(fs.readFileSync(loaderPath, 'utf8')), before, 'a footer-only change must change PARTS_VERSION');
  assert.equal(run('--check').status, 0);
});

test('displayed JST dates open the verified receiver only inside the recruitment window', () => {
  const state = require('../assets/js/exhibition-state.js');
  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  const at = iso => state.recruitmentView(state.visibleEvents(events), Date.parse(iso)).state;
  assert.equal(at('2026-11-28T10:59:59+09:00'), 'upcoming');
  assert.equal(at('2026-11-28T11:00:00+09:00'), 'open');
  assert.equal(at('2026-12-15T12:00:00+09:00'), 'open');
  assert.equal(at('2027-01-15T19:59:59+09:00'), 'open');
  assert.equal(at('2027-01-15T20:00:00+09:00'), 'closed');
  assert.equal(at('2027-01-30T12:00:00+09:00'), 'closed');
  const applyHtml = read('apply.html');
  assert(applyHtml.includes('data-application-endpoint=""'), 'endpoint is injected by application-form.js, not hardcoded in HTML');
  const formJs = read('assets/js/application-form.js');
  assert(formJs.includes('script.google.com/macros/s/'), 'verified receiver URL is configured in application-form.js');
});
