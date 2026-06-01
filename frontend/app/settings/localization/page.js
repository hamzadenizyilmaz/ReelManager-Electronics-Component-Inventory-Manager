"use client";

import Link from "next/link";
import { ArrowLeft, Languages, Save } from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";

import { useUI } from "../../../components/providers/Providers";

export default function LocalizationSettingsPage() {
  const { lang, setLang, toast } = useUI();

  function saveLanguage(next) {
    setLang(next);

    localStorage.setItem("reelmanager_language", next);
    localStorage.setItem("reel-lang", next);
    localStorage.setItem("reelmanager_locale", next);

    toast(
      next === "tr"
        ? "Dil Türkçe olarak ayarlandı."
        : "Language has been set to English.",
      "success"
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Language"
        title={lang === "tr" ? "Dil Seçimi" : "Language Selection"}
        description={
          lang === "tr"
            ? "Panelde görüntülenecek ana dili seçin. Seçim menüler, başlıklar, açıklamalar ve işlem metinlerine uygulanır."
            : "Choose the primary language used across menus, titles, descriptions and action labels."
        }
        actions={
          <Link className="btn-ghost" href="/settings">
            <ArrowLeft className="h-4 w-4" />
            {lang === "tr" ? "Ayarlar" : "Settings"}
          </Link>
        }
      />

      <section className="page-card p-5 sm:p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-brand-500/10 p-3 text-brand-600 dark:text-brand-300">
            <Languages className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {lang === "tr" ? "Sistem Dili" : "System Language"}
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {lang === "tr"
                ? "Kullanıcı arayüzü için varsayılan dili seçin. Değişiklik anında uygulanır."
                : "Select the default language for the user interface. Changes apply immediately."}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => saveLanguage("tr")}
            className={`rounded-3xl border p-6 text-left transition ${
              lang === "tr"
                ? "border-brand-500 bg-brand-500/10"
                : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            }`}
          >
            <div className="text-lg font-semibold">Türkçe</div>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Kurumsal Türkçe arayüz, operasyon ve açıklama metinleri.
            </p>
          </button>

          <button
            type="button"
            onClick={() => saveLanguage("en")}
            className={`rounded-3xl border p-6 text-left transition ${
              lang === "en"
                ? "border-brand-500 bg-brand-500/10"
                : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            }`}
          >
            <div className="text-lg font-semibold">English</div>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Professional English interface, operations and descriptions.
            </p>
          </button>
        </div>

        <button
          className="btn-primary mt-6"
          onClick={() => saveLanguage(lang)}
        >
          <Save className="h-4 w-4" />
          {lang === "tr" ? "Dil Ayarını Kaydet" : "Save Language Setting"}
        </button>
      </section>
    </AppShell>
  );
}