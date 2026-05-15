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

  function readSavedTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === THEME_LIGHT || saved === THEME_DARK ? saved : null;
    } catch (_e) {
      return null;
    }
  }

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_DARK
      : THEME_LIGHT;
  }

  function resolveTheme() {
    return readSavedTheme() || getSystemTheme();
  }

  function initTheme() {
    applyTheme(resolveTheme());
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

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
      // Saved preference always wins; only follow the system when none is set.
      if (readSavedTheme() === null) {
        applyTheme(event.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  }

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
