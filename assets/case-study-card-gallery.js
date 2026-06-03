/**
 * Case card gallery — sticky stage + evidence rail (WDS spec v3).
 * Scan: story + wireframe. Depth: evidence rail between story and wireframe.
 */
(function () {
  var root = document.querySelector("[data-case-card-gallery]");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;
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
  var holdReleasePastGallery = false;

  function evidenceRail(slide) {
    return slide && slide.querySelector("[data-evidence-rail]");
  }

  function evidenceScroll(slide) {
    var rail = evidenceRail(slide);
    return rail && rail.querySelector("[data-evidence-rail-scroll]");
  }

  function evidenceTrigger(slide) {
    return slide && slide.querySelector("[data-evidence-trigger]");
  }

  function isRailOpen(slide) {
    return !!(slide && slide.classList.contains("is-evidence-open"));
  }

  function openRail(slide, focusRail) {
    var rail = evidenceRail(slide);
    if (!rail) return;
    rail.removeAttribute("hidden");
    slide.classList.add("is-evidence-open");
    rail.classList.add("is-open");
    var trigger = evidenceTrigger(slide);
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (focusRail) {
      var scroll = evidenceScroll(slide);
      if (scroll) scroll.focus({ preventScroll: true });
    }
  }

  function closeRail(slide) {
    if (!slide) return;
    var rail = evidenceRail(slide);
    slide.classList.remove("is-evidence-open");
    if (rail) {
      rail.classList.remove("is-open");
      rail.setAttribute("hidden", "");
    }
    var trigger = evidenceTrigger(slide);
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
      if (document.activeElement && rail && rail.contains(document.activeElement)) {
        trigger.focus({ preventScroll: true });
      }
    }
  }

  function applyDefaultRail(slide) {
    if (slide && slide.hasAttribute("data-evidence-default-open")) {
      openRail(slide, false);
    } else {
      closeRail(slide);
    }
  }

  function closeAllRails() {
    slides.forEach(closeRail);
  }

  root.querySelectorAll("[data-evidence-trigger]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var slide = btn.closest("[data-case-gallery-slide]");
      if (!slide) return;
      if (isRailOpen(slide)) closeRail(slide);
      else openRail(slide, true);
    });
  });

  root.querySelectorAll("[data-evidence-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var slide = btn.closest("[data-case-gallery-slide]");
      closeRail(slide);
    });
  });

  var shell = root.querySelector("[data-case-card-shell]");

  function positionExitBtn() {
    if (!shell || !exitBtn.classList.contains("is-visible")) return;
    var rect = shell.getBoundingClientRect();
    var top = Math.max(12, rect.top + 12);
    var right = Math.max(12, window.innerWidth - rect.right + 12);
    exitBtn.style.top = top + "px";
    exitBtn.style.right = right + "px";
  }

  function setExitVisible(on) {
    if (!exitBtn) return;
    exitBtn.hidden = !on;
    exitBtn.classList.toggle("is-visible", on);
    exitBtn.setAttribute("aria-hidden", on ? "false" : "true");
    if (on) positionExitBtn();
    else {
      exitBtn.style.top = "";
      exitBtn.style.right = "";
    }
  }

  function setStageActive(on) {
    document.body.classList.toggle(BODY_CLASS, on);
    root.classList.toggle("is-stage-active", on);
    setExitVisible(on);
    if (on) {
      var h = pin.offsetHeight || window.innerHeight;
      spacer.style.height = h + "px";
      pin.classList.add("is-pinned");
      positionExitBtn();
    } else {
      spacer.style.height = "0";
      pin.classList.remove("is-pinned");
    }
  }

  function exitShowcase() {
    closeAllRails();
    lockUntil = 0;
    transitioning = false;
    wasStageActive = false;
    holdReleasePastGallery = true;
    setStageActive(false);
  }

  function exitGalleryToTop() {
    exitShowcase();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  function isInsideGalleryStage(target) {
    if (!target || !target.closest) return false;
    if (root.contains(target)) return true;
    if (exitBtn.contains(target)) return true;
    return false;
  }

  function runwayFullyAboveViewport() {
    var rect = runway.getBoundingClientRect();
    return rect.bottom < window.innerHeight * 0.25;
  }

  var exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.className = "case-gallery-exit";
  exitBtn.hidden = true;
  exitBtn.setAttribute("aria-hidden", "true");
  exitBtn.setAttribute("aria-label", "Exit gallery showcase");
  exitBtn.innerHTML = '<span class="case-gallery-exit__icon" aria-hidden="true">&times;</span>';
  exitBtn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    exitShowcase();
  });
  document.body.appendChild(exitBtn);

  document.addEventListener(
    "click",
    function (ev) {
      if (!document.body.classList.contains(BODY_CLASS)) return;
      if (isInsideGalleryStage(ev.target)) return;
      exitShowcase();
    },
    true
  );

  function setActive(idx, animate) {
    if (idx !== activeIdx) closeRail(slides[activeIdx]);
    activeIdx = Math.max(0, Math.min(count - 1, idx));
    slides.forEach(function (slide, i) {
      var on = i === activeIdx;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
      if (!on) closeRail(slide);
    });
    applyDefaultRail(slides[activeIdx]);
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
    /* One vh scroll segment per beat transition; +0.35 vh finale padding before CTA */
    var runwayMult = Math.max(1, count + 0.35);
    runway.style.height = Math.round(vh * runwayMult) + "px";
  }

  function isStageActive() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    return rect.top <= 1 && rect.bottom > vh * 0.15;
  }

  function runwayScrollProgress() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrollable = Math.max(1, runway.offsetHeight - vh);
    var scrolled = Math.max(0, -rect.top);
    return Math.max(0, Math.min(1, scrolled / scrollable));
  }

  function indexFromRunway() {
    return Math.round(runwayScrollProgress() * (count - 1));
  }

  function shouldReleaseToCta() {
    if (activeIdx < count - 1) return false;
    /* Last beat must be fully earned on the runway before handoff to CTA */
    return runwayScrollProgress() >= 0.94;
  }

  function releaseGalleryStage() {
    exitShowcase();
  }

  function runwayScrollTopForIndex(idx) {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrollable = Math.max(1, runway.offsetHeight - vh);
    var progress = count <= 1 ? 0 : idx / (count - 1);
    return window.scrollY + rect.top + progress * scrollable;
  }

  function scrollRunwayToIndex(idx, behavior) {
    var top = runwayScrollTopForIndex(idx);
    if (behavior === "smooth" && window.WPLenis && window.WPLenis.ready) {
      window.WPLenis.scrollTo(top, { duration: 0.95 });
      return;
    }
    window.scrollTo({
      top: top,
      behavior: behavior || "auto",
    });
  }

  function scrollRailByDelta(deltaY) {
    var scroll = evidenceScroll(slides[activeIdx]);
    if (!scroll) return "empty";
    var max = scroll.scrollHeight - scroll.clientHeight;
    if (max <= 0) return "empty";
    var atTop = scroll.scrollTop <= 0;
    var atBottom = scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 1;
    if (deltaY < 0 && atTop) return "top";
    if (deltaY > 0 && atBottom) return "bottom";
    scroll.scrollTop = Math.max(0, Math.min(max, scroll.scrollTop + deltaY));
    return "scrolled";
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
    if (holdReleasePastGallery) {
      setStageActive(false);
      if (isStageActive()) holdReleasePastGallery = false;
      else if (runwayFullyAboveViewport()) holdReleasePastGallery = false;
      else return;
    }
    var active = isStageActive();
    setStageActive(active);
    if (!active) {
      wasStageActive = false;
      return;
    }
    if (transitioning) return;
    var idx = indexFromRunway();
    if (idx !== activeIdx) setActive(idx, !reduced);
    if (activeIdx === count - 1 && shouldReleaseToCta()) {
      releaseGalleryStage();
    }
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
    if (isRailOpen(slides[activeIdx])) {
      var railState = scrollRailByDelta(e.deltaY);
      if (railState === "top" && e.deltaY < 0 && activeIdx > 0) {
        e.preventDefault();
        advance(-1);
        return;
      }
      if (railState === "bottom" && e.deltaY > 0) {
        e.preventDefault();
        if (activeIdx < count - 1) advance(1);
        else releaseGalleryStage();
        return;
      }
      if (railState === "scrolled" || railState === "empty") {
        e.preventDefault();
      }
      return;
    }
    if (Math.abs(e.deltaY) < 2) return;
    if (Date.now() < lockUntil || transitioning) {
      e.preventDefault();
      return;
    }

    var dir = e.deltaY > 0 ? 1 : -1;
    if (dir > 0 && activeIdx >= count - 1) {
      if (shouldReleaseToCta()) releaseGalleryStage();
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
        lockUntil = Date.now() + COOLDOWN_MS;
        scrollRunwayToIndex(idx, reduced ? "auto" : "smooth");
        setActive(idx, true);
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "scroll",
    function () {
      if (exitBtn.classList.contains("is-visible")) positionExitBtn();
    },
    { passive: true }
  );
  window.addEventListener(
    "resize",
    function () {
      syncRunwayHeight();
      onScroll();
      if (exitBtn.classList.contains("is-visible")) positionExitBtn();
    },
    { passive: true }
  );
  syncRunwayHeight();

  if (!reduced && !coarse) {
    window.addEventListener("wheel", onWheel, { passive: false });
  }

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape" || !isStageActive()) return;
    if (isRailOpen(slides[activeIdx])) {
      ev.preventDefault();
      closeRail(slides[activeIdx]);
      return;
    }
    ev.preventDefault();
    exitShowcase();
  });

  if (shell && !reduced) {
    shell.addEventListener("keydown", function (ev) {
      if (!isStageActive()) return;
      if (isRailOpen(slides[activeIdx])) return;
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
