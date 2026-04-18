import mongoose from "mongoose";
import { getDoctorDB } from "../../DB/connections.js";

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String,
    trim: true
  }
});

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      trim: true,
      required: true,
    },
    action: {
      type: String,
      trim: true,
      required: true,
    },
    actorId: {
      type: String,
      default: null,
    },
    actorRole: {
      type: String,
      trim: true,
      default: "system",
    },
    actorName: {
      type: String,
      trim: true,
      default: "System",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const suspiciousActivitySchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actorId: {
      type: String,
      default: null,
    },
    actorRole: {
      type: String,
      trim: true,
      default: "system",
    },
    actorName: {
      type: String,
      trim: true,
      default: "System",
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientUMID: {
    type: String,
    required: true,
    trim: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  doctor: {
    type: String,
    trim: true
  },
  hospitalName: {
    type: String,
    default: "Medicare Hospital",
    trim: true
  },
  diagnosis: {
    type: String,
    trim: true
  },
  medications: [medicationSchema],
  notes: {
    type: String,
    trim: true
  },
  lifecycleStatus: {
    type: String,
    enum: ["CREATED", "SCANNED", "ACCEPTED", "IN_PROCESS", "DELIVERED", "FLAGGED"],
    default: "CREATED",
  },
  lifecycleTimeline: {
    type: [timelineEntrySchema],
    default: [],
  },
  suspiciousActivity: {
    type: [suspiciousActivitySchema],
    default: [],
  },
  qrMeta: {
    generationCount: {
      type: Number,
      default: 0,
    },
    lastIssuedAt: {
      type: Date,
      default: null,
    },
    lastExpiresAt: {
      type: Date,
      default: null,
    },
    lastNonce: {
      type: String,
      default: "",
    },
    lastSignature: {
      type: String,
      default: "",
    },
    lastGeneratedBy: {
      type: String,
      default: null,
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
  },
  scanMeta: {
    totalAttempts: {
      type: Number,
      default: 0,
    },
    invalidAttempts: {
      type: Number,
      default: 0,
    },
    validScans: {
      type: Number,
      default: 0,
    },
    lastScannedBy: {
      type: String,
      default: null,
    },
  },
  flags: {
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedAt: {
      type: Date,
      default: null,
    },
    flaggedReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  deliveryConfirmation: {
    otpHash: {
      type: String,
      default: "",
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    otpVerifiedAt: {
      type: Date,
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    confirmedBy: {
      type: String,
      default: null,
    },
    confirmationMethod: {
      type: String,
      enum: ["button", "otp", ""],
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Prescription = () => getDoctorDB().model("Prescription", prescriptionSchema);

export { Prescription };