# Portfolio Backend API

A robust Node.js/Express backend API for handling contact form submissions from Mukul Batra's portfolio website.

## 🚀 Features

- **Contact Form Processing**: Handles form submissions with validation
- **Email Notifications**: Sends emails to both admin and users
- **Database Storage**: Stores all contact submissions in MongoDB
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Robust error handling and logging
- **Health Checks**: API health monitoring endpoints
- **Security**: CORS, Helmet, and other security middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Gmail account with App Password (for email functionality)

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/portfolio
   
   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # Other settings...
   ```

4. **Set up Gmail App Password:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Generate an App Password for "Mail"
   - Use this App Password in `EMAIL_PASS`

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information
- `GET /api/health/ping` - Simple ping endpoint

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `GET /api/contact/:id` - Get specific contact
- `PUT /api/contact/:id/status` - Update contact status
- `GET /api/contact/stats/summary` - Get contact statistics

## 📝 Contact Form Submission

### Request Format
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "role": "CTO"
  },
  "projectInfo": {
    "type": "web-development",
    "budget": "15k-50k",
    "timeline": "2-3-months",
    "description": "Need a modern web application...",
    "requirements": ["React", "Node.js", "MongoDB"]
  },
  "preferences": {
    "contactMethod": "email",
    "meetingPreference": "video-call",
    "timezone": "America/New_York"
  }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Thank you for your message! I'll get back to you within 24 hours.",
  "data": {
    "id": "contact_id",
    "submittedAt": "2024-01-01T12:00:00.000Z",
    "status": "new",
    "estimatedResponseTime": "24 hours",
    "nextSteps": [
      "Your message has been received and saved",
      "You will receive a confirmation email shortly",
      "I will review your project requirements",
      "Expect a personal response within 24 hours"
    ]
  }
}
```

## 📧 Email Templates

The API sends two types of emails:

1. **Admin Notification**: Sent to you when someone submits the form
2. **User Confirmation**: Sent to the user confirming their submission

Both emails are professionally designed with HTML templates.

## 🔒 Security Features

- **Rate Limiting**: 3 contact form submissions per 15 minutes per IP
- **Input Validation**: Comprehensive validation of all form fields
- **CORS Protection**: Configured for your frontend domain
- **Helmet**: Security headers
- **Data Sanitization**: Prevents XSS and injection attacks

## 📊 Database Schema

The Contact model includes:
- Personal information (name, email, phone, etc.)
- Project details (type, budget, timeline, description)
- Contact preferences
- Metadata (IP, user agent, timestamps)
- Email tracking status
- Communication history

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Submit contact form
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

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "portfolio-api"
pm2 startup
pm2 save
```

### Using Docker
```bash
# Build image
docker build -t portfolio-backend .

# Run container
docker run -p 5000:5000 --env-file .env portfolio-backend
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio
FRONTEND_URL=https://mukulbatra.dev
```

## 📝 Logs

The API logs important events:
- Contact form submissions
- Email sending status
- Database connections
- Errors and warnings

## 🔧 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail App Password
   - Verify EMAIL_USER and EMAIL_PASS in .env
   - Check /api/health/detailed for email status

2. **Database connection failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify network connectivity

3. **CORS errors**
   - Update FRONTEND_URL in .env
   - Check corsOptions in server.js

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Support

For issues or questions:
- Email: mukulbatra5911@gmail.com
- GitHub: [mukulbatra](https://github.com/mukulbatra)