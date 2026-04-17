import React, { useEffect, useRef, useState } from 'react'
import {
  LuBadgeCheck,
  LuBell,
  LuFingerprint,
  LuLayoutDashboard,
  LuLogOut,
  LuPill,
  LuSettings,
  LuShieldCheck,
  LuSiren,
  LuStore,
} from 'react-icons/lu'

const doctorDashboardStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Poppins:wght@500;600;700&display=swap');

:root {
  --doctor-font-body: 'Inter', 'Helvetica Now Text', 'Helvetica Neue', Arial, sans-serif;
  --doctor-font-heading: 'Montserrat', 'Helvetica Now Display', 'Poppins', sans-serif;
  --doctor-font-nav: 'Poppins', 'Inter', sans-serif;
  --doctor-font-accent: 'Gilroy', 'Poppins', 'Inter', sans-serif;
}

.doctor-dashboard-container,
.doctor-dashboard-container * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.doctor-dashboard-container {
  display: flex;
  height: 100vh;
  background:
    radial-gradient(circle at 12% 12%, rgba(56, 189, 248, 0.26), transparent 34%),
    radial-gradient(circle at 85% 20%, rgba(45, 212, 191, 0.24), transparent 28%),
    linear-gradient(135deg, #dceff2, #e8ecf6, #eef6f3);
  font-family: var(--doctor-font-body);
  color: #042f2e;
}

.doctor-dashboard-container h1,
.doctor-dashboard-container h2,
.doctor-dashboard-container h3,
.doctor-dashboard-container h4,
.doctor-dashboard-container th {
  font-family: var(--doctor-font-heading);
}

.doctor-dashboard-container p,
.doctor-dashboard-container td,
.doctor-dashboard-container label,
.doctor-dashboard-container input,
.doctor-dashboard-container small,
.doctor-dashboard-container span {
  font-family: var(--doctor-font-body);
}

/* ===== SIDEBAR ===== */
.doctor-sidebar {
  width: 280px;
  background: rgba(250, 255, 255, 0.62);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.65);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  overflow-y: auto;
  box-shadow: 0 14px 28px rgba(15, 118, 110, 0.08);
}

.sidebar-header {
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  color: #0f766e;
  font-weight: 700;
  font-family: 'Helvetica Now Display', 'Montserrat', 'Inter', sans-serif;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  padding: 0 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #115e59;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.nav-item:hover {
  background: rgba(20, 184, 166, 0.15);
  color: #0f766e;
}

.nav-item.active {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: white;
}

.nav-icon {
  font-size: 1.2rem;
  min-width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(20, 184, 166, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logout-btn {
  color: #dc2626 !important;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.15) !important;
  color: #b91c1c !important;
}

.logout-btn.active {
  background: #dc2626 !important;
  color: white !important;
}

/* Scrollbar styling */
.doctor-sidebar::-webkit-scrollbar {
  width: 6px;
}

.doctor-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.doctor-sidebar::-webkit-scrollbar-thumb {
  background: rgba(15, 118, 110, 0.3);
  border-radius: 3px;
}

.doctor-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 118, 110, 0.5);
}

/* ===== MAIN CONTENT ===== */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  box-shadow: 0 14px 30px rgba(15, 118, 110, 0.12);
  margin: 1rem 1.25rem 0;
  padding: 0.95rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left h1 {
  font-size: 2.2rem;
  color: #042f2e;
  margin: 0;
  line-height: 1.05;
}

.header-left p {
  color: #115e59;
  font-size: 0.78rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.search-input {
  padding: 0.62rem 0.88rem;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  font-size: 0.86rem;
  width: 400px;
  transition: all 0.3s ease;
  font-family: var(--doctor-font-body);
}

.notification-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(17, 94, 89, 0.2);
  background: rgba(255, 255, 255, 0.72);
  color: #0f766e;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.notification-btn svg {
  width: 1.05rem;
  height: 1.05rem;
}

.notification-btn:hover {
  background: rgba(255, 255, 255, 0.92);
  transform: translateY(-1px);
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  padding: 0 4px;
  box-shadow: 0 6px 14px rgba(239, 68, 68, 0.35);
}

.search-input:focus {
  outline: none;
  border-color: #0f766e;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.add-new-btn {
  padding: 0.62rem 1.05rem;
  background: #0f766e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  line-height: 1;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-new-btn:hover {
  background: #115e59;
  transform: translateY(-2px);
}

.user-avatar-header {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399, #14b8a6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.profile-menu {
  position: relative;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 290px;
  z-index: 30;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 18px 30px rgba(15, 118, 110, 0.15);
  padding: 0.9rem;
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.7rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgba(15, 118, 110, 0.15);
}

.profile-avatar-lg {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399, #14b8a6);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.profile-top h4 {
  margin: 0;
  font-size: 0.95rem;
  color: #042f2e;
}

.profile-top p {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: #115e59;
}

.profile-meta {
  margin-bottom: 0.8rem;
}

.profile-meta p {
  margin: 0.35rem 0;
  font-size: 0.82rem;
  color: #115e59;
}

.is-verified {
  color: #16a34a;
}

.is-unverified {
  color: #dc2626;
}

.profile-actions {
  display: grid;
  gap: 0.45rem;
}

.profile-action-btn {
  width: 100%;
  border: 1px solid rgba(15, 118, 110, 0.28);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.65);
  color: #0f766e;
  padding: 0.55rem 0.65rem;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-action-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

.profile-action-btn.verify {
  background: rgba(20, 184, 166, 0.15);
}

/* ===== CONTENT AREA ===== */
.dashboard-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.6rem;
  color: #042f2e;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #115e59;
  font-size: 0.95rem;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 1.15rem;
  margin-bottom: 1.5rem;
}

/* ===== BANNER ===== */
.banner {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(140deg, rgba(59, 130, 246, 0.9) 0%, rgba(15, 118, 110, 0.92) 55%, rgba(20, 184, 166, 0.88) 100%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 22px;
  padding: 1.35rem;
  color: white;
  margin-bottom: 0;
  min-height: 190px;
  overflow: hidden;
  box-shadow: 0 22px 44px rgba(14, 116, 144, 0.25);
}

.banner-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(16px);
  pointer-events: none;
}

.banner-glow-1 {
  width: 220px;
  height: 220px;
  right: -60px;
  top: -70px;
  background: rgba(255, 255, 255, 0.24);
}

.banner-glow-2 {
  width: 190px;
  height: 190px;
  left: 38%;
  bottom: -110px;
  background: rgba(125, 211, 252, 0.24);
}

.banner-text h2 {
  font-size: clamp(1.5rem, 2.5vw, 1.85rem);
  margin-bottom: 0.35rem;
  letter-spacing: -0.02em;
}

.banner-text p {
  margin-bottom: 0.75rem;
  opacity: 0.96;
  max-width: 560px;
  line-height: 1.42;
  font-size: 0.92rem;
}

.hero-kicker {
  display: inline-block;
  margin-bottom: 0.55rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.38);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.banner-btn {
  padding: 0.56rem 0.95rem;
  background: rgba(255, 255, 255, 0.92);
  color: #0f766e;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.banner-btn-secondary {
  padding: 0.56rem 0.95rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.64);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-2px);
}

.hero-metrics {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.metric-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  padding: 0.3rem 0.55rem;
}

.metric-pill-label {
  font-size: 0.72rem;
  opacity: 0.92;
}

.metric-pill-value {
  background: rgba(0, 0, 0, 0.16);
  border-radius: 999px;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--doctor-font-accent);
}

.hero-side-cards {
  display: grid;
  gap: 0.95rem;
  align-content: stretch;
}

.visual-card {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 16px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 1rem;
}

.visual-card p {
  margin: 0;
  font-size: 0.74rem;
  opacity: 0.9;
}

.visual-card h4 {
  margin: 0.15rem 0;
  font-size: 1.4rem;
  line-height: 1;
  font-family: var(--doctor-font-accent);
}

.visual-card span {
  font-size: 0.72rem;
  opacity: 0.88;
}

.visual-card-soft {
  background: rgba(255, 255, 255, 0.13);
}

.visual-card-light {
  background: linear-gradient(
    150deg,
    rgba(210, 238, 242, 0.88),
    rgba(194, 233, 229, 0.88)
  );
  border: 1px solid rgba(148, 209, 201, 0.62);
  box-shadow: 0 10px 22px rgba(14, 116, 144, 0.1);
}

.visual-card-light p,
.visual-card-light h4,
.visual-card-light span {
  color: #0d5f63;
  opacity: 1;
}

/* ===== DASHBOARD GRID ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.grid-section {
  background: rgba(236, 242, 245, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(190, 213, 219, 0.85);
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.09);
}

.grid-section h3 {
  font-size: 1.2rem;
  color: #042f2e;
  margin-bottom: 1.5rem;
}

/* Hire Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.95rem;
  margin-bottom: 1.2rem;
}

.hire-card {
  background: linear-gradient(145deg, rgba(196, 230, 235, 0.82), rgba(186, 227, 235, 0.78));
  border: 1px solid rgba(136, 201, 211, 0.65);
  border-radius: 12px;
  min-height: 165px;
  padding: 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hire-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(145deg, rgba(196, 230, 235, 0.95), rgba(186, 227, 235, 0.92));
}

.hire-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.hire-card p {
  font-weight: 600;
  color: #042f2e;
  margin-bottom: 0.25rem;
}

.hire-card small {
  color: #115e59;
}

/* Progress Table */
.progress-table {
  overflow-x: auto;
  margin-bottom: 1.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

tbody tr {
  border-bottom: 1px solid rgba(20, 184, 166, 0.15);
}

tbody tr:hover {
  background: rgba(52, 211, 153, 0.08);
}

table td {
  padding: 1.05rem 0.6rem;
  color: #115e59;
}

table td:first-child {
  font-weight: 600;
  color: #042f2e;
}

.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--doctor-font-accent);
}

.badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.badge-pending {
  background: #fef3c7;
  color: #d97706;
}

.badge-low-stock {
  background: #fee2e2;
  color: #dc2626;
}

.badge-given {
  background: #dbeafe;
  color: #2563eb;
}

.view-all-btn {
  width: 100%;
  padding: 0.78rem;
  background: #0f766e;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background: #115e59;
}

/* ===== PRESCRIPTIONS ===== */
.prescription-table {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2rem;
  overflow-x: auto;
}

.prescription-table table thead {
  background: #f0f4f3;
}

.prescription-table table thead th {
  padding: 1rem;
  text-align: left;
  color: #042f2e;
  font-weight: 600;
  border-bottom: 2px solid #e0e7e6;
}

.prescription-table table tbody td {
  padding: 1rem;
  color: #115e59;
}

.prescription-table table tbody tr:hover {
  background: #f8fffe;
}

.action-link {
  background: none;
  border: none;
  color: #0f766e;
  cursor: pointer;
  font-weight: 600;
  font-family: var(--doctor-font-nav);
  margin-right: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-link:hover {
  color: #115e59;
}

/* ===== PATIENT ACCESS ===== */
.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.access-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(20, 184, 166, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.access-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(15, 118, 110, 0.15);
}

.access-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.patient-avatar {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: linear-gradient(135deg, #34d399, #14b8a6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.patient-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #042f2e;
}

.patient-details p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #115e59;
}

.last-access {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #115e59;
}

.access-btn {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #0f766e;
  background: transparent;
  color: #0f766e;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.access-btn.granted {
  background: #dcfce7;
  border-color: #16a34a;
  color: #16a34a;
}

.access-btn:hover {
  transform: translateY(-2px);
}

/* ===== EMERGENCY ===== */
.emergency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.emergency-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 2px solid rgba(249, 115, 22, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.emergency-card.severity-high {
  border-color: rgba(244, 63, 94, 0.4);
  background: rgba(254, 242, 242, 0.9);
}

.emergency-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(249, 115, 22, 0.2);
}

.emergency-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #fef2f2;
  color: #dc2626;
  margin-bottom: 0.75rem;
}

.emergency-card.severity-medium .emergency-badge {
  background: #fffbeb;
  color: #d97706;
}

.emergency-card h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  color: #042f2e;
}

.emergency-card > p {
  margin: 0.25rem 0;
  color: #115e59;
  font-size: 0.9rem;
}

.reason {
  background: rgba(52, 211, 153, 0.1);
  padding: 0.5rem;
  border-radius: 6px;
  margin: 0.75rem 0 !important;
}

.status-text {
  margin: 1rem 0 !important;
}

.status-authorized {
  color: #16a34a;
  font-weight: 600;
}

.status-pending {
  color: #d97706;
  font-weight: 600;
}

.auth-btn {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-btn.authorize {
  border-color: #16a34a;
  background: #dcfce7;
  color: #16a34a;
}

.auth-btn.authorize:hover {
  background: #16a34a;
  color: white;
}

.auth-btn.revoke {
  border-color: #dc2626;
  background: #fee2e2;
  color: #dc2626;
}

.auth-btn.revoke:hover {
  background: #dc2626;
  color: white;
}

/* ===== PHARMACY ===== */
.pharmacy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.pharmacy-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.pharmacy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.pharmacy-card h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #042f2e;
}

.pharmacy-card p {
  margin: 0.5rem 0;
  color: #115e59;
  font-size: 0.9rem;
}

.stock-status {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
}

.stock-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-badge.available {
  background: #dcfce7;
  color: #16a34a;
}

.stock-badge.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.pharmacy-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.pharmacy-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.pharmacy-btn.primary {
  background: #3b82f6;
  color: white;
}

.pharmacy-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.pharmacy-btn.secondary {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.pharmacy-btn.secondary:hover {
  background: #3b82f6;
  color: white;
}

/* ===== SETTINGS ===== */
.settings-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 16px;
  padding: 2rem;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(20, 184, 166, 0.2);
}

.doctor-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  background: linear-gradient(135deg, #34d399, #14b8a6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.8rem;
}

.doctor-header-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #042f2e;
}

.doctor-header-info p {
  margin: 0;
  color: #115e59;
}

.settings-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #042f2e;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid rgba(15, 118, 110, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  color: #115e59;
  font-size: 0.9rem;
}

.form-input:focus {
  outline: none;
  border-color: #0f766e;
  background: white;
}

.settings-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-family: var(--doctor-font-nav);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #0f766e;
  color: white;
}

.btn-primary:hover {
  background: #115e59;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(15, 118, 110, 0.2);
  color: #0f766e;
  border: 2px solid #0f766e;
}

.btn-secondary:hover {
  background: #0f766e;
  color: white;
}

/* ===== LICENSE VERIFICATION ===== */
.license-card {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 16px;
  padding: 2rem;
}

.license-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.license-status.verified {
  background: rgba(22, 163, 74, 0.1);
  border: 2px solid #16a34a;
}

.license-status.unverified {
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid #dc2626;
}

.license-status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.license-status.verified .license-status-icon {
  background: #16a34a;
}

.license-status.unverified .license-status-icon {
  background: #dc2626;
}

.license-status-text h3 {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
  color: #042f2e;
}

.license-status-text p {
  margin: 0;
  color: #115e59;
}

.license-details {
  margin-bottom: 2rem;
}

.license-details h3 {
  font-size: 1.1rem;
  color: #042f2e;
  margin-bottom: 1.5rem;
}

.license-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: rgba(52, 211, 153, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0f766e;
}

.info-item label {
  display: block;
  font-size: 0.85rem;
  color: #115e59;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info-item p {
  margin: 0;
  font-size: 0.95rem;
  color: #042f2e;
  font-weight: 500;
}

.license-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ===== FEATURE PLACEHOLDER ===== */
.feature-placeholder {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 2px dashed rgba(20, 184, 166, 0.3);
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  color: #115e59;
  font-size: 1.1rem;
}

.sidebar-license-badge {
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid rgba(22, 163, 74, 0.38);
  background: rgba(220, 252, 231, 0.65);
  color: #15803d;
}

.sidebar-license-badge.unverified {
  border-color: rgba(220, 38, 38, 0.35);
  background: rgba(254, 226, 226, 0.7);
  color: #dc2626;
}

.warning-banner {
  margin-bottom: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(217, 119, 6, 0.32);
  background: rgba(254, 243, 199, 0.8);
  color: #92400e;
  font-size: 0.88rem;
}

.warning-banner.critical {
  border-color: rgba(220, 38, 38, 0.36);
  background: rgba(254, 226, 226, 0.82);
  color: #b91c1c;
}

.inline-tabs {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.35rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 118, 110, 0.2);
  background: rgba(255, 255, 255, 0.7);
}

.inline-tab {
  border: none;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  background: transparent;
  color: #115e59;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: 700;
  font-family: var(--doctor-font-nav);
}

.inline-tab.active {
  background: #0f766e;
  color: #fff;
}

.form-card {
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 16px;
  padding: 1.2rem;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem;
}

.form-textarea {
  width: 100%;
  min-height: 84px;
  padding: 0.75rem;
  border: 1px solid rgba(15, 118, 110, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: #115e59;
  font-size: 0.9rem;
  resize: vertical;
  font-family: var(--doctor-font-body);
}

.outline-btn {
  padding: 0.62rem 0.95rem;
  border-radius: 8px;
  border: 1px solid #0f766e;
  background: rgba(15, 118, 110, 0.08);
  color: #0f766e;
  font-weight: 700;
  cursor: pointer;
}

.biometric-card {
  border-radius: 14px;
  border: 1px solid rgba(15, 118, 110, 0.25);
  background: rgba(240, 253, 250, 0.84);
  padding: 1rem;
}

.biometric-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
}

.biometric-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(15, 118, 110, 0.16);
  color: #0f766e;
}

.biometric-note {
  margin-top: 0.45rem;
  font-size: 0.8rem;
  color: #0f766e;
}

.state-success {
  color: #16a34a;
  font-weight: 700;
}

.state-error {
  color: #dc2626;
  font-weight: 700;
}

.qr-grid {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  gap: 1px;
  width: 126px;
  background: #f0f4f3;
  padding: 4px;
  border-radius: 6px;
}

.qr-cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 1px;
}

.qr-cell.on {
  background: #042f2e;
}

.qr-cell.off {
  background: #fff;
}

.status-used {
  background: #e5e7eb;
  color: #4b5563;
}

.status-expired {
  background: #fee2e2;
  color: #dc2626;
}

.status-active {
  background: rgba(20, 184, 166, 0.2);
  color: #0f766e;
}

.row-detail {
  padding: 0.75rem 0.6rem;
  font-size: 0.84rem;
  color: #115e59;
  background: rgba(236, 242, 245, 0.9);
}

.table-disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.records-view {
  position: relative;
  overflow: hidden;
}

.records-watermark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: rgba(15, 118, 110, 0.12);
  pointer-events: none;
  transform: rotate(-14deg);
  font-weight: 800;
}

.scanner-placeholder {
  min-height: 170px;
  border-radius: 12px;
  border: 1px dashed rgba(15, 118, 110, 0.38);
  background: rgba(4, 47, 46, 0.86);
  color: #e8ecf6;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 1rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
  margin: 0.75rem 0 1rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 47, 46, 0.55);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 1rem;
}

.modal-card {
  width: min(560px, 100%);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 48px rgba(15, 118, 110, 0.2);
  padding: 1.2rem;
}

.modal-actions {
  margin-top: 0.9rem;
  display: flex;
  gap: 0.65rem;
  justify-content: flex-end;
}

.session-options {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
}

.section-stack {
  display: grid;
  gap: 1rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .hero-layout {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .header-right {
    flex-wrap: wrap;
  }

  .search-input {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .doctor-dashboard-container {
    flex-direction: column;
  }

  .doctor-sidebar {
    width: 100%;
    max-height: 60px;
    overflow-x: auto;
    overflow-y: hidden;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid rgba(20, 184, 166, 0.2);
    padding: 0.75rem;
  }

  .sidebar-header {
    margin-bottom: 0;
    padding: 0 0.75rem;
  }

  .sidebar-nav {
    flex-direction: row;
    flex: 1;
    padding: 0 0.75rem;
  }

  .sidebar-footer {
    border-top: none;
    border-left: 1px solid rgba(20, 184, 166, 0.2);
    flex-direction: row;
    padding: 0 0.75rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 0.85rem 0.85rem 0;
    padding: 0.8rem;
  }

  .header-right {
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-input {
    width: 100%;
  }

  .notification-btn {
    width: 38px;
    height: 38px;
  }

  .notification-count {
    top: -4px;
    right: -3px;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .banner {
    flex-direction: column;
    text-align: left;
    min-height: auto;
    padding: 1.5rem;
  }

  .hero-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .banner-btn,
  .banner-btn-secondary {
    flex: 1;
    min-width: 140px;
  }

  .hero-side-cards {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .settings-form,
  .license-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    margin: 0.65rem 0.65rem 0;
    border-radius: 14px;
  }

  .header-left h1 {
    font-size: 1.4rem;
  }

  .access-grid,
  .emergency-grid,
  .pharmacy-grid {
    grid-template-columns: 1fr;
  }

  .settings-actions,
  .license-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .pharmacy-btn {
    width: 100%;
  }

  .notification-btn {
    width: 36px;
    height: 36px;
  }

  .notification-btn svg {
    width: 0.95rem;
    height: 0.95rem;
  }
}
`

const MEDICINE_OPTIONS = [
  'Amoxicillin 500mg',
  'Metformin 500mg',
  'Lisinopril 10mg',
  'Paracetamol 650mg',
  'Insulin Glargine',
  'Atorvastatin 20mg',
  'Vitamin B12',
  'ORS Sachet',
]

const PARTNERED_PHARMACIES = [
  'Apollo Pharmacy',
  'MedPlus',
  'Health Plus Pharmacy',
  'Care Plus Pharmacy',
]

const createPrescriptionId = () => `RX${Math.floor(100000 + Math.random() * 900000)}`

const formatHumanDate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const toCountdownLabel = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const createQrCells = (seedText) => {
  let seed = 0
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) % 2147483647
  }

  const cells = []
  const size = 21

  for (let index = 0; index < size * size; index += 1) {
    const row = Math.floor(index / size)
    const col = index % size

    const inTopLeft = row < 7 && col < 7
    const inTopRight = row < 7 && col >= 14
    const inBottomLeft = row >= 14 && col < 7

    if (inTopLeft || inTopRight || inBottomLeft) {
      const edge = row % 7 === 0 || row % 7 === 6 || col % 7 === 0 || col % 7 === 6
      const center = row % 7 >= 2 && row % 7 <= 4 && col % 7 >= 2 && col % 7 <= 4
      cells.push(edge || center)
      continue
    }

    seed = (seed * 1103515245 + 12345) % 2147483647
    cells.push(seed % 2 === 0)
  }

  return cells
}

const DoctorDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const doctorInfo = {
    name: 'Dr. Sara Abraham',
    specialty: 'General Physician',
    licenseNumber: 'MCI12345',
    experience: '8 years',
    clinic: 'Health Plus Clinic',
    phone: '+91-9876543210',
    email: 'sara.abraham@vitalcode.com',
  }

  const doctorNameCore = doctorInfo.name.replace(/^Dr\.?\s*/i, '')
  const doctorInitials = doctorNameCore
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const [licenseVerified, setLicenseVerified] = useState(true)
  const [showLicenseCheckModal, setShowLicenseCheckModal] = useState(true)
  const [licenseCheckStage, setLicenseCheckStage] = useState('checking')

  const [sessionStartedAt, setSessionStartedAt] = useState(Date.now())
  const [showSessionVerifyModal, setShowSessionVerifyModal] = useState(false)
  const [sessionAuthMethod, setSessionAuthMethod] = useState('password')
  const [sessionPassword, setSessionPassword] = useState('')
  const [sessionBiometricState, setSessionBiometricState] = useState({
    status: 'idle',
    message: '',
  })

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patient: 'John Doe',
      medicine: 'Metformin 500mg',
      date: '14 Apr 2025',
      status: 'active',
      purchasedCount: 3,
      purchaseHistory: ['Apollo Pharmacy (2x)', 'MedPlus (1x)'],
      lastPurchase: '14 Apr 2025',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      medicine: 'Amoxicillin 500mg',
      date: '11 Apr 2025',
      status: 'used',
      purchasedCount: 1,
      purchaseHistory: ['Apollo Pharmacy (1x)'],
      lastPurchase: '12 Apr 2025',
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      medicine: 'Lisinopril 10mg',
      date: '08 Apr 2025',
      status: 'expired',
      purchasedCount: 0,
      purchaseHistory: [],
      lastPurchase: 'N/A',
    },
  ])
  const [prescriptionTab, setPrescriptionTab] = useState('active')
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [prescriptionStep, setPrescriptionStep] = useState(1)
  const [prescriptionFormError, setPrescriptionFormError] = useState('')
  const [issuedThisHour, setIssuedThisHour] = useState(8)
  const [lockUntil, setLockUntil] = useState(null)
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0)
  const [prescriptionBiometric, setPrescriptionBiometric] = useState({
    status: 'idle',
    message: '',
  })
  const [prescriptionResult, setPrescriptionResult] = useState(null)
  const [expandedPrescriptionId, setExpandedPrescriptionId] = useState(null)
  const [prescriptionDraft, setPrescriptionDraft] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
  })

  const [accessForm, setAccessForm] = useState({ patientId: '', patientName: '' })
  const [accessRequests, setAccessRequests] = useState([
    {
      id: 1,
      patientId: 'P001',
      patientName: 'John Doe',
      requestedOn: '16 Apr 2025',
      status: 'approved',
      records: {
        personalInfo: 'Male, 34 years, Chennai',
        diagnosisHistory: 'Type-2 Diabetes, Mild Hypertension',
        labReports: 'HbA1c 7.1, LDL 132 mg/dL',
        currentMedications: 'Metformin 500mg, Atorvastatin 20mg',
        allergies: 'Penicillin',
      },
    },
    {
      id: 2,
      patientId: 'P002',
      patientName: 'Jane Smith',
      requestedOn: '16 Apr 2025',
      status: 'pending',
      records: null,
    },
    {
      id: 3,
      patientId: 'P003',
      patientName: 'Mike Johnson',
      requestedOn: '15 Apr 2025',
      status: 'denied',
      records: null,
    },
  ])
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(null)

  const [sensitiveBiometric, setSensitiveBiometric] = useState({
    target: null,
    payload: null,
    status: 'idle',
    message: '',
  })

  const emergencyFolders = {
    P005: {
      bloodGroup: 'O+',
      knownAllergies: 'Sulfa Drugs',
      criticalConditions: 'Asthma',
      emergencyContacts: 'Maria Brown - +91-9876500001',
      currentMedications: 'Inhaled Salbutamol',
      lastHospitalVisit: '12 Mar 2025 - VitalCare Hospital',
    },
    P006: {
      bloodGroup: 'A-',
      knownAllergies: 'None Recorded',
      criticalConditions: 'Cardiac Arrhythmia',
      emergencyContacts: 'Daniel Davis - +91-9876500002',
      currentMedications: 'Metoprolol 25mg',
      lastHospitalVisit: '01 Apr 2025 - Metro Heart Center',
    },
  }

  const [emergencyPatientId, setEmergencyPatientId] = useState('')
  const [emergencyFolder, setEmergencyFolder] = useState(null)

  const [pharmacyTab, setPharmacyTab] = useState('order-clinic')
  const [orderSearch, setOrderSearch] = useState('')
  const [clinicOrderForm, setClinicOrderForm] = useState({
    medicineName: '',
    quantity: '',
    pharmacy: PARTNERED_PHARMACIES[0],
    deliveryAddress: `${doctorInfo.clinic}, Chennai`,
    priority: 'normal',
  })
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      medicine: 'Insulin Glargine',
      qty: 20,
      pharmacy: 'Apollo Pharmacy',
      orderedOn: '17 Apr 2025',
      status: 'processing',
    },
    {
      id: 2,
      medicine: 'Vitamin B12',
      qty: 40,
      pharmacy: 'MedPlus',
      orderedOn: '16 Apr 2025',
      status: 'dispatched',
    },
    {
      id: 3,
      medicine: 'Metformin 500mg',
      qty: 75,
      pharmacy: 'Health Plus Pharmacy',
      orderedOn: '14 Apr 2025',
      status: 'delivered',
    },
  ])

  const [trackerFilters, setTrackerFilters] = useState({
    fromDate: '',
    toDate: '',
    status: 'all',
    medicineName: '',
  })
  const [expandedTrackerId, setExpandedTrackerId] = useState(null)
  const [purchaseTracker] = useState([
    {
      id: 1,
      patient: 'John Doe',
      prescription: 'RX782341',
      prescribedOn: '12 Apr 2025',
      prescribedOnISO: '2025-04-12',
      timesPurchased: 3,
      lastPharmacy: 'Apollo Pharmacy',
      lastDate: '14 Apr 2025',
      status: 'purchased',
      medicineName: 'Metformin 500mg',
      purchases: [
        'Apollo Pharmacy - 500mg x 2 strips - 12 Apr 2025',
        'Apollo Pharmacy - 500mg x 1 strip - 13 Apr 2025',
        'MedPlus - 500mg x 1 strip - 14 Apr 2025',
      ],
    },
    {
      id: 2,
      patient: 'Jane Smith',
      prescription: 'RX665520',
      prescribedOn: '11 Apr 2025',
      prescribedOnISO: '2025-04-11',
      timesPurchased: 0,
      lastPharmacy: 'N/A',
      lastDate: 'N/A',
      status: 'not-yet',
      medicineName: 'Amoxicillin 500mg',
      purchases: [],
    },
    {
      id: 3,
      patient: 'Sam Emmanuel',
      prescription: 'RX119320',
      prescribedOn: '01 Apr 2025',
      prescribedOnISO: '2025-04-01',
      timesPurchased: 0,
      lastPharmacy: 'N/A',
      lastDate: 'N/A',
      status: 'overdue',
      medicineName: 'Lisinopril 10mg',
      purchases: [],
    },
  ])

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocumentClick)
    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
    }
  }, [])

  useEffect(() => {
    if (!showLicenseCheckModal || licenseCheckStage !== 'checking') {
      return undefined
    }

    const timer = setTimeout(() => {
      setLicenseCheckStage(licenseVerified ? 'success' : 'failure')
    }, 1300)

    return () => clearTimeout(timer)
  }, [showLicenseCheckModal, licenseCheckStage, licenseVerified])

  useEffect(() => {
    if (!lockUntil) {
      setLockRemainingSeconds(0)
      return undefined
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((lockUntil - Date.now()) / 1000))
      setLockRemainingSeconds(remaining)

      if (remaining === 0) {
        setLockUntil(null)
        setIssuedThisHour(0)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [lockUntil])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - sessionStartedAt >= 4 * 60 * 60 * 1000) {
        setShowSessionVerifyModal(true)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [sessionStartedAt])

  const openSensitiveGate = (target, payload) => {
    setSensitiveBiometric({
      target,
      payload,
      status: 'idle',
      message: '',
    })
  }

  const closeSensitiveGate = () => {
    setSensitiveBiometric({
      target: null,
      payload: null,
      status: 'idle',
      message: '',
    })
  }

  const resetPrescriptionFlow = () => {
    setPrescriptionDraft({
      patientName: '',
      patientId: '',
      age: '',
      gender: '',
      notes: '',
      medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    })
    setPrescriptionStep(1)
    setPrescriptionFormError('')
    setPrescriptionBiometric({ status: 'idle', message: '' })
  }

  const openNewPrescription = () => {
    if (lockUntil) {
      return
    }

    resetPrescriptionFlow()
    setShowPrescriptionForm(true)
  }

  const lockPrescriptionForm = () => {
    const lockTimestamp = Date.now() + 45 * 60 * 1000
    setLockUntil(lockTimestamp)
    setShowPrescriptionForm(false)
    setPrescriptionBiometric({
      status: 'error',
      message: 'Doctor ID Temporarily Detained',
    })
  }

  const handlePrescriptionDraft = (field, value) => {
    setPrescriptionDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleMedicineDraft = (index, field, value) => {
    setPrescriptionDraft((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine, medicineIndex) =>
        medicineIndex === index ? { ...medicine, [field]: value } : medicine
      ),
    }))
  }

  const addMedicineRow = () => {
    setPrescriptionDraft((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '' }],
    }))
  }

  const goToNextPrescriptionStep = () => {
    setPrescriptionFormError('')

    if (prescriptionStep === 1) {
      const { patientName, patientId, age, gender } = prescriptionDraft
      if (!patientName || !patientId || !age || !gender) {
        setPrescriptionFormError('Complete all patient fields to continue.')
        return
      }
    }

    if (prescriptionStep === 2) {
      const validMedicine = prescriptionDraft.medicines.every(
        (medicine) =>
          medicine.name && medicine.dosage && medicine.frequency && medicine.duration
      )
      if (!validMedicine) {
        setPrescriptionFormError('Fill medicine name, dosage, frequency, and duration for each item.')
        return
      }
    }

    setPrescriptionStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrescriptionVerifyAndSubmit = () => {
    if (issuedThisHour >= 10) {
      lockPrescriptionForm()
      return
    }

    setPrescriptionBiometric({ status: 'verifying', message: 'Verifying biometric identity...' })

    setTimeout(() => {
      const matched = Math.random() > 0.2
      if (!matched) {
        setPrescriptionBiometric({
          status: 'error',
          message: 'Biometric mismatch. Please retry.',
        })
        return
      }

      const nextIssuedCount = issuedThisHour + 1
      if (nextIssuedCount > 10) {
        lockPrescriptionForm()
        return
      }

      const prescriptionId = createPrescriptionId()
      const medicineSummary = prescriptionDraft.medicines
        .map((medicine) => `${medicine.name} ${medicine.dosage}`)
        .join(', ')

      setIssuedThisHour(nextIssuedCount)
      setPrescriptionBiometric({
        status: 'success',
        message: 'Biometric verification successful.',
      })

      setPrescriptions((prev) => [
        {
          id: Date.now(),
          patient: prescriptionDraft.patientName,
          medicine: medicineSummary,
          date: formatHumanDate(new Date()),
          status: 'active',
          purchasedCount: 0,
          purchaseHistory: [],
          lastPurchase: 'N/A',
        },
        ...prev,
      ])

      setPrescriptionResult({
        id: prescriptionId,
        patientName: prescriptionDraft.patientName,
        createdOn: formatHumanDate(new Date()),
      })

      setShowPrescriptionForm(false)
      resetPrescriptionFlow()
    }, 900)
  }

  const prescriptionStatusClass = (status) => {
    if (status === 'active') return 'status-active'
    if (status === 'used') return 'status-used'
    return 'status-expired'
  }

  const purchaseSummaryText = (prescription) => {
    if (prescription.purchasedCount === 0) {
      return 'Purchased: 0 times | Pharmacies: None | Last: N/A'
    }

    return `Purchased: ${prescription.purchasedCount} times | Pharmacies: ${prescription.purchaseHistory.join(', ')} | Last: ${prescription.lastPurchase}`
  }

  const filteredPrescriptions = prescriptions.filter((prescription) =>
    prescriptionTab === 'active'
      ? prescription.status === 'active'
      : prescription.status === 'used' || prescription.status === 'expired'
  )

  const sendAccessRequest = () => {
    if (!accessForm.patientId.trim()) {
      return
    }

    setAccessRequests((prev) => [
      {
        id: Date.now(),
        patientId: accessForm.patientId.trim().toUpperCase(),
        patientName: accessForm.patientName.trim() || 'Unknown Patient',
        requestedOn: formatHumanDate(new Date()),
        status: 'pending',
        records: null,
      },
      ...prev,
    ])

    setAccessForm({ patientId: '', patientName: '' })
  }

  const requestAccessAgain = (id) => {
    setAccessRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'pending',
              requestedOn: formatHumanDate(new Date()),
            }
          : request
      )
    )
  }

  const runSensitiveBiometricCheck = () => {
    const { target, payload } = sensitiveBiometric

    setSensitiveBiometric((prev) => ({
      ...prev,
      status: 'verifying',
      message: 'Biometric verification in progress...',
    }))

    setTimeout(() => {
      const matched = Math.random() > 0.15

      if (!matched) {
        setSensitiveBiometric((prev) => ({
          ...prev,
          status: 'error',
          message: 'Biometric mismatch. Please retry.',
        }))
        return
      }

      if (target === 'patient-records') {
        const selected = accessRequests.find(
          (request) => request.patientId === payload && request.status === 'approved'
        )
        setSelectedPatientRecord(selected || null)
      }

      if (target === 'emergency-folder') {
        const folder = emergencyFolders[payload]
        if (folder) {
          setEmergencyFolder({
            patientId: payload,
            ...folder,
            loggedAt: new Date().toLocaleString('en-IN'),
          })
        }
      }

      setSensitiveBiometric((prev) => ({
        ...prev,
        status: 'success',
        message: 'Biometric verified successfully.',
      }))

      setTimeout(() => {
        closeSensitiveGate()
      }, 500)
    }, 850)
  }

  const requestEmergencyFolderById = () => {
    const patientId = emergencyPatientId.trim().toUpperCase()
    if (!patientId) {
      return
    }

    openSensitiveGate('emergency-folder', patientId)
  }

  const requestEmergencyFolderByQr = () => {
    const patientId = 'P005'
    setEmergencyPatientId(patientId)
    openSensitiveGate('emergency-folder', patientId)
  }

  const updateClinicOrderForm = (field, value) => {
    setClinicOrderForm((prev) => ({ ...prev, [field]: value }))
  }

  const placeClinicOrder = () => {
    if (!clinicOrderForm.medicineName || !clinicOrderForm.quantity || !clinicOrderForm.pharmacy) {
      return
    }

    setRecentOrders((prev) => [
      {
        id: Date.now(),
        medicine: clinicOrderForm.medicineName,
        qty: clinicOrderForm.quantity,
        pharmacy: clinicOrderForm.pharmacy,
        orderedOn: formatHumanDate(new Date()),
        status: 'processing',
      },
      ...prev,
    ])

    setClinicOrderForm((prev) => ({
      ...prev,
      medicineName: '',
      quantity: '',
      priority: 'normal',
    }))
  }

  const filteredTrackerRows = purchaseTracker.filter((row) => {
    if (trackerFilters.status !== 'all' && row.status !== trackerFilters.status) {
      return false
    }

    if (
      trackerFilters.medicineName &&
      !row.medicineName.toLowerCase().includes(trackerFilters.medicineName.toLowerCase())
    ) {
      return false
    }

    if (trackerFilters.fromDate && row.prescribedOnISO < trackerFilters.fromDate) {
      return false
    }

    if (trackerFilters.toDate && row.prescribedOnISO > trackerFilters.toDate) {
      return false
    }

    return true
  })

  const completeSessionVerification = () => {
    setShowSessionVerifyModal(false)
    setSessionStartedAt(Date.now())
    setSessionPassword('')
    setSessionBiometricState({ status: 'idle', message: '' })
  }

  const verifySessionPassword = () => {
    if (sessionPassword.trim().length < 4) {
      setSessionBiometricState({
        status: 'error',
        message: 'Enter your account password to continue.',
      })
      return
    }

    completeSessionVerification()
  }

  const verifySessionBiometric = () => {
    setSessionBiometricState({ status: 'verifying', message: 'Scanning biometric identity...' })

    setTimeout(() => {
      const passed = Math.random() > 0.1
      if (!passed) {
        setSessionBiometricState({
          status: 'error',
          message: 'Biometric mismatch. Please retry.',
        })
        return
      }

      setSessionBiometricState({ status: 'success', message: 'Verification successful.' })
      setTimeout(() => {
        completeSessionVerification()
      }, 500)
    }, 800)
  }

  const verifyLicense = () => {
    setLicenseVerified((prev) => !prev)
  }

  const biometricCard = ({ actionLabel, subNote, status, message, onVerify }) => (
    <div className="biometric-card">
      <div className="biometric-head">
        <div className="biometric-icon" aria-hidden="true">
          <LuFingerprint />
        </div>
        <div>
          <h3>Biometric Verification Required</h3>
          <p>
            Scan your registered fingerprint or face ID to authenticate and sign this
            action securely.
          </p>
        </div>
      </div>

      <button type="button" className="add-new-btn" onClick={onVerify}>
        {status === 'verifying' ? 'Verifying...' : actionLabel}
      </button>

      <p className="biometric-note">{subNote}</p>

      {message && (
        <p className={status === 'error' ? 'state-error' : 'state-success'}>{message}</p>
      )}
    </div>
  )

  return (
    <>
      <style>{doctorDashboardStyles}</style>

      {showLicenseCheckModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="License verification">
          <div className="modal-card">
            {licenseCheckStage === 'checking' && (
              <>
                <h2>Verifying your Medical License ID against NMC registry...</h2>
                <p>Please wait while VitalCode securely confirms your registration details.</p>
              </>
            )}

            {licenseCheckStage === 'success' && (
              <>
                <h2 className="state-success">License Verification Complete</h2>
                <p>
                  {doctorInfo.name} - License #MH-{doctorInfo.licenseNumber.slice(-5)} - Active
                </p>
              </>
            )}

            {licenseCheckStage === 'failure' && (
              <>
                <h2 className="state-error">License Verification Failed</h2>
                <p>Contact support@vitalcode.in for manual verification.</p>
              </>
            )}

            {licenseCheckStage !== 'checking' && (
              <div className="modal-actions">
                <button
                  type="button"
                  className="add-new-btn"
                  onClick={() => setShowLicenseCheckModal(false)}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showSessionVerifyModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Session verification">
          <div className="modal-card">
            <h2>Session Verification</h2>
            <p>
              To confirm you are the account holder, please re-authenticate.
            </p>

            <div className="session-options">
              <button
                type="button"
                className={`inline-tab ${sessionAuthMethod === 'password' ? 'active' : ''}`}
                onClick={() => setSessionAuthMethod('password')}
              >
                Re-enter Password
              </button>
              <button
                type="button"
                className={`inline-tab ${sessionAuthMethod === 'biometric' ? 'active' : ''}`}
                onClick={() => setSessionAuthMethod('biometric')}
              >
                Biometric Scan
              </button>
            </div>

            {sessionAuthMethod === 'password' && (
              <div className="form-card">
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-enter account password"
                  value={sessionPassword}
                  onChange={(event) => setSessionPassword(event.target.value)}
                />
                <div className="modal-actions">
                  <button type="button" className="add-new-btn" onClick={verifySessionPassword}>
                    Confirm Session
                  </button>
                </div>
              </div>
            )}

            {sessionAuthMethod === 'biometric' && (
              <div className="form-card">
                {biometricCard({
                  actionLabel: 'Complete Biometric Scan',
                  subNote:
                    'This is a security measure to prevent unauthorized use of doctor accounts.',
                  status: sessionBiometricState.status,
                  message: sessionBiometricState.message,
                  onVerify: verifySessionBiometric,
                })}
              </div>
            )}

            <p className="biometric-note">
              This is a security measure to prevent unauthorized use of doctor accounts.
            </p>
          </div>
        </div>
      )}

      <div className="doctor-dashboard-container">
        <aside className="doctor-sidebar">
          <div className="sidebar-header">
            <div>
              <h2>VitalCode</h2>
              <div className={`sidebar-license-badge ${licenseVerified ? '' : 'unverified'}`}>
                <LuShieldCheck aria-hidden="true" />
                <span>
                  {licenseVerified
                    ? 'License Verified'
                    : 'License Unverified - Contact Support'}
                </span>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <span className="nav-icon" aria-hidden="true"><LuLayoutDashboard /></span>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveSection('prescriptions')}
            >
              <span className="nav-icon" aria-hidden="true"><LuPill /></span>
              <span>Prescriptions</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'patient-access' ? 'active' : ''}`}
              onClick={() => setActiveSection('patient-access')}
            >
              <span className="nav-icon" aria-hidden="true"><LuShieldCheck /></span>
              <span>Patient Access</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveSection('emergency')}
            >
              <span className="nav-icon" aria-hidden="true"><LuSiren /></span>
              <span>Emergency</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'pharmacy' ? 'active' : ''}`}
              onClick={() => setActiveSection('pharmacy')}
            >
              <span className="nav-icon" aria-hidden="true"><LuStore /></span>
              <span>Pharmacy</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <span className="nav-icon" aria-hidden="true"><LuSettings /></span>
              <span>Settings</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'license' ? 'active' : ''}`}
              onClick={() => setActiveSection('license')}
            >
              <span className="nav-icon" aria-hidden="true"><LuBadgeCheck /></span>
              <span>License</span>
            </button>
            <button className="nav-item logout-btn" onClick={onLogout}>
              <span className="nav-icon" aria-hidden="true"><LuLogOut /></span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header">
            <div className="header-left">
              <h1>Doctor Dashboard</h1>
            </div>

            <div className="header-right">
              <input type="text" placeholder="Search something" className="search-input" />

              <button type="button" className="notification-btn" aria-label="Notifications">
                <LuBell />
                <span className="notification-count">3</span>
              </button>

              <div className="profile-menu" ref={profileMenuRef}>
                <button
                  type="button"
                  className="user-avatar-header"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-label="Open doctor profile details"
                >
                  {doctorInitials}
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-top">
                      <div className="profile-avatar-lg">{doctorInitials}</div>
                      <div>
                        <h4>{doctorInfo.name}</h4>
                        <p>{doctorInfo.specialty}</p>
                      </div>
                    </div>

                    <div className="profile-meta">
                      <p>
                        License: <strong>{doctorInfo.licenseNumber}</strong>
                      </p>
                      <p>
                        Status:{' '}
                        <strong className={licenseVerified ? 'is-verified' : 'is-unverified'}>
                          {licenseVerified ? 'Verified' : 'Unverified'}
                        </strong>
                      </p>
                    </div>

                    <div className="profile-actions">
                      <button
                        type="button"
                        className="profile-action-btn"
                        onClick={() => {
                          setActiveSection('settings')
                          setIsProfileOpen(false)
                        }}
                      >
                        Profile Details
                      </button>
                      <button
                        type="button"
                        className="profile-action-btn verify"
                        onClick={() => {
                          setActiveSection('license')
                          setIsProfileOpen(false)
                        }}
                      >
                        Verify License
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {activeSection === 'dashboard' && (
              <section className="content-section">
                <div className="hero-layout">
                  <div className="banner">
                    <div className="banner-glow banner-glow-1" aria-hidden="true" />
                    <div className="banner-glow banner-glow-2" aria-hidden="true" />

                    <div className="banner-text">
                      <p className="hero-kicker">Doctor Command Center</p>
                      <h2>Good Morning, Dr. {doctorNameCore}</h2>
                      <p>
                        Issue biometric-verified prescriptions, access patient records
                        securely, and manage your clinic's pharmacy orders.
                      </p>

                      <div className="hero-actions">
                        <button
                          className="banner-btn"
                          onClick={() => {
                            setActiveSection('prescriptions')
                            openNewPrescription()
                          }}
                        >
                          New Prescription
                        </button>
                        <button
                          className="banner-btn-secondary"
                          onClick={() => {
                            setActiveSection('prescriptions')
                          }}
                        >
                          Open Queue
                        </button>
                      </div>

                      <div className="hero-metrics">
                        <div className="metric-pill">
                          <span className="metric-pill-label">Pending Cases</span>
                          <span className="metric-pill-value">12</span>
                        </div>
                        <div className="metric-pill">
                          <span className="metric-pill-label">Emergency Alerts</span>
                          <span className="metric-pill-value">2</span>
                        </div>
                        <div className="metric-pill">
                          <span className="metric-pill-label">Biometry Required</span>
                          <span className="metric-pill-value">3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hero-side-cards">
                    <div className="visual-card visual-card-light">
                      <p>Today's Appointments</p>
                      <h4>24</h4>
                      <span>8 waiting confirmations</span>
                    </div>
                    <div className="visual-card visual-card-light">
                      <p>Prescription Clearance</p>
                      <h4>91%</h4>
                      <span>3 pending biometric approvals</span>
                    </div>
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="grid-section">
                    <h3>Pharmacy Stock Summary</h3>
                    <div className="cards-grid">
                      <div className="hire-card">
                        <span className="hire-icon">⚠</span>
                        <p>Low Stock</p>
                        <small>Metformin, Insulin, Vitamin B12</small>
                      </div>
                      <div className="hire-card">
                        <span className="hire-icon">⟳</span>
                        <p>Restocking</p>
                        <small>2 medicines expected by evening</small>
                      </div>
                      <div className="hire-card">
                        <span className="hire-icon">✓</span>
                        <p>In Stock</p>
                        <small>Amoxicillin, Paracetamol, ORS</small>
                      </div>
                      <div className="hire-card">
                        <span className="hire-icon">📦</span>
                        <p>Available Units</p>
                        <small>125 units across partner pharmacies</small>
                      </div>
                    </div>
                    <button className="view-all-btn">View All</button>
                  </div>

                  <div className="grid-section">
                    <h3>Pending Prescriptions To Give</h3>
                    <div className="progress-table">
                      <table>
                        <tbody>
                          <tr>
                            <td>Sarah Smith</td>
                            <td>Metformin 500mg</td>
                            <td><span className="badge badge-low-stock">Low Stock</span></td>
                          </tr>
                          <tr>
                            <td>John Doe</td>
                            <td>Amoxicillin 500mg</td>
                            <td><span className="badge badge-pending">Pending</span></td>
                          </tr>
                          <tr>
                            <td>Sam Emmanuel</td>
                            <td>Lisinopril 10mg</td>
                            <td><span className="badge badge-pending">Pending</span></td>
                          </tr>
                          <tr>
                            <td>John Samuel</td>
                            <td>Paracetamol 650mg</td>
                            <td><span className="badge badge-success">Ready</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="view-all-btn">View All</button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'prescriptions' && (
              <section className="content-section section-stack">
                <div className="section-header">
                  <h2>Prescriptions</h2>
                  <button className="add-new-btn" onClick={openNewPrescription}>
                    + New Prescription
                  </button>
                </div>

                {issuedThisHour >= 8 && !lockUntil && (
                  <div className="warning-banner">
                    You have issued {issuedThisHour}/10 prescriptions this hour. Your Doctor
                    ID will be temporarily detained if limit is exceeded.
                  </div>
                )}

                {lockUntil && (
                  <div className="warning-banner critical">
                    <h3>Doctor ID Temporarily Detained</h3>
                    <p>
                      You have exceeded the prescription upload limit. Your account is
                      locked for 45 minutes. If this was not you, contact support
                      immediately.
                    </p>
                    <p>
                      Time Remaining: <strong>{toCountdownLabel(lockRemainingSeconds)}</strong>
                    </p>
                  </div>
                )}

                <div className="inline-tabs">
                  <button
                    type="button"
                    className={`inline-tab ${prescriptionTab === 'active' ? 'active' : ''}`}
                    onClick={() => setPrescriptionTab('active')}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={`inline-tab ${prescriptionTab === 'history' ? 'active' : ''}`}
                    onClick={() => setPrescriptionTab('history')}
                  >
                    History
                  </button>
                </div>

                {prescriptionResult && (
                  <div className="form-card">
                    <h3 className="state-success">Prescription Submitted Successfully</h3>
                    <p>
                      Prescription ID: <strong>{prescriptionResult.id}</strong>
                    </p>
                    <p>
                      Patient: {prescriptionResult.patientName} | Date: {prescriptionResult.createdOn}
                    </p>
                    <div className="qr-grid" aria-label="Prescription QR Code">
                      {createQrCells(prescriptionResult.id).map((isActive, index) => (
                        <span
                          key={`${prescriptionResult.id}-${index}`}
                          className={`qr-cell ${isActive ? 'on' : 'off'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {showPrescriptionForm && !lockUntil && (
                  <div className="form-card">
                    <div className="inline-tabs" style={{ marginBottom: '0.9rem' }}>
                      <span className={`inline-tab ${prescriptionStep === 1 ? 'active' : ''}`}>
                        Step 1 - Patient Details
                      </span>
                      <span className={`inline-tab ${prescriptionStep === 2 ? 'active' : ''}`}>
                        Step 2 - Prescription
                      </span>
                      <span className={`inline-tab ${prescriptionStep === 3 ? 'active' : ''}`}>
                        Step 3 - Biometric
                      </span>
                    </div>

                    {prescriptionStep === 1 && (
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Patient Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={prescriptionDraft.patientName}
                            onChange={(event) => handlePrescriptionDraft('patientName', event.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Patient Unique ID</label>
                          <input
                            type="text"
                            className="form-input"
                            value={prescriptionDraft.patientId}
                            onChange={(event) => handlePrescriptionDraft('patientId', event.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Age</label>
                          <input
                            type="number"
                            className="form-input"
                            value={prescriptionDraft.age}
                            onChange={(event) => handlePrescriptionDraft('age', event.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Gender</label>
                          <input
                            type="text"
                            className="form-input"
                            value={prescriptionDraft.gender}
                            onChange={(event) => handlePrescriptionDraft('gender', event.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {prescriptionStep === 2 && (
                      <div className="section-stack">
                        {prescriptionDraft.medicines.map((medicine, index) => (
                          <div key={`medicine-row-${index}`} className="form-grid">
                            <div className="form-group">
                              <label>Medicine Name</label>
                              <input
                                type="text"
                                className="form-input"
                                list="doctor-medicine-options"
                                value={medicine.name}
                                onChange={(event) =>
                                  handleMedicineDraft(index, 'name', event.target.value)
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Dosage</label>
                              <input
                                type="text"
                                className="form-input"
                                value={medicine.dosage}
                                onChange={(event) =>
                                  handleMedicineDraft(index, 'dosage', event.target.value)
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Frequency</label>
                              <input
                                type="text"
                                className="form-input"
                                value={medicine.frequency}
                                onChange={(event) =>
                                  handleMedicineDraft(index, 'frequency', event.target.value)
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label>Duration</label>
                              <input
                                type="text"
                                className="form-input"
                                value={medicine.duration}
                                onChange={(event) =>
                                  handleMedicineDraft(index, 'duration', event.target.value)
                                }
                              />
                            </div>
                          </div>
                        ))}

                        <datalist id="doctor-medicine-options">
                          {MEDICINE_OPTIONS.map((medicine) => (
                            <option key={medicine} value={medicine} />
                          ))}
                        </datalist>

                        <button type="button" className="outline-btn" onClick={addMedicineRow}>
                          + Add Medicine
                        </button>

                        <div className="form-group">
                          <label>Notes</label>
                          <textarea
                            className="form-textarea"
                            value={prescriptionDraft.notes}
                            onChange={(event) => handlePrescriptionDraft('notes', event.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {prescriptionStep === 3 &&
                      biometricCard({
                        actionLabel: 'Verify & Submit',
                        subNote:
                          'Prescription will not be uploaded without doctor biometric confirmation.',
                        status: prescriptionBiometric.status,
                        message: prescriptionBiometric.message,
                        onVerify: handlePrescriptionVerifyAndSubmit,
                      })}

                    {prescriptionFormError && <p className="state-error">{prescriptionFormError}</p>}

                    <div className="modal-actions">
                      {prescriptionStep > 1 && (
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setPrescriptionStep((prev) => prev - 1)}
                        >
                          Back
                        </button>
                      )}
                      {prescriptionStep < 3 && (
                        <button type="button" className="btn-primary" onClick={goToNextPrescriptionStep}>
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="prescription-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Medicine</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Purchased</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrescriptions.map((prescription) => (
                        <React.Fragment key={prescription.id}>
                          <tr>
                            <td>{prescription.patient}</td>
                            <td>{prescription.medicine}</td>
                            <td>{prescription.date}</td>
                            <td>
                              <span className={`badge ${prescriptionStatusClass(prescription.status)}`}>
                                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                              </span>
                            </td>
                            <td title={purchaseSummaryText(prescription)}>
                              {prescription.purchasedCount > 0 ? (
                                <span className="state-success">✓ Purchased</span>
                              ) : (
                                <span className="badge badge-pending">Not Yet</span>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="action-link"
                                onClick={() =>
                                  setExpandedPrescriptionId((prev) =>
                                    prev === prescription.id ? null : prescription.id
                                  )
                                }
                              >
                                {expandedPrescriptionId === prescription.id ? 'Hide' : 'View'}
                              </button>
                            </td>
                          </tr>
                          {expandedPrescriptionId === prescription.id && (
                            <tr>
                              <td colSpan={6} className="row-detail">
                                {purchaseSummaryText(prescription)}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {activeSection === 'patient-access' && (
              <section className="content-section section-stack">
                <div className="section-header">
                  <h2>Patient Access</h2>
                  <p className="section-subtitle">
                    Request patient authorization to view medical history and assessment
                    reports.
                  </p>
                </div>

                <div className="form-card">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Patient Unique ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={accessForm.patientId}
                        onChange={(event) =>
                          setAccessForm((prev) => ({ ...prev, patientId: event.target.value }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Patient Name (optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={accessForm.patientName}
                        onChange={(event) =>
                          setAccessForm((prev) => ({ ...prev, patientName: event.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                    <button type="button" className="add-new-btn" onClick={sendAccessRequest}>
                      Send Access Request
                    </button>
                  </div>
                  <p className="biometric-note">
                    Patient will receive a notification to approve or deny this request from
                    their app.
                  </p>
                </div>

                <div className="prescription-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Requested On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessRequests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.patientName}</td>
                          <td>{request.requestedOn}</td>
                          <td>
                            <span
                              className={`badge ${
                                request.status === 'approved'
                                  ? 'badge-success'
                                  : request.status === 'pending'
                                    ? 'badge-pending'
                                    : 'badge-low-stock'
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {request.status === 'approved' && (
                              <button
                                type="button"
                                className="action-link"
                                onClick={() => openSensitiveGate('patient-records', request.patientId)}
                              >
                                View Records
                              </button>
                            )}
                            {request.status === 'pending' && (
                              <button type="button" className="action-link table-disabled" disabled>
                                Waiting...
                              </button>
                            )}
                            {request.status === 'denied' && (
                              <button
                                type="button"
                                className="action-link"
                                onClick={() => requestAccessAgain(request.id)}
                              >
                                Request Again
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {sensitiveBiometric.target === 'patient-records' && (
                  <div className="form-card">
                    {biometricCard({
                      actionLabel: 'Verify & Continue',
                      subNote:
                        'Patient records remain encrypted until doctor biometric confirmation is complete.',
                      status: sensitiveBiometric.status,
                      message: sensitiveBiometric.message,
                      onVerify: runSensitiveBiometricCheck,
                    })}
                  </div>
                )}

                {selectedPatientRecord && (
                  <div className="license-card records-view">
                    <div className="records-watermark">
                      Authorized Access - Dr. {doctorNameCore} - {formatHumanDate(new Date())}
                    </div>
                    <div className="warning-banner">
                      Access granted by patient. Auto-expires in 24 hours.
                    </div>

                    <div className="license-info-grid">
                      <div className="info-item">
                        <label>Personal Info</label>
                        <p>{selectedPatientRecord.records.personalInfo}</p>
                      </div>
                      <div className="info-item">
                        <label>Diagnosis History</label>
                        <p>{selectedPatientRecord.records.diagnosisHistory}</p>
                      </div>
                      <div className="info-item">
                        <label>Lab Reports</label>
                        <p>{selectedPatientRecord.records.labReports}</p>
                      </div>
                      <div className="info-item">
                        <label>Current Medications</label>
                        <p>{selectedPatientRecord.records.currentMedications}</p>
                      </div>
                      <div className="info-item">
                        <label>Allergies</label>
                        <p>{selectedPatientRecord.records.allergies}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'emergency' && (
              <section className="content-section section-stack">
                <div className="section-header">
                  <h2>Emergency Access</h2>
                </div>

                <div className="warning-banner critical">
                  Emergency access is logged and audited. Misuse may result in license
                  suspension.
                </div>

                <div className="dashboard-grid">
                  <div className="grid-section">
                    <h3>Enter Patient ID</h3>
                    <div className="form-group">
                      <label>Patient Unique ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={emergencyPatientId}
                        onChange={(event) => setEmergencyPatientId(event.target.value)}
                      />
                    </div>
                    <button type="button" className="add-new-btn" onClick={requestEmergencyFolderById}>
                      Access Emergency Folder
                    </button>
                  </div>

                  <div className="grid-section">
                    <h3>Scan QR Code</h3>
                    <div className="scanner-placeholder">
                      <div>
                        <p>Scan patient's emergency QR</p>
                        <small>Ask patient or caregiver to show their emergency QR</small>
                      </div>
                    </div>
                    <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                      <button type="button" className="outline-btn" onClick={requestEmergencyFolderByQr}>
                        Simulate QR Scan
                      </button>
                    </div>
                  </div>
                </div>

                {sensitiveBiometric.target === 'emergency-folder' && (
                  <div className="form-card">
                    {biometricCard({
                      actionLabel: 'Verify Emergency Access',
                      subNote: 'Emergency folder access requires doctor biometric confirmation.',
                      status: sensitiveBiometric.status,
                      message: sensitiveBiometric.message,
                      onVerify: runSensitiveBiometricCheck,
                    })}
                  </div>
                )}

                {emergencyFolder && (
                  <div className="license-card">
                    <span className="badge badge-low-stock">
                      EMERGENCY ACCESS - Logged at {emergencyFolder.loggedAt}
                    </span>
                    <div className="license-info-grid" style={{ marginTop: '1rem' }}>
                      <div className="info-item">
                        <label>Blood Group</label>
                        <p>{emergencyFolder.bloodGroup}</p>
                      </div>
                      <div className="info-item">
                        <label>Known Allergies</label>
                        <p>{emergencyFolder.knownAllergies}</p>
                      </div>
                      <div className="info-item">
                        <label>Critical Conditions</label>
                        <p>{emergencyFolder.criticalConditions}</p>
                      </div>
                      <div className="info-item">
                        <label>Emergency Contacts</label>
                        <p>{emergencyFolder.emergencyContacts}</p>
                      </div>
                      <div className="info-item">
                        <label>Current Medications</label>
                        <p>{emergencyFolder.currentMedications}</p>
                      </div>
                      <div className="info-item">
                        <label>Last Hospital Visit</label>
                        <p>{emergencyFolder.lastHospitalVisit}</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'pharmacy' && (
              <section className="content-section section-stack">
                <div className="section-header">
                  <h2>Pharmacy</h2>
                </div>

                <div className="inline-tabs">
                  <button
                    type="button"
                    className={`inline-tab ${pharmacyTab === 'order-clinic' ? 'active' : ''}`}
                    onClick={() => setPharmacyTab('order-clinic')}
                  >
                    Order for Clinic
                  </button>
                  <button
                    type="button"
                    className={`inline-tab ${pharmacyTab === 'tracker' ? 'active' : ''}`}
                    onClick={() => setPharmacyTab('tracker')}
                  >
                    Patient Purchase Tracker
                  </button>
                </div>

                {pharmacyTab === 'order-clinic' && (
                  <>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search medicine or pharmacy"
                      value={orderSearch}
                      onChange={(event) => setOrderSearch(event.target.value)}
                    />

                    <div className="form-card">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Medicine Name</label>
                          <input
                            type="text"
                            className="form-input"
                            list="pharmacy-medicine-options"
                            value={clinicOrderForm.medicineName}
                            onChange={(event) =>
                              updateClinicOrderForm('medicineName', event.target.value)
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input
                            type="number"
                            className="form-input"
                            value={clinicOrderForm.quantity}
                            onChange={(event) => updateClinicOrderForm('quantity', event.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Select Pharmacy</label>
                          <select
                            className="form-input"
                            value={clinicOrderForm.pharmacy}
                            onChange={(event) => updateClinicOrderForm('pharmacy', event.target.value)}
                          >
                            {PARTNERED_PHARMACIES.map((pharmacy) => (
                              <option key={pharmacy} value={pharmacy}>
                                {pharmacy}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Delivery Address</label>
                          <input
                            type="text"
                            className="form-input"
                            value={clinicOrderForm.deliveryAddress}
                            onChange={(event) =>
                              updateClinicOrderForm('deliveryAddress', event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <datalist id="pharmacy-medicine-options">
                        {MEDICINE_OPTIONS.map((medicine) => (
                          <option key={medicine} value={medicine} />
                        ))}
                      </datalist>

                      <div className="form-group" style={{ marginTop: '0.8rem' }}>
                        <label>Priority</label>
                        <div className="inline-tabs">
                          <button
                            type="button"
                            className={`inline-tab ${clinicOrderForm.priority === 'normal' ? 'active' : ''}`}
                            onClick={() => updateClinicOrderForm('priority', 'normal')}
                          >
                            Normal
                          </button>
                          <button
                            type="button"
                            className={`inline-tab ${clinicOrderForm.priority === 'urgent' ? 'active' : ''}`}
                            onClick={() => updateClinicOrderForm('priority', 'urgent')}
                          >
                            Urgent
                          </button>
                        </div>
                      </div>

                      <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
                        <button type="button" className="add-new-btn" onClick={placeClinicOrder}>
                          Place Order
                        </button>
                      </div>
                    </div>

                    <div className="prescription-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Qty</th>
                            <th>Pharmacy</th>
                            <th>Ordered On</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders
                            .filter((order) => {
                              if (!orderSearch) return true
                              const text = `${order.medicine} ${order.pharmacy}`.toLowerCase()
                              return text.includes(orderSearch.toLowerCase())
                            })
                            .map((order) => (
                              <tr key={order.id}>
                                <td>{order.medicine}</td>
                                <td>{order.qty}</td>
                                <td>{order.pharmacy}</td>
                                <td>{order.orderedOn}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      order.status === 'processing'
                                        ? 'badge-pending'
                                        : order.status === 'dispatched'
                                          ? 'status-active'
                                          : order.status === 'delivered'
                                            ? 'badge-success'
                                            : 'badge-low-stock'
                                    }`}
                                  >
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {pharmacyTab === 'tracker' && (
                  <>
                    <p className="section-subtitle">
                      Track whether your patients filled their prescriptions
                    </p>

                    <div className="filter-grid">
                      <input
                        type="date"
                        className="form-input"
                        value={trackerFilters.fromDate}
                        onChange={(event) =>
                          setTrackerFilters((prev) => ({
                            ...prev,
                            fromDate: event.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        className="form-input"
                        value={trackerFilters.toDate}
                        onChange={(event) =>
                          setTrackerFilters((prev) => ({
                            ...prev,
                            toDate: event.target.value,
                          }))
                        }
                      />
                      <select
                        className="form-input"
                        value={trackerFilters.status}
                        onChange={(event) =>
                          setTrackerFilters((prev) => ({
                            ...prev,
                            status: event.target.value,
                          }))
                        }
                      >
                        <option value="all">All Status</option>
                        <option value="purchased">Purchased</option>
                        <option value="not-yet">Not Yet</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Filter by medicine name"
                        value={trackerFilters.medicineName}
                        onChange={(event) =>
                          setTrackerFilters((prev) => ({
                            ...prev,
                            medicineName: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="prescription-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Patient</th>
                            <th>Prescription</th>
                            <th>Prescribed On</th>
                            <th>Times Purchased</th>
                            <th>Last Pharmacy</th>
                            <th>Last Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTrackerRows.map((row) => (
                            <React.Fragment key={row.id}>
                              <tr>
                                <td>{row.patient}</td>
                                <td>{row.prescription}</td>
                                <td>{row.prescribedOn}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="action-link"
                                    onClick={() =>
                                      setExpandedTrackerId((prev) =>
                                        prev === row.id ? null : row.id
                                      )
                                    }
                                  >
                                    {row.timesPurchased}
                                  </button>
                                </td>
                                <td>{row.lastPharmacy}</td>
                                <td>{row.lastDate}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      row.status === 'purchased'
                                        ? 'badge-success'
                                        : row.status === 'not-yet'
                                          ? 'badge-pending'
                                          : 'badge-low-stock'
                                    }`}
                                  >
                                    {row.status === 'purchased'
                                      ? 'Purchased'
                                      : row.status === 'not-yet'
                                        ? 'Not Yet'
                                        : 'Overdue'}
                                  </span>
                                </td>
                              </tr>
                              {expandedTrackerId === row.id && (
                                <tr>
                                  <td colSpan={7} className="row-detail">
                                    {row.purchases.length > 0
                                      ? row.purchases.map((purchase) => (
                                          <p key={purchase}>{purchase}</p>
                                        ))
                                      : 'No purchase records yet.'}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            )}

            {activeSection === 'settings' && (
              <section className="content-section">
                <div className="section-header">
                  <h2>Doctor Details & Settings</h2>
                </div>
                <div className="settings-card">
                  <div className="settings-header">
                    <div className="doctor-avatar-large">{doctorInitials}</div>
                    <div className="doctor-header-info">
                      <h2>{doctorInfo.name}</h2>
                      <p>{doctorInfo.specialty}</p>
                    </div>
                  </div>

                  <div className="settings-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={doctorInfo.name} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Specialty</label>
                      <input type="text" value={doctorInfo.specialty} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>License Number</label>
                      <input type="text" value={doctorInfo.licenseNumber} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Experience</label>
                      <input type="text" value={doctorInfo.experience} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Clinic Name</label>
                      <input type="text" value={doctorInfo.clinic} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" value={doctorInfo.phone} readOnly className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={doctorInfo.email} readOnly className="form-input" />
                    </div>
                  </div>

                  <div className="settings-actions">
                    <button className="btn-primary">Edit Profile</button>
                    <button className="btn-secondary">Change Password</button>
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => setActiveSection('license')}
                    >
                      Open License Verification
                    </button>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'license' && (
              <section className="content-section">
                <div className="section-header">
                  <h2>Doctor License Verification</h2>
                </div>
                <div className="license-card">
                  <div className={`license-status ${licenseVerified ? 'verified' : 'unverified'}`}>
                    <div className="license-status-icon">{licenseVerified ? '✓' : '✗'}</div>
                    <div className="license-status-text">
                      <h3>{licenseVerified ? 'License Verified' : 'License Unverified'}</h3>
                      <p>
                        {licenseVerified
                          ? 'Your medical license is verified and active'
                          : 'Your medical license needs verification'}
                      </p>
                    </div>
                  </div>

                  <div className="license-details">
                    <h3>License Information</h3>
                    <div className="license-info-grid">
                      <div className="info-item">
                        <label>License Number</label>
                        <p>{doctorInfo.licenseNumber}</p>
                      </div>
                      <div className="info-item">
                        <label>Medical Council</label>
                        <p>Medical Council of India (MCI)</p>
                      </div>
                      <div className="info-item">
                        <label>License Type</label>
                        <p>General Practice</p>
                      </div>
                      <div className="info-item">
                        <label>Issue Date</label>
                        <p>January 15, 2016</p>
                      </div>
                      <div className="info-item">
                        <label>Expiration Date</label>
                        <p>January 15, 2026</p>
                      </div>
                      <div className="info-item">
                        <label>Specialization</label>
                        <p>{doctorInfo.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="license-actions">
                    <button className="btn-primary" onClick={verifyLicense}>
                      {licenseVerified ? 'Unverify License' : 'Verify License'}
                    </button>
                    <button className="btn-secondary">Upload New License</button>
                    <button className="btn-secondary">Download Certificate</button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default DoctorDashboard



