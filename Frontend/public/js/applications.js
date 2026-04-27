// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "/html/index.html";
}

// ===============================
// LOAD COMPANIES FOR DROPDOWN
// ===============================
async function loadCompaniesForDropdown() {
  const res = await fetch(`${API_BASE_URL}/companies`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const companies = await res.json();
  const select = document.getElementById("company_id");

  select.innerHTML = "<option value=''>Select Company</option>";

  companies.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
  });
}

// ===============================
// LOAD APPLICATIONS
// ===============================
async function loadApplications() {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const apps = await res.json();
  renderTable(apps);
}

// ===============================
// RENDER TABLE
// ===============================
function renderTable(apps) {
  const table = document.getElementById("applicationTable");
  table.innerHTML = "";

  if (apps.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="text-center">No applications found</td>
      </tr>
    `;
    return;
  }

  apps.forEach(a => {
    table.innerHTML += `
      <tr>
        <td>${a.Company?.name || "-"}</td>
        <td>${a.job_title}</td>
        <td>${a.status}</td>
        <td>${a.application_date}</td>
        <td>
          <button class="btn btn-sm btn-warning"
            onclick='openUpdateForm(${JSON.stringify(a)})'>
            Update
          </button>
          <button class="btn btn-sm btn-danger"
            onclick="deleteApplication(${a.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// ===============================
// ADD APPLICATION (WITH RESUME)
// ===============================
async function addApplication() {
  const formData = new FormData();

  formData.append("company_id", document.getElementById("company_id").value);
  formData.append("job_title", document.getElementById("job_title").value);
  formData.append("application_date", document.getElementById("application_date").value);
  formData.append("status", document.getElementById("status").value);
  formData.append("expected_salary", document.getElementById("expected_salary").value);
  formData.append("offered_salary", document.getElementById("offered_salary").value);
  formData.append("notes", document.getElementById("notes").value);
  formData.append("currency", "INR");

  const resume = document.getElementById("resume").files[0];
  if (resume) {
    formData.append("resume", resume);
  }

  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  if (!res.ok) {
    alert("Failed to add application");
    return;
  }

  clearAddForm();
  loadApplications();
}

// ===============================
// OPEN UPDATE FORM
// ===============================
function openUpdateForm(app) {
  document.getElementById("updateCard").classList.remove("d-none");

  document.getElementById("update_id").value = app.id;
  document.getElementById("update_company").value = app.Company?.name || "";
  document.getElementById("update_job_title").value = app.job_title;
  document.getElementById("update_application_date").value = app.application_date;
  document.getElementById("update_status").value = app.status;
  document.getElementById("update_expected_salary").value = app.expected_salary || "";
  document.getElementById("update_offered_salary").value = app.offered_salary || "";
  document.getElementById("update_notes").value = app.notes || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===============================
// CLOSE UPDATE FORM
// ===============================
function closeUpdateForm() {
  document.getElementById("updateCard").classList.add("d-none");
}

// ===============================
// UPDATE APPLICATION (NO COMPANY CHANGE)
// ===============================
async function updateApplication() {
  const id = document.getElementById("update_id").value;

  const body = {
    job_title: document.getElementById("update_job_title").value,
    application_date: document.getElementById("update_application_date").value,
    status: document.getElementById("update_status").value,
    expected_salary: document.getElementById("update_expected_salary").value,
    offered_salary: document.getElementById("update_offered_salary").value,
    notes: document.getElementById("update_notes").value
  };

  const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    alert("Update failed");
    return;
  }

  closeUpdateForm();
  loadApplications();
}

// ===============================
// DELETE APPLICATION
// ===============================
async function deleteApplication(id) {
  if (!confirm("Delete this application?")) return;

  await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  loadApplications();
}

// ===============================
// SEARCH APPLICATIONS
// ===============================
async function searchApplications() {
  const q = document.getElementById("searchKeyword").value.trim();
  if (!q) return;

  const res = await fetch(
    `${API_BASE_URL}/applications/search?q=${encodeURIComponent(q)}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` }
    }
  );

  const apps = await res.json();
  renderTable(apps);
}

// ===============================
// CLEAR ADD FORM
// ===============================
function clearAddForm() {
  document.querySelectorAll(
    "#company_id, #job_title, #application_date, #status, #expected_salary, #offered_salary, #notes, #resume"
  ).forEach(el => (el.value = ""));
}

// ===============================
// INITIAL LOAD
// ===============================
loadCompaniesForDropdown();
loadApplications();
