/**
 * Bento card titles — TextReveal-style word fade on scroll into view.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var observers = [];

  function wireTitle(el) {
    if (!el || el.getAttribute("data-bento-title-wired") === "1") return;
    el.setAttribute("data-bento-title-wired", "1");

    var target = el.closest(".bento-card") || el;
    if (ctxReduced()) {
      el.classList.add("is-revealed");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          el.classList.add("is-revealed");
          observer.disconnect();
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(target);
    observers.push(observer);
  }

  function ctxReduced() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function scan(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("[data-bento-title-reveal]").forEach(wireTitle);
  }

  WPM.register("bento-text-reveal", {
    layer: 2,
    init: function (root) {
      if (!document.body.classList.contains("home-page--product")) return;
      scan(root || document);

      function onTitlesUpdated() {
        scan(document.querySelector("[data-box-bento]") || document);
      }

      document.addEventListener("wp:bento-titles-updated", onTitlesUpdated);

      return function destroy() {
        document.removeEventListener("wp:bento-titles-updated", onTitlesUpdated);
        observers.forEach(function (o) {
          if (o && typeof o.disconnect === "function") o.disconnect();
        });
        observers = [];
      };
    },
  });
})();
