/**
 * Immersive journey — Noomo-calibrated interaction layer (WO-007).
 * Spec: _bmad-output/D-UX-Design/motion/reference-noomo-agency.md
 */
(function () {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

  var WPM = window.WPMotion;
  if (!WPM) return;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
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

  function scrollY() {
    if (window.WPScroll && typeof window.WPScroll.getY === "function") {
      return window.WPScroll.getY();
    }
    return window.scrollY || 0;
  }

  /* --- L0: pointer light on marble backdrop (work.html only — not index) --- */
  WPM.register("atmosphere", {
    layer: 0,
    init: function (_el, ctx) {
      if (ctx.reduced) return;
      if (document.body.classList.contains("home-page")) return;
      var backdrop = document.querySelector(".index-page-backdrop");
      if (!backdrop) return;

      var light = document.createElement("canvas");
      light.className = "index-marble-light";
      light.setAttribute("aria-hidden", "true");
      backdrop.appendChild(light);

      var lctx = light.getContext("2d");
      var mx = 0.5;
      var my = 0.3;
      var tx = 0.5;
      var ty = 0.3;
      var w = 0;
      var h = 0;
      var raf = 0;

      function resize() {
        w = backdrop.offsetWidth;
        h = backdrop.offsetHeight;
        light.width = w;
        light.height = h;
        light.style.width = w + "px";
        light.style.height = h + "px";
      }

      function paint() {
        if (!lctx || ctx.paused) return;
        mx = lerp(mx, tx, 0.07);
        my = lerp(my, ty, 0.07);
        lctx.clearRect(0, 0, w, h);
        var cx = mx * w;
        var cy = my * h;
        var r = Math.max(w, h) * 0.48;
        var g = lctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, "rgba(255, 255, 255, 0.22)");
        g.addColorStop(0.35, "rgba(255, 255, 255, 0.08)");
        g.addColorStop(0.7, "rgba(0, 0, 0, 0.03)");
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        lctx.fillStyle = g;
        lctx.fillRect(0, 0, w, h);
        raf = requestAnimationFrame(paint);
      }

      function onMove(e) {
        var rect = backdrop.getBoundingClientRect();
        tx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        ty = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(paint);

      return function destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        if (light.parentNode) light.parentNode.removeChild(light);
      };
    },
  });

  /* --- Hero veil + page torch (IDEA-HERO-WORK-001 / MOTION-TORCH-002) --- */
  WPM.register("hero-veil", {
    layer: 0,
    init: function (hero, ctx) {
      if (!hero) return;

      var work = document.getElementById("work");
      var isStatement = hero.classList.contains("statement-viewport");
      var targetPx = 50;
      var targetPy = 42;
      var lx = 50;
      var ly = 42;
      var lastPointer = 0;
      var idlePhase = 0;
      var rafId = 0;
      var root = document.documentElement;
      var case01 = work ? document.getElementById("project-points-marketplace") : null;
      var case02 = work ? document.getElementById("project-hp-field-service") : null;
      var connect = document.getElementById("connect");
      var approach = document.getElementById("approach");
      var isProductIndex = document.body.classList.contains("home-page--product");

      function lightFromViewport(el, xBias, yBias) {
        if (!el) return { x: 50, y: 42 };
        var r = el.getBoundingClientRect();
        var vw = Math.max(window.innerWidth, 1);
        var vh = Math.max(window.innerHeight, 1);
        return {
          x: clamp(((r.left + r.width * xBias) / vw) * 100, 5, 95),
          y: clamp(((r.top + r.height * yBias) / vh) * 100, 5, 95),
        };
      }

      function lightFromCase(el, xBias, yBias) {
        if (!el) return { x: 68, y: 52 };
        if (isProductIndex) return lightFromViewport(el, xBias, yBias);
        if (!work) return { x: 68, y: 52 };
        var wr = work.getBoundingClientRect();
        var w = Math.max(wr.width, 1);
        var h = Math.max(wr.height, 1);
        var cr = el.getBoundingClientRect();
        return {
          x: clamp((((cr.left + cr.width * xBias) - wr.left) / w) * 100, 12, 92),
          y: clamp((((cr.top + cr.height * yBias) - wr.top) / h) * 100, 10, 90),
        };
      }

      var pageTorch = null;
      var bloom = null;
      var grain = null;
      var veil = document.createElement("div");
      veil.setAttribute("aria-hidden", "true");

      if (isProductIndex && isStatement) {
        pageTorch = document.createElement("div");
        pageTorch.className = "wp-page-torch";
        pageTorch.setAttribute("aria-hidden", "true");
        bloom = document.createElement("div");
        bloom.className = "wp-page-torch__bloom";
        bloom.setAttribute("aria-hidden", "true");
        veil.className = "wp-page-torch__veil";
        var core = document.createElement("div");
        core.className = "wp-page-torch__core";
        core.setAttribute("aria-hidden", "true");
        grain = document.createElement("div");
        grain.className = "wp-page-torch__grain";
        grain.setAttribute("aria-hidden", "true");
        pageTorch.appendChild(bloom);
        pageTorch.appendChild(veil);
        pageTorch.appendChild(core);
        pageTorch.appendChild(grain);
        document.body.insertBefore(pageTorch, document.body.firstChild);
      } else {
        if (isStatement) {
          veil.className = "statement-viewport__veil";
        } else if (hero.classList.contains("hero-walkthrough")) {
          veil.className = "hero-walkthrough__veil";
        } else {
          veil.className = "hero-home__veil";
        }

        if (isStatement) {
          bloom = document.createElement("div");
          bloom.className = "statement-viewport__bloom";
          bloom.setAttribute("aria-hidden", "true");
          grain = document.createElement("div");
          grain.className = "statement-viewport__grain";
          grain.setAttribute("aria-hidden", "true");
          hero.insertBefore(bloom, hero.firstChild);
          hero.insertBefore(veil, bloom.nextSibling);
          hero.insertBefore(grain, veil.nextSibling);
        } else {
          hero.insertBefore(veil, hero.firstChild);
        }
      }

      var workVeil = null;
      if (isStatement && work && !isProductIndex) {
        workVeil = document.createElement("div");
        workVeil.className = "wp-work-atmosphere__veil";
        workVeil.setAttribute("aria-hidden", "true");
        var workAtmo = work.querySelector(".wp-work-atmosphere");
        if (workAtmo) workAtmo.appendChild(workVeil);
      }

      var connectVeil = null;
      if (isStatement && connect && !isProductIndex) {
        connectVeil = document.createElement("div");
        connectVeil.className = "wp-connect-atmosphere__veil";
        connectVeil.setAttribute("aria-hidden", "true");
        var connectAtmo = connect.querySelector(".wp-connect-atmosphere");
        if (connectAtmo) connectAtmo.appendChild(connectVeil);
      }

      var hint = hero.querySelector(".statement-viewport__scroll-cue");
      if (!hint && !isStatement) {
        hint = document.createElement("a");
        hint.className = "journey-scroll-hint";
        hint.href = "#work";
        hint.setAttribute("aria-label", "Scroll to case studies");
        hint.innerHTML =
          '<span class="journey-scroll-hint__label">Explore</span>' +
          '<span class="journey-scroll-hint__chevron" aria-hidden="true"></span>';
        var hintRoot =
          hero.querySelector(".statement-viewport__canvas") ||
          hero.querySelector(".hero-walkthrough__inner") ||
          hero.querySelector(".hero-home__stage") ||
          hero;
        hintRoot.appendChild(hint);
      }

      function setLight(x, y) {
        root.style.setProperty("--hero-light-x", clamp(x, 0, 100).toFixed(2) + "%");
        root.style.setProperty("--hero-light-y", clamp(y, 0, 100).toFixed(2) + "%");
      }

      function handoffProgress() {
        if (!isStatement || !work) return 0;
        var heroH = hero.offsetHeight;
        var range = Math.min(window.innerHeight * 0.8, heroH * 0.85);
        if (range < 1) return 0;
        var traveled = Math.max(0, -hero.getBoundingClientRect().top);
        return clamp(traveled / range, 0, 1);
      }

      /** Scroll through #work — carry torch down toward case 02 */
      function workCarryProgress() {
        if (!work || !case02) return 0;
        var scrollIntoWork = Math.max(0, scrollY() + window.innerHeight * 0.12 - work.offsetTop);
        var target =
          case02.offsetTop + case02.offsetHeight * 0.45 - window.innerHeight * 0.08;
        var range = Math.max(target, window.innerHeight * 0.35);
        return clamp(scrollIntoWork / range, 0, 1);
      }

      /** Scroll through #approach — carry torch into method band */
      function methodCarryProgress() {
        if (!approach) return 0;
        var vh = window.innerHeight;
        var enter = approach.offsetTop - vh * 0.15;
        var exit = approach.offsetTop + approach.offsetHeight * 0.65;
        var p = scrollY() + vh * 0.38;
        return clamp((p - enter) / Math.max(exit - enter, 1), 0, 1);
      }

      /** Scroll into #connect */
      function connectCarryProgress() {
        if (!connect) return 0;
        var vh = window.innerHeight;
        var enter = connect.offsetTop - vh * 0.2;
        var p = scrollY() + vh * 0.42;
        return clamp((p - enter) / Math.max(vh * 0.55, 1), 0, 1);
      }

      function scrollSettleTarget(heroT, workT, methodT, connectT) {
        var c1 = lightFromCase(case01, 0.72, 0.48);
        var c2 = lightFromCase(case02, 0.28, 0.5);
        var method = lightFromViewport(approach, 0.52, 0.38);
        var conn = lightFromViewport(connect, 0.5, 0.45);
        var x;
        var y;

        if (heroT < 1) {
          x = c1.x;
          y = c1.y;
        } else if (workT < 1) {
          x = c1.x + (c2.x - c1.x) * workT;
          y = c1.y + (c2.y - c1.y) * workT;
        } else if (methodT < 1) {
          x = c2.x + (method.x - c2.x) * methodT;
          y = c2.y + (method.y - c2.y) * methodT;
        } else {
          x = method.x + (conn.x - method.x) * connectT;
          y = method.y + (conn.y - method.y) * connectT;
        }

        return { x: x, y: y };
      }

      function pointerWeightForPhase(heroT, workT, connectT) {
        if (heroT < 1) return 1 - heroT;
        if (workT < 1) return Math.max(0.2, 1 - workT * 0.65);
        return Math.max(0.15, 1 - connectT * 0.5);
      }

      function workVeilOpacity(heroT) {
        if (!work) return heroT;
        var wr = work.getBoundingClientRect();
        var vh = window.innerHeight;
        var inView = wr.top < vh * 0.92 && wr.bottom > vh * 0.06;
        if (!inView) return heroT * 0.5;
        if (heroT > 0.08) {
          var op = 1;
          if (approach) {
            var ar = approach.getBoundingClientRect();
            if (ar.top < vh * 0.78) {
              op = clamp((ar.top - vh * 0.12) / (vh * 0.45), 0, 1);
            }
          }
          return op;
        }
        return clamp(heroT / 0.08, 0, 1);
      }

      function connectVeilOpacity() {
        if (!connect) return 0;
        var cr = connect.getBoundingClientRect();
        var vh = window.innerHeight;
        if (cr.top > vh * 0.94 || cr.bottom < vh * 0.06) return 0;
        return clamp(1 - cr.top / (vh * 0.62), 0, 1);
      }

      function applyHandoff() {
        var heroT = handoffProgress();
        var workT = workCarryProgress();
        var methodT = methodCarryProgress();
        var connectT = connectCarryProgress();
        var settle = scrollSettleTarget(heroT, workT, methodT, connectT);

        root.style.setProperty("--hero-handoff", heroT.toFixed(4));
        root.style.setProperty("--work-carry", workT.toFixed(4));

        if (isProductIndex) {
          var phase = "connect";
          if (heroT < 1) phase = "hero";
          else if (workT < 1) phase = "work";
          else if (methodT < 1) phase = "method";
          root.style.setProperty("--page-torch-phase", phase);
          root.style.setProperty("--page-torch-opacity", "1");

          if (ctx.reduced) {
            setLight(settle.x, settle.y);
            return;
          }

          var pw = pointerWeightForPhase(heroT, workT, connectT);
          setLight(lx * pw + settle.x * (1 - pw), ly * pw + settle.y * (1 - pw));
          return;
        }

        var workOp = workVeilOpacity(heroT);
        var connectOp = connectVeilOpacity();

        if (ctx.reduced) {
          setLight(settle.x, settle.y);
          root.style.setProperty("--hero-veil-opacity", heroT < 0.5 ? "1" : "0");
          root.style.setProperty("--work-veil-opacity", workOp.toFixed(4));
          root.style.setProperty("--connect-veil-opacity", connectOp.toFixed(4));
          return;
        }

        var x;
        var y;
        if (heroT < 1) {
          var pointerWeight = 1 - heroT;
          x = lx * pointerWeight + settle.x * heroT;
          y = ly * pointerWeight + settle.y * heroT;
        } else {
          var pointerWeight = Math.max(0.2, 1 - workT * 0.65);
          x = lx * pointerWeight + settle.x * (1 - pointerWeight);
          y = ly * pointerWeight + settle.y * (1 - pointerWeight);
        }
        setLight(x, y);
        root.style.setProperty("--hero-veil-opacity", (1 - heroT).toFixed(4));
        root.style.setProperty("--work-veil-opacity", workOp.toFixed(4));
        root.style.setProperty("--connect-veil-opacity", connectOp.toFixed(4));
      }

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function tickLight() {
        var now = performance.now();
        var idle = now - lastPointer > 2400;
        var aimX = targetPx;
        var aimY = targetPy;

        if (idle) {
          idlePhase += 0.011;
          aimX += Math.sin(idlePhase * 0.52) * 2.4 + Math.sin(idlePhase * 0.16) * 0.7;
          aimY += Math.cos(idlePhase * 0.46) * 1.9 + Math.cos(idlePhase * 0.19) * 0.55;
        }

        var ease = idle ? 0.026 : 0.048;
        lx = lerp(lx, aimX, ease);
        ly = lerp(ly, aimY, ease);
        applyHandoff();
        if (hint) {
          hint.classList.toggle("is-hidden", scrollY() > 48);
        }
        rafId = requestAnimationFrame(tickLight);
      }

      function onPageMove(e) {
        if (ctx.reduced) return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (w < 1 || h < 1) return;
        targetPx = clamp((e.clientX / w) * 100, 0, 100);
        targetPy = clamp((e.clientY / h) * 100, 0, 100);
        lastPointer = performance.now();
      }

      function onHeroMove(e) {
        if (ctx.reduced) return;
        var r = hero.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        targetPx = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
        targetPy = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);
        lastPointer = performance.now();
      }

      function onWorkMove(e) {
        if (ctx.reduced || !work) return;
        var r = work.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        targetPx = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
        targetPy = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);
        lastPointer = performance.now();
      }

      function onPointerLeave() {
        targetPx = 50;
        targetPy = 42;
        lastPointer = performance.now() - 2600;
      }

      function onScroll() {
        applyHandoff();
      }

      var unbindScroll = bindScroll(onScroll);

      if (!ctx.reduced) {
        if (isProductIndex) {
          document.addEventListener("pointermove", onPageMove, { passive: true });
          document.documentElement.addEventListener("mouseleave", onPointerLeave, { passive: true });
        } else {
          hero.addEventListener("pointermove", onHeroMove, { passive: true });
          hero.addEventListener("pointerleave", onPointerLeave, { passive: true });
          if (work) {
            work.addEventListener("pointermove", onWorkMove, { passive: true });
          }
        }
        rafId = requestAnimationFrame(tickLight);
      }

      if (case01) {
        var start = lightFromCase(case01, 0.72, 0.48);
        setLight(start.x, start.y);
      } else {
        setLight(68, 52);
      }
      window.addEventListener("resize", onScroll, { passive: true });
      onScroll();

      return function () {
        if (rafId) cancelAnimationFrame(rafId);
        if (isProductIndex) {
          document.removeEventListener("pointermove", onPageMove);
          document.documentElement.removeEventListener("mouseleave", onPointerLeave);
        } else {
          hero.removeEventListener("pointermove", onHeroMove);
          if (work) work.removeEventListener("pointermove", onWorkMove);
        }
        if (unbindScroll) unbindScroll();
        window.removeEventListener("resize", onScroll);
        if (bloom && bloom.parentNode) bloom.parentNode.removeChild(bloom);
        if (veil.parentNode) veil.parentNode.removeChild(veil);
        if (grain && grain.parentNode) grain.parentNode.removeChild(grain);
        if (pageTorch && pageTorch.parentNode) pageTorch.parentNode.removeChild(pageTorch);
        if (workVeil && workVeil.parentNode) workVeil.parentNode.removeChild(workVeil);
        if (connectVeil && connectVeil.parentNode) connectVeil.parentNode.removeChild(connectVeil);
        root.style.removeProperty("--hero-handoff");
        root.style.removeProperty("--hero-veil-opacity");
        root.style.removeProperty("--work-veil-opacity");
        root.style.removeProperty("--connect-veil-opacity");
        root.style.removeProperty("--work-carry");
        root.style.removeProperty("--page-torch-opacity");
        root.style.removeProperty("--page-torch-phase");
      };
    },
  });

  /* --- Section reveals only (WO-010 — no journey rail) --- */
  WPM.register("journey", {
    layer: 1,
    init: function (_main, ctx) {
      var sectionIds = ["hero", "work", "approach", "connect"];
      var sections = sectionIds
        .map(function (id) {
          return document.getElementById(id);
        })
        .filter(Boolean);

      sections.forEach(function (el) {
        el.classList.add("journey-act");
      });

      if (!ctx.reduced) {
        document.documentElement.classList.add("wp-journey--active");
      }

      if ("IntersectionObserver" in window && !ctx.reduced) {
        var revealObs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) entry.target.classList.add("is-visible");
            });
          },
          { rootMargin: "-6% 0px -10% 0px", threshold: 0.08 }
        );
        sections.forEach(function (s) {
          revealObs.observe(s);
        });
      } else {
        sections.forEach(function (s) {
          s.classList.add("is-visible");
        });
      }

      return function () {
        document.documentElement.classList.remove("wp-journey--active");
      };
    },
  });

  /* --- Subtle scroll-linked parallax on acts --- */
  WPM.register("scroll-depth", {
    layer: 1,
    init: function (_main, ctx) {
      if (ctx.reduced || document.body.classList.contains("home-page--product")) return;
      var acts = document.querySelectorAll(".journey-act");
      var ticking = false;

      function update() {
        ticking = false;
        var vh = window.innerHeight;
        var mid = vh * 0.5;
        acts.forEach(function (act) {
          var rect = act.getBoundingClientRect();
          var center = rect.top + rect.height * 0.5;
          var delta = (center - mid) / vh;
          var shift = clamp(delta * -18, -18, 18);
          act.style.setProperty("--journey-parallax", shift.toFixed(2) + "px");
          var focus = Math.abs(delta) < 0.55 ? 1 : 0;
          act.style.setProperty("--journey-focus", String(focus));
        });
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      }

      var unbindScrollDepth = bindScroll(onScroll);
      window.addEventListener("resize", onScroll, { passive: true });
      update();

      return function () {
        if (unbindScrollDepth) unbindScrollDepth();
        window.removeEventListener("resize", onScroll);
        acts.forEach(function (act) {
          act.style.removeProperty("--journey-parallax");
          act.style.removeProperty("--journey-focus");
        });
      };
    },
  });

  /* --- Work tiles stagger --- */
  WPM.register("work-reveal", {
    layer: 1,
    init: function (work, ctx) {
      if (!work) return;
      var cases = work.querySelectorAll(".wp-project-case");
      if (!cases.length) return;
      if (ctx.reduced) {
        cases.forEach(function (c) {
          c.classList.add("is-visible");
        });
        return;
      }
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );
        cases.forEach(function (block, i) {
          var delay = block.classList.contains("wp-project-case--anchor") ? 0 : 80 + (i - 1) * 80;
          block.style.setProperty("--journey-stagger", String(delay) + "ms");
          obs.observe(block);
        });
      } else {
        cases.forEach(function (c) {
          c.classList.add("is-visible");
        });
      }
    },
  });

  /* --- Card tilt + neon glare --- */
  WPM.register("card-interact", {
    layer: 2,
    init: function (_root, ctx) {
      if (ctx.reduced) return;
      var cards = document.querySelectorAll(
        ".hero-path, .wp-card--neon, .case-home-tile"
      );
      var maxDeg = 6;

      function onMove(e) {
        var card = e.currentTarget;
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var rx = clamp(-py * maxDeg, -maxDeg, maxDeg);
        var ry = clamp(px * maxDeg, -maxDeg, maxDeg);
        card.style.transform =
          "perspective(920px) rotateX(" +
          rx.toFixed(2) +
          "deg) rotateY(" +
          ry.toFixed(2) +
          "deg) translateY(-5px)";
        card.classList.add("wp-tilt--active");
        if (card.classList.contains("wp-card--neon")) {
          card.style.setProperty(
            "--card-glare-x",
            ((px + 0.5) * 100).toFixed(1) + "%"
          );
          card.style.setProperty(
            "--card-glare-y",
            ((py + 0.5) * 100).toFixed(1) + "%"
          );
        }
      }

      function onLeave(e) {
        var card = e.currentTarget;
        card.style.transform = "";
        card.classList.remove("wp-tilt--active");
        card.style.removeProperty("--card-glare-x");
        card.style.removeProperty("--card-glare-y");
      }

      cards.forEach(function (card) {
        card.classList.add("wp-tilt");
        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave);
      });
    },
  });

  /* --- Method loop stagger --- */
  WPM.register("method-rail", {
    layer: 1,
    init: function (section, ctx) {
      if (!section) return;
      var lines = section.querySelector(".wp-method-lines");
      if (!lines) return;
      if (ctx.reduced) {
        lines.classList.add("wp-method-lines--revealed");
        return;
      }
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                lines.classList.add("wp-method-lines--revealed");
                obs.disconnect();
              }
            });
          },
          { threshold: 0.15 }
        );
        obs.observe(lines);
      } else {
        lines.classList.add("wp-method-lines--revealed");
      }
    },
  });
})();
