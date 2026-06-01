"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch, Search, Tags } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import LabelPrintPanel from "../../components/labels/LabelPrintPanel";
import { apiError, endpoints, unwrap } from "../../lib/api";
import { formatNumber } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

export default function LabelsPage() {
  const { toast } = useUI();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState({});
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = unwrap(await endpoints.components.list({ search: q, q, limit: 100, page: 1 }));
      setItems(Array.isArray(data) ? data : data?.items || data?.rows || []);
    } catch (error) {
      toast(apiError(error), "error");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const selectedItems = useMemo(() => items.filter((item) => selected[item.id]), [items, selected]);

  function toggle(id) {
    setSelected((current) => ({ ...current, [id]: !current[id] }));
  }

  function selectAll() {
    const next = {};
    items.forEach((item) => { next[item.id] = true; });
    setSelected(next);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Label Studio"
        title="Etiket Yazdırma Merkezi"
        description="Termal, barkod ve A4 etiket yazıcıları için yalnızca etiket alanını basan, profil tabanlı yazdırma ekranı. Zebra ZPL çıktısı da üretir."
        actions={<button type="button" className="btn-ghost" onClick={selectAll}><Tags className="h-4 w-4" />Listedekileri Seç</button>}
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="page-card p-5">
          <div className="mb-4 flex items-center gap-2 text-lg font-black"><PackageSearch className="h-5 w-5 text-brand-500" />Komponent Seçimi</div>
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input className="input pl-11" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="SKU, MPN, değer veya paket ara" />
            </div>
            <button type="button" className="btn-primary" onClick={load}>Ara</button>
          </div>
          <div className="mb-3 text-sm font-semibold text-slate-500">{loading ? "Yükleniyor..." : `${formatNumber(items.length)} kayıt • ${formatNumber(selectedItems.length)} seçili`}</div>
          <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-brand-500">
                <input type="checkbox" className="mt-1" checked={!!selected[item.id]} onChange={() => toggle(item.id)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-xs font-black text-brand-600 dark:text-brand-300">{item.internalSku}</div>
                  <div className="truncate text-sm font-black text-slate-900 dark:text-white">{item.manufacturerPartNumber}</div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">{[item.value, item.packageCase, item.storageLocation?.name || item.storageLocation?.nameTr].filter(Boolean).join(" • ") || "-"}</div>
                </div>
              </label>
            ))}
            {!items.length && !loading ? <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700">Komponent bulunamadı.</div> : null}
          </div>
        </section>

        <LabelPrintPanel components={selectedItems} />
      </div>
    </AppShell>
  );
}
