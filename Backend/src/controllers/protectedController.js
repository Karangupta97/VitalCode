const asyncHandler = require('../utils/asyncHandler');

const doctorOnlyResource = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Doctor resource access granted.',
    data: {
      role: req.user.role,
    },
  });
});

const pharmacyOnlyResource = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pharmacy resource access granted.',
    data: {
      role: req.user.role,
    },
  });
});

const patientOnlyResource = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Patient resource access granted.',
    data: {
      role: req.user.role,
    },
  });
});

module.exports = {
  doctorOnlyResource,
  pharmacyOnlyResource,
  patientOnlyResource,
};
