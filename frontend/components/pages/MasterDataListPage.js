"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import AppShell from "../layout/AppShell";
import PageHeader from "../ui/PageHeader";
import ConfirmModal from "../ui/ConfirmModal";
import { apiError, unwrap } from "../../lib/api";
import { displayName, entitySlug } from "../../lib/slug";
import { useUI } from "../providers/Providers";

export default function MasterDataListPage({
  title,
  description,
  newHref,
  baseHref,
  endpoint,
  type = "category"
}) {
  const { toast } = useUI();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remove, setRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = unwrap(await endpoint.list());
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmRemove() {
    if (!remove) return;
    setDeleting(true);

    try {
      await endpoint.remove(remove.id);
      toast("Kayıt silindi", "success");
      setRemove(null);
      load();
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setDeleting(false);
    }
  }

  const columns = useMemo(() => buildColumns(type), [type]);
  const newLabel = title.includes("Kategori")
    ? "Yeni Kategori"
    : title.includes("Tedarik")
      ? "Yeni Tedarikçi"
      : "Yeni Lokasyon";

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Master Data"
        title={title}
        description={description}
        actions={
          <Link className="btn-primary" href={newHref}>
            <Plus className="h-4 w-4" />
            {newLabel}
          </Link>
        }
      />

      <section className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-4">{column.header}</th>
                ))}
                <th className="px-4 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-10 text-center text-slate-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row) => {
                  const slug = entitySlug(row);
                  return (
                    <tr key={row.id} className="bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/70">
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-4 text-slate-700 dark:text-slate-300">
                          {column.render ? column.render(row, baseHref, slug) : row[column.key] || "-"}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link className="btn-ghost px-3 py-2" href={`${baseHref}/${slug}`}>
                            <ExternalLink className="h-4 w-4" />
                            Detay
                          </Link>
                          <Link className="btn-ghost px-3 py-2" href={`${baseHref}/${slug}/edit`}>
                            <Edit3 className="h-4 w-4" />
                            Düzenle
                          </Link>
                          <button className="btn-danger px-3 py-2" onClick={() => setRemove(row)}>
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="p-14 text-center text-slate-500">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmModal
        open={Boolean(remove)}
        danger
        title="Kayıt silinsin mi?"
        description={`${displayName(remove)} kaydı silinecek. Bu işlem geri alınamaz.`}
        confirmText="Sil"
        loading={deleting}
        onClose={() => setRemove(null)}
        onConfirm={confirmRemove}
      />
    </AppShell>
  );
}

function buildColumns(type) {
  if (type === "supplier") {
    return [
      {
        key: "name",
        header: "Tedarikçi",
        render: (row, base, slug) => (
          <div>
            <Link className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300" href={`${base}/${slug}`}>
              {displayName(row)}
            </Link>
            <div className="text-xs text-slate-400">{row.website || "supplier"}</div>
          </div>
        )
      },
      { key: "contactEmail", header: "E-posta" },
      { key: "phone", header: "Telefon" },
      { key: "website", header: "Website" }
    ];
  }

  if (type === "location") {
    return [
      {
        key: "name",
        header: "Lokasyon",
        render: (row, base, slug) => (
          <div>
            <Link className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300" href={`${base}/${slug}`}>
              {displayName(row)}
            </Link>
            <div className="font-mono text-xs text-slate-400">{row.code}</div>
          </div>
        )
      },
      { key: "code", header: "Kod / Slug" },
      { key: "description", header: "Açıklama" }
    ];
  }

  return [
    {
      key: "name",
      header: "Kategori",
      render: (row, base, slug) => (
        <div>
          <Link className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300" href={`${base}/${slug}`}>
            {displayName(row)}
          </Link>
          <div className="font-mono text-xs text-slate-400">{row.slug}</div>
        </div>
      )
    },
    { key: "slug", header: "Slug" },
    { key: "description", header: "Açıklama" }
  ];
}
