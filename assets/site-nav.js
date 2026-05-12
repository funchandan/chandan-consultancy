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

  // Session-only `?theme=light|dark` override for review/screenshots.
  // Intentionally does not persist: v1 has no in-nav toggle, so persistence
  // would strand users without a way to revert. Re-introduce alongside the
  // Cmd+K palette in v2.
  (function applyThemeFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var requested = (params.get("theme") || "").toLowerCase();
      if (requested === "light" || requested === "dark") {
        root.setAttribute("data-theme", requested);
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

/* === Telemetry shim (Slice C-1 + Methodology v0 bundled) =====================
 *
 * Provider-agnostic event router. Wraps every event in DNT respect and
 * sessionStorage state. Real provider wiring happens at the adapter slot
 * at the bottom of this file; until an adapter is wired, events fall back
 * to console.log so local development and PR review can verify behavior.
 *
 * Implements:
 *   - FR-NAV-TEL-* (nav engagement + CTA click; see prd-navbar-revamp.md)
 *   - FR-MF-TEL-01..04 (methodology section + frame + CTA + exit; see prd-methodology-funnel.md)
 *
 * DNT, sessionStorage-only, dictionaryVersion stamping — all centralized here.
 */
(function () {
  var DICTIONARY_VERSION_CACHE = null;
  var METHODOLOGY_CONTENT_VERSION = 0;
  var SESSION_KEY_ENGAGED = "__nav_engaged_session";
  var SESSION_KEY_METHODOLOGY_ENTERED = "__methodology_entered_session";

  function isDoNotTrack() {
    try {
      var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      return dnt === "1" || dnt === "yes";
    } catch (_err) {
      return false;
    }
  }

  function readDictionaryVersion(callback) {
    if (DICTIONARY_VERSION_CACHE !== null) {
      callback(DICTIONARY_VERSION_CACHE);
      return;
    }
    try {
      var req = new XMLHttpRequest();
      req.open("GET", "assets/nav-content.json", true);
      req.onload = function () {
        try {
          var data = JSON.parse(req.responseText);
          DICTIONARY_VERSION_CACHE = data && data.version ? data.version : "unknown";
        } catch (_err) {
          DICTIONARY_VERSION_CACHE = "unknown";
        }
        callback(DICTIONARY_VERSION_CACHE);
      };
      req.onerror = function () {
        DICTIONARY_VERSION_CACHE = "unknown";
        callback(DICTIONARY_VERSION_CACHE);
      };
      req.send();
    } catch (_err) {
      DICTIONARY_VERSION_CACHE = "unknown";
      callback(DICTIONARY_VERSION_CACHE);
    }
  }

  // Publish dictionaryVersion to window once available so other shim sections
  // can read it synchronously without re-fetching.
  readDictionaryVersion(function (version) {
    window.__navTelemetryDictionaryVersion = version;
  });

  function track(eventName, props) {
    if (isDoNotTrack()) return;
    var payload = {};
    if (props && typeof props === "object") {
      for (var k in props) {
        if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
      }
    }
    payload.dictionaryVersion = window.__navTelemetryDictionaryVersion || "pending";
    payload.methodologyContentVersion = METHODOLOGY_CONTENT_VERSION;

    try {
      if (typeof window.__navTelemetryAdapter === "function") {
        window.__navTelemetryAdapter(eventName, payload);
      } else {
        console.log("[telemetry]", eventName, payload);
      }
    } catch (_err) {
      /* swallow — telemetry must never break the page */
    }
  }

  // Export for other shim sections (methodology block uses these)
  window.__navTrack = track;
  window.__navIsDoNotTrack = isDoNotTrack;

  /* === Nav engagement (FR-NAV-TEL-01) =================================== */

  function hasEngagedThisSession() {
    try {
      return window.sessionStorage.getItem(SESSION_KEY_ENGAGED) === "1";
    } catch (_err) {
      return false;
    }
  }

  function setEngagedThisSession() {
    if (isDoNotTrack()) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY_ENGAGED, "1");
    } catch (_err) {
      /* sessionStorage may be unavailable in some embed contexts; silent fail */
    }
  }

  function markEngagedOnce(source) {
    if (isDoNotTrack()) return;
    if (hasEngagedThisSession()) return;
    setEngagedThisSession();
    track("nav_engaged", { source: source });
  }

  function onFirstInteraction(event) {
    if (!event || !event.target) return;
    var navRoot = event.target.closest && event.target.closest("[data-site-nav]");
    if (!navRoot) return;
    var source = "click";
    if (event.type === "keydown") source = "keyboard";
    markEngagedOnce(source);
  }

  document.addEventListener("click", onFirstInteraction, true);
  document.addEventListener("keydown", onFirstInteraction, true);

  /* === Nav CTA click (FR-NAV-TEL-04) ==================================== */

  document.addEventListener(
    "click",
    function (event) {
      var ctaEl = event.target.closest && event.target.closest("[data-nav-cta]");
      if (!ctaEl) return;
      var inDialog = !!ctaEl.closest(".site-nav-dialog");
      track("nav_cta_click", {
        destination: ctaEl.getAttribute("href") || "",
        source: inDialog ? "dialog" : "nav"
      });
    },
    true
  );
})();

/* === Methodology telemetry events (FR-MF-TEL-01..04) =========================
 *
 * Single IntersectionObserver instance (NFR-MF-PERF-03), event delegation on
 * the section root, sessionStorage-scoped one-shot flags. Rides the global
 * track() function exported from the telemetry shim above.
 */
(function () {
  var track = window.__navTrack;
  var isDoNotTrack = window.__navIsDoNotTrack;
  if (typeof track !== "function" || typeof isDoNotTrack !== "function") return;

  var section = document.querySelector("[data-methodology-section]");
  if (!section) return;
  if (!("IntersectionObserver" in window)) return;

  var SESSION_KEY_SECTION_ENTERED = "__methodology_section_entered_session";
  var sectionEnteredAt = 0;
  var deepestFrameSeen = 0;
  var didClickCta = false;
  var framesSeen = {};
  var sectionExitedFired = false;

  function detectEntrySource() {
    var hash = (window.location.hash || "").toLowerCase();
    var sectionId = (section.id || section.parentElement && section.parentElement.id || "").toLowerCase();
    var approachAnchor = sectionId && hash === ("#" + sectionId);
    var sectionContainerId = "";
    var container = section.closest("section[id]");
    if (container) sectionContainerId = (container.id || "").toLowerCase();
    if (hash && (approachAnchor || hash === "#" + sectionContainerId)) return "deep-link";
    var activeEl = document.activeElement;
    if (activeEl && activeEl.matches && activeEl.matches('a.skip-link, a[href^="#main"]')) return "skip-link";
    return "scroll";
  }

  function fireSectionEntered() {
    if (isDoNotTrack()) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY_SECTION_ENTERED) === "1") return;
      window.sessionStorage.setItem(SESSION_KEY_SECTION_ENTERED, "1");
    } catch (_err) {
      /* sessionStorage unavailable — proceed without dedupe, accept double-fire risk */
    }
    sectionEnteredAt = Date.now();
    track("methodology_section_entered", { source: detectEntrySource() });
  }

  function fireFrameSeen(frameNum) {
    if (isDoNotTrack()) return;
    if (framesSeen[frameNum]) return;
    framesSeen[frameNum] = Date.now();
    if (frameNum > deepestFrameSeen) deepestFrameSeen = frameNum;
    track("methodology_frame_seen", { frame: frameNum, dwellMs: 0 });
  }

  function fireSectionExited() {
    if (isDoNotTrack()) return;
    if (sectionExitedFired) return;
    if (!sectionEnteredAt) return;
    sectionExitedFired = true;
    track("methodology_section_exited", {
      deepestFrameSeen: deepestFrameSeen,
      dwellMs: Date.now() - sectionEnteredAt,
      didClickCta: didClickCta
    });
  }

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          fireSectionEntered();
        }
      });
    },
    { threshold: [0.5] }
  );
  sectionObserver.observe(section);

  var frameObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          var frameAttr = entry.target.getAttribute("data-frame");
          var frameNum = parseInt(frameAttr, 10);
          if (!isNaN(frameNum)) fireFrameSeen(frameNum);
        }
      });
    },
    { threshold: [0.5] }
  );
  section.querySelectorAll("[data-frame]").forEach(function (el) {
    frameObserver.observe(el);
  });

  // Delegated click handler for methodology CTAs (primary + secondary)
  section.addEventListener(
    "click",
    function (event) {
      var ctaEl =
        event.target.closest &&
        event.target.closest("[data-methodology-cta], [data-methodology-secondary-cta]");
      if (!ctaEl) return;
      var kind = ctaEl.getAttribute("data-event-kind") || "unknown";
      didClickCta = true;
      track("methodology_cta_click", {
        destination: ctaEl.getAttribute("href") || "",
        source: "methodology",
        kind: kind
      });
    },
    true
  );

  // Exit detection
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") fireSectionExited();
  });
  window.addEventListener("beforeunload", fireSectionExited);
})();

/* === Provider adapter slot — single audit point for analytics ===============
 *
 * The telemetry shim's track() function calls window.__navTelemetryAdapter
 * if defined; else falls back to console.log. To wire a real provider,
 * uncomment ONE block below and add the corresponding <script> tag to
 * each page's <head>. This is the ONLY place provider code may live; the
 * CI nav-gate (.github/workflows/nav-gate.yml Check 2) enforces this.
 *
 * v0 default per PRD §4 FR-MF-INFRA-02: Plausible.
 * Override via this slot to swap to GA4 or Cloudflare without re-instrumenting.
 */

// --- Plausible (cookieless, lightweight) — v0 default ----------------------
// window.__navTelemetryAdapter = function (eventName, props) {
//   if (typeof window.plausible === "function") {
//     window.plausible(eventName, { props: props });
//   }
// };
//
// Also add to each page's <head>:
//   <script defer
//           data-domain="REPLACE_WITH_PROD_HOSTNAME"
//           src="https://plausible.io/js/script.js"></script>

// --- GA4 alternate ---------------------------------------------------------
// window.__navTelemetryAdapter = function (eventName, props) {
//   if (typeof window.gtag === "function") {
//     window.gtag("event", eventName, props);
//   }
// };
// (GA4 also requires the gtag.js loader script in <head>.)

// --- Cloudflare Web Analytics alternate ------------------------------------
// CF Web Analytics is currently passive (page-view only); custom events
// require the Beacon API. If chosen, wire via:
//   navigator.sendBeacon("/_cf-analytics-event", JSON.stringify({ eventName, props }));
