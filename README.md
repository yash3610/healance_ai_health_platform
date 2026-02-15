# 💊 Healance AI - Health & Wellness Platform

<div align="center">

![Healance AI](https://img.shields.io/badge/Healance-AI%20Health%20Platform-00D9FF?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

**A comprehensive full-stack health and wellness platform with AI-powered features**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Demo](#-demo-credentials) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

Healance AI is a modern health management platform that combines cutting-edge AI technology with comprehensive health tracking features. Get personalized health insights, track your wellness journey, earn rewards for staying active, and access FDA-approved medicine information—all in one place.

## ✨ Features

### 🤖 **AI-Powered Health Assistants**
- **Health Assistant Bot**: Get instant answers about symptoms, diet, exercise, and wellness
- **Medicine Information Bot**: Access real-time FDA-approved drug information
  - Powered by FDA openFDA API
  - Comprehensive details: dosage, warnings, side effects, interactions
  - Supports 10,000+ FDA-approved medications

### 📊 **Health Dashboard**
- Real-time health metrics visualization
- BMI calculator and health score tracking
- Goal progress monitoring
- Activity history and trends

### 🎯 **Goal Tracking & Achievements**
- Set personalized health goals (weight, steps, calories, water)
- Track daily progress with visual indicators
- Earn achievement badges
- Smart reverse planning from target dates

### 🚶 **Walk & Earn Rewards**
- Convert daily steps into redeemable points
- Unlock exclusive health rewards
- Leaderboard and challenges
- Integration with fitness trackers

### 🔬 **3D Body Explorer**
- Interactive 3D human anatomy model
- Detailed organ information
- Health tips for each body system

### 🌡️ **Health Forecast**
- Weather-based health recommendations
- Pollen and air quality alerts
- Exercise suggestions based on conditions

### 📰 **Health Blog & News**
- Curated health articles
- Expert wellness tips
- Search and filtering

### 🔐 **Secure Authentication**
- JWT-based authentication
- Password reset via email
- Social login (Google, GitHub)
- Role-based access control

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19.1 + Vite 6.3
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

### **Backend**
- **Runtime**: Node.js 24.5
- **Framework**: Express 4.21
- **Database**: MongoDB 8.0
- **ODM**: Mongoose 8.9
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Email**: Nodemailer

### **External APIs**
- **FDA openFDA API**: Real-time medicine information
- **OpenWeatherMap**: Weather-based health forecasts
- **OpenAI** *(optional)*: Enhanced chatbot responses

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB** 8.0+ running locally or cloud instance (MongoDB Atlas)
- **Git** installed

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/healance_ai_health_platform.git
cd healance_ai_health_platform
```

**2. Backend Setup**
```bash
cd Backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Required environment variables:**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/healance_ai
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Optional
OPENAI_API_KEY=your_openai_key
WEATHER_API_KEY=your_openweathermap_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**3. Frontend Setup**
```bash
cd ../Frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add backend URL
echo "VITE_API_URL=http://localhost:5001/api" > .env
```

**4. Seed Sample Data** *(Optional)*
```bash
cd ../Backend
npm run seed
```

This creates:
- 2 demo users (demo@healance.ai / demo123456, admin@healance.ai / admin123456)
- 6 health blog posts
- 6 walk & earn rewards
- 4 sample health goals

**5. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🎮 Demo Credentials

| Email | Password | Role |
|:--|:--|:--|
| demo@healance.ai | demo123456 | User |
| admin@healance.ai | admin123456 | Admin |

---

## 📁 Project Structure

```
healance_ai_health_platform/
├── Backend/                     # Node.js + Express API
│   ├── config/                  # Database connection
│   ├── controllers/             # Route controllers
│   │   ├── authController.js    # Auth & password reset
│   │   ├── chatbotController.js # FDA API integration
│   │   ├── healthController.js  # Health data tracking
│   │   └── ...
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── HealthData.js
│   │   ├── ChatSession.js
│   │   └── ...
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, upload, error handling
│   ├── utils/                   # Helper functions
│   │   ├── fdaApi.js           # FDA API integration
│   │   ├── sendEmail.js
│   │   └── generateToken.js
│   ├── seeds/                   # Database seeders
│   ├── tests/                   # Test scripts
│   └── server.js                # Entry point
│
├── Frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── HumanBody.jsx
│   │   │   └── ui/
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIChatbots.jsx
│   │   │   ├── WalkAndEarn.jsx
│   │   │   └── ...
│   │   ├── context/             # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/            # API services
│   │   │   └── api.js
│   │   ├── layouts/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|:--|:--|:--|:--|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| POST | `/auth/logout` | Logout user | ✅ |
| POST | `/auth/forgot-password` | Send reset email | ❌ |
| PUT | `/auth/reset-password/:token` | Reset password | ❌ |
| PUT | `/auth/update-password` | Change password | ✅ |

### Chatbot Endpoints

| Method | Endpoint | Description | Auth Required |
|:--|:--|:--|:--|
| POST | `/chatbot/message` | Send message to bot | ✅ |
| GET | `/chatbot/sessions` | Get chat sessions | ✅ |
| GET | `/chatbot/sessions/:id` | Get session messages | ✅ |
| DELETE | `/chatbot/sessions/:id` | Delete session | ✅ |

**Medicine Bot Example:**
```javascript
POST /api/chatbot/message
{
  "message": "aspirin",
  "botType": "medicine",
  "sessionId": "..."
}
// Returns FDA-approved medicine information
```

### Health Data Endpoints

| Method | Endpoint | Description | Auth Required |
|:--|:--|:--|:--|
| GET | `/health-data` | Get all health records | ✅ |
| POST | `/health-data` | Add health record | ✅ |
| GET | `/health-data/latest` | Get latest data | ✅ |

### More Endpoints
- Goals: `/api/goals`
- Walk & Earn: `/api/walk-earn`
- Blogs: `/api/blogs`
- Forecasts: `/api/forecast`
- Contact: `/api/contact`

Full API documentation: [Backend README](./Backend/README.md)

---

## 💊 Medicine Information Bot

The Medicine Info Bot uses the **FDA openFDA API** to provide real-time, FDA-approved drug information.

**Supported Information:**
- ✅ Brand & Generic names
- ✅ Purpose & Uses
- ✅ Active Ingredients
- ✅ Dosage & Administration
- ✅ Warnings & Precautions
- ✅ Side Effects
- ✅ Drug Interactions
- ✅ Contraindications
- ✅ Manufacturer details

**Example Medicines:**
- Pain Relief: Aspirin, Ibuprofen, Acetaminophen, Naproxen
- Antibiotics: Amoxicillin, Azithromycin, Ciprofloxacin
- Heart/BP: Lisinopril, Atorvastatin, Amlodipine
- Diabetes: Metformin, Insulin, Glipizide

**Test Medicine Bot:**
```bash
node Backend/tests/testFdaApi.js --detailed aspirin
```

📚 Learn more: [Medicine Bot Documentation](./Backend/docs/MEDICINE_BOT_FDA_API.md)

---

## 🧪 Testing

**Test FDA API Integration:**
```bash
# Test specific medicine
node Backend/tests/testFdaApi.js --detailed ibuprofen

# Test all common medicines
node Backend/tests/testFdaApi.js
```

---

## 📦 Deployment

### Backend (Node.js API)

**Recommended Platforms:**
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://heroku.com/)
- AWS EC2 / DigitalOcean

**Environment Variables:**
Make sure to set all required environment variables in your hosting platform.

### Frontend (React SPA)

**Recommended Platforms:**
- [Netlify](https://netlify.com/) *(Recommended)*
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

**Build Command:**
```bash
npm run build
```

**Publish Directory:**
```
dist/
```

**Netlify Configuration:**
See [`netlify.toml`](./Frontend/netlify.toml)

---

## 🔒 Security

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ XSS protection via Helmet
- ✅ Secure password reset tokens (SHA-256)
- ⚠️ Never commit `.env` files to Git

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Vijay Shankar Shewale**

---

## 🙏 Acknowledgments

- **FDA openFDA API**: For medicine information
- **OpenWeatherMap**: For weather data
- **Tailwind CSS**: For beautiful UI components
- **React & Node.js communities**: For amazing tools and libraries

---

## 📞 Support

- 📧 Email: support@healance.ai
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/healance_ai_health_platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/healance_ai_health_platform/discussions)

---

<div align="center">

**Made with ❤️ for better health and wellness**

⭐ Star this repo if you find it helpful!

</div>
