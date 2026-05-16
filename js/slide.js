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
  let paused = false;

  function getLoopWidth() {
    let width = 0;
    for (let i = 0; i < originalItems.length; i++) {
      width += originalItems[i].offsetWidth;
    }
    width += (originalItems.length - 1) * 15; // gapぶん
    return width;
  }

  function animate() {
    if (!paused) {
      position += speed;

      const loopWidth = getLoopWidth();

      if (position >= loopWidth) {
        position = 0;
      }

      track.style.transform = `translate3d(-${position}px, 0, 0)`;
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  /* ホバー中は止める */
  slider.addEventListener("mouseenter", function () {
    paused = true;
  });

  slider.addEventListener("mouseleave", function () {
    paused = false;
  });

  /* クリック時に img-btn を100%へ広げてから遷移 */
  track.addEventListener("click", function (e) {
    const link = e.target.closest(".works-link");
    const btn = e.target.closest(".img-btn");

    if (!link || !btn) return;

    e.preventDefault();
    paused = true;

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