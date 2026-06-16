(function initBoxBento() {
  "use strict";

  var DATA_URL = "assets/hero-bento.json?v=3";

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

  function buildTitleReveal(title, accentIndex) {
    var words = String(title || "Title")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) words = ["Title"];
    var accentIdx =
      accentIndex != null ? accentIndex : Math.max(0, words.length - 1);
    var html = '<span class="wp-bento-title-reveal" data-bento-title-reveal>';
    words.forEach(function (word, i) {
      html +=
        '<span class="wp-bento-title-reveal__word" style="--bento-word-i:' +
        i +
        '">' +
        '<span class="wp-bento-title-reveal__ghost" aria-hidden="true">' +
        escapeHtml(word) +
        "</span>" +
        '<span class="wp-bento-title-reveal__fill">';
      if (i === accentIdx) {
        html += '<span class="wp-aurora-text">' + escapeHtml(word) + "</span>";
      } else {
        html += escapeHtml(word);
      }
      html += "</span></span>";
    });
    html += "</span>";
    return html;
  }

  function setTitleReveal(el, title, accentIndex) {
    if (!el) return;
    el.innerHTML = buildTitleReveal(title, accentIndex);
    el.removeAttribute("data-bento-title-wired");
  }

  function avatarUrl(name) {
    return (
      "https://api.dicebear.com/9.x/avataaars/svg?seed=" +
      encodeURIComponent(name || "Collaborator")
    );
  }

  function normalizeTestimonialQuotes(quotes) {
    if (!quotes || !quotes.length) return [];
    return quotes.map(function (q) {
      return {
        quote: q.quote || q.text || "",
        name: q.name || "Collaborator",
        designation: q.designation || q.cite || "",
        src: q.src || avatarUrl(q.name || q.cite || "Collaborator"),
      };
    });
  }

  function hydrateTestimonials(mount, quotes) {
    if (!mount) return;
    var normalized = normalizeTestimonialQuotes(quotes);
    if (!normalized.length) return;
    mount.setAttribute("data-bento-testimonial-data", JSON.stringify(normalized));
    document.dispatchEvent(
      new CustomEvent("wp:bento-testimonials-hydrated", {
        detail: { mount: mount, quotes: normalized },
      })
    );
  }

  function render(root, data) {
    var toolkits = data.toolkits || {};
    var poll = data.poll || {};
    var reviews = data.reviews || {};

    var toolkitsCard = root.querySelector("[data-hero-bento-toolkits]");
    if (toolkitsCard) {
      var toolkitsTitle = toolkitsCard.querySelector("[data-hero-bento-toolkits-title]");
      setTitleReveal(toolkitsTitle, toolkits.title || "Toolkits", 0);
      var toolkitsDesc = toolkitsCard.querySelector("[data-hero-bento-toolkits-desc]");
      if (toolkitsDesc) toolkitsDesc.textContent = toolkits.description || "";
      setCtaLinks(
        toolkitsCard,
        "[data-hero-bento-toolkits-cta]",
        toolkits.href || "toolkits.html",
        toolkits.cta || "Explore toolkits"
      );
    }

    var pollCard = root.querySelector("[data-hero-bento-poll]");
    if (pollCard) {
      var pollMount = pollCard.querySelector("[data-bento-poll-widget]");
      if (pollMount && poll.options && poll.options.length) {
        if (window.WPBentoPoll && typeof window.WPBentoPoll.hydrate === "function") {
          window.WPBentoPoll.hydrate(pollMount, poll);
        } else {
          pollMount.setAttribute("data-bento-poll-data", JSON.stringify(poll));
          document.dispatchEvent(
            new CustomEvent("wp:bento-poll-hydrated", {
              detail: { mount: pollMount, poll: poll },
            })
          );
        }
      }
    }

    var reviewsCard = root.querySelector("[data-hero-bento-reviews-card]");
    if (reviewsCard) {
      var testimonialMount = reviewsCard.querySelector("[data-bento-bg-artifact='testimonial-box']");
      if (testimonialMount && reviews.quotes) {
        hydrateTestimonials(testimonialMount, reviews.quotes);
      }
      var revPinTitle = reviewsCard.querySelector("[data-bento-3d-pin-title]");
      if (revPinTitle) revPinTitle.textContent = reviews.cta || "Read more";
      var revTitle = reviewsCard.querySelector("[data-hero-bento-reviews-title]");
      setTitleReveal(revTitle, reviews.title || "My reviews", 1);
      var revDesc = reviewsCard.querySelector("[data-hero-bento-reviews-desc]");
      if (revDesc) revDesc.textContent = reviews.description || "";
      setCtaLinks(
        reviewsCard,
        "[data-hero-bento-reviews-cta]",
        reviews.href || "about.html",
        reviews.cta || "Read more"
      );
    }

    document.dispatchEvent(new CustomEvent("wp:bento-titles-updated"));
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
