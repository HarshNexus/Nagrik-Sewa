# 🏠 Nagrik Sewa - AI-Powered Home Services Platform

> **India's first comprehensive full-stack platform connecting customers with verified local service providers across 640+ districts**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D5.0-green.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://typescriptlang.org/)

## 📋 Table of Contents
- [Project Status](#-project-status)
- [Key Features](#-key-features)
- [Pages & Routes](#-pages--routes)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

---

## 🎯 Project Status: ✅ **PRODUCTION READY** - v2.0 Enhanced

**Latest Updates (December 2025)**:
- ✅ **Performance Optimized**: Lazy loading, code splitting, caching
- ✅ **Security Enhanced**: Advanced middleware, monitoring, error boundaries
- ✅ **Production Ready**: Deployment scripts, health checks, monitoring
- ✅ **Professional Pages**: About, How It Works, Careers, For Businesses
- ✅ **User Engagement**: Safety Guidelines, Refer & Earn program
- ✅ **Multi-Language**: 13+ Indian languages with Hindi translations
- ✅ **Location Sync**: Global location context across all pages

---

## 🌟 Key Features

### 🤖 **AI-Powered Intelligence**
- **Smart Chatbot**: Multi-language support with emergency detection (Google Gemini AI)
- **Resume Enhancement**: AI-powered resume building and optimization
- **Intelligent Matching**: Auto-match customers with suitable service providers

### 🔐 **Authentication & Security**
- **Google OAuth Integration**: Seamless social login
- **JWT Authentication**: Secure token-based auth system
- **Multi-factor Authentication**: SMS & Email verification
- **Role-based Access Control**: Customer, Worker, Admin roles

### 🌍 **Multi-Language & Location**
- **13+ Indian Languages**: Real-time translation support (English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Urdu)
- **Location Intelligence**: Complete India coverage (640+ districts across all states & UTs)
- **Geolocation Services**: Distance-based matching with location sync

### 💼 **Business Features**
- **Service Management**: 50+ service categories
- **Booking System**: Real-time booking and scheduling
- **Payment Integration**: Razorpay payment gateway
- **Worker Verification**: DigiLocker integration
- **Real-time Chat**: WebSocket-based messaging
- **B2B Solutions**: Enterprise plans for businesses

### 🎯 **User Engagement**
- **Referral Program**: Refer & Earn rewards system
- **Safety Guidelines**: Comprehensive safety resources
- **24/7 Support**: Emergency helpline and support system

---

## 📄 Pages & Routes

### **Public Pages**
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with service search and location selector |
| `/about` | About Us | Company story, mission, vision, and values |
| `/how-it-works` | How It Works | Step-by-step guide for customers and workers |
| `/services` | Services | Browse 50+ service categories |
| `/workers` | Find Professionals | Search and filter verified workers |
| `/careers` | Careers | Job openings and company benefits |
| `/for-businesses` | For Businesses | B2B enterprise solutions |
| `/safety-guidelines` | Safety Guidelines | Safety tips for customers and workers |
| `/refer-earn` | Refer & Earn | Referral rewards program |

### **Support & Legal**
| Route | Page | Description |
|-------|------|-------------|
| `/support` | Help Center | Contact support and FAQs |
| `/support-faqs` | FAQs | Frequently asked questions |
| `/privacy` | Privacy Policy | Data privacy and protection |
| `/terms` | Terms of Service | Terms and conditions |

### **Worker Portal**
| Route | Page | Description |
|-------|------|-------------|
| `/join-as-worker` | Join as Worker | Worker registration |
| `/join-as-customer` | Join as Customer | Customer registration |
| `/get-verified` | Get Verified | KYC verification (DigiLocker) |
| `/skill-training` | Skill Training | Training resources |
| `/resume-builder` | Resume Builder | AI-powered resume creation |
| `/find-customers` | Find Customers | Job discovery for workers |

### **Service Categories**
| Route | Page |
|-------|------|
| `/services/home` | Home Services |
| `/services/construction` | Construction Services |
| `/services/electrical` | Electrical Services |
| `/services/plumbing` | Plumbing Services |
| `/services/cleaning` | Cleaning Services |
| `/services/gardening` | Gardening Services |

### **Protected Routes** (Requires Authentication)
| Route | Page | Access |
|-------|------|--------|
| `/dashboard` | Dashboard | All users |
| `/profile` | Profile | All users |
| `/bookings` | My Bookings | All users |
| `/admin` | Admin Dashboard | Admin only |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nagrik-sewa.git
cd nagrik-sewa
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure the following **REQUIRED** variables:

```bash
# Copy environment template
cp .env.example .env
```

### 3. Database Setup
```bash
# Start MongoDB locally or use MongoDB Atlas
# The application will auto-connect using DATABASE_URL
```

### 4. Start Development
```bash
npm run dev
```

Visit: **http://localhost:8080**

---

## 🔑 Environment Variables

> 📖 **For detailed step-by-step instructions on obtaining all API keys and credentials, see [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)**

### Quick Setup

Create a `.env` file in the project root:

```bash
# Required - Core Services
MONGODB_URI=mongodb://localhost:27017/nagrik-sewa
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Required - Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional - Communication Services
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# Optional - Payment & Verification
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
DIGILOCKER_CLIENT_ID=your-digilocker-client-id

# App Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080
```

### Service Documentation Links

| Service | Purpose | Documentation |
|---------|---------|---------------|
| MongoDB Atlas | Database | [Setup Guide](https://www.mongodb.com/docs/atlas/getting-started/) |
| Google OAuth | Social Login | [OAuth Setup](https://console.cloud.google.com/) |
| Google Gemini | AI Chatbot | [AI Studio](https://makersuite.google.com/) |
| Twilio | SMS/OTP | [Twilio Console](https://console.twilio.com/) |
| Razorpay | Payments | [Dashboard](https://dashboard.razorpay.com/) |
| DigiLocker | ID Verification | [API Portal](https://api.digitallocker.gov.in/) |

---

## 🏗️ Project Architecture

### **Full-Stack Architecture Overview**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │◄──►│  Express Backend │◄──►│   MongoDB Atlas │
│                 │    │                 │    │                 │
│ • Google OAuth  │    │ • JWT Auth      │    │ • User Data     │
│ • AI Chatbot    │    │ • Google OAuth  │    │ • Service Data  │
│ • Multi-language│    │ • Payment APIs  │    │ • Booking Data  │
│ • Responsive UI │    │ • File Upload   │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  External APIs  │    │   File Storage  │    │   Third-party   │
│                 │    │                 │    │                 │
│ • Google Gemini │    │ • Local/AWS S3  │    │ • Twilio SMS    │
│ • Google Maps   │    │ • Image Upload  │    │ • Razorpay      │
│ • DigiLocker    │    │ • Resume Files  │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Structure**
```
client/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── chat/            # AI Chatbot components
│   ├── resume/          # Resume builder components
│   ├── GoogleAuthProvider.tsx    # Google OAuth setup
│   ├── GoogleLoginButton.tsx     # Google login button
│   ├── LocationSelector.tsx      # Location picker component
│   ├── LanguageSelector.tsx      # Language picker component
│   ├── Navigation.tsx   # Main navigation
│   └── Footer.tsx       # Professional footer with links
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   ├── LanguageContext.tsx # Multi-language support (13+ languages)
│   └── LocationContext.tsx # Global location management
├── pages/               # Page components
│   ├── auth/           # Authentication pages (Login, Register, etc.)
│   ├── services/       # Service category pages
│   ├── workers/        # Worker portal pages
│   ├── admin/          # Admin dashboard
│   ├── About.tsx       # Company information
│   ├── HowItWorks.tsx  # Platform guide
│   ├── Careers.tsx     # Job openings
│   ├── ForBusinesses.tsx # B2B solutions
│   ├── SafetyGuidelines.tsx # Safety resources
│   ├── ReferEarn.tsx   # Referral program
│   ├── Privacy.tsx     # Privacy policy
│   ├── Terms.tsx       # Terms of service
│   └── Support.tsx     # Help center
├── data/               # Static data
│   └── indianLocations.ts # States & districts data
└── services/           # API integration services
```

### **Backend Structure**
```
server/
├── routes/              # API route handlers
│   ├── auth/           # Authentication routes
│   │   ├── index.ts    # Main auth routes
│   │   └── google.ts   # ✅ Google OAuth implementation
│   ├── chatbot.ts      # AI chatbot endpoints
│   ├── services.ts     # Service management
│   ├── bookings.ts     # Booking system
│   └── upload.ts       # File upload handling
├── models/             # MongoDB models
│   ├── User.ts         # User schema
│   ├── Service.ts      # Service schema
│   └── Booking.ts      # Booking schema
├── middleware/         # Express middleware
│   ├── auth.ts         # JWT authentication
│   └── security.ts     # Security headers & rate limiting
└── services/           # Business logic services
    ├── email.ts        # Email service
    ├── sms.ts          # SMS service
    └── payment.ts      # Payment processing
```

---

## 🛠️ Scripts & Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run typecheck       # TypeScript type checking
npm run format.fix      # Format code with Prettier
npm test               # Run tests
```

---

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login  
POST   /api/auth/google            # ✅ Google OAuth login/register
GET    /api/auth/me                # Get current user
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh JWT token
```

### **Services & Bookings**
```
GET    /api/services               # Get all services
POST   /api/bookings               # Create new booking
GET    /api/bookings               # Get user bookings
GET    /api/bookings/:id           # Get booking details
```

### **AI & Chatbot**
```
POST   /api/chatbot/message        # Send message to AI
POST   /api/chatbot/enhance-resume # AI resume enhancement
POST   /api/chatbot/feedback       # Submit chatbot feedback
```

### **File Upload**
```
POST   /api/upload                 # Upload files (images, documents)
```

---

## 📱 Google OAuth Integration Details

### **Frontend Implementation**
The Google OAuth is implemented using `@react-oauth/google` package:

- **GoogleAuthProvider.tsx**: Wraps the app with OAuth context
- **GoogleLoginButton.tsx**: Provides the login/register button
- **Automatic fallback**: Shows placeholder when OAuth is not configured

### **Backend Implementation**
Complete Google OAuth server integration:

- **Token Verification**: Validates Google ID tokens
- **User Creation**: Auto-creates users from Google profiles
- **JWT Integration**: Issues app JWT tokens after Google auth
- **Dual Mode**: Supports both login and registration flows

### **Security Features**
- Email verification requirement
- Secure token handling
- Profile picture sync
- Error handling and logging

---

## 🌐 Deployment

### **Production Build**
```bash
npm run build
npm run start
```

### **Environment Variables for Production**
Update these for production deployment:
```bash
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/nagrik-sewa
JWT_SECRET=your-super-secure-production-jwt-secret
```

### **Deployment Platforms**
- **Vercel**: Zero-config frontend deployment
- **Netlify**: JAMstack deployment with serverless functions
- **Heroku**: Full-stack deployment
- **AWS EC2**: Custom server deployment
- **Digital Ocean**: Droplet deployment

---

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Google OAuth login/register
- [ ] AI chatbot conversations
- [ ] Service browsing and booking
- [ ] Multi-language switching
- [ ] Responsive design on mobile
- [ ] File uploads (resume, documents)
- [ ] Email notifications
- [ ] Payment flow (if configured)

### **API Testing**
```bash
# Test server health
curl http://localhost:8080/health

# Test Google OAuth endpoint
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential": "google_id_token", "mode": "login"}'
```

---

## ⚡ Performance & Security

### **Performance Metrics**
- **Bundle Size**: ~1.3MB (optimized)
- **First Load**: <2s
- **API Response**: <500ms average
- **AI Response**: <3s average

### **Security Features**
- JWT token authentication
- Rate limiting (100 requests/15 minutes)
- Input validation and sanitization
- CORS configuration
- Security headers (Helmet.js)
- File upload restrictions
- MongoDB injection prevention

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **Google OAuth Not Working**
```bash
# Check these environment variables are set:
VITE_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_ID=your_client_id  
GOOGLE_CLIENT_SECRET=your_client_secret

# Verify OAuth configuration in Google Console
# Check authorized origins and redirect URIs
```

#### **AI Chatbot Not Responding**
```bash
# Check Gemini API key is configured:
VITE_GEMINI_API_KEY=your_gemini_api_key

# Test API key validity:
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

#### **Database Connection Issues**
```bash
# Check MongoDB connection:
DATABASE_URL=mongodb://localhost:27017/nagrik-sewa

# For MongoDB Atlas, ensure IP whitelist is configured
# For local MongoDB, ensure service is running:
mongod --version
```

#### **Build Errors**
```bash
# Clear node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (v18+ required):
node --version
```

### **Error Logs**
Check browser console and server logs for detailed error information:
```bash
# View server logs in development:
npm run dev

# Check browser console (F12) for client-side errors
```

---

## 📞 Support & Contributing

### **Getting Help**
- **Issues**: [GitHub Issues](https://github.com/your-username/nagrik-sewa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nagrik-sewa/discussions)
- **Email**: support@nagriksewa.com

### **Contributing**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation
- Follow the existing code style

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### **Technologies Used**
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT, Google OAuth 2.0
- **AI**: Google Gemini AI
- **UI Components**: shadcn/ui, Radix UI
- **Payments**: Razorpay
- **Communication**: Twilio, EmailJS
- **Deployment**: Vercel, Netlify

### **Special Thanks**
- Google AI for Gemini API
- MongoDB for database services
- Vercel for hosting platform
- Open source community for amazing libraries

---

<div align="center">

**🌟 Star this repository if you found it helpful! 🌟**

**Made with ❤️ for the Indian service community**

[⬆ Back to Top](#-nagrik-sewa---ai-powered-home-services-platform)

</div>