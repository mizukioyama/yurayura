// Local preflight only. Never quotes shipping, submits orders or enforces Square checkout rules.
const fs = require('node:fs');
const path = require('node:path');
const commerce = require('../assets/js/commerce.js');
function assessShipping(items, verification = {}) {
  if (!Array.isArray(items) || !items.length) return {status:'USER_ACTION_PENDING', reasons:['PRODUCTS_REQUIRED']};
  const reasons = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || !['shipping','pickup'].includes(item.method)) { reasons.add('FULFILLMENT_REQUIRED'); continue; }
    if (item.method === 'shipping' && (!item.originId || !item.shippingProfileId || item.shippingTermsConfirmed !== true)) reasons.add('SHIPPING_TERMS_REQUIRED');
    if (item.method === 'pickup' && (!item.eventId || item.pickupTermsConfirmed !== true)) reasons.add('PICKUP_TERMS_REQUIRED');
  }
  if (reasons.size) return {status:'USER_ACTION_PENDING',reasons:[...reasons]};
  const methods = new Set(items.map(x=>x.method));
  const origins = new Set(items.filter(x=>x.method==='shipping').map(x=>x.originId));
  const profiles = new Set(items.filter(x=>x.method==='shipping').map(x=>x.shippingProfileId));
  if (methods.size > 1) reasons.add('MIXED_FULFILLMENT');
  if (origins.size > 1) reasons.add('MULTIPLE_ORIGINS');
  if (profiles.size > 1) reasons.add('MULTIPLE_PROFILES');
  if (items.length > 1) reasons.add('COMBINED_ORDER');
  // Evidence must refer to this exact SKU/quantity/method combination. A generic flag is insufficient.
  const combination = JSON.stringify(items.map(x=>[x.id,x.quantity,x.method,x.originId || x.eventId,x.shippingProfileId || null]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
  if (!verification.evidenceId || verification.combination !== combination || verification.squareVerified !== true) return {status:'EXTERNAL_BLOCKED',reasons:[...reasons,'SQUARE_VERIFICATION_REQUIRED'],combination};
  return {status:'READY_FOR_REVIEW',reasons:[...reasons],combination};
}
function checkLinks(config) {
  if (!commerce.validate(config)) return false;
  const gallery = fs.readFileSync(path.join(__dirname,'../gallery.html'),'utf8');
  const artists = new Set([...gallery.matchAll(/data-artist-id="([^"]+)"/g)].map(x=>x[1]));
  const artworkIds = new Set([...gallery.matchAll(/id="(gallery-work-title-[^"]+)"/g)].map(x=>x[1]));
  const workArtists = new Map([...gallery.matchAll(/<article\b[^>]*class="work gallery-card"[\s\S]*?<\/article>/g)].map(([card])=>[card.match(/id="(gallery-work-title-[^"]+)"/)?.[1], card.match(/data-artist-id="([^"]+)"/)?.[1]]));
  return config.artists.every(x=>artists.has(x.artistId)) && config.products.every(x=>artworkIds.has(x.artworkId) && workArtists.get(x.artworkId) === x.artistId);
}
module.exports = {assessShipping, checkLinks};
if (require.main === module) {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/data/shop-links.json'),'utf8'));
  if (!checkLinks(config)) { console.error('Invalid public Shop link data'); process.exitCode=1; }
  else console.log(config.enabled ? 'Approved Shop links configured; publication still requires review' : 'PASS: Shop links disabled; no sales URL configured');
}
