/**
 * Connect band reveal — MOTION-CONNECT-001 / WO-015
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  WPM.register("connect-reveal", {
    layer: 1,
    init: function (section, ctx) {
      if (!section) return;

      function reveal() {
        section.classList.add("wp-connect--revealed");
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
          { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
        );
        obs.observe(section);
      } else {
        reveal();
      }
    },
  });
})();
