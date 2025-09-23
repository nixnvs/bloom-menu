-- Add image_url fields to all relevant tables
-- This script adds image upload capability to products, categories, subcategories, and configuration

-- Add image_url to products table
ALTER TABLE products 
ADD COLUMN image_url TEXT;

-- Add image_url to categories table  
ALTER TABLE categories 
ADD COLUMN image_url TEXT;

-- Add image_url to subcategories table
ALTER TABLE subcategories 
ADD COLUMN image_url TEXT;

-- Create a configuration table for general cafe settings and images
CREATE TABLE IF NOT EXISTS configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration entries
INSERT INTO configuration (key, value, description) VALUES 
('cafe_name', 'Bloom Café', 'Name of the café'),
('cafe_description', 'Cafetería - Cultura - Pâtisserie', 'Café tagline/description'),
('hero_image', NULL, 'Main hero image for the homepage'),
('logo_image', NULL, 'Café logo image')
ON CONFLICT (key) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_image_url ON categories(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subcategories_image_url ON subcategories(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_configuration_key ON configuration(key);
