"use client";

import { useEffect, useState } from "react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";

import { endpoints, unwrap } from "../../lib/api";
import { formatDate } from "../../lib/formatters";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints.stock
      .movements()
      .then((response) => {
        setRows(unwrap(response) || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cols = [
    {
      key: "action",
      header: "Aksiyon",
      render: (row) => row.movementType || "STOCK"
    },
    {
      key: "entity",
      header: "Varlık",
      render: (row) => row.component?.manufacturerPartNumber || "Komponent"
    },
    {
      key: "user",
      header: "Kullanıcı",
      render: (row) => row.user?.name || "-"
    },
    {
      key: "qty",
      header: "Adet",
      render: (row) => row.quantity || "-"
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
        eyebrow="Reel Manager - Audit"
        title="Aktivite Logları"
        description="Sistem içindeki kritik stok işlemleri ve kullanıcı aksiyonları."
      />

      <DataTable
        columns={cols}
        rows={rows}
        loading={loading}
      />
    </AppShell>
  );
}