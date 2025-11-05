// assets/js/auth.js
const API_URL = "https://script.google.com/macros/s/AKfycbxrWR_zLb5Uw256bgzXZm9oA8Mw3lhyOJRtPq_ZP9z7El6fb-OoDkgrMBvV_E4F0FpI/exec";

async function sha256hex(message){
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
}

function toast(msg){
  const t = document.createElement('div');
  t.className='toast';
  t.innerText = msg;
  document.querySelector('.toast-wrap').appendChild(t);
  setTimeout(()=> t.remove(), 3500);
}

function apiGet(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callback = "cb" + Date.now();
    window[callback] = function (data) {
      resolve(data);
      delete window[callback];
    };

    const query = new URLSearchParams({ ...params, action, callback }).toString();
    const script = document.createElement("script");
    script.src = `${API_URL}?${query}`;
    script.onerror = () => reject("Gagal memuat API");
    document.body.appendChild(script);
  });
}

