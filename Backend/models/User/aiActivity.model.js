import mongoose from "mongoose";
import { getPatientDB } from "../../DB/connections.js";

const aiThreatSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    reason: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "guardrail",
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const aiActionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["STOPPED", "ALLOWED_OVERRIDE", "REPORTED"],
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    actorRole: {
      type: String,
      default: "user",
    },
    note: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const aiActivitySchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    feature: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: "gemini-3-flash-preview",
    },
    inputPrompt: {
      type: String,
      required: true,
    },
    sanitizedPrompt: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    responseText: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["AUTHORIZED", "FLAGGED", "BLOCKED"],
      default: "AUTHORIZED",
      index: true,
    },
    threats: {
      type: [aiThreatSchema],
      default: [],
    },
    actionHistory: {
      type: [aiActionSchema],
      default: [],
    },
    blockedReason: {
      type: String,
      default: "",
    },
    overrideGranted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    durationMs: {
      type: Number,
      default: null,
    },
    sessionId: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

aiActivitySchema.index({ userId: 1, createdAt: -1 });
aiActivitySchema.index({ status: 1, createdAt: -1 });
aiActivitySchema.index({ feature: 1, createdAt: -1 });

export const AIActivity = () => getPatientDB().model("AIActivity", aiActivitySchema);
