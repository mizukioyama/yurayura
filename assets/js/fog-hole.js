(function () {
  "use strict";

  var scene = document.getElementById("fog-scene");
  var blurLayer = document.getElementById("fog-blur-layer");
  var wrapper = document.getElementById("fog-hole");

  if (!scene || !blurLayer || !wrapper) return;

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var SETTINGS = {
    holdDuration: prefersReducedMotion ? 80 : 550,
    holeDuration: prefersReducedMotion ? 420 : 2600,
    holdAfterHole: prefersReducedMotion ? 0 : 300,
    fadeDuration: prefersReducedMotion ? 300 : 1400,
    removeDelay: 120,
    blurEdgeSize: 72,
    targetRadiusScale: 0.22
  };

  var startTime = performance.now();
  var rafId = 0;
  var maxRadius = getMaxRadius() * SETTINGS.targetRadiusScale;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function getMaxRadius() {
    return Math.sqrt(
      Math.pow(window.innerWidth, 2) +
      Math.pow(window.innerHeight, 2)
    );
  }

  function updateRadius() {
    maxRadius = getMaxRadius() * SETTINGS.targetRadiusScale;
  }

  function finish() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    blurLayer.classList.add("is-hidden");
    wrapper.classList.add("is-hidden");

    window.setTimeout(function () {
      if (scene && scene.parentNode) scene.remove();
    }, SETTINGS.removeDelay);
  }

  function render(now) {
    if (document.hidden) {
      rafId = requestAnimationFrame(render);
      return;
    }

    var elapsed = now - startTime;
    var holeStart = SETTINGS.holdDuration;
    var holeEnd = holeStart + SETTINGS.holeDuration;
    var fadeStart = holeEnd + SETTINGS.holdAfterHole;
    var fadeEnd = fadeStart + SETTINGS.fadeDuration;

    var holeProgress = 0;
    if (elapsed > holeStart) {
      holeProgress = clamp(
        (elapsed - holeStart) / SETTINGS.holeDuration,
        0,
        1
      );
      holeProgress = easeInOutCubic(holeProgress);
    }

    var fadeProgress = 0;
    if (elapsed > fadeStart) {
      fadeProgress = clamp(
        (elapsed - fadeStart) / SETTINGS.fadeDuration,
        0,
        1
      );
      fadeProgress = easeInOutSine(fadeProgress);
    }

    var blurRadius = maxRadius * holeProgress;
    var opacity = 1 - fadeProgress;

    blurLayer.style.setProperty("--hole-size", blurRadius.toFixed(2) + "px");
    blurLayer.style.setProperty("--edge-size", SETTINGS.blurEdgeSize + "px");
    blurLayer.style.opacity = opacity.toFixed(4);
    wrapper.style.opacity = opacity.toFixed(4);

    if (elapsed >= fadeEnd) {
      finish();
      return;
    }

    rafId = requestAnimationFrame(render);
  }

  window.addEventListener("resize", updateRadius, { passive: true });
  rafId = requestAnimationFrame(render);
})();
