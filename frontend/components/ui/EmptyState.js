"use client";

import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Kayıt yok", description = "Henüz gösterilecek veri bulunmuyor.", action }) {
  return (
    <div className="page-card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 rounded-3xl bg-slate-100 p-4 text-slate-500 dark:bg-slate-900 dark:text-slate-400"><Inbox className="h-8 w-8" /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
