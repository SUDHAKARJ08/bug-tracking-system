import React, { useState } from 'react'
import api from '../auth/api'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import logo_white from './image/logo_white.png'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      console.log('signup response', res.data)
      // set axios default header immediately to avoid a race where
      // the Projects page mounts and requests before the AuthContext
      // effect runs and adds the header (which causes a 401)
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      setToken(res.data.token)
      setUser(res.data.user)
      nav('/home')
    } catch (err) {
      console.error('signup error', err.response ? err.response.data : err.message)
      // optionally show a user-friendly message here
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-container">
            <img src={logo_white} alt="Pavakie logo" className="login-logo" />
          </div>
          <div className="login-header">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Sign up to get started</p>
          </div>
          <form onSubmit={submit} className="login-form">
            <div className="login-input-group">
              <input className="login-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
            </div>
            <div className="login-input-group">
              <input className="login-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" />
            </div>
            <div className="login-input-group">
              <input className="login-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="login-button-container">
              <button className="login-button" type="submit">Create account</button>
            </div>
          </form>
          <div className="login-footer">
            <p className="login-footer-text">
              Already have an account? <Link to="/login" className="login-link">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
