/**
 * Work case split reveal — MOTION-WORK-CASE-001 / WO-015
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  WPM.register("work-case-reveal", {
    layer: 1,
    init: function (work, ctx) {
      if (!work) return;

      var cases = work.querySelectorAll(".wp-project-case");
      if (!cases.length) return;

      function markEntered(el) {
        el.classList.add("wp-project-case--entered");
      }

      if (ctx.reduced) {
        cases.forEach(function (c) {
          c.classList.add("is-visible", "wp-project-case--entered");
        });
        return;
      }

      cases.forEach(function (c) {
        if (c.classList.contains("is-visible")) {
          markEntered(c);
          return;
        }
        if ("MutationObserver" in window) {
          var obs = new MutationObserver(function () {
            if (c.classList.contains("is-visible")) {
              markEntered(c);
              obs.disconnect();
            }
          });
          obs.observe(c, { attributes: true, attributeFilter: ["class"] });
        }
      });

      if (!("IntersectionObserver" in window)) {
        cases.forEach(function (c) {
          c.classList.add("is-visible", "wp-project-case--entered");
        });
      }
    },
  });
})();
