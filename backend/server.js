const fs = require("fs");
const express = require("express");
const path = require("path");
const MinHeap = require("./heap");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(cors());

const patients = new MinHeap(); // Süresi yeterli hastalar (Min-Heap)
const overduePatients = new MinHeap(); // Süresi aşan hastalar (Min-Heap)
const treatedPatients = []; // Silinen hastaların tutulduğu liste

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
  console.log(patients.getAll());
  console.log(overduePatients.getAll());

  writeOutputFile();
}

// Çıktı dosyasına yaz
function writeOutputFile() {
  const allPatients = [...patients.getAll()];
  const overduePatientsArray = [...overduePatients.getAll()];

  fs.writeFileSync(
    "output.txt",
    allPatients
      .map(
        (patient) =>
          `${patient.id} ${patient.priority} ${patient.duration} (not treated)\n`
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

  fs.appendFileSync(
    "output.txt",
    "\n--- Tedavi Olmuş Hastalar ---\n" +
      treatedPatients
        .map(
          (patient) =>
            `${patient.id} ${patient.priority} ${patient.duration} (treated)\n`
        )
        .join("")
  );
}

// Ana sayfa
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Dosya indirme api
app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "output.txt");
  res.download(filePath, "output.txt", (err) => {
    if (err) {
      console.error("Dosya indirilemedi:", err);
      res.status(500).send("Dosya indirilemedi.");
    }
  });
});

// Tüm hastaları görüntüle
app.get("/patients", (req, res) => {
  const allPatients = {
    treatedPatients: treatedPatients, // Tedavi olmuş hastalar
    normalPatients: patients.getAll(), // Normal hastalar
    overduePatients: overduePatients.getAll(), // Süresi aşan hastalar
  };
  res.status(200).json(allPatients);
});

// Yeni Hasta Ekleme
app.post("/addPatient", (req, res) => {
  const { id, priority, duration } = req.body;

  if (totalDuration + duration <= 420) {
    patients.insert({ id, priority, duration, treatedToday: true });
    totalDuration += duration;

    writeOutputFile();
    res.status(200).json({ message: "Hasta başarıyla eklendi!" });
  } else {
    overduePatients.insert({ id, priority, duration, treatedToday: false });
    writeOutputFile();
    res.status(400).json({ message: "Hasta eklenemedi, süreyi aşıyor!" });
  }
});

// Hasta Silme
app.delete("/removePatient", (req, res) => {
  if (patients.getAll().length === 0) {
    return res.status(404).json({ message: "Hastalar listesi boş!" });
  }

  const patient = patients.extractMin();
  treatedPatients.push(patient); // Silinen hastayı tedavi edilmişlere ekle

  writeOutputFile();
  res.status(200).json({ message: "Hasta başarıyla silindi!", patient });
});

app.listen(PORT, () => {
  console.log(`Server çalışıyor... Port: ${PORT}`);
  loadInputFile();
});
