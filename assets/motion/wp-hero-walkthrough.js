/**
 * Hero walkthrough — C02v3 (WO-008)
 * Spec: _bmad-output/D-UX-Design/noomo-portfolio-walkthrough-hero-v3.md
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM) return;

  var BEATS = [
    {
      id: "orient",
      label: "Orient",
      lines: [
        "Design leadership for teams",
        "shipping under real constraints.",
      ],
      lead:
        "I help teams clarify what to build, ship work they can stand behind, and explain the why to stakeholders — in startups and regulated enterprise alike.",
      cta: { label: "See case studies", href: "#work" },
    },
    {
      id: "proof",
      label: "Proof",
      lines: ["Three programmes.", "Real problems, shipped UI."],
      lead:
        "Edtech, field service, and hospital logistics — each story covers the problem, the work, and what changed.",
      cta: { label: "Explore case studies", href: "#work" },
    },
    {
      id: "method",
      label: "Method",
      lines: ["How I work", "on every high-stakes bet."],
      lead:
        "Map the system, choose one direction, ship essentials first, measure what changed — with proof from the cases.",
      cta: { label: "See the method", href: "#approach" },
    },
    {
      id: "engage",
      label: "Engage",
      lines: ["Work together", "when the bet is live."],
      lead:
        "Embedded leadership, design systems, and AI workflow UX for teams under real constraints.",
      cta: { label: "View services", href: "#services" },
    },
  ];

  function beatById(id) {
    for (var i = 0; i < BEATS.length; i++) {
      if (BEATS[i].id === id) return BEATS[i];
    }
    return BEATS[0];
  }

  function chapterFromQuery() {
    try {
      var q = new URLSearchParams(window.location.search).get("chapter");
      if (q && beatById(q).id === q) return q;
    } catch (_e) {}
    return "orient";
  }

  WPM.register("hero-walkthrough", {
    layer: 1,
    init: function (hero, ctx) {
      if (!hero) return;

      var tabs = hero.querySelectorAll(".hero-walkthrough__tab");
      var panels = hero.querySelectorAll(".hero-walkthrough__panel");
      var titleEl = hero.querySelector("[data-walkthrough-title]");
      var leadEl = hero.querySelector("[data-walkthrough-lead]");
      var beatLabel = hero.querySelector("[data-walkthrough-beat-label]");
      var ctaPrimary = hero.querySelector("[data-walkthrough-cta-primary]");
      var reduced = ctx.reduced;
      var current = chapterFromQuery();
      var currentIndex = 0;

      function indexOfBeat(id) {
        for (var i = 0; i < BEATS.length; i++) {
          if (BEATS[i].id === id) return i;
        }
        return 0;
      }

      function renderCopy(beat, animate) {
        if (!titleEl) return;
        var html =
          '<span class="hero-walkthrough__h1-line">' +
          beat.lines[0] +
          "</span>" +
          '<span class="hero-walkthrough__h1-line">' +
          beat.lines[1] +
          "</span>";
        titleEl.innerHTML = html;
        if (animate && !reduced) {
          titleEl.classList.remove("is-updating");
          void titleEl.offsetWidth;
          titleEl.classList.add("is-updating");
        }
        if (leadEl) leadEl.textContent = beat.lead;
        if (beatLabel) beatLabel.textContent = beat.label;
        if (ctaPrimary) {
          ctaPrimary.textContent = beat.cta.label;
          ctaPrimary.setAttribute("href", beat.cta.href);
        }
      }

      function setBeat(id, animate) {
        var beat = beatById(id);
        current = beat.id;
        currentIndex = indexOfBeat(current);

        tabs.forEach(function (tab, i) {
          var on = BEATS[i].id === current;
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
          tab.classList.toggle("is-active", on);
        });

        panels.forEach(function (panel) {
          var on = panel.getAttribute("data-beat") === current;
          panel.classList.toggle("is-active", on);
          panel.hidden = !on;
        });

        renderCopy(beat, animate !== false);
        hero.setAttribute("data-walkthrough-beat", current);

        document.dispatchEvent(
          new CustomEvent("wp:journey-beat", {
            detail: { beat: current, source: "hero" },
          })
        );
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-beat") || BEATS[i].id;
          setBeat(id);
        });
        tab.addEventListener("keydown", function (e) {
          var next = currentIndex;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            next = (currentIndex + 1) % BEATS.length;
            setBeat(BEATS[next].id);
            tabs[next].focus();
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            next = (currentIndex - 1 + BEATS.length) % BEATS.length;
            setBeat(BEATS[next].id);
            tabs[next].focus();
          }
        });
      });

      document.addEventListener("wp:journey-beat", function (e) {
        if (!e.detail || e.detail.source === "hero") return;
        if (e.detail.beat && e.detail.beat !== current) {
          setBeat(e.detail.beat, false);
        }
      });

      if (!reduced) {
        hero.classList.add("hero-walkthrough--js");
        window.requestAnimationFrame(function () {
          hero.classList.add("hero-walkthrough--play");
        });
      } else {
        hero.classList.add("hero-walkthrough--static");
      }

      setBeat(current, false);

      return function () {
        hero.removeAttribute("data-walkthrough-beat");
      };
    },
  });
})();
