// assets/js/dashboard.js

async function checkSessionAndRender(){
  const token = sessionStorage.getItem('dm_token');
  if(!token) {
    window.location.href = 'index.html';
    return;
  }

  const verify = await apiPost('verifySession', { token: token });
  if(!verify || verify.status !== 'ok') {
    sessionStorage.removeItem('dm_token');
    window.location.href = 'index.html';
    return;
  }
  const session = verify.session;
  // render greeting
  document.getElementById('greetingText').innerText = 'Selamat datang, ' + (session.nama || session.email) + ' (User Active)';
  // get menu for role
  const menuRes = await apiPost('getMenu', { token: token });
  if(menuRes && menuRes.status === 'ok'){
    const ul = document.getElementById('menuList');
    if(menuRes.menu.length === 0){
      ul.innerHTML = '<div class="small" style="color:#777">Tidak ada menu tersedia untuk role ini.</div>';
    } else {
      ul.innerHTML = menuRes.menu.map(m=>`<a href="${(m.page && m.page.length)? m.page : '#'}">${m.menu_name}</a>`).join('');
    }
  } else {
    document.getElementById('menuList').innerText = 'Gagal memuat menu';
  }
}

function logout(){
  sessionStorage.removeItem('dm_token');
  window.location.href = 'index.html';
}
