import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiRefreshCw,
  FiShield,
  FiSearch,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
} from 'react-icons/fi';
import DoctorDashboardLayout from '../../components/Doctor/DoctorDashboardLayout';
import { useDoctorStore } from '../../store/doctorStore';

const quickStats = [
  { title: "Today's Appointments", value: '24', note: '4 waiting confirmations' },
  { title: 'Prescription Clearance', value: '91%', note: '3 pending biometric approvals' },
];

const stockSummary = [
  {
    title: 'Low Stock',
    note: 'Metformin, Insulin, Vitamin B12',
    icon: FiAlertTriangle,
    iconColor: '#134e4a',
    iconBg: 'rgba(16,185,129,0.14)',
  },
  {
    title: 'Restocking',
    note: 'Restocking by evening',
    icon: FiRefreshCw,
    iconColor: '#0f766e',
    iconBg: 'rgba(20,184,166,0.14)',
  },
];

const pendingRows = [
  { patient: 'Sarah Smith', medicine: 'Metformin 500mg', status: 'Low Stock', statusKey: 'status-low-stock' },
  { patient: 'John Doe', medicine: 'Amoxicillin 500mg', status: 'Pending', statusKey: 'status-pending' },
  { patient: 'Sam Emmanuel', medicine: 'Lisinopril 10mg', status: 'Pending', statusKey: 'status-pending' },
  { patient: 'John Samuel', medicine: 'Paracetamol 650mg', status: 'Ready', statusKey: 'status-ready' },
];

const pendingStatusStyles = {
  'Low Stock': { background: '#FFEAEA', color: '#D13B3B', border: '1px solid rgba(209,59,59,0.2)' },
  Pending: { background: '#FFF4CC', color: '#D98A00', border: '1px solid rgba(217,138,0,0.22)' },
  Ready: { background: '#DFF7E6', color: '#179B4C', border: '1px solid rgba(23,155,76,0.2)' },
};

const quickActions = [
  { title: 'Find Patient', desc: 'Search records by UMID', icon: FiSearch, to: '/doctor/find-patient' },
  { title: 'Appointments', desc: 'Manage consultations', icon: FiCalendar, to: '/doctor/appointments' },
  { title: 'Patients', desc: 'View patient directory', icon: FiUsers, to: '/doctor/patients' },
  { title: 'Medical Records', desc: 'Open reports and files', icon: FiFileText, to: '/doctor/medical-records' },
];

const DoctorDashboard = () => {
  const { doctor } = useDoctorStore();
  const doctorInfoItems = [
    { label: 'Doctor Name', value: doctor?.fullName, icon: FiUser },
    { label: 'Email', value: doctor?.email, icon: FiMail },
    { label: 'Phone', value: doctor?.phone, icon: FiPhone },
    { label: 'Specialization', value: doctor?.specialization, icon: FiAward },
    { label: 'Registration No.', value: doctor?.medicalRegistrationNumber, icon: FiFileText },
    { label: 'State', value: doctor?.state, icon: FiMapPin },
  ];

  return (
    <DoctorDashboardLayout pageTitle="Doctor Dashboard">
      <Helmet>
        <title>Doctor Dashboard | VitalCode</title>
        <meta
          name="description"
          content="Doctor command center for prescriptions, emergency alerts, and pharmacy status."
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="xl:col-span-9 overflow-hidden rounded-[18px]"
            style={{
              background:
                'linear-gradient(132deg, rgba(47,110,203,0.54) 0%, rgba(15,141,137,0.42) 56%, rgba(27,201,183,0.34) 100%)',
              border: '1px solid rgba(255,255,255,0.34)',
              boxShadow: '0 20px 42px rgba(6, 40, 57, 0.2), inset 0 1px 0 rgba(255,255,255,0.28)',
              backdropFilter: 'blur(18px) saturate(145%)',
              WebkitBackdropFilter: 'blur(18px) saturate(145%)',
            }}
          >
            <div className="relative px-6 sm:px-8 py-6 sm:py-7">
              <div
                className="absolute right-[-30px] top-[-20px] w-[220px] h-[220px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%)' }}
              />
              <div
                className="absolute left-[45%] bottom-[-60px] w-[260px] h-[220px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)' }}
              />

              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '0.5px solid rgba(255,255,255,0.45)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                >
                  <FiShield style={{ color: '#e9fdf8', fontSize: '0.85rem' }} />
                  <span style={{ color: '#eafcff', fontWeight: 700, fontSize: '0.95rem' }}>Secure Care Hub</span>
                </div>

                <h2
                  className="mt-4"
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: 'clamp(1.75rem,3.1vw,2.95rem)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome back, Dr. {doctor?.fullName || 'Sara Abraham'}
                </h2>

                <p
                  className="mt-3 max-w-3xl"
                  style={{ color: 'rgba(255,255,255,0.92)', fontSize: 'clamp(1rem,1.4vw,1.08rem)', fontWeight: 500 }}
                >
                  Track prescriptions, authorize access, and monitor emergency records from one secure workspace.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    className="px-5 py-2.5 rounded-[12px]"
                    style={{
                      background: 'rgba(255,255,255,0.82)',
                      color: '#0f635d',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      border: '1px solid rgba(255,255,255,0.58)',
                      boxShadow: '0 10px 24px rgba(5, 55, 52, 0.16)',
                      backdropFilter: 'blur(7px)',
                      WebkitBackdropFilter: 'blur(7px)',
                    }}
                  >
                    + New Prescription
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-[12px]"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: '#f8ffff',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      border: '0.5px solid rgba(255,255,255,0.45)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    Open Queue
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {[
                    { label: 'Pending Cases', value: 12 },
                    { label: 'Emergency Alerts', value: 2 },
                    { label: 'Biometry Required', value: 3 },
                  ].map((chip) => (
                    <div
                      key={chip.label}
                      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                      style={{
                        background: 'rgba(255,255,255,0.16)',
                        border: '0.5px solid rgba(255,255,255,0.4)',
                        color: '#f5ffff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.26)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    >
                      <span>{chip.label}</span>
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{
                          width: 24,
                          height: 24,
                          background: 'rgba(28,61,119,0.35)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {chip.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="xl:col-span-3 flex flex-col gap-5"
          >
            {quickStats.map((item) => (
              <div
                key={item.title}
                className="rounded-[18px] p-5"
                style={{
                  background: 'linear-gradient(150deg, rgba(255,255,255,0.48), rgba(221,244,244,0.36))',
                  border: '1px solid rgba(255,255,255,0.46)',
                  boxShadow: '0 16px 30px rgba(10, 55, 61, 0.12), inset 0 1px 0 rgba(255,255,255,0.38)',
                  backdropFilter: 'blur(16px) saturate(135%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(135%)',
                }}
              >
                <p style={{ color: '#35686a', fontSize: '1.02rem', fontWeight: 600 }}>{item.title}</p>
                <p className="mt-1" style={{ color: '#0f4d4f', fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.1 }}>
                  {item.value}
                </p>
                <p className="mt-2" style={{ color: '#457b7e', fontSize: '0.96rem', fontWeight: 500 }}>{item.note}</p>
              </div>
            ))}
          </motion.aside>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-[18px] p-5 sm:p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.96), rgba(236,248,249,0.95))',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ color: '#163c3f', fontSize: 'clamp(1.45rem,2.4vw,2rem)', fontWeight: 700 }}>Pharmacy Stock Summary</h3>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stockSummary.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-[14px] px-5 py-8 text-center"
                    style={{
                      background: 'linear-gradient(145deg, rgba(228,243,247,0.75), rgba(213,235,240,0.78))',
                      border: '0.5px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <div
                      className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: card.iconBg }}
                    >
                      <Icon style={{ color: card.iconColor, fontSize: '1.65rem' }} />
                    </div>
                    <p className="mt-4" style={{ color: '#143d3f', fontWeight: 800, fontSize: '1.9rem' }}>{card.title}</p>
                    <p className="mt-2" style={{ color: '#3e7679', fontSize: '1rem', fontWeight: 500 }}>{card.note}</p>
                  </article>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="rounded-[18px] p-5 sm:p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(246,252,252,0.95), rgba(224,245,243,0.94))',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ color: '#163c3f', fontSize: 'clamp(1.45rem,2.4vw,2rem)', fontWeight: 700 }}>Pending Prescriptions to Give</h3>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <tbody>
                  {pendingRows.map((row) => (
                    <tr key={`${row.patient}-${row.medicine}`} style={{ borderBottom: '0.5px solid rgba(19,78,74,0.14)' }}>
                      <td style={{ padding: '0.78rem 0.3rem 0.78rem 0', color: '#1a4043', fontWeight: 700, fontSize: '1.18rem' }}>
                        {row.patient}
                      </td>
                      <td style={{ padding: '0.78rem 0.3rem', color: '#2f6f72', fontWeight: 500, fontSize: '1.18rem' }}>
                        {row.medicine}
                      </td>
                      <td style={{ padding: '0.78rem 0 0.78rem 0.3rem', textAlign: 'right' }}>
                        <span
                          className={`status-pill vc-status-badge ${row.statusKey}`}
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            background: pendingStatusStyles[row.status].background,
                            color: pendingStatusStyles[row.status].color,
                            border: pendingStatusStyles[row.status].border,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="xl:col-span-5 rounded-[18px] p-5 sm:p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(248,253,253,0.96), rgba(229,245,244,0.92))',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ color: '#163c3f', fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 700 }}>Quick Actions</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="rounded-[14px] px-4 py-4 transition-all duration-200"
                    style={{
                      background: 'rgba(222,241,244,0.8)',
                      border: '0.5px solid rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 93, 101, 0.14)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(20, 151, 145, 0.16)' }}
                      >
                        <Icon style={{ color: '#116d6a', fontSize: '1.1rem' }} />
                      </div>
                      <div>
                        <p style={{ color: '#184244', fontWeight: 700, fontSize: '1rem' }}>{action.title}</p>
                        <p style={{ color: '#467679', fontSize: '0.9rem', marginTop: 2 }}>{action.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="xl:col-span-7 rounded-[18px] p-5 sm:p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(251,255,255,0.98), rgba(234,247,247,0.94))',
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ color: '#163c3f', fontSize: 'clamp(1.3rem,2vw,1.7rem)', fontWeight: 700 }}>Doctor Information</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {doctorInfoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[14px] px-4 py-3"
                    style={{
                      background: 'rgba(221,238,242,0.78)',
                      border: '0.5px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon style={{ color: '#1b6d73', fontSize: '1rem' }} />
                      <span style={{ color: '#386a6d', fontWeight: 600, fontSize: '0.85rem' }}>{item.label}</span>
                    </div>
                    <p className="mt-1.5 truncate" style={{ color: '#173f43', fontWeight: 700, fontSize: '0.95rem' }}>
                      {item.value || 'Not provided'}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboard;
