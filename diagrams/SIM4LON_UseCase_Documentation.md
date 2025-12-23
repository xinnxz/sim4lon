# DOKUMENTASI USE CASE DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Use Case Diagram ini menggambarkan interaksi antara pengguna (aktor) dengan sistem SIM4LON untuk mengelola distribusi gas LPG dari Agen ke Pangkalan hingga ke Konsumen akhir.

---

## 2. AKTOR

Sistem memiliki **3 aktor utama**:

| No | Aktor | Deskripsi | Hak Akses |
|----|-------|-----------|-----------|
| 1 | **Admin** | Administrator sistem | Full access ke semua fitur termasuk master data dan monitoring |
| 2 | **Operator** | Staff operasional agen | Akses operasional: pesanan, stok, pembayaran |
| 3 | **Pangkalan** | Pemilik/pengelola pangkalan LPG | Hanya akses data milik sendiri |

---

## 3. DAFTAR USE CASE

### 3.1 Use Case yang Diakses SEMUA AKTOR

| Use Case | Deskripsi |
|----------|-----------|
| **Login** | Masuk ke sistem dengan email dan password. Sistem menggunakan single-session (1 device per user). |
| **Kelola Profil** | Melihat dan mengubah data profil pengguna (nama, foto, no. telepon). |

### 3.2 Use Case ADMIN Only

| Use Case | Deskripsi |
|----------|-----------|
| **Kelola Pengguna** | CRUD data pengguna (Admin, Operator). Termasuk aktivasi/nonaktifkan akun. |
| **Kelola Pangkalan** | CRUD data pangkalan. Dapat membuat akun login untuk pangkalan baru. |
| **Kelola Supir** | CRUD data driver/sopir yang bertugas mengirim LPG ke pangkalan. |
| **Lihat Log Aktivitas** | Memonitor seluruh aktivitas sistem untuk keperluan audit. |
| **Kelola Perencanaan** | Membuat perencanaan alokasi LPG bulanan untuk setiap pangkalan. |

### 3.3 Use Case ADMIN + OPERATOR

| Use Case | Deskripsi |
|----------|-----------|
| **Kelola Dashboard** | Melihat ringkasan KPI: pesanan hari ini, stok, pendapatan. |
| **Kelola Pesanan** | Mengelola pesanan LPG dari pangkalan. |
| **Buat Pesanan** | Membuat pesanan baru *(include dari Kelola Pesanan)*. |
| **Lihat Pesanan** | Melihat daftar dan detail pesanan *(include dari Kelola Pesanan)*. |
| **Update Status** | Mengubah status pesanan: DRAFT → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI. |
| **Assign Driver** | Menugaskan driver ke pesanan *(extend dari Update Status)*. |
| **Kelola Pembayaran** | Mencatat pembayaran dari pangkalan (tunai/transfer). |
| **Cetak Nota** | Mencetak nota/invoice untuk pangkalan *(extend dari Kelola Pembayaran)*. |
| **Kelola Stok** | Mengelola stok LPG agen. |
| **Catat Penerimaan** | Mencatat stok masuk dari SPBE *(include dari Kelola Stok)*. |
| **Catat Penyaluran** | Mencatat stok keluar ke pangkalan *(include dari Kelola Stok)*. |
| **Kelola Laporan** | Melihat dan mengunduh berbagai laporan (penjualan, stok, pembayaran). |

### 3.4 Use Case PANGKALAN Only

| Use Case | Deskripsi |
|----------|-----------|
| **Kelola Penjualan** | Mencatat penjualan LPG ke konsumen akhir. |
| **Kelola Konsumen** | CRUD data konsumen (nama, NIK, KK untuk verifikasi subsidi). |
| **Buat Order ke Agen** | Membuat pesanan LPG ke agen untuk mengisi stok pangkalan. |

---

## 4. RELASI ANTAR USE CASE

### 4.1 Include Relationships
**Include** artinya use case utama **selalu membutuhkan** use case yang di-include.

| Use Case Utama | Include | Keterangan |
|----------------|---------|------------|
| Kelola Stok | → Catat Penerimaan | Setiap kelola stok pasti melibatkan pencatatan penerimaan |
| Kelola Stok | → Catat Penyaluran | Setiap kelola stok pasti melibatkan pencatatan penyaluran |
| Kelola Pesanan | → Buat Pesanan | Kelola pesanan mencakup membuat pesanan baru |
| Kelola Pesanan | → Lihat Pesanan | Kelola pesanan mencakup melihat daftar pesanan |

### 4.2 Extend Relationships
**Extend** artinya use case extension **opsional**, dipanggil hanya dalam kondisi tertentu.

| Use Case Utama | Extension Point | Use Case Extension | Kondisi |
|----------------|-----------------|-------------------|---------|
| Update Status | Assign Driver | Assign Driver | Ketika status berubah ke SIAP_KIRIM atau DIKIRIM |
| Kelola Pembayaran | Cetak Nota | Cetak Nota | Ketika user memilih untuk mencetak nota |

---

## 5. MATRIKS AKSES

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
| Kelola Pembayaran | ✅ | ✅ | ❌ |
| Kelola Stok | ✅ | ✅ | ❌ |
| Kelola Laporan | ✅ | ✅ | ❌ |
| Kelola Penjualan | ❌ | ❌ | ✅ |
| Kelola Konsumen | ❌ | ❌ | ✅ |
| Buat Order ke Agen | ❌ | ❌ | ✅ |

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
