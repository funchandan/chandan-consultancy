/**
 * Sortable quiz bento — Cult UI SortableList brownfield port
 */
(function () {
  "use strict";

  var STORAGE_KEY = "wp-bento-quiz-state";
  var DEFAULT_QUIZ = {
    title: "Test your systems instinct",
    description:
      "Rank these moves for a 20M+ learner loyalty launch — most critical first.",
    items: [
      {
        id: "map-journey",
        text: "Map earn-and-spend journeys end to end",
        rationale: "One clear story before marketplace UI scales.",
      },
      {
        id: "align-metric",
        text: "Align stakeholders on one north-star metric",
        rationale: "Shared success measure before surface debates.",
      },
      {
        id: "moderated-test",
        text: "Run moderated tests on production stimulus",
        rationale: "Validate with real learners in US + India.",
      },
      {
        id: "marketplace",
        text: "Define marketplace mechanics and edge cases",
        rationale: "Earn/spend rules need defensible boundaries.",
      },
      {
        id: "avatar",
        text: "Ship avatar rewards as a fast follow",
        rationale: "Delight layer after the core loop works.",
      },
    ],
    expertOrder: [
      "map-journey",
      "align-metric",
      "moderated-test",
      "marketplace",
      "avatar",
    ],
    startOrder: ["avatar", "marketplace", "moderated-test", "align-metric", "map-journey"],
    caseHref: "#work",
    caseCta: "See the BYJU's case",
  };

  function parseConfig(mount) {
    var raw = mount.getAttribute("data-bento-quiz-data");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function readStoredState() {
    try {
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

  function itemById(items, id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function orderItems(items, order) {
    return order
      .map(function (id) {
        return itemById(items, id);
      })
      .filter(Boolean);
  }

  function scoreRanking(userOrder, expertOrder) {
    var matches = 0;
    for (var i = 0; i < expertOrder.length; i++) {
      if (userOrder[i] === expertOrder[i]) matches++;
    }
    return matches;
  }

  function gripIcon() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>' +
      "</svg>"
    );
  }

  function rowHtml(item, rank) {
    return (
      '<li class="bento-quiz__row" data-bento-quiz-item="' +
      item.id +
      '" draggable="true">' +
      '<span class="bento-quiz__rank" aria-hidden="true">' +
      rank +
      "</span>" +
      '<span class="bento-quiz__label">' +
      item.text +
      "</span>" +
      '<span class="bento-quiz__handle" aria-hidden="true">' +
      gripIcon() +
      "</span>" +
      "</li>"
    );
  }

  function resultsHtml(config, score) {
    var expert = orderItems(config.items, config.expertOrder);
    var rows = expert
      .map(function (item, index) {
        return (
          '<li class="bento-quiz__result">' +
          '<span class="bento-quiz__rank">' +
          (index + 1) +
          "</span>" +
          '<div class="bento-quiz__result-copy">' +
          '<span class="bento-quiz__label">' +
          item.text +
          "</span>" +
          '<span class="bento-quiz__rationale">' +
          item.rationale +
          "</span>" +
          "</div></li>"
        );
      })
      .join("");

    var scoreCopy =
      typeof score === "number"
        ? score + " of " + config.expertOrder.length + " in the expert sequence."
        : "Expert priority order:";

    return (
      '<div class="bento-quiz bento-quiz--results" data-bento-quiz-root>' +
      '<div class="bento-quiz__header">' +
      "<h3 class=\"bento-quiz__title\">" +
      config.title +
      "</h3>" +
      '<p class="bento-quiz__desc">' +
      scoreCopy +
      "</p></div>" +
      '<ol class="bento-quiz__results" data-bento-quiz-results>' +
      rows +
      "</ol>" +
      '<a class="bento-quiz__cta" href="' +
      (config.caseHref || "#work") +
      '">' +
      (config.caseCta || "See the case") +
      "</a></div>"
    );
  }

  function playHtml(config) {
    var start = config.startOrder || DEFAULT_QUIZ.startOrder;
    var ordered = orderItems(config.items, start);
    var list = ordered
      .map(function (item, index) {
        return rowHtml(item, index + 1);
      })
      .join("");

    return (
      '<div class="bento-quiz" data-bento-quiz-root data-bento-quiz-play>' +
      '<div class="bento-quiz__header">' +
      "<h3 class=\"bento-quiz__title\" data-bento-quiz-title>" +
      config.title +
      "</h3>" +
      '<p class="bento-quiz__desc" data-bento-quiz-desc>' +
      config.description +
      "</p></div>" +
      '<ul class="bento-quiz__list" data-bento-quiz-list role="list">' +
      list +
      "</ul>" +
      '<button type="button" class="bento-quiz__submit" data-bento-quiz-submit disabled>Check my ranking</button>' +
      "</div>"
    );
  }

  function shellHtml(config) {
    return playHtml(config);
  }

  function updateRanks(list) {
    var rows = list.querySelectorAll("[data-bento-quiz-item]");
    rows.forEach(function (row, index) {
      var rank = row.querySelector(".bento-quiz__rank");
      if (rank) rank.textContent = String(index + 1);
    });
  }

  function currentOrder(list) {
    return Array.prototype.map.call(
      list.querySelectorAll("[data-bento-quiz-item]"),
      function (row) {
        return row.getAttribute("data-bento-quiz-item");
      }
    );
  }

  function wireSortable(list, onDirty) {
    var dragged = null;

    list.addEventListener("dragstart", function (ev) {
      var row = ev.target.closest("[data-bento-quiz-item]");
      if (!row || !list.contains(row)) return;
      dragged = row;
      row.classList.add("is-dragging");
      if (ev.dataTransfer) {
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", row.getAttribute("data-bento-quiz-item") || "");
      }
    });

    list.addEventListener("dragend", function () {
      if (dragged) dragged.classList.remove("is-dragging");
      list.querySelectorAll(".is-drag-over").forEach(function (el) {
        el.classList.remove("is-drag-over");
      });
      dragged = null;
      updateRanks(list);
    });

    list.addEventListener("dragover", function (ev) {
      ev.preventDefault();
      var row = ev.target.closest("[data-bento-quiz-item]");
      if (!row || !list.contains(row) || row === dragged) return;
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = "move";
      list.querySelectorAll(".is-drag-over").forEach(function (el) {
        if (el !== row) el.classList.remove("is-drag-over");
      });
      row.classList.add("is-drag-over");
      var rect = row.getBoundingClientRect();
      var before = ev.clientY < rect.top + rect.height / 2;
      if (dragged) {
        if (before) list.insertBefore(dragged, row);
        else list.insertBefore(dragged, row.nextSibling);
      }
    });

    list.addEventListener("drop", function (ev) {
      ev.preventDefault();
      if (typeof onDirty === "function") onDirty();
    });
  }

  function mountQuiz(mount, config) {
    if (mount.getAttribute("data-bento-quiz-wired") === "1") return;
    mount.setAttribute("data-bento-quiz-wired", "1");

    var stored = readStoredState();
    if (stored && stored.completed) {
      mount.innerHTML = resultsHtml(config, stored.score);
      return;
    }

    if (!mount.querySelector("[data-bento-quiz-root]")) {
      mount.innerHTML = shellHtml(config);
    }

    var root = mount.querySelector("[data-bento-quiz-root]");
    var list = mount.querySelector("[data-bento-quiz-list]");
    var submit = mount.querySelector("[data-bento-quiz-submit]");
    if (!root || !list || !submit) return;

    var dirty = false;

    wireSortable(list, function () {
      dirty = true;
      submit.disabled = false;
    });

    submit.addEventListener("click", function () {
      if (!dirty) return;
      var order = currentOrder(list);
      var score = scoreRanking(order, config.expertOrder);
      writeStoredState({ completed: true, order: order, score: score });
      mount.innerHTML = resultsHtml(config, score);
    });
  }

  function hydrate(mount, config) {
    var quiz = config || parseConfig(mount) || DEFAULT_QUIZ;
    if (mount && config) {
      mount.setAttribute("data-bento-quiz-data", JSON.stringify(quiz));
    }
    mount.removeAttribute("data-bento-quiz-wired");
    mountQuiz(mount, quiz);
  }

  function onHydrated(ev) {
    if (!ev.detail || !ev.detail.mount) return;
    hydrate(ev.detail.mount, ev.detail.quiz);
  }

  document.addEventListener("wp:bento-quiz-hydrated", onHydrated);

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-bento-quiz-widget]").forEach(function (mount) {
      hydrate(mount);
    });
  });

  window.WPBentoQuiz = {
    hydrate: hydrate,
    reset: function () {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_err) {
        /* no-op */
      }
      document.querySelectorAll("[data-bento-quiz-widget]").forEach(function (mount) {
        mount.removeAttribute("data-bento-quiz-wired");
        hydrate(mount);
      });
    },
  };

  var WPM = window.WPMotion;
  if (WPM && typeof WPM.register === "function") {
    WPM.register("bento-sortable-quiz", {
      layer: 2,
      init: function () {
        document.querySelectorAll("[data-bento-quiz-widget]").forEach(function (mount) {
          if (mount.getAttribute("data-bento-quiz-wired") !== "1") {
            hydrate(mount);
          }
        });
      },
    });
  }
})();
