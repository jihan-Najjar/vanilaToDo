var tasks;
const todoDesc = document.getElementById("todo-desc");
const formElem = document.getElementById("formElem");
const text = document.getElementById("todo-desc");
const taskStatus = document.querySelectorAll('input[name="status"]');
const table = document.getElementById("table-task");
const tbody = document.getElementById("tbody-task");
const numOfTask = document.getElementById("numOfTask");
const emptTask = document.getElementById("empt-task");
const search = document.querySelector('input[type="search"]');
const tSearch = document.getElementById("tbody-search");
const selectFilter = document.getElementById("select-filter");
const filterIcon = document.getElementById("filter-icon");

const showTasks = (id, todo, userId, status, tTable) => {
  const row = tTable.insertRow(0);
  const idCell = row.insertCell();
  const descriptionCell = row.insertCell();
  descriptionCell.colSpan = 3;
  const userIdCell = row.insertCell();
  const statusCell = row.insertCell();
  idCell.textContent = id;
  descriptionCell.textContent = todo;
  userIdCell.textContent = userId;
  statusCell.textContent = status ? "Completed" : "Pending";
  if (tTable === tbody) {
    const action = row.insertCell();
    if (status) {
      statusCell.closest("tr").classList.add("doneTask");
    }
    const icon = document.createElement("I");
    const icon1 = document.createElement("I");
    const icon2 = document.createElement("I");
    const icon3 = document.createElement("I");
    action.classList.add("action");
    icon.classList.add("fa-solid", "fa-circle-check");
    icon1.classList.add("fa-solid", "fa-pen-to-square");
    icon2.classList.add("fa-solid", "fa-trash");
    icon3.classList.add("fa-solid", "fa-circle-check");
    descriptionCell.classList.add("descriptionTask");
    icon3.id = "editTask";
    icon.id = "done";
    icon1.id = "edit";
    icon2.id = "delete";
    action.appendChild(icon);
    action.appendChild(icon1);
    action.appendChild(icon2);
    descriptionCell.appendChild(icon3);
    numOfTask.innerHTML = tasks.length;
  }
};
const indexOfTask = (id, tasks) => {
  const index = tasks.findIndex((task) => task.id === parseInt(id));
  return index;
};
const deleteTask = (index, tasks) => {
  tasks.splice(index, 1);
  // console.log(tasks)
};
const searchUserTask = (userID, tasks) => {
  // console.log(tasks)

  const searchUser = tasks.filter((task) => task.userId === parseInt(userID));
  console.log(searchUser);
  return searchUser;
};
const saveTask = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
document.addEventListener("DOMContentLoaded", () => {
  try {
    const savedTasks = localStorage.getItem("tasks");
    savedTasks !== null ? (tasks = JSON.parse(savedTasks)) : (tasks = null);
    if (savedTasks) {
      // for (const [index, task] of tasks.entries()) {
      //   showTasks(index, tasks, tbody);
      // }
      tasks.forEach((task) =>
        showTasks(task.id, task.todo, task.userId, task.completed, tbody)
      );
    }
  } catch (error) {
    console.log("error")
    console.error();("cann't loading data from local storage ", error.message);
  }

  fetch("https://dummyjson.com/todos")
    .then((response) => response.json())
    .then((data) => {
      const fetchData = data.todos;
      tasks = [...fetchData];
      for (const [index, task] of tasks.entries()) {
      }
    })
    .catch((error) => {
      console.log("Unable to fetch tasks ", error);
    });
  formElem.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = text.value;
    if (newTask.trim() !== "") {
      let selectedValue;
      taskStatus.forEach((radio) => {
        if (radio.checked) {
          selectedValue = radio.value;
        }
      });
      selectedValue == "Completed"
        ? (selectedValue = true)
        : (selectedValue = false);
      const obj = {
        id: tasks.length + 1,
        todo: newTask,
        userId: Math.ceil(Math.random() * 100),
        completed: selectedValue,
      };

      tasks.unshift(obj);
      saveTask();
      showTasks(obj.id, obj.todo, obj.userId, obj.completed, tbody);

      //   }
      // fetch("https://dummyjson.com/todos", {
      //     method: "POST",
      //     headers: { 'Content-Type': 'application/json;charset=utf-8' },
      //     body: JSON.stringify(obj)
      // }).then(respnse => respnse.json()).then(data => console.log("new task add", data))
      //     .catch(error => { console.log("unable to add new task", error) });
      formElem.reset();
    } else {
      emptTask.hidden = !emptTask.hidden;
    }
  });
  document.addEventListener("click", function (e) {
    let target = e.target;
    if (e.target.dataset.toggleId === "formElem") {
      target.textContent === "Add"
        ? (target.textContent = "Close")
        : (target.textContent = "Add");
      formElem.hidden = !formElem.hidden;
    }
    if (target.id == "i-search") {
      tSearch.innerHTML = "";

      const searching = search.value;
      if (searching === "") {
        console.log("null value");
      }
      if (selectFilter.value === "suerID") {
        const newTask = searchUserTask(searching, tasks);
        if (newTask.length < 1) {
          tSearch.innerText = "not found";
          return;
        }
        // for (const [index, task] of newTask.entries()) {
        //   showTasks(index, newTask, tSearch);
        // }
        newTask.forEach((task) =>
          showTasks(task.id, task.todo, task.userId, task.completed, tSearch)
        );
      }
      if (selectFilter.value === "ID") {
        const indexOfTas = indexOfTask(searching, tasks);
        console.log(indexOfTas);
        if (indexOfTas === -1) {
          tSearch.innerTextL = "not found";
          return;
        }
        showTasks(
          tasks[indexOfTas].id,
          tasks[indexOfTas].todo,
          tasks[indexOfTas].userId,
          tasks[indexOfTas].completed,
          tSearch
        );
      }
    }
    if (target.id == "done") {
      const row = target.closest("tr");
      console.log(tasks);
      const donTas = indexOfTask(row.cells[0].textContent, tasks);
      tasks[donTas].completed = !tasks[donTas].completed;

      tasks[donTas].completed
        ? row.classList.add("doneTask")
        : row.classList.remove("doneTask");
      row.cells[3].textContent = tasks[donTas].completed
        ? "Completed"
        : "Pending";
      console.log(tasks[donTas].completed);
    }
    if (target.id == "edit") {
      const row = target.closest("tr");
      row.cells[1].contentEditable = true;
      const editTask = row.cells[1].querySelector("#editTask");
      editTask.style.display = "inline";
      row.cells[1].style.outline = "2px solid lightblue";
      console.log(editTask);
    }
    if (target.id == "editTask") {
      const row = target.closest("tr");
      tasks[indexOfTask(row.cells[0].textContent, tasks)].todo =
        row.cells[1].textContent;
      const cell = target.parentElement;
      cell.contentEditable = false;
      target.style.display = "none";
      console.log(tasks);
    }
    if (target.id == "delete") {
      const row = target.closest("tr");
      const id = row.cells[0].textContent;
      if (confirm("Are you sure you wont to delete this task")) {
        deleteTask(indexOfTask(id, tasks), tasks);
        row.remove();

        // tbody.innerHTML = "";
      }
    }
    // for (const [index, task] of tasks.entries()) {
    //     showTasks(index, tasks, tbody);
    //   }
    saveTask();
  });
});
