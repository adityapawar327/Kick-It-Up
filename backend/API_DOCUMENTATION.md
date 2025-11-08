# Sneaker Store API Documentation

## Overview
A complete e-commerce backend for a sneaker marketplace where users can list, buy, and manage sneaker sales with reviews, favorites, and seller dashboard.

## Database Setup (XAMPP MySQL)
1. Start XAMPP and ensure MySQL is running on port 3306
2. The database `sneaker_store` will be created automatically
3. Default credentials: username=`root`, password=`` (empty)

## Running the Application
```bash
.\gradlew.bat bootRun
```

## API Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

---

### 👤 User Profile Management

#### Get Current User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "newemail@example.com",
  "phoneNumber": "9876543210",
  "address": "456 New Street"
}
```

#### Change Password
```http
POST /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

#### Get User by ID (Public)
```http
GET /api/users/{id}
```

---

### 👟 Sneakers

#### Create Sneaker Listing
```http
POST /api/sneakers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Air Jordan 1 Retro High",
  "brand": "Nike",
  "description": "Classic Air Jordan 1 in excellent condition",
  "price": 250.00,
  "size": "10",
  "color": "Black/Red",
  "condition": "New",
  "stock": 1,
  "imageUrls": ["https://example.com/image1.jpg"]
}
```

#### Get All Sneakers (Public)
```http
GET /api/sneakers/all
```

#### Get Available Sneakers
```http
GET /api/sneakers/available
Authorization: Bearer {token}
```

#### Get Sneaker by ID (Public)
```http
GET /api/sneakers/{id}
```

#### Get My Sneaker Listings
```http
GET /api/sneakers/my-sneakers
Authorization: Bearer {token}
```

#### Update Sneaker
```http
PUT /api/sneakers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Air Jordan 1 Retro High",
  "brand": "Nike",
  "description": "Updated description",
  "price": 275.00,
  "size": "10",
  "color": "Black/Red",
  "condition": "New",
  "stock": 1
}
```

#### Delete Sneaker
```http
DELETE /api/sneakers/{id}
Authorization: Bearer {token}
```

#### Search by Brand (Public)
```http
GET /api/sneakers/search/brand?brand=Nike
```

#### Search by Name (Public)
```http
GET /api/sneakers/search/name?name=Jordan
```

---

### 🛒 Orders

#### Create Order (Buy Sneaker)
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "sneakerId": 1,
  "shippingAddress": "123 Main St, City, State 12345",
  "phoneNumber": "1234567890"
}
```

#### Get My Orders (Buyer)
```http
GET /api/orders/my-orders
Authorization: Bearer {token}
```

#### Get Order by ID
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

#### Update Order Status
```http
PATCH /api/orders/{id}/status?status=SHIPPED
Authorization: Bearer {token}
```

**Order Statuses:** `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

### ⭐ Reviews & Ratings

#### Create Review
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "sneakerId": 1,
  "rating": 5,
  "comment": "Excellent sneakers, highly recommend!"
}
```

#### Get Reviews for Sneaker (Public)
```http
GET /api/reviews/sneaker/{sneakerId}
```

#### Get My Reviews
```http
GET /api/reviews/my-reviews
Authorization: Bearer {token}
```

#### Delete Review
```http
DELETE /api/reviews/{id}
Authorization: Bearer {token}
```

---

### ❤️ Favorites / Wishlist

#### Add to Favorites
```http
POST /api/favorites/{sneakerId}
Authorization: Bearer {token}
```

#### Get My Favorites
```http
GET /api/favorites
Authorization: Bearer {token}
```

#### Remove from Favorites
```http
DELETE /api/favorites/{sneakerId}
Authorization: Bearer {token}
```

#### Check if Sneaker is Favorite
```http
GET /api/favorites/{sneakerId}/check
Authorization: Bearer {token}

Response: { "isFavorite": true }
```

---

### 📊 Seller Dashboard

#### Get Seller Statistics
```http
GET /api/dashboard/seller/stats
Authorization: Bearer {token}

Response: {
  "totalListings": 10,
  "activeSneakers": 7,
  "soldSneakers": 3,
  "totalOrders": 15,
  "pendingOrders": 2,
  "totalRevenue": 3750.00
}
```

#### Get Seller Orders
```http
GET /api/dashboard/seller/orders
Authorization: Bearer {token}
```

---

## Complete Features

### Core Features
✅ User authentication with JWT
✅ User profile management
✅ Password change functionality
✅ Sneaker listing management (CRUD)
✅ Order processing & tracking
✅ Stock management
✅ Search functionality (brand/name)

### Advanced Features
✅ Reviews & ratings system
✅ Favorites/wishlist functionality
✅ Seller dashboard with statistics
✅ Order status tracking
✅ Image URL storage
✅ Automatic database schema creation

### Security
✅ JWT-based authentication
✅ Password encryption (BCrypt)
✅ Role-based access control
✅ Protected and public endpoints

## Tech Stack
- Spring Boot 3.3.5
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Bean Validation
- Java 21

## Database Tables
- `users` - User accounts
- `sneakers` - Sneaker listings
- `orders` - Purchase orders
- `reviews` - Product reviews
- `favorites` - User wishlist
- `user_roles` - User permissions
- `sneaker_images` - Product images
