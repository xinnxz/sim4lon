---
description: Panduan lengkap deploy SIM4LON ke Vercel + Railway
---

# 🚀 PANDUAN DEPLOYMENT SIM4LON

## Arsitektur Deployment
```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│     VERCEL       │────▶│     RAILWAY      │────▶│   PostgreSQL     │
│   (Frontend)     │     │    (Backend)     │     │   (Database)     │
│   Astro Static   │     │     NestJS       │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## PART 1: Deploy Backend ke Railway (DULU)

### Step 1.1: Buat Akun Railway
1. Buka https://railway.app
2. Klik "Login" → pilih "Login with GitHub"
3. Authorize Railway untuk akses GitHub Anda

### Step 1.2: Buat Project Baru
1. Klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository: `xinnxz/sim4lon`
4. ⚠️ **PENTING**: Set **Root Directory** ke `backend`

### Step 1.3: Tambahkan PostgreSQL Database
1. Di dashboard project, klik **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Tunggu hingga database ter-provision (~30 detik)
3. Klik database PostgreSQL → tab "Variables"
4. Copy value dari `DATABASE_URL`

### Step 1.4: Set Environment Variables Backend
Klik service backend → tab **"Variables"** → tambahkan:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=3000
NODE_ENV=production
```

> 💡 Tips: Gunakan `${{Postgres.DATABASE_URL}}` untuk auto-link ke database Railway

### Step 1.5: Set Build & Start Commands
Klik service backend → tab **"Settings"**:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npm run start:prod` |

### Step 1.6: Deploy & Seed Database
Setelah deploy berhasil, buka tab **"Shell"** dan jalankan:
```bash
npx prisma db push
npx prisma db seed
```

### Step 1.7: Catat URL Backend
Setelah deploy selesai, Railway akan memberikan URL seperti:
```
https://sim4lon-backend-production.up.railway.app
```
**Simpan URL ini untuk digunakan di frontend!**

---

## PART 2: Deploy Frontend ke Vercel

### Step 2.1: Buat Akun Vercel
1. Buka https://vercel.com
2. Klik "Sign Up" → pilih "Continue with GitHub"
3. Authorize Vercel

### Step 2.2: Import Project
1. Klik **"Add New..."** → **"Project"**
2. Pilih repository: `xinnxz/sim4lon`
3. Set konfigurasi:

| Setting | Value |
|---------|-------|
| Framework Preset | Astro |
| Root Directory | `.` (root) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Step 2.3: Set Environment Variables
Di halaman konfigurasi, tambahkan:

```env
PUBLIC_API_URL=https://sim4lon-backend-production.up.railway.app/api
```

> ⚠️ Ganti URL dengan URL backend Railway Anda dari Step 1.7

### Step 2.4: Deploy
Klik **"Deploy"** dan tunggu proses selesai (~2-3 menit)

### Step 2.5: Catat URL Frontend
Vercel akan memberikan URL seperti:
```
https://sim4lon.vercel.app
```

---

## PART 3: Konfigurasi CORS di Backend

Setelah deploy, update backend untuk mengizinkan frontend Vercel:

1. Di Railway, buka service backend → **Variables**
2. Tambahkan variable:
```env
CORS_ORIGIN=https://sim4lon.vercel.app
```

3. Backend akan auto-redeploy

---

## PART 4: Setup Custom Domain (Opsional)

### Vercel (Frontend)
1. Buka project → **Settings** → **Domains**
2. Tambahkan domain: `sim4lon.yourdomain.com`
3. Ikuti instruksi DNS settings

### Railway (Backend)
1. Buka service → **Settings** → **Domains**
2. Tambahkan: `api.sim4lon.yourdomain.com`

---

## 🔧 TROUBLESHOOTING

### Error: Database connection failed
- Pastikan `DATABASE_URL` sudah di-link dengan benar
- Coba restart service di Railway

### Error: Build failed on Railway
- Cek apakah `Root Directory` sudah diset ke `backend`
- Pastikan semua dependencies di `package.json` benar

### Error: CORS blocked
- Tambahkan `CORS_ORIGIN` di backend dengan URL frontend

### Error: Prisma client not generated
- Pastikan build command include: `npx prisma generate`

---

## 📋 CHECKLIST DEPLOYMENT

- [ ] Backend deployed ke Railway
- [ ] PostgreSQL database created
- [ ] Database seeded dengan data awal
- [ ] Environment variables configured
- [ ] Frontend deployed ke Vercel
- [ ] PUBLIC_API_URL pointing to Railway backend
- [ ] CORS configured
- [ ] Test login & basic features

---

## 🔄 UPDATE DEPLOYMENT

Setelah push ke GitHub, deployment akan **auto-update**:
- Railway: Auto-deploy dalam ~2-3 menit
- Vercel: Auto-deploy dalam ~1-2 menit
