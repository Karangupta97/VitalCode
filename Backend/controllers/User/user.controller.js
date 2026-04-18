import crypto from "crypto";
import { User } from "../../models/User/user.model.js";
import { Prescription } from "../../models/Hospital/prescription.model.js";
import { createNotification } from "./notifications.controller.js";
import { emitPrescriptionLifecycleUpdate } from "../../utils/socket.js";
import {
  PRESCRIPTION_LIFECYCLE_STATUS,
  buildPrescriptionQrPayload,
} from "../../utils/prescriptionQR.js";

const DELIVERY_OTP_TTL_MINUTES = Number.parseInt(
  process.env.PRESCRIPTION_DELIVERY_OTP_TTL_MINUTES || "10",
  10
);

const resolveActor = async (req) => {
  const actorId = req.user?.id ? String(req.user.id) : null;
  let role = req.user?.role || null;
  let name = [req.user?.name, req.user?.lastname].filter(Boolean).join(" ").trim();

  if (!actorId) {
    return {
      id: null,
      role: "guest",
      name: "Guest",
    };
  }

  const UserModel = User();
  const userRecord = await UserModel.findById(actorId).select("name lastname email role");

  if (userRecord) {
    role = role || userRecord.role || "user";

    if (!name) {
      name = [userRecord.name, userRecord.lastname]
        .filter(Boolean)
        .join(" ")
        .trim();
    }

    if (!name) {
      name = userRecord.email || "User";
    }
  }

  return {
    id: actorId,
    role: role || "user",
    name: name || "User",
  };
};

const appendTimelineEvent = (prescription, { status, action, actor, note = "", metadata = {} }) => {
  if (!Array.isArray(prescription.lifecycleTimeline)) {
    prescription.lifecycleTimeline = [];
  }

  prescription.lifecycleTimeline.push({
    status,
    action,
    actorId: actor?.id || null,
    actorRole: actor?.role || "system",
    actorName: actor?.name || "System",
    note,
    metadata,
    timestamp: new Date(),
  });
};

const appendSuspiciousActivity = (prescription, { reason, actor, details = {} }) => {
  if (!Array.isArray(prescription.suspiciousActivity)) {
    prescription.suspiciousActivity = [];
  }

  prescription.suspiciousActivity.push({
    reason,
    details,
    actorId: actor?.id || null,
    actorRole: actor?.role || "system",
    actorName: actor?.name || "System",
    detectedAt: new Date(),
  });
};

const getLifecycleRecipients = (prescription) => {
  return [...new Set([prescription?.patientId, prescription?.doctorId].filter(Boolean).map(String))];
};

const emitLifecycleEvent = (prescription, eventType, actor, metadata = {}) => {
  const recipients = getLifecycleRecipients(prescription);
  if (recipients.length === 0) {
    return;
  }

  emitPrescriptionLifecycleUpdate(recipients, {
    eventType,
    prescriptionId: String(prescription._id),
    patientId: String(prescription.patientId),
    doctorId: prescription.doctorId ? String(prescription.doctorId) : null,
    lifecycleStatus: prescription.lifecycleStatus,
    actor,
    metadata,
    occurredAt: new Date().toISOString(),
  });
};

const ensurePrescriptionOwnership = (prescription, actor) => {
  return Boolean(
    prescription &&
      actor?.id &&
      String(prescription.patientId) === String(actor.id)
  );
};

// Get all prescriptions for the logged-in user
export const getUserPrescriptions = async (req, res) => {
  try {
    const PrescriptionModel = Prescription();
    const prescriptions = await PrescriptionModel.find({ patientId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    console.error("Error fetching user prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescriptions",
      error: error.message,
    });
  }
};

// Get a specific prescription by ID for the logged-in user
export const getUserPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (prescription.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this prescription",
      });
    }

    return res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription",
      error: error.message,
    });
  }
};

// Get user's digital prescription count
export const getPrescriptionCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const PrescriptionModel = Prescription();
    const count = await PrescriptionModel.countDocuments({ patientId: userId });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching prescription count:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription count",
      error: error.message,
    });
  }
};

// Generate secure QR payload for a prescription
export const generatePrescriptionQrForPatient = async (req, res) => {
  try {
    const actor = await resolveActor(req);
    const { prescriptionId } = req.params;

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!ensurePrescriptionOwnership(prescription, actor)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to generate QR for this prescription",
      });
    }

    if (prescription.flags?.isFlagged) {
      return res.status(409).json({
        success: false,
        blocked: true,
        message: "Flagged prescriptions cannot generate a QR until manually reviewed",
      });
    }

    if (prescription.lifecycleStatus === PRESCRIPTION_LIFECYCLE_STATUS.DELIVERED) {
      return res.status(409).json({
        success: false,
        blocked: true,
        message: "Delivery already completed for this prescription",
      });
    }

    const qrPayload = buildPrescriptionQrPayload({
      prescriptionId: prescription._id,
      patientId: prescription.patientId,
    });

    prescription.qrMeta = {
      ...(prescription.qrMeta || {}),
      generationCount: (prescription.qrMeta?.generationCount || 0) + 1,
      lastIssuedAt: new Date(qrPayload.timestamp),
      lastExpiresAt: new Date(qrPayload.expires_at),
      lastNonce: qrPayload.nonce,
      lastSignature: qrPayload.signature,
      lastGeneratedBy: actor.id,
    };

    appendTimelineEvent(prescription, {
      status: prescription.lifecycleStatus,
      action: "QR_GENERATED",
      actor,
      note: "Patient generated secure QR",
      metadata: {
        expiresAt: qrPayload.expires_at,
      },
    });

    await prescription.save();

    emitLifecycleEvent(prescription, "PRESCRIPTION_QR_GENERATED", actor, {
      expiresAt: qrPayload.expires_at,
    });

    return res.status(200).json({
      success: true,
      qrPayload,
      qrString: JSON.stringify(qrPayload),
      expiresAt: qrPayload.expires_at,
    });
  } catch (error) {
    console.error("Error generating prescription QR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate prescription QR",
      error: error.message,
    });
  }
};

// Request OTP for delivery confirmation
export const requestPrescriptionDeliveryOtp = async (req, res) => {
  try {
    const actor = await resolveActor(req);
    const { prescriptionId } = req.params;

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!ensurePrescriptionOwnership(prescription, actor)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to request delivery OTP",
      });
    }

    if (prescription.lifecycleStatus !== PRESCRIPTION_LIFECYCLE_STATUS.IN_PROCESS) {
      return res.status(409).json({
        success: false,
        message: "Delivery OTP can only be requested when prescription is IN_PROCESS",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpExpiresAt = new Date(Date.now() + DELIVERY_OTP_TTL_MINUTES * 60 * 1000);

    prescription.deliveryConfirmation = {
      ...(prescription.deliveryConfirmation || {}),
      otpHash,
      otpExpiresAt,
      otpVerifiedAt: null,
    };

    appendTimelineEvent(prescription, {
      status: prescription.lifecycleStatus,
      action: "DELIVERY_OTP_REQUESTED",
      actor,
      note: "Patient requested OTP for delivery confirmation",
      metadata: {
        otpExpiresAt,
      },
    });

    await prescription.save();

    await createNotification(
      String(prescription.patientId),
      "Delivery Confirmation OTP",
      "A one-time OTP was generated for prescription delivery confirmation.",
      "info",
      `/dashboard/digital-prescriptions/${prescription._id}`
    );

    emitLifecycleEvent(prescription, "DELIVERY_OTP_REQUESTED", actor, {
      otpExpiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "Delivery OTP generated",
      otpExpiresAt,
      ...(process.env.NODE_ENV !== "production" ? { otp } : {}),
    });
  } catch (error) {
    console.error("Error requesting delivery OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to request delivery OTP",
      error: error.message,
    });
  }
};

// Confirm prescription delivery by patient (button or OTP)
export const confirmPrescriptionDelivery = async (req, res) => {
  try {
    const actor = await resolveActor(req);
    const { prescriptionId } = req.params;
    const { method = "button", otp } = req.body;

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!ensurePrescriptionOwnership(prescription, actor)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to confirm delivery",
      });
    }

    if (prescription.flags?.isFlagged) {
      return res.status(409).json({
        success: false,
        blocked: true,
        message: "Flagged prescription cannot be confirmed",
      });
    }

    if (
      prescription.lifecycleStatus !== PRESCRIPTION_LIFECYCLE_STATUS.IN_PROCESS &&
      prescription.lifecycleStatus !== PRESCRIPTION_LIFECYCLE_STATUS.ACCEPTED
    ) {
      return res.status(409).json({
        success: false,
        message: "Prescription is not ready for delivery confirmation",
      });
    }

    if (method === "otp") {
      const confirmation = prescription.deliveryConfirmation || {};

      if (!otp || !confirmation.otpHash) {
        return res.status(400).json({
          success: false,
          message: "OTP is required for this confirmation method",
        });
      }

      if (!confirmation.otpExpiresAt || new Date() > new Date(confirmation.otpExpiresAt)) {
        appendSuspiciousActivity(prescription, {
          reason: "EXPIRED_DELIVERY_OTP",
          actor,
          details: {
            otpExpiresAt: confirmation.otpExpiresAt || null,
          },
        });

        await prescription.save();

        return res.status(400).json({
          success: false,
          message: "Delivery OTP has expired",
        });
      }

      const inputHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
      if (inputHash !== confirmation.otpHash) {
        appendSuspiciousActivity(prescription, {
          reason: "INVALID_DELIVERY_OTP",
          actor,
          details: {},
        });

        await prescription.save();

        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      prescription.deliveryConfirmation = {
        ...(prescription.deliveryConfirmation || {}),
        otpVerifiedAt: new Date(),
      };
    }

    prescription.lifecycleStatus = PRESCRIPTION_LIFECYCLE_STATUS.DELIVERED;
    prescription.deliveryConfirmation = {
      ...(prescription.deliveryConfirmation || {}),
      confirmedAt: new Date(),
      confirmedBy: actor.id,
      confirmationMethod: method === "otp" ? "otp" : "button",
      otpHash: method === "otp" ? prescription.deliveryConfirmation?.otpHash || "" : "",
      otpExpiresAt:
        method === "otp" ? prescription.deliveryConfirmation?.otpExpiresAt || null : null,
    };

    appendTimelineEvent(prescription, {
      status: PRESCRIPTION_LIFECYCLE_STATUS.DELIVERED,
      action: "DELIVERED",
      actor,
      note:
        method === "otp"
          ? "Patient confirmed delivery using OTP"
          : "Patient confirmed delivery using button",
      metadata: {
        method,
      },
    });

    await prescription.save();

    const recipientIds = getLifecycleRecipients(prescription);
    await Promise.all(
      recipientIds.map((userId) =>
        createNotification(
          userId,
          "Prescription Delivered",
          "Prescription delivery has been confirmed by the patient.",
          "prescription",
          `/dashboard/digital-prescriptions/${prescription._id}`
        )
      )
    );

    emitLifecycleEvent(prescription, "PRESCRIPTION_DELIVERED", actor, {
      method,
    });

    return res.status(200).json({
      success: true,
      message: "Prescription delivery confirmed",
      prescription,
    });
  } catch (error) {
    console.error("Error confirming prescription delivery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm delivery",
      error: error.message,
    });
  }
};

// Get user profile by UMID (for QR code scanning)
export const getUserProfileByUmid = async (req, res) => {
  try {
    const { umid } = req.params;

    if (!umid) {
      return res.status(400).json({
        success: false,
        message: "Medicare ID (UMID) is required",
      });
    }

    const UserModel = User();
    const user = await UserModel.findOne({ umid }).select("-password -tokens");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided Medicare ID",
      });
    }

    const isAuthenticated = req.user && req.user.id;

    if (isAuthenticated) {
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          umid: user.umid,
          verified: user.verified,
          planType: user.planType,
          phone: user.phone,
          address: user.address,
          createdAt: user.createdAt,
        },
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        photoURL: user.photoURL,
        umid: user.umid,
        verified: user.verified,
        planType: user.planType,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile by UMID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};
