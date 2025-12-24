# DOKUMENTASI ENTITY RELATIONSHIP DIAGRAM (ERD)
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

ERD (Entity Relationship Diagram) menggambarkan struktur database SIM4LON dengan fokus pada:
- **Entitas** (tabel)
- **Atribut** (kolom)
- **Relasi** antar entitas

### Perbedaan ERD vs Class Diagram

| Aspek | ERD | Class Diagram |
|-------|-----|---------------|
| Fokus | Struktur database | Struktur kode OOP |
| Notasi | Crow's foot | UML association |
| Atribut | Tipe data SQL | Tipe data programming |
| Method | ❌ Tidak ada | ✅ Ada |

---

## 2. NOTASI CROW'S FOOT

| Simbol | Arti |
|--------|------|
| `||` | One (exactly one) |
| `|o` | Zero or one |
| `o{` | Zero or many |
| `|{` | One or many |

### Contoh:
```
pangkalans ||--o{ orders
```
Artinya: Satu pangkalan bisa memiliki **nol atau banyak** pesanan.

---

## 3. DAFTAR ENTITAS (23 Tabel)

### Master Data (5 Entitas)

| # | Tabel | Deskripsi | PK |
|---|-------|-----------|-----|
| 1 | `users` | Akun pengguna (Admin/Operator/Pangkalan) | id (UUID) |
| 2 | `agen` | Distributor LPG | id (UUID) |
| 3 | `pangkalans` | Pangkalan (tempat jual LPG) | id (UUID) |
| 4 | `drivers` | Supir pengantar | id (UUID) |
| 5 | `lpg_products` | Katalog produk LPG | id (UUID) |

### Pesanan & Pembayaran (6 Entitas)

| # | Tabel | Deskripsi | PK |
|---|-------|-----------|-----|
| 6 | `orders` | Pesanan dari pangkalan | id (UUID) |
| 7 | `order_items` | Detail item pesanan | id (UUID) |
| 8 | `timeline_tracks` | Riwayat status pesanan | id (UUID) |
| 9 | `invoices` | Faktur/invoice | id (UUID) |
| 10 | `order_payment_details` | Summary pembayaran (1:1 dengan orders) | id (UUID) |
| 11 | `payment_records` | Catatan transaksi pembayaran | id (UUID) |

### Pangkalan Operations (7 Entitas)

| # | Tabel | Deskripsi | PK |
|---|-------|-----------|-----|
| 12 | `consumers` | Konsumen pangkalan | id (UUID) |
| 13 | `consumer_orders` | Penjualan ke konsumen | id (UUID) |
| 14 | `lpg_prices` | Harga jual per pangkalan | id (UUID) |
| 15 | `pangkalan_stocks` | Stok pangkalan | id (UUID) |
| 16 | `pangkalan_stock_movements` | Riwayat pergerakan stok | id (UUID) |
| 17 | `expenses` | Pengeluaran operasional | id (UUID) |
| 18 | `agen_orders` | Order pangkalan ke agen | id (UUID) |

### Stok & Penyaluran Agen (3 Entitas)

| # | Tabel | Deskripsi | PK |
|---|-------|-----------|-----|
| 19 | `penerimaan_stok` | Penerimaan dari SPBE | id (UUID) |
| 20 | `penyaluran_harian` | Penyaluran ke pangkalan | id (UUID) |
| 21 | `perencanaan_harian` | Perencanaan alokasi | id (UUID) |

### Audit & Logging (2 Entitas)

| # | Tabel | Deskripsi | PK |
|---|-------|-----------|-----|
| 22 | `stock_histories` | Riwayat stok agen | id (UUID) |
| 23 | `activity_logs` | Log aktivitas sistem | id (UUID) |

---

## 4. RELASI ANTAR ENTITAS

### 4.1 Master Data Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `agen` | `pangkalans` | 1:N | Satu agen melayani banyak pangkalan |
| `pangkalans` | `users` | 1:N | Satu pangkalan bisa punya banyak user |

### 4.2 Order Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `pangkalans` | `orders` | 1:N | Pangkalan membuat pesanan |
| `drivers` | `orders` | 1:N | Driver mengantar pesanan |
| `orders` | `order_items` | 1:N | Pesanan berisi item |
| `orders` | `timeline_tracks` | 1:N | Pesanan punya riwayat status |
| `orders` | `invoices` | 1:N | Pesanan bisa punya invoice |
| `orders` | `order_payment_details` | 1:1 | Pesanan punya 1 summary bayar |
| `orders` | `payment_records` | 1:N | Pesanan bisa punya banyak pembayaran |

### 4.3 Pangkalan Operations Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `pangkalans` | `consumers` | 1:N | Pangkalan punya konsumen |
| `consumers` | `consumer_orders` | 1:N | Konsumen beli LPG |
| `pangkalans` | `consumer_orders` | 1:N | Pangkalan jual ke konsumen |
| `pangkalans` | `lpg_prices` | 1:N | Pangkalan set harga |
| `pangkalans` | `pangkalan_stocks` | 1:N | Pangkalan punya stok |
| `pangkalans` | `pangkalan_stock_movements` | 1:N | Pangkalan track pergerakan |
| `pangkalans` | `expenses` | 1:N | Pangkalan catat expense |

### 4.4 Agen Order Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `agen` | `agen_orders` | 1:N | Agen terima order |
| `pangkalans` | `agen_orders` | 1:N | Pangkalan order ke agen |

### 4.5 Stock & Planning Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `pangkalans` | `penyaluran_harian` | 1:N | Distribusi ke pangkalan |
| `pangkalans` | `perencanaan_harian` | 1:N | Perencanaan per pangkalan |
| `lpg_products` | `stock_histories` | 1:N | Produk punya riwayat stok |
| `users` | `stock_histories` | 1:N | User catat stok |

### 4.6 Audit Relations

| From | To | Cardinality | Keterangan |
|------|----|-------------|------------|
| `users` | `activity_logs` | 1:N | User generate log |
| `orders` | `activity_logs` | 1:N | Order generate log |
| `users` | `payment_records` | 1:N | User catat pembayaran |

---

## 5. ENUMERASI (ENUM)

| Enum | Values | Digunakan di |
|------|--------|--------------|
| `user_role` | ADMIN, OPERATOR, PANGKALAN | users.role |
| `lpg_type` | kg3, kg5_5, kg12, kg50 | Multiple tables |
| `lpg_category` | SUBSIDI, NON_SUBSIDI | lpg_products.category |
| `status_pesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL | orders.current_status |
| `payment_method` | TUNAI, TRANSFER | payment_records.method |
| `consumer_type` | RUMAH_TANGGA, WARUNG | consumers.consumer_type |
| `stock_movement_type` | MASUK, KELUAR | stock_histories.movement_type |

---

## 6. INDEX & CONSTRAINTS

### Primary Keys
- Semua tabel menggunakan `id` dengan tipe `UUID`
- Auto-generated dengan `gen_random_uuid()`

### Unique Constraints
- `users.code`, `users.email`
- `agen.code`, `pangkalans.code`, `drivers.code`
- `orders.code`, `consumer_orders.code`
- `invoices.invoice_number`

### Composite Unique
- `lpg_prices(pangkalan_id, lpg_type)`
- `pangkalan_stocks(pangkalan_id, lpg_type)`
- `penyaluran_harian(pangkalan_id, tanggal, lpg_type)`

### Foreign Keys
- Semua FK menggunakan `ON DELETE NO ACTION`
- Kecuali: `order_items` → `orders` (CASCADE)

---

## 7. CATATAN TEKNIS

### 7.1 Soft Delete
Tabel yang mendukung soft delete (memiliki `deleted_at`):
- users, agen, pangkalans, drivers, lpg_products
- orders, invoices

### 7.2 Audit Columns
Semua tabel memiliki:
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### 7.3 Multi-Tenant
Data pangkalan diisolasi dengan `pangkalan_id`:
- consumers, consumer_orders, lpg_prices
- pangkalan_stocks, pangkalan_stock_movements
- expenses, penyaluran_harian, perencanaan_harian

---

*Dokumen ini menjelaskan struktur database SIM4LON dengan 21 entitas dan 25+ relasi*  
*Database: PostgreSQL dengan Prisma ORM*
