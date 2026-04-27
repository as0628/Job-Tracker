// ===============================
// CONFIG + AUTH
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "index.html";
}

// ===============================
// GLOBAL STATE
// ===============================
let allJobs = [];
let selectedIds = [];
let currentGroupBy = "none"; // none | status
let currentView = "active"; // active | archived

// ===============================
// DASHBOARD STATS
// ===============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    document.getElementById("stats").innerHTML = `
      <div class="col">Total: ${data.total}</div>
      <div class="col">Interested: ${data.interested}</div>
      <div class="col">Applied: ${data.applied}</div>
      <div class="col">Interview: ${data.interview}</div>
      <div class="col">Offer: ${data.offer}</div>
      <div class="col">Rejected: ${data.rejected}</div>
    `;
  } catch {
    document.getElementById("stats").innerText = "Failed to load dashboard data";
  }
}

// ===============================
// LOAD JOBS
// ===============================
async function loadJobs() {
  const url =
    currentView === "archived"
      ? `${API_BASE_URL}/applications/archived`
      : `${API_BASE_URL}/applications`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  allJobs = await res.json();
  render();
}

// ===============================
// VIEW SWITCHERS
// ===============================
function showArchived() {
  currentView = "archived";
  currentGroupBy = "none";
  loadJobs();
}

function showActive() {
  currentView = "active";
  loadJobs();
}

// ===============================
// MAIN RENDER
// ===============================
function render() {
  selectedIds = [];
  updateSelectedCount();

  if (currentGroupBy === "status" && currentView === "active") {
    renderGroupedByStatus(allJobs);
  } else {
    renderJobs(allJobs);
  }
}

// ===============================
// GROUP BY
// ===============================
function groupBy(type) {
  currentGroupBy = type;
  render();
}

// ===============================
// TABLE RENDER
// ===============================
function renderJobs(jobs) {
  const tbody = document.getElementById("jobTable");
  tbody.innerHTML = "";

  if (!jobs.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="text-center">
          ${currentView === "archived" ? "No archived jobs" : "No jobs found"}
        </td>
      </tr>`;
    return;
  }

  jobs.forEach(j => {
    tbody.innerHTML += `
      <tr>
        <td>
          ${
            currentView === "active"
              ? `<input type="checkbox" class="rowCheckbox"
                   value="${j.id}" onchange="updateSelection(this)" />`
              : "-"
          }
        </td>
        <td>${j.job_title}</td>
        <td>${j.Company?.name || "-"}</td>
        <td>${j.offered_salary ? `${j.currency} ${j.offered_salary}` : "-"}</td>
        <td>${j.expected_salary ? `${j.currency} ${j.expected_salary}` : "-"}</td>
        <td>${j.Company?.city || "-"}</td>
        <td><span class="badge bg-secondary">${j.status}</span></td>
        <td>${j.application_date}</td>
        
        <td>
          ${
            currentView === "archived"
              ? `<button class="btn btn-sm btn-success"
                   onclick="unarchiveJob(${j.id})">Unarchive</button>`
              : j.resume_path
                ? `<a href="${j.resume_path}" target="_blank">View</a>`
                : "-"
          }
        </td>
      </tr>
    `;
  });
}

// ===============================
// GROUP BY STATUS (ACTIVE ONLY)
// ===============================
function renderGroupedByStatus(jobs) {
  const tbody = document.getElementById("jobTable");
  tbody.innerHTML = "";

  const grouped = {};
  jobs.forEach(j => {
    grouped[j.status] = grouped[j.status] || [];
    grouped[j.status].push(j);
  });

  Object.keys(grouped).forEach(status => {
    tbody.innerHTML += `
      <tr class="table-secondary fw-bold">
        <td colspan="10">${capitalize(status)} (${grouped[status].length})</td>
      </tr>
    `;

    grouped[status].forEach(j => {
      tbody.innerHTML += `
        <tr>
          <td>
            <input type="checkbox" class="rowCheckbox"
              value="${j.id}" onchange="updateSelection(this)" />
          </td>
          <td>${j.job_title}</td>
          <td>${j.Company?.name || "-"}</td>
          <td>${j.offered_salary || "-"}</td>
          <td>${j.expected_salary || "-"}</td>
          <td>${j.Company?.city || "-"}</td>
          <td>${j.status}</td>
          <td>${j.application_date}</td>
           <td>
            ${j.resume_path ? `<a href="${j.resume_path}" target="_blank">View</a>` : "-"}
          </td>
        </tr>
      `;
    });
  });
}

// ===============================
// UNARCHIVE
// ===============================
async function unarchiveJob(id) {
  if (!confirm("Unarchive this job?")) return;

  await fetch(`${API_BASE_URL}/applications/${id}/unarchive`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  showActive();
}

// ===============================
// SELECTION
// ===============================
function updateSelection(cb) {
  const id = Number(cb.value);
  cb.checked
    ? selectedIds.push(id)
    : selectedIds = selectedIds.filter(x => x !== id);

  updateSelectedCount();
}

function toggleSelectAll(master) {
  selectedIds = [];
  document.querySelectorAll(".rowCheckbox").forEach(cb => {
    cb.checked = master.checked;
    if (master.checked) selectedIds.push(Number(cb.value));
  });
  updateSelectedCount();
}

function updateSelectedCount() {
  document.getElementById("selectedCount").innerText =
    `${selectedIds.length} selected`;
}

// ===============================
// BULK ACTIONS (ACTIVE ONLY)
// ===============================
async function bulkUpdateStatus(status) {
  if (!selectedIds.length) return alert("Select jobs first");

  await fetch(`${API_BASE_URL}/applications/bulk/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ ids: selectedIds, status })
  });

  loadJobs();
}

async function bulkArchive() {
  if (!selectedIds.length) return alert("Select jobs first");

  await fetch(`${API_BASE_URL}/applications/bulk/archive`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ ids: selectedIds })
  });

  loadJobs();
}

async function bulkDelete() {
  if (!selectedIds.length) return alert("Select jobs first");
  if (!confirm("Delete selected jobs permanently?")) return;

  await fetch(`${API_BASE_URL}/applications/bulk/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ ids: selectedIds })
  });

  loadJobs();
}

// ===============================
// HELPERS
// ===============================
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ===============================
// INIT
// ===============================
loadJobs();
loadDashboard();
