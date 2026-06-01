"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, Save } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import { useUI } from "../../../components/providers/Providers";

const defaults = { theme: "dark", density: "comfortable", accent: "#1f4e79", fontSize: "17", radius: "14", panelStyle: "corporate" };

export default function AppearanceSettingsPage() {
  const { toast, setTheme, applyAppearance } = useUI();
  const [form, setForm] = useState(defaults);

  useEffect(() => {
    const loaded = {
      theme: localStorage.getItem("reel-theme") || defaults.theme,
      density: localStorage.getItem("reelmanager_density") || defaults.density,
      accent: localStorage.getItem("reelmanager_accent") || defaults.accent,
      fontSize: localStorage.getItem("reelmanager_font_size") || defaults.fontSize,
      radius: localStorage.getItem("reelmanager_radius") || defaults.radius,
      panelStyle: localStorage.getItem("reelmanager_panel_style") || defaults.panelStyle
    };
    setForm(loaded);
    writeAppearance(loaded);
    setTheme(loaded.theme);
    applyAppearance?.();
  }, []);

  function setField(name, value) {
    const next = { ...form, [name]: value };
    setForm(next);
    writeAppearance(next);
    if (name === "theme") setTheme(value);
    applyAppearance?.();
  }

  function save() {
    writeAppearance(form);
    setTheme(form.theme);
    applyAppearance?.();
    toast("Tasarım tercihleri kaydedildi ve sisteme uygulandı", "success");
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Arayüz Tasarımı"
        title="Tasarım Tercihleri"
        description="Tema, panel yoğunluğu, font boyutu, kurumsal vurgu rengi ve köşe yapısı anlık olarak sisteme uygulanır. Her kullanıcı kendi çalışma alanını kişiselleştirebilir."
        actions={<Link className="btn-ghost" href="/settings"><ArrowLeft className="h-4 w-4" />Ayarlar</Link>}
      />
      <section className="page-card p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FieldSelect label="Tema" value={form.theme} onChange={(v) => setField("theme", v)} options={[["dark", "Koyu tema"], ["light", "Açık tema"]]} />
          <FieldSelect label="Yoğunluk" value={form.density} onChange={(v) => setField("density", v)} options={[["comfortable", "Rahat"], ["compact", "Kompakt"], ["spacious", "Geniş"]]} />
          <FieldSelect label="Panel stili" value={form.panelStyle} onChange={(v) => setField("panelStyle", v)} options={[["corporate", "Kurumsal"], ["minimal", "Minimal"], ["technical", "Teknik"]]} />
          <label className="block"><span className="field-label">Kurumsal vurgu rengi</span><input type="color" className="h-12 w-full rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900" value={form.accent} onChange={(e) => setField("accent", e.target.value)} /></label>
          <label className="block"><span className="field-label">Font boyutu</span><input className="input" type="number" min="14" max="20" value={form.fontSize} onChange={(e) => setField("fontSize", e.target.value)} /></label>
          <label className="block"><span className="field-label">Köşe radius</span><input className="input" type="number" min="8" max="28" value={form.radius} onChange={(e) => setField("radius", e.target.value)} /></label>
        </div>
        <div className="mt-6 flex justify-end"><button className="btn-primary" onClick={save}><Save className="h-4 w-4" />Kaydet ve uygula</button></div>
      </section>
      <section className="mt-6 page-card p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3"><Palette className="h-5 w-5 text-brand-600" /><h2 className="text-lg font-semibold">Canlı önizleme</h2></div>
        <div className="grid gap-4 md:grid-cols-3"><PreviewCard title="Kart" /><PreviewCard title="Form" /><PreviewCard title="Aksiyon" /></div>
      </section>
    </AppShell>
  );
}
function writeAppearance(form) { localStorage.setItem("reel-theme", form.theme); localStorage.setItem("reelmanager_density", form.density); localStorage.setItem("reelmanager_accent", form.accent); localStorage.setItem("reelmanager_font_size", form.fontSize); localStorage.setItem("reelmanager_radius", form.radius); localStorage.setItem("reelmanager_panel_style", form.panelStyle); window.dispatchEvent(new Event("reelmanager:appearance")); }
function FieldSelect({ label, value, onChange, options }) { return <label className="block"><span className="field-label">{label}</span><select className="input" value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>; }
function PreviewCard({ title }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"><div className="text-sm font-semibold">{title}</div><p className="mt-2 text-sm text-slate-500">ReelManager kurumsal arayüz önizlemesi.</p><button className="btn-primary mt-4">Önizleme</button></div>; }
