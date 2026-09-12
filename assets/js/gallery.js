document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("js-year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const menuButton = document.querySelector(".js-menu");
  const drawer = document.querySelector(".js-drawer");

  if (menuButton && drawer) {
    const setMenuState = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      menuButton.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "メニューを閉じる" : "メニューを開く"
      );
      drawer.setAttribute("aria-hidden", String(!isOpen));
      document.documentElement.style.overflow = isOpen ? "hidden" : "";
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    menuButton.addEventListener("click", () => {
      setMenuState(!drawer.classList.contains("is-open"));
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        setMenuState(false);
        menuButton.focus();
      }
    });
  }

  const cards = Array.from(document.querySelectorAll(".gallery-card"));
  const pagination = document.getElementById("galleryPagination");
  const result = document.getElementById("galleryResult");
  const pageSize = 10;
  const state = {
    artist: "all",
    genre: "all",
    page: 1,
  };

  if (!cards.length || !pagination || !result) return;

  function getFilteredCards() {
    return cards.filter((card) => {
      const matchesArtist =
        state.artist === "all" || card.dataset.artist === state.artist;
      const matchesGenre =
        state.genre === "all" || card.dataset.genre === state.genre;

      return matchesArtist && matchesGenre;
    });
  }

  function renderPagination(totalPages) {
    pagination.replaceChildren();
    pagination.hidden = false;

    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.className = "gallery-page-button liquid-control liquid-control--compact";
      button.type = "button";
      button.textContent = `${page}P`;
      button.setAttribute("aria-label", `${page}ページ目を表示`);

      if (page === state.page) {
        button.setAttribute("aria-current", "page");
      }

      button.addEventListener("click", () => {
        state.page = page;
        render();
      });
      pagination.appendChild(button);
    }
  }

  function render() {
    const filteredCards = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    state.page = Math.min(state.page, totalPages);

    cards.forEach((card) => {
      card.hidden = true;
    });

    const start = (state.page - 1) * pageSize;
    filteredCards.slice(start, start + pageSize).forEach((card) => {
      card.hidden = false;
    });

    result.textContent = `${filteredCards.length}作品 / ${state.page} / ${totalPages}ページ`;
    renderPagination(totalPages);
  }

  document.querySelectorAll(".gallery-filter").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest("[data-filter-group]")?.dataset.filterGroup;
      if (!group) return;

      state[group] = button.dataset.filterValue || "all";
      state.page = 1;

      document
        .querySelectorAll(`[data-filter-group="${group}"] .gallery-filter`)
        .forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });

      render();
    });
  });

  render();
});
