/**
 * ==========================================
 * Header / Footer Auto Loader
 * GitHub Pages対応
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const PARTS_PATH = "./assets/parts/";
  const PARTS_VERSION = "integrated-renewal-3";
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
    loadHTML(`${PARTS_PATH}footer.xml`, selectors.footer),
  ]);

  initializeHeaderMenu();
  initializeCurrentYear();
  initializeCurrentPage();
  initializeCustomCursor();
  initializeScrollGuidePosition();
  document.body.classList.add("is-loaded");
  document.dispatchEvent(new Event("yurayura:fragments-ready"));
});

function initializeHeaderMenu() {
  const header = document.querySelector(".header");
  const menuToggle = header?.querySelector(".menu-toggle");
  const menuLinks = header ? [...header.querySelectorAll(".header-link")] : [];
  if (!header || !menuToggle) { console.warn("メニュー要素が見つかりません"); return; }

  const mobileNavigation = window.matchMedia("(max-width: 1199px)");
  const isOpen = () => header.classList.contains("is-open");
  const headerMenu = header.querySelector("#header-menu");
  const backgroundElements = [...document.body.children].filter(element => element.id !== "js-header");
  const inertBeforeOpen = new Map();
  let scrollPosition = 0;

  function lockBackground() {
    scrollPosition = window.scrollY;
    document.body.style.setProperty("--menu-scroll-top", `${-scrollPosition}px`);
    document.body.classList.add("menu-open");
    [...backgroundElements, header.querySelector(".header-txt")].filter(Boolean).forEach(element => {
      inertBeforeOpen.set(element, element.inert);
      element.inert = true;
    });
  }

  function unlockBackground() {
    document.body.classList.remove("menu-open");
    document.body.style.removeProperty("--menu-scroll-top");
    inertBeforeOpen.forEach((wasInert, element) => { element.inert = wasInert; });
    inertBeforeOpen.clear();
    const restoreScrollPosition = scrollPosition;
    window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      root.scrollTop = restoreScrollPosition;
      root.style.scrollBehavior = previousScrollBehavior;
    });
  }

  function setMenuState(open, restoreFocus = false) {
    const shouldOpen = mobileNavigation.matches && open;
    const wasOpen = isOpen();
    if (shouldOpen && !wasOpen) lockBackground();
    header.classList.toggle("is-open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute("aria-label", shouldOpen ? "メニューを閉じる" : "メニューを開く");
    if (shouldOpen && headerMenu) headerMenu.removeAttribute("aria-hidden");
    else if (headerMenu && mobileNavigation.matches) headerMenu.setAttribute("aria-hidden", "true");
    else if (headerMenu) headerMenu.removeAttribute("aria-hidden");
    if (!shouldOpen && wasOpen) unlockBackground();
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
    if (shouldOpen && menuLinks[0]) menuLinks[0].focus();
  }

  menuToggle.addEventListener("click", () => {
    const wasOpen = isOpen();
    setMenuState(!wasOpen, wasOpen);
  });
  menuLinks.forEach(link => link.addEventListener("click", () => {
    if (mobileNavigation.matches && isOpen()) setMenuState(false, true);
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && isOpen()) {
      setMenuState(false, true);
      return;
    }
    if (event.key !== "Tab" || !isOpen()) return;
    const focusableItems = [menuToggle, ...menuLinks].filter(element => !element.disabled && element.getClientRects().length);
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];
    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem?.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem?.focus();
    }
  });

  const resetForBreakpoint = () => {
    setMenuState(false);
  };
  if (mobileNavigation.addEventListener) mobileNavigation.addEventListener("change", resetForBreakpoint);
  else mobileNavigation.addListener(resetForBreakpoint);

  if (headerMenu && mobileNavigation.matches) headerMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "メニューを開く");
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
      const isCurrent = normalizePath(linkURL.pathname) === currentPath;
      link.classList.toggle("is-current", isCurrent);
      if (link.classList.contains("header-link")) {
        if (isCurrent) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
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
  const hoverTargets = ["a", "button", ".card__btn"];
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hoverTargets.push(
      "body.information-page .faq-item > summary",
      "body.contact-page .faq-item > summary"
    );
  }
  document.querySelectorAll(hoverTargets.join(", ")).forEach(target => {
    target.addEventListener("pointerenter", () => stalker.classList.add("is-active"));
    target.addEventListener("pointerleave", () => stalker.classList.remove("is-active"));
  });
}

/* Keep Scroll on one shared FV axis. On PC, Top and Concept are anchored
   to the bottom edge of their FV with bottom: 0. */
function initializeScrollGuidePosition() {
  const guide = document.querySelector(".scroll-guide");
  if (document.body.classList.contains("gallery-page")) return;
  const title = document.querySelector(".concept-fv h1, .gallery .h1-text h1, .top-page .fv h1");
  if (!guide || !title) return;

  const positionGuide = () => {
    const containingBlock = guide.offsetParent;
    if (!containingBlock) return;
    const titleRect = title.getBoundingClientRect();
    const parentRect = containingBlock.getBoundingClientRect();
    const isTopPage = document.body.classList.contains("top-page");
    const conceptFv = title.closest(".concept-fv");
    const usesConceptFv = Boolean(conceptFv);
    const isPc = window.innerWidth >= 1200;
    const isReadingPage = document.body.matches(".information-page, .contact-page, .policy-page");

    guide.style.setProperty("position", "absolute", "important");
    guide.style.setProperty("transform", "none", "important");

    if (isPc && (isTopPage || usesConceptFv)) {
      guide.style.setProperty("top", "auto", "important");
      guide.style.setProperty("bottom", "0px", "important");
      guide.setAttribute("data-positioned", "");
      return;
    }

    if (!isPc && isReadingPage && usesConceptFv) {
      const subtitle = conceptFv.querySelector(".fv__txt");
      const bar = guide.querySelector(".scroll-guide__bar");
      const label = guide.querySelector(".scroll-guide__text");
      const fvRect = conceptFv.getBoundingClientRect();
      const subtitleRect = subtitle?.getBoundingClientRect();
      const labelHeight = label?.getBoundingClientRect().height || 0;
      const barStyle = bar ? getComputedStyle(bar) : null;
      const barGap = barStyle ? Number.parseFloat(barStyle.marginTop) || 0 : 0;
      const compactViewport = window.innerWidth <= 1023;
      const boundedViewport = window.innerWidth <= 1199;
      const gap = window.innerWidth <= 767 ? 16 : 20;
      const minimumGap = 8;
      const bottomSpace = compactViewport ? 8 : 18;
      const nextSection = conceptFv.nextElementSibling;
      const contentEdge = boundedViewport
        ? Math.min(fvRect.bottom, nextSection?.getBoundingClientRect().top ?? fvRect.bottom)
        : fvRect.bottom;
      let guideTop = subtitleRect
        ? subtitleRect.bottom - parentRect.top + gap
        : titleRect.bottom - parentRect.top + gap;
      const available = contentEdge - parentRect.top - guideTop - labelHeight - barGap - bottomSpace;
      const preferred = 140;
      let guideSize = compactViewport
        ? Math.max(0, Math.min(preferred, Math.floor(available / 2) * 2))
        : Math.max(32, Math.min(preferred, Math.floor(available)));

      const setGuideSize = () => {
        conceptFv.style.setProperty("--content-scroll-guide-size", `${guideSize}px`);
        conceptFv.style.setProperty("--content-scroll-guide-start", `${-guideSize}px`);
        conceptFv.style.setProperty("--content-scroll-guide-end", `${guideSize}px`);
      };
      setGuideSize();
      guide.style.setProperty("top", `${guideTop}px`, "important");
      guide.style.setProperty("bottom", "auto", "important");
      let overflow = boundedViewport ? guide.getBoundingClientRect().bottom - (contentEdge - bottomSpace) : 0;
      if (boundedViewport && overflow > 0) {
        const shiftUp = Math.min(Math.max(0, gap - minimumGap), overflow);
        guideTop -= shiftUp;
        guide.style.setProperty("top", `${guideTop}px`, "important");
        overflow = guide.getBoundingClientRect().bottom - (contentEdge - bottomSpace);
        if (overflow > 0) {
          guideSize = Math.max(0, guideSize - Math.ceil(overflow / 2) * 2);
          setGuideSize();
        }
      }
      return;
    }

    let guideTop;
    if (isTopPage) {
      const sharedTitleTop = window.innerWidth <= 767 ? 180 : window.innerWidth * 0.28;
      guideTop = sharedTitleTop + titleRect.height + 140;
    } else if (conceptFv) {
      const inner = conceptFv.querySelector(".fv__inner, .information-hero__inner");
      const layoutTitleTop = inner
        ? inner.getBoundingClientRect().top - conceptFv.getBoundingClientRect().top + title.offsetTop
        : titleRect.top - parentRect.top;
      guideTop = layoutTitleTop + title.offsetHeight + 140;
    } else {
      guideTop = titleRect.bottom - parentRect.top + 140;
    }

    guide.style.setProperty("top", `${guideTop}px`, "important");
    guide.style.setProperty("bottom", "auto", "important");
    guide.setAttribute("data-positioned", "");
  };

  positionGuide();
  window.addEventListener("resize", positionGuide, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(positionGuide);
}
