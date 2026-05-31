"use client";

import { useMemo, useState } from "react";
import { Copy, Printer, QrCode, Settings2, SquareTerminal } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useUI } from "../providers/Providers";

export const LABEL_PROFILES = [
  {
    id: "thermal-50x25",
    name: "Thermal 50 × 25 mm",
    description: "Zebra, TSC, Godex, Argox ve çoğu direkt termal yazıcı için standart komponent etiketi.",
    widthMm: 50,
    heightMm: 25,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 15,
    fontSizePt: 6.7,
    type: "roll"
  },
  {
    id: "thermal-40x30",
    name: "Thermal 40 × 30 mm",
    description: "Küçük kutu/çekmece etiketleri için okunaklı QR + SKU düzeni.",
    widthMm: 40,
    heightMm: 30,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 14,
    fontSizePt: 6.2,
    type: "roll"
  },
  {
    id: "thermal-58x40",
    name: "Thermal 58 × 40 mm",
    description: "Genel market/lojistik tipi 58 mm rulo yazıcılarla uyumlu geniş şablon.",
    widthMm: 58,
    heightMm: 40,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 18,
    fontSizePt: 7.4,
    type: "roll"
  },
  {
    id: "brother-dk-11201",
    name: "Brother DK-11201 29 × 90 mm",
    description: "Brother QL serisi adres etiketi ile çekmece/raf kodu çıktısı.",
    widthMm: 90,
    heightMm: 29,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 18,
    fontSizePt: 7.2,
    type: "roll"
  },
  {
    id: "dymo-89x36",
    name: "DYMO 89 × 36 mm",
    description: "DYMO LabelWriter adres etiketi için geniş teknik bilgi düzeni.",
    widthMm: 89,
    heightMm: 36,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 19,
    fontSizePt: 7.5,
    type: "roll"
  },
  {
    id: "mini-30x20",
    name: "Mini QR 30 × 20 mm",
    description: "SMD kutu bölmeleri için sadece QR, SKU ve değer gösteren kompakt etiket.",
    widthMm: 30,
    heightMm: 20,
    columns: 1,
    gapMm: 0,
    qrSizeMm: 11,
    fontSizePt: 5.6,
    type: "roll"
  },
  {
    id: "a4-70x37",
    name: "A4 Sheet 70 × 37 mm",
    description: "Lazer/inkjet A4 sayfa etiketleri için 3 kolonlu şablon.",
    widthMm: 70,
    heightMm: 37,
    columns: 3,
    gapMm: 2,
    qrSizeMm: 18,
    fontSizePt: 7.1,
    type: "sheet"
  }
];

const defaultOptions = {
  profileId: "thermal-50x25",
  copies: 1,
  includePartNumber: true,
  includeValue: true,
  includePackage: true,
  includeQuantity: true,
  includeLocation: true,
  includeManufacturer: false,
  qrMode: "sku"
};

function normalizeComponent(component) {
  return {
    id: component?.id,
    internalSku: component?.internalSku || component?.internal_sku || "CMP-UNKNOWN",
    manufacturerPartNumber: component?.manufacturerPartNumber || component?.manufacturer_part_number || "-",
    supplierPartNumber: component?.supplierPartNumber || component?.supplier_part_number || "-",
    manufacturer: component?.manufacturer || "-",
    value: component?.value || "-",
    packageCase: component?.packageCase || component?.package_case || "-",
    quantityAvailable: component?.quantityAvailable ?? component?.quantity_available ?? 0,
    location: component?.storageLocation?.nameTr || component?.storageLocation?.nameEn || component?.storageLocation?.name || component?.location || "-",
    name: component?.name || component?.description || "Electronic Component"
  };
}

function qrValue(item, mode) {
  if (mode === "detail" && item.id) return `${typeof window !== "undefined" ? window.location.origin : ""}/components/${item.id}`;
  if (mode === "mpn") return item.manufacturerPartNumber;
  return item.internalSku;
}

function buildCopies(items, copies) {
  const count = Math.max(1, Number(copies || 1));
  return items.flatMap((item) => Array.from({ length: count }, () => item));
}

function safeText(value) {
  return String(value || "").replace(/[\^~\\]/g, " ").slice(0, 80);
}

function buildZpl(component, profile, options) {
  const item = normalizeComponent(component);
  const dpmm = 8; // 203dpi default. Works as a safe baseline for most desktop thermal printers.
  const w = Math.round(profile.widthMm * dpmm);
  const h = Math.round(profile.heightMm * dpmm);
  const qr = Math.max(4, Math.round(profile.qrSizeMm * dpmm));
  const textX = qr + 28;
  const lines = [
    "^XA",
    `^PW${w}`,
    `^LL${h}`,
    "^CI28",
    `^FO16,16^BQN,2,4^FDLA,${safeText(qrValue(item, options.qrMode))}^FS`,
    `^FO${textX},18^A0N,24,24^FD${safeText(item.internalSku)}^FS`,
    `^FO${textX},48^A0N,18,18^FD${safeText(item.manufacturerPartNumber)}^FS`,
    `^FO${textX},72^A0N,18,18^FD${safeText([item.value, item.packageCase].filter(Boolean).join(" / "))}^FS`
  ];
  if (options.includeLocation) lines.push(`^FO${textX},96^A0N,16,16^FD${safeText(item.location)}^FS`);
  lines.push("^XZ");
  return lines.join("\n");
}

export default function LabelPrintPanel({ component, components = [], compact = false }) {
  const { toast } = useUI();
  const [options, setOptions] = useState(defaultOptions);
  const profile = LABEL_PROFILES.find((item) => item.id === options.profileId) || LABEL_PROFILES[0];
  const baseItems = useMemo(() => {
    const source = components.length ? components : component ? [component] : [];
    return source.map(normalizeComponent);
  }, [component, components]);
  const labels = useMemo(() => buildCopies(baseItems, options.copies), [baseItems, options.copies]);

  function setOption(key, value) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function injectPrintStyle() {
    const old = document.getElementById("reel-label-print-style");
    if (old) old.remove();
    const style = document.createElement("style");
    style.id = "reel-label-print-style";
    style.textContent = `
      @page { size: ${profile.type === "sheet" ? "A4" : `${profile.widthMm}mm ${profile.heightMm}mm`}; margin: ${profile.type === "sheet" ? "8mm" : "0mm"}; }
      @media print {
        html, body { background: #fff !important; color: #000 !important; width: auto !important; min-height: auto !important; }
        body * { visibility: hidden !important; }
        #label-print-root, #label-print-root * { visibility: visible !important; }
        #label-print-root { display: block !important; position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; background: #fff !important; z-index: 2147483647 !important; }
        .label-print-toolbar { display: none !important; }
        .label-print-grid { display: grid !important; grid-template-columns: repeat(${profile.columns}, ${profile.widthMm}mm) !important; gap: ${profile.gapMm}mm !important; align-items: start !important; justify-content: start !important; }
        .label-print-card { break-inside: avoid !important; page-break-inside: avoid !important; box-shadow: none !important; border-color: #111 !important; background: #fff !important; color: #000 !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function printLabels() {
    if (!labels.length) {
      toast("Yazdırılacak etiket bulunamadı", "error");
      return;
    }
    injectPrintStyle();
    const cleanup = () => {
      setTimeout(() => document.getElementById("reel-label-print-style")?.remove(), 700);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    setTimeout(() => window.print(), 80);
  }

  async function copyZpl() {
    if (!baseItems.length) {
      toast("ZPL oluşturmak için komponent gerekli", "error");
      return;
    }
    const zpl = buildCopies(baseItems, options.copies).map((item) => buildZpl(item, profile, options)).join("\n");
    await navigator.clipboard.writeText(zpl);
    toast("ZPL komutu panoya kopyalandı", "success");
  }

  return (
    <div className={compact ? "space-y-4" : "page-card space-y-5 p-5"}>
      <div className="label-print-toolbar space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black"><QrCode className="h-5 w-5 text-brand-500" />Etiket Yazdırma</h2>
          </div>
          <button type="button" className="btn-primary shrink-0" onClick={printLabels}><Printer className="h-4 w-4" />Etiket Bas</button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Yazıcı / Etiket Profili</span>
            <select className="select" value={options.profileId} onChange={(e) => setOption("profileId", e.target.value)}>
              {LABEL_PROFILES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{profile.description}</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-500">Kopya</span>
            <input className="input" type="number" min="1" max="200" value={options.copies} onChange={(e) => setOption("copies", e.target.value)} />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500"><Settings2 className="h-4 w-4" />Alanlar</div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              ["includePartNumber", "Part number"],
              ["includeValue", "Değer"],
              ["includePackage", "Kılıf"],
              ["includeQuantity", "Stok adedi"],
              ["includeLocation", "Lokasyon"],
              ["includeManufacturer", "Üretici"]
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white dark:hover:bg-slate-900">
                <input type="checkbox" checked={options[key]} onChange={(e) => setOption(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {["sku", "mpn", "detail"].map((mode) => (
              <label key={mode} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-white dark:hover:bg-slate-900">
                <input type="radio" name="qrMode" checked={options.qrMode === mode} onChange={() => setOption("qrMode", mode)} />
                QR: {mode === "sku" ? "SKU" : mode === "mpn" ? "Part No" : "Detay URL"}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={copyZpl}><SquareTerminal className="h-4 w-4" />Zebra ZPL Kopyala</button>
          <button type="button" className="btn-ghost" onClick={() => navigator.clipboard.writeText(baseItems.map((i) => i.internalSku).join("\n")).then(() => toast("SKU listesi kopyalandı", "success"))}><Copy className="h-4 w-4" />SKU Kopyala</button>
        </div>
      </div>

      <div id="label-print-root" className="label-print-preview rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="label-print-grid grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(profile.columns, 3)}, minmax(0, ${profile.widthMm}mm))` }}>
          {labels.length ? labels.map((item, index) => <LabelCard key={`${item.internalSku}-${index}`} item={item} profile={profile} options={options} />) : <div className="text-sm text-slate-500">Etiket önizlemesi için komponent seç.</div>}
        </div>
      </div>
    </div>
  );
}

function LabelCard({ item, profile, options }) {
  const part = item.manufacturerPartNumber !== "-" ? item.manufacturerPartNumber : item.supplierPartNumber;
  const meta = [
    options.includeValue ? item.value : null,
    options.includePackage ? item.packageCase : null,
    options.includeQuantity ? `QTY ${item.quantityAvailable}` : null
  ].filter(Boolean).join(" • ");
  return (
    <div
      className="label-print-card overflow-hidden rounded-md border border-slate-900 bg-white text-slate-950"
      style={{ width: `${profile.widthMm}mm`, height: `${profile.heightMm}mm`, padding: "2mm", fontSize: `${profile.fontSizePt}pt` }}
    >
      <div className="flex h-full gap-2">
        <div className="shrink-0 rounded bg-white p-0.5" style={{ width: `${profile.qrSizeMm}mm`, height: `${profile.qrSizeMm}mm` }}>
          <QRCodeCanvas value={qrValue(item, options.qrMode)} size={Math.round(profile.qrSizeMm * 3.78)} includeMargin={false} />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate font-black tracking-tight">{item.internalSku}</div>
          {options.includePartNumber ? <div className="truncate font-bold">{part}</div> : null}
          {meta ? <div className="truncate">{meta}</div> : null}
          {options.includeManufacturer ? <div className="truncate">{item.manufacturer}</div> : null}
          {options.includeLocation ? <div className="truncate text-[.9em] font-semibold">{item.location}</div> : null}
        </div>
      </div>
    </div>
  );
}
