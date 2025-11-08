# Quick Start Guide - Sneaker Store API

## Prerequisites
✅ XAMPP MySQL running on port 3306
✅ Application running on port 8080

## Test the API (Using Postman, cURL, or any HTTP client)

### Step 1: Register a User
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "seller1",
  "email": "seller1@example.com",
  "password": "password123",
  "fullName": "John Seller",
  "phoneNumber": "1234567890",
  "address": "123 Main St"
}
```

**Save the token from response!**

---

### Step 2: Create a Sneaker Listing
```bash
POST http://localhost:8080/api/sneakers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Air Jordan 1 Retro High",
  "brand": "Nike",
  "description": "Classic Air Jordan 1 in Chicago colorway. Brand new with box.",
  "price": 250.00,
  "size": "10",
  "color": "Black/Red/White",
  "condition": "New",
  "stock": 2,
  "imageUrls": [
    "https://example.com/jordan1-front.jpg",
    "https://example.com/jordan1-side.jpg"
  ]
}
```

---

### Step 3: Browse All Sneakers (No Auth Required)
```bash
GET http://localhost:8080/api/sneakers/all
```

---

### Step 4: Register a Buyer
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "buyer1",
  "email": "buyer1@example.com",
  "password": "password123",
  "fullName": "Jane Buyer",
  "phoneNumber": "9876543210",
  "address": "456 Oak Ave"
}
```

**Save the buyer token!**

---

### Step 5: Add to Favorites
```bash
POST http://localhost:8080/api/favorites/1
Authorization: Bearer BUYER_TOKEN_HERE
```

---

### Step 6: Create an Order
```bash
POST http://localhost:8080/api/orders
Authorization: Bearer BUYER_TOKEN_HERE
Content-Type: application/json

{
  "sneakerId": 1,
  "shippingAddress": "456 Oak Ave, City, State 12345",
  "phoneNumber": "9876543210"
}
```

---

### Step 7: Leave a Review
```bash
POST http://localhost:8080/api/reviews
Authorization: Bearer BUYER_TOKEN_HERE
Content-Type: application/json

{
  "sneakerId": 1,
  "rating": 5,
  "comment": "Amazing sneakers! Fast shipping and great quality."
}
```

---

### Step 8: Check Seller Dashboard
```bash
GET http://localhost:8080/api/dashboard/seller/stats
Authorization: Bearer SELLER_TOKEN_HERE
```

**Response:**
```json
{
  "totalListings": 1,
  "activeSneakers": 1,
  "soldSneakers": 0,
  "totalOrders": 1,
  "pendingOrders": 1,
  "totalRevenue": 250.00
}
```

---

### Step 9: View My Orders (Buyer)
```bash
GET http://localhost:8080/api/orders/my-orders
Authorization: Bearer BUYER_TOKEN_HERE
```

---

### Step 10: Update Order Status (Seller)
```bash
PATCH http://localhost:8080/api/orders/1/status?status=SHIPPED
Authorization: Bearer SELLER_TOKEN_HERE
```

---

## Common Use Cases

### Search Sneakers
```bash
# By brand
GET http://localhost:8080/api/sneakers/search/brand?brand=Nike

# By name
GET http://localhost:8080/api/sneakers/search/name?name=Jordan
```

### Update Profile
```bash
PUT http://localhost:8080/api/users/profile
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullName": "Updated Name",
  "phoneNumber": "1112223333"
}
```

### Change Password
```bash
POST http://localhost:8080/api/users/change-password
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### Get My Favorites
```bash
GET http://localhost:8080/api/favorites
Authorization: Bearer YOUR_TOKEN
```

### Get Reviews for a Sneaker
```bash
GET http://localhost:8080/api/reviews/sneaker/1
```

---

## Testing Flow

1. **Seller Flow:**
   - Register → Login → Create Sneaker → View Dashboard → Manage Orders

2. **Buyer Flow:**
   - Register → Login → Browse Sneakers → Add to Favorites → Create Order → Leave Review

3. **Public Flow:**
   - Browse All Sneakers → Search → View Sneaker Details → View Reviews

---

## Error Handling

All errors return JSON with error messages:
```json
{
  "error": "Error message here"
}
```

Validation errors return field-specific messages:
```json
{
  "name": "Name is required",
  "price": "Price must be greater than 0"
}
```

---

## Tips

- Always include `Authorization: Bearer {token}` header for protected endpoints
- Token expires after 24 hours (86400000 ms)
- Stock automatically decreases when order is created
- Sneaker status changes to SOLD when stock reaches 0
- Users can only review sneakers once
- Users can only update/delete their own listings and reviews
