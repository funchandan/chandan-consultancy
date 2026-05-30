/**
 * Hero impact stat counter — MOTION-HERO-COUNTER-001
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  WPM.register("hero-impact-counter", {
    layer: 1,
    init: function (root, ctx) {
      if (!root) return;

      var nodes = root.querySelectorAll("[data-wp-count]");
      if (!nodes.length) return;

      function finish(node) {
        var target = node.getAttribute("data-wp-count") || "0";
        var suffix = node.getAttribute("data-wp-count-suffix") || "";
        var prefix = node.getAttribute("data-wp-count-prefix") || "";
        node.textContent = prefix + target + suffix;
        node.classList.add("is-counted");
      }

      if (ctx.reduced) {
        nodes.forEach(finish);
        return;
      }

      function animate(node) {
        if (node.classList.contains("is-counted")) return;

        var target = parseFloat(node.getAttribute("data-wp-count") || "0");
        if (!isFinite(target)) {
          finish(node);
          return;
        }

        var suffix = node.getAttribute("data-wp-count-suffix") || "";
        var prefix = node.getAttribute("data-wp-count-prefix") || "";
        var duration = parseInt(node.getAttribute("data-wp-count-duration") || "1200", 10);
        var start = performance.now();

        function tick(now) {
          var t = clamp((now - start) / duration, 0, 1);
          var value = Math.round(easeOutCubic(t) * target);
          node.textContent = prefix + String(value) + suffix;
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            node.classList.add("is-counted");
          }
        }

        requestAnimationFrame(tick);
      }

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animate(entry.target);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.35, rootMargin: "0px 0px -5% 0px" }
        );
        nodes.forEach(function (node) {
          obs.observe(node);
        });
      } else {
        nodes.forEach(finish);
      }
    },
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.WPMotion || !window.WPMotion.prefersReducedMotion()) return;
    var root = document.querySelector("[data-wp-motion~='hero-impact-counter']");
    if (!root) return;
    root.querySelectorAll("[data-wp-count]").forEach(function (node) {
      var target = node.getAttribute("data-wp-count") || "0";
      var suffix = node.getAttribute("data-wp-count-suffix") || "";
      var prefix = node.getAttribute("data-wp-count-prefix") || "";
      node.textContent = prefix + target + suffix;
      node.classList.add("is-counted");
    });
  });
})();
