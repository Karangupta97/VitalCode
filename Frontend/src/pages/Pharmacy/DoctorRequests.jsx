import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { computePageCount, paginateRows, sortRows } from './tableUtils';
import { usePharmacyStore } from '../../store/pharmacyStore';

const initialRequests = [
  {
    requestId: 'REQ-8101',
    doctorClinic: 'Dr. Kavya Menon - Sunrise Clinic',
    medicine: 'Metformin 500mg',
    qtyRequested: 40,
    priority: 'Urgent',
    requestedOn: '2026-04-18 09:20',
    status: 'Pending',
    doctorName: 'Dr. Kavya Menon',
    clinicName: 'Sunrise Clinic',
    items: [
      { medicine: 'Metformin 500mg', qty: 40, currentStock: 14 },
      { medicine: 'Pantoprazole 40mg', qty: 20, currentStock: 96 },
    ],
  },
  {
    requestId: 'REQ-8102',
    doctorClinic: 'Dr. Nikhil Batra - Healwell Polyclinic',
    medicine: 'Insulin Glargine',
    qtyRequested: 12,
    priority: 'Urgent',
    requestedOn: '2026-04-18 10:06',
    status: 'Pending',
    doctorName: 'Dr. Nikhil Batra',
    clinicName: 'Healwell Polyclinic',
    items: [{ medicine: 'Insulin Glargine', qty: 12, currentStock: 0 }],
  },
  {
    requestId: 'REQ-8103',
    doctorClinic: 'Dr. Sneha Rao - CityCare Clinic',
    medicine: 'Paracetamol 650mg',
    qtyRequested: 120,
    priority: 'Normal',
    requestedOn: '2026-04-18 10:44',
    status: 'Accepted',
    doctorName: 'Dr. Sneha Rao',
    clinicName: 'CityCare Clinic',
    items: [{ medicine: 'Paracetamol 650mg', qty: 120, currentStock: 220 }],
  },
  {
    requestId: 'REQ-8104',
    doctorClinic: 'Dr. R. Sharma - MedPoint',
    medicine: 'Cefixime 200mg',
    qtyRequested: 35,
    priority: 'Normal',
    requestedOn: '2026-04-18 11:03',
    status: 'Dispatched',
    doctorName: 'Dr. R. Sharma',
    clinicName: 'MedPoint',
    items: [{ medicine: 'Cefixime 200mg', qty: 35, currentStock: 52 }],
  },
  {
    requestId: 'REQ-8105',
    doctorClinic: 'Dr. P. Sethi - Aster Clinic',
    medicine: 'Vitamin B12 Injection',
    qtyRequested: 18,
    priority: 'Normal',
    requestedOn: '2026-04-17 16:22',
    status: 'Fulfilled',
    doctorName: 'Dr. P. Sethi',
    clinicName: 'Aster Clinic',
    items: [{ medicine: 'Vitamin B12 Injection', qty: 18, currentStock: 9 }],
  },
  {
    requestId: 'REQ-8106',
    doctorClinic: 'Dr. S. Kulkarni - Apex Family Care',
    medicine: 'Amoxicillin 250mg',
    qtyRequested: 42,
    priority: 'Normal',
    requestedOn: '2026-04-17 14:40',
    status: 'Declined',
    doctorName: 'Dr. S. Kulkarni',
    clinicName: 'Apex Family Care',
    items: [{ medicine: 'Amoxicillin 250mg', qty: 42, currentStock: 134 }],
  },
  {
    requestId: 'REQ-8107',
    doctorClinic: 'Dr. Akash Verma - OneHealth',
    medicine: 'Salbutamol Inhaler',
    qtyRequested: 15,
    priority: 'Urgent',
    requestedOn: '2026-04-17 12:14',
    status: 'Pending',
    doctorName: 'Dr. Akash Verma',
    clinicName: 'OneHealth',
    items: [{ medicine: 'Salbutamol Inhaler', qty: 15, currentStock: 6 }],
  },
  {
    requestId: 'REQ-8108',
    doctorClinic: 'Dr. Alisha Nair - Metro Clinic',
    medicine: 'Atorvastatin 10mg',
    qtyRequested: 50,
    priority: 'Normal',
    requestedOn: '2026-04-17 11:35',
    status: 'Accepted',
    doctorName: 'Dr. Alisha Nair',
    clinicName: 'Metro Clinic',
    items: [{ medicine: 'Atorvastatin 10mg', qty: 50, currentStock: 48 }],
  },
  {
    requestId: 'REQ-8109',
    doctorClinic: 'Dr. Riya Shah - CurePoint',
    medicine: 'Azithromycin 500mg',
    qtyRequested: 20,
    priority: 'Urgent',
    requestedOn: '2026-04-17 10:48',
    status: 'Pending',
    doctorName: 'Dr. Riya Shah',
    clinicName: 'CurePoint',
    items: [{ medicine: 'Azithromycin 500mg', qty: 20, currentStock: 78 }],
  },
  {
    requestId: 'REQ-8110',
    doctorClinic: 'Dr. Vivek Rao - PrimeMed',
    medicine: 'Dolo 650',
    qtyRequested: 95,
    priority: 'Normal',
    requestedOn: '2026-04-17 09:57',
    status: 'Dispatched',
    doctorName: 'Dr. Vivek Rao',
    clinicName: 'PrimeMed',
    items: [{ medicine: 'Dolo 650', qty: 95, currentStock: 186 }],
  },
  {
    requestId: 'REQ-8111',
    doctorClinic: 'Dr. Priya Kapur - NewAge Clinic',
    medicine: 'Telmisartan 40mg',
    qtyRequested: 28,
    priority: 'Normal',
    requestedOn: '2026-04-16 18:11',
    status: 'Fulfilled',
    doctorName: 'Dr. Priya Kapur',
    clinicName: 'NewAge Clinic',
    items: [{ medicine: 'Telmisartan 40mg', qty: 28, currentStock: 67 }],
  },
];

const priorityStyle = {
  Urgent: { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', border: 'rgba(239,68,68,0.35)' },
  Normal: { bg: 'rgba(20,184,166,0.14)', text: '#0f766e', border: 'rgba(20,184,166,0.3)' },
};

const statusStyle = {
  Pending: { bg: 'rgba(245,158,11,0.14)', text: '#b45309', border: 'rgba(245,158,11,0.32)' },
  Accepted: { bg: 'rgba(20,184,166,0.14)', text: '#0f766e', border: 'rgba(20,184,166,0.3)' },
  Dispatched: { bg: 'rgba(59,130,246,0.13)', text: '#1d4ed8', border: 'rgba(59,130,246,0.3)' },
  Fulfilled: { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.32)' },
  Declined: { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', border: 'rgba(239,68,68,0.32)' },
};

const columns = [
  { key: 'requestId', label: 'Request ID' },
  { key: 'doctorClinic', label: 'Doctor / Clinic' },
  { key: 'medicine', label: 'Medicine' },
  { key: 'qtyRequested', label: 'Qty Requested' },
  { key: 'priority', label: 'Priority' },
  { key: 'requestedOn', label: 'Requested On' },
  { key: 'status', label: 'Status' },
];

const DoctorRequests = () => {
  const { pushDoctorRequestNotification } = usePharmacyStore();
  const [requests, setRequests] = useState(initialRequests);
  const [sortConfig, setSortConfig] = useState({ key: 'requestedOn', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [estimatedDate, setEstimatedDate] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [acceptPartial, setAcceptPartial] = useState(false);

  const sortedRows = useMemo(() => sortRows(requests, sortConfig), [requests, sortConfig]);
  const pageCount = computePageCount(sortedRows.length, 10);
  const pagedRows = useMemo(() => paginateRows(sortedRows, page, 10), [sortedRows, page]);

  const summary = useMemo(() => {
    const pending = requests.filter((row) => row.status === 'Pending').length;
    const acceptedToday = requests.filter((row) => row.status === 'Accepted').length;
    const fulfilled = 128;
    return { pending, acceptedToday, fulfilled };
  }, [requests]);

  const handleSort = (key) => {
    setPage(1);
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const updateStatus = (requestId, status) => {
    setRequests((prev) => prev.map((row) => (row.requestId === requestId ? { ...row, status } : row)));
  };

  const openAcceptModal = (row) => {
    setSelectedRequest(row);
    setEstimatedDate('');
    setDeliveryNotes('');
    setAcceptPartial(false);
  };

  const closeAcceptModal = () => {
    setSelectedRequest(null);
    setEstimatedDate('');
    setDeliveryNotes('');
    setAcceptPartial(false);
  };

  const confirmAccept = () => {
    if (!selectedRequest) return;

    updateStatus(selectedRequest.requestId, 'Accepted');
    pushDoctorRequestNotification(selectedRequest.requestId, selectedRequest.doctorName);
    closeAcceptModal();
  };

  return (
    <PharmacyDashboardLayout pageTitle="Doctor Stock Requests">
      <Helmet>
        <title>Doctor Stock Requests | VitalCode Pharmacy</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Doctor Stock Requests</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 6 }}>
            Clinics and doctors can request medicines directly from your pharmacy.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            `Pending: ${summary.pending}`,
            `Accepted Today: ${summary.acceptedToday}`,
            `Fulfilled: ${summary.fulfilled}`,
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
                  {columns.map((column) => (
                    <th key={column.key} className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800 }}
                      >
                        {column.label}
                        {sortConfig.key === column.key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                      </button>
                    </th>
                  ))}
                  <th className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagedRows.map((row) => (
                  <tr key={row.requestId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700 }}>{row.requestId}</td>
                    <td className="px-4 py-3" style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 600 }}>{row.doctorClinic}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.medicine}</td>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700 }}>{row.qtyRequested}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full" style={{ fontSize: '0.68rem', fontWeight: 700, color: priorityStyle[row.priority].text, background: priorityStyle[row.priority].bg, border: `1px solid ${priorityStyle[row.priority].border}` }}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.requestedOn}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full" style={{ fontSize: '0.68rem', fontWeight: 700, color: statusStyle[row.status].text, background: statusStyle[row.status].bg, border: `1px solid ${statusStyle[row.status].border}` }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {row.status === 'Pending' && (
                          <>
                            <button
                              className="px-2.5 py-1.5 rounded-lg"
                              style={{ background: '#0f766e', color: '#fff', fontSize: '0.71rem', fontWeight: 700 }}
                              onClick={() => openAcceptModal(row)}
                            >
                              Accept
                            </button>
                            <button
                              className="px-2.5 py-1.5 rounded-lg"
                              style={{ border: '1px solid #ef4444', color: '#dc2626', fontSize: '0.71rem', fontWeight: 700 }}
                              onClick={() => updateStatus(row.requestId, 'Declined')}
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {row.status === 'Accepted' && (
                          <button
                            className="px-2.5 py-1.5 rounded-lg"
                            style={{ border: '1px solid #3b82f6', color: '#1d4ed8', fontSize: '0.71rem', fontWeight: 700 }}
                            onClick={() => updateStatus(row.requestId, 'Dispatched')}
                          >
                            Mark Dispatched
                          </button>
                        )}

                        {row.status === 'Dispatched' && (
                          <button
                            className="px-2.5 py-1.5 rounded-lg"
                            style={{ border: '1px solid #10b981', color: '#047857', fontSize: '0.71rem', fontWeight: 700 }}
                            onClick={() => updateStatus(row.requestId, 'Fulfilled')}
                          >
                            Mark Fulfilled
                          </button>
                        )}

                        {['Fulfilled', 'Declined'].includes(row.status) && (
                          <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700 }}>-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderTop: '1px solid #eef2f7' }}>
            <p style={{ color: '#64748b', fontSize: '0.77rem', fontWeight: 600 }}>
              Showing {pagedRows.length} of {sortedRows.length} requests
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
        {selectedRequest && (
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
                <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 800 }}>Accept Request - {selectedRequest.requestId}</h3>
                <button type="button" onClick={closeAcceptModal}>
                  <X style={{ width: 18, height: 18, color: '#64748b' }} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Doctor</p>
                    <p style={{ color: '#0f172a', fontSize: '0.84rem', fontWeight: 700, marginTop: 4 }}>{selectedRequest.doctorName}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Clinic</p>
                    <p style={{ color: '#0f172a', fontSize: '0.84rem', fontWeight: 700, marginTop: 4 }}>{selectedRequest.clinicName}</p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                  <div className="grid grid-cols-3 px-3 py-2" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Medicine</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Qty Requested</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>Current Stock</p>
                  </div>

                  {selectedRequest.items.map((item) => (
                    <div key={item.medicine} className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ color: '#0f172a', fontSize: '0.79rem', fontWeight: 600 }}>{item.medicine}</p>
                      <p style={{ color: '#334155', fontSize: '0.79rem', fontWeight: 700 }}>{item.qty}</p>
                      <p style={{ color: item.currentStock === 0 ? '#dc2626' : '#0f172a', fontSize: '0.79rem', fontWeight: 700 }}>{item.currentStock}</p>
                    </div>
                  ))}
                </div>

                {selectedRequest.items.some((item) => item.currentStock < item.qty) && (
                  <div className="rounded-xl p-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle style={{ width: 16, height: 16, color: '#b45309', marginTop: 2 }} />
                      <div>
                        <p style={{ color: '#92400e', fontSize: '0.78rem', fontWeight: 700 }}>
                          {selectedRequest.items.find((item) => item.currentStock < item.qty)?.medicine} is out of stock. Accept partial order?
                        </p>
                        <label className="inline-flex items-center gap-2 mt-2">
                          <input type="checkbox" checked={acceptPartial} onChange={(event) => setAcceptPartial(event.target.checked)} style={{ accentColor: '#0f766e' }} />
                          <span style={{ color: '#78350f', fontSize: '0.76rem', fontWeight: 600 }}>Accept partial order</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Estimated Delivery Date</label>
                    <input
                      type="date"
                      value={estimatedDate}
                      onChange={(event) => setEstimatedDate(event.target.value)}
                      className="w-full mt-1.5 rounded-xl px-3 py-2"
                      style={{ border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>Delivery Notes</label>
                    <input
                      value={deliveryNotes}
                      onChange={(event) => setDeliveryNotes(event.target.value)}
                      placeholder="Notes for doctor"
                      className="w-full mt-1.5 rounded-xl px-3 py-2"
                      style={{ border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeAcceptModal}
                    className="px-3.5 py-2 rounded-xl"
                    style={{ border: '1px solid #cbd5e1', color: '#334155', fontSize: '0.76rem', fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmAccept}
                    className="px-3.5 py-2 rounded-xl"
                    style={{ background: '#0f766e', color: '#fff', fontSize: '0.76rem', fontWeight: 700 }}
                  >
                    Accept & Notify Doctor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PharmacyDashboardLayout>
  );
};

export default DoctorRequests;
