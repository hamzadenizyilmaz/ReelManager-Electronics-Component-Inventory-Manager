"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Search } from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/ui/PageHeader";

import { endpoints, unwrap } from "../../lib/api";
import { useUI } from "../../components/providers/Providers";

export default function Page() {
  const router = useRouter();
  const { toast } = useUI();

  const scannerRef = useRef(null);

  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);

  async function lookup(value) {
    if (!value) return;

    try {
      const data = unwrap(await endpoints.components.barcode(value));

      router.push(`/components/${data.id}`);
    } catch (error) {
      toast(
        "Kayıt bulunamadı, yeni komponent ekranına yönlendiriliyor",
        "warning"
      );

      router.push(`/components/new?barcode=${encodeURIComponent(value)}`);
    }
  }

  useEffect(() => {
    let html5QrCode;

    async function start() {
      if (!active) return;

      try {
        const mod = await import("html5-qrcode");

        html5QrCode = new mod.Html5Qrcode("qr-reader");

        await html5QrCode.start(
          {
            facingMode: "environment"
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250
            }
          },
          (decoded) => {
            setActive(false);
            setCode(decoded);
            lookup(decoded);
          },
          () => {}
        );

        scannerRef.current = html5QrCode;
      } catch (error) {
        toast(`Kamera başlatılamadı: ${error.message}`, "error");
      }
    }

    start();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [active]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Mobile Ready"
        title="QR / Barkod Okuyucu"
        description="Mobil kamera ile SKU, QR veya barkod okuyup komponent detayına hızlı geç."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="page-card min-h-[420px] p-5">
          <div
            id="qr-reader"
            className="overflow-hidden rounded-3xl"
          />

          {!active ? (
            <button
              className="btn-primary mt-4"
              onClick={() => setActive(true)}
            >
              <Camera className="h-4 w-4" />
              Kamerayı Aç
            </button>
          ) : (
            <button
              className="btn-ghost mt-4"
              onClick={() => setActive(false)}
            >
              Durdur
            </button>
          )}
        </div>

        <div className="page-card p-5">
          <h2 className="text-lg font-black">
            Manuel Arama
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Kamera yoksa veya okutma başarısızsa kodu elle gir.
          </p>

          <input
            className="input mt-4"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="CMP-R7K2M9QA veya barkod"
          />

          <button
            className="btn-primary mt-3 w-full"
            onClick={() => lookup(code)}
          >
            <Search className="h-4 w-4" />
            Ara
          </button>
        </div>
      </div>
    </AppShell>
  );
}