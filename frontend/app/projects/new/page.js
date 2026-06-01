"use client";

import { useRouter } from "next/navigation";

import AppShell from "../../../components/layout/AppShell";
import ProjectForm from "../../../components/forms/ProjectForm";

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <AppShell>
      <ProjectForm
        mode="create"
        onSaved={() => router.push("/projects")}
      />
    </AppShell>
  );
}