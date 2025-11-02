# Bug Tracker Pro - Server

Setup

1. Copy `.env.example` to `.env` and edit values (MONGO_URI, JWT_SECRET).
2. Install dependencies and run in dev mode:

```powershell
cd server
npm install
npm run dev
```

API endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET/POST /api/projects
- GET/POST/PUT/DELETE /api/bugs
- GET/POST /api/comments
- GET /api/analytics/*

