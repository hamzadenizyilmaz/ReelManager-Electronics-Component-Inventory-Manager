"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import ConfirmModal from "../../components/ui/ConfirmModal";

import { apiError, endpoints, unwrap } from "../../lib/api";
import { formatDate } from "../../lib/formatters";
import { statusText } from "../../lib/i18n-lite";
import { useUI } from "../../components/providers/Providers";

export default function ProjectsPage() {
  const { toast, lang = "tr" } = useUI();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remove, setRemove] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const payload = unwrap(await endpoints.projects.list());

      setProjects(payload?.items || payload?.projects || payload || []);
    } catch (e) {
      toast(apiError(e), "error");
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
      await endpoints.projects.remove(remove.id);

      toast("Proje silindi", "success");
      setRemove(null);
      load();
    } catch (e) {
      toast(apiError(e), "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - BOM Center"
        title="Projeler / BOM"
        description="Üretim ve prototip projelerini oluşturun, düzenleyin ve takip edin."
        actions={
          <Link className="btn-primary" href="/projects/new">
            <Plus className="h-4 w-4" />
            Yeni Proje
          </Link>
        }
      />

      <section className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-4">Proje</th>
                <th className="px-4 py-4">Kod / Slug</th>
                <th className="px-4 py-4">Durum</th>
                <th className="px-4 py-4">BOM</th>
                <th className="px-4 py-4">Tarih</th>
                <th className="px-4 py-4 text-right">İşlemler</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-slate-500"
                  >
                    Yükleniyor...
                  </td>
                </tr>
              ) : projects.length ? (
                projects.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-4 font-semibold">
                      <Link
                        className="text-cyan-700 hover:underline dark:text-cyan-300"
                        href={`/projects/${row.id}`}
                      >
                        {row.name}
                      </Link>
                    </td>

                    <td className="px-4 py-4 font-mono text-xs text-slate-500">
                      {row.code || `project-${row.id}`}
                    </td>

                    <td className="px-4 py-4">
                      <span className="chip">
                        {statusText(row.status, lang)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {row._count?.bomItems || row.bomItems?.length || 0}
                    </td>

                    <td className="px-4 py-4 text-slate-500">
                      {formatDate(row.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          className="btn-ghost px-3 py-2"
                          href={`/projects/${row.id}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Detay
                        </Link>

                        <Link
                          className="btn-ghost px-3 py-2"
                          href={`/projects/${row.id}/edit`}
                        >
                          <Edit3 className="h-4 w-4" />
                          Düzenle
                        </Link>

                        <button
                          className="btn-danger px-3 py-2"
                          onClick={() => setRemove(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-14 text-center text-slate-500"
                  >
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
        title="Proje silinsin mi?"
        description={`${
          remove?.name || "Proje"
        } silinecek. Bu işlem geri alınamaz.`}
        confirmText="Sil"
        loading={deleting}
        onClose={() => setRemove(null)}
        onConfirm={confirmRemove}
      />
    </AppShell>
  );
}