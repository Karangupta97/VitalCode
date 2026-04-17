import { useMemo, useState } from 'react'
import {
  LuBell,
  LuBadgeCheck,
  LuClipboardCheck,
  LuLayoutGrid,
  LuLayoutDashboard,
  LuList,
  LuMoonStar,
  LuPill,
  LuSettings,
  LuShieldCheck,
  LuSiren,
  LuStore,
  LuSun,
} from 'react-icons/lu'
import './PatientDashboardPage.css'

const INITIAL_REPORTS = [
  {
    id: 'REP-3084',
    name: 'cbc-panel-april.pdf',
    uploadedOn: '17 Apr 2026',
    size: '2.6 MB',
    status: 'Reviewed',
    scanStatus: 'Malware Safe',
  },
  {
    id: 'REP-3077',
    name: 'thyroid-profile.png',
    uploadedOn: '16 Apr 2026',
    size: '1.1 MB',
    status: 'Under Review',
    scanStatus: 'Malware Safe',
  },
  {
    id: 'REP-3060',
    name: 'chest-xray.jpg',
    uploadedOn: '15 Apr 2026',
    size: '3.2 MB',
    status: 'Uploaded',
    scanStatus: 'Malware Safe',
  },
]

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-VC-5541',
    doctor: 'Dr. Sara Abraham',
    issuedDate: '17 Apr 2026',
    validityDeadline: '2026-04-21T18:00:00',
    status: 'Pending',
    medicines: [
      'Amoxicillin 500mg - 1 tablet after breakfast',
      'Vitamin B12 - 1 capsule after dinner',
    ],
    signatureHash: '0x9f3a...7ce2',
    qrRef: 'VC-QR-5541',
  },
  {
    id: 'RX-VC-5528',
    doctor: 'Dr. Rohan Iyer',
    issuedDate: '14 Apr 2026',
    validityDeadline: '2026-04-16T10:00:00',
    status: 'Pending',
    medicines: [
      'Metformin 500mg - 1 tablet twice daily',
      'Lisinopril 10mg - 1 tablet at night',
    ],
    signatureHash: '0xa2b4...18ef',
    qrRef: 'VC-QR-5528',
  },
]

const INITIAL_TIMELINE = [
  {
    id: 1,
    title: 'Doctor reviewed your CBC report',
    time: 'Today, 09:25',
  },
  {
    id: 2,
    title: 'Digital prescription RX-VC-5541 issued',
    time: 'Today, 09:31',
  },
  {
    id: 3,
    title: 'Trust signature validated on-chain',
    time: 'Today, 09:32',
  },
]

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Trust Alert',
    text: 'Signature and QR verified for RX-VC-5541.',
    time: '2m ago',
  },
  {
    id: 2,
    type: 'Doctor Update',
    text: 'Your prescription notes were updated with dosage tips.',
    time: '17m ago',
  },
  {
    id: 3,
    type: 'Expiry Warning',
    text: 'RX-VC-5528 has expired. Request a revalidation if needed.',
    time: '1d ago',
  },
]

const LEFT_NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Patient Dashboard',
    icon: LuLayoutDashboard,
  },
  {
    id: 'reports',
    label: 'Report Vault',
    icon: LuClipboardCheck,
  },
  {
    id: 'trust',
    label: 'Trust Status',
    icon: LuShieldCheck,
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    icon: LuPill,
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy Flow',
    icon: LuStore,
  },
  {
    id: 'alerts',
    label: 'Alerts & Notificaations',
    icon: LuSiren,
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: LuBadgeCheck,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: LuSettings,
  },
]

const getPrescriptionStatus = (prescription) => {
  const isExpired = Date.now() > new Date(prescription.validityDeadline).getTime()
  return isExpired ? 'Expired' : prescription.status
}

const getRemainingTime = (deadline) => {
  const remainingMs = new Date(deadline).getTime() - Date.now()
  if (remainingMs <= 0) return 'Expired'

  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  if (days > 0) return `${days}d ${remainingHours}h left`
  return `${remainingHours}h left`
}

const getSimpleHealthInsight = (reportName) => {
  const normalizedName = reportName.toLowerCase()

  if (normalizedName.includes('cbc')) {
    return 'Your blood count report appears mostly stable. Keep hydration and balanced meals consistent, and continue follow-up if your doctor advised repeat testing.'
  }

  if (normalizedName.includes('thyroid')) {
    return 'Your thyroid profile shows values that should be monitored with regular medicine timing and sleep routine. Follow your doctor guidance for dose adjustments.'
  }

  if (normalizedName.includes('xray') || normalizedName.includes('chest')) {
    return 'Your chest report indicates mild findings that usually improve with medicines, rest, and breathing care. Contact your doctor quickly if cough or breathlessness worsens.'
  }

  return 'This report has been analyzed. In simple terms, continue medicines as prescribed, maintain hydration, and share any new symptoms with your doctor for safe follow-up.'
}

const PatientDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('overview')
  const [overviewSection, setOverviewSection] = useState('reports')
  const [reportViewMode, setReportViewMode] = useState('grid')
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [savedReportIds, setSavedReportIds] = useState([])
  const [activeReportPreview, setActiveReportPreview] = useState(null)
  const [aiInsight, setAiInsight] = useState(null)
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS)
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState('1.0x')
  const [themeMode, setThemeMode] = useState('light')
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false)
  const [patientProfile, setPatientProfile] = useState({
    name: 'Aarav Menon',
    email: 'aarav.menon@vitalcode.health',
    phone: '+91 98765 43210',
    aadhaarId: '6278 4435 9210',
    bloodGroup: 'B+',
    dateOfBirth: '1998-05-11',
    address: '14 Green Avenue, Bengaluru',
    emergencyContact: '+91 99887 66554',
  })
  const [profileDraft, setProfileDraft] = useState({
    name: 'Aarav Menon',
    email: 'aarav.menon@vitalcode.health',
    phone: '+91 98765 43210',
    aadhaarId: '6278 4435 9210',
    bloodGroup: 'B+',
    dateOfBirth: '1998-05-11',
    address: '14 Green Avenue, Bengaluru',
    emergencyContact: '+91 99887 66554',
  })

  const patientName = patientProfile.name
  const firstName = patientName.split(' ')[0]

  const patientTrustId = useMemo(() => {
    const random = Math.floor(100000 + Math.random() * 900000)
    return `VC-PT-${random}`
  }, [])

  const patientInitials = useMemo(() => {
    return patientName
      .split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [patientName])

  const trustScore = useMemo(() => {
    const reviewedReports = reports.filter((report) => report.status === 'Reviewed').length
    return Math.min(99, 84 + reviewedReports * 5)
  }, [reports])

  const activePrescriptions = useMemo(() => {
    return prescriptions.filter((item) => getPrescriptionStatus(item) !== 'Expired').length
  }, [prescriptions])

  const pushNotification = (type, text) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        text,
        time: 'Just now',
      },
      ...prev,
    ].slice(0, 6))
  }

  const pushTimeline = (title) => {
    setTimeline((prev) => [
      {
        id: Date.now(),
        title,
        time: 'Just now',
      },
      ...prev,
    ].slice(0, 8))
  }

  const handleReportUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    let current = 0
    const ticker = window.setInterval(() => {
      current += 20
      setUploadProgress(current)

      if (current >= 100) {
        window.clearInterval(ticker)
        setIsUploading(false)

        setReports((prev) => [
          {
            id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: file.name,
            uploadedOn: 'Today',
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            status: 'Uploaded',
            scanStatus: 'Malware Safe',
          },
          ...prev,
        ])

        pushTimeline(`Report ${file.name} uploaded to encrypted vault`)
        pushNotification('Vault Update', `${file.name} uploaded and marked malware safe.`)
      }
    }, 140)

    event.target.value = ''
  }

  const updatePharmacyStatus = (prescriptionId) => {
    const selected = prescriptions.find((item) => item.id === prescriptionId)
    if (!selected) return

    const currentStatus = getPrescriptionStatus(selected)
    if (currentStatus === 'Expired' || currentStatus === 'Issued') return

    const nextStatus = currentStatus === 'Pending' ? 'Partially Issued' : 'Issued'

    setPrescriptions((prev) =>
      prev.map((item) =>
        item.id === prescriptionId
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    )

    pushTimeline(`Pharmacy updated ${prescriptionId}: ${nextStatus}`)
    pushNotification('Pharmacy Update', `${prescriptionId} is now ${nextStatus.toLowerCase()}.`)
  }

  const openAlertsMenu = () => {
    setActiveNav('alerts')
  }

  const handleSidebarNavigation = (navId) => {
    setActiveNav(navId)
  }

  const openProfileEditor = () => {
    setProfileDraft(patientProfile)
    setIsProfileEditorOpen(true)
  }

  const handleProfileDraftChange = (field, value) => {
    setProfileDraft((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveProfileChanges = (event) => {
    event.preventDefault()
    setPatientProfile(profileDraft)
    setIsProfileEditorOpen(false)
    pushNotification('Profile Updated', 'Your profile details were updated successfully.')
  }

  const handleViewReport = (report) => {
    setActiveReportPreview(report)
    pushNotification('Report View', `${report.name} opened in secure preview.`)
  }

  const handleDeleteReport = (reportId) => {
    const selected = reports.find((item) => item.id === reportId)
    if (!selected) return

    setReports((prev) => prev.filter((item) => item.id !== reportId))
    setSavedReportIds((prev) => prev.filter((item) => item !== reportId))
    setActiveReportPreview((prev) => (prev?.id === reportId ? null : prev))
    setAiInsight((prev) => (prev?.reportId === reportId ? null : prev))
    pushTimeline(`Report ${selected.name} deleted from vault`)
    pushNotification('Vault Update', `${selected.name} deleted from report vault.`)
  }

  const handleAIAnalyzer = (reportId) => {
    const selectedReport = reports.find((item) => item.id === reportId)
    if (!selectedReport) return

    const summary = getSimpleHealthInsight(selectedReport.name)

    setAiInsight({
      reportId,
      reportName: selectedReport.name,
      uploadedOn: selectedReport.uploadedOn,
      summary,
    })

    pushTimeline(`AI analyser completed for ${selectedReport.name}`)
    pushNotification('AI Analyzer', `${selectedReport.name} analyzed with simple health summary.`)
  }

  const handleToggleSaveReport = (reportId, reportName) => {
    let saved = false

    setSavedReportIds((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((item) => item !== reportId)
      }

      saved = true
      return [...prev, reportId]
    })

    pushNotification(
      saved ? 'Report Saved' : 'Report Unsaved',
      saved ? `${reportName} saved for quick access.` : `${reportName} removed from saved reports.`,
    )
  }

  const closeAiInsight = () => {
    setAiInsight(null)
  }

  const renderReportActions = (report) => {
    const isSaved = savedReportIds.includes(report.id)

    return (
      <>
        <div className='pt-report-actions'>
          <button type='button' className='pt-table-action-btn view' onClick={() => handleViewReport(report)}>
            View
          </button>
          <button
            type='button'
            className='pt-table-action-btn ai'
            onClick={() => handleAIAnalyzer(report.id)}
          >
            AI Analyser
          </button>
          <button
            type='button'
            className='pt-table-action-btn save'
            onClick={() => handleToggleSaveReport(report.id, report.name)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            type='button'
            className='pt-table-action-btn delete'
            onClick={() => handleDeleteReport(report.id)}
          >
            Delete
          </button>
        </div>

        {aiInsight?.reportId === report.id && (
          <div className='pt-ai-inline-summary' role='status' aria-live='polite'>
            <div className='pt-ai-inline-head'>
              <p className='pt-ai-inline-title'>AI Summary</p>
              <button
                type='button'
                className='pt-ai-inline-close'
                aria-label='Close AI summary'
                onClick={closeAiInsight}
              >
                X
              </button>
            </div>
            <p>{aiInsight.summary}</p>
          </div>
        )}
      </>
    )
  }

  const reportVaultCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Report Vault Upload</h3>
        <div className='pt-report-head-actions'>
          <span className='pt-card-tag'>Zero-trust scan on upload</span>
          <label className='pt-upload-btn' htmlFor='pt-report-upload'>
            Upload
          </label>

          <div className='pt-report-view-toggle' role='group' aria-label='Report view mode'>
            <button
              type='button'
              className={`pt-report-view-btn ${reportViewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setReportViewMode('grid')}
            >
              <LuLayoutGrid aria-hidden='true' />
              <span>Grid</span>
            </button>

            <button
              type='button'
              className={`pt-report-view-btn ${reportViewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setReportViewMode('list')}
            >
              <LuList aria-hidden='true' />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      <input
        id='pt-report-upload'
        className='pt-upload-input'
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleReportUpload}
      />

      <p className='pt-upload-hint'>Supported: PDF, JPG, PNG | Max 10 MB</p>

      {isUploading && (
        <div className='pt-upload-progress' role='status' aria-live='polite'>
          <div className='pt-upload-progress-fill' style={{ width: `${uploadProgress}%` }} />
          <span>Encrypting and scanning... {uploadProgress}%</span>
        </div>
      )}

      {reportViewMode === 'list' ? (
        <div className='pt-report-table-wrap'>
          <table className='pt-report-table'>
            <thead>
              <tr>
                <th>Report</th>
                <th>Uploaded On</th>
                <th>Size</th>
                <th>Status</th>
                <th>Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <p>{report.name}</p>
                    <small>{report.id}</small>
                  </td>
                  <td>{report.uploadedOn}</td>
                  <td>{report.size}</td>
                  <td>
                    <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <span className='pt-safe-pill'>{report.scanStatus}</span>
                  </td>
                  <td>{renderReportActions(report)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='pt-report-grid'>
          {reports.map((report) => (
            <article key={report.id} className='pt-report-grid-card'>
              <div className='pt-report-grid-head'>
                <div>
                  <p>{report.name}</p>
                  <small>{report.id}</small>
                </div>
                <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {report.status}
                </span>
              </div>

              <ul className='pt-report-grid-meta'>
                <li>
                  <span>Uploaded</span>
                  <strong>{report.uploadedOn}</strong>
                </li>
                <li>
                  <span>Size</span>
                  <strong>{report.size}</strong>
                </li>
                <li>
                  <span>Scan</span>
                  <span className='pt-safe-pill'>{report.scanStatus}</span>
                </li>
              </ul>

              {renderReportActions(report)}
            </article>
          ))}
        </div>
      )}
    </article>
  )

  const prescriptionsCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Digital Prescription Center</h3>
        <span className='pt-card-tag'>QR + signature secured</span>
      </div>

      <div className='pt-prescription-list'>
        {prescriptions.map((prescription) => {
          const status = getPrescriptionStatus(prescription)
          const remainingTime = getRemainingTime(prescription.validityDeadline)
          const isLocked = status === 'Expired' || status === 'Issued'

          return (
            <article key={prescription.id} className='pt-prescription-card'>
              <div className='pt-prescription-head'>
                <div>
                  <h4>{prescription.id}</h4>
                  <p>Issued by {prescription.doctor} on {prescription.issuedDate}</p>
                </div>
                <span className={`pt-status-pill pt-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {status}
                </span>
              </div>

              <ul className='pt-medicine-list'>
                {prescription.medicines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className='pt-verify-grid'>
                <div className='pt-qr-box' aria-label='Prescription QR preview'>
                  <div className='pt-qr-grid' />
                  <span>{prescription.qrRef}</span>
                </div>
                <div className='pt-signature-box'>
                  <p>Digital Signature Verified</p>
                  <strong>{prescription.signatureHash}</strong>
                  <small>Hash integrity timestamped and immutable</small>
                </div>
              </div>

              <div className='pt-prescription-foot'>
                <p>
                  Validity: <strong>{remainingTime}</strong>
                </p>
                <button
                  type='button'
                  className='pt-action-btn secondary'
                  onClick={() => updatePharmacyStatus(prescription.id)}
                  disabled={isLocked}
                >
                  {status === 'Pending' && 'Pharmacy Scanned + Partially Issued'}
                  {status === 'Partially Issued' && 'Mark Fully Issued'}
                  {status === 'Issued' && 'Fully Issued'}
                  {status === 'Expired' && 'Prescription Expired'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </article>
  )

  const aiCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>AI Health Simplifier</h3>
        <span className='pt-card-tag'>Doctor remains final authority</span>
      </div>

      <div className='pt-ai-summary'>
        <p className='pt-ai-label'>Medical finding</p>
        <p className='pt-ai-jargon'>Mild lower respiratory tract inflammation with elevated eosinophil count.</p>
        <p className='pt-ai-label'>Simple explanation</p>
        <p className='pt-ai-plain'>
          Your lungs show mild irritation, likely because of an ongoing allergy or infection. Follow medicine timing and
          hydration guidance for faster recovery.
        </p>
      </div>

      <div className='pt-voice-controls'>
        <button type='button' className='pt-action-btn secondary' onClick={() => setIsVoicePlaying((prev) => !prev)}>
          {isVoicePlaying ? 'Pause Voice Brief' : 'Play Voice Brief'}
        </button>
        <label htmlFor='pt-voice-speed'>Voice speed</label>
        <select
          id='pt-voice-speed'
          value={voiceSpeed}
          onChange={(event) => setVoiceSpeed(event.target.value)}
        >
          <option value='0.75x'>0.75x</option>
          <option value='1.0x'>1.0x</option>
          <option value='1.25x'>1.25x</option>
        </select>
      </div>

      <div className={`pt-voice-wave ${isVoicePlaying ? 'is-playing' : ''}`} aria-hidden='true'>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </article>
  )

  const timelineCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Pharmacy and Audit Timeline</h3>
        <span className='pt-card-tag'>Tamper-evident event stream</span>
      </div>

      <ul className='pt-timeline'>
        {timeline.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.title}</strong>
            <span>{entry.time}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const notificationsCard = (focused = false) => (
    <article className={`pt-card ${focused ? 'pt-card-focus' : ''}`}>
      <div className='pt-card-head'>
        <h3>Notifications</h3>
        <span className='pt-card-tag'>Live trust signals</span>
      </div>

      <ul className='pt-notification-list'>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <div>
              <p>{notification.type}</p>
              <small>{notification.text}</small>
            </div>
            <span>{notification.time}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const verificationCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Verification Registry</h3>
        <span className='pt-card-tag'>QR and Signature Chain</span>
      </div>
      <ul className='pt-notification-list'>
        {prescriptions.map((prescription) => (
          <li key={`${prescription.id}-verify`}>
            <div>
              <p>{prescription.id}</p>
              <small>Doctor: {prescription.doctor}</small>
              <small>Signature: {prescription.signatureHash}</small>
            </div>
            <span>{prescription.qrRef}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const settingsCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Profile Settings</h3>
        <span className='pt-card-tag'>Editable Patient Identity</span>
      </div>
      <div className='pt-profile-grid'>
        <label>
          Full Name
          <input type='text' value={patientProfile.name} readOnly />
        </label>
        <label>
          Email
          <input type='text' value={patientProfile.email} readOnly />
        </label>
        <label>
          Phone
          <input type='text' value={patientProfile.phone} readOnly />
        </label>
        <label>
          Aadhaar ID
          <input type='text' value={patientProfile.aadhaarId} readOnly />
        </label>
        <label>
          Blood Group
          <input type='text' value={patientProfile.bloodGroup} readOnly />
        </label>
      </div>
      <div className='pt-profile-actions'>
        <button type='button' className='pt-action-btn' onClick={openProfileEditor}>
          Edit Profile
        </button>
      </div>
    </article>
  )

  const renderMainContent = () => {
    switch (activeNav) {
      case 'reports':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{reportVaultCard}</div>
          </section>
        )
      case 'prescriptions':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{prescriptionsCard}</div>
          </section>
        )
      case 'pharmacy':
        return (
          <section className='pt-layout'>
            <div className='pt-col-left'>{prescriptionsCard}</div>
            <div className='pt-col-right'>{timelineCard}</div>
          </section>
        )
      case 'alerts':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{notificationsCard(true)}</div>
          </section>
        )
      case 'verification':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{verificationCard}</div>
          </section>
        )
      case 'settings':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{settingsCard}</div>
          </section>
        )
      case 'trust':
        return (
          <>
            <section className='pt-hero-card'>
              <div className='pt-hero-content'>
                <p className='pt-kicker'>Trust and Security</p>
                <h1>Identity Confidence Overview</h1>
                <p>
                  Monitor your trust score, verification trail, and signed prescription activity in one secure, tamper-evident
                  view.
                </p>
              </div>
              <div className='pt-trust-panel'>
                <p>Trust Score</p>
                <h2>{trustScore}%</h2>
                <small>Identity + signature + QR checks healthy</small>
              </div>
            </section>
            <section className='pt-layout single-page'>
              <div className='pt-col-left'>{verificationCard}</div>
            </section>
          </>
        )
      case 'overview':
      default:
        return (
          <>
            <section className='pt-stats'>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'reports' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('reports')}
                aria-pressed={overviewSection === 'reports'}
              >
                <p>Reports in Vault</p>
                <strong>{reports.length}</strong>
                <span>{reports.filter((item) => item.status === 'Reviewed').length} reviewed by doctors</span>
              </button>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'prescriptions' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('prescriptions')}
                aria-pressed={overviewSection === 'prescriptions'}
              >
                <p>Active Prescriptions</p>
                <strong>{activePrescriptions}</strong>
                <span>Includes pending and partially issued</span>
              </button>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'pharmacy' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('pharmacy')}
                aria-pressed={overviewSection === 'pharmacy'}
              >
                <p>Pharmacy Updates</p>
                <strong>{timeline.length}</strong>
                <span>Audit events visible in real time</span>
              </button>
            </section>

            {overviewSection === 'reports' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{reportVaultCard}</div>
              </section>
            )}

            {overviewSection === 'prescriptions' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{prescriptionsCard}</div>
              </section>
            )}

            {overviewSection === 'pharmacy' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{timelineCard}</div>
              </section>
            )}
          </>
        )
    }
  }

  return (
    <div className={`pt-page ${themeMode === 'dark' ? 'is-dark' : ''}`}>
      <div className='pt-orb pt-orb-1' aria-hidden='true' />
      <div className='pt-orb pt-orb-2' aria-hidden='true' />
      <div className='pt-grid-noise' aria-hidden='true' />

      <div className='pt-shell'>
        <aside className='pt-sidebar'>
          <div className='pt-sidebar-header'>
            <div className='pt-brand-mark'>VC</div>
            <div>
              <p className='pt-brand-name'>VitalCode</p>
              <p className='pt-brand-sub'>Patient Command</p>
            </div>
          </div>

          <nav className='pt-sidebar-nav' aria-label='Patient dashboard navigation'>
            {LEFT_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type='button'
                  className={`pt-nav-item ${activeNav === item.id ? 'is-active' : ''}`}
                  onClick={() => handleSidebarNavigation(item.id)}
                >
                  <span className='pt-nav-icon' aria-hidden='true'>
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className='pt-sidebar-footer'>
            <p>Identity Integrity</p>
            <strong>Verified Session</strong>
          </div>
        </aside>

        <div className='pt-content'>
          <header className='pt-topbar'>
            <h2>Patient Dashboard</h2>

            <div className='pt-topbar-controls'>
              <button
                type='button'
                className={`pt-theme-chip ${themeMode === 'dark' ? 'is-active' : ''}`}
                onClick={() => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
              >
                {themeMode === 'dark' ? <LuMoonStar aria-hidden='true' /> : <LuSun aria-hidden='true' />}
                {themeMode === 'dark' ? 'Dark' : 'Light'}
              </button>

              <div className='pt-control-wrap'>
                <button
                  type='button'
                  className={`pt-notify-btn ${activeNav === 'alerts' ? 'is-active' : ''}`}
                  aria-label='Go to alerts menu'
                  onClick={openAlertsMenu}
                >
                  <LuBell aria-hidden='true' />
                  <span className='pt-notify-count'>{notifications.length > 9 ? '9+' : notifications.length}</span>
                </button>
              </div>

              <div className='pt-control-wrap'>
                <button
                  type='button'
                  className={`pt-user-chip ${isProfileEditorOpen ? 'is-active' : ''}`}
                  aria-label='Open editable profile'
                  onClick={openProfileEditor}
                >
                  <span className='pt-user-avatar'>{patientInitials}</span>
                </button>
              </div>
            </div>
          </header>

          <main className='pt-main'>
            <section className='pt-command-deck'>
              <article className='pt-command-primary'>
                <div className='pt-command-left'>
                  <p className='pt-greet-label'>Good Morning</p>
                  <h3>
                    Welcome back, <span>{firstName}</span>
                  </h3>
                </div>
              </article>
            </section>
            {renderMainContent()}
            {false && (
              <>
            <section className='pt-command-deck'>
              <article className='pt-command-primary'>
                <div className='pt-command-left'>
                  <p className='pt-greet-label'>Good Morning</p>
                  <h3>
                    Welcome back, <span>{firstName}</span>
                  </h3>
                </div>
              </article>
            </section>

            <section className='pt-hero-card'>
              <div className='pt-hero-content'>
                <p className='pt-kicker'>Secure Care Journey</p>
                <h1>Workflow Visibility and Verification</h1>
                <p>
                  Upload reports securely, receive doctor-signed prescriptions, and share QR-verified proof with pharmacy.
                  Every action is traceable, signed, and protected.
                </p>

                <div className='pt-hero-badges'>
                  <span>End-to-end encrypted vault</span>
                  <span>Doctor signature verified</span>
                  <span>Pharmacy issue audit enabled</span>
                </div>
              </div>

              <div className='pt-trust-panel'>
                <p>Trust Score</p>
                <h2>{trustScore}%</h2>
                <small>Identity + signature + QR checks healthy</small>
              </div>
            </section>

            <section className='pt-stats'>
              <article className='pt-stat-card'>
                <p>Reports in Vault</p>
                <strong>{reports.length}</strong>
                <span>{reports.filter((item) => item.status === 'Reviewed').length} reviewed by doctors</span>
              </article>
              <article className='pt-stat-card'>
                <p>Active Prescriptions</p>
                <strong>{activePrescriptions}</strong>
                <span>Includes pending and partially issued</span>
              </article>
              <article className='pt-stat-card'>
                <p>Pharmacy Updates</p>
                <strong>{timeline.length}</strong>
                <span>Audit events visible in real time</span>
              </article>
            </section>

            <section className='pt-layout'>
              <div className='pt-col-left'>
                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Report Vault Upload</h3>
                    <span className='pt-card-tag'>Zero-trust scan on upload</span>
                  </div>

                  <label className='pt-upload-zone' htmlFor='pt-report-upload'>
                    <input
                      id='pt-report-upload'
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      onChange={handleReportUpload}
                    />
                    <strong>Drop medical report here or click to upload</strong>
                    <small>Supported: PDF, JPG, PNG | Max 10 MB</small>
                  </label>

                  {isUploading && (
                    <div className='pt-upload-progress' role='status' aria-live='polite'>
                      <div className='pt-upload-progress-fill' style={{ width: `${uploadProgress}%` }} />
                      <span>Encrypting and scanning... {uploadProgress}%</span>
                    </div>
                  )}

                  <ul className='pt-report-list'>
                    {reports.map((report) => (
                      <li key={report.id} className='pt-report-row'>
                        <div>
                          <p>{report.name}</p>
                          <small>{report.uploadedOn} | {report.size} | {report.id}</small>
                        </div>
                        <div className='pt-report-meta'>
                          <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {report.status}
                          </span>
                          <span className='pt-safe-pill'>{report.scanStatus}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Digital Prescription Center</h3>
                    <span className='pt-card-tag'>QR + signature secured</span>
                  </div>

                  <div className='pt-prescription-list'>
                    {prescriptions.map((prescription) => {
                      const status = getPrescriptionStatus(prescription)
                      const remainingTime = getRemainingTime(prescription.validityDeadline)
                      const isLocked = status === 'Expired' || status === 'Issued'

                      return (
                        <article key={prescription.id} className='pt-prescription-card'>
                          <div className='pt-prescription-head'>
                            <div>
                              <h4>{prescription.id}</h4>
                              <p>Issued by {prescription.doctor} on {prescription.issuedDate}</p>
                            </div>
                            <span className={`pt-status-pill pt-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {status}
                            </span>
                          </div>

                          <ul className='pt-medicine-list'>
                            {prescription.medicines.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>

                          <div className='pt-verify-grid'>
                            <div className='pt-qr-box' aria-label='Prescription QR preview'>
                              <div className='pt-qr-grid' />
                              <span>{prescription.qrRef}</span>
                            </div>
                            <div className='pt-signature-box'>
                              <p>Digital Signature Verified</p>
                              <strong>{prescription.signatureHash}</strong>
                              <small>Hash integrity timestamped and immutable</small>
                            </div>
                          </div>

                          <div className='pt-prescription-foot'>
                            <p>
                              Validity: <strong>{remainingTime}</strong>
                            </p>
                            <button
                              type='button'
                              className='pt-action-btn secondary'
                              onClick={() => updatePharmacyStatus(prescription.id)}
                              disabled={isLocked}
                            >
                              {status === 'Pending' && 'Pharmacy Scanned + Partially Issued'}
                              {status === 'Partially Issued' && 'Mark Fully Issued'}
                              {status === 'Issued' && 'Fully Issued'}
                              {status === 'Expired' && 'Prescription Expired'}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </article>
              </div>

              <div className='pt-col-right'>
                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>AI Health Simplifier</h3>
                    <span className='pt-card-tag'>Doctor remains final authority</span>
                  </div>

                  <div className='pt-ai-summary'>
                    <p className='pt-ai-label'>Medical finding</p>
                    <p className='pt-ai-jargon'>Mild lower respiratory tract inflammation with elevated eosinophil count.</p>
                    <p className='pt-ai-label'>Simple explanation</p>
                    <p className='pt-ai-plain'>
                      Your lungs show mild irritation, likely because of an ongoing allergy or infection. Follow medicine timing
                      and hydration guidance for faster recovery.
                    </p>
                  </div>

                  <div className='pt-voice-controls'>
                    <button type='button' className='pt-action-btn secondary' onClick={() => setIsVoicePlaying((prev) => !prev)}>
                      {isVoicePlaying ? 'Pause Voice Brief' : 'Play Voice Brief'}
                    </button>
                    <label htmlFor='pt-voice-speed'>Voice speed</label>
                    <select
                      id='pt-voice-speed'
                      value={voiceSpeed}
                      onChange={(event) => setVoiceSpeed(event.target.value)}
                    >
                      <option value='0.75x'>0.75x</option>
                      <option value='1.0x'>1.0x</option>
                      <option value='1.25x'>1.25x</option>
                    </select>
                  </div>

                  <div className={`pt-voice-wave ${isVoicePlaying ? 'is-playing' : ''}`} aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </article>

                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Pharmacy and Audit Timeline</h3>
                    <span className='pt-card-tag'>Tamper-evident event stream</span>
                  </div>

                  <ul className='pt-timeline'>
                    {timeline.map((entry) => (
                      <li key={entry.id}>
                        <strong>{entry.title}</strong>
                        <span>{entry.time}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={`pt-card ${activeNav === 'alerts' ? 'pt-card-focus' : ''}`}>
                  <div className='pt-card-head'>
                    <h3>Notifications</h3>
                    <span className='pt-card-tag'>Live trust signals</span>
                  </div>

                  <ul className='pt-notification-list'>
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <div>
                          <p>{notification.type}</p>
                          <small>{notification.text}</small>
                        </div>
                        <span>{notification.time}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>
              </>
            )}
          </main>

          {activeReportPreview && (
            <div className='pt-modal-backdrop' role='dialog' aria-modal='true' aria-label='Report preview'>
              <article className='pt-report-viewer-modal'>
                <div className='pt-report-viewer-head'>
                  <div>
                    <h3>{activeReportPreview.name}</h3>
                    <p>
                      Uploaded on {activeReportPreview.uploadedOn} | {activeReportPreview.size}
                    </p>
                  </div>
                  <button
                    type='button'
                    className='pt-report-viewer-close'
                    aria-label='Close report preview'
                    onClick={() => setActiveReportPreview(null)}
                  >
                    X
                  </button>
                </div>

                <div className='pt-report-viewer-body'>
                  <p className='pt-ai-label'>Secure report preview</p>
                  <p>
                    This is a protected preview of <strong>{activeReportPreview.id}</strong>. You can review uploaded details
                    safely before sharing with doctor or pharmacy.
                  </p>
                </div>
              </article>
            </div>
          )}

          {isProfileEditorOpen && (
            <div className='pt-modal-backdrop' role='dialog' aria-modal='true' aria-label='Edit patient profile'>
              <form className='pt-profile-modal' onSubmit={saveProfileChanges}>
                <div className='pt-profile-modal-head'>
                  <h3>Edit Profile</h3>
                  <button type='button' className='pt-profile-close' onClick={() => setIsProfileEditorOpen(false)}>
                    Close
                  </button>
                </div>

                <div className='pt-profile-summary'>
                  <article>
                    <span>Patient ID</span>
                    <strong>{patientTrustId}</strong>
                  </article>
                  <article>
                    <span>Trust Score</span>
                    <strong>{trustScore}%</strong>
                  </article>
                  <article>
                    <span>Active Prescriptions</span>
                    <strong>{activePrescriptions}</strong>
                  </article>
                </div>

                <div className='pt-profile-grid'>
                  <label>
                    Full Name
                    <input
                      type='text'
                      value={profileDraft.name}
                      onChange={(event) => handleProfileDraftChange('name', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type='email'
                      value={profileDraft.email}
                      onChange={(event) => handleProfileDraftChange('email', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type='text'
                      value={profileDraft.phone}
                      onChange={(event) => handleProfileDraftChange('phone', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Aadhaar ID
                    <input
                      type='text'
                      value={profileDraft.aadhaarId}
                      onChange={(event) => handleProfileDraftChange('aadhaarId', event.target.value)}
                    />
                  </label>
                  <label>
                    Blood Group
                    <input
                      type='text'
                      value={profileDraft.bloodGroup}
                      onChange={(event) => handleProfileDraftChange('bloodGroup', event.target.value)}
                    />
                  </label>
                  <label>
                    Date Of Birth
                    <input
                      type='date'
                      value={profileDraft.dateOfBirth}
                      onChange={(event) => handleProfileDraftChange('dateOfBirth', event.target.value)}
                    />
                  </label>
                  <label>
                    Emergency Contact
                    <input
                      type='text'
                      value={profileDraft.emergencyContact}
                      onChange={(event) => handleProfileDraftChange('emergencyContact', event.target.value)}
                    />
                  </label>
                  <label className='full-width'>
                    Address
                    <textarea
                      rows='3'
                      value={profileDraft.address}
                      onChange={(event) => handleProfileDraftChange('address', event.target.value)}
                    />
                  </label>
                </div>

                <div className='pt-profile-actions'>
                  <button type='button' className='pt-action-btn secondary' onClick={() => setIsProfileEditorOpen(false)}>
                    Cancel
                  </button>
                  <button type='submit' className='pt-action-btn'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboardPage
