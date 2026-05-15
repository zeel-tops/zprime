(function () {
  "use strict";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");

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
