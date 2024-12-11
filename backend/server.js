const fs = require("fs");
const express = require("express");
const MinHeap = require("./heap"); // Min-Heap'i dahil et
const app = express();
app.use(express.json());

const patients = new MinHeap(); // Süresi yeterli hastalar (Min-Heap)
const overduePatients = new MinHeap(); // Süresi aşan hastalar (Min-Heap)

let totalDuration = 0; // Toplam tedavi süresi

// Input dosyasından hastaları yükle
function loadInputFile() {
  const data = fs.readFileSync("input.txt", "utf-8");
  const lines = data.trim().split("\n");

  for (const line of lines) {
    const [id, priority, duration] = line
      .split(" ")
      .map((val) => (isNaN(val) ? val : +val));

    // Süreyi kontrol et (420 dakika, 7 saat)
    if (totalDuration + duration <= 420) {
      patients.insert({ id, priority, duration, treatedToday: true });
      totalDuration += duration; // Toplam süreyi güncelle
    } else {
      overduePatients.insert({ id, priority, duration, treatedToday: false });
    }
  }
  console.log(patients.getAll()); // Normal hastalar (yeterli süreyle)
  console.log(overduePatients.getAll()); // Süresi aşan hastalar

  // Çıktı dosyasına yaz
  writeOutputFile();
}

// Çıktı dosyasına yaz (Sıralı şekilde hastaları yaz)
function writeOutputFile() {
  const allPatients = [...patients.getAll()]; // Normal hastaları al (Min-Heap'teki tüm öğeleri)

  // Süresi aşan hastaları al
  const overduePatientsArray = [...overduePatients.getAll()]; // Süresi aşan hastaları al (Min-Heap'teki tüm öğeleri)

  // Dosyayı sil ve tekrar yaz
  fs.writeFileSync(
    "output.txt",
    allPatients
      .map(
        (patient) =>
          `${patient.id} ${patient.priority} ${patient.duration} ${
            patient.treatedToday ? "(treated)" : "(overdue)"
          }\n`
      )
      .join("")
  );
  fs.appendFileSync(
    "output.txt",
    "\n--- Süresi Aşan Hastalar ---\n" +
    overduePatientsArray
      .map(
        (patient) =>
          `${patient.id} ${patient.priority} ${patient.duration} ${
            patient.treatedToday ? "(treated)" : "(overdue)"
          }\n`
      )
      .join("")
  );
}

// Yeni hasta ekle
app.post("/addPatient", (req, res) => {
  const { id, priority, duration } = req.body;

  // Süreyi kontrol et
  if (totalDuration + duration <= 420) {
    // 420 dakika (7 saat)
    patients.insert({ id, priority, duration, treatedToday: true });
    totalDuration += duration; // Toplam süreyi güncelle

    // Dosyayı güncelle
    writeOutputFile();

    res.status(200).json({ message: "Hasta başarıyla eklendi!" });
  } else {
    // Süresi aşan hastayı overdue heap'e ekle
    overduePatients.insert({ id, priority, duration, treatedToday: false });
    res.status(400).json({ message: "Hasta eklenemedi, süreyi aşıyor!" });
  }
});

// Tüm hastaları görüntüle
app.get("/patients", (req, res) => {
  const allPatients = [...patients.getAll(), ...overduePatients.getAll()]; // Her iki heap'teki hastaları birleştir
  res.status(200).json(allPatients); // JSON olarak döndür
});

app.delete("/removePatient", (req, res) => {
    console.log(patients.getAll())
  // Min-Heap'ten root öğesini çıkar
  if (patients.getAll().length === 0) {
    return res.status(404).json({ message: "Hastalar listesi boş!" });
  }

  // Root öğesini çıkarmak için extractMin() kullanıyoruz
  const patient = patients.extractMin();

  // Silinen hastayı kaydetme ve yanıt
  res.status(200).json({ message: "Hasta başarıyla silindi!", patient });

  // Dosyayı tekrar yaz
  writeOutputFile();
});

// Server başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor... Port: ${PORT}`);
  loadInputFile(); // Başlangıçta input.txt'yi yükle
});
