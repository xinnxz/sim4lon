# 3.4 Hasil Kerja Praktek

Pada bagian ini membahas mengenai penjelasan hasil baik dari produk maupun rancangan, pengujian dan dokumentasi implementasi yang berhubungan dengan pelaksanaan kerja praktek yang dilaksanakan di PT Mitra Surya Natasya.

---

## 3.4.1 Implementasi

Merupakan suatu proses representatif dari analisis dan perancangan menjadi suatu sistem atau penjelasan program dengan bahasa pemrograman html, css, javascript, tailwind css, dan jsx. Tahapan implementasi dapat diterapkan jika sistem perangkat lunak dan perangkat kerasnya telah dipersiapkan. Kegiatan implementasi sistem ini meliputi, kebutuhan-kebutuhan perangkat keras, perangkat lunak, arsitektur pengguna, implementasi antarmuka dan *source code*.

---

### A. Kebutuhan Perangkat Keras

Aplikasi SIM4LON merupakan aplikasi berbasis web yang bersifat *responsive*, sehingga dapat diakses melalui berbagai perangkat baik desktop maupun mobile. Berikut ini merupakan spesifikasi minimum perangkat keras yang dibutuhkan untuk menjalankan aplikasi SIM4LON:

**Tabel 3.7 Spesifikasi Perangkat Keras Minimum (Desktop/Laptop)**

| No | Perangkat | Spesifikasi Minimum |
|----|-----------|---------------------|
| 1. | Processor | Intel Core i3 / AMD Ryzen 3 atau setara |
| 2. | RAM | Minimal 4 GB |
| 3. | Storage | Minimal 1 GB ruang kosong |
| 4. | Display | Resolusi minimal 1366 x 768 piksel |
| 5. | Browser | Google Chrome 90+, Mozilla Firefox 85+, Microsoft Edge 90+, atau Safari 14+ |
| 6. | Koneksi Internet | Stabil minimal 5 Mbps |

**Tabel 3.8 Spesifikasi Perangkat Keras Minimum (Smartphone/Tablet)**

| No | Perangkat | Spesifikasi Minimum |
|----|-----------|---------------------|
| 1. | Processor | Qualcomm Snapdragon 600 series / MediaTek Helio atau setara |
| 2. | RAM | Minimal 3 GB |
| 3. | Storage | Minimal 500 MB ruang kosong |
| 4. | Display | Resolusi minimal 720 x 1280 piksel (HD) |
| 5. | Browser | Google Chrome Mobile, Safari Mobile, atau browser bawaan |
| 6. | Koneksi Internet | Stabil minimal 3 Mbps (4G/WiFi) |

---

### B. Kebutuhan Perangkat Lunak

Berikut ini merupakan spesifikasi perangkat lunak yang dibutuhkan untuk menjalankan aplikasi SIM4LON:

1. **Sistem Operasi** - Windows 10/11, macOS, Linux, Android, atau iOS
2. **Browser** - Google Chrome versi 90 atau lebih baru, Mozilla Firefox versi 85 atau lebih baru, Microsoft Edge versi 90 atau lebih baru, atau Safari versi 14 atau lebih baru
3. **JavaScript** - Browser harus mengaktifkan JavaScript untuk menjalankan aplikasi
4. **Koneksi Internet** - Koneksi internet yang stabil untuk mengakses server aplikasi

Sedangkan untuk pengembangan aplikasi SIM4LON, digunakan perangkat lunak sebagai berikut:

1. **Windows 11** (versi 23H2) - Sistem operasi untuk pengembangan
2. **Visual Studio Code** (versi 1.96) - IDE/Code Editor untuk menulis kode program
3. **Node.js** (versi 24.11.1) - JavaScript runtime untuk menjalankan backend
4. **PostgreSQL** (versi 15) - Database relasional untuk penyimpanan data
5. **Git** (versi 2.52.0) - Version control system untuk manajemen kode
6. **PlantUML** - Tool untuk membuat diagram UML
7. **Balsamiq Mockup** (versi 4.7) - Tool untuk membuat wireframe UI
8. **Google Chrome** (versi 131) - Browser untuk testing aplikasi
9. **Prisma ORM** (versi 6.2.1) - Object-Relational Mapping untuk akses database
10. **Astro** (versi 5.0.0) - Frontend framework dengan Islands Architecture
11. **NestJS** (versi 11.0.1) - Backend framework berbasis Node.js
12. **Tailwind CSS** (versi 3.4.17) - CSS framework untuk styling

---

### C. Tampilan Antarmuka

Berikut ini merupakan tampilan antarmuka dari Aplikasi SIM4LON berbasis web yang telah diimplementasikan:

---

#### 1. Tampilan Halaman Login

![Gambar 3.1 Tampilan Halaman Login](figures/login.png)

**Keterangan:** Halaman login merupakan halaman awal yang ditampilkan kepada pengguna sebelum dapat mengakses sistem. Pengguna memasukkan email dan password untuk melakukan autentikasi. Sistem menggunakan JWT (*JSON Web Token*) untuk keamanan dan single-session login untuk mencegah akses ganda.

---

#### 2. Tampilan Halaman Dashboard Admin

![Gambar 3.2 Tampilan Halaman Dashboard Admin](figures/dashboard-admin.png)

**Keterangan:** Halaman utama yang dapat diakses oleh *user* internal, yaitu Admin dan Operator. Dashboard menampilkan ringkasan statistik meliputi total pesanan, status pembayaran, ringkasan stok, dan grafik penjualan. Terdapat juga alert untuk stok yang menipis.

---

#### 3. Tampilan Halaman Buat Pesanan

![Gambar 3.3 Tampilan Halaman Buat Pesanan](figures/buat-pesanan.png)

**Keterangan:** Halaman untuk membuat pesanan baru. Dilengkapi dengan fitur **Voice Order** yang memungkinkan pengguna memesan menggunakan perintah suara dalam Bahasa Indonesia. Sistem menggunakan Google Gemini 2.0 Flash untuk memproses perintah suara.

---

#### 4. Tampilan Halaman Daftar Pesanan

![Gambar 3.4 Tampilan Halaman Daftar Pesanan](figures/daftar-pesanan.png)

**Keterangan:** Halaman yang menampilkan seluruh daftar pesanan dalam bentuk tabel dengan fitur filter, search, dan pagination. Setiap pesanan menampilkan informasi status, pangkalan, total, dan tanggal pesanan.

---

#### 5. Tampilan Halaman Detail Pesanan

![Gambar 3.5 Tampilan Halaman Detail Pesanan](figures/detail-pesanan.png)

**Keterangan:** Halaman yang menampilkan informasi lengkap dari sebuah pesanan, termasuk timeline status, item pesanan, informasi pangkalan, informasi driver, dan riwayat pembayaran.

---

#### 6. Tampilan Halaman Ringkasan Stok

![Gambar 3.6 Tampilan Halaman Ringkasan Stok](figures/ringkasan-stok.png)

**Keterangan:** Halaman dashboard stok yang menampilkan ringkasan ketersediaan tabung LPG per kategori (3kg, 12kg, 50kg). Dilengkapi dengan indikator warning untuk stok yang mendekati level kritis.

---

#### 7. Tampilan Halaman Penerimaan Stok

![Gambar 3.7 Tampilan Halaman Penerimaan Stok](figures/penerimaan.png)

**Keterangan:** Halaman untuk mencatat penerimaan tabung LPG dari SPBE (Stasiun Pengisian Bahan Bakar Elpiji). Mencatat nomor SO, nomor LO, tanggal, dan jumlah tabung yang diterima.

---

#### 8. Tampilan Halaman Penyaluran

![Gambar 3.8 Tampilan Halaman Penyaluran](figures/penyaluran.png)

**Keterangan:** Halaman untuk mencatat penyaluran tabung LPG ke pangkalan. Mencatat pangkalan tujuan, jenis tabung, jumlah, dan tanggal penyaluran.

---

#### 9. Tampilan Halaman In-Out Agen

![Gambar 3.9 Tampilan Halaman In-Out Agen](figures/in-out-agen.png)

**Keterangan:** Halaman monitoring pergerakan stok harian yang menampilkan tabung masuk dan keluar. Berguna untuk rekonsiliasi stok harian.

---

#### 10. Tampilan Halaman Daftar Pangkalan

![Gambar 3.10 Tampilan Halaman Daftar Pangkalan](figures/daftar-pangkalan.png)

**Keterangan:** Halaman yang menampilkan seluruh data pangkalan mitra dalam bentuk tabel. Admin dapat melakukan CRUD (Create, Read, Update, Delete) data pangkalan.

---

#### 11. Tampilan Halaman Detail Pangkalan

![Gambar 3.11 Tampilan Halaman Detail Pangkalan](figures/detail-pangkalan.png)

**Keterangan:** Halaman yang menampilkan informasi lengkap pangkalan termasuk data pemilik, alamat, alokasi bulanan, dan riwayat pesanan.

---

#### 12. Tampilan Halaman Daftar Driver

![Gambar 3.12 Tampilan Halaman Daftar Driver](figures/daftar-driver.png)

**Keterangan:** Halaman yang menampilkan data sopir pengiriman. Menampilkan nama, nomor telepon, nomor kendaraan, dan status ketersediaan.

---

#### 13. Tampilan Halaman Daftar Pengguna

![Gambar 3.13 Tampilan Halaman Daftar Pengguna](figures/daftar-pengguna.png)

**Keterangan:** Halaman manajemen pengguna yang hanya dapat diakses oleh Admin. Menampilkan daftar user dengan role masing-masing (Admin, Operator, Pangkalan).

---

#### 14. Tampilan Halaman Catat Pembayaran

![Gambar 3.14 Tampilan Halaman Catat Pembayaran](figures/catat-pembayaran.png)

**Keterangan:** Halaman untuk mencatat pembayaran dari pangkalan. Mendukung pembayaran tunai dan transfer dengan opsi upload bukti pembayaran.

---

#### 15. Tampilan Halaman Nota Pembayaran

![Gambar 3.15 Tampilan Halaman Nota Pembayaran](figures/nota-pembayaran.png)

**Keterangan:** Halaman preview invoice/nota yang siap cetak. Menampilkan detail pesanan, item, harga, pajak, dan total pembayaran.

---

#### 16. Tampilan Halaman Laporan

![Gambar 3.16 Tampilan Halaman Laporan](figures/laporan.png)

**Keterangan:** Halaman dashboard laporan dengan berbagai filter (tanggal, kategori, pangkalan). Mendukung export ke format Excel dan PDF.

---

#### 17. Tampilan Halaman Pengaturan

![Gambar 3.17 Tampilan Halaman Pengaturan](figures/pengaturan.png)

**Keterangan:** Halaman konfigurasi sistem yang hanya dapat diakses oleh Admin. Mengatur profil perusahaan, tarif PPN, prefix invoice, dan pengaturan lainnya.

---

#### 18. Tampilan Halaman Dashboard Pangkalan

![Gambar 3.18 Tampilan Halaman Dashboard Pangkalan](figures/dashboard-pangkalan.png)

**Keterangan:** Halaman utama untuk pengguna dengan role Pangkalan. Menampilkan ringkasan stok di agen, pesanan terbaru, dan status hutang.

---

#### 19. Tampilan Halaman Penjualan Pangkalan

![Gambar 3.19 Tampilan Halaman Penjualan Pangkalan](figures/penjualan-pangkalan.png)

**Keterangan:** Halaman untuk mencatat penjualan tabung LPG ke konsumen akhir. Pangkalan dapat memilih konsumen terdaftar atau konsumen baru.

---

#### 20. Tampilan Halaman Konsumen

![Gambar 3.20 Tampilan Halaman Konsumen](figures/konsumen.png)

**Keterangan:** Halaman manajemen data konsumen tetap pangkalan. Mencatat NIK, Kartu Keluarga, alamat, dan tipe konsumen (Rumah Tangga/Warung).

---

## 3.4.2 Pengujian Sistem

Pengujian sistem dilakukan untuk memastikan bahwa aplikasi SIM4LON berfungsi sesuai dengan kebutuhan yang telah didefinisikan. Pengujian dilakukan menggunakan metode *Black Box Testing* yang fokus pada fungsionalitas sistem tanpa melihat struktur internal kode.

### A. Pengujian Fungsionalitas

**Tabel 3.9 Hasil Pengujian Black Box - Modul Autentikasi**

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil | Status |
|----|--------------------|-----------|-----------------------|-------|--------|
| 1. | Login dengan data valid | Email: admin@sim4lon.co.id, Password: admin123 | Berhasil login, redirect ke dashboard | Sesuai | ✅ Berhasil |
| 2. | Login dengan password salah | Email: admin@sim4lon.co.id, Password: salah | Menampilkan pesan error | Sesuai | ✅ Berhasil |
| 3. | Login dengan email tidak terdaftar | Email: random@email.com | Menampilkan pesan error | Sesuai | ✅ Berhasil |
| 4. | Logout | Klik tombol logout | Berhasil logout, redirect ke login | Sesuai | ✅ Berhasil |

**Tabel 3.10 Hasil Pengujian Black Box - Modul Pesanan**

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil | Status |
|----|--------------------|-----------|-----------------------|-------|--------|
| 1. | Buat pesanan baru | Pilih pangkalan, tambah item, submit | Pesanan tersimpan dengan status DRAFT | Sesuai | ✅ Berhasil |
| 2. | Buat pesanan dengan Voice Order | Ucapkan "Pangkalan Maju Jaya pesan 50 tabung 3kg" | Form terisi otomatis | Sesuai | ✅ Berhasil |
| 3. | Update status pesanan | Ubah status dari DRAFT ke DIPROSES | Status berubah, timeline terupdate | Sesuai | ✅ Berhasil |
| 4. | Assign driver | Pilih driver untuk pesanan | Driver terassign ke pesanan | Sesuai | ✅ Berhasil |
| 5. | Filter pesanan | Filter berdasarkan status dan tanggal | Menampilkan pesanan sesuai filter | Sesuai | ✅ Berhasil |

**Tabel 3.11 Hasil Pengujian Black Box - Modul Stok**

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil | Status |
|----|--------------------|-----------|-----------------------|-------|--------|
| 1. | Catat penerimaan stok | Input data penerimaan dari SPBE | Stok bertambah, history tercatat | Sesuai | ✅ Berhasil |
| 2. | Catat penyaluran | Input penyaluran ke pangkalan | Stok berkurang, penyaluran tercatat | Sesuai | ✅ Berhasil |
| 3. | Lihat ringkasan stok | Buka halaman ringkasan stok | Menampilkan stok per kategori | Sesuai | ✅ Berhasil |
| 4. | Alert stok menipis | Stok di bawah warning level | Menampilkan notifikasi warning | Sesuai | ✅ Berhasil |

**Tabel 3.12 Hasil Pengujian Black Box - Modul Pembayaran**

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil | Status |
|----|--------------------|-----------|-----------------------|-------|--------|
| 1. | Catat pembayaran DP | Input pembayaran sebagian | Status menjadi PARTIAL, is_dp = true | Sesuai | ✅ Berhasil |
| 2. | Catat pelunasan | Input sisa pembayaran | Status menjadi PAID, is_paid = true | Sesuai | ✅ Berhasil |
| 3. | Upload bukti transfer | Upload gambar bukti transfer | File terupload, URL tersimpan | Sesuai | ✅ Berhasil |
| 4. | Cetak nota | Klik tombol cetak nota | Invoice tergenerate, siap print | Sesuai | ✅ Berhasil |

---

### B. Hasil Pengujian

Berdasarkan hasil pengujian yang telah dilakukan, dapat disimpulkan bahwa:

1. **Seluruh fitur berfungsi dengan baik** sesuai dengan kebutuhan yang telah didefinisikan.
2. **Validasi input** berjalan dengan benar, menampilkan pesan error yang sesuai.
3. **Integrasi antar modul** berjalan lancar tanpa konflik.
4. **Fitur Voice Order** berhasil memproses perintah suara dengan akurasi tinggi.
5. **Responsivitas** aplikasi baik, dapat diakses dari desktop maupun mobile.

---

## 3.4.3 Kesimpulan Hasil Kerja Praktek

Berdasarkan hasil implementasi dan pengujian yang telah dilakukan, dapat disimpulkan bahwa Sistem Informasi Manajemen untuk Agen LPG (SIM4LON) telah berhasil dikembangkan dengan fitur-fitur utama sebagai berikut:

| No | Fitur | Status | Keterangan |
|----|-------|--------|------------|
| 1. | Manajemen Pesanan | ✅ Selesai | CRUD pesanan dengan Voice Order AI |
| 2. | Manajemen Stok | ✅ Selesai | Tracking stok real-time dengan alert |
| 3. | Manajemen Pembayaran | ✅ Selesai | DP, pelunasan, dan cetak nota |
| 4. | Multi-Role Access | ✅ Selesai | Admin, Operator, Pangkalan |
| 5. | Voice Order AI | ✅ Selesai | Integrasi Google Gemini 2.0 Flash |
| 6. | Laporan & Export | ✅ Selesai | Export ke Excel dan PDF |
| 7. | Dashboard Analytics | ✅ Selesai | Statistik dan grafik penjualan |
| 8. | Portal Pangkalan | ✅ Selesai | Fitur SAAS untuk pangkalan |

Sistem ini telah memenuhi seluruh kebutuhan fungsional dan non-fungsional yang teridentifikasi pada tahap analisis, dan siap untuk digunakan dalam operasional bisnis sehari-hari di PT Mitra Surya Natasya.

---
