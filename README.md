# 🎓 VAKLearn — Platform Pembelajaran Multimedia Adaptif (VAK + PIE)

Platform web pembelajaran multimedia interaktif yang memadukan identifikasi modalitas belajar **VAK** (*Visual, Auditory, Kinesthetic*) melalui media game petualangan 2D interaktif serta penerapan kerangka metodologi desain instruksional **PIE** (*Planning, Implementation, Evaluation*).

---

## 📋 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Struktur Proyek](#-struktur-proyek)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Panduan Instalasi & Menjalankan Aplikasi](#-panduan-instalasi--menjalankan-aplikasi)
- [Panduan Penggunaan](#-panduan-penggunaan)
- [Penyelesaian Masalah (Troubleshooting)](#-penyelesaian-masalah-troubleshooting)

---

## ✨ Fitur Utama

1. **Beranda & Panduan Pembelajaran:**
   - Ikhtisar sistem dan alur 4 langkah pembelajaran terpadu.
   - Ringkasan karakteristik modalitas belajar VAK (Visual, Auditori, Kinestetik).

2. **Game Edukasi Petualangan VAK (`#/game`):**
   - Game platformer 2D interaktif (Mario Adventure) dengan 10 Pos Diagnostik VAK.
   - Analisis otomatis gaya belajar dominan (Visual, Auditori, atau Kinestetik) beserta persentase dan strategi belajar saat mencapai bendera akhir.
   - Mendukung kontrol keyboard (`A/D/Panah`, `Spasi/W/Atas`) dan kontrol layar sentuh (*virtual arcade pad*).

3. **Modul Materi Adaptif 3 Moda (`#/materi`):**
   - 4 Topik utama: **Desain Grafis**, **Dasar-Dasar Animasi**, **Video Editing Profesional**, dan **Audio Editing & Produksi**.
   - **Moda Visual:** Kuliah interaktif Video AI dengan instruktur virtual Dr. Maya (animasi lip-sync & visualizer suara), diagram teknis dinamis untuk seluruh topik, serta infografis alur kerja.
   - **Moda Auditori:** Format siniar (*podcast*) dengan pembaca narasi otomatis (*Web Speech API*) dan transkrip interaktif per kalimat.
   - **Moda Kinestetik:** Simulasi praktik *drag-and-drop* penyusunan urutan *pipeline* dan alur kerja produksi multimedia.

4. **Uji Evaluasi & Refleksi Siswa (`#/evaluasi`):**
   - Instrumen umpan balik pembelajaran, rating kepuasan media, serta kuis komprehensif multimedia.

5. **Tentang Model PIE (`#/tentang`):**
   - Dokumentasi ilmiah tahapan *Planning* (perencanaan kebutuhan), *Implementation* (pengembangan media), dan *Evaluation* (evaluasi ketercapaian).

---

## 📁 Struktur Proyek

```text
VAKLearn/
├── data/
│   ├── materials.json        # Data 4 modul materi multimedia (Visual, Auditori, Kinestetik)
│   ├── multimedia-quiz.json  # Bank soal evaluasi materi multimedia
│   └── quiz.json             # Bank pertanyaan instrumen diagnostik VAK
├── public/
│   ├── css/
│   │   └── style.css         # Styling global, glassmorphism, animasi AI presenter & HUD game
│   ├── js/
│   │   ├── app.js            # Router SPA, render halaman, controller AI video & audio
│   │   └── mario-game.js     # Engine game platformer 2D Mario VAK Adventure (Canvas HTML5)
│   └── index.html            # File HTML utama (Single Page Application)
├── package.json              # Konfigurasi dependensi dan script npm
├── server.js                 # Server backend Node.js (Express & API endpoints)
└── README.md                 # Petunjuk instalasi dan penggunaan
```

---

## ⚙️ Persyaratan Sistem

Pastikan perangkat Anda telah terpasang:
- **Node.js** versi **16.x** atau yang lebih baru (disarankan LTS terbaru).
  - Cek versi Node.js dengan perintah:
    ```bash
    node -v
    ```
- **npm** (biasanya terpasang otomatis bersama Node.js).
  - Cek versi npm dengan perintah:
    ```bash
    npm -v
    ```
- Peramban web modern yang mendukung HTML5 Canvas dan Web Speech API (Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari).

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan website di komputer lokal:

### 1. Buka Terminal / PowerShell
Buka terminal (Command Prompt, PowerShell, atau Terminal VS Code) lalu arahkan ke direktori proyek ini:
```bash
cd "c:\Users\lenovo\Documents\Antigrafity\VAKLearn"
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk mengunduh pustaka yang diperlukan (`express` dan `cors`):
```bash
npm install
```

### 3. Jalankan Server
Jalankan aplikasi dengan salah satu perintah berikut:
```bash
npm start
```
*atau:*
```bash
node server.js
```

Jika server berhasil berjalan, terminal akan menampilkan pesan:
```text
🎓 ══════════════════════════════════════════════════
   Website Pembelajaran Multimedia VAK-PIE
   Server berjalan di http://localhost:3000
══════════════════════════════════════════════════════
```

### 4. Buka di Peramban Web
Buka peramban favorit Anda (misalnya Chrome atau Edge), lalu akses alamat:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎮 Panduan Penggunaan Singkat

1. **Memulai Pembelajaran:**
   - Di halaman **Beranda**, klik tombol **"Mainkan Game Petualangan VAK"** untuk mendiagnosis gaya belajar dominan Anda.
2. **Navigasi Game:**
   - Gerakkan Mario menggunakan tombol `A` / `D` atau `Panah Kiri` / `Panah Kanan`.
   - Lompat menggunakan `Spasi`, `W`, atau `Panah Atas`.
   - Dekati dan sentuh setiap Pos Pertanyaan (1 s.d. 10) lalu pilih opsi respon yang paling sesuai dengan diri Anda.
   - Capai tiang bendera kastil untuk membuka laporan hasil profil belajar VAK Anda.
3. **Mempelajari Materi:**
   - Buka menu **Materi** (`#/materi`), pilih salah satu topik (misal: *Desain Grafis*).
   - Gunakan tab **✨ Moda Visual** untuk memutar kuliah video AI interaktif.
   - Gunakan tab **🎧 Moda Auditori** untuk mendengarkan siniar narasi.
   - Gunakan tab **⚡ Moda Kinestetik** untuk mencoba simulasi alur kerja interaktif.
4. **Evaluasi:**
   - Buka menu **Evaluasi** (`#/evaluasi`) untuk mengisi refleksi belajar serta menguji pemahaman konsep multimedia.

---

## 🛠️ Penyelesaian Masalah (Troubleshooting)

### Masalah 1: `Port 3000 sedang digunakan oleh proses lain` (EADDRINUSE)
Jika port 3000 sedang terpakai oleh proses lain:
- **Opsi A (Hentikan proses yang berjalan):**
  - Pada Windows PowerShell:
    ```powershell
    Get-Process node | Stop-Process -Force
    ```
- **Opsi B (Ganti port di `server.js`):**
  - Buka file `server.js`, cari baris:
    ```javascript
    const PORT = 3000;
    ```
  - Ubah angka `3000` menjadi port lain, misalnya `3001` atau `8080`, lalu jalankan kembali `npm start`.

### Masalah 2: Suara Narasi AI Tidak Terdengar
- Pastikan volume komputer aktif dan peramban tidak di-mute.
- Klik tombol **"🔊 Suara AI"** pada pemutar video untuk memastikan status suara tidak berada dalam mode `Mute`.
- Disarankan menggunakan Google Chrome atau Microsoft Edge untuk dukungan Web Speech API (*Text-to-Speech*) bahasa Indonesia terbaik.

