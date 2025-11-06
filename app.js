// app.js

// GANTI DENGAN URL APLIKASI WEB GAS ANDA YANG SUDAH DI-DEPLOY!
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyUwB6MSrdCv8vg1QlsVPQPdVupxeaq4pAVBKtWgRsnjG9xTX8el8ODM-0P8mTv7i7o/exec"; 

const userListElement = document.getElementById('user-list');
const loadingSpinner = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');

/**
 * Mengambil data pengguna dari Google Apps Script API dan menampilkannya.
 */
async function fetchUsers() {
    userListElement.innerHTML = ''; // Bersihkan list sebelumnya
    errorMessageElement.style.display = 'none'; // Sembunyikan pesan error
    loadingSpinner.style.display = 'block'; // Tampilkan spinner loading

    try {
        const response = await fetch(GAS_WEB_APP_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            result.data.forEach(user => {
                const listItem = document.createElement('li');
                listItem.classList.add('user-item');
                
                // Asumsi kolom-kolom dari tabelUsers Anda
                // Sesuaikan 'id', 'nama', 'email', dll. dengan header kolom aktual di spreadsheet Anda
                listItem.innerHTML = `
                    <h3>${user.nama || 'N/A'}</h3>
                    <p>ID: ${user.id || 'N/A'}</p>
                    <p>Email: ${user.email || 'N/A'}</p>
                    <p>Phone: ${user.phone || 'N/A'}</p>
                    <p>Address: ${user.address || 'N/A'}</p>
                    <!-- Tambahkan kolom lain sesuai kebutuhan -->
                `;
                userListElement.appendChild(listItem);
            });
        } else if (result.success && result.data.length === 0) {
            userListElement.innerHTML = '<p>No users found in the spreadsheet.</p>';
        } else {
            throw new Error(result.error || "Unknown error from GAS backend.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        errorMessageElement.textContent = `Failed to load data: ${error.message}`;
        errorMessageElement.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none'; // Sembunyikan spinner loading
    }
}

// Panggil fungsi fetchUsers saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', fetchUsers);
