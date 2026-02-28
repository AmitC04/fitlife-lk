# 🏋️ FitLife — AI-Powered Health & Fitness Web App

> Personalized diet plans and workout routines powered by Google Gemini AI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- MySQL server running (XAMPP, WAMP, or standalone MySQL)
- Google Gemini API key ([get it free](https://makersuite.google.com/app/apikey))

---

## ⚙️ Step-by-Step Setup

### 1. Create MySQL Database
Open MySQL (phpMyAdmin, MySQL Workbench, or CLI) and run:
```sql
CREATE DATABASE fitlife_db;
```
That's it! Sequelize will auto-create the tables on first run.

---

### 2. Configure Backend

Edit `/server/.env` and fill in your details:

```env
# ============================================================
# REQUIRED: Your Google Gemini API key
# Get free at: https://makersuite.google.com/app/apikey
# ============================================================
GEMINI_API_KEY=your_gemini_api_key_here

# ============================================================
# REQUIRED: MySQL connection
# ============================================================
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fitlife_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# ============================================================
# REQUIRED: Any long random string for JWT
# ============================================================
JWT_SECRET=change_this_to_a_long_random_string_abc123xyz789

PORT=5000
```

---

### 3. Install & Run Backend

```bash
cd server
npm install
npm start
```

You should see:
```
✅ MySQL database synced
🚀 Server running on http://localhost:5000
```

---

### 4. Install & Run Frontend

```bash
cd client
npm install
npm start
```

App opens at **http://localhost:3000**

---

## 📁 Project Structure

```
fitlife/
├── client/                     # React frontend
│   ├── public/
│   │   └── index.html          # HTML template with Tailwind CDN
│   └── src/
│       ├── App.jsx             # Root component with routing
│       ├── index.js            # React entry point
│       ├── constants.js        # ⚠️ App name, API URL here
│       ├── pages/
│       │   ├── Home.jsx        # Dashboard with metrics
│       │   ├── Diet.jsx        # AI diet plan page
│       │   ├── Exercise.jsx    # AI workout page
│       │   └── About.jsx       # About page
│       ├── components/
│       │   ├── Navbar.jsx      # Navigation bar
│       │   ├── Modal.jsx       # Login/Register modal
│       │   ├── MetricCard.jsx  # BMI, BMR, TDEE charts
│       │   └── MenuUpload.jsx  # Menu upload + OCR
│       ├── context/
│       │   ├── AuthContext.jsx # JWT auth state
│       │   └── ThemeContext.jsx # Dark/light mode
│       └── utils/
│           └── calculateBMR.js # Health formula calculations
│
└── server/                     # Express backend
    ├── server.js               # Main server entry
    ├── .env                    # ⚠️ API keys go here
    ├── config/
    │   └── database.js         # MySQL/Sequelize config
    ├── models/
    │   └── User.js             # User database schema
    ├── routes/
    │   ├── auth.js             # Login/Register endpoints
    │   ├── user.js             # User profile endpoints
    │   ├── diet.js             # Gemini diet generation
    │   ├── exercise.js         # Gemini workout generation
    │   └── upload.js           # Menu file upload (Multer)
    ├── middleware/
    │   └── authMiddleware.js   # JWT verification
    └── uploads/                # Uploaded menu files stored here
```

---

## 🔧 Configurable Values

| File | Variable | What to change |
|------|----------|----------------|
| `server/.env` | `GEMINI_API_KEY` | Your Google Gemini API key |
| `server/.env` | `DB_*` | MySQL database credentials |
| `server/.env` | `JWT_SECRET` | Random secret string |
| `client/src/constants.js` | `APP_NAME` | Change app name from "FitLife" |
| `client/src/constants.js` | `API_BASE_URL` | Backend URL for production |
| `server/models/User.js` | `activityFactor` default | Change default activity level |
| `server/routes/exercise.js` | `exerciseVideos` | Update YouTube video IDs |

---

## 📊 Health Formulas

| Metric | Formula |
|--------|---------|
| BMR (Male) | `10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5` |
| BMR (Female) | `10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161` |
| BMI | `weight(kg) ÷ height(m)²` |
| TDEE | `BMR × activity factor` |
| Weight Loss | `TDEE − 500 kcal` |
| Weight Gain | `TDEE + 500 kcal` |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login existing user |
| GET | `/api/user/profile` | Get user profile (auth) |
| PUT | `/api/user/profile` | Update user profile (auth) |
| POST | `/api/upload/menu` | Upload menu PDF/image (auth) |
| POST | `/api/diet/generate` | Generate AI diet plan (auth) |
| POST | `/api/exercise/generate` | Generate AI workout (auth) |
| GET | `/api/health` | Server health check |

---

## 🎨 Features

- ✅ Login/Register with JWT authentication
- ✅ BMI gauge, BMR bar chart, TDEE donut chart
- ✅ Daily calorie goal calculation (Mifflin-St Jeor)
- ✅ Menu upload (PDF/image) with OCR text extraction
- ✅ Auto meal-time detection (breakfast/lunch/snacks/dinner)
- ✅ AI diet plans tailored to medical conditions
- ✅ AI workout plans with YouTube tutorial videos
- ✅ Difficulty filter (Beginner / Intermediate / Advanced)
- ✅ Dark/Light mode with localStorage persistence
- ✅ Fully mobile responsive
- ✅ Toast notifications
- ✅ Loading spinners

---

## 🔑 Getting Your Gemini API Key (Free)

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `server/.env` as `GEMINI_API_KEY=...`

The free tier gives you **60 requests/minute** — more than enough for this app.
