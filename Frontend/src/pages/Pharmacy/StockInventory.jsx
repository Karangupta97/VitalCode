import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PharmacyDashboardLayout from '../../components/Pharmacy/PharmacyDashboardLayout';
import { computePageCount, paginateRows, sortRows } from './tableUtils';

const inventoryRows = [
  { id: 1, medicineName: 'Paracetamol 650mg', category: 'Pain Relief', currentStock: 220, reorderLevel: 80, unitPrice: 24, expiryDate: '2027-03-14', status: 'In Stock' },
  { id: 2, medicineName: 'Metformin 500mg', category: 'Diabetes', currentStock: 14, reorderLevel: 30, unitPrice: 46, expiryDate: '2026-11-05', status: 'Low Stock' },
  { id: 3, medicineName: 'Insulin Glargine', category: 'Diabetes', currentStock: 0, reorderLevel: 15, unitPrice: 612, expiryDate: '2026-08-09', status: 'Out of Stock' },
  { id: 4, medicineName: 'Azithromycin 500mg', category: 'Antibiotic', currentStock: 78, reorderLevel: 32, unitPrice: 88, expiryDate: '2026-05-06', status: 'Expiring Soon' },
  { id: 5, medicineName: 'Atorvastatin 10mg', category: 'Cardiac', currentStock: 48, reorderLevel: 25, unitPrice: 62, expiryDate: '2027-01-12', status: 'In Stock' },
  { id: 6, medicineName: 'Pantoprazole 40mg', category: 'Gastro', currentStock: 96, reorderLevel: 35, unitPrice: 38, expiryDate: '2027-04-10', status: 'In Stock' },
  { id: 7, medicineName: 'Vitamin B12 Injection', category: 'Supplements', currentStock: 9, reorderLevel: 20, unitPrice: 118, expiryDate: '2026-10-17', status: 'Low Stock' },
  { id: 8, medicineName: 'Amoxicillin 250mg', category: 'Antibiotic', currentStock: 134, reorderLevel: 45, unitPrice: 54, expiryDate: '2027-02-08', status: 'In Stock' },
  { id: 9, medicineName: 'Telmisartan 40mg', category: 'Cardiac', currentStock: 67, reorderLevel: 28, unitPrice: 72, expiryDate: '2027-05-09', status: 'In Stock' },
  { id: 10, medicineName: 'Dolo 650', category: 'Pain Relief', currentStock: 186, reorderLevel: 70, unitPrice: 28, expiryDate: '2027-07-15', status: 'In Stock' },
  { id: 11, medicineName: 'Clopidogrel 75mg', category: 'Cardiac', currentStock: 38, reorderLevel: 20, unitPrice: 95, expiryDate: '2027-04-20', status: 'In Stock' },
  { id: 12, medicineName: 'Aspirin EC 75mg', category: 'Cardiac', currentStock: 25, reorderLevel: 24, unitPrice: 49, expiryDate: '2026-06-28', status: 'Expiring Soon' },
  { id: 13, medicineName: 'Levocetirizine 5mg', category: 'Allergy', currentStock: 74, reorderLevel: 30, unitPrice: 26, expiryDate: '2027-01-30', status: 'In Stock' },
  { id: 14, medicineName: 'Salbutamol Inhaler', category: 'Respiratory', currentStock: 6, reorderLevel: 18, unitPrice: 180, expiryDate: '2026-09-01', status: 'Low Stock' },
  { id: 15, medicineName: 'Cefixime 200mg', category: 'Antibiotic', currentStock: 52, reorderLevel: 25, unitPrice: 105, expiryDate: '2026-05-24', status: 'Expiring Soon' },
];

const analyticsData = [
  { day: 'Day 1', sold: 72, restocked: 90, expired: 4 },
  { day: 'Day 5', sold: 85, restocked: 78, expired: 5 },
  { day: 'Day 10', sold: 98, restocked: 102, expired: 6 },
  { day: 'Day 15', sold: 106, restocked: 96, expired: 8 },
  { day: 'Day 20', sold: 121, restocked: 108, expired: 7 },
  { day: 'Day 25', sold: 132, restocked: 115, expired: 9 },
  { day: 'Day 30', sold: 140, restocked: 124, expired: 10 },
];

const filters = ['All', 'Low Stock', 'Out of Stock', 'Expiring Soon'];

const statusStyle = {
  'In Stock': { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: 'rgba(16,185,129,0.35)' },
  'Low Stock': { bg: 'rgba(245,158,11,0.14)', text: '#b45309', border: 'rgba(245,158,11,0.35)' },
  'Out of Stock': { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', border: 'rgba(239,68,68,0.35)' },
  'Expiring Soon': { bg: 'rgba(251,146,60,0.15)', text: '#c2410c', border: 'rgba(251,146,60,0.34)' },
};

const columns = [
  { key: 'medicineName', label: 'Medicine Name' },
  { key: 'category', label: 'Category' },
  { key: 'currentStock', label: 'Current Stock' },
  { key: 'reorderLevel', label: 'Reorder Level' },
  { key: 'unitPrice', label: 'Unit Price' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'status', label: 'Status' },
];

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

const StockInventory = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'medicineName', direction: 'asc' });
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    return inventoryRows.filter((row) => {
      const matchSearch =
        !value ||
        row.medicineName.toLowerCase().includes(value) ||
        row.category.toLowerCase().includes(value);

      const matchFilter = activeFilter === 'All' || row.status === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter]);

  const sortedRows = useMemo(() => sortRows(filteredRows, sortConfig), [filteredRows, sortConfig]);
  const pageCount = computePageCount(sortedRows.length, 10);
  const pagedRows = useMemo(() => paginateRows(sortedRows, page, 10), [sortedRows, page]);

  const handleSort = (key) => {
    setPage(1);
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <PharmacyDashboardLayout pageTitle="Stock & Inventory">
      <Helmet>
        <title>Stock & Inventory | VitalCode Pharmacy</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>Stock & Inventory</h2>

        <section className="rounded-2xl p-4 space-y-4" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 15, height: 15, color: '#94a3b8' }} />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search medicines"
                className="w-full rounded-xl pl-9 pr-3 py-2.5"
                style={{ border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#0f766e', color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>
              <Plus style={{ width: 15, height: 15 }} />
              Add Medicine
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: isActive ? '#0f766e' : '#f8fafc',
                    color: isActive ? '#fff' : '#475569',
                    border: isActive ? '1px solid #0f766e' : '1px solid #e2e8f0',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf5' }}>
                  {columns.map((column) => (
                    <th key={column.key} className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
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
                  <th className="text-left px-4 py-3" style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {pagedRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center" style={{ color: '#94a3b8', fontSize: '0.84rem', fontWeight: 600 }}>
                      No inventory rows available.
                    </td>
                  </tr>
                )}

                {pagedRows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700 }}>{row.medicineName}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.category}</td>
                    <td className="px-4 py-3" style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700 }}>{row.currentStock}</td>
                    <td className="px-4 py-3" style={{ color: '#334155', fontSize: '0.78rem', fontWeight: 700 }}>{row.reorderLevel}</td>
                    <td className="px-4 py-3" style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700 }}>{formatCurrency(row.unitPrice)}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.78rem' }}>{row.expiryDate}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-full" style={{ fontSize: '0.68rem', fontWeight: 700, color: statusStyle[row.status].text, background: statusStyle[row.status].bg, border: `1px solid ${statusStyle[row.status].border}` }}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid #14b8a6', color: '#0f766e', fontSize: '0.71rem', fontWeight: 700 }}>
                          Edit
                        </button>
                        <button className="px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid #0ea5e9', color: '#0369a1', fontSize: '0.71rem', fontWeight: 700 }}>
                          Restock
                        </button>
                        <button className="px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid #ef4444', color: '#dc2626', fontSize: '0.71rem', fontWeight: 700 }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderTop: '1px solid #eef2f7' }}>
            <p style={{ color: '#64748b', fontSize: '0.77rem', fontWeight: 600 }}>
              Showing {pagedRows.length} of {sortedRows.length} medicines
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl p-4 sm:p-5"
          style={{ background: '#fff', border: '1.5px solid #e8edf5', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}
        >
          <h3 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>Stock Movement - Last 30 Days</h3>
          <div style={{ width: '100%', height: 300, marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sold" stroke="#0f766e" strokeWidth={2.6} dot={{ r: 3 }} name="Sold" />
                <Line type="monotone" dataKey="restocked" stroke="#3b82f6" strokeWidth={2.4} dot={{ r: 3 }} name="Restocked" />
                <Line type="monotone" dataKey="expired" stroke="#ef4444" strokeWidth={2.4} dot={{ r: 3 }} name="Expired" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>
    </PharmacyDashboardLayout>
  );
};

export default StockInventory;
