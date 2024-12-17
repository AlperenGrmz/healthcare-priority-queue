// Sayfa yüklendiğinde hastaları yükle
async function loadPatients() {
    const response = await fetch('/patients');
    const patients = await response.json();

    const todayTableBody = document.querySelector('#todayPatientTable tbody');
    const overdueTableBody = document.querySelector('#overduePatientTable tbody');
    todayTableBody.innerHTML = ""; // Tabloyu temizle
    overdueTableBody.innerHTML = ""; // Tabloyu temizle

    // Bugün tedavi olacak hastalar ve süresi aşan hastaları ayır
    const todayPatients = patients.filter(patient => patient.treatedToday);
    const overduePatients = patients.filter(patient => !patient.treatedToday);

    // Bugün tedavi olacak hastaları tabloya ekle
    todayPatients.forEach(patient => {
        const row = `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.priority}</td>
                <td>${patient.duration}</td>
                <td>Treated</td>
            </tr>
        `;
        todayTableBody.innerHTML += row;
    });

    // Süresi aşan hastaları tabloya ekle
    overduePatients.forEach(patient => {
        const row = `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.priority}</td>
                <td>${patient.duration}</td>
                <td>Overdue</td>
            </tr>
        `;
        overdueTableBody.innerHTML += row;
    });
}

// Açılır/Kapanır tablo
document.querySelector('#toggleOverdueBtn').addEventListener('click', () => {
    const section = document.querySelector('#overduePatientsSection');
    const toggleBtn = document.querySelector('#toggleOverdueBtn');

    if (section.style.display === 'none') {
        section.style.display = 'block';
        toggleBtn.innerHTML = "Süresi Aşan Hastaları Gizle &#9650;";
    } else {
        section.style.display = 'none';
        toggleBtn.innerHTML = "Süresi Aşan Hastaları Göster &#9660;";
    }
});

let idCounter = 112;

// Yeni hasta ekleme
document.querySelector('#addPatientForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const priority = document.querySelector('#priority').value;
    const duration = document.querySelector('#duration').value;

    const newPatient = {
        id: idCounter, // ID'yi otomatik atar
        priority: parseInt(priority),
        duration: parseInt(duration),
        treatedToday: true // Varsayılan olarak bugünkü hasta
    };

    const response = await fetch('/addPatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient)
    });

    const result = await response.json();
    alert(result.message);

    idCounter++; // ID'yi artır
    document.querySelector('#priority').value = ""
    document.querySelector('#duration').value = ""
    loadPatients(); // Hastaları yeniden yükle
});

// Hasta silme
document.querySelector('#removePatientBtn').addEventListener('click', async () => {
    const response = await fetch('/removePatient', { method: 'DELETE' });

    const result = await response.json();
    alert(result.message);

    loadPatients();
});

// Sayfa ilk yüklendiğinde hastaları yükle
window.onload = loadPatients;
