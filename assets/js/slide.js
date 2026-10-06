const introCompletionCallbacks = [];
let introEventCompleted = false;

document.addEventListener(
  "yurayura:intro-complete",
  () => {
    introEventCompleted = true;
    introCompletionCallbacks.splice(0).forEach((callback) => callback());
  },
  { once: true }
);

function onIntroComplete(callback) {
  const introState = document.documentElement;
  if (
    introEventCompleted ||
    !introState.classList.contains("is-intro-loading") ||
    introState.classList.contains("is-intro-complete")
  ) {
    callback();
    return;
  }

  introCompletionCallbacks.push(callback);
}

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("memberTrack");
  const slider = document.getElementById("memberSlider");

  if (!track || !slider) return;

  const introState = document.documentElement;
  const originalItems = Array.from(track.children);
  let initialized = false;

  let position = 0;
  let speed = 0.6; // 数字を上げると速くなる
  let animationId = null;
  let hoverPaused = false;
  let navigationPending = false;
  let loopWidth = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverCapability = window.matchMedia("(hover: hover) and (pointer: fine)");
  let introComplete =
    !introState.classList.contains("is-intro-loading") ||
    introState.classList.contains("is-intro-complete");
  let sliderVisible = false;

  function isDesktopHoverEnabled() {
    return window.innerWidth > 767 && hoverCapability.matches;
  }

  function getStopReason() {
    if (!introComplete) return "INTRO";
    if (!initialized) return "INITIALIZING";
    if (reducedMotion.matches) return "REDUCED_MOTION";
    if (document.hidden) return "DOCUMENT_HIDDEN";
    if (!sliderVisible) return "OFFSCREEN";
    if (!Number.isFinite(loopWidth) || loopWidth <= 0) return "LOOP_WIDTH_INVALID";
    if (navigationPending) return "NAVIGATION_PENDING";
    if (isDesktopHoverEnabled() && hoverPaused) return "DESKTOP_HOVER";
    return null;
  }

  function getLoopWidth() {
    let width = 0;
    for (let i = 0; i < originalItems.length; i++) {
      width += originalItems[i].offsetWidth;
    }

    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    width += (originalItems.length - 1) * gap;

    return width;
  }

  function recalculateLoopWidth() {
    loopWidth = getLoopWidth();
    if (!isDesktopHoverEnabled()) hoverPaused = false;

    if (Number.isFinite(loopWidth) && loopWidth > 0) {
      position %= loopWidth;
      maybeStartAnimation();
    } else {
      stopAnimation();
    }
  }

  function stopAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function maybeStartAnimation() {
    if (getStopReason() !== null || animationId !== null) return;

    animationId = requestAnimationFrame(animate);
  }

  function animate() {
    if (loopWidth > 0) {
      position += speed;

      if (position >= loopWidth) {
        position = 0;
      }

      track.style.transform = "translate3d(-" + position + "px, 0, 0)";
    }

    animationId = null;
    maybeStartAnimation();
  }

  function syncReducedMotion() {
    if (reducedMotion.matches) {
      stopAnimation();
      return;
    }

    maybeStartAnimation();
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      stopAnimation();
      return;
    }

    maybeStartAnimation();
  }

  function initializeSlider() {
    if (initialized) return;
    initialized = true;

    /* 無限ループ用に複製 */
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.classList.remove("top-reveal-pending", "top-reveal-visible");
      clone.style.removeProperty("--top-reveal-delay");
      track.appendChild(clone);
    });

    recalculateLoopWidth();
    window.addEventListener("resize", recalculateLoopWidth, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recalculateLoopWidth);
    }

    if (typeof window.IntersectionObserver === "function") {
      try {
        const sliderVisibilityObserver = new window.IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.target !== slider) return;

              sliderVisible = entry.isIntersecting;
              if (sliderVisible) {
                maybeStartAnimation();
              } else {
                stopAnimation();
              }
            });
          },
          {
            rootMargin: "0px",
            threshold: 0.01
          }
        );

        sliderVisibilityObserver.observe(slider);
      } catch {
        sliderVisible = false;
      }
    }

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", syncReducedMotion);
    } else if (typeof reducedMotion.addListener === "function") {
      reducedMotion.addListener(syncReducedMotion);
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    maybeStartAnimation();

    /* Hover pause applies only above the official mobile breakpoint. */
    if (hoverCapability.matches) {
      slider.addEventListener("mouseenter", function () {
        if (!isDesktopHoverEnabled()) return;
        hoverPaused = true;
        stopAnimation();
      });

      slider.addEventListener("mouseleave", function () {
        if (!isDesktopHoverEnabled()) {
          hoverPaused = false;
          maybeStartAnimation();
          return;
        }

        hoverPaused = false;
        maybeStartAnimation();
      });
    }

    /* クリック時に img-btn を100%へ広げてから遷移 */
    track.addEventListener("click", function (e) {
      const link = e.target.closest(".works-link");
      const btn = e.target.closest(".img-btn");

      if (!link || !btn) return;

      e.preventDefault();
      navigationPending = true;
      stopAnimation();

      btn.classList.add("is-expand");

      setTimeout(function () {
        window.location.href = link.href;
      }, 450);
    });
  }

  if (!introComplete) {
    onIntroComplete(() => {
      introComplete = true;
      initializeSlider();
    });
  } else {
    initializeSlider();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || typeof window.IntersectionObserver !== "function") return;

  const introState = document.documentElement;
  const legacyTargetSelector = [
    ".recruit-page .recruit-header .sub-title",
    ".recruit-page .recruit-header h1",
    ".recruit-page .intro > p",
    ".recruit-page .intro > details",
    ".recruit-page .section h2",
    ".recruit-page .section h3",
    ".recruit-page .section h4",
    ".recruit-page .section p",
    ".recruit-page .section ul",
    ".recruit-page .section ol",
    ".recruit-page .section img",
    ".recruit-page .section .plan-card",
    ".recruit-page .section .img-drive",
    ".recruit-page > .apply-box"
  ].join(",");
  const legacyTargets = Array.from(document.querySelectorAll(legacyTargetSelector)).filter((target) => {
    let parent = target.parentElement;
    while (parent && parent !== document.body) {
      if (parent.matches(legacyTargetSelector)) return false;
      parent = parent.parentElement;
    }
    return true;
  });
  const targetSelector = [
    ".top-page .fv__inner",
    ".top-page #concept .h2_ttl",
    ".top-page #concept .section__txt",
    ".top-page #concept .concept-link-wrap",
    ".top-page #artists .section__inner > .h2_ttl",
    ".top-page #artists .section__inner > .section__txt",
    ".top-page #artists .member-track .card",
    ".top-page #artists .section__btn",
    ".top-page #faq .faq-ttl",
    ".top-page #faq .faq-list-item",
    ".top-page #contact .section__inner > .h2_ttl",
    ".top-page #contact .section__inner > .section__txt",
    ".top-page #contact .contact-form",
    ".top-page #access .section__inner > .h2_ttl",
    ".top-page #access .access-info",
    ".top-page #access iframe",
    ".concept-page .concept-fv #concept-title",
    ".concept-page .concept-fv .fv__txt",
    ".concept-page #concept .concept-eyebrow",
    ".concept-page #concept .h2_ttl",
    ".concept-page #concept .section__txt",
    ".concept-page .concept-texture__copy .concept-eyebrow",
    ".concept-page .concept-texture__copy .h2_ttl",
    ".concept-page .concept-texture__copy .section__txt",
    ".concept-page .concept-texture__images .concept-photo",
    ".concept-page .concept-gallery-link .concept-eyebrow",
    ".concept-page .concept-gallery-link .h2_ttl",
    ".concept-page .concept-gallery-link .section__txt",
    ".concept-page .concept-gallery-link liquid-button",
    ".gallery-page .h1-text",
    ".gallery-page .gallery-intro > p",
    ".gallery-page .gallery-sidebar__label",
    ".gallery-page .gallery-filter-group",
    ".gallery-page .gallery-card",
    ".policy-page .policy-title",
    ".policy-page .policy-section"
  ].join(",");
  const targets = Array.from(
    new Set([
      ...document.querySelectorAll(targetSelector),
      ...legacyTargets
    ])
  );

  const artistCards = Array.from(
    document.querySelectorAll(".top-page #artists .member-track .card")
  );
  artistCards.forEach((card, index) => {
    card.style.setProperty("--top-reveal-delay", String((index % 4) * 70) + "ms");
  });

  const conceptImages = Array.from(
    document.querySelectorAll(".concept-page .concept-texture__images .concept-photo")
  );
  conceptImages.forEach((image) => {
    image.style.setProperty("--top-reveal-delay", "100ms");
  });

  const galleryCategoryLabel = document.querySelector(".gallery-page .gallery-sidebar__label");
  if (galleryCategoryLabel) {
    galleryCategoryLabel.style.setProperty("--top-reveal-delay", "70ms");
  }

  const galleryFilterGroups = Array.from(
    document.querySelectorAll(".gallery-page .gallery-filter-group")
  );
  galleryFilterGroups.forEach((group) => {
    group.style.setProperty("--top-reveal-delay", "70ms");
  });

  const galleryCards = Array.from(document.querySelectorAll(".gallery-page .gallery-card"));
  galleryCards.forEach((card, index) => {
    card.style.setProperty("--top-reveal-delay", String(140 + (index % 4) * 60) + "ms");
  });

  const registeredTargets = [];
  let observer;
  let catchUpTimer = null;
  let revealSystemStarted = false;
  let revealSystemDisabled = false;
  let scrollListenerActive = false;
  let remaining = 0;

  function setScrollListener(active) {
    if (active && !scrollListenerActive) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      scrollListenerActive = true;
    } else if (!active && scrollListenerActive) {
      window.removeEventListener("scroll", handleScroll);
      scrollListenerActive = false;
    }
  }

  function disableRevealSystem() {
    revealSystemDisabled = true;
    if (observer) observer.disconnect();
    setScrollListener(false);
    if (catchUpTimer !== null) {
      window.clearTimeout(catchUpTimer);
      catchUpTimer = null;
    }
    registeredTargets.forEach((target) => {
      target.classList.remove("top-reveal-pending", "top-reveal-visible");
      target.style.removeProperty("--top-reveal-delay");
    });
    remaining = 0;
  }

  function reveal(target) {
    if (target.classList.contains("top-reveal-visible")) return;
    if (introState.classList.contains("is-intro-loading")) return;

    target.classList.add("top-reveal-visible");
    observer.unobserve(target);
    remaining = Math.max(0, remaining - 1);
    setScrollListener(remaining > 0);

    if (remaining === 0 && catchUpTimer !== null) {
      window.clearTimeout(catchUpTimer);
      catchUpTimer = null;
    }
  }

  function isInViewport(target) {
    const rect = target.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth
    );
  }

  function handleScroll() {
    if (introState.classList.contains("is-intro-loading")) return;
    if (catchUpTimer !== null) window.clearTimeout(catchUpTimer);

    catchUpTimer = window.setTimeout(() => {
      catchUpTimer = null;
      registeredTargets.forEach((target) => {
        if (target.classList.contains("top-reveal-visible")) return;
        if (isInViewport(target)) reveal(target);
      });
    }, 120);
  }

  function handleIntroComplete() {
    registeredTargets.forEach((target) => {
      if (target.classList.contains("top-reveal-visible")) return;
      if (isInViewport(target)) {
        window.requestAnimationFrame(() => reveal(target));
      }
    });
  }

  function registerTargets(nextTargets) {
    if (revealSystemDisabled) return;

    const addedTargets = nextTargets.filter(
      (target) =>
        !target.classList.contains("top-reveal-pending") &&
        !target.classList.contains("top-reveal-visible")
    );
    if (addedTargets.length === 0) return;

    addedTargets.forEach((target) => {
      target.classList.add("top-reveal-pending");
      registeredTargets.push(target);
    });
    remaining += addedTargets.length;

    if (!revealSystemStarted) return;

    try {
      addedTargets.forEach((target) => observer.observe(target));
      setScrollListener(true);
      handleIntroComplete();
      handleScroll();
    } catch {
      disableRevealSystem();
    }
  }

  function activateRevealSystem() {
    if (revealSystemStarted || revealSystemDisabled) return;

    try {
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target);
          });
        },
        {
          rootMargin: "0px",
          threshold: 0.01
        }
      );

      registerTargets(targets);
      registeredTargets.forEach((target) => observer.observe(target));
      revealSystemStarted = true;
      setScrollListener(remaining > 0);
      handleIntroComplete();
      handleScroll();
    } catch {
      disableRevealSystem();
    }
  }

  function registerFooterRevealTarget() {
    const footerContent = document.querySelector("#js-footer .footer-inner");
    if (footerContent) registerTargets([footerContent]);
  }

  registerFooterRevealTarget();
  document.addEventListener("yurayura:fragments-ready", registerFooterRevealTarget, {
    once: true
  });

  onIntroComplete(activateRevealSystem);
});
