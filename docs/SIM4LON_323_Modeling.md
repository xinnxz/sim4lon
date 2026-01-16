# 3.2.3 Modeling - Pemodelan Sistem SIM4LON

> **Catatan**: Dokumen ini berisi detail tahapan Modeling dalam pengembangan SIM4LON menggunakan metode Waterfall.

---

## Penjelasan Tahap Modeling

Pada tahapan ini, penulis melakukan analisis dan perancangan dengan menggunakan metode pemodelan untuk menggambarkan dan mendokumentasikan sistem secara keseluruhan yang mencakup interaksi antar entitas, aliran kerja, logika proses, hubungan antar komponen, visualisasi arsitektur sistem, hubungan antar entitas serta antarmuka. 

Penulis melakukan pemodelan dengan menggunakan metode **UML (Unified Modeling Language)** yang merupakan bahasa standar pemodelan dan desain antarmuka menggunakan **Balsamiq Mockup**. Tools yang digunakan untuk membuat diagram UML adalah **PlantUML** yang diintegrasikan dengan Visual Studio Code, serta **Visual Paradigm** untuk diagram yang memerlukan layout visual yang lebih kompleks.

---

## Ringkasan Diagram yang Dibuat

Berdasarkan analisis kebutuhan sistem, penulis telah membuat total **58 diagram** yang terdiri dari:

| No | Jenis Diagram | Jumlah | Keterangan |
|----|---------------|--------|------------|
| 1. | Use Case Diagram | 1 | Diagram utama interaksi aktor dengan sistem |
| 2. | Activity Diagram | 26 | Alur proses bisnis setiap fitur |
| 3. | Sequence Diagram | 19 | Interaksi antar objek dalam urutan waktu |
| 4. | State Machine Diagram | 4 | Status dan transisi entitas |
| 5. | Class Diagram | 1 | Struktur class sistem (22 classes, 7 enums) |
| 6. | Entity Relationship Diagram (ERD) | 1 | Struktur database dan relasi |
| 7. | Deployment Diagram | 1 | Arsitektur deployment sistem |
| 8. | Conceptual Model Diagram | 1 | Model konseptual sistem |
| 9. | Model IIS Diagram | 1 | Model Integrated Information System |
| 10. | User Interface (Mockup) | 43 | Wireframe halaman UI (34 Admin + 9 Pangkalan) |
| | **Total** | **98** | |

---

## A. Pemodelan Data (Database Design)

### Entity Relationship Diagram (ERD)

Penulis merancang struktur database menggunakan Entity Relationship Diagram yang menggambarkan entitas-entitas dalam sistem beserta relasi antar entitas. Database SIM4LON menggunakan PostgreSQL dengan struktur tabel sebagai berikut:

| No | Entitas | Deskripsi | Atribut Utama |
|----|---------|-----------|---------------|
| 1. | `users` | Data pengguna sistem | id, email, password, role, name |
| 2. | `company_profile` | Profil perusahaan (agen) | id, name, address, phone, npwp |
| 3. | `pangkalans` | Data pangkalan | id, name, owner, address, phone |
| 4. | `drivers` | Data sopir | id, name, phone, license_number |
| 5. | `lpg_products` | Master produk LPG | id, name, category, base_price |
| 6. | `orders` | Data pesanan | id, code, pangkalan_id, status, total |
| 7. | `order_items` | Item pesanan | id, order_id, product_id, quantity, price |
| 8. | `payments` | Data pembayaran | id, order_id, amount, method, status |
| 9. | `stock_history` | Riwayat stok | id, product_id, type, quantity, date |
| 10. | `stock_receipts` | Penerimaan dari SPBE | id, receipt_number, date, total_tubes |
| 11. | `stock_distributions` | Penyaluran ke pangkalan | id, pangkalan_id, date, items |
| 12. | `timeline_tracks` | Timeline status pesanan | id, order_id, status, timestamp |
| 13. | `consumers` | Konsumen pangkalan | id, pangkalan_id, name, address |
| 14. | `pangkalan_sales` | Penjualan pangkalan | id, pangkalan_id, consumer_id, date |
| 15. | `pangkalan_expenses` | Pengeluaran pangkalan | id, pangkalan_id, category, amount |

**Relasi Utama:**
- `pangkalans` → `orders` (One-to-Many)
- `orders` → `order_items` (One-to-Many)
- `order_items` → `lpg_products` (Many-to-One)
- `orders` → `payments` (One-to-Many)
- `orders` → `timeline_tracks` (One-to-Many)
- `pangkalans` → `consumers` (One-to-Many)

**File Diagram:** `diagrams/SIM4LON_ERD.puml`

---

## B. Pemodelan Proses (UML Diagrams)

### 1. Use Case Diagram

Use Case Diagram menggambarkan interaksi antara aktor dengan sistem. SIM4LON memiliki **3 aktor utama** dengan **23 use case**:

**Aktor:**
| No | Aktor | Deskripsi | Jumlah Use Case |
|----|-------|-----------|-----------------|
| 1. | Admin | Pengelola sistem dengan akses penuh | 17 use case |
| 2. | Operator | Petugas operasional harian | 12 use case |
| 3. | Pangkalan | Mitra yang memesan LPG | 8 use case |

**Daftar Use Case:**

| Kode | Use Case | Aktor |
|------|----------|-------|
| UC-01 | Login | Admin, Operator, Pangkalan |
| UC-02 | Logout | Admin, Operator, Pangkalan |
| UC-03 | Kelola Profil | Admin, Operator, Pangkalan |
| UC-04 | Ubah Password | Admin, Operator, Pangkalan |
| UC-05 | Buat Pesanan | Admin, Operator |
| UC-06 | Buat Pesanan (Voice Order) | Admin, Operator |
| UC-07 | Lihat Daftar Pesanan | Admin, Operator, Pangkalan |
| UC-08 | Lihat Detail Pesanan | Admin, Operator, Pangkalan |
| UC-09 | Update Status Pesanan | Admin, Operator |
| UC-10 | Assign Driver | Admin, Operator |
| UC-11 | Catat Pembayaran | Admin, Operator |
| UC-12 | Cetak Nota/Invoice | Admin, Operator |
| UC-13 | Lihat Ringkasan Stok | Admin, Operator |
| UC-14 | Catat Penerimaan Stok | Admin, Operator |
| UC-15 | Catat Penyaluran | Admin, Operator |
| UC-16 | Lihat In-Out Agen | Admin, Operator |
| UC-17 | Kelola Pangkalan | Admin |
| UC-18 | Kelola Driver | Admin |
| UC-19 | Kelola Pengguna | Admin |
| UC-20 | Kelola Produk LPG | Admin |
| UC-21 | Generate Laporan | Admin, Operator |
| UC-22 | Export Laporan | Admin, Operator |
| UC-23 | Kelola Pengaturan | Admin |

**File Diagram:** `diagrams/SIM4LON_UseCase.puml`

---

### 2. Activity Diagram

Activity Diagram menggambarkan alur proses bisnis dalam sistem. Penulis membuat **26 Activity Diagram** untuk setiap proses utama:

#### Modul Admin/Operator:

| Kode | Nama Diagram | Deskripsi | File |
|------|--------------|-----------|------|
| AD-01 | Login | Alur proses login pengguna | `AD_01_Login.puml` |
| AD-02 | Buat Pesanan | Alur pembuatan pesanan manual | `AD_02_BuatPesanan.puml` |
| AD-03 | Update Status Pesanan | Alur perubahan status pesanan | `AD_03_UpdateStatusPesanan.puml` |
| AD-04 | Catat Pembayaran | Alur pencatatan pembayaran | `AD_04_CatatPembayaran.puml` |
| AD-05 | Catat Penerimaan Stok | Alur pencatatan tabung masuk dari SPBE | `AD_05_CatatPenerimaanStok.puml` |
| AD-06 | Catat Penyaluran | Alur pencatatan tabung keluar ke pangkalan | `AD_06_CatatPenyaluran.puml` |
| AD-07 | Catat Penjualan | Alur pencatatan penjualan pangkalan | `AD_07_CatatPenjualan.puml` |
| AD-08 | Buat Order ke Agen | Alur pangkalan membuat pesanan | `AD_08_BuatOrderKeAgen.puml` |
| AD-09 | Kelola Pangkalan | Alur CRUD data pangkalan | `AD_09_KelolaPangkalan.puml` |
| AD-10 | Ubah Password | Alur perubahan password | `AD_10_UbahPassword.puml` |
| AD-11 | Kelola Pengguna | Alur CRUD data pengguna | `AD_11_KelolaPengguna.puml` |
| AD-12 | Kelola Supir | Alur CRUD data driver | `AD_12_KelolaSupir.puml` |
| AD-13 | Kelola Produk LPG | Alur CRUD data produk | `AD_13_KelolaProdukLPG.puml` |
| AD-14 | Assign Driver | Alur penugasan driver ke pesanan | `AD_14_AssignDriver.puml` |
| AD-15 | Lihat Detail Pesanan | Alur melihat detail pesanan | `AD_15_LihatDetailPesanan.puml` |
| AD-16 | Generate Invoice | Alur pembuatan invoice | `AD_16_GenerateInvoice.puml` |
| AD-17 | Cetak Nota | Alur cetak nota pembayaran | `AD_17_CetakNota.puml` |
| AD-18 | Kelola Perencanaan | Alur perencanaan stok & jadwal | `AD_18_KelolaPerencanaan.puml` |
| AD-19 | Lihat In-Out Agen | Alur monitoring stok harian | `AD_19_LihatInOutAgen.puml` |

#### Modul Pangkalan:

| Kode | Nama Diagram | Deskripsi | File |
|------|--------------|-----------|------|
| AD-20 | Kelola Konsumen | Alur CRUD data konsumen | `AD_20_KelolaKonsumen.puml` |
| AD-21 | Kelola Stok Pangkalan | Alur pengelolaan stok pangkalan | `AD_21_KelolaStokPangkalan.puml` |
| AD-22 | Terima Order dari Agen | Alur penerimaan pesanan | `AD_22_TerimaOrderDariAgen.puml` |
| AD-23 | Kelola Pengeluaran | Alur pencatatan pengeluaran | `AD_23_KelolaPengeluaran.puml` |

#### Modul Laporan:

| Kode | Nama Diagram | Deskripsi | File |
|------|--------------|-----------|------|
| AD-24 | Generate Laporan | Alur pembuatan laporan | `AD_24_GenerateLaporan.puml` |
| AD-25 | Export Laporan | Alur export ke Excel/PDF | `AD_25_ExportLaporan.puml` |

#### Modul AI/Voice Order:

| Kode | Nama Diagram | Deskripsi | File |
|------|--------------|-----------|------|
| AD-VO | Voice Order dengan AI | Alur pemesanan menggunakan suara | `AD_VoiceOrder_AI.puml` |

---

### 3. Sequence Diagram

Sequence Diagram menggambarkan interaksi antar objek dalam urutan waktu. Penulis membuat **19 Sequence Diagram**:

| Kode | Nama Diagram | Deskripsi | File |
|------|--------------|-----------|------|
| SD-01 | Login | Proses autentikasi pengguna | `SD_01_Login.puml` |
| SD-02 | Logout | Proses logout dan invalidasi token | `SD_02_Logout.puml` |
| SD-03 | Create Order | Proses pembuatan pesanan baru | `SD_03_CreateOrder.puml` |
| SD-04 | Update Status | Proses update status pesanan | `SD_04_UpdateStatus.puml` |
| SD-05 | Assign Driver | Proses penugasan driver | `SD_05_AssignDriver.puml` |
| SD-06 | Get Order Detail | Proses mengambil detail pesanan | `SD_06_GetOrderDetail.puml` |
| SD-07 | Record Payment | Proses pencatatan pembayaran | `SD_07_RecordPayment.puml` |
| SD-08 | Generate Invoice | Proses pembuatan invoice | `SD_08_GenerateInvoice.puml` |
| SD-09 | Receive Stock | Proses penerimaan stok dari SPBE | `SD_09_ReceiveStock.puml` |
| SD-10 | Record Distribution | Proses penyaluran ke pangkalan | `SD_10_RecordDistribution.puml` |
| SD-11 | Get Stock Summary | Proses mengambil ringkasan stok | `SD_11_GetStockSummary.puml` |
| SD-12 | Record Sale | Proses pencatatan penjualan | `SD_12_RecordSale.puml` |
| SD-13 | Get Dashboard Data | Proses mengambil data dashboard | `SD_13_GetDashboard.puml` |
| SD-14 | CRUD Pangkalan | Proses CRUD data pangkalan | `SD_14_CRUDPangkalan.puml` |
| SD-15 | CRUD Driver | Proses CRUD data driver | `SD_15_CRUDDriver.puml` |
| SD-16 | CRUD User | Proses CRUD data pengguna | `SD_16_CRUDUser.puml` |
| SD-17 | CRUD Generic | Template CRUD generic | `SD_17_CRUDGeneric.puml` |
| SD-18 | Generate Export Report | Proses export laporan | `SD_18_GenerateExportReport.puml` |
| SD-VO | Voice Create Order | Proses Voice Order dengan AI | `SD_Voice_CreateOrder.puml` |

---

### 4. State Machine Diagram

State Machine Diagram menggambarkan status dan transisi entitas dalam sistem. Penulis membuat **4 State Machine Diagram**:

| Kode | Nama Diagram | Entitas | Status | File |
|------|--------------|---------|--------|------|
| SM-01 | Status Pesanan | Order | DRAFT → DIPROSES → SIAP → DIKIRIM → SELESAI | `SM_01_StatusPesanan.puml` |
| SM-02 | Payment Status | Payment | UNPAID → PARTIAL → PAID | `SM_02_PaymentStatus.puml` |
| SM-03 | Status Order ke Agen | Pangkalan Order | PENDING → CONFIRMED → READY → COMPLETED | `SM_03_StatusOrderKeAgen.puml` |
| SM-04 | User Session | Session | INACTIVE → ACTIVE → EXPIRED | `SM_04_UserSession.puml` |

---

### 5. Class Diagram

Class Diagram menggambarkan struktur statis sistem berupa class, atribut, method, dan relasi antar class. Penulis membuat **1 Class Diagram** dengan **22 classes** dan **7 enums**:

#### Daftar Class (22 Classes):

**Master Data (6 Classes):**
| No | Class | Deskripsi |
|----|-------|-----------|
| 1. | `User` | Data pengguna sistem dengan autentikasi |
| 2. | `CompanyProfile` | Profil perusahaan (agen) - singleton |
| 3. | `Pangkalan` | Data pangkalan/mitra distribusi |
| 4. | `Driver` | Data sopir pengiriman |
| 5. | `LpgProduct` | Master produk LPG |
| 6. | `LpgPrice` | Harga produk per pangkalan |

**Order Management (4 Classes):**
| No | Class | Deskripsi |
|----|-------|-----------|
| 7. | `Order` | Pesanan utama dari pangkalan |
| 8. | `OrderItem` | Item dalam pesanan |
| 9. | `TimelineTrack` | Riwayat status pesanan |
| 10. | `Invoice` | Faktur/nota pembayaran |

**Payment (2 Classes):**
| No | Class | Deskripsi |
|----|-------|-----------|
| 11. | `OrderPaymentDetail` | Detail pembayaran pesanan |
| 12. | `PaymentRecord` | Catatan transaksi pembayaran |

**Stock Management (4 Classes):**
| No | Class | Deskripsi |
|----|-------|-----------|
| 13. | `StockHistory` | Riwayat pergerakan stok agen |
| 14. | `PangkalanStock` | Stok per pangkalan |
| 15. | `PangkalanStockMovement` | Pergerakan stok pangkalan |
| 16. | `PenerimaanStok` | Penerimaan stok dari SPBE |

**Pangkalan SAAS Module (6 Classes):**
| No | Class | Deskripsi |
|----|-------|-----------|
| 17. | `Consumer` | Konsumen akhir pangkalan |
| 18. | `ConsumerOrder` | Penjualan ke konsumen |
| 19. | `Expense` | Pengeluaran operasional pangkalan |
| 20. | `AgenOrder` | Pesanan pangkalan ke agen |
| 21. | `PerencanaanHarian` | Perencanaan distribusi harian |
| 22. | `PenyaluranHarian` | Realisasi penyaluran harian |

#### Daftar Enum (7 Enums):

| No | Enum | Values |
|----|------|---------|
| 1. | `UserRole` | ADMIN, OPERATOR, PANGKALAN |
| 2. | `LpgCategory` | SUBSIDI, NON_SUBSIDI |
| 3. | `StatusPesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL |
| 4. | `PaymentMethod` | TUNAI, TRANSFER |
| 5. | `StockMovementType` | MASUK, KELUAR |
| 6. | `ConsumerType` | RUMAH_TANGGA, WARUNG |
| 7. | `AgenOrderStatus` | PENDING, DIKIRIM, DITERIMA, BATAL |

**File Diagram:** `diagrams/SIM4LON_ClassDiagram.puml`

---

## C. Diagram Arsitektur

### 1. Deployment Diagram

Deployment Diagram menggambarkan arsitektur fisik sistem termasuk server, database, dan koneksi jaringan:

**Komponen Deployment:**
| Komponen | Platform | Fungsi |
|----------|----------|--------|
| Frontend | Vercel Edge Network | Hosting aplikasi web |
| Backend API | Railway Container | REST API server |
| Database | Railway PostgreSQL | Penyimpanan data |
| AI Service | Google Cloud | Gemini AI untuk Voice Order |

**File Diagram:** `diagrams/SIM4LON_Deployment.puml`

### 2. Conceptual Model Diagram

Menggambarkan model konseptual sistem informasi terintegrasi.

**File Diagram:** `diagrams/SIM4LON_ConceptualModel.puml`

### 3. Model IIS (Integrated Information System)

Menggambarkan integrasi sistem informasi antara faktor operasional, teknologi, dan manajerial.

**File Diagram:** `diagrams/SIM4LON_ModelIIS.puml`

---

## D. Pemodelan Antarmuka (UI/UX Design)

Penulis membuat wireframe menggunakan **Balsamiq Mockup** untuk setiap halaman utama aplikasi. Berdasarkan **SIM4LON Page Analysis** (6 Januari 2026), total terdapat **43 halaman** yang terdiri dari:

### Modul Admin/Operator (34 halaman):

| No | Halaman | Deskripsi |
|----|---------|-----------|
| 1. | Login | Halaman login pengguna |
| 2. | Dashboard Admin | Ringkasan stok, pesanan, statistik |
| 3. | Buat Pesanan | Form pembuatan pesanan dengan Voice Order |
| 4. | Daftar Pesanan | Tabel pesanan dengan filter dan pencarian |
| 5. | Detail Pesanan | Informasi lengkap pesanan dengan timeline |
| 6. | Ringkasan Stok | Dashboard stok per kategori LPG |
| 7. | Penerimaan | Form penerimaan tabung dari SPBE |
| 8. | Penyaluran | Form penyaluran tabung ke pangkalan |
| 9. | In-Out Agen | Monitoring keluar masuk tabung harian |
| 10. | Pemakaian Stok | Tracking penggunaan stok internal |
| 11. | Daftar Pangkalan | Tabel data pangkalan dengan CRUD |
| 12. | Tambah Pangkalan | Form tambah pangkalan baru |
| 13. | Detail Pangkalan | Detail informasi pangkalan |
| 14. | Edit Pangkalan | Form edit data pangkalan |
| 15. | Daftar Driver | Tabel data sopir |
| 16. | Tambah Driver | Form tambah driver baru |
| 17. | Edit Driver | Form edit data driver |
| 18. | Daftar Pengguna | Tabel manajemen user |
| 19. | Tambah Pengguna | Form tambah user baru |
| 20. | Edit Pengguna | Form edit data user |
| 21. | Daftar Produk LPG | Master produk LPG |
| 22. | Catat Pembayaran | Form pencatatan pembayaran |
| 23. | Status Pembayaran | Monitoring status pembayaran |
| 24. | Nota Pembayaran | Preview dan cetak nota/invoice |
| 25. | Laporan | Dashboard laporan dengan filter |
| 26. | Export Laporan | Halaman export ke Excel/PDF |
| 27. | Tren Penjualan | Grafik analisis penjualan |
| 28. | Perencanaan | Halaman planning stok dan jadwal |
| 29. | Riwayat Aktivitas | Log aktivitas sistem |
| 30. | Notifikasi | Daftar notifikasi sistem |
| 31. | Pengaturan | Konfigurasi sistem |
| 32. | Profil Akun | Profil pengguna admin |
| 33. | Edit Profil | Form edit Profil Akun |
| 34. | Ubah Password | Form ubah password |

### Modul Pangkalan (9 halaman):

| No | Halaman | Deskripsi |
|----|---------|-----------|
| 1. | Dashboard Pangkalan | Ringkasan stok agen dan pesanan terbaru |
| 2. | Stok | Lihat stok tersedia di agen |
| 3. | Penjualan | Form catat penjualan ke konsumen |
| 4. | Daftar Penjualan | Riwayat penjualan pangkalan |
| 5. | Konsumen | Data pelanggan tetap |
| 6. | Tambah Konsumen | Form tambah konsumen baru |
| 7. | Hutang | Status hutang ke agen |
| 8. | Pengeluaran | Catat pengeluaran operasional |
| 9. | Laporan Pangkalan | Laporan penjualan pangkalan |

**Referensi Data:** [SIM4LON Page Analysis](file:///e:/DATA/Ngoding/sim4lon/docs/SIM4LON_Codebase_Analysis.md)

---

## Kesimpulan Tahap Modeling

Tahap Modeling menghasilkan dokumentasi desain sistem yang lengkap meliputi:

1. **1 ERD** dengan 22 entitas dan relasi lengkap
2. **1 Use Case Diagram** dengan 3 aktor dan 23 use case
3. **26 Activity Diagram** untuk setiap proses bisnis
4. **19 Sequence Diagram** untuk interaksi sistem
5. **4 State Machine Diagram** untuk status entitas
6. **1 Class Diagram** dengan 22 classes dan 7 enums
7. **3 Diagram Arsitektur** (Deployment, Conceptual, Model IIS)
8. **43 Wireframe** untuk antarmuka pengguna (34 Admin + 9 Pangkalan)

Semua diagram tersimpan dalam folder `diagrams/` dan dapat di-generate menggunakan PlantUML.

---
