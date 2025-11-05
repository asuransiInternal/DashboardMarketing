const API_URL = "https://script.google.com/macros/s/AKfycbxrWR_zLb5Uw256bgzXZm9oA8Mw3lhyOJRtPq_ZP9z7El6fb-OoDkgrMBvV_E4F0FpI/exec";

async function apiPost(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function doLogin() {
  const btn = document.getElementById("btnLogin");
  btn.innerText = "Proses...";
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiPost({ action: "login", email, password });
  alert(res.message);

  btn.innerText = "Login";
  if (res.success) {
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location.href = "dashboard.html";
  }
}

async function doSignup() {
  const btn = document.getElementById("btnSignup");
  btn.innerText = "Proses...";
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiPost({ action: "signup", name, email, password });
  document.getElementById("signupMsg").innerText = res.message;
  btn.innerText = "Daftar";
}

async function doReset() {
  const email = document.getElementById("email").value;
  const res = await apiPost({ action: "reset", email });
  document.getElementById("resetMsg").innerText = res.message;
}

function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}
