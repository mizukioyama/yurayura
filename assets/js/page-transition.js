/* ==============================
   Page transition (shared by all canonical pages)
   Clicking an in-site link raises a liquid fog — an fBm-noise WebGL
   fragment shader, no library — that swirls thicker until it covers
   the page; navigation then happens and the destination page —
   pre-covered by the inline bootstrap in its <head> — lets the fog
   thin out until the page appears. If WebGL is unavailable the
   transition falls back to the previous paper-coloured veil with
   fine ripple rings (Canvas 2D), and any failure falls back to a
   normal navigation: the visitor is never trapped on a covered page.
   External links, new-tab links, downloads, in-page anchors and form
   submissions keep their default behaviour. With
   prefers-reduced-motion the transition is disabled entirely.
================================ */
(() => {
  "use strict";

  const STORAGE_KEY = "yurayura:page-transition";
  const BASE_RGB = "245, 242, 232"; // site paper colour (#f5f2e8)
  const STROKE_RGB = "86, 110, 106"; // muted green-grey (fallback rings)
  const EXIT_MS = 1100; // click -> covered
  const ENTER_MS = 1200; // covered -> revealed
  const NAV_FALLBACK_MS = 1500; // hard cap: navigate anyway
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

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 767px)");
  let navigating = false;

  const easeInOut = t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const maxRadius = (cx, cy, w, h) =>
    Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));

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
    return {
      kind: "2d",
      canvas,
      ctx,
      w: window.innerWidth,
      h: window.innerHeight
    };
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
    if (fog) return { kind: "fog", canvas: glCanvas, fog };
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
      overlay = setupOverlay();
    } catch (error) {
      overlay = null;
    }
    if (!overlay) {
      go();
      return;
    }

    const start = performance.now();
    if (overlay.kind === "fog") {
      const { canvas, fog } = overlay;
      const xNorm = clientX / window.innerWidth;
      const yNorm = clientY / window.innerHeight;
      const frame = now => {
        const p = Math.min((now - start) / EXIT_MS, 1);
        if (!fog.draw(easeInOut(p), xNorm, yNorm, (now - start) / 1000)) {
          canvas.remove();
          go();
          return;
        }
        if (p < 1) requestAnimationFrame(frame);
        else {
          fog.dispose();
          go();
        }
      };
      requestAnimationFrame(frame);
      return;
    }

    const { ctx, w, h } = overlay;
    const limit = maxRadius(clientX, clientY, w, h);
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
        };
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

  /* ------------- BFCache: never restore a covered page ---------- */

  window.addEventListener("pageshow", () => {
    navigating = false;
    const stray = document.getElementById("pt-overlay");
    if (stray) stray.remove();
    document.documentElement.classList.remove("pt-enter");
  });
})();
