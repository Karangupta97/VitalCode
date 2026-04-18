import React, { useEffect, useState } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  QrCode,
  ClipboardList,
  Package,
  Inbox,
  ShieldCheck,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { usePharmacyStore } from '../../store/pharmacyStore';
import GlobalLanguageSwitch from '../GlobalLanguageSwitch';
import { useRxLanguage } from '../../utils/rxI18n';

const slideIn = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -280, opacity: 0, transition: { duration: 0.25 } },
};

const navItems = [
  { key: 'nav.dashboard', fallback: 'Dashboard', icon: Home, path: '/pharmacy/dashboard' },
  { key: 'nav.scanPrescription', fallback: 'Scan Prescription', icon: QrCode, path: '/pharmacy/scan-prescription' },
  { key: 'nav.dispenseHistory', fallback: 'Dispense History', icon: ClipboardList, path: '/pharmacy/dispense-history' },
  { key: 'nav.stockInventory', fallback: 'Stock & Inventory', icon: Package, path: '/pharmacy/inventory' },
  { key: 'nav.doctorRequests', fallback: 'Doctor Requests', icon: Inbox, path: '/pharmacy/doctor-requests' },
  { key: 'nav.licenseProfile', fallback: 'License & Profile', icon: ShieldCheck, path: '/pharmacy/license-profile' },
  { key: 'nav.settings', fallback: 'Settings', icon: Settings, path: '/pharmacy/settings' },
];

const formatNotificationTime = (isoDate) => {
  const date = new Date(isoDate);
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const PharmacyDashboardLayout = ({ children, pageTitle }) => {
  const { t, lang } = useRxLanguage();
  const {
    isAuthenticated,
    pharmacy,
    getPharmacyProfile,
    logoutPharmacy,
    isLoading,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    startNotificationPolling,
    stopNotificationPolling,
  } = usePharmacyStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getPharmacyProfile();
      startNotificationPolling();
    }

    return () => {
      stopNotificationPolling();
    };
  }, [getPharmacyProfile, isAuthenticated, startNotificationPolling, stopNotificationPolling]);

  useEffect(() => {
    setSidebarOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutPharmacy();
    navigate('/pharmacy/login');
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #EAFBFF 0%, #F3F5FA 100%)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: 48,
            height: 48,
            border: '3px solid #d9e2ec',
            borderTopColor: '#0066CC',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/pharmacy/login" replace />;
  }

  const pharmacyName = pharmacy?.name || 'HealthVault Pharmacy';
  const firstName = pharmacyName.split(' ')[0] || 'Pharmacy';
  const initials = pharmacy?.initials || pharmacyName.slice(0, 2).toUpperCase();
  const isVerified = pharmacy?.isLicenseVerified !== false;

  const currentDate = new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const SidebarContent = () => (
    <div className="h-full flex flex-col vc-dashboard-sidebar" style={{ background: '#ffffff' }}>
      <div className="px-5 py-5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#E6F4FF', border: '2px solid rgba(0,102,204,0.2)' }}
          >
            <span style={{ color: '#0066CC', fontWeight: 800, fontSize: '0.95rem' }}>{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ color: '#2C3A4A', fontWeight: 800, fontSize: '0.98rem' }}>
              HealthVault
            </p>
            <p className="truncate" style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 500 }}>
              {firstName} {t('pharmacy.consoleSuffix', 'Console')}
            </p>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg"
            style={{ background: '#E6F4FF' }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X style={{ color: '#0066CC', width: 18, height: 18 }} />
          </button>
        </div>

        <div
          data-status={isVerified ? 'license-verified' : 'pending-review'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-3 status-pill vc-status-badge ${
            isVerified ? 'status-license-verified' : 'status-pending-review'
          }`}
          style={{
            background: isVerified ? '#E6F4FF' : '#FFEAEA',
            border: isVerified ? '1px solid rgba(0,102,204,0.25)' : '1px solid rgba(163,45,45,0.3)',
          }}
        >
          {isVerified ? (
            <ShieldCheck style={{ width: 14, height: 14, color: '#004A99' }} />
          ) : (
            <ShieldAlert style={{ width: 14, height: 14, color: '#A32D2D' }} />
          )}
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: isVerified ? '#004A99' : '#A32D2D',
              letterSpacing: '0.01em',
            }}
            data-i18n={isVerified ? 'status.licenseVerified' : 'status.pendingReview'}
          >
            {isVerified
              ? t('status.licenseVerified', 'Pharmacy Verified')
              : t('status.pendingReview', 'Verification Pending')}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const label = t(item.key, item.fallback);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? '#0066CC' : 'transparent',
                color: isActive ? '#ffffff' : '#2C3A4A',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                border: isActive ? '1px solid #0066CC' : '1px solid transparent',
              }}
              onMouseEnter={(event) => {
                if (!isActive) event.currentTarget.style.background = 'rgba(0,102,204,0.08)';
              }}
              onMouseLeave={(event) => {
                if (!isActive) event.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              <span data-i18n={item.key}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4" style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: '#FFF0ED',
            color: '#B74E3F',
            border: '1px solid rgba(232,125,107,0.35)',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = 'rgba(232,125,107,0.2)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = '#FFF0ED';
          }}
        >
          <LogOut style={{ width: 18, height: 18 }} />
          <span data-i18n="nav.logout">{t('nav.logout', 'Logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen flex vc-dashboard-shell" style={{ background: 'linear-gradient(135deg, #EAFBFF 0%, #F3F5FA 100%)', fontFamily: "'Inter', sans-serif" }}>
        <aside className="hidden lg:block flex-shrink-0" style={{ width: 264 }}>
          <div className="fixed top-0 left-0 h-screen" style={{ width: 264, zIndex: 40 }}>
            <SidebarContent />
          </div>
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 lg:hidden"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                variants={slideIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 left-0 bottom-0 lg:hidden"
                style={{ width: 280, zIndex: 51 }}
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <header
            className="sticky top-0 vc-glass-topbar"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              borderBottom: '0.5px solid rgba(0,0,0,0.08)',
              zIndex: 30,
            }}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden p-2 rounded-xl"
                  style={{ background: '#E6F4FF' }}
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu style={{ width: 20, height: 20, color: '#0066CC' }} />
                </button>
                <div>
                  <h1
                    style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                      fontWeight: 800,
                      color: '#0f172a',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {pageTitle || t('nav.dashboard', 'Dashboard')}
                  </h1>
                  <p className="hidden sm:block" style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>
                    {currentDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <GlobalLanguageSwitch />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen((prev) => !prev);
                      setProfileMenuOpen(false);
                    }}
                    className="relative p-2.5 rounded-xl transition-all duration-200"
                    style={{ background: '#E6F4FF', border: '0.5px solid rgba(0,0,0,0.08)' }}
                  >
                    <Bell style={{ width: 18, height: 18, color: '#0066CC' }} />
                    {unreadNotificationsCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 px-1.5 rounded-full"
                        style={{
                          minWidth: 18,
                          height: 18,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          lineHeight: '18px',
                          textAlign: 'center',
                          background: '#ef4444',
                          color: '#fff',
                        }}
                      >
                        {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden"
                        style={{
                          background: '#fff',
                          border: '0.5px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.14)',
                          zIndex: 80,
                        }}
                      >
                        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                          <p style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Notifications</p>
                          {unreadNotificationsCount > 0 && (
                            <button
                              type="button"
                              style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0066CC' }}
                              onClick={markAllNotificationsAsRead}
                            >
                                {t('notif.markAllRead', 'Mark all read')}
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 && (
                            <div className="px-4 py-8 text-center">
                              <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                                {t('notif.none', 'No notifications yet')}
                              </p>
                            </div>
                          )}

                          {notifications.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => markNotificationAsRead(item.id)}
                              className="w-full text-left px-4 py-3 transition-colors"
                              style={{
                                background: item.read ? '#fff' : '#E6F4FF',
                                borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                              }}
                            >
                              <div className="flex items-start gap-2.5">
                                <div
                                  className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{ background: item.read ? '#f1f5f9' : '#d9ecff' }}
                                >
                                  <Bell style={{ width: 14, height: 14, color: item.read ? '#64748b' : '#0066CC' }} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</p>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                                      {formatNotificationTime(item.createdAt)}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '0.76rem', color: '#475569', marginTop: 2 }}>{item.message}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen((prev) => !prev);
                      setNotificationsOpen(false);
                    }}
                    className="rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      width: 38,
                      height: 38,
                      background: 'linear-gradient(135deg, #0066CC, #3EB489)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      boxShadow: profileMenuOpen
                        ? '0 0 0 3px rgba(0,102,204,0.16), 0 8px 20px rgba(0,102,204,0.22)'
                        : '0 4px 14px rgba(0,102,204,0.2)',
                    }}
                    aria-label="Open pharmacy profile"
                  >
                    {initials}
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden"
                        style={{
                          background: '#fff',
                          border: '0.5px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.14)',
                          zIndex: 80,
                        }}
                      >
                        <div
                          className="px-4 py-3"
                          style={{
                            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                            background: 'linear-gradient(140deg, rgba(230,244,255,0.95), rgba(234,249,243,0.85))',
                          }}
                        >
                          <p style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>Pharmacy Details</p>
                          <p style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', marginTop: 2 }}>
                            Manage from Settings anytime
                          </p>
                        </div>

                        <div className="px-4 py-3 space-y-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <div>
                            <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Name
                            </p>
                            <p style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 700, marginTop: 2 }}>
                              {pharmacy?.name || 'VitalCare Pharmacy'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Email
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600, marginTop: 2 }}>
                              {pharmacy?.email || 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Phone
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600, marginTop: 2 }}>
                              {pharmacy?.phone || 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Address
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600, marginTop: 2, lineHeight: 1.45 }}>
                              {pharmacy?.address || 'Not provided'}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 py-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              navigate('/pharmacy/settings');
                            }}
                            className="px-3 py-2 rounded-xl"
                            style={{
                              border: '1px solid #3EB489',
                              color: '#2C3A4A',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            Edit Details
                          </button>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl"
                            style={{
                              border: '1px solid #fecdd3',
                              color: '#be123c',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: '#fff1f2',
                            }}
                          >
                            <LogOut style={{ width: 14, height: 14 }} />
                            <span data-i18n="nav.logout">{t('nav.logout', 'Logout')}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-y-auto">{children}</main>
        </div>
      </div>

      {(notificationsOpen || profileMenuOpen) && (
        <button
          type="button"
          aria-label="Close open panel"
          className="fixed inset-0"
          style={{ background: 'transparent', zIndex: 20 }}
          onClick={() => {
            setNotificationsOpen(false);
            setProfileMenuOpen(false);
          }}
        >
          <span className="sr-only">Close</span>
        </button>
      )}

      {unreadNotificationsCount > 0 && (
        <div className="hidden">
          <CheckCircle2 />
        </div>
      )}
    </>
  );
};

export default PharmacyDashboardLayout;
