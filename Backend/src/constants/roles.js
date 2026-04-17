const ROLES = Object.freeze({
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
});

const ROLE_VALUES = Object.freeze(Object.values(ROLES));

module.exports = {
  ROLES,
  ROLE_VALUES,
};
