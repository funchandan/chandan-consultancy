/**
 * Hero project response strip — funnel + View work interaction
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  WPM.register("hero-project-strip", {
    layer: 1,
    init: function (hero) {
      if (!hero || !document.body.classList.contains("home-page--product")) return;

      var strip = hero.querySelector(".wp-hero-project-strip");
      if (!strip) return;

      var viewWork = hero.querySelector(".statement-viewport__skip");

      function setActive(id) {
        if (id) {
          hero.setAttribute("data-hero-project-active", id);
        } else {
          hero.removeAttribute("data-hero-project-active");
        }
      }

      function onFunnel(ev) {
        var detail = ev && ev.detail;
        if (!detail || !detail.open || !detail.id) {
          setActive(null);
          return;
        }
        setActive(detail.id);
      }

      document.addEventListener("wp:hero-funnel", onFunnel);

      function setWorkHover(on) {
        if (on) hero.setAttribute("data-hero-work-hover", "");
        else hero.removeAttribute("data-hero-work-hover");
        document.dispatchEvent(
          new CustomEvent("wp:hero-work-hover", { detail: { hover: on } })
        );
      }

      if (viewWork) {
        viewWork.addEventListener("mouseenter", function () {
          setWorkHover(true);
        });
        viewWork.addEventListener("mouseleave", function () {
          setWorkHover(false);
        });
        viewWork.addEventListener("focus", function () {
          setWorkHover(true);
        });
        viewWork.addEventListener("blur", function () {
          setWorkHover(false);
        });
      }

      return function destroy() {
        document.removeEventListener("wp:hero-funnel", onFunnel);
        hero.removeAttribute("data-hero-project-active");
        hero.removeAttribute("data-hero-work-hover");
      };
    },
  });
})();
