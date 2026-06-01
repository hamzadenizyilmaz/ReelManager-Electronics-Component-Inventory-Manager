"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "../../../../components/layout/AppShell";
import ProjectForm from "../../../../components/forms/ProjectForm";

import { apiError, endpoints, unwrap } from "../../../../lib/api";
import { useUI } from "../../../../components/providers/Providers";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useUI();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setItem(unwrap(await endpoints.projects.get(id)));
      } catch (e) {
        toast(apiError(e), "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="page-card p-10 text-center text-slate-500">
          Yükleniyor...
        </div>
      </AppShell>
    );
  }

  if (!item) {
    return (
      <AppShell>
        <div className="page-card p-10 text-center text-slate-500">
          Proje bulunamadı.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ProjectForm
        mode="edit"
        initial={item}
        onSaved={() => router.push(`/projects/${id}`)}
      />
    </AppShell>
  );
}