"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Save,
  Usb,
  Cable,
} from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";

import {
  discoverSerialPrinter,
  discoverUsbPrinter,
} from "../../../lib/printer-discovery";

import { useUI } from "../../../components/providers/Providers";

const profiles = [
  ["thermal-50x25", "Thermal 50 × 25 mm"],
  ["thermal-40x30", "Thermal 40 × 30 mm"],
  ["brother-dk11201", "Brother DK-11201"],
  ["dymo-89x36", "DYMO 89 × 36 mm"],
  ["zebra-zpl", "Zebra / ZPL Raw"],
];

export default function PrinterSettingsPage() {
  const { toast } = useUI();

  const [selected, setSelected] = useState(null);
  const [profile, setProfile] = useState("thermal-50x25");

  useEffect(() => {
    setSelected(
      JSON.parse(localStorage.getItem("reelmanager_selected_printer") || "null")
    );

    setProfile(
      localStorage.getItem("reelmanager_label_profile") || "thermal-50x25"
    );
  }, []);

  async function usb() {
    try {
      const d = await discoverUsbPrinter();

      if (d) {
        setSelected(d);

        localStorage.setItem(
          "reelmanager_selected_printer",
          JSON.stringify(d)
        );

        toast("USB yazıcı seçildi", "success");
      }
    } catch (e) {
      toast(e.message || "USB yazıcı seçilemedi", "error");
    }
  }

  async function serial() {
    try {
      const d = await discoverSerialPrinter();

      if (d) {
        setSelected(d);

        localStorage.setItem(
          "reelmanager_selected_printer",
          JSON.stringify(d)
        );

        toast("Serial yazıcı seçildi", "success");
      }
    } catch (e) {
      toast(e.message || "Serial yazıcı seçilemedi", "error");
    }
  }

  function save() {
    localStorage.setItem("reelmanager_label_profile", profile);
    toast("Yazıcı ayarları kaydedildi", "success");
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="ReelManager - Label Print Center"
        title="Yazıcı ve Etiket Ayarları"
        description="USB, Serial veya tarayıcı yazdırma akışıyla kullanılan etiket yazıcı profilini seçin. Tarayıcı güvenliği nedeniyle cihaz seçimi kullanıcı izniyle yapılır."
        actions={
          <Link className="btn-ghost" href="/settings">
            <ArrowLeft className="h-4 w-4" />
            Ayarlar
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="page-card p-5 sm:p-6">
          <h2 className="mb-5 text-xl font-semibold">Cihaz Seçimi</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="btn-primary" onClick={usb}>
              <Usb className="h-4 w-4" />
              USB Yazıcı Seç
            </button>

            <button className="btn-ghost" onClick={serial}>
              <Cable className="h-4 w-4" />
              Serial Yazıcı Seç
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="text-sm font-semibold">Seçili cihaz</div>

            <pre className="mt-2 overflow-auto text-xs text-slate-600 dark:text-slate-300">
              {selected
                ? JSON.stringify(selected, null, 2)
                : "Henüz cihaz seçilmedi. Browser print veya ZPL kopyalama kullanılabilir."}
            </pre>
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="field-label">Etiket profili</span>

              <select
                className="input"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                {profiles.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn-primary" onClick={save}>
              <Save className="h-4 w-4" />
              Kaydet
            </button>
          </div>
        </section>

        <aside className="page-card p-5 sm:p-6">
          <Printer className="mb-4 h-8 w-8 text-brand-600" />

          <h2 className="text-xl font-semibold">Destek Notu</h2>

          <p className="mt-2 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            Chrome/Edge WebUSB ve WebSerial destekler. Firefox/Safari kısıtlı
            olabilir. Zebra, TSC, Godex ve Argox cihazlarda ZPL/TSPL raw çıktı
            için cihaz sürücüsü veya bridge uygulaması gerekebilir.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}