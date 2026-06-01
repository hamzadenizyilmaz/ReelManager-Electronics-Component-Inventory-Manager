"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ExternalLink,
  FileText,
  PackageCheck,
  Save,
  Search,
  Sparkles,
} from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import DataTable from "../../../components/tables/DataTable";
import LabelPrintPanel from "../../../components/labels/LabelPrintPanel";

import { apiError, endpoints, unwrap } from "../../../lib/api";
import { formatDate, formatNumber, stockStatus } from "../../../lib/formatters";
import {
  buildPurchaseLinks,
  buildPurchaseQuery,
} from "../../../lib/purchase-link";

import { useUI } from "../../../components/providers/Providers";

export default function ComponentDetailPage() {
  const { id } = useParams();
  const { toast } = useUI();

  const [item, setItem] = useState(null);
  const [movement, setMovement] = useState({
    quantity: 1,
    reason: "Manual",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [datasheet, setDatasheet] = useState(null);
  const [fallbackLinks, setFallbackLinks] = useState([]);
  const [autoSearching, setAutoSearching] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const comp = unwrap(await endpoints.components.get(id));

      setItem(comp);

      const links = buildPurchaseLinks(comp || {});
      setFallbackLinks(links);

      try {
        const ds = unwrap(await endpoints.components.datasheet(id));
        setDatasheet(ds);
      } catch {
        setDatasheet(null);
      }
    } catch (e) {
      toast(apiError(e), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (item && !item.datasheetUrl && !datasheet?.url) {
      autoFindDatasheet(false);
    }
  }, [item?.id]);

  async function autoFindDatasheet(showToast = true) {
    if (!item) return;

    setAutoSearching(true);

    try {
      const mpn =
        item.manufacturerPartNumber ||
        item.supplierPartNumber ||
        item.name ||
        buildPurchaseQuery(item);

      const result = unwrap(
        await endpoints.datasheets.enrich(mpn, {
          manualUrl: item.datasheetUrl || "",
        })
      );

      const best =
        result?.best ||
        result?.enrichment?.best ||
        result?.items?.[0] ||
        result;

      if (best?.datasheetUrl || best?.datasheet_url || best?.url) {
        setDatasheet({
          url: best.datasheetUrl || best.datasheet_url || best.url,
          provider: {
            name: best.source || "Auto Enrichment",
          },
        });

        if (showToast) {
          toast("Datasheet kaynağı bulundu", "success");
        }
      } else if (showToast) {
        toast(
          "Datasheet bulunamadı, satın alma arama linkleri hazırlandı",
          "info"
        );
      }
    } catch (e) {
      if (showToast) {
        toast(apiError(e, "Datasheet aranamadı"), "error");
      }
    } finally {
      setAutoSearching(false);
    }
  }

  async function enrichComponent() {
    try {
      const result = unwrap(
        await endpoints.components.enrich(id, {
          force: false,
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
        quantity: Number(movement.quantity),
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
    } catch (e) {
      toast(apiError(e), "error");
    }
  }

  const movements = item?.stockMovements || [];

  const columns = [
    {
      key: "type",
      header: "Tip",
      render: (r) => <span className="chip">{r.movementType}</span>,
    },
    {
      key: "quantity",
      header: "Adet",
    },
    {
      key: "before",
      header: "Önce",
      render: (r) => r.quantityBefore,
    },
    {
      key: "after",
      header: "Sonra",
      render: (r) => r.quantityAfter,
    },
    {
      key: "date",
      header: "Tarih",
      render: (r) => formatDate(r.createdAt),
    },
  ];

  const bestDatasource = datasheet?.url || item?.datasheetUrl;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Component Detail"
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

            <Link className="btn-ghost" href={`/components/${id}/edit`}>
              Düzenle
            </Link>

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
              value={item?.category?.name || item?.category?.nameTr}
            />

            <Info label="Paket" value={item?.packageCase} />

            <Info
              label="Durum"
              value={<StatusBadge status={stockStatus(item)} />}
            />
          </div>

          <div className="page-card p-5">
            <h2 className="mb-4 text-lg font-semibold">Teknik Bilgiler</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Değer" value={item?.value} />
              <Info label="Tolerans" value={item?.tolerance} />
              <Info label="Güç" value={item?.powerRating} />
              <Info label="Voltaj" value={item?.voltageRating} />
              <Info label="Üretici" value={item?.manufacturer} />

              <Info
                label="Tedarikçi"
                value={item?.supplier?.name || item?.supplier?.nameTr}
              />

              <Info
                label="Lokasyon"
                value={
                  item?.storageLocation?.name || item?.storageLocation?.nameTr
                }
              />

              <Info
                label="Datasheet"
                value={
                  bestDatasource ? (
                    <a
                      className="text-brand-500"
                      href={bestDatasource}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Aç
                    </a>
                  ) : (
                    "Aranıyor / bulunamadı"
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
                    "Otomatik linkler sağda"
                  )
                }
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Stok Hareketleri</h2>

            <DataTable
              columns={columns}
              rows={movements}
              loading={loading}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="page-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
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
                onChange={(e) =>
                  setMovement({
                    ...movement,
                    quantity: e.target.value,
                  })
                }
              />

              <input
                className="input"
                value={movement.reason}
                onChange={(e) =>
                  setMovement({
                    ...movement,
                    reason: e.target.value,
                  })
                }
                placeholder="Sebep"
              />

              <textarea
                className="input min-h-20"
                value={movement.notes}
                onChange={(e) =>
                  setMovement({
                    ...movement,
                    notes: e.target.value,
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
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 text-brand-500" />
              Datasheet
            </h2>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div>
                Aktif kaynak:{" "}
                <span className="font-bold">
                  {datasheet?.provider?.name ||
                    (item?.datasheetUrl ? "Manual URL" : "Otomatik arama")}
                </span>
              </div>

              {bestDatasource ? (
                <a
                  className="btn-ghost w-full"
                  href={bestDatasource}
                  target="_blank"
                  rel="noreferrer"
                >
                  Datasheet Aç
                </a>
              ) : (
                <button
                  className="btn-primary w-full"
                  onClick={() => autoFindDatasheet(true)}
                  disabled={autoSearching}
                >
                  <Search className="h-4 w-4" />
                  {autoSearching ? "Aranıyor..." : "Datasheet Bul"}
                </button>
              )}
            </div>
          </div>

          <div className="page-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <ExternalLink className="h-5 w-5 text-brand-500" />
              Satın Alma / Arama
            </h2>

            <div className="space-y-3">
              {fallbackLinks.slice(0, 6).map((l) => (
                <a
                  key={l.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{l.label}</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {item ? <LabelPrintPanel component={item} compact /> : null}
        </aside>
      </div>
    </AppShell>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value || "-"}
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-900">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}