/**
 * Reviews bento — testimonial-box carousel (AnimatedTestimonials brownfield port)
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

  function render(mount, quotes, activeIndex) {
    if (!quotes.length) return;

    var idx = ((activeIndex % quotes.length) + quotes.length) % quotes.length;
    var item = quotes[idx];

    mount.classList.add("bento-testimonial-box");
    mount.innerHTML =
      '<div class="bento-testimonial-box__avatars" data-bento-testimonial-avatars></div>' +
      '<div class="bento-testimonial-box__copy">' +
      '<p class="bento-testimonial-box__name" data-bento-testimonial-name></p>' +
      '<p class="bento-testimonial-box__designation" data-bento-testimonial-designation></p>' +
      '<p class="bento-testimonial-box__quote" data-bento-testimonial-quote></p>' +
      "</div>";

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
            "bento-testimonial-box__avatar" +
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
            '" alt="" width="120" height="120" draggable="false" />'
          );
        })
        .join("");
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
