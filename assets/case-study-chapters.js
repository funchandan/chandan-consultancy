/**
 * Case study chapters — pinned artefact (B) with page-flip copy transitions.
 * Scroll in the runway drives chapter index; wheel advances one chapter at a time
 * while sticky stage stays fixed (content crossfades, not a scrolling document feel).
 */
(function () {
  var root = document.querySelector("[data-case-chapters]");
  if (!root) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var runway = root.querySelector("[data-case-chapters-runway]");
  var sticky = root.querySelector("[data-case-chapters-sticky]");
  if (!runway || !sticky) return;

  var panels = Array.prototype.slice.call(
    root.querySelectorAll("[data-chapter-panel]")
  );
  var artefacts = Array.prototype.slice.call(
    root.querySelectorAll("[data-chapter-artefact]")
  );
  var spineBtns = Array.prototype.slice.call(
    root.querySelectorAll("[data-chapter-jump]")
  );
  var status = root.querySelector("[data-chapter-status]");
  var count = panels.length;
  if (!count) return;

  var activeIdx = 0;
  var lockUntil = 0;
  var transitioning = false;
  var COOLDOWN_MS = 950;
  var TRANSITION_MS = 880;
  var ENTRY_DWELL_MS = 650;
  var wasStageActive = false;
  var touchStartY = null;

  if (reduced) {
    root.classList.add("case-scan-chapters--reduced");
    panels.forEach(function (p, i) {
      setPanelState(p, i === 0, false);
    });
    bindSpine();
    return;
  }

  preloadArtefacts();
  setChapter(0, false);
  bindSpine();

  function preloadArtefacts() {
    artefacts.forEach(function (slide) {
      var img = slide.querySelector("img.case-scan-story__img");
      if (!img || !img.getAttribute("src")) return;
      var pre = new Image();
      pre.src = img.getAttribute("src");
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (transitioning) return;
      var idx = indexFromRunway();
      if (idx !== activeIdx) {
        setChapter(idx, true);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", syncRunwayHeight, { passive: true });
  syncRunwayHeight();

  if (!window.matchMedia("(pointer: coarse)").matches) {
    window.addEventListener("wheel", onWheel, { passive: false });
  }

  sticky.addEventListener("touchstart", onTouchStart, { passive: true });
  sticky.addEventListener("touchend", onTouchEnd, { passive: true });
  sticky.addEventListener("keydown", onKeydown);

  function syncRunwayHeight() {
    var vh = window.innerHeight;
    var steps = Math.max(1, count);
    runway.style.height = Math.round(vh * steps) + "px";
  }

  function isStageActive() {
    var rect = runway.getBoundingClientRect();
    return rect.top <= 1 && rect.bottom >= window.innerHeight * 0.5;
  }

  function indexFromRunway() {
    var rect = runway.getBoundingClientRect();
    var vh = window.innerHeight;
    var scrolled = Math.max(0, -rect.top);
    var scrollable = Math.max(1, rect.height - vh);
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
    var top = runwayScrollTopForIndex(idx);
    if (behavior === "smooth" && window.WPLenis && window.WPLenis.ready) {
      window.WPLenis.scrollTo(top, { duration: 0.95 });
      return;
    }
    window.scrollTo({ top: top, behavior: behavior || "auto" });
  }

  function bindSpine() {
    spineBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-chapter-jump"), 10);
        if (isNaN(idx)) return;
        scrollRunwayToIndex(idx, "smooth");
        setChapter(idx, true);
        lockUntil = Date.now() + COOLDOWN_MS;
      });
    });
  }

  function setPanelState(panel, on, animate) {
    panel.classList.toggle("is-active", on);
    panel.classList.toggle("is-exiting", false);
    panel.setAttribute("aria-hidden", on ? "false" : "true");
  }

  function setChapter(idx, animate) {
    idx = Math.max(0, Math.min(count - 1, idx));
    if (idx === activeIdx && animate) return;

    var prev = activeIdx;
    activeIdx = idx;

    if (!animate || reduced) {
      panels.forEach(function (p, i) {
        setPanelState(p, i === idx, false);
      });
      artefacts.forEach(function (a, i) {
        a.classList.toggle("is-active", i === idx);
      });
      updateChrome(idx);
      return;
    }

    transitioning = true;
    var outPanel = panels[prev];
    var inPanel = panels[idx];

    outPanel.classList.add("is-exiting");
    outPanel.classList.remove("is-active");
    outPanel.setAttribute("aria-hidden", "true");

    inPanel.classList.add("is-entering", "is-active");
    inPanel.setAttribute("aria-hidden", "false");

    artefacts.forEach(function (a, i) {
      a.classList.toggle("is-active", i === idx);
    });
    updateChrome(idx);

    window.setTimeout(function () {
      outPanel.classList.remove("is-exiting");
      setPanelState(outPanel, false, true);
      inPanel.classList.remove("is-entering");
      transitioning = false;
    }, TRANSITION_MS);
  }

  function updateChrome(idx) {
    var panel = panels[idx];
    var step = panel.getAttribute("data-story-step") || String(idx + 1);
    var titleEl = panel.querySelector(".case-scan-story__title");
    var title = titleEl
      ? titleEl.textContent.replace(/\s+/g, " ").trim()
      : "";
    if (status) {
      status.textContent = "Step " + step + " · " + title;
    }
    spineBtns.forEach(function (btn, i) {
      var on = i === idx;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "step" : "false");
    });
  }

  function advance(dir) {
    var next = activeIdx + dir;
    if (next < 0 || next >= count) return false;
    scrollRunwayToIndex(next, "auto");
    setChapter(next, true);
    lockUntil = Date.now() + COOLDOWN_MS;
    return true;
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

  function onTouchStart(e) {
    if (!isStageActive()) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (touchStartY === null) return;
    if (!isStageActive() || Date.now() < lockUntil || transitioning) {
      touchStartY = null;
      return;
    }
    var dy = touchStartY - e.changedTouches[0].clientY;
    touchStartY = null;
    if (Math.abs(dy) < 36) return;
    var dir = dy > 0 ? 1 : -1;
    if (dir > 0 && activeIdx >= count - 1) return;
    if (dir < 0 && activeIdx <= 0) return;
    advance(dir);
  }

  function onKeydown(e) {
    if (!isStageActive()) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      advance(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      advance(-1);
    }
  }
})();
