const API_BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
