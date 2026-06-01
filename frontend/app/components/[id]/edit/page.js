"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppShell from "../../../../components/layout/AppShell";

import { apiError, endpoints, unwrap } from "../../../../lib/api";
import { useUI } from "../../../../components/providers/Providers";

export default function ComponentEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useUI();

  const [item, setItem] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setItem(unwrap(await endpoints.components.get(id)));
      } catch (e) {
        toast(apiError(e), "error");
      }
    }

    load();
  }, [id]);

  function setField(k, v) {
    setItem((p) => ({
      ...p,
      [k]: v,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await endpoints.components.update(id, {
        ...item,
        categoryId: item.categoryId || item.category?.id,
        supplierId: item.supplierId || item.supplier?.id || null,
        storageLocationId:
          item.storageLocationId || item.storageLocation?.id || null,
      });

      toast("Komponent güncellendi", "success");
      router.push(`/components/${id}`);
    } catch (e) {
      toast(apiError(e), "error");
    } finally {
      setSaving(false);
    }
  }

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
      <form onSubmit={submit} className="page-card p-5">
        <h1 className="mb-5 text-2xl font-semibold dark:text-white">
          Komponent Düzenle
        </h1>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "name",
            "manufacturerPartNumber",
            "supplierPartNumber",
            "manufacturer",
            "packageCase",
            "value",
            "tolerance",
            "voltageRating",
            "currentRating",
            "powerRating",
            "temperatureCoefficient",
            "datasheetUrl",
            "productUrl",
            "imageUrl",
          ].map((k) => (
            <label key={k} className="block">
              <span className="field-label">{k}</span>

              <input
                className="input"
                value={item[k] || ""}
                onChange={(e) => setField(k, e.target.value)}
              />
            </label>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="field-label">Açıklama</span>

          <textarea
            className="input min-h-28"
            value={item.description || ""}
            onChange={(e) => setField("description", e.target.value)}
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => router.push(`/components/${id}`)}
          >
            Vazgeç
          </button>

          <button className="btn-primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}