import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { usePharmacyStore } from '../../store/pharmacyStore';

const PharmacyLogin = () => {
  const navigate = useNavigate();
  const { loginPharmacy, isAuthenticated, isLoading, error, clearErrors } = usePharmacyStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/pharmacy/dashboard');
    }

    return () => {
      clearErrors();
    };
  }, [isAuthenticated, navigate, clearErrors]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const success = await loginPharmacy(formData);
    if (success) {
      navigate('/pharmacy/dashboard');
    }
  };

  return (
    <>
      <Helmet>
        <title>Pharmacy Login | HealthVault</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 45%, #f8fafc 100%)' }}>
        <div className="w-full max-w-md rounded-3xl overflow-hidden" style={{ background: '#fff', border: '1px solid #ccfbf1', boxShadow: '0 18px 48px rgba(15,118,110,0.18)' }}>
          <div className="px-6 sm:px-8 py-8" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #115e59 58%, #0f766e 100%)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <ShieldCheck style={{ width: 28, height: 28, color: '#99f6e4' }} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: 14 }}>Pharmacy Login</h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
              Access your HealthVault pharmacy command center
            </p>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                  Email address
                </label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16, color: '#94a3b8' }} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pharmacy@vitalcode.in"
                    className="w-full rounded-xl pl-9 pr-4 py-2.5"
                    style={{
                      border: formErrors.email ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  />
                </div>
                {formErrors.email && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                  Password
                </label>
                <div className="mt-2 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16, color: '#94a3b8' }} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl pl-9 pr-11 py-2.5"
                    style={{
                      border: formErrors.password ? '1px solid #ef4444' : '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#0f172a',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: 16, height: 16, color: '#64748b' }} />
                    ) : (
                      <Eye style={{ width: 16, height: 16, color: '#64748b' }} />
                    )}
                  </button>
                </div>
                {formErrors.password && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.password}</p>}
              </div>

              {error && (
                <div className="rounded-xl px-3 py-2.5" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <p style={{ color: '#b91c1c', fontSize: '0.8rem', fontWeight: 600 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-2.5 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  boxShadow: '0 6px 18px rgba(15,118,110,0.24)',
                  opacity: isLoading ? 0.8 : 1,
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign in to Pharmacy'}
              </button>

              <div className="rounded-xl px-3 py-2.5" style={{ background: '#f0fdfa', border: '1px solid #99f6e4' }}>
                <p style={{ color: '#0f766e', fontSize: '0.76rem', fontWeight: 700 }}>Mock login details</p>
                <p style={{ color: '#115e59', fontSize: '0.76rem', marginTop: 4 }}>
                  Email: healthcaremedico@gmail.com
                </p>
                <p style={{ color: '#115e59', fontSize: '0.76rem' }}>Password: Pharmacy@123</p>
              </div>
            </form>

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.78rem', textAlign: 'center', marginBottom: 8 }}>
                Sign in as
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Link
                  to="/login"
                  className="rounded-lg py-2 text-center"
                  style={{ border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  User
                </Link>
                <Link
                  to="/doctor/login"
                  className="rounded-lg py-2 text-center"
                  style={{ border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  Doctor
                </Link>
                <div
                  className="rounded-lg py-2 text-center"
                  style={{ border: '1px solid #14b8a6', background: '#f0fdfa', color: '#0f766e', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  Pharmacy
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>
                New pharmacy? <Link to="/pharmacy/register" style={{ color: '#0f766e', fontWeight: 700 }}>Register here</Link>
              </p>
              <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: 6 }}>
                Need staff help? <Link to="/" style={{ color: '#0f766e', fontWeight: 700 }}>Go to home</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyLogin;
