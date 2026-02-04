# 🔍 STEP 3: ANALISIS KODE KUNCI SIM4LON

> Bagian ini menjelaskan kode-kode penting yang perlu dipahami untuk menghadapi pertanyaan dosen saat seminar.

---

## 1. AUTENTIKASI (Login & JWT)

### File: [auth.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/auth/auth.service.ts)

### Highlight: Login dengan Single-Session Enforcement

```typescript
async login(dto: LoginDto) {
    // 1. Cari user (exclude soft-deleted)
    const user = await this.prisma.users.findFirst({
        where: { email: dto.email, deleted_at: null },
        include: { pangkalans: { select: { id: true, name: true, is_active: true } } },
    });

    // 2. Validasi user aktif
    if (!user.is_active) throw new UnauthorizedException('Akun tidak aktif');
    
    // 3. Validasi pangkalan aktif (untuk role PANGKALAN)
    if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
        throw new UnauthorizedException('Pangkalan Anda sudah dinonaktifkan');
    }

    // 4. Verifikasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Password salah');

    // 5. Generate unique session ID (KEY: Single-session enforcement)
    const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36)}`;
    
    // 6. Simpan session_id ke database (invalidates old sessions!)
    await this.prisma.users.update({
        where: { id: user.id },
        data: { session_id: sessionId },
    });

    // 7. Generate JWT dengan session_id
    const payload = { sub: user.id, email: user.email, role: user.role, session_id: sessionId };
    const accessToken = this.jwtService.sign(payload);
}
```

### Penjelasan untuk Dosen

| Aspek | Penjelasan |
|-------|------------|
| **Bcrypt** | Password tidak disimpan plain text, di-hash dengan salt 10 rounds |
| **Single Session** | User hanya bisa login di 1 device. Login baru = logout otomatis di device lama |
| **JWT Payload** | Berisi user ID, email, role, dan session_id untuk validasi |
| **Soft Delete** | User yang dihapus masih ada di database, tapi tidak bisa login |

---

## 2. AI VOICE COMMAND (Gemini Prompt Engineering)

### File: [gemini.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/gemini/gemini.service.ts)

### Highlight: Context-Aware Prompt Construction

```typescript
async parseVoiceCommand(text: string): Promise<ParsedOrderData> {
    // 1. Ambil data pangkalan dan produk dari database
    const [pangkalans, products] = await Promise.all([
        this.prisma.pangkalans.findMany({ where: { is_active: true } }),
        this.prisma.lpg_products.findMany({ where: { is_active: true } })
    ]);

    // 2. Bangun konteks untuk AI
    const pangkalanList = pangkalans.map(p => `- "${p.name}" (ID: ${p.id})`).join('\n');
    const productList = products.map(p => `- ${p.name} - ${p.size_kg}kg`).join('\n');

    // 3. Prompt Engineering - AI mendapat konteks database!
    const prompt = `Kamu adalah AI PARSER CERDAS untuk sistem pemesanan LPG.
    
=== PERINTAH SUARA USER ===
"${text}"

=== DATABASE REFERENSI ===
PANGKALAN:
${pangkalanList}

PRODUK AKTIF:
${productList}

=== ATURAN PARSING ===
⚠️ STRICT PRODUCT MATCHING:
- HANYA match ke produk yang ADA di daftar!
- Jika ukuran TIDAK ADA, return error!

📦 MULTIPLE ITEMS:
User mungkin pesan LEBIH DARI 1 jenis produk!
Contoh: "3kg 10 unit sama 12kg juga 10 unit"

Return JSON format: { pangkalanId, items: [{productId, quantity}], confidence }`;
}
```

### Keunikan Implementasi

| Teknik | Penjelasan |
|--------|------------|
| **Context Injection** | AI tidak "menebak", tapi match ke data real dari database |
| **Strict Matching** | Produk yang tidak ada di database akan ditolak |
| **Multi-item Support** | Bisa parse pesanan dengan lebih dari 1 jenis produk |
| **Fallback Parser** | Jika Gemini gagal, ada regex backup |
| **Fuzzy Matching** | Levenshtein distance untuk nama pangkalan yang mirip |

---

## 3. DSS NOTIFICATION (Stock Alert Priority)

### File: [notification.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/notification/notification.service.ts)

### Highlight: Aggregasi Notifikasi dari Multiple Sources

```typescript
async getNotifications(page = 1, limit = 10): Promise<PaginatedNotificationResponse> {
    const allNotifications: Notification[] = [];

    // 1. Pesanan baru dari activity logs
    const recentOrders = await this.prisma.activity_logs.findMany({
        where: { type: 'order_created' },
        orderBy: { created_at: 'desc' },
    });
    // Push to allNotifications with priority: 'medium'

    // 2. Pending order dari pangkalan (butuh approval)
    const pendingAgenOrders = await this.prisma.agen_orders.findMany({
        where: { status: 'PENDING' },
    });
    // Push to allNotifications with priority: 'high'

    // 3. Stock alerts (calculated dynamically!)
    const stockAlerts = await this.calculateStockAlerts();
    allNotifications.push(...stockAlerts);

    // 4. Sort by priority (critical first, then high, medium, low)
    allNotifications.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}
```

### Logika Alert Stok

```typescript
private async calculateStockAlerts(): Promise<Notification[]> {
    const alerts: Notification[] = [];
    const products = await this.prisma.lpg_products.findMany({ where: { is_active: true } });

    for (const product of products) {
        // Hitung stok dari stock_histories
        const stockData = await this.prisma.stock_histories.aggregate({
            where: { lpg_product_id: product.id },
            _sum: { qty: true },
        });
        
        const currentStock = stockData._sum.qty || 0;

        // Threshold alerts
        if (currentStock <= 0) {
            alerts.push({ type: 'stock_out', priority: 'critical', ... });
        } else if (currentStock < 100) {
            alerts.push({ type: 'stock_critical', priority: 'critical', ... });
        } else if (currentStock < 250) {
            alerts.push({ type: 'stock_low', priority: 'high', ... });
        }
    }
    return alerts;
}
```

---

## 4. PERHITUNGAN PROFIT (Reports)

### File: [reports.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/reports/reports.service.ts) & [dashboard.service.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/dashboard/dashboard.service.ts)

### Formula Profit

```typescript
// Profit per item = (Harga Jual - Harga Modal) × Quantity
// Profit = SUM(selling_price - cost_price) × qty

async getProfitChart() {
    const orders = await this.prisma.orders.findMany({
        where: { current_status: 'SELESAI' },
        include: {
            order_items: {
                include: { lpg_products: true }
            }
        }
    });

    for (const order of orders) {
        for (const item of order.order_items) {
            const profit = (item.price_per_unit - item.lpg_products.cost_price) * item.qty;
            // Aggregate by date
        }
    }
}
```

---

## RINGKASAN UNTUK PERTANYAAN DOSEN

| Pertanyaan | Jawaban Kunci |
|------------|---------------|
| "Bagaimana keamanan login?" | Bcrypt hashing + JWT + Single-session (1 device) |
| "Apa bedanya dengan sistem biasa?" | AI Voice Command + DSS real-time alerts |
| "Bagaimana AI tahu nama pangkalan?" | Context injection - data pangkalan di-inject ke prompt |
| "Bagaimana menghitung stok?" | SUM(MASUK) - SUM(KELUAR) dari stock_histories |
| "Bagaimana menghitung profit?" | (Harga Jual - Harga Modal) × Qty per item |

---

> ✅ **Step 3 Selesai!** Kode kunci sudah terdokumentasi dengan penjelasan.
