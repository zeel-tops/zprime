const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");

let todos = [];
let nextId = 1;

function render() {
  list.innerHTML = "";

  for (const todo of todos) {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${todo.text}`);

    item.append(text, deleteButton);
    list.appendChild(item);
  }

  emptyState.classList.toggle("hidden", todos.length > 0);
}

function addTodo(text) {
  const trimmed = text.trim();
  if (trimmed === "") {
    return false;
  }
  todos.push({ id: nextId++, text: trimmed });
  render();
  return true;
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (addTodo(input.value)) {
    input.value = "";
  }
  input.focus();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  if (!button) {
    return;
  }
  deleteTodo(Number(button.closest(".todo-item").dataset.id));
});

render();
