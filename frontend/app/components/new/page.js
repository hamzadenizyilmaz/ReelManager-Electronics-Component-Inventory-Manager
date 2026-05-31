"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, FileSearch, Save, WandSparkles } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import SelectField from "../../../components/ui/SelectField";
import { apiError, endpoints, unwrap } from "../../../lib/api";
import { useUI } from "../../../components/providers/Providers";

const initial = {
  manufacturer_part_number: "",
  supplier_part_number: "",
  manufacturer: "",
  category_id: "",
  supplier_id: "",
  name: "",
  description: "",
  package_case: "",
  value: "",
  unit: "",
  tolerance: "",
  voltage_rating: "",
  current_rating: "",
  power_rating: "",
  temperature_coefficient: "",
  dielectric: "",
  footprint: "",
  mounting_type: "SMD",
  quantity_total: 0,
  minimum_stock: 0,
  reorder_quantity: 0,
  storage_location_id: "",
  barcode: "",
  datasheet_url: "",
  product_url: "",
  image_url: "",
  notes: ""
};

function localParse(partNumber) {
  const value = String(partNumber || "").toUpperCase();
  if (/^RC(\d{4})FR-07(\d+)RL/.test(value)) {
    const [, pkg, raw] = value.match(/^RC(\d{4})FR-07(\d+)RL/) || [];
    return {
      category: "Resistor",
      package_case: pkg,
      value: raw?.endsWith("0") ? `${Number(raw) / 10} Ohm` : `${raw} Ohm`,
      tolerance: "1%",
      manufacturer: "YAGEO",
      name: `${pkg} resistor`
    };
  }
  if (/^CL21/.test(value)) {
    return {
      category: "Capacitor",
      package_case: "0805",
      manufacturer: "Samsung",
      name: "Samsung MLCC capacitor",
      value: value.includes("104") ? "100nF" : value.includes("226") ? "22uF" : ""
    };
  }
  if (/B340|SS36/.test(value)) {
    return {
      category: "Diode",
      name: "Schottky diode",
      package_case: value.includes("B340") ? "SMA" : "SMB",
      value: "Schottky",
      manufacturer: value.includes("B340") ? "Diodes Inc." : ""
    };
  }
  if (/SMBJ/.test(value)) return { category: "TVS / ESD", name: "TVS diode", package_case: "SMB", value: value.replace("SMBJ", "") };
  return {};
}

function findCategoryId(categories, category) {
  const c = String(category || "").toLowerCase();
  if (!c) return "";
  const match = categories.find((item) => {
    const hay = `${item.name || ""} ${item.nameTr || ""} ${item.nameEn || ""} ${item.slug || ""}`.toLowerCase();
    return hay.includes(c) || c.includes(hay.split(" ")[0]);
  });
  return match?.id || "";
}

function mapEnrichmentToForm(result, categories, currentForm) {
  const categoryId = findCategoryId(categories, result.category) || currentForm.category_id;
  return {
    ...currentForm,
    manufacturer_part_number: result.manufacturer_part_number || currentForm.manufacturer_part_number,
    manufacturer: result.manufacturer || currentForm.manufacturer,
    category_id: categoryId,
    name: currentForm.name || result.description || result.manufacturer_part_number || "",
    description: result.description || currentForm.description,
    package_case: result.package_case || currentForm.package_case,
    value: result.value || currentForm.value,
    tolerance: result.tolerance || currentForm.tolerance,
    voltage_rating: result.voltage_rating || currentForm.voltage_rating,
    current_rating: result.current_rating || currentForm.current_rating,
    power_rating: result.power_rating || currentForm.power_rating,
    temperature_coefficient: result.temperature_coefficient || currentForm.temperature_coefficient,
    dielectric: result.dielectric || currentForm.dielectric,
    datasheet_url: result.datasheet_url || currentForm.datasheet_url,
    product_url: result.product_url || currentForm.product_url,
    image_url: result.image_url || currentForm.image_url
  };
}

export default function NewComponentPage() {
  const router = useRouter();
  const { toast } = useUI();
  const [form, setForm] = useState(initial);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [enrichment, setEnrichment] = useState(null);

  useEffect(() => {
    Promise.all([endpoints.categories.list(), endpoints.suppliers.list(), endpoints.locations.list()])
      .then(([c, s, l]) => {
        setCategories(unwrap(c) || []);
        setSuppliers(unwrap(s) || []);
        setLocations(unwrap(l) || []);
      })
      .catch((e) => toast(apiError(e), "error"));
  }, [toast]);

  const parserCategories = useMemo(() => ({
    resistor: findCategoryId(categories, "Resistor"),
    capacitor: findCategoryId(categories, "Capacitor"),
    diode: findCategoryId(categories, "Diode") || findCategoryId(categories, "TVS")
  }), [categories]);

  function applyParser() {
    const parsed = localParse(form.manufacturer_part_number || form.supplier_part_number);
    let categoryId = form.category_id;
    if (/resistor/i.test(parsed.category || parsed.name || "")) categoryId = parserCategories.resistor || categoryId;
    if (/capacitor/i.test(parsed.category || parsed.name || "")) categoryId = parserCategories.capacitor || categoryId;
    if (/diode|tvs/i.test(parsed.category || parsed.name || "")) categoryId = parserCategories.diode || categoryId;
    setForm((f) => ({ ...f, ...parsed, category_id: categoryId }));
    toast("Local parser tahmini uygulandı", "success");
  }

  async function searchDatasheet() {
    const query = form.manufacturer_part_number || form.supplier_part_number;
    if (!query) {
      toast("Önce üretici veya tedarikçi parça kodu yaz", "error");
      return;
    }
    setSearching(true);
    try {
      const data = unwrap(await endpoints.datasheets.search(query));
      setEnrichment(data);
      if (!data?.results?.length) toast("Sonuç bulunamadı", "error");
      else toast(`${data.results.length} enrichment sonucu bulundu`, "success");
    } catch (error) {
      toast(apiError(error), "error");
    }
    setSearching(false);
  }

  function applyEnrichment(result) {
    setForm((current) => mapEnrichmentToForm(result, categories, current));
    toast(`${result.source} sonucu forma uygulandı`, "success");
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, quantity_available: form.quantity_total };
      const data = unwrap(await endpoints.components.create(payload));
      toast("Komponent oluşturuldu", "success");
      router.push(`/components/${data.id}`);
    } catch (error) {
      toast(apiError(error), "error");
    }
    setSaving(false);
  }

  const input = (name, label, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <input className="input" type={type} value={form[name] ?? ""} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
    </label>
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Inventory Wizard"
        title="Yeni Komponent"
        description="Parça kodu gir, Nexar/Octopart, DigiKey, Mouser ve local parser zinciriyle teknik bilgileri otomatik doldur."
      />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="page-card space-y-6 p-5">
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Cpu className="h-5 w-5 text-brand-500" />Temel Bilgiler</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {input("manufacturer_part_number", "Manufacturer Part Number")}
              {input("supplier_part_number", "Supplier Part Number")}
              {input("manufacturer", "Üretici")}
              {input("name", "Ürün Adı")}
              <SelectField
                label="Kategori"
                value={form.category_id}
                onChange={(value) => setForm({ ...form, category_id: value })}
                placeholder="Kategori seç"
                options={categories.map((x) => ({ value: x.id, label: x.nameTr || x.nameEn || x.name }))}
              />
              <SelectField
                label="Tedarikçi"
                value={form.supplier_id}
                onChange={(value) => setForm({ ...form, supplier_id: value })}
                placeholder="Tedarikçi seç"
                options={suppliers.map((x) => ({ value: x.id, label: x.nameTr || x.nameEn || x.name }))}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Teknik Özellikler</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {input("value", "Değer")}
              {input("package_case", "Kılıf / Package")}
              {input("unit", "Birim")}
              {input("tolerance", "Tolerans")}
              {input("voltage_rating", "Voltaj")}
              {input("current_rating", "Akım")}
              {input("power_rating", "Güç")}
              {input("temperature_coefficient", "TCR")}
              {input("dielectric", "Dielectric")}
              {input("footprint", "Footprint")}
              {input("mounting_type", "Montaj")}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Stok & Linkler</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {input("quantity_total", "Toplam Stok", "number")}
              {input("minimum_stock", "Minimum Stok", "number")}
              {input("reorder_quantity", "Sipariş Adedi", "number")}
              <SelectField
                label="Lokasyon"
                value={form.storage_location_id}
                onChange={(value) => setForm({ ...form, storage_location_id: value })}
                placeholder="Lokasyon seç"
                options={locations.map((x) => ({ value: x.id, label: x.nameTr || x.nameEn || x.name }))}
              />
              {input("barcode", "Barkod / QR")}
              {input("product_url", "Ürün URL")}
              {input("datasheet_url", "Datasheet URL")}
              {input("image_url", "Görsel URL")}
            </div>
          </section>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Notlar</span>
            <textarea className="input min-h-28" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
        </div>

        <aside className="space-y-4">
          <div className="page-card p-5">
            <h3 className="text-lg font-semibold">Auto Fill from Datasheet/API</h3>
            <p className="mt-2 text-sm text-slate-500">Önce local database, sonra Nexar/Octopart, DigiKey, Mouser ve local parser denenir. API key yoksa provider skip edilir.</p>
            <button type="button" onClick={searchDatasheet} disabled={searching} className="btn-primary mt-4 w-full">
              <FileSearch className="h-4 w-4" />{searching ? "Aranıyor..." : "Search Datasheet"}
            </button>
            <button type="button" onClick={applyParser} className="btn-ghost mt-3 w-full">
              <WandSparkles className="h-4 w-4" />Local Parser Fallback
            </button>
          </div>

          {enrichment ? (
            <div className="page-card p-5">
              <h3 className="text-lg font-semibold">Bulunan Sonuçlar</h3>
              <div className="mt-3 space-y-3">
                {(enrichment.results || []).map((result, index) => (
                  <button key={`${result.source}-${index}`} type="button" onClick={() => applyEnrichment(result)} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-brand-400 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{result.manufacturer_part_number}</div>
                        <div className="mt-1 text-xs text-slate-500">{result.manufacturer || "-"} · {result.package_case || "-"} · {result.value || "-"}</div>
                      </div>
                      <StatusBadge status={result.cached ? "completed" : "active"} />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Source: {result.source} · Confidence: {Math.round(Number(result.confidence_score || 0) * 100)}%</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Provider log: {(enrichment.providers || []).map((p) => `${p.name}:${p.status}`).join(" → ")}
              </div>
            </div>
          ) : null}

          <div className="page-card p-5">
            <button disabled={saving} className="btn-primary w-full"><Save className="h-4 w-4" />{saving ? "Kaydediliyor..." : "Komponenti Kaydet"}</button>
          </div>
        </aside>
      </form>
    </AppShell>
  );
}
