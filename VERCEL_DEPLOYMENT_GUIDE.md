# Vercel Deployment Guide for Kick It Up

## Overview
This guide covers deploying your full-stack sneaker marketplace application:
- **Frontend (React + Vite)**: Deploy on Vercel
- **Backend (Spring Boot)**: Deploy on Railway/Render/Heroku
- **Database (MySQL)**: Use PlanetScale or Railway

## Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Deployment

1. **Create vercel.json in frontend folder:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Update frontend/vite.config.js:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

3. **Create .env.production in frontend:**

```env
VITE_API_URL=https://your-backend-url.railway.app
```

4. **Update axios configuration in frontend/src/context/AuthContext.jsx:**

```javascript
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from frontend folder:**
```bash
cd frontend
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? kick-it-up
   - Directory? ./
   - Override settings? No

5. **Set environment variables:**
```bash
vercel env add VITE_API_URL production
# Enter your backend URL when prompted
```

6. **Deploy to production:**
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: Your backend URL (add after deploying backend)

6. **Click "Deploy"**

## Part 2: Deploy Backend (Spring Boot)

### Option A: Railway (Recommended)

#### Step 1: Prepare Backend

1. **Create Procfile in backend folder:**
```
web: java -jar build/libs/demo-0.0.1-SNAPSHOT.jar --server.port=$PORT
```

2. **Update application.properties:**
```properties
# Use environment variables
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# Production settings
server.port=${PORT:8080}
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false

# CORS for Vercel
cors.allowed.origins=${FRONTEND_URL:http://localhost:5173}
```

3. **Add CORS configuration (backend/src/main/java/com/example/demo/config/CorsConfig.java):**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**

2. **Sign up/Login with GitHub**

3. **Create New Project → Deploy from GitHub repo**

4. **Select your repository**

5. **Add MySQL Database:**
   - Click "New" → "Database" → "MySQL"
   - Railway will provide connection details

6. **Configure Backend Service:**
   - Root Directory: `backend`
   - Build Command: `./gradlew build -x test`
   - Start Command: `java -jar build/libs/demo-0.0.1-SNAPSHOT.jar`

7. **Add Environment Variables:**
```
DATABASE_URL=jdbc:mysql://[host]:[port]/railway
DB_USERNAME=[from Railway]
DB_PASSWORD=[from Railway]
FRONTEND_URL=https://your-app.vercel.app
PORT=8080
JWT_SECRET=your-secret-key-here
```

8. **Deploy!**

### Option B: Render

1. **Go to [render.com](https://render.com)**

2. **Create New Web Service**

3. **Connect GitHub repository**

4. **Configure:**
   - Name: kick-it-up-backend
   - Environment: Java
   - Build Command: `./gradlew build -x test`
   - Start Command: `java -jar build/libs/demo-0.0.1-SNAPSHOT.jar`

5. **Add PostgreSQL Database** (Render doesn't support MySQL, use PlanetScale for MySQL)

6. **Add Environment Variables** (same as Railway)

## Part 3: Database Setup

### Option A: PlanetScale (MySQL - Recommended)

1. **Go to [planetscale.com](https://planetscale.com)**

2. **Create new database: `kick-it-up`**

3. **Get connection string**

4. **Run schema:**
   - Use PlanetScale CLI or web console
   - Execute your `schema.sql` file
   - Execute your `data.sql` file

5. **Update backend environment variables with PlanetScale credentials**

### Option B: Railway MySQL

1. **Already created in Railway setup**

2. **Connect to database:**
```bash
mysql -h [host] -u [user] -p[password] railway
```

3. **Run schema:**
```bash
mysql -h [host] -u [user] -p[password] railway < backend/src/main/resources/schema.sql
mysql -h [host] -u [user] -p[password] railway < backend/src/main/resources/data.sql
```

## Part 4: Connect Frontend to Backend

1. **Get your backend URL from Railway/Render**
   - Example: `https://kick-it-up-backend.railway.app`

2. **Update Vercel environment variable:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `VITE_API_URL` with your backend URL

3. **Redeploy frontend:**
```bash
vercel --prod
```

Or trigger redeploy from Vercel dashboard

## Part 5: Testing Deployment

1. **Test Backend:**
```bash
curl https://your-backend-url.railway.app/api/sneakers/all
```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try logging in
   - Create a sneaker
   - Check all features work

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend includes your Vercel URL
- Check CORS configuration allows your frontend domain

### Database Connection Issues
- Verify DATABASE_URL format is correct
- Check database credentials
- Ensure database is accessible from backend host

### Build Failures
**Frontend:**
- Check all dependencies are in package.json
- Ensure build command is correct
- Check for TypeScript errors

**Backend:**
- Ensure Gradle wrapper is committed
- Check Java version compatibility
- Verify all dependencies are available

### Environment Variables Not Working
- Restart the service after adding variables
- Check variable names match exactly
- Ensure no trailing spaces in values

## Cost Breakdown

### Free Tier Options:
- **Vercel**: Free for personal projects
- **Railway**: $5/month credit (enough for small apps)
- **Render**: Free tier available (with limitations)
- **PlanetScale**: Free tier (1 database, 5GB storage)

### Recommended Setup (Free):
- Frontend: Vercel (Free)
- Backend: Railway ($5 credit/month)
- Database: PlanetScale (Free tier)

## Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Add Custom Domain to Railway:
1. Go to Service Settings → Networking
2. Add custom domain
3. Update DNS records

## Continuous Deployment

Both Vercel and Railway support automatic deployments:
- Push to `main` branch → Auto deploy
- Pull requests → Preview deployments
- Rollback available from dashboard

## Security Checklist

- [ ] Change JWT secret in production
- [ ] Use strong database passwords
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set up proper CORS origins
- [ ] Don't commit .env files
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring/logging

## Monitoring

### Vercel:
- Analytics available in dashboard
- Real-time logs
- Performance metrics

### Railway:
- Logs available in dashboard
- Metrics and usage tracking
- Alerts for downtime

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain
3. Set up database backups
4. Add error tracking (Sentry)
5. Set up CI/CD pipeline
6. Add performance monitoring

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- PlanetScale Docs: https://planetscale.com/docs

---

**Your app will be live at:**
- Frontend: `https://kick-it-up.vercel.app`
- Backend: `https://kick-it-up-backend.railway.app`

🎉 Happy Deploying!
