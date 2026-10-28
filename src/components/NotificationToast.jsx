import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl animate-bounce-short">
      <div
        className={`p-1.5 rounded-xl ${
          isSuccess
            ? 'text-emerald-400 bg-emerald-500/10'
            : isError
            ? 'text-rose-400 bg-rose-500/10'
            : 'text-indigo-400 bg-indigo-500/10'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Info className="w-5 h-5" />
        )}
      </div>

      <p className="text-xs sm:text-sm font-medium text-white pr-2">
        {toast.message}
      </p>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

