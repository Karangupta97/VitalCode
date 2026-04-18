import express from "express";
import { verifyToken } from "../../middleware/User/verifyToken.js";
import {
  getPatientByUMID,
  getPatientReports,
  getRecentPatients
} from "../../controllers/Hospital/hospital.controller.js";
import {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getOtherDoctorPrescriptions,
  scanPrescriptionQRCode,
  updatePrescriptionLifecycleByPharmacy,
  getPrescriptionLifecycle,
} from "../../controllers/Hospital/prescription.controller.js";
import { refreshReportUrl } from "../../controllers/User/reports.controller.js";

const router = express.Router();

const markPublicPharmacyScan = (req, _res, next) => {
  req.publicPharmacyScan = true;
  next();
};

// Public scan endpoint for pharmacy UI demo flow (Digital Prescription QR only)
router.post(
  "/digital-prescriptions/scan/public",
  markPublicPharmacyScan,
  scanPrescriptionQRCode
);

// All routes are protected with verifyToken middleware
router.use(verifyToken);

// Get recent patients for hospital dashboard
router.get("/recent-patients", getRecentPatients);

// Get patient by UMID
router.get("/patient/:umid", getPatientByUMID);

// Get patient reports
router.get("/patient/:patientId/reports", getPatientReports);

// Report URL refresh endpoint - handles expired S3 URLs
router.get("/reports/:id/refresh-url", refreshReportUrl);

// Add a direct route that matches the frontend API call pattern
router.get("/patient/:patientId/prescriptions", getPatientPrescriptions);

// Add route to get other doctor prescriptions
router.get("/patient/:patientId/other-prescriptions", getOtherDoctorPrescriptions);

// Prescription routes - Specific routes before pattern routes
router.post("/digital-prescriptions", createPrescription);
router.post("/digital-prescriptions/scan", scanPrescriptionQRCode);
router.get("/digital-prescriptions/patient/:patientId", getPatientPrescriptions);
router.get("/digital-prescriptions/doctor", getDoctorPrescriptions);
router.patch(
  "/digital-prescriptions/:prescriptionId/lifecycle",
  updatePrescriptionLifecycleByPharmacy
);
router.get(
  "/digital-prescriptions/:prescriptionId/lifecycle",
  getPrescriptionLifecycle
);
// This must come after more specific routes
router.get("/digital-prescriptions/:prescriptionId", getPrescriptionById);

export default router;