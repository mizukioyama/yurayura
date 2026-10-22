/**
 * ==========================================
 * Header / Footer Auto Loader
 * GitHub Pages対応
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const PARTS_PATH = "./assets/parts/";
  const PARTS_VERSION = "phase8-header-1";
  const selectors = { header: "#js-header", footer: "#js-footer" };

  async function loadHTML(url, targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) { console.warn(`要素が見つかりません: ${targetSelector}`); return; }
    try {
      const response = await fetch(`${url}?v=${PARTS_VERSION}`);
      if (!response.ok) throw new Error(`読み込み失敗: ${url} Status: ${response.status}`);
      target.innerHTML = await response.text();
      if (targetSelector === "#js-header") initializeHeaderScroll();
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
    document.dispatchEvent(new CustomEvent("yurayura:menu-state", { detail: { open: shouldOpen } }));
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

/* CSS owns the common axis; measure only the available editorial FV space. */
function initializeScrollGuidePosition() {
  const guide = document.querySelector(".scroll-guide");
  const fv = document.querySelector(".concept-fv");
  if (!guide) return;
  const compactMedia = window.matchMedia("(orientation: landscape) and (max-height: 720px)");
  const positionGuide = () => {
    const root = document.documentElement;
    if (compactMedia.matches) {
      const viewport = window.visualViewport;
      const availableHeight = viewport && viewport.scale === 1
        ? Math.min(window.innerHeight, viewport.height) : window.innerHeight;
      const headerHeight = document.getElementById("js-header")?.getBoundingClientRect().height || 0;
      root.style.setProperty("--compact-viewport-height", `${availableHeight}px`);
      root.style.setProperty("--compact-header-height", `${headerHeight}px`);
      guide.style.removeProperty("top");
      guide.style.removeProperty("bottom");
      guide.style.removeProperty("--content-scroll-guide-size");
      const labelHeight = guide.querySelector(".scroll-guide__text").getBoundingClientRect().height;
      const safeBottom = Number.parseFloat(getComputedStyle(guide).paddingBottom) || 0;
      const preferred = window.innerWidth <= 1023 ? 140 : 280;
      const space = availableHeight - headerHeight - labelHeight - 6 - 12 - safeBottom - 16;
      const line = Math.max(0, Math.min(preferred, Math.floor(space / 2) * 2));
      guide.style.setProperty("--compact-scroll-line", `${line}px`);
      guide.setAttribute("data-positioned", "");
      return;
    }
    root.style.removeProperty("--compact-viewport-height");
    root.style.removeProperty("--compact-header-height");
    guide.style.removeProperty("--compact-scroll-line");
    if (document.body.classList.contains("top-page")) {
      guide.setAttribute("data-positioned", "");
      return;
    }
    if (!fv) return; // Gallery retains its CSS-owned hero geometry and PC visibility.
    if (innerWidth >= 1200) {
      guide.style.setProperty("top", "auto", "important");
      guide.style.setProperty("bottom", "0px", "important");
      guide.style.removeProperty("--content-scroll-guide-size");
    } else {
      const title = fv.querySelector("h1");
      const subtitle = fv.querySelector(".fv__txt");
      const parent = guide.offsetParent;
      if (!title || !parent) return;
      const bounds = fv.getBoundingClientRect();
      const origin = parent.getBoundingClientRect().top;
      const labelHeight = guide.querySelector(".scroll-guide__text").getBoundingClientRect().height;
      const gap = 6;
      const preferred = innerWidth <= 1023 ? 140 : 280;
      // Concept's title-to-guide rhythm is shared; short editorial heroes adapt
      // to the subtitle and available space without crossing the next section.
      const preferredTop = title.getBoundingClientRect().bottom - origin + 140;
      const contentBottom = (subtitle || title).getBoundingClientRect().bottom - origin;
      const end = bounds.bottom - origin - 8;
      const top = Math.min(preferredTop, Math.max(contentBottom + 16, end - labelHeight - gap - preferred));
      const length = Math.max(0, Math.min(preferred, Math.floor((end - top - labelHeight - gap) / 2) * 2));
      guide.style.setProperty("top", `${top}px`, "important");
      guide.style.setProperty("bottom", "auto", "important");
      guide.style.setProperty("--content-scroll-guide-size", `${length}px`);
    }
    guide.setAttribute("data-positioned", "");
  };
  positionGuide();
  let positionFrame = 0;
  const schedulePosition = () => {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(positionGuide);
  };
  window.addEventListener("resize", schedulePosition, { passive: true });
  window.visualViewport?.addEventListener("resize", schedulePosition, { passive: true });
  compactMedia.addEventListener("change", schedulePosition);
  if (document.fonts?.ready) document.fonts.ready.then(positionGuide);
}


/* A fixed header preserves its existing async placeholder and FV geometry. */
function initializeHeaderScroll() {
  const header = document.querySelector('#js-header .header');
  if (!header || header.dataset.scrollReady) return;
  header.dataset.scrollReady = 'true';
  let frame = null, resizeTimer = null, lastWidth = window.innerWidth;
  const viewportHeight = () => {
    const viewport = window.visualViewport;
    return viewport && Math.abs(viewport.scale - 1) < .01
      ? Math.min(window.innerHeight, viewport.height) : window.innerHeight;
  };
  let height = viewportHeight(), hidden = null;
  const update = () => {
    const ratio = window.innerWidth >= 1200 ? .70 : .80;
    const threshold = height * ratio;
    const shouldHide = !header.classList.contains('is-open') && Math.max(0, window.scrollY) >= threshold;
    if (shouldHide === hidden) return;
    hidden = shouldHide;
    header.classList.toggle('is-scroll-hidden', shouldHide);
    if (shouldHide && header.contains(document.activeElement)) {
      const main = document.querySelector('main');
      if (main) {
        const previous = main.getAttribute('tabindex');
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
        main.addEventListener('blur', () => {
          if (previous === null) main.removeAttribute('tabindex');
          else main.setAttribute('tabindex', previous);
        }, { once: true });
      }
    }
    header.inert = shouldHide;
    if (shouldHide) header.setAttribute('aria-hidden', 'true');
    else header.removeAttribute('aria-hidden');
  };
  const schedule = () => { if (frame === null) frame = requestAnimationFrame(() => { frame = null; update(); }); };
  const commitViewport = () => { height = viewportHeight(); lastWidth = window.innerWidth; schedule(); };
  const resize = () => {
    clearTimeout(resizeTimer);
    if (window.innerWidth !== lastWidth) commitViewport();
    else resizeTimer = setTimeout(commitViewport, 180);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.visualViewport?.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });
  ['pageshow', 'popstate', 'hashchange', 'load'].forEach(name => window.addEventListener(name, commitViewport));
  document.addEventListener('yurayura:menu-state', event => event.detail.open ? update() : schedule());
  update();
}
