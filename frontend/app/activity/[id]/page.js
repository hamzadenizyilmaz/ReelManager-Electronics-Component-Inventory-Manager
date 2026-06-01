"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import { api, unwrap, apiError } from "../../../lib/api";
import { useUI } from "../../../components/providers/Providers";
import { formatDate } from "../../../lib/formatters";
import { actionLabel, entityLabel, statusLabel } from "../../../lib/log-labels";

export default function ActivityDetailPage({ params }) {
  const { toast, lang } = useUI();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try { setRow(unwrap(await api.get(`/activity-logs/${params.id}`))); }
      catch (error) { toast(apiError(error), "error"); }
      finally { setLoading(false); }
    }
    load();
  }, [params.id, toast]);

  const value = row?.newValue || {};
  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Audit Detail"
        title={lang === "tr" ? "Log Detayı" : "Log Detail"}
        description={lang === "tr" ? "Seçilen işlem kaydının teknik detayları, istek bilgileri ve güvenlik bağlamı." : "Technical details, request metadata and security context for the selected audit record."}
        actions={<Link className="btn-ghost" href="/activity"><ArrowLeft className="h-4 w-4" />{lang === "tr" ? "Loglara Dön" : "Back to Logs"}</Link>}
      />
      {loading ? <div className="page-card p-6">{lang === "tr" ? "Yükleniyor..." : "Loading..."}</div> : null}
      {row ? <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="page-card p-5">
          <h2 className="mb-4 text-xl font-semibold">{lang === "tr" ? "Özet" : "Summary"}</h2>
          <Info label={lang === "tr" ? "Tarih" : "Date"} value={formatDate(row.createdAt)} />
          <Info label={lang === "tr" ? "İşlem" : "Action"} value={actionLabel(row.action, lang)} />
          <Info label={lang === "tr" ? "Bölüm" : "Section"} value={entityLabel(row.entityType, lang)} />
          <Info label={lang === "tr" ? "Durum" : "Status"} value={statusLabel(value.statusCode, lang)} />
          <Info label={lang === "tr" ? "Kullanıcı" : "User"} value={row.user?.name || row.user?.email || (lang === "tr" ? "Sistem" : "System")} />
          <Info label="IP" value={row.ipAddress || "-"} />
          <Info label={lang === "tr" ? "Tarayıcı / Cihaz" : "Browser / Device"} value={row.userAgent || "-"} />
        </section>
        <section className="page-card p-5">
          <h2 className="mb-4 text-xl font-semibold">{lang === "tr" ? "Teknik Kayıt" : "Technical Record"}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="HTTP" value={value.method || "-"} />
            <Info label="Route" value={value.route || value.path || "-"} />
            <Info label={lang === "tr" ? "Süre" : "Duration"} value={value.durationMs ? `${value.durationMs} ms` : "-"} />
            <Info label="Request ID" value={value.requestId || "-"} />
          </div>
          <pre className="mt-5 max-h-[560px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">{JSON.stringify({ query: value.query, params: value.params, body: value.body, previous: row.oldValue, current: row.newValue }, null, 2)}</pre>
        </section>
      </div> : null}
    </AppShell>
  );
}
function Info({ label, value }) { return <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60"><div className="field-label">{label}</div><div className="break-words font-semibold">{value || "-"}</div></div>; }
