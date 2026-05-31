"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, AlertTriangle, Archive, BarChart3, Boxes, Building2, ClipboardList, Database, FileInput, FolderKanban, Github, MapPin, PackageSearch, Printer, QrCode, Settings, ShoppingCart, Tags, X } from "lucide-react";
import { useUI } from "../providers/Providers";
import { cn } from "../../lib/formatters";

const nav = [
  { href: "/dashboard", key: "dashboard", icon: BarChart3 },
  { href: "/components", key: "components", icon: Boxes },
  { href: "/components/new", key: "newComponent", icon: PackageSearch },
  { href: "/projects", key: "projects", icon: FolderKanban },
  { href: "/stock", key: "stock", icon: ClipboardList },
  { href: "/low-stock", key: "lowStock", icon: AlertTriangle },
  { href: "/scanner", key: "scanner", icon: QrCode },
  { href: "/labels", key: "labels", icon: Printer },
  { href: "/import", key: "import", icon: FileInput },
  { href: "/reports", key: "reports", icon: Archive },
  { href: "/purchase", key: "purchase", icon: ShoppingCart },
  { href: "/activity", key: "activity", icon: Activity },
  { href: "/categories", key: "categories", icon: Tags },
  { href: "/suppliers", key: "suppliers", icon: Building2 },
  { href: "/locations", key: "locations", icon: MapPin },
  { href: "/settings", key: "settings", icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { t } = useUI();
  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")} onClick={onClose} />
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/70 bg-white/88 shadow-lg backdrop-blur-xl transition dark:border-slate-800 dark:bg-slate-950/88 lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between px-5">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-950">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">{t("appName")}</div>
              <div className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">SMD Stock</div>
            </div>
          </Link>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {nav.map((item) => {
            const Icon = item.icon;
            let active = pathname === item.href;
            if (!active && item.href !== "/dashboard") {
              if (item.href === "/components") active = pathname.startsWith("/components/") && pathname !== "/components/new";
              else active = pathname.startsWith(`${item.href}/`);
            }
            return (
              <Link key={item.href} href={item.href} onClick={onClose} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100")}>
                <Icon className={cn("h-5 w-5", active ? "text-brand-300 dark:text-brand-600" : "text-slate-400 group-hover:text-brand-500")} />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="m-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">
                Reel Manager v2.1.0 Enterprise
              </div>
            </div>
            <Github className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          </div>

          <a
            href="https://github.com/hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
          >
            <Github className="h-4 w-4 shrink-0" />
            <span className="truncate">GitHub Repository</span>
          </a>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">v2.1.0</span>
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">Next.js 15</span>
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">Node.js</span>
          </div>
        </div>
      </aside>
    </>
  );
}