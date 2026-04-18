import React from "react";
import {
  FiFileText,
  FiClock,
  FiCalendar,
  FiEye,
  FiUser,
  FiClipboard,
  FiChevronRight,
  FiPlusCircle,
  FiMapPin,
  FiActivity,
  FiHeart,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const STATUS_META = {
  CREATED: {
    label: "CREATED",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
    bar: "from-slate-500 to-slate-600",
    dot: "bg-slate-500",
  },
  SCANNED: {
    label: "SCANNED",
    chip: "bg-blue-100 text-blue-700 border-blue-200",
    bar: "from-blue-500 to-cyan-500",
    dot: "bg-blue-500",
  },
  ACCEPTED: {
    label: "ACCEPTED",
    chip: "bg-indigo-100 text-indigo-700 border-indigo-200",
    bar: "from-indigo-500 to-violet-500",
    dot: "bg-indigo-500",
  },
  IN_PROCESS: {
    label: "IN PROCESS",
    chip: "bg-amber-100 text-amber-800 border-amber-200",
    bar: "from-amber-500 to-orange-500",
    dot: "bg-amber-500",
  },
  DELIVERED: {
    label: "DELIVERED",
    chip: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "from-emerald-500 to-green-500",
    dot: "bg-emerald-500",
  },
  FLAGGED: {
    label: "FLAGGED",
    chip: "bg-red-100 text-red-700 border-red-200",
    bar: "from-red-500 to-rose-500",
    dot: "bg-red-500",
  },
};

const resolveStatus = (prescription) => {
  const lifecycleStatus =
    (prescription?.lifecycleStatus || "").toString().toUpperCase();

  if (STATUS_META[lifecycleStatus]) {
    return {
      key: lifecycleStatus,
      ...STATUS_META[lifecycleStatus],
    };
  }

  const legacy = (prescription?.status || "").toString().toUpperCase();
  if (legacy === "COMPLETED") {
    return {
      key: "DELIVERED",
      ...STATUS_META.DELIVERED,
    };
  }

  return {
    key: "CREATED",
    ...STATUS_META.CREATED,
  };
};

const DigitalPrescriptionCard = ({
  prescription,
  onView,
  onGenerateQr,
  isGeneratingQr = false,
  showQrButton = false,
}) => {
  const navigate = useNavigate();

  const statusMeta = resolveStatus(prescription);
  const suspiciousCount = Array.isArray(prescription?.suspiciousActivity)
    ? prescription.suspiciousActivity.length
    : 0;
  const isFlagged = statusMeta.key === "FLAGGED" || prescription?.flags?.isFlagged;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const prescriptionDate = new Date(dateString);
    const diffTime = Math.abs(now - prescriptionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  };

  const handleViewDetails = () => {
    if (onView && typeof onView === "function") {
      onView(prescription);
      return;
    }

    navigate(`/dashboard/digital-prescriptions/${prescription._id}`);
  };

  return (
    <div
      className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className={`w-full h-1 bg-gradient-to-r ${statusMeta.bar}`} />

      <div className="bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-sm border border-blue-200/50 dark:border-blue-700/50">
              <FiFileText className="text-blue-600 dark:text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Digital Prescription
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                {formatDate(prescription.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm border ${statusMeta.chip}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 italic">
              {getRelativeTime(prescription.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {isFlagged && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-xs font-medium flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4" />
            Suspicious activity detected. Processing is blocked pending review.
          </div>
        )}

        {prescription.doctor && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-700/30 dark:to-blue-900/10 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-sm">
              <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                Dr. {prescription.doctor}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiMapPin className="w-3 h-3" />
                <span className="truncate">
                  {prescription.hospitalName || "HealthVault Hospital"}
                </span>
              </div>
            </div>
          </div>
        )}

        {prescription.diagnosis && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <FiActivity className="w-4 h-4 text-purple-500" />
              Diagnosis
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50/30 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                {prescription.diagnosis}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <FiClipboard className="w-4 h-4 text-indigo-500" />
              Medications
            </div>
            {prescription.medications && prescription.medications.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">
                <FiHeart className="w-3 h-3" />
                {prescription.medications.length} prescribed
              </span>
            )}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50/30 dark:from-indigo-900/10 dark:to-blue-900/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            {prescription.medications && prescription.medications.length > 0 ? (
              <div className="space-y-2.5">
                {prescription.medications.slice(0, 2).map((med, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5">
                      <FiPlusCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {med.name}
                      </p>
                      {med.dosage && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {med.dosage} {med.frequency && `• ${med.frequency}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {prescription.medications.length > 2 && (
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-indigo-200/50 dark:border-indigo-700/50">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      +{prescription.medications.length - 2} more medications
                    </p>
                    <FiChevronRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-2">
                No medications listed
              </p>
            )}
          </div>
        </div>

        {suspiciousCount > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 px-3 py-2 text-xs font-medium flex items-center gap-2">
            <FiShield className="w-4 h-4" />
            {suspiciousCount} suspicious activity event{suspiciousCount > 1 ? "s" : ""} recorded.
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={(event) => {
              event.stopPropagation();
              handleViewDetails();
            }}
            className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg border border-blue-200/50 dark:border-blue-700/50"
          >
            <FiEye className="w-4 h-4" />
            View Details
          </button>

          <div className="flex gap-2">
            {showQrButton && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  if (typeof onGenerateQr === "function") {
                    onGenerateQr(prescription);
                    return;
                  }
                  toast("QR generation is not available here.");
                }}
                disabled={isGeneratingQr || isFlagged}
                className="flex items-center gap-1 text-xs font-medium text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg border border-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                title={isFlagged ? "Flagged prescription cannot generate QR" : "Generate secure QR"}
              >
                <FiShield className="w-4 h-4" />
                QR
              </button>
            )}

            <button
              onClick={(event) => {
                event.stopPropagation();
                toast.success("Reminder feature coming soon!");
              }}
              className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 p-2 rounded-lg border border-purple-200/50 dark:border-purple-700/50"
              title="Set Reminder"
            >
              <FiClock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
    </div>
  );
};

export default DigitalPrescriptionCard;
