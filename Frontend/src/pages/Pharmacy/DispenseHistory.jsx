import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Eye, Printer, X } from 'lucide-react';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { computePageCount, paginateRows, sortRows } from './tableUtils';

const historyRows = [
  { id: 'DSP-204501', patient: 'Rahul Sharma', doctor: 'Dr. Kavya Menon', medicinesCount: 3, dispensedOn: '2026-04-18 09:15', pharmacist: 'R. Patil', totalValue: 1240, status: 'Dispensed' },
  { id: 'DSP-204502', patient: 'Anita Patil', doctor: 'Dr. Nikhil Batra', medicinesCount: 4, dispensedOn: '2026-04-18 10:02', pharmacist: 'A. Naik', totalValue: 2480, status: 'Partial' },
  { id: 'DSP-204503', patient: 'Irfan Khan', doctor: 'Dr. Sneha Rao', medicinesCount: 2, dispensedOn: '2026-04-18 10:36', pharmacist: 'R. Patil', totalValue: 840, status: 'Dispensed' },
  { id: 'DSP-204504', patient: 'Meera Gupta', doctor: 'Dr. S. Kulkarni', medicinesCount: 2, dispensedOn: '2026-04-18 11:10', pharmacist: 'P. Yadav', totalValue: 760, status: 'Rejected' },
  { id: 'DSP-204505', patient: 'Amit Desai', doctor: 'Dr. Kavya Menon', medicinesCount: 5, dispensedOn: '2026-04-17 16:11', pharmacist: 'R. Patil', totalValue: 2860, status: 'Dispensed' },
  { id: 'DSP-204506', patient: 'Shreya Joshi', doctor: 'Dr. A. Sawant', medicinesCount: 3, dispensedOn: '2026-04-17 14:32', pharmacist: 'A. Naik', totalValue: 1260, status: 'Dispensed' },
  { id: 'DSP-204507', patient: 'Vivek Rao', doctor: 'Dr. M. Khan', medicinesCount: 1, dispensedOn: '2026-04-17 13:08', pharmacist: 'R. Patil', totalValue: 320, status: 'Partial' },
  { id: 'DSP-204508', patient: 'Karishma Shah', doctor: 'Dr. Nikhil Batra', medicinesCount: 4, dispensedOn: '2026-04-17 11:48', pharmacist: 'P. Yadav', totalValue: 1940, status: 'Dispensed' },
  { id: 'DSP-204509', patient: 'Sanjay Gupta', doctor: 'Dr. P. Sethi', medicinesCount: 2, dispensedOn: '2026-04-17 10:03', pharmacist: 'R. Patil', totalValue: 590, status: 'Rejected' },
  { id: 'DSP-204510', patient: 'Neha Kulkarni', doctor: 'Dr. Sneha Rao', medicinesCount: 3, dispensedOn: '2026-04-16 18:14', pharmacist: 'A. Naik', totalValue: 1120, status: 'Dispensed' },
  { id: 'DSP-204511', patient: 'Akash Verma', doctor: 'Dr. Kavya Menon', medicinesCount: 4, dispensedOn: '2026-04-16 17:36', pharmacist: 'R. Patil', totalValue: 1820, status: 'Dispensed' },
  { id: 'DSP-204512', patient: 'Pooja Jain', doctor: 'Dr. R. Sharma', medicinesCount: 2, dispensedOn: '2026-04-16 16:07', pharmacist: 'P. Yadav', totalValue: 640, status: 'Partial' },
  { id: 'DSP-204513', patient: 'Omkar Patil', doctor: 'Dr. M. Khan', medicinesCount: 3, dispensedOn: '2026-04-16 14:45', pharmacist: 'R. Patil', totalValue: 980, status: 'Dispensed' },
  { id: 'DSP-204514', patient: 'Farah Ali', doctor: 'Dr. S. Kulkarni', medicinesCount: 3, dispensedOn: '2026-04-16 12:16', pharmacist: 'A. Naik', totalValue: 1350, status: 'Dispensed' },
  { id: 'DSP-204515', patient: 'Rohit Kale', doctor: 'Dr. P. Sethi', medicinesCount: 1, dispensedOn: '2026-04-16 11:44', pharmacist: 'R. Patil', totalValue: 240, status: 'Rejected' },
  { id: 'DSP-204516', patient: 'Alisha Bendre', doctor: 'Dr. A. Sawant', medicinesCount: 4, dispensedOn: '2026-04-15 17:58', pharmacist: 'P. Yadav', totalValue: 2060, status: 'Dispensed' },
  { id: 'DSP-204517', patient: 'Nitin Sood', doctor: 'Dr. Kavya Menon', medicinesCount: 3, dispensedOn: '2026-04-15 16:34', pharmacist: 'A. Naik', totalValue: 1210, status: 'Partial' },
  { id: 'DSP-204518', patient: 'Riya Trivedi', doctor: 'Dr. Sneha Rao', medicinesCount: 2, dispensedOn: '2026-04-15 15:13', pharmacist: 'R. Patil', totalValue: 880, status: 'Dispensed' },
  { id: 'DSP-204519', patient: 'Aarav Nair', doctor: 'Dr. Nikhil Batra', medicinesCount: 5, dispensedOn: '2026-04-15 14:11', pharmacist: 'P. Yadav', totalValue: 2920, status: 'Dispensed' },
  { id: 'DSP-204520', patient: 'Sonal Patwardhan', doctor: 'Dr. R. Sharma', medicinesCount: 3, dispensedOn: '2026-04-15 11:02', pharmacist: 'R. Patil', totalValue: 1140, status: 'Rejected' },
];

const statusStyles = {
  Dispensed: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.32)' },
  Partial: { bg: 'rgba(245,158,11,0.14)', text: '#b45309', border: 'rgba(245,158,11,0.32)' },
  Rejected: { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', border: 'rgba(239,68,68,0.32)' },
};

const detailForRow = (row) => ({
  prescriptionId: `RX${row.id.slice(-6)}`,
  signatureStatus: row.status === 'Rejected' ? 'Failed signature validation' : 'Doctor digital signature verified',
  patientConfirmation: row.status === 'Rejected' ? 'Not collected' : 'Collected via OTP confirmation',
  medicines: [
    { name: 'Paracetamol 650mg', qty: 10, batch: 'PCM-650-A21' },
    { name: 'Pantoprazole 40mg', qty: 5, batch: 'PNT-40-B04' },
    { name: 'Vitamin B12', qty: 2, batch: 'VB12-22Q8' },
  ].slice(0, row.medicinesCount),
});

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

const columns = [
  { key: 'id', label: 'Dispense ID' },
  { key: 'patient', label: 'Patient' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'medicinesCount', label: 'Medicines (count)' },
  { key: 'dispensedOn', label: 'Dispensed On' },
  { key: 'pharmacist', label: 'Pharmacist' },
  { key: 'totalValue', label: 'Total Value' },
  { key: 'status', label: 'Status' },
];

const DispenseHistory = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'dispensedOn', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return historyRows.filter((row) => {
      const matchSearch =
        !searchValue ||
        row.patient.toLowerCase().includes(searchValue) ||
        row.doctor.toLowerCase().includes(searchValue) ||
        row.id.toLowerCase().includes(searchValue);

      const matchStatus = status === 'All' || row.status === status;

      const rowDate = row.dispensedOn.split(' ')[0];
      const matchFrom = !fromDate || rowDate >= fromDate;
      const matchTo = !toDate || rowDate <= toDate;

      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [search, status, fromDate, toDate]);

  const sortedRows = useMemo(() => sortRows(filteredRows, sortConfig), [filteredRows, sortConfig]);

  const pageCount = computePageCount(sortedRows.length, 10);

  const pagedRows = useMemo(() => paginateRows(sortedRows, page, 10), [sortedRows, page]);

  const summaryStats = {
    totalDispensed: 1240,
    thisMonth: 348,
    partialDispenses: 12,
  };

  const handleSort = (key) => {
    setPage(1);
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const exportCsv = () => {
    const headers = ['Dispense ID', 'Patient', 'Doctor', 'Medicines Count', 'Dispensed On', 'Pharmacist', 'Total Value', 'Status'];
    const rows = sortedRows.map((row) => [
      row.id,
      row.patient,
      row.doctor,
      row.medicinesCount,
      row.dispensedOn,
      row.pharmacist,
      row.totalValue,
      row.status,
    ]);

    const csv = [headers.join(','), ...rows.map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dispense-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PharmacyDashboardLayout pageTitle="Dispense History">
      <Helmet>
        <title>Dispense History | VitalCode Pharmacy</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Dispense History</h2>

        <section className="rounded-2xl p-4" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div>
              <label style={{ color: '#64748b', fontSize: '0.73rem', fontWeight: 700 }}>Date Range</label>
              <div className="flex items-center gap-2 mt-1.5">
                <input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} className="w-full rounded-xl px-2.5 py-2" style={{ border: '1px solid #cbd5e1', fontSize: '0.78rem' }} />
                <input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1); }} className="w-full rounded-xl px-2.5 py-2" style={{ border: '1px solid #cbd5e1', fontSize: '0.78rem' }} />
              </div>
            </div>

            <div>
              <label style={{ color: '#64748b', fontSize: '0.73rem', fontWeight: 700 }}>Search by Patient/Doctor/Medicine</label>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by patient, doctor, dispense ID"
                className="w-full mt-1.5 rounded-xl px-3 py-2"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ color: '#64748b', fontSize: '0.73rem', fontWeight: 700 }}>Status</label>
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full mt-1.5 rounded-xl px-3 py-2"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              >
                <option value="All">All</option>
                <option value="Dispensed">Dispensed</option>
                <option value="Partial">Partial</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end lg:justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ border: '1px solid #14b8a6', color: '#0f766e', fontWeight: 700, fontSize: '0.8rem' }}
                onClick={exportCsv}
              >
                <Download style={{ width: 15, height: 15 }} />
                Export CSV
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            `Total Dispensed: ${summaryStats.totalDispensed.toLocaleString('en-IN')}`,
            `This Month: ${summaryStats.thisMonth.toLocaleString('en-IN')}`,
            `Partial Dispenses: ${summaryStats.partialDispenses}`,
          ].map((item) => (
            <div key={item} className="px-4 py-3 rounded-xl" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
              <p style={{ color: '#0f766e', fontSize: '0.82rem', fontWeight: 800 }}>{item}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf5' }}>
                  {columns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        {col.label}
                        {sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </button>
                    </th>
                  ))}
                  <th className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center" style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
                      No records found for selected filters.
                    </td>
                  </tr>
                )}

                {pagedRows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.79rem', fontWeight: 700 }}>{row.id}</td>
                    <td className="px-4 py-3" style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 600 }}>{row.patient}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.doctor}</td>
                    <td className="px-4 py-3" style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 600 }}>{row.medicinesCount}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.dispensedOn}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.pharmacist}</td>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700 }}>{formatCurrency(row.totalValue)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full" style={{ fontSize: '0.69rem', fontWeight: 700, color: statusStyles[row.status].text, background: statusStyles[row.status].bg, border: `1px solid ${statusStyles[row.status].border}` }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                        style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.72rem', fontWeight: 700 }}
                        onClick={() => setSelectedRow(row)}
                      >
                        <Eye style={{ width: 13, height: 13 }} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderTop: '1px solid #eef2f7' }}>
            <p style={{ color: '#64748b', fontSize: '0.77rem', fontWeight: 600 }}>
              Showing {pagedRows.length} of {sortedRows.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 700, color: '#334155', opacity: page <= 1 ? 0.5 : 1 }}
              >
                Prev
              </button>
              <span style={{ color: '#0f172a', fontSize: '0.75rem', fontWeight: 700 }}>
                {page} / {pageCount}
              </span>
              <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                className="px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.75rem', fontWeight: 700, color: '#334155', opacity: page >= pageCount ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedRow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #dbeafe', boxShadow: '0 24px 50px rgba(15,23,42,0.25)' }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <h3 style={{ color: '#0f172a', fontSize: '0.94rem', fontWeight: 800 }}>Dispense Details - {selectedRow.id}</h3>
                <button type="button" onClick={() => setSelectedRow(null)}>
                  <X style={{ width: 18, height: 18, color: '#64748b' }} />
                </button>
              </div>

              {(() => {
                const details = detailForRow(selectedRow);
                return (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Patient</p>
                        <p style={{ color: '#0f172a', fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>{selectedRow.patient}</p>
                        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: 3 }}>Prescription ID: {details.prescriptionId}</p>
                      </div>
                      <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Doctor</p>
                        <p style={{ color: '#0f172a', fontSize: '0.82rem', fontWeight: 700, marginTop: 4 }}>{selectedRow.doctor}</p>
                        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: 3 }}>{details.signatureStatus}</p>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                      <div className="grid grid-cols-3 px-3 py-2" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Medicine</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Qty</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Batch Number</p>
                      </div>
                      {details.medicines.map((item) => (
                        <div key={item.batch} className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <p style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 600 }}>{item.name}</p>
                          <p style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 600 }}>{item.qty}</p>
                          <p style={{ color: '#475569', fontSize: '0.78rem' }}>{item.batch}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-3" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                      <p style={{ color: '#115e59', fontSize: '0.78rem', fontWeight: 700 }}>Patient confirmation: {details.patientConfirmation}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
                        style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.76rem', fontWeight: 700 }}
                        onClick={() => window.print()}
                      >
                        <Printer style={{ width: 14, height: 14 }} />
                        Printable receipt
                      </button>
                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-xl"
                        style={{ background: '#0f766e', color: '#fff', fontSize: '0.76rem', fontWeight: 700 }}
                        onClick={() => setSelectedRow(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PharmacyDashboardLayout>
  );
};

export default DispenseHistory;
