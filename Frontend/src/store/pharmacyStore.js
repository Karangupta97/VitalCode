import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl && rawApiUrl !== 'undefined' ? rawApiUrl : 'https://api.medicares.in';
const STORAGE_KEY = 'pharmacy_session';

let notificationIntervalId = null;

const nowIso = () => new Date().toISOString();

const createNotification = (type, title, message) => ({
  id: `pharm-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  type,
  title,
  message,
  createdAt: nowIso(),
  read: false,
});

const seedNotifications = [
  {
    id: 'seed-1',
    type: 'doctor-request',
    title: 'New Doctor Stock Request',
    message: 'Dr. Khanna requested 30 units of Metformin 500mg.',
    createdAt: nowIso(),
    read: false,
  },
  {
    id: 'seed-2',
    type: 'scan',
    title: 'Prescription Scan Attempt',
    message: 'RX203944 was verified successfully 12 minutes ago.',
    createdAt: nowIso(),
    read: false,
  },
  {
    id: 'seed-3',
    type: 'license',
    title: 'License Expiry Reminder',
    message: 'Your license expires in 60 days. Start renewal to avoid interruption.',
    createdAt: nowIso(),
    read: true,
  },
];

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredSession = (session) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage write errors and keep in-memory state.
  }
};

const clearStoredSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage delete errors.
  }
};

const buildMockPharmacyProfile = (email = 'pharmacy@vitalcode.in') => {
  const nameChunk = email.split('@')[0] || 'Central';
  const normalizedName = nameChunk
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    id: 'pharm-001',
    role: 'pharmacy',
    name: normalizedName ? `${normalizedName} Pharmacy` : 'VitalCare Pharmacy',
    ownerName: 'Ananya Deshmukh',
    email,
    phone: '+91 98765 12045',
    address: 'Shop 12, Greenline Plaza, Baner Road, Pune, Maharashtra 411045',
    gstNumber: '27AABCV2034K1ZP',
    isLicenseVerified: true,
    licenseStatus: 'active',
    licenseNumber: 'PH-MH-20345',
    licenseType: 'Retail Pharmacy',
    issuingAuthority: 'Maharashtra State Pharmacy Council',
    issueDate: '2024-01-01',
    validUntil: '2026-12-31',
    registeredSince: '2022',
    pharmacistName: 'R. Patil',
    initials: 'VP',
    avatarColor: '#0f766e',
  };
};

const appendNotification = (state, notification) => {
  const notifications = [notification, ...state.notifications].slice(0, 60);
  const unreadNotificationsCount = notifications.filter((item) => !item.read).length;
  return { notifications, unreadNotificationsCount };
};

const session = getStoredSession();

export const usePharmacyStore = create((set, get) => ({
  isAuthenticated: Boolean(session?.pharmacy),
  pharmacy: session?.pharmacy || null,
  token: session?.token || null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  notifications: seedNotifications,
  unreadNotificationsCount: seedNotifications.filter((item) => !item.read).length,

  clearErrors: () => set({ error: null }),

  checkAuthStatus: async () => {
    set({ isCheckingAuth: true, isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/api/pharmacy/check-auth`, {
        withCredentials: true,
      });

      if (response.data?.success && response.data?.pharmacy) {
        const pharmacy = {
          ...buildMockPharmacyProfile(response.data.pharmacy?.email),
          ...response.data.pharmacy,
          role: 'pharmacy',
        };

        saveStoredSession({ pharmacy, token: response.data?.token || null });

        set({
          isAuthenticated: true,
          pharmacy,
          token: response.data?.token || null,
          isLoading: false,
          isCheckingAuth: false,
        });

        return true;
      }
    } catch {
      const stored = getStoredSession();
      if (stored?.pharmacy) {
        set({
          isAuthenticated: true,
          pharmacy: stored.pharmacy,
          token: stored.token || null,
          isLoading: false,
          isCheckingAuth: false,
        });
        return true;
      }
    }

    set({
      isAuthenticated: false,
      pharmacy: null,
      token: null,
      isLoading: false,
      isCheckingAuth: false,
    });

    return false;
  },

  loginPharmacy: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/api/pharmacy/login`, credentials, {
        withCredentials: true,
      });

      if (response.data?.success && response.data?.pharmacy) {
        const pharmacy = {
          ...buildMockPharmacyProfile(response.data.pharmacy?.email),
          ...response.data.pharmacy,
          role: 'pharmacy',
        };

        saveStoredSession({ pharmacy, token: response.data?.token || null });

        set({
          isAuthenticated: true,
          pharmacy,
          token: response.data?.token || null,
          isLoading: false,
          error: null,
        });

        toast.success('Pharmacy login successful.');
        return true;
      }

      throw new Error('Invalid pharmacy login response.');
    } catch (error) {
      if (credentials?.email && credentials?.password) {
        const pharmacy = buildMockPharmacyProfile(credentials.email);
        saveStoredSession({ pharmacy, token: 'mock-pharmacy-token' });

        set({
          isAuthenticated: true,
          pharmacy,
          token: 'mock-pharmacy-token',
          isLoading: false,
          error: null,
        });

        toast.success('Logged in with pharmacy demo session.');
        return true;
      }

      const message = error?.response?.data?.message || 'Pharmacy login failed.';
      set({ isLoading: false, error: message });
      toast.error(message);
      return false;
    }
  },

  logoutPharmacy: async () => {
    set({ isLoading: true });

    try {
      await axios.post(
        `${API_URL}/api/pharmacy/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch {
      // Allow local logout even when backend route is unavailable.
    }

    get().stopNotificationPolling();
    clearStoredSession();
    set({
      isAuthenticated: false,
      pharmacy: null,
      token: null,
      isLoading: false,
      error: null,
      notifications: seedNotifications,
      unreadNotificationsCount: seedNotifications.filter((item) => !item.read).length,
    });

    toast.success('Pharmacy logged out.');
    return true;
  },

  getPharmacyProfile: async () => {
    const currentPharmacy = get().pharmacy;
    if (currentPharmacy) {
      return currentPharmacy;
    }

    const stored = getStoredSession();
    if (stored?.pharmacy) {
      set({ pharmacy: stored.pharmacy, isAuthenticated: true });
      return stored.pharmacy;
    }

    return null;
  },

  updatePharmacyProfile: async (updates) => {
    const current = get().pharmacy;
    if (!current) {
      toast.error('No pharmacy session found. Please login again.');
      return false;
    }

    const nextPharmacy = {
      ...current,
      ...updates,
    };

    const currentSession = getStoredSession();
    saveStoredSession({
      pharmacy: nextPharmacy,
      token: currentSession?.token || get().token || null,
    });

    set({ pharmacy: nextPharmacy });
    toast.success('Pharmacy details updated.');
    return true;
  },

  markNotificationAsRead: (notificationId) => {
    set((state) => {
      const notifications = state.notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      );
      return {
        notifications,
        unreadNotificationsCount: notifications.filter((item) => !item.read).length,
      };
    });
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
      unreadNotificationsCount: 0,
    }));
  },

  pushPrescriptionScanNotification: (status, prescriptionId) => {
    const statusLabel = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'already dispensed';
    set((state) =>
      appendNotification(
        state,
        createNotification(
          'scan',
          'Prescription Scan Attempt',
          `${prescriptionId} scan marked ${statusLabel}.`
        )
      )
    );
  },

  pushDoctorRequestNotification: (requestId, doctorName) => {
    set((state) =>
      appendNotification(
        state,
        createNotification(
          'doctor-request',
          'New Doctor Stock Request',
          `${doctorName} created stock request ${requestId}.`
        )
      )
    );
  },

  pushLicenseReminderNotification: (daysLeft) => {
    set((state) =>
      appendNotification(
        state,
        createNotification(
          'license',
          'License Expiry Reminder',
          `License renewal window active. ${daysLeft} days left before expiry.`
        )
      )
    );
  },

  startNotificationPolling: () => {
    if (notificationIntervalId) return;

    const pollTemplates = [
      () =>
        createNotification(
          'doctor-request',
          'New Doctor Stock Request',
          `Clinic order received for ${Math.floor(10 + Math.random() * 80)} units of Cefixime 200mg.`
        ),
      () =>
        createNotification(
          'scan',
          'Prescription Scan Attempt',
          `Scan event: RX${Math.floor(100000 + Math.random() * 900000)} verified.`
        ),
      () =>
        createNotification(
          'license',
          'License Expiry Reminder',
          'Reminder triggered for upcoming 30-day license renewal window.'
        ),
    ];

    notificationIntervalId = window.setInterval(() => {
      const shouldPush = Math.random() >= 0.55;
      if (!shouldPush) return;

      const template = pollTemplates[Math.floor(Math.random() * pollTemplates.length)];
      set((state) => appendNotification(state, template()));
    }, 25000);
  },

  stopNotificationPolling: () => {
    if (notificationIntervalId) {
      window.clearInterval(notificationIntervalId);
      notificationIntervalId = null;
    }
  },
}));
