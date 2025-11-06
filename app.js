const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxOa1KfgLro2eSlYP417ZwARuEBkRwF5gTKp17GTTh39g67QarBEBxNK_sOcnj__vao/exec"; // Ganti dengan URL dari langkah deployment GAS

async function fetchData() {
    try {
        const response = await fetch(GAS_WEB_APP_URL);
        const data = await response.json();
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = ''; // Bersihkan list sebelumnya

        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Kolom 1: ${item.kolom1}, Kolom 2: ${item.kolom2}`; // Sesuaikan dengan header kolom Anda
            dataList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function postData(event) {
    event.preventDefault();
    const kolom1Input = document.getElementById('kolom1-input').value;
    const kolom2Input = document.getElementById('kolom2-input').value;

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'cors', // Penting untuk CORS
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kolom1: kolom1Input, kolom2: kolom2Input })
        });
        const result = await response.json();
        console.log("Post result:", result);
        alert("Data added successfully!");
        document.getElementById('data-form').reset(); // Reset form
        fetchData(); // Muat ulang data
    } catch (error) {
        console.error("Error posting data:", error);
        alert("Failed to add data.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    const dataForm = document.getElementById('data-form');
    if (dataForm) {
        dataForm.addEventListener('submit', postData);
    }
});
