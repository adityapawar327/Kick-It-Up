# 👟 Kick It Up - Premium Sneaker Marketplace

A modern, full-stack sneaker marketplace built with Spring Boot and React, featuring a bold minimalist design inspired by streetwear aesthetics. Buy, sell, and discover authentic sneakers in a professional marketplace environment.

![Kick It Up](https://img.shields.io/badge/Status-Active-success)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🛍️ Marketplace Features
- **Browse & Search** - Explore sneakers with advanced filtering by brand, condition, and search
- **Image Upload** - Upload images directly from your PC or use URLs (Base64 support)
- **Buy & Sell** - Complete marketplace with secure transactions
- **Order Management** - Track orders with real-time status updates (Pending → Shipped → Delivered)
- **Reviews & Ratings** - Community-driven 5-star rating system
- **Favorites** - Save sneakers to your wishlist
- **Seller Dashboard** - Comprehensive analytics and order management
- **My Listings** - Manage your sneaker inventory with edit/delete capabilities

### 🎨 Design & UX
- **HOODIE Theme** - Bold black and white minimalist aesthetic
- **Bebas Neue Typography** - Professional display font for headings
- **Smooth Animations** - Entrance effects, hover states, and transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Custom Dialogs** - Themed confirmation dialogs and toast notifications
- **About Us Page** - Company information, values, and team details

### 🔒 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt hashing for user passwords
- **Protected Routes** - Role-based access control
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side and client-side validation
- **Hibernate Proxy Fix** - Proper JSON serialization with Jackson annotations

### 📊 Dashboard & Analytics
- **Seller Stats** - Total listings, active sneakers, orders, and revenue
- **Order Management** - Update order status and track shipments
- **Buyer Dashboard** - View purchase history and order status
- **Real-time Updates** - Live data synchronization

## 🚀 Quick Start

### Prerequisites
- **Java**: 17 or higher
- **Node.js**: 16 or higher
- **MySQL**: 8.0 or higher (or XAMPP)
- **Git**: Latest version

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/adityapawar327/Kick-It-Up.git
cd Kick-It-Up
```

#### 2. Setup Database

**Using MySQL:**
```bash
mysql -u root -p
CREATE DATABASE sneaker_store;
exit;

# Run schema
mysql -u root -p sneaker_store < backend/src/main/resources/schema.sql

# Load sample data (optional)
mysql -u root -p sneaker_store < backend/src/main/resources/data.sql
```

**Using XAMPP:**
- Start XAMPP MySQL service
- Open phpMyAdmin (http://localhost/phpmyadmin)
- Create database `sneaker_store`
- Import `backend/src/main/resources/schema.sql`
- Import `backend/src/main/resources/data.sql` (optional)

**For Image Upload Support:**
```bash
cd backend
run-migration.bat
```
This updates the database to support Base64 image storage.

#### 3. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_SECRET_KEY_CHANGE_THIS
```

#### 4. Start Backend
```bash
cd backend

# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

Backend will start on: http://localhost:8080

#### 5. Setup Frontend

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8080
```

Install and run:
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

#### 6. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Default Credentials**: Register a new account or use sample data

## 📁 Project Structure

```
Kick-It-Up/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/example/demo/
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── SneakerController.java
│   │   │   ├── OrderController.java
│   │   │   ├── ReviewController.java
│   │   │   └── FavoriteController.java
│   │   ├── service/                 # Business Logic
│   │   ├── repository/              # Data Access Layer
│   │   ├── model/                   # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Sneaker.java
│   │   │   ├── Order.java
│   │   │   ├── Review.java
│   │   │   └── Favorite.java
│   │   ├── dto/                     # Data Transfer Objects
│   │   ├── config/                  # Configuration
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   └── exception/               # Exception Handling
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── schema.sql
│   │   ├── data.sql
│   │   └── migration-update-image-column.sql
│   ├── build.gradle
│   └── Procfile                     # Deployment config
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── pages/                   # Page Components
│   │   │   ├── Home.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── SneakerDetails.jsx
│   │   │   ├── CreateSneaker.jsx
│   │   │   ├── MyListings.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json                  # Vercel deployment
│   └── .env.example
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.2 | Application Framework |
| Spring Security | 6.x | Authentication & Authorization |
| JWT | 0.11.5 | Token-based Auth |
| MySQL | 8.0 | Database |
| Hibernate/JPA | 6.x | ORM |
| Gradle | 8.5 | Build Tool |
| Java | 17 | Programming Language |
| Jackson | 2.15 | JSON Serialization |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI Framework |
| Vite | 5.0 | Build Tool |
| React Router | 6.x | Routing |
| Axios | 1.6 | HTTP Client |
| Tailwind CSS | 3.4 | Styling |
| Lucide React | Latest | Icons |
| Bebas Neue | - | Display Font |
| Inter | - | Body Font |

## 🔑 Environment Variables

### Backend (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store
spring.datasource.username=root
spring.datasource.password=

# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production
jwt.expiration=86400000

# Server Configuration
server.port=8080

# CORS Configuration (for production)
cors.allowed.origins=http://localhost:5173,https://your-frontend-url.vercel.app
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8080
```

## 📝 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Sneaker Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sneakers/all` | Get all sneakers | No |
| GET | `/api/sneakers/{id}` | Get sneaker by ID | No |
| GET | `/api/sneakers/my-sneakers` | Get user's listings | Yes |
| POST | `/api/sneakers` | Create sneaker | Yes |
| PUT | `/api/sneakers/{id}` | Update sneaker | Yes |
| DELETE | `/api/sneakers/{id}` | Delete sneaker | Yes |

### Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders/my-orders` | Get user orders | Yes |
| POST | `/api/orders` | Create order | Yes |
| PATCH | `/api/orders/{id}/status` | Update order status | Yes |

### Review Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/sneaker/{id}` | Get sneaker reviews | No |
| POST | `/api/reviews` | Create review | Yes |

### Favorite Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/favorites` | Get user favorites | Yes |
| POST | `/api/favorites/{id}` | Add to favorites | Yes |
| DELETE | `/api/favorites/{id}` | Remove from favorites | Yes |

### Dashboard Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/seller/stats` | Get seller statistics | Yes |
| GET | `/api/dashboard/seller/orders` | Get seller orders | Yes |

## 🎨 Design System

### Color Palette
```css
--primary-black: #000000
--primary-white: #FFFFFF
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-600: #4B5563
--gray-800: #1F2937
```

### Typography
- **Display Font**: Bebas Neue (Headings, Titles)
- **Body Font**: Inter (Paragraphs, UI Text)
- **Style**: Uppercase, Wide Letter-spacing (0.05em - 0.15em)
- **Weight**: Bold (700) for emphasis

### Component Styles
```css
/* Buttons */
.btn-primary: Black background, white text, rounded-full
.btn-secondary: White background, black text, black border

/* Cards */
.card: White background, 2px black border, rounded-3xl

/* Inputs */
.input-field: White background, 2px black border, rounded-full

/* Animations */
- slideUp: Entrance from bottom
- slideDown: Entrance from top
- scaleIn: Scale from 95% to 100%
- fadeIn: Opacity 0 to 1
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Set root directory to `frontend`
- Add environment variable: `VITE_API_URL=your-backend-url`
- Deploy!

### Deploy to Railway (Backend)

1. **Go to [railway.app](https://railway.app)**

2. **Deploy from GitHub**
- Select your repository
- Add MySQL database
- Set environment variables
- Deploy!

3. **Environment Variables**
```
DATABASE_URL=mysql://...
DB_USERNAME=...
DB_PASSWORD=...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-app.vercel.app
```

## 🧪 Testing

### Manual Testing
1. Register a new account
2. Login with credentials
3. Browse sneakers
4. Create a listing (with image upload)
5. Add sneakers to favorites
6. Place an order
7. Leave a review
8. Check dashboard statistics
9. Update order status
10. Edit/delete listings

### API Testing
Use the included `test-auth.http` file with REST Client extension in VS Code.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure MySQL is running
- Check credentials in `application.properties`
- Verify database `sneaker_store` exists

**CORS Errors**
- Update `cors.allowed.origins` in `application.properties`
- Restart backend server

**Image Upload Not Working**
- Run migration script: `backend/run-migration.bat`
- Ensure database column is `MEDIUMTEXT`

**Hibernate Proxy Error**
- Already fixed with Jackson annotations
- Rebuild backend: `./gradlew clean build`

**Port Already in Use**
- Backend: Change `server.port` in `application.properties`
- Frontend: Change port in `vite.config.js`

## 📊 Database Schema

### Main Tables
- **users** - User accounts and authentication
- **sneakers** - Sneaker listings
- **sneaker_images** - Image URLs (supports Base64)
- **orders** - Purchase orders
- **reviews** - Product reviews
- **favorites** - User favorites
- **user_roles** - User role assignments

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Aditya Pawar**
- GitHub: [@adityapawar327](https://github.com/adityapawar327)
- Repository: [Kick-It-Up](https://github.com/adityapawar327/Kick-It-Up)

## 🙏 Acknowledgments

- Design inspired by modern streetwear and minimalist aesthetics
- Built with industry-standard technologies
- Community-driven development
- Special thanks to all contributors

## 📞 Support

For support, email or open an issue on GitHub.

---

<div align="center">

**Kick It Up** - Where Passion Meets Authenticity in the World of Sneakers 👟

Made with ❤️ by Aditya Pawar

[⬆ Back to Top](#-kick-it-up---premium-sneaker-marketplace)

</div>
