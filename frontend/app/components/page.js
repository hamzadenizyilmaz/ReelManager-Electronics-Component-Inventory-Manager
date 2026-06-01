"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Download, Eye, Plus, Search, Sparkles } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import { endpoints } from "../../lib/api";
import { downloadWithToken, formatNumber, stockStatus } from "../../lib/formatters";
import { useComponentStore } from "../../store/component.store";
import { useUI } from "../../components/providers/Providers";

export default function ComponentsPage() {
  const { t, toast } = useUI();
  const { items, meta, loading, fetch } = useComponentStore();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { fetch({ q, page, limit: 20 }).catch((e) => toast(e.message, "error")); }, [fetch, q, page, toast]);

  async function bulkEnrich() {
    try {
      await endpoints.components.bulkEnrich({ force: false });
      toast("Komponent enrichment kuyruğu tamamlandı", "success");
      fetch({ q, page, limit: 20 });
    } catch (error) {
      toast(error?.response?.data?.message || error.message || "Enrichment tamamlanamadı", "error");
    }
  }

  const columns = [
    { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">{r.internalSku}</span> },
    { key: "pn", header: t("partNumber"), render: (r) => <Link className="font-bold hover:text-brand-500" href={`/components/${r.id}`}>{r.manufacturerPartNumber}</Link> },
    { key: "category", header: t("category"), render: (r) => r.category?.name || r.category?.nameTr || "-" },
    { key: "value", header: t("value"), render: (r) => r.value || "-" },
    { key: "pkg", header: t("package"), render: (r) => r.packageCase || "-" },
    { key: "qty", header: t("available"), render: (r) => <span className="font-black">{formatNumber(r.quantityAvailable)}</span> },
    { key: "status", header: "Durum", render: (r) => <StatusBadge status={stockStatus(r)} /> },
    { key: "loc", header: t("location"), render: (r) => r.storageLocation?.name || r.storageLocation?.nameTr || "-" },
    { key: "detail", header: t("details"), render: (r) => <Link className="btn-ghost px-3 py-2 text-xs" href={`/components/${r.id}`}><Eye className="h-3.5 w-3.5" />DETAY</Link> }
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Inventory" title={t("components")} description="SMD direnç, kondansatör, diyot, IC ve tüm elektronik komponentleri gelişmiş filtrelerle yönet." actions={<><button className="btn-ghost" onClick={bulkEnrich}><Sparkles className="h-4 w-4" />Bulk Enrich</button><button className="btn-ghost" onClick={() => downloadWithToken(endpoints.importExport.csvUrl())}><Download className="h-4 w-4" />CSV</button><button className="btn-ghost" onClick={() => downloadWithToken(endpoints.importExport.xlsxUrl())}><Download className="h-4 w-4" />Excel</button><Link className="btn-primary" href="/components/new"><Plus className="h-4 w-4" />{t("newComponent")}</Link></>} />
      <div className="page-card mb-5 flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" /><input className="input pl-11" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="SKU, part number, değer, paket veya barkod ara..." /></div>
        <div className="text-sm font-semibold text-slate-500">{formatNumber(meta.total)} kayıt</div>
      </div>
      <DataTable columns={columns} rows={items} loading={loading} />
      <div className="mt-4 flex justify-end gap-2"><button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Önceki</button><button className="btn-ghost" disabled={page >= (meta.pages || 1)} onClick={() => setPage(page + 1)}>Sonraki</button></div>
    </AppShell>
  );
}
