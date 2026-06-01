"use client";

import { useRouter } from "next/navigation";

import AppShell from "../../../components/layout/AppShell";
import UserForm from "../../../components/forms/UserForm";

export default function NewUserPage() {
  const router = useRouter();

  return (
    <AppShell>
      <UserForm
        mode="create"
        onSaved={() => router.push("/users")}
      />
    </AppShell>
  );
}