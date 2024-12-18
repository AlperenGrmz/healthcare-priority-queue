
# Hastane Yönetim Sistemi

Bu proje, bir hastane yönetim sistemini simüle eder. Sistemde hastaların öncelik sırasına göre **Min-Heap** veri yapısı kullanılarak sıralanması, tedavi sürelerinin kontrol edilmesi ve tedavi süresini aşan hastaların takibi yapılır. **Min-Heap**, hastaların öncelik değerine göre en düşük önceliğe sahip hastanın her zaman en üstte bulunmasını sağlar. Proje, **backend** (Node.js) ve bir basit **frontend** (HTML) kısmından oluşmaktadır.


---

## Kullanılan Teknolojiler

- **Backend**: Node.js, Express.js, Cors
- **Veri Yönetimi**: Min-Heap veri yapısı
- **Frontend**: HTML, CSS (isteğe bağlı)

---

## Proje Yapısı

```plaintext
Proje/
├── server/
│   ├── server.js         # Backend için ana dosya
│   ├── heap.js           # Min-Heap veri yapısı
|   ├── output.txt        # İşlenen çıktılar
│   └── input.txt         # Giris Verisi
├── public/
│   ├── index.html        # Ana HTML dosyası
│   ├── style.css         # CSS Dosyası
|   └── script.js         # Js dosyası            
└── README.md             # Proje açıklamaları
```

---

## Kurulum

Projeyi çalıştırmak için aşağıdaki adımları takip edin.

### 1. Gereksinimler
- **[Node.js](https://nodejs.org/)** yüklü olmalıdır.
- **Bir tarayıcı** HTML dosyasını görüntülemek için gereklidir.

### 2. Backend Kurulumu ve Çalıştırma
1. Bu projeyi klonlayın:
   ```bash
   git clone [REPO-LINK]
   cd Proje/backend
   ```
2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Sunucuyu başlatın:
   ```bash
   npm start
   ```
4. Sunucu, `http://localhost:3000` adresinde çalışmaya başlayacaktır.

### 3. HTML Kullanımı
1. `Proje/public/index.html` dosyasını bir tarayıcıda açın.
2. Backend API ile iletişim kurarak hastalar üzerinde işlemler gerçekleştirebilirsiniz.

---

## Backend API'ları

### Hastaların Listelenmesi
- **Endpoint**: `/patients`
- **Yöntem**: `GET`
- **Açıklama**: Tüm hastaların listesini (normal, süreyi aşan ve tedavi edilmiş) döner.

### Yeni Hasta Ekleme
- **Endpoint**: `/addPatient`
- **Yöntem**: `POST`
- **Gövde**:
  ```json
  {
    "id": "123",
    "priority": 5,
    "duration": 60
  }
  ```
- **Açıklama**: Yeni bir hasta ekler. Süreyi aşarsa "Süresi aşan hastalar" listesine eklenir.

### Hasta Silme
- **Endpoint**: `/removePatient`
- **Yöntem**: `DELETE`
- **Açıklama**: En düşük öncelikli hastayı siler ve tedavi edilmiş olarak işaretler.

### Dosya İndirme
- **Endpoint**: `/download`
- **Yöntem**: `GET`
- **Açıklama**: Güncel hastaları içeren `output.txt` dosyasını indirir.

---

## Giriş ve Çıkış Dosyaları

### Giriş Dosyası: `input.txt`
Her satır bir hastayı temsil eder ve şu formatta olmalıdır:
```
[ID] [Öncelik] [Tedavi Süresi]
```
**Örnek**:
```
123 5 60
124 3 30
125 8 120
```

### Çıkış Dosyası: `output.txt`
Hastaların tedavi durumlarını ve süreyi aşan hastaları listeler.

---

## Örnek Kullanım

1. Sunucuyu başlatın.
2. `http://localhost:3000` adresinde çalışan ana sayfayı görüntüleyin.
3. Hasta ekleme, listeleme, ve silme işlemlerini gerçekleştirin.
4. `output.txt` dosyasını indirerek sonuçları kontrol edin.

---
