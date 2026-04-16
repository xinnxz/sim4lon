# 📐 STEP 1: ANALISIS ARSITEKTUR SISTEM SIM4LON

---

## 1. ARSITEKTUR 3-TIER (Three-Tier Architecture)

Aplikasi SIM4LON menggunakan arsitektur **3-Tier** yang modern dan terpisah jelas:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER (Frontend)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │   Astro    │  │   React    │  │ Tailwind   │  │  Radix UI  │         │
│  │  (Router)  │  │   (UI)     │  │   (CSS)    │  │ (Components)│         │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘         │
│                                                                          │
│  📄 25 Halaman | 32 Folder Komponen | 12 Custom Hooks                   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                         HTTP/REST API (JSON)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION TIER (Backend)                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                          NestJS v11                                 │ │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Auth   │  │  Order   │  │  Stock   │  │  Gemini  │            │ │
│  │  │ Module  │  │  Module  │  │  Module  │  │  (AI)    │            │ │
│  │  └─────────┘  └──────────┘  └──────────┘  └──────────┘            │ │
│  │                                                                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐           │ │
│  │  │ Notification│  │  Reports  │  │ Pertamina Integration│          │ │
│  │  │   (DSS)    │  │  Module   │  │ (Perencanaan/Penyaluran)│       │ │
│  │  └────────────┘  └────────────┘  └────────────────────┘           │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  🔧 25 Modul Terpisah | JWT Auth | Validation Pipe | GZIP Compression   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                             Prisma ORM (SQL)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA TIER (Database)                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      PostgreSQL (Supabase)                          │ │
│  │                                                                      │ │
│  │  📊 20+ Tabel | UUID Primary Key | Soft Delete | Index Optimization │ │
│  │                                                                      │ │
│  │  Tabel Utama:                                                       │ │
│  │  • users          • orders         • stock_histories                │ │
│  │  • pangkalans     • order_items    • payment_records                │ │
│  │  • drivers        • lpg_products   • activity_logs                  │ │
│  │  • consumers      • agen_orders    • penerimaan_stok                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DATA FLOW (Alur Data)

### 2.1 Alur Login & Autentikasi
```
User → LoginForm.tsx → authApi.login() → /api/auth/login → AuthService
   ↓                                                              ↓
JWT Token ← localStorage ← response ← JWT Sign ← Bcrypt Verify ← Prisma
```

### 2.2 Alur Buat Pesanan (Voice Command)
```
User Speak → Web Speech API → geminiApi.parseVoice() → /api/gemini/parse-voice
                                                              ↓
                                                     GeminiService
                                                              ↓
                                              Google Gemini AI (NLP Parse)
                                                              ↓
                                              Fuzzy Match Pangkalan + Product
                                                              ↓
                                              Validate Stock + Quota
                                                              ↓
                                              Return ParsedOrderData (JSON)
                                                              ↓
User Confirm → orderApi.create() → /api/orders → OrderService → Prisma
```

### 2.3 Alur Dashboard DSS (Alert Stok)
```
Dashboard Load → dashboardApi.getStats() → /api/dashboard/stats
                                                  ↓
                                          DashboardService
                                                  ↓
                        ┌─────────────────────────┼─────────────────────────┐
                        ↓                         ↓                         ↓
                  Order Stats            Stock Histories           Payment Stats
                        ↓                         ↓                         ↓
                 Count by Status      Calculate Current Stock      Pending Amount
                        ↓                         ↓                         ↓
                        └─────────────────────────┼─────────────────────────┘
                                                  ↓
                                    NotificationService.calculateStockAlerts()
                                                  ↓
                                    Stock < 100 → CRITICAL ALERT
                                    Stock < 250 → WARNING ALERT
                                                  ↓
                                    Return to Dashboard → Display Alerts
```

---

## 3. KOMPONEN UTAMA

### 3.1 Frontend (Astro + React)

| File/Folder | Fungsi | Highlight |
|-------------|--------|-----------|
| [astro.config.mjs](file:///e:/DATA/Ngoding/sim4lon/astro.config.mjs) | Konfigurasi Astro | Proxy `/api` ke backend, Island Architecture |
| [src/lib/api.ts](file:///e:/DATA/Ngoding/sim4lon/src/lib/api.ts) | API Client | 2700+ baris, typed interfaces, auto token handling |
| [src/components/](file:///e:/DATA/Ngoding/sim4lon/src/components/) | Komponen React | 32 folder, reusable components |
| [src/pages/](file:///e:/DATA/Ngoding/sim4lon/src/pages/) | Routing | 25 halaman + nested routes |

**Fitur Frontend Penting:**
- **Island Architecture**: Hanya komponen interaktif yang di-hydrate (hemat resource)
- **Typed API Client**: Semua response punya TypeScript interface
- **Auto Auth Redirect**: Token expired → auto redirect ke login

### 3.2 Backend (NestJS)

| File/Folder | Fungsi | Highlight |
|-------------|--------|-----------|
| [app.module.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/app.module.ts) | Root Module | Import 25 modul |
| [main.ts](file:///e:/DATA/Ngoding/sim4lon/backend/src/main.ts) | Entry Point | CORS, GZIP, Validation Pipe |
| [modules/auth/](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/auth/) | Autentikasi | JWT + Passport + Bcrypt |
| [modules/gemini/](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/gemini/) | AI Voice | Google Gemini API integration |
| [modules/notification/](file:///e:/DATA/Ngoding/sim4lon/backend/src/modules/notification/) | DSS Alerts | Stock level monitoring |

**Fitur Backend Penting:**
- **Modular Architecture**: 25 modul terpisah (scalable)
- **Global Validation**: Auto-validate semua request body
- **GZIP Compression**: Response terkompresi (faster load)
- **Single Session**: 1 user = 1 device aktif

### 3.3 Database (Prisma + PostgreSQL)

| Model | Jumlah Field | Relasi |
|-------|-------------|--------|
| `users` | 14 | → pangkalans, activity_logs, payment_records |
| `pangkalans` | 17 | → orders, consumers, stocks, agen_orders |
| `orders` | 20 | → order_items, payment_records, drivers |
| `stock_histories` | 11 | → lpg_products, users |
| `lpg_products` | 10 | → order_items, stock_histories |

**Fitur Database Penting:**
- **UUID Primary Key**: Keamanan (tidak bisa ditebak)
- **Soft Delete**: Data tidak benar-benar dihapus (`deleted_at`)
- **Index Optimization**: Query cepat pada field penting
- **Enum Types**: Role, Status terdefinisi ketat

---

## 4. JUSTIFIKASI TEKNOLOGI (Untuk Pertanyaan Dosen)

| Teknologi | Alasan Pemilihan |
|-----------|------------------|
| **Astro** | Static-first, SEO friendly, support React components |
| **React** | Ekosistem besar, banyak library siap pakai, TypeScript support |
| **NestJS** | Enterprise-grade, modular, built-in validation & dependency injection |
| **Prisma** | Type-safe ORM, auto-generate types, migration management |
| **PostgreSQL** | ACID compliant, JSON support, scalable, gratis |
| **JWT** | Stateless auth, tidak perlu session storage di server |
| **Google Gemini** | NLP terbaik untuk Bahasa Indonesia, gratis tier tersedia |

---

## 5. KEAMANAN SISTEM

| Layer | Implementasi |
|-------|--------------|
| **Transport** | HTTPS (production via Vercel/Railway) |
| **Authentication** | JWT Token dengan expiry |
| **Authorization** | Role-Based Access Control (ADMIN, OPERATOR, PANGKALAN) |
| **Password** | Bcrypt hashing (salt rounds: 10) |
| **Input** | ValidationPipe + class-validator decorators |
| **Session** | Single device login (session_id tracking) |
| **SQL Injection** | Prisma parameterized queries |

---

> ✅ **Step 1 Selesai!** Arsitektur sistem sudah terdokumentasi dengan baik.
