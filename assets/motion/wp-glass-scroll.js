/**
 * Glass on-scroll — Tier 3 / Noomo glass cards
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

  WPM.register("glass-scroll", {
    layer: 2,
    init: function (_root, ctx) {
      if (!document.body.classList.contains("home-page--product")) return;

      var targets = document.querySelectorAll(
        ".wp-method-line, .wp-connect__pill"
      );
      if (!targets.length) return;

      document.documentElement.classList.add("wp-glass-scroll-ready");

      if ((ctx && ctx.reduced) || prefersReducedMotion()) return;

      var gsap = window.gsap;
      var ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      var triggers = [];
      targets.forEach(function (el) {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            end: "center 45%",
            scrub: 0.35,
            onUpdate: function (self) {
              el.style.setProperty("--glass-scroll-progress", self.progress.toFixed(4));
              el.classList.add("wp-glass-scroll-target");
            },
            onLeave: function () {
              el.style.setProperty("--glass-scroll-progress", "1");
            },
            onLeaveBack: function () {
              el.style.setProperty("--glass-scroll-progress", "0");
              el.classList.remove("wp-glass-scroll-target");
            },
          })
        );
      });

      return function destroy() {
        triggers.forEach(function (st) {
          st.kill();
        });
        targets.forEach(function (el) {
          el.style.removeProperty("--glass-scroll-progress");
          el.classList.remove("wp-glass-scroll-target");
        });
        document.documentElement.classList.remove("wp-glass-scroll-ready");
      };
    },
  });
})();
