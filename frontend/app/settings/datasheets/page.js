"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";

import { endpoints } from "../../../lib/api";
import { useUI } from "../../../components/providers/Providers";

const defaultOrder = [
  "local-database",
  "nexar-octopart",
  "digikey",
  "mouser",
  "local-parser",
  "manual-url",
];

const providerLabels = {
  "local-database": "Local Database",
  "nexar-octopart": "Nexar / Octopart API",
  digikey: "DigiKey API",
  mouser: "Mouser API",
  "local-parser": "Local Regex Parser",
  "manual-url": "Manual Datasheet URL",
};

export default function DatasheetSettingsPage() {
  const { toast } = useUI();

  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [order, setOrder] = useState(defaultOrder);

  const [form, setForm] = useState({
    nexarClientId: "",
    nexarClientSecret: "",
    digikeyClientId: "",
    digikeyClientSecret: "",
    digikeyRedirectUri: "",
    mouserApiKey: "",
    providerTimeoutMs: "8000",
    cacheTtlDays: "30",
  });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("reelmanager_datasheet_settings") || "{}"
    );

    setForm((prev) => ({
      ...prev,
      ...saved,
    }));

    setOrder(saved.providerOrder || defaultOrder);
  }, []);

  function setField(name, value) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function move(index, direction) {
    const next = [...order];
    const target = index + direction;

    if (target < 0 || target >= next.length) return;

    [next[index], next[target]] = [next[target], next[index]];

    setOrder(next);
  }

  async function save() {
    setSaving(true);

    const payload = {
      ...form,
      providerOrder: order,
    };

    localStorage.setItem(
      "reelmanager_datasheet_settings",
      JSON.stringify(payload)
    );

    try {
      await endpoints.settings.updateSystem({
        datasheets: payload,
      });
    } catch {}

    toast("Datasheet API ayarları kaydedildi", "success");
    setSaving(false);
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Datasheet Enrichment"
        title="Datasheet API Ayarları"
        description="Nexar / Octopart, DigiKey ve Mouser erişim bilgilerini yönetin. Provider öncelik sırası sürüklemeden butonlarla düzenlenir; API anahtarı olmayan provider otomatik atlanır."
        actions={
          <Link className="btn-ghost" href="/settings">
            <ArrowLeft className="h-4 w-4" />
            Ayarlar
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="page-card p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">API Erişim Bilgileri</h2>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}

              {showSecrets ? "Gizle" : "Göster"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Nexar Client ID"
              value={form.nexarClientId}
              onChange={(v) => setField("nexarClientId", v)}
            />

            <Field
              secret={!showSecrets}
              label="Nexar Client Secret"
              value={form.nexarClientSecret}
              onChange={(v) => setField("nexarClientSecret", v)}
            />

            <Field
              label="DigiKey Client ID"
              value={form.digikeyClientId}
              onChange={(v) => setField("digikeyClientId", v)}
            />

            <Field
              secret={!showSecrets}
              label="DigiKey Client Secret"
              value={form.digikeyClientSecret}
              onChange={(v) => setField("digikeyClientSecret", v)}
            />

            <Field
              label="DigiKey Redirect URI"
              value={form.digikeyRedirectUri}
              onChange={(v) => setField("digikeyRedirectUri", v)}
            />

            <Field
              secret={!showSecrets}
              label="Mouser API Key"
              value={form.mouserApiKey}
              onChange={(v) => setField("mouserApiKey", v)}
            />

            <Field
              label="Provider timeout (ms)"
              value={form.providerTimeoutMs}
              onChange={(v) => setField("providerTimeoutMs", v)}
            />

            <Field
              label="Cache TTL (gün)"
              value={form.cacheTtlDays}
              onChange={(v) => setField("cacheTtlDays", v)}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/40 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
            Production ortamında API secret değerleri frontend localStorage
            yerine backend .env veya gizli vault üzerinde tutulmalıdır. Bu ekran
            yönetim paneli tercihi ve provider sırası için hazırlanmıştır.
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary" onClick={save} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </section>

        <aside className="page-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Provider Öncelik Sırası</h2>

          <p className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            Sistem aramaları bu sırayla dener. Sonuç bulunamazsa bir sonraki
            sağlayıcıya geçer.
          </p>

          <div className="mt-5 space-y-3">
            {order.map((provider, index) => (
              <div
                key={provider}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <div className="text-sm font-semibold">
                    {index + 1}. {providerLabels[provider]}
                  </div>

                  <div className="text-xs text-slate-500">{provider}</div>
                </div>

                <div className="flex gap-1">
                  <button
                    className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>

                  <button
                    className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, secret = false }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>

      <input
        className="input"
        type={secret ? "password" : "text"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}