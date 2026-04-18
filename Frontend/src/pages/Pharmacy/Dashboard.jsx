import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { usePharmacyStore } from '../../store/pharmacyStore';
import { useRxLanguage } from '../../utils/rxI18n';

const RX_COLORS = {
  primary: '#0066CC',
  primaryDark: '#004A99',
  primaryDeep: '#003A7A',
  secondary: '#3EB489',
  coral: '#E87D6B',
  text: '#2C3A4A',
};

const dashboardCardStyle = {
  background: 'linear-gradient(140deg, #ffffff 0%, #f2fff8 100%)',
  border: '0.5px solid rgba(0,0,0,0.08)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
};

const statCards = [
  {
    labelKey: 'pharmacy.stat.medicinesSoldToday',
    labelFallback: 'Medicines Sold Today',
    value: '148',
    subKey: 'pharmacy.stat.acrossPrescriptions',
    subFallback: 'across 34 prescriptions',
    trendKey: 'pharmacy.stat.vsYesterday',
    trendFallback: '+12% vs yesterday',
    trendColor: '#3EB489',
  },
  {
    labelKey: 'pharmacy.stat.totalRevenueToday',
    labelFallback: 'Total Revenue Today',
    value: '₹18,240',
    subKey: 'pharmacy.stat.pendingPayments',
    subFallback: '3 pending payments',
    trendKey: 'pharmacy.stat.revenueTrend',
    trendFallback: 'Revenue trending up',
    trendColor: '#3EB489',
  },
  {
    labelKey: 'pharmacy.stat.prescriptionsDispensed',
    labelFallback: 'Prescriptions Dispensed',
    value: '34',
    subKey: 'pharmacy.stat.pendingVerification',
    subFallback: '6 pending verification',
    trendKey: null,
    trendFallback: null,
    trendColor: '#0066CC',
  },
  {
    labelKey: 'pharmacy.stat.stockAlerts',
    labelFallback: 'Stock Alerts',
    value: '3',
    subKey: 'pharmacy.stat.stockAlertItems',
    subFallback: 'Metformin, Insulin, Vit B12',
    trendKey: 'pharmacy.stat.needsActionNow',
    trendFallback: 'Needs action now',
    trendColor: '#A32D2D',
  },
];

const weeklySales = [
  { day: 'Mon', units: 165, revenue: 6950 },
  { day: 'Tue', units: 210, revenue: 9450 },
  { day: 'Wed', units: 243, revenue: 11200 },
  { day: 'Thu', units: 188, revenue: 8140 },
  { day: 'Fri', units: 176, revenue: 7695 },
  { day: 'Sat', units: 124, revenue: 5420 },
  { day: 'Sun', units: 128, revenue: 5710 },
];

const recentDispensed = [
  { patient: 'Rahul S.', doctor: 'Dr. Kavya Menon', medicine: 'Paracetamol 650mg', qty: 10, time: '09:15 AM', status: 'dispensed' },
  { patient: 'Anita P.', doctor: 'Dr. Pranav Joshi', medicine: 'Azithromycin 500mg', qty: 6, time: '10:02 AM', status: 'pending' },
  { patient: 'Irfan K.', doctor: 'Dr. Nikhil Batra', medicine: 'Insulin Glargine', qty: 2, time: '10:38 AM', status: 'dispensed' },
  { patient: 'Meera G.', doctor: 'Dr. S. Kulkarni', medicine: 'Metformin 500mg', qty: 20, time: '11:11 AM', status: 'rejected' },
  { patient: 'Aditya R.', doctor: 'Dr. Sneha Rao', medicine: 'Vitamin B12 Inj.', qty: 4, time: '11:49 AM', status: 'dispensed' },
];

const lowStock = [
  { medicine: 'Metformin 500mg', currentStock: 8, reorderLevel: 20 },
  { medicine: 'Insulin Glargine', currentStock: 0, reorderLevel: 15 },
  { medicine: 'Vitamin B12 Injection', currentStock: 5, reorderLevel: 12 },
  { medicine: 'Atorvastatin 10mg', currentStock: 16, reorderLevel: 24 },
];

const pendingRequests = [
  { doctor: 'Dr. R. Sharma', medicine: 'Paracetamol 650mg', qty: 40, requested: '20 mins ago' },
  { doctor: 'Dr. M. Khan', medicine: 'Cefixime 200mg', qty: 25, requested: '38 mins ago' },
  { doctor: 'Dr. A. Joshi', medicine: 'Pantoprazole 40mg', qty: 60, requested: '1 hr ago' },
];

const statusBadgeStyles = {
  dispensed: { bg: '#E6F4FF', text: '#004A99', border: 'rgba(0,74,153,0.28)' },
  pending: { bg: '#F1F5F9', text: '#5B6675', border: 'rgba(91,102,117,0.3)' },
  rejected: { bg: '#FFEAEA', text: '#A32D2D', border: 'rgba(163,45,45,0.35)' },
};

const CustomChartTooltip = ({ active, payload, label, dayNameMap, locale = 'en-IN', unitsLabel = 'units sold' }) => {
  if (!active || !payload || payload.length === 0) return null;

  const row = payload[0].payload;
  const dayName = dayNameMap?.[label] || label;

  return (
    <div
      className="px-3 py-2 rounded-xl"
      style={{ background: RX_COLORS.primaryDeep, color: '#eaf4ff', border: '0.5px solid rgba(255,255,255,0.24)' }}
    >
      <p style={{ fontSize: '0.78rem', fontWeight: 700 }}>{`${dayName} — ${row.units} ${unitsLabel} — ₹${row.revenue.toLocaleString(locale)}`}</p>
    </div>
  );
};

const Dashboard = () => {
  const { t, lang } = useRxLanguage();
  const { pharmacy } = usePharmacyStore();
  const locale = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
  const dayNameMap = {
    Mon: t('day.mon.full', 'Monday'),
    Tue: t('day.tue.full', 'Tuesday'),
    Wed: t('day.wed.full', 'Wednesday'),
    Thu: t('day.thu.full', 'Thursday'),
    Fri: t('day.fri.full', 'Friday'),
    Sat: t('day.sat.full', 'Saturday'),
    Sun: t('day.sun.full', 'Sunday'),
  };
  const dayShortMap = {
    Mon: t('day.mon.short', 'Mon'),
    Tue: t('day.tue.short', 'Tue'),
    Wed: t('day.wed.short', 'Wed'),
    Thu: t('day.thu.short', 'Thu'),
    Fri: t('day.fri.short', 'Fri'),
    Sat: t('day.sat.short', 'Sat'),
    Sun: t('day.sun.short', 'Sun'),
  };

  return (
    <PharmacyDashboardLayout pageTitle={t('pharmacy.pageTitle', 'Pharmacy Dashboard')}>
      <Helmet>
        <title>{`${t('pharmacy.pageTitle', 'Pharmacy Dashboard')} | HealthVault`}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl rx-cta-banner"
          style={{ background: 'linear-gradient(135deg, #003A7A 0%, #004A99 55%, #0066CC 100%)' }}
        >
          <div className="absolute pointer-events-none" style={{ top: '-30%', right: '-8%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(62,180,137,0.3) 0%, transparent 72%)', filter: 'blur(48px)' }} />
          <div className="absolute pointer-events-none" style={{ bottom: '-25%', left: '-5%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(234,251,255,0.35) 0%, transparent 70%)', filter: 'blur(42px)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 p-5 sm:p-7 lg:p-9">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <ShieldCheck style={{ width: 14, height: 14, color: '#9BE3CC' }} />
              <span style={{ color: '#fff', fontSize: '0.74rem', fontWeight: 700 }} data-i18n="pharmacy.commandCenter">
                {t('pharmacy.commandCenter', 'Pharmacy Command Center')}
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.1rem)', fontWeight: 800, color: '#fff', marginTop: 14, letterSpacing: '-0.02em' }}>
              {t('pharmacy.greeting', 'Good Morning')}, {pharmacy?.name || t('pharmacy.partnerFallback', 'HealthVault Partner Pharmacy')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.92rem', maxWidth: 760, marginTop: 8, lineHeight: 1.55 }} data-i18n="pharmacy.heroSub">
              {t('pharmacy.heroSub', 'Dispense verified prescriptions, manage your inventory, and fulfill clinic stock requests - all in one place.')}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                className="px-4 py-2.5 rounded-xl"
                style={{ background: '#fff', color: RX_COLORS.primaryDark, fontWeight: 700, fontSize: '0.84rem' }}
              >
                {t('pharmacy.btn.scanPrescription', 'Scan Prescription')}
              </button>
              <button
                className="px-4 py-2.5 rounded-xl"
                style={{ border: '1px solid rgba(62,180,137,0.8)', color: '#fff', fontWeight: 700, fontSize: '0.84rem' }}
              >
                {t('pharmacy.btn.viewQueue', 'View Queue')}
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
              {[
                { key: 'pharmacy.metric.pendingScans', fallback: 'Pending Scans', value: 5 },
                { key: 'pharmacy.metric.lowStockAlerts', fallback: 'Low Stock Alerts', value: 3 },
                { key: 'pharmacy.metric.doctorRequests', fallback: 'Doctor Requests', value: 7 },
              ].map((item) => (
                <div
                  key={item.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <span style={{ color: '#e0f2fe', fontSize: '0.74rem', fontWeight: 600 }} data-i18n={item.key}>{t(item.key, item.fallback)}</span>
                  <span style={{ color: '#fff', fontSize: '0.74rem', fontWeight: 800 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {statCards.map((card) => (
            <div
              key={card.labelKey}
              className="rounded-2xl p-4 sm:p-5"
              style={dashboardCardStyle}
            >
              <p style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.02em' }} data-i18n={card.labelKey}>{t(card.labelKey, card.labelFallback)}</p>
              <p style={{ color: '#0f172a', fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.1, marginTop: 7 }}>{card.value}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 500, marginTop: 6 }} data-i18n={card.subKey}>{t(card.subKey, card.subFallback)}</p>
              {card.trendKey && (
                <div className="inline-flex items-center gap-1 mt-3">
                  <ArrowUpRight style={{ width: 14, height: 14, color: card.trendColor }} />
                  <span style={{ color: card.trendColor, fontSize: '0.75rem', fontWeight: 700 }} data-i18n={card.trendKey}>{t(card.trendKey, card.trendFallback)}</span>
                </div>
              )}
            </div>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="rounded-2xl p-4 sm:p-5"
          style={dashboardCardStyle}
        >
          <h3 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 800 }} data-i18n="pharmacy.weeklySales">{t('pharmacy.weeklySales', 'Medicines Sold - This Week')}</h3>
          <div style={{ height: 310, marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(value) => dayShortMap[value] || value} />
                <YAxis domain={[0, 300]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomChartTooltip dayNameMap={dayNameMap} locale={locale} unitsLabel={t('pharmacy.chart.unitsSold', 'units sold')} />} cursor={{ fill: 'rgba(15,118,110,0.08)' }} />
                <Bar dataKey="units" fill={RX_COLORS.primary} radius={[8, 8, 2, 2]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-3">
            {[
              t('pharmacy.chart.topMedicine', 'Top Medicine: Paracetamol 650mg'),
              t('pharmacy.chart.peakDay', 'Peak Day: Wednesday'),
              t('pharmacy.chart.avgDaily', 'Avg Daily: 162 units'),
            ].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 rounded-full"
                style={{ background: '#E6F4FF', border: '0.5px solid rgba(0,74,153,0.25)', color: '#004A99', fontSize: '0.73rem', fontWeight: 700 }}
              >
                {pill}
              </span>
            ))}
          </div>
        </motion.section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={dashboardCardStyle}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#f8fbff' }}>
              <h3 style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }} data-i18n="pharmacy.table.recentDispensed">{t('pharmacy.table.recentDispensed', 'Recent Dispensed Prescriptions')}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                    {[
                      { key: 'pharmacy.table.patient', fallback: 'Patient' },
                      { key: 'pharmacy.table.doctor', fallback: 'Doctor' },
                      { key: 'pharmacy.table.medicine', fallback: 'Medicine' },
                      { key: 'pharmacy.table.qty', fallback: 'Qty' },
                      { key: 'pharmacy.table.time', fallback: 'Time' },
                      { key: 'pharmacy.table.status', fallback: 'Status' },
                    ].map((head) => (
                      <th key={head.key} className="text-left px-4 py-2.5" style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t(head.key, head.fallback)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDispensed.map((row) => (
                    <tr key={`${row.patient}-${row.time}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.79rem', color: '#0f172a', fontWeight: 600 }}>{row.patient}</td>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>{row.doctor}</td>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 500 }}>{row.medicine}</td>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 600 }}>{row.qty}</td>
                      <td className="px-4 py-2.5" style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{row.time}</td>
                      <td className="px-4 py-2.5">
                        <span
                          data-status={row.status}
                          className={`inline-flex px-2.5 py-1 rounded-full status-pill vc-status-badge status-${row.status}`}
                          style={{
                            fontSize: '0.69rem',
                            fontWeight: 700,
                            color: statusBadgeStyles[row.status].text,
                            background: statusBadgeStyles[row.status].bg,
                            border: `1px solid ${statusBadgeStyles[row.status].border}`,
                          }}
                        >
                          {t(`status.rx.${row.status}`, row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4">
              <button
                className="w-full py-2.5 rounded-xl"
                style={{ background: RX_COLORS.primary, color: '#fff', fontSize: '0.83rem', fontWeight: 700 }}
              >
                {t('pharmacy.btn.viewAll', 'View All')}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="rounded-2xl overflow-hidden"
            style={dashboardCardStyle}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#f8fbff' }}>
              <h3 style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }} data-i18n="pharmacy.lowStock.title">{t('pharmacy.lowStock.title', 'Low Stock Alerts')}</h3>
            </div>

            <div className="p-4 space-y-3">
              {lowStock.map((item) => {
                const isOutOfStock = item.currentStock === 0;
                const isLowStock = item.currentStock < item.reorderLevel;

                return (
                  <div
                    key={item.medicine}
                    className="rounded-xl px-3 py-3"
                    style={{ background: '#fff', border: '1px solid #e8edf5' }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p style={{ color: '#0f172a', fontSize: '0.82rem', fontWeight: 700 }}>{item.medicine}</p>
                        <p style={{ color: '#64748b', fontSize: '0.74rem', marginTop: 3 }}>
                          {t('pharmacy.lowStock.currentStock', 'Current Stock')}: <span style={{ fontWeight: 700 }}>{item.currentStock}</span> | {t('pharmacy.lowStock.reorderLevel', 'Reorder Level')}:{' '}
                          <span style={{ fontWeight: 700 }}>{item.reorderLevel}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        {isOutOfStock ? (
                          <span
                            data-status="out-of-stock"
                            className="inline-flex px-2 py-1 rounded-full status-pill vc-status-badge status-out-of-stock"
                            style={{ fontSize: '0.66rem', fontWeight: 800, color: '#A32D2D', background: '#FFEAEA', border: '1px solid rgba(163,45,45,0.25)' }}
                          >
                            {t('pharmacy.lowStock.outOfStock', 'OUT OF STOCK')}
                          </span>
                        ) : isLowStock ? (
                          <span
                            data-status="low-stock"
                            className="inline-flex px-2 py-1 rounded-full status-pill vc-status-badge status-low-stock"
                            style={{ fontSize: '0.66rem', fontWeight: 800, color: '#A32D2D', background: '#FFEAEA', border: '1px solid rgba(163,45,45,0.25)' }}
                          >
                            {t('pharmacy.lowStock.lowStock', 'Low Stock')}
                          </span>
                        ) : null}
                        <button
                          className="block mt-2 px-2.5 py-1.5 rounded-lg"
                          style={{ border: '1px solid #3EB489', color: '#2C3A4A', fontSize: '0.7rem', fontWeight: 700 }}
                        >
                          {t('pharmacy.btn.requestRestock', 'Request Restock')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 pt-0">
              <button
                className="w-full py-2.5 rounded-xl"
                style={{ background: RX_COLORS.primary, color: '#fff', fontSize: '0.83rem', fontWeight: 700 }}
              >
                {t('pharmacy.btn.manageInventory', 'Manage Inventory')}
              </button>
            </div>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="rounded-2xl overflow-hidden"
            style={dashboardCardStyle}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#f8fbff' }}>
              <h3 style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }} data-i18n="pharmacy.requests.title">{t('pharmacy.requests.title', 'Pending Doctor Stock Requests')}</h3>
            </div>

            <div className="p-4 space-y-3">
              {pendingRequests.map((req) => (
                <div key={`${req.doctor}-${req.requested}`} className="rounded-xl px-3 py-3" style={{ border: '1px solid #e8edf5', background: '#fff' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                    <div className="sm:col-span-2">
                      <p style={{ color: '#0f172a', fontSize: '0.8rem', fontWeight: 700 }}>{req.doctor}</p>
                      <p style={{ color: '#64748b', fontSize: '0.74rem' }}>{req.medicine}</p>
                    </div>
                    <p style={{ color: '#0f172a', fontSize: '0.76rem', fontWeight: 700 }}>{t('pharmacy.requests.qtyPrefix', 'Qty')}: {req.qty}</p>
                    <p style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>{req.requested}</p>
                    <div className="flex items-center gap-2 justify-start sm:justify-end">
                      <button className="px-2.5 py-1.5 rounded-lg" style={{ background: RX_COLORS.primary, color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>
                        {t('pharmacy.btn.accept', 'Accept')}
                      </button>
                      <button className="px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid #A32D2D', color: '#A32D2D', fontSize: '0.72rem', fontWeight: 700 }}>
                        {t('pharmacy.btn.decline', 'Decline')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <button style={{ color: RX_COLORS.primary, fontSize: '0.78rem', fontWeight: 700 }}>{t('pharmacy.btn.viewAllRequests', 'View All Requests')}</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="rounded-2xl overflow-hidden"
            style={dashboardCardStyle}
          >
            <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#f8fbff' }}>
              <h3 style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }} data-i18n="pharmacy.license.title">{t('pharmacy.license.title', 'License Status')}</h3>
            </div>

            <div className="p-6 text-center">
              {pharmacy?.licenseStatus === 'expired' || pharmacy?.licenseStatus === 'pending' ? (
                <>
                  <AlertTriangle style={{ width: 48, height: 48, color: '#dc2626', margin: '0 auto' }} />
                  <p style={{ color: '#dc2626', fontWeight: 800, marginTop: 10 }}>
                    {pharmacy?.licenseStatus === 'expired'
                      ? t('pharmacy.license.expired', 'License Expired')
                      : t('pharmacy.license.pendingReview', 'License Pending Review')}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: 8 }}>
                    {t('pharmacy.license.number', 'License No')}: {pharmacy?.licenseNumber || 'PH-MH-20345'}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 rounded-xl"
                    style={{ background: '#dc2626', color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    {t('pharmacy.btn.renewLicense', 'Renew License')}
                  </button>
                </>
              ) : (
                <>
                  <ShieldCheck style={{ width: 48, height: 48, color: '#004A99', margin: '0 auto' }} />
                  <p style={{ color: '#004A99', fontWeight: 800, marginTop: 10, fontSize: '1.06rem' }} data-i18n="pharmacy.license.verified">{t('pharmacy.license.verified', 'License Verified')}</p>
                  <div className="space-y-1.5 mt-3">
                    <p style={{ color: '#334155', fontSize: '0.8rem' }}>{t('pharmacy.license.number', 'License No')}: <span style={{ fontWeight: 700 }}>{pharmacy?.licenseNumber || 'PH-MH-20345'}</span></p>
                    <p style={{ color: '#334155', fontSize: '0.8rem' }}>{t('pharmacy.license.validUntil', 'Valid Until')}: <span style={{ fontWeight: 700 }}>31 Dec 2026</span></p>
                    <p style={{ color: '#334155', fontSize: '0.8rem' }}>{t('pharmacy.license.issuingBody', 'Issuing Body')}: <span style={{ fontWeight: 700 }}>{t('pharmacy.license.issuingBodyValue', 'Maharashtra State Pharmacy Council')}</span></p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3" style={{ background: '#E6F4FF', border: '1px solid rgba(0,74,153,0.25)' }}>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#004A99' }} />
                    <span style={{ color: '#004A99', fontSize: '0.73rem', fontWeight: 700 }} data-i18n="pharmacy.license.active">{t('pharmacy.license.active', 'Active')}</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </section>
      </div>
    </PharmacyDashboardLayout>
  );
};

export default Dashboard;
