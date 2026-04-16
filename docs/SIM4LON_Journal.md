# PERANCANGAN DAN IMPLEMENTASI SISTEM INFORMASI MANAJEMEN DISTRIBUSI LPG BERBASIS WEB
## (Studi Kasus: Agen LPG di Wilayah Cianjur)

---

**Luthfi Alfaridz**  
Program Studi Teknik Informatika  
Fakultas Teknik, Universitas Suryakancana  
Email: luthfi.alfaridz@student.unsur.ac.id

---

## ABSTRAK

Distribusi gas LPG (Liquefied Petroleum Gas) merupakan salah satu kegiatan vital dalam rantai pasok energi nasional. Namun, banyak agen LPG yang masih menggunakan pencatatan manual sehingga menimbulkan permasalahan seperti ketidakakuratan data stok, kesulitan pelacakan pesanan, dan lambatnya pembuatan laporan. Penelitian ini bertujuan untuk merancang dan mengimplementasikan Sistem Informasi Manajemen LPG berbasis web yang dinamakan SIM4LON (Sistem Informasi Manajemen LPG 4 Jalur Online). 

Metode pengembangan yang digunakan adalah **Waterfall** dengan tahapan analisis kebutuhan, perancangan sistem menggunakan UML (Unified Modeling Language), implementasi dengan teknologi modern (React, NestJS, PostgreSQL), dan pengujian sistem. Hasil penelitian menunjukkan bahwa SIM4LON berhasil mengintegrasikan proses pencatatan pesanan, manajemen stok, pembayaran, dan pelaporan dalam satu platform terpadu. Pengujian black-box menunjukkan semua fungsionalitas berjalan sesuai spesifikasi. Sistem ini dapat meningkatkan efisiensi operasional dan akurasi data pada bisnis distribusi LPG.

**Kata Kunci:** Sistem Informasi, Distribusi LPG, Web Application, UML, React, NestJS

---

## ABSTRACT

LPG (Liquefied Petroleum Gas) distribution is one of the vital activities in the national energy supply chain. However, many LPG agents still use manual recording, causing problems such as inaccurate stock data, difficulty in tracking orders, and slow report generation. This research aims to design and implement a web-based LPG Management Information System called SIM4LON (LPG 4 Lane Online Management Information System).

The development method used is **Waterfall** with stages of requirements analysis, system design using UML (Unified Modeling Language), implementation with modern technology (React, NestJS, PostgreSQL), and system testing. The results show that SIM4LON successfully integrates order recording, stock management, payment, and reporting processes in one integrated platform. Black-box testing shows all functionalities run according to specifications. This system can improve operational efficiency and data accuracy in the LPG distribution business.

**Keywords:** Information System, LPG Distribution, Web Application, UML, React, NestJS

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang

Gas LPG (Liquefied Petroleum Gas) merupakan salah satu sumber energi yang banyak digunakan oleh masyarakat Indonesia, baik untuk keperluan rumah tangga maupun komersial. Berdasarkan data Kementerian ESDM (2023), konsumsi LPG nasional mencapai lebih dari 8 juta ton per tahun dengan tren peningkatan rata-rata 4% setiap tahunnya.

Dalam rantai distribusi LPG, agen (distributor) memegang peranan penting sebagai penghubung antara SPBE (Stasiun Pengisian Bulk Elpiji) dengan pangkalan-pangkalan yang menjual langsung ke konsumen. Seorang agen umumnya mengelola puluhan hingga ratusan pangkalan dengan transaksi harian yang kompleks mencakup pesanan, pengiriman, pembayaran, dan pelaporan.

Berdasarkan observasi awal pada beberapa agen LPG di wilayah Cianjur, ditemukan bahwa sebagian besar masih menggunakan sistem pencatatan manual berbasis buku tulis atau spreadsheet yang tidak terintegrasi. Hal ini menimbulkan beberapa permasalahan, antara lain:

1. **Ketidakakuratan data stok** - Perbedaan antara stok fisik dan catatan sering terjadi
2. **Kesulitan pelacakan pesanan** - Status pengiriman sulit dipantau secara real-time
3. **Lambatnya pembuatan laporan** - Rekap bulanan membutuhkan waktu yang lama
4. **Risiko kehilangan data** - Catatan manual rentan rusak atau hilang
5. **Tidak ada kontrol akses** - Semua operator bisa mengakses semua data

Oleh karena itu, diperlukan sebuah sistem informasi berbasis web yang dapat mengintegrasikan seluruh proses bisnis distribusi LPG secara efisien, akurat, dan dapat diakses dari mana saja.

### 1.2 Rumusan Masalah

Berdasarkan latar belakang di atas, rumusan masalah dalam penelitian ini adalah:

1. Bagaimana merancang sistem informasi manajemen distribusi LPG yang terintegrasi?
2. Bagaimana mengimplementasikan sistem tersebut menggunakan teknologi web modern?
3. Bagaimana hasil pengujian sistem yang telah dibangun?

### 1.3 Tujuan Penelitian

Tujuan dari penelitian ini adalah:

1. Merancang sistem informasi manajemen distribusi LPG menggunakan pendekatan UML
2. Mengimplementasikan sistem berbasis web dengan arsitektur modern (React + NestJS)
3. Menguji fungsionalitas sistem untuk memastikan kesesuaian dengan kebutuhan

### 1.4 Manfaat Penelitian

**Manfaat Teoritis:**
- Memberikan kontribusi pengetahuan dalam pengembangan sistem informasi distribusi berbasis web
- Menjadi referensi untuk penelitian sejenis di masa mendatang

**Manfaat Praktis:**
- Membantu agen LPG dalam mengelola operasional secara lebih efisien
- Meningkatkan akurasi pencatatan dan pelaporan
- Mempercepat proses pengambilan keputusan berbasis data

### 1.5 Batasan Masalah

Penelitian ini dibatasi pada:

1. Sistem dikembangkan untuk kebutuhan agen LPG skala menengah (10-100 pangkalan)
2. Platform yang dibangun berbasis web responsif
3. Fitur yang dikembangkan mencakup: manajemen pesanan, stok, pembayaran, dan laporan
4. Pengujian dilakukan dengan metode black-box testing

---

## 2. TINJAUAN PUSTAKA

### 2.1 Sistem Informasi

Menurut Laudon & Laudon (2020), sistem informasi adalah sekumpulan komponen yang saling terhubung untuk mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi untuk mendukung pengambilan keputusan dan pengendalian dalam organisasi.

O'Brien & Marakas (2017) mendefinisikan sistem informasi sebagai kombinasi terorganisasi dari manusia, perangkat keras, perangkat lunak, jaringan komunikasi, sumber data, serta kebijakan dan prosedur yang menyimpan, mengambil, mengubah, dan menyebarkan informasi dalam sebuah organisasi.

### 2.2 Distribusi LPG di Indonesia

LPG (Liquefied Petroleum Gas) adalah gas hidrokarbon yang dicairkan dengan tekanan untuk memudahkan penyimpanan dan pengangkutan (Pertamina, 2023). Rantai distribusi LPG di Indonesia melibatkan beberapa pihak:

1. **Pertamina** - Produsen dan pemilik merek
2. **SPBE** (Stasiun Pengisian Bulk Elpiji) - Pengisian ulang tabung
3. **Agen** - Distributor yang menyalurkan ke pangkalan
4. **Pangkalan** - Pengecer yang menjual ke konsumen

### 2.3 Unified Modeling Language (UML)

UML adalah bahasa pemodelan visual standar untuk menspesifikasikan, memvisualisasikan, membangun, dan mendokumentasikan artefak sistem perangkat lunak (Rumbaugh et al., 2004). Diagram UML yang umum digunakan antara lain:

- **Use Case Diagram** - Menggambarkan fungsionalitas sistem dari perspektif pengguna
- **Class Diagram** - Menggambarkan struktur statis sistem
- **Activity Diagram** - Menggambarkan alur kerja proses bisnis
- **Sequence Diagram** - Menggambarkan interaksi antar objek
- **ERD** - Menggambarkan struktur database

### 2.4 Teknologi Web Modern

**React** adalah library JavaScript untuk membangun user interface yang dikembangkan oleh Facebook (Meta). React menggunakan konsep component-based dan virtual DOM untuk rendering yang efisien (React Documentation, 2023).

**NestJS** adalah framework Node.js untuk membangun aplikasi server-side yang efisien dan scalable. NestJS menggunakan TypeScript dan mengadopsi arsitektur modular yang terinspirasi dari Angular (NestJS Documentation, 2023).

**PostgreSQL** adalah sistem manajemen database relasional open-source yang powerful dengan dukungan ACID compliance dan fitur enterprise (PostgreSQL Documentation, 2023).

### 2.5 Penelitian Terdahulu

| No | Peneliti | Judul | Metode | Hasil |
|----|----------|-------|--------|-------|
| 1 | Pratama (2022) | Sistem Informasi Penjualan LPG | Waterfall, PHP | Sistem berhasil mencatat penjualan |
| 2 | Hidayat (2021) | Aplikasi Distribusi Gas | RAD, Laravel | Mempercepat proses distribusi |
| 3 | Santoso (2023) | SI Manajemen Agen LPG | Prototype, CodeIgniter | Meningkatkan akurasi stok |

Perbedaan penelitian ini dengan penelitian sebelumnya adalah penggunaan teknologi modern (React + NestJS), pendekatan multi-tenant untuk pangkalan, dan dokumentasi UML yang komprehensif.

---

## 3. METODOLOGI PENELITIAN

### 3.1 Metode Pengembangan Sistem

Penelitian ini menggunakan metode **Waterfall** yang terdiri dari tahapan:

```
┌─────────────────────┐
│ 1. Requirements     │
│    Analysis         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 2. System Design    │
│    (UML Modeling)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 3. Implementation   │
│    (Coding)         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 4. Testing          │
│    (Black-box)      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ 5. Deployment       │
│    (Cloud)          │
└─────────────────────┘
```

### 3.2 Teknik Pengumpulan Data

1. **Observasi** - Pengamatan langsung proses bisnis agen LPG
2. **Wawancara** - Diskusi dengan pemilik dan operator agen
3. **Studi Pustaka** - Kajian literatur terkait sistem informasi dan distribusi LPG

### 3.3 Alat dan Bahan

**Perangkat Keras:**
- Laptop dengan RAM 16GB, SSD 512GB
- Koneksi internet

**Perangkat Lunak:**
| Kategori | Tools |
|----------|-------|
| IDE | Visual Studio Code |
| Frontend | React 18, Vite 5, Tailwind CSS |
| Backend | NestJS 10, Prisma 5 |
| Database | PostgreSQL 15 |
| Version Control | Git, GitHub |
| Deployment | Vercel, Railway |
| UML Modeling | PlantUML |

### 3.4 Alur Penelitian

```
Mulai
  │
  ▼
Identifikasi Masalah
  │
  ▼
Pengumpulan Data
  │
  ▼
Analisis Kebutuhan
  │
  ▼
Perancangan Sistem (UML)
  │
  ▼
Implementasi (Coding)
  │
  ▼
Pengujian (Black-box)
  │
  ▼
Dokumentasi & Laporan
  │
  ▼
Selesai
```

---

## 4. HASIL DAN PEMBAHASAN

### 4.1 Analisis Sistem Berjalan

Berdasarkan observasi di lapangan, proses bisnis agen LPG saat ini berjalan sebagai berikut:

1. Pangkalan memesan via WhatsApp atau telepon
2. Operator mencatat pesanan di buku tulis
3. Driver diberitahu manual untuk pengiriman
4. Pembayaran dicatat terpisah di buku kas
5. Rekapitulasi bulanan dikerjakan manual di Excel

**Kelemahan Sistem Berjalan:**
- Tidak ada integrasi antar proses
- Rentan kesalahan pencatatan
- Sulit melacak status real-time
- Pembuatan laporan memakan waktu lama

### 4.2 Analisis Kebutuhan Sistem

**Kebutuhan Fungsional:**

| No | Kode | Kebutuhan | Prioritas |
|----|------|-----------|-----------|
| 1 | F-01 | Sistem dapat mengelola data pengguna | High |
| 2 | F-02 | Sistem dapat mengelola data pangkalan | High |
| 3 | F-03 | Sistem dapat mencatat pesanan | High |
| 4 | F-04 | Sistem dapat mengubah status pesanan | High |
| 5 | F-05 | Sistem dapat mencatat pembayaran | High |
| 6 | F-06 | Sistem dapat mengelola stok | High |
| 7 | F-07 | Sistem dapat menghasilkan laporan | Medium |
| 8 | F-08 | Sistem dapat mengakses dari mobile | Medium |

**Kebutuhan Non-Fungsional:**

| No | Kode | Kebutuhan |
|----|------|-----------|
| 1 | NF-01 | Sistem berbasis web responsif |
| 2 | NF-02 | Sistem memiliki keamanan login |
| 3 | NF-03 | Sistem mampu menampung minimal 100 pangkalan |
| 4 | NF-04 | Waktu respon halaman < 3 detik |

### 4.3 Perancangan Sistem

#### 4.3.1 Use Case Diagram

Sistem memiliki 3 aktor utama:
- **Admin** - Mengelola master data dan monitoring
- **Operator** - Operasional pesanan, stok, pembayaran
- **Pangkalan** - Mengakses data milik sendiri

Total terdapat **18 use case** yang teridentifikasi, termasuk:
- Login, Kelola Profil
- Kelola Pengguna, Pangkalan, Supir (Admin)
- Kelola Pesanan, Pembayaran, Stok, Laporan (Admin+Operator)
- Kelola Penjualan Konsumen (Pangkalan)

#### 4.3.2 Class Diagram

Sistem memiliki **22 class** yang terbagi dalam kategori:
- Master Data: users, agen, pangkalans, drivers, lpg_products
- Order Management: orders, order_items, timeline_tracks, invoices
- Payment: order_payment_details, payment_records
- Stock: stock_histories, penerimaan_stok, penyaluran_harian
- Pangkalan Module: consumers, consumer_orders, pangkalan_stocks

#### 4.3.3 Entity Relationship Diagram (ERD)

Database terdiri dari **23 tabel** dengan relasi one-to-many dan one-to-one. Beberapa relasi utama:
- pangkalans (1) → orders (N)
- orders (1) → order_items (N)
- orders (1) → order_payment_details (1)

### 4.4 Implementasi Sistem

#### 4.4.1 Arsitektur Sistem

```
┌───────────────┐     HTTPS      ┌───────────────┐
│    Browser    │ ─────────────→ │    Vercel     │
│   (Client)    │                │  (Frontend)   │
└───────────────┘                └───────┬───────┘
                                         │ API
                                         ▼
                                 ┌───────────────┐
                                 │   Railway     │
                                 │  (Backend)    │
                                 └───────┬───────┘
                                         │
                      ┌──────────────────┼──────────────────┐
                      ▼                  ▼                  ▼
               ┌───────────┐      ┌───────────┐      ┌───────────┐
               │ PostgreSQL│      │  Supabase │      │  NestJS   │
               │    15     │      │  Storage  │      │   API     │
               └───────────┘      └───────────┘      └───────────┘
```

#### 4.4.2 Tampilan Antarmuka

**Halaman Login:**
- Form email dan password
- Single-session login (1 device per user)
- Responsive design

**Dashboard Admin:**
- KPI Cards: Pesanan hari ini, Stok, Pendapatan
- Grafik penjualan bulanan
- Notifikasi aktivitas terbaru

**Halaman Pesanan:**
- Tabel daftar pesanan dengan filter
- Status tracking dengan timeline
- Aksi: Edit, Update Status, Assign Driver

**Halaman Laporan:**
- Export PDF format Pertamina
- Export Excel
- Rekapitulasi bulanan

### 4.5 Pengujian Sistem

Pengujian dilakukan dengan metode **Black-box Testing** untuk memastikan fungsionalitas sistem berjalan sesuai spesifikasi.

#### 4.5.1 Hasil Pengujian Fungsional

| No | Skenario Uji | Prosedur | Hasil Diharapkan | Hasil Aktual | Status |
|----|--------------|----------|------------------|--------------|--------|
| 1 | Login dengan data valid | Input email & password benar | Redirect ke dashboard | Redirect ke dashboard | ✅ Pass |
| 2 | Login dengan data invalid | Input password salah | Tampil pesan error | Tampil pesan error | ✅ Pass |
| 3 | Buat pesanan baru | Isi form pesanan lengkap | Pesanan tersimpan | Pesanan tersimpan | ✅ Pass |
| 4 | Update status pesanan | Ubah status dari DRAFT | Status berubah | Status berubah | ✅ Pass |
| 5 | Catat pembayaran | Input nominal pembayaran | Saldo ter-update | Saldo ter-update | ✅ Pass |
| 6 | Tambah stok | Catat penerimaan SPBE | Stok bertambah | Stok bertambah | ✅ Pass |
| 7 | Export PDF | Klik tombol download | File PDF terunduh | File PDF terunduh | ✅ Pass |
| 8 | Akses pangkalan lain | Login sebagai Pangkalan A, akses data B | Tidak bisa akses | Tidak bisa akses | ✅ Pass |

#### 4.5.2 Ringkasan Pengujian

| Kategori | Jumlah Test | Pass | Fail | Persentase |
|----------|-------------|------|------|------------|
| Autentikasi | 5 | 5 | 0 | 100% |
| Manajemen Pesanan | 8 | 8 | 0 | 100% |
| Pembayaran | 5 | 5 | 0 | 100% |
| Stok | 6 | 6 | 0 | 100% |
| Laporan | 4 | 4 | 0 | 100% |
| **Total** | **28** | **28** | **0** | **100%** |

### 4.6 Pembahasan

Berdasarkan hasil implementasi dan pengujian, sistem SIM4LON berhasil memenuhi kebutuhan yang telah diidentifikasi:

1. **Integrasi Proses Bisnis** - Pesanan, stok, pembayaran, dan laporan terintegrasi dalam satu platform
2. **Akurasi Data** - Pencatatan digital mengurangi human error
3. **Real-time Tracking** - Status pesanan bisa dipantau kapan saja
4. **Multi-tenant** - Setiap pangkalan hanya akses data miliknya
5. **Responsive Design** - Bisa diakses dari desktop maupun mobile

**Kelebihan Sistem:**
- Teknologi modern (React + NestJS + PostgreSQL)
- Dokumentasi lengkap (49 diagram UML)
- Cloud-ready deployment
- Role-based access control

**Keterbatasan Sistem:**
- Belum memiliki rate limiting
- Backup database masih manual
- Belum ada mode offline

---

## 5. KESIMPULAN DAN SARAN

### 5.1 Kesimpulan

Berdasarkan hasil penelitian yang telah dilakukan, dapat disimpulkan:

1. **Sistem SIM4LON berhasil dirancang** menggunakan pendekatan UML dengan 18 use case, 22 class, dan 23 tabel database yang komprehensif.

2. **Implementasi sistem berbasis web** menggunakan React (frontend) dan NestJS (backend) dengan PostgreSQL sebagai database berhasil dilakukan dan telah di-deploy ke cloud (Vercel + Railway).

3. **Pengujian black-box** menunjukkan bahwa seluruh fungsionalitas (28 test case) berjalan sesuai spesifikasi dengan tingkat keberhasilan 100%.

4. Sistem ini dapat **meningkatkan efisiensi operasional** agen LPG melalui integrasi proses pencatatan, pelacakan real-time, dan otomatisasi laporan.

### 5.2 Saran

Untuk pengembangan lebih lanjut, disarankan:

1. **Menambahkan rate limiting** dan CAPTCHA untuk keamanan
2. **Mengimplementasikan backup otomatis** database
3. **Mengembangkan unit testing** untuk memastikan stabilitas kode
4. **Membuat mobile native app** (Android/iOS) untuk kemudahan akses
5. **Menambahkan fitur notifikasi push** untuk update status real-time
6. **Integrasi dengan sistem Pertamina** untuk sinkronisasi data

---

## DAFTAR PUSTAKA

Laudon, K. C., & Laudon, J. P. (2020). *Management Information Systems: Managing the Digital Firm* (16th ed.). Pearson.

NestJS Documentation. (2023). *NestJS - A progressive Node.js framework*. https://docs.nestjs.com

O'Brien, J. A., & Marakas, G. M. (2017). *Management Information Systems* (10th ed.). McGraw-Hill.

Pertamina. (2023). *Laporan Tahunan PT Pertamina (Persero)*. Jakarta.

PostgreSQL Documentation. (2023). *PostgreSQL: The World's Most Advanced Open Source Relational Database*. https://www.postgresql.org/docs

Pratama, A. (2022). Sistem Informasi Penjualan LPG Berbasis Web. *Jurnal Teknologi Informasi*, 8(2), 45-56.

React Documentation. (2023). *React: A JavaScript library for building user interfaces*. https://react.dev

Rumbaugh, J., Jacobson, I., & Booch, G. (2004). *Unified Modeling Language Reference Manual* (2nd ed.). Addison-Wesley.

---

## LAMPIRAN

### Lampiran A: Use Case Diagram
*(Gambar Use Case Diagram)*

### Lampiran B: Class Diagram
*(Gambar Class Diagram)*

### Lampiran C: ERD
*(Gambar Entity Relationship Diagram)*

### Lampiran D: Screenshot Aplikasi
*(Screenshot halaman-halaman utama)*

### Lampiran E: Kode Program Terpilih
*(Potongan kode backend dan frontend)*

---

*Jurnal ini ditulis sebagai bagian dari Tugas Akhir*  
*Program Studi Teknik Informatika*  
*Universitas Suryakancana*  
*© 2024*
