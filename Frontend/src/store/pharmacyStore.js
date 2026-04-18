import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = rawApiUrl && rawApiUrl !== 'undefined' ? rawApiUrl : 'https://api.medicares.in';
const STORAGE_KEY = 'pharmacy_session';
const ACCOUNTS_STORAGE_KEY = 'pharmacy_accounts';

let notificationIntervalId = null;

const nowIso = () => new Date().toISOString();
const normalizeEmail = (value = '') => value.trim().toLowerCase();

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

export const PHARMACY_MOCK_LICENSE_DATA = {
  license_id: 'MH-PHARMA-45821',
  pharmacy_name: 'HealthCare Medico',
  owner_name: 'Rahul Sharma',
  pharmacist_name: 'Rahul Sharma',
  pharmacist_registration_no: 'PCI-MH-998877',
  state: 'Maharashtra',
  city: 'Mumbai',
  district: 'Mumbai Suburban',
  pincode: '400069',
  address: 'Shop No. 12, Andheri East, Mumbai, Maharashtra - 400069',
  issued_by: 'State Pharmacy Council',
  issuing_authority_code: 'SPC-MH-01',
  issue_date: '2023-01-01',
  expiry_date: '2028-12-31',
  last_renewal_date: '2023-01-01',
  status: 'VALID',
  contact_details: {
    phone: '+91-9876543210',
    alternate_phone: '+91-9123456780',
    email: 'healthcaremedico@gmail.com',
    website: 'https://healthcaremedico.in',
  },
  registration_details: {
    registration_number: 'REG-MH-2023-45821',
    business_type: 'Retail Pharmacy',
    ownership_type: 'Individual',
    gst_number: '27ABCDE1234F1Z5',
    pan_number: 'ABCDE1234F',
  },
  compliance: {
    drug_license_type: 'Form 20 & 21',
    schedule_handling: ['Schedule H', 'Schedule H1'],
    narcotics_license: false,
    last_inspection_date: '2025-06-15',
    inspection_status: 'PASSED',
    violations_reported: false,
  },
  operational_details: {
    opening_hours: '08:00 AM',
    closing_hours: '10:00 PM',
    is_24x7: false,
    home_delivery_available: true,
    online_ordering: true,
  },
  geo_location: {
    latitude: 19.1197,
    longitude: 72.8468,
  },
  verification: {
    is_valid: true,
    confidence_score: 95,
    verified_on: '2026-04-18T10:30:00Z',
    verification_method: 'Database + Format Validation',
    fraud_flag: false,
  },
  audit_trail: {
    created_at: '2023-01-01T09:00:00Z',
    updated_at: '2026-04-10T12:00:00Z',
    verified_by: 'System Auto Check',
  },
};

const getStoredAccounts = () => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredAccounts = (accounts) => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage write errors and keep in-memory state.
  }
};

const buildPharmacyProfile = (licenseData, overrides = {}) => {
  const pharmacyName = (overrides.pharmacyName || licenseData.pharmacy_name || 'VitalCare Pharmacy').trim();
  const initials =
    pharmacyName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'PH';

  return {
    id: `pharm-${(licenseData.license_id || 'unknown').toLowerCase()}`,
    role: 'pharmacy',
    name: pharmacyName,
    ownerName: (overrides.ownerName || licenseData.owner_name || '').trim(),
    pharmacistName: (overrides.pharmacistName || licenseData.pharmacist_name || '').trim(),
    pharmacistRegistrationNo: (
      overrides.pharmacistRegistrationNo || licenseData.pharmacist_registration_no || ''
    ).trim(),
    email: normalizeEmail(overrides.email || licenseData.contact_details?.email || ''),
    phone: (overrides.phone || licenseData.contact_details?.phone || '').trim(),
    alternatePhone: (overrides.alternatePhone || licenseData.contact_details?.alternate_phone || '').trim(),
    website: (overrides.website || licenseData.contact_details?.website || '').trim(),
    state: (overrides.state || licenseData.state || '').trim(),
    city: (overrides.city || licenseData.city || '').trim(),
    district: (overrides.district || licenseData.district || '').trim(),
    pincode: (overrides.pincode || licenseData.pincode || '').trim(),
    address: (overrides.address || licenseData.address || '').trim(),
    gstNumber: (overrides.gstNumber || licenseData.registration_details?.gst_number || '').trim(),
    registrationNumber: (
      overrides.registrationNumber || licenseData.registration_details?.registration_number || ''
    ).trim(),
    ownershipType: (overrides.ownershipType || licenseData.registration_details?.ownership_type || '').trim(),
    businessType: (overrides.businessType || licenseData.registration_details?.business_type || '').trim(),
    panNumber: (overrides.panNumber || licenseData.registration_details?.pan_number || '').trim(),
    isLicenseVerified: Boolean(licenseData.verification?.is_valid),
    licenseStatus:
      (licenseData.status || '').toUpperCase() === 'VALID'
        ? 'active'
        : (licenseData.status || '').toUpperCase() === 'EXPIRED'
        ? 'expired'
        : 'pending',
    licenseNumber: (overrides.licenseId || licenseData.license_id || '').trim(),
    licenseType: (overrides.licenseType || licenseData.registration_details?.business_type || '').trim(),
    issuingAuthority: (overrides.issuedBy || licenseData.issued_by || '').trim(),
    issueDate: (overrides.issueDate || licenseData.issue_date || '').trim(),
    validUntil: (overrides.expiryDate || licenseData.expiry_date || '').trim(),
    lastRenewalDate: (overrides.lastRenewalDate || licenseData.last_renewal_date || '').trim(),
    registeredSince: (licenseData.issue_date || '').slice(0, 4),
    confidenceScore: licenseData.verification?.confidence_score || 0,
    verificationMethod: licenseData.verification?.verification_method || '',
    isFraudFlagged: Boolean(licenseData.verification?.fraud_flag),
    latitude: licenseData.geo_location?.latitude || null,
    longitude: licenseData.geo_location?.longitude || null,
    initials,
    avatarColor: '#0f766e',
    licenseData,
  };
};

const buildPharmacyAccount = (licenseData, overrides = {}) => {
  const profile = buildPharmacyProfile(licenseData, overrides);
  return {
    id: licenseData.registration_details?.registration_number || licenseData.license_id,
    email: profile.email,
    password: overrides.password || 'Pharmacy@123',
    licenseId: profile.licenseNumber,
    profile,
  };
};

const mapApiPharmacyToOverrides = (pharmacy = {}) => ({
  pharmacyName: pharmacy.pharmacyName || pharmacy.name || pharmacy.pharmacy_name,
  ownerName: pharmacy.ownerName || pharmacy.owner_name,
  pharmacistName: pharmacy.pharmacistName || pharmacy.pharmacist_name,
  pharmacistRegistrationNo:
    pharmacy.pharmacistRegistrationNo || pharmacy.pharmacist_registration_no,
  email: pharmacy.email,
  phone: pharmacy.phone,
  alternatePhone: pharmacy.alternatePhone || pharmacy.alternate_phone,
  website: pharmacy.website,
  state: pharmacy.state,
  city: pharmacy.city,
  district: pharmacy.district,
  pincode: pharmacy.pincode,
  address: pharmacy.address,
  gstNumber: pharmacy.gstNumber || pharmacy.gst_number,
  registrationNumber: pharmacy.registrationNumber || pharmacy.registration_number,
  ownershipType: pharmacy.ownershipType || pharmacy.ownership_type,
  businessType: pharmacy.businessType || pharmacy.business_type,
  panNumber: pharmacy.panNumber || pharmacy.pan_number,
  licenseId: pharmacy.licenseId || pharmacy.license_id || pharmacy.licenseNumber,
  licenseType: pharmacy.licenseType,
  issuedBy: pharmacy.issuedBy || pharmacy.issued_by || pharmacy.issuingAuthority,
  issueDate: pharmacy.issueDate || pharmacy.issue_date,
  expiryDate: pharmacy.expiryDate || pharmacy.expiry_date || pharmacy.validUntil,
  lastRenewalDate: pharmacy.lastRenewalDate || pharmacy.last_renewal_date,
});

const ensureSeededAccounts = () => {
  const storedAccounts = getStoredAccounts();
  if (storedAccounts.length > 0) {
    return storedAccounts;
  }

  const seededAccounts = [
    buildPharmacyAccount(PHARMACY_MOCK_LICENSE_DATA, {
      password: 'Pharmacy@123',
    }),
  ];

  saveStoredAccounts(seededAccounts);
  return seededAccounts;
};

const appendNotification = (state, notification) => {
  const notifications = [notification, ...state.notifications].slice(0, 60);
  const unreadNotificationsCount = notifications.filter((item) => !item.read).length;
  return { notifications, unreadNotificationsCount };
};

ensureSeededAccounts();
const session = getStoredSession();

export const usePharmacyStore = create((set, get) => ({
  isAuthenticated: Boolean(session?.pharmacy),
  pharmacy: session?.pharmacy || null,
  token: session?.token || null,
  isLoading: false,
  isCheckingAuth: false,
  error: null,
  notifications: seedNotifications,
  unreadNotificationsCount: seedNotifications.filter((item) => !item.read).length,

  clearErrors: () => set({ error: null }),

  checkAuthStatus: async () => {
    set({ isCheckingAuth: true, isLoading: true, error: null });

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

    try {
      const response = await axios.get(`${API_URL}/api/pharmacy/check-auth`, {
        withCredentials: true,
        timeout: 4000,
      });

      if (response.data?.success && response.data?.pharmacy) {
        const pharmacy = {
          ...buildPharmacyProfile(
            PHARMACY_MOCK_LICENSE_DATA,
            mapApiPharmacyToOverrides(response.data.pharmacy)
          ),
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
      // Fall back to unauthenticated state when backend check is unavailable.
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
        timeout: 5000,
      });

      if (response.data?.success && response.data?.pharmacy) {
        const pharmacy = {
          ...buildPharmacyProfile(
            PHARMACY_MOCK_LICENSE_DATA,
            mapApiPharmacyToOverrides(response.data.pharmacy)
          ),
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
      const normalizedEmail = normalizeEmail(credentials?.email || '');
      const accounts = ensureSeededAccounts();
      const matchedAccount = accounts.find(
        (account) =>
          normalizeEmail(account.email) === normalizedEmail &&
          account.password === credentials?.password
      );

      if (matchedAccount) {
        const pharmacy = matchedAccount.profile;
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

      const message =
        error?.response?.data?.message || 'Invalid pharmacy email or password.';
      set({ isLoading: false, error: message });
      toast.error(message);
      return false;
    }
  },

  registerPharmacy: async (payload) => {
    set({ isLoading: true, error: null });

    const normalizedEmail = normalizeEmail(payload?.email || '');
    const normalizedLicenseId = (payload?.licenseId || '').trim().toUpperCase();

    try {
      const response = await axios.post(
        `${API_URL}/api/pharmacy/register`,
        payload,
        {
          withCredentials: true,
          timeout: 5000,
        }
      );

      if (response.data?.success && response.data?.pharmacy) {
        const pharmacy = {
          ...buildPharmacyProfile(
            PHARMACY_MOCK_LICENSE_DATA,
            mapApiPharmacyToOverrides(response.data.pharmacy)
          ),
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

        toast.success('Pharmacy registration successful.');
        return true;
      }

      throw new Error('Invalid pharmacy registration response.');
    } catch {
      if (!normalizedEmail || !payload?.password || !normalizedLicenseId) {
        const message = 'Please complete required registration fields.';
        set({ isLoading: false, error: message });
        toast.error(message);
        return false;
      }

      if (normalizedLicenseId !== PHARMACY_MOCK_LICENSE_DATA.license_id) {
        const message = `Mock verification failed. Use license ID ${PHARMACY_MOCK_LICENSE_DATA.license_id}.`;
        set({ isLoading: false, error: message });
        toast.error(message);
        return false;
      }

      const accounts = ensureSeededAccounts();
      const existingAccount = accounts.find(
        (account) => normalizeEmail(account.email) === normalizedEmail
      );

      if (existingAccount) {
        const message = 'A pharmacy account already exists with this email.';
        set({ isLoading: false, error: message });
        toast.error(message);
        return false;
      }

      const licenseData = {
        ...PHARMACY_MOCK_LICENSE_DATA,
        pharmacy_name: (payload?.pharmacyName || PHARMACY_MOCK_LICENSE_DATA.pharmacy_name).trim(),
        owner_name: (payload?.ownerName || PHARMACY_MOCK_LICENSE_DATA.owner_name).trim(),
        pharmacist_name: (payload?.pharmacistName || PHARMACY_MOCK_LICENSE_DATA.pharmacist_name).trim(),
        pharmacist_registration_no:
          (payload?.pharmacistRegistrationNo ||
            PHARMACY_MOCK_LICENSE_DATA.pharmacist_registration_no).trim(),
        state: (payload?.state || PHARMACY_MOCK_LICENSE_DATA.state).trim(),
        city: (payload?.city || PHARMACY_MOCK_LICENSE_DATA.city).trim(),
        district: (payload?.district || PHARMACY_MOCK_LICENSE_DATA.district).trim(),
        pincode: (payload?.pincode || PHARMACY_MOCK_LICENSE_DATA.pincode).trim(),
        address: (payload?.address || PHARMACY_MOCK_LICENSE_DATA.address).trim(),
        audit_trail: {
          ...PHARMACY_MOCK_LICENSE_DATA.audit_trail,
          updated_at: nowIso(),
        },
        verification: {
          ...PHARMACY_MOCK_LICENSE_DATA.verification,
          verified_on: nowIso(),
        },
        contact_details: {
          ...PHARMACY_MOCK_LICENSE_DATA.contact_details,
          email: normalizedEmail,
          phone: (payload?.phone || PHARMACY_MOCK_LICENSE_DATA.contact_details.phone).trim(),
        },
        registration_details: {
          ...PHARMACY_MOCK_LICENSE_DATA.registration_details,
          gst_number: (payload?.gstNumber || PHARMACY_MOCK_LICENSE_DATA.registration_details.gst_number).trim(),
        },
      };

      const newAccount = buildPharmacyAccount(licenseData, {
        password: payload.password,
      });
      const nextAccounts = [newAccount, ...accounts];
      saveStoredAccounts(nextAccounts);

      saveStoredSession({ pharmacy: newAccount.profile, token: 'mock-pharmacy-token' });

      set({
        isAuthenticated: true,
        pharmacy: newAccount.profile,
        token: 'mock-pharmacy-token',
        isLoading: false,
        error: null,
      });

      toast.success('Pharmacy registered with mock verification data.');
      return true;
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

  scanDigitalPrescriptionQr: async (qrData) => {
    const trimmedQrData = typeof qrData === 'string' ? qrData.trim() : '';
    if (!trimmedQrData) {
      const message = 'QR payload is required for scan validation.';
      set({ error: message });
      throw new Error(message);
    }

    set({ isLoading: true, error: null });

    const currentPharmacy = get().pharmacy;
    const currentToken = get().token;
    const requestBody = {
      qrData: trimmedQrData,
      pharmacyName: currentPharmacy?.name || 'Pharmacy',
      pharmacyLicenseId: currentPharmacy?.licenseNumber || null,
    };

    const hasUsableToken =
      Boolean(currentToken) && currentToken !== 'mock-pharmacy-token';

    try {
      if (hasUsableToken) {
        const protectedResponse = await axios.post(
          `${API_URL}/api/hospital/digital-prescriptions/scan`,
          requestBody,
          {
            withCredentials: true,
            timeout: 8000,
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        set({ isLoading: false, error: null });
        return protectedResponse.data;
      }

      const publicResponse = await axios.post(
        `${API_URL}/api/hospital/digital-prescriptions/scan/public`,
        requestBody,
        {
          withCredentials: true,
          timeout: 8000,
        }
      );

      set({ isLoading: false, error: null });
      return publicResponse.data;
    } catch (primaryError) {
      // Fallback from protected endpoint to public endpoint in mixed auth/dev setups.
      if (hasUsableToken) {
        try {
          const fallbackResponse = await axios.post(
            `${API_URL}/api/hospital/digital-prescriptions/scan/public`,
            requestBody,
            {
              withCredentials: true,
              timeout: 8000,
            }
          );

          set({ isLoading: false, error: null });
          return fallbackResponse.data;
        } catch (fallbackError) {
          const fallbackMessage =
            fallbackError?.response?.data?.message ||
            'Digital prescription scan failed.';
          set({ isLoading: false, error: fallbackMessage });
          throw fallbackError;
        }
      }

      const message =
        primaryError?.response?.data?.message ||
        'Digital prescription scan failed.';
      set({ isLoading: false, error: message });
      throw primaryError;
    }
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
