/**
 * WP Motion — site-wide bootstrap (WO-007 slice 2 / C12).
 * Spec: _bmad-output/D-UX-Design/motion/architecture.md
 */
(function () {
  "use strict";

  var registry = Object.create(null);

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function readTokens() {
    var root = getComputedStyle(document.documentElement);
    function token(name, fallback) {
      var value = root.getPropertyValue(name).trim();
      return value || fallback;
    }
    return {
      easeProduct: token(
        "--motion-ease-product",
        "cubic-bezier(0.22, 1, 0.36, 1)"
      ),
      durationS: token("--motion-duration-s", "160ms"),
      durationM: token("--motion-duration-m", "320ms"),
      durationL: token("--motion-duration-l", "16s"),
      neonBlue: token("--motion-neon-blue", "#144ccd"),
      marbleBase: token("--motion-marble-base", token("--index-marble-base", "")),
    };
  }

  function createContext(profile) {
    var reduced = prefersReducedMotion();
    var ctx = {
      profile: profile,
      reduced: reduced,
      paused: false,
      tokens: readTokens(),
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      pause: function () {
        ctx.paused = true;
      },
      resume: function () {
        ctx.paused = false;
      },
    };
    return ctx;
  }

  function boot() {
    var body = document.body;
    if (!body) return;

    var profile = body.getAttribute("data-wp-motion-profile") || "minimal";
    var reduced = prefersReducedMotion();
    var root = document.documentElement;

    root.setAttribute("data-wp-motion-profile", profile);
    root.classList.add(reduced ? "wp-motion--static" : "wp-motion--ready");

    if (reduced) return;

    var ctx = createContext(profile);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) ctx.pause();
      else ctx.resume();
    });

    var nodes = document.querySelectorAll("[data-wp-motion]");
    var queue = [];
    var seen = Object.create(null);
    var i;
    var j;
    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var raw = el.getAttribute("data-wp-motion") || "";
      var ids = raw.split(/\s+/);
      for (j = 0; j < ids.length; j++) {
        var id = ids[j];
        if (!id || seen[id]) continue;
        var mod = registry[id];
        if (mod && typeof mod.init === "function") {
          seen[id] = true;
          queue.push({ mod: mod, el: el, layer: mod.layer != null ? mod.layer : 99 });
        }
      }
    }
    queue.sort(function (a, b) {
      return a.layer - b.layer;
    });
    for (i = 0; i < queue.length; i++) {
      try {
        queue[i].mod.init(queue[i].el, ctx);
      } catch (err) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            "[wp-motion] init failed:",
            queue[i].el.getAttribute("data-wp-motion"),
            err
          );
        }
      }
    }
  }

  window.WPMotion = {
    register: function (id, mod) {
      if (!id || !mod) return;
      registry[id] = mod;
    },
    boot: boot,
    readTokens: readTokens,
    prefersReducedMotion: prefersReducedMotion,
  };

  /* Always defer boot until DOMContentLoaded so deferred sibling modules can register. */
  document.addEventListener("DOMContentLoaded", boot);
})();
