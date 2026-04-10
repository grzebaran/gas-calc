import React, { useState } from 'react'

export default function AuthForm({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await (mode === 'login' ? onSignIn(email, password) : onSignUp(email, password))
    if (error) {
      setError(error.message)
    } else if (mode === 'register') {
      setMessage('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError('')
    setMessage('')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>LPG Savings Calculator</h1>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <form onSubmit={handle} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className="btn-link" onClick={switchMode}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
