"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

import { endpoints, unwrap, apiError } from "../../lib/api";
import { stockStatus } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

export default function Page() {
  const { toast } = useUI();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([endpoints.stock.low(), endpoints.stock.out()])
      .then(([a, b]) =>
        setRows([
          ...(unwrap(a) || []),
          ...(unwrap(b) || []),
        ])
      )
      .catch((e) => toast(apiError(e), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const cols = [
    {
      key: "pn",
      header: "Part Number",
      render: (r) => (
        <Link
          className="font-bold text-brand-500"
          href={`/components/${r.id}`}
        >
          {r.manufacturerPartNumber}
        </Link>
      ),
    },
    {
      key: "value",
      header: "Değer",
    },
    {
      key: "pkg",
      header: "Paket",
      render: (r) => r.packageCase,
    },
    {
      key: "available",
      header: "Mevcut",
      render: (r) => r.quantityAvailable,
    },
    {
      key: "min",
      header: "Minimum",
      render: (r) => r.minimumStock,
    },
    {
      key: "status",
      header: "Durum",
      render: (r) => <StatusBadge status={stockStatus(r)} />,
    },
    {
      key: "supplier",
      header: "Tedarikçi",
      render: (r) => r.supplier?.name || "-",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Alerts"
        title="Düşük Stok ve Kritikler"
        description="Minimum seviyenin altındaki ve stokta olmayan komponentleri hızlıca gör."
      />

      <DataTable columns={cols} rows={rows} loading={loading} />
    </AppShell>
  );
}