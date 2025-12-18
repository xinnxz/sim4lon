-- Insert Admin Agen User
-- Password: admin123 (hashed with bcrypt)

INSERT INTO users (id, code, email, password, name, phone, role, is_active, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'USR-ADMIN',
    'admin@agen.com',
    '$2b$10$Qe/.YIQnbg.gqYHUsoc73.iA/mgIe4SHZ39lu3zH9NAUkwXYULbJ2',
    'Admin Agen',
    '081234567890',
    'ADMIN',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;
