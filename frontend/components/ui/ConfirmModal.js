"use client";

import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "İşlemi onayla",
  description = "Bu işlem geri alınamaz. Devam etmek istiyor musunuz?",
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  danger = false,
  loading = false,
  onConfirm,
  onClose
}) {
  if (!open) return null;

  const Icon = danger ? AlertTriangle : CheckCircle2;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/72 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="w-full rounded-t-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-w-xl sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${
                danger
                  ? "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-300"
                  : "bg-blue-500/10 text-blue-600 ring-blue-500/20 dark:text-blue-300"
              }`}
            >
              <Icon size={24} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:flex sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="order-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 sm:order-1"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`order-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold text-white transition disabled:opacity-60 sm:order-2 ${
              danger ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "İşleniyor..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
