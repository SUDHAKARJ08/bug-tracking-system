import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logo_white from '../pages/image/logo_white.png'

export default function Layout({ children }) {
  const { user, setToken, setUser } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  function logout() {
    setToken(null)
    setUser(null)
    nav('/login')
  }

  function isActive(path) {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app-grid container">
      <aside className="sidebar">
        <div className="sidebar-top">
          <img src={logo_white} alt="Pavakie logo" className="logo" />
          {user && <p className="muted mt-3">Signed in as<br/><strong>{user.name}</strong></p>}
        </div>

        <nav className="mt-6 sidebar-nav">
          <Link to="/home" className={`nav-link ${isActive('/home') || location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
            Projects
          </Link>
          <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
            Analytics
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="btn w-full" onClick={logout}>Logout</button>
        </div>
      </aside>

      <section className="content">
        {children}
      </section>
    </div>
  )
}
