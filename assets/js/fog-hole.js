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
    targetRadiusScale: 0.22,
    frameInterval: 1000 / 30
  };

  var startTime = performance.now();
  var lastPaint = 0;
  var rafId = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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

  function finish() {
    if (rafId) cancelAnimationFrame(rafId);
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

    if (now - lastPaint < SETTINGS.frameInterval) {
      rafId = requestAnimationFrame(render);
      return;
    }
    lastPaint = now;

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
      holeProgress = easeOutCubic(holeProgress);
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

    var maxRadius = getMaxRadius() * SETTINGS.targetRadiusScale;
    var blurRadius = maxRadius * holeProgress;
    var opacity = 1 - fadeProgress;

    blurLayer.style.setProperty("--hole-size", blurRadius.toFixed(1) + "px");
    blurLayer.style.setProperty("--edge-size", SETTINGS.blurEdgeSize + "px");
    blurLayer.style.opacity = opacity.toFixed(3);
    wrapper.style.opacity = opacity.toFixed(3);

    if (elapsed >= fadeEnd) {
      finish();
      return;
    }

    rafId = requestAnimationFrame(render);
  }

  function onVisibilityChange() {
    if (!document.hidden && !rafId) {
      startTime = performance.now();
      rafId = requestAnimationFrame(render);
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange, {
    passive: true
  });

  rafId = requestAnimationFrame(render);
})();
