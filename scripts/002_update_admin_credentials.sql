-- Update admin credentials to costapatagonia/bloomxyz
-- Update the admin username from 'admin' to 'costapatagonia'
UPDATE admin_users 
SET username = 'costapatagonia' 
WHERE username = 'admin';

-- If no admin user exists, create one with the new credentials
INSERT INTO admin_users (username, password_hash) VALUES 
  ('costapatagonia', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ')
ON CONFLICT (username) DO NOTHING;
