const todoContainer = document.getElementById('todo-container');
const form = document.querySelector('form');
const TODOS_URL = 'http://localhost:3000/api/todos';

function http(url, method, body) {
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: body ?? null,
  }).then(response => response.json())
}

function displayTodos(todos) {
  todoContainer.innerHTML = '';
  for (let todo of todos) {
    const deleteButton = document.createElement('span');
    deleteButton.textContent = 'X';

    const li = document.createElement('li');
    li.textContent = todo.description;
    li.classList = todo.done ? "done" : '';  

    li.appendChild(deleteButton);
    todoContainer.appendChild(li);
    
    registerDoneEvent(li, todo);
    registerDeleteEvent(li, todo);
  }
}

function registerDoneEvent(li, todo) {
  li.addEventListener('click', function() {
    http(`${TODOS_URL}/${todo.id}`, "PATCH", JSON.stringify({
      description: todo.description,
      done: !todo.done
    }))
    .then(() => li.classList.toggle('done'))
  });
}

function registerDeleteEvent(li, todo) {
  const deleteButton = li.querySelector('span');
  deleteButton.addEventListener('click', function(e) {
    e.stopPropagation();

    http(`${TODOS_URL}/${todo.id}`, "DELETE")
      .then(() => li.remove())
  });
}

function getTodos() {
  http(TODOS_URL, 'GET').then(todos => displayTodos(todos));
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const input = form.querySelector('input');
  const description = input.value;
  const newTodo = { description };

  http(TODOS_URL, "POST", JSON.stringify(newTodo))
    .then(() => {
      getTodos();
      input.value = '';
    });
});

getTodos();