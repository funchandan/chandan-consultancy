/**
 * Interactive dot grid background — ported from @aicanvas/dot-grid (aicanvas.me)
 * Canvas field with cursor-lit dots; fixed behind product index content.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var SPACING = 20;
  var RADIUS = 130;
  var BASE_A = 0.13;
  var PEAK_A = 0.92;

  WPM.register("dot-grid", {
    layer: -1,
    init: function (_body, ctx) {
      if (!document.body.classList.contains("home-page--product")) return;

      var root = document.documentElement;
      var host = document.createElement("div");
      host.className = "wp-dot-grid";
      host.setAttribute("aria-hidden", "true");

      var canvas = document.createElement("canvas");
      canvas.className = "wp-dot-grid__canvas";
      host.appendChild(canvas);
      document.body.insertBefore(host, document.body.firstChild);

      root.classList.add("wp-dot-grid-active");

      var mouse = null;
      var alive = true;
      var animId = 0;
      var postHero = false;
      var dots = [];
      var cw = 0;
      var ch = 0;
      var context = canvas.getContext("2d");
      if (!context) {
        host.remove();
        root.classList.remove("wp-dot-grid-active");
        return;
      }

      function build() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var rect = canvas.getBoundingClientRect();
        cw = rect.width;
        ch = rect.height;
        if (!cw || !ch) return;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        dots = [];
        var cols = Math.floor(cw / SPACING) + 2;
        var rows = Math.floor(ch / SPACING) + 2;
        var ox = (cw % SPACING) / 2;
        var oy = (ch % SPACING) / 2;
        var r;
        var c;
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            dots.push({ x: ox + c * SPACING, y: oy + r * SPACING, b: 0 });
          }
        }
      }

      function drawStatic() {
        context.clearRect(0, 0, cw, ch);
        var i;
        for (i = 0; i < dots.length; i++) {
          var d = dots[i];
          context.fillStyle = "rgba(255,255,255," + BASE_A.toFixed(2) + ")";
          context.fillRect(d.x - 0.5, d.y - 0.5, 1, 1);
        }
      }

      function frame() {
        if (!alive || ctx.paused || postHero) {
          animId = requestAnimationFrame(frame);
          return;
        }

        context.clearRect(0, 0, cw, ch);

        var mx = mouse ? mouse.x : -99999;
        var my = mouse ? mouse.y : -99999;
        var r2 = RADIUS * RADIUS;
        var i;

        for (i = 0; i < dots.length; i++) {
          var d = dots[i];
          var dx = d.x - mx;
          var dy = d.y - my;
          var dist2 = dx * dx + dy * dy;
          var tgt =
            dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / RADIUS, 1.5) : 0;

          d.b += (tgt > d.b ? 0.16 : 0.07) * (tgt - d.b);
          if (d.b < 0.004) d.b = 0;

          var alpha = BASE_A + (PEAK_A - BASE_A) * d.b;
          var sz = 1 + d.b * 1.2;
          context.fillStyle = "rgba(255,255,255," + alpha.toFixed(2) + ")";
          context.fillRect(d.x - sz / 2, d.y - sz / 2, sz, sz);
        }

        animId = requestAnimationFrame(frame);
      }

      function updatePointer(clientX, clientY) {
        var rect = canvas.getBoundingClientRect();
        mouse = { x: clientX - rect.left, y: clientY - rect.top };
      }

      function onMouseMove(e) {
        updatePointer(e.clientX, e.clientY);
      }

      function onTouchMove(e) {
        var t = e.touches[0];
        if (t) updatePointer(t.clientX, t.clientY);
      }

      function clearPointer() {
        mouse = null;
      }

      if (!ctx.reduced) {
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", clearPointer, { passive: true });
        window.addEventListener("touchcancel", clearPointer, { passive: true });
        document.addEventListener("mouseleave", clearPointer);
      }

      build();

      if (ctx.reduced) {
        drawStatic();
      } else {
        frame();
      }

      var ro = new ResizeObserver(function () {
        build();
        if (ctx.reduced) drawStatic();
      });
      ro.observe(host);

      function syncPostHero() {
        postHero = document.body.classList.contains("home-page--post-hero");
        if (postHero) {
          context.clearRect(0, 0, cw, ch);
        }
      }

      syncPostHero();
      var bodyObserver = new MutationObserver(syncPostHero);
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

      return function () {
        alive = false;
        bodyObserver.disconnect();
        cancelAnimationFrame(animId);
        ro.disconnect();
        if (!ctx.reduced) {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", clearPointer);
          window.removeEventListener("touchcancel", clearPointer);
          document.removeEventListener("mouseleave", clearPointer);
        }
        host.remove();
        root.classList.remove("wp-dot-grid-active");
      };
    },
  });
})();
