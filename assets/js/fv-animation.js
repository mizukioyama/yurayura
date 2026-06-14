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

  let vantaEffect = null;

  try {
    vantaEffect = VANTA.FOG({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,

      minHeight: 200.0,
      minWidth: 200.0,

      highlightColor: 0xffffff,
      midtoneColor: 0xf5d6bd,
      lowlightColor: 0xd9f4e7,
      baseColor: 0xfafffc,

      blurFactor: 0.75,
      speed: 0.82,
      zoom: 0.58
    });
  } catch (e) {
    console.error("Vanta.jsの初期化に失敗しました", e);
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  /*
    重要：
    rotateDirection = -1 → 反時計回り
    rotateDirection =  1 → 時計回り
  */
  const rotateDirection = -1;

  const settings = [
    {
      moveDuration: 90000,
      rotateDuration: 42000,
      moveRange: 42,
      xRange: 5,
      startTop: 74,
      delay: 0,
      rotateOffset: 0,
      scaleX: 0.82,
      scaleY: 1.16
    },
    {
      moveDuration: 120000,
      rotateDuration: 68000,
      moveRange: 34,
      xRange: 8,
      startTop: 66,
      delay: 18000,
      rotateOffset: 80,
      scaleX: 1.08,
      scaleY: 0.92
    },
    {
      moveDuration: 105000,
      rotateDuration: 52000,
      moveRange: 48,
      xRange: 3,
      startTop: 78,
      delay: 32000,
      rotateOffset: -60,
      scaleX: 0.68,
      scaleY: 1.28
    }
  ];

  function animateSmoke(now) {
    smokeLayers.forEach((layer, index) => {
      const s = settings[index];

      const t = now + s.delay;

      const moveProgress = (t % s.moveDuration) / s.moveDuration;
      const rotateProgress = (t % s.rotateDuration) / s.rotateDuration;

      /*
        下から上へ移動
        startTopから上へ抜ける
      */
      const y = s.startTop - moveProgress * s.moveRange;

      /*
        煙らしい左右の揺れ
      */
      const x = Math.sin(t * 0.00025 + index) * s.xRange;

      /*
        回転方向を明確に制御
        -360 = 反時計回り
        +360 = 時計回り
      */
      const rotate =
        s.rotateOffset + rotateProgress * 360 * rotateDirection;

      /*
        竜巻・煙のようなねじれ感
      */
      const skew = Math.sin(t * 0.0035 + index) * 10;
      const pulse = 1 + Math.sin(t * 0.00045 + index) * 0.04;

      layer.style.left = `calc(50% + ${x}vw)`;
      layer.style.top = `${y}%`;

      layer.style.transform = `
        translate(-50%, -50%)
        rotate(${rotate}deg)
        skewY(${skew}deg)
        scale(${pulse})
        scaleX(${s.scaleX})
        scaleY(${s.scaleY})
      `;

      layer.style.opacity =
        index === 0
          ? 0.38 + Math.sin(t * 0.0004) * 0.05
          : index === 1
            ? 0.18 + Math.sin(t * 0.00035) * 0.04
            : 0.24 + Math.sin(t * 0.00032) * 0.04;
    });

    if (vantaEffect && vantaEffect.options) {
      vantaEffect.options.speed =
        0.2 + Math.sin(now * 0.0002) * 0.025;

      vantaEffect.options.zoom =
        0.56 + Math.sin(now * 0.00025) * 0.02;
    }

    requestAnimationFrame(animateSmoke);
  }

  requestAnimationFrame(animateSmoke);

  window.addEventListener("resize", () => {
    if (vantaEffect && typeof vantaEffect.resize === "function") {
      vantaEffect.resize();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (vantaEffect && typeof vantaEffect.destroy === "function") {
      vantaEffect.destroy();
    }
  });
});