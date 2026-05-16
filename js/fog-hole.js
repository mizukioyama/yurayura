(function () {
  "use strict";

  // =====================================================
  // 1. HTML要素を取得
  // =====================================================
  var scene = document.getElementById("fog-scene");
  var blurLayer = document.getElementById("fog-blur-layer");
  var wrapper = document.getElementById("fog-hole");
  var canvas = document.getElementById("fogHoleCanvas");

  if (!scene || !blurLayer || !wrapper || !canvas) return;

  // =====================================================
  // 2. 設定値
  // =====================================================
  var SETTINGS = {
    holdDuration: 550,        // 開始前の待機
    holeDuration: 2400,       // 穴が広がる時間
    holdAfterHole: 350,       // 穴が指定位置まで広がった後の静止時間
    fadeDuration: 1400,       // 背景ぼかしと靄が一緒に消える時間
    removeDelay: 1200,         // フェード後にDOM削除するまでの時間
    removeScene: true,        // 最後に fog-scene ごと削除
    blurEdgeSize: 72,         // ぼかし穴の縁の柔らかさ

    // 穴の最終到達位置
    // 1.0 で画面対角いっぱい付近まで
    // 0.7 くらいで途中まで
    targetRadiusScale: 0.2
  };

  // =====================================================
  // 3. 最大半径を計算
  // =====================================================
  function getMaxRadius() {
    return Math.sqrt(
      Math.pow(window.innerWidth, 2) +
      Math.pow(window.innerHeight, 2)
    );
  }

  // =====================================================
  // 4. easing
  // =====================================================
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  // =====================================================
  // 5. WebGL初期化
  // =====================================================
  var gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true
  });

  if (!gl) {
    console.warn("WebGLが使えません。");
    return;
  }

  // =====================================================
  // 6. 頂点シェーダー
  // =====================================================
  var vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // =====================================================
  // 7. フラグメントシェーダー
  // =====================================================
  // u_progress     = 穴の広がり
  // u_fadeProgress = 全体フェード
  var fragmentSource = `
    precision highp float;

    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_progress;
    uniform float u_fadeProgress;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x)
           + (c - a) * u.y * (1.0 - u.x)
           + (d - b) * u.x * u.y;
    }

    mat2 rot(float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;

      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot(0.12) * p * 2.0 + 0.07;
        a *= 0.5;
      }

      return v;
    }

    void main() {
      vec2 uv = v_uv;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      // -----------------------------------------------
      // 靄の流れ
      // -----------------------------------------------
      vec2 driftA = vec2(u_time * 0.0030, -u_time * 0.0014);
      vec2 driftB = vec2(-u_time * 0.0022, u_time * 0.0028);

      float large = fbm(p * 0.82 + driftA);
      float mid   = fbm(p * 1.35 + driftB + 4.2);
      float fine  = fbm(p * 2.5 + 8.1);

      float haze = large * 0.58 + mid * 0.27 + fine * 0.09;
      haze = smoothstep(0.24, 0.84, haze);

      // -----------------------------------------------
      // 靄の基本濃度
      // -----------------------------------------------
      float veil = 0.11;
      float alpha = veil + haze * 0.08;

      // -----------------------------------------------
      // 中央から広がる穴
      // -----------------------------------------------
      float radius = mix(0.0, 1.0, u_progress);

      float edgeNoise = fbm(p * 2.4 + vec2(u_time * 0.0016, -u_time * 0.0011));
      float distortedRadius = radius + (edgeNoise - 0.5) * 0.14;

      float distFromCenter = length(p);

      float holeMask = smoothstep(
        distortedRadius - 0.12,
        distortedRadius + 0.12,
        distFromCenter
      );

      alpha *= holeMask;

      // -----------------------------------------------
      // 穴の淵リング
      // -----------------------------------------------
      float edgeWidth = 0.075;

      float edgeRing = 1.0 - smoothstep(
        0.0,
        edgeWidth,
        abs(distFromCenter - distortedRadius)
      );

      edgeRing *= smoothstep(0.0, 0.25, u_progress);
      edgeRing *= 0.45;

      // -----------------------------------------------
      // 微粒ノイズ
      // -----------------------------------------------
      float grain = noise(uv * u_resolution.xy * 0.16 + u_time * 0.08);
      alpha += (grain - 0.5) * 0.008;

      // -----------------------------------------------
      // 全体フェード
      // -----------------------------------------------
      float endFade = 1.0 - smoothstep(0.0, 1.0, u_fadeProgress);
      alpha *= endFade;
      edgeRing *= endFade;

      alpha = clamp(alpha, 0.0, 0.16);

      vec3 fogColor = vec3(0.82, 0.85, 0.90);
      vec3 edgeColor = vec3(0.77, 0.83, 0.90);

      vec3 finalColor = mix(fogColor, edgeColor, edgeRing);

      float finalAlpha = max(alpha, edgeRing * 0.08);
      finalAlpha = clamp(finalAlpha, 0.0, 0.18);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  // =====================================================
  // 8. Shader / Program作成
  // =====================================================
  function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function createProgram(vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  var vs = createShader(gl.VERTEX_SHADER, vertexSource);
  var fs = createShader(gl.FRAGMENT_SHADER, fragmentSource);
  var program = createProgram(vs, fs);

  if (!vs || !fs || !program) {
    console.warn("Shaderの初期化に失敗しました。");
    return;
  }

  // =====================================================
  // 9. uniform / attribute取得
  // =====================================================
  var positionLoc = gl.getAttribLocation(program, "a_position");
  var resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  var timeLoc = gl.getUniformLocation(program, "u_time");
  var progressLoc = gl.getUniformLocation(program, "u_progress");
  var fadeLoc = gl.getUniformLocation(program, "u_fadeProgress");

  // =====================================================
  // 10. 全画面ポリゴン
  // =====================================================
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );

  // =====================================================
  // 11. リサイズ
  // =====================================================
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.floor(window.innerWidth * dpr);
    var h = Math.floor(window.innerHeight * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    gl.viewport(0, 0, w, h);
  }

  // =====================================================
  // 12. 状態管理
  // =====================================================
  var startTime = 0;
  var running = false;
  var rafId = null;

  // =====================================================
  // 13. 終了処理
  // =====================================================
  function finishAnimation() {
    blurLayer.classList.add("is-hidden");
    wrapper.classList.add("is-hidden");
    running = false;

    setTimeout(function () {
      if (SETTINGS.removeScene && scene && scene.parentNode) {
        scene.remove();
      }
    }, SETTINGS.removeDelay);
  }

  // =====================================================
  // 14. 描画ループ
  // =====================================================
  function render(now) {
    if (!running) return;

    resize();

    var elapsed = now - startTime;

    // 進行区間
    var holeStart = SETTINGS.holdDuration;
    var holeEnd = holeStart + SETTINGS.holeDuration;
    var fadeStart = holeEnd + SETTINGS.holdAfterHole;
    var fadeEnd = fadeStart + SETTINGS.fadeDuration;

    // ---------------------------------
    // 1. 穴の広がり
    // ---------------------------------
    var holeProgress = 0.0;
    if (elapsed > holeStart) {
      holeProgress = Math.min((elapsed - holeStart) / SETTINGS.holeDuration, 1.0);
      holeProgress = easeOutCubic(holeProgress);
    }

    // ---------------------------------
    // 2. 全体フェード
    // ---------------------------------
    var fadeProgress = 0.0;
    if (elapsed > fadeStart) {
      fadeProgress = Math.min((elapsed - fadeStart) / SETTINGS.fadeDuration, 1.0);
      fadeProgress = easeInOutSine(fadeProgress);
    }

    // ---------------------------------
    // 3. ぼかし穴
    // 指定位置まで広がったら止まる
    // その後に全体がフェード
    // ---------------------------------
    var maxRadius = getMaxRadius() * SETTINGS.targetRadiusScale;
    var blurRadius = maxRadius * holeProgress;

    blurLayer.style.setProperty("--hole-size", blurRadius + "px");
    blurLayer.style.setProperty("--edge-size", SETTINGS.blurEdgeSize + "px");

    // フェードは opacity でも同期
    var layerOpacity = 1 - fadeProgress;
    blurLayer.style.opacity = String(layerOpacity);
    wrapper.style.opacity = String(layerOpacity);

    // ---------------------------------
    // 4. WebGL靄
    // ---------------------------------
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    gl.uniform1f(timeLoc, elapsed * 0.001);
    gl.uniform1f(progressLoc, holeProgress);
    gl.uniform1f(fadeLoc, fadeProgress);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (fadeProgress >= 1.0) {
      finishAnimation();
      return;
    }

    rafId = requestAnimationFrame(render);
  }

  // =====================================================
  // 15. 外部から呼べる関数
  // =====================================================
  function startFogHole() {
    if (running) return;

    blurLayer.classList.remove("is-hidden");
    wrapper.classList.remove("is-hidden");
    blurLayer.style.setProperty("--hole-size", "0px");
    blurLayer.style.opacity = "1";
    wrapper.style.opacity = "1";

    startTime = performance.now();
    running = true;
    rafId = requestAnimationFrame(render);
  }

  function stopFogHole() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function restartFogHole() {
    stopFogHole();
    startFogHole();
  }

  function setFogHoleOptions(options) {
    if (!options) return;

    if (typeof options.holdDuration === "number") SETTINGS.holdDuration = options.holdDuration;
    if (typeof options.holeDuration === "number") SETTINGS.holeDuration = options.holeDuration;
    if (typeof options.holdAfterHole === "number") SETTINGS.holdAfterHole = options.holdAfterHole;
    if (typeof options.fadeDuration === "number") SETTINGS.fadeDuration = options.fadeDuration;
    if (typeof options.removeDelay === "number") SETTINGS.removeDelay = options.removeDelay;
    if (typeof options.removeScene === "boolean") SETTINGS.removeScene = options.removeScene;
    if (typeof options.blurEdgeSize === "number") SETTINGS.blurEdgeSize = options.blurEdgeSize;
    if (typeof options.targetRadiusScale === "number") SETTINGS.targetRadiusScale = options.targetRadiusScale;
  }

  window.startFogHole = startFogHole;
  window.stopFogHole = stopFogHole;
  window.restartFogHole = restartFogHole;
  window.setFogHoleOptions = setFogHoleOptions;

  // =====================================================
  // 16. 初期化
  // =====================================================
  window.addEventListener("resize", resize);
  resize();

  startFogHole();
})();