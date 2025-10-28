-- Add description column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

-- Add a comment explaining the column
COMMENT ON COLUMN categories.description IS 'Optional description for the category, e.g., schedule or additional information';
