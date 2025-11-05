const API_URL = "https://script.google.com/macros/s/AKfycbxrWR_zLb5Uw256bgzXZm9oA8Mw3lhyOJRtPq_ZP9z7El6fb-OoDkgrMBvV_E4F0FpI/exec"; // ganti dengan URL deploy kamu

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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  btn.disabled = true;
  btn.innerText = "Proses...";
  const res = await apiPost({ action: "login", email, password });
  alert(res.message);
  btn.disabled = false;
  btn.innerText = "Login";

  if (res.success) {
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location.href = "dashboard.html";
  }
}
