-- Migration Script: Fix LPG Type Mapping & Resync Penyaluran
-- PENJELASAN: Script SQL untuk fix lpg_type berdasarkan label

-- Step 1: Fix order_items lpg_type based on label matching
-- Update Bright Gas Can (220gr) items yang salah masuk ke kg50
UPDATE order_items 
SET lpg_type = 'gr220'::lpg_type
WHERE LOWER(label) LIKE '%bright gas%' OR LOWER(label) LIKE '%220%';

-- Update LPG 5.5kg items yang salah masuk ke kg12
UPDATE order_items 
SET lpg_type = 'kg5'::lpg_type
WHERE LOWER(label) LIKE '%5.5%' OR LOWER(label) LIKE '%5,5%';

-- Update LPG 12kg items (pastikan benar)
UPDATE order_items 
SET lpg_type = 'kg12'::lpg_type
WHERE (LOWER(label) LIKE '%12 kg%' OR LOWER(label) LIKE '%12kg%') 
  AND LOWER(label) NOT LIKE '%5.5%';

-- Update LPG 3kg items (pastikan benar)
UPDATE order_items 
SET lpg_type = 'kg3'::lpg_type
WHERE (LOWER(label) LIKE '%3 kg%' OR LOWER(label) LIKE '%lpg 3%');

-- Update LPG 50kg items (pastikan benar)
UPDATE order_items 
SET lpg_type = 'kg50'::lpg_type
WHERE (LOWER(label) LIKE '%50 kg%' OR LOWER(label) LIKE '%50kg%');

-- Step 2: Clear penyaluran_harian table
DELETE FROM penyaluran_harian;

-- Step 3: Re-generate penyaluran_harian from completed orders
INSERT INTO penyaluran_harian (id, pangkalan_id, tanggal, lpg_type, jumlah, kondisi, tipe_pembayaran, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    o.pangkalan_id,
    DATE(COALESCE(o.order_date, o.created_at)),
    oi.lpg_type,
    SUM(oi.qty),
    'NORMAL',
    'CASHLESS',
    NOW(),
    NOW()
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.current_status = 'SELESAI'
GROUP BY o.pangkalan_id, DATE(COALESCE(o.order_date, o.created_at)), oi.lpg_type
ON CONFLICT (pangkalan_id, tanggal, lpg_type) 
DO UPDATE SET jumlah = penyaluran_harian.jumlah + EXCLUDED.jumlah;

-- Step 4: Verify results
SELECT lpg_type, COUNT(*) as record_count, SUM(jumlah) as total_units
FROM penyaluran_harian
GROUP BY lpg_type
ORDER BY lpg_type;
