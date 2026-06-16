(function initBoxBento() {
  "use strict";

  var DATA_URL = "assets/hero-bento.json";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setCtaLinks(card, selector, href, label) {
    if (!card) return;
    card.querySelectorAll(selector).forEach(function (el) {
      if (href) el.href = href;
      if (label) {
        var arrow = el.querySelector(".bento-card__cta-arrow");
        el.textContent = "";
        el.appendChild(document.createTextNode(label + " "));
        if (arrow) el.appendChild(arrow);
        else {
          var span = document.createElement("span");
          span.className = "bento-card__cta-arrow";
          span.setAttribute("aria-hidden", "true");
          span.textContent = "→";
          el.appendChild(span);
        }
      }
    });
  }

  function buildMarquee(items) {
    return items
      .map(function (item) {
        return (
          '<figure class="bento-card__marquee-item">' +
          '<span class="bento-card__marquee-name">' +
          escapeHtml(item.name) +
          "</span>" +
          '<blockquote class="bento-card__marquee-body">' +
          escapeHtml(item.body) +
          "</blockquote></figure>"
        );
      })
      .join("");
  }

  function buildTimeline(rows) {
    return rows
      .map(function (row, idx) {
        var cls = idx === 0 ? " bento-card__timeline-row is-current" : " bento-card__timeline-row";
        return (
          '<div class="' +
          cls.trim() +
          '"><span>' +
          escapeHtml(row.name) +
          '</span><span class="bento-card__timeline-when">' +
          escapeHtml(row.when) +
          "</span></div>"
        );
      })
      .join("");
  }

  function buildReviews(quotes) {
    return quotes
      .map(function (q) {
        return (
          '<div class="bento-card__review-item is-visible">' +
          '<p class="bento-card__review-text">' +
          escapeHtml(q.text) +
          "</p>" +
          '<cite class="bento-card__review-cite">' +
          escapeHtml(q.cite) +
          "</cite></div>"
        );
      })
      .join("");
  }

  function render(root, data) {
    var toolkits = data.toolkits || {};
    var experience = data.experience || {};
    var reviews = data.reviews || {};

    var toolkitsCard = root.querySelector("[data-hero-bento-toolkits]");
    if (toolkitsCard) {
      var marqueeTrack = toolkitsCard.querySelector("[data-hero-bento-marquee-track]");
      if (marqueeTrack && toolkits.marquee) {
        marqueeTrack.innerHTML = buildMarquee(toolkits.marquee);
      }
      var toolkitsTitle = toolkitsCard.querySelector("[data-hero-bento-toolkits-title]");
      if (toolkitsTitle) toolkitsTitle.textContent = toolkits.title || "Toolkits";
      var toolkitsDesc = toolkitsCard.querySelector("[data-hero-bento-toolkits-desc]");
      if (toolkitsDesc) toolkitsDesc.textContent = toolkits.description || "";
      setCtaLinks(
        toolkitsCard,
        "[data-hero-bento-toolkits-cta]",
        toolkits.href || "toolkits.html",
        toolkits.cta || "Explore toolkits"
      );
    }

    var experienceCard = root.querySelector("[data-hero-bento-experience]");
    if (experienceCard) {
      var timeline = experienceCard.querySelector("[data-hero-bento-timeline]");
      if (timeline && experience.timeline) {
        timeline.innerHTML = buildTimeline(experience.timeline);
      }
      var expTitle = experienceCard.querySelector("[data-hero-bento-experience-title]");
      if (expTitle) expTitle.textContent = experience.title || "My experience";
      var expDesc = experienceCard.querySelector("[data-hero-bento-experience-desc]");
      if (expDesc) {
        var role = experience.currentRole || {};
        expDesc.textContent = role.title
          ? role.title + " — " + (role.copy || experience.description || "")
          : experience.description || "";
      }
      setCtaLinks(
        experienceCard,
        "[data-hero-bento-experience-cta]",
        experience.href || "about.html#experience",
        experience.cta || "See timeline"
      );
      var expSecondary = experienceCard.querySelector("[data-hero-bento-experience-secondary]");
      if (expSecondary && experience.secondaryHref) {
        expSecondary.href = experience.secondaryHref;
        expSecondary.textContent = experience.secondaryCta || "View work";
      } else if (expSecondary) {
        expSecondary.hidden = true;
      }
    }

    var reviewsCard = root.querySelector("[data-hero-bento-reviews-card]");
    if (reviewsCard) {
      var reviewsList = reviewsCard.querySelector("[data-hero-bento-reviews]");
      if (reviewsList && reviews.quotes) {
        reviewsList.innerHTML = buildReviews(reviews.quotes);
      }
      var revTitle = reviewsCard.querySelector("[data-hero-bento-reviews-title]");
      if (revTitle) revTitle.textContent = reviews.title || "My reviews";
      var revDesc = reviewsCard.querySelector("[data-hero-bento-reviews-desc]");
      if (revDesc) revDesc.textContent = reviews.description || "";
      setCtaLinks(
        reviewsCard,
        "[data-hero-bento-reviews-cta]",
        reviews.href || "about.html",
        reviews.cta || "Read more"
      );
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function heroProgress(hero) {
    var heroH = hero.offsetHeight;
    var range = Math.min(window.innerHeight * 0.75, heroH * 0.85);
    if (range < 1) return 0;
    var traveled = Math.max(0, -hero.getBoundingClientRect().top);
    return clamp(traveled / range, 0, 1);
  }

  function publishBoxBentoProgress(root, progress) {
    var boxT = clamp((progress - 0.3) / 0.15, 0, 1);
    var boxTStr = boxT.toFixed(4);
    document.documentElement.style.setProperty("--box-bento-t", boxTStr);

    if (boxT > 0.01) {
      root.setAttribute("data-box-bento-active", "");
    } else {
      root.removeAttribute("data-box-bento-active");
    }

    if (boxT >= 0.5) {
      root.setAttribute("data-box-bento-interactive", "");
    } else {
      root.removeAttribute("data-box-bento-interactive");
    }

    var askBlock = document.querySelector("[data-box-bento-search] .wp-glass-compose");
    var promptInput = document.querySelector("#hero-glass-prompt");

    if (askBlock) {
      if (boxT >= 0.05) {
        askBlock.removeAttribute("aria-hidden");
      } else {
        askBlock.setAttribute("aria-hidden", "true");
      }
    }

    if (promptInput) {
      if (boxT < 0.5) {
        promptInput.setAttribute("aria-hidden", "true");
        promptInput.setAttribute("tabindex", "-1");
      } else {
        promptInput.removeAttribute("aria-hidden");
        promptInput.removeAttribute("tabindex");
      }
    }
  }

  function bootRevealScroll(root) {
    var hero = document.getElementById("hero");
    if (!hero) return;

    function update() {
      publishBoxBentoProgress(root, heroProgress(hero));
    }

    document.documentElement.classList.add("wp-box-bento-fallback");
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }

  function boot() {
    var root = document.querySelector("[data-box-bento]");
    if (!root) return;

    bootRevealScroll(root);

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("hero-bento.json " + res.status);
        return res.json();
      })
      .then(function (data) {
        render(root, data);
      })
      .catch(function () {
        /* Static fallbacks in HTML remain usable */
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
