# AI Digital Twin for Students — Placement & Career Readiness Platform

A full-stack intelligent platform that constructs a living Digital Twin for university students, predicts placement readiness, analyzes resumes with Gemini AI, and conducts interactive mock interviews.

---

## 🚀 Quick Start & Running the Project

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.21.0)
- **MongoDB**: Community Server running locally on port 27017 (or MongoDB Atlas connection string)
  - Verify MongoDB service in PowerShell: `Get-Service -Name "*mongo*"`

---

### 2. Environment Configuration

The project uses two environment files:

#### A. Root `.env` (Frontend + Root scripts)
Located at: [`.env`](file:///c:/Users/TRUPTI/Desktop/Student_Placement_Platform/.env)
```env
# Frontend (Vite) API Endpoints
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_URL=http://localhost:5000/api/v1

# Backend Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_placement_twin
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ai_digital_twin_development_jwt_secret_key_2026_secure
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=ai_digital_twin_development_jwt_refresh_secret_key_2026
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-3.6-flash
MAX_RESUME_SIZE_MB=10
RESUME_UPLOAD_DIR=uploads/resumes
```

#### B. Server `.env` (Backend Express API)
Located at: [`server/.env`](file:///c:/Users/TRUPTI/Desktop/Student_Placement_Platform/server/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_placement_twin
FRONTEND_URL=http://localhost:5173
JWT_SECRET=ai_digital_twin_development_jwt_secret_key_2026_secure
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=ai_digital_twin_development_jwt_refresh_secret_key_2026
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-3.6-flash
MAX_RESUME_SIZE_MB=10
RESUME_UPLOAD_DIR=uploads/resumes
```

*(Note: The active configuration files must be named `.env` with a leading dot. Files named `env` without a dot are ignored by Vite and dotenv.)*

---

### 3. Install Dependencies

In the root folder:
```bash
npm install
npm install --prefix server
```

---

### 4. Run Frontend & Backend Simultaneously

#### Option A: One-Click Startup (Windows)
Double-click [`start-dev.bat`](file:///c:/Users/TRUPTI/Desktop/Student_Placement_Platform/start-dev.bat) or execute [`start-dev.ps1`](file:///c:/Users/TRUPTI/Desktop/Student_Placement_Platform/start-dev.ps1).

#### Option B: Terminal Command
```bash
npm run dev:all
```

#### Option C: Run Separately
- **Frontend only**: `npm run dev` (starts on [http://localhost:5173](http://localhost:5173))
- **Backend only**: `npm run dev:server` (starts on [http://localhost:5000](http://localhost:5000))

---

## 🌐 Active Endpoints & Verification

| Service | URL | Purpose |
|---|---|---|
| **Frontend UI** | [http://localhost:5173](http://localhost:5173) | Interactive Student Placement Portal |
| **Backend API Gateway** | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) | Express REST API gateway |
| **Backend Health** | [http://localhost:5000/health](http://localhost:5000/health) | Uptime & version status |
| **Database Health** | [http://localhost:5000/health/db](http://localhost:5000/health/db) | MongoDB connection readiness |

---

## 🛠️ Testing & Building

- Run full backend integration tests: `npm run server:test`
- Build frontend for production: `npm run build`
- Build backend for production: `npm run build:server`
- Build everything: `npm run build:all`
