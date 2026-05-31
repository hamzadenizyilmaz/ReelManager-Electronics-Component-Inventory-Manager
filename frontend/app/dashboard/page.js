"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Boxes, ClipboardList, PackageX } from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/tables/DataTable";
import DistributionChart from "../../components/charts/DistributionChart";
import { apiError, endpoints, unwrap } from "../../lib/api";
import { formatDate, formatNumber } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

export default function DashboardPage() {
  const { t, toast } = useUI();
  const [summary, setSummary] = useState({});
  const [cats, setCats] = useState([]);
  const [pkgs, setPkgs] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, c, p, m] = await Promise.allSettled([endpoints.dashboard.summary(), endpoints.dashboard.categories(), endpoints.dashboard.packages(), endpoints.dashboard.movements()]);
        if (s.status === "fulfilled") setSummary(unwrap(s.value) || {});
        if (c.status === "fulfilled") setCats(unwrap(c.value) || []);
        if (p.status === "fulfilled") setPkgs(unwrap(p.value) || []);
        if (m.status === "fulfilled") setMovements(unwrap(m.value) || []);
      } catch (e) { toast(apiError(e), "error"); }
      setLoading(false);
    }
    load();
  }, [toast]);

  const columns = [
    { key: "type", header: "Tip", render: (r) => <span className="chip">{r.movementType || r.movement_type}</span> },
    { key: "component", header: "Komponent", render: (r) => r.component?.manufacturerPartNumber || r.component?.manufacturer_part_number || "-" },
    { key: "quantity", header: "Adet" },
    { key: "date", header: "Tarih", render: (r) => formatDate(r.createdAt || r.created_at) }
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Reel Manager - Enterprise" title={t("dashboard")} description="Stok sağlığı, BOM hareketleri ve kritik komponent durumlarını tek ekranda izle." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title={t("totalComponents")} value={formatNumber(summary.totalComponents || summary.total_components || summary.components || 0)} icon={Boxes} loading={loading} />
        <StatCard title={t("totalStock")} value={formatNumber(summary.totalStock || summary.total_stock_quantity || 0)} icon={ClipboardList} tone="green" />
        <StatCard title={t("lowStockItems")} value={formatNumber(summary.lowStockCount || summary.low_stock_count || 0)} icon={AlertTriangle} tone="yellow" />
        <StatCard title={t("outOfStockItems")} value={formatNumber(summary.outOfStockCount || summary.out_of_stock_count || 0)} icon={PackageX} tone="red" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div><h2 className="mb-3 text-lg font-black">Kategori Dağılımı</h2><DistributionChart data={cats} /></div>
        <div><h2 className="mb-3 text-lg font-black">Paket/Kılıf Dağılımı</h2><DistributionChart data={pkgs} nameKey="packageCase" /></div>
      </div>
      <div className="mt-6"><h2 className="mb-3 text-lg font-black">Son Stok Hareketleri</h2><DataTable columns={columns} rows={movements.slice(0, 8)} loading={loading} /></div>
    </AppShell>
  );
}
