-- Seed stock_histories KELUAR untuk 1 minggu terakhir
-- Agar chart pemakaian mingguan di dashboard berubah
-- Total per hari: 600-800 unit
-- Jalankan: npx prisma db execute --file prisma/seed-stock-usage.sql --schema prisma/schema.prisma

-- Hapus data stock_histories KELUAR lama untuk minggu ini (opsional - hati2!)
DELETE FROM stock_histories 
WHERE movement_type = 'KELUAR' 
AND timestamp >= CURRENT_DATE - INTERVAL '7 days';

-- Insert stock_histories KELUAR untuk 7 hari terakhir
DO $$
DECLARE
    v_product_id UUID;
    v_product_name VARCHAR;
    v_products RECORD;
    v_date DATE;
    v_date_timestamp TIMESTAMPTZ;
    v_daily_total INT;
    v_remaining INT;
    v_qty INT;
    v_product_count INT;
    v_i INT;
BEGIN
    -- Get count of active products
    SELECT COUNT(*) INTO v_product_count FROM lpg_products WHERE is_active = true;
    
    IF v_product_count = 0 THEN
        RAISE NOTICE 'No active products found!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % active products', v_product_count;
    
    -- Loop through last 7 days
    FOR day_offset IN 0..6 LOOP
        v_date := CURRENT_DATE - day_offset;
        v_date_timestamp := v_date::TIMESTAMPTZ + INTERVAL '10 hours'; -- 10am WIB
        
        -- Random total for the day between 600-800
        v_daily_total := 600 + floor(random() * 201)::INT;
        v_remaining := v_daily_total;
        
        RAISE NOTICE 'Date: %, Target total: %', v_date, v_daily_total;
        
        v_i := 0;
        -- Distribute to products
        FOR v_products IN 
            SELECT id, name FROM lpg_products WHERE is_active = true ORDER BY name
        LOOP
            v_i := v_i + 1;
            
            -- Last product gets remaining, others get random portion
            IF v_i = v_product_count THEN
                v_qty := v_remaining;
            ELSE
                -- Each product gets portion: roughly v_daily_total / v_product_count with variation
                v_qty := LEAST(
                    v_remaining, 
                    (v_daily_total / v_product_count) + floor((random() - 0.5) * 100)::INT
                );
                v_qty := GREATEST(v_qty, 50); -- minimum 50 per product
                v_remaining := v_remaining - v_qty;
            END IF;
            
            -- Only insert if qty > 0
            IF v_qty > 0 THEN
                INSERT INTO stock_histories (
                    id,
                    lpg_product_id,
                    lpg_type,
                    movement_type,
                    qty,
                    note,
                    timestamp,
                    created_at
                ) VALUES (
                    gen_random_uuid(),
                    v_products.id,
                    '3kg', -- Default lpg_type
                    'KELUAR',
                    v_qty,
                    'Pemakaian harian - ' || v_products.name,
                    v_date_timestamp,
                    NOW()
                );
                
                RAISE NOTICE '  Product %: % units', v_products.name, v_qty;
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Seeding completed!';
END $$;

-- Verify the data
SELECT 
    DATE(timestamp) as tanggal,
    lp.name as product_name,
    SUM(sh.qty) as total_keluar
FROM stock_histories sh
LEFT JOIN lpg_products lp ON sh.lpg_product_id = lp.id
WHERE sh.movement_type = 'KELUAR'
AND sh.timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp), lp.name
ORDER BY tanggal DESC, product_name;
