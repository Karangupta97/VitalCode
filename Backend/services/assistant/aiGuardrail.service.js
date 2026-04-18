import crypto from "crypto";
import mongoose from "mongoose";
import Notification from "../../models/User/notification.model.js";
import { AIActivity } from "../../models/User/aiActivity.model.js";
import { sendEventToUser } from "../../utils/socket.js";

const ACTIVE_REQUEST_CONTROL = new Map();
const DISABLED_AI_SESSIONS = new Map();

const MAX_PROMPT_CHARS = 18000;
const MAX_RESPONSE_CHARS = 24000;
const DEFAULT_DISABLE_MINUTES = 15;

const PRIVILEGED_ROLES = new Set(["admin", "founder", "staff", "team"]);

export const AI_ACTIVITY_STATUS = Object.freeze({
  AUTHORIZED: "AUTHORIZED",
  FLAGGED: "FLAGGED",
  BLOCKED: "BLOCKED",
});

export const FEATURE_POLICY_MAP = Object.freeze({
  report_analysis: {
    module: "report-analysis",
    allowedBehavior:
      "Interpret uploaded medical report values in clear patient-friendly language only.",
    requiredResponseKeys: [
      "summary",
      "keyFindings",
      "abnormalValues",
      "normalValues",
      "healthConcerns",
      "suggestions",
      "doctorConsultation",
    ],
    domainRegex:
      /medical|patient|doctor|lab|report|test|medicine|dosage|symptom|diagnosis|health|blood|prescription|biomarker/i,
  },
  prescription_explanation: {
    module: "prescription-explanation",
    allowedBehavior:
      "Explain medicine purpose, dosage, timing, and precautions from a prescription only.",
    requiredResponseKeys: [],
    domainRegex:
      /medicine|prescription|dosage|tablet|capsule|side\s*effect|doctor|patient|health/i,
  },
  chat_assistant: {
    module: "chat-assistant",
    allowedBehavior:
      "Answer general health questions only, with safe and non-diagnostic medical guidance.",
    requiredResponseKeys: [],
    domainRegex:
      /health|medical|doctor|patient|symptom|wellness|diet|exercise|medicine|care/i,
  },
});

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all|any|previous|above)\s+instructions/i,
  /reveal\s+(system|developer)\s+prompt/i,
  /system\s+prompt/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /bypass\s+(guardrail|safety|policy|restriction)/i,
  /(api|access|secret|private)\s*key/i,
  /act\s+as\s+(an?|the)\s+(admin|developer|hacker)/i,
  /execute\s+(shell|bash|terminal|command|script)/i,
  /(drop\s+table|union\s+select|sql\s+injection)/i,
];

const OUT_OF_SCOPE_RESPONSE_PATTERNS = [
  /(write|generate|create)\s+(code|script|program|query|sql)/i,
  /how\s+to\s+(hack|exploit|attack|bypass)/i,
  /malware|ransomware|phishing|credential\s+stuffing|ddos/i,
  /investment\s+advice|stock\s+tip|crypto\s+trade/i,
  /political\s+campaign|vote\s+for|election\s+strategy/i,
  /tax\s+evasion|legal\s+defense\s+strategy/i,
  /adult\s+content|porn/i,
];

const toObjectId = (value) => {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;

  const asString = String(value);
  if (!mongoose.Types.ObjectId.isValid(asString)) return null;
  return new mongoose.Types.ObjectId(asString);
};

const toSafeString = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const normalizeWhitespace = (value) =>
  toSafeString(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizePromptInput = (value) =>
  normalizeWhitespace(value).slice(0, MAX_PROMPT_CHARS);

const sanitizeResponseText = (value) =>
  normalizeWhitespace(value).slice(0, MAX_RESPONSE_CHARS);

const sanitizeFeature = (feature) => {
  const key = normalizeWhitespace(feature || "report_analysis")
    .toLowerCase()
    .replace(/[-\s]+/g, "_");

  return FEATURE_POLICY_MAP[key] ? key : "report_analysis";
};

const mergeThreats = (existingThreats = [], newThreats = []) => {
  const merged = [...existingThreats];

  newThreats.forEach((threat) => {
    const duplicate = merged.some(
      (item) => item.code === threat.code && item.reason === threat.reason
    );

    if (!duplicate) merged.push(threat);
  });

  return merged;
};

const buildThreat = (code, reason, severity = "high", source = "guardrail") => ({
  code,
  severity,
  reason,
  source,
  detectedAt: new Date(),
});

const isPrivilegedRole = (actorRole) =>
  PRIVILEGED_ROLES.has(String(actorRole || "").toLowerCase());

const cleanupExpiredSessionLocks = () => {
  const now = Date.now();

  for (const [userId, lockedUntil] of DISABLED_AI_SESSIONS.entries()) {
    if (lockedUntil <= now) DISABLED_AI_SESSIONS.delete(userId);
  }
};

const isAISessionDisabled = (userId) => {
  cleanupExpiredSessionLocks();

  const key = String(userId);
  const lockedUntil = DISABLED_AI_SESSIONS.get(key);

  if (!lockedUntil) return false;
  if (lockedUntil <= Date.now()) {
    DISABLED_AI_SESSIONS.delete(key);
    return false;
  }

  return true;
};

const setAISessionDisabled = (userId, disableMinutes = DEFAULT_DISABLE_MINUTES) => {
  const minutes = Number.isFinite(disableMinutes)
    ? Math.max(1, Math.min(1440, disableMinutes))
    : DEFAULT_DISABLE_MINUTES;

  const lockedUntil = Date.now() + minutes * 60 * 1000;
  DISABLED_AI_SESSIONS.set(String(userId), lockedUntil);
  return new Date(lockedUntil);
};

const detectPromptThreats = (sanitizedPrompt) => {
  if (!sanitizedPrompt) {
    return [buildThreat("EMPTY_PROMPT", "Prompt was empty or invalid.", "medium")];
  }

  const threats = [];

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitizedPrompt)) {
      threats.push(
        buildThreat(
          "PROMPT_INJECTION_ATTEMPT",
          `Prompt matched suspicious pattern: ${pattern}`,
          "high",
          "input"
        )
      );
      break;
    }
  }

  return threats;
};

const extractResponseText = (rawResponse) => {
  if (typeof rawResponse === "string") return rawResponse;

  const candidateText =
    rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
    rawResponse?.content?.parts?.[0]?.text;

  if (candidateText) return toSafeString(candidateText);
  if (typeof rawResponse?.text === "function") return toSafeString(rawResponse.text());
  if (typeof rawResponse?.text === "string") return rawResponse.text;

  return toSafeString(rawResponse);
};

const detectResponseThreats = ({ feature, responseText, parsedResponse }) => {
  const threats = [];
  const policy = FEATURE_POLICY_MAP[feature] || FEATURE_POLICY_MAP.report_analysis;
  const text = sanitizeResponseText(responseText);

  if (!text) {
    threats.push(
      buildThreat(
        "EMPTY_RESPONSE",
        "AI returned an empty response.",
        "high",
        "output"
      )
    );
    return threats;
  }

  if (text.length >= MAX_RESPONSE_CHARS) {
    threats.push(
      buildThreat(
        "ABNORMAL_RESPONSE_SIZE",
        "AI response exceeded the allowed output size.",
        "medium",
        "output"
      )
    );
  }

  for (const pattern of OUT_OF_SCOPE_RESPONSE_PATTERNS) {
    if (pattern.test(text)) {
      threats.push(
        buildThreat(
          "OUT_OF_SCOPE_RESPONSE",
          `AI response matched out-of-scope pattern: ${pattern}`,
          "high",
          "output"
        )
      );
      break;
    }
  }

  if (policy.requiredResponseKeys.length > 0) {
    const parsedObject =
      parsedResponse && typeof parsedResponse === "object" && !Array.isArray(parsedResponse)
        ? parsedResponse
        : null;

    if (!parsedObject) {
      threats.push(
        buildThreat(
          "UNEXPECTED_RESPONSE_STRUCTURE",
          "AI response did not follow expected JSON structure.",
          "high",
          "output"
        )
      );
    } else {
      const missingKeys = policy.requiredResponseKeys.filter(
        (key) => !(key in parsedObject)
      );

      if (missingKeys.length > 0) {
        threats.push(
          buildThreat(
            "STRUCTURE_DEVIATION",
            `AI response is missing required keys: ${missingKeys.join(", ")}`,
            "high",
            "output"
          )
        );
      }
    }
  }

  if (!policy.domainRegex.test(text)) {
    threats.push(
      buildThreat(
        "DOMAIN_MISMATCH",
        "AI response appears outside the allowed healthcare context.",
        "medium",
        "output"
      )
    );
  }

  return threats;
};

const addActionHistoryEntry = (activity, action, actorId, actorRole, note = "", metadata = null) => {
  const actorObjectId = toObjectId(actorId);

  activity.actionHistory.push({
    action,
    actorId: actorObjectId,
    actorRole: actorRole || "user",
    note: String(note || "").slice(0, 500),
    timestamp: new Date(),
    metadata,
  });
};

const canAccessActivity = (activity, actorId, actorRole) => {
  if (!activity) return false;
  if (isPrivilegedRole(actorRole)) return true;
  return String(activity.userId) === String(actorId);
};

const formatActivityForClient = (activity) => {
  if (!activity) return null;

  return {
    request_id: activity.requestId,
    user_id: String(activity.userId),
    feature: activity.feature,
    module: activity.module,
    input_prompt: activity.inputPrompt,
    ai_response: activity.aiResponse,
    response_text: activity.responseText,
    timestamp: activity.createdAt,
    started_at: activity.startedAt,
    completed_at: activity.completedAt,
    duration_ms: activity.durationMs,
    model: activity.model,
    status: activity.status,
    threats: activity.threats || [],
    blocked_reason: activity.blockedReason || "",
    override_granted: Boolean(activity.overrideGranted),
    session_id: activity.sessionId || "",
    metadata: activity.metadata || {},
    actions: activity.actionHistory || [],
  };
};

const emitThreatSignals = async (activity, threats, blocked = false) => {
  const requestId = activity.requestId;
  const userId = String(activity.userId);

  try {
    sendEventToUser(userId, "ai:threat", {
      requestId,
      feature: activity.feature,
      module: activity.module,
      status: blocked ? AI_ACTIVITY_STATUS.BLOCKED : AI_ACTIVITY_STATUS.FLAGGED,
      message:
        "Suspicious AI activity detected. The AI is attempting an unauthorized operation.",
      threats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to send real-time threat event:", error.message);
  }

  try {
    const NotificationModel = Notification();
    const notification = await NotificationModel.create({
      userId: activity.userId,
      title: "Suspicious AI activity detected",
      message:
        "The AI attempted an unauthorized operation. Review and choose Stop, Allow, or Report.",
      type: "warning",
      link: `/dashboard/reports?aiRequestId=${requestId}`,
    });

    sendEventToUser(userId, "notification", {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      createdAt: notification.createdAt,
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to create threat notification:", error.message);
  }
};

const emitActivitySnapshot = (activity) => {
  try {
    sendEventToUser(String(activity.userId), "ai:activity", {
      requestId: activity.requestId,
      feature: activity.feature,
      module: activity.module,
      status: activity.status,
      startedAt: activity.startedAt,
      completedAt: activity.completedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to emit activity snapshot:", error.message);
  }
};

export class AIGuardrailError extends Error {
  constructor(
    message,
    {
      code = "AI_GUARDRAIL_ERROR",
      statusCode = 400,
      requestId = null,
      status = AI_ACTIVITY_STATUS.FLAGGED,
      threats = [],
      responsePayload = null,
    } = {}
  ) {
    super(message);
    this.name = "AIGuardrailError";
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.status = status;
    this.threats = threats;
    this.responsePayload = responsePayload;
  }
}

export const isAIGuardrailError = (error) => error instanceof AIGuardrailError;

export const startGuardedAIRequest = async ({
  userId,
  feature,
  module,
  inputPrompt,
  metadata = {},
  model = "gemini-3-flash-preview",
  sessionId = "",
}) => {
  const ActivityModel = AIActivity();
  const userObjectId = toObjectId(userId);

  if (!userObjectId) {
    throw new Error("Invalid user ID provided for AI guardrail request.");
  }

  const normalizedFeature = sanitizeFeature(feature);
  const prompt = toSafeString(inputPrompt).slice(0, MAX_PROMPT_CHARS);
  const sanitizedPrompt = sanitizePromptInput(prompt);
  const requestId = crypto.randomUUID();

  const promptThreats = detectPromptThreats(sanitizedPrompt);
  const sessionDisabled = isAISessionDisabled(userObjectId);

  const initialThreats = [...promptThreats];
  if (sessionDisabled) {
    initialThreats.push(
      buildThreat(
        "SESSION_AI_DISABLED",
        "AI is temporarily disabled for this session.",
        "high",
        "session"
      )
    );
  }

  let status = AI_ACTIVITY_STATUS.AUTHORIZED;
  if (sessionDisabled) status = AI_ACTIVITY_STATUS.BLOCKED;
  else if (promptThreats.length > 0) status = AI_ACTIVITY_STATUS.FLAGGED;

  const activity = await ActivityModel.create({
    requestId,
    userId: userObjectId,
    feature: normalizedFeature,
    module: module || FEATURE_POLICY_MAP[normalizedFeature].module,
    model,
    inputPrompt: prompt,
    sanitizedPrompt,
    status,
    threats: initialThreats,
    startedAt: new Date(),
    sessionId: String(sessionId || ""),
    metadata,
  });

  emitActivitySnapshot(activity);

  if (status === AI_ACTIVITY_STATUS.AUTHORIZED) {
    ACTIVE_REQUEST_CONTROL.set(requestId, {
      userId: String(userObjectId),
      feature: normalizedFeature,
      stopRequested: false,
      overrideAllowed: false,
      createdAt: Date.now(),
    });

    return {
      requestId,
      sanitizedPrompt,
      feature: normalizedFeature,
      activity: formatActivityForClient(activity),
    };
  }

  await emitThreatSignals(activity, initialThreats, status === AI_ACTIVITY_STATUS.BLOCKED);

  throw new AIGuardrailError(
    "Suspicious AI activity detected. The AI request has been blocked.",
    {
      code: status === AI_ACTIVITY_STATUS.BLOCKED
        ? "AI_SESSION_TEMPORARILY_DISABLED"
        : "AI_THREAT_DETECTED",
      statusCode: 403,
      requestId,
      status,
      threats: initialThreats,
    }
  );
};

export const assertAIExecutionAllowed = (requestId) => {
  const control = ACTIVE_REQUEST_CONTROL.get(String(requestId));
  if (!control) return;

  if (control.stopRequested) {
    throw new AIGuardrailError("AI execution was stopped by user/admin action.", {
      code: "AI_EXECUTION_STOPPED",
      statusCode: 409,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
      threats: [
        buildThreat(
          "STOPPED_BY_USER",
          "AI execution was stopped before completion.",
          "medium",
          "control"
        ),
      ],
    });
  }
};

export const finalizeGuardedAIRequest = async ({
  requestId,
  rawResponse,
  parsedResponse = null,
  metadataUpdate = {},
}) => {
  const ActivityModel = AIActivity();
  const activity = await ActivityModel.findOne({ requestId });

  if (!activity) {
    throw new Error(`AI activity with requestId ${requestId} not found.`);
  }

  const control = ACTIVE_REQUEST_CONTROL.get(String(requestId));
  const responseText = extractResponseText(rawResponse);
  const detectedThreats = detectResponseThreats({
    feature: activity.feature,
    responseText,
    parsedResponse,
  });

  let finalStatus = AI_ACTIVITY_STATUS.AUTHORIZED;
  const allThreats = mergeThreats(activity.threats, detectedThreats);

  if (control?.stopRequested) {
    finalStatus = AI_ACTIVITY_STATUS.BLOCKED;
    allThreats.push(
      buildThreat(
        "STOPPED_BY_USER",
        "AI response was blocked because execution was stopped.",
        "medium",
        "control"
      )
    );
    activity.blockedReason = "Execution stopped by user/admin";
  } else if (detectedThreats.length > 0 && !control?.overrideAllowed) {
    finalStatus = AI_ACTIVITY_STATUS.FLAGGED;
    activity.blockedReason = "Unauthorized or suspicious AI output detected";
  }

  activity.aiResponse = rawResponse;
  activity.responseText = sanitizeResponseText(responseText);
  activity.status = finalStatus;
  activity.threats = allThreats;
  activity.metadata = {
    ...(activity.metadata || {}),
    ...(metadataUpdate || {}),
  };

  const completedAt = new Date();
  activity.completedAt = completedAt;
  activity.durationMs = Math.max(
    0,
    completedAt.getTime() - new Date(activity.startedAt).getTime()
  );

  await activity.save();
  ACTIVE_REQUEST_CONTROL.delete(String(requestId));

  emitActivitySnapshot(activity);

  if (finalStatus === AI_ACTIVITY_STATUS.AUTHORIZED) {
    return {
      requestId,
      status: finalStatus,
      threats: [],
      activity: formatActivityForClient(activity),
    };
  }

  await emitThreatSignals(activity, allThreats, finalStatus === AI_ACTIVITY_STATUS.BLOCKED);

  throw new AIGuardrailError(
    "Suspicious AI activity detected. The AI is attempting an unauthorized operation.",
    {
      code:
        finalStatus === AI_ACTIVITY_STATUS.BLOCKED
          ? "AI_EXECUTION_BLOCKED"
          : "AI_THREAT_DETECTED",
      statusCode: 403,
      requestId,
      status: finalStatus,
      threats: allThreats,
      responsePayload: activity.aiResponse,
    }
  );
};

export const markGuardedAIRequestFailure = async (requestId, error) => {
  try {
    const ActivityModel = AIActivity();
    const activity = await ActivityModel.findOne({ requestId });

    if (!activity) return;

    const failureThreat = buildThreat(
      "AI_UPSTREAM_FAILURE",
      normalizeWhitespace(error?.message || "External AI service failure."),
      "medium",
      "upstream"
    );

    activity.status = AI_ACTIVITY_STATUS.BLOCKED;
    activity.blockedReason = failureThreat.reason;
    activity.threats = mergeThreats(activity.threats, [failureThreat]);

    const completedAt = new Date();
    activity.completedAt = completedAt;
    activity.durationMs = Math.max(
      0,
      completedAt.getTime() - new Date(activity.startedAt).getTime()
    );

    await activity.save();
    ACTIVE_REQUEST_CONTROL.delete(String(requestId));
    emitActivitySnapshot(activity);
  } catch (trackingError) {
    console.error("[AI Guardrail] Failed to record AI request failure:", trackingError.message);
  }
};

export const stopAIExecutionByRequest = async ({
  requestId,
  actorId,
  actorRole = "user",
  disableSession = false,
  disableMinutes = DEFAULT_DISABLE_MINUTES,
  note = "",
}) => {
  const ActivityModel = AIActivity();
  const activity = await ActivityModel.findOne({ requestId });

  if (!activity) {
    throw new AIGuardrailError("AI request not found.", {
      code: "AI_REQUEST_NOT_FOUND",
      statusCode: 404,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  if (!canAccessActivity(activity, actorId, actorRole)) {
    throw new AIGuardrailError("Not authorized to stop this AI request.", {
      code: "AI_REQUEST_FORBIDDEN",
      statusCode: 403,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  const control = ACTIVE_REQUEST_CONTROL.get(String(requestId)) || {
    userId: String(activity.userId),
    feature: activity.feature,
    stopRequested: false,
    overrideAllowed: false,
    createdAt: Date.now(),
  };

  control.stopRequested = true;
  ACTIVE_REQUEST_CONTROL.set(String(requestId), control);

  const stopThreat = buildThreat(
    "STOPPED_BY_USER",
    "AI execution was stopped manually by user/admin.",
    "medium",
    "control"
  );

  activity.status = AI_ACTIVITY_STATUS.BLOCKED;
  activity.blockedReason = "Execution stopped by user/admin";
  activity.threats = mergeThreats(activity.threats, [stopThreat]);
  addActionHistoryEntry(activity, "STOPPED", actorId, actorRole, note, {
    disableSession: Boolean(disableSession),
    disableMinutes,
  });

  if (!activity.completedAt) {
    const completedAt = new Date();
    activity.completedAt = completedAt;
    activity.durationMs = Math.max(
      0,
      completedAt.getTime() - new Date(activity.startedAt).getTime()
    );
  }

  let sessionLockedUntil = null;
  if (disableSession) {
    sessionLockedUntil = setAISessionDisabled(activity.userId, disableMinutes);
  }

  await activity.save();
  emitActivitySnapshot(activity);

  try {
    sendEventToUser(String(activity.userId), "ai:execution-stopped", {
      requestId: activity.requestId,
      feature: activity.feature,
      message: "AI execution was stopped.",
      sessionDisabledUntil: sessionLockedUntil,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to emit stop event:", error.message);
  }

  return {
    activity: formatActivityForClient(activity),
    session_disabled_until: sessionLockedUntil,
  };
};

export const allowAIRequestOverride = async ({
  requestId,
  actorId,
  actorRole = "user",
  note = "",
}) => {
  const ActivityModel = AIActivity();
  const activity = await ActivityModel.findOne({ requestId });

  if (!activity) {
    throw new AIGuardrailError("AI request not found.", {
      code: "AI_REQUEST_NOT_FOUND",
      statusCode: 404,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  if (!canAccessActivity(activity, actorId, actorRole)) {
    throw new AIGuardrailError("Not authorized to override this AI request.", {
      code: "AI_REQUEST_FORBIDDEN",
      statusCode: 403,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  if (activity.status === AI_ACTIVITY_STATUS.BLOCKED && !activity.aiResponse) {
    throw new AIGuardrailError(
      "This AI request is blocked and has no response available for override.",
      {
        code: "AI_OVERRIDE_NOT_AVAILABLE",
        statusCode: 409,
        requestId,
        status: activity.status,
      }
    );
  }

  const control = ACTIVE_REQUEST_CONTROL.get(String(requestId)) || {
    userId: String(activity.userId),
    feature: activity.feature,
    stopRequested: false,
    overrideAllowed: false,
    createdAt: Date.now(),
  };

  const previousStatus = activity.status;

  control.overrideAllowed = true;
  ACTIVE_REQUEST_CONTROL.set(String(requestId), control);

  activity.overrideGranted = true;
  if (activity.status === AI_ACTIVITY_STATUS.FLAGGED) {
    activity.status = AI_ACTIVITY_STATUS.AUTHORIZED;
    activity.blockedReason = "";
  }

  addActionHistoryEntry(activity, "ALLOWED_OVERRIDE", actorId, actorRole, note, {
    previousStatus,
  });

  await activity.save();
  emitActivitySnapshot(activity);

  try {
    sendEventToUser(String(activity.userId), "ai:override-applied", {
      requestId: activity.requestId,
      feature: activity.feature,
      message: "AI override applied. Response released.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to emit override event:", error.message);
  }

  return {
    activity: formatActivityForClient(activity),
    released_response: activity.aiResponse,
    released_text: activity.responseText,
  };
};

export const reportAIRequestIssue = async ({
  requestId,
  actorId,
  actorRole = "user",
  note = "",
}) => {
  const ActivityModel = AIActivity();
  const activity = await ActivityModel.findOne({ requestId });

  if (!activity) {
    throw new AIGuardrailError("AI request not found.", {
      code: "AI_REQUEST_NOT_FOUND",
      statusCode: 404,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  if (!canAccessActivity(activity, actorId, actorRole)) {
    throw new AIGuardrailError("Not authorized to report this AI request.", {
      code: "AI_REQUEST_FORBIDDEN",
      statusCode: 403,
      requestId,
      status: AI_ACTIVITY_STATUS.BLOCKED,
    });
  }

  addActionHistoryEntry(activity, "REPORTED", actorId, actorRole, note, {
    statusAtReport: activity.status,
  });

  await activity.save();
  emitActivitySnapshot(activity);

  try {
    sendEventToUser(String(activity.userId), "ai:issue-reported", {
      requestId: activity.requestId,
      feature: activity.feature,
      message: "AI issue reported for review.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AI Guardrail] Failed to emit report event:", error.message);
  }

  return {
    activity: formatActivityForClient(activity),
  };
};

export const getAIRequestById = async (requestId) => {
  const ActivityModel = AIActivity();
  const activity = await ActivityModel.findOne({ requestId });
  return formatActivityForClient(activity);
};

export const listAIActivities = async ({
  actorId,
  actorRole,
  status,
  feature,
  page = 1,
  limit = 20,
  targetUserId = null,
}) => {
  const ActivityModel = AIActivity();

  const safePage = Number.isFinite(Number(page))
    ? Math.max(1, Number.parseInt(page, 10))
    : 1;
  const safeLimit = Number.isFinite(Number(limit))
    ? Math.max(1, Math.min(100, Number.parseInt(limit, 10)))
    : 20;

  const query = {};

  if (status && Object.values(AI_ACTIVITY_STATUS).includes(String(status))) {
    query.status = String(status);
  }

  if (feature) {
    query.feature = sanitizeFeature(feature);
  }

  if (isPrivilegedRole(actorRole) && targetUserId) {
    const targetObjectId = toObjectId(targetUserId);
    if (targetObjectId) query.userId = targetObjectId;
  } else {
    const actorObjectId = toObjectId(actorId);
    if (!actorObjectId) {
      throw new AIGuardrailError("Invalid actor identity for activity lookup.", {
        code: "INVALID_ACTOR",
        statusCode: 400,
      });
    }
    query.userId = actorObjectId;
  }

  const [items, total] = await Promise.all([
    ActivityModel.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit),
    ActivityModel.countDocuments(query),
  ]);

  return {
    items: items.map((item) => formatActivityForClient(item)),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      total_pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

export const buildGuardrailErrorPayload = (error) => {
  if (!isAIGuardrailError(error)) return null;

  return {
    request_id: error.requestId,
    status: error.status,
    threats: error.threats || [],
    response_payload: error.responsePayload || null,
    message:
      "Suspicious AI activity detected. The AI is attempting an unauthorized operation.",
  };
};
