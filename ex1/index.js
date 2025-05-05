// Variables
const inputFields = document.querySelectorAll('.input-group input');
const addTask = document.getElementById('all-button');
const activeAddTask = document.getElementById('active-button');

//Tabs
const tabAll = document.getElementById('all-tab');
const tabActive = document.getElementById('active-tab');
const tabCompleted = document.getElementById('completed-tab');

//Inputs
const taskInputAll = document.getElementById('taskInputAll');
const taskInputActive = document.getElementById('taskActiveInput');

//Local Storage
let tasks = JSON.parse(localStorage.getItem("taskList")) || [];

//Lists
const allTasksDiv = document.getElementById('allTasksDiv');
const allTasksDivActive = document.getElementById('allTasksDivActive');  
const allTasksDivCompleted = document.getElementById('allTasksDivCompleted');

//Buttons Delete
const deleteAllButton = document.getElementById('delete-all-btn');



// Functions
function saveTaskListToLocalStorage(taskList) {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}


function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.dataset.id = task.id;
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => setCompleted(task.id));

    const label = document.createElement('label');
    label.textContent = task.text;
    label.className = 'ms-2' + (task.completed ? ' completed checkbox-label' : '');
  
    div.appendChild(checkbox);
    div.appendChild(label);
  
    if (task.completed) {
      const del = document.createElement('div');
      del.textContent = '🗑';
      del.style.cursor = 'pointer';
      del.addEventListener('click', () => deleteTask(task.id));
      div.appendChild(del);
    }
  
    return div;
}

function addTaskToAll() {
    const text = taskInputAll.value.trim();
    if (!text) return;
  
    const task = {
      id: Date.now(),
      text,
      completed: false
    };
  
    tasks.push(task);
    const taskEl = createTaskElement(task);
    allTasksDiv.appendChild(taskEl);
    taskInputAll.value = '';
    saveTaskListToLocalStorage(tasks);
}

function addFromActiveToAll() {
  const text = taskInputActive.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(task);
  const taskEl = createTaskElement(task);
  allTasksDiv.appendChild(taskEl);
  taskInputActive.value = '';
  saveTaskListToLocalStorage(tasks);
  renderActiveList();
  renderCompleteList();
}

function renderAllList(){
  allTasksDiv.innerHTML = ''; 
  tasks.forEach(task => {
          const el = createTaskElement(task);
          allTasksDiv.appendChild(el);
       });
}

function renderActiveList() {
  allTasksDivActive.innerHTML = ''; 
  tasks.filter(task => !task.completed)
        .forEach(task => {
          const el = createTaskElement(task);
          allTasksDivActive.appendChild(el);
       });
}

function renderCompleteList() {
  allTasksDivCompleted.innerHTML = '';
  tasks.filter(task => task.completed)
      .forEach(task => {
        const el = createTaskElement(task);
        allTasksDivCompleted.appendChild(el);
    });
}

function setCompleted(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTaskListToLocalStorage(tasks);
    renderAllList();
    renderActiveList();
    renderCompleteList();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTaskListToLocalStorage(tasks);
  renderAllList();
  renderActiveList();
  renderCompleteList();
}

function deleteAllTasks() {
  if (confirm("Bạn có chắc chắn muốn xoá tất cả các task đã hoàn thành không?")) {
    tasks = tasks.filter(task => !task.completed); 
    saveTaskListToLocalStorage(tasks);
    renderAllList();
    renderActiveList();
    renderCompleteList();
  }
}

//Render
renderAllList();
renderActiveList();
renderCompleteList();

//Events 
tabAll.addEventListener('click', renderAllList);
tabActive.addEventListener('click', renderActiveList);
tabCompleted.addEventListener('click', renderCompleteList);
addTask.addEventListener('click', addTaskToAll);
activeAddTask.addEventListener('click', addFromActiveToAll);
deleteAllButton.addEventListener('click', deleteAllTasks);

  
