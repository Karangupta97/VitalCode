import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const loginPageStyles = String.raw`
/* LoginPage.css - Inlined */
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f5f0 0%, #dbeafe 30%, #ede9fe 60%, #cff5f6 100%);
}

.login-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  pointer-events: none;
  animation: orb-float 14s ease-in-out infinite alternate;
}

.login-bg-orb--1 {
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, #5eead4 0%, transparent 70%);
  top: -80px;
  left: -60px;
  animation-duration: 16s;
}

.login-bg-orb--2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
  bottom: -60px;
  right: -40px;
  animation-duration: 12s;
  animation-delay: -4s;
}

.login-bg-orb--3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #c4b5fd 0%, transparent 70%);
  top: 50%;
  right: 20%;
  animation-duration: 18s;
  animation-delay: -8s;
}

.login-bg-orb--4 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #a7f3d0 0%, transparent 70%);
  bottom: 20%;
  left: 15%;
  animation-duration: 15s;
  animation-delay: -2s;
}

@keyframes orb-float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(40px, -30px) scale(1.12);
  }
  100% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 8px 40px rgba(15, 118, 110, 0.08),
    0 1.5px 0 rgba(255, 255, 255, 0.6) inset;
  animation: card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-form-panel {
  padding: 2rem 1.5rem 1.75rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-header {
  text-align: center;
}

.login-mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin: 0 auto 0.75rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(14, 165, 233, 0.1) 100%);
  border: 1px solid rgba(15, 118, 110, 0.15);
}

.login-title {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--ms-ink);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0b1e2d 0%, #0f766e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: var(--ms-muted);
  font-weight: 500;
}

.login-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.625rem;
}

.login-role-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.875rem 0.5rem;
  border-radius: 14px;
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: inherit;
  color: var(--ms-muted);
}

.login-role-btn:hover {
  border-color: rgba(15, 118, 110, 0.35);
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(15, 118, 110, 0.1);
}

.login-role-btn--active {
  border-color: var(--ms-primary);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(14, 165, 233, 0.06) 100%);
  color: var(--ms-primary);
  box-shadow:
    0 0 0 3px rgba(15, 118, 110, 0.08),
    0 6px 20px rgba(15, 118, 110, 0.12);
  transform: translateY(-2px);
}

.login-role-btn--active .login-role-icon {
  color: var(--ms-primary);
}

.login-role-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.login-role-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.login-role-check {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ms-primary);
  color: #fff;
  animation: check-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes check-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.login-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ms-ink);
  letter-spacing: -0.01em;
}

.login-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.login-input-icon {
  position: absolute;
  left: 14px;
  display: flex;
  color: var(--ms-muted);
  opacity: 0.6;
  transition: all 0.3s;
  pointer-events: none;
}

.login-input-wrap:focus-within .login-input-icon {
  color: var(--ms-primary);
  opacity: 1;
}

.login-input {
  width: 100%;
  padding: 0.8rem 0.9rem 0.8rem 2.75rem;
  border-radius: 12px;
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ms-ink);
  outline: none;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.login-input::placeholder {
  color: var(--ms-muted);
  opacity: 0.5;
}

.login-input:focus {
  border-color: var(--ms-primary);
  background: rgba(255, 255, 255, 0.85);
  box-shadow:
    0 0 0 3px rgba(15, 118, 110, 0.08),
    0 4px 12px rgba(15, 118, 110, 0.06);
}

.login-toggle-pw {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--ms-muted);
  cursor: pointer;
  transition: all 0.25s;
}

.login-toggle-pw:hover {
  background: rgba(15, 118, 110, 0.08);
  color: var(--ms-primary);
}

.login-verified-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.06) 0%, rgba(14, 165, 233, 0.04) 100%);
  border: 1px solid rgba(15, 118, 110, 0.1);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--ms-muted);
}

.login-verified-badge svg {
  color: var(--ms-primary);
  flex-shrink: 0;
}

.login-error {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 500;
  color: #e11d48;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.login-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.login-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  text-decoration: none;
  border: none;
}

.login-btn--back {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  color: var(--ms-muted);
}

.login-btn--back:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(15, 118, 110, 0.3);
  color: var(--ms-ink);
  transform: translateY(-1px);
}

.login-btn--submit {
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0ea5e9 100%);
  background-size: 200% 200%;
  color: #fff;
  box-shadow: 0 4px 16px rgba(15, 118, 110, 0.3);
  animation: gradient-shift 5s ease infinite;
}

.login-btn--submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(15, 118, 110, 0.35);
}

.login-btn--submit:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn--submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.login-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinner-spin 0.7s linear infinite;
}

@keyframes spinner-spin {
  to { transform: rotate(360deg); }
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.login-link {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--ms-primary);
  text-decoration: none;
  transition: all 0.25s;
}

.login-link:hover {
  color: var(--ms-primary-strong);
  text-decoration: underline;
}

.login-footer-divider {
  color: var(--ms-border);
  font-size: 0.7rem;
}

@media (min-width: 640px) {
  .login-form-panel {
    padding: 2.5rem 2.25rem 2rem;
  }

  .login-role-btn {
    padding: 1rem 0.75rem;
  }

  .login-title {
    font-size: 1.85rem;
  }
}

@media (min-width: 960px) {
  .login-page {
    padding: 2rem;
  }

  .login-container {
    max-width: 520px;
    border-radius: 28px;
  }

  .login-form-panel {
    padding: 2.75rem 2.5rem;
  }

  .login-title {
    font-size: 2rem;
  }

  .login-role-btn {
    padding: 1.1rem 0.75rem;
    gap: 0.4rem;
  }

  .login-role-label {
    font-size: 0.82rem;
  }
}

@media (min-width: 1200px) {
  .login-container {
    max-width: 540px;
    border-radius: 32px;
  }

  .login-form-panel {
    padding: 3rem;
  }

  .login-bg-orb--1 {
    width: 480px;
    height: 480px;
  }

  .login-bg-orb--2 {
    width: 380px;
    height: 380px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-bg-orb,
  .login-container,
  .login-role-check,
  .login-btn--submit {
    animation: none !important;
  }

  .login-role-btn,
  .login-btn,
  .login-input,
  .login-toggle-pw,
  .login-link {
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 360px) {
  .login-form-panel {
    padding: 1.5rem 1.1rem 1.25rem;
  }

  .login-role-grid {
    gap: 0.5rem;
  }

  .login-role-btn {
    padding: 0.65rem 0.35rem;
  }

  .login-role-label {
    font-size: 0.72rem;
  }

  .login-title {
    font-size: 1.4rem;
  }
}
`

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!selectedRole) newErrors.role = 'Please select a role'
    if (!EMAIL_REGEX.test(email.trim())) newErrors.email = 'Please enter a valid email address'
    if (!password.trim()) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const applyApiFieldErrors = (apiErrors = []) => {
    if (!Array.isArray(apiErrors) || apiErrors.length === 0) return

    const mappedErrors = {}
    apiErrors.forEach((error) => {
      if (error?.field === 'email') mappedErrors.email = error.message || 'Invalid email address.'
      if (error?.field === 'password') mappedErrors.password = error.message || 'Invalid password.'
      if (error?.field === 'role') mappedErrors.role = error.message || 'Please choose a valid role.'
    })

    if (Object.keys(mappedErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...mappedErrors }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setServerError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: selectedRole,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        applyApiFieldErrors(data.errors)
        const fallbackMessage = 'Unable to log in. Please review your credentials and try again.'
        setServerError(data.message || fallbackMessage)
        return
      }

      const token = data?.data?.token
      const authenticatedUser = data?.data?.user

      if (!token || !authenticatedUser) {
        setServerError('Login response is incomplete. Please try again.')
        return
      }

      localStorage.setItem('vitalcode_token', token)
      localStorage.setItem('vitalcode_user', JSON.stringify(authenticatedUser))

      const destinationByRole = {
        doctor: '/doctor-dashboard',
        patient: '/services',
        pharmacy: '/services',
      }

      navigate(destinationByRole[authenticatedUser.role] || destinationByRole[selectedRole] || '/')
    } catch (error) {
      setServerError(error.message || 'Something went wrong while contacting the server.')
    } finally {
      setIsLoading(false)
    }
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
                      setServerError('')
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
                Email Address
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
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: undefined }))
                    setServerError('')
                  }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="login-error">{errors.email}</p>}
            </div>

            <div className="login-section">
              <label className="login-label" htmlFor="login-password">
                Password
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, password: undefined }))
                    setServerError('')
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

            {serverError && <p className="login-error" role="alert">{serverError}</p>}

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
              <Link to="/register" className="login-link" id="register-link">Create Account</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{loginPageStyles}</style>
    </div>
  )
}

export default LoginPage
