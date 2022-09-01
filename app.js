let userTaskInput = document.querySelector(".task-input input");
let filters = document.querySelectorAll(".filter-div span");
let todoslist = document.querySelector(".todos-list");
let clearBtn = document.querySelector(".clear-btn");

let editTaskId;
let isEditTask = false;

// datas from local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));

// clear all tasks
clearBtn.addEventListener("click", (_) => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodos("all");
});

// filter tasks
filters.forEach((span) => {
  span.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    showTodos(span.id);
  });
});

// update tasks
function updateTask(id, oldTask) {
  isEditTask = true;
  editTaskId = id;
  userTaskInput.value = oldTask;
}

// delete tasks
function deleteTask(deleteId, status) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodos(status);
}

// update status local storage and ui
function statusUpdate(item) {
  let task = item.parentElement.lastElementChild;
  if (item.checked) {
    task.classList.add("active");
    // update local storage
    todos[item.id].status = "complete";
  } else {
    task.classList.remove("active");
    todos[item.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// to show todos task from local storage
function showTodos(filterStatus) {
  li = "";
  if (todos) {
    todos.forEach((tasks, id) => {
      let completestatus = tasks.status == "complete" ? "active" : "";
      let completeTaskCheck = tasks.status == "complete" ? "checked" : "";
      if (filterStatus == tasks.status || filterStatus == "all") {
        li += ` 
            <li class="todo-items">
              <label for="${id}">
                  <input type="checkbox" id="${id}" onclick="statusUpdate(this)" ${completeTaskCheck}/>
                  <p class="todo-txt ${completestatus}">${tasks.task}</p>
              </label>
              <div>
                <i class="fa-solid fa-pen-to-square edit-ic" onclick="updateTask(${id},'${tasks.task}')"></i>
                <i class="fa-solid fa-trash delete-ic" onclick="deleteTask(${id},'${tasks.status}')"></i>
              </div>
            </li>`;
      }
    });
  }
  todoslist.innerHTML = li || `<p class="no-tasks">No tasks to show here .</p>`;
}
showTodos("all");

// to store local storage
userTaskInput.addEventListener("keyup", (e) => {
  let userInput = userTaskInput.value.trim();
  if (e.key == "Enter" && userInput) {
    // if todos not have create todos with empty array
    if (isEditTask) {
      todos[editTaskId].task = userInput;
      editTaskId;
      isEditTask = false;
    } else {
      if (!todos) {
        todos = [];
      }
      let userTasks = { task: userInput, status: "pending" };
      todos.push(userTasks);
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    userTaskInput.value = "";
    showTodos("all");
  }
});
