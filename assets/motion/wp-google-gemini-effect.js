/**
 * Google Gemini scroll paths — Aceternity UI port (vanilla + WPScroll).
 * Publishes --hero-gemini-progress for CTA electrification (wp-gemini-cta-reveal.css).
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var PATHS = [
  {
    d: "M0 663C145.5 663 191 666.265 269 647C326.5 630 339.5 621 397.5 566C439 531.5 455 529.5 490 523C509.664 519.348 521 503.736 538 504.236C553.591 504.236 562.429 514.739 584.66 522.749C592.042 525.408 600.2 526.237 607.356 523.019C624.755 515.195 641.446 496.324 657 496.735C673.408 496.735 693.545 519.572 712.903 526.769C718.727 528.934 725.184 528.395 730.902 525.965C751.726 517.115 764.085 497.106 782 496.735C794.831 496.47 804.103 508.859 822.469 518.515C835.13 525.171 850.214 526.815 862.827 520.069C875.952 513.049 889.748 502.706 903.5 503.736C922.677 505.171 935.293 510.562 945.817 515.673C954.234 519.76 963.095 522.792 972.199 524.954C996.012 530.611 1007.42 534.118 1034 549C1077.5 573.359 1082.5 594.5 1140 629C1206 670 1328.5 662.5 1440 662.5",
    stroke: "#FFB7C5",
    start: 0.45,
  },
  {
    d: "M0 587.5C147 587.5 277 587.5 310 573.5C348 563 392.5 543.5 408 535C434 523.5 426 526.235 479 515.235C494 512.729 523 510.435 534.5 512.735C554.5 516.735 555.5 523.235 576 523.735C592 523.735 616 496.735 633 497.235C648.671 497.235 661.31 515.052 684.774 524.942C692.004 527.989 700.2 528.738 707.349 525.505C724.886 517.575 741.932 498.33 757.5 498.742C773.864 498.742 791.711 520.623 810.403 527.654C816.218 529.841 822.661 529.246 828.451 526.991C849.246 518.893 861.599 502.112 879.5 501.742C886.47 501.597 896.865 506.047 907.429 510.911C930.879 521.707 957.139 519.639 982.951 520.063C1020.91 520.686 1037.5 530.797 1056.5 537C1102.24 556.627 1116.5 570.704 1180.5 579.235C1257.5 589.5 1279 587 1440 588",
    stroke: "#FFDDB7",
    start: 0.30,
  },
  {
    d: "M0 514C147.5 514.333 294.5 513.735 380.5 513.735C405.976 514.94 422.849 515.228 436.37 515.123C477.503 514.803 518.631 506.605 559.508 511.197C564.04 511.706 569.162 512.524 575 513.735C588 516.433 616 521.702 627.5 519.402C647.5 515.402 659 499.235 680.5 499.235C700.5 499.235 725 529.235 742 528.735C757.654 528.735 768.77 510.583 791.793 500.59C798.991 497.465 807.16 496.777 814.423 499.745C832.335 507.064 850.418 524.648 866 524.235C882.791 524.235 902.316 509.786 921.814 505.392C926.856 504.255 932.097 504.674 937.176 505.631C966.993 511.248 970.679 514.346 989.5 514.735C1006.3 515.083 1036.5 513.235 1055.5 513.235C1114.5 513.235 1090.5 513.235 1124 513.235C1177.5 513.235 1178.99 514.402 1241 514.402C1317.5 514.402 1274.5 512.568 1440 513.235",
    stroke: "#B1C5FF",
    start: 0.25,
  },
  {
    d: "M0 438.5C150.5 438.5 261 438.318 323.5 456.5C351 464.5 387.517 484.001 423.5 494.5C447.371 501.465 472 503.735 487 507.735C503.786 512.212 504.5 516.808 523 518.735C547 521.235 564.814 501.235 584.5 501.235C604.5 501.235 626 529.069 643 528.569C658.676 528.569 672.076 511.63 695.751 501.972C703.017 499.008 711.231 498.208 718.298 501.617C735.448 509.889 751.454 529.98 767 529.569C783.364 529.569 801.211 507.687 819.903 500.657C825.718 498.469 832.141 499.104 837.992 501.194C859.178 508.764 873.089 523.365 891 523.735C907.8 524.083 923 504.235 963 506.735C1034.5 506.735 1047.5 492.68 1071 481.5C1122.5 457 1142.23 452.871 1185 446.5C1255.5 436 1294 439 1439.5 439",
    stroke: "#4FABFF",
    start: 0.20,
  },
  {
    d: "M0.5 364C145.288 362.349 195 361.5 265.5 378C322 391.223 399.182 457.5 411 467.5C424.176 478.649 456.916 491.677 496.259 502.699C498.746 503.396 501.16 504.304 503.511 505.374C517.104 511.558 541.149 520.911 551.5 521.236C571.5 521.236 590 498.736 611.5 498.736C631.5 498.736 652.5 529.236 669.5 528.736C685.171 528.736 697.81 510.924 721.274 501.036C728.505 497.988 736.716 497.231 743.812 500.579C761.362 508.857 778.421 529.148 794 528.736C810.375 528.736 829.35 508.68 848.364 502.179C854.243 500.169 860.624 500.802 866.535 502.718C886.961 509.338 898.141 519.866 916 520.236C932.8 520.583 934.5 510.236 967.5 501.736C1011.5 491 1007.5 493.5 1029.5 480C1069.5 453.5 1072 440.442 1128.5 403.5C1180.5 369.5 1275 360.374 1439 364",
    stroke: "#076EFF",
    start: 0.15,
  },
];

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function bindScroll(fn) {
    if (window.WPScroll && typeof window.WPScroll.on === "function") {
      return window.WPScroll.on(fn);
    }
    window.addEventListener("scroll", fn, { passive: true });
    return function () {
      window.removeEventListener("scroll", fn);
    };
  }

  function buildSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 300 1440 380");
    svg.setAttribute("width", "1440");
    svg.setAttribute("height", "380");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("wp-gemini-effect__svg");

    var defs = document.createElementNS(ns, "defs");
    var filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", "wp-gemini-blur");
    var blur = document.createElementNS(ns, "feGaussianBlur");
    blur.setAttribute("in", "SourceGraphic");
    blur.setAttribute("stdDeviation", "5");
    filter.appendChild(blur);
    defs.appendChild(filter);
    svg.appendChild(defs);

    var animated = [];
    PATHS.forEach(function (spec) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", spec.d);
      path.setAttribute("stroke", spec.stroke);
      path.setAttribute("pathLength", "1");
      path.classList.add("wp-gemini-effect__path");
      path.dataset.geminiStart = String(spec.start);
      svg.appendChild(path);
      animated.push(path);

      var glow = document.createElementNS(ns, "path");
      glow.setAttribute("d", spec.d);
      glow.setAttribute("stroke", spec.stroke);
      glow.setAttribute("pathLength", "1");
      glow.setAttribute("filter", "url(#wp-gemini-blur)");
      glow.classList.add("wp-gemini-effect__path", "wp-gemini-effect__path--blur");
      svg.appendChild(glow);
    });

    return { svg: svg, animated: animated };
  }

  function heroProgress(hero) {
    var heroH = hero.offsetHeight;
    var range = Math.min(window.innerHeight * 0.75, heroH * 0.85);
    if (range < 1) return 0;
    var traveled = Math.max(0, -hero.getBoundingClientRect().top);
    return clamp(traveled / range, 0, 1);
  }

  function applyPathLengths(paths, t) {
    var eased = clamp(t / 0.5, 0, 1);
    var end = 1.75;
    paths.forEach(function (path) {
      var start = parseFloat(path.dataset.geminiStart || "0");
      var length = lerp(start, end, eased);
      path.style.strokeDashoffset = String(1 - length);
    });
  }

  function applyManualStackOffset(hero) {
    var canvas = hero.querySelector(".statement-viewport__canvas");
    var manual = hero.getAttribute("data-gemini-stack-offset");
    if (!canvas || !manual) return;
    var value = /^\d+(\.\d+)?$/.test(manual) ? manual + "px" : manual;
    canvas.style.setProperty("--hero-gemini-stack-offset", value);
  }

  /* Horizontal paths terminate toward BoxBento search slot */
  function syncGeminiLayout(hero, effectRoot, svg) {
    var canvas = hero.querySelector(".statement-viewport__canvas");
    var searchSlot = document.querySelector("[data-box-bento-search]");
    if (!canvas || !effectRoot || !svg || !searchSlot) return;

    var canvasRect = canvas.getBoundingClientRect();
    var searchRect = searchSlot.getBoundingClientRect();
    var endX = searchRect.left - canvasRect.left + searchRect.width * 0.12;
    if (endX < 120) return;

    var bandH = Math.round(Math.min(320, Math.max(200, canvasRect.height * 0.32)));

    effectRoot.style.top = "auto";
    effectRoot.style.bottom = "0";
    effectRoot.style.left = "0";
    effectRoot.style.right = "0";
    effectRoot.style.height = bandH + "px";

    svg.style.top = "0";
    svg.style.bottom = "auto";
    svg.style.left = "0";
    svg.style.right = "0";
    svg.style.width = "100%";
    svg.style.height = bandH + "px";
    svg.style.maxHeight = "none";
    svg.setAttribute("preserveAspectRatio", "xMinYMid slice");
  }

  function scheduleGeminiLayout(hero, effectRoot, svg) {
    applyManualStackOffset(hero);
    window.requestAnimationFrame(function () {
      syncGeminiLayout(hero, effectRoot, svg);
    });
  }

  function watchGeminiLayout(hero, effectRoot, svg) {
    var searchSlot = document.querySelector("[data-box-bento-search]");
    var boxBento = document.querySelector("[data-box-bento]");
    var inner = hero.querySelector(".statement-viewport__inner.shell");
    var observers = [];

    function relayout() {
      scheduleGeminiLayout(hero, effectRoot, svg);
    }

    window.addEventListener("resize", relayout, { passive: true });
    document.addEventListener("wp:hero-slot-change", relayout);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(relayout);
    }

    if (searchSlot && typeof MutationObserver !== "undefined") {
      var classObserver = new MutationObserver(relayout);
      classObserver.observe(searchSlot, {
        attributes: true,
        attributeFilter: ["class", "hidden", "aria-hidden", "style"],
      });
      observers.push(classObserver);
    }

    if (typeof ResizeObserver !== "undefined") {
      if (inner) {
        var innerObserver = new ResizeObserver(relayout);
        innerObserver.observe(inner);
        observers.push(innerObserver);
      }
      if (searchSlot) {
        var searchObserver = new ResizeObserver(relayout);
        searchObserver.observe(searchSlot);
        observers.push(searchObserver);
      }
      if (boxBento) {
        var boxObserver = new ResizeObserver(relayout);
        boxObserver.observe(boxBento);
        observers.push(boxObserver);
      }
    }

    relayout();
    window.setTimeout(relayout, 120);
    window.setTimeout(relayout, 6000);

    return function disconnectLayoutWatch() {
      window.removeEventListener("resize", relayout);
      document.removeEventListener("wp:hero-slot-change", relayout);
      observers.forEach(function (observer) {
        observer.disconnect();
      });
    };
  }

  function publishCtaProgress(hero, progress) {
    var root = document.documentElement;
    var p = progress.toFixed(4);
    root.style.setProperty("--hero-gemini-progress", p);
    hero.style.setProperty("--hero-gemini-progress", p);

    var boxT = clamp((progress - 0.3) / 0.15, 0, 1);
    var boxTStr = boxT.toFixed(4);
    root.style.setProperty("--box-bento-t", boxTStr);
    hero.style.setProperty("--box-bento-t", boxTStr);

    var borderPeak = (4 * boxT * (1 - boxT)).toFixed(4);
    root.style.setProperty("--gemini-input-border-peak", borderPeak);
    hero.style.setProperty("--gemini-input-border-peak", borderPeak);

    var boxBento = document.querySelector("[data-box-bento]");
    if (boxBento) {
      if (boxT > 0.01) {
        boxBento.setAttribute("data-box-bento-active", "");
      } else {
        boxBento.removeAttribute("data-box-bento-active");
      }
      if (boxT >= 0.5) {
        boxBento.setAttribute("data-box-bento-interactive", "");
      } else {
        boxBento.removeAttribute("data-box-bento-interactive");
      }
    }

    var askBlock = document.querySelector("[data-box-bento-search] .wp-glass-compose");
    var promptInput = document.querySelector("#hero-glass-prompt");

    if (askBlock) {
      if (boxT >= 0.05) {
        askBlock.setAttribute("data-gemini-ask-visible", "");
        askBlock.removeAttribute("aria-hidden");
      } else {
        askBlock.removeAttribute("data-gemini-ask-visible");
        askBlock.setAttribute("aria-hidden", "true");
      }
      if (boxT >= 0.5) {
        askBlock.setAttribute("data-gemini-input-active", "");
      } else {
        askBlock.removeAttribute("data-gemini-input-active");
      }
    }

    if (promptInput) {
      if (boxT < 0.5) {
        promptInput.setAttribute("aria-hidden", "true");
        promptInput.setAttribute("tabindex", "-1");
      } else {
        promptInput.removeAttribute("aria-hidden");
        promptInput.removeAttribute("tabindex");
      }
    }
  }

  function setStaticReveal(staticOn) {
    var root = document.documentElement;
    if (staticOn) {
      root.classList.add("wp-gemini-cta-reveal--static");
      root.style.setProperty("--hero-gemini-progress", "1");
      root.style.setProperty("--box-bento-t", "1");
    } else {
      root.classList.remove("wp-gemini-cta-reveal--static");
    }
  }

  WPM.register("gemini-effect", {
    layer: 0,
    init: function (hero, ctx) {
      if (!hero || !document.body.classList.contains("home-page--product")) return;

      var canvas =
        hero.querySelector(".statement-viewport__canvas") || hero;
      var built = buildSvg();
      var root = document.createElement("div");
      root.className = "wp-gemini-effect";
      root.setAttribute("aria-hidden", "true");
      root.appendChild(built.svg);
      canvas.insertBefore(root, canvas.firstChild);

      document.documentElement.classList.add("wp-gemini-effect-ready");
      var disconnectLayoutWatch = watchGeminiLayout(hero, root, built.svg);

      if (ctx && ctx.reduced) {
        applyPathLengths(built.animated, 0.8);
        setStaticReveal(true);
        publishCtaProgress(hero, 1);
        return function destroy() {
          disconnectLayoutWatch();
          if (root.parentNode) root.parentNode.removeChild(root);
          document.documentElement.classList.remove("wp-gemini-effect-ready");
          setStaticReveal(false);
          document.documentElement.style.removeProperty("--hero-gemini-progress");
          document.documentElement.style.removeProperty("--box-bento-t");
          document.documentElement.style.removeProperty("--gemini-input-border-peak");
          var canvas = hero.querySelector(".statement-viewport__canvas");
          if (canvas) canvas.style.removeProperty("--hero-gemini-stack-offset");
        };
      }

      setStaticReveal(false);

      function update() {
        if (ctx && ctx.paused) return;
        var progress = heroProgress(hero);
        applyPathLengths(built.animated, progress);
        publishCtaProgress(hero, progress);
      }

      function onResize() {
        update();
        scheduleGeminiLayout(hero, root, built.svg);
      }

      update();
      var unbind = bindScroll(update);
      window.addEventListener("resize", onResize, { passive: true });

      return function destroy() {
        unbind();
        disconnectLayoutWatch();
        window.removeEventListener("resize", onResize);
        if (root.parentNode) root.parentNode.removeChild(root);
        document.documentElement.classList.remove("wp-gemini-effect-ready");
        setStaticReveal(false);
        document.documentElement.style.removeProperty("--hero-gemini-progress");
        document.documentElement.style.removeProperty("--box-bento-t");
        document.documentElement.style.removeProperty("--gemini-input-border-peak");
        var canvasEl = hero.querySelector(".statement-viewport__canvas");
        if (canvasEl) canvasEl.style.removeProperty("--hero-gemini-stack-offset");
      };
    },
  });
})();
