# 📚 PANDUAN LENGKAP UML SIM4LON
## Belajar UML 100% dari Proyek Nyata

> **Tujuan:** Memahami semua diagram UML di SIM4LON secara mendalam untuk persiapan seminar KP.

---

## 📋 DAFTAR ISI

1. [Apa itu UML?](#1-apa-itu-uml)
2. [Use Case Diagram](#2-use-case-diagram)
3. [Activity Diagram](#3-activity-diagram)
4. [Sequence Diagram](#4-sequence-diagram)
5. [Class Diagram](#5-class-diagram)
6. [State Machine Diagram](#6-state-machine-diagram)
7. [ERD (Entity Relationship Diagram)](#7-erd)
8. [Deployment Diagram](#8-deployment-diagram)
9. [Pertanyaan yang Mungkin Ditanya](#9-pertanyaan-seminar)

---

# 1. APA ITU UML?

## 1.1 Definisi
**UML (Unified Modeling Language)** adalah bahasa visual standar untuk:
- **Memodelkan** sistem perangkat lunak
- **Mendokumentasikan** arsitektur dan desain
- **Mengkomunikasikan** ide antar developer

## 1.2 Kategori Diagram UML

| Kategori | Diagram | Di SIM4LON |
|----------|---------|------------|
| **Struktural** | Class Diagram, ERD, Deployment | ✅ Ada |
| **Behavioral** | Use Case, Activity, State Machine | ✅ Ada |
| **Interaksi** | Sequence Diagram | ✅ Ada |

## 1.3 Statistik UML SIM4LON

| Jenis Diagram | Jumlah | Lokasi File |
|---------------|--------|-------------|
| Use Case | 17 use cases | `SIM4LON_UseCase.puml` |
| Activity Diagram | 29 | `AD_01_Login.puml` - `AD_29_KelolaStok.puml` |
| Sequence Diagram | 20 | `SD_01_Login.puml` - `SD_20_VoiceOrderAI.puml` |
| State Machine | 3 | `SM_01_StatusPesanan.puml` - `SM_03_UserSession.puml` |
| Class Diagram | 23 classes + 7 enum | `SIM4LON_ClassDiagram.puml` |
| ERD | 22 entitas | `SIM4LON_ERD.puml` |
| Deployment | 1 | `SIM4LON_Deployment.puml` |

---

# 2. USE CASE DIAGRAM

## 2.1 Apa itu Use Case Diagram?

> **Use Case Diagram** menggambarkan **APA** yang bisa dilakukan sistem dari sudut pandang pengguna.

### Komponen Use Case Diagram:

| Simbol | Nama | Penjelasan |
|--------|------|------------|
| 🧑 (Stickman) | **Actor** | Pengguna sistem (Admin, Operator, Pangkalan) |
| ⭕ (Oval) | **Use Case** | Fitur/fungsi yang bisa dilakukan |
| ▭ (Rectangle) | **System Boundary** | Batas sistem |
| ── (Garis lurus) | **Association** | Aktor bisa melakukan use case |
| `<<include>>` | **Include** | Use case wajib dipanggil |
| `<<extend>>` | **Extend** | Use case opsional/tambahan |

## 2.2 Aktor di SIM4LON

```
┌─────────────────────────────────────────────────┐
│                   SIM4LON                       │
├─────────┬───────────┬───────────────────────────┤
│ ADMIN   │ OPERATOR  │ PANGKALAN                 │
├─────────┴───────────┴───────────────────────────┤
│ • Full access       • Operasional    • Data    │
│ • Master data       • Pesanan        • Sendiri │
│ • User management   • Stok           • Multi-  │
│ • Konfigurasi       • Pembayaran     • tenant  │
└─────────────────────────────────────────────────┘
```

### Penjelasan Tiap Aktor:

| Aktor | Role | Hak Akses | Contoh Pengguna |
|-------|------|-----------|-----------------|
| **Admin** | Administrator | Full access semua fitur + master data | Pemilik Agen, Manager |
| **Operator** | Staff Operasional | Pesanan, stok, pembayaran, laporan | Staff gudang, Kasir |
| **Pangkalan** | Pemilik Pangkalan | Data milik sendiri saja | Pemilik warung gas |

## 2.3 Daftar 17 Use Case SIM4LON

### Use Case Semua Aktor (3):
| UC-ID | Nama Use Case | Deskripsi |
|-------|---------------|-----------|
| UC-01 | **Login** | Masuk dengan email + password (single-session) |
| UC-02 | **Kelola Profil** | View & update profil pengguna |
| UC-08 | **Kelola Dashboard** | Melihat ringkasan KPI dan statistik |

### Use Case ADMIN Only (5):
| UC-ID | Nama Use Case | Deskripsi |
|-------|---------------|-----------|
| UC-03 | **Kelola Pengguna** | CRUD data Admin/Operator |
| UC-04 | **Kelola Supir** | CRUD data driver pengiriman |
| UC-05 | **Lihat Log Aktivitas** | Audit trail sistem |
| UC-06 | **Kelola Pangkalan** | CRUD pangkalan + auto-create user |
| UC-07 | **Kelola Perencanaan** | Perencanaan alokasi bulanan |

### Use Case ADMIN + OPERATOR (5):
| UC-ID | Nama Use Case | Deskripsi |
|-------|---------------|-----------|
| UC-09 | **Kelola Stok** | Penerimaan dari SPBE + penyaluran |
| UC-10 | **Kelola Laporan** | Generate & export laporan |
| UC-11 | **Kelola Pembayaran** | Catat pembayaran tunai/transfer |
| UC-13 | **Update Status** | Ubah status pesanan |
| UC-15 | **Kelola Pesanan** | CRUD pesanan + update status |

### Use Case PANGKALAN Only (3):
| UC-ID | Nama Use Case | Deskripsi |
|-------|---------------|-----------|
| UC-16 | **Kelola Penjualan** | Catat penjualan ke konsumen |
| UC-17 | **Kelola Konsumen** | CRUD data konsumen tetap |
| UC-18 | **Buat Order ke Agen** | Order stok ke agen |

### Relasi Include & Extend (2):
| Relasi | From → To | Penjelasan |
|--------|-----------|------------|
| `<<include>>` | Kelola Pesanan → Update Status | Setiap pesanan **WAJIB** punya status |
| `<<extend>>` | Cetak Nota → Kelola Pembayaran | Cetak nota **OPSIONAL** setelah bayar |
| `<<extend>>` | Assign Driver → Update Status | Assign driver **OPSIONAL** saat kirim |

## 2.4 Cara Baca Use Case Diagram

```plantuml
actor "Admin" as Admin
usecase "Kelola Pesanan" as UC15
usecase "Update Status" as UC13
usecase "Assign Driver" as UC14

Admin --> UC15            ' Admin bisa Kelola Pesanan
UC13 ..> UC15 : <<Include>>  ' Update Status WAJIB di Kelola Pesanan
UC14 ..> UC13 : <<Extend>>   ' Assign Driver OPSIONAL di Update Status
```

**Penjelasan:**
- **Admin → Kelola Pesanan**: Admin bisa membuat dan mengelola pesanan
- **Include**: Saat kelola pesanan, sistem WAJIB menjalankan Update Status
- **Extend**: Saat update status ke "DIKIRIM", OPSIONAL bisa Assign Driver

---

# 3. ACTIVITY DIAGRAM

## 3.1 Apa itu Activity Diagram?

> **Activity Diagram** menggambarkan **ALUR PROSES** atau langkah-langkah dalam menyelesaikan sebuah tugas.

### Komponen Activity Diagram:

| Simbol | Nama | Penjelasan |
|--------|------|------------|
| ●→ | **Initial Node** | Titik mulai proses |
| ⊕ | **Final Node** | Titik akhir proses |
| ▭ | **Activity** | Aksi/langkah yang dilakukan |
| ◇ | **Decision** | Percabangan IF-ELSE |
| █ (thick bar) | **Fork/Join** | Proses paralel |
| │ (swimlane) | **Partition** | Membagi aksi per aktor |

## 3.2 Daftar 29 Activity Diagram

### Fase 1: Core Processes (9)
| ID | Nama | File | Aktor |
|----|------|------|-------|
| AD-01 | Login | `AD_01_Login.puml` | Semua |
| AD-02 | Buat Pesanan | `AD_02_BuatPesanan.puml` | Admin/Operator |
| AD-03 | Update Status Pesanan | `AD_03_UpdateStatusPesanan.puml` | Admin/Operator |
| AD-04 | Catat Pembayaran | `AD_04_CatatPembayaran.puml` | Admin/Operator |
| AD-05 | Catat Penerimaan Stok | `AD_05_CatatPenerimaanStok.puml` | Admin/Operator |
| AD-06 | Catat Penyaluran | `AD_06_CatatPenyaluran.puml` | Admin/Operator |
| AD-07 | Catat Penjualan | `AD_07_CatatPenjualan.puml` | Pangkalan |
| AD-08 | Buat Order ke Agen | `AD_08_BuatOrderKeAgen.puml` | Pangkalan |
| AD-09 | Kelola Pangkalan | `AD_09_KelolaPangkalan.puml` | Admin |

### Fase 2: Supporting Processes (20)
| ID | Nama | File |
|----|------|------|
| AD-10 | Ubah Password | `AD_10_UbahPassword.puml` |
| AD-11 | Kelola Pengguna | `AD_11_KelolaPengguna.puml` |
| AD-12 | Kelola Supir | `AD_12_KelolaSupir.puml` |
| AD-13 | Kelola Produk LPG | `AD_13_KelolaProdukLPG.puml` |
| AD-14 | Assign Driver | `AD_14_AssignDriver.puml` |
| AD-15 | Lihat Detail Pesanan | `AD_15_LihatDetailPesanan.puml` |
| AD-16 | Generate Invoice | `AD_16_GenerateInvoice.puml` |
| AD-17 | Voice Order AI | `AD_17_Voice_Order_AI.puml` |
| AD-18 | Kelola Perencanaan | `AD_18_KelolaPerencanaan.puml` |
| AD-19 | Lihat In/Out Agen | `AD_19_LihatInOutAgen.puml` |
| AD-20 | Kelola Konsumen | `AD_20_KelolaKonsumen.puml` |
| AD-21 | Kelola Stok Pangkalan | `AD_21_KelolaStokPangkalan.puml` |
| AD-22 | Terima Order dari Agen | `AD_22_TerimaOrderDariAgen.puml` |
| AD-23 | Kelola Pengeluaran | `AD_23_KelolaPengeluaran.puml` |
| AD-24 | Generate Laporan | `AD_24_GenerateLaporan.puml` |
| AD-25 | Export Laporan | `AD_25_ExportLaporan.puml` |

## 3.3 Contoh: AD-02 Buat Pesanan

```
┌────────────────────────────────────────────────────────────┐
│                     BUAT PESANAN                           │
├────────────────────────┬───────────────────────────────────┤
│        USER            │             SISTEM                │
├────────────────────────┼───────────────────────────────────┤
│    ● Start             │                                   │
│    │                   │                                   │
│    ▼                   │                                   │
│ ┌────────────────┐     │                                   │
│ │Buka halaman    │     │                                   │
│ │Pesanan         │─────┼─────▶┌────────────────────────┐  │
│ └────────────────┘     │      │Load daftar Pangkalan   │  │
│                        │      │Load daftar Produk LPG  │  │
│                        │      └────────────────────────┘  │
│                        │                │                  │
│    ◀───────────────────┼────────────────┘                  │
│                        │                                   │
│ ┌────────────────┐     │                                   │
│ │Pilih Pangkalan │     │                                   │
│ │Pilih LPG       │     │                                   │
│ │Input Quantity  │─────┼─────▶┌────────────────────────┐  │
│ │Klik "Simpan"   │     │      │Validasi input          │  │
│ └────────────────┘     │      └─────────┬──────────────┘  │
│                        │                │                  │
│                        │       ◇ Valid? │                  │
│                        │      /   \     │                  │
│                        │    Ya     Tidak──▶ Error message  │
│                        │    │                              │
│                        │    ▼                              │
│                        │ ┌────────────────────────┐       │
│                        │ │Generate kode ORD-XXXX │        │
│                        │ │Hitung subtotal, PPN   │        │
│                        │ │Simpan ke database     │        │
│                        │ │Buat timeline track    │        │
│                        │ └─────────┬──────────────┘       │
│                        │           │                       │
│    ◀───────────────────┼───────────┘                       │
│    │                   │                                   │
│    ▼                   │                                   │
│ ┌────────────────┐     │                                   │
│ │Tampil sukses   │     │                                   │
│ │Redirect detail │     │                                   │
│ └────────────────┘     │                                   │
│    │                   │                                   │
│    ▼                   │                                   │
│    ⊕ End               │                                   │
└────────────────────────┴───────────────────────────────────┘
```

## 3.4 Cara Baca Swimlane

```
|User|
:Aksi yang dilakukan user;

|Sistem|
:Response dari sistem;
```

**Penjelasan:**
- Swimlane membagi diagram menjadi "jalur renang" per aktor
- Memudahkan melihat **SIAPA melakukan APA**
- User di kolom kiri, Sistem di kolom kanan

---

# 4. SEQUENCE DIAGRAM

## 4.1 Apa itu Sequence Diagram?

> **Sequence Diagram** menggambarkan **INTERAKSI** antar objek secara **BERURUTAN** berdasarkan waktu.

### Komponen Sequence Diagram:

| Simbol | Nama | Penjelasan |
|--------|------|------------|
| 🧑 | **Actor** | Pengguna yang memulai interaksi |
| ▢ | **Boundary** | UI/Interface (Frontend) |
| ◎ | **Control** | Business Logic (Service) |
| ⬡ | **Database** | Tabel database |
| → | **Message** | Request dari kiri ke kanan |
| ← | **Return** | Response dari kanan ke kiri |
| █ | **Activation** | Objek sedang aktif memproses |

## 4.2 Stereotype di SIM4LON

| Stereotype | Contoh | Fungsi |
|------------|--------|--------|
| `<<actor>>` | Admin, Operator, Pangkalan | Pengguna sistem |
| `<<boundary>>` | OrderPage, LoginForm | Komponen React UI |
| `<<control>>` | OrderService, AuthService | Service NestJS |
| `<<database>>` | orders, users, pangkalans | Tabel PostgreSQL |

## 4.3 Daftar 20 Sequence Diagram

### Fase 1: Core Processes (8)
| ID | Nama | Database Tables |
|----|------|-----------------|
| SD-01 | Login | users, activity_logs |
| SD-03 | Create Order | pangkalans, orders, order_items, timeline_tracks |
| SD-04 | Update Status | orders, order_items, timeline_tracks |
| SD-07 | Record Payment | order_payment_details, payment_records |
| SD-09 | Receive Stock | penerimaan_stok, stock_histories |
| SD-10 | Record Distribution | pangkalans, penyaluran_harian |
| SD-12 | Record Sale | consumers, pangkalan_stocks, consumer_orders |
| SD-16 | Create Pangkalan | pangkalans, users, activity_logs |

### Fase 2: Supporting Processes (10)
| ID | Nama | Database Tables |
|----|------|-----------------|
| SD-02 | Logout | users |
| SD-05 | Assign Driver | drivers, orders, timeline_tracks |
| SD-06 | Get Order Detail | orders, order_items, timeline_tracks |
| SD-08 | Generate Invoice | invoices, orders |
| SD-11 | Get Stock Summary | stock_histories, lpg_products |
| SD-13 | Create Order to Agen | agen_orders, pangkalans |
| SD-14 | Confirm Receipt | agen_orders, pangkalan_stocks |
| SD-15 | Dashboard Pangkalan | consumer_orders, pangkalan_stocks |
| SD-17 | CRUD Generic | (template) |
| SD-18 | Generate Export Report | orders, payment_records |

## 4.4 Contoh: SD-03 Create Order

```
┌─────────────────────────────────────────────────────────────────┐
│                    SD-03: CREATE ORDER                          │
├─────────┬─────────────┬─────────────┬─────────────┬─────────────┤
│  Admin  │  OrderPage  │OrderService │   orders    │order_items  │
│ <<actor>>│<<boundary>>│ <<control>> │<<database>> │<<database>> │
├─────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│    │    │             │             │             │             │
│    │────▶ 1: Buka form─▶            │             │             │
│    │    │             │             │             │             │
│    │    │──────────────▶2: getList()│             │             │
│    │    │             │──────────────▶SELECT *    │             │
│    │    │             │◀─────────────pangkalans   │             │
│    │◀───────tampil──────             │             │             │
│    │    │             │             │             │             │
│    │    │             │             │             │             │
│    │────▶ 3: input data             │             │             │
│    │────▶ 4: klik Simpan            │             │             │
│    │    │             │             │             │             │
│    │    │──────────────▶createOrder │             │             │
│    │    │             │──validate───│             │             │
│    │    │             │──generate───│ ORD-0100    │             │
│    │    │             │──────────────▶INSERT      │             │
│    │    │             │◀─────────────orderId      │             │
│    │    │             │─────────────────────────────▶INSERT    │
│    │    │             │◀────────────────────────────created    │
│    │    │             │             │             │             │
│    │◀───────sukses──────             │             │             │
│    │    │             │             │             │             │
└─────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## 4.5 Notasi Penomoran

```
1: Buka halaman Buat Pesanan          (Langkah utama)
1.1: getPangkalanList()               (Sub-langkah 1)
1.1.1: SELECT * FROM pangkalans       (Sub-sub-langkah)
1.1.1.1: pangkalanList                (Return value)
```

**Penjelasan:**
- Angka menunjukkan **urutan eksekusi**
- Titik (.) menunjukkan **hirarki panggilan**
- Return biasanya memakai garis putus-putus

---

# 5. CLASS DIAGRAM

## 5.1 Apa itu Class Diagram?

> **Class Diagram** menggambarkan **STRUKTUR** sistem berupa class, atribut, method, dan relasi antar class.

### Komponen Class Diagram:

| Simbol | Nama | Penjelasan |
|--------|------|------------|
| ▭ | **Class** | Entitas dengan atribut & method |
| - | **Private** | Atribut internal (tidak bisa diakses luar) |
| + | **Public** | Method yang bisa dipanggil |
| ── | **Association** | Hubungan biasa |
| ◇── | **Aggregation** | "has-a" (lemah) |
| ◆── | **Composition** | "owns" (kuat) |
| ◁── | **Generalization** | "is-a" (inheritance) |

## 5.2 Statistik Class Diagram SIM4LON

| Kategori | Jumlah | Penjelasan |
|----------|--------|------------|
| Classes | 23 | Entitas utama sistem |
| Enumerations | 7 | Tipe data konstanta |
| Relationships | 30+ | Hubungan antar class |

## 5.3 Struktur Class

```
┌─────────────────────────────────┐
│           orders                │  ← Nama class
├─────────────────────────────────┤
│ - id : string                   │  ← Atribut (private)
│ - code : string                 │
│ - pangkalan_id : string         │
│ - current_status : status_pesanan│
│ - total_amount : decimal        │
├─────────────────────────────────┤
│ + findAll(query) : orders[]     │  ← Method (public)
│ + create(dto) : orders          │
│ + updateStatus(id, dto) : orders│
└─────────────────────────────────┘
```

## 5.4 Enumerations di SIM4LON

| Enum | Values | Penggunaan |
|------|--------|------------|
| `user_role` | ADMIN, OPERATOR, PANGKALAN | Role akses pengguna |
| `status_pesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL | Status order |
| `lpg_type` | kg3, kg5_5, kg12, kg50 | Jenis tabung LPG |
| `lpg_category` | SUBSIDI, NON_SUBSIDI | Kategori harga |
| `payment_method` | TUNAI, TRANSFER | Cara bayar |
| `stock_movement_type` | MASUK, KELUAR | Pergerakan stok |
| `consumer_type` | RUMAH_TANGGA, WARUNG | Jenis konsumen |

## 5.5 Relasi Cardinality

| Notasi | Arti | Contoh |
|--------|------|--------|
| `1..1` | Tepat satu | 1 order punya 1 payment_details |
| `0..1` | Nol atau satu | Order bisa tanpa driver |
| `1..*` | Satu atau lebih | Order HARUS punya minimal 1 item |
| `0..*` | Nol atau lebih | Pangkalan bisa punya 0..banyak order |

### Contoh Relasi SIM4LON:

```
agen ──────────<> pangkalans       (1 agen punya banyak pangkalan)
pangkalans ────<> orders           (1 pangkalan bisa banyak order)
orders ────────◆ order_items       (1 order WAJIB punya items)
orders ────────◆ timeline_tracks   (1 order punya history status)
```

---

# 6. STATE MACHINE DIAGRAM

## 6.1 Apa itu State Machine Diagram?

> **State Machine Diagram** menggambarkan **PERPINDAHAN STATE** (status) suatu objek selama siklus hidupnya.

### Komponen State Machine:

| Simbol | Nama | Penjelasan |
|--------|------|------------|
| ●→ | **Initial State** | State awal |
| ⏹ | **State** | Kondisi objek saat ini |
| → | **Transition** | Perpindahan antar state |
| [kondisi] | **Guard** | Syarat untuk transisi |
| ⊕ | **Final State** | State akhir |

## 6.2 Daftar 3 State Machine

| ID | Nama | States | File |
|----|------|--------|------|
| SM-01 | Status Pesanan | 7 | `SM_01_StatusPesanan.puml` |
| SM-02 | Status Order ke Agen | 4 | `SM_02_StatusOrderKeAgen.puml` |
| SM-03 | User Session | 4 | `SM_03_UserSession.puml` |

## 6.3 SM-01: Status Pesanan (PALING PENTING!)

```
                    ● Start
                    │
                    ▼
              ┌─────────────┐
              │    DRAFT    │  Entry: Generate kode ORD-XXXX
              │             │  Entry: Hitung subtotal, tax
              └──────┬──────┘
                     │ Submit pesanan
                     ▼
        ┌────────────────────────┐
        │  MENUNGGU_PEMBAYARAN   │  Entry: Notifikasi Pangkalan
        │       (WARNING)        │  Do: Tunggu pembayaran
        └────────────┬───────────┘
                     │ [is_paid = true]
                     ▼
              ┌─────────────┐
              │  DIPROSES   │  Entry: Verifikasi pembayaran
              │  (ACTIVE)   │  Do: Siapkan barang
              └──────┬──────┘
                     │ Barang siap
                     ▼
              ┌─────────────┐
              │ SIAP_KIRIM  │  Entry: Assign driver (opsional)
              └──────┬──────┘
                     │ [driver_id != null]
                     ▼
              ┌─────────────┐
              │  DIKIRIM    │  Entry: Driver berangkat
              │  (ACTIVE)   │  Do: Dalam perjalanan
              └──────┬──────┘
                     │ Barang diterima
                     ▼
              ┌─────────────┐
              │   SELESAI   │  Entry: Auto-sync stok pangkalan
              │  (SUCCESS)  │  Entry: Update pangkalan_stocks
              └──────┬──────┘
                     │
                     ▼
                    ⊕ End

    ──────────────────────────────────────────
    CANCEL dari state manapun (kecuali SELESAI):
    ──────────────────────────────────────────
              ┌─────────────┐
              │    BATAL    │  Entry: Log alasan pembatalan
              │  (DANGER)   │  Entry: Rollback stok (jika ada)
              └──────┬──────┘
                     │
                     ▼
                    ⊕ End
```

### Penjelasan Transisi:

| Dari | Ke | Trigger | Guard |
|------|----|---------|-------|
| DRAFT | MENUNGGU_PEMBAYARAN | Submit pesanan | - |
| MENUNGGU_PEMBAYARAN | DIPROSES | Pembayaran lunas | `is_paid = true` |
| DIPROSES | SIAP_KIRIM | Barang siap | - |
| SIAP_KIRIM | DIKIRIM | Driver berangkat | `driver_id != null` |
| DIKIRIM | SELESAI | Barang diterima | Konfirmasi pangkalan |
| * (any except SELESAI) | BATAL | Cancel | - |

### Action Entry/Do/Exit:

| Keyword | Arti | Contoh |
|---------|------|--------|
| **Entry** | Dijalankan SAAT MASUK state | Generate kode ORD-XXXX |
| **Do** | Dijalankan SELAMA di state | Tunggu pembayaran |
| **Exit** | Dijalankan SAAT KELUAR state | Generate invoice |

## 6.4 SM-03: User Session (Single Session)

```
        ● Start
        │
        ▼
┌───────────────┐
│  LOGGED_OUT   │  User belum login
└───────┬───────┘
        │ Login sukses (generate session_id baru)
        ▼
┌───────────────┐
│  LOGGED_IN    │  Token valid, session aktif
└───────┬───────┘
        │
   ┌────┴────┐
   ▼         ▼
┌──────────┐ ┌──────────────┐
│ EXPIRED  │ │ KICKED_OUT   │
│(timeout) │ │(login device │
└────┬─────┘ │ lain)        │
     │       └──────┬───────┘
     │              │
     ▼              ▼
 Auto logout    Auto logout
```

**Single Session artinya:**
- Setiap login → generate `session_id` baru
- Jika login dari device lain → session lama otomatis expired
- Token memiliki `session_id` yang harus cocok dengan database

---

# 7. ERD (Entity Relationship Diagram)

## 7.1 Apa itu ERD?

> **ERD** menggambarkan **STRUKTUR DATABASE** berupa entitas (tabel), atribut (kolom), dan relasi (foreign key).

## 7.2 Statistik ERD SIM4LON

| Kategori | Jumlah | Keterangan |
|----------|--------|------------|
| Total Tables | 22 | PostgreSQL |
| Total Enums | 7 | user_role, status_pesanan, dll |
| Primary Key | UUID | pgcrypto extension |

## 7.3 Kategori Entitas

### Master Data (6 tables)
| Tabel | Deskripsi | PK |
|-------|-----------|-----|
| `users` | Akun pengguna | id (UUID) |
| `agen` | Distributor LPG | id (UUID) |
| `pangkalans` | Pangkalan LPG | id (UUID) |
| `drivers` | Supir pengiriman | id (UUID) |
| `lpg_products` | Katalog produk | id (UUID) |
| `company_profile` | Profil agen | id (UUID) |

### Order Management (6 tables)
| Tabel | Deskripsi | FK |
|-------|-----------|-----|
| `orders` | Pesanan utama | pangkalan_id, driver_id |
| `order_items` | Item dalam pesanan | order_id |
| `timeline_tracks` | Riwayat status | order_id |
| `invoices` | Faktur | order_id |
| `order_payment_details` | Summary pembayaran | order_id |
| `payment_records` | Transaksi payment | order_id, invoice_id |

### Pangkalan SAAS (7 tables)
| Tabel | Deskripsi | FK |
|-------|-----------|-----|
| `consumers` | Konsumen pangkalan | pangkalan_id |
| `consumer_orders` | Penjualan | pangkalan_id, consumer_id |
| `pangkalan_stocks` | Stok pangkalan | pangkalan_id |
| `lpg_prices` | Harga jual | pangkalan_id |
| `expenses` | Pengeluaran | pangkalan_id |
| `agen_orders` | Order ke agen | pangkalan_id, agen_id |
| `pangkalan_stock_movements` | Riwayat stok | pangkalan_id |

### Stock & Audit (3 tables)
| Tabel | Deskripsi | FK |
|-------|-----------|-----|
| `penerimaan_stok` | Dari SPBE | - |
| `penyaluran_harian` | Ke pangkalan | pangkalan_id |
| `perencanaan_harian` | Alokasi | pangkalan_id |
| `stock_histories` | Riwayat stok agen | lpg_product_id |
| `activity_logs` | Log aktivitas | user_id, order_id |

## 7.4 Relasi Kunci

```
agen (1) ───────< (0..*) pangkalans
  │
  └─ 1 agen memasok banyak pangkalan

pangkalans (1) ───────< (0..*) orders
  │
  └─ 1 pangkalan bisa banyak pesanan

orders (1) ────────◆ (1..*) order_items
  │
  └─ 1 pesanan WAJIB punya minimal 1 item (COMPOSITION)

orders (1) ────────○ (1) order_payment_details
  │
  └─ 1 pesanan punya 1 summary pembayaran (ONE-TO-ONE)

pangkalans (1) ───────< (0..*) consumers
  │
  └─ 1 pangkalan punya banyak konsumen

consumers (1) ───────< (0..*) consumer_orders
  │
  └─ 1 konsumen bisa banyak pembelian
```

---

# 8. DEPLOYMENT DIAGRAM

## 8.1 Apa itu Deployment Diagram?

> **Deployment Diagram** menggambarkan **ARSITEKTUR FISIK** sistem, termasuk server, database, dan protokol komunikasi.

## 8.2 Arsitektur SIM4LON

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Admin   │  │Operator │  │Pangkalan│  │ Mobile  │            │
│  │ Chrome  │  │ Firefox │  │ Safari  │  │ Browser │            │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                          │
                    HTTPS:443
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VERCEL (Frontend)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Astro 5 + React 18 + TypeScript             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │Dashboard │ │  Orders  │ │  Stock   │ │ Reports  │    │   │
│  │  │ Shadcn/UI│ │Tailwind  │ │  Zustand │ │  Lucide  │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                            HTTPS:443 (REST API)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       RAILWAY (Backend)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              NestJS 11 + Prisma 6 + TypeScript           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │  Auth    │ │  Order   │ │  Stock   │ │ Payment  │    │   │
│  │  │(JWT +    │ │ Service  │ │ Service  │ │ Service  │    │   │
│  │  │Passport) │ │          │ │          │ │          │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────┬─────────────────────────┬───────────┬───────────────┘
            │                         │           │
       TCP:5432                  HTTPS:443    HTTPS:443
            │                         │           │
            ▼                         ▼           ▼
┌─────────────────────────┐  ┌─────────────────┐ ┌──────────────┐
│  RAILWAY PostgreSQL 15  │  │SUPABASE STORAGE │ │ GOOGLE CLOUD │
│  ┌───────────────────┐  │  │┌───────────────┐│ │ ┌──────────┐ │
│  │  23 Tables        │  │  ││S3-compatible  ││ │ │ Gemini   │ │
│  │  7 Enums          │  │  ││File Uploads   ││ │ │ 2.0 Flash│ │
│  │  UUID Primary Key │  │  ││Profile, Bukti ││ │ │Voice NLP │ │
│  └───────────────────┘  │  ││Payment, Produk││ │ └──────────┘ │
└─────────────────────────┘  │└───────────────┘│ └──────────────┘
                             └─────────────────┘
```

## 8.3 Tech Stack Summary

| Layer | Technology | URL |
|-------|------------|-----|
| **Frontend** | Astro 5 + React 18 + TypeScript | https://sim4lon.vercel.app |
| **Backend** | NestJS 11 + Prisma 6 + TypeScript | https://sim4lon-production.up.railway.app |
| **Database** | PostgreSQL 15 (23 Tables, 7 Enums) | Railway internal |
| **Storage** | Supabase S3-compatible | https://xxx.supabase.co |
| **AI** | Google Gemini 2.0 Flash | Google Cloud API |

---

# 9. PERTANYAAN SEMINAR

## 9.1 Kategori Pertanyaan UML

### Use Case Questions:
| No | Pertanyaan | Jawaban Singkat |
|----|------------|-----------------|
| 1 | Berapa use case di sistem? | 17 use case |
| 2 | Apa perbedaan include dan extend? | Include = wajib, Extend = opsional |
| 3 | Sebutkan 3 aktor sistem! | Admin, Operator, Pangkalan |
| 4 | Apa multi-tenant? | Setiap pangkalan hanya akses data sendiri |

### Activity Diagram Questions:
| No | Pertanyaan | Jawaban Singkat |
|----|------------|-----------------|
| 5 | Berapa Activity Diagram? | 29 diagram |
| 6 | Apa fungsi swimlane? | Membagi aksi per aktor |
| 7 | Jelaskan alur Buat Pesanan! | User pilih pangkalan → pilih LPG → input qty → sistem validasi → simpan |

### Sequence Diagram Questions:
| No | Pertanyaan | Jawaban Singkat |
|----|------------|-----------------|
| 8 | Apa perbedaan boundary, control, database? | UI, Business Logic, Storage |
| 9 | Berapa Sequence Diagram? | 20 diagram |
| 10 | Jelaskan alur Create Order! | User input → Service validate → generate kode → INSERT orders → INSERT items |

### State Machine Questions:
| No | Pertanyaan | Jawaban Singkat |
|----|------------|-----------------|
| 11 | Berapa state dalam Status Pesanan? | 7 state (DRAFT hingga BATAL) |
| 12 | Apa yang terjadi saat SELESAI? | Auto-sync stok pangkalan |
| 13 | Jelaskan Single Session! | 1 user = 1 device, login baru = logout otomatis device lama |

### Class Diagram & ERD Questions:
| No | Pertanyaan | Jawaban Singkat |
|----|------------|-----------------|
| 14 | Berapa class/tabel? | 23 class, 7 enum |
| 15 | Apa perbedaan aggregation & composition? | Aggregation = lemah, Composition = kuat (child ikut destroy) |

## 9.2 Tips Menjawab

1. **Sebutkan angka** → "Ada 17 use case, 29 activity diagram"
2. **Jelaskan dengan contoh** → "Misalnya UC Buat Pesanan..."
3. **Hubungkan ke kebutuhan** → "Ini untuk memudahkan operator..."
4. **Referensikan teori** → "Menurut Sommerville (2016), use case adalah..."

---

> **Next Step:** Baca file-file .puml di folder `e:\DATA\Ngoding\sim4lon\diagrams\` untuk memahami sintaks PlantUML.
> 
> **File Images:** Lihat hasil render di folder `docs/diagrams/3 AD/` untuk preview diagram.

---

*Dokumen ini dibuat untuk persiapan Seminar KP SIM4LON*
*© 2026 Luthfi Alfaridz - Teknik Informatika UNSUR*
