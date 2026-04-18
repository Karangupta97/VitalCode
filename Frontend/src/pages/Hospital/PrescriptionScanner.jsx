import React, { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import HospitalDashboardLayout from "../../components/Hospital/HospitalDashboardLayout";

const statusChip = {
  CREATED: "bg-slate-100 text-slate-700 border-slate-200",
  SCANNED: "bg-blue-100 text-blue-700 border-blue-200",
  ACCEPTED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  IN_PROCESS: "bg-amber-100 text-amber-800 border-amber-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FLAGGED: "bg-red-100 text-red-700 border-red-200",
};

const PrescriptionScanner = () => {
  const [qrInput, setQrInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [scanResponse, setScanResponse] = useState(null);
  const [lifecycleNote, setLifecycleNote] = useState("");

  const prescription = scanResponse?.prescription || null;
  const lifecycleStatus =
    (prescription?.lifecycleStatus || "CREATED").toString().toUpperCase();

  const nextActions = useMemo(() => {
    if (lifecycleStatus === "SCANNED") {
      return ["ACCEPTED"];
    }

    if (lifecycleStatus === "ACCEPTED") {
      return ["IN_PROCESS"];
    }

    return [];
  }, [lifecycleStatus]);

  const performScan = async () => {
    if (!qrInput.trim()) {
      toast.error("Paste scanned QR payload first");
      return;
    }

    setIsValidating(true);
    try {
      const response = await axios.post("/api/hospital/digital-prescriptions/scan", {
        qrData: qrInput.trim(),
      });
      setScanResponse(response.data);
      toast.success("Prescription QR validated");
    } catch (error) {
      const data = error.response?.data;
      if (data?.prescription) {
        setScanResponse(data);
      }
      toast.error(data?.message || "Scan validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const updateStatus = async (status) => {
    if (!prescription?._id) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await axios.patch(
        `/api/hospital/digital-prescriptions/${prescription._id}/lifecycle`,
        {
          status,
          note: lifecycleNote,
        }
      );

      setScanResponse((previous) => ({
        ...previous,
        ...response.data,
      }));

      setLifecycleNote("");
      toast.success(`Prescription moved to ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <HospitalDashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pharmacy Prescription Scanner</h1>
          <p className="text-sm text-gray-600 mt-1">
            Validate secure QR payload, detect suspicious activity, and progress lifecycle safely.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scanned QR Payload (JSON)
          </label>
          <textarea
            value={qrInput}
            onChange={(event) => setQrInput(event.target.value)}
            placeholder='Paste payload like {"prescription_id":"...","patient_id":"...","timestamp":...}'
            className="w-full min-h-44 rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={performScan}
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
            >
              <FiCamera className="w-4 h-4" />
              {isValidating ? "Validating..." : "Validate QR"}
            </button>
            <button
              onClick={() => {
                setQrInput("");
                setScanResponse(null);
                setLifecycleNote("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {scanResponse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Lifecycle Details</h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusChip[lifecycleStatus] || statusChip.CREATED}`}
                >
                  {lifecycleStatus}
                </span>
              </div>

              {scanResponse?.blocked && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" />
                  Processing blocked: {scanResponse.reason || "Invalid scan"}
                </div>
              )}

              {(prescription?.flags?.isFlagged || lifecycleStatus === "FLAGGED") && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center gap-2">
                  <FiShield className="w-4 h-4" />
                  Prescription is flagged and requires review.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Prescription ID</p>
                  <p className="text-sm font-medium text-gray-800 break-all">{prescription?._id || "-"}</p>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Patient ID</p>
                  <p className="text-sm font-medium text-gray-800 break-all">{prescription?.patientId || "-"}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h3>
              <div className="space-y-2">
                {(prescription?.lifecycleTimeline || []).length > 0 ? (
                  prescription.lifecycleTimeline
                    .slice()
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((event, index) => (
                      <div
                        key={`${event.action}-${event.timestamp}-${index}`}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{event.status || event.action}</p>
                          <p className="text-xs text-gray-600">{event.note || "Status updated"}</p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            By {event.actorName || event.actorRole || "System"}
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-500">
                          {event.timestamp ? new Date(event.timestamp).toLocaleString() : "-"}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">No timeline events yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Process Actions</h2>

              <label className="block text-xs text-gray-600 mb-1">Lifecycle Note (optional)</label>
              <textarea
                value={lifecycleNote}
                onChange={(event) => setLifecycleNote(event.target.value)}
                className="w-full min-h-24 rounded-lg border border-gray-300 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add processing note"
              />

              <div className="mt-3 space-y-2">
                {nextActions.length === 0 && (
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600 flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    No pharmacy transition available for current status.
                  </div>
                )}

                {nextActions.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={isUpdatingStatus || scanResponse?.blocked || lifecycleStatus === "FLAGGED"}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm disabled:opacity-60"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    Move to {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </HospitalDashboardLayout>
  );
};

export default PrescriptionScanner;
