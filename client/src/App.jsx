import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import AuthProvider, { useAuth } from './auth/AuthContext'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" />
  return children
}

function PublicRoute({ children }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/home" />
  return children
}

function AppContent() {
  const location = useLocation()
  const { token } = useAuth()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="app-bg min-h-screen">
      <video 
        className="bg-video" 
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <div className="app-overlay"></div>
      <div className="app-content-wrapper">
      <div className="container">
        {!isAuthPage && (
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Pavakie</h1>
            <nav className="flex gap-4">
              <Link to="/home" className="muted">Home</Link>
              <Link to="/projects" className="muted">Projects</Link>
              <Link to="/analytics" className="muted">Analytics</Link>
            </nav>
          </header>
        )}

        <main>
          <Routes>
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/home" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><Layout><Projects /></Layout></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><Layout><ProjectDetail /></Layout></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
