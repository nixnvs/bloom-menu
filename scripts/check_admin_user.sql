-- Check if admin user exists and show details
SELECT 
    id,
    username,
    password_hash,
    created_at,
    LENGTH(password_hash) as hash_length,
    SUBSTRING(password_hash, 1, 10) as hash_preview
FROM admin_users
WHERE username = 'costapatagonia';

-- If no user found, create one with correct credentials
-- Password: bloomxyz
-- This will be hashed with bcrypt
INSERT INTO admin_users (username, password_hash)
SELECT 'costapatagonia', '$2a$10$YourHashedPasswordHere'
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'costapatagonia'
);

-- Show all admin users
SELECT username, created_at FROM admin_users;
