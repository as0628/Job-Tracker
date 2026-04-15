// ===============================
// AUTH GUARD – VERY IMPORTANT
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "index.html";
}

// ===============================
// LOAD APPLICATIONS (DROPDOWN)
// ===============================
async function loadApplications() {
  try {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load applications");
    }

    const apps = await res.json();
    const select = document.getElementById("application_id");

    select.innerHTML = "<option value=''>Select Application</option>";

    apps.forEach(a => {
      select.innerHTML += `
        <option value="${a.id}">
          ${a.Company?.name || "Company"} - ${a.job_title}
        </option>
      `;
    });
  } catch (error) {
    console.error("LOAD APPLICATIONS ERROR:", error);
    alert("Unable to load applications");
  }
}

// ===============================
// CREATE REMINDER
// ===============================
async function createReminder() {
  const application_id = parseInt(
    document.getElementById("application_id").value,
    10
  );

  const reminder_date_raw = document.getElementById("reminder_date").value;
  const reminder_date = new Date(reminder_date_raw);
  const message = document.getElementById("message").value;

  if (!application_id || isNaN(application_id) || !reminder_date_raw) {
    alert("Please select application and reminder date");
    return;
  }

  if (isNaN(reminder_date.getTime())) {
    alert("Invalid reminder date");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        application_id,
        reminder_date,
        message
      })
    });

    if (!res.ok) {
      throw new Error("Failed to create reminder");
    }

    clearForm();
    loadReminders();
  } catch (error) {
    console.error("CREATE REMINDER ERROR:", error);
    alert("Failed to create reminder");
  }
}

// ===============================
// LOAD REMINDERS TABLE
// ===============================
async function loadReminders() {
  try {
    const res = await fetch(`${API_BASE_URL}/reminders`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!res.ok) {
      throw new Error("Failed to load reminders");
    }

    let reminders = await res.json();

    // 🔥 LATEST FIRST
    reminders.sort(
      (a, b) => new Date(b.reminder_date) - new Date(a.reminder_date)
    );

    const table = document.getElementById("reminderTable");
    table.innerHTML = "";

    reminders.forEach(r => {
      const statusBadge = r.is_sent
        ? `<span class="badge bg-success">Sent</span>`
        : `<span class="badge bg-warning text-dark">Pending</span>`;

      const companyName =
        r.JobApplication?.Company?.name || "—";

      table.innerHTML += `
        <tr>
          <td>${companyName}</td>
          <td>${new Date(r.reminder_date).toLocaleString()}</td>
          <td>${r.message || "-"}</td>
          <td>${statusBadge}</td>
          <td>
         <button class="btn btn-sm btn-danger" onclick="deleteReminder(${r.id})"> Delete</button>
         </td>

        </tr>
      `;
    });
  } catch (error) {
    console.error("LOAD REMINDERS ERROR:", error);
    alert("Unable to load reminders");
  }
}

// ===============================
// DELETE REMINDER
// ===============================
async function deleteReminder(id) {
  if (!confirm("Delete this reminder?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/reminders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to delete reminder");
    }

    loadReminders();
  } catch (error) {
    console.error("DELETE REMINDER ERROR:", error);
    alert("Failed to delete reminder");
  }
}

// ===============================
// CLEAR FORM
// ===============================
function clearForm() {
  document.getElementById("application_id").value = "";
  document.getElementById("reminder_date").value = "";
  document.getElementById("message").value = "";
}

// ===============================
// INITIAL LOAD
// ===============================
loadApplications();
loadReminders();
