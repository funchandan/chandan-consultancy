/**
 * Hero kinetic slot — vertical reel with calm pacing (WO-013 / cinematic hero)
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  WPM.register("hero-slot", {
    layer: 2,
    init: function (slot, ctx) {
      if (!slot) return;

      var viewport = slot.querySelector(".wp-hero-slot__viewport");
      var track = slot.querySelector(".wp-hero-slot__track");
      if (!viewport || !track) return;

      var words = track.querySelectorAll(".wp-hero-slot__word");
      var count = words.length;
      if (count < 2) return;

      var dots = document.querySelectorAll(
        "#statement-range .wp-hero-range__dot[data-slot-index]"
      );
      var holdMs = parseInt(slot.getAttribute("data-hero-slot-hold") || "4800", 10);
      var rollMs = parseInt(slot.getAttribute("data-hero-slot-roll") || "1400", 10);
      var index = 0;
      var step = 0;
      var timer = null;
      var paused = false;
      var rolling = false;

      function setActive(i) {
        var n = ((i % count) + count) % count;
        for (var w = 0; w < words.length; w++) {
          words[w].classList.toggle("is-active", w === n);
        }
        for (var d = 0; d < dots.length; d++) {
          var di = parseInt(dots[d].getAttribute("data-slot-index") || "0", 10);
          dots[d].classList.toggle("is-active", di === n);
        }
        slot.style.setProperty("--wp-hero-slot-active", String(n));
        document.documentElement.style.setProperty("--wp-hero-slot-active", String(n));
        document.documentElement.style.setProperty(
          "--wp-hero-kw-active",
          "var(--wp-hero-kw-" + n + ")"
        );
        index = n;
      }

      function measure() {
        var first = words[0];
        if (!first) return;
        var h = first.getBoundingClientRect().height;
        if (h < 1) {
          h = parseFloat(getComputedStyle(first).lineHeight) || 48;
        }
        step = Math.round(h);
        viewport.style.setProperty("--wp-hero-slot-step", step + "px");
        track.style.transform = "translate3d(0," + -index * step + "px,0)";
      }

      function advance() {
        if (rolling || paused || ctx.reduced || document.hidden) return;
        rolling = true;
        var next = (index + 1) % count;
        var done = false;
        slot.classList.add("wp-hero-slot--reel");
        track.style.transform = "translate3d(0," + -next * step + "px,0)";

        function finish() {
          if (done) return;
          done = true;
          track.removeEventListener("transitionend", finish);
          slot.classList.remove("wp-hero-slot--reel");
          setActive(next);
          rolling = false;
          schedule();
        }

        track.addEventListener("transitionend", finish);
        window.setTimeout(finish, rollMs + 160);
      }

      function schedule() {
        if (timer) window.clearTimeout(timer);
        if (ctx.reduced || paused || document.hidden) return;
        timer = window.setTimeout(advance, holdMs);
      }

      function pause() {
        paused = true;
        if (timer) window.clearTimeout(timer);
      }

      function resume() {
        if (ctx.reduced) return;
        paused = false;
        schedule();
      }

      track.style.setProperty("transition-duration", rollMs + "ms");
      measure();
      setActive(0);

      if (ctx.reduced) return;

      slot.addEventListener("pointerenter", pause, { passive: true });
      slot.addEventListener("pointerleave", resume, { passive: true });
      slot.addEventListener("focusin", pause);
      slot.addEventListener("focusout", resume);

      var resizeTick = false;
      window.addEventListener(
        "resize",
        function () {
          if (resizeTick) return;
          resizeTick = true;
          requestAnimationFrame(function () {
            measure();
            resizeTick = false;
          });
        },
        { passive: true }
      );

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) pause();
        else resume();
      });

      schedule();

      return function () {
        pause();
        slot.removeEventListener("pointerenter", pause);
        slot.removeEventListener("pointerleave", resume);
        slot.removeEventListener("focusin", pause);
        slot.removeEventListener("focusout", resume);
      };
    },
  });
})();
