"use client";

import MasterDataListPage from "../../components/pages/MasterDataListPage";

import { endpoints } from "../../lib/api";

export default function LocationsPage() {
  return (
    <MasterDataListPage
      title="Lokasyonlar"
      description="Raf, kutu, bölme ve depolama alanlarını yönetin."
      newHref="/locations/new"
      baseHref="/locations"
      endpoint={endpoints.locations}
      type="location"
    />
  );
}