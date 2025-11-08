# 🚀 Quick Start Guide - Kick It Up

## Prerequisites Check
- [ ] Java 21+ installed
- [ ] Node.js 16+ installed
- [ ] XAMPP MySQL running on port 3306

## Option 1: Automated Start (Recommended)

### Windows
Simply double-click:
```
START_PROJECT.bat
```

This will:
1. Check if MySQL is running
2. Initialize the database
3. Start the backend server
4. Start the frontend server
5. Open the application in your browser

### To Stop
Double-click:
```
STOP_PROJECT.bat
```

## Option 2: Manual Start

### Step 1: Start XAMPP MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Verify it's running (green highlight)

### Step 2: Initialize Database
```bash
cd backend
init-database.bat
```

### Step 3: Start Backend
```bash
cd backend
gradlew.bat bootRun
```
Wait for: "Started DemoApplication in X seconds"

### Step 4: Start Frontend
Open a new terminal:
```bash
cd frontend
npm run dev
```

### Step 5: Open Application
Open your browser and go to:
```
http://localhost:3000
```

## First Time Setup

### 1. Register a User
- Click "Sign Up"
- Fill in your details
- Click "Create Account"

### 2. Create a Sneaker Listing
- Click "Sell" in the navbar
- Fill in sneaker details
- Add image URLs
- Click "List Sneaker"

### 3. Browse Sneakers
- Go to home page
- Search for sneakers
- Click on a sneaker to view details

### 4. Place an Order
- Click on a sneaker
- Click "Buy Now"
- Fill in shipping details
- Click "Place Order"

### 5. Check Dashboard
- Click "Dashboard" in navbar
- View your statistics
- Manage orders
- Update order status

## Troubleshooting

### MySQL Not Running
```
Error: MySQL is not running on port 3306
```
**Solution:** Start XAMPP MySQL

### Port Already in Use
```
Error: Port 8080 is already in use
```
**Solution:** 
1. Stop any running Java applications
2. Or change port in `backend/src/main/resources/application.properties`

### Database Connection Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:** 
1. Check MySQL is running
2. Update password in `application.properties` if needed

### Frontend Can't Connect
```
Error: ECONNREFUSED
```
**Solution:** 
1. Make sure backend is running on port 8080
2. Check backend logs for errors

### SQL Syntax Error
```
Error: SQL syntax error
```
**Solution:** 
1. Run `backend/init-database.bat` again
2. This will recreate all tables

## Verify Installation

### Check Backend
Open: http://localhost:8080/api/sneakers/all
Should return: `[]` (empty array)

### Check Frontend
Open: http://localhost:3000
Should show: Beautiful home page with search

### Check Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Select `sneaker_store` database
3. Verify tables exist:
   - users
   - user_roles
   - sneakers
   - sneaker_images
   - orders
   - favorites
   - reviews

## Default Configuration

### Backend
- Port: 8080
- Database: sneaker_store
- MySQL User: root
- MySQL Password: (empty)

### Frontend
- Port: 3000
- API Proxy: http://localhost:8080

## Testing the Application

### Test User Registration
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phoneNumber": "1234567890",
  "address": "123 Test St"
}
```

### Test Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Test Get Sneakers
```bash
GET http://localhost:8080/api/sneakers/all
```

## Next Steps

1. ✅ Application is running
2. 📝 Register your account
3. 👟 Create your first sneaker listing
4. 🛒 Test the order flow
5. ⭐ Leave a review
6. 📊 Check your dashboard

## Need Help?

- Check [README.md](README.md) for full documentation
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production setup
- Check [FIXES_APPLIED.md](FIXES_APPLIED.md) for resolved issues
- Review backend logs in the terminal
- Check browser console for frontend errors

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **phpMyAdmin:** http://localhost/phpmyadmin
- **API Docs:** See [README.md](README.md#-api-endpoints)

## Features to Try

1. **User Management**
   - Register
   - Login
   - Update profile
   - Change password

2. **Sneaker Management**
   - Create listing
   - Browse sneakers
   - Search by name/brand
   - View details

3. **Shopping**
   - Add to favorites
   - Place orders
   - Track orders
   - Leave reviews

4. **Seller Dashboard**
   - View statistics
   - Manage orders
   - Update order status
   - Track revenue

## Success Indicators

✅ Backend shows: "Started DemoApplication in X seconds"
✅ Frontend shows: "VITE v5.4.21 ready in X ms"
✅ No SQL errors in backend logs
✅ Home page loads with search bar
✅ Can register and login
✅ Can create sneaker listings

## Common Commands

### Restart Backend
```bash
# Stop: Ctrl+C in backend terminal
# Start:
cd backend
gradlew.bat bootRun
```

### Restart Frontend
```bash
# Stop: Ctrl+C in frontend terminal
# Start:
cd frontend
npm run dev
```

### Reset Database
```bash
cd backend
init-database.bat
```

### Build for Production
```bash
# Backend
cd backend
gradlew.bat build

# Frontend
cd frontend
npm run build
```

---

**Enjoy Kick It Up! 👟🎉**
