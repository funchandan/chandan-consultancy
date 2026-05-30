/**
 * Immersive nav — C10v3 (WO-008)
 * Spec: _bmad-output/D-UX-Design/components/wp-nav-immersive-v3.md
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM) return;

  var SECTION_MAP = {
    hero: "orient",
    work: "proof",
    approach: "method",
    services: "engage",
  };

  WPM.register("nav-immersive", {
    layer: 3,
    init: function (header, ctx) {
      if (!header || !document.body.classList.contains("home-page")) return;

      var pills = header.querySelectorAll("[data-nav-journey]");
      var scrollThreshold = 72;
      var ticking = false;
      var services = document.getElementById("services");

      function setScrollState() {
        var y = window.scrollY;
        header.classList.toggle("site-header--top", y < scrollThreshold);
        header.classList.toggle("site-header--scrolled", y >= scrollThreshold);
      }

      function setActiveBeat(beat) {
        pills.forEach(function (pill) {
          var on = pill.getAttribute("data-nav-journey") === beat;
          pill.classList.toggle("is-active", on);
          if (on) pill.setAttribute("aria-current", "true");
          else pill.removeAttribute("aria-current");
        });
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(function () {
            setScrollState();
            ticking = false;
          });
        }
      }

      setScrollState();
      window.addEventListener("scroll", onScroll, { passive: true });

      if ("IntersectionObserver" in window) {
        var ids = ["hero", "work", "approach", "services"];
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              var beat = SECTION_MAP[entry.target.id];
              if (beat) setActiveBeat(beat);
            });
          },
          { rootMargin: "-40% 0px -45% 0px", threshold: 0 }
        );
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) obs.observe(el);
        });

        if (services) {
          var darkObs = new IntersectionObserver(
            function (entries) {
              header.classList.toggle(
                "site-header--on-dark",
                entries[0] && entries[0].isIntersecting
              );
            },
            { rootMargin: "-100% 0px -85% 0px", threshold: 0 }
          );
          darkObs.observe(services);
        }
      }

      document.addEventListener("wp:journey-beat", function (e) {
        if (e.detail && e.detail.beat) setActiveBeat(e.detail.beat);
      });

      return function () {
        window.removeEventListener("scroll", onScroll);
        header.classList.remove(
          "site-header--top",
          "site-header--scrolled",
          "site-header--on-dark"
        );
      };
    },
  });
})();
