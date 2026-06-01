"use client";

import { Menu, Moon, Search, Sun, Languages, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { useUI } from "../providers/Providers";

export default function Topbar({ onMenu }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, lang, setLang, t } = useUI();
  const languageLabel = lang === "tr" ? "Türkçe" : "English";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/75 bg-white/92 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/92">
      <div className="flex h-16 min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onMenu} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"><Menu className="h-5 w-5" /></button>
        <div className="hidden flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-[15px] text-slate-500">{lang === "tr" ? "Ara — SKU, part number, lokasyon..." : "Search — SKU, part number, location..."}</span>
        </div>
        <button type="button" onClick={() => setLang(lang === "tr" ? "en" : "tr")} className="btn-ghost px-3"><Languages className="h-4 w-4" />{languageLabel}</button>
        <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="btn-ghost px-3">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        <div className="hidden text-right sm:block">
          <div className="text-[15px] font-bold">{user?.name || "Admin"}</div>
          <div className="text-xs text-slate-500">{user?.role || "admin"}</div>
        </div>
        <button type="button" className="btn-ghost px-3" onClick={() => { logout(); router.replace("/login"); }}><LogOut className="h-4 w-4" /></button>
      </div>
    </header>
  );
}
