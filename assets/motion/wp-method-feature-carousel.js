/**
 * Methodology Feature Carousel — WO-029 (Cult UI port)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var AUTOPLAY_MS = 5000;
  var TOTAL_STEPS = 4;

  function parseSteps(root) {
    var raw = root.getAttribute("data-method-carousel-steps");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_e) {
      return null;
    }
  }

  function announce(live, text) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () {
      live.textContent = text;
    }, 30);
  }

  WPM.register("method-carousel", {
    layer: 2,
    init: function (section, ctx) {
      var root = section && section.querySelector("[data-method-carousel]");
      if (!root) return;

      var steps = parseSteps(root);
      if (!steps || !steps.length) return;

      var reduced = ctx && ctx.reduced;
      var interval = parseInt(root.getAttribute("data-method-carousel-autoplay"), 10);
      if (!interval || interval < 2000) interval = AUTOPLAY_MS;

      var stepButtons = root.querySelectorAll("[data-method-carousel-step]");
      var stage = root.querySelector("[data-method-carousel-stage]");
      var titleEl = root.querySelector("[data-method-carousel-title]");
      var descEl = root.querySelector("[data-method-carousel-desc]");
      var chipsEl = root.querySelector("[data-method-carousel-chips]");
      var proofEl = root.querySelector("[data-method-carousel-proof]");
      var liveEl = root.querySelector("[data-method-carousel-live]");
      var progressBar = root.querySelector("[data-method-carousel-progress]");
      var images = root.querySelectorAll("[data-method-carousel-img]");
      var card = root.querySelector(".wp-method-carousel__card");

      var current = 0;
      var timer = 0;
      var progressTimer = 0;
      var progressStart = 0;
      var paused = false;
      var animating = false;

      function clearTimers() {
        window.clearTimeout(timer);
        window.clearInterval(progressTimer);
        timer = 0;
        progressTimer = 0;
      }

      function setCompletedButtons(index) {
        stepButtons.forEach(function (btn, i) {
          btn.setAttribute("data-completed", i < index ? "true" : "false");
          btn.setAttribute("aria-selected", i === index ? "true" : "false");
        });
      }

      function renderChips(chipList) {
        if (!chipsEl) return;
        chipsEl.innerHTML = "";
        (chipList || []).forEach(function (chip) {
          var li = document.createElement("li");
          li.className = "wp-method-carousel__chip";
          li.textContent = chip;
          chipsEl.appendChild(li);
        });
      }

      function showImages(stepIndex) {
        images.forEach(function (img) {
          var imgStep = parseInt(img.getAttribute("data-img-step"), 10);
          var slot = img.getAttribute("data-img-slot");
          var visible = imgStep === stepIndex;

          if (!visible) {
            img.classList.remove("wp-method-carousel__img--visible");
            return;
          }

          img.classList.add("wp-method-carousel__img--visible");
        });
      }

      if (proofEl) {
        proofEl.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }

      function applyStep(index, fromUser) {
        if (animating && fromUser) return;
        animating = true;
        current = (index + TOTAL_STEPS) % TOTAL_STEPS;
        var step = steps[current];

        root.setAttribute("data-step", String(current));
        setCompletedButtons(current);

        if (titleEl) titleEl.textContent = step.title || "";
        if (descEl) descEl.textContent = step.description || "";
        renderChips(step.chips);

        if (proofEl) {
          proofEl.href = step.proofHref || "#";
          proofEl.setAttribute("data-proof-preview-src", step.proofPreview || "");
          proofEl.setAttribute("data-proof-move", step.proofMove || "");
          var label = proofEl.querySelector("[data-method-carousel-proof-label]");
          if (label) label.textContent = step.proofLabel || "See proof";
        }

        showImages(current);
        announce(
          liveEl,
          "Step " + (current + 1) + " of " + TOTAL_STEPS + ": " + (step.title || "")
        );

        window.setTimeout(function () {
          animating = false;
        }, 320);

        if (!reduced && !paused) scheduleAutoplay();
      }

      function scheduleAutoplay() {
        clearTimers();
        if (reduced || paused) {
          if (progressBar) progressBar.style.width = "0%";
          return;
        }

        progressStart = Date.now();
        if (progressBar) progressBar.style.width = "0%";

        progressTimer = window.setInterval(function () {
          if (!progressBar) return;
          var elapsed = Date.now() - progressStart;
          var pct = Math.min(100, (elapsed / interval) * 100);
          progressBar.style.width = pct.toFixed(1) + "%";
        }, 120);

        timer = window.setTimeout(function () {
          applyStep(current + 1, false);
        }, interval);
      }

      function nextStep(fromUser) {
        applyStep(current + 1, fromUser);
      }

      stepButtons.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          paused = true;
          var idx = parseInt(btn.getAttribute("data-method-carousel-step"), 10);
          if (!isNaN(idx)) applyStep(idx, true);
        });
      });

      if (stage) {
        stage.addEventListener("click", function () {
          if (animating) return;
          paused = true;
          nextStep(true);
        });
      }

      if (card) {
        card.addEventListener("mousemove", function (e) {
          if (!card) return;
          var rect = card.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--method-glow-x", x.toFixed(1) + "%");
          card.style.setProperty("--method-glow-y", y.toFixed(1) + "%");
        });

        card.addEventListener("mouseenter", function () {
          paused = true;
          clearTimers();
          if (progressBar) progressBar.style.width = "0%";
        });

        card.addEventListener("mouseleave", function () {
          paused = false;
          scheduleAutoplay();
        });

        card.addEventListener("focusin", function () {
          paused = true;
          clearTimers();
        });

        card.addEventListener("focusout", function () {
          paused = false;
          scheduleAutoplay();
        });
      }

      section.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          paused = true;
          nextStep(true);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          paused = true;
          applyStep(current - 1, true);
        }
      });

      applyStep(0, false);

      return function destroy() {
        clearTimers();
      };
    },
  });
})();
