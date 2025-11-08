# Database Setup Guide for XAMPP MySQL

## Prerequisites
- XAMPP installed with MySQL running
- MySQL accessible on localhost:3306
- Default root user with no password (or update application.properties)

## Setup Instructions

### Option 1: Automatic Setup (Recommended)
1. Make sure XAMPP MySQL is running
2. Run the Spring Boot application - it will create the database automatically
3. The schema will be created on first run

### Option 2: Manual Setup via phpMyAdmin
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "New" to create a new database
3. Name it: `sneaker_store`
4. Click "Create"
5. Select the `sneaker_store` database
6. Click "SQL" tab
7. Copy and paste the contents of `src/main/resources/schema.sql`
8. Click "Go" to execute

### Option 3: Manual Setup via MySQL Command Line
1. Open Command Prompt
2. Navigate to XAMPP MySQL bin folder:
   ```
   cd C:\xampp\mysql\bin
   ```
3. Login to MySQL:
   ```
   mysql -u root -p
   ```
   (Press Enter if no password)
4. Create database:
   ```sql
   CREATE DATABASE sneaker_store;
   USE sneaker_store;
   ```
5. Run the schema file:
   ```
   source C:/path/to/your/project/backend/src/main/resources/schema.sql
   ```

## Verify Setup
After setup, verify tables were created:
```sql
USE sneaker_store;
SHOW TABLES;
```

You should see:
- users
- user_roles
- sneakers
- sneaker_images
- orders
- favorites
- reviews

## Configuration
If your MySQL setup is different, update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

## Troubleshooting

### Error: Access denied for user 'root'@'localhost'
- Check your MySQL password in application.properties
- Make sure MySQL is running in XAMPP

### Error: Unknown database 'sneaker_store'
- The database wasn't created
- Follow Option 2 or 3 above to create it manually

### Error: Table already exists
- Tables are already created, you're good to go!
- If you want to reset, run: `DROP DATABASE sneaker_store;` then recreate

## Production Notes
- Change `spring.jpa.show-sql=false` in production
- Use a strong JWT secret
- Set a MySQL password for production
- Enable SSL for database connections
- Regular backups recommended
