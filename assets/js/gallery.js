document.addEventListener("DOMContentLoaded", () => {
  const allArtworks = Array.from(document.querySelectorAll(".gallery-card"));
  const pagination = document.getElementById("galleryPagination");
  const result = document.getElementById("galleryResult");
  const filters = Array.from(document.querySelectorAll(".gallery-filter"));
  const pageSize = 10;
  const state = { artist: "all", genre: "all", page: 1 };

  /* Final category layout override. */
  // const categoryStyle = document.createElement("style");
  // categoryStyle.textContent = `
  //   body.gallery-page .gallery-sidebar { padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;overflow:visible!important;max-width:100%!important; }
  //   body.gallery-page .gallery-filter-group { display:grid!important;grid-template-columns:5.7em minmax(0,1fr)!important;align-items:start!important;column-gap:0!important;width:100%!important; }
  //   body.gallery-page .gallery-filter-title { width:100%!important;white-space:nowrap!important; }
  //   body.gallery-page .gallery-filter-options { display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;min-width:0!important;gap:0!important; }
  //   body.gallery-page .gallery-filter { position:relative!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;margin:0!important;padding:.2rem 18px!important;white-space:nowrap!important;text-align:center!important;justify-content:center!important; }
  //   body.gallery-page .gallery-filter:first-child { padding-left:18px!important; }
  //   body.gallery-page .gallery-filter + .gallery-filter::before { content:""!important;position:absolute!important;left:0!important;top:50%!important;width:1px!important;height:1em!important;background:currentColor!important;opacity:.35!important;transform:translateY(-50%)!important; }
  //   @media (max-width:767px) {
  //     body.gallery-page .gallery-sidebar { display:block!important;width:100%!important;max-width:100%!important;padding:0!important;overflow-x:auto!important;overflow-y:visible!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin; }
  //     body.gallery-page .gallery-sidebar__label { width:max-content!important; }
  //     body.gallery-page .gallery-filter-group { grid-template-columns:5.7em auto!important;width:max-content!important;min-width:100%!important; }
  //     body.gallery-page .gallery-filter-options { width:max-content!important;min-width:0!important;padding:0!important; }
  //     body.gallery-page [data-filter-group="artist"] { display:grid!important;grid-template-columns:repeat(5,7.5em)!important;grid-template-rows:2.7rem!important;width:max-content!important;overflow:visible!important;white-space:nowrap!important; }
  //     body.gallery-page [data-filter-group="genre"] { display:grid!important;grid-template-columns:repeat(5,7.5em)!important;grid-template-rows:repeat(2,2.7rem)!important;grid-auto-flow:row!important;width:max-content!important;overflow:visible!important; }
  //     body.gallery-page [data-filter-group="artist"] .gallery-filter,body.gallery-page [data-filter-group="genre"] .gallery-filter { box-sizing:border-box!important;width:7.5em!important;padding:.2rem 18px!important; }
  //     body.gallery-page [data-filter-group="genre"] .gallery-filter:nth-child(6)::before { content:none!important; }
  //   }
  // `;
  // document.head.appendChild(categoryStyle);

  if (!allArtworks.length) return;
  const values = raw => String(raw || "").split(/[、,\/・|]/).map(v => v.trim()).filter(Boolean);
  const matches = (raw, selected) => selected === "all" || values(raw).includes(selected);
  let filteredArtworks = [];
  const getFilteredArtworks = () => allArtworks.filter(artwork => matches(artwork.dataset.artist, state.artist) && matches(artwork.dataset.genre, state.genre));

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
    filteredArtworks = getFilteredArtworks();
    const totalPages = Math.max(1, Math.ceil(filteredArtworks.length / pageSize));
    state.page = Math.min(state.page, totalPages);
    allArtworks.forEach(artwork => { artwork.hidden = true; });
    const start = (state.page - 1) * pageSize;
    filteredArtworks.slice(start, start + pageSize).forEach(artwork => { artwork.hidden = false; });
    if (result) result.textContent = filteredArtworks.length ? String(filteredArtworks.length) + "作品" : "該当する作品はありません";
    renderPagination(totalPages);
    if (currentArtwork && !filteredArtworks.includes(currentArtwork)) {
      closeModal();
      currentArtwork = null;
      requestedArtwork = null;
    } else if (currentArtwork && modal?.classList.contains("is-open")) {
      buildSlides();
      showArtwork(currentArtwork, false);
    }
    updateNavigationState();
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
  const modalBody = modal?.querySelector(".gallery-modal__body");
  const modalTitle = document.getElementById("galleryModalTitle");
  const modalCaption = document.getElementById("galleryModalCaption");
  const modalProfile = document.getElementById("galleryModalProfile");
  const modalProfileImage = document.getElementById("galleryModalProfileImage");
  const modalProfileName = document.getElementById("galleryModalProfileName");
  const modalHistory = document.getElementById("galleryModalHistory");
  const modalInstagram = modal?.querySelector("#galleryModalInstagramLink");
  const modalPortfolio = modal?.querySelector("#galleryModalPortfolioLink");
  const modalSlides = document.getElementById("galleryModalSlides");
  const prev = document.getElementById("galleryModalPrev");
  const next = document.getElementById("galleryModalNext");
  let currentArtwork = null;
  let requestedArtwork = null;
  let lastFocus = null;
  let imageSwitchTimer = 0;
  let imageSwitchToken = 0;
  let modalCloseTimer = 0;
  let modalMotionToken = 0;
  const artworkPreloads = new Map();

  const artistMetadata = {
    "Mizuki": {
      profile: "小山瑞樹 / Mizuki Oyama<br>宮城県仙台市出身の抽象画家。<br>自然の中にある、静けさと動き、秩序と混沌、意図と偶然。<br>相反するものが共に存在する曖昧さに惹かれ、「NatureInspire」を軸に制作している。計画と偶然のあいだで、色や形の変化に応答しながら、その瞬間に生まれる感覚を作品へと置き換えていく。<br>答えや解釈を決めるのではなく、見る人が感じ、考え、自分自身と向き合える余白を残すことを大切にしている。",
      profileImage: "./assets/img/mizuki_profile.webp",
            history: [
        { date: "2021年 03月より", description: "出展活動を始める" },
        { date: "2021年 04月", description: "チャリティアート展 会場 / 東京" },
        { date: "2021年 08月", description: "OASISU2021 会場 / 大阪あべのハルカス" },
        { date: "2021年 11月", description: "サロン・ド・アール・ジャポネ 会場 / フランス" },
        { date: "2022年 04月", description: "日アセアン友好文化交流展 会場 / 東京アセアンセンター" },
        { date: "2022年 11月", description: "芸術の虎展 会場 / 日光東照宮美術館" },
        { date: "2023年 06月", description: "第2回日仏友好オリジナル切手展 会場 / フランス" },
        { date: "2025年 03月", description: "日台の絆展 会場 / 台湾" }
      ],
      instagramUrl: "https://www.instagram.com/o.mizuki_1998/",
      portfolioUrl: "https://mizukioyama.github.io/website/",
    },
    "KAoRU": {
      profile: "Alcohol ink artist / 仙台在住 / 宮城県石巻市出身 / 1981年5月生まれ / おうし座 B型<br>アーティスト×薬剤師<br>色と形の一期一会<br>KAoRUの作品は「ありのまま」がテーマ人の感情や思いが色や形となり、アートとなる。そして、丸キャンパスにこだわりを持ち描き続ける。<br>そこには、<br>「どれがアートの天地か、どれがアートの正面かを決めず、 見た方が見たい角度で、見たいように、感じたいように、その時の感情に合わせてアートの見方を決めてほしい」という思いがある。<br>また、アルコールインクをドライヤーの風で動かしながら描くため、色の混ざり具合や形は同じものがなく、唯一無二の作品になることから私のアートを「色と形の一期一会」と表現している。",
      history: [
        { date: "2022年 03月より", description: "独学でインクアートを始める" },
        { date: "2023年 06月", description: "個展「一期一会」開催(仙台市)" },
        { date: "2023年 09月", description: "仙台アンデパンダン展出展" },
        { date: "2024年 06月", description: "合同企画展(仙台市)" },
        { date: "2024年 11月", description: "合同企画展(盛岡市)" },
        { date: "2025年 02月", description: "第一回東北アルコールインクアート展出展" },
        { date: "2025年 04月", description: "日仏彩美国際美術展 第30回 彩美展 奨励賞" }
      ],
      profileImage: "./assets/img/kaoru_profile.jpg",
      instagramUrl: "https://www.instagram.com/kaoru_ink_art/",
    },
    "森元咲喜": {
      profile: "⁡⁡花、宇宙、絶滅危惧種の動物をモチーフに、アクリル画を手がけるアーティスト。<br>ドットペインティング(点描)を用いたアクリル 画を制作。<br>静けさの中にある生命力や宇宙の広がり、そこに宿る魂の輝きを、一粒一粒の点に落とし込んでいる。<br>2013年に初作品を発表し、2021年より本格的に活動を開始。<br>創作の模索を重ねる中、2026年友人から贈られた「森元咲喜｣の名を掲げ、活動の新たな章を開く。<br>観る人の心に静かな対話と、深い余韻をもたらす表現を追求している。",
      profileImage: "./assets/img/saki_profile.jpg",
      instagramUrl: "https://www.instagram.com/masa_ki.0102/",
    },
    "Quriqan": {
      profile: "",
      profileImage: "./assets/img/mizuki_profile.webp",
      instagramUrl: "https://www.instagram.com/eiende_wanai_dakara/",
    },
  };

  function getArtworkImage(artwork) {
    return artwork?.querySelector(".work-img > img") || null;
  }

  function preloadArtwork(artwork) {
    const source = getArtworkImage(artwork);
    const sourceUrl = source?.currentSrc || source?.src;
    if (!sourceUrl) return Promise.resolve(null);

    const cached = artworkPreloads.get(sourceUrl);
    if (cached) return cached;

    const preload = new window.Image();
    preload.decoding = "async";
    const loaded = new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve(preload.naturalWidth > 0 ? preload : null);
      };
      preload.addEventListener("load", finish, { once: true });
      preload.addEventListener("error", finish, { once: true });
      preload.src = sourceUrl;
      if (preload.complete) finish();
    });
    const ready = loaded.then(async image => {
      if (!image) return null;
      if (typeof image.decode === "function") {
        try {
          await image.decode();
        } catch {
          // A loaded image remains usable if decode() is unsupported or rejects.
        }
      }
      return image.naturalWidth > 0 ? image : null;
    });
    artworkPreloads.set(sourceUrl, ready);
    return ready;
  }

  function preloadAdjacentArtwork(artwork) {
    const index = filteredArtworks.indexOf(artwork);
    if (index < 0 || filteredArtworks.length < 2) {
      artworkPreloads.clear();
      return;
    }

    const adjacentArtworks = [...new Set([
      filteredArtworks[(index - 1 + filteredArtworks.length) % filteredArtworks.length],
      filteredArtworks[(index + 1) % filteredArtworks.length],
    ])];
    const adjacentSources = new Set(adjacentArtworks.map(adjacentArtwork => {
      const image = getArtworkImage(adjacentArtwork);
      return image?.currentSrc || image?.src;
    }).filter(Boolean));

    artworkPreloads.forEach((_, sourceUrl) => {
      if (!adjacentSources.has(sourceUrl)) artworkPreloads.delete(sourceUrl);
    });
    adjacentArtworks.forEach(adjacentArtwork => { void preloadArtwork(adjacentArtwork); });
  }

  function renderArtistHistory(history) {
    if (!modalHistory) return;
    modalHistory.replaceChildren();
    if (!Array.isArray(history) || history.length === 0) {
      modalHistory.hidden = true;
      return;
    }

    const heading = document.createElement("h4");
    heading.className = "gallery-modal__history-title";
    heading.textContent = "活動歴";

    const table = document.createElement("table");
    table.className = "gallery-modal__history-table";
    const tableHead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["年月", "内容"].forEach(label => {
      const header = document.createElement("th");
      header.scope = "col";
      header.textContent = label;
      headerRow.appendChild(header);
    });
    tableHead.appendChild(headerRow);

    const tableBody = document.createElement("tbody");
    history.forEach(item => {
      const row = document.createElement("tr");
      const date = document.createElement("td");
      date.textContent = item.date || "";
      const description = document.createElement("td");
      description.textContent = item.description || "";
      row.append(date, description);
      tableBody.appendChild(row);
    });

    table.append(tableHead, tableBody);
    modalHistory.append(heading, table);
    modalHistory.hidden = false;
  }

  function updateArtworkInformation(artwork, image) {
    const title = artwork.querySelector(".gallery-work-link .gallery-work-title")?.textContent?.trim()
      || artwork.querySelector(".gallery-work-link h2")?.textContent?.trim()
      || "作品";
    const artist = artwork.dataset.artist || "";
    const artistId = artwork.dataset.artistId || artist;
    const metadata = artistMetadata[artistId] || {};
    if (modalTitle) modalTitle.textContent = title;
    if (modalCaption) modalCaption.textContent = artwork.dataset.caption || "";
    if (modalProfileName) modalProfileName.textContent = artist;
    if (modalProfile) {
      const profileText = metadata.profile || artist + "の作家プロフィールは準備中です。";
      modalProfile.replaceChildren();
      profileText.split(/<br\s*\/?>/gi).forEach((line, index) => {
        if (index > 0) modalProfile.appendChild(document.createElement("br"));
        modalProfile.appendChild(document.createTextNode(line));
      });
    }
    renderArtistHistory(metadata.history);
    if (modalProfileImage) {
      const profileImageSrc = metadata.profileImage || image?.src;
      if (profileImageSrc) modalProfileImage.src = profileImageSrc;
      else modalProfileImage.removeAttribute("src");
      modalProfileImage.alt = artist + " プロフィール画像（仮）";
    }
    modalSlides?.querySelectorAll("button").forEach((button, index) => {
      button.classList.toggle("is-active", filteredArtworks[index] === artwork);
    });
    if (modalInstagram) {
      if (metadata.instagramUrl) {
        modalInstagram.href = metadata.instagramUrl;
        modalInstagram.target = "_blank";
        modalInstagram.rel = "noopener noreferrer";
        modalInstagram.hidden = false;
      } else {
        modalInstagram.removeAttribute("href");
        modalInstagram.hidden = true;
      }
    }
    if (modalPortfolio) {
      if (metadata.portfolioUrl) {
        modalPortfolio.href = metadata.portfolioUrl;
        modalPortfolio.target = "_blank";
        modalPortfolio.rel = "noopener noreferrer";
        modalPortfolio.setAttribute("aria-label", `${artist} Portfolio`);
        modalPortfolio.hidden = false;
      } else {
        modalPortfolio.removeAttribute("href");
        modalPortfolio.removeAttribute("aria-label");
        modalPortfolio.hidden = true;
      }
    }
  }

  function showArtwork(artwork, animateImage = modal?.classList.contains("is-visible")) {
    if (!artwork || !filteredArtworks.includes(artwork)) return;
    const image = getArtworkImage(artwork);
    if (!image) return;

    window.clearTimeout(imageSwitchTimer);
    const switchToken = ++imageSwitchToken;
    modalImage?.classList.remove("is-fading");
    modalBody?.classList.remove("is-switching");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sourceUrl = image.currentSrc || image.src;
    const shouldCrossfade = Boolean(
      animateImage && !reduceMotion && modal?.classList.contains("is-open") &&
      modalImage && currentArtwork !== artwork && modalImage.currentSrc !== sourceUrl
    );

    requestedArtwork = artwork;
    if (shouldCrossfade) {
      preloadArtwork(artwork).then(loadedImage => {
        if (switchToken !== imageSwitchToken) return;
        if (!loadedImage || !modal?.classList.contains("is-open") || modal.classList.contains("is-closing")) {
          requestedArtwork = currentArtwork;
          return;
        }

        modalImage.classList.add("is-fading");
        modalBody?.classList.add("is-switching");
        imageSwitchTimer = window.setTimeout(() => {
          if (switchToken !== imageSwitchToken || !modal.classList.contains("is-open") || modal.classList.contains("is-closing")) return;
          currentArtwork = artwork;
          requestedArtwork = artwork;
          modalImage.src = loadedImage.src;
          modalImage.alt = image.alt;
          updateArtworkInformation(artwork, image);
          window.requestAnimationFrame(() => {
            if (switchToken !== imageSwitchToken) return;
            modalImage.classList.remove("is-fading");
            modalBody?.classList.remove("is-switching");
            preloadAdjacentArtwork(artwork);
          });
        }, 160);
      });
      return;
    }

    currentArtwork = artwork;
    requestedArtwork = artwork;
    modalImage?.classList.remove("is-fading");
    modalBody?.classList.remove("is-switching");
    if (modalImage) {
      modalImage.src = sourceUrl;
      modalImage.alt = image.alt;
    }
    updateArtworkInformation(artwork, image);
    preloadAdjacentArtwork(artwork);
  }

  function updateNavigationState() {
    const disabled = filteredArtworks.length <= 1;
    if (prev) prev.disabled = disabled;
    if (next) next.disabled = disabled;
  }

  function navigateArtwork(direction) {
    if (filteredArtworks.length <= 1) return;
    const baseArtwork = requestedArtwork || currentArtwork;
    const index = filteredArtworks.indexOf(baseArtwork);
    if (index < 0) return;
    const nextIndex = (index + direction + filteredArtworks.length) % filteredArtworks.length;
    showArtwork(filteredArtworks[nextIndex]);
  }

  function buildSlides() {
    if (!modalSlides) return;
    modalSlides.replaceChildren();
    filteredArtworks.forEach((artwork, index) => {
      const source = getArtworkImage(artwork);
      if (!source) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-modal__thumb";
      button.setAttribute("aria-label", String(index + 1) + "番目の作品を表示");
      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = source.src;
      thumbnailImage.alt = "";
      thumbnailImage.setAttribute("data-art-protect", "");
      thumbnailImage.draggable = false;
      button.appendChild(thumbnailImage);
      button.addEventListener("click", () => showArtwork(artwork));
      modalSlides.appendChild(button);
    });
    updateNavigationState();
  }

  function openModal(artwork) {
    if (!modal || !filteredArtworks.includes(artwork)) return;
    window.clearTimeout(modalCloseTimer);
    const motionToken = ++modalMotionToken;
    lastFocus = document.activeElement;
    buildSlides();
    showArtwork(artwork, false);
    modal.classList.remove("is-closing", "is-visible");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-gallery-modal-open");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      modal.classList.add("is-visible");
    } else {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        if (motionToken === modalMotionToken && modal.classList.contains("is-open") && !modal.classList.contains("is-closing")) {
          modal.classList.add("is-visible");
        }
      }));
    }
    modal.querySelector(".gallery-modal__close")?.focus();
  }

  function finishModalClose(motionToken) {
    if (!modal || motionToken !== modalMotionToken || !modal.classList.contains("is-closing")) return;
    modal.classList.remove("is-open", "is-closing", "is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-gallery-modal-open");
  }

  function closeModal() {
    if (!modal || !modal.classList.contains("is-open") || modal.classList.contains("is-closing")) return;
    const motionToken = ++modalMotionToken;
    modal.classList.add("is-closing");
    modal.classList.remove("is-visible");
    window.clearTimeout(imageSwitchTimer);
    imageSwitchToken += 1;
    requestedArtwork = currentArtwork;
    modalImage?.classList.remove("is-fading");
    modalBody?.classList.remove("is-switching");
    lastFocus?.focus?.();
    window.clearTimeout(modalCloseTimer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishModalClose(motionToken);
    } else {
      modalCloseTimer = window.setTimeout(() => finishModalClose(motionToken), 320);
    }
  }

  allArtworks.forEach(artwork => {
    const link = artwork.querySelector(".gallery-work-link");
    const title = link?.querySelector(".gallery-work-title, h2")?.textContent?.trim() || "作品";
    artwork.setAttribute("tabindex", "0");
    artwork.setAttribute("role", "button");
    artwork.setAttribute("aria-label", title + "の詳細を見る");
    artwork.addEventListener("click", event => {
      event.preventDefault();
      openModal(artwork);
    });
    artwork.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(artwork);
      }
    });
  });
  modal?.querySelectorAll("[data-gallery-modal-close]").forEach(button => button.addEventListener("click", closeModal));
  prev?.addEventListener("click", () => navigateArtwork(-1));
  next?.addEventListener("click", () => navigateArtwork(1));
  document.addEventListener("keydown", event => {
    if (!modal?.classList.contains("is-open") || modal.classList.contains("is-closing")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") navigateArtwork(-1);
    if (event.key === "ArrowRight") navigateArtwork(1);
  });

  render();
});
