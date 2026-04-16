# 🔄 STATE MACHINE DIAGRAM - PENJELASAN MENDALAM
## Yang Paling Sering Ditanya Saat Seminar!

---

## 📌 Kenapa State Machine Penting?

State Machine menunjukkan **siklus hidup** sebuah objek. Di SIM4LON, ini menjawab pertanyaan:
- "Bagaimana alur status pesanan?"
- "Kapan stok otomatis terupdate?"
- "Apa yang terjadi saat pesanan dibatalkan?"

---

## 🎯 SM-01: STATUS PESANAN (Yang Paling Penting!)

### Diagram Visual:

```
                         ┌─────────────────────────────────────────────────────┐
                         │                                                     │
    ●───────────────────▶│                      DRAFT                          │
         Pesanan         │  ┌─────────────────────────────────────────────┐   │
         dibuat          │  │ Entry: Generate kode ORD-XXXX               │   │
                         │  │ Entry: Hitung subtotal, tax                 │   │
                         │  │ Entry: Buat timeline track "Pesanan Dibuat" │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                │ Submit pesanan
                                                ▼
                         ┌─────────────────────────────────────────────────────┐
                         │              MENUNGGU_PEMBAYARAN ⚠️                 │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │ Entry: Kirim notifikasi ke Pangkalan        │   │
                         │  │ Do: Menunggu pembayaran dari pangkalan      │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                │ [is_paid = true] Pembayaran lunas
                                                ▼
                         ┌─────────────────────────────────────────────────────┐
                         │                   DIPROSES 🟢                       │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │ Entry: Verifikasi pembayaran                │   │
                         │  │ Do: Siapkan barang di gudang                │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                │ Barang siap
                                                ▼
                         ┌─────────────────────────────────────────────────────┐
                         │                   SIAP_KIRIM                        │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │ Entry: Assign driver (opsional)             │   │
                         │  │ Do: Menunggu jadwal pengiriman              │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                │ [driver_id != null] Driver berangkat
                                                ▼
                         ┌─────────────────────────────────────────────────────┐
                         │                    DIKIRIM 🟢                       │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │ Entry: Driver mulai pengiriman              │   │
                         │  │ Do: Dalam perjalanan ke pangkalan           │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                │ Barang diterima + konfirmasi pangkalan
                                                ▼
                         ┌─────────────────────────────────────────────────────┐
                         │                    SELESAI 🔵                       │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │ Entry: AUTO-SYNC STOK PANGKALAN ⭐          │   │
                         │  │ Entry: Update tabel pangkalan_stocks        │   │
                         │  │ Exit: Generate invoice (opsional)           │   │
                         │  └─────────────────────────────────────────────┘   │
                         └──────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
                                               ⊕ END (Final State)
```

### PEMBATALAN (Dari State Manapun):

```
    DRAFT ─────────────────────┐
                               │
    MENUNGGU_PEMBAYARAN ───────┤
                               │ Cancel / Timeout
    DIPROSES ──────────────────┼────────────▶ ┌─────────────────────┐
                               │              │       BATAL 🔴      │
    SIAP_KIRIM ────────────────┤              │ Entry: Log alasan   │
                               │              │ Entry: Rollback stok│
    DIKIRIM ───────────────────┘              │ (jika sudah keluar) │
           (Gagal kirim)                      └──────────┬──────────┘
                                                         │
                                                         ▼
                                                        ⊕ END
```

---

## 📝 Penjelasan Tiap State

### 1. DRAFT (Initial State)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Saat pesanan baru dibuat |
| **Entry Action** | Generate kode ORD-XXXX, hitung subtotal, buat timeline |
| **Next** | MENUNGGU_PEMBAYARAN (setelah submit) |
| **Database** | INSERT ke `orders`, `order_items`, `timeline_tracks` |

**Kode Backend (NestJS):**
```typescript
// order.service.ts
async create(dto: CreateOrderDto): Promise<Order> {
  const code = await this.generateOrderCode(); // ORD-0100
  const order = await this.prisma.order.create({
    data: {
      code,
      status: 'DRAFT', // ← Initial state
      pangkalanId: dto.pangkalanId,
      items: { create: dto.items }
    }
  });
  
  // Entry action: Buat timeline track
  await this.createTimelineTrack(order.id, 'DRAFT', 'Pesanan dibuat');
  return order;
}
```

---

### 2. MENUNGGU_PEMBAYARAN (Warning State)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Setelah admin submit pesanan |
| **Entry Action** | Kirim notifikasi ke pangkalan |
| **Do Action** | Menunggu pembayaran |
| **Guard** | `is_paid = true` untuk lanjut |
| **Next** | DIPROSES (jika lunas) atau BATAL (timeout) |

**Yang Terjadi:**
1. Sistem kirim notifikasi ke pangkalan
2. Pangkalan membayar (transfer/tunai)
3. Admin mencatat pembayaran
4. Jika `is_paid = true` → lanjut ke DIPROSES

---

### 3. DIPROSES (Active State)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Setelah pembayaran dikonfirmasi |
| **Entry Action** | Verifikasi pembayaran |
| **Do Action** | Siapkan barang di gudang |
| **Next** | SIAP_KIRIM (barang siap) |

---

### 4. SIAP_KIRIM
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Barang sudah disiapkan |
| **Entry Action** | Assign driver (opsional) |
| **Guard** | `driver_id != null` untuk lanjut |
| **Next** | DIKIRIM (driver berangkat) |

**Note:** Assign driver bersifat **opsional** (extend di Use Case). Jika pangkalan mengambil sendiri, tidak perlu driver.

---

### 5. DIKIRIM (Active State)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Driver memulai pengiriman |
| **Entry Action** | Catat waktu berangkat |
| **Do Action** | Dalam perjalanan |
| **Next** | SELESAI (diterima) atau BATAL (gagal kirim) |

---

### 6. SELESAI ⭐ (Final State - SUCCESS)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Barang diterima dan dikonfirmasi pangkalan |
| **Entry Action** | **AUTO-SYNC STOK PANGKALAN** |
| **Exit Action** | Generate invoice (opsional) |

**⭐ INI YANG PALING PENTING! ⭐**

```typescript
// Saat status berubah ke SELESAI:
async updateStatusToSelesai(orderId: string) {
  const order = await this.prisma.order.update({
    where: { id: orderId },
    data: { status: 'SELESAI' },
    include: { items: true }
  });

  // ⭐ ENTRY ACTION: Auto-sync stok pangkalan
  for (const item of order.items) {
    await this.prisma.pangkalanStock.upsert({
      where: {
        pangkalanId_lpgType: {
          pangkalanId: order.pangkalanId,
          lpgType: item.lpgType
        }
      },
      update: {
        qty: { increment: item.qty } // ← Stok bertambah!
      },
      create: {
        pangkalanId: order.pangkalanId,
        lpgType: item.lpgType,
        qty: item.qty
      }
    });
  }
}
```

---

### 7. BATAL (Final State - FAILURE)
| Aspek | Penjelasan |
|-------|------------|
| **Kapan** | Pembatalan dari state manapun (kecuali SELESAI) |
| **Entry Action** | Log alasan pembatalan |
| **Entry Action** | Rollback stok (jika sudah keluar dari gudang) |

---

## 🎯 SM-02: STATUS ORDER KE AGEN (Pangkalan)

Untuk fitur **Buat Order ke Agen** dari sisi Pangkalan:

```
    ●────────▶ PENDING ────────▶ DIKIRIM ────────▶ DITERIMA ────▶ ⊕
               (Agen             (Agen                (Stok
               konfirmasi)       kirim)               pangkalan
                                                      bertambah)
                    │
                    └─────────▶ DITOLAK ────────────────────────▶ ⊕
                               (Stok agen
                               tidak cukup)
```

| State | Trigger | Action |
|-------|---------|--------|
| PENDING | Pangkalan buat order | Notifikasi ke agen |
| DIKIRIM | Agen konfirmasi & kirim | Update status |
| DITERIMA | Pangkalan konfirmasi terima | **Auto-sync stok pangkalan** |
| DITOLAK | Agen tolak order | Log alasan ditolak |

---

## 🔐 SM-03: USER SESSION (Single Session Login)

```
                         ┌─────────────────┐
           Login sukses  │                 │  Token expired
    ● ─────────────────▶ │   LOGGED_IN     │ ─────────────────▶ EXPIRED ──▶ ⊕
                         │                 │
                         └────────┬────────┘
                                  │
                                  │ Login dari device lain
                                  │ (new session_id generated)
                                  ▼
                         ┌─────────────────┐
                         │   KICKED_OUT    │ ──────────────────────────────▶ ⊕
                         │                 │
                         │ "Anda logout    │
                         │  karena login   │
                         │  dari device    │
                         │  lain"          │
                         └─────────────────┘
```

### Implementasi Single Session:

```typescript
// auth.service.ts
async login(email: string, password: string) {
  const user = await this.validateUser(email, password);
  
  // Generate session_id BARU setiap login
  const sessionId = uuidv4();
  
  // Update session_id di database
  await this.prisma.user.update({
    where: { id: user.id },
    data: { sessionId } // ← Session lama otomatis invalid!
  });
  
  // Token berisi session_id
  const token = this.jwtService.sign({
    sub: user.id,
    sessionId // ← Ini yang dicek setiap request
  });
  
  return { access_token: token };
}

// jwt.strategy.ts (Guard)
async validate(payload: JwtPayload) {
  const user = await this.prisma.user.findUnique({
    where: { id: payload.sub }
  });
  
  // Cek session_id cocok!
  if (user.sessionId !== payload.sessionId) {
    throw new UnauthorizedException('Session expired'); // ← KICKED_OUT
  }
  
  return user;
}
```

---

## ❓ Pertanyaan yang Mungkin Ditanyakan

### Q1: "Jelaskan alur State Machine Status Pesanan!"
**Jawaban:**
> "Status pesanan dimulai dari **DRAFT** saat dibuat, lalu **MENUNGGU_PEMBAYARAN** setelah submit. Jika sudah bayar (`is_paid = true`), berubah ke **DIPROSES**. Setelah barang siap, menjadi **SIAP_KIRIM**, lalu **DIKIRIM** saat driver berangkat. Terakhir **SELESAI** saat pangkalan konfirmasi terima, dan di sini **stok pangkalan otomatis bertambah**. Pembatalan bisa dari state manapun kecuali SELESAI."

### Q2: "Apa yang dimaksud Entry, Do, dan Exit action?"
**Jawaban:**
> "**Entry** dijalankan saat MASUK ke state, misalnya generate kode saat DRAFT. **Do** dijalankan SELAMA di state, misalnya menunggu pembayaran. **Exit** dijalankan saat KELUAR dari state, misalnya generate invoice saat keluar dari SELESAI."

### Q3: "Bagaimana Single Session Login bekerja?"
**Jawaban:**
> "Setiap login generate `session_id` baru yang disimpan di database dan di dalam JWT token. Setiap request, sistem membandingkan `session_id` di token dengan di database. Jika tidak cocok, berarti ada login baru dari device lain, dan user otomatis logout. Jadi **1 user = 1 device aktif**."

### Q4: "Kapan stok pangkalan otomatis terupdate?"
**Jawaban:**
> "Stok pangkalan otomatis bertambah saat status pesanan berubah ke **SELESAI**. Ini adalah **Entry Action** di state SELESAI yang melakukan UPDATE ke tabel `pangkalan_stocks`."

---

## 📌 Tips Menjawab

1. **Sebutkan jumlah state**: "Ada 7 state: DRAFT, MENUNGGU_PEMBAYARAN, DIPROSES, SIAP_KIRIM, DIKIRIM, SELESAI, BATAL"

2. **Jelaskan trigger/guard**: "Untuk pindah dari MENUNGGU ke DIPROSES, guard-nya adalah `is_paid = true`"

3. **Highlight fitur otomatis**: "Saat SELESAI, **stok otomatis tersinkronisasi**"

4. **Kaitkan dengan bisnis**: "Ini memastikan pangkalan tidak perlu input stok manual, mengurangi kesalahan"

---

*Dokumen ini untuk persiapan Seminar KP SIM4LON - State Machine Detail*
