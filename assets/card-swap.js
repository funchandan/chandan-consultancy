/**
 * CardSwap — vanilla port of React Bits (prompt-mind.md), tuned for bento cell.
 */
(function initCardSwap(global) {
  "use strict";

  function makeSlot(i, distX, distY, total, invertStack) {
    var signX = invertStack ? -1 : 1;
    var signY = invertStack ? 1 : -1;
    return {
      x: signX * i * distX,
      y: signY * i * distY,
      z: -i * distX * 1.5,
      zIndex: total - i,
    };
  }

  function placeNow(gsap, el, slot, skew) {
    gsap.set(el, {
      x: slot.x,
      y: slot.y,
      z: slot.z,
      xPercent: -50,
      yPercent: -50,
      skewY: skew,
      transformOrigin: "center center",
      zIndex: slot.zIndex,
      force3D: true,
    });
  }

  function readNumber(el, name, fallback) {
    var raw = el.getAttribute(name);
    if (raw == null || raw === "") return fallback;
    var n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }

  function CardSwap(container, options) {
    this.container = container;
    this.gsap = options.gsap;
    this.flatMode = options.flatMode === true;
    this.cards = Array.prototype.slice.call(container.querySelectorAll(".card"));
    this.cardDistance = options.cardDistance;
    this.verticalDistance = options.verticalDistance;
    this.delay = options.delay;
    this.pauseOnHover = options.pauseOnHover;
    this.skewAmount = options.skewAmount;
    this.easing = options.easing;
    this.yDrop = options.yDrop;
    this.invertStack = options.invertStack;
    this.onFrontChange = options.onFrontChange || null;
    this.order = this.cards.map(function (_, i) {
      return i;
    });
    this.tlRef = null;
    this.intervalRef = null;
    this.isSwapping = false;

    this.config =
      this.easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 1.1,
            durMove: 1.1,
            durReturn: 1.1,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: "power2.out",
            durDrop: 0.55,
            durMove: 0.55,
            durReturn: 0.55,
            promoteOverlap: 0.45,
            returnDelay: 0.12,
          };

    var self = this;
    this.cards.forEach(function (card, i) {
      if (options.width != null) {
        card.style.width =
          typeof options.width === "number" ? options.width + "px" : options.width;
      }
      if (options.height != null) {
        card.style.height =
          typeof options.height === "number" ? options.height + "px" : options.height;
      }
      card.addEventListener("click", function (e) {
        if (self.order[0] !== i) return;
        if (options.onCardClick) options.onCardClick(i);
      });
    });

    this.syncFrontState();
    this.startInterval();

    if (this.pauseOnHover) {
      this._pause = function () {
        if (self.tlRef) self.tlRef.pause();
        self.clearInterval();
      };
      this._resume = function () {
        if (self.tlRef) self.tlRef.play();
        self.startInterval();
      };
      container.addEventListener("mouseenter", this._pause);
      container.addEventListener("mouseleave", this._resume);
    }
  }

  CardSwap.prototype.revealAllForMotion = function () {
    this.cards.forEach(function (card) {
      card.classList.remove("is-hidden");
    });
  };

  CardSwap.prototype.syncFrontState = function () {
    var front = this.order[0];
    var self = this;
    this.cards.forEach(function (card, i) {
      var stackPos = self.order.indexOf(i);
      var isFront = stackPos === 0;
      card.classList.toggle("is-front", isFront);
      card.classList.toggle("is-back", stackPos === 1);
      card.classList.toggle("is-hidden", stackPos > 1);
      card.setAttribute("aria-hidden", isFront ? "false" : "true");
    });
    if (this.onFrontChange) this.onFrontChange(front);
  };

  CardSwap.prototype.layoutAll = function (animate) {
    var self = this;
    var gsap = this.gsap;
    this.cards.forEach(function (card, cardIndex) {
      if (self.flatMode) {
        gsap.set(card, {
          x: 0,
          y: 0,
          z: 0,
          xPercent: -50,
          yPercent: -50,
          skewY: 0,
          transformOrigin: "center center",
          zIndex: self.order.indexOf(cardIndex) === 0 ? 2 : 1,
          force3D: false,
        });
        return;
      }
      var pos = self.order.indexOf(cardIndex);
      var slot = makeSlot(
        pos,
        self.cardDistance,
        self.verticalDistance,
        self.cards.length,
        self.invertStack
      );
      if (animate) {
        gsap.to(card, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          skewY: self.skewAmount,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.set(card, { zIndex: slot.zIndex });
      } else {
        placeNow(gsap, card, slot, self.skewAmount);
      }
    });
    this.syncFrontState();
  };

  CardSwap.prototype.frontIndex = function () {
    return this.order[0];
  };

  CardSwap.prototype.clearInterval = function () {
    if (this.intervalRef) {
      window.clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  };

  CardSwap.prototype.startInterval = function () {
    var self = this;
    this.clearInterval();
    if (this.delay <= 0) return;
    this.intervalRef = window.setInterval(function () {
      self.swap();
    }, this.delay);
  };

  CardSwap.prototype.resetInterval = function () {
    this.clearInterval();
    this.startInterval();
  };

  CardSwap.prototype.killTimeline = function () {
    if (this.tlRef) {
      this.tlRef.kill();
      this.tlRef = null;
    }
    this.isSwapping = false;
  };

  CardSwap.prototype.swap = function () {
    if (this.order.length < 2 || this.isSwapping) return;
    var self = this;
    var gsap = this.gsap;
    var front = this.order[0];
    var rest = this.order.slice(1);
    var elFront = this.cards[front];

    if (this.flatMode) {
      this.isSwapping = true;
      gsap.to(elFront, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.out",
        onComplete: function () {
          self.order = rest.concat(front);
          self.layoutAll(false);
          self.syncFrontState();
          self.isSwapping = false;
        },
      });
      return;
    }

    var cfg = this.config;

    this.isSwapping = true;
    this.revealAllForMotion();
    var tl = gsap.timeline({
      onComplete: function () {
        self.isSwapping = false;
      },
    });
    this.tlRef = tl;

    tl.to(elFront, {
      y: "+=" + self.yDrop,
      duration: cfg.durDrop,
      ease: cfg.ease,
    });
    tl.addLabel("promote", "-=" + cfg.durDrop * cfg.promoteOverlap);
    rest.forEach(function (idx, i) {
      var el = self.cards[idx];
      var slot = makeSlot(
        i,
        self.cardDistance,
        self.verticalDistance,
        self.cards.length,
        self.invertStack
      );
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: cfg.durMove,
          ease: cfg.ease,
        },
        "promote+=" + i * 0.12
      );
    });
    var backSlot = makeSlot(
      this.cards.length - 1,
      this.cardDistance,
      this.verticalDistance,
      this.cards.length,
      this.invertStack
    );
    tl.addLabel("return", "promote+=" + cfg.durMove * cfg.returnDelay);
    tl.call(function () {
      gsap.set(elFront, { zIndex: backSlot.zIndex });
    }, null, "return");
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: cfg.durReturn,
        ease: cfg.ease,
      },
      "return"
    );
    tl.call(function () {
      self.order = rest.concat(front);
      self.syncFrontState();
    });
  };

  CardSwap.prototype.jumpToIndex = function (cardIndex) {
    var pos = this.order.indexOf(cardIndex);
    if (pos < 0) return;
    this.killTimeline();
    this.resetInterval();
    if (pos === 0) {
      this.syncFrontState();
      return;
    }
    this.order = this.order.slice(pos).concat(this.order.slice(0, pos));
    this.revealAllForMotion();
    var reduced =
      global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.layoutAll(!reduced);
  };

  function syncPills(container, frontIdx) {
    var card = container.querySelectorAll(".card")[frontIdx];
    var stage = card && card.getAttribute("data-toolkit-stage");
    if (!stage) return;
    var root = container.closest("[data-toolkit-cardswap-root]");
    if (!root) return;
    root.querySelectorAll("[data-toolkit-pill]").forEach(function (pill) {
      var on = pill.getAttribute("data-toolkit-pill") === stage;
      pill.setAttribute("aria-selected", on ? "true" : "false");
      pill.tabIndex = on ? 0 : -1;
    });
  }

  function mount(container) {
    if (!global.gsap) return null;
    var easing = container.getAttribute("data-easing") || "elastic";
    var reducedMotion = global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var instance = new CardSwap(container, {
      gsap: global.gsap,
      flatMode: !!container.closest(".bento-toolkit-swap"),
      width: container.getAttribute("data-width"),
      height: container.getAttribute("data-height"),
      cardDistance: readNumber(container, "data-card-distance", 18),
      verticalDistance: readNumber(container, "data-vertical-distance", 14),
      delay: reducedMotion ? 0 : readNumber(container, "data-delay", 5000),
      pauseOnHover: container.getAttribute("data-pause-on-hover") === "true",
      skewAmount: readNumber(container, "data-skew", 4),
      yDrop: readNumber(container, "data-y-drop", 120),
      easing: easing,
      invertStack: container.getAttribute("data-stack-invert") === "true",
      onFrontChange: function (frontIdx) {
        syncPills(container, frontIdx);
      },
    });
    instance.layoutAll(false);
    container._cardSwap = instance;
    return instance;
  }

  function bindPills(root, instance) {
    var pills = root.querySelector("[data-toolkit-pills]");
    if (!pills || !instance) return;
    var stageToIndex = {};
    instance.cards.forEach(function (card, i) {
      var id = card.getAttribute("data-toolkit-stage");
      if (id) stageToIndex[id] = i;
    });
    pills.addEventListener("click", function (e) {
      var pill = e.target.closest("[data-toolkit-pill]");
      if (!pill) return;
      e.preventDefault();
      e.stopPropagation();
      var idx = stageToIndex[pill.getAttribute("data-toolkit-pill")];
      if (idx == null) return;
      instance.jumpToIndex(idx);
    });
    pills.addEventListener("keydown", function (e) {
      var items = Array.prototype.slice.call(pills.querySelectorAll("[data-toolkit-pill]"));
      var current = items.findIndex(function (p) {
        return p.getAttribute("aria-selected") === "true";
      });
      if (current < 0) current = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        items[(current + 1) % items.length].click();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        items[(current - 1 + items.length) % items.length].click();
      }
    });
  }

  function boot() {
    if (!global.gsap) {
      window.setTimeout(boot, 40);
      return;
    }
    document.querySelectorAll(".card-swap-container[data-card-swap]").forEach(function (container) {
      if (container._cardSwap) return;
      var instance = mount(container);
      var root = container.closest("[data-toolkit-cardswap-root]");
      if (root) bindPills(root, instance);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  global.WPCardSwap = { mount: mount };
})(window);
