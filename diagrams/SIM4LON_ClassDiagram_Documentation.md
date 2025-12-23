# DOKUMENTASI CLASS DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Class Diagram ini menggambarkan struktur data dan relasi antar entitas dalam sistem SIM4LON. Diagram ini merepresentasikan model database yang digunakan untuk menyimpan data distribusi LPG dari Agen ke Pangkalan hingga ke Konsumen.

---

## 2. DAFTAR ENUMERASI (ENUM)

Enum adalah tipe data dengan nilai terbatas yang sudah ditentukan.

| Enum | Nilai | Deskripsi |
|------|-------|-----------|
| **user_role** | ADMIN, OPERATOR, PANGKALAN | Role/peran pengguna dalam sistem |
| **status_pesanan** | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL | Status workflow pesanan |
| **lpg_type** | kg3, kg5, kg12, kg50, gr220 | Jenis LPG berdasarkan ukuran |
| **lpg_category** | SUBSIDI, NON_SUBSIDI | Kategori LPG |
| **payment_method** | TUNAI, TRANSFER | Metode pembayaran |
| **stock_movement_type** | MASUK, KELUAR | Jenis pergerakan stok |
| **consumer_type** | RUMAH_TANGGA, WARUNG | Tipe konsumen |

---

## 3. DAFTAR CLASS (ENTITAS)

### 3.1 User Management

#### Class: `users`
Menyimpan data akun pengguna sistem.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode display (USR-001) |
| email | string | Email untuk login (unique) |
| password | string | Password terenkripsi |
| name | string | Nama lengkap |
| phone | string | Nomor telepon |
| avatar_url | string | URL foto profil |
| role | user_role | Role pengguna |
| pangkalan_id | string | FK ke pangkalans (untuk role PANGKALAN) |
| session_id | string | ID session untuk single-session login |
| is_active | boolean | Status aktif akun |

| Method | Return | Deskripsi |
|--------|--------|-----------|
| +register(dto) | users | Mendaftarkan user baru |
| +login(dto) | AuthToken | Login dan generate JWT token |
| +getProfile(userId) | users | Mendapatkan data profil |
| +updateProfile(userId, dto) | users | Mengupdate profil |
| +changePassword(userId, old, new) | boolean | Mengubah password |

---

### 3.2 Master Data

#### Class: `agen`
Menyimpan data distributor/agen LPG.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode agen (AGN-001) |
| name | string | Nama agen |
| address | string | Alamat |
| pic_name | string | Nama contact person |
| phone | string | Nomor telepon |
| email | string | Email |
| is_active | boolean | Status aktif |

#### Class: `pangkalans`
Menyimpan data pangkalan LPG.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode pangkalan (PKL-001) |
| name | string | Nama pangkalan |
| address | string | Alamat lengkap |
| region | string | Wilayah/daerah |
| pic_name | string | Nama pemilik/PIC |
| phone | string | Nomor telepon |
| email | string | Email untuk invoice |
| capacity | int | Kapasitas penyimpanan |
| alokasi_bulanan | int | Kuota alokasi bulanan dari Pertamina |
| agen_id | string | FK ke agen |
| is_active | boolean | Status aktif |

| Method | Return | Deskripsi |
|--------|--------|-----------|
| +findAll(page, limit, isActive) | pangkalans[] | Daftar pangkalan dengan pagination |
| +findOne(id) | pangkalans | Detail satu pangkalan |
| +create(dto) | pangkalans | Membuat pangkalan baru + akun login |
| +update(id, dto) | pangkalans | Mengupdate data pangkalan |
| +remove(id) | boolean | Menghapus pangkalan (soft delete) |

#### Class: `drivers`
Menyimpan data sopir pengiriman.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode driver (DRV-001) |
| name | string | Nama driver |
| phone | string | Nomor telepon |
| vehicle_id | string | Nomor plat kendaraan |
| is_active | boolean | Status aktif |

#### Class: `lpg_products`
Menyimpan data produk LPG.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| name | string | Nama produk (Elpiji 3kg Hijau) |
| size_kg | decimal | Berat dalam kg |
| category | lpg_category | Kategori: SUBSIDI/NON_SUBSIDI |
| color | string | Warna tabung |
| selling_price | decimal | Harga jual |
| cost_price | decimal | Harga beli/modal |
| brand | string | Merek (Elpiji, Bright Gas, dll) |
| is_active | boolean | Status aktif |

---

### 3.3 Order Management

#### Class: `orders`
Menyimpan data pesanan utama.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode pesanan (ORD-0001) |
| pangkalan_id | string | FK ke pangkalans |
| driver_id | string | FK ke drivers |
| order_date | date | Tanggal pesanan |
| current_status | status_pesanan | Status saat ini |
| subtotal | decimal | Total sebelum pajak |
| tax_amount | decimal | Nominal PPN |
| total_amount | decimal | Grand total |
| note | string | Catatan |

| Method | Return | Deskripsi |
|--------|--------|-----------|
| +findAll(page, limit, status) | orders[] | Daftar pesanan dengan filter |
| +findOne(id) | orders | Detail pesanan |
| +create(dto) | orders | Membuat pesanan baru |
| +update(id, dto) | orders | Mengupdate pesanan |
| +updateStatus(id, dto) | orders | Mengubah status pesanan |
| +remove(id) | boolean | Menghapus pesanan |
| +getStats(todayOnly) | OrderStats | Statistik pesanan |

#### Class: `order_items`
Menyimpan item dalam pesanan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| order_id | string | FK ke orders |
| lpg_type | lpg_type | Jenis LPG |
| label | string | Label display |
| price_per_unit | decimal | Harga per unit |
| qty | int | Jumlah |
| sub_total | decimal | Subtotal item |
| is_taxable | boolean | Apakah kena PPN |
| tax_amount | decimal | Nominal PPN item |

#### Class: `timeline_tracks`
Menyimpan riwayat perubahan status pesanan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| order_id | string | FK ke orders |
| status | status_pesanan | Status pada titik ini |
| description | string | Deskripsi perubahan |
| note | string | Catatan tambahan |
| created_at | timestamp | Waktu perubahan |

---

### 3.4 Payment

#### Class: `invoices`
Menyimpan data invoice/faktur.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| order_id | string | FK ke orders |
| invoice_number | string | Nomor invoice (INV-2024-0001) |
| invoice_date | date | Tanggal invoice |
| due_date | date | Tanggal jatuh tempo |
| billing_address | string | Alamat penagihan |
| billed_to_name | string | Nama yang ditagih |
| sub_total | decimal | Subtotal |
| tax_rate | decimal | Persentase pajak |
| tax_amount | decimal | Nominal pajak |
| grand_total | decimal | Grand total |
| payment_status | string | Status: UNPAID, PARTIAL, PAID |

#### Class: `order_payment_details`
Menyimpan ringkasan pembayaran per pesanan (1:1 dengan orders).

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| order_id | string | FK ke orders (unique) |
| is_paid | boolean | Sudah lunas? |
| is_dp | boolean | Apakah DP? |
| payment_method | payment_method | Metode: TUNAI/TRANSFER |
| amount_paid | decimal | Jumlah yang dibayar |
| payment_date | timestamp | Tanggal pembayaran |
| proof_url | string | URL bukti pembayaran |

#### Class: `payment_records`
Menyimpan catatan setiap transaksi pembayaran.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| order_id | string | FK ke orders |
| invoice_id | string | FK ke invoices |
| method | payment_method | Metode pembayaran |
| amount | decimal | Jumlah pembayaran |
| payment_time | timestamp | Waktu pembayaran |
| proof_url | string | URL bukti |
| recorded_by_user_id | string | FK ke users (yang mencatat) |
| note | string | Catatan |

---

### 3.5 Stock Management

#### Class: `stock_histories`
Menyimpan riwayat pergerakan stok AGEN.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| lpg_product_id | string | FK ke lpg_products |
| lpg_type | lpg_type | Jenis LPG |
| movement_type | stock_movement_type | MASUK/KELUAR |
| qty | int | Jumlah |
| note | string | Catatan |
| recorded_by_user_id | string | FK ke users |
| timestamp | timestamp | Waktu pergerakan |

#### Class: `penerimaan_stok`
Menyimpan data penerimaan LPG dari SPBE.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| no_so | string | Nomor Sales Order |
| no_lo | string | Nomor Loading Order |
| nama_material | string | Nama material |
| qty_pcs | int | Jumlah dalam pieces |
| qty_kg | decimal | Jumlah dalam KG |
| tanggal | date | Tanggal penerimaan |
| sumber | string | Sumber/supplier |

#### Class: `perencanaan_harian`
Menyimpan perencanaan alokasi bulanan per pangkalan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| tanggal | date | Tanggal perencanaan |
| alokasi_bulan | int | Total alokasi bulan ini |
| lpg_type | lpg_type | Jenis LPG |
| jumlah_normal | int | Jumlah alokasi normal |
| jumlah_fakultatif | int | Jumlah alokasi fakultatif |

#### Class: `penyaluran_harian`
Menyimpan data penyaluran harian ke pangkalan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| tanggal | date | Tanggal penyaluran |
| tipe_pembayaran | string | CASH/CASHLESS |
| lpg_type | lpg_type | Jenis LPG |
| jumlah_normal | int | Jumlah normal |
| jumlah_fakultatif | int | Jumlah fakultatif |

---

### 3.6 Pangkalan SAAS Module

#### Class: `consumers`
Menyimpan data konsumen akhir (pelanggan pangkalan).

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| name | string | Nama konsumen |
| nik | string | NIK (untuk verifikasi subsidi) |
| kk | string | Nomor KK |
| phone | string | Nomor telepon |
| address | string | Alamat |
| consumer_type | consumer_type | RUMAH_TANGGA/WARUNG |
| is_active | boolean | Status aktif |

#### Class: `consumer_orders`
Menyimpan data penjualan dari pangkalan ke konsumen.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode penjualan (PORD-0001) |
| pangkalan_id | string | FK ke pangkalans |
| consumer_id | string | FK ke consumers (nullable untuk walk-in) |
| consumer_name | string | Nama konsumen (untuk walk-in) |
| lpg_type | lpg_type | Jenis LPG |
| qty | int | Jumlah |
| price_per_unit | decimal | Harga jual |
| cost_price | decimal | Harga modal |
| total_amount | decimal | Total penjualan |
| payment_status | string | Status pembayaran |
| sale_date | timestamp | Tanggal penjualan |

#### Class: `pangkalan_stocks`
Menyimpan stok LPG per pangkalan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| lpg_type | lpg_type | Jenis LPG |
| qty | int | Jumlah stok saat ini |
| warning_level | int | Batas peringatan stok rendah |
| critical_level | int | Batas kritis stok |

#### Class: `lpg_prices`
Menyimpan harga jual LPG per pangkalan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| lpg_type | lpg_type | Jenis LPG |
| cost_price | decimal | Harga modal |
| selling_price | decimal | Harga jual |
| is_active | boolean | Status aktif |

#### Class: `expenses`
Menyimpan data pengeluaran operasional pangkalan.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| pangkalan_id | string | FK ke pangkalans |
| category | string | Kategori pengeluaran |
| amount | decimal | Jumlah |
| description | string | Deskripsi |
| expense_date | timestamp | Tanggal pengeluaran |

#### Class: `agen_orders`
Menyimpan pesanan dari pangkalan ke agen.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| code | string | Kode order |
| pangkalan_id | string | FK ke pangkalans |
| agen_id | string | FK ke agen |
| lpg_type | lpg_type | Jenis LPG |
| qty_ordered | int | Jumlah dipesan |
| qty_received | int | Jumlah diterima |
| status | string | PENDING/DIKIRIM/DITERIMA/BATAL |
| order_date | timestamp | Tanggal order |
| received_date | timestamp | Tanggal diterima |

---

### 3.7 Monitoring

#### Class: `activity_logs`
Menyimpan log aktivitas sistem untuk audit.

| Atribut | Tipe | Deskripsi |
|---------|------|-----------|
| id | string (UUID) | Primary key |
| user_id | string | FK ke users |
| order_id | string | FK ke orders |
| type | string | Tipe aktivitas |
| title | string | Judul aktivitas |
| description | string | Deskripsi detail |
| pangkalan_name | string | Nama pangkalan (denormalized) |
| detail_numeric | decimal | Data numerik tambahan |
| icon_name | string | Nama icon Lucide |
| order_status | status_pesanan | Status pesanan terkait |
| timestamp | timestamp | Waktu aktivitas |

---

## 4. RELASI ANTAR CLASS

### 4.1 Composition (◆ - Kepemilikan Kuat)
Jika parent dihapus, child ikut terhapus.

| Parent | Child | Keterangan |
|--------|-------|------------|
| orders | order_items | Pesanan memiliki item-item |
| orders | timeline_tracks | Pesanan memiliki riwayat status |
| orders | order_payment_details | Pesanan memiliki detail pembayaran |

### 4.2 Aggregation (◇ - Kepemilikan Lemah)
Child bisa exist tanpa parent.

| Parent | Child | Keterangan |
|--------|-------|------------|
| agen | pangkalans | Agen memasok banyak pangkalan |
| pangkalans | users | Pangkalan memiliki user login |
| pangkalans | orders | Pangkalan membuat pesanan |
| pangkalans | consumers | Pangkalan memiliki konsumen |
| pangkalans | consumer_orders | Pangkalan mencatat penjualan |
| pangkalans | pangkalan_stocks | Pangkalan memiliki stok |
| drivers | orders | Driver ditugaskan ke pesanan |
| users | payment_records | User mencatat pembayaran |
| orders | invoices | Pesanan menghasilkan invoice |

### 4.3 Association (Asosiasi Biasa)
Hubungan tanpa kepemilikan.

| Class 1 | Class 2 | Keterangan |
|---------|---------|------------|
| users | user_role | User memiliki role |
| orders | status_pesanan | Order memiliki status |
| order_items | lpg_type | Item menggunakan tipe LPG |
| stock_histories | stock_movement_type | Pergerakan memiliki tipe |

---

## 5. MULTIPLICITY (KARDINALITAS)

| Relasi | Multiplicity | Contoh |
|--------|--------------|--------|
| 1..* | Satu ke banyak | 1 pangkalan punya banyak orders |
| 0..* | Nol ke banyak | User mungkin tidak punya activity_logs |
| 1..1 | Satu ke satu | 1 order punya 1 order_payment_details |
| 0..1 | Nol atau satu | Order mungkin tidak punya driver |

---

## 6. CATATAN PENTING

1. **UUID sebagai Primary Key**: Semua entitas menggunakan UUID untuk keamanan dan skalabilitas
2. **Soft Delete**: Entitas penting menggunakan `deleted_at` untuk soft delete
3. **Timestamps**: Semua entitas punya `created_at` dan `updated_at`
4. **Multi-Tenant**: Data pangkalan terisolasi berdasarkan `pangkalan_id`
5. **Denormalization**: Beberapa field seperti `pangkalan_name` di activity_logs untuk performa query

---

*Dokumen ini menjelaskan Class Diagram SIM4LON*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*
