# 🎤 SCRIPT PRESENTASI - SLIDE 11-20
## BPMN & BAB 3 UML (Use Case, Activity Diagrams)

---

## **SLIDE 11: BPMN - Distribusi dan Penyaluran Gas** (2.5 menit)

**Narasi:**

> "BPMN kedua menggambarkan alur **distribusi dan penyaluran gas** yang lebih kompleks dengan 4 swimlane dan 4 data stores.
>
> **[Point data stores di atas]**
>
> Ada **4 data stores**: Detail Pesanan.xlsx, Nota Pembayaran Gas, Daftar Stok Tabung, dan Form Pengiriman SPBE - masih berupa dokumen terpisah.
>
> **[Mulai dari START - swimlane Kondisi]**
>
> Proses dimulai dari **mengecek stok gas**. Jika stok menipis dan sudah waktunya ambil gas, maka proses permintaan pemesanan dimulai dan menghubungi SPBE.
>
> Agen **mengambil gas ke tempat SPBE** menggunakan mobil pickup, lalu dilakukan transaksi pembayaran. Jika stok belum habis, menunggu jadwal refill berikutnya.
>
> **[Point swimlane Admin]**
>
> Admin **mengecek ketersediaan stok dan jadwal**. Jika pangkalan boleh datang mengambil gas, admin mencatat jumlah dan detail pesanan di Excel, kemudian penjadwalan distribusi.
>
> Jika stok tidak tersedia, admin menghubungi pangkalan bahwa stok ditunda.
>
> **[Point swimlane Gudang]**
>
> Tabung disusun dan dicek jumlahnya oleh petugas gudang, lalu **menyiapkan tabung ke mobil pickup**.
>
> **[Point swimlane Pangkalan]**
>
> Pangkalan **menerima gas dari agen**. Kemudian proses penjualan: mencatat jumlah tabung di warung, melayani pelanggan, **transaksi tunai/transfer**, update stok manual, catat hutang jika ada.
>
> Terakhir, **menutup penjualan** sebelum pengambilan gas berikutnya dan **laporan dikirim ke admin**.
>
> **[Point ke FINISH]**
>
> Proses berakhir setelah pesanan terpenuhi dan laporan tercatat.
>
> **[Kesimpulan]**
>
> Dari diagram ini terlihat banyak proses manual dan dokumen terpisah. Dengan SIM4LON, seluruh alur ini **terintegrasi dalam satu sistem** - dari pemesanan, distribusi, hingga pelaporan, semua otomatis dan real-time."

---

## **SLIDE 12: BAB 3 TITLE** (10 detik)

**Narasi:**

> "Selanjutnya BAB 3 Pelaksanaan Kerja Praktek - fokus pada **perancangan sistem dengan UML**."

---

## **SLIDE 13: UML OVERVIEW** (45 detik)

**Narasi:**

> "Saya telah membuat **27 diagram UML** yang mendokumentasikan sistem secara komprehensif:
>
> - **1 Use Case Diagram** dengan 12 use case
> - **10 Activity Diagrams** untuk business process
> - **10 Sequence Diagrams** untuk technical implementation
> - **1 Class Diagram** dengan 23 class dan 7 enum
> - **1 ERD** dengan 23 entity
> - **3 State Machine Diagrams** untuk lifecycle
> - **1 Deployment Diagram** untuk cloud architecture
>
> Pada presentasi ini saya akan highlight **diagram-diagram core**. Full documentation tersedia untuk review detail."

---

## **SLIDE 14: USE CASE DIAGRAM** (3-4 menit)

**Narasi:**

> "Ini adalah **Use Case Diagram** sistem SIM4LON yang menggambarkan interaksi antara aktor dengan sistem.
>
> **[Point ke diagram secara keseluruhan]**
>
> Terdapat **3 aktor utama** yang berinteraksi dengan sistem, yaitu: **Admin**, **Operator**, dan **Pangkalan**. Setiap aktor memiliki hak akses dan tanggung jawab yang berbeda sesuai dengan role-nya.
>
> ---
>
> **[Point ke aktor ADMIN - kiri]**
>
> **AKTOR PERTAMA: ADMIN**
>
> Admin adalah aktor dengan **hak akses tertinggi** yang bertanggung jawab atas konfigurasi sistem dan master data. Use case yang dapat diakses Admin meliputi:
>
> - **Login** - Untuk masuk ke sistem dengan autentikasi
> - **Kelola Pengguna** - Menambah, mengedit, dan menonaktifkan user (Admin, Operator, atau Pangkalan)
> - **Melihat Dashboard** - Melihat ringkasan KPI dan statistik operasional
> - **Kelola Stok** - Memonitor stok LPG di gudang agen
> - **Lihat Log Aktivitas** - Melihat jejak audit semua aksi yang dilakukan user untuk keamanan dan transparansi
> - **Kelola Profil** - Mengupdate data profil perusahaan (nama agen, alamat, nomor telepon)
> - **Kelola Laporan** - Generate dan export laporan penjualan, stok, dan pembayaran
> - **Kelola Pangkalan** - CRUD data master pangkalan yang terdaftar
> - **Kelola Penerimaan** - Mencatat penerimaan stok dari SPBE Pertamina
>
> ---
>
> **[Point ke aktor OPERATOR - kanan]**
>
> **AKTOR KEDUA: OPERATOR**
>
> Operator adalah aktor yang fokus pada **operasional harian** distribusi LPG. Use case yang dapat diakses Operator meliputi:
>
> - **Login** - Untuk masuk ke sistem
> - **Melihat Dashboard** - Melihat ringkasan operasional harian
> - **Kelola Stok** - Memantau dan update stok
> - **Kelola Profil** - Mengupdate profil sendiri
> - **Kelola Laporan** - Generate laporan operasional
> - **Kelola Pembayaran** - Mencatat pembayaran dari pangkalan (tunai/transfer, DP/lunas)
> - **Cetak Nota** - Mencetak nota pembayaran dan invoice
> - **Kelola Pesanan** - **Use case inti** yang mencakup:
>   - Membuat pesanan baru untuk pangkalan
>   - Melihat daftar dan detail pesanan
>   - **Update Status** pesanan (DRAFT → SELESAI) - yang memiliki **extension point** ke:
>     - **Assign Driver** - menugaskan driver untuk pengiriman
>     - **Voice Order** - input pesanan menggunakan suara (fitur AI)
>
> **[Highlight relationship - include & extend]**
>
> Perhatikan ada **<<include>>** relationship yang artinya use case tersebut **selalu dipanggil**. Dan ada **<<extend>>** relationship yang artinya use case tersebut **opsional** - dipanggil dalam kondisi tertentu saja.
>
> ---
>
> **[Point ke aktor PANGKALAN - kiri bawah]**
>
> **AKTOR KETIGA: PANGKALAN**
>
> Pangkalan adalah aktor **multi-tenant** yang hanya dapat mengakses data miliknya sendiri. Use case yang dapat diakses Pangkalan meliputi:
>
> - **Login** - Untuk masuk ke sistem dengan akun pangkalan
> - **Melihat Dashboard** - Melihat dashboard **khusus pangkalan** dengan stok mereka, DSS alert (warna hijau/kuning/merah)
> - **Kelola Profil** - Mengupdate data profil pangkalan
> - **Kelola Penjualan** - **Use case penting** untuk mencatat penjualan ke konsumen akhir
> - **Kelola Konsumen** - Mengelola data pelanggan tetap
> - **Kelola Stok** - Memonitor stok LPG di pangkalan (yang otomatis terupdate saat terima kiriman dari agen)
>
> **[Highlight multi-tenant]**
>
> Yang membedakan aktor Pangkalan adalah implementasi **multi-tenant architecture**. Setiap pangkalan hanya bisa melihat dan mengelola data miliknya sendiri - tidak bisa melihat data pangkalan lain. Ini dijamin oleh **JWT token** yang memfilter setiap query database.
>
> ---
>
> **[Kesimpulan Use Case]**
>
> Secara keseluruhan, Use Case Diagram ini menunjukkan bahwa sistem SIM4LON mencakup **complete business flow** distribusi LPG:
>
> - **Upstream**: Penerimaan stok dari SPBE (Admin)
> - **Midstream**: Pengelolaan pesanan dan distribusi (Operator)
> - **Downstream**: Penjualan ke konsumen akhir (Pangkalan)
>
> Dengan pembagian role yang jelas, sistem menjadi **aman** dan profesional.

---

## **SLIDE 15: ACTIVITY DIAGRAM - LOGIN** (1.5 menit)

**Narasi:**

> "Activity Diagram pertama: **Login**.
>
> **[Trace flow]**
>
> User input email dan password. Sistem validasi format, cari user di database, cek status akun aktif atau tidak, validasi password dengan bcrypt hash.
>
> **[Point ke fitur security]**
>
> Jika valid, sistem generate **session_id baru** - ini untuk **single-session login**, artinya satu akun hanya bisa login di satu device. Jika login di device lain, session sebelumnya otomatis logout.
>
> Kemudian sistem generate **JWT token** dengan payload berisi userId, role, dan pangkalanId untuk multi-tenant.
>
> User di-redirect ke dashboard sesuai role: Admin ke dashboard lengkap, Pangkalan ke dashboard khusus mereka."

---

## **SLIDE 16: AD - KELOLA PESANAN** (2 menit)

**Narasi:**

> "Activity Diagram ini adalah **AD Kelola Pesanan** yang menjadi **hub** atau penghubung ke Activity Diagram lainnya.
>
> **[Point ke swimlane]**
>
> Diagram ini memiliki 2 swimlane: **Admin/Operator** di kiri dan **Sistem** di kanan.
>
> **[Trace flow dari START]**
>
> Proses dimulai saat user membuka menu Pesanan. Sistem otomatis **load daftar pesanan** dan menampilkan statistik beserta halaman Daftar Pesanan.
>
> User melihat daftar pesanan, kemudian ada **decision point** - Aksi apa yang ingin dilakukan?
>
> **[Point ke pilihan aksi]**
>
> Ada beberapa pilihan:
> - **Buat Pesanan** - dengan 2 cara: catat manual atau pakai Voice AI
> - **Batalkan Pesanan** - yang akan update status menjadi BATAL dan catat ke Timeline
>
> **[Point ke referensi AD lain]**
>
> Perhatikan ada referensi ke **Activity Diagram lain**:
> - **AD 2 - Buat Pesanan** untuk create order
> - **AD 15 - Lihat Detail Pesanan** untuk view detail
> - **AD 3 - Update Status Pesanan** untuk mengubah status
> - **AD 4 - Catat Pembayaran** untuk record payment
> - **AD 14 - Assign Driver** untuk menugaskan driver
> - **AD 16 - Cetak Dokumen** untuk generate invoice
>
> Diagram ini adalah **master navigation** yang menghubungkan seluruh operasi terkait pesanan."

---

## **SLIDE 17: AD-02 - BUAT PESANAN** (2.5 menit)

**Narasi:**

> "Ini adalah **AD-02 Buat Pesanan** yang menggambarkan proses pembuatan pesanan baru.
>
> **[Point ke swimlane]**
>
> Terdapat 2 swimlane: **Admin/Operator** di kiri dan **Sistem** di kanan.
>
> **[Trace flow dari START]**
>
> Proses dimulai dengan user membuka halaman Pesanan, lalu klik tombol **Buat Pesanan Baru**.
>
> Sistem merespons dengan menampilkan form pesanan, kemudian sistem **load daftar Pangkalan aktif** dan **load daftar Produk LPG** yang tersedia.
>
> **[Point ke input user]**
>
> User kemudian:
> 1. **Pilih Pangkalan** dari dropdown
> 2. **Pilih jenis LPG dan jumlah** yang dipesan
> 3. **Tambahkan catatan** (opsional)
> 4. Klik **Simpan**
>
> **[Point ke proses sistem]**
>
> Setelah user klik Simpan, sistem melakukan:
> - **Validasi input** - cek apakah data lengkap dan valid
> - Jika **tidak valid** → tampilkan pesan error dan proses berhenti
> - Jika **valid** → lanjut ke proses berikutnya:
>   - **Generate kode pesanan** dengan format ORD-XXXX
>   - **Hitung subtotal per item**
>   - **Hitung PPN 12%** untuk produk non-subsidi
>   - **Hitung total amount**
>   - **Simpan pesanan** dengan status DRAFT
>   - **Buat timeline track** 'Pesanan Dibuat'
>   - **Log aktivitas** 'order_created' untuk audit trail
>
> **[Point ke akhir proses]**
>
> Terakhir, sistem menampilkan pesan sukses dan **redirect ke halaman detail pesanan** yang baru dibuat.
>
> Diagram ini menunjukkan **validasi berlapis** dan **pencatatan audit trail** yang lengkap."

---

## **SLIDE 18: AD-15 - LIHAT DETAIL PESANAN** (2 menit)

**Narasi:**

> "Ini adalah **AD-15 Lihat Detail Pesanan** yang menggambarkan proses melihat informasi lengkap suatu pesanan.
>
> **[Point ke swimlane]**
>
> Sama seperti sebelumnya, ada 2 swimlane: **Admin/Operator** dan **Sistem**.
>
> **[Trace flow dari START]**
>
> Proses dimulai dengan user membuka halaman Pesanan, lalu **klik pada baris pesanan** yang ingin dilihat.
>
> **[Point ke proses load data]**
>
> Sistem kemudian melakukan **serangkaian load data** secara berurutan:
> - **Load data pesanan** dengan relasinya
> - **Load order_items** - daftar item dalam pesanan
> - **Load timeline_tracks** - history perubahan status
> - **Load payment_details** - informasi pembayaran
> - **Load data pangkalan** - informasi pangkalan terkait
> - **Load data driver** jika sudah di-assign
>
> Setelah semua data ter-load, sistem **tampilkan halaman detail** yang lengkap.
>
> **[Point ke aktivitas user]**
>
> User dapat melihat:
> - Informasi pesanan (kode, tanggal, status)
> - Daftar item yang dipesan
> - Timeline status (kapan status berubah)
> - Status pembayaran (lunas/belum)
>
> **[Point ke decision - aksi lanjutan]**
>
> Ada **decision point**: apakah user ingin melakukan aksi lanjutan?
> - Jika **Ya** → Pilih aksi (Update Status / Assign Driver / Catat Bayar) → Redirect ke aksi terkait
> - Jika **Tidak** → Kembali ke daftar pesanan
>
> Diagram ini menunjukkan **loading data yang terstruktur** dan **navigasi ke aksi-aksi terkait**."

---

## **SLIDE 19: AD-03 - UPDATE STATUS PESANAN** (2 menit)

**Narasi:**

> "Ini adalah **AD-03 Update Status Pesanan** - diagram yang menunjukkan bagaimana status pesanan berubah.
>
> **[Point ke swimlane]**
>
> Ada 2 swimlane: **User** dan **Sistem**.
>
> **[Trace flow dari START]**
>
> user **klik button spesifik**:
>
> **[Point ke switch cases]**
>
> 1. **Konfirmasi Pesanan** → Status berubah ke MENUNGGU_PEMBAYARAN
> 2. **Konfirmasi Pembayaran** → Status berubah ke DIPROSES, simpan metode bayar
> 3. **Assign Driver & Kirim** → User pilih driver, lalu status berubah ke DIKIRIM
> 4. **Pesanan Selesai** → Status SELESAI, **auto-sync stok pangkalan** dan buat stock movement
> 5. **Batalkan Pesanan** → Status BATAL, **kembalikan stok agen**
>
> **[Point ke note alur status]**
>
> Alur status yang valid:
> ```
> DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → DIKIRIM → SELESAI
> ```
> Dan dari semua status bisa langsung ke **BATAL**.
>

---

## **SLIDE 20: AD-04 - CATAT PEMBAYARAN** (1.5 menit)

**Narasi:**

> "Ini adalah **AD-04 Catat Pembayaran** - proses pencatatan pembayaran dari pangkalan.
>
> **[Point ke swimlane]**
>
> Ada 2 swimlane: **User** dan **Sistem**.
>
> **[Trace flow dari START]**
>
> User buka detail pesanan, klik tombol **Catat Pembayaran**.
>
> **[Point ke switch metode]**
>
> User pilih **metode pembayaran**:
> - **TUNAI**: Cukup masukkan jumlah bayar
> - **TRANSFER**: Masukkan jumlah + **upload bukti transfer**
>
> **[Point ke proses sistem]**
>
> Setelah klik Simpan, sistem:
> 1. **Upload bukti ke Supabase Storage** (jika transfer)
> 2. **Simpan payment record** dengan `is_paid = true`
> 3. **Auto update status** ke DIPROSES jika sebelumnya MENUNGGU_PEMBAYARAN
>
> **[Kesimpulan]**
>
> Pembayaran di SIM4LON selalu **langsung lunas** - tidak ada fitur DP atau cicilan karena model bisnis B2B agen-pangkalan selalu bayar penuh."

---

## ⏱️ **TIMING SLIDE 11-20:**

| Slide | Diagram | Durasi | Kumulatif |
|-------|---------|--------|-----------|
| 11 | BPMN Distribusi | 2.5m | 2:30 |
| 12 | BAB 3 Title | 10s | 2:40 |
| 13 | UML Overview | 45s | 3:25 |
| 14 | Use Case | 3.5m | 6:55 |
| 15 | AD Login | 1.5m | 8:25 |
| 16 | AD Kelola Pesanan | 2m | 10:25 |
| 17 | AD-02 Buat Pesanan | 2.5m | 12:55 |
| 18 | AD-15 Lihat Detail | 2m | 14:55 |
| 19 | AD-03 Update Status | 2.5m | 17:25 |
| 20 | AD-04 Catat Pembayaran | 2m | 19:25 |

**Total Slide 11-20: ~19 menit**

**Running Total (1-20): ~27 menit** ✅
