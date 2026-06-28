/**
 * Magic UI Iphone bezel — mounts frame around .wp-project-case__device wireframes.
 * Parity: components/ui/iphone.tsx
 */
(function () {
  "use strict";

  var PHONE_WIDTH = 433;
  var PHONE_HEIGHT = 882;
  var SCREEN_X = 21.25;
  var SCREEN_Y = 19.25;
  var SCREEN_WIDTH = 389.5;
  var SCREEN_HEIGHT = 843.5;
  var SCREEN_RADIUS = 55.75;
  var NS = "http://www.w3.org/2000/svg";
  var maskCounter = 0;

  var LEFT_PCT = ((SCREEN_X / PHONE_WIDTH) * 100).toFixed(4) + "%";
  var TOP_PCT = ((SCREEN_Y / PHONE_HEIGHT) * 100).toFixed(4) + "%";
  var WIDTH_PCT = ((SCREEN_WIDTH / PHONE_WIDTH) * 100).toFixed(4) + "%";
  var HEIGHT_PCT = ((SCREEN_HEIGHT / PHONE_HEIGHT) * 100).toFixed(4) + "%";
  var RADIUS_H = ((SCREEN_RADIUS / SCREEN_WIDTH) * 100).toFixed(3) + "%";
  var RADIUS_V = ((SCREEN_RADIUS / SCREEN_HEIGHT) * 100).toFixed(3) + "%";

  function path(svg, d, fill, opts) {
    opts = opts || {};
    var el = document.createElementNS(NS, "path");
    el.setAttribute("d", d);
    el.setAttribute("fill", fill);
    if (opts.opacity) el.setAttribute("opacity", opts.opacity);
    if (opts.mask) el.setAttribute("mask", "url(#" + opts.mask + ")");
    if (opts.stroke) {
      el.setAttribute("stroke", opts.stroke);
      el.setAttribute("stroke-width", opts.strokeWidth || "1");
    }
    svg.appendChild(el);
  }

  function createBezelSvg(maskId) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + PHONE_WIDTH + " " + PHONE_HEIGHT);
    svg.setAttribute("fill", "none");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("class", "wp-iphone-frame__bezel");
    svg.setAttribute("aria-hidden", "true");

    var frame = "#A3A3A3";
    var inner = "#404040";
    var accent = "#E5E5E5";
    var stroke = "rgba(255,255,255,0.38)";

    var defs = document.createElementNS(NS, "defs");
    var mask = document.createElementNS(NS, "mask");
    mask.setAttribute("id", maskId);
    mask.setAttribute("maskUnits", "userSpaceOnUse");

    var maskBg = document.createElementNS(NS, "rect");
    maskBg.setAttribute("x", "0");
    maskBg.setAttribute("y", "0");
    maskBg.setAttribute("width", String(PHONE_WIDTH));
    maskBg.setAttribute("height", String(PHONE_HEIGHT));
    maskBg.setAttribute("fill", "white");

    var maskHole = document.createElementNS(NS, "rect");
    maskHole.setAttribute("x", String(SCREEN_X));
    maskHole.setAttribute("y", String(SCREEN_Y));
    maskHole.setAttribute("width", String(SCREEN_WIDTH));
    maskHole.setAttribute("height", String(SCREEN_HEIGHT));
    maskHole.setAttribute("rx", String(SCREEN_RADIUS));
    maskHole.setAttribute("ry", String(SCREEN_RADIUS));
    maskHole.setAttribute("fill", "black");

    mask.appendChild(maskBg);
    mask.appendChild(maskHole);
    defs.appendChild(mask);
    svg.appendChild(defs);

    var maskOpt = { mask: maskId };

    path(
      svg,
      "M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z",
      frame,
      Object.assign({ stroke: stroke, strokeWidth: "1.25" }, maskOpt)
    );
    path(
      svg,
      "M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z",
      frame,
      maskOpt
    );
    path(
      svg,
      "M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z",
      frame,
      maskOpt
    );
    path(
      svg,
      "M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z",
      frame,
      maskOpt
    );
    path(
      svg,
      "M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z",
      frame,
      maskOpt
    );
    path(
      svg,
      "M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z",
      inner,
      maskOpt
    );
    path(
      svg,
      "M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z",
      frame,
      { opacity: "0.5" }
    );
    path(
      svg,
      "M" +
        SCREEN_X +
        " 75C" +
        SCREEN_X +
        " 44.2101 46.2101 " +
        SCREEN_Y +
        " 77 " +
        SCREEN_Y +
        "H355C385.79 " +
        SCREEN_Y +
        " 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 " +
        SCREEN_X +
        " 837.79 " +
        SCREEN_X +
        " 807V75Z",
      frame,
      Object.assign({ stroke: stroke, strokeWidth: "0.75" }, maskOpt)
    );
    path(
      svg,
      "M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z",
      accent,
      null
    );
    path(
      svg,
      "M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z",
      accent,
      null
    );
    path(
      svg,
      "M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z",
      frame,
      null
    );

    return svg;
  }

  function mount(figure) {
    if (figure.querySelector(".wp-iphone-frame__shell")) return;
    var img = figure.querySelector(":scope > img");
    if (!img) return;

    maskCounter += 1;
    var maskId = "wp-iphone-screen-punch-" + maskCounter;

    figure.classList.add("wp-iphone-frame");

    var shell = document.createElement("div");
    shell.className = "wp-iphone-frame__shell";

    var screen = document.createElement("div");
    screen.className = "wp-iphone-frame__screen";
    screen.style.left = LEFT_PCT;
    screen.style.top = TOP_PCT;
    screen.style.width = WIDTH_PCT;
    screen.style.height = HEIGHT_PCT;
    screen.style.borderRadius = RADIUS_H + " / " + RADIUS_V;

    figure.removeChild(img);
    screen.appendChild(img);
    shell.appendChild(screen);
    shell.appendChild(createBezelSvg(maskId));
    figure.appendChild(shell);
  }

  function boot() {
    document
      .querySelectorAll(".wp-project-case__device[data-wp-iphone-frame]")
      .forEach(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
