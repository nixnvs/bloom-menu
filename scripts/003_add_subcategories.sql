-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subcategory_id to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Insert default subcategories for existing categories
INSERT INTO subcategories (category_id, name, display_order) 
SELECT 
  c.id,
  s.name,
  s.display_order
FROM categories c
CROSS JOIN (VALUES
  ('Coffee', 1),
  ('Tea', 2),
  ('Wine', 3),
  ('Cocktails', 4),
  ('Non-Alcoholic', 5)
) AS s(name, display_order)
WHERE c.name = 'Drinks'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (category_id, name, display_order) 
SELECT 
  c.id,
  s.name,
  s.display_order
FROM categories c
CROSS JOIN (VALUES
  ('Sweet', 1),
  ('Salty', 2),
  ('Breakfast', 3),
  ('Lunch', 4)
) AS s(name, display_order)
WHERE c.name = 'Food'
ON CONFLICT DO NOTHING;

-- Update existing products to have subcategories
UPDATE products 
SET subcategory_id = (
  SELECT s.id 
  FROM subcategories s 
  JOIN categories c ON s.category_id = c.id 
  WHERE c.name = 'Drinks' AND s.name = 'Coffee'
)
WHERE name IN ('Espresso', 'Cappuccino', 'Latte');

UPDATE products 
SET subcategory_id = (
  SELECT s.id 
  FROM subcategories s 
  JOIN categories c ON s.category_id = c.id 
  WHERE c.name = 'Food' AND s.name = 'Breakfast'
)
WHERE name IN ('Croissant', 'Avocado Toast');
