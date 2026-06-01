"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";
import { apiError, api, unwrap } from "../../lib/api";
import { useUI } from "../../components/providers/Providers";
import { formatDate } from "../../lib/formatters";
import { actionLabel, entityLabel, statusLabel } from "../../lib/log-labels";

export default function ActivityPage() {
  const { toast, lang } = useUI();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: "", entityType: "", method: "", statusCode: "" });

  async function load() {
    setLoading(true);
    try {
      const data = unwrap(await api.get("/activity-logs", { params: filters }));
      setRows(data?.items || data || []);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const columns = [
    { key: "date", header: lang === "tr" ? "Tarih" : "Date", render: (row) => formatDate(row.createdAt) },
    { key: "user", header: lang === "tr" ? "Kullanıcı" : "User", render: (row) => row.user?.name || row.user?.email || (lang === "tr" ? "Sistem" : "System") },
    { key: "action", header: lang === "tr" ? "İşlem" : "Action", render: (row) => <span className="chip">{actionLabel(row.action, lang)}</span> },
    { key: "entityType", header: lang === "tr" ? "Bölüm" : "Section", render: (row) => entityLabel(row.entityType, lang) },
    { key: "status", header: lang === "tr" ? "Durum" : "Status", render: (row) => statusLabel(row.newValue?.statusCode, lang) },
    { key: "ipAddress", header: "IP", render: (row) => row.ipAddress || "-" },
    { key: "duration", header: lang === "tr" ? "Süre" : "Duration", render: (row) => row.newValue?.durationMs ? `${row.newValue.durationMs} ms` : "-" },
    { key: "detail", header: lang === "tr" ? "Detay" : "Details", render: (row) => <Link className="btn-ghost px-3 py-2" href={`/activity/${row.id}`}><Eye className="h-4 w-4" />{lang === "tr" ? "Detay" : "Details"}</Link> }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Audit Center"
        title={lang === "tr" ? "Aktivite Logları" : "Activity Logs"}
        description={lang === "tr" ? "Kullanıcı işlemleri, API istekleri, güvenlik olayları, stok operasyonları ve ayar değişiklikleri denetlenebilir kayıt olarak saklanır." : "User operations, API requests, security events, stock actions and settings changes are stored as auditable records."}
        actions={<button className="btn-ghost" onClick={load}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />{lang === "tr" ? "Yenile" : "Refresh"}</button>}
      />
      <section className="page-card mb-5 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-5">
          <input className="input" placeholder={lang === "tr" ? "İşlem: UPDATE, DELETE..." : "Action: UPDATE, DELETE..."} value={filters.action} onChange={(e) => setFilters((p) => ({ ...p, action: e.target.value }))} />
          <input className="input" placeholder={lang === "tr" ? "Bölüm: components, settings..." : "Section: components, settings..."} value={filters.entityType} onChange={(e) => setFilters((p) => ({ ...p, entityType: e.target.value }))} />
          <input className="input" placeholder={lang === "tr" ? "Metod: GET, POST..." : "Method: GET, POST..."} value={filters.method} onChange={(e) => setFilters((p) => ({ ...p, method: e.target.value }))} />
          <input className="input" placeholder={lang === "tr" ? "Durum: 200, 401..." : "Status: 200, 401..."} value={filters.statusCode} onChange={(e) => setFilters((p) => ({ ...p, statusCode: e.target.value }))} />
          <button className="btn-primary" onClick={load}>{lang === "tr" ? "Filtrele" : "Filter"}</button>
        </div>
      </section>
      <DataTable columns={columns} rows={rows} loading={loading} />
    </AppShell>
  );
}
