import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, FileCheck2, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import { PHARMACY_MOCK_LICENSE_DATA, usePharmacyStore } from '../../store/pharmacyStore';

const PharmacyRegister = () => {
  const navigate = useNavigate();
  const { registerPharmacy, isAuthenticated, isLoading, error, clearErrors } = usePharmacyStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    licenseId: '',
    pharmacyName: '',
    ownerName: '',
    pharmacistName: '',
    pharmacistRegistrationNo: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    district: '',
    pincode: '',
    address: '',
    gstNumber: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/pharmacy/dashboard');
    }

    return () => {
      clearErrors();
    };
  }, [isAuthenticated, navigate, clearErrors]);

  const setMockData = () => {
    setFormData((prev) => ({
      ...prev,
      licenseId: PHARMACY_MOCK_LICENSE_DATA.license_id,
      pharmacyName: PHARMACY_MOCK_LICENSE_DATA.pharmacy_name,
      ownerName: PHARMACY_MOCK_LICENSE_DATA.owner_name,
      pharmacistName: PHARMACY_MOCK_LICENSE_DATA.pharmacist_name,
      pharmacistRegistrationNo: PHARMACY_MOCK_LICENSE_DATA.pharmacist_registration_no,
      email: PHARMACY_MOCK_LICENSE_DATA.contact_details.email,
      phone: PHARMACY_MOCK_LICENSE_DATA.contact_details.phone,
      state: PHARMACY_MOCK_LICENSE_DATA.state,
      city: PHARMACY_MOCK_LICENSE_DATA.city,
      district: PHARMACY_MOCK_LICENSE_DATA.district,
      pincode: PHARMACY_MOCK_LICENSE_DATA.pincode,
      address: PHARMACY_MOCK_LICENSE_DATA.address,
      gstNumber: PHARMACY_MOCK_LICENSE_DATA.registration_details.gst_number,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.licenseId.trim()) nextErrors.licenseId = 'License ID is required';
    if (!formData.pharmacyName.trim()) nextErrors.pharmacyName = 'Pharmacy name is required';
    if (!formData.ownerName.trim()) nextErrors.ownerName = 'Owner name is required';
    if (!formData.pharmacistName.trim()) nextErrors.pharmacistName = 'Pharmacist name is required';
    if (!formData.pharmacistRegistrationNo.trim()) nextErrors.pharmacistRegistrationNo = 'Pharmacist registration no is required';

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) nextErrors.address = 'Address is required';

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
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

    const success = await registerPharmacy({
      licenseId: formData.licenseId,
      pharmacyName: formData.pharmacyName,
      ownerName: formData.ownerName,
      pharmacistName: formData.pharmacistName,
      pharmacistRegistrationNo: formData.pharmacistRegistrationNo,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      city: formData.city,
      district: formData.district,
      pincode: formData.pincode,
      address: formData.address,
      gstNumber: formData.gstNumber,
      password: formData.password,
    });

    if (success) {
      navigate('/pharmacy/dashboard');
    }
  };

  const inputStyle = (field) => ({
    border: formErrors[field] ? '1px solid #ef4444' : '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    fontSize: '0.85rem',
    fontWeight: 500,
  });

  return (
    <>
      <Helmet>
        <title>Pharmacy Register | VitalCode</title>
      </Helmet>

      <div
        className="min-h-screen py-8 px-4"
        style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 45%, #f8fafc 100%)' }}
      >
        <div
          className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: '#fff', border: '1px solid #ccfbf1', boxShadow: '0 18px 48px rgba(15,118,110,0.18)' }}
        >
          <div className="px-6 sm:px-8 py-8" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #115e59 58%, #0f766e 100%)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ShieldCheck style={{ width: 28, height: 28, color: '#99f6e4' }} />
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: 14 }}>Pharmacy Registration</h1>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>
                  Verify license and create your VitalCode pharmacy account
                </p>
              </div>

              <button
                type="button"
                onClick={setMockData}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#ccfbf1', fontSize: '0.78rem', fontWeight: 700 }}
              >
                <FileCheck2 style={{ width: 15, height: 15 }} />
                Auto-fill mock data
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-7">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="licenseId" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    License ID
                  </label>
                  <input
                    id="licenseId"
                    name="licenseId"
                    value={formData.licenseId}
                    onChange={handleChange}
                    placeholder="MH-PHARMA-45821"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('licenseId')}
                  />
                  {formErrors.licenseId && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.licenseId}</p>}
                </div>

                <div>
                  <label htmlFor="pharmacyName" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Pharmacy Name
                  </label>
                  <input
                    id="pharmacyName"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    placeholder="HealthCare Medico"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('pharmacyName')}
                  />
                  {formErrors.pharmacyName && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.pharmacyName}</p>}
                </div>

                <div>
                  <label htmlFor="ownerName" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Owner Name
                  </label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('ownerName')}
                  />
                  {formErrors.ownerName && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.ownerName}</p>}
                </div>

                <div>
                  <label htmlFor="pharmacistName" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Pharmacist Name
                  </label>
                  <input
                    id="pharmacistName"
                    name="pharmacistName"
                    value={formData.pharmacistName}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('pharmacistName')}
                  />
                  {formErrors.pharmacistName && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.pharmacistName}</p>}
                </div>

                <div>
                  <label htmlFor="pharmacistRegistrationNo" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Pharmacist Registration No
                  </label>
                  <input
                    id="pharmacistRegistrationNo"
                    name="pharmacistRegistrationNo"
                    value={formData.pharmacistRegistrationNo}
                    onChange={handleChange}
                    placeholder="PCI-MH-998877"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('pharmacistRegistrationNo')}
                  />
                  {formErrors.pharmacistRegistrationNo && (
                    <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.pharmacistRegistrationNo}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Phone
                  </label>
                  <div className="mt-2 relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16, color: '#94a3b8' }} />
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91-9876543210"
                      className="w-full rounded-xl pl-9 pr-4 py-2.5"
                      style={inputStyle('phone')}
                    />
                  </div>
                  {formErrors.phone && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Email
                  </label>
                  <div className="mt-2 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16, color: '#94a3b8' }} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="healthcaremedico@gmail.com"
                      className="w-full rounded-xl pl-9 pr-4 py-2.5"
                      style={inputStyle('email')}
                    />
                  </div>
                  {formErrors.email && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="state" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('state')}
                  />
                </div>

                <div>
                  <label htmlFor="city" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('city')}
                  />
                </div>

                <div>
                  <label htmlFor="district" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    District
                  </label>
                  <input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Mumbai Suburban"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('district')}
                  />
                </div>

                <div>
                  <label htmlFor="pincode" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400069"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('pincode')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Shop No. 12, Andheri East, Mumbai, Maharashtra - 400069"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={{ ...inputStyle('address'), resize: 'vertical' }}
                  />
                  {formErrors.address && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.address}</p>}
                </div>

                <div>
                  <label htmlFor="gstNumber" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    GST Number
                  </label>
                  <input
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="27ABCDE1234F1Z5"
                    className="mt-2 w-full rounded-xl px-3 py-2.5"
                    style={inputStyle('gstNumber')}
                  />
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
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl pl-9 pr-11 py-2.5"
                      style={inputStyle('password')}
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

                <div>
                  <label htmlFor="confirmPassword" style={{ color: '#334155', fontSize: '0.82rem', fontWeight: 600 }}>
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16, color: '#94a3b8' }} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Retype password"
                      className="w-full rounded-xl pl-9 pr-11 py-2.5"
                      style={inputStyle('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff style={{ width: 16, height: 16, color: '#64748b' }} />
                      ) : (
                        <Eye style={{ width: 16, height: 16, color: '#64748b' }} />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '0.76rem', marginTop: 6 }}>{formErrors.confirmPassword}</p>}
                </div>
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
                {isLoading ? 'Creating account...' : 'Create Pharmacy Account'}
              </button>
            </form>

            <div className="mt-6 pt-5" style={{ borderTop: '1px solid #e2e8f0' }}>
              <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center' }}>
                Already registered?{' '}
                <Link to="/pharmacy/login" style={{ color: '#0f766e', fontWeight: 700 }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PharmacyRegister;
