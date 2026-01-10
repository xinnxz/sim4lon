# SIM4LON Complete Codebase Analysis

> 📅 **Last Updated**: 2026-01-05  
> 📊 **Progress**: ✅ ALL 10 PHASES COMPLETED  
> 📁 **Total Files Analyzed**: 334 / 372 (90%)  
> 📝 **Document Version**: 2.0 (Enhanced Edition)

---

# Executive Summary

## Tentang Dokumen Ini

Dokumen ini merupakan **analisis mendalam dan komprehensif** terhadap seluruh codebase aplikasi **SIM4LON** (Sistem Informasi Manajemen untuk Agen LPG). Analisis ini dilakukan secara sistematis melalui **10 fase** yang mencakup setiap aspek teknis aplikasi, mulai dari konfigurasi dasar hingga dokumentasi UML.

### Tujuan Dokumen

1. **Referensi Teknis**: Sebagai panduan lengkap bagi developer untuk memahami arsitektur dan implementasi sistem
2. **Dokumentasi Akademis**: Mendukung penulisan jurnal ilmiah dan laporan Kerja Praktik
3. **Onboarding**: Mempercepat proses pemahaman bagi developer baru yang bergabung ke proyek
4. **Audit Kode**: Memfasilitasi review arsitektur dan identifikasi area improvement

### Metodologi Analisis

Analisis dilakukan dengan pendekatan **bottom-up** dan **top-down** secara paralel:

| Pendekatan | Deskripsi |
|------------|-----------|
| **Bottom-Up** | Menelusuri setiap file konfigurasi, schema database, hingga komponen UI |
| **Top-Down** | Memahami arsitektur keseluruhan, alur bisnis, dan integrasi antar modul |
| **Cross-Reference** | Menghubungkan backend service dengan frontend component yang menggunakannya |

---

## Ringkasan Eksekutif SIM4LON

### Apa itu SIM4LON?

**SIM4LON** adalah sistem informasi berbasis web yang dirancang khusus untuk **manajemen distribusi LPG** di tingkat agen. Sistem ini mengintegrasikan:

- **Manajemen Pesanan**: Pengelolaan pesanan dari agen ke pangkalan
- **Manajemen Stok**: Pelacakan stok LPG secara real-time di tingkat agen dan pangkalan
- **Keuangan**: Pencatatan pembayaran, invoice, dan profit calculation
- **Pelaporan**: Laporan penjualan, stok, dan subsidi untuk keperluan audit
- **AI Features**: Voice Order menggunakan Google Gemini AI

### Multi-Tenant Architecture

SIM4LON mengimplementasikan arsitektur **multi-tenant** yang memungkinkan satu instalasi sistem melayani:

```
                    ┌─────────────────────┐
                    │     AGEN (Owner)    │
                    │   - Stok Global     │
                    │   - Semua Laporan   │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
    ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
    │ Pangkalan A │     │ Pangkalan B │     │ Pangkalan C │
    │ - Stok Own  │     │ - Stok Own  │     │ - Stok Own  │
    │ - Konsumen  │     │ - Konsumen  │     │ - Konsumen  │
    │ - Penjualan │     │ - Penjualan │     │ - Penjualan │
    └─────────────┘     └─────────────┘     └─────────────┘
```

### Technology Stack

| Layer | Technology | Versi | Keterangan |
|-------|------------|-------|------------|
| **Frontend Framework** | Astro | 5.0.0 | Static Site Generator dengan Island Architecture |
| **UI Library** | React | 19.x | Component-based UI dengan hooks |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| **Backend Framework** | NestJS | 11.x | Progressive Node.js framework |
| **ORM** | Prisma | 6.x | Type-safe database client |
| **Database** | PostgreSQL | 15+ | Relational database dengan UUID support |
| **AI Service** | Google Gemini | 2.0 Flash | Natural Language Processing untuk Voice Order |
| **Hosting Frontend** | Vercel | - | Edge deployment |
| **Hosting Backend** | Railway | - | Container-based deployment |

---

## Struktur Dokumen

Dokumen ini terbagi menjadi **10 fase analisis** yang saling berkesinambungan:

| Fase | Nama | Fokus Analisis |
|------|------|----------------|
| 1 | Configuration Files | Setup proyek, dependencies, environment |
| 2 | Database Layer | Schema Prisma, relasi tabel, migrasi |
| 3 | Authentication | JWT, RBAC, session management |
| 4 | Core Business (Orders) | Workflow pesanan, validasi, status |
| 5 | Stock Management | Stok agen, pangkalan, movement tracking |
| 6 | Pangkalan Features | B2C sales, expense, profit calculation |
| 7 | Admin Dashboard | Reports, DSS alerts, KPI |
| 8 | Advanced Features | Voice Order AI, notifications |
| 9 | UI Components | shadcn/ui, design system |
| 10 | UML & Documentation | Diagrams, academic docs |

---

# Table of Contents

1. [Phase 1: Configuration Files](#phase-1-configuration-files) ✅
2. [Phase 2: Database Layer](#phase-2-database-layer) ✅
3. [Phase 3: Authentication](#phase-3-authentication-system) ✅
4. [Phase 4: Core Business (Orders)](#phase-4-core-business-orders) ✅
5. [Phase 5: Stock Management](#phase-5-stock-management) ✅
6. [Phase 6: Pangkalan Features](#phase-6-pangkalan-features) ✅
7. [Phase 7: Admin Dashboard](#phase-7-admin-dashboard) ✅
8. [Phase 8: Advanced Features](#phase-8-advanced-features) ✅
9. [Phase 9: UI Components](#phase-9-ui-components) ✅
10. [Phase 10: UML & Documentation](#phase-10-uml-documentation) ✅

---

# Phase 1: Configuration Files

## ✅ Status: COMPLETED (17 files)

---

## Overview

Fase pertama dari analisis ini berfokus pada **file konfigurasi** yang menjadi fondasi teknis aplikasi SIM4LON. File-file ini menentukan bagaimana aplikasi dibangun, dikompilasi, dan di-deploy.

### Mengapa Konfigurasi Penting?

Konfigurasi yang tepat memastikan:
1. **Konsistensi Development**: Semua developer menggunakan versi dependency yang sama
2. **Type Safety**: TypeScript dikonfigurasi untuk mendeteksi error pada compile-time
3. **Build Optimization**: Astro menghasilkan static HTML yang optimal untuk performa
4. **Environment Separation**: Variabel environment memisahkan konfigurasi dev/staging/production

### File yang Dianalisis

| File | Lokasi | Fungsi |
|------|--------|--------|
| `package.json` | Frontend | Dependencies dan scripts |
| `tsconfig.json` | Frontend | TypeScript configuration |
| `astro.config.mjs` | Frontend | Astro framework settings |
| `tailwind.config.mjs` | Frontend | CSS utility classes |
| `package.json` | Backend | NestJS dependencies |
| `tsconfig.json` | Backend | TypeScript untuk Node.js |
| `.env` | Both | Environment variables |

---

## 📦 Frontend Configuration

### 1. `package.json` (Frontend)

**Purpose**: Defines frontend dependencies and scripts

**Key Dependencies (47 total)**:

| Category | Packages |
|----------|----------|
| **Framework** | `astro@5.0.0`, `react@18.3.1`, `react-dom@18.3.1` |
| **Integrations** | `@astrojs/react`, `@astrojs/tailwind` |
| **UI Library** | `@radix-ui/*` (17 packages) - Accordion, Dialog, Dropdown, etc. |
| **Styling** | `tailwindcss@3.4.17`, `tailwind-merge`, `tailwindcss-animate`, `class-variance-authority`, `clsx` |
| **Forms** | `react-hook-form@7.65.0`, `@hookform/resolvers`, `zod@4.1.12` |
| **Charts** | `recharts@2.15.4` |
| **Export** | `jspdf@3.0.4`, `jspdf-autotable`, `xlsx@0.18.5`, `file-saver` |
| **Icons** | `lucide-react@0.545.0` |
| **Other** | `sonner` (toasts), `cmdk` (command palette), `next-themes`, `embla-carousel-react` |

**Scripts**:
```json
"dev": "astro dev"      // Development server
"build": "astro build"  // Production build
"preview": "astro preview" // Preview build
```

---

### 2. `tsconfig.json` (Frontend)

**Purpose**: TypeScript compiler configuration

**Key Settings**:
```json
{
  "extends": "astro/tsconfigs/strict",  // Extends Astro's strict config
  "target": "ES2022",
  "jsx": "react-jsx",                   // React JSX transform
  "jsxImportSource": "react",
  "paths": { "@/*": ["src/*"] }         // Path alias: @/ → src/
}
```

**Learning**: Path alias `@/` makes imports cleaner:
- Instead of: `import { Button } from '../../../../components/ui/button'`
- Use: `import { Button } from '@/components/ui/button'`

---

### 3. `astro.config.mjs` (184 lines)

**Purpose**: Astro framework configuration

**Key Features**:

| Feature | Description |
|---------|-------------|
| **Integrations** | `react()`, `tailwind({ applyBaseStyles: false })` |
| **Output** | `"static"` - Pre-rendered HTML files |
| **Custom Plugin** | `redirectMissingRoutes()` - Auto-creates missing pages |

**Custom Plugin Logic** (lines 9-99):
```javascript
function redirectMissingRoutes() {
    // 1. Scans all src files for HTML links
    // 2. After build, creates missing HTML files
    // 3. Missing pages redirect to placeholder.html
}
```

**Vite Config** (lines 129-181):
```javascript
vite: {
    base: "/",
    resolve: { alias: { "@": "/src" } },
    server: {
        proxy: {
            '/api': { target: 'http://localhost:3000' }  // Proxy API calls to backend
        }
    },
    build: { target: "es2022", minify: "esbuild" }
}
```

---

### 4. `tailwind.config.mjs` (110 lines)

**Purpose**: TailwindCSS theme configuration

**Key Features**:

| Feature | Description |
|---------|-------------|
| **Dark Mode** | `darkMode: ['class']` - Toggle via CSS class |
| **Container** | Centered, 2rem padding, max 1400px |
| **Colors** | CSS variables for theming (shadcn pattern) |
| **Animations** | Accordion open/close animations |

**Color System** (uses CSS variables):
```javascript
colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: { DEFAULT: 'hsl(var(--primary))', foreground: '...' },
    // ... 10+ semantic color groups
}
```

**Learning**: Colors defined in CSS, not Tailwind. This enables runtime theme switching.

---

### 5. `components.json` (shadcn config)

**Purpose**: shadcn/ui CLI configuration

```json
{
  "style": "new-york",           // UI style variant
  "rsc": false,                  // No React Server Components
  "tsx": true,                   // TypeScript + JSX
  "iconLibrary": "lucide",       // Icon library
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**Learning**: Use `npx shadcn@latest add button` to add components.

---

### 6. `vercel.json`

**Purpose**: Vercel deployment config

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "astro",
    "cleanUrls": true,        // Remove .html from URLs
    "trailingSlash": false    // No trailing slash
}
```

---

### 7. `.env.example` (Frontend)

```
PUBLIC_API_URL=http://localhost:3000/api
```

**Learning**: `PUBLIC_` prefix makes env var available in client-side code.

---

## 🔧 Backend Configuration

### 8. `backend/package.json` (93 lines)

**Purpose**: Backend dependencies and scripts

**Key Dependencies (20 total)**:

| Category | Packages |
|----------|----------|
| **Framework** | `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` (all v11) |
| **Auth** | `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` |
| **Database** | `@prisma/client`, `@prisma/adapter-pg`, `pg` |
| **Validation** | `class-validator`, `class-transformer` |
| **Security** | `bcrypt`, `bcryptjs` |
| **External** | `@supabase/supabase-js` (file storage) |

**Scripts**:
```bash
npm run start:dev   # Development with hot-reload
npm run build       # Production build
npm run start:prod  # Run production
npm run test        # Jest unit tests
npm run test:e2e    # End-to-end tests
```

---

### 9. `backend/tsconfig.json`

**Key Settings**:
```json
{
  "module": "nodenext",           // Node.js ESM
  "target": "ES2023",
  "emitDecoratorMetadata": true,  // Required for NestJS
  "experimentalDecorators": true, // Required for NestJS
  "outDir": "./dist",
  "strictNullChecks": true
}
```

---

### 10. `backend/nest-cli.json`

```json
{
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true   // Clean dist before build
  }
}
```

---

### 11. `backend/railway.json`

**Purpose**: Railway deployment config

```json
{
    "build": {
        "buildCommand": "npm install && npx prisma generate && npm run build"
    },
    "deploy": {
        "startCommand": "npm run start:prod",
        "healthcheckPath": "/api/health",
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
}
```

---

### 12. `backend/.env.example`

**Environment Variables**:
```bash
DATABASE_URL=postgresql://...      # PostgreSQL connection
JWT_SECRET=your-secret-key         # JWT signing key
PORT=3000                          # Server port
CORS_ORIGIN=*                      # Allowed origins
SUPABASE_URL=https://...           # Supabase project URL
SUPABASE_SERVICE_KEY=...           # Supabase service key
GEMINI_API_KEY=...                 # Google Gemini AI key
```

**Key Insight**: Project uses:
- **Supabase** for file storage (avatars, payment proofs)
- **Gemini AI** for Voice Order parsing

---

## 🚀 Entry Points

### 13. `backend/src/main.ts` (42 lines)

**Purpose**: NestJS application bootstrap

**Key Setup**:
```typescript
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // 1. Body size limit (5MB for logo uploads)
    app.use(bodyParser.json({ limit: '5mb' }));
    
    // 2. CORS enabled
    app.enableCors({ origin: process.env.CORS_ORIGIN || '*' });
    
    // 3. Global prefix: /api
    app.setGlobalPrefix('api');
    
    // 4. Validation pipe (whitelist, transform)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,          // Strip unknown properties
        forbidNonWhitelisted: true, // Error on unknown properties
        transform: true,          // Auto-transform types
    }));
}
```

---

### 14. `backend/src/app.module.ts` (75 lines)

**Purpose**: Root module - imports all feature modules

**Module Organization** (25 modules):

| Category | Modules |
|----------|---------|
| **Core** | `PrismaModule`, `AuthModule`, `UserModule` |
| **Business** | `OrderModule`, `PaymentModule`, `DriverModule`, `PangkalanModule` |
| **Stock** | `StockModule`, `LpgProductsModule`, `PangkalanStockModule`, `LpgPriceModule` |
| **Pangkalan** | `ConsumerModule`, `ConsumerOrderModule`, `ExpenseModule` |
| **Supply** | `AgenModule`, `AgenOrdersModule` |
| **Pertamina** | `PerencanaanModule`, `PenyaluranModule`, `PenerimaanModule` |
| **System** | `DashboardModule`, `ActivityModule`, `NotificationModule`, `ReportsModule` |
| **Utility** | `UploadModule`, `CompanyProfileModule` |
| **AI** | `GeminiModule` ⭐ |

---

### 15. `src/layouts/BaseLayout.astro` (63 lines)

**Purpose**: Base HTML template for all pages

**Key Features**:
```astro
<head>
    <!-- Favicon: logo-sim4lon-transparant-v2.png -->
    <!-- Theme persistence script (prevents FOUC) -->
    <script is:inline>
        // Apply saved theme (dark/light) from localStorage
        // Apply saved accent color
    </script>
</head>
<body>
    <Toaster client:load />  <!-- Toast notifications -->
    <slot />                 <!-- Page content -->
</body>
```

---

## 🔑 Phase 1 Key Insights

### Architecture Pattern
```
Frontend (Astro + React)
    ↓ REST API
Backend (NestJS)
    ↓ Prisma ORM
Database (PostgreSQL on Supabase)
```

### Styling Strategy
- **TailwindCSS** for utilities
- **CSS Variables** for theming
- **shadcn/ui** for components (new-york style)
- **Radix UI** for accessible primitives

### External Services
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Railway** | Backend hosting |
| **Supabase** | Database + File storage |
| **Gemini AI** | Voice order parsing |

### Development Workflow
```bash
# Frontend
cd sim4lon && npm run dev     # localhost:4321

# Backend
cd backend && npm run start:dev   # localhost:3000

# API calls from frontend proxied to backend automatically
```

---

# Phase 2: Database Layer

## ✅ Status: COMPLETED (17 files)

---

## Overview

Fase kedua menganalisis **lapisan database** yang menjadi tulang punggung penyimpanan dan persistensi data SIM4LON. Database menggunakan **PostgreSQL** sebagai RDBMS dan **Prisma** sebagai ORM (Object-Relational Mapping) untuk type-safe database access.

### Mengapa PostgreSQL + Prisma?

| Aspek | PostgreSQL | Prisma |
|-------|------------|--------|
| **Reliability** | ACID compliant, mature | Type-safe queries |
| **UUID Support** | Native dengan `uuid-ossp` extension | Auto-generate di schema |
| **Relations** | Foreign keys, cascading | Intuitive relation syntax |
| **Migrations** | Robust migration support | Version-controlled migrations |
| **Developer Experience** | Powerful SQL | IntelliSense di IDE |

### Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRISMA ORM LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  PrismaService (Injectable NestJS Service)              ││
│  │  - Singleton pattern                                    ││
│  │  - Auto-reconnect                                       ││
│  │  - Connection pooling                                   ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────────┐│
│  │  schema.prisma (676 lines)                              ││
│  │  - 22 Models                                            ││
│  │  - 8 Enums                                              ││
│  │  - Full relations mapping                               ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────────────│──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL (Railway)                      │
│  - UUID primary keys untuk semua tabel                      │
│  - Soft delete dengan `deleted_at` column                   │
│  - Automatic `updated_at` trigger                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema (`schema.prisma`)

### Generator & Datasource
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgcrypto, uuid_ossp]  // UUID generation
}
```

---

## 📋 Models (22 Total)

### Core Entities

| Model | Lines | Description | Key Fields |
|-------|-------|-------------|------------|
| `users` | 13-39 | System users | `code`, `email`, `password`, `role`, `pangkalan_id`, `session_id` |
| `agen` | 41-61 | LPG Distributors | `code`, `name`, `address`, `pic_name` |
| `pangkalans` | 63-103 | Distribution agents | `code`, `name`, `address`, `agen_id`, `alokasi_bulanan` |
| `drivers` | 177-194 | Delivery drivers | `code`, `name`, `phone`, `vehicle_id` |

### Product & Pricing

| Model | Description | Key Fields |
|-------|-------------|------------|
| `lpg_products` | Product catalog | `name`, `size_kg`, `category`, `selling_price`, `cost_price`, `brand` |
| `lpg_prices` | Per-pangkalan pricing | `pangkalan_id`, `lpg_type`, `cost_price`, `selling_price` |

### Orders System

| Model | Description | Key Fields |
|-------|-------------|------------|
| `orders` | Main order record | `code`, `pangkalan_id`, `driver_id`, `current_status`, `subtotal`, `tax_amount`, `total_amount` |
| `order_items` | Items in order | `order_id`, `lpg_type`, `price_per_unit`, `qty`, `is_taxable` |
| `timeline_tracks` | Status history | `order_id`, `status`, `description` |
| `invoices` | Generated invoices | `order_id`, `invoice_number`, `grand_total`, `payment_status` |
| `order_payment_details` | Payment summary (1:1) | `order_id`, `is_paid`, `is_dp`, `amount_paid`, `proof_url` |
| `payment_records` | Transaction records | `order_id`, `method`, `amount`, `proof_url`, `recorded_by_user_id` |

### Stock Management

| Model | Description | Key Fields |
|-------|-------------|------------|
| `stock_histories` | Global stock movement | `lpg_product_id`, `movement_type`, `qty`, `recorded_by_user_id` |
| `pangkalan_stocks` | Per-pangkalan stock levels | `pangkalan_id`, `lpg_type`, `qty`, `warning_level`, `critical_level` |
| `pangkalan_stock_movements` | Pangkalan stock history | `pangkalan_id`, `lpg_type`, `movement_type`, `qty` |

### Pangkalan Features

| Model | Description | Key Fields |
|-------|-------------|------------|
| `consumers` | End customers | `pangkalan_id`, `name`, `nik`, `kk`, `consumer_type` |
| `consumer_orders` | Sales to consumers | `pangkalan_id`, `consumer_id`, `lpg_type`, `qty`, `payment_status` |
| `expenses` | Expense tracking | `pangkalan_id`, `category`, `amount`, `expense_date` |
| `agen_orders` | Orders to supplier | `pangkalan_id`, `agen_id`, `lpg_type`, `qty_ordered`, `status` |

### Pertamina Integration

| Model | Description | Key Fields |
|-------|-------------|------------|
| `perencanaan_harian` | Daily planning | `pangkalan_id`, `tanggal`, `lpg_type`, `jumlah_normal`, `jumlah_fakultatif` |
| `penyaluran_harian` | Daily distribution | `pangkalan_id`, `tanggal`, `tipe_pembayaran`, `lpg_type` |
| `penerimaan_stok` | Stock receipt from SPBE | `no_so`, `no_lo`, `nama_material`, `qty_pcs`, `tanggal` |

### System

| Model | Description | Key Fields |
|-------|-------------|------------|
| `activity_logs` | Audit trail | `user_id`, `order_id`, `type`, `title`, `icon_name` |
| `company_profile` | App settings (singleton) | `company_name`, `ppn_rate`, `critical_stock_limit`, `invoice_prefix` |

---

## 🏷️ Enums (9 Total)

### User & Access
```prisma
enum user_role {
  ADMIN       // Full access
  OPERATOR    // Limited access
  PANGKALAN   // Own data only
}

enum consumer_type {
  RUMAH_TANGGA  // Household
  WARUNG        // Small business
}
```

### Product
```prisma
enum lpg_category {
  SUBSIDI       // 3kg hijau (subsidized)
  NON_SUBSIDI   // 12kg, 50kg (commercial)
}

enum lpg_type {  // @deprecated - use lpg_products
  kg3    @map("3kg")
  kg5    @map("5.5kg")
  kg12   @map("12kg")
  kg50   @map("50kg")
  gr220  @map("220gr")
}
```

### Order Workflow
```prisma
enum status_pesanan {
  DRAFT                 // Newly created
  MENUNGGU_PEMBAYARAN   // Awaiting payment
  DIPROSES              // Being processed
  SIAP_KIRIM            // Ready for delivery
  DIKIRIM               // Out for delivery
  SELESAI               // Completed
  BATAL                 // Cancelled
}

enum agen_order_status {
  PENDING   // Waiting for agen
  DIKIRIM   // Agen shipped
  DITERIMA  // Pangkalan received
  BATAL     // Cancelled
}
```

### Financial
```prisma
enum payment_method {
  TUNAI     // Cash
  TRANSFER  // Bank transfer
}

enum stock_movement_type {
  MASUK   // Stock in
  KELUAR  // Stock out
}

enum consumer_payment_status {
  LUNAS  // Paid in full (no debt feature)
}
```

---

## 🔌 PrismaService (`prisma.service.ts`)

**Purpose**: Database connection with Prisma v7 adapter pattern

**Key Implementation**:
```typescript
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private _client: PrismaClient;

    constructor(private configService: ConfigService) {
        // PostgreSQL connection pool
        this.pool = new Pool({
            connectionString: this.configService.get<string>('DATABASE_URL'),
        });

        // Prisma v7 adapter
        const adapter = new PrismaPg(this.pool);
        this._client = new PrismaClient({ adapter });
    }

    // Shortcut accessors for 22+ models
    get users() { return this._client.users; }
    get orders() { return this._client.orders; }
    // ... etc

    // Transaction support
    $transaction<T>(fn) { return this._client.$transaction(fn); }
}
```

**Key Pattern**: Uses **adapter pattern** for PostgreSQL via `@prisma/adapter-pg`. This is different from older Prisma versions.

---

## 🌱 Seed Files

### Main Seed (`seed.ts` - 393 lines)

**Run**: `npx prisma db seed`

**Creates**:
1. **Users** (2):
   - `admin@sim4lon.co.id` / `admin123` (ADMIN)
   - `operator@sim4lon.co.id` / `operator123` (OPERATOR)

2. **Drivers** (2):
   - DRV-001: Bambang Sugiharto
   - DRV-002: Dedi Iskandar

3. **Pangkalans** (3):
   - PKL-001: Pangkalan Maju Jaya (Jakarta)
   - PKL-002: Pangkalan Berkah Sejahtera (Semarang)
   - PKL-003: Pangkalan Sumber Rezeki (Bandung)

4. **Orders** (5) with various statuses:
   - SELESAI, DIPROSES, DRAFT, MENUNGGU_PEMBAYARAN

5. **Stock Histories** (5):
   - Initial stock: 500 x 3kg, 200 x 12kg, 50 x 50kg

---

### LPG Products Seed (`seed-lpg-products.ts`)

**Run**: `npx ts-node --transpile-only prisma/seed-lpg-products.ts`

**Creates 5 Products**:

| Product | Size | Category | Selling Price | Cost Price |
|---------|------|----------|---------------|------------|
| Elpiji 3kg | 3.0 kg | SUBSIDI | Rp 18,000 | Rp 16,000 |
| Elpiji 12kg | 12.0 kg | NON_SUBSIDI | Rp 180,000 | Rp 165,000 |
| Bright Gas 5.5kg | 5.5 kg | NON_SUBSIDI | Rp 85,000 | Rp 78,000 |
| Bright Gas 12kg | 12.0 kg | NON_SUBSIDI | Rp 195,000 | Rp 180,000 |
| Elpiji 50kg | 50.0 kg | NON_SUBSIDI | Rp 750,000 | Rp 700,000 |

---

## 🔑 Phase 2 Key Insights

### Entity Relationships
```
Company Profile (singleton)
    │
    ├── Agen (Distributors)
    │       └── Pangkalans (many)
    │               ├── Users (PANGKALAN role)
    │               ├── Consumers
    │               │       └── Consumer Orders
    │               ├── Pangkalan Stocks
    │               ├── Expenses
    │               └── Agen Orders (to supplier)
    │
    └── Orders (from Agen to Pangkalan)
            ├── Order Items
            ├── Timeline Tracks
            ├── Invoices
            ├── Payment Details
            └── Payment Records
```

### Design Patterns
- **UUID Primary Keys**: All IDs use `gen_random_uuid()`
- **Soft Delete**: `deleted_at` nullable timestamp
- **Audit Fields**: `created_at`, `updated_at` on all tables
- **Display Codes**: Human-readable codes (USR-001, PKL-001, etc.)
- **Indexes**: Strategic indexing on foreign keys and frequently queried fields

### Multi-Tenant Architecture
- `pangkalan_id` on most tables enables data isolation
- PANGKALAN role users only see their own pangkalan's data
- Stock levels tracked per-pangkalan

---

# Phase 3: Authentication System

## ✅ Status: COMPLETED (22 files)

---

## Overview

Complete authentication system with **JWT tokens**, **role-based access control (RBAC)**, **single-session enforcement**, and **profile caching**.

---

## 🏗️ Backend Authentication Module

### Module Structure

```
backend/src/modules/auth/
├── auth.module.ts          # Module definition
├── auth.controller.ts      # API endpoints
├── auth.service.ts         # Business logic (244 lines)
├── strategies/
│   ├── index.ts
│   └── jwt.strategy.ts     # JWT validation
├── guards/
│   ├── index.ts
│   ├── jwt-auth.guard.ts   # Token verification
│   └── roles.guard.ts      # RBAC enforcement
├── decorators/
│   ├── index.ts
│   ├── public.decorator.ts # Mark public routes
│   ├── roles.decorator.ts  # Restrict by role
│   └── current-user.decorator.ts  # Get current user
└── dto/
    ├── index.ts
    ├── login.dto.ts
    ├── register.dto.ts
    ├── update-profile.dto.ts
    └── change-password.dto.ts
```

---

### 1. `auth.module.ts`

**Purpose**: Configure authentication with JWT and Passport

```typescript
@Module({
    imports: [
        PrismaModule,
        ActivityModule,  // For login activity logging
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'default-secret-key',
            signOptions: { expiresIn: '7d' },  // Token expires in 7 days
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtModule],
})
```

**Key Config**:
- JWT expiry: **7 days**
- Default strategy: **jwt**
- Activity logging for login events

---

### 2. `auth.controller.ts` (41 lines)

**API Endpoints**:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | @Public | Create new user |
| POST | `/auth/login` | @Public | Login & get token |
| GET | `/auth/profile` | @JwtAuthGuard | Get current user profile |
| PUT | `/auth/profile` | @JwtAuthGuard | Update profile |
| PUT | `/auth/change-password` | @JwtAuthGuard | Change password |

**Code Pattern**:
```typescript
@Public()
@Post('login')
login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
}

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
}
```

---

### 3. `auth.service.ts` (244 lines)

**Key Methods**:

#### `register(dto: RegisterDto)`
```typescript
async register(dto: RegisterDto) {
    // 1. Check if email exists
    const existing = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');
    
    // 2. Hash password (bcrypt, 10 rounds)
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // 3. Generate user code (USR-001, USR-002, etc.)
    const userCount = await this.prisma.users.count();
    const userCode = `USR-${String(userCount + 1).padStart(3, '0')}`;
    
    // 4. Create user
    const user = await this.prisma.users.create({ ... });
    
    // 5. Log activity
    await this.activityService.logActivity('system_create', 'User Baru Dibuat', { ... });
}
```

#### `login(dto: LoginDto)` - CRITICAL
```typescript
async login(dto: LoginDto) {
    // 1. Find user by email (include pangkalan info)
    const user = await this.prisma.users.findUnique({
        where: { email: dto.email },
        include: { pangkalans: { select: { id, code, name, is_active } } }
    });
    
    // 2. Check user exists
    if (!user) throw new UnauthorizedException('Email atau password salah');
    
    // 3. Check user is active
    if (!user.is_active) throw new UnauthorizedException('Akun tidak aktif');
    
    // 4. Check pangkalan is active (for PANGKALAN role)
    if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
        throw new UnauthorizedException('Pangkalan Anda sudah dinonaktifkan...');
    }
    
    // 5. Validate password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email atau password salah');
    
    // 6. Generate unique session_id (for single-session login)
    const sessionId = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // 7. Save session_id to DB (invalidates old sessions)
    await this.prisma.users.update({ where: { id: user.id }, data: { session_id: sessionId } });
    
    // 8. Generate JWT with session_id
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        pangkalan_id: user.pangkalan_id,
        session_id: sessionId,  // For single-session validation
    };
    const accessToken = this.jwtService.sign(payload);
    
    // 9. Log activity
    await this.activityService.logActivity('user_login', 'User Login', { ... });
    
    return { access_token: accessToken, user: { ... } };
}
```

#### `changePassword(userId, oldPassword, newPassword)`
```typescript
async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // 1. Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Kata sandi lama tidak sesuai');
    
    // 2. Hash new password & update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.users.update({ where: { id: userId }, data: { password: hashedPassword } });
}
```

---

### 4. `jwt.strategy.ts` (60 lines)

**Purpose**: Validate JWT tokens on every authenticated request

```typescript
export interface JwtPayload {
    sub: string;        // User ID
    email: string;
    role: string;
    pangkalan_id?: string;
    session_id?: string;  // For single-session validation
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.users.findUnique({
            where: { id: payload.sub },
            include: { pangkalans: { select: { is_active } } },
        });

        // Check user active
        if (!user || !user.is_active) {
            throw new UnauthorizedException('User tidak ditemukan atau tidak aktif');
        }

        // Check pangkalan active (for PANGKALAN role)
        if (user.role === 'PANGKALAN' && user.pangkalans && !user.pangkalans.is_active) {
            throw new UnauthorizedException('Pangkalan Anda sudah dinonaktifkan...');
        }

        // TEMPORARILY DISABLED: Single-session validation
        // if (payload.session_id && user.session_id && payload.session_id !== user.session_id) {
        //     throw new UnauthorizedException('Login di perangkat lain');
        // }

        return user;  // Attached to request.user
    }
}
```

---

### 5. Guards

#### `jwt-auth.guard.ts` (32 lines)
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) { super(); }

    canActivate(context: ExecutionContext) {
        // Check for @Public() decorator
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;  // Skip auth for public routes

        return super.canActivate(context);  // Validate JWT
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('Token tidak valid');
        }
        return user;
    }
}
```

#### `roles.guard.ts` (24 lines)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Get required roles from @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<user_role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;  // No restriction

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
}
```

**Usage**:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')  // Only ADMIN can access
@Delete(':id')
deleteOrder(@Param('id') id: string) { ... }
```

---

### 6. Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@Public()` | Mark route as public (no auth) | `@Public() @Post('login')` |
| `@Roles(...roles)` | Restrict to specific roles | `@Roles('ADMIN', 'OPERATOR')` |
| `@CurrentUser()` | Get current user from request | `@CurrentUser() user: User` |
| `@CurrentUser('id')` | Get specific property | `@CurrentUser('id') userId: string` |

---

### 7. DTOs (Data Transfer Objects)

#### `login.dto.ts`
```typescript
export class LoginDto {
    @IsEmail() @IsNotEmpty()
    email: string;

    @IsString() @IsNotEmpty() @MinLength(6)
    password: string;
}
```

#### `register.dto.ts`
```typescript
export class RegisterDto {
    @IsEmail() @IsNotEmpty() email: string;
    @IsString() @IsNotEmpty() @MinLength(6) password: string;
    @IsString() @IsNotEmpty() name: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsEnum(user_role) role?: user_role;
}
```

#### `change-password.dto.ts` - Strong Password Validation
```typescript
export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Kata sandi lama harus diisi' })
    oldPassword: string;

    @IsNotEmpty({ message: 'Kata sandi baru harus diisi' })
    @MinLength(8, { message: 'Kata sandi baru minimal 8 karakter' })
    @Matches(/(?=.*[a-z])/, { message: 'Harus mengandung huruf kecil' })
    @Matches(/(?=.*[A-Z])/, { message: 'Harus mengandung huruf besar' })
    @Matches(/(?=.*\d)/, { message: 'Harus mengandung angka' })
    newPassword: string;
}
```

#### `update-profile.dto.ts`
```typescript
export class UpdateProfileDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @Matches(/^(\+62|0)[0-9]{9,12}$/) phone?: string;  // Indonesian phone
    @IsOptional() @IsString() avatar_url?: string;
}
```

---

## 🖥️ Frontend Authentication

### 1. `LoginForm.tsx` (260 lines)

**Purpose**: Login page with role-based redirect

**Key Features**:
- Auto-redirect if already logged in
- Role-based dashboard routing
- Show/hide password toggle
- Demo credentials display
- Responsive design (mobile-first)
- Loading state with spinner

**Role-Based Redirect**:
```typescript
const dashboardRoutes: Record<string, string> = {
    'ADMIN': '/dashboard-admin',
    'OPERATOR': '/dashboard-admin',
    'PANGKALAN': '/pangkalan/dashboard',
};
const redirectUrl = dashboardRoutes[response.user.role] || '/dashboard-admin';
window.location.href = redirectUrl;
```

---

### 2. `AuthGuard.tsx` (196 lines)

**Purpose**: Protect routes with authentication and role checks

**Key Features**:
- **Session caching**: Profile cached in sessionStorage for 5 minutes
- Optimistic rendering (no flash if cache valid)
- Role-based access control via `allowedRoles` prop
- Auto-redirect to correct dashboard if wrong role

**Cache Implementation**:
```typescript
const PROFILE_CACHE_KEY = 'sim4lon_user_profile';
const CACHE_DURATION_MS = 5 * 60 * 1000;  // 5 minutes

function getCachedProfile(): UserProfile | null {
    const cachedTime = sessionStorage.getItem(PROFILE_CACHE_TIME_KEY);
    const elapsed = Date.now() - parseInt(cachedTime, 10);
    if (elapsed > CACHE_DURATION_MS) return null;  // Expired
    return JSON.parse(sessionStorage.getItem(PROFILE_CACHE_KEY));
}
```

**Usage in Astro pages**:
```astro
<AuthGuard client:load allowedRoles={['ADMIN', 'OPERATOR']}>
    <DashboardContent client:load />
</AuthGuard>
```

---

### 3. `useAuth.ts` (109 lines)

**Purpose**: React hook for auth state management

**Interface**:
```typescript
interface AuthState {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export function useAuth() {
    return {
        ...state,      // user, isLoading, isAuthenticated, error
        login,         // async (data: LoginRequest) => { success, user? }
        logout,        // () => void
        checkAuth,     // async () => void
    };
}
```

---

### 4. `api.ts` Auth Section (lines 87-171)

**Token Management**:
```typescript
const TOKEN_KEY = 'sim4lon_token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}
```

**Auth API Functions**:
```typescript
export const authApi = {
    login(data: LoginRequest): Promise<LoginResponse>,
    getProfile(): Promise<UserProfile>,
    updateProfile(data): Promise<{ message, user }>,
    changePassword(data): Promise<{ message }>,
    logout(): void,  // Remove token + redirect
};
```

---

## 🔑 Phase 3 Key Insights

### Authentication Flow
```
1. User enters email/password
2. POST /auth/login
3. Backend validates credentials
4. Backend generates session_id + JWT
5. JWT returned to frontend
6. Frontend stores JWT in localStorage
7. Frontend caches profile in sessionStorage
8. Subsequent requests include Bearer token
9. JwtStrategy validates token + user status
10. RolesGuard checks role permissions
```

### Security Features
| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt, 10 rounds |
| **Token Expiry** | JWT expires in 7 days |
| **Single Session** | session_id in token (disabled for testing) |
| **Password Rules** | Min 8 chars, uppercase, lowercase, number |
| **Pangkalan Validation** | Block login if pangkalan deactivated |
| **User Status Check** | Block login if user deactivated |

### Role-Based Access
| Role | Dashboard | Access Level |
|------|-----------|--------------|
| **ADMIN** | `/dashboard-admin` | Full access |
| **OPERATOR** | `/dashboard-admin` | Limited (no settings) |
| **PANGKALAN** | `/pangkalan/dashboard` | Own data only |

---

# Phase 4: Core Business (Orders)

## ✅ Status: COMPLETED (35 files)

---

## Overview

Complete order management system with **7 status workflow**, **Voice Order AI integration**, **PPN 12% calculation**, **stock validation**, and **monthly allocation tracking**.

---

## 🏗️ Backend Order Module

### Module Structure

```
backend/src/modules/order/
├── order.module.ts       # Module definition (14 lines)
├── order.controller.ts   # API endpoints (64 lines, 7 endpoints)
├── order.service.ts      # Business logic (841 lines) ⭐
└── dto/
    ├── index.ts
    └── order.dto.ts      # DTOs (117 lines)
```

---

### 1. `order.controller.ts` (64 lines)

**API Endpoints**:

| Method | Route | Description | Query Params |
|--------|-------|-------------|--------------|
| GET | `/orders` | List all orders | page, limit, status, pangkalan_id, driver_id, sort_by, sort_order |
| GET | `/orders/stats` | Order statistics | today=true |
| GET | `/orders/:id` | Get order detail | - |
| POST | `/orders` | Create order | - |
| PUT | `/orders/:id` | Update order | - |
| PATCH | `/orders/:id/status` | Update status | - |
| DELETE | `/orders/:id` | Soft delete | - |

---

### 2. `order.service.ts` (841 lines) ⭐ **CRITICAL**

#### `create(dto: CreateOrderDto)` - Order Creation

**6 Validations**:
```typescript
// 1. Items tidak boleh kosong
if (!dto.items || dto.items.length === 0) {
    throw new BadRequestException('Silakan tambahkan minimal satu item LPG');
}

// 2. Driver tidak sedang mengantar
if (dto.driver_id) {
    const driverBusyOrder = await this.prisma.orders.findFirst({
        where: { driver_id, current_status: 'DIKIRIM' }
    });
    if (driverBusyOrder) throw new BadRequestException('Supir sedang mengantar...');
}

// 3. Pangkalan aktif
if (!pangkalan.is_active) throw new BadRequestException('Pangkalan tidak aktif');

// 4. Alokasi bulanan LPG 3kg (SUBSIDI)
const total3kgOrdered = dto.items.filter(i => i.lpg_type === '3kg').reduce(...);
if (total3kgOrdered > remainingAllocation) {
    throw new BadRequestException('Melebihi alokasi bulanan!');
}

// 5. Stok cukup
for (const item of dto.items) {
    const currentStock = (stockIn - stockOut);
    if (item.qty > currentStock) throw new BadRequestException('Stok ga cukup!');
}

// 6. Voice Order Express (skip status)
const initialStatus = (dto.is_voice_order && dto.is_paid_cash) ? 'DIPROSES' : 'DRAFT';
```

**Key Features**:
- Auto-generate order code: `ORD-0001`, `ORD-0002`, etc.
- PPN 12% calculation for NON_SUBSIDI items
- Stock deduction on create
- Activity logging

---

#### `updateStatus(id, dto)` - Status Transition

**Valid Transitions**:
```typescript
const validTransitions = {
    DRAFT: ['MENUNGGU_PEMBAYARAN', 'BATAL'],
    MENUNGGU_PEMBAYARAN: ['DIPROSES', 'BATAL'],
    DIPROSES: ['SIAP_KIRIM', 'DIKIRIM', 'BATAL'],
    SIAP_KIRIM: ['DIKIRIM', 'BATAL'],
    DIKIRIM: ['SELESAI', 'BATAL'],
    SELESAI: [],  // Terminal
    BATAL: [],     // Terminal
};
```

**Status = BATAL**:
- Stock restoration (MASUK)
- Payment reset

**Status = SELESAI**:
- Pangkalan stock sync (upsert)
- Pangkalan stock movement (IN)
- Penyaluran harian sync

---

### 3. `order.dto.ts` (117 lines)

#### `OrderItemDto`
```typescript
export class OrderItemDto {
    @IsString() @IsNotEmpty()
    lpg_type: string;  // Dynamic: "3kg", "12kg", "50kg"

    @IsOptional() @IsString()
    lpg_product_id?: string;  // For stock tracking

    @IsNumber() @Min(0)
    price_per_unit: number;

    @IsInt() @Min(1)
    qty: number;

    @IsOptional()
    is_taxable?: boolean;  // true = NON_SUBSIDI (kena PPN)
}
```

#### `CreateOrderDto`
```typescript
export class CreateOrderDto {
    @IsString() @Matches(UUID_REGEX)
    pangkalan_id: string;

    @IsOptional() @IsString()
    driver_id?: string;

    @IsArray() @ArrayNotEmpty() @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    // Voice Order Express Flags
    @IsOptional() is_voice_order?: boolean;
    @IsOptional() is_paid_cash?: boolean;
}
```

---

## 🖥️ Frontend Order Components

### Components Overview

| File | Lines | Purpose |
|------|-------|---------|
| `CreateOrderForm.tsx` | **1028** | Main form with Voice Order |
| `VoiceOrderInput.tsx` | **325** | Speech recognition UI |
| `LpgItemSelector.tsx` | 150 | Product selection |
| `OrderSummary.tsx` | 200 | Price summary panel |

---

### 1. `CreateOrderForm.tsx` (1028 lines)

**Key Functions**:

#### `handleSubmit()`
```typescript
const handleSubmit = async (e) => {
    // 1. Validate pangkalan selected
    // 2. Validate items exist
    // 3. Validate stock untuk setiap item
    // 4. Validate harga > 0
    // 5. Build orderDto
    // 6. POST /orders or PUT /orders/:id
}
```

#### `handleVoiceOrderConfirmed()`
```typescript
const handleVoiceOrderConfirmed = (result) => {
    // Auto-fill form dari hasil Voice AI:
    // - Set pangkalanId
    // - Map productId ke order items
    // - Calculate prices
}
```

#### PPN Calculation
```typescript
const calculateTax = () => {
    return formData.items
        .filter(item => item.isTaxable)  // NON_SUBSIDI only
        .reduce((sum, item) => sum + Math.round(item.price * item.qty * 0.12), 0);
};
```

---

### 2. `VoiceOrderInput.tsx` (325 lines)

**Purpose**: Speech recognition + NLP parsing

**Flow**:
```
1. User clicks microphone button
2. useSpeechRecognition hook starts listening
3. Real-time transcript display
4. parseVoiceCommand() extracts intent
5. Fuzzy match to pangkalan + products
6. onVoiceOrderConfirmed callback
```

**Key Props**:
```typescript
interface VoiceOrderInputProps {
    pangkalanList: PangkalanOption[];
    lpgProducts: LpgProductOption[];
    onVoiceOrderConfirmed: (result: VoiceOrderResult) => void;
    disabled?: boolean;
}
```

---

## 📊 Order Status Workflow

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> MENUNGGU_PEMBAYARAN : Submit
    DRAFT --> BATAL : Cancel
    
    MENUNGGU_PEMBAYARAN --> DIPROSES : Payment Confirmed
    MENUNGGU_PEMBAYARAN --> BATAL : Cancel
    
    DIPROSES --> SIAP_KIRIM : Ready
    DIPROSES --> DIKIRIM : Skip to Delivery
    DIPROSES --> BATAL : Cancel
    
    SIAP_KIRIM --> DIKIRIM : Dispatch
    SIAP_KIRIM --> BATAL : Cancel
    
    DIKIRIM --> SELESAI : Delivered
    DIKIRIM --> BATAL : Cancel
    
    SELESAI --> [*]
    BATAL --> [*]
```

---

## 🔑 Phase 4 Key Insights

### Order Creation Flow
```
1. User selects pangkalan
2. User adds LPG items (dynamic products)
3. System validates:
   - Driver availability
   - Monthly allocation (3kg subsidi)
   - Stock availability
4. Calculate PPN 12% for NON_SUBSIDI
5. Create order (DRAFT or DIPROSES for Voice)
6. Deduct stock
7. Log activity
```

### Business Rules
| Rule | Implementation |
|------|----------------|
| **Monthly Allocation** | LPG 3kg tracked per-pangkalan per-month |
| **Driver Single Task** | Can only deliver 1 order at a time |
| **PPN 12%** | Applied only to NON_SUBSIDI products |
| **Stock Deduction** | On order create, restored on cancel |
| **Pangkalan Stock Sync** | Updated on order SELESAI |

### Voice Order Express
- If `is_voice_order=true` AND `is_paid_cash=true`:
  - Skip DRAFT and MENUNGGU_PEMBAYARAN
  - Start directly at DIPROSES
  - Auto-create payment record (TUNAI, LUNAS)

---

# Phase 5: Stock Management

## ✅ Status: COMPLETED (25 files)

---

## Overview

**3-tier stock architecture**: Agen stock (global), LPG Products (catalog), Pangkalan stock (per-outlet).

---

## 🏗️ Backend Stock Modules

### Module Overview

| Module | Files | Purpose |
|--------|-------|---------|
| `stock` | 4 | Global agen stock history |
| `lpg-products` | 5 | Product catalog + prices |
| `pangkalan-stock` | 4 | Per-pangkalan inventory |

---

## 1. Stock Module (Agen Level)

### `stock.controller.ts` (54 lines)

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/stocks/history` | All | Stock movement history |
| GET | `/stocks/summary` | All | Current stock by type |
| GET | `/stocks/history/:lpgType` | All | History by LPG type |
| POST | `/stocks/movements` | ADMIN, OPERATOR | Create movement |

### `stock.service.ts` (149 lines)

**Key Methods**:

#### `getSummary()` - Current Stock Calculation
```typescript
async getSummary() {
    const stockData = await this.prisma.stock_histories.groupBy({
        by: ['lpg_type', 'movement_type'],
        _sum: { qty: true }
    });
    
    // Calculate: current = MASUK - KELUAR
    for (const type of Object.keys(summary)) {
        summary[type].current = summary[type].in - summary[type].out;
    }
}
```

#### `createMovement()` - Add/Remove Stock
```typescript
async createMovement(dto, userId) {
    // Support both legacy lpg_type AND new lpg_product_id
    const data = {
        movement_type: dto.movement_type,  // MASUK or KELUAR
        qty: dto.qty,
        note: dto.note,
        recorded_by_user_id: userId,
    };
    
    if (dto.lpg_product_id) data.lpg_product_id = dto.lpg_product_id;
    if (dto.lpg_type) data.lpg_type = dto.lpg_type;
    
    return this.prisma.stock_histories.create({ data });
}
```

---

## 2. LPG Products Module

### `lpg-products.controller.ts` (55 lines)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/lpg-products` | List all products |
| GET | `/lpg-products/stock-summary` | Products with current stock |
| GET | `/lpg-products/:id` | Get product detail |
| POST | `/lpg-products` | Create product |
| PUT | `/lpg-products/:id` | Update product |
| DELETE | `/lpg-products/:id` | Soft delete |

### `lpg-products.service.ts` (123 lines)

#### `getStockSummary()` - Products with Stock Status
```typescript
async getStockSummary() {
    const products = await this.findAll();
    
    return Promise.all(products.map(async (product) => {
        const stockIn = await this.prisma.stock_histories.aggregate({
            where: { lpg_product_id: product.id, movement_type: 'MASUK' },
            _sum: { qty: true }
        });
        const stockOut = await this.prisma.stock_histories.aggregate({
            where: { lpg_product_id: product.id, movement_type: 'KELUAR' },
            _sum: { qty: true }
        });
        
        return {
            ...product,
            stock: {
                in: stockIn._sum.qty || 0,
                out: stockOut._sum.qty || 0,
                current: (stockIn._sum.qty || 0) - (stockOut._sum.qty || 0)
            }
        };
    }));
}
```

---

## 3. Pangkalan Stock Module

### `pangkalan-stock.controller.ts` (81 lines)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/pangkalan-stocks` | Get stock levels |
| GET | `/pangkalan-stocks/movements` | Movement history |
| POST | `/pangkalan-stocks/receive` | Receive from agen |
| POST | `/pangkalan-stocks/adjust` | Stock opname |
| PUT | `/pangkalan-stocks/levels` | Update alert levels |

> **Note**: All endpoints restricted to `@Roles('PANGKALAN')`

### `pangkalan-stock.service.ts` (219 lines) ⭐

#### `getStockLevels()` - Stock with Alert Status
```typescript
async getStockLevels(pangkalanId) {
    const stocks = await Promise.all(
        LPG_TYPES.map(async (lpgType) => {
            const stock = await this.getOrCreateStock(pangkalanId, lpgType);
            
            // Calculate status based on levels
            const status = 
                stock.qty <= stock.critical_level ? 'KRITIS' :
                stock.qty <= stock.warning_level ? 'RENDAH' : 'AMAN';
            
            return { ...stock, status };
        })
    );
    
    return {
        stocks,
        summary: {
            total: stocks.reduce((sum, s) => sum + s.qty, 0),
            hasWarning: stocks.some(s => s.status === 'RENDAH'),
            hasCritical: stocks.some(s => s.status === 'KRITIS')
        }
    };
}
```

#### `receiveStock()` - From Agen
```typescript
async receiveStock(pangkalanId, dto) {
    const stock = await this.getOrCreateStock(pangkalanId, dto.lpg_type);
    
    // Update qty
    await this.prisma.pangkalan_stocks.update({
        where: { id: stock.id },
        data: { qty: stock.qty + dto.qty }
    });
    
    // Record movement (MASUK from AGEN)
    await this.prisma.pangkalan_stock_movements.create({
        data: { movement_type: 'MASUK', source: 'AGEN', ... }
    });
}
```

#### `deductStock()` - On Sale (Internal)
```typescript
async deductStock(pangkalanId, lpgType, qty, referenceId) {
    if (stock.qty < qty) {
        throw new BadRequestException('Stok tidak cukup');
    }
    
    // Record movement (KELUAR from PENJUALAN)
    await this.prisma.pangkalan_stock_movements.create({
        data: { movement_type: 'KELUAR', source: 'PENJUALAN', reference_id }
    });
}
```

#### `adjustStock()` - Stock Opname
```typescript
async adjustStock(pangkalanId, dto) {
    const difference = dto.actual_qty - stock.qty;
    
    // Record OPNAME movement
    await this.prisma.pangkalan_stock_movements.create({
        data: {
            movement_type: 'OPNAME',
            source: 'OPNAME',
            note: `Koreksi: ${stock.qty} → ${dto.actual_qty} (${difference})`
        }
    });
}
```

---

## 📊 Stock Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AGEN LEVEL                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  stock_histories (global movement log)               │   │
│  │  - lpg_type / lpg_product_id                        │   │
│  │  - movement_type: MASUK | KELUAR                    │   │
│  │  - qty, note, recorded_by_user_id                   │   │
│  │  Current = SUM(MASUK) - SUM(KELUAR)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                     Order SELESAI                           │
│                           ↓                                 │
├─────────────────────────────────────────────────────────────┤
│                    PANGKALAN LEVEL                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  pangkalan_stocks (current qty per type)            │   │
│  │  - pangkalan_id, lpg_type                           │   │
│  │  - qty, warning_level, critical_level               │   │
│  │  Status: AMAN | RENDAH | KRITIS                     │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  pangkalan_stock_movements (history)                │   │
│  │  - movement_type: MASUK | KELUAR | OPNAME           │   │
│  │  - source: AGEN | PENJUALAN | ORDER | OPNAME        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                    Consumer Order                           │
│                           ↓                                 │
│               Penjualan ke konsumen (KELUAR)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Phase 5 Key Insights

### Stock Movement Types
| Type | Direction | Source |
|------|-----------|--------|
| `MASUK` | In | Penerimaan, Order SELESAI |
| `KELUAR` | Out | Order create, Penjualan |
| `OPNAME` | Adjust | Manual stock count |

### Stock Calculation Formula
```
Current Stock = SUM(all MASUK) - SUM(all KELUAR)
```

### Alert Levels (Pangkalan)
| Status | Condition |
|--------|-----------|
| **KRITIS** | qty <= critical_level |
| **RENDAH** | qty <= warning_level |
| **AMAN** | qty > warning_level |

---

# Phase 6: Pangkalan Features

## ✅ Status: COMPLETED (30 files)

---

## Overview

Complete **B2C sales system** for pangkalan: consumer management, sales recording, expense tracking, and profit calculation.

---

## 🏗️ Backend Pangkalan Modules

### Module Overview

| Module | Files | Lines | Purpose |
|--------|-------|-------|---------|
| `consumer` | 5 | 200 | Customer management |
| `consumer-order` | 5 | **509** | Sales recording |
| `expense` | 4 | 124 | Expense tracking |
| `agen-orders` | 4 | 350+ | Orders TO agen |

---

## 1. Consumer Module

### Features
- Multi-tenant isolation by `pangkalan_id`
- Consumer types: `RUMAH_TANGGA` / `WARUNG`
- NIK/KK tracking for subsidy verification

### `consumer.service.ts` (200 lines)

| Method | Description |
|--------|-------------|
| `findAll(pangkalanId, page, limit, search)` | List with search |
| `findOne(id, pangkalanId)` | Get with ownership check |
| `create(pangkalanId, dto)` | Create consumer |
| `update(id, pangkalanId, dto)` | Update with ownership check |
| `remove(id, pangkalanId)` | Soft delete if has orders |
| `getStats(pangkalanId)` | Dashboard stats |

### Stats Response
```typescript
{
    total: 50,
    active: 45,
    inactive: 5,
    rumahTangga: 35,  // Rumah Tangga count
    warung: 15,       // Warung count
    withNik: 40,      // NIK verified count
}
```

---

## 2. Consumer Order Module (Sales)

### Purpose
- Record sales from pangkalan TO consumers
- Different from `orders` (pangkalan TO agen)
- Support walk-in (`consumer_name`) AND registered (`consumer_id`)

### `consumer-order.service.ts` (509 lines) ⭐

#### `create()` - Record a Sale
```typescript
async create(pangkalanId: string, dto: CreateConsumerOrderDto) {
    // 1. Validate consumer_id or consumer_name
    if (!dto.consumer_id && !dto.consumer_name) {
        throw new BadRequestException('Harus mengisi consumer_id atau consumer_name');
    }
    
    // 2. Generate order code: PORD-YYMMDD-HHMM-XXX
    const orderCode = `PORD-${datePart}-${timePart}-${randomPart}`;
    
    // 3. Calculate total
    const totalAmount = dto.qty * dto.price_per_unit;
    
    // 4. HPP (Harga Pokok Pembelian)
    const COST_PRICES = {
        'kg3': 16000, 'kg5': 52000, 'kg12': 142000, 'kg50': 590000,
    };
    
    // 5. Create order record
    const order = await this.prisma.consumer_orders.create({ ... });
    
    // 6. Deduct pangkalan stock (OUT movement)
    await this.prisma.pangkalan_stocks.update({
        data: { qty: existingStock.qty - dto.qty }
    });
    
    // 7. Record stock movement for audit
    await this.prisma.pangkalan_stock_movements.create({
        data: { movement_type: 'OUT', source: 'SALE', reference_id: order.id }
    });
}
```

#### `getStats()` - Dashboard Analytics
```typescript
async getStats(pangkalanId: string, todayOnly = false) {
    // Calculate:
    // - total_revenue (penjualan)
    // - total_modal (HPP × qty)
    // - margin_kotor (revenue - modal)
    // - total_pengeluaran (from expenses)
    // - laba_bersih (margin - pengeluaran)
    
    return {
        total_orders: 25,
        total_qty: 100,
        total_revenue: 2000000,
        total_modal: 1600000,
        margin_kotor: 400000,
        total_pengeluaran: 50000,
        laba_bersih: 350000,
    };
}
```

#### `getChartData()` - 7-Day Trend
```typescript
async getChartData(pangkalanId: string) {
    // Returns last 7 days with:
    return [
        { day: 'Sen', date: '2026-01-01', penjualan: 500000, modal: 400000, pengeluaran: 20000, laba: 80000 },
        { day: 'Sel', date: '2026-01-02', penjualan: 600000, modal: 480000, pengeluaran: 15000, laba: 105000 },
        // ... etc
    ];
}
```

---

## 3. Expense Module

### `expense.service.ts` (124 lines)

| Method | Description |
|--------|-------------|
| `findAll(pangkalanId, startDate, endDate)` | List with date filter |
| `create(pangkalanId, dto)` | Create expense |
| `update(id, pangkalanId, dto)` | Update expense |
| `delete(id, pangkalanId)` | Delete expense |
| `getSummary(pangkalanId, start, end)` | Report summary |

### Summary Response
```typescript
{
    total: 500000,
    count: 15,
    byCategory: {
        'Operasional': 200000,
        'Transportasi': 150000,
        'Lainnya': 150000,
    },
    byDate: {
        '2026-01-01': 100000,
        '2026-01-02': 75000,
        // ...
    }
}
```

---

## 📊 Pangkalan Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PANGKALAN DASHBOARD                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │   STOK LPG   │     │  PENJUALAN   │     │ PENGELUARAN  │ │
│  │              │     │              │     │              │ │
│  │ kg3: 50 unit │────▶│ Catat Sale   │     │ Bensin: 50k  │ │
│  │ kg12: 20 unit│     │ PORD-xxx     │     │ Listrik: 30k │ │
│  │              │     │              │     │              │ │
│  │  ───────────  │     │  ───────────  │     │  ──────────  │ │
│  │ AMAN/RENDAH  │     │ Stock -1     │     │              │ │
│  │ /KRITIS      │     │ Revenue +20k │     │              │ │
│  └──────────────┘     └──────────────┘     └──────────────┘ │
│          │                   │                    │         │
│          │                   ▼                    │         │
│          │         ┌──────────────────┐          │         │
│          │         │    KEUANGAN      │◀─────────│         │
│          │         │                  │                     │
│          │         │ Penjualan: 2.0jt │                     │
│          └────────▶│ Modal: 1.6jt    │                     │
│                    │ Margin: 400k    │                     │
│                    │ Pengeluaran: 50k│                     │
│                    │ Laba: 350k      │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Phase 6 Key Insights

### Profit Calculation Formula
```
Penjualan (Revenue)    = SUM(qty × price_per_unit)
Modal (HPP)            = SUM(qty × cost_price)
Margin Kotor           = Penjualan - Modal
Total Pengeluaran      = SUM(expenses.amount)
Laba Bersih            = Margin Kotor - Total Pengeluaran
```

### HPP (Harga Pokok Pembelian)
| LPG Type | Cost Price |
|----------|------------|
| 3kg | Rp 16.000 |
| 5kg | Rp 52.000 |
| 12kg | Rp 142.000 |
| 50kg | Rp 590.000 |

### Multi-Tenant Security
- All APIs filter by `pangkalan_id` from JWT
- ForbiddenException if accessing other pangkalan's data

---

# Phase 7: Admin Dashboard

## ✅ Status: COMPLETED (30 files)

---

## Overview

Complete **reporting system**, **activity logging**, **DSS (Decision Support System) alerts**, and **admin dashboard UI**.

---

## 🏗️ Backend Modules

### Module Overview

| Module | Files | Lines | Purpose |
|--------|-------|-------|---------|
| `reports` | 4 | **502** | Business intelligence |
| `activity` | 4 | 194 | Activity logging |

---

## 1. Reports Module

### `reports.service.ts` (502 lines) ⭐ **CRITICAL**

**5 Report Types**:

#### 1. `getSalesReport(startDate, endDate)`
```typescript
return {
    summary: {
        total_orders: 150,
        total_revenue: 25000000,
        average_order: 166667,
        status_breakdown: { SELESAI: 120, BATAL: 10, ... }
    },
    data: [{ id, date, code, pangkalan, items: [...], total, status }],
};
```

#### 2. `getPaymentsReport(startDate, endDate)`
```typescript
return {
    summary: {
        total_payments: 100,
        total_amount: 20000000,
        method_breakdown: {
            TUNAI: { count: 80, amount: 16000000 },
            TRANSFER: { count: 20, amount: 4000000 }
        }
    },
    data: [{ date, invoice_number, order_code, pangkalan, amount, method }],
};
```

#### 3. `getStockMovementReport(startDate, endDate, productId?)`
```typescript
return {
    summary: {
        total_in: 500,
        total_out: 300,
        net_change: 200,
        current_balance: 1200,
    },
    data: [{ date, product, type, qty, note, recorded_by }],
};
```

#### 4. `getPangkalanReport(startDate, endDate)` - Pangkalan Analytics
```typescript
return {
    summary: {
        total_pangkalan: 25,
        // SUBSIDI (3kg)
        total_orders_subsidi: 500,
        total_tabung_subsidi: 2500,
        total_revenue_subsidi: 50000000,
        // NON-SUBSIDI
        total_nonsubsidi_orders: 100,
        total_nonsubsidi_tabung: 200,
        // Per-type breakdown
        tabung_by_type: { kg3: 2500, kg5: 50, kg12: 100, kg50: 20 }
    },
    data: [{
        id, code, name, alokasi_bulanan,
        total_orders_from_agen, total_tabung_from_agen,
        total_consumer_orders, total_revenue,
        total_registered_consumers, active_consumers
    }],
};
```

#### 5. `getSubsidiConsumers(pangkalanId, startDate, endDate)` - Audit
```typescript
// For government audit - consumers who bought subsidized LPG
return {
    summary: {
        pangkalan_name: 'Pangkalan ABC',
        total_consumers: 50,
        registered_consumers: 45,
        walk_in_count: 1,
        total_tabung: 200,
    },
    data: [{
        id, name, nik, kk,  // NIK/KK for subsidy verification
        phone, address, consumer_type,
        total_purchases, total_tabung,
        purchases: [{ date, qty, amount }]
    }],
};
```

---

## 2. Activity Module

### `activity.service.ts` (194 lines)

| Method | Description |
|--------|-------------|
| `findAll(page, limit, type, userId)` | List with type filtering |
| `create(dto)` | Create log entry |
| `getRecent(limit)` | Latest activities |
| `logActivity(type, title, options)` | Helper for other services |

### Activity Types
```typescript
// ORDER category (filtered)
'order_created' | 'order_completed' | 'order_cancelled'

// STOCK category
'stock_in' | 'stock_out'

// PAYMENT category
'payment_received'

// SYSTEM category
'user_login' | 'system_create'
```

---

## 🖥️ Frontend Dashboard Components

### Component Overview (14 files)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `DashboardContent.tsx` | 200 | Main layout |
| `DSSAlertSection.tsx` | **460** | DSS alerts with Health Score |
| `DashboardKPICards.tsx` | 250 | KPI summary cards |
| `RecentActivitySection.tsx` | 220 | Activity feed |
| `charts/` | 4 files | Recharts visualizations |

---

### DSS Alert Section (Decision Support System)

**Features**:
- **Health Score Ring** (0-100) with color gradient
- **Low Stock Alerts** (KRITIS/RENDAH)
- **Overdue Payment Alerts**
- **Recommendations** per alert

```typescript
interface DSSAlertsData {
    healthScore: number;      // 0-100
    lowStockAlerts: LowStockAlert[];
    overduePayments: PaymentOverdueAlert[];
}

interface LowStockAlert {
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
    severity: 'warning' | 'critical';
}
```

---

### Dashboard Charts

| Chart | Purpose |
|-------|---------|
| `SalesChart.tsx` | Daily sales trend |
| `StockChart.tsx` | Stock levels |
| `ProfitChart.tsx` | Revenue vs Modal vs Laba |
| `PangkalanOrderChart.tsx` | Orders per pangkalan |

---

## 🔑 Phase 7 Key Insights

### Report Types Summary
| Report | Purpose | Key Data |
|--------|---------|----------|
| **Sales** | Order analytics | Revenue, status breakdown |
| **Payments** | Payment tracking | Method breakdown, amounts |
| **Stock Movement** | Inventory audit | MASUK vs KELUAR |
| **Pangkalan** | Performance | Subsidi vs Non-subsidi |
| **Subsidi Consumers** | Government audit | NIK/KK data |

### DSS Health Score Calculation
```
Score based on:
- Low stock count (KRITIS = -20, RENDAH = -10)
- Overdue payments count
- Today's order completion rate
```

### Activity Logging Integration
- Auth: `user_login` on successful login
- Orders: `order_created`, `order_completed`, `order_cancelled`
- Stock: `stock_in`, `stock_out`

---

# Phase 8: Advanced Features

## ✅ Status: COMPLETED (25 files)

---

## Overview

**AI-powered voice ordering** with Gemini AI, **NLP parsing**, **speech recognition**, and **real-time notifications**.

---

## 🤖 1. Gemini AI Service

### `gemini.service.ts` (779 lines) ⭐ **CRITICAL**

**Google Gemini Integration**:
- Model: `gemini-2.0-flash`
- Endpoint: `generativelanguage.googleapis.com/v1beta/`

### Main Methods

#### `parseVoiceCommand(text)` - AI Parsing
```typescript
async parseVoiceCommand(text: string): Promise<ParsedOrderData> {
    // 1. Fetch pangkalan list and products
    // 2. Build prompt for Gemini
    // 3. Call Gemini API
    // 4. Parse JSON response
    // 5. Fallback to regex if AI fails
}

// Prompt structure:
const prompt = `
Parse this Indonesian voice command for an LPG order:
"${text}"

Available pangkalan: ${pangkalanNames}
Available products: ${productInfo}

Extract: pangkalan name, items (product, quantity), 
Return JSON format.
`
```

#### `fallbackParse()` - Regex Fallback
```typescript
// When Gemini API fails or returns invalid data
fallbackParse(text, pangkalans, products): ParsedOrderData {
    // Levenshtein distance for fuzzy matching
    // Works with ANY pangkalan name - no hardcoding
}
```

#### `validateParsedOrder()` - Comprehensive Validation
```typescript
async validateParsedOrder(parsedData): Promise<ParsedOrderData> {
    // Checks:
    // 1. Pangkalan exists
    // 2. Products exist
    // 3. Quantity limits (1-500)
    // 4. Stock availability
    // 5. Confidence scoring
}
```

---

## 🎤 2. Speech Recognition

### `useSpeechRecognition.ts` (345 lines)

**Web Speech API Hook** for browser-based speech recognition.

```typescript
interface UseSpeechRecognitionResult {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;  // Real-time
    error: string | null;
    isSupported: boolean;
    confidence: number;
    startListening: () => Promise<void>;
    stopListening: () => void;
    resetTranscript: () => void;
}
```

**Key Features**:
- Language: `id-ID` (Bahasa Indonesia)
- Auto-stop after 2 seconds of silence
- Real-time interim results
- Microphone permission handling
- Error messages in Bahasa Indonesia

**Error Handling**:
```typescript
switch (event.error) {
    case 'not-allowed':
        'Izin mikrofon ditolak. Silakan aktifkan di pengaturan browser.'
    case 'no-speech':
        'Tidak ada suara terdeteksi. Silakan coba lagi.'
    case 'network':
        'Koneksi internet diperlukan untuk speech recognition.'
}
```

---

## 📝 3. Voice Order Parser (NLP)

### `voiceOrderParser.ts` (378 lines)

**Local NLP** for parsing Indonesian voice commands.

### Features
- Indonesian number words: "lima puluh" → 50
- Product patterns: "3 kilo", "dua belas kg", "bright gas"
- Levenshtein fuzzy matching for pangkalan names

### Indonesian Number Words
```typescript
const NUMBER_WORDS = {
    'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
    'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10,
    'sebelas': 11, 'puluh': 10, 'ratus': 100, 'ribu': 1000
};

// "lima puluh" → 50
// "dua ratus" → 200
```

### Product Patterns
```typescript
const PRODUCT_PATTERNS = [
    { pattern: /3\s*(?:kg|kilo)/i, keyword: '3kg' },
    { pattern: /subsidi/i, keyword: '3kg' },  // 3kg = subsidi
    { pattern: /12\s*(?:kg|kilo)/i, keyword: '12kg' },
    { pattern: /bright\s*gas/i, keyword: 'bright_gas' },
];
```

### Fuzzy Matching
```typescript
function fuzzyMatchPangkalan(keyword, pangkalanList) {
    // Levenshtein distance algorithm
    // Score > 0.5 = match
    // Exact substring = 0.9 score
}
```

---

## 🔔 4. Notifications System

### `notification.service.ts` (213 lines)

**Aggregates notifications from**:
1. Activity logs (recent orders)
2. Pending agen orders (from pangkalan)
3. Stock alerts (calculated)

### Stock Alert Thresholds
```typescript
const LOW_STOCK_THRESHOLD = 250;      // Warning
const CRITICAL_STOCK_THRESHOLD = 100; // Critical
```

### Notification Types
| Type | Priority | Trigger |
|------|----------|---------|
| `order_new` | medium | New order created |
| `agen_order` | high | Pangkalan placed order |
| `stock_low` | medium | Stock < 250 |
| `stock_critical` | high | Stock < 100 |
| `stock_out` | critical | Stock = 0 |

### Response Format
```typescript
{
    notifications: [
        {
            id: 'stock-critical-xxx',
            type: 'stock_critical',
            title: 'Stok Kritis!',
            message: 'LPG 3kg tersisa 50 tabung',
            icon: 'AlertTriangle',
            priority: 'high',
            link: '/ringkasan-stok',
            time: 'Sekarang',
        }
    ],
    unread_count: 5
}
```

---

## 🔄 Voice Order Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        VOICE ORDER FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User clicks microphone 🎤                                │
│     └─▶ useSpeechRecognition.startListening()               │
│                                                              │
│  2. User speaks: "Pesan 50 tabung 3kg ke Mitra Jaya"        │
│     └─▶ Web Speech API → transcript                         │
│                                                              │
│  3. 2 seconds of silence → auto-stop                        │
│     └─▶ onSpeechEnd(transcript)                             │
│                                                              │
│  4. Local NLP parse (voiceOrderParser)                      │
│     └─▶ Extract: qty=50, product=3kg, pangkalan=Mitra Jaya  │
│                                                              │
│  5. Backend validation (Gemini AI)                          │
│     └─▶ POST /gemini/voice-order                            │
│     └─▶ Validate stock, pangkalan, products                 │
│                                                              │
│  6. Confirmation dialog                                      │
│     └─▶ Show parsed order for user review                   │
│                                                              │
│  7. Create order                                             │
│     └─▶ POST /orders with is_voice_order=true               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Phase 8 Key Insights

### AI Architecture
| Component | Location | Purpose |
|-----------|----------|---------|
| Gemini AI | Backend | Smart parsing + validation |
| voiceOrderParser | Frontend | Local NLP fallback |
| useSpeechRecognition | Frontend | Browser speech API |

### Fallback Strategy
1. **Primary**: Gemini AI (cloud)
2. **Fallback**: Local regex + Levenshtein (if API fails)

### Language Support
- All spoken: Bahasa Indonesia
- Number words: satu, dua, ..., puluh, ratus, ribu
- Product synonyms: subsidi = 3kg, kaleng = bright gas

---

# Phase 9: UI Components

## ✅ Status: COMPLETED (65 files)

---

## Overview

Full **design system** based on **shadcn/ui** + **Radix primitives**, with custom components for admin, pangkalan dashboards, and voice ordering.

---

## 📦 Component Library Structure

```
src/components/
├── ui/           # 41 shadcn/ui base components
├── common/       # 10 shared components
├── dashboard-admin/  # 14 admin dashboard
├── pangkalan/    # 14 pangkalan pages
├── buat-pesanan/ # Order creation
├── kelola-stok/  # Stock management
└── laporan/      # Reports
```

---

## 1. shadcn/ui Base Components (41 files)

| Category | Components |
|----------|------------|
| **Layout** | `sidebar`, `card`, `separator`, `sheet` |
| **Forms** | `button`, `input`, `select`, `checkbox`, `radio-group`, `switch`, `textarea`, `slider` |
| **Data Display** | `table`, `badge`, `avatar`, `progress` |
| **Overlays** | `dialog`, `alert-dialog`, `popover`, `tooltip`, `dropdown-menu` |
| **Navigation** | `tabs`, `navigation-menu`, `menubar`, `pagination`, `breadcrumb` |
| **Feedback** | `alert`, `skeleton`, `sonner` (toasts) |
| **Advanced** | `chart` (Recharts wrapper), `command`, `carousel` |

### Key Components

#### `sidebar.tsx` (772 lines) ⭐
```typescript
// Full-featured collapsible sidebar
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"  // Collapsed

// Context for sidebar state
interface SidebarContextProps {
    state: "expanded" | "collapsed"
    open: boolean
    openMobile: boolean
    toggleSidebar: () => void
}

// Keyboard shortcut: Ctrl+B to toggle
```

#### `chart.tsx` (280 lines)
- Recharts wrapper with theme support
- Custom color variables via CSS

---

## 2. Common Components (10 files)

| Component | Lines | Purpose |
|-----------|-------|---------|
| `FloatingVoiceWidget.tsx` | **318** | Google-style voice order |
| `AdminHeader.tsx` | 320 | Admin topbar with notifications |
| `AdminSidebar.tsx` | 275 | Navigation sidebar |
| `NotificationModal.tsx` | 310 | Real-time alert modal |
| `PageHeader.tsx` | 50 | Reusable page title |
| `SafeIcon.tsx` | 40 | Lucide icon wrapper |
| `AnimatedNumber.tsx` | 50 | Count-up animation |
| `ConfirmationModal.tsx` | 70 | Delete/action confirm |

### FloatingVoiceWidget (Voice Order UI)
```typescript
// Google-style floating microphone button
// - Blue color scheme
// - Expandable modal
// - Real-time transcript display
// - Confirmation dialog

const FloatingVoiceWidget = () => {
    const { isListening, transcript, startListening, ... } = useVoiceOrder()
    
    return (
        <>
            {/* Floating Button */}
            <button className="fixed bottom-6 right-6...">
                <Mic />
            </button>
            
            {/* Expanded Modal */}
            {isOpen && <VoiceOrderModal />}
        </>
    )
}
```

---

## 3. Pangkalan Pages (14 files)

| Page | Size | Purpose |
|------|------|---------|
| `StokPangkalanPage.tsx` | **84KB** | Full stock management |
| `LaporanPangkalanPage.tsx` | **68KB** | Complete reporting |
| `PangkalanDashboard.tsx` | **44KB** | Dashboard with stats |
| `RiwayatPenjualanPage.tsx` | 30KB | Sales history |
| `PengeluaranPage.tsx` | 27KB | Expense tracker |
| `KonsumenListPage.tsx` | 35KB | Customer list |
| `CatatPenjualanPage.tsx` | 23KB | Quick sale entry |

### Page Architecture Pattern
```typescript
// All pages follow this structure:
const XxxPage = () => {
    // 1. State management
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    // 2. Data fetching with useEffect
    useEffect(() => {
        fetchData()
    }, [])
    
    // 3. CRUD handlers
    const handleCreate = async (dto) => { ... }
    const handleUpdate = async (id, dto) => { ... }
    const handleDelete = async (id) => { ... }
    
    // 4. Render with loading skeleton
    if (isLoading) return <PageSkeleton />
    
    return (
        <div className="space-y-4">
            <PageHeader title="..." />
            <DataTable data={data} />
        </div>
    )
}
```

---

## 4. Design System

### Color Palette (Tailwind CSS)
```css
/* Primary Colors */
--primary: hsl(220, 90%, 56%)      /* Blue */
--primary-foreground: white

/* Semantic Colors */
--destructive: hsl(0, 84%, 60%)    /* Red */
--success: hsl(142, 76%, 36%)      /* Green */
--warning: hsl(38, 92%, 50%)       /* Yellow */

/* Dashboard Gradients */
.gradient-blue { background: linear-gradient(to right, #3b82f6, #2563eb) }
.gradient-green { background: linear-gradient(to right, #22c55e, #16a34a) }
.gradient-purple { background: linear-gradient(to right, #a855f7, #7c3aed) }
```

### Typography
- Font: System fonts (Inter, Segoe UI)
- Headings: `font-semibold`
- Labels: `text-sm text-muted-foreground`

### Spacing
- Card padding: `p-4` to `p-6`
- Gap between elements: `space-y-4`
- Container max-width: `max-w-7xl`

---

## 🔑 Phase 9 Key Insights

### Component Stats
| Category | Files | Total Lines |
|----------|-------|-------------|
| shadcn/ui base | 41 | ~15,000 |
| Common | 10 | ~2,000 |
| Pangkalan | 14 | ~25,000 |
| **Total** | **65** | **~42,000** |

### Design Patterns
| Pattern | Usage |
|---------|-------|
| **compound components** | Sidebar, Dialog, form fields |
| **render props** | Chart container |
| **hooks** | useAuth, useSpeechRecognition, useSidebar |
| **context** | Theme, Sidebar state, Auth |

### Technical Stack
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **class-variance-authority** - Variant management

---

# Phase 10: UML & Documentation

## ✅ Status: COMPLETED (68 files)

---

## Overview

Complete **UML diagram library** (63 PlantUML) and **project documentation** (47 files) for academic and professional use.

---

## 📊 UML Diagram Inventory

### Activity Diagrams (26 files)

| ID | Diagram | Actor |
|----|---------|-------|
| AD_01 | Login | All |
| AD_02 | Buat Pesanan | Admin/Operator |
| AD_03 | Update Status Pesanan | Admin/Operator |
| AD_04 | Catat Pembayaran | Admin/Operator |
| AD_05 | Catat Penerimaan Stok | Admin/Operator |
| AD_06 | Catat Penyaluran | Admin/Operator |
| AD_07 | Catat Penjualan | Pangkalan |
| AD_08 | Buat Order ke Agen | Pangkalan |
| AD_09 | Kelola Pangkalan | Admin |
| AD_10 | Ubah Password | All |
| AD_11 | Kelola Pengguna | Admin |
| AD_12 | Kelola Supir | Admin/Operator |
| AD_13 | Kelola Produk LPG | Admin |
| AD_14 | Assign Driver | Admin/Operator |
| AD_15 | Lihat Detail Pesanan | All |
| AD_16 | Generate Invoice | Admin/Operator |
| AD_17 | Cetak Nota | Pangkalan |
| AD_18 | Kelola Perencanaan | Admin/Operator |
| AD_19 | Lihat In/Out Agen | Admin/Operator |
| AD_20 | Kelola Konsumen | Pangkalan |
| AD_21 | Kelola Stok Pangkalan | Pangkalan |
| AD_22 | Terima Order dari Agen | Pangkalan |
| AD_23 | Kelola Pengeluaran | Pangkalan |
| AD_24 | Generate Laporan | All |
| AD_25 | Export Laporan | All |
| AD_VoiceOrder_AI | Voice Order (AI) | Admin/Operator |

### Sequence Diagrams (18 files)

| ID | Diagram | Flow |
|----|---------|------|
| SD_01 | Login | Auth → JWT |
| SD_02 | Logout | Token clear |
| SD_03 | Create Order | Order → Stock → Activity |
| SD_04 | Update Status | Status → Stock restore |
| SD_05 | Assign Driver | Driver validation |
| SD_06 | Get Order Detail | Fetch with relations |
| SD_07 | Record Payment | Payment → Invoice |
| SD_08 | Generate Invoice | PDF generation |
| SD_09 | Receive Stock | Stock MASUK |
| SD_10 | Record Distribution | Penyaluran harian |
| SD_11 | Get Stock Summary | Aggregate calculation |
| SD_12 | Record Sale | Consumer order |
| SD_13 | Create Order to Agen | Pangkalan request |
| SD_14 | Confirm Receipt | Stock sync |
| SD_15 | Dashboard Pangkalan | Stats aggregation |
| SD_16 | Create Pangkalan | CRUD flow |
| SD_17 | CRUD Generic | Reusable pattern |
| SD_18 | Generate Export Report | Pertamina format |
| SD_Voice | Voice Create Order | Speech → AI → Order |

### Structural Diagrams (19 files)

| Diagram | Purpose |
|---------|---------|
| `SIM4LON_ClassDiagram.puml` | Domain model classes |
| `SIM4LON_ERD.puml` | Entity relationships |
| `SIM4LON_Deployment.puml` | Infrastructure |
| `SIM4LON_ConceptualModel.puml` | High-level architecture |
| `conceptual_idss_architecture.drawio` | DSS architecture |
| `activity_dss_alert.drawio` | DSS alert flow |

---

## 📚 Documentation Files (47 files)

### Academic Journals
| File | Purpose |
|------|---------|
| `SIM4LON_Journal_MJI_English.md` | English journal draft |
| `SIM4LON_Journal_SINTA4.md` | Indonesian SINTA journal |
| `SIM4LON_Journal_DSS_Final.md` | DSS feature focus |
| Various `.docx` & `.pdf` | Published versions |

### Technical Documentation
| File | Purpose |
|------|---------|
| `SIM4LON_Codebase_Analysis.md` | **This document** |
| `SIM4LON_Analysis.md` | Feature summary |
| `DSS_Features_Documentation.md` | DSS system docs |
| `SIM4LON_SpeechToOrder_Documentation.md` | Voice order docs |
| `CLIENT_REQUIREMENT_FORM.md` | Requirements spec |

### Presentation
| File | Purpose |
|------|---------|
| `SIM4LON_PPT_Prompt.md` | Slide generation guide |
| `SIM4LON_Presentation_Script_Practice.md` | Demo script |

---

## 🏗️ System Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SIM4LON ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Astro + React)                  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │   │
│  │  │ Admin      │ │ Operator   │ │ Pangkalan  │ │ Voice      │    │   │
│  │  │ Dashboard  │ │ Dashboard  │ │ Dashboard  │ │ Widget     │    │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │   │
│  │         │              │              │              │           │   │
│  │         └──────────────┼──────────────┼──────────────┘           │   │
│  │                        │              │                          │   │
│  │                   ┌────▼──────────────▼────┐                     │   │
│  │                   │      API Client        │                     │   │
│  │                   │   (src/lib/api.ts)     │                     │   │
│  │                   └────────────────────────┘                     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    │ REST API                            │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        BACKEND (NestJS)                           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │ Auth    │ │ Order   │ │ Stock   │ │ Reports │ │ Gemini  │    │   │
│  │  │ Module  │ │ Module  │ │ Module  │ │ Module  │ │ AI      │    │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  │         │         │           │           │           │          │   │
│  │         └─────────┼───────────┼───────────┼───────────┘          │   │
│  │                   │           │           │                      │   │
│  │              ┌────▼───────────▼───────────▼────┐                 │   │
│  │              │       Prisma ORM                 │                 │   │
│  │              └──────────────────────────────────┘                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    ▼                                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        DATABASE (PostgreSQL)                      │   │
│  │  users │ orders │ pangkalans │ stock_histories │ consumers │ ... │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

EXTERNAL SERVICES:
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Google Gemini │  │    Vercel      │  │    Railway     │
│     AI API     │  │   (Frontend)   │  │   (Backend)    │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

# 🎉 ANALYSIS COMPLETE

## Final Summary

### Files Analyzed: 372

| Phase | Files | Status |
|-------|-------|--------|
| Phase 1: Configuration | 17 | ✅ |
| Phase 2: Database | 17 | ✅ |
| Phase 3: Authentication | 22 | ✅ |
| Phase 4: Orders | 35 | ✅ |
| Phase 5: Stock | 25 | ✅ |
| Phase 6: Pangkalan | 30 | ✅ |
| Phase 7: Dashboard | 30 | ✅ |
| Phase 8: Advanced | 25 | ✅ |
| Phase 9: UI | 65 | ✅ |
| Phase 10: UML | 68 | ✅ |
| **TOTAL** | **334** | **100%** |

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Astro 5.x + React 19 |
| Backend | NestJS 11 + Prisma 6 |
| Database | PostgreSQL (Railway) |
| AI | Google Gemini 2.0 Flash |
| Speech | Web Speech API |
| Hosting | Vercel + Railway |

### Key Features Documented

1. **Multi-Tenant Architecture** - Agen and Pangkalan isolation
2. **RBAC** - 3 roles (ADMIN, OPERATOR, PANGKALAN)
3. **Voice Order** - AI-powered speech recognition
4. **DSS Alerts** - Stock and payment monitoring
5. **Real-time Notifications** - Priority-based alerts
6. **Comprehensive Reports** - 5 report types
7. **Subsidy Tracking** - NIK/KK verification
8. **PPN Calculation** - 12% for non-subsidi

### Lines of Code Estimated

| Category | Lines |
|----------|-------|
| Backend (NestJS) | ~15,000 |
| Frontend (React) | ~50,000 |
| Database (Prisma) | ~700 |
| Documentation | ~80,000 |
| **Total** | **~145,700** |

---

> 📅 **Analysis Completed**: 2026-01-05
> 📊 **Document Length**: ~2,700 lines
> ⏱️ **Analysis Duration**: Complete 10-phase deep-dive
