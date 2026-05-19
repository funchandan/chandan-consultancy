/**
 * When opened from the share bundle (?from=share or /share/ referrer),
 * point "Back to work" at ../share/work.html instead of ../work.html.
 */
(function () {
  var back = document.querySelector(".case-scan-back");
  if (!back) return;

  var fromShare = false;
  try {
    fromShare =
      new URLSearchParams(window.location.search).get("from") === "share" ||
      /\/share\//.test(document.referrer || "");
  } catch (_) {
    /* ignore */
  }

  if (fromShare) {
    back.setAttribute("href", "../share/work.html");
  }
})();
