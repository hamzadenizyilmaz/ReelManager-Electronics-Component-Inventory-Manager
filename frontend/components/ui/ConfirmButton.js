"use client";

import { Trash2 } from "lucide-react";

export default function ConfirmButton({ onConfirm, label = "Sil", message = "Bu işlem geri alınamaz. Emin misin?" }) {
  return (
    <button type="button" className="btn-danger" onClick={() => { if (window.confirm(message)) onConfirm?.(); }}>
      <Trash2 className="h-4 w-4" /> {label}
    </button>
  );
}
