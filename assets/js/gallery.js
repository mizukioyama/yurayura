document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const pagination = document.getElementById("galleryPagination");
  const result = document.getElementById("galleryResult");
  const pageSize = 10;
  const state = { artist: "all", genre: "all", medium: "all", page: 1 };

  if (!cards.length || !pagination || !result) return;

  const matchesValue = (rawValue, selected) => {
    if (selected === "all") return true;
    return String(rawValue || "").split(/[、,\/・|]/).map(v => v.trim()).includes(selected);
  };

  function getFilteredCards() {
    return cards.filter(card =>
      matchesValue(card.dataset.artist, state.artist) &&
      matchesValue(card.dataset.genre, state.genre) &&
      matchesValue(card.dataset.medium, state.medium)
    );
  }

  function renderPagination(totalPages) {
    pagination.replaceChildren();
    pagination.hidden = totalPages <= 1;
    if (totalPages <= 1) return;
    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.className = "gallery-page-button liquid-control liquid-control--compact";
      button.type = "button";
      button.textContent = `${page}P`;
      button.setAttribute("aria-label", `${page}ページ目を表示`);
      if (page === state.page) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => { state.page = page; render(); });
      pagination.appendChild(button);
    }
  }

  function render() {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    cards.forEach(card => { card.hidden = true; });
    const start = (state.page - 1) * pageSize;
    filteredCards.slice(start, start + pageSize).forEach(card => { card.hidden = false; });
    result.textContent = filteredCards.length ? `${filteredCards.length}作品 / ${state.page} / ${totalPages}ページ` : "該当する作品はありません";
    renderPagination(totalPages);
  }

  document.querySelectorAll(".gallery-filter").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]")?.dataset.filterGroup;
      if (!group || !(group in state)) return;
      state[group] = button.dataset.filterValue || "all";
      state.page = 1;
      document.querySelectorAll(`[data-filter-group="${group}"] .gallery-filter`).forEach(filterButton => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      render();
    });
  });

  render();
});