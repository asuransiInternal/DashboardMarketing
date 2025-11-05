// --- Konfigurasi Global Frontend ---
const GAS_WEB_APP_URL = 'URL_DEPLOYMENT_GAS_ANDA'; // Ganti dengan URL Web App GAS Anda
// Contoh: https://script.google.com/macros/s/AKfycbz_YOUR_DEPLOYMENT_ID_HERE/exec

// --- Fungsi Helper untuk Feedback UI ---

/**
 * Menampilkan pesan error di elemen spesifik.
 * @param {string} elementId ID elemen HTML tempat pesan error akan ditampilkan.
 * @param {string} message Pesan error yang akan ditampilkan.
 */
function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Tampilkan elemen error
    }
}

/**
 * Menyembunyikan pesan error.
 * @param {string} elementId ID elemen HTML tempat pesan error berada.
 */
function hideErrorMessage(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none'; // Sembunyikan elemen error
    }
}

/**
 * Menampilkan Toast message.
 * @param {string} message Pesan toast.
 * @param {string} type Tipe toast (e.g., 'success', 'error', 'info').
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.warn('Toast container not found. Message:', message);
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Animasi muncul
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // Animasi hilang setelah 3 detik
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

/**
 * Mengubah teks dan status tombol menjadi loading.
 * @param {HTMLElement} buttonElement Elemen tombol.
 * @param {string} originalText Teks asli tombol.
 */
function showLoading(buttonElement, originalText = 'Memproses...') {
    buttonElement.dataset.originalText = buttonElement.textContent; // Simpan teks asli
    buttonElement.textContent = originalText;
    buttonElement.disabled = true;
    buttonElement.classList.add('loading'); // Tambahkan kelas untuk gaya loading (opsional di CSS)
}

/**
 * Mengembalikan tombol ke status semula.
 * @param {HTMLElement} buttonElement Elemen tombol.
 */
function hideLoading(buttonElement) {
    buttonElement.textContent = buttonElement.dataset.originalText || 'Submit'; // Kembalikan teks asli
    buttonElement.disabled = false;
    buttonElement.classList.remove('loading');
}


// --- Event Listener untuk Form Login ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Mencegah reload halaman
        hideErrorMessage('loginError'); // Sembunyikan pesan error sebelumnya

        const button = document.getElementById('loginButton');
        showLoading(button, 'MASUK...');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'signin',
                    email: email,
                    password: password
                })
            });

            const result = await response.json();
            
            if (result.success) {
                showToast(result.message, 'success');
                // Simpan data sesi ke localStorage
                localStorage.setItem('userEmail', result.data.userEmail);
                localStorage.setItem('userName', result.data.userName);
                localStorage.setItem('userRole', result.data.userRole);
                localStorage.setItem('userRoleId', result.data.userRoleId);
                localStorage.setItem('sessionToken', result.data.sessionToken);
                
                // Arahkan ke dashboard setelah login
                window.location.href = 'dashboard.html';
            } else {
                displayErrorMessage('loginError', result.message);
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during login:', error);
            displayErrorMessage('loginError', 'Terjadi kesalahan jaringan atau server.');
            showToast('Terjadi kesalahan yang tidak terduga.', 'error');
        } finally {
            hideLoading(button);
        }
    });
}

// --- Event Listener untuk Form Signup ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Mencegah reload halaman
        hideErrorMessage('signupError'); // Sembunyikan pesan error sebelumnya

        const button = document.getElementById('signupButton');
        showLoading(button, 'MENDAFTAR...');

        const namaLengkap = document.getElementById('namaLengkap').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const noWhatsapp = document.getElementById('noWhatsapp').value;

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'signup',
                    namaLengkap: namaLengkap,
                    email: email,
                    password: password,
                    noWhatsapp: noWhatsapp
                })
            });

            const result = await response.json();

            if (result.success) {
                showToast(result.message, 'success');
                // Opsional: Langsung arahkan ke halaman login setelah daftar berhasil
                // Atau biarkan di halaman signup dengan pesan sukses
                // setTimeout(() => {
                //     window.location.href = 'index.html'; 
                // }, 2000);
            } else {
                displayErrorMessage('signupError', result.message);
                showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            displayErrorMessage('signupError', 'Terjadi kesalahan jaringan atau server.');
            showToast('Terjadi kesalahan yang tidak terduga.', 'error');
        } finally {
            hideLoading(button);
        }
    });
}

// --- Fungsi Logout (akan dipanggil dari dashboard.html) ---
async function logout() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        showToast('Anda belum login.', 'info');
        // Pastikan untuk mengarahkan ke halaman login jika tidak ada sesi
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'logout',
                userEmail: userEmail
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast(result.message, 'success');
            // Hapus semua data sesi dari localStorage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userRoleId');
            localStorage.removeItem('sessionToken');
            
            // Redirect ke halaman login
            window.location.href = 'index.html';
        } else {
            showToast(result.message, 'error');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        showToast('Terjadi kesalahan saat logout.', 'error');
    }
}
