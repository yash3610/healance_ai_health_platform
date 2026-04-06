# Healance AI - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FFB300?style=for-the-badge&logo=jsonwebtokens&logoColor=black)
![openFDA](https://img.shields.io/badge/openFDA-Integrated-0A66C2?style=for-the-badge)

Backend API for Healance AI, built with Express and MongoDB. It powers authentication, health tracking, AI chatbots, risk prediction, goals, walk-and-earn, notifications, blogs, and support workflows.

---

## Core Features

- JWT auth with secure HTTP-only cookie support
- Role-based access (`user`, `admin`)
- Health data tracking and dashboard stats APIs
- AI health assistant and medicine information chatbot
- Risk analysis and recommendation APIs
- Goal management with progress logging
- Walk-and-earn points and rewards redemption
- Notification center and reminder APIs
- Blog and bookmark APIs
- Contact form and support ticket system with file attachments

---

## Technology Stack

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| Node.js | 18+ | Runtime |
| Express | 4.21.x | API framework |
| MongoDB | 8.x | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Authentication |
| bcryptjs | 2.4.x | Password hashing |
| Multer | 1.4.x | Upload handling |
| Nodemailer | 6.9.x | Emails |
| Helmet | 7.x | Security headers |
| express-rate-limit | 7.x | API rate limiting |

---

## Project Structure

```text
Backend/
+-- config/
|   +-- db.js
+-- controllers/
|   +-- authController.js
|   +-- healthController.js
|   +-- riskController.js
|   +-- chatbotController.js
|   +-- ...
+-- middleware/
|   +-- authMiddleware.js
|   +-- errorMiddleware.js
|   +-- uploadMiddleware.js
+-- models/
|   +-- User.js
|   +-- HealthData.js
|   +-- RiskPrediction.js
|   +-- ChatSession.js
|   +-- ...
+-- routes/
|   +-- authRoutes.js
|   +-- healthRoutes.js
|   +-- riskRoutes.js
|   +-- ...
+-- seeds/
|   +-- seedData.js
+-- tests/
|   +-- testFdaApi.js
+-- utils/
|   +-- fdaApi.js
|   +-- generateToken.js
|   +-- sendEmail.js
+-- .env.example
+-- package.json
+-- server.js
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
cd Backend
npm install
cp .env.example .env
```

Windows alternative:

```powershell
copy .env.example .env
```

### Run Development Server

```bash
npm run dev
```

Default API base URL:

```text
http://localhost:5000/api
```

Health check endpoint:

```text
GET /api/health
```

---

## Environment Variables

From `Backend/.env.example`:

| Variable | Required | Default/Example | Purpose |
| -------- | -------- | --------------- | ------- |
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/healance_ai` | MongoDB connection string |
| `JWT_SECRET` | Yes | `your_secret` | JWT signing secret |
| `JWT_EXPIRE` | No | `15m` | Access token expiry |
| `JWT_REFRESH_SECRET` | No | `your_refresh_secret` | Refresh token signing secret (falls back to `JWT_SECRET`) |
| `JWT_REFRESH_EXPIRE` | No | `30d` | Refresh token expiry |
| `CLIENT_URL` | Yes | `http://localhost:5173` | CORS allowed frontend origin |
| `OPENAI_API_KEY` | No | `sk-...` | AI chatbot enhancement |
| `FDA_API_KEY` | No | empty | Reserved (openFDA is public) |
| `WEATHER_API_KEY` | No | `your_openweathermap_api_key` | Weather-based forecast |
| `OPENWEATHER_API_KEY` | No | empty | Alternate weather key variable name |
| `WEATHER_API_BASE_URL` | No | `https://api.openweathermap.org/data/2.5` | Weather API base URL |
| `WEATHER_UNITS` | No | `metric` | Units for weather temperature/speed |
| `EMAIL_HOST` | No | `smtp.gmail.com` | SMTP host |
| `EMAIL_PORT` | No | `587` | SMTP port |
| `EMAIL_USER` | No | `your-email@gmail.com` | SMTP user |
| `EMAIL_PASS` | No | `your-app-password` | SMTP password/app password |
| `ADMIN_EMAIL` | No | `agroreach01@gmail.com` | Admin alert email |
| `MAX_FILE_SIZE` | No | `10485760` | Upload size limit in bytes |
| `UPLOAD_PATH` | No | `./uploads` | Upload path reference |

---

## Authentication

Protected routes use `protect` middleware and accept token from:

- `Authorization: Bearer <token>`
- `accessToken` cookie (HTTP-only)
- `token` cookie (legacy backward compatibility)

Admin routes require:

- authenticated user
- `role === "admin"`

---

## API Conventions

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/health` | Public | API health status |

### Authentication

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login user |
| POST | `/auth/logout` | Public | Logout and clear auth cookie |
| GET | `/auth/me` | Protected | Get current user |
| POST | `/auth/social` | Public | Social login (Google/GitHub flow input) |
| POST | `/auth/forgot-password` | Public | Send reset email |
| PUT | `/auth/reset-password/:resetToken` | Public | Reset password using token |
| PUT | `/auth/update-password` | Protected | Change password while logged in |

### Users

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| PUT | `/users/profile` | Protected | Update profile fields |
| PUT | `/users/password` | Protected | Update password |
| GET | `/users/notifications` | Protected | Get latest user notifications |
| PUT | `/users/notifications/read-all` | Protected | Mark all user notifications as read |
| PUT | `/users/notifications/:id/read` | Protected | Mark one user notification as read |
| POST | `/users/bookmarks/:blogId` | Protected | Toggle blog bookmark |
| GET | `/users/bookmarks` | Protected | Get bookmarked blogs |

### Health Data

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/health-data` | Protected | Add daily health data |
| GET | `/health-data/today` | Protected | Get today data or defaults |
| PUT | `/health-data/today` | Protected | Upsert today data |
| GET | `/health-data/weekly?days=7` | Protected | Get weekly trend series |
| GET | `/health-data/monthly` | Protected | Get monthly averages |
| GET | `/health-data/dashboard` | Protected | Get dashboard overview |
| POST | `/health-data/reports` | Protected | Upload medical report (`multipart/form-data`) |
| GET | `/health-data/reports` | Protected | List uploaded reports |

### Risk Prediction

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/risk-prediction/analyze` | Protected | Analyze user health risk |
| GET | `/risk-prediction/history` | Protected | Last 10 predictions |
| GET | `/risk-prediction/latest` | Protected | Latest prediction |

### Chatbot

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/chatbot/message` | Protected | Send message to health or medicine bot |
| GET | `/chatbot/sessions` | Protected | Get chat sessions (`?botType=health|medicine`) |
| GET | `/chatbot/sessions/:sessionId` | Protected | Get one session with messages |
| DELETE | `/chatbot/sessions/:sessionId` | Protected | Delete one chat session |

### Body Explorer

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/body-explorer` | Public | Get all body part data |
| GET | `/body-explorer/:partName` | Public | Get one body part details |

### Goals

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/goals/suggestions` | Protected | AI-style suggestions from active goals |
| GET | `/goals?status=active|completed` | Protected | Get goals list |
| POST | `/goals` | Protected | Create goal |
| PUT | `/goals/:id` | Protected | Update goal |
| DELETE | `/goals/:id` | Protected | Delete goal |
| POST | `/goals/:id/progress` | Protected | Log daily progress |

### Walk and Earn

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/walk-earn/log-steps` | Protected | Log steps and convert to coins |
| GET | `/walk-earn/summary` | Protected | Fetch coins, today metrics, weekly data |
| GET | `/walk-earn/rewards` | Protected | List rewards and `canRedeem` flag |
| POST | `/walk-earn/redeem/:rewardId` | Protected | Redeem reward |
| GET | `/walk-earn/redemptions` | Protected | Redemption history |

### Forecast

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/forecast?city=...` | Protected | Current weather-driven health forecast |
| GET | `/forecast?lat=...&lon=...` | Protected | Forecast by coordinates |
| GET | `/forecast/weekly` | Protected | Generated 7-day forecast |

### Blogs

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/blogs/categories` | Public | Blog category list |
| GET | `/blogs/trending` | Public | Trending blogs |
| GET | `/blogs` | Public | Paginated blogs (`category`, `search`, `page`, `limit`) |
| GET | `/blogs/:identifier` | Public | Blog by slug or ObjectId |
| POST | `/blogs/:id/like` | Protected | Like a blog |
| POST | `/blogs` | Protected + Admin | Create blog |
| PUT | `/blogs/:id` | Protected + Admin | Update blog |
| DELETE | `/blogs/:id` | Protected + Admin | Delete blog |

### Contact and Support

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/contact` | Public | Submit contact form |
| POST | `/contact/ticket` | Protected | Submit support ticket (`multipart/form-data`) |
| GET | `/contact/tickets` | Protected | Get my support tickets |
| GET | `/contact/admin/contacts` | Protected + Admin | Get all contact submissions |
| GET | `/contact/admin/tickets` | Protected + Admin | Get all support tickets (`?status=` optional) |
| PUT | `/contact/admin/tickets/:id` | Protected + Admin | Update ticket status |

### Notifications

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/notifications?unreadOnly=true` | Protected | Get notifications and unread count |
| POST | `/notifications` | Protected | Create manual notification |
| PUT | `/notifications/read-all` | Protected | Mark all notifications as read |
| DELETE | `/notifications/clear-all` | Protected | Delete all notifications |
| POST | `/notifications/water-reminder` | Protected | Create water reminder notification |
| POST | `/notifications/activity` | Protected | Create activity notification |
| PUT | `/notifications/:id/read` | Protected | Mark one notification as read |
| DELETE | `/notifications/:id` | Protected | Delete one notification |

---

## Request Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Demo User",
  "email": "demo@healance.ai",
  "password": "demo123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "demo@healance.ai",
  "password": "demo123456"
}
```

### Add Health Data

```http
POST /api/health-data
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "vitals": {
    "heartRate": 76,
    "bloodPressure": { "systolic": 120, "diastolic": 80 },
    "bloodSugar": 98
  },
  "activity": {
    "steps": 7200,
    "caloriesBurned": 420,
    "activeMinutes": 55,
    "distance": 5.4
  },
  "waterIntake": 2.3,
  "sleep": {
    "duration": 7.5,
    "quality": "good"
  },
  "healthScore": 82,
  "mood": "good"
}
```

### Analyze Risk

```http
POST /api/risk-prediction/analyze
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "age": 35,
  "gender": "Male",
  "bloodPressure": "130/85",
  "cholesterol": 210,
  "bloodSugar": 102,
  "bmi": 24.1,
  "smokingStatus": "never",
  "exerciseFrequency": "3-4/week",
  "familyHistory": ["diabetes"]
}
```

### Chatbot Message

```http
POST /api/chatbot/message
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "message": "aspirin",
  "botType": "medicine"
}
```

### Create Goal

```http
POST /api/goals
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "type": "steps",
  "title": "Daily Steps",
  "current": 0,
  "target": 10000,
  "unit": "steps"
}
```

### Upload Medical Report

```bash
curl -X POST http://localhost:5000/api/health-data/reports \
  -H "Authorization: Bearer <token>" \
  -F "report=@report.pdf" \
  -F "title=Blood Work April" \
  -F "type=blood_test"
```

---

## File Uploads

Upload middleware supports:

- JPEG, PNG, GIF, SVG images
- PDF
- DOC, DOCX

Limits:

- max size: `MAX_FILE_SIZE` (default 10MB)
- support ticket attachments: max 5 files
- upload directory: `Backend/uploads` (served as `/uploads/*`)

---

## Security and Runtime Notes

- `helmet` enabled
- CORS locked to `CLIENT_URL` and credentials enabled
- Rate limit: `100` requests per `15` minutes on `/api/*`
- Passwords hashed with bcrypt (`12` salt rounds)
- `.env` and `uploads/` are gitignored

---

## Seed and Test Utilities

### Seed Demo Data

```bash
npm run seed
```

This seeds:

- demo users (`demo@healance.ai`, `admin@healance.ai`)
- blog posts
- rewards
- sample goals

### Test Medicine API Integration

```bash
node tests/testFdaApi.js --detailed aspirin
```

---

## NPM Scripts

| Script | Description |
| ------ | ----------- |
| `npm start` | Run production server |
| `npm run dev` | Run development server with nodemon |
| `npm run seed` | Seed initial demo data |

---

## Troubleshooting

**MongoDB connection fails**

- verify `MONGO_URI`
- make sure MongoDB is running

**401 Unauthorized on protected routes**

- send `Authorization: Bearer <token>` header
- or ensure `token` cookie is present

**CORS issues**

- set correct `CLIENT_URL` in `.env`
- make sure frontend origin matches exactly

**Email not sent**

- check `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
- use app password if using Gmail SMTP

---

## License

This project is licensed under the MIT License.
