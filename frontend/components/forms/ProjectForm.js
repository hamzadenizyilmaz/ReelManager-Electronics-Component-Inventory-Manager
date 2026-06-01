"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { apiError, endpoints } from "../../lib/api";
import { slugify } from "../../lib/slug";
import { useUI } from "../providers/Providers";

export default function ProjectForm({ mode = "create", initial = {}, onSaved }) {
  const { toast, lang = "tr" } = useUI();
  const [saving, setSaving] = useState(false);
  const [codeTouched, setCodeTouched] = useState(Boolean(initial?.code));
  const [form, setForm] = useState({
    name: initial.name || "",
    code: initial.code || slugify(initial.name || "").toUpperCase(),
    status: initial.status || "draft",
    description: initial.description || ""
  });

  useEffect(() => {
    setForm({
      name: initial.name || "",
      code: initial.code || slugify(initial.name || "").toUpperCase(),
      status: initial.status || "draft",
      description: initial.description || ""
    });
    setCodeTouched(Boolean(initial?.code));
  }, [initial?.id]);

  function setField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !codeTouched) next.code = slugify(value).toUpperCase();
      return next;
    });
  }

  function setCode(value) {
    setCodeTouched(true);
    setForm((prev) => ({ ...prev, code: slugify(value).toUpperCase() }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, code: form.code || slugify(form.name).toUpperCase() };
      if (mode === "edit") await endpoints.projects.update(initial.id, payload);
      else await endpoints.projects.create(payload);
      toast(mode === "edit" ? "Proje güncellendi" : "Proje oluşturuldu", "success");
      onSaved(payload);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link className="btn-ghost mb-4" href="/projects"><ArrowLeft className="h-4 w-4" />Projeler</Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{mode === "edit" ? "Proje Düzenle" : "Yeni Proje"}</h1>
        <p className="mt-1 text-sm text-slate-500">Proje adı yazıldıkça kod/slug alanı otomatik oluşur. Kod alanını elle düzenlerseniz sistem değerinizi korur.</p>
      </div>
      <form onSubmit={submit} className="page-card p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Proje adı" value={form.name} onChange={(v) => setField("name", v)} required />
          <Field label="Kod / Slug" value={form.code} onChange={setCode} required />
          <label className="block">
            <span className="field-label">Durum</span>
            <select className="input" value={form.status} onChange={(e) => setField("status", e.target.value)}>
              <option value="draft">{lang === "en" ? "Draft" : "Taslak"}</option>
              <option value="active">{lang === "en" ? "Active" : "Aktif"}</option>
              <option value="completed">{lang === "en" ? "Completed" : "Tamamlandı"}</option>
              <option value="cancelled">{lang === "en" ? "Cancelled" : "İptal Edildi"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 block"><span className="field-label">Açıklama</span><textarea className="input min-h-28" value={form.description} onChange={(e) => setField("description", e.target.value)} /></label>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <Link className="btn-ghost" href="/projects">Vazgeç</Link>
          <button className="btn-primary" disabled={saving}><Save className="h-4 w-4" />{saving ? "Kaydediliyor..." : "Kaydet"}</button>
        </div>
      </form>
    </div>
  );
}
function Field({ label, value, onChange, required }) { return <label className="block"><span className="field-label">{label}</span><input className="input" value={value} required={required} onChange={(e) => onChange(e.target.value)} /></label>; }
