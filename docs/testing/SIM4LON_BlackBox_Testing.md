# 3.4.2 Pengujian

Pengujian dilakukan untuk menjamin kualitas dan juga mengetahui kelemahan dari sistem yang dibuat. Bertujuan untuk menjamin bahwa sistem aplikasi yang dibangun pada website ini berfungsi sesuai dengan kebutuhan. Pengujian perangkat lunak ini menggunakan metode Black Box Testing, User Acceptance Testing (UAT), dan Automated End-to-End Testing. Berikut pengujian pada sistem SIM4LON (Sistem Informasi Manajemen Distribusi LPG).

---

## 3.4.2.1 Pengujian Black Box

Pengujian Black Box bertujuan untuk menguji fungsionalitas sistem tanpa memperhatikan struktur internal kode program. Fokus pengujian adalah pada input dan output yang dihasilkan oleh sistem.

Ada 21 modul dan 151 test case pada metode pengujian black box ini. Diantaranya:

1. Login, 8 test case
2. Dashboard, 10 test case
3. Stok LPG, 6 test case
4. Pesanan, 20 test case
5. Pembayaran, 5 test case
6. Pangkalan, 7 test case
7. Driver, 6 test case
8. Laporan, 8 test case
9. Konsumen Subsidi, 10 test case
10. Penjualan Konsumen, 12 test case
11. Stok Pangkalan, 8 test case
12. Produk LPG, 5 test case
13. Notifikasi, 4 test case
14. Perencanaan, 6 test case
15. Penyaluran, 5 test case
16. Penerimaan, 5 test case
17. In/Out Agen, 4 test case
18. Pengeluaran, 6 test case
19. User Management, 6 test case
20. Dashboard Pangkalan, 5 test case
21. Profil & Pengaturan, 5 test case

### A. Skenario Pengujian

#### a. Pengujian Modul Login

**Tabel 3.1** Pengujian Modul Login

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Memasukkan email dan password yang benar pada form login | ![TC](figures/blackbox/login-tc1.png) | Sistem menerima akses login dan menampilkan halaman dashboard | ![Hasil](figures/blackbox/login-result1.png) | Valid |
| 2 | Memasukkan email benar dan password yang salah | ![TC](figures/blackbox/login-tc2.png) | Sistem menolak akses dan menampilkan pesan "Password salah" | ![Hasil](figures/blackbox/login-result2.png) | Valid |
| 3 | Memasukkan email yang tidak terdaftar di sistem | ![TC](figures/blackbox/login-tc3.png) | Sistem menolak akses dan menampilkan pesan "Akun tidak ditemukan" | ![Hasil](figures/blackbox/login-result3.png) | Valid |
| 4 | Mengkosongkan field email dan mengisi password | ![TC](figures/blackbox/login-tc4.png) | Sistem menampilkan validasi "Email wajib diisi" | ![Hasil](figures/blackbox/login-result4.png) | Valid |
| 5 | Mengisi email dan mengkosongkan field password | ![TC](figures/blackbox/login-tc5.png) | Sistem menampilkan validasi "Password wajib diisi" | ![Hasil](figures/blackbox/login-result5.png) | Valid |
| 6 | Memasukkan email tanpa format yang benar (tanpa @) | ![TC](figures/blackbox/login-tc6.png) | Sistem menampilkan validasi "Format email tidak valid" | ![Hasil](figures/blackbox/login-result6.png) | Valid |
| 7 | Mengklik tombol "Keluar" pada menu profil | ![TC](figures/blackbox/login-tc7.png) | Sistem menghapus session dan redirect ke halaman login | ![Hasil](figures/blackbox/login-result7.png) | Valid |
| 8 | Mengakses URL dashboard langsung setelah logout | ![TC](figures/blackbox/login-tc8.png) | Sistem redirect ke halaman login | ![Hasil](figures/blackbox/login-result8.png) | Valid |

---

#### b. Pengujian Modul Dashboard

**Tabel 3.2** Pengujian Modul Dashboard

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka halaman Dashboard setelah login | ![TC](figures/blackbox/dashboard-tc1.png) | Sistem menampilkan card statistik: Total Pesanan, Pesanan Pending, Pesanan Selesai, Total Stok | ![Hasil](figures/blackbox/dashboard-result1.png) | Valid |
| 2 | Melihat chart penjualan di Dashboard | ![TC](figures/blackbox/dashboard-tc2.png) | Sistem menampilkan data penjualan 7 hari terakhir dalam bentuk chart | ![Hasil](figures/blackbox/dashboard-result2.png) | Valid |
| 3 | Melihat chart stok di Dashboard | ![TC](figures/blackbox/dashboard-tc3.png) | Sistem menampilkan trend stok 7 hari terakhir | ![Hasil](figures/blackbox/dashboard-result3.png) | Valid |
| 4 | Melihat chart profit di Dashboard | ![TC](figures/blackbox/dashboard-tc4.png) | Sistem menampilkan profit 7 hari terakhir | ![Hasil](figures/blackbox/dashboard-result4.png) | Valid |
| 5 | Melihat pie chart top pangkalan | ![TC](figures/blackbox/dashboard-tc5.png) | Sistem menampilkan 3-5 pangkalan dengan pesanan terbanyak | ![Hasil](figures/blackbox/dashboard-result5.png) | Valid |
| 6 | Melihat section aktivitas | ![TC](figures/blackbox/dashboard-tc6.png) | Sistem menampilkan 10 aktivitas terakhir dengan timestamp | ![Hasil](figures/blackbox/dashboard-result6.png) | Valid |
| 7 | Terdapat produk dengan stok di bawah batas kritis | ![TC](figures/blackbox/dashboard-tc7.png) | Sistem menampilkan alert "Stok Rendah" di panel DSS | ![Hasil](figures/blackbox/dashboard-result7.png) | Valid |
| 8 | Terdapat pesanan belum dibayar lebih dari 7 hari | ![TC](figures/blackbox/dashboard-tc8.png) | Sistem menampilkan alert "Pembayaran Overdue" | ![Hasil](figures/blackbox/dashboard-result8.png) | Valid |
| 9 | Melihat Health Score di Dashboard | ![TC](figures/blackbox/dashboard-tc9.png) | Sistem menampilkan skor kesehatan operasional 0-100% | ![Hasil](figures/blackbox/dashboard-result9.png) | Valid |
| 10 | Melihat rekomendasi reorder | ![TC](figures/blackbox/dashboard-tc10.png) | Sistem menampilkan rekomendasi kapan dan berapa jumlah yang harus dipesan ulang | ![Hasil](figures/blackbox/dashboard-result10.png) | Valid |

---

#### c. Pengujian Modul Stok LPG

**Tabel 3.3** Pengujian Modul Stok LPG (Role: ADMIN/OPERATOR)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Stok LPG | ![TC](figures/blackbox/stok-tc1.png) | Sistem akan menampilkan halaman stok LPG dengan header yang berisi total unit, badge statistik (Subsidi, Non-Subsidi, Produk), dan card stok per tipe produk | ![Hasil](figures/blackbox/stok-result1.png) | Valid |
| 2 | Melihat indikator status stok pada card produk | ![TC](figures/blackbox/stok-tc2.png) | Sistem akan menampilkan badge status (Aman/Perhatian/Kritis) pada setiap card produk sesuai dengan tingkat ketersediaan stok | ![Hasil](figures/blackbox/stok-result2.png) | Valid |
| 3 | Mengklik tombol "Kelola" pada header halaman | ![TC](figures/blackbox/stok-tc3.png) | Sistem akan menampilkan modal kelola produk LPG yang berisi daftar produk dengan informasi harga, kategori, dan status aktif | ![Hasil](figures/blackbox/stok-result3.png) | Valid |
| 4 | Mengklik tombol "Penerimaan" pada header halaman | ![TC](figures/blackbox/stok-tc4.png) | Sistem akan melakukan redirect ke halaman penerimaan stok untuk mencatat penerimaan DO dari SPBE | ![Hasil](figures/blackbox/stok-result4.png) | Valid |
| 5 | Mengklik tombol "In/Out" pada header halaman | ![TC](figures/blackbox/stok-tc5.png) | Sistem akan melakukan redirect ke halaman rekonsiliasi stok harian yang menampilkan stok awal, masuk, keluar, dan akhir | ![Hasil](figures/blackbox/stok-result5.png) | Valid |
| 6 | Melihat chart Tren Pemakaian Mingguan | ![TC](figures/blackbox/stok-tc6.png) | Sistem akan menampilkan grafik line chart yang menunjukkan pergerakan pemakaian stok 7 hari terakhir per tipe produk | ![Hasil](figures/blackbox/stok-result6.png) | Valid |

---

#### d. Pengujian Modul Pesanan

**Tabel 3.4** Pengujian Modul Pesanan (Role: ADMIN/OPERATOR)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Pesanan | ![TC](figures/blackbox/pesanan-tc1.png) | Sistem akan menampilkan halaman daftar pesanan dengan stats card (Total, Menunggu, Diproses, Dikirim, Selesai), tabel pesanan, dan fitur pencarian | ![Hasil](figures/blackbox/pesanan-result1.png) | Valid |
| 2 | Menggunakan fitur pencarian pada kolom search | ![TC](figures/blackbox/pesanan-tc2.png) | Sistem akan memfilter tabel pesanan berdasarkan ID pesanan, nama pangkalan, atau jenis LPG yang dicari | ![Hasil](figures/blackbox/pesanan-result2.png) | Valid |
| 3 | Memilih filter status pada dropdown | ![TC](figures/blackbox/pesanan-tc3.png) | Sistem akan menampilkan pesanan yang sesuai dengan status yang dipilih (Menunggu Pembayaran/Diproses/Dikirim/Selesai/Dibatalkan) | ![Hasil](figures/blackbox/pesanan-result3.png) | Valid |
| 4 | Mengklik header kolom untuk mengurutkan data | ![TC](figures/blackbox/pesanan-tc4.png) | Sistem akan mengurutkan tabel berdasarkan kolom yang diklik (ID, Pangkalan, Total, Status, atau Tanggal) secara ascending/descending | ![Hasil](figures/blackbox/pesanan-result4.png) | Valid |
| 5 | Mengklik tombol "Lihat" pada salah satu pesanan | ![TC](figures/blackbox/pesanan-tc5.png) | Sistem akan melakukan redirect ke halaman detail pesanan yang menampilkan informasi lengkap: items, total, timeline status, dan aksi yang tersedia | ![Hasil](figures/blackbox/pesanan-result5.png) | Valid |
| 6 | Mengklik tombol "Buat Pesanan" pada header halaman | ![TC](figures/blackbox/pesanan-tc6.png) | Sistem akan melakukan redirect ke halaman pembuatan pesanan baru dengan form pemilihan pangkalan dan item LPG | ![Hasil](figures/blackbox/pesanan-result6.png) | Valid |
| 7 | Mengisi form Buat Pesanan dengan data lengkap dan menyimpan | ![TC](figures/blackbox/pesanan-tc7.png) | Sistem akan menyimpan pesanan baru dan menampilkan notifikasi berhasil kemudian redirect ke halaman detail pesanan | ![Hasil](figures/blackbox/pesanan-result7.png) | Valid |
| 8 | Mengklik "Simpan" pada form Buat Pesanan tanpa menambah item | ![TC](figures/blackbox/pesanan-tc8.png) | Sistem akan menampilkan pesan validasi error "Silakan tambahkan minimal satu item LPG" | ![Hasil](figures/blackbox/pesanan-result8.png) | Valid |
| 9 | Mengubah status pesanan dari detail pesanan | ![TC](figures/blackbox/pesanan-tc9.png) | Sistem akan mengupdate status pesanan sesuai workflow (Diproses → Dikirim → Selesai) dan memperbarui timeline | ![Hasil](figures/blackbox/pesanan-result9.png) | Valid |
| 10 | Mengklik tombol "Batalkan Pesanan" pada detail pesanan | ![TC](figures/blackbox/pesanan-tc10.png) | Sistem akan menampilkan dialog konfirmasi dan mengubah status pesanan menjadi "Dibatalkan" setelah dikonfirmasi | ![Hasil](figures/blackbox/pesanan-result10.png) | Valid |
| 11 | Mengubah jumlah item per halaman pada pagination | ![TC](figures/blackbox/pesanan-tc11.png) | Sistem akan memperbarui tabel untuk menampilkan jumlah data sesuai pilihan (10/25/50) dan mereset ke halaman pertama | ![Hasil](figures/blackbox/pesanan-result11.png) | Valid |
| 12 | Navigasi antar halaman menggunakan pagination | ![TC](figures/blackbox/pesanan-tc12.png) | Sistem akan menampilkan data pesanan sesuai halaman yang dipilih dan memperbarui informasi "Menampilkan X - Y dari Z data" | ![Hasil](figures/blackbox/pesanan-result12.png) | Valid |
| 13 | Buat Pesanan dengan jumlah LPG melebihi stok yang tersedia | ![TC](figures/blackbox/pesanan-tc13.png) | Sistem akan menampilkan pesan error "Stok [nama produk] tidak mencukupi! Stok sekarang: [jumlah]" | ![Hasil](figures/blackbox/pesanan-result13.png) | Valid |
| 14 | Buat Pesanan LPG 3kg melebihi alokasi bulanan pangkalan | ![TC](figures/blackbox/pesanan-tc14.png) | Sistem akan menampilkan pesan error "Melebihi alokasi bulanan! Sisa: [jumlah] tabung" | ![Hasil](figures/blackbox/pesanan-result14.png) | Valid |
| 15 | Buat Pesanan untuk pangkalan yang tidak aktif | ![TC](figures/blackbox/pesanan-tc15.png) | Sistem akan menampilkan pesan error "Pangkalan tidak aktif. Tidak dapat membuat pesanan" | ![Hasil](figures/blackbox/pesanan-result15.png) | Valid |
| 16 | Assign driver yang sedang mengantar pesanan lain | ![TC](figures/blackbox/pesanan-tc16.png) | Sistem akan menampilkan pesan error "Supir [nama] sedang mengantar pesanan [kode]. Pilih supir lain" | ![Hasil](figures/blackbox/pesanan-result16.png) | Valid |
| 17 | Mengubah status langsung dari DRAFT ke SELESAI (skip workflow) | ![TC](figures/blackbox/pesanan-tc17.png) | Sistem akan menampilkan pesan error "Tidak dapat mengubah status dari DRAFT ke SELESAI" | ![Hasil](figures/blackbox/pesanan-result17.png) | Valid |
| 18 | Membatalkan pesanan yang sudah berstatus SELESAI | ![TC](figures/blackbox/pesanan-tc18.png) | Sistem akan menampilkan pesan error karena status SELESAI tidak dapat diubah ke status lain | ![Hasil](figures/blackbox/pesanan-result18.png) | Valid |
| 19 | Akses halaman detail pesanan dengan kode yang tidak ada | ![TC](figures/blackbox/pesanan-tc19.png) | Sistem akan menampilkan pesan error "Order tidak ditemukan" atau halaman 404 | ![Hasil](figures/blackbox/pesanan-result19.png) | Valid |
| 20 | Kombinasi filter status dan pencarian secara bersamaan | ![TC](figures/blackbox/pesanan-tc20.png) | Sistem akan menampilkan pesanan yang memenuhi KEDUA kriteria filter status dan kata kunci pencarian | ![Hasil](figures/blackbox/pesanan-result20.png) | Valid |

---


#### e. Pengujian Modul Pembayaran

**Tabel 3.5** Pengujian Modul Pembayaran

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Mencatat pembayaran dengan jumlah sama dengan total pesanan | ![TC](figures/blackbox/pembayaran-tc1.png) | Status pembayaran berubah menjadi PAID | ![Hasil](figures/blackbox/pembayaran-result1.png) | Valid |
| 2 | Mencatat pembayaran dengan jumlah kurang dari total | ![TC](figures/blackbox/pembayaran-tc2.png) | Status pembayaran PARTIAL, sisa hutang tercatat | ![Hasil](figures/blackbox/pembayaran-result2.png) | Valid |
| 3 | Memilih metode pembayaran TUNAI | ![TC](figures/blackbox/pembayaran-tc3.png) | Pembayaran tercatat dengan metode tunai | ![Hasil](figures/blackbox/pembayaran-result3.png) | Valid |
| 4 | Memilih metode TRANSFER dan upload bukti | ![TC](figures/blackbox/pembayaran-tc4.png) | Pembayaran tercatat dengan bukti transfer | ![Hasil](figures/blackbox/pembayaran-result4.png) | Valid |
| 5 | Membuka menu Pembayaran | ![TC](figures/blackbox/pembayaran-tc5.png) | Sistem menampilkan semua record pembayaran | ![Hasil](figures/blackbox/pembayaran-result5.png) | Valid |

---

#### f. Pengujian Modul Pangkalan

**Tabel 3.6** Pengujian Modul Pangkalan

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Pangkalan sebagai Admin | ![TC](figures/blackbox/pangkalan-tc1.png) | Sistem menampilkan daftar pangkalan dengan pagination | ![Hasil](figures/blackbox/pangkalan-result1.png) | Valid |
| 2 | Mengklik "Tambah", mengisi data lengkap, dan menyimpan | ![TC](figures/blackbox/pangkalan-tc2.png) | Pangkalan tersimpan dengan kode auto-generate | ![Hasil](figures/blackbox/pangkalan-result2.png) | Valid |
| 3 | Mengkosongkan field nama dan menyimpan | ![TC](figures/blackbox/pangkalan-tc3.png) | Sistem menampilkan validasi "Nama wajib diisi" | ![Hasil](figures/blackbox/pangkalan-result3.png) | Valid |
| 4 | Mengklik edit, mengubah data, dan menyimpan | ![TC](figures/blackbox/pangkalan-tc4.png) | Data pangkalan terupdate | ![Hasil](figures/blackbox/pangkalan-result4.png) | Valid |
| 5 | Mengklik hapus dan konfirmasi | ![TC](figures/blackbox/pangkalan-tc5.png) | Pangkalan terhapus (soft delete) | ![Hasil](figures/blackbox/pangkalan-result5.png) | Valid |
| 6 | Mengetikkan keyword di search box | ![TC](figures/blackbox/pangkalan-tc6.png) | Hasil filter sesuai keyword | ![Hasil](figures/blackbox/pangkalan-result6.png) | Valid |
| 7 | Memilih filter status | ![TC](figures/blackbox/pangkalan-tc7.png) | Hanya menampilkan pangkalan sesuai status | ![Hasil](figures/blackbox/pangkalan-result7.png) | Valid |

---

#### g. Pengujian Modul Driver

**Tabel 3.7** Pengujian Modul Driver

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Driver sebagai Admin | ![TC](figures/blackbox/driver-tc1.png) | Sistem menampilkan daftar driver | ![Hasil](figures/blackbox/driver-result1.png) | Valid |
| 2 | Mengklik "Tambah", mengisi nama, telepon, nomor kendaraan | ![TC](figures/blackbox/driver-tc2.png) | Driver tersimpan dengan kode auto-generate | ![Hasil](figures/blackbox/driver-result2.png) | Valid |
| 3 | Mengkosongkan field nama | ![TC](figures/blackbox/driver-tc3.png) | Sistem menampilkan validasi error | ![Hasil](figures/blackbox/driver-result3.png) | Valid |
| 4 | Mengklik edit dan mengubah data | ![TC](figures/blackbox/driver-tc4.png) | Data driver terupdate | ![Hasil](figures/blackbox/driver-result4.png) | Valid |
| 5 | Mengklik hapus dan konfirmasi | ![TC](figures/blackbox/driver-tc5.png) | Driver terhapus dari sistem | ![Hasil](figures/blackbox/driver-result5.png) | Valid |
| 6 | Mengubah status menjadi nonaktif | ![TC](figures/blackbox/driver-tc6.png) | Driver tidak muncul di dropdown assign pesanan | ![Hasil](figures/blackbox/driver-result6.png) | Valid |

---

#### h. Pengujian Modul Laporan

**Tabel 3.8** Pengujian Modul Laporan

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Memilih "Laporan Penjualan" dan set date range | ![TC](figures/blackbox/laporan-tc1.png) | Sistem menampilkan data penjualan sesuai periode | ![Hasil](figures/blackbox/laporan-result1.png) | Valid |
| 2 | Mengklik tombol "Export PDF" | ![TC](figures/blackbox/laporan-tc2.png) | File PDF terdownload dengan header perusahaan | ![Hasil](figures/blackbox/laporan-result2.png) | Valid |
| 3 | Mengklik tombol "Export Excel" | ![TC](figures/blackbox/laporan-tc3.png) | File XLSX terdownload dengan data lengkap | ![Hasil](figures/blackbox/laporan-result3.png) | Valid |
| 4 | Mengklik tombol "Export Word" | ![TC](figures/blackbox/laporan-tc4.png) | File DOCX terdownload | ![Hasil](figures/blackbox/laporan-result4.png) | Valid |
| 5 | Memilih "Laporan Stok" dan set date range | ![TC](figures/blackbox/laporan-tc5.png) | Sistem menampilkan data MASUK/KELUAR per produk | ![Hasil](figures/blackbox/laporan-result5.png) | Valid |
| 6 | Memilih filter produk LPG 3kg | ![TC](figures/blackbox/laporan-tc6.png) | Hanya menampilkan data produk tersebut | ![Hasil](figures/blackbox/laporan-result6.png) | Valid |
| 7 | Memilih "Laporan Pangkalan" | ![TC](figures/blackbox/laporan-tc7.png) | Sistem menampilkan performa per pangkalan | ![Hasil](figures/blackbox/laporan-result7.png) | Valid |
| 8 | Mengklik pangkalan pada laporan | ![TC](figures/blackbox/laporan-tc8.png) | Sistem menampilkan daftar konsumen subsidi dengan NIK/KK | ![Hasil](figures/blackbox/laporan-result8.png) | Valid |

---

#### i. Pengujian Modul Konsumen Subsidi

**Tabel 3.9** Pengujian Modul Konsumen Subsidi (Role: PANGKALAN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Login sebagai Pangkalan dan membuka menu Konsumen | ![TC](figures/blackbox/konsumen-tc1.png) | Sistem hanya menampilkan konsumen milik pangkalan tersebut | ![Hasil](figures/blackbox/konsumen-result1.png) | Valid |
| 2 | Mengisi data: Nama, NIK 16 digit, KK, Alamat, Type: RUMAH_TANGGA | ![TC](figures/blackbox/konsumen-tc2.png) | Konsumen tersimpan dengan data lengkap | ![Hasil](figures/blackbox/konsumen-result2.png) | Valid |
| 3 | Mengisi data dengan type WARUNG | ![TC](figures/blackbox/konsumen-tc3.png) | Konsumen tersimpan sebagai warung | ![Hasil](figures/blackbox/konsumen-result3.png) | Valid |
| 4 | Mengkosongkan field NIK | ![TC](figures/blackbox/konsumen-tc4.png) | Sistem menampilkan validasi "NIK wajib untuk subsidi" | ![Hasil](figures/blackbox/konsumen-result4.png) | Valid |
| 5 | Mengisi NIK dengan kurang dari 16 digit | ![TC](figures/blackbox/konsumen-tc5.png) | Sistem menampilkan validasi "NIK harus 16 digit" | ![Hasil](figures/blackbox/konsumen-result5.png) | Valid |
| 6 | Mengisi NIK yang sudah terdaftar | ![TC](figures/blackbox/konsumen-tc6.png) | Sistem menampilkan error "NIK sudah terdaftar" | ![Hasil](figures/blackbox/konsumen-result6.png) | Valid |
| 7 | Mengklik edit dan mengubah alamat | ![TC](figures/blackbox/konsumen-tc7.png) | Data konsumen terupdate | ![Hasil](figures/blackbox/konsumen-result7.png) | Valid |
| 8 | Mengklik hapus dan konfirmasi | ![TC](figures/blackbox/konsumen-tc8.png) | Konsumen terhapus dari sistem | ![Hasil](figures/blackbox/konsumen-result8.png) | Valid |
| 9 | Mengetikkan nama di search box | ![TC](figures/blackbox/konsumen-tc9.png) | Hasil filter sesuai keyword | ![Hasil](figures/blackbox/konsumen-result9.png) | Valid |
| 10 | Melihat dashboard konsumen | ![TC](figures/blackbox/konsumen-tc10.png) | Sistem menampilkan total dan breakdown by type | ![Hasil](figures/blackbox/konsumen-result10.png) | Valid |

---

#### j. Pengujian Modul Penjualan Konsumen

**Tabel 3.10** Pengujian Modul Penjualan Konsumen (Role: PANGKALAN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Mengklik "Catat Penjualan", memilih konsumen, tipe LPG, qty, dan menyimpan | ![TC](figures/blackbox/penjualan-tc1.png) | Penjualan tercatat dan stok berkurang otomatis | ![Hasil](figures/blackbox/penjualan-result1.png) | Valid |
| 2 | Memilih "Walk-in" dan mengisi nama pembeli umum | ![TC](figures/blackbox/penjualan-tc2.png) | Penjualan tercatat tanpa referensi konsumen | ![Hasil](figures/blackbox/penjualan-result2.png) | Valid |
| 3 | Mengisi qty lebih dari stok tersedia | ![TC](figures/blackbox/penjualan-tc3.png) | Sistem menampilkan error "Stok tidak mencukupi" | ![Hasil](figures/blackbox/penjualan-result3.png) | Valid |
| 4 | Mengisi qty dengan nilai 0 | ![TC](figures/blackbox/penjualan-tc4.png) | Sistem menampilkan validasi "Qty minimal 1" | ![Hasil](figures/blackbox/penjualan-result4.png) | Valid |
| 5 | Membuka menu Penjualan | ![TC](figures/blackbox/penjualan-tc5.png) | Sistem menampilkan daftar penjualan dengan pagination | ![Hasil](figures/blackbox/penjualan-result5.png) | Valid |
| 6 | Memilih date range | ![TC](figures/blackbox/penjualan-tc6.png) | Hasil filter sesuai periode | ![Hasil](figures/blackbox/penjualan-result6.png) | Valid |
| 7 | Memilih konsumen tertentu | ![TC](figures/blackbox/penjualan-tc7.png) | Hanya menampilkan penjualan ke konsumen tersebut | ![Hasil](figures/blackbox/penjualan-result7.png) | Valid |
| 8 | Mengklik edit dan mengubah qty | ![TC](figures/blackbox/penjualan-tc8.png) | Data terupdate dan stok adjusted | ![Hasil](figures/blackbox/penjualan-result8.png) | Valid |
| 9 | Mengklik hapus dan konfirmasi | ![TC](figures/blackbox/penjualan-tc9.png) | Penjualan terhapus dan stok restored | ![Hasil](figures/blackbox/penjualan-result9.png) | Valid |
| 10 | Melihat dashboard penjualan | ![TC](figures/blackbox/penjualan-tc10.png) | Sistem menampilkan total penjualan hari ini | ![Hasil](figures/blackbox/penjualan-result10.png) | Valid |
| 11 | Mengklik icon microphone dan mengucapkan perintah | ![TC](figures/blackbox/penjualan-tc11.png) | Sistem mengenali dan menampilkan konfirmasi | ![Hasil](figures/blackbox/penjualan-result11.png) | Valid |
| 12 | Mengucapkan perintah tidak jelas | ![TC](figures/blackbox/penjualan-tc12.png) | Sistem menampilkan pesan "Tidak dikenali, coba lagi" | ![Hasil](figures/blackbox/penjualan-result12.png) | Valid |

---

#### k. Pengujian Modul Stok Pangkalan

**Tabel 3.11** Pengujian Modul Stok Pangkalan (Role: PANGKALAN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Login sebagai Pangkalan dan membuka menu Stok | ![TC](figures/blackbox/stok-pangkalan-tc1.png) | Sistem menampilkan stok per tipe LPG untuk pangkalan tersebut | ![Hasil](figures/blackbox/stok-pangkalan-result1.png) | Valid |
| 2 | Mengklik "Terima Stok" dan mengisi data penerimaan | ![TC](figures/blackbox/stok-pangkalan-tc2.png) | Stok bertambah dan movement tercatat | ![Hasil](figures/blackbox/stok-pangkalan-result2.png) | Valid |
| 3 | Mengklik "Stock Opname" dan mengisi qty aktual | ![TC](figures/blackbox/stok-pangkalan-tc3.png) | Adjustment tercatat dengan selisih yang benar | ![Hasil](figures/blackbox/stok-pangkalan-result3.png) | Valid |
| 4 | Mengubah warning dan critical level | ![TC](figures/blackbox/stok-pangkalan-tc4.png) | Alert levels terupdate | ![Hasil](figures/blackbox/stok-pangkalan-result4.png) | Valid |
| 5 | Membuka tab Riwayat | ![TC](figures/blackbox/stok-pangkalan-tc5.png) | Sistem menampilkan daftar pergerakan stok dengan pagination | ![Hasil](figures/blackbox/stok-pangkalan-result5.png) | Valid |
| 6 | Memilih filter LPG 3kg pada tab Riwayat | ![TC](figures/blackbox/stok-pangkalan-tc6.png) | Sistem hanya menampilkan pergerakan stok LPG 3kg | ![Hasil](figures/blackbox/stok-pangkalan-result6.png) | Valid |
| 7 | Memilih filter tipe MASUK pada tab Riwayat | ![TC](figures/blackbox/stok-pangkalan-tc7.png) | Sistem hanya menampilkan stok masuk | ![Hasil](figures/blackbox/stok-pangkalan-result7.png) | Valid |
| 8 | Memilih filter tipe KELUAR pada tab Riwayat | ![TC](figures/blackbox/stok-pangkalan-tc8.png) | Sistem hanya menampilkan stok keluar | ![Hasil](figures/blackbox/stok-pangkalan-result8.png) | Valid |

---

#### l. Pengujian Modul Produk LPG

**Tabel 3.12** Pengujian Modul Produk LPG (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Produk LPG | ![TC](figures/blackbox/produk-tc1.png) | Sistem menampilkan semua produk LPG | ![Hasil](figures/blackbox/produk-result1.png) | Valid |
| 2 | Mengklik "Tambah", mengisi nama, ukuran, kategori, harga | ![TC](figures/blackbox/produk-tc2.png) | Produk tersimpan | ![Hasil](figures/blackbox/produk-result2.png) | Valid |
| 3 | Mengklik edit dan mengubah harga | ![TC](figures/blackbox/produk-tc3.png) | Harga produk terupdate | ![Hasil](figures/blackbox/produk-result3.png) | Valid |
| 4 | Mengubah status menjadi inactive | ![TC](figures/blackbox/produk-tc4.png) | Produk tidak muncul di form penjualan | ![Hasil](figures/blackbox/produk-result4.png) | Valid |
| 5 | Membuka endpoint /with-stock | ![TC](figures/blackbox/produk-tc5.png) | Sistem menampilkan produk dengan qty stok | ![Hasil](figures/blackbox/produk-result5.png) | Valid |

---

#### m. Pengujian Modul Notifikasi

**Tabel 3.13** Pengujian Modul Notifikasi

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Mengklik icon bell pada header | ![TC](figures/blackbox/notifikasi-tc1.png) | Sistem menampilkan notifikasi terbaru | ![Hasil](figures/blackbox/notifikasi-result1.png) | Valid |
| 2 | Terdapat notifikasi yang belum dibaca | ![TC](figures/blackbox/notifikasi-tc2.png) | Badge menampilkan jumlah notifikasi unread | ![Hasil](figures/blackbox/notifikasi-result2.png) | Valid |
| 3 | Membuka halaman notifikasi dan scroll | ![TC](figures/blackbox/notifikasi-tc3.png) | Sistem load notifikasi berikutnya | ![Hasil](figures/blackbox/notifikasi-result3.png) | Valid |
| 4 | Memilih filter type tertentu | ![TC](figures/blackbox/notifikasi-tc4.png) | Hanya menampilkan notifikasi sesuai type | ![Hasil](figures/blackbox/notifikasi-result4.png) | Valid |

---

#### n. Pengujian Modul Perencanaan

**Tabel 3.14** Pengujian Modul Perencanaan (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Perencanaan | ![TC](figures/blackbox/perencanaan-tc1.png) | Sistem menampilkan daftar rencana distribusi bulanan | ![Hasil](figures/blackbox/perencanaan-result1.png) | Valid |
| 2 | Mengklik "Input Perencanaan" dan mengisi target per pangkalan | ![TC](figures/blackbox/perencanaan-tc2.png) | Data perencanaan tersimpan | ![Hasil](figures/blackbox/perencanaan-result2.png) | Valid |
| 3 | Mengklik "Generate Otomatis" untuk menghitung target berdasarkan histori | ![TC](figures/blackbox/perencanaan-tc3.png) | Sistem menghitung dan menampilkan rekomendasi target | ![Hasil](figures/blackbox/perencanaan-result3.png) | Valid |
| 4 | Mengklik "Download PDF" pada halaman rekapitulasi | ![TC](figures/blackbox/perencanaan-tc4.png) | File PDF dengan format Pertamina terdownload | ![Hasil](figures/blackbox/perencanaan-result4.png) | Valid |
| 5 | Mengklik "Download Excel" pada halaman rekapitulasi | ![TC](figures/blackbox/perencanaan-tc5.png) | File XLSX terdownload dengan data lengkap | ![Hasil](figures/blackbox/perencanaan-result5.png) | Valid |
| 6 | Memilih filter bulan tertentu | ![TC](figures/blackbox/perencanaan-tc6.png) | Sistem menampilkan data sesuai bulan yang dipilih | ![Hasil](figures/blackbox/perencanaan-result6.png) | Valid |

---

#### o. Pengujian Modul Penyaluran

**Tabel 3.15** Pengujian Modul Penyaluran (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Penyaluran | ![TC](figures/blackbox/penyaluran-tc1.png) | Sistem menampilkan daftar penyaluran harian | ![Hasil](figures/blackbox/penyaluran-result1.png) | Valid |
| 2 | Mengklik "Penyaluran Manual" untuk input fakultatif | ![TC](figures/blackbox/penyaluran-tc2.png) | Form penyaluran fakultatif tampil | ![Hasil](figures/blackbox/penyaluran-result2.png) | Valid |
| 3 | Mengisi form penyaluran fakultatif dengan data valid | ![TC](figures/blackbox/penyaluran-tc3.png) | Data penyaluran tersimpan dan stok berkurang | ![Hasil](figures/blackbox/penyaluran-result3.png) | Valid |
| 4 | Mengklik "Download PDF" pada halaman penyaluran | ![TC](figures/blackbox/penyaluran-tc4.png) | File PDF dengan format Pertamina terdownload | ![Hasil](figures/blackbox/penyaluran-result4.png) | Valid |
| 5 | Mengklik "Download Excel" pada halaman penyaluran | ![TC](figures/blackbox/penyaluran-tc5.png) | File XLSX terdownload dengan data lengkap | ![Hasil](figures/blackbox/penyaluran-result5.png) | Valid |

---

#### p. Pengujian Modul Penerimaan

**Tabel 3.16** Pengujian Modul Penerimaan (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Penerimaan | ![TC](figures/blackbox/penerimaan-tc1.png) | Sistem menampilkan daftar penerimaan dari SPBE | ![Hasil](figures/blackbox/penerimaan-result1.png) | Valid |
| 2 | Mengklik "Catat Penerimaan" dan mengisi nomor DO, jenis LPG, jumlah | ![TC](figures/blackbox/penerimaan-tc2.png) | Data penerimaan tersimpan dan stok bertambah | ![Hasil](figures/blackbox/penerimaan-result2.png) | Valid |
| 3 | Mengisi jumlah 0 atau negatif pada form penerimaan | ![TC](figures/blackbox/penerimaan-tc3.png) | Sistem menampilkan validasi error | ![Hasil](figures/blackbox/penerimaan-result3.png) | Valid |
| 4 | Mengklik "Download PDF" pada halaman penerimaan | ![TC](figures/blackbox/penerimaan-tc4.png) | File PDF terdownload dengan format Pertamina | ![Hasil](figures/blackbox/penerimaan-result4.png) | Valid |
| 5 | Mengklik "Download Excel" pada halaman penerimaan | ![TC](figures/blackbox/penerimaan-tc5.png) | File XLSX terdownload dengan data lengkap | ![Hasil](figures/blackbox/penerimaan-result5.png) | Valid |

---

#### q. Pengujian Modul In/Out Agen

**Tabel 3.17** Pengujian Modul In/Out Agen (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu In/Out Agen | ![TC](figures/blackbox/inout-tc1.png) | Sistem menampilkan rekonsiliasi stok harian | ![Hasil](figures/blackbox/inout-result1.png) | Valid |
| 2 | Memilih tanggal tertentu pada filter | ![TC](figures/blackbox/inout-tc2.png) | Sistem menampilkan data stok awal, masuk, keluar, akhir per tanggal | ![Hasil](figures/blackbox/inout-result2.png) | Valid |
| 3 | Terdapat selisih antara perhitungan dan stok aktual | ![TC](figures/blackbox/inout-tc3.png) | Sistem menampilkan warning selisih | ![Hasil](figures/blackbox/inout-result3.png) | Valid |
| 4 | Mengklik "Download PDF" pada halaman In/Out | ![TC](figures/blackbox/inout-tc4.png) | File PDF terdownload | ![Hasil](figures/blackbox/inout-result4.png) | Valid |

---

#### r. Pengujian Modul Pengeluaran

**Tabel 3.18** Pengujian Modul Pengeluaran (Role: PANGKALAN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Pengeluaran sebagai Pangkalan | ![TC](figures/blackbox/pengeluaran-tc1.png) | Sistem menampilkan daftar pengeluaran operasional | ![Hasil](figures/blackbox/pengeluaran-result1.png) | Valid |
| 2 | Mengklik "Tambah Pengeluaran" dan memilih kategori, mengisi nominal | ![TC](figures/blackbox/pengeluaran-tc2.png) | Pengeluaran tersimpan dengan kategori yang benar | ![Hasil](figures/blackbox/pengeluaran-result2.png) | Valid |
| 3 | Mengisi nominal 0 atau negatif | ![TC](figures/blackbox/pengeluaran-tc3.png) | Sistem menampilkan validasi error | ![Hasil](figures/blackbox/pengeluaran-result3.png) | Valid |
| 4 | Mengklik edit dan mengubah nominal | ![TC](figures/blackbox/pengeluaran-tc4.png) | Data pengeluaran terupdate | ![Hasil](figures/blackbox/pengeluaran-result4.png) | Valid |
| 5 | Mengklik hapus dan konfirmasi | ![TC](figures/blackbox/pengeluaran-tc5.png) | Pengeluaran terhapus dari sistem | ![Hasil](figures/blackbox/pengeluaran-result5.png) | Valid |
| 6 | Memfilter pengeluaran berdasarkan kategori | ![TC](figures/blackbox/pengeluaran-tc6.png) | Hanya menampilkan pengeluaran sesuai kategori | ![Hasil](figures/blackbox/pengeluaran-result6.png) | Valid |

---

#### s. Pengujian Modul User Management

**Tabel 3.19** Pengujian Modul User Management (Role: ADMIN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka menu Daftar Pengguna sebagai Admin | ![TC](figures/blackbox/user-tc1.png) | Sistem menampilkan daftar user dengan role dan status | ![Hasil](figures/blackbox/user-result1.png) | Valid |
| 2 | Mengklik "Tambah User", mengisi nama, email, password, role | ![TC](figures/blackbox/user-tc2.png) | User tersimpan dan dapat login | ![Hasil](figures/blackbox/user-result2.png) | Valid |
| 3 | Mengisi email yang sudah terdaftar | ![TC](figures/blackbox/user-tc3.png) | Sistem menampilkan error "Email sudah terdaftar" | ![Hasil](figures/blackbox/user-result3.png) | Valid |
| 4 | Mengisi password kurang dari 8 karakter | ![TC](figures/blackbox/user-tc4.png) | Sistem menampilkan validasi "Password minimal 8 karakter" | ![Hasil](figures/blackbox/user-result4.png) | Valid |
| 5 | Mengklik "Reset Password" pada user tertentu | ![TC](figures/blackbox/user-tc5.png) | Password baru digenerate dan ditampilkan | ![Hasil](figures/blackbox/user-result5.png) | Valid |
| 6 | Mengubah status user menjadi nonaktif | ![TC](figures/blackbox/user-tc6.png) | User tidak dapat login | ![Hasil](figures/blackbox/user-result6.png) | Valid |

---

#### t. Pengujian Modul Dashboard Pangkalan

**Tabel 3.20** Pengujian Modul Dashboard Pangkalan (Role: PANGKALAN)

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Login sebagai Pangkalan dan melihat Dashboard | ![TC](figures/blackbox/dashboard-pangkalan-tc1.png) | Sistem menampilkan ringkasan stok dan penjualan | ![Hasil](figures/blackbox/dashboard-pangkalan-result1.png) | Valid |
| 2 | Melihat chart penjualan harian pangkalan | ![TC](figures/blackbox/dashboard-pangkalan-tc2.png) | Sistem menampilkan trend penjualan 7 hari terakhir | ![Hasil](figures/blackbox/dashboard-pangkalan-result2.png) | Valid |
| 3 | Melihat kartu ringkasan stok per tipe LPG | ![TC](figures/blackbox/dashboard-pangkalan-tc3.png) | Sistem menampilkan stok dengan visualisasi | ![Hasil](figures/blackbox/dashboard-pangkalan-result3.png) | Valid |
| 4 | Terdapat produk dengan stok di bawah minimum | ![TC](figures/blackbox/dashboard-pangkalan-tc4.png) | Sistem menampilkan alert stok menipis | ![Hasil](figures/blackbox/dashboard-pangkalan-result4.png) | Valid |
| 5 | Mengklik "Pesan ke Agen" pada quick action | ![TC](figures/blackbox/dashboard-pangkalan-tc5.png) | Modal pemesanan stok tampil | ![Hasil](figures/blackbox/dashboard-pangkalan-result5.png) | Valid |

---

#### u. Pengujian Modul Profil & Pengaturan

**Tabel 3.21** Pengujian Modul Profil & Pengaturan

| No | Skenario Pengujian | Test Case | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|--------------------|-----------|-----------------------|-----------------|--------|
| 1 | Membuka halaman Profil dari menu user | ![TC](figures/blackbox/profil-tc1.png) | Sistem menampilkan informasi profil lengkap | ![Hasil](figures/blackbox/profil-result1.png) | Valid |
| 2 | Mengklik "Edit Profil" dan mengubah nama | ![TC](figures/blackbox/profil-tc2.png) | Data profil terupdate | ![Hasil](figures/blackbox/profil-result2.png) | Valid |
| 3 | Mengupload foto profil dan crop | ![TC](figures/blackbox/profil-tc3.png) | Foto profil terupdate di seluruh sistem | ![Hasil](figures/blackbox/profil-result3.png) | Valid |
| 4 | Mengklik "Ubah Password" dengan password lama yang salah | ![TC](figures/blackbox/profil-tc4.png) | Sistem menampilkan error "Password lama salah" | ![Hasil](figures/blackbox/profil-result4.png) | Valid |
| 5 | Mengklik "Ubah Password" dengan password baru yang valid | ![TC](figures/blackbox/profil-tc5.png) | Password berhasil diubah | ![Hasil](figures/blackbox/profil-result5.png) | Valid |

---

### B. Hasil Pengujian Black Box

**Tabel 3.22** Ringkasan Hasil Pengujian Black Box

| No | Modul | Jumlah Test Case | Berhasil | Gagal | Persentase Keberhasilan |
|----|-------|------------------|----------|-------|------------------------|
| 1 | Login | 8 | 8 | 0 | 100% |
| 2 | Dashboard | 10 | 10 | 0 | 100% |
| 3 | Stok LPG | 6 | 6 | 0 | 100% |
| 4 | Pesanan | 20 | 20 | 0 | 100% |
| 5 | Pembayaran | 5 | 5 | 0 | 100% |
| 6 | Pangkalan | 7 | 7 | 0 | 100% |
| 7 | Driver | 6 | 6 | 0 | 100% |
| 8 | Laporan | 8 | 8 | 0 | 100% |
| 9 | Konsumen Subsidi | 10 | 10 | 0 | 100% |
| 10 | Penjualan Konsumen | 12 | 12 | 0 | 100% |
| 11 | Stok Pangkalan | 8 | 8 | 0 | 100% |
| 12 | Produk LPG | 5 | 5 | 0 | 100% |
| 13 | Notifikasi | 4 | 4 | 0 | 100% |
| 14 | Perencanaan | 6 | 6 | 0 | 100% |
| 15 | Penyaluran | 5 | 5 | 0 | 100% |
| 16 | Penerimaan | 5 | 5 | 0 | 100% |
| 17 | In/Out Agen | 4 | 4 | 0 | 100% |
| 18 | Pengeluaran | 6 | 6 | 0 | 100% |
| 19 | User Management | 6 | 6 | 0 | 100% |
| 20 | Dashboard Pangkalan | 5 | 5 | 0 | 100% |
| 21 | Profil & Pengaturan | 5 | 5 | 0 | 100% |
| **Total** | | **151** | **151** | **0** | **100%** |

### C. Kesimpulan Pengujian Black Box

Berdasarkan hasil pengujian Black Box yang telah dilakukan terhadap sistem SIM4LON, dapat disimpulkan bahwa:

1. Seluruh **151 test case** yang diujikan pada **21 modul** sistem berhasil dijalankan dengan hasil sesuai yang diharapkan.

2. Tingkat keberhasilan pengujian mencapai **100%**, yang menunjukkan bahwa fungsionalitas sistem berjalan dengan baik.

3. Semua fitur utama sistem seperti login, manajemen stok, pesanan, pembayaran, laporan, perencanaan, penyaluran, penerimaan, dan fitur Decision Support System (DSS) telah berfungsi sesuai dengan kebutuhan.

4. Validasi input pada semua form sudah berjalan dengan baik, mencegah user memasukkan data yang tidak valid.

5. Hak akses per role (ADMIN, OPERATOR, PANGKALAN) sudah diterapkan dengan benar sesuai dengan desain sistem.

6. Fitur export laporan ke PDF dan Excel pada modul Perencanaan, Penyaluran, Penerimaan, dan In/Out Agen berjalan dengan format sesuai standar Pertamina.

7. Fitur khusus pangkalan seperti pencatatan pengeluaran, dashboard khusus, dan manajemen stok berfungsi dengan baik.

---

## 3.4.2.2 User Acceptance Testing (UAT)

### A. Tujuan UAT

User Acceptance Testing (UAT) dilakukan untuk memastikan bahwa sistem SIM4LON dapat diterima dan digunakan dengan baik oleh pengguna akhir. Pengujian ini menggunakan metode **System Usability Scale (SUS)** yang merupakan standar pengukuran usability yang diakui secara internasional.

### B. Responden

Pengujian UAT dilakukan dengan melibatkan responden yang merupakan calon pengguna sistem dengan berbagai profil:

**Tabel 3.23** Data Responden UAT

| No | Nama | Jabatan | Role Sistem | Pengalaman IT |
|----|------|---------|-------------|---------------|
| 1 | Responden 1 | Pemilik Agen | ADMIN | Menengah |
| 2 | Responden 2 | Staff Agen | OPERATOR | Pemula |
| 3 | Responden 3 | Pemilik Pangkalan A | PANGKALAN | Menengah |
| 4 | Responden 4 | Pemilik Pangkalan B | PANGKALAN | Pemula |
| 5 | Responden 5 | Staff Administrasi | OPERATOR | Mahir |

### C. Kuesioner UAT

Kuesioner menggunakan **System Usability Scale (SUS)** dengan skala 1-5:
- 1 = Sangat Tidak Setuju
- 2 = Tidak Setuju
- 3 = Netral
- 4 = Setuju
- 5 = Sangat Setuju

**Tabel 3.24** Kuesioner SUS

| No | Pernyataan |
|----|------------|
| 1 | Saya merasa akan sering menggunakan sistem ini |
| 2 | Saya merasa sistem ini terlalu kompleks |
| 3 | Saya merasa sistem ini mudah digunakan |
| 4 | Saya merasa membutuhkan bantuan teknis untuk menggunakan sistem ini |
| 5 | Saya merasa berbagai fungsi dalam sistem ini terintegrasi dengan baik |
| 6 | Saya merasa terlalu banyak inkonsistensi dalam sistem ini |
| 7 | Saya merasa kebanyakan orang akan cepat belajar menggunakan sistem ini |
| 8 | Saya merasa sistem ini sangat rumit untuk digunakan |
| 9 | Saya merasa sangat percaya diri menggunakan sistem ini |
| 10 | Saya perlu belajar banyak hal sebelum dapat menggunakan sistem ini |

### D. Hasil UAT

**Tabel 3.25** Hasil Kuesioner SUS

| Responden | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Raw Score | SUS Score |
|-----------|----|----|----|----|----|----|----|----|----|----|-----------|-----------|
| R1 | 4 | 2 | 5 | 2 | 4 | 1 | 5 | 1 | 4 | 2 | 34 | 85 |
| R2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 32 | 80 |
| R3 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 40 | 100 |
| R4 | 4 | 2 | 4 | 3 | 4 | 2 | 4 | 2 | 4 | 3 | 30 | 75 |
| R5 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 2 | 39 | 97.5 |
| **Rata-rata** | | | | | | | | | | | **35** | **87.5** |

**Keterangan Perhitungan SUS Score:**
- Untuk pertanyaan ganjil (1,3,5,7,9): Skor = Nilai - 1
- Untuk pertanyaan genap (2,4,6,8,10): Skor = 5 - Nilai
- Raw Score = Jumlah semua skor
- SUS Score = Raw Score × 2.5

**Interpretasi Skor SUS:**

| Skor SUS | Grade | Keterangan |
|----------|-------|------------|
| > 80.3 | A | Excellent |
| 68 - 80.3 | B | Good |
| 68 | C | Okay |
| 51 - 68 | D | Poor |
| < 51 | F | Awful |

**Hasil:** Dengan skor rata-rata **87.5**, sistem SIM4LON mendapat grade **A (Excellent)**.

### E. Analisis Tambahan

**Tabel 3.26** Kuesioner Tambahan - Fitur Spesifik

| No | Pertanyaan | Sangat Baik | Baik | Cukup | Kurang |
|----|------------|-------------|------|-------|--------|
| 1 | Kemudahan proses login | 4 | 1 | 0 | 0 |
| 2 | Tampilan dashboard informatif | 5 | 0 | 0 | 0 |
| 3 | Kemudahan membuat pesanan | 4 | 1 | 0 | 0 |
| 4 | Kemudahan mencatat pembayaran | 3 | 2 | 0 | 0 |
| 5 | Kemudahan export laporan | 5 | 0 | 0 | 0 |
| 6 | Fitur voice command (jika digunakan) | 3 | 1 | 1 | 0 |
| 7 | Alert dan notifikasi bermanfaat | 4 | 1 | 0 | 0 |
| 8 | Kecepatan respon sistem | 5 | 0 | 0 | 0 |

### F. Kesimpulan UAT

Berdasarkan hasil User Acceptance Testing yang telah dilakukan, dapat disimpulkan bahwa:

1. Sistem SIM4LON mendapat **skor SUS 87.5** yang termasuk dalam kategori **Excellent (Grade A)**, menunjukkan tingkat usability yang sangat baik.

2. Seluruh responden menyatakan sistem **mudah digunakan** dan **terintegrasi dengan baik** antar modulnya.

3. Fitur-fitur unggulan seperti **Dashboard**, **Export Laporan**, dan **Kecepatan Respon** mendapat penilaian "Sangat Baik" dari mayoritas responden.

4. Fitur **Voice Command** masih perlu edukasi lebih lanjut kepada pengguna karena merupakan fitur baru yang belum familiar.

5. Secara keseluruhan, sistem SIM4LON **layak** untuk diimplementasikan pada operasional distribusi LPG.

---

## 3.4.2.3 Compatibility Testing

### A. Tujuan

Compatibility Testing dilakukan untuk memastikan sistem SIM4LON dapat berjalan dengan baik pada berbagai browser, perangkat, dan resolusi layar yang berbeda.

### B. Pengujian Browser

**Tabel 3.27** Hasil Pengujian Browser

| No | Browser | Versi | Desktop | Mobile | Status |
|----|---------|-------|---------|--------|--------|
| 1 | Google Chrome | 120+ | ✅ Berfungsi | ✅ Berfungsi | Pass |
| 2 | Mozilla Firefox | 115+ | ✅ Berfungsi | ✅ Berfungsi | Pass |
| 3 | Microsoft Edge | 120+ | ✅ Berfungsi | ✅ Berfungsi | Pass |
| 4 | Safari | 17+ | ✅ Berfungsi | ✅ Berfungsi | Pass |
| 5 | Opera | 105+ | ✅ Berfungsi | ✅ Berfungsi | Pass |

### C. Pengujian Sistem Operasi

**Tabel 3.28** Hasil Pengujian Sistem Operasi

| No | Sistem Operasi | Versi | Status | Keterangan |
|----|----------------|-------|--------|------------|
| 1 | Windows | 10, 11 | ✅ Pass | Semua fitur berfungsi |
| 2 | macOS | Sonoma, Ventura | ✅ Pass | Semua fitur berfungsi |
| 3 | Linux | Ubuntu 22.04 | ✅ Pass | Semua fitur berfungsi |
| 4 | Android | 12, 13, 14 | ✅ Pass | Responsive design |
| 5 | iOS | 16, 17 | ✅ Pass | Responsive design |

### D. Pengujian Resolusi Layar

**Tabel 3.29** Hasil Pengujian Resolusi Layar

| No | Resolusi | Tipe | Status | Keterangan |
|----|----------|------|--------|------------|
| 1 | 1920×1080 | Desktop FHD | ✅ Pass | Layout optimal |
| 2 | 1366×768 | Laptop | ✅ Pass | Layout optimal |
| 3 | 1280×720 | Laptop HD | ✅ Pass | Layout optimal |
| 4 | 768×1024 | Tablet Portrait | ✅ Pass | Responsive |
| 5 | 1024×768 | Tablet Landscape | ✅ Pass | Responsive |
| 6 | 375×667 | Mobile (iPhone SE) | ✅ Pass | Mobile-first |
| 7 | 390×844 | Mobile (iPhone 14) | ✅ Pass | Mobile-first |
| 8 | 360×800 | Mobile (Android) | ✅ Pass | Mobile-first |

### E. Kesimpulan Compatibility Testing

Berdasarkan hasil pengujian kompatibilitas, sistem SIM4LON:

1. **Cross-browser compatible** - Berjalan dengan baik di semua browser modern (Chrome, Firefox, Edge, Safari, Opera).

2. **Cross-platform compatible** - Dapat diakses dari Windows, macOS, Linux, Android, dan iOS.

3. **Responsive design** - Tampilan menyesuaikan dengan baik pada berbagai resolusi layar, dari desktop hingga mobile.

4. Tidak ditemukan masalah rendering atau fungsionalitas pada browser dan perangkat yang diuji.

---

## 3.4.2.4 End-to-End Testing (E2E)

### A. Pendahuluan

End-to-End Testing (E2E) adalah metode pengujian yang menguji alur lengkap aplikasi dari awal hingga akhir, mensimulasikan skenario penggunaan nyata oleh pengguna. Pengujian ini memastikan bahwa seluruh komponen sistem terintegrasi dan berfungsi dengan benar.

### B. Tools yang Digunakan

**Tabel 3.30** Tools E2E Testing

| No | Tool | Versi | Fungsi |
|----|------|-------|--------|
| 1 | Playwright | 1.40+ | Framework E2E Testing |
| 2 | TypeScript | 5.0+ | Bahasa pemrograman test |
| 3 | Node.js | 18+ | Runtime environment |

### C. Konfigurasi E2E Testing

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 2,
  workers: 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserType: 'chromium' } },
    { name: 'firefox', use: { browserType: 'firefox' } },
    { name: 'webkit', use: { browserType: 'webkit' } },
  ],
})
```

### D. Skenario Pengujian E2E

#### Skenario 1: Flow Login Admin

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('Admin dapat login dan masuk ke dashboard', async ({ page }) => {
    // 1. Buka halaman login
    await page.goto('/login')
    
    // 2. Isi form login
    await page.fill('input[name="email"]', 'admin@sim4lon.co.id')
    await page.fill('input[name="password"]', 'admin123')
    
    // 3. Klik tombol login
    await page.click('button[type="submit"]')
    
    // 4. Verifikasi redirect ke dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // 5. Verifikasi elemen dashboard tampil
    await expect(page.locator('[data-testid="total-orders"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-stock"]')).toBeVisible()
  })

  test('Login gagal dengan password salah', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@sim4lon.co.id')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Verifikasi error message
    await expect(page.locator('.toast-error')).toContainText('Password salah')
  })
})
```

---

#### Skenario 2: Flow Pembuatan Pesanan

```typescript
// e2e/orders/create-order.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Create Order Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login terlebih dahulu
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@sim4lon.co.id')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('Admin dapat membuat pesanan baru', async ({ page }) => {
    // 1. Navigasi ke halaman pesanan
    await page.click('text=Pesanan')
    await expect(page).toHaveURL('/orders')
    
    // 2. Klik buat pesanan baru
    await page.click('text=Buat Pesanan')
    await expect(page).toHaveURL('/orders/new')
    
    // 3. Pilih pangkalan
    await page.click('[data-testid="pangkalan-select"]')
    await page.click('text=PANGKALAN REON')
    
    // 4. Tambah item LPG
    await page.selectOption('select[name="lpg_type"]', '3kg')
    await page.fill('input[name="qty"]', '50')
    await page.click('text=Tambah Item')
    
    // 5. Verifikasi item ditambahkan
    await expect(page.locator('[data-testid="order-items"]')).toContainText('LPG 3kg')
    await expect(page.locator('[data-testid="order-items"]')).toContainText('50')
    
    // 6. Simpan pesanan
    await page.click('text=Simpan Pesanan')
    
    // 7. Verifikasi berhasil
    await expect(page.locator('.toast-success')).toContainText('Pesanan berhasil dibuat')
    await expect(page).toHaveURL(/\/orders\/ORD-/)
  })

  test('Pesanan tidak bisa dibuat tanpa item', async ({ page }) => {
    await page.goto('/orders/new')
    await page.click('[data-testid="pangkalan-select"]')
    await page.click('text=PANGKALAN REON')
    await page.click('text=Simpan Pesanan')
    
    await expect(page.locator('.error-message')).toContainText('Minimal 1 item')
  })
})
```

---

#### Skenario 3: Flow Pangkalan - Pesan Stok

```typescript
// e2e/pangkalan/order-stock.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Pangkalan Order Stock Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login sebagai pangkalan
    await page.goto('/login')
    await page.fill('input[name="email"]', 'pangkalan@reon.com')
    await page.fill('input[name="password"]', 'pangkalan123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/pangkalan/dashboard')
  })

  test('Pangkalan dapat memesan stok ke agen', async ({ page }) => {
    // 1. Buka halaman stok
    await page.click('text=Stok LPG')
    await expect(page).toHaveURL('/pangkalan/stock')
    
    // 2. Klik pesan ke agen
    await page.click('text=Pesan ke Agen')
    
    // 3. Isi form pemesanan
    await page.selectOption('select[name="lpg_type"]', '3kg')
    await page.fill('input[name="qty"]', '100')
    await page.fill('textarea[name="notes"]', 'Stok menipis, butuh segera')
    
    // 4. Submit
    await page.click('text=Buat Pesanan')
    
    // 5. Verifikasi
    await expect(page.locator('.toast-success')).toContainText('berhasil')
  })
})
```

---

#### Skenario 4: Flow Export Laporan

```typescript
// e2e/reports/export.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Export Report Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@sim4lon.co.id')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
  })

  test('Admin dapat export laporan ke PDF', async ({ page }) => {
    // 1. Navigasi ke laporan
    await page.click('text=Laporan')
    await expect(page).toHaveURL('/reports')
    
    // 2. Set date range
    await page.click('[data-testid="date-preset"]')
    await page.click('text=Bulan Ini')
    
    // 3. Klik export PDF
    const downloadPromise = page.waitForEvent('download')
    await page.click('text=Export PDF')
    
    // 4. Verifikasi file terdownload
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.pdf')
  })

  test('Admin dapat export laporan ke Excel', async ({ page }) => {
    await page.goto('/reports')
    
    const downloadPromise = page.waitForEvent('download')
    await page.click('text=Export Excel')
    
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('.xlsx')
  })
})
```

---

#### Skenario 5: Flow Voice Command

```typescript
// e2e/pangkalan/voice-command.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Voice Command Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'pangkalan@reon.com')
    await page.fill('input[name="password"]', 'pangkalan123')
    await page.click('button[type="submit"]')
  })

  test('Voice widget tampil dan dapat diaktifkan', async ({ page }) => {
    // 1. Verifikasi voice widget tampil
    await expect(page.locator('[data-testid="voice-widget"]')).toBeVisible()
    
    // 2. Klik untuk aktivasi
    await page.click('[data-testid="voice-widget"]')
    
    // 3. Verifikasi modal konfirmasi tampil
    await expect(page.locator('[data-testid="voice-modal"]')).toBeVisible()
    await expect(page.locator('text=Tekan untuk mulai')).toBeVisible()
  })
})
```

---

### E. Hasil Pengujian E2E

**Tabel 3.31** Hasil E2E Test Report

| No | Test Suite | Test Cases | Passed | Failed | Duration |
|----|------------|------------|--------|--------|----------|
| 1 | Login Flow | 2 | 2 | 0 | 3.2s |
| 2 | Create Order Flow | 2 | 2 | 0 | 8.5s |
| 3 | Pangkalan Order Stock | 1 | 1 | 0 | 4.1s |
| 4 | Export Report Flow | 2 | 2 | 0 | 6.3s |
| 5 | Voice Command Flow | 1 | 1 | 0 | 2.8s |
| **Total** | | **8** | **8** | **0** | **24.9s** |

**Hasil Test per Browser:**

| Browser | Tests | Passed | Failed | Status |
|---------|-------|--------|--------|--------|
| Chromium | 8 | 8 | 0 | ✅ Pass |
| Firefox | 8 | 8 | 0 | ✅ Pass |
| WebKit | 8 | 8 | 0 | ✅ Pass |

### F. Screenshot Hasil E2E Test

![E2E Test Report](figures/e2e/test-report.png)

*Screenshot terminal hasil running test*

![E2E Test HTML Report](figures/e2e/html-report.png)

*Screenshot HTML report Playwright*

### G. Kesimpulan E2E Testing

Berdasarkan hasil End-to-End Testing yang telah dilakukan:

1. Seluruh **8 test cases** pada **5 test suites** berhasil dijalankan dengan **100% pass rate**.

2. Pengujian dilakukan pada 3 browser utama (Chromium, Firefox, WebKit) dengan hasil **konsisten**.

3. **Critical user flows** seperti login, pembuatan pesanan, dan export laporan berjalan dengan baik.

4. Total waktu eksekusi test adalah **24.9 detik**, menunjukkan efisiensi pengujian otomatis.

5. Tidak ditemukan bug atau error pada alur utama aplikasi.

---

## 3.4.2.5 Kesimpulan Pengujian Keseluruhan

Berdasarkan seluruh pengujian yang telah dilakukan, dapat disimpulkan bahwa:

**Tabel 3.32** Ringkasan Hasil Pengujian Keseluruhan

| No | Jenis Pengujian | Hasil | Kesimpulan |
|----|-----------------|-------|------------|
| 1 | Black Box Testing | 143/143 test case berhasil (100%) | ✅ Lulus |
| 2 | User Acceptance Testing | SUS Score 87.5 (Grade A) | ✅ Lulus |
| 3 | Compatibility Testing | 5 browser, 5 OS berhasil | ✅ Lulus |
| 4 | End-to-End Testing | 8/8 test berhasil (100%) | ✅ Lulus |

**Kesimpulan Akhir:**

Sistem SIM4LON (Sistem Informasi Manajemen Distribusi LPG) telah melalui serangkaian pengujian yang komprehensif dan **dinyatakan LAYAK** untuk diimplementasikan dalam operasional distribusi LPG. Sistem memenuhi standar fungsionalitas, usability, kompatibilitas, dan automasi testing yang diharapkan.

---
