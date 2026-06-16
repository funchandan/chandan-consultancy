/**
 * Poll bento — Cult UI PollWidget inline brownfield port
 */
(function () {
  "use strict";

  var STORAGE_KEY = "wp-bento-poll-state";
  var DEFAULT_POLL = {
    question: "What would you like to see more of?",
    description: "Pick one, then submit.",
    options: [
      { id: "cases", label: "Case study deep dives" },
      { id: "toolkits", label: "Design toolkits" },
      { id: "ai", label: "AI product UX" },
      { id: "process", label: "Design process notes" },
    ],
    votes: { cases: 12, toolkits: 8, ai: 15, process: 5 },
  };

  function parseConfig(mount) {
    var raw = mount.getAttribute("data-bento-poll-data");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function readStoredState() {
    try {
      var legacy = window.localStorage.getItem("wp-bento-poll-voted");
      if (legacy === "1") {
        window.localStorage.removeItem("wp-bento-poll-voted");
        return { hasVoted: true, selected: null, votes: null };
      }
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function writeStoredState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      /* no-op */
    }
  }

  function totalVotes(votes) {
    var sum = 0;
    Object.keys(votes).forEach(function (key) {
      sum += votes[key] || 0;
    });
    return sum;
  }

  function pct(votes, id) {
    var total = totalVotes(votes);
    if (!total) return 0;
    return Math.round(((votes[id] || 0) / total) * 100);
  }

  function checkIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">' +
      '<path d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
    );
  }

  function successIcon() {
    return (
      '<svg class="bento-poll-widget__success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">' +
      '<path d="M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z" fill="rgba(0,0,0,0.08)"/>' +
      '<path d="M12.1334 16.9667L15.0334 19.8667L19.8667 13.1M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/>' +
      "</svg>"
    );
  }

  function renderShell(mount, config) {
    var options = config.options || [];
    var optionsHtml = options
      .map(function (opt) {
        return (
          '<li><button type="button" class="bento-poll-widget__option" data-bento-poll-option="' +
          opt.id +
          '" role="option" aria-selected="false">' +
          '<span class="bento-poll-widget__progress" data-bento-poll-progress aria-hidden="true"></span>' +
          '<span class="bento-poll-widget__option-inner">' +
          '<span class="bento-poll-widget__indicator">' +
          checkIcon() +
          "</span>" +
          '<span class="bento-poll-widget__label">' +
          opt.label +
          "</span>" +
          '<span class="bento-poll-widget__pct" data-bento-poll-pct>0%</span>' +
          "</span></button></li>"
        );
      })
      .join("");

    mount.innerHTML =
      '<div class="bento-poll-widget" data-bento-poll-root>' +
      '<div class="bento-poll-widget__body">' +
      '<div class="bento-poll-widget__question">' +
      '<h3 class="bento-poll-widget__title" data-bento-poll-question></h3>' +
      '<p class="bento-poll-widget__desc" data-bento-poll-desc hidden></p>' +
      "</div>" +
      '<ul class="bento-poll-widget__options" role="listbox" data-bento-poll-options>' +
      optionsHtml +
      "</ul>" +
      '<div class="bento-poll-widget__meta">' +
      '<span data-bento-poll-total>0 votes</span>' +
      '<span class="bento-poll-widget__meta-voted" data-bento-poll-you-voted>You voted</span>' +
      "</div>" +
      '<button type="button" class="bento-poll-widget__submit" data-bento-poll-submit disabled>Submit vote</button>' +
      "</div>" +
      '<div class="bento-poll-widget__success" data-bento-poll-success hidden>' +
      successIcon() +
      '<p class="bento-poll-widget__success-title">Thanks for voting!</p>' +
      '<p class="bento-poll-widget__success-desc" data-bento-poll-success-desc>Your vote has been recorded</p>' +
      "</div>" +
      "</div>";
  }

  function seedVotes(config) {
    var votes = {};
    (config.options || []).forEach(function (opt) {
      votes[opt.id] = (config.votes && config.votes[opt.id]) || 0;
    });
    return votes;
  }

  function wire(mount, config) {
    if (!config || !config.options || !config.options.length) return;
    if (mount.getAttribute("data-bento-poll-wired") === "1") return;

    if (!mount.querySelector("[data-bento-poll-root]")) {
      renderShell(mount, config);
    }

    mount.setAttribute("data-bento-poll-wired", "1");

    var root = mount.querySelector("[data-bento-poll-root]");
    var questionEl = mount.querySelector("[data-bento-poll-question]");
    var descEl = mount.querySelector("[data-bento-poll-desc]");
    var totalEl = mount.querySelector("[data-bento-poll-total]");
    var submitBtn = mount.querySelector("[data-bento-poll-submit]");
    var successEl = mount.querySelector("[data-bento-poll-success]");
    var successDesc = mount.querySelector("[data-bento-poll-success-desc]");

    var votes = seedVotes(config);
    var stored = readStoredState();
    var selected = stored && stored.selected ? stored.selected : null;
    var hasVoted = !!(stored && stored.hasVoted);
    if (stored && stored.votes) {
      votes = stored.votes;
    }
    var phase = hasVoted ? "results" : "idle";

    questionEl.textContent = config.question || "Poll";
    if (config.description) {
      descEl.textContent = config.description;
      descEl.hidden = false;
    }

    function updateMeta() {
      var total = totalVotes(votes);
      totalEl.textContent = total + (total === 1 ? " vote" : " votes");
    }

    function updateResultsUI() {
      var optionBtns = mount.querySelectorAll("[data-bento-poll-option]");
      optionBtns.forEach(function (btn) {
        var id = btn.getAttribute("data-bento-poll-option");
        var progress = btn.querySelector("[data-bento-poll-progress]");
        var pctEl = btn.querySelector("[data-bento-poll-pct]");
        var value = pct(votes, id);
        if (progress) {
          window.requestAnimationFrame(function () {
            progress.style.width = value + "%";
          });
        }
        if (pctEl) pctEl.textContent = value + "%";
        btn.disabled = hasVoted;
        btn.classList.toggle("is-voted", hasVoted);
        btn.classList.toggle("is-selected", id === selected);
        btn.setAttribute("aria-selected", id === selected ? "true" : "false");
      });
      root.classList.toggle("is-results", hasVoted || phase === "results");
      root.classList.toggle("is-voted", hasVoted);
      if (submitBtn) {
        submitBtn.disabled = !selected || hasVoted || phase !== "idle";
        submitBtn.hidden = hasVoted;
      }
      updateMeta();
    }

    function selectOption(id) {
      if (hasVoted || phase !== "idle") return;
      selected = id;
      updateResultsUI();
    }

    function submitVote() {
      if (!selected || hasVoted || phase !== "idle") return;
      phase = "submitting";
      root.classList.add("is-submitting");
      if (submitBtn) submitBtn.disabled = true;

      window.setTimeout(function () {
        votes[selected] = (votes[selected] || 0) + 1;
        hasVoted = true;
        phase = "results";
        root.classList.remove("is-submitting");
        writeStoredState({ hasVoted: true, selected: selected, votes: votes });
        updateResultsUI();

        window.setTimeout(function () {
          phase = "success";
          root.classList.add("is-success");
          if (successDesc) {
            var label = "";
            (config.options || []).some(function (opt) {
              if (opt.id === selected) {
                label = opt.label;
                return true;
              }
              return false;
            });
            successDesc.textContent = label
              ? "You voted for: " + label
              : "Your vote has been recorded";
          }
          if (successEl) successEl.hidden = false;

          window.setTimeout(function () {
            phase = "results";
            root.classList.remove("is-success");
            if (successEl) successEl.hidden = true;
          }, 1500);
        }, 2500);
      }, 400);
    }

    mount.addEventListener("click", function (ev) {
      var optionBtn = ev.target.closest("[data-bento-poll-option]");
      if (optionBtn && mount.contains(optionBtn)) {
        ev.preventDefault();
        selectOption(optionBtn.getAttribute("data-bento-poll-option"));
        return;
      }
      var submit = ev.target.closest("[data-bento-poll-submit]");
      if (submit && mount.contains(submit)) {
        ev.preventDefault();
        submitVote();
      }
    });

    updateMeta();
    updateResultsUI();
  }

  function hydrate(mount, config) {
    if (!mount) return;
    if (config) {
      mount.setAttribute("data-bento-poll-data", JSON.stringify(config));
    }
    if (mount.getAttribute("data-bento-poll-wired") === "1") return;
    wire(mount, parseConfig(mount) || config || DEFAULT_POLL);
  }

  function initMount(mount) {
    var config = parseConfig(mount) || DEFAULT_POLL;
    if (!mount.getAttribute("data-bento-poll-data")) {
      mount.setAttribute("data-bento-poll-data", JSON.stringify(config));
    }
    wire(mount, config);
  }

  function scan(scope) {
    (scope || document)
      .querySelectorAll("[data-bento-poll-widget]")
      .forEach(initMount);
  }

  function onHydrated(ev) {
    if (ev && ev.detail && ev.detail.mount) {
      hydrate(ev.detail.mount, ev.detail.poll);
    }
  }

  window.WPBentoPoll = { hydrate: hydrate, scan: scan, reset: function () {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_err) {}
    document.querySelectorAll("[data-bento-poll-widget]").forEach(function (mount) {
      mount.removeAttribute("data-bento-poll-wired");
      hydrate(mount, parseConfig(mount) || DEFAULT_POLL);
    });
  }};

  document.addEventListener("wp:bento-poll-hydrated", onHydrated);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      scan(document);
    });
  } else {
    scan(document);
  }

  var WPM = window.WPMotion;
  if (WPM && typeof WPM.register === "function") {
    WPM.register("bento-poll-widget", {
      init: function (root) {
        scan(root || document);
      },
    });
  }
})();
