"use client";

export default function StatusBadge({ status }) {
  const map = {
    ok: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
    active: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
    low: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
    partial: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
    out: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
    missing: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300",
    draft: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300",
    completed: "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300",
    cancelled: "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300"
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${map[status] || map.draft}`}>{status || "-"}</span>;
}
