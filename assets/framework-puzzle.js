/* ============================================================================
 * Polaroid Puzzle Framework Module — behavior layer
 *
 * Locked specs:
 *   - PRD:        _bmad-output/planning-artifacts/prd-interactive-framework-module.md
 *   - UX:         _bmad-output/planning-artifacts/ux-design-spec-framework-module.md
 *   - Microcopy:  _bmad-output/planning-artifacts/framework-module-microcopy-spec.md
 *
 * Budget: <30 KB minified+gzip. Vanilla ES2018, no dependencies.
 * ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY_TIER = "framework-tier";
  var TIERS = ["founder", "operator", "architect"];
  var STEP_LABELS = {
    1: "Map the system",
    2: "Commit the bet",
    3: "Ship the spine first",
    4: "The receipts",
    5: "Now run it on your thing"
  };

  /* -------------------------------------------------------------------------
   * Reel capability gate — must run synchronously before init() so the
   * .reel-ok class is on <html> when CSS evaluates and when init() reads it.
   * Vertical fallback survives if any check fails: reduced motion, no hover,
   * small screen, no sticky support.
   * ------------------------------------------------------------------------- */
  (function applyReelCapability() {
    if (!window.matchMedia || !window.CSS || !window.CSS.supports) return;
    var stickyOk = window.CSS.supports("position", "sticky") ||
                   window.CSS.supports("position", "-webkit-sticky");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var bigEnough = window.matchMedia("(min-width: 768px)").matches;
    var hasHover = window.matchMedia("(hover: hover)").matches;
    if (stickyOk && !reducedMotion && bigEnough && hasHover) {
      document.documentElement.classList.add("reel-ok");
    }
  })();

  /* -------------------------------------------------------------------------
   * Tiered content — locked per microcopy spec.
   * Format: TIER_CONTENT[tier][stepNumber] returns HTML body for the reveal.
   * ------------------------------------------------------------------------- */
  var TIER_CONTENT = {
    founder: {
      1: "<p>You're fixing the loudest thing. The real problem is quieter. One founder rebuilt onboarding for three weeks — the churn was actually a billing email.</p>",
      2: "<p>Stop A/B-testing your decisions. Pick the bet, write what would kill it, say it in one sentence. One founder chose Stripe this way — saved six months.</p>",
      3: "<p>Build the ugly working version first. One founder shipped checkout as a Stripe button on plain HTML — eleven paying customers before the designer started.</p>",
      4: "<p>After shipping, look at what actually moved. One team's checkout shipped: conversion +34%, support tickets +60%. Both are real. The miss teaches as much.</p>",
      5: "<p>Bring one real decision — a bet, a launch, or receipts you can't read clearly. Thirty minutes, we trace it through the four moves. Right-fit only; I take about two in five.</p>"
    },
    operator: {
      1: "<ul><li>Trace the user path end-to-end</li><li>Audit which signals are noise</li><li>Talk to five churned users this week</li></ul><p><em>Open the discovery memo [Acme onboarding, Q2-2025].</em></p>",
      2: "<ul><li>Write the one-page bet memo</li><li>Name the reversal cost upfront</li><li>Set a two-week kill date</li></ul><p><em>Read the bet memo [Stripe vs. build it, redacted].</em></p>",
      3: "<ul><li>Define the smallest end-to-end path</li><li>Test the seams, not the screens</li><li>Defer everything that isn't the spine</li></ul><p><em>Open the spine spec [checkout-v0.1].</em></p>",
      4: "<ul><li>Compare to your pre-ship prediction</li><li>Log the miss next to the win</li><li>Schedule the two-week retro now</li></ul><p><em>Read the receipts doc [checkout-v0.1, Mar 14].</em></p>",
      5: "<p>Bring one stuck decision — pricing, hiring shape, a channel that won't compound. Thirty minutes, four moves, written down. Right-fit only; about two in five.</p>"
    },
    architect: {
      1: "<p><strong>Signal hygiene.</strong> Strip vanity metrics. Pin one north star — D7 retention on a clean cohort-of-100.</p><p><strong>Plumbing trace.</strong> Walk the data path: event → warehouse → dashboard. Find where it lies.</p><p><strong>Hypothesis stack.</strong> Three falsifiable bets in priority order, each with a kill criterion.</p><p><strong>Reference doc.</strong> Discovery memo §2 (user-painmap), instrumented against PostHog funnel <code>signup → activation → first-value</code>.</p><p><em>Discovery memo, week 1. The map that stopped us building the wrong thing.</em></p>",
      2: "<p><strong>Bet structure.</strong> Decision = (call, kill criterion, reversal cost, owner). No call ships without all four.</p><p><strong>Reversal cost.</strong> Quantified in eng-weeks, not vibes. Stripe migration ≈ 3 weeks; rolling our own ≈ 14.</p><p><strong>Kill criterion.</strong> Pre-committed metric, pre-committed date. ADR-007 §4 has the template.</p><p><strong>Decision log.</strong> Append-only. Future-you will forget why you chose this.</p><p><em>ADR-007. Written before the work, not after.</em></p>",
      3: "<p><strong>Vertical slice.</strong> One real user, one real outcome, one real database row. No mocks past the auth boundary.</p><p><strong>Seam tests.</strong> Contract tests at every service edge. Unit tests can lie; contracts can't.</p><p><strong>Feature-flag boundary.</strong> All new code behind the flag in <code>/api/checkout-v2</code>. Off in prod, on for staging + 5% canary.</p><p><strong>Defer list.</strong> Theming, animations, dark mode, settings page. Each line dated and signed.</p><p><em>checkout-v0.1. Live in nine days. Ugly on purpose.</em></p>",
      4: "<p><strong>Predicted vs. actual.</strong> Bet memo called +20% conversion. Hit +34%, missed CSAT delta by 8 points.</p><p><strong>Instrumentation.</strong> PostHog dashboard <code>checkout-v0.1-cohort</code> for the week of Mar 14, segmented by acquisition channel.</p><p><strong>Miss analysis.</strong> The 60% support spike traced to error-state copy. Patched in the v0.2 hotfix.</p><p><strong>Receipts ritual.</strong> Every ship gets one. Win, miss, surprise, next bet. Posted to #ship-log within seven days.</p><p><em>Receipts doc. Same template every time. The miss column is not optional.</em></p>",
      5: "<p>Bring one decision under load — a system choice, a scaling bet, a constraint you can't model cleanly. Thirty minutes, four moves, traced on the page. About two in five.</p>"
    }
  };

  /* -------------------------------------------------------------------------
   * Module state
   * ------------------------------------------------------------------------- */
  function init(root) {
    if (!root) return;

    var inReelMode = document.documentElement.classList.contains("reel-ok");
    var pill = root.querySelector("[data-framework-pill]");
    var tierOptions = pill ? slice(pill.querySelectorAll(".framework-tier__option")) : [];
    var counterText = root.querySelector("[data-framework-counter-text]");
    var stepButtons = slice(root.querySelectorAll(".framework-step__btn"));
    var frames = slice(root.querySelectorAll(".framework-step"));
    var reveals = slice(root.querySelectorAll(".framework-reveal"));
    var graphSegments = slice(root.querySelectorAll(".framework-graph__segment"));
    var primaryCta = root.querySelector("[data-framework-cta]");
    var pinned = root.querySelector("[data-framework-pinned]");
    var pinnedLink = root.querySelector("[data-framework-pinned-link]");

    var state = {
      tier: loadTier(),
      exploredSteps: new Set()
    };

    /* JS is loaded → mark root, then close reveals only in vertical mode.
     * In reel mode the reveal panel acts as the persistent frame body, so it
     * stays visible. No-JS users keep them visible regardless. */
    root.classList.add("is-js-ready");
    if (!inReelMode) {
      reveals.forEach(function (panel) {
        panel.hidden = true;
      });
    }

    /* Apply initial tier (no animation on first paint) */
    applyTier(state.tier);
    rehydrateRevealsForTier(state.tier, false);

    /* Wire tri-toggle */
    tierOptions.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        setTier(btn.dataset.tier);
      });
      btn.addEventListener("keydown", function (event) {
        var key = event.key;
        if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "Home" && key !== "End") return;
        event.preventDefault();
        var nextIdx = idx;
        if (key === "ArrowLeft") nextIdx = (idx - 1 + tierOptions.length) % tierOptions.length;
        else if (key === "ArrowRight") nextIdx = (idx + 1) % tierOptions.length;
        else if (key === "Home") nextIdx = 0;
        else if (key === "End") nextIdx = tierOptions.length - 1;
        tierOptions[nextIdx].focus();
        setTier(tierOptions[nextIdx].dataset.tier);
      });
    });

    /* Wire step buttons.
     * Vertical mode: click toggles the reveal (disclosure pattern).
     * Reel mode: click/focus scrolls to park that frame; reveal is always shown. */
    if (inReelMode) {
      stepButtons.forEach(function (btn) {
        btn.removeAttribute("aria-expanded");
        btn.removeAttribute("aria-controls");
        btn.setAttribute("aria-roledescription", "step");
        btn.addEventListener("click", function () {
          var frame = btn.closest(".framework-step");
          if (frame) scrollFrameToCenter(frame);
        });
        btn.addEventListener("focus", function () {
          var frame = btn.closest(".framework-step");
          if (frame) scrollFrameToCenter(frame);
        });
      });
    } else {
      stepButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          toggleStep(btn);
        });
      });
    }

    /* Wire primary CTA — prefill mailto subject */
    if (primaryCta) {
      primaryCta.addEventListener("click", function () {
        primaryCta.setAttribute("href", buildMailtoHref());
      });
    }
    if (pinnedLink) {
      pinnedLink.addEventListener("click", function () {
        pinnedLink.setAttribute("href", buildMailtoHref());
      });
    }

    /* Wire scroll-jump CTAs with arrival highlight */
    slice(root.querySelectorAll("[data-framework-scroll-cta]")).forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href") || "";
        var hashIdx = href.indexOf("#");
        if (hashIdx < 0) return;
        var samePage = href.charAt(0) === "#" || href.split("#")[0] === window.location.pathname.split("/").pop();
        if (!samePage) return;
        var id = href.slice(hashIdx + 1);
        var target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        target.classList.remove("framework-target-highlight");
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        target.offsetWidth;
        target.classList.add("framework-target-highlight");
        window.setTimeout(function () {
          target.classList.remove("framework-target-highlight");
        }, 1600);
      });
    });

    /* Pinned CTA via IntersectionObserver — visible after module passes top
     * (vertical fallback only; suppressed via CSS in reel mode). */
    if (pinned && "IntersectionObserver" in window) {
      var sentinel = root.querySelector("[data-framework-pinned-sentinel]") || primaryCta;
      if (sentinel) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting || entry.boundingClientRect.top > 0) {
              pinned.classList.remove("is-visible");
              pinned.setAttribute("aria-hidden", "true");
            } else {
              pinned.classList.add("is-visible");
              pinned.setAttribute("aria-hidden", "false");
            }
          });
        }, { rootMargin: "0px 0px -40% 0px" });
        io.observe(sentinel);
      }
    }

    /* Reel controller — sticky scrub + park IO + onboarding + deep-link */
    if (inReelMode && "IntersectionObserver" in window && frames.length > 0) {
      initReel();
    }

    /* ----- helpers ----- */

    function initReel() {
      var runway = root.querySelector("[data-reel-runway]");
      var stage = root.querySelector("[data-reel-stage]");
      var track = root.querySelector("[data-reel-track]");
      var onboard = root.querySelector("[data-reel-onboard]");
      if (!runway || !stage || !track) return;

      var currentParkedIdx = -1;
      var COOLDOWN_MS = 500;
      var ENTRY_DWELL_MS = 500;
      var lockUntil = 0;
      var touchStartY = null;
      var wasStageActive = false;

      function update() {
        var rect = runway.getBoundingClientRect();
        var vh = window.innerHeight;
        var vw = window.innerWidth;
        var scrolled = Math.max(0, -rect.top);
        var scrollable = Math.max(1, rect.height - vh);
        var progress = Math.max(0, Math.min(1, scrolled / scrollable));
        var translateX = progress * (frames.length - 1) * vw;
        track.style.transform = "translate3d(" + (-translateX) + "px, 0, 0)";

        /* Park detection: derive from scroll progress directly.
         * Round to nearest frame index; this is the parked frame. */
        var newIdx = Math.round(progress * (frames.length - 1));
        if (newIdx !== currentParkedIdx) {
          if (currentParkedIdx >= 0 && frames[currentParkedIdx]) {
            frames[currentParkedIdx].classList.remove("is-parked");
          }
          currentParkedIdx = newIdx;
          if (frames[currentParkedIdx]) {
            frames[currentParkedIdx].classList.add("is-parked");
            var stepNum = parseInt(frames[currentParkedIdx].dataset.frame, 10);
            if (stepNum) {
              /* Frames 1–4 count toward the four-moves counter and HUD graph.
               * Frame 5 is the close (fifth beat of the story, not a move):
               * landing here backfills any unexplored steps so the graph
               * fully draws even if the user jumped straight to the close. */
              if (stepNum <= 4) {
                markExplored(stepNum);
              } else if (stepNum === 5) {
                for (var i = 1; i <= 4; i++) {
                  if (!state.exploredSteps.has(i)) markExplored(i);
                }
              }
              if (onboard) onboard.classList.add("is-dismissed");
              updateHash(stepNum);
            }
          }
        }
      }

      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();

      /* Snap-to-frame: one gesture = one frame advance, regardless of intensity.
       * Active only while the stage is sticky-pinned. Native scroll resumes
       * past the first/last frame so the user can exit cleanly. */

      function isStageActive() {
        var rect = runway.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom >= window.innerHeight;
      }

      function currentFrameIdx() {
        var rect = runway.getBoundingClientRect();
        var vh = window.innerHeight;
        var scrolled = Math.max(0, -rect.top);
        var scrollable = Math.max(1, rect.height - vh);
        var progress = Math.max(0, Math.min(1, scrolled / scrollable));
        return Math.round(progress * (frames.length - 1));
      }

      function snapTo(idx) {
        idx = Math.max(0, Math.min(frames.length - 1, idx));
        /* Cooldown is shorter than the 850ms transition so the user can
         * chain gestures and create silky continuous motion through the
         * reel without waiting for each animation to complete. */
        lockUntil = Date.now() + COOLDOWN_MS;
        scrollFrameToCenter(frames[idx]);
      }

      function onWheel(e) {
        var stageActive = isStageActive();
        if (!stageActive) {
          wasStageActive = false;
          return;
        }
        /* Stage just became active: dwell so the user can read the
         * current frame before their inertia tail snaps the next one. */
        if (!wasStageActive) {
          wasStageActive = true;
          lockUntil = Math.max(lockUntil, Date.now() + ENTRY_DWELL_MS);
        }
        if (Math.abs(e.deltaY) < 1) return;
        if (Date.now() < lockUntil) {
          e.preventDefault();
          return;
        }
        var dir = e.deltaY > 0 ? 1 : -1;
        var idx = currentFrameIdx();
        /* At first/last frame trying to exit: release the lock and let
         * native scroll carry the user past the section. Keep wasStageActive
         * set so the exit-inertia tail doesn't re-trigger entry-dwell. */
        if (dir > 0 && idx >= frames.length - 1) {
          lockUntil = 0;
          return;
        }
        if (dir < 0 && idx <= 0) {
          lockUntil = 0;
          return;
        }
        e.preventDefault();
        snapTo(idx + dir);
      }

      function onTouchStart(e) {
        if (!isStageActive()) return;
        touchStartY = e.touches[0].clientY;
      }

      function onTouchEnd(e) {
        if (touchStartY === null) return;
        if (!isStageActive() || Date.now() < lockUntil) {
          touchStartY = null;
          return;
        }
        var dy = touchStartY - e.changedTouches[0].clientY;
        touchStartY = null;
        if (Math.abs(dy) < 30) return;
        var dir = dy > 0 ? 1 : -1;
        var idx = currentFrameIdx();
        if (dir > 0 && idx >= frames.length - 1) return;
        if (dir < 0 && idx <= 0) return;
        snapTo(idx + dir);
      }

      function onKeyDown(e) {
        if (!isStageActive()) return;
        var key = e.key;
        var dir = 0;
        if (key === "ArrowDown" || key === "PageDown") dir = 1;
        else if (key === "ArrowUp" || key === "PageUp") dir = -1;
        else return;
        var tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (Date.now() < lockUntil) {
          e.preventDefault();
          return;
        }
        var idx = currentFrameIdx();
        if (dir > 0 && idx >= frames.length - 1) return;
        if (dir < 0 && idx <= 0) return;
        e.preventDefault();
        snapTo(idx + dir);
      }

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKeyDown);

      /* Deep-link: if URL hash names a frame, jump to its scrollY on load. */
      var m = window.location.hash && window.location.hash.match(/frame-([1-4])/);
      if (m) {
        var idx = parseInt(m[1], 10) - 1;
        if (idx >= 0 && idx < frames.length) {
          window.setTimeout(function () {
            scrollFrameToCenter(frames[idx], "auto");
          }, 50);
        }
      }
    }

    /* Custom rAF tween for a longer, more cinematic horizontal transition
     * between frames. Uses an expo-out ease (cubic-bezier(.18,.74,.18,1))
     * matching the Polaroid develop curve so the visual identity is
     * consistent. Native scrollTo({behavior:"smooth"}) defers to the browser
     * and feels too snappy for the filmstrip metaphor. */
    var tweenRaf = 0;
    function smoothScrollToY(targetY, duration) {
      if (tweenRaf) cancelAnimationFrame(tweenRaf);
      duration = duration || 850;
      var startY = window.pageYOffset;
      var diff = targetY - startY;
      if (Math.abs(diff) < 1) return;
      var startTime = (window.performance && performance.now) ? performance.now() : Date.now();
      function step(now) {
        var elapsed = (now || Date.now()) - startTime;
        var t = Math.min(1, elapsed / duration);
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        window.scrollTo(0, startY + diff * eased);
        if (t < 1) {
          tweenRaf = window.requestAnimationFrame(step);
        } else {
          tweenRaf = 0;
        }
      }
      tweenRaf = window.requestAnimationFrame(step);
    }

    function scrollFrameToCenter(frame, behavior) {
      var runway = root.querySelector("[data-reel-runway]");
      if (!runway) return;
      var frameIdx = frames.indexOf(frame);
      if (frameIdx < 0) return;
      var rect = runway.getBoundingClientRect();
      var vh = window.innerHeight;
      var scrollable = Math.max(1, rect.height - vh);
      var targetProgress = frameIdx / Math.max(1, frames.length - 1);
      var targetScrollY = window.pageYOffset + rect.top + targetProgress * scrollable;
      if (behavior === "auto" || prefersReducedMotion()) {
        window.scrollTo(0, targetScrollY);
        return;
      }
      smoothScrollToY(targetScrollY, 850);
    }

    function updateHash(stepNum) {
      if (!("replaceState" in window.history)) return;
      try {
        var hash = stepNum > 1 ? "#approach=frame-" + stepNum : "#approach";
        window.history.replaceState(null, "", hash);
      } catch (e) {}
    }

    function setTier(tier) {
      if (!tier || TIERS.indexOf(tier) < 0 || tier === state.tier) return;
      state.tier = tier;
      saveTier(tier);
      applyTier(tier);
      rehydrateRevealsForTier(tier, true);
    }

    function applyTier(tier) {
      if (pill) pill.setAttribute("data-tier", tier);
      tierOptions.forEach(function (btn) {
        var checked = btn.dataset.tier === tier;
        btn.setAttribute("aria-checked", checked ? "true" : "false");
        btn.classList.toggle("is-active", checked);
        btn.setAttribute("tabindex", checked ? "0" : "-1");
      });
    }

    function rehydrateRevealsForTier(tier, animate) {
      reveals.forEach(function (panel) {
        var stepNum = parseInt(panel.dataset.step, 10);
        var copyEl = panel.querySelector("[data-tier-copy]");
        if (!copyEl) return;
        var html = (TIER_CONTENT[tier] && TIER_CONTENT[tier][stepNum]) || "";
        if (!animate || prefersReducedMotion()) {
          copyEl.innerHTML = html;
          return;
        }
        panel.classList.add("is-tier-changing");
        window.setTimeout(function () {
          copyEl.innerHTML = html;
          panel.classList.remove("is-tier-changing");
        }, 180);
      });
    }

    function toggleStep(btn) {
      var stepNum = parseInt(btn.dataset.step, 10);
      var revealId = btn.getAttribute("aria-controls");
      var panel = document.getElementById(revealId);
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      if (!panel) return;

      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        return;
      }

      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      markExplored(stepNum);
    }

    function markExplored(stepNum) {
      if (state.exploredSteps.has(stepNum)) return;
      state.exploredSteps.add(stepNum);
      updateCounter();
      revealGraphSegment(stepNum);
    }

    function updateCounter() {
      if (!counterText) return;
      var n = state.exploredSteps.size;
      var msg;
      if (n === 0) msg = "0 of 4 explored";
      else if (n === 4) msg = "4 of 4 — you have the map";
      else if (n === 3) msg = "3 of 4 explored — one more";
      else msg = n + " of 4 explored — keep going";
      counterText.textContent = msg;
    }

    function revealGraphSegment(stepNum) {
      var seg = root.querySelector('.framework-graph__segment[data-segment="' + stepNum + '"]');
      if (!seg) return;
      var stagger = prefersReducedMotion() ? 0 : 80 * (stepNum - 1);
      window.setTimeout(function () {
        seg.classList.add("is-revealed");
      }, stagger);
    }

    function buildMailtoHref() {
      var explored = [];
      state.exploredSteps.forEach(function (n) {
        explored.push(STEP_LABELS[n]);
      });
      explored.sort(function (a, b) {
        return labelIndex(a) - labelIndex(b);
      });
      var subject = "Teardown request";
      if (explored.length > 0) {
        subject += " — explored: " + explored.join(", ");
      }
      return "mailto:hello@example.com?subject=" + encodeURIComponent(subject);
    }

    function labelIndex(label) {
      for (var i = 1; i <= 4; i++) {
        if (STEP_LABELS[i] === label) return i;
      }
      return 99;
    }
  }

  /* -------------------------------------------------------------------------
   * Utilities
   * ------------------------------------------------------------------------- */
  function slice(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  function loadTier() {
    try {
      var v = window.sessionStorage.getItem(STORAGE_KEY_TIER);
      if (TIERS.indexOf(v) >= 0) return v;
    } catch (e) {}
    return "founder";
  }

  function saveTier(tier) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY_TIER, tier);
    } catch (e) {}
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* -------------------------------------------------------------------------
   * Bootstrap
   * ------------------------------------------------------------------------- */
  function bootstrap() {
    var roots = document.querySelectorAll("[data-framework-module]");
    Array.prototype.forEach.call(roots, function (root) {
      init(root);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
