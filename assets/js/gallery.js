document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const pagination = document.getElementById("galleryPagination");
  const result = document.getElementById("galleryResult");
  const filters = Array.from(document.querySelectorAll(".gallery-filter"));
  const pageSize = 10;
  const state = { artist: "all", genre: "all", page: 1 };

  /* Final category layout override. */
  const categoryStyle = document.createElement("style");
  categoryStyle.textContent = `
    body.gallery-page .gallery-sidebar { padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;overflow:visible!important;max-width:100%!important; }
    body.gallery-page .gallery-filter-group { display:grid!important;grid-template-columns:5.7em minmax(0,1fr)!important;align-items:start!important;column-gap:0!important;width:100%!important; }
    body.gallery-page .gallery-filter-title { width:100%!important;white-space:nowrap!important; }
    body.gallery-page .gallery-filter-options { display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;min-width:0!important;gap:0!important; }
    body.gallery-page .gallery-filter { position:relative!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;margin:0!important;padding:.2rem 18px!important;white-space:nowrap!important;text-align:center!important;justify-content:center!important; }
    body.gallery-page .gallery-filter:first-child { padding-left:18px!important; }
    body.gallery-page .gallery-filter + .gallery-filter::before { content:""!important;position:absolute!important;left:0!important;top:50%!important;width:1px!important;height:1em!important;background:currentColor!important;opacity:.35!important;transform:translateY(-50%)!important; }
    @media (max-width:767px) {
      body.gallery-page .gallery-sidebar { display:block!important;width:100%!important;max-width:100%!important;padding:0!important;overflow-x:auto!important;overflow-y:visible!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin; }
      body.gallery-page .gallery-sidebar__label { width:max-content!important; }
      body.gallery-page .gallery-filter-group { grid-template-columns:5.7em auto!important;width:max-content!important;min-width:100%!important; }
      body.gallery-page .gallery-filter-options { width:max-content!important;min-width:0!important;padding:0!important; }
      body.gallery-page [data-filter-group="artist"] { display:grid!important;grid-template-columns:repeat(5,7.5em)!important;grid-template-rows:2.7rem!important;width:max-content!important;overflow:visible!important;white-space:nowrap!important; }
      body.gallery-page [data-filter-group="genre"] { display:grid!important;grid-template-columns:repeat(5,7.5em)!important;grid-template-rows:repeat(2,2.7rem)!important;grid-auto-flow:row!important;width:max-content!important;overflow:visible!important; }
      body.gallery-page [data-filter-group="artist"] .gallery-filter,body.gallery-page [data-filter-group="genre"] .gallery-filter { box-sizing:border-box!important;width:7.5em!important;padding:.2rem 18px!important; }
      body.gallery-page [data-filter-group="genre"] .gallery-filter:nth-child(6)::before { content:none!important; }
    }
  `;
  document.head.appendChild(categoryStyle);

  if (!cards.length) return;
  const values = raw => String(raw || "").split(/[、,\/・|]/).map(v => v.trim()).filter(Boolean);
  const matches = (raw, selected) => selected === "all" || values(raw).includes(selected);
  const filteredCards = () => cards.filter(card => matches(card.dataset.artist, state.artist) && matches(card.dataset.genre, state.genre));

  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.replaceChildren();
    pagination.hidden = totalPages <= 1;
    if (totalPages <= 1) return;
    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.className = "gallery-page-button liquid-control liquid-control--compact";
      button.type = "button";
      button.textContent = `${page}P`;
      if (page === state.page) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { state.page = page; render(); });
      pagination.appendChild(button);
    }
  }

  function render() {
    const filtered = filteredCards();
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    cards.forEach(card => { card.hidden = true; });
    const start = (state.page - 1) * pageSize;
    filtered.slice(start, start + pageSize).forEach(card => { card.hidden = false; });
    if (result) result.textContent = filtered.length ? `${filtered.length}作品` : "該当する作品はありません";
    renderPagination(totalPages);
  }

  filters.forEach(button => {
    button.addEventListener("click", () => {
      const wrapper = button.closest("[data-filter-group]");
      const group = wrapper?.dataset.filterGroup;
      if (!group || !(group in state)) return;
      state[group] = button.dataset.filterValue || "all";
      state.page = 1;
      wrapper.querySelectorAll(".gallery-filter").forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("galleryModalImage");
  const modalTitle = document.getElementById("galleryModalTitle");
  const modalCaption = document.getElementById("galleryModalCaption");
  const modalProfile = document.getElementById("galleryModalProfile");
  const modalSlides = document.getElementById("galleryModalSlides");
  const prev = document.getElementById("galleryModalPrev");
  const next = document.getElementById("galleryModalNext");
  let modalIndex = 0;
  let lastFocus = null;

  const profiles = {
    Mizuki: "自然や感情から受け取った感覚をもとに、抽象表現を中心とした作品を制作しています。"
  };

  function showSlide(index) {
    modalIndex = (index + cards.length) % cards.length;
    const card = cards[modalIndex];
    const image = card.querySelector(".work-img > img");
    const title = card.querySelector(".gallery-work-link h2")?.textContent || "作品";
    const artist = card.dataset.artist || "";
    if (modalImage && image) {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalCaption) modalCaption.textContent = card.dataset.caption || "";
    if (modalProfile) modalProfile.textContent = profiles[artist] || `${artist}の作家プロフィールは準備中です。`;
    modalSlides?.querySelectorAll("button").forEach((button, i) => button.classList.toggle("is-active", i === modalIndex));
  }

  function buildSlides() {
    if (!modalSlides) return;
    modalSlides.replaceChildren();
    cards.forEach((card, index) => {
      const source = card.querySelector(".work-img > img");
      if (!source) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-modal__thumb";
      button.setAttribute("aria-label", `${index + 1}番目の作品を表示`);
      const image = document.createElement("img");
      image.src = source.src;
      image.alt = "";
      button.appendChild(image);
      button.addEventListener("click", () => showSlide(index));
      modalSlides.appendChild(button);
    });
  }

  function openModal(index) {
    if (!modal) return;
    lastFocus = document.activeElement;
    showSlide(index);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-gallery-modal-open");
    modal.querySelector(".gallery-modal__close")?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-gallery-modal-open");
    lastFocus?.focus?.();
  }

  buildSlides();
  cards.forEach((card, index) => {
    const link = card.querySelector(".gallery-work-link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${link?.querySelector("h2")?.textContent || "作品"}の詳細を見る`);
    card.addEventListener("click", event => {
      event.preventDefault();
      openModal(index);
    });
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(index);
      }
    });
  });
  modal?.querySelectorAll("[data-gallery-modal-close]").forEach(button => button.addEventListener("click", closeModal));
  prev?.addEventListener("click", () => showSlide(modalIndex - 1));
  next?.addEventListener("click", () => showSlide(modalIndex + 1));
  document.addEventListener("keydown", event => {
    if (!modal?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") showSlide(modalIndex - 1);
    if (event.key === "ArrowRight") showSlide(modalIndex + 1);
  });

  render();
});