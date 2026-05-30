/**
 * WP Lenis — global smooth scroll (native scroll position, no extra wrapper).
 * Exposes WPScroll so motion modules sync to Lenis frames, not sparse window.scrollY.
 */
(function () {
  "use strict";

  var LenisCtor = typeof globalThis !== "undefined" && globalThis.Lenis;
  var WPM = window.WPMotion;
  var scrollSubs = [];
  var lenisInstance = null;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function isDisabled() {
    var body = document.body;
    if (!body) return true;
    if (body.getAttribute("data-wp-lenis") === "off") return true;
    try {
      var params = new URLSearchParams(window.location.search);
      if ((params.get("lenis") || "").toLowerCase() === "off") return true;
    } catch (_e) {}
    return false;
  }

  function isHomeIndex() {
    return document.body && document.body.classList.contains("home-page");
  }

  function readScrollPaddingTop() {
    var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return isNaN(pad) ? 0 : pad;
  }

  function isScrollableOverflow(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    var style = getComputedStyle(el);
    var oy = style.overflowY;
    var ox = style.overflowX;
    if (oy === "auto" || oy === "scroll") {
      if (el.scrollHeight > el.clientHeight + 1) return true;
    }
    if (ox === "auto" || ox === "scroll") {
      if (el.scrollWidth > el.clientWidth + 1) return true;
    }
    return false;
  }

  function markLenisPreventTargets() {
    var selectors = [
      "[data-evidence-rail-scroll]",
      "[data-lenis-prevent]",
      ".site-nav-dialog",
      ".case-study-scan__track",
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (el) {
      el.setAttribute("data-lenis-prevent", "");
    });
  }

  function getScrollY() {
    if (lenisInstance) return lenisInstance.scroll;
    return window.scrollY || window.pageYOffset || 0;
  }

  function emitScroll() {
    if (!lenisInstance) return;
    var detail = {
      y: lenisInstance.scroll,
      velocity: lenisInstance.velocity,
      direction: lenisInstance.direction,
      progress: lenisInstance.progress,
    };
    for (var i = 0; i < scrollSubs.length; i++) {
      try {
        scrollSubs[i](detail);
      } catch (err) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[wp-scroll] subscriber error:", err);
        }
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("wp-scroll", { detail: detail }));
    } catch (_evtErr) {
      /* IE11 guard — unused on this site */
    }
  }

  function onScroll(fn) {
    if (typeof fn !== "function") return function () {};
    scrollSubs.push(fn);
    if (!lenisInstance) {
      window.addEventListener("scroll", fn, { passive: true });
      return function off() {
        window.removeEventListener("scroll", fn);
        scrollSubs = scrollSubs.filter(function (cb) {
          return cb !== fn;
        });
      };
    }
    return function off() {
      scrollSubs = scrollSubs.filter(function (cb) {
        return cb !== fn;
      });
    };
  }

  window.WPScroll = {
    getY: getScrollY,
    on: onScroll,
    isSmooth: function () {
      return !!lenisInstance;
    },
  };

  function createLenis(ctx) {
    if (!LenisCtor || isDisabled()) return null;

    markLenisPreventTargets();

    var home = isHomeIndex();
    var lenis = new LenisCtor({
      lerp: home ? 0.068 : 0.085,
      wheelMultiplier: home ? 0.84 : 0.92,
      touchMultiplier: home ? 1 : 1.15,
      smoothWheel: true,
      syncTouch: home,
      syncTouchLerp: 0.075,
      autoRaf: false,
      prevent: function (node) {
        if (!node || !(node instanceof Element)) return false;
        if (node.closest("#hero, #main, .statement-viewport")) return false;
        if (node.closest("[data-lenis-prevent]")) return true;
        var el = node;
        while (el && el !== document.body) {
          if (isScrollableOverflow(el)) return true;
          el = el.parentElement;
        }
        return false;
      },
    });

    lenisInstance = lenis;

    var gsapMode = false;
    var rafId = 0;
    var onGsapTick = null;

    function headerOffset() {
      return -readScrollPaddingTop();
    }

    function scrollTo(target, opts) {
      if (!lenis) {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: opts && opts.immediate ? "auto" : "smooth" });
        } else if (target instanceof Element) {
          target.scrollIntoView({ behavior: opts && opts.immediate ? "auto" : "smooth" });
        }
        return;
      }
      var options = opts ? Object.assign({}, opts) : {};
      if (options.offset == null && typeof target !== "number") {
        options.offset = headerOffset();
      }
      lenis.scrollTo(target, options);
    }

    window.WPLenis = {
      ready: true,
      instance: lenis,
      scrollTo: scrollTo,
      stop: function () {
        lenis.stop();
      },
      start: function () {
        lenis.start();
      },
    };

    if (ctx) ctx.lenis = lenis;

    document.documentElement.classList.add("wp-lenis-active");
    if (home) document.body.classList.add("wp-lenis-index");

    lenis.on("scroll", emitScroll);

    if (window.gsap && window.ScrollTrigger) {
      gsapMode = true;
      lenis.on("scroll", window.ScrollTrigger.update);
      onGsapTick = function (time) {
        lenis.raf(time * 1000);
      };
      window.gsap.ticker.add(onGsapTick);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        if (a.getAttribute("data-lenis-anchor") === "skip") return;
        var raw = (a.getAttribute("href") || "").trim();
        if (!raw || raw === "#") return;
        var id;
        try {
          id = decodeURIComponent(raw.slice(1));
        } catch (_err) {
          return;
        }
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        if (a.target && a.target !== "_self" && a.target !== "") return;
        var url = new URL(a.href, window.location.href);
        if (
          url.pathname !== window.location.pathname &&
          url.pathname.replace(/\/$/, "") !== window.location.pathname.replace(/\/$/, "")
        ) {
          return;
        }
        e.preventDefault();
        scrollTo(target, { offset: headerOffset() });
        try {
          if (history.pushState) {
            history.pushState(null, "", "#" + id);
          } else {
            window.location.hash = id;
          }
        } catch (_err2) {
          window.location.hash = id;
        }
      },
      true
    );

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) lenis.stop();
      else lenis.start();
    });

    requestAnimationFrame(function () {
      var hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      var id;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch (_hashErr) {
        return;
      }
      var el = document.getElementById(id);
      if (el) scrollTo(el, { offset: headerOffset(), immediate: true });
    });

    if (ctx && typeof ctx.pause === "function") {
      var origPause = ctx.pause;
      var origResume = ctx.resume;
      ctx.pause = function () {
        origPause();
        lenis.stop();
      };
      ctx.resume = function () {
        origResume();
        lenis.start();
      };
    }

    emitScroll();

    requestAnimationFrame(function () {
      lenis.resize();
    });
    window.addEventListener(
      "load",
      function () {
        lenis.resize();
      },
      { once: true }
    );

    return function destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      if (gsapMode && window.gsap && onGsapTick) {
        window.gsap.ticker.remove(onGsapTick);
      }
      lenis.destroy();
      lenisInstance = null;
      scrollSubs = [];
      document.documentElement.classList.remove("wp-lenis-active");
      document.body.classList.remove("wp-lenis-index");
      if (window.WPLenis && window.WPLenis.instance === lenis) {
        window.WPLenis = null;
      }
    };
  }

  function bootStandalone() {
    if (prefersReducedMotion() || isDisabled() || !LenisCtor) return;
    if (document.querySelector('[data-wp-motion~="lenis-root"]')) return;
    createLenis({ reduced: false, paused: false, pause: function () {}, resume: function () {} });
  }

  if (WPM && typeof WPM.register === "function") {
    WPM.register("lenis-root", {
      layer: -1,
      init: function (_el, ctx) {
        if (ctx.reduced || isDisabled()) return;
        return createLenis(ctx);
      },
    });
  }

  document.addEventListener("DOMContentLoaded", bootStandalone);
})();
