"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit3,
  Plus,
  UserCog,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";

import { apiError, endpoints, unwrap } from "../../lib/api";
import { useUI } from "../../components/providers/Providers";

export default function UsersPage() {
  const { toast } = useUI();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const d = unwrap(await endpoints.settings.users());

      setRows(d?.items || d?.users || d || []);
    } catch (e) {
      toast(apiError(e), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Users"
        title="Kullanıcılar"
        description="Kullanıcı rolleri, durumları ve erişim yönetimi."
        actions={
          <Link className="btn-primary" href="/users/new">
            <Plus className="h-4 w-4" />
            Yeni Kullanıcı
          </Link>
        }
      />

      <section className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-4">Kullanıcı</th>
                <th className="px-4 py-4">Rol</th>
                <th className="px-4 py-4">Durum</th>
                <th className="px-4 py-4 text-right">İşlemler</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-10 text-center text-slate-500"
                  >
                    Yükleniyor...
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr
                    key={u.id}
                    className="bg-white dark:bg-slate-950"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold dark:text-white">
                        {u.name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {u.email}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="chip">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="chip">
                        {u.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end">
                        <Link
                          className="btn-ghost"
                          href={`/users/${u.id}/edit`}
                        >
                          <Edit3 className="h-4 w-4" />
                          Düzenle
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}