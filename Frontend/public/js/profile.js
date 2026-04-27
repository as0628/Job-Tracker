// ===============================
// AUTH GUARD
// ===============================
if (!getToken()) {
  alert("Please login first");
  window.location.href = "index.html";
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

    document.getElementById("career_goal").value = user.career_goal || "";
    document.getElementById("target_title").value = user.target_title || "";
    document.getElementById("target_date").value = user.target_date || "";
    document.getElementById("salary_min").value = user.salary_min || "";
    document.getElementById("salary_max").value = user.salary_max || "";
    document.getElementById("currency").value = user.currency || "";
    document.getElementById("current_status").value = user.current_status || "";

    if (user.resume_path) {
      document.getElementById("resumePreview").innerHTML =
        `Uploaded: <a href="/${user.resume_path}" target="_blank">View Resume</a>`;
    }
  } catch (err) {
    console.error("LOAD PROFILE ERROR:", err);
  }
}

// ===============================
// UPDATE PROFILE
// ===============================
document.getElementById("profileForm").addEventListener("submit", async e => {
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
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    });

    if (!res.ok) throw new Error();

    alert("Profile updated successfully");
    loadProfile();
  } catch (err) {
    alert("Profile update failed");
  }
});

// ===============================
loadProfile();
