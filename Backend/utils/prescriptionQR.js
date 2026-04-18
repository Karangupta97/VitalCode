import crypto from "crypto";

const DEFAULT_QR_TTL_MINUTES = Number.parseInt(
  process.env.PRESCRIPTION_QR_TTL_MINUTES || "15",
  10
);

const getQrSecret = () =>
  process.env.PRESCRIPTION_QR_SECRET ||
  process.env.JWT_SECRET ||
  "vitalcode-local-qr-secret";

export const PRESCRIPTION_LIFECYCLE_STATUS = Object.freeze({
  CREATED: "CREATED",
  SCANNED: "SCANNED",
  ACCEPTED: "ACCEPTED",
  IN_PROCESS: "IN_PROCESS",
  DELIVERED: "DELIVERED",
  FLAGGED: "FLAGGED",
});

export const PHARMACY_ALLOWED_STATUS_UPDATES = Object.freeze({
  [PRESCRIPTION_LIFECYCLE_STATUS.SCANNED]: [
    PRESCRIPTION_LIFECYCLE_STATUS.ACCEPTED,
  ],
  [PRESCRIPTION_LIFECYCLE_STATUS.ACCEPTED]: [
    PRESCRIPTION_LIFECYCLE_STATUS.IN_PROCESS,
  ],
});

const normalizeNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.trunc(parsed);
};

export const toCanonicalQrString = ({
  prescriptionId,
  patientId,
  timestamp,
  expiresAt,
  nonce,
}) => {
  return [
    String(prescriptionId),
    String(patientId),
    String(timestamp),
    String(expiresAt),
    String(nonce),
  ].join("|");
};

export const createPrescriptionQrSignature = ({
  prescriptionId,
  patientId,
  timestamp,
  expiresAt,
  nonce,
}) => {
  const canonical = toCanonicalQrString({
    prescriptionId,
    patientId,
    timestamp,
    expiresAt,
    nonce,
  });

  return crypto
    .createHmac("sha256", getQrSecret())
    .update(canonical)
    .digest("hex");
};

export const buildPrescriptionQrPayload = ({
  prescriptionId,
  patientId,
  ttlMinutes = DEFAULT_QR_TTL_MINUTES,
}) => {
  const safeTtl = Number.isFinite(ttlMinutes) && ttlMinutes > 0 ? ttlMinutes : 15;
  const timestamp = Date.now();
  const expiresAt = timestamp + safeTtl * 60 * 1000;
  const nonce = crypto.randomBytes(12).toString("hex");

  const signature = createPrescriptionQrSignature({
    prescriptionId,
    patientId,
    timestamp,
    expiresAt,
    nonce,
  });

  return {
    version: "v1",
    prescription_id: String(prescriptionId),
    patient_id: String(patientId),
    timestamp,
    expires_at: expiresAt,
    nonce,
    signature,
  };
};

export const parseQrPayload = (qrData) => {
  if (!qrData) {
    return null;
  }

  if (typeof qrData === "object") {
    return qrData;
  }

  if (typeof qrData !== "string") {
    return null;
  }

  try {
    return JSON.parse(qrData);
  } catch (error) {
    return null;
  }
};

export const normalizeQrPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const prescriptionId =
    payload.prescription_id || payload.prescriptionId || payload.rx_id;
  const patientId = payload.patient_id || payload.patientId;
  const timestamp = normalizeNumber(payload.timestamp);
  const expiresAt = normalizeNumber(payload.expires_at || payload.expiresAt);
  const signature = payload.signature;
  const nonce = payload.nonce;

  if (
    !prescriptionId ||
    !patientId ||
    !timestamp ||
    !expiresAt ||
    !signature ||
    !nonce
  ) {
    return null;
  }

  return {
    prescriptionId: String(prescriptionId),
    patientId: String(patientId),
    timestamp,
    expiresAt,
    signature: String(signature),
    nonce: String(nonce),
  };
};

export const isPrescriptionQrExpired = (normalizedPayload) => {
  if (!normalizedPayload?.expiresAt) {
    return true;
  }

  return Date.now() > normalizedPayload.expiresAt;
};

export const isPrescriptionQrSignatureValid = (normalizedPayload) => {
  if (!normalizedPayload?.signature) {
    return false;
  }

  const expected = createPrescriptionQrSignature({
    prescriptionId: normalizedPayload.prescriptionId,
    patientId: normalizedPayload.patientId,
    timestamp: normalizedPayload.timestamp,
    expiresAt: normalizedPayload.expiresAt,
    nonce: normalizedPayload.nonce,
  });

  const actualBuffer = Buffer.from(normalizedPayload.signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
  } catch (error) {
    return false;
  }
};
