/**
 * Work peek — scroll-linked frame swap + in-view ticker (index #work).
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

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

  function frameCount(peek) {
    var attr = peek.getAttribute("data-work-peek-frames");
    if (attr) {
      var n = parseInt(attr, 10);
      if (n > 0) return n;
    }
    return peek.querySelectorAll(".wp-work-peek__frame").length;
  }

  function mobilePeekMode() {
    return window.matchMedia("(max-width: 899px)").matches;
  }

  function setActiveFrame(peek, index) {
    var frames = peek.querySelectorAll(".wp-work-peek__frame");
    var i;
    for (i = 0; i < frames.length; i++) {
      frames[i].classList.toggle("is-active", i === index);
    }
  }

  function scrollProgress(caseEl) {
    var rect = caseEl.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var lead = vh * 0.12;
    var trail = vh * 0.12;
    var span = rect.height + lead + trail;
    if (span <= 0) return 0;
    return clamp((vh * 0.5 + lead - rect.top) / span, 0, 1);
  }

  WPM.register("work-peek", {
    layer: 1,
    init: function (work, ctx) {
      if (!work) return;

      var peeks = work.querySelectorAll(".wp-work-peek");
      if (!peeks.length) return;

      var reduced = ctx.reduced;
      var updaters = [];
      var teardowns = [];
      var i;

      for (i = 0; i < peeks.length; i++) {
        (function (peek) {
          var caseEl = peek.closest(".wp-project-case");
          if (!caseEl) return;

          var count = frameCount(peek);
          if (count < 1) return;

          setActiveFrame(peek, 0);

          if (count === 1 || reduced) {
            return;
          }

          var tickerTimer = null;
          var tickerOn = false;
          var scrollIndex = 0;

          function applyIndex(idx) {
            scrollIndex = idx;
            setActiveFrame(peek, idx);
          }

          function updateFromScroll() {
            if (ctx.paused || !mobilePeekMode()) return;
            var p = scrollProgress(caseEl);
            var idx = Math.min(count - 1, Math.floor(p * count));
            if (idx !== scrollIndex) applyIndex(idx);
          }

          function stopTicker() {
            tickerOn = false;
            if (tickerTimer) {
              window.clearInterval(tickerTimer);
              tickerTimer = null;
            }
          }

          function startTicker() {
            if (reduced || count < 2 || tickerOn || !mobilePeekMode()) return;
            tickerOn = true;
            tickerTimer = window.setInterval(function () {
              if (ctx.paused) return;
              var next = (scrollIndex + 1) % count;
              applyIndex(next);
            }, 4500);
          }

          peek.addEventListener("pointerenter", stopTicker);
          peek.addEventListener("pointerleave", function () {
            if (caseEl.classList.contains("is-visible") && mobilePeekMode()) startTicker();
          });

          if ("IntersectionObserver" in window) {
            var obs = new IntersectionObserver(
              function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                    startTicker();
                  } else {
                    stopTicker();
                  }
                });
              },
              { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
            );
            obs.observe(caseEl);
            teardowns.push(function () {
              obs.disconnect();
            });
          }

          teardowns.push(stopTicker);
          updaters.push(updateFromScroll);
        })(peeks[i]);
      }

      if (reduced || !updaters.length) return;

      function onScroll() {
        if (!mobilePeekMode()) return;
        var j;
        for (j = 0; j < updaters.length; j++) updaters[j]();
      }

      var unbind = bindScroll(onScroll);
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();

      return function () {
        if (unbind) unbind();
        window.removeEventListener("resize", onScroll);
        var k;
        for (k = 0; k < teardowns.length; k++) teardowns[k]();
      };
    },
  });
})();
