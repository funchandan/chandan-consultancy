/**
 * Method carousel — Ship tab terminal animation (Cult UI TerminalAnimation parity)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var START_TAB = 0;

  var SHIP_TABS = [
    {
      label: "build",
      command: "npm run build",
      lines: [
        { text: "", delay: 80, color: "" },
        { text: "  > portfolio@1.0.0 build", delay: 200, color: "muted" },
        { text: "  > tsc && vite build", delay: 150, color: "muted" },
        { text: "", delay: 80, color: "" },
        { text: "  ✓ compiled successfully", delay: 400, color: "green" },
        { text: "  dist/ ready · 142 modules", delay: 200, color: "dim" },
      ],
    },
    {
      label: "test",
      command: "npm test -- --ci",
      lines: [
        { text: "", delay: 80, color: "" },
        { text: "  PASS  order-path.spec.ts", delay: 200, color: "green" },
        { text: "  PASS  scan-confirm.spec.ts", delay: 120, color: "green" },
        { text: "  PASS  offline-queue.spec.ts", delay: 120, color: "green" },
        { text: "", delay: 80, color: "" },
        { text: "  Tests: 142 passed, 142 total", delay: 350, color: "cyan" },
      ],
    },
    {
      label: "deploy",
      command: "deploy --pilot west-region",
      lines: [
        { text: "", delay: 80, color: "" },
        { text: "  Packaging pilot bundle…", delay: 300, color: "accent" },
        { text: "  ✓ feature flags on", delay: 200, color: "green" },
        { text: "  → pilot live · west-region", delay: 250, color: "cyan" },
        { text: "  scope: order path + scan confirm", delay: 200, color: "dim" },
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
      '" role="img" aria-label="Terminal ship sequence: build, test, deploy">' +
      '<div class="bento-terminal__window">' +
      '<div class="bento-terminal__content">' +
      '<div class="bento-terminal__command" data-method-terminal-command></div>' +
      '<div class="bento-terminal__output" data-method-terminal-output></div>' +
      "</div>" +
      '<div class="bento-terminal__tabs" data-method-terminal-tabs></div>' +
      "</div>" +
      "</div>";

    return {
      command: mount.querySelector("[data-method-terminal-command]"),
      output: mount.querySelector("[data-method-terminal-output]"),
      tabs: mount.querySelector("[data-method-terminal-tabs]"),
    };
  }

  function renderTabs(tabsEl, activeIndex) {
    if (!tabsEl) return;
    var html = "";
    for (var i = 0; i < SHIP_TABS.length; i++) {
      var tab = SHIP_TABS[i];
      var cls =
        "bento-terminal__tab" + (i === activeIndex ? " is-active" : "");
      html +=
        '<span class="' +
        cls +
        '" data-method-terminal-tab="' +
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
    var tab = SHIP_TABS[tabIndex] || SHIP_TABS[START_TAB];
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
    var tab = SHIP_TABS[tabIndex];
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
          setTimeout(typeCommand, 22 + Math.floor(Math.random() * 30))
        );
      } else {
        timers.push(setTimeout(showLine, 220));
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
        timers.push(setTimeout(showLine, line.delay != null ? line.delay : 100));
      } else if (typeof onComplete === "function") {
        timers.push(setTimeout(onComplete, 1200));
      }
    }

    timers.push(setTimeout(typeCommand, 280));
  }

  WPM.register("method-carousel-terminal", {
    layer: 2,
    init: function (section, ctx) {
      var root = section && section.querySelector("[data-method-carousel]");
      var wrap = root && root.querySelector("[data-method-carousel-terminal]");
      var mount =
        wrap && wrap.querySelector("[data-method-carousel-terminal-mount]");
      if (!root || !wrap || !mount) return;

      var reduced = ctx && ctx.reduced;
      var ui = buildShell(mount, reduced);
      var timers = [];
      var activeTab = START_TAB;
      var playing = false;

      function cycleTab() {
        if (!playing) return;
        activeTab = (activeTab + 1) % SHIP_TABS.length;
        playTab(ui, activeTab, timers, cycleTab);
      }

      function restart() {
        if (reduced) {
          renderStatic(ui, START_TAB);
          return;
        }
        playing = true;
        activeTab = START_TAB;
        playTab(ui, activeTab, timers, cycleTab);
      }

      function pause() {
        playing = false;
        clearTimers(timers);
      }

      function onStepChange() {
        var step = root.getAttribute("data-step");
        if (step === "2") {
          wrap.classList.add("wp-method-carousel__img--visible");
          restart();
        } else {
          wrap.classList.remove("wp-method-carousel__img--visible");
          pause();
        }
      }

      var observer = new MutationObserver(onStepChange);
      observer.observe(root, { attributes: true, attributeFilter: ["data-step"] });

      onStepChange();

      return function destroy() {
        observer.disconnect();
        pause();
      };
    },
  });
})();
