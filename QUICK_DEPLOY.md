# Quick Deploy Guide

## 🚀 Deploy in 15 Minutes

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free $5 credit)

### Step 1: Deploy Backend (5 minutes)

1. **Go to [railway.app](https://railway.app) and login**

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your `Kick-It-Up` repository**

4. **Add MySQL Database:**
   - Click "+ New" → "Database" → "MySQL"
   - Wait for it to provision

5. **Configure Backend Service:**
   - Click on your service
   - Settings → Root Directory: `backend`
   - Settings → Build Command: `./gradlew build -x test`
   - Settings → Start Command: `java -Dserver.port=$PORT -jar build/libs/demo-0.0.1-SNAPSHOT.jar`

6. **Add Environment Variables:**
   Click "Variables" tab and add:
   ```
   DATABASE_URL = mysql://[copy from MySQL service]
   DB_USERNAME = [copy from MySQL service]
   DB_PASSWORD = [copy from MySQL service]
   JWT_SECRET = your-secret-key-change-this-in-production
   FRONTEND_URL = http://localhost:5173
   ```

7. **Deploy and copy the URL** (e.g., `https://kick-it-up-backend.up.railway.app`)

8. **Set up database:**
   - Click on MySQL service → "Connect"
   - Use the provided connection command
   - Run your schema.sql and data.sql files

### Step 2: Deploy Frontend (5 minutes)

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Click "Add New Project"**

3. **Import your GitHub repository**

4. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variable:**
   ```
   VITE_API_URL = [your Railway backend URL from Step 1]
   ```

6. **Click "Deploy"**

7. **Wait for deployment** (2-3 minutes)

8. **Copy your Vercel URL** (e.g., `https://kick-it-up.vercel.app`)

### Step 3: Update CORS (2 minutes)

1. **Go back to Railway**

2. **Update FRONTEND_URL variable:**
   ```
   FRONTEND_URL = https://kick-it-up.vercel.app
   ```

3. **Redeploy backend** (it will restart automatically)

### Step 4: Test (3 minutes)

1. **Visit your Vercel URL**

2. **Test the app:**
   - Register a new account
   - Login
   - Create a sneaker listing
   - Browse sneakers
   - Test all features

### ✅ Done!

Your app is now live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **Database**: Hosted on Railway

## Troubleshooting

### "Cannot connect to backend"
- Check VITE_API_URL in Vercel environment variables
- Ensure backend is running on Railway
- Check CORS settings in backend

### "Database connection failed"
- Verify DATABASE_URL, DB_USERNAME, DB_PASSWORD in Railway
- Check if MySQL service is running
- Ensure schema.sql was executed

### "Build failed"
**Frontend:**
- Check package.json has all dependencies
- Ensure no TypeScript errors
- Check build logs in Vercel

**Backend:**
- Ensure gradlew is executable
- Check Java version (should be 17+)
- Check build logs in Railway

## Free Tier Limits

**Vercel:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS

**Railway:**
- ✅ $5 credit/month (enough for small apps)
- ✅ 500 hours/month
- ✅ Automatic HTTPS

## Next Steps

1. ✅ Add custom domain
2. ✅ Set up monitoring
3. ✅ Enable database backups
4. ✅ Add error tracking
5. ✅ Set up CI/CD

## Need Help?

Check the full [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.
