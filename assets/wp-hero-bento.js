(function initHeroBento() {
  "use strict";

  var DATA_URL = "assets/hero-bento.json";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildMarquee(items) {
    return items
      .map(function (item) {
        return (
          '<figure class="wp-hero-bento__marquee-item">' +
          '<span class="wp-hero-bento__marquee-name">' +
          escapeHtml(item.name) +
          "</span>" +
          '<blockquote class="wp-hero-bento__marquee-body">' +
          escapeHtml(item.body) +
          "</blockquote></figure>"
        );
      })
      .join("");
  }

  function buildTimeline(rows) {
    return rows
      .map(function (row, idx) {
        var cls = idx === 0 ? " wp-hero-bento__timeline-row is-current" : " wp-hero-bento__timeline-row";
        return (
          '<div class="' +
          cls.trim() +
          '"><span>' +
          escapeHtml(row.name) +
          '</span><span class="wp-hero-bento__timeline-when">' +
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
          '<div class="wp-hero-bento__review-item is-visible">' +
          '<p class="wp-hero-bento__review-text">' +
          escapeHtml(q.text) +
          "</p>" +
          '<cite class="wp-hero-bento__review-cite">' +
          escapeHtml(q.cite) +
          "</cite></div>"
        );
      })
      .join("");
  }

  function render(root, data) {
    var toolkits = data.toolkits || {};
    var reviews = data.reviews || {};

    var toolkitsCard = root.querySelector("[data-hero-bento-toolkits]");
    if (toolkitsCard) {
      toolkitsCard.href = toolkits.href || "toolkits.html";
      var marqueeTrack = toolkitsCard.querySelector("[data-hero-bento-marquee-track]");
      if (marqueeTrack && toolkits.marquee) {
        marqueeTrack.innerHTML = buildMarquee(toolkits.marquee);
      }
      var toolkitsTitle = toolkitsCard.querySelector("[data-hero-bento-toolkits-title]");
      if (toolkitsTitle) toolkitsTitle.textContent = toolkits.title || "Toolkits";
      var toolkitsDesc = toolkitsCard.querySelector("[data-hero-bento-toolkits-desc]");
      if (toolkitsDesc) toolkitsDesc.textContent = toolkits.description || "";
      var toolkitsCta = toolkitsCard.querySelector("[data-hero-bento-toolkits-cta]");
      if (toolkitsCta) toolkitsCta.textContent = toolkits.cta || "Explore toolkits";
    }

    var quiz = data.quiz || {};
    if (quiz) {
      var quizCard = root.querySelector("[data-hero-bento-quiz]");
      if (quizCard) {
        var quizMount = quizCard.querySelector("[data-bento-quiz-widget]");
        if (quizMount && quiz.items && quiz.items.length) {
          quizMount.setAttribute("data-bento-quiz-data", JSON.stringify(quiz));
        }
      }
    }

    var reviewsCard = root.querySelector("[data-hero-bento-reviews-card]");
    if (reviewsCard) {
      var testimonialMount = reviewsCard.querySelector("[data-bento-bg-artifact='testimonial-box']");
      if (testimonialMount && reviews.quotes) {
        testimonialMount.setAttribute(
          "data-bento-testimonial-data",
          JSON.stringify(reviews.quotes)
        );
      }
    }
  }

  function boot() {
    var root = document.querySelector("[data-hero-bento]");
    if (!root) return;

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
