(function () {
  "use strict";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const themeToggle = document.getElementById("theme-toggle");

  const THEME_KEY = "theme";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  function applyTheme(theme) {
    const isDark = theme === THEME_DARK;
    document.documentElement.dataset.theme = isDark ? THEME_DARK : THEME_LIGHT;
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (_e) {
      saved = null;
    }
    applyTheme(saved === THEME_DARK ? THEME_DARK : THEME_LIGHT);
  }

  themeToggle.addEventListener("click", function () {
    const next =
      document.documentElement.dataset.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (_e) {
      // Ignore: localStorage may be unavailable (e.g. private mode, quota).
    }
  });

  initTheme();

  function addTask(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }

    const item = document.createElement("li");
    item.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = trimmed;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete task: " + trimmed);
    deleteBtn.addEventListener("click", function () {
      item.remove();
    });

    item.appendChild(span);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });
})();
