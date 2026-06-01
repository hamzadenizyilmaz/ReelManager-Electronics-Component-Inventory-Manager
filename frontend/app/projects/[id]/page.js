"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Edit3, Plus, Save, Trash2 } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import SearchableSelect from "../../../components/ui/SearchableSelect";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { API_URL, apiError, endpoints, unwrap } from "../../../lib/api";
import { formatDate, formatNumber } from "../../../lib/formatters";
import { statusText } from "../../../lib/i18n-lite";
import { useUI } from "../../../components/providers/Providers";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast, lang: locale = "tr" } = useUI();
  const [project, setProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [stockCheck, setStockCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ componentId: "", referenceDesignator: "", requiredQuantity: 1, notes: "" });

  async function load() {
    setLoading(true);
    try {
      const [projectRes, compRes] = await Promise.all([endpoints.projects.get(id), endpoints.components.list({ limit: 1000 })]);
      setProject(unwrap(projectRes));
      const compPayload = unwrap(compRes);
      setComponents(compPayload?.items || compPayload?.components || compPayload || []);
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  const bomItems = useMemo(() => project?.bomItems || project?.projectBomItems || [], [project]);

  function componentLabel(component) {
    const mpn = component.manufacturerPartNumber || component.manufacturer_part_number || "";
    const value = component.value || "";
    const pkg = component.packageCase || component.package_case || "";
    return [mpn, value, pkg].filter(Boolean).join(" - ") || component.name || `#${component.id}`;
  }
  function componentSearchText(component) {
    return [component.internalSku, component.manufacturerPartNumber, component.supplierPartNumber, component.name, component.value, component.packageCase, component.manufacturer, component.category?.name, component.category?.nameTr, component.category?.nameEn, component.supplier?.name, component.supplier?.nameTr, component.supplier?.nameEn, component.storageLocation?.name, component.storageLocation?.nameTr, component.storageLocation?.nameEn, component.barcode].filter(Boolean).join(" ");
  }

  async function addBom(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await endpoints.projects.addBom(id, { component_id: Number(form.componentId), reference_designator: form.referenceDesignator, required_quantity: Number(form.requiredQuantity), notes: form.notes });
      toast("BOM item eklendi", "success");
      setForm({ componentId: "", referenceDesignator: "", requiredQuantity: 1, notes: "" });
      load();
    } catch (error) { toast(apiError(error), "error"); } finally { setSaving(false); }
  }

  async function updateBom(event) {
    event.preventDefault();
    if (!editItem) return;
    setSaving(true);
    try {
      await endpoints.projects.updateBom(id, editItem.id, { component_id: Number(editItem.componentId), reference_designator: editItem.referenceDesignator, required_quantity: Number(editItem.requiredQuantity), notes: editItem.notes || "" });
      toast("BOM item güncellendi", "success");
      setEditItem(null);
      load();
    } catch (error) { toast(apiError(error), "error"); } finally { setSaving(false); }
  }

  async function confirmDeleteBom() {
    if (!deleteItem) return;
    setSaving(true);
    try {
      await endpoints.projects.deleteBom(id, deleteItem.id);
      toast("BOM item silindi", "success");
      setDeleteItem(null);
      load();
    } catch (error) { toast(apiError(error), "error"); } finally { setSaving(false); }
  }

  async function checkStock() {
    try {
      const result = unwrap(await endpoints.projects.checkStock(id));
      setStockCheck(result);
      toast("Stok kontrolü tamamlandı", "success");
    } catch (error) { toast(apiError(error), "error"); }
  }

  function downloadPdf() {
    const token = localStorage.getItem("reel-token") || localStorage.getItem("token") || localStorage.getItem("auth_token") || "";
    const url = `${API_URL}/export/projects/${id}/bom/pdf${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="REEL MANAGER - PROJECT BOM"
        title={project?.name || "Proje"}
        description="BOM ve stok uygunluk merkezi."
        actions={<><button className="btn-ghost" onClick={() => router.push("/projects")}><ArrowLeft className="h-4 w-4" />Geri Dön</button><button className="btn-ghost" onClick={checkStock}>Stok Kontrol</button><button className="btn-primary" onClick={downloadPdf}><Download className="h-4 w-4" />PDF</button></>}
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="page-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white"><Plus className="h-5 w-5" /> BOM Item</h2>
          <form onSubmit={addBom} className="space-y-4">
            <SearchableSelect value={form.componentId} onChange={(value) => setForm({ ...form, componentId: value })} options={components} placeholder="Komponent seç" searchPlaceholder="SKU, MPN, değer, paket, lokasyon ara..." getValue={(c) => c.id} getLabel={componentLabel} getSearchText={componentSearchText} />
            <input className="input" placeholder="R1, C1, U1" value={form.referenceDesignator} onChange={(e) => setForm({ ...form, referenceDesignator: e.target.value })} />
            <input className="input" type="number" min="1" value={form.requiredQuantity} onChange={(e) => setForm({ ...form, requiredQuantity: e.target.value })} />
            <textarea className="input min-h-24" placeholder="Not" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <button className="btn-primary w-full" type="submit" disabled={saving || !form.componentId}>BOM'a Ekle</button>
          </form>
        </section>
        <section className="page-card overflow-hidden">
          {loading ? <div className="p-10 text-center text-slate-500">Yükleniyor...</div> : bomItems.length ? <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"><tr><th className="px-4 py-4">Ref</th><th className="px-4 py-4">Komponent</th><th className="px-4 py-4">Gerekli</th><th className="px-4 py-4">Stok</th><th className="px-4 py-4">Durum</th><th className="px-4 py-4">İşlemler</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-800">{bomItems.map((row) => { const c = row.component || {}; const check = Array.isArray(stockCheck) ? stockCheck.find((x) => Number(x.componentId) === Number(row.componentId)) : null; return <tr key={row.id} className="bg-white dark:bg-slate-950"><td className="px-4 py-4 font-semibold">{row.referenceDesignator || "-"}</td><td className="px-4 py-4"><div className="font-semibold text-slate-900 dark:text-white">{componentLabel(c)}</div><div className="text-xs text-slate-500">{c.internalSku || ""}</div></td><td className="px-4 py-4">{row.requiredQuantity}</td><td className="px-4 py-4">{formatNumber(c.quantityAvailable)}</td><td className="px-4 py-4"><span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">{check?.status ? statusText(check.status, locale) : "-"}</span></td><td className="px-4 py-4"><div className="flex gap-2"><button className="btn-ghost" onClick={() => setEditItem({ ...row })}><Edit3 className="h-4 w-4" />Düzenle</button><button className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500" onClick={() => setDeleteItem(row)}><Trash2 className="h-4 w-4 inline" /> Sil</button></div></td></tr>; })}</tbody></table></div> : <div className="p-16 text-center text-slate-500">Kayıt bulunamadı.</div>}
        </section>
      </div>
      {editItem ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950"><h2 className="text-lg font-semibold dark:text-white">BOM Item Düzenle</h2><form onSubmit={updateBom} className="mt-4 space-y-4"><SearchableSelect value={editItem.componentId} onChange={(value) => setEditItem({ ...editItem, componentId: value })} options={components} placeholder="Komponent seç" getValue={(c) => c.id} getLabel={componentLabel} getSearchText={componentSearchText} /><input className="input" value={editItem.referenceDesignator || ""} onChange={(e) => setEditItem({ ...editItem, referenceDesignator: e.target.value })} /><input className="input" type="number" min="1" value={editItem.requiredQuantity || 1} onChange={(e) => setEditItem({ ...editItem, requiredQuantity: e.target.value })} /><textarea className="input min-h-24" value={editItem.notes || ""} onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })} /><div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={() => setEditItem(null)}>Vazgeç</button><button type="submit" className="btn-primary"><Save className="h-4 w-4" />Kaydet</button></div></form></div></div> : null}
      <ConfirmModal open={Boolean(deleteItem)} danger title="BOM item silinsin mi?" description="Bu işlem geri alınamaz." confirmText="Sil" onClose={() => setDeleteItem(null)} onConfirm={confirmDeleteBom} loading={saving} />
    </AppShell>
  );
}
