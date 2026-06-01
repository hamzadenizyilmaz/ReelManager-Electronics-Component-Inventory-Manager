"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import AppShell from "../layout/AppShell";
import PageHeader from "../ui/PageHeader";
import { useUI } from "../providers/Providers";

export default function SettingsSection({ title, description, fields = [] }) {
  const { toast } = useUI();
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm(Object.fromEntries(fields.map((field) => [field.name, localStorage.getItem(field.storageKey || field.name) || field.defaultValue || ""])));
  }, [fields]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    fields.forEach((field) => localStorage.setItem(field.storageKey || field.name, form[field.name] || ""));
    toast("Ayarlar kaydedildi", "success");
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Sistem Ayarları"
        title={title}
        description={description}
        actions={<Link className="btn-ghost" href="/settings"><ArrowLeft className="h-4 w-4" />Ayarlar</Link>}
      />
      <section className="page-card p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="field-label">{field.label}</span>
              {field.type === "select" ? (
                <select className="input" value={form[field.name] || ""} onChange={(event) => setField(field.name, event.target.value)}>
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea className="input min-h-28" value={form[field.name] || ""} onChange={(event) => setField(field.name, event.target.value)} placeholder={field.placeholder || field.label} />
              ) : (
                <input className="input" value={form[field.name] || ""} onChange={(event) => setField(field.name, event.target.value)} placeholder={field.placeholder || field.label} />
              )}
              {field.help ? <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{field.help}</p> : null}
            </label>
          ))}
        </div>
        <div className="mt-7 flex justify-end">
          <button className="btn-primary" onClick={save}><Save className="h-4 w-4" />Kaydet</button>
        </div>
      </section>
    </AppShell>
  );
}
