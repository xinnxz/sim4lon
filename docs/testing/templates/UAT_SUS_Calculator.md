# PANDUAN PERHITUNGAN SUS SCORE (System Usability Scale)

## A. Rumus Perhitungan

### 1. Untuk Pertanyaan GANJIL (1, 3, 5, 7, 9) - Pertanyaan Positif
```
Skor = Nilai Jawaban - 1
```

### 2. Untuk Pertanyaan GENAP (2, 4, 6, 8, 10) - Pertanyaan Negatif
```
Skor = 5 - Nilai Jawaban
```

### 3. Raw Score
```
Raw Score = Jumlah semua skor (dari 10 pertanyaan)
```

### 4. SUS Score
```
SUS Score = Raw Score × 2.5
```

---

## B. Template Perhitungan

### Contoh Perhitungan untuk 1 Responden:

| Q | Jawaban | Rumus | Skor |
|:-:|:-------:|-------|:----:|
| Q1 | 4 | 4 - 1 | 3 |
| Q2 | 2 | 5 - 2 | 3 |
| Q3 | 5 | 5 - 1 | 4 |
| Q4 | 2 | 5 - 2 | 3 |
| Q5 | 4 | 4 - 1 | 3 |
| Q6 | 1 | 5 - 1 | 4 |
| Q7 | 5 | 5 - 1 | 4 |
| Q8 | 1 | 5 - 1 | 4 |
| Q9 | 4 | 4 - 1 | 3 |
| Q10 | 2 | 5 - 2 | 3 |
| **Raw Score** | | | **34** |
| **SUS Score** | | 34 × 2.5 | **85** |

---

## C. Tabel Rekapitulasi Semua Responden

| Responden | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Raw Score | SUS Score |
|:---------:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:---:|:---------:|:---------:|
| R1 | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| R2 | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| R3 | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| R4 | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| R5 | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| **Rata-rata** | | | | | | | | | | | | **___** |

---

## D. Interpretasi SUS Score

| Range Skor | Grade | Keterangan | Adjective |
|:----------:|:-----:|------------|-----------|
| > 80.3 | A | Excellent | Best Imaginable |
| 68 - 80.3 | B | Good | Excellent / Good |
| 68 | C | Okay | Good |
| 51 - 68 | D | Poor | OK / Poor |
| < 51 | F | Awful | Worst Imaginable |

### Visualisasi Grade:

```
0        51       68      80.3     100
|----F----|----D----|---C---|--B--|--A--|
  Awful     Poor     Okay   Good  Excellent
```

---

## E. Contoh Kesimpulan

> Berdasarkan hasil pengujian UAT menggunakan metode System Usability Scale (SUS) 
> terhadap 5 responden, diperoleh rata-rata SUS Score sebesar **XX.X** yang berada 
> pada Grade **X (Keterangan)**. Hal ini menunjukkan bahwa sistem SIM4LON memiliki 
> tingkat usability yang **[sangat baik/baik/cukup/kurang]** dan **[layak/perlu perbaikan]** 
> untuk diimplementasikan.

---

## F. Tips Pengisian

1. **Minimal 5 responden** untuk hasil yang valid
2. Responden sebaiknya mewakili **semua role** (Admin, Operator, Pangkalan)
3. Responden harus **sudah mencoba** sistem sebelum mengisi kuesioner
4. Berikan waktu **15-30 menit** untuk eksplorasi sistem
5. Isi kuesioner **segera setelah** mencoba sistem

---

*Dokumen ini digunakan sebagai panduan perhitungan untuk Laporan Kerja Praktek.*
