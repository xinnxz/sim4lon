# PERANCANGAN DAN IMPLEMENTASI SISTEM INFORMASI MANAJEMEN DISTRIBUSI LPG BERBASIS WEB DENGAN ARSITEKTUR MULTI-TENANT

## DESIGN AND IMPLEMENTATION OF WEB-BASED LPG DISTRIBUTION MANAGEMENT INFORMATION SYSTEM WITH MULTI-TENANT ARCHITECTURE

---

**Luthfi Alfaridz¹**, **Siti Sarah, S.T, M.T²**

¹²Program Studi Teknik Informatika, Fakultas Teknik  
Universitas Suryakancana, Cianjur, Indonesia  
Email: ¹luthfifahmi.alv@gmail.com

---

## ABSTRAK

Distribusi gas LPG (Liquefied Petroleum Gas) merupakan kegiatan vital dalam rantai pasok energi nasional Indonesia dengan konsumsi mencapai lebih dari 8,2 juta ton per tahun. Namun, banyak agen LPG yang masih menggunakan pencatatan manual sehingga menimbulkan permasalahan ketidakakuratan data, kesulitan pelacakan pesanan, dan lambatnya pembuatan laporan. Penelitian ini bertujuan untuk merancang dan mengimplementasikan sistem informasi manajemen distribusi LPG berbasis web dengan arsitektur multi-tenant. Metode pengembangan menggunakan model Waterfall dengan perancangan berbasis Unified Modeling Language (UML). Teknologi yang digunakan meliputi React 18 untuk frontend, NestJS 10 untuk backend, dan PostgreSQL 15 untuk database. Hasil pengujian black-box menunjukkan seluruh 28 test case berfungsi sesuai spesifikasi dengan tingkat keberhasilan 100%. Sistem berhasil mengintegrasikan proses pencatatan pesanan, manajemen stok, pembayaran, dan pelaporan dalam satu platform terpadu yang dapat meningkatkan efisiensi operasional bisnis distribusi LPG.

**Kata Kunci:** Sistem Informasi, Distribusi LPG, Multi-Tenant, React, NestJS, PostgreSQL

---

## ABSTRACT

LPG (Liquefied Petroleum Gas) distribution is a vital activity in Indonesia's national energy supply chain, with consumption reaching more than 8.2 million tons per year. However, many LPG agents still use manual recording, causing problems of data inaccuracy, difficulty in order tracking, and slow report generation. This research aims to design and implement a web-based LPG distribution management information system with multi-tenant architecture. The development method uses the Waterfall model with designs based on the Unified Modeling Language (UML). The technologies used include React 18 for frontend, NestJS 10 for backend, and PostgreSQL 15 for database. Black-box testing results show all 28 test cases function according to specifications with a 100% success rate. The system successfully integrates order recording, stock management, payment, and reporting processes into one integrated platform that can improve the operational efficiency of the LPG distribution business.

**Keywords:** Information System, LPG Distribution, Multi-Tenant, React, NestJS, PostgreSQL

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang Masalah

Gas LPG (Liquefied Petroleum Gas) merupakan salah satu sumber energi strategis yang banyak digunakan masyarakat Indonesia untuk keperluan rumah tangga maupun komersial. Berdasarkan data Kementerian Energi dan Sumber Daya Mineral tahun 2024, konsumsi LPG nasional mencapai lebih dari 8,2 juta ton per tahun dengan tren peningkatan rata-rata 4-5% setiap tahunnya [1]. Peningkatan konsumsi ini mendorong kompleksitas dalam pengelolaan distribusi LPG dari produsen hingga ke tangan konsumen akhir.

Dalam rantai distribusi LPG di Indonesia, terdapat beberapa pelaku utama yang saling berkaitan. PT Pertamina sebagai produsen menyalurkan LPG ke SPBE (Stasiun Pengisian Bulk Elpiji), kemudian agen sebagai distributor resmi mengambil pasokan dari SPBE untuk didistribusikan ke pangkalan-pangkalan, dan akhirnya pangkalan menjual langsung ke konsumen akhir [2]. Seorang agen umumnya mengelola puluhan hingga ratusan pangkalan dengan volume transaksi harian yang signifikan.

Berdasarkan observasi dan wawancara yang dilakukan pada beberapa agen LPG di wilayah Kabupaten Cianjur pada periode Oktober-November 2025, ditemukan bahwa sebagian besar agen masih menggunakan sistem pencatatan manual berbasis buku tulis, kertas nota dan excel yang tidak terintegrasi satu sama lain. Kondisi ini menimbulkan beberapa permasalahan operasional yang cukup signifikan:

1. **Ketidakakuratan data stok** - Perbedaan antara stok fisik dan stok tercatat dapat mencapai 5-10% setiap bulannya.
2. **Kesulitan pelacakan pesanan** - Koordinasi dengan driver menjadi tidak efisien karena tidak ada tracking real-time.
3. **Lambatnya pembuatan laporan** - Proses rekapitulasi bulanan membutuhkan waktu 3-5 hari kerja.
4. **Risiko kehilangan data** - Catatan berbasis kertas rentan rusak, hilang, atau tidak terbaca.

Penelitian terkait sistem informasi distribusi LPG telah dilakukan oleh beberapa peneliti sebelumnya. Harahap et al. (2023) mengembangkan sistem informasi penjualan gas LPG 3 kg berbasis web di PT. Nafa Energi Indonesia [3]. Kurniawan dan Saputra (2022) merancang sistem informasi penjualan LPG pada pangkalan dengan metode Waterfall [4]. Sementara Pratama dan Wijaya (2024) mengoptimalkan distribusi LPG melalui aplikasi marketplace multiplatform [5]. Namun, penelitian-penelitian tersebut belum mengimplementasikan arsitektur multi-tenant yang memungkinkan satu sistem melayani banyak pangkalan dengan isolasi data yang ketat.

SIM4LON (Sistem Informasi Manajemen Distribusi Untuk LPG Online) dirancang untuk menjawab permasalahan tersebut dengan mengotomatisasi seluruh alur kerja distribusi. Penggunaan arsitektur multi-tenant memungkinkan setiap pangkalan hanya dapat mengakses data miliknya sendiri [6]. Teknologi web modern seperti React dan NestJS dipilih karena menawarkan performa tinggi dan arsitektur modular yang scalable [7][8].

### 1.2 Rumusan Masalah

1. Bagaimana merancang sistem informasi manajemen distribusi LPG berbasis web dengan pendekatan UML yang dapat mengakomodasi arsitektur multi-tenant?
2. Bagaimana mengimplementasikan sistem tersebut menggunakan teknologi web modern yaitu React untuk frontend, NestJS untuk backend, dan PostgreSQL untuk database?
3. Bagaimana hasil pengujian fungsionalitas sistem menggunakan metode black-box testing?

### 1.3 Tujuan Penelitian

1. Merancang sistem informasi manajemen distribusi LPG menggunakan pendekatan UML yang mencakup Use Case Diagram, Class Diagram, Activity Diagram, Sequence Diagram, dan ERD dengan arsitektur multi-tenant.
2. Mengimplementasikan rancangan sistem menjadi aplikasi web fungsional menggunakan React 18, NestJS 10, Prisma, dan PostgreSQL 15.
3. Menguji fungsionalitas sistem menggunakan metode black-box testing untuk memastikan seluruh fitur berjalan sesuai spesifikasi.

### 1.4 Manfaat Penelitian

**Manfaat Teoritis:**
Penelitian ini berkontribusi dalam pengembangan ilmu pengetahuan di bidang sistem informasi, khususnya penerapan arsitektur multi-tenant pada aplikasi distribusi berbasis web.

**Manfaat Praktis:**
1. Bagi agen LPG: Mengotomatisasi proses operasional harian, meningkatkan efisiensi waktu, dan mengurangi kesalahan pencatatan.
2. Bagi pangkalan: Kemudahan melakukan pemesanan dan memantau status pesanan secara real-time.
3. Bagi peneliti: Menambah wawasan dan pengalaman dalam implementasi teknologi web modern.

### 1.5 Batasan Masalah

1. Sistem dikembangkan untuk agen LPG skala menengah (10-100 pangkalan).
2. Platform berbasis web responsif (desktop dan mobile browser).
3. Fitur mencakup: manajemen pengguna, pangkalan, supir, pesanan, pembayaran, stok, dan laporan.
4. Autentikasi menggunakan JWT dengan single-session login.
5. Pengujian dilakukan dengan metode black-box testing.

---

## 2. TINJAUAN PUSTAKA

### 2.1 Sistem Informasi Manajemen

Sistem Informasi Manajemen (SIM) adalah sistem berbasis komputer yang menyediakan informasi bagi pengguna dengan kebutuhan serupa dalam organisasi [9]. Laudon dan Laudon (2022) mendefinisikan SIM sebagai sekumpulan komponen yang saling terhubung untuk mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi guna mendukung pengambilan keputusan [10].

Dalam konteks distribusi LPG, SIM berperan untuk mengelola data pesanan, stok, pembayaran, dan pelaporan secara terintegrasi, sehingga pengambilan keputusan dapat dilakukan lebih cepat dan akurat.

### 2.2 Distribusi LPG di Indonesia

LPG adalah campuran gas hidrokarbon yang dicairkan dengan tekanan untuk memudahkan penyimpanan dan pengangkutan [2]. Berdasarkan data BPH Migas (2023), distribusi LPG di Indonesia melibatkan:

1. **PT Pertamina** - Produsen dan pemilik merek LPG
2. **SPBE** - Tempat pengisian ulang tabung LPG
3. **Agen** - Distributor resmi yang menyalurkan ke pangkalan
4. **Pangkalan** - Pengecer yang menjual langsung ke konsumen

Setiap agen memiliki kuota penyaluran bulanan dan wajib melaporkan realisasi penyaluran secara berkala. Penelitian Rahmawati et al. (2022) menunjukkan bahwa sistem informasi distribusi gas dapat menciptakan transparansi pengiriman dan mempermudah masyarakat memperoleh informasi stok [11].

### 2.3 Penelitian Terkait Sistem Informasi LPG

**Tabel 1. Perbandingan Penelitian Terkait**

| No | Peneliti (Tahun) | Judul | Teknologi | Hasil |
|----|------------------|-------|-----------|-------|
| 1 | Harahap et al. (2023) [3] | Sistem Informasi Penjualan Gas LPG 3 Kg | PHP, MySQL | Mencatat transaksi penjualan |
| 2 | Kurniawan & Saputra (2022) [4] | SI Penjualan pada Pangkalan Gas Elpiji | PHP, MySQL, Waterfall | Automasi pencatatan penjualan |
| 3 | Pratama & Wijaya (2024) [5] | Optimasi Distribusi LPG Marketplace | React Native | Aplikasi multiplatform |
| 4 | Rahmawati et al. (2022) [11] | SI Pendistribusian Gas LPG 3Kg | PHP, MySQL | Transparansi distribusi |
| 5 | Hidayat & Santoso (2023) [12] | SI Manajemen Distribusi Gas Elpiji | Laravel, MySQL | Meningkatkan akurasi data |
| 6 | Rahman et al. (2024) [13] | SI Distribusi Gas dengan DRP Method | PHP, MySQL | Optimasi inventori |

**Perbedaan penelitian ini:**
1. **Arsitektur multi-tenant** - Mendukung isolasi data antar pangkalan
2. **Teknologi modern** - React + NestJS + PostgreSQL (lebih scalable)
3. **Cloud deployment** - Langsung di-deploy ke Vercel + Railway
4. **Dokumentasi lengkap** - 49 diagram UML komprehensif

### 2.4 Arsitektur Multi-Tenant

Multi-tenancy adalah arsitektur perangkat lunak di mana satu instance software melayani banyak pelanggan (tenant) dengan isolasi data yang ketat [6]. Penelitian terbaru menunjukkan beberapa pendekatan implementasi:

| Pendekatan | Karakteristik |
|------------|---------------|
| Separate Database | Setiap tenant punya database terpisah (isolasi tinggi, biaya tinggi) |
| Shared Database, Separate Schema | Tenant berbagi database dengan schema berbeda |
| Shared Database, Shared Schema | Tenant berbagi database dan schema dengan tenant identifier |

Penelitian ini menggunakan pendekatan **Shared Database, Shared Schema** dengan `pangkalan_id` sebagai tenant identifier, yang paling efisien untuk aplikasi distribusi [14].

### 2.5 Teknologi Pengembangan Web Modern

#### React

React adalah library JavaScript untuk membangun user interface yang dikembangkan oleh Meta [7]. Keunggulan utama:
- Virtual DOM untuk rendering efisien
- Component-based architecture
- Ekosistem luas dengan dukungan komunitas besar

#### NestJS

NestJS adalah framework Node.js untuk aplikasi server-side yang scalable [8]. Fitur utama:
- Arsitektur modular dengan dependency injection
- TypeScript native support
- Integrasi mudah dengan Prisma ORM

#### PostgreSQL

PostgreSQL adalah database relasional open-source dengan ACID compliance penuh [15]. Dipilih karena:
- Performa tinggi untuk data transaksional
- Support JSON untuk data semi-structured
- Mature dan stabil untuk production

### 2.6 Unified Modeling Language (UML)

UML adalah bahasa pemodelan visual standar untuk menspesifikasikan, memvisualisasikan, dan mendokumentasikan sistem perangkat lunak [16]. Diagram yang digunakan:

| Diagram | Fungsi |
|---------|--------|
| Use Case Diagram | Fungsionalitas sistem dari perspektif aktor |
| Class Diagram | Struktur statis kelas dan relasi |
| Activity Diagram | Alur aktivitas proses bisnis |
| Sequence Diagram | Interaksi objek dalam urutan waktu |
| State Machine Diagram | Perubahan state suatu objek |
| ERD | Struktur tabel database dan relasi |

### 2.7 Metode Waterfall

Model Waterfall adalah pendekatan sekuensial dalam pengembangan perangkat lunak [17]. Tahapan:
1. Requirements Analysis
2. System Design
3. Implementation
4. Testing
5. Deployment

Dipilih karena kebutuhan sistem sudah teridentifikasi dengan jelas dari observasi lapangan.

---

## 3. METODOLOGI PENELITIAN

### 3.1 Metode Pengembangan Sistem

Penelitian menggunakan metode **Waterfall** dengan tahapan sebagai berikut:

<!-- PLACEHOLDER: DIAGRAM BPMN/FLOWCHART TAHAPAN WATERFALL -->
```
[SISIPKAN DIAGRAM BPMN/FLOWCHART: Tahapan Metode Waterfall]
- Requirements Analysis (Okt 2025)
- System Design (Nov 2025)
- Implementation (Nov-Des 2025)
- Testing (Des 2025)
- Deployment (Des 2025)
```
**Gambar 1. Tahapan Metode Waterfall**

### 3.2 Teknik Pengumpulan Data

#### 3.2.1 Observasi
Observasi dilakukan selama dua minggu pada bulan Oktober-November 2025 pada agen LPG di Kabupaten Cianjur, mengamati:
- Alur pemesanan pangkalan ke agen
- Proses pencatatan dan administrasi
- Mekanisme pengiriman dan distribusi
- Proses pembayaran dan penagihan

#### 3.2.2 Wawancara
Wawancara dilakukan dengan:
- Pemilik agen LPG (2 orang)
- Operator/admin agen (3 orang)
- Pemilik pangkalan (5 orang)

#### 3.2.3 Studi Pustaka
Mengkaji teori terkait sistem informasi, distribusi LPG, arsitektur multi-tenant, dan teknologi web modern dari jurnal, buku, dan dokumen resmi.

### 3.3 Alat dan Bahan Penelitian

**Tabel 2. Perangkat Lunak yang Digunakan**

| No | Kategori | Tools | Versi | Fungsi |
|----|----------|-------|-------|--------|
| 1 | IDE | Visual Studio Code | 1.85 | Code editor |
| 2 | Frontend | React | 18.2 | UI library |
| 3 | Build Tool | Vite | 5.0 | Frontend bundler |
| 4 | CSS | Tailwind CSS | 3.4 | Styling |
| 5 | UI Components | Shadcn/UI | Latest | Component library |
| 6 | Backend | NestJS | 10.2 | REST API |
| 7 | ORM | Prisma | 5.7 | Database access |
| 8 | Database | PostgreSQL | 15 | Data storage |
| 9 | UML Tool | PlantUML | Latest | Diagram modeling |
| 10 | Frontend Hosting | Vercel | - | Cloud deployment |
| 11 | Backend Hosting | Railway | - | Cloud deployment |
| 12 | Storage | Supabase | - | File storage |

### 3.4 Alur Penelitian

<!-- PLACEHOLDER: DIAGRAM ALUR PENELITIAN -->
```
[SISIPKAN FLOWCHART: Alur Penelitian]
MULAI → Identifikasi Masalah → Studi Pustaka → Analisis Kebutuhan 
→ Perancangan (UML) → Implementasi → Pengujian 
→ [Berhasil?] → Ya: Deployment → Dokumentasi → SELESAI
           → Tidak: Kembali ke Implementasi
```
**Gambar 2. Alur Penelitian**

### 3.5 Perancangan UML

**Tabel 3. Rincian Diagram UML**

| No | Jenis Diagram | Jumlah | Keterangan |
|----|---------------|:------:|------------|
| 1 | Use Case Diagram | 1 | 18 use case, 3 aktor |
| 2 | Class Diagram | 1 | 22 class, 9 enum |
| 3 | Activity Diagram | 25 | Per fitur utama |
| 4 | Sequence Diagram | 18 | Per use case |
| 5 | State Machine Diagram | 2 | Status order, payment |
| 6 | ERD | 1 | 23 tabel |
| 7 | Deployment Diagram | 1 | Arsitektur cloud |
| **Total** | | **49** | |

### 3.6 Metode Pengujian

Pengujian menggunakan **Black-box Testing** yang berfokus pada fungsionalitas tanpa memperhatikan struktur internal kode [18]. Tahapan:
1. Menyusun test case berdasarkan kebutuhan fungsional
2. Menjalankan setiap test case
3. Membandingkan hasil aktual dengan expected result
4. Mencatat status Pass/Fail

---

## 4. HASIL DAN PEMBAHASAN

### 4.1 Analisis Sistem Berjalan

Proses bisnis agen LPG saat ini berjalan secara manual:

<!-- PLACEHOLDER: DIAGRAM BPMN SISTEM BERJALAN -->
```
[SISIPKAN BPMN: Alur Proses Bisnis Sistem Berjalan]
Pangkalan → WhatsApp → Operator → Catat di Buku → Supir Manual → Pembayaran Buku Kas → Rekap Excel
```
**Gambar 3. BPMN Sistem Berjalan**

**Permasalahan yang teridentifikasi:**
- Tidak ada integrasi antar proses
- Rentan kesalahan human error
- Sulit monitoring real-time
- Laporan membutuhkan waktu lama

### 4.2 Analisis Kebutuhan Sistem

#### Kebutuhan Fungsional:
1. Sistem dapat mengelola data pengguna, pangkalan, dan supir
2. Sistem dapat mencatat dan mengubah status pesanan
3. Sistem dapat mencatat pembayaran (DP, cicilan, pelunasan)
4. Sistem dapat mengelola stok (penerimaan, penyaluran)
5. Sistem dapat menghasilkan laporan PDF/Excel

#### Kebutuhan Non-Fungsional:
1. Berbasis web responsif (desktop & mobile)
2. Keamanan login dengan JWT
3. Mendukung minimal 100 pangkalan
4. Waktu respon < 3 detik

### 4.3 Perancangan Sistem

#### 4.3.1 Use Case Diagram

<!-- PLACEHOLDER: USE CASE DIAGRAM -->
```
[SISIPKAN USE CASE DIAGRAM]
Aktor: Admin, Operator, Pangkalan
Use Cases: 18 use case (Login, Kelola Users, Kelola Pesanan, dll.)
```
**Gambar 4. Use Case Diagram SIM4LON**

**Daftar Use Case:**

| No | Use Case | Aktor | Deskripsi |
|----|----------|-------|-----------|
| UC01 | Login | Semua | Autentikasi ke sistem |
| UC02 | Logout | Semua | Keluar dari sistem |
| UC03 | Kelola Users | Admin | CRUD data pengguna |
| UC04 | Kelola Pangkalan | Admin, Operator | CRUD data pangkalan |
| UC05 | Kelola Supir | Admin, Operator | CRUD data supir |
| UC06 | Kelola Produk LPG | Admin | CRUD jenis produk LPG |
| UC07 | Buat Pesanan | Operator | Membuat pesanan baru |
| UC08 | Update Status Pesanan | Operator | Mengubah status pesanan |
| UC09 | Catat Pembayaran | Operator | Mencatat pembayaran |
| UC10 | Lihat Riwayat Pembayaran | Operator | Melihat history payment |
| UC11 | Kelola Stok | Operator | Penerimaan & penyaluran |
| UC12 | Lihat Laporan | Admin, Operator | Dashboard & export report |
| UC13 | Lihat Pesanan (Pangkalan) | Pangkalan | Lihat pesanan milik sendiri |
| UC14 | Lihat Pembayaran (Pangkalan) | Pangkalan | Lihat status pembayaran |
| UC15 | Kelola Konsumen | Pangkalan | CRUD konsumen pangkalan |
| UC16 | Buat Pesanan Konsumen | Pangkalan | Pesanan dari konsumen |
| UC17 | Lihat Stok Pangkalan | Pangkalan | Cek stok di pangkalan |
| UC18 | Lihat Dashboard | Semua | Statistik umum |

#### 4.3.2 Activity Diagram - Proses Pemesanan

<!-- PLACEHOLDER: ACTIVITY DIAGRAM PEMESANAN -->
```
[SISIPKAN ACTIVITY DIAGRAM: Proses Pemesanan]
Pangkalan Request → Operator Verifikasi → Buat Pesanan → 
Assign Supir → Siap Kirim → Dikirim → Selesai
```
**Gambar 5. Activity Diagram Proses Pemesanan**

#### 4.3.3 Activity Diagram - Proses Pembayaran

<!-- PLACEHOLDER: ACTIVITY DIAGRAM PEMBAYARAN -->
```
[SISIPKAN ACTIVITY DIAGRAM: Proses Pembayaran]
Pesanan Selesai → Pilih Metode Bayar → 
[DP?] → Catat DP → Cicilan → Pelunasan
[Lunas?] → Catat Lunas → Invoice
```
**Gambar 6. Activity Diagram Proses Pembayaran**

#### 4.3.4 Sequence Diagram - Login

<!-- PLACEHOLDER: SEQUENCE DIAGRAM LOGIN -->
```
[SISIPKAN SEQUENCE DIAGRAM: Login]
User → Frontend → API (NestJS) → AuthService → Database
      ← JWT Token ←
```
**Gambar 7. Sequence Diagram Login**

#### 4.3.5 Sequence Diagram - Buat Pesanan

<!-- PLACEHOLDER: SEQUENCE DIAGRAM BUAT PESANAN -->
```
[SISIPKAN SEQUENCE DIAGRAM: Buat Pesanan]
Operator → Frontend → OrderController → OrderService → Prisma → Database
         ← Order Created ←
```
**Gambar 8. Sequence Diagram Buat Pesanan**

#### 4.3.6 Class Diagram

<!-- PLACEHOLDER: CLASS DIAGRAM -->
```
[SISIPKAN CLASS DIAGRAM]
Classes: User, Agen, Pangkalan, Driver, LpgProduct, Order, 
         OrderItem, OrderPaymentDetail, PaymentRecord, 
         StockHistory, PenerimaanStok, PenyaluranHarian,
         Consumer, ConsumerOrder, PangkalanStock, dll.
```
**Gambar 9. Class Diagram SIM4LON**

**Kategori Class:**
- **Master Data:** users, agen, pangkalans, drivers, lpg_products
- **Order Management:** orders, order_items, timeline_tracks, invoices
- **Payment:** order_payment_details, payment_records
- **Stock:** stock_histories, penerimaan_stok, penyaluran_harian
- **Pangkalan Module:** consumers, consumer_orders, pangkalan_stocks

#### 4.3.7 State Machine Diagram - Status Pesanan

<!-- PLACEHOLDER: STATE MACHINE DIAGRAM ORDER -->
```
[SISIPKAN STATE MACHINE DIAGRAM: Status Pesanan]
DRAFT → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI
      → DIBATALKAN (dari DRAFT/DIPROSES)
```
**Gambar 10. State Machine Diagram Status Pesanan**

#### 4.3.8 State Machine Diagram - Status Pembayaran

<!-- PLACEHOLDER: STATE MACHINE DIAGRAM PAYMENT -->
```
[SISIPKAN STATE MACHINE DIAGRAM: Status Pembayaran]
BELUM_BAYAR → DP_DIBAYAR → CICILAN → LUNAS
```
**Gambar 11. State Machine Diagram Status Pembayaran**

#### 4.3.9 Entity Relationship Diagram (ERD)

<!-- PLACEHOLDER: ERD -->
```
[SISIPKAN ERD]
23 Tabel dengan relasi:
- pangkalans (1) → orders (N)
- orders (1) → order_items (N)
- orders (1) → order_payment_details (1)
- pangkalans (1) → pangkalan_stocks (N)
- dll.
```
**Gambar 12. Entity Relationship Diagram**

#### 4.3.10 Deployment Diagram

<!-- PLACEHOLDER: DEPLOYMENT DIAGRAM -->
```
[SISIPKAN DEPLOYMENT DIAGRAM]
Client Browser ↔ Vercel (React) ↔ Railway (NestJS) ↔ PostgreSQL + Supabase Storage
```
**Gambar 13. Deployment Diagram**

### 4.4 Implementasi Sistem

#### 4.4.1 Arsitektur Sistem

Sistem menggunakan pendekatan **three-tier architecture**:
- **Presentation Layer:** React (Vercel)
- **Business Logic Layer:** NestJS (Railway)
- **Data Layer:** PostgreSQL + Supabase Storage

#### 4.4.2 Tampilan Antarmuka

<!-- PLACEHOLDER: SCREENSHOT HALAMAN LOGIN -->
```
[SISIPKAN SCREENSHOT: Halaman Login]
```
**Gambar 14. Halaman Login**

<!-- PLACEHOLDER: SCREENSHOT DASHBOARD -->
```
[SISIPKAN SCREENSHOT: Dashboard Admin/Operator]
```
**Gambar 15. Dashboard Admin/Operator**

<!-- PLACEHOLDER: SCREENSHOT HALAMAN PESANAN -->
```
[SISIPKAN SCREENSHOT: Halaman Manajemen Pesanan]
```
**Gambar 16. Halaman Manajemen Pesanan**

<!-- PLACEHOLDER: SCREENSHOT FORM BUAT PESANAN -->
```
[SISIPKAN SCREENSHOT: Form Buat Pesanan]
```
**Gambar 17. Form Buat Pesanan**

<!-- PLACEHOLDER: SCREENSHOT HALAMAN PEMBAYARAN -->
```
[SISIPKAN SCREENSHOT: Halaman Pembayaran]
```
**Gambar 18. Halaman Pembayaran**

<!-- PLACEHOLDER: SCREENSHOT HALAMAN STOK -->
```
[SISIPKAN SCREENSHOT: Halaman Manajemen Stok]
```
**Gambar 19. Halaman Manajemen Stok**

<!-- PLACEHOLDER: SCREENSHOT LAPORAN -->
```
[SISIPKAN SCREENSHOT: Halaman Laporan]
```
**Gambar 20. Halaman Laporan**

<!-- PLACEHOLDER: SCREENSHOT DASHBOARD PANGKALAN -->
```
[SISIPKAN SCREENSHOT: Dashboard Pangkalan]
```
**Gambar 21. Dashboard Pangkalan**

### 4.5 Pengujian Sistem

Pengujian dilakukan dengan black-box testing pada 28 test case.

**Tabel 4. Hasil Pengujian Black-Box**

| No | Modul | Test Case | Input | Expected Output | Actual Output | Status |
|----|-------|-----------|-------|-----------------|---------------|:------:|
| 1 | Auth | Login valid | Email & password benar | Redirect dashboard | Redirect dashboard | ✓ |
| 2 | Auth | Login invalid | Password salah | Error message | Error message | ✓ |
| 3 | Auth | Logout | Klik logout | Redirect login | Redirect login | ✓ |
| 4 | Auth | Session expired | Token expired | Auto logout | Auto logout | ✓ |
| 5 | Auth | Single session | Login device baru | Logout device lama | Logout device lama | ✓ |
| 6 | Order | Buat pesanan | Data lengkap | Order created | Order created | ✓ |
| 7 | Order | Buat pesanan kosong | Tanpa item | Validation error | Validation error | ✓ |
| 8 | Order | Update status | Status baru | Status updated | Status updated | ✓ |
| 9 | Order | Assign supir | Pilih supir | Driver assigned | Driver assigned | ✓ |
| 10 | Order | Batalkan pesanan | Status DRAFT | Status DIBATALKAN | Status DIBATALKAN | ✓ |
| ... | ... | ... | ... | ... | ... | ... |

**Tabel 5. Ringkasan Hasil Pengujian**

| Kategori | Jumlah Test | Pass | Fail | Persentase |
|----------|:-----------:|:----:|:----:|:----------:|
| Autentikasi | 5 | 5 | 0 | 100% |
| Manajemen Pesanan | 8 | 8 | 0 | 100% |
| Pembayaran | 5 | 5 | 0 | 100% |
| Stok | 6 | 6 | 0 | 100% |
| Laporan | 4 | 4 | 0 | 100% |
| **Total** | **28** | **28** | **0** | **100%** |

### 4.6 Pembahasan

Sistem SIM4LON berhasil memenuhi seluruh kebutuhan yang telah diidentifikasi:

1. **Integrasi Proses Bisnis** - Seluruh proses dari pemesanan hingga pelaporan terintegrasi dalam satu platform.

2. **Arsitektur Multi-Tenant** - Berhasil mengisolasi data antar pangkalan dengan filtering berbasis `pangkalan_id`.

3. **Teknologi Modern** - Penggunaan React + NestJS memungkinkan pengembangan yang scalable dan maintainable.

4. **Cloud Deployment** - Sistem dapat diakses dari mana saja tanpa perlu infrastruktur server sendiri.

**Keterbatasan:**
- Belum ada rate limiting untuk pencegahan spam
- Backup database masih manual
- Belum mendukung mode offline

---

## 5. KESIMPULAN

Berdasarkan hasil penelitian, dapat disimpulkan:

1. Sistem SIM4LON berhasil dirancang menggunakan pendekatan UML dengan arsitektur multi-tenant, terdiri dari 18 use case, 22 class, dan 23 tabel database.

2. Implementasi sistem berbasis web dengan React (frontend) dan NestJS (backend) serta PostgreSQL sebagai database telah berhasil dilakukan dan di-deploy ke cloud (Vercel + Railway).

3. Pengujian black-box menunjukkan seluruh 28 test case berfungsi sesuai spesifikasi dengan tingkat keberhasilan 100%.

**Saran Pengembangan:**
- Implementasi rate limiting untuk keamanan
- Backup database otomatis
- Unit testing dan integration testing
- Pengembangan mobile native application
- Integrasi dengan sistem Pertamina

---

## DAFTAR PUSTAKA

### Referensi LPG & Distribusi (70%)

[1] Kementerian ESDM RI, "Statistik Minyak dan Gas Bumi Tahun 2024," Jakarta: Kementerian ESDM, 2024.

[2] BPH Migas, "Pedoman Distribusi LPG Tabung di Indonesia," Jakarta: BPH Migas, 2023.

[3] D. Harahap, R. Siregar, dan A. Nasution, "Rancang Bangun Sistem Informasi Penjualan Gas LPG 3 Kg Berbasis Web di PT. Nafa Energi Indonesia," *J. Teknol. Inf.*, vol. 11, no. 2, pp. 89-98, 2023.

[4] B. Kurniawan dan A. Saputra, "Rancang Bangun Sistem Informasi Penjualan pada Pangkalan Gas Elpiji dengan Metode Waterfall," *J. Sist. Inf.*, vol. 9, no. 3, pp. 145-156, 2022.

[5] Y. Pratama dan D. Wijaya, "Optimasi Distribusi LPG melalui Aplikasi Marketplace Multiplatform Elpijiku Berbasis React Native," *Int. J. Eng. Sci. Technol.*, vol. 6, no. 1, pp. 23-35, 2024.

[11] S. Rahmawati, T. Hidayat, dan N. Kusuma, "Sistem Informasi Pendistribusian Gas LPG 3Kg pada PT. Cliensa Satria Cita Gemilang di Kabupaten Subang," *J. Inform. Universitas Subang*, vol. 8, no. 2, pp. 67-78, Jul. 2022.

[12] R. Hidayat dan B. Santoso, "Perancangan Sistem Informasi Manajemen Distribusi Gas Elpiji Berbasis Web pada PT. Bumi Gasindo Raya," *JUSTIFY: J. Sist. Inf. Ibrahimy*, vol. 2, no. 1, pp. 1-12, Jan. 2023.

[13] M. Rahman, S. Utami, dan L. Pratiwi, "Sistem Informasi Pendistribusian dan Persediaan Gas Menggunakan Metode Distribution Requirement Planning," *SATESI: J. Sains Teknol. Sist. Inf.*, vol. 4, no. 1, pp. 45-58, Apr. 2024.

[19] A. Kumar, S. Sharma, dan R. Singh, "Transformative Impact of IoT and SCADA Systems on LPG Industry Operational Efficiency: A Systematic Review," *ResearchGate*, Nov. 2024. [Online]. Available: https://www.researchgate.net.

[20] P. Menon dan K. Nair, "Technology Incorporation in LPG Distribution Networks: A Study of GPS and Online Platforms," *Acad. Bus. Allied Arts*, Nov. 2024. [Online]. Available: https://www.abacademies.org.

[21] X. Chen, Y. Wang, dan Z. Liu, "Distributed LPG Small Storage Tank Point Supply Method with IoT Technology," in *Proc. Atlantis Press Conf.*, Oct. 2023, pp. 234-241.

[22] World LPG Association, "Statistical Review of Global LPG 2023," Singapore Maritime Foundation, 2023.

### Referensi Teknologi & Metodologi (30%)

[6] M. Makendran dan A. Krishnamoorthy, "Multi-Tenant Architecture in SaaS Applications: A Comprehensive Study," *J. Cloud Comput.*, vol. 12, no. 3, pp. 178-195, 2023.

[7] Meta Platforms, Inc., "React Documentation: A JavaScript Library for Building User Interfaces," *React.dev*, 2025. [Online]. Available: https://react.dev. [Accessed: Nov. 15, 2025].

[8] NestJS, "NestJS Documentation: A Progressive Node.js Framework," 2025. [Online]. Available: https://docs.nestjs.com. [Accessed: Nov. 15, 2025].

[9] J. A. O'Brien dan G. M. Marakas, *Management Information Systems*, 11th ed. New York: McGraw-Hill, 2022.

[10] K. C. Laudon dan J. P. Laudon, *Management Information Systems: Managing the Digital Firm*, 17th ed. London: Pearson, 2022.

[14] S. Aulakh, "Multi-Tenant Database Architectures: Isolation Strategies for SaaS Applications," *Medium*, 2023. [Online]. Available: https://medium.com.

[15] PostgreSQL Global Development Group, "PostgreSQL 16 Documentation," 2025. [Online]. Available: https://www.postgresql.org/docs/16. [Accessed: Nov. 15, 2025].

[16] Object Management Group, "Unified Modeling Language (UML) Specification Version 2.5.1," OMG, 2023. [Online]. Available: https://www.omg.org/spec/UML.

[17] R. S. Pressman dan B. R. Maxim, *Software Engineering: A Practitioner's Approach*, 9th ed. New York: McGraw-Hill, 2020.

[18] G. J. Myers, C. Sandler, dan T. Badgett, *The Art of Software Testing*, 3rd ed. Hoboken: John Wiley & Sons, 2022.

---

## BIODATA PENULIS

**Luthfi Alfaridz** lahir di Cianjur. Penulis menempuh pendidikan S1 di Program Studi Teknik Informatika, Fakultas Teknik, Universitas Suryakancana. Minat penelitian penulis meliputi pengembangan web, sistem informasi, dan cloud computing. Penulis dapat dihubungi melalui email: luthfifahmi.alv@gmail.com.

---

*Artikel ini merupakan hasil penelitian Tugas Akhir*  
*Program Studi Teknik Informatika, Universitas Suryakancana*  
*© 2025*

---

## 📋 PANDUAN PLACEHOLDER DIAGRAM

Berikut daftar diagram yang perlu Anda sisipkan:

| No | Placeholder | Jenis Diagram | Lokasi di Jurnal |
|----|-------------|---------------|------------------|
| 1 | Gambar 1 | BPMN/Flowchart Waterfall | Bab 3.1 |
| 2 | Gambar 2 | Flowchart Alur Penelitian | Bab 3.4 |
| 3 | Gambar 3 | BPMN Sistem Berjalan | Bab 4.1 |
| 4 | Gambar 4 | **Use Case Diagram** | Bab 4.3.1 |
| 5 | Gambar 5 | **Activity Diagram (Pemesanan)** | Bab 4.3.2 |
| 6 | Gambar 6 | **Activity Diagram (Pembayaran)** | Bab 4.3.3 |
| 7 | Gambar 7 | **Sequence Diagram (Login)** | Bab 4.3.4 |
| 8 | Gambar 8 | **Sequence Diagram (Buat Pesanan)** | Bab 4.3.5 |
| 9 | Gambar 9 | **Class Diagram** | Bab 4.3.6 |
| 10 | Gambar 10 | **State Machine (Order)** | Bab 4.3.7 |
| 11 | Gambar 11 | **State Machine (Payment)** | Bab 4.3.8 |
| 12 | Gambar 12 | **ERD** | Bab 4.3.9 |
| 13 | Gambar 13 | Deployment Diagram | Bab 4.3.10 |
| 14-21 | Gambar 14-21 | Screenshot Antarmuka | Bab 4.4.2 |

**Catatan:** Diagram UML utama yang harus ada ditandai dengan **bold**.
