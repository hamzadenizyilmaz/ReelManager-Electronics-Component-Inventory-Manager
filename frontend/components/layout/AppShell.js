"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Loader2 } from "lucide-react";

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated, hydrate } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (hydrated && !token && pathname !== "/login") router.replace("/login");
  }, [hydrated, token, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="page-card flex items-center gap-3 px-6 py-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> Güvenli oturum hazırlanıyor...
        </div>
      </div>
    );
  }

  if (!token && pathname !== "/login") return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
