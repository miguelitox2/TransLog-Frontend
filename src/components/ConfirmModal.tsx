import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirmar",
  variant = "primary",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${variant === "danger" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors "
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
        </div>

        <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/10"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/10"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
