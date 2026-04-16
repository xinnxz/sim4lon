# Panduan Berkontribusi (Contributing Guide)

Terima kasih telah tertarik untuk berkontribusi pada proyek **SIM4LON**! Kontribusi dalam bentuk apa pun (melaporkan bug, memperbaiki dokumentasi, menyumbangkan kode) sangat kami hargai.

Berikut adalah langkah-langkah untuk berkontribusi:

## 1. Laporkan Bug atau Ajukan Fitur Baru
Jika Anda menemukan *bug* atau memiliki ide brilian, silakan buka fitur **Issues** di repositori GitHub ini dan jelaskan secara detail masalah atau ide yang Anda maksud.

## 2. Cara Menyumbangkan Kode (Pull Request)
Jika Anda ingin memperbaiki bug atau menambahkan fitur sendiri:

1. **Fork** repositori ini ke akun Anda sendiri.
2. **Clone** hasil *fork* tersebut ke komputer Anda:
   ```bash
   git clone https://github.com/USERNAME-KAMU/sim4lon.git
   ```
3. Buat **branch baru** khusus untuk fitur atau *bugfix* yang sedang Anda buat:
   ```bash
   git checkout -b fitur/nama-fitur-keren
   ```
   *Gunakan format yang jelas, misalnya: `fitur/login-page` atau `bugfix/typo-readme`.*
4. Lakukan perubahan pada kode yang diperlukan.
5. **Commit** perubahan Anda dengan pesan yang jelas dan deskriptif (`git commit -m "Menambahkan halaman login..."`).
6. **Push** branch Anda ke GitHub (`git push origin fitur/nama-fitur-keren`).
7. Buka halaman repositori asli dan ajukan **Pull Request (PR)**.
8. Berikan penjelasan pada PR Anda tentang fungsi apa yang diubah/ditambahkan.

## 3. Gaya Penulisan Kode (Code Style)
Mohon pastikan:
- Logika kode mudah dibaca.
- Usahakan untuk mengikuti standar `TypeScript` dan `ESLint`/`Prettier` (jika digunakan).
- Nama variabel menggunakan bahasa Inggris (`camelCase`) agar seragam.

Sekali lagi, terima kasih! 🚀
