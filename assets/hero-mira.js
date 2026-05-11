/*!
 * hero-mira.js — Phase 0.1 stub (post John × Sally roundtable)
 *
 * The Mira hero conversation surface controller.
 *
 * This file is intentionally a no-op stub at the end of Phase 0.
 * Phase 1 (per `_bmad-output/planning-artifacts/hero-saas-experience-build-plan-v1.md`)
 * will wire:
 *   - the state machine (idle / listening / thinking / replied / calendar-engaged
 *     + permission-denied / error / exhausted branches)
 *   - the Web Speech API mic path
 *   - the ~12-intent scripted brain
 *   - the Cal.com booking embed + transcript pipeline
 *
 * Phase 2 will introduce `vapiBrain.js` as a drop-in for `scriptedBrain.js`
 * via the same controller contract.
 *
 * v0.1 changes (John × Sally party mode):
 *   - Demo pill removed; honesty disclosure now lives inside the surface
 *     intro line. Pill-related toggle logic deleted.
 */

(function () {
  "use strict";

  var root = document.querySelector(".hero-mira[data-mira-state]");
  if (!root) return;

  var orphan = document.querySelector(".hero-agent-reel, [data-hero-agent], .hero-mira__demo-pill");
  if (orphan && typeof console !== "undefined" && console.warn) {
    console.warn(
      "[hero-mira] orphan legacy element detected (.hero-agent-reel " +
        "or .hero-mira__demo-pill) — removal incomplete."
    );
  }

  var form = root.querySelector('form[data-mira-action="submit-text"]');
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  var chips = root.querySelectorAll('[data-mira-chip]');
  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent("hero-mira", {
        detail: {
          component: "hero_mira",
          event: "phase_0_1_idle_loaded",
          timestamp: Date.now()
        }
      })
    );
  }
})();
