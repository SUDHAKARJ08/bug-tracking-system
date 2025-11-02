import React, { useState } from 'react'
import api from '../auth/api'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logo_white from './image/logo_white.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()

  async function submit(e) {
    e.preventDefault()
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.token)
    setUser(res.data.user)
    nav('/home')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-container">
            <img src={logo_white} alt="pavakie logo" className="login-logo" />
          </div>
          <div className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Log in to your account</p>
          </div>
          <form onSubmit={submit} className="login-form">
            <div className="login-input-group">
              <input className="login-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" />
            </div>
            <div className="login-input-group">
              <input className="login-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="login-button-container">
              <button className="login-button" type="submit">Log in</button>
            </div>
          </form>
          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account? <Link to="/signup" className="login-link">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
