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
- **Shopping Cart** - Full cart functionality with add/remove items and quantity management
- **Buy & Sell** - Complete marketplace with secure transactions
- **Order Management** - Track orders with real-time status updates (Pending → Shipped → Delivered)
- **Reviews & Ratings** - Community-driven 5-star rating system
- **Favorites** - Save sneakers to your wishlist
- **Seller Dashboard** - Comprehensive analytics and order management
- **My Listings** - Manage your sneaker inventory with edit/delete capabilities
- **Trade System** - Propose and manage sneaker trades with other users

### 💬 Messaging System
- **Real-time Messaging** - Chat with buyers and sellers instantly
- **Media Messaging** - Send photos, videos, and audio messages
  - Photo sharing (JPEG, PNG, GIF, WebP)
  - Video sharing (MP4, WebM, OGG)
  - Audio messages (MP3, WAV, OGG)
  - File size limit: 10MB per file
- **Unread Notifications** - Badge counters on navbar and conversation list
- **Read Receipts** - Single check (✓) for sent, double check (✓✓) for read
- **Message Alignment** - Your messages on right, theirs on left
- **Conversation Management** - Search users, view conversation history
- **Auto-refresh** - Real-time message polling (3-5 second intervals)
- **Media Preview** - Preview files before sending
- **Click to Enlarge** - Open images in new tab
- **Inline Players** - Play videos and audio directly in chat

### 🤖 AI-Powered Features (Google Gemini)
- **AI Product Descriptions** - Generate compelling product descriptions automatically
- **AI Insights** - Get intelligent product recommendations and insights
- **Smart Content Generation** - AI-powered product information and suggestions
- **Natural Language Processing** - Advanced text generation for listings

### 💰 Currency & Payment
- **Multi-Currency Support** - Toggle between USD and INR
- **Real-time Exchange Rates** - Automatic currency conversion
- **Persistent Currency Preference** - Saves your currency choice
- **Multiple Payment Methods** - Cash on Delivery, UPI, Credit/Debit Card, Net Banking

### 👤 Enhanced User Profiles
- **Profile Image Upload** - Upload custom profile pictures (Base64, max 5MB)
- **Seller Mode Toggle** - Enable/disable seller capabilities with one click
- **About Me Section** - Add personal bio and description
- **Profile Customization** - Full control over your profile appearance
- **Seller Badge** - Visual indicator for active sellers

### 🎨 Design & UX
- **HOODIE Theme** - Bold black and white minimalist aesthetic
- **Bebas Neue Typography** - Professional display font for headings
- **Smooth Animations** - Entrance effects, hover states, and transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Custom Dialogs** - Themed confirmation dialogs and toast notifications
- **About Us Page** - Company information, values, and team details
- **Image Hover Effects** - Auto-sliding image gallery with depth effects

### 🛒 Advanced Shopping Experience
- **Enhanced Checkout** - Comprehensive checkout flow with receiver details
- **GPS Location** - Auto-fill shipping address using geolocation
- **Order Tracking** - Real-time order status updates
- **Cart Persistence** - Cart items saved across sessions
- **Quantity Management** - Adjust quantities directly in cart

### 🔒 Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt hashing for user passwords
- **Protected Routes** - Role-based access control
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Server-side and client-side validation
- **Hibernate Proxy Fix** - Proper JSON serialization with Jackson annotations

### 🛡️ Advanced Security Features
- **XSS Prevention** - HTML tag stripping and script removal
- **SQL Injection Protection** - Pattern detection and parameterized queries
- **Rate Limiting** - 10 messages per minute to prevent spam
- **Content Sanitization** - Remove dangerous characters and control codes
- **File Validation** - Type and size checks for media uploads
- **Secure Error Messages** - No sensitive data in client responses
- **Comprehensive Logging** - Security event tracking and audit trails
- **Database Indexes** - Optimized queries for performance
- **Triple-check ID Comparison** - Reliable message ownership verification

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

**Using XAMPP (Recommended):**
- Start XAMPP MySQL service
- That's it! The application will automatically create the database and tables on first run

**Using MySQL:**
- Just ensure MySQL is running on port 3306
- The application will automatically create the database and tables on first run

**Note:** The database schema is managed automatically by Hibernate. Your data is preserved across restarts.

#### 3. Configure Backend (Optional)

If you need to change database credentials, edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

**Note:** Default configuration works with XAMPP out of the box.

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

Frontend will start on: http://localhost:3000

#### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **First Time**: Register a new account to get started

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
│   │   │   ├── Favorite.java
│   │   │   ├── Message.java         # NEW: Messaging
│   │   │   └── Trade.java           # NEW: Trade system
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
│   │   │   ├── Profile.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Messages.jsx         # NEW: Messaging
│   │   │   ├── TradeRequests.jsx    # NEW: Trade management
│   │   │   └── ProposeTrade.jsx     # NEW: Trade proposal
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   ├── CartContext.jsx      # NEW: Cart management
│   │   │   └── CurrencyContext.jsx  # NEW: Currency switching
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
cors.allowed.origins=http://localhost:3000,https://your-frontend-url.vercel.app
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

## 📝 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### User Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/{id}` | Get user by ID | Yes |
| GET | `/api/users/search?username={username}` | Search user by username | Yes |
| GET | `/api/users/me` | Get current user | Yes |

### Message Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages/partners` | Get conversation partners | Yes |
| GET | `/api/messages/conversation/{userId}` | Get conversation with user | Yes |
| POST | `/api/messages` | Send message (text or media) | Yes |
| PATCH | `/api/messages/{id}/read` | Mark message as read | Yes |
| PATCH | `/api/messages/conversation/{userId}/read` | Mark conversation as read | Yes |
| GET | `/api/messages/unread-count` | Get total unread count | Yes |

### Trade Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/trades/my-trades` | Get user's trades | Yes |
| POST | `/api/trades` | Propose trade | Yes |
| PATCH | `/api/trades/{id}/status` | Update trade status | Yes |

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
6. Add items to cart
7. Complete checkout with receiver details
8. Place an order
9. Leave a review
10. Check dashboard statistics
11. Update order status
12. Edit/delete listings
13. Send text messages to sellers
14. Send photos/videos/audio in messages
15. Check unread message notifications
16. Propose a trade
17. Accept/reject trade requests
18. Toggle currency (USD/INR)
19. Update profile with image
20. Enable seller mode

### API Testing
Use the included `test-auth.http` file with REST Client extension in VS Code.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure MySQL is running (start XAMPP)
- Check credentials in `application.properties`
- Database will be created automatically on first run

**CORS Errors**
- Update `cors.allowed.origins` in `application.properties`
- Restart backend server

**Image Upload Not Working**
- Ensure the uploads directory exists
- Check file size limits in application.properties
- For media messages, max size is 10MB

**Messages Not Sending**
- Check backend logs for rate limiting (10 msg/min)
- Verify JWT token is valid
- Check file size for media messages

**Media Not Displaying**
- Ensure Base64 encoding is correct
- Check browser console for errors
- Verify media URL is properly stored

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
- **messages** - Chat messages with media support (NEW)
  - Columns: id, sender_id, receiver_id, content, message_type, media_url, media_file_name, media_mime_type, media_size, is_read, created_at
  - Indexes: sender_id, receiver_id, created_at, is_read, (sender_id, created_at)
- **trades** - Sneaker trade proposals (NEW)
  - Columns: id, proposer_id, receiver_id, offered_sneaker_id, requested_sneaker_id, status, created_at, updated_at

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
- Google Gemini AI for intelligent features
- Lucide React for beautiful icons
- Special thanks to all contributors

## 🔐 Security Best Practices

This application implements enterprise-grade security:

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **SQL Injection Prevention**: Parameterized queries and pattern detection
- **Rate Limiting**: Prevents spam and abuse (10 messages/minute)
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: BCrypt with salt for password storage
- **CORS Protection**: Configured allowed origins
- **File Validation**: Type and size checks for uploads
- **Error Handling**: Secure error messages without sensitive data
- **Logging**: Comprehensive security event tracking
- **Database Indexes**: Optimized for performance and security

For more details, see `.env.security.md` and `SECURITY_IMPROVEMENTS.md`

## 📞 Support

For support, email or open an issue on GitHub.

---

<div align="center">

**Kick It Up** - Where Passion Meets Authenticity in the World of Sneakers 👟

Made with ❤️ by Aditya Pawar

[⬆ Back to Top](#-kick-it-up---premium-sneaker-marketplace)

</div>
