document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("memberTrack");
  const slider = document.getElementById("memberSlider");

  if (!track || !slider) return;

  const originalItems = Array.from(track.children);

  /* 無限ループ用に複製 */
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  let speed = 0.6; // 数字を上げると速くなる
  let animationId = null;
  let hoverPaused = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  function animate() {
    if (!hoverPaused && !reducedMotion.matches) {
      position += speed;

      const loopWidth = getLoopWidth();

      if (position >= loopWidth) {
        position = 0;
      }

      track.style.transform = "translate3d(-" + position + "px, 0, 0)";
    }

    if (reducedMotion.matches) {
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(animate);
  }

  function syncReducedMotion() {
    if (reducedMotion.matches) {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      animationId = null;
      return;
    }

    if (animationId === null) {
      animationId = requestAnimationFrame(animate);
    }
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", syncReducedMotion);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(syncReducedMotion);
  }

  if (!reducedMotion.matches) {
    animationId = requestAnimationFrame(animate);
  }

  /* ホバー中は止める */
  slider.addEventListener("mouseenter", function () {
    hoverPaused = true;
  });

  slider.addEventListener("mouseleave", function () {
    hoverPaused = false;
  });

  /* クリック時に img-btn を100%へ広げてから遷移 */
  track.addEventListener("click", function (e) {
    const link = e.target.closest(".works-link");
    const btn = e.target.closest(".img-btn");

    if (!link || !btn) return;

    e.preventDefault();
    hoverPaused = true;

    btn.classList.add("is-expand");

    setTimeout(function () {
      window.location.href = link.href;
    }, 450);
  });

  /* 画面リサイズ対策 */
  window.addEventListener("resize", function () {
    track.style.transform = `translate3d(-${position}px, 0, 0)`;
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || typeof window.IntersectionObserver !== "function") return;

  const targets = Array.from(
    document.querySelectorAll(
      [
        ".top-page .fv__inner",
        ".top-page #concept .section__inner",
        ".top-page #artists .section__inner > .h2_ttl",
        ".top-page #artists .section__inner > .section__txt",
        ".top-page #artists .member-track .card",
        ".top-page #artists .section__btn",
        ".top-page #faq .section__inner",
        ".top-page #contact .section__inner",
        ".concept-page #concept-title",
        ".concept-page #concept .section__inner",
        ".concept-page .concept-texture__copy",
        ".concept-page .concept-texture__images",
        ".concept-page .concept-gallery-link .section__inner",
        ".gallery-page .h1-text",
        ".gallery-page .gallery-sidebar__label",
        ".gallery-page .gallery-filter-group",
        ".gallery-page .gallery-card"
      ].join(",")
    )
  );
  if (targets.length === 0) return;

  const artistCards = Array.from(
    document.querySelectorAll(".top-page #artists .member-track .card")
  );
  artistCards.forEach((card, index) => {
    card.style.setProperty("--top-reveal-delay", String((index % 4) * 70) + "ms");
  });

  const conceptImages = document.querySelector(
    ".concept-page .concept-texture__images"
  );
  if (conceptImages) {
    conceptImages.style.setProperty("--top-reveal-delay", "100ms");
  }

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

  let observer;
  let catchUpTimer = null;
  let remaining = targets.length;

  function reveal(target) {
    if (target.classList.contains("top-reveal-visible")) return;

    target.classList.add("top-reveal-visible");
    observer.unobserve(target);
    remaining -= 1;

    if (remaining === 0) {
      window.removeEventListener("scroll", handleScroll);
      if (catchUpTimer !== null) {
        window.clearTimeout(catchUpTimer);
        catchUpTimer = null;
      }
    }
  }

  function handleScroll() {
    if (catchUpTimer !== null) window.clearTimeout(catchUpTimer);

    catchUpTimer = window.setTimeout(() => {
      catchUpTimer = null;
      const revealBoundary = window.innerHeight + 120;

      targets.forEach((target) => {
        if (target.classList.contains("top-reveal-visible")) return;

        const rect = target.getBoundingClientRect();
        const verticallyReached = rect.top < revealBoundary || rect.bottom < 0;
        const horizontallyVisible = rect.right > 0 && rect.left < window.innerWidth;
        if (verticallyReached && (horizontallyVisible || rect.bottom < 0)) reveal(target);
      });
    }, 120);
  }

  try {
    observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      {
        rootMargin: "0px 0px 120px 0px",
        threshold: 0
      }
    );

    targets.forEach((target) => target.classList.add("top-reveal-pending"));
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", handleScroll, { passive: true });
  } catch {
    if (observer) observer.disconnect();
    targets.forEach((target) => {
      target.classList.remove("top-reveal-pending", "top-reveal-visible");
      target.style.removeProperty("--top-reveal-delay");
    });
  }
});
