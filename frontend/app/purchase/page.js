"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";

import { apiError, endpoints, unwrap } from "../../lib/api";
import { buildPurchaseLinks } from "../../lib/purchase-link";
import { useUI } from "../../components/providers/Providers";

export default function PurchasePage() {
  const { toast } = useUI();

  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    try {
      const res = await endpoints.stock.low();
      const data = unwrap(res);

      setItems(data?.items || data?.components || data || []);
    } catch (e) {
      toast(apiError(e), "error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="REEL MANAGER - PURCHASING"
        title="Satın Alma Listesi"
        description="Eksik ve düşük stoktaki ürünler için tedarik bağlantıları oluştur."
        actions={
          <button className="btn-primary" onClick={load}>
            <Search className="h-4 w-4" />
            Yenile
          </button>
        }
      />

      <section className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-widest text-slate-500 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-4">Komponent</th>
                <th className="px-4 py-4">Değer</th>
                <th className="px-4 py-4">Paket</th>
                <th className="px-4 py-4">Mevcut</th>
                <th className="px-4 py-4">Minimum</th>
                <th className="px-4 py-4">Satın Al</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.length ? (
                items.map((c) => (
                  <tr key={c.id} className="bg-white dark:bg-slate-950">
                    <td className="px-4 py-4">
                      <div className="font-semibold dark:text-white">
                        {c.manufacturerPartNumber || c.name}
                      </div>

                      <div className="font-mono text-xs text-slate-400">
                        {c.internalSku}
                      </div>
                    </td>

                    <td className="px-4 py-4">{c.value || "-"}</td>
                    <td className="px-4 py-4">{c.packageCase || "-"}</td>
                    <td className="px-4 py-4">{c.quantityAvailable ?? 0}</td>
                    <td className="px-4 py-4">{c.minimumStock ?? 0}</td>

                    <td className="px-4 py-4">
                      <button
                        className="btn-primary"
                        onClick={() => setSelected(c)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Satın Al
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-slate-500"
                  >
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected ? (
        <PurchaseModal
          component={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </AppShell>
  );
}

function PurchaseModal({ component, onClose }) {
  const links = buildPurchaseLinks(component);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold dark:text-white">
              Satın Alma Kaynakları
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {component.manufacturerPartNumber || component.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                l.primary
                  ? "border-blue-300 bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              }`}
            >
              <span>
                <span className="block font-semibold dark:text-white">
                  {l.label}
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  {l.description}
                </span>
              </span>

              <ExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}