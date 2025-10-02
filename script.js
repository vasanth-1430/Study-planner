const form = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const subjectInput = document.getElementById("subject");
const deadlineInput = document.getElementById("deadline");
const descInput = document.getElementById("description");
const listView = document.getElementById("listView");
const timelineView = document.getElementById("timelineView");
const listBtn = document.getElementById("listViewBtn");
const timelineBtn = document.getElementById("timelineViewBtn");
const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const progressBar = document.getElementById("progressBar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  // update stats
  totalTasksEl.textContent = tasks.length;
  completedTasksEl.textContent = tasks.filter(t => t.completed).length;
  const percent = tasks.length ? (tasks.filter(t=>t.completed).length / tasks.length) * 100 : 0;
  progressBar.style.width = percent + "%";

  // list view
  listView.innerHTML = "";
  tasks.forEach((t,i)=>{
    const div = document.createElement("div");
    div.className = "task" + (t.completed ? " completed" : "");
    div.innerHTML = `
      <div class="body">
        <h3>${t.title}</h3>
        <p class="meta">Subject: ${t.subject} | Due: ${t.deadline}</p>
        <p>${t.description}</p>
      </div>
      <div class="actions">
        <button onclick="toggleComplete(${i})">✔</button>
        <button onclick="deleteTask(${i})">🗑</button>
      </div>
    `;
    listView.appendChild(div);
  });

  // timeline view
  timelineView.innerHTML = "";
  const grouped = {};
  tasks.forEach(t=>{
    if(!grouped[t.deadline]) grouped[t.deadline] = [];
    grouped[t.deadline].push(t);
  });
  for(const date in grouped){
    const dayDiv = document.createElement("div");
    dayDiv.className="day";
    dayDiv.innerHTML=`<h4>${date}</h4>`;
    grouped[date].forEach(t=>{
      const p=document.createElement("p");
      p.textContent="• " + t.title;
      dayDiv.appendChild(p);
    });
    timelineView.appendChild(dayDiv);
  }
}

form.addEventListener("submit", e=>{
  e.preventDefault();
  const task = {
    title: titleInput.value,
    subject: subjectInput.value,
    deadline: deadlineInput.value,
    description: descInput.value,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  form.reset();
});

function toggleComplete(i){
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
  renderTasks();
}
function deleteTask(i){
  if(confirm("Delete this task?")){
    tasks.splice(i,1);
    saveTasks();
    renderTasks();
  }
}

// view switching
listBtn.addEventListener("click",()=>{
  listView.classList.remove("hidden");
  timelineView.classList.add("hidden");
  listBtn.classList.add("active");
  timelineBtn.classList.remove("active");
});
timelineBtn.addEventListener("click",()=>{
  timelineView.classList.remove("hidden");
  listView.classList.add("hidden");
  timelineBtn.classList.add("active");
  listBtn.classList.remove("active");
});

// init
renderTasks();
