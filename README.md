# Healance AI - Health & Wellness Platform

![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FFB300?style=for-the-badge&logo=jsonwebtokens&logoColor=black)
![openFDA](https://img.shields.io/badge/openFDA-API-0A66C2?style=for-the-badge)

A comprehensive full-stack health and wellness platform with AI-powered features.

**Authors:** Yash Hule & Aaditya Gunjal (Full Stack Developers...)

---

## Core Features

- **AI-Powered Health Assistants:** Health Assistant Bot for symptoms, diet, exercise, and wellness guidance.
- **Medicine Information Bot:** Real-time FDA-approved drug details using openFDA API, including dosage, warnings, side effects, interactions, and more.
- **Health Dashboard:** Real-time health metrics, BMI/health score tracking, and progress visualization.
- **Goal Tracking & Achievements:** Personalized goals (weight, steps, calories, water), daily progress, badges, and reverse planning.
- **Walk & Earn Rewards:** Convert steps into points, unlock rewards, and join challenges.
- **3D Body Explorer:** Interactive 3D anatomy model with body system insights.
- **Health Forecast:** Weather-based recommendations with air-quality and pollen awareness.
- **Health Blog & News:** Curated wellness content with search/filter support.
- **Secure Authentication:** JWT auth, password reset by email, social login, and role-based access.

---

## Technology Stack

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| React | 19.1.x | Frontend framework |
| Vite | 6.3.x | Frontend build tooling |
| React Router DOM | 7.13.x | Client-side routing |
| Tailwind CSS | 3.4.x | Styling |
| Framer Motion | 12.x | Animations |
| Lucide React | 0.511.x | Icon system |
| Axios | 1.9.x | HTTP requests |
| Node.js | 18+ | Backend runtime |
| Express | 4.21.x | Backend framework |
| MongoDB | 8.x | Database |
| Mongoose | 8.x | ODM for MongoDB |
| JWT | 9.x | Authentication |
| bcryptjs | 2.4.x | Password hashing |
| Multer | 1.4.x | File upload |
| Nodemailer | 6.9.x | Email service |

---

## Project Structure

```text
healance_ai_health_platform/
+-- Backend/
|   +-- config/
|   +-- controllers/
|   |   +-- authController.js
|   |   +-- chatbotController.js
|   |   +-- healthController.js
|   |   +-- ...
|   +-- middleware/
|   +-- models/
|   |   +-- User.js
|   |   +-- HealthData.js
|   |   +-- ChatSession.js
|   |   +-- ...
|   +-- routes/
|   +-- seeds/
|   +-- tests/
|   +-- utils/
|   |   +-- fdaApi.js
|   |   +-- sendEmail.js
|   |   +-- generateToken.js
|   +-- .env
|   +-- package.json
|   +-- server.js
|
+-- Frontend/
|   +-- src/
|   |   +-- components/
|   |   |   +-- AuthModal.jsx
|   |   |   +-- Navbar.jsx
|   |   |   +-- HumanBody.jsx
|   |   |   +-- ui/
|   |   +-- pages/
|   |   |   +-- Home.jsx
|   |   |   +-- Dashboard.jsx
|   |   |   +-- AIChatbots.jsx
|   |   |   +-- WalkAndEarn.jsx
|   |   |   +-- ...
|   |   +-- context/
|   |   +-- hooks/
|   |   +-- layouts/
|   |   +-- services/
|   |   +-- App.jsx
|   +-- .env
|   +-- package.json
|   +-- netlify.toml
|
+-- .gitignore
+-- README.md
```

---

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (8.0+ local or Atlas)
- Git
- npm

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
# Update .env values, then run:
npm run dev
# Backend: http://localhost:5001
```

**Backend `.env` example:**

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

### Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env
# Set API URL:
# VITE_API_URL=http://localhost:5001/api
npm run dev
# Frontend: http://localhost:5173
```

**Frontend `.env` example:**

```env
VITE_API_URL=http://localhost:5001/api
```

### Optional Seed Data

```bash
cd Backend
npm run seed
```

Creates demo users, blog posts, rewards, and sample health goals.

---

## Usage Flow

1. **Register/Login** - Create account and authenticate.
2. **Dashboard** - View health stats, trends, and progress.
3. **Use AI Assistants** - Ask wellness questions or search medicines.
4. **Set Goals** - Add goals and track daily progress.
5. **Walk & Earn** - Record steps and redeem rewards.
6. **Track Insights** - Use forecast, anatomy explorer, and blog resources.

---

## Demo Credentials

| Email | Password | Role |
| ----- | -------- | ---- |
| demo@healance.ai | demo123456 | User |
| admin@healance.ai | admin123456 | Admin |

---

## UI & Design

- Clean and modern Tailwind CSS based interface
- Responsive layout for desktop, tablet, and mobile
- Smooth animation with Framer Motion
- Reusable component-driven frontend architecture
- Focused, health-centric UX across modules

---

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Role-based route protection
- Password reset token flow
- CORS, Helmet, and rate limiting protections
- Input validation on API routes

---

## API Endpoints

### Base URL

```text
http://localhost:5001/api
```

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password (Protected)

### Chatbot

- `POST /api/chatbot/message` - Send message to bot (Protected)
- `GET /api/chatbot/sessions` - Get chat sessions (Protected)
- `GET /api/chatbot/sessions/:id` - Get messages by session (Protected)
- `DELETE /api/chatbot/sessions/:id` - Delete session (Protected)

### Health Data

- `GET /api/health-data` - Get health records (Protected)
- `POST /api/health-data` - Add health record (Protected)
- `GET /api/health-data/latest` - Get latest record (Protected)

### Additional Modules

- Goals: `/api/goals`
- Walk & Earn: `/api/walk-earn`
- Blogs: `/api/blogs`
- Forecast: `/api/forecast`
- Contact: `/api/contact`

Full API details: [Backend README](./Backend/README.md)

---

## Medicine Information Bot

The Medicine Info Bot integrates with the FDA openFDA API to return real-time, FDA-approved medicine information.

**Supported fields include:**

- Brand and generic names
- Purpose and usage
- Active ingredients
- Dosage and administration
- Warnings and precautions
- Side effects and interactions
- Contraindications
- Manufacturer details

**Quick test:**

```bash
node Backend/tests/testFdaApi.js --detailed aspirin
```

Detailed docs: [Medicine Bot Documentation](./Backend/docs/MEDICINE_BOT_FDA_API.md)

---

## Testing

```bash
# Specific medicine
node Backend/tests/testFdaApi.js --detailed ibuprofen

# Common medicine test suite
node Backend/tests/testFdaApi.js
```

---

## Deployment

### Backend

- Railway
- Render
- Heroku
- AWS EC2 / DigitalOcean

### Frontend

- Netlify (recommended)
- Vercel
- Cloudflare Pages

**Build command:**

```bash
npm run build
```

**Publish directory:**

```text
dist/
```

---

## NPM Scripts

### Backend (`Backend/package.json`)

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed demo data

### Frontend (`Frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## Troubleshooting

**MongoDB Connection Error**

- Ensure MongoDB is running and accessible
- Check `MONGO_URI` in `Backend/.env`

**CORS or API URL Errors**

- Verify `CLIENT_URL` in backend `.env`
- Verify `VITE_API_URL` in `Frontend/.env`
- Ensure backend and frontend ports match configured URLs

**Token/Auth Issues**

- Clear cookies/local storage and login again
- Check JWT secret consistency across environment

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Contact & Support

- Email: support@healance.ai
- Issues: [GitHub Issues](https://github.com/yourusername/healance_ai_health_platform/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/healance_ai_health_platform/discussions)

---

## Acknowledgments

- FDA openFDA API for medicine data
- OpenWeatherMap for forecast integration
- Tailwind CSS for frontend styling
- React and Node.js communities

---

## License

This project is licensed under the MIT License.
