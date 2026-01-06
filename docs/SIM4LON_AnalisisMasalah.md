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

Kebutuhan non-fungsional adalah kebutuhan yang berkaitan dengan kualitas sistem, bukan fungsi spesifik.

#### a. Kebutuhan Pengguna

| Kode | Kebutuhan | Deskripsi |
|------|-----------|-----------|
| KNF-01 | **Admin** | Admin dapat melakukan mengatur dan mengelola seluruh data pesanan, stok, pangkalan, driver, pembayaran, dan laporan. Admin memiliki akses penuh ke semua fitur sistem. |
| KNF-02 | **Operator** | Operator dapat melakukan proses operasional harian seperti mencatat pesanan, update status, dan monitoring stok, namun tidak dapat mengakses fitur administratif seperti manajemen pengguna. |
| KNF-03 | **Pangkalan** | Pangkalan dapat melakukan akses terbatas untuk melihat stok di agen, melihat riwayat transaksi, dan mengelola penjualan di tingkat pangkalan. |

#### b. Kebutuhan Sistem

| Kode | Aspek | Kebutuhan |
|------|-------|-----------|
| KNF-S01 | **Performa** | Sistem harus mampu merespons dalam waktu kurang dari 3 detik untuk operasi normal |
| KNF-S02 | **Ketersediaan** | Sistem harus tersedia 24/7 dengan uptime minimal 99% |
| KNF-S03 | **Keamanan** | Sistem harus mengimplementasikan autentikasi JWT dan enkripsi password |
| KNF-S04 | **Skalabilitas** | Sistem harus mampu menangani pertumbuhan data dan pengguna |
| KNF-S05 | **Kompatibilitas** | Sistem harus dapat diakses dari browser modern (Chrome, Firefox, Safari, Edge) |
| KNF-S06 | **Responsivitas** | Sistem harus responsive dan dapat diakses dari perangkat mobile |
| KNF-S07 | **Backup** | Sistem harus memiliki mekanisme backup data secara berkala |

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
