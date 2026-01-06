# 3.3 Perancangan Sistem

> **Catatan**: Dokumen ini berisi perancangan sistem lengkap meliputi diagram UML, struktur database, dan desain antarmuka aplikasi SIM4LON.

---

## Pengantar Perancangan Sistem

Pada bagian ini dipaparkan perancangan sistem yang merupakan hasil dari tahap Modeling dalam metodologi Waterfall. Perancangan sistem mencakup pemodelan struktural dan behavioral menggunakan **Unified Modeling Language (UML)** sebagai standar notasi industri, serta desain antarmuka pengguna menggunakan wireframe.

Perancangan sistem SIM4LON dibuat dengan mempertimbangkan:
1. **Kebutuhan fungsional** yang teridentifikasi dari hasil wawancara
2. **Arsitektur multi-tenant** untuk mendukung agen dan pangkalan
3. **Skalabilitas** untuk pertumbuhan data dan pengguna
4. **Keamanan** dengan role-based access control

---

## 3.3.1 Entity Relationship Diagram (ERD)

*Entity Relationship Diagram* (ERD) merupakan diagram yang menggambarkan struktur database sistem, meliputi entitas-entitas, atribut, dan relasi antar entitas. Menurut Connolly dan Begg (2015), ERD adalah representasi grafis dari suatu model data yang menunjukkan hubungan antar entitas dalam sebuah sistem. ERD sangat penting dalam tahap perancangan database untuk memastikan integritas dan konsistensi data.

Berikut ini merupakan ERD dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya. Sistem ini menggunakan database **PostgreSQL** dengan total **23 entitas** yang dikelompokkan menjadi 6 kategori.

### Notasi ERD (Crow's Foot)

| Simbol | Notasi | Arti |
|--------|--------|------|
| `||` | One (mandatory) | Tepat satu |
| `|o` | Zero or One | Nol atau satu |
| `|{` | One or Many | Satu atau banyak |
| `o{` | Zero or Many | Nol atau banyak |

---

### A. Master Data (6 Entitas)

| No | Entitas | Primary Key | Deskripsi | Atribut Utama |
|----|---------|-------------|-----------|---------------|
| 1. | `users` | id (UUID) | Data pengguna sistem | code, email, password, name, role, pangkalan_id, session_id |
| 2. | `agen` | id (UUID) | Data agen LPG | code, name, address, pic_name, pic_phone |
| 3. | `pangkalans` | id (UUID) | Data pangkalan mitra | code, name, owner, address, phone, agen_id, alokasi_bulanan |
| 4. | `drivers` | id (UUID) | Data sopir pengiriman | code, name, phone, license_number, vehicle_id |
| 5. | `lpg_products` | id (UUID) | Master produk LPG | name, size_kg, category, selling_price, cost_price, brand |
| 6. | `company_profile` | id (UUID) | Profil perusahaan (singleton) | company_name, address, phone, ppn_rate, invoice_prefix |

---

### B. Order Management (4 Entitas)

| No | Entitas | Primary Key | Foreign Keys | Deskripsi |
|----|---------|-------------|--------------|-----------|
| 7. | `orders` | id (UUID) | pangkalan_id, driver_id | Data pesanan utama |
| 8. | `order_items` | id (UUID) | order_id | Item dalam pesanan |
| 9. | `timeline_tracks` | id (UUID) | order_id | Riwayat perubahan status pesanan |
| 10. | `invoices` | id (UUID) | order_id | Data faktur/invoice |

**Atribut Entitas `orders`:**
| Atribut | Tipe Data | Deskripsi |
|---------|-----------|-----------|
| code | String | Kode pesanan unik (auto-generate) |
| pangkalan_id | UUID | Referensi ke pangkalan |
| driver_id | UUID | Referensi ke driver (nullable) |
| current_status | Enum | Status: DRAFT, DIPROSES, SIAP, DIKIRIM, SELESAI, BATAL |
| subtotal | Decimal | Subtotal sebelum pajak |
| tax_amount | Decimal | Jumlah pajak (PPN) |
| total_amount | Decimal | Total setelah pajak |
| order_date | DateTime | Tanggal pesanan |
| notes | Text | Catatan tambahan |

---

### C. Payment (2 Entitas)

| No | Entitas | Primary Key | Foreign Keys | Deskripsi |
|----|---------|-------------|--------------|-----------|
| 11. | `order_payment_details` | id (UUID) | order_id | Summary pembayaran per order (1:1) |
| 12. | `payment_records` | id (UUID) | order_id, invoice_id, recorded_by_user_id | Riwayat transaksi pembayaran |

**Atribut Entitas `order_payment_details`:**
| Atribut | Tipe Data | Deskripsi |
|---------|-----------|-----------|
| is_paid | Boolean | Status lunas |
| is_dp | Boolean | Status DP (Down Payment) |
| amount_paid | Decimal | Jumlah yang sudah dibayar |
| amount_due | Decimal | Sisa tagihan |
| proof_url | String | URL bukti pembayaran |

---

### D. Stock Management (4 Entitas)

| No | Entitas | Primary Key | Foreign Keys | Deskripsi |
|----|---------|-------------|--------------|-----------|
| 13. | `stock_histories` | id (UUID) | lpg_product_id, recorded_by_user_id | Riwayat pergerakan stok agen |
| 14. | `penerimaan_stok` | id (UUID) | - | Penerimaan tabung dari SPBE |
| 15. | `perencanaan_harian` | id (UUID) | pangkalan_id | Perencanaan alokasi distribusi |
| 16. | `penyaluran_harian` | id (UUID) | pangkalan_id | Realisasi penyaluran ke pangkalan |

**Atribut Entitas `stock_histories`:**
| Atribut | Tipe Data | Deskripsi |
|---------|-----------|-----------|
| movement_type | Enum | Tipe: MASUK, KELUAR |
| qty | Integer | Jumlah tabung |
| reference_type | String | Tipe referensi (PENERIMAAN, PENYALURAN, MANUAL) |
| reference_id | UUID | ID referensi terkait |
| notes | Text | Keterangan |

---

### E. Pangkalan SAAS Module (6 Entitas)

| No | Entitas | Primary Key | Foreign Keys | Deskripsi |
|----|---------|-------------|--------------|-----------|
| 17. | `consumers` | id (UUID) | pangkalan_id | Data konsumen akhir |
| 18. | `consumer_orders` | id (UUID) | pangkalan_id, consumer_id | Penjualan ke konsumen |
| 19. | `pangkalan_stocks` | id (UUID) | pangkalan_id | Stok per pangkalan |
| 20. | `lpg_prices` | id (UUID) | pangkalan_id | Harga jual per pangkalan |
| 21. | `expenses` | id (UUID) | pangkalan_id | Pengeluaran operasional |
| 22. | `agen_orders` | id (UUID) | pangkalan_id, agen_id | Order pangkalan ke agen |

---

### F. Audit (1 Entitas)

| No | Entitas | Primary Key | Foreign Keys | Deskripsi |
|----|---------|-------------|--------------|-----------|
| 23. | `activity_logs` | id (UUID) | user_id, order_id | Log aktivitas untuk audit trail |

---

### Relasi Antar Entitas (26 Relasi)

| No | Entitas A | Cardinality | Entitas B | Deskripsi |
|----|-----------|:-----------:|-----------|-----------|
| 1. | `agen` | 1 : 0..* | `pangkalans` | Satu agen memiliki banyak pangkalan |
| 2. | `pangkalans` | 1 : 0..* | `users` | Satu pangkalan memiliki banyak user |
| 3. | `pangkalans` | 1 : 0..* | `orders` | Satu pangkalan menempatkan banyak pesanan |
| 4. | `drivers` | 1 : 0..* | `orders` | Satu driver mengantarkan banyak pesanan |
| 5. | `orders` | 1 : 1..* | `order_items` | Satu pesanan memiliki minimal satu item |
| 6. | `orders` | 1 : 0..* | `timeline_tracks` | Satu pesanan memiliki banyak riwayat status |
| 7. | `orders` | 1 : 0..* | `invoices` | Satu pesanan menghasilkan banyak invoice |
| 8. | `orders` | 1 : 0..1 | `order_payment_details` | Satu pesanan memiliki maksimal satu summary pembayaran |
| 9. | `orders` | 1 : 0..* | `payment_records` | Satu pesanan menerima banyak pembayaran |
| 10. | `invoices` | 1 : 0..* | `payment_records` | Satu invoice menerima banyak pembayaran |
| 11. | `users` | 1 : 0..* | `payment_records` | Satu user mencatat banyak pembayaran |
| 12. | `users` | 1 : 0..* | `stock_histories` | Satu user mencatat banyak pergerakan stok |
| 13. | `users` | 1 : 0..* | `activity_logs` | Satu user menghasilkan banyak log aktivitas |
| 14. | `orders` | 1 : 0..* | `activity_logs` | Satu pesanan menghasilkan banyak log aktivitas |
| 15. | `lpg_products` | 1 : 0..* | `stock_histories` | Satu produk dilacak di banyak histori stok |
| 16. | `pangkalans` | 1 : 0..* | `consumers` | Satu pangkalan melayani banyak konsumen |
| 17. | `consumers` | 1 : 0..* | `consumer_orders` | Satu konsumen menempatkan banyak pesanan |
| 18. | `pangkalans` | 1 : 0..* | `consumer_orders` | Satu pangkalan menjual ke banyak pesanan konsumen |
| 19. | `pangkalans` | 1 : 0..* | `lpg_prices` | Satu pangkalan mengatur banyak harga |
| 20. | `pangkalans` | 1 : 0..* | `pangkalan_stocks` | Satu pangkalan mengelola banyak stok |
| 21. | `pangkalans` | 1 : 0..* | `pangkalan_stock_movements` | Satu pangkalan melacak banyak pergerakan stok |
| 22. | `pangkalans` | 1 : 0..* | `expenses` | Satu pangkalan mengeluarkan banyak biaya |
| 23. | `pangkalans` | 1 : 0..* | `penyaluran_harian` | Satu pangkalan mendistribusikan banyak penyaluran |
| 24. | `pangkalans` | 1 : 0..* | `perencanaan_harian` | Satu pangkalan merencanakan banyak perencanaan |
| 25. | `agen` | 1 : 0..* | `agen_orders` | Satu agen menerima banyak order dari pangkalan |
| 26. | `pangkalans` | 1 : 0..* | `agen_orders` | Satu pangkalan menempatkan banyak order ke agen |

**File Diagram:** `diagrams/SIM4LON_ERD.puml`

---

## 3.3.2 Use Case Diagram

*Use case diagram* merupakan diagram yang mendeskripsikan aktor dan sistem pada aplikasi yang akan dibuat, berguna untuk membantu memahami kebutuhan dari aktor atau pengguna pada sistem. Menurut Sommerville (2016), *use case* merupakan dasar dari diagram lain yang menggambarkan interaksi antara sistem dan lingkungannya.

Berikut ini merupakan *use case diagram* dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya. Berikut aktor list serta *use case scenario* dari sistem yang akan dibangun.

### Aktor Sistem

SIM4LON memiliki **3 aktor utama** dengan hak akses berbeda:

| No | Aktor | Deskripsi | Hak Akses |
|----|-------|-----------|-----------|
| 1. | **Admin** | Administrator sistem | Full access ke seluruh fitur termasuk master data dan konfigurasi sistem |
| 2. | **Operator** | Staff operasional agen | Akses operasional: pesanan, stok, pembayaran, laporan |
| 3. | **Pangkalan** | Pemilik/pengelola pangkalan LPG | Akses terbatas pada data milik sendiri dan fitur SAAS |

---

### Daftar Use Case (23 Use Case)

#### A. Use Case Semua Aktor

| Kode | Use Case | Deskripsi | Admin | Operator | Pangkalan |
|------|----------|-----------|:-----:|:--------:|:---------:|
| UC-01 | Login | Masuk ke sistem dengan autentikasi | ✅ | ✅ | ✅ |
| UC-02 | Logout | Keluar dari sistem | ✅ | ✅ | ✅ |
| UC-03 | Kelola Profil | Melihat dan mengubah data profil | ✅ | ✅ | ✅ |
| UC-04 | Ubah Password | Mengubah password akun | ✅ | ✅ | ✅ |

#### B. Use Case Admin Only

| Kode | Use Case | Deskripsi |
|------|----------|-----------|
| UC-05 | Kelola Pengguna | CRUD data pengguna sistem |
| UC-06 | Kelola Pangkalan | CRUD data pangkalan mitra |
| UC-07 | Kelola Driver | CRUD data sopir pengiriman |
| UC-08 | Kelola Produk LPG | CRUD data produk LPG |
| UC-09 | Lihat Log Aktivitas | Memonitor aktivitas pengguna |
| UC-10 | Kelola Pengaturan | Konfigurasi sistem dan profil perusahaan |

#### C. Use Case Admin + Operator

| Kode | Use Case | Deskripsi | Admin | Operator |
|------|----------|-----------|:-----:|:--------:|
| UC-11 | Lihat Dashboard | Ringkasan stok, pesanan, KPI | ✅ | ✅ |
| UC-12 | Buat Pesanan | Membuat pesanan baru | ✅ | ✅ |
| UC-13 | Buat Pesanan (Voice Order) | Membuat pesanan dengan suara | ✅ | ✅ |
| UC-14 | Lihat Daftar Pesanan | Melihat semua pesanan | ✅ | ✅ |
| UC-15 | Update Status Pesanan | Mengubah status pesanan | ✅ | ✅ |
| UC-16 | Assign Driver | Menugaskan driver ke pesanan | ✅ | ✅ |
| UC-17 | Catat Pembayaran | Mencatat pembayaran pesanan | ✅ | ✅ |
| UC-18 | Cetak Nota | Mencetak invoice/nota | ✅ | ✅ |
| UC-19 | Kelola Stok | Monitoring dan pencatatan stok | ✅ | ✅ |
| UC-20 | Generate Laporan | Membuat laporan penjualan/stok | ✅ | ✅ |

#### D. Use Case Pangkalan Only

| Kode | Use Case | Deskripsi |
|------|----------|-----------|
| UC-21 | Kelola Penjualan | Mencatat penjualan ke konsumen akhir |
| UC-22 | Kelola Konsumen | CRUD data konsumen tetap |
| UC-23 | Lihat Stok Agen | Melihat ketersediaan stok di agen |

---

### Relasi Use Case

#### Include Relationship
| Use Case Utama | Include | Deskripsi |
|----------------|---------|-----------|
| UC-12 Buat Pesanan | UC-15 Update Status | Pembuatan pesanan otomatis membuat status DRAFT |
| UC-17 Catat Pembayaran | UC-15 Update Status | Pembayaran lunas mengubah status pesanan |

#### Extend Relationship
| Use Case Utama | Extension Point | Extension | Kondisi |
|----------------|-----------------|-----------|---------|
| UC-15 Update Status | Siap Kirim | UC-16 Assign Driver | Ketika status = SIAP_KIRIM |
| UC-17 Catat Pembayaran | Lunas | UC-18 Cetak Nota | Ketika is_paid = true |
| UC-12 Buat Pesanan | Voice Input | UC-13 Voice Order | Ketika mode voice aktif |

---

### Matriks Akses Lengkap

| Use Case | Admin | Operator | Pangkalan |
|----------|:-----:|:--------:|:---------:|
| Login | ✅ | ✅ | ✅ |
| Logout | ✅ | ✅ | ✅ |
| Kelola Profil | ✅ | ✅ | ✅ |
| Ubah Password | ✅ | ✅ | ✅ |
| Kelola Pengguna | ✅ | ❌ | ❌ |
| Kelola Pangkalan | ✅ | ❌ | ❌ |
| Kelola Driver | ✅ | ❌ | ❌ |
| Kelola Produk LPG | ✅ | ❌ | ❌ |
| Lihat Log Aktivitas | ✅ | ❌ | ❌ |
| Kelola Pengaturan | ✅ | ❌ | ❌ |
| Lihat Dashboard | ✅ | ✅ | ✅* |
| Buat Pesanan | ✅ | ✅ | ❌ |
| Voice Order | ✅ | ✅ | ❌ |
| Lihat Daftar Pesanan | ✅ | ✅ | ✅* |
| Update Status | ✅ | ✅ | ❌ |
| Assign Driver | ✅ | ✅ | ❌ |
| Catat Pembayaran | ✅ | ✅ | ❌ |
| Cetak Nota | ✅ | ✅ | ❌ |
| Kelola Stok | ✅ | ✅ | ❌ |
| Generate Laporan | ✅ | ✅ | ✅* |
| Kelola Penjualan | ❌ | ❌ | ✅ |
| Kelola Konsumen | ❌ | ❌ | ✅ |
| Lihat Stok Agen | ❌ | ❌ | ✅ |

> *\* Pangkalan hanya dapat mengakses data milik sendiri (multi-tenant)*

**File Diagram:** `diagrams/SIM4LON_UseCase.puml`

---

## 3.3.3 Class Diagram

*Class diagram* merupakan diagram yang memodelkan struktur statis sistem dan menggambarkan hubungan antar *class* dalam paradigma *Object-Oriented Programming* (OOP). Menurut Pressman dan Maxim (2020), *class diagram* merupakan representasi struktural dari sistem yang menunjukkan *class*, atribut, operasi, dan relasi antar *class*. Diagram ini sangat penting untuk memahami arsitektur perangkat lunak sebelum tahap implementasi.

Berikut ini merupakan *class diagram* dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya. Berikut daftar *class* beserta deskripsi dari sistem yang akan dibangun.

### Daftar Class (23 Classes)

#### A. Master Data (6 Classes)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 1. | `User` | -id, -email, -password, -role, -name | +login(), +logout(), +updateProfile() |
| 2. | `CompanyProfile` | -id, -name, -address, -ppn_rate | +getProfile(), +updateProfile() |
| 3. | `Pangkalan` | -id, -code, -name, -owner, -address | +getOrders(), +getStock(), +placeOrder() |
| 4. | `Driver` | -id, -code, -name, -phone, -vehicle | +getAssignedOrders(), +updateLocation() |
| 5. | `LpgProduct` | -id, -name, -size_kg, -category, -price | +getStock(), +updatePrice() |
| 6. | `LpgPrice` | -id, -pangkalan_id, -cost_price, -selling_price | +calculateProfit() |

#### B. Order Management (4 Classes)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 7. | `Order` | -id, -code, -status, -total_amount | +create(), +updateStatus(), +assignDriver(), +getTimeline() |
| 8. | `OrderItem` | -id, -order_id, -lpg_type, -qty, -price | +calculateSubtotal() |
| 9. | `TimelineTrack` | -id, -order_id, -status, -timestamp | +addTrack() |
| 10. | `Invoice` | -id, -order_id, -invoice_number, -grand_total | +generate(), +print() |

#### C. Payment (2 Classes)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 11. | `OrderPaymentDetail` | -id, -is_paid, -is_dp, -amount_paid | +recordPayment(), +checkStatus() |
| 12. | `PaymentRecord` | -id, -amount, -method, -proof_url | +create(), +attachProof() |

#### D. Stock Management (4 Classes)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 13. | `StockHistory` | -id, -movement_type, -qty, -reference | +recordMovement() |
| 14. | `PangkalanStock` | -id, -lpg_type, -qty, -warning_level | +updateStock(), +checkLevel() |
| 15. | `PangkalanStockMovement` | -id, -movement_type, -qty | +record() |
| 16. | `PenerimaanStok` | -id, -no_so, -no_lo, -qty | +receive(), +validate() |

#### E. Pangkalan SAAS Module (6 Classes)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 17. | `Consumer` | -id, -name, -nik, -consumer_type | +getOrderHistory() |
| 18. | `ConsumerOrder` | -id, -lpg_type, -qty, -total | +create(), +complete() |
| 19. | `Expense` | -id, -category, -amount, -date | +record(), +getTotal() |
| 20. | `AgenOrder` | -id, -qty_ordered, -status | +create(), +receive() |
| 21. | `PerencanaanHarian` | -id, -tanggal, -jumlah | +create(), +approve() |
| 22. | `PenyaluranHarian` | -id, -tanggal, -jumlah | +record() |

#### F. Audit (1 Class)

| No | Class | Atribut Utama | Method Utama |
|----|-------|---------------|--------------|
| 23. | `ActivityLog` | -id, -user_id, -order_id, -type, -title | +create(), +getByUser(), +getByOrder() |

---

### Daftar Enumeration (7 Enums)

| No | Enum | Values | Deskripsi |
|----|------|--------|-----------|
| 1. | `UserRole` | ADMIN, OPERATOR, PANGKALAN | Role pengguna sistem |
| 2. | `StatusPesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL | Status workflow pesanan |
| 3. | `LpgCategory` | SUBSIDI, NON_SUBSIDI | Kategori produk LPG |
| 4. | `PaymentMethod` | TUNAI, TRANSFER | Metode pembayaran |
| 5. | `StockMovementType` | MASUK, KELUAR | Tipe pergerakan stok |
| 6. | `ConsumerType` | RUMAH_TANGGA, WARUNG | Tipe konsumen akhir |
| 7. | `AgenOrderStatus` | PENDING, DIKIRIM, DITERIMA, BATAL | Status order ke agen |

---

### Relasi Antar Class

| Class A | Relasi | Class B | Cardinality | Deskripsi |
|---------|:------:|---------|:-----------:|-----------|
| `Pangkalan` | ─── | `Order` | 1 : * | Pangkalan places many Orders |
| `Order` | ◆─── | `OrderItem` | 1 : * | Order contains many Items (composition) |
| `Order` | ◆─── | `TimelineTrack` | 1 : * | Order has many Timeline entries |
| `Order` | ─── | `OrderPaymentDetail` | 1 : 1 | Order has one Payment Summary |
| `Order` | ─── | `PaymentRecord` | 1 : * | Order can have many Payment Records |
| `Order` | ─── | `Driver` | * : 1 | Many Orders assigned to one Driver |
| `Pangkalan` | ◇─── | `Consumer` | 1 : * | Pangkalan has many Consumers |
| `User` | ..\> | `UserRole` | | User depends on UserRole enum |
| `Order` | ..\> | `StatusPesanan` | | Order depends on StatusPesanan enum |

**File Diagram:** `diagrams/SIM4LON_ClassDiagram.puml`

---

## 3.3.4 Activity Diagram

*Activity diagram* merupakan diagram yang memodelkan suatu sistem dan menggambarkan aktivitas sistem berjalan secara berurutan sesuai dengan *use case diagram*. Menurut Dennis et al. (2015), *activity diagram* adalah diagram yang menunjukkan urutan aktivitas dalam sebuah proses, termasuk aktivitas paralel dan percabangan keputusan.

Berikut ini merupakan *activity diagram* dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya.

### Komponen Activity Diagram

| Komponen | Simbol | Deskripsi |
|----------|--------|-----------|
| **Initial Node** | ● | Titik awal proses |
| **Final Node** | ◉ | Titik akhir proses |
| **Action** | ▭ | Aktivitas/langkah |
| **Decision** | ◇ | Percabangan kondisi |
| **Fork/Join** | ▬ | Parallel execution |
| **Swimlane** | Kolom vertikal | Pembagian tanggung jawab per aktor |

---

### Daftar Activity Diagram (26 Diagram)

| No | Kode | Nama Diagram | Kategori | Aktor | File |
|----|------|--------------|----------|-------|------|
| 1. | AD-01 | Login | Core Business | User, System | `AD_01_Login.puml` |
| 2. | AD-02 | Buat Pesanan | Core Business | Admin/Operator, System | `AD_02_BuatPesanan.puml` |
| 3. | AD-03 | Update Status Pesanan | Core Business | Admin/Operator, System | `AD_03_UpdateStatusPesanan.puml` |
| 4. | AD-04 | Catat Pembayaran | Core Business | Admin/Operator, System | `AD_04_CatatPembayaran.puml` |
| 5. | AD-05 | Catat Penerimaan Stok | Core Business | Admin/Operator, System | `AD_05_CatatPenerimaanStok.puml` |
| 6. | AD-06 | Catat Penyaluran | Core Business | Admin/Operator, System | `AD_06_CatatPenyaluran.puml` |
| 7. | AD-07 | Catat Penjualan | Core Business | Pangkalan, System | `AD_07_CatatPenjualan.puml` |
| 8. | AD-09 | Kelola Pangkalan | Core Business | Admin, System | `AD_09_KelolaPangkalan.puml` |
| 9. | AD-14 | Assign Driver | Core Business | Admin/Operator, System | `AD_14_AssignDriver.puml` |
| 10. | AD-VO | Voice Order AI | Core Business | User, AI Service, System | `AD_VoiceOrder_AI.puml` |
| 11. | AD-10 | Ubah Password | Master Data | User, System | `AD_10_UbahPassword.puml` |
| 12. | AD-11 | Kelola Pengguna | Master Data | Admin, System | `AD_11_KelolaPengguna.puml` |
| 13. | AD-12 | Kelola Driver | Master Data | Admin, System | `AD_12_KelolaSupir.puml` |
| 14. | AD-13 | Kelola Produk LPG | Master Data | Admin, System | `AD_13_KelolaProdukLPG.puml` |
| 15. | AD-20 | Kelola Konsumen | Master Data | Pangkalan, System | `AD_20_KelolaKonsumen.puml` |
| 16. | AD-21 | Kelola Stok Pangkalan | Master Data | Pangkalan, System | `AD_21_KelolaStokPangkalan.puml` |
| 17. | AD-08 | Buat Order ke Agen | Extended | Pangkalan, System | `AD_08_BuatOrderKeAgen.puml` |
| 18. | AD-15 | Lihat Detail Pesanan | Extended | Admin/Operator, System | `AD_15_LihatDetailPesanan.puml` |
| 19. | AD-16 | Generate Invoice | Extended | Admin/Operator, System | `AD_16_GenerateInvoice.puml` |
| 20. | AD-17 | Cetak Nota | Extended | Admin/Operator, System | `AD_17_CetakNota.puml` |
| 21. | AD-18 | Kelola Perencanaan | Extended | Pangkalan, System | `AD_18_KelolaPerencanaan.puml` |
| 22. | AD-19 | Lihat In-Out Agen | Extended | Admin/Operator, System | `AD_19_LihatInOutAgen.puml` |
| 23. | AD-22 | Terima Order dari Agen | Extended | Pangkalan, System | `AD_22_TerimaOrderDariAgen.puml` |
| 24. | AD-23 | Kelola Pengeluaran | Extended | Pangkalan, System | `AD_23_KelolaPengeluaran.puml` |
| 25. | AD-24 | Generate Laporan | Extended | Admin/Operator, System | `AD_24_GenerateLaporan.puml` |
| 26. | AD-25 | Export Laporan | Extended | Admin/Operator, System | `AD_25_ExportLaporan.puml` |

---

### Detail Activity Diagram

Berikut ini merupakan penjelasan detail untuk setiap *activity diagram* yang menggambarkan alur aktivitas pada sistem SIM4LON.

#### a. Login

![AD-01 Login](../diagrams/exports/AD_01_Login.png)
*Gambar 3.x Activity Diagram Login*

Pada gambar 3.x menunjukkan aktivitas login untuk aktor Admin, Operator, dan Pangkalan. Dimulai dengan **User** membuka halaman Login kemudian mengisi form login dengan memasukkan email dan password. Selanjutnya **Sistem** memvalidasi format input. Jika format tidak valid maka sistem akan menampilkan pesan error format dan user harus mengisi ulang form login.

Jika format valid, sistem akan mencari user berdasarkan email dalam database. Jika user tidak ditemukan maka sistem menampilkan pesan "Email atau password salah". Jika user ditemukan, sistem akan mengecek status akun. Apabila akun tidak aktif maka sistem menampilkan pesan "Akun tidak aktif" dan proses berakhir.

Jika akun aktif, sistem selanjutnya memvalidasi password. Apabila password tidak cocok maka sistem menampilkan pesan "Email atau password salah". Jika password benar, sistem akan generate session_id baru, menyimpan session ke database (dengan invalidasi session lama untuk mendukung single-session login), generate JWT token, dan mencatat log aktivitas login. Terakhir, user diarahkan ke halaman Dashboard sesuai dengan role-nya masing-masing.

---

#### b. Buat Pesanan

![AD-02 Buat Pesanan](../diagrams/exports/AD_02_BuatPesanan.png)
*Gambar 3.x Activity Diagram Buat Pesanan*

Pada gambar 3.x menunjukkan aktivitas membuat pesanan baru untuk aktor Admin dan Operator. Dimulai dengan **User** membuka halaman Pesanan kemudian mengklik tombol "Buat Pesanan Baru". Selanjutnya **Sistem** menampilkan form pesanan dan melakukan load data pangkalan aktif serta daftar produk LPG yang tersedia.

**User** kemudian memilih pangkalan tujuan dari dropdown, memilih jenis LPG, dan memasukkan jumlah (quantity). Jika ingin menambah item lain, user dapat mengklik "Tambah Item" dan mengulangi proses pemilihan jenis LPG dan input jumlah. User juga dapat menambahkan catatan (opsional) sebelum mengklik tombol "Simpan".

Setelah user menekan tombol simpan, **Sistem** akan melakukan validasi input secara berurutan:
1. Jika pangkalan belum dipilih, sistem menampilkan error "Pilih pangkalan"
2. Jika tidak ada item LPG yang ditambahkan, sistem menampilkan error "Tambahkan minimal 1 item"
3. Jika quantity tidak valid (≤ 0), sistem menampilkan error "Jumlah harus > 0"

Jika semua validasi berhasil, sistem akan melakukan proses berikut:
- Generate kode pesanan dengan format ORD-XXXX
- Menghitung subtotal per item
- Menghitung PPN (12% untuk produk non-subsidi)
- Menghitung total amount
- Menyimpan pesanan dengan status DRAFT
- Membuat timeline track "Pesanan Dibuat"
- Mencatat log aktivitas "order_created"

Terakhir, sistem menampilkan pesan sukses dan user diarahkan ke halaman detail pesanan yang baru dibuat.

---


## 3.3.5 Sequence Diagram

*Sequence diagram* merupakan diagram yang menggambarkan interaksi antar objek dalam urutan waktu. Menurut Fowler (2018), *sequence diagram* menunjukkan bagaimana objek-objek berinteraksi dalam skenario tertentu dari sebuah *use case*. Diagram ini sangat berguna untuk memahami alur proses dan pertukaran pesan antar komponen sistem.

Berikut ini merupakan *sequence diagram* dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya.

### Stereotype Participant

| Stereotype | Simbol | Deskripsi | Contoh |
|------------|--------|-----------|--------|
| `<<actor>>` | 🧑 | Pengguna sistem | User, Admin |
| `<<boundary>>` | ◻ | Antarmuka pengguna | LoginPage, OrderForm |
| `<<control>>` | ◎ | Business logic | AuthService, OrderService |
| `<<entity>>` | ⬡ | Data/Database | users, orders |

### Message Types

| Tipe | Simbol | Deskripsi |
|------|--------|-----------|
| Synchronous | ──▶ | Request blocking (menunggu response) |
| Return | ---> | Response dari request |
| Self-call | ↩ | Memanggil method sendiri |
| Create | ──▶▷ | Membuat instance baru |

---

### Daftar Sequence Diagram (19 Diagram)

| No | Kode | Nama Diagram | Kategori | Participants | File |
|----|------|--------------|----------|--------------|------|
| 1. | SD-01 | Login | Authentication | User, LoginPage, AuthService, UserRepo, JWT | `SD_01_Login.puml` |
| 2. | SD-02 | Logout | Authentication | User, AuthService, SessionManager | `SD_02_Logout.puml` |
| 3. | SD-17 | CRUD Generic | Authentication | Admin, Service, Repository, Database | `SD_17_CRUDGeneric.puml` |
| 4. | SD-03 | Create Order | Order Management | User, OrderPage, OrderService, OrderRepo | `SD_03_CreateOrder.puml` |
| 5. | SD-04 | Update Status | Order Management | User, OrderService, TimelineRepo | `SD_04_UpdateStatus.puml` |
| 6. | SD-05 | Assign Driver | Order Management | User, OrderService, DriverRepo | `SD_05_AssignDriver.puml` |
| 7. | SD-06 | Get Order Detail | Order Management | User, OrderService, OrderRepo | `SD_06_GetOrderDetail.puml` |
| 8. | SD-07 | Record Payment | Order Management | User, PaymentService, PaymentRepo | `SD_07_RecordPayment.puml` |
| 9. | SD-08 | Generate Invoice | Order Management | User, InvoiceService, InvoiceRepo | `SD_08_GenerateInvoice.puml` |
| 10. | SD-09 | Receive Stock | Stock Management | User, StockService, StockRepo | `SD_09_ReceiveStock.puml` |
| 11. | SD-10 | Record Distribution | Stock Management | User, StockService, DistributionRepo | `SD_10_RecordDistribution.puml` |
| 12. | SD-11 | Get Stock Summary | Stock Management | User, StockService, StockRepo | `SD_11_GetStockSummary.puml` |
| 13. | SD-12 | Record Sale | Extended | Pangkalan, SaleService, ConsumerOrderRepo | `SD_12_RecordSale.puml` |
| 14. | SD-13 | Get Dashboard | Extended | User, DashboardService, Multiple Repos | `SD_13_GetDashboard.puml` |
| 15. | SD-14 | CRUD Pangkalan | Extended | Admin, PangkalanService, PangkalanRepo | `SD_14_CRUDPangkalan.puml` |
| 16. | SD-15 | CRUD Driver | Extended | Admin, DriverService, DriverRepo | `SD_15_CRUDDriver.puml` |
| 17. | SD-16 | CRUD User | Extended | Admin, UserService, UserRepo | `SD_16_CRUDUser.puml` |
| 18. | SD-18 | Generate Export Report | Extended | User, ReportService, ReportGenerator | `SD_18_GenerateExportReport.puml` |
| 19. | SD-VO | Voice Create Order | Extended | User, VoiceService, GeminiAI, OrderService | `SD_Voice_CreateOrder.puml` |

---

### Contoh: SD-01 Login

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SEQUENCE DIAGRAM: LOGIN                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User         LoginPage        AuthService      UserRepo       JWT      │
│   |               |                |               |            |       │
│   |──1.input───-->|                |               |            |       │
│   |               |──2.login()────>|               |            |       │
│   |               |                |──3.findByEmail>|            |       │
│   |               |                |<──user data──|            |       │
│   |               |                |                            |       │
│   |               |                |──4.compare password──────>|       │
│   |               |                |                            |       │
│   |               |                |   [alt] password valid     |       │
│   |               |                |   |                        |       │
│   |               |                |   |──5.generateToken()────>|       │
│   |               |                |   |<──access_token────────|       │
│   |               |                |   |                        |       │
│   |               |                |──6.updateSession()──>|     |       │
│   |               |<──token + user data──|               |      |       │
│   |<──redirect──|                |               |            |       │
│   |               |                |               |            |       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.3.6 State Machine Diagram

*State machine diagram* merupakan diagram yang menggambarkan siklus hidup (*lifecycle*) suatu objek dengan menunjukkan berbagai *state* dan transisi yang mungkin terjadi. Menurut Pressman dan Maxim (2020), *state machine diagram* merepresentasikan perilaku dinamis dari suatu objek dengan menunjukkan respons objek terhadap berbagai *event*.

Berikut ini merupakan *state machine diagram* dari Aplikasi SIM4LON berbasis web di PT Mitra Surya Natasya.

### Komponen State Machine

| Komponen | Simbol | Deskripsi |
|----------|--------|-----------|
| **Initial State** | ● | State awal |
| **Final State** | ◉ | State akhir |
| **State** | ▭ | Kondisi objek |
| **Transition** | → | Perpindahan state |
| **Guard** | [condition] | Kondisi untuk transisi |
| **Action** | /action | Aksi yang dilakukan |

---

### Daftar State Machine Diagram (4 Diagram)

| No | Kode | Nama Diagram | Entitas | Jumlah State | File |
|----|------|--------------|---------|--------------|------|
| 1. | SM-01 | Status Pesanan | Order | 7 states | `SM_01_StatusPesanan.puml` |
| 2. | SM-02 | Payment Status | Payment | 3 states | `SM_02_PaymentStatus.puml` |
| 3. | SM-03 | Status Order ke Agen | AgenOrder | 4 states | `SM_03_StatusOrderKeAgen.puml` |
| 4. | SM-04 | User Session | Session | 4 states | `SM_04_UserSession.puml` |

---

### SM-01: Status Pesanan (Order Workflow)

```
                              ┌──────────────────────────────────────┐
                              │                                      │
                              ▼                                      │
[*] ──→ DRAFT ──[submit]──→ MENUNGGU_PEMBAYARAN                      │
                              │                                      │
                              │ [pay]                                │
                              ▼                                      │
                           DIPROSES ──[cancel]─────────────────────→ BATAL
                              │                                      │
                              │ [ready]                              │
                              ▼                                      │
                          SIAP_KIRIM ──[assign driver]──→ DIKIRIM    │
                                                            │        │
                                                   [deliver] │        │
                                                            ▼        │
                                                        SELESAI ──→ [*]
```

**State Details:**
| State | Deskripsi | Next State | Trigger |
|-------|-----------|------------|---------|
| DRAFT | Pesanan baru dibuat | MENUNGGU_PEMBAYARAN | submit |
| MENUNGGU_PEMBAYARAN | Menunggu pembayaran | DIPROSES | pay |
| DIPROSES | Sedang diproses | SIAP_KIRIM, BATAL | ready, cancel |
| SIAP_KIRIM | Siap untuk dikirim | DIKIRIM | assign driver |
| DIKIRIM | Dalam pengiriman | SELESAI | deliver |
| SELESAI | Pesanan selesai | - | - |
| BATAL | Pesanan dibatalkan | - | - |

---

### SM-02: Payment Status

```
                   ┌─────────────────────────────────────┐
                   │                                     │
                   ▼                                     │
[*] ──→ UNPAID ──[pay partial]──→ PARTIAL_PAID          │
          │                            │                │
          │                            │ [pay rest]     │
          │ [pay full]                 │                │
          │                            ▼                │
          └──────────────────────→ PAID ──────────────→ [*]
```

**State Details:**
| State | is_paid | is_dp | Deskripsi |
|-------|---------|-------|-----------|
| UNPAID | false | false | Belum ada pembayaran |
| PARTIAL_PAID | false | true | Sudah DP, belum lunas |
| PAID | true | false | Lunas |

---

## 3.3.7 Deployment Diagram

### Deskripsi

Deployment Diagram menggambarkan arsitektur fisik sistem, meliputi node (server), artifact (komponen), dan koneksi jaringan.

### Arsitektur Deployment SIM4LON

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        INTERNET (HTTPS)                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    BROWSER      │    │     VERCEL      │    │   GOOGLE CLOUD  │
│    (Client)     │    │   (Frontend)    │    │   (Gemini AI)   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Chrome        │    │ • Edge Network  │    │ • Gemini 2.0    │
│ • Firefox       │◄──►│ • CDN Global    │    │ • Flash Model   │
│ • Safari        │    │ • SSL/TLS       │    │ • REST API      │
│ • Edge          │    │                 │    │                 │
└─────────────────┘    └────────┬────────┘    └────────┬────────┘
                                │ HTTPS                │ HTTPS
                                ▼                      │
                       ┌─────────────────┐             │
                       │    RAILWAY      │◄────────────┘
                       │   (Backend)     │
                       ├─────────────────┤
                       │ • NestJS 11     │
                       │ • REST API      │
                       │ • JWT Auth      │
                       │ • Prisma ORM    │
                       └────────┬────────┘
                                │ TCP/5432
                                ▼
                       ┌─────────────────┐
                       │    RAILWAY      │
                       │  (PostgreSQL)   │
                       ├─────────────────┤
                       │ • PostgreSQL 15 │
                       │ • 23 Tables     │
                       │ • UUID Support  │
                       └─────────────────┘
```

---

### Spesifikasi Node

| Node | Platform | Teknologi | Fungsi |
|------|----------|-----------|--------|
| **Client Browser** | User Device | Chrome, Firefox, Safari, Edge | Akses aplikasi web |
| **Vercel** | Cloud | Edge Network, CDN | Hosting frontend, SSL, caching |
| **Railway (API)** | Cloud Container | NestJS 11, Node.js 20 | REST API server |
| **Railway (DB)** | Cloud | PostgreSQL 15 | Database utama |
| **Google Cloud** | Cloud | Gemini 2.0 Flash | AI voice parsing |

---

### Environment Configuration

| Environment | Frontend URL | Backend URL |
|-------------|--------------|-------------|
| **Development** | http://localhost:4321 | http://localhost:3000/api |
| **Production** | https://sim4lon.vercel.app | https://sim4lon-api.up.railway.app/api |

---

### Protokol Komunikasi

| Dari | Ke | Protokol | Port |
|------|-----|----------|------|
| Browser | Vercel | HTTPS | 443 |
| Vercel | Railway API | HTTPS | 443 |
| Railway API | PostgreSQL | TCP | 5432 |
| Railway API | Gemini AI | HTTPS | 443 |

**File Diagram:** `diagrams/SIM4LON_Deployment.puml`

---

## 3.3.8 Perancangan Antarmuka (UI Design)

### Deskripsi

Perancangan antarmuka menggambarkan tampilan visual aplikasi yang akan diimplementasikan. Wireframe dibuat menggunakan **Balsamiq Mockup** dengan fokus pada struktur dan alur navigasi, bukan detail visual.

### Prinsip Desain

| Prinsip | Implementasi |
|---------|--------------|
| **Konsistensi** | Layout dan komponen seragam di semua halaman |
| **Feedback** | Notifikasi toast untuk setiap aksi pengguna |
| **Efisiensi** | Akses fitur utama maksimal 2 klik dari dashboard |
| **Aksesibilitas** | Kontras warna memadai, label yang jelas |
| **Responsif** | Mendukung desktop dan mobile |

---

### Ringkasan Halaman (43 Total)

| Modul | Jumlah | Deskripsi |
|-------|--------|-----------|
| **Portal Admin/Operator** | 34 halaman | Fitur lengkap manajemen agen |
| **Portal Pangkalan** | 9 halaman | Fitur SAAS untuk pangkalan |
| **Total** | **43 halaman** | |

---

### A. Portal Admin/Operator (34 Halaman)

#### Halaman Utama
| No | Halaman | Deskripsi | Komponen Utama |
|----|---------|-----------|----------------|
| 1. | Login | Autentikasi pengguna | Form email, password, logo |
| 2. | Dashboard | Ringkasan KPI | Cards statistik, chart penjualan, alert stok |

#### Modul Pesanan (6 Halaman)
| No | Halaman | Deskripsi | Komponen Utama |
|----|---------|-----------|----------------|
| 3. | Daftar Pesanan | Tabel semua pesanan | DataTable, filter, search, pagination |
| 4. | Buat Pesanan | Form pembuatan pesanan | Form multi-step, voice button, item list |
| 5. | Detail Pesanan | Informasi lengkap | Timeline status, info pangkalan, item list |
| 6. | Catat Pembayaran | Form pembayaran | Amount, method, proof upload |
| 7. | Status Pembayaran | Monitoring pembayaran | Tabel, filter status |
| 8. | Nota Pembayaran | Preview invoice | Print-ready layout |

#### Modul Stok (5 Halaman)
| No | Halaman | Deskripsi |
|----|---------|-----------|
| 9. | Ringkasan Stok | Dashboard stok per kategori |
| 10. | Penerimaan | Form terima dari SPBE |
| 11. | Penyaluran | Form salurkan ke pangkalan |
| 12. | In-Out Agen | Monitoring harian |
| 13. | Pemakaian Stok | Tracking penggunaan |

#### Modul Master Data (12 Halaman)
| No | Halaman | Deskripsi |
|----|---------|-----------|
| 14-17. | Pangkalan | List, Add, Detail, Edit |
| 18-20. | Driver | List, Add, Edit |
| 21-24. | Pengguna | List, Add, Edit, Detail |
| 25. | Produk LPG | Master produk |

#### Modul Laporan & Settings (9 Halaman)
| No | Halaman | Deskripsi |
|----|---------|-----------|
| 26. | Laporan | Dashboard laporan |
| 27. | Export Laporan | Export Excel/PDF |
| 28. | Tren Penjualan | Chart analisis |
| 29. | Perencanaan | Planning distribusi |
| 30. | Riwayat Aktivitas | Audit log |
| 31. | Notifikasi | List notifikasi |
| 32. | Pengaturan | Konfigurasi sistem |
| 33. | Profil Admin | Data profil |
| 34. | Ubah Password | Ganti password |

---

### B. Portal Pangkalan (9 Halaman)

| No | Halaman | Deskripsi | Komponen Utama |
|----|---------|-----------|----------------|
| 1. | Dashboard | Ringkasan stok agen | Cards, recent orders |
| 2. | Stok | Ketersediaan di agen | Tabel stok, harga |
| 3. | Penjualan | Form catat penjualan | Consumer select, qty, price |
| 4. | Daftar Penjualan | Riwayat penjualan | DataTable, filter |
| 5. | Konsumen | Data pelanggan | CRUD konsumen |
| 6. | Tambah Konsumen | Form tambah | NIK, KK, tipe |
| 7. | Hutang | Status piutang | Summary, detail |
| 8. | Pengeluaran | Catat biaya | Kategori, jumlah |
| 9. | Laporan | Laporan penjualan | Filter, export |

---

### Wireframe Highlight

#### 1. Dashboard Admin

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [LOGO]  SIM4LON           🔍 Search         👤 Admin ▼   ⚙️   🔔      │
├────────────┬─────────────────────────────────────────────────────────────┤
│            │                                                             │
│  📊 Dashboard │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  📦 Pesanan   │   │  PESANAN    │  │  STOK 3KG   │  │  PENDAPATAN │      │
│  📋 Stok      │   │    127      │  │    456      │  │  Rp 25.5jt  │      │
│  👥 Pangkalan │   │  +12% ↑     │  │  -5% ↓      │  │  +8% ↑      │      │
│  🚗 Driver    │   └─────────────┘  └─────────────┘  └─────────────┘      │
│  👤 Pengguna  │                                                          │
│  📈 Laporan   │   ┌──────────────────────────────────────────────────┐   │
│  ⚙️ Pengaturan │   │                GRAFIK PENJUALAN                  │   │
│               │   │         📊 Line Chart - 7 Hari Terakhir          │   │
│               │   └──────────────────────────────────────────────────┘   │
│               │                                                          │
│               │   ┌─────────────────────┐  ┌─────────────────────────┐   │
│               │   │  PESANAN TERBARU    │  │  ALERT STOK MENIPIS     │   │
│               │   │  ────────────────   │  │  ─────────────────────  │   │
│               │   │  ORD-001 Selesai    │  │  ⚠️ LPG 3kg : 45 unit   │   │
│               │   │  ORD-002 Dikirim    │  │  ⚠️ LPG 12kg : 12 unit  │   │
│               │   └─────────────────────┘  └─────────────────────────┘   │
│               │                                                          │
└────────────┴─────────────────────────────────────────────────────────────┘
```

#### 2. Form Buat Pesanan dengan Voice Order

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Kembali           BUAT PESANAN BARU                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │  🎤 VOICE ORDER                                                 │    │
│   │  ───────────────────────────────────────────────────────────── │    │
│   │  Klik tombol mikrofon untuk memesan dengan suara               │    │
│   │                                                                 │    │
│   │                    [🎤 MULAI REKAM]                            │    │
│   │                                                                 │    │
│   │  Contoh: "Pangkalan Maju Jaya pesan 50 tabung 3kg"             │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│   ───────────────── ATAU ISI MANUAL ─────────────────                   │
│                                                                          │
│   Pangkalan *          [  Pilih Pangkalan         ▼]                    │
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────┐    │
│   │  Produk           Qty        Harga           Subtotal          │    │
│   │  ─────────────────────────────────────────────────────────────│    │
│   │  LPG 3kg           50        Rp 18.000       Rp 900.000       │    │
│   │  LPG 12kg          10        Rp 180.000      Rp 1.800.000     │    │
│   │                                                                │    │
│   │  [+ Tambah Item]                                               │    │
│   └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│   Catatan             [                                          ]      │
│                                                                          │
│                       Total: Rp 2.700.000                               │
│                                                                          │
│                [Batal]                    [💾 Simpan Pesanan]           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Kesimpulan Perancangan Sistem

Perancangan sistem SIM4LON telah didokumentasikan secara komprehensif melalui berbagai diagram UML:

| Jenis Diagram | Jumlah | Fungsi |
|---------------|--------|--------|
| **ERD** | 1 | Struktur 23 tabel database |
| **Use Case** | 1 | 23 use case, 3 aktor |
| **Class Diagram** | 1 | 22 classes, 7 enums |
| **Activity Diagram** | 26 | Alur proses bisnis |
| **Sequence Diagram** | 19 | Interaksi komponen |
| **State Machine** | 4 | Lifecycle objek |
| **Deployment** | 1 | Arsitektur fisik |
| **Wireframe** | 43 | Desain antarmuka |
| **Total** | **98** | |

Semua diagram PlantUML tersimpan di folder `diagrams/` dan dapat di-render menggunakan PlantUML server atau VS Code extension.

---
