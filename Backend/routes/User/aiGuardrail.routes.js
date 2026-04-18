import express from "express";
import { verifyToken } from "../../middleware/User/verifyToken.js";
import {
  getAIGuardrailActivity,
  getAIGuardrailActivities,
  stopAIGuardrailRequest,
  allowAIGuardrailOverride,
  reportAIGuardrailIssue,
} from "../../controllers/User/aiGuardrail.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/activities", getAIGuardrailActivities);
router.get("/activities/:requestId", getAIGuardrailActivity);
router.post("/activities/:requestId/stop", stopAIGuardrailRequest);
router.post("/activities/:requestId/allow", allowAIGuardrailOverride);
router.post("/activities/:requestId/report", reportAIGuardrailIssue);

export default router;
