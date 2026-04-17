import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { usePharmacyStore } from '../../store/pharmacyStore';

const loginHistory = [
  { device: 'Chrome on Windows', location: 'Pune, Maharashtra', time: '18 Apr 2026, 09:11 AM', status: 'Success' },
  { device: 'Safari on iPhone', location: 'Pune, Maharashtra', time: '17 Apr 2026, 08:48 PM', status: 'Success' },
  { device: 'Unknown Browser', location: 'Mumbai, Maharashtra', time: '17 Apr 2026, 10:22 AM', status: 'Failed' },
];

const activeSessions = [
  { id: 's1', name: 'Chrome - Front Desk', location: 'Pune, MH', activeSince: '2 hours ago' },
  { id: 's2', name: 'Android App - Owner', location: 'Pune, MH', activeSince: '45 mins ago' },
];

const getLicenseStatusLabel = (status) => {
  if (status === 'expired') return 'Expired';
  if (status === 'pending') return 'Pending Review';
  return 'Active & Verified';
};

const getLicenseStatusStyle = (status) => {
  if (status === 'expired') {
    return { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };
  }
  if (status === 'pending') {
    return { bg: '#fef3c7', text: '#a16207', border: '#fcd34d' };
  }
  return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
};

const LicenseProfile = () => {
  const { pharmacy, pushLicenseReminderNotification } = usePharmacyStore();
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const validUntilDate = useMemo(() => new Date(pharmacy?.validUntil || '2026-12-31'), [pharmacy?.validUntil]);
  const today = useMemo(() => new Date(), []);

  const daysLeft = useMemo(() => {
    const diff = validUntilDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [validUntilDate, today]);

  const licenseStatus = pharmacy?.licenseStatus || (pharmacy?.isLicenseVerified ? 'active' : 'pending');
  const shouldShowRenewalAlert = daysLeft > 0 && daysLeft < 60;
  const showVerificationTracker = licenseStatus !== 'active';

  const badgeStyle = getLicenseStatusStyle(licenseStatus);

  const profileInitials = (pharmacy?.name || 'VC')
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const handleStartRenewal = () => {
    pushLicenseReminderNotification(daysLeft);
  };

  return (
    <PharmacyDashboardLayout pageTitle="License & Profile">
      <Helmet>
        <title>License & Profile | VitalCode Pharmacy</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>License & Profile</h2>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 14 }}>Pharmacy Profile</h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#0f766e' }}>
                <span style={{ color: '#fff', fontSize: '1.06rem', fontWeight: 800 }}>{profileInitials}</span>
              </div>
              <div>
                <p style={{ color: '#0f172a', fontSize: '1.1rem', fontWeight: 800 }}>{pharmacy?.name || 'VitalCare Pharmacy'}</p>
                <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>{pharmacy?.ownerName || 'Ananya Deshmukh'}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p style={{ color: '#334155', fontSize: '0.8rem' }}>Address: <span style={{ fontWeight: 700 }}>{pharmacy?.address}</span></p>
              <p style={{ color: '#334155', fontSize: '0.8rem' }}>Contact: <span style={{ fontWeight: 700 }}>{pharmacy?.phone}</span> | <span style={{ fontWeight: 700 }}>{pharmacy?.email}</span></p>
              <p style={{ color: '#334155', fontSize: '0.8rem' }}>GST Number: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{pharmacy?.gstNumber}</span></p>
              <p style={{ color: '#334155', fontSize: '0.8rem' }}>Registered Since: <span style={{ fontWeight: 700 }}>{pharmacy?.registeredSince || '2022'}</span></p>
            </div>

            <button className="mt-4 px-4 py-2 rounded-xl" style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.8rem', fontWeight: 700 }}>
              Edit Profile
            </button>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 14 }}>License Verification Status</h3>

            <div className="text-center">
              {licenseStatus === 'active' ? (
                <ShieldCheck style={{ width: 54, height: 54, color: '#0f766e', margin: '0 auto' }} />
              ) : (
                <ShieldAlert style={{ width: 54, height: 54, color: '#dc2626', margin: '0 auto' }} />
              )}

              <div className="space-y-1.5 mt-3">
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>License Number: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{pharmacy?.licenseNumber || 'PH-MH-20345'}</span></p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>License Type: <span style={{ fontWeight: 700 }}>{pharmacy?.licenseType || 'Retail Pharmacy'}</span></p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Issuing Authority: <span style={{ fontWeight: 700 }}>{pharmacy?.issuingAuthority || 'Maharashtra State Pharmacy Council'}</span></p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Issue Date: <span style={{ fontWeight: 700 }}>01 Jan 2024</span></p>
                <p style={{ color: '#334155', fontSize: '0.8rem' }}>Valid Until: <span style={{ fontWeight: 700 }}>31 Dec 2026</span></p>
              </div>

              <span
                data-status={licenseStatus === 'active' ? 'license-verified' : licenseStatus === 'pending' ? 'pending-review' : 'expired'}
                className={`inline-flex px-3 py-1 rounded-full mt-3 status-pill vc-status-badge ${
                  licenseStatus === 'active'
                    ? 'status-license-verified'
                    : licenseStatus === 'pending'
                    ? 'status-pending-review'
                    : 'status-expired'
                }`}
                style={{ background: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`, color: badgeStyle.text, fontSize: '0.74rem', fontWeight: 700 }}
              >
                {getLicenseStatusLabel(licenseStatus)}
              </span>
            </div>

            {showVerificationTracker && (
              <div className="mt-5 rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h4 style={{ color: '#0f172a', fontSize: '0.84rem', fontWeight: 800 }}>Verification Process</h4>

                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#0f766e', color: '#fff', fontSize: '0.72rem', fontWeight: 800 }}>1</span>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        defaultValue={pharmacy?.licenseNumber || 'PH-MH-20345'}
                        className="rounded-xl px-3 py-2"
                        style={{ border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                      />
                      <button className="px-3 py-2 rounded-xl" style={{ background: '#0f766e', color: '#fff', fontSize: '0.76rem', fontWeight: 700 }}>
                        Submit
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#e2e8f0', color: '#475569', fontSize: '0.72rem', fontWeight: 800 }}>2</span>
                    <p style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600 }}>Verification in progress (24-48 hrs)</p>
                    <Clock3 style={{ width: 14, height: 14, color: '#64748b' }} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800 }}>3</span>
                    <p style={{ color: '#15803d', fontSize: '0.78rem', fontWeight: 600 }}>Verified</p>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#15803d' }} />
                  </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.74rem', marginTop: 10 }}>
                  License is verified against the State Pharmacy Council API automatically. Manual review may apply.
                </p>

                <div className="mt-3 rounded-xl p-4 text-center" style={{ border: '1px dashed #14b8a6', background: '#f0fdfa' }}>
                  <Upload style={{ width: 18, height: 18, color: '#0f766e', margin: '0 auto' }} />
                  <p style={{ color: '#0f766e', fontSize: '0.76rem', fontWeight: 700, marginTop: 6 }}>Upload License Document (PDF/image)</p>
                </div>
              </div>
            )}

            {shouldShowRenewalAlert && (
              <div className="mt-4 rounded-xl p-3" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                <p style={{ color: '#92400e', fontSize: '0.76rem', fontWeight: 700 }}>
                  Your license expires in {daysLeft} days. Renew before {validUntilDate.toLocaleDateString('en-IN')} to avoid service interruption.
                </p>
                <button
                  className="mt-2 px-3 py-1.5 rounded-lg"
                  style={{ background: '#fde68a', border: '1px solid #facc15', color: '#0f766e', fontSize: '0.74rem', fontWeight: 700 }}
                  onClick={handleStartRenewal}
                >
                  Start Renewal
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl p-5" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
          <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 14 }}>Account Security</h3>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <p style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 600 }}>Change Password</p>
              <button className="px-3 py-1.5 rounded-lg" style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.74rem', fontWeight: 700 }}>
                Update
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <p style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 600 }}>Two-Factor Authentication</p>
              <button
                type="button"
                onClick={() => setIs2FAEnabled((prev) => !prev)}
                className="w-12 h-6 rounded-full p-0.5"
                style={{ background: is2FAEnabled ? '#0f766e' : '#cbd5e1' }}
              >
                <span
                  className="block h-5 w-5 rounded-full bg-white transition-all"
                  style={{ transform: is2FAEnabled ? 'translateX(24px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            <div className="rounded-xl px-3 py-2.5" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <p style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 600 }}>Login History</p>
                <button style={{ color: '#0f766e', fontSize: '0.74rem', fontWeight: 700 }}>View All</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {['Device', 'Location', 'Time', 'Status'].map((head) => (
                        <th key={head} className="text-left py-2" style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((item) => (
                      <tr key={`${item.device}-${item.time}`} style={{ borderBottom: '1px solid #eef2f7' }}>
                        <td className="py-2" style={{ color: '#334155', fontSize: '0.76rem', fontWeight: 600 }}>{item.device}</td>
                        <td className="py-2" style={{ color: '#475569', fontSize: '0.76rem' }}>{item.location}</td>
                        <td className="py-2" style={{ color: '#475569', fontSize: '0.76rem' }}>{item.time}</td>
                        <td className="py-2">
                          <span
                            className="inline-flex px-2 py-0.5 rounded-full"
                            style={{
                              fontSize: '0.67rem',
                              fontWeight: 700,
                              color: item.status === 'Success' ? '#15803d' : '#dc2626',
                              background: item.status === 'Success' ? '#dcfce7' : '#fee2e2',
                              border: item.status === 'Success' ? '1px solid #86efac' : '1px solid #fecaca',
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl px-3 py-2.5" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <p style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Active Sessions</p>
              <div className="space-y-2">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
                    <div>
                      <p style={{ color: '#0f172a', fontSize: '0.76rem', fontWeight: 700 }}>{session.name}</p>
                      <p style={{ color: '#64748b', fontSize: '0.72rem' }}>{session.location} • Active {session.activeSince}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg" style={{ border: '1px solid #ef4444', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700 }}>
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PharmacyDashboardLayout>
  );
};

export default LicenseProfile;
