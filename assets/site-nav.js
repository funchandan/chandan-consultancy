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

  /**
   * Normalize a URL/pathname to a comparable "page" token. Strips query+hash,
   * collapses trailing slashes, treats root ("/" or empty) as index.html, and
   * appends ".html" to extensionless final segments so clean-URL deployments
   * still match (e.g. "/work" ~ "work.html"). Returns a lowercase token.
   */
  function normalizePageToken(raw) {
    var s = (raw || "").toLowerCase().split("#")[0].split("?")[0];
    s = s.replace(/\/+$/g, "");
    var slash = s.lastIndexOf("/");
    var seg = slash >= 0 ? s.slice(slash + 1) : s;
    if (!seg) seg = "index.html";
    if (seg.indexOf(".") === -1) seg = seg + ".html";
    return seg;
  }

  /**
   * Active-page indicator: match location.pathname's normalized token against
   * each top-level item's normalized href token. Handles trailing slashes,
   * extensionless URLs, and hash/query strip. Sets aria-current="page" on every
   * matching anchor (desktop + dialog copies).
   */
  function applyActivePage() {
    var page = normalizePageToken(window.location.pathname || "/");
    document.querySelectorAll('[data-site-nav] a[data-nav-item]').forEach(function (a) {
      var hrefToken = normalizePageToken(a.getAttribute("href") || "");
      if (hrefToken === page) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Populate visible nav strings from assets/nav-content.json so a label/CTA
   * rename is a one-file edit. The HTML labels are a defensive fallback; if
   * the JSON 404s or is invalid we warn once and leave the inline labels.
   */
  var UNSAFE_HREF_SCHEME = /^\s*(javascript|data|vbscript):/i;
  var SAFE_KEY = /^[a-z0-9_-]+$/i;
  var NAV_CONTENT_URL = "/assets/nav-content.json";

  function isSafeHref(href) {
    return typeof href === "string" && href.length > 0 && !UNSAFE_HREF_SCHEME.test(href);
  }

  function applyNavContent() {
    var warned = false;
    function fallback() {
      if (warned) return;
      warned = true;
      try {
        if (window.console && console.warn) {
          console.warn("[site-nav] nav-content.json unavailable; using HTML fallback");
        }
      } catch (_e) {
        /* no-op */
      }
      applyActivePage();
    }

    if (typeof window.fetch !== "function") {
      fallback();
      return;
    }

    try {
      window.fetch(NAV_CONTENT_URL, { cache: "no-cache" })
        .then(function (res) {
          if (!res || !res.ok) throw new Error("nav-content.json fetch failed");
          return res.json();
        })
        .then(function (data) {
          if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("nav-content.json invalid shape");
          }
          if (data.dictionaryVersion !== 1) {
            throw new Error("nav-content.json dictionaryVersion mismatch");
          }
          /* Slice C-1: publish version into the telemetry-visible global so   */
          /* every nav_* event can tag itself with the dictionary version.     */
          if (typeof window.__navTelemetryDictionaryVersion === "undefined" ||
              window.__navTelemetryDictionaryVersion === null) {
            window.__navTelemetryDictionaryVersion = data.dictionaryVersion;
          }

          if (typeof data.brand === "string" && data.brand) {
            document.querySelectorAll("[data-nav-brand]").forEach(function (el) {
              el.textContent = data.brand;
            });
          }

          if (data.aria && typeof data.aria.nav === "string" && data.aria.nav) {
            document.querySelectorAll("[data-site-nav]").forEach(function (el) {
              el.setAttribute("aria-label", data.aria.nav);
            });
          }

          if (data.skipToContent && typeof data.skipToContent.label === "string" && data.skipToContent.label) {
            var skip = document.querySelector(".skip-to-content");
            if (skip) skip.textContent = data.skipToContent.label;
          }

          if (data.topLevel && data.topLevel.length) {
            for (var i = 0; i < data.topLevel.length; i += 1) {
              var entry = data.topLevel[i];
              if (!entry || typeof entry.key !== "string" || !SAFE_KEY.test(entry.key)) continue;
              var matches = document.querySelectorAll('a[data-nav-item="' + entry.key + '"]');
              matches.forEach(function (a) {
                if (isSafeHref(entry.href)) a.setAttribute("href", entry.href);
                if (typeof entry.label === "string" && entry.label) a.textContent = entry.label;
              });
            }
          }

          if (data.cta && typeof data.cta === "object") {
            document.querySelectorAll("[data-nav-cta]").forEach(function (a) {
              if (isSafeHref(data.cta.href)) a.setAttribute("href", data.cta.href);
              if (typeof data.cta.label === "string" && data.cta.label) a.textContent = data.cta.label;
            });
          }

          applyActivePage();
        })
        .catch(fallback);
    } catch (_err) {
      fallback();
    }
  }

  applyActivePage();
  applyNavContent();

  /* === Telemetry (Slice C-1) =========================================== */
  /* Provider-agnostic seam. Routes through window.__navTelemetryAdapter   */
  /* if defined (set in a <script> tag before this file, or below the IIFE)*/
  /* otherwise falls back to console.info. Respects DNT. No PII. No cookies*/
  /* No localStorage. sessionStorage only, for once-per-session engagement.*/

  var TELEMETRY_ENGAGED_KEY = "__nav_engaged_session";
  var __sessionStorageWarned = false;

  function getDictionaryVersion() {
    /* Populated by applyNavContent() once nav-content.json resolves. Null   */
    /* before that — early-fire events ship with dictionaryVersion: null,    */
    /* which is the documented data-cleanup convention (drop those rows in   */
    /* the baseline window, ~first 200ms of session at most).                */
    var v = window.__navTelemetryDictionaryVersion;
    return typeof v === "number" ? v : null;
  }

  function isDoNotTrack() {
    try {
      var nav = navigator || {};
      var dnt = nav.doNotTrack || window.doNotTrack || nav.msDoNotTrack;
      return dnt === "1" || dnt === "yes";
    } catch (_e) {
      return false;
    }
  }

  function track(eventName, props) {
    if (isDoNotTrack()) return;
    var payload = {};
    if (props && typeof props === "object") {
      for (var k in props) {
        if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
      }
    }
    payload.timestamp = Date.now();
    payload.dictionaryVersion = getDictionaryVersion();

    var adapter = window.__navTelemetryAdapter;
    if (typeof adapter === "function") {
      try {
        adapter(eventName, payload);
        return;
      } catch (err) {
        try {
          if (window.console && console.warn) console.warn("[telemetry] adapter error", err);
        } catch (_e) { /* no-op */ }
      }
    }

    try {
      if (window.console && console.log) console.log("[telemetry]", eventName, payload);
    } catch (_e) { /* no-op */ }
  }

  function hasEngagedThisSession() {
    try {
      return window.sessionStorage && sessionStorage.getItem(TELEMETRY_ENGAGED_KEY) === "1";
    } catch (_e) {
      return false;
    }
  }

  function setEngagedThisSession() {
    try {
      if (window.sessionStorage) sessionStorage.setItem(TELEMETRY_ENGAGED_KEY, "1");
    } catch (err) {
      if (!__sessionStorageWarned) {
        __sessionStorageWarned = true;
        try {
          if (window.console && console.warn) {
            console.warn("[telemetry] sessionStorage unavailable; nav_engaged degrades to per-interaction firing");
          }
        } catch (_e) { /* no-op */ }
      }
    }
  }

  function markEngagedOnce(source) {
    if (isDoNotTrack()) return;
    if (hasEngagedThisSession()) return;
    setEngagedThisSession();
    track("nav_engaged", { source: source || "unknown" });
  }

  /* Wire nav_engaged: first pointer/touch/click/focusin on [data-site-nav]*/
  /* Single delegated listener per nav root; removes itself after firing. */
  document.querySelectorAll("[data-site-nav]").forEach(function (navRoot) {
    function onFirstInteraction(evt) {
      /* Collapse pointer/touch/click into "click" so the spec's I/O matrix */
      /* (source: "click" | "keyboard") matches reality.                    */
      var source = evt.type === "focusin" ? "keyboard" : "click";
      markEngagedOnce(source);
      navRoot.removeEventListener("pointerdown", onFirstInteraction, true);
      navRoot.removeEventListener("touchstart", onFirstInteraction, true);
      navRoot.removeEventListener("focusin", onFirstInteraction, true);
      navRoot.removeEventListener("click", onFirstInteraction, true);
    }
    if (hasEngagedThisSession()) return;
    navRoot.addEventListener("pointerdown", onFirstInteraction, true);
    navRoot.addEventListener("touchstart", onFirstInteraction, true);
    navRoot.addEventListener("focusin", onFirstInteraction, true);
    navRoot.addEventListener("click", onFirstInteraction, true);
  });

  /* Wire nav_cta_click: every activation of [data-nav-cta].               */
  /* Use document-level delegation so dialog-injected CTA copies also fire.*/
  document.addEventListener("click", function (evt) {
    var target = evt.target;
    while (target && target !== document) {
      if (target.nodeType === 1 && target.hasAttribute && target.hasAttribute("data-nav-cta")) {
        var destination = target.getAttribute("href") || "";
        var source = target.classList && target.classList.contains("nav-cta--dialog") ? "dialog" : "nav";
        markEngagedOnce("click");
        track("nav_cta_click", { destination: destination, source: source });
        return;
      }
      target = target.parentNode;
    }
  }, true);

  /* === /Telemetry ====================================================== */

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

/* === Provider adapter slot (Slice C-1) =================================
 *
 * The navbar telemetry shim above looks for a function at
 *   window.__navTelemetryAdapter
 * and routes every event through it when defined. If undefined, events
 * fall back to console.info("[telemetry]", name, props) so you can verify
 * firing in DevTools without picking a provider.
 *
 * To wire a real provider, uncomment ONE of the templates below (and load
 * the provider's script tag in your HTML head before site-nav.js runs).
 *
 * --------------------------------------------------------------------- *
 * Template A — Google Analytics 4 (free; requires cookie banner in EU)   *
 * --------------------------------------------------------------------- *
 * In your <head> before site-nav.js:
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
 *   <script>
 *     window.dataLayer = window.dataLayer || [];
 *     function gtag(){dataLayer.push(arguments);}
 *     gtag('js', new Date());
 *     gtag('config', 'G-XXXXXXX');
 *   </script>
 * Then uncomment:
 *
 * // window.__navTelemetryAdapter = function (name, props) {
 * //   if (typeof window.gtag === "function") window.gtag("event", name, props);
 * // };
 *
 * --------------------------------------------------------------------- *
 * Template B — Plausible (cookieless; $9/mo after trial; no EU banner)   *
 * --------------------------------------------------------------------- *
 * In your <head> before site-nav.js:
 *   <script defer data-domain="yourdomain.com"
 *           src="https://plausible.io/js/script.tagged-events.js"></script>
 * Then uncomment:
 *
 * // window.__navTelemetryAdapter = function (name, props) {
 * //   if (typeof window.plausible === "function") window.plausible(name, { props: props });
 * // };
 *
 * --------------------------------------------------------------------- *
 * Template C — Cloudflare Web Analytics (cookieless; free w/ Cloudflare) *
 * --------------------------------------------------------------------- *
 * Enable Web Analytics in your Cloudflare dashboard and add the snippet
 * Cloudflare gives you to your <head> (it injects a global `beacon` API).
 * Then uncomment:
 *
 * // window.__navTelemetryAdapter = function (name, props) {
 * //   if (window.beacon && typeof window.beacon.track === "function") {
 * //     window.beacon.track(name, props);
 * //   }
 * // };
 *
 * === /Provider adapter slot ============================================ */

