-- Migration script to update image_url column to support Base64 images
-- Run this if you have an existing database

-- Update the sneaker_images table to support larger image data (Base64)
ALTER TABLE sneaker_images 
MODIFY COLUMN image_url MEDIUMTEXT;

-- MEDIUMTEXT can store up to 16MB of text data
-- This is sufficient for Base64 encoded images
