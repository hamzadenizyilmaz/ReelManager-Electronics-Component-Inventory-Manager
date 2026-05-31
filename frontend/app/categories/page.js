"use client";

import AppShell from "../../components/layout/AppShell";
import ResourceManager from "../../components/forms/ResourceManager";

import { endpoints } from "../../lib/api";

export default function Page() {
  return (
    <AppShell>
      <ResourceManager
        title="Kategoriler"
        description="TR/EN ayrılmış kategori verisi: teknik kod sabit, görünen ad dile göre yönetilir."
        resource="Kategori"
        endpoint={endpoints.categories}
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
            name: "slug",
            label: "Slug"
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