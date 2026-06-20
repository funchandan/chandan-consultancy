/**
 * Reviews bento — AnimatedTestimonials brownfield port
 */
(function () {
  "use strict";

  var WPM = window.WPMotion;
  if (!WPM || typeof WPM.register !== "function") return;

  function avatarUrl(name) {
    return (
      "https://api.dicebear.com/9.x/avataaars/svg?seed=" +
      encodeURIComponent(name || "Collaborator")
    );
  }

  function normalizeQuotes(raw) {
    if (!raw || !raw.length) return [];
    return raw.map(function (q) {
      return {
        quote: q.quote || q.text || "",
        name: q.name || "Collaborator",
        designation: q.designation || q.cite || "",
        src: q.src || avatarUrl(q.name || q.cite || "Collaborator"),
      };
    });
  }

  function parseQuotes(mount) {
    var raw = mount.getAttribute("data-bento-testimonial-data");
    if (!raw) return [];
    try {
      return normalizeQuotes(JSON.parse(raw));
    } catch (_err) {
      return [];
    }
  }

  function arrowIcon(dir) {
    if (dir === "prev") {
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      );
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
  }

  function shellHtml() {
    return (
      '<div class="bento-animated-testimonials" data-bento-animated-testimonials data-embedded="true">' +
      '<div class="bento-animated-testimonials__grid">' +
      '<div class="bento-animated-testimonials__media" data-bento-testimonial-avatars></div>' +
      '<div class="bento-animated-testimonials__copy">' +
      '<p class="bento-animated-testimonials__name" data-bento-testimonial-name></p>' +
      '<p class="bento-animated-testimonials__designation" data-bento-testimonial-designation></p>' +
      '<p class="bento-animated-testimonials__quote" data-bento-testimonial-quote></p>' +
      '<div class="bento-animated-testimonials__nav">' +
      '<button type="button" class="bento-animated-testimonials__nav-btn" data-bento-testimonial-prev aria-label="Previous review">' +
      arrowIcon("prev") +
      "</button>" +
      '<button type="button" class="bento-animated-testimonials__nav-btn" data-bento-testimonial-next aria-label="Next review">' +
      arrowIcon("next") +
      "</button>" +
      "</div></div></div></div>"
    );
  }

  function render(mount, quotes, activeIndex) {
    if (!quotes.length) return;

    var idx = ((activeIndex % quotes.length) + quotes.length) % quotes.length;
    var item = quotes[idx];

    if (!mount.querySelector("[data-bento-animated-testimonials]")) {
      mount.classList.add("bento-animated-testimonials-shell");
      mount.innerHTML = shellHtml();
    }

    var avatars = mount.querySelector("[data-bento-testimonial-avatars]");
    var nameEl = mount.querySelector("[data-bento-testimonial-name]");
    var designationEl = mount.querySelector("[data-bento-testimonial-designation]");
    var quoteEl = mount.querySelector("[data-bento-testimonial-quote]");

    if (nameEl) nameEl.textContent = item.name;
    if (designationEl) designationEl.textContent = item.designation;
    if (quoteEl) quoteEl.textContent = item.quote;

    if (avatars) {
      avatars.innerHTML = quotes
        .map(function (q, i) {
          var cls =
            "bento-animated-testimonials__avatar" +
            (i === idx
              ? " is-active"
              : i === idx - 1 || (idx === 0 && i === quotes.length - 1)
                ? " is-stack"
                : "");
          return (
            '<img class="' +
            cls +
            '" src="' +
            q.src +
            '" alt="' +
            q.name +
            '" width="120" height="120" draggable="false" />'
          );
        })
        .join("");
    }
  }

  function wireNav(mount, getActive, setActive, paint, startAutoplay) {
    var prev = mount.querySelector("[data-bento-testimonial-prev]");
    var next = mount.querySelector("[data-bento-testimonial-next]");

    if (prev) {
      prev.addEventListener("click", function () {
        var quotes = getActive().quotes;
        if (!quotes.length) return;
        setActive((getActive().active - 1 + quotes.length) % quotes.length);
        paint();
        startAutoplay();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        var quotes = getActive().quotes;
        if (!quotes.length) return;
        setActive((getActive().active + 1) % quotes.length);
        paint();
        startAutoplay();
      });
    }
  }

  WPM.register("bento-testimonial-box", {
    layer: 2,
    init: function (root, ctx) {
      var mount =
        root.querySelector("[data-bento-bg-artifact='testimonial-box']") ||
        root.querySelector("[data-bento-bg-artifact=testimonial-box]");
      if (!mount) return;

      var quotes = parseQuotes(mount);
      var active = 0;
      var timer = null;
      var navWired = false;

      function state() {
        return { quotes: quotes, active: active };
      }

      function clearTimer() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function paint() {
        if (!quotes.length) return;
        render(mount, quotes, active);
      }

      function startAutoplay() {
        clearTimer();
        if (ctx.reduced || quotes.length < 2) return;
        timer = window.setInterval(function () {
          active = (active + 1) % quotes.length;
          paint();
        }, 5000);
      }

      function onHydrate(e) {
        var detail = e.detail || {};
        if (detail.mount !== mount || !detail.quotes) return;
        quotes = normalizeQuotes(detail.quotes);
        active = 0;
        paint();
        startAutoplay();
      }

      if (!navWired) {
        wireNav(
          mount,
          state,
          function (next) {
            active = next;
          },
          paint,
          startAutoplay
        );
        navWired = true;
      }

      document.addEventListener("wp:bento-testimonials-hydrated", onHydrate);
      paint();
      startAutoplay();

      return function destroy() {
        clearTimer();
        document.removeEventListener("wp:bento-testimonials-hydrated", onHydrate);
        mount.innerHTML = "";
      };
    },
  });
})();
