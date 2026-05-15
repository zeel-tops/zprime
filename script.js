(function () {
  "use strict";

  const STORAGE_KEY = "todos";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");

  let todos = loadTodos();

  function loadTodos() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return [];
    }
    if (raw === null) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (t) => t && typeof t.id === "string" && typeof t.text === "string",
      );
    } catch (err) {
      return [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      // Storage unavailable (quota, private mode); keep in-memory state.
    }
  }

  function createId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
    todos.push({ id: createId(), text: trimmed });
    saveTodos();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    render();
  }

  function render() {
    list.textContent = "";
    for (const todo of todos) {
      const item = document.createElement("li");
      item.className = "task-item";

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("aria-label", "Delete task: " + todo.text);
      deleteBtn.addEventListener("click", function () {
        deleteTodo(todo.id);
      });

      item.appendChild(span);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
    input.focus();
  });

  render();
})();
