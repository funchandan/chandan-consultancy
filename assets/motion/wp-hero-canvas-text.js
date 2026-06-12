/**
 * Aceternity CanvasText — hero morph keywords (static index.html port)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function resolveKwColors(index) {
    var probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = "var(--wp-hero-kw-" + index + ", #a8c8f0)";
    document.body.appendChild(probe);
    var base = getComputedStyle(probe).color || "rgb(168, 200, 240)";
    document.body.removeChild(probe);

    var match = base.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) {
      return [
        "rgba(168, 200, 240, 1)",
        "rgba(168, 200, 240, 0.7)",
        "rgba(168, 200, 240, 0.4)",
      ];
    }

    var r = match[1];
    var g = match[2];
    var b = match[3];
    var steps = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
    return steps.map(function (a) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    });
  }

  WPM.register("hero-canvas-text", {
    layer: 2,
    init: function (root, ctx) {
      if (!root) return;

      var text = (root.getAttribute("data-canvas-text") || root.textContent || "").trim();
      if (!text) return;

      var kwIndex = parseInt(root.getAttribute("data-canvas-kw-index") || "0", 10);
      var host = document.createElement("span");
      host.className = "wp-hero-canvas-text__host";
      var measureEl = document.createElement("span");
      measureEl.className = "wp-hero-canvas-text__measure";
      measureEl.textContent = text;
      measureEl.setAttribute("aria-hidden", "true");
      var canvas = document.createElement("canvas");
      canvas.className = "wp-hero-canvas-text__canvas";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", text);

      root.textContent = "";
      root.appendChild(host);
      host.appendChild(measureEl);
      host.appendChild(canvas);

      var colors = resolveKwColors(kwIndex);
      var rawColors = root.getAttribute("data-canvas-colors");
      if (rawColors) {
        colors = rawColors.split("|").map(function (c) {
          return c.trim();
        });
      }

      var animationDuration = parseFloat(
        root.getAttribute("data-canvas-duration") || "5"
      );
      var lineWidth = parseFloat(root.getAttribute("data-canvas-line-width") || "1.5");
      var lineGap = parseFloat(root.getAttribute("data-canvas-line-gap") || "4");
      var curveIntensity = parseFloat(
        root.getAttribute("data-canvas-curve") || "60"
      );
      var rafId = 0;
      var disposed = false;
      var animating = !prefersReducedMotion() && !(ctx && ctx.reduced);
      var width = 10;
      var height = 10;
      var font = "";
      var drawText = text;
      var resizeObserver = null;

      function resolveDrawText(cs) {
        var resolved = text;
        if (cs && cs.textTransform === "uppercase") {
          resolved = text.toUpperCase();
        }
        return resolved;
      }

      function setKeywordText(nextText, nextIndex) {
        text = (nextText || "").trim();
        if (!text) return;
        canvas.setAttribute("aria-label", text);
        if (!isNaN(nextIndex)) {
          kwIndex = nextIndex;
          colors = resolveKwColors(kwIndex);
        }
        width = 0;
        updateSize();
        requestAnimationFrame(function () {
          updateSize();
          requestAnimationFrame(updateSize);
        });
      }

      function updateSize() {
        var wasHidden = measureEl.style.visibility === "hidden";
        measureEl.style.visibility = "visible";
        measureEl.style.position = "static";

        var cs = getComputedStyle(measureEl);
        drawText = resolveDrawText(cs);
        measureEl.textContent = drawText;

        font =
          (cs.fontStyle || "normal") +
          " " +
          (cs.fontVariant || "") +
          " " +
          cs.fontWeight +
          " " +
          cs.fontSize +
          " " +
          cs.fontFamily;

        var rect = measureEl.getBoundingClientRect();
        var nextH = Math.ceil(rect.height) || 0;
        var nextW = Math.ceil(rect.width) || 0;

        var probe = document.createElement("canvas");
        var pg = probe.getContext("2d");
        if (pg && font) {
          pg.font = font;
          var metrics = pg.measureText(drawText);
          var ctxW = Math.ceil(metrics.width);
          if (metrics.actualBoundingBoxRight !== undefined) {
            ctxW = Math.ceil(
              (metrics.actualBoundingBoxLeft || 0) + metrics.actualBoundingBoxRight
            );
          }
          nextW = Math.max(nextW, ctxW) + 32;
        }

        if (nextW < 1 || nextH < 1) {
          if (animating && wasHidden) {
            measureEl.style.visibility = "hidden";
            measureEl.style.position = "absolute";
          }
          return;
        }

        width = nextW;
        height = nextH;
        host.style.width = width + "px";
        host.style.height = height + "px";
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.style.display = animating ? "block" : "none";
        measureEl.style.visibility = animating ? "hidden" : "visible";
        measureEl.style.position = animating ? "absolute" : "static";
      }

      var startTime = performance.now();

      function drawFrame(currentTime) {
        if (disposed) return;
        if (!animating) return;
        if (ctx && (ctx.paused || document.hidden)) {
          rafId = requestAnimationFrame(drawFrame);
          return;
        }

        if (width < 2 || height < 2) updateSize();
        if (width < 2 || height < 2) {
          rafId = requestAnimationFrame(drawFrame);
          return;
        }

        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        var g = canvas.getContext("2d", { alpha: true });
        if (!g) return;

        var elapsed = (currentTime - startTime) / 1000;
        var phase = (elapsed / animationDuration) * Math.PI * 2;
        var numLines = Math.floor(height / lineGap) + 10;

        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, width, height);
        g.font = font;
        g.textBaseline = "alphabetic";
        g.textAlign = "left";

        var metrics = g.measureText(drawText);
        var baselineY =
          (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) /
          2;

        g.globalCompositeOperation = "source-over";
        g.fillStyle = "#000";
        g.fillText(drawText, 0, baselineY);

        g.globalCompositeOperation = "source-in";
        g.fillStyle = "rgba(255, 255, 255, 0.92)";
        g.fillRect(0, 0, width, height);

        g.globalCompositeOperation = "source-atop";
        for (var i = 0; i < numLines; i++) {
          var y = i * lineGap;
          var curve1 = Math.sin(phase) * curveIntensity;
          var curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6;
          g.strokeStyle = colors[i % colors.length];
          g.lineWidth = lineWidth;
          g.beginPath();
          g.moveTo(0, y);
          g.bezierCurveTo(
            width * 0.33,
            y + curve1,
            width * 0.66,
            y + curve2,
            width,
            y
          );
          g.stroke();
        }

        rafId = requestAnimationFrame(drawFrame);
      }

      function bootMeasure() {
        updateSize();
      }

      function onCanvasUpdate(ev) {
        if (!ev || !ev.detail || ev.detail.el !== root) return;
        setKeywordText(ev.detail.text, ev.detail.kwIndex);
      }

      bootMeasure();
      requestAnimationFrame(bootMeasure);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(bootMeasure);
      }
      if (animating) rafId = requestAnimationFrame(drawFrame);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(bootMeasure);
        resizeObserver.observe(measureEl);
        if (root.parentElement) resizeObserver.observe(root.parentElement);
      }

      window.addEventListener("resize", bootMeasure, { passive: true });
      document.addEventListener("wp:hero-canvas-update", onCanvasUpdate);

      return function destroy() {
        disposed = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (resizeObserver) resizeObserver.disconnect();
        window.removeEventListener("resize", bootMeasure);
        document.removeEventListener("wp:hero-canvas-update", onCanvasUpdate);
        root.textContent = text;
      };
    },
  });
})();
