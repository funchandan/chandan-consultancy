/**
 * Case card gallery — sticky stage v2 + Option B detail expand.
 * Hero scrolls normally → gallery pins to 100dvh → one beat per scroll step → CTA.
 * Detail expand: left column only; wireframe fixed; no inner scroll.
 */
(function () {
  var root = document.querySelector("[data-case-card-gallery]");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var runway = root.querySelector("[data-case-gallery-runway]");
  var pin = root.querySelector("[data-case-gallery-pin]");
  var track = root.querySelector("[data-case-card-track]");
  var nav = root.querySelector("[data-case-gallery-nav]");
  var slides = Array.prototype.slice.call(
    root.querySelectorAll("[data-case-gallery-slide]")
  );
  if (!runway || !pin || !track || !slides.length) return;

  var spacer = document.createElement("div");
  spacer.className = "case-card-gallery__pin-spacer";
  spacer.setAttribute("aria-hidden", "true");
  runway.insertBefore(spacer, pin);

  var count = slides.length;
  var activeIdx = 0;
  var lockUntil = 0;
  var transitioning = false;
  var wasStageActive = false;
  var COOLDOWN_MS = 720;
  var ENTRY_DWELL_MS = 480;
  var BODY_CLASS = "case-gallery-stage-active";

  function slideDetail(slide) {
    return slide && slide.querySelector("[data-card-body-detail]");
  }

  function collapseDetail(slide) {
    if (!slide) return;
    var btn = slide.querySelector("[data-card-read-more]");
    var detail = slideDetail(slide);
    slide.classList.remove("is-detail-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (detail) {
      detail.hidden = true;
      detail.classList.remove("is-open");
    }
  }

  function isDetailOpen() {
    var slide = slides[activeIdx];
    var detail = slide && slideDetail(slide);
    return !!(detail && !detail.hidden && detail.classList.contains("is-open"));
  }

  root.querySelectorAll("[data-card-read-more]").forEach(function (btn) {
    var slide = btn.closest("[data-case-gallery-slide]");
    var detail = slide && slideDetail(slide);
    if (!detail) return;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      if (open) {
        collapseDetail(slide);
      } else {
        btn.setAttribute("aria-expanded", "true");
        detail.hidden = false;
        detail.classList.add("is-open");
        slide.classList.add("is-detail-open");
      }
    });
  });

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
    if (idx !== activeIdx) collapseDetail(slides[activeIdx]);
    activeIdx = Math.max(0, Math.min(count - 1, idx));
    slides.forEach(function (slide, i) {
      var on = i === activeIdx;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    if (nav) {
      nav.querySelectorAll("[data-gallery-index]").forEach(function (control, i) {
        var on = i === activeIdx;
        control.classList.toggle("is-active", on);
        if (control.tagName === "BUTTON") {
          control.setAttribute("aria-current", on ? "true" : "false");
        }
      });
    }
    if (reduced) return;
    track.style.transition = animate
      ? "transform 0.62s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    track.style.transform = "translate3d(0, " + -activeIdx * 100 + "%, 0)";
  }

  function syncRunwayHeight() {
    var vh = window.innerHeight;
    runway.style.height = Math.round(vh * Math.max(1, count)) + "px";
  }

  function isStageActive() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    return rect.top <= 1 && rect.bottom > vh * 0.15;
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
    if (isDetailOpen()) collapseDetail(slides[activeIdx]);
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
    if (transitioning || isDetailOpen()) return;
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
    if (isDetailOpen()) {
      e.preventDefault();
      return;
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
    nav.querySelectorAll("[data-gallery-index]").forEach(function (control) {
      control.addEventListener("click", function (ev) {
        ev.preventDefault();
        var idx = parseInt(control.getAttribute("data-gallery-index"), 10);
        if (isNaN(idx)) return;
        if (isDetailOpen()) collapseDetail(slides[activeIdx]);
        lockUntil = Date.now() + COOLDOWN_MS;
        scrollRunwayToIndex(idx, reduced ? "auto" : "smooth");
        setActive(idx, true);
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    syncRunwayHeight();
    onScroll();
  }, { passive: true });
  syncRunwayHeight();

  if (!reduced && !window.matchMedia("(pointer: coarse)").matches) {
    window.addEventListener("wheel", onWheel, { passive: false });
  }

  var shell = root.querySelector("[data-case-card-shell]");
  if (shell && !reduced) {
    shell.addEventListener("keydown", function (ev) {
      if (!isStageActive() || isDetailOpen()) return;
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
