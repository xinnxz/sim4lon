-- ============================================================
-- SIM4LON DATABASE SCHEMA - COMPLETE SETUP
-- ============================================================
-- Jalankan script ini di pgAdmin4 Query Tool
-- Database: PostgreSQL (Railway)
-- ============================================================

-- ============================================================
-- STEP 1: EXTENSION & ENUM TYPES
-- ============================================================
-- Extension untuk generate UUID otomatis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum untuk role pengguna (hanya ADMIN dan OPERATOR yang bisa login)
CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERATOR');

-- Enum untuk status pesanan (alur: DRAFT → MENUNGGU_PEMBAYARAN → DIPROSES → SIAP_KIRIM → DIKIRIM → SELESAI)
CREATE TYPE status_pesanan AS ENUM (
    'DRAFT',
    'MENUNGGU_PEMBAYARAN', 
    'DIPROSES', 
    'SIAP_KIRIM',
    'DIKIRIM', 
    'SELESAI', 
    'BATAL'
);

-- Enum untuk tipe LPG
CREATE TYPE lpg_type AS ENUM ('3kg', '12kg', '50kg');

-- Enum untuk metode pembayaran
CREATE TYPE payment_method AS ENUM ('TUNAI', 'TRANSFER');

-- Enum untuk jenis pergerakan stok
CREATE TYPE stock_movement_type AS ENUM ('MASUK', 'KELUAR');

-- ============================================================
-- STEP 2: CREATE TABLES
-- ============================================================

-- ------------------------------------------------------------
-- TABLE 1: users
-- Pengguna yang bisa login ke sistem (Admin/Operator)
-- ------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- Akan di-hash dengan bcrypt
    role user_role NOT NULL DEFAULT 'OPERATOR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,                          -- URL foto profil
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ                    -- Soft delete
);

-- ------------------------------------------------------------
-- TABLE 2: drivers
-- Data supir untuk assignment pengiriman (BUKAN user login)
-- ------------------------------------------------------------
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    vehicle_id VARCHAR(20),                   -- Nomor kendaraan
    is_active BOOLEAN NOT NULL DEFAULT true,
    note TEXT,                                -- Catatan (optional)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- TABLE 3: pangkalans
-- Data pangkalan/agen LPG
-- ------------------------------------------------------------
CREATE TABLE pangkalans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    region VARCHAR(100),                      -- Wilayah/kecamatan
    pic_name VARCHAR(255),                    -- Nama PIC/kontak
    phone VARCHAR(20),
    capacity INTEGER,                         -- Kapasitas simpan
    note TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- TABLE 4: orders
-- Data pesanan utama
-- ------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pangkalan_id UUID NOT NULL,
    driver_id UUID,                           -- NULL jika belum di-assign
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_status status_pesanan NOT NULL DEFAULT 'DRAFT',
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT fk_orders_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id),
    CONSTRAINT fk_orders_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- ------------------------------------------------------------
-- TABLE 5: order_items
-- Detail item dalam pesanan (LPG 3kg, 12kg, 50kg)
-- ------------------------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    lpg_type lpg_type NOT NULL,
    label VARCHAR(50),                        -- "LPG 3 Kg", etc
    price_per_unit DECIMAL(15,2) NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    sub_total DECIMAL(15,2),                  -- price_per_unit * qty
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- TABLE 6: order_payment_details
-- Detail pembayaran per pesanan (1:1 dengan orders)
-- ------------------------------------------------------------
CREATE TABLE order_payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE,            -- 1 order = 1 payment detail
    is_paid BOOLEAN NOT NULL DEFAULT false,
    is_dp BOOLEAN NOT NULL DEFAULT false,     -- Apakah DP (uang muka)
    payment_method payment_method,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    payment_date TIMESTAMPTZ,
    proof_url TEXT,                           -- URL bukti pembayaran di R2
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_payment_details_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- TABLE 7: timeline_tracks
-- Riwayat perubahan status pesanan
-- ------------------------------------------------------------
CREATE TABLE timeline_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    status status_pesanan NOT NULL,
    description TEXT,                         -- "Pesanan dibuat oleh Admin"
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_timeline_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- TABLE 8: invoices
-- Faktur/nota untuk pesanan
-- ------------------------------------------------------------
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    invoice_number VARCHAR(50) UNIQUE,        -- "INV-202512-001"
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    billing_address TEXT,
    billed_to_name VARCHAR(255),
    sub_total DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ------------------------------------------------------------
-- TABLE 9: payment_records
-- Catatan pembayaran (bisa multiple untuk 1 order/invoice)
-- ------------------------------------------------------------
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    invoice_id UUID,
    method payment_method NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    proof_url TEXT,
    recorded_by_user_id UUID NOT NULL,        -- User yang mencatat
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_records_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_records_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_records_user FOREIGN KEY (recorded_by_user_id) REFERENCES users(id)
);

-- ------------------------------------------------------------
-- TABLE 10: stock_histories
-- Riwayat pergerakan stok (MASUK/KELUAR)
-- ------------------------------------------------------------
CREATE TABLE stock_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lpg_type lpg_type NOT NULL,
    movement_type stock_movement_type NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    note TEXT,
    recorded_by_user_id UUID,                 -- User yang mencatat
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_stock_user FOREIGN KEY (recorded_by_user_id) REFERENCES users(id)
);

-- ------------------------------------------------------------
-- TABLE 11: activity_logs
-- Log aktivitas untuk dashboard riwayat
-- ------------------------------------------------------------
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,                             -- User yang melakukan aksi
    order_id UUID,
    type VARCHAR(50) NOT NULL,                -- ORDER_CREATED, PAYMENT_RECORDED, etc
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pangkalan_name VARCHAR(255),              -- Denormalized untuk display
    detail_numeric DECIMAL(15,2),             -- Nilai amount jika relevan
    icon_name VARCHAR(50),
    order_status status_pesanan,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_logs_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================================================
-- STEP 3: CREATE INDEXES
-- ============================================================
-- Index untuk optimasi query yang sering digunakan

-- Users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- Drivers
CREATE INDEX idx_drivers_is_active ON drivers(is_active) WHERE deleted_at IS NULL;

-- Pangkalans
CREATE INDEX idx_pangkalans_name ON pangkalans(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_pangkalans_is_active ON pangkalans(is_active) WHERE deleted_at IS NULL;

-- Orders
CREATE INDEX idx_orders_pangkalan ON orders(pangkalan_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_driver ON orders(driver_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_status ON orders(current_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_date ON orders(order_date DESC) WHERE deleted_at IS NULL;

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Timeline
CREATE INDEX idx_timeline_order ON timeline_tracks(order_id);
CREATE INDEX idx_timeline_created ON timeline_tracks(order_id, created_at DESC);

-- Stock Histories
CREATE INDEX idx_stock_type ON stock_histories(lpg_type);
CREATE INDEX idx_stock_timestamp ON stock_histories(timestamp DESC);

-- Activity Logs
CREATE INDEX idx_activity_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX idx_activity_type ON activity_logs(type);

-- ============================================================
-- STEP 4: CREATE TRIGGER FOR updated_at
-- ============================================================
-- Trigger function untuk auto-update kolom updated_at

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger ke semua tabel yang punya updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pangkalans_updated_at BEFORE UPDATE ON pangkalans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_payment_details_updated_at BEFORE UPDATE ON order_payment_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 5: SEED DATA - Admin User Awal
-- ============================================================
-- Password: admin123 (hashed dengan bcrypt)
-- PENTING: Ganti password ini setelah login pertama!

INSERT INTO users (email, password, role, name, phone) VALUES
(
    'admin@sim4lon.co.id',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4qJUQypMPEsQxKHe', -- admin123
    'ADMIN',
    'Administrator',
    '081234567890'
);

-- ============================================================
-- DONE! Database siap digunakan.
-- ============================================================