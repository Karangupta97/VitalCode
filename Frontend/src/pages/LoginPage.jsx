import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'

const ROLES = [
  {
    id: 'doctor',
    label: 'Doctor',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
        <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/>
        <circle cx="20" cy="10" r="2"/>
      </svg>
    ),
  },
  {
    id: 'patient',
    label: 'Patient',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"/>
        <path d="M12 8v8"/>
        <path d="M8 12h8"/>
      </svg>
    ),
  },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!selectedRole) newErrors.role = 'Please select a role'
    if (!loginId.trim()) newErrors.loginId = 'Mobile number or email is required'
    if (!password.trim()) newErrors.password = 'Password or OTP is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    // Development mode: accept any entered credentials and continue.
    setTimeout(() => {
      setIsLoading(false)
      navigate('/doctor-dashboard')
    }, 1800)
  }

  return (
    <div className="login-page">
      {/* Animated Background Orbs */}
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />
      <div className="login-bg-orb login-bg-orb--3" />
      <div className="login-bg-orb login-bg-orb--4" />

      <div className="login-container">
        {/* Login Form Panel */}
        <div className="login-form-panel">
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Header */}
            <div className="login-header">
              {/* Mobile-only logo */}
              <div className="login-mobile-logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ms-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3.332.86-4.5 2.17C10.832 3.86 9.26 3 7.5 3A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Select your role to continue</p>
            </div>

            {/* Role Selector */}
            <div className="login-section">
              <div className="login-role-grid">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`login-role-btn ${selectedRole === role.id ? 'login-role-btn--active' : ''}`}
                    onClick={() => {
                      setSelectedRole(role.id)
                      setErrors((prev) => ({ ...prev, role: undefined }))
                    }}
                    aria-pressed={selectedRole === role.id}
                    id={`role-btn-${role.id}`}
                  >
                    <span className="login-role-icon">{role.icon}</span>
                    <span className="login-role-label">{role.label}</span>
                    {selectedRole === role.id && (
                      <span className="login-role-check">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {errors.role && <p className="login-error">{errors.role}</p>}
            </div>

            {/* Input Fields */}
            <div className="login-section">
              <label className="login-label" htmlFor="login-id">
                Mobile Number or Email
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <input
                  id="login-id"
                  type="text"
                  className="login-input"
                  placeholder="Enter mobile or email"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value)
                    setErrors((prev) => ({ ...prev, loginId: undefined }))
                  }}
                  autoComplete="username"
                />
              </div>
              {errors.loginId && <p className="login-error">{errors.loginId}</p>}
            </div>

            <div className="login-section">
              <label className="login-label" htmlFor="login-password">
                Password / OTP
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter password or OTP"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  id="toggle-password-btn"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="login-error">{errors.password}</p>}
            </div>

            {/* Verified badge */}
            <div className="login-verified-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Verified medical professionals only</span>
            </div>

            {/* Actions */}
            <div className="login-actions">
              <Link to="/" className="login-btn login-btn--back" id="back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </Link>
              <button
                type="submit"
                className="login-btn login-btn--submit"
                disabled={isLoading}
                id="secure-login-btn"
              >
                {isLoading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Secure Login
                  </>
                )}
              </button>
            </div>

            {/* Footer links */}
            <div className="login-footer">
              <a href="#" className="login-link" id="forgot-password-link">Forgot Password?</a>
              <span className="login-footer-divider">•</span>
              <a href="#" className="login-link" id="request-otp-link">Request OTP</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
