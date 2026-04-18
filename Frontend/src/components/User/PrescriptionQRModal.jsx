import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiX, FiCopy, FiRefreshCw, FiClock } from "react-icons/fi";
import { toast } from "react-hot-toast";

const PrescriptionQRModal = ({
  isOpen,
  onClose,
  onRegenerate,
  qrData,
  isLoading,
}) => {
  if (!isOpen) {
    return null;
  }

  const qrString = qrData?.qrString || "";
  const expiresAt = qrData?.expiresAt ? new Date(qrData.expiresAt) : null;

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(qrString);
      toast.success("Secure QR payload copied");
    } catch {
      toast.error("Failed to copy payload");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Prescription QR</h3>
            <p className="text-xs text-gray-600 mt-1">
              Pharmacy must validate signature and expiry before processing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Close QR modal"
          >
            <FiX className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="py-14 text-center text-gray-500">Generating secure QR...</div>
          ) : qrString ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <QRCodeCanvas value={qrString} size={220} includeMargin />
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 mb-4 text-sm text-blue-900">
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  <span className="font-medium">
                    Expires: {expiresAt ? expiresAt.toLocaleString() : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyPayload}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                >
                  <FiCopy className="w-4 h-4" />
                  Copy Payload
                </button>

                <button
                  onClick={onRegenerate}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            <div className="py-14 text-center text-gray-500">Unable to generate QR payload.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionQRModal;
