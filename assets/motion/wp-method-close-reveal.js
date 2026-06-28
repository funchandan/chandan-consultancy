/**
 * Method close panel reveal — MOTION-PANEL-CLOSE-001 / WO-015
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  WPM.register("method-close-reveal", {
    layer: 1,
    init: function (panel, ctx) {
      if (!panel) return;

      function reveal() {
        panel.classList.add("wp-method-close--revealed");
      }

      if (ctx.reduced) {
        reveal();
        return;
      }

      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                reveal();
                obs.disconnect();
              }
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
        );
        obs.observe(panel);
      } else {
        reveal();
      }
    },
  });
})();
