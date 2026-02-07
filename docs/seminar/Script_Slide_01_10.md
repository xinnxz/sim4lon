# 🎤 SCRIPT PRESENTASI - SLIDE 1-10
## Opening & BAB 1-2

---

## **SLIDE 1: COVER** (30 detik)

**Narasi:**

> "Assalamualaikum warahmatullahi wabarakatuh.
>
> Selamat pagi Bapak/Ibu dosen penguji yang saya hormati.
>
> Perkenalkan, nama saya **[Nama Anda]**, NIM **5520121026** dari Program Studi Informatika.
>
> Pada kesempatan ini saya akan mempresentasikan hasil Kerja Praktek dengan judul: **Perancangan dan Implementasi Sistem Informasi Manajemen Distribusi LPG Berbasis Web pada PT Mitra Surya Natasya Cianjur**.
>
> Sistem ini diberi nama **SIM4LON** - Sistem Informasi Manajemen"

---

## **SLIDE 2: BAB 1 TITLE** (10 detik)

**Narasi:**

> "Saya mulai dengan BAB 1 Pendahuluan yang mencakup latar belakang, rumusan masalah, dan tujuan sistem."

---

## **SLIDE 3: PROBLEM IMPACT** (1 menit)

**Narasi:**

> "PT Mitra Surya Natasya saat ini mengelola distribusi LPG secara **manual dengan kertas dan spreadsheet**.
>
> **[Point ke data]**
>
> Dampaknya sangat signifikan:
> - Rekap data memakan **3 sampai 5 jam per hari**
> - Human Error pencatatan mencapai **15%** 
> - Tidak ada monitoring stok **real-time**
> - Update stok harus dilakukan **manual** satu per satu
>
> Kondisi ini menyebabkan **inefisiensi operasional** dan risiko **kelangkaan gas** di masyarakat karena tidak ada early warning untuk stok kritis."

---

## **SLIDE 4: LATAR BELAKANG** (1 menit)

**Narasi:**

> "PT Mitra Surya Natasya adalah **agen distributor LPG resmi** dari Pertamina, berlokasi di Kecamatan Cibeber, Kabupaten Cianjur.
>
> Perusahaan mendistribusikan LPG ke **lebih dari 20 pangkalan** dengan **5 jenis produk**: tabung 220 gram, 3kg, 5kg, 12kg, dan 50kg.
>
> **[Point ke diagram flow SPBE → Agen → Pangkalan]**
>
> Alur distribusi dimulai dari SPBE Pertamina yang mengirim stok ke agen. Agen kemudian menyalurkan ke pangkalan berdasarkan pesanan. Pangkalan menjual ke konsumen akhir.
>
> Semua proses ini masih dilakukan **manual** - dari penerimaan stok, pencatatan pesanan, pembayaran, hingga pelaporan bulanan ke Pertamina."

---

## **SLIDE 5: IDENTIFIKASI MASALAH & SOLUSI** (1.5 menit)

**Narasi:**

> "Saya identifikasi **5 masalah utama** beserta solusinya:
>
> **[Point kolom kiri - Masalah]**
>
> **Pertama**, pencatatan manual dengan kertas rentan kehilangan data.
> **Solusi**: Database yg terpusat dengan backup otomatis.
>
> **Kedua**, kesalahan input data karena tidak ada validasi.
> **Solusi**: Validasi otomatis di setiap form.
>
> **Ketiga**, tidak ada notifikasi stok kritis.
> **Solusi**: Decision Support System dengan alert 3 warna - 🟢 aman, 🟡 <20 tabung, 🔴 <10 tabung.
>
> **Keempat**, data tidak terintegrasi antara agen dan pangkalan.
> **Solusi**: Arsitektur multi-tenant dengan JWT token.
>
> **Kelima**, pelaporan manual rentan error.
> **Solusi**: Laporan otomatis format standar Pertamina, export Excel/PDF."

---

## **SLIDE 6: TUJUAN & MANFAAT** (1 menit)

**Narasi:**

> "**Tujuan** sistem SIM4LON:
>
> Diharapkan aplikasi ini bermanfaat untuk perusahaan dalam mengotomasi distribusi LPG, monitoring real-time, dan meningkatkan efisiensi operasional.
>
> **[Point ke Manfaat]**
>
> **Manfaat untuk Agen**: otomasi pencatatan, monitoring stok real-time, laporan otomatis Pertamina.
>
> **Manfaat untuk Pangkalan**: Pemesanan online, tracking penjualan, kelola konsumen."

---

## **SLIDE 7: METODE PENGEMBANGAN** (45 detik)

**Narasi:**

> "Pengembangan menggunakan metode **waterfall 2015**
>
> **[Point ke 5 fase]**
>
> **Communication**: Gathering requirements dari PT MSN.
> **Planning**: Prioritas fitur dan timeline.
> **Modeling**: Perancangan dengan 27 diagram UML.
> **Construction**: Coding dengan React + NestJS + PostgreSQL.
> **Deployment**: Production di Vercel + Railway."

---

## **SLIDE 8: BAB 2 TITLE** (10 detik)

**Narasi:**

> "Selanjutnya BAB 2 Tinjauan Pustaka - profil perusahaan dan analisis proses bisnis."

---

## **SLIDE 9: PROFIL PERUSAHAAN** (45 detik)

**Narasi:**

> "PT Mitra Surya Natasya berlokasi di Kp Chioda RT 002 RW 006 Kel Mayak,**Kecamatan Cibeber, Kabupaten Cianjur**, Jawa Barat.
>
> Sebagai **agen resmi Pertamina**, perusahaan menjadi jalur distribusi LPG ke lebih dari **20 pangkalan** di wilayah Cianjur.
>
> **Visi**: Menjadi agen distribusi LPG terdepan di wilayah Cianjur yang profesional, terpercaya, dan memberikan pelayanan terbaik kepada masyarakat.
>
> **Misi**: Menyalurkan LPG tepat waktu sesuai kuota, menjaga kemitraan dengan pangkalan, memastikan stok konsisten untuk mencegah kelangkaan gas."

---

## **SLIDE 10: BPMN - Penerimaan dan Pencatatan Pesanan** (2 menit)

**Narasi:**

> "Ini BPMN yang menggambarkan **proses bisnis manual yang saat ini berjalan** di PT Mitra Surya Natasya. Terdapat **3 swimlane** yaitu Pangkalan, Admin, dan Gudang.
>
> **[Point swimlane Pangkalan - atas]**
>
> Proses dimulai dari **Pangkalan** yang mengecek stok mereka. Jika stok habis, pangkalan **memesan gas ke agen via WhatsApp**. Perhatikan bahwa komunikasi antara pangkalan dan admin masih manual melalui WhatsApp - tidak ada sistem terintegrasi.
>
> **[Point swimlane Admin - tengah]**
>
> Setelah menerima pesanan via WhatsApp, **Admin mencatat detail pesanan ke file Excel** secara manual. Kemudian admin harus **meminta laporan stok dari petugas gudang** untuk mengecek ketersediaan.
>
> Di sini ada **decision point**: apakah data stok di Excel sesuai dengan laporan gudang? Jika tidak sesuai, admin harus **update manual** data Excel terlebih dahulu. Ini rentan kesalahan dan memakan waktu.
>
> Jika data sudah sesuai, admin cek: apakah stok mencukupi untuk pesanan? Jika tidak cukup, admin mengirim pemberitahuan ke pangkalan bahwa **pesanan ditunda**. Jika cukup, admin **setujui pesanan dan tentukan jadwal pengambilan**, lalu kirim konfirmasi via WhatsApp kembali ke pangkalan.
>
> **[Highlight masalah]**
>
> Dari diagram ini terlihat jelas masalahnya:
> - Data stok di Excel **tidak real-time**
> - Banyak proses manual yang **rentan human error**
> - Komunikasi via WhatsApp **tidak terdokumentasi** dengan baik
> - Admin harus **bolak-balik update data** Excel
>
> Inilah yang akan di solve dengan aplikasi SIM4LON, mengotomasi seluruh proses ini dan menghilangkan ketergantungan pada Excel."

---

## ⏱️ **TIMING SLIDE 1-10:**

| Slide | Durasi | Kumulatif |
|-------|--------|-----------|
| 1 | 30s | 0:30 |
| 2 | 10s | 0:40 |
| 3 | 1m | 1:40 |
| 4 | 1m | 2:40 |
| 5 | 1.5m | 4:10 |
| 6 | 1m | 5:10 |
| 7 | 45s | 5:55 |
| 8 | 10s | 6:05 |
| 9 | 45s | 6:50 |
| 10 | 1.5m | **8:20** |

**Total Slide 1-10: ~8 menit** ✅
