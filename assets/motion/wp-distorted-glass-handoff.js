/**
 * DistortedGlass handoff — Cult UI seam strip + top frost band; content scrolls behind.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var SEAM_OVERLAP = 17;

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

  function readCssLengthPx(varName, fallback) {
    var raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!raw) return fallback;
    var probe = document.createElement("div");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.height = raw;
    document.body.appendChild(probe);
    var h = probe.offsetHeight;
    document.body.removeChild(probe);
    return h > 0 ? h : fallback;
  }

  function buildParallaxGrid(container) {
    var grid = document.createElement("div");
    grid.className = "wp-distorted-glass-parallax__grid";
    var i;
    for (i = 0; i < 64; i += 1) {
      var row = Math.floor(i / 8);
      var col = i % 8;
      var sq = document.createElement("div");
      sq.className = "wp-distorted-glass-parallax__square";
      sq.style.animationDelay = (row + col) * 0.1 + "s";
      grid.appendChild(sq);
    }
    container.appendChild(grid);
  }

  function buildParallaxLines(container) {
    var wrap = document.createElement("div");
    wrap.className = "wp-distorted-glass-parallax__lines";
    var i;
    for (i = 0; i < 20; i += 1) {
      var line = document.createElement("div");
      line.className = "wp-distorted-glass-parallax__line";
      line.style.top = i * 5 + "%";
      line.style.animationDelay = i * 0.1 + "s";
      wrap.appendChild(line);
    }
    container.appendChild(wrap);
  }

  function buildParallaxRings(container) {
    var wrap = document.createElement("div");
    wrap.className = "wp-distorted-glass-parallax__rings";
    var j;
    for (j = 0; j < 5; j += 1) {
      var ring = document.createElement("div");
      ring.className = "wp-distorted-glass-parallax__ring";
      wrap.appendChild(ring);
    }
    container.appendChild(wrap);
  }

  WPM.register("distorted-glass-handoff", {
    layer: 2,
    init: function (_body, ctx) {
      if (!document.body.classList.contains("home-page--product")) return;

      var strip = document.querySelector("[data-distorted-glass-strip]");
      var frost = document.querySelector("[data-distorted-glass-frost]");
      var hero = document.getElementById("hero");
      var nav = document.querySelector(".site-header");
      var parallaxHost = document.querySelector("[data-distorted-glass-parallax-host]");
      var parallax = document.querySelector("[data-distorted-glass-parallax]");
      if (!strip || !frost || !hero) return;

      var root = document.documentElement;
      var turbulence = document.querySelector("#wp-fractal-noise-glass feTurbulence");
      var displacement = document.querySelector("#wp-fractal-noise-glass feDisplacementMap");
      var unbindScroll = null;
      var ro = null;
      var stripHeightPx = readCssLengthPx("--dg-strip-height", 192);

      if (parallax && !parallax.dataset.built) {
        parallax.dataset.built = "1";
        var tierSlow = document.createElement("div");
        tierSlow.className = "wp-distorted-glass-parallax__tier wp-distorted-glass-parallax__tier--slow";
        buildParallaxRings(tierSlow);
        var tierMid = document.createElement("div");
        tierMid.className = "wp-distorted-glass-parallax__tier wp-distorted-glass-parallax__tier--mid";
        var tierFast = document.createElement("div");
        tierFast.className = "wp-distorted-glass-parallax__tier wp-distorted-glass-parallax__tier--fast";
        buildParallaxLines(tierFast);
        parallax.appendChild(tierSlow);
        parallax.appendChild(tierMid);
        parallax.appendChild(tierFast);
      }

      function syncLayout() {
        var heroRect = hero.getBoundingClientRect();
        var vh = window.innerHeight;
        var navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
        var handoff = clamp(1 - heroRect.bottom / vh, 0, 1);
        var main = document.getElementById("main");
        var postHeroActive = handoff > 0.02;

        stripHeightPx = readCssLengthPx("--dg-strip-height", 192);

        if (parallaxHost && main) {
          parallaxHost.style.top = hero.offsetHeight + "px";
          parallaxHost.style.height = Math.max(0, main.offsetHeight - hero.offsetHeight) + "px";
        }

        var stripTop;
        if (heroRect.bottom <= navBottom) {
          stripTop = navBottom;
        } else {
          stripTop = clamp(heroRect.bottom, navBottom, vh);
        }

        var frostTop = Math.max(stripTop + stripHeightPx - SEAM_OVERLAP, navBottom);

        root.style.setProperty("--dg-strip-top", stripTop.toFixed(2) + "px");
        root.style.setProperty("--dg-frost-top", frostTop.toFixed(2) + "px");
        root.style.setProperty("--dg-handoff-progress", handoff.toFixed(4));
        root.style.setProperty("--dg-frost-opacity", (0.55 + handoff * 0.4).toFixed(3));

        strip.classList.toggle("is-active", postHeroActive);
        frost.classList.toggle("is-active", postHeroActive);

        if (!ctx.reduced && turbulence && displacement) {
          var freq = 0.1 + handoff * 0.04;
          turbulence.setAttribute("baseFrequency", freq.toFixed(3) + " " + freq.toFixed(3));
          displacement.setAttribute("scale", String(Math.round(18 + handoff * 18)));
        }

        var heroDocBottom = hero.offsetTop + hero.offsetHeight;
        var scrollY = window.scrollY || window.pageYOffset || 0;
        var postScroll = Math.max(0, scrollY + vh - heroDocBottom);

        root.style.setProperty("--dg-parallax-slow", (postScroll * 0.12).toFixed(2) + "px");
        root.style.setProperty("--dg-parallax-mid", (postScroll * 0.22).toFixed(2) + "px");
        root.style.setProperty("--dg-parallax-fast", (postScroll * 0.32).toFixed(2) + "px");
      }

      root.classList.add("wp-distorted-glass-ready");
      syncLayout();
      unbindScroll = bindScroll(syncLayout);

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(syncLayout);
        ro.observe(hero);
        if (nav) ro.observe(nav);
        if (parallaxHost) ro.observe(parallaxHost);
      } else {
        window.addEventListener("resize", syncLayout);
      }

      return function teardown() {
        if (unbindScroll) unbindScroll();
        if (ro) ro.disconnect();
        else window.removeEventListener("resize", syncLayout);
        root.classList.remove("wp-distorted-glass-ready");
        strip.classList.remove("is-active");
        frost.classList.remove("is-active");
        root.style.removeProperty("--dg-strip-top");
        root.style.removeProperty("--dg-frost-top");
        root.style.removeProperty("--dg-handoff-progress");
        root.style.removeProperty("--dg-frost-opacity");
        root.style.removeProperty("--dg-parallax-slow");
        root.style.removeProperty("--dg-parallax-mid");
        root.style.removeProperty("--dg-parallax-fast");
      };
    },
  });
})();
