import jwt from "jsonwebtoken";
import { Doctor } from "../../models/Doctor/doctor.model.js";
import crypto from "crypto";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { sendDoctorBiometricOTPEmail } from "../../services/emails/emails.js";

const LOGIN_CHALLENGE_TTL_MS = Number.parseInt(
  process.env.DOCTOR_LOGIN_CHALLENGE_TTL_MS || `${10 * 60 * 1000}`,
  10
);
const LOGIN_OTP_TTL_MS = Number.parseInt(
  process.env.DOCTOR_LOGIN_OTP_TTL_MS || `${10 * 60 * 1000}`,
  10
);
const PRESCRIPTION_CHALLENGE_TTL_MS = Number.parseInt(
  process.env.DOCTOR_PRESCRIPTION_CHALLENGE_TTL_MS || `${10 * 60 * 1000}`,
  10
);
const PRESCRIPTION_OTP_TTL_MS = Number.parseInt(
  process.env.DOCTOR_PRESCRIPTION_OTP_TTL_MS || `${10 * 60 * 1000}`,
  10
);
const PRESCRIPTION_ACTION_TOKEN_TTL_MS = Number.parseInt(
  process.env.DOCTOR_PRESCRIPTION_ACTION_TOKEN_TTL_MS || `${5 * 60 * 1000}`,
  10
);
const OTP_COOLDOWN_MS = Number.parseInt(
  process.env.DOCTOR_OTP_COOLDOWN_MS || "30000",
  10
);
const MAX_OTP_ATTEMPTS = Number.parseInt(
  process.env.DOCTOR_MAX_OTP_ATTEMPTS || "5",
  10
);

const getWebAuthnRpId = () => {
  if (process.env.DOCTOR_WEBAUTHN_RP_ID) {
    return process.env.DOCTOR_WEBAUTHN_RP_ID;
  }

  const fallbackOrigin = process.env.CLIENT_URL || "http://localhost:3000";
  try {
    return new URL(fallbackOrigin).hostname;
  } catch (_error) {
    return "localhost";
  }
};

const getWebAuthnOrigin = () => {
  return process.env.DOCTOR_WEBAUTHN_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000";
};

const WEB_AUTHN_RP_NAME = process.env.DOCTOR_WEBAUTHN_RP_NAME || "Medicare Doctor Portal";
const WEB_AUTHN_RP_ID = getWebAuthnRpId();

const buildDoctorPayload = (doctor) => ({
  id: doctor._id,
  fullName: doctor.fullName,
  email: doctor.email,
  doctorId: doctor.doctorId,
  specialization: doctor.specialization,
  photoURL: doctor.photoURL,
  biometricRegistered: Array.isArray(doctor.biometricCredentials)
    ? doctor.biometricCredentials.length > 0
    : false,
});

const sha256 = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");

const generateOpaqueToken = () => crypto.randomBytes(32).toString("base64url");

const generateOtpCode = () => crypto.randomInt(0, 1000000).toString().padStart(6, "0");

const normalizeOtpInput = (value) => String(value || "").replace(/\D/g, "").slice(0, 6);

const isDateInFuture = (value) => {
  if (!value) {
    return false;
  }
  const date = new Date(value).getTime();
  return Number.isFinite(date) && date > Date.now();
};

const toBase64UrlString = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
    return Buffer.from(value).toString("base64url");
  }

  return "";
};

const clearPendingLoginVerification = (doctor) => {
  doctor.pendingLoginVerification = {
    tokenHash: "",
    challenge: "",
    expiresAt: null,
    otpHash: "",
    otpExpiresAt: null,
    otpAttempts: 0,
    lastOtpSentAt: null,
    method: "",
  };
};

const clearPendingPrescriptionVerification = (doctor) => {
  doctor.pendingPrescriptionVerification = {
    tokenHash: "",
    challenge: "",
    expiresAt: null,
    otpHash: "",
    otpExpiresAt: null,
    otpAttempts: 0,
    lastOtpSentAt: null,
    actionTokenHash: "",
    actionTokenExpiresAt: null,
    actionTokenUsedAt: null,
    method: "",
  };
};

const getWebAuthnAllowCredentials = (doctor) => {
  if (!Array.isArray(doctor.biometricCredentials)) {
    return [];
  }

  return doctor.biometricCredentials
    .filter((credential) => credential?.credentialID)
    .map((credential) => ({
      id: credential.credentialID,
      type: "public-key",
      transports: Array.isArray(credential.transports) ? credential.transports : [],
    }));
};

const getStoredCredentialById = (doctor, credentialID) => {
  if (!Array.isArray(doctor.biometricCredentials) || !credentialID) {
    return null;
  }

  return (
    doctor.biometricCredentials.find((credential) => credential.credentialID === credentialID) || null
  );
};

const issueDoctorLoginSuccess = async (doctor, res, method = "password+biometric") => {
  const token = generateDoctorToken(doctor._id);
  sendSecureCookie(res, token);

  doctor.lastLogin = new Date();
  doctor.pendingLoginVerification = {
    ...(doctor.pendingLoginVerification || {}),
    method,
  };
  await doctor.save();

  return res.status(200).json({
    success: true,
    message: "Login successful",
    doctor: buildDoctorPayload(doctor),
    token,
    authMethod: method,
  });
};

const validatePendingFlowToken = (pendingFlow, token) => {
  if (!pendingFlow?.tokenHash || !pendingFlow?.expiresAt) {
    return false;
  }

  if (!token || sha256(token) !== pendingFlow.tokenHash) {
    return false;
  }

  return isDateInFuture(pendingFlow.expiresAt);
};

const issuePrescriptionActionToken = (doctor, method) => {
  const actionToken = generateOpaqueToken();

  doctor.pendingPrescriptionVerification = {
    ...(doctor.pendingPrescriptionVerification || {}),
    actionTokenHash: sha256(actionToken),
    actionTokenExpiresAt: new Date(Date.now() + PRESCRIPTION_ACTION_TOKEN_TTL_MS),
    actionTokenUsedAt: null,
    method,
  };

  return actionToken;
};

// Generate JWT token for doctor
const generateDoctorToken = (doctorId) => {
  return jwt.sign(
    { id: doctorId, role: "doctor" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" } // Token expires in 8 hours
  );
};

// Set secure HTTP-only cookie with token
const sendSecureCookie = (res, token) => {
  res.cookie("doctor_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });
};

// Doctor signup
export const doctorSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      specialization,
      experience
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Check if doctor already exists with this email
    const DoctorModel = Doctor();
    const existingDoctor = await DoctorModel.findOne({ email });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Generate unique doctor ID
    const doctorId = await DoctorModel.generateDoctorId();

    // Create new doctor – immediately approved, no manual verification needed
    const newDoctor = new DoctorModel({
      fullName,
      email,
      password, // Will be hashed by pre-save hook
      phone,
      specialization: specialization || "",
      experience: experience || 0,
      doctorId
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registration successful. You can now log in.",
      doctorId: newDoctor.doctorId
    });
  } catch (error) {
    console.error("Error in doctorSignup:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Doctor login
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Find the doctor by email
    const DoctorModel = Doctor();
    const normalizedEmail = String(email).toLowerCase().trim();
    const doctor = await DoctorModel.findOne({ email: normalizedEmail });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify password
    const isPasswordValid = await doctor.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const hasBiometric = Array.isArray(doctor.biometricCredentials) && doctor.biometricCredentials.length > 0;
    const challengeToken = generateOpaqueToken();

    let biometricOptions = null;
    let challengeValue = "";

    if (hasBiometric) {
      biometricOptions = await generateAuthenticationOptions({
        rpID: WEB_AUTHN_RP_ID,
        userVerification: "required",
        allowCredentials: getWebAuthnAllowCredentials(doctor),
        timeout: 60000,
      });
      challengeValue = biometricOptions.challenge;
    }

    doctor.pendingLoginVerification = {
      tokenHash: sha256(challengeToken),
      challenge: challengeValue,
      expiresAt: new Date(Date.now() + LOGIN_CHALLENGE_TTL_MS),
      otpHash: "",
      otpExpiresAt: null,
      otpAttempts: 0,
      lastOtpSentAt: null,
      method: "",
    };

    await doctor.save();

    res.status(200).json({
      success: true,
      message: hasBiometric
        ? "Biometric verification required"
        : "Biometric not configured, continue with email OTP",
      requiresBiometric: hasBiometric,
      fallbackAvailable: true,
      biometricRegistered: hasBiometric,
      challengeToken,
      biometricOptions,
      email: doctor.email,
    });
  } catch (error) {
    console.error("Error in doctorLogin:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Doctor logout
export const doctorLogout = async (req, res) => {
  try {
    // Clear the doctor token cookie
    res.clearCookie("doctor_token");
    
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Error in doctorLogout:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get doctor's profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // From auth middleware

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId).select(
      "-password -pendingLoginVerification -pendingPrescriptionVerification -pendingBiometricRegistration"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const doctorProfile = doctor.toObject();
    const biometricCredentialCount = Array.isArray(doctorProfile.biometricCredentials)
      ? doctorProfile.biometricCredentials.length
      : 0;
    delete doctorProfile.biometricCredentials;
    doctorProfile.biometricRegistered = biometricCredentialCount > 0;
    doctorProfile.biometricCredentialCount = biometricCredentialCount;
    
    res.status(200).json({
      success: true,
      doctor: doctorProfile
    });
    
  } catch (error) {
    console.error("Error in getDoctorProfile:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide email"
      });
    }
    
    // Find doctor by email
    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findOne({ email });
    
    if (!doctor) {
      // For security, don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: "If your email is registered, a password reset link will be sent"
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and store in database
    doctor.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
      
    doctor.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    await doctor.save();
    
    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/doctor/reset-password/${resetToken}`;
    
    // Send password reset email
    // Implementation will be added in emailService
    
    res.status(200).json({
      success: true,
      message: "Password reset email sent"
    });
    
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Verify authentication status
export const checkDoctorAuth = async (req, res) => {
  try {
    const doctorId = req.doctor.id; // From auth middleware
    const tokenFromCookie = req.cookies?.doctor_token || null;
    const tokenFromHeader = req.headers?.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const resolvedDoctorToken = req.doctorAuthToken || tokenFromCookie || tokenFromHeader || null;

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId).select(
      "-password -pendingLoginVerification -pendingPrescriptionVerification -pendingBiometricRegistration"
    );

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
    
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      doctor: buildDoctorPayload(doctor),
      token: resolvedDoctorToken,
    });
  } catch (error) {
    console.error("Error in checkDoctorAuth:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
}; 

export const verifyDoctorLoginBiometric = async (req, res) => {
  try {
    const { email, challengeToken, authenticationResponse } = req.body;

    if (!email || !challengeToken || !authenticationResponse) {
      return res.status(400).json({
        success: false,
        message: "Email, challenge token and biometric response are required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findOne({ email: String(email).toLowerCase().trim() });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Verification failed",
      });
    }

    if (!validatePendingFlowToken(doctor.pendingLoginVerification, challengeToken)) {
      clearPendingLoginVerification(doctor);
      await doctor.save();
      return res.status(401).json({
        success: false,
        message: "Login verification session expired. Please login again.",
      });
    }

    const pending = doctor.pendingLoginVerification;

    if (!pending.challenge) {
      return res.status(400).json({
        success: false,
        message: "Biometric is not configured for this account",
        fallbackRequired: true,
      });
    }

    const credentialID = authenticationResponse?.id;
    const storedCredential = getStoredCredentialById(doctor, credentialID);

    if (!storedCredential) {
      return res.status(401).json({
        success: false,
        message: "Biometric credential not recognized",
        fallbackRequired: true,
      });
    }

    const verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge: pending.challenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: WEB_AUTHN_RP_ID,
      requireUserVerification: true,
      credential: {
        id: storedCredential.credentialID,
        publicKey: Buffer.from(storedCredential.publicKey, "base64url"),
        counter: storedCredential.counter || 0,
        transports: Array.isArray(storedCredential.transports)
          ? storedCredential.transports
          : [],
      },
    });

    if (!verification.verified) {
      return res.status(401).json({
        success: false,
        message: "Biometric verification failed",
        fallbackRequired: true,
      });
    }

    storedCredential.counter = verification.authenticationInfo?.newCounter || storedCredential.counter || 0;
    storedCredential.lastUsedAt = new Date();
    clearPendingLoginVerification(doctor);

    return issueDoctorLoginSuccess(doctor, res, "password+biometric");
  } catch (error) {
    console.error("Error in verifyDoctorLoginBiometric:", error);
    return res.status(401).json({
      success: false,
      message: "Biometric verification failed. Use email OTP fallback.",
      fallbackRequired: true,
    });
  }
};

export const requestDoctorLoginFallbackOtp = async (req, res) => {
  try {
    const { email, challengeToken } = req.body;

    if (!email || !challengeToken) {
      return res.status(400).json({
        success: false,
        message: "Email and challenge token are required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findOne({ email: String(email).toLowerCase().trim() });

    if (!doctor || !validatePendingFlowToken(doctor.pendingLoginVerification, challengeToken)) {
      return res.status(401).json({
        success: false,
        message: "Login verification session expired. Please login again.",
      });
    }

    const lastSentAt = doctor.pendingLoginVerification?.lastOtpSentAt
      ? new Date(doctor.pendingLoginVerification.lastOtpSentAt).getTime()
      : 0;

    if (lastSentAt && Date.now() - lastSentAt < OTP_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const otpCode = generateOtpCode();

    doctor.pendingLoginVerification = {
      ...(doctor.pendingLoginVerification || {}),
      otpHash: sha256(otpCode),
      otpExpiresAt: new Date(Date.now() + LOGIN_OTP_TTL_MS),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    };

    await doctor.save();

    await sendDoctorBiometricOTPEmail(
      doctor.email,
      doctor.fullName,
      otpCode,
      "Doctor login",
      Math.max(1, Math.floor(LOGIN_OTP_TTL_MS / 60000))
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email",
      otpSent: true,
    });
  } catch (error) {
    console.error("Error in requestDoctorLoginFallbackOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyDoctorLoginFallbackOtp = async (req, res) => {
  try {
    const { email, challengeToken, otp, otpCode } = req.body;
    const normalizedOtp = normalizeOtpInput(otp || otpCode);

    if (!email || !challengeToken || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email, challenge token and OTP are required",
      });
    }

    if (normalizedOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit code",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findOne({ email: String(email).toLowerCase().trim() });

    if (!doctor || !validatePendingFlowToken(doctor.pendingLoginVerification, challengeToken)) {
      return res.status(401).json({
        success: false,
        message: "Login verification session expired. Please login again.",
      });
    }

    const pending = doctor.pendingLoginVerification || {};

    if (!pending.otpHash || !isDateInFuture(pending.otpExpiresAt)) {
      return res.status(401).json({
        success: false,
        message: "OTP expired or not requested",
      });
    }

    if ((pending.otpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
      clearPendingLoginVerification(doctor);
      await doctor.save();
      return res.status(429).json({
        success: false,
        message: "Too many invalid OTP attempts. Please login again.",
      });
    }

    const isValidOtp = sha256(normalizedOtp) === pending.otpHash;
    if (!isValidOtp) {
      doctor.pendingLoginVerification.otpAttempts = (pending.otpAttempts || 0) + 1;
      await doctor.save();
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    clearPendingLoginVerification(doctor);
    return issueDoctorLoginSuccess(doctor, res, "password+email-otp");
  } catch (error) {
    console.error("Error in verifyDoctorLoginFallbackOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

export const getDoctorBiometricStatus = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId).select("biometricCredentials");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      biometricRegistered: Array.isArray(doctor.biometricCredentials)
        ? doctor.biometricCredentials.length > 0
        : false,
      credentialCount: Array.isArray(doctor.biometricCredentials)
        ? doctor.biometricCredentials.length
        : 0,
    });
  } catch (error) {
    console.error("Error in getDoctorBiometricStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch biometric status",
    });
  }
};

export const getDoctorBiometricRegistrationOptions = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const options = await generateRegistrationOptions({
      rpName: WEB_AUTHN_RP_NAME,
      rpID: WEB_AUTHN_RP_ID,
      userID: String(doctor._id),
      userName: doctor.email,
      userDisplayName: doctor.fullName || doctor.email,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred",
      },
      excludeCredentials: getWebAuthnAllowCredentials(doctor),
    });

    doctor.pendingBiometricRegistration = {
      challenge: options.challenge,
      expiresAt: new Date(Date.now() + LOGIN_CHALLENGE_TTL_MS),
    };
    await doctor.save();

    return res.status(200).json({
      success: true,
      options,
    });
  } catch (error) {
    console.error("Error in getDoctorBiometricRegistrationOptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start biometric setup",
    });
  }
};

export const verifyDoctorBiometricRegistration = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    const { registrationResponse } = req.body;

    if (!doctorId || !registrationResponse) {
      return res.status(400).json({
        success: false,
        message: "Registration response is required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const pendingRegistration = doctor.pendingBiometricRegistration || {};
    if (!pendingRegistration.challenge || !isDateInFuture(pendingRegistration.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Biometric setup session expired. Try again.",
      });
    }

    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: pendingRegistration.challenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: WEB_AUTHN_RP_ID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo?.credential) {
      return res.status(400).json({
        success: false,
        message: "Biometric registration failed",
      });
    }

    const credential = verification.registrationInfo.credential;
    const credentialID = toBase64UrlString(credential.id);
    const publicKey = toBase64UrlString(credential.publicKey);

    if (!credentialID || !publicKey) {
      return res.status(400).json({
        success: false,
        message: "Invalid biometric credential",
      });
    }

    const existingIndex = Array.isArray(doctor.biometricCredentials)
      ? doctor.biometricCredentials.findIndex((item) => item.credentialID === credentialID)
      : -1;

    const newCredential = {
      credentialID,
      publicKey,
      counter: credential.counter || 0,
      transports: Array.isArray(credential.transports) ? credential.transports : [],
      createdAt: new Date(),
      lastUsedAt: null,
    };

    if (existingIndex >= 0) {
      doctor.biometricCredentials[existingIndex] = newCredential;
    } else {
      doctor.biometricCredentials = [...(doctor.biometricCredentials || []), newCredential];
    }

    doctor.pendingBiometricRegistration = {
      challenge: "",
      expiresAt: null,
    };

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Biometric fingerprint setup complete",
      biometricRegistered: true,
    });
  } catch (error) {
    console.error("Error in verifyDoctorBiometricRegistration:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to verify biometric registration",
    });
  }
};

export const initiateDoctorPrescriptionVerification = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const hasBiometric = Array.isArray(doctor.biometricCredentials) && doctor.biometricCredentials.length > 0;
    const challengeToken = generateOpaqueToken();

    let biometricOptions = null;
    let challengeValue = "";

    if (hasBiometric) {
      biometricOptions = await generateAuthenticationOptions({
        rpID: WEB_AUTHN_RP_ID,
        userVerification: "required",
        allowCredentials: getWebAuthnAllowCredentials(doctor),
        timeout: 60000,
      });
      challengeValue = biometricOptions.challenge;
    }

    clearPendingPrescriptionVerification(doctor);
    doctor.pendingPrescriptionVerification = {
      ...(doctor.pendingPrescriptionVerification || {}),
      tokenHash: sha256(challengeToken),
      challenge: challengeValue,
      expiresAt: new Date(Date.now() + PRESCRIPTION_CHALLENGE_TTL_MS),
      otpHash: "",
      otpExpiresAt: null,
      otpAttempts: 0,
      lastOtpSentAt: null,
      method: "",
    };

    await doctor.save();

    return res.status(200).json({
      success: true,
      challengeToken,
      requiresBiometric: hasBiometric,
      fallbackAvailable: true,
      biometricOptions,
      biometricRegistered: hasBiometric,
    });
  } catch (error) {
    console.error("Error in initiateDoctorPrescriptionVerification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start prescription verification",
    });
  }
};

export const verifyDoctorPrescriptionBiometric = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    const { challengeToken, authenticationResponse } = req.body;

    if (!doctorId || !challengeToken || !authenticationResponse) {
      return res.status(400).json({
        success: false,
        message: "Challenge token and biometric response are required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!validatePendingFlowToken(doctor.pendingPrescriptionVerification, challengeToken)) {
      clearPendingPrescriptionVerification(doctor);
      await doctor.save();
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please retry.",
      });
    }

    const pending = doctor.pendingPrescriptionVerification || {};
    if (!pending.challenge) {
      return res.status(400).json({
        success: false,
        message: "Biometric is not configured for this account",
        fallbackRequired: true,
      });
    }

    const credentialID = authenticationResponse?.id;
    const storedCredential = getStoredCredentialById(doctor, credentialID);

    if (!storedCredential) {
      return res.status(401).json({
        success: false,
        message: "Biometric credential not recognized",
        fallbackRequired: true,
      });
    }

    const verification = await verifyAuthenticationResponse({
      response: authenticationResponse,
      expectedChallenge: pending.challenge,
      expectedOrigin: getWebAuthnOrigin(),
      expectedRPID: WEB_AUTHN_RP_ID,
      requireUserVerification: true,
      credential: {
        id: storedCredential.credentialID,
        publicKey: Buffer.from(storedCredential.publicKey, "base64url"),
        counter: storedCredential.counter || 0,
        transports: Array.isArray(storedCredential.transports)
          ? storedCredential.transports
          : [],
      },
    });

    if (!verification.verified) {
      return res.status(401).json({
        success: false,
        message: "Biometric verification failed",
        fallbackRequired: true,
      });
    }

    storedCredential.counter = verification.authenticationInfo?.newCounter || storedCredential.counter || 0;
    storedCredential.lastUsedAt = new Date();

    const actionToken = issuePrescriptionActionToken(doctor, "biometric");
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Biometric verified",
      verificationToken: actionToken,
      verificationMethod: "biometric",
      expiresInSeconds: Math.floor(PRESCRIPTION_ACTION_TOKEN_TTL_MS / 1000),
    });
  } catch (error) {
    console.error("Error in verifyDoctorPrescriptionBiometric:", error);
    return res.status(401).json({
      success: false,
      message: "Biometric verification failed. Use email OTP fallback.",
      fallbackRequired: true,
    });
  }
};

export const requestDoctorPrescriptionFallbackOtp = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    const { challengeToken } = req.body;

    if (!doctorId || !challengeToken) {
      return res.status(400).json({
        success: false,
        message: "Challenge token is required",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor || !validatePendingFlowToken(doctor.pendingPrescriptionVerification, challengeToken)) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please retry.",
      });
    }

    const lastSentAt = doctor.pendingPrescriptionVerification?.lastOtpSentAt
      ? new Date(doctor.pendingPrescriptionVerification.lastOtpSentAt).getTime()
      : 0;

    if (lastSentAt && Date.now() - lastSentAt < OTP_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const otpCode = generateOtpCode();
    doctor.pendingPrescriptionVerification = {
      ...(doctor.pendingPrescriptionVerification || {}),
      otpHash: sha256(otpCode),
      otpExpiresAt: new Date(Date.now() + PRESCRIPTION_OTP_TTL_MS),
      otpAttempts: 0,
      lastOtpSentAt: new Date(),
    };

    await doctor.save();

    await sendDoctorBiometricOTPEmail(
      doctor.email,
      doctor.fullName,
      otpCode,
      "Prescription creation/upload",
      Math.max(1, Math.floor(PRESCRIPTION_OTP_TTL_MS / 60000))
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email",
      otpSent: true,
    });
  } catch (error) {
    console.error("Error in requestDoctorPrescriptionFallbackOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyDoctorPrescriptionFallbackOtp = async (req, res) => {
  try {
    const doctorId = req.doctor?.id;
    const { challengeToken, otp, otpCode } = req.body;
    const normalizedOtp = normalizeOtpInput(otp || otpCode);

    if (!doctorId || !challengeToken || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Challenge token and OTP are required",
      });
    }

    if (normalizedOtp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "OTP must be a 6-digit code",
      });
    }

    const DoctorModel = Doctor();
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor || !validatePendingFlowToken(doctor.pendingPrescriptionVerification, challengeToken)) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please retry.",
      });
    }

    const pending = doctor.pendingPrescriptionVerification || {};

    if (!pending.otpHash || !isDateInFuture(pending.otpExpiresAt)) {
      return res.status(401).json({
        success: false,
        message: "OTP expired or not requested",
      });
    }

    if ((pending.otpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
      clearPendingPrescriptionVerification(doctor);
      await doctor.save();
      return res.status(429).json({
        success: false,
        message: "Too many invalid OTP attempts. Restart verification.",
      });
    }

    const isValidOtp = sha256(normalizedOtp) === pending.otpHash;
    if (!isValidOtp) {
      doctor.pendingPrescriptionVerification.otpAttempts = (pending.otpAttempts || 0) + 1;
      await doctor.save();
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const actionToken = issuePrescriptionActionToken(doctor, "email-otp");
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      verificationToken: actionToken,
      verificationMethod: "email-otp",
      expiresInSeconds: Math.floor(PRESCRIPTION_ACTION_TOKEN_TTL_MS / 1000),
    });
  } catch (error) {
    console.error("Error in verifyDoctorPrescriptionFallbackOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};