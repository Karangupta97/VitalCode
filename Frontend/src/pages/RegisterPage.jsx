import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const registerPageStyles = String.raw`
/* RegisterPage.css - Inlined, mobile-first */
.register-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 0.8rem;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f5f0 0%, #dbeafe 30%, #ede9fe 60%, #cff5f6 100%);
}

.register-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(84px);
  opacity: 0.55;
  pointer-events: none;
  animation: register-orb-float 14s ease-in-out infinite alternate;
}

.register-bg-orb--1 {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, #5eead4 0%, transparent 70%);
  top: -88px;
  left: -72px;
}

.register-bg-orb--2 {
  width: 270px;
  height: 270px;
  background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
  bottom: -66px;
  right: -46px;
  animation-duration: 12.5s;
  animation-delay: -4s;
}

.register-bg-orb--3 {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #c4b5fd 0%, transparent 70%);
  top: 42%;
  right: 12%;
  animation-duration: 17s;
  animation-delay: -8s;
}

.register-bg-orb--4 {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #a7f3d0 0%, transparent 70%);
  bottom: 12%;
  left: 10%;
  animation-duration: 15.5s;
  animation-delay: -2s;
}

@keyframes register-orb-float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(36px, -28px) scale(1.1);
  }
  100% {
    transform: translate(-20px, 18px) scale(0.96);
  }
}

.register-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 700px;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.36);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    0 8px 40px rgba(15, 118, 110, 0.08),
    0 1.5px 0 rgba(255, 255, 255, 0.62) inset;
  animation: register-card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes register-card-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.register-form-panel {
  padding: 1.35rem 1rem 1.15rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.register-header {
  text-align: center;
}

.register-mobile-logo {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  margin: 0 auto 0.72rem;
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(14, 165, 233, 0.1) 100%);
  border: 1px solid rgba(15, 118, 110, 0.15);
}

.register-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: #0f766e;
  font-weight: 700;
}

.register-title {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--ms-ink);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #0b1e2d 0%, #0f766e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  margin: 0.26rem auto 0;
  max-width: 56ch;
  font-size: 0.84rem;
  color: var(--ms-muted);
  font-weight: 500;
  line-height: 1.42;
}

.register-section {
  border: 1px solid rgba(15, 118, 110, 0.1);
  background: rgba(255, 255, 255, 0.52);
  border-radius: 15px;
  padding: 0.78rem;
}

.register-section-title {
  margin: 0 0 0.72rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--ms-ink);
  letter-spacing: -0.01em;
}

.register-role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.54rem;
}

.register-role-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.34rem;
  text-align: center;
  padding: 0.74rem 0.44rem;
  border-radius: 13px;
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  background: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.register-role-btn:hover {
  border-color: rgba(15, 118, 110, 0.33);
  background: rgba(255, 255, 255, 0.78);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(15, 118, 110, 0.08);
}

.register-role-btn:focus-visible {
  outline: 2px solid rgba(15, 118, 110, 0.35);
  outline-offset: 2px;
}

.register-role-btn--active {
  border-color: var(--ms-primary);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(14, 165, 233, 0.06) 100%);
  box-shadow:
    0 0 0 3px rgba(15, 118, 110, 0.08),
    0 6px 20px rgba(15, 118, 110, 0.12);
}

.register-role-icon {
  color: var(--ms-muted);
  display: flex;
  align-items: center;
}

.register-role-btn--active .register-role-icon {
  color: var(--ms-primary);
}

.register-role-content {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: center;
}

.register-role-title {
  font-size: 0.79rem;
  font-weight: 700;
  color: var(--ms-ink);
}

.register-role-blurb {
  display: none;
  font-size: 0.71rem;
  color: var(--ms-muted);
}

.register-role-check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  background: var(--ms-primary);
  animation: register-check-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes register-check-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.register-field-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.66rem;
}

.register-field {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}

.register-field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ms-ink);
}

.register-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.register-input-icon {
  position: absolute;
  left: 12px;
  display: flex;
  color: var(--ms-muted);
  opacity: 0.62;
  transition: all 0.28s ease;
  pointer-events: none;
}

.register-input-wrap:focus-within .register-input-icon {
  color: var(--ms-primary);
  opacity: 1;
}

.register-field input,
.register-field textarea {
  width: 100%;
  border-radius: 12px;
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  background: rgba(255, 255, 255, 0.62);
  color: var(--ms-ink);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.register-field input {
  padding: 0.74rem 0.82rem 0.74rem 2.55rem;
}

.register-field textarea {
  padding: 0.74rem 0.82rem;
  resize: vertical;
  min-height: 94px;
}

.register-field input::placeholder,
.register-field textarea::placeholder {
  color: var(--ms-muted);
  opacity: 0.52;
}

.register-field input:focus,
.register-field textarea:focus {
  outline: none;
  border-color: var(--ms-primary);
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 0 0 3px rgba(15, 118, 110, 0.08),
    0 5px 14px rgba(15, 118, 110, 0.08);
}

.register-toggle-pw {
  position: absolute;
  right: 9px;
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  color: var(--ms-muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s;
}

.register-toggle-pw:hover {
  background: rgba(15, 118, 110, 0.08);
  color: var(--ms-primary);
}

.register-helper {
  margin: 0;
  font-size: 0.72rem;
  color: var(--ms-muted);
}

.register-error {
  margin: 0;
  font-size: 0.75rem;
  color: #e11d48;
  font-weight: 500;
  animation: register-shake 0.35s ease-in-out;
}

@keyframes register-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.register-verified-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 118, 110, 0.11);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.06) 0%, rgba(14, 165, 233, 0.04) 100%);
  padding: 0.6rem 0.9rem;
  font-size: 0.78rem;
  color: var(--ms-muted);
}

.register-verified-badge svg {
  color: var(--ms-primary);
  flex-shrink: 0;
}

.register-server-error {
  margin: 0;
  font-size: 0.78rem;
  color: #be123c;
  background: rgba(190, 24, 93, 0.08);
  border: 1px solid rgba(190, 24, 93, 0.2);
  border-radius: 10px;
  padding: 0.65rem 0.76rem;
}

.register-success {
  margin: 0;
  border-radius: 10px;
  border: 1px solid rgba(15, 118, 110, 0.2);
  background: rgba(15, 118, 110, 0.08);
  padding: 0.7rem 0.8rem;
}

.register-success p {
  margin: 0;
  color: #0f4f52;
  font-size: 0.82rem;
  font-weight: 600;
}

.register-success a {
  margin-top: 0.34rem;
  display: inline-block;
  color: #0d63a5;
  font-size: 0.8rem;
  font-weight: 600;
}

.register-form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.register-btn {
  flex: 1;
  border-radius: 14px;
  padding: 0.82rem 1rem;
  border: none;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.register-btn:focus-visible,
.register-link:focus-visible,
.register-success a:focus-visible {
  outline: 2px solid rgba(15, 118, 110, 0.35);
  outline-offset: 2px;
}

.register-btn--ghost {
  border: 1.5px solid rgba(15, 118, 110, 0.15);
  background: rgba(255, 255, 255, 0.6);
  color: var(--ms-muted);
}

.register-btn--ghost:hover {
  border-color: rgba(15, 118, 110, 0.3);
  background: rgba(255, 255, 255, 0.85);
  color: var(--ms-ink);
  transform: translateY(-1px);
}

.register-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0ea5e9 100%);
  background-size: 200% 200%;
  box-shadow: 0 4px 16px rgba(15, 118, 110, 0.3);
  animation: register-gradient-shift 5s ease infinite;
}

.register-btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(15, 118, 110, 0.36);
}

.register-btn--primary:disabled {
  opacity: 0.72;
  cursor: not-allowed;
}

@keyframes register-gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.register-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.66rem;
  flex-wrap: wrap;
}

.register-link {
  font-size: 0.8rem;
  color: var(--ms-primary);
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  color: var(--ms-primary-strong);
  text-decoration: underline;
}

.register-footer-divider {
  color: var(--ms-border);
  font-size: 0.72rem;
}

@media (min-width: 480px) {
  .register-page {
    padding: 1rem;
  }

  .register-form-panel {
    padding: 1.65rem 1.35rem 1.35rem;
  }

  .register-title {
    font-size: 1.58rem;
  }

  .register-subtitle {
    font-size: 0.88rem;
  }

  .register-role-title {
    font-size: 0.81rem;
  }
}

@media (min-width: 560px) {
  .register-form-actions {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .register-form-panel {
    padding: 2.1rem 1.9rem 1.75rem;
  }

  .register-role-btn {
    min-height: 76px;
    gap: 0.38rem;
    padding: 0.86rem 0.6rem;
  }

  .register-role-blurb {
    display: block;
  }

  .register-field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .register-field--full {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .register-page {
    padding: 1.8rem;
  }

  .register-container {
    max-width: 780px;
    border-radius: 28px;
  }

  .register-form-panel {
    padding: 2.4rem 2.2rem 2rem;
  }

  .register-title {
    font-size: 1.74rem;
  }
}

.register-spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: register-spinner-spin 0.7s linear infinite;
}

@keyframes register-spinner-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .register-bg-orb,
  .register-container,
  .register-role-check,
  .register-btn--primary,
  .register-error {
    animation: none !important;
  }

  .register-role-btn,
  .register-btn,
  .register-field input,
  .register-field textarea,
  .register-toggle-pw,
  .register-link,
  .register-success a {
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 360px) {
  .register-form-panel {
    padding: 1.2rem 0.85rem 1rem;
  }

  .register-title {
    font-size: 1.3rem;
  }

  .register-role-btn {
    padding: 0.68rem 0.64rem;
  }
}
`

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const ROLE_OPTIONS = [
  {
    id: 'patient',
    label: 'Patient',
    blurb: 'Secure personal access',
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
        <circle cx='12' cy='7' r='4' />
      </svg>
    ),
  },
  {
    id: 'doctor',
    label: 'Doctor',
    blurb: 'Clinical professional onboarding',
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M14.5 2H9a2 2 0 00-2 2v16a2 2 0 002 2h6a2 2 0 002-2V6.5L14.5 2z' />
        <path d='M14 2v5h5' />
        <path d='M10 13h4' />
        <path d='M12 11v4' />
      </svg>
    ),
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    blurb: 'License-verified dispensing setup',
    icon: (
      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M3 3h18v18H3z' />
        <path d='M12 8v8' />
        <path d='M8 12h8' />
      </svg>
    ),
  },
]

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AADHAAR_REGEX = /^\d{12}$/

const INITIAL_FORM = {
  role: 'patient',
  email: '',
  password: '',
  aadhaarNumber: '',
  fullName: '',
  medicalLicenseNumber: '',
  specialization: '',
  hospitalOrClinicName: '',
  pharmacyName: '',
  pharmacyLicenseNumber: '',
  pharmacyAddress: '',
}

const RegisterPage = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [verificationLink, setVerificationLink] = useState('')
  const [serverError, setServerError] = useState('')

  const selectedRoleLabel = useMemo(() => {
    return ROLE_OPTIONS.find((role) => role.id === form.role)?.label || 'User'
  }, [form.role])

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setServerError('')
  }

  const handleRoleChange = (roleId) => {
    setForm((prev) => ({ ...prev, role: roleId }))
    setErrors((prev) => ({ ...prev, role: undefined }))
    setServerError('')
    setSuccessMessage('')
    setVerificationLink('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!PASSWORD_REGEX.test(form.password)) {
      nextErrors.password = 'Use 8+ chars with uppercase, lowercase, number, and symbol.'
    }

    if (!AADHAAR_REGEX.test(form.aadhaarNumber.trim())) {
      nextErrors.aadhaarNumber = 'Aadhaar number must contain exactly 12 digits.'
    }

    if (form.role === 'doctor') {
      if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required for doctor signup.'
      if (!form.medicalLicenseNumber.trim()) nextErrors.medicalLicenseNumber = 'Medical license number is required.'
      if (!form.specialization.trim()) nextErrors.specialization = 'Specialization is required.'
      if (!form.hospitalOrClinicName.trim()) nextErrors.hospitalOrClinicName = 'Hospital or clinic name is required.'
    }

    if (form.role === 'pharmacy') {
      if (!form.pharmacyName.trim()) nextErrors.pharmacyName = 'Pharmacy name is required.'
      if (!form.pharmacyLicenseNumber.trim()) nextErrors.pharmacyLicenseNumber = 'Pharmacy license number is required.'
      if (!form.pharmacyAddress.trim()) nextErrors.pharmacyAddress = 'Address is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const buildPayload = () => {
    const basePayload = {
      role: form.role,
      email: form.email.trim(),
      password: form.password,
      aadhaarNumber: form.aadhaarNumber.trim(),
    }

    if (form.role === 'doctor') {
      return {
        ...basePayload,
        fullName: form.fullName.trim(),
        medicalLicenseNumber: form.medicalLicenseNumber.trim(),
        specialization: form.specialization.trim(),
        hospitalOrClinicName: form.hospitalOrClinicName.trim(),
      }
    }

    if (form.role === 'pharmacy') {
      return {
        ...basePayload,
        pharmacyName: form.pharmacyName.trim(),
        pharmacyLicenseNumber: form.pharmacyLicenseNumber.trim(),
        pharmacyAddress: form.pharmacyAddress.trim(),
      }
    }

    return basePayload
  }

  const applyApiFieldErrors = (apiErrors = []) => {
    if (!Array.isArray(apiErrors) || apiErrors.length === 0) return

    const mappedErrors = {}
    apiErrors.forEach((error) => {
      if (error?.field && !mappedErrors[error.field]) {
        mappedErrors[error.field] = error.message || 'Invalid value.'
      }
    })

    if (Object.keys(mappedErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...mappedErrors }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setServerError('')
    setSuccessMessage('')
    setVerificationLink('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayload()),
      })

      const data = await response.json()

      if (!response.ok) {
        applyApiFieldErrors(data.errors)
        const fallbackMessage = 'Unable to register account. Please review your details and try again.'
        setServerError(data.message || fallbackMessage)
        return
      }

      setSuccessMessage(data.message || 'Signup successful. Check your email for verification.')
      setVerificationLink(data.developmentVerificationLink || '')
      setForm((prev) => ({ ...prev, password: '' }))
    } catch (error) {
      setServerError(error.message || 'Something went wrong while creating your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='register-page'>
      <div className='register-bg-orb register-bg-orb--1' />
      <div className='register-bg-orb register-bg-orb--2' />
      <div className='register-bg-orb register-bg-orb--3' />
      <div className='register-bg-orb register-bg-orb--4' />

      <div className='register-container'>
        <div className='register-form-panel'>
          <form className='register-form' onSubmit={handleSubmit} noValidate>
            <header className='register-header'>
              <div className='register-mobile-logo'>
                <svg width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='var(--ms-primary)' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3.332.86-4.5 2.17C10.832 3.86 9.26 3 7.5 3A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
                </svg>
              </div>
              <p className='register-kicker'>VitalCode Access</p>
              <h1 className='register-title'>Create {selectedRoleLabel} Account</h1>
              <p className='register-subtitle'>Professional, secure onboarding with email verification and role-based access control.</p>
            </header>

            <section className='register-section'>
              <h2 className='register-section-title'>Select Role</h2>
              <div className='register-role-grid'>
                {ROLE_OPTIONS.map((role) => (
                  <button
                    key={role.id}
                    type='button'
                    className={`register-role-btn ${form.role === role.id ? 'register-role-btn--active' : ''}`}
                    onClick={() => handleRoleChange(role.id)}
                    aria-pressed={form.role === role.id}
                  >
                    <span className='register-role-icon'>{role.icon}</span>
                    <span className='register-role-content'>
                      <span className='register-role-title'>{role.label}</span>
                      <span className='register-role-blurb'>{role.blurb}</span>
                    </span>
                    {form.role === role.id && (
                      <span className='register-role-check'>
                        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
                          <polyline points='20 6 9 17 4 12' />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className='register-section'>
              <h2 className='register-section-title'>Credentials</h2>
              <div className='register-field-grid'>
                <div className='register-field register-field--full'>
                  <label htmlFor='register-email'>Email</label>
                  <div className='register-input-wrap'>
                    <span className='register-input-icon'>
                      <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M4 4h16v16H4z' />
                        <path d='M4 8l8 6 8-6' />
                      </svg>
                    </span>
                    <input
                      id='register-email'
                      type='email'
                      value={form.email}
                      onChange={(event) => updateForm('email', event.target.value)}
                      placeholder='you@example.com'
                      autoComplete='email'
                    />
                  </div>
                  {errors.email && <p className='register-error'>{errors.email}</p>}
                </div>

                <div className='register-field'>
                  <label htmlFor='register-password'>Password</label>
                  <div className='register-input-wrap'>
                    <span className='register-input-icon'>
                      <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                        <path d='M7 11V7a5 5 0 0110 0v4' />
                      </svg>
                    </span>
                    <input
                      id='register-password'
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(event) => updateForm('password', event.target.value)}
                      placeholder='Strong password'
                      autoComplete='new-password'
                    />
                    <button
                      type='button'
                      className='register-toggle-pw'
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24' />
                          <line x1='1' y1='1' x2='23' y2='23' />
                        </svg>
                      ) : (
                        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                          <circle cx='12' cy='12' r='3' />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className='register-helper'>8+ chars with upper, lower, number, and symbol.</p>
                  {errors.password && <p className='register-error'>{errors.password}</p>}
                </div>

                <div className='register-field'>
                  <label htmlFor='register-aadhaar'>Aadhaar Number</label>
                  <div className='register-input-wrap'>
                    <span className='register-input-icon'>
                      <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <rect x='4' y='3' width='16' height='18' rx='2' />
                        <line x1='8' y1='8' x2='16' y2='8' />
                        <line x1='8' y1='12' x2='16' y2='12' />
                        <line x1='8' y1='16' x2='13' y2='16' />
                      </svg>
                    </span>
                    <input
                      id='register-aadhaar'
                      type='text'
                      value={form.aadhaarNumber}
                      onChange={(event) => updateForm('aadhaarNumber', event.target.value)}
                      placeholder='12-digit Aadhaar'
                      maxLength={12}
                      inputMode='numeric'
                    />
                  </div>
                  {errors.aadhaarNumber && <p className='register-error'>{errors.aadhaarNumber}</p>}
                </div>
              </div>
            </section>

            {form.role === 'doctor' && (
              <section className='register-section'>
                <h2 className='register-section-title'>Doctor Details</h2>
                <div className='register-field-grid'>
                  <div className='register-field'>
                    <label htmlFor='register-full-name'>Full Name</label>
                    <input
                      id='register-full-name'
                      type='text'
                      value={form.fullName}
                      onChange={(event) => updateForm('fullName', event.target.value)}
                      placeholder='Doctor full name'
                    />
                    {errors.fullName && <p className='register-error'>{errors.fullName}</p>}
                  </div>

                  <div className='register-field'>
                    <label htmlFor='register-medical-license'>Medical License Number</label>
                    <input
                      id='register-medical-license'
                      type='text'
                      value={form.medicalLicenseNumber}
                      onChange={(event) => updateForm('medicalLicenseNumber', event.target.value)}
                      placeholder='Medical license ID'
                    />
                    {errors.medicalLicenseNumber && <p className='register-error'>{errors.medicalLicenseNumber}</p>}
                  </div>

                  <div className='register-field'>
                    <label htmlFor='register-specialization'>Specialization</label>
                    <input
                      id='register-specialization'
                      type='text'
                      value={form.specialization}
                      onChange={(event) => updateForm('specialization', event.target.value)}
                      placeholder='e.g. Cardiology'
                    />
                    {errors.specialization && <p className='register-error'>{errors.specialization}</p>}
                  </div>

                  <div className='register-field'>
                    <label htmlFor='register-hospital'>Hospital or Clinic Name</label>
                    <input
                      id='register-hospital'
                      type='text'
                      value={form.hospitalOrClinicName}
                      onChange={(event) => updateForm('hospitalOrClinicName', event.target.value)}
                      placeholder='Hospital or clinic'
                    />
                    {errors.hospitalOrClinicName && <p className='register-error'>{errors.hospitalOrClinicName}</p>}
                  </div>
                </div>
              </section>
            )}

            {form.role === 'pharmacy' && (
              <section className='register-section'>
                <h2 className='register-section-title'>Pharmacy Details</h2>
                <div className='register-field-grid'>
                  <div className='register-field'>
                    <label htmlFor='register-pharmacy-name'>Pharmacy Name</label>
                    <input
                      id='register-pharmacy-name'
                      type='text'
                      value={form.pharmacyName}
                      onChange={(event) => updateForm('pharmacyName', event.target.value)}
                      placeholder='Pharmacy name'
                    />
                    {errors.pharmacyName && <p className='register-error'>{errors.pharmacyName}</p>}
                  </div>

                  <div className='register-field'>
                    <label htmlFor='register-pharmacy-license'>License Number</label>
                    <input
                      id='register-pharmacy-license'
                      type='text'
                      value={form.pharmacyLicenseNumber}
                      onChange={(event) => updateForm('pharmacyLicenseNumber', event.target.value)}
                      placeholder='Pharmacy license ID'
                    />
                    {errors.pharmacyLicenseNumber && <p className='register-error'>{errors.pharmacyLicenseNumber}</p>}
                  </div>

                  <div className='register-field register-field--full'>
                    <label htmlFor='register-pharmacy-address'>Address</label>
                    <textarea
                      id='register-pharmacy-address'
                      value={form.pharmacyAddress}
                      onChange={(event) => updateForm('pharmacyAddress', event.target.value)}
                      placeholder='Registered pharmacy address'
                      rows={3}
                    />
                    {errors.pharmacyAddress && <p className='register-error'>{errors.pharmacyAddress}</p>}
                  </div>
                </div>
              </section>
            )}

            <div className='register-verified-badge'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
              </svg>
              <span>Email verification required before first login</span>
            </div>

            {serverError && <p className='register-server-error' role='alert'>{serverError}</p>}

            {successMessage && (
              <div className='register-success' role='status'>
                <p>{successMessage}</p>
                {verificationLink && (
                  <a href={verificationLink} target='_blank' rel='noreferrer'>
                    Open development verification link
                  </a>
                )}
              </div>
            )}

            <div className='register-form-actions'>
              <Link to='/login' className='register-btn register-btn--ghost'>
                Back to Login
              </Link>
              <button className='register-btn register-btn--primary' type='submit' disabled={isSubmitting}>
                {isSubmitting ? <span className='register-spinner' /> : `Create ${selectedRoleLabel} Account`}
              </button>
            </div>

            <div className='register-footer'>
              <Link to='/' className='register-link'>Back to Home</Link>
              <span className='register-footer-divider'>•</span>
              <Link to='/login' className='register-link'>Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{registerPageStyles}</style>
    </div>
  )
}

export default RegisterPage
