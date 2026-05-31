"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
      <div className="font-semibold text-slate-900 dark:text-slate-50">{label}</div>
      <div className="mt-1 text-slate-600 dark:text-slate-300">Adet: <span className="font-bold">{payload[0].value}</span></div>
    </div>
  );
}

export default function DistributionChart({ data = [], nameKey = "name", valueKey = "count" }) {
  const safe = data.map((item) => ({
    name: item[nameKey] || item.category || item.supplier || item.packageCase || "-",
    count: Number(item[valueKey] || item.count || item._count?.components || item._count?.packageCase || 0)
  }));

  return (
    <div className="page-card h-80 p-5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safe} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-slate-500 dark:fill-slate-400" />
          <YAxis tick={{ fontSize: 12 }} className="fill-slate-500 dark:fill-slate-400" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,116,139,0.10)" }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--brand)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
