"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Plus } from "lucide-react";

import AppShell from "../../../components/layout/AppShell";
import PageHeader from "../../../components/ui/PageHeader";
import DataTable from "../../../components/tables/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";

import { endpoints, unwrap, apiError } from "../../../lib/api";
import { downloadWithToken } from "../../../lib/formatters";
import { useUI } from "../../../components/providers/Providers";

export default function Page() {
  const { id } = useParams();
  const { toast } = useUI();

  const [project, setProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [check, setCheck] = useState([]);

  const [form, setForm] = useState({
    component_id: "",
    reference_designator: "",
    required_quantity: 1,
    notes: ""
  });

  async function load() {
    try {
      const projectData = unwrap(await endpoints.projects.get(id));
      const componentsData = unwrap(
        await endpoints.components.list({
          limit: 100
        })
      );

      setProject(projectData);
      setComponents(componentsData.items || []);
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function add(event) {
    event.preventDefault();

    try {
      await endpoints.projects.addBom(id, {
        ...form,
        component_id: Number(form.component_id),
        required_quantity: Number(form.required_quantity)
      });

      toast("BOM eklendi", "success");

      setForm({
        component_id: "",
        reference_designator: "",
        required_quantity: 1,
        notes: ""
      });

      load();
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  async function checkStock() {
    try {
      const stockCheckData = unwrap(await endpoints.projects.checkStock(id));

      setCheck(stockCheckData || []);
      toast("Stok kontrol edildi", "success");
    } catch (error) {
      toast(apiError(error), "error");
    }
  }

  const cols = [
    {
      key: "ref",
      header: "Ref",
      render: (row) => row.referenceDesignator || "-"
    },
    {
      key: "pn",
      header: "Part",
      render: (row) => row.component?.manufacturerPartNumber || "-"
    },
    {
      key: "value",
      header: "Değer",
      render: (row) => row.component?.value || "-"
    },
    {
      key: "req",
      header: "Gerekli",
      render: (row) => row.requiredQuantity
    },
    {
      key: "avail",
      header: "Mevcut",
      render: (row) => row.component?.quantityAvailable ?? "-"
    }
  ];

  const checkCols = [
    {
      key: "pn",
      header: "Part",
      render: (row) => row.part_number
    },
    {
      key: "req",
      header: "Gerekli",
      render: (row) => row.required_quantity
    },
    {
      key: "avail",
      header: "Mevcut",
      render: (row) => row.available_quantity
    },
    {
      key: "missing",
      header: "Eksik",
      render: (row) => row.missing_quantity
    },
    {
      key: "status",
      header: "Durum",
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Reel Manager - Project BOM"
        title={project?.name || "Proje"}
        description={project?.description || "BOM ve stok uygunluk merkezi."}
        actions={
          <>
            <button className="btn-ghost" onClick={checkStock}>
              Stok Kontrol
            </button>

            <button
              className="btn-primary"
              onClick={() =>
                downloadWithToken(endpoints.importExport.bomPdfUrl(id))
              }
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form onSubmit={add} className="page-card space-y-4 p-5">
          <h2 className="flex items-center gap-2 text-lg font-black">
            <Plus className="h-5 w-5" />
            BOM Item
          </h2>

          <select
            className="select"
            value={form.component_id}
            onChange={(event) =>
              setForm({
                ...form,
                component_id: event.target.value
              })
            }
          >
            <option value="">Komponent seç</option>

            {components.map((component) => (
              <option key={component.id} value={component.id}>
                {component.manufacturerPartNumber} - {component.value}
              </option>
            ))}
          </select>

          <input
            className="input"
            placeholder="R1, C1, U1"
            value={form.reference_designator}
            onChange={(event) =>
              setForm({
                ...form,
                reference_designator: event.target.value
              })
            }
          />

          <input
            className="input"
            type="number"
            min="1"
            value={form.required_quantity}
            onChange={(event) =>
              setForm({
                ...form,
                required_quantity: event.target.value
              })
            }
          />

          <textarea
            className="input min-h-24"
            placeholder="Not"
            value={form.notes}
            onChange={(event) =>
              setForm({
                ...form,
                notes: event.target.value
              })
            }
          />

          <button className="btn-primary w-full">
            BOM&apos;a Ekle
          </button>
        </form>

        <div className="space-y-6">
          <DataTable
            columns={cols}
            rows={project?.bomItems || []}
            loading={!project}
          />

          {check.length ? (
            <DataTable columns={checkCols} rows={check} />
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}