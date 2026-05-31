"use client";

import { useEffect, useState } from "react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";

import { endpoints, unwrap, apiError } from "../../lib/api";
import { formatDate } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

export default function Page() {
  const { toast } = useUI();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints.stock
      .movements()
      .then((response) => {
        setRows(unwrap(response) || []);
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
      key: "type",
      header: "Tip",
      render: (row) => (
        <span className="chip">
          {row.movementType}
        </span>
      )
    },
    {
      key: "pn",
      header: "Part",
      render: (row) => row.component?.manufacturerPartNumber || "-"
    },
    {
      key: "qty",
      header: "Adet",
      render: (row) => row.quantity
    },
    {
      key: "reason",
      header: "Sebep",
      render: (row) => row.reason || "-"
    },
    {
      key: "date",
      header: "Tarih",
      render: (row) => formatDate(row.createdAt)
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Stock Ledger"
        title="Stok Hareketleri"
        description="Giriş, çıkış, rezerve, release ve kayıp hareketlerini audit mantığıyla izle."
      />

      <DataTable
        columns={cols}
        rows={rows}
        loading={loading}
      />
    </AppShell>
  );
}