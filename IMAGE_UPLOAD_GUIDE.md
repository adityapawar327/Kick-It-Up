# Image Upload Feature Guide

## Overview
The application now supports **both URL-based images and direct file uploads** from your PC when creating or editing sneaker listings.

## Database Update Required

### Why Update?
The original database schema stored image URLs in a `VARCHAR(500)` column, which is too small for Base64-encoded images. Base64 images can be 50,000+ characters long.

### How to Update

#### Option 1: If you have an existing database
Run the migration script to update the column:

```bash
cd backend
run-migration.bat
```

Enter your MySQL root password when prompted.

#### Option 2: If starting fresh
Simply run the database initialization:

```bash
cd backend
init-database.bat
```

The updated schema already includes `MEDIUMTEXT` for image storage.

## Features

### 1. Create Sneaker Page
- **Upload from PC**: Click the upload area to select images from your computer
- **Add URLs**: Enter image URLs manually
- **Mix Both**: You can use both methods together
- **Multiple Images**: Upload multiple images at once
- **Preview**: See thumbnails of uploaded images before submitting
- **File Limits**: 
  - Max 5MB per image
  - Supported formats: PNG, JPG, JPEG

### 2. Edit Listing
- Same upload functionality in the edit modal
- Keep existing URL images
- Add new uploaded images
- Remove unwanted images

## Technical Details

### Database Schema
```sql
CREATE TABLE sneaker_images (
    sneaker_id BIGINT NOT NULL,
    image_url MEDIUMTEXT,  -- Changed from VARCHAR(500)
    FOREIGN KEY (sneaker_id) REFERENCES sneakers(id) ON DELETE CASCADE
);
```

### Storage
- **MEDIUMTEXT** can store up to **16MB** of text data
- Base64 images are typically 1-3MB after encoding
- This allows storing 5-15 high-quality images per sneaker

### How It Works
1. User selects image file(s) from their PC
2. JavaScript FileReader converts images to Base64 data URLs
3. Base64 strings are stored in the database alongside regular URLs
4. Frontend displays both URL and Base64 images seamlessly

## Migration Steps (Detailed)

### Step 1: Backup Your Database (Important!)
```bash
mysqldump -u root -p sneaker_marketplace > backup.sql
```

### Step 2: Run Migration
```bash
cd backend
run-migration.bat
```

### Step 3: Verify
Check that the column was updated:
```sql
DESCRIBE sneaker_images;
```

You should see `image_url` as `MEDIUMTEXT`.

### Step 4: Test
1. Go to "Create Sneaker" page
2. Upload an image from your PC
3. Submit the form
4. Verify the image displays correctly

## Troubleshooting

### Issue: "Packet too large" error
**Solution**: Increase MySQL's `max_allowed_packet` setting:

1. Open MySQL config file (my.ini or my.cnf)
2. Add or update:
   ```
   max_allowed_packet=64M
   ```
3. Restart MySQL service

### Issue: Images not displaying
**Solution**: 
- Check browser console for errors
- Verify image file size is under 5MB
- Ensure image format is PNG, JPG, or JPEG

### Issue: Migration fails
**Solution**:
- Ensure MySQL is running
- Check you have correct database credentials
- Verify database name is `sneaker_marketplace`
- Run manually:
  ```bash
  mysql -u root -p sneaker_marketplace < src/main/resources/migration-update-image-column.sql
  ```

## Best Practices

1. **Image Size**: Compress images before uploading to reduce file size
2. **Mix Methods**: Use URLs for external images, uploads for personal photos
3. **Quality**: Upload high-quality images for better presentation
4. **Multiple Images**: Show different angles of the sneakers

## Performance Considerations

- Base64 encoding increases image size by ~33%
- Consider using image compression before upload
- For production, consider using cloud storage (AWS S3, Cloudinary) instead of Base64
- Current implementation is suitable for moderate traffic

## Future Enhancements

Potential improvements for production:
- Image compression on upload
- Cloud storage integration (AWS S3, Cloudinary)
- Image optimization and resizing
- CDN integration for faster loading
- Lazy loading for image galleries
