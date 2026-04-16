# DOKUMENTASI DEPLOYMENT DIAGRAM
## Sistem Informasi Manajemen LPG (SIM4LON)

---

## 1. GAMBARAN UMUM

Deployment Diagram menggambarkan **arsitektur infrastruktur** sistem SIM4LON, menunjukkan bagaimana komponen aplikasi di-deploy ke berbagai environment.

---

## 2. FULL STACK OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        SIM4LON FULL STACK                       │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND          │  BACKEND           │  DATABASE/STORAGE     │
│  ────────          │  ───────           │  ────────────────     │
│  React 18          │  NestJS 10         │  PostgreSQL 15        │
│  Vite 5            │  Prisma 5          │  Supabase Storage     │
│  TanStack Query v5 │  JWT + Passport    │                       │
│  React Router v6   │  Multer            │                       │
│  Tailwind CSS      │  class-validator   │                       │
│  Shadcn/UI         │                    │                       │
├─────────────────────────────────────────────────────────────────┤
│  Vercel            │  Railway           │  Railway + Supabase   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. KOMPONEN INFRASTRUKTUR

### 3.1 Client Layer (Browser)

| Aspek | Detail |
|-------|--------|
| **Type** | `<<device>>` |
| **Browsers** | Chrome, Firefox, Edge, Safari |
| **Mobile** | Chrome Mobile, Safari iOS |
| **Protocol** | HTTPS (TLS 1.3) |

---

### 3.2 Frontend - Vercel

| Aspek | Detail |
|-------|--------|
| **Type** | `<<platform>>` |
| **Provider** | Vercel |
| **URL** | `https://sim4lon.vercel.app` |
| **CDN** | 30+ edge locations worldwide |
| **SSL** | Auto-provisioned Let's Encrypt |
| **Deploy** | Git-triggered (GitHub) |

**Technology Stack:**

| Library | Version | Fungsi |
|---------|---------|--------|
| **React** | 18 | UI Library |
| **Vite** | 5 | Build Tool & Dev Server |
| **TanStack Query** | v5 | Data Fetching & Caching |
| **React Router** | v6 | Client-side Routing |
| **Tailwind CSS** | 3 | Utility-first CSS |
| **Shadcn/UI** | Latest | Pre-built Components |
| **Lucide Icons** | Latest | Icon Library |
| **Recharts** | Latest | Charts & Graphs |

---

### 3.3 Backend - Railway

| Aspek | Detail |
|-------|--------|
| **Type** | `<<platform>>` |
| **Provider** | Railway |
| **URL** | `https://sim4lon-api.up.railway.app` |
| **Container** | Docker-based |
| **Port** | 443 (HTTPS) → 3000 (internal) |
| **Scaling** | Vertical auto-scaling |

**Technology Stack:**

| Library | Version | Fungsi |
|---------|---------|--------|
| **NestJS** | 10 | Backend Framework |
| **Prisma** | 5 | ORM & Database Client |
| **Passport** | Latest | Authentication |
| **JWT** | Latest | Token-based Auth |
| **Multer** | Latest | File Upload Handler |
| **class-validator** | Latest | DTO Validation |
| **bcrypt** | Latest | Password Hashing |

**Service Modules:**

| Module | Deskripsi |
|--------|-----------|
| `AuthModule` | Login, JWT, Single Session |
| `OrderService` | CRUD Pesanan |
| `StockService` | Penerimaan & Penyaluran |
| `PaymentService` | Pembayaran & Records |
| `PangkalanService` | Master Pangkalan |
| `DashboardService` | Statistics & Reports |
| `ReportService` | Export Excel |

---

### 3.4 Database - Railway PostgreSQL

| Aspek | Detail |
|-------|--------|
| **Type** | `<<service>>` |
| **Provider** | Railway (integrated) |
| **Engine** | PostgreSQL 15 |
| **Port** | TCP 5432 |
| **Connection** | Prisma Client |
| **Backup** | Daily automated |

**Schema Statistics:**

| Metric | Value |
|--------|-------|
| Tables | 21 |
| Enum Types | 7 |
| Primary Keys | UUID (all tables) |
| Extensions | pgcrypto, uuid-ossp |
| Indexes | 40+ |

---

### 3.5 File Storage - Supabase

| Aspek | Detail |
|-------|--------|
| **Type** | `<<service>>` |
| **Provider** | Supabase |
| **API** | S3-compatible |
| **Security** | Row Level Security (RLS) |
| **CDN** | Global delivery |

**Storage Buckets:**

| Bucket | Konten |
|--------|--------|
| `/profile-pictures/` | Avatar user |
| `/payment-proofs/` | Bukti transfer |

---

## 4. PROTOKOL KOMUNIKASI

| From | To | Protocol | Port | Keterangan |
|------|----|----------|------|------------|
| Browser | Vercel | HTTPS | 443 | Static files + SPA |
| Vercel | Railway | HTTPS | 443 | REST API calls |
| Railway | PostgreSQL | TCP | 5432 | Prisma Client |
| Railway | Supabase | HTTPS | 443 | File operations |

---

## 5. ENVIRONMENT VARIABLES

### Frontend (Vercel)

```env
VITE_API_URL=https://sim4lon-api.up.railway.app
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Backend (Railway)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-super-secret-key

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://sim4lon.vercel.app

# Storage
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

---

## 6. DEPLOYMENT WORKFLOW

```
┌──────────┐    ┌────────┐    ┌─────────┐    ┌──────────┐
│Developer │───▶│ GitHub │───▶│ Vercel  │───▶│ Frontend │
│          │    │        │    │         │    │   Live   │
└──────────┘    │        │    └─────────┘    └──────────┘
                │        │
                │        │    ┌─────────┐    ┌──────────┐
                │        │───▶│ Railway │───▶│ Backend  │
                │        │    │         │    │   Live   │
                └────────┘    └────┬────┘    └──────────┘
                                   │
                                   ▼
                              ┌─────────┐
                              │Prisma   │
                              │Migrate  │
                              └─────────┘
```

### Deploy Steps:

1. **Developer** push code ke GitHub
2. **Vercel** auto-detect changes → Build frontend
3. **Railway** auto-detect changes → Build backend
4. **Prisma** runs migrations (if schema changed)
5. **Apps** go live automatically

---

## 7. SECURITY MEASURES

| Layer | Security |
|-------|----------|
| **Transport** | HTTPS/TLS 1.3 everywhere |
| **Authentication** | JWT + session_id (single session) |
| **Authorization** | Role-based (Admin, Operator, Pangkalan) |
| **Database** | Connection pooling, SSL required |
| **Storage** | RLS policies, signed URLs |
| **Secrets** | Environment variables only |
| **Password** | bcrypt hashing (10 rounds) |

---

## 8. MONITORING & OBSERVABILITY

| Aspect | Tool |
|--------|------|
| Frontend Analytics | Vercel Analytics |
| Backend Logs | Railway Logs |
| Database Metrics | Railway PostgreSQL Metrics |
| Uptime | Railway Health Checks |

---

*Dokumen ini menjelaskan infrastruktur deployment SIM4LON*  
*Cloud-native Full Stack: React + NestJS + PostgreSQL + Supabase*
