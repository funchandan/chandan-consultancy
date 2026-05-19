/**
 * Hero wireframe ticker — autoscroll; pause on hover, resume on leave.
 * Works standalone ([data-hero-ticker]) or inside A/B chrome ([data-hero-ab]).
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.querySelector("[data-hero-ab]");
  var ticker = document.querySelector("[data-hero-ticker]");
  if (!ticker) return;

  var track = ticker.querySelector("[data-hero-ticker-track]");
  var rafId = null;
  var paused = false;
  var offset = 0;
  var speed = 0.54;

  function tick() {
    if (!track || reduced) return;
    if (!paused) {
      offset -= speed;
      var half = track.scrollWidth / 2;
      if (half > 0 && Math.abs(offset) >= half) offset = 0;
      track.style.transform = "translate3d(" + offset + "px, 0, 0)";
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function startTicker() {
    if (!track || reduced) return;
    stopTicker();
    rafId = window.requestAnimationFrame(tick);
  }

  function stopTicker() {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function bindHover() {
    ticker.addEventListener("pointerenter", function () {
      paused = true;
    });
    ticker.addEventListener("pointerleave", function () {
      paused = false;
      if (!rafId) startTicker();
    });
    ticker.addEventListener("mouseenter", function () {
      paused = true;
    });
    ticker.addEventListener("mouseleave", function () {
      paused = false;
      if (!rafId) startTicker();
    });
  }

  function initStandalone() {
    if (!reduced) startTicker();
  }

  function initAb() {
    var params = new URLSearchParams(window.location.search);
    var paramVariant = params.get("hero");
    var stored = sessionStorage.getItem("case-hero-variant");
    var defaultVariant = root.getAttribute("data-hero-default") || "devices";
    var active = paramVariant || stored || defaultVariant;
    if (active !== "devices" && active !== "ticker") active = "devices";

    var panels = root.querySelectorAll("[data-hero-panel]");
    var buttons = root.querySelectorAll("[data-hero-variant]");

    function setVariant(name) {
      sessionStorage.setItem("case-hero-variant", name);
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-hero-panel") !== name;
      });
      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-hero-variant") === name;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.classList.toggle("is-active", on);
      });
      if (name === "ticker" && !reduced) startTicker();
      else stopTicker();
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setVariant(btn.getAttribute("data-hero-variant"));
      });
    });
    setVariant(active);
  }

  function init() {
    bindHover();
    if (root) initAb();
    else initStandalone();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
