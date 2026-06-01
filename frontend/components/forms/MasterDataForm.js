"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { apiError } from "../../lib/api";
import { slugify } from "../../lib/slug";
import { useUI } from "../providers/Providers";

export default function MasterDataForm({
  mode = "create",
  title,
  backHref,
  initial = {},
  endpoint,
  type = "category",
  onSaved
}) {
  const { toast } = useUI();
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug || initial?.code));
  const [form, setForm] = useState(() => buildInitial(initial, type));

  useEffect(() => {
    setForm(buildInitial(initial, type));
    setSlugTouched(Boolean(initial?.slug || initial?.code));
  }, [initial?.id, type]);

  function setField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "name" && !slugTouched) {
        const generated = slugify(value);
        next.slug = generated;
        next.code = type === "location" ? generated.toUpperCase() : generated;
      }

      return next;
    });
  }

  function handleSlug(value) {
    setSlugTouched(true);
    const generated = slugify(value);
    setForm((prev) => ({
      ...prev,
      slug: generated,
      code: type === "location" ? generated.toUpperCase() : prev.code
    }));
  }

  function handleCode(value) {
    setSlugTouched(true);
    setForm((prev) => ({
      ...prev,
      code: slugify(value).toUpperCase(),
      slug: slugify(value)
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = buildPayload(form, type);

      if (mode === "edit") await endpoint.update(initial.id, payload);
      else await endpoint.create(payload);

      toast(mode === "edit" ? "Kayıt güncellendi" : "Kayıt oluşturuldu", "success");
      if (onSaved) onSaved(payload);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setSaving(false);
    }
  }

  const slugLabel = type === "location" ? "Lokasyon kodu / Slug" : "URL Slug";

  return (
    <div className="space-y-6">
      <div>
        <Link className="btn-ghost mb-4" href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Link>

        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white">
          {title}
        </h1>

        <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          Artık bu kayıtlar tek isim alanı ile yönetilir. İsim yazıldıkça slug/kod alanı anlık üretilir. Slug/kod alanını manuel düzenlerseniz sistem değerinizi korur.
        </p>
      </div>

      <form onSubmit={submit} className="page-card p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Ad / Name"
            value={form.name}
            onChange={(value) => setField("name", value)}
            required
          />

          {type === "location" ? (
            <Field
              label={slugLabel}
              value={form.code}
              onChange={handleCode}
              required
            />
          ) : (
            <Field
              label={slugLabel}
              value={form.slug}
              onChange={handleSlug}
              required={type === "category"}
            />
          )}

          {type === "supplier" ? (
            <>
              <Field label="Website" value={form.website} onChange={(value) => setField("website", value)} />
              <Field label="Yetkili kişi" value={form.contactName} onChange={(value) => setField("contactName", value)} />
              <Field label="E-posta" value={form.contactEmail} onChange={(value) => setField("contactEmail", value)} />
              <Field label="Telefon" value={form.phone} onChange={(value) => setField("phone", value)} />
            </>
          ) : null}
        </div>

        {type === "supplier" ? (
          <div className="mt-4">
            <TextArea label="Notlar" value={form.notes} onChange={(value) => setField("notes", value)} />
          </div>
        ) : (
          <div className="mt-4">
            <TextArea label="Açıklama" value={form.description} onChange={(value) => setField("description", value)} />
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          <Link className="btn-ghost" href={backHref}>Vazgeç</Link>
          <button className="btn-primary" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>
      <input
        className="input"
        value={value || ""}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        className="input min-h-28"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function buildInitial(row, type) {
  const name = row?.name || row?.nameTr || row?.name_tr || row?.nameEn || row?.name_en || "";
  const baseSlug = row?.slug || row?.code || slugify(name);

  return {
    name,
    slug: row?.slug || slugify(baseSlug || name),
    code: row?.code || (type === "location" ? slugify(baseSlug || name).toUpperCase() : ""),
    description: row?.description || row?.descriptionTr || row?.description_tr || row?.descriptionEn || row?.description_en || "",
    website: row?.website || "",
    contactName: row?.contactName || "",
    contactEmail: row?.contactEmail || "",
    phone: row?.phone || "",
    notes: row?.notes || ""
  };
}

function buildPayload(form, type) {
  const name = String(form.name || "").trim();
  const slug = slugify(form.slug || name);
  const code = String(form.code || slugify(name).toUpperCase()).trim();

  if (type === "category") {
    return {
      name,
      nameTr: name,
      nameEn: name,
      slug,
      description: form.description || null,
      descriptionTr: form.description || null,
      descriptionEn: form.description || null
    };
  }

  if (type === "location") {
    return {
      name,
      nameTr: name,
      nameEn: name,
      code: code || slugify(name).toUpperCase(),
      description: form.description || null,
      descriptionTr: form.description || null,
      descriptionEn: form.description || null
    };
  }

  return {
    name,
    nameTr: name,
    nameEn: name,
    slug,
    website: form.website || null,
    contactName: form.contactName || null,
    contactEmail: form.contactEmail || null,
    phone: form.phone || null,
    notes: form.notes || null
  };
}
