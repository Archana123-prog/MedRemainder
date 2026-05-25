# 💊 MedRemind — Smart Prescription Manager

A full-stack MERN application that helps patients with complex prescriptions manage and remember their medication schedules.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js v18+** → https://nodejs.org
- **MongoDB Atlas account** (free) → https://mongodb.com/atlas
- **Git** (optional)

---

## 📁 Project Structure

```
MedRemind/
├── backend/          ← Express + MongoDB API
│   ├── models/       ← Mongoose schemas
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Auth middleware
│   ├── controllers/  ← Business logic
│   ├── server.js     ← Entry point
│   └── .env          ← ⚠️ Configure this!
├── frontend/         ← React + Vite app
│   ├── src/
│   │   ├── pages/    ← All page components
│   │   ├── components/
│   │   ├── context/  ← Auth context
│   │   └── utils/    ← API helper
│   └── .env          ← ⚠️ Configure this!
├── START_APP.bat     ← Windows: Double-click to run
├── start.sh          ← Mac/Linux: bash start.sh
└── README.md
```

---

## ⚙️ Setup (Step by Step)

### Step 1: Configure Environment Variables

**Backend** — Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/medremind
JWT_SECRET=any_long_random_string_here
PORT=5000
CLIENT_URL=http://localhost:5173
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Frontend** — Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Get MongoDB URI
1. Go to https://mongodb.com/atlas → Create free account
2. Create a cluster (free tier is fine)
3. Click Connect → Connect your application → Copy the URI
4. Replace `<password>` with your DB password

### Step 3: Get Gmail App Password (for email reminders)
1. Enable 2FA on your Google account
2. Go to myaccount.google.com → Security → App passwords
3. Generate a password for "Mail" → copy it
4. Paste in `EMAIL_PASS` in backend .env

### Step 4: Start the App

**Windows:** Double-click `START_APP.bat`

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/medications` | List all medications |
| POST | `/api/medications` | Add medication |
| PUT | `/api/medications/:id` | Update medication |
| DELETE | `/api/medications/:id` | Delete medication |
| GET | `/api/schedules` | List schedules |
| POST | `/api/schedules` | Create schedule |
| GET | `/api/schedules/today` | Today's schedule |
| GET | `/api/logs` | Dose history |
| POST | `/api/logs` | Log a dose |
| PATCH | `/api/logs/:id` | Mark dose taken/missed |
| GET | `/api/logs/stats` | Adherence statistics |
| GET | `/api/dashboard` | Dashboard summary |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, DaisyUI |
| Animations | GSAP 3 |
| Charts | Recharts |
| Toasts | React Hot Toast |
| Routing | React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Cron | node-cron |

---

## 🔒 Security Notes

- All passwords are bcrypt hashed (12 rounds)
- JWT tokens expire in 30 days
- All routes require authentication
- CORS configured for frontend only
- Never commit your `.env` files to git!

---

## 📱 Features

- ✅ User registration & login
- 💊 Add/edit/delete medications with full details
- ⏰ Flexible schedules (1x, 2x, 3x, 4x daily, weekly, as-needed)
- 📧 Email reminders before each dose (via nodemailer cron)
- ✅ Mark doses as taken/skipped/missed
- 📊 7/14/30 day adherence analytics with charts
- ⚠️ Low pill count alerts
- 🩺 Medical conditions & emergency contact
- 🌙 Dark theme with DaisyUI
- 📱 Fully responsive mobile-friendly UI

---

## 🐛 Troubleshooting

**MongoDB connection error:** Check MONGO_URI and ensure your IP is whitelisted in Atlas Network Access.

**Port in use:** Change PORT in backend .env or kill the process using that port.

**Email not sending:** Check Gmail app password, not your regular password.

**Frontend can't reach backend:** Ensure VITE_API_URL matches your backend PORT.

---

Made with ❤️ for patient health
