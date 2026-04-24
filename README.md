# 🐾 PetCare - Enterprise Pet Care SaaS Platform

A full-stack, production-ready pet care management system built with the MERN stack.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3, Framer Motion, Zustand |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB (Atlas for production, In-Memory for dev) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| AI | Custom rule-based pet care recommendation engine |

## 📦 Features

- **Landing Page** — Premium hero, feature grid, service cards with pricing
- **Auth System** — Register/Login with JWT, password hashing, session persistence
- **SaaS Dashboard** — Collapsible sidebar, stat cards, quick actions, AI tips widget
- **Pet Management** — Full CRUD with breed, weight, allergies, vaccination tracking
- **Smart Scheduling** — Book appointments with service types, time slots, status management
- **Task Manager** — Daily care tasks with priority levels, toggle complete, pending/done sections
- **AI Health Advisor** — Personalized care recommendations based on pet profile
- **Settings** — Profile editing, notification toggles, password management

## 🛠️ Local Development

### Backend
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
# Uses in-memory MongoDB automatically
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## 🌐 Deployment

### Frontend → Vercel
1. Push `frontend/` to a GitHub repo
2. Import in Vercel, set root directory to `frontend`
3. Add env var: `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. Deploy

### Backend → Render
1. Push `backend/` to a GitHub repo
2. Create a new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add env vars: `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`, `NODE_ENV=production`

### Database → MongoDB Atlas (Free Tier)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist `0.0.0.0/0` for network access
5. Copy the connection string and paste it as `MONGODB_URI`

## 📁 Project Structure

```
petcare-system/
├── backend/
│   ├── config/db.js          # Smart DB connection (Atlas or In-Memory)
│   ├── controllers/          # Auth, Pet, Appointment, Task controllers
│   ├── middleware/            # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express API routes
│   ├── utils/aiTips.js       # AI recommendation engine
│   └── server.js             # Express + Socket.io entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, Hero, Features, Services, Footer
│   │   ├── layouts/          # DashboardLayout (protected)
│   │   ├── pages/            # Home, Login, Register, Dashboard, Pets, Schedule, Tasks, HealthAdvisor, Settings
│   │   ├── store/            # Zustand auth store
│   │   └── utils/            # Axios API interceptor
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

## 📄 License

MIT
