(function () {
  "use strict";

  const STORAGE_KEY = "todo.tasks";

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

  let tasks = loadTasks();

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter(function (t) {
          return t && typeof t.id === "string" && typeof t.text === "string";
        })
        .map(function (t) {
          return { id: t.id, text: t.text, completed: t.completed === true };
        });
    } catch (_err) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (_err) {
      // Storage unavailable (quota, private mode); keep in-memory state.
    }
  }

  function newId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function buildRow(task) {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " completed" : "");
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      (task.completed ? "Mark as not completed: " : "Mark as completed: ") + task.text,
    );
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", "Delete task: " + task.text);
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    item.appendChild(checkbox);
    item.appendChild(span);
    item.appendChild(deleteBtn);
    return item;
  }

  function render() {
    list.textContent = "";
    for (const task of tasks) {
      list.appendChild(buildRow(task));
    }
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
    tasks.push({ id: newId(), text: trimmed, completed: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find(function (t) {
      return t.id === id;
    });
    if (!task) {
      return;
    }
    task.completed = !task.completed;
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    saveTasks();
    render();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });

  render();
})();
