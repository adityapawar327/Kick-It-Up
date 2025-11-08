# 👟 Kick It Up - The Perfect Place to Trade and Elevate Your Sneakers

A modern, production-ready sneaker marketplace built with Spring Boot and React featuring a bold, minimalist design inspired by streetwear aesthetics.

![Kick It Up](https://img.shields.io/badge/Status-Active-success)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## ✨ Features

### 🛍️ Core Functionality
- **Browse & Search** - Explore sneakers with advanced filtering
- **User Authentication** - Secure JWT-based authentication
- **Buy & Sell** - Complete marketplace functionality
- **Order Management** - Track orders with status updates
- **Reviews & Ratings** - Community-driven product reviews
- **Favorites** - Save sneakers for later
- **Seller Dashboard** - Manage your listings and sales

### 🎨 Design
- **Bold Typography** - Bebas Neue display font
- **Minimalist UI** - Clean black and white aesthetic
- **Smooth Animations** - Professional entrance effects
- **Responsive Design** - Works on all devices
- **Toast Notifications** - Beautiful feedback system

### 🔒 Security
- JWT token authentication
- Password encryption with BCrypt
- Protected API endpoints
- CORS configuration
- Input validation

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/adityapawar327/Kick-It-Up.git
cd Kick-It-Up
```

2. **Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE sneaker_store;
exit;

# Run schema
mysql -u root -p sneaker_store < backend/src/main/resources/schema.sql

# Load sample data (optional)
mysql -u root -p sneaker_store < backend/src/main/resources/data.sql
```

3. **Configure Backend**
```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your database credentials and JWT secret
```

4. **Start Backend**
```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

5. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 📁 Project Structure

```
Kick-It-Up/
├── backend/                 # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/demo/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── dto/
│   │   │   │       ├── config/
│   │   │   │       └── exception/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── schema.sql
│   │   │       └── data.sql
│   └── build.gradle
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Build Tool**: Gradle
- **Java Version**: 17

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router DOM 6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Fonts**: Bebas Neue, Inter

## 🔑 Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YOUR_SECRET_KEY
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sneakers
- `GET /api/sneakers/all` - Get all sneakers
- `GET /api/sneakers/{id}` - Get sneaker details
- `POST /api/sneakers` - Create sneaker (Auth required)
- `PUT /api/sneakers/{id}` - Update sneaker (Auth required)
- `DELETE /api/sneakers/{id}` - Delete sneaker (Auth required)

### Orders
- `GET /api/orders/my-orders` - Get user orders (Auth required)
- `POST /api/orders` - Create order (Auth required)

### Reviews
- `GET /api/reviews/sneaker/{id}` - Get sneaker reviews
- `POST /api/reviews` - Create review (Auth required)

### Favorites
- `GET /api/favorites` - Get user favorites (Auth required)
- `POST /api/favorites/{id}` - Add to favorites (Auth required)
- `DELETE /api/favorites/{id}` - Remove from favorites (Auth required)

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Text**: Black on white backgrounds
- **Borders**: 2px solid black

### Typography
- **Display**: Bebas Neue (headings)
- **Body**: Inter (text)
- **Style**: Uppercase, wide letter-spacing

### Components
- Rounded-full buttons
- Bold borders
- Minimalist cards
- Smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aditya Pawar**
- GitHub: [@adityapawar327](https://github.com/adityapawar327)

## 🙏 Acknowledgments

- Design inspired by modern streetwear aesthetics
- Built with modern web technologies
- Community-driven development

---

**Kick It Up** - The Perfect Place to Trade and Elevate Your Sneakers 👟
