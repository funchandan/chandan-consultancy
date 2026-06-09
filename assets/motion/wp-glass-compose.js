/**
 * Glass compose toolkit shell — hero toolkit path interaction layer.
 * Visual/interaction port of GlassAiCompose brief (vanilla; no React on index).
 */
(function () {
  "use strict";

  var STAGES = [
    { id: "clarify", label: "Clarify", color: "#FF7B54", href: "toolkits/decision-teardown.html" },
    { id: "create", label: "Create", color: "#10A37F", href: "toolkits.html#kit-create" },
    { id: "build", label: "Build", color: "#3A86FF", href: "toolkits.html#kit-build" },
  ];

  function stageById(id) {
    for (var i = 0; i < STAGES.length; i++) {
      if (STAGES[i].id === id) return STAGES[i];
    }
    return STAGES[0];
  }

  function init(root) {
    var frame = root.querySelector("[data-glass-compose-frame]");
    var pill = root.querySelector("[data-glass-pill]");
    var switcher = root.querySelector("[data-glass-switcher]");
    var send = root.querySelector("[data-glass-send]");
    var pathToggle = root.querySelector("[data-glass-path-toggle]");
    var flash = root.querySelector("[data-glass-flash]");
    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!frame || !pill || !switcher) return;

    var activeId = "clarify";
    var flashTimer = 0;

    function setAccent(color) {
      root.style.setProperty("--wp-glass-accent", color);
      frame.style.setProperty("--wp-glass-accent", color);
    }

    function movePill(btn) {
      if (!btn) return;
      var color = btn.getAttribute("data-stage-color") || stageById(activeId).color;
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
      pill.style.background = color + "18";
      pill.style.border = "1px solid " + color + "22";
      setAccent(color);
    }

    function setActiveStage(id, focusTrigger) {
      var stage = stageById(id);
      activeId = stage.id;
      setAccent(stage.color);

      var buttons = switcher.querySelectorAll("[data-glass-stage]");
      var i;
      for (i = 0; i < buttons.length; i++) {
        var selected = buttons[i].getAttribute("data-glass-stage") === activeId;
        buttons[i].setAttribute("aria-selected", selected ? "true" : "false");
        if (selected) movePill(buttons[i]);
      }

      if (send) send.setAttribute("href", stage.href);

      var trigger = root.querySelector(
        '[data-hero-funnel-trigger][data-hero-funnel-id="' + activeId + '"]'
      );
      if (focusTrigger && trigger) {
        trigger.click();
      }
    }

    function onFunnel(ev) {
      var detail = ev && ev.detail;
      if (!detail || !detail.open || !detail.id) return;
      setActiveStage(detail.id, false);
    }

    switcher.addEventListener("click", function (ev) {
      var btn = ev.target.closest("[data-glass-stage]");
      if (!btn || !switcher.contains(btn)) return;
      var id = btn.getAttribute("data-glass-stage");
      if (!id || id === activeId) return;
      setActiveStage(id, true);
    });

    switcher.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
      ev.preventDefault();
      var buttons = Array.prototype.slice.call(
        switcher.querySelectorAll("[data-glass-stage]")
      );
      var idx = buttons.findIndex(function (b) {
        return b.getAttribute("data-glass-stage") === activeId;
      });
      if (idx < 0) idx = 0;
      idx = ev.key === "ArrowRight" ? (idx + 1) % buttons.length : (idx - 1 + buttons.length) % buttons.length;
      setActiveStage(buttons[idx].getAttribute("data-glass-stage"), true);
      buttons[idx].focus();
    });

    document.addEventListener("wp:hero-funnel", onFunnel);

    frame.addEventListener("focusin", function () {
      frame.classList.add("is-active");
    });

    document.addEventListener("mousedown", function (ev) {
      if (frame.contains(ev.target)) return;
      frame.classList.remove("is-active");
    });

    document.addEventListener("touchstart", function (ev) {
      if (frame.contains(ev.target)) return;
      frame.classList.remove("is-active");
    });

    if (pathToggle && flash) {
      pathToggle.addEventListener("click", function () {
        var pressed = pathToggle.getAttribute("aria-pressed") === "true";
        pathToggle.setAttribute("aria-pressed", pressed ? "false" : "true");
        root.classList.toggle("wp-glass-compose--path-on", !pressed);
        if (flashTimer) window.clearTimeout(flashTimer);
        if (!pressed) {
          flash.hidden = false;
          flashTimer = window.setTimeout(function () {
            flash.hidden = true;
            flashTimer = 0;
          }, 1000);
        } else {
          flash.hidden = true;
        }
      });
    }

    function layoutPill() {
      var activeBtn = switcher.querySelector('[data-glass-stage][aria-selected="true"]');
      movePill(activeBtn || switcher.querySelector("[data-glass-stage]"));
    }

    setActiveStage("clarify", false);
    window.requestAnimationFrame(layoutPill);

    if (!reduced) {
      window.addEventListener("resize", layoutPill, { passive: true });
    }
  }

  function boot() {
    var root = document.querySelector(".wp-glass-compose[data-hero-funnel-root]");
    if (root) init(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
