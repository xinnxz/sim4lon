-- ============================================
-- SEED DATA LENGKAP UNTUK DEMO AGEN SIM4LON
-- ============================================
-- Jalankan dengan: npx prisma db execute --file prisma/seed-demo.sql --schema prisma/schema.prisma

-- 1. PRODUK LPG (4 jenis ukuran)
-- ============================================
INSERT INTO lpg_products (id, name, size_kg, category, color, description, selling_price, cost_price, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'LPG 3 kg Subsidi', 3, 'SUBSIDI', 'hijau', 'Tabung LPG 3 kg bersubsidi pemerintah', 18000, 15000, true, NOW(), NOW()),
    (gen_random_uuid(), 'LPG 5.5 kg', 5.5, 'NON_SUBSIDI', 'biru', 'Tabung LPG 5.5 kg bright gas', 75000, 65000, true, NOW(), NOW()),
    (gen_random_uuid(), 'LPG 12 kg', 12, 'NON_SUBSIDI', 'kuning', 'Tabung LPG 12 kg untuk rumah tangga', 185000, 165000, true, NOW(), NOW()),
    (gen_random_uuid(), 'LPG 50 kg', 50, 'NON_SUBSIDI', 'merah', 'Tabung LPG 50 kg untuk industri/usaha', 750000, 680000, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 2. PANGKALAN (3 pangkalan demo)
-- ============================================
INSERT INTO pangkalans (id, code, name, address, region, pic_name, phone, email, capacity, note, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'PKL-001', 'Pangkalan Maju Jaya', 'Jl. Merdeka No. 123, Kelurahan Sukamaju', 'Beringin, Kab. Deli Serdang', 'Budi Santoso', '081234567891', 'majujaya@mail.com', 500, 'Pangkalan utama area timur', true, NOW(), NOW()),
    (gen_random_uuid(), 'PKL-002', 'Pangkalan Sejahtera', 'Jl. Pahlawan No. 45, Kelurahan Bahagia', 'Percut Sei Tuan, Kab. Deli Serdang', 'Siti Rahayu', '081234567892', 'sejahtera@mail.com', 300, 'Pangkalan cabang barat', true, NOW(), NOW()),
    (gen_random_uuid(), 'PKL-003', 'Pangkalan Berkah', 'Jl. Sudirman No. 88, Kelurahan Makmur', 'Tanjung Morawa, Kab. Deli Serdang', 'Ahmad Yani', '081234567893', 'berkah@mail.com', 400, 'Pangkalan area selatan', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 3. USER PANGKALAN (akun login untuk setiap pangkalan)
-- Password: pangkalan123 (hashed)
-- ============================================
DO $$
DECLARE
    pkl_id1 UUID;
    pkl_id2 UUID;
    pkl_id3 UUID;
BEGIN
    SELECT id INTO pkl_id1 FROM pangkalans WHERE code = 'PKL-001' LIMIT 1;
    SELECT id INTO pkl_id2 FROM pangkalans WHERE code = 'PKL-002' LIMIT 1;
    SELECT id INTO pkl_id3 FROM pangkalans WHERE code = 'PKL-003' LIMIT 1;

    -- Insert users for each pangkalan
    INSERT INTO users (id, code, email, password, name, phone, role, pangkalan_id, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), 'USR-PKL01', 'majujaya@pangkalan.com', '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2', 'Budi Santoso', '081234567891', 'PANGKALAN', pkl_id1, true, NOW(), NOW()),
        (gen_random_uuid(), 'USR-PKL02', 'sejahtera@pangkalan.com', '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2', 'Siti Rahayu', '081234567892', 'PANGKALAN', pkl_id2, true, NOW(), NOW()),
        (gen_random_uuid(), 'USR-PKL03', 'berkah@pangkalan.com', '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2', 'Ahmad Yani', '081234567893', 'PANGKALAN', pkl_id3, true, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;
END $$;

-- 4. DRIVER (3 supir)
-- ============================================
INSERT INTO drivers (id, code, name, phone, vehicle_id, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'DRV-001', 'Joko Widodo', '081345678901', 'BK 1234 AB', true, NOW(), NOW()),
    (gen_random_uuid(), 'DRV-002', 'Prabowo Subianto', '081345678902', 'BK 5678 CD', true, NOW(), NOW()),
    (gen_random_uuid(), 'DRV-003', 'Ganjar Pranowo', '081345678903', 'BK 9012 EF', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- 5. PESANAN (orders) - Sample orders untuk pangkalan
-- ============================================
DO $$
DECLARE
    pkl_id1 UUID;
    pkl_id2 UUID;
    pkl_id3 UUID;
    drv_id1 UUID;
    drv_id2 UUID;
    order_id1 UUID;
    order_id2 UUID;
    order_id3 UUID;
BEGIN
    -- Get IDs
    SELECT id INTO pkl_id1 FROM pangkalans WHERE code = 'PKL-001' LIMIT 1;
    SELECT id INTO pkl_id2 FROM pangkalans WHERE code = 'PKL-002' LIMIT 1;
    SELECT id INTO pkl_id3 FROM pangkalans WHERE code = 'PKL-003' LIMIT 1;
    SELECT id INTO drv_id1 FROM drivers WHERE code = 'DRV-001' LIMIT 1;
    SELECT id INTO drv_id2 FROM drivers WHERE code = 'DRV-002' LIMIT 1;
    
    -- Generate order IDs
    order_id1 := gen_random_uuid();
    order_id2 := gen_random_uuid();
    order_id3 := gen_random_uuid();

    -- Create orders
    INSERT INTO orders (id, code, pangkalan_id, driver_id, current_status, note, total_amount, created_at, updated_at)
    VALUES 
        (order_id1, 'ORD-001', pkl_id1, drv_id1, 'SELESAI', 'Pesanan rutin mingguan', 1800000, NOW() - INTERVAL '2 days', NOW()),
        (order_id2, 'ORD-002', pkl_id2, drv_id2, 'DRAFT', 'Butuh segera', 900000, NOW() - INTERVAL '1 day', NOW()),
        (order_id3, 'ORD-003', pkl_id3, NULL, 'DRAFT', 'Pesanan tambahan', 1850000, NOW(), NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Create order items (lpg_type enum dengan nilai mapped: 3kg, 5.5kg, 12kg, 50kg)
    INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, is_taxable, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), order_id1, '3kg', 'LPG 3 kg Subsidi', 18000, 100, 1800000, false, NOW(), NOW()),
        (gen_random_uuid(), order_id2, '3kg', 'LPG 3 kg Subsidi', 18000, 50, 900000, false, NOW(), NOW()),
        (gen_random_uuid(), order_id3, '12kg', 'LPG 12 kg', 185000, 10, 1850000, true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- Create order payment details
    INSERT INTO order_payment_details (id, order_id, is_paid, is_dp, payment_method, amount_paid, payment_date, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), order_id1, true, false, 'TRANSFER', 1800000, NOW() - INTERVAL '2 days', NOW(), NOW()),
        (gen_random_uuid(), order_id2, true, true, 'TUNAI', 500000, NOW() - INTERVAL '1 day', NOW(), NOW()),
        (gen_random_uuid(), order_id3, false, false, NULL, 0, NULL, NOW(), NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- 6. KONSUMEN untuk setiap Pangkalan
-- ============================================
DO $$
DECLARE
    pkl_id1 UUID;
    pkl_id2 UUID;
    pkl_id3 UUID;
BEGIN
    SELECT id INTO pkl_id1 FROM pangkalans WHERE code = 'PKL-001' LIMIT 1;
    SELECT id INTO pkl_id2 FROM pangkalans WHERE code = 'PKL-002' LIMIT 1;
    SELECT id INTO pkl_id3 FROM pangkalans WHERE code = 'PKL-003' LIMIT 1;

    -- Konsumen PKL-001
    INSERT INTO consumers (id, pangkalan_id, name, nik, kk, consumer_type, phone, address, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), pkl_id1, 'Ibu Aminah', '1271234567890123', '1271234567890100', 'RUMAH_TANGGA', '081111111101', 'Jl. Melati No. 5', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id1, 'Warung Pak Tono', NULL, NULL, 'WARUNG', '081111111102', 'Jl. Anggrek No. 10', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id1, 'Bu Dewi', '1271234567890124', '1271234567890100', 'RUMAH_TANGGA', '081111111103', 'Jl. Mawar No. 15', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id1, 'Warung Bu Eni', NULL, NULL, 'WARUNG', '081111111104', 'Jl. Kenanga No. 20', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id1, 'Pak Rahman', '1271234567890125', '1271234567890101', 'RUMAH_TANGGA', '081111111105', 'Jl. Dahlia No. 25', true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- Konsumen PKL-002
    INSERT INTO consumers (id, pangkalan_id, name, nik, kk, consumer_type, phone, address, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), pkl_id2, 'Ibu Sari', '1271234567890201', '1271234567890200', 'RUMAH_TANGGA', '081222222201', 'Jl. Flamboyan No. 5', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id2, 'Warung Mak Ijah', NULL, NULL, 'WARUNG', '081222222202', 'Jl. Cempaka No. 10', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id2, 'Pak Darto', '1271234567890202', '1271234567890200', 'RUMAH_TANGGA', '081222222203', 'Jl. Bougenville No. 15', true, NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- Konsumen PKL-003
    INSERT INTO consumers (id, pangkalan_id, name, nik, kk, consumer_type, phone, address, is_active, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), pkl_id3, 'Ibu Lestari', '1271234567890301', '1271234567890300', 'RUMAH_TANGGA', '081333333301', 'Jl. Teratai No. 5', true, NOW(), NOW()),
        (gen_random_uuid(), pkl_id3, 'Warung Kopi Abang', NULL, NULL, 'WARUNG', '081333333302', 'Jl. Seruni No. 10', true, NOW(), NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- 7. OPERATOR (user tambahan)
-- Password: operator123
-- ============================================
INSERT INTO users (id, code, email, password, name, phone, role, is_active, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'USR-OP01', 'operator1@sim4lon.com', '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2', 'Operator Lapangan 1', '081456789012', 'OPERATOR', true, NOW(), NOW()),
    (gen_random_uuid(), 'USR-OP02', 'operator2@sim4lon.com', '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2', 'Operator Lapangan 2', '081456789013', 'OPERATOR', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SELESAI!
-- ============================================
-- Akun yang tersedia:
-- ADMIN: admin@agen.com / admin123
-- OPERATOR: operator1@sim4lon.com / admin123
-- OPERATOR: operator2@sim4lon.com / admin123
-- PANGKALAN: majujaya@pangkalan.com / admin123
-- PANGKALAN: sejahtera@pangkalan.com / admin123
-- PANGKALAN: berkah@pangkalan.com / admin123
-- ============================================
