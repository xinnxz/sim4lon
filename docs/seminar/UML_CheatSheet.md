# 🎯 UML CHEAT SHEET - QUICK REFERENCE
## Untuk Dibawa Saat Seminar

---

## 📊 STATISTIK CEPAT

| Diagram | Jumlah | File Contoh |
|---------|--------|-------------|
| **Use Case** | 18 UC | `SIM4LON_UseCase.puml` |
| **Activity** | 25 AD | `AD_01_Login.puml` |
| **Sequence** | 18 SD | `SD_03_CreateOrder.puml` |
| **State Machine** | 4 SM | `SM_01_StatusPesanan.puml` |
| **Class** | 22 class + 7 enum | `SIM4LON_ClassDiagram.puml` |
| **ERD** | 22 tabel | `SIM4LON_ERD.puml` |
| **Deployment** | 1 | `SIM4LON_Deployment.puml` |

---

## 🧑 AKTOR (3 Role)

| Role | Hak Akses | Contoh User |
|------|-----------|-------------|
| **ADMIN** | Full access + master data | Pemilik Agen |
| **OPERATOR** | Operasional (order, stok) | Staff Gudang |
| **PANGKALAN** | Data milik sendiri | Pemilik Warung |

---

## ⭕ USE CASE - Keywords

| Relasi | Simbol | Arti |
|--------|--------|------|
| **Include** | `..>` | WAJIB dipanggil |
| **Extend** | `..>` | OPSIONAL |
| **Association** | `-->` | Aktor bisa akses |

**Contoh:**
- `Kelola Pesanan` **include** `Update Status` (wajib)
- `Cetak Nota` **extend** `Kelola Pembayaran` (opsional)

---

## 📋 ACTIVITY DIAGRAM - Simbol

| Simbol | Nama | Fungsi |
|--------|------|--------|
| ● | Initial Node | Mulai |
| ⊕ | Final Node | Akhir |
| ▭ | Activity | Langkah/aksi |
| ◇ | Decision | IF-ELSE |
| │ | Swimlane | Pisahkan aktor |

**25 AD Penting:**
- AD-02: Buat Pesanan
- AD-03: Update Status
- AD-17: Voice Order AI

---

## 🔄 SEQUENCE DIAGRAM - Participant

| Stereotype | Simbol | Layer |
|------------|--------|-------|
| `<<actor>>` | 🧑 | User |
| `<<boundary>>` | ▢ | Frontend |
| `<<control>>` | ◎ | Backend |
| `<<database>>` | ⬡ | Database |

**Penomoran:** `1.1.1` = Sub-sub langkah

---

## 🔀 STATE MACHINE - Status Pesanan (7 State)

```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
                            ↘         ↘           ↘        ↘
                             -----------→ BATAL ←-----------
```

| State | Warna | Entry Action |
|-------|-------|--------------|
| DRAFT | Default | Generate ORD-XXXX |
| MENUNGGU_PEMBAYARAN | ⚠️ Warning | Notifikasi pangkalan |
| DIPROSES | 🟢 Active | Verifikasi bayar |
| SIAP_KIRIM | Default | Assign driver |
| DIKIRIM | 🟢 Active | Driver berangkat |
| SELESAI | 🔵 Success | **Auto-sync stok** |
| BATAL | 🔴 Danger | Rollback stok |

---

## 📦 CLASS DIAGRAM - Cardinality

| Notasi | Arti |
|--------|------|
| `1..1` | Tepat satu |
| `0..1` | Opsional |
| `1..*` | Wajib minimal 1 |
| `0..*` | Bisa kosong |

**Relasi Penting:**
```
orders ◆── order_items (1:N, COMPOSITION)
orders ○── order_payment_details (1:1)
pangkalans ──< orders (1:N)
```

---

## 💾 ERD - 22 Tabel

### Master (6):
`users`, `agen`, `pangkalans`, `drivers`, `lpg_products`, `company_profile`

### Order (6):
`orders`, `order_items`, `timeline_tracks`, `invoices`, `order_payment_details`, `payment_records`

### Pangkalan SAAS (7):
`consumers`, `consumer_orders`, `pangkalan_stocks`, `lpg_prices`, `expenses`, `agen_orders`, `pangkalan_stock_movements`

### Stock & Audit (3):
`penerimaan_stok`, `penyaluran_harian`, `perencanaan_harian`, `stock_histories`, `activity_logs`

---

## 🖥️ DEPLOYMENT - Tech Stack

| Layer | Technology | URL |
|-------|------------|-----|
| Frontend | React + Vite | sim4lon.vercel.app |
| Backend | NestJS + Prisma | Railway |
| Database | PostgreSQL | Railway |
| Storage | Supabase S3 | Supabase |

---

## 🎤 JAWABAN CEPAT SAAT DITANYA

### "Berapa Use Case?"
> **17 Use Case** dengan 3 aktor: Admin, Operator, Pangkalan.

### "Jelaskan State Machine!"
> **7 state** dimulai DRAFT → SELESAI. Saat SELESAI, sistem **auto-sync stok** pangkalan.

### "Apa itu Single Session?"
> 1 user = 1 device. Login baru = logout otomatis device lama. Session disimpan di database.

### "Include vs Extend?"
> **Include** = WAJIB (seperti Update Status di Kelola Pesanan)
> **Extend** = OPSIONAL (seperti Cetak Nota setelah Pembayaran)

### "Jelaskan Multi-Tenant!"
> Setiap Pangkalan hanya bisa akses data miliknya sendiri. Data isolasi berdasarkan `pangkalan_id`.

---

## 📝 ENUM PENTING

| Enum | Values |
|------|--------|
| `user_role` | ADMIN, OPERATOR, PANGKALAN |
| `status_pesanan` | DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL |
| `lpg_type` | kg3, kg5_5, kg12, kg50 |
| `payment_method` | TUNAI, TRANSFER |

---

> **Tips:** Print dokumen ini 1 halaman untuk pegangan saat seminar! 📄
