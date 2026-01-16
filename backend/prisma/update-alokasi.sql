-- ============================================================
-- UPDATE ALOKASI PANGKALAN (2500-3000 per bulan)
-- ============================================================
-- Jalankan: npx prisma db execute --file prisma/update-alokasi.sql
-- ============================================================

-- Update alokasi bulanan untuk semua pangkalan aktif
-- Menggunakan random antara 2500-3000

UPDATE pangkalans 
SET 
    alokasi_bulanan = FLOOR(RANDOM() * (3000 - 2500 + 1) + 2500)::INTEGER,
    updated_at = NOW()
WHERE is_active = true;

