# Sneaker Store Frontend

A modern, beautiful React frontend for the Sneaker Store marketplace built with Vite, React, and Tailwind CSS.

## Features

- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔐 User authentication (Login/Register)
- 🏠 Browse and search sneakers
- 👟 Detailed sneaker pages with reviews
- ❤️ Favorites system
- 🛒 Order management
- 📊 Seller dashboard with statistics
- 📝 Create and manage sneaker listings
- 👤 User profile management
- ⭐ Rating and review system

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running on http://localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Navbar.jsx
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── SneakerDetails.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateSneaker.jsx
│   │   ├── Favorites.jsx
│   │   ├── MyOrders.jsx
│   │   └── Profile.jsx
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Features Overview

### Home Page
- Hero section with search
- Grid of available sneakers
- Filter by brand/name
- Responsive design

### Authentication
- Beautiful login/register forms
- JWT token management
- Protected routes

### Sneaker Details
- Image gallery
- Detailed information
- Reviews and ratings
- Add to favorites
- Quick order form

### Dashboard (Seller)
- Sales statistics
- Order management
- Update order status
- Revenue tracking

### User Features
- Manage favorites
- Track orders
- Update profile
- Change password

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api`. All API calls are proxied through Vite's dev server.

## Styling

The app uses Tailwind CSS with custom utility classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container with shadow
- `.input-field` - Styled input fields

## Color Scheme

- Primary: Blue (#2563eb)
- Secondary: Dark slate (#1e293b)
- Background: Gray (#f9fafb)

## Contributing

Feel free to submit issues and enhancement requests!
