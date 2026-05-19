/**
 * Case study scan — gallery (horizontal + focus tunnel) or legacy vertical reveals.
 */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gallery = document.querySelector("[data-case-gallery]");
  var track = document.querySelector("[data-case-gallery-track]");
  var nav = document.querySelector("[data-case-gallery-nav]");
  var stories = document.querySelectorAll(".case-scan-story");

  if (!stories.length) return;

  if (gallery && track) {
    initGallery(track, nav, stories, reduced);
    initMoreToggles(stories);
    initArtefactHover();
    return;
  }

  initLegacyReveal(stories, reduced);
  initMoreToggles(stories);
  initArtefactHover();
})();

function initMoreToggles(stories) {
  stories.forEach(function (story) {
    var btn = story.querySelector(".case-scan-story__more");
    var detail = story.querySelector(".case-scan-story__detail");
    if (!btn || !detail) return;

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.textContent = open ? "More" : "Less";
      if (open) {
        detail.hidden = true;
        detail.classList.remove("is-open");
      } else {
        detail.hidden = false;
        detail.classList.add("is-open");
      }
    });
  });
}

function initArtefactHover() {
  document.querySelectorAll(".case-scan-story__artefact-frame").forEach(function (frame) {
    frame.addEventListener("mouseenter", function () {
      frame.classList.add("is-hovered");
    });
    frame.addEventListener("mouseleave", function () {
      frame.classList.remove("is-hovered");
    });
  });
}

function initGallery(track, nav, stories, reduced) {
  var links = nav ? nav.querySelectorAll(".case-scan-gallery-nav__link") : [];

  function setActive(index) {
    stories.forEach(function (story, i) {
      story.classList.toggle("is-active", i === index);
      story.classList.add("is-visible");
    });
    links.forEach(function (link, i) {
      link.classList.toggle("is-active", i === index);
    });
  }

  function indexFromScroll() {
    var w = track.clientWidth || 1;
    return Math.round(track.scrollLeft / w);
  }

  function scrollToIndex(index) {
    var w = track.clientWidth;
    track.scrollTo({ left: w * index, behavior: reduced ? "auto" : "smooth" });
    setActive(index);
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var idx = parseInt(link.getAttribute("data-gallery-index"), 10);
      if (!isNaN(idx)) scrollToIndex(idx);
    });
  });

  var scrollTimer;
  track.addEventListener("scroll", function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      setActive(indexFromScroll());
    }, 80);
  }, { passive: true });

  setActive(0);

  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            var idx = Array.prototype.indexOf.call(stories, entry.target);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: track, threshold: [0.45, 0.55, 0.65] }
    );
    stories.forEach(function (s) {
      io.observe(s);
    });
  }
}

function initLegacyReveal(stories, reduced) {
  stories.forEach(function (el, i) {
    el.style.setProperty("--story-index", String(i));
    if (reduced) {
      el.classList.add("is-visible");
    }
  });

  if (reduced || !("IntersectionObserver" in window)) {
    stories.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  stories.forEach(function (el) {
    observer.observe(el);
  });
}
