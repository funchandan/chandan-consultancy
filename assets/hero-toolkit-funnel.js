(function initHeroToolkitFunnel() {
  var root = document.querySelector("[data-hero-funnel-root]");
  if (!root) return;

  var HERO_FUNNEL_DATA = [
    {
      id: "clarify",
      label: "Clarify",
      stageIndex: "01",
      featuredKit: {
        title: "Decision teardown",
        meta: "Bet memo, kill date",
        status: "live",
        href: "toolkits/decision-teardown.html",
      },
      payoff: "Leave with a written bet and kill criteria — not another brainstorm.",
      deliverable: "Bet memo, reversal cost, two-week kill date.",
      examples: [
        { title: "Decision teardown", href: "toolkits/decision-teardown.html", status: "live" },
        {
          title: "User needs research doc",
          href: "mailto:chandan004sharma@gmail.com?subject=User%20needs%20research%20toolkit",
          status: "waitlist",
        },
      ],
      primaryCta: { label: "View kit", href: "toolkits/decision-teardown.html" },
    },
    {
      id: "create",
      label: "create",
      stageIndex: "03",
      featuredKit: {
        title: "AI workflow UX",
        meta: "HITL map, guardrails",
        status: "waitlist",
        href: "toolkits.html#kit-create",
      },
      payoff: "Put AI where humans can still override what matters.",
      deliverable: "HITL map, guardrails, one tested pilot scope.",
      examples: [
        {
          title: "AI workflow UX",
          href: "mailto:chandan004sharma@gmail.com?subject=AI%20workflow%20UX%20toolkit",
          status: "waitlist",
        },
        { title: "Product spec scaffold", href: "", status: "soon" },
      ],
      primaryCta: {
        label: "Join waitlist",
        href: "mailto:chandan004sharma@gmail.com?subject=AI%20workflow%20UX%20toolkit",
      },
    },
    {
      id: "build",
      label: "build",
      stageIndex: "02",
      featuredKit: {
        title: "Architecture audit",
        meta: "Seam map, 90-day plan",
        status: "waitlist",
        href: "toolkits.html#kit-build",
      },
      payoff: "See where the seams are bending before they snap.",
      deliverable: "Seam map, north star, 90-day cohesion plan.",
      examples: [
        {
          title: "Architecture audit",
          href: "mailto:chandan004sharma@gmail.com?subject=Architecture%20audit%20toolkit",
          status: "waitlist",
        },
        { title: "90-day rollout checklist", href: "toolkits.html#kit-build", status: "live" },
      ],
      primaryCta: {
        label: "Join waitlist",
        href: "mailto:chandan004sharma@gmail.com?subject=Architecture%20audit%20toolkit",
      },
    },
  ];

  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusLabel(status) {
    if (status === "live") return "Live";
    if (status === "waitlist") return "Waitlist";
    if (status === "soon") return "Soon";
    return "";
  }

  function pickFeaturedKit(item) {
    if (item.featuredKit) return item.featuredKit;
    var live = item.examples.find(function (ex) {
      return ex.status === "live";
    });
    return live || item.examples[0] || null;
  }

  function renderPanel(item) {
    var examplesHtml = item.examples
      .map(function (ex) {
        var status = statusLabel(ex.status);
        var statusHtml = status
          ? '<span class="hero-funnel__status">' + escapeHtml(status) + "</span>"
          : "";
        if (ex.status === "soon" || !ex.href) {
          return "<li><span>" + escapeHtml(ex.title) + statusHtml + "</span></li>";
        }
        return (
          '<li><a href="' +
          escapeHtml(ex.href) +
          '">' +
          escapeHtml(ex.title) +
          statusHtml +
          "</a></li>"
        );
      })
      .join("");

    return (
      '<p class="hero-funnel__eyebrow">' +
      escapeHtml(item.label) +
      "</p>" +
      '<p class="hero-funnel__payoff">' +
      escapeHtml(item.payoff) +
      "</p>" +
      '<p class="hero-funnel__deliverable"><strong>You leave with:</strong> ' +
      escapeHtml(item.deliverable) +
      "</p>" +
      '<ul class="hero-funnel__examples">' +
      examplesHtml +
      "</ul>" +
      '<a class="hero-funnel__cta" href="' +
      escapeHtml(item.primaryCta.href) +
      '">' +
      escapeHtml(item.primaryCta.label) +
      "</a>"
    );
  }

  function renderTile(item) {
    var kit = pickFeaturedKit(item);
    var stage = root.querySelector('[data-hero-funnel-stage="' + item.id + '"]');
    if (!stage || !kit) return;
    var tile = stage.querySelector(".wp-hero-project-strip__tile");
    if (!tile) return;

    if (kit.href) tile.setAttribute("href", kit.href);

    var index = item.stageIndex || "01";
    var statusClass =
      kit.status === "live"
        ? "wp-hero-project-strip__status--live"
        : kit.status === "soon"
          ? "wp-hero-project-strip__status--soon"
          : "wp-hero-project-strip__status--waitlist";
    var statusText = statusLabel(kit.status);

    tile.innerHTML =
      '<span class="wp-hero-project-strip__thumb" aria-hidden="true">' +
      '<span class="wp-hero-project-strip__kit">' +
      escapeHtml(index) +
      "</span></span>" +
      '<span class="wp-hero-project-strip__copy">' +
      '<span class="wp-hero-project-strip__label">' +
      escapeHtml(kit.title) +
      "</span>" +
      '<span class="wp-hero-project-strip__meta">' +
      escapeHtml(kit.meta) +
      ' <span class="wp-hero-project-strip__status ' +
      statusClass +
      '">' +
      escapeHtml(statusText) +
      "</span></span></span>";
  }

  function getStageParts(id) {
    return {
      trigger: root.querySelector('[data-hero-funnel-trigger][data-hero-funnel-id="' + id + '"]'),
      panel: root.querySelector('[data-hero-funnel-panel][data-hero-funnel-id="' + id + '"]'),
      stage: root.querySelector('[data-hero-funnel-stage="' + id + '"]'),
    };
  }

  function dispatchFunnelEvent(id, open) {
    document.dispatchEvent(
      new CustomEvent("wp:hero-funnel", {
        detail: { id: id || null, open: !!open },
      })
    );
  }

  function positionPanel(stage, panel) {
    panel.classList.remove("hero-funnel__panel--above");
    if (!stage) return;
    window.requestAnimationFrame(function () {
      var panelRect = panel.getBoundingClientRect();
      var proof =
        root.parentElement &&
        (root.parentElement.querySelector(".bento-card__proof") ||
          root.parentElement.querySelector(".wp-hero-proof"));
      var anchorTop = proof ? proof.getBoundingClientRect().bottom : stage.getBoundingClientRect().top;
      if (panelRect.top < anchorTop + 8) {
        panel.classList.add("hero-funnel__panel--above");
      }
    });
  }

  function closeAll() {
    root.querySelectorAll("[data-hero-funnel-stage]").forEach(function (stage) {
      var id = stage.getAttribute("data-hero-funnel-stage");
      var parts = getStageParts(id);
      if (!parts.trigger || !parts.panel) return;
      parts.trigger.setAttribute("aria-expanded", "false");
      parts.panel.setAttribute("hidden", "hidden");
      stage.classList.remove("is-open");
    });
    document.body.classList.remove("wp-hero-funnel-open");
    dispatchFunnelEvent(null, false);
  }

  function openDisclosure(id, focusFirstLink) {
    var parts = getStageParts(id);
    if (!parts.trigger || !parts.panel || !parts.stage) return;
    closeAll();
    parts.trigger.setAttribute("aria-expanded", "true");
    parts.panel.removeAttribute("hidden");
    parts.stage.classList.add("is-open");
    document.body.classList.add("wp-hero-funnel-open");
    dispatchFunnelEvent(id, true);
    positionPanel(parts.stage, parts.panel);
    if (focusFirstLink) {
      var first = parts.panel.querySelector("a[href]");
      if (first) {
        window.setTimeout(function () {
          first.focus({ preventScroll: true });
        }, 0);
      }
    }
  }

  function bindDisclosure(id) {
    var parts = getStageParts(id);
    var btn = parts.trigger;
    var panel = parts.panel;
    var stage = parts.stage;
    if (!btn || !panel || !stage) return;

    var hoverCloseTimer = null;
    function cancelHoverClose() {
      if (hoverCloseTimer) {
        window.clearTimeout(hoverCloseTimer);
        hoverCloseTimer = null;
      }
    }
    function scheduleHoverClose() {
      cancelHoverClose();
      hoverCloseTimer = window.setTimeout(function () {
        hoverCloseTimer = null;
        var openStage = root.querySelector("[data-hero-funnel-stage].is-open");
        if (!openStage) return;
        if (!openStage.matches(":hover") && !btn.matches(":hover")) closeAll();
      }, 140);
    }

    btn.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeAll();
        return;
      }
      openDisclosure(id, true);
    });

    btn.addEventListener("focusin", function () {
      if (!btn.matches(":focus-visible")) return;
      openDisclosure(id, false);
    });

    if (finePointer) {
      function onEnter() {
        cancelHoverClose();
        openDisclosure(id, false);
      }
      btn.addEventListener("mouseenter", onEnter);
      stage.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", scheduleHoverClose);
      stage.addEventListener("mouseleave", scheduleHoverClose);
    }
  }

  function initDisclosures(items) {
    items.forEach(function (item) {
      bindDisclosure(item.id);
    });

    root.addEventListener("focusin", function (ev) {
      var openStage = root.querySelector("[data-hero-funnel-stage].is-open");
      if (!openStage) return;
      if (openStage.contains(ev.target)) return;
      var openTrigger = openStage.getAttribute("data-hero-funnel-stage");
      var trigger = getStageParts(openTrigger).trigger;
      if (trigger && trigger === ev.target) return;
      if (root.contains(ev.target)) return;
      closeAll();
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") return;
      var openStage = root.querySelector("[data-hero-funnel-stage].is-open");
      if (!openStage) return;
      var openId = openStage.getAttribute("data-hero-funnel-stage");
      var trigger = getStageParts(openId).trigger;
      if (
        !openStage.contains(document.activeElement) &&
        document.activeElement !== trigger
      ) {
        return;
      }
      closeAll();
      if (trigger) trigger.focus();
    });

    document.addEventListener("pointerdown", function (ev) {
      var openStage = root.querySelector("[data-hero-funnel-stage].is-open");
      if (!openStage) return;
      if (openStage.contains(ev.target)) return;
      var openId = openStage.getAttribute("data-hero-funnel-stage");
      var trigger = getStageParts(openId).trigger;
      if (trigger && trigger.contains(ev.target)) return;
      closeAll();
    });

    window.addEventListener(
      "resize",
      function () {
        var openStage = root.querySelector("[data-hero-funnel-stage].is-open");
        if (!openStage) return;
        var openId = openStage.getAttribute("data-hero-funnel-stage");
        var panel = getStageParts(openId).panel;
        if (panel) positionPanel(openStage, panel);
      },
      { passive: true }
    );
  }

  function populatePanels(items) {
    items.forEach(function (item) {
      var panel = root.querySelector(
        '[data-hero-funnel-panel][data-hero-funnel-id="' + item.id + '"]'
      );
      if (!panel) return;
      panel.innerHTML = renderPanel(item);
    });
  }

  function populateTiles(items) {
    items.forEach(renderTile);
  }

  function readInlineData() {
    var el = document.getElementById("hero-toolkit-funnel-data");
    if (!el || !el.textContent.trim()) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (_e) {
      return null;
    }
  }

  function resolveJsonUrl() {
    var script =
      document.currentScript ||
      document.querySelector('script[src*="hero-toolkit-funnel.js"]');
    if (script && script.src) {
      return script.src.replace(/\/[^/]*$/, "/") + "hero-toolkit-funnel.json";
    }
    return "assets/hero-toolkit-funnel.json";
  }

  function boot(items) {
    populatePanels(items);
    populateTiles(items);
    initDisclosures(items);
  }

  var inline = readInlineData();
  if (inline && inline.length) {
    boot(inline);
    return;
  }

  boot(HERO_FUNNEL_DATA);

  fetch(resolveJsonUrl())
    .then(function (res) {
      if (!res.ok) throw new Error("fetch failed");
      return res.json();
    })
    .then(function (items) {
      if (!items || !items.length) return;
      populatePanels(items);
      populateTiles(items);
    })
    .catch(function () {
      /* Inlined HERO_FUNNEL_DATA already rendered */
    });
})();
