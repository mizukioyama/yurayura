const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { eventState, recruitmentState, groupEvents, informationGroups, visibleEvents } = require('../assets/js/exhibition-state.js');
const { publicEvents } = require('../scripts/export-public-events.cjs');

const copy = {
  yurayura: {
    ja: 'ゆらゆらが大切にしている、作品を理解するのではなく体感するということ。',
    en: 'Yurayura values experiencing the artwork rather than trying to understand it.'
  },
  portfolio: {
    ja: '2026年10月6日から12日まで開催したグループ展「ゆらゆら」のアーカイブです。展示の背景やコンセプト、参加作家、今後の目標をまとめています。初回の会期は終了しました。',
    en: 'This is the archive of the group exhibition “Yurayura,” held October 6–12, 2026. It brings together the exhibition’s background, concept, participating artists, and future goals. The first edition has concluded.'
  }
};
const event = {
  id: 'example-01', edition: 1, published: true, city: '横浜', venue: '確認済み会場',
  startsAt: '2026-10-06T13:00:00+09:00', endsAt: '2026-10-12T13:00:00+09:00',
  officialUrl: 'https://mizukioyama.github.io/yurayura/information.html#past-exhibitions',
  portfolioDetailUrl: 'https://mizukioyama.github.io/website/exhibitions/yurayura/',
  galleryUrl: './gallery.html', artists: ['Mizuki', 'かおる'], artworkCount: 18, copy
};

test('JST event boundaries, independent of host timezone', () => {
  const start = Date.parse('2026-10-06T04:00:00Z'), end = Date.parse('2026-10-12T04:00:00Z');
  assert.equal(eventState(event, start - 1), 'upcoming');
  assert.equal(eventState(event, start), 'current');
  assert.equal(eventState(event, end - 1), 'current');
  assert.equal(eventState(event, end), 'past');
});

test('unpublished and malformed events fail closed', () => {
  assert.equal(eventState({ ...event, published: false }), 'unpublished');
  assert.equal(eventState({ ...event, startsAt: '2026-10-06T13:00:00' }), 'unknown');
  assert.equal(eventState({ ...event, endsAt: event.startsAt }), 'unknown');
  assert.equal(eventState(event, NaN), 'unknown');
});

test('recruitment requires verified receiver and respects exact deadline', () => {
  const e = { ...event, recruitment: { published: true, receiverVerified: true, startsAt: event.startsAt, endsAt: event.endsAt } };
  const start = Date.parse(event.startsAt), end = Date.parse(event.endsAt);
  assert.equal(recruitmentState(e, start - 1), 'planning');
  assert.equal(recruitmentState(e, start), 'open');
  assert.equal(recruitmentState(e, end - 1), 'open');
  assert.equal(recruitmentState(e, end), 'closed');
  assert.equal(recruitmentState({ ...e, recruitment: { ...e.recruitment, receiverVerified: false } }, start), 'planning');
  assert.equal(recruitmentState({ ...e, published: false }, start), 'planning');
});

test('public export retains four bilingual site-specific copies and strips private fields', () => {
  const rows = publicEvents([
    { ...event, privateNotes: 'PRIVATE', recruitment: { published: false, secret: 'PRIVATE' } },
    { ...event, id: 'private', published: false, privateNotes: 'PRIVATE' }
  ]);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].copy, copy);
  assert.equal(rows[0].officialUrl, event.officialUrl);
  assert.equal(rows[0].portfolioDetailUrl, event.portfolioDetailUrl);
  assert.equal(rows[0].artworkCount, 18);
  assert(!JSON.stringify(rows).includes('PRIVATE'));
  assert(!('recruitment' in rows[0]));
  assert.throws(() => publicEvents([event, event]));
  assert.throws(() => publicEvents([event, { ...event, id: 'edition-conflict', edition: 1 }]));
  assert.throws(() => publicEvents([{ ...event, galleryUrl: 'https://example.com' }]));
  assert.throws(() => publicEvents([{ ...event, officialUrl: 'javascript:alert(1)' }]));
  assert.throws(() => publicEvents([{ ...event, portfolioDetailUrl: 'https://evil.example/website/exhibitions/yurayura/' }]));
  assert.throws(() => publicEvents([{ ...event, officialUrl: 'https://user@example.com@mizukioyama.github.io/yurayura/information.html' }]));
  assert.throws(() => publicEvents([{ ...event, portfolioDetailUrl: 'https://user@mizukioyama.github.io/website/exhibitions/yurayura/' }]));
});

test('both locales are required for each site-specific copy block', () => {
  assert.throws(() => publicEvents([{ ...event, copy: { ...copy, portfolio: { ja: copy.portfolio.ja } } }]));
  assert.throws(() => publicEvents([{ ...event, copy: { ...copy, yurayura: { ...copy.yurayura, en: '' } } }]));
});

test('unconfirmed dates and locations remain explicitly undated instead of being fabricated', () => {
  const draft = { ...event, id: 'future-undated', edition: 2, city: null, venue: null, startsAt: null, endsAt: null, portfolioDetailUrl: undefined };
  assert.equal(eventState(draft), 'undated');
  const [exported] = publicEvents([draft]);
  assert.equal(exported.city, null);
  assert.equal(exported.venue, null);
  assert.equal(exported.startsAt, null);
  assert.equal(exported.endsAt, null);
});

test('multiple events group in chronological order and unapproved events stay out', () => {
  const now = Date.parse('2027-01-01T00:00:00Z');
  const past = { ...event, id: 'past', edition: 1, startsAt: '2026-12-01T00:00:00Z', endsAt: '2026-12-02T00:00:00Z' };
  const soon = { ...event, id: 'soon', edition: 2, startsAt: '2027-01-03T00:00:00Z', endsAt: '2027-01-04T00:00:00Z' };
  const later = { ...event, id: 'later', edition: 3, startsAt: '2027-02-03T00:00:00Z', endsAt: '2027-02-04T00:00:00Z' };
  const groups = groupEvents([later, { ...event, id: 'unpublished', edition: 4, published: false }, past, soon], now);
  assert.deepEqual(groups.past.map(row => row.id), ['past']);
  assert.deepEqual(groups.upcoming.map(row => row.id), ['soon', 'later']);
});

test('Information keeps the first edition only in its complete static archive', () => {
  const now = Date.parse('2027-01-01T00:00:00Z');
  const first = { ...event, id: 'yurayura-01', edition: 1 };
  const second = { ...event, id: 'yurayura-02', edition: 2, startsAt: '2026-12-01T00:00:00Z', endsAt: '2026-12-02T00:00:00Z' };
  const groups = groupEvents([first, second], now);
  assert.deepEqual(groups.past.map(row => row.id), ['yurayura-02', 'yurayura-01']);
  assert.deepEqual(informationGroups(groups).past.map(row => row.id), ['yurayura-02']);
  assert.equal(groups.past.some(row => row.id === 'yurayura-01'), true);
});

test('adding a future edition retains the published first-edition archive and distinct copy', () => {
  const published = JSON.parse(fs.readFileSync(require.resolve('../assets/data/exhibitions.json'), 'utf8'));
  assert.equal(published[0].id, 'yurayura-01');
  const future = { ...event, id: 'yurayura-02', edition: 2, startsAt: null, endsAt: null, city: null, venue: null, portfolioDetailUrl: undefined };
  const rows = publicEvents([...published, future]);
  assert.deepEqual(rows.map(row => row.id), ['yurayura-01', 'yurayura-02']);
  assert.notEqual(rows[0].copy.yurayura.ja, rows[0].copy.portfolio.ja);
  assert.equal(rows[0].startsAt, '2026-10-06T13:00:00+09:00');
});

test('public JSON and browser renderer reject malformed records before display', () => {
  assert.throws(() => visibleEvents({}));
  assert.throws(() => visibleEvents([{ ...event, endsAt: null }]));
  assert.throws(() => visibleEvents([{ ...event, copy: { ...copy, portfolio: { ja: 'only Japanese' } } }]));
  assert.throws(() => visibleEvents([{ ...event, copy: { ...copy, portfolio: { ...copy.portfolio, privateNotes: 'PRIVATE' } } }]));
  assert.deepEqual(visibleEvents([{ ...event, id: 'hidden', published: false }]), []);
});

test('legacy external input cannot overwrite the canonical public JSON', () => {
  const file = require.resolve('../assets/data/exhibitions.json');
  const before = fs.readFileSync(file);
  const privateInput = path.join(os.tmpdir(), `yurayura-private-input-${process.pid}.json`);
  fs.writeFileSync(privateInput, JSON.stringify([event]));
  try {
    const result = spawnSync(process.execPath, [path.resolve(__dirname, '../scripts/export-public-events.cjs'), privateInput], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /External input is disabled/);
    assert.deepEqual(fs.readFileSync(file), before);
  } finally {
    fs.rmSync(privateInput, { force: true });
  }
});

const recruitmentStart = Date.parse(event.startsAt), recruitmentEnd = Date.parse(event.endsAt);
const confirmed = { ...event, recruitment: { published: true, receiverVerified: true, startsAt: event.startsAt, endsAt: event.endsAt } };
for (const [name, rows, now, failed, expected] of [
  ['no recruitment', [event], recruitmentStart, false, 'none'],
  ['planning', [{ ...event, recruitment: { published: false } }], recruitmentStart, false, 'planning'],
  ['before start', [confirmed], recruitmentStart - 1, false, 'upcoming'],
  ['verified open', [confirmed], recruitmentStart, false, 'open'],
  ['closed', [confirmed], recruitmentEnd, false, 'closed'],
  ['fetch failed', [], recruitmentStart, true, 'error']
]) test(`recruitment view: ${name}`, () => {
  const { recruitmentView } = require('../assets/js/exhibition-state.js');
  const view = recruitmentView(rows, now, failed);
  assert.equal(view.state, expected);
  assert(view.copy.method && view.copy.faq && view.copy.conditions);
  if (expected === 'open') {
    assert.match(view.status, /募集中/);
    assert(!/受け付けていません|未定です|募集準備中|受付停止/.test(Object.values(view.copy).join('')));
  } else assert(!view.status.includes('募集中'));
});

test('view fails closed for invalid event/recruitment data or clock', () => {
  const variants = [
    { ...confirmed, published: false }, { ...confirmed, startsAt: 'bad' }, { ...confirmed, edition: 0 },
    { ...confirmed, recruitment: { ...confirmed.recruitment, receiverVerified: false } },
    { ...confirmed, recruitment: { ...confirmed.recruitment, receiverVerified: 'true' } },
    { ...confirmed, recruitment: { ...confirmed.recruitment, startsAt: '2026-02-30T00:00:00+09:00' } }
  ];
  for (const item of variants) assert.notEqual(require('../assets/js/exhibition-state.js').recruitmentView([item], recruitmentStart).state, 'open');
  assert.equal(require('../assets/js/exhibition-state.js').recruitmentView({}, recruitmentStart).state, 'error');
  assert.equal(require('../assets/js/exhibition-state.js').recruitmentView([confirmed], NaN).state, 'error');
});

test('a verified open recruitment does not get masked by a planning row', () => {
  const planning = { ...event, id: 'planning', edition: 2, recruitment: { published: true, receiverVerified: false, startsAt: event.startsAt, endsAt: event.endsAt } };
  assert.equal(require('../assets/js/exhibition-state.js').recruitmentView([planning, confirmed], recruitmentStart).state, 'open');
});
