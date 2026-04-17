import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Bell,
  ChartNoAxesCombined,
  CircleCheckBig,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const sidebarItems = [
  { key: "overview", label: "Overview Hub", icon: LayoutDashboard },
  { key: "launch", label: "Launch Queue", icon: ChartNoAxesCombined },
  { key: "partners", label: "Partner Network", icon: Users },
];

const queueRows = [
  {
    workspace: "Northbridge Retail Bundle",
    submittedOn: "14 Apr 2026",
    status: "Ready for rollout",
    actionLabel: "Review packet",
    actionType: "primary",
  },
  {
    workspace: "Sierra Logistics Program",
    submittedOn: "13 Apr 2026",
    status: "Needs compliance review",
    actionLabel: "Compliance notes required",
    actionType: "waiting",
  },
  {
    workspace: "Orbit Media Licensing",
    submittedOn: "12 Apr 2026",
    status: "Paused by audit",
    actionLabel: "Awaiting legal memo",
    actionType: "waiting",
  },
  {
    workspace: "Meridian Education Rollout",
    submittedOn: "11 Apr 2026",
    status: "Ready for rollout",
    actionLabel: "Open launch brief",
    actionType: "primary",
  },
];

const statusStyleMap = {
  "Ready for rollout": { background: "#D1FAE5", color: "#065F46" },
  "Needs compliance review": { background: "#FEF3C7", color: "#92400E" },
  "Paused by audit": { background: "#FEE2E2", color: "#991B1B" },
};

const PartnerLaunchDesk = () => {
  const [activeKey, setActiveKey] = useState("launch");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    programTitle: "",
    marketCluster: "",
    operationsEmail: "",
    launchWindow: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="launch-shell">
      <Helmet>
        <title>Partner Launch Desk | VitalCode</title>
      </Helmet>

      <style>{`
        .launch-shell {
          min-height: 100vh;
          background: linear-gradient(135deg, #E8F5F0 0%, #EAF4F4 40%, #E0EFF5 70%, #E8F0F8 100%);
          font-family: system-ui, -apple-system, Inter, sans-serif;
          color: #1A2332;
        }

        .launch-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 260px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .launch-sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 20px 14px;
        }

        .launch-brand {
          color: #1D9E75;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .launch-verified {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid #D1FAE5;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 12px;
          color: #065F46;
          font-weight: 500;
          width: fit-content;
        }

        .launch-nav-list {
          margin-top: 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .launch-nav-item {
          width: 100%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          color: #2C3A4A;
          text-align: left;
          cursor: pointer;
          transition: background 180ms ease, color 180ms ease;
        }

        .launch-nav-item svg {
          width: 20px;
          height: 20px;
          color: #1D9E75;
        }

        .launch-nav-item:hover {
          background: #F0FDF9;
        }

        .launch-nav-item.active {
          background: #1D9E75;
          color: #FFFFFF;
          font-weight: 600;
        }

        .launch-nav-item.active svg {
          color: #FFFFFF;
        }

        .launch-sidebar-bottom {
          margin-top: auto;
          border-top: 1px solid #E8EDF1;
          padding-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .launch-logout {
          color: #EF4444;
          font-weight: 500;
        }

        .launch-logout svg {
          color: #EF4444;
        }

        .launch-main {
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .launch-topbar {
          height: 64px;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .launch-topbar-title {
          font-size: 30px;
          font-weight: 700;
          color: #1A2332;
          margin: 0;
          line-height: 1;
        }

        .launch-right-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .launch-language-pill {
          border: 1px solid #E2E8F0;
          border-radius: 999px;
          padding: 6px 14px;
          background: #FFFFFF;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .launch-bell-wrap {
          position: relative;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .launch-bell-wrap svg {
          width: 22px;
          height: 22px;
          color: #374151;
        }

        .launch-bell-badge {
          position: absolute;
          top: -5px;
          right: -8px;
          min-width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #EF4444;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .launch-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1D9E75;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 600;
        }

        .launch-content {
          padding: 32px;
        }

        .launch-page-header {
          margin-bottom: 4px;
        }

        .launch-page-header h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #1A2332;
          line-height: 1.25;
        }

        .launch-page-header p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #6B7280;
        }

        .launch-card {
          background: rgba(255, 255, 255, 0.75);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.6);
          padding: 28px 32px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin-bottom: 20px;
        }

        .launch-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .launch-field {
          display: flex;
          flex-direction: column;
        }

        .launch-field label {
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .launch-input {
          height: 52px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 0 16px;
          font-size: 14px;
          color: #1A2332;
          font-family: system-ui, -apple-system, Inter, sans-serif;
        }

        .launch-input::placeholder {
          color: #9CA3AF;
        }

        .launch-input:focus {
          border-color: #1D9E75;
          box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.12);
          outline: none;
        }

        .launch-primary-btn {
          margin-top: 16px;
          background: #1D9E75;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 180ms ease;
        }

        .launch-primary-btn:hover {
          background: #179065;
        }

        .launch-primary-btn:active {
          transform: scale(0.98);
        }

        .launch-helper {
          margin-top: 8px;
          font-size: 13px;
          color: #1D9E75;
        }

        .launch-table-scroll {
          overflow-x: auto;
          margin: 0 -32px -28px;
        }

        .launch-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
        }

        .launch-table thead tr {
          background: rgba(248, 250, 252, 0.8);
          border-bottom: 1px solid #F1F5F9;
        }

        .launch-table th {
          padding: 16px 24px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-align: left;
        }

        .launch-table td {
          padding: 18px 24px;
          border-bottom: 1px solid #F8FAFC;
          font-size: 14px;
        }

        .launch-col-main {
          color: #1A2332;
          font-weight: 600;
        }

        .launch-col-secondary {
          color: #6B7280;
          font-weight: 400;
        }

        .launch-status-pill {
          border-radius: 999px;
          border: none;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          display: inline-block;
          white-space: nowrap;
        }

        .launch-action-primary {
          color: #1D9E75;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          background: transparent;
          border: none;
          padding: 0;
          font-size: 14px;
        }

        .launch-action-primary:hover {
          text-decoration: underline;
        }

        .launch-action-waiting {
          color: #9CA3AF;
          font-weight: 400;
          font-style: italic;
        }

        .launch-mobile-toggle {
          display: none;
          width: 36px;
          height: 36px;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          background: #FFFFFF;
          align-items: center;
          justify-content: center;
          color: #374151;
          margin-right: 12px;
        }

        .launch-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.25);
          z-index: 40;
          display: none;
        }

        @media (max-width: 1024px) {
          .launch-mobile-toggle {
            display: inline-flex;
          }

          .launch-sidebar {
            transform: translateX(-100%);
            transition: transform 220ms ease;
          }

          .launch-sidebar.open {
            transform: translateX(0%);
          }

          .launch-overlay.show {
            display: block;
          }

          .launch-main {
            margin-left: 0;
          }

          .launch-topbar {
            padding: 0 16px;
          }
        }

        @media (max-width: 768px) {
          .launch-topbar-title {
            font-size: 24px;
          }

          .launch-content {
            padding: 20px;
          }

          .launch-form-grid {
            grid-template-columns: 1fr;
          }

          .launch-language-pill {
            padding: 6px 10px;
          }

          .launch-right-actions {
            gap: 10px;
          }
        }
      `}</style>

      <aside className={`launch-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="launch-sidebar-inner">
          <div>
            <h1 className="launch-brand">AstraFlow</h1>
            <div className="launch-verified">
              <ShieldCheck size={16} />
              <span>Security Verified</span>
            </div>
          </div>

          <nav className="launch-nav-list">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  className={`launch-nav-item ${isActive ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="launch-sidebar-bottom">
            <button type="button" className="launch-nav-item">
              <Settings />
              <span>Preferences</span>
            </button>
            <button type="button" className="launch-nav-item launch-logout">
              <LogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        className={`launch-overlay ${mobileSidebarOpen ? "show" : ""}`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-label="Close sidebar"
      />

      <div className="launch-main">
        <header className="launch-topbar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="launch-mobile-toggle"
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className="launch-topbar-title">Launch Coordination</h2>
          </div>

          <div className="launch-right-actions">
            <button type="button" className="launch-language-pill">
              <span>ENG</span>
            </button>

            <button type="button" className="launch-bell-wrap" aria-label="Notifications">
              <Bell />
              <span className="launch-bell-badge">4</span>
            </button>

            <span className="launch-avatar">AL</span>
          </div>
        </header>

        <main className="launch-content">
          <section className="launch-page-header" style={{ marginBottom: 24 }}>
            <h2>Channel Intake Form</h2>
            <p>Register external partner launches and route each submission into the review queue.</p>
          </section>

          <section className="launch-card">
            <form onSubmit={handleSubmit}>
              <div className="launch-form-grid">
                <div className="launch-field">
                  <label htmlFor="programTitle">Program Title</label>
                  <input
                    id="programTitle"
                    name="programTitle"
                    className="launch-input"
                    placeholder="Enter rollout program title"
                    value={formData.programTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="launch-field">
                  <label htmlFor="marketCluster">Market Cluster</label>
                  <input
                    id="marketCluster"
                    name="marketCluster"
                    className="launch-input"
                    placeholder="Enter region or market cluster"
                    value={formData.marketCluster}
                    onChange={handleChange}
                  />
                </div>

                <div className="launch-field">
                  <label htmlFor="operationsEmail">Operations Lead Email</label>
                  <input
                    id="operationsEmail"
                    name="operationsEmail"
                    className="launch-input"
                    placeholder="name@company.com"
                    value={formData.operationsEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="launch-field">
                  <label htmlFor="launchWindow">Target Launch Window</label>
                  <input
                    id="launchWindow"
                    name="launchWindow"
                    className="launch-input"
                    placeholder="e.g. Q3 2026"
                    value={formData.launchWindow}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="launch-primary-btn">
                Submit for Review
              </button>

              <p className="launch-helper">Entries typically appear in the triage board within two minutes.</p>
            </form>
          </section>

          <section className="launch-card">
            <div className="launch-table-scroll">
              <table className="launch-table">
                <thead>
                  <tr>
                    <th scope="col">Workspace</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Decision State</th>
                    <th scope="col">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {queueRows.map((row) => {
                    const badgeStyle = statusStyleMap[row.status] || statusStyleMap["Needs compliance review"];
                    return (
                      <tr key={`${row.workspace}-${row.submittedOn}`}>
                        <td className="launch-col-main">{row.workspace}</td>
                        <td className="launch-col-secondary">{row.submittedOn}</td>
                        <td>
                          <span className="launch-status-pill" style={badgeStyle}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          {row.actionType === "primary" ? (
                            <button type="button" className="launch-action-primary">
                              {row.actionLabel}
                            </button>
                          ) : (
                            <span className="launch-action-waiting">{row.actionLabel}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="launch-card">
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#1A2332",
              }}
            >
              Review State Meanings
            </h3>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6B7280" }}>
              Ready for rollout: all checks complete and launch can proceed immediately.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "#6B7280" }}>
              Needs compliance review: submission requires policy validation before scheduling.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: "#6B7280" }}>
              Paused by audit: rollout is held until audit blockers are cleared.
            </p>
            <div
              style={{
                marginTop: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#1D9E75",
                fontWeight: 500,
              }}
            >
              <CircleCheckBig size={16} />
              <span>Use the follow-up column to move each workspace to the next checkpoint.</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PartnerLaunchDesk;
