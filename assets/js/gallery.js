document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const pagination = document.getElementById("galleryPagination");
  const result = document.getElementById("galleryResult");
  const filters = Array.from(document.querySelectorAll(".gallery-filter"));
  const pageSize = 10;
  const state = { artist: "all", genre: "all", page: 1 };

  if (!cards.length) return;

  const values = raw => String(raw || "").split(/[、,\/・|]/).map(v => v.trim()).filter(Boolean);
  const matches = (raw, selected) => selected === "all" || values(raw).includes(selected);

  const filteredCards = () => cards.filter(card =>
    matches(card.dataset.artist, state.artist) && matches(card.dataset.genre, state.genre)
  );

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

  render();
});