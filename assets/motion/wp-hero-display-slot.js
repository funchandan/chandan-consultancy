/**
 * Hero title — phased keyword story (made easy → for you → for your team).
 * MOTION-HERO-SLOT-002 / index-hero-keyword-made-easy
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  var KEYWORD_INTERVAL = 1.15;
  var FULL_SCRAMBLE_DURATION = 0.75;
  var KEYWORD_SCRAMBLE_DURATION = 0.65;
  var SETTLE_INDEX = 5;
  var SETTLE_KEYWORD = "System Design";

  var SUFFIXES = [
    { phase: "1", text: " made easy." },
    { phase: "2", text: " made easy for you." },
    { phase: "3", text: " personalised for your team." },
  ];

  var RM_SUFFIX = " made easy for your team.";
  var RM_KEYWORD_INDEX = 0;

  WPM.register("hero-slot", {
    layer: 2,
    init: function (slot, ctx) {
      if (!slot) return;

      var sentence = slot.closest(".statement-viewport__display-sentence");
      var display = slot.closest(".statement-viewport__display");
      var suffixEl = sentence && sentence.querySelector(".wp-hero-slot__suffix");
      var viewport = slot.querySelector(".wp-hero-slot__viewport");
      var track = slot.querySelector(".wp-hero-slot__track");
      if (!sentence || !display || !suffixEl || !viewport || !track) return;

      var words = track.querySelectorAll(".wp-hero-slot__word");
      var count = words.length;
      if (count < 1) return;

      var keywords = [];
      var suffixIndex = 0;
      var i;

      for (i = 0; i < words.length; i++) {
        keywords[i] = (words[i].textContent || "").trim();
      }

      var gsap = window.gsap;
      var introTimeline = null;
      var scrambleSurface = null;
      var fullSurface = null;
      var finished = false;

      function currentSuffix() {
        if (finished && suffixEl.getAttribute("data-hero-suffix-phase") === "rm") {
          return RM_SUFFIX;
        }
        return SUFFIXES[suffixIndex].text;
      }

      function updateAccessibleName(keywordLabel) {
        var phrase = (keywordLabel || keywords[0]) + currentSuffix();
        display.setAttribute("aria-label", phrase);
      }

      function composedPhrase(kwIndex, sufIndex) {
        var kw = keywords[kwIndex];
        if (
          sufIndex === SUFFIXES.length - 1 &&
          kwIndex === SETTLE_INDEX &&
          finished
        ) {
          kw = SETTLE_KEYWORD;
        }
        return kw + SUFFIXES[sufIndex || 0].text;
      }

      function allPhrasesForMeasure() {
        var list = [];
        var s;
        var k;
        for (s = 0; s < SUFFIXES.length; s++) {
          for (k = 0; k < keywords.length; k++) {
            list.push(keywords[k] + SUFFIXES[s].text);
          }
        }
        list.push(SETTLE_KEYWORD + SUFFIXES[2].text);
        list.push(keywords[RM_KEYWORD_INDEX] + RM_SUFFIX);
        return list;
      }

      function setSuffixPhase(index) {
        suffixIndex = index;
        var spec = SUFFIXES[suffixIndex];
        suffixEl.textContent = spec.text;
        suffixEl.setAttribute("data-hero-suffix-phase", spec.phase);
        document.dispatchEvent(
          new CustomEvent("wp:hero-suffix-change", {
            detail: { phase: spec.phase, text: spec.text },
          })
        );
        var activeKeyword =
          slot.querySelector(".wp-hero-slot__keyword") ||
          scrambleSurface ||
          fullSurface;
        var label = activeKeyword ? activeKeyword.textContent : keywords[0];
        updateAccessibleName(label);
      }

      function setKeywordIndex(n, displayKeyword) {
        var idx = ((n % count) + count) % count;
        var label = displayKeyword != null ? displayKeyword : keywords[idx];
        sentence.setAttribute("data-hero-slot-index", String(idx));
        slot.setAttribute("data-slot-index", String(idx));
        if (scrambleSurface) {
          scrambleSurface.setAttribute("data-slot-index", String(idx));
        }
        slot.style.setProperty("--wp-hero-slot-active", String(idx));
        document.documentElement.style.setProperty("--wp-hero-slot-active", String(idx));
        document.documentElement.style.setProperty(
          "--wp-hero-kw-active",
          "var(--wp-hero-kw-" + idx + ")"
        );
        updateAccessibleName(label);
        document.dispatchEvent(
          new CustomEvent("wp:hero-slot-change", {
            detail: { index: idx, keyword: label },
          })
        );
      }

      function measureMaxSentenceHeight() {
        var probe = document.createElement("span");
        probe.className = "wp-hero-slot__height-probe";
        probe.setAttribute("aria-hidden", "true");
        var cs = getComputedStyle(display);
        var phrases = allPhrasesForMeasure();
        probe.style.cssText =
          "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;width:" +
          Math.max(display.clientWidth, 1) +
          "px;display:block;font-family:" +
          cs.fontFamily +
          ";font-size:" +
          cs.fontSize +
          ";font-weight:" +
          cs.fontWeight +
          ";line-height:" +
          cs.lineHeight +
          ";letter-spacing:" +
          cs.letterSpacing +
          ";text-transform:uppercase;";
        display.appendChild(probe);
        var max = 0;
        for (i = 0; i < phrases.length; i++) {
          probe.textContent = phrases[i];
          max = Math.max(max, probe.offsetHeight);
        }
        probe.remove();
        return max || display.offsetHeight;
      }

      function lockSentenceHeight() {
        display.style.minHeight = measureMaxSentenceHeight() + "px";
      }

      function hideReelSource() {
        viewport.setAttribute("aria-hidden", "true");
        viewport.hidden = true;
      }

      function ensureFullSurface() {
        if (fullSurface) return fullSurface;
        fullSurface = document.createElement("span");
        fullSurface.className = "wp-hero-slot__scramble-full";
        fullSurface.setAttribute("data-slot-index", "0");
        sentence.insertBefore(fullSurface, slot);
        return fullSurface;
      }

      function removeFullSurface() {
        if (fullSurface && fullSurface.parentNode) {
          fullSurface.parentNode.removeChild(fullSurface);
        }
        fullSurface = null;
        sentence.classList.remove("wp-hero-slot-sentence--full-scramble");
      }

      function ensureScrambleSurface() {
        if (scrambleSurface) return scrambleSurface;
        scrambleSurface = document.createElement("span");
        scrambleSurface.className = "wp-hero-slot__scramble-surface";
        scrambleSurface.setAttribute("data-slot-index", "0");
        slot.insertBefore(scrambleSurface, viewport);
        return scrambleSurface;
      }

      function removeScrambleSurface() {
        if (scrambleSurface && scrambleSurface.parentNode) {
          scrambleSurface.parentNode.removeChild(scrambleSurface);
        }
        scrambleSurface = null;
      }

      function ensureStaticKeyword() {
        var keyword = slot.querySelector(".wp-hero-slot__keyword");
        if (!keyword) {
          keyword = document.createElement("span");
          keyword.className = "wp-hero-slot__keyword";
          slot.insertBefore(keyword, viewport);
        }
        return keyword;
      }

      function showSuffix() {
        suffixEl.hidden = false;
        suffixEl.removeAttribute("aria-hidden");
      }

      function enterKeywordMode(initialIndex) {
        removeFullSurface();
        slot.hidden = false;
        slot.removeAttribute("aria-hidden");
        showSuffix();

        var surface = ensureScrambleSurface();
        surface.hidden = false;
        surface.removeAttribute("aria-hidden");
        surface.textContent = keywords[initialIndex];
        setKeywordIndex(initialIndex);
      }

      function renderStaticPhrase(index, displayKeyword) {
        var keyword = ensureStaticKeyword();
        var text = displayKeyword != null ? displayKeyword : keywords[index];
        keyword.textContent = text;
        keyword.setAttribute("data-slot-index", String(index));
        showSuffix();
        removeScrambleSurface();
        removeFullSurface();
        hideReelSource();
        slot.hidden = false;
        slot.removeAttribute("aria-hidden");
        setKeywordIndex(index, text);
      }

      function settleFinal() {
        if (finished) return;
        finished = true;
        if (introTimeline) {
          introTimeline.kill();
          introTimeline = null;
        }
        setSuffixPhase(2);
        renderStaticPhrase(SETTLE_INDEX, SETTLE_KEYWORD);
        slot.classList.remove("wp-hero-slot--intro");
        slot.classList.add("wp-hero-slot--static");
        sentence.classList.remove("wp-hero-slot-sentence--intro");
        sentence.classList.add("wp-hero-slot-sentence--static");
        sentence.setAttribute("data-hero-suffix-phase", "4");
        lockSentenceHeight();
      }

      function settleReducedMotion() {
        if (finished) return;
        finished = true;
        if (introTimeline) {
          introTimeline.kill();
          introTimeline = null;
        }
        suffixEl.textContent = RM_SUFFIX;
        suffixEl.setAttribute("data-hero-suffix-phase", "rm");
        renderStaticPhrase(RM_KEYWORD_INDEX);
        slot.classList.remove("wp-hero-slot--intro");
        slot.classList.add("wp-hero-slot--static");
        sentence.classList.remove("wp-hero-slot-sentence--intro");
        sentence.classList.add("wp-hero-slot-sentence--static");
        lockSentenceHeight();
      }

      function scrambleFull(phraseIndex) {
        var target = composedPhrase(phraseIndex, 0);
        return {
          duration: FULL_SCRAMBLE_DURATION,
          overwrite: "auto",
          scrambleText: {
            text: target,
            chars: "upperCase",
            revealDelay: 0.12,
            speed: 0.45,
          },
          onStart: function () {
            setKeywordIndex(phraseIndex);
          },
          onComplete: function () {
            if (fullSurface) fullSurface.textContent = target;
            updateAccessibleName(keywords[phraseIndex]);
          },
        };
      }

      function scrambleKeyword(keywordIndex) {
        var target = keywords[keywordIndex];
        return {
          duration: KEYWORD_SCRAMBLE_DURATION,
          overwrite: "auto",
          scrambleText: {
            text: target,
            chars: "upperCase",
            revealDelay: 0.1,
            speed: 0.4,
          },
          onStart: function () {
            setKeywordIndex(keywordIndex);
          },
          onComplete: function () {
            if (scrambleSurface) scrambleSurface.textContent = target;
            updateAccessibleName(target);
          },
        };
      }

      function runIntro() {
        if (!gsap || typeof gsap.to !== "function") {
          settleReducedMotion();
          return;
        }

        slot.classList.add("wp-hero-slot--intro");
        sentence.classList.add("wp-hero-slot-sentence--intro");
        hideReelSource();
        lockSentenceHeight();
        setSuffixPhase(0);

        suffixEl.hidden = true;
        suffixEl.setAttribute("aria-hidden", "true");
        slot.hidden = true;
        slot.setAttribute("aria-hidden", "true");

        sentence.classList.add("wp-hero-slot-sentence--full-scramble");
        var full = ensureFullSurface();
        full.textContent = composedPhrase(0, 0);
        setKeywordIndex(0);

        var surface = ensureScrambleSurface();
        surface.hidden = true;
        surface.setAttribute("aria-hidden", "true");
        surface.textContent = keywords[0];

        introTimeline = gsap.timeline({
          defaults: { ease: "none" },
        });

        introTimeline.to(full, scrambleFull(0));
        introTimeline.addLabel("keywordStart", FULL_SCRAMBLE_DURATION);
        introTimeline.call(function () {
          enterKeywordMode(0);
        }, null, "keywordStart");

        var t = FULL_SCRAMBLE_DURATION;
        var phase;
        var step;
        var kw;
        var atTime;

        for (phase = 0; phase < SUFFIXES.length; phase++) {
          for (step = 1; step <= count; step++) {
            kw = step % count;
            t += KEYWORD_INTERVAL;
            atTime = t;
            (function (phaseIdx, keywordIdx, timePos) {
              introTimeline.call(
                function () {
                  if (finished) return;
                  if (keywordIdx === 0 && phaseIdx < SUFFIXES.length - 1) {
                    setSuffixPhase(phaseIdx + 1);
                  }
                },
                null,
                timePos - KEYWORD_SCRAMBLE_DURATION * 0.15
              );
              introTimeline.to(surface, scrambleKeyword(keywordIdx), timePos);
              if (phaseIdx === SUFFIXES.length - 1 && keywordIdx === 0) {
                introTimeline.call(
                  settleFinal,
                  null,
                  timePos + KEYWORD_SCRAMBLE_DURATION
                );
              }
            })(phase, kw, atTime);
          }
        }
      }

      lockSentenceHeight();
      setSuffixPhase(0);
      setKeywordIndex(0);

      if (ctx.reduced) {
        settleReducedMotion();
        return;
      }

      if (!gsap) {
        settleReducedMotion();
        return;
      }

      var paused = false;

      function onVis() {
        if (document.hidden) {
          if (!finished) settleFinal();
          return;
        }
        if (introTimeline && !finished) {
          if (paused) introTimeline.pause();
          else introTimeline.resume();
        }
      }

      function pause() {
        paused = true;
        if (introTimeline && !finished) introTimeline.pause();
      }

      function resume() {
        if (finished || ctx.reduced) return;
        paused = false;
        if (introTimeline) introTimeline.resume();
      }

      slot.addEventListener("pointerenter", pause, { passive: true });
      slot.addEventListener("pointerleave", resume, { passive: true });
      slot.addEventListener("focusin", pause);
      slot.addEventListener("focusout", resume);
      document.addEventListener("visibilitychange", onVis);

      var resizeTick = false;
      window.addEventListener(
        "resize",
        function () {
          if (resizeTick) return;
          resizeTick = true;
          requestAnimationFrame(function () {
            lockSentenceHeight();
            resizeTick = false;
          });
        },
        { passive: true }
      );

      runIntro();

      return function () {
        settleFinal();
        document.removeEventListener("visibilitychange", onVis);
        slot.removeEventListener("pointerenter", pause);
        slot.removeEventListener("pointerleave", resume);
        slot.removeEventListener("focusin", pause);
        slot.removeEventListener("focusout", resume);
      };
    },
  });
})();
