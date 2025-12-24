# DOKUMENTASI TEKNIS SISTEM
# SIM4LON - Sistem Informasi Manajemen LPG

---

**Document Version:** 1.1  
**Date:** 24 Desember 2025  
**Author:** Luthfi Alfaridz (CEO ReonTech)  
**Company:** ReonTech  
**Status:** Final 

---

## DAFTAR ISI

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Technology Stack](#3-technology-stack)
4. [Use Case Diagram](#4-use-case-diagram)
5. [Class Diagram & ERD](#5-class-diagram--erd)
6. [Activity Diagrams](#6-activity-diagrams)
7. [Sequence Diagrams](#7-sequence-diagrams)
8. [State Machine Diagrams](#8-state-machine-diagrams)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Security & Authentication](#10-security--authentication)
11. [Appendix](#11-appendix)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Tentang SIM4LON

**SIM4LON (Sistem Informasi Manajemen LPG 4 Jalur Online)** adalah aplikasi web yang dirancang untuk mengelola distribusi gas LPG dari **Agen** ke **Pangkalan** hingga ke **Konsumen akhir**.

## 1.2 Tujuan Sistem

| Tujuan | Deskripsi |
|--------|-----------|
| **Efisiensi Operasional** | Digitalisasi proses pencatatan pesanan, stok, dan pembayaran |
| **Transparansi** | Tracking real-time status pesanan dan stok |
| **Multi-Tenant** | Setiap pangkalan hanya akses data miliknya |
| **Reporting** | Laporan komprehensif untuk analisis bisnis |

## 1.3 Scope Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         AGEN LPG                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Penerimaan  │→ │   Stok       │→ │  Penyaluran  │          │
│  │  dari SPBE   │  │   Agen       │  │  ke Pangkalan│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      PANGKALAN LPG                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Terima dari │→ │   Stok       │→ │  Penjualan   │          │
│  │    Agen      │  │  Pangkalan   │  │ ke Konsumen  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    KONSUMEN AKHIR                               │
│         Rumah Tangga  |  Warung  |  UMKM                       │
└─────────────────────────────────────────────────────────────────┘
```

## 1.4 Statistik Dokumentasi

| Diagram Type | Jumlah | File Type |
|--------------|--------|-----------|
| Use Case | 1 | PlantUML |
| Class Diagram | 1 | PlantUML |
| ERD | 1 | PlantUML |
| Activity Diagram | 25 | PlantUML |
| Sequence Diagram | 18 | PlantUML |
| State Machine | 4 | PlantUML |
| Deployment | 1 | PlantUML |
| **TOTAL** | **51** | |

---

# 2. SYSTEM OVERVIEW

## 2.1 Arsitektur High-Level

```
┌────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     React 18 + Vite 5                        │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────────┐   │ │
│  │  │ Admin   │ │Operator │ │Pangkalan│ │ Shadcn/UI        │   │ │
│  │  │Dashboard│ │ Views   │ │ Portal  │ │ Components       │   │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS:443
┌────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                       │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     NestJS 10 + Prisma 5                     │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │ │
│  │  │  Auth   │ │  Order  │ │  Stock  │ │ Payment │            │ │
│  │  │ Module  │ │ Service │ │ Service │ │ Service │            │ │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                              ↓ TCP:5432
┌────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS LAYER                         │
│  ┌────────────────────────┐    ┌────────────────────────┐         │
│  │   PostgreSQL 15        │    │   Supabase Storage     │         │
│  │   21 Tables            │    │   S3-compatible        │         │
│  │   7 Enums              │    │   File uploads         │         │
│  └────────────────────────┘    └────────────────────────┘         │
└────────────────────────────────────────────────────────────────────┘
```

## 2.2 Aktor Sistem

| Aktor | Role | Akses |
|-------|------|-------|
| **Admin** | Administrator | Full access semua fitur + master data |
| **Operator** | Staff Operasional | Pesanan, stok, pembayaran |
| **Pangkalan** | Pemilik Pangkalan | Data milik sendiri saja (multi-tenant) |

---

# 3. TECHNOLOGY STACK

## 3.1 Frontend

| Technology | Version | Fungsi |
|------------|---------|--------|
| **React** | 18 | UI Library |
| **Vite** | 5 | Build Tool & Dev Server |
| **TypeScript** | 5 | Type Safety |
| **TanStack Query** | v5 | Data Fetching & Caching |
| **React Router** | v6 | Client-side Routing |
| **Tailwind CSS** | 3 | Utility-first CSS |
| **Shadcn/UI** | Latest | Pre-built Components |
| **Lucide Icons** | Latest | Icon Library |
| **Recharts** | Latest | Charts & Graphs |

## 3.2 Backend

| Technology | Version | Fungsi |
|------------|---------|--------|
| **NestJS** | 10 | Backend Framework |
| **Prisma** | 5 | ORM & Database Client |
| **Passport** | Latest | Authentication Framework |
| **JWT** | Latest | Token-based Auth |
| **Multer** | Latest | File Upload Handler |
| **class-validator** | Latest | DTO Validation |
| **bcrypt** | Latest | Password Hashing |

## 3.3 Database & Storage

| Technology | Fungsi |
|------------|--------|
| **PostgreSQL 15** | Relational Database |
| **Supabase Storage** | S3-compatible File Storage |

## 3.4 Hosting

| Layer | Provider |
|-------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | Railway PostgreSQL |
| Storage | Supabase |

---

# 4. USE CASE DIAGRAM

## 4.1 Diagram

File: `SIM4LON_UseCase.puml`

## 4.2 Daftar Use Case

### Use Case SEMUA AKTOR

| Use Case | Deskripsi |
|----------|-----------|
| Login | Masuk dengan email + password (single-session) |
| Kelola Profil | View & update profil pengguna |

### Use Case ADMIN Only

| Use Case | Deskripsi |
|----------|-----------|
| Kelola Pengguna | CRUD data Admin/Operator |
| Kelola Pangkalan | CRUD pangkalan + auto-create user |
| Kelola Supir | CRUD data driver |
| Lihat Log Aktivitas | Audit trail sistem |
| Kelola Perencanaan | Perencanaan alokasi bulanan |

### Use Case ADMIN + OPERATOR

| Use Case | Deskripsi |
|----------|-----------|
| Kelola Dashboard | Ringkasan KPI |
| Kelola Pesanan | CRUD pesanan + update status |
| Kelola Pembayaran | Catat pembayaran tunai/transfer |
| Kelola Stok | Penerimaan + penyaluran |
| Kelola Laporan | Generate & export laporan |

### Use Case PANGKALAN Only

| Use Case | Deskripsi |
|----------|-----------|
| Kelola Penjualan | Catat penjualan ke konsumen |
| Kelola Konsumen | CRUD data konsumen |
| Buat Order ke Agen | Order stok ke agen |

## 4.3 Access Matrix

| Use Case | Admin | Operator | Pangkalan |
|----------|:-----:|:--------:|:---------:|
| Login | ✅ | ✅ | ✅ |
| Kelola Pengguna | ✅ | ❌ | ❌ |
| Kelola Pangkalan | ✅ | ❌ | ❌ |
| Kelola Pesanan | ✅ | ✅ | ❌ |
| Kelola Stok | ✅ | ✅ | ❌ |
| Kelola Penjualan | ❌ | ❌ | ✅ |
| Kelola Konsumen | ❌ | ❌ | ✅ |

---

# 5. CLASS DIAGRAM & ERD

## 5.1 Overview

File Diagram:
- Class Diagram: `SIM4LON_ClassDiagram.puml`
- ERD: `SIM4LON_ERD.puml`

## 5.2 Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 21 |
| Total Enums | 7 |
| Primary Key Type | UUID |
| Extensions | pgcrypto, uuid-ossp |

## 5.3 Daftar Entitas

### Master Data (5 Tables)

| No | Table | Deskripsi |
|----|-------|-----------|
| 1 | `users` | Akun pengguna sistem |
| 2 | `agen` | Distributor LPG |
| 3 | `pangkalans` | Pangkalan LPG |
| 4 | `drivers` | Supir pengiriman |
| 5 | `lpg_products` | Katalog produk LPG |

### Order Management (6 Tables)

| No | Table | Deskripsi |
|----|-------|-----------|
| 6 | `orders` | Pesanan utama |
| 7 | `order_items` | Item dalam pesanan |
| 8 | `timeline_tracks` | Riwayat status pesanan |
| 9 | `invoices` | Faktur/invoice |
| 10 | `order_payment_details` | Summary pembayaran (1:1) |
| 11 | `payment_records` | Catatan transaksi payment |

### Pangkalan Operations (7 Tables)

| No | Table | Deskripsi |
|----|-------|-----------|
| 12 | `consumers` | Konsumen pangkalan |
| 13 | `consumer_orders` | Penjualan ke konsumen |
| 14 | `lpg_prices` | Harga jual per pangkalan |
| 15 | `pangkalan_stocks` | Stok pangkalan |
| 16 | `pangkalan_stock_movements` | Riwayat stok pangkalan |
| 17 | `expenses` | Pengeluaran operasional |
| 18 | `agen_orders` | Order pangkalan ke agen |

### Stock & Distribution (3 Tables)

| No | Table | Deskripsi |
|----|-------|-----------|
| 19 | `penerimaan_stok` | Penerimaan dari SPBE |
| 20 | `penyaluran_harian` | Penyaluran ke pangkalan |
| 21 | `perencanaan_harian` | Perencanaan alokasi |

### Audit (2 Tables)

| No | Table | Deskripsi |
|----|-------|-----------|
| 22 | `stock_histories` | Riwayat stok agen |
| 23 | `activity_logs` | Log aktivitas sistem |

## 5.4 Enumerasi

| Enum | Values |
|------|--------|
| `user_role` | ADMIN, OPERATOR, PANGKALAN |
| `status_pesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL |
| `lpg_type` | kg3, kg5_5, kg12, kg50 |
| `lpg_category` | SUBSIDI, NON_SUBSIDI |
| `payment_method` | TUNAI, TRANSFER |
| `stock_movement_type` | MASUK, KELUAR |
| `consumer_type` | RUMAH_TANGGA, WARUNG |

## 5.5 Key Relationships

| From | To | Type | Cardinality |
|------|----|------|-------------|
| agen | pangkalans | 1:N | Agen memasok banyak pangkalan |
| pangkalans | orders | 1:N | Pangkalan membuat pesanan |
| orders | order_items | 1:N | Pesanan berisi items |
| orders | order_payment_details | 1:1 | Pesanan punya 1 payment summary |
| pangkalans | consumers | 1:N | Pangkalan punya konsumen |
| consumers | consumer_orders | 1:N | Konsumen membeli LPG |

---

# 6. ACTIVITY DIAGRAMS

## 6.1 Overview

Total: **25 Activity Diagrams**

| Fase | Jumlah | Fokus |
|------|--------|-------|
| Fase 1 | 9 | Core Business Processes |
| Fase 2 | 16 | Supporting Processes |

## 6.2 Daftar Activity Diagrams

### Fase 1: Core Processes

| ID | Nama | File |
|----|------|------|
| AD-01 | Login | `AD_01_Login.puml` |
| AD-02 | Buat Pesanan | `AD_02_BuatPesanan.puml` |
| AD-03 | Update Status Pesanan | `AD_03_UpdateStatusPesanan.puml` |
| AD-04 | Catat Pembayaran | `AD_04_CatatPembayaran.puml` |
| AD-05 | Catat Penerimaan Stok | `AD_05_CatatPenerimaanStok.puml` |
| AD-06 | Catat Penyaluran | `AD_06_CatatPenyaluran.puml` |
| AD-07 | Catat Penjualan | `AD_07_CatatPenjualan.puml` |
| AD-08 | Buat Order ke Agen | `AD_08_BuatOrderKeAgen.puml` |
| AD-09 | Kelola Pangkalan | `AD_09_KelolaPangkalan.puml` |

### Fase 2: Supporting Processes

| ID | Nama | File |
|----|------|------|
| AD-10 | Ubah Password | `AD_10_UbahPassword.puml` |
| AD-11 | Kelola Pengguna | `AD_11_KelolaPengguna.puml` |
| AD-12 | Kelola Supir | `AD_12_KelolaSupir.puml` |
| AD-13 | Kelola Produk LPG | `AD_13_KelolaProdukLPG.puml` |
| AD-14 | Assign Driver | `AD_14_AssignDriver.puml` |
| AD-15 | Lihat Detail Pesanan | `AD_15_LihatDetailPesanan.puml` |
| AD-16 | Generate Invoice | `AD_16_GenerateInvoice.puml` |
| AD-17 | Cetak Nota | `AD_17_CetakNota.puml` |
| AD-18 | Kelola Perencanaan | `AD_18_KelolaPerencanaan.puml` |
| AD-19 | Lihat In/Out Agen | `AD_19_LihatInOutAgen.puml` |
| AD-20 | Kelola Konsumen | `AD_20_KelolaKonsumen.puml` |
| AD-21 | Kelola Stok Pangkalan | `AD_21_KelolaStokPangkalan.puml` |
| AD-22 | Terima Order dari Agen | `AD_22_TerimaOrderDariAgen.puml` |
| AD-23 | Kelola Pengeluaran | `AD_23_KelolaPengeluaran.puml` |
| AD-24 | Generate Laporan | `AD_24_GenerateLaporan.puml` |
| AD-25 | Export Laporan | `AD_25_ExportLaporan.puml` |

## 6.3 Struktur Activity Diagram

Semua Activity Diagram menggunakan 2 swimlanes:
- **User/Admin/Pangkalan**: Aksi yang dilakukan pengguna
- **Sistem**: Response dan proses backend

---

# 7. SEQUENCE DIAGRAMS

## 7.1 Overview

Total: **18 Sequence Diagrams**

| Fase | Jumlah | Fokus |
|------|--------|-------|
| Fase 1 | 8 | Core Processes |
| Fase 2 | 10 | Supporting Processes |

## 7.2 Participant Types

| Stereotype | Simbol | Fungsi |
|------------|--------|--------|
| actor | 🧑 | Pengguna sistem |
| boundary | ▢ | UI/Interface |
| control | ◎ | Business Logic |
| database | ⬡ | Table Database |

## 7.3 Daftar Sequence Diagrams

### Fase 1: Core Processes

| ID | Nama | Tables |
|----|------|--------|
| SD-01 | Login | users, activity_logs |
| SD-03 | Create Order | pangkalans, orders, order_items, timeline_tracks |
| SD-04 | Update Status | orders, order_items, timeline_tracks, pangkalan_stocks |
| SD-07 | Record Payment | order_payment_details, payment_records, orders |
| SD-09 | Receive Stock | penerimaan_stok, stock_histories |
| SD-10 | Record Distribution | pangkalans, penyaluran_harian, stock_histories |
| SD-12 | Record Sale | consumers, pangkalan_stocks, consumer_orders |
| SD-16 | Create Pangkalan | pangkalans, users, activity_logs |

### Fase 2: Supporting Processes

| ID | Nama | Tables |
|----|------|--------|
| SD-02 | Logout | users |
| SD-05 | Assign Driver | drivers, orders, timeline_tracks |
| SD-06 | Get Order Detail | orders, order_items, timeline_tracks, order_payment_details |
| SD-08 | Generate Invoice | invoices, orders, order_items |
| SD-11 | Get Stock Summary | stock_histories, lpg_products |
| SD-13 | Create Order to Agen | agen_orders, pangkalans |
| SD-14 | Confirm Receipt | agen_orders, pangkalan_stocks |
| SD-15 | Dashboard Pangkalan | consumer_orders, pangkalan_stocks, expenses |
| SD-17 | CRUD Generic | (template) |
| SD-18 | Generate & Export Report | orders, payment_records, stock_histories |

---

# 8. STATE MACHINE DIAGRAMS

## 8.1 Overview

Total: **4 State Machine Diagrams**

## 8.2 Daftar State Machines

### SM-01: Order Status (status_pesanan)

| State | Deskripsi |
|-------|-----------|
| DRAFT | Pesanan baru dibuat |
| MENUNGGU_PEMBAYARAN | Menunggu pembayaran |
| DIPROSES | Sedang diproses |
| SIAP_KIRIM | Siap untuk dikirim |
| DIKIRIM | Dalam pengiriman |
| SELESAI | Pesanan selesai → auto-sync stok |
| BATAL | Dibatalkan |

**Transition Flow:**
```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
                              (Cancel dari state manapun) → BATAL
```

### SM-02: Payment Status

| State | Field Values |
|-------|--------------|
| UNPAID | is_paid=false, is_dp=false |
| PARTIAL | is_paid=false, is_dp=true |
| PAID | is_paid=true |

### SM-03: Agen Order Status

| State | Deskripsi |
|-------|-----------|
| PENDING | Menunggu konfirmasi agen |
| DIKIRIM | Agen sudah kirim |
| DITERIMA | Pangkalan sudah terima → update stok |
| DITOLAK | Order ditolak |

### SM-04: User Session

| State | Deskripsi |
|-------|-----------|
| LOGGED_OUT | Belum login |
| LOGGED_IN | Aktif dengan token valid |
| SESSION_EXPIRED | Token expired |
| KICKED_OUT | Login dari device lain (single session) |

---

# 9. DEPLOYMENT ARCHITECTURE

## 9.1 Diagram

File: `SIM4LON_Deployment.puml`

## 9.2 Infrastructure Components

| Component | Provider | Technology |
|-----------|----------|------------|
| **Frontend** | Vercel | React 18, Vite 5, Tailwind CSS |
| **Backend** | Railway | NestJS 10, Prisma 5 |
| **Database** | Railway | PostgreSQL 15 |
| **Storage** | Supabase | S3-compatible |

## 9.3 Communication Protocols

| From | To | Protocol | Port |
|------|----|----------|------|
| Browser | Vercel | HTTPS | 443 |
| Vercel | Railway | HTTPS | 443 |
| Railway | PostgreSQL | TCP | 5432 |
| Railway | Supabase | HTTPS | 443 |

## 9.4 Environment Variables

### Frontend
```env
VITE_API_URL=https://sim4lon-api.up.railway.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-key
PORT=3000
CORS_ORIGIN=https://sim4lon.vercel.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

---

# 10. SECURITY & AUTHENTICATION

## 10.1 Authentication Flow

1. User submit email + password
2. Backend validate credentials
3. Backend generate new `session_id`
4. Backend sign JWT with `session_id`
5. Token returned to frontend
6. Frontend store in localStorage
7. Every request validates token + session_id

## 10.2 Single Session Login

- Setiap login generate `session_id` baru
- JWT berisi `session_id`
- Validation check: token.session_id === users.session_id
- Mismatch = auto logout (kicked out)

## 10.3 Role-Based Access Control

| Role | Access |
|------|--------|
| ADMIN | Full access + master data |
| OPERATOR | Operasional (orders, stock, payment) |
| PANGKALAN | Own data only (multi-tenant) |

## 10.4 Security Measures

| Layer | Measure |
|-------|---------|
| Transport | HTTPS/TLS 1.3 |
| Password | bcrypt (10 rounds) |
| Token | JWT with expiry |
| Database | SSL connection |
| Storage | RLS + signed URLs |
| Secrets | Environment variables |

---

# 11. APPENDIX

## 11.1 File Structure

```
diagrams/
├── Activity Diagrams (25 files)
│   ├── AD_01_Login.puml
│   ├── AD_02_BuatPesanan.puml
│   └── ... (AD_03 - AD_25)
│
├── Sequence Diagrams (18 files)
│   ├── SD_01_Login.puml
│   ├── SD_02_Logout.puml
│   └── ... (SD_03 - SD_18)
│
├── State Machine Diagrams (4 files)
│   ├── SM_01_OrderStatus.puml
│   ├── SM_02_PaymentStatus.puml
│   ├── SM_03_AgenOrderStatus.puml
│   └── SM_04_UserSession.puml
│
├── Other Diagrams
│   ├── SIM4LON_UseCase.puml
│   ├── SIM4LON_ClassDiagram.puml
│   ├── SIM4LON_ERD.puml
│   └── SIM4LON_Deployment.puml
│
└── Documentation (6 files)
    ├── SIM4LON_UseCase_Documentation.md
    ├── SIM4LON_ClassDiagram_Documentation.md
    ├── SIM4LON_ERD_Documentation.md
    ├── SIM4LON_ActivityDiagram_Documentation.md
    ├── SIM4LON_SequenceDiagram_Documentation.md
    ├── SIM4LON_StateMachine_Documentation.md
    └── SIM4LON_Deployment_Documentation.md
```

## 11.2 Total Artifacts

| Category | Count |
|----------|-------|
| PlantUML Diagrams | 51 |
| Documentation Files | 8 |
| PDF Exports | 8+ |
| **TOTAL** | **67+ files** |

## 11.3 Rendering Tools

Diagram dapat di-render menggunakan:
- [PlantUML Online](https://www.plantuml.com/plantuml/uml/)
- VS Code Extension: "PlantUML"
- IntelliJ IDEA PlantUML Plugin
- Visual Paradigm (import PlantUML)

## 11.4 Document History

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | 23 Des 2024 | Initial comprehensive documentation |

---

*Dokumen ini adalah dokumentasi teknis lengkap SIM4LON*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*  
*© 2024 SIM4LON Development Team*
