// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "/html/index.html";
}

// ===============================
// GLOBALS
// ===============================
let statusChart = null;
let currentDate = new Date();
let reminderDates = {};

// ===============================
// GOAL CHART
// ===============================
function renderStatusChart(data) {
  const canvas = document.getElementById("statusChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (statusChart) {
    statusChart.destroy();
  }

  const applied = Number(data.applied) || 0;
  const goal = Number(data.weekly_goal) || 5;

  const progress = Math.min(applied, goal);
  const remaining = Math.max(goal - progress, 0);

  const appliedText = document.getElementById("goalAppliedText");
  const goalPill = document.getElementById("goalPill");
  const goalMessage = document.getElementById("goalMessage");

  if (appliedText) appliedText.innerText = applied;
  if (goalPill) goalPill.innerText = `Goal: ${goal}`;

  if (goalMessage) {
    goalMessage.innerText =
      remaining === 0
        ? "You achieved your weekly goal! 🎉"
        : `${remaining} applications remaining to meet your weekly goal 🚀`;
  }

  statusChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [progress, remaining],
          backgroundColor: ["#7e3ea1", "#e6d8ef"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "78%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

// ===============================
// WEEKLY GOAL LOAD
// ===============================
async function loadWeeklyGoal() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/weekly-goal`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed to load weekly goal");

    const data = await res.json();

    const input = document.getElementById("goalInput");
    if (input) {
      input.value = data.weekly_goal;
    }

    renderStatusChart(data);

  } catch (err) {
    console.error("WEEKLY GOAL ERROR:", err);
  }
}

// ===============================
// GOAL MODAL
// ===============================
function openGoalModal() {
  const modal = document.getElementById("goalModal");
  if (modal) modal.style.display = "flex";
}

function closeGoalModal() {
  const modal = document.getElementById("goalModal");
  if (modal) modal.style.display = "none";
}

function changeGoalValue(step) {
  const input = document.getElementById("goalInput");
  if (!input) return;

  let val = parseInt(input.value) || 1;

  val += step;

  if (val < 1) val = 1;
  if (val > 12) val = 12;

  input.value = val;
}

async function saveGoal() {
  try {
    const input = document.getElementById("goalInput");
    const goal = parseInt(input.value);

    const res = await fetch(`${API_BASE_URL}/dashboard/weekly-goal`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        weekly_goal: goal
      })
    });

    if (!res.ok) throw new Error("Failed to save goal");

    closeGoalModal();
    loadWeeklyGoal();

  } catch (err) {
    console.error("SAVE GOAL ERROR:", err);
  }
}

// ===============================
// DASHBOARD SUMMARY + PIPELINE
// ===============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed to load dashboard");

    const data = await res.json();

    const stats = document.getElementById("stats");

    if (stats) {
      stats.innerHTML = `
        <div class="col">Total: ${data.total}</div>
        <div class="col">Interested: ${data.interested}</div>
        <div class="col">Applied: ${data.applied}</div>
        <div class="col">Interview: ${data.interview}</div>
        <div class="col">Offer: ${data.offer}</div>
        <div class="col">Rejected: ${data.rejected}</div>
      `;
    }

    const total = data.total || 1;

    setText("interestedCount", data.interested);
    setText("appliedCount", data.applied);
    setText("interviewCount", data.interview);
    setText("offerCount", data.offer);
    setText("rejectedCount", data.rejected);

    setWidth("interestedBar", (data.interested / total) * 100);
    setWidth("appliedBar", (data.applied / total) * 100);
    setWidth("interviewBar", (data.interview / total) * 100);
    setWidth("offerBar", (data.offer / total) * 100);
    setWidth("rejectedBar", (data.rejected / total) * 100);

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
  }
}

// ===============================
// HELPERS
// ===============================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function setWidth(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${value}%`;
}

// ===============================
// PROFILE ALERT
// ===============================
async function checkProfileStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) return;

    const user = await res.json();

    if (!user.career_goal || !user.target_title || !user.resume_path) {
      const alertBox = document.getElementById("profileAlert");
      if (alertBox) alertBox.classList.remove("d-none");
    }

  } catch (err) {
    console.error("PROFILE ERROR:", err);
  }
}

// ===============================
// CAREER GOAL CARD
// ===============================
async function loadCareerGoal() {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed");

    const user = await res.json();

    setText("careerGoalText", user.career_goal || "Not set");
    setText("targetTitle", user.target_title || "-");

    const dateEl = document.getElementById("targetDate");
    if (dateEl) {
      dateEl.textContent = user.target_date
        ? new Date(user.target_date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          })
        : "-";
    }

    const salaryEl = document.getElementById("targetSalary");

    if (salaryEl) {
      salaryEl.textContent =
        user.salary_min && user.salary_max
          ? `${user.currency || ""} ${user.salary_min} - ${user.salary_max}`
          : "-";
    }

  } catch (err) {
    console.error("CAREER GOAL ERROR:", err);
  }
}

// ===============================
// CALENDAR
// ===============================
function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const daysContainer = document.getElementById("calendarDays");

  if (!monthYear || !daysContainer) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  monthYear.innerText = `${monthNames[month]} ${year}`;
  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    daysContainer.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= totalDays; day++) {
    const box = document.createElement("div");
    box.innerText = day;

    const key = `${year}-${month}-${day}`;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      box.classList.add("today");
    }

    if (reminderDates[key]) {
      box.classList.add("has-reminder");
    }

    box.onclick = () => {
      if (reminderDates[key]) {
        const msg = reminderDates[key]
          .map(r => `📌 ${r.company}: ${r.message}`)
          .join("\n");

        alert(msg);
      }
    };

    daysContainer.appendChild(box);
  }
}

function changeMonth(step) {
  currentDate.setMonth(currentDate.getMonth() + step);
  renderCalendar();
}

// ===============================
// LOAD REMINDERS
// ===============================
async function loadCalendarReminders() {
  try {
    const res = await fetch(`${API_BASE_URL}/reminders`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed reminders");

    const reminders = await res.json();

    reminderDates = {};

    reminders.forEach(r => {
      const d = new Date(r.reminder_date);

      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

      if (!reminderDates[key]) {
        reminderDates[key] = [];
      }

      reminderDates[key].push({
        company: r.JobApplication?.Company?.name || "Company",
        message: r.message || "Reminder"
      });
    });

    renderCalendar();

  } catch (err) {
    console.error("REMINDER ERROR:", err);
  }
}

// ===============================
// INITIAL LOAD
// ===============================
checkProfileStatus();
loadCareerGoal();
loadDashboard();
loadWeeklyGoal();
loadCalendarReminders();

// ===============================
// GLOBAL FUNCTIONS
// ===============================
window.changeMonth = changeMonth;
window.openGoalModal = openGoalModal;
window.closeGoalModal = closeGoalModal;
window.changeGoalValue = changeGoalValue;
window.saveGoal = saveGoal;