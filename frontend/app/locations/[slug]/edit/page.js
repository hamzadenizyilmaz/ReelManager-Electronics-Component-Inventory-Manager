"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "../../../../components/layout/AppShell";
import MasterDataForm from "../../../../components/forms/MasterDataForm";

import { apiError, endpoints, unwrap } from "../../../../lib/api";
import { findBySlug } from "../../../../lib/slug";
import { useUI } from "../../../../components/providers/Providers";

export default function EditPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useUI();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = unwrap(await endpoints.locations.list());

        setItem(
          findBySlug(
            Array.isArray(data) ? data : data?.items || [],
            slug
          )
        );
      } catch (e) {
        toast(apiError(e), "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

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
          Kayıt bulunamadı.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <MasterDataForm
        mode="edit"
        title="Lokasyon Detayı Düzenle"
        backHref="/locations"
        initial={item}
        endpoint={endpoints.locations}
        type="location"
        onSaved={() => router.push("/locations")}
      />
    </AppShell>
  );
}