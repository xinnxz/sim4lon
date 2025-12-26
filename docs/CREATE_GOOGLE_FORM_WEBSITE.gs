/**
 * ============================================================
 * GOOGLE APPS SCRIPT - WEBSITE REQUIREMENT FORM GENERATOR
 * ============================================================
 * 
 * Form ini untuk pengumpulan requirement pembuatan WEBSITE secara umum
 * Bisa digunakan untuk: Company Profile, E-Commerce, Landing Page,
 * Portfolio, Blog, dll.
 * 
 * CARA PENGGUNAAN:
 * 1. Buka https://script.google.com
 * 2. Klik "New Project" atau "Proyek baru"
 * 3. Hapus semua kode yang ada
 * 4. Copy-paste seluruh kode ini
 * 5. Klik tombol "Run" (▶) atau tekan Ctrl+R
 * 6. Izinkan permission yang diminta
 * 7. Cek Execution Log untuk mendapatkan link form!
 * 
 * ============================================================
 */

function createWebsiteRequirementForm() {
  // Buat form baru
  var form = FormApp.create('📋 Form Requirement Pembuatan Website');
  
  // Set deskripsi form
  form.setDescription(
    'Terima kasih atas kepercayaan Anda!\n\n' +
    'Form ini digunakan untuk mengumpulkan kebutuhan proyek pembuatan website Anda.\n' +
    'Mohon isi dengan selengkap mungkin agar kami dapat memberikan estimasi dan solusi yang tepat.\n\n' +
    '⏱️ Estimasi waktu pengisian: 5-10 menit'
  );
  
  // Aktifkan koleksi email
  form.setCollectEmail(true);
  
  // ============================================================
  // BAGIAN 1: DATA CLIENT
  // ============================================================
  form.addSectionHeaderItem()
    .setTitle('👤 BAGIAN 1: Data Anda')
    .setHelpText('Informasi kontak untuk komunikasi lebih lanjut');
  
  form.addTextItem()
    .setTitle('Nama Lengkap')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Nama Perusahaan/Usaha/Brand')
    .setHelpText('Isi dengan nama brand jika untuk personal branding')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('No. WhatsApp')
    .setHelpText('Contoh: 08123456789')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Alamat/Lokasi')
    .setHelpText('Kota/Kabupaten saja sudah cukup')
    .setRequired(false);
  
  form.addTextItem()
    .setTitle('Website/Social Media saat ini (jika ada)')
    .setHelpText('Instagram, Facebook, website lama, dll')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN 2: JENIS WEBSITE
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🌐 BAGIAN 2: Jenis Website yang Diinginkan');
  
  form.addMultipleChoiceItem()
    .setTitle('Jenis website yang ingin dibuat')
    .setChoiceValues([
      'Company Profile (profil perusahaan)',
      'Landing Page (1 halaman promosi)',
      'E-Commerce / Toko Online',
      'Portfolio / Personal Branding',
      'Blog / Media Online',
      'Web Application / Dashboard',
      'Katalog Produk (tanpa transaksi online)',
      'Website Organisasi / Komunitas',
      'Website Sekolah / Pendidikan',
      'Website Event / Undangan Digital',
      'Lainnya (jelaskan di bawah)'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Jika memilih "Lainnya", jelaskan di sini')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Jelaskan tentang bisnis/usaha Anda')
    .setHelpText('Apa produk/jasa yang ditawarkan? Siapa target market Anda?')
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Apa tujuan utama website ini?')
    .setHelpText('Contoh: meningkatkan penjualan, membangun trust/kredibilitas, mempermudah customer menghubungi, dll')
    .setRequired(true);
  
  // ============================================================
  // BAGIAN 3: HALAMAN & FITUR
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📄 BAGIAN 3: Halaman & Fitur');
  
  form.addCheckboxItem()
    .setTitle('Halaman yang dibutuhkan')
    .setHelpText('Pilih semua yang sesuai')
    .setChoiceValues([
      'Home (Beranda)',
      'About Us (Tentang Kami)',
      'Products/Services (Produk/Layanan)',
      'Portfolio/Gallery',
      'Blog/Artikel',
      'Contact (Kontak)',
      'FAQ',
      'Testimonial',
      'Team/Tim Kami',
      'Pricing (Daftar Harga)',
      'Career (Karir/Lowongan)',
      'Terms & Privacy Policy'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Halaman lainnya yang dibutuhkan')
    .setHelpText('Sebutkan jika ada halaman khusus yang tidak ada di daftar')
    .setRequired(false);
  
  form.addCheckboxItem()
    .setTitle('Fitur yang dibutuhkan')
    .setHelpText('Pilih semua yang sesuai')
    .setChoiceValues([
      'Form Kontak / Inquiry',
      'WhatsApp Button (tombol chat WA)',
      'Google Maps (lokasi)',
      'Social Media Links',
      'Newsletter/Email Subscription',
      'Live Chat',
      'Search/Pencarian',
      'Multi Bahasa (Indonesia & English)',
      'Blog/CMS (bisa posting artikel sendiri)',
      'Login Member/Customer',
      'Booking/Appointment System',
      'Payment Gateway (pembayaran online)',
      'Shopping Cart (keranjang belanja)',
      'Product Filter & Search',
      'Review/Rating Produk',
      'Download Catalog/Brosur',
      'Video Background/Embed',
      'Animation/Efek Visual'
    ])
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Fitur khusus lainnya')
    .setHelpText('Jelaskan jika ada fitur spesifik yang tidak ada di daftar')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN 4: KONTEN & MATERI
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📝 BAGIAN 4: Konten & Materi');
  
  form.addMultipleChoiceItem()
    .setTitle('Siapa yang menyiapkan konten/teks website?')
    .setChoiceValues([
      'Saya sudah punya konten lengkap (tinggal dipasang)',
      'Saya punya sebagian, butuh bantuan melengkapi',
      'Saya butuh dibuatkan semua kontennya (copywriting)',
      'Belum tahu'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Bagaimana dengan foto/gambar produk?')
    .setChoiceValues([
      'Sudah punya foto berkualitas tinggi',
      'Punya foto tapi kualitas seadanya',
      'Belum punya, butuh difotokan/dibuatkan',
      'Bisa pakai stock photo (gambar dari internet)'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah sudah punya logo?')
    .setChoiceValues([
      'Ya, sudah punya logo (format PNG/AI/SVG)',
      'Ya, tapi hanya format JPG/kualitas rendah',
      'Belum punya, butuh dibuatkan',
      'Belum punya, akan buat sendiri/terpisah'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Berapa jumlah produk/layanan?')
    .setHelpText('Contoh: 50 produk, 10 layanan, atau "akan terus bertambah"')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN 5: DESAIN & TAMPILAN
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🎨 BAGIAN 5: Desain & Tampilan');
  
  form.addMultipleChoiceItem()
    .setTitle('Preferensi warna utama')
    .setChoiceValues([
      'Biru (profesional, terpercaya)',
      'Hijau (fresh, ramah lingkungan, kesehatan)',
      'Merah/Oranye (energik, food & beverage)',
      'Ungu/Pink (premium, feminin, beauty)',
      'Hitam/Gold (luxury, premium)',
      'Putih/Minimalis (clean, modern)',
      'Sesuai warna logo/brand',
      'Terserah designer'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Gaya desain yang disukai')
    .setChoiceValues([
      'Minimalis & Clean (simpel, banyak white space)',
      'Modern & Bold (warna tegas, typography besar)',
      'Corporate & Professional (formal, rapi)',
      'Playful & Colorful (ceria, banyak warna)',
      'Elegant & Luxury (mewah, premium)',
      'Terserah designer'
    ])
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Website referensi yang disukai')
    .setHelpText('Sebutkan URL website yang desainnya Anda suka dan jelaskan apa yang disukai\nContoh: www.apple.com - suka karena clean dan elegan')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Website kompetitor')
    .setHelpText('Sebutkan website pesaing/kompetitor jika ada')
    .setRequired(false);
  
  // ============================================================
  // BAGIAN 6: DOMAIN & HOSTING
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🔧 BAGIAN 6: Domain & Hosting');
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah sudah punya domain?')
    .setHelpText('Domain adalah alamat website, contoh: www.namaanda.com')
    .setChoiceValues([
      'Ya, sudah punya',
      'Belum, butuh dibantu beli',
      'Belum tahu, jelaskan dulu'
    ])
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Nama domain yang sudah dimiliki (jika ada)')
    .setHelpText('Contoh: www.namabrand.com')
    .setRequired(false);
  
  form.addTextItem()
    .setTitle('Nama domain yang diinginkan (jika belum punya)')
    .setHelpText('Contoh: namabrand.com atau namabrand.co.id')
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah sudah punya hosting?')
    .setHelpText('Hosting adalah tempat penyimpanan file website')
    .setChoiceValues([
      'Ya, sudah punya',
      'Belum, butuh dicarikan',
      'Belum tahu, jelaskan dulu'
    ])
    .setRequired(true);
  
  // ============================================================
  // BAGIAN 7: TIMELINE & BUDGET
  // ============================================================
  form.addPageBreakItem()
    .setTitle('⏰ BAGIAN 7: Timeline & Budget');
  
  form.addMultipleChoiceItem()
    .setTitle('Kapan website ini harus selesai?')
    .setChoiceValues([
      'Secepatnya / URGENT (< 1 minggu)',
      '1-2 minggu',
      '2-4 minggu',
      '1-2 bulan',
      'Tidak ada deadline khusus'
    ])
    .setRequired(true);
  
  form.addDateItem()
    .setTitle('Tanggal deadline (jika ada)')
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Budget yang tersedia')
    .setChoiceValues([
      '< Rp 1 juta',
      'Rp 1 - 3 juta',
      'Rp 3 - 5 juta',
      'Rp 5 - 10 juta',
      'Rp 10 - 25 juta',
      'Rp 25 - 50 juta',
      '> Rp 50 juta',
      'Negotiable (tergantung fitur)'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Metode pembayaran yang diinginkan')
    .setChoiceValues([
      'Bayar lunas di awal',
      'DP 50% + Pelunasan 50%',
      'Cicilan/Termin bertahap',
      'Bisa dibicarakan'
    ])
    .setRequired(true);
  
  // ============================================================
  // BAGIAN 8: AFTER SERVICE
  // ============================================================
  form.addPageBreakItem()
    .setTitle('🛠️ BAGIAN 8: Layanan Setelah Website Jadi');
  
  form.addMultipleChoiceItem()
    .setTitle('Siapa yang akan mengelola website setelah jadi?')
    .setChoiceValues([
      'Saya/tim saya sendiri',
      'Butuh dikelola oleh developer (maintenance)',
      'Belum tahu'
    ])
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Apakah butuh training cara update website?')
    .setChoiceValues([
      'Ya, butuh training langsung/tatap muka',
      'Ya, cukup via video call',
      'Ya, cukup video tutorial',
      'Tidak perlu, saya sudah familiar',
      'Tidak perlu, akan dikelola developer'
    ])
    .setRequired(true);
  
  form.addCheckboxItem()
    .setTitle('Layanan tambahan yang mungkin dibutuhkan')
    .setChoiceValues([
      'Maintenance bulanan (update & backup rutin)',
      'SEO (optimasi Google)',
      'Google Ads/Facebook Ads',
      'Social Media Management',
      'Pembuatan konten/copywriting berkala',
      'Desain grafis (banner, poster, dll)',
      'Email profesional (@namadomain.com)',
      'Tidak ada'
    ])
    .setRequired(false);
  
  // ============================================================
  // BAGIAN 9: TAMBAHAN
  // ============================================================
  form.addPageBreakItem()
    .setTitle('📌 BAGIAN 9: Informasi Tambahan');
  
  form.addParagraphTextItem()
    .setTitle('Ada pertanyaan atau concern khusus?')
    .setHelpText('Tuliskan kekhawatiran atau pertanyaan yang ingin Anda tanyakan')
    .setRequired(false);
  
  form.addParagraphTextItem()
    .setTitle('Catatan/informasi tambahan lainnya')
    .setHelpText('Hal penting lain yang ingin disampaikan')
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Bagaimana Anda mengetahui layanan kami?')
    .setChoiceValues([
      'Instagram',
      'Facebook',
      'TikTok',
      'Google Search',
      'Rekomendasi teman/kolega',
      'Portfolio sebelumnya',
      'Lainnya'
    ])
    .setRequired(false);
  
  form.addMultipleChoiceItem()
    .setTitle('Kapan waktu yang baik untuk dihubungi?')
    .setChoiceValues([
      'Pagi (08:00 - 12:00)',
      'Siang (12:00 - 15:00)',
      'Sore (15:00 - 18:00)',
      'Malam (18:00 - 21:00)',
      'Kapan saja'
    ])
    .setRequired(true);
  
  // ============================================================
  // KONFIRMASI
  // ============================================================
  form.addPageBreakItem()
    .setTitle('✅ Konfirmasi');
  
  form.addMultipleChoiceItem()
    .setTitle('Saya siap untuk memulai proyek ini')
    .setChoiceValues([
      'Ya, saya serius dan siap mulai',
      'Masih survei/mencari informasi dulu',
      'Tergantung harga dan penawaran'
    ])
    .setRequired(true);
  
  // Set konfirmasi message
  form.setConfirmationMessage(
    '🎉 Terima kasih telah mengisi form ini!\n\n' +
    'Tim kami akan segera mereview kebutuhan Anda dan menghubungi via WhatsApp dalam 1x24 jam.\n\n' +
    'Jika ada pertanyaan mendesak, silakan hubungi kami langsung.\n\n' +
    'Salam,\nTim Developer'
  );
  
  // Log URL form
  var formUrl = form.getEditUrl();
  var publishedUrl = form.getPublishedUrl();
  
  console.log('============================================================');
  console.log('🎉 FORM BERHASIL DIBUAT!');
  console.log('============================================================');
  console.log('');
  console.log('📝 URL untuk EDIT form:');
  console.log(formUrl);
  console.log('');
  console.log('🔗 URL untuk SHARE ke client:');
  console.log(publishedUrl);
  console.log('');
  console.log('============================================================');
  console.log('');
  console.log('CARA MELIHAT FORM:');
  console.log('1. Buka https://docs.google.com/forms');
  console.log('2. Form baru akan muncul di daftar form Anda');
  console.log('');
  console.log('============================================================');
  
  return form;
}

/**
 * Fungsi alternatif jika Logger.log tidak muncul
 * Jalankan fungsi ini jika ingin melihat URL di popup
 */
function showFormUrl() {
  // Cari form yang baru dibuat
  var forms = DriveApp.getFilesByName('📋 Form Requirement Pembuatan Website');
  
  if (forms.hasNext()) {
    var file = forms.next();
    var form = FormApp.openById(file.getId());
    
    var message = 
      '🎉 Form ditemukan!\n\n' +
      '📝 URL Edit:\n' + form.getEditUrl() + '\n\n' +
      '🔗 URL Share:\n' + form.getPublishedUrl();
    
    console.log(message);
  } else {
    console.log('Form belum dibuat. Jalankan createWebsiteRequirementForm() terlebih dahulu.');
  }
}
