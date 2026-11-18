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

test('public preparation notice matches its source on all four static pages', () => {
  for (const name of ['index.html', 'information.html', 'apply.html', 'review-apply.html']) {
    const html = read(name);
    const matches = [...html.matchAll(/<!-- INFORMATION:PLANNING:START -->([\s\S]*?)<!-- INFORMATION:PLANNING:END -->/g)];
    assert.equal(matches.length, 1, name);
    assert.equal(matches[0][1], content.planningNotice(name === 'information.html' ? 'information' : undefined), name);
  }
});

test('approved second-show details are synchronized without opening reception', () => {
  // Second-show recruitment terms were approved on 2026-11-18: fee 20,000 yen,
  // 6 artists, max 6 works, F4 guide, 2026-11-28 11:00 to 2027-01-15 20:00 JST.
  // The receiver is not verified yet, so reception must still not open.
  const header = read('assets/parts/header.html');
  assert(header.includes('次回開催：岩手県 2027年3月中旬開催'));

  const information = visibleText(read('information.html'));
  for (const value of ['企画検討中', '岩手県盛岡市', '2027年3月中旬', 'Life Art Gallery auswahi', '東北堂大通ビル']) {
    assert(information.includes(value), 'information.html: ' + value);
  }

  for (const name of ['apply.html', 'review-apply.html']) {
    const html = read(name);
    const text = visibleText(html);
    for (const value of [
      '2027年3月中旬',
      '岩手県盛岡市',
      'Life Art Gallery auswahi',
      '東北堂大通ビル',
      '20,000円',
      '募集人数 6名',
      '1人最大6点 ※総作品数で変動します。',
      'F4号を目安',
      '2026年11月28日 11:00',
      '2027年1月29日 20:00',
      '68.33㎡',
      '使用可能な展示面積・壁面面積ではありません',
      'すべての作品の展示を保証するものではありません'
    ]) assert(text.includes(value), name + ': ' + value);
    assert(text.includes('参考：第1回（2026年10月・横浜）の募集条件'), name + ': first-show reference section');
    const overview = text.slice(0, text.indexOf('参考：第1回（2026年10月・横浜）の募集条件'));
    for (const value of ['20,000円', '募集人数 6名', '1人最大6点 ※総作品数で変動します。', 'F4号を目安', '2026年11月28日 11:00', '2027年1月15日 20:00']) assert(overview.includes(value), name + ': second-show overview decided: ' + value);
    const reference = text.slice(text.indexOf('参考：第1回（2026年10月・横浜）の募集条件'));
    for (const value of ['20,000円', '6名', '2027年1月29日 20:00']) assert(reference.includes(value), name + ': first-show reference keeps: ' + value);
    assert(!text.includes('未定（確定次第、正式な募集要項でご案内します）'), name + ': next-show overview values decided');
    assert(text.includes('展示作品数は1人最大6点（総作品数で変動します）'), name + ': next-show detail limits decided');
    assert(!text.includes('展示作品数は1人最大8点'), name + ': stale prior limit');
    assert(!/2027年4〜5月|2027年4月|2027-01-16|岩手県または栃木県/.test(text), name);
    assert(!/datetime="2027-03-\d{2}/.test(html), name + ': exact event date must not be inferred');
    assert(html.includes('出展申し込みの受付は停止中です') || html.includes('受付停止中'), name);
    if (name === 'apply.html') {
      assert(/<form\b[^>]*id="applicationForm"/i.test(html), 'public Apply carries the application form');
      assert(html.includes('data-application-endpoint=""'), 'receiver endpoint stays unconfigured until verified');
      assert(!html.includes('script.google.com/macros'), 'no receiver URL is published before verification');
      assert(html.includes('data-application-form-wrap hidden'), 'application form stays hidden until the state opens');
      assert(html.includes('target="_blank" rel="noopener noreferrer">会場イメージ写真'), 'public venue-photo link must use safe new-tab attributes');
    } else {
      assert(html.includes('送信・保存されません'), 'review demo remains explicitly non-sending');
      assert(/<form\b/i.test(html), 'review-only demo stays available');
      assert(!/<form[^>]+action=/i.test(html), 'review demo must not have a receiver');
    }
  }

  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  const second = events.find(event => event.id === 'yurayura-02');
  assert.deepEqual(second.recruitment, {published: true, startsAt: '2026-11-28T11:00:00+09:00', endsAt: '2027-01-15T20:00:00+09:00', receiverVerified: false}, 'second-show recruitment is published with an unverified receiver');
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

test('application and review overview and venue information remain synchronized', () => {
  const section = html => html.slice(html.indexOf('<h3>開催概要</h3>'), html.indexOf('<h2>次回展示の開催別条件</h2>'));
  assert.equal(section(read('apply.html')), section(read('review-apply.html')));
});

test('displayed JST dates never open the real receiver before, during or after recruitment', () => {
  const state = require('../assets/js/exhibition-state.js');
  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  for (const iso of ['2026-11-28T10:59:59+09:00', '2026-11-28T11:00:00+09:00', '2026-12-15T12:00:00+09:00', '2027-01-15T19:59:59+09:00', '2027-01-15T20:00:00+09:00', '2027-01-30T12:00:00+09:00']) {
    const view = state.recruitmentView(state.visibleEvents(events), Date.parse(iso));
    assert.notEqual(view.state, 'open', iso);
    assert(!view.applicationUrl, iso);
  }
  const applyHtml = read('apply.html');
  assert(applyHtml.includes('data-application-endpoint=""'), 'unverified receiver keeps the form unsubmittable');
  assert(!applyHtml.includes('script.google.com/macros'), 'no receiver URL is published before verification');
});
