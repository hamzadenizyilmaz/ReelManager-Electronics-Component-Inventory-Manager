"use client";

import { useEffect, useState } from "react";
import { BarChart3, Download } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import DistributionChart from "../../components/charts/DistributionChart";

import { endpoints, unwrap } from "../../lib/api";
import { downloadWithToken } from "../../lib/formatters";

export default function Page() {
  const [summary, setSummary] = useState({});
  const [cats, setCats] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      endpoints.dashboard.summary(),
      endpoints.dashboard.categories()
    ]).then(([summaryResult, categoriesResult]) => {
      if (summaryResult.status === "fulfilled") {
        setSummary(unwrap(summaryResult.value) || {});
      }

      if (categoriesResult.status === "fulfilled") {
        setCats(unwrap(categoriesResult.value) || []);
      }
    });
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Analytics"
        title="Raporlar"
        description="Stok dağılımı, kritik listeler ve dışa aktarma merkezi."
        actions={
          <>
            <button
              className="btn-ghost"
              onClick={() => downloadWithToken(endpoints.importExport.csvUrl())}
            >
              <Download className="h-4 w-4" />
              CSV
            </button>

            <button
              className="btn-primary"
              onClick={() => downloadWithToken(endpoints.importExport.xlsxUrl())}
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Komponent"
          value={summary.totalComponents || summary.total_components || 0}
          icon={BarChart3}
        />

        <StatCard
          title="Stok"
          value={summary.totalStock || summary.total_stock_quantity || 0}
          icon={BarChart3}
          tone="green"
        />

        <StatCard
          title="Düşük"
          value={summary.lowStockCount || summary.low_stock_count || 0}
          icon={BarChart3}
          tone="yellow"
        />

        <StatCard
          title="Yok"
          value={summary.outOfStockCount || summary.out_of_stock_count || 0}
          icon={BarChart3}
          tone="red"
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-black">
          Kategori Raporu
        </h2>

        <DistributionChart data={cats} />
      </div>
    </AppShell>
  );
}