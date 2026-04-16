# 🎤 SPEAKER NOTES PRESENTASI SEMINAR KP
## Panduan Lengkap "Apa yang Harus Dikatakan" - 18 Slides

> **Total Durasi:** 60 menit  
> **Breakdown:** Presentasi 38 min + Demo 12 min + Q&A 10 min  
> **Format:** Script lengkap per slide dengan timing & gesture notes

---

## 🎯 OVERVIEW TIMING

| Bagian | Durasi | Kumulatif |
|--------|--------|-----------|
| **Pembukaan** | 4 min | 4' |
| **BAB I (Pendahuluan)** | 6 min | 10' |
| **BAB III (UML)** | 26 min | 36' |
| **BAB IV (Hasil)** | 4 min | 40' |
| **Q&A Singkat** | 2 min | 42' |
| **DEMO LIVE** | 12 min | 54' |
| **Q&A Final** | 6 min | 60' |

---

## 📝 SPEAKER NOTES PER SLIDE

---

### **SLIDE 1: COVER** (1 menit)

**[Saat slide muncul]**

🎤 **"Assalamualaikum warahmatullahi wabarakatuh. Selamat sore ibu diny selaku dospem beserta Ibu nazila selaku penguji saya."**

**[Pause 2 detik, eye contact]**

🎤 **"Perkenalkan, nama saya Luthfi Alfaridz, NIM 5520121026, dari Program Studi Teknik Informatika, Universitas Suryakancana."**

**[Gesture ke slide - pointing title]**

🎤 **"Pada kesempatan ini, saya akan mempresentasikan hasil Kerja Praktek saya dengan judul:**

**'SIM4LON'**

**PERANCANGAN APLIKASI SEBAGAI SISTEM INFORMASI MANAJEMEN DISTRIBUSI LPG BERBASIS WEB DI PT MITRA SURYA NATASYA CIANJUR."**

**[Pause 1 detik]**

🎤 **"Kerja Praktek ini berlangsung selama 12 minggu, dengan fokus utama pada perancangan sistem menggunakan UML dan implementasi fitur-fitur otomasi untuk efisiensi operasional."**

**[Transisi]**

🎤 **"Baik, sebelum masuk ke pembahasan, saya akan jelaskan terlebih dahulu permasalahan yang melatarbelakangi pembuatan sistem ini."**

**[Click next slide]**

---

### **SLIDE 2: PROBLEM IMPACT** (3 menit)

**[Slide muncul - wait 2 detik biar audiens baca]**

🎤 **"Seperti yang terlihat di slide, SEBELUM sistem SIM4LON ada, Perusahaan ini menghadapi beberapa masalah kritis dalam operasional sehari-hari."**

**[Pointing ke angka pertama - ⏱️]**

🎤 **"Yang pertama, waktu untuk rekap laporan harian sangat lama. Staff harus menghabiskan 3 sampai 5 jam per hari hanya untuk merekap data dari buku dan excel secara manual."**

**[Pause, biarkan sink in]**

🎤 **"Ini sangat tidak efisien, karena hampir setengah hari kerja habis hanya untuk administrasi."**

**[Pointing ke angka kedua - ❌]**

🎤 **"Kedua, tingkat kesalahan pencatatan mencapai sekitar 15 persen per bulan. Kenapa? Karena semua manual, human error tidak bisa dihindari. Salah ketik, salah hitung, data hilang, itu sering terjadi."**

**[Pointing ke angka ketiga - 📊]**

🎤 **"Ketiga, monitoring stok pangkalan hanya dilakukan sekali sehari secara manual. Jadi Admin harus menelepon satu per satu ke 20 pangkalan untuk tanya stok. Tidak ada data real-time."**

**[Pointing ke angka keempat - 🚨]**

🎤 **"Keempat, tidak ada sistem peringatan untuk stok kritis. Jadi seringkali pangkalan baru sadar stoknya habis SETELAH konsumen komplain."**

**[Pointing ke angka kelima - 💸]**

🎤 **"Dan yang paling mengejutkan, dari survey yang saya lakukan, ternyata 40 persen waktu kerja staff HANYA digunakan untuk pencatatan manual."**

**[Eye contact dengan penguji]**

🎤 **"Bayangkan Pak/Bu, dari 8 jam kerja, 3 jam lebih dihabiskan hanya untuk menulis di buku dan excel. Ini yang menjadi motivasi utama kenapa sistem ini perlu dibuat."**

**[Gesture confidence]**

🎤 **"Target saya dengan SIM4LON adalah:**
- Rekap laporan dari 5 jam menjadi kurang dari 10 menit,
- Error pencatatan kurang dari 1 persen,
- Monitoring stok menjadi real-time,
- Dan ada sistem alert otomatis dengan tiga warna."

**[Transisi]**

🎤 **"Nah, untuk lebih memahami konteksnya, saya jelaskan dulu bagaimana alur distribusi LPG di PT Mitra Surya Natasya."**

**[Click next]**

---

### **SLIDE 3: LATAR BELAKANG** (2 menit)

**[Pointing ke kolom kiri]**

🎤 **"PT Mitra Surya Natasya adalah Agen Distributor LPG resmi di Tasikmalaya. Mereka melayani lebih dari 20 pangkalan, yang merupakan sub-agen, dan mendistribusikan 5 jenis LPG: mulai dari 220 gram, 3 kg, 5 kg, 12 kg, sampai 50 kg."**

**[Pointing ke diagram alur]**

🎤 **"Alur distribusinya seperti ini:"**

**[Trace diagram dengan pointer - START dari SPBE]**

🎤 **"SPBE Pertamina menyalurkan LPG ke AGEN, yaitu PT Mitra Surya Natasya."**

**[Trace ke Pangkalan]**

🎤 **"Kemudian dari Agen, LPG disalurkan ke 20 lebih Pangkalan atau warung-warung."**

**[Trace ke Konsumen]**

🎤 **"Dan akhirnya dari Pangkalan, LPG dijual ke konsumen akhir, yaitu masyarakat untuk rumah tangga."**

**[Pointing ke teks "SIM4LON mengelola 2 jalur ini"]**

🎤 **"Nah, SIM4LON ini fokusnya mengelola DUA jalur distribusi:"**

**[Gesture 1 jari]**
🎤 **"Pertama, jalur dari Agen ke Pangkalan - ini untuk pencatatan pesanan, pembayaran, dan pengiriman."**

**[Gesture 2 jari]**
🎤 **"Kedua, jalur dari Pangkalan ke Konsumen - ini untuk sistem penjualan yang dilakukan oleh pangkalan sendiri."**

**[Eye contact]**

🎤 **"Jadi sistemnya multi-tenant, satu aplikasi, tapi setiap pangkalan punya dashboard sendiri dan data mereka terisolasi."**

**[Transisi]**

🎤 **"Dengan latar belakang ini, saya menetapkan tujuan dan manfaat dari sistem SIM4LON."**

**[Click next]**

---

### **SLIDE 4: TUJUAN & MANFAAT** (3 menit)

**[Pointing ke kolom kiri]**

🎤 **"Tujuan dari Kerja Praktek ini ada empat hal utama:"**

**[Point satu per satu]**

🎤 **"Pertama, menganalisis kebutuhan sistem distribusi LPG melalui wawancara dan observasi langsung di PT Mitra Surya Natasya."**

🎤 **"Kedua - dan ini yang menjadi fokus presentasi hari ini - merancang sistem dengan 52 diagram UML lengkap. Mulai dari BPMN, Use Case, Activity, Sequence, Class Diagram, ERD, State Machine, sampai Deployment Diagram."**

🎤 **"Ketiga, membangun aplikasi web full-stack dengan teknologi modern: Astro 5, React 18 untuk frontend, dan NestJS 11 untuk backend."**

🎤 **"Keempat, melakukan testing komprehensif dan deployment ke production."**

**[Pause, shift ke kolom kanan]**

**[Pointing ke bagian "Untuk AGEN"]**

🎤 **"Manfaatnya untuk dua pihak utama. Yang pertama untuk AGEN, yaitu PT Mitra Surya Natasya:"**

**[Read dengan penekanan]**
- "Otomasi pencatatan yang menghemat 90 persen waktu,"
- "Monitoring real-time untuk 20 pangkalan sekaligus,"
- "Laporan otomatis dan audit trail lengkap,"
- "Dan decision support system untuk membantu distribusi."

**[Pointing ke bagian "Untuk PANGKALAN"]**

🎤 **"Yang kedua untuk PANGKALAN:"**

- "Mereka bisa order online 24/7, tidak perlu datang ke kantor agen,"
- "Dashboard penjualan real-time untuk tracking omset mereka sendiri,"
- "Dan yang paling membantu, alert stok dengan 3 warna: hijau untuk aman, kuning untuk rendah, merah untuk kritis."

**[Eye contact - serious tone]**

🎤 **"Jadi sistem ini bukan hanya mempercepat pekerjaan agen, tapi juga memberdayakan pangkalan untuk mengelola bisnis mereka lebih baik."**

**[Transisi]**

🎤 **"Sebelum masuk ke perancangan teknis, saya akan jelaskan sedikit tentang profil perusahaan dan landasan teori."**

**[Click next]**

---

## 📚 BAB II: TINJAUAN PUSTAKA (4 menit) - Slides 6-8

---

### **SLIDE 6: PROFIL PERUSAHAAN** (1.5 menit)

**[Wait 2 detik - biar audiens lihat]**

🎤 **"PT Mitra Surya Natasya adalah perusahaan tempat saya melaksanakan Kerja Praktek."**

**[Pointing ke Profil - kolom kiri]**

🎤 **"Perusahaan ini berlokasi di Kecamatan Cibeber, Kabupaten Cianjur, Jawa Barat. Mereka merupakan agen resmi dari Pertamina untuk distribusi LPG."**

**[Explain peran]**

🎤 **"Peran PT MSN adalah sebagai jalur tengah dalam rantai distribusi. Mereka menerima stok LPG dari SPBE Pertamina, kemudian menyalurkan ke lebih dari 20 pangkalan di wilayah Cianjur."**

**[Pointing ke Misi - kolom kanan]**

🎤 **"Misi perusahaan ada 5 poin utama:"**

**[Read dengan pointing satu per satu - singkat]**

1. **"Menyalurkan LPG tepat waktu sesuai kuota,"**
2. **"Menjaga kemitraan baik dengan pangkalan,"**
3. **"Memastikan stok konsisten,"**
4. **"Mengoptimalkan teknologi untuk efisiensi - ini yang menjadi fokus SIM4LON,"**
5. **"Dan meningkatkan pelayanan."**

**[Pointing ke Visi - kolom bawah]**

🎤 **"Visi mereka adalah menjadi agen distributor LPG terdepan di Cianjur yang profesional dan terpercaya."**

**[Connect ke project]**

🎤 **"SIM4LON ini sejalan dengan misi nomor 4: mengoptimalkan teknologi untuk efisiensi operasional."**

**[Transisi]**

🎤 **"Sekarang kita masuk ke landasan teori yang saya gunakan."**

**[Click next]**

---

### **SLIDE 7: TINJAUAN PUSTAKA - TEORI** (1.5 menit)

**[Wait 2 detik]**

🎤 **"Ada 3 landasan teori utama yang saya gunakan dalam perancangan SIM4LON."**

**[Pointing ke Box 1 - SIM]**

🎤 **"Yang pertama, Sistem Informasi Manajemen atau SIM."**

**[Quote dengan gesture]**

🎤 **"Menurut O'Brien dalam bukunya Management Information Systems tahun 2015, SIM adalah kombinasi dari people, hardware, software, networks, dan data yang mengumpulkan dan menyebarkan informasi dalam organisasi."**

**[Explain relevance]**

🎤 **"SIM4LON menerapkan konsep ini dengan mengintegrasikan user, server, database, network, dan data distribusi LPG menjadi satu sistem terpadu."**

**[Pointing ke Box 2 - UML]**

🎤 **"Yang kedua, UML atau Unified Modeling Language."**

🎤 **"Menurut Fowler tahun 2017, UML adalah bahasa visual untuk menspesifikasi dan mendokumentasikan software systems."**

**[Emphasis]**

🎤 **"Saya menggunakan 7 jenis diagram UML: Use Case, Activity, Sequence, State Machine, Class, ERD, dan Deployment untuk mendokumentasikan SELURUH aspek sistem."**

**[Pointing ke Box 3 - Web-Based]**

🎤 **"Dan yang ketiga, konsep Web-Based Application."**

🎤 **"Pressman tahun 2014 menjelaskan bahwa web-based system memungkinkan akses dari mana saja dengan koneksi internet."**

**[Explain benefit]**

🎤 **"Ini penting karena Admin di kantor, Pangkalan di lapangan, dan Operator bisa akses sistem yang SAMA secara bersamaan. Data tersinkronisasi real-time."**

**[Transisi]**

🎤 **"Dengan landasan teori ini, sekarang kita lihat proses bisnis aktual di PT MSN menggunakan BPMN."**

**[Click next]**

---

### **SLIDE 8: PROSES BISNIS (BPMN)** (1 menit)

**[Wait 2-3 detik - biar audiens lihat diagram]**

🎤 **"Ini adalah Business Process Model and Notation atau BPMN yang menggambarkan alur distribusi LPG secara end-to-end."**

**[Pointing ke swimlane pertama - SPBE]**

🎤 **"Ada 3 swimlane. Yang pertama SPBE Pertamina sebagai supplier. Mereka menyediakan stok LPG."**

**[Trace ke swimlane kedua - AGEN]**

🎤 **"Swimlane kedua adalah Agen, yaitu PT Mitra Surya Natasya. Mereka menerima stok dari SPBE, lalu menyalurkan ke pangkalan."**

**[Trace ke swimlane ketiga - PANGKALAN]**

🎤 **"Dan swimlane ketiga adalah Pangkalan. Mereka menerima stok dari agen, kemudian menjual ke konsumen akhir."**

**[Pointing ke proses kunci - jika visible di diagram]**

🎤 **"Proses kunci yang SIM4LON otomasi adalah:"**

**[Count dengan gesture]**
1. **"Penerimaan stok - dicatat otomatis dengan kode ORD-XXXX,"**
2. **"Penyaluran ke pangkalan - dengan tracking status real-time,"**
3. **"Dan yang paling critical, auto-sync stok pangkalan saat status pesanan SELESAI."**

**[Eye contact]**

🎤 **"Jadi BPMN ini adalah gambaran besar proses bisnis. Sekarang kita breakdown ke detail teknis dengan perancangan UML."**

**[Transisi confident]**

🎤 **"Mari kita mulai dengan overview perancangan UML yang saya buat."**

**[Click next]**

---

## 🛠️ BAB III: PELAKSANAAN - PERANCANGAN UML (20 menit)

---

### **SLIDE 5: OVERVIEW PERANCANGAN UML** (2.5 menit)

**[Wait 2-3 detik - biarkan audiens lihat tabel]**

🎤 **"Untuk merancang sistem SIM4LON, saya menggunakan metodologi Waterfall."**

**[Pointing ke diagram Waterfall]**

🎤 **"Sequential dari Requirements, ke Design, Implementation, Testing, dan Deployment."**

**[Justify decision]**

🎤 **"Kenapa Waterfall? Karena tiga alasan:"**

**[Gesture 1-2-3 dengan jari]**
1. "Kebutuhan sudah jelas dari awal berdasarkan wawancara lengkap dengan PT Mitra Surya Natasya,"
2. "Timeline KP fixed 12 minggu, tidak bisa di-extend,"
3. "Dan dokumentasi sangat penting untuk handover sistem ke tim PT MSN."

**[Pointing ke tabel besar]**

🎤 **"Total saya membuat 52 diagram UML yang mencakup SELURUH aspek sistem, dari proses bisnis sampai deployment."**

**[Trace tabel dari atas ke bawah]**

🎤 **"Dimulai dari:**
- 1 diagram BPMN untuk proses bisnis,
- 1 Use Case dengan 17 use case untuk 3 aktor,
- 29 Activity Diagram untuk detail alur,
- 20 Sequence Diagram untuk interaksi objek,
- 1 Class Diagram dengan 23 classes,
- 1 ERD dengan 23 tabel,
- 3 State Machine untuk lifecycle,
- Dan 1 Deployment Diagram untuk arsitektur."

**[Emphasis]**

🎤 **"Untuk presentasi hari ini, saya fokus ke diagram CORE dari masing-masing jenis, karena kalau semua 52 diagram dibahas, waktunya tidak akan cukup."**

**[Pointing ke kolom "Fokus Presentasi"]**

🎤 **"Jadi dari 29 Activity Diagram, saya pilih 3 yang paling critical. Dari 20 Sequence, saya pilih 2 yang paling kompleks. Dan seterusnya."**

**[Transition dengan confidence]**

🎤 **"Mari kita mulai dengan BPMN untuk memahami proses bisnis secara keseluruhan."**

**[Click next]**

---

### **SLIDE 6: BPMN - PROSES BISNIS** (2 menit)

**[Pointing ke diagram]**

🎤 **"BPMN atau Business Process Model and Notation menggambarkan alur proses bisnis distribusi LPG secara end-to-end."**

**[Trace swimlane pertama - SPBE]**

🎤 **"Ada tiga swimlane di sini. Yang pertama SPBE sebagai supplier. Mereka menyalurkan LPG ke Agen."**

**[Trace swimlane kedua - AGEN]**

🎤 **"Swimlane kedua adalah AGEN, yaitu PT Mitra Surya Natasya. Mereka menerima stok dari SPBE, kemudian menyalurkan ke Pangkalan."**

**[Trace swimlane ketiga - PANGKALAN]**

🎤 **"Dan swimlane ketiga adalah PANGKALAN. Mereka menerima stok dari Agen, lalu menjual ke konsumen akhir."**

**[Pointing ke proses kunci - jika ada di diagram]**

🎤 **"Proses yang paling critical adalah saat AGEN membuat pesanan untuk PANGKALAN. Di sini ada beberapa langkah:"**

**[Trace step by step jika diagram detail]**
- "Buat pesanan,"
- "Verifikasi pembayaran,"
- "Kirim barang,"
- "Konfirmasi diterima,"
- "Dan yang penting, saat status jadi SELESAI, sistem OTOMATIS update stok pangkalan."

**[Eye contact]**

🎤 **"Otomasi ini yang menghilangkan 40 persen pekerjaan manual yang saya sebutkan tadi."**

**[Transisi]**

🎤 **"Dari BPMN ini, saya breakdown ke Use Case Diagram untuk detail kebutuhan fungsional."**

**[Click next]**

---

### **SLIDE 7: USE CASE DIAGRAM** (2.5 menit)

**[Wait 2 detik - biar audiens lihat diagram]**

🎤 **"Use Case Diagram menggambarkan SIAPA yang bisa melakukan APA di dalam sistem."**

**[Pointing ke 3 aktor]**

🎤 **"Ada tiga aktor: Admin, Operator, dan Pangkalan."**

**[Point Admin]**

🎤 **"Admin punya akses penuh ke 12 use case. Mereka bisa kelola master data seperti pengguna, pangkalan, supir, produk LPG, dan lain-lain."**

**[Point Operator]**

🎤 **"Operator punya akses ke 8 use case untuk operasional sehari-hari: kelola pesanan, pembayaran, update status, cetak invoice, dan laporan."**

**[Point Pangkalan]**

🎤 **"Dan Pangkalan punya 5 use case untuk mengelola data mereka sendiri: catat penjualan, kelola konsumen, order ke agen, dan lihat dashboard mereka."**

**[Pointing ke relasi - jika terlihat di diagram]**

🎤 **"Ada dua jenis relasi di sini yang penting:"**

**[Gesture include]**
🎤 **"Yang pertama INCLUDE. Contohnya, 'Update Status' HARUS include 'Kelola Pesanan'. Jadi tidak bisa update status kalau tidak dalam konteks kelola pesanan."**

**[Gesture extend]**
🎤 **"Yang kedua EXTEND. Contohnya 'Assign Driver' adalah extend dari 'Update Status'. Jadi opsional, tidak harus."**

**[Eye contact]**

🎤 **"Total 17 use case ini mencakup SEMUA kebutuhan fungsional yang saya kumpulkan dari hasil wawancara."**

**[Transisi]**

🎤 **"Sekarang kita masuk ke Activity Diagram untuk melihat detail alur per use case."**

**[Click next]**

---

### **SLIDE 8: ACTIVITY DIAGRAM #1 - LOGIN** (2 menit)

**[Pointing ke swimlane]**

🎤 **"Activity Diagram menggambarkan alur proses secara detail dengan swimlane."**

**[Trace swimlane kiri - User]**

🎤 **"Swimlane pertama adalah User. Mereka input email dan password."**

**[Trace swimlane kanan - Sistem]**

🎤 **"Swimlane kedua adalah Sistem. Begitu user submit, sistem validate credentials."**

**[Pointing ke decision diamond - jika ada]**

🎤 **"Ada decision di sini: jika credentials INVALID, tampilkan error message."**

**[Trace flow valid]**

🎤 **"Jika VALID, sistem melakukan 4 hal:"**

**[Count dengan jari]**
1. "Generate JWT token untuk autentikasi,"
2. "Generate session_id baru - ini untuk single session login,"
3. "UPDATE session_id di database - jadi kalau user login dari device lain, session lama otomatis invalid,"
4. "Dan INSERT ke activity_logs untuk audit trail."

**[Emphasis]**

🎤 **"Single session login ini penting untuk security. Satu user hanya bisa login di satu device.**

Jadi kalau dia login di laptop kantor, terus login lagi di HP, laptop otomatis logout."**

**[Transisi]**

🎤 **"Setelah login, user bisa buat pesanan. Mari kita lihat flow-nya."**

**[Click next]**

---

### **SLIDE 9: ACTIVITY DIAGRAM #2 - BUAT PESANAN** (2 menit)

**[Pointing ke awal flow]**

🎤 **"Proses buat pesanan dimulai dari user buka halaman pesanan. Sistem load daftar pangkalan AKTIF dan daftar produk LPG."**

**[Trace user input]**

🎤 **"User pilih pangkalan tujuan, pilih jenis LPG dari dropdown, dan input quantity."**

**[Pointing ke decision diamonds]**

🎤 **"Sistem melakukan 3 validasi:"**

**[Count]**
1. "Apakah pangkalan sudah dipilih? Kalau belum, error."
2. "Apakah ada minimal 1 item LPG? Kalau tidak ada, error."
3. "Apakah quantity lebih besar dari 0? Kalau 0 atau negatif, error."

**[Trace success path]**

🎤 **"Kalau semua validasi lolos, sistem:"**

**[List dengan gesture]**
- "Generate kode pesanan unik, seperti ORD-0150,"
- "Hitung subtotal per item,"
- "Hitung PPN 12 persen HANYA untuk kategori NON-SUBSIDI - kategori subsidi tidak kena PPN,"
- "Hitung total amount,"
- "Simpan ke database dengan status DRAFT."

**[Emphasis]**

🎤 **"Status DRAFT ini penting karena pesanan belum final. Masih bisa diedit atau dibatalkan."**

**[Transisi]**

🎤 **"Nah, sekarang kita lihat proses yang paling CRITICAL, yaitu update status pesanan."**

**[Click next]**

---

### **SLIDE 10: ACTIVITY DIAGRAM #3 - UPDATE STATUS** (3 menit) ⭐

**[Serious tone - ini slide penting]**

🎤 **"Ini diagram yang paling critical di seluruh sistem SIM4LON."**

**[Pointing ke awal]**

🎤 **"User buka detail pesanan, pilih status baru dari dropdown, dan klik Update Status."**

**[Pointing ke validation]**

🎤 **"Sistem pertama-tama validate transisi. Tidak semua transisi diperbolehkan. Contohnya, dari DRAFT bisa ke MENUNGGU_PEMBAYARAN, tapi dari SELESAI TIDAK BISA balik ke DRAFT."**

**[Pointing ke decision "Status = SELESAI?"]**

🎤 **"Nah, ini yang paling penting."**

**[Pause 2 detik - eye contact]**

🎤 **"JIKA status baru adalah SELESAI, sistem melakukan proses OTOMATIS:"**

**[Trace box auto-update - dengan emphasis]**

🎤 **"Sistem SELECT semua order_items dari pesanan ini. Misalnya ada 50 tabung 12kg dan 30 tabung 3kg."**

**[Gesture loop]**

🎤 **"Lalu LOOP untuk setiap item, sistem UPDATE tabel pangkalan_stocks. Misalnya:"**

**[Explain dengan angka]**
- "Stok 12kg Pangkalan Reon sebelumnya 45 tabung,"
- "Ditambah 50 dari order ini,"
- "Jadi stok baru otomatis 95 tabung."

**[Emphasis dengan gesture tegas]**

🎤 **"Ini TANPA input manual! Jadi operator TIDAK PERLU buka menu stok dan input satu-satu. Sistem sync OTOMATIS begitu status jadi SELESAI."**

**[Eye contact dengan penguji]**

🎤 **"Fitur ini yang menghilangkan 40 persen pekerjaan manual yang saya sebutkan di awal."**

**[Pointing ke option lain - assign driver]**

🎤 **"Ada juga optional untuk assign driver kalau status SIAP_KIRIM. Tapi ini opsional, tidak wajib."**

**[Transisi]**

🎤 **"Sekarang kita lihat implementasi teknis dari auto-sync ini di Sequence Diagram."**

**[Click next]**

---

### **SLIDE 11: SEQUENCE DIAGRAM #1 - CREATE ORDER** (2.5 menit)

**[Pointing ke actors di atas]**

🎤 **"Sequence Diagram menggambarkan interaksi antar objek secara detail dengan timeline."**

**[Trace dari kiri ke kanan]**

🎤 **"Ada empat participants: Admin sebagai actor, OrderPage sebagai boundary, OrderService sebagai control, dan 4 database table."**

**[Trace message 1]**

🎤 **"Flow dimulai dari Admin buka halaman Buat Pesanan."**

**[Trace aktivasi OrderPage]**

🎤 **"OrderPage aktif dan memanggil OrderService untuk load data."**

**[Pointing ke query pangkalans]**

🎤 **"OrderService query ke database: SELECT * FROM pangkalans WHERE is_active = true. Jadi hanya load pangkalan yang masih aktif."**

**[Trace return]**

🎤 **"Data dikembalikan ke OrderPage, ditampilkan ke Admin dalam bentuk dropdown."**

**[Trace Admin input]**

🎤 **"Admin pilih pangkalan, pilih LPG, input quantity, lalu klik Simpan."**

**[Pointing ke validasi]**

🎤 **"OrderService validate input. Pastikan semua field required terisi dan valid."**

**[Pointing ke generate code]**

🎤 **"Lalu generate kode unik. Caranya query SELECT MAX(code), ambil angka terakhir, increment 1. Misalnya ORD-0149 jadi ORD-0150."**

**[Pointing ke calculate]**

🎤 **"Calculate subtotal, tax 12 persen untuk NON_SUBSIDI, dan total amount."**

**[Trace INSERT operations]**

🎤 **"Lalu simpan ke 3 tabel sekaligus dalam 1 transaction:"**

**[Count]**
1. "INSERT ke orders dengan status DRAFT,"
2. "INSERT ke order_items untuk setiap LPG yang dipesan,"
3. "INSERT ke timeline_tracks untuk tracking history."

**[Emphasis]**

🎤 **"Semua dalam 1 transaction, jadi kalau salah satu gagal, semua rollback. Data consistency terjaga."**

**[Transisi]**

🎤 **"Sekarang kita lihat sequence untuk update status dan auto-sync stok."**

**[Click next]**

---

### **SLIDE 12: SEQUENCE DIAGRAM #2 - UPDATE STATUS** (3 menit) ⭐

**[Serious tone]**

🎤 **"Ini implementasi teknis dari auto-sync yang saya jelaskan tadi."**

**[Pointing ke Admin pilih status]**

🎤 **"Admin buka detail pesanan, pilih status baru, misalnya dari DIKIRIM ke SELESAI, lalu klik Update Status."**

**[Pointing ke validate transition]**

🎤 **"OrderService pertama SELECT current_status dari database, lalu validate apakah transisi DIKIRIM → SELESAI valid menurut State Machine. Kalau valid, lanjut."**

**[Pointing ke UPDATE orders]**

🎤 **"UPDATE orders SET current_status = SELESAI, INSERT ke timeline_tracks untuk log."**

**[Highlighting opt fragment - ini CRITICAL]**

🎤 **"Nah, ini bagian yang paling penting."**

**[Pause - eye contact]**

🎤 **"Ada OPTIONAL FRAGMENT di sini dengan kondisi: IF status = SELESAI."**

**[Trace SELECT order_items]**

🎤 **"Kalau kondisi true, sistem SELECT * FROM order_items WHERE order_id = pesanan ini."**

**[Pointing ke loop]**

🎤 **"Lalu LOOP untuk setiap item:"**

**[Explain step by step]**

🎤 **"Misalnya item pertama 50 tabung 12kg untuk Pangkalan Reon."**

**[Trace UPSERT]**

🎤 **"Sistem melakukan UPSERT ke pangkalan_stocks:"**

**[Explain UPSERT]**
- "Kalau record Pangkalan Reon + LPG 12kg SUDAH ada, UPDATE qty = qty + 50,"
- "Kalau BELUM ada, INSERT record baru dengan qty = 50."

**[Pointing ke stock_movements]**

🎤 **"Lalu INSERT ke pangkalan_stock_movements untuk audit trail. Catat dari mana stok ini masuk: dari ORDER_COMPLETE."**

**[Gesture loop untuk item ke-2]**

🎤 **"Lalu loop lagi untuk item ke-2, misalnya 30 tabung 3kg. UPSERT lagi. Begitu seterusnya sampai semua item done."**

**[Emphasis dengan gesture confident]**

🎤 **"Semua ini otomatis. Operator HANYA klik satu tombol 'Update Status ke SELESAI', sisanya sistem yang kerjakan."**

**[Eye contact]**

🎤 **"Ini yang membedakan sistem manual dengan sistem otomatis. Efisiensi waktu sangat signifikan."**

**[Transisi]**

🎤 **"Sekarang kita lihat struktur data sistem di Class Diagram."**

**[Click next]**

---

### **SLIDE 13: CLASS DIAGRAM** (2.5 menit)

**[Wait 2 detik]**

🎤 **"Class Diagram menggambarkan struktur Object-Oriented Programming dari sistem SIM4LON."**

**[Pointing ke packages]**

🎤 **"Total ada 23 classes yang saya kelompokkan menjadi 6 packages untuk maintainability."**

**[Point package by package]**

🎤 **"Package pertama Master Data: berisi 6 classes untuk data master seperti users, agen, pangkalans, drivers, lpg_products, dan company_profile."**

🎤 **"Package kedua Order Management: 4 classes untuk orders, order_items, timeline_tracks, dan invoices."**

🎤 **"Package Payment: 2 classes untuk order_payment_details dan payment_records."**

🎤 **"Package Stock Agen: 4 classes untuk kelola stok di sisi agen."**

🎤 **"Package Pangkalan SaaS: ini yang paling banyak, 7 classes untuk multi-tenant. Setiap pangkalan punya consumers sendiri, consumer_orders sendiri, pangkalan_stocks sendiri, dan seterusnya."**

🎤 **"Dan package Audit: activity_logs untuk tracking siapa melakukan apa dan kapan."**

**[Pointing ke relasi - jika visible]**

🎤 **"Ada 3 relasi penting di sini:"**

**[Point satu per satu jika ada di diagram]**

1. **"Agen one-to-many Pangkalans. Satu agen punya banyak pangkalan."**
2. **"Orders one-to-many Order_items dengan COMPOSITION. Kalau order dihapus, itemsnya ikut terhapus."**
3. **"Pangkalans one-to-many Consumers. Ini multi-tenant. Satu pangkalan punya banyak konsumen, tapi data konsumen HANYA bisa diakses oleh pangkalan yang memiliki."**

**[Transisi]**

🎤 **"Class Diagram ini diimplementasikan ke database melalui ERD."**

**[Click next]**

---

### **SLIDE 14: ERD (ENTITY RELATIONSHIP DIAGRAM)** (2 menit)

**[Pointing ke diagram]**

🎤 **"ERD adalah implementasi Class Diagram ke struktur database PostgreSQL."**

**[Pointing ke angka]**

🎤 **"Total ada 23 tabel dengan 26 foreign key relations."**

**[Pointing ke kategori]**

🎤 **"Saya kelompokkan jadi 4 kategori:"**

**[List]**
1. "Master Data: 6 tabel untuk data master,"
2. "Order Management: 6 tabel untuk kelola pesanan dan pembayaran,"
3. "Pangkalan Operations: 7 tabel untuk multi-tenant - setiap pangkalan punya data terpisah,"
4. "Stock & Audit: 4 tabel untuk tracking stok dan aktivitas."

**[Pointing ke design decisions]**

🎤 **"Ada 3 design decision penting yang saya terapkan:"**

**[Count dengan gesture]**

🎤 **"Pertama, UUID sebagai Primary Key. Kenapa UUID? Untuk security. Kalau pakai integer sequential seperti 1, 2, 3, user bisa tebak ID dan akses data orang lain. UUID acak, unpredictable."**

🎤 **"Kedua, Soft Delete. Saya TIDAK benar-benar menghapus data. Hanya set deleted_at dengan timestamp. Jadi data tetap ada untuk audit trail, tapi tidak tampil di aplikasi."**

🎤 **"Ketiga, Timestamps di semua tabel: created_at, updated_at, deleted_at. Ini untuk audit trail dan debugging."**

**[Transisi]**

🎤 **"Sekarang kita lihat lifecycle object di State Machine Diagram. Ini diagram yang paling sering ditanya saat seminar."**

**[Click next]**

---

### **SLIDE 15: STATE MACHINE DIAGRAM** (3.5 menit) ⭐⭐⭐

**[Wait 3 detik - INI SLIDE PALING PENTING]**

**[Serious + confident tone]**

🎤 **"State Machine Diagram menggambarkan LIFECYCLE sebuah object - dalam hal ini, Order."**

**[Pointing ke 7 states]**

🎤 **"Order di SIM4LON punya 7 possible states."**

**[Trace dari START]**

🎤 **"Dimulai dari state DRAFT saat pesanan pertama kali dibuat."**

**[Pointing ke entry action DRAFT]**

🎤 **"Saat MASUK ke state DRAFT, ada entry action: sistem otomatis generate kode ORD-XXXX dan hitung total amount termasuk PPN."**

**[Trace transition ke MENUNGGU_PEMBAYARAN]**

🎤 **"Saat Admin klik 'Submit Pesanan', transisi ke MENUNGGU_PEMBAYARAN."**

**[Pointing ke entry action MENUNGGU]**

🎤 **"Entry action-nya: notifikasi otomatis dikirim ke Pangkalan lewat sistem atau WhatsApp bahwa ada pesanan baru."**

**[Trace ke DIPROSES]**

🎤 **"Begitu pembayaran diterima - di sini ada GUARD CONDITION: is_paid = true - transisi ke DIPROSES."**

**[Pointing ke entry action DIPROSES]**

🎤 **"Entry action: verifikasi pembayaran dan siapkan barang."**

**[Trace ke SIAP_KIRIM]**

🎤 **"Setelah barang siap, transisi ke SIAP_KIRIM. Di sini bisa optional assign driver."**

**[Trace ke DIKIRIM]**

🎤 **"Ada guard condition lagi: driver_id != null. Kalau driver sudah ditentukan, transisi ke DIKIRIM."**

**[Pause - ini bagian CRITICAL]**

**[Trace ke SELESAI dengan emphasis]**

🎤 **"Dan inilah state yang PALING PENTING di seluruh sistem:"**

**[Pointing ke entry action SELESAI - dengan gesture tegas]**

🎤 **"Saat transisi ke state SELESAI, entry action yang dijalankan adalah:**

**AUTO-SYNC STOK PANGKALAN."**

**[Pause - eye contact dengan semua penguji]**

🎤 **"Seperti yang sudah saya jelaskan di Activity dan Sequence Diagram tadi, sistem OTOMATIS update pangkalan_stocks tanpa input manual."**

**[Trace exit action]**

🎤 **"Exit action dari SELESAI adalah generate invoice, ini optional."**

**[Pointing ke BATAL - dengan gesture sweep]**

🎤 **"Dan ada satu final state lagi: BATAL. State ini bisa dicapai dari state manapun KECUALI SELESAI."**

**[Explain kenapa]**

🎤 **"Kenapa dari SELESAI tidak bisa dibatalkan? Karena stok sudah di-sync. Kalau order selesai lalu dibatalkan, stoknya jadi kacau. Jadi state SELESAI adalah final state untuk success path."**

**[Pointing ke entry action BATAL]**

🎤 **"Kalau order dibatalkan, entry action-nya log alasan pembatalan dan rollback stok kalau ada."**

**[Recap - serious tone]**

🎤 **"Jadi ada 7 state, multiple transitions, guard conditions untuk validasi, dan yang paling penting: AUTO-SYNC STOK di state SELESAI."**

**[Eye contact]**

🎤 **"Ini implementasi State Machine pattern yang proper untuk lifecycle management."**

**[Transisi]**

🎤 **"Terakhir untuk UML, kita lihat Deployment Diagram untuk arsitektur fisik sistem."**

**[Click next]**

---

### **SLIDE 16: DEPLOYMENT DIAGRAM** (2.5 menit)

**[Pointing ke diagram]**

🎤 **"Deployment Diagram menggambarkan WHERE sistem ini di-deploy secara fisik dan HOW komponen-komponen berkomunikasi."**

**[Trace dari atas - USERS]**

🎤 **"User mengakses sistem lewat browser: Chrome, Firefox, Safari, atau Edge."**

**[Trace ke VERCEL]**

🎤 **"Frontend di-deploy di Vercel. Ini platform cloud untuk static site dengan global CDN."**

**[Pointing ke tech stack frontend]**

🎤 **"Tech stack frontend: Astro 5 untuk static site generation, React 18 untuk interaktivitas, Shadcn/UI untuk component library, dan Zustand untuk state management."**

**[Explain benefit Vercel]**

🎤 **"Kenapa Vercel? Karena auto-deploy dari GitHub, global CDN untuk fast loading, dan free tier cocok untuk production grade."**

**[Trace connection ke RAILWAY]**

🎤 **"Frontend komunikasi ke Backend lewat HTTPS port 443 dengan REST API."**

**[Pointing ke RAILWAY]**

🎤 **"Backend di-deploy di Railway dalam bentuk Docker container."**

**[Pointing ke tech stack backend]**

🎤 **"Tech stack backend: NestJS 11 untuk framework modular, Prisma 6 sebagai ORM type-safe, JWT dan Passport untuk autentikasi, dan Google Gemini 2.0 Flash untuk Voice Order AI."**

**[Trace ke 3 database services]**

🎤 **"Backend terhubung ke 3 services:"**

**[Point satu per satu]**

1. **"PostgreSQL 15 di Railway untuk relational database dengan 23 tabel,"**
2. **"Supabase Storage untuk file uploads seperti bukti transfer, foto produk, foto profile,"**
3. **"Google Cloud Gemini API untuk Voice Order feature."**

**[Recap architecture]**

🎤 **"Jadi arsitekturnya cloud-native: Frontend di Vercel, Backend di Railway, Database PostgreSQL, Storage di Supabase, dan AI di Google Cloud."**

**[Emphasis]**

🎤 **"Semua managed services dengan auto-scaling, jadi saya tidak perlu manage server sendiri. Focus ke development, infrastructure handled by platform."**

**[Transisi]**

🎤 **"Baik, itu tadi 8 jenis diagram UML yang saya gunakan. Sekarang kita lihat fitur unggulan dan hasil testing."**

**[Click next]**

---

### **SLIDE 17: FITUR UNGGULAN + TESTING** (4 menit)

**[Pointing ke section Voice Order AI]**

🎤 **"Sistem SIM4LON punya 2 fitur unggulan."**

**[Gesture microphone - animated]**

🎤 **"Yang pertama, Voice Order AI. Jadi operator bisa buat pesanan hanya dengan BICARA."**

**[Explain flow dengan gesture]**

🎤 **"Contohnya, operator ucapkan: 'Lima puluh tabung dua belas kilo ke Reon'."**

**[Trace flow di slide]**

🎤 **"Web Speech API di browser capture suara, convert jadi text transcript real-time."**

🎤 **"Transcript dikirim ke Google Gemini 2.0 Flash API dengan prompt: 'Extract order information from this text'."**

🎤 **"AI parse dan return JSON: pangkalanName 'Reon', lpg_type '12kg', quantity 50."**

🎤 **"Sistem fuzzy matching untuk cari pangkalan. Jadi kalau operator bilang 'Rion' tapi yang bener 'Reon', sistem tetap bisa match dengan confidence 93 persen."**

🎤 **"Validate stock availability, generate ORD-XXXX, dan tampilkan konfirmasi ke operator."**

**[Emphasis benefit]**

🎤 **"Ini menghemat waktu signifikan. Dari 5 menit manual input jadi 30 detik voice order. Terutama kalau operator lagi multitasking, bisa sambil telpon sambil input pesanan lewat suara."**

**[Pointing ke section DSS]**

🎤 **"Fitur kedua, Decision Support System dengan alert 3 warna."**

**[Pointing ke 🟢🟡🔴]**

🎤 **"Hijau untuk stok AMAN, quantity lebih dari warning level."**

🎤 **"Kuning untuk stok RENDAH, perlu order dalam 2-3 hari."**

🎤 **"Merah untuk stok KRITIS - ini pulsing animation - perlu order HARI INI, urgent."**

**[Explain multi-tenant]**

🎤 **"Dan karena multi-tenant, setiap pangkalan hanya lihat alert untuk stok mereka sendiri. Data terisolasi berdasarkan JWT token yang berisi pangkalanId."**

**[Shift ke Testing section]**

🎤 **"Untuk memastikan kualitas sistem, saya melakukan testing komprehensif."**

**[Pointing ke BlackBox]**

🎤 **"BlackBox testing dengan 189 test cases, covering semua functionality, validation, dan integration."**

**[Emphasis result]**

🎤 **"Hasilnya 187 valid, 2 invalid, success rate 98.94 persen. Dua test case yang gagal sudah diperbaiki: upload file size validation dan race condition handling."**

**[Pointing ke UAT]**

🎤 **"User Acceptance Testing dengan 5 responden: 1 Admin, 1 Operator, 3 Pangkalan."**

**[Explain SUS]**

🎤 **"Menggunakan System Usability Scale, kuesioner standar 10 pertanyaan dengan skala 1-5."**

**[Emphasis result dengan pride]**

🎤 **"Hasilnya SUS Score 87.5 dari 100, Grade A - Excellent. Ini artinya sistem sangat usable dan mudah digunakan bahkan tanpa training panjang."**

**[Transisi]**

🎤 **"Mari kita lihat kesimpulan dari seluruh presentasi ini."**

**[Click next]**

---

### **SLIDE 18: KESIMPULAN** (3 menit)

**[Read dengan confident tone - eye contact]**

🎤 **"Kesimpulan dari Kerja Praktek SIM4LON ini ada 5 poin utama:"**

**[Pointing nomor 1]**

🎤 **"Pertama, sistem berhasil dibangun dengan 52 diagram UML lengkap yang mencakup semua aspek: dari BPMN untuk proses bisnis, Use Case untuk kebutuhan fungsional, Activity dan Sequence untuk alur detail, Class dan ERD untuk struktur, State Machine untuk lifecycle, sampai Deployment untuk arsitektur fisik."**

**[Pointing nomor 2]**

🎤 **"Kedua, implementasi fitur core:**
- 17 Use Case untuk 3 aktor dengan role-based access control,
- Voice Order AI menggunakan Google Gemini 2.0 Flash untuk efisiensi input,
- Decision Support System dengan alert 3 warna untuk monitoring proaktif,
- Dan multi-tenant architecture untuk isolasi data per pangkalan."

**[Pointing nomor 3]**

🎤 **"Ketiga, testing yang komprehensif dengan hasil excellent:**
- BlackBox testing 98.94 persen success dari 189 test cases,
- User Acceptance Testing dengan SUS Score 87.5, Grade A."

**[Pointing nomor 4]**

🎤 **"Keempat, deployment production-ready di platform cloud:**
- Frontend di Vercel dengan global CDN,
- Backend di Railway dengan auto-scaling,
- Database PostgreSQL managed,
- Dan URL live: https://sim4lon.vercel.app yang bisa diakses siapa saja."

**[Pointing nomor 5 - ini IMPACT]**

🎤 **"Dan yang paling penting, Business Impact yang terukur:"**

**[Read dengan emphasis]**
- "Hemat waktu rekap 90 persen, dari 5 jam jadi 30 menit,"
- "Error pencatatan turun drastis, dari 15 persen jadi kurang dari 1 persen,"
- "Monitoring berubah dari sekali sehari manual jadi real-time 24/7."

**[Eye contact dengan semua penguji - confident]**

🎤 **"Sistem ini tidak hanya automation tool, tapi transformasi digital yang berdampak nyata pada efisiensi operasional PT Mitra Surya Natasya."**

**[Pause 2 detik]**

🎤 **"Demikian presentasi saya. Terima kasih atas perhatian Bapak dan Ibu penguji."**

**[Formal gesture]**

🎤 **"Saya siap menjawab pertanyaan. Tapi sebelum itu, apakah Bapak/Ibu berkenan untuk melihat demo live sistem terlebih dahulu?"**

**[Wait untuk response]**

---

## 🎬 DEMO LIVE SYSTEM (12 menit)

### **PERSIAPAN (30 detik):**

🎤 **"Baik, saya akan demo 3 fitur utama sistem. Mohon ditunggu sebentar."**

**[Actions tanpa bicara]:**
- Minimize PPT
- Buka browser (tab sudah ready)
- Login as Admin (credentials saved)
- Zoom browser 125% (biar keliatan di proyektor)

---

### **DEMO 1: VOICE ORDER AI** (4 menit)

🎤 **"Saya akan demo fitur Voice Order AI."**

**[Navigate ke halaman Kelola Pesanan]**

🎤 **"Ini halaman Kelola Pesanan. Di sini ada floating button microphone."**

**[Click microphone button]**

🎤 **"Begitu saya klik, browser request permission microphone."**

**[Allow permission]**

🎤 **"Sekarang microphone aktif, saya bisa input pesanan dengan suara."**

**[Bicara jelas ke microphone]**

🎤 **"Lima puluh tabung dua belas kilo ke Reon."**

**[Wait 2-3 detik - AI processing]**

🎤 **"Sistem sedang parsing menggunakan Google Gemini..."**

**[Result muncul]**

🎤 **"Dan ini hasilnya. Sistem berhasil detect:**
- Pangkalan: Reon,
- Jenis LPG: 12 kg,
- Quantity: 50 tabung,
- Total amount sudah dihitung otomatis."

**[Pointing ke konfirmasi dialog]**

🎤 **"Saya bisa review dulu sebelum submit. Kalau sudah benar, klik Konfirmasi."**

**[Click Konfirmasi]**

🎤 **"Dan order berhasil dibuat dengan kode ORD-0150."**

**[Navigate ke detail order - show timeline]**

🎤 **"Di timeline, tercatat 'Pesanan dibuat (Voice Order)' dengan timestamp."**

---

### **DEMO 2: UPDATE STATUS + AUTO-SYNC STOK** (5 menit)

🎤 **"Sekarang saya akan demo auto-sync stok."**

**[Pointing ke current status: DRAFT]**

🎤 **"Status saat ini DRAFT. Saya akan update step-by-step sampai SELESAI."**

**[Click "Submit Pesanan"]**

🎤 **"Submit Pesanan... status berubah jadi MENUNGGU_PEMBAYARAN."**

**[Navigate ke Catat Pembayaran]**

🎤 **"Sekarang catat pembayaran."**

**[Fill form]**
- Method: TRANSFER
- Amount: [auto-filled dari total]
- Upload bukti: [browse file screenshot]

🎤 **"Saya upload bukti transfer, lalu submit."**

**[Submit]**

🎤 **"Sistem otomatis detect pembayaran LUNAS, dan status auto-update ke DIPROSES."**

**[Back ke detail order]**

🎤 **"Lihat, status sudah DIPROSES tanpa saya manual ubah. Ini karena logic: if is_paid = true, auto-transition."**

**[Update status ke SIAP_KIRIM]**

🎤 **"Barang sudah siap, update ke SIAP_KIRIM. Assign driver... pilih Driver Ahmad."**

**[Update status ke DIKIRIM]**

🎤 **"Driver berangkat, update ke DIKIRIM."**

**[Pause - serious tone]**

🎤 **"Dan sekarang bagian yang paling critical."**

**[Update status ke SELESAI - dengan emphasis]**

🎤 **"Saya update status ke SELESAI."**

**[Submit - wait 1-2 detik]**

**[Alert muncul: "Stok pangkalan berhasil diupdate"]**

🎤 **"Sistem menampilkan notifikasi: Stok pangkalan berhasil diupdate."**

**[Navigate ke Kelola Stok Pangkalan]**

🎤 **"Sekarang kita cek stok pangkalan."**

**[Filter Pangkalan: Reon]**

🎤 **"Filter pangkalan Reon..."**

**[Pointing ke LPG 12kg row]**

🎤 **"Lihat, stok LPG 12kg untuk Pangkalan Reon sebelumnya 45 tabung."**

**[Pointing ke qty baru]**

🎤 **"Sekarang otomatis bertambah 50, jadi 95 tabung. Ini TANPA saya manual input ke menu stok."**

**[Navigate ke Stock Movements]**

🎤 **"Dan di stock movement log, tercatat:"**

**[Read log]**
- "Type: MASUK,"
- "Source: ORDER_COMPLETE,"
- "Quantity: +50,"
- "Order Code: ORD-0150."

🎤 **"Jadi audit trail lengkap. Kita tahu kapan, dari mana, dan berapa stok berubah."**

---

### **DEMO 3: DASHBOARD DSS PANGKALAN** (3 menit)

🎤 **"Terakhir, saya akan demo fitur untuk Pangkalan."**

**[Logout Admin]**

🎤 **"Saya logout dari Admin..."**

**[Login as Pangkalan: Reon]**

🎤 **"Dan login sebagai Pangkalan Reon."**

**[Dashboard muncul]**

🎤 **"Ini dashboard khusus untuk Pangkalan dengan Decision Support System."**

**[Pointing ke cards stok]**

🎤 **"Ada 3 cards dengan warna berbeda sesuai status stok:"**

**[Point card hijau]**

🎤 **"Yang hijau: LPG 3kg dengan 250 tabung. Status AMAN karena di atas warning level."**

**[Point card kuning]**

🎤 **"Yang kuning: LPG 12kg dengan 95 tabung - ini yang baru kita update tadi. Status RENDAH, perlu order dalam 2-3 hari."**

**[Point card merah - with emphasis]**

🎤 **"Dan yang merah dengan animation pulsing: LPG 50kg hanya 5 tabung. Status KRITIS, harus order hari ini."**

**[Explain benefit]**

🎤 **"Jadi pangkalan langsung tahu prioritas mana yang harus di-handle duluan. Visual alert sangat membantu decision making."**

**[Navigate ke Catat Penjualan]**

🎤 **"Pangkalan juga bisa catat penjualan harian mereka."**

**[Create sale]**
- Consumer: Ibu Siti
- LPG: 12kg
- Qty: 10 tabung

🎤 **"Input penjualan 10 tabung ke konsumen... submit."**

**[Back to dashboard]**

🎤 **"Kembali ke dashboard, stok LPG 12kg berkurang otomatis dari 95 jadi 85 tabung."**

**[Pointing ke grafik/chart jika ada]**

🎤 **"Dan ada chart penjualan untuk tracking omset mereka sendiri."**

---

### **PENUTUP DEMO** (30 detik)

**[Minimize browser, back to PPT slide 18]**

🎤 **"Baik, itu tadi demo live sistem SIM4LON yang sudah production-ready di https://sim4lon.vercel.app."**

**[Eye contact]**

🎤 **"Sekarang saya siap menjawab pertanyaan dari Bapak dan Ibu penguji."**

---

## ❓ Q&A SESSION (10 menit)

### **Tips Menjawab Pertanyaan:**

**[Saat penguji mulai bertanya]**

1. **Dengarkan sampai SELESAI** - jangan interrupt
2. **Pause 2 detik** sebelum jawab (berpikir)
3. **Ulangi pertanyaan** dengan bahasa sendiri (biar clear)
4. **Jawab LANGSUNG** ke poin (jangan bertele-tele)
5. **Refer ke slide/demo** jika relevan: "Seperti yang Bapak lihat di slide 15..."
6. **Jujur jika tidak tahu**: "Untuk detail implementasi X, saya belum eksplorasi mendalam. Yang saya fokuskan adalah Y dan Z."
7. **Pivot ke kekuatan Anda**: "Tapi yang saya implement adalah..."
8. **Terima feedback**: "Terima kasih masukannya Pak, akan saya pertimbangkan untuk future enhancement."

### **Contoh Response Template:**

**Q: "Kenapa pakai Waterfall bukan Agile?"**

🎤 **[Pause 2 detik]**

🎤 **"Terima kasih pertanyaannya Pak. Saya pakai Waterfall karena 3 alasan strategis:**

1. Requirements sudah jelas dari awal hasil wawancara lengkap dengan PT MSN,
2. Timeline KP fixed 12 minggu tidak bisa extend,
3. Dan dokumentasi penting untuk handover.

Agile cocok untuk project yang requirements-nya masih uncertain dan butuh iterasi cepat. Tapi untuk case SIM4LON, Waterfall lebih efisien."**

---

**Q: "Bagaimana handle concurrency untuk prevent duplicate order code?"**

🎤 **[Pause 2 detik]**

🎤 **"Excellent question Pak. Untuk handle concurrency, saya implement 2 layer:**

1. Database level: PostgreSQL transaction dengan isolation level READ COMMITTED,
2. Code level: Generate ORD code dalam transaction dengan SELECT MAX... WHERE FOR UPDATE untuk row-level locking.

Sudah saya load test dengan JMeter, 50 concurrent requests tanpa ada duplicate code."**

---

**Q: "Kalau Voice Order-nya salah parse gimana?"**

🎤 **[Pause 2 detik]**

🎤 **"Good point Pak. Voice Order adalah enhancement, bukan critical path. Kalau AI salah parse:**

1. User bisa edit manual di konfirmasi dialog sebelum submit,
2. Atau cancel dan pakai form manual tradisional.

Dari testing, accuracy Gemini 2.0 Flash sekitar 95 persen untuk Bahasa Indonesia natural. Fuzzy matching naikin jadi 98 persen."**

---

## 🏁 PENUTUP FINAL

**[Setelah Q&A selesai]**

🎤 **"Terima kasih Bapak dan Ibu penguji atas pertanyaan dan masukannya. Saya akan perbaiki dan pertimbangkan untuk pengembangan selanjutnya."**

**[Formal gesture]**

🎤 **"Demikian presentasi Kerja Praktek saya. Wassalamualaikum warahmatullahi wabarakatuh."**

**[Bow/slight nod]**

---

## 📋 CHECKLIST FINAL

### **H-Day Morning:**
- [ ] Charge laptop 100%
- [ ] Test projector connection (30 min before)
- [ ] Login semua akun (Admin, Pangkalan)
- [ ] Buka browser tabs:
  - Tab 1: PPT presentation
  - Tab 2: SIM4LON Admin dashboard (logged in)
  - Tab 3: SIM4LON Pangkalan Reon (logged in)
- [ ] Prepare dummy data untuk demo
- [ ] Print handout 2 copies
- [ ] Print UML_CheatSheet 1 copy (for you)
- [ ] Deep breath, confidence! 💪

---

**Total Preparation: 100%**
**Expected Score: A (90+)**

**Semoga sukses seminarnya! 🎓🎉**
