const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLE_VALUES, ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 72,
      select: false,
    },
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{12}$/,
    },
    fullName: {
      type: String,
      trim: true,
      required: function requiredFullName() {
        return this.role === ROLES.DOCTOR;
      },
    },
    medicalLicenseNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: function requiredMedicalLicenseNumber() {
        return this.role === ROLES.DOCTOR;
      },
    },
    specialization: {
      type: String,
      trim: true,
      required: function requiredSpecialization() {
        return this.role === ROLES.DOCTOR;
      },
    },
    hospitalOrClinicName: {
      type: String,
      trim: true,
      required: function requiredHospitalOrClinicName() {
        return this.role === ROLES.DOCTOR;
      },
    },
    pharmacyName: {
      type: String,
      trim: true,
      required: function requiredPharmacyName() {
        return this.role === ROLES.PHARMACY;
      },
    },
    pharmacyLicenseNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: function requiredPharmacyLicenseNumber() {
        return this.role === ROLES.PHARMACY;
      },
    },
    pharmacyAddress: {
      type: String,
      trim: true,
      required: function requiredPharmacyAddress() {
        return this.role === ROLES.PHARMACY;
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerificationTokenHash: {
      type: String,
      select: false,
    },
    emailVerificationExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationTokenHash;
  delete userObject.emailVerificationExpiresAt;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
