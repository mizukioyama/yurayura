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
    const method = {none:'現在は、まだ出展のお申し込みを受け付けていません。募集開始日とお申し込み方法が決まったら、このページでお知らせします。', planning:'現在は出展申し込みを受け付けていません。募集要項と受付方法は、確定後にご案内します。', upcoming:'受付開始前です。受付期間と応募方法は、当該展示の正式な募集要項をご確認ください。', open:'出展者を募集しています。応募方法・受付先・締切は、当該展示の正式な募集要項をご確認ください。', closed:'今回の募集は終了しました。次回の応募方法は、募集要項の確定後にご案内します。', error:'募集状況を読み込めませんでした。受付中とはご案内できません。時間をおいて再読み込みしてください。'}[state];
    const faq = {none:'今から申し込めますか？ まだ受付前です。募集が始まるときは、このページでお知らせします。', planning:'今すぐ応募できますか？ 現在は募集準備中のため、受け付けていません。', upcoming:'今すぐ応募できますか？ 受付開始前です。正式な募集要項の受付期間をご確認ください。', open:'今すぐ応募できますか？ 募集期間中です。正式な募集要項に記載された受付方法と締切をご確認ください。', closed:'今すぐ応募できますか？ 今回の募集は終了しました。', error:'今すぐ応募できますか？ 募集状況を確認できないため、受付中とはご案内できません。'}[state];
    return {state, status, copy: {
      overview: announced ? '開催・募集条件の詳細は、当該展示の正式な募集要項をご確認ください。' : '2027年4月頃の岩手開催に向けて考えている内容を、少しずつご紹介します。まだ検討中のため、正式な募集条件は変更になることがあります。',
      next: announced ? '開催地・会期・会場は、Informationに掲載する当該展示の正式な案内をご確認ください。' : '第2回は2027年4月頃、岩手県での開催を目指して準備しています。会場や日程はまだ決まっていません。決まり次第、このページでお知らせします。',
      policy: announced ? '参加条件は、当該展示の正式な募集要項をご確認ください。展示ごとに条件が異なる場合があります。' : '詳しい参加条件はこれから整えていきます。作家や作品の公式サイトへの掲載は、無料にする予定です。',
      target: announced ? '募集人数・募集期間・対象作品は、当該展示の正式な募集要項をご確認ください。' : '今回は主催者を含めて最大4名ほどの、小さな展示を考えています。募集の時期は、決まり次第お知らせします。',
      targetNote: announced ? '展示ごとの条件をご確認のうえ、参加をご検討ください。' : '作品はおひとり3点までを想定しています。詳しい条件は、会場と相談しながら決めていきます。',
      conditions: announced ? '作品数・サイズ・展示区画・選考・搬入と搬出は、当該展示の正式な募集要項をご確認ください。' : '絵画などの平面作品に加え、立体作品やデジタルサイネージも取り入れたいと考えています。立体作品は、1点あたり最大20kgを目安に考えています。ただし、会場の設備や展示方法によって対応できる重量が変わるため、20kg以下でも展示できない場合があります。正式な条件は会場が決まり次第ご案内します。会場の耐荷重・展示設備・安全基準を優先します。吊り展示については引き続き検討中です。',
      conditionsNote: announced ? '作品と会場に関する条件をご確認ください。' : '発送・返送の送料は、どちらも出展者ご自身でのご負担をお願いします。返送料は返送が完了した後にお支払いいただく予定です。配送業者にご希望がなければ、ヤマト運輸（クロネコヤマト）を利用する予定です。',
      fees: announced ? '参加費とその対象範囲は、当該展示の正式な募集要項をご確認ください。' : '出展料はおひとり15,000円（税込・運営費込み）を考えています。学割の設定はありません。正式な金額は募集時にお知らせします。',
      feesNote: announced ? 'お申し込み前に費用と条件をご確認ください。' : '小物やグッズも展示・販売できるようにしたいと考えています。グッズ販売手数料は、出展者おひとりの会期中のグッズ売上合計が2,000円以上の場合、その合計額の10%を運営費としていただく方針です。2,000円未満なら手数料はありません。税・送料・返品時の計算方法は、正式な募集案内でお知らせします。',
      method, faq,
      faqConditions: announced ? '参加条件は決まっていますか？ 当該展示の正式な募集要項をご確認ください。過去の条件がそのまま適用されるとは限りません。' : '参加費や作品の条件は決まっていますか？ 今は検討中の内容をご紹介しています。正式な条件は決まり次第お知らせします。'
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
