/**
 * EdgeBlur handoff — seam pinned under navbar pill; viewport bottom fade.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function bindScroll(fn) {
    if (window.WPScroll && typeof window.WPScroll.on === "function") {
      return window.WPScroll.on(fn);
    }
    window.addEventListener("scroll", fn, { passive: true });
    return function () {
      window.removeEventListener("scroll", fn);
    };
  }

  function readNavAnchorBottom(header) {
    if (!header) return 0;
    var pills = header.querySelectorAll(".nav-pill");
    var pill = null;
    for (var i = 0; i < pills.length; i++) {
      if (getComputedStyle(pills[i]).display !== "none") {
        pill = pills[i];
        break;
      }
    }
    return (pill || header).getBoundingClientRect().bottom;
  }

  WPM.register("edge-blur-handoff", {
    layer: 2,
    init: function (_body) {
      if (!document.body.classList.contains("home-page--product")) return;

      var seam = document.querySelector("[data-edge-blur-seam]");
      var hero = document.getElementById("hero");
      var nav = document.querySelector(".site-header");
      if (!seam || !hero) return;

      var root = document.documentElement;
      var unbindScroll = null;
      var ro = null;

      function syncLayout() {
        var heroRect = hero.getBoundingClientRect();
        var vh = window.innerHeight;
        var navBottom = readNavAnchorBottom(nav);
        var handoff = clamp(1 - heroRect.bottom / vh, 0, 1);
        var postHeroActive = handoff > 0.01;

        root.style.setProperty("--eb-seam-top", navBottom.toFixed(2) + "px");
        root.style.setProperty("--eb-handoff-progress", handoff.toFixed(4));
        root.style.setProperty("--eb-seam-opacity", (0.72 + handoff * 0.28).toFixed(3));

        seam.classList.toggle("is-active", postHeroActive);
      }

      root.classList.add("wp-edge-blur-ready");
      syncLayout();
      unbindScroll = bindScroll(syncLayout);

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(syncLayout);
        ro.observe(hero);
        if (nav) ro.observe(nav);
      } else {
        window.addEventListener("resize", syncLayout);
      }

      return function teardown() {
        if (unbindScroll) unbindScroll();
        if (ro) ro.disconnect();
        else window.removeEventListener("resize", syncLayout);
        root.classList.remove("wp-edge-blur-ready");
        seam.classList.remove("is-active");
        root.style.removeProperty("--eb-seam-top");
        root.style.removeProperty("--eb-handoff-progress");
        root.style.removeProperty("--eb-seam-opacity");
      };
    },
  });
})();
