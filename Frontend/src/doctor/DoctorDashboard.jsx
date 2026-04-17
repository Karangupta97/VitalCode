import React, { useEffect, useRef, useState } from 'react'
import {
  LuBadgeCheck,
  LuClipboardCheck,
  LuLayoutDashboard,
  LuLogOut,
  LuPill,
  LuSettings,
  LuShieldCheck,
  LuSiren,
  LuSquareUserRound,
  LuStore,
} from 'react-icons/lu'
import './doctor-dashboard.css'

const DoctorDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Dr. Sara Abraham',
    specialty: 'General Physician',
    licenseNumber: 'MCI12345',
    experience: '8 years',
    clinic: 'Health Plus Clinic',
    phone: '+91-9876543210',
    email: 'sara.abraham@vitalcode.com',
  })

  const [licenseVerified, setLicenseVerified] = useState(true)
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patientName: 'John Doe', patientId: 'P001', date: '2024-04-15', status: 'given' },
    { id: 2, patientName: 'Jane Smith', patientId: 'P002', date: '2024-04-14', status: 'given' },
    { id: 3, patientName: 'Mike Johnson', patientId: 'P003', date: '2024-04-13', status: 'pending' },
  ])

  const [patientAccess, setPatientAccess] = useState([
    { patientId: 'P001', name: 'John Doe', access: true, lastAccess: '2024-04-15' },
    { patientId: 'P002', name: 'Jane Smith', access: true, lastAccess: '2024-04-14' },
    { patientId: 'P003', name: 'Mike Johnson', access: false, lastAccess: 'Never' },
    { patientId: 'P004', name: 'Sarah Wilson', access: true, lastAccess: '2024-04-13' },
  ])

  const [emergencyCases, setEmergencyCases] = useState([
    { id: 1, patientName: 'Tom Brown', patientId: 'P005', severity: 'high', status: 'authorized', accessReason: 'Critical condition' },
    { id: 2, patientName: 'Emma Davis', patientId: 'P006', severity: 'medium', status: 'pending', accessReason: 'Emergency consultation' },
  ])

  const [pharmacyConnection, setPharmacyConnection] = useState([
    { id: 1, pharmacyName: 'Health Plus Pharmacy', medication: 'Amoxicillin 500mg', quantity: 30, status: 'available', price: '₹150' },
    { id: 2, pharmacyName: 'MedCare Pharmacy', medication: 'Metformin 500mg', quantity: 5, status: 'low-stock', price: '₹120' },
    { id: 3, pharmacyName: 'Care Plus Pharmacy', medication: 'Lisinopril 10mg', quantity: 90, status: 'available', price: '₹180' },
  ])

  const [newApplicants] = useState([
    { id: 1, name: 'Mike Tyson', specialty: 'Cardiologist' },
    { id: 2, name: 'Sara Thomas', specialty: 'Neurologist' },
    { id: 3, name: 'Jeremy Abraham', specialty: 'Orthopedic' },
    { id: 4, name: 'John Samuel', specialty: 'Dentist' },
  ])

  const togglePatientAccess = (patientId) => {
    setPatientAccess(prev =>
      prev.map(p =>
        p.patientId === patientId
          ? { ...p, access: !p.access, lastAccess: !p.access ? 'Just now' : 'Never' }
          : p
      )
    )
  }

  const authorizeEmergency = (id) => {
    setEmergencyCases(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, status: e.status === 'authorized' ? 'pending' : 'authorized' }
          : e
      )
    )
  }

  const verifyLicense = () => {
    setLicenseVerified(!licenseVerified)
  }

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocumentClick)
    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
    }
  }, [])

  return (
    <div className="doctor-dashboard-container">
      {/* Left Sidebar */}
      <aside className="doctor-sidebar">
        <div className="sidebar-header">
          <h2>Hireism</h2>
          <span className="search-icon">🔍</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="nav-icon" aria-hidden="true"><LuLayoutDashboard /></span>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveSection('prescriptions')}
          >
            <span className="nav-icon" aria-hidden="true"><LuPill /></span>
            <span>Prescriptions</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'patient-access' ? 'active' : ''}`}
            onClick={() => setActiveSection('patient-access')}
          >
            <span className="nav-icon" aria-hidden="true"><LuShieldCheck /></span>
            <span>Patient Access</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveSection('emergency')}
          >
            <span className="nav-icon" aria-hidden="true"><LuSiren /></span>
            <span>Emergency</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'pharmacy' ? 'active' : ''}`}
            onClick={() => setActiveSection('pharmacy')}
          >
            <span className="nav-icon" aria-hidden="true"><LuStore /></span>
            <span>Pharmacy</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <span className="nav-icon" aria-hidden="true"><LuSettings /></span>
            <span>Settings</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'license' ? 'active' : ''}`}
            onClick={() => setActiveSection('license')}
          >
            <span className="nav-icon" aria-hidden="true"><LuBadgeCheck /></span>
            <span>License</span>
          </button>
          <button className="nav-item logout-btn" onClick={onLogout}>
            <span className="nav-icon" aria-hidden="true"><LuLogOut /></span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Good Morning Sara</h1>
            <p>Here are your updates for today</p>
          </div>
          <div className="header-right">
            <input type="text" placeholder="Search something" className="search-input" />
            <button className="add-new-btn">+ Add New</button>

            <div className="profile-menu" ref={profileMenuRef}>
              <button
                type="button"
                className="user-avatar-header"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-expanded={isProfileOpen}
                aria-label="Open doctor profile details"
              >
                SA
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-top">
                    <div className="profile-avatar-lg">SA</div>
                    <div>
                      <h4>{doctorInfo.name}</h4>
                      <p>{doctorInfo.specialty}</p>
                    </div>
                  </div>

                  <div className="profile-meta">
                    <p>
                      License: <strong>{doctorInfo.licenseNumber}</strong>
                    </p>
                    <p>
                      Status:{' '}
                      <strong className={licenseVerified ? 'is-verified' : 'is-unverified'}>
                        {licenseVerified ? 'Verified' : 'Unverified'}
                      </strong>
                    </p>
                  </div>

                  <div className="profile-actions">
                    <button
                      type="button"
                      className="profile-action-btn"
                      onClick={() => {
                        setActiveSection('settings')
                        setIsProfileOpen(false)
                      }}
                    >
                      Profile Details
                    </button>
                    <button
                      type="button"
                      className="profile-action-btn verify"
                      onClick={() => {
                        setActiveSection('license')
                        setIsProfileOpen(false)
                      }}
                    >
                      Verify License
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="dashboard-content">
          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <section className="content-section">
              <div className="banner">
                <div className="banner-glow banner-glow-1" aria-hidden="true" />
                <div className="banner-glow banner-glow-2" aria-hidden="true" />

                <div className="banner-text">
                  <p className="hero-kicker">Doctor Command Center</p>
                  <h2>Good Morning Sara</h2>
                  <p>
                    Review patient requests, authorize emergency access, and issue
                    prescriptions with a secure, real-time workflow.
                  </p>

                  <div className="hero-actions">
                    <button className="banner-btn">Start Round</button>
                    <button className="banner-btn-secondary">Open Queue</button>
                  </div>

                  <div className="hero-metrics">
                    <div className="metric-pill">
                      <span className="metric-pill-label">Pending Cases</span>
                      <span className="metric-pill-value">12</span>
                    </div>
                    <div className="metric-pill">
                      <span className="metric-pill-label">Emergency Alerts</span>
                      <span className="metric-pill-value">2</span>
                    </div>
                  </div>
                </div>

                <div className="banner-visual">
                  <div className="visual-card">
                    <p>Today&apos;s Appointments</p>
                    <h4>24</h4>
                    <span>8 waiting confirmations</span>
                  </div>
                  <div className="visual-card visual-card-soft">
                    <p>Prescription Clearance</p>
                    <h4>91%</h4>
                    <span>3 pending approvals</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* You Need to Hire */}
                <div className="grid-section">
                  <h3>You Need to Hire</h3>
                  <div className="cards-grid">
                    <div className="hire-card">
                      <span className="hire-icon">👨‍⚕️</span>
                      <p>Senior Doctors</p>
                      <small>4 Candidates</small>
                    </div>
                    <div className="hire-card">
                      <span className="hire-icon">👩‍⚕️</span>
                      <p>Nurses</p>
                      <small>8 Candidates</small>
                    </div>
                    <div className="hire-card">
                      <span className="hire-icon">👨‍🔬</span>
                      <p>Lab Technicians</p>
                      <small>12 Candidates</small>
                    </div>
                    <div className="hire-card">
                      <span className="hire-icon">👨‍💼</span>
                      <p>Administrators</p>
                      <small>6 Candidates</small>
                    </div>
                  </div>
                  <button className="view-all-btn">View All</button>
                </div>

                {/* Recruitment Progress */}
                <div className="grid-section">
                  <h3>Recruitment Progress</h3>
                  <div className="progress-table">
                    <table>
                      <tbody>
                        <tr>
                          <td>John Doe</td>
                          <td>UI/UX Designer</td>
                          <td><span className="badge badge-success">Final Interview</span></td>
                        </tr>
                        <tr>
                          <td>Sarah Smith</td>
                          <td>UI/UX Designer</td>
                          <td><span className="badge badge-pending">Task</span></td>
                        </tr>
                        <tr>
                          <td>Sam Emmanuel</td>
                          <td>UI/UX Designer</td>
                          <td><span className="badge badge-pending">Task</span></td>
                        </tr>
                        <tr>
                          <td>John Samuel</td>
                          <td>PHP Developer</td>
                          <td><span className="badge badge-pending">Resume Review</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="view-all-btn">View All</button>
                </div>
              </div>
            </section>
          )}

          {/* Prescriptions */}
          {activeSection === 'prescriptions' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Prescription Management</h2>
                <button className="add-new-btn">+ New Prescription</button>
              </div>
              <div className="prescription-table">
                <table>
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Patient ID</th>
                      <th>Date Issued</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map(p => (
                      <tr key={p.id}>
                        <td>{p.patientName}</td>
                        <td>{p.patientId}</td>
                        <td>{p.date}</td>
                        <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                        <td>
                          <button className="action-link">View</button>
                          <button className="action-link">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Patient Access */}
          {activeSection === 'patient-access' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Patient Access Authorization</h2>
                <p className="section-subtitle">Control which patients can share their records with you</p>
              </div>
              <div className="access-grid">
                {patientAccess.map(patient => (
                  <div key={patient.patientId} className="access-card">
                    <div className="access-card-header">
                      <div className="patient-avatar">{patient.name.charAt(0)}</div>
                      <div className="patient-details">
                        <h3>{patient.name}</h3>
                        <p>ID: {patient.patientId}</p>
                      </div>
                    </div>
                    <p className="last-access">Last Access: <strong>{patient.lastAccess}</strong></p>
                    <button
                      className={`access-btn ${patient.access ? 'granted' : 'denied'}`}
                      onClick={() => togglePatientAccess(patient.patientId)}
                    >
                      {patient.access ? '✓ Access Granted' : '✗ Access Denied'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Emergency Access */}
          {activeSection === 'emergency' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Emergency Access - Patient Authorization</h2>
                <p className="section-subtitle">Senior emergency situations with patient consent</p>
              </div>
              <div className="emergency-grid">
                {emergencyCases.map(emergency => (
                  <div key={emergency.id} className={`emergency-card severity-${emergency.severity}`}>
                    <div className="emergency-badge">{emergency.severity.toUpperCase()}</div>
                    <h3>{emergency.patientName}</h3>
                    <p>Patient ID: {emergency.patientId}</p>
                    <p className="reason">Reason: {emergency.accessReason}</p>
                    <p className="status-text">
                      Status: <strong className={`status-${emergency.status}`}>{emergency.status}</strong>
                    </p>
                    <button
                      className={`auth-btn ${emergency.status === 'authorized' ? 'revoke' : 'authorize'}`}
                      onClick={() => authorizeEmergency(emergency.id)}
                    >
                      {emergency.status === 'authorized' ? 'Revoke Access' : 'Authorize Access'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pharmacy Connection */}
          {activeSection === 'pharmacy' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Pharmacy Connection - Stock Availability</h2>
                <p className="section-subtitle">Check medication availability and arrange stocks</p>
              </div>
              <div className="pharmacy-grid">
                {pharmacyConnection.map(pharmacy => (
                  <div key={pharmacy.id} className="pharmacy-card">
                    <h3>{pharmacy.pharmacyName}</h3>
                    <p className="medication"><strong>Medication:</strong> {pharmacy.medication}</p>
                    <p className="quantity"><strong>Quantity:</strong> {pharmacy.quantity} units</p>
                    <p className="price"><strong>Price:</strong> {pharmacy.price}</p>
                    <div className="stock-status">
                      <span className={`stock-badge ${pharmacy.status}`}>
                        {pharmacy.status === 'available' ? '✓ In Stock' : '⚠ Low Stock'}
                      </span>
                    </div>
                    <div className="pharmacy-actions">
                      <button className="pharmacy-btn primary">Request Stock</button>
                      <button className="pharmacy-btn secondary">Direct Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interview Tool */}
          {activeSection === 'interview-tool' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Interview Tool</h2>
              </div>
              <div className="feature-placeholder">
                <p>Interview scheduling and management tool coming soon</p>
              </div>
            </section>
          )}

          {/* Assessments */}
          {activeSection === 'assessments' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Assessments</h2>
              </div>
              <div className="feature-placeholder">
                <p>Assessment management tool coming soon</p>
              </div>
            </section>
          )}

          {/* Settings */}
          {activeSection === 'settings' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Doctor Details & Settings</h2>
              </div>
              <div className="settings-card">
                <div className="settings-header">
                  <div className="doctor-avatar-large">SA</div>
                  <div className="doctor-header-info">
                    <h2>{doctorInfo.name}</h2>
                    <p>{doctorInfo.specialty}</p>
                  </div>
                </div>

                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={doctorInfo.name} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Specialty</label>
                    <input type="text" value={doctorInfo.specialty} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input type="text" value={doctorInfo.licenseNumber} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Experience</label>
                    <input type="text" value={doctorInfo.experience} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Clinic Name</label>
                    <input type="text" value={doctorInfo.clinic} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={doctorInfo.phone} readOnly className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={doctorInfo.email} readOnly className="form-input" />
                  </div>
                </div>

                <div className="settings-actions">
                  <button className="btn-primary">Edit Profile</button>
                  <button className="btn-secondary">Change Password</button>
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => setActiveSection('license')}
                  >
                    Open License Verification
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* License Verification */}
          {activeSection === 'license' && (
            <section className="content-section">
              <div className="section-header">
                <h2>Doctor License Verification</h2>
              </div>
              <div className="license-card">
                <div className={`license-status ${licenseVerified ? 'verified' : 'unverified'}`}>
                  <div className="license-status-icon">
                    {licenseVerified ? '✓' : '✗'}
                  </div>
                  <div className="license-status-text">
                    <h3>{licenseVerified ? 'License Verified' : 'License Unverified'}</h3>
                    <p>{licenseVerified ? 'Your medical license is verified and active' : 'Your medical license needs verification'}</p>
                  </div>
                </div>

                <div className="license-details">
                  <h3>License Information</h3>
                  <div className="license-info-grid">
                    <div className="info-item">
                      <label>License Number</label>
                      <p>{doctorInfo.licenseNumber}</p>
                    </div>
                    <div className="info-item">
                      <label>Medical Council</label>
                      <p>Medical Council of India (MCI)</p>
                    </div>
                    <div className="info-item">
                      <label>License Type</label>
                      <p>General Practice</p>
                    </div>
                    <div className="info-item">
                      <label>Issue Date</label>
                      <p>January 15, 2016</p>
                    </div>
                    <div className="info-item">
                      <label>Expiration Date</label>
                      <p>January 15, 2026</p>
                    </div>
                    <div className="info-item">
                      <label>Specialization</label>
                      <p>{doctorInfo.specialty}</p>
                    </div>
                  </div>
                </div>

                <div className="license-actions">
                  <button className="btn-primary" onClick={verifyLicense}>
                    {licenseVerified ? 'Unverify License' : 'Verify License'}
                  </button>
                  <button className="btn-secondary">Upload New License</button>
                  <button className="btn-secondary">Download Certificate</button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard
