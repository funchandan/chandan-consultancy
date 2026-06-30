(function initToolkitHero() {
  "use strict";

  var DATA_URL = "assets/hero-toolkit-cards.json?v=2";
  var stagesById = {};

  function renderChips(host, chips) {
    if (!host) return;
    host.innerHTML = "";
    if (!chips || !chips.length) return;
    chips.forEach(function (label, i) {
      var chip = document.createElement("span");
      chip.className = "toolkit-hero__chip" + (i === 0 ? " toolkit-hero__chip--pass" : "");
      chip.textContent = label;
      host.appendChild(chip);
    });
  }

  function applyStage(stageId) {
    var stage = stagesById[stageId];
    var root = document.querySelector("[data-toolkit-hero]");
    if (!root || !stage) return;

    var signals = stage.expertSignals || {};
    var img = root.querySelector("[data-toolkit-artifact]");
    var score = root.querySelector("[data-toolkit-score]");
    var chips = root.querySelector("[data-toolkit-chips]");

    if (img && signals.artifactSrc) {
      img.src = signals.artifactSrc;
      img.alt = (stage.title || "Toolkit") + " artefact";
    }
    if (score) {
      if (signals.score) {
        score.textContent = signals.score;
        score.hidden = false;
      } else {
        score.hidden = true;
      }
    }
    renderChips(chips, signals.chips);
  }

  function bind(root) {
    root.addEventListener("click", function (ev) {
      var pill = ev.target.closest("[data-toolkit-pill]");
      if (!pill || !root.contains(pill)) return;
      applyStage(pill.getAttribute("data-toolkit-pill"));
    });

    document.addEventListener("wp:toolkit-stage-change", function (ev) {
      if (ev.detail && ev.detail.stage) applyStage(ev.detail.stage);
    });

    var selected = root.querySelector('[data-toolkit-pill][aria-selected="true"]');
    applyStage(selected ? selected.getAttribute("data-toolkit-pill") : "research");
  }

  function boot() {
    var root = document.querySelector("[data-toolkit-hero]");
    if (!root) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error(DATA_URL + " " + res.status);
        return res.json();
      })
      .then(function (data) {
        (data.stages || []).forEach(function (stage) {
          stagesById[stage.id] = stage;
        });
        bind(root);
      })
      .catch(function () {
        bind(root);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
