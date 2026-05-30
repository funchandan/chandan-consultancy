/**
 * Statement-band header — scroll + services on-dark (WO-010)
 * Replaces journey pills / beat sync from wp-nav-immersive.js on index.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM) return;

  WPM.register("nav-immersive", {
    layer: 3,
    init: function (header, ctx) {
      if (!header || !document.body.classList.contains("home-page")) return;

      var scrollThreshold = 72;
      var ticking = false;
      var connect = document.getElementById("connect");
      var work = document.getElementById("work");
      var anchors = header.querySelectorAll(".nav-anchor[href^='#']");
      var spySections = ["work", "approach", "connect"]
        .map(function (id) {
          return document.getElementById(id);
        })
        .filter(Boolean);

      function setActiveAnchor(id) {
        anchors.forEach(function (a) {
          var match = a.getAttribute("href") === "#" + id;
          a.classList.toggle("is-active", match);
          if (match) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      }

      function useDarkPill() {
        return (
          header.classList.contains("site-header--on-dark") ||
          header.classList.contains("site-header--on-work")
        );
      }

      function scrollY() {
        if (window.WPScroll && typeof window.WPScroll.getY === "function") {
          return window.WPScroll.getY();
        }
        return window.scrollY || 0;
      }

      function setScrollState() {
        var y = scrollY();
        var dark = useDarkPill();
        header.classList.toggle("site-header--top", y < scrollThreshold && !dark);
        header.classList.toggle("site-header--scrolled", y >= scrollThreshold || dark);
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
      var unbindScroll;
      if (window.WPScroll && typeof window.WPScroll.on === "function") {
        unbindScroll = window.WPScroll.on(function () {
          onScroll();
        });
      } else {
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      if ("IntersectionObserver" in window) {
        function bandObs(className, el, rootMargin) {
          if (!el) return;
          var obs = new IntersectionObserver(
            function (entries) {
              header.classList.toggle(className, entries[0] && entries[0].isIntersecting);
              setScrollState();
            },
            { rootMargin: rootMargin, threshold: 0 }
          );
          obs.observe(el);
        }
        bandObs("site-header--on-dark", connect, "-100% 0px -85% 0px");
        bandObs("site-header--on-work", work, "-42% 0px -42% 0px");
      }

      if ("IntersectionObserver" in window && spySections.length && anchors.length) {
        var spyObs = new IntersectionObserver(
          function (entries) {
            var visible = entries
              .filter(function (e) {
                return e.isIntersecting;
              })
              .sort(function (a, b) {
                return b.intersectionRatio - a.intersectionRatio;
              });
            if (visible[0]) setActiveAnchor(visible[0].target.id);
          },
          { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.12, 0.35] }
        );
        spySections.forEach(function (el) {
          spyObs.observe(el);
        });
      }

      return function () {
        if (unbindScroll) unbindScroll();
        else window.removeEventListener("scroll", onScroll);
        header.classList.remove(
          "site-header--top",
          "site-header--scrolled",
          "site-header--on-dark",
          "site-header--on-work"
        );
      };
    },
  });
})();
