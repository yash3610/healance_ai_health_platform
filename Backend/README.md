# Healance AI - Backend API

A comprehensive Node.js + Express + MongoDB backend for the Healance AI Health Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Seed sample data (requires MongoDB running)
npm run seed
```

## ⚙️ Environment Variables

Copy `.env.example` → `.env` and fill in your values:

| Variable | Description | Default |
|:--|:--|:--|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/healance_ai` |
| `JWT_SECRET` | JWT signing secret | *(required)* |
| `JWT_EXPIRE` | JWT expiry time | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `OPENAI_API_KEY` | OpenAI API key (chatbot) | *(optional)* |
| `WEATHER_API_KEY` | OpenWeatherMap API key | *(optional)* |
| `EMAIL_HOST` | SMTP host | `smtp.mailtrap.io` |
| `EMAIL_PORT` | SMTP port | `2525` |
| `EMAIL_USER` | SMTP username | *(optional)* |
| `EMAIL_PASS` | SMTP password | *(optional)* |

## 📂 Project Structure

```
Backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Login, register, social auth
│   ├── blogController.js     # Blog CRUD + search
│   ├── bodyExplorerController.js  # Body part info
│   ├── chatbotController.js  # AI chat sessions
│   ├── contactController.js  # Contact form + tickets
│   ├── forecastController.js # Weather health forecast
│   ├── goalController.js     # Health goal tracking
│   ├── healthDataController.js    # Daily health data
│   ├── riskPredictionController.js # Health risk analysis
│   ├── userController.js     # Profile management
│   └── walkEarnController.js # Walk & Earn system
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── errorMiddleware.js    # Error handling
│   └── uploadMiddleware.js   # File upload (multer)
├── models/
│   ├── Blog.js
│   ├── ChatSession.js
│   ├── Contact.js
│   ├── Goal.js
│   ├── HealthData.js
│   ├── MedicalReport.js
│   ├── Notification.js
│   ├── RiskPrediction.js
│   ├── User.js
│   └── WalkEarn.js
├── routes/
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── bodyExplorerRoutes.js
│   ├── chatbotRoutes.js
│   ├── contactRoutes.js
│   ├── forecastRoutes.js
│   ├── goalRoutes.js
│   ├── healthDataRoutes.js
│   ├── riskPredictionRoutes.js
│   ├── userRoutes.js
│   └── walkEarnRoutes.js
├── seeds/
│   └── seedData.js           # Sample blogs, rewards, demo user
├── uploads/                  # File uploads directory
├── utils/
│   ├── generateToken.js      # JWT token generation
│   └── sendEmail.js          # Email service (nodemailer)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js                 # App entry point
```

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/register` | ❌ | Register user |
| POST | `/login` | ❌ | Login user |
| POST | `/logout` | ✅ | Logout user |
| POST | `/social` | ❌ | Google/GitHub OAuth login |
| GET | `/me` | ✅ | Get current user |

### User (`/api/users`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| PUT | `/profile` | ✅ | Update profile |
| PUT | `/password` | ✅ | Change password |
| GET | `/notifications` | ✅ | Get notifications |
| PUT | `/notifications/settings` | ✅ | Update notification settings |
| POST | `/bookmarks/:blogId` | ✅ | Toggle blog bookmark |
| GET | `/bookmarks` | ✅ | Get bookmarked blogs |

### Health Data (`/api/health-data`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/` | ✅ | Log health data |
| GET | `/today` | ✅ | Today's stats |
| PUT | `/today` | ✅ | Update today's data |
| GET | `/weekly` | ✅ | Weekly trends |
| GET | `/monthly` | ✅ | Monthly overview |
| GET | `/dashboard` | ✅ | Dashboard summary |
| POST | `/reports` | ✅ | Upload medical report |
| GET | `/reports` | ✅ | Get all reports |

### Risk Prediction (`/api/risk-prediction`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/analyze` | ✅ | Run risk analysis |
| GET | `/history` | ✅ | Past predictions |
| GET | `/latest` | ✅ | Latest prediction |

### AI Chatbot (`/api/chatbot`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/message` | ✅ | Send message to AI |
| GET | `/sessions` | ✅ | List chat sessions |
| GET | `/sessions/:id` | ✅ | Get session messages |
| DELETE | `/sessions/:id` | ✅ | Delete a session |

### Body Explorer (`/api/body-explorer`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| GET | `/` | ❌ | All body parts info |
| GET | `/:partName` | ❌ | Specific body part |

### Goals (`/api/goals`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| GET | `/suggestions` | ✅ | AI goal suggestions |
| GET | `/` | ✅ | User's goals |
| POST | `/` | ✅ | Create goal |
| PUT | `/:id` | ✅ | Update goal |
| DELETE | `/:id` | ✅ | Delete goal |
| POST | `/:id/progress` | ✅ | Log weekly progress |

### Walk & Earn (`/api/walk-earn`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/log-steps` | ✅ | Log daily steps |
| GET | `/summary` | ✅ | Walking stats + coins |
| GET | `/rewards` | ✅ | Available rewards |
| POST | `/redeem/:rewardId` | ✅ | Redeem reward |
| GET | `/redemptions` | ✅ | Redemption history |

### Health Forecast (`/api/forecast`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| GET | `/` | ✅ | Today's health forecast |
| GET | `/weekly` | ✅ | 7-day forecast |

### Blogs (`/api/blogs`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| GET | `/categories` | ❌ | Blog categories |
| GET | `/trending` | ❌ | Popular blogs |
| GET | `/` | ❌ | All blogs (filters + pagination) |
| GET | `/:identifier` | ❌ | Single blog (by ID or slug) |
| POST | `/:id/like` | ✅ | Like a blog |
| POST | `/` | 🔒 Admin | Create blog |
| PUT | `/:id` | 🔒 Admin | Update blog |
| DELETE | `/:id` | 🔒 Admin | Delete blog |

### Contact (`/api/contact`)
| Method | Endpoint | Auth | Description |
|:--|:--|:--|:--|
| POST | `/` | ❌ | Submit contact form |
| POST | `/ticket` | ✅ | Create support ticket |
| GET | `/tickets` | ✅ | User's tickets |
| GET | `/admin/contacts` | 🔒 Admin | All contacts |
| PUT | `/admin/contacts/:id` | 🔒 Admin | Update contact status |
| GET | `/admin/tickets` | 🔒 Admin | All support tickets |
| PUT | `/admin/tickets/:id` | 🔒 Admin | Update ticket |

## 🔐 Authentication

Uses JWT Bearer tokens. Include in headers:
```
Authorization: Bearer <token>
```

Token is also set as an httpOnly cookie on login.

## 🧪 Demo Accounts

After running `npm run seed`:

| Email | Password | Role |
|:--|:--|:--|
| `demo@healance.ai` | `demo123456` | User |
| `admin@healance.ai` | `admin123456` | Admin |

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express 4.21
- **Database**: MongoDB + Mongoose 8.6
- **Auth**: JWT + bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **AI**: OpenAI SDK
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
