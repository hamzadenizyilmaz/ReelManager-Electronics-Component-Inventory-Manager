"use client";

import { useParams } from "next/navigation";

import MasterDataDetailPage from "../../../components/pages/MasterDataDetailPage";

import { endpoints } from "../../../lib/api";

export default function DetailPage() {
  const { slug } = useParams();

  return (
    <MasterDataDetailPage
      slug={slug}
      endpoint={endpoints.suppliers}
      baseHref="/suppliers"
      title="Tedarikçi Detayı"
    />
  );
}