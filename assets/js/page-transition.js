/* ==============================
   Page transition (shared by all canonical pages)
   Clicking an in-site link spreads fine ripple rings from the click
   point while a paper-coloured veil builds over the page; navigation
   then happens and the destination page — pre-covered by the inline
   bootstrap in its <head> — lets the veil recede with the rings
   drifting outward. Any failure falls back to a normal navigation:
   the visitor is never trapped on a covered page.
   External links, new-tab links, downloads, in-page anchors and form
   submissions keep their default behaviour. With
   prefers-reduced-motion the transition is disabled entirely.
================================ */
(() => {
  "use strict";

  const STORAGE_KEY = "yurayura:page-transition";
  const BASE_RGB = "245, 242, 232"; // site paper colour (#f5f2e8)
  const STROKE_RGB = "86, 110, 106"; // muted green-grey rings
  const EXIT_MS = 720; // click -> covered
  const ENTER_MS = 760; // covered -> revealed
  const NAV_FALLBACK_MS = 950; // hard cap: navigate anyway
  const RING_COUNT = 3;
  const RING_STAGGER = 0.12; // fraction of progress between rings

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let navigating = false;

  const easeInOut = t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const maxRadius = (cx, cy, w, h) =>
    Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));

  function makeOverlay() {
    const canvas = document.createElement("canvas");
    canvas.id = "pt-overlay";
    canvas.setAttribute("aria-hidden", "true");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return null;
    }
    ctx.scale(dpr, dpr);
    return { canvas, ctx, w: window.innerWidth, h: window.innerHeight };
  }

  function drawRings(ctx, cx, cy, maxR, progress, peakAlpha) {
    for (let i = 0; i < RING_COUNT; i++) {
      const local = Math.min(
        Math.max((progress - i * RING_STAGGER) / (1 - i * RING_STAGGER), 0),
        1
      );
      if (local <= 0) continue;
      const radius = easeOut(local) * maxR;
      const alpha = peakAlpha * (1 - local);
      if (radius <= 0 || alpha <= 0) continue;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${STROKE_RGB}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  /* ---------------- Exit: cover, then navigate ---------------- */

  function startExit(url, clientX, clientY) {
    if (navigating) return;
    navigating = true;

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      try {
        window.sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            x: clientX / window.innerWidth,
            y: clientY / window.innerHeight,
            to: url.pathname,
            t: Date.now()
          })
        );
      } catch (error) {
        /* Storage unavailable: the destination simply opens plainly. */
      }
      window.location.href = url.href;
    };
    // Absolute fallback: never leave the visitor on this page.
    window.setTimeout(go, NAV_FALLBACK_MS);

    let overlay = null;
    try {
      overlay = makeOverlay();
    } catch (error) {
      overlay = null;
    }
    if (!overlay) {
      go();
      return;
    }

    const { ctx, w, h } = overlay;
    const limit = maxRadius(clientX, clientY, w, h);
    const start = performance.now();
    const frame = now => {
      const p = Math.min((now - start) / EXIT_MS, 1);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${BASE_RGB}, ${easeInOut(p).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
      drawRings(ctx, clientX, clientY, limit, p, 0.55);
      if (p < 1) requestAnimationFrame(frame);
      else go();
    };
    requestAnimationFrame(frame);
  }

  function eligibleUrl(anchor, event) {
    if (event.defaultPrevented) return null;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return null;
    const href = anchor.getAttribute("href");
    if (!href) return null;
    if (anchor.hasAttribute("download")) return null;
    const target = anchor.getAttribute("target");
    if (target && target.toLowerCase() !== "_self") return null;
    if (/^(?:#|mailto:|tel:|javascript:|data:|blob:)/i.test(href)) return null;
    let url;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch (error) {
      return null;
    }
    if (url.origin !== window.location.origin) return null;
    // Same page (including pure hash changes) keeps default behaviour.
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    )
      return null;
    return url;
  }

  document.addEventListener(
    "click",
    event => {
      if (reducedMotion.matches || navigating) return;
      const anchor =
        event.target && event.target.closest
          ? event.target.closest("a[href]")
          : null;
      if (!anchor) return;
      const url = eligibleUrl(anchor, event);
      if (!url) return;
      event.preventDefault();
      startExit(url, event.clientX, event.clientY);
    },
    true
  );

  /* ---------------- Enter: recede the pre-paint veil ------------ */

  function startEnter() {
    const root = document.documentElement;
    // Consume the flag so it can never trigger twice.
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* Storage unavailable: nothing to consume. */
    }

    let overlay = null;
    try {
      overlay = makeOverlay();
    } catch (error) {
      overlay = null;
    }
    // Swap the pre-paint veil for the canvas in the same tick; the
    // canvas paints the identical colour in its first frame, so the
    // handover is invisible. Without a canvas the CSS failsafe lifts
    // the veil instead.
    root.classList.remove("pt-enter");
    if (!overlay) return;

    const { canvas, ctx, w, h } = overlay;
    const px = parseFloat(root.style.getPropertyValue("--pt-x")) || 50;
    const py = parseFloat(root.style.getPropertyValue("--pt-y")) || 50;
    const cx = (px / 100) * w;
    const cy = (py / 100) * h;
    const limit = maxRadius(cx, cy, w, h);
    const start = performance.now();
    const frame = now => {
      const p = Math.min((now - start) / ENTER_MS, 1);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${BASE_RGB}, ${(1 - easeOut(p)).toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
      drawRings(ctx, cx, cy, limit, p, 0.4);
      if (p < 1) requestAnimationFrame(frame);
      else canvas.remove();
    };
    requestAnimationFrame(frame);
    // Failsafe: the overlay must never linger.
    window.setTimeout(() => canvas.remove(), ENTER_MS + 600);
  }

  if (document.documentElement.classList.contains("pt-enter")) {
    startEnter();
  }

  /* ------------- BFCache: never restore a covered page ---------- */

  window.addEventListener("pageshow", () => {
    navigating = false;
    const stray = document.getElementById("pt-overlay");
    if (stray) stray.remove();
    document.documentElement.classList.remove("pt-enter");
  });
})();
