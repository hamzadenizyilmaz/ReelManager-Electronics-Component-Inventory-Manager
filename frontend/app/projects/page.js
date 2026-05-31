"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";

import { endpoints, unwrap, apiError } from "../../lib/api";
import { formatDate } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

export default function Page() {
  const { toast } = useUI();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "draft"
  });

  async function load() {
    setLoading(true);

    try {
      const data = unwrap(await endpoints.projects.list());
      setRows(data || []);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event) {
    event.preventDefault();

    try {
      await endpoints.projects.create(form);

      toast("Proje oluşturuldu", "success");

      setForm({
        name: "",
        code: "",
        description: "",
        status: "draft"
      });

      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const cols = [
    {
      key: "name",
      header: "Proje",
      render: (row) => (
        <Link
          className="font-bold text-brand-500"
          href={`/projects/${row.id}`}
        >
          {row.name}
        </Link>
      )
    },
    {
      key: "code",
      header: "Kod"
    },
    {
      key: "status",
      header: "Durum",
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: "bom",
      header: "BOM",
      render: (row) => row.bomItems?.length || 0
    },
    {
      key: "date",
      header: "Tarih",
      render: (row) => formatDate(row.updatedAt)
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - BOM Center"
        title="Projeler / BOM"
        description="Üretim ve prototip projeleri için BOM oluştur, stok uygunluğunu kontrol et."
        actions={
          <button
            className="btn-primary"
            onClick={() =>
              document
                .getElementById("project-form")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Plus className="h-4 w-4" />
            Yeni Proje
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          id="project-form"
          onSubmit={submit}
          className="page-card space-y-4 p-5"
        >
          <h2 className="text-lg font-black">Yeni Proje</h2>

          <input
            className="input"
            placeholder="Proje adı"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value
              })
            }
          />

          <input
            className="input"
            placeholder="Kod"
            value={form.code}
            onChange={(event) =>
              setForm({
                ...form,
                code: event.target.value
              })
            }
          />

          <select
            className="select"
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value
              })
            }
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <textarea
            className="input min-h-28"
            placeholder="Açıklama"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value
              })
            }
          />

          <button className="btn-primary w-full">
            Kaydet
          </button>
        </form>

        <DataTable
          columns={cols}
          rows={rows}
          loading={loading}
        />
      </div>
    </AppShell>
  );
}