/**
 * My Experience bento — Aceternity 3D Pin brownfield port
 * Source parity: components/ui/3d-pin.tsx
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function initPinCard(card, ctx) {
    if (!card || !card.hasAttribute("data-bento-3d-pin")) return;

    var lift = card.querySelector("[data-bento-3d-pin-lift]");
    if (!lift) return;

    var finePointer =
      window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || ctx.reduced) return;

    var hoverZone = card.querySelector("[data-bento-3d-pin-hover]") || card;

    function activate() {
      card.classList.add("is-pin-active");
    }

    function deactivate() {
      card.classList.remove("is-pin-active");
    }

    function onMouseEnter() {
      activate();
    }

    function onMouseLeave(e) {
      window.requestAnimationFrame(function () {
        var x = e.clientX;
        var y = e.clientY;
        var zoneRect = hoverZone.getBoundingClientRect();
        var inZone =
          x >= zoneRect.left &&
          x <= zoneRect.right &&
          y >= zoneRect.top &&
          y <= zoneRect.bottom;
        var target = document.elementFromPoint(x, y);
        var inCardTree = target && card.contains(target);
        if (inZone || inCardTree) return;
        deactivate();
      });
    }

    card.addEventListener("mouseenter", onMouseEnter);
    card.addEventListener("mouseleave", onMouseLeave);
    card.addEventListener("focusin", activate);
    card.addEventListener("focusout", function (e) {
      if (!card.contains(e.relatedTarget)) deactivate();
    });

    return function destroy() {
      card.removeEventListener("mouseenter", onMouseEnter);
      card.removeEventListener("mouseleave", onMouseLeave);
      card.removeEventListener("focusin", activate);
      deactivate();
    };
  }

  WPM.register("bento-3d-pin", {
    layer: 2,
    init: function (_root, ctx) {
      var cards = document.querySelectorAll("[data-bento-3d-pin]");
      var i;
      var destroyers = [];
      for (i = 0; i < cards.length; i++) {
        var destroy = initPinCard(cards[i], ctx);
        if (destroy) destroyers.push(destroy);
      }
      return function destroyAll() {
        destroyers.forEach(function (fn) {
          fn();
        });
      };
    },
  });
})();
