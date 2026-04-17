import { useMemo, useState } from 'react'
import {
  LuBell,
  LuBadgeCheck,
  LuClipboardCheck,
  LuLayoutGrid,
  LuLayoutDashboard,
  LuList,
  LuMoonStar,
  LuPill,
  LuSettings,
  LuShieldCheck,
  LuSiren,
  LuStore,
  LuSun,
} from 'react-icons/lu'

const PATIENT_DASHBOARD_STYLES = {"value":"@import url(\u0027https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700\u0026family=Space+Grotesk:wght@500;700\u0026display=swap\u0027);\r\n\r\n.pt-page {\r\n  --pt-bg-a: #e7f7f2;\r\n  --pt-bg-b: #e9f0ff;\r\n  --pt-bg-c: #f5fbff;\r\n  --pt-ink: #10243a;\r\n  --pt-muted: #4d6780;\r\n  --pt-border: rgba(16, 36, 58, 0.12);\r\n  --pt-brand: #0f766e;\r\n  --pt-brand-strong: #0b5f58;\r\n  --pt-surface: rgba(255, 255, 255, 0.72);\r\n  --pt-shadow: 0 24px 50px rgba(10, 45, 74, 0.14);\r\n  position: relative;\r\n  min-height: 100vh;\r\n  padding: 0;\r\n  background:\r\n    radial-gradient(circle at 15% 20%, #c7f4e8 0%, transparent 32%),\r\n    radial-gradient(circle at 82% 10%, #c3dcff 0%, transparent 28%),\r\n    linear-gradient(135deg, var(--pt-bg-a), var(--pt-bg-b) 52%, var(--pt-bg-c));\r\n  color: var(--pt-ink);\r\n  overflow-x: hidden;\r\n  font-family: \u0027Manrope\u0027, \u0027Segoe UI\u0027, sans-serif;\r\n}\r\n\r\n.pt-page.is-dark {\r\n  --pt-bg-a: #0d1628;\r\n  --pt-bg-b: #141d35;\r\n  --pt-bg-c: #0f2230;\r\n  --pt-ink: #e6f0ff;\r\n  --pt-muted: #9cb2d1;\r\n  --pt-border: rgba(183, 204, 236, 0.2);\r\n  --pt-surface: rgba(20, 31, 50, 0.8);\r\n}\r\n\r\n.pt-shell {\r\n  max-width: none;\r\n  margin: 0;\r\n  min-height: 100vh;\r\n  position: relative;\r\n  z-index: 1;\r\n}\r\n\r\n.pt-sidebar {\r\n  border-radius: 0 1.1rem 1.1rem 0;\r\n  border: 1px solid var(--pt-border);\r\n  background: rgba(255, 255, 255, 0.76);\r\n  backdrop-filter: blur(14px);\r\n  box-shadow: 0 16px 32px rgba(9, 37, 63, 0.11);\r\n  padding: 0.9rem;\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 0.8rem;\r\n  position: fixed;\r\n  left: 0;\r\n  top: 0;\r\n  bottom: 0;\r\n  width: 260px;\r\n  height: 100vh;\r\n  min-height: 100vh;\r\n  overflow-y: auto;\r\n  z-index: 10;\r\n}\r\n\r\n.pt-page.is-dark .pt-sidebar {\r\n  background: rgba(20, 31, 50, 0.82);\r\n  border-color: rgba(183, 204, 236, 0.2);\r\n}\r\n\r\n.pt-sidebar-header {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.7rem;\r\n  padding: 0.25rem;\r\n}\r\n\r\n.pt-sidebar-nav {\r\n  display: grid;\r\n  gap: 0.45rem;\r\n}\r\n\r\n.pt-nav-item {\r\n  border: 1px solid transparent;\r\n  border-radius: 0.8rem;\r\n  background: transparent;\r\n  color: #39566f;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.62rem;\r\n  width: 100%;\r\n  padding: 0.62rem 0.68rem;\r\n  font-weight: 700;\r\n  font-size: 0.83rem;\r\n  cursor: pointer;\r\n  transition: all 0.22s ease;\r\n}\r\n\r\n.pt-nav-item:hover {\r\n  background: rgba(20, 184, 166, 0.11);\r\n  border-color: rgba(16, 130, 115, 0.14);\r\n  color: #0f5f56;\r\n}\r\n\r\n.pt-nav-item.is-active {\r\n  background: linear-gradient(135deg, #0f766e, #0ea5e9);\r\n  color: #eefcfe;\r\n  box-shadow: 0 10px 20px rgba(14, 116, 110, 0.24);\r\n}\r\n\r\n.pt-page.is-dark .pt-nav-item {\r\n  color: #c3d5ee;\r\n}\r\n\r\n.pt-page.is-dark .pt-nav-item:hover {\r\n  background: rgba(51, 87, 129, 0.42);\r\n  border-color: rgba(143, 173, 219, 0.32);\r\n  color: #e6f0ff;\r\n}\r\n\r\n.pt-nav-icon {\r\n  width: 1.2rem;\r\n  height: 1.2rem;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n.pt-nav-icon svg {\r\n  width: 1rem;\r\n  height: 1rem;\r\n}\r\n\r\n.pt-sidebar-footer {\r\n  margin-top: auto;\r\n  border-radius: 0.9rem;\r\n  border: 1px solid rgba(9, 77, 69, 0.16);\r\n  padding: 0.7rem;\r\n  background: linear-gradient(140deg, rgba(15, 118, 110, 0.14), rgba(14, 165, 233, 0.12));\r\n}\r\n\r\n.pt-page.is-dark .pt-sidebar-footer {\r\n  background: linear-gradient(140deg, rgba(40, 89, 111, 0.34), rgba(34, 71, 112, 0.32));\r\n  border-color: rgba(152, 182, 222, 0.24);\r\n}\r\n\r\n.pt-page.is-dark .pt-sidebar-footer p,\r\n.pt-page.is-dark .pt-sidebar-footer strong {\r\n  color: #cfe3ff;\r\n}\r\n\r\n.pt-sidebar-footer p,\r\n.pt-sidebar-footer strong {\r\n  margin: 0;\r\n}\r\n\r\n.pt-sidebar-footer p {\r\n  font-size: 0.71rem;\r\n  color: #1f6a76;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n}\r\n\r\n.pt-sidebar-footer strong {\r\n  display: block;\r\n  margin-top: 0.2rem;\r\n  font-size: 0.85rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-content {\r\n  min-width: 0;\r\n  margin-left: 260px;\r\n  padding: 1.05rem 1.1rem 1.2rem 0.9rem;\r\n}\r\n\r\n.pt-command-deck {\r\n  display: block;\r\n}\r\n\r\n.pt-command-primary {\r\n  border-radius: 1rem;\r\n  border: 1px solid rgba(99, 112, 168, 0.2);\r\n  background: linear-gradient(135deg, rgba(226, 233, 255, 0.92), rgba(233, 245, 255, 0.9));\r\n  backdrop-filter: blur(14px);\r\n  box-shadow: 0 14px 28px rgba(9, 37, 63, 0.1);\r\n  padding: 1rem 1.1rem;\r\n  display: block;\r\n  position: relative;\r\n  overflow: hidden;\r\n}\r\n\r\n.pt-command-primary::after {\r\n  content: \u0027\u0027;\r\n  position: absolute;\r\n  right: -1.2rem;\r\n  bottom: -1.2rem;\r\n  width: 6.5rem;\r\n  height: 6.5rem;\r\n  border-radius: 999px;\r\n  background: radial-gradient(circle, rgba(126, 192, 214, 0.38) 0%, rgba(126, 192, 214, 0) 68%);\r\n}\r\n\r\n.pt-command-left {\r\n  position: relative;\r\n  z-index: 1;\r\n}\r\n\r\n.pt-greet-label {\r\n  margin: 0;\r\n  color: #56679f;\r\n  font-size: 0.86rem;\r\n  font-weight: 700;\r\n}\r\n\r\n.pt-command-left h3 {\r\n  margin: 0.2rem 0 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-size: clamp(1.4rem, 2.4vw, 1.95rem);\r\n  letter-spacing: -0.01em;\r\n  color: #273666;\r\n}\r\n\r\n.pt-command-left h3 span {\r\n  color: #4b46c9;\r\n}\r\n\r\n.pt-orb {\r\n  position: absolute;\r\n  border-radius: 999px;\r\n  filter: blur(80px);\r\n  pointer-events: none;\r\n  opacity: 0.55;\r\n  z-index: 0;\r\n}\r\n\r\n.pt-orb-1 {\r\n  width: 20rem;\r\n  height: 20rem;\r\n  left: -5rem;\r\n  top: 12rem;\r\n  background: #38bdf8;\r\n  animation: pt-float 12s ease-in-out infinite alternate;\r\n}\r\n\r\n.pt-orb-2 {\r\n  width: 26rem;\r\n  height: 26rem;\r\n  right: -8rem;\r\n  top: 8rem;\r\n  background: #2dd4bf;\r\n  animation: pt-float 15s ease-in-out infinite alternate-reverse;\r\n}\r\n\r\n.pt-grid-noise {\r\n  position: absolute;\r\n  inset: 0;\r\n  background-image:\r\n    linear-gradient(rgba(16, 36, 58, 0.04) 1px, transparent 1px),\r\n    linear-gradient(90deg, rgba(16, 36, 58, 0.04) 1px, transparent 1px);\r\n  background-size: 26px 26px;\r\n  mask-image: radial-gradient(circle at center, black 20%, transparent 75%);\r\n  z-index: 0;\r\n  pointer-events: none;\r\n}\r\n\r\n.pt-topbar,\r\n.pt-main {\r\n  position: relative;\r\n  z-index: 1;\r\n}\r\n\r\n.pt-topbar {\r\n  padding: 0.75rem 1rem;\r\n  margin-bottom: 0.9rem;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.8rem;\r\n  border-radius: 0.95rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.1);\r\n  background: rgba(255, 255, 255, 0.88);\r\n  box-shadow: 0 10px 24px rgba(9, 37, 63, 0.08);\r\n  position: relative;\r\n  overflow: visible;\r\n}\r\n\r\n.pt-page.is-dark .pt-topbar {\r\n  background: rgba(20, 31, 50, 0.86);\r\n  border-color: rgba(183, 204, 236, 0.2);\r\n}\r\n\r\n.pt-topbar h2 {\r\n  margin: 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-size: 1.45rem;\r\n  letter-spacing: -0.02em;\r\n}\r\n\r\n.pt-page.is-dark .pt-topbar h2 {\r\n  color: #e6f0ff;\r\n}\r\n\r\n.pt-topbar-controls {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.5rem;\r\n}\r\n\r\n.pt-control-wrap {\r\n  position: relative;\r\n}\r\n\r\n.pt-theme-chip,\r\n.pt-notify-btn,\r\n.pt-user-chip {\r\n  border: 1px solid rgba(16, 36, 58, 0.12);\r\n  background: #fff;\r\n  color: #344e66;\r\n  border-radius: 999px;\r\n  min-height: 2.2rem;\r\n  cursor: pointer;\r\n  transition: all 0.2s ease;\r\n}\r\n\r\n.pt-theme-chip:hover,\r\n.pt-notify-btn:hover,\r\n.pt-user-chip:hover {\r\n  border-color: rgba(73, 120, 187, 0.4);\r\n}\r\n\r\n.pt-theme-chip.is-active,\r\n.pt-notify-btn.is-active,\r\n.pt-user-chip.is-active {\r\n  background: rgba(79, 70, 229, 0.12);\r\n  border-color: rgba(79, 70, 229, 0.38);\r\n  color: #3f37c9;\r\n}\r\n\r\n.pt-page.is-dark .pt-theme-chip,\r\n.pt-page.is-dark .pt-notify-btn,\r\n.pt-page.is-dark .pt-user-chip {\r\n  background: rgba(39, 55, 84, 0.92);\r\n  color: #dbe8ff;\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n}\r\n\r\n.pt-page.is-dark .pt-theme-chip.is-active,\r\n.pt-page.is-dark .pt-notify-btn.is-active,\r\n.pt-page.is-dark .pt-user-chip.is-active {\r\n  background: rgba(96, 125, 207, 0.26);\r\n  color: #edf5ff;\r\n}\r\n\r\n.pt-theme-chip {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 0.35rem;\r\n  padding: 0.42rem 0.75rem;\r\n  font-size: 0.78rem;\r\n  font-weight: 700;\r\n}\r\n\r\n.pt-theme-chip svg {\r\n  width: 0.88rem;\r\n  height: 0.88rem;\r\n}\r\n\r\n.pt-notify-btn {\r\n  width: 2.2rem;\r\n  height: 2.2rem;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  position: relative;\r\n}\r\n\r\n.pt-notify-btn svg {\r\n  width: 0.94rem;\r\n  height: 0.94rem;\r\n}\r\n\r\n.pt-notify-count {\r\n  position: absolute;\r\n  right: -0.05rem;\r\n  top: -0.18rem;\r\n  width: 1.05rem;\r\n  height: 1.05rem;\r\n  border-radius: 999px;\r\n  display: grid;\r\n  place-items: center;\r\n  background: #ef4444;\r\n  color: #fff;\r\n  font-size: 0.62rem;\r\n  font-weight: 800;\r\n  border: 2px solid #fff;\r\n}\r\n\r\n.pt-user-chip {\r\n  width: 2.2rem;\r\n  height: 2.2rem;\r\n  padding: 0;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n.pt-user-avatar {\r\n  width: 1.8rem;\r\n  height: 1.8rem;\r\n  border-radius: 999px;\r\n  background: linear-gradient(135deg, #0f766e, #0ea5e9);\r\n  color: #fff;\r\n  display: grid;\r\n  place-items: center;\r\n  font-size: 0.66rem;\r\n  font-weight: 800;\r\n}\r\n\r\n.pt-user-avatar.large {\r\n  width: 2.2rem;\r\n  height: 2.2rem;\r\n  font-size: 0.78rem;\r\n}\r\n\r\n.pt-popover {\r\n  position: absolute;\r\n  right: 0;\r\n  top: calc(100% + 0.55rem);\r\n  width: min(22rem, 86vw);\r\n  border-radius: 0.9rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  background: rgba(255, 255, 255, 0.96);\r\n  box-shadow: 0 18px 34px rgba(9, 37, 63, 0.18);\r\n  padding: 0.75rem;\r\n  z-index: 25;\r\n}\r\n\r\n.pt-page.is-dark .pt-popover {\r\n  background: rgba(23, 35, 56, 0.96);\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n}\r\n\r\n.pt-profile-header {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.6rem;\r\n  padding-bottom: 0.55rem;\r\n  border-bottom: 1px solid rgba(16, 36, 58, 0.1);\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-header {\r\n  border-color: rgba(152, 182, 222, 0.22);\r\n}\r\n\r\n.pt-profile-header p {\r\n  margin: 0;\r\n  font-size: 0.85rem;\r\n  font-weight: 800;\r\n}\r\n\r\n.pt-profile-header small {\r\n  color: #667f9a;\r\n  font-size: 0.72rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-header p {\r\n  color: #e6f0ff;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-header small {\r\n  color: #b4c8e4;\r\n}\r\n\r\n.pt-profile-list {\r\n  margin: 0.65rem 0 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  display: grid;\r\n  gap: 0.45rem;\r\n}\r\n\r\n.pt-profile-list li {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.6rem;\r\n  border-radius: 0.65rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.08);\r\n  padding: 0.45rem 0.55rem;\r\n  font-size: 0.74rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-list li {\r\n  border-color: rgba(152, 182, 222, 0.2);\r\n}\r\n\r\n.pt-profile-list span {\r\n  color: #5e7792;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-list span {\r\n  color: #abc1dd;\r\n}\r\n\r\n.pt-profile-list strong {\r\n  font-size: 0.73rem;\r\n  text-align: right;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-list strong {\r\n  color: #e8f2ff;\r\n}\r\n\r\n.pt-profile-edit-btn {\r\n  margin-top: 0.65rem;\r\n  width: 100%;\r\n  border: 1px solid rgba(79, 70, 229, 0.35);\r\n  border-radius: 0.68rem;\r\n  background: rgba(79, 70, 229, 0.1);\r\n  color: #3f37c9;\r\n  font-weight: 700;\r\n  font-size: 0.78rem;\r\n  padding: 0.5rem 0.6rem;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-edit-btn {\r\n  background: rgba(96, 125, 207, 0.24);\r\n  color: #e5edff;\r\n  border-color: rgba(152, 182, 222, 0.42);\r\n}\r\n\r\n.pt-brand-wrap {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.8rem;\r\n}\r\n\r\n.pt-brand-mark {\r\n  width: 2.5rem;\r\n  height: 2.5rem;\r\n  border-radius: 0.85rem;\r\n  display: grid;\r\n  place-items: center;\r\n  font-weight: 700;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  color: #f4fffd;\r\n  background: linear-gradient(135deg, #0f766e, #14b8a6);\r\n  box-shadow: 0 8px 24px rgba(15, 118, 110, 0.28);\r\n}\r\n\r\n.pt-brand-name {\r\n  margin: 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-weight: 700;\r\n  font-size: 1.02rem;\r\n}\r\n\r\n.pt-brand-sub {\r\n  margin: 0.06rem 0 0;\r\n  color: var(--pt-muted);\r\n  font-size: 0.82rem;\r\n}\r\n\r\n.pt-topbar-right {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.65rem;\r\n}\r\n\r\n.pt-trust-chip {\r\n  border: 1px solid rgba(8, 66, 59, 0.2);\r\n  border-radius: 999px;\r\n  padding: 0.55rem 0.95rem;\r\n  font-size: 0.8rem;\r\n  font-weight: 600;\r\n  color: #08433d;\r\n  background: rgba(255, 255, 255, 0.62);\r\n  backdrop-filter: blur(10px);\r\n}\r\n\r\n.pt-action-btn {\r\n  border: none;\r\n  border-radius: 0.8rem;\r\n  padding: 0.58rem 0.9rem;\r\n  background: linear-gradient(135deg, var(--pt-brand), #14b8a6);\r\n  color: #fff;\r\n  font-weight: 700;\r\n  font-size: 0.82rem;\r\n  cursor: pointer;\r\n  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;\r\n  box-shadow: 0 10px 18px rgba(14, 116, 110, 0.25);\r\n}\r\n\r\n.pt-action-btn:hover {\r\n  transform: translateY(-1px);\r\n}\r\n\r\n.pt-action-btn:disabled {\r\n  opacity: 0.58;\r\n  cursor: not-allowed;\r\n  transform: none;\r\n}\r\n\r\n.pt-action-btn.secondary {\r\n  background: rgba(16, 36, 58, 0.06);\r\n  color: #083d38;\r\n  border: 1px solid rgba(8, 67, 61, 0.2);\r\n  box-shadow: none;\r\n}\r\n\r\n.pt-main {\r\n  display: grid;\r\n  gap: 1rem;\r\n}\r\n\r\n.pt-card-focus {\r\n  border-color: rgba(79, 70, 229, 0.55);\r\n  box-shadow:\r\n    0 0 0 2px rgba(79, 70, 229, 0.14),\r\n    0 14px 28px rgba(9, 37, 63, 0.11);\r\n}\r\n\r\n.pt-hero-card {\r\n  border: 1px solid var(--pt-border);\r\n  border-radius: 1.3rem;\r\n  background: linear-gradient(130deg, rgba(3, 47, 74, 0.9), rgba(9, 112, 121, 0.83));\r\n  color: #e9f9ff;\r\n  box-shadow: var(--pt-shadow);\r\n  padding: 1.2rem;\r\n  display: grid;\r\n  gap: 1rem;\r\n  grid-template-columns: 1fr 240px;\r\n  overflow: hidden;\r\n  animation: pt-rise 0.7s ease both;\r\n}\r\n\r\n.pt-hero-content h1 {\r\n  margin: 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-size: clamp(1.5rem, 3vw, 2.2rem);\r\n  line-height: 1.08;\r\n  letter-spacing: -0.02em;\r\n}\r\n\r\n.pt-kicker {\r\n  margin: 0 0 0.4rem;\r\n  display: inline-block;\r\n  font-size: 0.75rem;\r\n  font-weight: 700;\r\n  letter-spacing: 0.09em;\r\n  text-transform: uppercase;\r\n  border: 1px solid rgba(255, 255, 255, 0.35);\r\n  border-radius: 999px;\r\n  padding: 0.35rem 0.7rem;\r\n}\r\n\r\n.pt-hero-content p {\r\n  margin: 0.7rem 0 0;\r\n  color: rgba(223, 245, 255, 0.93);\r\n  max-width: 60ch;\r\n}\r\n\r\n.pt-hero-badges {\r\n  margin-top: 0.95rem;\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  gap: 0.45rem;\r\n}\r\n\r\n.pt-hero-badges span {\r\n  font-size: 0.75rem;\r\n  border-radius: 999px;\r\n  padding: 0.34rem 0.7rem;\r\n  background: rgba(255, 255, 255, 0.14);\r\n  border: 1px solid rgba(255, 255, 255, 0.24);\r\n}\r\n\r\n.pt-trust-panel {\r\n  align-self: stretch;\r\n  border-radius: 1rem;\r\n  padding: 1rem;\r\n  background: rgba(255, 255, 255, 0.14);\r\n  border: 1px solid rgba(255, 255, 255, 0.24);\r\n  display: grid;\r\n  align-content: center;\r\n  gap: 0.25rem;\r\n}\r\n\r\n.pt-trust-panel p,\r\n.pt-trust-panel small {\r\n  margin: 0;\r\n}\r\n\r\n.pt-trust-panel h2 {\r\n  margin: 0;\r\n  font-size: 2rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-stats {\r\n  display: grid;\r\n  gap: 0.8rem;\r\n  grid-template-columns: repeat(3, minmax(0, 1fr));\r\n}\r\n\r\n.pt-stat-card,\r\n.pt-card {\r\n  border-radius: 1rem;\r\n  border: 1px solid var(--pt-border);\r\n  background: var(--pt-surface);\r\n  backdrop-filter: blur(15px);\r\n  box-shadow: 0 14px 28px rgba(9, 37, 63, 0.11);\r\n}\r\n\r\n.pt-stat-card {\r\n  padding: 0.9rem 1rem;\r\n}\r\n\r\n.pt-stat-card-button {\r\n  width: 100%;\r\n  text-align: left;\r\n  cursor: pointer;\r\n  appearance: none;\r\n  border: 1px solid var(--pt-border);\r\n  transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease;\r\n}\r\n\r\n.pt-stat-card-button:hover {\r\n  transform: translateY(-1px);\r\n  border-color: rgba(14, 116, 110, 0.34);\r\n  box-shadow: 0 16px 28px rgba(9, 37, 63, 0.14);\r\n}\r\n\r\n.pt-stat-card-button.is-active {\r\n  border-color: rgba(14, 116, 110, 0.46);\r\n  box-shadow:\r\n    0 0 0 2px rgba(20, 184, 166, 0.16),\r\n    0 16px 28px rgba(9, 37, 63, 0.14);\r\n}\r\n\r\n.pt-stat-card-button:focus-visible {\r\n  outline: 2px solid rgba(14, 165, 233, 0.52);\r\n  outline-offset: 2px;\r\n}\r\n\r\n.pt-stat-card p {\r\n  margin: 0;\r\n  color: var(--pt-muted);\r\n  font-size: 0.83rem;\r\n}\r\n\r\n.pt-stat-card strong {\r\n  margin-top: 0.2rem;\r\n  display: block;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-size: 1.7rem;\r\n}\r\n\r\n.pt-stat-card span {\r\n  font-size: 0.77rem;\r\n  color: #5f7a93;\r\n}\r\n\r\n.pt-layout {\r\n  display: grid;\r\n  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);\r\n  gap: 0.9rem;\r\n}\r\n\r\n.pt-layout.single-page {\r\n  grid-template-columns: 1fr;\r\n}\r\n\r\n.pt-col-left,\r\n.pt-col-right {\r\n  display: grid;\r\n  gap: 0.9rem;\r\n}\r\n\r\n.pt-card {\r\n  padding: 1rem;\r\n}\r\n\r\n.pt-card-head {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.6rem;\r\n  margin-bottom: 0.75rem;\r\n}\r\n\r\n.pt-card-head h3 {\r\n  margin: 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n  font-size: 1.02rem;\r\n}\r\n\r\n.pt-card-tag {\r\n  font-size: 0.73rem;\r\n  font-weight: 700;\r\n  border-radius: 999px;\r\n  padding: 0.3rem 0.62rem;\r\n  color: #0a4d46;\r\n  background: rgba(20, 184, 166, 0.14);\r\n  border: 1px solid rgba(10, 97, 88, 0.16);\r\n  white-space: nowrap;\r\n}\r\n\r\n.pt-report-head-actions {\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.45rem;\r\n  flex-wrap: wrap;\r\n  justify-content: flex-end;\r\n}\r\n\r\n.pt-report-view-toggle {\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 0.24rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.12);\r\n  border-radius: 0.62rem;\r\n  padding: 0.18rem;\r\n  background: rgba(255, 255, 255, 0.86);\r\n}\r\n\r\n.pt-report-view-btn {\r\n  border: 1px solid transparent;\r\n  border-radius: 0.48rem;\r\n  background: transparent;\r\n  color: #4a667f;\r\n  font-size: 0.72rem;\r\n  font-weight: 700;\r\n  padding: 0.28rem 0.55rem;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  gap: 0.28rem;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-report-view-btn svg {\r\n  width: 0.78rem;\r\n  height: 0.78rem;\r\n}\r\n\r\n.pt-report-view-btn.is-active {\r\n  background: #2563eb;\r\n  color: #edf4ff;\r\n  border-color: rgba(37, 99, 235, 0.44);\r\n}\r\n\r\n.pt-upload-input {\r\n  display: none;\r\n}\r\n\r\n.pt-upload-btn {\r\n  border: 1px solid rgba(16, 130, 115, 0.3);\r\n  border-radius: 0.6rem;\r\n  padding: 0.32rem 0.62rem;\r\n  font-size: 0.72rem;\r\n  font-weight: 700;\r\n  color: #0a4d46;\r\n  background: rgba(20, 184, 166, 0.12);\r\n  cursor: pointer;\r\n  transition: background 0.2s ease, border-color 0.2s ease;\r\n}\r\n\r\n.pt-upload-btn:hover {\r\n  background: rgba(20, 184, 166, 0.2);\r\n  border-color: rgba(16, 130, 115, 0.48);\r\n}\r\n\r\n.pt-upload-hint {\r\n  margin: 0;\r\n  color: var(--pt-muted);\r\n  font-size: 0.75rem;\r\n}\r\n\r\n.pt-upload-zone {\r\n  position: relative;\r\n  border: 1.5px dashed rgba(16, 92, 84, 0.36);\r\n  background: linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(59, 130, 246, 0.06));\r\n  border-radius: 0.95rem;\r\n  padding: 1rem;\r\n  display: grid;\r\n  gap: 0.28rem;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-upload-zone input {\r\n  position: absolute;\r\n  inset: 0;\r\n  opacity: 0;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-upload-zone strong {\r\n  font-size: 0.9rem;\r\n}\r\n\r\n.pt-upload-zone small {\r\n  color: var(--pt-muted);\r\n}\r\n\r\n.pt-upload-progress {\r\n  margin-top: 0.7rem;\r\n  border-radius: 0.7rem;\r\n  overflow: hidden;\r\n  background: rgba(16, 36, 58, 0.1);\r\n  position: relative;\r\n}\r\n\r\n.pt-upload-progress-fill {\r\n  height: 8px;\r\n  background: linear-gradient(135deg, #10b981, #06b6d4);\r\n  transition: width 0.25s ease;\r\n}\r\n\r\n.pt-upload-progress span {\r\n  display: block;\r\n  font-size: 0.73rem;\r\n  padding: 0.42rem 0.55rem;\r\n  color: #114f47;\r\n}\r\n\r\n.pt-report-table-wrap {\r\n  margin-top: 0.72rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.1);\r\n  border-radius: 0.85rem;\r\n  overflow-x: auto;\r\n  background: rgba(255, 255, 255, 0.7);\r\n}\r\n\r\n.pt-report-table {\r\n  width: 100%;\r\n  min-width: 780px;\r\n  border-collapse: collapse;\r\n}\r\n\r\n.pt-report-grid {\r\n  margin-top: 0.72rem;\r\n  display: grid;\r\n  grid-template-columns: repeat(3, minmax(0, 1fr));\r\n  gap: 0.72rem;\r\n}\r\n\r\n.pt-report-grid-card {\r\n  border: 1px solid rgba(16, 36, 58, 0.1);\r\n  border-radius: 0.85rem;\r\n  background: rgba(255, 255, 255, 0.72);\r\n  padding: 0.65rem;\r\n  display: grid;\r\n  gap: 0.45rem;\r\n  position: relative;\r\n  overflow: hidden;\r\n  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;\r\n  animation: pt-report-card-enter 0.42s ease both;\r\n}\r\n\r\n.pt-report-grid-card::after {\r\n  content: \u0027\u0027;\r\n  position: absolute;\r\n  inset: -35% -45% auto auto;\r\n  width: 10rem;\r\n  height: 10rem;\r\n  border-radius: 999px;\r\n  pointer-events: none;\r\n  background: radial-gradient(circle, rgba(56, 189, 248, 0.26), rgba(56, 189, 248, 0));\r\n  opacity: 0;\r\n  transform: scale(0.85);\r\n  transition: opacity 0.28s ease, transform 0.28s ease;\r\n}\r\n\r\n.pt-report-grid-card:hover {\r\n  transform: translateY(-3px);\r\n  border-color: rgba(14, 116, 110, 0.34);\r\n  box-shadow:\r\n    0 16px 28px rgba(9, 37, 63, 0.16),\r\n    0 0 0 1px rgba(20, 184, 166, 0.16);\r\n}\r\n\r\n.pt-report-grid-card:hover::after {\r\n  opacity: 1;\r\n  transform: scale(1);\r\n  animation: pt-report-glow 1.6s ease-in-out infinite alternate;\r\n}\r\n\r\n.pt-report-grid-head {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 0.55rem;\r\n  align-items: flex-start;\r\n}\r\n\r\n.pt-report-grid-head p {\r\n  margin: 0;\r\n  font-size: 0.82rem;\r\n  font-weight: 700;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-report-grid-head small {\r\n  color: #5a738b;\r\n  font-size: 0.7rem;\r\n}\r\n\r\n.pt-report-grid-meta {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  display: grid;\r\n  gap: 0.26rem;\r\n}\r\n\r\n.pt-report-grid-meta li {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 0.4rem;\r\n  font-size: 0.72rem;\r\n}\r\n\r\n.pt-report-grid-meta span {\r\n  color: #58728a;\r\n}\r\n\r\n.pt-report-grid-meta strong {\r\n  font-size: 0.72rem;\r\n  color: #1e3f58;\r\n  text-align: right;\r\n}\r\n\r\n.pt-report-table th,\r\n.pt-report-table td {\r\n  text-align: left;\r\n  padding: 0.62rem;\r\n  border-bottom: 1px solid rgba(16, 36, 58, 0.08);\r\n  vertical-align: top;\r\n  font-size: 0.78rem;\r\n}\r\n\r\n.pt-report-table tbody tr {\r\n  transition: background 0.22s ease, box-shadow 0.22s ease;\r\n}\r\n\r\n.pt-report-table tbody tr:hover {\r\n  background: linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(37, 99, 235, 0.07));\r\n  box-shadow: inset 0 0 0 1px rgba(20, 184, 166, 0.18);\r\n}\r\n\r\n.pt-report-table th {\r\n  font-size: 0.71rem;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.04em;\r\n  color: #5b7992;\r\n  background: rgba(228, 239, 250, 0.5);\r\n}\r\n\r\n.pt-report-table td p {\r\n  margin: 0;\r\n  font-size: 0.82rem;\r\n  font-weight: 700;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-report-table td small {\r\n  color: #5a738b;\r\n  font-size: 0.71rem;\r\n}\r\n\r\n.pt-report-actions {\r\n  display: flex;\r\n  gap: 0.34rem;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.pt-report-grid-card .pt-report-actions {\r\n  margin-top: 0.08rem;\r\n}\r\n\r\n.pt-table-action-btn {\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  border-radius: 0.5rem;\r\n  background: #fff;\r\n  color: #2f4d67;\r\n  font-size: 0.7rem;\r\n  font-weight: 700;\r\n  padding: 0.28rem 0.48rem;\r\n  cursor: pointer;\r\n  min-height: 1.85rem;\r\n}\r\n\r\n.pt-table-action-btn.view {\r\n  border-color: rgba(37, 99, 235, 0.28);\r\n  color: #0f5a9f;\r\n}\r\n\r\n.pt-table-action-btn.ai {\r\n  border-color: rgba(14, 116, 110, 0.28);\r\n  color: #0e6a60;\r\n}\r\n\r\n.pt-table-action-btn.save {\r\n  border-color: rgba(16, 130, 115, 0.3);\r\n  color: #0a4d46;\r\n}\r\n\r\n.pt-table-action-btn.delete {\r\n  border-color: rgba(239, 68, 68, 0.36);\r\n  color: #9b1c1c;\r\n}\r\n\r\n.pt-status-ai-analysed {\r\n  color: #5b21b6;\r\n  background: rgba(139, 92, 246, 0.18);\r\n}\r\n\r\n.pt-ai-inline-summary {\r\n  margin-top: 0.45rem;\r\n  border: 1px solid rgba(14, 116, 110, 0.22);\r\n  border-radius: 0.65rem;\r\n  background: rgba(220, 252, 244, 0.58);\r\n  padding: 0.48rem 0.52rem;\r\n}\r\n\r\n.pt-ai-inline-head {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.4rem;\r\n}\r\n\r\n.pt-ai-inline-title {\r\n  margin: 0;\r\n  font-size: 0.66rem;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.05em;\r\n  color: #0f5f56;\r\n  font-weight: 700;\r\n}\r\n\r\n.pt-ai-inline-close {\r\n  border: 1px solid rgba(16, 36, 58, 0.16);\r\n  border-radius: 0.45rem;\r\n  background: rgba(255, 255, 255, 0.86);\r\n  color: #38556d;\r\n  width: 1.4rem;\r\n  height: 1.4rem;\r\n  font-size: 0.62rem;\r\n  font-weight: 800;\r\n  line-height: 1;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-ai-inline-summary p {\r\n  margin: 0.2rem 0 0;\r\n  color: #1f4f63;\r\n  font-size: 0.75rem;\r\n}\r\n\r\n.pt-report-viewer-modal {\r\n  width: min(40rem, 95vw);\r\n  border-radius: 0.95rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  background: rgba(255, 255, 255, 0.98);\r\n  box-shadow: 0 28px 50px rgba(3, 22, 44, 0.3);\r\n  padding: 0.9rem;\r\n}\r\n\r\n.pt-report-viewer-head {\r\n  display: flex;\r\n  align-items: flex-start;\r\n  justify-content: space-between;\r\n  gap: 0.8rem;\r\n}\r\n\r\n.pt-report-viewer-head h3 {\r\n  margin: 0;\r\n  font-size: 1rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-report-viewer-head p {\r\n  margin: 0.2rem 0 0;\r\n  font-size: 0.76rem;\r\n  color: #5a738b;\r\n}\r\n\r\n.pt-report-viewer-close {\r\n  border: 1px solid rgba(16, 36, 58, 0.16);\r\n  border-radius: 0.52rem;\r\n  background: rgba(255, 255, 255, 0.82);\r\n  color: #38556d;\r\n  width: 2rem;\r\n  height: 2rem;\r\n  font-size: 0.76rem;\r\n  font-weight: 800;\r\n  line-height: 1;\r\n  display: inline-flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-report-viewer-body {\r\n  margin-top: 0.72rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.1);\r\n  border-radius: 0.8rem;\r\n  background: rgba(246, 250, 255, 0.9);\r\n  padding: 0.72rem;\r\n}\r\n\r\n.pt-report-viewer-body p {\r\n  margin: 0;\r\n  font-size: 0.82rem;\r\n  color: #2b4d66;\r\n}\r\n\r\n.pt-report-viewer-body p + p {\r\n  margin-top: 0.42rem;\r\n}\r\n\r\n.pt-report-list,\r\n.pt-medicine-list,\r\n.pt-timeline,\r\n.pt-notification-list {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n}\r\n\r\n.pt-report-list {\r\n  margin-top: 0.8rem;\r\n  display: grid;\r\n  gap: 0.6rem;\r\n}\r\n\r\n.pt-report-row {\r\n  border: 1px solid rgba(16, 36, 58, 0.08);\r\n  background: rgba(255, 255, 255, 0.72);\r\n  border-radius: 0.85rem;\r\n  padding: 0.72rem;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 0.8rem;\r\n  align-items: center;\r\n}\r\n\r\n.pt-report-row \u003e div {\r\n  min-width: 0;\r\n}\r\n\r\n.pt-report-row p {\r\n  margin: 0;\r\n  font-size: 0.87rem;\r\n  font-weight: 700;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-report-row small {\r\n  color: #5a738b;\r\n  font-size: 0.72rem;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-report-meta {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: flex-end;\r\n  gap: 0.32rem;\r\n}\r\n\r\n.pt-status-pill,\r\n.pt-safe-pill {\r\n  border-radius: 999px;\r\n  font-size: 0.7rem;\r\n  font-weight: 700;\r\n  padding: 0.25rem 0.55rem;\r\n}\r\n\r\n.pt-safe-pill {\r\n  color: #0e6a60;\r\n  background: rgba(20, 184, 166, 0.14);\r\n}\r\n\r\n.pt-status-uploaded {\r\n  color: #0f5a9f;\r\n  background: rgba(37, 99, 235, 0.14);\r\n}\r\n\r\n.pt-status-under-review {\r\n  color: #94570b;\r\n  background: rgba(245, 158, 11, 0.18);\r\n}\r\n\r\n.pt-status-reviewed,\r\n.pt-status-issued {\r\n  color: #0f6c56;\r\n  background: rgba(16, 185, 129, 0.19);\r\n}\r\n\r\n.pt-status-pending,\r\n.pt-status-partially-issued {\r\n  color: #0b5f58;\r\n  background: rgba(20, 184, 166, 0.16);\r\n}\r\n\r\n.pt-status-expired {\r\n  color: #9b1c1c;\r\n  background: rgba(239, 68, 68, 0.18);\r\n}\r\n\r\n.pt-prescription-list {\r\n  display: grid;\r\n  gap: 0.7rem;\r\n}\r\n\r\n.pt-prescription-card {\r\n  border-radius: 0.95rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.11);\r\n  background: rgba(255, 255, 255, 0.84);\r\n  padding: 0.82rem;\r\n}\r\n\r\n.pt-prescription-head {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 0.7rem;\r\n  align-items: flex-start;\r\n}\r\n\r\n.pt-prescription-head h4 {\r\n  margin: 0;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-prescription-head p {\r\n  margin: 0.2rem 0 0;\r\n  font-size: 0.77rem;\r\n  color: #557189;\r\n}\r\n\r\n.pt-medicine-list {\r\n  margin-top: 0.6rem;\r\n  display: grid;\r\n  gap: 0.42rem;\r\n}\r\n\r\n.pt-medicine-list li {\r\n  border-left: 2px solid rgba(14, 116, 110, 0.35);\r\n  padding-left: 0.55rem;\r\n  font-size: 0.82rem;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-verify-grid {\r\n  margin-top: 0.72rem;\r\n  display: grid;\r\n  grid-template-columns: 102px minmax(0, 1fr);\r\n  gap: 0.65rem;\r\n}\r\n\r\n.pt-qr-box,\r\n.pt-signature-box {\r\n  border-radius: 0.7rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.12);\r\n  background: rgba(255, 255, 255, 0.72);\r\n  padding: 0.56rem;\r\n}\r\n\r\n.pt-qr-grid {\r\n  width: 100%;\r\n  aspect-ratio: 1 / 1;\r\n  border-radius: 0.45rem;\r\n  background:\r\n    linear-gradient(90deg, #0c2e4b 10px, transparent 10px) 0 0 / 20px 20px,\r\n    linear-gradient(#0c2e4b 10px, transparent 10px) 0 0 / 20px 20px,\r\n    linear-gradient(135deg, #0ea5e9, #0f766e);\r\n}\r\n\r\n.pt-qr-box span {\r\n  display: block;\r\n  margin-top: 0.35rem;\r\n  font-size: 0.66rem;\r\n  text-align: center;\r\n  color: #4c667f;\r\n}\r\n\r\n.pt-signature-box p,\r\n.pt-signature-box small {\r\n  margin: 0;\r\n}\r\n\r\n.pt-signature-box p {\r\n  font-size: 0.73rem;\r\n  color: #0b665d;\r\n}\r\n\r\n.pt-signature-box strong {\r\n  font-size: 0.79rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-signature-box small {\r\n  display: block;\r\n  margin-top: 0.25rem;\r\n  color: #587289;\r\n  font-size: 0.7rem;\r\n}\r\n\r\n.pt-prescription-foot {\r\n  margin-top: 0.72rem;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  gap: 0.6rem;\r\n}\r\n\r\n.pt-prescription-foot .pt-action-btn {\r\n  white-space: normal;\r\n  text-align: left;\r\n}\r\n\r\n.pt-prescription-foot p {\r\n  margin: 0;\r\n  color: #506c85;\r\n  font-size: 0.8rem;\r\n}\r\n\r\n.pt-ai-summary {\r\n  border-radius: 0.86rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.11);\r\n  background: rgba(255, 255, 255, 0.75);\r\n  padding: 0.78rem;\r\n}\r\n\r\n.pt-ai-label {\r\n  margin: 0;\r\n  font-size: 0.72rem;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.06em;\r\n  color: #64829b;\r\n}\r\n\r\n.pt-ai-jargon,\r\n.pt-ai-plain {\r\n  margin: 0.3rem 0 0.8rem;\r\n  font-size: 0.83rem;\r\n}\r\n\r\n.pt-ai-plain {\r\n  color: #0e5f56;\r\n  margin-bottom: 0;\r\n}\r\n\r\n.pt-voice-controls {\r\n  margin-top: 0.72rem;\r\n  display: flex;\r\n  align-items: center;\r\n  gap: 0.55rem;\r\n  flex-wrap: wrap;\r\n}\r\n\r\n.pt-voice-controls label {\r\n  font-size: 0.76rem;\r\n  color: #5b7992;\r\n}\r\n\r\n.pt-voice-controls select {\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  border-radius: 0.62rem;\r\n  padding: 0.38rem 0.5rem;\r\n  background: rgba(255, 255, 255, 0.74);\r\n}\r\n\r\n.pt-voice-wave {\r\n  margin-top: 0.8rem;\r\n  display: flex;\r\n  gap: 0.35rem;\r\n  height: 1.8rem;\r\n  align-items: flex-end;\r\n}\r\n\r\n.pt-voice-wave span {\r\n  flex: 1;\r\n  border-radius: 999px;\r\n  background: linear-gradient(180deg, #14b8a6, #0ea5e9);\r\n  height: 18%;\r\n}\r\n\r\n.pt-voice-wave.is-playing span {\r\n  animation: pt-wave 0.9s ease-in-out infinite;\r\n}\r\n\r\n.pt-voice-wave.is-playing span:nth-child(2) {\r\n  animation-delay: 0.08s;\r\n}\r\n\r\n.pt-voice-wave.is-playing span:nth-child(3) {\r\n  animation-delay: 0.14s;\r\n}\r\n\r\n.pt-voice-wave.is-playing span:nth-child(4) {\r\n  animation-delay: 0.2s;\r\n}\r\n\r\n.pt-voice-wave.is-playing span:nth-child(5) {\r\n  animation-delay: 0.28s;\r\n}\r\n\r\n.pt-timeline,\r\n.pt-notification-list {\r\n  display: grid;\r\n  gap: 0.6rem;\r\n}\r\n\r\n.pt-timeline li,\r\n.pt-notification-list li {\r\n  border: 1px solid rgba(16, 36, 58, 0.09);\r\n  border-radius: 0.8rem;\r\n  background: rgba(255, 255, 255, 0.75);\r\n  padding: 0.65rem;\r\n}\r\n\r\n.pt-timeline strong {\r\n  display: block;\r\n  font-size: 0.82rem;\r\n  overflow-wrap: anywhere;\r\n}\r\n\r\n.pt-timeline span,\r\n.pt-notification-list span,\r\n.pt-notification-list small {\r\n  color: #5f7c94;\r\n  font-size: 0.74rem;\r\n}\r\n\r\n.pt-notification-list li {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 0.7rem;\r\n}\r\n\r\n.pt-notification-list p {\r\n  margin: 0;\r\n  font-size: 0.8rem;\r\n  font-weight: 700;\r\n}\r\n\r\n.pt-modal-backdrop {\r\n  position: fixed;\r\n  inset: 0;\r\n  background: rgba(7, 17, 34, 0.5);\r\n  backdrop-filter: blur(3px);\r\n  display: grid;\r\n  place-items: center;\r\n  padding: 1rem;\r\n  z-index: 50;\r\n}\r\n\r\n.pt-profile-modal {\r\n  width: min(44rem, 95vw);\r\n  border-radius: 1rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  background: rgba(255, 255, 255, 0.98);\r\n  box-shadow: 0 30px 55px rgba(3, 22, 44, 0.3);\r\n  padding: 1rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-modal {\r\n  background: rgba(18, 31, 50, 0.98);\r\n  border-color: rgba(152, 182, 222, 0.34);\r\n}\r\n\r\n.pt-profile-modal-head {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: space-between;\r\n  gap: 0.8rem;\r\n  margin-bottom: 0.8rem;\r\n}\r\n\r\n.pt-profile-summary {\r\n  display: grid;\r\n  grid-template-columns: repeat(3, minmax(0, 1fr));\r\n  gap: 0.6rem;\r\n  margin-bottom: 0.75rem;\r\n}\r\n\r\n.pt-profile-summary article {\r\n  border-radius: 0.72rem;\r\n  border: 1px solid rgba(16, 36, 58, 0.12);\r\n  background: rgba(244, 248, 255, 0.9);\r\n  padding: 0.52rem 0.6rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-summary article {\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n  background: rgba(32, 46, 70, 0.9);\r\n}\r\n\r\n.pt-profile-summary span {\r\n  display: block;\r\n  color: #5c7693;\r\n  font-size: 0.68rem;\r\n  font-weight: 700;\r\n  text-transform: uppercase;\r\n  letter-spacing: 0.04em;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-summary span {\r\n  color: #b2c7e3;\r\n}\r\n\r\n.pt-profile-summary strong {\r\n  display: block;\r\n  margin-top: 0.14rem;\r\n  font-size: 0.86rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-summary strong {\r\n  color: #edf5ff;\r\n}\r\n\r\n.pt-profile-modal-head h3 {\r\n  margin: 0;\r\n  font-size: 1.08rem;\r\n  font-family: \u0027Space Grotesk\u0027, sans-serif;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-modal-head h3 {\r\n  color: #e6f0ff;\r\n}\r\n\r\n.pt-profile-close {\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  border-radius: 0.62rem;\r\n  background: rgba(255, 255, 255, 0.7);\r\n  color: #3b546f;\r\n  font-size: 0.78rem;\r\n  font-weight: 700;\r\n  padding: 0.42rem 0.62rem;\r\n  cursor: pointer;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-close {\r\n  background: rgba(39, 55, 84, 0.92);\r\n  color: #dbe8ff;\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n}\r\n\r\n.pt-profile-grid {\r\n  display: grid;\r\n  grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  gap: 0.65rem;\r\n}\r\n\r\n.pt-profile-grid label {\r\n  display: grid;\r\n  gap: 0.34rem;\r\n  font-size: 0.76rem;\r\n  font-weight: 700;\r\n  color: #49647e;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-grid label {\r\n  color: #c3d5ee;\r\n}\r\n\r\n.pt-profile-grid input,\r\n.pt-profile-grid textarea {\r\n  border: 1px solid rgba(16, 36, 58, 0.14);\r\n  border-radius: 0.68rem;\r\n  background: rgba(255, 255, 255, 0.82);\r\n  color: #1a314b;\r\n  padding: 0.5rem 0.62rem;\r\n  font-size: 0.82rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-profile-grid input,\r\n.pt-page.is-dark .pt-profile-grid textarea {\r\n  background: rgba(39, 55, 84, 0.9);\r\n  color: #e6f0ff;\r\n  border-color: rgba(152, 182, 222, 0.32);\r\n}\r\n\r\n.pt-profile-grid .full-width {\r\n  grid-column: 1 / -1;\r\n}\r\n\r\n.pt-profile-actions {\r\n  margin-top: 0.82rem;\r\n  display: flex;\r\n  justify-content: flex-end;\r\n  gap: 0.55rem;\r\n}\r\n\r\n.pt-page.is-dark .pt-command-primary,\r\n.pt-page.is-dark .pt-card,\r\n.pt-page.is-dark .pt-stat-card,\r\n.pt-page.is-dark .pt-report-row,\r\n.pt-page.is-dark .pt-prescription-card,\r\n.pt-page.is-dark .pt-qr-box,\r\n.pt-page.is-dark .pt-signature-box,\r\n.pt-page.is-dark .pt-ai-summary,\r\n.pt-page.is-dark .pt-timeline li,\r\n.pt-page.is-dark .pt-notification-list li {\r\n  background: rgba(20, 31, 50, 0.84);\r\n  border-color: rgba(183, 204, 236, 0.2);\r\n}\r\n\r\n.pt-page.is-dark .pt-command-left h3,\r\n.pt-page.is-dark .pt-card-head h3,\r\n.pt-page.is-dark .pt-report-row p,\r\n.pt-page.is-dark .pt-prescription-head h4,\r\n.pt-page.is-dark .pt-timeline strong,\r\n.pt-page.is-dark .pt-notification-list p,\r\n.pt-page.is-dark .pt-signature-box strong,\r\n.pt-page.is-dark .pt-prescription-foot p,\r\n.pt-page.is-dark .pt-ai-jargon,\r\n.pt-page.is-dark .pt-ai-plain,\r\n.pt-page.is-dark .pt-voice-controls label {\r\n  color: #e9f2ff;\r\n}\r\n\r\n.pt-page.is-dark .pt-greet-label,\r\n.pt-page.is-dark .pt-card-tag,\r\n.pt-page.is-dark .pt-stat-card p,\r\n.pt-page.is-dark .pt-stat-card span,\r\n.pt-page.is-dark .pt-report-row small,\r\n.pt-page.is-dark .pt-prescription-head p,\r\n.pt-page.is-dark .pt-signature-box p,\r\n.pt-page.is-dark .pt-signature-box small,\r\n.pt-page.is-dark .pt-notification-list span,\r\n.pt-page.is-dark .pt-notification-list small,\r\n.pt-page.is-dark .pt-ai-label,\r\n.pt-page.is-dark .pt-upload-zone small {\r\n  color: #abc1dd;\r\n}\r\n\r\n.pt-page.is-dark .pt-upload-zone,\r\n.pt-page.is-dark .pt-status-pill,\r\n.pt-page.is-dark .pt-safe-pill,\r\n.pt-page.is-dark .pt-voice-controls select {\r\n  border-color: rgba(152, 182, 222, 0.3);\r\n}\r\n\r\n.pt-page.is-dark .pt-upload-btn,\r\n.pt-page.is-dark .pt-table-action-btn {\r\n  background: rgba(39, 55, 84, 0.88);\r\n  border-color: rgba(152, 182, 222, 0.3);\r\n  color: #dceaff;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-view-toggle {\r\n  background: rgba(39, 55, 84, 0.9);\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-view-btn {\r\n  color: #bfd3ee;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-grid-card {\r\n  background: rgba(20, 31, 50, 0.84);\r\n  border-color: rgba(183, 204, 236, 0.2);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-grid-card::after {\r\n  background: radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0));\r\n}\r\n\r\n.pt-page.is-dark .pt-report-grid-card:hover {\r\n  border-color: rgba(110, 170, 230, 0.48);\r\n  box-shadow:\r\n    0 18px 30px rgba(4, 12, 24, 0.48),\r\n    0 0 0 1px rgba(96, 165, 250, 0.22);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-table tbody tr:hover {\r\n  background: linear-gradient(135deg, rgba(40, 89, 111, 0.42), rgba(34, 71, 112, 0.36));\r\n  box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.22);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-grid-head p,\r\n.pt-page.is-dark .pt-report-grid-meta strong {\r\n  color: #e8f2ff;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-grid-head small,\r\n.pt-page.is-dark .pt-report-grid-meta span {\r\n  color: #abc1dd;\r\n}\r\n\r\n.pt-page.is-dark .pt-ai-inline-summary {\r\n  background: rgba(27, 48, 65, 0.88);\r\n  border-color: rgba(130, 168, 214, 0.3);\r\n}\r\n\r\n.pt-page.is-dark .pt-ai-inline-title,\r\n.pt-page.is-dark .pt-ai-inline-summary p {\r\n  color: #bcd1ed;\r\n}\r\n\r\n.pt-page.is-dark .pt-ai-inline-close {\r\n  background: rgba(39, 55, 84, 0.9);\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n  color: #dbe8ff;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-viewer-modal {\r\n  background: rgba(18, 31, 50, 0.98);\r\n  border-color: rgba(152, 182, 222, 0.34);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-viewer-head h3,\r\n.pt-page.is-dark .pt-report-viewer-body p,\r\n.pt-page.is-dark .pt-report-viewer-close {\r\n  color: #e6f0ff;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-viewer-head p {\r\n  color: #abc1dd;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-viewer-close,\r\n.pt-page.is-dark .pt-report-viewer-body {\r\n  background: rgba(39, 55, 84, 0.9);\r\n  border-color: rgba(152, 182, 222, 0.28);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-table-wrap,\r\n.pt-page.is-dark .pt-report-table th {\r\n  background: rgba(20, 31, 50, 0.84);\r\n}\r\n\r\n.pt-page.is-dark .pt-report-table th,\r\n.pt-page.is-dark .pt-upload-hint,\r\n.pt-page.is-dark .pt-report-table td,\r\n.pt-page.is-dark .pt-report-table td small {\r\n  color: #abc1dd;\r\n}\r\n\r\n.pt-page.is-dark .pt-report-table td p {\r\n  color: #e9f2ff;\r\n}\r\n\r\n@keyframes pt-wave {\r\n  0%,\r\n  100% {\r\n    height: 18%;\r\n  }\r\n  50% {\r\n    height: 100%;\r\n  }\r\n}\r\n\r\n@keyframes pt-rise {\r\n  from {\r\n    opacity: 0;\r\n    transform: translateY(16px);\r\n  }\r\n  to {\r\n    opacity: 1;\r\n    transform: translateY(0);\r\n  }\r\n}\r\n\r\n@keyframes pt-float {\r\n  from {\r\n    transform: translate3d(0, 0, 0);\r\n  }\r\n  to {\r\n    transform: translate3d(18px, -16px, 0);\r\n  }\r\n}\r\n\r\n@keyframes pt-report-card-enter {\r\n  from {\r\n    opacity: 0;\r\n    transform: translateY(10px) scale(0.985);\r\n  }\r\n  to {\r\n    opacity: 1;\r\n    transform: translateY(0) scale(1);\r\n  }\r\n}\r\n\r\n@keyframes pt-report-glow {\r\n  from {\r\n    filter: blur(0px);\r\n    opacity: 0.45;\r\n  }\r\n  to {\r\n    filter: blur(2px);\r\n    opacity: 0.9;\r\n  }\r\n}\r\n\r\n@media (max-width: 1120px) {\r\n  .pt-sidebar {\r\n    position: static;\r\n    left: auto;\r\n    right: auto;\r\n    bottom: auto;\r\n    width: auto;\r\n    height: auto;\r\n    min-height: auto;\r\n    border-radius: 1rem;\r\n  }\r\n\r\n  .pt-sidebar-nav {\r\n    grid-template-columns: repeat(4, minmax(0, 1fr));\r\n  }\r\n\r\n  .pt-nav-item {\r\n    justify-content: center;\r\n  }\r\n\r\n  .pt-nav-item span:last-child {\r\n    display: none;\r\n  }\r\n\r\n  .pt-topbar {\r\n    flex-wrap: wrap;\r\n  }\r\n\r\n  .pt-content {\r\n    margin-left: 0;\r\n    padding: 0 0.9rem 0.9rem;\r\n  }\r\n\r\n  .pt-stats {\r\n    grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  }\r\n\r\n  .pt-command-deck {\r\n    display: block;\r\n  }\r\n\r\n  .pt-command-primary {\r\n    display: block;\r\n  }\r\n\r\n  .pt-layout {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-report-table {\r\n    min-width: 700px;\r\n  }\r\n\r\n  .pt-report-grid {\r\n    grid-template-columns: repeat(2, minmax(0, 1fr));\r\n  }\r\n\r\n  .pt-prescription-foot {\r\n    flex-direction: column;\r\n    align-items: stretch;\r\n  }\r\n\r\n  .pt-prescription-foot .pt-action-btn {\r\n    width: 100%;\r\n    text-align: center;\r\n  }\r\n\r\n  .pt-hero-card {\r\n    grid-template-columns: 1fr;\r\n  }\r\n}\r\n\r\n@media (max-width: 800px) {\r\n  .pt-page {\r\n    padding: 0;\r\n  }\r\n\r\n  .pt-sidebar-nav {\r\n    grid-template-columns: repeat(3, minmax(0, 1fr));\r\n  }\r\n\r\n  .pt-sidebar-footer {\r\n    display: none;\r\n  }\r\n\r\n  .pt-content {\r\n    padding: 0 0.7rem 0.7rem;\r\n  }\r\n\r\n  .pt-stats {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-topbar {\r\n    padding: 0.65rem 0.7rem;\r\n  }\r\n\r\n  .pt-topbar h2 {\r\n    font-size: 1.2rem;\r\n  }\r\n\r\n  .pt-topbar-controls {\r\n    width: 100%;\r\n    justify-content: flex-end;\r\n  }\r\n\r\n  .pt-popover {\r\n    right: 0;\r\n    width: min(18rem, 92vw);\r\n  }\r\n\r\n  .pt-profile-grid {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-profile-summary {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-profile-actions {\r\n    justify-content: stretch;\r\n  }\r\n\r\n  .pt-profile-actions .pt-action-btn {\r\n    flex: 1;\r\n  }\r\n\r\n  .pt-verify-grid {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-prescription-foot {\r\n    flex-direction: column;\r\n    align-items: flex-start;\r\n  }\r\n\r\n  .pt-report-row {\r\n    flex-direction: column;\r\n    align-items: flex-start;\r\n  }\r\n\r\n  .pt-report-meta {\r\n    align-items: flex-start;\r\n    flex-direction: row;\r\n    flex-wrap: wrap;\r\n  }\r\n\r\n  .pt-card-head {\r\n    align-items: flex-start;\r\n    flex-direction: column;\r\n  }\r\n\r\n  .pt-report-head-actions {\r\n    width: 100%;\r\n    justify-content: flex-start;\r\n  }\r\n\r\n  .pt-report-view-toggle {\r\n    margin-left: auto;\r\n  }\r\n\r\n  .pt-upload-btn {\r\n    font-size: 0.7rem;\r\n    padding: 0.3rem 0.55rem;\r\n  }\r\n\r\n  .pt-report-table {\r\n    min-width: 640px;\r\n  }\r\n\r\n  .pt-report-table th,\r\n  .pt-report-table td {\r\n    padding: 0.5rem;\r\n    font-size: 0.73rem;\r\n  }\r\n\r\n  .pt-report-grid {\r\n    grid-template-columns: 1fr;\r\n  }\r\n\r\n  .pt-report-actions {\r\n    width: 100%;\r\n    display: grid;\r\n    grid-template-columns: repeat(2, minmax(0, 1fr));\r\n    gap: 0.34rem;\r\n  }\r\n\r\n  .pt-ai-inline-close {\r\n    width: 1.55rem;\r\n    height: 1.55rem;\r\n  }\r\n\r\n  .pt-table-action-btn {\r\n    width: 100%;\r\n    text-align: center;\r\n    padding: 0.38rem 0.45rem;\r\n    min-height: 2rem;\r\n  }\r\n\r\n  .pt-report-viewer-modal {\r\n    width: min(34rem, 95vw);\r\n    padding: 0.75rem;\r\n  }\r\n\r\n  .pt-report-viewer-head {\r\n    gap: 0.55rem;\r\n  }\r\n\r\n  .pt-report-viewer-close {\r\n    width: 1.85rem;\r\n    height: 1.85rem;\r\n  }\r\n}\r\n\r\n@media (max-width: 520px) {\r\n  .pt-report-view-toggle {\r\n    width: 100%;\r\n    justify-content: space-between;\r\n  }\r\n\r\n  .pt-report-view-btn {\r\n    flex: 1;\r\n    justify-content: center;\r\n  }\r\n\r\n  .pt-report-actions {\r\n    grid-template-columns: 1fr;\r\n  }\r\n}","PSPath":"C:\\Users\\Jidnyasa\\OneDrive\\Pictures\\Documents\\Attachments\\Desktop\\VitalCode\\Frontend\\src\\pages\\patient\\PatientDashboardPage.css","PSParentPath":"C:\\Users\\Jidnyasa\\OneDrive\\Pictures\\Documents\\Attachments\\Desktop\\VitalCode\\Frontend\\src\\pages\\patient","PSChildName":"PatientDashboardPage.css","PSDrive":{"CurrentLocation":"Users\\Jidnyasa\\OneDrive\\Pictures\\Documents\\Attachments\\Desktop\\VitalCode","Name":"C","Provider":{"ImplementingType":"Microsoft.PowerShell.Commands.FileSystemProvider","HelpFile":"System.Management.Automation.dll-Help.xml","Name":"FileSystem","PSSnapIn":"Microsoft.PowerShell.Core","ModuleName":"Microsoft.PowerShell.Core","Module":null,"Description":"","Capabilities":52,"Home":"C:\\Users\\Jidnyasa","Drives":"C"},"Root":"C:\\","Description":"Windows","MaximumSize":null,"Credential":{"UserName":null,"Password":null},"DisplayRoot":null},"PSProvider":{"ImplementingType":{"Module":"System.Management.Automation.dll","Assembly":"System.Management.Automation, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35","TypeHandle":"System.RuntimeTypeHandle","DeclaringMethod":null,"BaseType":"System.Management.Automation.Provider.NavigationCmdletProvider","UnderlyingSystemType":"Microsoft.PowerShell.Commands.FileSystemProvider","FullName":"Microsoft.PowerShell.Commands.FileSystemProvider","AssemblyQualifiedName":"Microsoft.PowerShell.Commands.FileSystemProvider, System.Management.Automation, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35","Namespace":"Microsoft.PowerShell.Commands","GUID":"b4755d19-b6a7-38dc-ae06-4167f801062f","IsEnum":false,"GenericParameterAttributes":null,"IsSecurityCritical":true,"IsSecuritySafeCritical":false,"IsSecurityTransparent":false,"IsGenericTypeDefinition":false,"IsGenericParameter":false,"GenericParameterPosition":null,"IsGenericType":false,"IsConstructedGenericType":false,"ContainsGenericParameters":false,"StructLayoutAttribute":"System.Runtime.InteropServices.StructLayoutAttribute","Name":"FileSystemProvider","MemberType":32,"DeclaringType":null,"ReflectedType":null,"MetadataToken":33556356,"GenericTypeParameters":"","DeclaredConstructors":"Void .ctor() Void .cctor()","DeclaredEvents":"","DeclaredFields":"System.Collections.ObjectModel.Collection`1[System.Management.Automation.WildcardPattern] excludeMatcher System.Management.Automation.PSTraceSource tracer Int32 FILETRANSFERSIZE System.String ProviderName","DeclaredMembers":"System.String Mode(System.Management.Automation.PSObject) System.String NormalizePath(System.String) System.IO.FileSystemInfo GetFileSystemInfo(System.String, Boolean ByRef) Boolean IsFilterSet() System.Object GetChildNamesDynamicParameters(System.String) System.Object GetChildItemsDynamicParameters(System.String, Boolean) System.Object CopyItemDynamicParameters(System.String, System.String, Boolean) Boolean IsNetworkMappedDrive(System.Management.Automation.PSDriveInfo) Boolean IsSupportedDriveForPersistence(System.Management.Automation.PSDriveInfo) System.String GetRootPathForNetworkDriveOrDosDevice(System.IO.DriveInfo) System.Collections.ObjectModel.Collection`1[System.Management.Automation.PSDriveInfo] InitializeDefaultDrives() System.Object GetItemDynamicParameters(System.String) Void InvokeDefaultAction(System.String) Void GetChildItems(System.String, Boolean, UInt32) Void GetChildNames(System.String, System.Management.Automation.ReturnContainers) Boolean CheckItemExists(System.String, Boolean ByRef) System.Object RemoveItemDynamicParameters(System.String, Boolean) Void RemoveFileInfoItem(System.IO.FileInfo, Boolean) Boolean ItemExists(System.String) System.Object ItemExistsDynamicParameters(System.String) Boolean HasChildItems(System.String) Void CopyItemLocalOrToSession(System.String, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) Void InitilizeFunctionPSCopyFileFromRemoteSession(System.Management.Automation.PowerShell) Boolean ValidRemoteSessionForScripting(System.Management.Automation.Runspaces.Runspace) Void InitilizeFunctionsPSCopyFileToRemoteSession(System.Management.Automation.PowerShell) Boolean PathIsReservedDeviceName(System.String, System.String) Boolean IsAbsolutePath(System.String) System.String GetCommonBase(System.String, System.String) System.String CreateNormalizedRelativePathFromStack(System.Collections.Generic.Stack`1[System.String]) Boolean IsItemContainer(System.String) Void MoveDirectoryInfoUnchecked(System.IO.DirectoryInfo, System.String, Boolean) Boolean IsSameVolume(System.String, System.String) System.Object GetPropertyDynamicParameters(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Object SetPropertyDynamicParameters(System.String, System.Management.Automation.PSObject) System.Object ClearPropertyDynamicParameters(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Object GetContentWriterDynamicParameters(System.String) System.Object ClearContentDynamicParameters(System.String) Int32 SafeGetFileAttributes(System.String) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptorFromPath(System.String, System.Security.AccessControl.AccessControlSections) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptorOfType(System.String, System.Security.AccessControl.AccessControlSections) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptor(ItemType) System.Management.Automation.ErrorRecord CreateErrorRecord(System.String, System.String) System.String GetHelpMaml(System.String, System.String) System.Management.Automation.ProviderInfo Start(System.Management.Automation.ProviderInfo) System.Management.Automation.PSDriveInfo NewDrive(System.Management.Automation.PSDriveInfo) Void MapNetworkDrive(System.Management.Automation.PSDriveInfo) System.Management.Automation.PSDriveInfo RemoveDrive(System.Management.Automation.PSDriveInfo) System.String GetUNCForNetworkDrive(System.String) System.String GetSubstitutedPathForNetworkDosDevice(System.String) Boolean IsValidPath(System.String) Void GetItem(System.String) System.IO.FileSystemInfo GetFileSystemItem(System.String, Boolean ByRef, Boolean) Boolean ConvertPath(System.String, System.String, System.String ByRef, System.String ByRef) Void GetPathItems(System.String, Boolean, UInt32, Boolean, System.Management.Automation.ReturnContainers) Void Dir(System.IO.DirectoryInfo, Boolean, UInt32, Boolean, System.Management.Automation.ReturnContainers, InodeTracker) System.Management.Automation.FlagsExpression`1[System.IO.FileAttributes] FormatAttributeSwitchParamters() Void RenameItem(System.String, System.String) Void NewItem(System.String, System.String, System.Object) ItemType GetItemType(System.String) Void CreateDirectory(System.String, Boolean) Boolean CreateIntermediateDirectories(System.String) Void RemoveItem(System.String, Boolean) Void RemoveDirectoryInfoItem(System.IO.DirectoryInfo, Boolean, Boolean, Boolean) Void RemoveFileSystemItem(System.IO.FileSystemInfo, Boolean) Boolean ItemExists(System.String, System.Management.Automation.ErrorRecord ByRef) Boolean DirectoryInfoHasChildItems(System.IO.DirectoryInfo) Void CopyItem(System.String, System.String, Boolean) Void CopyItemFromRemoteSession(System.String, System.String, Boolean, Boolean, System.Management.Automation.Runspaces.PSSession) Void CopyDirectoryInfoItem(System.IO.DirectoryInfo, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) Void CopyFileInfoItem(System.IO.FileInfo, System.String, Boolean, System.Management.Automation.PowerShell) Void CopyDirectoryFromRemoteSession(System.String, System.String, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) System.Collections.ArrayList GetRemoteSourceAlternateStreams(System.Management.Automation.PowerShell, System.String) Void RemoveFunctionsPSCopyFileFromRemoteSession(System.Management.Automation.PowerShell) System.Collections.Hashtable GetRemoteFileMetadata(System.String, System.Management.Automation.PowerShell) Void SetFileMetadata(System.String, System.IO.FileInfo, System.Management.Automation.PowerShell) Void CopyFileFromRemoteSession(System.String, System.String, System.String, Boolean, System.Management.Automation.PowerShell, Int64) Boolean PerformCopyFileFromRemoteSession(System.String, System.IO.FileInfo, System.String, Boolean, System.Management.Automation.PowerShell, Int64, Boolean, System.String) Void RemoveFunctionPSCopyFileToRemoteSession(System.Management.Automation.PowerShell) Boolean RemoteTargetSupportsAlternateStreams(System.Management.Automation.PowerShell, System.String) System.String MakeRemotePath(System.Management.Automation.PowerShell, System.String, System.String) Boolean RemoteDirectoryExist(System.Management.Automation.PowerShell, System.String) Boolean CopyFileStreamToRemoteSession(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell, Boolean, System.String) System.Collections.Hashtable GetFileMetadata(System.IO.FileInfo) Void SetRemoteFileMetadata(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell) Boolean PerformCopyFileToRemoteSession(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell) Boolean RemoteDestinationPathIsFile(System.String, System.Management.Automation.PowerShell) System.String CreateDirectoryOnRemoteSession(System.String, Boolean, System.Management.Automation.PowerShell) System.String GetParentPath(System.String, System.String) Boolean IsUNCPath(System.String) Boolean IsUNCRoot(System.String) Boolean IsPathRoot(System.String) System.String NormalizeRelativePath(System.String, System.String) System.String NormalizeRelativePathHelper(System.String, System.String) System.String RemoveRelativeTokens(System.String) System.Collections.Generic.Stack`1[System.String] TokenizePathToStack(System.String, System.String) System.Collections.Generic.Stack`1[System.String] NormalizeThePath(System.String, System.Collections.Generic.Stack`1[System.String]) System.String GetChildName(System.String) System.String EnsureDriveIsRooted(System.String) Void MoveItem(System.String, System.String) Void MoveFileInfoItem(System.IO.FileInfo, System.String, Boolean, Boolean) Void MoveDirectoryInfoItem(System.IO.DirectoryInfo, System.String, Boolean) Void CopyAndDelete(System.IO.DirectoryInfo, System.String, Boolean) Void GetProperty(System.String, System.Collections.ObjectModel.Collection`1[System.String]) Void SetProperty(System.String, System.Management.Automation.PSObject) Void ClearProperty(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Management.Automation.Provider.IContentReader GetContentReader(System.String) System.Object GetContentReaderDynamicParameters(System.String) System.Management.Automation.Provider.IContentWriter GetContentWriter(System.String) Void ClearContent(System.String) Void ValidateParameters(Boolean) Void GetSecurityDescriptor(System.String, System.Security.AccessControl.AccessControlSections) Void SetSecurityDescriptor(System.String, System.Security.AccessControl.ObjectSecurity) Void SetSecurityDescriptor(System.String, System.Security.AccessControl.ObjectSecurity, System.Security.AccessControl.AccessControlSections) Void \u003cRemoveDirectoryInfoItem\u003eg__WriteErrorHelper|43_0(System.Exception, \u003c\u003ec__DisplayClass43_0 ByRef) Void .ctor() Void .cctor() System.Collections.ObjectModel.Collection`1[System.Management.Automation.WildcardPattern] excludeMatcher System.Management.Automation.PSTraceSource tracer Int32 FILETRANSFERSIZE System.String ProviderName Microsoft.PowerShell.Commands.FileSystemProvider+ItemType Microsoft.PowerShell.Commands.FileSystemProvider+NativeMethods Microsoft.PowerShell.Commands.FileSystemProvider+NetResource Microsoft.PowerShell.Commands.FileSystemProvider+InodeTracker Microsoft.PowerShell.Commands.FileSystemProvider+\u003c\u003ec__DisplayClass43_0","DeclaredMethods":"System.String Mode(System.Management.Automation.PSObject) System.String NormalizePath(System.String) System.IO.FileSystemInfo GetFileSystemInfo(System.String, Boolean ByRef) Boolean IsFilterSet() System.Object GetChildNamesDynamicParameters(System.String) System.Object GetChildItemsDynamicParameters(System.String, Boolean) System.Object CopyItemDynamicParameters(System.String, System.String, Boolean) Boolean IsNetworkMappedDrive(System.Management.Automation.PSDriveInfo) Boolean IsSupportedDriveForPersistence(System.Management.Automation.PSDriveInfo) System.String GetRootPathForNetworkDriveOrDosDevice(System.IO.DriveInfo) System.Collections.ObjectModel.Collection`1[System.Management.Automation.PSDriveInfo] InitializeDefaultDrives() System.Object GetItemDynamicParameters(System.String) Void InvokeDefaultAction(System.String) Void GetChildItems(System.String, Boolean, UInt32) Void GetChildNames(System.String, System.Management.Automation.ReturnContainers) Boolean CheckItemExists(System.String, Boolean ByRef) System.Object RemoveItemDynamicParameters(System.String, Boolean) Void RemoveFileInfoItem(System.IO.FileInfo, Boolean) Boolean ItemExists(System.String) System.Object ItemExistsDynamicParameters(System.String) Boolean HasChildItems(System.String) Void CopyItemLocalOrToSession(System.String, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) Void InitilizeFunctionPSCopyFileFromRemoteSession(System.Management.Automation.PowerShell) Boolean ValidRemoteSessionForScripting(System.Management.Automation.Runspaces.Runspace) Void InitilizeFunctionsPSCopyFileToRemoteSession(System.Management.Automation.PowerShell) Boolean PathIsReservedDeviceName(System.String, System.String) Boolean IsAbsolutePath(System.String) System.String GetCommonBase(System.String, System.String) System.String CreateNormalizedRelativePathFromStack(System.Collections.Generic.Stack`1[System.String]) Boolean IsItemContainer(System.String) Void MoveDirectoryInfoUnchecked(System.IO.DirectoryInfo, System.String, Boolean) Boolean IsSameVolume(System.String, System.String) System.Object GetPropertyDynamicParameters(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Object SetPropertyDynamicParameters(System.String, System.Management.Automation.PSObject) System.Object ClearPropertyDynamicParameters(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Object GetContentWriterDynamicParameters(System.String) System.Object ClearContentDynamicParameters(System.String) Int32 SafeGetFileAttributes(System.String) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptorFromPath(System.String, System.Security.AccessControl.AccessControlSections) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptorOfType(System.String, System.Security.AccessControl.AccessControlSections) System.Security.AccessControl.ObjectSecurity NewSecurityDescriptor(ItemType) System.Management.Automation.ErrorRecord CreateErrorRecord(System.String, System.String) System.String GetHelpMaml(System.String, System.String) System.Management.Automation.ProviderInfo Start(System.Management.Automation.ProviderInfo) System.Management.Automation.PSDriveInfo NewDrive(System.Management.Automation.PSDriveInfo) Void MapNetworkDrive(System.Management.Automation.PSDriveInfo) System.Management.Automation.PSDriveInfo RemoveDrive(System.Management.Automation.PSDriveInfo) System.String GetUNCForNetworkDrive(System.String) System.String GetSubstitutedPathForNetworkDosDevice(System.String) Boolean IsValidPath(System.String) Void GetItem(System.String) System.IO.FileSystemInfo GetFileSystemItem(System.String, Boolean ByRef, Boolean) Boolean ConvertPath(System.String, System.String, System.String ByRef, System.String ByRef) Void GetPathItems(System.String, Boolean, UInt32, Boolean, System.Management.Automation.ReturnContainers) Void Dir(System.IO.DirectoryInfo, Boolean, UInt32, Boolean, System.Management.Automation.ReturnContainers, InodeTracker) System.Management.Automation.FlagsExpression`1[System.IO.FileAttributes] FormatAttributeSwitchParamters() Void RenameItem(System.String, System.String) Void NewItem(System.String, System.String, System.Object) ItemType GetItemType(System.String) Void CreateDirectory(System.String, Boolean) Boolean CreateIntermediateDirectories(System.String) Void RemoveItem(System.String, Boolean) Void RemoveDirectoryInfoItem(System.IO.DirectoryInfo, Boolean, Boolean, Boolean) Void RemoveFileSystemItem(System.IO.FileSystemInfo, Boolean) Boolean ItemExists(System.String, System.Management.Automation.ErrorRecord ByRef) Boolean DirectoryInfoHasChildItems(System.IO.DirectoryInfo) Void CopyItem(System.String, System.String, Boolean) Void CopyItemFromRemoteSession(System.String, System.String, Boolean, Boolean, System.Management.Automation.Runspaces.PSSession) Void CopyDirectoryInfoItem(System.IO.DirectoryInfo, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) Void CopyFileInfoItem(System.IO.FileInfo, System.String, Boolean, System.Management.Automation.PowerShell) Void CopyDirectoryFromRemoteSession(System.String, System.String, System.String, Boolean, Boolean, System.Management.Automation.PowerShell) System.Collections.ArrayList GetRemoteSourceAlternateStreams(System.Management.Automation.PowerShell, System.String) Void RemoveFunctionsPSCopyFileFromRemoteSession(System.Management.Automation.PowerShell) System.Collections.Hashtable GetRemoteFileMetadata(System.String, System.Management.Automation.PowerShell) Void SetFileMetadata(System.String, System.IO.FileInfo, System.Management.Automation.PowerShell) Void CopyFileFromRemoteSession(System.String, System.String, System.String, Boolean, System.Management.Automation.PowerShell, Int64) Boolean PerformCopyFileFromRemoteSession(System.String, System.IO.FileInfo, System.String, Boolean, System.Management.Automation.PowerShell, Int64, Boolean, System.String) Void RemoveFunctionPSCopyFileToRemoteSession(System.Management.Automation.PowerShell) Boolean RemoteTargetSupportsAlternateStreams(System.Management.Automation.PowerShell, System.String) System.String MakeRemotePath(System.Management.Automation.PowerShell, System.String, System.String) Boolean RemoteDirectoryExist(System.Management.Automation.PowerShell, System.String) Boolean CopyFileStreamToRemoteSession(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell, Boolean, System.String) System.Collections.Hashtable GetFileMetadata(System.IO.FileInfo) Void SetRemoteFileMetadata(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell) Boolean PerformCopyFileToRemoteSession(System.IO.FileInfo, System.String, System.Management.Automation.PowerShell) Boolean RemoteDestinationPathIsFile(System.String, System.Management.Automation.PowerShell) System.String CreateDirectoryOnRemoteSession(System.String, Boolean, System.Management.Automation.PowerShell) System.String GetParentPath(System.String, System.String) Boolean IsUNCPath(System.String) Boolean IsUNCRoot(System.String) Boolean IsPathRoot(System.String) System.String NormalizeRelativePath(System.String, System.String) System.String NormalizeRelativePathHelper(System.String, System.String) System.String RemoveRelativeTokens(System.String) System.Collections.Generic.Stack`1[System.String] TokenizePathToStack(System.String, System.String) System.Collections.Generic.Stack`1[System.String] NormalizeThePath(System.String, System.Collections.Generic.Stack`1[System.String]) System.String GetChildName(System.String) System.String EnsureDriveIsRooted(System.String) Void MoveItem(System.String, System.String) Void MoveFileInfoItem(System.IO.FileInfo, System.String, Boolean, Boolean) Void MoveDirectoryInfoItem(System.IO.DirectoryInfo, System.String, Boolean) Void CopyAndDelete(System.IO.DirectoryInfo, System.String, Boolean) Void GetProperty(System.String, System.Collections.ObjectModel.Collection`1[System.String]) Void SetProperty(System.String, System.Management.Automation.PSObject) Void ClearProperty(System.String, System.Collections.ObjectModel.Collection`1[System.String]) System.Management.Automation.Provider.IContentReader GetContentReader(System.String) System.Object GetContentReaderDynamicParameters(System.String) System.Management.Automation.Provider.IContentWriter GetContentWriter(System.String) Void ClearContent(System.String) Void ValidateParameters(Boolean) Void GetSecurityDescriptor(System.String, System.Security.AccessControl.AccessControlSections) Void SetSecurityDescriptor(System.String, System.Security.AccessControl.ObjectSecurity) Void SetSecurityDescriptor(System.String, System.Security.AccessControl.ObjectSecurity, System.Security.AccessControl.AccessControlSections) Void \u003cRemoveDirectoryInfoItem\u003eg__WriteErrorHelper|43_0(System.Exception, \u003c\u003ec__DisplayClass43_0 ByRef)","DeclaredNestedTypes":"Microsoft.PowerShell.Commands.FileSystemProvider+ItemType Microsoft.PowerShell.Commands.FileSystemProvider+NativeMethods Microsoft.PowerShell.Commands.FileSystemProvider+NetResource Microsoft.PowerShell.Commands.FileSystemProvider+InodeTracker Microsoft.PowerShell.Commands.FileSystemProvider+\u003c\u003ec__DisplayClass43_0","DeclaredProperties":"","ImplementedInterfaces":"System.Management.Automation.IResourceSupplier System.Management.Automation.Provider.IContentCmdletProvider System.Management.Automation.Provider.IPropertyCmdletProvider System.Management.Automation.Provider.ISecurityDescriptorCmdletProvider System.Management.Automation.Provider.ICmdletProviderSupportsHelp","TypeInitializer":"Void .cctor()","IsNested":false,"Attributes":1048833,"IsVisible":true,"IsNotPublic":false,"IsPublic":true,"IsNestedPublic":false,"IsNestedPrivate":false,"IsNestedFamily":false,"IsNestedAssembly":false,"IsNestedFamANDAssem":false,"IsNestedFamORAssem":false,"IsAutoLayout":true,"IsLayoutSequential":false,"IsExplicitLayout":false,"IsClass":true,"IsInterface":false,"IsValueType":false,"IsAbstract":false,"IsSealed":true,"IsSpecialName":false,"IsImport":false,"IsSerializable":false,"IsAnsiClass":true,"IsUnicodeClass":false,"IsAutoClass":false,"IsArray":false,"IsByRef":false,"IsPointer":false,"IsPrimitive":false,"IsCOMObject":false,"HasElementType":false,"IsContextful":false,"IsMarshalByRef":false,"GenericTypeArguments":"","CustomAttributes":"[System.Management.Automation.OutputTypeAttribute(new Type[2] { typeof(System.String), typeof(System.IO.FileInfo) }, ProviderCmdlet = \"New-Item\")] [System.Management.Automation.OutputTypeAttribute(typeof(System.Security.AccessControl.FileSecurity), ProviderCmdlet = \"Set-Acl\")] [System.Management.Automation.OutputTypeAttribute(new Type[2] { typeof(System.String), typeof(System.Management.Automation.PathInfo) }, ProviderCmdlet = \"Resolve-Path\")] [System.Management.Automation.OutputTypeAttribute(typeof(System.Management.Automation.PathInfo), ProviderCmdlet = \"Push-Location\")] [System.Management.Automation.OutputTypeAttribute(new Type[2] { typeof(System.Byte), typeof(System.String) }, ProviderCmdlet = \"Get-Content\")] [System.Management.Automation.OutputTypeAttribute(typeof(System.IO.FileInfo), ProviderCmdlet = \"Get-Item\")] [System.Management.Automation.OutputTypeAttribute(new Type[2] { typeof(System.IO.FileInfo), typeof(System.IO.DirectoryInfo) }, ProviderCmdlet = \"Get-ChildItem\")] [System.Management.Automation.OutputTypeAttribute(new Type[2] { typeof(System.Security.AccessControl.FileSecurity), typeof(System.Security.AccessControl.DirectorySecurity) }, ProviderCmdlet = \"Get-Acl\")] [System.Management.Automation.OutputTypeAttribute(new Type[4] { typeof(System.Boolean), typeof(System.String), typeof(System.IO.FileInfo), typeof(System.IO.DirectoryInfo) }, ProviderCmdlet = \"Get-Item\")] [System.Management.Automation.OutputTypeAttribute(new Type[5] { typeof(System.Boolean), typeof(System.String), typeof(System.DateTime), typeof(System.IO.FileInfo), typeof(System.IO.DirectoryInfo) }, ProviderCmdlet = \"Get-ItemProperty\")] [System.Management.Automation.Provider.CmdletProviderAttribute(\"FileSystem\", (System.Management.Automation.Provider.ProviderCapabilities)52)]"},"HelpFile":"System.Management.Automation.dll-Help.xml","Name":"FileSystem","PSSnapIn":{"Name":"Microsoft.PowerShell.Core","IsDefault":true,"ApplicationBase":"C:\\Windows\\System32\\WindowsPowerShell\\v1.0","AssemblyName":"System.Management.Automation, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35, ProcessorArchitecture=MSIL","ModuleName":"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\System.Management.Automation.dll","PSVersion":"5.1.26100.7920","Version":"3.0.0.0","Types":"types.ps1xml typesv3.ps1xml","Formats":"Certificate.format.ps1xml DotNetTypes.format.ps1xml FileSystem.format.ps1xml Help.format.ps1xml HelpV3.format.ps1xml PowerShellCore.format.ps1xml PowerShellTrace.format.ps1xml Registry.format.ps1xml","Description":"This Windows PowerShell snap-in contains cmdlets used to manage components of Windows PowerShell.","Vendor":"Microsoft Corporation","LogPipelineExecutionDetails":false},"ModuleName":"Microsoft.PowerShell.Core","Module":null,"Description":"","Capabilities":52,"Home":"C:\\Users\\Jidnyasa","Drives":["C"]},"ReadCount":1}

const PATIENT_DASHBOARD_STYLE_TEXT =
  typeof PATIENT_DASHBOARD_STYLES === 'string' ? PATIENT_DASHBOARD_STYLES : PATIENT_DASHBOARD_STYLES.value ?? ''

const INITIAL_REPORTS = [
  {
    id: 'REP-3084',
    name: 'cbc-panel-april.pdf',
    uploadedOn: '17 Apr 2026',
    size: '2.6 MB',
    status: 'Reviewed',
    scanStatus: 'Malware Safe',
  },
  {
    id: 'REP-3077',
    name: 'thyroid-profile.png',
    uploadedOn: '16 Apr 2026',
    size: '1.1 MB',
    status: 'Under Review',
    scanStatus: 'Malware Safe',
  },
  {
    id: 'REP-3060',
    name: 'chest-xray.jpg',
    uploadedOn: '15 Apr 2026',
    size: '3.2 MB',
    status: 'Uploaded',
    scanStatus: 'Malware Safe',
  },
]

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-VC-5541',
    doctor: 'Dr. Sara Abraham',
    issuedDate: '17 Apr 2026',
    validityDeadline: '2026-04-21T18:00:00',
    status: 'Pending',
    medicines: [
      'Amoxicillin 500mg - 1 tablet after breakfast',
      'Vitamin B12 - 1 capsule after dinner',
    ],
    signatureHash: '0x9f3a...7ce2',
    qrRef: 'VC-QR-5541',
  },
  {
    id: 'RX-VC-5528',
    doctor: 'Dr. Rohan Iyer',
    issuedDate: '14 Apr 2026',
    validityDeadline: '2026-04-16T10:00:00',
    status: 'Pending',
    medicines: [
      'Metformin 500mg - 1 tablet twice daily',
      'Lisinopril 10mg - 1 tablet at night',
    ],
    signatureHash: '0xa2b4...18ef',
    qrRef: 'VC-QR-5528',
  },
]

const INITIAL_TIMELINE = [
  {
    id: 1,
    title: 'Doctor reviewed your CBC report',
    time: 'Today, 09:25',
  },
  {
    id: 2,
    title: 'Digital prescription RX-VC-5541 issued',
    time: 'Today, 09:31',
  },
  {
    id: 3,
    title: 'Trust signature validated on-chain',
    time: 'Today, 09:32',
  },
]

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'Trust Alert',
    text: 'Signature and QR verified for RX-VC-5541.',
    time: '2m ago',
  },
  {
    id: 2,
    type: 'Doctor Update',
    text: 'Your prescription notes were updated with dosage tips.',
    time: '17m ago',
  },
  {
    id: 3,
    type: 'Expiry Warning',
    text: 'RX-VC-5528 has expired. Request a revalidation if needed.',
    time: '1d ago',
  },
]

const LEFT_NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Patient Dashboard',
    icon: LuLayoutDashboard,
  },
  {
    id: 'reports',
    label: 'Report Vault',
    icon: LuClipboardCheck,
  },
  {
    id: 'trust',
    label: 'Trust Status',
    icon: LuShieldCheck,
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    icon: LuPill,
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy Flow',
    icon: LuStore,
  },
  {
    id: 'alerts',
    label: 'Alerts & Notificaations',
    icon: LuSiren,
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: LuBadgeCheck,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: LuSettings,
  },
]

const getPrescriptionStatus = (prescription) => {
  const isExpired = Date.now() > new Date(prescription.validityDeadline).getTime()
  return isExpired ? 'Expired' : prescription.status
}

const getRemainingTime = (deadline) => {
  const remainingMs = new Date(deadline).getTime() - Date.now()
  if (remainingMs <= 0) return 'Expired'

  const hours = Math.floor(remainingMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  if (days > 0) return `${days}d ${remainingHours}h left`
  return `${remainingHours}h left`
}

const getSimpleHealthInsight = (reportName) => {
  const normalizedName = reportName.toLowerCase()

  if (normalizedName.includes('cbc')) {
    return 'Your blood count report appears mostly stable. Keep hydration and balanced meals consistent, and continue follow-up if your doctor advised repeat testing.'
  }

  if (normalizedName.includes('thyroid')) {
    return 'Your thyroid profile shows values that should be monitored with regular medicine timing and sleep routine. Follow your doctor guidance for dose adjustments.'
  }

  if (normalizedName.includes('xray') || normalizedName.includes('chest')) {
    return 'Your chest report indicates mild findings that usually improve with medicines, rest, and breathing care. Contact your doctor quickly if cough or breathlessness worsens.'
  }

  return 'This report has been analyzed. In simple terms, continue medicines as prescribed, maintain hydration, and share any new symptoms with your doctor for safe follow-up.'
}

const PatientDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('overview')
  const [overviewSection, setOverviewSection] = useState('reports')
  const [reportViewMode, setReportViewMode] = useState('grid')
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [savedReportIds, setSavedReportIds] = useState([])
  const [activeReportPreview, setActiveReportPreview] = useState(null)
  const [aiInsight, setAiInsight] = useState(null)
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS)
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  const [voiceSpeed, setVoiceSpeed] = useState('1.0x')
  const [themeMode, setThemeMode] = useState('light')
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false)
  const [patientProfile, setPatientProfile] = useState({
    name: 'Aarav Menon',
    email: 'aarav.menon@vitalcode.health',
    phone: '+91 98765 43210',
    aadhaarId: '6278 4435 9210',
    bloodGroup: 'B+',
    dateOfBirth: '1998-05-11',
    address: '14 Green Avenue, Bengaluru',
    emergencyContact: '+91 99887 66554',
  })
  const [profileDraft, setProfileDraft] = useState({
    name: 'Aarav Menon',
    email: 'aarav.menon@vitalcode.health',
    phone: '+91 98765 43210',
    aadhaarId: '6278 4435 9210',
    bloodGroup: 'B+',
    dateOfBirth: '1998-05-11',
    address: '14 Green Avenue, Bengaluru',
    emergencyContact: '+91 99887 66554',
  })

  const patientName = patientProfile.name
  const firstName = patientName.split(' ')[0]

  const patientTrustId = useMemo(() => {
    const random = Math.floor(100000 + Math.random() * 900000)
    return `VC-PT-${random}`
  }, [])

  const patientInitials = useMemo(() => {
    return patientName
      .split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }, [patientName])

  const trustScore = useMemo(() => {
    const reviewedReports = reports.filter((report) => report.status === 'Reviewed').length
    return Math.min(99, 84 + reviewedReports * 5)
  }, [reports])

  const activePrescriptions = useMemo(() => {
    return prescriptions.filter((item) => getPrescriptionStatus(item) !== 'Expired').length
  }, [prescriptions])

  const pushNotification = (type, text) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        text,
        time: 'Just now',
      },
      ...prev,
    ].slice(0, 6))
  }

  const pushTimeline = (title) => {
    setTimeline((prev) => [
      {
        id: Date.now(),
        title,
        time: 'Just now',
      },
      ...prev,
    ].slice(0, 8))
  }

  const handleReportUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    let current = 0
    const ticker = window.setInterval(() => {
      current += 20
      setUploadProgress(current)

      if (current >= 100) {
        window.clearInterval(ticker)
        setIsUploading(false)

        setReports((prev) => [
          {
            id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: file.name,
            uploadedOn: 'Today',
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            status: 'Uploaded',
            scanStatus: 'Malware Safe',
          },
          ...prev,
        ])

        pushTimeline(`Report ${file.name} uploaded to encrypted vault`)
        pushNotification('Vault Update', `${file.name} uploaded and marked malware safe.`)
      }
    }, 140)

    event.target.value = ''
  }

  const updatePharmacyStatus = (prescriptionId) => {
    const selected = prescriptions.find((item) => item.id === prescriptionId)
    if (!selected) return

    const currentStatus = getPrescriptionStatus(selected)
    if (currentStatus === 'Expired' || currentStatus === 'Issued') return

    const nextStatus = currentStatus === 'Pending' ? 'Partially Issued' : 'Issued'

    setPrescriptions((prev) =>
      prev.map((item) =>
        item.id === prescriptionId
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    )

    pushTimeline(`Pharmacy updated ${prescriptionId}: ${nextStatus}`)
    pushNotification('Pharmacy Update', `${prescriptionId} is now ${nextStatus.toLowerCase()}.`)
  }

  const openAlertsMenu = () => {
    setActiveNav('alerts')
  }

  const handleSidebarNavigation = (navId) => {
    setActiveNav(navId)
  }

  const openProfileEditor = () => {
    setProfileDraft(patientProfile)
    setIsProfileEditorOpen(true)
  }

  const handleProfileDraftChange = (field, value) => {
    setProfileDraft((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveProfileChanges = (event) => {
    event.preventDefault()
    setPatientProfile(profileDraft)
    setIsProfileEditorOpen(false)
    pushNotification('Profile Updated', 'Your profile details were updated successfully.')
  }

  const handleViewReport = (report) => {
    setActiveReportPreview(report)
    pushNotification('Report View', `${report.name} opened in secure preview.`)
  }

  const handleDeleteReport = (reportId) => {
    const selected = reports.find((item) => item.id === reportId)
    if (!selected) return

    setReports((prev) => prev.filter((item) => item.id !== reportId))
    setSavedReportIds((prev) => prev.filter((item) => item !== reportId))
    setActiveReportPreview((prev) => (prev?.id === reportId ? null : prev))
    setAiInsight((prev) => (prev?.reportId === reportId ? null : prev))
    pushTimeline(`Report ${selected.name} deleted from vault`)
    pushNotification('Vault Update', `${selected.name} deleted from report vault.`)
  }

  const handleAIAnalyzer = (reportId) => {
    const selectedReport = reports.find((item) => item.id === reportId)
    if (!selectedReport) return

    const summary = getSimpleHealthInsight(selectedReport.name)

    setAiInsight({
      reportId,
      reportName: selectedReport.name,
      uploadedOn: selectedReport.uploadedOn,
      summary,
    })

    pushTimeline(`AI analyser completed for ${selectedReport.name}`)
    pushNotification('AI Analyzer', `${selectedReport.name} analyzed with simple health summary.`)
  }

  const handleToggleSaveReport = (reportId, reportName) => {
    let saved = false

    setSavedReportIds((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((item) => item !== reportId)
      }

      saved = true
      return [...prev, reportId]
    })

    pushNotification(
      saved ? 'Report Saved' : 'Report Unsaved',
      saved ? `${reportName} saved for quick access.` : `${reportName} removed from saved reports.`,
    )
  }

  const closeAiInsight = () => {
    setAiInsight(null)
  }

  const renderReportActions = (report) => {
    const isSaved = savedReportIds.includes(report.id)

    return (
      <>
        <div className='pt-report-actions'>
          <button type='button' className='pt-table-action-btn view' onClick={() => handleViewReport(report)}>
            View
          </button>
          <button
            type='button'
            className='pt-table-action-btn ai'
            onClick={() => handleAIAnalyzer(report.id)}
          >
            AI Analyser
          </button>
          <button
            type='button'
            className='pt-table-action-btn save'
            onClick={() => handleToggleSaveReport(report.id, report.name)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            type='button'
            className='pt-table-action-btn delete'
            onClick={() => handleDeleteReport(report.id)}
          >
            Delete
          </button>
        </div>

        {aiInsight?.reportId === report.id && (
          <div className='pt-ai-inline-summary' role='status' aria-live='polite'>
            <div className='pt-ai-inline-head'>
              <p className='pt-ai-inline-title'>AI Summary</p>
              <button
                type='button'
                className='pt-ai-inline-close'
                aria-label='Close AI summary'
                onClick={closeAiInsight}
              >
                X
              </button>
            </div>
            <p>{aiInsight.summary}</p>
          </div>
        )}
      </>
    )
  }

  const reportVaultCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Report Vault Upload</h3>
        <div className='pt-report-head-actions'>
          <span className='pt-card-tag'>Zero-trust scan on upload</span>
          <label className='pt-upload-btn' htmlFor='pt-report-upload'>
            Upload
          </label>

          <div className='pt-report-view-toggle' role='group' aria-label='Report view mode'>
            <button
              type='button'
              className={`pt-report-view-btn ${reportViewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setReportViewMode('grid')}
            >
              <LuLayoutGrid aria-hidden='true' />
              <span>Grid</span>
            </button>

            <button
              type='button'
              className={`pt-report-view-btn ${reportViewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setReportViewMode('list')}
            >
              <LuList aria-hidden='true' />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      <input
        id='pt-report-upload'
        className='pt-upload-input'
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleReportUpload}
      />

      <p className='pt-upload-hint'>Supported: PDF, JPG, PNG | Max 10 MB</p>

      {isUploading && (
        <div className='pt-upload-progress' role='status' aria-live='polite'>
          <div className='pt-upload-progress-fill' style={{ width: `${uploadProgress}%` }} />
          <span>Encrypting and scanning... {uploadProgress}%</span>
        </div>
      )}

      {reportViewMode === 'list' ? (
        <div className='pt-report-table-wrap'>
          <table className='pt-report-table'>
            <thead>
              <tr>
                <th>Report</th>
                <th>Uploaded On</th>
                <th>Size</th>
                <th>Status</th>
                <th>Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <p>{report.name}</p>
                    <small>{report.id}</small>
                  </td>
                  <td>{report.uploadedOn}</td>
                  <td>{report.size}</td>
                  <td>
                    <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <span className='pt-safe-pill'>{report.scanStatus}</span>
                  </td>
                  <td>{renderReportActions(report)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='pt-report-grid'>
          {reports.map((report) => (
            <article key={report.id} className='pt-report-grid-card'>
              <div className='pt-report-grid-head'>
                <div>
                  <p>{report.name}</p>
                  <small>{report.id}</small>
                </div>
                <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {report.status}
                </span>
              </div>

              <ul className='pt-report-grid-meta'>
                <li>
                  <span>Uploaded</span>
                  <strong>{report.uploadedOn}</strong>
                </li>
                <li>
                  <span>Size</span>
                  <strong>{report.size}</strong>
                </li>
                <li>
                  <span>Scan</span>
                  <span className='pt-safe-pill'>{report.scanStatus}</span>
                </li>
              </ul>

              {renderReportActions(report)}
            </article>
          ))}
        </div>
      )}
    </article>
  )

  const prescriptionsCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Digital Prescription Center</h3>
        <span className='pt-card-tag'>QR + signature secured</span>
      </div>

      <div className='pt-prescription-list'>
        {prescriptions.map((prescription) => {
          const status = getPrescriptionStatus(prescription)
          const remainingTime = getRemainingTime(prescription.validityDeadline)
          const isLocked = status === 'Expired' || status === 'Issued'

          return (
            <article key={prescription.id} className='pt-prescription-card'>
              <div className='pt-prescription-head'>
                <div>
                  <h4>{prescription.id}</h4>
                  <p>Issued by {prescription.doctor} on {prescription.issuedDate}</p>
                </div>
                <span className={`pt-status-pill pt-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {status}
                </span>
              </div>

              <ul className='pt-medicine-list'>
                {prescription.medicines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className='pt-verify-grid'>
                <div className='pt-qr-box' aria-label='Prescription QR preview'>
                  <div className='pt-qr-grid' />
                  <span>{prescription.qrRef}</span>
                </div>
                <div className='pt-signature-box'>
                  <p>Digital Signature Verified</p>
                  <strong>{prescription.signatureHash}</strong>
                  <small>Hash integrity timestamped and immutable</small>
                </div>
              </div>

              <div className='pt-prescription-foot'>
                <p>
                  Validity: <strong>{remainingTime}</strong>
                </p>
                <button
                  type='button'
                  className='pt-action-btn secondary'
                  onClick={() => updatePharmacyStatus(prescription.id)}
                  disabled={isLocked}
                >
                  {status === 'Pending' && 'Pharmacy Scanned + Partially Issued'}
                  {status === 'Partially Issued' && 'Mark Fully Issued'}
                  {status === 'Issued' && 'Fully Issued'}
                  {status === 'Expired' && 'Prescription Expired'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </article>
  )

  const aiCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>AI Health Simplifier</h3>
        <span className='pt-card-tag'>Doctor remains final authority</span>
      </div>

      <div className='pt-ai-summary'>
        <p className='pt-ai-label'>Medical finding</p>
        <p className='pt-ai-jargon'>Mild lower respiratory tract inflammation with elevated eosinophil count.</p>
        <p className='pt-ai-label'>Simple explanation</p>
        <p className='pt-ai-plain'>
          Your lungs show mild irritation, likely because of an ongoing allergy or infection. Follow medicine timing and
          hydration guidance for faster recovery.
        </p>
      </div>

      <div className='pt-voice-controls'>
        <button type='button' className='pt-action-btn secondary' onClick={() => setIsVoicePlaying((prev) => !prev)}>
          {isVoicePlaying ? 'Pause Voice Brief' : 'Play Voice Brief'}
        </button>
        <label htmlFor='pt-voice-speed'>Voice speed</label>
        <select
          id='pt-voice-speed'
          value={voiceSpeed}
          onChange={(event) => setVoiceSpeed(event.target.value)}
        >
          <option value='0.75x'>0.75x</option>
          <option value='1.0x'>1.0x</option>
          <option value='1.25x'>1.25x</option>
        </select>
      </div>

      <div className={`pt-voice-wave ${isVoicePlaying ? 'is-playing' : ''}`} aria-hidden='true'>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </article>
  )

  const timelineCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Pharmacy and Audit Timeline</h3>
        <span className='pt-card-tag'>Tamper-evident event stream</span>
      </div>

      <ul className='pt-timeline'>
        {timeline.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.title}</strong>
            <span>{entry.time}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const notificationsCard = (focused = false) => (
    <article className={`pt-card ${focused ? 'pt-card-focus' : ''}`}>
      <div className='pt-card-head'>
        <h3>Notifications</h3>
        <span className='pt-card-tag'>Live trust signals</span>
      </div>

      <ul className='pt-notification-list'>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <div>
              <p>{notification.type}</p>
              <small>{notification.text}</small>
            </div>
            <span>{notification.time}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const verificationCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Verification Registry</h3>
        <span className='pt-card-tag'>QR and Signature Chain</span>
      </div>
      <ul className='pt-notification-list'>
        {prescriptions.map((prescription) => (
          <li key={`${prescription.id}-verify`}>
            <div>
              <p>{prescription.id}</p>
              <small>Doctor: {prescription.doctor}</small>
              <small>Signature: {prescription.signatureHash}</small>
            </div>
            <span>{prescription.qrRef}</span>
          </li>
        ))}
      </ul>
    </article>
  )

  const settingsCard = (
    <article className='pt-card'>
      <div className='pt-card-head'>
        <h3>Profile Settings</h3>
        <span className='pt-card-tag'>Editable Patient Identity</span>
      </div>
      <div className='pt-profile-grid'>
        <label>
          Full Name
          <input type='text' value={patientProfile.name} readOnly />
        </label>
        <label>
          Email
          <input type='text' value={patientProfile.email} readOnly />
        </label>
        <label>
          Phone
          <input type='text' value={patientProfile.phone} readOnly />
        </label>
        <label>
          Aadhaar ID
          <input type='text' value={patientProfile.aadhaarId} readOnly />
        </label>
        <label>
          Blood Group
          <input type='text' value={patientProfile.bloodGroup} readOnly />
        </label>
      </div>
      <div className='pt-profile-actions'>
        <button type='button' className='pt-action-btn' onClick={openProfileEditor}>
          Edit Profile
        </button>
      </div>
    </article>
  )

  const renderMainContent = () => {
    switch (activeNav) {
      case 'reports':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{reportVaultCard}</div>
          </section>
        )
      case 'prescriptions':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{prescriptionsCard}</div>
          </section>
        )
      case 'pharmacy':
        return (
          <section className='pt-layout'>
            <div className='pt-col-left'>{prescriptionsCard}</div>
            <div className='pt-col-right'>{timelineCard}</div>
          </section>
        )
      case 'alerts':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{notificationsCard(true)}</div>
          </section>
        )
      case 'verification':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{verificationCard}</div>
          </section>
        )
      case 'settings':
        return (
          <section className='pt-layout single-page'>
            <div className='pt-col-left'>{settingsCard}</div>
          </section>
        )
      case 'trust':
        return (
          <>
            <section className='pt-hero-card'>
              <div className='pt-hero-content'>
                <p className='pt-kicker'>Trust and Security</p>
                <h1>Identity Confidence Overview</h1>
                <p>
                  Monitor your trust score, verification trail, and signed prescription activity in one secure, tamper-evident
                  view.
                </p>
              </div>
              <div className='pt-trust-panel'>
                <p>Trust Score</p>
                <h2>{trustScore}%</h2>
                <small>Identity + signature + QR checks healthy</small>
              </div>
            </section>
            <section className='pt-layout single-page'>
              <div className='pt-col-left'>{verificationCard}</div>
            </section>
          </>
        )
      case 'overview':
      default:
        return (
          <>
            <section className='pt-stats'>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'reports' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('reports')}
                aria-pressed={overviewSection === 'reports'}
              >
                <p>Reports in Vault</p>
                <strong>{reports.length}</strong>
                <span>{reports.filter((item) => item.status === 'Reviewed').length} reviewed by doctors</span>
              </button>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'prescriptions' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('prescriptions')}
                aria-pressed={overviewSection === 'prescriptions'}
              >
                <p>Active Prescriptions</p>
                <strong>{activePrescriptions}</strong>
                <span>Includes pending and partially issued</span>
              </button>
              <button
                type='button'
                className={`pt-stat-card pt-stat-card-button ${overviewSection === 'pharmacy' ? 'is-active' : ''}`}
                onClick={() => setOverviewSection('pharmacy')}
                aria-pressed={overviewSection === 'pharmacy'}
              >
                <p>Pharmacy Updates</p>
                <strong>{timeline.length}</strong>
                <span>Audit events visible in real time</span>
              </button>
            </section>

            {overviewSection === 'reports' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{reportVaultCard}</div>
              </section>
            )}

            {overviewSection === 'prescriptions' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{prescriptionsCard}</div>
              </section>
            )}

            {overviewSection === 'pharmacy' && (
              <section className='pt-layout single-page'>
                <div className='pt-col-left'>{timelineCard}</div>
              </section>
            )}
          </>
        )
    }
  }

  return (
    <div className={`pt-page ${themeMode === 'dark' ? 'is-dark' : ''}`}>
      <style>{PATIENT_DASHBOARD_STYLE_TEXT}</style>
      <div className='pt-orb pt-orb-1' aria-hidden='true' />
      <div className='pt-orb pt-orb-2' aria-hidden='true' />
      <div className='pt-grid-noise' aria-hidden='true' />

      <div className='pt-shell'>
        <aside className='pt-sidebar'>
          <div className='pt-sidebar-header'>
            <div className='pt-brand-mark'>VC</div>
            <div>
              <p className='pt-brand-name'>VitalCode</p>
              <p className='pt-brand-sub'>Patient Command</p>
            </div>
          </div>

          <nav className='pt-sidebar-nav' aria-label='Patient dashboard navigation'>
            {LEFT_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type='button'
                  className={`pt-nav-item ${activeNav === item.id ? 'is-active' : ''}`}
                  onClick={() => handleSidebarNavigation(item.id)}
                >
                  <span className='pt-nav-icon' aria-hidden='true'>
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className='pt-sidebar-footer'>
            <p>Identity Integrity</p>
            <strong>Verified Session</strong>
          </div>
        </aside>

        <div className='pt-content'>
          <header className='pt-topbar'>
            <h2>Patient Dashboard</h2>

            <div className='pt-topbar-controls'>
              <button
                type='button'
                className={`pt-theme-chip ${themeMode === 'dark' ? 'is-active' : ''}`}
                onClick={() => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
              >
                {themeMode === 'dark' ? <LuMoonStar aria-hidden='true' /> : <LuSun aria-hidden='true' />}
                {themeMode === 'dark' ? 'Dark' : 'Light'}
              </button>

              <div className='pt-control-wrap'>
                <button
                  type='button'
                  className={`pt-notify-btn ${activeNav === 'alerts' ? 'is-active' : ''}`}
                  aria-label='Go to alerts menu'
                  onClick={openAlertsMenu}
                >
                  <LuBell aria-hidden='true' />
                  <span className='pt-notify-count'>{notifications.length > 9 ? '9+' : notifications.length}</span>
                </button>
              </div>

              <div className='pt-control-wrap'>
                <button
                  type='button'
                  className={`pt-user-chip ${isProfileEditorOpen ? 'is-active' : ''}`}
                  aria-label='Open editable profile'
                  onClick={openProfileEditor}
                >
                  <span className='pt-user-avatar'>{patientInitials}</span>
                </button>
              </div>
            </div>
          </header>

          <main className='pt-main'>
            <section className='pt-command-deck'>
              <article className='pt-command-primary'>
                <div className='pt-command-left'>
                  <p className='pt-greet-label'>Good Morning</p>
                  <h3>
                    Welcome back, <span>{firstName}</span>
                  </h3>
                </div>
              </article>
            </section>
            {renderMainContent()}
            {false && (
              <>
            <section className='pt-command-deck'>
              <article className='pt-command-primary'>
                <div className='pt-command-left'>
                  <p className='pt-greet-label'>Good Morning</p>
                  <h3>
                    Welcome back, <span>{firstName}</span>
                  </h3>
                </div>
              </article>
            </section>

            <section className='pt-hero-card'>
              <div className='pt-hero-content'>
                <p className='pt-kicker'>Secure Care Journey</p>
                <h1>Workflow Visibility and Verification</h1>
                <p>
                  Upload reports securely, receive doctor-signed prescriptions, and share QR-verified proof with pharmacy.
                  Every action is traceable, signed, and protected.
                </p>

                <div className='pt-hero-badges'>
                  <span>End-to-end encrypted vault</span>
                  <span>Doctor signature verified</span>
                  <span>Pharmacy issue audit enabled</span>
                </div>
              </div>

              <div className='pt-trust-panel'>
                <p>Trust Score</p>
                <h2>{trustScore}%</h2>
                <small>Identity + signature + QR checks healthy</small>
              </div>
            </section>

            <section className='pt-stats'>
              <article className='pt-stat-card'>
                <p>Reports in Vault</p>
                <strong>{reports.length}</strong>
                <span>{reports.filter((item) => item.status === 'Reviewed').length} reviewed by doctors</span>
              </article>
              <article className='pt-stat-card'>
                <p>Active Prescriptions</p>
                <strong>{activePrescriptions}</strong>
                <span>Includes pending and partially issued</span>
              </article>
              <article className='pt-stat-card'>
                <p>Pharmacy Updates</p>
                <strong>{timeline.length}</strong>
                <span>Audit events visible in real time</span>
              </article>
            </section>

            <section className='pt-layout'>
              <div className='pt-col-left'>
                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Report Vault Upload</h3>
                    <span className='pt-card-tag'>Zero-trust scan on upload</span>
                  </div>

                  <label className='pt-upload-zone' htmlFor='pt-report-upload'>
                    <input
                      id='pt-report-upload'
                      type='file'
                      accept='.pdf,.jpg,.jpeg,.png'
                      onChange={handleReportUpload}
                    />
                    <strong>Drop medical report here or click to upload</strong>
                    <small>Supported: PDF, JPG, PNG | Max 10 MB</small>
                  </label>

                  {isUploading && (
                    <div className='pt-upload-progress' role='status' aria-live='polite'>
                      <div className='pt-upload-progress-fill' style={{ width: `${uploadProgress}%` }} />
                      <span>Encrypting and scanning... {uploadProgress}%</span>
                    </div>
                  )}

                  <ul className='pt-report-list'>
                    {reports.map((report) => (
                      <li key={report.id} className='pt-report-row'>
                        <div>
                          <p>{report.name}</p>
                          <small>{report.uploadedOn} | {report.size} | {report.id}</small>
                        </div>
                        <div className='pt-report-meta'>
                          <span className={`pt-status-pill pt-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {report.status}
                          </span>
                          <span className='pt-safe-pill'>{report.scanStatus}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Digital Prescription Center</h3>
                    <span className='pt-card-tag'>QR + signature secured</span>
                  </div>

                  <div className='pt-prescription-list'>
                    {prescriptions.map((prescription) => {
                      const status = getPrescriptionStatus(prescription)
                      const remainingTime = getRemainingTime(prescription.validityDeadline)
                      const isLocked = status === 'Expired' || status === 'Issued'

                      return (
                        <article key={prescription.id} className='pt-prescription-card'>
                          <div className='pt-prescription-head'>
                            <div>
                              <h4>{prescription.id}</h4>
                              <p>Issued by {prescription.doctor} on {prescription.issuedDate}</p>
                            </div>
                            <span className={`pt-status-pill pt-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {status}
                            </span>
                          </div>

                          <ul className='pt-medicine-list'>
                            {prescription.medicines.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>

                          <div className='pt-verify-grid'>
                            <div className='pt-qr-box' aria-label='Prescription QR preview'>
                              <div className='pt-qr-grid' />
                              <span>{prescription.qrRef}</span>
                            </div>
                            <div className='pt-signature-box'>
                              <p>Digital Signature Verified</p>
                              <strong>{prescription.signatureHash}</strong>
                              <small>Hash integrity timestamped and immutable</small>
                            </div>
                          </div>

                          <div className='pt-prescription-foot'>
                            <p>
                              Validity: <strong>{remainingTime}</strong>
                            </p>
                            <button
                              type='button'
                              className='pt-action-btn secondary'
                              onClick={() => updatePharmacyStatus(prescription.id)}
                              disabled={isLocked}
                            >
                              {status === 'Pending' && 'Pharmacy Scanned + Partially Issued'}
                              {status === 'Partially Issued' && 'Mark Fully Issued'}
                              {status === 'Issued' && 'Fully Issued'}
                              {status === 'Expired' && 'Prescription Expired'}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </article>
              </div>

              <div className='pt-col-right'>
                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>AI Health Simplifier</h3>
                    <span className='pt-card-tag'>Doctor remains final authority</span>
                  </div>

                  <div className='pt-ai-summary'>
                    <p className='pt-ai-label'>Medical finding</p>
                    <p className='pt-ai-jargon'>Mild lower respiratory tract inflammation with elevated eosinophil count.</p>
                    <p className='pt-ai-label'>Simple explanation</p>
                    <p className='pt-ai-plain'>
                      Your lungs show mild irritation, likely because of an ongoing allergy or infection. Follow medicine timing
                      and hydration guidance for faster recovery.
                    </p>
                  </div>

                  <div className='pt-voice-controls'>
                    <button type='button' className='pt-action-btn secondary' onClick={() => setIsVoicePlaying((prev) => !prev)}>
                      {isVoicePlaying ? 'Pause Voice Brief' : 'Play Voice Brief'}
                    </button>
                    <label htmlFor='pt-voice-speed'>Voice speed</label>
                    <select
                      id='pt-voice-speed'
                      value={voiceSpeed}
                      onChange={(event) => setVoiceSpeed(event.target.value)}
                    >
                      <option value='0.75x'>0.75x</option>
                      <option value='1.0x'>1.0x</option>
                      <option value='1.25x'>1.25x</option>
                    </select>
                  </div>

                  <div className={`pt-voice-wave ${isVoicePlaying ? 'is-playing' : ''}`} aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </article>

                <article className='pt-card'>
                  <div className='pt-card-head'>
                    <h3>Pharmacy and Audit Timeline</h3>
                    <span className='pt-card-tag'>Tamper-evident event stream</span>
                  </div>

                  <ul className='pt-timeline'>
                    {timeline.map((entry) => (
                      <li key={entry.id}>
                        <strong>{entry.title}</strong>
                        <span>{entry.time}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={`pt-card ${activeNav === 'alerts' ? 'pt-card-focus' : ''}`}>
                  <div className='pt-card-head'>
                    <h3>Notifications</h3>
                    <span className='pt-card-tag'>Live trust signals</span>
                  </div>

                  <ul className='pt-notification-list'>
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <div>
                          <p>{notification.type}</p>
                          <small>{notification.text}</small>
                        </div>
                        <span>{notification.time}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>
              </>
            )}
          </main>

          {activeReportPreview && (
            <div className='pt-modal-backdrop' role='dialog' aria-modal='true' aria-label='Report preview'>
              <article className='pt-report-viewer-modal'>
                <div className='pt-report-viewer-head'>
                  <div>
                    <h3>{activeReportPreview.name}</h3>
                    <p>
                      Uploaded on {activeReportPreview.uploadedOn} | {activeReportPreview.size}
                    </p>
                  </div>
                  <button
                    type='button'
                    className='pt-report-viewer-close'
                    aria-label='Close report preview'
                    onClick={() => setActiveReportPreview(null)}
                  >
                    X
                  </button>
                </div>

                <div className='pt-report-viewer-body'>
                  <p className='pt-ai-label'>Secure report preview</p>
                  <p>
                    This is a protected preview of <strong>{activeReportPreview.id}</strong>. You can review uploaded details
                    safely before sharing with doctor or pharmacy.
                  </p>
                </div>
              </article>
            </div>
          )}

          {isProfileEditorOpen && (
            <div className='pt-modal-backdrop' role='dialog' aria-modal='true' aria-label='Edit patient profile'>
              <form className='pt-profile-modal' onSubmit={saveProfileChanges}>
                <div className='pt-profile-modal-head'>
                  <h3>Edit Profile</h3>
                  <button type='button' className='pt-profile-close' onClick={() => setIsProfileEditorOpen(false)}>
                    Close
                  </button>
                </div>

                <div className='pt-profile-summary'>
                  <article>
                    <span>Patient ID</span>
                    <strong>{patientTrustId}</strong>
                  </article>
                  <article>
                    <span>Trust Score</span>
                    <strong>{trustScore}%</strong>
                  </article>
                  <article>
                    <span>Active Prescriptions</span>
                    <strong>{activePrescriptions}</strong>
                  </article>
                </div>

                <div className='pt-profile-grid'>
                  <label>
                    Full Name
                    <input
                      type='text'
                      value={profileDraft.name}
                      onChange={(event) => handleProfileDraftChange('name', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type='email'
                      value={profileDraft.email}
                      onChange={(event) => handleProfileDraftChange('email', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Phone
                    <input
                      type='text'
                      value={profileDraft.phone}
                      onChange={(event) => handleProfileDraftChange('phone', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Aadhaar ID
                    <input
                      type='text'
                      value={profileDraft.aadhaarId}
                      onChange={(event) => handleProfileDraftChange('aadhaarId', event.target.value)}
                    />
                  </label>
                  <label>
                    Blood Group
                    <input
                      type='text'
                      value={profileDraft.bloodGroup}
                      onChange={(event) => handleProfileDraftChange('bloodGroup', event.target.value)}
                    />
                  </label>
                  <label>
                    Date Of Birth
                    <input
                      type='date'
                      value={profileDraft.dateOfBirth}
                      onChange={(event) => handleProfileDraftChange('dateOfBirth', event.target.value)}
                    />
                  </label>
                  <label>
                    Emergency Contact
                    <input
                      type='text'
                      value={profileDraft.emergencyContact}
                      onChange={(event) => handleProfileDraftChange('emergencyContact', event.target.value)}
                    />
                  </label>
                  <label className='full-width'>
                    Address
                    <textarea
                      rows='3'
                      value={profileDraft.address}
                      onChange={(event) => handleProfileDraftChange('address', event.target.value)}
                    />
                  </label>
                </div>

                <div className='pt-profile-actions'>
                  <button type='button' className='pt-action-btn secondary' onClick={() => setIsProfileEditorOpen(false)}>
                    Cancel
                  </button>
                  <button type='submit' className='pt-action-btn'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboardPage

