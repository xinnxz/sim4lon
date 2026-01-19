# Panduan Screenshot Black Box Testing - SIM4LON

## Informasi Umum
- **Base URL**: http://localhost:4321
- **Tools**: Snipping Tool (Win+Shift+S) atau Print Screen
- **Folder Output**: `docs/testing/figures/blackbox/`

---

## Akun Login

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@sim4lon.co.id | admin123 |
| PANGKALAN | (lihat di Prisma Studio) | pangkalan123 |

---

# MODUL 1: LOGIN (8 Screenshot)

## TC1 - Login Valid
**URL**: http://localhost:4321/login
**Aksi**: Input email & password yang benar
**Screenshot TC**: Form dengan data terisi
**Screenshot Result**: Halaman dashboard setelah login

## TC2 - Password Salah
**URL**: http://localhost:4321/login
**Aksi**: Input email benar, password salah
**Screenshot TC**: Form dengan data terisi
**Screenshot Result**: Pesan error "Password salah"

## TC3 - Email Tidak Terdaftar
**URL**: http://localhost:4321/login
**Aksi**: Input email yang tidak ada
**Screenshot TC**: Form dengan email tidak ada
**Screenshot Result**: Pesan error "Akun tidak ditemukan"

## TC4 - Email Kosong
**URL**: http://localhost:4321/login
**Aksi**: Kosongkan email, isi password, klik login
**Screenshot TC**: Form dengan email kosong
**Screenshot Result**: Validasi "Email wajib diisi"

## TC5 - Password Kosong
**URL**: http://localhost:4321/login
**Aksi**: Isi email, kosongkan password, klik login
**Screenshot TC**: Form dengan password kosong
**Screenshot Result**: Validasi "Password wajib diisi"

## TC6 - Format Email Salah
**URL**: http://localhost:4321/login
**Aksi**: Input email tanpa @
**Screenshot TC**: Form dengan email invalid
**Screenshot Result**: Validasi "Format email tidak valid"

## TC7 - Logout
**URL**: http://localhost:4321/dashboard
**Aksi**: Klik menu profil → Keluar
**Screenshot TC**: Menu profil dengan opsi Keluar
**Screenshot Result**: Redirect ke halaman login

## TC8 - Akses Protected Route
**URL**: http://localhost:4321/dashboard (setelah logout)
**Aksi**: Akses langsung URL dashboard
**Screenshot TC**: Browser address bar
**Screenshot Result**: Redirect ke login

---

# MODUL 2: DASHBOARD (10 Screenshot)

## TC1 - Statistik KPI
**URL**: http://localhost:4321/dashboard
**Aksi**: Buka dashboard setelah login
**Screenshot TC**: Halaman loading
**Screenshot Result**: Card statistik tampil

## TC2 - Chart Penjualan
**URL**: http://localhost:4321/dashboard
**Aksi**: Scroll ke chart penjualan
**Screenshot TC**: Area chart
**Screenshot Result**: Chart dengan data 7 hari

## TC3 - Chart Stok
**URL**: http://localhost:4321/dashboard
**Aksi**: Scroll ke chart stok
**Screenshot TC**: Area chart stok
**Screenshot Result**: Trend stok 7 hari

## TC4 - Chart Profit
**URL**: http://localhost:4321/dashboard
**Aksi**: Scroll ke chart profit
**Screenshot TC**: Area chart profit
**Screenshot Result**: Profit harian

## TC5 - Top Pangkalan
**URL**: http://localhost:4321/dashboard
**Aksi**: Lihat pie chart
**Screenshot TC**: Pie chart area
**Screenshot Result**: Top 5 pangkalan

## TC6 - Aktivitas Terbaru
**URL**: http://localhost:4321/dashboard
**Aksi**: Scroll ke section aktivitas
**Screenshot TC**: Section aktivitas
**Screenshot Result**: 10 aktivitas terakhir

## TC7 - Alert Stok Rendah
**URL**: http://localhost:4321/dashboard
**Aksi**: Lihat panel DSS
**Screenshot TC**: Panel DSS
**Screenshot Result**: Alert stok rendah

## TC8 - Alert Pembayaran Overdue
**URL**: http://localhost:4321/dashboard
**Aksi**: Lihat panel DSS
**Screenshot TC**: Panel DSS
**Screenshot Result**: Alert pembayaran overdue

## TC9 - Health Score
**URL**: http://localhost:4321/dashboard
**Aksi**: Lihat Health Score
**Screenshot TC**: Card Health Score
**Screenshot Result**: Skor 0-100%

## TC10 - Reorder Point
**URL**: http://localhost:4321/dashboard
**Aksi**: Lihat rekomendasi DSS
**Screenshot TC**: Panel DSS
**Screenshot Result**: Rekomendasi reorder

---

# MODUL 3: STOK LPG (9 Screenshot)

## TC1 - Ringkasan Stok
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Buka menu Stok LPG
**Screenshot TC**: Menu sidebar
**Screenshot Result**: Card stok per tipe

## TC2 - Riwayat Stok
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Klik tab Riwayat
**Screenshot TC**: Tab Riwayat
**Screenshot Result**: Daftar pergerakan stok

## TC3 - Filter by Tipe
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Pilih filter LPG 3kg
**Screenshot TC**: Dropdown filter
**Screenshot Result**: Data LPG 3kg saja

## TC4 - Filter by Movement
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Pilih filter MASUK
**Screenshot TC**: Dropdown filter
**Screenshot Result**: Data MASUK saja

## TC5 - Tambah Stok Valid
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Klik Tambah → Isi 50 → Simpan
**Screenshot TC**: Modal tambah stok
**Screenshot Result**: Stok bertambah + riwayat

## TC6 - Tambah Stok 0
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Klik Tambah → Isi 0 → Simpan
**Screenshot TC**: Modal dengan 0
**Screenshot Result**: Validasi error

## TC7 - Tambah Stok Negatif
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Klik Tambah → Isi -10 → Simpan
**Screenshot TC**: Modal dengan -10
**Screenshot Result**: Validasi error

## TC8 - Kurangi Stok Valid
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Klik Kurangi → Isi < stok → Simpan
**Screenshot TC**: Modal kurangi
**Screenshot Result**: Stok berkurang

## TC9 - Kurangi Melebihi Stok
**URL**: http://localhost:4321/ringkasan-stok
**Aksi**: Kurangi lebih dari tersedia
**Screenshot TC**: Modal dengan qty besar
**Screenshot Result**: Error stok tidak cukup

---

# MODUL 4: PESANAN (12 Screenshot)

## TC1 - Daftar Pesanan
**URL**: http://localhost:4321/daftar-pesanan
**Aksi**: Buka menu Pesanan
**Screenshot TC**: Menu sidebar
**Screenshot Result**: Daftar pesanan

## TC2 - Filter Status
**URL**: http://localhost:4321/daftar-pesanan
**Aksi**: Filter MENUNGGU_PEMBAYARAN
**Screenshot TC**: Dropdown status
**Screenshot Result**: Pesanan terfilter

## TC3 - Filter Pangkalan
**URL**: http://localhost:4321/daftar-pesanan
**Aksi**: Pilih pangkalan tertentu
**Screenshot TC**: Dropdown pangkalan
**Screenshot Result**: Pesanan terfilter

## TC4 - Sorting
**URL**: http://localhost:4321/daftar-pesanan
**Aksi**: Klik header Tanggal
**Screenshot TC**: Header tabel
**Screenshot Result**: Data tersort

## TC5 - Detail Pesanan
**URL**: http://localhost:4321/detail-pesanan/[ID]
**Aksi**: Klik salah satu pesanan
**Screenshot TC**: Row pesanan
**Screenshot Result**: Halaman detail

## TC6 - Buat Pesanan Valid
**URL**: http://localhost:4321/buat-pesanan
**Aksi**: Pilih pangkalan → Tambah item → Simpan
**Screenshot TC**: Form lengkap
**Screenshot Result**: Pesanan tersimpan

## TC7 - Buat Pesanan Tanpa Item
**URL**: http://localhost:4321/buat-pesanan
**Aksi**: Pilih pangkalan → Langsung simpan
**Screenshot TC**: Form tanpa item
**Screenshot Result**: Validasi error

## TC8 - Update Status
**URL**: http://localhost:4321/detail-pesanan/[ID]
**Aksi**: Klik Proses Pembayaran
**Screenshot TC**: Tombol aksi
**Screenshot Result**: Status berubah

## TC9 - Alur Sampai Selesai
**URL**: http://localhost:4321/detail-pesanan/[ID]
**Aksi**: Update status bertahap
**Screenshot TC**: Timeline
**Screenshot Result**: Status SELESAI

## TC10 - Batalkan Pesanan
**URL**: http://localhost:4321/detail-pesanan/[ID]
**Aksi**: Klik Batalkan
**Screenshot TC**: Tombol batal
**Screenshot Result**: Status BATAL

## TC11 - Status SELESAI
**URL**: http://localhost:4321/detail-pesanan/[ID_SELESAI]
**Aksi**: Buka pesanan selesai
**Screenshot TC**: Detail pesanan
**Screenshot Result**: Tidak ada tombol aksi

## TC12 - Hapus Pesanan
**URL**: http://localhost:4321/detail-pesanan/[ID]
**Aksi**: Klik Hapus → Konfirmasi
**Screenshot TC**: Dialog konfirmasi
**Screenshot Result**: Pesanan terhapus

---

# MODUL 5: PEMBAYARAN (5 Screenshot)

## TC1 - Pembayaran Lunas
**URL**: http://localhost:4321/catat-pembayaran/[ORDER_ID]
**Aksi**: Isi jumlah = total
**Screenshot TC**: Form pembayaran
**Screenshot Result**: Status PAID

## TC2 - Pembayaran DP
**URL**: http://localhost:4321/catat-pembayaran/[ORDER_ID]
**Aksi**: Isi jumlah < total
**Screenshot TC**: Form dengan partial
**Screenshot Result**: Status PARTIAL

## TC3 - Metode Tunai
**URL**: http://localhost:4321/catat-pembayaran/[ORDER_ID]
**Aksi**: Pilih TUNAI
**Screenshot TC**: Radio button tunai
**Screenshot Result**: Pembayaran tercatat

## TC4 - Metode Transfer
**URL**: http://localhost:4321/catat-pembayaran/[ORDER_ID]
**Aksi**: Pilih TRANSFER + upload bukti
**Screenshot TC**: Form + upload
**Screenshot Result**: Pembayaran + bukti

## TC5 - Daftar Pembayaran
**URL**: http://localhost:4321/pembayaran atau dari detail pesanan
**Aksi**: Lihat riwayat pembayaran
**Screenshot TC**: Menu/tab
**Screenshot Result**: Daftar pembayaran

---

# MODUL 6: PANGKALAN (7 Screenshot)

## TC1 - Daftar Pangkalan
**URL**: http://localhost:4321/daftar-pangkalan
**Aksi**: Buka menu Pangkalan
**Screenshot TC**: Menu sidebar
**Screenshot Result**: Daftar pangkalan

## TC2 - Tambah Pangkalan
**URL**: http://localhost:4321/tambah-pangkalan
**Aksi**: Isi semua field → Simpan
**Screenshot TC**: Form lengkap
**Screenshot Result**: Pangkalan tersimpan

## TC3 - Tambah Tanpa Nama
**URL**: http://localhost:4321/tambah-pangkalan
**Aksi**: Kosongkan nama → Simpan
**Screenshot TC**: Form tanpa nama
**Screenshot Result**: Validasi error

## TC4 - Edit Pangkalan
**URL**: http://localhost:4321/detail-pangkalan/[ID]
**Aksi**: Edit → Ubah data → Simpan
**Screenshot TC**: Form edit
**Screenshot Result**: Data terupdate

## TC5 - Hapus Pangkalan
**URL**: http://localhost:4321/detail-pangkalan/[ID]
**Aksi**: Klik Hapus → Konfirmasi
**Screenshot TC**: Dialog konfirmasi
**Screenshot Result**: Pangkalan terhapus

## TC6 - Search
**URL**: http://localhost:4321/daftar-pangkalan
**Aksi**: Ketik keyword
**Screenshot TC**: Search box
**Screenshot Result**: Hasil filter

## TC7 - Filter Status
**URL**: http://localhost:4321/daftar-pangkalan
**Aksi**: Pilih Aktif/Nonaktif
**Screenshot TC**: Dropdown
**Screenshot Result**: Hasil filter

---

# MODUL 7: DRIVER (6 Screenshot)

## TC1 - Daftar Driver
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Buka menu Driver
**Screenshot TC**: Menu sidebar
**Screenshot Result**: Daftar driver

## TC2 - Tambah Driver
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Klik Tambah → Isi → Simpan
**Screenshot TC**: Form tambah
**Screenshot Result**: Driver tersimpan

## TC3 - Tambah Tanpa Nama
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Kosongkan nama → Simpan
**Screenshot TC**: Form tanpa nama
**Screenshot Result**: Validasi error

## TC4 - Edit Driver
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Klik Edit → Ubah → Simpan
**Screenshot TC**: Form edit
**Screenshot Result**: Data terupdate

## TC5 - Hapus Driver
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Klik Hapus → Konfirmasi
**Screenshot TC**: Dialog konfirmasi
**Screenshot Result**: Driver terhapus

## TC6 - Nonaktifkan
**URL**: http://localhost:4321/daftar-driver
**Aksi**: Toggle status
**Screenshot TC**: Toggle aktif
**Screenshot Result**: Status berubah

---

# MODUL 8: LAPORAN (8 Screenshot)

## TC1 - Laporan Penjualan
**URL**: http://localhost:4321/laporan
**Aksi**: Pilih tab Penjualan + date range
**Screenshot TC**: Tab + filter
**Screenshot Result**: Data penjualan

## TC2 - Export PDF
**URL**: http://localhost:4321/laporan
**Aksi**: Klik Export PDF
**Screenshot TC**: Tombol export
**Screenshot Result**: File PDF / preview

## TC3 - Export Excel
**URL**: http://localhost:4321/laporan
**Aksi**: Klik Export Excel
**Screenshot TC**: Tombol export
**Screenshot Result**: File Excel

## TC4 - Export Word
**URL**: http://localhost:4321/laporan
**Aksi**: Klik Export Word (jika ada)
**Screenshot TC**: Tombol export
**Screenshot Result**: File Word

## TC5 - Laporan Stok
**URL**: http://localhost:4321/laporan
**Aksi**: Pilih tab Stok + date range
**Screenshot TC**: Tab + filter
**Screenshot Result**: Data stok

## TC6 - Filter Produk
**URL**: http://localhost:4321/laporan
**Aksi**: Pilih filter LPG 3kg
**Screenshot TC**: Dropdown filter
**Screenshot Result**: Data terfilter

## TC7 - Laporan Pangkalan
**URL**: http://localhost:4321/laporan
**Aksi**: Pilih tab Pangkalan
**Screenshot TC**: Tab pangkalan
**Screenshot Result**: Performa pangkalan

## TC8 - Detail Konsumen
**URL**: http://localhost:4321/laporan
**Aksi**: Klik pangkalan → Lihat konsumen
**Screenshot TC**: Row pangkalan
**Screenshot Result**: Daftar konsumen subsidi

---

# MODUL 9-21: PANGKALAN PORTAL

**Base URL Pangkalan**: http://localhost:4321/pangkalan/

## Modul Konsumen
**URL**: http://localhost:4321/pangkalan/konsumen

## Modul Penjualan
**URL**: http://localhost:4321/pangkalan/penjualan

## Modul Stok Pangkalan
**URL**: http://localhost:4321/pangkalan/stok

## Modul Pengeluaran
**URL**: http://localhost:4321/pangkalan/pengeluaran

## Modul Profil
**URL**: http://localhost:4321/pangkalan/profil

---

# MODUL ADMIN LAINNYA

## Perencanaan
**URL**: http://localhost:4321/perencanaan

## Penyaluran
**URL**: http://localhost:4321/penyaluran

## Penerimaan
**URL**: http://localhost:4321/penerimaan

## In/Out Agen
**URL**: http://localhost:4321/in-out

## User Management
**URL**: http://localhost:4321/daftar-pengguna

---

# Tips Screenshot Cepat

1. **Windows**: Tekan `Win + Shift + S` untuk Snipping Tool
2. **Naming**: Gunakan format `modul-tc1.png` dan `modul-result1.png`
3. **Crop**: Fokus pada area yang relevan saja
4. **Batch**: Screenshot semua TC dulu, baru semua Result
5. **Folder**: Simpan langsung ke `docs/testing/figures/blackbox/`

---

# Checklist Progress

- [ ] Modul Login (8 TC)
- [ ] Modul Dashboard (10 TC)
- [ ] Modul Stok LPG (9 TC)
- [ ] Modul Pesanan (12 TC)
- [ ] Modul Pembayaran (5 TC)
- [ ] Modul Pangkalan (7 TC)
- [ ] Modul Driver (6 TC)
- [ ] Modul Laporan (8 TC)
- [ ] Modul Konsumen (10 TC)
- [ ] Modul Penjualan (12 TC)
- [ ] Modul Stok Pangkalan (5 TC)
- [ ] Modul Produk LPG (5 TC)
- [ ] Modul Notifikasi (4 TC)
- [ ] Modul Perencanaan (6 TC)
- [ ] Modul Penyaluran (5 TC)
- [ ] Modul Penerimaan (5 TC)
- [ ] Modul In/Out (4 TC)
- [ ] Modul Pengeluaran (6 TC)
- [ ] Modul User Management (6 TC)
- [ ] Modul Dashboard Pangkalan (5 TC)
- [ ] Modul Profil (5 TC)
