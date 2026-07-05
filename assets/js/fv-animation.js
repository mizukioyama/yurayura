document.addEventListener("DOMContentLoaded", () => {
  const vantaEl = document.getElementById("vanta-bg");
  const smokeLayers = document.querySelectorAll(".smoke-twist");

  if (!vantaEl) {
    console.error("#vanta-bg が見つかりません");
    return;
  }

  if (typeof VANTA === "undefined" || typeof THREE === "undefined") {
    console.error("VANTA.js または THREE.js が読み込まれていません");
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let vantaEffect = null;
  let animationId = null;

  try {
    vantaEffect = VANTA.FOG({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,

      minHeight: 200,
      minWidth: 200,

      highlightColor: 0xffffff,
      midtoneColor: 0xf5d6bd,
      lowlightColor: 0xd9f4e7,
      baseColor: 0xfafffc,

      blurFactor: 0.75,
      speed: 0.22,
      zoom: 0.56
    });
  } catch (error) {
    console.error("Vanta.jsの初期化に失敗しました", error);
    return;
  }

  if (prefersReducedMotion || smokeLayers.length === 0) return;

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
      opacity: 0.36
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
      opacity: 0.2
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
      opacity: 0.26
    }
  ];

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  const easeInOutSine = (value) => {
    return -(Math.cos(Math.PI * value) - 1) / 2;
  };

  function animateSmoke(now) {
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

      const x = clamp(
        s.centerX + naturalWave + angledDrift,
        12,
        88
      );

      const y = clamp(
        verticalY + Math.sin(time * 0.00026 + index) * 1.8,
        16,
        84
      );

      const rotate =
        s.rotateBase +
        Math.sin(time * 0.00022 + index) * 12;

      const skew =
        Math.sin(time * 0.0012 + index * 1.3) * 3;

      const scale =
        0.88 + progress * 0.28 + Math.sin(time * 0.00035 + index) * 0.035;

      const opacity =
        clamp(
          s.opacity * (1 - progress * 0.55) +
            Math.sin(time * 0.00032 + index) * 0.03,
          0.06,
          s.opacity
        );

      layer.style.left = `${x}%`;
      layer.style.top = `${y}%`;
      layer.style.opacity = opacity.toFixed(3);

      layer.style.transform = `
        translate(-50%, -50%)
        rotate(${rotate.toFixed(2)}deg)
        skewY(${skew.toFixed(2)}deg)
        scale(${scale.toFixed(3)})
        scaleX(${s.scaleX})
        scaleY(${s.scaleY})
      `;
    });

    if (vantaEffect?.options) {
      vantaEffect.options.speed =
        0.2 + Math.sin(now * 0.0002) * 0.025;

      vantaEffect.options.zoom =
        0.56 + Math.sin(now * 0.00025) * 0.02;
    }

    animationId = requestAnimationFrame(animateSmoke);
  }

  animationId = requestAnimationFrame(animateSmoke);

  window.addEventListener("resize", () => {
    if (typeof vantaEffect?.resize === "function") {
      vantaEffect.resize();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (typeof vantaEffect?.destroy === "function") {
      vantaEffect.destroy();
    }
  });
});
