# 🚀 Sneaker Store - Complete Startup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **XAMPP** installed (for MySQL database)
- ✅ **Java 17+** installed
- ✅ **Node.js 16+** and npm installed
- ✅ **Google Gemini API Key** (for AI features)

---

## 🎯 First Time Setup

### 1. Database Setup (XAMPP)

1. Open **XAMPP Control Panel**
2. Click **Start** for **MySQL**
3. Wait for MySQL to show "Running" status

> **Note:** The database `sneaker_store` will be created automatically on first run!

### 2. Configure Environment Variables

#### Frontend Configuration
Navigate to `frontend` folder and create `.env` file:

```bash
cd frontend
copy .env.example .env
```

Edit `.env` and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

> Get your API key from: https://makersuite.google.com/app/apikey

### 3. Install Dependencies

#### Backend (if needed)
```bash
cd backend
gradlew.bat build
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
gradlew.bat bootRun
```

**Wait for:** `Started DemoApplication in X.XXX seconds`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:3000/`

### 5. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 🔄 Daily Startup (After First Setup)

### Quick Start Commands

1. **Start XAMPP MySQL** (via XAMPP Control Panel)

2. **Start Backend** (in one terminal):
   ```bash
   cd backend
   gradlew.bat bootRun
   ```

3. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Browser**: http://localhost:3000

---

## 🎨 Application Features

### 🏠 Core Features
- **Browse Sneakers** - View all available sneakers with images
- **Search & Filter** - Find sneakers by name, brand, or price
- **Product Details** - View detailed information with image gallery
- **Shopping Cart** - Add items, manage quantities, checkout
- **User Authentication** - Register, login, secure sessions
- **Guest Mode** - Browse without registration

### 👤 User Features
- **Profile Management** - Update personal information
- **Profile Image Upload** - Upload custom profile pictures (max 5MB)
- **Seller Mode Toggle** - Enable/disable seller capabilities
- **About Me Section** - Add personal bio
- **Order History** - Track your purchases
- **Favorites** - Save sneakers you like
- **Reviews** - Rate and review products

### 🛍️ Seller Features
- **Create Listings** - Add new sneakers with images
- **Manage Listings** - Edit or delete your products
- **Order Management** - View and process orders
- **Dashboard** - Track sales and inventory

### 🤖 AI Features (Powered by Google Gemini)
- **AI Product Descriptions** - Generate compelling descriptions
- **AI Insights** - Get product recommendations and insights
- **Smart Suggestions** - AI-powered product information

### 💰 Additional Features
- **Currency Toggle** - Switch between USD and INR
- **Real-time Exchange Rates** - Automatic currency conversion
- **GPS Location** - Auto-fill shipping address
- **Payment Methods** - Multiple payment options
- **Responsive Design** - Works on all devices

---

## 🔧 Technical Details

### Backend (Spring Boot)
- **Port:** 8000
- **API Base:** http://localhost:8000/api
- **Database:** MySQL (sneaker_store)
- **Framework:** Spring Boot 3.x
- **Security:** JWT Authentication
- **ORM:** Hibernate with JPA

### Frontend (React + Vite)
- **Port:** 3000
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Database Schema
- **users** - User accounts with profiles
- **sneakers** - Product listings
- **orders** - Purchase records
- **favorites** - User favorites
- **reviews** - Product reviews
- **user_roles** - User permissions

---

## 🛡️ Data Safety

### ✅ Your Data is SAFE
- All user data persists between restarts
- Database uses `update` mode (never drops data)
- Orders, users, and products are permanent
- No automatic data resets

### ✅ Automatic Schema Updates
- New columns added automatically
- Tables created on first run
- No manual SQL scripts needed
- Zero data loss on updates

### ❌ Never Do This
- Don't change `spring.jpa.hibernate.ddl-auto` from `update`
- Don't manually drop the database
- Don't run SQL reset scripts
- Don't delete user data manually

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

**MySQL connection failed:**
- Ensure XAMPP MySQL is running
- Check port 3306 is available
- Verify credentials in `application.properties`

**Build errors:**
```bash
cd backend
gradlew.bat clean build
```

### Frontend Issues

**Port 3000 already in use:**
- Kill the existing process or use a different port
- Vite will automatically suggest an alternative port

**Dependencies issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not working:**
- Ensure `.env` file exists in `frontend` folder
- Restart the dev server after changing `.env`
- Variables must start with `VITE_`

### Database Issues

**Database not created:**
- Check MySQL is running in XAMPP
- Backend will create it automatically on first run
- Check backend logs for errors

**Schema not updating:**
- Restart the backend application
- Hibernate will update schema automatically
- Check `application.properties` has `ddl-auto=update`

### Common Errors

**"Cannot find module" errors:**
```bash
npm install
```

**"CORS policy" errors:**
- Backend CORS is configured for localhost:3000
- Check frontend is running on correct port

**"Unauthorized" errors:**
- Token may have expired
- Logout and login again
- Clear browser localStorage

---

## 📊 Default Ports

| Service  | Port | URL                      |
|----------|------|--------------------------|
| Frontend | 3000 | http://localhost:3000    |
| Backend  | 8000 | http://localhost:8000    |
| MySQL    | 3306 | localhost:3306           |

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/guest` - Guest session

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

### Sneakers
- `GET /api/sneakers` - List all sneakers
- `GET /api/sneakers/{id}` - Get sneaker details
- `POST /api/sneakers` - Create sneaker (seller only)
- `PUT /api/sneakers/{id}` - Update sneaker (seller only)
- `DELETE /api/sneakers/{id}` - Delete sneaker (seller only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/seller` - Get seller orders

### Reviews & Favorites
- `POST /api/reviews` - Add review
- `GET /api/reviews/sneaker/{id}` - Get sneaker reviews
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites

---

## 📝 Development Notes

### Code Structure

```
sneaker-store/
├── backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── model/          # Database entities
│   │   ├── dto/            # Data transfer objects
│   │   ├── repository/     # Database access
│   │   ├── security/       # JWT & authentication
│   │   └── config/         # Configuration
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    ├── src/
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   ├── context/        # React context (state)
    │   ├── utils/          # Utilities (axios, etc)
    │   └── index.css       # Global styles
    └── .env                # Environment variables
```

### Key Technologies
- **Backend:** Spring Boot, Spring Security, JWT, Hibernate, MySQL
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **AI:** Google Gemini API
- **Database:** MySQL 8.0

---

## 🎓 Getting Started Guide

### For New Users

1. **Register an Account**
   - Click "Register" in the navbar
   - Fill in your details
   - Login with your credentials

2. **Browse Sneakers**
   - View all available sneakers on the home page
   - Click on any sneaker for details
   - Use search to find specific items

3. **Make a Purchase**
   - Add items to cart
   - Review your cart
   - Proceed to checkout
   - Fill in shipping details
   - Complete order

4. **Become a Seller**
   - Go to Profile page
   - Click "Edit"
   - Enable "Seller Mode" toggle
   - Save changes
   - Now you can create listings!

5. **Create Listings** (Sellers)
   - Click "Create Listing" in navbar
   - Upload sneaker images
   - Fill in product details
   - Use AI to generate descriptions
   - Publish your listing

---

## 🆘 Support

### Need Help?

- Check the troubleshooting section above
- Review backend console logs for errors
- Check browser console for frontend errors
- Ensure all services are running

### Common Questions

**Q: Can I use a different database?**
A: Yes, update `application.properties` with your database credentials.

**Q: How do I reset my password?**
A: Currently, use the "Change Password" feature in your profile.

**Q: Can I run this in production?**
A: Yes, but update security settings, use environment variables, and configure proper CORS.

**Q: How do I backup my data?**
A: Use MySQL backup tools or XAMPP's export feature.

---

## 📄 License & Credits

This is a full-stack sneaker marketplace application built with modern web technologies.

**Built with:**
- Spring Boot
- React + Vite
- Tailwind CSS
- Google Gemini AI
- MySQL

---

**Happy Selling! 👟✨**
