"use client";

const toneMap = {
  brand: "text-[#1f4e79] bg-[#eaf1f7] dark:text-[#9bbfe2] dark:bg-[#132233]",
  green: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
  yellow: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
  red: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/40",
  purple: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40"
};

export default function StatCard({ title, value, icon: Icon, tone = "brand", hint }) {
  return (
    <div className="page-card overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
          {hint ? <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</div> : null}
        </div>
        {Icon ? <div className={`rounded-xl p-3 ${toneMap[tone] || toneMap.brand}`}><Icon className="h-6 w-6" strokeWidth={2.2} /></div> : null}
      </div>
    </div>
  );
}
