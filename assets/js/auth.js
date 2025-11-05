// assets/js/auth.js
// helper for client-side sha256 and API calls

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

async function apiPost(action, data) {
  const payload = { action, ...data };
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors', // Tambahkan ini agar fetch tidak diblokir CORS
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  // Karena mode: 'no-cors' membatasi response, gunakan workaround:
  try {
    const text = await response.text();
    return JSON.parse(text);
  } catch {
    return { success: true, message: 'Permintaan dikirim (mode no-cors)' };
  }
}
