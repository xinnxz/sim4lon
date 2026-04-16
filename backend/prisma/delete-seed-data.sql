-- Script to delete all data except users table
-- Run this in Supabase SQL Editor

-- Disable triggers temporarily
SET session_replication_role = replica;

-- Delete in correct order (child tables first to avoid FK constraints)
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE timeline_tracks CASCADE;
TRUNCATE TABLE payment_records CASCADE;
TRUNCATE TABLE order_payment_details CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE stock_histories CASCADE;
TRUNCATE TABLE consumer_orders CASCADE;
TRUNCATE TABLE consumers CASCADE;
TRUNCATE TABLE pangkalan_stock_movements CASCADE;
TRUNCATE TABLE pangkalan_stocks CASCADE;
TRUNCATE TABLE lpg_prices CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE penyaluran_harian CASCADE;
TRUNCATE TABLE perencanaan_harian CASCADE;
TRUNCATE TABLE penerimaan_stok CASCADE;
TRUNCATE TABLE agen_orders CASCADE;
TRUNCATE TABLE pangkalans CASCADE;
TRUNCATE TABLE drivers CASCADE;
TRUNCATE TABLE agen CASCADE;
TRUNCATE TABLE lpg_products CASCADE;
TRUNCATE TABLE company_profile CASCADE;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- Verify users table is untouched
SELECT 'Users preserved:', COUNT(*) FROM users;
