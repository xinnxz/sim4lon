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

Berikut ini merupakan tampilan antarmuka dari Aplikasi SIM4LON berbasis web yang telah diimplementasikan. Tampilan dikelompokkan berdasarkan kategori fitur dan peran pengguna.

---

#### C.1 Login & Autentikasi

##### 1. Tampilan Halaman Login

![Gambar 3.1 Tampilan Halaman Login](figures/login.png)

**Keterangan:** Halaman autentikasi pengguna yang menampilkan form login dengan field email dan password. Desain menggunakan gradasi hijau-kuning yang mencerminkan identitas visual LPG, dengan logo SIM4LON dan mitra kerja (Pertamina, Blue Gaz, PGN) sebagai validasi kredibilitas. Terdapat tombol "Masuk" dan link "Tampilkan Akun Demo" untuk keperluan demonstrasi. Sistem menggunakan JWT untuk keamanan sesi, *single-session login* untuk mencegah akses ganda, dan *password hashing* dengan bcrypt. Halaman ini *fully responsive* dan dapat diakses optimal dari desktop, tablet, maupun smartphone.

##### 2. Tampilan Halaman Error 404

![Gambar 3.2 Tampilan Halaman Error 404](figures/error-404.png)

**Keterangan:** Halaman error yang ditampilkan ketika pengguna mencoba mengakses URL yang tidak valid atau halaman yang tidak ditemukan di sistem. Menampilkan ilustrasi "404" dengan pesan informatif "Halaman tidak ditemukan" dan tombol navigasi untuk kembali ke dashboard. Desain tetap konsisten dengan tema aplikasi untuk memberikan pengalaman pengguna yang baik meskipun terjadi error.

---

#### C.2 Dashboard

##### 3. Tampilan Halaman Dashboard (Agen/Admin)

![Gambar 3.3 Tampilan Halaman Dashboard Agen](figures/dashboard-admin.png)

**Keterangan:** Dashboard utama untuk Admin dan Operator yang berfungsi sebagai pusat monitoring bisnis secara real-time. Halaman ini menampilkan *Key Performance Indicators* (KPI) melalui kartu statistik yang memuat data pesanan aktif, pending pembayaran, dan pembayaran overdue. Grafik penjualan interaktif dapat disesuaikan untuk menampilkan data harian, mingguan, atau bulanan. Ringkasan stok per jenis LPG ditampilkan dengan indikator visual berupa warna warning untuk stok yang mendekati level kritis. Terdapat juga chart distribusi pesanan per pangkalan serta panel rekomendasi dari Decision Support System yang memberikan alert otomatis dan saran aksi operasional. Seluruh komponen menggunakan animasi smooth dan desain *glassmorphism* yang modern.

##### 4. Tampilan Halaman Dashboard (Pangkalan)

![Gambar 3.4 Tampilan Halaman Dashboard Pangkalan](figures/dashboard-pangkalan.png)

**Keterangan:** Dashboard khusus untuk pengguna dengan role Pangkalan yang menyajikan informasi relevan untuk operasional harian. Halaman ini menampilkan kartu ringkasan stok LPG yang dimiliki lengkap dengan alert ketika stok menipis. Daftar pengiriman masuk yang membutuhkan konfirmasi penerimaan ditampilkan secara real-time, disertai status hutang atau piutang terhadap agen. Grafik penjualan harian membantu monitoring performa, sementara quick action buttons memudahkan akses ke fitur "Catat Penjualan" dan "Pesan Stok". Halaman ini dilengkapi floating voice widget yang memungkinkan input penjualan melalui perintah suara.

---

#### C.3 Manajemen Pesanan

##### 5. Tampilan Halaman Daftar Pesanan

![Gambar 3.5 Tampilan Halaman Daftar Pesanan](figures/daftar-pesanan.png)

**Keterangan:** Halaman yang menampilkan daftar seluruh pesanan dalam format tabel yang informatif. Setiap baris menampilkan kode pesanan, nama pangkalan, tanggal order, jumlah item, total harga, status, dan tombol aksi. Fitur filter tersedia untuk menyaring pesanan berdasarkan status seperti Draft, Menunggu Pembayaran, Diproses, Dikirim, Selesai, atau Dibatalkan. Pencarian dapat dilakukan berdasarkan kode pesanan maupun nama pangkalan, sementara date range picker memungkinkan filter berdasarkan rentang tanggal tertentu. Sistem pagination memudahkan navigasi data dalam jumlah besar, dan tabel mendukung sorting per kolom untuk fleksibilitas tampilan data.

##### 6. Tampilan Halaman Buat Pesanan

![Gambar 3.6 Tampilan Halaman Buat Pesanan](figures/buat-pesanan.png)

**Keterangan:** Halaman form interaktif untuk membuat pesanan baru dengan alur yang intuitif. Pengguna dapat memilih pangkalan tujuan melalui dropdown dengan fitur pencarian, kemudian menambahkan item produk LPG dengan memilih jenis dan memasukkan jumlah yang diinginkan. Sistem secara otomatis menghitung subtotal dan total pembayaran. Halaman ini dilengkapi fitur unggulan **Voice Order** berbasis AI yang memungkinkan pembuatan pesanan menggunakan perintah suara dalam Bahasa Indonesia. Teknologi Natural Language Processing dari Google Gemini 2.0 Flash digunakan untuk memproses dan menginterpretasikan perintah suara menjadi data pesanan yang akurat.

##### 7. Tampilan Halaman Detail Pesanan

![Gambar 3.7 Tampilan Halaman Detail Pesanan](figures/detail-pesanan.png)

**Keterangan:** Halaman yang menampilkan informasi lengkap satu pesanan secara komprehensif. Bagian header memuat kode pesanan, status dalam bentuk badge berwarna, dan tanggal pemesanan. Data pangkalan ditampilkan meliputi nama, alamat, dan Person in Charge. Tabel item pesanan menyajikan detail produk dengan harga satuan dan subtotal. Ringkasan pembayaran menunjukkan total tagihan, jumlah DP yang sudah dibayar, dan sisa yang harus dilunasi. Informasi driver yang ditugaskan untuk pengiriman serta timeline perubahan status dengan timestamp membantu tracking pesanan. Tersedia aksi untuk mengubah status pesanan, menugaskan driver, membatalkan pesanan, atau mencetak nota. Layout dirancang responsive dengan action buttons yang sticky di tampilan mobile.

##### 8. Tampilan Halaman Catat Pesanan

![Gambar 3.8 Tampilan Halaman Catat Pesanan](figures/catat-pesanan.png)

**Keterangan:** Halaman khusus untuk mencatat pesanan yang diterima via telepon atau offline. Berbeda dengan Buat Pesanan, halaman ini lebih ringkas untuk input cepat oleh operator.

##### 9. Tampilan Halaman Nota/Invoice

![Gambar 3.9 Tampilan Halaman Nota Invoice](figures/nota-invoice.png)

**Keterangan:** Halaman yang menampilkan nota pembayaran dalam format profesional yang siap cetak. Bagian header memuat logo dan informasi lengkap perusahaan, diikuti nomor invoice unik dan tanggal terbit. Data pembeli mencakup nama pangkalan dan alamat lengkap. Tabel item menyajikan detail produk yang dipesan beserta kuantitas, harga satuan, dan subtotal per item. Bagian kalkulasi menampilkan total sebelum pajak, PPN jika berlaku, dan grand total yang harus dibayar. Status pembayaran ditandai dengan label "Lunas" atau "Belum Lunas". Footer menyediakan area untuk tanda tangan dan stempel. Pengguna dapat langsung mencetak via browser, mengunduh dalam format PDF, atau membagikan nota melalui WhatsApp.

##### 10. Tampilan Halaman Catat Penjualan (Pangkalan)

![Gambar 3.10 Tampilan Halaman Catat Penjualan](figures/catat-penjualan.png)

**Keterangan:** Halaman khusus pangkalan untuk mencatat penjualan LPG kepada konsumen akhir. Form penjualan menyediakan field untuk memilih konsumen dari data yang sudah terdaftar atau menambahkan konsumen baru, memilih jenis LPG, memasukkan jumlah tabung, dan menentukan harga jual. Untuk konsumen baru, sistem melakukan validasi format NIK agar sesuai standar 16 digit. Setelah submit berhasil, stok pangkalan secara otomatis berkurang sesuai jumlah yang dijual dan transaksi tercatat dalam laporan penjualan. Halaman ini juga dilengkapi fitur voice input untuk mempercepat proses pencatatan.

---

#### C.4 Manajemen Stok

##### 11. Tampilan Halaman Stok LPG (Agen)

![Gambar 3.11 Tampilan Halaman Stok LPG](figures/stok-lpg.png)

**Keterangan:** Dashboard stok yang menampilkan ringkasan ketersediaan tabung LPG dalam format kartu visual per kategori produk meliputi 3kg, 5.5kg, 12kg, 50kg, dan Bright Gas 220gr. Setiap kartu menampilkan gambar produk, jumlah stok saat ini, level minimum yang ditetapkan, serta progress bar yang menunjukkan persentase ketersediaan. Kartu dengan stok di bawah level warning ditandai dengan warna merah dan animasi pulse untuk menarik perhatian. Tombol "Kelola Produk" tersedia untuk mengelola tipe LPG dan mengatur harga jual. Halaman ini menjadi acuan bagi Decision Support System dalam memberikan alert stok menipis.

##### 12. Tampilan Halaman Stok LPG (Pangkalan)

![Gambar 3.12 Tampilan Halaman Stok Pangkalan](figures/stok-pangkalan.png)

**Keterangan:** Halaman stok khusus untuk pangkalan yang menyajikan informasi stok secara komprehensif. Kartu ringkasan menampilkan jumlah stok per jenis LPG yang dimiliki. Tombol "Pesan Stok" memudahkan pangkalan untuk melakukan order ke agen. Daftar pengiriman masuk yang menunggu konfirmasi penerimaan ditampilkan secara real-time agar tidak ada pengiriman yang terlewat. Riwayat transaksi mencatat semua stok masuk dari agen maupun stok keluar dari penjualan ke konsumen. Setiap transaksi tercatat dengan timestamp dan dapat di-filter berdasarkan rentang tanggal.

---

#### C.5 Perencanaan & Distribusi

##### 13. Tampilan Halaman Perencanaan Rekapitulasi

![Gambar 3.13 Tampilan Halaman Perencanaan Rekap](figures/perencanaan-rekap.png)

**Keterangan:** Halaman rekapitulasi rencana distribusi bulanan yang menampilkan tabel dengan kolom: nama pangkalan, alokasi bulanan, target distribusi, realisasi, sisa, dan status pencapaian. Setiap baris dilengkapi progress bar visual untuk memudahkan monitoring. Status ditampilkan dengan badge warna: hijau (tercapai), kuning (dalam proses), merah (belum tercapai). Dapat di-filter berdasarkan bulan dan di-export ke Excel.

##### 14. Tampilan Halaman Perencanaan Form Input

![Gambar 3.14 Tampilan Halaman Perencanaan Input](figures/perencanaan-input.png)

**Keterangan:** Form input untuk membuat atau mengedit rencana distribusi LPG ke pangkalan dengan dua mode input yang tersedia. Mode Manual memungkinkan pengguna menginput target distribusi per pangkalan satu per satu. Mode Generate Otomatis memanfaatkan kecerdasan sistem untuk menghitung target optimal berdasarkan data historis penjualan tiga bulan terakhir dan kapasitas alokasi yang tersedia. Setelah proses generate selesai, pengguna dapat mereview hasil perhitungan dan melakukan penyesuaian sebelum menyimpan. Data rencana yang tersimpan digunakan sebagai acuan monitoring penyaluran bulanan.

##### 15. Tampilan Halaman Penyaluran

![Gambar 3.15 Tampilan Halaman Penyaluran](figures/penyaluran.png)

**Keterangan:** Halaman yang mencatat seluruh penyaluran stok dari agen ke pangkalan. Tampilan tabel menyajikan informasi tanggal penyaluran, pangkalan tujuan, jenis LPG, jumlah tabung, status pengiriman, dan driver yang bertugas. Sistem mengakomodasi dua jenis penyaluran, yaitu penyaluran berdasarkan pesanan yang tercatat otomatis saat pesanan dikirim, serta penyaluran fakultatif untuk distribusi manual di luar pesanan reguler. Setiap transaksi penyaluran terintegrasi dengan modul stok sehingga stok agen berkurang secara otomatis sesuai jumlah yang disalurkan.

##### 16. Tampilan Halaman Penerimaan

![Gambar 3.16 Tampilan Halaman Penerimaan](figures/penerimaan.png)

**Keterangan:** Halaman untuk mencatat penerimaan stok LPG dari supplier (Pertamina/SPBE). Form input meliputi: tanggal penerimaan, nomor Delivery Order (DO), jenis LPG, jumlah tabung, dan catatan. Setelah disimpan, stok agen otomatis bertambah. Riwayat penerimaan ditampilkan dalam tabel yang dapat difilter berdasarkan tanggal dan jenis LPG. Data ini penting untuk rekonsiliasi stok dan audit.

##### 17. Tampilan Halaman In/Out Agen

![Gambar 3.17 Tampilan Halaman In Out Agen](figures/in-out-agen.png)

**Keterangan:** Halaman log yang mencatat semua pergerakan stok harian agen dalam bentuk laporan rekonsiliasi. Menampilkan per tanggal: stok awal, total penerimaan dari supplier, total penyaluran ke pangkalan, dan stok akhir. Jika terdapat selisih antara perhitungan dan stok aktual, sistem akan menampilkan warning. Halaman ini digunakan untuk audit harian dan memastikan tidak ada kehilangan stok.

---

#### C.6 Manajemen Pangkalan

##### 18. Tampilan Halaman Daftar Pangkalan

![Gambar 3.18 Tampilan Halaman Daftar Pangkalan](figures/daftar-pangkalan.png)

**Keterangan:** Halaman yang menampilkan daftar semua pangkalan terdaftar dalam bentuk tabel dengan kolom: nama, PIC (Person in Charge), alamat, alokasi bulanan, status (aktif/nonaktif), dan aksi. Dilengkapi fitur pencarian berdasarkan nama, filter status, dan pagination. Setiap baris memiliki tombol aksi untuk melihat detail, edit, atau menonaktifkan pangkalan. Kartu summary di bagian atas menampilkan total pangkalan aktif dan total alokasi bulanan.

##### 19. Tampilan Halaman Detail/Edit Pangkalan

![Gambar 3.19 Tampilan Halaman Detail Pangkalan](figures/detail-pangkalan.png)

**Keterangan:** Halaman yang menampilkan informasi lengkap satu pangkalan secara detail. Bagian Data Pangkalan mencakup nama usaha, alamat lengkap, dan koordinat lokasi untuk keperluan pemetaan. Data PIC (Person in Charge) meliputi nama pemilik atau pengelola, nomor telepon, dan email. Data Bisnis menyimpan informasi NPWP dan nomor rekening bank. Bagian Alokasi menunjukkan kuota distribusi bulanan per jenis LPG. Statistik performa menampilkan total pesanan, total revenue, dan rata-rata pembelian. Riwayat sepuluh pesanan terakhir juga ditampilkan untuk referensi cepat. Admin memiliki akses untuk mengedit semua data serta melakukan reset password akun pangkalan melalui halaman ini.

##### 20. Tampilan Halaman Profil Pangkalan

![Gambar 3.20 Tampilan Halaman Profil Pangkalan](figures/profil-pangkalan.png)

**Keterangan:** Halaman profil yang hanya dapat diakses oleh pangkalan untuk melihat data sendiri. Menampilkan: nama pangkalan, nama pemilik, alamat lengkap, nomor telepon, email, NPWP, dan alokasi bulanan yang diberikan agen. Terdapat tombol "Ubah Password" untuk mengganti password akun. Data pada halaman ini bersifat read-only kecuali password, karena perubahan data lain harus melalui agen.

---

#### C.7 Manajemen Pengguna & Driver

##### 21. Tampilan Halaman Daftar Pengguna

![Gambar 3.21 Tampilan Halaman Daftar Pengguna](figures/daftar-pengguna.png)

**Keterangan:** Halaman manajemen user internal sistem yang menampilkan daftar semua akun dengan kolom: nama, email, role (Admin/Operator), status (aktif/nonaktif), tanggal dibuat, dan aksi. Filter tersedia berdasarkan role dan status. Admin dapat melakukan: tambah user baru, edit data user, reset password, atau menonaktifkan akun. User yang dinonaktifkan tidak dapat login namun datanya tetap tersimpan untuk audit.

##### 22. Tampilan Halaman Daftar Driver

![Gambar 3.22 Tampilan Halaman Daftar Driver](figures/daftar-driver.png)

**Keterangan:** Halaman manajemen supir pengiriman yang menampilkan daftar driver dengan informasi: nama, nomor telepon, plat kendaraan, dan status (tersedia/mengantar). Status otomatis berubah menjadi "mengantar" ketika driver ditugaskan ke pesanan dan kembali "tersedia" setelah pesanan selesai. Admin dapat menambah driver baru atau menonaktifkan driver yang sudah tidak bekerja.

---

#### C.8 Laporan

##### 23. Tampilan Halaman Laporan Penjualan (Agen)

![Gambar 3.23 Tampilan Halaman Laporan Penjualan](figures/laporan-penjualan.png)

**Keterangan:** Halaman laporan penjualan komprehensif untuk agen yang menyajikan data bisnis secara visual dan analitis. Kartu summary di bagian atas menampilkan total revenue, jumlah transaksi, dan rata-rata nilai per transaksi. Line chart interaktif memvisualisasikan trend penjualan yang dapat disesuaikan untuk tampilan harian, mingguan, atau bulanan. Pie chart menunjukkan distribusi penjualan per jenis LPG untuk analisis produk. Tabel detail transaksi menyajikan informasi lengkap meliputi tanggal, nama pangkalan, item yang dibeli, total nilai, dan status pembayaran. Filter berdasarkan periode tanggal tersedia untuk analisis spesifik. Laporan mendukung export ke format PDF dan Excel dengan kop perusahaan.

##### 24. Tampilan Halaman Laporan Pangkalan

![Gambar 3.24 Tampilan Halaman Laporan Pangkalan](figures/laporan-pangkalan-tab.png)

**Keterangan:** Halaman laporan yang menampilkan performa setiap pangkalan dalam bentuk tabel ranking. Kolom meliputi: ranking, nama pangkalan, total pesanan, total revenue, rata-rata per pesanan, dan trend (naik/turun). Dapat di-sort berdasarkan kolom manapun. Berguna untuk evaluasi kinerja pangkalan dan pengambilan keputusan alokasi. Chart bar horizontal menampilkan 10 pangkalan teratas.

##### 25. Tampilan Halaman Laporan Stok

![Gambar 3.25 Tampilan Halaman Laporan Stok](figures/laporan-stok.png)

**Keterangan:** Halaman laporan pergerakan stok yang menyajikan analisis inventory secara menyeluruh. Kartu summary menampilkan stok awal periode, total penerimaan masuk, total penyaluran keluar, dan saldo stok akhir. Bar chart memvisualisasikan perbandingan volume masuk versus keluar per jenis LPG untuk identifikasi pola perdagangan. Tabel detail transaksi mencatat setiap pergerakan stok dengan informasi tanggal, tipe transaksi (masuk atau keluar), jenis LPG, jumlah tabung, sumber atau tujuan, dan catatan tambahan. Filter berdasarkan periode dan jenis LPG memudahkan analisis spesifik. Fitur export ke Excel tersedia untuk keperluan rekonsiliasi dan audit.

##### 26. Tampilan Halaman Log Riwayat

![Gambar 3.26 Tampilan Halaman Log Riwayat](figures/log-riwayat.png)

**Keterangan:** Halaman audit trail yang mencatat semua aktivitas penting dalam sistem secara kronologis. Informasi yang tercatat: timestamp, user yang melakukan aksi, tipe aksi (create/update/delete), modul terkait, deskripsi perubahan, dan IP address. Filter tersedia berdasarkan user, tipe aksi, dan rentang tanggal. Halaman ini penting untuk audit keamanan dan pelacakan perubahan data.

##### 27. Tampilan Halaman Laporan Penjualan (Pangkalan)

![Gambar 3.27 Tampilan Halaman Laporan Pangkalan](figures/laporan-penjualan-pangkalan.png)

**Keterangan:** Halaman laporan penjualan khusus untuk pangkalan yang menyajikan data penjualan kepada konsumen akhir. Kartu summary menampilkan total penjualan, jumlah transaksi yang berhasil, dan estimasi profit kotor. Line chart memvisualisasikan trend penjualan harian untuk monitoring performa. Tabel riwayat penjualan mencatat setiap transaksi dengan informasi tanggal, nama konsumen, jenis LPG, jumlah tabung, harga jual per unit, dan total nilai transaksi. Filter berdasarkan periode tersedia untuk analisis jangka waktu tertentu. Laporan mendukung export ke format PDF dan Excel untuk dokumentasi.

---

#### C.9 Pengaturan

##### 28. Tampilan Halaman Pengaturan Profil Perusahaan

![Gambar 3.28 Tampilan Halaman Pengaturan Profil](figures/pengaturan-profil.png)

**Keterangan:** Halaman pengaturan data perusahaan yang hanya dapat diakses oleh Admin. Field yang dapat diedit: nama perusahaan, alamat lengkap, nomor telepon, email, dan upload logo. Data ini akan muncul di header nota/invoice, laporan PDF, dan dokumen resmi lainnya. Perubahan langsung tersimpan dan ter-apply ke seluruh sistem.

##### 29. Tampilan Halaman Pengaturan Tampilan

![Gambar 3.29 Tampilan Halaman Pengaturan Tampilan](figures/pengaturan-tampilan.png)

**Keterangan:** Halaman pengaturan preferensi tampilan yang tersimpan secara individual per user. Opsi tema memungkinkan pemilihan antara Light mode atau Dark mode sesuai kenyamanan visual pengguna. Format tanggal dapat disesuaikan antara format Indonesia (DD/MM/YYYY) atau format internasional (YYYY-MM-DD). Pengaturan bahasa tersedia untuk memilih Bahasa Indonesia atau English jika tersedia. Notifikasi browser dapat diaktifkan atau dinonaktifkan sesuai kebutuhan. Setiap perubahan preferensi langsung ter-apply tanpa memerlukan reload halaman.

##### 30. Tampilan Halaman Pengaturan Aplikasi

![Gambar 3.30 Tampilan Halaman Pengaturan Aplikasi](figures/pengaturan-aplikasi.png)

**Keterangan:** Halaman konfigurasi sistem yang hanya dapat diakses oleh Admin. Pengaturan meliputi: tarif PPN (persen), prefix nomor invoice, batas hari pembayaran overdue, level warning stok minimum, dan parameter sistem lainnya. Perubahan pada halaman ini berdampak global ke seluruh operasional sistem.

---

#### C.10 Profil & Notifikasi

##### 31. Tampilan Halaman Profil Akun

![Gambar 3.31 Tampilan Halaman Profil Akun](figures/profil-akun.png)

**Keterangan:** Halaman yang menampilkan informasi profil pengguna yang sedang login. Meliputi: foto profil (dengan avatar default jika belum diupload), nama lengkap, email, nomor telepon, role (Admin/Operator), tanggal bergabung, dan statistik aktivitas (total login, pesanan dibuat, dll). Terdapat tombol "Edit Profil" dan "Ubah Password" untuk modifikasi data.

##### 32. Tampilan Halaman Edit Profil Akun

![Gambar 3.32 Tampilan Halaman Edit Profil](figures/edit-profil.png)

**Keterangan:** Form untuk mengedit data profil pengguna yang login. Field yang dapat diubah: nama lengkap, email (dengan validasi format), nomor telepon, dan foto profil. Fitur upload foto dilengkapi dengan cropper interaktif untuk memotong dan menyesuaikan ukuran gambar sebelum disimpan. Perubahan memerlukan konfirmasi dan langsung tersimpan ke database.

##### 33. Tampilan Halaman Notifikasi

![Gambar 3.33 Tampilan Halaman Notifikasi](figures/notifikasi.png)

**Keterangan:** Halaman yang menampilkan daftar semua notifikasi sistem dengan fitur filter berdasarkan tipe (pesanan baru, stok menipis, pembayaran overdue, dll). Setiap notifikasi menampilkan: ikon tipe, judul, pesan singkat, waktu, dan status baca. Terdapat tombol "Tandai Semua Dibaca" dan pagination untuk navigasi. Notifikasi yang belum dibaca ditandai dengan background highlight.

---

#### C.11 Fitur Pangkalan Lainnya

##### 34. Tampilan Halaman Penjualan (Pangkalan)

![Gambar 3.34 Tampilan Halaman Penjualan Pangkalan](figures/penjualan-pangkalan.png)

**Keterangan:** Halaman riwayat penjualan konsumen yang dilakukan oleh pangkalan. Menampilkan tabel dengan kolom: tanggal/waktu, nama konsumen, jenis LPG, jumlah, harga satuan, total, dan metode input (manual/voice). Dilengkapi filter berdasarkan rentang tanggal dan pencarian berdasarkan nama konsumen. Setiap transaksi tercatat secara otomatis dari halaman "Catat Penjualan".

##### 35. Tampilan Halaman Konsumen

![Gambar 3.35 Tampilan Halaman Konsumen](figures/konsumen.png)

**Keterangan:** Halaman manajemen data konsumen tetap pangkalan untuk keperluan program LPG bersubsidi. Menampilkan tabel dengan kolom: nama, NIK (16 digit), nomor Kartu Keluarga, alamat, tipe konsumen (Rumah Tangga/Warung/UMKM), dan status verifikasi. Pangkalan dapat menambah konsumen baru dengan validasi NIK agar sesuai format dan tidak duplikat. Data ini terintegrasi dengan form Catat Penjualan.

##### 36. Tampilan Halaman Pengeluaran

![Gambar 3.36 Tampilan Halaman Pengeluaran](figures/pengeluaran.png)

**Keterangan:** Halaman untuk mencatat pengeluaran operasional harian pangkalan. Form input meliputi: tanggal, kategori pengeluaran (sewa tempat, listrik, air, transportasi, gaji karyawan, lain-lain), nominal, dan keterangan. Data ini digunakan dalam laporan keuangan untuk menghitung profit bersih pangkalan (pendapatan - pengeluaran). Riwayat pengeluaran ditampilkan dalam tabel yang dapat difilter per bulan.

---

### D. Tampilan Modal (Dialog)

Selain halaman utama, sistem SIM4LON menggunakan komponen modal untuk interaksi yang lebih fokus. Berikut adalah daftar modal yang dikelompokkan berdasarkan fungsi:

---

#### D.1 Modal Pesanan & Pengiriman

##### 1. Modal Voice Widget

![Gambar 3.37 Modal Voice Widget](figures/modal-voice-widget.png)

**Lokasi:** Global (tombol mic biru floating di pojok kanan bawah)  
**Trigger:** Klik tombol microphone  
**Keterangan:** Widget interaktif berbasis AI untuk membuat pesanan menggunakan perintah suara Bahasa Indonesia. Menampilkan animasi gelombang suara saat listening, hasil transkripsi real-time, dan preview pesanan yang diparsing oleh Google Gemini 2.0 Flash. Setelah parsing, user dapat konfirmasi atau koreksi sebelum submit. Mendukung perintah seperti "Pangkalan X pesan 50 tabung 3kg".

##### 2. Modal Konfirmasi Voice Order

![Gambar 3.38 Modal Konfirmasi Voice](figures/modal-konfirmasi-voice.png)

**Lokasi:** Setelah voice input diproses  
**Keterangan:** Menampilkan hasil parsing perintah suara untuk verifikasi pangkalan, item, dan jumlah sebelum konfirmasi.

##### 3. Modal Pilih Driver

![Gambar 3.39 Modal Pilih Driver](figures/modal-pilih-driver.png)

**Lokasi:** Halaman Detail Pesanan (tombol "Tugaskan Driver")  
**Trigger:** Klik tombol "Tugaskan Driver" ketika pesanan siap kirim  
**Keterangan:** Modal yang menampilkan daftar semua driver dalam bentuk kartu dengan informasi: nama, nomor telepon, plat kendaraan, dan status (tersedia/sibuk). Driver yang sedang mengantar pesanan lain ditandai dengan badge "Sibuk" dan tidak dapat dipilih. Setelah memilih driver, status pesanan otomatis berubah menjadi "Dikirim" dan driver mendapat notifikasi.

##### 4. Modal Batalkan Pesanan

![Gambar 3.40 Modal Batalkan Pesanan](figures/modal-batalkan-pesanan.png)

**Lokasi:** Halaman Detail Pesanan  
**Keterangan:** Konfirmasi pembatalan pesanan dengan input alasan. Stok yang dialokasikan akan dikembalikan.

##### 5. Modal Ranking Pangkalan

![Gambar 3.41 Modal Ranking Pangkalan](figures/modal-ranking-pangkalan.png)

**Lokasi:** Dashboard Agen (chart ranking)  
**Keterangan:** Ranking lengkap semua pangkalan berdasarkan performa dengan data yang dapat di-sort.

---

#### D.2 Modal Manajemen Driver

##### 6. Modal Tambah Driver

![Gambar 3.42 Modal Tambah Driver](figures/modal-tambah-driver.png)

**Lokasi:** Halaman Daftar Driver (tombol "+ Tambah Driver")  
**Trigger:** Klik tombol "+ Tambah Driver"  
**Keterangan:** Form input untuk menambahkan supir baru ke sistem. Field yang harus diisi: nama lengkap, nomor telepon (unik, dengan validasi format Indonesia), nomor plat kendaraan. Setelah tersimpan, driver langsung tersedia untuk dipilih pada pesanan.

##### 7. Modal Hapus Driver

![Gambar 3.43 Modal Hapus Driver](figures/modal-hapus-driver.png)

**Lokasi:** Halaman Daftar Driver  
**Keterangan:** Konfirmasi penghapusan driver dengan warning aksi permanen.

---

#### D.3 Modal Manajemen User

##### 8. Modal Tambah User

![Gambar 3.44 Modal Tambah User](figures/modal-tambah-user.png)

**Lokasi:** Halaman Daftar Pengguna (tombol "+ Tambah User")  
**Trigger:** Klik tombol "+ Tambah User"  
**Keterangan:** Form untuk menambahkan user internal baru ke sistem. Field yang harus diisi: nama lengkap, email (sebagai username login, harus unik), password (minimal 8 karakter dengan validasi kekuatan), dan pilih role (Admin/Operator). Setelah submit, akun langsung aktif dan user dapat login.

##### 9. Modal Edit User

![Gambar 3.45 Modal Edit User](figures/modal-edit-user.png)

**Lokasi:** Halaman Daftar Pengguna (icon edit pada baris user)  
**Trigger:** Klik icon pensil pada baris user yang ingin diedit  
**Keterangan:** Form untuk mengedit data user existing. Field yang dapat diubah: nama lengkap, email, dan role. Password tidak ditampilkan dan hanya bisa di-reset melalui tombol terpisah. Status aktif/nonaktif juga dapat diubah dari modal ini.

##### 10. Modal Hapus User

![Gambar 3.46 Modal Hapus User](figures/modal-hapus-user.png)

**Lokasi:** Halaman Daftar Pengguna (icon hapus pada baris user)  
**Trigger:** Klik icon trash pada baris user yang ingin dihapus  
**Keterangan:** Dialog konfirmasi untuk menghapus akun user secara permanen dari sistem. Menampilkan warning bahwa aksi ini tidak dapat dibatalkan. Sebagai pengaman, user yang sedang login tidak dapat menghapus akunnya sendiri, dan minimal harus ada 1 Admin tersisa di sistem.

##### 11. Modal Nonaktifkan User

![Gambar 3.47 Modal Nonaktifkan User](figures/modal-disable-user.png)

**Lokasi:** Halaman Daftar Pengguna (toggle status pada baris user)  
**Trigger:** Klik toggle switch status aktif/nonaktif  
**Keterangan:** Dialog konfirmasi untuk mengaktifkan atau menonaktifkan akun user. User yang dinonaktifkan tidak dapat login ke sistem namun semua data historisnya (pesanan yang dibuat, log aktivitas) tetap tersimpan. Akun dapat diaktifkan kembali kapan saja.

---

#### D.4 Modal Manajemen Pangkalan

##### 12. Modal Tambah Pangkalan

![Gambar 3.48 Modal Tambah Pangkalan](figures/modal-tambah-pangkalan.png)

**Lokasi:** Halaman Daftar Pangkalan (tombol "+ Tambah Pangkalan")  
**Trigger:** Klik tombol "+ Tambah Pangkalan"  
**Keterangan:** Form registrasi pangkalan baru dengan field lengkap: nama pangkalan, nama PIC (Person in Charge), alamat lengkap, nomor telepon, email, NPWP (opsional), koordinat lokasi (untuk mapping), dan alokasi bulanan per jenis LPG. Setelah submit, sistem otomatis membuat akun login untuk pangkalan dengan password default yang harus diganti.

##### 13. Modal Reset Password Pangkalan

![Gambar 3.49 Modal Reset Password](figures/modal-reset-password.png)

**Lokasi:** Halaman Detail Pangkalan (tombol "Reset Password")  
**Trigger:** Klik tombol "Reset Password"  
**Keterangan:** Modal untuk mereset password akun login pangkalan oleh admin. Admin dapat memilih untuk generate password acak secara otomatis atau memasukkan password baru secara manual. Setelah reset berhasil, password baru akan ditampilkan di modal agar dapat dicatat dan diinformasikan kepada PIC pangkalan. Password lama langsung tidak berlaku dan akan digantikan oleh password baru.

---

#### D.5 Modal Stok & Produk

##### 14. Modal Kelola Produk LPG

![Gambar 3.50 Modal Kelola Produk](figures/modal-kelola-produk.png)

**Lokasi:** Halaman Stok LPG (tombol "Kelola Produk")  
**Trigger:** Klik tombol "Kelola Produk"  
**Keterangan:** Modal untuk mengelola master data produk LPG yang menyajikan daftar lengkap produk dengan informasi gambar, nama produk, harga modal, harga jual, level minimum stok, dan status aktif. Admin dapat menambahkan produk baru lengkap dengan upload gambar, mengedit harga dan parameter existing, serta menonaktifkan produk yang tidak dijual lagi. Setiap perubahan harga langsung ter-apply untuk pesanan baru.

##### 15. Modal Catat Penerimaan

![Gambar 3.51 Modal Catat Penerimaan](figures/modal-catat-penerimaan.png)

**Lokasi:** Halaman Penerimaan (tombol "+ Catat Penerimaan")  
**Trigger:** Klik tombol "+ Catat Penerimaan"  
**Keterangan:** Form untuk mencatat stok masuk dari supplier (Pertamina/SPBE). Field yang harus diisi: tanggal penerimaan, nomor Delivery Order (DO), pilih jenis LPG, jumlah tabung, dan catatan opsional. Setelah submit, stok agen otomatis bertambah sesuai jumlah yang dicatat. Data DO digunakan untuk rekonsiliasi dengan supplier.

##### 16. Modal Penyaluran Fakultatif

![Gambar 3.52 Modal Penyaluran](figures/modal-penyaluran.png)

**Lokasi:** Halaman Penyaluran (tombol "Penyaluran Manual")  
**Trigger:** Klik tombol "Penyaluran Manual"  
**Keterangan:** Form untuk mencatat penyaluran stok di luar pesanan normal (fakultatif). Digunakan untuk kasus khusus seperti: bon langsung, sample, retur dari pangkalan. Field: pilih pangkalan, jenis LPG, jumlah, dan alasan. Transaksi ini memerlukan approval supervisor dan tercatat terpisah dari penyaluran pesanan.

---

#### D.6 Modal Perencanaan

##### 17. Modal Edit Perencanaan

![Gambar 3.53 Modal Edit Perencanaan](figures/modal-edit-perencanaan.png)

**Lokasi:** Halaman Perencanaan (icon edit pada baris rencana)  
**Trigger:** Klik icon pensil pada baris pangkalan yang ingin diedit rencananya  
**Keterangan:** Form untuk mengedit rencana distribusi yang sudah ada untuk satu pangkalan. Field yang dapat diubah: target jumlah per jenis LPG, prioritas pengiriman, dan catatan khusus. Perubahan tersimpan dan langsung ter-reflect di halaman rekapitulasi.

##### 18. Modal Generate Otomatis

![Gambar 3.54 Modal Generate Otomatis](figures/modal-generate-otomatis.png)

**Lokasi:** Halaman Perencanaan (tombol "Generate Otomatis")  
**Trigger:** Klik tombol "Generate Otomatis"  
**Keterangan:** Dialog konfirmasi sebelum menjalankan fitur auto-generate rencana distribusi. Sistem akan menghitung target optimal untuk setiap pangkalan berdasarkan data penjualan selama tiga bulan terakhir, kapasitas alokasi bulanan masing-masing pangkalan, dan trend permintaan yang terdeteksi. Setelah user mengkonfirmasi, sistem akan membuat rencana distribusi baru yang dapat direview dan disesuaikan sebelum disimpan secara final.

---

#### D.7 Modal Profil & Password

##### 19. Modal Edit Profil

![Gambar 3.55 Modal Edit Profil](figures/modal-edit-profil.png)

**Lokasi:** Halaman Profil Akun (tombol "Edit Profil")  
**Trigger:** Klik tombol "Edit Profil"  
**Keterangan:** Form untuk mengedit informasi personal pengguna yang login. Field: nama lengkap, email, dan nomor telepon. Untuk perubahan email, sistem akan memvalidasi format dan memastikan tidak duplikat dengan akun lain. Modal ini lebih ringkas dibanding halaman Edit Profil karena tidak include upload foto.

##### 20. Modal Ubah Password (Admin)

![Gambar 3.56 Modal Ubah Password Admin](figures/modal-ubah-password-admin.png)

**Lokasi:** Halaman Profil Akun (tombol "Ubah Password")  
**Trigger:** Klik tombol "Ubah Password"  
**Keterangan:** Form untuk mengubah password akun yang sedang login dengan mekanisme keamanan berlapis. Pengguna harus memasukkan password lama untuk verifikasi identitas, kemudian menginput password baru dengan minimal 8 karakter, dan mengkonfirmasi password baru tersebut. Jika password lama yang dimasukkan salah, sistem akan menampilkan pesan error. Setelah berhasil, user tetap login dengan password baru yang langsung berlaku.

##### 21. Modal Crop Avatar

![Gambar 3.57 Modal Crop Avatar](figures/modal-crop-avatar.png)

**Lokasi:** Halaman Profil atau Edit Profil (setelah memilih file foto)  
**Trigger:** Otomatis muncul setelah user memilih file gambar dari device  
**Keterangan:** Tool untuk memotong dan menyesuaikan foto profil sebelum diupload dengan fitur interaktif lengkap. Pengguna dapat melakukan zoom in dan out, merotasi gambar, serta drag untuk reposisi area foto yang diinginkan. Preview hasil crop ditampilkan dalam format circular sesuai standar foto profil. Setelah konfirmasi, gambar diproses dan diupload ke server, kemudian foto profil langsung terupdate di seluruh sistem.

##### 22. Modal Ubah Password (Pangkalan)

![Gambar 3.58 Modal Ubah Password Pangkalan](figures/modal-ubah-password-pangkalan.png)

**Lokasi:** Halaman Profil Pangkalan (tombol "Ubah Password")  
**Trigger:** Klik tombol "Ubah Password"  
**Keterangan:** Form khusus untuk pangkalan mengubah password akunnya sendiri. Sama seperti modal admin, memerlukan verifikasi password lama dan input password baru dengan konfirmasi. Setelah berhasil, pangkalan harus menggunakan password baru untuk login berikutnya.

---

#### D.8 Modal Umum

##### 23. Modal Konfirmasi Umum

![Gambar 3.59 Modal Konfirmasi](figures/modal-konfirmasi.png)

**Lokasi:** Global (sebelum aksi berbahaya seperti hapus data)  
**Trigger:** Otomatis muncul sebelum aksi yang tidak dapat dibatalkan  
**Keterangan:** Dialog konfirmasi standar yang digunakan di berbagai tempat dalam sistem untuk memastikan user benar-benar ingin melakukan aksi berbahaya. Dialog menampilkan judul aksi, icon warning, pesan yang menjelaskan dampak dari aksi tersebut, serta tombol "Batal" dan "Konfirmasi" dengan warna merah sebagai penanda aksi destruktif. Modal ini digunakan untuk berbagai keperluan seperti menghapus data, membatalkan pesanan, dan logout dari sistem.

##### 24. Modal Notifikasi

![Gambar 3.60 Modal Notifikasi](figures/modal-notifikasi.png)

**Lokasi:** Header aplikasi (icon lonceng di pojok kanan)  
**Trigger:** Klik icon lonceng notifikasi  
**Keterangan:** Panel dropdown yang menampilkan daftar notifikasi terbaru untuk pengguna. Setiap notifikasi menunjukkan icon berdasarkan tipe notifikasi (pesanan, stok, atau pembayaran), judul singkat, waktu relatif seperti "5 menit lalu", dan status sudah dibaca atau belum. Mengklik notifikasi akan mengarahkan pengguna ke halaman terkait. Badge angka di icon lonceng menunjukkan jumlah notifikasi yang belum dibaca, dan link "Lihat Semua" tersedia untuk menuju halaman Notifikasi lengkap.

---

#### D.9 Modal Pangkalan

##### 25. Modal Pesan Stok

![Gambar 3.61 Modal Pesan Stok](figures/modal-pesan-stok.png)

**Lokasi:** Halaman Stok Pangkalan (tombol "Pesan Stok")  
**Trigger:** Klik tombol "Pesan Stok"  
**Keterangan:** Form untuk pangkalan memesan stok LPG ke agen. Menampilkan stok tersedia di agen per jenis LPG sebagai referensi. Field: pilih jenis LPG, masukkan jumlah yang ingin dipesan. Setelah submit, pesanan masuk ke antrian order agen dengan status "Menunggu Konfirmasi". Pangkalan mendapat notifikasi ketika pesanan diproses.

##### 26. Modal Terima Stok

![Gambar 3.62 Modal Terima Stok](figures/modal-terima-stok.png)

**Lokasi:** Halaman Stok Pangkalan (tombol "Terima" pada pengiriman masuk)  
**Trigger:** Klik tombol "Terima" pada baris pengiriman yang statusnya "Dikirim"  
**Keterangan:** Dialog konfirmasi penerimaan stok yang dikirim oleh agen. Menampilkan detail: tanggal kirim, jenis LPG, jumlah yang dikirim, dan driver pengantar. Pangkalan memverifikasi jumlah dan kondisi barang. Setelah konfirmasi, stok pangkalan otomatis bertambah dan status pengiriman berubah menjadi "Diterima".

##### 27. Modal Tambah Pengeluaran

![Gambar 3.63 Modal Tambah Pengeluaran](figures/modal-tambah-pengeluaran.png)

**Lokasi:** Halaman Pengeluaran Pangkalan (tombol "+ Catat Pengeluaran")  
**Trigger:** Klik tombol "+ Catat Pengeluaran"  
**Keterangan:** Form untuk mencatat pengeluaran operasional harian pangkalan. Field: tanggal pengeluaran, pilih kategori (sewa tempat, listrik, air, transportasi, gaji, lain-lain), nominal dalam Rupiah, dan keterangan opsional. Data ini digunakan dalam laporan untuk menghitung profit bersih = pendapatan penjualan - pengeluaran operasional.

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
