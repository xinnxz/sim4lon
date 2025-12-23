# DOKUMENTASI ACTIVITY DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Activity Diagram menggambarkan alur kerja (workflow) dari setiap proses bisnis dalam sistem SIM4LON. Setiap diagram menggunakan 2 partisi (swimlane):

| Partisi | Deskripsi |
|---------|-----------|
| **User/Admin/Pangkalan** | Aktor yang melakukan aksi |
| **Sistem** | Backend + Database yang memproses |

---

## 2. NOTASI YANG DIGUNAKAN

| Simbol | Nama | Fungsi |
|--------|------|--------|
| ● | Initial Node | Titik mulai alur |
| ◉ | Final Node | Titik akhir alur |
| ▭ | Action | Aktivitas yang dilakukan |
| ◇ | Decision | Percabangan kondisi (if/switch) |
| ═══ | Swimlane | Pembatas antar aktor |

---

## 3. DAFTAR ACTIVITY DIAGRAM

### FASE 1: Core Business (9 Diagram)

| AD-ID | Nama | Aktor | File |
|-------|------|-------|------|
| AD-01 | Login | User | `AD_01_Login.puml` |
| AD-02 | Buat Pesanan | User | `AD_02_BuatPesanan.puml` |
| AD-03 | Update Status Pesanan | User | `AD_03_UpdateStatusPesanan.puml` |
| AD-04 | Catat Pembayaran | User | `AD_04_CatatPembayaran.puml` |
| AD-05 | Catat Penerimaan Stok | User | `AD_05_CatatPenerimaanStok.puml` |
| AD-06 | Catat Penyaluran | User | `AD_06_CatatPenyaluran.puml` |
| AD-07 | Catat Penjualan | Pangkalan | `AD_07_CatatPenjualan.puml` |
| AD-08 | Buat Order ke Agen | Pangkalan | `AD_08_BuatOrderKeAgen.puml` |
| AD-09 | Kelola Pangkalan | Admin | `AD_09_KelolaPangkalan.puml` |

### FASE 2: Supporting (16 Diagram)

| AD-ID | Nama | Aktor | File |
|-------|------|-------|------|
| AD-10 | Ubah Password | User | `AD_10_UbahPassword.puml` |
| AD-11 | Kelola Pengguna | Admin | `AD_11_KelolaPengguna.puml` |
| AD-12 | Kelola Supir | Admin | `AD_12_KelolaSupir.puml` |
| AD-13 | Kelola Produk LPG | Admin | `AD_13_KelolaProdukLPG.puml` |
| AD-14 | Assign Driver | User | `AD_14_AssignDriver.puml` |
| AD-15 | Lihat Detail Pesanan | User | `AD_15_LihatDetailPesanan.puml` |
| AD-16 | Generate Invoice | User | `AD_16_GenerateInvoice.puml` |
| AD-17 | Cetak Nota | User | `AD_17_CetakNota.puml` |
| AD-18 | Kelola Perencanaan | User | `AD_18_KelolaPerencanaan.puml` |
| AD-19 | Lihat In-Out Agen | User | `AD_19_LihatInOutAgen.puml` |
| AD-20 | Kelola Konsumen | Pangkalan | `AD_20_KelolaKonsumen.puml` |
| AD-21 | Kelola Stok Pangkalan | Pangkalan | `AD_21_KelolaStokPangkalan.puml` |
| AD-22 | Terima Order dari Agen | Pangkalan | `AD_22_TerimaOrderDariAgen.puml` |
| AD-23 | Kelola Pengeluaran | Pangkalan | `AD_23_KelolaPengeluaran.puml` |
| AD-24 | Generate Laporan | User | `AD_24_GenerateLaporan.puml` |
| AD-25 | Export Laporan | User | `AD_25_ExportLaporan.puml` |

---

## 4. DETAIL ACTIVITY DIAGRAM

### AD-01: Login

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | User masuk ke sistem dengan kredensial yang valid |
| **Aktor** | Admin, Operator, Pangkalan |
| **Pre-kondisi** | User memiliki akun terdaftar dan aktif |
| **Post-kondisi** | User mendapat akses sesuai role |

**Alur Utama:**
1. User membuka halaman login
2. User memasukkan email dan password
3. Sistem validasi format input
4. Sistem cari user di database
5. Sistem cek status akun (aktif/tidak)
6. Sistem validasi password
7. Sistem generate session_id baru (single-session)
8. Sistem generate JWT token
9. User redirect ke dashboard

**Alur Alternatif:**
- Jika kredensial salah → Tampilkan error
- Jika akun tidak aktif → Tampilkan error

---

### AD-02: Buat Pesanan

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Membuat pesanan LPG baru dari pangkalan |
| **Aktor** | Admin, Operator |
| **Pre-kondisi** | Ada pangkalan dan produk LPG aktif |
| **Post-kondisi** | Pesanan tersimpan dengan status DRAFT |

**Alur Utama:**
1. User buka halaman Pesanan
2. User klik "Buat Pesanan Baru"
3. Sistem load daftar pangkalan dan produk
4. User pilih pangkalan
5. User pilih jenis LPG dan jumlah
6. Sistem hitung subtotal dan PPN (12% non-subsidi)
7. User klik "Simpan"
8. Sistem generate kode pesanan (ORD-XXXX)
9. Sistem simpan pesanan dengan status DRAFT
10. Sistem buat timeline track "Pesanan Dibuat"

---

### AD-03: Update Status Pesanan

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Mengubah status pesanan sesuai workflow |
| **Aktor** | Admin, Operator |
| **Pre-kondisi** | Pesanan sudah ada |
| **Post-kondisi** | Status pesanan berubah |

**Alur Status Valid:**
```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
                                                         ↓
                                                   [Assign Driver]
```

**Alur Utama:**
1. User buka detail pesanan
2. User pilih status baru
3. Sistem validasi transisi status
4. Jika status = SIAP_KIRIM, opsi assign driver
5. Jika status = SELESAI, auto-update stok pangkalan
6. Sistem update status dan buat timeline track

---

### AD-04: Catat Pembayaran

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Mencatat pembayaran dari pangkalan |
| **Aktor** | Admin, Operator |
| **Pre-kondisi** | Pesanan ada dan belum lunas |
| **Post-kondisi** | Pembayaran tercatat |

**Alur Utama:**
1. User buka detail pesanan
2. User klik "Catat Pembayaran"
3. User pilih metode (TUNAI/TRANSFER)
4. User masukkan jumlah bayar
5. User upload bukti transfer (jika transfer)
6. Sistem cek: lunas atau DP
7. Sistem simpan payment record
8. Jika lunas dan status = MENUNGGU_PEMBAYARAN, auto-update ke DIPROSES

---

### AD-05: Catat Penerimaan Stok

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Mencatat stok masuk dari SPBE |
| **Aktor** | Admin, Operator |
| **Pre-kondisi** | - |
| **Post-kondisi** | Stok agen bertambah |

**Alur Utama:**
1. User buka halaman Penerimaan Stok
2. User klik "Tambah Penerimaan"
3. User isi No. SO, No. LO, nama material
4. User isi qty (pcs dan kg)
5. User pilih tanggal dan sumber
6. Sistem simpan data penerimaan
7. Sistem buat stock_history (MASUK)

---

### AD-06: Catat Penyaluran

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Mencatat penyaluran LPG ke pangkalan |
| **Aktor** | Admin, Operator |
| **Pre-kondisi** | Ada stok agen |
| **Post-kondisi** | Data penyaluran tersimpan |

**Alur Utama:**
1. User buka halaman Penyaluran
2. User pilih bulan dan tipe LPG
3. Sistem tampilkan grid (pangkalan x tanggal)
4. User input jumlah normal dan fakultatif
5. User pilih tipe pembayaran (CASH/CASHLESS)
6. Sistem simpan/update penyaluran_harian
7. Sistem buat stock_history (KELUAR)

---

### AD-07: Catat Penjualan (Pangkalan)

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Mencatat penjualan LPG ke konsumen |
| **Aktor** | Pangkalan |
| **Pre-kondisi** | Stok pangkalan mencukupi |
| **Post-kondisi** | Penjualan tercatat, stok berkurang |

**Alur Utama:**
1. Pangkalan buka halaman Penjualan
2. Pangkalan pilih konsumen atau isi nama (walk-in)
3. Pangkalan pilih jenis LPG dan jumlah
4. Sistem cek ketersediaan stok
5. Sistem hitung total harga
6. Pangkalan konfirmasi penjualan
7. Sistem simpan consumer_order
8. Sistem kurangi pangkalan_stocks
9. Sistem buat stock_movement (KELUAR)

---

### AD-08: Buat Order ke Agen (Pangkalan)

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | Pangkalan memesan LPG ke agen |
| **Aktor** | Pangkalan |
| **Pre-kondisi** | Pangkalan terhubung ke agen |
| **Post-kondisi** | Order terkirim dengan status PENDING |

**Alur Utama:**
1. Pangkalan buka menu "Order ke Agen"
2. Pangkalan pilih jenis LPG
3. Pangkalan masukkan jumlah order
4. Sistem simpan agen_order (status PENDING)
5. Tunggu konfirmasi dari agen

---

### AD-09: Kelola Pangkalan

| Komponen | Deskripsi |
|----------|-----------|
| **Tujuan** | CRUD data pangkalan |
| **Aktor** | Admin |
| **Pre-kondisi** | - |
| **Post-kondisi** | Data pangkalan tersimpan/terupdate |

**Aksi:**
- **Tambah**: Buat pangkalan baru + auto-create user PANGKALAN (jika ada kredensial)
- **Edit**: Update data pangkalan
- **Hapus**: Soft delete pangkalan

---

### AD-10 s/d AD-25: Diagram Pendukung

| AD-ID | Deskripsi Singkat |
|-------|-------------------|
| AD-10 | Ubah password dengan verifikasi password lama |
| AD-11 | CRUD pengguna Admin/Operator |
| AD-12 | CRUD driver dengan kode DRV-XXX |
| AD-13 | CRUD produk LPG dengan harga |
| AD-14 | Assign driver ke pesanan |
| AD-15 | Lihat detail pesanan dengan timeline |
| AD-16 | Generate invoice dari pesanan |
| AD-17 | Cetak atau download nota PDF |
| AD-18 | Kelola perencanaan alokasi bulanan |
| AD-19 | Lihat rekap stok masuk-keluar agen |
| AD-20 | CRUD konsumen pangkalan (NIK/KK) |
| AD-21 | Kelola stok pangkalan dengan penyesuaian manual |
| AD-22 | Konfirmasi terima order dari agen, update stok |
| AD-23 | CRUD pengeluaran operasional pangkalan |
| AD-24 | Generate laporan (penjualan/pembayaran/stok) |
| AD-25 | Export laporan ke Excel |

---

## 5. MATRIKS AKTOR & ACTIVITY

| Activity | Admin | Operator | Pangkalan |
|----------|:-----:|:--------:|:---------:|
| AD-01 Login | ✅ | ✅ | ✅ |
| AD-02 Buat Pesanan | ✅ | ✅ | ❌ |
| AD-03 Update Status | ✅ | ✅ | ❌ |
| AD-04 Catat Pembayaran | ✅ | ✅ | ❌ |
| AD-05 Catat Penerimaan | ✅ | ✅ | ❌ |
| AD-06 Catat Penyaluran | ✅ | ✅ | ❌ |
| AD-07 Catat Penjualan | ❌ | ❌ | ✅ |
| AD-08 Order ke Agen | ❌ | ❌ | ✅ |
| AD-09 Kelola Pangkalan | ✅ | ❌ | ❌ |
| AD-10 Ubah Password | ✅ | ✅ | ✅ |
| AD-11 Kelola Pengguna | ✅ | ❌ | ❌ |
| AD-12 Kelola Supir | ✅ | ❌ | ❌ |
| AD-13 Kelola Produk | ✅ | ❌ | ❌ |
| AD-14 Assign Driver | ✅ | ✅ | ❌ |
| AD-15 Lihat Detail | ✅ | ✅ | ❌ |
| AD-16 Generate Invoice | ✅ | ✅ | ❌ |
| AD-17 Cetak Nota | ✅ | ✅ | ❌ |
| AD-18 Perencanaan | ✅ | ✅ | ❌ |
| AD-19 In-Out Agen | ✅ | ✅ | ❌ |
| AD-20 Kelola Konsumen | ❌ | ❌ | ✅ |
| AD-21 Stok Pangkalan | ❌ | ❌ | ✅ |
| AD-22 Terima Order | ❌ | ❌ | ✅ |
| AD-23 Pengeluaran | ❌ | ❌ | ✅ |
| AD-24 Generate Laporan | ✅ | ✅ | ❌ |
| AD-25 Export Laporan | ✅ | ✅ | ❌ |

---

## 6. CATATAN PENTING

1. **Single-Session Login**: Sistem hanya mengizinkan 1 device aktif per user
2. **Auto-Sync Stok**: Saat pesanan SELESAI, stok pangkalan otomatis terupdate
3. **Soft Delete**: Data penting (user, pangkalan, produk) tidak benar-benar dihapus
4. **Multi-Tenant**: Pangkalan hanya bisa mengakses data miliknya sendiri
5. **Timeline Tracking**: Setiap perubahan status pesanan tercatat di timeline

---

*Dokumen ini menjelaskan 25 Activity Diagram SIM4LON*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*
