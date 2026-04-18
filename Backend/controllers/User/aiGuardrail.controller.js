import {
  AIGuardrailError,
  getAIRequestById,
  listAIActivities,
  stopAIExecutionByRequest,
  allowAIRequestOverride,
  reportAIRequestIssue,
} from "../../services/assistant/aiGuardrail.service.js";

const resolveActorRole = (req) => req.user?.role || "user";

const handleControllerError = (res, error, fallbackMessage) => {
  if (error instanceof AIGuardrailError) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
      guardrail: {
        request_id: error.requestId,
        status: error.status,
        threats: error.threats || [],
      },
    });
  }

  console.error("[AI Guardrail Controller]", error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

export const getAIGuardrailActivity = async (req, res) => {
  try {
    const { requestId } = req.params;
    const actorId = req.user?.id;
    const actorRole = resolveActorRole(req);

    const activity = await getAIRequestById(requestId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "AI activity request not found.",
      });
    }

    const canAccess =
      String(activity.user_id) === String(actorId) ||
      ["admin", "founder", "staff", "team"].includes(String(actorRole).toLowerCase());

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this AI activity.",
      });
    }

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to fetch AI activity details."
    );
  }
};

export const getAIGuardrailActivities = async (req, res) => {
  try {
    const actorId = req.user?.id;
    const actorRole = resolveActorRole(req);
    const { status, feature, page, limit, userId } = req.query;

    const result = await listAIActivities({
      actorId,
      actorRole,
      status,
      feature,
      page,
      limit,
      targetUserId: userId,
    });

    return res.status(200).json({
      success: true,
      activities: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch AI guardrail activities.");
  }
};

export const stopAIGuardrailRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const actorId = req.user?.id;
    const actorRole = resolveActorRole(req);
    const { disableSession = false, disableMinutes = 15, note = "" } = req.body || {};

    const result = await stopAIExecutionByRequest({
      requestId,
      actorId,
      actorRole,
      disableSession,
      disableMinutes,
      note,
    });

    return res.status(200).json({
      success: true,
      message: "AI process stopped successfully.",
      activity: result.activity,
      session_disabled_until: result.session_disabled_until,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to stop AI execution.");
  }
};

export const allowAIGuardrailOverride = async (req, res) => {
  try {
    const { requestId } = req.params;
    const actorId = req.user?.id;
    const actorRole = resolveActorRole(req);
    const { note = "" } = req.body || {};

    const result = await allowAIRequestOverride({
      requestId,
      actorId,
      actorRole,
      note,
    });

    return res.status(200).json({
      success: true,
      message: "AI override applied.",
      activity: result.activity,
      released_response: result.released_response,
      released_text: result.released_text,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to allow AI override.");
  }
};

export const reportAIGuardrailIssue = async (req, res) => {
  try {
    const { requestId } = req.params;
    const actorId = req.user?.id;
    const actorRole = resolveActorRole(req);
    const { note = "" } = req.body || {};

    const result = await reportAIRequestIssue({
      requestId,
      actorId,
      actorRole,
      note,
    });

    return res.status(200).json({
      success: true,
      message: "AI issue reported successfully.",
      activity: result.activity,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to report AI issue.");
  }
};
