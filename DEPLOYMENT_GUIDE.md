# 🚀 Deployment Guide

This guide covers deploying both the frontend and backend of your portfolio project.

## 📋 Pre-Deployment Checklist

- [ ] Test the build locally: `npm run build && npm run preview`
- [ ] Update environment variables for production
- [ ] Set up backend hosting (if using contact form)
- [ ] Configure domain and SSL certificates
- [ ] Test all functionality in production environment

## 🎯 Frontend Deployment Options

### Option 1: Netlify (Recommended for Static Sites)

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_NODE_ENV=production
   ```

4. **Custom Domain (Optional):**
   - Go to Domain settings
   - Add your custom domain
   - Configure DNS records

### Option 2: Vercel

1. **Deploy with Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel --prod`
   - Or connect via [Vercel Dashboard](https://vercel.com)

2. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_NODE_ENV=production
   ```

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/repository-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Connect Repository:**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo
   - Select the `backend` folder

2. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   FRONTEND_URL=https://your-frontend-domain.com
   JWT_SECRET=your-jwt-secret
   ```

3. **Deploy:**
   - Railway auto-deploys on git push
   - Get your backend URL from Railway dashboard

### Option 2: Render

1. **Create Web Service:**
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect your repository

2. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   - Add all required environment variables
   - Use Render's built-in MongoDB if needed

### Option 3: Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create app and deploy:**
   ```bash
   cd backend
   heroku create your-portfolio-api
   git subtree push --prefix backend heroku main
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-atlas-uri
   heroku config:set EMAIL_USER=your-email
   heroku config:set EMAIL_PASS=your-app-password
   ```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster

2. **Configure Access:**
   - Add IP whitelist (0.0.0.0/0 for all IPs)
   - Create database user
   - Get connection string

3. **Update Environment:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

## 📧 Email Configuration

1. **Gmail App Password:**
   - Enable 2FA on Gmail
   - Generate App Password
   - Use in EMAIL_PASS environment variable

2. **Alternative Email Services:**
   - SendGrid
   - Mailgun
   - AWS SES

## 🔄 Complete Deployment Process

### Step 1: Deploy Backend First

1. Choose backend hosting (Railway/Render/Heroku)
2. Set up MongoDB Atlas
3. Configure email settings
4. Deploy and test API endpoints
5. Note down your backend URL

### Step 2: Update Frontend Configuration

1. Update `.env` with production backend URL:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

2. Test locally:
   ```bash
   npm run build
   npm run preview
   ```

### Step 3: Deploy Frontend

1. Choose frontend hosting (Netlify/Vercel/GitHub Pages)
2. Set environment variables
3. Deploy and test

### Step 4: Configure Custom Domain (Optional)

1. **For Frontend:**
   - Add custom domain in hosting provider
   - Update DNS records
   - Enable SSL

2. **For Backend:**
   - Add custom domain if supported
   - Update CORS settings
   - Update frontend API URL

## 🧪 Testing Deployment

### Frontend Tests:
- [ ] Site loads correctly
- [ ] All animations work
- [ ] Images load properly
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Contact form submits

### Backend Tests:
- [ ] Health endpoint: `GET /api/health`
- [ ] Contact form: `POST /api/contact`
- [ ] CORS headers correct
- [ ] Rate limiting works
- [ ] Email sending works

### Integration Tests:
- [ ] Frontend can reach backend
- [ ] Contact form end-to-end
- [ ] Error handling works
- [ ] Performance is acceptable

## 🔒 Security Checklist

- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables secured
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] No sensitive data in client-side code
- [ ] Database access restricted
- [ ] Email credentials secured

## 📊 Performance Optimization

### Frontend:
- [ ] Images optimized and compressed
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] CDN for static assets
- [ ] Gzip compression enabled

### Backend:
- [ ] Database queries optimized
- [ ] Response compression enabled
- [ ] Caching headers set
- [ ] Connection pooling configured
- [ ] Error logging implemented

## 🚨 Troubleshooting

### Common Issues:

**1. "API calls failing"**
- Check CORS configuration
- Verify API URL in frontend
- Check network tab for errors

**2. "Build failing"**
- Check Node.js version compatibility
- Verify all dependencies installed
- Check for TypeScript/ESLint errors

**3. "Contact form not working"**
- Test backend API directly
- Check email configuration
- Verify database connection

**4. "Images not loading"**
- Check image paths and formats
- Verify images are in public folder
- Check build output includes images

## 📞 Support

If you encounter issues:
- Check hosting provider logs
- Test API endpoints directly
- Verify environment variables
- Check browser console for errors

## 🎉 Success!

Once deployed, your portfolio will be live at:
- **Frontend**: `https://your-domain.com`
- **Backend**: `https://your-api-domain.com`

Remember to:
- Monitor performance and errors
- Keep dependencies updated
- Backup your database regularly
- Monitor hosting costs and usage