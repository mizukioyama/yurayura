/* Public event display. End instants are exclusive; the browser clock drives display only. */
(function (root) {
  "use strict";
  function instant(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return NaN;
    return Date.parse(value);
  }
  function eventState(event, now = Date.now()) {
    if (!event || event.published !== true) return "unpublished";
    if (event.startsAt === null && event.endsAt === null) return "undated";
    const start = instant(event.startsAt), end = instant(event.endsAt);
    if (!Number.isFinite(now) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return "unknown";
    return now < start ? "upcoming" : now < end ? "current" : "past";
  }
  function recruitmentState(event, now = Date.now()) {
    const r = event?.recruitment;
    if (!event || event.published !== true || !r || r.published !== true) return "planning";
    const start = instant(r.startsAt), end = instant(r.endsAt);
    if (!Number.isFinite(now) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return "planning";
    if (now >= end) return "closed";
    return now >= start && r.receiverVerified === true ? "open" : "planning";
  }
  function visibleEvents(events) {
    if (!Array.isArray(events)) throw new Error("Invalid event data");
    const visible = events.filter(e => e?.published === true);
    if (visible.some(e => !Number.isInteger(e.edition) || e.edition < 1 || typeof e.city !== "string" || typeof e.venue !== "string" || eventState(e) === "unknown")) throw new Error("Invalid event data");
    return visible;
  }
  function groupEvents(events, now = Date.now()) {
    const visible = visibleEvents(events);
    return {
      current: visible.filter(e => eventState(e, now) === "current").sort((a,b) => instant(a.startsAt)-instant(b.startsAt)),
      upcoming: visible.filter(e => ["upcoming","undated"].includes(eventState(e, now))).sort((a,b) => (instant(a.startsAt)||Infinity)-(instant(b.startsAt)||Infinity)),
      past: visible.filter(e => eventState(e, now) === "past").sort((a,b) => instant(b.startsAt)-instant(a.startsAt))
    };
  }
  const api = {instant, eventState, recruitmentState, visibleEvents, groupEvents};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.YurayuraState = api;
  if (typeof document === "undefined") return;

  const safeGallery = value => typeof value === "string" && /^\.\/[a-z0-9-]+\.html$/.test(value);
  const text = (tag, value) => { const el = document.createElement(tag); el.textContent = value; return el; };
  function renderGroups(target, groups, gallery) {
    const fragment = document.createDocumentFragment();
    for (const [state, title] of [["current",gallery ? "開催中作品一覧" : "開催中"],["upcoming","開催予定"],["past",gallery ? "過去展示作品一覧" : "過去開催情報"]]) {
      const section = document.createElement("section");
      section.append(text(gallery ? "h2" : "h3", title));
      if (!groups[state].length) section.append(text("p", {current:"現在開催中の展示はありません。", upcoming:"開催予定は未定です。", past:"過去開催の情報はありません。"}[state]));
      for (const event of groups[state]) {
        const article = document.createElement("article");
        article.append(text("p", `第${event.edition}回 · ${event.city} / ${event.venue}`));
        const format = d => new Intl.DateTimeFormat("ja-JP", {timeZone:"Asia/Tokyo", year:"numeric", month:"long", day:"numeric"}).format(new Date(d));
        article.append(text("p", eventState(event) === "undated" ? "開催日未定" : `${format(event.startsAt)}〜${format(event.endsAt)}（日本時間）`));
        if (gallery && Number.isInteger(event.artworkCount)) article.append(text("p", `${event.artworkCount}作品`));
        if (safeGallery(event.galleryUrl)) {
          const link = text("a", `第${event.edition}回の作品を見る ↗`); link.href = event.galleryUrl; article.append(link);
        } else if (gallery) article.append(text("p", "作品情報は準備中です。"));
        section.append(article);
      }
      fragment.append(section);
    }
    target.replaceChildren(fragment);
  }
  document.addEventListener("DOMContentLoaded", async () => {
    const targets = document.querySelectorAll("[data-event-groups], [data-gallery-groups], [data-recruitment-status]");
    if (!targets.length) return;
    try {
      const response = await fetch("./assets/data/exhibitions.json");
      if (!response.ok) throw new Error("Event data unavailable");
      const events = visibleEvents(await response.json());
      let previous = "";
      const render = () => {
        const groups = groupEvents(events);
        const signature = JSON.stringify(Object.values(groups).map(list => list.map(e => e.id)));
        // Preserve focus and link nodes while the displayed groups remain unchanged.
        if (signature !== previous) {
          document.querySelectorAll("[data-event-groups]").forEach(el => renderGroups(el, groups, false));
          document.querySelectorAll("[data-gallery-groups]").forEach(el => renderGroups(el, groups, true));
          previous = signature;
        }
        const publicRecruitment = events.filter(e => e.recruitment?.published === true);
        const event = publicRecruitment.find(e => recruitmentState(e) !== "closed");
        const latest = publicRecruitment.sort((a,b) => instant(b.recruitment.endsAt)-instant(a.recruitment.endsAt))[0];
        document.querySelectorAll("[data-recruitment-status]").forEach(el => {
          el.textContent = event && recruitmentState(event) === "open" ? "出展者募集中" : !event && latest && recruitmentState(latest) === "closed" ? `第${latest.edition}回の募集は締め切りました。` : "企画中";
        });
      };
      render();
      setInterval(render, 60000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
    } catch (_) {
      document.querySelectorAll("[data-event-groups], [data-gallery-groups]").forEach(el => {
        const message = text("p", "開催情報を読み込めませんでした。時間をおいて再読み込みしてください。");
        message.setAttribute("role", "status");
        const link = text("a", "第1回の開催記録を見る ↗"); link.href = "./information.html#past-exhibitions";
        el.replaceChildren(message, link);
      });
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
