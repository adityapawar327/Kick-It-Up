-- Insert sample users (password is 'password123' encrypted with BCrypt)
INSERT INTO users (username, email, password, full_name, phone_number, address, created_at) VALUES
('admin', 'admin@sneakerstore.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', '1234567890', '123 Admin St', NOW()),
('nike_seller', 'nike@seller.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nike Official', '1234567891', '456 Nike Ave', NOW()),
('adidas_seller', 'adidas@seller.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Adidas Official', '1234567892', '789 Adidas Blvd', NOW()),
('jordan_seller', 'jordan@seller.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jordan Brand', '1234567893', '321 Jordan Rd', NOW());

-- Insert user roles
INSERT INTO user_roles (user_id, roles) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_USER'),
(3, 'ROLE_USER'),
(4, 'ROLE_USER');

-- Insert sample sneakers
INSERT INTO sneakers (name, brand, description, price, size, color, `condition`, stock, seller_id, status, created_at) VALUES
-- Nike Sneakers
('Air Jordan 1 Retro High OG', 'Nike', 'The iconic Air Jordan 1 in the classic Chicago colorway. Premium leather construction with Nike Air cushioning.', 170.00, '10', 'White/Black/Red', 'New', 15, 2, 'AVAILABLE', NOW()),
('Nike Dunk Low Panda', 'Nike', 'Clean black and white colorway. Perfect for everyday wear with premium leather upper.', 110.00, '9', 'Black/White', 'New', 20, 2, 'AVAILABLE', NOW()),
('Air Jordan 4 Retro', 'Nike', 'Classic Air Jordan 4 with visible Air unit and iconic design. Comfortable and stylish.', 210.00, '10.5', 'White/Cement', 'New', 10, 2, 'AVAILABLE', NOW()),
('Nike Air Force 1 Low', 'Nike', 'The timeless classic. All-white leather with Air cushioning. A must-have for any collection.', 90.00, '11', 'White', 'New', 30, 2, 'AVAILABLE', NOW()),
('Air Jordan 11 Retro', 'Nike', 'Premium patent leather with carbon fiber plate. One of the most iconic Jordans ever.', 220.00, '9.5', 'Black/Red', 'New', 8, 2, 'AVAILABLE', NOW()),
('Nike SB Dunk Low', 'Nike', 'Skateboarding heritage with modern comfort. Padded tongue and Zoom Air cushioning.', 120.00, '10', 'Navy/White', 'New', 12, 2, 'AVAILABLE', NOW()),
('Air Jordan 3 Retro', 'Nike', 'Elephant print and visible Air unit. Classic MJ design from 1988.', 200.00, '11', 'White/Cement', 'New', 7, 2, 'AVAILABLE', NOW()),
('Nike Air Max 90', 'Nike', 'Iconic Air Max cushioning with waffle outsole. Comfortable all-day wear.', 130.00, '10', 'White/Red', 'New', 18, 2, 'AVAILABLE', NOW()),
('Air Jordan 5 Retro', 'Nike', 'Fighter jet inspired design with reflective tongue. Premium nubuck upper.', 190.00, '9', 'Black/Metallic', 'New', 9, 2, 'AVAILABLE', NOW()),
('Nike Blazer Mid 77', 'Nike', 'Vintage basketball style with modern comfort. Suede and leather upper.', 100.00, '10.5', 'White/Black', 'New', 15, 2, 'AVAILABLE', NOW()),

-- Adidas Sneakers
('Adidas Yeezy Boost 350 V2', 'Adidas', 'Kanye West collaboration. Primeknit upper with Boost cushioning for ultimate comfort.', 220.00, '10', 'Zebra', 'New', 12, 3, 'AVAILABLE', NOW()),
('Adidas Ultraboost 22', 'Adidas', 'Maximum energy return with Boost technology. Perfect for running and casual wear.', 180.00, '9.5', 'Black/White', 'New', 20, 3, 'AVAILABLE', NOW()),
('Adidas Samba OG', 'Adidas', 'Classic soccer-inspired design. Leather upper with gum rubber outsole.', 100.00, '10', 'Black/White', 'New', 25, 3, 'AVAILABLE', NOW()),
('Adidas Stan Smith', 'Adidas', 'Tennis legend. Clean white leather with green heel tab. Timeless style.', 85.00, '11', 'White/Green', 'New', 30, 3, 'AVAILABLE', NOW()),
('Adidas NMD R1', 'Adidas', 'Modern street style with Boost cushioning. Primeknit upper for breathability.', 140.00, '10', 'Core Black', 'New', 15, 3, 'AVAILABLE', NOW()),
('Adidas Forum Low', 'Adidas', 'Basketball heritage with modern appeal. Premium leather construction.', 110.00, '9', 'White/Blue', 'New', 18, 3, 'AVAILABLE', NOW()),
('Adidas Gazelle', 'Adidas', 'Retro suede classic. Comfortable and versatile for any outfit.', 90.00, '10.5', 'Navy/White', 'New', 22, 3, 'AVAILABLE', NOW()),
('Adidas Superstar', 'Adidas', 'Iconic shell toe design. Hip-hop culture staple since the 80s.', 85.00, '11', 'White/Black', 'New', 28, 3, 'AVAILABLE', NOW()),
('Adidas Yeezy Slide', 'Adidas', 'Minimalist slide design. EVA foam for lightweight comfort.', 70.00, '10', 'Bone', 'New', 20, 3, 'AVAILABLE', NOW()),
('Adidas Campus 80s', 'Adidas', 'Vintage basketball style. Suede upper with classic 3-stripes.', 100.00, '9.5', 'Grey/White', 'New', 16, 3, 'AVAILABLE', NOW()),

-- New Balance Sneakers
('New Balance 550', 'New Balance', 'Basketball heritage meets modern street style. Premium leather upper.', 110.00, '10', 'White/Green', 'New', 15, 1, 'AVAILABLE', NOW()),
('New Balance 990v5', 'New Balance', 'Made in USA. Premium suede and mesh with ENCAP cushioning.', 185.00, '10.5', 'Grey', 'New', 12, 1, 'AVAILABLE', NOW()),
('New Balance 574', 'New Balance', 'Classic running silhouette. Comfortable ENCAP midsole technology.', 80.00, '9', 'Navy/Red', 'New', 25, 1, 'AVAILABLE', NOW()),
('New Balance 2002R', 'New Balance', 'Y2K inspired design. N-ergy and ABZORB cushioning for comfort.', 150.00, '11', 'Grey/White', 'New', 14, 1, 'AVAILABLE', NOW()),

-- Puma Sneakers
('Puma Suede Classic', 'Puma', 'Iconic suede sneaker. Hip-hop and breakdancing culture staple.', 70.00, '10', 'Black/White', 'New', 20, 1, 'AVAILABLE', NOW()),
('Puma RS-X', 'Puma', 'Chunky retro runner. Bold colors and RS cushioning technology.', 110.00, '9.5', 'Multi-Color', 'New', 15, 1, 'AVAILABLE', NOW()),
('Puma Clyde Court', 'Puma', 'Basketball performance meets street style. Lightweight and responsive.', 130.00, '10.5', 'White/Red', 'New', 10, 1, 'AVAILABLE', NOW()),

-- Converse Sneakers
('Converse Chuck Taylor All Star', 'Converse', 'The original. Canvas upper with rubber toe cap. Timeless design since 1917.', 55.00, '10', 'Black', 'New', 40, 1, 'AVAILABLE', NOW()),
('Converse Chuck 70 High', 'Converse', 'Premium version with better cushioning. Vintage canvas and higher rubber foxing.', 85.00, '9', 'White', 'New', 25, 1, 'AVAILABLE', NOW()),
('Converse One Star Pro', 'Converse', 'Skateboarding version with enhanced durability. Suede upper.', 75.00, '10.5', 'Navy/White', 'New', 18, 1, 'AVAILABLE', NOW()),

-- Vans Sneakers
('Vans Old Skool', 'Vans', 'Skateboarding icon. Canvas and suede with signature side stripe.', 65.00, '10', 'Black/White', 'New', 30, 1, 'AVAILABLE', NOW()),
('Vans Sk8-Hi', 'Vans', 'High-top classic. Padded collar for ankle support and comfort.', 70.00, '9.5', 'Black', 'New', 25, 1, 'AVAILABLE', NOW()),
('Vans Authentic', 'Vans', 'The original. Simple canvas design perfect for any style.', 50.00, '11', 'White', 'New', 35, 1, 'AVAILABLE', NOW()),

-- Reebok Sneakers
('Reebok Club C 85', 'Reebok', 'Tennis-inspired classic. Soft leather with vintage appeal.', 75.00, '10', 'White/Green', 'New', 20, 1, 'AVAILABLE', NOW()),
('Reebok Classic Leather', 'Reebok', 'Soft garment leather upper. Comfortable EVA midsole.', 80.00, '9', 'White', 'New', 22, 1, 'AVAILABLE', NOW()),
('Reebok Pump Omni Zone II', 'Reebok', 'Iconic Pump technology. Basketball heritage with modern comfort.', 140.00, '10.5', 'Black/Orange', 'New', 10, 1, 'AVAILABLE', NOW());

-- Insert sample images for sneakers
INSERT INTO sneaker_images (sneaker_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
(2, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'),
(3, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'),
(4, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500'),
(5, 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500'),
(6, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500'),
(7, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500'),
(8, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500'),
(9, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500'),
(10, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500');
