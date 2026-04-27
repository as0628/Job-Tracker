const API_BASE_URL = "https://job-tracker-2-ut8u.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/html/index.html";
}

// const API_BASE_URL = "http://localhost:3000/api";

// function getToken() {
//   return localStorage.getItem("token");
// }

// function logout() {
//   localStorage.removeItem("token");
//   window.location.href = "index.html";
// }
