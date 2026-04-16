# 📊 OUTLINE PRESENTASI SEMINAR KP SIM4LON
## Sistem Informasi Manajemen LPG 4 Jalur Online

> **Target Durasi:** 35-40 menit (Presentasi 25 menit + Demo 10 menit + Q&A 5 menit)  
> **Fokus:** **HEAVY UML DIAGRAMS** (Semua diagram ditampilkan)

---

## 🎯 STRUKTUR PRESENTASI

### **PEMBUKAAN (2 menit)**

#### Slide 1: Cover
- Judul: **SISTEM INFORMASI MANAJEMEN LPG 4 JALUR ONLINE (SIM4LON)**
- Nama: Luthfi Alfaridz
- NIM: [NIM Anda]
- Program Studi: Teknik Informatika
- Tempat KP: PT Mitra Surya Nataraja
- Pembimbing: Dosen Pembimbing + Pembimbing Lapangan

#### Slide 2: Daftar Isi
- BAB I: Pendahuluan
- BAB III: Pelaksanaan Kerja Praktek (**Focus: UML**)
- BAB IV: Hasil dan Pembahasan
- Demo Sistem

---

## 📖 BAB I: PENDAHULUAN (5 menit)

### Slide 3: Latar Belakang Perusahaan
**Konten:**
- PT Mitra Surya Nataraja adalah **Agen Distributor LPG** di Tasikmalaya
- Melayani **distribusi LPG** dari SPBE ke Pangkalan (Sub-agen)
- Alur distribusi: **SPBE → Agen → Pangkalan → Konsumen**

**Visual:** Diagram alur distribusi fisik dengan 4 blok

### Slide 4: Permasalahan yang Dihadapi
**Konten (Bullet Points):**
1. ❌ **Pencatatan manual** menggunakan buku dan excel
2. ❌ **Sulit monitoring** stok pangkalan secara real-time
3. ❌ **Rawan kehilangan data** dan kesalahan pencatatan
4. ❌ **Laporan lambat** karena rekap manual
5. ❌ **Tidak ada sistem peringatan** untuk stok kritis

**Visual:** Icon/ilustrasi untuk setiap masalah

### Slide 5: Tujuan & Manfaat
**Konten (2 Kolom):**

**Tujuan:**
1. Menganalisis kebutuhan sistem distribusi LPG
2. **Merancang sistem dengan UML lengkap**
3. Membangun aplikasi web full-stack
4. Testing & Deployment

**Manfaat:**
- ✅ Otomasi pencatatan pesanan
- ✅ Monitoring stok real-time (DSS)
- ✅ Laporan otomatis
- ✅ Multi-tenant untuk pangkalan

---

## 🛠️ BAB III: PELAKSANAAN KP - **PERANCANGAN UML** (18 menit)

### Slide 6: Metodologi & Timeline
**Konten (2 Kolom):**

**Metodologi: Waterfall**
- Requirements → Design → Implementation → Testing → Deployment

**Timeline:**
- Analisis: 2 minggu
- **Desain UML**: 2 minggu (52 diagram!)
- Implementation: 6 minggu
- Testing: 1 minggu

### Slide 7: Overview Diagram UML
**Konten (Tabel):**
| Jenis Diagram | Jumlah | Keterangan |
|---------------|--------|------------|
| **Use Case** | 1 (17 UC) | Kebutuhan fungsional |
| **Activity** | 29 | Alur proses bisnis |
| **Sequence** | 20 | Interaksi objek |
| **State Machine** | 3 | Lifecycle objek |
| **Class** | 1 (23 classes) | Struktur sistem |
| **ERD** | 1 (23 tabel) | Struktur database |
| **Deployment** | 1 | Arsitektur fisik |
| **TOTAL** | **52 diagram** | ✅ |

---

### 🔷 **BAGIAN UML DIAGRAMS (Slide 8-25)**

### Slide 8: Use Case Diagram
**Konten:**
- **17 Use Case** dengan **3 Aktor**

**Aktor:**
1. **Admin** (12 UC) - Full access (kelola master data, users, pangkalan)
2. **Operator** (8 UC) - Operasional (pesanan, stok, pembayaran)
3. **Pangkalan** (5 UC) - Tenant (data sendiri, order ke agen)

**Visual:** Use Case Diagram lengkap

**Relasi:**
- `<<include>>`: Update Status → Kelola Pesanan (wajib)
- `<<extend>>`: Cetak Nota → Kelola Pembayaran (opsional)
- `<<extend>>`: Assign Driver → Update Status (opsional)

---

### Slide 9: Class Diagram - Overview
**Konten:**
**23 Classes + 9 Enumerations**

**Package (6 grup):**
1. **Master Data** (6 classes): users, agen, pangkalans, drivers, lpg_products, company_profile
2. **Order Management** (4): orders, order_items, timeline_tracks, invoices
3. **Payment** (2): order_payment_details, payment_records
4. **Stock Agen** (4): stock_histories, penerimaan_stok, perencanaan_harian, penyaluran_harian
5. **Pangkalan SaaS** (7): consumers, consumer_orders, pangkalan_stocks, lpg_prices, expenses, agen_orders, pangkalan_stock_movements
6. **Audit** (1): activity_logs

**Visual:** Class Diagram simplified (fokus relasi utama)

### Slide 10: Class Diagram - Enumerations
**Konten (9 Enums):**
| Enum | Values | Penggunaan |
|------|--------|------------|
| `user_role` | ADMIN, OPERATOR, PANGKALAN | Hak akses pengguna |
| `status_pesanan` | DRAFT → SELESAI (7 states) | Status order lifecycle |
| `lpg_type` | kg3, kg5, kg12, kg50, gr220 | Jenis LPG |
| `lpg_category` | SUBSIDI, NON_SUBSIDI | Kategori harga & PPN |
| `payment_method` | TUNAI, TRANSFER | Metode bayar |
| `stock_movement_type` | MASUK, KELUAR | Pergerakan stok |
| `consumer_type` | RUMAH_TANGGA, WARUNG | Tipe konsumen |
| `consumer_payment_status` | LUNAS, BELUM_LUNAS | Status bayar konsumen |
| `agen_order_status` | PENDING, DIKIRIM, DITERIMA, BATAL | Status order pangkalan |

---

### Slide 11: ERD (Entity Relationship Diagram)
**Konten:**
- **23 Tabel** dengan **26 Relasi**
- **Primary Key:** UUID (pgcrypto extension)
- **Database:** PostgreSQL 15

**Kategori Tabel (4 grup):**
1. **Master Data** (6): users, agen, pangkalans, drivers, lpg_products, company_profile
2. **Order Management** (6): orders, order_items, timeline_tracks, invoices, order_payment_details, payment_records
3. **Pangkalan Operations** (8): consumers, consumer_orders, lpg_prices, pangkalan_stocks, pangkalan_stock_movements, expenses, agen_orders
4. **Stock & Audit** (3): penerimaan_stok, penyaluran_harian, perencanaan_harian, stock_histories, activity_logs

**Visual:** ERD simplified (fokus FK relationships)

**Relasi Kunci:**
- `agen (1) ←→ (0..*) pangkalans`
- `orders (1) ←→ (1..*) order_items` (COMPOSITION)
- `pangkalans (1) ←→ (0..*) consumers` (MULTI-TENANT)

---

### Slide 12: State Machine - Status Pesanan ⭐
**Konten:**
**7 States Order Lifecycle:**
```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
           ↓                      ↓           ↓          ↓
           └──────────────────────→ BATAL ←────────────┘
```

**Entry/Do/Exit Actions:**
| State | Entry Action | Do Action | Exit Action |
|-------|--------------|-----------|-------------|
| DRAFT | Generate ORD-XXXX, Hitung total | - | - |
| MENUNGGU_PEMBAYARAN | Notifikasi pangkalan | Tunggu pembayaran | - |
| DIPROSES | Verifikasi bayar | Siapkan barang | - |
| SIAP_KIRIM | Assign driver (opt) | Tunggu jadwal kirim | - |
| DIKIRIM | Driver berangkat | Dalam perjalanan | - |
| **SELESAI** | **AUTO-SYNC STOK** ✨ | - | Generate invoice (opt) |
| BATAL | Log alasan, Rollback stok | - | - |

**Visual:** State Machine diagram dengan warna

### Slide 13: State Machine - Order ke Agen
**Konten:**
**4 States (Pangkalan Order ke Agen):**
```
PENDING → DIKIRIM → DITERIMA / DITOLAK
```

**Entry Actions:**
- **PENDING**: `order_date = now`, `qty_ordered = X`
- **DIKIRIM**: Agen konfirmasi kirim
- **DITERIMA**: `qty_received = Y`, **Update pangkalan_stocks**, Create stock_movement
- **DITOLAK**: Log alasan tolak

**Visual:** State Machine diagram

---

### Slide 14-17: Activity Diagram (4 Core Processes)

**Slide 14: AD-01 - Login**
**Swimlane:** User | Sistem
**Alur:**
1. User input email + password
2. Sistem validasi credentials
3. If valid → Generate JWT + session_id → Success
4. If invalid → Error message

**Visual:** Activity Diagram

**Slide 15: AD-02 - Buat Pesanan**
**Swimlane:** User | Sistem
**Alur:**
1. User buka form → Sistem load pangkalans + LPG
2. User input data (pangkalan, LPG, qty)
3. **Sistem validate → Generate ORD-XXXX**
4. Hitung PPN (12% untuk NON_SUBSIDI)
5. INSERT orders + order_items + timeline_tracks
6. Status = DRAFT → Success

**Visual:** Activity Diagram with decision (Tambah item lain?)

**Slide 16: AD-03 - Update Status Pesanan**
**Swimlane:** User | Sistem
**Decision Points:**
- Transisi valid? (DRAFT→MENUNGGU ok, SELESAI→DRAFT error)
- **Status = SELESAI? → AUTO-UPDATE STOK PANGKALAN** 🔥
- Status = SIAP_KIRIM? → Assign driver (opsional)

**Visual:** Activity Diagram with multiple decisions

**Slide 17: AD-07 - Catat Penjualan (Pangkalan)**
**Swimlane:** Pangkalan | Sistem
**Alur:**
1. Pangkalan pilih konsumen + LPG + qty
2. Sistem check stok → If cukup:
3. Generate PORD-XXXX
4. INSERT consumer_orders
5. **UPDATE pangkalan_stocks (qty - sold_qty)**
6. INSERT pangkalan_stock_movements (KELUAR)

**Visual:** Activity Diagram with stock validation

---

### Slide 18-22: Sequence Diagram (5 Core Processes)

**Slide 18: SD-01 - Login**
**Actors:** User → LoginForm → AuthService → users DB → activity_logs DB
**Flow:**
```
1. User input credentials
2. AuthService validate email+password
3. Generate JWT + session_id baru
4. UPDATE users SET session_id
5. INSERT activity_logs "login"
6. Return JWT token
```
**Visual:** Sequence Diagram

**Slide 19: SD-03 - Create Order**
**Actors:** Admin → OrderPage → OrderService → pangkalans DB → orders DB → order_items DB → timeline_tracks DB
**Flow:**
```
1. Admin buka form
2. Load pangkalans (active only)
3. Admin input data
4. Validate input
5. Generate ORD-XXXX
6. Calculate tax (12% untuk NON_SUBSIDI)
7. INSERT orders (status=DRAFT)
8. INSERT order_items (multiple)
9. INSERT timeline_tracks
```
**Visual:** Sequence Diagram

**Slide 20: SD-04 - Update Status**
**Actors:** Admin → OrderDetailPage → OrderService → orders DB → order_items DB → timeline_tracks DB → pangkalan_stocks DB
**Flow:**
```
1. Admin pilih status baru
2. Validate transition
3. If SIAP_KIRIM → Assign driver (opt)
4. UPDATE orders SET current_status
5. INSERT timeline_tracks
6. If SELESAI:
   - SELECT order_items
   - Loop: UPDATE pangkalan_stocks (+qty) ✨
```
**Visual:** Sequence Diagram with opt fragment

**Slide 21: SD-07 - Record Payment**
**Actors:** Admin → PaymentPage → PaymentService → order_payment_details DB → payment_records DB → orders DB → timeline_tracks DB
**Flow:**
```
1. Admin input payment (method, amount)
2. UPSERT order_payment_details (is_paid, is_dp)
3. INSERT payment_records
4. If LUNAS + status=MENUNGGU:
   - UPDATE orders SET status=DIPROSES ✨
   - INSERT timeline_tracks
```
**Visual:** Sequence Diagram with opt fragment

**Slide 22: SD-12 - Record Sale (Pangkalan)**
**Actors:** Pangkalan → PenjualanPage → ConsumerOrderService → consumers DB → pangkalan_stocks DB → consumer_orders DB → pangkalan_stock_movements DB
**Flow:**
```
1. Pangkalan input penjualan
2. Check stock availability
3. If cukup:
   - Generate PORD-XXXX
   - INSERT consumer_orders
   - UPDATE pangkalan_stocks (qty - sold) ✨
   - INSERT pangkalan_stock_movements
```
**Visual:** Sequence Diagram with alt fragment

---

### Slide 23: Deployment Diagram
**Konten:**
**Arsitektur Fisik:**
```
┌─────────────┐
│   USERS     │ (Chrome, Firefox, Safari, Mobile)
└──────┬──────┘
       │ HTTPS:443
┌──────▼──────┐
│   VERCEL    │ Frontend (Astro 5 + React 18 + TypeScript)
│  (CDN Edge) │ - Shadcn/UI, Tailwind CSS, Zustand
└──────┬──────┘
       │ HTTPS:443 (REST API)
┌──────▼──────┐
│   RAILWAY   │ Backend (NestJS 11 + Prisma 6)
│ (Container) │ - JWT + Passport, Gemini AI
└──────┬──────┘
       │ TCP:5432          │ HTTPS:443
┌──────▼──────┐   ┌────────▼────────┐   ┌──────────────┐
│ PostgreSQL  │   │ Supabase Storage│   │ Google Cloud │
│ 15 (Railway)│   │ (S3-compatible) │   │Gemini 2.0    │
│23 Tables    │   │File uploads     │   │Flash (AI)    │
└─────────────┘   └─────────────────┘   └──────────────┘
```

**Visual:** Deployment Diagram dengan node + connections

---

### Slide 24: Fitur Unggulan - Voice Order AI
**Konten:**
**Activity Diagram Voice Order:**
```
1. Admin klik mikrofon
2. Request izin mikrofon → Allow
3. Aktivate Speech API
4. Admin ucapkan: "50 tabung 12kg ke Reon"
5. Speech to text → Transcript
6. Send to Gemini AI → Parse:
   - qty: 50
   - lpg_type: kg12
   - pangkalan: "Reon"
7. Fuzzy matching → Find pangkalan
8. Validate stock
9. Generate ORD-XXXX → Simpan
```

**Visual:** Activity Diagram atau Flow chart

### Slide 25: Fitur Decision Support System (DSS)
**Konten:**
**Monitoring Stok - 3 Warna Alert:**

| Status | Kondisi | Warna | Aksi |
|--------|---------|-------|------|
| **AMAN** | `qty > warning_level` | 🟢 Hijau | Normal |
| **RENDAH** | `qty ≤ warning_level` | 🟡 Kuning | Perlu order |
| **KRITIS** | `qty ≤ critical_level` | 🔴 Merah | Urgent! |

**Multi-Tenant:**
- JWT berisi `pangkalanId`
- Query filter: `WHERE pangkalan_id = ?`
- Setiap pangkalan hanya lihat stok sendiri

**Visual:** Dashboard cards dengan 3 warna

---

## ✅ BAB IV: HASIL DAN PEMBAHASAN (5 menit)

### Slide 26: Implementasi Sistem
**Konten (2 Kolom):**

**Statistik:**
- **Backend:** 15 modules, 180+ API endpoints
- **Frontend:** 52 halaman
- **Database:** 23 tabel
- **UML:** 52 diagram + 74 mockup

**Tech Stack:**
- Astro 5 + React 18 + TypeScript
- NestJS 11 + Prisma 6
- PostgreSQL 15
- Google Gemini 2.0 Flash

### Slide 27: Hasil Testing
**Konten (2 Kolom):**

**BlackBox Testing:**
- Total: 189 test cases
- Valid: 187 ✅
- Invalid: 2 ❌
- **Success: 98.94%** 🎯

**User Acceptance Test (UAT):**
- Responden: 5 orang
- **SUS Score: 87.5**
- **Grade: A (Excellent)** 🏆

**Visual:** 2 charts (Pie chart + Gauge)

### Slide 28: Kesimpulan
**Konten (Numbered):**
1. ✅ Sistem berhasil dibangun dengan **52 diagram UML lengkap**
2. ✅ **17 Use Case**, **29 Activity**, **20 Sequence**, **3 State Machine**
3. ✅ Implementasi **Voice Order AI** dengan Gemini 2.0 Flash
4. ✅ **DSS** dengan alert 3 warna + **Multi-tenant**
5. ✅ Testing: **BlackBox 98.94%**, **UAT SUS 87.5 (Grade A)**
6. ✅ Deployment production-ready: Vercel + Railway

### Slide 29: Penutup
**Konten:**
- **Terima Kasih**
- Pertanyaan & Diskusi

---

## 🎬 DEMO SISTEM (10 menit)

### Skenario Demo:

**Demo 1: Voice Order** (3 menit)
1. Login Admin
2. Klik Voice Order 🎤
3. "Lima puluh tabung 12 kilo ke Reon"
4. AI parsing → Konfirmasi → Order created

**Demo 2: Update Status + Auto-Sync** (4 menit)
1. Buka order ORD-XXXX
2. DRAFT → MENUNGGU_PEMBAYARAN
3. Catat pembayaran → Auto DIPROSES ✨
4. Assign driver → SIAP_KIRIM
5. DIKIRIM → SELESAI → **Lihat stok pangkalan bertambah** 🔥

**Demo 3: Dashboard DSS** (3 menit)
1. Login Pangkalan
2. Lihat stok: 🟢🟡🔴
3. Catat penjualan → Stok berkurang otomatis

---

## 🎯 ESTIMASI WAKTU

| Bagian | Slide | Waktu |
|--------|-------|-------|
| Pembukaan | 1-2 | 2 menit |
| BAB I | 3-5 | 5 menit |
| **BAB III (UML)** | **6-25** | **18 menit** |
| BAB IV | 26-28 | 5 menit |
| Penutup | 29 | 1 menit |
| **Demo** | - | **10 menit** |
| **TOTAL** | **29 slides** | **41 menit** |

---

## 📝 TIPS

### Yang HARUS Dikuasai:
1. **"Jelaskan State Machine!"** → 7 state, entry action SELESAI = auto-sync stok
2. **"Berapa diagram UML?"** → 52 (17 UC, 29 AD, 20 SD, 3 SM, 1 CD, 1 ERD, 1 DD)
3. **"Apa itu Entry Action?"** → Aksi yang dijalankan saat MASUK ke state
4. **"Multi-tenant gimana?"** → JWT filter `pangkalanId`, isolasi data per tenant

### Backup:
✅ Screenshot semua UML  
✅ Video demo 3 menit  
✅ Hotspot HP  

---

> **🎓 Semoga sukses seminarnya!**
