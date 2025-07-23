const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const tableBody = document.getElementById("myTableBody");

// Load tasks on page load
window.onload = () => fetchTasks();

// GET tasks
function fetchTasks() {
  fetch("https://first-database-web-app.vercel.app/tasks")
    .then(res => res.json())
    .then(tasks => {
      tableBody.innerHTML = ""; // clear before rendering

      tasks.forEach(task => {
        const row = document.createElement("tr");

        const taskCell = document.createElement("td");
        taskCell.textContent = task.description;

        // Style if completed
        if (task.completed) {
          taskCell.style.textDecoration = "line-through";
          taskCell.style.color = "gray";
        }

        // ✅ Complete Button
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "✔️";
        completeBtn.className = "btn btn-success btn-sm me-2";
        completeBtn.onclick = () => {
          fetch(`https://first-database-web-app.vercel.app/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              description: task.description,
              completed: !task.completed // toggle
            })
          }).then(() => fetchTasks());
        };

        // ❌ Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "btn btn-danger btn-sm";
        deleteBtn.onclick = () => {
          fetch(`https://first-database-web-app.vercel.app/tasks/${task.id}`, {
            method: "DELETE"
          }).then(() => fetchTasks());
        };

        const buttonCell = document.createElement("td");
        buttonCell.appendChild(completeBtn);
        buttonCell.appendChild(deleteBtn);

        row.appendChild(taskCell);
        row.appendChild(buttonCell);
        tableBody.appendChild(row);
      });
    });
}


// POST task
addTaskBtn.onclick = () => {
  const desc = taskInput.value.trim();
  if (!desc) return;

  fetch("https://first-database-web-app.vercel.app/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: desc, completed: false })
  })
    .then(res => res.json())
    .then(() => {
      taskInput.value = "";
      fetchTasks(); // refresh the list
    });
};


