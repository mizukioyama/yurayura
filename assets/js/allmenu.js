/**
 * ==========================================
 * Header / Footer Auto Loader
 * GitHub Pages対応
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const PARTS_PATH = "./assets/parts/";
  const PARTS_VERSION = "20260913-menu-border-center-spacing-v7";
  const selectors = { header: "#js-header", footer: "#js-footer" };

  async function loadHTML(url, targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) { console.warn(`要素が見つかりません: ${targetSelector}`); return; }
    try {
      const response = await fetch(`${url}?v=${PARTS_VERSION}`);
      if (!response.ok) throw new Error(`読み込み失敗: ${url} Status: ${response.status}`);
      target.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      target.innerHTML = `<div class="parts-load-error">パーツ読み込みエラー: ${url}</div>`;
    }
  }

  await Promise.all([
    loadHTML(`${PARTS_PATH}header.html`, selectors.header),
    loadHTML(`${PARTS_PATH}footer.html`, selectors.footer),
  ]);

  initializeHeaderMenu();
  initializeCurrentYear();
  initializeCurrentPage();
  initializeCustomCursor();
  initializeScrollGuidePosition();
  document.body.classList.add("is-loaded");
});

function initializeHeaderMenu() {
  const header = document.querySelector(".header");
  const menuToggle = header?.querySelector(".menu-toggle");
  if (!header || !menuToggle) { console.warn("メニュー要素が見つかりません"); return; }
  const menuLinks = header.querySelectorAll(".header-link");
  let animationFrameId = null;

  function setScrollLock(isLocked) {
    document.documentElement.classList.toggle("is-menu-open", isLocked);
    document.body.classList.toggle("is-menu-open", isLocked);
  }
  function setMenuState(isOpen) {
    const shouldOpen = isOpen && header.classList.contains("is-compact");
    header.classList.toggle("is-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute("aria-label", shouldOpen ? "メニューを閉じる" : "メニューを開く");
    setScrollLock(shouldOpen);
  }
  function closeMenu() { setMenuState(false); }
  function updateHeaderState() {
    if (header.classList.contains("is-open")) return;
    const compactThreshold = window.innerHeight * 0.6;
    const shouldCompact = window.scrollY >= compactThreshold;
    header.classList.toggle("is-compact", shouldCompact);
    if (!shouldCompact) closeMenu();
  }
  function requestHeaderUpdate() {
    if (animationFrameId !== null) return;
    animationFrameId = requestAnimationFrame(() => {
      updateHeaderState();
      animationFrameId = null;
    });
  }

  menuToggle.addEventListener("click", event => {
    event.preventDefault();
    setMenuState(!header.classList.contains("is-open"));
  });
  menuLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !header.classList.contains("is-open")) return;
    closeMenu();
    menuToggle.focus();
  });
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate, { passive: true });
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "メニューを開く");
  updateHeaderState();
}

function initializeCurrentYear() {
  const year = document.querySelector("#js-year");
  if (year) year.textContent = new Date().getFullYear();
}

function initializeCurrentPage() {
  const currentPath = normalizePath(location.pathname);
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    try {
      const linkURL = new URL(href, location.href);
      if (linkURL.origin !== location.origin) return;
      link.classList.toggle("is-current", normalizePath(linkURL.pathname) === currentPath);
    } catch (error) { console.warn(`無効なリンクです: ${href}`, error); }
  });
}

function normalizePath(pathname) {
  let normalizedPath = pathname.replace(/\/+$/, "");
  normalizedPath = normalizedPath.replace(/\/index\.html$/, "");
  return normalizedPath || "/";
}

function initializeCustomCursor() {
  const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!canUseCustomCursor.matches) return;
  const cursor = document.getElementById("cursor");
  const stalker = document.getElementById("stalker");
  if (!cursor || !stalker) return;
  let mouseX = 0, mouseY = 0, animationFrameId = null;
  function updateCursorPosition() {
    const transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    cursor.style.transform = transform;
    stalker.style.transform = transform;
    animationFrameId = null;
  }
  document.addEventListener("pointermove", event => {
    mouseX = event.clientX; mouseY = event.clientY;
    if (animationFrameId !== null) return;
    animationFrameId = requestAnimationFrame(updateCursorPosition);
  }, { passive: true });
  document.querySelectorAll("a, button, .card__btn").forEach(target => {
    target.addEventListener("pointerenter", () => stalker.classList.add("is-active"));
    target.addEventListener("pointerleave", () => stalker.classList.remove("is-active"));
  });
}

/* Keep Scroll on one shared FV axis. On PC, Top and Concept are anchored
   to the bottom edge of their FV with bottom: 0. */
function initializeScrollGuidePosition() {
  const guide = document.querySelector(".scroll-guide");
  const title = document.querySelector(".concept-fv h1, .gallery .h1-text h1, .top-page .fv h1");
  if (!guide || !title) return;

  const positionGuide = () => {
    const containingBlock = guide.offsetParent;
    if (!containingBlock) return;
    const titleRect = title.getBoundingClientRect();
    const parentRect = containingBlock.getBoundingClientRect();
    const isTopPage = document.body.classList.contains("top-page");
    const isConceptPage = document.body.classList.contains("concept-page");
    const isPc = window.innerWidth >= 1200;

    guide.style.setProperty("position", "absolute", "important");
    guide.style.setProperty("transform", "none", "important");

    if (isPc && (isTopPage || isConceptPage)) {
      guide.style.setProperty("top", "auto", "important");
      guide.style.setProperty("bottom", "0px", "important");
      return;
    }

    let guideTop;
    if (isTopPage) {
      const sharedTitleTop = window.innerWidth <= 767 ? 180 : window.innerWidth * 0.28;
      guideTop = sharedTitleTop + titleRect.height + 140;
    } else {
      guideTop = titleRect.bottom - parentRect.top + 140;
    }

    guide.style.setProperty("top", `${guideTop}px`, "important");
    guide.style.setProperty("bottom", "auto", "important");
  };

  positionGuide();
  window.addEventListener("resize", positionGuide, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(positionGuide);
}
