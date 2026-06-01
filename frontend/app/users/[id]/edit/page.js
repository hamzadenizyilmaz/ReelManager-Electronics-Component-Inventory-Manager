"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "../../../../components/layout/AppShell";
import UserForm from "../../../../components/forms/UserForm";

import { apiError, endpoints, unwrap } from "../../../../lib/api";
import { useUI } from "../../../../components/providers/Providers";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useUI();

  const [item, setItem] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const d = unwrap(await endpoints.settings.users());
        const rows = d?.items || d?.users || d || [];

        setItem(rows.find((u) => String(u.id) === String(id)));
      } catch (e) {
        toast(apiError(e), "error");
      }
    }

    load();
  }, [id]);

  if (!item) {
    return (
      <AppShell>
        <div className="page-card p-10 text-center text-slate-500">
          Yükleniyor...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <UserForm
        mode="edit"
        initial={item}
        onSaved={() => router.push("/users")}
      />
    </AppShell>
  );
}