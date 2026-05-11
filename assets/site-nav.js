/**
 * Mobile primary nav: opens native <dialog> sheet (BMAD §7).
 * Degrades: if showModal is missing, toggle stays hidden via CSS and desktop links stay visible.
 */
(function () {
  document.documentElement.classList.add("js-motion");
  var root = document.documentElement;

  (function applyColorPlanFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var explicit = (params.get("ab") || "").toLowerCase();
      var stored = (localStorage.getItem("site-color-plan") || "").toLowerCase();
      var plan = explicit === "a" || explicit === "b" ? explicit : stored;
      if (plan === "a" || plan === "b") {
        root.setAttribute("data-color-plan", plan);
        localStorage.setItem("site-color-plan", plan);
      }
    } catch (_err) {
      /* no-op: keep defaults if storage/query parsing fails */
    }
  })();

  (function applyThemeFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var requested = (params.get("theme") || "").toLowerCase();
      if (requested === "light" || requested === "dark") {
        root.setAttribute("data-theme", requested);
        localStorage.setItem("site-theme", requested);
      }
    } catch (_err) {
      /* no-op: keep defaults if query parsing fails */
    }
  })();

  document.querySelectorAll("[data-site-nav]").forEach(function (root) {
    var openBtn = root.querySelector(".nav-menu-toggle");
    var dialog = root.querySelector(".site-nav-dialog");
    if (!openBtn || !dialog) return;

    if (typeof dialog.showModal !== "function") {
      return;
    }

    openBtn.addEventListener("click", function () {
      dialog.showModal();
      openBtn.setAttribute("aria-expanded", "true");
      openBtn.setAttribute("aria-label", "Close menu");
    });

    dialog.addEventListener("close", function () {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.setAttribute("aria-label", "Open menu");
      openBtn.focus();
    });

    dialog.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        dialog.close();
      });
    });
  });

  /** Home / same-page sections: .active follows location.hash for href="#…" nav links only. */
  function syncInPageNavActive() {
    var hash = (location.hash || "").toLowerCase();
    document.querySelectorAll('[data-site-nav] .nav-links a[href^="#"]').forEach(function (a) {
      var target = (a.getAttribute("href") || "").toLowerCase();
      if (hash && target === hash) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  }

  syncInPageNavActive();
  window.addEventListener("hashchange", syncInPageNavActive);

  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    return;
  }

  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll(
      ".section, .work-card, .hero-spotlight__card, .case-architect-chapter, .case-method-stage, .case-refresh-outcome-card"
    )
  );

  revealTargets.forEach(function (el) {
    el.classList.add("motion-enter");
  });

  var revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 }
  );

  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });

  var hero = document.querySelector("[data-hero-sequence]");
  if (hero) {
    var headline = hero.querySelector(".hero-type-target");
    var typePauseMs = 500;
    var linePauseMs = 420;
    var postTypePauseMs = 980;
    var charIntervalMs = 40;
    var line1El = headline ? headline.querySelector("[data-hero-line1]") : null;
    var line2El = headline ? headline.querySelector("[data-hero-line2]") : null;
    var caretEl = null;
    var activeTypeTarget = null;

    function ensureCaret() {
      if (!headline || caretEl) return;
      caretEl = document.createElement("span");
      caretEl.className = "hero-type-caret";
      caretEl.setAttribute("aria-hidden", "true");
      headline.appendChild(caretEl);
    }

    function setCaretAtEnd(targetEl) {
      if (!headline || !targetEl || !caretEl) return;
      var headlineRect = headline.getBoundingClientRect();
      var rangeRect = null;

      // Measure the actual rendered end of text to avoid visual drift/gaps.
      if (targetEl.firstChild && targetEl.firstChild.nodeType === Node.TEXT_NODE) {
        var range = document.createRange();
        range.selectNodeContents(targetEl);
        range.collapse(false);
        var rects = range.getClientRects();
        if (rects.length) {
          rangeRect = rects[rects.length - 1];
        }
      }

      var targetRect = rangeRect || targetEl.getBoundingClientRect();
      var x = targetRect.right - headlineRect.left;
      var y = targetRect.top - headlineRect.top + (targetRect.height - targetRect.height * 0.95) / 2;
      headline.style.setProperty("--caret-x", x.toFixed(2) + "px");
      headline.style.setProperty("--caret-y", y.toFixed(2) + "px");
    }

    function syncCaretPosition() {
      if (!headline || !headline.classList.contains("is-typing")) return;
      setCaretAtEnd(activeTypeTarget || line1El || headline);
    }

    if (prefersReducedMotion || !headline) {
      hero.classList.add("hero-sequenced");
    } else {
      var fullText = (headline.textContent || "").trim();
      var line1Text = line1El ? (line1El.textContent || "").trim() : "";
      var line2Text = line2El ? (line2El.textContent || "").trim() : "";

      if (line1El && line2El) {
        line1El.textContent = "";
        line2El.textContent = "";
      } else {
        headline.textContent = "";
      }
      ensureCaret();
      hero.classList.add("hero-intro");
      headline.classList.add("is-typing");
      activeTypeTarget = line1El || headline;
      if (line1El) {
        setCaretAtEnd(line1El);
      }
      window.addEventListener("resize", syncCaretPosition);

      window.setTimeout(function () {
        function finishIntro() {
          headline.classList.remove("is-typing");
          activeTypeTarget = null;
          window.removeEventListener("resize", syncCaretPosition);
          window.setTimeout(function () {
            hero.classList.remove("hero-intro");
            hero.classList.add("hero-sequenced");
          }, postTypePauseMs);
        }

        function typeText(targetEl, text, done) {
          activeTypeTarget = targetEl;
          var index = 0;
          var typer = window.setInterval(function () {
            index += 1;
            targetEl.textContent = text.slice(0, index);
            setCaretAtEnd(targetEl);
            if (index >= text.length) {
              window.clearInterval(typer);
              done();
            }
          }, charIntervalMs);
        }

        if (line1El && line2El) {
          typeText(line1El, line1Text, function () {
            window.setTimeout(function () {
              line2El.style.visibility = "visible";
              typeText(line2El, line2Text, finishIntro);
            }, linePauseMs);
          });
        } else {
          activeTypeTarget = headline;
          var index = 0;
          var typer = window.setInterval(function () {
            index += 1;
            headline.textContent = fullText.slice(0, index);
            if (caretEl && caretEl.parentNode === headline) {
              headline.appendChild(caretEl);
            }
            setCaretAtEnd(headline);
            if (index >= fullText.length) {
              window.clearInterval(typer);
              finishIntro();
            }
          }, charIntervalMs);
        }
      }, typePauseMs);
    }
  }
})();
