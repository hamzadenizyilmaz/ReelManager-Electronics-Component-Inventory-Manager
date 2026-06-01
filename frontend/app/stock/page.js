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
      .then((r) => setRows(unwrap(r) || []))
      .catch((e) => toast(apiError(e), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const cols = [
    {
      key: "type",
      header: "Tip",
      render: (r) => <span className="chip">{r.movementType}</span>,
    },
    {
      key: "pn",
      header: "Part",
      render: (r) => r.component?.manufacturerPartNumber || "-",
    },
    {
      key: "qty",
      header: "Adet",
      render: (r) => r.quantity,
    },
    {
      key: "reason",
      header: "Sebep",
      render: (r) => r.reason || "-",
    },
    {
      key: "date",
      header: "Tarih",
      render: (r) => formatDate(r.createdAt),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Stock Ledger"
        title="Stok Hareketleri"
        description="Giriş, çıkış, rezerve, release ve kayıp hareketlerini audit mantığıyla izle."
      />

      <DataTable columns={cols} rows={rows} loading={loading} />
    </AppShell>
  );
}