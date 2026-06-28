/**
 * Work case 3D depth — MOTION-WORK-CASE-002 / WO-016
 * GSAP ScrollTrigger (primary) + WPScroll geometry fallback.
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var CASE_IDS = [
    "project-points-marketplace",
    "project-hp-field-service",
    "project-stryker-logistics",
  ];

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function neutralVars() {
    return {
      "--case-depth-progress": "0",
      "--case-depth-exit": "0",
      "--case-depth-enter": "0",
      "--case-media-scale": "1",
      "--case-media-parallax": "0px",
      "--case-media-rotate": "0deg",
      "--case-media-opacity": "1",
      "--case-index-scale": "1",
      "--case-copy-shift": "0px",
    };
  }

  function setCaseVars(el, vars) {
    if (!el) return;
    Object.keys(vars).forEach(function (key) {
      el.style.setProperty(key, vars[key]);
    });
  }

  function clearCaseVars(el) {
    if (!el) return;
    Object.keys(neutralVars()).forEach(function (key) {
      el.style.removeProperty(key);
    });
    el.style.removeProperty("--work-case-lift");
  }

  function applyDepth(caseEl, bandProgress, exit, enter) {
    var progress = clamp(bandProgress, 0, 1);
    exit = clamp(exit, 0, 1);
    enter = clamp(enter, 0, 1);

    var mediaScale = lerp(0.96, 1.04, progress);
    var parallax = lerp(-24, 24, progress);
    var mediaOpacity = 1;
    var rotateX = 0;

    if (exit > 0) {
      mediaScale = lerp(mediaScale, 0.88, exit);
      parallax = lerp(parallax, 16, exit);
      mediaOpacity = lerp(1, 0.72, exit);
      rotateX = lerp(0, 2, exit);
    }

    if (enter > 0) {
      mediaScale = lerp(0.92, 1, enter);
      parallax = lerp(-16, parallax, enter);
      rotateX = lerp(4, rotateX, enter);
    }

    var indexScale = lerp(0.94, 1.02, progress);
    if (enter > 0) indexScale = lerp(0.94, 1.02, enter);
    if (exit > 0) indexScale = lerp(indexScale, 0.96, exit);

    var lift = lerp(0.72, 0.88, progress);
    if (exit > 0) lift = lerp(lift, 0.72, exit);
    if (enter > 0) lift = lerp(0.72, lift, enter);

    var copyShift = 0;
    if (exit > 0) copyShift = lerp(0, -8, exit);
    if (enter > 0) copyShift = lerp(8, 0, enter);

    setCaseVars(caseEl, {
      "--case-depth-progress": String(progress.toFixed(4)),
      "--case-depth-exit": String(exit.toFixed(4)),
      "--case-depth-enter": String(enter.toFixed(4)),
      "--case-media-scale": String(mediaScale.toFixed(4)),
      "--case-media-parallax": parallax.toFixed(2) + "px",
      "--case-media-rotate": rotateX.toFixed(2) + "deg",
      "--case-media-opacity": String(mediaOpacity.toFixed(4)),
      "--case-index-scale": String(indexScale.toFixed(4)),
      "--case-copy-shift": copyShift.toFixed(2) + "px",
      "--work-case-lift": String(lift.toFixed(4)),
    });
  }

  function bandProgressForRect(rect, vh) {
    var center = rect.top + rect.height * 0.5;
    return clamp(1 - Math.abs(center - vh * 0.5) / (vh * 0.55), 0, 1);
  }

  function handoffProgress(outRect, inRect, vh) {
    var gapStart = outRect.bottom - vh * 0.15;
    var gapEnd = inRect.top + vh * 0.15;
    if (gapEnd <= gapStart) return 0;
    var mid = (outRect.bottom + inRect.top) * 0.5;
    return clamp((vh * 0.5 - mid) / (gapEnd - gapStart) + 0.5, 0, 1);
  }

  function computeDepthState(cases) {
    var vh = window.innerHeight || 800;
    var states = cases.map(function () {
      return { band: 0, exit: 0, enter: 0 };
    });

    cases.forEach(function (caseEl, i) {
      states[i].band = bandProgressForRect(caseEl.getBoundingClientRect(), vh);
    });

    for (var p = 0; p < cases.length - 1; p++) {
      var t = handoffProgress(
        cases[p].getBoundingClientRect(),
        cases[p + 1].getBoundingClientRect(),
        vh
      );
      if (t <= 0) continue;
      states[p].exit = Math.max(states[p].exit, t);
      states[p + 1].enter = Math.max(states[p + 1].enter, t);
    }

    return states;
  }

  function syncAllCases(cases) {
    var states = computeDepthState(cases);
    cases.forEach(function (caseEl, i) {
      var s = states[i];
      applyDepth(caseEl, s.band, s.exit, s.enter);
    });
  }

  function bindScroll(update) {
    if (window.WPScroll && typeof window.WPScroll.on === "function") {
      return window.WPScroll.on(update);
    }
    window.addEventListener("scroll", update, { passive: true });
    return function off() {
      window.removeEventListener("scroll", update);
    };
  }

  function createFallbackDriver(cases) {
    var rafId = 0;
    var paused = false;

    function frame() {
      if (!paused) syncAllCases(cases);
      rafId = requestAnimationFrame(frame);
    }

    function onVis() {
      paused = document.hidden;
    }

    var offScroll = bindScroll(function () {
      if (!paused) syncAllCases(cases);
    });

    document.addEventListener("visibilitychange", onVis);
    syncAllCases(cases);
    rafId = requestAnimationFrame(frame);

    return function destroy() {
      paused = true;
      cancelAnimationFrame(rafId);
      offScroll();
      document.removeEventListener("visibilitychange", onVis);
      cases.forEach(clearCaseVars);
    };
  }

  function createGsapDriver(work, cases) {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return createFallbackDriver(cases);

    gsap.registerPlugin(ScrollTrigger);

    var triggers = [];
    var paused = false;
    var state = cases.map(function () {
      return { band: 0, exit: 0, enter: 0 };
    });

    function publish() {
      if (paused) return;
      cases.forEach(function (caseEl, i) {
        var s = state[i];
        applyDepth(caseEl, s.band, s.exit, s.enter);
      });
    }

    cases.forEach(function (caseEl, i) {
      triggers.push(
        ScrollTrigger.create({
          trigger: caseEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
          onUpdate: function (self) {
            state[i].band = clamp(1 - Math.abs(self.progress - 0.5) * 2, 0, 1);
            publish();
          },
        })
      );
    });

    for (var p = 0; p < cases.length - 1; p++) {
      (function (outIdx, inIdx) {
        var outgoing = cases[outIdx];
        var incoming = cases[inIdx];
        triggers.push(
          ScrollTrigger.create({
            trigger: outgoing,
            start: "center center",
            endTrigger: incoming,
            end: "center center",
            scrub: 0.4,
            onUpdate: function (self) {
              var t = self.progress;
              state[outIdx].exit = t;
              state[inIdx].enter = t;
              publish();
            },
            onLeave: function () {
              state[outIdx].exit = 1;
              state[inIdx].enter = 1;
              publish();
            },
            onLeaveBack: function () {
              state[outIdx].exit = 0;
              state[inIdx].enter = 0;
              publish();
            },
          })
        );
      })(p, p + 1);
    }

    triggers.push(
      ScrollTrigger.create({
        trigger: work,
        start: "top bottom",
        end: "bottom top",
        onRefresh: publish,
      })
    );

    function onVis() {
      paused = document.hidden;
      if (paused) {
        triggers.forEach(function (st) {
          st.disable(false);
        });
      } else {
        triggers.forEach(function (st) {
          st.enable(false);
        });
        ScrollTrigger.update();
        publish();
      }
    }

    document.addEventListener("visibilitychange", onVis);
    publish();

    return function destroy() {
      document.removeEventListener("visibilitychange", onVis);
      triggers.forEach(function (st) {
        st.kill();
      });
      cases.forEach(clearCaseVars);
    };
  }

  WPM.register("work-case-depth", {
    layer: 2,
    init: function (work, ctx) {
      if (!work) return;

      var cases = CASE_IDS.map(function (id) {
        return document.getElementById(id);
      }).filter(Boolean);

      if (cases.length !== CASE_IDS.length) return;

      work.classList.add("wp-work-depth");

      if ((ctx && ctx.reduced) || prefersReducedMotion()) {
        cases.forEach(function (c) {
          setCaseVars(c, neutralVars());
        });
        return;
      }

      return createGsapDriver(work, cases);
    },
  });
})();
