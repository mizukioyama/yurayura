/* ==============================
   Page transition (shared by all canonical pages)

   Swap mode (the default for in-site links between canonical
   pages): clicking a link raises a liquid fog — an fBm-noise
   WebGL fragment shader, no library — that swirls thicker until
   it covers the page. While the fog rises, the destination HTML
   is fetched in the background; once the page is fully covered,
   the document underneath is swapped in place (title, meta,
   stylesheets, body content, body attributes), the URL is
   updated with history.pushState, the destination's own scripts
   are loaded and initialised, and only then does the fog thin
   out. The cover never lifts between the two pages, so the
   destination can never flash through. Back/forward (popstate)
   runs the same covered swap and restores the scroll position
   kept in history.state.

   Classic mode (fallback): when a swap is not safe — a dirty
   form, an open modal, a non-canonical or query-string target,
   a failed fetch — the transition falls back to the original
   two-document handoff: cover, real navigation, and the
   destination page — pre-covered by the inline bootstrap in
   its <head> — lets the fog recede. One former fallback case
   is now handled before the decision: a link inside the open
   header menu (on mobile the menu is the only way to reach
   the header navigation, so every header tap used to take
   the classic route) first closes the menu through allmenu's
   own close path and then swaps like any other link; only if
   the menu cannot be closed does the click fall back. If
   WebGL is unavailable
   the fog falls back to a paper-coloured veil with fine ripple
   rings (Canvas 2D), and any failure falls back to a normal
   navigation: the visitor is never trapped on a covered page.

   Reveal independence and watchdogs: the reveal is NOT gated
   on the destination's full initialisation. Once the new body
   is swapped in (the commit point), the destination's scripts
   and fragment loads continue in the background and the fog
   lifts as soon as they finish OR a short cap elapses,
   whichever comes first — a slow CDN script can no longer
   hold the cover hostage (previously the whole serialised
   init chain ran under the cover, which on a slow device kept
   the fog up for tens of seconds). Two watchdogs back this
   up: a post-commit watchdog force-clears the overlay a few
   seconds after the commit if it is somehow still up, and an
   independent supervisor force-removes any overlay that has
   existed far longer than any healthy transition. Neither
   fires in a healthy flow, so neither changes the visuals.
   A separate guard watches the TOP page's own first-view blur
   (#fog-scene, driven by fog-hole.js — not a transition
   overlay): if that scene is still up well past its normal
   run, it is force-finished so a swapped-in TOP can never stay
   blurred.
   External links, new-tab links, downloads, in-page anchors
   and form submissions keep their default behaviour. With
   prefers-reduced-motion the transition is disabled entirely.
================================ */
(() => {
  "use strict";

  const STORAGE_KEY = "yurayura:page-transition";
  const BASE_RGB = "245, 242, 232"; // site paper colour (#f5f2e8)
  const STROKE_RGB = "86, 110, 106"; // muted green-grey (fallback rings)
  const EXIT_MS = 1100; // click -> covered
  const ENTER_MS = 1200; // covered -> revealed
  const NAV_FALLBACK_MS = 1500; // hard cap for the classic navigation
  const SWAP_DEADLINE_MS = 4500; // click -> swap must be ready, else classic
  const CSS_WAIT_MS = 2500; // per-stylesheet wait while covered
  const SCRIPT_WAIT_MS = 5000; // per-script wait during background init
  const FRAGMENTS_WAIT_MS = 1500; // header/footer re-init wait
  const INIT_REVEAL_CAP_MS = 3000; // post-commit: reveal waits for init at most this long
  const COMMIT_WATCHDOG_MS = 6000; // post-commit: force-clear the overlay after this
  const OVERLAY_MAX_MS = 20000; // supervisor: no overlay may live longer than this
  const FOG_SCENE_GUARD_MS = 8000; // TOP FV blur: force-finish if still up
  const RING_COUNT = 3;
  const RING_STAGGER = 0.12; // fraction of progress between rings

  /* Fog rendering budget: half-resolution buffer, capped DPR, one
     fullscreen triangle, one shader pass, drawn only while the
     transition runs. Mobile gets fewer noise octaves and a single
     domain warp so the cost stays close to the old 2D veil. */
  const RENDER_SCALE = 0.5;
  const MAX_DPR = 1.5;
  const OCTAVES_DESKTOP = 5;
  const OCTAVES_MOBILE = 3;

  /* Pages the in-place swap covers: the canonical pages from
     SITE_MAP.md, contact.html included. The contact form is
     swap-safe by construction: form.js initialises against the
     swapped-in DOM through the re-fired DOMContentLoaded and
     tears its session down on the pagehide the swap dispatches
     before replacing the body, and the guards in swapAllowed
     still force the classic route whenever the form holds
     unsent input or one of its dialogs is open — and whenever
     the session's Content-Security-Policy would block the
     form's endpoint (see formEndpointAllowedByCsp). Any failure
     during a contact swap falls back to the classic
     two-document transition as before. */
  const CANONICAL_SEGMENTS = new Set([
    "index.html",
    "concept.html",
    "gallery.html",
    "information.html",
    "exhibitions.html",
    "participate.html",
    "apply.html",
    "support.html",
    "venues.html",
    "profile.html",
    "contact.html",
    "policy.html"
  ]);
  /* Script handling for swapped-in pages. Scripts found in the
     fetched document fall into three groups, keyed by pathname:
     - SKIP: shared scripts that are already running and must
       never execute twice. allmenu.js re-initialises through
       the re-fired DOMContentLoaded instead.
     - ALWAYS: scripts that initialise immediately against the
       elements present when they run (an IIFE / readyState
       check) and bind only to those elements, so they are
       re-executed on every swap that includes them.
     - everything else loads at most once per session; its
       DOMContentLoaded listener stays registered and re-fires
       on the synthetic event dispatched after each swap. */
  const SCRIPT_SKIP = new Set([
    "/assets/js/font.js",
    "/assets/js/allmenu.js",
    "/assets/js/page-transition.js"
  ]);
  const SCRIPT_ALWAYS = new Set([
    "/assets/js/fog-hole.js",
    "/assets/js/participation-accordion.js"
  ]);
  const loadedScripts = new Set();

  /* The sets above are keyed by root-relative path, but the site
     is hosted under a subpath (a GitHub Pages project site), so a
     resolved pathname carries that prefix ("/yurayura/assets/…")
     and a plain Set.has() never matches. Match by suffix so the
     classification holds at any base path. (With an exact-match
     check, fog-hole.js silently degraded to load-once and was
     skipped on swap-in whenever the session had started on the
     TOP page, leaving the TOP first-view blur up forever.) */
  function scriptSetHas(set, pathname) {
    for (const entry of set) {
      if (pathname === entry || pathname.endsWith(entry)) return true;
    }
    return false;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 767px)");
  let navigating = false; // a transition (either mode) is in flight

  const easeInOut = t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const maxRadius = (cx, cy, w, h) =>
    Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  /* ---------------- Overlay registry and supervisor ------------- */
  /* Every overlay created below registers here. A supervisor
     sweeps once a second and force-removes any overlay that has
     been alive far longer than a healthy transition can last
     (OVERLAY_MAX_MS), whatever path created it and whatever went
     wrong. forceClearOverlay is idempotent: the animation loops
     guard their own finish steps, disposing a dead context is a
     no-op, and removing a detached canvas does nothing. */

  const liveOverlays = new Set();
  let supervisorTimer = null;

  function registerOverlay(overlay) {
    overlay.createdAt = performance.now();
    liveOverlays.add(overlay);
    if (supervisorTimer === null) {
      supervisorTimer = window.setInterval(superviseOverlays, 1000);
    }
  }

  function unregisterOverlay(overlay) {
    liveOverlays.delete(overlay);
    if (liveOverlays.size === 0 && supervisorTimer !== null) {
      window.clearInterval(supervisorTimer);
      supervisorTimer = null;
    }
  }

  function forceClearOverlay(overlay) {
    if (!overlay) return;
    try {
      if (typeof overlay.cleanup === "function") overlay.cleanup();
    } catch (error) {
      /* Cleanup hooks are best-effort; removal below is the point. */
    }
    try {
      if (overlay.kind === "fog" && overlay.fog) overlay.fog.dispose();
    } catch (error) {
      /* Disposing a lost context is a no-op. */
    }
    if (overlay.canvas) overlay.canvas.remove();
    unregisterOverlay(overlay);
    // If the flow that owned this overlay died mid-flight, its
    // navigating flag would otherwise stay set and the page —
    // though visible again — would ignore every further click.
    navigating = false;
  }

  function superviseOverlays() {
    const now = performance.now();
    for (const overlay of Array.from(liveOverlays)) {
      if (!overlay.canvas || !overlay.canvas.isConnected) {
        unregisterOverlay(overlay);
      } else if (now - overlay.createdAt > OVERLAY_MAX_MS) {
        forceClearOverlay(overlay);
      }
    }
    if (liveOverlays.size === 0 && supervisorTimer !== null) {
      window.clearInterval(supervisorTimer);
      supervisorTimer = null;
    }
  }

  /* ---------------- Fog shader (WebGL, no library) --------------- */
  /* The octave count and the second domain warp are baked into the
     source as literals: WebGL1 requires constant loop bounds. */

  const VERT_SRC = [
    "attribute vec2 a_pos;",
    "void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  function fragSrc(octaves, warp2) {
    const warpBlock = warp2
      ? [
          "  vec2 r = vec2(",
          "    fbm(p + 2.2 * q + vec2(1.7, 9.2) + t * vec2(0.7, -0.4)),",
          "    fbm(p + 2.2 * q + vec2(8.3, 2.8) - t * vec2(-0.5, 0.8))",
          "  );",
          "  float f = fbm(p + 2.4 * r);"
        ]
      : ["  float f = fbm(p + 2.4 * q);"];
    return [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH",
      "precision highp float;",
      "#else",
      "precision mediump float;",
      "#endif",
      "",
      "uniform vec2 u_res;",
      "uniform float u_time;",
      "uniform float u_cover;",
      "uniform vec2 u_center; // uv space, origin bottom-left",
      "uniform float u_maxd;  // max distance from center, height units",
      "",
      "const vec3 PAPER = vec3(0.9608, 0.9490, 0.9098);  // #f5f2e8",
      "const vec3 SHADOW = vec3(0.3373, 0.4314, 0.4157); // rgb(86,110,106)",
      "",
      "float hash(vec2 p) {",
      "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
      "}",
      "",
      "float noise(vec2 p) {",
      "  vec2 i = floor(p);",
      "  vec2 f = fract(p);",
      "  vec2 u = f * f * (3.0 - 2.0 * f);",
      "  return mix(",
      "    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
      "    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),",
      "    u.y);",
      "}",
      "",
      "float fbm(vec2 p) {",
      "  float v = 0.0;",
      "  float a = 0.5;",
      "  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);",
      "  for (int i = 0; i < " + octaves + "; i++) {",
      "    v += a * noise(p);",
      "    p = rot * p * 2.0;",
      "    a *= 0.5;",
      "  }",
      "  return v;",
      "}",
      "",
      "void main() {",
      "  vec2 uv = gl_FragCoord.xy / u_res;",
      "  vec2 p = vec2(uv.x * u_res.x / u_res.y, uv.y) * 2.6;",
      "",
      "  float t = u_time * 0.06;",
      "  vec2 q = vec2(",
      "    fbm(p + t * vec2(0.9, 0.5)),",
      "    fbm(p + vec2(5.2, 1.3) - t * vec2(0.6, 1.1))",
      "  );"
    ]
      .concat(warpBlock)
      .concat([
        "",
        "  vec2 sp = (gl_FragCoord.xy - u_center * u_res) / u_res.y;",
        "  float d = clamp(length(sp) / u_maxd, 0.0, 1.0);",
        "",
        "  // Fog front grows out of the click point as u_cover rises;",
        "  // the warped field keeps the edge liquid, never a flat disc.",
        "  float threshold = mix(1.35, -0.30, u_cover);",
        "  float density = smoothstep(",
        "    threshold, threshold + 0.45, f + (0.5 - d) * 0.5);",
        "  float floorA = smoothstep(0.85, 1.0, u_cover) * 0.97;",
        "  float alpha = clamp(max(density, floorA), 0.0, 1.0);",
        "",
        "  float shade = clamp(f * 1.7 - 0.3, 0.0, 1.0);",
        "  vec3 col = mix(PAPER, SHADOW,",
        "    shade * 0.75 * (0.35 + 0.65 * density));",
        "  col += vec3(0.025) * clamp(length(q) * 0.7, 0.0, 1.0);",
        "  gl_FragColor = vec4(col, alpha);",
        "}"
      ])
      .join("\n");
  }

  function createFogRenderer(canvas) {
    let gl = null;
    const attrs = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "low-power"
    };
    try {
      gl =
        canvas.getContext("webgl", attrs) ||
        canvas.getContext("experimental-webgl", attrs);
    } catch (error) {
      gl = null;
    }
    if (!gl) return null;

    const scale =
      RENDER_SCALE * Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(2, Math.round(window.innerWidth * scale));
    canvas.height = Math.max(2, Math.round(window.innerHeight * scale));

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const mobile = mobileLayout.matches;
    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(
      gl.FRAGMENT_SHADER,
      fragSrc(mobile ? OCTAVES_MOBILE : OCTAVES_DESKTOP, !mobile)
    );
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      cover: gl.getUniformLocation(program, "u_cover"),
      center: gl.getUniformLocation(program, "u_center"),
      maxd: gl.getUniformLocation(program, "u_maxd")
    };
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    return {
      // Returns false when the context is gone, so the caller can
      // fall back instead of freezing on a dead canvas.
      draw(cover, xNorm, yNorm, timeSec) {
        if (gl.isContextLost()) return false;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const cx = xNorm * w;
        const cy = yNorm * h;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uniforms.res, canvas.width, canvas.height);
        gl.uniform1f(uniforms.time, timeSec);
        gl.uniform1f(uniforms.cover, cover);
        gl.uniform2f(uniforms.center, xNorm, 1 - yNorm);
        gl.uniform1f(
          uniforms.maxd,
          Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) / h
        );
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return true;
      },
      dispose() {
        try {
          const ext = gl.getExtension("WEBGL_lose_context");
          if (ext) ext.loseContext();
        } catch (error) {
          /* The context dies with the page or the canvas anyway. */
        }
      }
    };
  }

  /* ---------------- Overlay setup (fog, else 2D veil) ----------- */

  function makeCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "pt-overlay";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    return canvas;
  }

  function setup2DOverlay() {
    const canvas = makeCanvas();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return null;
    }
    ctx.scale(dpr, dpr);
    const overlay = {
      kind: "2d",
      canvas,
      ctx,
      w: window.innerWidth,
      h: window.innerHeight
    };
    registerOverlay(overlay);
    return overlay;
  }

  // Tries WebGL fog first. A canvas owns exactly one context mode, so
  // the 2D fallback gets a fresh element.
  function setupOverlay() {
    const glCanvas = makeCanvas();
    let fog = null;
    try {
      fog = createFogRenderer(glCanvas);
    } catch (error) {
      fog = null;
    }
    if (fog) {
      const overlay = { kind: "fog", canvas: glCanvas, fog };
      registerOverlay(overlay);
      return overlay;
    }
    glCanvas.remove();
    return setup2DOverlay();
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

  function paint2DFrame(overlay, cx, cy, cover) {
    const { ctx, w, h } = overlay;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgba(${BASE_RGB}, ${cover.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
    drawRings(ctx, cx, cy, maxRadius(cx, cy, w, h), cover, 0.55);
  }

  /* ------------- Cover / reveal animation primitives ------------ */
  /* startCover animates the overlay from clear to fully covered
     and resolves; for the fog it then keeps swirling at full cover
     (a living hold) until stopHold() is called, so a slow fetch
     never leaves a frozen or thinning cover. The returned
     `failed` promise resolves true if the fog context dies
     mid-cover, letting the caller fall back. A watchdog resolves
     the cover even if animation frames stall (hidden tab). */

  function startCover(overlay, xNorm, yNorm) {
    let resolveCover;
    let resolveFailed;
    const covered = new Promise(resolve => (resolveCover = resolve));
    const failed = new Promise(resolve => (resolveFailed = resolve));
    let settled = false;
    let holding = false;
    let rafId = null;
    const start = performance.now();

    const finishCover = () => {
      if (settled) return;
      settled = true;
      // From here the hold owns the canvas; back it with the paper
      // colour so any sub-opaque fog pixel shows paper, never the
      // page that is about to be swapped underneath.
      overlay.canvas.style.background = `rgb(${BASE_RGB})`;
      resolveCover();
    };
    const fail = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resolveFailed(true);
    };
    // A force-clear (watchdog / supervisor) stops the cover loop;
    // the canvas removal itself is done by forceClearOverlay.
    overlay.cleanup = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    if (overlay.kind === "fog") {
      const { fog } = overlay;
      const frame = now => {
        const elapsed = now - start;
        const p = holding ? 1 : Math.min(elapsed / EXIT_MS, 1);
        if (!fog.draw(holding ? 1 : easeInOut(p), xNorm, yNorm, elapsed / 1000)) {
          fail();
          return;
        }
        if (!holding && p >= 1) {
          holding = true;
          finishCover();
        }
        rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
      window.setTimeout(() => {
        if (!settled) {
          holding = true;
          if (fog.draw(1, xNorm, yNorm, (performance.now() - start) / 1000)) {
            finishCover();
          } else {
            fail();
          }
        }
      }, EXIT_MS + 800);
    } else {
      const cx = xNorm * overlay.w;
      const cy = yNorm * overlay.h;
      const frame = now => {
        const p = Math.min((now - start) / EXIT_MS, 1);
        paint2DFrame(overlay, cx, cy, easeInOut(p));
        if (p < 1) rafId = requestAnimationFrame(frame);
        else finishCover();
      };
      rafId = requestAnimationFrame(frame);
      window.setTimeout(() => {
        if (!settled) {
          paint2DFrame(overlay, cx, cy, 1);
          finishCover();
        }
      }, EXIT_MS + 800);
    }

    return {
      covered,
      failed,
      stopHold() {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }

  // Animates the overlay from fully covered back to clear and
  // removes it. Used after an in-place swap; the classic arrival
  // has its own handover (startEnter) because of the pre-paint
  // cover. The paper backing comes off first so the page shows
  // through the thinning fog.
  function startReveal(overlay, xNorm, yNorm) {
    overlay.canvas.style.background = "";
    const start = performance.now();
    if (overlay.kind === "fog") {
      const { canvas, fog } = overlay;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        fog.dispose();
        canvas.remove();
        unregisterOverlay(overlay);
      };
      overlay.cleanup = finish;
      const frame = now => {
        const p = Math.min((now - start) / ENTER_MS, 1);
        if (!fog.draw(1 - easeOut(p), xNorm, yNorm, (now - start) / 1000)) {
          finish();
          return;
        }
        if (p < 1) requestAnimationFrame(frame);
        else finish();
      };
      requestAnimationFrame(frame);
      window.setTimeout(finish, ENTER_MS + 600);
      return;
    }
    const { canvas } = overlay;
    overlay.cleanup = () => {
      canvas.remove();
      unregisterOverlay(overlay);
    };
    const cx = xNorm * overlay.w;
    const cy = yNorm * overlay.h;
    const frame = now => {
      const p = Math.min((now - start) / ENTER_MS, 1);
      const cover = 1 - easeOut(p);
      const { ctx, w, h } = overlay;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${BASE_RGB}, ${cover.toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
      drawRings(ctx, cx, cy, maxRadius(cx, cy, w, h), p, 0.4);
      if (p < 1) requestAnimationFrame(frame);
      else {
        canvas.remove();
        unregisterOverlay(overlay);
      }
    };
    requestAnimationFrame(frame);
    window.setTimeout(() => {
      canvas.remove();
      unregisterOverlay(overlay);
    }, ENTER_MS + 600);
  }

  /* ---------------- Classic exit: cover, then navigate ---------- */

  function writeFlag(url, clientX, clientY) {
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
  }

  function startClassicExit(url, clientX, clientY) {
    if (navigating) return;
    navigating = true;

    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      writeFlag(url, clientX, clientY);
      window.location.href = url.href;
    };
    // Absolute fallback: never leave the visitor on this page.
    window.setTimeout(go, NAV_FALLBACK_MS);

    let overlay = null;
    try {
      overlay = setupOverlay();
    } catch (error) {
      overlay = null;
    }
    if (!overlay) {
      go();
      return;
    }

    const cover = startCover(overlay, clientX / window.innerWidth, clientY / window.innerHeight);
    cover.failed.then(broken => {
      if (broken) {
        overlay.canvas.remove();
        go();
      }
    });
    cover.covered.then(() => {
      cover.stopHold();
      if (overlay.kind === "fog") overlay.fog.dispose();
      go();
    });
  }

  /* ------------------- Swap: eligibility ------------------------ */

  function pathSegment(pathname) {
    if (!pathname || pathname.endsWith("/")) return "index.html";
    const parts = pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "index.html";
  }

  function hasDirtyForm() {
    const forms = document.querySelectorAll("form");
    for (const form of forms) {
      for (const el of form.elements) {
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.checked !== el.defaultChecked) return true;
        } else if (el.type === "file") {
          if (el.files && el.files.length) return true;
        } else if (
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT") &&
          el.value !== el.defaultValue
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /* The contact form posts to an external endpoint through
     fetch, which the document's Content-Security-Policy must
     permit. A swapped document keeps the policy of the page the
     session started on: the CSP meta is not swapped (policies
     delivered by meta cannot be relaxed after the fact — neither
     editing nor replacing the element lifts the original), and
     two pages (concept, policy) carry a narrower policy whose
     connect-src omits the form endpoint. Arriving on contact
     under such a policy would leave the form unable to submit,
     so the swap into contact is only attempted when the live
     policy permits the endpoint. Otherwise the classic route
     loads contact under its own policy, exactly as before. The
     meta in the live document is precisely the policy in force,
     because a swap never adds, removes or edits it. */
  const FORM_ENDPOINT_ORIGIN = "https://script.google.com";

  function formEndpointAllowedByCsp() {
    const meta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy" i]'
    );
    if (!meta) return true; // no policy in force
    const directives = new Map();
    for (const part of (meta.getAttribute("content") || "").split(";")) {
      const tokens = part.trim().split(/\s+/).filter(Boolean);
      if (tokens.length > 1) directives.set(tokens[0].toLowerCase(), tokens.slice(1));
    }
    const sources =
      directives.get("connect-src") || directives.get("default-src");
    if (!sources) return true;
    return sources.some(
      source =>
        source === "*" ||
        source === "https:" ||
        source === FORM_ENDPOINT_ORIGIN
    );
  }

  // A swap is only attempted when both pages are canonical, no
  // menu/modal is open and no form holds unsent input. Anything
  // else keeps the classic two-document transition. The click
  // handler closes an open header menu before consulting this
  // for header menu links (see closeHeaderMenuForLink), so the
  // is-open check below still guards every other path —
  // popstate included.
  function swapAllowed(url) {
    if (url.search) return false;
    const from = pathSegment(window.location.pathname);
    const to = pathSegment(url.pathname);
    if (!CANONICAL_SEGMENTS.has(from) || !CANONICAL_SEGMENTS.has(to)) {
      return false;
    }
    if (to === "contact.html" && !formEndpointAllowedByCsp()) return false;
    if (document.querySelector(".header.is-open")) return false;
    if (document.body.classList.contains("is-modal-open")) return false;
    if (document.querySelector(".modal.active")) return false;
    if (hasDirtyForm()) return false;
    return true;
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

  /* ------------------- Swap: document loading ------------------- */

  async function fetchDocument(url) {
    const response = await fetch(url.href, {
      credentials: "same-origin",
      headers: { Accept: "text/html" }
    });
    if (!response.ok) throw new Error("fetch failed: " + response.status);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (!doc.body || !doc.querySelector("main#main")) {
      throw new Error("unexpected document structure");
    }
    return { doc, finalUrl: response.url || url.href };
  }

  function swapMeta(doc) {
    const keys = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]'
    ];
    for (const selector of keys) {
      const next = doc.querySelector(selector);
      const current = document.querySelector(selector);
      if (next && current) {
        current.setAttribute("content", next.getAttribute("content") || "");
      }
    }
    const nextCanonical = doc.querySelector('link[rel="canonical"]');
    const currentCanonical = document.querySelector('link[rel="canonical"]');
    if (nextCanonical && currentCanonical) {
      currentCanonical.setAttribute(
        "href",
        nextCanonical.getAttribute("href") || ""
      );
    }
  }

  function stylesheetKey(href, base) {
    try {
      return new URL(href, base).href;
    } catch (error) {
      return href;
    }
  }

  // Adds the destination's stylesheets (awaited, so the layout is
  // final when the fog lifts) and removes ones it does not use.
  // Links present on both pages keep their elements and order.
  async function swapStylesheets(doc, finalUrl) {
    const current = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    );
    const target = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    const currentKeys = new Set(
      current.map(link => stylesheetKey(link.getAttribute("href"), window.location.href))
    );
    const targetKeys = new Set(
      target.map(link => stylesheetKey(link.getAttribute("href"), finalUrl))
    );

    const waits = [];
    for (const link of target) {
      const key = stylesheetKey(link.getAttribute("href"), finalUrl);
      if (currentKeys.has(key)) continue;
      const clone = document.createElement("link");
      clone.rel = "stylesheet";
      clone.href = key;
      const media = link.getAttribute("media");
      if (media) clone.media = media;
      waits.push(
        new Promise(resolve => {
          clone.addEventListener("load", resolve, { once: true });
          clone.addEventListener("error", resolve, { once: true });
          window.setTimeout(resolve, CSS_WAIT_MS);
        })
      );
      document.head.appendChild(clone);
    }
    await Promise.all(waits);

    for (const link of current) {
      const key = stylesheetKey(link.getAttribute("href"), window.location.href);
      if (!targetKeys.has(key)) link.remove();
    }
  }

  function swapBody(doc, overlayCanvas) {
    const live = document.body;
    // Detach the overlay first: it must survive the swap and stay
    // on top of the new content.
    if (overlayCanvas && overlayCanvas.parentNode) overlayCanvas.remove();

    for (const attr of Array.from(live.attributes)) {
      live.removeAttribute(attr.name);
    }
    for (const attr of Array.from(doc.body.attributes)) {
      live.setAttribute(attr.name, attr.value);
    }

    const nodes = Array.from(doc.body.childNodes).map(node =>
      document.importNode(node, true)
    );
    live.replaceChildren(...nodes);

    if (overlayCanvas) live.appendChild(overlayCanvas);
  }

  function executeScript(src) {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      script.addEventListener("load", finish, { once: true });
      script.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, SCRIPT_WAIT_MS);
      document.head.appendChild(script);
    });
  }

  // Loads the destination's scripts in document order. Shared
  // scripts never re-execute; page scripts load once per session
  // and re-initialise through the re-fired DOMContentLoaded;
  // immediate scripts (SCRIPT_ALWAYS) re-execute every time.
  // Inline scripts are never copied: the only one on canonical
  // pages is the pre-paint bootstrap, which must not run here.
  async function loadPageScripts(doc, finalUrl) {
    const scripts = Array.from(doc.querySelectorAll("script[src]"));
    for (const script of scripts) {
      const raw = script.getAttribute("src");
      if (!raw) continue;
      let resolved;
      try {
        resolved = new URL(raw, finalUrl);
      } catch (error) {
        continue;
      }
      const key = resolved.origin + resolved.pathname;
      if (scriptSetHas(SCRIPT_SKIP, resolved.pathname)) continue;
      if (scriptSetHas(SCRIPT_ALWAYS, resolved.pathname) || !loadedScripts.has(key)) {
        await executeScript(resolved.href);
        loadedScripts.add(key);
      }
    }
  }

  function waitForFragmentsReady() {
    return new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        document.removeEventListener("yurayura:fragments-ready", finish);
        resolve();
      };
      document.addEventListener("yurayura:fragments-ready", finish);
      window.setTimeout(finish, FRAGMENTS_WAIT_MS);
    });
  }

  // The commit half of the in-place swap: everything that makes
  // the new document visible and laid out under the fog cover.
  // Every wait here is short and bounded (stylesheet loads race
  // a per-sheet timeout), and this is the point of no return —
  // once it resolves, the destination is on screen under the
  // cover and the reveal must follow on a bounded schedule.
  async function swapCore(fetched, overlay) {
    const { doc, finalUrl } = fetched;

    // Let the outgoing page tear down: fv-animation.js destroys
    // its Vanta effect and cancels its loops on pagehide, which
    // is the only pagehide listener on canonical pages.
    window.dispatchEvent(new Event("pagehide"));

    document.title = doc.title;
    swapMeta(doc);
    await swapStylesheets(doc, finalUrl);
    swapBody(doc, overlay ? overlay.canvas : null);
  }

  // The initialisation half: load the destination's scripts and
  // re-fire DOMContentLoaded so every page script (allmenu,
  // slide, gallery, exhibition-state, …) initialises against the
  // new DOM, exactly as on a fresh load. allmenu re-fetches the
  // header/footer parts and re-marks the current page from the
  // new URL. This runs AFTER the commit and no longer gates the
  // reveal beyond a short cap: its waits are individually
  // bounded but serialised, so a slow CDN script could
  // otherwise keep the page covered for tens of seconds.
  async function initSwappedPage(fetched) {
    const { doc, finalUrl } = fetched;
    await loadPageScripts(doc, finalUrl);
    const fragmentsReady = waitForFragmentsReady();
    document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
    await fragmentsReady;
  }

  /* ------------------- Swap: history handling ------------------- */

  function markCurrentEntry(scrollY) {
    try {
      const state = Object.assign({}, window.history.state, {
        ptSwap: true,
        scrollY: typeof scrollY === "number" ? scrollY : window.scrollY
      });
      window.history.replaceState(state, "", window.location.href);
    } catch (error) {
      /* History unavailable: popstate swaps simply will not run. */
    }
  }

  let scrollSaveQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollSaveQueued || navigating) return;
      scrollSaveQueued = true;
      requestAnimationFrame(() => {
        scrollSaveQueued = false;
        if (!navigating) markCurrentEntry(window.scrollY);
      });
    },
    { passive: true }
  );

  try {
    markCurrentEntry(window.scrollY);
    // Seed the loaded-script set from this document.
    for (const script of document.querySelectorAll("script[src]")) {
      try {
        const resolved = new URL(script.getAttribute("src"), window.location.href);
        loadedScripts.add(resolved.origin + resolved.pathname);
      } catch (error) {
        /* Unparseable src: it will simply load again if needed. */
      }
    }
  } catch (error) {
    /* Swap stays available for clicks; popstate may fall back. */
  }

  /* ------------------- Swap: navigation flow -------------------- */

  async function navigateViaSwap(url, options) {
    const xNorm = options.xNorm;
    const yNorm = options.yNorm;

    let overlay = null;
    try {
      overlay = setupOverlay();
    } catch (error) {
      overlay = null;
    }
    if (!overlay) return false;

    /* Phase 1 (reversible): rise the cover while the destination
       is fetched in parallel. Nothing in the document is touched
       yet, so missing the deadline — or a dead fog context — can
       still fall back to the classic navigation. */
    const fetchedPromise = fetchDocument(url).catch(() => null);
    const cover = startCover(overlay, xNorm, yNorm);
    const coveredOrBroken = Promise.race([
      cover.covered.then(() => false),
      cover.failed.then(() => true)
    ]);
    const phase1 = (async () => {
      const broken = await coveredOrBroken;
      if (broken) return null;
      return fetchedPromise;
    })();
    const fetched = await Promise.race([
      phase1,
      wait(SWAP_DEADLINE_MS).then(() => "timeout")
    ]);
    if (!fetched || fetched === "timeout") {
      cover.stopHold();
      if (overlay.kind === "fog") overlay.fog.dispose();
      overlay.canvas.remove();
      return false;
    }

    /* Phase 2 (commit): swap the document core under the held
       cover. A failure here still falls back — pushState has
       not happened yet, so the classic route to the same URL
       loads the destination cleanly. Once the core is in, the
       commit watchdog is armed: whatever happens later in this
       flow, the overlay is force-cleared COMMIT_WATCHDOG_MS
       after the commit, so the visitor can never be left on a
       covered page. */
    try {
      await swapCore(fetched, overlay);
    } catch (error) {
      cover.stopHold();
      if (overlay.kind === "fog") overlay.fog.dispose();
      overlay.canvas.remove();
      return false;
    }
    cover.stopHold();
    window.setTimeout(() => forceClearOverlay(overlay), COMMIT_WATCHDOG_MS);
    // If the destination is the TOP page, its own first-view
    // blur (#fog-scene) starts with the swapped-in body; arm the
    // guard for it alongside the transition watchdogs.
    armFogSceneGuard();

    const finalUrl = new URL(fetched.finalUrl);
    try {
      // From the first swap on, scroll positions live in
      // history.state and are restored by the popstate handler.
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!options.viaPopstate) {
        window.history.pushState(
          { ptSwap: true, scrollY: 0 },
          "",
          fetched.finalUrl
        );
      }
    } catch (error) {
      overlay.canvas.remove();
      return false;
    }

    if (options.restoreScrollY != null) {
      window.scrollTo(0, options.restoreScrollY);
    } else if (finalUrl.hash) {
      const target = document.querySelector(finalUrl.hash);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }

    /* Initialise the new page in the background. The reveal
       waits for initialisation only up to INIT_REVEAL_CAP_MS:
       in a healthy flow init finishes well inside the cap and
       nothing changes, but a slow script (three.js / Vanta from
       a CDN on a mobile network is the realistic case) can no
       longer stretch the covered period — the fog lifts on
       schedule and init completes behind the revealed page.
       Because init now runs after pushState, allmenu's
       current-page marking sees the destination URL, as it
       does on a fresh load. */
    const initDone = initSwappedPage(fetched).catch(() => {});
    await Promise.race([initDone, wait(INIT_REVEAL_CAP_MS)]);

    startReveal(overlay, xNorm, yNorm);
    return true;
  }

  async function startSwapNavigation(url, clientX, clientY) {
    navigating = true;
    markCurrentEntry(window.scrollY);
    const ok = await navigateViaSwap(url, {
      xNorm: clientX / window.innerWidth,
      yNorm: clientY / window.innerHeight,
      restoreScrollY: null
    }).catch(() => false);
    navigating = false;
    if (!ok) {
      // Nothing was pushed and the document is unchanged (the
      // swap only mutates after every fetch has succeeded);
      // take the classic route instead.
      startClassicExit(url, clientX, clientY);
    }
  }

  /* ------------- Header menu: close first, then swap ---------- */
  /* On mobile the header navigation lives inside the slide-in
     menu, so a header tap always happens while the menu is
     open — and swapAllowed refuses an open menu, which forced
     every header navigation onto the classic two-document
     route (the route whose arrival handover misbehaves on
     some devices) while body and footer links swapped fine.
     For a link inside the open header menu, close the menu
     first and then take the normal decision below.
     The close goes through allmenu's own procedure — a
     programmatic click on the menu toggle runs exactly the
     handler a visitor's tap runs (setMenuState(false)):
     is-open removed, the body scroll lock (menu-open class
     and --menu-scroll-top) released, inert restored on the
     background, aria state updated and the menu-state event
     dispatched. Replicating those steps here would drift from
     allmenu and silently drop pieces (inert, focus, scroll
     restore), so they are deliberately not duplicated.
     Returns true only when the menu verifiably closed; any
     abnormality returns false and the click keeps the classic
     fallback, so a link can never be stranded by this path. */

  function closeHeaderMenuForLink(anchor) {
    const header = document.querySelector(".header.is-open");
    if (!header) return false;
    // Same scope as allmenu's own close-on-link-click: the
    // .header-link items of the open menu. (The logo link sits
    // in .header-txt, which is inert while the menu is open,
    // so it cannot be the clicked element in this state.)
    if (!anchor.classList.contains("header-link")) return false;
    if (!header.contains(anchor)) return false;
    const toggle = header.querySelector(".menu-toggle");
    if (!toggle) return false;
    toggle.click();
    return (
      !header.classList.contains("is-open") &&
      !document.body.classList.contains("menu-open")
    );
  }

  // Runs callback on the next animation frame, or after a
  // short timeout if frames stall — whichever comes first.
  // Closing the menu queues allmenu's scroll restore on a
  // frame; the outgoing page's scroll position is only true
  // again once that frame has run, and startSwapNavigation
  // records it for later popstate restoration.
  function afterNextFrame(callback) {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      callback();
    };
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(run);
    }
    window.setTimeout(run, 120);
  }

  function beginNavigation(url, clientX, clientY) {
    if (swapAllowed(url)) {
      startSwapNavigation(url, clientX, clientY);
    } else {
      startClassicExit(url, clientX, clientY);
    }
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
      if (closeHeaderMenuForLink(anchor)) {
        // The menu is closed. Hold further clicks for the one
        // frame allmenu needs to restore the scroll position,
        // then decide exactly as for any other link — swap for
        // canonical targets (contact included), classic for the
        // rest. The menu still closes first, as it does when
        // allmenu handles the click itself.
        navigating = true;
        afterNextFrame(() => {
          navigating = false;
          beginNavigation(url, event.clientX, event.clientY);
        });
        return;
      }
      beginNavigation(url, event.clientX, event.clientY);
    },
    true
  );

  window.addEventListener("popstate", event => {
    const state = event.state;
    if (!state || !state.ptSwap) return; // not a swap-managed entry
    if (reducedMotion.matches) {
      // Preferences changed mid-session: resync with a full load.
      window.location.assign(window.location.href);
      return;
    }
    if (navigating) {
      window.location.assign(window.location.href);
      return;
    }
    const url = new URL(window.location.href);
    if (!swapAllowed(url)) {
      window.location.assign(window.location.href);
      return;
    }
    navigating = true;
    navigateViaSwap(url, {
      xNorm: 0.5,
      yNorm: 0.5,
      viaPopstate: true,
      restoreScrollY: typeof state.scrollY === "number" ? state.scrollY : 0
    })
      .catch(() => false)
      .then(ok => {
        navigating = false;
        if (!ok) window.location.assign(window.location.href);
      });
  });

  /* ------------- TOP first-view fog guard ---------------------- */
  /* The TOP page opens under its own full-viewport blur
     (#fog-scene, assets/css/fog-hole.css), which fog-hole.js
     animates away in about five seconds on a normal load. That
     layer is NOT the transition overlay — the watchdogs and the
     supervisor above never see it — so if fog-hole.js does not
     run to completion for a swapped-in TOP, the blur would stay
     forever over an otherwise correct page. This guard captures
     the scene element when armed (on load, and after every swap
     commit) and force-finishes it — the same is-hidden classes
     fog-hole.js itself applies, then removal — if that same
     element is still up FOG_SCENE_GUARD_MS later. In a healthy
     flow fog-hole.js has already removed the element by then,
     so the guard is a no-op and the FV animation is untouched. */

  function forceFinishFogScene(scene) {
    for (const id of ["fog-blur-layer", "fog-hole", "fog-boundary"]) {
      const el = scene.querySelector("#" + id);
      if (el) el.classList.add("is-hidden");
    }
    scene.classList.add("is-hidden");
    // The blur layer fades over 1.1s once hidden; remove the
    // scene after the fade so the forced finish is not a cut.
    window.setTimeout(() => {
      if (scene.parentNode) scene.remove();
    }, 1400);
  }

  function armFogSceneGuard() {
    const scene = document.getElementById("fog-scene");
    if (!scene) return;
    window.setTimeout(() => {
      if (scene.isConnected && !scene.classList.contains("is-hidden")) {
        forceFinishFogScene(scene);
      }
    }, FOG_SCENE_GUARD_MS);
  }

  /* ---------------- Enter: recede the pre-paint veil ------------ */
  /* Classic arrivals only: the destination document was covered
     before its first paint by the inline bootstrap, and the fog
     takes over from that cover. Swap arrivals never come here —
     their document never reloads. */

  function startEnter() {
    const root = document.documentElement;
    // Consume the flag so it can never trigger twice.
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* Storage unavailable: nothing to consume. */
    }

    const px = parseFloat(root.style.getPropertyValue("--pt-x")) || 50;
    const py = parseFloat(root.style.getPropertyValue("--pt-y")) || 50;
    const xNorm = px / 100;
    const yNorm = py / 100;

    let overlay = null;
    try {
      overlay = setupOverlay();
    } catch (error) {
      overlay = null;
    }
    // Without an overlay the inline failsafe lifts the pre-paint
    // cover on its own; the class stays until then.
    if (!overlay) return;

    /* Handover rule: the pre-paint cover (the inline bootstrap's
       ::before) may only be lifted once the overlay canvas already
       holds a fully covered frame, so start by painting that frame
       synchronously instead of waiting for the first
       requestAnimationFrame. The cover itself is lifted further
       below, once the frame has also been presented. */
    if (overlay.kind === "fog") {
      if (!overlay.fog.draw(1, xNorm, yNorm, 0)) {
        // WebGL died between setup and the first draw: trade the
        // dead canvas for the 2D veil, likewise pre-painted below,
        // before the cover is lifted.
        overlay.fog.dispose();
        overlay.canvas.remove();
        try {
          overlay = setup2DOverlay();
        } catch (error) {
          overlay = null;
        }
        if (!overlay) return;
      }
    }
    if (overlay.kind === "2d") {
      overlay.ctx.fillStyle = `rgba(${BASE_RGB}, 1)`;
      overlay.ctx.fillRect(0, 0, overlay.w, overlay.h);
    }

    /* A synchronous draw alone does not prove the frame reached
       the screen: the browser may not have composited the canvas
       yet when the cover is lifted, leaving a frame or two with
       neither cover nor fog. Two defences close that gap. The
       canvas element itself is backed with the paper colour, so
       even a not-yet-composited (still transparent) canvas paints
       opaque; and the cover is lifted only after two animation
       frames, the second of which runs after the pre-painted frame
       has actually been presented. The backing is removed in the
       same step as the cover, so the reveal is unaffected. If
       frames stall (hidden tab), the inline failsafe lifts the
       cover onto this paper-backed canvas instead — still no
       flash, still no trap — and the reveal runs when frames
       resume. */
    overlay.canvas.style.background = `rgb(${BASE_RGB})`;

    const beginReveal = () => {
      overlay.canvas.style.background = "";
      root.classList.remove("pt-enter");

      if (overlay.kind === "fog") {
        const { canvas, fog } = overlay;
        const start = performance.now();
        const finish = () => {
          fog.dispose();
          canvas.remove();
          unregisterOverlay(overlay);
        };
        overlay.cleanup = finish;
        const frame = now => {
          const p = Math.min((now - start) / ENTER_MS, 1);
          if (!fog.draw(1 - easeOut(p), xNorm, yNorm, (now - start) / 1000)) {
            finish();
            return;
          }
          if (p < 1) requestAnimationFrame(frame);
          else finish();
        };
        requestAnimationFrame(frame);
        // Failsafe: the overlay must never linger.
        window.setTimeout(finish, ENTER_MS + 600);
        return;
      }

      const { canvas, ctx, w, h } = overlay;
      overlay.cleanup = () => {
        canvas.remove();
        unregisterOverlay(overlay);
      };
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
        else {
          canvas.remove();
          unregisterOverlay(overlay);
        }
      };
      requestAnimationFrame(frame);
      // Failsafe: the overlay must never linger.
      window.setTimeout(() => {
        canvas.remove();
        unregisterOverlay(overlay);
      }, ENTER_MS + 600);
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(beginReveal);
      });
    } else {
      beginReveal();
    }
  }

  if (document.documentElement.classList.contains("pt-enter")) {
    startEnter();
  }

  // Fresh loads and classic arrivals: if this document is the
  // TOP page, guard its first-view blur from the start.
  armFogSceneGuard();

  /* ------------- BFCache: never restore a covered page ---------- */

  window.addEventListener("pageshow", () => {
    navigating = false;
    const stray = document.getElementById("pt-overlay");
    if (stray) stray.remove();
    document.documentElement.classList.remove("pt-enter");
  });
})();
