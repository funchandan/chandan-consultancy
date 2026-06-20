/**
 * Hero v2 — RetroGrid + MorphingText + scroll grid flatten + flash → dark page.
 * index-hero-retrogrid-morph
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var KEYWORDS = [
    "Customer Experience",
    "Concept Validation",
    "User Acquisition",
    "Systems",
    "Building",
    "Systems Design",
  ];
  var SETTLE_KEYWORD = "System Design";
  var SETTLE_INDEX = 5;
  var MORPH_TIME = 1.5;
  var COOLDOWN_TIME = 0.5;
  var GRID_ANGLE_START = 58;
  var GRID_ANGLE_END = 1;
  var FLASH_SCROLL = 0.88;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  var LIGHT_RAYS_T = 0.9;
  var LIGHT_RAYS_LENGTH = "62vh";

  function publishLightRays(raysEl, t) {
    var root = document.documentElement;
    var tStr = clamp(t, 0, 1).toFixed(4);

    root.style.setProperty("--hero-light-rays-t", tStr);
    root.style.setProperty("--hero-light-rays-length", LIGHT_RAYS_LENGTH);

    if (raysEl) {
      if (t > 0.01) raysEl.setAttribute("data-hero-light-rays-active", "");
      else raysEl.removeAttribute("data-hero-light-rays-active");
    }
  }

  WPM.register("hero-retrogrid-morph", {
    layer: 1,
    init: function (hero, ctx) {
      if (!hero || !document.body.classList.contains("home-page--product")) return;

      var canvas = hero.querySelector(".statement-viewport__canvas");
      var title = hero.querySelector("#statement-title");
      var keywordSlot = hero.querySelector("[data-hero-keyword]");
      var canvasRoot = keywordSlot && keywordSlot.querySelector(".wp-hero-canvas-text");
      var gridRoot = hero.querySelector(".wp-hero-retrogrid");
      var gridPlane = hero.querySelector(".wp-hero-retrogrid__plane");
      var flash = hero.querySelector(".wp-hero-flash");

      if (!canvas || !title || !keywordSlot || !canvasRoot || !gridRoot || !gridPlane) return;

      var raysEl = hero.querySelector("[data-hero-light-rays]");
      var keywordIndex = 0;
      var rotateTimer = null;
      var flashDone = false;
      var settled = false;
      var lightRaysEngaged = false;
      var kwColors = KEYWORDS.length;
      var ROTATE_MS = (MORPH_TIME + COOLDOWN_TIME) * 1000;

      function engageLightRays() {
        if (lightRaysEngaged) return;
        lightRaysEngaged = true;
        if (raysEl && raysEl.parentElement !== document.body) {
          document.body.appendChild(raysEl);
        }
        publishLightRays(raysEl, LIGHT_RAYS_T);
        document.documentElement.classList.add("wp-hero-light-rays--engaged");
      }

      function scrollY() {
        if (window.WPScroll && typeof window.WPScroll.getY === "function") {
          return window.WPScroll.getY();
        }
        return window.scrollY || 0;
      }

      function heroProgress() {
        var h = hero.offsetHeight || 1;
        return Math.min(1, Math.max(0, scrollY() / h));
      }

      function setKeywordColor(idx) {
        var i = ((idx % kwColors) + kwColors) % kwColors;
        document.documentElement.style.setProperty("--wp-hero-slot-active", String(i));
        document.documentElement.style.setProperty(
          "--wp-hero-kw-active",
          "var(--wp-hero-kw-" + i + ")"
        );
        document.dispatchEvent(
          new CustomEvent("wp:hero-slot-change", {
            detail: { index: i, keyword: KEYWORDS[i] },
          })
        );
      }

      function updateAria(label) {
        title.setAttribute("aria-label", label);
      }

      function setKeywordCanvas(nextText, kwIndex) {
        if (!canvasRoot || !nextText) return;
        canvasRoot.setAttribute("data-canvas-text", nextText);
        canvasRoot.setAttribute("data-canvas-kw-index", String(kwIndex));
        document.dispatchEvent(
          new CustomEvent("wp:hero-canvas-update", {
            detail: { el: canvasRoot, text: nextText, kwIndex: kwIndex },
          })
        );
      }

      function showKeyword(idx, animateSwap) {
        var i = ((idx % kwColors) + kwColors) % kwColors;
        var text = KEYWORDS[i];
        if (animateSwap) keywordSlot.classList.add("is-swapping");
        setKeywordCanvas(text, i);
        setKeywordColor(i);
        updateAria(text);
        if (i >= 1) engageLightRays();
        if (animateSwap) {
          window.setTimeout(function () {
            keywordSlot.classList.remove("is-swapping");
          }, 320);
        }
      }

      function stopRotation() {
        if (rotateTimer) window.clearInterval(rotateTimer);
        rotateTimer = null;
      }

      function startRotation() {
        stopRotation();
        rotateTimer = window.setInterval(function () {
          if (settled) return;
          keywordIndex = (keywordIndex + 1) % kwColors;
          showKeyword(keywordIndex, true);
        }, ROTATE_MS);
      }

      function settleMorph() {
        settled = true;
        stopRotation();
        keywordSlot.classList.remove("is-swapping");
        keywordSlot.classList.add("wp-hero-keyword--static");
        setKeywordCanvas(SETTLE_KEYWORD, SETTLE_INDEX);
        setKeywordColor(SETTLE_INDEX);
        updateAria(SETTLE_KEYWORD);
      }

      function setGridAngle(deg, flat) {
        gridPlane.style.setProperty("--hero-grid-angle", deg + "deg");
        gridPlane.style.setProperty(
          "--hero-grid-shift",
          flat ? "-12vh" : "-42vh"
        );
        hero.style.setProperty("--hero-grid-angle", deg + "deg");
        if (flat) gridRoot.classList.add("wp-hero-retrogrid--flat");
        else gridRoot.classList.remove("wp-hero-retrogrid--flat");
      }

      function captureFlashBg() {
        var root = document.documentElement;
        var bg = getComputedStyle(document.body).backgroundColor;
        if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
          bg = getComputedStyle(root).backgroundColor;
        }
        if (root.classList.contains("wp-dot-grid-active")) {
          bg = "#08090d";
        }
        if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
          bg = "#f5f3ef";
        }
        if (flash) flash.style.setProperty("--wp-hero-flash-bg", bg);
        var fade = gridRoot.querySelector(".wp-hero-retrogrid__fade");
        if (fade) fade.style.setProperty("--wp-hero-retro-fade", bg);
      }

      function triggerDarkTheme() {
        if (flashDone) return;
        flashDone = true;
        if (flash && !ctx.reduced) {
          flash.classList.add("is-active");
          window.setTimeout(function () {
            document.documentElement.setAttribute("data-theme", "dark");
            document.body.classList.add("home-page--post-hero");
            flash.classList.remove("is-active");
          }, 480);
        } else {
          document.documentElement.setAttribute("data-theme", "dark");
          document.body.classList.add("home-page--post-hero");
        }
      }

      function onScroll() {
        var p = heroProgress();
        var deg = GRID_ANGLE_START + (GRID_ANGLE_END - GRID_ANGLE_START) * p;
        var flat = p >= 0.72;
        setGridAngle(deg, flat);

        if (p >= FLASH_SCROLL) {
          triggerDarkTheme();
          if (!settled) settleMorph();
        }
      }

      captureFlashBg();

      if (ctx.reduced) {
        showKeyword(0, false);
        keywordSlot.classList.add("wp-hero-keyword--static");
        setGridAngle(GRID_ANGLE_END, true);
        publishLightRays(raysEl, 0);
        document.documentElement.classList.add("wp-hero-light-rays--static");
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.add("home-page--post-hero");
        return;
      }

      publishLightRays(raysEl, 0);
      showKeyword(0, false);
      startRotation();

      var unbind = null;
      if (window.WPScroll && typeof window.WPScroll.on === "function") {
        unbind = window.WPScroll.on(onScroll);
      } else {
        window.addEventListener("scroll", onScroll, { passive: true });
        unbind = function () {
          window.removeEventListener("scroll", onScroll);
        };
      }
      window.addEventListener("wp-scroll", onScroll);
      var prevUnbind = unbind;
      unbind = function () {
        if (prevUnbind) prevUnbind();
        window.removeEventListener("wp-scroll", onScroll);
      };

      onScroll();

      return function destroy() {
        stopRotation();
        if (unbind) unbind();
      };
    },
  });
})();
