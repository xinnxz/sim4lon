-- ============================================
-- SEED DATA PANGKALAN & AGEN UNTUK 1 MINGGU
-- ============================================
-- Jalankan dengan: npx prisma db execute --file prisma/seed-weekly-data.sql --schema prisma/schema.prisma

-- 1. DATA AGEN (Distributor LPG)
-- ============================================
INSERT INTO agen (id, code, name, address, pic_name, phone, email, note, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'AGN-001', 'PT. Gas Utama Indonesia', 'Jl. Industri Blok A No. 15, Medan', 'H. Sulaiman', '081234500001', 'gasutama@mail.com', 'Distributor utama wilayah Sumut', true, NOW(), NOW()),
    (gen_random_uuid(), 'AGN-002', 'CV. Energi Mandiri', 'Jl. Pelabuhan No. 88, Belawan', 'Ir. Pratama', '081234500002', 'energimandiri@mail.com', 'Distributor area pelabuhan', true, NOW(), NOW()),
    (gen_random_uuid(), 'AGN-003', 'UD. Sumber Gas', 'Jl. Gatot Subroto No. 45, Medan Sunggal', 'Bpk. Hartono', '081234500003', 'sumbergas@mail.com', 'Supplier cadangan', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 2. DATA PANGKALAN DENGAN RELASI KE AGEN
-- ============================================
DO $$
DECLARE
    agn_id1 UUID;
    agn_id2 UUID;
    agn_id3 UUID;
BEGIN
    SELECT id INTO agn_id1 FROM agen WHERE code = 'AGN-001' LIMIT 1;
    SELECT id INTO agn_id2 FROM agen WHERE code = 'AGN-002' LIMIT 1;
    SELECT id INTO agn_id3 FROM agen WHERE code = 'AGN-003' LIMIT 1;

    -- Pangkalan dari Agen 1 (PT. Gas Utama Indonesia)
    INSERT INTO pangkalans (id, code, name, address, region, pic_name, phone, email, capacity, agen_id, note, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), 'PKL-001', 'Pangkalan Maju Jaya', 'Jl. Merdeka No. 123', 'Beringin, Kab. Deli Serdang', 'Budi Santoso', '081234567891', 'majujaya@mail.com', 500, agn_id1, 'Pangkalan utama area timur', true, NOW() - INTERVAL '7 days', NOW()),
        (gen_random_uuid(), 'PKL-002', 'Pangkalan Sejahtera', 'Jl. Pahlawan No. 45', 'Percut Sei Tuan, Kab. Deli Serdang', 'Siti Rahayu', '081234567892', 'sejahtera@mail.com', 300, agn_id1, 'Pangkalan cabang barat', true, NOW() - INTERVAL '6 days', NOW())
    ON CONFLICT (code) DO NOTHING;
    
    -- Pangkalan dari Agen 2 (CV. Energi Mandiri)
    INSERT INTO pangkalans (id, code, name, address, region, pic_name, phone, email, capacity, agen_id, note, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), 'PKL-003', 'Pangkalan Berkah', 'Jl. Sudirman No. 88', 'Tanjung Morawa, Kab. Deli Serdang', 'Ahmad Yani', '081234567893', 'berkah@mail.com', 400, agn_id2, 'Pangkalan area selatan', true, NOW() - INTERVAL '5 days', NOW()),
        (gen_random_uuid(), 'PKL-004', 'Pangkalan Sentosa', 'Jl. Diponegoro No. 56', 'Medan Johor', 'Dewi Lestari', '081234567894', 'sentosa@mail.com', 350, agn_id2, 'Pangkalan area pusat', true, NOW() - INTERVAL '4 days', NOW())
    ON CONFLICT (code) DO NOTHING;
    
    -- Pangkalan dari Agen 3 (UD. Sumber Gas)
    INSERT INTO pangkalans (id, code, name, address, region, pic_name, phone, email, capacity, agen_id, note, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), 'PKL-005', 'Pangkalan Mandiri', 'Jl. Ahmad Yani No. 100', 'Medan Sunggal', 'Eko Prasetyo', '081234567895', 'mandiri@mail.com', 250, agn_id3, 'Pangkalan baru', true, NOW() - INTERVAL '3 days', NOW())
    ON CONFLICT (code) DO NOTHING;
END $$;

-- 3. DATA DRIVER (jika belum ada)
-- ============================================
INSERT INTO drivers (id, code, name, phone, vehicle_id, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'DRV-001', 'Joko Widodo', '081345678901', 'BK 1234 AB', true, NOW(), NOW()),
    (gen_random_uuid(), 'DRV-002', 'Prabowo Subianto', '081345678902', 'BK 5678 CD', true, NOW(), NOW()),
    (gen_random_uuid(), 'DRV-003', 'Ganjar Pranowo', '081345678903', 'BK 9012 EF', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 4. DATA PESANAN (ORDERS) UNTUK 1 MINGGU
-- ============================================
DO $$
DECLARE
    pkl_id1 UUID; pkl_id2 UUID; pkl_id3 UUID; pkl_id4 UUID; pkl_id5 UUID;
    drv_id1 UUID; drv_id2 UUID; drv_id3 UUID;
    ord_id1 UUID; ord_id2 UUID; ord_id3 UUID; ord_id4 UUID; ord_id5 UUID;
    ord_id6 UUID; ord_id7 UUID; ord_id8 UUID; ord_id9 UUID; ord_id10 UUID;
BEGIN
    -- Get pangkalan IDs
    SELECT id INTO pkl_id1 FROM pangkalans WHERE code = 'PKL-001' LIMIT 1;
    SELECT id INTO pkl_id2 FROM pangkalans WHERE code = 'PKL-002' LIMIT 1;
    SELECT id INTO pkl_id3 FROM pangkalans WHERE code = 'PKL-003' LIMIT 1;
    SELECT id INTO pkl_id4 FROM pangkalans WHERE code = 'PKL-004' LIMIT 1;
    SELECT id INTO pkl_id5 FROM pangkalans WHERE code = 'PKL-005' LIMIT 1;
    
    -- Get driver IDs
    SELECT id INTO drv_id1 FROM drivers WHERE code = 'DRV-001' LIMIT 1;
    SELECT id INTO drv_id2 FROM drivers WHERE code = 'DRV-002' LIMIT 1;
    SELECT id INTO drv_id3 FROM drivers WHERE code = 'DRV-003' LIMIT 1;
    
    -- Generate order IDs
    ord_id1 := gen_random_uuid(); ord_id2 := gen_random_uuid();
    ord_id3 := gen_random_uuid(); ord_id4 := gen_random_uuid();
    ord_id5 := gen_random_uuid(); ord_id6 := gen_random_uuid();
    ord_id7 := gen_random_uuid(); ord_id8 := gen_random_uuid();
    ord_id9 := gen_random_uuid(); ord_id10 := gen_random_uuid();

    -- === HARI 1 (7 hari lalu) - Senin ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id1, 'ORD-W001', pkl_id1, drv_id1, CURRENT_DATE - 7, 'SELESAI', 1800000, 1800000, 'Pesanan rutin Senin pagi', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
        (ord_id2, 'ORD-W002', pkl_id2, drv_id2, CURRENT_DATE - 7, 'SELESAI', 900000, 900000, 'Restock stok habis', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 2 (6 hari lalu) - Selasa ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, tax_amount, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id3, 'ORD-W003', pkl_id3, drv_id3, CURRENT_DATE - 6, 'SELESAI', 2775000, 333000, 3108000, 'Pesanan besar', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 3 (5 hari lalu) - Rabu ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, tax_amount, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id4, 'ORD-W004', pkl_id1, drv_id1, CURRENT_DATE - 5, 'SELESAI', 1440000, 0, 1440000, 'Tambahan stok', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
        (ord_id5, 'ORD-W005', pkl_id4, drv_id2, CURRENT_DATE - 5, 'SELESAI', 1850000, 222000, 2072000, 'Pesanan pertama', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 4 (4 hari lalu) - Kamis ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id6, 'ORD-W006', pkl_id5, drv_id3, CURRENT_DATE - 4, 'SELESAI', 720000, 720000, 'Stok awal', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 5 (3 hari lalu) - Jumat ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id7, 'ORD-W007', pkl_id2, drv_id1, CURRENT_DATE - 3, 'DIKIRIM', 1350000, 1350000, 'Pengiriman Jumat', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
        (ord_id8, 'ORD-W008', pkl_id3, drv_id2, CURRENT_DATE - 3, 'SIAP_KIRIM', 2220000, 2486400, 'Siap Jemput', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 6 (2 hari lalu) - Sabtu ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id9, 'ORD-W009', pkl_id1, NULL, CURRENT_DATE - 2, 'DIPROSES', 2160000, 2160000, 'Menunggu driver', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day')
    ON CONFLICT (code) DO NOTHING;
    
    -- === HARI 7 (1 hari lalu / kemarin) - Minggu ===
    INSERT INTO orders (id, code, pangkalan_id, driver_id, order_date, current_status, subtotal, total_amount, note, created_at, updated_at)
    VALUES 
        (ord_id10, 'ORD-W010', pkl_id4, NULL, CURRENT_DATE - 1, 'DRAFT', 1080000, 1080000, 'Pesanan baru', NOW() - INTERVAL '1 day', NOW())
    ON CONFLICT (code) DO NOTHING;
    
    -- === ORDER ITEMS ===
    -- Refresh order IDs dari database
    SELECT id INTO ord_id1 FROM orders WHERE code = 'ORD-W001' LIMIT 1;
    SELECT id INTO ord_id2 FROM orders WHERE code = 'ORD-W002' LIMIT 1;
    SELECT id INTO ord_id3 FROM orders WHERE code = 'ORD-W003' LIMIT 1;
    SELECT id INTO ord_id4 FROM orders WHERE code = 'ORD-W004' LIMIT 1;
    SELECT id INTO ord_id5 FROM orders WHERE code = 'ORD-W005' LIMIT 1;
    SELECT id INTO ord_id6 FROM orders WHERE code = 'ORD-W006' LIMIT 1;
    SELECT id INTO ord_id7 FROM orders WHERE code = 'ORD-W007' LIMIT 1;
    SELECT id INTO ord_id8 FROM orders WHERE code = 'ORD-W008' LIMIT 1;
    SELECT id INTO ord_id9 FROM orders WHERE code = 'ORD-W009' LIMIT 1;
    SELECT id INTO ord_id10 FROM orders WHERE code = 'ORD-W010' LIMIT 1;

    -- ORD-W001: 100x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id1, '3kg', 'LPG 3 kg Subsidi', 18000, 100, 1800000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W002: 50x LPG 3kg  
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id2, '3kg', 'LPG 3 kg Subsidi', 18000, 50, 900000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W003: 15x LPG 12kg (dengan PPN)
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable, tax_amount) VALUES
        (gen_random_uuid(), ord_id3, '12kg', 'LPG 12 kg', 185000, 15, 2775000, true, 333000)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W004: 80x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id4, '3kg', 'LPG 3 kg Subsidi', 18000, 80, 1440000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W005: 10x LPG 12kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable, tax_amount) VALUES
        (gen_random_uuid(), ord_id5, '12kg', 'LPG 12 kg', 185000, 10, 1850000, true, 222000)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W006: 40x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id6, '3kg', 'LPG 3 kg Subsidi', 18000, 40, 720000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W007: 75x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id7, '3kg', 'LPG 3 kg Subsidi', 18000, 75, 1350000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W008: 12x LPG 12kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable, tax_amount) VALUES
        (gen_random_uuid(), ord_id8, '12kg', 'LPG 12 kg', 185000, 12, 2220000, true, 266400)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W009: 120x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id9, '3kg', 'LPG 3 kg Subsidi', 18000, 120, 2160000, false)
    ON CONFLICT DO NOTHING;
    
    -- ORD-W010: 60x LPG 3kg
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable) VALUES
        (gen_random_uuid(), ord_id10, '3kg', 'LPG 3 kg Subsidi', 18000, 60, 1080000, false)
    ON CONFLICT DO NOTHING;

    -- === PAYMENT DETAILS ===
    INSERT INTO order_payment_details (id, order_id, is_paid, is_dp, payment_method, amount_paid, payment_date) VALUES
        (gen_random_uuid(), ord_id1, true, false, 'TRANSFER', 1800000, NOW() - INTERVAL '6 days'),
        (gen_random_uuid(), ord_id2, true, false, 'TUNAI', 900000, NOW() - INTERVAL '6 days'),
        (gen_random_uuid(), ord_id3, true, false, 'TRANSFER', 3108000, NOW() - INTERVAL '5 days'),
        (gen_random_uuid(), ord_id4, true, false, 'TUNAI', 1440000, NOW() - INTERVAL '4 days'),
        (gen_random_uuid(), ord_id5, true, false, 'TRANSFER', 2072000, NOW() - INTERVAL '4 days'),
        (gen_random_uuid(), ord_id6, true, false, 'TUNAI', 720000, NOW() - INTERVAL '3 days'),
        (gen_random_uuid(), ord_id7, true, true, 'TRANSFER', 700000, NOW() - INTERVAL '2 days'),
        (gen_random_uuid(), ord_id8, true, true, 'TUNAI', 1000000, NOW() - INTERVAL '2 days'),
        (gen_random_uuid(), ord_id9, false, false, NULL, 0, NULL),
        (gen_random_uuid(), ord_id10, false, false, NULL, 0, NULL)
    ON CONFLICT (order_id) DO NOTHING;

    -- === TIMELINE TRACKS untuk status history ===
    INSERT INTO timeline_tracks (id, order_id, status, description, created_at) VALUES
        (gen_random_uuid(), ord_id1, 'DRAFT', 'Pesanan dibuat', NOW() - INTERVAL '7 days'),
        (gen_random_uuid(), ord_id1, 'DIPROSES', 'Pesanan diproses', NOW() - INTERVAL '7 days' + INTERVAL '1 hour'),
        (gen_random_uuid(), ord_id1, 'SIAP_KIRIM', 'Siap untuk dikirim', NOW() - INTERVAL '7 days' + INTERVAL '2 hours'),
        (gen_random_uuid(), ord_id1, 'DIKIRIM', 'Dalam perjalanan', NOW() - INTERVAL '7 days' + INTERVAL '3 hours'),
        (gen_random_uuid(), ord_id1, 'SELESAI', 'Pesanan selesai', NOW() - INTERVAL '6 days')
    ON CONFLICT DO NOTHING;
    
END $$;

-- 5. DATA STOK PANGKALAN
-- ============================================
DO $$
DECLARE
    pkl_id1 UUID; pkl_id2 UUID; pkl_id3 UUID; pkl_id4 UUID; pkl_id5 UUID;
BEGIN
    SELECT id INTO pkl_id1 FROM pangkalans WHERE code = 'PKL-001' LIMIT 1;
    SELECT id INTO pkl_id2 FROM pangkalans WHERE code = 'PKL-002' LIMIT 1;
    SELECT id INTO pkl_id3 FROM pangkalans WHERE code = 'PKL-003' LIMIT 1;
    SELECT id INTO pkl_id4 FROM pangkalans WHERE code = 'PKL-004' LIMIT 1;
    SELECT id INTO pkl_id5 FROM pangkalans WHERE code = 'PKL-005' LIMIT 1;

    -- Stok untuk setiap pangkalan
    INSERT INTO pangkalan_stocks (id, pangkalan_id, lpg_type, qty, warning_level, critical_level) VALUES
        -- PKL-001
        (gen_random_uuid(), pkl_id1, '3kg', 150, 30, 10),
        (gen_random_uuid(), pkl_id1, '12kg', 25, 10, 5),
        -- PKL-002
        (gen_random_uuid(), pkl_id2, '3kg', 80, 25, 10),
        (gen_random_uuid(), pkl_id2, '12kg', 15, 8, 3),
        -- PKL-003
        (gen_random_uuid(), pkl_id3, '3kg', 120, 30, 15),
        (gen_random_uuid(), pkl_id3, '12kg', 20, 10, 5),
        -- PKL-004
        (gen_random_uuid(), pkl_id4, '3kg', 90, 25, 10),
        (gen_random_uuid(), pkl_id4, '12kg', 18, 8, 4),
        -- PKL-005
        (gen_random_uuid(), pkl_id5, '3kg', 60, 20, 8)
    ON CONFLICT (pangkalan_id, lpg_type) DO UPDATE SET qty = EXCLUDED.qty;
END $$;

-- ============================================
-- SELESAI!
-- ============================================
-- Data yang ditambahkan:
-- - 3 Agen: AGN-001, AGN-002, AGN-003
-- - 5 Pangkalan: PKL-001 s/d PKL-005 (terhubung ke agen)
-- - 3 Driver: DRV-001 s/d DRV-003
-- - 10 Pesanan: ORD-W001 s/d ORD-W010 (7 hari terakhir)
-- - Stok pangkalan untuk setiap pangkalan
-- ============================================
