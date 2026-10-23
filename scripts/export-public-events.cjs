// Public event data is allowlisted here; never copy arbitrary private fields.
const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { instant, eventState } = require('../assets/js/exhibition-state.js');

const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'assets/data/exhibitions.json');
const officialPath = '/yurayura/';
const portfolioPath = '/website/exhibitions/yurayura/';
const locales = ['ja', 'en'];

function isPublicSiteUrl(value, pathnamePrefix) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'mizukioyama.github.io'
      && !url.port && !url.username && !url.password
      && url.pathname.startsWith(pathnamePrefix);
  } catch {
    return false;
  }
}

function localizedCopy(copy, site, eventId) {
  const value = copy?.[site];
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Missing ${site} copy: ${eventId}`);
  const output = {};
  for (const locale of locales) {
    const text = value[locale];
    if (typeof text !== 'string' || !text.trim() || text.length > 4000) throw new Error(`Invalid ${site}.${locale} copy: ${eventId}`);
    output[locale] = text;
  }
  return output;
}

function publicEvents(rows) {
  if (!Array.isArray(rows)) throw new Error('Array required');
  const ids = new Set();
  const editions = new Set();
  return rows.filter(event => event?.published === true).map(event => {
    if (!event || !/^[a-z0-9-]+$/.test(event.id) || ids.has(event.id)
      || !Number.isInteger(event.edition) || event.edition < 1 || editions.has(event.edition)
      || eventState(event) === 'unknown') throw new Error('Invalid event');
    ids.add(event.id);
    editions.add(event.edition);

    const nullableText = value => value === null || (typeof value === 'string' && !!value.trim());
    if (!Object.prototype.hasOwnProperty.call(event, 'city') || !nullableText(event.city)
      || !Object.prototype.hasOwnProperty.call(event, 'venue') || !nullableText(event.venue)) throw new Error('Invalid location');
    if (!isPublicSiteUrl(event.officialUrl, officialPath)) throw new Error('Invalid official exhibition URL');

    const row = {
      id: event.id,
      edition: event.edition,
      published: true,
      city: event.city,
      venue: event.venue,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      officialUrl: event.officialUrl,
      copy: {
        yurayura: localizedCopy(event.copy, 'yurayura', event.id),
        portfolio: localizedCopy(event.copy, 'portfolio', event.id)
      }
    };

    if (event.portfolioDetailUrl !== undefined) {
      if (!isPublicSiteUrl(event.portfolioDetailUrl, portfolioPath)) throw new Error('Invalid Portfolio detail URL');
      row.portfolioDetailUrl = event.portfolioDetailUrl;
    }
    if (event.galleryUrl !== undefined) {
      if (!/^\.\/[a-z0-9-]+\.html$/.test(event.galleryUrl) || !fs.existsSync(path.resolve(root, event.galleryUrl))) throw new Error('Invalid gallery URL');
      row.galleryUrl = event.galleryUrl;
    }
    if (event.artists !== undefined) {
      if (!Array.isArray(event.artists) || event.artists.some(name => typeof name !== 'string' || !name.trim())) throw new Error('Invalid artists');
      row.artists = event.artists;
    }
    if (event.artworkCount !== undefined) {
      if (!Number.isInteger(event.artworkCount) || event.artworkCount < 0) throw new Error('Invalid artwork count');
      row.artworkCount = event.artworkCount;
    }

    const recruitment = event.recruitment;
    if (recruitment?.published === true) {
      if (!Number.isFinite(instant(recruitment.startsAt)) || !Number.isFinite(instant(recruitment.endsAt)) || instant(recruitment.endsAt) <= instant(recruitment.startsAt)) throw new Error('Invalid recruitment');
      row.recruitment = { published: true, startsAt: recruitment.startsAt, endsAt: recruitment.endsAt, receiverVerified: false };
    }
    return row;
  });
}

module.exports = { publicEvents, isPublicSiteUrl };

if (require.main === module) {
  const arg = process.argv[2];
  if (arg === '--help') {
    console.log('Usage: node scripts/export-public-events.cjs --check');
    process.exit(0);
  }
  if (!arg || arg === '--check') {
    const source = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const normalized = publicEvents(source);
    if (!isDeepStrictEqual(source, normalized)) throw new Error('Published JSON contains fields outside the public allowlist; review the canonical file before publishing.');
    console.log(`Validated ${normalized.length} public events; no files were written.`);
  } else {
    throw new Error('External input is disabled. Edit assets/data/exhibitions.json directly; keep private and unapproved information outside the public repository.');
  }
}
