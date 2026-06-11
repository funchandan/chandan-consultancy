/**
 * Glass compose prompt — chat input + category suggestion tabs (prompt-kit pivot).
 */
(function () {
  "use strict";

  var SUGGESTION_GROUPS = [
    {
      label: "Summary",
      highlight: "Summarize",
      items: [
        "Summarize a document",
        "Summarize a video",
        "Summarize a podcast",
        "Summarize a book",
      ],
    },
    {
      label: "Code",
      highlight: "Help me",
      items: [
        "Help me write React components",
        "Help me debug code",
        "Help me learn Python",
        "Help me learn SQL",
      ],
    },
    {
      label: "Design",
      highlight: "Design",
      items: [
        "Design a small logo",
        "Design a hero section",
        "Design a landing page",
        "Design a social media post",
      ],
    },
    {
      label: "Research",
      highlight: "Research",
      items: [
        "Research the best practices for SEO",
        "Research the best running shoes",
        "Research the best restaurants in Paris",
        "Research the best AI tools",
      ],
    },
  ];

  var BRAIN_ICON =
    '<svg class="wp-glass-compose__tab-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>' +
    '<path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>' +
    '<path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>' +
    '<path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>' +
    '<path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>' +
    '<path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>' +
    '<path d="M19.938 10.5a4 4 0 0 1 .585.396"/>' +
    '<path d="M6 18a4 4 0 0 1-1.967-.516"/>' +
    '<path d="M19.967 17.484A4 4 0 0 1 18 18"/>' +
    "</svg>";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightText(text, highlight) {
    if (!highlight) return escapeHtml(text);
    var idx = text.indexOf(highlight);
    if (idx < 0) return escapeHtml(text);
    return (
      escapeHtml(text.slice(0, idx)) +
      "<strong>" +
      escapeHtml(text.slice(idx, idx + highlight.length)) +
      "</strong>" +
      escapeHtml(text.slice(idx + highlight.length))
    );
  }

  function groupByLabel(label) {
    for (var i = 0; i < SUGGESTION_GROUPS.length; i++) {
      if (SUGGESTION_GROUPS[i].label === label) return SUGGESTION_GROUPS[i];
    }
    return null;
  }

  function init(root) {
    var frame = root.querySelector("[data-glass-compose-frame]");
    var form = root.querySelector("[data-glass-prompt-form]");
    var input = root.querySelector("[data-glass-prompt-input]");
    var sendBtn = root.querySelector("[data-glass-prompt-send]");
    var tabsHost = root.querySelector("[data-glass-suggestion-tabs]");
    var listHost = root.querySelector("[data-glass-suggestion-list]");

    if (!frame || !form || !input || !sendBtn || !tabsHost || !listHost) return;

    var activeCategory = "";
    var maxHeight = 160;

    function resizeTextarea() {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, maxHeight) + "px";
    }

    function syncSendState() {
      sendBtn.disabled = input.value.trim().length === 0;
    }

    function setActiveCategory(label) {
      activeCategory = label || "";
      root.classList.toggle("wp-glass-compose--category-open", !!activeCategory);

      var tabs = tabsHost.querySelectorAll("[data-glass-suggestion-tab]");
      var i;
      for (i = 0; i < tabs.length; i++) {
        var isActive = tabs[i].getAttribute("data-glass-suggestion-tab") === activeCategory;
        tabs[i].setAttribute("aria-pressed", isActive ? "true" : "false");
      }

      if (!activeCategory) {
        tabsHost.hidden = false;
        listHost.hidden = true;
        listHost.innerHTML = "";
        return;
      }

      var group = groupByLabel(activeCategory);
      if (!group) return;

      tabsHost.hidden = true;
      listHost.hidden = false;
      listHost.innerHTML = group.items
        .map(function (item) {
          return (
            '<button type="button" class="wp-glass-compose__suggestion-item" role="listitem" data-glass-suggestion-item="' +
            escapeHtml(item) +
            '">' +
            highlightText(item, group.highlight) +
            "</button>"
          );
        })
        .join("");
    }

    var submitPipeline = null;

    function deliverMailto(value) {
      var subject = encodeURIComponent("Portfolio inquiry");
      var body = encodeURIComponent(value);
      window.location.href =
        "mailto:chandan004sharma@gmail.com?subject=" + subject + "&body=" + body;

      input.value = "";
      resizeTextarea();
      syncSendState();
      setActiveCategory("");
    }

    function handleSend(ev) {
      if (ev) ev.preventDefault();
      var value = input.value.trim();
      if (!value) return;

      if (submitPipeline) {
        submitPipeline(value, deliverMailto);
        return;
      }

      deliverMailto(value);
    }

    SUGGESTION_GROUPS.forEach(function (group) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "wp-glass-compose__suggestion-tab";
      tab.setAttribute("data-glass-suggestion-tab", group.label);
      tab.setAttribute("role", "listitem");
      tab.setAttribute("aria-pressed", "false");
      tab.innerHTML = BRAIN_ICON + escapeHtml(group.label);
      tabsHost.appendChild(tab);
    });

    tabsHost.addEventListener("click", function (ev) {
      var tab = ev.target.closest("[data-glass-suggestion-tab]");
      if (!tab || !tabsHost.contains(tab)) return;
      var label = tab.getAttribute("data-glass-suggestion-tab");
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      resizeTextarea();
      syncSendState();
      input.focus();
      setActiveCategory(label);
    });

    listHost.addEventListener("click", function (ev) {
      var item = ev.target.closest("[data-glass-suggestion-item]");
      if (!item || !listHost.contains(item)) return;
      input.value = item.getAttribute("data-glass-suggestion-item") || item.textContent || "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      resizeTextarea();
      syncSendState();
      input.focus();
    });

    input.addEventListener("input", function () {
      resizeTextarea();
      syncSendState();
      if (input.value.trim() === "") setActiveCategory("");
    });

    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        handleSend();
      }
      if (ev.key === "Escape" && activeCategory) {
        setActiveCategory("");
      }
    });

    form.addEventListener("submit", handleSend);

    frame.addEventListener("focusin", function () {
      frame.classList.add("is-active");
    });

    document.addEventListener("mousedown", function (ev) {
      if (frame.contains(ev.target)) return;
      frame.classList.remove("is-active");
    });

    document.addEventListener("touchstart", function (ev) {
      if (frame.contains(ev.target)) return;
      frame.classList.remove("is-active");
    });

    resizeTextarea();
    syncSendState();
    setActiveCategory("");

    window.setTimeout(function () {
      document.dispatchEvent(
        new CustomEvent("wp:glass-compose-init", {
          detail: {
            root: root,
            input: input,
            form: form,
            sendBtn: sendBtn,
            resizeTextarea: resizeTextarea,
            syncSendState: syncSendState,
            registerSubmit: function (fn) {
              submitPipeline = fn;
            },
          },
        })
      );
    }, 0);
  }

  function boot() {
    var root = document.querySelector("[data-wp-glass-compose]");
    if (root) init(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
