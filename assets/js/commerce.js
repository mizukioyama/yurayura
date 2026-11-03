/* Square owns products, inventory, orders and payment. This module only exposes approved links. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.YurayuraCommerce = api;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    api.ready = fetch('./assets/data/shop-links.json', {signal:controller.signal})
      .then(response => response.ok ? response.json() : null)
      .then(config => { api.config = api.validate(config) ? config : null; })
      .catch(() => { api.config = null; })
      .finally(() => clearTimeout(timeout));
  }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const SITE = '883454073299028176';
  const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
  function squareURL(value, origin) {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.square\.site$/.test(url.hostname) || url.username || url.password || url.port || url.search || url.hash || /%|\\/.test(value)) return null;
      if (origin && url.origin !== origin) return null;
      return url.href;
    } catch (_) { return null; }
  }
  function validate(config) {
    if (!exactKeys(config, ['version','siteId','enabled','publicationApproved','shopUrl','categories','artists','products']) || config.version !== 1 || config.siteId !== SITE || typeof config.enabled !== 'boolean' || typeof config.publicationApproved !== 'boolean') return false;
    if (!Array.isArray(config.artists) || !Array.isArray(config.products) || !exactKeys(config.categories, ['original-art','goods'])) return false;
    const home = config.shopUrl === null ? null : squareURL(config.shopUrl);
    if (config.shopUrl !== null && !home) return false;
    const origin = home && new URL(home).origin;
    if ((config.enabled || config.publicationApproved) && (!home || !config.enabled || !config.publicationApproved)) return false;
    for (const url of Object.values(config.categories)) if (url !== null && (!origin || !squareURL(url, origin))) return false;
    const artistIds = new Set(), workIds = new Set();
    for (const artist of config.artists) {
      if (!exactKeys(artist,['artistId','url','approved']) || typeof artist.artistId !== 'string' || !artist.artistId || artistIds.has(artist.artistId) || typeof artist.approved !== 'boolean' || !origin || !squareURL(artist.url,origin)) return false;
      artistIds.add(artist.artistId);
    }
    for (const product of config.products) {
      if (!exactKeys(product,['artworkId','artistId','category','squareItemId','squareChannel','url','published','saleApproved','imageUseApproved']) || typeof product.artworkId !== 'string' || !product.artworkId || workIds.has(product.artworkId) || typeof product.artistId !== 'string' || !['original-art','goods'].includes(product.category) || typeof product.squareItemId !== 'string' || !product.squareItemId || product.squareChannel !== SITE || !origin || !squareURL(product.url,origin) || !['published','saleApproved','imageUseApproved'].every(key=>typeof product[key] === 'boolean')) return false;
      workIds.add(product.artworkId);
    }
    return true;
  }
  function resolve(config, kind, id) {
    if (!validate(config) || !config.enabled || !config.publicationApproved) return null;
    if (kind === 'shop') return config.shopUrl;
    if (kind === 'category') return ['original-art','goods'].includes(id) ? config.categories[id] || null : null;
    if (kind === 'artist') return config.artists.find(item=>item.artistId === id && item.approved)?.url || null;
    if (kind === 'artwork') return config.products.find(item=>item.artworkId === id && item.published && item.saleApproved && item.imageUseApproved)?.url || null;
    return null;
  }
  function applyLink(anchor, url) {
    if (!anchor) return;
    anchor.hidden = !url;
    if (url) {
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    } else {
      anchor.removeAttribute('href'); anchor.removeAttribute('target'); anchor.removeAttribute('rel');
    }
  }
  function hydrateNavigation(doc) {
    const url = resolve(api.config, 'shop');
    if (!url) return;
    doc.querySelectorAll('[data-shop-category]').forEach(link => applyLink(link, resolve(api.config, 'category', link.dataset.shopCategory)));
    doc.querySelectorAll('[data-shop-section]').forEach(section => {
      if (!resolve(api.config, 'category', section.dataset.shopSection)) return;
      const status = section.querySelector('.path-status');
      if (status) status.hidden = true;
      const copy = section.querySelector('[data-shop-category-copy]');
      if (copy?.querySelector('a')) copy.lastChild.textContent = 'でご覧いただけます。販売条件はShopでご確認ください。';
      else if (copy) copy.textContent = '商品のお取り扱い・価格・お届け条件は、Shopでご確認ください。';
    });
    const notice = doc.querySelector('[data-shop-notice]');
    if (notice) notice.textContent = '商品情報・在庫・ご注文条件は、Squareの公式オンラインショップでご確認ください。';
    // Reuse the existing participation/subpage and Footer link styles, not the five primary links.
    for (const [selector, className] of [['.header-subpages','header-link header-sublink site-nav-label'],['.footer-related','']]) {
      const parent = doc.querySelector(selector);
      if (!parent || parent.querySelector('[data-shop-link]')) continue;
      const link = doc.createElement('a');
      link.dataset.shopLink = 'true'; link.className = className;
      link.textContent = 'Shop ↗'; link.setAttribute('aria-label','公式オンラインショップ（別タブで開く）');
      applyLink(link,url);
      if (parent.tagName === 'UL') { const li=doc.createElement('li'); li.append(link); parent.append(li); }
      else parent.append(link);
    }
  }
  function updateArtwork(artworkId, artistId, doc) {
    const product = api.config?.products?.find(item => item.artworkId === artworkId && item.artistId === artistId);
    applyLink(doc.getElementById('galleryModalShopLink'), product ? resolve(api.config,'artwork',artworkId) : null);
    applyLink(doc.getElementById('galleryModalArtistShopLink'), resolve(api.config,'artist',artistId));
  }
  const api = { validate, resolve, applyLink, hydrateNavigation, updateArtwork, config:null };
  return api;
});
