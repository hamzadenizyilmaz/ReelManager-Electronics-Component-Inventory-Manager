"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Braces,
  Database,
  Download,
  FileText,
  Languages,
  LockKeyhole,
  Mail,
  Paintbrush,
  Save,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  UserCog,
  UsersRound
} from "lucide-react";
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";
import SelectField from "../../components/ui/SelectField";
import StatusBadge from "../../components/ui/StatusBadge";
import { apiError, endpoints, unwrap } from "../../lib/api";
import { cn } from "../../lib/formatters";
import { useUI } from "../../components/providers/Providers";

const sqlTypes = [
  ["VARCHAR", "Kısa metin", "Short text"],
  ["TEXT", "Uzun açıklama", "Long description"],
  ["INT", "Tam sayı", "Integer"],
  ["DECIMAL", "Hassas sayı", "Precise number"],
  ["DATETIME", "Tarih / saat", "Date / time"],
  ["ENUM", "Sabit seçenek", "Fixed option"],
  ["JSON", "Yapılandırılmış veri", "Structured data"]
];

const formTypes = [
  ["text", "Metin kutusu", "Text input"],
  ["number", "Sayısal alan", "Number input"],
  ["select", "Seçim listesi", "Select field"],
  ["textarea", "Çok satırlı not", "Multiline note"],
  ["url", "Bağlantı alanı", "URL field"],
  ["file", "Dosya yükleme", "File upload"]
];

const datasheetProviders = [
  "Local database",
  "Nexar / Octopart API",
  "DigiKey API",
  "Mouser API",
  "Local parser fallback",
  "Manual datasheet URL"
];

const defaultSettings = {
  companyName: "CreartSoft",
  appName: "Reel Manager v2.1.0",
  defaultCurrency: "TRY",
  defaultLanguage: "tr",
  defaultTheme: "dark",
  lowStockLimit: 20,
  dateFormat: "DD.MM.YYYY",
  skuPrefix: "CMP",
  skuMode: "random",
  labelProfile: "thermal-50x25",
  auditLogRetentionDays: 180,
  sessionTimeoutMinutes: 480,
  mfaRequired: false,
  registrationMode: "admin-only",
  backupSchedule: "daily",
  backupRetentionDays: 14,
  notificationEmail: "admin@example.com",
  datasheetTimeoutMs: 8000,
  cacheTtlDays: 30
};

const tabs = [
  { id: "general", label: "Genel", icon: SlidersHorizontal },
  { id: "users", label: "Kullanıcılar", icon: UsersRound },
  { id: "security", label: "Güvenlik", icon: ShieldCheck },
  { id: "localization", label: "Dil & Veri", icon: Languages },
  { id: "datasheets", label: "Datasheet", icon: FileText },
  { id: "branding", label: "Tasarım", icon: Paintbrush },
  { id: "backup", label: "Yedekleme", icon: Download },
  { id: "api", label: "API / CI", icon: Braces }
];

function Field({ label, children, help }) {
  return <div><div className="field-label">{label}</div>{children}{help ? <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{help}</p> : null}</div>;
}

function TextInput({ value, onChange, type = "text", placeholder }) {
  return <input className="input" type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition hover:bg-slate-50 dark:hover:bg-slate-900" style={{ borderColor: "var(--border)" }}>
      <span>{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-[#1f4e79] dark:bg-[#7aa7d9]" : "bg-slate-300 dark:bg-slate-700")}>
        <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition", checked ? "left-6 dark:bg-slate-950" : "left-1")} />
      </span>
    </button>
  );
}

function SettingsCard({ title, description, icon: Icon, children }) {
  return (
    <section className="page-card overflow-hidden">
      <div className="flex items-start gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#1f4e79] dark:bg-slate-900 dark:text-[#7aa7d9]">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-description">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const { theme, setTheme, lang, setLang, toast } = useUI();
  const [active, setActive] = useState("general");
  const [settings, setSettings] = useState(defaultSettings);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const local = typeof window !== "undefined" ? localStorage.getItem("reel-system-settings") : null;
    if (local) setSettings({ ...defaultSettings, ...JSON.parse(local) });
    endpoints.settings?.system?.()
      .then((res) => setSettings({ ...defaultSettings, ...(unwrap(res) || {}) }))
      .catch(() => {});
    endpoints.settings?.users?.()
      .then((res) => setUsers(unwrap(res) || []))
      .catch(() => setUsers([]));
  }, []);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  async function save() {
    setSaving(true);
    try {
      localStorage.setItem("reel-system-settings", JSON.stringify(settings));
      await endpoints.settings?.updateSystem?.(settings).catch(() => null);
      setTheme(settings.defaultTheme);
      setLang(settings.defaultLanguage);
      toast("Sistem ayarları kaydedildi", "success");
    } catch (error) {
      toast(apiError(error), "error");
    }
    setSaving(false);
  }

  const tabTitle = useMemo(() => tabs.find((tab) => tab.id === active)?.label || "Ayarlar", [active]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - System Administration"
        title="Ayarlar Merkezi"
        description="Kullanıcılar, güvenlik, dil, datasheet, etiket, yedekleme ve API yönetimini tek kurumsal merkezden kontrol et."
        actions={<button className="btn-primary" onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Kaydediliyor" : "Ayarları Kaydet"}</button>}
      />

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="page-card h-fit p-3">
          <div className="px-2 pb-3 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Settings</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button" onClick={() => setActive(tab.id)} className={cn("settings-tab", active === tab.id ? "settings-tab-active" : "settings-tab-passive")}>
                <Icon className="h-5 w-5" strokeWidth={2.2} />{tab.label}
              </button>
            );
          })}
        </aside>

        <div className="space-y-6">
          <div className="page-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Aktif Bölüm</div>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">{tabTitle}</h2>
            </div>
            <StatusBadge status="active" />
          </div>

          {active === "general" && (
            <SettingsCard title="Genel Sistem" description="Firma, uygulama, stok varsayılanları ve SKU üretim standardı." icon={ServerCog}>
              <Field label="Firma Adı"><TextInput value={settings.companyName} onChange={(v) => update("companyName", v)} /></Field>
              <Field label="Uygulama Adı"><TextInput value={settings.appName} onChange={(v) => update("appName", v)} /></Field>
              <SelectField label="Varsayılan Para Birimi" value={settings.defaultCurrency} onChange={(v) => update("defaultCurrency", v)} options={["TRY", "USD", "EUR"].map((v) => ({ value: v, label: v }))} />
              <Field label="Düşük Stok Limiti"><TextInput type="number" value={settings.lowStockLimit} onChange={(v) => update("lowStockLimit", Number(v))} /></Field>
              <Field label="SKU Prefix"><TextInput value={settings.skuPrefix} onChange={(v) => update("skuPrefix", v.toUpperCase())} /></Field>
              <SelectField label="SKU Üretim Tipi" value={settings.skuMode} onChange={(v) => update("skuMode", v)} options={[{ value: "random", label: "Rastgele harf/sayı" }, { value: "sequential", label: "Sıralı numara" }]} />
            </SettingsCard>
          )}

          {active === "users" && (
            <SettingsCard title="Kullanıcı ve Roller" description="Admin, kullanıcı ve görüntüleyici hesaplarını kurumsal politika ile yönet." icon={UserCog}>
              <div className="md:col-span-2 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900"><tr><th className="px-3 py-2 text-left">Kullanıcı</th><th className="px-3 py-2 text-left">Rol</th><th className="px-3 py-2 text-left">Durum</th></tr></thead>
                  <tbody>{(users.length ? users : [{ name: "Admin User", email: "admin@example.com", role: "admin", status: "active" }]).map((user) => <tr key={user.email} className="border-t border-slate-200 dark:border-slate-800"><td className="px-3 py-2"><div className="font-semibold">{user.name}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="px-3 py-2 font-mono text-xs">{user.role}</td><td className="px-3 py-2"><StatusBadge status={user.status || "active"} /></td></tr>)}</tbody>
                </table>
              </div>
              <Field label="Yeni Kullanıcı"><TextInput placeholder="name@company.com" value="" onChange={() => {}} /></Field>
              <SelectField label="Varsayılan Rol" value="user" onChange={() => {}} options={[{ value: "admin", label: "Admin" }, { value: "user", label: "User" }, { value: "viewer", label: "Viewer" }]} />
            </SettingsCard>
          )}

          {active === "security" && (
            <SettingsCard title="Güvenlik Politikası" description="Oturum, kayıt, MFA ve audit log davranışları." icon={LockKeyhole}>
              <Field label="Session Timeout (dk)"><TextInput type="number" value={settings.sessionTimeoutMinutes} onChange={(v) => update("sessionTimeoutMinutes", Number(v))} /></Field>
              <SelectField label="Kayıt Politikası" value={settings.registrationMode} onChange={(v) => update("registrationMode", v)} options={[{ value: "admin-only", label: "Sadece admin oluşturur" }, { value: "invite-only", label: "Davet ile" }, { value: "closed", label: "Kapalı" }]} />
              <Toggle checked={settings.mfaRequired} onChange={(v) => update("mfaRequired", v)} label="MFA zorunlu olsun" />
              <Field label="Audit Log Saklama (gün)"><TextInput type="number" value={settings.auditLogRetentionDays} onChange={(v) => update("auditLogRetentionDays", Number(v))} /></Field>
            </SettingsCard>
          )}

          {active === "localization" && (
            <SettingsCard title="Dil, SQL ve Form Sözlüğü" description="Türkçe / İngilizce arayüz ve veri tipleri sözlüğü." icon={Languages}>
              <SelectField label="Varsayılan Dil" value={settings.defaultLanguage} onChange={(v) => update("defaultLanguage", v)} options={[{ value: "tr", label: "Türkçe" }, { value: "en", label: "English" }]} />
              <SelectField label="Tarih Formatı" value={settings.dateFormat} onChange={(v) => update("dateFormat", v)} options={["DD.MM.YYYY", "YYYY-MM-DD", "MM/DD/YYYY"].map((v) => ({ value: v, label: v }))} />
              <div className="md:col-span-2 grid gap-4 lg:grid-cols-2">
                <DictionaryTable title="SQL Veri Tipleri" rows={sqlTypes} />
                <DictionaryTable title="Form Veri Tipleri" rows={formTypes} />
              </div>
            </SettingsCard>
          )}

          {active === "datasheets" && (
            <SettingsCard title="Datasheet Enrichment" description="Provider sırası, timeout ve cache davranışı." icon={FileText}>
              <Field label="Provider Timeout (ms)"><TextInput type="number" value={settings.datasheetTimeoutMs} onChange={(v) => update("datasheetTimeoutMs", Number(v))} /></Field>
              <Field label="Cache TTL (gün)"><TextInput type="number" value={settings.cacheTtlDays} onChange={(v) => update("cacheTtlDays", Number(v))} /></Field>
              <div className="md:col-span-2 grid gap-3 md:grid-cols-3">{datasheetProviders.map((item, i) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950"><span className="mr-2 font-mono text-xs text-slate-500">{i + 1}</span>{item}</div>)}</div>
            </SettingsCard>
          )}

          {active === "branding" && (
            <SettingsCard title="Tasarım ve Arayüz" description="Kurumsal font, tema, etiket profili ve görünüm tercihleri." icon={Paintbrush}>
              <SelectField label="Varsayılan Tema" value={settings.defaultTheme} onChange={(v) => update("defaultTheme", v)} options={[{ value: "dark", label: "Dark Mode" }, { value: "light", label: "Light Mode" }]} />
              <SelectField label="Etiket Profili" value={settings.labelProfile} onChange={(v) => update("labelProfile", v)} options={[{ value: "thermal-50x25", label: "Thermal 50 × 25 mm" }, { value: "brother-dk", label: "Brother DK" }, { value: "dymo", label: "DYMO" }]} />
            </SettingsCard>
          )}

          {active === "backup" && (
            <SettingsCard title="Yedekleme" description="Database export, dosya yedekleme ve saklama politikası." icon={UploadCloud}>
              <SelectField label="Yedekleme Sıklığı" value={settings.backupSchedule} onChange={(v) => update("backupSchedule", v)} options={[{ value: "manual", label: "Manuel" }, { value: "daily", label: "Günlük" }, { value: "weekly", label: "Haftalık" }]} />
              <Field label="Saklama Süresi (gün)"><TextInput type="number" value={settings.backupRetentionDays} onChange={(v) => update("backupRetentionDays", Number(v))} /></Field>
              <button className="btn-ghost"><Database className="h-4 w-4" />SQL Backup Planı</button>
              <button className="btn-ghost"><Mail className="h-4 w-4" />Yedek Mail Testi</button>
            </SettingsCard>
          )}

          {active === "api" && (
            <SettingsCard title="API, Bildirim ve CI/CD" description="Backend bağlantısı, bildirim e-postası ve GitHub Actions notları." icon={Braces}>
              <Field label="Bildirim E-postası"><TextInput value={settings.notificationEmail} onChange={(v) => update("notificationEmail", v)} /></Field>
              <Field label="API Base URL"><TextInput value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"} onChange={() => {}} /></Field>
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"><Bell className="mb-2 h-5 w-5" />CI/CD akışı frontend build, backend syntax check, Prisma validation ve artifact packaging adımlarını hedefler.</div>
            </SettingsCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function DictionaryTable({ title, rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-slate-900">{title}</div>
      <table className="w-full text-sm"><tbody>{rows.map(([code, tr, en]) => <tr key={code} className="border-t border-slate-200 dark:border-slate-800"><td className="px-3 py-2 font-mono text-xs font-semibold">{code}</td><td className="px-3 py-2">{tr}</td><td className="px-3 py-2 text-slate-500 dark:text-slate-400">{en}</td></tr>)}</tbody></table>
    </div>
  );
}
