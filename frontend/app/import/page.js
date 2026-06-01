"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";

import { endpoints, unwrap, apiError } from "../../lib/api";
import { useUI } from "../../components/providers/Providers";

export default function Page() {
  const { toast } = useUI();

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function upload(e) {
    e.preventDefault();

    if (!file) {
      return toast("Dosya seç", "warning");
    }

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);

    try {
      const data = unwrap(await endpoints.importExport.importComponents(fd));

      setRows(data.rows || data.items || data || []);
      toast("Import önizleme hazır", "success");
    } catch (err) {
      toast(apiError(err), "error");
    }

    setLoading(false);
  }

  const cols = [
    {
      key: "row",
      header: "Satır",
      render: (r, i) => r.row || i + 1,
    },
    {
      key: "pn",
      header: "Part",
      render: (r) =>
        r.manufacturer_part_number || r.manufacturerPartNumber || "-",
    },
    {
      key: "category",
      header: "Kategori",
      render: (r) => r.category || "-",
    },
    {
      key: "qty",
      header: "Adet",
      render: (r) => r.quantity || r.quantity_total || "-",
    },
    {
      key: "status",
      header: "Durum",
      render: (r) =>
        r.error ? (
          <span className="chip text-rose-500">Hatalı</span>
        ) : (
          <span className="chip text-emerald-500">OK</span>
        ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Bulk Operations"
        title="CSV / Excel Import"
        description="Toplu komponent listesini yükle, duplicate ve hatalı satırları önizle."
      />

      <form
        onSubmit={upload}
        className="page-card mb-6 flex flex-col gap-4 p-5 md:flex-row md:items-center"
      >
        <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
          <UploadCloud className="mb-3 h-8 w-8 text-brand-500" />

          <span className="font-bold">
            {file?.name || "CSV/XLSX dosyası seç"}
          </span>

          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
        </label>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Yükleniyor..." : "Önizle"}
        </button>
      </form>

      <DataTable columns={cols} rows={rows} />
    </AppShell>
  );
}