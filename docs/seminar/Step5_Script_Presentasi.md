# 🎤 STEP 5: SCRIPT PRESENTASI SEMINAR SIM4LON

> Script narasi lengkap untuk presentasi seminar, termasuk timing dan poin-poin penting.

---

## ⏱️ ESTIMASI WAKTU

| Bagian | Durasi | Konten |
|--------|--------|--------|
| Pembukaan | 2-3 menit | Salam, perkenalan, overview |
| Latar Belakang | 3-4 menit | Masalah dan solusi |
| Demo Aplikasi | 8-10 menit | Live demo fitur utama |
| Kesimpulan | 2-3 menit | Rangkuman dan saran |
| Q&A | 10-15 menit | Tanya jawab |
| **Total** | **25-35 menit** | - |

---

## 📖 NARASI PEMBUKAAN (2-3 menit)

### Salam & Perkenalan

> "Assalamu'alaikum warahmatullahi wabarakatuh.
>
> Yang terhormat Bapak/Ibu Dosen Penguji,
> 
> Perkenalkan, saya **[Nama Anda]**, NPM **[NPM]**, dari Program Studi **Teknik Informatika**.
>
> Pada kesempatan ini, saya akan mempresentasikan hasil Kerja Praktek saya dengan judul:
>
> **'RANCANG BANGUN SISTEM INFORMASI MANAJEMEN DISTRIBUSI LPG (SIM4LON) BERBASIS WEB PADA PT. MITRA SURYA NATASYA'**"

### Overview Singkat

> "Sebelum saya mulai, izinkan saya memberikan gambaran singkat.
>
> PT. Mitra Surya Natasya adalah **agen resmi Pertamina** yang mendistribusikan LPG ke lebih dari **50 pangkalan** di wilayah Cianjur.
>
> Selama ini, proses pencatatan masih manual — pesanan via WhatsApp, stok dicatat di buku, dan laporan logbook butuh **3 hari kerja** untuk diselesaikan.
>
> Aplikasi SIM4LON hadir untuk **mendigitalisasi seluruh proses tersebut**."

---

## 📖 NARASI LATAR BELAKANG (3-4 menit)

### Masalah yang Ditemukan

> "Berdasarkan observasi dan wawancara dengan pemilik agen, saya menemukan **4 masalah utama**:
>
> **Pertama**, pencatatan stok masih manual, sehingga sering terjadi **selisih antara data dan fisik**.
>
> **Kedua**, tidak ada sistem peringatan, sehingga agen baru sadar stok habis **saat pangkalan komplain**.
>
> **Ketiga**, pembuatan laporan logbook ke Pertamina membutuhkan waktu lama dan **rawan kesalahan hitung**.
>
> **Keempat**, pangkalan tidak bisa memantau status pesanan mereka secara **real-time**."

### Solusi yang Ditawarkan

> "Untuk mengatasi masalah tersebut, saya merancang aplikasi **SIM4LON** dengan fitur-fitur unggulan:
>
> 1. **Voice Command berbasis AI** — Admin bisa input pesanan hanya dengan **berbicara**
> 2. **Decision Support System** — Alert otomatis saat stok menipis
> 3. **Multi-Tenant Portal** — Pangkalan punya akun sendiri
> 4. **Integrasi Pertamina** — Laporan SO/LO sesuai standar"

---

## 📖 NARASI DEMO APLIKASI (8-10 menit)

### Intro Demo

> "Sekarang izinkan saya mendemonstrasikan aplikasi SIM4LON secara langsung."

*(Buka browser, akses localhost atau production URL)*

### Demo 1: Login & Dashboard (2 menit)

> "Pertama, saya login sebagai **Admin Agen**.
>
> *(Login dengan credentials)*
>
> Ini adalah **Dashboard** yang menampilkan:
> - Total pesanan hari ini
> - Total penjualan dalam Rupiah
> - Grafik penjualan 7 hari terakhir
> - **Alert stok** — perhatikan ada warning kuning untuk produk yang menipis
>
> Dashboard ini memberikan **gambaran operasional secara real-time**."

### Demo 2: Voice Command Order (3 menit) ⭐ KILLER FEATURE

> "Sekarang fitur unggulan — **Voice Command**.
>
> Saya akan membuat pesanan hanya dengan **berbicara**.
>
> *(Klik tombol mic, ucapkan: 'Pesan gas 3 kilo 50 tabung untuk Pangkalan Reon')*
>
> Perhatikan bahwa sistem:
> 1. Mengenali **nama pangkalan** dari database
> 2. Mendeteksi **jenis produk** (3kg)
> 3. Menangkap **jumlah** (50 tabung)
>
> Jika stok tidak cukup, sistem akan memberikan **error message**.
>
> Confidence score **85%** artinya AI cukup yakin dengan interpretasi ini.
>
> *(Klik Submit untuk membuat pesanan)*"

### Demo 3: Manajemen Stok (2 menit)

> "Selanjutnya, fitur **Manajemen Stok**.
>
> Di sini admin bisa mencatat stok **masuk** (dari SPBE) dan **keluar** (ke pangkalan).
>
> Perhatikan grafik di sebelah kanan — konsumsi stok per hari.
>
> Jika stok di bawah **100 unit**, sistem otomatis menampilkan alert **KRITIS**."

### Demo 4: DSS Alerts (1 menit)

> "Di menu **Notifikasi**, kita bisa lihat semua alert:
> - Stok kritis
> - Pembayaran tertunda
> - Pesanan pending dari pangkalan
>
> Ini adalah implementasi **Decision Support System** yang membantu pengambilan keputusan."

### Demo 5: Laporan (2 menit)

> "Terakhir, fitur **Laporan**.
>
> Admin bisa generate laporan:
> - Penjualan
> - Pembayaran
> - Stok
>
> *(Klik Export PDF atau Excel)*
>
> Laporan bisa diunduh dalam format **PDF atau Excel**, siap untuk dikirim ke Pertamina."

---

## 📖 NARASI PENUTUP (2-3 menit)

### Kesimpulan

> "Berdasarkan hasil penelitian dan implementasi, dapat disimpulkan bahwa:
>
> 1. Aplikasi SIM4LON berhasil **mendigitalisasi** seluruh proses distribusi LPG
> 2. Fitur **Voice Command** mempercepat input pesanan hingga **80%**
> 3. Sistem **DSS** berhasil mencegah kekosongan stok
> 4. Pengujian menunjukkan **100% validitas** dari 189 test case
> 5. Skor **UAT 87.5** menunjukkan tingkat penerimaan pengguna yang tinggi"

### Saran Pengembangan

> "Untuk pengembangan selanjutnya, saya menyarankan:
>
> 1. Integrasi **WhatsApp Gateway** untuk notifikasi external
> 2. Aplikasi **mobile khusus driver** untuk tracking pengiriman
> 3. Fitur **forecasting** untuk prediksi permintaan musiman"

### Penutup

> "Demikian presentasi dari saya.
>
> Terima kasih atas perhatian Bapak/Ibu Dosen Penguji.
>
> Saya siap menerima pertanyaan dan masukan.
>
> Wassalamu'alaikum warahmatullahi wabarakatuh."

---

## 💡 TIPS PRESENTASI

| Do ✅ | Don't ❌ |
|-------|---------|
| Bicara pelan dan jelas | Membaca teks dari layar |
| Kontak mata dengan dosen | Membelakangi audiens |
| Demo singkat tapi impactful | Demo terlalu lama/detail |
| Akui jika tidak tahu | Menjawab asal-asalan |
| Minta izin sebelum demo | Langsung demo tanpa context |

---

## 🔧 CHECKLIST TEKNIS SEBELUM SEMINAR

- [ ] Test localhost: `npm run dev` (frontend) + `npm run start:dev` (backend)
- [ ] Siapkan data dummy yang realistis (bukan "test123")
- [ ] Test fitur Voice Command (butuh internet untuk Gemini)
- [ ] Siapkan video backup jika internet mati
- [ ] Charge laptop 100%
- [ ] Siapkan mouse external (jangan pakai trackpad)
- [ ] Test proyektor/screen share

---

> ✅ **Step 5 Selesai!** Script presentasi lengkap siap digunakan.
