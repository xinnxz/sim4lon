# SIM4LON Speech-to-Order AI Feature

## Dokumentasi Fitur Voice Command untuk Pemesanan LPG

---

## 1. Deskripsi Fitur

Speech-to-Order adalah fitur AI yang memungkinkan pengguna (Admin/Operator) untuk membuat pesanan LPG hanya dengan berbicara. Fitur ini menggunakan **Web Speech API** untuk mengenali suara dan **NLP Parser** untuk mengekstrak informasi pesanan.

### Contoh Penggunaan:
```text
User: "Pesan 50 tabung LPG 3 kilo ke Pangkalan Mitra Jaya"

Sistem:
→ Produk: LPG 3kg (Subsidi)
→ Jumlah: 50 unit
→ Tujuan: Pangkalan Mitra Jaya
→ Auto-fill form → User verifikasi → Submit
```

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│   │ VoiceOrder  │───▶│ useSpeechRecog   │───▶│  voiceOrder  │  │
│   │ Input.tsx   │    │ nition.ts        │    │  Parser.ts   │  │
│   │ (UI Button) │    │ (Web Speech API) │    │ (NLP Parser) │  │
│   └─────────────┘    └──────────────────┘    └──────────────┘  │
│          │                                          │           │
│          │                  ┌───────────────────────┘           │
│          │                  ▼                                   │
│          │         ┌──────────────────┐                         │
│          └────────▶│ CreateOrderForm  │                         │
│                    │ .tsx             │                         │
│                    │ (Auto-fill form) │                         │
│                    └────────┬─────────┘                         │
│                             │                                   │
└─────────────────────────────│───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                           │
│                    (Tidak ada perubahan)                        │
│                                                                 │
│   OrderController → OrderService → Database                     │
└─────────────────────────────────────────────────────────────────┘
```

**Penting:** Fitur ini **100% frontend-only**. Backend tidak perlu dimodifikasi karena request order tetap menggunakan API endpoint yang sama (`POST /api/orders`).

---

## 3. Komponen Baru

### 3.1 useSpeechRecognition Hook
**Lokasi:** `src/hooks/useSpeechRecognition.ts`

React hook untuk menangani Web Speech API:

```typescript
interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}
```

**Fitur:**
- Start/stop recording
- Real-time transcript
- Error handling (permission denied, browser tidak support)
- Support Bahasa Indonesia (`id-ID`)

---

### 3.2 Voice Order Parser
**Lokasi:** `src/lib/voiceOrderParser.ts`

Module NLP untuk parse voice command:

```typescript
interface VoiceOrderIntent {
  intent: 'CREATE_ORDER' | 'UNKNOWN';
  confidence: number;  // 0.0 - 1.0
  items: Array<{
    productKeyword: string;  // "3kg", "12kg", "bright gas"
    quantity: number;
  }>;
  pangkalanKeyword: string | null;
  rawText: string;
}
```

**Pattern yang Dikenali:**

| Pattern | Contoh | Match |
|---------|--------|-------|
| Angka + tabung/unit | "50 tabung" | qty: 50 |
| Angka dalam kata | "lima puluh unit" | qty: 50 |
| Ukuran LPG | "3 kilo", "12 kg", "tiga kilogram" | product: 3kg, 12kg |
| Nama pangkalan | "ke Pangkalan Mitra" | pangkalan: fuzzy match |

---

### 3.3 VoiceOrderInput Component
**Lokasi:** `src/components/buat-pesanan/VoiceOrderInput.tsx`

React component dengan UI:

```
┌────────────────────────────────────────────────────┐
│  🎤 Pesan dengan Suara                             │
│                                                    │
│      ┌──────────┐                                  │
│      │    🎤    │  ← Tombol mikrofon               │
│      │  (Tap)   │    (animasi pulse saat rekam)   │
│      └──────────┘                                  │
│                                                    │
│  Status: Mendengarkan...                           │
│  "Pesan 50 tabung 3 kilo ke..."                    │
│                                                    │
│  [Batalkan]                    [Gunakan Hasil]    │
└────────────────────────────────────────────────────┘
```

---

## 4. Alur Kerja (User Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEECH-TO-ORDER FLOW                         │
└─────────────────────────────────────────────────────────────────┘

     ┌──────────┐
     │  START   │
     └────┬─────┘
          │
          ▼
┌──────────────────────┐
│ User buka halaman    │
│ "Buat Pesanan"       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐     ┌─────────────────────────┐
│ Klik tombol          │     │ Input manual            │
│ mikrofon 🎤          │────▶│ (cara lama)             │
└──────────┬───────────┘     └─────────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Request permission   │
│ microphone           │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  [Allow]     [Deny]
     │           │
     ▼           ▼
┌─────────┐  ┌─────────────────┐
│ Listen  │  │ Show error msg  │
│ to user │  │ fallback manual │
└────┬────┘  └─────────────────┘
     │
     ▼
┌──────────────────────┐
│ User speak:          │
│ "Pesan 50 tabung     │
│  3 kilo ke Mitra"    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Web Speech API       │
│ convert to text      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ NLP Parser extract:  │
│ - Product: 3kg       │
│ - Qty: 50            │
│ - Pangkalan: "Mitra" │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Show confirmation    │
│ dialog               │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  [Confirm]   [Cancel]
     │           │
     ▼           ▼
┌─────────────┐  ┌──────────────┐
│ Auto-fill   │  │ Reset,       │
│ form fields │  │ try again    │
└──────┬──────┘  └──────────────┘
       │
       ▼
┌──────────────────────┐
│ User review & submit │
│ (alur normal)        │
└──────────┬───────────┘
           │
           ▼
     ┌──────────┐
     │   END    │
     └──────────┘
```

---

## 5. Browser Support

| Browser | Speech Recognition | Status |
|---------|-------------------|--------|
| Chrome | ✅ webkitSpeechRecognition | Full support |
| Edge | ✅ webkitSpeechRecognition | Full support |
| Safari | ✅ SpeechRecognition (iOS 14.5+) | Partial |
| Firefox | ❌ | Not supported |
| Opera | ✅ | Full support |

**Fallback:** Jika browser tidak support, tombol mikrofon akan memberikan pesan error dan user bisa input manual seperti biasa.

---

## 6. Security & Privacy

1. **Microphone Permission:** User harus explicitly grant permission
2. **No Server Recording:** Audio tidak dikirim ke server manapun (Web Speech API proses lokal)
3. **HTTPS Required:** Di production, Web Speech API memerlukan HTTPS
4. **No Data Storage:** Transcript tidak disimpan, hanya digunakan real-time

---

## 7. Limitasi

1. **Akurasi tergantung:**
   - Kualitas mikrofon
   - Background noise
   - Aksen bicara

2. **Pattern terbatas:**
   - Fokus pada pattern pesanan LPG
   - Pattern kompleks mungkin tidak terdeteksi

3. **Browser dependency:**
   - Tidak semua browser support
   - Perlu internet untuk speech recognition

---

## 8. Future Enhancements

- [ ] OpenAI Whisper integration untuk akurasi lebih tinggi
- [ ] Voice feedback (TTS) untuk konfirmasi
- [ ] Multi-item order dalam satu kalimat
- [ ] Floating widget untuk akses cepat
- [ ] Offline mode dengan model lokal
