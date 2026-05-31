"use client";

import AppShell from "../../components/layout/AppShell";
import ResourceManager from "../../components/forms/ResourceManager";

import { endpoints } from "../../lib/api";

export default function Page() {
  return (
    <AppShell>
      <ResourceManager
        title="Tedarikçiler"
        description="Tedarikçi datası, iletişim bilgileri ve TR/EN görünen ad alanları."
        resource="Tedarikçi"
        endpoint={endpoints.suppliers}
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
            name: "website",
            label: "Website"
          },
          {
            name: "contactName",
            label: "Yetkili"
          },
          {
            name: "contactEmail",
            label: "Email"
          },
          {
            name: "phone",
            label: "Telefon"
          },
          {
            name: "notes",
            label: "Notlar",
            type: "textarea"
          }
        ]}
      />
    </AppShell>
  );
}