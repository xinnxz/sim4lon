# DOKUMENTASI USE CASE DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Use Case Diagram ini menggambarkan interaksi antara pengguna (aktor) dengan sistem SIM4LON untuk mengelola distribusi gas LPG dari Agen ke Pangkalan hingga ke Konsumen akhir.

**Total Use Case: 18 buah**

---

## 2. AKTOR

Sistem memiliki **3 aktor utama**:

| No | Aktor | Deskripsi | Hak Akses |
|----|-------|-----------|-----------|
| 1 | **Admin** | Administrator sistem | Full access ke semua fitur termasuk master data dan monitoring |
| 2 | **Operator** | Staff operasional agen | Akses operasional: pesanan, stok, pembayaran |
| 3 | **Pangkalan** | Pemilik/pengelola pangkalan LPG | Hanya akses data milik sendiri |

---

## 3. DAFTAR USE CASE (18 Use Case)

### 3.1 Use Case yang Diakses SEMUA AKTOR

| No | Use Case | Deskripsi |
|----|----------|-----------|
| 1 | **Login** | Masuk ke sistem dengan email dan password. Sistem menggunakan single-session (1 device per user). |
| 2 | **Kelola Profil** | Melihat dan mengubah data profil pengguna (nama, foto, no. telepon). |

### 3.2 Use Case ADMIN Only

| No | Use Case | Deskripsi |
|----|----------|-----------|
| 3 | **Kelola Pengguna** | CRUD data pengguna (Admin, Operator). Termasuk aktivasi/nonaktifkan akun. |
| 4 | **Kelola Pangkalan** | CRUD data pangkalan. Dapat membuat akun login untuk pangkalan baru. |
| 5 | **Kelola Supir** | CRUD data driver/sopir yang bertugas mengirim LPG ke pangkalan. |
| 6 | **Lihat Log Aktivitas** | Memonitor seluruh aktivitas sistem untuk keperluan audit. |
| 7 | **Kelola Perencanaan** | Membuat perencanaan alokasi LPG bulanan untuk setiap pangkalan. |

### 3.3 Use Case ADMIN + OPERATOR

| No | Use Case | Deskripsi |
|----|----------|-----------|
| 8 | **Kelola Dashboard** | Melihat ringkasan KPI: pesanan hari ini, stok, pendapatan. |
| 9 | **Kelola Pesanan** | Mengelola pesanan LPG dari pangkalan (buat, lihat, edit, hapus). |
| 10 | **Update Status** | Mengubah status pesanan: DRAFT → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI. Extension point: Assign Driver. |
| 11 | **Assign Driver** | Menugaskan driver ke pesanan *(extend dari Update Status)*. |
| 12 | **Kelola Pembayaran** | Mencatat pembayaran dari pangkalan (tunai/transfer). Extension point: Cetak Nota. |
| 13 | **Cetak Nota** | Mencetak nota/invoice untuk pangkalan *(extend dari Kelola Pembayaran)*. |
| 14 | **Kelola Stok** | Mengelola stok LPG agen (penerimaan dari SPBE, penyaluran ke pangkalan). |
| 15 | **Kelola Laporan** | Melihat dan mengunduh berbagai laporan (penjualan, stok, pembayaran). |

### 3.4 Use Case PANGKALAN Only

| No | Use Case | Deskripsi |
|----|----------|-----------|
| 16 | **Kelola Penjualan** | Mencatat penjualan LPG ke konsumen akhir. |
| 17 | **Kelola Konsumen** | CRUD data konsumen (nama, NIK, KK untuk verifikasi subsidi). |
| 18 | **Buat Order ke Agen** | Membuat pesanan LPG ke agen untuk mengisi stok pangkalan. |

---

## 4. RELASI ANTAR USE CASE

### 4.1 Include Relationships
**Include** artinya use case utama **selalu membutuhkan** use case yang di-include.

| Use Case Utama | Include | Keterangan |
|----------------|---------|------------|
| Kelola Pesanan | → Update Status | Setiap kelola pesanan pasti membutuhkan update status |

### 4.2 Extend Relationships
**Extend** artinya use case extension **opsional**, dipanggil hanya dalam kondisi tertentu.

| Use Case Utama | Extension Point | Use Case Extension | Kondisi |
|----------------|-----------------|-------------------|---------|
| Update Status | Assign Driver | Assign Driver | Ketika status berubah ke SIAP_KIRIM atau DIKIRIM |
| Kelola Pembayaran | Cetak Nota | Cetak Nota | Ketika user memilih untuk mencetak nota |

---

## 5. MATRIKS AKSES

| No | Use Case | Admin | Operator | Pangkalan |
|----|----------|:-----:|:--------:|:---------:|
| 1 | Login | ✅ | ✅ | ✅ |
| 2 | Kelola Profil | ✅ | ✅ | ✅ |
| 3 | Kelola Pengguna | ✅ | ❌ | ❌ |
| 4 | Kelola Pangkalan | ✅ | ❌ | ❌ |
| 5 | Kelola Supir | ✅ | ❌ | ❌ |
| 6 | Lihat Log Aktivitas | ✅ | ❌ | ❌ |
| 7 | Kelola Perencanaan | ✅ | ❌ | ❌ |
| 8 | Kelola Dashboard | ✅ | ✅ | ❌ |
| 9 | Kelola Pesanan | ✅ | ✅ | ❌ |
| 10 | Update Status | ✅ | ✅ | ❌ |
| 11 | Assign Driver | ✅ | ✅ | ❌ |
| 12 | Kelola Pembayaran | ✅ | ✅ | ❌ |
| 13 | Cetak Nota | ✅ | ✅ | ❌ |
| 14 | Kelola Stok | ✅ | ✅ | ❌ |
| 15 | Kelola Laporan | ✅ | ✅ | ❌ |
| 16 | Kelola Penjualan | ❌ | ❌ | ✅ |
| 17 | Kelola Konsumen | ❌ | ❌ | ✅ |
| 18 | Buat Order ke Agen | ❌ | ❌ | ✅ |

---

## 6. ALUR STATUS PESANAN

```
DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
                                              ↓
                                        [Assign Driver]
```

---

## 7. CATATAN PENTING

1. **Single-Session Login**: Hanya 1 device aktif per user
2. **Multi-Tenant**: Pangkalan hanya melihat data miliknya
3. **Audit Trail**: Semua aktivitas dicatat di Log Aktivitas
4. **Extension Points**: Ditampilkan dalam use case (Assign Driver, Cetak Nota)

---

*Dokumen ini menjelaskan Use Case Diagram SIM4LON*  
*Sistem Informasi Manajemen LPG 4 Jalur Online*
