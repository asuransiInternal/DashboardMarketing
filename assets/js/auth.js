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

async function apiPost(action, bodyObj){
  const payload = Object.assign({}, bodyObj, { action: action });
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}
