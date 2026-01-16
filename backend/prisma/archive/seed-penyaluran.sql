-- Seed penyaluran harian untuk 1 minggu terakhir
-- Total per hari: 600-800 unit (dibagi ke beberapa pangkalan)
-- Jalankan: npx prisma db execute --file prisma/seed-penyaluran.sql --schema prisma/schema.prisma

-- Hapus data penyaluran lama untuk minggu ini (opsional)
DELETE FROM penyaluran_harian 
WHERE tanggal >= CURRENT_DATE - INTERVAL '7 days';

-- Insert penyaluran untuk 7 hari terakhir
-- Menggunakan pangkalan yang ada di database
DO $$
DECLARE
    v_pangkalan_ids UUID[];
    v_pangkalan_id UUID;
    v_date DATE;
    v_daily_total INT;
    v_remaining INT;
    v_qty INT;
    v_i INT;
BEGIN
    -- Get all active pangkalan IDs
    SELECT ARRAY_AGG(id) INTO v_pangkalan_ids 
    FROM pangkalans 
    WHERE is_active = true AND deleted_at IS NULL;
    
    -- If no pangkalans, exit
    IF v_pangkalan_ids IS NULL OR array_length(v_pangkalan_ids, 1) IS NULL THEN
        RAISE NOTICE 'No active pangkalans found!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % active pangkalans', array_length(v_pangkalan_ids, 1);
    
    -- Loop through last 7 days
    FOR day_offset IN 0..6 LOOP
        v_date := CURRENT_DATE - day_offset;
        
        -- Random total for the day between 600-800
        v_daily_total := 600 + floor(random() * 201)::INT; -- 600 to 800
        v_remaining := v_daily_total;
        
        RAISE NOTICE 'Date: %, Target total: %', v_date, v_daily_total;
        
        -- Distribute to pangkalans
        FOR v_i IN 1..array_length(v_pangkalan_ids, 1) LOOP
            v_pangkalan_id := v_pangkalan_ids[v_i];
            
            -- Last pangkalan gets remaining, others get random portion
            IF v_i = array_length(v_pangkalan_ids, 1) THEN
                v_qty := v_remaining;
            ELSE
                -- Each pangkalan gets 50-150 units (random)
                v_qty := LEAST(v_remaining, 50 + floor(random() * 101)::INT);
                v_remaining := v_remaining - v_qty;
            END IF;
            
            -- Only insert if qty > 0
            IF v_qty > 0 THEN
                INSERT INTO penyaluran_harian (
                    id, 
                    pangkalan_id, 
                    tanggal, 
                    jumlah, 
                    tipe_pembayaran, 
                    created_at, 
                    updated_at
                ) VALUES (
                    gen_random_uuid(),
                    v_pangkalan_id,
                    v_date,
                    v_qty,
                    CASE WHEN random() > 0.3 THEN 'CASHLESS' ELSE 'CASH' END,
                    NOW(),
                    NOW()
                )
                ON CONFLICT (pangkalan_id, tanggal) 
                DO UPDATE SET 
                    jumlah = EXCLUDED.jumlah,
                    updated_at = NOW();
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Seeding completed!';
END $$;

-- Verify the data
SELECT 
    tanggal,
    COUNT(*) as pangkalan_count,
    SUM(jumlah) as total_penyaluran
FROM penyaluran_harian
WHERE tanggal >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY tanggal
ORDER BY tanggal DESC;
