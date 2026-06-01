"use client";

import { useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";

import { apiError, endpoints } from "../../lib/api";
import { useUI } from "../providers/Providers";

export default function UserForm({
  mode = "create",
  initial = {},
  onSaved,
}) {
  const { toast } = useUI();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: initial.name || "",
    email: initial.email || "",
    password: "",
    role: initial.role || "user",
    status: initial.status || "active",
  });

  function setField(k, v) {
    setForm((p) => ({
      ...p,
      [k]: v,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
      };

      if (mode === "edit" && !payload.password) {
        delete payload.password;
      }

      if (mode === "edit") {
        await endpoints.settings.updateUser(initial.id, payload);
      } else {
        await endpoints.settings.createUser(payload);
      }

      toast(
        mode === "edit" ? "Kullanıcı güncellendi" : "Kullanıcı oluşturuldu",
        "success"
      );

      onSaved();
    } catch (e) {
      toast(apiError(e), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="page-card p-5">
      <h1 className="mb-5 text-2xl font-semibold dark:text-white">
        {mode === "edit" ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Ad Soyad"
          value={form.name}
          onChange={(v) => setField("name", v)}
          required
        />

        <Field
          label="E-posta"
          value={form.email}
          onChange={(v) => setField("email", v)}
          required
        />

        <Field
          label={mode === "edit" ? "Yeni Şifre (boş bırakılabilir)" : "Şifre"}
          value={form.password}
          onChange={(v) => setField("password", v)}
          type="password"
          required={mode !== "edit"}
        />

        <label>
          <span className="field-label">Rol</span>

          <select
            className="input"
            value={form.role}
            onChange={(e) => setField("role", e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          <span className="field-label">Durum</span>

          <select
            className="input"
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link className="btn-ghost" href="/users">
          Vazgeç
        </Link>

        <button className="btn-primary" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}) {
  return (
    <label>
      <span className="field-label">{label}</span>

      <input
        className="input"
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}