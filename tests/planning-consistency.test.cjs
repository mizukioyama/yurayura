const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const content = require('../assets/js/information-content.js');

test('public preparation notice matches its source on all four static pages', () => {
  for (const name of ['index.html', 'information.html', 'apply.html', 'review-apply.html']) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    const matches = [...html.matchAll(/<!-- INFORMATION:PLANNING:START -->([\s\S]*?)<!-- INFORMATION:PLANNING:END -->/g)];
    assert.equal(matches.length, 1, name);
    assert.equal(matches[0][1], content.planningNotice(), name);
  }
});

test('application conditions are explicit while unapproved venue and reception stay unpublished', () => {
  for (const name of ['apply.html', 'review-apply.html']) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert(!/岩手|栃木|盛岡|auswahi|2027-01-16|2027年3月|2027年4月/.test(html), name);
    for (const value of ['20,000円', '<dt>募集人数</dt><dd>5名</dd>', '1人最大8点', 'F4号を目安', '2026-11-28T11:00:00+09:00', '2027-01-29T20:00:00+09:00', '68.33㎡', '使用可能な展示面積・壁面面積ではありません', 'すべての作品の展示を保証するものではありません']) assert(html.includes(value), name + ' ' + value);
    assert(html.includes('会場は未確定です。'));
    assert(!/<img[^>]+(?:floor|plan|図面)/i.test(html));
    assert(html.includes('受付は停止中') || html.includes('受付停止中'), name);
    if (name === 'apply.html') assert(!/<form\b/i.test(html));
    else {
      assert(html.includes('送信・保存されません'));
      assert(!/<form[^>]+action=/i.test(html));
    }
  }
  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  assert(events.every(event => !event.recruitment), 'Preparation-only release must not change recruitment configuration');
});

test('sync detects a stale TOP notice and repairs only the temporary fixture', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yurayura-information-sync-'));
  fs.cpSync(root, dir, {recursive: true});
  const top = path.join(dir, 'index.html');
  const before = fs.readFileSync(top, 'utf8');
  fs.writeFileSync(top, before.replace(content.planningNotice(), 'STALE_TEST_NOTICE'));
  const run = (...args) => spawnSync(process.execPath, ['scripts/sync-information.cjs', ...args], {cwd: dir, encoding: 'utf8'});
  assert.notEqual(run('--check').status, 0);
  assert.equal(run().status, 0);
  assert.equal(run('--check').status, 0);
  assert.equal(fs.readFileSync(top, 'utf8'), before);
  assert.equal(fs.readFileSync(path.join(dir, 'assets/data/exhibitions.json'), 'utf8'), fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
});

test('application and review overview and venue information remain synchronized', () => {
  const read = name => fs.readFileSync(path.join(root, name), 'utf8');
  const section = html => html.slice(html.indexOf('<h3>開催概要</h3>'), html.indexOf('<h2>次回展示の開催別条件</h2>'));
  assert.equal(section(read('apply.html')), section(read('review-apply.html')));
});

test('displayed JST dates never open the real receiver before, during or after recruitment', () => {
  const state = require('../assets/js/exhibition-state.js');
  const events = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/exhibitions.json'), 'utf8'));
  for (const iso of ['2026-11-28T10:59:59+09:00', '2026-11-28T11:00:00+09:00', '2026-12-15T12:00:00+09:00', '2027-01-29T19:59:59+09:00', '2027-01-29T20:00:00+09:00', '2027-01-30T12:00:00+09:00']) {
    const view = state.recruitmentView(state.visibleEvents(events), Date.parse(iso));
    assert.notEqual(view.state, 'open', iso);
    assert(!view.applicationUrl, iso);
  }
  assert(!/<form\b/i.test(fs.readFileSync(path.join(root, 'apply.html'), 'utf8')));
});
