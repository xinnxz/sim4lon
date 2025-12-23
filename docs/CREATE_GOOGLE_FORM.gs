/**
 * ============================================================
 * GOOGLE APPS SCRIPT - CLIENT REQUIREMENT FORM GENERATOR
 * ============================================================
 * 
 * CARA PENGGUNAAN:
 * 1. Buka https://script.google.com
 * 2. Klik "New Project" atau "Proyek baru"
 * 3. Hapus semua kode yang ada
 * 4. Copy-paste seluruh kode ini
 * 5. Klik tombol "Run" (▶) atau tekan Ctrl+R
 * 6. Izinkan permission yang diminta (pilih akun Google Anda)
 * 7. Cek email/log untuk mendapatkan link form yang sudah jadi!
 * 
 * ============================================================
 */

function createClientRequirementForm() {
  // Buat form baru
  var form = FormApp.create('📋 Form Requirement Dashboard Website');
  
  // Set deskripsi form
  form.setDescription(
    'Form ini digunakan untuk mengumpulkan kebutuhan proyek pembuatan website dashboard.\n\n' +
    'Mohon isi dengan selengkap mungkin agar kami dapat memberikan estimasi dan solusi yang tepat.\n\n' +
    '⏱️ Estimasi waktu pengisian: 10-15 menit'
  );
  
  // Aktifkan koleksi email (opsional)
  form.setCollectEmail(true);
  
  // ============================================================
  // BAGIAN A: INFORMASI DASAR BISNIS
  // ============================================================
  form.addSectionHeaderItem()
    .setTitle('📍 BAGIAN A: Informasi Dasar Bisnis')
    .setHelpText('Informasi tentang perusahaan/usaha Anda');
  
  form.addTextItem()
    .setTitle('Nama Perusahaan/Usaha')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Jenis Bisnis/Industri')
    .setHelpText('Contoh: Retail, F&B, Jasa, Manufaktur, dll')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Alamat Perusahaan')
    .setRequired(false);
  
  form.addTextItem()
    .setTitle('Website/Social Media (jika ada)')
    .setHelpText('Contoh: www.example.com atau @instagram_handle')
    .setRequired(false);
  
  form.addTextItem()
    .setTitle('Nama PIC (Person in Charge)')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('No. Telepon/WhatsApp')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Email')
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Deskripsi Singkat Bisnis Anda')
    .setHelpText('Jelaskan secara singkat tentang bisnis Anda, produk/jasa yang ditawarkan, dan target pasar')
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Masalah yang Ingin Diselesaikan')
    .setHelpText('Apa kendala/masalah saat ini yang ingin diselesaikan dengan dashboard ini?')
    .setRequired(true);
  
  // ============================================================
  // BAGIAN B: TUJUAN & SCOPE DASHBOARD
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🎯 BAGIAN B: Tujuan & Scope Dashboard');
  
  form.addCheckboxItem()
    .setTitle('Tujuan Utama Dashboard')
    .setHelpText('Pilih semua yang sesuai')
    .setChoiceValues([
      'Monitoring data bisnis secara real-time',
      'Manajemen inventori/stok',
      'Manajemen pesanan/transaksi',
      'Manajemen pelanggan/customer',
      'Manajemen karyawan/pegawai',
      'Laporan dan analitik',
      'Manajemen keuangan',
      'Penjadwalan/booking',
      'CRM (Customer Relationship Management)',
      'Lainnya (sebutkan di kolom berikutnya)'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Tujuan lainnya (jika ada)')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Siapa saja yang akan menggunakan dashboard ini?')
    .setHelpText('Contoh:\n- Admin: Kelola semua data (1 orang)\n- Manager: Lihat laporan (3 orang)\n- Operator: Input data (5 orang)')
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah perlu pembatasan akses berdasarkan role?')
    .setChoiceValues([
      'Ya, setiap role memiliki akses berbeda',
      'Tidak, semua pengguna memiliki akses yang sama',
      'Belum tahu, butuh saran'
    ])
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Jelaskan pembatasan akses (jika ada)')
    .setHelpText('Contoh: Admin bisa edit & hapus, Operator hanya bisa input')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN C: FITUR & FUNGSIONALITAS
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📊 BAGIAN C: Fitur & Fungsionalitas');
  
  form.addCheckboxItem()
    .setTitle('Fitur Dashboard & Reporting')
    .setChoiceValues([
      'Dashboard overview dengan grafik/chart',
      'Laporan harian/mingguan/bulanan',
      'Export data ke Excel/PDF',
      'Print laporan',
      'Filter data berdasarkan tanggal/kategori',
      'Grafik perbandingan periode',
      'Notifikasi target tercapai'
    ])
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Fitur Manajemen Data Master')
    .setChoiceValues([
      'Data Produk/Barang',
      'Data Pelanggan/Customer',
      'Data Supplier/Vendor',
      'Data Karyawan/User',
      'Data Cabang/Lokasi',
      'Data Kategori',
      'Data Harga',
      'Data Diskon/Promo'
    ])
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Fitur Transaksi & Operasional')
    .setChoiceValues([
      'Input pesanan/order',
      'Tracking status pesanan',
      'Manajemen stok/inventori',
      'Pembayaran/Invoice',
      'Pengiriman/Delivery',
      'Retur/Pengembalian',
      'Histori transaksi',
      'Cetak struk/invoice'
    ])
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Fitur Komunikasi & Notifikasi')
    .setChoiceValues([
      'Notifikasi dalam aplikasi',
      'Notifikasi email',
      'Notifikasi WhatsApp',
      'Chat internal',
      'Reminder otomatis'
    ])
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Fitur Keamanan & Akses')
    .setChoiceValues([
      'Login/Logout',
      'Multi-level user role',
      'Audit trail/Log aktivitas',
      'Reset password',
      'Two-factor authentication',
      'Session timeout'
    ])
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Fitur khusus lainnya yang dibutuhkan')
    .setHelpText('Jelaskan fitur spesifik yang belum tercantum di atas')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN D: DATA & INTEGRASI
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📁 BAGIAN D: Data & Integrasi');
  
  form.addParagraphTextItem()
    .setTitle('Jenis data utama yang akan dikelola')
    .setHelpText('Contoh:\n- Data Produk: nama, harga, stok, kategori\n- Data Customer: nama, alamat, telepon\n- Data Order: tanggal, produk, qty, status')
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah sudah ada data yang perlu dimigrasi?')
    .setChoiceValues([
      'Ya, data ada di Excel/Spreadsheet',
      'Ya, data ada di sistem/software lain',
      'Ya, data ada di database lain',
      'Tidak, mulai dari nol'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Estimasi volume data')
    .setHelpText('Contoh: 1000 produk, 500 customer, 10000 transaksi/bulan')
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Integrasi dengan sistem lain')
    .setHelpText('Apakah dashboard ini perlu terhubung dengan sistem/platform lain?')
    .setChoiceValues([
      'Payment Gateway (Midtrans, Xendit, dll)',
      'WhatsApp Business API',
      'Email Service (Gmail, SMTP, dll)',
      'Marketplace (Tokopedia, Shopee, dll)',
      'Software Akuntansi (Accurate, Jurnal, dll)',
      'Google Maps/Location',
      'POS/Kasir',
      'Tidak perlu integrasi'
    ])
    .setRequired(false);
  
  form.addTextItem()
    .setTitle('Integrasi lainnya (jika ada)')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN E: DESAIN & USER EXPERIENCE
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🎨 BAGIAN E: Desain & User Experience');
  
  form.addMultipleChoiceItem()
    .setTitle('Preferensi Warna')
    .setChoiceValues([
      'Biru (profesional)',
      'Hijau (fresh, ramah lingkungan)',
      'Merah/Oranye (energik)',
      'Ungu (premium)',
      'Hitam/Dark mode (modern)',
      'Sesuai branding/logo perusahaan',
      'Terserah designer'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Gaya Desain')
    .setChoiceValues([
      'Minimalis & Clean',
      'Modern & Colorful',
      'Corporate & Formal',
      'Playful & Fun',
      'Terserah designer'
    ])
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Referensi Website/Dashboard yang Disukai')
    .setHelpText('Sebutkan URL website atau nama aplikasi yang desainnya Anda sukai, beserta alasannya')
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Logo & Brand Asset yang sudah dimiliki')
    .setChoiceValues([
      'Logo perusahaan',
      'Panduan warna brand',
      'Font brand',
      'Belum ada, perlu dibuatkan'
    ])
    .setRequired(false);
  
  // ============================================================
  // BAGIAN F: PLATFORM & AKSES
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📱 BAGIAN F: Platform & Akses');
  
  form.addCheckboxItem()
    .setTitle('Platform yang Dibutuhkan')
    .setChoiceValues([
      'Web (akses via browser)',
      'Mobile App Android',
      'Mobile App iOS',
      'Desktop Application'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Kebutuhan Responsif')
    .setChoiceValues([
      'Harus bisa diakses dari HP/tablet',
      'Cukup untuk desktop/laptop saja'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Akses Internet')
    .setChoiceValues([
      'Online only (butuh internet)',
      'Offline capable (bisa tanpa internet)',
      'Belum tahu'
    ])
    .setRequired(true);
  
  // ============================================================
  // BAGIAN G: TIMELINE & BUDGET
  // ============================================================
  form.addPageBreakItem()
    .setTitle('⏰ BAGIAN G: Timeline & Budget');
  
  form.addDateItem()
    .setTitle('Target Mulai Pengerjaan')
    .setRequired(false);
  
  form.addDateItem()
    .setTitle('Target Deadline Selesai')
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Urgency Level')
    .setChoiceValues([
      'Sangat Urgent (< 2 minggu)',
      'Urgent (2-4 minggu)',
      'Normal (1-2 bulan)',
      'Fleksibel (> 2 bulan)'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Budget Range')
    .setChoiceValues([
      '< Rp 10 juta',
      'Rp 10 - 25 juta',
      'Rp 25 - 50 juta',
      'Rp 50 - 100 juta',
      '> Rp 100 juta',
      'Negotiable (tergantung fitur)'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Model Pembayaran yang Diharapkan')
    .setChoiceValues([
      'Bayar lunas di awal',
      'Termin (DP 50% + Pelunasan 50%)',
      'Milestone-based (bayar per tahap)',
      'Lainnya'
    ])
    .setRequired(true);
  
  // ============================================================
  // BAGIAN H: MAINTENANCE & SUPPORT
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🔧 BAGIAN H: Maintenance & Support');
  
  form.addMultipleChoiceItem()
    .setTitle('Kebutuhan Hosting')
    .setChoiceValues([
      'Sudah punya hosting/server',
      'Butuh dicarikan hosting',
      'Belum tahu'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Domain')
    .setChoiceValues([
      'Sudah punya domain',
      'Butuh dibantu beli domain',
      'Belum tahu'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Nama domain yang sudah dimiliki (jika ada)')
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Maintenance Bulanan')
    .setHelpText('Apakah butuh paket maintenance setelah go-live?')
    .setChoiceValues([
      'Ya, butuh maintenance rutin',
      'Tidak, cukup serah terima saja',
      'Belum tahu, jelaskan opsinya'
    ])
    .setRequired(true);
  
  form.addCheckboxItem()
    .setTitle('Pelatihan/Training')
    .setChoiceValues([
      'Butuh training penggunaan langsung',
      'Butuh training via video call',
      'Butuh dokumentasi/manual book',
      'Butuh video tutorial',
      'Tidak perlu'
    ])
    .setRequired(false);
  
  // ============================================================
  // BAGIAN I: CATATAN TAMBAHAN
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📝 BAGIAN I: Catatan Tambahan');
  
  form.addParagraphTextItem()
    .setTitle('Pertanyaan atau Concern')
    .setHelpText('Tuliskan pertanyaan atau kekhawatiran Anda terkait proyek ini')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Fitur yang Mungkin Dibutuhkan di Masa Depan')
    .setHelpText('Sebutkan fitur tambahan yang mungkin ingin ditambahkan setelah versi pertama selesai')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Catatan Lainnya')
    .setHelpText('Informasi tambahan yang ingin disampaikan')
    .setRequired(false);
  
  // ============================================================
  // KONFIRMASI
  // ============================================================
  form.addPageBreakItem()
    .setTitle('✅ Konfirmasi');
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah Anda bersedia dihubungi untuk diskusi lebih lanjut?')
    .setChoiceValues([
      'Ya, silakan hubungi saya',
      'Via WhatsApp saja',
      'Via Email saja',
      'Tunggu saya yang menghubungi'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Bagaimana Anda mengetahui layanan kami?')
    .setChoiceValues([
      'Referensi teman/kolega',
      'Social Media (Instagram/Facebook)',
      'Google Search',
      'LinkedIn',
      'Portfolio/Website',
      'Lainnya'
    ])
    .setRequired(false);
  
  // Set konfirmasi message
  form.setConfirmationMessage(
    '🎉 Terima kasih telah mengisi form ini!\n\n' +
    'Tim kami akan segera mereview kebutuhan Anda dan menghubungi dalam 1-2 hari kerja.\n\n' +
    'Jika ada pertanyaan urgent, silakan hubungi kami langsung.'
  );
  
  // Log URL form
  var formUrl = form.getEditUrl();
  var publishedUrl = form.getPublishedUrl();
  
  Logger.log('============================================================');
  Logger.log('🎉 FORM BERHASIL DIBUAT!');
  Logger.log('============================================================');
  Logger.log('');
  Logger.log('📝 URL untuk EDIT form:');
  Logger.log(formUrl);
  Logger.log('');
  Logger.log('🔗 URL untuk SHARE ke client:');
  Logger.log(publishedUrl);
  Logger.log('');
  Logger.log('============================================================');
  
  // Tampilkan alert
  SpreadsheetApp.getUi().alert(
    '🎉 Form Berhasil Dibuat!\n\n' +
    'Cek View > Logs (Ctrl+Enter) untuk melihat URL form.\n\n' +
    'Atau buka Google Forms Anda untuk melihat form yang baru dibuat.'
  );
  
  return form;
}

/**
 * Fungsi untuk menjalankan dari menu (opsional)
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Form Generator')
    .addItem('Buat Form Requirement', 'createClientRequirementForm')
    .addToUi();
}
