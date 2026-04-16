# Analisis Masalah dan Kebutuhan Sistem SIM4LON

> **Catatan**: Dokumen ini berisi hasil analisis masalah dan kebutuhan sistem berdasarkan hasil studi lapangan di PT Mitra Surya Natasya.

---

## 3.1.2 Analisis Masalah

Berdasarkan hasil wawancara dengan 4 narasumber (Kepala Operasional, Petugas Gudang, Sopir Agen, dan Pangkalan), terdapat beberapa masalah utama dalam proses distribusi LPG yang perlu dianalisis lebih lanjut untuk memahami penyebab dan dampaknya:

### 1. Pencatatan Pesanan yang Tidak Terstruktur

Proses pemesanan LPG dari pangkalan ke agen masih dilakukan melalui WhatsApp atau telepon. Hal ini dapat disebabkan oleh kurangnya sistem informasi terintegrasi yang dapat menangani pemesanan secara terpusat. Pencatatan pesanan dilakukan secara manual di buku harian, Excel, atau bahkan hanya mengandalkan ingatan. Sehingga, proses pencatatan menjadi tidak konsisten dan rawan terhadap human error. Dampaknya adalah **pesanan sering terlewat, tertukar antar pangkalan, atau lupa dicatat sama sekali**, yang pada akhirnya menurunkan kepercayaan pangkalan terhadap layanan agen.

### 2. Monitoring Stok yang Tidak Real-Time

Petugas gudang mengalami kesulitan dalam memantau stok tabung secara akurat. Pencatatan keluar masuk tabung masih dilakukan secara manual di buku dan dilaporkan ke admin. Hal ini menyebabkan **data stok sering tidak akurat**, terutama untuk tabung kosong yang dikembalikan dan tabung rusak. Petugas gudang sering tidak sempat melakukan validasi stok karena sibuk dengan aktivitas bongkar muat. Dampaknya adalah **keputusan refill ke SPBE sering terlambat** karena tidak ada alert dini ketika stok menipis.

### 3. Miskomunikasi dalam Koordinasi Operasional

Koordinasi antara admin, sopir, dan pangkalan masih bergantung pada komunikasi manual melalui telepon atau WhatsApp. Sopir agen tidak memiliki visibilitas terhadap jadwal pengambilan pangkalan, dan pangkalan tidak mengetahui kondisi stok di agen secara real-time. Hal ini menyebabkan **jadwal sering bentrok, pangkalan datang saat stok kosong, atau sopir tidak tahu kapan harus refill ke SPBE**. Dampaknya adalah **antrean panjang**, **waktu tunggu yang tidak perlu**, dan **efisiensi operasional yang rendah**.

### 4. Kesalahan Data Transaksi dan Pembayaran

Pencatatan pembayaran dari pangkalan masih dilakukan secara manual. Pembayaran dapat dilakukan melalui transfer atau tunai, dan admin harus mengecek history transfer secara manual lalu mencatatnya di Excel. Hal ini menyebabkan **rekonsiliasi pembayaran menjadi sulit**, terutama ketika volume transaksi tinggi. Dampaknya adalah **data hutang pangkalan sering tidak akurat**, yang dapat menimbulkan konflik dengan pangkalan.

### 5. Tidak Ada Riwayat Transaksi yang Terdokumentasi

Pangkalan tidak memiliki akses untuk melihat riwayat pesanan dan transaksi mereka. Pencatatan di sisi pangkalan hanya dilakukan di note HP. Hal ini menyebabkan **kedua pihak sulit memverifikasi transaksi historis** jika terjadi dispute. Dampaknya adalah **kurangnya transparansi** dalam hubungan bisnis antara agen dan pangkalan.

### 6. Tidak Ada Laporan untuk Analisis Bisnis

    Semua data tersebar di berbagai tempat (buku, Excel, ingatan) tanpa ada sistem yang mengkonsolidasikan data tersebut menjadi laporan yang bermakna. Hal ini menyebabkan **manajemen kesulitan menganalisis performa bisnis**, seperti tren penjualan, produk terlaris, atau pangkalan dengan transaksi tertinggi. Dampaknya adalah **pengambilan keputusan bisnis tidak berbasis data**.

---

### Tabel Ringkasan Analisis Masalah

| No | Masalah | Penyebab | Dampak |
|----|---------|----------|--------|
| 1. | Pencatatan pesanan tidak terstruktur | Tidak ada sistem terintegrasi, pencatatan manual | Pesanan terlewat, tertukar, kepercayaan menurun |
| 2. | Monitoring stok tidak real-time | Pencatatan manual, validasi tidak rutin | Stok tidak akurat, refill terlambat |
| 3. | Miskomunikasi koordinasi | Komunikasi via WA/telepon, tidak ada visibilitas | Jadwal bentrok, antrean panjang, efisiensi rendah |
| 4. | Kesalahan data transaksi | Rekonsiliasi manual, volume tinggi | Hutang tidak akurat, konflik dengan pangkalan |
| 5. | Tidak ada riwayat terdokumentasi | Pencatatan informal (note HP) | Sulit verifikasi, kurang transparansi |
| 6. | Tidak ada laporan bisnis | Data tersebar, tidak terkonsolidasi | Keputusan tidak berbasis data |

---

## 3.1.3 Analisis Kebutuhan

Berdasarkan analisis masalah di atas, dapat diidentifikasi kebutuhan sistem yang harus dipenuhi oleh SIM4LON. Kebutuhan ini dikelompokkan menjadi kebutuhan fungsional dan non-fungsional.

---

### 3.1.3.1 Kebutuhan Fungsional

Kebutuhan fungsional adalah kebutuhan yang berkaitan langsung dengan fungsi atau fitur yang harus disediakan oleh sistem.

#### a. Kebutuhan Fungsional Admin/Operator

| Kode | Kebutuhan | Deskripsi |
|------|-----------|-----------|
| KF-01 | Membuat antarmuka pengguna yang responsif dan mudah diakses | Sistem menyediakan dashboard yang menampilkan ringkasan stok, pesanan hari ini, dan statistik penting |
| KF-02 | Sistem menyediakan formulir pemesanan online | Fitur untuk membuat pesanan baru dengan pilihan pangkalan, produk LPG, dan jumlah |
| KF-03 | Fitur untuk mengunggah dan menyimpan dokumen pesanan secara online | Sistem dapat menyimpan detail pesanan dan menghasilkan nota pembayaran |
| KF-04 | Adanya daftar pesanan dengan filter dan pencarian | Sistem menyediakan tabel pesanan yang dapat difilter berdasarkan status, tanggal, dan pangkalan |
| KF-05 | Sistem bisa memperbarui status pesanan | Admin dapat mengubah status pesanan (DRAFT, DIPROSES, SIAP, DIKIRIM, SELESAI) |
| KF-06 | Adanya validasi data yang dapat dilakukan oleh admin | Sistem memvalidasi input seperti jumlah tabung, ketersediaan stok, dan data pangkalan |
| KF-07 | Adanya halaman khusus untuk memantau stok | Dashboard stok yang menampilkan stok isi, kosong, dan rusak per kategori LPG |
| KF-08 | Sistem dapat mencatat penerimaan tabung dari SPBE | Form untuk mencatat tabung masuk dengan detail jumlah, kategori, dan tanggal |
| KF-09 | Sistem dapat mencatat penyaluran tabung ke pangkalan | Form untuk mencatat tabung keluar dengan referensi ke pesanan terkait |
| KF-10 | Sistem memungkinkan admin untuk mengatur jadwal | Fitur perencanaan untuk mengatur jadwal pengambilan dan refill |
| KF-11 | Sistem memungkinkan admin untuk mencatat pembayaran | Form untuk mencatat pembayaran tunai/transfer dengan bukti |
| KF-12 | Sistem memungkinkan admin untuk membuat laporan secara otomatis | Generasi laporan penjualan, stok, dan keuangan dengan filter periode |
| KF-13 | Sistem dapat mengekspor laporan ke Excel/PDF | Fitur export untuk keperluan dokumentasi dan audit |
| KF-14 | Sistem dapat mengelola data pangkalan | CRUD data pangkalan termasuk profil, alamat, dan kontak |
| KF-15 | Sistem dapat mengelola data driver | CRUD data sopir untuk keperluan tracking pengiriman |
| KF-16 | Sistem dapat mengelola data pengguna | Manajemen user dengan role-based access control |
| KF-17 | Sistem menyediakan Voice Order dengan AI | Input pesanan menggunakan suara yang diproses oleh Google Gemini AI |

#### b. Kebutuhan Fungsional Pangkalan

| Kode | Kebutuhan | Deskripsi |
|------|-----------|-----------|
| KF-P01 | Pangkalan dapat melihat stok tersedia di agen | Dashboard yang menampilkan stok LPG yang tersedia untuk dipesan |
| KF-P02 | Pangkalan dapat melihat riwayat pesanan | Daftar pesanan historis dengan detail status dan pembayaran |
| KF-P03 | Pangkalan dapat mencatat penjualan ke konsumen | Form untuk mencatat penjualan eceran dari pangkalan |
| KF-P04 | Pangkalan dapat melihat status hutang | Dashboard yang menampilkan hutang ke agen dan history pembayaran |
| KF-P05 | Pangkalan dapat mengelola data konsumen tetap | CRUD data pelanggan tetap pangkalan |
| KF-P06 | Pangkalan dapat melihat laporan penjualan sendiri | Laporan penjualan pangkalan per periode |

---

### 3.1.3.2 Kebutuhan Non-Fungsional

Analisis kebutuhan non-fungsional menggambarkan kebutuhan yang diperlukan untuk menjalankan sistem yang dibangun. Analisis kebutuhan non-fungsional dilakukan untuk mengetahui spesifikasi kebutuhan untuk sistem. Spesifikasi kebutuhan melibatkan analisis perangkat keras (*hardware*), analisis perangkat lunak (*software*), serta analisis pengguna (*user*).

#### a. Analisis Perangkat Keras

Dalam menjalankan aplikasi SIM4LON dibutuhkannya perangkat keras sehingga sistem yang dibangun dapat berjalan dengan baik dan sesuai kebutuhan tanpa adanya kendala. Kebutuhan spesifikasi perangkat keras dibagi menjadi spesifikasi untuk pengembang dan spesifikasi minimum untuk pengguna.

**Tabel 3.3 Spesifikasi Perangkat Keras Pengembang Aplikasi**

| No | Perangkat | Spesifikasi |
|----|-----------|-------------|
| 1. | Laptop | ASUS ROG Strix G513RC |
| 2. | Processor | AMD Ryzen 7 6800H with Radeon Graphics |
| 3. | RAM | 32 GB DDR5 |
| 4. | Storage | Micron 2450 NVMe SSD 512 GB |
| 5. | Sistem Operasi | Windows 11 |
| 6. | Koneksi Internet | Stabil minimal 10 Mbps |

**Tabel 3.4 Spesifikasi Perangkat Keras Minimum Pengguna (PC/Laptop)**

| No | Perangkat | Spesifikasi |
|----|-----------|-------------|
| 1. | Processor | Intel Core i3 / AMD Ryzen 3 atau setara |
| 2. | RAM | Minimal 4 GB |
| 3. | Storage | Minimal 1 GB ruang kosong |
| 4. | Layar | Resolusi minimal 1366 x 768 piksel |
| 5. | Koneksi Internet | Stabil minimal 5 Mbps |

**Tabel 3.5 Spesifikasi Perangkat Keras Minimum Pengguna (Smartphone/Tablet)**

| No | Perangkat | Spesifikasi |
|----|-----------|-------------|
| 1. | Processor | Qualcomm Snapdragon 600 series / MediaTek Helio atau setara |
| 2. | RAM | Minimal 3 GB |
| 3. | Storage | Minimal 500 MB ruang kosong |
| 4. | Layar | Resolusi minimal 720 x 1280 piksel (HD) |
| 5. | Koneksi Internet | Stabil minimal 3 Mbps (4G/WiFi) |

#### b. Analisis Perangkat Lunak

Perangkat lunak yang dibutuhkan untuk mendukung aplikasi yang akan dibangun adalah sebagai berikut:

**Tabel 3.5 Perangkat Lunak Pengembangan Aplikasi**

| No | Perangkat | Keterangan |
|----|-----------|------------|
| 1. | Windows 10/11 atau macOS | Sistem operasi untuk development |
| 2. | Visual Studio Code | IDE untuk pengembangan kode |
| 3. | Node.js v20+ | Runtime JavaScript untuk backend |
| 4. | PostgreSQL 15 | Database relasional |
| 5. | Git | Version control system |
| 6. | PlantUML | Tool untuk membuat diagram UML |
| 7. | Balsamiq Mockup | Tool untuk membuat wireframe UI |
| 8. | Browser (Chrome/Firefox) | Untuk testing aplikasi |

**Tabel 3.6 Perangkat Lunak Pengguna**

| No | Perangkat | Keterangan |
|----|-----------|------------|
| 1. | Browser | Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari |
| 2. | Sistem Operasi | Windows, Linux, macOS, Android, iOS |

#### c. Analisis Pengguna

Analisis pengguna menunjukkan siapa saja yang nanti akan terlibat dalam aplikasi SIM4LON, serta hak akses apa saja yang ada dalam perangkat lunak tersebut. Aplikasi yang dibangun ini memiliki tiga pengguna yaitu:

1. **Admin**, yaitu pengguna dengan hak akses tertinggi yang bertanggung jawab atas pengelolaan seluruh data sistem. Admin dapat melakukan manajemen pengguna, manajemen pangkalan, manajemen driver, konfigurasi sistem, serta memiliki akses penuh ke semua fitur termasuk laporan dan log aktivitas. Admin berperan sebagai administrator yang memastikan sistem berjalan dengan baik dan data terjaga integritasnya.

2. **Operator**, yaitu staff operasional yang bertugas untuk menjalankan aktivitas harian di agen LPG. Operator dapat melakukan pencatatan pesanan, update status pesanan, assign driver, pencatatan pembayaran, monitoring stok, dan pembuatan laporan. Namun, operator tidak memiliki akses ke fitur administratif seperti manajemen pengguna dan pengaturan sistem. Peran operator sangat penting dalam membantu kelancaran operasional distribusi LPG.

3. **Pangkalan**, yaitu pemilik atau pengelola pangkalan LPG yang menjadi mitra agen. Pangkalan memiliki akses terbatas yang hanya dapat melihat stok tersedia di agen, melihat riwayat pesanan milik sendiri, mencatat penjualan ke konsumen akhir, mengelola data konsumen tetap, dan melihat laporan penjualan pangkalan sendiri. Implementasi multi-tenant memastikan setiap pangkalan hanya dapat mengakses data miliknya sendiri.

---

## 3.1.4 Solusi yang Diusulkan

Berdasarkan analisis masalah dan kebutuhan di atas, solusi yang diusulkan adalah pembangunan **Sistem Informasi Manajemen untuk Agen LPG (SIM4LON)**. Sistem ini dirancang sebagai aplikasi berbasis web yang dapat diakses melalui browser modern dari berbagai perangkat, baik desktop maupun mobile, sehingga memudahkan akses bagi semua pengguna tanpa perlu instalasi aplikasi tambahan.

Arsitektur sistem yang digunakan adalah **client-server** dengan komunikasi melalui **REST API**. Pendekatan ini memisahkan antara tampilan pengguna (frontend) dan logika bisnis (backend), sehingga memudahkan pengembangan, pemeliharaan, dan skalabilitas sistem di masa depan. Dengan arsitektur ini, frontend dan backend dapat dikembangkan secara independen dan di-deploy ke server yang berbeda.

Untuk pengembangan **frontend**, digunakan kombinasi teknologi modern yaitu **Astro** sebagai static site generator, **React** sebagai library untuk membangun user interface yang interaktif, **TypeScript** untuk type safety dan maintainability kode, serta **Tailwind CSS** untuk styling yang konsisten dan responsive. Pemilihan teknologi ini memungkinkan pembuatan antarmuka pengguna yang cepat, modern, dan mudah digunakan.

Pada sisi **backend**, sistem dibangun menggunakan **NestJS**, sebuah framework Node.js yang mengadopsi arsitektur modular dan mendukung TypeScript secara native. Database yang digunakan adalah **PostgreSQL**, sebuah sistem manajemen database relasional yang handal dan mendukung fitur-fitur enterprise. Untuk mempermudah interaksi dengan database, digunakan **Prisma ORM** yang menyediakan type-safe database access dan memudahkan pengelolaan schema database.

Salah satu keunggulan SIM4LON adalah integrasi dengan **Google Gemini 2.0 Flash**, sebuah model AI multimodal yang digunakan untuk fitur **Voice Order**. Fitur ini memungkinkan pengguna untuk membuat pesanan menggunakan perintah suara dalam Bahasa Indonesia, yang kemudian diproses oleh AI untuk mengekstrak informasi pesanan secara otomatis. Integrasi AI ini meningkatkan efisiensi operasional dan mengurangi waktu input data secara signifikan.

Untuk **hosting** dan deployment, frontend di-deploy ke **Vercel**, platform cloud yang menyediakan edge network global untuk performa optimal. Sementara backend dan database di-deploy ke **Railway**, platform cloud modern yang menyediakan managed infrastructure dengan kemudahan konfigurasi dan monitoring.

Dengan kombinasi teknologi dan arsitektur di atas, SIM4LON memiliki beberapa keunggulan utama. Pertama, sistem ini **terintegrasi** sehingga semua data terpusat dalam satu platform dan dapat diakses oleh semua pihak yang berkepentingan. Kedua, sistem menyediakan **monitoring real-time** untuk stok dan status pesanan, menghilangkan kebutuhan komunikasi manual. Ketiga, sistem mendukung **multi-role access** yang memberikan akses berbeda sesuai kebutuhan setiap pengguna (Admin, Operator, Pangkalan). Keempat, antarmuka yang **modern dan intuitif** memudahkan pengguna dalam mengoperasikan sistem. Terakhir, fitur **Voice Order berbasis AI** menjadikan proses input pesanan lebih cepat dan efisien.

---
