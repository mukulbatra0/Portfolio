# 🚀 Backend API Setup Guide

This guide will help you set up the backend API for your portfolio contact form.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Gmail Account** - For sending emails (with App Password enabled)

## 🛠️ Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run setup script:**
   ```bash
   npm run setup
   ```
   
   This interactive script will:
   - Configure your email settings
   - Set up database connection
   - Generate security keys
   - Create the `.env` file

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your settings:**
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/portfolio
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 📧 Gmail Setup (Required)

To send emails, you need to set up Gmail with an App Password:

1. **Go to Google Account Settings:**
   - Visit [Google Account Security](https://myaccount.google.com/security)

2. **Enable 2-Step Verification:**
   - Follow the prompts to enable 2FA

3. **Generate App Password:**
   - Go to "App passwords" section
   - Select "Mail" as the app
   - Copy the generated 16-character password

4. **Update .env file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## 🗄️ Database Setup

### Option A: Local MongoDB

1. **Install MongoDB:**
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)

2. **Start MongoDB:**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

3. **Use in .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Cluster:**
   - Follow the setup wizard
   - Choose the free tier

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update .env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

## 🧪 Testing the API

1. **Check if server is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Test contact form submission:**
   ```bash
   curl -X POST http://localhost:5000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "personalInfo": {
         "name": "Test User",
         "email": "test@example.com"
       },
       "projectInfo": {
         "type": "web-development",
         "description": "Test project description"
       }
     }'
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Thank you for your message! I'll get back to you within 24 hours.",
     "data": {
       "id": "...",
       "submittedAt": "...",
       "status": "new"
     }
   }
   ```

## 🔧 Frontend Integration

Update your frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend will now send real messages to your backend!

## 🚀 Deployment Options

### Option 1: Simple VPS Deployment

1. **Upload files to server:**
   ```bash
   scp -r backend/ user@your-server:/path/to/app/
   ```

2. **Install dependencies:**
   ```bash
   cd /path/to/app/backend
   npm install --production
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "portfolio-api"
   pm2 startup
   pm2 save
   ```

### Option 2: Docker Deployment

1. **Build and run with Docker:**
   ```bash
   cd backend
   npm run docker:compose
   ```

2. **Or build manually:**
   ```bash
   docker build -t portfolio-backend .
   docker run -p 5000:5000 --env-file .env portfolio-backend
   ```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
heroku create your-portfolio-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-app-password
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
railway login
railway new
railway add
railway deploy
```

## 🔒 Security Checklist

- [ ] Use strong JWT secret (generated automatically)
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Monitor rate limiting logs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication in production

## 📊 Monitoring

### Health Checks
- Basic: `GET /api/health`
- Detailed: `GET /api/health/detailed`
- Ping: `GET /api/health/ping`

### Logs
The API logs important events:
- Contact form submissions
- Email sending status
- Database connections
- Errors and warnings

### Admin Endpoints
- View contacts: `GET /api/contact`
- Contact stats: `GET /api/contact/stats/summary`
- Update status: `PUT /api/contact/:id/status`

## 🆘 Troubleshooting

### Common Issues

**1. "Email not sending"**
- Check Gmail App Password setup
- Verify EMAIL_USER and EMAIL_PASS in .env
- Check `/api/health/detailed` for email status

**2. "Database connection failed"**
- Ensure MongoDB is running (local) or accessible (Atlas)
- Check MONGODB_URI format
- Verify network connectivity

**3. "CORS errors from frontend"**
- Update FRONTEND_URL in .env
- Ensure frontend is running on correct port

**4. "Rate limiting errors"**
- Check if you're making too many requests
- Adjust rate limits in server.js if needed

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

### Getting Help
- Check server logs: `npm run dev`
- Test API health: `curl http://localhost:5000/api/health/detailed`
- Verify environment variables are loaded correctly

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/portfolio` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Your email | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `16-character-password` |
| `EMAIL_FROM` | From address | `your-email@gmail.com` |
| `EMAIL_TO` | Admin email | `your-email@gmail.com` |
| `JWT_SECRET` | JWT signing key | `random-secret-key` |
| `FRONTEND_URL` | Frontend domain | `http://localhost:5173` |

## 🎉 Success!

Once everything is set up, you should see:

```
🚀 Server running on port 5000 in development mode
📦 MongoDB Connected: localhost:27017
📧 Email configuration verified successfully
```

Your contact form will now send real emails and store submissions in the database!

## 📞 Support

If you need help:
- Email: mukulbatra5911@gmail.com
- Check the logs for error details
- Verify all environment variables are set correctly