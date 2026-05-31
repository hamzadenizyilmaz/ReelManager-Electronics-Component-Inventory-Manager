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
    Promise.all([
      endpoints.stock.low(),
      endpoints.stock.out()
    ])
      .then(([lowStockResponse, outStockResponse]) => {
        const lowStockRows = unwrap(lowStockResponse) || [];
        const outStockRows = unwrap(outStockResponse) || [];

        setRows([...lowStockRows, ...outStockRows]);
      })
      .catch((error) => {
        toast(apiError(error), "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toast]);

  const cols = [
    {
      key: "pn",
      header: "Part Number",
      render: (row) => (
        <Link
          className="font-bold text-brand-500"
          href={`/components/${row.id}`}
        >
          {row.manufacturerPartNumber}
        </Link>
      )
    },
    {
      key: "value",
      header: "Değer"
    },
    {
      key: "pkg",
      header: "Paket",
      render: (row) => row.packageCase
    },
    {
      key: "available",
      header: "Mevcut",
      render: (row) => row.quantityAvailable
    },
    {
      key: "min",
      header: "Minimum",
      render: (row) => row.minimumStock
    },
    {
      key: "status",
      header: "Durum",
      render: (row) => <StatusBadge status={stockStatus(row)} />
    },
    {
      key: "supplier",
      header: "Tedarikçi",
      render: (row) => row.supplier?.name || "-"
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Alerts"
        title="Düşük Stok ve Kritikler"
        description="Minimum seviyenin altındaki ve stokta olmayan komponentleri hızlıca gör."
      />

      <DataTable
        columns={cols}
        rows={rows}
        loading={loading}
      />
    </AppShell>
  );
}