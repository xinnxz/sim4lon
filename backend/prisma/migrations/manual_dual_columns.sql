-- Just ensure new columns exist with defaults
ALTER TABLE perencanaan_harian ADD COLUMN IF NOT EXISTS jumlah_normal INTEGER DEFAULT 0;
ALTER TABLE perencanaan_harian ADD COLUMN IF NOT EXISTS jumlah_fakultatif INTEGER DEFAULT 0;
ALTER TABLE penyaluran_harian ADD COLUMN IF NOT EXISTS jumlah_normal INTEGER DEFAULT 0;
ALTER TABLE penyaluran_harian ADD COLUMN IF NOT EXISTS jumlah_fakultatif INTEGER DEFAULT 0;
