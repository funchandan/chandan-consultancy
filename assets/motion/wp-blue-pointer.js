/**
 * Document-level blue custom pointer — MagicUI Pointer (colored) port.
 * MOTION-BLUE-POINTER-001
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var POINTER_SVG =
    '<svg class="wp-blue-pointer__svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>' +
    "</svg>";

  WPM.register("blue-pointer", {
    layer: 99,
    init: function (_root, ctx) {
      if (!document.body || !document.body.classList.contains("home-page--product")) {
        return;
      }

      if (ctx && ctx.reduced) return;

      if (
        !window.matchMedia ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }

      var pointer = document.createElement("div");
      pointer.className = "wp-blue-pointer";
      pointer.setAttribute("aria-hidden", "true");
      pointer.innerHTML = POINTER_SVG;
      document.body.appendChild(pointer);

      document.documentElement.classList.add("wp-blue-pointer-active");

      var visible = false;

      function setPosition(clientX, clientY) {
        pointer.style.transform =
          "translate3d(" +
          clientX +
          "px, " +
          clientY +
          "px, 0) translate(-50%, -50%)";
      }

      function onPointerMove(e) {
        setPosition(e.clientX, e.clientY);
        if (!visible) {
          pointer.classList.add("is-visible");
          visible = true;
        }
      }

      function onPointerLeave() {
        pointer.classList.remove("is-visible");
        visible = false;
      }

      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerLeave, {
        passive: true,
      });

      return function destroy() {
        document.removeEventListener("pointermove", onPointerMove);
        document.documentElement.removeEventListener("mouseleave", onPointerLeave);
        document.documentElement.classList.remove("wp-blue-pointer-active");
        if (pointer.parentNode) pointer.parentNode.removeChild(pointer);
      };
    },
  });
})();
