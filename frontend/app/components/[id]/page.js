"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronDown,
  Edit3,
  FileText,
  PackageCheck,
  Save,
  Sparkles,
  X
} from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import DataTable from "../../../components/tables/DataTable";
import LabelPrintPanel from "../../../components/labels/LabelPrintPanel";

import { apiError, endpoints, unwrap } from "../../../lib/api";
import {
  formatDate,
  formatNumber,
  stockStatus
} from "../../../lib/formatters";
import { useUI } from "../../../components/providers/Providers";

const emptyEditForm = {
  manufacturerPartNumber: "",
  internalSku: "",
  name: "",
  description: "",
  value: "",
  tolerance: "",
  powerRating: "",
  voltageRating: "",
  packageCase: "",
  manufacturer: "",
  datasheetUrl: "",
  productUrl: "",
  minimumStock: "",
  reorderQuantity: "",
  categoryId: "",
  supplierId: "",
  storageLocationId: ""
};

export default function ComponentDetailPage() {
  const { id } = useParams();
  const { toast } = useUI();

  const [item, setItem] = useState(null);
  const [datasheet, setDatasheet] = useState(null);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState(emptyEditForm);

  const [movement, setMovement] = useState({
    quantity: 1,
    reason: "Manual",
    notes: ""
  });

  async function load() {
    setLoading(true);

    try {
      const [
        componentResponse,
        categoriesResponse,
        suppliersResponse,
        locationsResponse,
        datasheetResponse
      ] = await Promise.allSettled([
        endpoints.components.get(id),
        endpoints.categories.list(),
        endpoints.suppliers.list(),
        endpoints.locations.list(),
        endpoints.components.datasheet(id)
      ]);

      if (componentResponse.status === "fulfilled") {
        const componentData = unwrap(componentResponse.value);

        setItem(componentData);
        fillEditForm(componentData);
      } else {
        toast(apiError(componentResponse.reason), "error");
      }

      if (categoriesResponse.status === "fulfilled") {
        setCategories(normalizeList(unwrap(categoriesResponse.value)));
      }

      if (suppliersResponse.status === "fulfilled") {
        setSuppliers(normalizeList(unwrap(suppliersResponse.value)));
      }

      if (locationsResponse.status === "fulfilled") {
        setLocations(normalizeList(unwrap(locationsResponse.value)));
      }

      if (datasheetResponse.status === "fulfilled") {
        setDatasheet(unwrap(datasheetResponse.value));
      } else {
        setDatasheet(null);
      }
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setLoading(false);
    }
  }

  function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.rows)) return data.rows;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }

  function fillEditForm(component) {
    setEditForm({
      manufacturerPartNumber: component?.manufacturerPartNumber || "",
      internalSku: component?.internalSku || "",
      name: component?.name || "",
      description: component?.description || "",
      value: component?.value || "",
      tolerance: component?.tolerance || "",
      powerRating: component?.powerRating || "",
      voltageRating: component?.voltageRating || "",
      packageCase: component?.packageCase || "",
      manufacturer: component?.manufacturer || "",
      datasheetUrl: component?.datasheetUrl || "",
      productUrl: component?.productUrl || "",
      minimumStock: component?.minimumStock ?? "",
      reorderQuantity: component?.reorderQuantity ?? "",
      categoryId: component?.categoryId || component?.category?.id || "",
      supplierId: component?.supplierId || component?.supplier?.id || "",
      storageLocationId:
        component?.storageLocationId ||
        component?.storageLocation?.id ||
        component?.locationId ||
        component?.location?.id ||
        ""
    });
  }

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  function updateEditForm(field, value) {
    setEditForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  function cleanString(value) {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return String(value).trim();
  }

  function toNumberOrUndefined(value) {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? undefined : numberValue;
  }

  function toIdOrUndefined(value) {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? undefined : numberValue;
  }

  function removeUndefined(payload) {
    const cleaned = { ...payload };

    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined) {
        delete cleaned[key];
      }
    });

    return cleaned;
  }

  function buildCamelPayload() {
    return removeUndefined({
      manufacturerPartNumber: cleanString(editForm.manufacturerPartNumber),
      internalSku: cleanString(editForm.internalSku),
      name: cleanString(editForm.name),
      description: cleanString(editForm.description),
      value: cleanString(editForm.value),
      tolerance: cleanString(editForm.tolerance),
      powerRating: cleanString(editForm.powerRating),
      voltageRating: cleanString(editForm.voltageRating),
      packageCase: cleanString(editForm.packageCase),
      manufacturer: cleanString(editForm.manufacturer),
      datasheetUrl: cleanString(editForm.datasheetUrl),
      productUrl: cleanString(editForm.productUrl),
      minimumStock: toNumberOrUndefined(editForm.minimumStock),
      reorderQuantity: toNumberOrUndefined(editForm.reorderQuantity),
      categoryId: toIdOrUndefined(editForm.categoryId),
      supplierId: toIdOrUndefined(editForm.supplierId),
      storageLocationId: toIdOrUndefined(editForm.storageLocationId)
    });
  }

  function buildSnakePayload() {
    return removeUndefined({
      manufacturer_part_number: cleanString(editForm.manufacturerPartNumber),
      internal_sku: cleanString(editForm.internalSku),
      name: cleanString(editForm.name),
      description: cleanString(editForm.description),
      value: cleanString(editForm.value),
      tolerance: cleanString(editForm.tolerance),
      power_rating: cleanString(editForm.powerRating),
      voltage_rating: cleanString(editForm.voltageRating),
      package_case: cleanString(editForm.packageCase),
      manufacturer: cleanString(editForm.manufacturer),
      datasheet_url: cleanString(editForm.datasheetUrl),
      product_url: cleanString(editForm.productUrl),
      minimum_stock: toNumberOrUndefined(editForm.minimumStock),
      reorder_quantity: toNumberOrUndefined(editForm.reorderQuantity),
      category_id: toIdOrUndefined(editForm.categoryId),
      supplier_id: toIdOrUndefined(editForm.supplierId),
      storage_location_id: toIdOrUndefined(editForm.storageLocationId)
    });
  }

  async function saveComponent(event) {
    event.preventDefault();

    setSaving(true);

    try {
      const camelPayload = buildCamelPayload();

      try {
        await endpoints.components.update(id, camelPayload);
      } catch (error) {
        if (error?.response?.status !== 422) {
          throw error;
        }

        await endpoints.components.update(id, buildSnakePayload());
      }

      toast("Komponent bilgileri güncellendi", "success");

      setEditing(false);
      load();
    } catch (error) {
      toast(apiError(error), "error");
    } finally {
      setSaving(false);
    }
  }

  async function enrichComponent() {
    try {
      const result = unwrap(
        await endpoints.components.enrich(id, {
          force: false
        })
      );

      toast(
        `Enrichment tamamlandı: ${
          result?.enrichment?.best?.source || "provider"
        }`,
        "success"
      );

      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  async function doMove(type) {
    try {
      const payload = {
        ...movement,
        quantity: Number(movement.quantity)
      };

      if (type === "in") {
        await endpoints.components.stockIn(id, payload);
      }

      if (type === "out") {
        await endpoints.components.stockOut(id, payload);
      }

      if (type === "reserve") {
        await endpoints.components.reserve(id, payload);
      }

      if (type === "release") {
        await endpoints.components.release(id, payload);
      }

      toast("Stok işlemi tamamlandı", "success");

      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const movements = item?.stockMovements || [];

  const columns = [
    {
      key: "type",
      header: "Tip",
      render: (row) => <span className="chip">{row.movementType}</span>
    },
    {
      key: "quantity",
      header: "Adet"
    },
    {
      key: "before",
      header: "Önce",
      render: (row) => row.quantityBefore
    },
    {
      key: "after",
      header: "Sonra",
      render: (row) => row.quantityAfter
    },
    {
      key: "date",
      header: "Tarih",
      render: (row) => formatDate(row.createdAt)
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Component Detail"
        title={item?.manufacturerPartNumber || "Komponent"}
        description={
          item?.description ||
          item?.name ||
          "Teknik detay, stok ve proje kullanım bilgileri."
        }
        actions={
          <>
            <button className="btn-primary" onClick={enrichComponent}>
              <Sparkles className="h-4 w-4" />
              Enrich
            </button>

            <button
              className={editing ? "btn-ghost" : "btn-primary"}
              onClick={() => {
                if (editing) {
                  fillEditForm(item);
                }

                setEditing((value) => !value);
              }}
            >
              {editing ? (
                <>
                  <X className="h-4 w-4" />
                  İptal
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Düzenle
                </>
              )}
            </button>

            <Link className="btn-ghost" href="/components">
              Listeye Dön
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="page-card grid gap-4 p-5 md:grid-cols-4">
            <Info label="SKU" value={item?.internalSku} />

            <Info
              label="Kategori"
              value={
                item?.category?.nameTr ||
                item?.category?.name_tr ||
                item?.category?.name ||
                "-"
              }
            />

            <Info label="Paket" value={item?.packageCase} />

            <Info
              label="Durum"
              value={<StatusBadge status={stockStatus(item)} />}
            />
          </div>

          {editing ? (
            <form onSubmit={saveComponent} className="page-card p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black">
                    Komponent Bilgilerini Düzenle
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ürün, teknik bilgi, kategori, tedarikçi ve lokasyon
                    alanlarını buradan güncelle.
                  </p>
                </div>

                <button className="btn-primary" disabled={saving} type="submit">
                  <Save className="h-4 w-4" />
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Part Number"
                  value={editForm.manufacturerPartNumber}
                  onChange={(value) =>
                    updateEditForm("manufacturerPartNumber", value)
                  }
                />

                <Field
                  label="SKU"
                  value={editForm.internalSku}
                  onChange={(value) => updateEditForm("internalSku", value)}
                />

                <Field
                  label="Ad"
                  value={editForm.name}
                  onChange={(value) => updateEditForm("name", value)}
                />

                <Field
                  label="Değer"
                  value={editForm.value}
                  onChange={(value) => updateEditForm("value", value)}
                />

                <Field
                  label="Paket / Kılıf"
                  value={editForm.packageCase}
                  onChange={(value) => updateEditForm("packageCase", value)}
                />

                <Field
                  label="Üretici"
                  value={editForm.manufacturer}
                  onChange={(value) => updateEditForm("manufacturer", value)}
                />

                <Field
                  label="Tolerans"
                  value={editForm.tolerance}
                  onChange={(value) => updateEditForm("tolerance", value)}
                />

                <Field
                  label="Güç"
                  value={editForm.powerRating}
                  onChange={(value) => updateEditForm("powerRating", value)}
                />

                <Field
                  label="Voltaj"
                  value={editForm.voltageRating}
                  onChange={(value) => updateEditForm("voltageRating", value)}
                />

                <Field
                  label="Minimum Stok"
                  type="number"
                  value={editForm.minimumStock}
                  onChange={(value) => updateEditForm("minimumStock", value)}
                />

                <Field
                  label="Tekrar Sipariş"
                  type="number"
                  value={editForm.reorderQuantity}
                  onChange={(value) => updateEditForm("reorderQuantity", value)}
                />

                <ListBoxField
                  label="Kategori"
                  value={editForm.categoryId}
                  onChange={(value) => updateEditForm("categoryId", value)}
                  options={categories}
                  placeholder="Kategori seç"
                />

                <ListBoxField
                  label="Tedarikçi"
                  value={editForm.supplierId}
                  onChange={(value) => updateEditForm("supplierId", value)}
                  options={suppliers}
                  placeholder="Tedarikçi seç"
                />

                <ListBoxField
                  label="Lokasyon"
                  value={editForm.storageLocationId}
                  onChange={(value) =>
                    updateEditForm("storageLocationId", value)
                  }
                  options={locations}
                  placeholder="Lokasyon seç"
                />

                <Field
                  label="Datasheet URL"
                  value={editForm.datasheetUrl}
                  onChange={(value) => updateEditForm("datasheetUrl", value)}
                />

                <Field
                  label="Ürün URL"
                  value={editForm.productUrl}
                  onChange={(value) => updateEditForm("productUrl", value)}
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Açıklama
                </label>

                <textarea
                  className="input min-h-28"
                  value={editForm.description}
                  onChange={(event) =>
                    updateEditForm("description", event.target.value)
                  }
                  placeholder="Komponent açıklaması"
                />
              </div>
            </form>
          ) : (
            <div className="page-card p-5">
              <h2 className="mb-4 text-lg font-black">
                Teknik Bilgiler
              </h2>

              <div className="grid gap-4 md:grid-cols-3">
                <Info label="Değer" value={item?.value} />
                <Info label="Tolerans" value={item?.tolerance} />
                <Info label="Güç" value={item?.powerRating} />
                <Info label="Voltaj" value={item?.voltageRating} />
                <Info label="Üretici" value={item?.manufacturer} />

                <Info
                  label="Tedarikçi"
                  value={
                    item?.supplier?.nameTr ||
                    item?.supplier?.name_tr ||
                    item?.supplier?.name ||
                    "-"
                  }
                />

                <Info
                  label="Lokasyon"
                  value={
                    item?.storageLocation?.nameTr ||
                    item?.storageLocation?.name_tr ||
                    item?.storageLocation?.name ||
                    item?.location?.nameTr ||
                    item?.location?.name_tr ||
                    item?.location?.name ||
                    "-"
                  }
                />

                <Info
                  label="Datasheet"
                  value={
                    item?.datasheetUrl ? (
                      <a
                        className="text-brand-500"
                        href={item.datasheetUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Aç
                      </a>
                    ) : (
                      "-"
                    )
                  }
                />

                <Info
                  label="Ürün URL"
                  value={
                    item?.productUrl ? (
                      <a
                        className="text-brand-500"
                        href={item.productUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Aç
                      </a>
                    ) : (
                      "-"
                    )
                  }
                />
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-lg font-black">
              Stok Hareketleri
            </h2>

            <DataTable
              columns={columns}
              rows={movements}
              loading={loading}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="page-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <PackageCheck className="h-5 w-5 text-brand-500" />
              Stok Durumu
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <Mini label="Toplam" value={formatNumber(item?.quantityTotal)} />
              <Mini
                label="Mevcut"
                value={formatNumber(item?.quantityAvailable)}
              />
              <Mini
                label="Rezerve"
                value={formatNumber(item?.quantityReserved)}
              />
            </div>

            <div className="mt-5 space-y-3">
              <input
                className="input"
                type="number"
                min="1"
                value={movement.quantity}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    quantity: event.target.value
                  })
                }
              />

              <input
                className="input"
                value={movement.reason}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    reason: event.target.value
                  })
                }
                placeholder="Sebep"
              />

              <textarea
                className="input min-h-20"
                value={movement.notes}
                onChange={(event) =>
                  setMovement({
                    ...movement,
                    notes: event.target.value
                  })
                }
                placeholder="Not"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn-primary" onClick={() => doMove("in")}>
                <Save className="h-4 w-4" />
                Giriş
              </button>

              <button className="btn-ghost" onClick={() => doMove("out")}>
                Çıkış
              </button>

              <button className="btn-ghost" onClick={() => doMove("reserve")}>
                Rezerve
              </button>

              <button className="btn-ghost" onClick={() => doMove("release")}>
                Bırak
              </button>
            </div>
          </div>

          <div className="page-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <FileText className="h-5 w-5 text-brand-500" />
              Datasheet
            </h2>

            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div>
                Aktif kaynak:{" "}
                <span className="font-bold">
                  {datasheet?.provider?.name || "-"}
                </span>
              </div>

              {datasheet?.url ? (
                <a
                  className="btn-ghost mt-3 w-full"
                  href={datasheet.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Datasheet Aç
                </a>
              ) : null}
            </div>
          </div>

          {item ? <LabelPrintPanel component={item} compact /> : null}
        </aside>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <input
        className="input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ListBoxField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seç"
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (option) => String(option.id) === String(value)
  );

  return (
    <div className="relative">
      <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-left text-sm font-semibold text-slate-900 outline-none transition hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-500"
      >
        <span className={selected ? "" : "text-slate-500"}>
          {selected ? getOptionLabel(selected) : placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Dropdown kapat"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-2xl shadow-black/20 dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/40">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {placeholder}
            </button>

            {options.length ? (
              options.map((option) => {
                const active = String(option.id) === String(value);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(String(option.id));
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-brand-500 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <span>{getOptionLabel(option)}</span>

                    {active ? (
                      <span className="text-xs font-black">
                        ✓
                      </span>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-sm text-slate-500">
                Kayıt bulunamadı
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function getOptionLabel(option) {
  return (
    option?.nameTr ||
    option?.name_tr ||
    option?.name ||
    option?.nameEn ||
    option?.name_en ||
    option?.code ||
    option?.slug ||
    `#${option?.id}`
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-bold text-slate-900 dark:text-white">
        {value || "-"}
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900">
      <div className="text-xs text-slate-500">
        {label}
      </div>

      <div className="text-xl font-black">
        {value}
      </div>
    </div>
  );
}