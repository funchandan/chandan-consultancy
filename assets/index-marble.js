/**
 * Index page — full-page fluid marble wallpaper (Canvas 2D).
 * Spec: _bmad-output/planning-artifacts/sally-mira-surface-marble-wallpaper-v1.md
 */
(function () {
  var body = document.body;
  var isHome = body.classList.contains("home-page");
  var isWork = body.classList.contains("work-page");
  /* Portfolio product index — solid band surfaces only (see index-product-surface.css). */
  if (isHome) return;
  if (!isWork) return;

  var backdrop = document.createElement("div");
  backdrop.className = "index-page-backdrop";
  backdrop.setAttribute("aria-hidden", "true");

  var canvas = document.createElement("canvas");
  canvas.className = "index-marble-bg";

  var veil = document.createElement("div");
  veil.className = "index-marble-veil";

  backdrop.appendChild(canvas);
  backdrop.appendChild(veil);
  body.insertBefore(backdrop, body.firstChild);
  body.classList.add("has-index-marble");

  var ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  var buffer = document.createElement("canvas");
  var bctx = buffer.getContext("2d", { alpha: false });

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var perm = new Uint8Array(512);
  for (var i = 0; i < 256; i++) perm[i] = i;
  for (var j = 255; j > 0; j--) {
    var k = (Math.random() * (j + 1)) | 0;
    var tmp = perm[j];
    perm[j] = perm[k];
    perm[k] = tmp;
  }
  for (var p = 0; p < 512; p++) perm[p] = perm[p & 255];

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function grad(hash, x, y) {
    var h = hash & 3;
    var u = h < 2 ? x : y;
    var v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  }
  function noise2(x, y) {
    var X = Math.floor(x) & 255;
    var Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    var u = fade(x);
    var v = fade(y);
    var aa = perm[X] + Y;
    var ab = perm[X + 1] + Y;
    return lerp(
      lerp(grad(perm[aa], x, y), grad(perm[ab], x - 1, y), u),
      lerp(grad(perm[aa + 1], x, y - 1), grad(perm[ab + 1], x - 1, y - 1), u),
      v
    );
  }
  function fbm(x, y, oct) {
    var sum = 0;
    var amp = 0.5;
    var freq = 1;
    for (var o = 0; o < oct; o++) {
      sum += noise2(x * freq, y * freq) * amp;
      amp *= 0.5;
      freq *= 2.1;
    }
    return sum;
  }

  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0;
    var g = 0;
    var b = 0;
    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }

  var palette = {
    base: hslToRgb(208, 38, 96),
    veinA: hslToRgb(208, 52, 84),
    veinB: hslToRgb(210, 46, 90),
    depth: hslToRgb(215, 42, 72),
  };

  function mix3(a, b, t) {
    return [
      (a[0] + (b[0] - a[0]) * t) | 0,
      (a[1] + (b[1] - a[1]) * t) | 0,
      (a[2] + (b[2] - a[2]) * t) | 0,
    ];
  }

  function sampleColor(v) {
    if (v < 0.45) return mix3(palette.base, palette.veinB, v / 0.45);
    if (v < 0.72) return mix3(palette.veinB, palette.veinA, (v - 0.45) / 0.27);
    return mix3(palette.veinA, palette.depth, (v - 0.72) / 0.28);
  }

  var viewW = 0;
  var viewH = 0;
  var bufW = 0;
  var bufH = 0;
  var dpr = 1;
  var time = 0;
  var speed = 0.00014;
  var rafId = 0;
  var lastTick = 0;
  var lastPaint = 0;
  var frameMs = reduced ? 0 : 36;

  function docHeight() {
    var root = document.documentElement;
    return Math.max(
      root.scrollHeight,
      root.offsetHeight,
      document.body.scrollHeight,
      document.body.offsetHeight,
      window.innerHeight
    );
  }

  function resize() {
    viewW = window.innerWidth;
    viewH = docHeight();
    dpr = Math.min(2, window.devicePixelRatio || 1);

    backdrop.style.height = viewH + "px";

    var pixelBudget = 520000;
    var ratio = Math.min(1, Math.sqrt(pixelBudget / Math.max(viewW * viewH, 1)));
    bufW = Math.max(1, Math.floor(viewW * ratio));
    bufH = Math.max(1, Math.floor(viewH * ratio));

    buffer.width = bufW;
    buffer.height = bufH;

    canvas.width = Math.max(1, Math.floor(viewW * dpr));
    canvas.height = Math.max(1, Math.floor(viewH * dpr));
    canvas.style.width = viewW + "px";
    canvas.style.height = viewH + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    if (ctx.imageSmoothingQuality) ctx.imageSmoothingQuality = "high";
  }

  function paint() {
    if (!bctx) return;
    var imageData = bctx.createImageData(bufW, bufH);
    var data = imageData.data;
    var t = time;
    var invW = 1 / bufW;
    var invH = 1 / bufH;
    var aspect = viewW / Math.max(viewH, 1);

    for (var py = 0; py < bufH; py++) {
      var ny = py * invH;
      for (var px = 0; px < bufW; px++) {
        var nx = px * invW;
        var warpX = fbm(nx * 2.2 + t * 0.9, ny * 2.2 * aspect + 2.1, 3) * 0.55;
        var warpY = fbm(nx * 2.2 + 4.3, ny * 2.2 * aspect + t * 0.7, 3) * 0.55;
        var marble = fbm(nx * 3.4 + warpX, ny * 3.4 * aspect + warpY + t * 0.35, 5);
        marble = marble * 0.5 + 0.5;
        marble = marble * marble * (3 - 2 * marble);
        var rgb = sampleColor(marble);
        var idx = (py * bufW + px) << 2;
        data[idx] = rgb[0];
        data[idx + 1] = rgb[1];
        data[idx + 2] = rgb[2];
        data[idx + 3] = 255;
      }
    }
    bctx.putImageData(imageData, 0, 0);

    var base = palette.base;
    ctx.fillStyle = "rgb(" + base[0] + "," + base[1] + "," + base[2] + ")";
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.drawImage(buffer, 0, 0, bufW, bufH, 0, 0, viewW, viewH);
  }

  function remeasure() {
    resize();
    paint();
  }

  function tick(now) {
    if (!reduced && !document.hidden) {
      if (now - lastPaint >= frameMs) {
        if (!lastTick) lastTick = now;
        var dt = now - lastTick;
        lastTick = now;
        time += speed * Math.min(dt, 48);
        paint();
        lastPaint = now;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  remeasure();
  if (!reduced) {
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", remeasure, { passive: true });
  window.addEventListener("load", remeasure);
  window.setTimeout(remeasure, 400);
  window.setTimeout(remeasure, 1200);

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(remeasure).observe(document.documentElement);
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) lastTick = 0;
  });
})();
