-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  allergies TEXT,
  has_gluten BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin users table (simple password-based auth for café admin)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, display_order) VALUES 
  ('Drinks', 1),
  ('Food', 2)
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, notes, allergies, has_gluten) 
SELECT 
  c.id,
  p.name,
  p.description,
  p.price,
  p.notes,
  p.allergies,
  p.has_gluten
FROM categories c
CROSS JOIN (VALUES
  ('Espresso', 'Rich and bold espresso shot', 2.50, '', '', false),
  ('Cappuccino', 'Espresso with steamed milk and foam', 4.00, 'Available with oat milk', 'Contains dairy', false),
  ('Latte', 'Smooth espresso with steamed milk', 4.50, 'Available with plant-based milk', 'Contains dairy', false),
  ('Croissant', 'Buttery, flaky pastry', 3.50, 'Freshly baked daily', 'Contains gluten, dairy', true),
  ('Avocado Toast', 'Sourdough with fresh avocado', 8.00, 'Add egg for +$2', 'Contains gluten', true)
) AS p(name, description, price, notes, allergies, has_gluten)
WHERE c.name = CASE 
  WHEN p.name IN ('Espresso', 'Cappuccino', 'Latte') THEN 'Drinks'
  ELSE 'Food'
END
ON CONFLICT DO NOTHING;

-- Create default admin user (password: admin123)
-- In production, this should be changed immediately
INSERT INTO admin_users (username, password_hash) VALUES 
  ('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ')
ON CONFLICT DO NOTHING;
