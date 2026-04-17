import { useMemo, useState } from 'react'
import './App.css'

const roleConfig = {
  doctor: {
    label: 'Doctor',
    note: 'Verified medical professionals only',
    dashboardTitle: 'Doctor Workspace',
    badge: 'Verified Access',
  },
  patient: {
    label: 'Patient',
    note: 'Secure patient portal access',
    dashboardTitle: 'Patient Workspace',
    badge: 'Protected Access',
  },
  pharmacy: {
    label: 'Pharmacy',
    note: 'Authorized network partner access',
    dashboardTitle: 'Pharmacy Workspace',
    badge: 'Partner Access',
  },
}

function App() {
  const [screen, setScreen] = useState('home')
  const [role, setRole] = useState('doctor')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loggedInRole, setLoggedInRole] = useState('doctor')

  const roleInfo = useMemo(() => roleConfig[role], [role])

  const goToLogin = () => {
    setError('')
    setScreen('login')
  }

  const goToHome = () => {
    setError('')
    setScreen('home')
  }

  const handleLogin = (event) => {
    event.preventDefault()

    if (!identifier.trim() || !password.trim()) {
      setError('Enter your email or mobile number and password.')
      return
    }

    setLoggedInRole(role)
    setError('')
    setScreen('dashboard')
  }

  if (screen === 'dashboard') {
    const dashboardInfo = roleConfig[loggedInRole]

    return (
      <div className="app-shell">
        <BackgroundBlobs />
        <main className="glass-panel dashboard-panel">
          <p className="eyebrow">Role-Based Access Granted</p>
          <h1>{dashboardInfo.dashboardTitle}</h1>
          <p className="subtext">You are logged in as {dashboardInfo.label}.</p>

          <div className="dashboard-card">
            <p className="card-label">Current Security Tier</p>
            <p className="card-value">{dashboardInfo.badge}</p>
          </div>

          <button className="primary-btn" type="button" onClick={goToHome}>
            Log out
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <BackgroundBlobs />

      {screen === 'home' && (
        <main className="glass-panel home-panel">
          <header className="top-nav">
            <div className="brand">
              <div className="brand-mark">RX</div>
              <p>RxSecure</p>
            </div>
            <button className="ghost-btn" type="button" onClick={goToLogin}>
              Log In
            </button>
          </header>

          <section className="hero-section">
            <p className="eyebrow">India&apos;s Trusted Health Network</p>
            <h1>Secure Digital Prescriptions for India</h1>
            <p className="subtext">
              Tamper-proof, verified, and instant QR validation across doctors,
              patients, and pharmacies.
            </p>

            <div className="cta-row">
              <button className="primary-btn" type="button" onClick={goToLogin}>
                Get Started
              </button>
              <button className="secondary-btn" type="button" onClick={goToLogin}>
                Verify Prescription
              </button>
            </div>
          </section>
        </main>
      )}

      {screen === 'login' && (
        <main className="glass-panel login-panel">
          <header className="login-header">
            <h2>Welcome Back</h2>
            <p>Select your role to continue</p>
          </header>

          <div className="role-grid" role="radiogroup" aria-label="Role selector">
            {Object.entries(roleConfig).map(([key, config]) => (
              <label
                key={key}
                className={`role-tile ${role === key ? 'is-active' : ''}`}
              >
                <input
                  type="radio"
                  name="role"
                  value={key}
                  checked={role === key}
                  onChange={(event) => setRole(event.target.value)}
                />
                <span>{config.label}</span>
              </label>
            ))}
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="identifier">Mobile Number or Email</label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter details"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
            />

            <label htmlFor="password">Password / OTP</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <p className="login-note">{roleInfo.note}</p>

            {error ? <p className="error-text">{error}</p> : null}

            <div className="login-actions">
              <button className="secondary-btn" type="button" onClick={goToHome}>
                Back
              </button>
              <button className="primary-btn" type="submit">
                Secure Login
              </button>
            </div>
          </form>
        </main>
      )}
    </div>
  )
}

function BackgroundBlobs() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  )
}

export default App
