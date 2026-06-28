/**
 * Section 3D depth — MOTION-SECTION-DEPTH-001 / WO-017 Tier 3
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var PAIRS = [
    { out: "hero", inn: "work", key: "h1" },
    { out: "work", inn: "approach", key: "h2" },
    { out: "approach", inn: "connect", key: "h3" },
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

  function setStageVars(el, exit, enter, band) {
    if (!el) return;
    var scale = 1;
    var shift = 0;
    var rotate = 0;
    if (exit > 0) {
      scale = lerp(1, 0.9, exit);
      shift = lerp(0, -28, exit);
      rotate = lerp(0, 5, exit);
    }
    if (enter > 0) {
      scale = lerp(0.88, 1.04, enter);
      shift = lerp(24, 0, enter);
      rotate = lerp(6, 0, enter);
    }
    if (band > 0 && exit === 0 && enter === 0) {
      scale = lerp(0.98, 1.02, band);
    }
    el.style.setProperty("--section-stage-scale", scale.toFixed(4));
    el.style.setProperty("--section-stage-shift", shift.toFixed(2) + "px");
    el.style.setProperty("--section-stage-rotate", rotate.toFixed(2) + "deg");
    el.style.setProperty("--section-depth-exit", String(exit.toFixed(4)));
    el.style.setProperty("--section-depth-enter", String(enter.toFixed(4)));
    el.classList.add("wp-section-stage");
  }

  function clearStage(el) {
    if (!el) return;
    el.style.removeProperty("--section-stage-scale");
    el.style.removeProperty("--section-stage-shift");
    el.style.removeProperty("--section-stage-rotate");
    el.style.removeProperty("--section-depth-exit");
    el.style.removeProperty("--section-depth-enter");
    el.classList.remove("wp-section-stage");
  }

  function setTorchPhase(t) {
    document.documentElement.style.setProperty(
      "--page-torch-phase",
      clamp(t, 0, 1).toFixed(4)
    );
  }

  WPM.register("section-depth", {
    layer: 1,
    init: function (main, ctx) {
      if (!main || !document.body.classList.contains("home-page--product")) return;

      var sections = PAIRS.map(function (p) {
        return {
          out: document.getElementById(p.out),
          inn: document.getElementById(p.inn),
          key: p.key,
        };
      }).filter(function (p) {
        return p.out && p.inn;
      });

      if (!sections.length) return;

      document.documentElement.classList.add("wp-section-depth-ready");

      if ((ctx && ctx.reduced) || prefersReducedMotion()) {
        setTorchPhase(0);
        return;
      }

      var gsap = window.gsap;
      var ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      var triggers = [];
      var paused = false;

      sections.forEach(function (pair, idx) {
        var torchAt = idx / Math.max(sections.length - 1, 1);
        triggers.push(
          ScrollTrigger.create({
            trigger: pair.out,
            start: "center center",
            endTrigger: pair.inn,
            end: "center center",
            scrub: 0.4,
            onUpdate: function (self) {
              if (paused) return;
              var t = self.progress;
              setStageVars(pair.out, t, 0, 0);
              setStageVars(pair.inn, 0, t, 0);
              setTorchPhase(lerp(torchAt, torchAt + 1 / sections.length, t));
              if (pair.out.id === "hero") {
                document.documentElement.style.setProperty(
                  "--hero-handoff",
                  t.toFixed(4)
                );
              }
            },
            onLeaveBack: function () {
              clearStage(pair.out);
              clearStage(pair.inn);
            },
          })
        );

        triggers.push(
          ScrollTrigger.create({
            trigger: pair.inn,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
            onUpdate: function (self) {
              if (paused) return;
              var band = clamp(1 - Math.abs(self.progress - 0.5) * 2, 0, 1);
              setStageVars(pair.inn, 0, 0, band);
            },
          })
        );
      });

      function onVis() {
        paused = document.hidden;
        if (!paused) ScrollTrigger.update();
      }
      document.addEventListener("visibilitychange", onVis);

      return function destroy() {
        document.removeEventListener("visibilitychange", onVis);
        triggers.forEach(function (st) {
          st.kill();
        });
        sections.forEach(function (p) {
          clearStage(p.out);
          clearStage(p.inn);
        });
        document.documentElement.classList.remove("wp-section-depth-ready");
        document.documentElement.style.removeProperty("--page-torch-phase");
      };
    },
  });
})();
