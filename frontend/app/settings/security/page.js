"use client";

import SettingsSection from "../../../components/forms/SettingsSection";

const fields = [
  {
    name: "sessionPolicy",
    label: "Oturum politikası",
    type: "select",
    defaultValue: "strict",
    options: [
      {
        value: "strict",
        label: "Sıkı koruma",
      },
      {
        value: "standard",
        label: "Standart",
      },
      {
        value: "relaxed",
        label: "Esnek",
      },
    ],
  },
  {
    name: "autoLogout",
    label: "Otomatik çıkış süresi (dk)",
    defaultValue: "120",
  },
  {
    name: "passwordPolicy",
    label: "Parola politikası",
    type: "select",
    defaultValue: "strong",
    options: [
      {
        value: "strong",
        label: "Güçlü parola zorunlu",
      },
      {
        value: "medium",
        label: "Orta seviye",
      },
      {
        value: "custom",
        label: "Özel politika",
      },
    ],
  },
  {
    name: "mfaRequired",
    label: "MFA zorunluluğu",
    type: "select",
    defaultValue: "no",
    options: [
      {
        value: "no",
        label: "Kapalı",
      },
      {
        value: "admin",
        label: "Sadece admin",
      },
      {
        value: "all",
        label: "Tüm kullanıcılar",
      },
    ],
  },
  {
    name: "rateLimit",
    label: "Dakikalık istek limiti",
    defaultValue: "300",
  },
  {
    name: "auditLevel",
    label: "Log seviyesi",
    type: "select",
    defaultValue: "full",
    options: [
      {
        value: "full",
        label: "Tüm istekler",
      },
      {
        value: "write",
        label: "Sadece değişiklikler",
      },
      {
        value: "security",
        label: "Güvenlik odaklı",
      },
    ],
  },
];

export default function Page() {
  return (
    <SettingsSection
      title="Güvenlik Politikaları"
      description="Oturum, parola, MFA, rate limit ve audit log seviyesini yönetin."
      fields={fields}
    />
  );
}