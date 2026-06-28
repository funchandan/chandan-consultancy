/**
 * Post-hero interactive grid — Magic UI InteractiveGridPattern brownfield port (WO-024)
 * Source parity: components/ui/interactive-grid-pattern.tsx
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function readCellSize() {
    var root = getComputedStyle(document.documentElement);
    var raw = root.getPropertyValue("--wp-grid-cell-size").trim();
    var parsed = parseFloat(raw);
    return parsed > 0 ? parsed : 60;
  }

  var CELL_W = readCellSize();
  var CELL_H = CELL_W;

  WPM.register("bg-grid-after-hero", {
    layer: -1,
    init: function (_body, ctx) {
      if (!document.body.classList.contains("home-page--product")) return;

      var host = document.getElementById("bg-grid-after-hero");
      if (!host) return;

      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "bg-grid-after-hero__svg");
      svg.setAttribute("aria-hidden", "true");
      host.appendChild(svg);

      var cells = [];
      var gridCols = 0;
      var gridRows = 0;
      var hoveredIndex = -1;
      var finePointer =
        window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      function heroInsetTop() {
        var hero = document.getElementById("hero");
        if (!hero) return window.innerHeight;
        return Math.max(0, Math.round(hero.getBoundingClientRect().bottom));
      }

      function visibleRegion() {
        var hostRect = host.getBoundingClientRect();
        var top = Math.max(hostRect.top, heroInsetTop());
        return {
          left: hostRect.left,
          top: top,
          width: hostRect.width,
          height: Math.max(0, hostRect.bottom - top),
        };
      }

      function syncClip() {
        host.style.setProperty("--bg-grid-inset-top", heroInsetTop() + "px");
      }

      function setHover(index) {
        if (index === hoveredIndex) return;
        clearHover();
        if (index >= 0 && cells[index]) {
          hoveredIndex = index;
          cells[index].classList.add("is-hovered");
          cells[index].setAttribute("fill", "#ffb500");
          cells[index].setAttribute("fill-opacity", "0.5");
        }
      }

      function clearHover() {
        if (hoveredIndex >= 0 && cells[hoveredIndex]) {
          cells[hoveredIndex].classList.remove("is-hovered");
          cells[hoveredIndex].setAttribute("fill", "transparent");
          cells[hoveredIndex].setAttribute("fill-opacity", "0");
        }
        hoveredIndex = -1;
      }

      function render() {
        clearHover();
        cells = [];

        CELL_W = readCellSize();
        CELL_H = CELL_W;

        var region = visibleRegion();
        gridCols = Math.max(1, Math.ceil(region.width / CELL_W));
        gridRows = Math.max(1, Math.ceil(region.height / CELL_H));
        var w = gridCols * CELL_W;
        var h = gridRows * CELL_H;

        svg.setAttribute("width", String(w));
        svg.setAttribute("height", String(h));
        svg.setAttribute("viewBox", "0 0 " + w + " " + h);
        svg.style.height = region.height + "px";

        while (svg.firstChild) svg.removeChild(svg.firstChild);

        var i;
        var total = gridCols * gridRows;
        for (i = 0; i < total; i++) {
          var x = (i % gridCols) * CELL_W;
          var y = Math.floor(i / gridCols) * CELL_H;
          var rect = document.createElementNS(ns, "rect");
          rect.setAttribute("x", String(x));
          rect.setAttribute("y", String(y));
          rect.setAttribute("width", String(CELL_W));
          rect.setAttribute("height", String(CELL_H));
          rect.setAttribute("class", "bg-grid-after-hero__cell");
          rect.setAttribute("fill", "transparent");
          rect.setAttribute("fill-opacity", "1");

          if (finePointer && !ctx.reduced) {
            (function (idx, el) {
              el.addEventListener("mouseenter", function () {
                if (!host.classList.contains("is-active")) return;
                setHover(idx);
              });
              el.addEventListener("mouseleave", function () {
                if (hoveredIndex === idx) clearHover();
              });
            })(i, rect);
          }

          svg.appendChild(rect);
          cells.push(rect);
        }
      }

      function pointerToCell(clientX, clientY) {
        if (!document.body.classList.contains("home-page--post-hero")) return -1;
        if (!host.classList.contains("is-active")) return -1;

        var svgRect = svg.getBoundingClientRect();
        if (svgRect.height < 1 || svgRect.width < 1) return -1;
        if (
          clientX < svgRect.left ||
          clientX > svgRect.right ||
          clientY < svgRect.top ||
          clientY > svgRect.bottom
        ) {
          return -1;
        }

        var localX = clientX - svgRect.left;
        var localY = clientY - svgRect.top;
        var col = Math.min(gridCols - 1, Math.floor((localX / svgRect.width) * gridCols));
        var row = Math.min(gridRows - 1, Math.floor((localY / svgRect.height) * gridRows));
        return row * gridCols + col;
      }

      function onPointerMove(e) {
        if (!finePointer || ctx.reduced) return;
        setHover(pointerToCell(e.clientX, e.clientY));
      }

      function onPointerLeave() {
        clearHover();
      }

      function syncActive() {
        if (document.body.classList.contains("home-page--post-hero")) {
          host.classList.add("is-active");
        } else {
          host.classList.remove("is-active");
          clearHover();
        }
        syncClip();
        render();
      }

      syncClip();
      render();
      syncActive();

      if (finePointer && !ctx.reduced) {
        window.addEventListener("mousemove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("mouseleave", onPointerLeave);
      }

      var observer = new MutationObserver(syncActive);
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

      window.addEventListener(
        "resize",
        function () {
          syncClip();
          render();
        },
        { passive: true }
      );

      var unbindScroll = null;
      if (window.WPScroll && typeof window.WPScroll.on === "function") {
        unbindScroll = window.WPScroll.on(function () {
          syncClip();
          render();
        });
      } else {
        function onScroll() {
          syncClip();
          render();
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        unbindScroll = function () {
          window.removeEventListener("scroll", onScroll);
        };
      }
      window.addEventListener("wp-scroll", function () {
        syncClip();
        render();
      });

      return function destroy() {
        observer.disconnect();
        window.removeEventListener("mousemove", onPointerMove);
        document.documentElement.removeEventListener("mouseleave", onPointerLeave);
        if (unbindScroll) unbindScroll();
        host.classList.remove("is-active");
        while (host.firstChild) host.removeChild(host.firstChild);
        cells = [];
      };
    },
  });
})();
