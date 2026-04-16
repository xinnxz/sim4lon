# Dokumen Use Case Full-Dressed
## Sistem Informasi Manajemen Distribusi Gas LPG 3kg (SIM4LON)

---

### 3.3.1.2 Fully Dressed

Format *Fully Dressed Use Case* merupakan format penulisan use case yang paling lengkap dan detail dalam dokumentasi kebutuhan perangkat lunak. Format ini dikembangkan oleh Alistair Cockburn dan menjadi standar dalam penulisan spesifikasi use case untuk proyek pengembangan sistem yang kompleks.

Menurut Cockburn (2001), *Fully Dressed Use Case* mencakup semua komponen yang diperlukan untuk mendeskripsikan interaksi antara aktor dan sistem secara komprehensif. Berbeda dengan format *Brief* (satu paragraf) atau *Casual* (beberapa paragraf informal), format *Fully Dressed* menyediakan struktur yang rigorous untuk memastikan tidak ada detail penting yang terlewat.

**Komponen-komponen dalam Fully Dressed Use Case:**

1. **Primary Actor** – Aktor utama yang menginisiasi use case untuk mencapai tujuan tertentu.

2. **Stakeholders and Interests** – Daftar pemangku kepentingan beserta kepentingan mereka terhadap use case. Komponen ini memastikan bahwa desain sistem memenuhi kebutuhan semua pihak yang terlibat.

3. **Preconditions** – Kondisi yang harus dipenuhi sebelum use case dapat dijalankan. Preconditions diasumsikan selalu benar pada saat use case dimulai.

4. **Success Guarantee (Postconditions)** – Kondisi yang dijamin tercapai setelah use case berhasil dieksekusi. Postconditions mendeskripsikan state akhir sistem yang diinginkan.

5. **Main Success Scenario (Basic Flow)** – Urutan langkah-langkah utama yang menggambarkan interaksi normal antara aktor dan sistem menuju keberhasilan. Ditulis dalam bentuk numbered list dengan format "Aktor melakukan X" atau "Sistem melakukan Y".

6. **Extensions (Alternative Flows)** – Cabang-cabang alternatif dari skenario utama yang menangani kondisi khusus, kesalahan, atau variasi. Menggunakan notasi seperti "3a" yang berarti "alternatif pertama yang terjadi pada langkah 3".

7. **Special Requirements** – Kebutuhan non-fungsional yang spesifik untuk use case ini, seperti kebutuhan performa, keamanan, atau batasan teknis.

8. **Technology and Data Variations List** – Variasi dalam teknologi atau format data yang mungkin digunakan dalam use case.

9. **Frequency of Occurrence** – Seberapa sering use case ini dijalankan, untuk keperluan perencanaan kapasitas dan pengujian.

10. **Open Issues** – Pertanyaan atau isu yang belum terselesaikan dan memerlukan klarifikasi lebih lanjut.

---

## 1. Use Case UC-01: Login

**Primary Actor:** Admin, Pangkalan, Operator

**Stakeholders and Interests:**
- *Pengguna:* Ingin mengakses sistem dengan cepat dan aman menggunakan kredensial yang valid.
- *Admin Sistem:* Ingin memastikan hanya pengguna terotorisasi yang dapat masuk ke sistem.
- *Perusahaan:* Ingin menjaga keamanan data dan mencegah akses tidak sah.

**Preconditions:** Pengguna memiliki akun yang sudah terdaftar dan aktif dalam sistem.

**Success Guarantee (postconditions):** Pengguna berhasil terautentikasi dan diarahkan ke dashboard sesuai dengan role-nya (Admin/Pangkalan/Operator). Session pengguna tercatat dalam sistem.

**Main Success Scenario (or Basic Flow):**
1. Pengguna mengakses halaman login sistem SIM4LON.
2. Sistem menampilkan form login dengan field username dan password.
3. Pengguna memasukkan username dan password.
4. Pengguna menekan tombol "Masuk".
5. Sistem memvalidasi format input dan memeriksa kredensial terhadap database.
6. Sistem mengautentikasi pengguna dan membuat session baru.
7. Sistem mengarahkan pengguna ke halaman dashboard sesuai role.

**Extensions (or Alternative Flows):**
- *3a. Field username atau password kosong:*
    1. Sistem menampilkan pesan error "Username dan password harus diisi".
    2. Pengguna kembali ke langkah 3.
- *5a. Username tidak ditemukan dalam database:*
    1. Sistem menampilkan pesan "Username atau password salah".
    2. Sistem mencatat percobaan login gagal.
    3. Pengguna kembali ke langkah 3.
- *5b. Password tidak cocok:*
    1. Sistem menampilkan pesan "Username atau password salah".
    2. Sistem mencatat percobaan login gagal.
    3. Jika percobaan gagal >= 5 kali, akun dikunci sementara selama 15 menit.
    4. Pengguna kembali ke langkah 3.
- *5c. Akun pengguna dalam status non-aktif:*
    1. Sistem menampilkan pesan "Akun Anda tidak aktif, silakan hubungi administrator".
    2. Use case berakhir.

**Special Requirements:**
- Password harus disimpan dalam bentuk hash (bcrypt) dengan salt.
- Koneksi harus menggunakan HTTPS untuk enkripsi data.
- Session timeout setelah 30 menit tidak ada aktivitas.
- Sistem harus merespons dalam waktu < 2 detik.

**Technology and Data Variations List:**
- 3a. Username dapat berupa email atau username unik.
- 4a. Pengguna dapat menekan Enter sebagai alternatif tombol "Masuk".

**Frequency of Occurrence:** Sangat sering. Setiap pengguna melakukan login minimal 1-5 kali per hari.

**Open Issues:**
- Apakah perlu implementasi "Remember Me" untuk memperpanjang session?
- Bagaimana mekanisme reset password jika pengguna lupa?
- Apakah diperlukan two-factor authentication (2FA) untuk admin?

---

## Use Case UC-02: Kelola Pengguna

**Primary Actor:** Admin

**Stakeholders and Interests:**
- *Admin:* Ingin mengelola akses pengguna sistem secara efisien (tambah, edit, hapus, ubah status).
- *Pengguna Baru:* Ingin memiliki akun untuk mengakses sistem sesuai role-nya.
- *Perusahaan:* Ingin memastikan hanya personel yang berwenang yang memiliki akses sistem.

**Preconditions:** Admin sudah berhasil login ke sistem dan memiliki hak akses untuk mengelola pengguna.

**Success Guarantee (postconditions):** Data pengguna berhasil disimpan/diperbarui/dihapus dalam database. Log aktivitas perubahan tercatat.

**Main Success Scenario (or Basic Flow):**
1. Admin memilih menu "Kelola Pengguna" dari sidebar.
2. Sistem menampilkan daftar semua pengguna dengan informasi: nama, email, role, status, dan tanggal dibuat.
3. Admin menekan tombol "Tambah Pengguna".
4. Sistem menampilkan form input pengguna baru.
5. Admin mengisi data: nama lengkap, email, username, password, role, dan status.
6. Admin menekan tombol "Simpan".
7. Sistem memvalidasi semua field yang diisi.
8. Sistem menyimpan data pengguna baru ke database.
9. Sistem menampilkan notifikasi "Pengguna berhasil ditambahkan".
10. Sistem memperbarui daftar pengguna.

**Extensions (or Alternative Flows):**
- *3a. Admin ingin mengedit pengguna yang sudah ada:*
    1. Admin memilih pengguna dari daftar dan klik tombol "Edit".
    2. Sistem menampilkan form dengan data pengguna yang sudah terisi.
    3. Admin mengubah data yang diperlukan.
    4. Lanjut ke langkah 6.
- *3b. Admin ingin menghapus pengguna:*
    1. Admin memilih pengguna dan klik tombol "Hapus".
    2. Sistem menampilkan konfirmasi "Apakah Anda yakin ingin menghapus pengguna ini?".
    3. Admin mengkonfirmasi penghapusan.
    4. Sistem menghapus pengguna dari database (soft delete).
    5. Sistem menampilkan notifikasi "Pengguna berhasil dihapus".
- *3c. Admin ingin mengubah status pengguna (aktif/non-aktif):*
    1. Admin mengklik toggle status pada baris pengguna.
    2. Sistem mengubah status pengguna.
    3. Sistem menampilkan notifikasi perubahan status.
- *7a. Email sudah terdaftar dalam sistem:*
    1. Sistem menampilkan pesan error "Email sudah digunakan oleh pengguna lain".
    2. Admin kembali ke langkah 5 untuk mengubah email.
- *7b. Format email tidak valid:*
    1. Sistem menampilkan pesan error "Format email tidak valid".
    2. Admin kembali ke langkah 5.
- *7c. Password tidak memenuhi kriteria keamanan:*
    1. Sistem menampilkan pesan error dengan kriteria password yang diperlukan.
    2. Admin kembali ke langkah 5.

**Special Requirements:**
- Password minimal 8 karakter dengan kombinasi huruf dan angka.
- Perubahan data pengguna harus tercatat dalam log aktivitas.
- Hanya admin yang dapat mengakses fitur ini.

**Technology and Data Variations List:**
- 5a. Role dapat berupa: Admin, Pangkalan, atau Operator.
- 5b. Status dapat berupa: Aktif atau Non-aktif.

**Frequency of Occurrence:** Jarang. Biasanya 1-5 kali per minggu untuk penambahan/perubahan pengguna.

**Open Issues:**
- Apakah perlu fitur import bulk pengguna dari file Excel/CSV?
- Bagaimana kebijakan password expiry?

---

## Use Case UC-03: Kelola Dashboard

**Primary Actor:** Admin, Pangkalan, Operator

**Stakeholders and Interests:**
- *Admin:* Ingin melihat ringkasan keseluruhan operasional sistem (total pangkalan, transaksi, stok).
- *Pangkalan:* Ingin melihat ringkasan penjualan, stok, dan pesanan pangkalannya sendiri.
- *Operator:* Ingin melihat daftar pesanan yang perlu diproses dan status pengiriman.

**Preconditions:** Pengguna sudah berhasil login ke sistem.

**Success Guarantee (postconditions):** Dashboard menampilkan data statistik dan ringkasan informasi yang akurat dan up-to-date sesuai role pengguna.

**Main Success Scenario (or Basic Flow):**
1. Pengguna berhasil login atau memilih menu "Dashboard".
2. Sistem mengambil data statistik dari database sesuai role pengguna.
3. Sistem menampilkan widget dan grafik yang relevan:
   - *Untuk Admin:* Total pangkalan, total transaksi hari ini, total stok, grafik penjualan.
   - *Untuk Pangkalan:* Stok tersedia, pesanan pending, total penjualan hari ini, grafik penjualan mingguan.
   - *Untuk Operator:* Jumlah pesanan baru, pesanan dalam proses, pesanan selesai hari ini.
4. Pengguna dapat memilih filter periode waktu (hari ini, minggu ini, bulan ini).
5. Sistem memperbarui data sesuai filter yang dipilih.

**Extensions (or Alternative Flows):**
- *2a. Koneksi database gagal:*
    1. Sistem menampilkan pesan error "Gagal memuat data, silakan coba lagi".
    2. Sistem menyediakan tombol "Refresh".
- *4a. Pengguna ingin melihat detail dari widget tertentu:*
    1. Pengguna mengklik widget (misalnya "Total Pesanan").
    2. Sistem mengarahkan ke halaman detail terkait.

**Special Requirements:**
- Dashboard harus dimuat dalam waktu < 3 detik.
- Data harus ter-cache dan diperbarui setiap 5 menit.
- Responsive design untuk tampilan di berbagai ukuran layar.

**Technology and Data Variations List:**
- 3a. Grafik dapat ditampilkan dalam bentuk bar chart, line chart, atau pie chart.
- 4a. Filter dapat berupa: Hari ini, 7 hari terakhir, 30 hari terakhir, atau custom range.

**Frequency of Occurrence:** Sangat sering. Setiap pengguna mengakses dashboard setiap kali login.

**Open Issues:**
- Widget mana yang paling penting untuk ditampilkan pertama?
- Apakah perlu fitur customizable dashboard?

---

## Use Case UC-04: Kelola Supir

**Primary Actor:** Admin

**Stakeholders and Interests:**
- *Admin:* Ingin mengelola data supir untuk keperluan pengiriman barang.
- *Operator:* Membutuhkan daftar supir yang tersedia untuk ditugaskan pada pesanan.
- *Supir:* Ingin data pribadinya tercatat dengan benar dalam sistem.

**Preconditions:** Admin sudah login ke sistem.

**Success Guarantee (postconditions):** Data supir berhasil tersimpan/diperbarui/dihapus dalam database. Supir dapat ditugaskan untuk pengiriman.

**Main Success Scenario (or Basic Flow):**
1. Admin memilih menu "Kelola Supir" dari sidebar.
2. Sistem menampilkan daftar supir yang terdaftar.
3. Admin menekan tombol "Tambah Supir".
4. Sistem menampilkan form input data supir.
5. Admin mengisi data: nama, nomor HP, nomor SIM, plat kendaraan, dan status ketersediaan.
6. Admin menekan tombol "Simpan".
7. Sistem memvalidasi dan menyimpan data supir.
8. Sistem menampilkan notifikasi sukses dan memperbarui daftar.

**Extensions (or Alternative Flows):**
- *3a. Admin ingin mengedit data supir:*
    1. Admin mengklik tombol "Edit" pada supir yang dipilih.
    2. Sistem menampilkan form dengan data yang sudah terisi.
    3. Admin mengubah data yang diperlukan.
    4. Lanjut ke langkah 6.
- *3b. Admin ingin menghapus supir:*
    1. Admin mengklik tombol "Hapus".
    2. Sistem menampilkan konfirmasi penghapusan.
    3. Admin mengkonfirmasi.
    4. Sistem menghapus data supir (soft delete).
- *7a. Nomor HP sudah terdaftar:*
    1. Sistem menampilkan pesan "Nomor HP sudah digunakan".
    2. Admin kembali ke langkah 5.

**Special Requirements:**
- Nomor HP harus dalam format Indonesia (+62 atau 08xx).
- Plat kendaraan harus unik.

**Technology and Data Variations List:**
- 5a. Status ketersediaan: Tersedia, Sedang Bertugas, Cuti.

**Frequency of Occurrence:** Jarang. 1-3 kali per bulan.

**Open Issues:**
- Apakah perlu tracking lokasi real-time untuk supir?
- Bagaimana mekanisme rotasi penugasan supir?

---

## Use Case UC-05: Kelola Stok

**Primary Actor:** Admin, Pangkalan

**Stakeholders and Interests:**
- *Admin:* Ingin memantau dan mengelola stok LPG keseluruhan.
- *Pangkalan:* Ingin mengetahui stok tersedia dan melakukan update stok setelah penjualan.
- *Konsumen:* Ingin memastikan ketersediaan stok saat akan membeli.

**Preconditions:** Pengguna sudah login. Untuk Pangkalan, hanya dapat melihat stok pangkalannya sendiri.

**Success Guarantee (postconditions):** Data stok tercatat dengan akurat. Riwayat perubahan stok tersimpan untuk audit trail.

**Main Success Scenario (or Basic Flow):**
1. Pengguna memilih menu "Kelola Stok".
2. Sistem menampilkan informasi stok saat ini (jumlah tabung tersedia, tabung kosong).
3. Pengguna menekan tombol "Update Stok".
4. Sistem menampilkan form update dengan field: jenis perubahan (masuk/keluar), jumlah, dan keterangan.
5. Pengguna mengisi data perubahan stok.
6. Pengguna menekan tombol "Simpan".
7. Sistem memvalidasi dan memperbarui jumlah stok.
8. Sistem mencatat riwayat perubahan stok.
9. Sistem menampilkan notifikasi sukses.

**Extensions (or Alternative Flows):**
- *5a. Jumlah stok keluar melebihi stok tersedia:*
    1. Sistem menampilkan pesan "Jumlah melebihi stok tersedia".
    2. Pengguna kembali ke langkah 5.
- *7a. Stok mencapai batas minimum:*
    1. Sistem menampilkan peringatan "Stok hampir habis".
    2. Sistem mengirim notifikasi ke admin/pangkalan.

**Special Requirements:**
- Notifikasi otomatis saat stok di bawah batas minimum yang ditentukan.
- Semua perubahan stok harus tercatat dengan timestamp dan user yang melakukan.

**Technology and Data Variations List:**
- 4a. Jenis perubahan: Stok Masuk (dari agen), Stok Keluar (penjualan), Adjustment.

**Frequency of Occurrence:** Sering. Beberapa kali per hari untuk pangkalan yang aktif.

**Open Issues:**
- Berapa batas minimum stok yang ideal untuk trigger notifikasi?
- Apakah perlu integrasi dengan sistem inventory agen?

---

## Use Case UC-06: Lihat Log Aktivitas

**Primary Actor:** Admin

**Stakeholders and Interests:**
- *Admin:* Ingin memantau semua aktivitas yang terjadi dalam sistem untuk keperluan audit dan keamanan.
- *Manajemen:* Ingin memastikan sistem digunakan dengan benar dan dapat melacak jika terjadi masalah.

**Preconditions:** Admin sudah login ke sistem.

**Success Guarantee (postconditions):** Admin dapat melihat riwayat aktivitas sistem secara lengkap dan dapat memfilter berdasarkan kriteria tertentu.

**Main Success Scenario (or Basic Flow):**
1. Admin memilih menu "Log Aktivitas".
2. Sistem menampilkan daftar log aktivitas terbaru (default: 50 entri terakhir).
3. Untuk setiap log, sistem menampilkan: timestamp, user, aksi, detail, dan IP address.
4. Admin dapat menggunakan filter (tanggal, user, jenis aksi).
5. Sistem memperbarui tampilan sesuai filter.
6. Admin dapat mengklik detail log untuk melihat informasi lengkap.

**Extensions (or Alternative Flows):**
- *4a. Admin ingin export log:*
    1. Admin mengklik tombol "Export".
    2. Sistem menggenerate file CSV/Excel.
    3. Sistem mengunduh file ke komputer admin.

**Special Requirements:**
- Log tidak dapat dihapus atau dimodifikasi (immutable).
- Log harus disimpan minimal 1 tahun.
- Performa tetap baik meskipun data log sangat banyak.

**Technology and Data Variations List:**
- 4a. Jenis aksi: Login, Logout, Create, Update, Delete, View.

**Frequency of Occurrence:** Kadang-kadang. 1-3 kali per minggu untuk keperluan audit.

**Open Issues:**
- Berapa lama log perlu disimpan sebelum di-archive?
- Apakah perlu real-time notification untuk aktivitas mencurigakan?

---

## Use Case UC-07: Kelola Profil

**Primary Actor:** Admin, Pangkalan, Operator

**Stakeholders and Interests:**
- *Pengguna:* Ingin memperbarui informasi pribadi dan mengubah password.
- *Sistem:* Ingin menjaga data pengguna tetap akurat dan terkini.

**Preconditions:** Pengguna sudah login ke sistem.

**Success Guarantee (postconditions):** Data profil pengguna berhasil diperbarui dalam database.

**Main Success Scenario (or Basic Flow):**
1. Pengguna mengklik menu "Profil" atau ikon profil di header.
2. Sistem menampilkan halaman profil dengan data saat ini.
3. Pengguna mengklik tombol "Edit Profil".
4. Sistem menampilkan form edit dengan field: nama, email, nomor HP, foto profil.
5. Pengguna mengubah data yang diperlukan.
6. Pengguna menekan tombol "Simpan".
7. Sistem memvalidasi dan menyimpan perubahan.
8. Sistem menampilkan notifikasi sukses.

**Extensions (or Alternative Flows):**
- *3a. Pengguna ingin mengubah password:*
    1. Pengguna mengklik "Ubah Password".
    2. Sistem menampilkan form: password lama, password baru, konfirmasi password baru.
    3. Pengguna mengisi form.
    4. Sistem memvalidasi password lama.
    5. Jika valid, sistem menyimpan password baru (ter-hash).
- *4a. Password lama tidak cocok:*
    1. Sistem menampilkan pesan "Password lama tidak sesuai".
    2. Pengguna kembali ke langkah 3.

**Special Requirements:**
- Upload foto maksimal 2MB dengan format JPG/PNG.
- Password baru harus berbeda dari 3 password terakhir.

**Frequency of Occurrence:** Jarang. 1-2 kali per bulan per pengguna.

**Open Issues:**
- Apakah perlu verifikasi email saat mengubah email?

---

## Use Case UC-08: Kelola Laporan

**Primary Actor:** Admin, Pangkalan

**Stakeholders and Interests:**
- *Admin:* Ingin melihat laporan komprehensif seluruh operasional untuk pengambilan keputusan.
- *Pangkalan:* Ingin melihat laporan penjualan dan stok pangkalannya untuk evaluasi.
- *Manajemen:* Membutuhkan laporan berkala untuk monitoring bisnis.

**Preconditions:** Pengguna sudah login. Data transaksi tersedia dalam sistem.

**Success Guarantee (postconditions):** Laporan berhasil digenerate dan dapat diunduh dalam format yang dipilih.

**Main Success Scenario (or Basic Flow):**
1. Pengguna memilih menu "Laporan".
2. Sistem menampilkan daftar jenis laporan yang tersedia.
3. Pengguna memilih jenis laporan (Penjualan, Stok, Transaksi, Keuangan).
4. Sistem menampilkan form parameter laporan (periode, filter).
5. Pengguna mengisi parameter dan menekan "Generate".
6. Sistem memproses dan menampilkan preview laporan.
7. Pengguna dapat mengunduh laporan dalam format PDF atau Excel.

**Extensions (or Alternative Flows):**
- *6a. Tidak ada data untuk periode yang dipilih:*
    1. Sistem menampilkan pesan "Tidak ada data untuk periode ini".
    2. Pengguna dapat mengubah parameter dan kembali ke langkah 5.

**Special Requirements:**
- Laporan harus dapat digenerate dalam waktu < 10 detik.
- Format PDF harus rapi dan siap cetak.

**Technology and Data Variations List:**
- 3a. Jenis laporan: Laporan Penjualan Harian, Laporan Stok, Laporan Keuangan, Laporan Distribusi.
- 7a. Format: PDF, Excel (XLSX), CSV.

**Frequency of Occurrence:** Reguler. Harian untuk laporan operasional, mingguan/bulanan untuk laporan manajemen.

**Open Issues:**
- Apakah perlu fitur scheduled report (laporan otomatis terjadwal)?
- Format template laporan seperti apa yang diinginkan?

---

## Use Case UC-09: Kelola Pembayaran

**Primary Actor:** Pangkalan

**Extension Points:** Cetak Nota (UC-10)

**Stakeholders and Interests:**
- *Pangkalan:* Ingin mencatat dan mengelola pembayaran dari konsumen secara akurat.
- *Konsumen:* Ingin mendapatkan bukti pembayaran yang sah.
- *Admin:* Ingin memantau arus kas dan transaksi pembayaran.

**Preconditions:** Pangkalan sudah login. Ada transaksi yang memerlukan pembayaran.

**Success Guarantee (postconditions):** Pembayaran tercatat dalam sistem. Status transaksi berubah menjadi "Lunas".

**Main Success Scenario (or Basic Flow):**
1. Pangkalan memilih menu "Pembayaran" atau mengakses dari detail transaksi.
2. Sistem menampilkan daftar transaksi dengan status pembayaran.
3. Pangkalan memilih transaksi yang akan dibayar.
4. Sistem menampilkan detail transaksi dan total yang harus dibayar.
5. Pangkalan memasukkan nominal pembayaran dan metode pembayaran.
6. Pangkalan menekan tombol "Konfirmasi Pembayaran".
7. Sistem memvalidasi dan memproses pembayaran.
8. Sistem mengupdate status transaksi menjadi "Lunas".
9. Sistem menampilkan opsi "Cetak Nota" (extend ke UC-10).

**Extensions (or Alternative Flows):**
- *5a. Pembayaran parsial (cicilan):*
    1. Pangkalan memasukkan nominal kurang dari total.
    2. Sistem mencatat pembayaran parsial.
    3. Status transaksi menjadi "Dibayar Sebagian".
    4. Sisa tagihan tercatat untuk pembayaran berikutnya.
- *7a. Nominal pembayaran melebihi tagihan:*
    1. Sistem menampilkan konfirmasi kembalian.
    2. Pangkalan mengkonfirmasi.
    3. Sistem mencatat pembayaran dengan kembalian.

**Special Requirements:**
- Semua transaksi pembayaran harus ter-log dengan timestamp.
- Tidak dapat menghapus atau mengubah pembayaran yang sudah dikonfirmasi.

**Technology and Data Variations List:**
- 5a. Metode pembayaran: Tunai, Transfer Bank, QRIS.

**Frequency of Occurrence:** Sangat sering. Setiap ada transaksi penjualan.

**Open Issues:**
- Apakah perlu integrasi dengan payment gateway untuk pembayaran non-tunai?
- Bagaimana penanganan pembayaran yang dibatalkan/refund?

---

## Use Case UC-10: Cetak Nota

**Primary Actor:** Pangkalan

**Scope:** Sistem SIM4LON

**Level:** Subfunction

**Relationship:** <<extend>> dari UC-09 Kelola Pembayaran

**Stakeholders and Interests:**
- *Pangkalan:* Ingin memberikan bukti transaksi kepada konsumen.
- *Konsumen:* Membutuhkan nota sebagai bukti pembelian.

**Preconditions:** Pembayaran sudah dikonfirmasi dan transaksi berstatus "Lunas" atau "Dibayar Sebagian".

**Success Guarantee (postconditions):** Nota berhasil digenerate dan dicetak/diunduh.

**Main Success Scenario (or Basic Flow):**
1. Pangkalan mengklik tombol "Cetak Nota" setelah konfirmasi pembayaran.
2. Sistem menggenerate nota dalam format PDF.
3. Sistem menampilkan preview nota dengan informasi: nomor nota, tanggal, detail item, total, metode pembayaran, dan nama pangkalan.
4. Pangkalan mengklik "Print" atau "Download".
5. Sistem mengirim ke printer atau mengunduh file PDF.

**Extensions (or Alternative Flows):**
- *4a. Printer tidak tersedia:*
    1. Pangkalan memilih "Download" sebagai alternatif.
    2. Sistem mengunduh file PDF ke komputer.
- *2a. Pangkalan ingin mencetak ulang nota lama:*
    1. Pangkalan membuka riwayat transaksi.
    2. Pangkalan memilih transaksi dan klik "Cetak Ulang Nota".
    3. Lanjut ke langkah 2.

**Special Requirements:**
- Nota harus memiliki nomor unik yang tidak berulang.
- Format nota harus sesuai standar kwitansi penjualan.
- Ukuran nota mendukung printer thermal (58mm/80mm).

**Frequency of Occurrence:** Sering. Setiap kali ada pembayaran yang memerlukan bukti.

**Open Issues:**
- Apakah perlu opsi kirim nota via WhatsApp/Email?
- Format nota thermal atau A4?

---

## Use Case UC-11: Kelola Penjualan

**Primary Actor:** Pangkalan

**Stakeholders and Interests:**
- *Pangkalan:* Ingin mencatat setiap transaksi penjualan LPG dengan akurat dan efisien.
- *Konsumen:* Ingin proses pembelian yang cepat dan mendapat bukti transaksi.
- *Admin:* Ingin memantau volume penjualan tiap pangkalan.

**Preconditions:** Pangkalan sudah login. Stok LPG tersedia.

**Success Guarantee (postconditions):** Transaksi penjualan tercatat. Stok berkurang sesuai jumlah penjualan. Laporan penjualan ter-update.

**Main Success Scenario (or Basic Flow):**
1. Pangkalan memilih menu "Penjualan" atau "Buat Transaksi Baru".
2. Sistem menampilkan form penjualan.
3. Pangkalan memilih konsumen dari daftar atau menambah konsumen baru.
4. Pangkalan memasukkan jumlah tabung LPG yang dibeli.
5. Sistem menghitung total harga secara otomatis berdasarkan harga standar.
6. Pangkalan mengkonfirmasi metode pembayaran.
7. Pangkalan menekan tombol "Simpan Transaksi".
8. Sistem menyimpan transaksi dan mengurangi stok.
9. Sistem menampilkan ringkasan transaksi dan opsi cetak nota.

**Extensions (or Alternative Flows):**
- *3a. Konsumen baru (belum terdaftar):*
    1. Pangkalan mengklik "Tambah Konsumen Baru".
    2. Sistem menampilkan form singkat (nama, alamat, no HP).
    3. Pangkalan mengisi dan menyimpan.
    4. Lanjut ke langkah 4.
- *4a. Jumlah melebihi stok tersedia:*
    1. Sistem menampilkan peringatan "Stok tidak mencukupi".
    2. Pangkalan mengurangi jumlah atau membatalkan.
- *8a. Penjualan dengan pengiriman:*
    1. Pangkalan mencentang opsi "Dengan Pengiriman".
    2. Sistem membuat pesanan baru (include ke UC-15).

**Special Requirements:**
- Perhitungan harga harus akurat sesuai harga yang ditetapkan.
- Transaksi tidak dapat diubah setelah disimpan (hanya bisa dibatalkan dengan approval).

**Technology and Data Variations List:**
- 4a. Jumlah tabung dapat berupa tabung isi atau tabung kosong (tukar).

**Frequency of Occurrence:** Sangat sering. Puluhan transaksi per hari untuk pangkalan aktif.

**Open Issues:**
- Apakah mendukung harga diskon atau promo?
- Bagaimana penanganan transaksi pembatalan?

---

## Use Case UC-12: Kelola Konsumen

**Primary Actor:** Pangkalan, Operator

**Stakeholders and Interests:**
- *Pangkalan/Operator:* Ingin memiliki database konsumen yang lengkap untuk mempermudah transaksi.
- *Konsumen:* Ingin data pribadinya tercatat untuk kemudahan pembelian berulang.

**Preconditions:** Pengguna sudah login ke sistem.

**Success Guarantee (postconditions):** Data konsumen berhasil tersimpan/diperbarui dalam database.

**Main Success Scenario (or Basic Flow):**
1. Pengguna memilih menu "Konsumen".
2. Sistem menampilkan daftar konsumen yang terdaftar.
3. Pengguna menekan tombol "Tambah Konsumen".
4. Sistem menampilkan form input data konsumen.
5. Pengguna mengisi data: nama lengkap, alamat, nomor HP, dan catatan (opsional).
6. Pengguna menekan tombol "Simpan".
7. Sistem memvalidasi dan menyimpan data konsumen.
8. Sistem menampilkan notifikasi sukses.

**Extensions (or Alternative Flows):**
- *3a. Pengguna ingin mengedit data konsumen:*
    1. Pengguna mengklik tombol "Edit" pada konsumen yang dipilih.
    2. Sistem menampilkan form dengan data yang sudah terisi.
    3. Pengguna mengubah data.
    4. Lanjut ke langkah 6.
- *3b. Pengguna ingin melihat riwayat pembelian konsumen:*
    1. Pengguna mengklik nama konsumen.
    2. Sistem menampilkan detail konsumen dan riwayat transaksi.
- *7a. Nomor HP sudah terdaftar:*
    1. Sistem menampilkan peringatan "Konsumen dengan nomor ini sudah terdaftar".
    2. Sistem menampilkan data konsumen yang ada.

**Special Requirements:**
- Pencarian konsumen harus cepat (mendukung search by nama atau nomor HP).
- Data konsumen harus dijaga kerahasiaannya.

**Frequency of Occurrence:** Sering. Beberapa kali per hari saat ada konsumen baru.

**Open Issues:**
- Apakah perlu fitur import data konsumen dari file Excel?
- Bagaimana kebijakan retensi data konsumen?

---

## Use Case UC-13: Update Status

**Primary Actor:** Operator

**Extension Points:** Assign Driver (UC-14)

**Stakeholders and Interests:**
- *Operator:* Ingin memperbarui status pesanan sesuai dengan progress pengiriman.
- *Pangkalan:* Ingin mengetahui status terkini dari pesanan yang dibuat.
- *Konsumen:* Ingin mengetahui kapan pesanan akan dikirim/sampai.

**Preconditions:** Operator sudah login. Ada pesanan yang statusnya perlu diupdate.

**Success Guarantee (postconditions):** Status pesanan berhasil diperbarui. Notifikasi terkirim ke pihak terkait.

**Main Success Scenario (or Basic Flow):**
1. Operator memilih pesanan dari daftar pesanan aktif.
2. Sistem menampilkan detail pesanan dan status saat ini.
3. Operator memilih status baru dari dropdown (Diproses, Dalam Pengiriman, Selesai, Dibatalkan).
4. Jika status = "Dalam Pengiriman", sistem meminta untuk assign driver (extend ke UC-14).
5. Operator menambahkan catatan/keterangan (opsional).
6. Operator menekan tombol "Update Status".
7. Sistem menyimpan perubahan status dan timestamp.
8. Sistem mengirim notifikasi ke pangkalan terkait.

**Extensions (or Alternative Flows):**
- *3a. Status diubah ke "Dibatalkan":*
    1. Sistem meminta alasan pembatalan.
    2. Operator mengisi alasan.
    3. Sistem mengupdate status dan mengembalikan stok (jika sudah dikurangi).
- *4a. Tidak ada driver yang tersedia:*
    1. Sistem menampilkan pesan "Tidak ada driver tersedia".
    2. Operator dapat menunda atau memilih driver yang sedang bertugas.

**Special Requirements:**
- Perubahan status harus tercatat dalam log dengan timestamp.
- Status hanya dapat berubah ke status berikutnya dalam workflow (tidak bisa mundur kecuali dibatalkan).

**Technology and Data Variations List:**
- 3a. Status: Pending, Dikonfirmasi, Diproses, Dalam Pengiriman, Selesai, Dibatalkan.

**Frequency of Occurrence:** Sangat sering. Setiap pesanan memerlukan beberapa kali update status.

**Open Issues:**
- Apakah perlu tracking status real-time untuk konsumen?
- Notifikasi via apa (in-app, SMS, WhatsApp)?

---

## Use Case UC-14: Assign Driver

**Primary Actor:** Operator

**Scope:** Sistem SIM4LON

**Level:** Subfunction

**Relationship:** <<extend>> dari UC-13 Update Status

**Stakeholders and Interests:**
- *Operator:* Ingin menugaskan driver yang tepat dan tersedia untuk pengiriman.
- *Driver:* Ingin mendapat penugasan yang jelas dengan detail pesanan.
- *Konsumen:* Ingin pesanan dikirim oleh driver yang kompeten.

**Preconditions:** Status pesanan diubah ke "Dalam Pengiriman". Setidaknya ada satu driver yang tersedia.

**Success Guarantee (postconditions):** Driver berhasil ditugaskan ke pesanan. Driver menerima notifikasi penugasan.

**Main Success Scenario (or Basic Flow):**
1. Sistem menampilkan daftar driver yang tersedia (status = "Tersedia").
2. Untuk setiap driver, sistem menampilkan: nama, nomor HP, plat kendaraan.
3. Operator memilih driver yang akan ditugaskan.
4. Operator menekan tombol "Assign".
5. Sistem mengupdate pesanan dengan data driver.
6. Sistem mengubah status driver menjadi "Sedang Bertugas".
7. Sistem mengirim notifikasi penugasan ke driver (jika ada integrasi).

**Extensions (or Alternative Flows):**
- *1a. Semua driver sedang bertugas:*
    1. Sistem menampilkan pesan "Tidak ada driver tersedia saat ini".
    2. Operator dapat menunggu atau memilih driver yang akan segera selesai.
- *3a. Operator ingin melihat detail driver:*
    1. Operator mengklik nama driver.
    2. Sistem menampilkan detail dan riwayat penugasan driver.

**Special Requirements:**
- Satu driver hanya dapat menangani satu pesanan dalam satu waktu (atau sesuai kapasitas kendaraan).

**Frequency of Occurrence:** Sering. Setiap ada pesanan yang akan dikirim.

**Open Issues:**
- Apakah perlu algoritma auto-assign berdasarkan lokasi terdekat?
- Bagaimana jika driver menolak penugasan?

---

## Use Case UC-15: Kelola Pesanan

**Primary Actor:** Pangkalan, Operator

**Includes:** Update Status (UC-13)

**Stakeholders and Interests:**
- *Pangkalan:* Ingin membuat dan memantau pesanan dari konsumen.
- *Operator:* Ingin memproses dan mengelola pesanan yang masuk.
- *Konsumen:* Ingin pesanannya diproses dengan cepat dan akurat.

**Preconditions:** Pengguna sudah login.

**Success Guarantee (postconditions):** Pesanan berhasil dibuat/dikelola. Status pesanan dapat dilacak.

**Main Success Scenario (or Basic Flow):**
1. Pengguna memilih menu "Pesanan".
2. Sistem menampilkan daftar pesanan dengan filter status.
3. *Untuk membuat pesanan baru (Pangkalan):*
   - Pangkalan mengklik "Buat Pesanan Baru".
   - Sistem menampilkan form pesanan.
   - Pangkalan memilih konsumen dan mengisi jumlah tabung.
   - Pangkalan mengisi alamat pengiriman.
   - Pangkalan menekan "Simpan".
   - Sistem membuat pesanan dengan status "Pending".
4. *Untuk memproses pesanan (Operator):*
   - Operator memilih pesanan dan klik "Proses".
   - Sistem menampilkan detail pesanan.
   - Operator melakukan update status (include UC-13).

**Extensions (or Alternative Flows):**
- *3a. Pesanan dibuat dari penjualan langsung:*
    1. Pesanan otomatis dibuat saat penjualan dengan opsi pengiriman.
    2. Status langsung "Dikonfirmasi".
- *4a. Pesanan perlu dibatalkan:*
    1. Operator memilih "Batalkan Pesanan".
    2. Sistem meminta alasan pembatalan.
    3. Status berubah menjadi "Dibatalkan".

**Special Requirements:**
- Pesanan harus memiliki nomor unik yang dapat dilacak.
- Riwayat perubahan status harus tercatat.

**Frequency of Occurrence:** Sangat sering. Puluhan pesanan per hari.

**Open Issues:**
- Apakah perlu fitur voice order untuk mempercepat input?
- Bagaimana handling pesanan dengan multiple drop point?

---

## Use Case UC-16: Kelola Pangkalan

**Primary Actor:** Admin

**Stakeholders and Interests:**
- *Admin:* Ingin mengelola data pangkalan yang terdaftar dalam sistem.
- *Pangkalan:* Ingin data pangkalannya tercatat dengan benar dalam sistem.
- *Agen:* Ingin mengetahui daftar pangkalan yang aktif untuk distribusi.

**Preconditions:** Admin sudah login ke sistem.

**Success Guarantee (postconditions):** Data pangkalan berhasil tersimpan/diperbarui/dihapus dalam database.

**Main Success Scenario (or Basic Flow):**
1. Admin memilih menu "Kelola Pangkalan".
2. Sistem menampilkan daftar pangkalan yang terdaftar.
3. Admin menekan tombol "Tambah Pangkalan".
4. Sistem menampilkan form input data pangkalan.
5. Admin mengisi data: nama pangkalan, alamat, koordinat lokasi, nomor HP, pemilik, dan kuota.
6. Admin menekan tombol "Simpan".
7. Sistem memvalidasi dan menyimpan data pangkalan.
8. Sistem membuat akun user untuk pangkalan tersebut.
9. Sistem menampilkan notifikasi sukses.

**Extensions (or Alternative Flows):**
- *3a. Admin ingin mengedit data pangkalan:*
    1. Admin mengklik "Edit" pada pangkalan yang dipilih.
    2. Sistem menampilkan form dengan data yang sudah terisi.
    3. Admin mengubah data.
    4. Lanjut ke langkah 6.
- *3b. Admin ingin menonaktifkan pangkalan:*
    1. Admin mengubah status menjadi "Non-aktif".
    2. Sistem menonaktifkan akun user terkait.
    3. Pangkalan tidak dapat login sampai diaktifkan kembali.
- *7a. Nama pangkalan sudah terdaftar:*
    1. Sistem menampilkan pesan "Nama pangkalan sudah ada".
    2. Admin kembali ke langkah 5.

**Special Requirements:**
- Koordinat lokasi dapat diisi via peta interaktif atau manual.
- Setiap pangkalan memiliki kuota maksimal pembelian dari agen.

**Frequency of Occurrence:** Jarang. Beberapa kali per bulan saat ada pangkalan baru.

**Open Issues:**
- Apakah perlu verifikasi dokumen untuk registrasi pangkalan baru?
- Bagaimana proses approval untuk pangkalan baru?

---

## Use Case UC-17: Buat Order ke Agen

**Primary Actor:** Pangkalan

**Stakeholders and Interests:**
- *Pangkalan:* Ingin memesan stok LPG dari agen saat stok menipis.
- *Agen:* Ingin menerima pesanan dari pangkalan dengan informasi yang lengkap.
- *Admin:* Ingin memantau alur distribusi dari agen ke pangkalan.

**Preconditions:** Pangkalan sudah login. Pangkalan memiliki kuota pembelian yang tersisa.

**Success Guarantee (postconditions):** Order ke agen berhasil dibuat dan terkirim. Agen menerima notifikasi order baru.

**Main Success Scenario (or Basic Flow):**
1. Pangkalan memilih menu "Order ke Agen" atau "Pesan Stok".
2. Sistem menampilkan informasi stok saat ini dan kuota tersisa.
3. Sistem menampilkan form order dengan field: jumlah tabung dan tanggal pengiriman yang diinginkan.
4. Pangkalan mengisi jumlah tabung yang akan dipesan.
5. Sistem menghitung estimasi biaya berdasarkan harga dari agen.
6. Pangkalan memilih metode pembayaran (Transfer/COD).
7. Pangkalan menekan tombol "Kirim Order".
8. Sistem menyimpan order dan mengirim notifikasi ke agen.
9. Sistem menampilkan ringkasan order dan nomor referensi.

**Extensions (or Alternative Flows):**
- *4a. Jumlah melebihi kuota tersisa:*
    1. Sistem menampilkan pesan "Jumlah melebihi kuota Anda (sisa: X tabung)".
    2. Pangkalan mengurangi jumlah pesanan.
- *8a. Order memerlukan approval admin:*
    1. Order dengan jumlah besar (> threshold) memerlukan approval.
    2. Status order menjadi "Menunggu Approval".
    3. Admin menerima notifikasi untuk review.

**Special Requirements:**
- Order harus dapat dibatalkan sebelum dikonfirmasi oleh agen.
- Riwayat order harus tersimpan untuk rekap bulanan.

**Technology and Data Variations List:**
- 6a. Metode pembayaran: Transfer Bank, COD (Cash on Delivery).

**Frequency of Occurrence:** Reguler. 2-5 kali per minggu tergantung volume penjualan.

**Open Issues:**
- Apakah perlu integrasi langsung dengan sistem agen?
- Bagaimana penanganan jika agen tidak memiliki stok?

---

## Use Case UC-18: Kelola Perencanaan

**Primary Actor:** Pangkalan

**Stakeholders and Interests:**
- *Pangkalan:* Ingin merencanakan jadwal distribusi dan pengiriman untuk efisiensi operasional.
- *Driver:* Ingin mengetahui jadwal pengiriman yang sudah direncanakan.
- *Konsumen:* Ingin mendapat kepastian jadwal pengiriman.

**Preconditions:** Pangkalan sudah login ke sistem.

**Success Guarantee (postconditions):** Jadwal perencanaan berhasil disimpan. Pengingat/notifikasi terjadwal untuk eksekusi.

**Main Success Scenario (or Basic Flow):**
1. Pangkalan memilih menu "Perencanaan" atau "Jadwal".
2. Sistem menampilkan kalender dengan jadwal yang sudah ada.
3. Pangkalan mengklik tanggal untuk membuat jadwal baru.
4. Sistem menampilkan form perencanaan.
5. Pangkalan mengisi detail: jenis kegiatan (pengiriman/pengambilan stok), target (konsumen/agen), jumlah, dan waktu.
6. Pangkalan menekan tombol "Simpan".
7. Sistem menyimpan jadwal dan mengatur reminder.
8. Sistem menampilkan jadwal di kalender.

**Extensions (or Alternative Flows):**
- *3a. Pangkalan ingin mengedit jadwal yang ada:*
    1. Pangkalan mengklik jadwal dari kalender.
    2. Sistem menampilkan form dengan data yang sudah terisi.
    3. Pangkalan mengubah data.
    4. Lanjut ke langkah 6.
- *3b. Pangkalan ingin menghapus jadwal:*
    1. Pangkalan mengklik jadwal dan pilih "Hapus".
    2. Sistem meminta konfirmasi.
    3. Sistem menghapus jadwal dari kalender.
- *7a. Jadwal bentrok dengan jadwal lain:*
    1. Sistem menampilkan peringatan "Jadwal bentrok dengan kegiatan lain".
    2. Pangkalan dapat mengubah waktu atau mengabaikan peringatan.

**Special Requirements:**
- Tampilan kalender harus mendukung view harian, mingguan, dan bulanan.
- Notifikasi reminder H-1 dan H (hari pelaksanaan).

**Technology and Data Variations List:**
- 5a. Jenis kegiatan: Pengiriman ke Konsumen, Pengambilan Stok dari Agen, Maintenance.

**Frequency of Occurrence:** Reguler. Beberapa kali per minggu.

**Open Issues:**
- Apakah perlu integrasi dengan Google Calendar?
- Bagaimana handling jika jadwal tidak terlaksana?

---

## Glosarium

- **Admin:** Pengelola sistem dengan akses penuh ke semua fitur administratif.
- **Pangkalan:** Pemilik atau pengelola outlet penjualan LPG 3kg yang terdaftar dalam sistem.
- **Operator:** Staf operasional yang bertugas memproses pesanan dan mengelola pengiriman.
- **Agen:** Distributor resmi LPG yang memasok stok ke pangkalan-pangkalan.
- **Driver/Supir:** Pengantar yang bertugas mengantarkan pesanan LPG ke konsumen.
- **Konsumen:** Pembeli akhir yang membeli LPG dari pangkalan.

---

## Referensi

Cockburn, A. (2001). *Writing Effective Use Cases*. Boston: Addison-Wesley Professional.

Kemper, A. (n.d.). *Use-Case Model: Writing Requirements in Context* [Lecture Slides]. College of William & Mary. Retrieved from https://www.cs.wm.edu/~kemper/cs435/slides/l5.pdf

---

*Tanggal pembuatan: 7 Januari 2026*
