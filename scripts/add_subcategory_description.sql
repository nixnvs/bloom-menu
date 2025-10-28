-- Add description field to subcategories table
ALTER TABLE subcategories
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add some example descriptions
UPDATE subcategories 
SET description = 'Disponible de 8:00 AM a 12:00 PM'
WHERE name = 'Breakfast';

UPDATE subcategories 
SET description = 'Disponible de 12:00 PM a 4:00 PM'
WHERE name = 'Lunch';
