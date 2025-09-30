-- Add About Us configuration entries to make the content editable by admin
-- This script adds all the About Us section content to the configuration table

-- About Us main text content
INSERT INTO configuration (key, value, description) VALUES 
('about_text_en', 'Welcome to Bloom, where culture meets culinary excellence. We are the café extension of our acclaimed Michelin restaurant, bringing you the same attention to detail and passion for quality in a more relaxed setting.', 'About Us main text in English'),
('about_text_es', 'Bienvenido a Bloom, donde la cultura se encuentra con la excelencia culinaria. Somos la extensión cafetería de nuestro aclamado restaurante Michelin, trayéndote la misma atención al detalle y pasión por la calidad en un ambiente más relajado.', 'About Us main text in Spanish')
ON CONFLICT (key) DO NOTHING;

-- Social media links
INSERT INTO configuration (key, value, description) VALUES 
('instagram_url', 'https://instagram.com/bloom', 'Instagram profile URL'),
('instagram_handle', '@bloom', 'Instagram handle display text'),
('email_address', 'hello@bloom.com', 'Contact email address'),
('website_url', 'https://bloom.com', 'Main website URL'),
('website_display', 'bloom.com', 'Website display text')
ON CONFLICT (key) DO NOTHING;

-- Restaurant connection
INSERT INTO configuration (key, value, description) VALUES 
('restaurant_name', 'Blossom', 'Name of the Michelin restaurant'),
('restaurant_url', 'https://blossom-restaurant.com', 'Michelin restaurant website URL'),
('restaurant_description_en', 'Our Michelin restaurant', 'Restaurant description in English'),
('restaurant_description_es', 'Nuestro restaurante Michelin', 'Restaurant description in Spanish')
ON CONFLICT (key) DO NOTHING;

-- Museum/Culture section
INSERT INTO configuration (key, value, description) VALUES 
('museum_name', 'Museum', 'Name of the cultural space'),
('museum_url', 'https://museum.com', 'Museum website URL'),
('museum_description_en', 'Discover our cultural exhibitions', 'Museum description in English'),
('museum_description_es', 'Descubre nuestras exposiciones culturales', 'Museum description in Spanish')
ON CONFLICT (key) DO NOTHING;

-- Section headers (translatable)
INSERT INTO configuration (key, value, description) VALUES 
('connect_header_en', 'Connect with Us', 'Connect section header in English'),
('connect_header_es', 'Conéctate con Nosotros', 'Connect section header in Spanish'),
('restaurant_header_en', 'Visit Our Restaurant', 'Restaurant section header in English'),
('restaurant_header_es', 'Visita Nuestro Restaurante', 'Restaurant section header in Spanish'),
('culture_header_en', 'Explore Art & Culture', 'Culture section header in English'),
('culture_header_es', 'Explora Arte y Cultura', 'Culture section header in Spanish')
ON CONFLICT (key) DO NOTHING;

-- Social media action text
INSERT INTO configuration (key, value, description) VALUES 
('follow_text_en', 'Follow Us', 'Follow us text in English'),
('follow_text_es', 'Síguenos', 'Follow us text in Spanish'),
('contact_text_en', 'Contact Us', 'Contact us text in English'),
('contact_text_es', 'Contáctanos', 'Contact us text in Spanish'),
('website_text_en', 'Our Website', 'Website link text in English'),
('website_text_es', 'Nuestro Sitio Web', 'Website link text in Spanish'),
('visit_text_en', 'Visit Blossom', 'Visit restaurant text in English'),
('visit_text_es', 'Visita Blossom', 'Visit restaurant text in Spanish')
ON CONFLICT (key) DO NOTHING;
