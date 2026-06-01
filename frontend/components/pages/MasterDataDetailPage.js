"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import AppShell from "../layout/AppShell";
import PageHeader from "../ui/PageHeader";
import { apiError, unwrap } from "../../lib/api";
import { displayName, findBySlug } from "../../lib/slug";
import { useUI } from "../providers/Providers";

export default function MasterDataDetailPage({ slug, endpoint, baseHref, title }) {
  const { toast } = useUI();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = unwrap(await endpoint.list());
        setItem(findBySlug(Array.isArray(data) ? data : data?.items || [], slug));
      } catch (error) {
        toast(apiError(error), "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Detail"
        title={loading ? "Yükleniyor..." : displayName(item)}
        description={title}
        actions={
          <>
            <Link className="btn-ghost" href={baseHref}>
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </Link>
            {item ? (
              <Link className="btn-primary" href={`${baseHref}/${slug}/edit`}>
                <Edit3 className="h-4 w-4" />
                Düzenle
              </Link>
            ) : null}
          </>
        }
      />

      {item ? (
        <section className="page-card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Ad / Name" value={displayName(item)} />
            <Info label="Slug / Kod" value={item.slug || item.code || "-"} />
            <Info label="Website" value={item.website || "-"} />
            <Info label="E-posta" value={item.contactEmail || "-"} />
            <Info label="Telefon" value={item.phone || "-"} />
            <Info label="Açıklama / Not" value={item.description || item.notes || "-"} />
          </div>
        </section>
      ) : (
        <div className="page-card p-10 text-center text-slate-500">Kayıt bulunamadı.</div>
      )}
    </AppShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="field-label">{label}</div>
      <div className="font-semibold text-slate-900 dark:text-white">{value || "-"}</div>
    </div>
  );
}
