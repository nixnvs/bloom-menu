-- Add English language fields to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English language fields to subcategories table
ALTER TABLE subcategories 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English language fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS notes_en TEXT,
ADD COLUMN IF NOT EXISTS allergies_en TEXT;

-- Add English field to configuration table
ALTER TABLE configuration
ADD COLUMN IF NOT EXISTS value_en TEXT;

-- Update existing records to use Spanish as default
-- Categories: copy current name/description to Spanish columns (assuming current content is Spanish)
UPDATE categories 
SET name_en = NULL, description_en = NULL
WHERE name_en IS NULL;

-- Subcategories: copy current name/description to Spanish columns
UPDATE subcategories 
SET name_en = NULL, description_en = NULL
WHERE name_en IS NULL;

-- Products: copy current fields to Spanish columns
UPDATE products 
SET name_en = NULL, description_en = NULL, notes_en = NULL, allergies_en = NULL
WHERE name_en IS NULL;

-- Configuration: set English values to NULL initially
UPDATE configuration
SET value_en = NULL
WHERE value_en IS NULL;
