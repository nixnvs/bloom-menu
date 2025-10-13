-- Debug script to check Chia Pudding product and Bowls subcategory

-- Check if Bowls subcategory exists and is active
SELECT 
  s.id as subcategory_id,
  s.name as subcategory_name,
  s.active as subcategory_active,
  c.id as category_id,
  c.name as category_name,
  c.active as category_active
FROM subcategories s
JOIN categories c ON s.category_id = c.id
WHERE s.name = 'Bowls';

-- Check if Chia Pudding product exists
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.active as product_active,
  p.category_id,
  p.subcategory_id,
  c.name as category_name,
  c.active as category_active,
  s.name as subcategory_name,
  s.active as subcategory_active
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories s ON p.subcategory_id = s.id
WHERE p.name LIKE '%Chia%' OR p.name LIKE '%chia%';

-- Check all products in Comidas category
SELECT 
  p.id,
  p.name,
  p.active as product_active,
  p.subcategory_id,
  s.name as subcategory_name,
  s.active as subcategory_active
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories s ON p.subcategory_id = s.id
WHERE c.name = 'Comidas'
ORDER BY s.name, p.name;

-- Check all subcategories in Comidas category
SELECT 
  s.id,
  s.name,
  s.active,
  s.display_order,
  COUNT(p.id) as product_count
FROM subcategories s
JOIN categories c ON s.category_id = c.id
LEFT JOIN products p ON p.subcategory_id = s.id AND p.active = true
WHERE c.name = 'Comidas'
GROUP BY s.id, s.name, s.active, s.display_order
ORDER BY s.display_order;
