/* Public event display. End instants are exclusive; the browser clock drives display only. */
(function (root) {
  "use strict";
  function instant(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return NaN;
    const [year, month, day, hour, minute, second] = value.slice(0, 19).split(/\D/).map(Number);
    const days = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59 || second > 59) return NaN;
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
    if (!event || event.published !== true || eventState(event, now) === "unknown" || !r || r.published !== true) return "planning";
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
  /* One view owns the status and every state-dependent participation paragraph. */
  function recruitmentView(events, now = Date.now(), failed = false) {
    let state = 'error', selected;
    if (!failed && Number.isFinite(now)) {
      try {
        const visible = visibleEvents(events);
        const published = visible.filter(e => e.recruitment?.published === true);
        if (published.some(e => !Number.isFinite(instant(e.recruitment.startsAt)) || !Number.isFinite(instant(e.recruitment.endsAt)) || instant(e.recruitment.endsAt) <= instant(e.recruitment.startsAt))) throw new Error('Invalid recruitment');
        selected = published.find(e => recruitmentState(e, now) === 'open');
        if (selected) state = 'open';
        else {
          selected = published.filter(e => now < instant(e.recruitment.endsAt)).sort((a,b) => instant(a.recruitment.startsAt) - instant(b.recruitment.startsAt))[0];
          if (selected) state = now < instant(selected.recruitment.startsAt) ? 'upcoming' : 'planning';
          else if (published.length) { state = 'closed'; selected = published.sort((a,b) => instant(b.recruitment.endsAt) - instant(a.recruitment.endsAt))[0]; }
          else state = visible.some(e => e.recruitment) ? 'planning' : 'none';
        }
      } catch (_) { state = 'error'; }
    }
    const announced = ['upcoming', 'open', 'closed'].includes(state);
    const status = {none:'出展申し込みの受付は停止中です', planning:'募集準備中です（受付停止中）', upcoming:'受付開始前です（受付停止中）', open:'出展者募集中', closed:`第${selected?.edition || ''}回の募集は締め切りました。`, error:'募集状況を確認できないため、受付中のご案内を停止しています'}[state];
    const method = {none:'現在は出展申し込みを受け付けていません。正式な応募受付先・募集期間は未定です。', planning:'現在は出展申し込みを受け付けていません。募集要項と受付方法は、確定後にご案内します。', upcoming:'受付開始前です。受付期間と応募方法は、当該展示の正式な募集要項をご確認ください。', open:'出展者を募集しています。応募方法・受付先・締切は、当該展示の正式な募集要項をご確認ください。', closed:'今回の募集は終了しました。次回の応募方法は、募集要項の確定後にご案内します。', error:'募集状況を読み込めませんでした。受付中とはご案内できません。時間をおいて再読み込みしてください。'}[state];
    const faq = {none:'今すぐ応募できますか？ 現在は受け付けていません。募集開始時は、このページでご案内します。', planning:'今すぐ応募できますか？ 現在は募集準備中のため、受け付けていません。', upcoming:'今すぐ応募できますか？ 受付開始前です。正式な募集要項の受付期間をご確認ください。', open:'今すぐ応募できますか？ 募集期間中です。正式な募集要項に記載された受付方法と締切をご確認ください。', closed:'今すぐ応募できますか？ 今回の募集は終了しました。', error:'今すぐ応募できますか？ 募集状況を確認できないため、受付中とはご案内できません。'}[state];
    return {state, status, copy: {
      overview: announced ? '開催・募集条件の詳細は、当該展示の正式な募集要項をご確認ください。' : '以下は2027年4月頃の岩手開催を想定した検討案です。正式な募集要項ではなく、条件は変更される場合があります。',
      next: announced ? '開催地・会期・会場は、Informationに掲載する当該展示の正式な案内をご確認ください。' : '第2回は2027年4月頃、岩手県での開催を中心に検討しています。会場と正式な会期は未定です。',
      policy: announced ? '参加条件は、当該展示の正式な募集要項をご確認ください。展示ごとに条件が異なる場合があります。' : '正式な参加条件は調整中です。公式サイトへの作家・作品掲載は無料とする方針です。',
      target: announced ? '募集人数・募集期間・対象作品は、当該展示の正式な募集要項をご確認ください。' : '出展人数は主催者を含め最大4名を想定しています。募集期間は未定です。',
      targetNote: announced ? '展示ごとの条件をご確認のうえ、参加をご検討ください。' : '作品数は1人最大3点を想定しています。正式な条件は決定後にご案内します。',
      conditions: announced ? '作品数・サイズ・展示区画・選考・搬入と搬出は、当該展示の正式な募集要項をご確認ください。' : '平面・立体作品（20kgまで）やデジタルサイネージを想定しています。吊り展示と展示設備は検討中です。',
      conditionsNote: announced ? '作品と会場に関する条件をご確認ください。' : '送料は出展者負担、返送料は後払いを予定しています。作品サイズ・搬入搬出の詳細は未定です。',
      fees: announced ? '参加費とその対象範囲は、当該展示の正式な募集要項をご確認ください。' : '出展料は1人15,000円（税込・運営費込み、学割なし）を予定しています。正式決定前の検討案です。',
      feesNote: announced ? 'お申し込み前に費用と条件をご確認ください。' : '小物・グッズの展示・販売を検討しています。グッズ販売手数料は、出展者1人あたりの会期中のグッズ売上合計が2,000円以上の場合、その売上合計額の10%を運営費としていただく方針です。2,000円未満の場合は手数料なしとする予定です。税・送料などの計算上の扱いは決定後にご案内します。',
      method, faq,
      faqConditions: announced ? '参加条件は決まっていますか？ 当該展示の正式な募集要項をご確認ください。過去の条件がそのまま適用されるとは限りません。' : '参加条件は決まっていますか？ 人数・費用・作品数には検討案がありますが、正式な募集要項は未確定です。'
    }};
  }
  const api = {instant, eventState, recruitmentState, visibleEvents, groupEvents, recruitmentView};
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
  function renderRecruitment(view) {
    document.querySelectorAll('[data-recruitment-status]').forEach(el => { if (el.textContent !== view.status) el.textContent = view.status; if (el.dataset.recruitmentState !== view.state) el.dataset.recruitmentState = view.state; });
    document.querySelectorAll('[data-recruitment-copy]').forEach(el => {
      const copy = view.copy[el.dataset.recruitmentCopy];
      if (typeof copy === 'string' && el.textContent !== copy) el.textContent = copy;
    });
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
        renderRecruitment(recruitmentView(events));
      };
      render();
      setInterval(render, 60000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
    } catch (_) {
      renderRecruitment(recruitmentView([], Date.now(), true));
      document.querySelectorAll("[data-event-groups], [data-gallery-groups]").forEach(el => {
        const message = text("p", "開催情報を読み込めませんでした。時間をおいて再読み込みしてください。");
        message.setAttribute("role", "status");
        const link = text("a", "第1回の開催記録を見る ↗"); link.href = "./information.html#past-exhibitions";
        el.replaceChildren(message, link);
      });
    }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
