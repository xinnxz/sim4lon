/**
 * ============================================
 * 🔺 LATIHAN #1: POLA SEGITIGA BINTANG 🔺
 * ============================================
 * 
 * Tujuan: Membuat berbagai pola segitiga menggunakan karakter *
 * 
 * Konsep yang dipelajari:
 * 1. Nested Loop (Loop bersarang) - loop di dalam loop
 * 2. Hubungan antara baris dan jumlah karakter
 * 3. Manipulasi string dengan repeat()
 * 
 * Mengapa nested loop penting?
 * - Banyak digunakan untuk mengolah data 2 dimensi (tabel, matrix)
 * - Membuat pola-pola visual
 * - Algoritma pencarian dan pengurutan
 */

// =============================================
// POLA 1: SEGITIGA KANAN BAWAH
// =============================================
// Output yang diharapkan:
// *
// **
// ***
// ****
// *****

function segitigaKananBawah(tinggi: number): void {
    console.log("🔺 POLA 1: Segitiga Kanan Bawah");
    console.log("=".repeat(30));

    /**
     * LOGIKA:
     * - Baris ke-1: tampilkan 1 bintang
     * - Baris ke-2: tampilkan 2 bintang
     * - Baris ke-3: tampilkan 3 bintang
     * - dst...
     * 
     * Jadi: Baris ke-i menampilkan i buah bintang
     */

    // Loop LUAR: mengontrol BARIS (vertikal ↓)
    for (let baris = 1; baris <= tinggi; baris++) {
        let output = "";

        // Loop DALAM: mengontrol KOLOM / jumlah bintang (horizontal →)
        for (let kolom = 1; kolom <= baris; kolom++) {
            output += "*";
        }

        console.log(output);
    }
    console.log("\n");
}

// =============================================
// POLA 2: SEGITIGA KANAN ATAS (TERBALIK)
// =============================================
// Output yang diharapkan:
// *****
// ****
// ***
// **
// *

function segitigaKananAtas(tinggi: number): void {
    console.log("🔻 POLA 2: Segitiga Kanan Atas (Terbalik)");
    console.log("=".repeat(30));

    /**
     * LOGIKA:
     * - Baris ke-1: tampilkan 5 bintang (tinggi - 0)
     * - Baris ke-2: tampilkan 4 bintang (tinggi - 1)
     * - Baris ke-3: tampilkan 3 bintang (tinggi - 2)
     * - dst...
     * 
     * Rumus: Baris ke-i menampilkan (tinggi - i + 1) buah bintang
     */

    for (let baris = 1; baris <= tinggi; baris++) {
        let output = "";

        // Jumlah bintang berkurang setiap baris
        const jumlahBintang = tinggi - baris + 1;

        for (let kolom = 1; kolom <= jumlahBintang; kolom++) {
            output += "*";
        }

        console.log(output);
    }
    console.log("\n");
}

// =============================================
// POLA 3: SEGITIGA SAMA KAKI (PIRAMIDA)
// =============================================
// Output yang diharapkan:
//     *
//    ***
//   *****
//  *******
// *********

function segitigaSamaKaki(tinggi: number): void {
    console.log("⛰️ POLA 3: Segitiga Sama Kaki (Piramida)");
    console.log("=".repeat(30));

    /**
     * LOGIKA (lebih kompleks!):
     * Setiap baris terdiri dari: SPASI + BINTANG
     * 
     * Baris 1: 4 spasi + 1 bintang   (spasi = tinggi - baris)
     * Baris 2: 3 spasi + 3 bintang   (bintang = 2*baris - 1)
     * Baris 3: 2 spasi + 5 bintang
     * Baris 4: 1 spasi + 7 bintang
     * Baris 5: 0 spasi + 9 bintang
     * 
     * Rumus:
     * - Jumlah spasi = tinggi - baris
     * - Jumlah bintang = 2 * baris - 1
     */

    for (let baris = 1; baris <= tinggi; baris++) {
        // Hitung jumlah spasi dan bintang
        const jumlahSpasi = tinggi - baris;
        const jumlahBintang = 2 * baris - 1;

        // Buat string spasi dan bintang
        const spasi = " ".repeat(jumlahSpasi);
        const bintang = "*".repeat(jumlahBintang);

        console.log(spasi + bintang);
    }
    console.log("\n");
}

// =============================================
// POLA 4: PIRAMIDA TERBALIK
// =============================================
// Output yang diharapkan:
// *********
//  *******
//   *****
//    ***
//     *

function piramidaTerbalik(tinggi: number): void {
    console.log("🔽 POLA 4: Piramida Terbalik");
    console.log("=".repeat(30));

    /**
     * LOGIKA (kebalikan dari Pola 3):
     * 
     * Baris 1: 0 spasi + 9 bintang
     * Baris 2: 1 spasi + 7 bintang
     * Baris 3: 2 spasi + 5 bintang
     * dst...
     * 
     * Rumus:
     * - Jumlah spasi = baris - 1
     * - Jumlah bintang = 2 * (tinggi - baris + 1) - 1
     */

    for (let baris = 1; baris <= tinggi; baris++) {
        const jumlahSpasi = baris - 1;
        const jumlahBintang = 2 * (tinggi - baris + 1) - 1;

        const spasi = " ".repeat(jumlahSpasi);
        const bintang = "*".repeat(jumlahBintang);

        console.log(spasi + bintang);
    }
    console.log("\n");
}

// =============================================
// POLA 5: DIAMOND (BERLIAN) ⭐ BONUS!
// =============================================
// Output yang diharapkan:
//     *
//    ***
//   *****
//  *******
// *********
//  *******
//   *****
//    ***
//     *

function diamond(tinggi: number): void {
    console.log("💎 POLA 5: Diamond (Berlian)");
    console.log("=".repeat(30));

    /**
     * LOGIKA:
     * Diamond = Piramida + Piramida Terbalik
     * Tapi piramida terbalik dimulai dari baris ke-2 agar tidak double
     */

    // Bagian atas (Piramida)
    for (let baris = 1; baris <= tinggi; baris++) {
        const spasi = " ".repeat(tinggi - baris);
        const bintang = "*".repeat(2 * baris - 1);
        console.log(spasi + bintang);
    }

    // Bagian bawah (Piramida Terbalik, mulai dari baris ke-2)
    for (let baris = 2; baris <= tinggi; baris++) {
        const spasi = " ".repeat(baris - 1);
        const bintang = "*".repeat(2 * (tinggi - baris + 1) - 1);
        console.log(spasi + bintang);
    }
    console.log("\n");
}

// =============================================
// 🚀 JALANKAN SEMUA POLA
// =============================================

console.log("\n🌟🌟🌟 LATIHAN POLA SEGITIGA BINTANG 🌟🌟🌟\n");
console.log("Tinggi yang digunakan: 5\n");

const tinggi = 5;

segitigaKananBawah(tinggi);
segitigaKananAtas(tinggi);
segitigaSamaKaki(tinggi);
piramidaTerbalik(tinggi);
diamond(tinggi);

console.log("✅ Semua pola selesai ditampilkan!");

/**
 * ============================================
 * 📚 RINGKASAN KONSEP PENTING:
 * ============================================
 * 
 * 1. NESTED LOOP (Loop Bersarang)
 *    for (baris) {           ← Loop LUAR: mengontrol BARIS
 *        for (kolom) {       ← Loop DALAM: mengontrol KOLOM
 *            // aksi
 *        }
 *    }
 * 
 * 2. REPEAT() - Mengulang string
 *    "*".repeat(5)  →  "*****"
 *    " ".repeat(3)  →  "   " (3 spasi)
 * 
 * 3. POLA MATEMATIKA
 *    - Segitiga: jumlah karakter = nomor baris
 *    - Piramida: bintang = 2*baris - 1, spasi = tinggi - baris
 * 
 * 4. TIPS MEMAHAMI POLA
 *    - Gambar dulu di kertas
 *    - Hitung jumlah karakter per baris
 *    - Cari rumus/polanya
 *    - Baru coding!
 * 
 * ============================================
 * 🎯 TANTANGAN UNTUK ANDA:
 * ============================================
 * 
 * Coba buat pola-pola ini sendiri:
 * 
 * 1. Segitiga angka:
 *    1
 *    12
 *    123
 *    1234
 * 
 * 2. Segitiga huruf:
 *    A
 *    AB
 *    ABC
 *    ABCD
 * 
 * 3. Hollow triangle (segitiga kosong tengahnya):
 *        *
 *       * *
 *      *   *
 *     *     *
 *    *********
 */
