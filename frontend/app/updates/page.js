"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  DownloadCloud,
  Github,
  HardDrive,
  Info,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
  X
} from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import { api, apiError, unwrap } from "../../lib/api";
import { useUI } from "../../components/providers/Providers";

const INTRO_KEY = "reelmanager_updates_intro_seen";

export default function UpdatesPage() {
  const { toast, lang } = useUI();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [info, setInfo] = useState(null);
  const [showIntro, setShowIntro] = useState(false);

  const isTr = lang === "tr";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(INTRO_KEY);
      setShowIntro(!seen);
      if (!seen) localStorage.setItem(INTRO_KEY, "1");
    }
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = unwrap(await api.get("/updates/check"));
      setInfo(data);
      if (data?.updateAvailable === false) {
        toast(isTr ? "Sistem zaten güncel." : "The system is already up to date.", "success");
      }
    } catch (e) {
      toast(apiError(e, isTr ? "Güncelleme bilgisi alınamadı." : "Update information could not be loaded."), "error");
    } finally {
      setLoading(false);
    }
  }

  async function update() {
    if (!info?.updateAvailable) {
      toast(isTr ? "Sürüm uyumlu. Güncelleme yapılmadı." : "Versions match. No update was applied.", "warning");
      return;
    }

    setUpdating(true);
    try {
      const data = unwrap(await api.post("/updates/apply"));
      setInfo((prev) => ({ ...prev, ...data }));
      toast(
        data?.message || (isTr ? "Güncelleme işlemi tamamlandı." : "Update process completed."),
        data?.applied ? "success" : "warning"
      );
      await load();
    } catch (e) {
      toast(apiError(e, isTr ? "Güncelleme işlemi başarısız." : "Update process failed."), "error");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const state = useMemo(() => {
    if (loading) return { tone: "slate", label: isTr ? "Kontrol ediliyor" : "Checking" };
    if (!info) return { tone: "red", label: isTr ? "Bilgi yok" : "No data" };
    if (info.updateAvailable) return { tone: "amber", label: isTr ? "Güncelleme var" : "Update available" };
    return { tone: "emerald", label: isTr ? "Güncel" : "Up to date" };
  }, [info, loading, isTr]);

  return (
    <AppShell>
      <PageHeader
        eyebrow={isTr ? "ReelManager - Sürüm Merkezi" : "ReelManager - Release Center"}
        title={isTr ? "Güncellemeler" : "Updates"}
        description={
          isTr
            ? "GitHub sürümünü kontrol edin, güncelleme öncesi dosya ve veritabanı yedeğini güvenli şekilde oluşturun."
            : "Check the GitHub release, create a safe file and database backup before applying updates."
        }
        actions={
          <button className="btn-ghost" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {isTr ? "Kontrol Et" : "Check"}
          </button>
        }
      />

      {showIntro ? (
        <section className="mb-5 rounded-3xl border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white dark:bg-blue-500/20 dark:text-blue-200">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold">
                  {isTr ? "Güncelleme güvenlik notu" : "Update safety notice"}
                </h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-900/75 dark:text-blue-100/75">
                  {isTr
                    ? "Bu bilgilendirme yalnızca bu sayfaya ilk girişinizde gösterilir. Güncelleme işlemi başlamadan önce sistem dosyaları ve SQL veritabanı yedeği otomatik oluşturulur."
                    : "This notice is shown only once when you first open this page. Before an update starts, system files and a SQL database backup are created automatically."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="rounded-xl p-2 text-blue-800 transition hover:bg-blue-100 dark:text-blue-100 dark:hover:bg-blue-400/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </section>
      ) : null}

      <div className={`grid gap-6 ${showIntro ? "xl:grid-cols-[1fr_360px]" : "xl:grid-cols-1"}`}>
        <section className="page-card overflow-hidden">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <Github className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-white">
                    {isTr ? "GitHub Sürüm Durumu" : "GitHub Release Status"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {isTr
                      ? "Mevcut kurulum ile GitHub üzerindeki son yayın karşılaştırılır. Sürüm aynıysa güncelleme uygulanmaz."
                      : "The installed version is compared with the latest GitHub release. If versions match, no update is applied."}
                  </p>
                </div>
              </div>

              <StatusPill tone={state.tone}>{state.label}</StatusPill>
            </div>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-2 sm:p-6">
            <InfoBox label={isTr ? "Mevcut sürüm" : "Current version"} value={info?.currentVersion || "-"} />
            <InfoBox label={isTr ? "Son GitHub sürümü" : "Latest GitHub version"} value={info?.latestVersion || "-"} />
            <InfoBox label={isTr ? "Repository" : "Repository"} value={info?.repository || "hamzadenizyilmaz/ReelManager-Electronics-Component-Inventory-Manager"} />
            <InfoBox label={isTr ? "Yayın tarihi" : "Published at"} value={formatDate(info?.publishedAt, isTr)} />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {info?.updateAvailable
                ? isTr
                  ? "Yeni sürüm bulundu. İşlemden önce otomatik yedek alınır."
                  : "A new release is available. A backup is created automatically before applying it."
                : isTr
                  ? "Sistem sürümü GitHub ile uyumlu. Güncelleme işlemi gerekmiyor."
                  : "The installed version matches GitHub. No update is required."}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {info?.htmlUrl ? (
                <a className="btn-ghost" target="_blank" rel="noreferrer" href={info.htmlUrl}>
                  <Github className="h-4 w-4" />
                  GitHub Release
                </a>
              ) : null}

              <button className="btn-primary" disabled={updating || loading || !info?.updateAvailable} onClick={update}>
                <DownloadCloud className="h-4 w-4" />
                {updating ? (isTr ? "Yedekleniyor ve güncelleniyor..." : "Backing up and updating...") : isTr ? "Güncellemeyi Uygula" : "Apply Update"}
              </button>
            </div>
          </div>
        </section>

        {showIntro ? (
        <aside className="space-y-4">
          <SmallCard
            icon={HardDrive}
            title={isTr ? "Güvenli yedekleme" : "Safe backup"}
            text={isTr ? "Güncelleme öncesinde proje dosyaları ve SQL veritabanı yedeği alınır." : "Project files and a SQL database backup are created before applying updates."}
          />
          <SmallCard
            icon={ShieldCheck}
            title={isTr ? "Sürüm kontrolü" : "Version guard"}
            text={isTr ? "Sürümler aynıysa işlem durdurulur ve sistem dosyalarına dokunulmaz." : "If versions match, the operation is stopped and system files are not modified."}
          />
          <SmallCard
            icon={TerminalSquare}
            title={isTr ? "Yönetici yetkisi" : "Admin only"}
            text={isTr ? "Güncelleme uygulama işlemi yalnızca backend izin bayrağı açıkken çalışır." : "Applying updates requires the backend permission flag to be enabled."}
          />
        </aside>
        ) : null}

      </div>
    </AppShell>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="field-label">{label}</div>
      <div className="mt-1 break-words text-base font-semibold text-slate-950 dark:text-white">{String(value || "-")}</div>
    </div>
  );
}

function StatusPill({ tone, children }) {
  const cls = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300",
    red: "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
    slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
  }[tone] || "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function SmallCard({ icon: Icon, title, text }) {
  return (
    <div className="page-card p-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}

function formatDate(value, isTr) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat(isTr ? "tr-TR" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
}
