# DOKUMENTASI SEQUENCE DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Sequence Diagram menggambarkan **interaksi antar objek** dalam urutan waktu untuk menyelesaikan suatu proses. Setiap diagram menunjukkan bagaimana Frontend, Backend, dan Database berkomunikasi.

### Komponen (Participants)

| Stereotype | Simbol | Fungsi | Contoh |
|------------|--------|--------|--------|
| **actor** | 🧑 | Pengguna sistem | User, Admin, Pangkalan |
| **boundary** | ▢ | UI/Interface | LoginPage, OrderPage |
| **control** | ◎ | Business Logic | AuthService, OrderService |
| **entity** | ◻ | Data Model | UserModel, OrderModel |
| **database** | ⬡ | Table Database | users, orders, pangkalans |

### Notasi Pesan

| Notasi | Arti |
|--------|------|
| `1.1:` | Numbered message (hierarchical) |
| `→` | Synchronous request |
| `⤳` | Asynchronous request |
| `- - →` | Return/response |
| `alt` | Alternative (if-else) |
| `opt` | Optional |
| `loop` | Perulangan |

---

## 2. DAFTAR SEQUENCE DIAGRAM

| Fase | Jumlah | Fokus |
|------|--------|-------|
| **Fase 1** | 8 | Core Business Processes |
| **Fase 2** | 10 | Supporting Processes |
| **Total** | **18** | |

---

## 3. FASE 1: CORE BUSINESS PROCESSES

### SD-01: Login

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_01_Login.puml` |
| **Aktor** | User (Admin/Operator/Pangkalan) |
| **Tujuan** | Autentikasi user dan generate JWT token |
| **Tables** | `users`, `activity_logs` |

**Alur Utama:**
1. User → LoginPage: Input email & password
2. LoginPage → AuthService: `login(email, password)`
3. AuthService → users: `SELECT * FROM users WHERE email = ?`
4. AuthService: Validate password dengan bcrypt
5. AuthService: Generate session_id baru (single-session)
6. AuthService → users: `UPDATE users SET session_id = ?`
7. AuthService: Generate JWT token
8. AuthService → activity_logs: Log aktivitas login
9. LoginPage: Simpan token ke localStorage
10. Redirect ke Dashboard

**Fitur Khusus:**
- Single-session login (invalidasi session lama)
- bcrypt password hashing

---

### SD-03: Create Order

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_03_CreateOrder.puml` |
| **Aktor** | Admin/Operator |
| **Tujuan** | Membuat pesanan LPG baru |
| **Tables** | `pangkalans`, `orders`, `order_items`, `timeline_tracks` |

**Alur Utama:**
1. Load daftar pangkalan aktif
2. User pilih pangkalan dan jenis LPG
3. OrderService: Generate kode (ORD-XXXX)
4. Loop: Hitung subtotal, cek taxable, hitung PPN 12%
5. Hitung total amount
6. Insert ke orders, order_items, timeline_tracks

**Fitur Khusus:**
- PPN 12% hanya untuk kategori NON_SUBSIDI
- Auto-generate kode pesanan

---

### SD-04: Update Status Pesanan

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_04_UpdateStatus.puml` |
| **Aktor** | Admin/Operator |
| **Tujuan** | Mengubah status pesanan |
| **Tables** | `orders`, `order_items`, `timeline_tracks`, `pangkalan_stocks` |

**Alur Utama:**
1. Validate status transition
2. Optional: Assign driver (jika SIAP_KIRIM)
3. Update current_status di orders
4. Insert timeline_tracks
5. **Jika SELESAI**: Auto-sync stok pangkalan

**Status Transition:**
```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
```

---

### SD-07: Record Payment

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_07_RecordPayment.puml` |
| **Aktor** | Admin/Operator |
| **Tujuan** | Mencatat pembayaran |
| **Tables** | `order_payment_details`, `payment_records`, `orders`, `timeline_tracks` |

**Alur Utama:**
1. Load sisa tagihan
2. Input metode (TUNAI/TRANSFER) dan jumlah
3. Cek: Lunas atau DP?
4. Upsert payment_details
5. Insert payment_records
6. **Jika lunas**: Auto-update status ke DIPROSES

---

### SD-09: Receive Stock

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_09_ReceiveStock.puml` |
| **Aktor** | Admin/Operator |
| **Tujuan** | Catat penerimaan stok dari SPBE |
| **Tables** | `penerimaan_stok`, `stock_histories` |

**Alur Utama:**
1. Input No. SO, No. LO, nama material, qty
2. Insert penerimaan_stok
3. Map material ke lpg_type
4. Insert stock_histories (movement_type = MASUK)

---

### SD-10: Record Distribution

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_10_RecordDistribution.puml` |
| **Aktor** | Admin/Operator |
| **Tujuan** | Catat penyaluran ke pangkalan |
| **Tables** | `pangkalans`, `penyaluran_harian`, `stock_histories` |

**Alur Utama:**
1. Load grid (pangkalan × tanggal)
2. Input jumlah normal & fakultatif
3. Upsert penyaluran_harian
4. Insert stock_histories (movement_type = KELUAR)

---

### SD-12: Record Sale (Pangkalan)

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_12_RecordSale.puml` |
| **Aktor** | Pangkalan |
| **Tujuan** | Catat penjualan ke konsumen |
| **Tables** | `consumers`, `lpg_prices`, `pangkalan_stocks`, `consumer_orders`, `pangkalan_stock_movements` |

**Alur Utama:**
1. Load konsumen dan harga LPG
2. Cek ketersediaan stok
3. Generate kode (PORD-XXXX)
4. Hitung total dan profit
5. Insert consumer_orders
6. Update pangkalan_stocks (kurangi)
7. Insert pangkalan_stock_movements

**Fitur Khusus:**
- Multi-tenant: pangkalan_id dari JWT
- Validasi stok sebelum jual

---

### SD-16: Create Pangkalan

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_16_CreatePangkalan.puml` |
| **Aktor** | Admin |
| **Tujuan** | Tambah pangkalan baru |
| **Tables** | `pangkalans`, `users`, `activity_logs` |

**Alur Utama:**
1. Validate input
2. Cek email login unik (jika ada)
3. Generate kode pangkalan (PKL-XXX)
4. Insert pangkalans
5. **Jika ada kredensial**: Auto-create user dengan role PANGKALAN

---

## 4. FASE 2: SUPPORTING PROCESSES

### SD-02: Logout

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_02_Logout.puml` |
| **Tables** | `users` |

**Alur:** Hapus token localStorage → Update session_id = NULL → Redirect login

---

### SD-05: Assign Driver

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_05_AssignDriver.puml` |
| **Tables** | `drivers`, `orders`, `timeline_tracks` |

**Alur:** Load driver aktif → Pilih driver → Update orders.driver_id → Insert timeline

---

### SD-06: Get Order Detail

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_06_GetOrderDetail.puml` |
| **Tables** | `orders`, `order_items`, `timeline_tracks`, `order_payment_details`, `pangkalans`, `drivers` |

**Alur:** Join semua relasi → Render detail page

---

### SD-08: Generate Invoice

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_08_GenerateInvoice.puml` |
| **Tables** | `invoices`, `orders`, `order_items`, `company_profile` |

**Alur:** Cek existing → Generate INV-YYYY-XXXX → Calculate totals → Insert invoices

---

### SD-11: Get Stock Summary

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_11_GetStockSummary.puml` |
| **Tables** | `stock_histories`, `lpg_products` |

**Alur:** Loop per product → SUM(MASUK) - SUM(KELUAR) → Balance

---

### SD-13: Create Order to Agen

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_13_CreateOrderToAgen.puml` |
| **Tables** | `agen_orders`, `pangkalans`, `agen` |

**Alur:** Load agen data → Input order → Insert agen_orders (status=PENDING)

---

### SD-14: Confirm Receipt

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_14_ConfirmReceipt.puml` |
| **Tables** | `agen_orders`, `pangkalan_stocks`, `pangkalan_stock_movements` |

**Alur:** Input qty diterima → Update agen_orders → Tambah pangkalan_stocks → Insert movement

---

### SD-15: Dashboard Pangkalan

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_15_DashboardPangkalan.puml` |
| **Tables** | `consumer_orders`, `pangkalan_stocks`, `expenses` |

**Alur:** Load stats, stock levels, chart data, recent sales → Render dashboard

---

### SD-17: CRUD Generic

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_17_CRUDGeneric.puml` |
| **Tables** | `entity_table` (template) |

**Template untuk:**
- Kelola Pengguna
- Kelola Supir
- Kelola Produk LPG
- Kelola Konsumen

---

### SD-18: Generate & Export Report

| Komponen | Deskripsi |
|----------|-----------|
| **File** | `SD_18_GenerateExportReport.puml` |
| **Tables** | `orders`, `payment_records`, `stock_histories` |

**Alur:** Pilih jenis laporan → Filter → Query data → Generate Excel → Download

---

## 5. MATRIKS DIAGRAM & TABEL

| Diagram | Tables yang Digunakan |
|---------|----------------------|
| SD-01 | users, activity_logs |
| SD-02 | users |
| SD-03 | pangkalans, orders, order_items, timeline_tracks |
| SD-04 | orders, order_items, timeline_tracks, pangkalan_stocks |
| SD-05 | drivers, orders, timeline_tracks |
| SD-06 | orders, order_items, timeline_tracks, order_payment_details, pangkalans, drivers |
| SD-07 | order_payment_details, payment_records, orders, timeline_tracks |
| SD-08 | invoices, orders, order_items, company_profile |
| SD-09 | penerimaan_stok, stock_histories |
| SD-10 | pangkalans, penyaluran_harian, stock_histories |
| SD-11 | stock_histories, lpg_products |
| SD-12 | consumers, lpg_prices, pangkalan_stocks, consumer_orders, pangkalan_stock_movements |
| SD-13 | agen_orders, pangkalans, agen |
| SD-14 | agen_orders, pangkalan_stocks, pangkalan_stock_movements |
| SD-15 | consumer_orders, pangkalan_stocks, expenses |
| SD-16 | pangkalans, users, activity_logs |
| SD-17 | (template) |
| SD-18 | orders, payment_records, stock_histories |

---

## 6. CATATAN TEKNIS

1. **Numbered Messages**: Format `1.1.1` menunjukkan hierarki pemanggilan
2. **Fragments**:
   - `alt`: Alternative paths (if-else)
   - `opt`: Optional execution
   - `loop`: Iterasi
3. **Activation Bars**: Menunjukkan kapan objek aktif
4. **Return Messages**: Dashed line untuk response

---

*Dokumen ini menjelaskan 18 Sequence Diagram SIM4LON*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*
