-- This script creates a test order that's 4 days old
-- Run this in your H2 console to test the auto-complete feature

-- First, check existing orders
SELECT * FROM orders;

-- Update an existing order to be 4 days old (replace ORDER_ID with actual order ID)
UPDATE orders 
SET order_date = DATEADD('DAY', -4, CURRENT_TIMESTAMP)
WHERE id = 1;  -- Change this to your order ID

-- Verify the update
SELECT id, order_date, status, 
       DATEDIFF('DAY', order_date, CURRENT_TIMESTAMP) as days_old
FROM orders;

-- After running the auto-complete endpoint, check if status changed to DELIVERED
SELECT * FROM orders WHERE id = 1;
