# 📊 STEP 2: ANALISIS FITUR PER MODUL SIM4LON

---

## RINGKASAN MODUL

| Modul | File Service | Baris Kode | Jumlah Method | Fitur Utama |
|-------|--------------|------------|---------------|-------------|
| Order | `order.service.ts` | 867 | 13 | Order lifecycle, status transition |
| Stock | `stock.service.ts` | 149 | 4 | Stock in/out movements |
| Gemini AI | `gemini.service.ts` | 837 | 6 | Voice command parsing, validation |
| Dashboard | `dashboard.service.ts` | 1089 | 14 | DSS alerts, charts, trend |
| Penerimaan | `penerimaan.service.ts` | 307 | 6 | Pertamina SO/LO integration |
| Reports | `reports.service.ts` | 544 | 5 | Export laporan berbagai format |

**Total: 3,793 baris kode backend services**

---

## 1. MODUL ORDER (Manajemen Pesanan)

### Lokasi File
- [order.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/order/order.service.ts)

### Fitur Utama

| Method | Fungsi | Kompleksitas |
|--------|--------|--------------|
| `create()` | Buat pesanan baru dengan validasi produk & harga | ⭐⭐⭐ (330 baris) |
| `updateStatus()` | Update status dengan state machine validation | ⭐⭐⭐ (240 baris) |
| `findAll()` | List pesanan dengan filter, search, pagination | ⭐⭐ |
| `getStats()` | Statistik pesanan per status | ⭐ |

### State Machine Status Pesanan
```
BARU → DIPROSES → DIKIRIM → SELESAI
  │        │          │
  └────────┴──────────┴───→ BATAL
```

### Validasi yang Dilakukan
1. ✅ Pangkalan harus aktif dan valid
2. ✅ Produk harus tersedia
3. ✅ Harga otomatis dari master `lpg_products`
4. ✅ Status transition harus valid (tidak bisa loncat)
5. ✅ Auto-create `stock_histories` KELUAR saat status SELESAI

---

## 2. MODUL STOCK (Manajemen Stok)

### Lokasi File
- [stock.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/stock/stock.service.ts)

### Fitur Utama

| Method | Fungsi |
|--------|--------|
| `createMovement()` | Catat stok masuk/keluar dengan referensi |
| `getHistory()` | Riwayat pergerakan stok dengan pagination |
| `getSummary()` | Stok saat ini per jenis LPG |
| `getHistoryByType()` | Riwayat per tipe produk |

### Rumus Perhitungan Stok
```
Stok Saat Ini = SUM(MASUK) - SUM(KELUAR)
```

### Tipe Movement
- `MASUK` - Penerimaan dari SPBE/Pertamina
- `KELUAR` - Pengiriman ke Pangkalan

---

## 3. MODUL GEMINI AI (Voice Command) ⭐ KILLER FEATURE

### Lokasi File
- [gemini.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/gemini/gemini.service.ts)

### Arsitektur AI Parsing
```
Voice Input → Web Speech API → Text
                                 ↓
                         parseVoiceCommand()
                                 ↓
                    ┌────────────┴────────────┐
                    ↓                         ↓
            Gemini AI API              fallbackParse()
            (Primary Parser)           (Regex Backup)
                    ↓                         ↓
                    └────────────┬────────────┘
                                 ↓
                    validateParsedOrder()
                                 ↓
                    ┌────────────┴────────────┐
                    ↓            ↓            ↓
               Check         Check         Check
              Pangkalan      Stock      Quantity Limits
                    ↓            ↓            ↓
                    └────────────┬────────────┘
                                 ↓
                        ParsedOrderData (JSON)
```

### Fitur AI Parsing

| Fitur | Deskripsi |
|-------|-----------|
| **NLP Parsing** | Gemini memahami berbagai format ucapan |
| **Fuzzy Matching** | Levenshtein distance untuk nama pangkalan mirip |
| **Auto-detect Product** | Deteksi ukuran LPG dari angka (3kg, 12kg, dll) |
| **Fallback Parser** | Regex backup jika Gemini gagal |
| **Validasi Stok** | Cek ketersediaan stok real-time |
| **Confidence Score** | Tingkat kepercayaan hasil parsing |

### Contoh Input yang Didukung
```
✅ "Pesan gas 3 kilo 50 tabung untuk Pangkalan Reon"
✅ "Order 100 tabung 12 kg buat Pak Asep Cihuy"
✅ "Lima puluh tabung tiga kiloan ke Pangkalan ABC"
✅ "Gas melon 30 biji untuk Reon"
```

### Validation Issues (Error Messages)
| Type | Message |
|------|---------|
| `STOCK_INSUFFICIENT` | "Stok tidak cukup. Tersedia: X, diminta: Y" |
| `PANGKALAN_NOT_FOUND` | "Pangkalan tidak ditemukan di database" |
| `PANGKALAN_INACTIVE` | "Pangkalan tidak aktif" |
| `QUANTITY_TOO_LOW` | "Minimal order 10 tabung" |
| `QUANTITY_TOO_HIGH` | "Maksimal order 500 tabung per transaksi" |

---

## 4. MODUL DASHBOARD & DSS ⭐ DECISION SUPPORT

### Lokasi File
- [dashboard.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/dashboard/dashboard.service.ts)

### Fitur Dashboard

| Method | Fungsi | Output |
|--------|--------|--------|
| `getStats()` | KPI hari ini | Orders, Sales, Pending, Stock |
| `getSalesChart()` | Grafik penjualan 7 hari | Line chart data |
| `getStockChart()` | Konsumsi stok 7 hari | Bar chart per produk |
| `getProfitChart()` | Profit harian | Profit = Sales - COGS |
| `getTopPangkalan()` | Top 3 pangkalan | Pie chart data |

### DSS Alerts (Decision Support System)

| Alert Type | Threshold | Priority |
|------------|-----------|----------|
| `LOW_STOCK` | < 50 unit | 🟡 Warning |
| `CRITICAL_STOCK` | < 20 unit | 🔴 Critical |
| `OUT_OF_STOCK` | = 0 | 🔴 Critical |
| `PAYMENT_OVERDUE` | > 7 hari | 🟠 High |
| `PENDING_ORDERS` | Status BARU/DIPROSES | 🟡 Warning |

### Reorder Point Analysis
```javascript
// Formula ROP (Reorder Point)
ROP = (Average Daily Demand × Lead Time) + Safety Stock

// Safety Stock = 50% dari (Avg Demand × Lead Time)
Safety Stock = 0.5 × (Avg Daily Demand × Lead Time)

// Suggested Order Quantity  
Suggested Qty = ROP - Current Stock + (7 × Avg Daily Demand)
```

### Health Score Calculation
```javascript
// Score 0-100 (higher = better)
healthScore = 100 - (lowStockPenalty + overduePenalty + pendingPenalty)

lowStockPenalty = lowStockCount × 5 (max 30)
overduePenalty = overdueCount × 10 (max 40)
pendingPenalty = pendingCount × 3 (max 30)
```

---

## 5. MODUL PERTAMINA INTEGRATION

### Lokasi File
- [penerimaan.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/penerimaan/penerimaan.service.ts)
- `penyaluran.service.ts`
- `perencanaan.service.ts`

### Fitur Integrasi

| Modul | Fungsi | Data Pertamina |
|-------|--------|----------------|
| **Penerimaan** | Catat stok masuk dari SPBE | SO Number, LO Number |
| **Penyaluran** | Catat distribusi ke pangkalan | Delivery log per hari |
| **Perencanaan** | Rencana order ke SPBE | DO Request, Kuota |

### Format Data SO/LO
```
SO Number: SO-2025-12345 (Sales Order dari Pertamina)
LO Number: LO-2025-99999 (Loading Order untuk pengambilan)
```

### Auto-detect LPG Type dari Material Name
```javascript
"REFILL/ISI LPG @3KG (NET)"   → kg3 (Subsidi)
"REFILL/ISI LPG @12KG (NET)"  → kg12
"REFILL/ISI LPG @50KG (NET)"  → kg50
"REFILL/ISI LPG @5.5KG (NET)" → kg5 (Bright Gas)
```

---

## 6. MODUL REPORTS (Laporan)

### Lokasi File
- [reports.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/reports/reports.service.ts)

### Jenis Laporan

| Laporan | Method | Data yang Dikembalikan |
|---------|--------|------------------------|
| **Penjualan** | `getSalesReport()` | Orders, Revenue, Status breakdown |
| **Pembayaran** | `getPaymentsReport()` | Payments, Method breakdown |
| **Stok** | `getStockMovementReport()` | In/Out per produk |
| **Pangkalan** | `getPangkalanReport()` | Performa per pangkalan |
| **Audit Subsidi** | `getSubsidiConsumers()` | Konsumen subsidi per pangkalan |

### Format Export
- ✅ PDF (via jsPDF)
- ✅ Excel (via SheetJS)
- ✅ Print-ready format

---

## 7. MULTI-TENANT (Pangkalan Portal)

### Konsep Multi-Tenant
```
┌─────────────────────────────────────────────────┐
│                 AGEN (Parent)                    │
│  Melihat semua data, full control               │
└─────────────────────┬───────────────────────────┘
                      │
      ┌───────────────┼───────────────┐
      ↓               ↓               ↓
┌──────────┐   ┌──────────┐   ┌──────────┐
│Pangkalan │   │Pangkalan │   │Pangkalan │
│    A     │   │    B     │   │    C     │
│          │   │          │   │          │
│ ✅ Stok  │   │ ✅ Stok  │   │ ✅ Stok  │
│    Sendiri│  │    Sendiri│  │    Sendiri│
│ ✅ Order │   │ ✅ Order │   │ ✅ Order │
│    Sendiri│  │    Sendiri│  │    Sendiri│
│ ❌ Data  │   │ ❌ Data  │   │ ❌ Data  │
│    Lain  │   │    Lain  │   │    Lain  │
└──────────┘   └──────────┘   └──────────┘
```

### Fitur Pangkalan Portal
- Dashboard khusus pangkalan
- Order ke agen
- Kelola konsumen akhir
- Stok pangkalan terpisah
- Laporan penjualan sendiri

---

> ✅ **Step 2 Selesai!** Semua fitur per modul sudah terdokumentasi.
