// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "index.html";
}

let allCompanies = [];
let editingCompanyId = null;

// ===============================
// LOAD COMPANIES
// ===============================
async function loadCompanies() {
  const res = await fetch(`${API_BASE_URL}/companies`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  allCompanies = await res.json();
  renderCompanies(allCompanies);
}

// ===============================
// RENDER TABLE
// ===============================
function renderCompanies(companies) {
  const table = document.getElementById("companyTable");
  table.innerHTML = "";

  companies.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.industry || "-"}</td>
        <td>${c.city || "-"}</td>
        <td>${c.state || "-"}</td>
        <td>
          <button class="btn btn-sm btn-warning"
            onclick="openEditForm(${c.id})">
            Edit
          </button>
          <button class="btn btn-sm btn-danger"
            onclick="deleteCompany(${c.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// ===============================
// ADD COMPANY
// ===============================
async function addCompany() {
  const body = {
    name: document.getElementById("name").value,
    industry: document.getElementById("industry").value,
    size: document.getElementById("size").value,
    contact_email: document.getElementById("contact_email").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    notes: document.getElementById("notes").value
  };

  await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });

  clearAddForm();
  loadCompanies();
}

// ===============================
// OPEN EDIT FORM
// ===============================
function openEditForm(id) {
  const company = allCompanies.find(c => c.id === id);
  if (!company) return;

  editingCompanyId = id;

  document.getElementById("editCompanyCard").classList.remove("d-none");

  document.getElementById("editName").value = company.name;
  document.getElementById("editIndustry").value = company.industry || "";
  document.getElementById("editSize").value = company.size || "";
  document.getElementById("editContactEmail").value = company.contact_email || "";
  document.getElementById("editCity").value = company.city || "";
  document.getElementById("editState").value = company.state || "";
  document.getElementById("editNotes").value = company.notes || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===============================
// UPDATE COMPANY (NO NAME CHANGE)
// ===============================
async function updateCompany() {
  if (!editingCompanyId) return;

  const body = {
    industry: document.getElementById("editIndustry").value,
    size: document.getElementById("editSize").value,
    contact_email: document.getElementById("editContactEmail").value,
    city: document.getElementById("editCity").value,
    state: document.getElementById("editState").value,
    notes: document.getElementById("editNotes").value
  };

  await fetch(`${API_BASE_URL}/companies/${editingCompanyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(body)
  });

  cancelEdit();
  loadCompanies();
}

// ===============================
// CANCEL EDIT
// ===============================
function cancelEdit() {
  editingCompanyId = null;
  document.getElementById("editCompanyCard").classList.add("d-none");
}

// ===============================
// DELETE COMPANY
// ===============================
async function deleteCompany(id) {
  if (!confirm("Delete this company?")) return;

  await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  loadCompanies();
}

// ===============================
// SEARCH (FRONTEND ONLY)
// ===============================
function searchCompanies() {
  const name = document.getElementById("searchName").value.toLowerCase();
  const city = document.getElementById("searchCity").value.toLowerCase();
  const state = document.getElementById("searchState").value.toLowerCase();

  const filtered = allCompanies.filter(c =>
    (!name || c.name.toLowerCase().includes(name)) &&
    (!city || (c.city || "").toLowerCase().includes(city)) &&
    (!state || (c.state || "").toLowerCase().includes(state))
  );

  renderCompanies(filtered);
}

// ===============================
// CLEAR ADD FORM
// ===============================
function clearAddForm() {
  document.getElementById("name").value = "";
  document.getElementById("industry").value = "";
  document.getElementById("size").value = "";
  document.getElementById("contact_email").value = "";
  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
  document.getElementById("notes").value = "";
}

// ===============================
// INITIAL LOAD
// ===============================

loadCompanies();
