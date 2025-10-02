#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 Portfolio Backend Setup\n');
  console.log('This script will help you configure your backend API.\n');

  try {
    // Check if .env already exists
    if (fs.existsSync('.env')) {
      const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled. You can manually edit .env file.');
        process.exit(0);
      }
    }

    console.log('📧 Email Configuration (Gmail recommended)');
    const emailUser = await question('Enter your Gmail address: ');
    const emailPass = await question('Enter your Gmail App Password (not regular password): ');
    
    console.log('\n📦 Database Configuration');
    const useAtlas = await question('Use MongoDB Atlas? (y/N): ');
    let mongoUri;
    
    if (useAtlas.toLowerCase() === 'y') {
      mongoUri = await question('Enter MongoDB Atlas connection string: ');
    } else {
      mongoUri = 'mongodb://localhost:27017/portfolio';
      console.log('Using local MongoDB:', mongoUri);
    }

    console.log('\n🌐 Frontend Configuration');
    const frontendUrl = await question('Enter frontend URL (default: http://localhost:5173): ') || 'http://localhost:5173';

    console.log('\n🔒 Security Configuration');
    const jwtSecret = generateRandomString(64);
    console.log('Generated JWT secret:', jwtSecret.substring(0, 20) + '...');

    // Create .env file
    const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=${mongoUri}

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${emailUser}
EMAIL_PASS=${emailPass}
EMAIL_FROM=${emailUser}
EMAIL_TO=${emailUser}

# Security
JWT_SECRET=${jwtSecret}
BCRYPT_ROUNDS=12

# CORS Configuration
FRONTEND_URL=${frontendUrl}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Company Information
ADMIN_EMAIL=${emailUser}
COMPANY_NAME=Mukul Batra Portfolio
`;

    fs.writeFileSync('.env', envContent);
    console.log('\n✅ .env file created successfully!');

    // Create additional setup instructions
    console.log('\n📋 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Start MongoDB (if using local)');
    console.log('3. Run the server: npm run dev');
    console.log('4. Test the API: curl http://localhost:5000/api/health');
    
    console.log('\n📧 Gmail Setup Instructions:');
    console.log('1. Go to Google Account Security settings');
    console.log('2. Enable 2-Step Verification');
    console.log('3. Generate an App Password for "Mail"');
    console.log('4. Use the App Password (not your regular password) in EMAIL_PASS');
    
    console.log('\n🔗 Useful Links:');
    console.log('- Gmail App Passwords: https://support.google.com/accounts/answer/185833');
    console.log('- MongoDB Atlas: https://www.mongodb.com/atlas');
    console.log('- API Documentation: See README.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run setup if called directly
if (require.main === module) {
  setup();
}

module.exports = setup;