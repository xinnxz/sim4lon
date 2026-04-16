# 📦 SIM4LON (Sistem Informasi Manajemen Pangkalan)

![SIM4LON Banner](https://via.placeholder.com/1200x300.png?text=SIM4LON+-+Manajemen+Pangkalan+Modern)

**SIM4LON** adalah platform *Sistem Informasi Manajemen Pangkalan* berbasis web yang modern dan cepat, dirancang khusus untuk mempermudah operasional agen dan pangkalan (seperti pangkalan LPG atau distribusi barang lainnya). Proyek ini dibangun dengan fokus pada arsitektur yang bersih, performa tinggi, serta antarmuka (UI/UX) yang interaktif.

## ✨ Fitur Utama

- 🔐 **Keamanan & Autentikasi (Tenant Guard):** Akses multi-tenant yang aman dan terstruktur untuk setiap pangkalan.
- 📊 **Dashboard & Analitik Interaktif:** Manajemen data yang mudah dengan visualisasi lengkap.
- 💳 **Manajemen Berlangganan (Subscription):** Sistem paket berlangganan fleksibel bagi pemilik pangkalan.
- 🚀 **Onboarding & Panduan:** Alur panduan langkah demi langkah (Onboarding Guide) untuk pengguna baru.

## 💻 Tech Stack (Teknologi yang Digunakan)

Aplikasi ini dikembangkan dengan *stack* modern:
- **Framework Utama:** [Astro](https://astro.build/) & [React 18](https://react.dev/)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Database & ORM:** [Prisma](https://www.prisma.io/)
- **Bahasa Pemrograman:** TypeScript & Node.js
- **Animasi & Interaksi:** Framer Motion, Tailwind Animate

## 🚀 Cara Menjalankan Secara Lokal (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan SIM4LON di komputermu:

### 1. Prasyarat
Pastikan kamu telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru disarankan)
- [Git](https://git-scm.com/)

### 2. Instalasi

Clone repositori ini:
```bash
git clone https://github.com/xinnxz/sim4lon.git
cd sim4lon
```

Instal semua dependensi:
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Environment)
Salin file `.env.example` menjadi `.env` dan sesuaikan kredensialnya (seperti URL database):
```bash
cp .env.example .env
```

### 4. Mulai Server Pengembangan (Development)
Jalankan perintah berikut:
```bash
npm run dev
```
Aplikasi bisa diakses melalui browser di `http://localhost:4321` (port bawaan Astro).

## 📄 Lisensi

Proyek ini didistribusikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut. 

## 🤝 Kontribusi (Contributing)

Ingin membantu mengembangkan proyek ini? Silakan baca panduan kontribusi di file [CONTRIBUTING.md](CONTRIBUTING.md).

---
*Dibuat dengan ❤️ oleh [Luthfi](https://github.com/xinnxz).*
