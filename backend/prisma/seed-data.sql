-- ============================================================
-- SEED SQL - Data Sampel untuk Dashboard Testing
-- ============================================================
-- Jalankan di database: psql atau langsung di Supabase SQL Editor
-- ============================================================

-- Pastikan extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- INSERT ORDERS
-- ============================================================
-- Menggunakan pangkalan dan driver yang sudah ada dari seed sebelumnya

INSERT INTO orders (id, pangkalan_id, driver_id, current_status, total_amount, note, order_date, created_at, updated_at)
VALUES 
    -- Order 1 - SELESAI hari ini
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'SELESAI', 2500000, 'Pesanan rutin mingguan', CURRENT_DATE, NOW(), NOW()),
    -- Order 2 - DIPROSES
    ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'DIPROSES', 1800000, 'Urgent delivery', CURRENT_DATE, NOW(), NOW()),
    -- Order 3 - DRAFT (pending)
    ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000013', NULL, 'DRAFT', 900000, 'Menunggu konfirmasi', CURRENT_DATE, NOW(), NOW()),
    -- Order 4 - MENUNGGU_PEMBAYARAN
    ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000011', NULL, 'MENUNGGU_PEMBAYARAN', 3200000, 'Perlu DP dulu', CURRENT_DATE, NOW(), NOW()),
    -- Order 5 - SELESAI kemarin
    ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'SELESAI', 1500000, 'Delivered on time', CURRENT_DATE - INTERVAL '1 day', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- INSERT ORDER ITEMS
-- ============================================================

INSERT INTO order_items (id, order_id, lpg_type, label, price_per_unit, qty, sub_total, created_at, updated_at)
VALUES
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '3kg', 'LPG 3kg', 18000, 100, 1800000, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', '12kg', 'LPG 12kg', 140000, 5, 700000, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', '3kg', 'LPG 3kg', 18000, 100, 1800000, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- INSERT STOCK HISTORIES
-- ============================================================
-- recorded_by_user_id menggunakan admin user

INSERT INTO stock_histories (id, lpg_type, movement_type, qty, note, recorded_by_user_id, timestamp, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000301'::uuid, '3kg', 'MASUK', 500, 'Stok awal', u.id, NOW() - INTERVAL '2 days', NOW()
FROM users u WHERE u.email = 'admin@sim4lon.co.id'
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_histories (id, lpg_type, movement_type, qty, note, recorded_by_user_id, timestamp, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000302'::uuid, '12kg', 'MASUK', 200, 'Stok awal', u.id, NOW() - INTERVAL '2 days', NOW()
FROM users u WHERE u.email = 'admin@sim4lon.co.id'
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_histories (id, lpg_type, movement_type, qty, note, recorded_by_user_id, timestamp, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000303'::uuid, '50kg', 'MASUK', 50, 'Stok awal', u.id, NOW() - INTERVAL '2 days', NOW()
FROM users u WHERE u.email = 'admin@sim4lon.co.id'
ON CONFLICT (id) DO NOTHING;

-- Stok keluar
INSERT INTO stock_histories (id, lpg_type, movement_type, qty, note, recorded_by_user_id, timestamp, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000304'::uuid, '3kg', 'KELUAR', 100, 'Pengiriman ke Pangkalan Maju Jaya', u.id, NOW() - INTERVAL '1 day', NOW()
FROM users u WHERE u.email = 'admin@sim4lon.co.id'
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_histories (id, lpg_type, movement_type, qty, note, recorded_by_user_id, timestamp, created_at)
SELECT 
    '00000000-0000-0000-0000-000000000305'::uuid, '12kg', 'KELUAR', 5, 'Pengiriman ke Pangkalan Maju Jaya', u.id, NOW() - INTERVAL '1 day', NOW()
FROM users u WHERE u.email = 'admin@sim4lon.co.id'
ON CONFLICT (id) DO NOTHING;

-- Verifikasi data
SELECT '📊 Verifikasi Data:' as info;
SELECT 'Orders:', COUNT(*) as count FROM orders;
SELECT 'Order Items:', COUNT(*) as count FROM order_items;
SELECT 'Stock Histories:', COUNT(*) as count FROM stock_histories;
