// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "index.html";
}

// ===============================
// STATUS CHART (DOUGHNUT)
// ===============================
let statusChart = null;

function renderStatusChart(data) {
  const canvas = document.getElementById("statusChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (statusChart) {
    statusChart.destroy();
  }

  statusChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Interested","Applied", "Interview", "Offer", "Rejected"],
      datasets: [
        {
          data: [
            data.interested,
            data.applied,
            data.interview,
            data.offer,
            data.rejected
          ],
          backgroundColor: [
            "#808080",
            "#0d6efd",
            "#ffc107",
            "#198754",
            "#dc3545"
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// ===============================
// LOAD DASHBOARD STATS + PIPELINE
// ===============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) throw new Error("Failed to load dashboard");

    const data = await res.json();

    // ===== BASIC STATS =====
    document.getElementById("stats").innerHTML = `
      <div class="col">Total: ${data.total}</div>
      <div class="col">Interested: ${data.interested}</div>
      <div class="col">Applied: ${data.applied}</div>
      <div class="col">Interview: ${data.interview}</div>
      <div class="col">Offer: ${data.offer}</div>
      <div class="col">Rejected: ${data.rejected}</div>
    `;

    // ===== PIPELINE =====
    const total = data.total || 1;
      
    document.getElementById("interestedCount").innerText = data.interested;
    document.getElementById("appliedCount").innerText = data.applied;
    document.getElementById("interviewCount").innerText = data.interview;
    document.getElementById("offerCount").innerText = data.offer;
    document.getElementById("rejectedCount").innerText = data.rejected;

    document.getElementById("interestedBar").style.width =
      `${(data.interested / total) * 100}%`;

    document.getElementById("appliedBar").style.width =
      `${(data.applied / total) * 100}%`;

    document.getElementById("interviewBar").style.width =
      `${(data.interview / total) * 100}%`;

    document.getElementById("offerBar").style.width =
      `${(data.offer / total) * 100}%`;

    document.getElementById("rejectedBar").style.width =
      `${(data.rejected / total) * 100}%`;

    // ===== CHART =====
    renderStatusChart(data);
  } catch (err) {
    console.error("DASHBOARD LOAD ERROR:", err);
  }
}

// ===============================
// PROFILE COMPLETION CHECK
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
      document
        .getElementById("profileAlert")
        .classList.remove("d-none");
    }
  } catch (err) {
    console.error("PROFILE CHECK ERROR:", err);
  }
}

// ===============================
// LOAD CAREER GOAL CARD
// ===============================
async function loadCareerGoal() {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const user = await res.json();

    document.getElementById("careerGoalText").textContent =
      user.career_goal || "Not set";

    document.getElementById("targetTitle").textContent =
      user.target_title || "-";

    document.getElementById("targetDate").textContent =
      user.target_date
        ? new Date(user.target_date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
          })
        : "-";

    if (user.salary_min && user.salary_max) {
      document.getElementById("targetSalary").textContent =
        `${user.currency || ""} ${user.salary_min} - ${user.salary_max}`;
    } else {
      document.getElementById("targetSalary").textContent = "-";
    }
  } catch (err) {
    console.error("LOAD CAREER GOAL ERROR:", err);
  }
}

async function loadWeeklyGoal() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/weekly-goal`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Failed to load weekly goal");

    const data = await res.json();

    document.getElementById("weeklyApplied").innerText = data.applied;
    document.getElementById("weeklyGoal").innerText = data.weekly_goal;

    const percent = Math.min(
      (data.applied / data.weekly_goal) * 100,
      100
    );

    document.getElementById("weeklyProgressBar").style.width =
      `${percent}%`;
  } catch (err) {
    console.error("WEEKLY GOAL LOAD ERROR:", err);
  }
}

3
// ===============================
// INITIAL LOAD
// ===============================
loadDashboard();
checkProfileStatus();
loadCareerGoal();
loadWeeklyGoal()
