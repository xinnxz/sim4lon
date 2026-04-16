-- Script to reset and seed consumer_orders for pangkalan@test.com
-- Keep consumers intact, only delete and regenerate transactions

-- Step 1: Find the pangkalan_id for pangkalan@test.com
-- First, find the user with email pangkalan@test.com, then get their pangkalan_id
DO $$
DECLARE
    v_pangkalan_id UUID;
    v_consumer_id UUID;
    v_consumer_ids UUID[];
    v_lpg_types text[] := ARRAY['kg3', 'kg5', 'kg12'];
    v_lpg_type text;
    v_qty INT;
    v_price_per_unit DECIMAL(15,2);
    v_cost_price DECIMAL(15,2);
    v_total_amount DECIMAL(15,2);
    v_sale_date TIMESTAMP;
    v_order_counter INT := 1;
    v_day INT;
    v_transactions_per_day INT;
    v_i INT;
BEGIN
    -- Get pangkalan_id from user with email pangkalan@test.com
    SELECT pangkalan_id INTO v_pangkalan_id 
    FROM users 
    WHERE email = 'pangkalan@test.com' 
    LIMIT 1;
    
    IF v_pangkalan_id IS NULL THEN
        RAISE EXCEPTION 'Pangkalan not found for email pangkalan@test.com';
    END IF;
    
    RAISE NOTICE 'Found pangkalan_id: %', v_pangkalan_id;
    
    -- Step 2: Delete all existing consumer_orders for this pangkalan
    DELETE FROM consumer_orders WHERE pangkalan_id = v_pangkalan_id;
    RAISE NOTICE 'Deleted existing consumer_orders for pangkalan';
    
    -- Step 3: Get existing consumer IDs for this pangkalan
    SELECT ARRAY_AGG(id) INTO v_consumer_ids
    FROM consumers
    WHERE pangkalan_id = v_pangkalan_id AND is_active = true;
    
    IF v_consumer_ids IS NULL OR array_length(v_consumer_ids, 1) IS NULL THEN
        -- Create some default consumers if none exist
        INSERT INTO consumers (pangkalan_id, name, consumer_type) VALUES 
            (v_pangkalan_id, 'Warung Madura', 'WARUNG'),
            (v_pangkalan_id, 'Ibu Siti', 'RUMAH_TANGGA'),
            (v_pangkalan_id, 'Pak Ahmad', 'RUMAH_TANGGA'),
            (v_pangkalan_id, 'Warung Padang', 'WARUNG'),
            (v_pangkalan_id, 'Bu Ani', 'RUMAH_TANGGA');
            
        SELECT ARRAY_AGG(id) INTO v_consumer_ids
        FROM consumers
        WHERE pangkalan_id = v_pangkalan_id AND is_active = true;
        
        RAISE NOTICE 'Created default consumers';
    END IF;
    
    RAISE NOTICE 'Found % consumers', array_length(v_consumer_ids, 1);
    
    -- Step 4: Generate random transactions from Dec 1-22, 2025
    FOR v_day IN 1..22 LOOP
        -- Random 3-10 transactions per day
        v_transactions_per_day := 3 + floor(random() * 8);
        
        FOR v_i IN 1..v_transactions_per_day LOOP
            -- Random lpg type (mostly 3kg)
            IF random() < 0.7 THEN
                v_lpg_type := 'kg3';
                v_price_per_unit := 18000 + floor(random() * 3000); -- 18000-21000
                v_cost_price := 16000;
            ELSIF random() < 0.5 THEN
                v_lpg_type := 'kg5';
                v_price_per_unit := 65000 + floor(random() * 5000); -- 65000-70000
                v_cost_price := 52000;
            ELSE
                v_lpg_type := 'kg12';
                v_price_per_unit := 165000 + floor(random() * 10000); -- 165000-175000
                v_cost_price := 142000;
            END IF;
            
            -- Random qty (1-5)
            v_qty := 1 + floor(random() * 5);
            v_total_amount := v_qty * v_price_per_unit;
            
            -- Random consumer
            v_consumer_id := v_consumer_ids[1 + floor(random() * array_length(v_consumer_ids, 1))];
            
            -- Sale date (random hour on that day)
            v_sale_date := ('2025-12-' || LPAD(v_day::text, 2, '0') || ' ' || 
                           (8 + floor(random() * 10))::text || ':' || 
                           floor(random() * 60)::text || ':00')::timestamp;
            
            -- Insert the order
            INSERT INTO consumer_orders (
                code, pangkalan_id, consumer_id, lpg_type, qty, 
                price_per_unit, cost_price, total_amount, payment_status, 
                sale_date, created_at, updated_at
            ) VALUES (
                'PORD-' || LPAD(v_order_counter::text, 4, '0'),
                v_pangkalan_id,
                v_consumer_id,
                v_lpg_type::lpg_type,
                v_qty,
                v_price_per_unit,
                v_cost_price,
                v_total_amount,
                'LUNAS',
                v_sale_date,
                v_sale_date,
                v_sale_date
            );
            
            v_order_counter := v_order_counter + 1;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Generated % transactions from Dec 1-22, 2025', v_order_counter - 1;
END $$;

-- Verify the result
SELECT 
    DATE(sale_date) as tanggal,
    COUNT(*) as total_transaksi,
    SUM(qty) as total_qty,
    SUM(total_amount) as total_penjualan
FROM consumer_orders co
JOIN users u ON u.pangkalan_id = co.pangkalan_id
WHERE u.email = 'pangkalan@test.com'
GROUP BY DATE(sale_date)
ORDER BY tanggal;
