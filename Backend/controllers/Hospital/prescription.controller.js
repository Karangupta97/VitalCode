import { Prescription } from "../../models/Hospital/prescription.model.js";
import { User } from "../../models/User/user.model.js";
import { Doctor } from "../../models/Doctor/doctor.model.js";
import { createNotification } from "../User/notifications.controller.js";
import { emitPrescriptionLifecycleUpdate } from "../../utils/socket.js";
import crypto from "crypto";
import {
  PRESCRIPTION_LIFECYCLE_STATUS,
  PHARMACY_ALLOWED_STATUS_UPDATES,
  parseQrPayload,
  normalizeQrPayload,
  isPrescriptionQrSignatureValid,
  isPrescriptionQrExpired,
} from "../../utils/prescriptionQR.js";

const PRIVILEGED_ROLES = new Set([
  "doctor",
  "hospital",
  "pharmacy",
  "admin",
  "founder",
  "manager",
  "staff",
]);

const SCAN_BLOCK_REASONS = Object.freeze({
  PRESCRIPTION_NOT_FOUND: "PRESCRIPTION_NOT_FOUND",
  TAMPERED_DATA: "TAMPERED_DATA",
  EXPIRED_QR: "EXPIRED_QR",
  MISMATCH_USER: "MISMATCH_USER",
  MULTIPLE_SCAN: "MULTIPLE_SCAN",
  ALREADY_USED: "ALREADY_USED",
  ALREADY_FLAGGED: "ALREADY_FLAGGED",
});

const isDoctorVerificationTokenValid = (pendingVerification, token) => {
  if (!pendingVerification || !pendingVerification.actionTokenHash || !token) {
    return false;
  }

  if (pendingVerification.actionTokenUsedAt) {
    return false;
  }

  if (!pendingVerification.actionTokenExpiresAt) {
    return false;
  }

  const expiresAt = new Date(pendingVerification.actionTokenExpiresAt).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const providedHash = crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");

  return providedHash === pendingVerification.actionTokenHash;
};

const buildActorNameFromToken = (tokenUser) => {
  if (!tokenUser) {
    return "";
  }

  const fullName = [tokenUser.name, tokenUser.lastname].filter(Boolean).join(" ").trim();
  return fullName;
};

const resolveActor = async (req) => {
  const actorId = req.user?.id ? String(req.user.id) : null;
  let role = req.user?.role || null;
  let name = buildActorNameFromToken(req.user);

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
      const userName = [userRecord.name, userRecord.lastname]
        .filter(Boolean)
        .join(" ")
        .trim();
      name = userName || userRecord.email || "User";
    }
  }

  if (!name && role === "doctor") {
    const DoctorModel = Doctor();
    const doctorRecord = await DoctorModel.findById(actorId).select("fullName email");
    if (doctorRecord) {
      name = doctorRecord.fullName || doctorRecord.email || "Doctor";
    }
  }

  return {
    id: actorId,
    role: role || "user",
    name: name || "System",
  };
};

const requireAnyRole = async (req, res, allowedRoles) => {
  const actor = await resolveActor(req);

  if (!allowedRoles.includes(actor.role)) {
    res.status(403).json({
      success: false,
      message: "Forbidden: You do not have access to this action",
    });
    return null;
  }

  return actor;
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

const notifyLifecycleRecipients = async (
  prescription,
  title,
  message,
  type = "info",
  link = `/dashboard/digital-prescriptions/${String(prescription._id)}`
) => {
  const recipients = getLifecycleRecipients(prescription);
  if (recipients.length === 0) {
    return;
  }

  await Promise.all(
    recipients.map((userId) => createNotification(userId, title, message, type, link))
  );
};

const canAccessPrescription = (actor, prescription) => {
  if (!actor?.id || !prescription) {
    return false;
  }

  if (PRIVILEGED_ROLES.has(actor.role)) {
    return true;
  }

  const actorId = String(actor.id);
  return (
    String(prescription.patientId) === actorId ||
    String(prescription.doctorId) === actorId
  );
};

const markPrescriptionFlagged = async (prescription, { reason, actor, details = {}, note }) => {
  prescription.lifecycleStatus = PRESCRIPTION_LIFECYCLE_STATUS.FLAGGED;
  prescription.flags = {
    ...(prescription.flags || {}),
    isFlagged: true,
    flaggedAt: new Date(),
    flaggedReason: reason,
  };

  prescription.scanMeta = {
    ...(prescription.scanMeta || {}),
    invalidAttempts: (prescription.scanMeta?.invalidAttempts || 0) + 1,
  };

  appendSuspiciousActivity(prescription, {
    reason,
    actor,
    details,
  });

  appendTimelineEvent(prescription, {
    status: PRESCRIPTION_LIFECYCLE_STATUS.FLAGGED,
    action: "FLAGGED",
    actor,
    note: note || "Prescription flagged due to invalid QR validation",
    metadata: {
      reason,
      ...details,
    },
  });

  await prescription.save();

  await notifyLifecycleRecipients(
    prescription,
    "Prescription Flagged",
    "A prescription was flagged due to suspicious or invalid QR activity.",
    "warning"
  );

  emitLifecycleEvent(prescription, "PRESCRIPTION_FLAGGED", actor, {
    reason,
    details,
  });
};

// Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const actor = await requireAnyRole(req, res, ["doctor", "hospital"]);
    if (!actor) {
      return;
    }

    let doctorVerificationMethod = null;

    if (actor.role === "doctor") {
      const doctorVerificationToken = req.body?.doctorVerificationToken;

      if (!doctorVerificationToken) {
        return res.status(403).json({
          success: false,
          message: "Verification failed. Action not permitted.",
        });
      }

      const DoctorModel = Doctor();
      const doctorRecord = await DoctorModel.findById(actor.id).select(
        "pendingPrescriptionVerification"
      );

      if (!doctorRecord) {
        return res.status(403).json({
          success: false,
          message: "Verification failed. Action not permitted.",
        });
      }

      const pendingVerification = doctorRecord.pendingPrescriptionVerification || {};
      const isVerificationValid = isDoctorVerificationTokenValid(
        pendingVerification,
        doctorVerificationToken
      );

      if (!isVerificationValid) {
        return res.status(403).json({
          success: false,
          message: "Verification failed. Action not permitted.",
        });
      }

      doctorVerificationMethod = pendingVerification.method || "unknown";
      doctorRecord.pendingPrescriptionVerification = {
        ...(pendingVerification || {}),
        tokenHash: "",
        challenge: "",
        expiresAt: null,
        otpHash: "",
        otpExpiresAt: null,
        otpAttempts: 0,
        lastOtpSentAt: null,
        actionTokenHash: "",
        actionTokenExpiresAt: null,
        actionTokenUsedAt: new Date(),
      };
      await doctorRecord.save();
    }

    const {
      patientId,
      patientName,
      patientUMID,
      diagnosis,
      medications,
      notes,
      createdAt,
    } = req.body;

    if (!patientId || !patientName || !patientUMID || !medications || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient information and medications are required",
      });
    }

    const doctorName = actor.name || "Medicare Doctor";

    const PrescriptionModel = Prescription();
    const prescription = new PrescriptionModel({
      patientId,
      patientName,
      patientUMID,
      doctorId: actor.id,
      doctor: doctorName,
      diagnosis,
      medications,
      notes,
      createdAt: createdAt || new Date(),
      lifecycleStatus: PRESCRIPTION_LIFECYCLE_STATUS.CREATED,
      lifecycleTimeline: [
        {
          status: PRESCRIPTION_LIFECYCLE_STATUS.CREATED,
          action: "CREATED",
          actorId: actor.id,
          actorRole: actor.role,
          actorName: doctorName,
          note: "Prescription created",
          metadata: {
            verificationMethod: doctorVerificationMethod,
          },
          timestamp: new Date(),
        },
      ],
    });

    await prescription.save();

    await createNotification(
      patientId,
      "New Prescription",
      `Dr. ${doctorName} has issued you a new prescription.`,
      "prescription",
      `/dashboard/digital-prescriptions/${prescription._id}`
    );

    emitLifecycleEvent(prescription, "PRESCRIPTION_CREATED", actor, {
      diagnosis: diagnosis || "",
      verificationMethod: doctorVerificationMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create prescription",
      error: error.message,
    });
  }
};

// Get prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const actor = await resolveActor(req);

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!canAccessPrescription(actor, prescription)) {
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

// Get all prescriptions for a patient
export const getPatientPrescriptions = async (req, res) => {
  try {
    const actor = await requireAnyRole(req, res, [
      "doctor",
      "hospital",
      "pharmacy",
      "admin",
      "founder",
      "staff",
      "manager",
    ]);

    if (!actor) {
      return;
    }

    const { patientId } = req.params;

    if (!patientId || patientId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID provided",
      });
    }

    const PrescriptionModel = Prescription();
    const prescriptions = await PrescriptionModel.find({ patientId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error("Error fetching patient prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patient prescriptions",
      error: error.message,
    });
  }
};

// Get all prescriptions created by a doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const actor = await requireAnyRole(req, res, ["doctor", "hospital"]);

    if (!actor) {
      return;
    }

    const PrescriptionModel = Prescription();
    const prescriptions = await PrescriptionModel.find({ doctorId: actor.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    console.error("Error fetching doctor prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor prescriptions",
      error: error.message,
    });
  }
};

// Get prescriptions for a patient from other doctors
export const getOtherDoctorPrescriptions = async (req, res) => {
  try {
    const actor = await requireAnyRole(req, res, ["doctor", "hospital"]);

    if (!actor) {
      return;
    }

    const { patientId } = req.params;

    const PrescriptionModel = Prescription();
    const prescriptions = await PrescriptionModel.find({
      patientId,
      doctorId: { $ne: actor.id },
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedPrescriptions = prescriptions.map((prescription) => ({
      _id: prescription._id,
      medications: prescription.medications,
      diagnosis: prescription.diagnosis,
      notes: prescription.notes,
      followUp: prescription.followUp,
      createdAt: prescription.createdAt,
      doctorName: prescription.doctor || "Unknown Doctor",
      doctorHospital: prescription.hospitalName || "Unknown Hospital",
      lifecycleStatus: prescription.lifecycleStatus,
    }));

    return res.status(200).json({
      success: true,
      count: formattedPrescriptions.length,
      prescriptions: formattedPrescriptions,
    });
  } catch (error) {
    console.error("Error fetching other doctor prescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions from other doctors",
      error: error.message,
    });
  }
};

// Scan and validate a prescription QR at pharmacy
export const scanPrescriptionQRCode = async (req, res) => {
  try {
    let actor = null;
    if (req.publicPharmacyScan) {
      actor = {
        id:
          req.body?.pharmacyLicenseId ||
          req.body?.pharmacyId ||
          req.body?.licenseId ||
          null,
        role: "pharmacy",
        name: req.body?.pharmacyName || "Pharmacy",
      };
    } else {
      actor = await requireAnyRole(req, res, ["pharmacy", "hospital"]);
      if (!actor) {
        return;
      }
    }

    const { qrData } = req.body;
    const parsedPayload = parseQrPayload(qrData);

    if (!parsedPayload) {
      return res.status(400).json({
        success: false,
        blocked: true,
        reason: SCAN_BLOCK_REASONS.TAMPERED_DATA,
        message: "Invalid QR payload format",
      });
    }

    const normalizedPayload = normalizeQrPayload(parsedPayload);
    if (!normalizedPayload) {
      return res.status(400).json({
        success: false,
        blocked: true,
        reason: SCAN_BLOCK_REASONS.TAMPERED_DATA,
        message: "QR payload is missing required signature fields",
      });
    }

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(normalizedPayload.prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        blocked: true,
        reason: SCAN_BLOCK_REASONS.PRESCRIPTION_NOT_FOUND,
        message: "Prescription does not exist",
      });
    }

    prescription.scanMeta = {
      ...(prescription.scanMeta || {}),
      totalAttempts: (prescription.scanMeta?.totalAttempts || 0) + 1,
      lastScannedBy: actor.id,
    };

    let invalidReason = null;
    let invalidDetails = {};

    if (prescription.flags?.isFlagged || prescription.lifecycleStatus === PRESCRIPTION_LIFECYCLE_STATUS.FLAGGED) {
      invalidReason = SCAN_BLOCK_REASONS.ALREADY_FLAGGED;
    } else if (!isPrescriptionQrSignatureValid(normalizedPayload)) {
      invalidReason = SCAN_BLOCK_REASONS.TAMPERED_DATA;
      invalidDetails = { mismatch: "signature" };
    } else if (isPrescriptionQrExpired(normalizedPayload)) {
      invalidReason = SCAN_BLOCK_REASONS.EXPIRED_QR;
      invalidDetails = { expiresAt: normalizedPayload.expiresAt };
    } else if (String(prescription.patientId) !== normalizedPayload.patientId) {
      invalidReason = SCAN_BLOCK_REASONS.MISMATCH_USER;
      invalidDetails = {
        expectedPatientId: String(prescription.patientId),
        scannedPatientId: normalizedPayload.patientId,
      };
    } else if (prescription.lifecycleStatus !== PRESCRIPTION_LIFECYCLE_STATUS.CREATED) {
      invalidReason =
        prescription.lifecycleStatus === PRESCRIPTION_LIFECYCLE_STATUS.DELIVERED
          ? SCAN_BLOCK_REASONS.ALREADY_USED
          : SCAN_BLOCK_REASONS.MULTIPLE_SCAN;
      invalidDetails = { currentStatus: prescription.lifecycleStatus };
    }

    if (invalidReason) {
      await markPrescriptionFlagged(prescription, {
        reason: invalidReason,
        actor,
        details: {
          ...invalidDetails,
          scanPayload: {
            prescriptionId: normalizedPayload.prescriptionId,
            patientId: normalizedPayload.patientId,
            timestamp: normalizedPayload.timestamp,
            expiresAt: normalizedPayload.expiresAt,
          },
        },
      });

      return res.status(400).json({
        success: false,
        blocked: true,
        reason: invalidReason,
        message: "Prescription scan is invalid and has been flagged",
        prescription,
      });
    }

    prescription.lifecycleStatus = PRESCRIPTION_LIFECYCLE_STATUS.SCANNED;
    prescription.scanMeta = {
      ...(prescription.scanMeta || {}),
      validScans: (prescription.scanMeta?.validScans || 0) + 1,
      lastScannedBy: actor.id,
    };
    prescription.qrMeta = {
      ...(prescription.qrMeta || {}),
      lastScannedAt: new Date(),
    };

    appendTimelineEvent(prescription, {
      status: PRESCRIPTION_LIFECYCLE_STATUS.SCANNED,
      action: "SCANNED",
      actor,
      note: "QR successfully validated by pharmacy",
      metadata: {
        qrTimestamp: normalizedPayload.timestamp,
        qrExpiresAt: normalizedPayload.expiresAt,
      },
    });

    await prescription.save();

    await notifyLifecycleRecipients(
      prescription,
      "Prescription Scanned",
      "Your prescription QR has been validated by the pharmacy.",
      "prescription"
    );

    emitLifecycleEvent(prescription, "PRESCRIPTION_SCANNED", actor, {
      nextAllowedStatus: PHARMACY_ALLOWED_STATUS_UPDATES[PRESCRIPTION_LIFECYCLE_STATUS.SCANNED] || [],
    });

    return res.status(200).json({
      success: true,
      message: "Prescription scan validated",
      prescription,
      nextAllowedStatus:
        PHARMACY_ALLOWED_STATUS_UPDATES[PRESCRIPTION_LIFECYCLE_STATUS.SCANNED] || [],
    });
  } catch (error) {
    console.error("Error validating prescription QR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate prescription QR",
      error: error.message,
    });
  }
};

// Update lifecycle status by pharmacy
export const updatePrescriptionLifecycleByPharmacy = async (req, res) => {
  try {
    const actor = await requireAnyRole(req, res, ["pharmacy", "hospital"]);
    if (!actor) {
      return;
    }

    const { prescriptionId } = req.params;
    const { status, note = "" } = req.body;

    const normalizedStatus = String(status || "")
      .trim()
      .toUpperCase();

    if (
      normalizedStatus !== PRESCRIPTION_LIFECYCLE_STATUS.ACCEPTED &&
      normalizedStatus !== PRESCRIPTION_LIFECYCLE_STATUS.IN_PROCESS
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Pharmacy can only move to ACCEPTED or IN_PROCESS",
      });
    }

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (prescription.flags?.isFlagged) {
      return res.status(409).json({
        success: false,
        blocked: true,
        message: "Flagged prescriptions cannot be processed",
        prescription,
      });
    }

    const allowedTransitions =
      PHARMACY_ALLOWED_STATUS_UPDATES[prescription.lifecycleStatus] || [];

    if (!allowedTransitions.includes(normalizedStatus)) {
      appendSuspiciousActivity(prescription, {
        reason: "INVALID_STATUS_TRANSITION",
        actor,
        details: {
          from: prescription.lifecycleStatus,
          to: normalizedStatus,
        },
      });

      await prescription.save();

      return res.status(400).json({
        success: false,
        message: `Invalid lifecycle transition from ${prescription.lifecycleStatus} to ${normalizedStatus}`,
        prescription,
      });
    }

    prescription.lifecycleStatus = normalizedStatus;

    appendTimelineEvent(prescription, {
      status: normalizedStatus,
      action: "STATUS_UPDATED",
      actor,
      note: note || `Status changed to ${normalizedStatus} by pharmacy`,
      metadata: {
        previousStatus: prescription.lifecycleTimeline.at(-1)?.status || null,
      },
    });

    await prescription.save();

    await notifyLifecycleRecipients(
      prescription,
      "Prescription Status Updated",
      `Prescription moved to ${normalizedStatus}.`,
      "prescription"
    );

    emitLifecycleEvent(prescription, "PRESCRIPTION_STATUS_UPDATED", actor, {
      status: normalizedStatus,
    });

    return res.status(200).json({
      success: true,
      message: `Prescription moved to ${normalizedStatus}`,
      prescription,
      nextAllowedStatus: PHARMACY_ALLOWED_STATUS_UPDATES[normalizedStatus] || [],
    });
  } catch (error) {
    console.error("Error updating pharmacy lifecycle status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update prescription status",
      error: error.message,
    });
  }
};

// Get lifecycle timeline details
export const getPrescriptionLifecycle = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const actor = await resolveActor(req);

    const PrescriptionModel = Prescription();
    const prescription = await PrescriptionModel.findById(prescriptionId);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!canAccessPrescription(actor, prescription)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to access this prescription lifecycle",
      });
    }

    return res.status(200).json({
      success: true,
      prescriptionId: String(prescription._id),
      lifecycleStatus: prescription.lifecycleStatus,
      timeline: prescription.lifecycleTimeline || [],
      suspiciousActivity: prescription.suspiciousActivity || [],
      flags: prescription.flags || {},
      scanMeta: prescription.scanMeta || {},
      deliveryConfirmation: prescription.deliveryConfirmation || {},
    });
  } catch (error) {
    console.error("Error getting prescription lifecycle:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch prescription lifecycle",
      error: error.message,
    });
  }
};
