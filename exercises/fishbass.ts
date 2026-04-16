/**
 * ============================================
 * 🐟 FishBass Test - Variasi dari FizzBuzz 🐟
 * ============================================
 * 
 * Aturan:
 * 1. Tampilkan angka dari 1 sampai 100
 * 2. Jika angka habis dibagi 3 → tampilkan "Fish"
 * 3. Jika angka habis dibagi 5 → tampilkan "Bass"
 * 4. Jika angka habis dibagi 3 DAN 5 → tampilkan "FishBass"
 * 5. Selain itu → tampilkan angka aslinya
 * 
 * Konsep yang dipelajari:
 * - Operator modulo (%) untuk mengecek sisa bagi
 * - Kondisional (if-else)
 * - Perulangan (for loop)
 */

function fishBass(): void {
    console.log("🐟🐟🐟 FISHBASS TEST 🐟🐟🐟\n");
    console.log("=".repeat(40));

    // Loop dari 1 sampai 100
    for (let i = 1; i <= 100; i++) {
        let output: string;

        // PENTING: Cek kondisi "habis dibagi 3 DAN 5" DULU!
        // Karena jika kita cek dibagi 3 atau 5 terlebih dahulu,
        // angka seperti 15 (habis dibagi keduanya) tidak akan pernah masuk ke kondisi FishBass

        if (i % 3 === 0 && i % 5 === 0) {
            // Angka habis dibagi 3 DAN 5 (contoh: 15, 30, 45, 60, 75, 90)
            output = "FishBass";
        } else if (i % 3 === 0) {
            // Angka habis dibagi 3 saja (contoh: 3, 6, 9, 12...)
            output = "Fish";
        } else if (i % 5 === 0) {
            // Angka habis dibagi 5 saja (contoh: 5, 10, 20, 25...)
            output = "Bass";
        } else {
            // Tidak habis dibagi 3 maupun 5
            output = i.toString();
        }

        // Tampilkan hasil dengan format yang rapi
        console.log(`${i.toString().padStart(3, ' ')} → ${output}`);
    }

    console.log("\n" + "=".repeat(40));
    console.log("✅ Test selesai!");
}

// Jalankan fungsi
fishBass();

/**
 * ============================================
 * 📖 PENJELASAN DETAIL:
 * ============================================
 * 
 * 1. OPERATOR MODULO (%)
 *    - `i % 3` menghitung sisa bagi dari i dibagi 3
 *    - Jika `i % 3 === 0`, artinya i habis dibagi 3 (sisa = 0)
 *    - Contoh: 9 % 3 = 0 (habis dibagi), 10 % 3 = 1 (tidak habis dibagi)
 * 
 * 2. URUTAN KONDISI
 *    - Kita HARUS cek kondisi "dibagi 3 DAN 5" TERLEBIH DAHULU
 *    - Kenapa? Karena angka seperti 15 juga habis dibagi 3
 *    - Jika kita cek "dibagi 3" dulu, 15 akan dicetak "Fish", bukan "FishBass"
 * 
 * 3. OPERATOR LOGIKA (&&)
 *    - `&&` adalah operator AND (DAN)
 *    - `i % 3 === 0 && i % 5 === 0` artinya:
 *      "i habis dibagi 3" DAN "i habis dibagi 5"
 *    - Kedua kondisi harus TRUE agar hasilnya TRUE
 * 
 * 4. padStart()
 *    - `i.toString().padStart(3, ' ')` membuat angka rata kanan
 *    - Contoh: 1 menjadi "  1", 10 menjadi " 10", 100 tetap "100"
 */
