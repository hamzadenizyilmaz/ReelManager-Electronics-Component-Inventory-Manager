"use client";

import AppShell from "../../components/layout/AppShell";
import ResourceManager from "../../components/forms/ResourceManager";

import { endpoints } from "../../lib/api";

export default function Page() {
  return (
    <AppShell>
      <ResourceManager
        title="Lokasyonlar"
        description="Raf, kutu, reel box ve bölme isimleri TR/EN ayrımıyla yönetilir."
        resource="Lokasyon"
        endpoint={endpoints.locations}
        fields={[
          {
            name: "name",
            label: "Teknik Ad"
          },
          {
            name: "name_tr",
            label: "Ad TR"
          },
          {
            name: "name_en",
            label: "Name EN"
          },
          {
            name: "code",
            label: "Kod"
          },
          {
            name: "description_tr",
            label: "Açıklama TR",
            type: "textarea"
          },
          {
            name: "description_en",
            label: "Description EN",
            type: "textarea"
          }
        ]}
      />
    </AppShell>
  );
}