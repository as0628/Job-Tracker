// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  showToast("error", "Login Required", "Please login first");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

// ===============================
// TOAST UI
// ===============================
function showToast(type, title, message) {
  const oldToast = document.querySelector(".toast-box");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast-box ${type === "success" ? "toast-success" : "toast-error"}`;

  toast.innerHTML = `
    <div class="toast-icon">${type === "success" ? "✅" : "❌"}</div>
    <div class="toast-content">
      <h6>${title}</h6>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===============================
// LOAD PROFILE
// ===============================
async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const user = await res.json();

    career_goal.value = user.career_goal || "";
    target_title.value = user.target_title || "";
    target_date.value = user.target_date || "";
    salary_min.value = user.salary_min || "";
    salary_max.value = user.salary_max || "";
    currency.value = user.currency || "";
    current_status.value = user.current_status || "";

    if (user.resume_path) {
      resumePreview.innerHTML =
        `Uploaded: <a href="/${user.resume_path}" target="_blank">View Resume</a>`;
    }

  } catch (err) {
    showToast("error", "Load Failed", "Could not load profile data");
  }
}

// ===============================
// UPDATE PROFILE
// ===============================
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("career_goal", career_goal.value);
  formData.append("target_title", target_title.value);
  formData.append("target_date", target_date.value);
  formData.append("salary_min", salary_min.value);
  formData.append("salary_max", salary_max.value);
  formData.append("currency", currency.value);
  formData.append("current_status", current_status.value);

  if (resume.files[0]) {
    formData.append("resume", resume.files[0]);
  }

  if (cover_letter.files[0]) {
    formData.append("cover_letter", cover_letter.files[0]);
  }

  try {
    const btn = document.querySelector(".save-btn");
    btn.disabled = true;
    btn.innerText = "Saving...";

    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!res.ok) throw new Error();

    showToast("success", "Profile Saved", "Your profile was updated successfully");
    loadProfile();

  } catch (err) {
    showToast("error", "Update Failed", "Unable to save profile");
  } finally {
    const btn = document.querySelector(".save-btn");
    btn.disabled = false;
    btn.innerText = "Save Profile";
  }
});

// ===============================
loadProfile();