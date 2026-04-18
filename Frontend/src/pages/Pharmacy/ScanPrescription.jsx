import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  QrCode,
  XCircle,
} from 'lucide-react';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { usePharmacyStore } from '../../store/pharmacyStore';

const BLOCKED_REASON_LABELS = {
  TAMPERED_DATA: 'Invalid or tampered Digital Prescription QR',
  EXPIRED_QR: 'Digital Prescription QR has expired',
  MISMATCH_USER: 'QR user mismatch detected',
  ALREADY_USED: 'Prescription is already delivered',
  MULTIPLE_SCAN: 'Prescription was already scanned',
  ALREADY_FLAGGED: 'Prescription is flagged for suspicious activity',
  PRESCRIPTION_NOT_FOUND: 'Prescription record not found',
};

const ALREADY_SCANNED_REASONS = new Set(['ALREADY_USED', 'MULTIPLE_SCAN']);

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrescriptionForDisplay = (prescription) => {
  const timeline = Array.isArray(prescription?.lifecycleTimeline)
    ? prescription.lifecycleTimeline
    : [];
  const deliveredEvent = timeline
    .slice()
    .reverse()
    .find((entry) => entry?.status === 'DELIVERED');

  return {
    prescriptionId: prescription?._id || 'N/A',
    patient: {
      name: prescription?.patientName || 'Unknown Patient',
      age: '--',
      gender: '--',
    },
    doctor: {
      name: prescription?.doctor || 'Unknown Doctor',
      license: '',
      verified: true,
    },
    issuedAt: formatDateTime(prescription?.createdAt),
    expiry: formatDateTime(prescription?.qrMeta?.lastExpiresAt),
    lifecycleStatus: prescription?.lifecycleStatus || 'CREATED',
    dispensedAt: deliveredEvent?.timestamp ? formatDateTime(deliveredEvent.timestamp) : null,
    dispensedBy: deliveredEvent?.actorName || null,
    medicines: (prescription?.medications || []).map((item) => ({
      medicine: item?.name || 'Unnamed Medicine',
      dosage: item?.dosage || '--',
      qty: item?.qty || '--',
      frequency: item?.frequency || '--',
      duration: item?.duration || '--',
    })),
  };
};

const tabButtonStyle = (isActive) => ({
  padding: '0.62rem 0.95rem',
  borderRadius: 10,
  fontWeight: 700,
  fontSize: '0.78rem',
  border: isActive ? '1px solid #14b8a6' : '1px solid #dbeafe',
  color: isActive ? '#0f766e' : '#64748b',
  background: isActive ? '#f0fdfa' : '#fff',
});

const ScanPrescription = () => {
  const {
    pushPrescriptionScanNotification,
    scanDigitalPrescriptionQr,
    pharmacy,
  } = usePharmacyStore();

  const [activeTab, setActiveTab] = useState('scan');
  const [manualId, setManualId] = useState('');
  const [scanState, setScanState] = useState(null);
  const [invalidReason, setInvalidReason] = useState('Invalid Digital Prescription QR');
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState({});
  const [dispenseSummary, setDispenseSummary] = useState(null);
  const [isVerifyingQr, setIsVerifyingQr] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(selectedMedicines).filter(Boolean).length,
    [selectedMedicines]
  );

  const handleCopyId = async () => {
    if (!prescriptionData?.prescriptionId) return;
    try {
      await navigator.clipboard.writeText(prescriptionData.prescriptionId);
    } catch {
      // Clipboard errors are non-blocking for this page.
    }
  };

  const showValidPrescription = (prescription) => {
    const payload = formatPrescriptionForDisplay(prescription);
    setPrescriptionData(payload);
    setScanState('valid');
    setInvalidReason('');

    const defaultSelected = payload.medicines.reduce((acc, item) => {
      acc[item.medicine] = true;
      return acc;
    }, {});

    setSelectedMedicines(defaultSelected);
    setDispenseSummary(null);
    pushPrescriptionScanNotification('valid', payload.prescriptionId);
  };

  const showInvalidPrescription = (reason, id = 'RX-UNKNOWN') => {
    setPrescriptionData(null);
    setScanState('invalid');
    setInvalidReason(reason);
    setDispenseSummary(null);
    pushPrescriptionScanNotification('invalid', id);
  };

  const showAlreadyDispensed = (prescription, blockedReason) => {
    const payload = formatPrescriptionForDisplay(prescription);
    setPrescriptionData({
      prescriptionId: payload.prescriptionId,
      dispensedAt: payload.dispensedAt || 'N/A',
      pharmacyName: payload.dispensedBy || 'Previously processed',
      blockedReason,
    });
    setScanState('already');
    setInvalidReason('');
    setDispenseSummary(null);
    pushPrescriptionScanNotification('already', payload.prescriptionId);
  };

  const verifyPrescriptionQr = async () => {
    const trimmed = manualId.trim();
    if (!trimmed) return;

    setIsVerifyingQr(true);
    try {
      const response = await scanDigitalPrescriptionQr(trimmed);
      if (response?.success && response?.prescription) {
        showValidPrescription(response.prescription);
        return;
      }

      showInvalidPrescription('Unable to validate Digital Prescription QR');
    } catch (error) {
      const data = error?.response?.data;
      const reason = data?.reason || 'TAMPERED_DATA';
      const reasonLabel =
        BLOCKED_REASON_LABELS[reason] ||
        data?.message ||
        'Invalid Digital Prescription QR';

      if (ALREADY_SCANNED_REASONS.has(reason) && data?.prescription) {
        showAlreadyDispensed(data.prescription, reasonLabel);
        return;
      }

      const prescriptionId = data?.prescription?._id || 'RX-UNKNOWN';
      showInvalidPrescription(reasonLabel, prescriptionId);
    } finally {
      setIsVerifyingQr(false);
    }
  };

  const openScanQrTab = () => {
    setActiveTab('scan');
    setScanState(null);
    setInvalidReason('');
  };

  const openManualPayloadTab = () => {
    setActiveTab('manual');
    setScanState(null);
    setInvalidReason('');
  };

  const toggleMedicine = (medicineName) => {
    setSelectedMedicines((prev) => ({ ...prev, [medicineName]: !prev[medicineName] }));
  };

  const handleDispense = (isPartial) => {
    if (!prescriptionData) return;

    const dispensedMedicines = prescriptionData.medicines.filter((item) => selectedMedicines[item.medicine]);

    setDispenseSummary({
      dispenseId: `DSP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      pharmacist: pharmacy?.pharmacistName || 'R. Patil',
      prescriptionId: prescriptionData.prescriptionId,
      medicines: dispensedMedicines,
      type: isPartial ? 'Partial Dispense' : 'Full Dispense',
    });
  };

  return (
    <PharmacyDashboardLayout pageTitle="Scan Prescription">
      <Helmet>
        <title>Scan Prescription | VitalCode Pharmacy</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Scan Prescription</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 6 }}>
            Scan the patient&apos;s prescription QR code to verify and dispense medicines.
          </p>
        </div>

        <section
          className="rounded-2xl p-4 sm:p-5"
          style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
        >
          <div className="inline-flex items-center gap-2 p-1 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <button style={tabButtonStyle(activeTab === 'scan')} onClick={() => setActiveTab('scan')}>
              Scan QR
            </button>
            <button style={tabButtonStyle(activeTab === 'manual')} onClick={() => setActiveTab('manual')}>
              Paste QR Payload
            </button>
          </div>

          {activeTab === 'scan' ? (
            <div className="mt-4">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  background: '#0F172A',
                  borderRadius: 20,
                  height: 340,
                  border: '1px solid rgba(45,212,191,0.35)',
                }}
              >
                <div className="absolute top-5 left-5 w-10 h-10" style={{ borderTop: '3px solid #14b8a6', borderLeft: '3px solid #14b8a6', borderRadius: '8px 0 0 0' }} />
                <div className="absolute top-5 right-5 w-10 h-10" style={{ borderTop: '3px solid #14b8a6', borderRight: '3px solid #14b8a6', borderRadius: '0 8px 0 0' }} />
                <div className="absolute bottom-5 left-5 w-10 h-10" style={{ borderBottom: '3px solid #14b8a6', borderLeft: '3px solid #14b8a6', borderRadius: '0 0 0 8px' }} />
                <div className="absolute bottom-5 right-5 w-10 h-10" style={{ borderBottom: '3px solid #14b8a6', borderRight: '3px solid #14b8a6', borderRadius: '0 0 8px 0' }} />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: '2px solid rgba(45,212,191,0.45)',
                        animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite',
                      }}
                    />
                    <QrCode style={{ width: 48, height: 48, color: '#2dd4bf' }} />
                  </div>
                  <p style={{ color: '#d1fae5', fontSize: '0.86rem', fontWeight: 600, marginTop: 10 }}>
                    Align prescription QR within frame
                  </p>
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 10 }}>
                Works with VitalCode patient app QR codes only
              </p>

              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  type="button"
                  onClick={openScanQrTab}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ border: '1px solid #14b8a6', color: '#0f766e', fontWeight: 700, fontSize: '0.78rem' }}
                >
                  <QrCode style={{ width: 14, height: 14 }} />
                  Scan QR Code
                </button>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl"
                  style={{ background: '#0f766e', color: '#fff', fontWeight: 700, fontSize: '0.78rem' }}
                  onClick={openManualPayloadTab}
                >
                  Paste Digital QR Payload
                </button>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.76rem', marginTop: 10 }}>
                Use your device QR scanner app to read the prescription QR and paste the payload below.
              </p>
            </div>
          ) : (
            <div className="mt-4 max-w-3xl">
              <label style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 700 }}>
                Digital Prescription QR Payload (JSON)
              </label>
              <textarea
                value={manualId}
                onChange={(event) => setManualId(event.target.value)}
                placeholder='Paste payload from patient QR (example: {"prescription_id":"...","patient_id":"...","iat":12345})'
                className="w-full mt-2 rounded-xl px-3 py-2.5"
                rows={6}
                style={{ border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 500, color: '#0f172a' }}
              />

              <button
                type="button"
                onClick={verifyPrescriptionQr}
                className="w-full mt-3 py-2.5 rounded-xl"
                disabled={isVerifyingQr || !manualId.trim()}
                style={{ background: '#0f766e', color: '#fff', fontSize: '0.82rem', fontWeight: 700, opacity: isVerifyingQr || !manualId.trim() ? 0.6 : 1 }}
              >
                {isVerifyingQr ? 'Validating...' : 'Validate Digital Prescription QR'}
              </button>
            </div>
          )}
        </section>

        {scanState === 'valid' && prescriptionData && (
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1.5px solid #16a34a40', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
          >
            <div className="px-4 py-3.5 flex items-center gap-2" style={{ background: '#ecfdf3', borderBottom: '1px solid #dcfce7' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#16a34a' }} />
              <span style={{ color: '#15803d', fontSize: '0.8rem', fontWeight: 800 }}>VALID PRESCRIPTION</span>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <h3 style={{ color: '#0f172a', fontSize: '0.92rem', fontWeight: 800 }}>Patient & Doctor Info</h3>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Patient: <span style={{ fontWeight: 700 }}>{prescriptionData.patient.name}</span>, {prescriptionData.patient.age}, {prescriptionData.patient.gender}</p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>
                  Doctor: <span style={{ fontWeight: 700 }}>{prescriptionData.doctor.name}</span>{' '}
                  {prescriptionData.doctor.license ? `- License #${prescriptionData.doctor.license}` : ''}{' '}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.68rem', fontWeight: 700 }}>
                    verified
                  </span>
                </p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Issued: <span style={{ fontWeight: 700 }}>{prescriptionData.issuedAt}</span></p>

                <div className="flex items-center gap-2">
                  <p style={{ color: '#334155', fontSize: '0.8rem' }}>
                    Prescription ID:{' '}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      {prescriptionData.prescriptionId}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 rounded"
                    style={{ background: '#f1f5f9' }}
                    aria-label="Copy prescription ID"
                  >
                    <Copy style={{ width: 13, height: 13, color: '#475569' }} />
                  </button>
                </div>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Expiry: <span style={{ fontWeight: 700 }}>Valid until {prescriptionData.expiry}</span></p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>
                  Lifecycle: <span style={{ fontWeight: 700 }}>{prescriptionData.lifecycleStatus}</span>
                </p>
              </div>

              <div>
                <h3 style={{ color: '#0f172a', fontSize: '0.92rem', fontWeight: 800, marginBottom: 10 }}>Medicines to Dispense</h3>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['', 'Medicine', 'Dosage', 'Qty', 'Frequency', 'Duration'].map((head) => (
                          <th key={head} className="text-left px-3 py-2" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionData.medicines.map((item) => (
                        <tr key={item.medicine} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedMedicines[item.medicine])}
                              onChange={() => toggleMedicine(item.medicine)}
                              style={{ accentColor: '#0f766e' }}
                            />
                          </td>
                          <td className="px-3 py-2" style={{ fontSize: '0.77rem', color: '#0f172a', fontWeight: 600 }}>{item.medicine}</td>
                          <td className="px-3 py-2" style={{ fontSize: '0.76rem', color: '#475569' }}>{item.dosage}</td>
                          <td className="px-3 py-2" style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 600 }}>{item.qty}</td>
                          <td className="px-3 py-2" style={{ fontSize: '0.76rem', color: '#475569' }}>{item.frequency}</td>
                          <td className="px-3 py-2" style={{ fontSize: '0.76rem', color: '#475569' }}>{item.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.76rem', marginTop: 8 }}>
                  Total items: {prescriptionData.medicines.length} medicines | Selected: {selectedCount}
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-5 flex flex-wrap items-center justify-between gap-3">
              <button
                className="px-4 py-2.5 rounded-xl"
                style={{ border: '1px solid #f59e0b', color: '#b45309', fontSize: '0.8rem', fontWeight: 700, background: '#fffbeb' }}
                onClick={() => handleDispense(true)}
              >
                Mark as Partial Dispense
              </button>
              <button
                className="px-4 py-2.5 rounded-xl"
                style={{ background: '#0f766e', color: '#fff', fontSize: '0.84rem', fontWeight: 800 }}
                onClick={() => handleDispense(false)}
              >
                Confirm & Dispense
              </button>
            </div>

            {dispenseSummary && (
              <div className="mx-4 sm:mx-5 mb-5 rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck style={{ width: 16, height: 16, color: '#0f766e' }} />
                  <p style={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 800 }}>Dispense Receipt</p>
                </div>
                <p style={{ color: '#334155', fontSize: '0.78rem' }}>Dispense ID: <span style={{ fontWeight: 700 }}>{dispenseSummary.dispenseId}</span></p>
                <p style={{ color: '#334155', fontSize: '0.78rem' }}>Timestamp: <span style={{ fontWeight: 700 }}>{dispenseSummary.timestamp}</span></p>
                <p style={{ color: '#334155', fontSize: '0.78rem' }}>Pharmacist: <span style={{ fontWeight: 700 }}>{dispenseSummary.pharmacist}</span></p>
                <p style={{ color: '#334155', fontSize: '0.78rem' }}>Type: <span style={{ fontWeight: 700 }}>{dispenseSummary.type}</span></p>
                <div className="mt-2">
                  <p style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700 }}>Medicines:</p>
                  {dispenseSummary.medicines.map((item) => (
                    <p key={item.medicine} style={{ color: '#475569', fontSize: '0.75rem' }}>
                      {item.medicine} - Qty {item.qty}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {scanState === 'invalid' && (
          <section className="rounded-2xl p-6 text-center" style={{ background: '#fef2f2', border: '1.5px solid #fecaca' }}>
            <XCircle style={{ width: 56, height: 56, color: '#dc2626', margin: '0 auto' }} />
            <h3 style={{ color: '#b91c1c', fontSize: '1.1rem', fontWeight: 800, marginTop: 10 }}>INVALID PRESCRIPTION</h3>
            <p style={{ color: '#7f1d1d', fontSize: '0.84rem', marginTop: 6 }}>Reason: {invalidReason}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button className="px-4 py-2 rounded-xl" style={{ border: '1px solid #ef4444', color: '#dc2626', fontWeight: 700, fontSize: '0.78rem' }}>
                Report Issue
              </button>
              <button
                className="px-4 py-2 rounded-xl"
                style={{ background: '#0f766e', color: '#fff', fontWeight: 700, fontSize: '0.78rem' }}
                onClick={() => {
                  setScanState(null);
                  setManualId('');
                }}
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {scanState === 'already' && prescriptionData && (
          <section className="rounded-2xl p-6" style={{ background: '#fff7ed', border: '1.5px solid #fdba74' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle style={{ width: 28, height: 28, color: '#ea580c', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#9a3412', fontSize: '1.04rem', fontWeight: 800 }}>Already Dispensed</h3>
                <p style={{ color: '#9a3412', fontSize: '0.82rem', marginTop: 6 }}>
                  This prescription was already processed. Last delivered at {prescriptionData.dispensedAt} by {prescriptionData.pharmacyName}
                </p>
                <p style={{ color: '#9a3412', fontSize: '0.78rem', marginTop: 8 }}>
                  Reason: {prescriptionData.blockedReason || 'Already scanned'}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </PharmacyDashboardLayout>
  );
};

export default ScanPrescription;
