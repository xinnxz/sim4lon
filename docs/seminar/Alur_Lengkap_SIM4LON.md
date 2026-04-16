# 🏗️ ALUR LENGKAP PROJECT SIM4LON
## Pemahaman End-to-End untuk Seminar KP

> **Tujuan:** Memahami 100% bagaimana sistem SI

M4LON bekerja dari awal sampai akhir, dari arsitektur hingga fitur.

---

## 📋 DAFTAR ISI

1. [Overview Sistem](#1-overview-sistem)
2. [Alur Bisnis Distribusi LPG](#2-alur-bisnis-distribusi-lpg)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Alur Data End-to-End](#4-alur-data-end-to-end)
5. [Siklus Hidup Pesanan](#5-siklus-hidup-pesanan)
6. [Multi-Tenant Architecture](#6-multi-tenant-architecture)
7. [Fitur Decision Support System](#7-fitur-decision-support-system)
8. [Integrasi Google Gemini AI](#8-integrasi-google-gemini-ai)
9. [Security & Session Management](#9-security-session-management)
10. [Deployment Flow](#10-deployment-flow)

---

# 1. OVERVIEW SISTEM

## 1.1 Apa itu SIM4LON?

**SIM4LON** (Sistem Informasi Manajemen LPG 4 Jalur Online) adalah sistem berbasis web untuk mengelola distribusi gas LPG dari **SPBE → Agen → Pangkalan → Konsumen**.

```
┌─────────┐       ┌─────────┐       ┌───────────┐       ┌──────────┐
│  SPBE   │ ────▶ │  AGEN   │ ────▶ │ PANGKALAN │ ────▶ │ KONSUMEN │
│ (SPPBE) │       │(PT MSN) │       │  (Warung) │       │  (Rumah) │
└─────────┘       └─────────┘       └───────────┘       └──────────┘
                      ▲                    ▲
                      │                    │
                      └────── SIM4LON ─────┘
                      Mengelola 2 jalur ini
```

## 1.2 Stakeholder & Peran

| Stakeholder | Role di Sistem | Hak Akses |
|-------------|----------------|-----------|
| **PT Mitra Surya Nataraja** | Pemilik Agen | Admin (Full Access) |
| **Staff Agen** | Operasional | Operator (Pesanan, Stok, Laporan) |
| **Pemilik Pangkalan** | Mitra Bisnis | Pangkalan (Data Sendiri) |

## 1.3 Masalah yang Diselesaikan

| No | Masalah Sebelumnya | Solusi SIM4LON |
|----|-------------------|----------------|
| 1 | Pencatatan manual dengan buku | Digital real-time system |
| 2 | Sulit monitoring stok pangkalan | Dashboard DSS dengan 3 warna alert |
| 3 | Laporan lambat | Generate & export otomatis |
| 4 | Duplikasi data konsumen | Centralized database |
| 5 | Kesalahan pencatatan | Validasi otomatis + audit log |

---

# 2. ALUR BISNIS DISTRIBUSI LPG

## 2.1 Alur Fisik (Barang)

```
1. SPBE (Pertamina/Alfamart)
   │
   │ [Penerimaan Stok Agen]
   │ - No. SO (Sales Order)
   │ - No. LO (Loading Order)
   │ - Qty dalam Pcs & Kg
   ▼
2. AGEN (PT Mitra Surya Nataraja)
   │
   │ [Penyaluran ke Pangkalan]
   │ - Pesanan dari Pangkalan
   │ - Driver mengantarkan
   │ - Update status pesanan
   ▼
3. PANGKALAN (Warung Gas)
   │
   │ [Penjualan ke Konsumen]
   │ - Konsumen rumah tangga/warung
   │ - Catat penjualan
   │ - Stok berkurang otomatis
   ▼
4. KONSUMEN
   - Terima gas LPG
```

## 2.2 Alur Digital (Data)

```
┌──────────────────────────────────────────────────────────────┐
│                      ADMIN/OPERATOR                          │
│  1. Catat Penerimaan Stok dari SPBE                         │
│     → Stock Histories (MASUK)                                │
│                                                              │
│  2. Terima Pesanan dari Pangkalan                           │
│     → Orders (Status: DRAFT)                                 │
│                                                              │
│  3. Tunggu Pembayaran                                       │
│     → Orders (Status: MENUNGGU_PEMBAYARAN)                   │
│                                                              │
│  4. Konfirmasi Pembayaran                                   │
│     → Order_Payment_Details (is_paid = true)                 │
│     → Orders (Status: DIPROSES)                              │
│                                                              │
│  5. Siapkan Barang & Assign Driver                          │
│     → Orders (Status: SIAP_KIRIM)                            │
│     → Drivers (Assign)                                       │
│                                                              │
│  6. Driver Kirim                                            │
│     → Orders (Status: DIKIRIM)                               │
│                                                              │
│  7. Pangkalan Konfirmasi Terima                             │
│     → Orders (Status: SELESAI)                               │
│     → Pangkalan_Stocks (QTY + otomatis!)                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        PANGKALAN                             │
│  1. Order Stok ke Agen                                      │
│     → Agen_Orders (Status: PENDING)                          │
│                                                              │
│  2. Catat Penjualan ke Konsumen                             │
│     → Consumer_Orders                                        │
│     → Pangkalan_Stocks (QTY - otomatis!)                     │
│                                                              │
│  3. Kelola Data Konsumen                                    │
│     → Consumers (CRUD)                                       │
│                                                              │
│  4. Lihat Dashboard & Laporan                               │
│     → Dashboard Pangkalan (Statistik)                        │
└──────────────────────────────────────────────────────────────┘
```

---

# 3. ARSITEKTUR SISTEM

## 3.1 Arsitektur 3-Tier

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Astro 5 + React 18 + TypeScript              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ Halaman  │ │Components│ │  Hooks   │            │   │
│  │  │ (Routes) │ │  (Reuse) │ │(Logic)   │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │                                                      │   │
│  │  State Management: Zustand                          │   │
│  │  HTTP Client: Axios                                 │   │
│  │  UI: Tailwind CSS + Shadcn/ui + Lucide Icons        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                     HTTPS:443 (REST API)                    │
│                           ▼                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC TIER                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             NestJS 11 + TypeScript                   │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ Module   │ │ Service  │ │   DTO    │            │   │
│  │  │(Auth,    │ │(Business │ │(Validation│            │   │
│  │  │ Order,   │ │ Logic)   │ │ Schema)  │            │   │
│  │  │ Stock)   │ │          │ │          │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │                                                      │   │
│  │  Authentication: JWT + Passport                     │   │
│  │  Authorization: Role-Based (Guards)                 │   │
│  │  Validation: class-validator + class-transformer    │   │
│  │  AI Integration: Google Gemini 2.0 Flash            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                      TCP:5432 (SQL)                         │
│                           ▼                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     DATA ACCESS TIER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                PostgreSQL 15 (Railway)               │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ 23 Tables│ │ 7 Enums  │ │  26 FK   │            │   │
│  │  │ UUID PK  │ │(Status,  │ │Relations │            │   │
│  │  │Timestamp │ │ Role)    │ │          │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │                                                      │   │
│  │  ORM: Prisma 6                                      │   │
│  │  Features: Soft Delete, Audit Trail                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 Modul Backend (NestJS)

| Modul | Fungsi | Endpoint Utama |
|-------|--------|----------------|
| `auth` | Login, Logout, JWT | `/auth/login`, `/auth/profile` |
| `users` | Kelola pengguna | `/users` (CRUD) |
| `pangkalans` | Kelola pangkalan + auto user | `/pangkalans` (CRUD) |
| `orders` | Kelola pesanan + status | `/orders`, `/orders/:id/status` |
| `order-items` | Item dalam pesanan | `/order-items` |
| `order-payment` | Pembayaran | `/order-payment` |
| `stocks` | Penerimaan & penyaluran | `/stocks/penerimaan`, `/stocks/penyaluran` |
| `drivers` | Kelola driver | `/drivers` (CRUD) |
| `products` | Produk LPG | `/lpg-products` (CRUD) |
| `consumers` | Konsumen pangkalan | `/consumers` (tenant-based) |
| `consumer-orders` | Penjualan pangkalan | `/consumer-orders` (tenant-based) |
| `pangkalan-stocks` | Stok pangkalan | `/pangkalan-stocks/:pangkalanId` |
| `reports` | Generate laporan | `/reports/orders`, `/reports/export` |
| `activity-logs` | Audit trail | `/activity-logs` |
| `voice-order` | Google Gemini AI | `/voice-order/process` |

---

# 4. ALUR DATA END-TO-END

## 4.1 Skenario: Admin Membuat Pesanan untuk Pangkalan

### Step 1: Login (SD-01)

```
User → Frontend → Backend → Database
│       │           │          │
│──(1)──▶ POST /auth/login    │
│       │           │          │
│       │──(2)──────▶ Validasi email+password
│       │           │          │
│       │           │──(3)────▶ SELECT * FROM users WHERE email = ?
│       │           │◀─(4)───── User data
│       │           │          │
│       │           │──(5)──── Generate JWT token + session_id
│       │           │          │
│       │           │──(6)────▶ UPDATE users SET session_id = ?
│       │           │          │
│       │◀─(7)──────┘ Return { access_token, user }
│◀──(8)─┘           │          │
 Store token di localStorage
```

### Step 2: Buka Form Pesanan (SD-03)

```
Admin → OrderPage → OrderService → Database
│        │            │             │
│──(1)──▶ Buka /orders/create      │
│        │            │             │
│        │──(2)───────▶ GET /pangkalans (active)
│        │            │             │
│        │            │──(3)───────▶ SELECT * FROM pangkalans WHERE is_active = true
│        │            │◀──(4)────── pangkalans[]
│        │◀─(5)───────┘             │
│◀─(6)──┘ Tampil form + dropdown
```

### Step 3: Submit Pesanan

```
Admin → OrderPage → OrderService → Orders DB → Order_Items DB → Timeline DB
│        │            │             │            │                │
│──(1)──▶ Input data  │             │            │                │
│        │ - Pangkalan: PG-001     │            │                │
│        │ - LPG 3kg: 100 tabung   │            │                │
│        │ - LPG 12kg: 50 tabung   │            │                │
│        │            │             │            │                │
│────(2)─▶ Klik Simpan│             │            │                │
│        │            │             │            │                │
│        │────(3)─────▶ POST /orders/create     │                │
│        │            │ { pangkalanId, items[] }│                │
│        │            │             │            │                │
│        │            │──(4)─ Validasi input   │                │
│        │            │             │            │                │
│        │            │──(5)─ Generate kode ORD-XXXX             │
│        │            │             │            │                │
│        │            │──(6)───────▶ INSERT INTO orders          │
│        │            │             │ code: ORD-0100             │
│        │            │             │ status: DRAFT              │
│        │            │             │ pangkalan_id: ...          │
│        │            │◀──(7)────── order_id                    │
│        │            │             │            │                │
│        │            │──(8)────────────────────▶ INSERT INTO order_items
│        │            │             │            │ (2 rows: LPG 3kg, 12kg)
│        │            │             │            │                │
│        │            │──(9)───────────────────────────────────▶ INSERT INTO timeline_tracks
│        │            │             │            │                │ "Pesanan Dibuat"
│        │            │             │            │                │
│        │◀──(10)─────┘ Return OrderModel       │                │
│◀─(11)──┘ Redirect ke /orders/ORD-0100         │                │
```

### Step 4: Update Status ke MENUNGGU_PEMBAYARAN

```
Admin → OrderPage → OrderService → Orders DB → Timeline DB
│        │            │             │            │
│──(1)──▶ Klik "Submit Pesanan"   │            │
│        │            │             │            │
│        │────(2)─────▶ PATCH /orders/:id/status│
│        │            │ { status: MENUNGGU_PEMBAYARAN }
│        │            │             │            │
│        │            │──(3)───────▶ UPDATE orders│
│        │            │             │ status = MENUNGGU_PEMBAYARAN
│        │            │             │            │
│        │            │──(4)───────────────────▶ INSERT timeline
│        │            │             │            │ "Menunggu Pembayaran"
│        │            │             │            │
│        │            │──(5)─ Notifikasi ke Pangkalan (email/WA)
│        │            │             │            │
│        │◀──(6)──────┘ Success     │            │
```

### Step 5: Catat Pembayaran

```
Admin → PaymentPage → PaymentService → Order_Payment DB → Orders DB
│        │              │               │                  │
│──(1)──▶ Input data pembayaran        │                  │
│        │ - Method: TRANSFER           │                  │
│        │ - Amount: Rp 10,500,000      │                  │
│        │ - Upload bukti transfer      │                  │
│        │              │               │                  │
│────(2)─▶ Klik Simpan │               │                  │
│        │              │               │                  │
│        │────(3)───────▶ POST /order-payment/create      │
│        │              │               │                  │
│        │              │──(4)─ Upload file ke Supabase Storage
│        │              │              proof_url          │
│        │              │               │                  │
│        │              │──(5)─────────▶ INSERT INTO order_payment_details
│        │              │               │ is_paid = true │
│        │              │               │                  │
│        │              │──(6)─────────────────────────▶ UPDATE orders
│        │              │               │                  │ status = DIPROSES
│        │              │               │                  │
│        │◀──(7)────────┘ Success       │                  │
```

### Step 6-7: Siap Kirim & Dikirim

```
Operator → OrderPage → OrderService → Orders DB → Drivers DB → Timeline DB
│           │            │             │            │             │
│──(1)─────▶ Assign Driver: Driver Ahmad         │             │
│           │            │             │            │             │
│           │──(2)───────▶ PATCH /orders/:id/driver             │
│           │            │             │            │             │
│           │            │──(3)───────▶ UPDATE     │             │
│           │            │             │ driver_id = xxx        │
│           │            │             │ status = SIAP_KIRIM    │
│           │            │             │            │             │
│           │            │──(4)───────────────────▶ INSERT "Driver Ditugaskan"
│           │            │             │            │             │
│───────(5)─▶ Klik "Mulai Pengiriman" │            │             │
│           │            │             │            │             │
│           │──(6)───────▶ PATCH status = DIKIRIM  │             │
│           │            │             │            │             │
│           │            │──(7)───────▶ UPDATE status = DIKIRIM  │
│           │            │             │            │             │
│           │            │──(8)───────────────────▶ INSERT "Barang Dikirim"
```

### Step 8: Konfirmasi Terima (AUTO-SYNC STOK!)

```
Operator → OrderPage → OrderService → Orders → Order_Items → Pangkalan_Stocks
│           │            │             │         │             │
│──(1)─────▶ Klik "Konfirmasi Terima" │         │             │
│           │            │             │         │             │
│           │──(2)───────▶ PATCH status = SELESAI│             │
│           │            │             │         │             │
│           │            │──(3)───────▶ UPDATE   │             │
│           │            │             │ status = SELESAI     │
│           │            │             │         │             │
│           │            │──(4)────────────────▶ SELECT items  │
│           │            │             │         │             │
│           │            │──(5)──────────────────────────────▶ AUTOMATIC!
│           │            │             │         │             │ Loop items:
│           │            │             │         │             │ UPSERT pangkalan_stocks
│           │            │             │         │             │ SET qty = qty + item.qty
│           │            │             │         │             │
│           │            │──(6)─ Auto-sync DONE! ✅            │
│           │◀──(7)──────┘             │         │             │
 Stok Pangkalan PG-001 otomatis bertambah!
 - LPG 3kg: +100
 - LPG 12kg: +50
```

**💡 INI YANG PALING PENTING DI STATE MACHINE!**

Saat status = `SELESAI`, sistem **OTOMATIS** update stok pangkalan. Tidak perlu input manual!

---

# 5. SIKLUS HIDUP PESANAN

## 5.1 State Machine Lengkap

```
┌─────────────────────────────────────────────────────────────────┐
│                   LIFECYCLE ORDER (7 STATES)                    │
└─────────────────────────────────────────────────────────────────┘

[1] DRAFT
    ├─ Entry: Generate ORD-XXXX, Hitung subtotal+PPN, Buat timeline
    ├─ Actor: Admin/Operator
    └─ Trigger: "Submit Pesanan"
        │
        ▼
[2] MENUNGGU_PEMBAYARAN ⚠️
    ├─ Entry: Kirim notifikasi ke Pangkalan
    ├─ Do: Menunggu pembayaran
    ├─ Actor: Pangkalan (bayar), Admin (catat)
    └─ Guard: [is_paid = true]
        │
        ▼
[3] DIPROSES 🟢
    ├─ Entry: Verifikasi pembayaran
    ├─ Do: Siapkan barang dari gudang
    ├─ Actor: Operator
    └─ Trigger: "Barang Siap"
        │
        ▼
[4] SIAP_KIRIM
    ├─ Entry: Assign driver (opsional)
    ├─ Actor: Operator
    └─ Guard: [driver_id != null] (jika pakai driver)
        │
        ▼
[5] DIKIRIM 🟢
    ├─ Entry: Driver berangkat
    ├─ Do: Dalam perjalanan
    ├─ Actor: Driver
    └─ Trigger: "Barang Diterima + Konfirmasi"
        │
        ▼
[6] SELESAI 🔵
    ├─ Entry: ⭐ AUTO-SYNC STOK PANGKALAN ⭐
    ├─ Entry: UPDATE pangkalan_stocks
    ├─ Exit: Generate invoice (opsional)
    └─ Final State (Success)

──────────────────────────────────────────────────────────────────
PEMBATALAN (dari state manapun kecuali SELESAI):

[7] BATAL 🔴
    ├─ Entry: Log alasan pembatalan
    ├─ Entry: Rollback stok (jika sudah keluar gudang)
    ├─ Trigger: Timeout, Cancel manual, Gagal kirim
    └─ Final State (Failure)
```

## 5.2 Tabel Transisi

| Dari State | Ke State | Trigger | Guard | Action |
|------------|----------|---------|-------|--------|
| DRAFT | MENUNGGU_PEMBAYARAN | Submit pesanan | - | Notifikasi pangkalan |
| MENUNGGU_PEMBAYARAN | DIPROSES | Pembayaran lunas | `is_paid = true` | Verifikasi bayar |
| DIPROSES | SIAP_KIRIM | Barang siap | - | - |
| SIAP_KIRIM | DIKIRIM | Driver berangkat | `driver_id != null` | Log waktu berangkat |
| DIKIRIM | SELESAI | Barang diterima | Konfirmasi pangkalan | **AUTO-SYNC STOK** |
| * (any) | BATAL | Cancel/Timeout | Except SELESAI | Rollback stok |

---

# 6. MULTI-TENANT ARCHITECTURE

## 6.1 Apa itu Multi-Tenant?

**Multi-tenant** = Satu aplikasi, banyak "penyewa" (tenant), data terisolasi per tenant.

Di SIM4LON:
- **Tenant** = Pangkalan
- **Isolasi** = Setiap pangkalan hanya bisa akses data miliknya sendiri

## 6.2 Implementasi

### Database Schema:

```sql
-- Tabel TENANT (Pangkalan)
TABLE pangkalans {
  id UUID PRIMARY KEY,
  code VARCHAR, -- PG-001
  name VARCHAR,
  -- ...
}

-- Tabel yang DI-TENANT-KAN
TABLE consumers {
  id UUID PRIMARY KEY,
  pangkalan_id UUID, -- ← TENANT IDENTIFIER
  name VARCHAR,
  -- ...
  FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id)
}

TABLE consumer_orders {
  id UUID PRIMARY KEY,
  pangkalan_id UUID, -- ← TENANT IDENTIFIER
  consumer_id UUID,
  -- ...
  FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id)
}

TABLE pangkalan_stocks {
  id UUID PRIMARY KEY,
  pangkalan_id UUID, -- ← TENANT IDENTIFIER
  lpg_type ENUM,
  qty INT,
  -- ...
}
```

### Backend Guard:

```typescript
// tenant.guard.ts
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Dari JWT

    // Jika role PANGKALAN, set tenant filter
    if (user.role === 'PANGKALAN') {
      request.tenantId = user.pangkalanId; // ← Hanya akses data sendiri
    }

    return true;
  }
}

// consumers.service.ts
async findAll(tenantId?: string) {
  return this.prisma.consumer.findMany({
    where: {
      pangkalanId: tenantId, // ← Filter by tenant!
    },
  });
}
```

### Alur:

```
Pangkalan Login → JWT berisi { userId, pangkalanId, role: PANGKALAN }
                                              │
                                              ▼
                                      TenantGuard extract pangkalanId
                                              │
                                              ▼
                                    Service filter WHERE pangkalan_id = ?
                                              │
                                              ▼
                              Hanya return data milik pangkalan tersebut
```

---

# 7. FITUR DECISION SUPPORT SYSTEM

## 7.1 Konsep DSS

**DSS** (Decision Support System) = Sistem yang membantu pengambilan keputusan dengan memberikan informasi/alert.

Di SIM4LON: **Monitoring Stok Pangkalan dengan 3 Warna Alert**

## 7.2 Implementasi

### Database:

```sql
TABLE pangkalan_stocks {
  id UUID PRIMARY KEY,
  pangkalan_id UUID,
  lpg_type ENUM('kg3', 'kg5_5', 'kg12', 'kg50'),
  qty INT,
  warning_level INT, -- Kuning
  critical_level INT, -- Merah
  -- ...
}
```

### Business Logic:

```typescript
// pangkalan-stocks.service.ts
getStockStatus(stock: PangkalanStock): 'AMAN' | 'RENDAH' | 'KRITIS' {
  if (stock.qty <= stock.critical_level) {
    return 'KRITIS'; // 🔴 Merah
  } else if (stock.qty <= stock.warning_level) {
    return 'RENDAH'; // 🟡 Kuning
  } else {
    return 'AMAN'; // 🟢 Hijau
  }
}
```

### Frontend (Dashboard):

```tsx
// Dashboard.tsx
const StockCard = ({ stock }) => {
  const status = getStockStatus(stock);
  
  const colorClass = {
    AMAN: 'bg-green-100 border-green-500',
    RENDAH: 'bg-yellow-100 border-yellow-500',
    KRITIS: 'bg-red-100 border-red-500',
  }[status];
  
  const icon = {
    AMAN: '✅',
    RENDAH: '⚠️',
    KRITIS: '🚨',
  }[status];
  
  return (
    <div className={`p-4 border-2 ${colorClass}`}>
      {icon} {stock.lpgType}: {stock.qty} tabung
      <p>{status}</p>
    </div>
  );
}
```

### Hasil Visual:

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ ✅ LPG 3 kg        │  │ ⚠️ LPG 12 kg        │  │ 🚨 LPG 50 kg        │
│ 250 tabung         │  │ 45 tabung          │  │ 5 tabung           │
│ AMAN               │  │ RENDAH             │  │ KRITIS             │
│ (Hijau)            │  │ (Kuning)           │  │ (Merah)            │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

### Manfaat:

1. **Agen** bisa langsung lihat pangkalan mana yang perlu diprioritaskan
2. **Pangkalan** bisa tahu kapan harus order ulang
3. **Mencegah** kehabisan stok

---

# 8. INTEGRASI GOOGLE GEMINI AI

## 8.1 Fitur Voice Order

**Voice Order** = Admin bisa membuat pesanan dengan suara (speech-to-text + AI parsing).

## 8.2 Alur Voice Order

```
Admin → Click Record → Browser API → Backend → Gemini AI → Parse → Database
│         │             │            │          │           │        │
│──(1)────▶ Rekam suara "Buat pesanan untuk Pangkalan Budi, LPG 3 kg 100 tabung"
│         │                          │
│         │──(2)─────────────────────▶ Browser Speech-to-Text API
│         │                          │ (Web Speech API)
│         │◀─(3)──── Text: "Buat pesanan untuk Pangkalan Budi, LPG 3 kg 100 tabung"
│         │                          │
│────(4)──┴──────────────────────────▶ POST /voice-order/process
│                                    │ { transcript: "..." }
│                                    │
│                                    │──(5)──────▶ Google Gemini API
│                                    │            │
│                                    │            │ Prompt:
│                                    │            │ "Extract order details from:
│                                    │            │  {transcript}
│                                    │            │  Return JSON:
│                                    │            │  { pangkalanName, items[] }"
│                                    │            │
│                                    │◀──(6)─────┘ JSON Response:
│                                    │            │ {
│                                    │            │   pangkalanName: "Budi",
│                                    │            │   items: [
│                                    │            │     { type: "kg3", qty: 100 }
│                                    │            │   ]
│                                    │            │ }
│                                    │
│                                    │──(7)────▶ Find pangkalan by name "Budi"
│                                    │          │ SELECT * FROM pangkalans WHERE name LIKE '%Budi%'
│                                    │          │
│                                    │──(8)────▶ CREATE order
│                                    │          │ INSERT INTO orders ...
│                                    │          │
│◀──────────(9)───────────────────────┘ Return: OrderModel
 Redirect ke halaman order detail
```

## 8.3 Kode Backend

```typescript
// voice-order.service.ts
@Injectable()
export class VoiceOrderService {
  constructor(
    private geminiService: GeminiService,
    private orderService: OrderService,
    private pangkalanService: PangkalanService,
  ) {}

  async processVoiceOrder(transcript: string) {
    // 1. Parse dengan Gemini AI
    const prompt = `
      Extract order information from the following transcript:
      "${transcript}"
      
      Return a JSON object with:
      - pangkalanName: string
      - items: Array<{ type: 'kg3' | 'kg5_5' | 'kg12' | 'kg50', qty: number }>
    `;
    
    const aiResponse = await this.geminiService.generate(prompt);
    const parsed = JSON.parse(aiResponse);
    
    // 2. Find pangkalan
    const pangkalan = await this.pangkalanService.findByName(
      parsed.pangkalanName
    );
    
    if (!pangkalan) {
      throw new NotFoundException('Pangkalan tidak ditemukan');
    }
    
    // 3. Create order
    const order = await this.orderService.create({
      pangkalanId: pangkalan.id,
      items: parsed.items.map(item => ({
        lpgType: item.type,
        qty: item.qty,
        pricePerUnit: this.getPriceByType(item.type),
      })),
    });
    
    return order;
  }
}
```

---

# 9. SECURITY & SESSION MANAGEMENT

## 9.1 Single Session Login

**Single Session** = 1 user hanya bisa login di 1 device. Login di device baru = device lama auto logout.

### Implementasi:

```typescript
// auth.service.ts
async login(email: string, password: string) {
  // 1. Validate credentials
  const user = await this.validateUser(email, password);
  
  // 2. Generate NEW session_id
  const sessionId = uuidv4(); // ← Setiap login = session_id baru!
  
  // 3. Update session_id di database
  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      sessionId, // ← Session lama otomatis invalid!
    },
  });
  
  // 4. Generate JWT token dengan session_id
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    sessionId, // ← Ini yang dicek setiap request
  };
  
  const token = this.jwtService.sign(payload);
  
  return {
    access_token: token,
    user,
  };
}
```

```typescript
// jwt.strategy.ts (Guard)
async validate(payload: JwtPayload) {
  // 1. Extract user dari database
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub },
  });
  
  if (!user) {
    throw new UnauthorizedException();
  }
  
  // 2. CEK SESSION_ID COCOK!
  if (user.sessionId !== payload.sessionId) {
    throw new UnauthorizedException('Session expired. Logged in from another device.');
  }
  
  return user;
}
```

### Alur:

```
User A login di Laptop → session_id = "abc123"
                          Token = JWT { sessionId: "abc123" }
                          Di Database: user.sessionId = "abc123"

── 30 menit kemudian ──

User A login di HP     → session_id = "xyz789" (BARU!)
                          Token = JWT { sessionId: "xyz789" }
                          Di Database: user.sessionId = "xyz789" (UPDATE!)

── User A buka Laptop lagi ──

Request dengan token lama → JWT { sessionId: "abc123" }
                             │
                             ▼
                       Compare dengan DB: "xyz789"
                             │
                             ▼
                    🚫 TIDAK COCOK! → UnauthorizedException
                             │
                             ▼
                      Auto logout Laptop
```

## 9.2 Security Layers

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Transport** | HTTPS | Enkripsi data |
| **Authentication** | JWT | Token-based auth |
| **Password** | bcrypt (salt rounds 10) | Hashing password |
| **Authorization** | Role Guards | RBAC (Admin, Operator, Pangkalan) |
| **Session** | session_id in DB | Single session |
| **File Upload** | Supabase Storage | Secure file hosting |
| **Secrets** | Environment Variables | Hide API keys |

---

# 10. DEPLOYMENT FLOW

## 10.1 CI/CD Pipeline

```
Developer → Git Push → GitHub → Auto Deploy
    │          │         │          │
    │          │         │          ▼
    │          │         │    ┌──────────────┐
    │          │         │    │   VERCEL     │ (Frontend)
    │          │         │    │  Auto Build  │
    │          │         │    │  Auto Deploy │
    │          │         │    └──────────────┘
    │          │         │          │
    │          │         │          ▼
    │          │         │    ┌──────────────┐
    │          │         └───▶│   RAILWAY    │ (Backend)
    │          │              │  Auto Build  │
    │          │              │  Auto Deploy │
    │          │              └──────────────┘
    │          │                     │
    │          │                     ▼
    │          │              ┌──────────────┐
    │          │              │ PostgreSQL   │ (Database)
    │          │              │   Railway    │
    │          │              └──────────────┘
    │          │
    │          └─ Trigger: Push ke branch `main`
    │
    └─ Lokal Development: npm run dev
```

## 10.2 Environment Variables

### Frontend (.env):
```bash
VITE_API_URL=https://sim4lon-production.up.railway.app
```

### Backend (.env):
```bash
DATABASE_URL=postgresql://user:pass@host:5432/sim4lon
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-supabase-key
```

---

## 📊 RINGKASAN STATISTIK

| Kategori | Detail |
|----------|--------|
| **Use Case** | 17 use cases, 3 aktor |
| **Activity Diagram** | 29 diagrams |
| **Sequence Diagram** | 20 diagrams |
| **State Machine** | 3 diagrams (Status Pesanan, Order Agen, Session) |
| **Class Diagram** | 23 classes, 7 enums |
| **ERD** | 23 tabel, 26 relasi |
| **Total Diagrams** | 52 UML diagrams |
| **UI Mockups** | 74 wireframes |
| **Backend Modules** | 15 modules (NestJS) |
| **Frontend Pages** | 43 pages (Admin) + 9 pages (Pangkalan) |

---

> **Selamat! Anda sudah memahami 100% alur SIM4LON!** 🎯
> 
> Next: Latihan jelaskan alur ini dengan kata-kata sendiri untuk seminar.

*Dokumen ini untuk persiapan Seminar KP SIM4LON*
*© 2026 Luthfi Alfaridz - Teknik Informatika UNSUR*
