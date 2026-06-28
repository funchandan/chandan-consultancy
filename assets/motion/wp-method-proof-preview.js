/**
 * Method proof hover preview — Release D (desktop, fine pointer)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function canHoverPreview() {
    return (
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }

  WPM.register("method-proof-preview", {
    layer: 3,
    init: function (section, ctx) {
      if (!section || (ctx && ctx.reduced) || !canHoverPreview()) return;

      var links = section.querySelectorAll("[data-methodology-proof-link]");
      if (!links.length) return;

      var panel = document.createElement("div");
      panel.className = "wp-method-proof-preview";
      panel.setAttribute("aria-hidden", "true");
      panel.hidden = true;

      var img = document.createElement("img");
      img.className = "wp-method-proof-preview__img";
      img.alt = "";
      img.width = 200;
      img.height = 200;
      img.decoding = "async";
      panel.appendChild(img);
      document.body.appendChild(panel);

      var showTimer = 0;
      var activeLink = null;

      function hidePreview() {
        window.clearTimeout(showTimer);
        showTimer = 0;
        activeLink = null;
        panel.hidden = true;
        panel.setAttribute("aria-hidden", "true");
        panel.classList.remove("wp-method-proof-preview--visible");
      }

      function positionPanel(link) {
        var rect = link.getBoundingClientRect();
        var panelRect = panel.getBoundingClientRect();
        var left = rect.left + rect.width * 0.5 - panelRect.width * 0.5;
        var top = rect.top - panelRect.height - 12;

        left = Math.max(12, Math.min(left, window.innerWidth - panelRect.width - 12));
        if (top < 12) top = rect.bottom + 12;

        panel.style.left = left + "px";
        panel.style.top = top + "px";
      }

      function showPreview(link) {
        var src =
          link.getAttribute("data-proof-preview-src") ||
          (link.querySelector(".wp-method-line__thumb") &&
            link.querySelector(".wp-method-line__thumb").getAttribute("src"));

        if (!src) return;

        activeLink = link;
        img.src = src;
        panel.hidden = false;
        panel.setAttribute("aria-hidden", "false");
        panel.classList.add("wp-method-proof-preview--visible");
        positionPanel(link);
      }

      links.forEach(function (link) {
        link.addEventListener("mouseenter", function () {
          window.clearTimeout(showTimer);
          showTimer = window.setTimeout(function () {
            showPreview(link);
          }, 200);
        });

        link.addEventListener("mouseleave", function () {
          if (activeLink === link) hidePreview();
        });

        link.addEventListener("focus", hidePreview);
      });

      window.addEventListener("scroll", hidePreview, { passive: true });
      window.addEventListener("resize", hidePreview);

      return function destroy() {
        hidePreview();
        panel.remove();
        window.removeEventListener("scroll", hidePreview);
        window.removeEventListener("resize", hidePreview);
      };
    },
  });
})();
