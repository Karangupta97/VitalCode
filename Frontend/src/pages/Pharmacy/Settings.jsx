import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { usePharmacyStore } from '../../store/pharmacyStore';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className="w-12 h-6 rounded-full p-0.5"
    style={{ background: checked ? '#0f766e' : '#cbd5e1' }}
  >
    <span
      className="block h-5 w-5 rounded-full bg-white transition-all"
      style={{ transform: checked ? 'translateX(24px)' : 'translateX(0)' }}
    />
  </button>
);

const SettingsPage = () => {
  const { pharmacy, updatePharmacyProfile } = usePharmacyStore();

  const [settings, setSettings] = useState({
    autoRefreshRequests: true,
    scanAttemptAlerts: true,
    doctorRequestAlerts: true,
    licenseReminders: true,
    soundAlerts: false,
    compactTableMode: false,
  });

  const [profileForm, setProfileForm] = useState({
    name: pharmacy?.name || '',
    ownerName: pharmacy?.ownerName || '',
    email: pharmacy?.email || '',
    phone: pharmacy?.phone || '',
    address: pharmacy?.address || '',
    gstNumber: pharmacy?.gstNumber || '',
  });

  useEffect(() => {
    setProfileForm({
      name: pharmacy?.name || '',
      ownerName: pharmacy?.ownerName || '',
      email: pharmacy?.email || '',
      phone: pharmacy?.phone || '',
      address: pharmacy?.address || '',
      gstNumber: pharmacy?.gstNumber || '',
    });
  }, [pharmacy]);

  const updateSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileInputChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePharmacyDetails = async () => {
    await updatePharmacyProfile({
      name: profileForm.name.trim(),
      ownerName: profileForm.ownerName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
      gstNumber: profileForm.gstNumber.trim(),
    });
  };

  const handleResetPharmacyDetails = () => {
    setProfileForm({
      name: pharmacy?.name || '',
      ownerName: pharmacy?.ownerName || '',
      email: pharmacy?.email || '',
      phone: pharmacy?.phone || '',
      address: pharmacy?.address || '',
      gstNumber: pharmacy?.gstNumber || '',
    });
  };

  const rows = [
    {
      group: 'Real-Time Alerts',
      items: [
        { key: 'autoRefreshRequests', label: 'Auto refresh doctor requests', action: 'Toggle' },
        { key: 'scanAttemptAlerts', label: 'Prescription scan attempt notifications', action: 'Toggle' },
        { key: 'doctorRequestAlerts', label: 'New doctor stock request notifications', action: 'Toggle' },
        { key: 'licenseReminders', label: 'License expiry reminders (60/30/7 days)', action: 'Toggle' },
        { key: 'soundAlerts', label: 'Play sound for critical alerts', action: 'Toggle' },
      ],
    },
    {
      group: 'Workspace Preferences',
      items: [
        { key: 'compactTableMode', label: 'Compact table mode', action: 'Toggle' },
      ],
    },
  ];

  return (
    <PharmacyDashboardLayout pageTitle="Settings">
      <Helmet>
        <title>Pharmacy Settings | VitalCode</title>
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Settings</h2>

        {rows.map((section) => (
          <section
            key={section.group}
            className="rounded-2xl p-5"
            style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
          >
            <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 14 }}>{section.group}</h3>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                  style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}
                >
                  <p style={{ color: '#334155', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</p>
                  <Toggle checked={settings[item.key]} onChange={() => updateSetting(item.key)} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
        >
          <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 4 }}>Pharmacy Details</h3>
          <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 14 }}>
            Update pharmacy identity and contact information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>Pharmacy Name</span>
              <input
                name="name"
                value={profileForm.name}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
                placeholder="Pharmacy name"
              />
            </label>

            <label className="space-y-1.5">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>Owner Name</span>
              <input
                name="ownerName"
                value={profileForm.ownerName}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
                placeholder="Owner full name"
              />
            </label>

            <label className="space-y-1.5">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>Email</span>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
                placeholder="name@example.com"
              />
            </label>

            <label className="space-y-1.5">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>Phone Number</span>
              <input
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
                placeholder="+91 98XXXXXXXX"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>Address</span>
              <textarea
                name="address"
                value={profileForm.address}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                rows={3}
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a', resize: 'vertical' }}
                placeholder="Street, city, state, pincode"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span style={{ color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>GST Number</span>
              <input
                name="gstNumber"
                value={profileForm.gstNumber}
                onChange={handleProfileInputChange}
                className="w-full rounded-xl px-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#0f172a' }}
                placeholder="GSTIN"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={handleSavePharmacyDetails}
              className="px-3.5 py-2 rounded-xl"
              style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.76rem', fontWeight: 700 }}
            >
              Save Pharmacy Details
            </button>
            <button
              type="button"
              onClick={handleResetPharmacyDetails}
              className="px-3.5 py-2 rounded-xl"
              style={{ border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.76rem', fontWeight: 700 }}
            >
              Reset
            </button>
          </div>
        </section>

        <section
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
        >
          <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800, marginBottom: 14 }}>Session Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3.5 py-2 rounded-xl" style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.76rem', fontWeight: 700 }}>
              Save Preferences
            </button>
            <button className="px-3.5 py-2 rounded-xl" style={{ border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.76rem', fontWeight: 700 }}>
              Reset to Default
            </button>
          </div>
        </section>
      </div>
    </PharmacyDashboardLayout>
  );
};

export default SettingsPage;
