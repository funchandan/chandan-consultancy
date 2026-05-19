/**
 * About experience — sticky nav + scroll-driven role cards (gallery runway pattern).
 */
(function () {
  var root = document.querySelector("[data-about-experience]");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  var runway = root.querySelector("[data-about-experience-runway]");
  var pin = root.querySelector("[data-about-experience-pin]");
  var track = root.querySelector("[data-about-experience-track]");
  var nav = root.querySelector("[data-about-experience-nav]");
  var slides = Array.prototype.slice.call(
    root.querySelectorAll("[data-about-experience-slide]")
  );
  if (!runway || !pin || !track || !slides.length) return;

  var spacer = document.createElement("div");
  spacer.className = "about-experience__pin-spacer";
  spacer.setAttribute("aria-hidden", "true");
  runway.insertBefore(spacer, pin);

  var count = slides.length;
  var activeIdx = 0;
  var lockUntil = 0;
  var transitioning = false;
  var wasStageActive = false;
  var COOLDOWN_MS = 720;
  var ENTRY_DWELL_MS = 480;
  var BODY_CLASS = "about-experience-stage-active";

  function setStageActive(on) {
    document.body.classList.toggle(BODY_CLASS, on);
    root.classList.toggle("is-stage-active", on);
    if (on) {
      var h = pin.offsetHeight || window.innerHeight;
      spacer.style.height = h + "px";
      pin.classList.add("is-pinned");
    } else {
      spacer.style.height = "0";
      pin.classList.remove("is-pinned");
    }
  }

  function setActive(idx, animate) {
    activeIdx = Math.max(0, Math.min(count - 1, idx));
    slides.forEach(function (slide, i) {
      var on = i === activeIdx;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    if (nav) {
      nav.querySelectorAll("[data-about-index]").forEach(function (control, i) {
        var on = i === activeIdx;
        control.classList.toggle("is-active", on);
        control.setAttribute("aria-current", on ? "true" : "false");
      });
    }
    if (reduced) return;
    track.style.transition = animate
      ? "transform 0.62s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    track.style.transform = "translate3d(0, " + -activeIdx * 100 + "%, 0)";
  }

  function stageStepHeight() {
    return Math.max(pin.offsetHeight || 0, 320);
  }

  function syncRunwayHeight() {
    runway.style.height = Math.round(stageStepHeight() * Math.max(1, count)) + "px";
  }

  function isStageActive() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    if (rect.top > 2) return false;
    var pinH = pin.offsetHeight || 320;
    /* Release before runway end so fixed pin does not cover CTA below */
    if (rect.bottom < pinH + Math.min(vh * 0.12, 96)) return false;
    return true;
  }

  function indexFromRunway() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrolled = Math.max(0, -rect.top);
    var scrollable = Math.max(1, runway.offsetHeight - vh);
    var progress = Math.max(0, Math.min(1, scrolled / scrollable));
    return Math.round(progress * (count - 1));
  }

  function runwayScrollTopForIndex(idx) {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrollable = Math.max(1, runway.offsetHeight - vh);
    var progress = count <= 1 ? 0 : idx / (count - 1);
    return window.scrollY + rect.top + progress * scrollable;
  }

  function scrollRunwayToIndex(idx, behavior) {
    window.scrollTo({
      top: runwayScrollTopForIndex(idx),
      behavior: behavior || "auto",
    });
  }

  function advance(dir) {
    var next = activeIdx + dir;
    if (next < 0 || next >= count) return false;
    scrollRunwayToIndex(next, reduced ? "auto" : "smooth");
    setActive(next, true);
    lockUntil = Date.now() + COOLDOWN_MS;
    transitioning = true;
    window.setTimeout(function () {
      transitioning = false;
    }, COOLDOWN_MS);
    return true;
  }

  function onScroll() {
    var active = isStageActive();
    setStageActive(active);
    if (!active) {
      wasStageActive = false;
      return;
    }
    if (transitioning) return;
    var idx = indexFromRunway();
    if (idx !== activeIdx) setActive(idx, !reduced);
  }

  function onWheel(e) {
    if (!isStageActive()) {
      wasStageActive = false;
      return;
    }
    if (!wasStageActive) {
      wasStageActive = true;
      lockUntil = Math.max(lockUntil, Date.now() + ENTRY_DWELL_MS);
    }
    if (Math.abs(e.deltaY) < 2) return;
    if (Date.now() < lockUntil || transitioning) {
      e.preventDefault();
      return;
    }

    var dir = e.deltaY > 0 ? 1 : -1;
    if (dir > 0 && activeIdx >= count - 1) {
      lockUntil = 0;
      return;
    }
    if (dir < 0 && activeIdx <= 0) {
      lockUntil = 0;
      return;
    }

    e.preventDefault();
    advance(dir);
  }

  if (nav) {
    nav.querySelectorAll("[data-about-index]").forEach(function (control) {
      control.addEventListener("click", function (ev) {
        ev.preventDefault();
        var idx = parseInt(control.getAttribute("data-about-index"), 10);
        if (isNaN(idx)) return;
        lockUntil = Date.now() + COOLDOWN_MS;
        scrollRunwayToIndex(idx, reduced ? "auto" : "smooth");
        setActive(idx, true);
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    function () {
      syncRunwayHeight();
      onScroll();
    },
    { passive: true }
  );
  syncRunwayHeight();

  if (!reduced && !coarse) {
    window.addEventListener("wheel", onWheel, { passive: false });
  }

  var shell = root.querySelector("[data-about-experience-shell]");
  if (shell && !reduced) {
    shell.addEventListener("keydown", function (ev) {
      if (!isStageActive()) return;
      if (ev.key === "ArrowDown" || ev.key === "PageDown") {
        ev.preventDefault();
        advance(1);
      } else if (ev.key === "ArrowUp" || ev.key === "PageUp") {
        ev.preventDefault();
        advance(-1);
      }
    });
  }

  if (reduced) {
    slides.forEach(function (slide) {
      slide.setAttribute("aria-hidden", "false");
    });
  }

  setActive(0, false);
  onScroll();
})();
