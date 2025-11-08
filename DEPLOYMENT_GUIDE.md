# Kick It Up - Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Node.js 16+ and npm
- XAMPP with MySQL running
- Git (optional)

### 1. Database Setup

**Option A: Automatic (Recommended)**
```bash
cd backend
init-database.bat
```

**Option B: Manual via phpMyAdmin**
1. Open http://localhost/phpmyadmin
2. Create database: `sneaker_store`
3. Import `backend/src/main/resources/schema.sql`

### 2. Backend Setup

```bash
cd backend
gradlew.bat bootRun
```

Backend will run on: http://localhost:8080

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:3000

## 📋 Production Checklist

### Security
- [ ] Change JWT secret in `application.properties`
- [ ] Set MySQL password (don't use root with no password)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly (restrict origins)
- [ ] Add rate limiting
- [ ] Enable SQL injection protection (already configured)
- [ ] Add input validation (already configured)

### Database
- [ ] Set up regular backups
- [ ] Configure connection pooling
- [ ] Add database indexes (already included)
- [ ] Monitor query performance
- [ ] Set up replication for high availability

### Application
- [ ] Set `spring.jpa.show-sql=false`
- [ ] Configure logging levels
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add health check endpoints
- [ ] Configure session management
- [ ] Set up CDN for static assets

### Frontend
- [ ] Build for production: `npm run build`
- [ ] Configure environment variables
- [ ] Enable gzip compression
- [ ] Add analytics
- [ ] Set up error tracking
- [ ] Optimize images

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/sneaker_store
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT (CHANGE THIS!)
jwt.secret=your-very-long-and-secure-secret-key-here
jwt.expiration=86400000

# Server
server.port=8080
```

### Frontend Configuration
Edit `frontend/vite.config.js` for production API URL:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://your-production-api.com',
        changeOrigin: true
      }
    }
  }
})
```

## 🏗️ Building for Production

### Backend
```bash
cd backend
gradlew.bat build
java -jar build/libs/demo-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

Deploy the `dist` folder to your web server (Nginx, Apache, etc.)

## 🐳 Docker Deployment (Optional)

### Backend Dockerfile
```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sneaker_store
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/sneaker_store
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

## 🔍 Monitoring

### Health Check Endpoints
- Backend: http://localhost:8080/actuator/health (add Spring Actuator)
- Database: Check connection pool metrics

### Logging
- Backend logs: `logs/spring-boot-application.log`
- Frontend: Browser console and error tracking service

## 🚨 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials
- Check port 8080 is not in use
- Review logs in console

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration
- Verify proxy settings in vite.config.js

### Database connection errors
- Ensure MySQL is running in XAMPP
- Check username/password in application.properties
- Verify database `sneaker_store` exists
- Check firewall settings

### SQL syntax errors
- Run `init-database.bat` to recreate tables
- Check MySQL version compatibility
- Verify schema.sql executed successfully

## 📊 Performance Optimization

### Backend
- Enable caching (Redis)
- Use connection pooling (HikariCP - already configured)
- Add database indexes (already included)
- Implement pagination for large datasets
- Use async processing for heavy operations

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Enable browser caching
- Use CDN for static assets

### Database
- Regular VACUUM/OPTIMIZE
- Monitor slow queries
- Add appropriate indexes
- Configure query cache
- Use read replicas for scaling

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **SQL Injection Protection**
   - Use JPA/Hibernate (already configured)
   - Never concatenate SQL strings

3. **XSS Protection**
   - Sanitize user inputs
   - Use React's built-in XSS protection

4. **CSRF Protection**
   - Enable Spring Security CSRF (configure for production)

5. **Authentication**
   - Use strong JWT secrets
   - Implement token refresh
   - Add rate limiting on login

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs
3. Check database connectivity
4. Verify all services are running

## 📝 License

This project is for educational purposes.
