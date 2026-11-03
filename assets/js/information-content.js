/* Information-only presentation. Event facts remain in exhibitions.json. */
(function (root) {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const day = value => new Intl.DateTimeFormat('ja-JP', {timeZone:'Asia/Tokyo', year:'numeric', month:'long', day:'numeric'}).format(new Date(value));
  const year = event => new Intl.DateTimeFormat('en', {timeZone:'Asia/Tokyo', year:'numeric'}).format(new Date(event.startsAt));
  const isoDay = value => new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
  const period = event => event.startsAt === null ? '開催時期未定' : `<time datetime="${escape(isoDay(event.startsAt))}">${day(event.startsAt)}</time>〜<time datetime="${escape(isoDay(event.endsAt))}">${day(event.endsAt)}</time>`;
  const localLink = value => typeof value === 'string' && /^\.\/[a-z0-9-]+\.html(?:#[a-zA-Z0-9_-]+)?$/.test(value);
  const label = event => `第${event.edition}回グループ展「ゆらゆら」`;
  const fact = (key, value) => `<div><dt>${key}</dt><dd>${escape(value)}</dd></div>`;
  function card(event, state, heading) {
    const archived = state === 'past';
    const id = event.id === 'yurayura-01' ? 'past-event-2026-title' : `event-${event.id}-title`;
    const status = archived ? '開催終了' : state === 'current' ? '開催中' : event.startsAt === null ? '開催日未定' : '開催決定';
    const links = [];
    if (localLink(event.galleryUrl)) links.push(`<a class="information-contact-link" href="${escape(event.galleryUrl)}">${Number.isInteger(event.artworkCount) ? event.artworkCount+'作品とArtistを見る' : '展示作品を見る'} <span aria-hidden="true">↗</span></a>`);
    if (!archived) links.push(`<a class="information-contact-link" href="${escape(event.officialUrl)}">開催の詳細 <span aria-hidden="true">↗</span></a>`);
    return `<article class="information-past-event" data-event-id="${escape(event.id)}" aria-labelledby="${id}">
  <header class="information-past-event__identity"><p class="information-status">${status}</p><${heading} class="information-subheading" id="${id}">${escape(label(event))}</${heading}></header>
  <p class="information-archive-note">${escape(event.copy.yurayura.ja)}</p>
  <dl class="information-facts"><div><dt>開催期間</dt><dd>${period(event)}${archived ? '（終了）' : '（日本時間）'}</dd></div>${fact('開催地',event.city || '未定')}${fact('会場',event.venue || '未定')}${event.artists?.length ? fact('参加Artist',event.artists.join('、')) : ''}</dl>
  ${links.length ? `<div class="information-record-links">${links.join('')}</div>` : ''}
</article>`;
  }
  function upcoming(groups) {
    return [...groups.current.map(e=>card(e,'current','h3')), ...groups.upcoming.map(e=>card(e,'upcoming','h3'))].join('\n');
  }
  function archive(events) {
    const years = new Map();
    for (const event of events) { const y=year(event); if(!years.has(y)) years.set(y,[]); years.get(y).push(event); }
    return [...years].sort((a,b)=>Number(b[0])-Number(a[0])).map(([y,rows])=>{
      const yearId=rows.some(e=>e.id==='yurayura-01')?'past-event-2026-year':`archive-year-${y}`;
      return `<section class="information-archive-year" aria-labelledby="${yearId}"><h3 class="information-subheading information-year" id="${yearId}">${y}年</h3>${rows.map(e=>card(e,'past','h4')).join('\n')}</section>`;
    }).join('\n');
  }
  function news(rows) {
    if (!Array.isArray(rows)) throw new Error('News must be an array of public notices');
    const ids=new Set(), allowed=new Set(['id','date','title','summary','url']);
    for (const row of rows) {
      if (!row || Object.keys(row).some(k=>!allowed.has(k)) || typeof row.id!=='string' || !/^[a-z0-9-]+$/.test(row.id) || ids.has(row.id)
        || typeof row.date!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !Number.isFinite(Date.parse(row.date)) || new Date(row.date).toISOString().slice(0,10)!==row.date
        || typeof row.title!=='string' || !row.title.trim() || row.title.length>200
        || (row.summary!==undefined && (typeof row.summary!=='string' || row.summary.length>2000))
        || (row.url!==undefined && !localLink(row.url))) throw new Error('Invalid public news record');
      ids.add(row.id);
    }
    return [...rows].sort((a,b)=>b.date.localeCompare(a.date)).map(row=>`<article class="information-news-item"><time datetime="${row.date}">${day(row.date+'T00:00:00+09:00')}</time><h3 class="information-subheading">${escape(row.title)}</h3>${row.summary ? `<p>${escape(row.summary)}</p>` : ''}${row.url ? `<a class="information-contact-link" href="${escape(row.url)}">詳しく見る <span aria-hidden="true">↗</span></a>` : ''}</article>`).join('\n');
  }
  function replaceIfChanged(element, html) {
    const template=document.createElement('template'); template.innerHTML=html;
    const signature=node=>JSON.stringify([node.textContent.replace(/\s+/g,' ').trim(), [...node.querySelectorAll('a,time,[data-event-id]')].map(e=>[e.tagName,e.getAttribute('href'),e.getAttribute('datetime'),e.getAttribute('data-event-id')])]);
    if (signature(element)!==signature(template.content)) element.innerHTML=html;
  }
  function render(target, groups) {
    const html=upcoming(groups);
    replaceIfChanged(target,html);
    target.hidden=!html;
    const planning=document.querySelector('[data-information-planning]');
    if (planning) planning.hidden=!!html;
    const records=document.querySelector('[data-information-archive]');
    const past=archive(groups.past);
    // Keep existing focus and reveal classes when the static snapshot is current.
    if (records) replaceIfChanged(records,past);
  }
  const api={upcoming,archive,news,render};
  if (typeof module!=='undefined' && module.exports) module.exports=api;
  root.YurayuraInformation=api;
  if (typeof document==='undefined') return;
  document.addEventListener('DOMContentLoaded',async()=>{
    const section=document.querySelector('[data-information-news]');
    if (!section) return;
    try {
      const version=document.body.dataset.informationNewsVersion;
      const response=await fetch('./assets/data/news.json'+(version?'?v='+encodeURIComponent(version):''));
      if (!response.ok) throw new Error('News unavailable');
      const html=news(await response.json()), list=section.querySelector('[data-information-news-list]');
      replaceIfChanged(list,html);
      section.hidden=!html;
      document.querySelectorAll('[data-information-news-link]').forEach(link=>{link.hidden=!html;});
    } catch (_) {
      // Preserve the last published static notices on network/validation failure.
      section.dataset.loadState='unavailable';
    }
  });
})(typeof globalThis!=='undefined' ? globalThis : this);
