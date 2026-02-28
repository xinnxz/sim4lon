---
description: Panduan lengkap deploy SIM4LON ke Vercel + Railway
---

# 🚀 PANDUAN DEPLOYMENT SIM4LON

## Arsitektur Deployment
```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     VERCEL       │────▶│     RAILWAY      │────▶│   Supabase       │
│   (Frontend)     │     │    (Backend)     │     │   (Database)     │
│   Astro Static   │     │     NestJS       │     │   PostgreSQL     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

> ⚠️ Database sudah ada di **Supabase** → TIDAK perlu buat database di Railway.
> Railway hanya untuk menjalankan **backend NestJS** saja.

---

## PART 1: Deploy Backend ke Railway

### Step 1.1: Buat Akun & Project Railway
1. Buka https://railway.app
2. Klik "Login" → pilih "Login with GitHub"
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repository: `xinnxz/sim4lon`

### Step 1.2: Set Root Directory
1. Klik service yang baru dibuat → tab **"Settings"**
2. Scroll ke bagian **"Source"**
3. Set **Root Directory** → `backend`

> ⚠️ INI WAJIB! Tanpa ini Railway akan coba build seluruh repo (termasuk frontend) dan gagal.

### Step 1.3: Set Environment Variables
Klik tab **"Variables"** → tambahkan satu per satu:

```env
DATABASE_URL=postgresql://postgres.xhjchmxthmqahgacymnb:M4t4h4r1123Kom@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://xhjchmxthmqahgacymnb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoamNobXh0aG1xYWhnYWN5bW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTgyNDgzNywiZXhwIjoyMDgxNDAwODM3fQ.szRJT_dcIp7AKiFn9Ucjfr1gxVFXoo2Qb4a9h-REtcA
GEMINI_API_KEY=AIzaSyAGKGkdq2CAaeCdVf5rlqwPdzCsBvj1NE0
JWT_SECRET=sim4lon-jwt-secret-key-2024
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://sim4lon.vercel.app
```

> 💡 Penjelasan:
> - `DATABASE_URL` → koneksi ke Supabase PostgreSQL
> - `JWT_SECRET` → HARUS SAMA dengan yang di frontend
> - `CORS_ORIGIN` → izinkan frontend Vercel akses API
> - `PORT` → port NestJS (Railway butuh ini)

### Step 1.4: Pastikan Build & Start Command
Di tab **"Settings"**, cek build/deploy commands:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npm run start:prod` |

> Biasanya Railway auto-detect dari `backend/railway.json`.

### Step 1.5: Deploy & Generate Domain
1. Deploy akan berjalan otomatis setelah settings disimpan
2. Tunggu build selesai (~2-5 menit)
3. Cek di **Logs** → pastikan muncul:
   ```
   🚀 SIM4LON Backend is running on: http://localhost:3000/api
   ```
4. Pergi ke **Settings** → **Networking/Domains** → klik **"Generate Domain"**
5. Catat URL yang diberikan, contoh:
   ```
   sim4lon-production-8ed4.up.railway.app
   ```

### Step 1.6: Verifikasi Backend
Buka di browser atau curl:
```
https://[URL-RAILWAY]/api/health
```
Harus mengembalikan:
```json
{"status":"ok","timestamp":"...","service":"sim4lon-backend"}
```

---

## PART 2: Deploy Frontend ke Vercel

### Step 2.1: Buat Akun & Import Project
1. Buka https://vercel.com → Login dengan GitHub
2. Klik **"Add New..."** → **"Project"**
3. Pilih repository: `xinnxz/sim4lon`
4. Set konfigurasi:

| Setting | Value |
|---------|-------|
| Framework Preset | Astro |
| Root Directory | `.` (root) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 2.2: Set Environment Variables
Tambahkan di halaman konfigurasi Vercel:

```env
PUBLIC_API_URL=https://[URL-RAILWAY]/api
```

> ⚠️ **FORMAT PENTING**: URL HARUS diakhiri dengan `/api`!
> Contoh: `https://sim4lon-production-8ed4.up.railway.app/api`

### Step 2.3: Deploy
Klik **"Deploy"** dan tunggu selesai (~2-3 menit).

---

## PART 3: Test Login

Buka https://sim4lon.vercel.app/login dan coba:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@agen.com` | `Admin123@` |
| Operator | `operator@demo.com` | `Operator123` |
| Pangkalan | `tes2@demo.com` | `Pangkalan123` |

---

## 🔄 GANTI AKUN RAILWAY (Jika Trial Habis)

Kalau Railway trial habis dan mau buat akun baru, cukup **3 langkah**:

### 1. Deploy Backend di Railway Baru
- Ikuti **PART 1** di atas (Step 1.1 - 1.6)
- Catat URL Railway yang baru

### 2. Update PUBLIC_API_URL di Vercel
1. Buka https://vercel.com → project sim4lon → **Settings** → **Environment Variables**
2. Edit `PUBLIC_API_URL` → ganti ke URL Railway baru + `/api`
   ```
   https://[URL-RAILWAY-BARU]/api
   ```
3. Klik **Save**

### 3. Redeploy Frontend
1. Di Vercel, buka tab **"Deployments"**
2. Klik titik tiga (**⋮**) di deployment terakhir → **"Redeploy"**
3. Tunggu ~1-2 menit → test login

> 💡 Database tetap aman di Supabase. Yang berubah HANYA URL backend.

---

## 🔧 TROUBLESHOOTING

| Masalah | Solusi |
|---------|--------|
| "Failed to fetch" saat login | `PUBLIC_API_URL` belum diset/salah di Vercel, atau Railway mati |
| Build gagal di Railway | Pastikan Root Directory = `backend` |
| CORS error di console browser | Tambahkan `CORS_ORIGIN=https://sim4lon.vercel.app` di Railway |
| Railway URL 404 | Pastikan sudah klik "Generate Domain" di Settings |
| Login password salah | Database Supabase mungkin perlu di-seed ulang |
| Perubahan env var tidak berlaku | HARUS **Redeploy** di Vercel setelah ubah env var |

---

## 📋 CHECKLIST DEPLOYMENT

- [ ] Backend deployed ke Railway
- [ ] Root Directory diset ke `backend`
- [ ] Environment variables lengkap (8 variable)
- [ ] Domain di-generate di Railway
- [ ] Health check OK (`/api/health`)
- [ ] Frontend deployed ke Vercel
- [ ] `PUBLIC_API_URL` pointing ke Railway URL + `/api`
- [ ] Frontend sudah di-redeploy setelah update env var
- [ ] Test login berhasil

---

## 🔄 AUTO-UPDATE

Setelah push ke GitHub, deployment akan auto-update:
- Railway: Auto-deploy dalam ~2-3 menit
- Vercel: Auto-deploy dalam ~1-2 menit
