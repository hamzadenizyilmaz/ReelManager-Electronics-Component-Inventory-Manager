"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import { apiError, unwrap } from "../../lib/api";
import { useUI } from "../providers/Providers";
import PageHeader from "../ui/PageHeader";
import ConfirmButton from "../ui/ConfirmButton";
import DataTable from "../tables/DataTable";
import SelectField from "../ui/SelectField";

function normalizePayload(fields, form) {
  const payload = {};
  fields.forEach((field) => {
    payload[field.name] = form[field.name] ?? "";
    if (field.alias) payload[field.alias] = form[field.name] ?? "";
  });
  return payload;
}

export default function ResourceManager({ title, description, resource, fields, endpoint }) {
  const { toast } = useUI();
  const empty = useMemo(() => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue || ""])), [fields]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = unwrap(await endpoint.list());
      setRows(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      toast(apiError(e), "error");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    const payload = normalizePayload(fields, form);
    try {
      if (editing) await endpoint.update(editing.id, payload);
      else await endpoint.create(payload);
      toast(editing ? "Kayıt güncellendi" : "Kayıt oluşturuldu", "success");
      setEditing(null);
      setForm(empty);
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  async function remove(row) {
    try {
      await endpoint.remove(row.id);
      toast("Kayıt silindi", "success");
      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const readField = (row, name) => row[name] ?? row[name.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] ?? "-";
  const displayName = (row) => row.nameTr || row.nameEn || row.name || row.code || `#${row.id}`;

  const columns = [
    { key: "display", header: resource, render: (r) => <div><div className="font-semibold text-slate-950 dark:text-slate-50">{displayName(r)}</div><div className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">{r.slug || r.code || r.website || "master-data"}</div></div> },
    ...fields.slice(1, 4).map((f) => ({ key: f.name, header: f.label, render: (r) => readField(r, f.name) })),
    {
      key: "actions",
      header: "İşlemler",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn-ghost px-3 py-2"
            onClick={() => {
              setEditing(r);
              setForm(Object.fromEntries(fields.map((f) => [f.name, readField(r, f.name) === "-" ? "" : readField(r, f.name)])));
            }}
          >
            <Edit3 className="h-4 w-4" />Düzenle
          </button>
          <ConfirmButton label="Sil" onConfirm={() => remove(r)} />
        </div>
      )
    }
  ];

  return (
    <>
      <PageHeader
        eyebrow="Master Data"
        title={title}
        description={description}
        actions={<button className="btn-primary" onClick={() => { setEditing(null); setForm(empty); }}><Plus className="h-4 w-4" />Yeni {resource}</button>}
      />
      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <form onSubmit={submit} className="page-card overflow-hidden">
          <div className="border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
            <h2 className="section-title">{editing ? "Kayıt Düzenle" : `Yeni ${resource}`}</h2>
            <p className="section-description">TR/EN alanları, teknik kodlar ve operasyonel meta bilgiler tek noktadan yönetilir.</p>
          </div>
          <div className="space-y-4 p-5">
            {fields.map((field) => (
              <div key={field.name}>
                {field.type === "textarea" ? (
                  <label className="block">
                    <span className="field-label">{field.label}</span>
                    <textarea className="input min-h-28" value={form[field.name] || ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} />
                  </label>
                ) : field.type === "select" ? (
                  <SelectField label={field.label} value={form[field.name] || ""} onChange={(value) => setForm({ ...form, [field.name]: value })} placeholder={field.placeholder || "Seçiniz"} options={field.options || []} />
                ) : (
                  <label className="block">
                    <span className="field-label">{field.label}</span>
                    <input className="input" value={form[field.name] || ""} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} placeholder={field.placeholder || field.label} />
                  </label>
                )}
              </div>
            ))}
            <button type="submit" className="btn-primary w-full"><Save className="h-4 w-4" />{editing ? "Güncelle" : "Kaydet"}</button>
          </div>
        </form>
        <DataTable columns={columns} rows={rows} loading={loading} emptyTitle={`${title} bulunamadı`} />
      </div>
    </>
  );
}
