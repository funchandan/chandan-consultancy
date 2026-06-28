/**
 * Aceternity PlaceholdersAndVanishInput — hero glass compose prompt
 * Placeholder cycle uses Cult UI typewriter parity (components/ui/typewriter.tsx).
 */
(function () {
  "use strict";

  var DEFAULT_PLACEHOLDERS = [
    "Ask about the work",
    "Summarize a case study",
    "What shipped at HP field service?",
    "How do you run design programmes?",
    "Book a 30-minute conversation",
  ];

  var CANVAS_SIZE = 800;
  var TYPEWRITER_DELAY_S = 1;
  var TYPEWRITER_DURATION_MS = 1000;
  var TYPEWRITER_REPEAT_DELAY_MS = 1000;

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function parsePlaceholders(shell) {
    var raw = shell.getAttribute("data-vanish-placeholders");
    if (!raw) return DEFAULT_PLACEHOLDERS.slice();
    return raw
      .split("|")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function parseBaseText(shell) {
    return (shell.getAttribute("data-typewriter-base") || "").trim();
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(options) {
    var from = options.from;
    var to = options.to;
    var duration = options.duration;
    var delay = options.delay || 0;
    var ease = options.ease || easeInOutCubic;
    var onUpdate = options.onUpdate;
    var onComplete = options.onComplete;
    var cancelled = false;
    var startTime = null;
    var rafId = null;

    function frame(now) {
      if (cancelled) return;
      if (startTime === null) startTime = now;
      var elapsed = now - startTime - delay;
      if (elapsed < 0) {
        rafId = window.requestAnimationFrame(frame);
        return;
      }
      var t = Math.min(1, elapsed / duration);
      var value = from + (to - from) * ease(t);
      onUpdate(Math.round(value));
      if (t < 1) {
        rafId = window.requestAnimationFrame(frame);
      } else if (onComplete) {
        onComplete();
      }
    }

    rafId = window.requestAnimationFrame(frame);

    return function cancel() {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }

  function createTypewriter(placeholderEl, texts, baseText, reduced) {
    var baseSpan = document.createElement("span");
    baseSpan.className = "wp-glass-vanish-input__typewriter-text";
    baseSpan.setAttribute("data-typewriter-base", "");

    var cycleSpan = document.createElement("span");
    cycleSpan.className = "wp-glass-vanish-input__typewriter-text";
    cycleSpan.setAttribute("data-typewriter-cycle", "");

    var cursor = document.createElement("span");
    cursor.className = "wp-glass-vanish-input__cursor";
    cursor.setAttribute("aria-hidden", "true");

    placeholderEl.textContent = "";
    placeholderEl.appendChild(baseSpan);
    placeholderEl.appendChild(cycleSpan);
    placeholderEl.appendChild(cursor);

    var cancelAnim = null;
    var pauseTimer = null;
    var textIndex = 0;
    var running = false;

    function clearTimers() {
      if (cancelAnim) {
        cancelAnim();
        cancelAnim = null;
      }
      if (pauseTimer) {
        clearTimeout(pauseTimer);
        pauseTimer = null;
      }
    }

    function render(baseCount, cycleCount) {
      baseSpan.textContent = baseText.slice(0, baseCount);
      var activeText = texts[textIndex] || "";
      cycleSpan.textContent = activeText.slice(0, cycleCount);
    }

    function runCycleStep() {
      if (!running) return;
      var activeText = texts[textIndex] || "";
      var target = activeText.length;

      if (reduced) {
        render(baseText.length, target);
        pauseTimer = window.setTimeout(function () {
          textIndex = (textIndex + 1) % texts.length;
          runCycleStep();
        }, TYPEWRITER_REPEAT_DELAY_MS);
        return;
      }

      cancelAnim = animateCount({
        from: 0,
        to: target,
        duration: TYPEWRITER_DURATION_MS,
        ease: easeOutCubic,
        onUpdate: function (count) {
          render(baseText.length, count);
        },
        onComplete: function () {
          pauseTimer = window.setTimeout(function () {
            cancelAnim = animateCount({
              from: target,
              to: 0,
              duration: TYPEWRITER_DURATION_MS,
              ease: easeOutCubic,
              onUpdate: function (count) {
                render(baseText.length, count);
              },
              onComplete: function () {
                textIndex = (textIndex + 1) % texts.length;
                runCycleStep();
              },
            });
          }, TYPEWRITER_REPEAT_DELAY_MS);
        },
      });
    }

    function start() {
      if (running) return;
      running = true;
      textIndex = 0;
      clearTimers();
      render(0, 0);

      if (reduced) {
        render(baseText.length, (texts[0] || "").length);
        return;
      }

      if (!baseText.length) {
        pauseTimer = window.setTimeout(runCycleStep, TYPEWRITER_DELAY_S * 1000);
        return;
      }

      cancelAnim = animateCount({
        from: 0,
        to: baseText.length,
        duration: TYPEWRITER_DURATION_MS,
        delay: TYPEWRITER_DELAY_S * 1000,
        ease: easeInOutCubic,
        onUpdate: function (count) {
          render(count, 0);
        },
        onComplete: function () {
          pauseTimer = window.setTimeout(runCycleStep, TYPEWRITER_DELAY_S * 1000);
        },
      });
    }

    function stop() {
      running = false;
      clearTimers();
      render(0, 0);
    }

    return { start: start, stop: stop };
  }

  function attach(detail) {
    var shell = detail.root.querySelector("[data-glass-vanish-input]");
    var input = detail.input;
    if (!shell || !input) return;

    var placeholders = parsePlaceholders(shell);
    if (!placeholders.length) placeholders = DEFAULT_PLACEHOLDERS.slice();
    var baseText = parseBaseText(shell);
    var reduced = prefersReducedMotion();

    var canvas = document.createElement("canvas");
    canvas.className = "wp-glass-vanish-input__canvas";
    canvas.setAttribute("aria-hidden", "true");

    var placeholderLayer = document.createElement("div");
    placeholderLayer.className = "wp-glass-vanish-input__placeholder-layer";
    placeholderLayer.setAttribute("aria-hidden", "true");

    var placeholderEl = document.createElement("span");
    placeholderEl.className = "wp-glass-vanish-input__placeholder";
    placeholderEl.setAttribute("data-vanish-placeholder", "");
    placeholderLayer.appendChild(placeholderEl);

    shell.insertBefore(canvas, shell.firstChild);
    shell.insertBefore(placeholderLayer, shell.firstChild);

    input.removeAttribute("placeholder");

    var typewriter = createTypewriter(placeholderEl, placeholders, baseText, reduced);
    var animating = false;
    var particleData = [];

    function syncPlaceholderVisibility() {
      var hidden = input.value.length > 0 || animating;
      placeholderLayer.hidden = hidden;
      if (hidden) typewriter.stop();
      else typewriter.start();
    }

    function drawParticles() {
      var ctx = canvas.getContext("2d");
      if (!ctx) return;

      var cs = getComputedStyle(input);
      var fontSize = parseFloat(cs.fontSize) || 14;

      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.font = fontSize * 2 + "px " + cs.fontFamily;
      ctx.fillStyle = "#000";
      ctx.fillText(input.value, 16, 40);

      var imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      var pixels = imageData.data;
      var next = [];
      var t;
      var n;
      var i;
      var e;

      for (t = 0; t < CANVAS_SIZE; t++) {
        i = 4 * t * CANVAS_SIZE;
        for (n = 0; n < CANVAS_SIZE; n++) {
          e = i + 4 * n;
          if (pixels[e] !== 0 && pixels[e + 1] !== 0 && pixels[e + 2] !== 0) {
            next.push({
              x: n,
              y: t,
              r: 1,
              color:
                "rgba(" +
                pixels[e] +
                "," +
                pixels[e + 1] +
                "," +
                pixels[e + 2] +
                "," +
                pixels[e + 3] / 255 +
                ")",
            });
          }
        }
      }

      particleData = next;
    }

    function animateVanish(start, done) {
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        done();
        return;
      }

      function frame(pos) {
        window.requestAnimationFrame(function () {
          var next = [];
          var idx;
          var current;

          for (idx = 0; idx < particleData.length; idx++) {
            current = particleData[idx];
            if (current.x < pos) {
              next.push(current);
            } else {
              if (current.r <= 0) continue;
              current.x += Math.random() > 0.5 ? 1 : -1;
              current.y += Math.random() > 0.5 ? 1 : -1;
              current.r -= 0.05 * Math.random();
              next.push(current);
            }
          }

          particleData = next;
          ctx.clearRect(pos, 0, CANVAS_SIZE, CANVAS_SIZE);
          for (idx = 0; idx < particleData.length; idx++) {
            current = particleData[idx];
            if (current.x > pos) {
              ctx.beginPath();
              ctx.rect(current.x, current.y, current.r, current.r);
              ctx.fillStyle = current.color;
              ctx.fill();
            }
          }

          if (particleData.length > 0) {
            frame(pos - 8);
          } else {
            done();
          }
        });
      }

      frame(start);
    }

    function vanishThen(done) {
      var value = input.value.trim();
      if (!value) return;

      if (reduced) {
        input.value = "";
        syncPlaceholderVisibility();
        done(value);
        return;
      }

      animating = true;
      shell.classList.add("is-vanishing");
      syncPlaceholderVisibility();
      drawParticles();

      var maxX = 0;
      var idx;
      for (idx = 0; idx < particleData.length; idx++) {
        if (particleData[idx].x > maxX) maxX = particleData[idx].x;
      }

      function finish() {
        input.value = "";
        animating = false;
        shell.classList.remove("is-vanishing");
        syncPlaceholderVisibility();
        if (detail.resizeTextarea) detail.resizeTextarea();
        if (detail.syncSendState) detail.syncSendState();
        done(value);
      }

      if (!particleData.length) {
        finish();
        return;
      }

      animateVanish(maxX, finish);
    }

    detail.registerSubmit(function (_value, done) {
      vanishThen(done);
    });

    input.addEventListener("input", syncPlaceholderVisibility);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) typewriter.stop();
      else syncPlaceholderVisibility();
    });

    syncPlaceholderVisibility();
  }

  document.addEventListener("wp:glass-compose-init", function (ev) {
    if (ev && ev.detail) attach(ev.detail);
  });
})();
