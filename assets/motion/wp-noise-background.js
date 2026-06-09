/**
 * Noise background — ported from @aceternity/noise-background (ui.aceternity.com)
 * Animated gradient layers + noise texture for hero CTA shells.
 */
(function () {
  "use strict";

  var MULTIPLIERS = [1, 0.7, 1.2];
  var OPACITIES = [0.4, 0.3, 0.25];
  var DEFAULT_COLORS = [
    "255, 100, 150",
    "100, 150, 255",
    "255, 200, 100",
  ];

  function parseColors(raw) {
    if (!raw) return DEFAULT_COLORS.slice();
    return raw.split("|").map(function (part) {
      return part.replace(/rgb\(|\)/g, "").trim();
    });
  }

  function randomVelocity(speed) {
    var angle = Math.random() * Math.PI * 2;
    var magnitude = speed * (0.5 + Math.random() * 0.5);
    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude,
    };
  }

  function init(el) {
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var layers = el.querySelectorAll(".wp-noise-background__gradient");
    var strip = el.querySelector(".wp-noise-background__strip");
    var speed = parseFloat(el.getAttribute("data-noise-speed") || "0.1");
    var colors = parseColors(el.getAttribute("data-noise-colors"));
    var animating = el.getAttribute("data-noise-animating") !== "false";

    var posX = 0;
    var posY = 0;
    var springX = 0;
    var springY = 0;
    var velocity = randomVelocity(speed);
    var lastDirectionChange = 0;
    var alive = true;
    var animId = 0;

    function center() {
      var rect = el.getBoundingClientRect();
      posX = rect.width / 2;
      posY = rect.height / 2;
      springX = posX;
      springY = posY;
    }

    function paint() {
      var i;
      for (i = 0; i < layers.length; i++) {
        var color = colors[i] || colors[0];
        layers[i].style.opacity = String(OPACITIES[i] || OPACITIES[0]);
        layers[i].style.background =
          "radial-gradient(circle at " +
          springX * (MULTIPLIERS[i] || 1) +
          "px " +
          springY * (MULTIPLIERS[i] || 1) +
          "px, rgb(" +
          color +
          ") 0%, transparent 50%)";
      }

      if (strip) {
        strip.style.transform = animating && !reduced
          ? "translateX(" + (springX * 0.1 - 50) + "px)"
          : "none";
      }
    }

    function frame(time) {
      if (!alive) return;

      if (animating && !reduced) {
        var rect = el.getBoundingClientRect();
        var maxX = rect.width;
        var maxY = rect.height;
        var padding = 20;

        if (time - lastDirectionChange > 1500 + Math.random() * 1500) {
          velocity = randomVelocity(speed);
          lastDirectionChange = time;
        }

        posX += velocity.x * 16;
        posY += velocity.y * 16;

        if (
          posX < padding ||
          posX > maxX - padding ||
          posY < padding ||
          posY > maxY - padding
        ) {
          velocity = randomVelocity(speed);
          lastDirectionChange = time;
          posX = Math.max(padding, Math.min(maxX - padding, posX));
          posY = Math.max(padding, Math.min(maxY - padding, posY));
        }

        springX += (posX - springX) * 0.12;
        springY += (posY - springY) * 0.12;
      } else {
        center();
      }

      paint();
      animId = requestAnimationFrame(frame);
    }

    center();
    velocity = randomVelocity(speed);
    lastDirectionChange = performance.now();

    var ro = new ResizeObserver(center);
    ro.observe(el);
    animId = requestAnimationFrame(frame);

    return function () {
      alive = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-wp-noise-background]");
    var i;
    for (i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
