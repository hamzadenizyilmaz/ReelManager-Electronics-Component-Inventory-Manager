"use client";

import MasterDataListPage from "../../components/pages/MasterDataListPage";

import { endpoints } from "../../lib/api";

export default function CategoriesPage() {
  return (
    <MasterDataListPage
      title="Kategoriler"
      description="Komponent kategorilerini yönetin."
      newHref="/categories/new"
      baseHref="/categories"
      endpoint={endpoints.categories}
      type="category"
    />
  );
}