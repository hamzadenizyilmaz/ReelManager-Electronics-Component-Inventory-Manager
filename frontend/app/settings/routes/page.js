"use client";

import SettingsSection from "../../../components/forms/SettingsSection";

const fields = [
  {
    name: "defaultRoute",
    storageKey: "reelmanager_default_route",
    label: "Login sonrası açılacak sayfa",
    type: "select",
    defaultValue: "/dashboard",
    options: [
      {
        value: "/dashboard",
        label: "Dashboard",
      },
      {
        value: "/components",
        label: "Komponentler",
      },
      {
        value: "/projects",
        label: "Projeler / BOM",
      },
      {
        value: "/low-stock",
        label: "Düşük Stok",
      },
      {
        value: "/purchase",
        label: "Satın Alma",
      },
      {
        value: "/labels",
        label: "Etiketler",
      },
      {
        value: "/activity",
        label: "Aktivite Logları",
      },
      {
        value: "/users",
        label: "Kullanıcılar",
      },
      {
        value: "/settings",
        label: "Ayarlar",
      },
    ],
  },
];

export default function Page() {
  return (
    <SettingsSection
      title="Login Sonrası Yol Seçme"
      description="Kullanıcı giriş yaptığında otomatik açılacak başlangıç sayfasını seçin."
      fields={fields}
    />
  );
}