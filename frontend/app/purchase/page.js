"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";

import { endpoints, unwrap } from "../../lib/api";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      endpoints.stock.low(),
      endpoints.stock.out()
    ])
      .then(([lowStockResponse, outStockResponse]) => {
        const allRows = [
          ...(unwrap(lowStockResponse) || []),
          ...(unwrap(outStockResponse) || [])
        ];

        const mappedRows = allRows.map((item) => ({
          ...item,
          missing:
            Math.max(
              (item.minimumStock || 0) - (item.quantityAvailable || 0),
              0
            ) +
            (item.quantityAvailable === 0
              ? item.reorderQuantity || 0
              : 0)
        }));

        setRows(mappedRows);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cols = [
    {
      key: "pn",
      header: "Part",
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
      key: "missing",
      header: "Önerilen Sipariş",
      render: (row) => row.missing || row.reorderQuantity || 0
    },
    {
      key: "supplier",
      header: "Tedarikçi",
      render: (row) => row.supplier?.name || "-"
    },
    {
      key: "url",
      header: "Link",
      render: (row) =>
        row.productUrl ? (
          <a
            className="text-brand-500"
            href={row.productUrl}
            target="_blank"
            rel="noreferrer"
          >
            Aç
          </a>
        ) : (
          "-"
        )
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Procurement"
        title="Satın Alma Listesi"
        description="Düşük stok ve stokta olmayan kalemlerden otomatik sipariş önerisi üret."
      />

      <DataTable
        columns={cols}
        rows={rows}
        loading={loading}
      />
    </AppShell>
  );
}