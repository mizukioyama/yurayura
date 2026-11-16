// ==============================
// TOP FV: fine water ripples layered over the fog background.
// Draws slow concentric ripples and thin drifting wave lines on a
// lightweight 2D canvas inside .vanta-wrap (above the fog / smoke /
// paper layers, below all page content). Mirrors the performance
// conventions of fv-animation.js: FPS cap, pause when the tab is
// hidden or the FV leaves the viewport, and no motion when the user
// prefers reduced motion (a few very faint static rings only).
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("ripple-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // ---- Tunable parameters ----
  const TARGET_FPS = isMobile ? 20 : 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  const MAX_DPR = isMobile ? 1.5 : 2;
  // Muted green-grey that sits quietly with the site palette
  // (text #303a05, fog mint / peach, paper #f3f3ed).
  const STROKE_RGB = "86, 110, 106";
  const RIPPLE_PEAK_ALPHA = 0.16;
  const RIPPLE_DURATION = { min: 6000, max: 9000 };
  const RIPPLE_MAX_RADIUS = { min: 90, max: 180 };
  const RIPPLE_SPAWN_INTERVAL = { min: 2600, max: 5200 };
  const MAX_RIPPLES = isMobile ? 3 : 4;
  const WAVE_LINES = [
    { yRatio: 0.58, amplitude: 5, wavelength: 0.0035, speed: 0.00011, alpha: 0.08 },
    { yRatio: 0.67, amplitude: 7, wavelength: 0.0026, speed: 0.00008, alpha: 0.06 },
    { yRatio: 0.76, amplitude: 4, wavelength: 0.0045, speed: 0.00014, alpha: 0.09 }
  ];

  let width = 0;
  let height = 0;
  let animationId = null;
  let lastFrame = 0;
  let running = false;
  let fvVisible = true;
  let ripples = [];
  let nextSpawnAt = 0;

  const rand = (min, max) => min + Math.random() * (max - min);
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnRipple(now) {
    // Keep ripples inside the FV area with a small margin.
    const margin = 40;
    ripples.push({
      x: rand(margin, Math.max(margin + 1, width - margin)),
      y: rand(height * 0.18, height * 0.86),
      start: now,
      duration: rand(RIPPLE_DURATION.min, RIPPLE_DURATION.max),
      maxRadius: rand(RIPPLE_MAX_RADIUS.min, RIPPLE_MAX_RADIUS.max) *
        (isMobile ? 0.75 : 1)
    });
  }

  function drawRipple(ripple, now) {
    const progress = (now - ripple.start) / ripple.duration;
    if (progress >= 1) return false;

    const eased = easeOutCubic(progress);
    // Fade in gently, then dissolve. Peak stays well below the fog text contrast.
    const fadeIn = Math.min(progress / 0.12, 1);
    const envelope = fadeIn * Math.pow(1 - progress, 1.4);

    // Three fine concentric rings trailing the leading edge.
    const rings = [
      { scale: 1, weight: 1 },
      { scale: 0.72, weight: 0.7 },
      { scale: 0.45, weight: 0.45 }
    ];
    ctx.lineWidth = 1;
    for (const ring of rings) {
      const radius = ripple.maxRadius * eased * ring.scale;
      if (radius < 1) continue;
      const alpha = RIPPLE_PEAK_ALPHA * envelope * ring.weight;
      if (alpha <= 0.004) continue;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${STROKE_RGB}, ${alpha.toFixed(3)})`;
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    return true;
  }

  function drawWaves(now) {
    ctx.lineWidth = 1;
    for (const wave of WAVE_LINES) {
      const baseY = height * wave.yRatio +
        Math.sin(now * 0.00007 + wave.yRatio * 10) * 6;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${STROKE_RGB}, ${wave.alpha})`;
      for (let x = 0; x <= width; x += 6) {
        const y = baseY +
          Math.sin(x * wave.wavelength + now * wave.speed * 10) * wave.amplitude +
          Math.sin(x * wave.wavelength * 0.37 + now * wave.speed * 6) *
            wave.amplitude * 0.6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function frame(now) {
    if (!running) return;
    animationId = requestAnimationFrame(frame);
    if (document.hidden || !fvVisible) return;
    if (now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;

    ctx.clearRect(0, 0, width, height);
    drawWaves(now);

    if (now >= nextSpawnAt && ripples.length < MAX_RIPPLES) {
      spawnRipple(now);
      nextSpawnAt = now + rand(
        RIPPLE_SPAWN_INTERVAL.min,
        RIPPLE_SPAWN_INTERVAL.max
      );
    }
    ripples = ripples.filter((ripple) => drawRipple(ripple, now));
  }

  function start() {
    if (running) return;
    running = true;
    lastFrame = 0;
    nextSpawnAt = performance.now() + 600;
    animationId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Reduced motion: no loop. Draw a few very faint static rings once
  // (and again on resize) so the layer never moves.
  function drawStatic() {
    resizeCanvas();
    ctx.clearRect(0, 0, width, height);
    const seeds = [
      { x: 0.3, y: 0.42, r: 120 },
      { x: 0.68, y: 0.6, r: 88 },
      { x: 0.52, y: 0.3, r: 60 }
    ];
    ctx.lineWidth = 1;
    for (const seed of seeds) {
      for (const scale of [1, 0.7, 0.44]) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${STROKE_RGB}, ${(0.07 * scale).toFixed(3)})`;
        ctx.arc(width * seed.x, height * seed.y, seed.r * scale, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  let resizeTimer = null;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (prefersReducedMotion) {
          drawStatic();
        } else {
          resizeCanvas();
          ripples = [];
        }
      }, 180);
    },
    { passive: true }
  );

  if (prefersReducedMotion) {
    drawStatic();
    return;
  }

  resizeCanvas();

  // Pause while the first view is scrolled out of sight.
  const fvSection = document.querySelector(".fv");
  if ("IntersectionObserver" in window && fvSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        fvVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(fvSection);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener("pagehide", stop);

  // Start after the first paint settles, like fv-animation.js, so the
  // ripples never compete with the initial render.
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 900 });
  } else {
    window.setTimeout(start, 500);
  }
});
