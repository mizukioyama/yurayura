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

test('preparation-only pages exclude previous conditions and keep reception disabled', () => {
  for (const name of ['apply.html', 'review-apply.html']) {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    assert(!/20\d{2}年\d{1,2}月|岩手|栃木|盛岡|auswahi|68\.33|20,000円|最大5名|2026-11-28|2027-01-16/.test(html), name);
    for (const label of ['参加費', '募集人数', '募集予定期間']) {
      assert(html.includes('<dt>' + label + '</dt><dd>未定</dd>'), name + ' ' + label);
    }
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
