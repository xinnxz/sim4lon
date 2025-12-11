-- 1. Setup Extensions & ENUMs (Agar Data Type dikenali)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERATOR');
CREATE TYPE status_pesanan AS ENUM ('PESANAN_DIBUAT', 'MENUNGGU_PEMBAYARAN', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'BATAL');
CREATE TYPE lpg_type AS ENUM ('3kg', '12kg', '50kg');
CREATE TYPE payment_method AS ENUM ('TUNAI', 'TRANSFER');
CREATE TYPE stock_movement_type AS ENUM ('MASUK', 'KELUAR');

-- 2. Create Tables

-- TABLE 1: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- TABLE 2: pangkalans
CREATE TABLE pangkalans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    region VARCHAR(100),
    pic_name VARCHAR(255),
    phone VARCHAR(20),
    capacity INTEGER,
    note TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- TABLE 3: drivers
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    vehicle_id VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_drivers_users FOREIGN KEY (user_id) REFERENCES users(id)
);

-- TABLE 4: orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pangkalan_id UUID NOT NULL,
    driver_id UUID,
    order_date DATE NOT NULL,
    current_status status_pesanan NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_orders_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id),
    CONSTRAINT fk_orders_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- TABLE 5: order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    lpg_type lpg_type NOT NULL,
    label VARCHAR(50),
    price_per_unit DECIMAL(15,2) NOT NULL,
    qty INTEGER NOT NULL,
    sub_total DECIMAL(15,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- TABLE 6: order_payment_details
CREATE TABLE order_payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    is_dp BOOLEAN NOT NULL DEFAULT false,
    payment_method payment_method,
    amount_paid DECIMAL(15,2),
    payment_date TIMESTAMPTZ,
    proof_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_payment_details_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- TABLE 7: timeline_tracks
CREATE TABLE timeline_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    status status_pesanan NOT NULL,
    description TEXT,
    note TEXT,
    contains_string TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_timeline_orders FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- TABLE 8: invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    billing_address TEXT,
    billed_to_name VARCHAR(255),
    sub_total DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2),
    tax_amount DECIMAL(15,2),
    grand_total DECIMAL(15,2) NOT NULL,
    payment_status VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT fk_invoices_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- TABLE 9: payment_records
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    invoice_id UUID,
    method payment_method NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    proof_url TEXT,
    recorded_by_user_id UUID NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_records_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_records_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    CONSTRAINT fk_records_user FOREIGN KEY (recorded_by_user_id) REFERENCES users(id)
);

-- TABLE 10: stock_histories
CREATE TABLE stock_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pangkalan_id UUID NOT NULL,
    lpg_type lpg_type NOT NULL,
    movement_type stock_movement_type NOT NULL,
    qty INTEGER NOT NULL,
    note TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_stock_pangkalan FOREIGN KEY (pangkalan_id) REFERENCES pangkalans(id)
);

-- TABLE 11: activity_logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    pangkalan_name VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detail_numeric DECIMAL(15,2),
    url TEXT,
    icon_name VARCHAR(50),
    order_status status_pesanan,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_logs_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================================
-- 3. INDEXES (Query Optimization)
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_is_active ON users(is_active) WHERE deleted_at IS NULL;

-- Pangkalans indexes
CREATE INDEX idx_pangkalans_name ON pangkalans(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_pangkalans_region ON pangkalans(region) WHERE deleted_at IS NULL;
CREATE INDEX idx_pangkalans_is_active ON pangkalans(is_active) WHERE deleted_at IS NULL;

-- Drivers indexes
CREATE INDEX idx_drivers_user_id ON drivers(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_drivers_is_active ON drivers(is_active) WHERE deleted_at IS NULL;

-- Orders indexes
CREATE INDEX idx_orders_pangkalan_id ON orders(pangkalan_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_driver_id ON orders(driver_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_order_date ON orders(order_date DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_current_status ON orders(current_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON orders(created_at DESC) WHERE deleted_at IS NULL;

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_lpg_type ON order_items(lpg_type);

-- Order payment details indexes
CREATE INDEX idx_order_payment_order_id ON order_payment_details(order_id);
CREATE INDEX idx_order_payment_is_paid ON order_payment_details(is_paid);

-- Timeline tracks indexes
CREATE INDEX idx_timeline_order_id ON timeline_tracks(order_id);
CREATE INDEX idx_timeline_status ON timeline_tracks(status);
CREATE INDEX idx_timeline_created_at ON timeline_tracks(order_id, created_at DESC);

-- Invoices indexes
CREATE INDEX idx_invoices_order_id ON invoices(order_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date DESC) WHERE deleted_at IS NULL;

-- Payment records indexes
CREATE INDEX idx_payment_records_order_id ON payment_records(order_id);
CREATE INDEX idx_payment_records_invoice_id ON payment_records(invoice_id);
CREATE INDEX idx_payment_records_recorded_by ON payment_records(recorded_by_user_id);

-- Stock histories indexes
CREATE INDEX idx_stock_histories_pangkalan ON stock_histories(pangkalan_id);
CREATE INDEX idx_stock_histories_lpg_type ON stock_histories(lpg_type);
CREATE INDEX idx_stock_histories_movement ON stock_histories(movement_type);
CREATE INDEX idx_stock_histories_timestamp ON stock_histories(pangkalan_id, timestamp DESC);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_order_id ON activity_logs(order_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- ============================================
-- 4. TRIGGER: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_pangkalans_updated_at BEFORE UPDATE ON pangkalans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_order_payment_updated_at BEFORE UPDATE ON order_payment_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. SEED DATA (Initial Data for Testing)
-- ============================================

-- Admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password, role, name, phone) VALUES
('admin@sim4lon.co.id', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.AVkNWaKYGJD6vy', 'ADMIN', 'Admin SIM4LON', '081234567890');

-- Operator user (password: operator123)
INSERT INTO users (email, password, role, name, phone) VALUES
('operator@sim4lon.co.id', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OPERATOR', 'Operator Gudang', '082345678901');

-- Sample pangkalan
INSERT INTO pangkalans (name, address, region, pic_name, phone, capacity, note) VALUES
('Pangkalan Maju Jaya', 'Jl. Sudirman No. 12, Menteng', 'Jakarta Pusat', 'Pak Ahmad', '081234567890', 500, 'Pangkalan utama'),
('Pangkalan Berkah Sejahtera', 'Jl. Gajah Mada Blok C5 No. 4', 'Semarang', 'Bu Siti', '087765432109', 300, 'Pangkalan cabang'),
('Pangkalan Sumber Rezeki', 'Perumahan Indah Blok R No. 10', 'Bandung', 'Pak Budi', '085611223344', 200, 'Pembayaran selalu tepat waktu');

-- Sample driver (linked to a dummy user for FK - create user first)
INSERT INTO users (email, password, role, name, phone) VALUES
('driver1@sim4lon.co.id', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OPERATOR', 'Bambang Sugiharto', '083399887766');

INSERT INTO drivers (user_id, name, phone, vehicle_id, note)
SELECT id, 'Bambang Sugiharto', '083399887766', 'B 1234 ABC', 'Supir senior'
FROM users WHERE email = 'driver1@sim4lon.co.id';

-- ============================================
-- DONE! Database ready for use.
-- ============================================