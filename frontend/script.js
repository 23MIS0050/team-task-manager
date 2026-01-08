const API_URL = "http://localhost:5000/tasks";

// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

// Load tasks from MongoDB
async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
}

// Render tasks
function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}

// Create task element
function createTaskElement(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";
    taskContent.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task._id));

    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

// Add task to MongoDB
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    taskInput.value = "";
    loadTasks();
}

// Delete task from MongoDB
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Initial load
loadTasks();
