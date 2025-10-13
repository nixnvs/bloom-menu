-- Diagnostic script to check product and subcategory relationships
-- This will help identify why products aren't appearing in the menu

-- 1. Check all products with their category and subcategory info
SELECT 
  p.id,
  p.name,
  p.active,
  p.category_id,
  c.name as category_name,
  p.subcategory_id,
  s.name as subcategory_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN subcategories s ON p.subcategory_id = s.id
ORDER BY p.created_at DESC;

-- 2. Check all subcategories with their category
SELECT 
  s.id,
  s.name as subcategory_name,
  s.active as subcategory_active,
  s.category_id,
  c.name as category_name,
  c.active as category_active
FROM subcategories s
LEFT JOIN categories c ON s.category_id = c.id
ORDER BY c.name, s.name;

-- 3. Count products per subcategory
SELECT 
  s.name as subcategory_name,
  s.id as subcategory_id,
  COUNT(p.id) as product_count,
  COUNT(CASE WHEN p.active = true THEN 1 END) as active_product_count
FROM subcategories s
LEFT JOIN products p ON p.subcategory_id = s.id
WHERE s.active = true
GROUP BY s.id, s.name
ORDER BY s.name;

-- 4. Find products that might have mismatched subcategory_ids
SELECT 
  p.name as product_name,
  p.subcategory_id,
  CASE 
    WHEN p.subcategory_id IS NULL THEN 'No subcategory'
    WHEN NOT EXISTS (SELECT 1 FROM subcategories WHERE id = p.subcategory_id) THEN 'Invalid subcategory_id'
    ELSE 'Valid'
  END as status
FROM products p
WHERE p.active = true;
