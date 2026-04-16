# DOKUMENTASI UML SIM4LON
## Sistem Informasi Manajemen LPG 4 Jalur Online
### Versi Terbaru - Desember 2024

---

# DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [Use Case Diagram](#2-use-case-diagram)
3. [Class Diagram](#3-class-diagram)
4. [ERD (Entity Relationship Diagram)](#4-erd-entity-relationship-diagram)
5. [Activity Diagram](#5-activity-diagram)
6. [Sequence Diagram](#6-sequence-diagram)
7. [State Machine Diagram](#7-state-machine-diagram)
8. [Deployment Diagram](#8-deployment-diagram)

---

# 1. PENDAHULUAN

## 1.1 Gambaran Umum Sistem

**SIM4LON (Sistem Informasi Manajemen LPG 4 Jalur Online)** adalah aplikasi berbasis web untuk mengelola distribusi gas LPG dari Agen ke Pangkalan hingga ke Konsumen akhir.

## 1.2 Tujuan Sistem

1. Mendigitalisasi pencatatan pesanan LPG
2. Memantau stok secara real-time
3. Mencatat pembayaran dengan rapi
4. Menyediakan laporan yang akurat dan cepat
5. Mendukung multi-tenant (setiap pangkalan hanya akses data miliknya)

## 1.3 Full Stack Technology

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TanStack Query, Tailwind CSS, Shadcn/UI |
| **Backend** | NestJS 10, Prisma ORM, JWT, Passport |
| **Database** | PostgreSQL 15 |
| **Storage** | Supabase Storage |
| **Hosting** | Vercel (Frontend), Railway (Backend + Database) |

## 1.4 Statistik Diagram UML

| Jenis Diagram | Jumlah |
|---------------|--------|
| Use Case Diagram | 1 (18 use cases) |
| Class Diagram | 1 (22 classes, 7 enums) |
| ERD | 1 (23 tabel) |
| Activity Diagram | 25 |
| Sequence Diagram | 18 |
| State Machine Diagram | 2 |
| Deployment Diagram | 1 |
| **TOTAL** | **49 Diagram** |

---

# 2. USE CASE DIAGRAM

## 2.1 Aktor

Sistem memiliki **3 aktor utama**:

| No | Aktor | Deskripsi | Hak Akses |
|----|-------|-----------|-----------|
| 1 | **Admin** | Administrator sistem | Full access ke semua fitur termasuk master data |
| 2 | **Operator** | Staff operasional agen | Akses operasional: pesanan, stok, pembayaran |
| 3 | **Pangkalan** | Pemilik/pengelola pangkalan LPG | Hanya akses data milik sendiri |

## 2.2 Daftar Use Case (18 Use Case)

### Use Case Semua Aktor
| No | Use Case | Deskripsi |
|----|----------|-----------|
| 1 | Login | Masuk ke sistem dengan single-session |
| 2 | Kelola Profil | Melihat dan mengubah data profil |

### Use Case Admin Only
| No | Use Case | Deskripsi |
|----|----------|-----------|
| 3 | Kelola Pengguna | CRUD data pengguna |
| 4 | Kelola Pangkalan | CRUD data pangkalan |
| 5 | Kelola Supir | CRUD data driver |
| 6 | Lihat Log Aktivitas | Monitoring aktivitas sistem |
| 7 | Kelola Perencanaan | Perencanaan alokasi LPG |

### Use Case Admin + Operator
| No | Use Case | Deskripsi |
|----|----------|-----------|
| 8 | Kelola Dashboard | Ringkasan KPI |
| 9 | Kelola Pesanan | Mengelola pesanan LPG |
| 10 | Update Status | Mengubah status pesanan |
| 11 | Assign Driver | Menugaskan driver (extend) |
| 12 | Kelola Pembayaran | Mencatat pembayaran |
| 13 | Cetak Nota | Mencetak invoice (extend) |
| 14 | Kelola Stok | Mengelola stok LPG |
| 15 | Kelola Laporan | Melihat laporan |

### Use Case Pangkalan Only
| No | Use Case | Deskripsi |
|----|----------|-----------|
| 16 | Kelola Penjualan | Mencatat penjualan ke konsumen |
| 17 | Kelola Konsumen | CRUD data konsumen |
| 18 | Buat Order ke Agen | Memesan LPG dari agen |

## 2.3 Relasi Use Case

### Include Relationship
| Use Case Utama | Include |
|----------------|---------|
| Kelola Pesanan | → Update Status |

### Extend Relationship
| Use Case Utama | Extension Point | Extension |
|----------------|-----------------|-----------|
| Update Status | Assign Driver | Assign Driver |
| Kelola Pembayaran | Cetak Nota | Cetak Nota |

## 2.4 Matriks Akses

| Use Case | Admin | Operator | Pangkalan |
|----------|:-----:|:--------:|:---------:|
| Login | ✅ | ✅ | ✅ |
| Kelola Profil | ✅ | ✅ | ✅ |
| Kelola Pengguna | ✅ | ❌ | ❌ |
| Kelola Pangkalan | ✅ | ❌ | ❌ |
| Kelola Supir | ✅ | ❌ | ❌ |
| Lihat Log Aktivitas | ✅ | ❌ | ❌ |
| Kelola Perencanaan | ✅ | ❌ | ❌ |
| Kelola Dashboard | ✅ | ✅ | ❌ |
| Kelola Pesanan | ✅ | ✅ | ❌ |
| Update Status | ✅ | ✅ | ❌ |
| Assign Driver | ✅ | ✅ | ❌ |
| Kelola Pembayaran | ✅ | ✅ | ❌ |
| Cetak Nota | ✅ | ✅ | ❌ |
| Kelola Stok | ✅ | ✅ | ❌ |
| Kelola Laporan | ✅ | ✅ | ❌ |
| Kelola Penjualan | ❌ | ❌ | ✅ |
| Kelola Konsumen | ❌ | ❌ | ✅ |
| Buat Order ke Agen | ❌ | ❌ | ✅ |

---

# 3. CLASS DIAGRAM

## 3.1 Daftar Class (22 Classes)

### Master Data (6 Classes)
| Class | Deskripsi |
|-------|-----------|
| users | Data pengguna sistem |
| agen | Data agen LPG |
| pangkalans | Data pangkalan |
| drivers | Data supir/driver |
| lpg_products | Data produk LPG |
| company_profile | Profil perusahaan |

### Order Management (4 Classes)
| Class | Deskripsi |
|-------|-----------|
| orders | Data pesanan |
| order_items | Item dalam pesanan |
| timeline_tracks | Riwayat status pesanan |
| invoices | Data invoice |

### Payment (2 Classes)
| Class | Deskripsi |
|-------|-----------|
| order_payment_details | Summary pembayaran per order |
| payment_records | Riwayat pembayaran |

### Stock Management (4 Classes)
| Class | Deskripsi |
|-------|-----------|
| stock_histories | Riwayat pergerakan stok |
| penerimaan_stok | Penerimaan dari SPBE |
| perencanaan_harian | Perencanaan distribusi |
| penyaluran_harian | Penyaluran ke pangkalan |

### Pangkalan SAAS Module (6 Classes)
| Class | Deskripsi |
|-------|-----------|
| consumers | Data konsumen pangkalan |
| consumer_orders | Penjualan ke konsumen |
| pangkalan_stocks | Stok pangkalan |
| lpg_prices | Harga jual pangkalan |
| expenses | Pengeluaran pangkalan |
| agen_orders | Order pangkalan ke agen |

## 3.2 Daftar Enumerations (7 Enums)

| Enum | Values |
|------|--------|
| user_role | ADMIN, OPERATOR, PANGKALAN |
| status_pesanan | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL |
| lpg_type | kg3, kg5, kg12, kg50, gr220 |
| lpg_category | SUBSIDI, NON_SUBSIDI |
| payment_method | TUNAI, TRANSFER |
| stock_movement_type | MASUK, KELUAR |
| consumer_type | RUMAH_TANGGA, WARUNG |

## 3.3 Relationship Types

| Jenis Relasi | Simbol | Contoh |
|--------------|--------|--------|
| Association | ─── | orders ─── pangkalans |
| Aggregation | ◇─── | agen ◇─── pangkalans |
| Composition | ◆─── | orders ◆─── order_items |
| Dependency | ..> | users ..> user_role |

---

# 4. ERD (Entity Relationship Diagram)

## 4.1 Daftar Entitas (23 Tabel)

### Master Data
| Tabel | PK | Deskripsi |
|-------|-----|-----------|
| users | id (UUID) | Data pengguna |
| agen | id (UUID) | Data agen |
| pangkalans | id (UUID) | Data pangkalan |
| drivers | id (UUID) | Data driver |
| lpg_products | id (UUID) | Data produk LPG |
| company_profile | id (UUID) | Profil perusahaan |

### Order Management
| Tabel | PK | FK |
|-------|-----|-----|
| orders | id | pangkalan_id, driver_id |
| order_items | id | order_id |
| timeline_tracks | id | order_id |
| invoices | id | order_id |

### Payment
| Tabel | PK | FK |
|-------|-----|-----|
| order_payment_details | id | order_id |
| payment_records | id | order_id, invoice_id, recorded_by_user_id |

### Stock Management
| Tabel | PK | FK |
|-------|-----|-----|
| stock_histories | id | lpg_product_id, recorded_by_user_id |
| penerimaan_stok | id | - |
| perencanaan_harian | id | pangkalan_id |
| penyaluran_harian | id | pangkalan_id |

### Pangkalan SAAS Module
| Tabel | PK | FK |
|-------|-----|-----|
| consumers | id | pangkalan_id |
| consumer_orders | id | pangkalan_id, consumer_id |
| pangkalan_stocks | id | pangkalan_id |
| lpg_prices | id | pangkalan_id |
| expenses | id | pangkalan_id |
| agen_orders | id | pangkalan_id, agen_id |

### Audit
| Tabel | PK | FK |
|-------|-----|-----|
| activity_logs | id | user_id, order_id |

## 4.2 Crow's Foot Notation

| Simbol | Arti |
|--------|------|
| \|\| | One (mandatory) |
| \|o | Zero or One |
| \|{ | One or Many |
| o{ | Zero or Many |

## 4.3 Relasi Utama

| Tabel A | Cardinality | Tabel B |
|---------|:-----------:|---------|
| pangkalans | 1 : N | orders |
| orders | 1 : N | order_items |
| orders | 1 : 1 | order_payment_details |
| orders | 1 : N | timeline_tracks |
| pangkalans | 1 : N | consumers |
| pangkalans | 1 : N | consumer_orders |
| agen | 1 : N | pangkalans |

---

# 5. ACTIVITY DIAGRAM

## 5.1 Daftar Activity Diagram (25 Diagram)

### Fase 1 - Core Business
| No | Diagram | File |
|----|---------|------|
| 1 | Login | AD_01_Login.puml |
| 2 | Buat Pesanan | AD_02_BuatPesanan.puml |
| 3 | Update Status | AD_03_UpdateStatus.puml |
| 4 | Catat Pembayaran | AD_04_CatatPembayaran.puml |
| 5 | Catat Penerimaan Stok | AD_05_CatatPenerimaanStok.puml |
| 6 | Catat Penyaluran | AD_06_CatatPenyaluran.puml |
| 7 | Generate Laporan | AD_07_GenerateLaporan.puml |
| 8 | Assign Driver | AD_08_AssignDriver.puml |
| 9 | Kelola Profil | AD_09_KelolaProfil.puml |

### Fase 2 - Extended Features
| No | Diagram | File |
|----|---------|------|
| 10-25 | Extended Features | AD_10 - AD_25 |

## 5.2 Komponen Activity Diagram

| Komponen | Simbol | Fungsi |
|----------|--------|--------|
| Initial Node | ● | Titik awal |
| Final Node | ◉ | Titik akhir |
| Action | ▭ | Aktivitas/langkah |
| Decision | ◇ | Percabangan |
| Fork/Join | ▬ | Parallel execution |
| Swimlane | Kolom | Pembagian per aktor |

---

# 6. SEQUENCE DIAGRAM

## 6.1 Daftar Sequence Diagram (18 Diagram)

### Fase 1 - Core Business
| No | Diagram | File |
|----|---------|------|
| 1 | Login | SD_01_Login.puml |
| 2 | Validate Token | SD_02_ValidateToken.puml |
| 3 | Create Order | SD_03_CreateOrder.puml |
| 4 | Update Status | SD_04_UpdateStatus.puml |
| 5 | Assign Driver | SD_05_AssignDriver.puml |
| 6 | Record Payment | SD_06_RecordPayment.puml |
| 7 | Stock In | SD_07_StockIn.puml |
| 8 | Stock Out | SD_08_StockOut.puml |

### Fase 2 - Extended Features
| No | Diagram | File |
|----|---------|------|
| 9-18 | Extended Features | SD_09 - SD_18 |

## 6.2 Stereotype Participant

| Stereotype | Simbol | Contoh |
|------------|--------|--------|
| <<actor>> | 🧑 | User, Admin |
| <<boundary>> | ◻ | LoginPage, OrderForm |
| <<control>> | ◎ | AuthService, OrderService |
| <<database>> | ⬡ | users, orders |

## 6.3 Message Types

| Tipe | Simbol | Arti |
|------|--------|------|
| Synchronous | ──▶ | Request blocking |
| Return | - - -> | Response |
| Self-call | ↩ | Panggil diri sendiri |

---

# 7. STATE MACHINE DIAGRAM

## 7.1 Daftar State Machine (2 Diagram)

| No | Diagram | File | States |
|----|---------|------|--------|
| 1 | Payment Status | SM_02_PaymentStatus.puml | 3 states |
| 2 | User Session | SM_04_UserSession.puml | 4 states |

## 7.2 SM-02: Payment Status

```
           ┌─────────────────────────────┐
           │                             │
           ▼                             │
[*] ──→ UNPAID ──[pay partial]──→ PARTIAL
           │                        │
           │                        │ [pay rest]
           │ [pay full]             │
           │                        ▼
           └───────────────────→ PAID ──→ [*]
```

### State Details
| State | is_paid | is_dp | Deskripsi |
|-------|---------|-------|-----------|
| UNPAID | false | false | Belum ada pembayaran |
| PARTIAL | false | true | Sudah DP, belum lunas |
| PAID | true | false | Lunas |

## 7.3 SM-04: User Session (Single-Session Login)

```
[*] ──→ LOGGED_OUT
           │
           │ [login success]
           ▼
       LOGGED_IN ──[login dari device lain]──→ KICKED_OUT
           │                                        │
           │ [token expired]                        │
           ▼                                        │
    SESSION_EXPIRED                                 │
           │                                        │
           └────────────────────────────────────────┘
                              │
                              ▼
                          LOGGED_OUT
```

---

# 8. DEPLOYMENT DIAGRAM

## 8.1 Arsitektur Deployment

```
┌─────────────┐     HTTPS      ┌─────────────┐
│   Browser   │ ─────────────→ │   Vercel    │
│  (Client)   │                │  (Frontend) │
└─────────────┘                └──────┬──────┘
                                      │ HTTPS
                                      ▼
                               ┌─────────────┐
                               │   Railway   │
                               │  (Backend)  │
                               └──────┬──────┘
                                      │ TCP
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
             ┌───────────┐     ┌───────────┐     ┌───────────┐
             │PostgreSQL │     │  Supabase │     │  NestJS   │
             │    15     │     │  Storage  │     │   API     │
             └───────────┘     └───────────┘     └───────────┘
```

## 8.2 Komponen

| Node | Platform | Komponen |
|------|----------|----------|
| Browser | Chrome/Firefox | React 18 App |
| Vercel | Cloud | Frontend hosting, CDN |
| Railway | Cloud | NestJS 10 API |
| Railway | Cloud | PostgreSQL 15 Database |
| Supabase | Cloud | S3-compatible Storage |

## 8.3 Environment Variables

| Variable | Lokasi | Deskripsi |
|----------|--------|-----------|
| DATABASE_URL | Backend | Connection string PostgreSQL |
| JWT_SECRET | Backend | Secret untuk JWT |
| SUPABASE_URL | Backend | Supabase endpoint |
| SUPABASE_KEY | Backend | Supabase API key |
| VITE_API_URL | Frontend | Backend API URL |

---

# LAMPIRAN

## File Diagram (PlantUML)

| Jenis | File |
|-------|------|
| Use Case | SIM4LON_UseCase.puml |
| Class | SIM4LON_ClassDiagram.puml |
| ERD | SIM4LON_ERD.puml |
| Activity | AD_01 - AD_25.puml |
| Sequence | SD_01 - SD_18.puml |
| State Machine | SM_02, SM_04.puml |
| Deployment | SIM4LON_Deployment.puml |

## Tools untuk Render

- **PlantUML Server**: https://www.plantuml.com/plantuml
- **VS Code Extension**: PlantUML by jebbs
- **IntelliJ Plugin**: PlantUML Integration

---

*Dokumentasi UML SIM4LON - Versi Terbaru*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*  
*Desember 2024*
