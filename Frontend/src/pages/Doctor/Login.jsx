import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDoctorStore } from '../../store/doctorStore';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiShield, FiKey } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import {
  authenticateDoctorBiometric,
  isDoctorBiometricSupported,
} from '../../utils/doctorBiometric';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const {
    initiateDoctorLogin,
    completeDoctorLoginBiometric,
    requestDoctorLoginOtp,
    completeDoctorLoginOtp,
    isAuthenticated,
    isLoading,
    error,
    clearErrors,
  } = useDoctorStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [verificationStage, setVerificationStage] = useState('credentials');
  const [challengeToken, setChallengeToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState('');
  const [isBiometricProcessing, setIsBiometricProcessing] = useState(false);

  const biometricSupported = useMemo(() => isDoctorBiometricSupported(), []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/doctor/dashboard');
    }

    return () => {
      clearErrors();
    };
  }, [isAuthenticated, navigate, clearErrors]);

  const validateForm = () => {
    const errors = {};
    const { email, password } = formData;

    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

    if (!password) errors.password = 'Password is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const requestOtpFallback = async (email, token) => {
    await requestDoctorLoginOtp({ email, challengeToken: token });
    setOtpCode('');
    setOtpRequested(true);
    setVerificationStage('otp');
  };

  const handleBiometricVerification = async ({ email, token, options }) => {
    if (!biometricSupported) {
      setBiometricMessage(
        'Fingerprint biometric is not supported on this browser/device. Use email OTP.'
      );
      await requestOtpFallback(email, token);
      return;
    }

    setIsBiometricProcessing(true);
    setBiometricMessage('Touch your fingerprint sensor to continue login...');

    try {
      const authenticationResponse = await authenticateDoctorBiometric(options);
      await completeDoctorLoginBiometric({
        email,
        challengeToken: token,
        authenticationResponse,
      });
      setBiometricMessage('Biometric verified. Signing you in...');
    } catch (biometricError) {
      console.error('Doctor biometric login failed:', biometricError);
      setBiometricMessage(
        'Biometric verification failed or was cancelled. Email OTP fallback is required.'
      );
      await requestOtpFallback(email, token);
    } finally {
      setIsBiometricProcessing(false);
    }
  };

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setVerificationStage('credentials');
      setOtpRequested(false);
      setOtpCode('');
      setBiometricMessage('');

      const response = await initiateDoctorLogin(formData);
      const token = response?.challengeToken || '';
      const normalizedEmail = response?.email || formData.email;

      if (!token) {
        setBiometricMessage('Unable to start secure verification. Please try again.');
        return;
      }

      setChallengeToken(token);
      setVerificationEmail(normalizedEmail);

      if (response?.requiresBiometric && response?.biometricOptions) {
        await handleBiometricVerification({
          email: normalizedEmail,
          token,
          options: response.biometricOptions,
        });
        return;
      }

      setBiometricMessage('Biometric unavailable for this account. Email OTP fallback is required.');
      await requestOtpFallback(normalizedEmail, token);
    } catch (err) {
      console.error('Login initiation error:', err);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const normalizedOtp = String(otpCode || '').replace(/[^0-9]/g, '').slice(0, 6);

    if (!normalizedOtp || normalizedOtp.length < 6) {
      return;
    }

    try {
      await completeDoctorLoginOtp({
        email: verificationEmail,
        challengeToken,
        otp: normalizedOtp,
      });
    } catch (err) {
      console.error('OTP verification failed:', err);
      const errorMessage = err?.response?.data?.message || '';
      if (errorMessage.toLowerCase().includes('invalid otp')) {
        setBiometricMessage('Invalid OTP. Please enter the latest OTP from email or tap Resend OTP.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Doctor Login | Medicare</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
              <FaUser className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Doctor Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access with fingerprint + email fallback OTP
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {verificationStage === 'credentials' ? (
              <form className="space-y-6" onSubmit={handleCredentialSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="doctor@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`py-2 pl-10 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                        formErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div className="rounded-md bg-indigo-50 p-3 border border-indigo-100">
                  <p className="text-xs text-indigo-700 flex items-center gap-2">
                    <FiShield className="h-4 w-4" />
                    After password validation, fingerprint verification is mandatory. If unavailable, email OTP fallback is used.
                  </p>
                </div>

                {biometricMessage && (
                  <div className="rounded-md bg-blue-50 p-3 border border-blue-100">
                    <p className="text-sm text-blue-700">{biometricMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Login Error</h3>
                        <p className="text-sm text-red-700 mt-2">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || isBiometricProcessing}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || isBiometricProcessing ? 'Processing secure login...' : 'Continue Secure Sign In'}
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <div className="rounded-md bg-amber-50 p-3 border border-amber-100">
                  <p className="text-xs text-amber-800 flex items-center gap-2">
                    <FiKey className="h-4 w-4" />
                    Fingerprint verification failed or unavailable. Enter the OTP sent to {verificationEmail}.
                  </p>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Email OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="mt-1 py-2 px-3 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300 tracking-[0.4em] text-center"
                    placeholder="000000"
                  />
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading || !challengeToken || !verificationEmail}
                    onClick={async () => {
                      clearErrors();
                      setOtpCode('');
                      await requestDoctorLoginOtp({ email: verificationEmail, challengeToken });
                      setOtpRequested(true);
                    }}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpRequested ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationStage('credentials');
                    setOtpCode('');
                    setOtpRequested(false);
                    setChallengeToken('');
                    setVerificationEmail('');
                    setBiometricMessage('');
                    clearErrors();
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to credentials
                </button>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/doctor/signup"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register as a Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
