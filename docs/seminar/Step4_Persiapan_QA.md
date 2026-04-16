# ❓ STEP 4: PERSIAPAN Q&A SEMINAR SIM4LON

> Daftar pertanyaan yang kemungkinan besar akan ditanyakan dosen penguji beserta jawaban yang sudah disiapkan.

---

## PERTANYAAN UMUM (Non-Teknis)

### Q1: "Kenapa memilih topik ini? Apa latar belakangnya?"

**Jawaban:**
PT. Mitra Surya Natasya adalah agen LPG resmi Pertamina di Cianjur yang masih menggunakan sistem manual. Masalah utama:
- Pencatatan stok di buku tulis → rawan selisih
- Laporan logbook 3 hari kerja → tidak efisien
- Tidak ada peringatan stok kritis → sering kehabisan
8. Berdasarkan pengujian yang dilakukan, aplikasi dinyatakan **layak dan siap digunakan** setelah melalui serangkaian tes fungsionalitas yang menunjukkan bahwa seluruh fitur berjalan **98.94%** (189 test cases) dan Score SUS **87.5 (Grade A)** sesuai dengan kebutuhan bisnis Agen LPG.
- Koordinasi dengan pangkalan via WhatsApp → tidak terdokumentasi

Dengan SIM4LON, semua proses terdigitalisasi dan terintegrasi dalam 1 sistem.

---

### Q2: "Apa bedanya dengan sistem sejenis yang sudah ada?"

**Jawaban:**
| Fitur | Sistem Lain | SIM4LON |
|-------|-------------|---------|
| Input Pesanan | Manual ketik | **Voice Command AI** |
| Alert Stok | Tidak ada | **DSS Real-time** |
| Multi-Tenant | Tidak ada | **Pangkalan punya portal sendiri** |
| Integrasi Pertamina | Tidak ada | **Format SO/LO sesuai standar** |
| Reorder Point | Manual | **Otomatis dengan algoritma** |

---

### Q3: "Kenapa pakai metodologi Waterfall, bukan Agile?"

**Jawaban:**
Waterfall cocok untuk proyek dengan:
1. **Requirements jelas** - Kebutuhan agen sudah pasti (stok, pesanan, laporan)
2. **Deadline tetap** - KP hanya 4 bulan, tidak ada ruang iterasi panjang
3. **Dokumentasi lengkap** - Setiap fase menghasilkan deliverable (ERD, Use Case, dll)
4. **Client non-teknis** - Pemilik agen lebih mudah review deliverable per fase

---

### Q4: "Apa kontribusi aplikasi ini untuk masyarakat?"

**Jawaban:**
1. **Mencegah kelangkaan LPG** - Alert stok kritis mencegah kekosongan barang
2. **Transparansi harga** - Konsumen bisa cek harga resmi via portal pangkalan
3. **Audit subsidi** - Data konsumen subsidi tersimpan untuk pelaporan
4. **Efisiensi waktu** - Admin bisa fokus operasional, bukan administrasi

---

### Q5: "Apa keterbatasan sistem ini?"

**Jawaban (Jujur):**
1. **Butuh internet** - Fitur Voice Command butuh koneksi ke Gemini API
2. **Belum ada notifikasi WhatsApp** - Notifikasi hanya di dalam aplikasi
3. **Belum ada mobile app** - Driver masih update via web
4. **Training user** - Pangkalan perlu belajar login dan pakai sistem

---

## PERTANYAAN TEKNIS

### Q6: "Bagaimana keamanan data di sistem ini?"

**Jawaban:**

| Layer | Implementasi |
|-------|--------------|
| **Password** | Bcrypt hash, salt 10 rounds (tidak bisa di-reverse) |
| **Session** | JWT token + single-session (1 device max) |
| **Authorization** | RBAC: Admin, Operator, Pangkalan |
| **API** | ValidationPipe + forbidNonWhitelisted |
| **Database** | Prisma parameterized queries (anti SQL injection) |
| **Transport** | HTTPS di production (Vercel/Railway) |

---

### Q7: "Bagaimana cara kerja Voice Command AI?"

**Jawaban:**

```
User bicara → Web Speech API → Text
                                 ↓
                     Gemini AI + Context DB
                                 ↓
                     Fuzzy Match Pangkalan
                                 ↓
                     Validasi Stok Real-time
                                 ↓
                     ParsedOrderData (JSON)
```

**Keunikannya:**
- AI tidak menebak, tapi match ke data real dari database
- Ada fallback regex jika AI gagal
- Validasi: stok, kuota, pangkalan aktif

---

### Q8: "Kenapa pakai NestJS, bukan Laravel/Express?"

**Jawaban:**
| Aspek | NestJS | Keunggulan |
|-------|--------|------------|
| **Arsitektur** | Modular (Module-Controller-Service) | Scalable, maintainable |
| **TypeScript** | Native support | Type safety, less bugs |
| **Validation** | Built-in ValidationPipe | Auto-validate request body |
| **DI** | Dependency Injection | Testable, loosely coupled |
| **Community** | Enterprise-grade | Banyak dipakai startup besar |

---

### Q9: "Kenapa database PostgreSQL, bukan MySQL?"

**Jawaban:**
- **JSON support** - Lebih baik untuk data fleksibel
- **UUID native** - Cocok untuk primary key yang aman
- **Supabase gratis** - Hosting PostgreSQL gratis dengan storage
- **Performance** - Lebih cepat untuk query kompleks (JOIN banyak tabel)

---

### Q10: "Bagaimana menghitung stok saat ini?"

**Jawaban:**
```sql
SELECT SUM(CASE WHEN movement_type = 'MASUK' THEN qty ELSE -qty END) 
FROM stock_histories 
WHERE lpg_product_id = ?
```

**Penjelasan:**
- Tidak ada field `current_stock` di tabel produk
- Stok dihitung dari riwayat: SUM(MASUK) - SUM(KELUAR)
- Lebih akurat karena audit trail lengkap

---

### Q11: "Apa itu DSS dalam konteks aplikasi ini?"

**Jawaban:**
**Decision Support System** = Sistem yang membantu pengambilan keputusan.

Di SIM4LON, DSS berupa:
1. **Stock Alerts** - Kritis jika < 100, warning jika < 250
2. **Reorder Point** - Rekomendasi kapan harus order ke SPBE
3. **Sales Trend** - Analisis hari puncak permintaan
4. **Health Score** - Skor 0-100 kondisi operasional

---

### Q12: "Bagaimana multi-tenant bekerja?"

**Jawaban:**
```
1 Agen (Parent) → N Pangkalan (Tenant)
```

Setiap pangkalan:
- Punya akun login sendiri (role: PANGKALAN)
- Hanya lihat data miliknya (filtered by pangkalan_id)
- Bisa order ke agen, kelola konsumen, lihat stok sendiri
- Tidak bisa akses data pangkalan lain

---

### Q13: "Bagaimana validasi input di backend?"

**Jawaban:**
Menggunakan `class-validator` decorators:

```typescript
export class CreateOrderDto {
    @IsUUID()
    pangkalan_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    items: OrderItemDto[];
}
```

NestJS ValidationPipe akan:
- Reject request jika field tidak sesuai
- Transform string ke number jika perlu
- Whitelist hanya field yang didefinisikan

---

### Q14: "Kenapa pakai Astro, bukan Next.js?"

**Jawaban:**
| Aspek | Astro | Next.js |
|-------|-------|---------|
| **Build** | Static-first | SSR-first |
| **Bundle size** | Lebih kecil (Island Architecture) | Lebih besar |
| **React** | Partial hydration | Full hydration |
| **SEO** | Sangat baik | Baik |
| **Complexity** | Lebih sederhana | Lebih kompleks |

SIM4LON tidak butuh SSR karena data diambil via API setelah login.

---

### Q15: "Bagaimana jika AI salah parse?"

**Jawaban:**
Ada 3 layer proteksi:
1. **Confidence score** - Jika < 70%, minta konfirmasi user
2. **Fuzzy matching** - Levenshtein distance untuk nama mirip
3. **Fallback parser** - Regex jika Gemini gagal/timeout
4. **Manual edit** - User bisa edit hasil parse sebelum submit

---

## TIPS MENJAWAB

1. **Jangan panik** - Tarik napas, dengarkan sampai selesai
2. **Ulangi pertanyaan** - "Baik, jadi pertanyaannya tentang..."
3. **Jawab to the point** - Langsung ke inti, jangan bertele-tele
4. **Akui keterbatasan** - "Itu adalah saran pengembangan selanjutnya"
5. **Demo jika perlu** - "Izinkan saya tunjukkan fiturnya langsung"

---

> ✅ **Step 4 Selesai!** Q&A sudah disiapkan untuk 15 pertanyaan potensial.
