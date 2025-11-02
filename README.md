# Pavakie - Bug Tracking System

A professional bug tracking system with Kanban board, analytics dashboard, and modern UI.

## Features

- 🔐 Authentication (Login/Signup)
- 📊 Kanban Board (Backlog, Selected for Development, In Progress, Done)
- 📈 Analytics Dashboard with Charts
- 🎨 Professional black blurred glass UI theme
- 📁 Project Management with File Uploads
- 🏠 Home Dashboard with Status Overview

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Vite
- Tailwind CSS
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (File Uploads)

## Vercel Deployment

### Configuration
The project includes a `vercel.json` file configured for Vercel deployment:

```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deployment Steps

1. **Import Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import the repository: `https://github.com/SUDHAKARJ08/bug-tracking-system.git`

2. **Configure Project Settings**
   - **Root Directory**: Leave as default (or set to root)
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`

3. **Environment Variables** (if needed for API)
   - Add any required environment variables in Vercel dashboard
   - The backend API URL might need to be configured

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Important Notes

- The `vercel.json` handles React Router client-side routing
- All routes will redirect to `/index.html` to prevent 404 errors
- Static assets (video, images) are in `client/public/`
- The video file (`bgvideo.mp4`) is served from the public folder

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Setup

1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT_SECRET
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Access**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000/api

## Project Structure

```
.
├── client/              # React frontend
│   ├── public/          # Static assets
│   └── src/
│       ├── pages/       # Page components
│       ├── components/  # Reusable components
│       ├── auth/        # Authentication context
│       └── App.jsx      # Main app component
├── server/              # Express backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Server entry point
└── vercel.json          # Vercel configuration
```

## License

ISC

