"use client";

import MasterDataListPage from "../../components/pages/MasterDataListPage";

import { endpoints } from "../../lib/api";

export default function SuppliersPage() {
  return (
    <MasterDataListPage
      title="Tedarikçiler"
      description="Tedarikçi kayıtlarını tek sayfadan yönetin."
      newHref="/suppliers/new"
      baseHref="/suppliers"
      endpoint={endpoints.suppliers}
      type="supplier"
    />
  );
}