/**
 * Toolkits bento — terminal background artefact (Cult UI parity, vanilla brownfield)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var START_TAB = 1;

  var TABS = [
    {
      label: "research",
      command: "wp research init stakeholder-map",
      lines: [
        { text: "", delay: 80, color: "" },
        {
          text: "  Scanning interviews… 12 transcripts indexed",
          delay: 400,
          color: "accent",
        },
        { text: "", delay: 80, color: "" },
        { text: "  Jobs surfaced:", delay: 200, color: "muted" },
        {
          text: "    validate bets before build",
          delay: 80,
          color: "dim",
        },
        {
          text: "    de-risk AI pilots with HITL",
          delay: 80,
          color: "dim",
        },
        {
          text: "  > scaffold ready — decision teardown",
          delay: 200,
          color: "cyan",
        },
      ],
    },
    {
      label: "frame",
      command: "wp frame spec decision-teardown",
      lines: [
        { text: "", delay: 80, color: "" },
        {
          text: "  Loading bet memo template…",
          delay: 300,
          color: "accent",
        },
        { text: "", delay: 80, color: "" },
        {
          text: "  kill date · reversal cost · owner",
          delay: 200,
          color: "muted",
        },
        {
          text: "  seam map attached (3 systems)",
          delay: 150,
          color: "dim",
        },
        {
          text: "  ✓ frame exported — ready to ship",
          delay: 300,
          color: "green",
        },
      ],
    },
    {
      label: "ship",
      command: "wp ship framework toolkits",
      lines: [
        { text: "", delay: 80, color: "" },
        {
          text: "  Bundling ship-ready frameworks…",
          delay: 400,
          color: "accent",
        },
        { text: "", delay: 80, color: "" },
        {
          text: "  ✓ decision-teardown.html",
          delay: 100,
          color: "green",
        },
        {
          text: "  ✓ ai-workflow-ux.html",
          delay: 80,
          color: "green",
        },
        {
          text: "  ✓ architecture-audit.html",
          delay: 80,
          color: "green",
        },
        { text: "", delay: 80, color: "" },
        {
          text: "  3 artefacts published to /toolkits",
          delay: 300,
          color: "muted",
        },
      ],
    },
    {
      label: "measure",
      command: "wp measure outcomes cohort-q2",
      lines: [
        { text: "", delay: 80, color: "" },
        {
          text: "  Tracking proof signals…",
          delay: 300,
          color: "accent",
        },
        { text: "", delay: 80, color: "" },
        {
          text: "  decision latency  −41%",
          delay: 150,
          color: "cyan",
        },
        {
          text: "  pilot override rate  within guardrails",
          delay: 100,
          color: "dim",
        },
        {
          text: "  ✓ measure loop closed",
          delay: 300,
          color: "green",
        },
      ],
    },
  ];

  function clearTimers(list) {
    for (var i = 0; i < list.length; i++) clearTimeout(list[i]);
    list.length = 0;
  }

  function buildShell(mount, reduced) {
    mount.innerHTML =
      '<div class="bento-terminal' +
      (reduced ? " bento-terminal--static" : "") +
      '">' +
      '<div class="bento-terminal__window">' +
      '<div class="bento-terminal__content">' +
      '<div class="bento-terminal__command" data-bento-terminal-command></div>' +
      '<div class="bento-terminal__output" data-bento-terminal-output></div>' +
      "</div>" +
      '<div class="bento-terminal__tabs" data-bento-terminal-tabs></div>' +
      "</div>" +
      "</div>";

    return {
      command: mount.querySelector("[data-bento-terminal-command]"),
      output: mount.querySelector("[data-bento-terminal-output]"),
      tabs: mount.querySelector("[data-bento-terminal-tabs]"),
    };
  }

  function renderTabs(tabsEl, activeIndex) {
    if (!tabsEl) return;
    var html = "";
    for (var i = 0; i < TABS.length; i++) {
      var tab = TABS[i];
      var cls =
        "bento-terminal__tab" + (i === activeIndex ? " is-active" : "");
      html +=
        '<span class="' +
        cls +
        '" data-bento-terminal-tab="' +
        i +
        '">' +
        tab.label +
        "</span>";
    }
    tabsEl.innerHTML = html;
  }

  function lineClass(color) {
    if (!color) return "";
    return ' class="bento-terminal__line bento-terminal__line--' + color + '"';
  }

  function renderStatic(ui, tabIndex) {
    var tab = TABS[tabIndex] || TABS[START_TAB];
    if (!ui.command || !ui.output) return;

    ui.command.innerHTML =
      '<span class="bento-terminal__prompt">$</span> ' + tab.command;

    var out = "";
    for (var i = 0; i < tab.lines.length; i++) {
      var line = tab.lines[i];
      out +=
        "<div" +
        lineClass(line.color) +
        ">" +
        (line.text || "\u00a0") +
        "</div>";
    }
    ui.output.innerHTML = out;
    renderTabs(ui.tabs, tabIndex);
  }

  function playTab(ui, tabIndex, timers, onComplete) {
    var tab = TABS[tabIndex];
    if (!tab || !ui.command || !ui.output) return;

    clearTimers(timers);
    ui.output.innerHTML = "";
    renderTabs(ui.tabs, tabIndex);

    var command = tab.command;
    var charIndex = 0;
    var visibleLines = 0;

    function typeCommand() {
      if (charIndex <= command.length) {
        ui.command.innerHTML =
          '<span class="bento-terminal__prompt">$</span> ' +
          command.slice(0, charIndex) +
          (charIndex < command.length
            ? '<span class="bento-terminal__cursor" aria-hidden="true">▌</span>'
            : "");
        charIndex++;
        timers.push(
          setTimeout(typeCommand, 25 + Math.floor(Math.random() * 35))
        );
      } else {
        timers.push(setTimeout(showLine, 250));
      }
    }

    function showLine() {
      if (visibleLines < tab.lines.length) {
        var line = tab.lines[visibleLines];
        var div = document.createElement("div");
        if (line.color) {
          div.className =
            "bento-terminal__line bento-terminal__line--" + line.color;
        }
        div.textContent = line.text || "\u00a0";
        ui.output.appendChild(div);
        visibleLines++;
        var delay = line.delay != null ? line.delay : 100;
        timers.push(setTimeout(showLine, delay));
      } else if (typeof onComplete === "function") {
        timers.push(setTimeout(onComplete, 1400));
      }
    }

    timers.push(setTimeout(typeCommand, 300));
  }

  WPM.register("bento-bg-toolkit-terminal", {
    layer: 2,
    init: function (root, ctx) {
      var host =
        root.querySelector("[data-bento-bg-artifact='terminal']") ||
        root.querySelector("[data-bento-bg-artifact=terminal]");
      if (!host) return;

      var ui = buildShell(host, ctx.reduced);

      if (ctx.reduced) {
        renderStatic(ui, START_TAB);
        return;
      }

      var timers = [];
      var activeTab = START_TAB;
      var wasVisible = false;

      function restart() {
        activeTab = START_TAB;
        playTab(ui, activeTab, timers, cycleTab);
      }

      function cycleTab() {
        activeTab = (activeTab + 1) % TABS.length;
        playTab(ui, activeTab, timers, cycleTab);
      }

      var card = root.closest("[data-hero-bento-toolkits]") || root;
      var observer = new IntersectionObserver(
        function (entries) {
          var entry = entries[0];
          if (!entry) return;
          var visible = entry.isIntersecting;
          if (visible && !wasVisible) restart();
          wasVisible = visible;
        },
        { threshold: 0.2 }
      );

      observer.observe(card);
      restart();

      return function destroy() {
        observer.disconnect();
        clearTimers(timers);
      };
    },
  });
})();
