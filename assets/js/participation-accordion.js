/* Accessible 360ms accordion motion for Participate only; native details remain the fallback. */
(() => {
  "use strict";
  const init = () => {
    const container = document.querySelector(".participate-page .participation-guide");
    if (!container) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    for (const details of container.querySelectorAll("details.path-details")) {
      const summary = details.querySelector(":scope > summary");
      const answer = details.querySelector(":scope > .participation-guide__answer");
      if (!summary || !answer || typeof answer.animate !== "function") continue;
      let desiredOpen = details.open;
      let currentAnimation = null;
      summary.addEventListener("click", (event) => {
        if (reducedMotion.matches) return; // Native instant open/close.
        event.preventDefault(); // Also covers Enter/Space's synthetic click.
        const opening = !desiredOpen;
        desiredOpen = opening;
        const fromHeight = details.open ? answer.getBoundingClientRect().height : 0;
        const computedOpacity = details.open ? Number.parseFloat(getComputedStyle(answer).opacity) : 0;
        const fromOpacity = Number.isFinite(computedOpacity) ? computedOpacity : (details.open ? 1 : 0);
        if (currentAnimation) currentAnimation.cancel();
        currentAnimation = null;
        if (opening) details.open = true;
        answer.style.height = `${fromHeight}px`;
        const toHeight = opening ? answer.scrollHeight : 0;
        const animation = answer.animate([
          { height: `${fromHeight}px`, opacity: fromOpacity },
          { height: `${toHeight}px`, opacity: opening ? 1 : 0 }
        ], { duration: 360, easing: "cubic-bezier(.22,.61,.36,1)", fill: "forwards" });
        currentAnimation = animation;
        animation.onfinish = () => {
          if (currentAnimation !== animation) return;
          if (!opening) details.open = false;
          animation.cancel();
          currentAnimation = null;
          answer.style.height = "";
        };
      });
      details.addEventListener("toggle", () => {
        if (!currentAnimation) desiredOpen = details.open;
      });
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
