"use client";

import SettingsSection from "../../../components/forms/SettingsSection";

const fields = [
  {
    name: "companyName",
    label: "Firma / Proje adı",
    defaultValue: "ReelManager",
  },
  {
    name: "currency",
    label: "Varsayılan para birimi",
    defaultValue: "TRY",
  },
  {
    name: "lowStockLimit",
    label: "Varsayılan düşük stok limiti",
    defaultValue: "20",
  },
];

export default function Page() {
  return (
    <SettingsSection
      title="Genel Sistem"
      description="Firma, para birimi ve varsayılan stok ayarları."
      fields={fields}
    />
  );
}