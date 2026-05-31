"use client";

import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info
};

export default function ToastHost({ toasts = [], onClose }) {
  return (
    <div className="fixed right-4 top-4 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        return (
          <div key={toast.id} className="glass-panel flex items-start gap-3 rounded-xl p-4 shadow-glow">
            <Icon className="mt-0.5 h-5 w-5 text-brand-400" />
            <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</div>
            <button type="button" onClick={() => onClose(toast.id)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
