const express = require('express');
const { ROLES } = require('../constants/roles');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { getMyProfile } = require('../controllers/authController');
const {
  doctorOnlyResource,
  pharmacyOnlyResource,
  patientOnlyResource,
} = require('../controllers/protectedController');

const router = express.Router();

router.use(authenticate);

router.get('/me', getMyProfile);
router.get('/doctor-only', authorizeRoles(ROLES.DOCTOR), doctorOnlyResource);
router.get('/pharmacy-only', authorizeRoles(ROLES.PHARMACY), pharmacyOnlyResource);
router.get('/patient-only', authorizeRoles(ROLES.PATIENT), patientOnlyResource);

module.exports = router;
