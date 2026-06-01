"use client";

import { useRouter } from "next/navigation";

import AppShell from "../../../components/layout/AppShell";
import MasterDataForm from "../../../components/forms/MasterDataForm";

import { endpoints } from "../../../lib/api";

export default function NewPage() {
  const router = useRouter();

  return (
    <AppShell>
      <MasterDataForm
        mode="create"
        title="Yeni Lokasyon"
        backHref="/locations"
        endpoint={endpoints.locations}
        type="location"
        onSaved={() => router.push("/locations")}
      />
    </AppShell>
  );
}