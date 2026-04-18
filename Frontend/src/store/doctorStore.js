import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Fallback prevents requests like ".../undefined/api/..." when env is missing or mis-set.
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL =
  rawApiUrl && rawApiUrl !== 'undefined'
    ? rawApiUrl
    : 'https://api.medicares.in';

const DOCTOR_TOKEN_STORAGE_KEY = 'doctor_auth_token';

const getStoredDoctorToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(DOCTOR_TOKEN_STORAGE_KEY);
};

const persistDoctorToken = (token) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(DOCTOR_TOKEN_STORAGE_KEY, token);
    return;
  }

  localStorage.removeItem(DOCTOR_TOKEN_STORAGE_KEY);
};

const applyDoctorAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

const hydrateToken = getStoredDoctorToken();
applyDoctorAuthHeader(hydrateToken);

// Access the global request throttling mechanism or create it
const requestTimestamps = window.requestTimestamps || {
  profile: 0,
  founderProfile: 0,
  doctorProfile: 0,
};

// Make it globally available to share between stores
window.requestTimestamps = requestTimestamps;

// Minimum time between identical requests (in milliseconds)
const REQUEST_THROTTLE_MS = 5000; // 5 seconds

// Check if a request should be throttled
const shouldThrottleRequest = (key) => {
  const now = Date.now();
  if (now - requestTimestamps[key] < REQUEST_THROTTLE_MS) {
    console.log(`Throttled request to ${key} - too soon after previous request`);
    return true;
  }
  requestTimestamps[key] = now;
  return false;
};

// Global cache for doctor profile
let doctorProfileCache = null;
let doctorProfileCacheTimestamp = 0;
const PROFILE_CACHE_TTL = 30000; // 30 seconds

const commitDoctorLogin = (set, payload) => {
  const token = payload?.token || null;
  persistDoctorToken(token);
  applyDoctorAuthHeader(token);

  set({
    isAuthenticated: true,
    doctor: payload?.doctor || null,
    authToken: token,
    isLoading: false,
    error: null,
  });

  if (payload?.doctor) {
    doctorProfileCache = payload.doctor;
    doctorProfileCacheTimestamp = Date.now();
  }
};

const normalizeOtp = (value) => String(value || '').replace(/\D/g, '').slice(0, 6);

export const useDoctorStore = create((set, get) => ({
  isAuthenticated: false,
  doctor: null,
  authToken: hydrateToken,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  // Shared reports state
  sharedReports: [],
  sharedReportsLoading: false,

  // Check if doctor is already authenticated
  checkAuthStatus: async () => {
    try {
      set({ isCheckingAuth: true, error: null });

      const persistedToken = getStoredDoctorToken();
      const authToken = get().authToken || persistedToken || null;

      const response = await axios.get(`${API_URL}/api/doctor/check-auth`, {
        withCredentials: true,
        headers: authToken
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : undefined,
      });

      if (response.data.success) {
        const token = authToken || response.data?.token || null;
        if (token) {
          persistDoctorToken(token);
          applyDoctorAuthHeader(token);
        }

        set({
          isAuthenticated: true,
          doctor: response.data.doctor,
          authToken: token,
          isCheckingAuth: false,
        });
        return true;
      }

      persistDoctorToken(null);
      applyDoctorAuthHeader(null);
      set({
        isAuthenticated: false,
        doctor: null,
        authToken: null,
        isCheckingAuth: false,
      });
      return false;
    } catch (error) {
      persistDoctorToken(null);
      applyDoctorAuthHeader(null);
      set({
        isAuthenticated: false,
        doctor: null,
        authToken: null,
        error: error.response?.data?.message || 'Authentication failed',
        isCheckingAuth: false,
      });
      return false;
    }
  },

  // Doctor signup
  signupDoctor: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/api/doctor/signup`, payload, {
        withCredentials: true,
      });

      set({ isLoading: false });

      if (response.data.success) {
        toast.success('Registration successful! You can now log in.');
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Doctor signup error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      });
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    }
  },

  // Step 1: Login with email+password to start biometric/OTP verification
  initiateDoctorLogin: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/api/doctor/login`, credentials, {
        withCredentials: true,
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed. Please check your credentials.',
      });
      throw error;
    }
  },

  // Backward-compatible alias (old caller path)
  loginDoctor: async (credentials) => {
    return get().initiateDoctorLogin(credentials);
  },

  // Step 2a: Complete login with biometric assertion
  completeDoctorLoginBiometric: async ({ email, challengeToken, authenticationResponse }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(
        `${API_URL}/api/doctor/login/biometric/verify`,
        {
          email,
          challengeToken,
          authenticationResponse,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        commitDoctorLogin(set, response.data);
        toast.success('Login successful!');
      }

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Biometric verification failed.',
      });
      throw error;
    }
  },

  requestDoctorLoginOtp: async ({ email, challengeToken }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(
        `${API_URL}/api/doctor/login/fallback/request-otp`,
        { email, challengeToken },
        { withCredentials: true }
      );

      set({ isLoading: false });
      toast.success('OTP sent to your email');
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to send OTP',
      });
      throw error;
    }
  },

  // Step 2b: Complete login with OTP fallback
  completeDoctorLoginOtp: async ({ email, challengeToken, otp }) => {
    try {
      set({ isLoading: true, error: null });
      const normalizedOtp = normalizeOtp(otp);
      const response = await axios.post(
        `${API_URL}/api/doctor/login/fallback/verify-otp`,
        { email, challengeToken, otp: normalizedOtp },
        { withCredentials: true }
      );

      if (response.data.success) {
        commitDoctorLogin(set, response.data);
        toast.success('Login successful!');
      }

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Invalid OTP',
      });
      throw error;
    }
  },

  fetchDoctorBiometricStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/doctor/biometric/status`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch biometric status:', error);
      return { success: false, biometricRegistered: false, credentialCount: 0 };
    }
  },

  startDoctorBiometricRegistration: async () => {
    const response = await axios.post(
      `${API_URL}/api/doctor/biometric/register/options`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  completeDoctorBiometricRegistration: async (registrationResponse) => {
    const response = await axios.post(
      `${API_URL}/api/doctor/biometric/register/verify`,
      { registrationResponse },
      { withCredentials: true }
    );

    if (response.data?.success) {
      set((state) => ({
        doctor: state.doctor
          ? {
              ...state.doctor,
              biometricRegistered: true,
            }
          : state.doctor,
      }));
    }

    return response.data;
  },

  initiatePrescriptionVerification: async () => {
    const response = await axios.post(
      `${API_URL}/api/doctor/prescription-verification/initiate`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  verifyPrescriptionBiometric: async ({ challengeToken, authenticationResponse }) => {
    const response = await axios.post(
      `${API_URL}/api/doctor/prescription-verification/biometric/verify`,
      {
        challengeToken,
        authenticationResponse,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  requestPrescriptionVerificationOtp: async ({ challengeToken }) => {
    const response = await axios.post(
      `${API_URL}/api/doctor/prescription-verification/fallback/request-otp`,
      { challengeToken },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  verifyPrescriptionVerificationOtp: async ({ challengeToken, otp }) => {
    const normalizedOtp = normalizeOtp(otp);
    const response = await axios.post(
      `${API_URL}/api/doctor/prescription-verification/fallback/verify-otp`,
      {
        challengeToken,
        otp: normalizedOtp,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  // Doctor logout
  logoutDoctor: async () => {
    try {
      set({ isLoading: true });

      await axios.post(
        `${API_URL}/api/doctor/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      doctorProfileCache = null;
      doctorProfileCacheTimestamp = 0;
      persistDoctorToken(null);
      applyDoctorAuthHeader(null);

      set({
        isAuthenticated: false,
        doctor: null,
        authToken: null,
        isLoading: false,
      });

      toast.success('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Doctor logout error:', error);
      set({ isLoading: false });
      toast.error('Logout failed');
      return false;
    }
  },

  // Get doctor profile
  getDoctorProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const now = Date.now();
      if (doctorProfileCache && now - doctorProfileCacheTimestamp < PROFILE_CACHE_TTL) {
        console.log('Using cached doctor profile data');
        set({
          doctor: doctorProfileCache,
          isLoading: false,
        });
        return doctorProfileCache;
      }

      if (shouldThrottleRequest('doctorProfile')) {
        console.log('Throttled doctor profile request - using existing data');
        set({ isLoading: false });
        return get().doctor;
      }

      const response = await axios.get(`${API_URL}/api/doctor/profile`, {
        withCredentials: true,
      });

      if (response.data.success) {
        doctorProfileCache = response.data.doctor;
        doctorProfileCacheTimestamp = now;

        set({
          doctor: response.data.doctor,
          isLoading: false,
        });

        return response.data.doctor;
      }

      set({ isLoading: false });
      return null;
    } catch (error) {
      console.error('Get doctor profile error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      });

      toast.error(error.response?.data?.message || 'Failed to fetch profile');
      return null;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axios.post(`${API_URL}/api/doctor/reset-password`, { email });

      set({ isLoading: false });

      if (response.data.success) {
        toast.success('If your email is registered, a password reset link will be sent');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Password reset request error:', error);
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to request password reset',
      });

      toast.error(error.response?.data?.message || 'Failed to request password reset');
      return false;
    }
  },

  // Clear errors
  clearErrors: () => set({ error: null }),

  // ===== SHARED REPORTS FUNCTIONALITY =====

  // Fetch all shared reports for the doctor
  fetchSharedReports: async () => {
    try {
      set({ sharedReportsLoading: true });
      const response = await axios.get(`${API_URL}/api/doctor/shared-reports`, {
        withCredentials: true,
      });
      set({
        sharedReports: response.data.shares || [],
        sharedReportsLoading: false,
      });
      return response.data.shares;
    } catch (error) {
      console.error('Error fetching shared reports:', error);
      set({ sharedReportsLoading: false });
      return [];
    }
  },

  // View a specific shared report (returns report data with signed URL)
  viewSharedReport: async (shareId, reportId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/doctor/shared-reports/${shareId}/reports/${reportId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error viewing shared report:', error);
      toast.error(error.response?.data?.message || 'Failed to view report');
      return null;
    }
  },

  // Add a note to a shared report
  addNoteToShare: async (shareId, { text, type }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/doctor/shared-reports/${shareId}/notes`,
        { text, type },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Update the notes in the local state
        set((state) => ({
          sharedReports: state.sharedReports.map((share) =>
            share._id === shareId ? { ...share, notes: response.data.notes } : share
          ),
        }));
        toast.success('Note added successfully');
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add note');
      return null;
    }
  },
}));
