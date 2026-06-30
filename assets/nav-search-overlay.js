(function initNavSearchOverlay() {
  "use strict";

  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.hidden = true;
    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("nav-search-open");
  }

  function openOverlay(overlay) {
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.documentElement.classList.add("nav-search-open");
    var input = overlay.querySelector("[data-glass-prompt-input]");
    if (input) window.setTimeout(function () { input.focus(); }, 50);
  }

  function boot() {
    var toggle = document.querySelector("[data-nav-search-toggle]");
    var overlay = document.querySelector("[data-nav-search-overlay]");
    if (!toggle || !overlay) return;

    toggle.addEventListener("click", function () {
      var open = overlay.classList.contains("is-open");
      if (open) {
        closeOverlay(overlay);
        toggle.setAttribute("aria-expanded", "false");
      } else {
        openOverlay(overlay);
        toggle.setAttribute("aria-expanded", "true");
      }
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && overlay.classList.contains("is-open")) {
        closeOverlay(overlay);
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    overlay.addEventListener("click", function (ev) {
      if (ev.target === overlay) closeOverlay(overlay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
