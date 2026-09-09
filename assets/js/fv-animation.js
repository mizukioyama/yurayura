document.addEventListener("DOMContentLoaded", () => {
  const vantaEl = document.getElementById("vanta-bg");
  const smokeLayers = document.querySelectorAll(".smoke-twist");

  if (!vantaEl) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  let vantaEffect = null;
  let animationId = null;
  let lastFrame = 0;
  let initialized = false;

  const targetFps = isMobile ? 20 : 30;
  const frameInterval = 1000 / targetFps;

  const settings = [
    {
      duration: 90000,
      startTop: 76,
      endTop: 22,
      centerX: 50,
      driftX: 5,
      angleX: -8,
      delay: 0,
      rotateBase: -8,
      scaleX: 0.82,
      scaleY: 1.16,
      opacity: 0.34
    },
    {
      duration: 120000,
      startTop: 70,
      endTop: 18,
      centerX: 53,
      driftX: 7,
      angleX: 6,
      delay: 18000,
      rotateBase: 6,
      scaleX: 1.08,
      scaleY: 0.92,
      opacity: 0.18
    },
    {
      duration: 105000,
      startTop: 80,
      endTop: 24,
      centerX: 47,
      driftX: 4,
      angleX: -4,
      delay: 32000,
      rotateBase: -4,
      scaleX: 0.7,
      scaleY: 1.28,
      opacity: 0.24
    }
  ];

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const easeInOutSine = (value) =>
    -(Math.cos(Math.PI * value) - 1) / 2;

  function initVanta() {
    if (initialized || prefersReducedMotion) return;
    initialized = true;

    if (typeof VANTA === "undefined" || typeof THREE === "undefined") {
      vantaEl.classList.add("is-fallback");
      return;
    }

    try {
      vantaEffect = VANTA.FOG({
        el: "#vanta-bg",
        mouseControls: !isMobile,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: 0xffffff,
        midtoneColor: 0xf5d6bd,
        lowlightColor: 0xd9f4e7,
        baseColor: 0xfafffc,
        blurFactor: isMobile ? 0.62 : 0.72,
        speed: isMobile ? 0.14 : 0.19,
        zoom: isMobile ? 0.48 : 0.54
      });
    } catch (error) {
      console.warn("Vanta.jsの初期化をスキップしました", error);
      vantaEl.classList.add("is-fallback");
    }
  }

  function animateSmoke(now) {
    if (document.hidden) {
      animationId = requestAnimationFrame(animateSmoke);
      return;
    }

    if (now - lastFrame < frameInterval) {
      animationId = requestAnimationFrame(animateSmoke);
      return;
    }
    lastFrame = now;

    smokeLayers.forEach((layer, index) => {
      const s = settings[index % settings.length];
      const time = now + s.delay;
      const rawProgress = (time % s.duration) / s.duration;
      const progress = easeInOutSine(rawProgress);

      const verticalY = s.startTop - progress * (s.startTop - s.endTop);
      const naturalWave =
        Math.sin(time * 0.00018 + index * 1.7) * s.driftX +
        Math.sin(time * 0.00041 + index * 2.4) * (s.driftX * 0.35);
      const angledDrift = progress * s.angleX;
      const x = clamp(s.centerX + naturalWave + angledDrift, 12, 88);
      const y = clamp(
        verticalY + Math.sin(time * 0.00026 + index) * 1.8,
        16,
        84
      );
      const rotate =
        s.rotateBase + Math.sin(time * 0.00022 + index) * 12;
      const skew = Math.sin(time * 0.0012 + index * 1.3) * 3;
      const scale =
        0.88 + progress * 0.28 + Math.sin(time * 0.00035 + index) * 0.035;
      const opacity = clamp(
        s.opacity * (1 - progress * 0.55) +
          Math.sin(time * 0.00032 + index) * 0.03,
        0.05,
        s.opacity
      );

      const offsetX = x - 50;
      const offsetY = y - 70;

      layer.style.opacity = opacity.toFixed(3);
      layer.style.transform = `translate3d(calc(-50% + ${offsetX.toFixed(2)}vw), calc(-50% + ${offsetY.toFixed(2)}vh), 0) rotate(${rotate.toFixed(2)}deg) skewY(${skew.toFixed(2)}deg) scale(${scale.toFixed(3)}) scaleX(${s.scaleX}) scaleY(${s.scaleY})`;
    });

    animationId = requestAnimationFrame(animateSmoke);
  }

  function startBackground() {
    initVanta();
    if (!prefersReducedMotion && smokeLayers.length > 0 && !animationId) {
      animationId = requestAnimationFrame(animateSmoke);
    }
  }

  if (prefersReducedMotion) {
    vantaEl.classList.add("is-fallback");
  } else if ("requestIdleCallback" in window) {
    window.requestIdleCallback(startBackground, { timeout: 900 });
  } else {
    window.setTimeout(startBackground, 500);
  }

  let resizeTimer = null;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (typeof vantaEffect?.resize === "function") {
          vantaEffect.resize();
        }
      }, 180);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (!document.hidden && !prefersReducedMotion && !animationId) {
      animationId = requestAnimationFrame(animateSmoke);
    }
  });

  window.addEventListener("pagehide", () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (typeof vantaEffect?.destroy === "function") vantaEffect.destroy();
  });
});
