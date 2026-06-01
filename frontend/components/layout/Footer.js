"use client";

import Link from "next/link";
import { Github, ShieldCheck } from "lucide-react";
import { useUI } from "../providers/Providers";

export default function Footer() {
  const { t, lang } = useUI();

  return (
    <footer className="mt-6 border-t border-slate-200/70 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
          <span className="truncate">{t("footerText")}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span>{t("version")}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>{lang === "tr" ? "Dil" : "Language"}: {t("language")}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link
            href="https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"
            target="_blank"
            className="inline-flex items-center gap-1 font-semibold text-slate-600 transition hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-300"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
