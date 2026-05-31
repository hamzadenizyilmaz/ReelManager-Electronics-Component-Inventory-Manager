"use client";

import EmptyState from "../ui/EmptyState";
import Skeleton from "../ui/Skeleton";

export default function DataTable({ columns = [], rows = [], loading, emptyTitle, rowKey = "id" }) {
  if (loading) return <div className="page-card space-y-3 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  if (!rows.length) return <EmptyState title={emptyTitle || "Kayıt bulunamadı"} />;
  return (
    <div className="page-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/70 dark:divide-slate-800">
          <thead className="bg-slate-50/80 dark:bg-slate-900/70">
            <tr>{columns.map((col) => <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{col.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {rows.map((row, index) => <tr key={row[rowKey] || index} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/40">{columns.map((col) => <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{col.render ? col.render(row) : row[col.key]}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
