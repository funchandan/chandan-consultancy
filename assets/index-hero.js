/*!
 * index-hero.js — Hero v2 reveal + credibility count-up
 * Tokens: styles.css :root; type roles per design-system-typography-tokens.md
 */
(function () {
  "use strict";

  var heroRoot = document.querySelector(".hero-home");
  var hero = document.querySelector(".hero-v2");
  var cred = document.querySelector("[data-hero-cred]");
  if (!hero) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startHeroMotion() {
    if (!hero || reduced) {
      if (hero) hero.classList.add("hero-v2--static");
      return;
    }
    hero.classList.add("hero-v2--js");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        hero.classList.add("hero-v2--play");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHeroMotion);
  } else {
    startHeroMotion();
  }

  if (!cred) return;

  var counters = cred.querySelectorAll("[data-count]");
  if (!counters.length) return;

  function setFinalValues() {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;
      el.textContent = String(target) + suffix;
    });
  }

  if (reduced) {
    setFinalValues();
    return;
  }

  var animated = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounters() {
    if (animated) return;
    animated = true;
    var duration = 1100;
    var start = performance.now();
    var specs = [];
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;
      specs.push({ el: el, target: target, suffix: suffix });
    });

    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = easeOutCubic(t);
      specs.forEach(function (spec) {
        spec.el.textContent = String(Math.round(spec.target * eased)) + spec.suffix;
      });
      if (t < 1) requestAnimationFrame(tick);
      else setFinalValues();
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    setFinalValues();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          io.disconnect();
        }
      });
    },
    { threshold: [0, 0.2, 0.35] }
  );
  io.observe(cred);

  if (heroRoot && "IntersectionObserver" in window && !reduced) {
    var heroIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !hero.classList.contains("hero-v2--play")) {
            startHeroMotion();
          }
        });
      },
      { threshold: 0.1 }
    );
    heroIo.observe(heroRoot);
  }
})();
